BEGIN;

REVOKE ALL ON SCHEMA ct_app FROM PUBLIC;
REVOKE ALL ON SCHEMA ct_audit FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA ct_app FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA ct_audit FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA ct_app FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA ct_audit FROM PUBLIC;

CREATE OR REPLACE FUNCTION ct_app.current_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
    SELECT NULLIF(current_setting('app.current_organization_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION ct_app.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
    SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$;

-- Não usar esta função em policies da própria organization_memberships,
-- para evitar recursão de RLS.
CREATE OR REPLACE FUNCTION ct_app.current_role_name()
RETURNS text
LANGUAGE sql
STABLE
AS $$
    SELECT m.role_name
      FROM ct_app.organization_memberships AS m
     WHERE m.organization_id = ct_app.current_organization_id()
       AND m.user_id = ct_app.current_user_id()
     LIMIT 1;
$$;

-- A API define estes valores dentro de cada transação APENAS depois
-- de autenticar o utilizador e validar a respetiva organização.
-- SET LOCAL app.current_user_id = '<uuid-validado>';
-- SET LOCAL app.current_organization_id = '<uuid-validado>';
-- SET LOCAL app.request_id = '<correlation-id>';

ALTER TABLE ct_app.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ct_app.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE ct_app.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ct_app.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ct_app.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ct_app.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ct_app.work_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ct_app.document_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE ct_audit.audit_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE ct_app.organizations FORCE ROW LEVEL SECURITY;
ALTER TABLE ct_app.organization_memberships FORCE ROW LEVEL SECURITY;
ALTER TABLE ct_app.app_users FORCE ROW LEVEL SECURITY;
ALTER TABLE ct_app.leads FORCE ROW LEVEL SECURITY;
ALTER TABLE ct_app.clients FORCE ROW LEVEL SECURITY;
ALTER TABLE ct_app.client_contacts FORCE ROW LEVEL SECURITY;
ALTER TABLE ct_app.work_items FORCE ROW LEVEL SECURITY;
ALTER TABLE ct_app.document_metadata FORCE ROW LEVEL SECURITY;
ALTER TABLE ct_audit.audit_events FORCE ROW LEVEL SECURITY;

-- ORGANIZAÇÃO: membros podem consultar; apenas owner pode alterar.
CREATE POLICY organizations_read
ON ct_app.organizations
FOR SELECT
USING (
    id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IS NOT NULL
);

-- Política de bootstrap: só produz efeito para contas SQL que tenham
-- privilégio INSERT explícito. O role runtime definido no projeto NÃO recebe esse privilégio.
CREATE POLICY organizations_bootstrap_insert
ON ct_app.organizations
FOR INSERT
WITH CHECK (
    id = ct_app.current_organization_id()
    AND ct_app.current_user_id() IS NOT NULL
);

CREATE POLICY organizations_owner_update
ON ct_app.organizations
FOR UPDATE
USING (
    id = ct_app.current_organization_id()
    AND ct_app.current_role_name() = 'owner'
)
WITH CHECK (
    id = ct_app.current_organization_id()
    AND ct_app.current_role_name() = 'owner'
);

-- MEMBERSHIPS: leitura limitada à organização. Alterações correntes de
-- memberships ficam fora do runtime normal.
CREATE POLICY memberships_read
ON ct_app.organization_memberships
FOR SELECT
USING (organization_id = ct_app.current_organization_id());

-- Bootstrap do primeiro owner. Tal como acima, a policy não concede privilégios SQL.
CREATE POLICY memberships_bootstrap_insert
ON ct_app.organization_memberships
FOR INSERT
WITH CHECK (
    organization_id = ct_app.current_organization_id()
    AND user_id = ct_app.current_user_id()
    AND role_name = 'owner'
);

-- UTILIZADOR: acesso apenas ao próprio perfil aplicacional.
CREATE POLICY app_users_self
ON ct_app.app_users
FOR ALL
USING (id = ct_app.current_user_id())
WITH CHECK (id = ct_app.current_user_id());

-- LEADS: leitura para equipa funcional; escrita sem read_only/technical.
CREATE POLICY leads_read
ON ct_app.leads
FOR SELECT
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant','read_only')
);

CREATE POLICY leads_write
ON ct_app.leads
FOR ALL
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
)
WITH CHECK (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
);

CREATE POLICY clients_read
ON ct_app.clients
FOR SELECT
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant','read_only')
);

CREATE POLICY clients_write
ON ct_app.clients
FOR ALL
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
)
WITH CHECK (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
);

CREATE POLICY client_contacts_read
ON ct_app.client_contacts
FOR SELECT
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant','read_only')
);

CREATE POLICY client_contacts_write
ON ct_app.client_contacts
FOR ALL
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
)
WITH CHECK (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
);

CREATE POLICY work_items_read
ON ct_app.work_items
FOR SELECT
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant','read_only')
);

CREATE POLICY work_items_write
ON ct_app.work_items
FOR ALL
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
)
WITH CHECK (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
);

CREATE POLICY document_metadata_read
ON ct_app.document_metadata
FOR SELECT
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant','read_only')
);

CREATE POLICY document_metadata_write
ON ct_app.document_metadata
FOR ALL
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
)
WITH CHECK (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
);

CREATE POLICY audit_events_select_context
ON ct_audit.audit_events
FOR SELECT
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','technical')
);

-- Necessária para o trigger SECURITY DEFINER sob FORCE RLS.
-- A conta runtime não deve receber INSERT direto nesta tabela.
CREATE POLICY audit_events_insert_context
ON ct_audit.audit_events
FOR INSERT
WITH CHECK (
    organization_id = ct_app.current_organization_id()
    AND (
        actor_user_id = ct_app.current_user_id()
        OR actor_user_id IS NULL
    )
);

COMMIT;

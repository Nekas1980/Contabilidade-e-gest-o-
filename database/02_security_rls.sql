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

-- A API deve definir estes valores dentro de cada transação APENAS depois
-- de autenticar o utilizador e validar a respetiva organização.
-- Exemplo no backend:
-- SET LOCAL app.current_user_id = '<uuid-validado>';
-- SET LOCAL app.current_organization_id = '<uuid-validado>';

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

CREATE POLICY organizations_isolation
ON ct_app.organizations
USING (id = ct_app.current_organization_id())
WITH CHECK (id = ct_app.current_organization_id());

CREATE POLICY memberships_isolation
ON ct_app.organization_memberships
USING (organization_id = ct_app.current_organization_id())
WITH CHECK (organization_id = ct_app.current_organization_id());

CREATE POLICY app_users_self
ON ct_app.app_users
USING (id = ct_app.current_user_id())
WITH CHECK (id = ct_app.current_user_id());

CREATE POLICY leads_isolation
ON ct_app.leads
USING (organization_id = ct_app.current_organization_id())
WITH CHECK (organization_id = ct_app.current_organization_id());

CREATE POLICY clients_isolation
ON ct_app.clients
USING (organization_id = ct_app.current_organization_id())
WITH CHECK (organization_id = ct_app.current_organization_id());

CREATE POLICY client_contacts_isolation
ON ct_app.client_contacts
USING (organization_id = ct_app.current_organization_id())
WITH CHECK (organization_id = ct_app.current_organization_id());

CREATE POLICY work_items_isolation
ON ct_app.work_items
USING (organization_id = ct_app.current_organization_id())
WITH CHECK (organization_id = ct_app.current_organization_id());

CREATE POLICY document_metadata_isolation
ON ct_app.document_metadata
USING (organization_id = ct_app.current_organization_id())
WITH CHECK (organization_id = ct_app.current_organization_id());

CREATE POLICY audit_events_isolation
ON ct_audit.audit_events
FOR SELECT
USING (organization_id = ct_app.current_organization_id());

COMMIT;

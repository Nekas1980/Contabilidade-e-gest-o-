-- Módulo interno de ficha fiscal por cliente.
-- Executar depois de 01_schema.sql, 02_security_rls.sql, 03_audit.sql e 05_runtime_permissions.sql.
-- Nunca guardar passwords, códigos 2FA, CMD, tokens ou credenciais dos portais oficiais.

BEGIN;

CREATE TABLE ct_app.client_fiscal_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES ct_app.organizations(id) ON DELETE RESTRICT,
    client_id uuid NOT NULL REFERENCES ct_app.clients(id) ON DELETE CASCADE,
    tax_country char(2) NOT NULL DEFAULT 'PT',
    tax_identifier text,
    legal_form text,
    primary_cae_code text,
    secondary_cae_codes text[] NOT NULL DEFAULT '{}',
    entity_size text CHECK (entity_size IN ('micro','small','medium','large','other')),
    accounting_framework text CHECK (accounting_framework IN ('snc_micro','snc_pe','snc_general','ias_ifrs','other')),
    vat_status text CHECK (vat_status IN ('normal','exempt_article_53','exempt_other','mixed','other')),
    vat_periodicity text CHECK (vat_periodicity IN ('monthly','quarterly','none','other')),
    irc_status text CHECK (irc_status IN ('general','transparency','exempt','other')),
    has_employees boolean NOT NULL DEFAULT false,
    social_security_employer_number text,
    tax_office_code text,
    activity_start_date date,
    activity_end_date date,
    fiscal_year_end_month smallint CHECK (fiscal_year_end_month BETWEEN 1 AND 12),
    certified_pme boolean,
    notes text,
    reviewed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (organization_id, client_id),
    CONSTRAINT ck_client_fiscal_profiles_tax_identifier_pt
      CHECK (tax_country <> 'PT' OR tax_identifier IS NULL OR tax_identifier ~ '^[0-9]{9}$')
);

CREATE INDEX ix_client_fiscal_profiles_org_client
    ON ct_app.client_fiscal_profiles (organization_id, client_id);

CREATE TABLE ct_app.client_obligations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES ct_app.organizations(id) ON DELETE RESTRICT,
    client_id uuid NOT NULL REFERENCES ct_app.clients(id) ON DELETE CASCADE,
    obligation_code text,
    category text NOT NULL CHECK (category IN ('irc','iva','faturacao','trabalho','seguranca_social','contabilidade','outra')),
    authority text NOT NULL CHECK (authority IN ('AT','SEGURANCA_SOCIAL','IRN','OUTRA')),
    title text NOT NULL,
    frequency text CHECK (frequency IN ('monthly','quarterly','annual','event_driven','other')),
    due_rule text,
    next_due_date date,
    requires_payment boolean NOT NULL DEFAULT false,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','completed','suspended','not_applicable')),
    legal_basis text,
    official_url text,
    last_verified_on date,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_client_obligations_org_client_due
    ON ct_app.client_obligations (organization_id, client_id, status, next_due_date);

CREATE TABLE ct_app.client_legal_references (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES ct_app.organizations(id) ON DELETE RESTRICT,
    client_id uuid NOT NULL REFERENCES ct_app.clients(id) ON DELETE CASCADE,
    title text NOT NULL,
    citation text,
    official_url text NOT NULL,
    topic text,
    effective_from date,
    effective_to date,
    last_verified_on date NOT NULL DEFAULT CURRENT_DATE,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_client_legal_references_org_client
    ON ct_app.client_legal_references (organization_id, client_id, topic, last_verified_on DESC);

CREATE TRIGGER trg_client_fiscal_profiles_updated_at
BEFORE UPDATE ON ct_app.client_fiscal_profiles
FOR EACH ROW EXECUTE FUNCTION ct_app.set_updated_at();

CREATE TRIGGER trg_client_obligations_updated_at
BEFORE UPDATE ON ct_app.client_obligations
FOR EACH ROW EXECUTE FUNCTION ct_app.set_updated_at();

CREATE TRIGGER trg_client_legal_references_updated_at
BEFORE UPDATE ON ct_app.client_legal_references
FOR EACH ROW EXECUTE FUNCTION ct_app.set_updated_at();

ALTER TABLE ct_app.client_fiscal_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ct_app.client_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ct_app.client_legal_references ENABLE ROW LEVEL SECURITY;

ALTER TABLE ct_app.client_fiscal_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE ct_app.client_obligations FORCE ROW LEVEL SECURITY;
ALTER TABLE ct_app.client_legal_references FORCE ROW LEVEL SECURITY;

CREATE POLICY client_fiscal_profiles_read
ON ct_app.client_fiscal_profiles
FOR SELECT
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant','read_only')
);

CREATE POLICY client_fiscal_profiles_write
ON ct_app.client_fiscal_profiles
FOR ALL
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
)
WITH CHECK (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
);

CREATE POLICY client_obligations_read
ON ct_app.client_obligations
FOR SELECT
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant','read_only')
);

CREATE POLICY client_obligations_write
ON ct_app.client_obligations
FOR ALL
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
)
WITH CHECK (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
);

CREATE POLICY client_legal_references_read
ON ct_app.client_legal_references
FOR SELECT
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant','read_only')
);

CREATE POLICY client_legal_references_write
ON ct_app.client_legal_references
FOR ALL
USING (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
)
WITH CHECK (
    organization_id = ct_app.current_organization_id()
    AND ct_app.current_role_name() IN ('owner','accountant','assistant')
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ct_app.client_fiscal_profiles TO ct_app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ct_app.client_obligations TO ct_app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ct_app.client_legal_references TO ct_app_runtime;

CREATE TRIGGER trg_audit_client_fiscal_profiles
AFTER INSERT OR UPDATE OR DELETE ON ct_app.client_fiscal_profiles
FOR EACH ROW EXECUTE FUNCTION ct_audit.log_row_change();

CREATE TRIGGER trg_audit_client_obligations
AFTER INSERT OR UPDATE OR DELETE ON ct_app.client_obligations
FOR EACH ROW EXECUTE FUNCTION ct_audit.log_row_change();

CREATE TRIGGER trg_audit_client_legal_references
AFTER INSERT OR UPDATE OR DELETE ON ct_app.client_legal_references
FOR EACH ROW EXECUTE FUNCTION ct_audit.log_row_change();

COMMIT;

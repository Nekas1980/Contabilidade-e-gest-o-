BEGIN;

CREATE SCHEMA IF NOT EXISTS ct_app;
CREATE SCHEMA IF NOT EXISTS ct_audit;

CREATE TABLE ct_app.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name text NOT NULL,
    legal_name text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ct_app.app_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_subject text NOT NULL UNIQUE,
    email text NOT NULL,
    full_name text NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    last_login_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ck_app_users_email_normalized CHECK (email = lower(email))
);

CREATE UNIQUE INDEX uq_app_users_email_lower
    ON ct_app.app_users (lower(email));

CREATE TABLE ct_app.organization_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES ct_app.organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES ct_app.app_users(id) ON DELETE CASCADE,
    role_name text NOT NULL CHECK (role_name IN ('owner','accountant','assistant','technical','read_only')),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (organization_id, user_id)
);

CREATE TABLE ct_app.leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES ct_app.organizations(id) ON DELETE RESTRICT,
    name text NOT NULL,
    email text,
    phone text,
    company_name text,
    service_interest text,
    message text,
    source text NOT NULL DEFAULT 'website',
    status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','archived')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_leads_org_status_created
    ON ct_app.leads (organization_id, status, created_at DESC);

CREATE TABLE ct_app.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES ct_app.organizations(id) ON DELETE RESTRICT,
    client_code text NOT NULL,
    display_name text NOT NULL,
    client_type text NOT NULL CHECK (client_type IN ('individual','sole_trader','company','other')),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('prospect','active','inactive','archived')),
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (organization_id, client_code)
);

CREATE INDEX ix_clients_org_status
    ON ct_app.clients (organization_id, status);

CREATE TABLE ct_app.client_contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES ct_app.organizations(id) ON DELETE RESTRICT,
    client_id uuid NOT NULL REFERENCES ct_app.clients(id) ON DELETE CASCADE,
    contact_type text NOT NULL CHECK (contact_type IN ('email','phone','other')),
    contact_value text NOT NULL,
    is_primary boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_client_contacts_client
    ON ct_app.client_contacts (organization_id, client_id);

CREATE TABLE ct_app.work_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES ct_app.organizations(id) ON DELETE RESTRICT,
    client_id uuid REFERENCES ct_app.clients(id) ON DELETE RESTRICT,
    assigned_to uuid REFERENCES ct_app.app_users(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','waiting','completed','cancelled')),
    priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
    due_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_work_items_org_status_due
    ON ct_app.work_items (organization_id, status, due_at);

CREATE TABLE ct_app.document_metadata (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES ct_app.organizations(id) ON DELETE RESTRICT,
    client_id uuid REFERENCES ct_app.clients(id) ON DELETE RESTRICT,
    uploaded_by uuid REFERENCES ct_app.app_users(id) ON DELETE SET NULL,
    original_name text NOT NULL,
    storage_key text NOT NULL UNIQUE,
    mime_type text NOT NULL,
    size_bytes bigint NOT NULL CHECK (size_bytes >= 0),
    sha256_hex char(64),
    classification text NOT NULL DEFAULT 'internal' CHECK (classification IN ('public','internal','confidential','restricted')),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_document_metadata_org_client
    ON ct_app.document_metadata (organization_id, client_id, created_at DESC);

CREATE TABLE ct_audit.audit_events (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    occurred_at timestamptz NOT NULL DEFAULT now(),
    organization_id uuid,
    actor_user_id uuid,
    action text NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE','LOGIN','LOGOUT','ACCESS_DENIED','EXPORT')),
    table_name text,
    record_id text,
    request_id text,
    details jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX ix_audit_events_org_time
    ON ct_audit.audit_events (organization_id, occurred_at DESC);

CREATE INDEX ix_audit_events_actor_time
    ON ct_audit.audit_events (actor_user_id, occurred_at DESC);

CREATE OR REPLACE FUNCTION ct_app.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON ct_app.organizations
FOR EACH ROW EXECUTE FUNCTION ct_app.set_updated_at();

CREATE TRIGGER trg_app_users_updated_at
BEFORE UPDATE ON ct_app.app_users
FOR EACH ROW EXECUTE FUNCTION ct_app.set_updated_at();

CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON ct_app.leads
FOR EACH ROW EXECUTE FUNCTION ct_app.set_updated_at();

CREATE TRIGGER trg_clients_updated_at
BEFORE UPDATE ON ct_app.clients
FOR EACH ROW EXECUTE FUNCTION ct_app.set_updated_at();

CREATE TRIGGER trg_work_items_updated_at
BEFORE UPDATE ON ct_app.work_items
FOR EACH ROW EXECUTE FUNCTION ct_app.set_updated_at();

COMMIT;

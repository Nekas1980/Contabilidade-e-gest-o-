BEGIN;

CREATE OR REPLACE FUNCTION ct_audit.log_row_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, ct_app, ct_audit
AS $$
DECLARE
    row_data jsonb;
    org_id uuid;
    actor_id uuid;
    record_identifier text;
    changed_columns jsonb := '[]'::jsonb;
BEGIN
    IF TG_OP = 'DELETE' THEN
        row_data := to_jsonb(OLD);
    ELSE
        row_data := to_jsonb(NEW);
    END IF;

    org_id := COALESCE(
        NULLIF(row_data ->> 'organization_id', '')::uuid,
        ct_app.current_organization_id()
    );

    actor_id := ct_app.current_user_id();
    record_identifier := row_data ->> 'id';

    IF TG_OP = 'UPDATE' THEN
        SELECT COALESCE(jsonb_agg(key ORDER BY key), '[]'::jsonb)
          INTO changed_columns
          FROM jsonb_each(to_jsonb(NEW)) AS n(key, value)
         WHERE (to_jsonb(OLD) -> key) IS DISTINCT FROM value;
    END IF;

    INSERT INTO ct_audit.audit_events (
        organization_id,
        actor_user_id,
        action,
        table_name,
        record_id,
        request_id,
        details
    )
    VALUES (
        org_id,
        actor_id,
        TG_OP,
        TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
        record_identifier,
        NULLIF(current_setting('app.request_id', true), ''),
        jsonb_build_object('changed_columns', changed_columns)
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION ct_audit.log_row_change() FROM PUBLIC;

CREATE TRIGGER audit_organization_memberships
AFTER INSERT OR UPDATE OR DELETE ON ct_app.organization_memberships
FOR EACH ROW EXECUTE FUNCTION ct_audit.log_row_change();

CREATE TRIGGER audit_leads
AFTER INSERT OR UPDATE OR DELETE ON ct_app.leads
FOR EACH ROW EXECUTE FUNCTION ct_audit.log_row_change();

CREATE TRIGGER audit_clients
AFTER INSERT OR UPDATE OR DELETE ON ct_app.clients
FOR EACH ROW EXECUTE FUNCTION ct_audit.log_row_change();

CREATE TRIGGER audit_client_contacts
AFTER INSERT OR UPDATE OR DELETE ON ct_app.client_contacts
FOR EACH ROW EXECUTE FUNCTION ct_audit.log_row_change();

CREATE TRIGGER audit_work_items
AFTER INSERT OR UPDATE OR DELETE ON ct_app.work_items
FOR EACH ROW EXECUTE FUNCTION ct_audit.log_row_change();

CREATE TRIGGER audit_document_metadata
AFTER INSERT OR UPDATE OR DELETE ON ct_app.document_metadata
FOR EACH ROW EXECUTE FUNCTION ct_audit.log_row_change();

COMMIT;

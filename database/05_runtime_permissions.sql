-- Executar com uma conta administrativa/migration role que possa criar roles.
-- Não definir passwords neste ficheiro nem versionar credenciais.

BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ct_app_runtime') THEN
        CREATE ROLE ct_app_runtime NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
    END IF;
END
$$;

GRANT USAGE ON SCHEMA ct_app TO ct_app_runtime;
GRANT USAGE ON SCHEMA ct_audit TO ct_app_runtime;

-- Perfil e contexto organizacional.
GRANT SELECT, UPDATE ON ct_app.organizations TO ct_app_runtime;
GRANT SELECT ON ct_app.organization_memberships TO ct_app_runtime;
GRANT SELECT, UPDATE ON ct_app.app_users TO ct_app_runtime;

-- Dados funcionais. RLS decide quais linhas/operações são autorizadas por utilizador.
GRANT SELECT, INSERT, UPDATE, DELETE ON ct_app.leads TO ct_app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ct_app.clients TO ct_app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ct_app.client_contacts TO ct_app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ct_app.work_items TO ct_app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ct_app.document_metadata TO ct_app_runtime;

-- Auditoria: runtime consulta apenas quando RLS permite. Não recebe INSERT direto.
GRANT SELECT ON ct_audit.audit_events TO ct_app_runtime;

GRANT EXECUTE ON FUNCTION ct_app.current_organization_id() TO ct_app_runtime;
GRANT EXECUTE ON FUNCTION ct_app.current_user_id() TO ct_app_runtime;
GRANT EXECUTE ON FUNCTION ct_app.current_role_name() TO ct_app_runtime;

-- A função de auditoria é chamada pelos triggers; não é exposta como API SQL pública.
REVOKE EXECUTE ON FUNCTION ct_audit.log_row_change() FROM ct_app_runtime;

COMMIT;

-- A identidade LOGIN efetivamente usada pelo backend deve ser criada/provisionada
-- fora do repositório e receber apenas:
-- GRANT ct_app_runtime TO <backend_login_role>;
--
-- A password/certificado/token dessa identidade deve residir num secret manager
-- ou mecanismo de configuração protegido, nunca neste repositório.

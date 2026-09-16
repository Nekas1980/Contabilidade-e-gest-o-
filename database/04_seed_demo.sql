-- APENAS PARA DESENVOLVIMENTO/ESTUDO.
-- Todos os dados abaixo são fictícios. Não substituir por dados reais num repositório público.

BEGIN;

SELECT set_config('app.current_organization_id', '11111111-1111-4111-8111-111111111111', true);
SELECT set_config('app.current_user_id', '22222222-2222-4222-8222-222222222222', true);
SELECT set_config('app.request_id', 'seed-demo-001', true);

INSERT INTO ct_app.organizations (id, display_name, legal_name)
VALUES (
    '11111111-1111-4111-8111-111111111111',
    'CT Demo',
    'CT Contabilidade Demo'
);

INSERT INTO ct_app.app_users (id, auth_subject, email, full_name)
VALUES (
    '22222222-2222-4222-8222-222222222222',
    'demo|portfolio-user',
    'demo@example.invalid',
    'Utilizador Demo'
);

INSERT INTO ct_app.organization_memberships (organization_id, user_id, role_name)
VALUES (
    '11111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222222',
    'owner'
);

INSERT INTO ct_app.leads (
    organization_id,
    name,
    email,
    company_name,
    service_interest,
    message
)
VALUES (
    '11111111-1111-4111-8111-111111111111',
    'Cliente Fictício',
    'cliente.demo@example.invalid',
    'Empresa Exemplo, Lda.',
    'Contabilidade e obrigações correntes',
    'Pedido fictício criado exclusivamente para testar o sistema.'
);

INSERT INTO ct_app.clients (
    id,
    organization_id,
    client_code,
    display_name,
    client_type,
    status
)
VALUES (
    '33333333-3333-4333-8333-333333333333',
    '11111111-1111-4111-8111-111111111111',
    'DEMO-001',
    'Empresa Demonstração',
    'company',
    'active'
);

INSERT INTO ct_app.client_contacts (
    organization_id,
    client_id,
    contact_type,
    contact_value,
    is_primary
)
VALUES (
    '11111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    'email',
    'empresa.demo@example.invalid',
    true
);

INSERT INTO ct_app.work_items (
    organization_id,
    client_id,
    assigned_to,
    title,
    description,
    priority
)
VALUES (
    '11111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    '22222222-2222-4222-8222-222222222222',
    'Validar documentação de demonstração',
    'Tarefa fictícia para testar workflow, auditoria e isolamento por organização.',
    'normal'
);

COMMIT;

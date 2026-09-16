# Base de Dados — CT Contabilidade e Gestão

## Objetivo

Esta pasta inicia a evolução do projeto para uma aplicação com backend e PostgreSQL, mantendo a segurança e a aprendizagem como requisitos de primeira classe.

A base de dados NÃO deve ser ligada diretamente ao website público.

## Arquitetura prevista

```text
Browser / Frontend
        |
      HTTPS
        |
   Backend / API
   - autenticação
   - autorização
   - validação
   - rate limiting
   - contexto de utilizador/organização
        |
   ligação privada / TLS
        |
     PostgreSQL
   - schema ct_app
   - schema ct_audit
   - RLS
   - constraints
   - auditoria
```

## Regra crítica

Nunca colocar no HTML/JavaScript do browser:

- utilizador/password da base de dados;
- connection string;
- API keys privadas;
- JWT signing secrets;
- chaves de cifragem;
- credenciais de produção.

O frontend comunica com uma API. Só a API comunica com PostgreSQL.

## Ficheiros

1. `01_schema.sql` — schemas, tabelas, constraints, índices e triggers `updated_at`.
2. `02_security_rls.sql` — isolamento por organização através de Row-Level Security.
3. `03_audit.sql` — auditoria de alterações sem duplicar automaticamente os dados dos registos.
4. `04_seed_demo.sql` — dados exclusivamente fictícios para desenvolvimento e estudo.

## Modelo inicial

### `ct_app.organizations`
Entidades/organizações que utilizam a aplicação. Permite que a arquitetura esteja preparada para mais do que uma organização sem misturar dados.

### `ct_app.app_users`
Identidade aplicacional. O campo `auth_subject` destina-se a ligar o utilizador a um sistema de autenticação. Não existe coluna de password.

### `ct_app.organization_memberships`
Associa utilizadores a organizações e a um perfil funcional.

Perfis iniciais:

- `owner`
- `accountant`
- `assistant`
- `technical`
- `read_only`

A existência do perfil na BD não substitui autorização na API. São controlos complementares.

### `ct_app.leads`
Pedidos/contactos comerciais estruturados.

### `ct_app.clients`
Registo mínimo de clientes. Nesta fase não contém NIF, IBAN, dados fiscais detalhados ou outros dados de risco elevado.

### `ct_app.client_contacts`
Canais de contacto associados a clientes.

### `ct_app.work_items`
Tarefas e acompanhamento operacional.

### `ct_app.document_metadata`
Metadados de documentos. O desenho assume que ficheiros reais, caso venham a existir, ficam em armazenamento privado apropriado e não dentro do repositório Git.

### `ct_audit.audit_events`
Registo técnico de eventos e alterações.

## Segurança implementada no desenho

- schemas próprios, sem usar `public` para os dados da aplicação;
- UUIDs como identificadores funcionais;
- `NOT NULL`, `CHECK`, `UNIQUE` e foreign keys;
- índices orientados às consultas previstas;
- Row-Level Security;
- `FORCE ROW LEVEL SECURITY`;
- contexto por organização e utilizador;
- revogação de acesso público aos schemas/tabelas/funções;
- auditoria de INSERT/UPDATE/DELETE;
- logs sem cópia integral do conteúdo dos registos;
- dados de demonstração falsos;
- nenhuma password ou segredo no SQL versionado.

## Contexto de segurança da API

Depois de autenticar e autorizar o utilizador, cada transação da API deverá definir localmente:

```sql
SET LOCAL app.current_user_id = '<UUID validado pela API>';
SET LOCAL app.current_organization_id = '<UUID validado pela API>';
SET LOCAL app.request_id = '<ID de correlação>';
```

Estes valores nunca devem ser aceites diretamente de um formulário sem validação/autorização no backend.

## Ordem de execução para laboratório

Numa base de dados vazia de desenvolvimento:

```text
01_schema.sql
02_security_rls.sql
03_audit.sql
04_seed_demo.sql
```

Antes de executar, fazer revisão do SQL. Em produção devem ser usadas migrations controladas e backups testados.

## Dados reais

Enquanto esta arquitetura não tiver backend, autenticação, gestão de segredos, backups, controlo operacional e revisão de privacidade, utilizar apenas dados sintéticos.

Não colocar no GitHub:

- nomes reais de clientes;
- NIF;
- moradas privadas;
- IBAN;
- documentos contabilísticos;
- passwords;
- tokens;
- chaves privadas;
- dumps de produção.

## Próxima etapa técnica

Criar uma API separada com:

- autenticação;
- RBAC;
- validação de input;
- queries parametrizadas;
- transações;
- configuração de RLS por request;
- tratamento centralizado de erros;
- logging seguro;
- rate limiting;
- testes de autorização e isolamento.

A API será o único caminho permitido entre o frontend e a base de dados.

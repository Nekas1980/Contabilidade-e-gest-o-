# PROJECT STATUS — CT Contabilidade e Gestão

Última atualização: 16 de setembro de 2026.

## Estado

**Fase:** redesign profissional + fundação de backend/base de dados em desenvolvimento.

**Branch:** `redesign-profissional`

**Objetivo:** preparar um website institucional para utilização real por uma profissional de contabilidade e, em paralelo, evoluir o projeto para um laboratório profissional de desenvolvimento, PostgreSQL e segurança.

## Website — concluído na branch

- [x] Análise da versão inicial.
- [x] Separação entre versão estável (`main`) e desenvolvimento (`redesign-profissional`).
- [x] Novo layout institucional.
- [x] Design responsivo e navegação mobile.
- [x] Secções de serviços, acompanhamento, público e FAQ.
- [x] Contacto por WhatsApp e e-mail.
- [x] Formulário local que prepara mensagem para WhatsApp.
- [x] SEO/Open Graph/Schema.org básicos.
- [x] Elementos de acessibilidade.
- [x] Documentação de arquitetura, estudo, CV/portefólio e publicação.
- [x] Pull Request criado para revisão.

## Base de dados segura — fundação criada

- [x] Definição da arquitetura `Frontend -> API -> PostgreSQL`.
- [x] Criação do schema `ct_app`.
- [x] Criação do schema separado `ct_audit`.
- [x] Modelo inicial de organizações e utilizadores.
- [x] Memberships e perfis: owner/accountant/assistant/technical/read_only.
- [x] Leads/contactos comerciais.
- [x] Clientes com modelo mínimo e sem dados fiscais de risco elevado nesta fase.
- [x] Contactos de cliente.
- [x] Tarefas/work items.
- [x] Metadados documentais.
- [x] Constraints, foreign keys e índices.
- [x] Triggers de `updated_at`.
- [x] Row-Level Security por organização.
- [x] Regras RLS adicionais por perfil funcional.
- [x] Separação do perfil técnico dos dados de clientes.
- [x] Auditoria de INSERT/UPDATE/DELETE.
- [x] Auditoria sem cópia automática do conteúdo integral dos registos.
- [x] Role de runtime com least privilege e sem `BYPASSRLS`.
- [x] Dados fictícios de demonstração.
- [x] `.gitignore` para segredos, chaves, dumps e backups.
- [x] Manual `docs/08_BASE_DADOS_E_SEGURANCA.md`.

## Base de dados — ainda por testar/executar

- [ ] Criar PostgreSQL exclusivo de laboratório.
- [ ] Executar scripts por ordem e validar transações.
- [ ] Testar constraints e foreign keys.
- [ ] Testar RLS com duas organizações fictícias.
- [ ] Testar perfis `owner`, `accountant`, `assistant`, `technical` e `read_only`.
- [ ] Confirmar que `technical` não consulta clientes/documentos.
- [ ] Testar auditoria em INSERT/UPDATE/DELETE.
- [ ] Testar role `ct_app_runtime` sem privilégios administrativos.
- [ ] Criar testes automatizados de isolamento.

## Próxima fase técnica

Construir uma API entre o frontend e PostgreSQL.

Requisitos mínimos:

- autenticação;
- autorização/RBAC;
- queries parametrizadas;
- validação server-side;
- transações;
- configuração de contexto RLS por request;
- gestão de segredos;
- logging seguro;
- rate limiting;
- tratamento de erros sem fuga de informação;
- testes de integração e autorização.

## A validar com a contabilista

- [ ] Nome/denominação final a apresentar.
- [ ] Nome da profissional responsável.
- [ ] Contactos definitivos.
- [ ] Morada profissional, se for publicada.
- [ ] Serviços efetivamente prestados.
- [ ] Qualidade profissional e forma de a apresentar.
- [ ] Número profissional, se aplicável e se deva ser divulgado.
- [ ] Área geográfica de atendimento.
- [ ] Conteúdo que poderá futuramente justificar armazenamento de dados.
- [ ] Fluxos reais de trabalho que possam ser digitalizados.

## Regra para dados reais

Até existir backend testado, autenticação, gestão segura de segredos, backups, política de acessos e validação de privacidade, a base de dados serve **apenas para laboratório com dados sintéticos**.

Não usar dados reais de clientes no repositório, seeds, dumps ou testes públicos.

## Antes do merge para `main`

O website público e a arquitetura de aplicação têm ciclos diferentes. O merge do redesign do site não implica ativar backend/base de dados.

Antes da publicação do website:

- [ ] Validar conteúdo com a contabilista.
- [ ] Testar smartphone e desktop.
- [ ] Testar Firefox/Chromium.
- [ ] Testar formulário e links.
- [ ] Rever ortografia PT-PT.
- [ ] Definir dados profissionais definitivos.
- [ ] Decidir domínio final.
- [ ] Preparar política de privacidade adequada ao funcionamento real.

## Papel do projeto no portefólio

Passa a demonstrar:

- desenvolvimento frontend;
- análise de requisitos;
- UX e responsividade;
- PostgreSQL e modelação relacional;
- SQL e PL/pgSQL;
- constraints, índices e triggers;
- RBAC;
- Row-Level Security;
- auditoria;
- least privilege;
- security/privacy by design;
- threat modeling inicial;
- Git/GitHub e Pull Requests;
- documentação técnica;
- evolução controlada de um projeto para utilização real.

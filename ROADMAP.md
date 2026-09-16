# ROADMAP — CT Contabilidade e Gestão

## Fase 1 — Base profissional do website

Estado: **concluída na branch `redesign-profissional`**

- redesign institucional;
- responsive design;
- serviços e acompanhamento;
- FAQ;
- contacto por WhatsApp/e-mail;
- formulário local;
- SEO e acessibilidade básicos;
- documentação técnica.

## Fase 2 — Validação com a contabilista

Estado: **pendente**

- validar marca, nome e serviços;
- validar contactos e FAQ;
- confirmar dados profissionais;
- confirmar área geográfica/forma de atendimento;
- recolher eventual identidade visual autorizada;
- identificar fluxos reais que possam beneficiar de digitalização.

## Fase 3 — Publicação profissional

Estado: **planeada**

- domínio próprio;
- DNS/HTTPS;
- alojamento;
- favicon e Open Graph final;
- sitemap;
- eventual e-mail profissional;
- informação de privacidade final.

## Fase 4 — PostgreSQL seguro

Estado: **fundação criada; testes pendentes**

Implementado no repositório:

- schemas `ct_app` e `ct_audit`;
- organizações/utilizadores/memberships;
- perfis funcionais;
- leads, clientes, contactos, tarefas e metadados documentais;
- constraints e índices;
- Row-Level Security;
- isolamento por organização;
- políticas por perfil;
- auditoria;
- role runtime com least privilege;
- seed exclusivamente fictício;
- documentação de segurança.

A executar/testar:

- laboratório PostgreSQL dedicado;
- testes com duas organizações;
- testes de cada perfil;
- tentativas de acesso cruzado;
- testes de auditoria;
- testes de privilégios SQL;
- migrations reproduzíveis.

## Fase 5 — API segura

Estado: **próxima fase técnica**

Arquitetura:

```text
Frontend -> HTTPS -> API -> PostgreSQL
```

Requisitos:

- Node.js/TypeScript ou stack backend definida;
- pool PostgreSQL;
- queries parametrizadas;
- autenticação;
- RBAC;
- validação server-side;
- transações;
- contexto RLS por request;
- secret management;
- logging/correlation IDs;
- rate limiting;
- CORS restritivo;
- headers de segurança;
- tratamento seguro de erros;
- testes automatizados.

## Fase 6 — CRM / operação interna

Só avançar depois de existir API segura e requisitos reais validados.

Possibilidades:

- gestão de leads;
- clientes;
- tarefas;
- agenda;
- área interna;
- gestão documental privada;
- notificações;
- dashboards operacionais.

Dados fiscais/financeiros detalhados não devem ser adicionados apenas para tornar o projeto maior. Exigem requisitos, modelo de ameaça e validação profissional.

## Fase 7 — Segurança aplicada

Objetivo de portefólio em cibersegurança:

- threat model formal;
- matriz RBAC;
- testes Broken Access Control;
- SQL Injection tests;
- secret scanning;
- dependency scanning;
- headers/CSP;
- logs de segurança;
- backup + teste de restore;
- hardening PostgreSQL;
- CI com testes;
- documentação de incident response básica.

Usar OWASP ASVS/cheat sheets como referência de engenharia, não como alegação de certificação.

## Fase 8 — Métricas e evolução comercial

Depois da publicação e apenas com requisitos de privacidade definidos:

- métricas de utilização;
- conversões de contacto;
- origem do tráfego;
- melhoria contínua do conteúdo;
- automatizações úteis ao negócio.

## Princípio de evolução

Cada funcionalidade deve responder:

1. Que problema real resolve?
2. Que dados necessita?
3. Quem deve poder aceder?
4. Qual o risco de segurança/privacidade?
5. Qual o custo de manutenção?
6. Como será testada e auditada?

O objetivo é construir um produto profissional e um portefólio credível, não acumular funcionalidades sem controlo.

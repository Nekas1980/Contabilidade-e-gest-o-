# CT Contabilidade e Gestão

Projeto digital em evolução para utilização real por uma profissional da área de contabilidade e gestão e, em paralelo, caso de estudo/portefólio em desenvolvimento web, PostgreSQL e segurança aplicacional.

O projeto começou como um cartão de visita digital simples. Está a ser transformado, de forma incremental, numa presença online profissional e numa arquitetura preparada para futura operação interna segura.

## Estado atual

A nova versão encontra-se na branch:

```text
redesign-profissional
```

A branch `main` mantém a versão anterior até conclusão da revisão e validação do conteúdo com a contabilista.

Consulte:

- [`PROJECT_STATUS.md`](PROJECT_STATUS.md) — estado, concluído e pendente.
- [`ROADMAP.md`](ROADMAP.md) — evolução técnica e profissional.
- [`docs/01_ARQUITETURA_E_METODOS.md`](docs/01_ARQUITETURA_E_METODOS.md) — arquitetura e métodos do website.
- [`docs/02_GUIA_ESTUDO.md`](docs/02_GUIA_ESTUDO.md) — estudo do frontend.
- [`docs/03_CURRICULO_E_PORTFOLIO.md`](docs/03_CURRICULO_E_PORTFOLIO.md) — apresentação profissional do projeto.
- [`docs/04_PUBLICACAO_E_CONFORMIDADE.md`](docs/04_PUBLICACAO_E_CONFORMIDADE.md) — preparação para utilização real.
- [`docs/05_REFERENCIAS_PROFISSIONAIS.md`](docs/05_REFERENCIAS_PROFISSIONAIS.md) — referências profissionais.
- [`docs/06_DADOS_A_CONFIRMAR_COM_CONTABILISTA.md`](docs/06_DADOS_A_CONFIRMAR_COM_CONTABILISTA.md) — levantamento antes da publicação.
- [`docs/07_COLABORACAO_E_EVOLUCAO.md`](docs/07_COLABORACAO_E_EVOLUCAO.md) — colaboração negócio/tecnologia.
- [`docs/08_BASE_DADOS_E_SEGURANCA.md`](docs/08_BASE_DADOS_E_SEGURANCA.md) — manual PostgreSQL e segurança.
- [`database/README.md`](database/README.md) — arquitetura e scripts da base de dados.

## Arquitetura

### Website público atual

```text
Browser
  ├── index.html
  ├── assets/styles.css
  └── assets/app.js
```

O formulário público continua sem guardar dados numa base própria: prepara a mensagem localmente e abre o WhatsApp.

### Aplicação futura

```text
Frontend
   |
 HTTPS
   |
API / Backend
   |
PostgreSQL
   ├── ct_app
   └── ct_audit
```

**O frontend nunca liga diretamente ao PostgreSQL.**

## Website

Funcionalidades principais:

- layout institucional responsivo;
- navegação mobile;
- apresentação objetiva de serviços;
- processo de acompanhamento;
- público-alvo e FAQ;
- contacto por WhatsApp/e-mail;
- formulário local;
- SEO/Open Graph/Schema.org básicos;
- acessibilidade;
- `robots.txt`.

## Base de dados — fundação

A pasta `database/` contém uma primeira arquitetura PostgreSQL orientada a segurança e aprendizagem.

Inclui:

- schemas próprios `ct_app` e `ct_audit`;
- organizações e utilizadores;
- memberships/perfis;
- leads;
- clientes e contactos;
- tarefas;
- metadados documentais;
- constraints e índices;
- triggers;
- Row-Level Security;
- isolamento por organização;
- políticas por perfil;
- auditoria;
- role runtime com least privilege;
- dados fictícios para laboratório.

Perfis previstos:

```text
owner
accountant
assistant
technical
read_only
```

O perfil `technical` está deliberadamente separado do acesso normal aos dados funcionais de clientes.

## Segurança por desenho

Princípios aplicados:

- frontend sem segredos;
- PostgreSQL atrás de API;
- least privilege;
- RBAC;
- RLS;
- defesa em profundidade;
- separação de funções;
- auditoria;
- minimização de dados em logs;
- dados sintéticos no portefólio;
- `.gitignore` para `.env`, chaves, dumps, backups e artefactos locais;
- nenhuma password versionada.

A base de dados ainda não foi executada contra dados reais. Nesta fase é uma fundação versionada para laboratório e testes.

## Estrutura

```text
.
├── index.html
├── robots.txt
├── .gitignore
├── README.md
├── PROJECT_STATUS.md
├── ROADMAP.md
├── assets/
│   ├── app.js
│   └── styles.css
├── database/
│   ├── README.md
│   ├── 01_schema.sql
│   ├── 02_security_rls.sql
│   ├── 03_audit.sql
│   ├── 04_seed_demo.sql
│   └── 05_runtime_permissions.sql
└── docs/
    ├── 01_ARQUITETURA_E_METODOS.md
    ├── 02_GUIA_ESTUDO.md
    ├── 03_CURRICULO_E_PORTFOLIO.md
    ├── 04_PUBLICACAO_E_CONFORMIDADE.md
    ├── 05_REFERENCIAS_PROFISSIONAIS.md
    ├── 06_DADOS_A_CONFIRMAR_COM_CONTABILISTA.md
    ├── 07_COLABORACAO_E_EVOLUCAO.md
    └── 08_BASE_DADOS_E_SEGURANCA.md
```

## Stack atual / prevista

### Implementado

- HTML5
- CSS3
- JavaScript vanilla
- PostgreSQL SQL/PLpgSQL (scripts versionados)
- Git / GitHub

### Próxima fase

- API backend;
- autenticação;
- queries parametrizadas;
- RBAC no backend;
- contexto RLS por request;
- testes automatizados;
- gestão de segredos;
- logging e rate limiting.

## Dados reais

Até a camada backend e os controlos operacionais estarem implementados e testados, utilizar apenas dados sintéticos na base de laboratório.

Não colocar no repositório:

- dados reais de clientes;
- NIF/IBAN/documentos contabilísticos;
- passwords;
- tokens;
- chaves privadas;
- `.env` real;
- dumps/backups de produção.

## Portefólio

O projeto passa a demonstrar competências em:

- análise de requisitos;
- frontend e UX;
- PostgreSQL e modelação relacional;
- SQL/PLpgSQL;
- constraints, índices e triggers;
- RBAC e Row-Level Security;
- auditoria;
- least privilege;
- security/privacy by design;
- Git/GitHub e Pull Requests;
- documentação técnica;
- evolução de um projeto para utilização real.

## Autor / manutenção técnica

Projeto desenvolvido e mantido no GitHub por [Nekas1980](https://github.com/Nekas1980).

A validação do conteúdo contabilístico, fiscal, profissional e deontológico pertence à profissional responsável. A vertente tecnológica deve manter separação clara de responsabilidades e acessos.

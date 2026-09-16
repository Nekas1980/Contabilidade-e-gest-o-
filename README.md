# CT Contabilidade e Gestão

Projeto digital em evolução para utilização real por uma profissional da área de contabilidade e gestão e, em paralelo, caso de estudo/portefólio em desenvolvimento web, PostgreSQL e segurança aplicacional.

## Estado atual

O website público profissional está em `main`. A evolução de contacto privado, backend, legislação e área interna encontra-se na branch `contacto-discreto-backend-ready` e no PR #3.

## Arquitetura

```text
Website público
   |
 HTTPS
   |
API / Backend
   |
PostgreSQL
   ├── ct_app
   └── ct_audit

Área interna autenticada
   ├── clientes
   ├── ficha fiscal
   ├── obrigações/pagamentos
   └── referências legais
```

O frontend nunca liga diretamente ao PostgreSQL e o website público não publica a pasta `internal/`.

## Website público

Inclui:

- layout institucional responsivo;
- serviços e metodologia;
- formulário preparado para envio privado via backend;
- área pesquisável de legislação/obrigações 2026;
- SEO, acessibilidade e GitHub Pages;
- testes de links e de exposição acidental de contactos privados.

## Base de dados

A pasta `database/` contém a fundação PostgreSQL orientada a segurança:

- organizações e utilizadores;
- memberships/perfis;
- leads;
- clientes e contactos;
- tarefas;
- metadados documentais;
- folha fiscal por cliente;
- obrigações e pagamentos por cliente;
- referências legais por cliente;
- RLS e isolamento por organização;
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

O perfil `technical` está deliberadamente separado do acesso normal aos dados funcionais/fiscais de clientes.

## Área interna

`internal/ficha-cliente.html` é um protótipo não publicado com dados fictícios. Demonstra:

- identificação do cliente;
- NIF/CAE e enquadramento fiscal;
- dimensão e referencial contabilístico;
- IVA e IRC;
- trabalhadores/Segurança Social;
- obrigações e pagamentos;
- atalhos para Portal das Finanças, Segurança Social e Diário da República;
- pesquisa e associação de referências legais.

O protótipo não grava dados. A persistência real só será ativada com autenticação, API e PostgreSQL testado.

## Segurança por desenho

- frontend sem segredos;
- PostgreSQL atrás de API;
- least privilege;
- RBAC + RLS;
- defesa em profundidade;
- separação de funções;
- auditoria;
- minimização de dados em logs;
- `.env` e credenciais excluídos do Git;
- nenhuma password de Finanças/Segurança Social guardada;
- área interna excluída do artefacto GitHub Pages e marcada `noindex,nofollow`;
- dados reais proibidos no repositório.

## Ficheiros principais

```text
.
├── index.html
├── legislacao.html
├── assets/
├── api/
│   └── contact.js
├── internal/
│   ├── ficha-cliente.html
│   ├── ficha-cliente.css
│   └── ficha-cliente.js
├── database/
│   ├── 01_schema.sql
│   ├── 02_security_rls.sql
│   ├── 03_audit.sql
│   ├── 04_seed_demo.sql
│   ├── 05_runtime_permissions.sql
│   └── 06_client_fiscal_module.sql
└── docs/
    ├── 08_BASE_DADOS_E_SEGURANCA.md
    ├── 09_CONTACTO_BACKEND_DOMINIO.md
    ├── 10_LEGISLACAO_OBRIGACOES_2026.md
    └── 11_FICHA_CLIENTE_FISCAL.md
```

## Dados reais

Até a camada backend/autenticação estar implementada e testada, usar apenas dados sintéticos.

Nunca colocar no repositório:

- dados reais de clientes;
- NIF/NISS/IBAN reais;
- documentos contabilísticos;
- passwords/PINs/códigos 2FA;
- tokens ou chaves privadas;
- `.env` real;
- dumps/backups de produção.

## Autor / manutenção técnica

Projeto desenvolvido e mantido no GitHub por [Nekas1980](https://github.com/Nekas1980).

A validação do conteúdo contabilístico, fiscal, profissional e deontológico pertence à profissional responsável. A vertente tecnológica deve manter separação clara de responsabilidades e acessos.

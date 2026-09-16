# Currículo e Portefólio — CT Contabilidade e Gestão

Este documento indica como apresentar o projeto profissionalmente sem exagerar responsabilidades nem atribuir competências que não foram demonstradas.

## 1. Nome recomendado do projeto

**CT Contabilidade e Gestão — Website Institucional e Plataforma Segura em Evolução**

## 2. Função no projeto

Título atual recomendado:

**Web Developer / Database & Security Project Developer**

Alternativa em português:

**Desenvolvimento Web, Base de Dados e Segurança Aplicacional**

Não utilizar ainda “Full-Stack Developer” como descrição principal enquanto a API/backend não estiver implementada e testada.

## 3. Descrição curta para CV

> Desenvolvimento e evolução de solução digital para atividade real na área de contabilidade e gestão. Implementação de website responsivo em HTML5, CSS3 e JavaScript e desenho de arquitetura PostgreSQL segura, com modelação relacional, RBAC, Row-Level Security, least privilege, auditoria e separação entre frontend, futura API e base de dados. Projeto gerido com Git/GitHub, branches, Pull Requests e documentação técnica.

## 4. Versão em pontos para CV

- Reestruturação de cartão digital para website institucional responsivo orientado à apresentação profissional e contacto.
- Desenvolvimento em HTML5, CSS3 e JavaScript vanilla.
- Implementação de formulário integrado com WhatsApp sem armazenamento próprio de dados na versão pública.
- Aplicação de SEO técnico, Schema.org e princípios de acessibilidade.
- Modelação de base PostgreSQL com schemas dedicados, relações, constraints e índices.
- Implementação de arquitetura multi-organização com Row-Level Security.
- Definição de perfis `owner`, `accountant`, `assistant`, `technical` e `read_only` e políticas de acesso por perfil.
- Implementação de auditoria de alterações com minimização dos dados guardados em logs.
- Definição de role runtime seguindo o princípio do menor privilégio e sem `BYPASSRLS`.
- Separação arquitetural `Frontend -> API -> PostgreSQL`, evitando exposição direta de credenciais no browser.
- Utilização de dados sintéticos para testes/portefólio, sem dados reais de clientes no repositório.
- Utilização de Git/GitHub com branch de desenvolvimento e Pull Request.
- Produção de documentação técnica, guia de estudo, roadmap e estado do projeto.

## 5. Competências técnicas associadas

### Frontend

- HTML5 semântico
- CSS3
- Responsive Web Design
- CSS Grid / Flexbox
- JavaScript vanilla
- DOM e eventos
- formulários
- validação no browser

### PostgreSQL

- schemas
- modelação relacional
- Primary/Foreign Keys
- constraints `NOT NULL`, `CHECK`, `UNIQUE`
- índices
- UUID
- PL/pgSQL
- triggers
- auditoria
- Row-Level Security
- policies
- separação de privilégios

### Segurança

- security by design
- privacy/minimização de dados
- least privilege
- RBAC
- isolamento multi-tenant/multi-organização
- segregação do perfil técnico
- gestão de segredos como requisito arquitetural
- logs de auditoria sem cópia integral dos registos
- `.gitignore` orientado a segredos/dumps/chaves
- threat modeling inicial

### Web e integração

- `FormData`
- `encodeURIComponent`
- integração WhatsApp
- Open Graph
- Schema.org
- meta tags

### Versionamento e processo

- Git
- GitHub
- branches
- commits
- Pull Requests
- roadmap
- documentação
- separação entre versão estável e desenvolvimento

## 6. Competências transversais demonstradas

- levantamento de requisitos;
- transformação de uma necessidade real em solução técnica;
- comunicação entre área técnica e área de negócio;
- evolução incremental do produto;
- decisão tecnológica proporcional ao risco;
- documentação e rastreabilidade;
- preocupação com manutenção, segurança e acessos.

## 7. História técnica do projeto

### Estado inicial

Cartão digital estático com dois meios de contacto.

### Evolução 1 — Website

Foi criado um website institucional responsivo com conteúdo estruturado, contacto, SEO e acessibilidade.

### Evolução 2 — Segurança e dados

Quando surgiu o objetivo de transformar o projeto num laboratório profissional, a arquitetura foi alterada conceptualmente para três camadas:

```text
Frontend -> API -> PostgreSQL
```

A base de dados foi desenhada primeiro, mantendo a API como fase seguinte. Isto permitiu definir o modelo e os controlos de acesso antes de começar a expor endpoints.

## 8. Decisões de arquitetura importantes

### Porque o frontend não liga diretamente à BD

Credenciais colocadas no browser podem ser observadas. A API será a fronteira de autenticação, autorização e validação.

### Porque RLS além da autorização da API

RLS cria defesa em profundidade. Se uma query da aplicação tiver um erro, a base continua a aplicar isolamento por organização/perfil.

### Porque o perfil `technical` não vê clientes

Uma pessoa responsável pela infraestrutura não precisa, por defeito, de acesso aos conteúdos profissionais de clientes. Esta é uma aplicação prática de least privilege e separação de funções.

### Porque a auditoria não copia as linhas completas

Logs podem tornar-se uma segunda fonte de exposição de informação. A auditoria regista metadados e campos alterados, mas não replica automaticamente os valores sensíveis.

## 9. Como explicar numa entrevista

### “É um projeto académico?”

> Não. Parte de uma necessidade real de uma profissional da área de contabilidade. Estou a utilizá-lo também como laboratório de aprendizagem, mas separo claramente dados reais do ambiente de portefólio. A evolução é feita em Git, com documentação, roadmap e controlos de segurança desde o desenho.

### “Onde aplicou cibersegurança?”

> No desenho da arquitetura e dos controlos: o browser não conhece credenciais PostgreSQL, existe uma camada API prevista, a base usa Row-Level Security, perfis e least privilege, o perfil técnico não acede por defeito aos dados de clientes, e existe auditoria. Os dados de laboratório são sintéticos e segredos/dumps são excluídos do Git.

### “O backend já existe?”

> Ainda não. A fundação de dados e segurança está versionada, mas a API é a próxima fase. Prefiro distinguir claramente o que está implementado do que está planeado.

### “Como evitaria SQL Injection?”

> A API usará queries parametrizadas/prepared statements e validação server-side. Nunca concatenaria diretamente input do browser numa query SQL.

### “Como impede uma organização de consultar outra?”

> A API valida o utilizador e a organização e define esse contexto dentro da transação. As policies de PostgreSQL aplicam Row-Level Security com esse contexto. Os testes terão duas organizações fictícias para confirmar que o acesso cruzado falha.

## 10. Versão LinkedIn — projeto

**CT Contabilidade e Gestão | Web, PostgreSQL & Security by Design**

Evolução de uma presença digital para utilização real na área de contabilidade e gestão, combinando desenvolvimento frontend com desenho de uma arquitetura segura para futura aplicação interna.

Tecnologias/práticas: HTML5, CSS3, JavaScript, PostgreSQL, SQL/PLpgSQL, relational modelling, Row-Level Security, RBAC, auditing, least privilege, security by design, Git/GitHub e documentação técnica.

## 11. Enquadramento para Cibersegurança / Sistemas

Este projeto é especialmente relevante como complemento aos projetos de redes/sistemas porque permite demonstrar segurança aplicada a software e dados:

- Broken Access Control como risco de arquitetura;
- privilégios mínimos;
- isolamento de dados;
- gestão de identidades e perfis;
- proteção de segredos;
- auditoria;
- logging;
- desenho para testes de SQL Injection e autorização;
- separação entre utilizador funcional e utilizador técnico.

## 12. O que ainda NÃO deve afirmar

Enquanto as fases seguintes não forem realizadas, não afirmar como concluído:

- API/backend seguro;
- autenticação em produção;
- base com clientes reais;
- gestão documental em produção;
- encriptação de campos sensíveis;
- backup/restore testado;
- testes automatizados completos;
- pentest formal;
- certificação RGPD/OWASP;
- deployment de produção da aplicação interna.

## 13. Evolução do título no CV

### Agora

**Web Developer / Database & Security Project Developer**

### Depois da API implementada e testada

Pode passar a:

**Full-Stack Developer — Secure Web Application Project**

ou, para candidaturas de segurança:

**Secure Application / Cybersecurity Portfolio Project**

A designação deve acompanhar competências demonstráveis, não apenas a intenção do projeto.

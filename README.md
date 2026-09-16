# CT Contabilidade e Gestão

Website institucional desenvolvido para utilização real por uma profissional da área de contabilidade e gestão.

O projeto começou como um cartão de visita digital simples e está a ser evoluído para uma presença online profissional, responsiva, credível e orientada à geração de contactos.

## Estado atual

A nova versão encontra-se na branch:

```text
redesign-profissional
```

A branch `main` mantém a versão anterior até conclusão da revisão e validação do conteúdo com a contabilista.

Consulte também:

- [`PROJECT_STATUS.md`](PROJECT_STATUS.md) — estado atual e checklist.
- [`ROADMAP.md`](ROADMAP.md) — evolução planeada.
- [`docs/01_ARQUITETURA_E_METODOS.md`](docs/01_ARQUITETURA_E_METODOS.md) — arquitetura, decisões técnicas e métodos usados.
- [`docs/02_GUIA_ESTUDO.md`](docs/02_GUIA_ESTUDO.md) — manual de estudo baseado no código real.
- [`docs/03_CURRICULO_E_PORTFOLIO.md`](docs/03_CURRICULO_E_PORTFOLIO.md) — apresentação do projeto em CV, GitHub, LinkedIn e entrevistas.
- [`docs/04_PUBLICACAO_E_CONFORMIDADE.md`](docs/04_PUBLICACAO_E_CONFORMIDADE.md) — preparação para utilização profissional.

## Objetivos

- Apresentar a atividade de forma profissional e credível.
- Explicar serviços de forma simples.
- Facilitar o primeiro contacto de potenciais clientes.
- Ter boa experiência em computador, tablet e smartphone.
- Manter uma solução tecnicamente simples e sustentável.
- Aplicar princípios de acessibilidade e minimização de dados.
- Servir também como projeto documentado de portefólio técnico.

## Funcionalidades

- navegação responsiva;
- hero institucional com chamadas à ação;
- secção de serviços;
- proposta de valor orientada à gestão;
- processo de acompanhamento;
- segmentação de público;
- FAQ;
- formulário que prepara uma mensagem para WhatsApp;
- contacto direto por WhatsApp e e-mail;
- SEO técnico básico;
- Open Graph;
- dados estruturados Schema.org;
- acessibilidade básica;
- ano do rodapé atualizado por JavaScript;
- documentação técnica e operacional.

## Estrutura

```text
.
├── index.html
├── README.md
├── PROJECT_STATUS.md
├── ROADMAP.md
├── assets/
│   ├── app.js
│   └── styles.css
└── docs/
    ├── 01_ARQUITETURA_E_METODOS.md
    ├── 02_GUIA_ESTUDO.md
    ├── 03_CURRICULO_E_PORTFOLIO.md
    └── 04_PUBLICACAO_E_CONFORMIDADE.md
```

## Stack

- HTML5
- CSS3
- JavaScript vanilla
- Git
- GitHub

Não existe backend nem base de dados nesta fase.

## Fluxo de contacto

```text
Visitante
   ↓
Preenche os dados no browser
   ↓
JavaScript valida e constrói a mensagem
   ↓
A mensagem é codificada para URL
   ↓
Abre o WhatsApp
```

O website não possui infraestrutura própria para guardar os dados introduzidos no formulário.

## Decisão arquitetural

Foi utilizada uma arquitetura estática porque satisfaz os requisitos atuais com menor complexidade, menor superfície de manutenção e sem dependências desnecessárias.

Frameworks, backend, autenticação e base de dados só deverão ser considerados quando surgirem requisitos que os justifiquem.

## Acessibilidade

O projeto inclui, entre outras medidas:

- HTML semântico;
- skip link;
- labels associados aos campos;
- atributos ARIA no menu e feedback do formulário;
- navegação adaptada a mobile;
- suporte a redução de movimento.

## SEO

Foram implementados:

- `title` descritivo;
- `meta description`;
- idioma `pt-PT`;
- Open Graph básico;
- hierarquia de títulos;
- Schema.org `ProfessionalService`.

O SEO final deverá ser revisto depois de definido o domínio e a área geográfica de atuação.

## Privacidade

Foi adotado o princípio de minimização de dados.

O site não possui, nesta fase:

- cookies próprios;
- analytics;
- login;
- base de dados de clientes;
- armazenamento próprio do conteúdo do formulário.

Antes de adicionar ferramentas de analytics, CRM, formulários armazenados ou área de cliente, os requisitos de segurança e privacidade devem ser reavaliados.

## Contactos atualmente configurados

- WhatsApp: `+351 928 207 611`
- E-mail: `ctcontabilidadeegestao@gmail.com`

Estes dados devem ser novamente confirmados antes da publicação definitiva.

## Utilização como portefólio

Este projeto demonstra trabalho em:

- análise de requisitos;
- HTML semântico;
- CSS responsivo;
- JavaScript e DOM;
- formulários e validação;
- integração WhatsApp;
- SEO;
- acessibilidade;
- privacidade por desenho;
- Git/GitHub;
- branches e Pull Requests;
- documentação técnica;
- manutenção de um projeto para utilização real.

## Autor / manutenção técnica

Projeto desenvolvido e mantido no GitHub por [Nekas1980](https://github.com/Nekas1980).

A validação do conteúdo contabilístico, fiscal e profissional deve ser feita pela profissional responsável antes da publicação definitiva.

# Arquitetura e Métodos — CT Contabilidade e Gestão

## 1. Objetivo do projeto

Este projeto transforma um cartão digital simples num website institucional profissional para uma atividade real de contabilidade e apoio à gestão.

O objetivo técnico é manter uma solução leve, rápida e fácil de alojar, enquanto o objetivo de negócio é aumentar a confiança do visitante e facilitar o primeiro contacto com a profissional.

## 2. Arquitetura adotada

A solução utiliza uma arquitetura **frontend estática**:

```text
Navegador
  ├── index.html        → estrutura e conteúdo
  ├── assets/styles.css → apresentação e responsividade
  └── assets/app.js     → interação e lógica do formulário
```

Não existe backend, API própria ou base de dados.

### Motivo da escolha

Para um site institucional desta dimensão, HTML, CSS e JavaScript vanilla permitem:

- carregamento rápido;
- menos dependências;
- manutenção simples;
- menor superfície de ataque;
- alojamento económico ou gratuito;
- compatibilidade com GitHub Pages;
- facilidade de estudo do código.

## 3. Método de desenvolvimento

### 3.1 Levantamento do problema

A versão inicial funcionava como cartão de visita: apresentava uma mensagem, um botão de WhatsApp e um endereço de e-mail.

Foram identificadas necessidades adicionais:

- criar credibilidade institucional;
- explicar serviços;
- organizar a proposta de valor;
- orientar o visitante para um contacto;
- melhorar experiência mobile;
- melhorar SEO básico;
- introduzir acessibilidade;
- reduzir promessas comerciais excessivas;
- preparar o projeto para utilização real.

### 3.2 Estrutura orientada ao percurso do utilizador

A página foi organizada segundo um funil simples:

```text
Descoberta
   ↓
Proposta de valor
   ↓
Serviços
   ↓
Método de trabalho
   ↓
Confiança / FAQ
   ↓
Contacto
```

O objetivo é evitar que o utilizador tenha de descobrir sozinho o que fazer a seguir.

## 4. HTML semântico

Foram utilizados elementos HTML com significado estrutural:

- `header` — cabeçalho e navegação;
- `nav` — menu principal;
- `main` — conteúdo principal;
- `section` — blocos temáticos;
- `article` — cartões independentes;
- `form` — recolha local de dados para contacto;
- `details` e `summary` — FAQ acessível sem biblioteca externa;
- `footer` — informação final e contactos.

### Vantagens

- código mais legível;
- melhor interpretação por motores de pesquisa;
- melhor suporte a leitores de ecrã;
- manutenção mais simples.

## 5. CSS e design responsivo

O CSS foi separado do HTML para manter responsabilidades distintas.

Foram usados:

- CSS Grid para áreas com várias colunas;
- Flexbox para alinhamentos e navegação;
- media queries para adaptar o layout a ecrãs menores;
- variáveis visuais e estilos reutilizáveis;
- estados `hover` e `focus`;
- suporte a `prefers-reduced-motion` para pessoas que preferem menos animação.

### Princípio aplicado

**Mobile-first na validação**, mesmo que alguns componentes sejam desenhados inicialmente em grelha para desktop.

O site deve continuar funcional em:

- smartphone;
- tablet;
- portátil;
- desktop.

## 6. JavaScript — funções e lógica

O ficheiro `assets/app.js` contém apenas a interatividade necessária.

### 6.1 Menu mobile

```js
const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-nav-links]');
```

O JavaScript procura o botão e a navegação através de atributos `data-*`.

Ao clicar:

1. adiciona/remove a classe `open`;
2. atualiza `aria-expanded`;
3. altera o texto do botão entre `☰` e `✕`;
4. bloqueia/desbloqueia o estado visual do menu.

Isto combina comportamento visual com acessibilidade.

### 6.2 Ano automático

```js
const year = document.querySelector('[data-current-year]');
if (year) year.textContent = new Date().getFullYear();
```

A função `new Date().getFullYear()` evita editar manualmente o ano do rodapé todos os anos.

### 6.3 Processamento do formulário

O formulário utiliza:

```js
const data = new FormData(contactForm);
```

`FormData` lê os campos do formulário sem necessidade de procurar individualmente cada `input`.

Os dados são normalizados com:

```js
String(...).trim();
```

Isto converte o valor para texto e remove espaços desnecessários no início e no fim.

### 6.4 Validação

A aplicação verifica os campos essenciais:

```js
if (!name || !need) {
  // apresentar mensagem
  return;
}
```

O `return` termina a execução quando faltam dados obrigatórios.

Além desta validação JavaScript, o HTML utiliza o atributo `required`, criando duas camadas de validação no browser.

### 6.5 Construção da mensagem

A mensagem é montada num array e depois transformada em texto:

```js
[...].filter(Boolean).join('\n');
```

- `filter(Boolean)` remove linhas vazias;
- `join('\n')` junta os elementos com mudanças de linha.

### 6.6 Codificação segura do URL

```js
encodeURIComponent(text)
```

Esta função converte espaços, acentos e caracteres especiais para uma representação segura dentro de um URL.

### 6.7 Abertura do WhatsApp

O site utiliza o formato oficial de ligação `wa.me` para abrir uma conversa já com a mensagem preparada.

A informação não é enviada para uma base de dados do projeto.

## 7. SEO aplicado

O projeto inclui:

- `title` descritivo;
- `meta description`;
- diretiva `robots`;
- Open Graph básico;
- idioma `pt-PT`;
- hierarquia de títulos;
- dados estruturados Schema.org do tipo `ProfessionalService`.

### Função dos dados estruturados

Os dados Schema.org ajudam motores de pesquisa a perceber que o conteúdo representa um serviço profissional e quais são os principais dados públicos associados.

## 8. Acessibilidade

Foram aplicadas medidas como:

- link “Saltar para o conteúdo”;
- `aria-label` em elementos de navegação;
- `aria-expanded` no menu mobile;
- `role="status"` e `aria-live="polite"` para feedback do formulário;
- `label` associado a cada campo;
- foco de teclado;
- HTML semântico;
- redução de movimento quando solicitada pelo sistema operativo.

## 9. Privacidade e segurança

### Estado atual

- não existe login;
- não existem cookies próprios;
- não existe base de dados;
- não existem credenciais no frontend;
- não existe armazenamento do conteúdo do formulário;
- a mensagem é preparada localmente no navegador;
- links externos abertos em novo separador utilizam `noopener noreferrer` quando aplicável.

### Princípio utilizado

**Minimização de dados:** se o site não necessita de guardar dados para cumprir a função, não os guarda.

## 10. Git e GitHub

A evolução profissional foi realizada numa branch própria:

```text
main
└── redesign-profissional
```

Isto permite:

- preservar a versão estável;
- comparar alterações;
- rever antes de publicar;
- usar Pull Requests;
- manter histórico e rastreabilidade.

## 11. Competências demonstradas

Este projeto permite demonstrar:

- HTML5 semântico;
- CSS3 responsivo;
- JavaScript vanilla;
- manipulação do DOM;
- eventos;
- formulários;
- validação;
- integração através de URL com WhatsApp;
- SEO técnico básico;
- Schema.org;
- acessibilidade web;
- privacidade por desenho;
- Git;
- GitHub;
- branches e Pull Requests;
- análise de requisitos;
- UX orientada a conversão;
- documentação técnica.

## 12. Limitações conscientes

O projeto evita complexidade que neste momento não cria valor real.

Não foram adicionados deliberadamente:

- frameworks JavaScript;
- autenticação;
- base de dados;
- painel administrativo;
- analytics;
- cookies de marketing;
- backend para envio de formulários.

Essas funcionalidades só devem ser adicionadas quando existir uma necessidade de negócio concreta.

# Guia de Estudo — CT Contabilidade e Gestão

Este documento transforma o projeto num exercício de aprendizagem. O objetivo é conseguir compreender e explicar cada decisão, em vez de apenas memorizar código.

## 1. O que deve conseguir explicar no final

Depois de estudar este projeto, deve conseguir responder:

1. O que é um site estático?
2. Qual a diferença entre HTML, CSS e JavaScript?
3. Porque foi evitado um framework neste projeto?
4. Como funciona uma página responsiva?
5. O que é o DOM?
6. Como funciona um `eventListener`?
7. O que é `FormData`?
8. Porque se utiliza `encodeURIComponent()`?
9. Como funciona uma ligação `wa.me`?
10. O que significa SEO técnico básico?
11. O que é HTML semântico?
12. O que são atributos ARIA?
13. Porque não guardar dados pode ser uma decisão de segurança?
14. O que é uma branch Git?
15. Qual a função de um Pull Request?

---

## 2. HTML — estrutura

HTML significa **HyperText Markup Language**.

Não é uma linguagem de programação tradicional. É uma linguagem de marcação que descreve a estrutura de uma página.

Exemplo:

```html
<section>
  <h2>Serviços</h2>
  <p>Apoio contabilístico e de gestão.</p>
</section>
```

Neste caso:

- `section` cria uma secção temática;
- `h2` representa um título de segundo nível;
- `p` representa um parágrafo.

### Exercício

Procure no `index.html`:

- um `header`;
- um `nav`;
- três `section`;
- um `form`;
- um `footer`.

Explique verbalmente a função de cada elemento.

---

## 3. CSS — apresentação

CSS significa **Cascading Style Sheets**.

É responsável pela apresentação visual.

Exemplo conceptual:

```css
.btn {
  padding: 1rem;
  border-radius: 10px;
}
```

Aqui `.btn` é um seletor de classe.

### Conceitos para estudar

- classes;
- seletores;
- `display: flex`;
- `display: grid`;
- `gap`;
- `padding`;
- `margin`;
- `border-radius`;
- `max-width`;
- media queries;
- pseudoestados `:hover` e `:focus`.

### Exercício

Altere localmente apenas um valor de `border-radius` e observe a diferença. Depois reverta.

---

## 4. Responsividade

Responsividade significa adaptar o layout ao tamanho disponível.

Um site responsivo não deve ser uma versão reduzida do desktop. Deve reorganizar os componentes para continuar legível e utilizável.

### Exemplo conceptual

Desktop:

```text
[ Texto principal ] [ Cartão ]
```

Mobile:

```text
[ Texto principal ]
[ Cartão ]
```

### Exercício

Abra o site nas ferramentas de desenvolvimento do navegador e teste:

- 320 px;
- 375 px;
- 768 px;
- 1024 px;
- 1440 px.

Registe qualquer problema de espaçamento, texto ou navegação.

---

## 5. JavaScript — comportamento

JavaScript adiciona comportamento à página.

### 5.1 `querySelector`

```js
const contactForm = document.querySelector('#contact-form');
```

Significa: procurar no documento o elemento com `id="contact-form"`.

### 5.2 Eventos

```js
contactForm.addEventListener('submit', (event) => {
  // código
});
```

Significa: executar uma função quando o formulário for submetido.

### 5.3 `preventDefault`

```js
event.preventDefault();
```

Evita o comportamento normal do browser, que seria tentar enviar o formulário e recarregar/navegar para outra página.

---

## 6. FormData

```js
const data = new FormData(contactForm);
```

O objeto `FormData` recolhe os campos que têm atributo `name`.

Depois:

```js
data.get('nome');
```

obtém o valor do campo cujo `name` é `nome`.

### Exercício

Adicione temporariamente:

```js
console.log(data.get('nome'));
```

Abra a consola, submeta o formulário e observe o valor. Depois remova o `console.log`.

---

## 7. Strings, arrays e métodos

O projeto utiliza:

```js
String(valor)
```

para garantir uma string.

Utiliza:

```js
.trim()
```

para remover espaços laterais.

Utiliza:

```js
.filter(Boolean)
```

para remover entradas vazias de um array.

Utiliza:

```js
.join('\n')
```

para juntar várias linhas de texto.

### Exercício

Experimente na consola:

```js
['A', '', 'B'].filter(Boolean).join('\n')
```

Explique o resultado.

---

## 8. URLs e `encodeURIComponent`

Uma mensagem de WhatsApp é colocada dentro de um URL.

Caracteres como espaços, acentos, `&`, `?` ou `#` podem alterar o significado de um URL.

Por isso é utilizado:

```js
encodeURIComponent(text)
```

### Exercício

Compare na consola:

```js
'Olá Nelson & empresa'
```

com:

```js
encodeURIComponent('Olá Nelson & empresa')
```

---

## 9. DOM

DOM significa **Document Object Model**.

O browser transforma o HTML numa estrutura de objetos que JavaScript consegue consultar e alterar.

Exemplo:

```js
menu.classList.toggle('open');
```

O JavaScript está a alterar as classes do elemento. O CSS reage a essa alteração.

Isto demonstra a relação:

```text
HTML → estrutura
CSS → aparência
JavaScript → comportamento
```

---

## 10. Acessibilidade

Acessibilidade procura garantir que o site pode ser utilizado por mais pessoas e tecnologias assistivas.

### Exemplos no projeto

```html
<label for="nome">Nome</label>
<input id="nome">
```

O `label` identifica corretamente o campo.

```html
aria-expanded="false"
```

indica a leitores de ecrã se um menu está aberto ou fechado.

```html
aria-live="polite"
```

permite anunciar alterações de estado sem interromper agressivamente a navegação.

### Exercício

Tente navegar no site apenas com:

- `Tab`;
- `Shift + Tab`;
- `Enter`;
- `Space`.

---

## 11. SEO

SEO significa **Search Engine Optimization**.

Neste projeto o objetivo não é “enganar o Google”, mas tornar o conteúdo mais fácil de interpretar.

Elementos usados:

- título da página;
- descrição;
- títulos hierárquicos;
- texto compreensível;
- estrutura semântica;
- Open Graph;
- dados Schema.org.

### Exercício

No `index.html`, localize:

```html
<title>
<meta name="description">
<script type="application/ld+json">
```

Explique a função de cada um.

---

## 12. Privacidade por desenho

O formulário não envia dados para um servidor próprio.

Fluxo:

```text
Utilizador escreve
       ↓
JavaScript lê localmente
       ↓
JavaScript cria texto
       ↓
Browser abre WhatsApp
```

Não existe:

```text
Formulário → servidor do projeto → base de dados
```

### O que aprender

Segurança não significa apenas adicionar sistemas complexos. Muitas vezes a solução mais segura é não recolher aquilo de que não precisamos.

---

## 13. Git

Git controla versões do projeto.

### Conceitos

- repositório;
- commit;
- branch;
- diff;
- merge;
- histórico.

A branch `redesign-profissional` permite desenvolver sem alterar diretamente `main`.

---

## 14. GitHub e Pull Request

O GitHub aloja o repositório e acrescenta colaboração e revisão.

Um Pull Request permite comparar:

```text
redesign-profissional → main
```

antes de integrar as alterações.

### Competência profissional

Isto aproxima o projeto de um fluxo real de equipa e não apenas de ficheiros alterados manualmente.

---

## 15. Perguntas de entrevista

Treine respostas para:

### “Porque não utilizou React?”

Porque a dimensão e os requisitos não justificavam a complexidade adicional. Uma solução estática satisfaz os objetivos com menor custo de manutenção e dependências.

### “Como protege os dados do formulário?”

O projeto aplica minimização de dados. Não existe backend nem armazenamento próprio. Os dados são utilizados no navegador apenas para compor a mensagem que o utilizador decide enviar pelo WhatsApp.

### “O que melhoraria numa versão futura?”

Depende de requisitos reais. Possibilidades incluem domínio próprio, área reservada, backend seguro, marcação de reuniões, integração com CRM e analytics com gestão adequada de consentimento.

### “Qual foi o seu papel?”

Análise de requisitos, estruturação do conteúdo, implementação frontend, experiência responsiva, fluxo de contacto, SEO básico, acessibilidade, documentação e gestão do código em Git/GitHub.

---

## 16. Exercícios de evolução

Execute apenas numa branch de testes.

1. Criar uma nova secção de testemunhos sem inventar testemunhos reais.
2. Criar um botão “Guardar contacto”.
3. Adicionar validação de comprimento mínimo à mensagem.
4. Criar modo claro/escuro.
5. Adicionar uma página de serviços.
6. Criar um `robots.txt`.
7. Criar uma página 404 personalizada.
8. Medir desempenho com Lighthouse.
9. Verificar contraste e navegação por teclado.
10. Criar testes simples para a função que constrói a mensagem.

---

## 17. Regra de estudo

Para cada bloco de código, conseguir explicar:

**O que faz?**

**Porque existe?**

**O que aconteceria se fosse removido?**

**Existe uma alternativa?**

Se conseguir responder às quatro perguntas, está a compreender o código e não apenas a copiá-lo.

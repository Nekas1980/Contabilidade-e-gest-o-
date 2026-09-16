# Contacto discreto, backend e domínio próprio

## Objetivo

Evoluir o formulário de contacto para que o visitante possa enviar um pedido sem abrir automaticamente WhatsApp, cliente de e-mail ou outra aplicação externa.

## Estado atual

Na branch `contacto-discreto-backend-ready`, o formulário:

- recolhe apenas os dados necessários para o primeiro contacto;
- prepara a mensagem dentro da própria página;
- não abre automaticamente WhatsApp ou e-mail;
- permite rever a mensagem;
- permite copiar a mensagem;
- não envia nem armazena dados nesta fase.

Este comportamento é intencional até existir um backend seguro.

## Arquitetura pretendida

```text
Browser
   |
 HTTPS POST /api/contact
   |
Backend / Serverless Function
   |-- validação e sanitização
   |-- rate limiting
   |-- anti-spam
   |-- logging mínimo
   |-- gestão de segredos
   |
   |---> Serviço de e-mail
   |
   '---> WhatsApp Business API, quando configurada e autorizada
```

## Porque não enviar diretamente do JavaScript

Credenciais de e-mail, tokens da WhatsApp Business API e outras chaves privadas não podem ficar no JavaScript servido ao visitante. Qualquer segredo colocado no frontend deve ser considerado público.

O browser envia apenas o pedido para o backend. O backend é o único componente autorizado a falar com os fornecedores externos.

## Contrato proposto da API

Endpoint:

```text
POST /api/contact
```

Payload lógico:

```json
{
  "name": "string",
  "email": "string",
  "phone": "string opcional",
  "company": "string opcional",
  "need": "string",
  "replyPreference": "email | whatsapp | any",
  "message": "string opcional"
}
```

O backend deve rejeitar campos inesperados e impor limites de tamanho.

## Resposta da API

Sucesso:

```json
{
  "ok": true,
  "message": "Pedido recebido."
}
```

Erro de validação:

```json
{
  "ok": false,
  "code": "VALIDATION_ERROR"
}
```

Não devolver detalhes internos, stack traces, tokens ou mensagens do fornecedor externo.

## E-mail

O backend pode enviar uma notificação para o endereço profissional através de um fornecedor de e-mail transacional.

Requisitos:

- API key guardada como secret/env var do backend;
- domínio remetente verificado quando existir domínio próprio;
- SPF/DKIM/DMARC quando aplicável;
- nunca enviar diretamente por SMTP a partir do browser;
- evitar incluir mais dados pessoais do que os necessários.

## WhatsApp

O envio automático para WhatsApp deve utilizar um canal oficial/autorizado para utilização empresarial.

Requisitos antes de ativar:

- conta/estrutura empresarial apropriada;
- número autorizado;
- token guardado apenas no backend;
- regras e consentimentos aplicáveis ao tipo de mensagem;
- testes em ambiente controlado;
- tratamento de erros e limites de utilização.

Não utilizar serviços informais que exijam expor credenciais ou contornar as regras da plataforma.

## Anti-spam e abuso

Antes de produção implementar:

- rate limiting por IP/origem;
- campo honeypot invisível;
- limite de tamanho da mensagem;
- validação server-side;
- CORS restrito ao domínio oficial;
- logs sem copiar mensagens completas sempre que não seja necessário;
- eventualmente CAPTCHA/Turnstile se o abuso justificar.

## Base de dados

O formulário não precisa obrigatoriamente de guardar cada mensagem na base de dados.

Estratégia recomendada para a primeira versão:

1. validar o pedido;
2. enviar notificações;
3. guardar apenas o mínimo necessário caso exista uma necessidade concreta de CRM/auditoria;
4. definir retenção e eliminação antes de armazenar dados reais.

## Domínio próprio

O GitHub Pages suporta domínios personalizados. O domínio final ainda deve ser escolhido e adquirido.

Estratégia recomendada:

```text
www.DOMINIO.pt      -> website público
api.DOMINIO.pt      -> backend, caso seja útil separar
```

ou, se o fornecedor serverless permitir routing integrado:

```text
www.DOMINIO.pt/api/contact
```

## DNS e segurança do domínio

Quando existir domínio:

- verificar o domínio no GitHub;
- configurar DNS antes de divulgação pública;
- ativar HTTPS;
- evitar wildcard DNS desnecessário;
- configurar `www` e domínio raiz de forma consistente;
- atualizar canonical, Open Graph e sitemap;
- configurar SPF/DKIM/DMARC se houver envio de e-mail pelo domínio.

## Plano de implementação

### Fase A — concluída nesta branch

- retirar CTAs diretos para apps;
- tornar contactos visuais mais discretos;
- recolher e-mail/telefone apenas no formulário;
- preparar e rever a mensagem sem abrir aplicações.

### Fase B — backend

- criar função `/api/contact`;
- validação server-side;
- rate limiting;
- anti-spam;
- secret management;
- integração de e-mail;
- testes.

### Fase C — WhatsApp empresarial

- configurar fornecedor/API oficial;
- guardar token no backend;
- testes de envio;
- observabilidade e tratamento de falhas.

### Fase D — domínio

- escolher/adquirir domínio;
- configurar GitHub Pages ou alojamento definitivo;
- HTTPS;
- DNS;
- e-mail profissional;
- SEO final.

## Valor para portefólio

Esta evolução permite demonstrar:

- progressive enhancement;
- UX orientada à privacidade;
- separação frontend/backend;
- APIs REST;
- serverless;
- secret management;
- integração com fornecedores externos;
- validação e anti-abuso;
- DNS e custom domains;
- segurança aplicacional aplicada a um caso real.

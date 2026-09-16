# Contacto discreto, backend e domínio próprio

## Objetivo

Permitir que o visitante envie um pedido de contacto sem abrir WhatsApp, cliente de e-mail ou qualquer outra aplicação externa e sem expor no HTML público o endereço de e-mail ou o número de telefone da destinatária.

## Estado atual

Na branch `contacto-discreto-backend-ready` já existem:

- frontend sem `mailto:` e sem `wa.me` no HTML público;
- remoção de e-mail e telefone do Schema.org público;
- formulário com nome, e-mail, empresa, telefone opcional, área, preferência de resposta e mensagem;
- fallback local que prepara a mensagem enquanto o backend não está publicado;
- endpoint serverless `POST /api/contact` em `api/contact.js`;
- validação server-side e limites de tamanho;
- allowlist CORS por `ALLOWED_ORIGINS`;
- honeypot anti-spam;
- logging mínimo por `requestId`, sem copiar dados pessoais para os logs da aplicação;
- envio por fornecedor de e-mail transacional através de segredo de backend;
- notificação WhatsApp Business opcional, sem dados pessoais no conteúdo da notificação;
- `.env.example` sem valores reais;
- testes automáticos da API;
- validação automática de links internos e deteção de contactos diretos expostos no HTML.

Os testes de GitHub Actions passaram em 16 de setembro de 2026.

## Arquitetura

```text
Browser
   |
 HTTPS POST /api/contact
   |
Backend / Serverless Function
   |-- validação
   |-- CORS allowlist
   |-- honeypot
   |-- logging mínimo
   |-- secret management
   |
   |---> serviço de e-mail transacional
   |
   '---> WhatsApp Business API (opcional)
```

O formulário não precisa de guardar os pedidos em PostgreSQL nesta primeira versão. O princípio adotado é: validar, entregar e reter apenas o que tiver uma finalidade operacional definida.

## Configuração privada

As variáveis necessárias estão documentadas em `.env.example`.

Nunca versionar valores reais de:

- `RESEND_API_KEY`;
- `CONTACT_EMAIL_TO`;
- `CONTACT_EMAIL_FROM`;
- tokens da WhatsApp Business API;
- identificadores privados de número;
- outros segredos do fornecedor.

No alojamento, estes valores devem ser configurados como variáveis de ambiente/segredos.

## Frontend e GitHub Pages

O JavaScript usa envio real apenas quando existe um endpoint configurado. Enquanto o site estiver em GitHub Pages sem URL de backend definida, mantém o modo de preparação local e não finge que enviou a mensagem.

Depois de existir URL pública do backend, o frontend do GitHub Pages pode chamar essa API por HTTPS desde que a origem esteja autorizada no backend.

## E-mail

O endpoint está preparado para entregar o pedido através de um serviço de e-mail transacional. O destinatário fica apenas na configuração privada do backend.

Quando existir domínio próprio, configurar:

- domínio de envio verificado;
- SPF;
- DKIM;
- DMARC;
- endereço profissional do domínio.

## WhatsApp

A integração prevista utiliza a API empresarial oficial e fica desativada enquanto não existirem as credenciais necessárias.

A notificação concebida para esta fase é deliberadamente genérica, por exemplo:

```text
Novo pedido recebido através do website. Consulte o canal interno definido.
```

Assim, o WhatsApp não se torna uma segunda cópia de dados pessoais do visitante.

## Controlos ainda recomendados antes de produção

- rate limiting persistente por IP/origem;
- CAPTCHA/Turnstile se surgir abuso real;
- monitorização de falhas de entrega;
- política de privacidade e informação sobre tratamento de dados;
- definição de retenção se no futuro os pedidos forem guardados;
- teste end-to-end no domínio final.

## Domínio próprio

Arquitetura possível mantendo separação clara:

```text
www.DOMINIO.pt   -> website público
api.DOMINIO.pt   -> backend
```

Ou, se todo o projeto for alojado no mesmo fornecedor:

```text
www.DOMINIO.pt/api/contact
```

## Testes

O workflow `.github/workflows/quality.yml` executa:

```text
npm test
npm run check:static
```

Os testes verificam atualmente:

- métodos HTTP aceites;
- validação de campos obrigatórios;
- honeypot;
- envio simulado para o fornecedor de e-mail;
- bloqueio de origem não autorizada;
- existência dos links/ficheiros internos do site;
- existência das âncoras internas;
- ausência de `mailto:`, `wa.me`, e-mail e número privados no HTML publicado.

## Próximos passos

1. ligar um fornecedor de backend/serverless;
2. configurar segredos reais no fornecedor, nunca no GitHub;
3. configurar serviço de e-mail e domínio remetente;
4. obter a URL da API;
5. ligar essa URL ao frontend em GitHub Pages ou mover o site para o mesmo domínio;
6. realizar teste end-to-end com um pedido fictício;
7. configurar domínio próprio e HTTPS;
8. só depois integrar CRM/base de dados se houver necessidade real.

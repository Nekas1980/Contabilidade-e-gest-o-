import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact.js';

function makeResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; return this; },
    end(value = '') { this.body = value; return this; },
  };
}

function parse(res) {
  return res.body ? JSON.parse(res.body) : {};
}

test('rejeita método diferente de POST/OPTIONS', async () => {
  const req = { method: 'GET', headers: {}, body: {} };
  const res = makeResponse();
  await handler(req, res);
  assert.equal(res.statusCode, 405);
  assert.equal(parse(res).code, 'METHOD_NOT_ALLOWED');
});

test('rejeita pedido sem campos obrigatórios', async () => {
  const req = { method: 'POST', headers: {}, body: { name: 'Teste' } };
  const res = makeResponse();
  await handler(req, res);
  assert.equal(res.statusCode, 400);
  assert.equal(parse(res).code, 'VALIDATION_ERROR');
});

test('honeypot responde sem enviar dados', async () => {
  const previousFetch = global.fetch;
  let called = false;
  global.fetch = async () => { called = true; return { ok: true }; };

  const req = {
    method: 'POST',
    headers: {},
    body: { website: 'https://spam.example', name: 'Bot', email: 'bot@example.test', need: 'Spam' },
  };
  const res = makeResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(parse(res).ok, true);
  assert.equal(called, false);
  global.fetch = previousFetch;
});

test('envia pedido válido ao fornecedor de e-mail', async () => {
  const oldEnv = { ...process.env };
  const previousFetch = global.fetch;
  const calls = [];

  process.env.RESEND_API_KEY = 'test-key';
  process.env.CONTACT_EMAIL_TO = 'destino@example.test';
  process.env.CONTACT_EMAIL_FROM = 'Website CT <no-reply@example.test>';
  process.env.ALLOWED_ORIGINS = 'https://nekas1980.github.io';

  global.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return { ok: true };
  };

  const req = {
    method: 'POST',
    headers: { origin: 'https://nekas1980.github.io' },
    body: {
      name: 'Pessoa Teste',
      email: 'pessoa@example.test',
      company: 'Empresa Exemplo',
      phone: '910000000',
      need: 'Contabilidade',
      replyPreference: 'E-mail',
      message: 'Pedido de informação.',
    },
  };
  const res = makeResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(parse(res).ok, true);
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /api\.resend\.com\/emails/);

  const sent = JSON.parse(calls[0].options.body);
  assert.deepEqual(sent.to, ['destino@example.test']);
  assert.equal(sent.reply_to, 'pessoa@example.test');

  global.fetch = previousFetch;
  process.env = oldEnv;
});

test('bloqueia origem que não consta da allowlist', async () => {
  const old = process.env.ALLOWED_ORIGINS;
  process.env.ALLOWED_ORIGINS = 'https://nekas1980.github.io';

  const req = {
    method: 'POST',
    headers: { origin: 'https://example.invalid' },
    body: { name: 'Teste', email: 'teste@example.test', need: 'IVA' },
  };
  const res = makeResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 403);
  assert.equal(parse(res).code, 'ORIGIN_NOT_ALLOWED');

  if (old === undefined) delete process.env.ALLOWED_ORIGINS;
  else process.env.ALLOWED_ORIGINS = old;
});

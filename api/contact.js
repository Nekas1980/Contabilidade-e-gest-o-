const MAX = {
  name: 120,
  email: 254,
  phone: 40,
  company: 160,
  need: 160,
  replyPreference: 40,
  message: 3000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.end(JSON.stringify(payload));
}

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function allowedOrigins() {
  return String(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function setCors(req, res) {
  const origin = String(req.headers.origin || '');
  const allowlist = allowedOrigins();

  if (origin && allowlist.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function sendEmail(contact, requestId) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM;

  if (!apiKey || !to || !from) {
    throw new Error('EMAIL_NOT_CONFIGURED');
  }

  const safe = Object.fromEntries(
    Object.entries(contact).map(([key, value]) => [key, escapeHtml(value)])
  );

  const lines = [
    ['Nome', safe.name],
    ['E-mail', safe.email],
    ['Empresa/atividade', safe.company],
    ['Telefone/WhatsApp', safe.phone],
    ['Área', safe.need],
    ['Preferência de resposta', safe.replyPreference],
    ['Mensagem', safe.message],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `<p><strong>${label}:</strong> ${value.replaceAll('\n', '<br>')}</p>`)
    .join('');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: contact.email,
      subject: `Novo pedido de contacto — ${contact.need}`,
      html: `<h2>Novo pedido de contacto</h2>${lines}<hr><p>Referência técnica: ${requestId}</p>`,
      text: [
        'Novo pedido de contacto',
        `Nome: ${contact.name}`,
        `E-mail: ${contact.email}`,
        contact.company ? `Empresa/atividade: ${contact.company}` : '',
        contact.phone ? `Telefone/WhatsApp: ${contact.phone}` : '',
        `Área: ${contact.need}`,
        `Preferência de resposta: ${contact.replyPreference}`,
        contact.message ? `Mensagem: ${contact.message}` : '',
        `Referência técnica: ${requestId}`,
      ].filter(Boolean).join('\n'),
    }),
  });

  if (!response.ok) {
    throw new Error('EMAIL_PROVIDER_ERROR');
  }
}

async function notifyWhatsApp() {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO;
  const template = process.env.WHATSAPP_TEMPLATE_NAME;
  const language = process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'pt_PT';

  if (!token || !phoneNumberId || !to || !template) return { skipped: true };

  const response = await fetch(`https://graph.facebook.com/v23.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: template,
        language: { code: language },
      },
    }),
  });

  if (!response.ok) {
    throw new Error('WHATSAPP_PROVIDER_ERROR');
  }

  return { skipped: false };
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return json(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });

  const origin = String(req.headers.origin || '');
  const allowlist = allowedOrigins();
  if (origin && allowlist.length && !allowlist.includes(origin)) {
    return json(res, 403, { ok: false, code: 'ORIGIN_NOT_ALLOWED' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Honeypot: bots tendem a preencher este campo invisível.
  if (clean(body.website, 200)) {
    return json(res, 200, { ok: true, message: 'Pedido recebido.' });
  }

  const contact = {
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email).toLowerCase(),
    phone: clean(body.phone, MAX.phone),
    company: clean(body.company, MAX.company),
    need: clean(body.need, MAX.need),
    replyPreference: clean(body.replyPreference || 'Sem preferência', MAX.replyPreference),
    message: clean(body.message, MAX.message),
  };

  if (!contact.name || !contact.email || !contact.need || !EMAIL_RE.test(contact.email)) {
    return json(res, 400, { ok: false, code: 'VALIDATION_ERROR' });
  }

  const requestId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await sendEmail(contact, requestId);

    // Notificação opcional e deliberadamente sem dados pessoais.
    try {
      await notifyWhatsApp();
    } catch {
      console.warn(JSON.stringify({ event: 'whatsapp_notification_failed', requestId }));
    }

    console.info(JSON.stringify({ event: 'contact_delivered', requestId }));
    return json(res, 200, { ok: true, message: 'Pedido recebido.', requestId });
  } catch (error) {
    console.error(JSON.stringify({ event: 'contact_delivery_failed', requestId, code: error?.message || 'UNKNOWN' }));
    return json(res, 503, { ok: false, code: 'DELIVERY_UNAVAILABLE' });
  }
}

const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-nav-links]');

function closeMenu() {
  if (!menuButton || !menu) return;
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  menuButton.textContent = '☰';
}

if (menuButton && menu) {
  if (!menu.querySelector('a[href="legislacao.html"]')) {
    const legislationLink = document.createElement('a');
    legislationLink.href = 'legislacao.html';
    legislationLink.textContent = 'Legislação';
    const faqLink = [...menu.querySelectorAll('a')].find((link) => link.getAttribute('href')?.includes('#faq'));
    menu.insertBefore(legislationLink, faqLink || menu.querySelector('.nav-cta'));
  }

  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    document.body.classList.toggle('menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    menuButton.textContent = isOpen ? '✕' : '☰';
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
}

const year = document.querySelector('[data-current-year]');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const preparedMessageWrapper = document.querySelector('#prepared-message-wrapper');
const preparedMessage = document.querySelector('#prepared-message');
const copyMessageButton = document.querySelector('#copy-message');

const onGitHubPages = window.location.hostname.endsWith('github.io');
const CONTACT_API_URL = window.CT_CONTACT_API_URL || (onGitHubPages ? '' : '/api/contact');

function buildContactPayload(data) {
  return {
    name: String(data.get('nome') || '').trim(),
    email: String(data.get('email') || '').trim(),
    company: String(data.get('empresa') || '').trim(),
    phone: String(data.get('telefone') || '').trim(),
    need: String(data.get('necessidade') || '').trim(),
    replyPreference: String(data.get('preferencia') || 'Sem preferência').trim(),
    message: String(data.get('mensagem') || '').trim(),
    website: '',
  };
}

function buildPreview(payload) {
  return [
    'Pedido de contacto — CT Contabilidade e Gestão',
    '',
    `Nome: ${payload.name}`,
    `E-mail: ${payload.email}`,
    payload.company ? `Empresa/atividade: ${payload.company}` : '',
    payload.phone ? `Telefone/WhatsApp: ${payload.phone}` : '',
    `Área de interesse: ${payload.need}`,
    `Preferência de resposta: ${payload.replyPreference}`,
    payload.message ? `Mensagem: ${payload.message}` : '',
    '',
    'Pedido preparado através do website.',
  ].filter(Boolean).join('\n');
}

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formNote = contactForm.querySelector('.form-note');

  if (CONTACT_API_URL) {
    if (submitButton) submitButton.textContent = 'Enviar pedido de contacto';
    if (formNote) {
      formNote.textContent = 'O pedido é enviado de forma segura em segundo plano. Não será aberta qualquer aplicação de e-mail ou WhatsApp.';
    }
    if (preparedMessageWrapper) preparedMessageWrapper.hidden = true;
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = buildContactPayload(new FormData(contactForm));

    if (!payload.name || !payload.email || !payload.need) {
      if (formStatus) formStatus.textContent = 'Preencha o nome, o e-mail e a área sobre a qual pretende informação.';
      return;
    }

    if (!CONTACT_API_URL) {
      const text = buildPreview(payload);
      if (preparedMessage) preparedMessage.value = text;
      if (preparedMessageWrapper) preparedMessageWrapper.hidden = false;
      if (formStatus) formStatus.textContent = 'Mensagem preparada. Nenhuma aplicação externa foi aberta.';
      preparedMessage?.focus();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'A enviar…';
    }
    if (formStatus) formStatus.textContent = 'A enviar o pedido de contacto…';

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.code || 'DELIVERY_FAILED');

      contactForm.reset();
      if (preparedMessageWrapper) preparedMessageWrapper.hidden = true;
      if (formStatus) formStatus.textContent = 'Pedido enviado com sucesso. Será contactado através dos dados indicados.';
    } catch {
      if (formStatus) {
        formStatus.textContent = 'Não foi possível enviar o pedido neste momento. Tente novamente mais tarde.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar pedido de contacto';
      }
    }
  });
}

if (copyMessageButton && preparedMessage) {
  copyMessageButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(preparedMessage.value);
      if (formStatus) formStatus.textContent = 'Mensagem copiada para a área de transferência.';
    } catch {
      preparedMessage.select();
      document.execCommand('copy');
      if (formStatus) formStatus.textContent = 'Mensagem copiada para a área de transferência.';
    }
  });
}

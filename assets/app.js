const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-nav-links]');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    document.body.classList.toggle('menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    menuButton.textContent = isOpen ? '✕' : '☰';
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
      menuButton.textContent = '☰';
    });
  });
}

const year = document.querySelector('[data-current-year]');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const preparedMessageWrapper = document.querySelector('#prepared-message-wrapper');
const preparedMessage = document.querySelector('#prepared-message');
const copyMessageButton = document.querySelector('#copy-message');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get('nome') || '').trim();
    const email = String(data.get('email') || '').trim();
    const company = String(data.get('empresa') || '').trim();
    const phone = String(data.get('telefone') || '').trim();
    const need = String(data.get('necessidade') || '').trim();
    const preference = String(data.get('preferencia') || 'Sem preferência').trim();
    const message = String(data.get('mensagem') || '').trim();

    if (!name || !email || !need) {
      if (formStatus) {
        formStatus.textContent = 'Preencha o nome, o e-mail e a área sobre a qual pretende informação.';
      }
      return;
    }

    const text = [
      'Pedido de contacto — CT Contabilidade e Gestão',
      '',
      `Nome: ${name}`,
      `E-mail: ${email}`,
      company ? `Empresa/atividade: ${company}` : '',
      phone ? `Telefone/WhatsApp: ${phone}` : '',
      `Área de interesse: ${need}`,
      `Preferência de resposta: ${preference}`,
      message ? `Mensagem: ${message}` : '',
      '',
      'Pedido preparado através do website.'
    ].filter(Boolean).join('\n');

    if (preparedMessage) preparedMessage.value = text;
    if (preparedMessageWrapper) preparedMessageWrapper.hidden = false;
    if (formStatus) {
      formStatus.textContent = 'Mensagem preparada. Nenhuma aplicação externa foi aberta.';
    }

    preparedMessage?.focus();
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

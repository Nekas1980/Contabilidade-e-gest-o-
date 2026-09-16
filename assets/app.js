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

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get('nome') || '').trim();
    const company = String(data.get('empresa') || '').trim();
    const need = String(data.get('necessidade') || '').trim();
    const message = String(data.get('mensagem') || '').trim();

    if (!name || !need) {
      if (formStatus) formStatus.textContent = 'Preencha, pelo menos, o nome e a área sobre a qual pretende informação.';
      return;
    }

    const text = [
      'Olá, CT Contabilidade e Gestão.',
      '',
      `O meu nome é ${name}.`,
      company ? `Empresa/atividade: ${company}.` : '',
      `Pretendo obter informação sobre: ${need}.`,
      message ? `Mensagem: ${message}` : '',
      '',
      'Gostaria de obter informação sobre o acompanhamento disponível para esta situação.'
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/351928207611?text=${encodeURIComponent(text)}`;
    if (formStatus) formStatus.textContent = 'Contacto preparado. A abrir o WhatsApp…';
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

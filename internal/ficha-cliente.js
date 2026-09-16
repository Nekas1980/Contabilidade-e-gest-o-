const statusBox = document.querySelector('#status');
const entitySize = document.querySelector('#entity-size');
const hasEmployees = document.querySelector('#has-employees');
const obligationsBody = document.querySelector('#obligations-body');
const legalSearch = document.querySelector('#legal-search');
const legalResults = document.querySelector('#legal-results');
const associatedLaws = document.querySelector('#associated-laws');

const obligations = [
  { title: 'Modelo 22 — IRC', authority: 'AT', frequency: 'Anual — prazo-base: último dia de maio', payment: 'Pode gerar pagamento', tags: ['irc'] },
  { title: 'IES — Informação Empresarial Simplificada', authority: 'AT', frequency: 'Anual — prazo-base: 15 de julho', payment: 'Não diretamente', tags: ['irc','contabilidade'] },
  { title: 'Declaração periódica de IVA', authority: 'AT', frequency: 'Mensal/trimestral — conforme enquadramento', payment: 'Sim, quando apurado', tags: ['iva'] },
  { title: 'Comunicação dos elementos das faturas', authority: 'AT', frequency: 'Mensal — até dia 5 do mês seguinte', payment: 'Não', tags: ['faturacao'] },
  { title: 'Declaração de remunerações', authority: 'Segurança Social', frequency: 'Mensal — regras em vigor', payment: 'Não', tags: ['trabalho'], employeesOnly: true },
  { title: 'Contribuições da entidade empregadora', authority: 'Segurança Social', frequency: 'Mensal — até dia 25 em 2026', payment: 'Sim', tags: ['trabalho'], employeesOnly: true },
];

const laws = [
  {
    title: 'Sistema de Normalização Contabilística — categorias de entidades',
    summary: 'Define micro, pequenas, médias e grandes entidades. Os novos limites aplicam-se a exercícios iniciados em, ou após, 1 de janeiro de 2026.',
    url: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2009-34517175',
    citation: 'Decreto-Lei n.º 158/2009, artigo 9.º, redação em vigor',
    tags: ['snc','micro','pequena','media','grande','contabilidade'],
  },
  {
    title: 'Modelo 22 — declaração periódica de rendimentos',
    summary: 'Regra geral de entrega da declaração periódica de rendimentos de IRC.',
    url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/CIRC_2R/Pages/irc120.aspx',
    citation: 'Código do IRC, artigo 120.º',
    tags: ['irc','modelo 22'],
  },
  {
    title: 'IES — declaração anual de informação contabilística e fiscal',
    summary: 'Regra geral aplicável à declaração anual de informação contabilística e fiscal.',
    url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/CIRC_2R/Pages/irc121.aspx',
    citation: 'Código do IRC, artigo 121.º',
    tags: ['irc','ies','contabilidade'],
  },
  {
    title: 'IVA — periodicidade da declaração',
    summary: 'Define a periodicidade e os prazos-base da declaração periódica de IVA, sujeitos ao enquadramento concreto.',
    url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/civa_rep/pages/iva41.aspx',
    citation: 'Código do IVA, artigo 41.º',
    tags: ['iva','mensal','trimestral'],
  },
  {
    title: 'IVA — pagamento do imposto',
    summary: 'Define os prazos de pagamento do IVA apurado.',
    url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/civa_rep/Pages/iva27.aspx',
    citation: 'Código do IVA, artigo 27.º',
    tags: ['iva','pagamento'],
  },
  {
    title: 'Portal da Segurança Social — ciclo contributivo',
    summary: 'Informação oficial sobre comunicação e obrigações contributivas das entidades empregadoras.',
    url: 'https://www.seg-social.pt/ptss/pssd/home',
    citation: 'Portal da Segurança Social',
    tags: ['seguranca social','contribuicoes','trabalho'],
  },
];

const associated = new Map();

function showStatus(message) {
  if (!statusBox) return;
  statusBox.textContent = message;
  statusBox.classList.add('show');
  clearTimeout(showStatus.timer);
  showStatus.timer = setTimeout(() => statusBox.classList.remove('show'), 3500);
}

function renderObligations() {
  if (!obligationsBody) return;
  const employees = hasEmployees?.value === 'yes';
  const visible = obligations.filter((item) => !item.employeesOnly || employees);
  obligationsBody.innerHTML = visible.map((item) => `
    <tr>
      <td><strong>${item.title}</strong></td>
      <td>${item.authority}</td>
      <td>${item.frequency}</td>
      <td>${item.payment}</td>
      <td><span class="status-pill">A validar</span></td>
    </tr>
  `).join('');
}

function normalise(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function renderLegalResults() {
  if (!legalResults) return;
  const query = normalise(legalSearch?.value);
  const size = entitySize?.value || '';
  const matches = laws.filter((item) => {
    const haystack = normalise(`${item.title} ${item.summary} ${item.citation} ${item.tags.join(' ')} ${size}`);
    return !query || haystack.includes(query);
  });

  legalResults.innerHTML = matches.length ? matches.map((item, index) => `
    <article class="law-card">
      <h4>${item.title}</h4>
      <p>${item.summary}</p>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">Consultar fonte oficial ↗</a>
      <div class="law-actions"><button type="button" data-associate-law="${laws.indexOf(item)}">Associar à ficha</button></div>
    </article>
  `).join('') : '<p>Sem resultados para esta pesquisa.</p>';
}

function renderAssociated() {
  if (!associatedLaws) return;
  const entries = [...associated.values()];
  associatedLaws.innerHTML = entries.length ? entries.map((item) => `
    <article class="law-card">
      <h4>${item.title}</h4>
      <p>${item.citation}</p>
      <a href="${item.url}" target="_blank" rel="noopener noreferrer">Fonte oficial ↗</a>
    </article>
  `).join('') : '<p>Nenhuma referência associada nesta sessão.</p>';
}

document.querySelector('#refresh-obligations')?.addEventListener('click', () => {
  renderObligations();
  showStatus('Sugestões atualizadas. Validar sempre o enquadramento concreto do cliente.');
});

hasEmployees?.addEventListener('change', renderObligations);
entitySize?.addEventListener('change', renderLegalResults);
document.querySelector('#legal-search-button')?.addEventListener('click', renderLegalResults);
legalSearch?.addEventListener('input', renderLegalResults);

legalResults?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-associate-law]');
  if (!button) return;
  const item = laws[Number(button.dataset.associateLaw)];
  if (!item) return;
  associated.set(item.url, item);
  renderAssociated();
  showStatus('Referência associada apenas ao protótipo desta sessão. A persistência real será feita via API/PostgreSQL.');
});

document.querySelector('#save-demo')?.addEventListener('click', () => {
  showStatus('Protótipo validado localmente. Nenhum dado foi gravado numa base de dados.');
});

renderObligations();
renderLegalResults();
renderAssociated();

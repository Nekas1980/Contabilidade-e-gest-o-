const legalItems = [
  {
    title: 'Categorias de entidades no SNC — limites aplicáveis em 2026',
    type: 'classificacao',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Exercícios iniciados em, ou após, 1 de janeiro de 2026',
    summary: 'Micro: 450 mil € de balanço, 900 mil € de volume de negócios e 10 trabalhadores. Pequena: 5 M€, 10 M€ e 50. Média: 25 M€, 50 M€ e 250. Grande: ultrapassa dois dos três limites das médias.',
    source: 'Diário da República — SNC consolidado, artigo 9.º',
    url: 'https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2009-34517175',
  },
  {
    title: 'Estatuto de micro, pequena e média empresa — certificação PME',
    type: 'classificacao',
    sizes: ['micro', 'pequena', 'media'],
    deadline: 'Consultar regras de certificação em vigor',
    summary: 'A certificação PME segue critérios próprios de efetivos e limiares financeiros. Esta classificação não deve ser confundida automaticamente com as categorias contabilísticas do SNC.',
    source: 'Diário da República — Decreto-Lei n.º 372/2007',
    url: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/372-2007-629439',
  },
  {
    title: 'Modelo 22 — declaração periódica de rendimentos IRC',
    type: 'irc',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Até ao último dia de maio, quando o período de tributação coincide com o ano civil',
    summary: 'A declaração periódica de rendimentos é entregue anualmente por transmissão eletrónica. Períodos de tributação diferentes do ano civil e situações de cessação têm regras próprias.',
    source: 'Autoridade Tributária — CIRC, artigo 120.º',
    url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/CIRC_2R/Pages/irc120.aspx',
  },
  {
    title: 'IES — Informação Empresarial Simplificada',
    type: 'irc',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Até 15 de julho, quando o período de tributação coincide com o ano civil',
    summary: 'A declaração anual de informação contabilística e fiscal é enviada eletronicamente. Existem regras específicas para períodos diferentes do ano civil e para cessação.',
    source: 'Autoridade Tributária — CIRC, artigo 121.º',
    url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/CIRC_2R/Pages/irc121.aspx',
  },
  {
    title: 'IVA — entrega da declaração periódica',
    type: 'iva',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Prazo-base: dia 20 do 2.º mês seguinte ao período',
    summary: 'No regime normal, a periodicidade mensal ou trimestral depende do enquadramento. O limiar de referência do artigo 41.º é 650 000 € de volume de negócios do ano anterior, sem prejuízo de opções e regras especiais.',
    source: 'Autoridade Tributária — CIVA, artigo 41.º',
    url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/civa_rep/pages/iva41.aspx',
  },
  {
    title: 'IVA — pagamento do imposto apurado',
    type: 'iva',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Prazo-base: dia 25 do 2.º mês seguinte ao período',
    summary: 'O pagamento do IVA apurado acompanha a periodicidade aplicável. O IVA de junho e do 2.º trimestre beneficia da regra especial de pagamento até 25 de setembro prevista no Código do IVA.',
    source: 'Autoridade Tributária — CIVA, artigo 27.º',
    url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/civa_rep/Pages/iva27.aspx',
  },
  {
    title: 'Faturação — emissão de fatura',
    type: 'faturacao',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Em regra, até ao 5.º dia útil seguinte ao momento em que o imposto é devido',
    summary: 'As transmissões de bens e prestações de serviços abrangidas pelas regras de faturação exigem emissão de fatura nos termos do Código do IVA, com exceções e regras específicas para determinadas operações.',
    source: 'Autoridade Tributária — CIVA, artigo 36.º',
    url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/civa_rep/pages/iva36.aspx',
  },
  {
    title: 'Comunicação à AT dos elementos das faturas',
    type: 'faturacao',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Até ao dia 5 do mês seguinte à emissão',
    summary: 'Os elementos dos documentos emitidos sujeitos às regras portuguesas de faturação devem ser comunicados à AT pelas vias legalmente admitidas, incluindo webservice e ficheiro estruturado quando aplicável.',
    source: 'Autoridade Tributária — e-Fatura, comunicação de elementos',
    url: 'https://info.portaldasfinancas.gov.pt/pt/faturas/Pages/faqs-00978.aspx',
  },
  {
    title: 'Declaração Mensal de Remunerações — AT',
    type: 'trabalho',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Mensal; confirmar o dia concreto no calendário fiscal oficial de 2026',
    summary: 'As entidades devedoras de rendimentos de trabalho dependente estão sujeitas à DMR-AT nos termos aplicáveis. Em 2026 foram aprovadas instruções atualizadas de preenchimento.',
    source: 'Autoridade Tributária — Portaria n.º 69/2026/1 e calendário fiscal',
    url: 'https://info.portaldasfinancas.gov.pt/pt/atualidades/legislativa/Paginas/portaria-69-2026-1.aspx',
  },
  {
    title: 'Segurança Social — declaração de remunerações',
    type: 'seguranca-social',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Do dia 1 ao dia 10 do mês seguinte; se dia 10 não for útil, aplica-se a regra indicada pela Segurança Social',
    summary: 'A entidade empregadora ou mandatário entrega a declaração de remunerações relativa ao mês anterior através dos canais da Segurança Social.',
    source: 'Segurança Social — Guia Prático da Declaração de Remunerações',
    url: 'https://www.seg-social.pt/documents/10152/14957/Entrega_Decaracao_Remuneracoes_DMR',
  },
  {
    title: 'Segurança Social — pagamento das contribuições das entidades empregadoras',
    type: 'seguranca-social',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Até ao dia 25 de cada mês, desde 2026',
    summary: 'O prazo limite geral de pagamento das contribuições das entidades empregadoras foi alargado em 2026 do dia 20 para o dia 25 de cada mês.',
    source: 'Segurança Social — informação publicada em 4 de fevereiro de 2026',
    url: 'https://www.seg-social.pt/ptss/pssd/noticias/novo-prazo-pagamento-contribuicoes-seguranca-social',
  },
  {
    title: 'Calendário fiscal 2026 — obrigações declarativas',
    type: 'irc',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Consultar mensalmente',
    summary: 'Quadro anual da AT com datas de obrigações declarativas, incluindo DMR, IVA, comunicação de faturas, IES e outras obrigações.',
    source: 'Autoridade Tributária — calendário fiscal 2026',
    url: 'https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/calendario_fiscal/Pages/Quadro_res_Decl_2026.aspx',
  },
  {
    title: 'Calendário fiscal 2026 — obrigações de pagamento',
    type: 'irc',
    sizes: ['micro', 'pequena', 'media', 'grande'],
    deadline: 'Consultar mensalmente',
    summary: 'Quadro anual da AT com datas de pagamento de IRC, IVA, retenções e outros impostos. Os pagamentos por conta de IRC têm datas próprias em cada ano.',
    source: 'Autoridade Tributária — calendário de pagamentos 2026',
    url: 'https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/calendario_fiscal/Pages/Quadro_res_Pag_2026.aspx',
  },
];

const labels = {
  classificacao: 'Classificação',
  irc: 'IRC',
  iva: 'IVA',
  faturacao: 'Faturação',
  trabalho: 'Trabalho e remunerações',
  'seguranca-social': 'Segurança Social',
};

const form = document.querySelector('#legal-search-form');
const queryInput = document.querySelector('#legal-query');
const sizeSelect = document.querySelector('#legal-size');
const typeSelect = document.querySelector('#legal-type');
const results = document.querySelector('#legal-results');
const summary = document.querySelector('#legal-summary');

function normalise(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function render() {
  const query = normalise(queryInput?.value);
  const size = sizeSelect?.value || 'all';
  const type = typeSelect?.value || 'all';

  const filtered = legalItems.filter((item) => {
    const haystack = normalise(`${item.title} ${item.summary} ${item.deadline} ${item.source} ${labels[item.type] || ''}`);
    const matchesQuery = !query || haystack.includes(query);
    const matchesSize = size === 'all' || item.sizes.includes(size);
    const matchesType = type === 'all' || item.type === type;
    return matchesQuery && matchesSize && matchesType;
  });

  if (summary) {
    summary.textContent = `${filtered.length} resultado${filtered.length === 1 ? '' : 's'} encontrado${filtered.length === 1 ? '' : 's'}.`;
  }

  if (!results) return;

  if (!filtered.length) {
    results.innerHTML = '<div class="legal-empty">Não foram encontrados resultados. Experimente outro termo ou retire um dos filtros.</div>';
    return;
  }

  results.innerHTML = filtered.map((item) => `
    <article class="legal-result-card">
      <div class="legal-result-meta">
        <span>${labels[item.type] || item.type}</span>
        <span>${item.sizes.map((sizeName) => sizeName.charAt(0).toUpperCase() + sizeName.slice(1)).join(' · ')}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="legal-deadline"><strong>Prazo / referência:</strong> ${item.deadline}</div>
      <a class="legal-source" href="${item.url}" target="_blank" rel="noopener noreferrer">Consultar fonte oficial — ${item.source}</a>
    </article>
  `).join('');
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  render();
});

queryInput?.addEventListener('input', render);
sizeSelect?.addEventListener('change', render);
typeSelect?.addEventListener('change', render);

render();

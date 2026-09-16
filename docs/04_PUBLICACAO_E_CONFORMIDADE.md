# Publicação e Conformidade — CT Contabilidade e Gestão

Este documento deve ser validado antes de colocar a nova versão em produção.

## 1. Dados profissionais a confirmar

Antes da publicação definitiva, confirmar com a profissional responsável:

- nome profissional ou denominação usada na atividade;
- nome da pessoa ou entidade responsável pelo site;
- NIF/NIPC, quando deva ser publicamente apresentado;
- morada profissional, quando aplicável;
- telefone;
- e-mail;
- horário de atendimento, se for divulgado;
- área geográfica de atendimento;
- eventual qualidade de Contabilista Certificada e forma correta de a apresentar;
- eventual número profissional ou outros elementos que a profissional considere necessário divulgar.

**Não inventar nem presumir estes dados.**

## 2. Conteúdo profissional

Rever com a contabilista:

- designação exata de cada serviço;
- serviços que efetivamente presta;
- público-alvo;
- expressões relacionadas com fiscalidade;
- eventuais limitações de serviço;
- áreas em que o primeiro contacto necessita de análise prévia.

Evitar promessas absolutas como:

- “garantimos poupança fiscal”;
- “pagará menos impostos”;
- “aumentamos os seus lucros”.

Preferir linguagem de processo e valor:

- planeamento;
- organização;
- acompanhamento;
- informação para decisão;
- cumprimento de obrigações aplicáveis.

## 3. Privacidade

### Estado técnico atual

O formulário do site:

- não envia dados para um servidor próprio;
- não grava informação numa base de dados;
- não utiliza armazenamento próprio para os dados preenchidos;
- prepara localmente a mensagem que o utilizador pode enviar através do WhatsApp.

### Importante

Quando o utilizador decide abrir ou enviar a mensagem por WhatsApp, passa a utilizar um serviço externo sujeito às respetivas condições e política de privacidade.

O mesmo se aplica ao envio por e-mail.

### Antes de adicionar analytics

Não adicionar Google Analytics, Meta Pixel ou tecnologia semelhante sem avaliar previamente:

- necessidade real;
- cookies utilizados;
- base de licitude;
- consentimento quando aplicável;
- política de privacidade;
- mecanismo de gestão de preferências.

## 4. Política de privacidade

Antes de criar uma política pública definitiva, recolher os dados do responsável pelo tratamento e validar o conteúdo com a profissional.

Uma política não deve ser copiada de outro site sem adaptação.

Deve refletir o funcionamento real do projeto.

## 5. Segurança

Checklist mínima:

- [x] Sem passwords no repositório.
- [x] Sem API keys no frontend.
- [x] Sem base de dados pública.
- [x] Sem recolha desnecessária de dados.
- [x] Links externos com proteção adequada quando abertos em nova janela.
- [ ] Ativar HTTPS no domínio final.
- [ ] Confirmar domínio e DNS.
- [ ] Testar todos os links antes da publicação.
- [ ] Rever dependências futuras antes de as adicionar.

## 6. Domínio

Para utilização profissional é recomendável um domínio próprio em vez de depender apenas do endereço GitHub Pages.

Exemplo conceptual:

```text
ctcontabilidade.pt
```

ou outra designação validada pela profissional.

Antes de escolher:

- verificar disponibilidade;
- confirmar se a marca/nome é adequado;
- escolher uma entidade registradora credível;
- configurar DNS;
- ativar HTTPS;
- configurar endereço de e-mail profissional, se pretendido.

## 7. E-mail profissional

O site utiliza atualmente:

`ctcontabilidadeegestao@gmail.com`

Uma evolução possível após domínio próprio:

```text
geral@dominio.pt
contacto@dominio.pt
```

Isto pode reforçar a apresentação institucional.

## 8. SEO antes da publicação

Confirmar:

- [ ] título da página;
- [ ] descrição;
- [ ] nome correto da atividade;
- [ ] contactos;
- [ ] localidade/área de serviço, se a profissional quiser posicionamento local;
- [ ] dados estruturados Schema.org;
- [ ] favicon;
- [ ] imagem de partilha Open Graph;
- [ ] `robots.txt`;
- [ ] `sitemap.xml` após definir o domínio final.

Não criar um sitemap com URL provisório se o domínio definitivo ainda não estiver escolhido.

## 9. Testes funcionais

Testar em pelo menos:

- Chrome/Chromium;
- Firefox;
- navegador mobile.

### Fluxos

- [ ] menu desktop;
- [ ] menu mobile;
- [ ] todos os links internos;
- [ ] WhatsApp direto;
- [ ] formulário → WhatsApp;
- [ ] e-mail;
- [ ] FAQ;
- [ ] navegação por teclado;
- [ ] redimensionamento do ecrã.

## 10. Testes de conteúdo

Pedir à contabilista para validar:

- [ ] nome/marca;
- [ ] contactos;
- [ ] serviços;
- [ ] tom de comunicação;
- [ ] perguntas frequentes;
- [ ] chamada à ação;
- [ ] dados legais/profissionais.

## 11. Desempenho

Após publicação, avaliar com Lighthouse ou ferramenta equivalente:

- Performance;
- Accessibility;
- Best Practices;
- SEO.

A pontuação não deve ser tratada como objetivo isolado. O importante é investigar problemas reais apontados pela ferramenta.

## 12. Fluxo recomendado de publicação

```text
1. Desenvolver em branch
2. Rever alterações
3. Validar conteúdo com a contabilista
4. Testar
5. Corrigir
6. Aprovar Pull Request
7. Merge para main
8. Publicar
9. Testar em produção
10. Registar melhorias futuras em issues
```

## 13. Manutenção

Rever periodicamente:

- contactos;
- serviços;
- legislação/conteúdo fiscal apresentado;
- links;
- compatibilidade mobile;
- informação profissional;
- necessidades de novas funcionalidades.

O website não deve publicar automaticamente conteúdo fiscal ou legal sem revisão humana qualificada.

## 14. Próximas evoluções possíveis

Apenas se houver valor de negócio:

- domínio próprio;
- e-mail no domínio;
- página de serviços detalhada;
- marcação de reunião;
- botão para guardar contacto;
- integração com Google Business Profile;
- mapa/localização, se existir atendimento presencial;
- testemunhos reais e autorizados;
- área de notícias/conteúdo;
- backend para pedidos, caso passe a existir necessidade operacional;
- CRM, caso o volume de contactos justifique.

## 15. Regra principal

**A funcionalidade deve seguir a necessidade do negócio.**

Não adicionar tecnologia apenas para tornar o projeto aparentemente mais complexo. Num projeto profissional, simplicidade, manutenção e fiabilidade também são decisões de engenharia.

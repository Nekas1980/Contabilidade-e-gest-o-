# Ficha de cliente e folha fiscal interna

## Objetivo

Criar um módulo interno para acompanhar cada cliente da CT Contabilidade e Gestão sem expor dados pessoais no website público.

A ficha destina-se a utilização autenticada futura e não é publicada pelo GitHub Pages.

## Estrutura da ficha

### 1. Identificação

- código interno;
- nome/firma;
- NIF/identificador fiscal;
- país fiscal;
- forma jurídica;
- CAE principal e secundários;
- contactos, através das tabelas já existentes.

### 2. Folha fiscal

- dimensão da entidade;
- referencial contabilístico;
- regime de IVA;
- periodicidade de IVA;
- enquadramento de IRC;
- existência de trabalhadores;
- número de entidade empregadora quando aplicável;
- serviço de finanças/código interno de referência;
- data de início/cessação de atividade;
- mês de encerramento do exercício;
- indicação de certificação PME, quando confirmada;
- data da última revisão.

## Limites SNC 2026

Para exercícios iniciados em, ou após, 1 de janeiro de 2026, o artigo 9.º do Decreto-Lei n.º 158/2009, na redação dada pelo Decreto-Lei n.º 126-B/2025, utiliza os seguintes critérios:

- microentidade: balanço 450 000 €, volume de negócios líquido 900 000 €, 10 empregados;
- pequena entidade: 5 000 000 €, 10 000 000 €, 50 empregados;
- média entidade: 25 000 000 €, 50 000 000 €, 250 empregados;
- grande entidade: ultrapassa dois dos três limites aplicáveis às médias entidades.

A classificação deve ser validada no contexto concreto e não deve ser confundida automaticamente com a certificação PME.

Fonte oficial: https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2009-34517175

## Obrigações e pagamentos

A tabela `ct_app.client_obligations` permite associar obrigações ao cliente com:

- categoria;
- entidade responsável (AT, Segurança Social, IRN ou outra);
- periodicidade;
- regra de prazo;
- próxima data;
- indicação se envolve pagamento;
- estado;
- fundamento legal;
- ligação oficial;
- data da última validação;
- notas.

O campo `next_due_date` deve ser calculado/confirmado pelo backend ou profissional responsável, porque feriados, adiamentos, enquadramentos especiais e alterações legislativas podem modificar o prazo concreto.

## Referências legais por cliente

A tabela `ct_app.client_legal_references` guarda referências, não cópias integrais da legislação.

Campos principais:

- título;
- citação/fundamento;
- URL oficial;
- tema;
- período de vigência quando conhecido;
- data da última validação;
- notas específicas do cliente.

Isto permite saber qual a base legal usada numa decisão sem transformar a aplicação numa cópia potencialmente desatualizada da lei.

## Portais oficiais

A ficha inclui atalhos para:

- Portal das Finanças: https://www.portaldasfinancas.gov.pt/
- Portal da Segurança Social: https://www.seg-social.pt/ptss/pssd/home
- Diário da República: https://diariodarepublica.pt/

Estes atalhos apenas abrem os serviços oficiais. A aplicação não armazena credenciais.

## Regra de segurança crítica

Nunca guardar na base de dados ou no repositório:

- password do Portal das Finanças;
- password da Segurança Social;
- códigos de Chave Móvel Digital;
- PIN de Cartão de Cidadão;
- códigos 2FA;
- tokens de sessão;
- respostas de recuperação;
- screenshots que revelem credenciais.

Quando a aplicação necessitar de integração oficial com um serviço externo, deverá utilizar mecanismos de autorização suportados pelo respetivo serviço, segregação de segredos e consentimento adequado.

## PostgreSQL

O script `database/06_client_fiscal_module.sql` cria:

- `ct_app.client_fiscal_profiles`;
- `ct_app.client_obligations`;
- `ct_app.client_legal_references`.

Inclui:

- foreign keys;
- constraints;
- índices;
- `updated_at` triggers;
- RLS + FORCE RLS;
- políticas por perfil;
- permissões do role runtime;
- auditoria das alterações.

O perfil `technical` continua sem acesso normal aos dados fiscais de clientes.

## Protótipo interno

`internal/ficha-cliente.html` demonstra a experiência pretendida usando apenas dados fictícios.

A pasta `internal/` não é copiada para o artefacto do GitHub Pages.

O botão `Validar alterações` do protótipo não grava dados. A persistência real exige:

1. autenticação;
2. backend/API;
3. contexto de organização/utilizador;
4. queries parametrizadas;
5. PostgreSQL testado com RLS;
6. autorização por função;
7. registo de auditoria.

## Próxima API interna

Endpoints previstos, após autenticação:

```text
GET  /api/clients/:id
GET  /api/clients/:id/fiscal-profile
PUT  /api/clients/:id/fiscal-profile
GET  /api/clients/:id/obligations
POST /api/clients/:id/obligations
PUT  /api/clients/:id/obligations/:obligationId
GET  /api/clients/:id/legal-references
POST /api/clients/:id/legal-references
```

Cada request deve validar a identidade, organização e função antes de definir o contexto RLS da transação.

# Base de Dados e Segurança — Manual de Estudo

## 1. Objetivo profissional

Esta evolução transforma o projeto CT Contabilidade e Gestão num laboratório prático que combina desenvolvimento web, PostgreSQL e segurança aplicacional.

O objetivo não é apenas criar tabelas. É conseguir explicar como proteger uma aplicação que poderá trabalhar com informação profissional e, numa fase posterior, eventualmente dados de clientes.

## 2. Arquitetura em três camadas

```text
Frontend -> API -> PostgreSQL
```

### Frontend
Apresenta a interface. Não conhece a password da base de dados e não decide sozinho a que registos o utilizador tem acesso.

### API
É a fronteira de segurança da aplicação. Autentica, autoriza, valida inputs e executa operações parametrizadas.

### PostgreSQL
Mantém integridade, constraints, relações, RLS e auditoria. Funciona como segunda linha de defesa caso exista um erro na API.

## 3. Porque não ligar JavaScript diretamente ao PostgreSQL

Código enviado para o browser pode ser observado pelo utilizador. Qualquer credencial incluída no frontend deixa de ser secreta.

Uma base exposta diretamente também aumenta drasticamente a superfície de ataque.

Por isso, o desenho correto é:

```text
Browser -> HTTPS -> API -> PostgreSQL
```

## 4. Schemas

O projeto usa:

- `ct_app` — dados funcionais;
- `ct_audit` — rastreabilidade.

Separar schemas melhora organização e permite aplicar privilégios diferentes.

## 5. Integridade relacional

São usados:

- Primary Keys;
- Foreign Keys;
- `NOT NULL`;
- `UNIQUE`;
- `CHECK`;
- índices.

Segurança não é apenas impedir ataques. Integridade também significa impedir estados de dados inválidos.

## 6. UUID

As entidades principais usam UUID.

Vantagens para este projeto:

- identificadores difíceis de enumerar sequencialmente;
- adequados a APIs;
- independentes de sequência global visível.

UUID não é um mecanismo de autorização. Saber ou não saber um ID nunca substitui controlo de acesso.

## 7. RBAC

RBAC significa Role-Based Access Control.

O modelo prevê perfis como:

- owner;
- accountant;
- assistant;
- technical;
- read_only.

Um perfil descreve o tipo de responsabilidade. A API deverá traduzir esse perfil em permissões concretas.

Exemplo:

```text
accountant -> consultar/gerir informação profissional autorizada
assistant  -> operações administrativas limitadas
technical  -> manutenção técnica sem acesso funcional desnecessário
read_only  -> consulta autorizada sem alteração
```

O princípio central é **least privilege**: cada identidade recebe apenas os acessos necessários.

## 8. Row-Level Security (RLS)

RLS permite que o PostgreSQL limite linhas em função do contexto da sessão.

Neste projeto, as tabelas operacionais possuem `organization_id`.

A API define, dentro de uma transação, qual a organização já validada para aquele utilizador. As policies permitem apenas linhas dessa organização.

Isto cria defesa em profundidade:

```text
API autoriza -> primeira barreira
RLS PostgreSQL -> segunda barreira
```

Um erro de query na aplicação não deve transformar automaticamente uma consulta num acesso global a todos os clientes.

## 9. FORCE ROW LEVEL SECURITY

O projeto força RLS nas tabelas protegidas. Isto torna o comportamento mais consistente e reduz exceções implícitas relacionadas com ownership da tabela.

Contas administrativas e de migração devem continuar separadas da conta usada pela aplicação em runtime.

## 10. Auditoria

A auditoria regista:

- momento do evento;
- organização;
- utilizador;
- ação;
- tabela;
- ID do registo;
- request/correlation ID;
- nomes de colunas alteradas numa atualização.

O trigger não guarda automaticamente `OLD` e `NEW` completos.

Razão: copiar linhas completas para logs pode duplicar dados pessoais ou sensíveis e aumentar o impacto de uma fuga de logs.

## 11. Autenticação

A tabela `app_users` não possui `password`.

O campo `auth_subject` está preparado para mapear uma identidade autenticada por um mecanismo próprio da API ou por um Identity Provider.

Se uma aplicação gerir passwords diretamente, estas nunca devem ser guardadas em texto simples nem com hashes rápidos inadequados.

## 12. Gestão de segredos

Segredos incluem:

- password de PostgreSQL;
- connection strings;
- chaves de API;
- chaves de assinatura;
- tokens;
- chaves criptográficas.

Não devem existir no repositório Git.

Devem ser provisionados por mecanismos de configuração/secret management com privilégios mínimos e possibilidade de rotação.

## 13. Queries parametrizadas

O backend não deve construir SQL concatenando diretamente texto recebido do utilizador.

Conceito inseguro:

```text
"SELECT ... WHERE email = '" + input + "'"
```

Conceito correto:

```text
SELECT ... WHERE email = $1
```

com o valor enviado separadamente ao driver.

Isto reduz o risco de SQL Injection.

## 14. Documentos

O modelo atual guarda apenas metadados de documentos.

Se futuramente forem recebidos documentos reais:

- armazenamento privado;
- autorização antes de download;
- nomes de ficheiro não usados diretamente como caminhos;
- validação de tipo/tamanho;
- análise de malware quando adequada;
- encriptação e backups conforme o risco;
- registo de acesso;
- política de retenção.

Nunca guardar documentos profissionais num repositório Git público.

## 15. Dados de teste

O ficheiro `04_seed_demo.sql` utiliza apenas identidades fictícias e domínios `.invalid`.

Um portefólio público deve demonstrar estrutura e competências sem expor informação de clientes reais.

## 16. Threat model inicial

Ameaças a considerar quando for criada a API:

1. credenciais expostas;
2. SQL Injection;
3. Broken Access Control;
4. acesso de um cliente a dados de outro;
5. sessões roubadas;
6. brute force/login abuse;
7. upload malicioso;
8. logs com informação sensível;
9. backups sem proteção;
10. conta de aplicação com privilégios excessivos;
11. dependências vulneráveis;
12. configuração incorreta de CORS/TLS/headers.

## 17. Testes que devem existir

### Integridade
- FK inválida é rejeitada;
- estados fora dos `CHECK` são rejeitados;
- duplicados proibidos falham.

### RLS
- organização A vê A;
- organização A não vê B;
- sem contexto não há acesso funcional;
- um UUID recebido do browser não altera o contexto autorizado.

### Auditoria
- INSERT gera evento;
- UPDATE regista colunas alteradas;
- DELETE gera evento;
- auditoria não expõe conteúdo integral do registo.

### API futura
- autenticação obrigatória;
- autorização por perfil;
- inputs inválidos rejeitados;
- SQL Injection não altera queries;
- rate limiting;
- erros não revelam stack traces/segredos.

## 18. Competências de portefólio

Depois desta fase, o projeto pode demonstrar:

- modelação PostgreSQL;
- normalização relacional;
- constraints e índices;
- PL/pgSQL;
- triggers;
- auditoria;
- RBAC;
- Row-Level Security;
- multi-tenant isolation;
- security by design;
- privacy by design;
- threat modeling;
- Git/GitHub;
- documentação técnica.

## 19. Como explicar numa entrevista

> Evoluí um website institucional real para uma arquitetura preparada para backend e PostgreSQL. Modelei a base com schemas separados, relações e constraints e acrescentei defesa em profundidade através de Row-Level Security e auditoria. Mantive os dados reais fora do laboratório e desenhei a autenticação de forma a não guardar passwords no modelo aplicacional. O próximo passo é implementar uma API com autorização, queries parametrizadas e testes de isolamento.

## 20. Próximo módulo de estudo

A próxima fase deve ser a API.

Conteúdos:

1. HTTP/REST;
2. Node.js/TypeScript ou outra stack escolhida;
3. ligação PostgreSQL com pool;
4. queries parametrizadas;
5. migrations;
6. autenticação;
7. RBAC;
8. transactions;
9. contexto RLS;
10. logging;
11. testes;
12. deployment e secrets.

# Módulo Jurídico: briefing

## A demanda como ela veio

> na minha maquina, em pesquisas, ha uma pesquisa feita sobre modulo juridico eua/brasil
>
> com pesquisa de mercado de como trabalhar com um modulo juridico.
>
> faça um prototipo de um modulo juridico pro enspace a partir do que está pesquisado ali.
>
> mas cuidado: deve haver diferença entre modulo e caso de uso. se ele simplesmente for um caso de uso e nao trouxer
> ganho como modulo, nao ha funcionalidades a criar. apenas uma configuraçao do enspace a salvar e permitir ser
> replicada.

(Redatora, 2026-10-26.)

- **Tela ou jornada em jogo:** Configurações › Sistema › Módulos (a chave "Juridico") e o que ela liga: o menu do
  membro, a tela do item de processo e as telas próprias do módulo.
- **Sucesso:** quem cuida do contencioso recebe a intimação, confere o prazo que o ENSPACE calculou pela regra do rito
  e do tribunal, e não digita data nenhuma; o resto do jurídico chega como caso de uso, sem funcionalidade nova.

### Rodada 3: submódulos, começando por Capturas

> acredito que o módulo do enspace juridico, primeiro falando só em brasil, precisa ter "submodulos" a serem
> ativados. o primeiro deles é o de capturas. e capturas precisa tratar capturas + prazos. vamos nos ater a esse escopo
> primeiro (nao precisa deletar nada que botou ali, só ocultar por enquanto e vamos liberando aos poucos construindo o
> prototipo) primeiro faça um submodulo pra dar conta de TUDO o que seja preciso em capturas, sabendo que hoje ja temos
> uma automaçao de capturas que os clientes contratam. se precisar pesquisa /deep-research sobre capturas em sistemas
> (softwares) juridicos

(Redatora, 2026-10-26.)

- **Tela ou jornada em jogo:** Sistema › Módulos (os submódulos do Jurídico), Jurídico › Capturas, a página do módulo
  (Fontes, Termos monitorados, Destino) e a aba Capturas do processo.
- **Sucesso:** tudo o que o robô de captura traz hoje, e o que o fornecedor do cliente manda, chega numa caixa só, com
  a fonte, o termo e a prova de chegada; quem trata vê se alguma fonte parou, e o prazo sai calculado pela data certa.

### Rodada 4: o escopo de Capturas fechado

Antes do pedido, 2 perguntas:

> a captura cita processos e citações. o proprio modulo nao deveria ter uma tela entao propria de processos e
> citações? ou acha que processos de fato deve ser uma categoria, nesse caso, configurada automaticamente quando ativa
> o modulo? nao tenda a concordar. responda analiticamente. --- depois, responda: após a captura, como sao tratadas as
> citaçoes? e apos a captura, qual o restante do processo operacional? pra pensar quais seriam os proximos submodulos ou
> mesmo qual o escopo final do modulo de capturas

> nesse caso, nao faria mais sentido entao fazermos um MÓDULO contencioso? e ja trazer ali todas as funcionalidades que
> um contencioso precisa? ou capturas serve a outras areas do juridico tambem e deveria seguir separada?

A resposta, em resumo:
- o processo continua item de categoria, ligada ao ligar o submódulo; a citação é uma visualização da caixa, e o
  andamento vira aba do processo;
- o que liga é o módulo Jurídico com submódulos; o que se vende é o pacote Contencioso. A aba Destino fica como a porta
  para a fonte que alimenta outra categoria.

O pedido:

> sua recomendaçao faz todo sentido --- no mais, pode fechar o escopo do submódulo de capturas e lidar com esses
> pontos que trouxe tambem de recomendaçao

Os pontos colados com ele:
- a visualização Citações, ordenada por "Confirmar até";
- a citação que lê a audiência e escolhe a regra de contagem: art. 335, Juizado Especial ou CLT;
- a audiência como compromisso que nasce da captura e entra na Agenda, sem cálculo;
- a ligação com a categoria de processos, feita ao ligar o submódulo;
- o andamento como aba do processo, no lugar da categoria;
- os eventos para o Spaceflow: captura tratada, citação confirmada, processo cadastrado e andamento por tipo;
- opcional: obter a petição inicial junto com a distribuição ou a citação.

(Redatora, 2026-10-26.)

- **Tela ou jornada em jogo:** Jurídico › Capturas (visualização Citações e o painel da citação), a Agenda, a tela do
  processo (aba Andamentos e a próxima audiência), Sistema › Módulos (ligar Capturas) e a página do módulo (Destino e
  Eventos).
- **Sucesso:** a citação sai da caixa com a regra certa de contagem, a audiência na Agenda e o processo cadastrado; o
  que vem depois (subsídios, escritório, preposto) começa por evento, como configuração.

### Rodada 5: o processo como assunto

A redatora trouxe a proposta de modelo de dados nativo do ENSPACE (documento interno de 2026-10-27: camadas de
objetos nativos, campos com chave nativa estável, `Matter` como assunto e `Litigation` como especialização dele):

> agora observe este documento ele é uma proposta modular pra modulo juridico. comparando o que voce ja fez com isso, o
> que mudaria e o que incluiria?

> nao precisa seguir a risca o documento. se tiver coisa que no seu ta melhor, com base em pesquisas etc, só defender
> que mantenhamos

A resposta, em resumo:
- fica o que a pesquisa da rodada 1 sustenta: o prazo com regra e memória, a caixa de revisão, a provisão por
  data-base, a categoria que o cliente liga, os campos obrigatórios só para ligar e os casos de uso como modelo;
- muda o modal de ligação (chave nativa por campo), a parte contrária e o escritório (relação com organização) e os
  dados dos eventos (chave nativa);
- um ajuste: o processo herda os campos de assunto no mesmo item, sem um assunto pai para cada processo.

Sobre o ajuste:

> nao acha que isso prejudica o modo de registro em ELM americano? fica fora de logica pra eles, nao? ou a gente teria
> que ter uma chave que muda essa estrutura centralizando o processo? ou isso fica mais dificil ainda, tecnicamente
> falando? no codigo

A resposta trouxe 3 caminhos, do mais barato ao mais caro:
1. herança com assunto pai opcional: o processo é um assunto do tipo processo, e o campo "Assunto principal" agrupa
   processos quando a empresa quer;
2. composição 1 para 1: 2 registros que a tela mostra como 1;
3. uma chave por workspace que muda a estrutura: migração nos 2 sentidos e 2 caminhos em todo código que lê o dado.

O pedido:

> pode fazer a 1

(Redatora, 2026-10-27.)

- **Tela ou jornada em jogo:** Sistema › Módulos (o modal "Ligar o submódulo Capturas"), a Visão Geral do processo, a
  lista de Processos e a categoria nova Assuntos (lista e item).
- **Sucesso:** o contencioso de massa continua com 1 item por processo, sem configurar nada a mais; quem trabalha como o
  ELM americano agrupa os processos de uma disputa num assunto e vê a soma deles; o dev lê no modal qual chave nativa
  cada campo ocupa.

### Rodada 6: as categorias do módulo no menu Jurídico

O pedido:

> matter realmente deveria ser uma categoria?
>
> quando ativar o modulo, mesmo o que for uma CATEGORIA, deve aparecer dentro do menu do módulo, mas pode botar uma
> badge indicando q é catgoria pra gente saber se orientar
>
> mas vai ser um menu criado com o caminho da tela de categoria,automaticamente

> tudo junto do menu juridico, tudo dentro dele, q aparece com o modulo ativado

(Redatora, 2026-10-27.)

- **Tela ou jornada em jogo:** o menu lateral do membro, grupos Jurídico e Categorias.
- **Sucesso:** com o módulo ligado, quem trabalha no jurídico acha tudo dentro de Jurídico, sabe o que é categoria e
  cai na mesma tela de categoria que já conhece; com o módulo desligado, o menu é o de hoje.

## A fonte: a pesquisa de mercado de 2026-10-24

Relatório `pesquisa-de-mercado/runs/2026-10-24-modulo-juridico-brasil-eua/RELATORIO.md` e a nota
`evidencias/enspace-modulos-e-casos-de-uso.md` (só leitura, repositório vizinho). O que este protótipo usa:

- **Módulo e caso de uso já são 2 coisas no ENSPACE.** Módulo é uma chave do workspace (`modules`:
  `monetary_correction`, `comparisons`, `en-legal`) que liga comportamento em telas que existem. Caso de uso é um
  pacote de estrutura (categorias, campos, formulários, fluxos, menus) que se exporta e se importa. Um não liga o outro
  (nota ENS §1).
- **O módulo leva os motores; o pacote do país leva dado.** "O módulo traz os motores, iguais nos 2 países: prazos com
  regra declarada, correção com séries de índices versionadas, validação de fatura, conta fiduciária e trilha de
  auditoria só de acréscimo" (Recomendação 1). O pacote Brasil traz regras de rito, calendário por tribunal, DJEN e
  Domicílio, provisão pelo CPC 25 (Recomendação 5).
- **Tabela 1 (8 áreas):** consultivo é núcleo comum; contratos, procurações, societário, marcas e canal de denúncias
  são parâmetro por país; contencioso e pagamentos jurídicos são pacote por país.
- **Tabela 3 (exigências brasileiras):** contagem por rito, calendário por órgão, DJEN e Domicílio e provisão pelo CPC
  25 são "antes" da venda, porque sem elas "o produto erra um resultado com efeito jurídico (prazo, cálculo,
  assinatura)".
- **Sigilo, barreira, MFA, trilha, canal anônimo** são "o que a plataforma garante (vale em todo país)", na coluna da
  plataforma, não na do pacote.
- **Defeitos de plataforma que o módulo herda:** prazo de tarefa em UTC mostra o dia anterior em Brasília; C44 (o achado
  de QA em que o prazo em dias úteis cai no fim de semana); S3-F3 e S3-F2 (feriados de Brasil e EUA misturados e
  calendário sem dia útil); importação que duplica categoria (RN002).

## O que a pesquisa de UX já dizia

Busca em `enspace-ux-research` (temas, `UX_REPORT.md`) por jurídico, módulo, prazo, intimação e feriado:

- **S3-F3 (P1):** "Sincronizar Feriados" grava feriados do Brasil e dos EUA misturados, em 2 idiomas, sem escolher
  país, sem listar o que gravou e sem desfazer. Bloqueia dias úteis brasileiros. É a base de qualquer prazo em dias
  úteis.
- **S3-F2 (P2):** o Calendário nasce sem dia útil e pinta o mês inteiro de "Dia Não Útil".
- **Auditoria de Configurações › Sistema:** os 3 toggles de Módulos foram vistos, sem fricção própria registrada.
- Nada sobre intimação, prazo processual ou provisão: o tema jurídico nunca foi auditado.
- **Rodada 3**, busca por captura, publicação, intimação e triagem:
  - **C3 (P1)** da auditoria do construtor de telas: o tooltip do campo Tipo não explica nenhum dos 13 tipos; ninguém
    diz o que a tela Triagem faz;
  - **U2 (P1)**, mesma auditoria: Triagem e Minhas Requisições renderizam a mesma tela ("Respostas de Formulários",
    as mesmas 7 colunas). É nessa tela que a captura de hoje cai;
  - nada sobre fonte de captura, termo monitorado ou saúde da captura.

## O que o develop faz hoje

Workspace de exploração, pela tela, em 2026-10-26.

| Passo | URL | O que acontece |
|---|---|---|
| 1 | `/workspaces/<exploração>/settings/system` | Cartão **Módulos** com 3 chaves: "Correção Monetária", "Comparações" e "Juridico" (sem acento), todas desligadas. Nenhuma tem texto de ajuda; as chaves de cima, em Configurações Adicionais, têm o "?" ([print](evidencias/dev-01-modulos-desligados.jpg)) |
| 2 | mesma | Ligar "Juridico" e clicar em **Salvar**: grava com `PUT /workspaces/{id}` (200). Nenhum aviso diz o que mudou |
| 3 | menu lateral | Igual ao de antes: Membro (Início, Spaceflows, Categorias, Tarefas, Agenda, Knowledge) e Configurações (Estrutura: Categorias, Listas, Spaceflow; Interface: Menus, Telas, Casos de Uso). Nenhum item novo |
| 4 | `/settings/interface/usecases` | Igual: Migração de Workspace e o bloco "General" com 1 caso, "QA Comercial - Brasil (pt-br)". Nenhum caso jurídico, nenhum aviso do módulo ([print](evidencias/dev-02-casos-de-uso-com-juridico-ligado.jpg)) |
| 5 | código da tela | Nos 226 arquivos de script carregados, a chave `en-legal` não aparece. O único efeito medido do módulo segue sendo o da pesquisa: as 5 ferramentas jurídicas dos agentes de IA (`legalLookupCase` e outras), que consultam processo pelo número CNJ |
| 6 | mesma do passo 1 | Chave desligada de novo e salva (`PUT` 200): o workspace ficou como estava |
| 7 | `/workspaces/<exploração>/schedule` | Agenda (rodada 2): Hoje, Período anterior, Período seguinte, "outubro 2026", Visualização (abre em "Dia"), Data, Dia Útil, Dia Não Útil e configurações. Eventos de reunião com hora. Nenhum prazo processual |

### O que já existe e funciona

- A chave `en-legal`, gravada no workspace.
- Categorias, campos (máscara Nº CNJ, Valor Monetário, Pessoa/Empresa com CNPJ), formulários, Spaceflow com gatilho por
  agenda, tarefas com prazo, modelos de documento, 5 assinadores (3 com ICP-Brasil): tudo o que um caso de uso jurídico
  precisa para contratos, consultivo, procurações, societário e pagamentos.
- O módulo Correção Monetária (12 índices, tabelas dos tribunais) e o módulo Comparações (circularização com
  escritórios), que o contencioso já usa.
- Casos de uso e Migração de Workspace: exportar e importar a estrutura.

### Onde trava

- Ligar o Jurídico não muda nada na tela. O nome sai sem acento e sem ajuda.
- Prazo processual não existe: o prazo é uma data que alguém digita num campo ou na tarefa. A tarefa calcula em UTC
  (mostra o dia anterior em Brasília) e o C44 deixa prazo em dias úteis cair no fim de semana.
- O calendário é 1 só por workspace, sem tribunal, e a sincronização mistura feriados de 2 países (S3-F3).
- Nenhuma captura de publicação ou intimação. O site vende captura de DJe; a doc não cita.
- Risco e provisão são campos soltos: não há data-base, histórico nem fechamento.

## A captura que os clientes contratam hoje (rodada 3)

Lido nos chamados e nas user stories do time de produto (espelho de `analises-dados`, 2026-09), sem nome de cliente:

- **Robôs sob medida da Enlighten:** cada cliente contrata a captura como serviço. O robô cria itens nas categorias do
  cliente (processos, andamentos, publicações), e os itens passam pela **Triagem**: a opção "Enviar Requisição para
  Triagem" do formulário e a tela do tipo Triagem;
- **Processo novo por termo:** 1 pedido lista empresas e CNPJs para capturar ações novas todo dia, no primeiro horário,
  entregues por e-mail em planilha até o cliente ter uma caixa própria;
- **Fornecedor do cliente:** 2 pedidos de integração com centrais de recortes que o cliente já paga (Alerte e
  "Intelix", que a pesquisa achou como Intelivix). Um deles pede que cada captura entre como item de triagem, vá para a
  categoria ligada ao processo e diga a fonte (fornecedor ou ENSPACE), com um robô ENSPACE de redundância;
- **Andamento sem processo:** chamado de andamentos que perderam o vínculo com o processo;
- **Módulo de Triagem:** a user story de aprovar, reprovar e revisar requisições está em "To Do". Ela cria o menu de
  módulos que o protótipo usa.

O que isso pede do submódulo: receber o robô ENSPACE e o fornecedor do cliente na mesma caixa, dizer a fonte de cada
captura, juntar a mesma comunicação vinda de 2 fontes, mostrar quando uma fonte parou e ligar a captura ao processo.

## Módulo ou caso de uso: o critério

Uma área vira funcionalidade do módulo só quando as 3 condições valem juntas:

1. ela produz um resultado com **efeito jurídico** (prazo, ciência de intimação, provisão contábil);
2. a **configuração de hoje não produz esse resultado certo** (categorias, campos, formulários, Spaceflow, telas,
   assinadores e os módulos que já existem);
3. o **motor é igual para todo cliente**; só o dado muda por país (regra, calendário, conector).

Se a área para na condição 2, ela é **caso de uso**: uma configuração salva e replicada pela galeria de casos de uso, sem
tela nova. Se ela vale para todo workspace, jurídico ou não, ela é **plataforma** e vai para o protótipo da plataforma.

| Área | Resultado com efeito jurídico? | A configuração de hoje resolve? | Fica como |
|---|---|---|---|
| Contencioso: estrutura do processo (partes, foro, valor, fase, audiências) | não | sim | **caso de uso** |
| Contencioso: prazo processual | sim (prazo perdido) | não: data digitada, UTC, sem rito nem tribunal | **módulo: Prazos** |
| Contencioso: publicações e intimações | sim (ciência abre prazo) | não: não há captura | **módulo: Intimações** |
| Contencioso: risco e provisão | sim (balanço, CPC 25) | não: campo solto, sem data-base nem histórico | **módulo: Provisão** |
| Contratos | só na assinatura, que já existe | sim: modelos, assinadores, Spaceflow de aprovação e renovação | **caso de uso** |
| Consultivo | não | sim: formulário de entrada, triagem, prazo de atendimento | **caso de uso** |
| Procurações | não | sim: vigência e aviso por gatilho de agenda | **caso de uso** |
| Societário | não | sim: calendário de obrigações como itens com gatilho | **caso de uso** |
| Pagamentos jurídicos (Brasil) | não | sim: categoria, aprovação, centro de custo | **caso de uso** |
| Marcas | não, sem conector | sim: prazos de 10 anos e 60 dias como gatilho | **caso de uso** (leitura da RPI fica para depois) |
| Canal de denúncias | sim (anonimato) | não, mas o que falta vale para todo workspace | **caso de uso + plataforma** (formulário anônimo, protótipo `formulario-anonimo`) |
| Sigilo e barreira por caso | sim | não | **plataforma** (tabela 3 da pesquisa) |

O protótipo desenha só as 3 linhas "módulo". As outras ficam listadas na configuração do módulo, como casos de uso
que se usam pela galeria, para mostrar onde cada uma mora.

## A casca da tela, item por item

Copiada de `central-de-execucoes/_CascaDoSpaceflow.vue` (cópia do develop de 2026-10-24), conferida contra o develop
em 2026-10-26 (passo 3 da tabela acima):

- **Menu lateral, topo:** avatar com as iniciais, nome e referência do workspace, seta; "Buscar..." com CTRL K.
- **Membro:** Início, Spaceflows, Categorias (abre as categorias), Tarefas, Agenda, Knowledge.
- **Configurações:** Visão Geral, Sistema, Estrutura (Categorias, Listas, Spaceflow), Gestão de Membros, Interface
  (Menus, Telas, Casos de Uso), E-mails, Integrações, Agentes de IA, Logs.
- **Ajuda:** Releases, Documentação (com seta de link externo).
- **Barra do topo:** recolher menu, voltar, avançar, recarregar, início; trilha com CTRL B e estrela; bandeira do
  idioma, sol, Suporte, sino, avatar.
- **Configurações › Sistema:** título "Configurações Gerais", abas Informações Básicas, Calendário, Notificações,
  Dicionários, Cobrança; cartão Módulos com Salvar próprio.
- **Tela do item:** painel da esquerda (ícone, referência, categoria, Identificação, Origem, Histórico), abas Visão
  Geral, Comentários, Logs de Auditoria, Tarefas, Anexos, Emails Automáticos, Mail Box, Notas e Campos; rodapé
  "Alterações não salvas", "Sair sem salvar" e "Salvar".

Achados de passagem na casca (ficam como estão):

- "Juridico" sem acento, e os 3 módulos sem texto de ajuda.
- A tela de Casos de Uso abre com o logo e um texto que fala em "consultar todas as categorias", mas a galeria mostra
  casos de uso, não categorias.

### A tela de lista, item por item (rodada 2)

Copiada de `comunicacao-no-workspace/_TelaItens.vue` e do print `15-lista-de-itens.jpg` (develop, 05/10/2026):

- **Visualizações:** botão por visualização (a ativa em rosa claro), separador e "+ Visualizar".
- **Barra de ferramentas:** Pesquisar registros, Criado em, Todo o período; à direita, os ícones Exportar, Colunas,
  Filtros e Configurações, e Novo registro.
- **Tabela:** caixa de seleção, coluna Ações com o menu da linha, as colunas da visualização, "0 de N selecionado(s)" e a
  paginação. No develop, cada cabeçalho tem o funil de filtro e a seta de ordenação; o `EnTable` não tem o funil.
- **Agenda:** grade do mês da cópia de `comunicacao-no-workspace/_TelaAgenda.vue`, conferida contra o cabeçalho lido no
  develop em 26/10 (passo 7).

### A caixa Capturas, item por item (rodada 3)

A caixa usa a mesma barra e o mesmo `EnTable` da rodada 2. Nada da casca mudou: o menu Jurídico continua no mesmo
lugar, com Capturas (antes Intimações) e Prazos; Provisão saiu da tela por `submodulos.ts`. A categoria Andamentos entrou
no menu Categorias, porque é o destino do andamento tratado.

## Dado do protótipo

Empresa, pessoas, processos, números CNJ, valores e teores de publicação são inventados. Os feriados nacionais de 2026
são os do calendário oficial; os feriados locais dos tribunais são exemplo, marcados como tal no mock. Nada foi
preparado por API.

Rodada 3 (`capturas.ts`): CNPJs, inscrições na OAB, hashes, ids de fonte, execuções e logins de tribunal são
inventados e não correspondem a empresas nem a pessoas reais. Os nomes dos canais oficiais (DJEN, Domicílio Judicial
Eletrônico, e-SAJ, PJe, eproc) são reais; o fornecedor externo aparece como tipo ("Fornecedor de recortes do cliente"),
sem nome comercial. Nada foi preparado por API.

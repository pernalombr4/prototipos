# Decisões: painel de tarefas

## Rodada 2 · 2026-09-30

- **Pedido (literal):**
  - "a divisao que voce fez entre rapidas, spaceflow e programadas nao tem sentido. isso porque as tarefas de spaceflow sao tarefas rapidas. pode fazer uma divisao só entre "tarefas criadas manualmente" e "tarefas criadas por fluxo", sem dividir spaceflow e c-flows nisso."
  - "o usuario deve ter a possibilidade de reordenar os cards de graficos (todos os paineis) e tambem redimensionar, como é no clickup. pode também ocultar algum ou adicionar de volta se quiser."
  - "vence nas proximas 24h poderia ser "a vencer" e dar um prazo maior. [...] use o corte comum no mercado"
  - "observe a estrutura de dashboards feita com o template de dash do nuxt. ta melhor que os seus. tem que acompanhar o nuxt viu? é a estrutura do nosso admin."
  - "na hora de clicar nos seus cards tudo bem abrir a lista de tarefas, só veja como é abertura de lista/tabela no admin pra copiar a estrutura de tabela do nuxt nisso tambem."
  - "e nos paineis que sao listas, pode colocar scroll infinito em vez de um botao pra abrir mais"
- **Mudou:** origem em 2, "Criadas manualmente" e "Criadas por fluxo".
  - Por fluxo: a tarefa do Spaceflow (`node_execution` preenchido) e a tarefa de etapa do fluxo da categoria.
  - O motor por baixo continua no modelo (`motor`), só para o "Abrir em Agendadas" ou "Abrir em Rápidas" da lista.
  - Tempo por fluxo põe os 2 motores lado a lado, com um selo "Categoria" ou "Spaceflow". O do Spaceflow vem da execução (`created_at` a `stopped_at`).
- **Mudou:** "Vence em 24 h" virou **"A vencer"**: aberta com prazo nos próximos 7 dias corridos.
  - É o corte mais comum: Linear, Jira, Todoist e Asana usam 7 dias; monday.com e Wrike, a semana do calendário; o Trello, 24 h. O ClickUp não tem janela na cor e oferece "Next 7 days" no filtro (`PESQUISA.md`, seção "A vencer").
  - O detalhe do número mostra quantas vencem em até 24 h, o destaque que Linear, ClickUp e Todoist dão ao dia do prazo.
  - "Tempo até o prazo" agrupa as faixas em Vencidas, A vencer e Depois de 7 dias.
- **Mudou:** cada pessoa arruma o painel, como no ClickUp:
  - "Personalizar" liga o modo de edição; "Concluir" desliga. Fora dele, nada se move (o motivo que o ClickUp deu para criar o modo);
  - mover: arrastar o painel; os outros se reacomodam. Pelo teclado, setas na alça;
  - redimensionar: canto inferior direito, em passos da grade de 12 colunas, com mínimo e máximo por painel. Pelo teclado, setas no canto;
  - ocultar: menu "…" do painel, com "Desfazer" no aviso;
  - trazer de volta: "Adicionar painel", catálogo com busca, onde o painel na tela aparece como "Adicionado" (como o "Manage cards" do ClickUp);
  - "Desfazer" (e Ctrl+Z) e "Restaurar padrão";
  - "Tela cheia" no menu "…" de todo painel.
- **Mudou:** os 7 blocos viraram 15 painéis independentes: os 6 números, SLA, Tempo até o prazo, Próximas a vencer (antes era o rodapé de prazos), Criadas e concluídas, Status, Responsáveis e Tempo por tarefa, por etapa e por fluxo (antes eram 3 abas).
- **Mudou:** desenho do template de dashboard do Nuxt UI, que o admin do ENSPACE usa:
  - número com ícone em círculo da cor primária, título em caixa alta e variação num selo (`HomeStats`);
  - barra de filtros com botões fantasma e período com ícone de calendário (`UDashboardToolbar` e `HomeDateRangePicker`);
  - gráfico que ocupa a altura do painel (`HomeChart`).
- **Mudou:** a lista aberta por um número segue a tabela do admin (tela Usuários): busca à esquerda; "Colunas" e "Exportar" à direita; rodapé com "Mostrando 1 a 20 de N", itens por página e paginação com primeira e última página.
- **Mudou:** rolagem infinita nos painéis de lista (Próximas a vencer, Responsáveis, Tempo por tarefa), no lugar de "Mostrar os N". Lotes de 8 a 15 linhas; no produto, cada lote é uma página da API. Cada painel rola dentro de um `UScrollArea`.
- **Fronteira:** muda o conteúdo da tela do painel. Não muda a casca (menu, barra do topo, trilha), as listas de Agendadas e Rápidas, nem as regras de cálculo, fora a janela de "a vencer".
- **Descartado:** layout do painel igual para todo o workspace, como no dashboard do ClickUp. Motivo: o painel é nativo e o mesmo para todos; o que muda é quem olha. O arranjo por pessoa segue a página pessoal do ClickUp (My Tasks).
- **Descartado:** "Duplicar painel" e "Exportar painel", que o ClickUp tem no menu "…". Motivo: o conteúdo é fixo, e 2 cópias do mesmo número não respondem nada novo. A exportação fica na lista.
- **Descartado:** "Atualizar" por painel. Motivo: o painel todo atualiza junto pelo botão do topo, e o horário aparece ao lado.
- **Não deu:** intervalo de datas personalizado no período (o calendário do `HomeDateRangePicker`). Por quê: o `UCalendar` com intervalo precisa do `@internationalized/date`, que não está instalado neste repositório. Ficaram os 7 atalhos, cada um com as datas ao lado.
- **Não deu:** arrastar com a biblioteca do exemplo do Nuxt UI (`useSortable`). Por quê: `@vueuse/integrations` e `sortablejs` não estão instalados. O arrastar e o redimensionar são do navegador (`UxGradeDePaineis`, registrado em `COMPONENTES-CUSTOM.md`).
- **Maquete:** o arranjo de cada pessoa fica no `localStorage` do navegador (chave `enspace-prototipos:painel-de-tarefas:layout:v1`). No produto, é uma preferência por membro.
- **Maquete:** a rolagem infinita espera 350 ms a cada lote, para imitar a página seguinte da API.
- **Maquete:** "Exportar" da lista mostra um aviso; "Colunas" funciona só na tela.
- **Crítica e acessibilidade:** detalhe na seção "Crítica e acessibilidade", rodada 2.
- **Ver:** `https://pernalombr4.github.io/prototipos/painel-de-tarefas` · `evidencias/prototipo-06-rodada-2-topo.jpg` · `evidencias/prototipo-07-rodada-2-modo-de-edicao.jpg` · `evidencias/prototipo-09-rodada-2-lista-como-no-admin.jpg`

## Rodada 1 · 2026-09-30

- **Pedido (literal):** "voce precisa construir um prototipo de uma tela nativa de dashboard de TAREFAS para o enspace. [...] precisamos de um dash nativo e nao editavel, só um painel fixo e padronizado com dados de tarefas" (a demanda inteira está no `BRIEFING.md`).
- **Mudou:** protótipo novo, em `Tarefas › Painel`, com 7 blocos fixos:
  - 6 números no topo: abertas, vencidas, vencem em 24 h, concluídas, % concluídas no prazo e tempo médio de conclusão;
  - SLA: abertas agora (no prazo, vence em 24 h, vencida, sem prazo) e concluídas no período (no prazo, atrasada, sem prazo);
  - tempo até o prazo, em 7 faixas, com as 5 próximas a vencer;
  - status e substatus virtuais: cada status dividido pela situação do prazo;
  - criadas e concluídas por semana, mês ou ano, com o saldo;
  - tarefas por responsável: pessoas, grupos, "Todo mundo", e-mail externo e sem responsável, em 2 leituras (designada para, quem assumiu);
  - tempo médio de tarefa, de etapa e de fluxo, em 3 abas.
- **Mudou:** todo número abre a lista das tarefas que o formam, num painel lateral.
- **Mudou:** filtros globais: período, origem (rápidas, Spaceflow, programadas), responsável e categoria.
- **Fronteira:** muda o conteúdo da tela nova e o menu ganha o item "Painel" dentro de Tarefas; não muda nada nas listas de Agendadas e Rápidas, nem no painel de itens da Interface.
- **Descartado:** construtor de widgets. Motivo: a demanda pede painel fixo, e a pesquisa de UX já mostrou que montar um painel de itens exige 4 níveis e esconde o obrigatório.
- **Descartado:** burndown, velocity e carga contra capacidade. Motivo: o ENSPACE não tem sprint, estimativa nem capacidade por pessoa. Não há dado.
- **Descartado:** ranking de pessoas ("quem mais concluiu"). Motivo: expõe gente; a demanda é gerir tarefa.
- **Descartado:** pausa de SLA. Motivo: o ENSPACE não grava pausa.
- **Não deu:** ler a API pelo token de develop. Por quê: o token do `config/tokens.md` não é membro do workspace de exploração (403), e ler a sessão do navegador foi bloqueado. A exploração seguiu pela tela, pelo Log de Auditoria e pela medição da rotina de QA de tarefas.
- **Não deu:** print das referências de mercado. Por quê: a ajuda de ClickUp, monday.com, Asana e Wrike bloqueia leitura automática, e print do produto exige conta em cada um. O `PESQUISA.md` descreve cada um em passos, com URL.
- **Maquete:** o botão "Atualizar" só gira; o dado não muda.
- **Maquete:** clicar numa linha da lista lateral e nos botões "Abrir em Agendadas" e "Abrir em Rápidas" mostra um aviso. No produto, a linha abre a tarefa e os botões abrem a lista com o mesmo filtro.
- **Maquete:** clicar numa barra do gráfico de criadas e concluídas não abre lista.
- **Maquete:** o período não tem intervalo personalizado (só as 7 opções prontas).
- **Crítica e acessibilidade:** detalhe na seção "Crítica e acessibilidade", abaixo.
- **Ver:** `http://localhost:3000/painel-de-tarefas` · `https://pernalombr4.github.io/prototipos/painel-de-tarefas` · `evidencias/prototipo-01-topo.jpg`

---

## Onde o painel mora

**Tarefas › Painel**, 1º filho de Tarefas, com o selo "Novo".

- É a visão de conjunto das 2 listas que já estão ali (Agendadas e Rápidas). Por isso fica em cima delas.
- Não entra em Interface › Telas como mais um tipo de tela. Motivo: tela da Interface é configurável e depende de alguém criar e pôr no menu. A demanda pede painel nativo.
- **É a única mudança na casca**, e é achado, não licença (regra 37): o menu ganha 1 item. Pergunta para a Mikaela: o lugar é esse, ou o painel entra na Início, ao lado dos cartões de tarefa de hoje?

## As definições

A demanda fala em "atrasadas, no prazo, vencidas". Os produtos pesquisados não concordam sobre essas palavras, e o ENSPACE usa "Atrasado" na coluna Status de SLA das programadas. O painel fixa o sentido de cada uma e mostra a regra em todo cartão ("Como calculamos").

| Palavra | Quando | Regra | Campo |
|---|---|---|---|
| **No prazo** | aberta | prazo daqui a mais de 7 dias | `due_date` > agora + 7 dias |
| **A vencer** | aberta | prazo nos próximos 7 dias corridos (rodada 2; antes, 24 h) | `due_date` entre agora e agora + 7 dias |
| **Vencida** | aberta | prazo passou e a tarefa segue aberta | `due_date` < agora |
| **No prazo** | concluída | terminou até o prazo | `completed_at` <= `due_date` |
| **Atrasada** | concluída | terminou depois do prazo | `completed_at` > `due_date` |
| **Sem prazo** | as 2 | sem `due_date`, ou prazo igual à hora de criação | `due_date` nulo, ou `due_date` = `created_at` (1 min de folga) |

**Divergência de nome (regra 29):** o "Atrasado" da coluna Status de SLA das agendadas junta o que o painel separa em "Vencida" (aberta, prazo passou) e "Atrasada" (concluída depois do prazo). Medido na rodada 2 (`evidencias/dev-11-status-de-sla-apos-o-prazo.jpg`): a concluída até o prazo segue "Em Dia" depois dele. O painel separa as 2 palavras porque respondem perguntas diferentes: vencida é o que está parado agora; atrasada é o que foi entregue tarde. A soma das 2 bate com o "Atrasado" do produto (checagem automática no mock). **Pergunta para a Mikaela:** a coluna Status de SLA ganha as 2 palavras, ou o painel mostra "Atrasado" com as 2 partes dentro?

**Consequência do "a vencer" de 7 dias:** a tarefa de etapa costuma ter SLA de horas ou poucos dias. Aberta e dentro do prazo, ela cai quase sempre em "A vencer", e "No prazo" (mais de 7 dias) fica raro. A faixa "Em até 24 h" separa o urgente.

**Origem** (rodada 2):

| Painel | Rápida (`/ws/tasks`) | Agendada (`/c-flow-item-tasks`) |
|---|---|---|
| Criada manualmente | `node_execution` nulo | não existe |
| Criada por fluxo | `node_execution` preenchido (Spaceflow) | toda tarefa de etapa |

**Status virtual** (os 2 motores num vocabulário só):

| Painel | Rápida e Spaceflow (`status`) | Programada (`work_status` e `status`) |
|---|---|---|
| Não iniciada | `pending` (Pendente) | `waiting` (Aguardando) |
| Em andamento | `working` (Em andamento) | `working` (Trabalhando) |
| Bloqueada | `blocked` (Bloqueada) | não existe |
| Concluída | `completed` (Concluída) | `complete` (Completa) |
| Removida | não entra (a lista esconde arquivada e excluída) | `removed` ou `status: inactive` (item excluído) |

**Substatus virtual:** a situação do prazo (tabela de cima) dentro de cada status.

**Responsável:**

| Tipo de responsável na tarefa de etapa | Linha no painel |
|---|---|
| Todo Mundo (`everybody`) | "Todo mundo" |
| Grupo (`module_groups`) | o grupo |
| Usuários, Usuário Solicitante, Baseado em Campo, Regras de Responsável | cada pessoa |
| Email Externo | "E-mail externo" |
| Rápida com `assigned_to` | a pessoa |
| Rápida sem `assigned_to` | "Sem responsável" |

- Tarefa de 2 pessoas conta para as 2; a tela avisa que a soma pode passar do total.
- "Quem assumiu" usa `assigned` (quem clicou em Atribuir) ou quem concluiu (`updated_by_email`, `completed_by`): 1 linha por tarefa.

**Tempos:**

- **Tarefa:** `created_at` até `completed_at`. Nas programadas com "Habilitar Atribuição", o `task_log` divide em espera (até "Trabalhando") e execução.
- **Etapa:** `start` até `complete` do mesmo `stage_id` no `stages_log` do flow item.
- **Fluxo da categoria:** 1º `start` até o último `complete`, nos flow items com `run_status: complete`.
- **Fluxo do Spaceflow** (rodada 2): `created_at` até `stopped_at` da execução com `status: completed`. A barra divide pela mediana de cada tarefa que o fluxo cria. O Spaceflow não tem etapa: o painel de etapa diz isso no rodapé.
- Média **e** mediana, lado a lado: a média de tempo de conclusão em develop foi 43 h e a mediana, 36 s. Sozinha, a média engana.
- Ao lado de cada tempo, quantos ainda estão em andamento e há quanto tempo: sem isso, o item parado há 2 meses some da média.

**Filtro de responsável:** pega a tarefa designada à pessoa (ou ao grupo, a "Todo mundo", ao e-mail externo) e também a que a pessoa assumiu ou concluiu. Assim, filtrar "Carla Nunes" mostra a tarefa do grupo Jurídico que ela pegou.

**Período:** cada bloco diz se é "Agora" (abertas, vencidas, faixas) ou "No período" (concluídas, criadas, tempos). A comparação é com o período anterior do mesmo tamanho. Semana de segunda a domingo, no horário de Brasília (o ENSPACE não tem fuso por workspace).

## O que o back precisa

O painel usa só dado que o ENSPACE já grava. Falta uma coisa: **agregar no servidor**. As rotas de hoje listam e contam; o painel precisa de média, mediana e contagem por grupo sem baixar milhares de tarefas.

| Pedido | Por quê |
|---|---|
| Rota de agregação sobre `/ws/tasks` e `/c-flow-item-tasks`, com os mesmos filtros das listas | contagem por status, por situação do prazo, por responsável e por semana, mês ou ano |
| Percentis (50 e 90) de `completed_at - created_at` | média sozinha engana |
| Leitura de `/c-flow-items` com `stages_log`, filtrável por fluxo e período | tempo de etapa e de fluxo; hoje não há rota de leitura documentada |
| `/workflows/executions` filtrável por período (`stopped_at`) e com contagem | tempo de fluxo do Spaceflow sem baixar todas as execuções |
| Preferência por membro para o arranjo do painel (ordem, tamanho, ocultos) | "Personalizar" guarda por pessoa; o protótipo usa o `localStorage` |
| `is_overdue` calculado também no detalhe, e filtrável | hoje é texto, só na lista, e dá 400 no filtro |
| Nó do Spaceflow sem prazo gravar `due_date: null` | hoje grava a hora da criação e a tarefa nasce vencida |
| Fuso do workspace | "semana" e "mês" dependem de onde começa o dia |

## Validação dos números (`/data:validate-data`)

**Resultado: pronto para mostrar, com as ressalvas abaixo.** Rodada 2: 353 checagens automáticas sobre o mock, 0 falhas (rodada 1: 433, com 4 origens).

- Rodada 2:
  - criadas manualmente + criadas por fluxo = todas; tarefa manual nunca tem fluxo nem etapa;
  - "A vencer" = faixas "Em até 24 h" + "Em 1 a 7 dias", nas 3 origens;
  - Próximas a vencer = abertas com prazo à frente, em ordem de prazo;
  - o "Atrasado" do produto (regra medida) = Vencida + Atrasada do painel, tarefa por tarefa;
  - tempo por fluxo tem os 2 motores; execução concluída tem `stopped_at` depois do início.
- Totais que batem entre blocos, em todos os 7 períodos e 3 origens:
  - abertas = SLA das abertas = soma das faixas = soma dos status abertos;
  - concluídas = SLA das concluídas = linha "Concluída" do status;
  - criadas e concluídas do gráfico = números do topo, nas 3 granularidades.
- Datas: nenhuma conclusão antes da criação; "assumida" sempre entre criação e conclusão; nada no futuro.
- Etapa e fluxo: a soma das etapas de um fluxo concluído bate com a duração do fluxo (diferença máxima de 4 s).
- Responsável: em "Designada para", a soma das linhas passa do total quando há tarefa de 2 pessoas; em "Quem assumiu", bate com o total.

**Ressalvas que a tela já mostra:**

1. Tarefa do Spaceflow com prazo igual à criação conta como sem prazo, com aviso no bloco SLA.
2. Rápida criada já concluída não tem `completed_at`; fica fora de tempo e de SLA, com aviso.
3. A 1ª e a última barra do gráfico podem cobrir só parte da semana, do mês ou do ano; o ponteiro diz "Parcial" e uma nota embaixo explica.
4. Tempo de etapa e de fluxo conta só o que terminou; o que está em andamento aparece ao lado, com a idade.
5. Arquivadas e tarefas da lixeira não entram (a API esconde as 2).

**O mock não é o develop.** Os volumes foram escolhidos para a tela contar uma história (uma etapa gargalo, uma pessoa sobrecarregada, um grupo lento). O aumento de "concluídas" contra o período anterior (+80%) vem do trabalho recente que o gerador acrescenta, não de tendência real.

## Crítica e acessibilidade

### Rodada 2

**Crítica (`design:design-critique`):**

- Corrigido: o título dos números ("TEMPO MÉDIO DE CONCLUSÃO") cortava ao lado do ícone. O ícone e as ações ficam numa linha; o título, na de baixo, com a largura toda. O selo "Agora" ou "No período" subiu para o lado do ícone.
- Corrigido: a tabela de responsáveis rolava para o lado com 7 colunas da grade. Ficou com 8 colunas no arranjo padrão e larguras iniciais que cabem.
- Corrigido: no tempo por etapa, "11 h 36 min" quebrava em 2 linhas; no tempo por fluxo, os números se espremiam em 2 colunas estreitas. Agora a duração não quebra, e as 2 colunas só aparecem quando o painel é largo.
- Corrigido: o menu de origem cortava "Criadas manualmente". O menu cresce com o texto.
- Corrigido: o documento inteiro rolava junto com o painel (um texto só para leitor de tela escapava do contêiner). Agora só a área do painel rola.
- Sem correção: com a grade densa, aumentar um painel pode deixar um buraco na linha de cima. O ClickUp resolve com "Auto layout"; aqui o painel que cabe no buraco sobe, mas nem sempre há um que caiba. "Desfazer" e "Restaurar padrão" cobrem.
- Sem correção: "Vencidas" é 65% das abertas no mock. O gerador deixa tarefas esquecidas, como o develop mostrou (101 de 161 pendentes). É o retrato de um workspace sem gestão de prazo.

**Acessibilidade (`design:accessibility-review`), medido no Chrome:**

- Teclado: no modo de edição, cada painel tem a alça "Mover Abertas. Use as setas." e o canto "Mudar o tamanho de SLA. Use as setas.". O foco fica na alça depois de mover.
- Corrigido: o anúncio para leitor de tela ("Abertas na posição 2 de 15.", "Tempo até o prazo: 5 colunas por 8 linhas.") dizia a posição de antes. Agora diz a nova.
- Esc desfaz o arraste em andamento e sai do modo de edição quando o catálogo está fechado.
- O arrastar só começa depois de 4 px de movimento: clique continua sendo clique.
- Cada painel é uma `section` com o título como nome (`aria-labelledby`); o menu "…" diz de qual painel é ("Mais ações: SLA").
- Número com variação: o selo diz "+78%" na tela e "+78% vs. anterior" para o leitor de tela.
- O texto colorido novo (selos de variação, prazos a vencer) usa o tom 700 no claro e 300 no escuro, a mesma regra da rodada 1.
- Tela estreita (430 px): sem rolagem lateral; números em 2 colunas, o resto em 1; o canto de redimensionar some.
- Sem correção: avisos de hidratação dos ícones de ordenação do `EnTable` no `pnpm dev` (ícones do SDK). Não aparecem no estático.
- Sem correção: arrastar pelo toque não foi medido num aparelho.

### Rodada 1

**Crítica (`design:design-critique`):**

- O olho vai 1º para "Vencidas" em vermelho. Está certo: é por onde o gestor começa.
- Corrigido: o cartão de SLA esticava até a altura do vizinho e deixava um vazio. SLA e Status agora empilham à esquerda, prazos à direita.
- Corrigido: a tabela de responsáveis empurrava o painel para baixo e cortava nomes. Foi para a largura toda, com as 8 maiores filas e "Mostrar os N".
- Corrigido: "Sem prazo" pintado com o neutro do tema (quase preto) pesava mais que "Vencida". Agora é cinza.
- Corrigido: a composição do tempo de fluxo tinha a maior etapa em cinza, lida como vazio. Agora é uma rampa da cor primária, da 1ª etapa à última.
- Corrigido: duração "7 d 24 h" (arredondamento) vira "8 d".
- Corrigido: em inglês, "Dashboard" cortava no menu por causa do selo "New". O selo ficou menor.
- Corrigido (revisão de microtexto): "Abertas com prazo até amanhã, esta hora" virou "Abertas com prazo nas próximas 24 horas"; o estado vazio perdeu a figura ("o painel se enche sozinho"); a regra do gráfico explica o saldo.
- Sem correção: SLA e Status repetem a situação do prazo. Mantido porque respondem perguntas diferentes: SLA diz quanto vence; Status diz em que status a tarefa parou.
- Sem correção: nome das tarefas do mock fica em português no inglês e no espanhol. É dado do workspace, não texto de interface.

**Acessibilidade (`design:accessibility-review`), medido no Chrome, rodada 1:**

- Corrigido: texto em amarelo (1,91:1), verde-azulado (2,49:1) e vermelho pequeno (3,81:1) não passavam. Agora usam o tom 700 no claro e 300 no escuro, a mesma regra do `app/tema-contraste.ts`: mínimo de 4,93:1 no claro e 10,2:1 no escuro.
- Sem correção: as iniciais do `UAvatar` ficam em 4,18:1 (claro) e 4,38:1 (escuro). É o padrão do componente; mexer seria CSS próprio num componente do Nuxt UI.
- Sem correção: o placeholder dos seletores ("Todos os responsáveis") fica em 3,03:1. É o `text-dimmed` padrão do Nuxt UI.
- Teclado: todo número, faixa, linha de status e legenda de SLA é botão; o "Como calculamos" é botão próprio acima do cartão (`z-10`). O foco aparece no cartão (anel) e no botão.
- Corrigido: os 9 botões "Como calculamos" tinham o mesmo nome para o leitor de tela. Agora cada um diz o assunto ("Como calculamos: Vencidas").
- Títulos em ordem: 1 `h1`, um `h2` por bloco, `h3` dentro dos blocos.
- Gráfico: tem `role="img"` com o resumo em texto. O valor de cada barra só aparece no ponteiro do mouse. Registrado como limite.
- Tela estreita (430 px): sem rolagem lateral; os cartões viram 2 colunas; o menu lateral some, como no produto.

## CSS próprio

- `_GraficoSerie.vue`, `<style scoped>`: variáveis do Unovis (`--vis-*`) apontando para os tokens do tema. Consulta: skill `nuxt-ui` e MCP (`search-components "chart"` devolveu 0 componentes). O Nuxt UI não tem gráfico, e o Unovis não lê token sozinho. Mesmo bloco do `configuracoes-do-sistema/_GraficoDeConsumo.vue`.
- Barras de status com largura proporcional ao total (`style="width: …%"`): o `UProgressGroup` divide a barra em partes, mas não encolhe a barra inteira. Consulta: MCP `get-component ProgressGroup`.
- Cor "cinza apagado" (`var(--ui-text-dimmed)`) passada como cor do `UProgressGroup` e do `UProgress`: os 2 aceitam cor CSS pela prop `color`. Não é CSS próprio, é prop.
- Rodada 2, `app/components/ux/UxGradeDePaineis.vue`: a grade de painéis. Largura e altura de cada painel em variáveis CSS (`--w`, `--h`) lidas por utilitário do Tailwind (`col-span-(--w)`, `row-span-(--h)`); o fantasma do arraste posicionado por `style` (`left`, `top`). Consulta: MCP `nuxt-ui` (`search-components "grid"`: `PageGrid`, que só distribui; `"drag"`: `EditorDragHandle` e `Splitter`, que não reordenam cartão; `TableDragAndDropExample` usa `useSortable`, não instalado).
- Rodada 2, rolagem infinita: `IntersectionObserver` do navegador (`_Sentinela.vue`), dentro do `UScrollArea`. Consulta: MCP `nuxt-ui` (`get-example ScrollAreaInfiniteScrollExample` e `TableInfiniteScrollExample`): os 2 usam `useInfiniteScroll` do `@vueuse/core`, não instalado.

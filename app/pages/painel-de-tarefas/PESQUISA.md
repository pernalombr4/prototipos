# Pesquisa: painel nativo de tarefas

Fase 3 do protótipo. 11 produtos: os 5 obrigatórios (Notion, Twenty, ClickUp, monday.com, Pipefy), Jira e Trello, que a demanda citou, e 4 de gestão de tarefas (Asana, Linear, Zoho Projects, Wrike). Fontes consultadas em 30/09/2026, na documentação oficial de cada um.

**Sem print das referências.** A ajuda de ClickUp, monday.com, Asana e Wrike bloqueia leitura automática, e a captura de tela de produto de terceiro exige conta em cada um. O que cada produto faz está descrito em passos, com a URL da documentação. Registrado no `DECISOES.md`.

## Resumo

- Só 3 produtos abrem um painel de tarefas pronto, sem montar nada: Jira (aba Summary), Zoho Projects (painel do projeto) e Wrike (Analytics view). Os outros entregam um construtor de gráficos.
- Nenhum painel pronto junta contagem, SLA e tempos na mesma tela. O Jira Summary mostra contagens de 7 dias; SLA e tempos ficam em relatórios separados.
- As definições convergem entre os produtos: lead time (da criação à conclusão), cycle time (do início do trabalho à conclusão), tempo em status, idade das abertas e atrasada (aberta com prazo passado). A tabela está em "O padrão que todos seguem".
- Taxa de conclusão no prazo, calculada pelo prazo da tarefa, nenhum produto entrega pronta. Asana, ClickUp e monday.com têm pedidos abertos na comunidade.
- Atrasada x vencida não tem consenso. O Pipefy usa, em português, 3 palavras para 3 limites: Vencido (prazo do card), Atrasado (SLA da fase) e Expirado (SLA do processo).

| Produto | Painel pronto (fixo) | Lead / cycle time | Tempo em status | SLA com estados | % concluída no prazo | Clique abre lista |
|---|---|---|---|---|---|---|
| Notion | Não (construtor, plano Business) | Só por fórmula | Não | Não | Não | Sim |
| Twenty | Não (construtor) | Não | Não | Não | Não | Não documentado |
| ClickUp | Não (construtor com modelos) | Sim | Sim (Business) | Não | Não | Sim |
| monday.com | Não (construtor); Agile Insights fixo no monday dev | Não | Não (só app) | Não | Não (só no item) | Só no Workload |
| Pipefy | Não (construtor com exemplos) | Lead time e Phase time | Phase time | Sim: Vencido, Atrasado, Expirado | Não | Sim |
| Jira | Sim (Summary) + relatórios fixos | Sim (control chart) | Days in column | Só no JSM (Jira Service Management) | Só no JSM | Sim |
| Trello | 4 blocos padrão, editáveis | Não | Não | Não | Não | Não |
| Asana | Painel do projeto com gráficos padrão, editável | Average time to complete | Time in section | Não | Não | Não confirmado |
| Linear | Painel lateral Insights | Sim, com percentis | Só Triage time | Sim: 3 riscos, violado, cumprido, falhou | Via SLA | Sim |
| Zoho Projects | Sim (painel do projeto) | Não | Não | Não | Não | Não confirmado |
| Wrike | Sim (Analytics view) | Tempo médio de conclusão (modelo) | Média, total e máximo | Não | Não | Sim |

Nota sobre as fontes: ClickUp, monday.com, Asana e Wrike bloqueiam a leitura direta da ajuda. Nesses casos, o dado vem do trecho da página oficial mostrado na busca. O que a documentação não confirma aparece como "não confirmado".

---

## Notion

### Como resolve (em passos)

1. A pessoa abre um banco de dados e cria uma visualização do tipo Dashboard ("+ Add a new view" ou comando `/dash`). Só nos planos Business e Enterprise.
2. O painel tem até 12 widgets, 4 por linha. Cada widget é uma visualização do banco: tabela, quadro, calendário, gráfico ou linha do tempo.
3. O painel tem 2 modos. View: consulta, abre páginas e usa os filtros visíveis. Edit: monta, reordena e troca a visualização de cada widget.
4. Quem vê e quem edita segue a permissão do banco. Não há painel pronto de tarefas. Os modelos são de layout genérico (Team Status Hub, Incident/Ticket Overview, Executive Reporting).
5. Responsável: a propriedade Pessoa aceita várias pessoas. O "Task database" exige status, responsável e prazo, e alimenta o widget "My tasks" da Home, que junta as tarefas da pessoa de todos os bancos.
6. SLA: não existe. Atrasada depende de fórmula.
7. Drill-down: clicar num grupo do gráfico abre uma tabela com as páginas do grupo. A tabela pode virar visualização salva.

### Métricas nativas (nome → cálculo)

- Nenhuma métrica de tarefa vem pronta.
- Gráfico (Vertical bar, Horizontal bar, Line, Donut, Number) → contagem de páginas ou valor de uma propriedade, agrupado por outra propriedade.
- Agrupamento por data → dia, semana, mês, trimestre ou ano (fonte: guia de terceiro; a ajuda oficial não lista).
- Cumulative → soma acumulada no eixo do tempo.
- Status → 3 grupos fixos: To-do, In progress, Complete. O cliente cria status dentro de cada grupo.
- Lead time, atrasada, tempo restante → só com fórmula do cliente (`dateBetween`, `now()`).
- Burndown → só em modelos da comunidade.

### Filtros

- "Filter multiple sources": filtro global do painel. Vale só para widgets cuja visualização tem a propriedade filtrada.
- Cada widget mantém filtros e ordenações próprios.
- Limite do gráfico: 200 grupos e 50 subgrupos.

### URL(s)

- https://www.notion.com/help/dashboards
- https://www.notion.com/help/charts
- https://www.notion.com/help/sprints
- https://www.notion.com/en-gb/help/home-and-my-tasks
- https://www.notion.com/help/guides/status-property-gives-clarity-on-tasks
- https://matthiasfrank.de/en/notion-charts-guide/ (terceiro, agrupamento por data)

### Serve

- Filtro global que só age onde a propriedade existe. Resolve tarefa avulsa (sem etapa) e tarefa de fluxo (com etapa) no mesmo painel.
- Status em 3 grupos fixos acima dos status do cliente. Permite métrica padronizada com status personalizados, como o par status e substatus da demanda.
- Clique no gráfico abre a lista das tarefas.

### Não serve

- Tudo depende de montagem e de fórmula. A demanda pede painel fixo.
- Sem SLA, sem tempo em status, sem histórico de mudança de status.
- Restrito a planos altos.

---

## Twenty

### Como resolve (em passos)

1. A pessoa entra em Dashboards no menu, clica em "+ New Dashboard", dá um nome, cria abas e adiciona widgets.
2. O painel vale para o workspace inteiro: todo mundo vê.
3. Widgets: Bar, Pie, Line, Aggregate (1 número com prefixo e sufixo), Table, iFrame e Rich text. Desde a versão 2.24 (07/2026), o widget também mostra registros como tabela agrupada, kanban ou calendário.
4. A documentação não traz painel pronto nem modelo de tarefas.
5. Responsável: a tarefa tem 1 responsável (membro do workspace). Uma tarefa se liga a vários registros (pessoa, empresa, oportunidade).
6. SLA: não existe.
7. Drill-down: a documentação não fala.

### Métricas nativas (nome → cálculo)

- Nenhuma métrica de tarefa vem pronta.
- Aggregate → count, sum, average, min ou max de um campo numérico; ratio para campo de seleção.
- Group by → campo de seleção, data (a documentação cita dia e semana) ou relação.
- Atrasada → a própria documentação sugere a visualização "Overdue" com o filtro Due Date < hoje e Status ≠ Done.
- Concluídas → a página Tasks alterna entre "upcoming" e "completed".
- Lead time → impossível no nativo. O objeto Task tem prazo (`dueAt`) e status, mas não tem data de conclusão (conferido no código-fonte).

### Filtros

- Só por widget: registros, intervalo de datas, segmentos.
- Limite: 100 barras por gráfico e 50 grupos por barra.
- Sem exportação e sem compartilhamento com quem não usa o Twenty.

### URL(s)

- https://docs.twenty.com/user-guide/dashboards/overview
- https://docs.twenty.com/getting-started/core-concepts/dashboards
- https://docs.twenty.com/user-guide/dashboards/capabilities/widgets
- https://docs.twenty.com/user-guide/views-pipelines/how-tos/create-a-calendar-view-for-tasks-due
- https://twenty.com/releases
- https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/task/standard-objects/task.workspace-entity.ts

### Serve

- A definição de atrasada (prazo < hoje e status ≠ concluída) é a mesma dos outros produtos. Serve de texto de ajuda.
- O widget Aggregate (1 número grande com sufixo) é o formato dos KPIs (números-chave) do topo.
- Tarefa ligada a vários registros, como a tarefa do ENSPACE ligada a item.

### Não serve

- Construtor genérico de CRM, sem tempo, SLA ou histórico de status.
- Sem data de conclusão, não calcula o tempo da criação à conclusão.

---

## ClickUp

### Como resolve (em passos)

1. A pessoa cria um Dashboard do zero ou a partir de um modelo (Project Management, Team Workload, sprint). Cada cartão tem configuração própria.
2. Fora do Dashboard, 3 telas nativas mostram carga por pessoa:
   - Team view (antigo Box view): uma caixa por pessoa, com as tarefas agrupadas por status.
   - Workload view: carga por período contra a capacidade.
   - Cartão My Work da Home: seção "Overdue" com as tarefas atrasadas da pessoa.
3. Responsável: com o recurso opcional (ClickApp) Multiple Assignees, a tarefa aceita várias pessoas. O filtro de responsável aceita pessoa ou Team (grupo de usuários). Tarefa sem responsável tem cartão próprio e grupo "Unassigned" no Workload.
4. SLA: não existe. Só prazo (due date).
5. Drill-down: clicar num ponto do cartão abre uma List view com as tarefas daquele recorte.
6. Atualização: os cartões de tempo (Burndown, Burnup, Cumulative Flow, Lead time, Cycle time) atualizam 1 vez por dia, às 4h do dia seguinte, no fuso da pessoa.

### Métricas nativas (nome → cálculo)

- Cycle time → tempo médio entre a entrada num status do grupo Active e a chegada a um status Done ou Closed. A tarefa só entra no cálculo quando fecha. Sem o ClickApp Not Started, o 1º status do grupo Active conta como "não iniciado".
- Lead time → tempo médio entre a criação e a conclusão.
- Total time in Status → tempo em cada status, em dias ou horas, ou a data de entrada em cada status. Exige o ClickApp (plano Business ou maior).
- Tasks by Status → contagem por status (pizza, barra ou bateria).
- Tasks by Assignee → contagem por responsável (pizza, barra ou bateria).
- Total Unassigned Tasks → contagem de tarefas sem responsável.
- Overdue → prazo anterior a hoje e tarefa não fechada. A data fica vermelha; concluída no prazo, fica verde.
- Sprint Burndown, Burnup, Velocity → trabalho comprometido x concluído em 1 sprint (burndown), 3 ou mais (burnup) ou de 3 a 10 (velocity).
- Cumulative Flow → quantidade de tarefas em cada status ao longo do tempo.
- Workload → carga por pessoa em tarefas, sprint points ou estimativa de tempo, contra a capacidade.
- Datas de fim separadas: "Date done" (entrou num status Done) e "Date closed" (entrou em Closed).

### Filtros

- Dashboard filters valem para todos os cartões compatíveis, inclusive os criados depois.
- Datas filtráveis: due date, date created, start date, date updated, date closed, date done (intervalo, antes ou depois).
- Assignees: pessoa ou Team.
- O filtro do cartão soma com o do painel e aceita grupos com E/OU.

### URL(s)

- https://help.clickup.com/hc/en-us/articles/21498359011223-Cycle-time-cards
- https://help.clickup.com/hc/en-us/articles/21498376674967-Lead-time-cards
- https://help.clickup.com/hc/en-us/articles/6304185469719-Display-Total-time-in-Status
- https://help.clickup.com/hc/en-us/articles/6312203092119-Use-Dashboard-filters
- https://help.clickup.com/hc/en-us/articles/14995002699927-Drill-down-view-for-Dashboard-cards
- https://help.clickup.com/hc/en-us/articles/6311141304727-Assignee-cards
- https://help.clickup.com/hc/en-us/articles/6310063253911-Intro-to-Team-view
- https://help.clickup.com/hc/en-us/articles/6310449699735-Use-Workload-view
- https://help.clickup.com/hc/en-us/articles/16956329804311-Use-time-based-Dashboard-cards
- https://help.clickup.com/hc/en-us/articles/6309610317975-Intro-to-due-dates
- https://help.clickup.com/hc/en-us/articles/18947060934423-Use-the-My-Work-card-in-Home
- https://feedback.clickup.com/feature-requests/p/show-percentage-of-tasks-completed-before-due-date

### Serve

- Cycle e lead time calculados por grupo de status (não iniciado, ativo, concluído, fechado), não pelo nome. O ENSPACE pode fazer igual com status e substatus.
- 2 datas de fim (concluída x fechada): separa "concluída" de "encerrada sem fazer".
- O filtro de período do painel diz qual data usa (criação, conclusão, prazo). "Tarefas por mês" deixa de ser ambíguo.
- Cartão próprio para "sem responsável".
- Clique no número abre a lista filtrada.

### Não serve

- Construtor: o gestor monta e mantém.
- Cartões de tempo com 1 dia de atraso.
- Sem SLA e sem taxa de conclusão no prazo (pedido aberto no fórum de ideias).
- A documentação não diz se a tarefa com vários responsáveis conta 1 vez para cada pessoa.

---

## monday.com

### Como resolve (em passos)

1. A pessoa cria um Dashboard, conecta quadros (boards) e adiciona widgets. Todo widget é editável.
2. Exceção fixa no monday dev: a visualização Agile Insights, com gráficos prontos de Velocity, Planned vs unplanned e Burndown.
3. A página My Work agrupa as tarefas da pessoa por data: Past dates, Today, This week, Next week, Later e Without a date, com o total ao lado de cada grupo.
4. Responsável: a coluna People aceita várias pessoas. No widget Workload, a tarefa com várias pessoas usa "Split" (divide o esforço em partes iguais) ou "Sum" (cada pessoa recebe o esforço inteiro).
5. SLA: não existe. O mais próximo é o Deadline Mode da coluna de data.
6. Drill-down: no Workload, clicar no círculo abre as tarefas daquele período. Nos outros widgets, não confirmado.

### Métricas nativas (nome → cálculo)

- Battery → % de itens com status marcado como "Done". Os outros status aparecem como círculos coloridos.
- Chart → contagem, soma ou média por coluna; datas agrupadas por semana, mês ou trimestre.
- Numbers → soma, média, contagem ou máximo. Para contar atrasadas, a pessoa filtra o widget pela coluna de data.
- Workload → tarefas ou esforço por pessoa ao longo do tempo. Bolha vermelha quando passa da capacidade, que segue o horário de trabalho e as folgas.
- Overview → 1 linha por quadro, com datas, barra de progresso (feitas x restantes) e um status calculado, como "At Risk". O cálculo compara o % de tempo decorrido com o % de itens feitos.
- Deadline Mode (por item, sem total) → liga a coluna de data à de status. Mostra dias restantes, atraso em vermelho e check verde para concluída no prazo. A hora da data define o momento do atraso.
- Burndown (monday dev) → esforço feito x restante na sprint.
- Tempo em status → não existe nativo; só por app do marketplace.

### Filtros

- Filtro do painel (ícone de funil): rápido (quadro, grupo ou qualquer coluna) ou avançado (condições combinadas). Até 50 colunas.
- Filtro por widget, separado do filtro do painel.

### URL(s)

- https://support.monday.com/hc/en-us/articles/360002646059-Deadline-Mode
- https://support.monday.com/hc/en-us/articles/360010699760-The-Workload-Widget
- https://support.monday.com/hc/en-us/articles/360002159360-The-Battery-Widget
- https://support.monday.com/hc/en-us/articles/360001262665-The-Chart-Widget
- https://support.monday.com/hc/en-us/articles/360007078739-The-Overview-Widget
- https://community.monday.com/t/how-is-status-calculated-in-dashboard-overview-widget/6679
- https://support.monday.com/hc/en-us/articles/360002195819-The-Numbers-Widget
- https://support.monday.com/hc/en-us/articles/26236621618578-Filters-on-your-Dashboard
- https://support.monday.com/hc/en-us/articles/360019300579-My-Work
- https://support.monday.com/hc/en-us/articles/20358136752018-Enhance-sprint-planning-with-Agile-Insights
- https://community.monday.com/t/is-there-a-dashboard-widget-for-deadline-stats-on-completed-items/54128

### Serve

- "At Risk" por tempo decorrido x trabalho feito: um "em risco" que não depende de SLA configurado.
- Os grupos do My Work (passou, hoje, esta semana, próxima, depois, sem data) são faixas prontas de "tempo que falta para vencer".
- Split x Sum deixa explícita a regra da tarefa com várias pessoas.
- Deadline Mode separa "concluída no prazo" de "atrasada" em cada item.

### Não serve

- Construtor: até contar atrasadas exige filtro manual.
- Sem lead time, cycle time ou tempo em status nativos.
- O Deadline Mode não vira número no painel. A comunidade pede um widget de conclusão no prazo.

---

## Pipefy

### Como resolve (em passos)

1. Em cada pipe (processo), o cabeçalho tem Dashboards: "Create dashboard" e depois "Add chart". Dá para começar do zero ou de um exemplo (contas a pagar, contas a receber).
2. Cada gráfico pede 3 coisas:
   - medida (número);
   - dimensão (título do card, etiqueta, fase atual, responsável);
   - agrupamento de tempo. Sem agrupamento, o gráfico usa todos os dados desde a criação do pipe.
3. A aba Reports lista cards em tabela, com filtros e exportação. Company reports juntam vários pipes.
4. Permissão: no plano Pro, cada dashboard tem 3 níveis (View and Edit, Read Only, Don't show dashboard).
5. Responsável: o card aceita vários responsáveis; "assignee" serve de dimensão e de filtro.
6. SLA: 3 alertas (abaixo), com opção de contar de segunda a sexta e regras avançadas (feriados, expedientes diferentes, fusos).
7. Drill-down: clicar na barra, fatia ou célula abre os detalhes dos cards, cada um com link para o card.

### Métricas nativas (nome → cálculo)

- Lead time → tempo do card desde a criação até a fase final. Card aberto continua contando.
- Phase time → tempo do card numa fase.
- Contagens → cards, anexos, comentários, responsáveis. Cálculos: soma, total corrido, média, acumulado, mínimo, máximo.
- Vencido (Overdue) → passou da data do campo de vencimento do card. Cinza com folga, amarelo perto, vermelho vencido. Muda quando alguém muda a data.
- Atrasado (Late) → passou do tempo máximo na fase (SLA da fase), contado desde a chegada do card à fase. Relógio amarelo; a fase mostra quantos cards estão atrasados. Some quando o card sai da fase.
- Expirado (Expired) → passou do tempo máximo entre a criação e a fase final (SLA do pipe). Relógio vermelho. Fica marcado, mesmo se o SLA mudar.
- Colunas de relatório → "Overdue" (Sim/Não) e "Expired at" (data em que expirou).
- Formatos: Area, Bar, Calendar, Line, Number, Pie, Scatter, Table.

### Filtros

- Gráfico: período relativo (últimos 7 dias, mês anterior) ou todo o período; filtros por campo (ex.: finished at, current phase).
- Relatório: fase, responsável, campos e datas (período, relativo, absoluto). Exporta até 30.000 linhas.
- Kanban: não filtra por alerta. O pedido está aberto na comunidade desde 2021.

### URL(s)

- https://help.pipefy.com/en/articles/625596-set-up-alerts-in-the-pipe
- https://help.pipefy.com/en/articles/5610976-what-are-dashboards
- https://help.pipefy.com/en/articles/6047064-how-to-create-dashboards
- https://help.pipefy.com/en/articles/619297-how-to-create-pipe-reports
- https://community.pipefy.com/tips-and-inspiration-45/process-lead-time-280
- https://community.pipefy.com/ideas/filter-cards-by-pipe-alerts-late-expired-and-or-overdue-717
- https://community.pipefy.com/pergunte-a-comunidade-38/dashboard-com-quantidade-de-cards-em-atraso-status-sla-2750
- https://community.pipefy.com/novidades-81/conheca-as-regras-avancadas-de-sla-3610

### Serve

- Vocabulário de SLA em português, em 3 níveis, com a mesma estrutura do ENSPACE: prazo da tarefa (Vencido), SLA da etapa (Atrasado), SLA do fluxo inteiro (Expirado).
- Lead time (fluxo) e phase time (etapa) como medidas prontas.
- Contagem em dias úteis e regra de feriado.
- Número de atrasados ao lado do nome da fase: o KPI aparece onde o problema está.

### Não serve

- Não há painel pronto. Para contar cards atrasados, a própria comunidade indica relatório ou API.
- "Atrasado" no Pipefy é SLA de fase. Na demanda do ENSPACE, "atrasada" pode ter outro sentido; copiar a palavra sem a definição confunde.
- O lead time mistura card aberto (ainda contando) com card concluído.

---

## Jira

Jira Software, Jira Work Management e Jira Service Management (JSM).

### Como resolve (em passos)

1. Cada espaço (projeto) tem a aba Summary: um painel pronto, ligado por padrão. O admin do espaço liga ou desliga. No JSM, o admin também escolhe e reorganiza os gráficos.
2. O Summary mostra 4 cartões de números, Status overview, Recent activity, Priority breakdown, Types of work, Team workload e, em espaços de software, Work progress (épicos).
3. A área Reports reúne relatórios fixos, cada um numa tela: control chart, cumulative flow, sprint burndown, created vs resolved, average age, resolution time e outros.
4. Responsável: 1 por item. O Team workload mostra contagem e % por pessoa, com a linha "Unassigned".
5. SLA: só no JSM. Cada SLA tem condição de início, de pausa ("Pause on") e de fim, metas por prioridade e um calendário de expediente.
6. Drill-down: no Summary, o clique leva à List view já filtrada. No control chart, o clique no ponto mostra o item.
7. No quadro, "Days in column" mostra pontos com os dias do item na coluna. Se o item volta à coluna, os dias somam.

### Métricas nativas (nome → cálculo)

- Cartões do Summary → concluídos, atualizados e criados nos últimos 7 dias; itens que vencem nos próximos 7 dias.
- Status overview → itens por status. Em Done, só os concluídos nas últimas 2 semanas.
- Team workload → itens por responsável, em número e %.
- Control chart → tempo de cada item nas colunas escolhidas. Colunas de trabalho = cycle time; da criação ao fim = lead time. Soma as várias passagens (item reaberto conta de novo). Mostra média, média móvel (janela de 20% dos itens, mínimo 5) e desvio padrão.
- Cycle time report → mediana por semana e mediana das últimas 12 semanas (exige 4 semanas de dados).
- Cumulative flow diagram → itens por status ao longo do tempo. Faixa que alarga indica gargalo.
- Created vs Resolved → criados x resolvidos por período (dia, semana, mês, trimestre, ano). Vermelho quando entra mais do que sai; opção acumulada.
- Average Age → soma dos dias em aberto das pendentes dividida pelo número de pendentes, a cada período.
- SLA met vs breached (JSM) → itens que cumpriram x violaram a meta.
- SLA success rate (JSM) → % dentro da meta.
- Time to resolution (JSM) → tempo de resolução por tipo ou prioridade.
- Estados do SLA (consulta em JQL, a linguagem de busca do Jira) → running, paused, breached (o ciclo atual falhou), everBreached (algum ciclo falhou), completed, remaining("2h") (positivo: tempo que falta; negativo: tempo desde a violação).
- Cores do SLA na fila → sem cor com mais de 1 h; cinza entre 1 h e 30 min; laranja com menos de 30 min; vermelho quando viola.

### Filtros

- Summary: intervalo de datas, responsável (inclusive sem responsável), tipo, status, item pai, prioridade.
- Relatórios: período, dias para trás, filtro salvo (JQL), colunas, swimlanes, quick filters.

### URL(s)

- https://support.atlassian.com/jira-software-cloud/docs/what-is-the-summary-view/
- https://support.atlassian.com/jira-service-management-cloud/docs/gain-an-overview-of-your-work-with-the-project-summary-page/
- https://support.atlassian.com/jira-software-cloud/docs/view-and-understand-the-control-chart/
- https://support.atlassian.com/jira-software-cloud/docs/view-and-understand-your-cycle-time-report/
- https://support.atlassian.com/jira-software-cloud/docs/view-and-understand-the-cumulative-flow-diagram/
- https://support.atlassian.com/jira-work-management/docs/generate-a-report/
- https://support.atlassian.com/jira/kb/how-is-the-jira-average-age-report-calculated/
- https://support.atlassian.com/jira-service-management-cloud/docs/what-are-custom-reports/
- https://support.atlassian.com/jira-service-management-cloud/docs/write-jql-queries-for-slas/
- https://support.atlassian.com/jira-service-management-cloud/docs/set-up-sla-conditions/
- https://support.atlassian.com/jira-service-management-cloud/docs/what-are-slas-and-how-do-i-view-them-in-my-service-project/
- https://support.atlassian.com/jira-software-cloud/docs/customize-cards/

### Serve

- O Summary é a referência mais próxima da demanda: pronto, 4 números no topo, filtros globais, clique para a lista.
- Janelas fixas curtas ("últimos 7 dias", "próximos 7 dias"): o gestor lê sem escolher período.
- Created vs resolved responde "a fila cresce ou encolhe?". Average age responde "há quanto tempo as abertas esperam?".
- SLA do JSM: pausa, calendário de expediente, "breached" x "everBreached" e tempo restante negativo depois da violação.
- Days in column: tempo em status acumulado, visível no cartão.

### Não serve

- Tempos e SLA ficam fora do Summary, em relatórios de telas diferentes.
- Control chart e desvio padrão pedem leitura estatística; o gestor da demanda quer número direto.
- SLA só existe no produto de atendimento (JSM).

---

## Trello

### Como resolve (em passos)

1. Nos planos Premium ou maiores, o quadro tem a visualização Dashboard.
2. O painel abre com 4 blocos: Cards per list, Cards per due date, Cards per member e Cards per label. Cada bloco é barra ou pizza. A pessoa edita, exclui ou adiciona blocos.
3. Responsável: o card aceita vários membros.
4. SLA: não existe. A automação (Butler) age antes, no momento ou depois do prazo (move, etiqueta, comenta) e envia relatório agendado por e-mail.
5. Drill-down: não existe. O mouse sobre o gráfico mostra a contagem. O painel não exporta e não abre no celular.

### Métricas nativas (nome → cálculo)

- Cards per list, per member, per label → contagem de cards.
- Cards per due date → contagem por situação do prazo.
- Cor do prazo no card → cinza (mais de 24 h), amarelo "due soon" (menos de 24 h), vermelho (venceu há menos de 24 h), rosa claro (vencido há mais de 24 h), verde (marcado como completo).
- Card Aging (extensão Power-Up, descontinuada) → o card desbotava após 1, 2 e 4 semanas sem atividade. Um filtro de cards substituiu o Power-Up.

### Filtros

- Filtro por bloco. Sem filtro de período.

### URL(s)

- https://support.atlassian.com/trello/docs/dashboard-view/
- https://community.atlassian.com/forums/Trello-questions/Due-date-warning-colours/qaq-p/633404
- https://support.atlassian.com/trello/docs/using-the-card-aging-power-up/
- https://community.atlassian.com/forums/Trello-articles/A-new-way-to-filter-Trello-cards-saying-goodbye-to-the-Card/ba-p/2374997
- https://trello.com/butler-automation

### Serve

- 4 blocos padrão, prontos: um conjunto fixo e pequeno atende o 1º uso.
- A escala de cor separa "vencida há pouco" de "vencida há muito": 2 graus de atraso.
- Idade sem atividade como sinal visual.

### Não serve

- Sem tempos, sem período, sem clique para a lista.

---

## Asana

### Como resolve (em passos)

1. Cada projeto tem a aba Dashboard (a partir do plano Starter). Portfólios e o Universal reporting (a partir do Advanced) juntam vários projetos.
2. O painel do projeto abre com números no topo (tarefas concluídas, incompletas e atrasadas) e gráficos padrão, como "Task completion over time" (burnup) e "Incomplete tasks by section". A pessoa adiciona, edita e remove gráficos.
3. Responsável: 1 por tarefa.
4. SLA: não existe.
5. Workload (portfólio): carga por pessoa em tarefas ou esforço (horas, pontos, %), contra a capacidade. A tarefa entra no cálculo se tiver responsável, prazo e projeto.
6. Drill-down: não confirmado na documentação lida.

### Métricas nativas (nome → cálculo)

- Total completed, incomplete, overdue tasks → contagens. Atrasada = incompleta e com prazo passado.
- Task completion over time → concluídas acumuladas ao longo do tempo (burnup).
- Time in section / Time in custom field → tempo da tarefa numa seção ou num valor de campo, em soma ou média. Existe desde 09/2022.
- Average time to complete → tempo da criação à conclusão. A comunidade pergunta se conta fim de semana e horário fora do expediente; não há resposta oficial.
- Created on, Completed on, Last modified → colunas de lista (desde 05/2022). A conta fica com o cliente.
- Concluída no prazo → não existe. A equipe do Asana sugere busca avançada e planilha; add-ons (Screenful) entregam "Completed on time" e "Completed overdue".

### Filtros

- Datas: "within the last", "within the next", "between", "on". Não há "este mês" dinâmico (pedido aberto).
- Projeto, responsável, seção, campo.

### URL(s)

- https://help.asana.com/s/article/project-dashboards?language=en_US
- https://help.asana.com/s/article/reporting-with-dashboards?language=en_US
- https://help.asana.com/s/article/universal-reporting?language=en_US
- https://help.asana.com/s/article/portfolio-workload-and-universal-workload?language=en_US
- https://forum.asana.com/t/track-time-a-task-spent-in-each-column/101944
- https://forum.asana.com/t/calculate-time-to-complete-a-task/86547
- https://forum.asana.com/t/average-time-to-complete-reporting/170083
- https://forum.asana.com/t/reporting-on-time-completion-of-tasks/62412
- https://forum.asana.com/t/project-dashboard-delete-task-completion-over-time-chart/122548

### Serve

- Os 3 números do topo (concluídas, incompletas, atrasadas): o KPI mínimo de um painel de tarefas.
- Time in section: tempo médio por etapa sem configurar.
- A dúvida sobre fim de semana mostra que o cartão precisa dizer se conta dias corridos ou úteis.

### Não serve

- Sem SLA e sem taxa de conclusão no prazo.
- Painel editável e por projeto. A visão de tudo junto exige o plano Advanced.

---

## Linear

### Como resolve (em passos)

1. Quase toda lista de itens tem o painel Insights na lateral direita (Ctrl+Shift+I), em visualizações de time, projeto, ciclo e personalizadas.
2. A pessoa escolhe a medida (eixo y), o recorte (eixo x) e, se quiser, um segmento (cor).
3. Dashboards (plano Enterprise) juntam vários Insights em gráficos, tabelas e números. O filtro do painel vale para todos os blocos. O painel pertence ao workspace, a um time ou a 1 pessoa. O botão "Refresh data" atualiza os dados.
4. Responsável: 1 por item.
5. SLA: estados e cores prontos (abaixo), com opção de dias úteis.
6. Drill-down: clicar em gráfico ou número abre a lista filtrada.

### Métricas nativas (nome → cálculo)

- Issue count → número de itens.
- Effort → soma das estimativas.
- Cycle time → do início (status do tipo "started") à conclusão.
- Lead time → da criação à conclusão.
- Triage time → tempo no status Triage.
- Issue age → idade do item desde a criação.
- Os tempos aparecem com percentis 25, 50, 75 e 95, em escala logarítmica por padrão.
- Cycle graph → escopo (cinza), iniciados (amarelo), concluídos (azul) e meta (pontilhada, plana no fim de semana).
- Prazo → vermelho quando vence hoje ou já venceu; laranja quando vence em até 1 semana; cinza no resto.
- SLA → 7 estados:
  - Low risk: mais de 1 semana para o limite.
  - Medium risk: até 1 semana.
  - High risk: até 1 dia.
  - Breached: o limite passou.
  - Achieved: concluído dentro do limite.
  - Failed: concluído depois de violar.
  - No SLA.
- Ícone do SLA → cinza, amarelo, laranja, vermelho. Aviso 24 h antes e na violação.

### Filtros

- Recortes: status, tipo de status, responsável, criador, prioridade, etiqueta, SLA status, projeto, ciclo, time, datas (criação, conclusão, cancelamento, início, prazo) e burn-up.
- Prazo: "Overdue", "1 day from now", "1 week from now", sem prazo, intervalo.
- Dias úteis: segunda a sexta por padrão; o workspace muda para domingo a quinta.

### URL(s)

- https://linear.app/docs/insights
- https://linear.app/insights
- https://linear.app/docs/dashboards
- https://linear.app/docs/sla
- https://linear.app/docs/due-dates
- https://linear.app/docs/cycle-graph

### Serve

- O SLA separa aberto (risco baixo, médio, alto, violado) de fechado (cumprido, falhou). Um só campo responde "no prazo", "em risco", "vencida", "concluída no prazo" e "concluída com atraso".
- Percentis além da média: a mediana muda pouco com 1 tarefa aberta há meses.
- Issue age para as abertas; lead e cycle time para as fechadas.
- Cor de prazo em 3 faixas (vencida ou hoje, até 1 semana, depois).

### Não serve

- O painel se monta. Fixo, só o painel lateral de cada lista.
- Faixas de risco em semanas e dias: largas demais para tarefa de horas.
- Não mede tempo em cada status, só em Triage.

---

## Zoho Projects

### Como resolve (em passos)

1. Cada projeto abre num painel com widgets padrão. A pessoa também cria widgets (gráfico, número, URL), edita, clona e exclui.
2. Permissão por painel: Full Access, Editor, Viewer.
3. Responsável: o widget Team Status lista cada pessoa.
4. SLA: não aparece no painel.
5. Drill-down: não confirmado.

### Métricas nativas (nome → cálculo)

- Task Status, Issue Status, Phase Status → abertas x fechadas.
- Today's Work Items → previstas para hoje.
- Overdue Work Items → incompletas com prazo passado.
- Upcoming Events → previstas para a semana.
- Team Status → por pessoa: atrasadas, abertas e itens do dia.
- Top 5 Go-getters → 5 pessoas com mais tarefas fechadas.
- Task Progress Chart → tarefas por % de conclusão.
- Weekly Digest → situação da semana, com seletor de semana.
- Budget Status (Planned vs Actual) e Timesheet Summary → horas e custo.

### Filtros

- Critérios por widget; seletor de semana no Weekly Digest.

### URL(s)

- https://help.zoho.com/portal/en/kb/projects/projects/project-operations/articles/dashboard-projects

### Serve

- Team Status: atrasadas e abertas lado a lado, por pessoa. É o "tarefas por responsável" com o recorte de SLA.
- Faixas "hoje" e "esta semana" separadas de "atrasadas".

### Não serve

- O ranking (Top 5) expõe pessoas; foge do objetivo de acompanhar tarefas.
- Sem tempos de ciclo.

---

## Wrike

### Como resolve (em passos)

1. Cada pasta, projeto ou espaço tem a Analytics view, com a seção Overview pronta.
2. Modelos de Analytics board (Project Overview, Project Status, Productivity Analysis) criam painéis que a pessoa edita depois.
3. Responsável: a Overview conta as tarefas sem responsável.
4. SLA: não existe.
5. Drill-down: clicar numa métrica da Overview abre a lista das tarefas daquela categoria.

### Métricas nativas (nome → cálculo)

- Task Digest → pizza por status ou por prazo, mais a contagem de sem responsável, importantes e atrasadas.
- Task Duration → soma da duração das tarefas planejadas ativas.
- Tracked Time → horas lançadas.
- Top Performers → 3 pessoas com mais tarefas concluídas.
- Productivity Analysis (modelo) → criadas e concluídas no mês x mês anterior; tempo médio de conclusão no mês x mês anterior; tempo médio em cada status; % concluídas.
- Relatório avançado → tempo médio, total e máximo em cada status, pelo histórico de status.

### Filtros

- Escopo pela pasta ou projeto; período nos modelos.

### URL(s)

- https://help.wrike.com/hc/en-us/articles/1500005127361-Performance-Analytics-Overview-Statistics
- https://help.wrike.com/hc/en-us/articles/1500005226682-Creating-Analytics-Boards-From-Templates
- https://help.wrike.com/hc/en-us/articles/360038191973-Advanced-Reporting-Available-Data

### Serve

- Comparação com o período anterior em cada KPI (mês x mês anterior).
- Máximo em status, além da média: mostra o pior caso.
- Contagem de sem responsável na visão geral.

### Não serve

- Métricas de tempo só nos modelos editáveis ou no módulo pago de análise.

---

## O padrão que todos seguem

### Definições que convergem

| Métrica | Definição | Quem usa assim |
|---|---|---|
| Atrasada (overdue) | Tarefa aberta com prazo anterior a agora | Twenty, ClickUp, Asana, Zoho, Linear, Trello, Wrike, Pipefy (Vencido) |
| Vence em breve | Aberta com prazo dentro de uma janela | Trello (24 h), Linear (7 dias), Jira Summary (7 dias), JSM (30 min) |
| Lead time | Criação → conclusão | ClickUp, Linear, Pipefy, Jira (control chart com todas as colunas), Asana (Average time to complete) |
| Cycle time | 1º status de trabalho → conclusão | ClickUp, Linear, Jira |
| Tempo em status | Soma do tempo em cada status; voltar ao status soma | Jira (Days in column, control chart), ClickUp, Asana (Time in section), Wrike, Pipefy (Phase time) |
| Idade (aging) | Agora menos a criação, só das abertas | Jira (Average age), Linear (Issue age), Trello (Card Aging, por inatividade) |
| Criadas x concluídas | Contagem das 2 datas por período | Jira (Created vs Resolved), Wrike, Asana (burnup), Linear (recorte por data) |
| Burndown / burnup | Restante ou concluído x escopo num período fechado | Jira, ClickUp, Linear (cycle graph), monday dev, Asana |
| Carga por pessoa | Abertas (ou esforço) por pessoa num período, contra a capacidade | ClickUp, monday.com, Asana, Jira (sem capacidade), Zoho |
| SLA violado | Passou do limite, aberta ou fechada | JSM (breached), Linear (Breached, Failed), Pipefy (Expirado) |
| Concluída no prazo | Concluída antes do limite | Linear (Achieved), JSM (met). Pelo prazo comum da tarefa, ninguém calcula |

### Atrasada x vencida: onde não há consenso

- A maioria usa 1 palavra (overdue) para "aberta com prazo passado".
- A diferença aparece em 3 eixos:
  - Qual limite. Pipefy: Vencido (prazo do card), Atrasado (SLA da fase), Expirado (SLA do processo).
  - Aberta ou fechada. Linear: Breached (aberta) x Failed (fechada depois de violar). JSM: breached (ciclo atual) x everBreached (algum ciclo). monday.com: atraso em aberto x check verde de concluída no prazo.
  - Tempo desde o vencimento. Trello: vermelho nas 1ªs 24 h, rosa depois.
- A demanda usa 3 palavras (atrasadas, no prazo, vencidas). Entre os produtos, só o Pipefy usa "atrasado" e "vencido" com sentidos diferentes, e cada um se liga a um limite diferente.
- Modelo que junta o que converge (Linear e Pipefy):
  - Abertas: no prazo, em risco (vence dentro da janela), vencida (prazo passou).
  - Fechadas: concluída no prazo, concluída com atraso.
  - Limite em 3 níveis: prazo da tarefa, SLA da etapa, SLA do fluxo.

### Convenções de tela

1. 3 ou 4 números no topo. Jira: concluídos, atualizados, criados, vencem em 7 dias. Asana: concluídas, incompletas, atrasadas. Wrike e Zoho seguem o mesmo formato.
2. Janela padrão curta e fixa. Jira: 7 dias para trás e 7 para frente. Wrike: mês atual x mês anterior.
3. Filtro global no topo, aplicado a todos os blocos: período, responsável (com "sem responsável"), status, tipo, prioridade (Jira, ClickUp, Linear, monday.com, Notion).
4. O filtro de período diz qual data usa: criação, conclusão, prazo ou atualização (ClickUp, Asana, Linear).
5. Clique no número abre a lista filtrada (Jira, ClickUp, Linear, Wrike, Pipefy, Notion). Só o Trello não tem.
6. Status agrupado em categorias fixas (a fazer, em andamento, concluída) acima dos status do cliente, e as métricas usam a categoria (Notion, ClickUp, Linear, Jira).
7. "Sem responsável" como categoria própria (Jira, ClickUp, Wrike).
8. Cor por urgência do prazo: cinza, amarelo ou laranja, vermelho (Trello, Linear, Pipefy, JSM).
9. Tempo com mais de 1 estatística: média (ClickUp, Pipefy), mediana (Jira), percentis (Linear), máximo (Wrike).
10. SLA com dias úteis e pausa: JSM (calendário e pausa), Pipefy (segunda a sexta, feriados), Linear (dias úteis).

---

## O que nenhum deles faz

1. **Painel fixo com contagem, SLA e tempos na mesma tela.** O Jira Summary é fixo, mas não traz SLA nem tempo. Linear e ClickUp têm os tempos, mas pedem montagem.
2. **Taxa de conclusão no prazo pelo prazo da tarefa.** Asana, ClickUp e monday.com têm pedidos abertos. Linear e JSM calculam, mas só para SLA configurado.
3. **Tempo médio em 3 níveis ligados: tarefa, etapa e fluxo.** O Pipefy mede fluxo (lead time) e fase (phase time), mas não a tarefa. O Jira mede o item, mas não o processo.
4. **"Tempo que falta para vencer" em faixas agregadas** (vencida, vence hoje, em 24 h, em 7 dias, depois, sem prazo). Trello, monday.com (My Work) e Linear usam faixas só para colorir o item ou agrupar a lista de 1 pessoa.
5. **Regra visível para tarefa de grupo ou de várias pessoas.** O ClickUp filtra por Team e o monday.com deixa escolher Split ou Sum, só para esforço. Nenhum painel diz na tela se a tarefa conta 1 vez para o grupo ou 1 vez para cada pessoa, nem mostra "todos" ao lado de pessoa e grupo.
6. **Substatus.** Todos agrupam status em categorias. Nenhum abre a categoria em substatus no painel.
7. **Definição no próprio cartão.** A dúvida do Asana (conta fim de semana?) se repete. Nenhum cartão diz como calcula, se usa dias úteis nem qual data o período filtra.
8. **Comparação com o período anterior em todo KPI.** Só os modelos do Wrike mostram (mês x mês anterior).
9. **Pausa do SLA em tarefa comum.** Só o JSM pausa, e só em chamado de atendimento.
10. **Hora do dado no cartão.** O ClickUp atualiza os cartões de tempo 1 vez por dia; o Linear tem o botão "Refresh data". A documentação de nenhum dos 2 fala em mostrar no cartão a hora da última atualização.

---

## O que o painel do ENSPACE pegou de cada um

| De onde | O que entrou | Onde está |
|---|---|---|
| Jira Summary | Painel pronto, números no topo, filtro global, clique no número abre a lista | Cartões do topo e a lista lateral |
| Jira Created vs Resolved | Criadas x concluídas por período, com o saldo | "Criadas e concluídas" |
| Linear SLA | Separar aberta (no prazo, em risco, violada) de fechada (cumprida, falhou) | Bloco SLA, 2 barras |
| Linear e Jira | Mediana ao lado da média; percentil 90 | Cartão de tempo e bloco de tempos |
| Pipefy | Tempo de fase (etapa) e de processo (fluxo) como medida pronta | Abas Etapa e Fluxo |
| monday.com My Work | Faixas de prazo (passou, hoje, semana, depois, sem data) | "Tempo até o prazo" |
| Wrike | Comparação com o período anterior em cada número | Variação nos cartões do período |
| ClickUp, Jira, Wrike | "Sem responsável" como linha própria | Tabela por responsável |
| Notion, ClickUp, Linear, Jira | Status em poucas categorias fixas acima do status de cada motor | Status virtual |
| ClickUp | O filtro de período diz qual data recorta | Selo "Agora" e "No período" em cada número |
| Linear, Jira, Todoist, Asana | "A vencer" em 7 dias corridos, com o dia do prazo em destaque (rodada 2) | Número "A vencer" e faixas de prazo |
| ClickUp (dashboard e My Tasks) | Modo de edição, mover, redimensionar, ocultar e trazer de volta no mesmo catálogo, desfazer (rodada 2) | "Personalizar" e "Adicionar painel" |
| ClickUp (List view) | Lista que carrega mais ao rolar (rodada 2) | Próximas a vencer, Responsáveis, Tempo por tarefa |
| Template de dashboard do Nuxt UI e admin do ENSPACE | Número com ícone em círculo e selo de variação, barra de filtros fantasma, tabela com busca, colunas e paginação (rodada 2) | Painéis de número, barra de filtros, lista lateral |

## O que ficou de fora, e por quê

- **Construtor de widgets** (Notion, Twenty, ClickUp, monday.com, Pipefy): a demanda pede painel fixo, e o ENSPACE já tem construtor para itens.
- **Burndown, velocity e sprint** (Jira, ClickUp, monday dev): o ENSPACE não tem sprint nem estimativa de esforço.
- **Carga contra capacidade** (ClickUp, monday.com, Asana): o ENSPACE não tem capacidade por pessoa nem estimativa de tempo.
- **Ranking de pessoas** (Zoho "Top 5 Go-getters", Wrike "Top Performers"): expõe gente, e a demanda é gerir tarefa.
- **Pausa do SLA** (Jira Service Management): o ENSPACE não grava pausa. Não dá para calcular.

---

## Rodada 2: a vencer, personalização e a estrutura do admin

Pesquisa de 2026-09-30. A ajuda do ClickUp e a do monday.com recusam leitura direta; li os artigos pela API pública da central de ajuda deles, que devolve o mesmo texto. "Não confirmado" marca o que veio só de fórum, blog ou trecho de busca.

### A vencer: qual janela o mercado usa

| Produto | Janela | Onde aparece | Fonte |
|---|---|---|---|
| Linear | 7 dias | ícone do prazo laranja; filtro "Due soon" | https://linear.app/docs/due-dates |
| Jira | 7 dias | cartão "due soon" do Summary | https://support.atlassian.com/jira-software-cloud/docs/what-is-the-summary-view/ |
| Todoist | 7 dias, em 3 cores (hoje, amanhã, 2 a 7 dias) | cor da data | https://www.todoist.com/help/todoist/features/schedule-a-date-and-time-for-your-todoist-tasks-q7VobO |
| Asana | 7 dias (seção Upcoming antiga) | My Tasks | https://forum.asana.com/t/upcoming-vs-later-what-is-next-week/84804 |
| monday.com | semana do calendário | grupos "This week" e "Next week" do My Work | https://support.monday.com/hc/en-us/articles/360019300579-My-Work |
| Wrike | semana do calendário (não confirmado) | grupo "This week" do My Work | https://help.wrike.com/hc/en-us/community/posts/360034309973--Today-vs-This-Week-in-My-Work |
| Trello | 24 h | selo amarelo "Due soon" | https://support.atlassian.com/trello/docs/adding-dates-to-cards/ |
| ClickUp | nenhuma na cor (laranja só no dia); "Next 7 days" no filtro | cor da data e filtros prontos | https://help.clickup.com/hc/en-us/articles/6309610317975-Intro-to-due-dates |

- **7 dias corridos é o corte mais comum** (4 produtos, mais o filtro do ClickUp). 24 h é só o Trello.
- Janela corrida é mais estável que semana do calendário: numa sexta-feira, "esta semana" cobre 1 dia.
- Dentro dos 7 dias, quase todos destacam o dia do prazo (Linear, ClickUp, Todoist). Vencida fica fora do "a vencer" em todos.

### Personalização no ClickUp, em passos

1. **Modo de edição.** Botão "Edit mode" no dashboard. Criado porque as pessoas moviam cartões sem querer (https://clickup.canny.io/changelog/viewedit-mode-in-dashboards). Fora dele: atualizar e tela cheia.
2. **Mover.** Arrasta o cartão; os outros se ajustam. Na página pessoal (My Tasks), pela alça ao lado do nome (https://help.clickup.com/hc/en-us/articles/18944788880791-My-Tasks-page-formerly-Home).
3. **Redimensionar.** Pelas laterais e cantos, no modo de edição, com mínimo e máximo por cartão (https://help.clickup.com/hc/en-us/articles/34275916892951-Move-and-resize-cards-on-Dashboards).
4. **Auto layout.** Sobe os cartões para fechar buraco.
5. **Desfazer.** Até 5 mudanças, com Ctrl+Z. Não há "restaurar padrão".
6. **Ocultar e trazer de volta.** No dashboard, "Delete card" e "+ Card" (catálogo com busca e 12 categorias). Na página pessoal, "Manage cards": o cartão na tela mostra "Added"; clicar tira.
7. **Menu do cartão.** Atualizar, tela cheia, filtros, ordenar; no "…", Duplicate, Delete card e Export.
8. **Quem muda.** Dashboard: quem tem Edit, e o layout vale para todos. Página pessoal: cada um.
9. **Cartão de lista.** "Faz tudo o que a List view faz"; a List view carrega 60 tarefas por grupo e busca mais ao rolar (https://help.clickup.com/hc/en-us/articles/15822815173015-Task-List-cards).

Comparação: monday.com tem alternador Edit e View, e só o dono mexe (limite de 30 widgets). Jira não redimensiona: a largura vem do layout de 1 a 3 colunas.

### Template de dashboard do Nuxt UI e o admin do ENSPACE

O admin do ENSPACE (`control.develop.enspace.io`) é o template de dashboard do Nuxt UI (https://ui.nuxt.com/templates) com o tema do ENSPACE. Visto só em leitura, sem acionar nada, em 30/09/2026.

- **Home:** barra com o período (ícone de calendário, intervalo de datas, seta) e a granularidade ("Daily"); 4 números colados (ícone em círculo da cor primária, rótulo em caixa alta, valor e selo de variação); gráfico de área com o total em cima. Clicar num número troca o gráfico de baixo e grava na URL (`entity=users`).
- **Infraestrutura:** Dashboard com cartões de serviço (nome, descrição, selo de estado, "Refresh" e "Manage"); Queues com 4 blocos de estado em cor suave (Aguardando, Ativo, Falhou, Concluído) e listas agrupadas com contadores por linha.
- **Usuários (a tabela):** busca à esquerda, filtro de data e "Em todo o período"; "Colunas", ação em massa e "Exportar" à direita; cabeçalho ordenável com filtro por coluna; rodapé com "Mostrando 1 - 25 de N resultado(s)", itens por página e paginação com primeira, anterior, páginas, próxima e última. A linha abre um painel lateral com abas.
- **No template:** `HomeStats` (os números), `HomeChart` (Unovis, altura fixa), `HomeDateRangePicker` (atalhos à esquerda, `UCalendar` de intervalo à direita), `HomePeriodSelect` (`USelect` fantasma), `customers.vue` (tabela com busca, "Display" para colunas e `UPagination`).
- **O painel de tarefas pegou:** o número do `HomeStats`, a barra fantasma, o gráfico que ocupa o painel e a tabela do admin na lista lateral. Ficou de fora o calendário de intervalo: precisa do `@internationalized/date`, que este repositório não tem.

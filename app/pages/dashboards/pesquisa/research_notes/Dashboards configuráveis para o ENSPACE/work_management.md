# Dashboards configuráveis em plataformas de gestão de trabalho (ClickUp, monday.com, Notion, Pipefy, Asana, Jira)

Pesquisa feita em 2026-11-11. Aviso de método: os centros de ajuda do ClickUp (help.clickup.com), do monday.com
(support.monday.com) e do Asana (help.asana.com) devolveram HTTP 403 ou página sem corpo à leitura direta. O que
está citado desses 3 vem do trecho da página oficial que a busca devolveu, não da página inteira lida. Notion,
Pipefy e Atlassian foram lidos na página. Onde a página não mostra data, está escrito "sem data visível".

## Como cada produto organiza o dashboard: onde mora, como se cria, que widgets oferece, layout, filtros globais, permissões e IA

### Takeaway
Os 6 produtos seguem o mesmo molde: o dashboard é uma tela de cartões (widgets) numa grade, e cada cartão de gráfico
tem a sua fonte de dados, o seu agrupamento e a sua medida. O que muda é onde o dashboard mora (menu próprio no
ClickUp e no Asana; visão do quadro ou objeto do workspace no monday; visão de banco de dados no Notion; aba do pipe
no Pipefy; aba Reports do espaço e dashboards globais no Jira) e quanto a IA já monta sozinha (Notion Agent, Rovo e
monday vibe montam widget por pedido em linguagem natural; ClickUp tem o cartão AI Brain).

### Cited Findings

**ClickUp**
- Criar o cartão de gráfico de barras: em Dashboards, clicar em "+ Add card" no canto superior direito, escolher
  "Custom" na barra lateral, clicar em "Bar Chart card", configurar e clicar em "Add card". A página oficial tem cerca
  de 1.177 dias (por volta de 2023), então os rótulos podem ter mudado — [ClickUp Help: Bar Chart cards](https://help.clickup.com/hc/en-us/articles/14670260184855-Bar-Chart-cards)
- Os cartões se dividem em "free cards" (bar, battery, line, pie, sprint velocity e cartões de Assignees,
  Priorities, Time Tracking, Tags) e "AI cards"; os AI cards pedem o add-on Everything AI ou créditos de IA, e membro
  limitado não cria AI card — [ClickUp Help: Cards feature availability and limits](https://help.clickup.com/hc/en-us/articles/26985557505303-Cards-feature-availability-and-limits)
- Existe o cartão "AI Brain" no dashboard; a tabela de planos dele é ambígua no trecho lido — [ClickUp Help: Cards feature availability and limits](https://help.clickup.com/hc/en-us/articles/26985557505303-Cards-feature-availability-and-limits)
- Outros cartões com cálculo: "Calculation card" (soma, média e outros sobre tarefas do workspace) e "Portfolio card"
  (soma, média e intervalo de campos Money e Number por pasta ou lista) — [ClickUp Help: Custom cards](https://help.clickup.com/hc/en-us/articles/6312164195095-Custom-cards); [ClickUp Help: Portfolio cards](https://help.clickup.com/hc/en-us/articles/6312200675991-Portfolio-cards)
- Battery chart: agrupado por Status, mostra o total de tarefas (medida) em cada status (agrupamento) — [ClickUp Help: Battery chart card](https://help.clickup.com/hc/en-us/articles/29804674485143-Battery-chart-card)

**monday.com**
- O dashboard junta quadros ("boards") conectados e mostra widgets; o artigo oficial "The Dashboards" é a página de
  referência (lida só pelo trecho da busca) — [monday Support: The Dashboards](https://support.monday.com/hc/en-us/articles/360002187819-The-Dashboards)
- Existe também a configuração do dashboard em artigo próprio ("Configure your Dashboard") — [monday Support: Configure your Dashboard](https://support.monday.com/hc/en-us/articles/26233702292114-Configure-your-Dashboard)
- Widgets documentados além do Chart: "Data Over Time" (eixo X fixo em tempo), "Funnel Chart", "Bubble Chart",
  "Leaderboard", "Time Tracking", além de Battery e Numbers citados no artigo do mondayDB 2.0 — [Data Over Time](https://support.monday.com/hc/en-us/articles/38160284476050-The-Data-Over-Time-Widget); [Funnel Chart](https://support.monday.com/hc/en-us/articles/8805401342482-The-Funnel-Chart); [Bubble Chart](https://support.monday.com/hc/en-us/articles/4404332596498-The-Bubble-Chart); [Leaderboard](https://support.monday.com/hc/en-us/articles/10100407939090-The-Leaderboard-Widget); [Time Tracking](https://support.monday.com/hc/en-us/articles/360013805639-The-Time-Tracking-Widget); [mondayDB 2.0](https://support.monday.com/hc/en-us/articles/20705455822354-mondayDB-2-0)
- O esquema de todos os widgets está exposto na API de desenvolvedor — [monday API: All widgets schema](https://developer.monday.com/api-reference/reference/all-widgets-schema)
- IA: em junho de 2026 o monday lançou widgets customizados feitos com o "monday vibe" (construtor de app por
  linguagem natural, em Beta), colocados direto na visão de dashboard do quadro; servem para tipos que o monday não
  tem nativos (Sankey, hierarquia, tabela dinâmica) e o app vibe conecta até 20 quadros — [monday Community: Everything new in monday vibe, June 2026](https://community.monday.com/ai-in-action/post/everything-new-in-monday-vibe---june-2026-addition-lQ0dSMZ5TYMgqKP)
- O vibe aparece como Beta num guia de agosto de 2026; uma revisão de julho de 2026 diz que o Sidekick saiu do Beta e
  passou a cobrar por crédito desde 2026-07-20 (fonte de terceiro) — [ZoomInfo: monday.com Features, August 2026](https://pipeline.zoominfo.com/sales/monday-com-features); [digitalbydefault.ai review 2026](https://digitalbydefault.ai/blog/monday-ai-project-management-review-2026)
- O nome antigo, "monday magic", montava quadro, dashboard e automação a partir de um pedido (guia de 2025; não achei
  confirmação de 2026) — [max-productive.ai: monday magic review 2025](https://max-productive.ai/blog/monday-magic-review/)

**Notion**
- Gráfico: na página, digitar `/chart` e escolher o tipo; ou, num banco de dados, clicar em `+` ao lado do nome da
  visão e escolher `Chart`. O gráfico não edita itens (sem data visível; rodapé © 2026) — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Tipos de gráfico: barra vertical, barra horizontal, linha, rosca (donut) e número — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Dashboard: no banco de dados, "+ Add a new view" > "Dashboard" (abre em modo Edit); ou `/dash` na página. Cada
  widget mostra 1 visão de banco de dados: tabela, quadro, calendário, gráfico ou linha do tempo. Adicionar widget: `+`
  no modo Edit, escolher uma visão existente ou criar uma nova — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards)
- O dashboard tem modo Edit (adicionar, tirar, arrumar widgets, mudar a visão de cada um) e modo View (abrir páginas,
  usar filtros visíveis) — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards)
- Filtros e ordenações aplicados no modo View ficam locais; para salvar para todos, é preciso permissão de edição e
  "Save for everybody" — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards)
- Filtro global: ícone de filtro do dashboard > "Filter multiple sources"; vale para widgets de fontes diferentes, só
  nos widgets cuja visão tem aquela propriedade; aceita vários filtros globais — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards)
- Filtro global só aceita filtro simples, sem grupos E/OU (blog de terceiro) — [kurashi-notion: Dashboard View guide](https://kurashi-notion.com/en/blogs/notion/dashboard)
- A visão Dashboard chegou por volta de março de 2026 — [AlternativeTo, 2026-03](https://alternativeto.net/news/2026/3/notion-introduces-dashboard-views-to-turn-any-database-into-a-customizable-control-center)
- IA: o Notion Agent gera um primeiro rascunho do dashboard a partir de um pedido e também adiciona widgets e
  reorganiza o layout de um dashboard existente — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards)

**Pipefy**
- O dashboard mora na ferramenta "Dashboards", no cabeçalho de cada pipe. Passos: abrir "Dashboards" > "Create
  dashboard" > "Add chart" > definir "Measure" (dado numérico), "Dimension" (dado qualitativo, como título ou
  responsável) e "Time group" (período) > filtros (só aparecem depois dos 3) > "presentation mode" (tabela, barra,
  pizza e outros) > salvar. Página de 2022-10-13 — [Pipefy Help: How to create dashboards](https://help.pipefy.com/en/articles/6047064-how-to-create-dashboards)
- Exemplos oficiais: custo total por departamento desde sempre; contagem de cards por fase atual nos últimos 30 dias,
  filtrada por "offer accepted"; contagem de cards por responsável, criados na semana passada — [Pipefy Help: How to create dashboards](https://help.pipefy.com/en/articles/6047064-how-to-create-dashboards)
- Ao lado do dashboard existem os "Pipe reports" (relatório tabular com colunas escolhidas e filtros por tipo de
  campo, com fórmula de soma, média, mínimo e máximo) — [Pipefy Help: How to create pipe reports](https://help.pipefy.com/en/articles/619297-how-to-create-pipe-reports)
- O glossário do Pipefy chama o dashboard de ferramenta de BI nativa para montar os próprios gráficos e métricas — [Pipefy Glossary](https://www.pipefy.com/glossary/)

**Asana**
- O "universal reporting" fica em Strategy > Reporting, e um admin pode desligar; o gráfico se configura em "chart
  details": sobre o que o gráfico reporta, eixo X, eixo Y, agrupamento e filtros (guias de terceiros de 2026) — [workmanagementhub: Asana Reporting Dashboards 2026](https://workmanagementhub.com/asana-reporting-dashboards-setup-guide-2026/); [cirface: Asana charts](https://cirface.com/blog/asana-charts)
- O universal reporting saiu em 2021 (post de líder do fórum) — [Asana Forum: Universal Reporting is out](https://forum.asana.com/t/universal-reporting-is-out-here-is-my-first-take-on-it/123742)
- Tipos de gráfico: coluna/barra, linha, burn-up, rosca, lollipop e número segundo um guia; outro lista só barra,
  linha e rosca — [BlinkMetrics: Asana dashboard guide 2026](https://blinkmetrics.com/asana-dashboard-guide/); contradito em parte por [minorco: Asana Dashboards](https://minorco.com/blog/asana-reporting-dashboards/)
- Desde o 3º trimestre de 2025, um projeto pode ter várias abas de Dashboard — [Asana Forum: List of technical and data limitations](https://forum.asana.com/t/list-of-technical-and-data-limitations-in-asana/236641)
- A página oficial "How to set up reporting in Asana" (`universal-reporting`) não devolveu o corpo à leitura — [Asana Help: universal reporting](https://help.asana.com/s/article/universal-reporting)

**Jira**
- Gadgets pré-instalados no dashboard do Jira Cloud: Pie Chart (agrupa itens de um espaço ou filtro por um
  "statistic type", como status, prioridade ou responsável), Work item Statistics (itens de um filtro divididos por um
  campo), Two Dimensional Filter Statistics (tabela de dados do filtro), Work item Calendar, Time Since Work items
  (barras por período sobre um campo de data, inclusive custom), Created vs Resolved, Average Age, Average Time in
  Status, Resolution Time, Road Map, Sprint Health, Sprint Burndown, Bubble Chart (4 dimensões), Filter Results,
  Activity Stream e os gadgets do próprio usuário (Assigned To Me e outros). Gadget extra vem do Marketplace (sem data
  visível; rodapé 2026) — [Atlassian Support: Dashboard gadgets](https://support.atlassian.com/jira-cloud-administration/docs/use-dashboard-gadgets/)
- Na Spring Release 2026, a antiga aba Reports virou um hub dentro de cada espaço, com dashboards customizáveis que
  puxam dados, gráficos e insights do Rovo; o Rovo gera gráfico por linguagem natural e o fixa no espaço — [Atlassian Community: Jira 2026 Spring Release](https://community.atlassian.com/forums/Jira-articles/Introducing-the-Jira-2026-Spring-Release/ba-p/3227380) (página lida só pelo trecho da busca); [Atlassian Community: capacity planning, formula fields & dashboards](https://community.atlassian.com/forums/Jira-articles/Stop-exporting-your-work-to-figure-it-out-Jira-now-does-it-for/ba-p/3280890)
- Campo de fórmula é um tipo novo de campo custom; o Rovo escreve a fórmula a partir da descrição, e o resultado
  aparece em dashboards e no JQL — [Atlassian Community: capacity planning, formula fields & dashboards](https://community.atlassian.com/forums/Jira-articles/Stop-exporting-your-work-to-figure-it-out-Jira-now-does-it-for/ba-p/3280890); [Atlassian blog: planning and budgeting in Jira](https://www.atlassian.com/blog/development/planning-and-budgeting-in-jira)
- Autumn release 2026: dashboard de uso de agentes na aba Reports do espaço, com até 5 relatórios custom por espaço — [Atlassian blog: Jira autumn 2026 release](https://www.atlassian.com/blog/development/jira-autumn-release)
- Apps do Marketplace cobrem o gráfico configurável: Custom Charts for Jira tem o agente Rovo "Custom Charts
  Assistant"; Report Builder ganhou integração com Rovo em setembro de 2026 (gráficos, tabelas dinâmicas por conversa) — [Basedash: Jira reporting tools 2026](https://www.basedash.com/blog/best-jira-reporting-tools-compared-2026); [Atlassian Marketplace: Report Builder](https://marketplace.atlassian.com/apps/1216997/report-builder-custom-reports-charts-dashboards-for-jira?hosting=cloud&amp=&tab=overview)

### Inferences
- Lugar do dashboard: há 2 modelos. No modelo "objeto de topo" (ClickUp, Asana, dashboard multi-quadro do monday, Jira
  global), o dashboard cruza várias fontes. No modelo "visão do banco" (Notion, visão de dashboard do quadro no
  monday, Pipefy por pipe, hub do espaço no Jira), ele nasce dentro de uma fonte e herda a permissão dela. O ENSPACE
  pode oferecer os 2: a visão dentro da categoria (como a listagem e o kanban) e o dashboard de workspace.
- O formulário de 3 passos do Pipefy (Measure, Dimension, Time group, e só depois filtros e formato) é o mais próximo
  do que a demanda do ENSPACE pede: o usuário escolhe medida, agrupamento e período, e o tipo de gráfico vem por último.
- A IA de 2026 deixou de ser "template por prompt" e passou a montar e editar widget dentro do dashboard existente
  (Notion Agent, Rovo, monday vibe). Para o ENSPACE, o BENI montar o widget a partir da mesma configuração manual
  (categoria, campo, agregação) seria o equivalente.

### Gaps
- Dashboards do ClickUp: onde mora na barra lateral hoje (Dashboards Hub, dashboard dentro de Space) e o painel atual
  de configuração do cartão não foram lidos na página (403).
- monday: o texto do artigo do Chart widget (rótulos exatos do painel lateral, prévia ao vivo) não foi lido (403).
- Asana: o artigo oficial de reporting não devolveu corpo; os passos vêm de guias de terceiros.
- Jira: a página da Spring Release 2026 não devolveu corpo na leitura direta; os detalhes vêm do trecho da busca.
- Templates de dashboard de cada produto não foram levantados.

## O que o usuário consegue cruzar: campo × campo, campo × tempo, campo × usuário, entre tipos de item

### Takeaway
Todos cruzam 1 dimensão no eixo X com 1 segunda dimensão de quebra (empilhamento ou agrupamento) e uma medida no eixo
Y; nenhum oferece, no gráfico nativo, mais de 2 dimensões, salvo tabela dinâmica (pivot) por app ou IA. Cruzar
tipos de item num único gráfico só acontece onde a fonte é multi-quadro (monday, ClickUp, Asana, Jira por JQL);
Notion e Pipefy fazem 1 fonte por gráfico e juntam fontes só no nível do dashboard.

### Cited Findings
- ClickUp: "X-Axis Measure" escolhe o campo do eixo X; "X-Axis Group by" mostra os valores do X numa escala de tempo;
  "Y-Axis Group by" empilha segmentos por um segundo campo, que não pode ser o mesmo da medida do Y — [ClickUp Help: Bar Chart cards](https://help.clickup.com/hc/en-us/articles/14670260184855-Bar-Chart-cards)
- ClickUp: exemplo de terceiro com X = tempo, Y = número de tarefas, agrupado por responsável — [ProcessDriven: ClickUp dashboard for work distribution](https://processdriven.co/clickup/advanced-clickup/automatically-update-template-in-new-task/)
- ClickUp: há pedido de usuários para dashboard por "task type" (tipo de tarefa custom), sinal de que o tipo de item
  não é dimensão plena do dashboard — [ClickUp Feedback: Dashboards using task type](https://feedback.clickup.com/feature-requests/p/dashboards-using-task-type)
- monday: no Chart widget, o eixo X é o agrupamento (status, pessoa, data, grupo do quadro) e o eixo Y é o que se mede;
  existe gráfico empilhado — [monday Support: The Chart Widget](https://support.monday.com/hc/en-us/articles/360001262665-The-Chart-Widget); [Solution4Guru: Dynamic charts in monday.com](https://www.solution4guru.com/knowledge-base/%F0%9F%93%8A-how-to-create-dynamic-charts-and-graphs-in-monday-com/)
- monday: o "Data Over Time" fixa o eixo X em tempo e mostra no máximo 31 pontos; intervalos maiores se agregam para
  caber — [monday Support: Data Over Time](https://support.monday.com/hc/en-us/articles/38160284476050-The-Data-Over-Time-Widget)
- monday: o dashboard conecta 1 (Free), 5 (Standard), 20 (Pro) ou 50 (Enterprise) quadros — [monday Support: The Dashboards](https://support.monday.com/hc/en-us/articles/360002187819-The-Dashboards); [monday Developer: Limits](https://developer.monday.com/apps/docs/limits). Um guia de 2026 da Softr diz 10 no Pro, contra a doc oficial — [Softr: monday.com pricing 2026](https://www.softr.io/blog/monday-com-pricing)
- monday: há pedido de gráfico empilhado com conteúdo de subitens — [monday Community: Stacked Bar Chart displaying subitem content](https://community.monday.com/t/stacked-bar-chart-displaying-subitem-content/98048)
- Notion: eixo X "What to show" (propriedade), eixo Y "What to show" (propriedade ou `Count`) e "Group by" no Y (segunda
  propriedade ou `None`); rosca usa "Each slice represents" — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Notion: até 200 grupos e 50 subgrupos por gráfico — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Notion: 1 gráfico não junta 2 bancos de dados; gráficos de bancos diferentes ficam lado a lado na página — [sync2sheets: Notion Charts 2026](https://sync2sheets.com/blog/notion-charts-guide/); [Notion Help: Chart view](https://www.notion.com/help/charts)
- Notion: o dashboard junta widgets de 1 ou vários bancos — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards)
- Pipefy: gráfico = Measure × Dimension × Time group, dentro de 1 pipe; a medida inclui registros de database
  conectados ao pipe — [Pipefy Help: How to create dashboards](https://help.pipefy.com/en/articles/6047064-how-to-create-dashboards); [Pipefy Help: What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)
- Asana: o gráfico escolhe a fonte (tarefas, projetos, portfólios, metas), o eixo X, o eixo Y e o agrupamento; desde
  dezembro de 2025, metas se agrupam por qualquer campo custom da biblioteca de campos da organização — [cirface: Asana goals dashboard](https://cirface.com/blog/asana-goals-dashboard); [cirface: Asana charts](https://cirface.com/blog/asana-charts)
- Asana: num dashboard com portfólio, o filtro só lista campos custom da organização inteira; campo de projeto só
  aparece com 1 projeto (thread antiga, sem confirmação de correção) — [Asana Forum: Filtering global Reporting charts using project custom fields](https://forum.asana.com/t/filtering-global-reporting-charts-using-project-custom-fields/314416)
- Jira: a fonte é sempre um filtro (JQL) ou um espaço, que pode cruzar vários espaços e tipos; Pie Chart e Work item
  Statistics têm 1 dimensão ("statistic type"); Two Dimensional Filter Statistics cruza 2 campos numa tabela; Bubble
  Chart usa 4 dimensões — [Atlassian Support: Dashboard gadgets](https://support.atlassian.com/jira-cloud-administration/docs/use-dashboard-gadgets/)
- Jira: o gadget só lista campo custom cujo "search template" é compatível; campo de texto custom não entra como
  "statistic type" (pedido aberto JRASERVER-66870); o campo Team também não entra — [Atlassian Support KB: Fix missing fields in dashboard gadget dropdowns](https://support.atlassian.com/jira/kb/fix-missing-fields-jira-dashboard-gadget-dropdowns/); [Atlassian Community: Pie chart statistic type as Team](https://community.atlassian.com/forums/Jira-questions/Jira-pie-chart-gadget-configure-statistic-type-as-Team/qaq-p/2644262)
- monday: pelo vibe, dá para pôr tabela dinâmica, Sankey e hierarquia, que o widget nativo não faz — [monday Community: monday vibe, June 2026](https://community.monday.com/ai-in-action/post/everything-new-in-monday-vibe---june-2026-addition-lQ0dSMZ5TYMgqKP)

### Inferences
- O teto de mercado para gráfico nativo é "1 dimensão + 1 quebra + 1 medida". Uma tabela dinâmica nativa (linhas ×
  colunas × medida) diferencia, porque hoje só sai por app (Jira) ou por IA (monday vibe).
- Cruzar tipos de item exige que as categorias compartilhem o campo da dimensão. O Asana e o Notion já mostram o
  problema: campo local de projeto e filtro global só valem onde o campo existe. No ENSPACE, cada workspace cria os
  próprios campos por categoria, então o gráfico multi-categoria precisa casar campos por tipo (status, usuário, data)
  ou ficar em 1 categoria por gráfico.
- Relação a outra categoria como dimensão (agrupar itens pelo item relacionado) não aparece documentada em nenhum
  produto; o Notion bloqueia rollup como eixo.

### Gaps
- Não achei, em nenhum dos 6, documentação de "Others" (agrupar o que passa do Top N) no gráfico nativo; o único
  achado é de um app de terceiro para monday (Appfire) — [Appfire: monday.com Custom Charts](https://appfire.atlassian.net/wiki/spaces/RDD/pages/1069809700/monday.com+Custom+Charts)
- Se o monday aceita campo de conexão (Connect boards) ou espelho (Mirror) como eixo X: não confirmado.
- Granularidade de data (dia, semana, mês, trimestre) de cada produto: só o ClickUp ("X-Axis Group by" em escala de
  tempo) e o monday (31 pontos no Data Over Time) têm algo citável; Notion e Pipefy não detalham nas páginas lidas.

## Quais agregações existem e sobre quais tipos de campo (número, moeda, fórmula, rollup, relação)

### Takeaway
Contagem existe em todos. Soma e média de campo numérico existem em todos; mínimo e máximo estão documentados no
Pipefy e nos cartões de cálculo do ClickUp; mediana aparece no monday (Funnel). Fórmula entra como medida no ClickUp
(se o resultado for número), no Asana (com ressalvas), no Jira (campo de fórmula novo de 2026) e no Notion (se a
fórmula não devolve lista). Rollup e relação são o ponto fraco geral: o Notion não plota rollup e o ClickUp recebe
pedidos para aceitar rollup, fórmula e relação no dashboard.

### Cited Findings
- ClickUp, Bar Chart: medidas do Y incluem idade média das tarefas, Sprint points, Custom Fields e Formula Fields
  (campo custom precisa ser numérico); o Line Chart lista também Tasks e Time Estimate — [ClickUp Help: Bar Chart cards](https://help.clickup.com/hc/en-us/articles/14670260184855-Bar-Chart-cards); [ClickUp Help: Line Chart cards](https://help.clickup.com/hc/en-us/articles/6312238252311-Line-Chart-cards)
- ClickUp, Calculation card: escolhe o campo numérico e a operação soma, média, mínimo, máximo ou contagem (guia de
  terceiro) — [ConsultEvo: ClickUp Calculation Cards](https://consultevo.com/clickup-calculation-cards-guide/); [ClickUp Help: Custom cards](https://help.clickup.com/hc/en-us/articles/6312164195095-Custom-cards)
- ClickUp, Portfolio card: soma, média e intervalo de campos Money e Number — [ClickUp Help: Portfolio cards](https://help.clickup.com/hc/en-us/articles/6312200675991-Portfolio-cards)
- ClickUp: rollup não soma campo custom de subtarefa para a tarefa-mãe; a saída é automação — [IT Visionists: ClickUp Rollups](https://itvisionists.com/clickup-rollups-explained/)
- monday: o Y conta itens ou soma uma coluna numérica; no gráfico empilhado, "Average" só aparece ao comparar mais de 1
  coluna numérica; só coluna e linha aceitam várias colunas no Y — [monday Support: The Chart Widget](https://support.monday.com/hc/en-us/articles/360001262665-The-Chart-Widget)
- monday, Data Over Time: Y = coluna Numbers ou "Count items" — [monday Support: Data Over Time](https://support.monday.com/hc/en-us/articles/38160284476050-The-Data-Over-Time-Widget)
- monday, Funnel Chart: soma, média ou mediana — [monday Support: The Funnel Chart](https://support.monday.com/hc/en-us/articles/8805401342482-The-Funnel-Chart)
- Notion: Y = uma propriedade ou `Count`; `Cumulative` aparece com `Count` ou `Sum` e X em ordem crescente (total
  acumulado no tempo); a página não descreve média, mediana, mínimo nem máximo — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Notion: os eixos não aceitam rollup, botão, ID único, arquivo e mídia nem fórmula que devolve lista; fórmulas
  baseadas em relação e rollup carregam devagar — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Notion: "rollup não se plota e rollup não se agrega de novo"; o contorno é pôr a fórmula no banco com relação
  direta ao número — [DEV: You can't chart a Notion rollup](https://dev.to/benarikutai/you-cant-chart-a-notion-rollup-you-cant-roll-up-a-rollup-either-8cb)
- Pipefy: soma, total acumulado, média, mínimo e máximo de campos numéricos dos cards e dos registros de database
  conectados ao pipe — [Pipefy Help: What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)
- Asana: o Y conta tarefas ou usa um campo numérico; um usuário somou um campo de fórmula por projeto e o gráfico ficou
  vazio até trocar o relatório de projeto para relatório de tarefa — [Asana Forum: dashboard card with calculated custom field](https://forum.asana.com/t/how-to-create-a-dashboard-card-using-a-calculated-custom-field/748227)
- Asana: campo de fórmula, metas no reporting e integração com Power BI e Tableau pedem o plano Advanced — [cirface: Asana charts](https://cirface.com/blog/asana-charts)
- Jira: o campo de fórmula de 2026 aparece em dashboards — [Atlassian Community: capacity planning, formula fields & dashboards](https://community.atlassian.com/forums/Jira-articles/Stop-exporting-your-work-to-figure-it-out-Jira-now-does-it-for/ba-p/3280890)
- Jira: os gadgets nativos de pizza e estatística são contagem de itens por campo; soma de campo numérico não está
  descrita na página de gadgets — [Atlassian Support: Dashboard gadgets](https://support.atlassian.com/jira-cloud-administration/docs/use-dashboard-gadgets/)

### Inferences
- O conjunto "contagem, soma, média, mínimo, máximo" é o padrão; mediana e acumulado diferenciam pouco. Para o
  ENSPACE, ligar a agregação ao tipo de campo (número, moeda, fórmula numérica: as 5; data: mínimo e máximo; texto,
  seleção, usuário: só contagem e contagem distinta) cobre o mercado.
- Fórmula e relação são onde os concorrentes falham. Aceitar fórmula numérica como medida e o item relacionado como
  dimensão desde o começo responde à reclamação mais citada.
- Moeda: nenhum produto documenta conversão de moeda no gráfico; ClickUp trata Money como número.

### Gaps
- Contagem distinta (count distinct) não apareceu documentada em nenhum dos 6.
- Se o monday soma coluna Formula e coluna Mirror no Chart widget: não confirmado nas fontes lidas.
- Agregações nativas do Jira além de contagem (soma de story points em gadgets específicos) não foram levantadas.

## Quantos passos do vazio ao primeiro gráfico e como é o painel de configuração (lateral com prévia, modal ou assistente)

### Takeaway
O primeiro gráfico sai em 5 a 7 gestos em todos: abrir o dashboard, "+ Add card/widget/chart", escolher o tipo,
preencher fonte, eixo e medida, salvar. ClickUp e Pipefy usam formulário de configuração com o gráfico ao lado; o
Notion configura o gráfico como uma visão do banco, com o menu de opções da visão; o Pipefy é o único que impõe ordem
(Measure, Dimension, Time group, depois filtros e formato). Clicar na barra para ver os itens existe no Notion, no
Pipefy e no Data Over Time do monday.

### Cited Findings
- ClickUp: 5 gestos documentados (Dashboards > "+ Add card" > "Custom" > "Bar Chart card" > configurar > "Add card") — [ClickUp Help: Bar Chart cards](https://help.clickup.com/hc/en-us/articles/14670260184855-Bar-Chart-cards)
- Notion: `/chart` na página > tipo > ligar a um banco ou "New chart"; os ajustes ficam em X axis, Y axis e Style
  (cor, altura de Small a Extra large, linhas de grade, nomes dos eixos, rótulos de dado, "Smooth line", "Gradient
  area", "Show value in center", "Color by value", legenda) — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Notion: ordenação de grupos ("Sort by"), mostrar ou esconder grupo pelo ícone de olho ("Visible groups" / "Hidden
  groups") e "Omit zero values" — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Notion, drill-down: clicar num grupo abre uma tabela dos itens; nela não se edita propriedade, não se edita em lote
  nem se adiciona página; "•••" > "Save as view in" guarda o recorte como visão — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Notion: exportar o gráfico em PNG ou SVG ("Save chart as..."); no plano pago, sem a marca "Made with Notion" — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Notion, layout do dashboard: arrastar widgets para mudar de lugar, arrastar a alça entre 2 widgets para mudar a
  largura, arrastar o divisor entre linhas para mudar a altura; até 12 widgets, no máximo 4 por linha — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards)
- Pipefy: 7 passos, com filtros só depois de Measure, Dimension e Time group, e o formato do gráfico por último;
  clicar num elemento do gráfico abre os detalhes do card — [Pipefy Help: How to create dashboards](https://help.pipefy.com/en/articles/6047064-how-to-create-dashboards)
- monday: o Data Over Time permite clicar num ponto para ver o estado dos itens naquele momento, só na visão de quadro;
  aceita várias linhas de referência ("benchmark") com valor, rótulo e cor; o Chart widget tem seção de "benchmark" — [monday Support: Data Over Time](https://support.monday.com/hc/en-us/articles/38160284476050-The-Data-Over-Time-Widget); [monday Support: The Chart Widget](https://support.monday.com/hc/en-us/articles/360001262665-The-Chart-Widget)
- Asana: o gráfico se edita em "chart details" (fonte, X, Y, agrupamento, filtros) — [cirface: Asana charts](https://cirface.com/blog/asana-charts)
- Jira: cada gadget se configura pela escolha de filtro ou espaço e de "statistic type" — [Atlassian Support: Dashboard gadgets](https://support.atlassian.com/jira-cloud-administration/docs/use-dashboard-gadgets/)
- IA como atalho do vazio: Notion Agent gera o rascunho do dashboard; Rovo gera o gráfico por pedido e fixa no espaço — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards); [Atlassian Community: capacity planning, formula fields & dashboards](https://community.atlassian.com/forums/Jira-articles/Stop-exporting-your-work-to-figure-it-out-Jira-now-does-it-for/ba-p/3280890)

### Inferences
- A ordem do Pipefy (medida antes do tipo de gráfico) inverte a do ClickUp (tipo de cartão antes de tudo). Para um
  usuário que não sabe qual gráfico quer, escolher o dado antes e o gráfico depois reduz retrabalho; o ENSPACE pode
  sugerir o tipo pelo que foi escolhido (data no X = linha; seleção = barra ou rosca; só medida = número).
- O drill-down do Notion para em tabela só de leitura. Abrir os itens na listagem real da categoria, com os filtros
  do recorte aplicados, seria melhor que o mercado e combina com a regra do ENSPACE de reaproveitar a listagem.
- Prévia ao vivo enquanto se configura: o padrão é o gráfico redesenhar a cada escolha, mas nenhuma página lida
  confirma isso por escrito.

### Gaps
- Prévia ao vivo no painel de configuração: não confirmada por texto em nenhum dos 6 (as páginas com o painel do
  ClickUp e do monday deram 403).
- Formato do painel do ClickUp e do monday (lateral ou modal): não confirmado.
- Linha de meta no ClickUp e no Notion: não aparece nas páginas lidas (o Notion lista reference lines como não
  coberto).

## Limites, permissões, atualização e reclamações mais comuns

### Takeaway
Os limites duros são número de fontes e de itens no monday (20 mil itens por dashboard, 500 mil com mondayDB 2.0 no
Enterprise), número de usos no ClickUp Free (60) e de cartões (100), de widgets no Notion (12) e de gráficos no Asana
(20 por aba) e no Notion Free (1 gráfico). As reclamações se repetem: fórmula, rollup e relação fora do dashboard
(ClickUp, Notion), gráfico que não junta fontes (Notion), campo custom que some do filtro ou do gadget (Asana, Jira) e
o pedido de mais gráficos por dashboard (Asana).

### Cited Findings
- ClickUp: no máximo 100 cartões por dashboard; o Free Forever tem 60 usos de dashboard — [ClickUp Help: Dashboards feature availability and limits](https://help.clickup.com/hc/en-us/articles/21257864098071-Dashboards-feature-availability-and-limits)
- ClickUp: segundo guia de terceiro, só abrir um dashboard já conta como uso (não confirmado pela ajuda oficial) — [SmashingApps: ClickUp Free Plan 2026](https://www.smashingapps.com/clickup-free-plan/); [max-productive.ai: ClickUp Free Plan 2026](https://max-productive.ai/blog/clickup-free-plan/)
- monday: até 30 widgets por dashboard (o widget de texto não conta) e até 20 mil itens, subitens e itens ligados
  somados entre os quadros conectados — [monday Support: The Dashboards](https://support.monday.com/hc/en-us/articles/360002187819-The-Dashboards)
- monday: com mondayDB 2.0 (Enterprise), Chart, Battery e Numbers vão até 500 mil itens por dashboard; Gantt,
  Timeline, Workload e Table continuam em 20 mil — [monday Support: mondayDB 2.0](https://support.monday.com/hc/en-us/articles/20705455822354-mondayDB-2-0)
- monday: 1, 5, 20 e 50 quadros por dashboard nos planos Free, Standard, Pro e Enterprise — [monday Developer: Limits](https://developer.monday.com/apps/docs/limits)
- Notion: o plano Free tem 1 gráfico; apagar o gráfico não devolve o crédito sem criar ou duplicar outro; template com
  vários gráficos mostra só 1 no Free — [Notion Help: Chart view](https://www.notion.com/help/charts)
- Notion: a visão Dashboard é dos planos Business e Enterprise; até 12 widgets, 4 por linha — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards)
- Notion, permissão: o dashboard segue a permissão do banco; quem só vê abre em modo View e não muda o layout; quem
  edita o banco cria dashboard e configura widget — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards)
- Notion, desempenho: a própria ajuda recomenda filtrar cada widget, evitar tabela grande sem filtro e não pôr 2
  dashboards na mesma página; bancos grandes atualizam o gráfico mais devagar — [Notion Help: Dashboard view](https://www.notion.com/help/dashboards); [Notion Help: Chart view](https://www.notion.com/help/charts)
- Pipefy: admins e membros do pipe acessam o dashboard; o admin muda papéis e permissões; o plano Basic tem dashboard
  em conta grátis e paga (página de 2022) — [Pipefy Help: How to create dashboards](https://help.pipefy.com/en/articles/6047064-how-to-create-dashboards)
- Asana: 20 gráficos por aba de dashboard; a saída é criar mais abas (desde o 3º trimestre de 2025) — [Asana Forum: Increase the maximum number of charts per dashboard](https://forum.asana.com/t/increase-the-maximum-number-of-charts-allowed-per-dashboard/153052); [Asana Forum: List of technical and data limitations](https://forum.asana.com/t/list-of-technical-and-data-limitations-in-asana/236641)
- Asana: planos em conflito entre guias. Um diz que gráfico de tarefas vale do Starter para cima e gráfico de projeto,
  portfólio e meta pede Advanced; outro diz que o universal reporting está em todo plano pago desde o Starter — [workmanagementhub 2026](https://workmanagementhub.com/asana-reporting-dashboards-setup-guide-2026/); [cirface: Asana charts](https://cirface.com/blog/asana-charts)
- Jira: gadgets "user-scoped" mostram conteúdo do próprio leitor (Assigned To Me, Watched, Voted) — [Atlassian Support: Dashboard gadgets](https://support.atlassian.com/jira-cloud-administration/docs/use-dashboard-gadgets/)
- Jira: rolagem do gadget quebra quando o Jira tem muitos campos custom (JRASERVER-74731) — [Atlassian Support KB: Fix missing fields in dashboard gadget dropdowns](https://support.atlassian.com/jira/kb/fix-missing-fields-jira-dashboard-gadget-dropdowns/)
- Reclamação ClickUp: o dashboard não aceita campos rollup, fórmula e relação, o que impede relatório de rentabilidade
  de projeto; fórmula não agrega a lista, então percentual do total pede soma fixa que fica velha; equipes levam o dado
  para Google Sheets ou Looker Studio — [ClickUp Feedback: Enable Rollup, Formula, and Relationship Fields in Dashboards](https://feedback.clickup.com/feature-requests/p/enable-rollup-formula-and-relationship-fields-in-dashboards-for-full-reporting-c); [ClickUp Feedback: Formula fields in Dashboard](https://feedback.clickup.com/feature-requests/p/formula-fields-in-dashboard)
- Reclamação Notion: rollup não se plota, 1 gráfico por fonte, 1 gráfico no Free; surgiram apps externos de dashboard
  para Notion por causa disso — [DEV: Three ways to get a Notion dashboard in 2026](https://dev.to/benarikutai/three-ways-to-get-a-notion-dashboard-in-2026-20g7); [sync2sheets: Notion Charts 2026](https://sync2sheets.com/blog/notion-charts-guide/)
- Reclamação Pipefy: pedido antigo de filtro em campos de conexão de pipe e database; filtro "Current Phase" esconde
  cards que já mudaram de fase na métrica de tempo por fase — [Pipefy Community: Add Filter to Pipe & Database Connection Fields](https://community.pipefy.com/ideas/add-filter-to-pipe-database-connection-fields-1736); [Pipefy Community: Dashboard Query](https://community.pipefy.com/ask-the-community-43/dashboard-query-4450)
- Reclamação Jira: o relatório nativo é limitado e o mercado de apps (Custom Charts, Report Builder) preenche o gráfico
  configurável — [Basedash: Jira reporting tools 2026](https://www.basedash.com/blog/best-jira-reporting-tools-compared-2026)

### Inferences
- Permissão: no Notion, o dashboard herda a permissão do banco, e o filtro no modo View fica local. Para o ENSPACE, o
  gráfico calculado com a permissão de quem vê (cada pessoa vê o total dos itens que pode ver) segue o padrão do
  Notion e do Jira; o custo é que 2 pessoas veem números diferentes no mesmo dashboard, e isso precisa de aviso na tela.
- Limite por plano é alavanca comercial em todos (1 gráfico no Notion Free, 60 usos no ClickUp Free, quadros por
  dashboard no monday). O ENSPACE pode limitar por número de widgets ou de itens computados, como o monday.
- O teto de 20 mil itens do monday e os avisos de lentidão do Notion indicam que o cálculo no servidor, com limite
  declarado, é o ponto técnico que os concorrentes ainda não resolveram para tudo.

### Gaps
- Atualização em tempo real ou intervalo de atualização: nenhuma página lida dá o número (ClickUp, monday, Asana e
  Jira ficaram sem fonte; o Jira tem o "refresh" do dashboard, mas a página de gadgets não o descreve).
- Se o leitor do ClickUp, do monday e do Asana vê só os itens que pode acessar no dashboard compartilhado: não
  confirmado nas fontes lidas.
- Reclamações no Reddit e no G2: a busca não devolveu threads do Reddit nem avaliações do G2 com foco em dashboard; as
  reclamações acima vêm de fóruns oficiais de ideias e de blogs.
- Número máximo de dashboards por plano (ClickUp, monday, Asana): não levantado.

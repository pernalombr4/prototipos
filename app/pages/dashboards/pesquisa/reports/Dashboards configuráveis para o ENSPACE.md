# Dashboards configuráveis: o ENSPACE sai do modal e agrega no servidor

Pesquisa fechada em 2026-11-11. Convenção do texto:
- fato citado leva o link da fonte logo depois;
- fato do ENSPACE vem da nota `enspace_hoje.md` (tela do develop, en-docs e código lidos em 2026-11-11) e cita o print de `app/pages/dashboards/evidencias/` quando há;
- *Inferência:* marca a conclusão desta pesquisa que nenhuma fonte afirma.

## 1. Resumo

O mercado inteiro monta o dashboard configurável com a mesma peça: cada cartão tem 1 fonte, 1 dimensão, no máximo 1 quebra (empilhada ou lado a lado) e 1 medida, numa grade de 12 colunas, e o gráfico se edita ao lado de uma prévia. O ENSPACE já tem a parte conceitual (categoria, campo de agrupamento, filtro E/OU, 6 funções e período), mas a entrega fica abaixo do mercado em 4 pontos: o painel exige 4 níveis de janela para configurar, desenha 1 série só, não tem filtro do dashboard nem clique até os itens, e calcula tudo no navegador depois de baixar todos os itens do período, painel por painel. A mudança de maior efeito é a agregação ir para o back-end: ela destrava o empilhado, a contagem correta de múltipla seleção e relação, o filtro do dashboard e o drill-down, e reduz o volume que chega ao navegador. O ponto de partida é bom: o próprio SDK do ENSPACE já traz 14 componentes de gráfico prontos, que a tela de Painéis não usa.

**Recomendações principais**
1. **Agregação no back-end**, numa rota que recebe a configuração do cartão e devolve os grupos já calculados com a permissão de quem vê.
2. **Dashboard como entrada nativa do menu**, sem a volta por Telas e Menus, e o gráfico também como visualização dentro da listagem da categoria.
3. **Construtor em painel lateral com prévia ao vivo**, lido como frase ("Soma de Valor por Status, por mês"), no lugar do modal de 2 abas, 3 sub-abas e modal sobre modal.
4. **Escolhe-se o dado antes do gráfico**: o produto sugere o tipo pelo campo escolhido e aplica padrões por tipo de campo (contagem de itens, data por mês, barra ordenada).
5. **Regras explícitas por tipo de campo**: múltipla seleção conta o item em cada opção, relação agrupa pelo nome do item relacionado, usuário aceita "eu" como filtro, e fórmula ou campo virtual numérico entra como medida.
6. **Filtro de período do dashboard inteiro e clique até os itens**, abrindo a listagem real da categoria com o recorte aplicado.
7. **Base primeiro, o resto depois**: comparação com o período anterior, linha de meta, filtro cruzado no clique, tabela dinâmica, dashboard sugerido e o BENI montando cartão ficam para a 2ª onda.

**Biblioteca de gráfico:** trocar o ApexCharts pelos componentes `EnChart*` do `enspace-sdk-ui` 0.18.0, que rodam sobre Unovis, depois de uma prova curta que confirme os tipos da Base (barra empilhada, funil, número com meta) e a acessibilidade. O ECharts fica como motor de reserva dentro do SDK para o tipo que a prova mostrar faltando, nunca direto na tela. A licença do ApexCharts ^5.16 vai ao jurídico, porque a nota de bibliotecas registra licença dual desde a v5. A grade continua no gridstack, atualizado da ^12.6 para a 14.

## 2. O ENSPACE hoje: 1 gráfico por painel, calculado no navegador

**Onde mora.** O dashboard é uma tela do tipo "Painéis" criada em Configurações > Interface > Telas; ela só aparece aos membros depois de entrar num menu (en-docs `pt/1.docs/4.Settings/06.Interface/3.Screens.md`, seção "Dashboard (Painéis)"). A jornada passa por Telas e por Menus antes do "Novo Painel", e a trilha mostra o slug da tela ("Páginas > aud_paineis"), não o nome. Print `01-tela-de-painel-hoje.jpg`.

**A tela.** O cabeçalho tem 4 botões azuis do tema antigo: "Novo Painel", "Editar Dashboard", "Organizar painéis automaticamente" e "Forçar carregamento". A pesquisa de UX do ENSPACE já registrou 3 nomes para a mesma coisa na mesma linha (achado U9) e o cache exposto como ação. "Editar Dashboard" não edita o layout: abre Nome, Descrição obrigatória, grupos de visualização e recarga em minutos, com padrão 5 (print `18-editar-dashboard.jpg`). A grade gridstack de 12 colunas deixa arrastar e redimensionar sempre ligados, sem modo de edição. O ícone "<>" mostra ao usuário o JSON de opções do ApexCharts (print `17-codigo-do-grafico.jpg`).

**O formulário do painel.** O painel se configura num modal "Dados do painel" | "Formatação" com 3 sub-abas, e o campo de agrupamento se escolhe num modal sobre o modal (print `05-modal-sobre-modal.jpg`). Os pontos que pesam na recomendação:
- **Título e ícone obrigatórios**, com lista plana de ícones em inglês (print `12-icone-obrigatorio.jpg`).
- **6 tipos:** Barras, Linhas, Pizza, Donut, Área e Funil (print `03-tipos-de-grafico.jpg`), com rótulos sem tradução ("curve") e erro de digitação ("Motrar porcentagem").
- **Campos técnicos misturados aos do usuário:** "ID", "reference", "Display" e um nó "data" que esconde os campos criados pela pessoa; o campo escolhido aparece como "data > Quantidade" (prints `06-campos-tecnicos-na-lista.jpg` e `07-campo-com-caminho-tecnico.jpg`).
- **6 funções:** Contagem, Soma, Média, Mediana, Variância e Contagem Distinta, sem mínimo nem máximo (print `08-funcoes.jpg`).
- **Campo do eixo Y no fim do formulário**, só quando a função não é Contagem (print `09-soma-pede-campo-do-eixo-y.jpg`); a lista aceita "ID" e recusa o campo virtual "Total virtual" (print `13-eixo-y-tipo-invalido.jpg`).
- **Granularidade de data de segundos a anos, sem trimestre**, e só quando o 1º agrupamento é data.
- **Período padrão: últimos 2 meses** (print `10-periodo-e-acesso.jpg`).
- **Sem prévia:** o gráfico só aparece depois de salvar.

**Estado vazio.** O painel de teste salvou e mostrou "não há dados neste painel" com o botão "Experimente aumentar o intervalo de consulta de dados" (print `14-painel-sem-dados.jpg`). O botão abre a sub-aba de gráfico, não a de período (print `15-aumentar-intervalo-abre-outra-aba.jpg`).

**Interação.** Não há filtro do dashboard inteiro nem drill-down. O filtro local do painel fica só na memória e substitui o filtro salvo em vez de somar a ele (print `16-filtro-local.jpg`). Quem não é full ou owner não vê nenhuma ação do painel.

**O motor.** O front usa naive-ui, FormKit, `apexcharts` ^5.16 e `gridstack` ^12.6 (`DashboardScreen.vue` e `DashboardPanel.vue`, em `src/components/screens/dashboard/` e `src/components/charts/`). Cada painel pede todos os itens da categoria no período, sem limite, em paralelo, sem reaproveitar a resposta de outro painel da mesma categoria, e agrupa no navegador com `@tidyjs/tidy`. O back guarda a configuração em JSON e não tem rota de agregação. As consequências lidas no código:
- **1 série só:** o 2º campo de agrupamento vira mais barras no eixo e aparece só no tooltip;
- **múltipla seleção:** cada combinação vira 1 grupo ("A | B");
- **relação:** só o 1º valor conta;
- **valor que não é número vira 0**, e toda função vale para todo campo;
- **limite de 49 ou 99 grupos**, conferido só ao salvar;
- **tooltip sem formatação de número.**

**O que já existe pronto.** O `enspace-sdk-ui` 0.18.0 traz 14 componentes de gráfico sobre Unovis (`@unovis/vue` ^1.7): `EnChart`, `EnChartArea`, `EnChartBar`, `EnChartBarList`, `EnChartBreakdown`, `EnChartDonut`, `EnChartEmpty`, `EnChartGroupedBar`, `EnChartHeatmap`, `EnChartLegend`, `EnChartLine`, `EnChartMeter`, `EnChartRing`, `EnChartSparkline` e `EnChartStages`. A tela de Painéis não usa nenhum. Os protótipos aprovados `painel-de-tarefas` e `configuracoes-do-sistema` já usam Unovis.

## 3. Como o mercado faz: 3 famílias, a mesma peça

### Gestão de trabalho: o dashboard mora no menu ou dentro da fonte

Os 6 produtos lidos (ClickUp, monday.com, Notion, Pipefy, Asana e Jira) usam uma grade de cartões em que cada gráfico tem fonte, agrupamento e medida próprios. O que muda é o endereço. **ClickUp e Asana têm menu próprio de dashboard; Notion, Pipefy e Jira põem o dashboard dentro da fonte**, como visão do banco, aba do pipe ou hub do espaço ([Notion, Dashboard view](https://www.notion.com/help/dashboards); [Pipefy, How to create dashboards](https://help.pipefy.com/en/articles/6047064-how-to-create-dashboards); [Atlassian Community, Jira 2026 Spring Release](https://community.atlassian.com/forums/Jira-articles/Introducing-the-Jira-2026-Spring-Release/ba-p/3227380)). O monday faz os 2: dashboard que junta 1, 5, 20 ou 50 quadros conforme o plano, e visão de dashboard dentro do quadro ([monday Developer, Limits](https://developer.monday.com/apps/docs/limits)).

O cruzamento para em **1 dimensão, 1 quebra e 1 medida**. No ClickUp, "X-Axis Measure" escolhe o campo do eixo X e "Y-Axis Group by" empilha por um 2º campo ([ClickUp, Bar Chart cards](https://help.clickup.com/hc/en-us/articles/14670260184855-Bar-Chart-cards)). O Notion tem "Group by" no eixo Y, com até 200 grupos e 50 subgrupos, e 1 gráfico não junta 2 bancos ([Notion, Chart view](https://www.notion.com/help/charts)). O Pipefy impõe a ordem Measure, Dimension, Time group, e só depois filtros e formato ([Pipefy, How to create dashboards](https://help.pipefy.com/en/articles/6047064-how-to-create-dashboards)). O Jira cruza 2 campos só numa tabela ("Two Dimensional Filter Statistics"), e o campo de texto custom não entra como dimensão ([Atlassian, Dashboard gadgets](https://support.atlassian.com/jira-cloud-administration/docs/use-dashboard-gadgets/); [Atlassian KB, missing fields](https://support.atlassian.com/jira/kb/fix-missing-fields-jira-dashboard-gadget-dropdowns/)).

As agregações são contagem, soma e média em todos. O Pipefy soma também acumulado, mínimo e máximo ([Pipefy, What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)), e o "Calculation card" do ClickUp faz soma, média, mínimo, máximo e contagem ([ClickUp, Custom cards](https://help.clickup.com/hc/en-us/articles/6312164195095-Custom-cards)). **Fórmula e rollup são a reclamação mais repetida:** o ClickUp recebe pedidos para aceitar rollup, fórmula e relação no dashboard, e as equipes levam o dado para planilha ([ClickUp Feedback](https://feedback.clickup.com/feature-requests/p/enable-rollup-formula-and-relationship-fields-in-dashboards-for-full-reporting-c)); o Notion não plota rollup ([Notion, Chart view](https://www.notion.com/help/charts)). O Jira criou em 2026 o campo de fórmula que aparece em dashboards ([Atlassian Community, formula fields](https://community.atlassian.com/forums/Jira-articles/Stop-exporting-your-work-to-figure-it-out-Jira-now-does-it-for/ba-p/3280890)).

O filtro do dashboard inteiro aparece documentado só no Notion: "Filter multiple sources" vale para widgets de fontes diferentes, só onde a propriedade existe ([Notion, Dashboard view](https://www.notion.com/help/dashboards)), e aceita só filtro simples, sem grupos E/OU, segundo um blog ([kurashi-notion](https://kurashi-notion.com/en/blogs/notion/dashboard)). O clique até os itens existe no Notion (tabela só de leitura, com "Save as view in"), no Pipefy (abre o card) e no "Data Over Time" do monday ([Notion, Chart view](https://www.notion.com/help/charts); [monday, Data Over Time](https://support.monday.com/hc/en-us/articles/38160284476050-The-Data-Over-Time-Widget)). Na permissão, o dashboard do Notion herda a do banco, e o filtro aplicado no modo View fica local ([Notion, Dashboard view](https://www.notion.com/help/dashboards)).

A IA de 2026 monta e edita cartões dentro do dashboard: o Notion Agent gera o rascunho e reorganiza o layout ([Notion, Dashboard view](https://www.notion.com/help/dashboards)), o Rovo gera gráfico por pedido e o fixa no espaço ([Atlassian Community, formula fields](https://community.atlassian.com/forums/Jira-articles/Stop-exporting-your-work-to-figure-it-out-Jira-now-does-it-for/ba-p/3280890)), e o monday vibe cria widgets de tipos que o monday não tem, como Sankey e tabela dinâmica ([monday Community, vibe June 2026](https://community.monday.com/ai-in-action/post/everything-new-in-monday-vibe---june-2026-addition-lQ0dSMZ5TYMgqKP)).

### CRM e bancos no-code: 1 objeto por gráfico, relação como dimensão

Os produtos de esquema livre são os mais parecidos com o ENSPACE, porque o cliente cria os próprios objetos e campos. **Twenty, Attio, Airtable, Baserow, NocoDB e SmartSuite montam cada gráfico sobre 1 objeto ou tabela.** No Twenty, todo filtro e toda medida precisam ser do objeto do widget, e a relação entra como dimensão de 2 formas: pelo registro relacionado (rotulado pelo nome) ou por um atributo dele, a 1 salto, só na direção muitos-para-um ([Twenty, widget.schema.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts); [Twenty, isFieldSupportedAsChartGroupBySubField.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/side-panel/pages/page-layout/utils/isFieldSupportedAsChartGroupBySubField.ts)). O cruzamento real entre objetos só existe nos CRMs grandes: o HubSpot junta até 5 fontes pelas associações, e o Salesforce junta até 4 objetos em cadeia num tipo de relatório que o admin define antes ([HubSpot, Feature Spotlight](https://www.hubspot.com/solutions-partner-resource-center/custom-report-builder); [Salesforce, ReportType](https://developer.salesforce.com/docs/atlas.en-us.234.0.api_meta.meta/api_meta/meta_reporttype.htm)).

O Twenty tem a tabela de agregação por tipo de campo mais completa entre os lidos: **12 operações**, com soma em número e moeda; média, mínimo e máximo também em avaliação; primeiro e último em data; contagem de verdadeiro e falso em booleano; contagem, vazios e percentual preenchido em todo tipo; e só contagem em relação ([Twenty, AggregateOperations.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-shared/src/types/AggregateOperations.ts); [Twenty, getAvailableAggregateOperationsForFieldMetadataType.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/object-record/record-table/record-table-footer/utils/getAvailableAggregateOperationsForFieldMetadataType.ts)). A granularidade de data vai de dia a ano e inclui dia da semana, mês do ano e trimestre do ano ([Twenty, widget.schema.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts)). O Attio fica no conjunto contagem, soma, média, mínimo e máximo, com data por dia, semana ou mês e 2 agrupamentos ("Grouped by" e "Segmented by") ([Attio, Insight report](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/set-up-an-insight-report.md)).

A múltipla seleção tem regra explícita em 3 produtos. Twenty e Airtable oferecem o interruptor "Split multiple values" ([Twenty, LineChartSettings.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/side-panel/pages/page-layout/constants/LineChartSettings.ts); [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard)). O SmartSuite conta cada valor e avisa que "a total can be higher than the record count" ([SmartSuite, lookup fields in charts](https://help.smartsuite.com/en/articles/12143653-using-lookup-fields-in-charts)).

**A configuração mora num painel lateral ou ao lado da prévia em quase todos.** O Twenty separa o painel em Data, X axis, Y axis e Style ([Twenty, LineChartSettings.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/side-panel/pages/page-layout/constants/LineChartSettings.ts)). O HubSpot arrasta propriedades para "X-axis", "Y-axis" e "Break down by", redesenha a cada mudança com "Refresh as I make changes" e sugere o tipo com "Smart chart" ([HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder)). No SmartSuite, trocar o tipo de gráfico apaga os valores e a prévia ([SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget)).

O filtro do dashboard inteiro é o buraco mais citado da família. O Twenty diz "Dashboard-level filters are not available yet" ([Twenty, FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq)). O filtro do Airtable só alcança elementos da mesma tabela ([Airtable, Filter element](https://support.airtable.com/docs/interface-element-filter)). O do HubSpot só alcança relatórios da mesma fonte ([HubSpot KB, Customize your dashboards](https://knowledge.hubspot.com/dashboard/customize-your-dashboards)). O Salesforce aceita 3 filtros por dashboard no cheatsheet de 2017; um blog diz que o Spring '24 subiu para 5 ([Salesforce, Dashboard filters cheatsheet](https://resources.docs.salesforce.com/206/latest/en-us/sfdc/pdf/salesforce_dashboard_filters_cheatsheet.pdf); [asagarwal.com](https://www.asagarwal.com/?p=28734)). O SmartSuite é a exceção, com um "Filter widget" que filtra os widgets ligados ([SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget)).

O drill-down existe em quase todos, com destinos diferentes:
- **Twenty:** leva à listagem filtrada pelo balde clicado, exceto quando o agrupamento é relação ([Twenty, buildChartDrilldownQueryParams.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/page-layout/widgets/graph/utils/buildChartDrilldownQueryParams.ts); [Twenty, isFilteredViewRedirectionSupported.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/page-layout/widgets/graph/utils/isFilteredViewRedirectionSupported.ts)).
- **Airtable:** abre uma folha lateral ([Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard)).
- **SmartSuite:** abre uma grade editável ([SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget)).
- **Attio:** "View contributing data" lista os registros ([Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md)).

Na permissão, há 2 modelos. No 1º, quem vê o dashboard vê os dados pela própria permissão: SmartSuite mostra só os registros que a pessoa pode abrir, e o Baserow exige acesso às tabelas ([SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget); [Baserow, Dashboards overview](https://baserow.io/user-docs/dashboards-overview)). No 2º, o Salesforce roda o dashboard como um "running user" fixo e limita o modo "Run as logged-in user" a 5 dashboards no Enterprise ([Salesforce, Dynamic dashboards cheatsheet](https://resources.docs.salesforce.com/210/latest/en-us/sfdc/pdf/salesforce_dynamic_dashboards_cheatsheet.pdf)). O Twenty avisa que os números seguem o fuso de quem vê, então 2 pessoas veem números diferentes ([Twenty, FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq)).

Os limites de exibição são declarados: o Twenty desenha até 100 barras e 50 grupos por barra e mostra "Undisplayed data: max X bars per chart" ([Twenty, Widgets](https://docs.twenty.com/user-guide/dashboards/capabilities/widgets)). O HubSpot não carrega relatório com mais de 100 valores em "Break down by" ([HubSpot KB, Customize your dashboards](https://knowledge.hubspot.com/dashboard/customize-your-dashboards)). Na IA, o Twenty liga ferramentas de dashboard ao chat desde a v1.14.0 ([GitHub, twenty v1.14.0](https://github.com/twentyhq/twenty/releases/tag/v1.14.0)), e o HubSpot gera relatório de 1 objeto a partir de uma frase ([HubSpot KB, Create reports using AI](https://knowledge.hubspot.com/reports/create-reports-using-ai)).

### BI self-service: a frase, o filtro ligado e o clique que filtra

O Metabase expõe o modelo como frase: "Summarize" escolhe a métrica ("Count of rows", "Sum of …", "Number of distinct values of…", mínimo, máximo, acumulado, desvio-padrão) e agrupa por 1 ou mais colunas; em data, o texto "by month" troca a unidade, e a mesma data entra em 2 granularidades ([Metabase, Summarizing and grouping](https://www.metabase.com/docs/latest/questions/query-builder/summarizing-and-grouping)). Power BI, Looker Studio e Superset expõem o mesmo par como poços ou painéis: eixo, legenda e valores; dimensão primária e "breakdown dimensions" ([Looker Studio, Bar chart reference](https://support.google.com/looker-studio/answer/7165560); [Superset, Exploring data](https://superset.apache.org/user-docs/using-superset/exploring-data)).

**Nenhuma fonte compara frase e poço com usuário de negócio.** A evidência mais próxima são os estudos Voyager: a recomendação automática amplia a exploração inicial, e a especificação manual empata ou vence em pergunta dirigida ([Tableau Research, Voyager](https://tableau.com/research/publications/voyager-exploratory-analysis-faceted-browsing-visualization-recommendations); [Voyager 2](https://faculty.washington.edu/billhowe/publications/pdfs/wongsuphasawat17voyager2.pdf)). O Metabase escolhe o gráfico pela coluna de agrupamento e mostra primeiro os tipos que cabem no resultado, com o resto em "More charts" ([Metabase, Visualizing results](https://www.metabase.com/docs/latest/questions/visualizations/visualizing-results)). O Tableau sugere linha quando há data e medida ([Tableau, Show Me](https://help.tableau.com/current/pro/desktop/en-us/buildauto_showme.htm)).

O BI resolve o que a gestão de trabalho e os CRMs deixam aberto: o filtro do dashboard. No Metabase, cada filtro se liga a 1 campo por cartão, e o produto oferece ligar sozinho os cartões com o mesmo campo, inclusive os adicionados depois ([Metabase, Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters)). O clique no gráfico abre um menu de drill-through ou atualiza um filtro do dashboard ("Update a dashboard filter") ([Metabase, Interactive dashboards](https://www.metabase.com/docs/latest/dashboards/interactive)). No Power BI, os visuais fazem filtro cruzado entre si por padrão, e o editor troca o comportamento por par de visuais em "Edit interactions" ([Power BI, visual interactions](https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions)). Para o estado vazio, o Metabase gera o dashboard sozinho pelos tipos de campo (X-rays) e deixa salvar ([Metabase, X-rays](https://www.metabase.com/docs/latest/exploration-and-organization/x-rays)); o Metabot cria gráfico por pergunta em texto, usando o próprio construtor ([Metabase, Metabot](https://www.metabase.com/docs/latest/ai/metabot)).

### Quadro comparativo

Legenda: "n/c" = não confirmado nas fontes lidas. Cada célula resume um fato citado nas subseções acima.

| Produto | Fonte e cruzamento | Agrupamento duplo | Agregações | Granularidade de data | Filtro do dashboard | Drill-down | Prévia ao vivo | Quem vê o quê | IA |
|---|---|---|---|---|---|---|---|---|---|
| **ENSPACE hoje** | 1 categoria | não; o 2º campo vira mais barras | contagem, soma, média, mediana, variância, contagem distinta | segundo a ano, sem trimestre | não | não | não | itens que a pessoa lê; dashboard e painel por grupo | não |
| ClickUp | n/c | sim, empilhado | contagem, soma, média, mín., máx.; fórmula numérica | escala de tempo no X | n/c | n/c | n/c | n/c | AI cards (add-on) |
| monday | até 1, 5, 20 ou 50 quadros | sim, empilhado | contagem, soma; média e mediana em casos | "Data Over Time", até 31 pontos | n/c | clique no ponto | n/c | n/c | widgets pelo vibe (Beta) |
| Notion | 1 banco por gráfico | sim, "Group by" no Y | contagem, propriedade, acumulado; sem rollup | n/c | sim, sem E/OU | tabela só de leitura | n/c | herda do banco | monta e edita |
| Pipefy | 1 pipe e databases ligadas | não | soma, acumulado, média, mín., máx. | "Time group" | n/c | abre o card | n/c | membros do pipe | n/c |
| Asana | tarefas, projetos, portfólios, metas | sim | contagem, campo numérico | n/c | n/c | n/c | n/c | n/c | n/c |
| Jira | filtro JQL, vários espaços | só em tabela | contagem; fórmula (2026) | por período | n/c | n/c | n/c | gadgets do próprio leitor | Rovo gera gráfico |
| Twenty | 1 objeto; relação a 1 salto | empilhado ou lado a lado | 12 operações por tipo | dia a ano, dia da semana, mês do ano | não | listagem filtrada | painel lateral; prévia n/c | todo o workspace; papel vale | ferramentas no chat |
| Attio | 1 objeto, lista ou atividade | sim, 2 atributos | contagem, soma, média, mín., máx. | dia, semana, mês | sem seletor de período | registros do ponto | n/c | por nível de acesso | não listada |
| Airtable | 1 tabela por grupo | sim, até 100% | contagem, soma, média, mín., máx. | semana, mês, trimestre | só a mesma tabela | folha lateral | n/c | filtro "current user" | gera elemento |
| HubSpot | até 5 fontes | "Break down by" | até 12 medidas | n/c | só a mesma fonte | dados sem resumo | sim | por dashboard | 1 objeto por frase |
| Salesforce | até 4 objetos em cadeia | n/c | fórmula por linha, bucket | n/c | 3 ou 5 filtros | n/c | n/c | "running user" | não achada |
| SmartSuite | 1 tabela; lookup no grupo | 2ª série | contagem, soma, média, mín., máx. | n/c | "Filter widget" | grade editável | sim | só o que abre | n/c |
| Metabase | tabela ou modelo | várias colunas | contagem, soma, média, distintos, acumulado, desvio, mín., máx. | hora a ano | sim, ligado por cartão | menu e filtro cruzado | escolhe o gráfico | n/c | Metabot, X-rays |
| Power BI | modelo | eixo e legenda | cálculos visuais | n/c | 3 níveis | filtro cruzado padrão | n/c | n/c | "Smart narrative" |

## 4. O padrão que todos seguem

1. **Cartão sobre 1 fonte.** O gráfico lê 1 objeto, banco ou categoria; o dashboard junta cartões de fontes diferentes. Só HubSpot, Salesforce e os dashboards multi-quadro cruzam fontes num gráfico, sempre com regra de ligação definida antes.
2. **1 dimensão, 1 quebra, 1 medida.** Mais que isso vira tabela (Jira, Airtable, HubSpot) ou sai por IA (monday vibe).
3. **Contagem como padrão.** A medida "Count" não pede campo e é o padrão no Airtable e no HubSpot ([Airtable, Chart extension](https://support.airtable.com/docs/chart-extension.md); [HubSpot KB](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder)); soma, média, mínimo e máximo valem só para número e moeda.
4. **Grade de 12 colunas com arrastar e redimensionar.** Twenty, Notion e Attio documentam o arranjo ([Twenty, widget.schema.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts); [Attio, Dashboards](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/dashboards.md)), e o Notion separa o modo Edit do modo View ([Notion, Dashboard view](https://www.notion.com/help/dashboards)).
5. **Configuração ao lado do gráfico**, em painel lateral ou formulário com prévia (Twenty, HubSpot, SmartSuite, NocoDB). Nenhum produto lido usa modal sobre modal; o Pipefy é o único que impõe uma ordem de preenchimento.
6. **Teto de grupos declarado na tela**: 100 barras no Twenty, 100 valores no HubSpot, "Include others" no NocoDB ([NocoDB, Bar chart](https://nocodb.com/docs/product-docs/dashboards/widgets/bar-chart)).
7. **Clique até os registros** em quase todos, com destino variado: listagem, folha lateral, grade ou tabela só de leitura.
8. **Limite por plano como alavanca comercial**: 1 gráfico no Notion Free, 60 usos no ClickUp Free, quadros por dashboard no monday ([Notion, Chart view](https://www.notion.com/help/charts); [ClickUp, Dashboards limits](https://help.clickup.com/hc/en-us/articles/21257864098071-Dashboards-feature-availability-and-limits)).

## 5. O que nenhum deles faz por inteiro: as aberturas para o ENSPACE

*Inferência* em cada item: a combinação descrita não aparece em nenhuma fonte lida; as peças isoladas, sim.

- **Filtro do dashboard com E/OU que alcança categorias diferentes pelo campo comum.** Twenty não tem filtro de dashboard, Airtable e HubSpot ficam na mesma fonte, e o Notion aceita filtro simples. Só o Metabase liga o filtro campo a campo, e ele é BI, não ferramenta de operação.
- **Relação como dimensão com drill-down.** O Twenty agrupa pela relação, mas desliga o drill-down justo nesse caso; nos produtos de gestão de trabalho, a relação como eixo não aparece documentada.
- **Fórmula e campo virtual como medida desde o 1º dia.** É a reclamação mais citada no ClickUp e no Notion; os produtos de esquema livre contornam gravando o valor no próprio registro.
- **Múltipla seleção com aviso no próprio gráfico.** O SmartSuite explica na ajuda que o total passa da contagem de registros; nenhum produto mostra isso no cartão.
- **Aviso de que o número depende de quem vê.** Twenty avisa do fuso na FAQ; nenhum avisa, na tela, que a permissão muda o total.
- **Drill-down até a listagem real, editável, com o recorte aplicado.** O Notion para numa tabela só de leitura, e o Twenty troca de página. O ENSPACE pode abrir a listagem da categoria ou a visualização rápida do item, telas que ele já tem.
- **Cartão que diz o que conta sem hover.** Nenhuma fonte descreve o subtítulo nascido da frase da configuração ("Contratos: soma do Valor, criados nos últimos 30 dias").
- **Comparação com o período anterior no número.** O Metabase tem "Trend" ([Metabase, Numbers](https://www.metabase.com/docs/latest/questions/visualizations/numbers)); na gestão de trabalho e nos CRMs, só um nome de arquivo do Twenty sugere o recurso (`formatNumberChartTrend.ts`).

## 6. O que um bom dashboard do ENSPACE deve permitir

### Base: o que entra na 1ª entrega

| Capacidade | Hoje no ENSPACE | Evidência |
|---|---|---|
| 1 categoria por cartão; vários cartões de categorias diferentes no mesmo dashboard | 1 categoria por painel | padrão de Notion, Twenty, Airtable, Baserow ([Baserow](https://baserow.io/user-docs/dashboards-overview)) |
| 1 dimensão + 1 quebra, empilhada ou lado a lado | 1 série; 2º campo vira barra | Twenty `groupMode` ([widget.schema.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts)); Airtable None/Standard/100% |
| Agregação ligada ao tipo de campo: contagem (padrão) e contagem distinta para todo tipo; soma, média, mínimo e máximo para número e moeda; mínimo e máximo para data | todas as funções em todo campo; valor não numérico vira 0 | Twenty, 12 operações por tipo ([AggregateOperations.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-shared/src/types/AggregateOperations.ts)) |
| Fórmula e campo virtual numéricos como medida | "Total virtual" recusado (print `13`) | reclamação no ClickUp ([Feedback](https://feedback.clickup.com/feature-requests/p/formula-fields-in-dashboard)); fórmula no Jira 2026 |
| Múltipla seleção conta o item em cada opção, com aviso de que a soma passa do total | cada combinação vira 1 grupo | "Split multiple values" no Twenty e no Airtable; SmartSuite |
| Relação agrupa pelo nome do item relacionado, considerando todos os valores | só o 1º valor conta | Twenty, nome do registro relacionado desde a v2.25.0 ([newreleases](https://newreleases.io/project/github/twentyhq/twenty/release/twenty%2Fv2.25.0)) |
| Data por dia, semana, mês, trimestre e ano; padrão mês | segundo a ano, sem trimestre | Metabase "by month"; Twenty com trimestre |
| Filtro de período do dashboard inteiro, ligado sozinho à data padrão de cada categoria | não existe | Metabase, ligação automática ([Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters)) |
| Filtro por campo do dashboard, ligado sozinho aos cartões da mesma categoria | não existe | Metabase; SmartSuite "Filter widget" |
| Clique na barra abre a listagem da categoria com o recorte | não existe | Twenty, Airtable, SmartSuite, Attio |
| Prévia ao vivo no painel de configuração | só depois de salvar | HubSpot "Refresh as I make changes" |
| Tipos: número, barra horizontal ordenada, coluna, linha, área, barra empilhada, rosca, funil e tabela | 6 tipos, sem número nem tabela | Metabase e Power BI por forma do dado ([Visualizing results](https://www.metabase.com/docs/latest/questions/visualizations/visualizing-results)); funil mantido para não perder o que existe |
| Teto de grupos com "Outros" e aviso na tela | 49 ou 99, conferido só ao salvar | Twenty "Undisplayed data"; NocoDB "Include others" |
| Número formatado pelo locale e pelo campo, igual no eixo, no tooltip e na tabela | tooltip sem formato | `Intl.NumberFormat` com pt-BR dá "R$ 1.234.567,89" ([MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)) |
| "Ver como tabela" em todo cartão | não existe | WCAG 1.1.1 pede alternativa em texto ou tabela ([DVAC](https://dvac.netlify.app/)) |
| Cores com contraste de 3:1 e informação que não depende só de cor | 1 cor por série | WCAG 1.4.11 ([Deque](https://dequeuniversity.com/resources/wcag2.1/1.4.11-non-text-contrast)) |
| Modo de edição separado do modo de leitura | arrastar sempre ligado | Notion Edit e View; Metabase, lápis ([Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction)) |
| Cada pessoa vê os totais dos itens que pode ler; dashboard e cartão restritos a grupos | já é assim | SmartSuite, Baserow; Twenty "Role permissions still apply" |
| Estado próprio de carregamento, vazio e erro em cada cartão | texto fixo minúsculo; botão leva à aba errada | *Inferência:* nenhuma fonte lida descreve o padrão |

### Depois: a 2ª onda

| Capacidade | Evidência |
|---|---|
| Número com comparação ao período anterior | Metabase "Trend" ([Numbers](https://www.metabase.com/docs/latest/questions/visualizations/numbers)) |
| Linha de meta ("benchmark", "Target") | monday, SmartSuite, Attio, HubSpot "Monthly Goal" |
| Filtro cruzado no clique | Power BI por padrão; Metabase "Update a dashboard filter" |
| Filtro do dashboard entre categorias pelo campo comum (usuário, status) | Notion "Filter multiple sources"; Metabase auto-ligação |
| Tabela dinâmica (linhas × colunas × medida) | Airtable; HubSpot 4 × 4; monday só pelo vibe |
| Atributo da relação a 1 salto ("Negócios por cidade da Empresa") | Twenty, só muitos-para-um |
| Sazonalidade: dia da semana, mês do ano | Twenty |
| Acumulado no tempo | Notion "Cumulative"; Twenty |
| Percentual preenchido e vazio | Twenty `PERCENTAGE_EMPTY` |
| Dashboard sugerido ao escolher a categoria | Metabase X-rays |
| BENI monta o cartão a partir de um pedido, com a mesma configuração do construtor | Notion Agent, Rovo, Twenty, Metabot |
| Seções prontas de layout (linha de números e gráfico grande) | Metabase "KPI Grid" |
| Abas no dashboard | Twenty, Metabase, Asana desde o 3º trimestre de 2025 ([Asana Forum](https://forum.asana.com/t/list-of-technical-and-data-limitations-in-asana/236641)) |
| Heatmap e gauge | SmartSuite heatmap; HubSpot gauge; NN/g desaconselha gauge no dashboard acionável ([NN/g](https://www.nngroup.com/articles/dashboards-preattentive/)) |

*Inferência:* Mediana e Variância já existem e ficam, para não tirar o que o cliente usa; elas saem da lista principal e entram num grupo "Mais funções", porque, entre os produtos de gestão de trabalho e CRM lidos, só o funil do monday tem mediana e nenhum tem variância, e o usuário de negócio raramente as procura.

## 7. A usabilidade proposta

### Onde o dashboard mora: entrada nativa no menu e visão dentro da categoria

Hoje o dashboard depende de 2 configurações em lugares diferentes (Telas e Menus), e a tela criada que não entra num menu fica invisível. O mercado tem 2 endereços: menu próprio (ClickUp, Asana, Twenty com "Dashboards" no menu lateral, Attio com "Reports") e visão dentro da fonte (Notion, monday, Pipefy, Jira) ([Twenty, Dashboards](https://docs.twenty.com/user-guide/dashboards/capabilities/dashboards); [Attio, Insight report](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/set-up-an-insight-report.md)).

*Inferência:* o ENSPACE ganha com os 2, cada um com um papel:
- **"Dashboards" no menu principal**, para o dashboard do workspace, que junta categorias. Criar é 1 gesto ("Novo dashboard") e o dashboard aparece na lista para quem tem acesso, sem passar por Telas e Menus.
- **Gráfico como visualização da listagem da categoria**, ao lado de tabela e kanban, com a mesma barra e os mesmos filtros da listagem. O filtro que a pessoa já aplicou na listagem vira o filtro do gráfico.
- **O tipo de tela "Painéis" continua** para os dashboards que já existem, até a migração; o caminho novo não pede menu.

### O construtor: frase lida, painel lateral, prévia ao vivo

O modal atual soma 4 níveis (página, modal, aba, modal sobre modal) e 5 abas, e o Salvar recusa apontando campo de outra aba, sem marca de erro (achado C9 da pesquisa de UX do ENSPACE). A proposta:
- **Painel lateral à direita** com o cartão em tamanho real ao lado, redesenhando a cada escolha, como no Twenty e no HubSpot.
- **3 seções, na ordem do raciocínio:** Dados (categoria, medida, agrupamento, quebra, filtros, período); Gráfico (tipo sugerido e alternativas); Estilo (cores, rótulos, formato, legenda). É a divisão do Twenty entre "o que mostrar" e "como mostrar".
- **A frase como resumo e subtítulo do cartão:** "Soma de **Valor** de **Contratos** por **Status**, criados nos **últimos 30 dias**". Cada palavra em negrito abre o seletor dela. *Inferência:* a frase deixa implícito o par dimensão e medida que o poço exige saber antes, mas nenhum estudo com usuário não analista confirma a vantagem.
- **O dado antes do gráfico:** a pessoa escolhe medida e agrupamento, e o produto sugere o tipo, como Metabase, Tableau e Pipefy. Trocar o tipo depois converte a configuração em vez de apagá-la, ao contrário do SmartSuite.
- **Seletor de campo plano, com busca e os rótulos que a pessoa criou**: sem "data > Quantidade", sem "reference", sem "Display". Campos de sistema úteis ("Criado em", "Criado por", "Status do Item") entram com nome legível; os técnicos saem.
- **Título nasce da frase e ícone deixa de ser obrigatório.** Descrição do dashboard também deixa de ser obrigatória.
- **Erro na hora, no campo**, nunca no Salvar.

### Padrões por tipo de campo

*Inferência* derivada de Metabase, Power BI, Tableau e NN/g ([Metabase, Visualizing results](https://www.metabase.com/docs/latest/questions/visualizations/visualizing-results); [Power BI, Overview of visualizations](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview); [NN/g](https://www.nngroup.com/articles/dashboards-preattentive/)):

| A pessoa escolhe | Medida padrão | Gráfico sugerido | Alternativas |
|---|---|---|---|
| Só a categoria | contagem de itens | número | número com meta |
| Seleção, usuário ou relação | contagem de itens | barra horizontal ordenada pelo valor | coluna; rosca só com até cerca de 5 opções; tabela |
| Data | contagem de itens, por mês | linha (coluna, com poucos períodos) | área; tabela |
| Data × seleção | contagem de itens, por mês | linha com 1 série por opção, ou coluna empilhada | tabela |
| Seleção × seleção | contagem de itens | barra empilhada | barra lado a lado; tabela |
| Número ou moeda como medida | soma | o mesmo da dimensão | média, mínimo, máximo |
| Status com etapas do fluxo | contagem de itens | barra na ordem das etapas | funil |

O limite de "cerca de 5 fatias" para a rosca é inferência: Metabase e Power BI só dizem "small number". Com múltipla seleção ou relação com vários valores, a rosca sai da sugestão, porque as fatias somam mais que 100%.

### Como cada tipo de campo se comporta

- **Relação:** agrupa pelo nome do item relacionado e conta o item em cada relacionado quando há vários. A medida sobre relação é só contagem, como no Twenty. O clique abre a listagem filtrada por aquele relacionado.
- **Múltipla seleção:** conta o item em cada opção marcada. O cartão mostra "1 item pode contar em mais de 1 opção" e o total real de itens ao lado, em vez da soma das barras.
- **Usuário:** agrupa por pessoa, com foto e nome. O filtro aceita "eu" ("Current user" no Attio e no Airtable), o que deixa 1 dashboard servir a cada pessoa ([Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md)).
- **Fórmula e campo virtual:** quando o resultado é número ou moeda, entra como medida com as 5 agregações; quando é texto, entra como dimensão. O seletor mostra o tipo do resultado, não "[Tipo inválido]".
- **Moeda:** formata pelo campo. *Inferência:* nenhum produto documenta conversão de moeda no gráfico; misturar moedas num cartão pede aviso ou agrupamento por moeda.
- **Data:** a granularidade aparece em qualquer posição do agrupamento, não só na 1ª.

### Estado vazio e 1ª execução

- **Dashboard novo:** 3 caminhos visíveis: "Adicionar cartão", "Começar por uma categoria" (o produto propõe 4 ou 5 cartões pelos campos dela, como os X-rays do Metabase) e, depois, "Pedir ao BENI".
- **Cartão sem itens no período:** "Nenhum item de Contratos nos últimos 2 meses" e o botão "Mudar período", que abre o painel na seção de período. Hoje o botão abre a aba errada (print `15`).
- **Carregamento, vazio e erro** com aparência diferente; 1 cartão lento não trava os outros.

### Layout e leitura

- Grade de 12 colunas com tamanhos prontos (pequeno, médio, largo, inteiro) e redimensionamento livre só no modo de edição.
- "Editar dashboard" liga o modo de edição; nome, permissão e recarga vão para "Configurações do dashboard".
- As ações do cartão saem dos 6 ícones sem rótulo e entram num menu "…" com rótulos: "Editar", "Duplicar", "Ver como tabela", "Ver itens", "Baixar", "Excluir".
- "Forçar carregamento" vira "Atualizar", com a hora da última atualização ao lado.
- A permissão de quem vê ganha um aviso no dashboard: "Os números mostram só os itens que você pode ver".

## 8. Biblioteca de gráfico: Unovis pelo SDK, ECharts de reserva

### As 3 opções lado a lado

| Critério | ApexCharts (atual) | Apache ECharts | Unovis (SDK `EnChart*`) |
|---|---|---|---|
| Licença | dual desde a v5.0.0: grátis abaixo de US$ 2M de receita, orçamento ou captação anual ([ApexCharts, New Licensing Model](https://apexcharts.com/blog/new-licencing-model/)); 7 recursos da 6.0 pedem Premium em qualquer porte ([ApexCharts 6.0](https://apexcharts.com/blog/apexcharts-6-0-release/)) | Apache 2.0, sem conferência em fonte primária nesta pesquisa | listada como livre na nota de bibliotecas, sem conferência em fonte primária |
| Já está no ENSPACE | sim, ^5.16, na tela de Painéis | não | sim, 14 componentes no `enspace-sdk-ui` 0.18.0 e 2 protótipos aprovados |
| Funil, gauge, heatmap | não conferido | nativos ([Metabase blog](https://www.metabase.com/blog/best-open-source-chart-library)) | heatmap pelo `EnChartHeatmap`; funil e gauge não conferidos (*inferência:* `EnChartStages` e `EnChartMeter` sugerem etapas e medidor pelo nome) |
| Acessibilidade | nome acessível e title/desc, com `role="application"` que o próprio fornecedor chama de agressivo ([auditoria ApexCharts](https://apexcharts.com/blog/charting-library-accessibility-audit/)) | aria e padrões decal opcionais; descrição gerada do gráfico ([Metabase blog](https://www.metabase.com/blog/best-open-source-chart-library)); sem nome acessível de fábrica no canvas ([auditoria ApexCharts](https://apexcharts.com/blog/charting-library-accessibility-audit/)) | não documentada nas fontes lidas |
| Tema e modo escuro | tokens `--apx-*` na 6.0 | troca de tema sem recriar o gráfico na 6 ([ECharts 6](https://echarts.apache.org/handbook/en/basics/release-note/v6-feature)); no canvas, o tema lê as variáveis do Nuxt UI por código próprio (*inferência*) | alinhado ao Nuxt UI e ao shadcn-vue ([shadcn-vue Chart](https://shadcn-vue.com/docs/components/chart); [nuxtcharts.com](https://nuxtcharts.com/)) |
| Desempenho | canvas acima de 8000 pontos na 6.0 | canvas ou SVG, renderização no servidor | SVG e canvas; pede `<ClientOnly>` e altura definida no contêiner ([Haze docs](https://haze-nuxt.dashboardpack.com/docs/charts)) |
| Quem usa | n/c | Superset e Metabase ([Preset blog](https://preset.io/blog/2021-4-1-why-echarts/); [Metabase blog](https://www.metabase.com/blog/best-open-source-chart-library)) | shadcn-vue, nuxt-charts, templates pagos de Nuxt UI |

### Por que sair do ApexCharts

- **Licença.** A versão ^5.16 cai na faixa da licença dual. Se a Enlighten passa do teto de receita, o uso pede licença comercial; num SaaS em que o cliente monta o próprio gráfico, o caso pode ser lido como OEM, com preço sob consulta (*inferência* da nota de bibliotecas). **Esta pesquisa não afirma violação: a pergunta vai ao jurídico**, com a versão instalada, a receita e o modelo de distribuição. Alguns projetos ficaram em versões anteriores à v5 por causa da mudança ([Fórum Inductive Automation](https://forum.inductiveautomation.com/t/free-ignition-modules-and-resources-wiki-links-and-details/111081/6)).
- **Arquitetura.** O ApexCharts entra na tela por um componente próprio da tela de Painéis, fora do SDK; o código "<>" expõe as opções dele ao usuário (print `17`). Atualizar para a 6.0 não resolve a licença.

### A recomendação e o raciocínio

**Usar os `EnChart*` do SDK (Unovis) como base do dashboard novo.** Os motivos, em ordem de peso:
1. **O componente do SDK é o contrato do produto.** A tela chama `EnChartBar`, não uma biblioteca; o motor por baixo pode mudar sem mexer nas telas. Isso não vale para o ApexCharts nem para o ECharts usados direto.
2. **Os tipos da Base estão, pelo nome, no SDK:** barra, barra agrupada, lista de barras, linha, área, rosca, anel, medidor, heatmap, etapas, sparkline e estado vazio.
3. **Com a agregação no back-end, cada cartão desenha no máximo cerca de 100 grupos.** *Inferência:* a vantagem de desempenho do ECharts em canvas com milhares de pontos não pesa no dashboard de grupos agregados.
4. **1 sistema de tema.** Unovis já segue o visual do Nuxt UI nos protótipos aprovados; o ECharts pede uma camada que lê as variáveis do Nuxt UI e troca o tema no modo escuro.

**O argumento a favor do ECharts é real**, e é catálogo: funil, gauge, heatmap, Sankey e tipos novos da 6 nativos, aria e decal documentados, renderização no servidor, e adoção por Metabase e Superset, que têm o mesmo problema do ENSPACE. Se o roteiro incluir tabela dinâmica com mapa de calor, Sankey ou navegação por teclado dentro do gráfico, o ECharts cobre com menos código próprio.

**A decisão passa por uma prova curta, antes do 1º cartão em produção**, que confere no SDK:
- barra empilhada (o SDK lista barra agrupada, não empilhada);
- funil, pelo `EnChartStages`, e número com meta, pelo `EnChartMeter`;
- acessibilidade: nome acessível, descrição em texto, "ver como tabela" e contraste de 3:1 nos 2 temas;
- redimensionamento do cartão na grade, com `<ClientOnly>` e altura definida;
- 20 cartões na mesma tela, com montagem só do cartão visível.

O que a prova mostrar faltando entra no SDK como novo `EnChart*`, sobre Unovis quando ele cobre e sobre ECharts quando não cobre. ECharts nunca entra direto na tela.

**O que cada opção deixa descoberto**

| Lacuna | ApexCharts | ECharts | Unovis (SDK) |
|---|---|---|---|
| Funil | n/c | coberto | n/c; `EnChartStages` a conferir |
| Gauge | n/c | coberto | n/c; `EnChartMeter` e `EnChartRing` a conferir |
| Heatmap | n/c | coberto | `EnChartHeatmap` |
| Acessibilidade | `role="application"`; sem tabela de dados | aria e decal opcionais; sem teclado no gráfico | não documentada |
| Desempenho com muitos pontos | canvas acima de 8000 pontos (6.0) | canvas | SVG; *inferência:* suficiente para grupos agregados |
| Licença | risco a conferir com o jurídico | livre, a conferir na fonte primária | livre, a conferir na fonte primária |

Nenhuma biblioteca gera, sozinha, a tabela de dados acessível; a auditoria achou isso só no Google Charts ([auditoria ApexCharts](https://apexcharts.com/blog/charting-library-accessibility-audit/), feita por um concorrente). O "Ver como tabela" da Base cobre a lacuna em qualquer opção. O download em SVG, PNG e CSV, que hoje vem do menu do ApexCharts, precisa de implementação própria no SDK.

### A grade: gridstack fica, atualizado

O gridstack continua, da ^12.6 para a 14. A 13.0.0 trouxe wrapper oficial de Vue; a 13.1.0 mantém a ordem do DOM igual à visual, o que ajuda tab e impressão; a 13.3.0 melhora o arraste no celular; a 14.0.0 trouxe `cellHeight: 'fill'`; a 14.1.0 faz Esc devolver o item arrastado ([GitHub, gridstack releases](https://github.com/gridstack/gridstack.js/releases)). O grid-layout-plus é MIT e nativo de Vue, mas a v2 está em beta com mudanças que quebram a v1 ([GitHub, grid-layout-plus](https://github.com/qmhc/grid-layout-plus)), então não compensa trocar agora. O gridstack não descreve navegação completa por teclado. *Inferência:* o menu do cartão ganha "Mover para…" e "Tamanho" como alternativa ao arraste.

## 9. A arquitetura que a recomendação pede: agregar no back-end

**Hoje:** cada painel baixa todos os itens da categoria no período, sem limite, em paralelo e sem reaproveitar a resposta entre painéis da mesma categoria; os filtros e o agrupamento rodam no navegador. O back só guarda a configuração. A nota do ENSPACE não mediu o tempo de carga com centenas de milhares de itens.

**Proposta:** 1 rota de agregação no back-end que recebe a configuração do cartão (categoria, filtros, agrupamento, quebra, medida, granularidade, período, filtros do dashboard) e devolve os grupos calculados, já com o limite e o "Outros".

**Por quê:**
- **Volume.** O navegador recebe dezenas de grupos, não todos os itens. O mercado calcula no servidor e declara o teto: o monday vai até 20 mil itens por dashboard, e 500 mil com mondayDB 2.0 no Enterprise ([monday, mondayDB 2.0](https://support.monday.com/hc/en-us/articles/20705455822354-mondayDB-2-0)); o Twenty liga o gráfico a um resolver de groupBy desde a v1.8.0 ([GitHub, twenty releases](https://github.com/twentyhq/twenty/releases)). O Notion, que calcula sobre o banco, avisa que bancos grandes atualizam o gráfico mais devagar ([Notion, Dashboard view](https://www.notion.com/help/dashboards)).
- **Cálculo certo.** Empilhado, múltipla seleção contada em cada opção, relação com vários valores, fórmula e campo virtual como medida dependem de uma contagem feita sobre o dado inteiro, com regra única. Hoje essas regras saem do jeito que o `@tidyjs/tidy` agrupa no navegador.
- **Mesmos filtros da listagem.** *Inferência:* se a rota usa o mesmo motor de filtro da listagem da categoria, o drill-down abre a listagem com os mesmos filtros e mostra os mesmos itens que o cartão contou.
- **Permissão no mesmo lugar.** A regra que vale hoje (quem vê só recebe itens das categorias e formulários que pode ler) passa a ser aplicada no cálculo, e cada pessoa recebe o total dos próprios itens.
- **Filtro do dashboard barato.** Mudar o período reenvia a configuração; não baixa de novo todos os itens de cada cartão.
- **Cache e recarga.** O Metabase avisa que cada atualização automática roda de novo todas as consultas do dashboard ([Metabase, Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction)). *Inferência:* o resultado de cada cartão fica em cache curto, e "Atualizar" pede o recálculo.
- **IA com o mesmo contrato.** O Twenty descreve cada campo do widget num esquema que o agente de IA lê, com os operadores válidos por tipo ([Twenty, widget.schema.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts)). *Inferência:* se a configuração do cartão do ENSPACE tem esquema próprio, o BENI monta o cartão pelo mesmo esquema que o construtor usa, sem caminho paralelo.

## 10. Riscos e perguntas em aberto

**Riscos**
- **Licença do ApexCharts ^5.16:** depende da receita e do modelo de distribuição; ir ao jurídico antes de decidir prazo. Unovis, ECharts e gridstack também precisam da licença conferida na fonte primária.
- **Esforço no back-end:** a rota de agregação é trabalho novo; sem ela, empilhado, múltipla seleção, filtro do dashboard e drill-down ficam presos ao navegador.
- **Lacunas do SDK:** barra empilhada, funil, gauge e acessibilidade dos `EnChart*` não foram conferidos; a prova curta decide.
- **Números diferentes por pessoa:** 2 pessoas no mesmo dashboard podem ver totais diferentes. O aviso na tela reduz a surpresa, mas não a elimina.
- **Migração:** os painéis atuais guardam configuração em JSON com opções do ApexCharts. Cor por intervalo e por campo (release 2.15.0) e o código "<>" não têm destino direto no modelo novo.
- **Download:** SVG, PNG e CSV vêm hoje do ApexCharts e precisam de implementação própria.
- **Usabilidade sem prova:** nenhum estudo compara frase e poço com usuário não analista; a frase é aposta, a testar com jurídico, financeiro e operações.

**Perguntas em aberto**
- O tipo de tela "Painéis" convive com o "Dashboards" do menu, ou os dashboards atuais migram e o tipo sai da lista de Telas?
- Quem cria dashboard: só full e owner, como hoje para as ações, ou todo membro com dashboard pessoal?
- Mediana e Variância ficam visíveis ou vão para "Mais funções"? Algum cliente usa as 2?
- Qual é o teto de itens por cartão que o back-end aceita, e o limite entra no plano como alavanca comercial, como no monday?
- Campo virtual e fórmula são calculados na leitura? A rota de agregação precisa calcular os 2 antes de agrupar.
- Qual o tempo de carga atual com volume real? A medição falta no workspace de exploração, que tem poucos itens.
- A granularidade "Segundos" tem uso? Nenhuma fonte lida mostra granularidade abaixo de hora.

## 11. Fontes

**ENSPACE**
- Nota `enspace_hoje.md` (develop, en-docs `pt/1.docs/4.Settings/06.Interface/3.Screens.md`, front `en-space@develop e3a6cd15a`, back `enlighten-api@develop 5587592e8`, SDK `en-sdk@develop e516c7a`, pesquisa `enspace-ux-research`, tema construtor-de-telas).
- Prints em `app/pages/dashboards/evidencias/`: `01-tela-de-painel-hoje.jpg` a `19-tema-escuro.jpg`.

**Gestão de trabalho**
- ClickUp: [Bar Chart cards](https://help.clickup.com/hc/en-us/articles/14670260184855-Bar-Chart-cards); [Cards availability](https://help.clickup.com/hc/en-us/articles/26985557505303-Cards-feature-availability-and-limits); [Custom cards](https://help.clickup.com/hc/en-us/articles/6312164195095-Custom-cards); [Dashboards limits](https://help.clickup.com/hc/en-us/articles/21257864098071-Dashboards-feature-availability-and-limits); [Feedback: rollup, formula, relationship](https://feedback.clickup.com/feature-requests/p/enable-rollup-formula-and-relationship-fields-in-dashboards-for-full-reporting-c); [Feedback: formula fields](https://feedback.clickup.com/feature-requests/p/formula-fields-in-dashboard). Os centros de ajuda do ClickUp, do monday e do Asana devolveram HTTP 403 na leitura direta; o texto citado deles vem do trecho que a busca devolveu.
- monday: [The Dashboards](https://support.monday.com/hc/en-us/articles/360002187819-The-Dashboards); [Chart Widget](https://support.monday.com/hc/en-us/articles/360001262665-The-Chart-Widget); [Data Over Time](https://support.monday.com/hc/en-us/articles/38160284476050-The-Data-Over-Time-Widget); [Funnel Chart](https://support.monday.com/hc/en-us/articles/8805401342482-The-Funnel-Chart); [mondayDB 2.0](https://support.monday.com/hc/en-us/articles/20705455822354-mondayDB-2-0); [Developer Limits](https://developer.monday.com/apps/docs/limits); [vibe, June 2026](https://community.monday.com/ai-in-action/post/everything-new-in-monday-vibe---june-2026-addition-lQ0dSMZ5TYMgqKP).
- Notion: [Chart view](https://www.notion.com/help/charts); [Dashboard view](https://www.notion.com/help/dashboards); [kurashi-notion](https://kurashi-notion.com/en/blogs/notion/dashboard).
- Pipefy: [How to create dashboards](https://help.pipefy.com/en/articles/6047064-how-to-create-dashboards); [What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards).
- Asana: [Forum, limitations](https://forum.asana.com/t/list-of-technical-and-data-limitations-in-asana/236641); [cirface, Asana charts](https://cirface.com/blog/asana-charts).
- Jira: [Dashboard gadgets](https://support.atlassian.com/jira-cloud-administration/docs/use-dashboard-gadgets/); [KB, missing fields](https://support.atlassian.com/jira/kb/fix-missing-fields-jira-dashboard-gadget-dropdowns/); [Spring Release 2026](https://community.atlassian.com/forums/Jira-articles/Introducing-the-Jira-2026-Spring-Release/ba-p/3227380); [formula fields e dashboards](https://community.atlassian.com/forums/Jira-articles/Stop-exporting-your-work-to-figure-it-out-Jira-now-does-it-for/ba-p/3280890).

**CRM e bancos no-code**
- Twenty: código em `github.com/twentyhq/twenty`, branch `main`, lido em 2026-11-11 ([widget.schema.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts); [AggregateOperations.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-shared/src/types/AggregateOperations.ts); [getAvailableAggregateOperationsForFieldMetadataType.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/object-record/record-table/record-table-footer/utils/getAvailableAggregateOperationsForFieldMetadataType.ts); [LineChartSettings.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/side-panel/pages/page-layout/constants/LineChartSettings.ts); [isFieldSupportedAsChartGroupBySubField.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/side-panel/pages/page-layout/utils/isFieldSupportedAsChartGroupBySubField.ts); [buildChartDrilldownQueryParams.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/page-layout/widgets/graph/utils/buildChartDrilldownQueryParams.ts); [isFilteredViewRedirectionSupported.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/page-layout/widgets/graph/utils/isFilteredViewRedirectionSupported.ts)); docs [Dashboards](https://docs.twenty.com/user-guide/dashboards/capabilities/dashboards), [Widgets](https://docs.twenty.com/user-guide/dashboards/capabilities/widgets), [FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq); [releases](https://github.com/twentyhq/twenty/releases); [v1.14.0](https://github.com/twentyhq/twenty/releases/tag/v1.14.0); [v2.25.0](https://newreleases.io/project/github/twentyhq/twenty/release/twenty%2Fv2.25.0).
- Attio: [Insight report](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/set-up-an-insight-report.md); [Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md); [Dashboards](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/dashboards.md).
- Airtable: [Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard); [Filter element](https://support.airtable.com/docs/interface-element-filter); [Chart extension](https://support.airtable.com/docs/chart-extension.md).
- HubSpot: [custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder); [Feature Spotlight](https://www.hubspot.com/solutions-partner-resource-center/custom-report-builder); [Customize your dashboards](https://knowledge.hubspot.com/dashboard/customize-your-dashboards); [Create reports using AI](https://knowledge.hubspot.com/reports/create-reports-using-ai).
- Salesforce: [ReportType](https://developer.salesforce.com/docs/atlas.en-us.234.0.api_meta.meta/api_meta/meta_reporttype.htm); [Dashboard filters cheatsheet](https://resources.docs.salesforce.com/206/latest/en-us/sfdc/pdf/salesforce_dashboard_filters_cheatsheet.pdf); [asagarwal.com](https://www.asagarwal.com/?p=28734); [Dynamic dashboards cheatsheet](https://resources.docs.salesforce.com/210/latest/en-us/sfdc/pdf/salesforce_dynamic_dashboards_cheatsheet.pdf).
- SmartSuite: [Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget); [lookup fields in charts](https://help.smartsuite.com/en/articles/12143653-using-lookup-fields-in-charts).
- Baserow e NocoDB: [Baserow, Dashboards overview](https://baserow.io/user-docs/dashboards-overview); [NocoDB, Bar chart](https://nocodb.com/docs/product-docs/dashboards/widgets/bar-chart).

**BI e boas práticas**
- Metabase: [Summarizing and grouping](https://www.metabase.com/docs/latest/questions/query-builder/summarizing-and-grouping); [Visualizing results](https://www.metabase.com/docs/latest/questions/visualizations/visualizing-results); [Numbers](https://www.metabase.com/docs/latest/questions/visualizations/numbers); [Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters); [Interactive dashboards](https://www.metabase.com/docs/latest/dashboards/interactive); [Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction); [X-rays](https://www.metabase.com/docs/latest/exploration-and-organization/x-rays); [Metabot](https://www.metabase.com/docs/latest/ai/metabot).
- Power BI: [Overview of visualizations](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview); [visual interactions](https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions).
- Looker Studio e Superset: [Bar chart reference](https://support.google.com/looker-studio/answer/7165560); [Superset, Exploring data](https://superset.apache.org/user-docs/using-superset/exploring-data).
- Pesquisa: [Voyager](https://tableau.com/research/publications/voyager-exploratory-analysis-faceted-browsing-visualization-recommendations); [Voyager 2](https://faculty.washington.edu/billhowe/publications/pdfs/wongsuphasawat17voyager2.pdf); [Tableau, Show Me](https://help.tableau.com/current/pro/desktop/en-us/buildauto_showme.htm); [NN/g, Dashboards](https://www.nngroup.com/articles/dashboards-preattentive/).
- Acessibilidade e formato: [Deque, 1.4.11](https://dequeuniversity.com/resources/wcag2.1/1.4.11-non-text-contrast); [DVAC](https://dvac.netlify.app/); [MDN, Intl.NumberFormat](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).

**Bibliotecas**
- ApexCharts: [New Licensing Model](https://apexcharts.com/blog/new-licencing-model/); [Commercial License](https://apexcharts.com/license/commercial/); [6.0](https://apexcharts.com/blog/apexcharts-6-0-release/); [auditoria de acessibilidade](https://apexcharts.com/blog/charting-library-accessibility-audit/) (feita pelo próprio fornecedor); [Fórum Inductive Automation](https://forum.inductiveautomation.com/t/free-ignition-modules-and-resources-wiki-links-and-details/111081/6).
- ECharts: [ECharts 6 New Features](https://echarts.apache.org/handbook/en/basics/release-note/v6-feature); [releases](https://github.com/apache/echarts/releases); [Metabase blog](https://www.metabase.com/blog/best-open-source-chart-library); [Preset blog](https://preset.io/blog/2021-4-1-why-echarts/).
- Unovis: [shadcn-vue Chart](https://shadcn-vue.com/docs/components/chart); [nuxtcharts.com](https://nuxtcharts.com/); [Haze docs](https://haze-nuxt.dashboardpack.com/docs/charts); [Unovis 1.6](https://rokotyan.github.io/unovis/releases/1.6).
- Grade: [gridstack releases](https://github.com/gridstack/gridstack.js/releases); [grid-layout-plus](https://github.com/qmhc/grid-layout-plus).

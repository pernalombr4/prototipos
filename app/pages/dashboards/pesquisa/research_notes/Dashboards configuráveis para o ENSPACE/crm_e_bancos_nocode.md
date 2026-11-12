# Dashboards configuráveis em CRMs e bancos no-code com esquema próprio (Twenty, Attio, Airtable, HubSpot, Salesforce, Baserow, NocoDB, SmartSuite)

Pesquisa feita em 2026-11-11. Fonte de código do Twenty: `github.com/twentyhq/twenty`, branch `main` lida pela API do GitHub em 2026-11-11 (última release: `twenty/v2.57.1`, publicada em 2026-11-09). Caminhos de arquivo do Twenty são relativos à raiz do repositório e abrem em `https://github.com/twentyhq/twenty/blob/main/<caminho>`. Rótulos de tela ficam no idioma original, entre aspas. Informação anterior a 2026 leva a data.

## 1. O que o usuário cruza e até onde chega pelas relações

### Takeaway
Os produtos de esquema livre (Twenty, Attio, Airtable, Baserow, NocoDB, SmartSuite) montam cada gráfico sobre 1 objeto ou tabela; a relação entra como dimensão (agrupar pelo registro relacionado) e, no Twenty, como 1 salto até um campo do objeto relacionado, só na direção muitos-para-um. Cruzamento real entre objetos (join) só existe nos CRMs grandes: HubSpot (até 5 fontes de dados por relatório, ligadas pelas associações) e Salesforce (tipo de relatório personalizado com até 4 objetos em cadeia, mais campos por lookup).

### Cited Findings

**Twenty (código)**
- Cada widget de gráfico tem 1 objeto de origem; todo filtro precisa ser de campo desse objeto: "All filtered fields must belong to the widget object" — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.
- O agrupamento aceita campo de relação de 2 formas: sem subcampo, agrupa pelo registro relacionado, rotulado pelo nome de exibição; com `primaryAxisGroupBySubFieldName` (ex.: "name", "address.addressCity", "stage"), agrupa por um atributo do registro relacionado. Campo composto (endereço, moeda) exige o subcampo — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.
- Só relação MANY_TO_ONE aparece na lista de agrupamento (`field.relation?.type === RelationType.MANY_TO_ONE`) — `packages/twenty-front/src/modules/side-panel/pages/page-layout/components/dropdown-content/ChartGroupByFieldSelectionDropdownContentBase.tsx`. A regra compartilhada também barra ONE_TO_MANY — `packages/twenty-shared/src/utils/fieldMetadata/isFieldMetadataSupportedInGroupBy.ts`.
- O alcance é de 1 salto: o subcampo do objeto relacionado não pode ser outra relação (`isFieldRelation(field) || isFieldMorphRelation(field)` devolve falso) — `packages/twenty-front/src/modules/side-panel/pages/page-layout/utils/isFieldSupportedAsChartGroupBySubField.ts`. Exemplo: Oportunidade agrupada por Empresa > "Cidade" funciona; Oportunidade > Empresa > Conta-mãe > campo não funciona.
- Relação polimórfica (MORPH_RELATION) tem tela própria de escolha — `packages/twenty-front/src/modules/side-panel/pages/page-layout/components/dropdown-content/ChartGroupByFieldSelectionMorphRelationFieldView.tsx`.
- Na versão 2.25.0, o gráfico agrupado por relação passou a mostrar o nome do registro relacionado no lugar do id cru — [newreleases.io, twenty v2.25.0](https://newreleases.io/project/github/twentyhq/twenty/release/twenty%2Fv2.25.0).
- Não há rollup nem soma de campo de outro objeto: a medida (`aggregateFieldName`) precisa ser "from the widget object" — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.
- Campos de sistema agrupáveis: `createdAt`, `updatedAt` (data) e `createdBy`, `updatedBy` (ator) — `packages/twenty-shared/src/utils/fieldMetadata/isFieldMetadataSupportedInGroupBy.ts`.
- Campo de múltiplos valores (multi-select, array) tem o interruptor "Split multiple values" no eixo X e no agrupamento do eixo Y — `packages/twenty-front/src/modules/side-panel/pages/page-layout/constants/LineChartSettings.ts` e `.../constants/settings/ChartConfigurationSettingLabels.ts`.

**Attio**
- O relatório Insight escolhe 1 fonte: um objeto, uma lista ou atividade; agrupa por até 2 atributos ("Grouped by" e "Segmented by") — [Attio, Set up an Insight report](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/set-up-an-insight-report.md); [Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md).
- Exemplos oficiais de agrupamento: data personalizada, "owner" e categoria; com "Primary location > Country" aparece o gráfico "Map" — [Attio, Insight report](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/set-up-an-insight-report.md).
- Filtro de atributo de dono: "Current user" mostra a cada pessoa os próprios registros — [Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md).

**Airtable (Interfaces, layout Dashboard)**
- Cada grupo do dashboard lê 1 tabela; outro grupo pode ler outra tabela ("+ Add group"); um elemento não sai do grupo — [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard).
- Na tabela dinâmica, "Split multiple values" vale para multi-select e para registro vinculado — [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard).
- O filtro de interface só alcança elementos da mesma tabela de origem: um elemento Number de outra tabela "is not filterable by that filter element" — [Airtable, Interface element: Filter](https://support.airtable.com/docs/interface-element-filter).
- O gráfico multi-tabela existe só no elemento personalizado gerado por IA (anúncio "multi table support for custom interface elements") — [Airtable Community](https://community.airtable.com/announcements-6/multi-table-support-for-custom-interface-elements-ai-labs-46753).

**HubSpot (custom report builder)**
- Fluxo: "Primary data source" e, com "Add more data sources", outros objetos; "Add association labels" restringe pelo rótulo da associação — [HubSpot KB, Create reports with the custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).
- Limite de 5 fontes por relatório, com no máximo 1 fonte de eventos — [HubSpot, Feature Spotlight](https://www.hubspot.com/solutions-partner-resource-center/custom-report-builder).
- O construtor liga cada objeto direto ao objeto primário; sem ligação direta, escolhe o caminho de associação com menos passos — [HubSpot KB, single object e cross object reports](https://knowledge.hubspot.com/reports/create-custom-single-object-and-cross-object-reports).
- Data Hub Enterprise pode partir de um "dataset" ("Create dataset") no lugar de objetos — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).
- Objetos personalizados em relatório de objeto único: "Enterprise only" — [HubSpot KB, single object reports](https://knowledge.hubspot.com/reports/create-custom-single-object-and-cross-object-reports).

**Salesforce (report types)**
- Tipo de relatório personalizado junta no máximo 4 objetos em cadeia (A > B > C > D) — [Salesforce Metadata API, ReportType, v234](https://developer.salesforce.com/docs/atlas.en-us.234.0.api_meta.meta/api_meta/meta_reporttype.htm).
- Em cada nível, o admin escolhe "with" ou "with or without" registros relacionados; "with or without" é left outer join — [SalesforceBen, custom report types](https://www.salesforceben.com/features-custom-report-types/).
- "Add fields related via lookup" puxa campos de objetos por lookup, até 4 relações de distância — [Salesforce Admins blog, 2017](https://admin.salesforce.com/blog/2017/ultimate-guide-report-types-flipping-report-types-upside).
- No "with or without", não há OR entre filtros de campos dos objetos ligados — [SalesforceBen, custom report types](https://www.salesforceben.com/features-custom-report-types/).

**SmartSuite**
- O "Group By" aceita campo Lookup: Number, Date, Linked Record, Assigned To e listas (Single Select, Multiple Select, Tag), 1 grupo por valor — [SmartSuite, Using lookup fields in charts](https://help.smartsuite.com/en/articles/12143653-using-lookup-fields-in-charts).
- Valor múltiplo conta em cada grupo: "The chart counts each value, so a total can be higher than the record count" — [SmartSuite, Using lookup fields in charts](https://help.smartsuite.com/en/articles/12143653-using-lookup-fields-in-charts).
- Lookup numérico pode ser somado como valor — [SmartSuite, Using lookup fields in charts](https://help.smartsuite.com/en/articles/12143653-using-lookup-fields-in-charts).
- Release "Charts: full support for lookup fields" — [SmartSuite What's new](https://www.smartsuite.com/whats-new/charts-full-support-for-lookup-fields).

**Baserow, NocoDB, Fibery**
- Baserow: 1 tabela por widget; widgets do mesmo dashboard podem ler bancos diferentes — [Baserow, Dashboards overview](https://baserow.io/user-docs/dashboards-overview).
- NocoDB: 1 tabela por widget; "Records" pode ser "All Records", "Records from a view" ou "Specific Records" — [NocoDB, Bar chart](https://nocodb.com/docs/product-docs/dashboards/widgets/bar-chart).
- Fibery: usuário de fórum diz que os relatórios "don't really use" os dados relacionais — [Fibery Community, Multi-level charts](https://community.fibery.io/t/multi-level-charts/9216).

### Inferences
- Para o ENSPACE, o padrão de mercado em esquema livre é "1 categoria por gráfico + relação como dimensão". A extensão do Twenty (1 salto, só muitos-para-um, só na dimensão) resolve "Negócios por cidade da Empresa" sem motor de join.
- Somar campo de outra categoria (rollup) fica fora em todos os de esquema livre. O caminho deles é a fórmula ou o lookup gravado no próprio registro (SmartSuite, Airtable).
- Join de vários objetos (HubSpot, Salesforce) pede um tipo de relatório definido antes, por admin (Salesforce) ou um caminho de associação automático (HubSpot); as duas soluções têm custo de explicação alto (ver queixas no item 5).

### Gaps
- Attio: as fontes não dizem se o "Grouped by" aceita atributo do registro relacionado (ex.: Deal agrupado por "Company > Industry"), nem como trata multi-select.
- Airtable: as fontes não dizem se o eixo X do gráfico aceita campo de lookup ou de rollup.
- Twenty: não achei a lista completa de tipos fora do agrupamento (`FIELD_METADATA_TYPES_NOT_SUPPORTED_IN_GROUP_BY`); a árvore do repositório devolvida pela API veio incompleta.

## 2. Que agregações existem e em quais tipos de campo

### Takeaway
Todos oferecem contagem de registros e soma, média, mínimo e máximo de campo numérico. O Twenty é o mais granular: 12 operações, com regra por tipo de campo, mais "Ratio" no número de destaque. HubSpot e Salesforce somam fórmula de relatório e campos derivados (bucket). Granularidade de data vai de dia a ano no Twenty, e inclui "dia da semana" e "mês do ano".

### Cited Findings

**Twenty**
- Operações: MIN, MAX, AVG, SUM, COUNT, COUNT_UNIQUE_VALUES, COUNT_EMPTY, COUNT_NOT_EMPTY, COUNT_TRUE, COUNT_FALSE, PERCENTAGE_EMPTY, PERCENTAGE_NOT_EMPTY — `packages/twenty-shared/src/types/AggregateOperations.ts`.
- Por tipo: MIN, MAX e AVG em NUMBER, CURRENCY e RATING; SUM em NUMBER e CURRENCY; COUNT_TRUE e COUNT_FALSE em BOOLEAN; EARLIEST e LATEST em DATE e DATE_TIME — `packages/twenty-front/src/modules/object-record/record-table/constants/FieldTypesAvailableForNonStandardAggregateOperation.ts`.
- Todo tipo recebe COUNT, COUNT_EMPTY, COUNT_NOT_EMPTY, COUNT_UNIQUE_VALUES, PERCENTAGE_EMPTY e PERCENTAGE_NOT_EMPTY; campo de relação recebe só COUNT — `packages/twenty-front/src/modules/object-record/record-table/record-table-footer/utils/getAvailableAggregateOperationsForFieldMetadataType.ts`.
- Granularidade de data: DAY, WEEK, MONTH, QUARTER, YEAR, DAY_OF_THE_WEEK, MONTH_OF_THE_YEAR, QUARTER_OF_THE_YEAR, no eixo principal e no agrupamento secundário — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.
- Número de destaque ("Aggregate"): "Ratio" para campo Select ("Data on display" > campo > "Ratio"), prefixo e sufixo — [Twenty docs, Widgets](https://docs.twenty.com/user-guide/dashboards/capabilities/widgets). No código, `ratioAggregateConfig` guarda campo e `optionValue` — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.
- Barras e linhas têm "Cumulative" (total acumulado), "Min range" e "Max range" no eixo — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`; rótulos em `packages/twenty-front/src/modules/side-panel/pages/page-layout/constants/settings/ChartConfigurationSettingLabels.ts`.
- Formato do número: SHORT (1.3m) ou FULL (1,300,090) — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.

**Attio**
- "Metric": contar registros ou escolher atributo number, currency ou rating, com Count, Max, Average, Min ou Sum — [Attio, Insight report](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/set-up-an-insight-report.md).
- Data agrupada por dia, semana ou mês — [Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md).
- Tipos de relatório além do Insight: "Historical values" (semana a semana ou mês a mês; Pro, Enterprise, Ultra), "Funnel" (Plus em diante), "Time in stage" e "Stage changed" (Pro em diante) — [Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md).

**Airtable**
- Gráfico: eixo Y padrão "Count"; outro campo no Y precisa ser numérico; data no X agrupa por semana, mês, trimestre — [Airtable, Chart extension](https://support.airtable.com/docs/chart-extension.md).
- Number: "Count" ou "Summary", com o tipo de resumo conforme o campo. Tabela dinâmica: "Count" ou campo com sum, average, min, max — [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard).
- Gráfico com até 5 séries no eixo esquerdo e 1 no direito ("Y-axis (left)", "Y-axis (right)") — [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard).
- Usuários relatam que não dá para tirar a agregação do eixo Y — [Airtable Community](https://community.airtable.com/interface-designer-12/can-t-remove-aggregation-in-interface-chart-46772).

**HubSpot**
- Dimensão (sem agregação, qualquer tipo) vai em "X-axis" ou "Break down by"; medida (agregada, em geral numérica) vai em "Y-axis", até 12 por relatório — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).
- Medida padrão ("Count of deals") usa "Distinct count", que não muda; o lápis edita "Name", "Aggregation", "Sort", "Limit", "Format" — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).
- Campo de fórmula no relatório: só Data Hub Enterprise — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).

**Salesforce**
- 1 fórmula por linha ("row-level formula") por relatório, com até 5 campos — [SalesforceBen, row-level formula](https://www.salesforceben.com/row-level-formula-fields-in-salesforce-reports-tutorial/).
- Até 5 campos bucket por relatório, com até 20 buckets cada (cheatsheet de 2017) — [Salesforce, Bucketing cheatsheet](https://resources.docs.salesforce.com/206/latest/en-us/sfdc/pdf/salesforce_reports_bucketing_cheatsheet.pdf).

**Baserow, NocoDB, SmartSuite**
- Baserow: "Summary" com total, média e contagem — [Baserow, Dashboards overview](https://baserow.io/user-docs/dashboards-overview). Agrupar por data não existia num post da equipe; a saída era fórmula de texto — [Baserow Community](https://community.baserow.io/t/line-chart-doesnt-handle-date-fields/10886).
- NocoDB: "Field Summary" com Sum, Average, Min, Max; vários campos no Y para comparar — [NocoDB, Bar chart](https://nocodb.com/docs/product-docs/dashboards/widgets/bar-chart).
- SmartSuite: "Count" em campo contado; em numérico, padrão "Sum" e mais "Min", "Max", "Avg"; "ADD NEW" cria a 2ª série; "Chart Total" soma até 5 totais em blocos acima do gráfico — [SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget).

### Inferences
- A tabela de operações por tipo do Twenty serve de base direta para o ENSPACE: contagem e vazios para todo tipo, soma para número e moeda, média, mínimo e máximo também para avaliação, primeiro e último para data, contagem de verdadeiro e falso para booleano.
- "Dia da semana" e "mês do ano" (sazonalidade) são raros no mercado; o Twenty já tem.

### Gaps
- Mediana: nenhuma fonte confirmou em Attio, Airtable, HubSpot ou Salesforce.
- Salesforce: não confirmei por fonte o número de agrupamentos por formato (resumo e matriz) nem as funções de resumo do Lightning.
- Attio, NocoDB e Baserow: não achei a regra de agregação por tipo de atributo além do numérico.

## 3. Como é a tela de configuração e quantos passos até o 1º gráfico

### Takeaway
O padrão dominante é editar o gráfico num painel lateral ou numa área de configuração ao lado de uma prévia que se atualiza a cada mudança: Twenty (painel lateral com seções Data, X axis, Y axis, Style), HubSpot (campos arrastados para "X-axis", "Y-axis", "Break down by", com "Refresh as I make changes"), SmartSuite e NocoDB (formulário com prévia). Nenhum usa assistente em etapas. O mínimo é de 3 a 4 escolhas: fonte, tipo de gráfico, medida e agrupamento.

### Cited Findings

**Twenty**
- Navegação: "Dashboards" no menu lateral; "+ New Record"; nome; abas e widgets — [Twenty docs, Dashboards](https://docs.twenty.com/user-guide/dashboards/capabilities/dashboards).
- Estrutura: Dashboard > Abas > Widgets — [Twenty docs, FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq).
- Aba nova: "+" na barra de abas abre um painel lateral à direita — [Twenty docs, Dashboards](https://docs.twenty.com/user-guide/dashboards/capabilities/dashboards).
- A configuração do gráfico mora no painel lateral (`SidePanelDashboardChartSettings.tsx`, em `packages/twenty-front/src/modules/side-panel/pages/page-layout/components/`).
- Tipos no seletor: VERTICAL_BAR, HORIZONTAL_BAR, LINE, PIE, AGGREGATE — `packages/twenty-front/src/modules/side-panel/pages/page-layout/types/GraphType.ts`.
- Ordem das seções do gráfico de linha: Data ("Source", "Filter"); X axis ("Data on display", "Date granularity", "Sort by", "Omit zero values", "Split multiple values"); Y axis ("Data on display", "Group by", "Date granularity", "Sort by", "Cumulative", "Min range", "Max range", "Split multiple values"); Style ("Colors", "Axis name", "Stacked lines", "Data labels", "Format", "Legend") — `packages/twenty-front/src/modules/side-panel/pages/page-layout/constants/LineChartSettings.ts`; rótulos em `.../constants/settings/ChartConfigurationSettingLabels.ts`.
- Número de destaque: Data ("Source", "Filter", "Data on display") e Style ("Format", "Prefix", "Suffix") — `packages/twenty-front/src/modules/side-panel/pages/page-layout/constants/AggregateChartSettings.ts`.
- Pizza: "Each slice represents", "Show value in center", "Hide empty category" — `.../constants/settings/ChartConfigurationSettingLabels.ts`; `showCenterMetric` vem ligado por padrão — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.
- Ordenação: FIELD_ASC, FIELD_DESC, FIELD_POSITION_ASC, FIELD_POSITION_DESC (ordem das opções do select), VALUE_ASC, VALUE_DESC, MANUAL (lista arrastada) — `packages/twenty-server/src/engine/metadata-modules/page-layout-widget/enums/graph-order-by.enum.ts`.
- Barras com 2º agrupamento: `groupMode` (empilhado ou lado a lado) e `layout` (vertical ou horizontal) — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.
- Filtro por gráfico com grupos E/OU aninhados e data relativa ("PAST_7_DAY", "THIS_1_MONTH") — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`; data relativa entrou na v1.14.0 (2025-12-23) — [GitHub, twenty v1.14.0](https://github.com/twentyhq/twenty/releases/tag/v1.14.0).
- Paleta: "auto" e 25 cores nomeadas — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.

**Attio**
- Passos: "Reports" no menu lateral > dashboard > "+ Add report" > "Insight" > fonte > "Metric" > "Grouped by" > "Segmented by" (fora do plano Free) > filtros > visualização ("Bar", "Pie", "Line", "Map") > opções ("Show axis labels", "Target", "Stack bars", "Sorted by") > salvar. A mudança só aparece aos outros depois de salvar — [Attio, Insight report](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/set-up-an-insight-report.md).
- "Calculated values" abre a tabela de valores; marcar uma célula destaca o ponto no gráfico, e o contrário também — [Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md).

**Airtable**
- Passos: no editor de interface, "+" > layout "Dashboard" > "Next" > tabela de origem > "Finish"; depois "+" para Number, Chart, List, Timeline, Summary Cards; "+ Add pivot table" — [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard).
- Gráficos: Bar, Line, Pie, Donut, Scatter; empilhamento "None", "Standard", "100%" — [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard).

**HubSpot**
- Propriedades arrastadas da barra esquerda para os campos da aba "Configure" ("X-axis", "Y-axis", "Break down by"); o relatório se atualiza a cada mudança, salvo se "Refresh as I make changes" estiver desmarcado; "Smart chart" sugere o tipo pelos campos — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).
- Ordenação por "Label", "Value", "Display order" ou "Count of records"; "Limit" do tipo "Top 10" ou "Bottom 20" — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).
- Filtros: "ALL of the filters below", "ANY of the filters below" ou "Custom filter rules" (ex.: "1 and (NOT 2)") — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).
- Estilo: "Axis Scale" (linear ou logarítmica), "Min", "Max", "Show Data Labels", "Show totals", "Stacked", "Cumulative" e "Monthly Goal" (linha de meta em eixo X de data) — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).

**SmartSuite**
- Passos: "Edit" > "+ Add Widget" > "Charts" > cartão (ex.: "Column") > "Source Select" (solução e tabela) > "Chart Type" > "Select Value" e agregação > "Group By" > "Add Widget"; o dashboard grava sozinho. Trocar o tipo de gráfico apaga os valores e a prévia — [SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget).
- "Benchmark Line" desenha linha tracejada de meta; "Sort by Values" só sem "Group By" — [SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget).

**NocoDB**
- Formulário: "Title", "Description", "Table", "Records", eixo X ("Field", "Sort By", "Order", "Include empty records", "Include others"), eixo Y ("Fields", "Field Summary", "Start at zero"), aparência ("Size", "Show value in chart", "Show count in legend") — [NocoDB, Bar chart](https://nocodb.com/docs/product-docs/dashboards/widgets/bar-chart).

### Inferences
- O painel lateral do Twenty separa "o que mostrar" (Data, eixos) de "como mostrar" (Style). É o arranjo mais próximo do que o ENSPACE precisa: categoria, campo de agrupamento, agregação e tipo de gráfico ficam todos visíveis numa coluna, com o gráfico ao lado.
- Regra de ouro do SmartSuite: escolher o tipo de gráfico primeiro, porque trocar depois apaga a configuração. O Twenty guarda campos por tipo (`getConfigurationTypeFromGraphType.ts`), o que sugere conversão entre tipos.

### Gaps
- Nenhuma fonte mediu o número de cliques até o 1º gráfico; a contagem de 3 a 4 escolhas vem dos passos documentados.
- Twenty: as docs não descrevem a prévia ao vivo; o código mostra o painel, mas não li o componente de renderização da prévia.

## 4. Como resolvem a permissão dos dados do dashboard

### Takeaway
Há 2 modelos. No 1º (Twenty, Baserow, SmartSuite, Attio para listas, HubSpot), quem vê o dashboard vê os dados pela própria permissão, e o dashboard em si tem visibilidade separada. No 2º (Salesforce), o dashboard roda como um "running user" fixo, e o modo "dynamic dashboard" ("Run as logged-in user") é limitado por edição (5 no Enterprise). O Airtable fica no meio: o filtro "Current user" restringe o que a interface mostra, mas é configuração de exibição.

### Cited Findings
- **Twenty:** todo dashboard é visível a quem tem acesso ao workspace; não há dashboard privado nem compartilhamento externo; favorito é pessoal — [Twenty docs, FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq).
- **Twenty:** os números seguem o fuso de quem vê, então 2 pessoas podem ver números diferentes; fuso por dashboard está planejado — [Twenty docs, FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq).
- **Twenty:** os widgets de tabela e kanban são somente leitura até alguém ligar "Allow editing"; "Role permissions still apply" — [Twenty docs, Widgets](https://docs.twenty.com/user-guide/dashboards/capabilities/widgets).
- **Attio:** "Share" > "Workspace access": "Full access", "Read and write", "Read only", "No access"; dashboard novo nasce "No access"; acesso por time ou membro só em Pro, Enterprise, Ultra; vale o nível mais permissivo; relatório com dados de lista só aparece a quem tem acesso à lista — [Attio, Dashboards](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/dashboards.md).
- **Airtable:** a página mostra só os registros em que a pessoa logada está num campo de usuário, com filtro "current user"; só autor, "base owner" ou "creator" mudam o filtro — [Airtable, Interface Designer permissions](https://support.airtable.com/docs/interface-designer-permissions); [Airtable Guide](https://airtable.com/guides/collaborate/how-to-implement-interface-permissions-in-your-workflow). Um fornecedor concorrente afirma que quem tem acesso à base vê todos os registros apesar do filtro — [Noloco](https://noloco.io/airtable-permissions-what-they-can-and-cant-do) (fonte com interesse comercial).
- **HubSpot:** visibilidade do dashboard: privado ao dono, todos veem, todos veem e editam; usuários e times específicos só no Enterprise; Super Admin e quem tem a permissão de relatórios edita todos — [HubSpot KB, Customize your dashboards](https://knowledge.hubspot.com/dashboard/customize-your-dashboards); [Spitfire Inbound, blog antigo](https://blog.spitfireinbound.com/things-you-didnt-know-you-could-do-with-hubspot-dashboards).
- **HubSpot:** relatório num dashboard se restringe pelo dashboard; quem não tem acesso ao pipeline ainda vê registros do pipeline restrito em relatórios — [HubSpot KB, Limit access to your HubSpot assets, atualizado em 2026-09-30](https://knowledge.hubspot.com/account-security/limit-access-to-your-hubspot-assets).
- **Salesforce:** limite de dynamic dashboards: 5 no Enterprise, 10 no Unlimited e Performance, 3 no Developer — [Salesforce, Dynamic dashboards cheatsheet](https://resources.docs.salesforce.com/210/latest/en-us/sfdc/pdf/salesforce_dynamic_dashboards_cheatsheet.pdf).
- **Salesforce:** contam no limite "Run as logged-in user" e "Let authorized users change running user"; passar do limite dá "You reached the limit for dashboards run as the logged-in user" — [Gearset](https://docs.gearset.com/en/articles/16213333-resolving-validation-errors-you-reached-the-limit-for-dashboards-run-as-the-logged-in-user-on-dashboard-metadata-type).
- **SmartSuite:** dashboard público é editado por Solution Manager e Full Access; o privado, pelo dono; quem vê enxerga só os registros que pode abrir; dashboard compartilhado é somente leitura — [SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget).
- **Baserow:** a visibilidade segue a permissão padrão; quem vê precisa de acesso aos bancos e tabelas — [Baserow, Dashboards overview](https://baserow.io/user-docs/dashboards-overview).

### Inferences
- No Twenty, o gráfico consulta a API GraphQL de groupBy com a sessão de quem vê (o drill-down monta a URL de filtro no navegador, `buildChartDrilldownQueryParams.ts`); a permissão de papel do objeto deve valer, mas não li o resolver para confirmar.
- O modelo "cada um vê pela própria permissão" é o mais simples para o ENSPACE e evita o limite artificial do Salesforce. O custo: 2 pessoas veem números diferentes no mesmo gráfico, como o Twenty já avisa para o fuso.

### Gaps
- Uma busca atribuiu ao HubSpot KB a frase de que o acesso ao relatório não passa por cima da permissão de registro; não achei a página, então fica sem confirmação.
- Twenty: não confirmei no código do servidor se o groupBy do gráfico aplica a permissão de linha (RLS) do papel.

## 5. Tipos de widget, filtros do dashboard, drill-down, layout, atualização, limites, IA e queixas

### Takeaway
Barra, linha, pizza e número são universais; funil, gauge, tabela dinâmica e mapa separam os produtos. O filtro de dashboard inteiro é o buraco mais citado: Twenty não tem, Airtable só filtra elementos da mesma tabela, HubSpot só aplica a relatórios da mesma fonte, Salesforce limita a 3 (ou 5) filtros. O drill-down para a lista de registros existe em quase todos: Airtable e SmartSuite abrem uma janela lateral ou de sobreposição; Twenty leva à listagem filtrada.

### Cited Findings

**Tipos de widget**
- Twenty: barra vertical e horizontal, linha, pizza, número, iFrame, tabela de registros, texto rico; gauge "Coming soon" — [Twenty docs, Widgets](https://docs.twenty.com/user-guide/dashboards/capabilities/widgets). O gauge foi removido na v2.3.0 (2026-05-14): "Remove gauge chart support and delete existing widgets" — [GitHub, twenty v2.3.0](https://github.com/twentyhq/twenty/releases/tag/v2.3.0). Tipos de widget no servidor: VIEW, GRAPH, IFRAME, STANDALONE_RICH_TEXT, RECORD_TABLE — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.
- Attio: Bar, Pie, Line, Map, mais Funnel, Historical values, Time in stage, Stage changed — [Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md).
- Airtable: Number, Chart (Bar, Line, Pie, Donut, Scatter), List, Timeline, Summary Cards (Business e Enterprise Scale), Pivot table (planos pagos, só desktop) — [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard).
- HubSpot: barra vertical e horizontal, linha, área, combinação, rosca, pizza, KPI, gauge (com "Bands"), tabela dinâmica (4 linhas e 4 colunas), tabela, dispersão — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).
- Salesforce Lightning: barra, coluna, linha, rosca, funil, gauge, métrica, tabela, dispersão — [Spekit](https://spekit.com/salesforce-lightning-dashboards); até 20 componentes por dashboard, segundo erro relatado na comunidade — [Xappex](https://www.xappex.com/blog/salesforce-dashboards/).
- Baserow: Summary, barra (até 3 séries), linha (até 3 séries), pizza, rosca — [Baserow, Dashboards overview](https://baserow.io/user-docs/dashboards-overview).
- NocoDB: Number, Bar, Line, Pie, Donut, Text, iFrame; em Beta, nos planos Plus e Business da nuvem — [NocoDB, Dashboards](https://nocodb.com/docs/product-docs/dashboards).
- SmartSuite: Bar, Bubble, Column, Heatmap, Line, Pie — [SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget).

**Número com comparação ao período anterior**
- Twenty tem `formatNumberChartTrend.ts` em `packages/twenty-front/src/modules/page-layout/widgets/graph/graph-widget-aggregate-chart/utils/`, o que indica uma tendência no número de destaque; as docs não descrevem a comparação.

**Filtro do dashboard e filtro cruzado**
- Twenty: "Dashboard-level filters are not available yet"; cada widget se filtra sozinho — [Twenty docs, FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq).
- Airtable: filtro de usuário por grupo ("User filters", em abas ou listas) e filtro de elemento; só 1 filtro por aba, segundo usuário — [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard); [Airtable Community](https://community.airtable.com/t5/interface-designer/creating-a-global-filter-for-an-interface-across-all-pages/td-p/208592).
- HubSpot: filtro no topo do dashboard (data, dono, time, pipeline) só alcança relatórios da mesma fonte; só dono e editores mudam os "quick filters"; relatório com mais de 100 valores em "Break down by" não carrega no dashboard ("Too many data points requested") — [HubSpot KB, Customize your dashboards](https://knowledge.hubspot.com/dashboard/customize-your-dashboards).
- Salesforce: até 3 filtros por dashboard, com até 50 opções cada (cheatsheet de 2017) — [Salesforce, Dashboard filters cheatsheet](https://resources.docs.salesforce.com/206/latest/en-us/sfdc/pdf/salesforce_dashboard_filters_cheatsheet.pdf); um blog diz que o Spring '24 subiu para 5 filtros em todas as edições — [asagarwal.com](https://www.asagarwal.com/?p=28734).
- SmartSuite: "Dynamic Filter" por widget (pessoa, data, seleção, status) e um "Filter widget" que filtra os widgets ligados — [SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget).
- Attio: marcar uma célula de "Calculated values" destaca o gráfico; não há seletor de período no dashboard — [Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md).

**Drill-down**
- Twenty: o clique monta parâmetros de URL com os filtros do gráfico mais o filtro do balde clicado (data respeita fuso e 1º dia da semana) — `packages/twenty-front/src/modules/page-layout/widgets/graph/utils/buildChartDrilldownQueryParams.ts`. Sem drill-down quando o agrupamento é relação — `packages/twenty-front/src/modules/page-layout/widgets/graph/utils/isFilteredViewRedirectionSupported.ts`; [GitHub, twenty v1.16.0, PR 17150](https://github.com/twentyhq/twenty/releases/tag/v1.16.0).
- Airtable: "Click to see underlying records" abre uma folha lateral ("side-sheet") com campos e ordem escolhidos pelo criador — [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard).
- SmartSuite: o clique abre uma janela com a grade dos registros, editável — [SmartSuite, Chart widget](https://help.smartsuite.com/en/articles/5779815-chart-widget).
- Attio: o ponto do gráfico abre os registros que contribuem; "View contributing data" lista todos — [Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md).
- HubSpot: aba "Unsummarized dataset" e "Export unsummarized data"; dono e time saem como id interno no export — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).

**Layout**
- Twenty: grade de 12 colunas; cada widget tem `row`, `column` (0 a 11), `rowSpan`, `columnSpan` (1 a 12) — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`; arrastar e redimensionar — [Twenty docs, Dashboards](https://docs.twenty.com/user-guide/dashboards/capabilities/dashboards).
- Attio: arrastar pelo título; escolher quantos relatórios por linha; arrastar o divisor para redimensionar — [Attio, Dashboards](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/dashboards.md).
- Airtable: grupos e elementos arrastáveis; tamanho por "Width" e "Size", sem redimensionamento livre descrito — [Airtable, Interface layout: Dashboard](https://support.airtable.com/docs/interface-layout-dashboard).
- Baserow: grade com arrastar e redimensionar — [Baserow, Dashboards overview](https://baserow.io/user-docs/dashboards-overview).

**Atualização e cache**
- Twenty: atualização em tempo real para a maioria das métricas e botão de atualizar — [Twenty docs, FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq).
- Baserow: "Dashboards automatically refresh when your underlying data changes" — [Baserow, Dashboards overview](https://baserow.io/user-docs/dashboards-overview).
- Attio: registro apagado some do relatório na atualização — [Attio, Create reports](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/reports.md).

**Limites de exibição e de plano**
- Twenty: até 100 barras e 50 grupos por barra; acima disso, "Undisplayed data: max X bars per chart" — [Twenty docs, Widgets](https://docs.twenty.com/user-guide/dashboards/capabilities/widgets); pizza com até 100 fatias — `packages/twenty-front/src/modules/page-layout/widgets/graph/graph-widget-pie-chart/constants/PieChartMaximumNumberOfSlices.ts`.
- HubSpot: custom report builder só em Professional e Enterprise; relatório fora de tabela até 1.000 linhas únicas; eventos até 10 milhões (Pro) e 100 milhões (Enterprise) — [HubSpot KB, custom report builder](https://knowledge.hubspot.com/reports/create-reports-with-the-custom-report-builder).
- Attio: "Segmented by" e "Map" fora do Free; "Target" em Pro, Enterprise, Ultra — [Attio, Insight report](https://attio.com/help/reference/managing-your-data/dashboard-and-reports/set-up-an-insight-report.md).

**IA para criar gráfico**
- Twenty: ferramentas de dashboard para o chat de IA desde a v1.14.0 (2025-12-23, PR 16517) — [GitHub, twenty v1.14.0](https://github.com/twentyhq/twenty/releases/tag/v1.14.0). O esquema zod do servidor descreve cada campo para o agente (ex.: operadores válidos por tipo) — `packages/twenty-server/src/modules/dashboard/tools/schemas/widget.schema.ts`.
- HubSpot: "Create report with AI" gera relatório de 1 objeto a partir de uma frase; não cria relatório de vários objetos; página atualizada em 2026-05-29 — [HubSpot KB, Create reports using AI](https://knowledge.hubspot.com/reports/create-reports-using-ai). Gráfico feito na conversa do Breeze Assistant não vai para a biblioteca nem para dashboard — [HubSpot KB, Breeze Assistant](https://knowledge.hubspot.com/ai/generate-data-visualizations-with-breeze-assistant).
- Airtable: o Omni gera elemento de dashboard quando a página de dashboard está aberta; o elemento não vai para outro dashboard nem aparece no celular; não gasta crédito de IA — [Airtable, AI-generated interface elements](https://support.airtable.com/docs/ai-generated-interface-elements-in-airtable).
- Attio: o Ask Attio responde, resume, cria registros e fluxos; a ajuda não lista criação de gráfico — [Attio, Ask Attio](https://attio.com/help/reference/attio-ai/ask-attio).
- Salesforce: não achei fonte oficial de Agentforce criando relatório a partir de linguagem natural; o Agentforce Coworker responde perguntas sobre o CRM — [MarTech](https://martech.org/salesforce-bets-ai-agents-can-solve-business-leaders-struggles-with-data/).

**Queixas conhecidas**
- HubSpot: relatório entre objetos sem "this month" ou "this quarter" e sem data automática no dashboard — [HubSpot Community, ideia](https://community.hubspot.com/t5/HubSpot-Ideas/Dashboard-cannot-use-date-filter-when-using-cross-reporting/idc-p/469018); usuários chamam o relatório entre objetos de difícil e sem export — [HubSpot Community, Cross-Object Reporting](https://community.hubspot.com/t5/HubSpot-Ideas/Cross-Object-Reporting/idc-p/198329).
- Airtable: pedido de várias fontes no eixo Y — [Airtable Community](https://community.airtable.com/interface-designer-12/request-multiple-y-axis-data-sources-in-charts-39905); elemento ligado a 1 filtro só — [Airtable Community](https://community.airtable.com/t5/product-ideas/interface-elements-connected-to-multiple-filter-elements/m-p/138809).
- SmartSuite: pedidos de tabela dinâmica no dashboard e de melhorias urgentes no Chart View — [SmartSuite feedback, Pivot Table in Dashboards](https://feedback.smartsuite.com/feature-requests/p/pivot-table-in-dashboards); [SmartSuite feedback](https://feedback.smartsuite.com/feature-requests/p/urgent-improvements-needed-for-chart-view).
- Fibery: relatório que não aguenta volume grande — [Fibery Community](https://community.fibery.io/t/fibery-reports-cant-handle-large-data-sets/4683/8).
- Baserow: sem agrupar linha por data (post da equipe; melhorias previstas para 2026) — [Baserow Community](https://community.baserow.io/t/line-chart-doesnt-handle-date-fields/10886).

**Twenty: biblioteca, data e estado**
- `packages/twenty-front/package.json` declara `@nivo/core`, `@nivo/line` e `@nivo/pie` na versão `^0.99.0`; não há `@nivo/bar`. A barra tem motor próprio em `packages/twenty-front/src/modules/page-layout/widgets/graph/chart-core/` (escalas, eixos, grade) e `.../graph-widget-bar-chart/components/` (camadas base, hover, totais).
- Linha do tempo: v1.8.0 (2025-10-20) liga o gráfico de barras ao resolver de groupBy; v1.10.0 (2025-11-04) "Add Dashboard in Lab"; v1.11.0 (2025-11-14) feature flag "dashboards v2"; v1.12.0 (2025-12-01) drill-down no clique; v1.14.0 (2025-12-23) IA e filtro de data relativa; v1.16.0 (2026-01-24) subcampo de agrupamento no esquema de IA; v2.3.0 (2026-05-14) gauge removido — [GitHub, releases do twentyhq/twenty](https://github.com/twentyhq/twenty/releases).
- O widget de tabela de registros (RECORD_TABLE) ganhou migração com carimbo `1774072000000` (por volta de 2026-03-21) — `packages/twenty-server/src/database/typeorm/core/legacy-typeorm-migrations-do-not-add/common/1774072000000-addRecordTableWidgetType.ts`.
- Docs: [Overview](https://docs.twenty.com/user-guide/dashboards/overview), [Dashboards](https://docs.twenty.com/user-guide/dashboards/capabilities/dashboards), [Widgets](https://docs.twenty.com/user-guide/dashboards/capabilities/widgets), [FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq).
- Ainda faltam (FAQ, novembro de 2026): filtro do dashboard, dashboard privado, export e fuso por dashboard — [Twenty docs, FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq).

### Inferences
- O ENSPACE ganha diferencial com o filtro de dashboard inteiro que alcança widgets de categorias diferentes pelo campo comum (data, responsável): é a queixa recorrente em Twenty, Airtable e HubSpot.
- Drill-down em painel lateral (Airtable, SmartSuite) mantém o contexto do dashboard; o Twenty troca de página. Para o ENSPACE, a visualização rápida do item já existe e serve de destino.
- O teto de exibição (100 barras no Twenty, 100 valores no HubSpot, "Others" no NocoDB) mostra que todos limitam a cardinalidade; o ENSPACE precisa de regra igual com aviso na tela.

### Gaps
- Twenty: não achei data oficial em que os dashboards saíram do Lab nem limite por plano da nuvem.
- Salesforce: não confirmei por fonte oficial atual o limite de componentes (20 ou 25), a atualização agendada nem o drill-down.
- Número com comparação ao período anterior: só o nome de arquivo do Twenty sugere; nenhum produto documenta nas fontes lidas.
- Coda e Fibery: não achei documentação oficial de gráficos; Fibery entra só com posts de fórum.

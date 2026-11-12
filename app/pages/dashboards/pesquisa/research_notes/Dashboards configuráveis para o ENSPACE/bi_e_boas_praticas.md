# BI self-service, construtores de gráfico e boas práticas de dashboard

Notas de pesquisa para a recomendação de dashboards configuráveis do ENSPACE (usuário de negócio: jurídico, financeiro, operações). Comportamento de produto conferido nas docs oficiais em 2026-11-11; fontes acadêmicas e de princípio podem ser mais antigas. Rótulos de interface ficam no idioma original, entre aspas.

## 1. Modelo mental do construtor: medida x dimensão, frase ou poços

### Takeaway
Os produtos convergem para o mesmo par: uma agregação ("Count of rows", "Sum of ...") e um agrupamento ("by ..."). O Metabase expõe isso como frase ("Summarize ... by ..."); Power BI, Looker Studio e Superset expõem como poços ou painéis (eixo, legenda, valores; dimensão, métrica, breakdown). Nenhuma fonte encontrada compara os 2 modelos com usuário não analista; a evidência indireta favorece defaults automáticos sobre especificação manual na exploração inicial.

### Cited Findings
- Metabase: o passo "Summarize" escolhe 1 ou mais métricas e, opcionalmente, agrupa por 1 ou mais colunas; dá para encadear outro passo de resumo depois — [Metabase, Summarizing and grouping](https://www.metabase.com/docs/latest/questions/query-builder/summarizing-and-grouping)
- Métricas do Metabase: "Count of rows", "Sum of …", "Average of …", "Number of distinct values of…", "Cumulative sum of…", "Cumulative count of rows", "Standard deviation of …", "Minimum of …", "Maximum of …"; métricas definidas pelo admin aparecem em "Metrics" ou "Measures"; existe expressão customizada — [Metabase, Summarizing and grouping](https://www.metabase.com/docs/latest/questions/query-builder/summarizing-and-grouping)
- Agrupamento no Metabase: clicar outra coluna troca o agrupamento; o "+" adiciona outro; o "X" remove. Em data, o texto "by month" troca a unidade (hora, dia, semana, trimestre, ano), e a mesma data pode entrar em 2 granularidades (semana e dia da semana) — [Metabase, Summarizing and grouping](https://www.metabase.com/docs/latest/questions/query-builder/summarizing-and-grouping)
- Número no Metabase vira faixa automaticamente ("binning"); o usuário escolhe a quantidade de faixas de mesma largura, mas não define faixa customizada; faixa vazia some — [Metabase, Summarizing and grouping](https://www.metabase.com/docs/latest/questions/query-builder/summarizing-and-grouping)
- Depois do agrupamento, o Metabase escolhe o gráfico pela coluna de agrupamento (data gera linha); o resultado agregado mostra até 10.000 linhas por padrão — [Metabase, Summarizing and grouping](https://www.metabase.com/docs/latest/questions/query-builder/summarizing-and-grouping)
- Looker Studio: a 1ª dimensão do gráfico é a primária; as seguintes são "breakdown dimensions", que dividem a métrica em grupos mais finos; opções de ordenação e cor só aparecem com breakdown — [Looker Studio, Bar chart and column chart reference](https://support.google.com/looker-studio/answer/7165560) (lido pelo resumo da busca)
- Looker Studio: no gráfico de linha, com breakdown, o gráfico fica limitado a 1 métrica — [Looker Studio, Line chart and combo chart reference](https://docs.cloud.google.com/looker/docs/studio/line-chart-and-combo-chart-reference) (lido pelo resumo da busca)
- Superset: "Explore" é o construtor sem código; o "Time Grain" só aparece quando uma coluna temporal está no eixo X; métricas usam funções de agregação e podem ser certificadas — [Superset, Exploring data](https://superset.apache.org/user-docs/using-superset/exploring-data); [Preset, Chart Builder](https://docs.preset.io/using-preset-explore)
- Retool: o Chart antigo tem as transformações "Group by" e "Aggregation" (count, sum, avg) e está marcado como legado; os charts v2 oferecem group by em barra, bolha, funil, linha, dispersão e cascata — [Retool, Legacy charts](https://docs.retool.com/apps/guides/data/legacy/charts); [Retool, Charts v2](https://docs.retool.com/apps/guides/data/charts-v2)
- Power BI: o guia de escolha de visual pede que se considere tipo de dado (categórico, numérico, temporal, geográfico), objetivo, público e espaço disponível — [Power BI, Overview of visualizations](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview)
- Power BI oferece "Visual calculations" para total acumulado, média móvel, percentual do total e ranking "sem precisar entender filter context" — [Power BI, Overview of visualizations](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview)
- Voyager (TVCG 2016) comparou recomendação automática com especificação manual (PoleStar, modelado no Tableau): Voyager amplia a cobertura de variáveis na exploração inicial; PoleStar é melhor para pergunta específica — [Tableau Research, Voyager](https://tableau.com/research/publications/voyager-exploratory-analysis-faceted-browsing-visualization-recommendations)
- Voyager 2 (CHI 2017): mais cobertura de campos e notas mais altas em exploração aberta; em pergunta dirigida, notas equivalentes às do PoleStar — [Wongsuphasawat et al., Voyager 2](https://faculty.washington.edu/billhowe/publications/pdfs/wongsuphasawat17voyager2.pdf)
- Show Me (Mackinlay, Hanrahan e Stolte, 2007): a contribuição declarada é a experiência de uso da apresentação automática; a única evidência de uso citada é o log de clientes comerciais, sem experimento controlado — [Tableau, Show Me whitepaper](https://www.tableau.com/whitepapers/show-me-automatic-presentation-visual-analysis)
- Metabot: cria gráfico a partir de linguagem natural usando o próprio query builder; se já existe pergunta parecida, aponta para ela em vez de criar outra; o gráfico criado pode ir para um dashboard — [Metabase, Metabot](https://www.metabase.com/docs/latest/ai/metabot)
- Metabot verifica só as 100 primeiras tabelas do banco quando a pergunta não cita a tabela, e a doc diz que ele "is still learning the query builder" — [Metabase, Metabot](https://www.metabase.com/docs/latest/ai/metabot)

### Inferences
- A frase do Metabase ("Count of rows by Status") mapeia direto para o modelo do ENSPACE: categoria = tabela; campo número ou moeda = alvo de "Sum/Average"; select, multi-select, usuário, relação e data = agrupamento. "Contagem de itens" deve ser o default, porque não exige escolher campo.
- O poço (eixo, legenda, valores) exige que a pessoa saiba o que é dimensão e medida antes de começar; a frase deixa o conceito implícito. Para jurídico e financeiro, a frase parece mais aprendível, mas é inferência: nenhum estudo encontrado mede isso.
- Os estudos Voyager sugerem o desenho: recomendação automática para começar e edição manual para refinar.
- Multi-select pede regra explícita (o item conta em cada opção marcada, e a soma das barras passa do total). Nenhum produto pesquisado documenta isso com essas palavras.

### Gaps
- Nenhum estudo com usuário não analista compara construtor em frase com construtor de poços. Os estudos Voyager usaram participantes de análise exploratória, não usuário de negócio.
- A doc do Hex sobre chart cell devolveu 404; o modelo do Hex ficou sem fonte.
- A cor verde (dimensão) e azul (métrica) dos campos no Looker Studio não foi confirmada em doc oficial.
- O nome atual dos poços do Power BI ("X-axis", "Y-axis", "Legend", "Small multiples", "Tooltips") não apareceu nas páginas lidas.

## 2. Recomendação de tipo de gráfico a partir do tipo de campo

### Takeaway
Show Me, Voyager, Draco e o Metabase seguem a mesma lógica: data com medida vira linha; categoria com medida vira barra; valor único vira número grande; número no eixo vira histograma. Pizza só para poucas fatias. O Metabase mostra primeiro os gráficos que cabem no resultado e põe o resto em "More charts".

### Cited Findings
- Tableau Show Me avalia os campos selecionados e contorna em laranja o tipo sugerido; o hover mostra os requisitos mínimos de cada tipo — [Tableau, Show Me](https://help.tableau.com/current/pro/desktop/en-us/buildauto_showme.htm)
- Tableau: data com medida gera sugestão de linha ("Because a date dimension and a measure are selected, Tableau suggests you build a line view"); desde a versão 25.2, escolher um tipo e clicar em "Choose for me" monta a vista a partir dos campos — [Tableau, Show Me](https://help.tableau.com/current/pro/desktop/en-us/buildauto_showme.htm)
- Draco formaliza conhecimento de design de visualização como restrições "hard" e "soft" (Answer Set Programming, solver Clingo); os pesos das restrições "soft" são aprendidos de experimentos de percepção e deram sugestões melhores que o modelo ajustado à mão — [UW IDL, Draco](https://idl.uw.edu/papers/draco); [Moritz et al., NSF PAR](https://par.nsf.gov/servlets/purl/10074159)
- Metabase, por forma do dado: valor único = "Number"; mudança entre 2 períodos = "Trend"; tempo = "Line"; categoria = "Bar"; categoria com muitos valores = "Row"; eixo numérico = "Histogram"; parte do todo com poucas fatias = "Pie/donut"; 1 registro = "Detail"; lista = "Table"; cruzamento = "Pivot table"; etapas = "Funnel"; número contra meta = "Gauge" ou "Progress bar"; distribuição = "Box plot"; 2 escalas = "Combo" — [Metabase, Visualizing results](https://www.metabase.com/docs/latest/questions/visualizations/visualizing-results)
- No query builder, o Metabase escolhe o gráfico ao clicar em "Visualize"; no seletor "Visualization", os gráficos que cabem aparecem primeiro e os outros ficam em "More charts" — [Metabase, Visualizing results](https://www.metabase.com/docs/latest/questions/visualizations/visualizing-results)
- Power BI: coluna para comparação no tempo; barra quando o nome da categoria é longo; linha para tendência com eixo X contínuo; pizza e rosca só com poucas categorias; card para 1 número; KPI para progresso até a meta — [Power BI, Overview of visualizations](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview)
- NN/g: barra é confiável para comparação, sobretudo ordenada; linha e dispersão usam posição 2D para tendência e relação — [NN/g, Dashboards: Making Charts and Graphs Easier to Understand](https://www.nngroup.com/articles/dashboards-preattentive/)

### Inferences
Tabela de default proposta para o ENSPACE, derivada das fontes acima:

| Configuração | Gráfico sugerido | Alternativas no seletor |
|---|---|---|
| Só agregação (contagem, soma de moeda) | Número grande (KPI) | Número com comparação ao período anterior; progresso contra meta |
| 1 select, usuário ou relação | Barra horizontal ordenada pelo valor | Coluna; pizza só com até ~5 opções; tabela |
| 1 data | Linha (ou coluna, se poucos períodos), agrupada por mês | Área; tabela |
| Data x select | Linha com 1 série por opção, ou coluna empilhada | Small multiples; tabela dinâmica |
| Select x select | Barra empilhada ou agrupada | Tabela dinâmica (mapa de calor) |
| Número ou moeda sem agregação (distribuição) | Histograma | Box plot |
| Status com ordem (etapas do fluxo) | Funil ou barra na ordem das etapas | Barra |

- O limite de "~5 fatias" para pizza é inferência: Metabase e Power BI só dizem "small number".
- Multi-select e relação N:N precisam de aviso no gráfico de parte do todo, porque a soma das fatias passa de 100%.

### Gaps
- Os requisitos mínimos de cada tipo no Show Me (quantas dimensões e medidas) não estão na página lida; o artigo de 2007 tem a tabela, mas o PDF não foi aberto.
- Os pesos aprendidos do Draco e as regras concretas não foram lidos no texto completo.
- Nenhuma fonte oficial lida dá número máximo de fatias de pizza.

## 3. Interação no nível do dashboard: filtro global, ligação filtro-card, cross-filter, drill

### Takeaway
O padrão maduro tem 3 peças: filtro do dashboard ligado campo a campo a cada card (com auto-ligação quando o campo se repete); clique no gráfico que atualiza um filtro do dashboard (cross-filter); e drill-through até a lista de registros. O Power BI faz cross-filter por padrão em todos os visuais e deixa o editor trocar por card ("Filter", "Highlight", "None").

### Cited Findings
- Tipos de filtro do Metabase: data, localização, ID, número, texto ou categoria e booleano; "Time grouping" é parâmetro que muda o agrupamento, não as linhas — [Metabase, Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters)
- Opções do filtro de data no Metabase: "Month and Year", "Quarter and Year", "Single Date", "Date Range", "Relative Date" e "All Options" — [Metabase, Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters)
- No Metabase, o filtro fica no dashboard, num card de título ou num card de pergunta; para cada card, o editor escolhe no menu do card qual campo o filtro controla, e card sem campo compatível não se liga — [Metabase, Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters)
- Auto-ligação no Metabase: se outros cards têm o mesmo campo, ele oferece ligar todos, inclusive em outras abas, e liga sozinho os cards adicionados depois; o "X" ao lado do campo desfaz — [Metabase, Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters)
- Metabase: "Default value" define o valor inicial; "Always require a value" torna o filtro obrigatório; "Auto-apply filters" desligado exige clicar em "Apply"; trocar o tipo do filtro desliga todos os cards; o filtro ativo vale só para a sessão de quem vê — [Metabase, Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters)
- Metabase: o filtro só aparece quando ligado a algum card da aba atual; com menos de 100 valores distintos o campo vira caixa de busca, acima disso vira campo de digitar — [Metabase, Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters)
- Click behavior do Metabase: perguntas do query builder abrem um menu de drill-through ao clicar no gráfico (pergunta SQL não tem); o editor pode trocar por "Go to a custom destination" (outro dashboard, pergunta salva ou URL com variável como `{{Category}}`) ou por "Update a dashboard filter", que faz o cross-filter e mantém o card clicado sem mudança — [Metabase, Interactive dashboards](https://www.metabase.com/docs/latest/dashboards/interactive)
- Power BI: por padrão os visuais da página fazem cross-filter e cross-highlight entre si; o editor usa "Edit interactions" e escolhe, para cada par de visuais, "Filter", "Highlight" ou "None"; linha, dispersão e mapa só aceitam filter — [Power BI, Change how visuals interact](https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions)
- Power BI: drill num visual não afeta os outros por padrão; "Drilling filters other visuals" (serviço) ou "Apply drill down filters to" > "Entire page" (Desktop) muda isso; quem só tem "Reading view" não altera as interações — [Power BI, Change how visuals interact](https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions)
- Power BI: filtro no painel "Filters" em 3 níveis (visual, página, relatório); slicers em botão, lista, dropdown e intervalo de datas ficam na tela — [Power BI, Overview of visualizations](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview)
- Metabase "Trend" mostra a mudança de período a período; "Number" aceita prefixo, sufixo, casas decimais, multiplicador e "Conditional colors" por faixa de valor — [Metabase, Numbers](https://www.metabase.com/docs/latest/questions/visualizations/numbers)
- Atualização automática do Metabase: ícone de relógio com 1, 5, 10, 15, 30 e 60 minutos; a doc avisa que cada atualização roda de novo todas as consultas do dashboard — [Metabase, Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction)
- Superset: todo gráfico precisa de pelo menos 1 filtro de tempo; o padrão é "No Filter" — [Preset, Chart Builder](https://docs.preset.io/using-preset-explore) (lido pelo resumo da busca)
- Carbon: em dashboard de exploração, filtro e zoom se aplicam aos gráficos relacionados, que se atualizam juntos — [Carbon, Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)

### Inferences
- Para o ENSPACE, o filtro de período global é o 1º filtro de todo dashboard, ligado sozinho ao campo de data padrão de cada categoria (data de criação, quando a pessoa não escolhe outro).
- A ligação filtro-card tem de ser visível no modo de edição (o card mostra qual campo o filtro usa) e automática quando a categoria é a mesma, como o auto-connect do Metabase.
- Drill-through até os registros é o ponto que mais combina com o ENSPACE: o clique na barra abre a tela de itens da categoria com o filtro aplicado. Isso aproveita a listagem que o produto já tem.
- Cross-filter no clique pode ser um 2º passo; o Power BI o liga por padrão, e o Metabase pede configuração.

### Gaps
- A doc de cross-filtering do Looker Studio não abriu (redirecionamentos e 404); o comportamento dele ficou sem fonte.
- Os nomes das opções do menu de drill-through do Metabase ("See these records", "Break out by", "Zoom in") não aparecem na página lida.
- As opções de comparação do "Trend" do Metabase ("Compare to" período anterior, valor, meta) não foram confirmadas; a página de "Trend" não foi lida.
- "Linked filters" do Metabase (um filtro limita as opções de outro) não foram detalhados.

## 4. Layout: grade, tamanho de card, modo de edição, celular

### Takeaway
O Metabase usa grade com encaixe, largura fixa ou total, abas, cards de título e texto, e 3 seções prontas de KPI. A largura de 24 colunas e os tamanhos padrão de card vêm de fonte secundária. Modo de edição e de visualização são separados por um ícone de lápis.

### Cited Findings
- Metabase: os cards encaixam na grade ao mover e redimensionar, e os vizinhos abrem espaço; o padrão é "Fixed width", centralizado, com a alternativa "Full width" — [Metabase, Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction)
- Metabase: o lápis abre o modo de edição (duplicar, mover entre abas, remover, trocar card, adicionar seção ou texto); fora da edição, clicar no título do card abre a consulta dele — [Metabase, Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction)
- Metabase: o card "Heading" ocupa a largura toda; o card "Text" aceita Markdown — [Metabase, Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction)
- Seções prontas do Metabase: "KPI Grid", "Large chart with KPIs to the right" e "KPIs with large chart below", com espaços já arrumados; espaço vazio aparece como card em branco — [Metabase, Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction)
- Metabase: tela cheia pelo ícone ou pela palavra `fullscreen` na URL; `refresh`, `fullscreen` e `theme` vão depois do `#` — [Metabase, Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction)
- A largura do dashboard do Metabase é de 24 pontos de grade, e o modo largo mantém os 24 pontos e só aumenta os cards — [fórum do Metabase](https://discourse.metabase.com/t/is-it-possible-to-increase-the-dashboard-canvas-width/314913) (fonte secundária)
- Tamanho de tabela no Metabase: mínimo 4x3 e padrão 12x9 pontos de grade, segundo um commit espelhado — [espelho do código do Metabase](https://code.umd.edu/eds/metabase/-/commit/aea2cb22dcfb84c2cfb2c53e3546cde1a748c666) (não abriu: pede login; dado do resumo da busca)
- Carbon: o dado mais importante tem o maior contraste e a maior área; o conteúdo-chave vai no topo, em leitura em F; todos os gráficos usam o mesmo layout e espaçamento, com a legenda sempre na mesma posição — [Carbon, Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)
- Carbon: a cor de cada conjunto de dados é a mesma no dashboard todo; o espaço em branco agrupa ou separa elementos para marcar prioridade — [Carbon, Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)

### Inferences
- Para usuário de negócio, tamanhos prontos (pequeno, médio, largo, inteiro) sobre uma grade de 12 ou 24 colunas reduzem decisões; o redimensionamento livre fica no modo de edição.
- As seções prontas do Metabase ("KPI Grid" e variações) são o modelo para "comece por uma sugestão": a pessoa escolhe a forma, depois preenche cada espaço.
- No celular, o comportamento comum é empilhar os cards em 1 coluna na ordem da grade; é inferência, sem fonte lida.

### Gaps
- Nenhuma doc oficial lida confirma o número de colunas do Metabase, os tamanhos padrão por tipo de gráfico ou o comportamento no celular.
- Grades de Looker Studio, Power BI, Material 3, Atlassian e Salesforce Lightning não foram pesquisadas; a página de charting do Lightning devolveu 404.

## 5. Estado vazio, primeira execução, modelos e explicação do número

### Takeaway
A primeira execução madura gera um dashboard sozinho a partir do esquema (X-rays do Metabase) e deixa salvar. O Metabot cria gráfico a partir de pergunta em texto. Para explicar o número, as fontes oferecem tooltip padrão com os valores do ponto, texto livre no dashboard e anotação.

### Cited Findings
- X-rays do Metabase: gráficos e resumos gerados a partir dos tipos de campo de uma tabela, modelo ou ponto do gráfico; aparecem em "Automatic insights" (clique num ponto), no raio da tabela em "Browse Data", em "X-ray this" no modelo e na referência de dados — [Metabase, X-rays](https://www.metabase.com/docs/latest/exploration-and-organization/x-rays)
- No X-ray, "Zoom out" sobe para a tabela, "Zoom in" detalha um campo, "Related" sugere dado vizinho; "Save this" grava como dashboard na coleção "Automatically generated dashboards"; o admin desliga em "Enable X-ray features" — [Metabase, X-rays](https://www.metabase.com/docs/latest/exploration-and-organization/x-rays)
- Metabot pode oferecer ao admin exploração de banco recém-conectado — [Metabase, X-rays](https://www.metabase.com/docs/latest/exploration-and-organization/x-rays)
- Os recursos de IA do Metabase chegaram à edição open source no Metabase 60 (abril de 2026), e o Metabase 61 trouxe governança de IA e dashboards como código (YAML no git) — [Metabase, blog de 2026-06-09](https://www.metabase.com/blog/ai-for-everyone-with-confidence); [Metabase 61](https://www.metabase.com/releases/metabase-61) (lido pelo resumo da busca)
- Power BI: o tooltip mostra por padrão os valores do ponto e aceita campos extras; "Smart narrative" escreve texto com tendências e principais conclusões; "Anomaly detection" marca picos e quedas na linha — [Power BI, Overview of visualizations](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview)
- Carbon: anotação marca tendência, média, pico e vale, sem cobrir o dado — [Carbon, Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)
- Metabase: o card "Text" com Markdown serve para explicar o painel — [Metabase, Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction)

### Inferences
- O equivalente ao X-ray no ENSPACE: ao escolher uma categoria, o produto propõe um dashboard inicial pelos campos dela (contagem total, contagem por status, criados por mês, soma do campo moeda, itens por responsável).
- Cada card precisa dizer, sem hover, o que conta: categoria, agregação, campo e filtros ("Contratos ativos: soma do Valor, criados nos últimos 30 dias"). A frase do construtor pode virar o subtítulo do card.
- Estado vazio de card ("nenhum item no período") deve ser diferente de erro e de carregamento.

### Gaps
- Não foram lidas as páginas de estado vazio e carregamento do Carbon, nem guias de primeira execução de Looker Studio ou Power BI.
- Não há fonte lida sobre modelos prontos ("templates") de dashboard por área de negócio.

## 6. Boas práticas de pesquisa: NN/g, Few, design systems, acessibilidade, formato de número

### Takeaway
NN/g e Few definem o dashboard como 1 tela de leitura rápida: posição e comprimento para quantidade, cor só como reforço, nada de pizza na maioria dos casos, nada de 3D. WCAG pede contraste de 3:1 para barras, linhas e fatias, informação que não depende só de cor e alternativa em texto ou tabela. Em pt-BR, `Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})` produz ponto no milhar e vírgula no decimal.

### Cited Findings
- NN/g (Page Laubheimer, 2017-06-18): dashboard é a coleção de visualizações em 1 tela para informação de relance, focada em comunicar o crítico, sem exploração aberta — [NN/g](https://www.nngroup.com/articles/dashboards-preattentive/)
- NN/g separa dashboard operacional (dado que muda sempre, decisão urgente) de analítico (tendência para análise depois, como vendas do dia) — [NN/g](https://www.nngroup.com/articles/dashboards-preattentive/)
- NN/g: comprimento e posição 2D são os atributos pré-atentivos mais fortes para quantidade; área e ângulo são mais difíceis de comparar; cor não indica ordem nem magnitude — [NN/g](https://www.nngroup.com/articles/dashboards-preattentive/)
- NN/g: evitar pizza e rosca "most of the time", salvo diferença extrema de participação; treemap "not appropriate for simple, actionable dashboards"; gauge e radar ocupam espaço e usam ângulo, e o bullet chart linear comunica melhor; 3D distorce forma e área — [NN/g](https://www.nngroup.com/articles/dashboards-preattentive/)
- NN/g: forma, borda e proximidade são as pistas primárias de categoria; cor é secundária; até 4,5% da população tem alguma forma de daltonismo — [NN/g](https://www.nngroup.com/articles/dashboards-preattentive/)
- Stephen Few põe "Exceeding the boundaries of a single screen" como o 1º dos 13 erros comuns de design de dashboard (cap. 3 de "Information Dashboard Design"): o dashboard cabe em 1 tela, sem rolagem — [The Data School, resumo dos 13 erros](https://www.thedataschool.co.uk/anh-vu/are-you-making-these-13-dashboard-design-mistakes/); [Few, Why Most Dashboards Fail](https://blogs.ischool.berkeley.edu/i247s13/files/2013/02/WhyMostDashboardsFail.pdf) (fontes secundárias e cópia de curso)
- Carbon: limitar a quantidade de métricas; o que não é essencial aparece sob demanda; não trocar sistema de unidade no mesmo dashboard — [Carbon, Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)
- WCAG 1.4.11 (AA): objeto gráfico necessário para entender o conteúdo tem contraste de 3:1 com a cor vizinha, o que inclui barras, linhas, fatias e marcadores — [Deque, 1.4.11 Non-text Contrast](https://dequeuniversity.com/resources/wcag2.1/1.4.11-non-text-contrast); [DAISY, Non-text contrast](https://kb.daisy.org/publishing/docs/wcag/non-text-contrast.html)
- WCAG 1.4.1: cor não é o único meio de passar informação, o que leva a padrão e forma como codificação extra; 1.1.1 pede alternativa em texto, como resumo, tabela de dados ou os 2 — [Data Visualization Accessibility Checker](https://dvac.netlify.app/); [Deque, 1.4.11](https://dequeuniversity.com/resources/wcag2.1/1.4.11-non-text-contrast) (fontes secundárias; o texto do W3C não foi aberto)
- `Intl.NumberFormat` com `'pt-BR'` e `currency: 'BRL'` formata 1234567.89 como "R$ 1.234.567,89" — [MDN pt-BR, Intl.NumberFormat](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat); [DEV, Formatting currencies](https://dev.to/vitorfreitas/formatting-currencies-with-intl-numberformat-jhg)
- Power BI: tema do relatório aplica cores e fontes a todos os visuais; formatação condicional colore por valor, regra ou escala — [Power BI, Overview of visualizations](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview)

### Inferences
- O ENSPACE deve formatar pelo locale da pessoa: moeda pelo campo moeda, número compacto em KPI ("R$ 1,2 mi"), data em dd/mm/aaaa, e o mesmo formato no eixo, no tooltip e na tabela.
- A saída do ICU coloca um espaço sem quebra (U+00A0) entre "R$" e o número; teste que compara texto precisa considerar isso. Vem do conhecimento prévio, sem fonte lida nesta rodada.
- Todo gráfico do ENSPACE pode ter a alternativa "ver como tabela": cumpre a 1.1.1 e serve de drill para quem não lê gráfico.

### Gaps
- Material 3, Atlassian e Salesforce Lightning não foram lidos (Lightning devolveu 404; os outros ficaram sem tempo). A página de acessibilidade do Carbon devolveu 404.
- A lista completa dos 13 erros de Few não foi lida na fonte original; o PDF da Perceptual Edge baixou, mas a máquina não tem leitor de PDF.
- Nenhuma paleta segura para daltonismo foi conferida em fonte primária.

## 7. Anti-padrões

### Takeaway
As fontes concordam em 6 anti-padrões: dashboard que não cabe em 1 tela, excesso de métricas, pizza com muitas fatias, 3D, cor como magnitude e atualização que roda tudo de novo. Eixo duplo e agregação sem rótulo aparecem só como opção dos produtos, sem condenação explícita nas fontes lidas.

### Cited Findings
- Exceder 1 tela é o 1º dos 13 erros de Few; o que exige rolagem é lido como menos importante — [The Data School](https://www.thedataschool.co.uk/anh-vu/are-you-making-these-13-dashboard-design-mistakes/) (fonte secundária)
- Excesso de métricas: Carbon manda limitar e mostrar o não essencial sob demanda — [Carbon, Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)
- Pizza, rosca, gauge, radar, treemap e 3D: NN/g recomenda evitar no dashboard acionável — [NN/g](https://www.nngroup.com/articles/dashboards-preattentive/)
- Pizza e rosca só com poucas categorias — [Power BI, Overview of visualizations](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview); [Metabase, Visualizing results](https://www.metabase.com/docs/latest/questions/visualizations/visualizing-results)
- Cor pálida em fatia ou linha clara em fundo claro falha na 1.4.11 e deixa o dado ilegível — [Deque, 1.4.11](https://dequeuniversity.com/resources/wcag2.1/1.4.11-non-text-contrast)
- Eixo duplo: Power BI e Metabase oferecem combo com 2 escalas ("one or two Y axes"; "Combo" para 2 escalas), sem alerta de uso — [Power BI, Overview of visualizations](https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-visualizations-overview); [Metabase, Visualizing results](https://www.metabase.com/docs/latest/questions/visualizations/visualizing-results)
- Carga: cada atualização automática do Metabase roda de novo todas as consultas; "Auto-apply filters" desligado faz o dashboard esperar o "Apply" — [Metabase, Dashboards introduction](https://www.metabase.com/docs/latest/dashboards/introduction); [Metabase, Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters)

### Inferences
- No ENSPACE, os guarda-corpos podem ser automáticos: pizza só aparece como sugestão com até ~5 opções e agrupa o resto em "Outros"; não há 3D; combo de 2 eixos fica fora do MVP; o título do card nasce da frase da agregação, e nenhum número aparece sem dizer o que conta.
- "Carregando para sempre": cada card carrega sozinho, com estado próprio de carregamento, vazio e erro, para que 1 consulta lenta não trave o dashboard. É inferência; nenhuma fonte lida descreve esse padrão.

### Gaps
- Nenhuma fonte lida trata eixo duplo, agregação sem rótulo ou tempo de carga como anti-padrão com evidência.

## Respostas às 3 perguntas-chave

### Takeaway
1. Construtor aprendível: o modelo de frase do Metabase ("Count of rows by Status, by month") com gráfico escolhido sozinho; a evidência mais próxima é Voyager, que mostra ganho da recomendação automática na exploração inicial. 2. Conjunto mínimo: número (com comparação ao período anterior), barra, linha ou coluna no tempo, tabela, mais filtro de período global e drill até os registros. 3. Ligação: cada filtro do dashboard se liga a 1 campo por card, com auto-ligação pelo mesmo campo; o clique no gráfico atualiza o filtro (cross-filter) ou abre a lista de registros.

### Cited Findings
- Defaults que reduzem decisões no Metabase: gráfico escolhido pela coluna de agrupamento; data agrupada por mês ("by month"); número em faixas automáticas; seletor com os gráficos que cabem primeiro — [Metabase, Summarizing and grouping](https://www.metabase.com/docs/latest/questions/query-builder/summarizing-and-grouping); [Metabase, Visualizing results](https://www.metabase.com/docs/latest/questions/visualizations/visualizing-results)
- Recomendação automática amplia a exploração inicial; especificação manual vence em pergunta específica — [Tableau Research, Voyager](https://tableau.com/research/publications/voyager-exploratory-analysis-faceted-browsing-visualization-recommendations); [Voyager 2](https://faculty.washington.edu/billhowe/publications/pdfs/wongsuphasawat17voyager2.pdf)
- Ligação filtro-card, auto-connect, valor padrão, filtro obrigatório e "Update a dashboard filter" — [Metabase, Dashboard filters](https://www.metabase.com/docs/latest/dashboards/filters); [Metabase, Interactive dashboards](https://www.metabase.com/docs/latest/dashboards/interactive)
- Cross-filter por padrão e "Edit interactions" por par de visuais — [Power BI, Change how visuals interact](https://learn.microsoft.com/en-us/power-bi/create-reports/service-reports-visual-interactions)
- Bar, linha e posição são as codificações mais legíveis; pizza, gauge e 3D, as menos — [NN/g](https://www.nngroup.com/articles/dashboards-preattentive/)

### Inferences
Conjunto mínimo proposto para dashboard operacional do ENSPACE:
- Gráficos: número grande (KPI) com comparação ao período anterior; barra horizontal ordenada; coluna ou linha no tempo; barra empilhada para 2 agrupamentos; tabela; progresso contra meta. Pizza, funil e tabela dinâmica ficam como 2ª onda.
- Agregações: contagem de itens (padrão), soma, média, mínimo e máximo de número e moeda, e contagem de distintos.
- Agrupamentos: select, multi-select, usuário, relação e data (dia, semana, mês, trimestre, ano).
- Interações: filtro de período global com atalhos relativos; filtro por campo de select ou usuário ligado sozinho aos cards da mesma categoria; clique que abre os itens filtrados; atualização manual e automática com intervalo mínimo alto.
- Layout: grade com tamanhos prontos, modo de edição separado do de leitura e seções prontas (linha de KPIs e gráfico grande).

### Gaps
- Nenhum teste de usabilidade publicado com usuário de negócio não analista foi encontrado para nenhum dos produtos.
- O comportamento de Looker Studio, Hex e Material, Atlassian e Lightning ficou sem fonte primária nesta rodada.

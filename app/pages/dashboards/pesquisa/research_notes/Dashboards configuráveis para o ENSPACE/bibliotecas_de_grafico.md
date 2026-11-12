# Bibliotecas de gráfico e de grade de dashboard para o ENSPACE (Vue 3, Nuxt 4, Nuxt UI 4)

Estado levantado em 2026-11-11. Várias páginas de release do GitHub mostram dia e mês sem o ano; quando o ano é dedução pela sequência das versões, a nota diz.

## Qual biblioteca cobre melhor a lista de requisitos de um SaaS em Vue/Nuxt, com menos código próprio, e por quê?

### Takeaway
Apache ECharts 6 com vue-echarts 8 cobre a lista inteira (barra, linha, área, pizza, funil, gauge, heatmap, aria, decal, troca de tema em tempo de execução, SSR, tree-shaking) sem licença paga; é a escolha de Superset e a direção declarada da Metabase. Unovis (base do shadcn-vue e do nuxt-charts) é a opção mais alinhada visualmente ao Nuxt UI, mas cobre menos tipos e exige `<ClientOnly>`. Para a grade, gridstack.js 14 tem wrapper oficial de Vue e manutenção ativa; grid-layout-plus é a opção nativa de Vue, MIT, com v2 em beta.

### Cited Findings

**Apache ECharts + vue-echarts**
- Versões no GitHub: 5.6.0 em 28 dez; 6.0.0 em 30 jul; 6.1.0 em 19 mai, marcada como "Latest" (a página omite o ano; pela sequência, 5.6.0 em 2024, 6.0.0 em 2025 e 6.1.0 em 2026) — [GitHub apache/echarts releases](https://github.com/apache/echarts/releases)
- O ECharts 6 traz troca de tema em tempo de execução sem destruir e recriar a instância (`chart.setTheme('dark')`), um tema padrão novo baseado em design tokens e o arquivo `v5.js` para quem quer o visual antigo — [ECharts 6 New Features](https://echarts.apache.org/handbook/en/basics/release-note/v6-feature)
- O ECharts 6 traz tipos novos: chord, beeswarm, eixo quebrado, sistema de coordenadas em matriz e 6 séries custom oficiais (violino, contorno, rosca segmentada, faixa de barra, faixa de linha, estágio de sono) — [ECharts 6 New Features](https://echarts.apache.org/handbook/en/basics/release-note/v6-feature)
- A 5.6.0 acrescentou `role="img"` ao contêiner do gráfico e `aria.data.excludeDimensionId`; a 5.5.1 e a 5.6.0 corrigiram erros de aria e de interação no modo SSR — [GitHub apache/echarts releases](https://github.com/apache/echarts/releases)
- Tree-shaking: importa-se de `echarts/core`, `echarts/charts`, `echarts/components`, `echarts/features` e `echarts/renderers`, registra-se com `echarts.use([...])`; o build modular não traz renderizador, e é preciso importar `CanvasRenderer` ou `SVGRenderer`; `ComposeOption` restringe o tipo da opção aos módulos importados; o editor de exemplos gera o código tree-shakable ("Full Code") — [ECharts Handbook, Import](https://echarts.apache.org/handbook/en/basics/import)
- A Metabase (post de 2024-02-13) diz estar "incorporando o ECharts" e cita: animação automática na troca de dado, renderização em Canvas e SVG com SSR, mais de 20 tipos (incluindo heat map e funil), mapas por geoJSON, descrição gerada do gráfico e padrões decal para acessibilidade — [Metabase blog](https://www.metabase.com/blog/best-open-source-chart-library)
- O Superset adotou o ECharts como substituto do NVD3 (SIP-50); o post é de 2021 — [Preset blog](https://preset.io/blog/2021-4-1-why-echarts/)
- vue-echarts 8 removeu o suporte a Vue 2 (Vue 2 fica no 7) e a entrada `vue-echarts/csp`; versões 8.1.0, 8.2.0 e 8.3.0 corrigiram regressão do slot graphic, o bundle de CDN e a recuperação depois de falha ao atualizar opção ou tema — [newreleases 8.0.0](https://newreleases.io/project/npm/vue-echarts/release/8.0.0); [8.1.0](https://newreleases.io/project/npm/vue-echarts/release/8.1.0); [8.2.0](https://newreleases.io/project/npm/vue-echarts/release/8.2.0); [8.3.0](https://newreleases.io/project/npm/vue-echarts/release/8.3.0)

**ApexCharts + vue3-apexcharts**
- ApexCharts 6.0.0 saiu em 2026-07-17 (post de 2026-07-18): renderizador canvas "Strata" para séries densas (`chart.renderer: 'auto'` muda para canvas acima de `rendererThreshold`, padrão 8000 pontos); acima de 1000 pontos a transição vira um fade; cores por tokens `--apx-*` com o recurso "Facet" (`import 'apexcharts/features/facet'`), que pode seguir o tema do sistema; build enxuto por `apexcharts/core` + `apexcharts/features/*` — [ApexCharts 6.0 Is Here](https://apexcharts.com/blog/apexcharts-6-0-release/)
- O post da 6.0 não fala de SSR nem dá tamanho de bundle — [ApexCharts 6.0 Is Here](https://apexcharts.com/blog/apexcharts-6-0-release/)

**Chart.js + vue-chartjs**
- Versões no GitHub: 4.5.0 em 14 jun e 4.5.1 em 13 out; a mesma leitura cita uma 4.6.1 em 22 out como a mais recente (ano omitido, leitura não confirmada); nenhuma 5.x; 503 issues e 146 PRs abertos — [GitHub chartjs/Chart.js releases](https://github.com/chartjs/Chart.js/releases)

**Unovis, nuxt-charts e shadcn-vue**
- Unovis 1.6 saiu em 2025-08-14, com Treemap, Plotline, Plotband e Rolling Pin Legend — [Unovis releases 1.6](https://rokotyan.github.io/unovis/releases/1.6); [F5 community](https://community.f5.com/kb/technicalarticles/announcing-unovis-1-6/343143)
- @unovis/vue 1.6.2 publicada em 2025-11-11 — [Snyk @unovis/vue](https://security.snyk.io/package/npm/%40unovis%2Fvue/versions)
- Os gráficos do shadcn-vue são construídos sobre Unovis, inspirados no Tremor — [shadcn-vue Chart](https://shadcn-vue.com/docs/components/chart)
- nuxt-charts (pacote `vue-chrts`) é feito sobre Unovis, com Tailwind CSS e Nuxt UI, licença MIT, módulo Nuxt com auto-import; `@unovis/ts` e `@unovis/vue` são peer dependencies — [nuxtcharts.com](https://nuxtcharts.com/); [Instalação](https://nuxtcharts.com/docs/getting-started/installation)
- A v3 do nuxt-charts mudou APIs, e o mantenedor recomenda ficar na v2 para mapa, gantt e sankey — [dev.to, Why I'm building Nuxt Charts](https://dev.to/dennisadriaans/why-im-building-nuxt-charts-4dlj)
- Unovis precisa do DOM; num template Nuxt UI v4 com Unovis, os gráficos ficam em `<ClientOnly>` e pedem altura definida no contêiner — [Haze Nuxt docs](https://haze-nuxt.dashboardpack.com/docs/charts)

**AG Charts**
- Community sob MIT, gratuita em produção sem chave; Enterprise exige EULA comercial, por desenvolvedor, por implantação, perpétua com 1 ano de suporte — [AG Charts Community vs Enterprise](https://www.ag-grid.com/charts/vue/community-vs-enterprise/)
- Community: linha, barra, coluna, pizza, teclado e leitor de tela, temas, localização em 31 idiomas, API de eventos. Enterprise: mais de 20 tipos (incluindo heatmap e Sankey), animações, zoom, navigator, menu de contexto, crosshair, sincronia entre gráficos — [AG Charts Community vs Enterprise](https://www.ag-grid.com/charts/vue/community-vs-enterprise/)
- Existe o wrapper `ag-charts-vue3` na versão 13.2.1 — [jsDelivr ag-charts-vue3 13.2.1](https://cdn.jsdelivr.net/npm/ag-charts-vue3@13.2.1/README.md)

**Highcharts, amCharts 5, Plotly, D3**
- Highcharts 12 saiu em 2025-09-04; 12.5 com dendrograma em jan 2026; um revendedor lista a 13.0.0 em 2026-06-11 (dado de revendedor) — [Highcharts release highlights](https://www.highcharts.com/blog/?p=22224); [ComponentSource, dendrogram](https://www.componentsource.com/news/2026/01/22/visualize-hierarchies-dendrogram-charts); [ComponentSource releases](https://www.componentsource.com/product/highcharts/releases)
- amCharts 5, Chart.js e ECharts renderizam em canvas por padrão; Plotly.js 2.35.3 e D3 7.9.0 em SVG — [Auditoria da ApexCharts](https://apexcharts.com/blog/charting-library-accessibility-audit/)

**Quem usa o quê**
- Twenty CRM: `@nivo/core`, `@nivo/line` e `@nivo/pie` 0.99, `d3-shape` 3.2 e `react-grid-layout` 2.2.4 (React, fora do ecossistema Vue) — [package.json do twenty-front](https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-front/package.json)
- Dashboards do Twenty: Dashboards → Abas → Widgets; gráficos, números e iFrames; gauge ainda no roadmap; filtro por widget, sem filtro no nível do dashboard — [Twenty docs](https://docs.twenty.com/user-guide/dashboards/overview)
- Grafana usaria uPlot, segundo um comentário no Hacker News (fonte fraca, sem confirmação oficial) — [hn.svelte.dev](https://hn.svelte.dev/item/44794926)
- O template oficial de dashboard do Nuxt é feito com Nuxt UI v4; os templates pagos Apex Dashboard e Haze usam Unovis — [nuxt.com templates](https://nuxt.com/templates); [adminlte, Nuxt dashboards](https://adminlte.io/blog/nuxt-admin-dashboard-templates/)

**Grade de dashboard**
- gridstack.js: v13.0.0 (19 jul) trouxe wrapper novo de Vue no padrão do wrapper React; 13.3.0 (11 set) pausa antes de arrastar no celular para conviver com rolagem e desliga pointer events em iframes durante o arraste; 13.1.0 (23 jul) mantém a ordem do DOM igual à ordem visual, o que ajuda tab e impressão; 14.0.0 (21 set) acrescentou `cellHeight: 'fill'`; 14.1.0 (04 nov, "Latest") faz Esc restaurar o item arrastado para fora e ajusta auto-scroll no iOS. Ano omitido na página — [GitHub gridstack releases](https://github.com/gridstack/gridstack.js/releases)
- Documentação do wrapper Vue do gridstack na v13.1.2; integração com Vue 3 demonstrada no site oficial — [GridStack Vue Library](https://gridstackjs.com/vue/doc/html/index.html); [Demo Vue 3](https://gridstackjs.com/demo/vue3js.html)
- A página de releases do gridstack não descreve navegação completa por teclado — [GitHub gridstack releases](https://github.com/gridstack/gridstack.js/releases)
- grid-layout-plus: sucessor de vue-grid-layout para Vue 3, MIT, 624 estrelas, 80 forks, 7 issues e 1 PR abertos; arrastar, redimensionar, widget estático, serialização, RTL, responsivo; v2 em beta com modelo `Layout` controlado, composables headless e Core API sem DOM, com mudanças que quebram a v1 — [GitHub qmhc/grid-layout-plus](https://github.com/qmhc/grid-layout-plus)
- grid-layout-plus oferece breakpoints que mudam colunas e posições, sobreposição, altura automática, arraste entre grades e o composable `useGridLayout` — [Algolia docs grid-layout-plus](https://docsearch.algolia.com/mcp/docs/repo/qmhc/grid-layout-plus)

### Tabela comparativa (gráfico)

| Biblioteca | Versão recente | Licença | Render | Funil / gauge / heatmap | A11y padrão | Tema em tempo de execução | Wrapper Vue |
|---|---|---|---|---|---|---|---|
| ECharts | 6.1.0 | Apache 2.0 (ver Gaps) | Canvas ou SVG | sim / sim / sim | `role="img"`, `aria` e decal opcionais | `setTheme()` sem recriar | vue-echarts 8.3 |
| ApexCharts | 6.0.0 (2026-07-17) | Dual: grátis abaixo de US$ 2M de receita | SVG; canvas acima de 8000 pontos | ver Gaps | nome acessível e title/desc; `role="application"` | tokens `--apx-*` (Facet) | vue3-apexcharts |
| Chart.js | 4.5.1 (4.6.1 não confirmada) | ver Gaps | Canvas | por plugin | nada; plugins em beta | ver Gaps | vue-chartjs |
| Highcharts | 12.x / 13.0.0 | Comercial, por desenvolvedor | SVG | sim (módulos) | o mais completo com o módulo Accessibility | ver Gaps | highcharts-vue |
| amCharts 5 | 5.19.1 (auditoria) | Grátis com atribuição; SaaS pago | Canvas | ver Gaps | nada por padrão | ver Gaps | sem wrapper oficial confirmado |
| AG Charts | 13.2.1 | Community MIT; Enterprise pago | ver Gaps | heatmap só no Enterprise | teclado e leitor de tela no Community | temas | ag-charts-vue3 |
| Unovis / nuxt-charts | 1.6.x | ver Gaps / MIT | SVG e canvas | ver Gaps | ver Gaps | Tailwind e Nuxt UI | @unovis/vue, vue-chrts |
| Plotly.js | 2.35.3 (auditoria) | ver Gaps | SVG | ver Gaps | nada por padrão | ver Gaps | sem dado |

### Tabela comparativa (grade)

| Biblioteca | Versão | Licença | Vue 3 | Toque | Teclado | Breakpoints | Manutenção |
|---|---|---|---|---|---|---|---|
| gridstack.js | 14.1.0 | ver Gaps | wrapper oficial desde 13.0.0 | ajustes em 13.3, 14.0 e 14.1 | ordem do DOM e Esc; sem navegação completa | `columnWidth`, `breakpoints` | 10 releases entre abr e nov |
| grid-layout-plus | v1 estável, v2 beta | MIT | nativo (`<script setup>`, TS) | ver Gaps | ver Gaps | sim | 7 issues abertas; data do último commit não lida |
| vue-grid-layout | ver Gaps | ver Gaps | ver Gaps | ver Gaps | ver Gaps | ver Gaps | ver Gaps |

### Inferences
- ECharts 6 + vue-echarts 8 entrega mais itens da lista sem plugin nem licença: funil, gauge e heatmap nativos, aria com descrição gerada, decal para daltonismo, troca de tema sem recriar instância e tree-shaking documentado. Por isso a Metabase e o Superset, que têm o mesmo problema do ENSPACE (usuário monta gráfico sobre dado agregado), convergiram para ele.
- O ECharts em canvas não lê variável CSS sozinho: o tema precisa ser montado lendo `getComputedStyle` das variáveis do Nuxt UI (`--ui-primary`, `--ui-bg` etc.), registrado com `registerTheme` e trocado com `setTheme` quando o modo de cor muda. É uma camada fina (1 composable), mas é código próprio.
- O ApexCharts 6 resolve parte das queixas de desempenho com canvas acima de 8000 pontos e de tema com tokens CSS, mas a licença dual com teto de US$ 2M de receita e recursos Premium torna o custo dependente do porte da empresa; num SaaS em que o cliente monta o dashboard, é preciso confirmar com o fornecedor se o caso cai em Commercial ou em OEM.
- Unovis/nuxt-charts combina com o visual do Nuxt UI e do shadcn-vue, mas o catálogo é menor e a exigência de `<ClientOnly>` e de altura fixa casa mal com cartões redimensionáveis sem um `ResizeObserver`.
- Para a grade, o gridstack tem cadência de release maior e cuida de toque e iframe; o grid-layout-plus é mais idiomático em Vue e MIT, mas a v2 beta pede cautela até sair estável. O Twenty usa a origem React dessa família (`react-grid-layout`).
- Para cartão de dashboard redimensionável, qualquer biblioteca de gráfico precisa ouvir o tamanho do cartão (o vue-echarts tem `autoresize`; os demais pedem `ResizeObserver`), e muitos gráficos numa página pedem renderização preguiçosa (montar só o cartão visível).

### Gaps
- Licença do ECharts (Apache 2.0) e do Chart.js e do gridstack (MIT): conhecidas, mas não conferidas numa fonte primária nesta rodada.
- Locale pt-BR embutido no ECharts (`echarts/i18n/langPT-br`) e no ApexCharts (`locales/pt-br.json`): não conferidos nesta rodada.
- Tamanho de bundle de cada biblioteca (bundlephobia, pkg-size) e números do npmtrends: não levantados.
- Estrelas do GitHub do ECharts, Chart.js e gridstack: as páginas lidas não mostraram.
- Relatos de vazamento de memória e lentidão do ApexCharts com muitos gráficos por página: não achei issue citável nesta rodada.
- Vega-Lite e wrappers Vue, Plotly.js 3, LayerChart e visx para Vue: sem dado colhido.
- vue-grid-layout (jbaysolutions): sem dado colhido sobre a última versão; a leitura corrente é que só suporta Vue 2.
- Qual biblioteca o template oficial de dashboard do Nuxt UI usa: a fonte só diz que é feito com Nuxt UI v4.
- Qual biblioteca de gráfico o ENSPACE usa hoje: fora das fontes desta pesquisa.

## Quais são os termos de licença e os custos?

### Takeaway
ECharts, Chart.js, Unovis, nuxt-charts, AG Charts Community e grid-layout-plus são livres para SaaS fechado. ApexCharts é grátis só abaixo de US$ 2M de receita anual; Highcharts e amCharts 5 cobram por desenvolvedor no plano SaaS; AG Charts Enterprise cobra por desenvolvedor e é o que libera heatmap, zoom e animação.

### Cited Findings
- ApexCharts passou a licença dual na v5.0.0: Community grátis para organização com menos de US$ 2M de receita, orçamento ou captação anual; acima disso, Commercial paga — [ApexCharts, New Licensing Model](https://apexcharts.com/blog/new-licencing-model/); [ApexCharts Commercial License](https://apexcharts.com/license/commercial/)
- Na 6.0, 7 recursos (entre eles Storyboard, Linked Views e Ink) exigem Premium ou superior em qualquer porte de empresa — [ApexCharts 6.0 Is Here](https://apexcharts.com/blog/apexcharts-6-0-release/)
- Preços citados por terceiros para ApexCharts: US$ 199, 349 e 599 por desenvolvedor por ano; OEM para distribuir dentro de produto vendido a terceiros, cerca de US$ 14.999 por ano (fórum, não fonte oficial); licença comercial é assinatura de 12 meses com renovação automática; recurso premium sem chave aparece com marca d'água — [Fórum Inductive Automation](https://forum.inductiveautomation.com/t/musson-industrial%E2%80%99s-embr-charts-module/91618/280); [B4X forum](https://www.b4x.com/android/forum/threads/sithasodaisy5-apexchart-licensing-whats-next.171080/); [ApexCharts Commercial License](https://apexcharts.com/license/commercial/)
- Alguns projetos ficaram em versões anteriores à v5 por causa da mudança de licença — [Fórum Inductive Automation](https://forum.inductiveautomation.com/t/free-ignition-modules-and-resources-wiki-links-and-details/111081/6)
- Highcharts: o EULA público cobre só uso pessoal e educacional; uso interno de empresa exige licença comercial; desde jan 2025, site público passou para a licença SaaS — [Highcharts Shop EULA](https://shop.highcharts.com/license-eula); [ComponentSource, Highcharts license updates](https://www.componentsource.com/de/news/2025/01/06/ensure-compliance-highcharts-license-updates)
- Highcharts cobra 1 licença por desenvolvedor; SaaS para 1 aplicação, SaaS+ para 2 a 5; OEM sob consulta. Preços de revendedor: Dashboards SaaS perpétuo a partir de US$ 296,94, SaaS anual de 1 desenvolvedor US$ 258,72; oferta introdutória vencida em 2026-04-30 — [ComponentSource, Highcharts Dashboards prices](https://www.componentsource.com/product/highcharts-dashboards/prices); [ComponentSource, Grid Pro prices](https://www.componentsource.com/fr/product/highcharts-grid/prices?c=usd)
- amCharts 5: licença grátis com a mesma funcionalidade, mas com atribuição da amCharts em todo gráfico; licenças pagas por desenvolvedor, perpétuas para a versão maior; faixa SaaS (com login) listada a US$ 637,00 por desenvolvedor, com 12 meses de suporte (revendedor) — [ComponentSource, amCharts licensing](https://www.componentsource.com/license/amcharts); [ComponentSource, amCharts specification](https://www.componentsource.com/product/amcharts/specification); [ComponentSource, Stock Chart prices](https://www.componentsource.com/product/amcharts-stock-chart/prices?pf=new)
- AG Charts Community sob MIT, grátis em produção; Enterprise por desenvolvedor, por implantação, perpétua com 1 ano de suporte — [AG Charts Community vs Enterprise](https://www.ag-grid.com/charts/vue/community-vs-enterprise/)
- AG Charts Enterprise: US$ 399 por desenvolvedor, com preço de lançamento de US$ 199 (post sem data) — [AG Grid blog, Introducing AG Charts Enterprise](https://blog.ag-grid.com/introducing-ag-charts-enterprise/)
- nuxt-charts é MIT; o template de dashboard e os blocos premium são pagos — [nuxtcharts.com](https://nuxtcharts.com/)
- grid-layout-plus é MIT — [GitHub qmhc/grid-layout-plus](https://github.com/qmhc/grid-layout-plus)

### Inferences
- ECharts, Chart.js, Unovis e AG Charts Community têm custo zero de licença; o custo vira tempo de desenvolvimento (tema, acessibilidade, formatação).
- Para um SaaS fechado em que o cliente monta o próprio dashboard, Highcharts e ApexCharts têm o risco de o caso ser lido como OEM (o gráfico vira parte do produto entregue ao cliente), com preço sob consulta. A pergunta vai ao fornecedor antes de qualquer adoção.
- AG Charts Community não cobre heatmap nem zoom; quem precisa deles paga o Enterprise.

### Gaps
- Preço oficial atual de Highcharts, amCharts, AG Charts Enterprise e ApexCharts: só achei valores de revendedor ou de fórum, alguns vencidos.
- Se o plano SaaS do amCharts remove a atribuição: não confirmado.
- Licença do highcharts-vue (o wrapper): não achei fonte.

## Como cada uma lida com tema por variável CSS, modo escuro em tempo de execução, acessibilidade e locale pt-BR?

### Takeaway
Nenhuma biblioteca em canvas (ECharts, Chart.js, amCharts) lê variável CSS sozinha; ECharts 6 resolve o modo escuro com `setTheme()` sem recriar o gráfico, e ApexCharts 6 é a única entre as pesquisadas com tokens CSS próprios (`--apx-*`). Em acessibilidade, Highcharts com o módulo Accessibility é o mais completo; AG Charts Community traz teclado e leitor de tela; ECharts tem aria e decal opcionais; Chart.js deixa tudo ao desenvolvedor.

### Cited Findings
- ECharts 6: troca de tema em tempo de execução sem recriar a instância, com o exemplo que ouve `prefers-color-scheme` e chama `setTheme('dark')` ou `setTheme('default')` em cada gráfico; tema padrão baseado em design tokens — [ECharts 6 New Features](https://echarts.apache.org/handbook/en/basics/release-note/v6-feature)
- ECharts: com `aria` desligado, nem o rótulo nem o decal se aplicam; o decal existe desde a 5.0 — [busca, ECharts aria option](https://apache.googlesource.com/echarts-website/+/029572fcd96c14c29734987cd99df9f758718c1f/en/documents/option-parts/option.aria.json)
- ECharts: descrição gerada do gráfico e padrões decal como recursos de acessibilidade — [Metabase blog](https://www.metabase.com/blog/best-open-source-chart-library)
- ApexCharts 6: cores dos tokens `--apx-*` e opção de seguir o tema do sistema (Facet); as duas mudanças de animação padrão respeitam `prefers-reduced-motion` — [ApexCharts 6.0 Is Here](https://apexcharts.com/blog/apexcharts-6-0-release/)
- Auditoria publicada pela própria ApexCharts (conflito de interesse; byline 2026-01-21, versões resolvidas em 2026-07-04): gráfico de barras padrão, Playwright e axe-core, sem teste com leitor de tela. ApexCharts 5.16.0 e Highcharts 11.4.8 em SVG com nome acessível e title/desc; ApexCharts com `role="application"`, que o próprio texto chama de agressivo; Chart.js 4.5.1, ECharts 5.6.0 e amCharts 5.19.1 em canvas sem nome acessível nem tabela de dados; Plotly 2.35.3 e D3 7.9.0 em SVG sem nome acessível; só o Google Charts gera tabela de dados por padrão; todos com 0 violação do axe; AG Charts, Unovis e Vega fora do teste — [ApexCharts, accessibility audit](https://apexcharts.com/blog/charting-library-accessibility-audit/)
- Highcharts: o módulo Accessibility (opcional) acrescenta navegação por teclado, descrição para leitor de tela e exportação de tabela de dados — [ApexCharts, accessibility audit](https://apexcharts.com/blog/charting-library-accessibility-audit/)
- Chart.js: a documentação diz que cabe ao usuário criar o canvas de forma acessível; plugins de terceiros em estágio inicial ou beta (`chartjs-plugin-a11y`, `chartjs-plugin-a11y-legend`, `chartjs-plugin-accessible-data`, este só para barra e bolha) — [Chart.js Accessibility](https://www.chartjs.org/docs/latest/general/accessibility.html); [npm chartjs-plugin-a11y](https://www.npmjs.com/package/chartjs-plugin-a11y); [npm chartjs-plugin-a11y-legend](https://npmjs.com/package/chartjs-plugin-a11y-legend)
- AG Charts Community: navegação por teclado, leitor de tela, temas e localização em 31 idiomas — [AG Charts Community vs Enterprise](https://www.ag-grid.com/charts/vue/community-vs-enterprise/)
- nuxt-charts declara ser feito com Tailwind CSS e Nuxt UI — [nuxtcharts.com](https://nuxtcharts.com/)
- Unovis precisa do DOM e vai em `<ClientOnly>` no Nuxt — [Haze Nuxt docs](https://haze-nuxt.dashboardpack.com/docs/charts)
- ECharts tem renderização no servidor e correções de SSR na 5.5.1 e na 5.6.0 — [Metabase blog](https://www.metabase.com/blog/best-open-source-chart-library); [GitHub apache/echarts releases](https://github.com/apache/echarts/releases)

### Inferences
- Para o ENSPACE, o caminho com ECharts é 1 composable que lê as variáveis do Nuxt UI, monta o tema claro e o escuro, registra os 2 e chama `setTheme` quando o `useColorMode` muda. Os números em pt-BR, en e es saem de `Intl.NumberFormat` e `Intl.DateTimeFormat` nos `formatter` de eixo, rótulo e tooltip, que funciona igual em qualquer biblioteca.
- Para acessibilidade com ECharts, o mínimo é ligar `aria.enabled` e `aria.decal.show`, gerar um resumo em texto do gráfico e oferecer a tabela do dado agregado no cartão (o ENSPACE já tem o dado agregado da API). Teclado dentro do gráfico não vem pronto.
- O resultado de acessibilidade da auditoria mede só o padrão de fábrica e vem de um concorrente; não serve para descartar ECharts ou Highcharts, que têm o recurso opcional.

### Gaps
- Locale pt-BR do ECharts e do ApexCharts (textos da toolbox e meses): não conferido.
- Comportamento de AG Charts e Unovis com variável CSS em tempo de execução: as páginas lidas não detalham.
- Teste de leitor de tela (NVDA, VoiceOver) em qualquer biblioteca: nenhuma fonte desta rodada fez.

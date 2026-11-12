# Pesquisa: Dashboards configuráveis

A pesquisa inteira, com fonte em cada afirmação, está no relatório
[`pesquisa/reports/Dashboards configuráveis para o ENSPACE.md`](pesquisa/reports/Dashboards%20configuráveis%20para%20o%20ENSPACE.md).
As notas de cada frente ficam em `pesquisa/research_notes/Dashboards configuráveis para o ENSPACE/`:

| Nota | O que cobre |
|---|---|
| `enspace_hoje.md` | o ENSPACE hoje: tela do develop, en-docs e código |
| `work_management.md` | ClickUp, monday.com, Notion, Pipefy, Asana, Jira |
| `crm_e_bancos_nocode.md` | Twenty (pelo código), Attio, Airtable, HubSpot, Salesforce, Baserow, NocoDB, SmartSuite |
| `bi_e_boas_praticas.md` | Metabase, Looker Studio, Power BI, Tableau, Superset; NN/g, Stephen Few, WCAG |
| `bibliotecas_de_grafico.md` | ApexCharts, ECharts, Chart.js, Highcharts, amCharts, AG Charts, Unovis; gridstack e grid-layout-plus |

## As referências obrigatórias e as extras

- **Obrigatórias (5):** Notion, Twenty CRM, ClickUp, monday.com, Pipefy.
- **Extras do tipo de problema (relatório, painel, visualização):** Metabase, Looker Studio, Power BI, Tableau,
  Superset.
- **Extras de esquema livre:** Attio, Airtable, HubSpot, Salesforce, Baserow, NocoDB, SmartSuite, Asana, Jira.

Cada referência está descrita em passos no relatório (seção 3), com o que serve e o que não serve ao ENSPACE nas
seções 6 e 7.

**Sem print de referência nesta rodada:** a pesquisa leu documentação, ajuda oficial e o código aberto do Twenty. As
ajudas do ClickUp, do monday e do Asana devolveram HTTP 403; o texto citado delas vem do trecho que a busca devolveu.

## O padrão que todos seguem

Seção 4 do relatório. Em resumo:
- cartão sobre 1 fonte, e o dashboard junta cartões de fontes diferentes;
- 1 dimensão, 1 quebra e 1 medida; contagem como padrão;
- grade de 12 colunas com arrastar e redimensionar;
- configuração em painel lateral com prévia, nunca modal sobre modal;
- teto de grupos declarado na tela;
- clique até os registros.

## O que nenhum deles faz

Seção 5 do relatório. Em resumo:
- filtro do dashboard com E/OU que alcança categorias diferentes pelo campo comum;
- relação como dimensão com drill-down;
- fórmula e campo virtual como medida desde o 1º dia;
- aviso no próprio cartão quando a múltipla seleção faz a soma passar do total;
- aviso na tela de que o número depende de quem vê;
- drill-down até a listagem real e editável da categoria, com o recorte aplicado;
- cartão com subtítulo que diz o que conta, nascido da configuração.

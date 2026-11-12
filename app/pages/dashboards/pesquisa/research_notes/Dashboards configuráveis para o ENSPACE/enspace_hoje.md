# O dashboard do ENSPACE hoje: tela, doc e código

Levantado em 2026-11-11 no develop (workspace de exploração), na doc pública (en-docs) e na leitura do código
(front `en-space@develop e3a6cd15a`, back `enlighten-api@develop 5587592e8`, SDK `en-sdk@develop e516c7a`). O código
diz o que está escrito na develop; o que está no ar foi conferido na tela. Prints em `app/pages/dashboards/evidencias/`.

## Takeaway

O dashboard do ENSPACE é uma tela do tipo **Painéis** que a pessoa cria em Configurações > Interface > Telas e só
aparece para os membros depois de entrar num menu. Cada painel é 1 gráfico de 1 categoria: escolhe-se o tipo (6), a
categoria, 1 ou mais campos de agrupamento, filtros E/OU, a função (6) e o período. O motor é antigo: naive-ui,
FormKit e ApexCharts, num modal de 2 abas com 3 sub-abas e um modal sobre o modal para escolher o campo. Toda a
agregação acontece no navegador: o front baixa todos os itens do período, de cada painel, e agrupa com
`@tidyjs/tidy`. Não há filtro do dashboard inteiro, drill-down para os itens, série empilhada nem mínimo e máximo.

## Onde mora e como se chega

- **Doc:** "Telas" (en-docs `pt/1.docs/4.Settings/06.Interface/3.Screens.md`, seção "Dashboard (Painéis)"). Tela
  criada que não entra em Menus não aparece para os membros.
- **Jornada:** Configurações > Interface > Telas > Criar > tipo "Painéis" > Salvar > Interface > Menus > adicionar a
  tela ao menu > abrir a tela > "Novo Painel".
- **Rota:** `/workspaces/<ws>/pages/<slug-da-tela>`. A trilha mostra o slug ("Páginas > aud_paineis"), não o nome
  (achado U10 do `enspace-ux-research`, tema construtor-de-telas).
- **Release:** a 2.15.0 (2026-06-17) trouxe "Configuração avançada de cores" (só barra e funil, só Contagem).

## A tela (develop, 2026-11-11)

Print `01-tela-de-painel-hoje.jpg`. Cabeçalho com o nome da tela e 4 botões azuis do tema antigo: "Novo Painel",
"Editar Dashboard", "Organizar painéis automaticamente", "Forçar carregamento". Cada painel é um cartão com título e 6
ícones sem rótulo (ordenar, editar, apagar, duplicar, filtrar, código) mais o menu do ApexCharts (Download SVG, PNG,
CSV). Na barra do painel de teste, a única barra não mostra o rótulo do eixo X.

- **Painel e dashboard, 3 nomes:** "Novo Painel", "Editar Dashboard", "painéis" na mesma linha (achado U9 da pesquisa
  de UX). "Forçar carregamento" expõe o cache como ação.
- **"Editar Dashboard"** não edita o layout: abre um modal com Nome, Descrição (obrigatória), "Grupos Permitidos -
  visualização" e "Tempo de recarregamento dos painéis em minutos" (padrão 5). Print `18-editar-dashboard.jpg`.
- **Layout:** grade gridstack de 12 colunas, arrastar e redimensionar sempre ligados (sem modo de edição). Painel novo
  nasce com metade da largura e altura mínima de 3 linhas de 100 px.
- **Código ("<>")**: mostra ao usuário o JSON de opções do ApexCharts. Print `17-codigo-do-grafico.jpg`.
- **Recarga:** barra de progresso no rodapé da tela até a próxima recarga automática.
- **Tema escuro:** funciona, com linhas de grade brancas fortes. Print `19-tema-escuro.jpg`.

## O formulário do painel, passo a passo (feito pela tela)

Prints `02` a `13`. Modal "Dados do painel" | "Formatação".

1. **Título** (obrigatório), **Cor** (1 cor só para a série) e **Ícone** (obrigatório, lista plana em inglês: "Angle-up",
   "Align-center", "Amazon"…). Print `12-icone-obrigatorio.jpg`.
2. Sub-aba **"Configurações de Gráficos"**: **Tipo** com 6 opções (Barras, Linhas, Pizza, Donut, Área, Funil). Barras
   ganha "É horizontal"; linha e área, "curve" (sem tradução); pizza e donut, "Motrar porcentagem" (erro de digitação).
   Heatmap e área polar existem no código, comentados.
3. Sub-aba **"Agrupamento de Dados"**:
   - **Categoria** (1 só).
   - **"Campos de Agrupamento"**: botão "Adicionar" abre um **modal sobre o modal** (print `05`) com um seletor em
     árvore que mistura campos técnicos e do usuário: "ID", "Criado em", "Editar em", "reference" (chave crua),
     "E-mail do Requisitante", "Display", um nó **"data"** que esconde os campos criados pela pessoa, "Rascunho",
     "Status do Item" (print `06`). O escolhido aparece como caminho técnico "data > Quantidade" (print `07`), ao lado
     de um chip "Indefinido".
   - **Filtros**: "Condicionais" com blocos "Ou Condicionais" e "E Condicionais" (operadores igual, diferente, maior,
     menor, maior ou igual, menor ou igual, contém, preenchido).
   - **Granularidade de data** (Segundos a Anos, sem trimestre): só aparece se o 1º campo de agrupamento for data.
   - **Função**: Contagem, Soma, Média, Mediana, Variância, Contagem Distinta (print `08`). Sem mínimo e máximo.
   - **"Modo de Coloração"** (Por Intervalo, Por Campo), só barras e funil.
   - **"Gerar legenda do Eixo X com base no campo de agrupamento"** (ligado).
   - **"Campo do eixo Y"**: aparece só quando a função não é Contagem, no fim do formulário (print `09`). A lista
     marca "[Tipo inválido]" nos campos que não são número, mas aceita "ID" e recusa o campo virtual "Total virtual"
     (print `13`): campo calculado não entra como medida.
4. Sub-aba **"Período de Consulta e Controle de Acesso"** (print `10`): "Campo de Referência para Consulta" (só data;
   sem ele, usa a criação do item), "Período de Consulta" relativo com padrão **últimos 2 meses** ("Atual", "Anterior",
   valor, escala, "Ao início" e "Ao final"), "Usar tempo relativo" e "Grupos Permitidos - visualização".
5. Aba **"Formatação"** (print `11`): só um seletor "Eixo" (X ou Y) que abre o formulário de formato do campo.
6. **Salvar.** Sem prévia: o gráfico só aparece depois de salvar.

Painel de teste "Preço somado por quantidade" (categoria com itens antigos, padrão de 2 meses): salvou e mostrou "não
há dados neste painel" (minúsculo, texto fixo no código) com o botão "Experimente aumentar o intervalo de consulta de
dados" (print `14`). O botão abre o formulário na sub-aba "Configurações de Gráficos", não na de período (print `15`).

## Filtros e interação

- **Filtro do dashboard inteiro:** não existe.
- **Filtro local** (ícone de funil): o mesmo construtor E/OU (print `16`). Fica só na memória, não é gravado e
  **substitui** o filtro salvo do painel em vez de somar a ele.
- **Ordenar:** botão do painel, crescente ou decrescente, não gravado. A ordem padrão é pela contagem.
- **Drill-down:** não existe. Clicar na barra não leva aos itens.
- **Quem não é full ou owner** não vê nenhuma ação do painel (nem ordenar nem filtrar).

## O motor (código)

- **Front:** naive-ui + FormKit, `DashboardScreen.vue` e `DashboardPanel.vue` (`src/components/screens/dashboard/` e
  `src/components/charts/`). Gráficos com `apexcharts` ^5.16 e `vue3-apexcharts`; grade com `gridstack` ^12.6.
- **Agregação no navegador:** cada painel pede os itens brutos da categoria no período (rota de itens da categoria,
  sem limite de quantidade), em paralelo, sem reaproveitar a resposta entre painéis da mesma categoria. Os filtros do
  painel rodam no navegador depois de baixar tudo. O agrupamento usa `@tidyjs/tidy`.
- **Consequências lidas no código:**
  - **1 série só:** o 2º campo de agrupamento vira mais categorias no eixo e aparece só no tooltip. Não há empilhado.
  - **Múltipla seleção:** cada combinação vira 1 grupo ("A | B"), em vez de contar o item em cada opção.
  - **Relação:** só o primeiro valor conta.
  - **Funções:** todas liberadas para qualquer campo de agrupamento; valor que não é número vira 0.
  - **Limite de grupos:** 49 (barra, pizza, donut) ou 99 (demais), verificado só ao salvar.
  - **Tooltip:** o valor sai sem formatação de número.
- **Back:** guarda o dashboard e os painéis (configuração em JSON). Não tem rota de agregação.
- **Permissão:** quem vê o painel só recebe itens das categorias e formulários que pode ler; o dashboard e cada painel
  podem ser restritos a grupos.

## O que o próprio ENSPACE já tem pronto

- **SDK `enspace-sdk-ui` 0.18.0** (develop): 14 componentes de gráfico no entry `/base`, sobre **Unovis**
  (`@unovis/vue` ^1.7): `EnChart`, `EnChartArea`, `EnChartBar`, `EnChartBarList`, `EnChartBreakdown`, `EnChartDonut`,
  `EnChartEmpty`, `EnChartGroupedBar`, `EnChartHeatmap`, `EnChartLegend`, `EnChartLine`, `EnChartMeter`,
  `EnChartRing`, `EnChartSparkline`, `EnChartStages`. A tela de Painéis não usa nenhum; só o painel de tarefas usa o
  SDK (`EnTasksDashboard`).
- **Protótipos já aprovados** com Unovis: `painel-de-tarefas` e `configuracoes-do-sistema` (gráfico de consumo).
- **Licença do ApexCharts:** a pesquisa de bibliotecas registra licença dual desde a v5, grátis só para empresa com
  menos de US$ 2M de receita anual. O front usa a ^5.16. Conferir com o jurídico.

## O que a pesquisa de UX já dizia (`enspace-ux-research`, tema construtor-de-telas)

- **U9:** "Painel", "Dashboard" e "painéis" na mesma linha de botões; "Forçar carregamento" expõe gambiarra.
- **4 níveis de aninhamento** para configurar um painel (página > modal > aba > modal sobre modal), 5 abas.
- **C9:** o Salvar recusa com "campos precisam de revisão" apontando campos de outra aba, sem marca de erro.
- **Dependência escondida:** categoria sem campo deixa o seletor de agrupamento em "Não há dados", sem dizer por quê.
- **Ícones:** no modal de painel, lista plana e em inglês; nos menus, lista por categoria em português.
- **C1:** o tipo de tela aparece como "Dashboard" num lugar e "Paineis" (sem acento) em outro.

## Gaps

- Não medi o tempo de carga com volume (centenas de milhares de itens): o workspace de exploração tem poucos itens.
- Não percorri a criação da tela e do menu do zero nesta sessão; a jornada vem da doc e da auditoria de UX de
  2026-09-14.

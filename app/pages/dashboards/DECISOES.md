# Decisões: Dashboards configuráveis

## Rodada 1 · 2026-11-12

- **Pedido (literal):** "pode subir o sdk como pensou. e pode prototipar com essa direçao mesmo"
- **Mudou:** a tela de Painéis vira **Dashboards**, entrada própria do menu, com troca de dashboard no título (U9 da pesquisa de UX: a página é o "dashboard", cada bloco é um "painel").
- **Mudou:** o construtor do painel abre em painel lateral, com 3 seções (Dados, Visualização, Identificação) e a prévia ao vivo no topo.
  - O dado vem antes do gráfico: categoria, cálculo, campo da medida, agrupar por, dividir por, filtros do painel, período.
  - A lista de gráficos mostra só os que servem para o dado escolhido, com o sugerido marcado.
  - O título é opcional: sem título, o painel usa a frase da configuração ("Quantidade de Contratos por Status e Unidade").
- **Mudou:** regras por tipo de campo, no contrato da agregação (`agregacao.ts`):
  - múltipla seleção conta o item em cada opção, com o aviso "Conta em cada opção" no rodapé;
  - relação agrupa pelo item ligado (Cliente), com "Outros" quando passa do limite;
  - número, moeda e campo virtual (Valor mensal) servem de medida; texto não agrupa;
  - item sem valor forma o grupo "Sem valor"; opção sem itens aparece com zero;
  - funil conta, em cada etapa, quem chegou até ela (os que estão nela e nas seguintes), só com contagem ou soma.
- **Mudou:** barra empilhada (Dividir por) e clique até os itens: barra, parte da barra, linha do ranking, fatia da legenda, etapa do funil e linha da tabela abrem a lista dos itens com o recorte em chips.
- **Mudou:** período do dashboard inteiro (o seletor de período do SDK) e filtro por campo comum: aparecem só os campos que existem em mais de 1 categoria do dashboard. O painel cuja categoria não tem o campo diz no rodapé que o filtro não se aplica.
- **Mudou:** cada painel escolhe "Período do dashboard" ou "Todo o período" e a data que o período lê (Criado em, Data de assinatura).
- **Mudou:** "Como calculamos" em cada painel: a frase, o período, os filtros e o aviso de que o número respeita a permissão de quem vê.
- **Mudou:** Personalizar arruma a grade (arrastar, redimensionar, ocultar, restaurar), com a grade e o painel de personalização do SDK.
- **Mudou:** dashboard com nome, descrição opcional, quem vê (grupos) e recarga; duplicar, excluir e excluir painel com Desfazer.
- **Mudou:** SDK do ENSPACE de 0.17 para 0.21 e `@unovis` de 1.7 para 1.8.1. A 0.21 traz a grade (`EnDashboardCanvas`, `EnDashboardCustomize`, `useDashboardLayout`), o painel (`EnDashboardPanel`), o seletor de período e os gráficos `EnChart*`.
  - `nuxt.config.ts`: `@unovis/ts` e `@unovis/vue` entram no pré-empacotamento do Vite. Sem isso, o app não liga em `pnpm dev`, porque o Unovis importa o `striptags` em CommonJS.
- **Fronteira:** muda a página de Painéis (cabeçalho, filtros, painéis, construtor, lista dos itens) e a entrada Dashboards no menu; não muda o resto da casca (menu, barra do topo, atalhos), copiada do develop.
- **Descartado:** análise multidimensional (tabela dinâmica com N dimensões, junção livre entre categorias). Motivo: é BI. O dashboard fica com 1 categoria, 1 agrupamento, 1 divisão e 1 medida por painel; o cruzamento entre categorias vem do campo de relação e do filtro por campo comum.
- **Descartado:** campo de membro como agrupamento. Motivo: o ENSPACE não tem tipo de campo de membro; o protótipo usa "Criado por".
- **Não deu:** o eixo Y do gráfico de linha com divisão sai sem formato ("3000000"). Por quê: o `EnChartLine` do SDK 0.21 não aceita `formatValue`. A linha de 1 série vai pelo `EnChartArea`, que aceita.
- **Maquete:**
  - os dados são o `mocks.ts`: 4 categorias fictícias (Contratos, Clientes, Chamados, Despesas), 1.220 itens gerados com semente fixa;
  - "Abrir na listagem de X", "Baixar CSV" e "Atualizar dados" só mostram o aviso;
  - o arranjo da grade e os painéis novos ficam na memória e somem ao recarregar;
  - o seletor "Protótipo · estado" é andaime, não proposta.
- **CSS próprio:** 3 blocos `<style scoped>`, todos de transição que o `Transition` e o `TransitionGroup` do Vue pedem por classe: o botão "Novo painel" ao entrar em Personalizar (`index.vue`), o filtro novo na barra (`_FiltrosDoDashboard.vue`) e a condição nova no construtor (`_Construtor.vue`). Os 2 últimos respeitam `prefers-reduced-motion`.
- **Crítica e acessibilidade:**
  - cada barra tem um botão equivalente fora da tela, para teclado e leitor de tela; a legenda da rosca, o ranking, o funil e a tabela são botões;
  - os botões só de ícone (Como calculamos, Ações do painel, Mais ações) têm `aria-label`;
  - sem correção: o rótulo do eixo do Unovis sai em cinza claro e pequeno no tema claro; é o estilo do SDK.
- **Ver:** `https://pernalombr4.github.io/prototipos/dashboards` · `evidencias/20-dashboard-comercial.jpg` · `evidencias/21-construtor.jpg` · `evidencias/22-itens-da-barra.jpg` · `evidencias/23-escuro-espanhol.jpg`

## Rodada 2 · 2026-11-27

- **Pedido (resumo do retorno da redatora, 13 pontos):** filtro de campo no lugar de "Status em 2 categorias"; estado inicial em 2 pontos da jornada, com opção A (BENI) e B (sem IA); cartão clicável como no painel de tarefas; nenhum dashboard pronto; construtor em modal com prévia à direita; tipo "contador" com o nome do Power BI; ordem lógica no construtor; arrastar e redimensionar sem "Personalizar"; ajuda só com descrição; trocar "Dividir por"; filtro em cada painel; visões salvas; Dashboards dentro de Relatórios.
- **Mudou: nenhum dashboard vem pronto.** O ENSPACE começa sem categoria e sem campo, e o nome do campo não diz o que ele significa ("Valor do contrato" é só um campo de número). O protótipo abre em "Primeiro acesso", sem dashboard; os exemplos de antes só aparecem pelo andaime ("Dashboard montado").
- **Mudou: estado inicial, ponto 1 da jornada (nenhum dashboard).** 2 opções para o dev, trocadas no andaime:
  - **A, a preferida:** "Construir com o BENI" ou "Começar do zero". O BENI trabalha em 4 passos num modal:
    1. a pessoa escolhe as categorias e, se quiser, escreve o que quer acompanhar;
    2. o BENI lê os campos e os itens (tipo de cada campo, quantos de seleção, número e data);
    3. o BENI pergunta o que o tipo não diz, com um palpite em cada pergunta: se o número se soma ou se tira a média, qual data marca o fato, se as opções são etapas em ordem;
    4. o BENI propõe os painéis, cada um com o motivo; a pessoa tira o que não quer e dá o nome. Nada vira painel sem ela aceitar.
  - **B, sem IA:** "Criar dashboard" e os 3 passos do que vem depois.
  - Workspace sem categoria tem estado próprio: sem campo não há painel.
- **Mudou: estado inicial, ponto 2 (dashboard recém-criado, sem painéis).** Estado vazio sem proposta da IA, com "Novo painel" e "Pedir ao BENI" (só na opção A). "Pedir ao BENI" recebe a categoria e um pedido em texto e devolve até 3 painéis para adicionar.
- **Mudou: o painel de número é o Cartão.** É o `EnStatCard` do SDK, o mesmo do painel de tarefas: o cartão inteiro abre os itens, sem botão "Ver N itens", e a descrição vira subtítulo ("Contratos · Este ano, por Data de assinatura"). O nome do tipo segue o Power BI: Cartão (Card).
- **Mudou: o construtor é um modal.** Formulário à esquerda, prévia à direita, na ordem dos construtores de BI (Power BI, Looker Studio, GA4): 1 Fonte de dados, 2 Visualização, 3 Campos, 4 Filtros do painel, 5 Período, 6 Ordem e limite (só nos tipos que ordenam), 7 Título e descrição. O nome do eixo muda com o tipo (Eixo, Eixo de tempo, Fatias, Etapas, Linhas), e o tipo sem campo que sirva fica desabilitado com o motivo.
- **Mudou: "Dividir por" virou "Legenda"**, como no Power BI e no Looker Studio. Na tabela, "Colunas".
- **Mudou: descrição do painel.** Campo novo no construtor. O ícone de ajuda só aparece quando há descrição.
- **Mudou: arrastar e redimensionar sem modo de edição.** A alça aparece no topo do painel ao passar o mouse; o canto inferior direito redimensiona. Uma dica, que se fecha, explica os 2 gestos. No celular a grade vira 1 coluna, sem arrastar.
  - Grade própria com o `gridstack` 14.1.0, a mesma versão que o SDK usa. O `EnDashboardCanvas` não serve: no modo editável ele deixa o painel `inert` e cobre o corpo com a alça, então não dá para clicar no gráfico e arrastar ao mesmo tempo. Proposta para o SDK: modo de edição que deixa o corpo ativo e arrasta pela alça do cabeçalho.
- **Mudou: filtro de campo.** "+ Filtro" lista os campos agrupados por categoria; cada campo é de 1 categoria, e o filtro vale só nos painéis dessa categoria. Chip com operador (é, não é, maior que, menor que, está preenchido, está vazio); vários valores no mesmo chip somam (ou), chips diferentes se juntam (e). Com mais de 1 categoria no dashboard, o chip leva a categoria na frente ("Contratos · Status").
- **Mudou: filtro em cada painel.** O ícone de funil mostra o número de filtros e abre 3 grupos: os salvos no painel (só leitura, com "Editar painel"), os do dashboard que valem ali e os só desta visão, que se põem sem editar o painel.
- **Mudou: visões salvas.** Guardam período, filtros do dashboard e filtros por painel. "Só para mim" é o padrão; owner e full também salvam para todo o workspace, com uma confirmação. Visão alterada mostra "(alterada)" e "Salvar alterações". Membro não muda nem exclui visão do workspace.
- **Mudou: menu.** Relatórios vira grupo com 3 filhos: Relatórios exportados (a tela de hoje), Painel de tarefas (saiu de Tarefas) e Dashboards (selo Novo). A trilha fica Relatórios > Dashboards > nome. "Relatórios exportados" é nome proposto: a tela de hoje lista exportações.
- **Fronteira:** muda a página de Dashboards e o grupo Relatórios do menu; não muda o resto da casca.
- **Descartado:** o modo "Personalizar" da rodada 1, a barra "Filtros comuns entre categorias" e os botões "Ver N itens".
- **Não deu:** a prévia do construtor usa o período e os filtros do dashboard de agora; o painel novo nasce já filtrado na prévia se a barra tiver filtro. Fica assim para mostrar o número que a pessoa vai ver.
- **Maquete:**
  - o BENI do protótipo é uma regra fixa em `beni.ts`, sem IA: palpite de soma para moeda e de média para o resto, etapas quando o nome do campo tem status, etapa ou fase;
  - "Criar categoria" só mostra o aviso;
  - os papéis (Owner ou full, Membro, Só lê) e as opções A e B são andaime.
- **CSS próprio:** nenhum bloco `<style>`. A grade importa o CSS do `gridstack`; o resto são classes do Tailwind.
- **Crítica e acessibilidade:**
  - a alça de arraste é botão com `aria-label` e aparece também com o foco no painel;
  - o cartão inteiro é botão (`interactive` do `EnStatCard`); os ícones por cima dele ficam numa camada acima, para o clique no filtro não abrir os itens;
  - corrigido na conferência: o gráfico empilhado guardava a série que saía do filtro; agora remonta quando as partes mudam.
- **Ver:** `https://pernalombr4.github.io/prototipos/dashboards` · `evidencias/25-estado-inicial-opcao-a.jpg` · `evidencias/26-estado-inicial-opcao-b.jpg` · `evidencias/27-beni-lendo.jpg` · `evidencias/28-beni-perguntas.jpg` · `evidencias/29-beni-paineis-sugeridos.jpg` · `evidencias/30-dashboard-criado-pelo-beni.jpg` · `evidencias/31-dashboard-montado.jpg` · `evidencias/32-filtro-do-painel.jpg` · `evidencias/33-construtor-tipos.jpg` · `evidencias/34-construtor-colunas.jpg` · `evidencias/35-dashboard-sem-paineis.jpg` · `evidencias/36-salvar-visao-workspace-escuro-espanhol.jpg`

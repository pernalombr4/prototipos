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

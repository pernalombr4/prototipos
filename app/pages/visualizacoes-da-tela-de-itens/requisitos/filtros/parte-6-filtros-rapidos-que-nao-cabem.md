# 6. Filtros rápidos que não cabem na linha

**Objetivo:** com a tela estreita, muitos botões ou muitos chips, a linha de filtros continua em 1 linha: os botões
que sobram vão para um "+N", como as visualizações que sobram na barra de visualizações.

**Depende de:** 5. Filtros rápidos.

**Onde vale:** a linha de filtros da tela de itens, na Tabela e no Kanban, e de Tarefas Rápidas e Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. Com a janela estreita, a
visualização "Vencendo em 30 dias" mostra "Meus itens" e "+3".

## Quando os botões não cabem (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF174 | Os botões que não cabem na linha de filtros devem ir, na ordem, para o botão "+N" no fim do grupo, com o número de botões escondidos. | Com a janela estreita, "Vencendo em 30 dias" mostra "Meus itens" e "+3". | Essencial | Obrigatório |
| RF175 | O "+N" deve abrir a lista dos botões escondidos, com a ajuda "Clique para ligar. O filtro ligado vai para a linha." e "Novo filtro rápido" no fim. | Clicar "+3" mostra "Dos meus grupos", "Alta prioridade", "Jurídico" e "Novo filtro rápido". | Essencial | Obrigatório |
| RF176 | Na lista do "+N", cada filtro rápido criado deve ter o botão de editar, que abre o modal de edição. | O lápis de "Jurídico" abre "Editar filtro rápido". | Importante | Obrigatório |
| RF177 | Ligar um filtro rápido na lista do "+N" deve levar o botão para a linha, no lugar do último botão desligado que cabia. | Com "Meus itens", "Dos meus grupos" e "+2", ligar "Alta prioridade" mostra "Meus itens", "Alta prioridade" ligado e "+2". | Essencial | Obrigatório |
| RF178 | O botão ligado deve ficar na linha de filtros, fora do "+N". | Com a janela estreita e "Dos meus grupos" ligado, "Dos meus grupos" continua na linha. | Essencial | Obrigatório |
| RF179 | Os chips, as etiquetas dos filtros sempre aplicados, o filtro avançado e o "+ Filtro" devem ficar sempre visíveis, sem ir para o "+N". | Com a janela estreita, os chips "Vencimento" e "Status" continuam na linha, e os botões vão para o "+N". | Essencial | Obrigatório |
| RF180 | Quando nem o "+N" com os botões ligados cabe ao lado dos chips, os chips devem passar para a linha de baixo. | Com a janela muito estreita, 2 chips e 1 botão ligado, o "+ Filtro" passa para a 2ª linha. | Importante | Obrigatório |
| RF181 | A divisão entre a linha e o "+N" deve se refazer quando a largura da tela, os chips, os botões ou o idioma mudam. | Aplicar mais 1 chip com a janela estreita leva mais 1 botão para o "+N". | Importante | Obrigatório |

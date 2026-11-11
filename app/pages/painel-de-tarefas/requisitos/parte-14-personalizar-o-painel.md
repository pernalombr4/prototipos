# 14. Personalizar o painel

**Objetivo:** cada membro arruma o painel do jeito dele: muda a ordem e o tamanho dos painéis, esconde o que não usa e traz de volta quando quiser, sem mudar o painel dos outros.

**Depende de:** 1. A tela do painel e os filtros.

**Onde vale:** a grade de painéis de Tarefas › Painel e o botão "Painéis" do cabeçalho.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP desligado. Arraste um painel, puxe o canto dele e abra o botão "Painéis".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN651 | O arranjo do painel (a ordem, o tamanho e os painéis ocultos) é de cada membro. O conteúdo de cada painel é igual para cada membro. | Ana esconde Tarefas por prioridade, e Bruno continua vendo o painel. | Obrigatório |
| RN652 | O catálogo de painéis é fechado: o membro só mostra, esconde, move e redimensiona os painéis que o ENSPACE oferece. | O botão "Painéis" lista os mesmos painéis para cada membro. | Obrigatório |
| RN653 | Cada painel tem a largura e a altura mínima e máxima dele, em colunas e linhas da grade de 12 colunas. | Um número vai de 2 a 4 colunas; Tempo médio de duração, de 5 a 12. Os limites de cada painel estão no protótipo. | Obrigatório |

## Mover e redimensionar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF651 | O membro deve poder arrastar um painel pelo corpo dele para outra posição. | O arraste começa depois de 4 px de movimento; abaixo disso, o gesto é um clique e abre a lista. | Desejável | Desejável |
| RF652 | Quando um painel muda de posição, os outros painéis devem se reacomodar na grade. | Nenhum painel fica por cima de outro. | Desejável | Desejável |
| RF653 | O membro deve poder mudar o tamanho de um painel pelo canto inferior direito, dentro dos limites do painel (RN653). | Exemplo: um número não passa de 4 colunas. | Desejável | Desejável |
| RF654 | Cada painel deve ter a alça de teclado, que aparece ao passar o mouse e no foco. | Com o painel em foco, a alça fica visível. | Desejável | Desejável |
| RF655 | Com a alça de teclado em foco, as setas devem mover o painel. | Exemplo: a seta para a direita leva o painel 1 posição à frente, e o leitor de tela anuncia "<painel> na posição <n> de <total>". | Desejável | Desejável |
| RF656 | Com o canto de tamanho em foco, as setas devem mudar o tamanho do painel, dentro dos limites dele (RN653). | Exemplo: a seta para a direita alarga o painel em 1 coluna, e o leitor de tela anuncia "<painel>: <w> colunas por <h> linhas". | Desejável | Desejável |
| RF657 | A tecla Esc durante o arraste deve devolver o painel para onde estava. | O painel volta à posição de antes do arraste. | Desejável | Opcional |

## Ocultar e mostrar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF658 | O menu "…" de cada painel deve ter "Ocultar painel" e "Tamanho padrão". | "Tamanho padrão" volta o painel à largura e à altura do arranjo padrão. | Desejável | Desejável |
| RF659 | Quando o membro oculta um painel pelo menu "…", o painel deve sair da grade. | Os outros painéis ocupam o espaço do painel oculto. | Desejável | Desejável |
| RF660 | O aviso de painel oculto deve dizer que o painel volta pelo botão "Painéis" e ter "Desfazer". | Exemplo: "Tarefas por prioridade saiu da tela. Ele volta pelo botão Painéis.", e "Desfazer" devolve o painel ao lugar. | Desejável | Desejável |
| RF661 | O cabeçalho deve ter o botão "Painéis", com 1 caixa de marcar por painel, agrupada em "Números", "Prazo e SLA", "Volume, status e prioridade", "Responsáveis" e "Tempos". | Marcar ou desmarcar uma caixa mostra ou esconde o painel sem fechar o menu. | Desejável | Desejável |
| RF662 | O botão "Painéis" deve mostrar quantos painéis estão na tela e que o arranjo vale só para o membro. | Exemplo: "O arranjo vale só para você · 12 de 15 na tela". | Desejável | Desejável |
| RF663 | O painel que volta à tela deve entrar no lugar dele no arranjo padrão, entre os painéis que estão na tela, no tamanho padrão. | Exemplo: Tarefas vencidas volta entre SLA e Próximas a vencer. | Desejável | Desejável |
| RF664 | O botão "Painéis" deve ter "Mostrar todos", que traz de volta cada painel oculto, e fica desabilitado quando nada está oculto. | Com os 15 na tela, "Mostrar todos" aparece desabilitado. | Desejável | Desejável |
| RF665 | O botão "Painéis" deve ter "Restaurar padrão", que volta a ordem, o tamanho e os painéis ocultos ao arranjo padrão. | O aviso diz "Painéis de volta ao arranjo padrão." | Desejável | Desejável |
| RF666 | Se o membro oculta cada painel, a grade deve mostrar "Todos os painéis estão ocultos", com o pedido de marcar um painel no botão "Painéis". | Exemplo: desmarcar as 15 caixas mostra a mensagem. | Desejável | Desejável |

## Desfazer e guardar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF667 | Ctrl+Z, ou Cmd+Z no Mac, deve desfazer a última mudança do arranjo, até 20 mudanças para trás. | Exemplo: mover, redimensionar e ocultar um painel e apertar Ctrl+Z 3 vezes volta ao arranjo do começo. | Desejável | Opcional |
| RF668 | Cada membro deve encontrar o arranjo que deixou ao voltar ao painel, em outro navegador ou em outro computador (RN651). | Exemplo: Ana esconde um painel no computador e não o vê no celular. | Desejável | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI651 | Preferência por membro <rota a definir> | Deve guardar e devolver, por membro do workspace, a ordem, a largura, a altura e os painéis ocultos do painel de tarefas. Hoje não existe. | Desejável |

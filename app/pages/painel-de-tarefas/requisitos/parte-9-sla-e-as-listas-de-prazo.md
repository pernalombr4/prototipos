# 9. SLA e as listas de prazo

**Objetivo:** o gestor vê num gráfico só a situação do prazo das abertas e das concluídas, e acompanha numa lista o que venceu por último e o que vence a seguir.

**Depende de:** 3. Os 4 números.

**Onde vale:** os painéis "SLA", "Tarefas vencidas" e "Próximas a vencer" de Tarefas › Painel, numa linha depois dos números.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP desligado. Troque o seletor do SLA e role as 2 listas.

## SLA (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | O painel "SLA" deve ter o seletor "Abertas agora" e "Concluídas no período", e abrir em "Abertas agora". | O seletor aparece acima das colunas, com "Abertas agora" marcado. | Importante | Obrigatório |
| RF402 | Em "Abertas agora", o painel deve mostrar 1 coluna por situação da aberta, na ordem Vencida, A vencer, No prazo e Sem prazo (RN907, linhas 1 a 4), com o total em cima de cada coluna. | Exemplo: 4 colunas com 78, 40, 30 e 26. | Importante | Obrigatório |
| RF403 | Em "Concluídas no período", o painel deve mostrar 1 coluna por situação da concluída, na ordem Atrasada, No prazo e Sem prazo (RN907, linhas 5 a 7). | Exemplo: 3 colunas com 30, 70 e 25. | Importante | Obrigatório |
| RF404 | Cada coluna do SLA deve ter a cor da situação: Vencida e Atrasada em vermelho, A vencer em amarelo, No prazo em verde e Sem prazo em cinza. | As cores são as do protótipo. | Desejável | Desejável |
| RF405 | O clique numa coluna deve abrir a lista daquela situação: as abertas pelo prazo e as concluídas da conclusão mais recente à mais antiga. | Exemplo: o clique em A vencer abre a lista "Abertas agora · A vencer" com as 40. | Importante | Obrigatório |
| RF406 | O resumo da lista de uma coluna deve mostrar o total do seletor escolhido e cada situação com o número e a porcentagem, com a situação clicada em destaque. | Exemplo: "Abertas agora" 174; "A vencer" 40 · 23% em destaque. | Importante | Obrigatório |

## Tarefas vencidas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF407 | O painel "Tarefas vencidas" deve listar as abertas vencidas (RN907, linha 2), da que venceu há menos tempo à que venceu há mais tempo. | A 1ª linha é a de prazo mais recente; o número Vencidas abre a mesma lista na ordem inversa. | Importante | Obrigatório |
| RF408 | A lista de vencidas deve se dividir pelas faixas "Há até 7 dias" e "Há mais de 7 dias" (RN918), com a contagem de cada faixa no título dela. | Exemplo: "Há até 7 dias 33" e "Há mais de 7 dias 80". | Importante | Obrigatório |
| RF409 | Cada linha da lista de vencidas deve mostrar o nome da tarefa, os responsáveis e "venceu há <tempo>", em vermelho. | Exemplo: "Revisar contrato", "Ana Souza", "venceu há 2 d". | Importante | Obrigatório |
| RF410 | Se não há tarefa vencida, o painel deve mostrar "Nenhuma tarefa vencida." no lugar da lista. | Exemplo: com Vencidas em 0, o painel mostra a mensagem. | Importante | Obrigatório |

## Próximas a vencer (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF411 | O painel "Próximas a vencer" deve listar as abertas com prazo de agora em diante, da que vence primeiro à que vence por último, sem limite de 7 dias. | Exemplo: uma tarefa que vence daqui a 20 dias aparece na faixa "Em 8 a 30 dias". | Importante | Obrigatório |
| RF412 | A lista de próximas deve se dividir pelas faixas "Em até 24 h", "Em 1 a 7 dias", "Em 8 a 30 dias" e "Em mais de 30 dias" (RN918), com a contagem de cada faixa no título dela. | A faixa sem tarefa não aparece. | Importante | Obrigatório |
| RF413 | Cada linha da lista de próximas deve mostrar o nome da tarefa, os responsáveis e "em <tempo>", com o tempo na cor de alerta na faixa "Em até 24 h". | Exemplo: "Aprovar proposta", "Jurídico", "em 5 h" em amarelo. | Importante | Obrigatório |
| RF414 | Se não há tarefa aberta com prazo à frente, o painel deve mostrar "Nenhuma tarefa aberta com prazo à frente." no lugar da lista. | Exemplo: um workspace só com tarefas vencidas e sem prazo mostra a mensagem. | Importante | Obrigatório |

## As 2 listas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF415 | Cada lista de prazo deve carregar as tarefas de 15 em 15, conforme o membro rola o painel, e mostrar o total no fim. | Exemplo: com 113 vencidas, o painel abre com 15 e mostra "113 no total" no fim da rolagem. | Importante | Obrigatório |
| RF416 | O clique numa linha de cada lista de prazo deve abrir a tarefa na tela de origem dela: a tarefa de Agendadas em Tarefas › Agendadas, e a de Rápidas em Tarefas › Rápidas. | Exemplo: "Revisar contrato", de Rápidas, abre em Tarefas › Rápidas. | Importante | Obrigatório |

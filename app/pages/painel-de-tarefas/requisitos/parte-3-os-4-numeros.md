# 3. Os 4 números

**Objetivo:** o gestor vê de relance quantas tarefas venceram, quantas vão vencer nos próximos 7 dias, que parte da equipe entrega no prazo e quanto uma tarefa leva para ser concluída, e abre a lista de cada número.

**Depende de:** 1. A tela do painel e os filtros; 2. A lista do recorte.

**Onde vale:** a 1ª linha de painéis de Tarefas › Painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP ligado. Clique em cada número para ver o resumo e a lista.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | A parte concluída no prazo é calculada como as concluídas no período até o prazo, divididas pelas concluídas no período que tinham prazo. A tarefa sem prazo fica fora da conta (RN906). | 40 concluídas no período, 32 com prazo, 24 até o prazo: 75%. | Obrigatório |
| RN102 | O tempo médio de conclusão é calculado como a média do tempo de conclusão (RN913) das tarefas concluídas no período. | 3 tarefas concluídas em 1 h, 2 h e 9 h: tempo médio de 4 h. | Obrigatório |
| RN103 | A cor de Concluídas no prazo é verde de 85% para cima, amarela de 70% até menos de 85% e vermelha abaixo de 70%. | 75% aparece em amarelo. | Obrigatório |

## Os números (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O número "Vencidas" deve mostrar quantas tarefas abertas estão vencidas (RN907, linha 2). | Exemplo: 113 em vermelho; com 0, o número fica na cor do texto. | Essencial | Obrigatório |
| RF102 | O número "A vencer" deve mostrar quantas tarefas abertas vencem nos próximos 7 dias (RN907, linha 3). | Exemplo: 27 em amarelo; com 0, o número fica na cor do texto. | Essencial | Obrigatório |
| RF103 | O número "Concluídas no prazo" deve mostrar a parte concluída no prazo, em porcentagem sem casa decimal (RN101), na cor de RN103. | Exemplo: "75%" em amarelo. | Essencial | Obrigatório |
| RF104 | Se o período não tem tarefa concluída com prazo, o número "Concluídas no prazo" deve mostrar "-". | Exemplo: período com 3 concluídas, as 3 sem prazo, mostra "-" na cor do texto. | Importante | Obrigatório |
| RF105 | O número "Tempo médio de conclusão" deve mostrar o tempo médio (RN102) em 2 unidades no máximo, de dias, horas e minutos. | Exemplo: "2 d 4 h", "5 h 20 min", "12 min" ou "menos de 1 min". Sem tarefa concluída no período, mostra "-". | Essencial | Obrigatório |
| RF106 | Cada número deve mostrar só o valor, sem texto de apoio nem comparação com o período anterior. | O detalhe de cada número está no resumo da lista (RF111 a RF114). | Importante | Obrigatório |

## A lista de cada número (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF107 | O clique em "Vencidas" deve abrir a lista "Vencidas", da tarefa que venceu há mais tempo à que venceu há menos tempo. | A 1ª linha é a de prazo mais antigo. | Essencial | Obrigatório |
| RF108 | O clique em "A vencer" deve abrir a lista "A vencer nos próximos 7 dias", da que vence primeiro à que vence por último. | A 1ª linha é a de prazo mais próximo. | Essencial | Obrigatório |
| RF109 | O clique em "Concluídas no prazo" deve abrir a lista "Concluídas com atraso", com as concluídas no período depois do prazo (RN907, linha 7), da conclusão mais recente à mais antiga. | Exemplo: 75% com 32 concluídas com prazo abre a lista com as 8 atrasadas. | Essencial | Obrigatório |
| RF110 | O clique em "Tempo médio de conclusão" deve abrir a lista das concluídas no período, da que levou mais tempo à que levou menos. | A 1ª linha é a tarefa de maior tempo de conclusão. | Importante | Obrigatório |

## O resumo de cada número (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF111 | O resumo de Vencidas deve mostrar que parte das abertas está vencida, quantas venceram há mais de 7 dias e há até 7 dias (RN918) e quantas foram criadas manualmente e por fluxo. | Exemplo: "Das abertas" 65%, "Há mais de 7 dias" 80, "Há até 7 dias" 33, "Criadas manualmente" 20, "Criadas por fluxo" 93. | Importante | Obrigatório |
| RF112 | O resumo de A vencer deve mostrar quantas vencem em até 24 h e em 1 a 7 dias (RN918) e quantas foram criadas manualmente e por fluxo. | Exemplo: "Em até 24 h" 5, em amarelo quando passa de 0, e "Em 1 a 7 dias" 22. | Importante | Obrigatório |
| RF113 | O resumo de Concluídas no prazo deve mostrar quantas terminaram no prazo, quantas terminaram com atraso, quantas concluídas tinham prazo e a parte concluída no prazo do período anterior (RN915). | Exemplo: "No prazo" 24, "Atrasada" 8 em destaque, "Concluídas com prazo" 32, "Período anterior" 81%. Em "Todo o período", o período anterior mostra "-". | Importante | Obrigatório |
| RF114 | O resumo de Tempo médio de conclusão deve mostrar a mediana, o tempo em que 90% das tarefas terminaram, o maior tempo, quantas tarefas foram medidas e quantas foram criadas manualmente e por fluxo. | Exemplo: "Mediana" 36 min, "90% em até" 3 d, "Maior" 21 d, "Tarefas medidas" 40. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Os limites de 85% e 70% da cor de Concluídas no prazo valem para cada workspace, ou o cliente define a meta dele? | produto | Com meta por workspace, RN103 lê a meta da configuração do workspace |

# 8. Os números Abertas e Concluídas

**Objetivo:** o gestor vê quantas tarefas estão abertas agora e quantas a equipe concluiu no período, ao lado dos outros números, e abre a lista de cada um.

**Depende de:** 3. Os 4 números.

**Onde vale:** a 1ª linha de painéis de Tarefas › Painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP desligado. Clique em Abertas e em Concluídas.

## Os números (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF351 | A 1ª linha do painel deve ter 6 números, na ordem Abertas, Vencidas, A vencer, Concluídas, Concluídas no prazo e Tempo médio de conclusão. | Os números novos entram nas posições 1 e 4. | Importante | Obrigatório |
| RF352 | O número "Abertas" deve mostrar quantas tarefas estão abertas agora (RN904), na cor do texto. | Exemplo: 174, a soma de 90 pendentes, 70 em andamento e 14 bloqueadas. | Importante | Obrigatório |
| RF353 | O número "Concluídas" deve mostrar quantas tarefas foram concluídas no período (RN908 e RN909), na cor do texto. | Exemplo: trocar "Últimos 30 dias" por "Últimos 7 dias" baixa o número. | Importante | Obrigatório |

## A lista e o resumo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF354 | O clique em "Abertas" deve abrir a lista "Abertas agora", pelo prazo, da mais antiga à mais distante, com a sem prazo no fim. | A 1ª linha é a de prazo mais antigo. | Importante | Obrigatório |
| RF355 | O clique em "Concluídas" deve abrir a lista "Concluídas no período", da conclusão mais recente à mais antiga. | A 1ª linha é a concluída por último. | Importante | Obrigatório |
| RF356 | O resumo de Abertas deve mostrar quantas estão em cada status aberto (RN903), quantas estão em cada situação de prazo de aberta (RN907, linhas 1 a 4) e quantas foram criadas manualmente e por fluxo. | Exemplo: "Pendente" 90, "Em andamento" 70, "Bloqueada" 14, "Vencida" 78, "A vencer" 40, "No prazo" 30, "Sem prazo" 26. | Importante | Obrigatório |
| RF357 | O resumo de Concluídas deve mostrar as concluídas do período anterior (RN915), as criadas no período, quantas terminaram no prazo, com atraso e sem prazo, e quantas foram criadas manualmente e por fluxo. | Exemplo: "Período anterior" 110, "Criadas no período" 140, "No prazo" 70, "Atrasada" 30, "Sem prazo" 25. Em "Todo o período", o período anterior mostra "-". | Importante | Obrigatório |

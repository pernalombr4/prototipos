# 12. Agrupar por semana, mês ou ano

**Objetivo:** o gestor escolhe se vê as criadas e as concluídas por semana, por mês ou por ano.

**Depende de:** 4. Criadas e concluídas e Tarefas por status.

**Onde vale:** o painel "Criadas e concluídas" de Tarefas › Painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP desligado. O seletor fica no cabeçalho de Criadas e concluídas.

## Agrupar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF551 | O painel "Criadas e concluídas" deve ter o seletor "Agrupar por", com "Semana", "Mês" e "Ano". | O seletor aparece no cabeçalho do painel. | Desejável | Opcional |
| RF552 | O seletor deve abrir em "Semana" nos períodos Últimos 7 dias, Últimos 30 dias, Últimos 90 dias e Este mês, e em "Mês" nos períodos Este ano, Últimos 12 meses e Todo o período. | Exemplo: "Este ano" abre com "Mês" marcado. | Desejável | Opcional |
| RF553 | Quando o membro troca o período, o seletor deve voltar para a granularidade do período novo (RF552). | Exemplo: "Ano" escolhido em "Todo o período" volta para "Semana" ao trocar para "Últimos 30 dias". | Desejável | Opcional |
| RF554 | Com "Ano", cada ponto deve contar o ano de 1º de janeiro a 31 de dezembro, no horário de Brasília (RN914). | Exemplo: a tarefa concluída em 31/12/2025 às 23:00, horário de Brasília, conta em 2025. | Desejável | Opcional |
| RF555 | Com "Ano", a dica de cada ponto deve mostrar o ano, as criadas, as concluídas e o saldo. | Exemplo: a dica do ponto de 2025 mostra "2025", as criadas, as concluídas e o saldo de 2025. | Desejável | Opcional |

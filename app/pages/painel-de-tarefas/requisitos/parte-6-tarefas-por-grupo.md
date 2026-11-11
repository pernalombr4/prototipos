# 6. Tarefas por grupo

**Objetivo:** o gestor vê a fila de cada grupo de membros, com a tarefa feita para o grupo e a de cada membro, e abre a fila de cada grupo.

**Depende de:** 5. Tarefas por responsável.

**Onde vale:** o painel "Tarefas por grupo", na 3ª linha de Tarefas › Painel, ao lado de Tarefas por responsável.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP ligado. Troque o seletor do painel e clique numa barra.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN251 | A fila de um grupo junta a tarefa designada ao grupo (RN910, linha 5) e a tarefa designada a cada membro do grupo. | A fila do Jurídico tem a tarefa de Agendadas feita para o grupo e a tarefa de Rápidas de Carla Nunes, que é do grupo. | Obrigatório |
| RN252 | Uma tarefa conta 1 vez em cada grupo, mesmo quando designada a 2 membros do mesmo grupo. A tarefa de quem está em 2 grupos conta nos 2. | A tarefa para Ana e Bruno, os 2 do Jurídico, conta 1 vez no Jurídico. | Obrigatório |
| RN253 | A tarefa designada a "Todo mundo" não entra na fila de grupo. | A tarefa de Agendadas com o tipo de responsável "Todo Mundo" fica fora de Tarefas por grupo. | Obrigatório |

## O gráfico (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF251 | O painel deve mostrar 1 barra horizontal por grupo de membros do workspace com tarefa na fila (RN251 a RN253), na ordem de RN916. | Exemplo: o grupo sem tarefa na fila fica fora do gráfico. | Essencial | Obrigatório |
| RF252 | O painel deve carregar as barras de 10 em 10, conforme o membro rola o painel, até mostrar cada grupo. | Exemplo: com 23 grupos, o painel abre com 10 e mostra os 23 depois de 2 rolagens. | Importante | Obrigatório |
| RF253 | O painel deve ter o seletor "Todos", "Pendente", "Em andamento", "Vencida" e "Concluída", e abrir em "Todos". | O seletor é independente do seletor de Tarefas por responsável. | Essencial | Obrigatório |
| RF254 | Em "Todos", cada barra deve se dividir nas 5 partes da fila (RN912), com o total na ponta e a legenda das partes que aparecem no painel. | Exemplo: a barra do Jurídico mostra Vencida 4, Pendente 7, Em andamento 3 e Concluída 11, e 25 na ponta. | Essencial | Obrigatório |
| RF255 | Nos filtros "Pendente", "Em andamento", "Vencida" e "Concluída", cada barra deve mostrar só aquela parte da fila, com o valor na ponta. | Exemplo: em "Vencida", a barra do Jurídico mostra 4. | Essencial | Obrigatório |
| RF256 | Nos filtros "Pendente", "Em andamento", "Vencida" e "Concluída", o grupo com 0 naquela parte deve sair do gráfico. | Exemplo: em "Vencida", o grupo sem tarefa vencida fica sem barra. | Essencial | Obrigatório |
| RF257 | O clique numa barra deve abrir a lista da fila do grupo no filtro escolhido: em "Todos", as abertas agora e as concluídas no período; nos outros filtros, só aquela parte. | Exemplo: em "Vencida", o clique no Jurídico abre a lista "Jurídico · Vencida" com as 4 vencidas. | Essencial | Obrigatório |
| RF258 | O resumo da lista de um grupo deve mostrar quantos membros o grupo tem, as 5 partes da fila, o "No prazo" e o "Tempo médio" (RN917), com a parte do filtro escolhido em destaque. | Exemplo: selo "3 membros", "Vencida" 4 em destaque, "No prazo" 70%, "Tempo médio" 2 d. | Importante | Obrigatório |
| RF259 | Se os filtros não trazem grupo com tarefa, o painel deve mostrar "Nenhuma tarefa com esses filtros." no lugar das barras. | Exemplo: o workspace sem grupo de membros mostra a mensagem. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI251 | `/ws/member-groups` | Deve devolver os membros de cada grupo, que formam a fila do grupo com a tarefa designada a cada membro (RN251). | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P251 | A fila do grupo usa os membros de hoje. A tarefa de quem saiu do grupo no meio do período continua na fila do grupo? | produto | Com "continua", a fila precisa do histórico de entrada e saída de cada membro |

# 5. Tarefas por responsável

**Objetivo:** o gestor vê a fila de cada pessoa, quem está com mais tarefas vencidas e quem entrega no prazo, e abre a fila de cada uma.

**Depende de:** 1. A tela do painel e os filtros; 2. A lista do recorte.

**Onde vale:** o painel "Tarefas por responsável", na 3ª linha de Tarefas › Painel, e a tabela que abre pelo "Ver tabela" do painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP ligado. Troque o seletor do painel e clique em "Ver tabela".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | Em Tarefas por responsável, a tarefa conta para o responsável a quem foi designada (RN910 e RN911). A tarefa feita para um grupo conta em Tarefas por grupo, e não numa linha deste painel. | Em "Designada para", a tarefa de Agendadas para o grupo Jurídico aparece só em Tarefas por grupo. | Obrigatório |
| RN202 | Em "Quem assumiu", cada tarefa conta 1 vez, para a pessoa que assumiu a tarefa ou, sem quem assumiu, para a pessoa que concluiu. A tarefa sem as 2 conta em "Sem responsável". | A tarefa do grupo Jurídico que Carla Nunes assumiu conta na linha de Carla Nunes. | Obrigatório |

## O gráfico (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | O painel deve mostrar 1 barra horizontal por fila: cada pessoa, "Todo mundo", "E-mail externo" e "Sem responsável" (RN201). | Exemplo: uma tarefa de Rápidas sem `assigned_to` entra na barra "Sem responsável". | Essencial | Obrigatório |
| RF202 | O painel deve mostrar as 10 maiores filas, na ordem de RN916. | Exemplo: com 14 filas, as 4 menores ficam só na tabela de "Ver tabela". | Essencial | Obrigatório |
| RF203 | O painel deve ter o seletor "Todos", "Pendente", "Em andamento", "Vencida" e "Concluída", e abrir em "Todos". | O seletor aparece acima das barras, com "Todos" marcado. | Essencial | Obrigatório |
| RF204 | Em "Todos", cada barra deve se dividir nas 5 partes da fila (RN912), com o total na ponta e a legenda das partes que aparecem no painel. | Exemplo: sem tarefa bloqueada no workspace, a legenda não mostra Bloqueada. | Essencial | Obrigatório |
| RF205 | Nos filtros "Pendente", "Em andamento", "Vencida" e "Concluída", cada barra deve mostrar só aquela parte da fila, com o valor na ponta. | Exemplo: em "Vencida", a barra de Ana mostra 9, o mesmo número da parte Vencida em "Todos". | Essencial | Obrigatório |
| RF206 | Nos filtros "Pendente", "Em andamento", "Vencida" e "Concluída", a fila com 0 naquela parte deve sair do gráfico. | Exemplo: em "Vencida", a fila sem tarefa vencida fica sem barra. | Essencial | Obrigatório |
| RF207 | A barra de cada pessoa deve ter o avatar com as iniciais, e as barras de "Todo mundo", "E-mail externo" e "Sem responsável", o ícone do tipo. | O ícone de cada tipo está no protótipo. | Desejável | Desejável |
| RF208 | O clique numa barra deve abrir a lista da fila no filtro escolhido: em "Todos", as abertas agora e as concluídas no período; nos outros filtros, só aquela parte. | Exemplo: em "Vencida", o clique em Ana abre a lista "Ana Souza · Vencida" com as 9 vencidas. | Essencial | Obrigatório |
| RF209 | O resumo da lista de uma fila deve mostrar o tipo do responsável, as 5 partes da fila, o "No prazo" e o "Tempo médio" (RN917), com a parte do filtro escolhido em destaque. | Exemplo: "Pessoa", "Vencida" 9 em destaque, "Pendente" 6, "Em andamento" 4, "Bloqueada" 1, "Concluída" 12, "No prazo" 80%, "Tempo médio" 1 d 3 h. | Importante | Obrigatório |
| RF210 | Se os filtros não trazem fila com tarefa, o painel deve mostrar "Nenhuma tarefa com esses filtros." no lugar das barras. | Exemplo: em "Concluída", sem tarefa concluída no período, o painel mostra a mensagem. | Importante | Obrigatório |

## A tabela de detalhe (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF211 | O cabeçalho do painel deve ter "Ver tabela", que abre ao lado a tabela com cada fila do painel. | Exemplo: com 14 filas, a tabela mostra as 14. | Essencial | Obrigatório |
| RF212 | A tabela deve ter as colunas Responsável, Pendentes, Em andamento, Vencidas, Concluídas, No prazo e Tempo médio (RN917). | Os números de cada linha batem com as partes da barra da mesma fila. | Essencial | Obrigatório |
| RF213 | A tabela deve abrir ordenada por Vencidas, da maior para a menor. | A 1ª linha é a fila com mais vencidas. | Importante | Obrigatório |
| RF214 | O clique no título de cada coluna da tabela deve ordenar a tabela por aquela coluna. | Exemplo: o clique em Tempo médio põe o maior tempo no topo. | Importante | Obrigatório |
| RF215 | A tabela deve ter "Contar por", com "Designada para" (RN201) e "Quem assumiu" (RN202), e abrir em "Designada para". | Exemplo: em "Quem assumiu", a tarefa do grupo Jurídico assumida por Carla Nunes entra na linha de Carla Nunes. | Essencial | Obrigatório |
| RF216 | Em "Designada para", o rodapé da tabela deve avisar que a tarefa designada a 2 pessoas conta para as 2 e que a soma das linhas pode passar do total. | O texto está no protótipo. | Importante | Obrigatório |
| RF217 | Em "Quem assumiu", o rodapé da tabela deve avisar que a tarefa de grupo está em Tarefas por grupo e que quem do grupo assumiu aparece em "Quem assumiu". | O texto está no protótipo. | Importante | Obrigatório |
| RF218 | O clique numa linha da tabela deve abrir a lista da fila, com as abertas agora e as concluídas no período, no modo de "Contar por" escolhido. | Exemplo: em "Quem assumiu", a linha de Carla Nunes abre a lista com a tarefa do grupo Jurídico que ela assumiu. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI201 | `/ws/tasks` e `/c-flow-item-tasks` | Em "Quem assumiu", deve ler na tarefa de Rápidas o `assigned_to` e, vazio, o `completed_by`; na tarefa de Agendadas, o `assigned` (quem clicou em Atribuir) e, vazio, o `updated_by`. | Obrigatório |

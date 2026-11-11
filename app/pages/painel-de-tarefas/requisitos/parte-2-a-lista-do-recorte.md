# 2. A lista do recorte

**Objetivo:** o gestor clica num número, numa coluna ou numa barra e vê as tarefas por trás dele, com o resumo do recorte ao lado, para agir na tela da tarefa.

**Depende de:** 1. A tela do painel e os filtros.

**Onde vale:** a lista lateral que abre sobre o painel, em Tarefas › Painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP ligado. Clique no número Vencidas.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN051 | A lista de um recorte traz as mesmas tarefas que formam o número, a coluna ou a barra clicada, com os filtros do painel. | O número Vencidas com 113 abre a lista com 113 tarefas. | Obrigatório |
| RN052 | A ordem inicial da lista segue o tipo de tarefa do recorte: a aberta vai pelo prazo, do mais antigo ao mais distante, com a sem prazo no fim; a concluída vai da conclusão mais recente à mais antiga. | A lista de Vencidas começa pela tarefa que venceu há mais tempo. | Obrigatório |

## Abrir a lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF051 | Quando o membro clica num número, numa coluna ou numa barra de um painel, o painel deve abrir a lista lateral daquele recorte (RN051). | Exemplo: o clique em Vencidas abre a lista com o título "Vencidas" e "113 tarefas". | Essencial | Obrigatório |
| RF052 | Se o recorte não tem tarefa, a lista deve mostrar "Nenhuma tarefa neste recorte." no lugar da tabela. | Exemplo: o número A vencer em 0 abre a lista com a mensagem. | Importante | Obrigatório |

## O resumo do recorte (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF053 | À esquerda da tabela, a lista deve mostrar o resumo do recorte: o nome do painel, o número do recorte, o selo "Agora" ou "No período" e as linhas de detalhe do painel clicado. | Exemplo: Vencidas mostra o selo "Agora" e as linhas "Das abertas", "Há mais de 7 dias" e "Há até 7 dias". As linhas de cada painel estão no protótipo. | Essencial | Obrigatório |
| RF054 | O selo "No período" do resumo deve vir com o nome do período escolhido. | Exemplo: "No período" e "Últimos 30 dias". | Importante | Obrigatório |
| RF055 | O resumo deve mostrar os filtros ligados no painel quando a lista abriu. | Exemplo: com "Últimos 30 dias" e "Carla Nunes", o resumo mostra os 2 em "Filtros". | Importante | Obrigatório |
| RF056 | O resumo deve ter o (i) "Como calculamos" do painel de onde a lista saiu. | O texto é o mesmo do (i) do painel. | Importante | Obrigatório |
| RF057 | O clique no limite entre o resumo e a tabela deve recolher o resumo num trilho de ícones. | Recolhido, cada ícone mostra o rótulo e o valor ao passar o mouse. | Importante | Desejável |
| RF058 | Com o resumo recolhido, o clique no limite deve expandir o resumo de novo. | O trilho de ícones sai, e o resumo volta ao lado da tabela. | Importante | Desejável |
| RF059 | Arrastar o limite entre o resumo e a tabela deve mudar a largura do resumo. | O resumo alarga e estreita junto com o ponteiro. | Desejável | Opcional |
| RF060 | A largura do resumo escolhida pelo membro deve valer na próxima lista que o membro abrir. | Exemplo: o resumo alargado continua largo ao abrir a lista de A vencer. | Desejável | Opcional |

## A tabela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF061 | A tabela deve ter as colunas Tarefa, Status, Prazo, Responsável, Fluxo e etapa e Concluída em. | O Status é o do painel (RN903). | Essencial | Obrigatório |
| RF062 | A coluna Prazo deve mostrar a data do prazo e quanto falta ou quanto passou. | Exemplo: "vence em 2 d", "venceu há 5 h" ou "Sem prazo" (RN906). | Essencial | Obrigatório |
| RF063 | A tabela deve abrir na ordem do recorte (RN052). | Exemplo: a lista de Concluídas no prazo começa pela concluída mais recente. | Essencial | Obrigatório |
| RF064 | O clique no título das colunas Tarefa, Prazo e Concluída em deve ordenar a tabela por aquela coluna, em ordem crescente e depois decrescente. | Exemplo: o 1º clique em Prazo põe o prazo mais antigo no topo, e o 2º, o mais distante. | Importante | Obrigatório |
| RF065 | O campo "Buscar tarefa" deve filtrar a tabela pelo nome da tarefa, pelo ID e pelo nome do fluxo. | Exemplo: "contrato" deixa só as tarefas com "contrato" no nome ou no fluxo, e o rodapé conta só essas. | Importante | Obrigatório |
| RF066 | O rodapé deve mostrar "Mostrando <de> a <até> de <total>", a escolha de 10, 20 ou 50 por página e a paginação com a primeira e a última página. | Exemplo: 113 tarefas, 20 por página: "Mostrando 1 a 20 de 113" e 6 páginas. | Essencial | Obrigatório |
| RF067 | A tabela deve abrir com 20 tarefas por página. | O rodapé mostra "20 por página". | Importante | Obrigatório |

## Ir para a tarefa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF068 | O clique numa linha deve abrir a tarefa na tela de origem dela: a tarefa de Agendadas em Tarefas › Agendadas, e a de Rápidas em Tarefas › Rápidas. | Exemplo: a linha "Aprovar proposta", da etapa Análise, abre a tarefa em Tarefas › Agendadas. | Essencial | Obrigatório |
| RF069 | Enquanto a lista tem tarefa de Agendadas, a lista deve mostrar "Abrir em Agendadas", que abre Tarefas › Agendadas filtrada pelo recorte. | Exemplo: a lista de Vencidas com 40 tarefas de Agendadas abre Agendadas com as 40. | Importante | Obrigatório |
| RF070 | Enquanto a lista tem tarefa de Rápidas, a lista deve mostrar "Abrir em Rápidas", que abre Tarefas › Rápidas filtrada pelo recorte. | Exemplo: a lista só com tarefas de Agendadas não mostra "Abrir em Rápidas". | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI051 | `GET /ws/tasks` | Deve aceitar o filtro `is_overdue`, que hoje devolve 400, para "Abrir em Rápidas" levar o recorte das vencidas. | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P051 | Os filtros de Agendadas e de Rápidas não têm cada recorte do painel (a fila de um grupo, a situação A vencer). Para o recorte que a tela de destino não filtra, "Abrir em Agendadas" e "Abrir em Rápidas" aparecem? | produto | Sem o filtro no destino, RF069 e RF070 escondem o botão naquele recorte, ou a tela de destino ganha o filtro |
| P052 | A tarefa aberta pela linha da lista abre na mesma aba, fechando o painel, ou numa aba nova? | produto | Define o gesto de RF068 |

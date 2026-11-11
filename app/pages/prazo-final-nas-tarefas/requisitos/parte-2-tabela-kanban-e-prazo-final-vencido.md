# 2. Tabela, kanban e prazo final vencido

**Objetivo:** o membro vê, filtra e ordena as tarefas rápidas pelo prazo final, na tabela e no kanban, e reconhece de relance a tarefa com o prazo final vencido.

**Depende de:** 1. O prazo final na tarefa rápida.

**Onde vale:** Tarefas › Rápidas, na tabela, no kanban, nos filtros e no painel da tarefa.

**Protótipo:** https://pernalombr4.github.io/prototipos/prazo-final-nas-tarefas/, área Tarefas Rápidas. "Kanban", no topo, troca a visualização.

## Tabela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF005 | A tabela de Tarefas Rápidas deve ter a coluna "Prazo final", depois da coluna "Vencimento". | Tarefa sem prazo final mostra a célula vazia. | Essencial | Obrigatório |
| RF012 | A coluna "Prazo final" deve permitir filtrar pelo prazo final, como as colunas de data que já filtram. | Exemplo: prazo final até 25/11 deixa só as tarefas com prazo final até 25/11. | Importante | Obrigatório |
| RF008 | O sistema deve permitir ordenar a tabela de Tarefas Rápidas pelo prazo final, com as tarefas sem prazo final no fim. | Ordem crescente e decrescente; sem prazo final, no fim nas 2. | Desejável | Opcional |

## Filtros (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF007 | Os filtros da tela de Tarefas Rápidas devem oferecer o prazo final, na tabela e no kanban, com as opções do filtro de vencimento. | O campo de data do filtro da barra lista Criado em, Vencimento e Prazo final. | Importante | Obrigatório |
| RF020 | A tela de Tarefas Rápidas deve oferecer um atalho que filtra as tarefas com o prazo final vencido, com a contagem delas, na tabela e no kanban. | Com 2 tarefas no estado, o botão diz "Prazo final vencido (2)" e, ligado, deixa só as 2. Sem nenhuma, o botão não aparece. | Desejável | Opcional |

## Kanban (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF006 | Quando a tarefa rápida tem prazo final, o cartão do kanban deve mostrar o prazo final depois do vencimento. | O cartão mostra as 2 datas, cada uma com o ícone próprio. | Essencial | Obrigatório |

## Prazo final vencido (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF019 | Quando a tarefa rápida está com o prazo final vencido (RN006), a tabela deve mostrar o selo "Vencido" na célula do prazo final, e o cartão do kanban e o painel da tarefa devem mostrar o selo "Prazo final vencido", no lugar do selo "Atrasada". | A tarefa da RN006 mostra o selo nos 3 lugares e não mostra "Atrasada"; a tarefa só atrasada (RN005) continua com "Atrasada". | Importante | Desejável |

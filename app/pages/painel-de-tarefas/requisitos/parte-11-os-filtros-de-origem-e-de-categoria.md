# 11. Os filtros de origem e de categoria

**Objetivo:** o gestor recorta o painel pelas tarefas que uma pessoa criou ou pelas que um fluxo criou, e pelas categorias dos itens.

**Depende de:** 1. A tela do painel e os filtros.

**Onde vale:** a barra de filtros de Tarefas › Painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP desligado. Os filtros Origem e Categoria ficam entre Período e Responsável.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN501 | A tabela a seguir define a origem de cada tarefa. Política: Única. | Linha 2: a tarefa que o nó do Spaceflow criou é "Criada por fluxo". | Obrigatório |

| Linha | Tarefa | Condição | Origem |
|---|---|---|---|
| 1 | de Rápidas | `node_execution` vazio | Criada manualmente |
| 2 | de Rápidas | `node_execution` preenchido | Criada por fluxo |
| 3 | de Agendadas | cada tarefa | Criada por fluxo |

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN502 | A categoria de uma tarefa de Rápidas é a categoria do item ligado à tarefa, e a de uma tarefa de Agendadas é a categoria do item no fluxo (`item_type_name`). A tarefa de Rápidas sem item fica sem categoria. | Com a categoria "Contratos" escolhida, a tarefa de Rápidas sem item fica fora do painel. | Obrigatório |

## Os filtros (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | A barra de filtros deve ter o filtro "Origem", com "Todas as origens", "Criadas manualmente" e "Criadas por fluxo" (RN501), e abrir em "Todas as origens". | O filtro aparece depois de "Período". | Importante | Obrigatório |
| RF502 | A barra de filtros deve ter o filtro "Categoria", de escolha múltipla, com as categorias que têm tarefa no workspace (RN502). | Exemplo: sem escolha, mostra "Todas as categorias"; com 2, "2 categorias". | Importante | Obrigatório |
| RF503 | Quando o membro muda a origem ou a categoria, cada painel deve recalcular com o filtro novo. | Exemplo: "Criadas manualmente" tira de Vencidas cada tarefa de Agendadas. | Importante | Obrigatório |
| RF504 | "Limpar filtros" deve aparecer também com a origem ou a categoria escolhida, e voltar a origem para "Todas as origens" e a categoria para "Todas as categorias", mantendo o período. | Exemplo: com "Criadas por fluxo" e "Contratos", o clique deixa os 2 filtros vazios. | Importante | Obrigatório |
| RF505 | Com a origem "Criadas manualmente", o painel Tempo médio de duração deve mostrar, em "Por fluxo" e em "Por etapa", que a tarefa criada manualmente não tem etapa nem fluxo e pedir a troca da origem. | O texto está no protótipo; "Por tarefa" continua com a linha "Tarefas criadas manualmente". | Importante | Obrigatório |

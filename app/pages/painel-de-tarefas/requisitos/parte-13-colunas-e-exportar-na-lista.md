# 13. Colunas e Exportar na lista

**Objetivo:** o gestor escolhe as colunas da lista do recorte e leva a lista para fora do ENSPACE num arquivo.

**Depende de:** 2. A lista do recorte.

**Onde vale:** a barra de cima da lista lateral de Tarefas › Painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP desligado. Clique num número; "Colunas" e "Exportar" ficam à direita da busca.

## Colunas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF601 | A lista deve ter o menu "Colunas", com 1 caixa de marcar por coluna, menos Tarefa, que esconde e mostra a coluna. | Exemplo: desmarcar "Fluxo e etapa" tira a coluna da tabela. | Desejável | Opcional |
| RF602 | O menu "Colunas" deve ter a coluna "Criada em", que abre desmarcada. | Marcar "Criada em" mostra a coluna, e o título dela ordena a tabela. | Desejável | Opcional |

## Exportar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF603 | A lista deve ter o botão "Exportar", que baixa a lista do recorte num arquivo CSV. | Exemplo: "Exportar" na lista de Vencidas com 113 tarefas baixa um CSV com 113 linhas de tarefa. | Desejável | Opcional |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P601 | O CSV leva cada tarefa do recorte ou só as que a busca deixou? E leva cada coluna ou só as visíveis? | produto | Define as linhas e as colunas do arquivo de RF603 |
| P602 | A escolha de colunas vale só enquanto a lista está aberta, ou fica guardada para a próxima lista do membro? | produto | Com "fica guardada", a escolha vira preferência do membro |

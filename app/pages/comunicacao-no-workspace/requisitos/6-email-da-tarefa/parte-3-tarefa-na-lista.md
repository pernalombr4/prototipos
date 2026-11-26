# 3. A tarefa na lista de mensagens e na Mail Box do item

**Objetivo:** a pessoa vê, filtra e lê a tarefa de cada e-mail na lista de mensagens, e a Mail Box do item mostra a que
tarefa cada e-mail pertence.

**Depende de:** 1. Vincular a tarefa no compositor.

**Onde vale:** a lista da central Comunicações (tabela, filtro da coluna e leitura no painel lateral) e a Mail Box
do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 3 · Tarefa", abra
Comunicações: a coluna Tarefa fica depois de Item.

## Na lista de mensagens (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | A tabela da lista de mensagens deve ter a coluna "Tarefa", depois de "Item", com a referência da tarefa vinculada ao e-mail. | O e-mail de CTR-00231 vinculado a T-1042 mostra "T-1042" na coluna; o e-mail sem tarefa fica com a célula vazia. | Essencial | Obrigatório |
| RF202 | A coluna "Tarefa" deve estar entre as que "Colunas" esconde e mostra. | Desmarcar Tarefa em "Colunas" tira a coluna da tabela. | Importante | Obrigatório |
| RF203 | O cabeçalho da coluna "Tarefa" deve ter o funil do filtro de seleção, com busca, "Todos" e "Limpar", e uma opção por referência de tarefa presente nos e-mails da lista. | Escolher T-1042 no filtro deixa só os e-mails de T-1042. | Importante | Obrigatório |
| RF204 | A leitura no painel lateral deve mostrar o campo "Tarefa" com a referência da tarefa, quando o e-mail tem tarefa. | Clique no e-mail de T-1042: o painel mostra Tarefa "T-1042"; no e-mail sem tarefa, o campo não aparece. | Importante | Obrigatório |

## Na Mail Box do item (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF211 | Na Mail Box do item, a linha do e-mail vinculado a uma tarefa deve mostrar a referência da tarefa. | Mail Box de CTR-00231: o e-mail de T-1042 mostra "T-1042" ao lado do assunto. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | O e-mail que o sistema envia por uma tarefa entra também na coluna "Tarefa" e no filtro dela? Hoje ele mostra a tarefa em "Enviado por" ("Sistema · T-1042"). | produto | Com a coluna, a linha do sistema mostra a referência nos 2 lugares |
| P202 | O clique na referência da tarefa abre o painel da tarefa? O protótipo mostra só a referência. | produto | Com o clique, a referência vira botão nas 3 telas |

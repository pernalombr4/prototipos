# 10. Tarefas por prioridade

**Objetivo:** o gestor vê quantas tarefas abertas há em cada prioridade e abre a lista de cada uma.

**Depende de:** 1. A tela do painel e os filtros; 2. A lista do recorte.

**Onde vale:** o painel "Tarefas por prioridade" de Tarefas › Painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP desligado. Clique numa coluna de Tarefas por prioridade.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN451 | A prioridade de uma tarefa de Rápidas é o `priority` dela: `urgent` é Urgente, `high` é Alta, `normal` é Normal e `low` é Baixa. | A tarefa do Spaceflow com `priority: high` conta em Alta. | Obrigatório |
| RN452 | A tarefa de Agendadas fica sem prioridade, porque grava `priority: "0"`. | A tarefa da etapa Análise fica fora das colunas e conta em "Tarefas de etapa, sem prioridade". | Obrigatório |

## O gráfico (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF451 | O painel deve mostrar 1 coluna por prioridade das abertas agora (RN451), na ordem Urgente, Alta, Normal e Baixa, com o total em cima de cada coluna. | Exemplo: 4 colunas com 3, 9, 145 e 4. | Importante | Obrigatório |
| RF452 | Cada coluna deve ter a cor da prioridade: Urgente em vermelho, Alta em amarelo, Normal em cinza e Baixa na cor de informação. | As cores são as da prioridade em Tarefas › Rápidas. | Importante | Desejável |
| RF453 | O clique numa coluna deve abrir a lista das abertas daquela prioridade, pelo prazo, da mais antiga à mais distante. | Exemplo: o clique em Urgente abre a lista "Urgente" com as 3. | Importante | Obrigatório |
| RF454 | O resumo da lista de uma prioridade deve mostrar cada prioridade com o número e a porcentagem, a clicada em destaque, a situação do prazo das tarefas da lista (RN907, linhas 1 a 4) e quantas tarefas abertas ficaram sem prioridade (RN452). | Exemplo: "Urgente" 3 · 2% em destaque, "Vencida" 1, "Tarefas de etapa, sem prioridade" 17. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P451 | A tarefa de Agendadas vai ganhar prioridade? Sem ela, o painel mostra só as tarefas de Rápidas, e em develop 145 de 161 são Normal. | produto e Time de back | Com prioridade na tarefa de Agendadas, RN452 sai e a tarefa de etapa entra nas colunas |

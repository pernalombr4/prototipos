# 1. O prazo final na tarefa rápida

**Objetivo:** o membro informa, altera e apaga o prazo final de uma tarefa rápida, sempre igual ou posterior ao vencimento, na criação e no painel da tarefa.

**Onde vale:** Tarefas › Rápidas, no modal Nova tarefa e no painel da tarefa; a API de tarefas.

**Protótipo:** https://pernalombr4.github.io/prototipos/prazo-final-nas-tarefas/, área Tarefas Rápidas. "Nova tarefa" abre a criação; clicar numa tarefa abre o painel. O papel "Só vê as datas", na barra do protótipo, mostra as datas só para leitura.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 (em revisão) | Cada tarefa rápida pode ter 0 ou 1 prazo final. | Tarefa sem prazo final é válida. | Obrigatório |
| RN003 (em revisão) | O prazo final aceita o tipo de valor que o vencimento aceita. | Vencimento só com data: prazo final só com data. | Obrigatório |

## Criação e edição (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Quando o membro cria uma tarefa rápida, o sistema deve oferecer o campo "Prazo final" logo abaixo do "Vencimento". | O modal Nova tarefa mostra Vencimento e, abaixo, Prazo final, os 2 opcionais. | Essencial | Obrigatório |
| RF002 | Quando o membro abre o painel da tarefa rápida, o sistema deve mostrar o prazo final e permitir alterá-lo, conforme RN002. | Exemplo: prazo final alterado para 27/11; o toast confirma, e a tabela mostra 27/11. | Essencial | Obrigatório |
| RF003 | O sistema deve permitir apagar o prazo final de uma tarefa rápida, conforme RN002. | O X do campo apaga o prazo final, e a coluna fica vazia. | Essencial | Obrigatório |
| RF004 | Se o membro não tem permissão para alterar o vencimento, o sistema deve mostrar o prazo final só para leitura (RN002). | As 2 datas aparecem como texto, com o aviso do papel. | Essencial | Obrigatório |
| RF038 | Cada campo de data deve mostrar a instrução acima e a ajuda abaixo, com os textos do protótipo. | Vencimento: "Data planejada para a conclusão da tarefa." e "Depois desta data, a tarefa é marcada como atrasada." Prazo final: "Data em que a tarefa precisa estar concluída, como um prazo legal ou contratual." e "O prazo final deve ser igual ou posterior ao vencimento e não altera o atraso." | Importante | Desejável |

## Validação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF013 | Se o membro informa um prazo final anterior ao vencimento, o sistema deve recusar o valor e mostrar o aviso no próprio campo (RN004). | Exemplo: vencimento 20/11, prazo final 18/11: "O prazo final precisa ser igual ou posterior ao vencimento (20/11/2026)." A tarefa fica como estava. | Essencial | Obrigatório |
| RF014 | Se o membro altera o vencimento para depois do prazo final, o sistema deve recusar o valor e mostrar o aviso no próprio campo (RN004). | Exemplo: prazo final 25/11, vencimento 27/11: "O vencimento precisa ser igual ou anterior ao prazo final (25/11/2026)." | Essencial | Obrigatório |

## O nome "Vencimento" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF018 | O vencimento da tarefa rápida deve se chamar "Vencimento" (en "Due date", es "Vencimiento") em cada tela que o mostra. | Painel da tarefa, criação, coluna da tabela, filtro, Nova Visualização, Relatório Padrão, opções de data da Agenda e variáveis do Spaceflow mostram "Vencimento"; nenhum mostra "Prazo" nem "Data limite" para essa data. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Rotas que leem e gravam a tarefa rápida <a definir> | Devem receber e devolver o prazo final no campo <a definir>, com as permissões da RN002. | Obrigatório |
| RI002 | Rotas que gravam a tarefa rápida <a definir> | Devem recusar a gravação que fere a RN004, com erro de validação no status <a definir>, sem alterar a tarefa. | Obrigatório |

## Transição (RT)

| ID | Requisito | Como conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT001 (em revisão) | Na entrada da funcionalidade, cada tarefa rápida existente deve ficar com o prazo final vazio, sem cópia do vencimento. | Nenhuma tarefa anterior à entrada tem prazo final. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P8 | O texto do aviso de RF013 e RF014 é o do protótipo? | Produtos | Texto do aviso |
| P9 | A tarefa pode ter prazo final sem vencimento? O protótipo aceita, porque nenhuma regra proíbe. | Produtos | RN001 e RN004 |
| S1 | O tipo de valor do prazo final segue o do vencimento (RN003). | Back-end | RN003 |
| S2 | As tarefas existentes começam sem prazo final (RT001). | Produtos | RT001 |

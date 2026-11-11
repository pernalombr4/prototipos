# 5. Tarefa dentro do item

**Objetivo:** a tarefa rápida ligada a um item mostra o vencimento, o prazo final e o prazo final vencido também na tela do item.

**Depende de:** 1. O prazo final na tarefa rápida; 2. Tabela, kanban e prazo final vencido.

**Onde vale:** a tela do item, na pasta Tarefas e no painel da tarefa aberto dali.

**Protótipo:** https://pernalombr4.github.io/prototipos/prazo-final-nas-tarefas/, área Item, com CTR-0142 ou PRC-0087 na barra do protótipo. Só a pasta Tarefas tem conteúdo.

## A tela do item (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF028 | Em cada lugar da tela do item onde a tarefa rápida ligada ao item aparece, o sistema deve mostrar o vencimento, o prazo final e, na tarefa da RN006, o selo "Vencido" na célula do prazo final, como em Tarefas Rápidas. | Exemplo: item CTR-0142 com 4 tarefas rápidas; a pasta Tarefas mostra as 2 datas de cada uma, e "Coletar as assinaturas do aditivo" (21/11 e 21/11, hoje 22/11) mostra o selo "Vencido" no prazo final. | Essencial | Obrigatório |
| RF029 | Quando o membro abre a tarefa rápida pela tela do item, o painel da tarefa deve mostrar o prazo final e permitir alterá-lo e apagá-lo, conforme RN002. | O prazo final se altera e se apaga ali; o papel que só vê o vencimento vê o prazo final só para leitura. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P13 | A pasta Tarefas do item mostra hoje as tarefas rápidas ligadas ao item? O protótipo não conferiu o conteúdo de hoje. | Develop, num item com tarefa rápida | Onde o RF028 se aplica dentro do item |

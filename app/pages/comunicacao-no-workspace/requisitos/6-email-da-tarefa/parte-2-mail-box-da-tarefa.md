# 2. Mail Box da tarefa

**Objetivo:** na Mail Box do painel da tarefa, a pessoa lê os e-mails da própria tarefa ou todos os do item, sem sair
do painel.

**Depende de:** 1. Vincular a tarefa no compositor.

**Onde vale:** Tarefas › Rápidas, o painel da tarefa com item, aba Mail Box.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 3 · Tarefa", abra
T-1042 e a aba Mail Box: o seletor "Desta tarefa" e "Do item CTR-00231" fica acima de Recebidos e Enviados.

## Recortes da Mail Box (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | A aba Mail Box do painel da tarefa com item deve ter o seletor "Desta tarefa" e "Do item <referência>", acima de Recebidos e Enviados, aberto em "Desta tarefa". | Abrir T-1042 › Mail Box mostra "Desta tarefa" escolhido e "Do item CTR-00231" ao lado. | Essencial | Obrigatório |
| RF102 | Em "Desta tarefa", Recebidos e Enviados devem listar só os e-mails vinculados à tarefa (RN901). | Exemplo: CTR-00231 com 3 e-mails e 2 vinculados a T-1042; "Desta tarefa" mostra só esses 2. | Essencial | Obrigatório |
| RF103 | Em "Do item <referência>", Recebidos e Enviados devem listar cada e-mail do item, como a Mail Box do item. | "Do item CTR-00231" mostra os 4 e-mails. | Essencial | Obrigatório |
| RF104 | Em "Do item <referência>", a linha do e-mail vinculado a uma tarefa deve mostrar a referência da tarefa; em "Desta tarefa", a linha não repete a referência. | Em "Do item CTR-00231", o e-mail de T-1042 mostra "T-1042"; em "Desta tarefa", não. | Importante | Obrigatório |
| RF105 | Se "Desta tarefa" não tem e-mail, a lista deve mostrar "Nenhum e-mail encontrado.", a descrição "Os e-mails vinculados a esta tarefa aparecem nesta lista. Os demais e-mails do item estão em "Do item"." e o botão "Novo e-mail". | Tarefa T-1043 sem e-mail vinculado: "Desta tarefa" mostra o vazio com "Novo e-mail". | Importante | Obrigatório |
| RF106 | A contagem de não lidos da aba Mail Box deve somar, sem repetir, os recebidos não lidos do item e os vinculados à tarefa. | CTR-00231 com 1 recebido não lido, vinculado a T-1042: a aba Mail Box de T-1042 mostra 1. | Importante | Obrigatório |
| RF107 | O e-mail aberto por "Responder" na Mail Box da tarefa deve vir com a tarefa aberta vinculada quando o e-mail original não tem tarefa. | Em "Do item CTR-00231" de T-1042, responder a um e-mail sem tarefa abre o compositor com T-1042. | Desejável | Desejável |

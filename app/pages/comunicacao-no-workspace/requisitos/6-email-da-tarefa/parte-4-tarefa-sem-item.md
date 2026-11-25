# 4. Tarefa sem item

**Objetivo:** a tarefa que não tem item recebe e-mails vinculados a ela, e a Mail Box do painel dessa tarefa mostra
esses e-mails.

**Depende de:** 1. Vincular a tarefa no compositor; 2. Mail Box da tarefa; o registro do e-mail enviado sem item, do
épico "E-mail sem item e lista por permissão".

**Onde vale:** o compositor sem item vinculado; Tarefas › Rápidas, o painel da tarefa sem item (aba Mail Box) e o
quadro de tarefas.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 3 · Tarefa", abra
"Pedir ficha de cadastro ao fornecedor novo" (T-1045), que não tem item, e a aba Mail Box.

## Vincular sem item (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | Sem item vinculado, a lista de "Vincular a tarefa" deve ter "Nenhuma tarefa" e as tarefas do workspace, no formato "<referência> · <nome>". | "Novo e-mail" na tela inicial: a lista mostra T-1042, T-1045 e as outras tarefas. | Importante | Obrigatório |
| RF302 | Cada abertura do compositor a partir de uma tarefa sem item deve trazer a tarefa vinculada, sem item: "Novo e-mail" do topo com o painel da tarefa aberto, "Novo e-mail" da Mail Box da tarefa e o e-mail para o responsável. | Painel de T-1045 aberto e "Novo e-mail" do topo: o compositor abre sem item e com T-1045. | Importante | Obrigatório |
| RF303 | O e-mail sem item com tarefa vinculada deve ficar gravado no ENSPACE com a tarefa. | Exemplo: envio com T-1045 e sem item; o e-mail aparece na aba Mensagens com "T-1045" na coluna Tarefa e "Sem item" na coluna Item. | Importante | Obrigatório |

## Mail Box da tarefa sem item (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF311 | A aba Mail Box da tarefa sem item deve listar os e-mails vinculados à tarefa, em Recebidos e Enviados, sem o endereço do item e sem o seletor "Desta tarefa" e "Do item", no lugar do vazio "Tarefa sem item". | Painel de T-1045 › Mail Box: aparece o e-mail enviado com T-1045, com o botão "Novo e-mail". | Importante | Obrigatório |
| RF312 | No quadro de tarefas, o clique direito no cartão da tarefa sem item deve mostrar "Abrir a Mail Box". | Clique direito no cartão de T-1045: o menu tem "Abrir tarefa" e "Abrir a Mail Box". | Desejável | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | A tarefa sem item tem Mail Box própria? | produto e dev do back | Sem Mail Box própria, esta parte sai, e a tarefa sem item continua com o vazio "Tarefa sem item" |
| P302 | Sem item, a lista de "Vincular a tarefa" mostra cada tarefa do workspace ou só as que a pessoa vê? | produto | Com recorte, o RF301 lista só as tarefas visíveis à pessoa |
| P303 | Sem item, escolher uma tarefa que tem item vincula também o item da tarefa? No protótipo, o item continua vazio. | produto | Com o item, o e-mail vai para a Mail Box do item, e a resposta volta para o endereço dele |
| P304 | A tarefa sem item não tem endereço de resposta. A resposta ao e-mail dela volta para onde: o Outlook de quem enviou ou a caixa do "De"? | produto e dev do back | Sem retorno ao ENSPACE, Recebidos da tarefa sem item fica vazio |

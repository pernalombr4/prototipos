# 2. Mail Box em todo item e na tarefa

**Objetivo:** cada item tem a aba Mail Box, sem a pasta precisar ser adicionada na categoria, e o painel da tarefa
mostra a Mail Box do item dela. Nas 2, a pessoa lê, escreve e responde.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo.

**Onde vale:** a tela do item, aba Mail Box; Tarefas › Rápidas, painel da tarefa, aba Mail Box.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Abra CTR-00231 e a aba Mail Box;
em Tarefas › Rápidas, abra uma tarefa e a aba Mail Box.

## Mail Box do item (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | Cada item deve ter a aba Mail Box, também na categoria que não tem a pasta Mail Box adicionada. | Um item de "Fornecedores", categoria sem a pasta, mostra a aba Mail Box. | Essencial | Obrigatório |
| RF102 | O cabeçalho da Mail Box deve mostrar o endereço do item, com o botão "Copiar o endereço da caixa" (RN904). | Copiar põe o endereço de CTR-00231 na área de transferência. | Importante | Obrigatório |
| RF103 | O cabeçalho deve ter o botão "Novo e-mail", com rótulo, no lugar do lápis de hoje; o botão abre o compositor vinculado ao item, com o 1º contato do item em Para (RN906, RN908). | Em CTR-00231, "Novo e-mail" abre o compositor com CTR-00231 vinculado e "marina.alves@example.com" em Para. | Essencial | Obrigatório |
| RF104 | A Mail Box deve ter as abas Recebidos e Enviados, com a quantidade de e-mails não lidos em Recebidos. | Em CTR-00231, com 1 recebido não lido, a aba diz Recebidos com 1. | Importante | Obrigatório |
| RF105 | Cada linha deve mostrar o remetente ou o destinatário, o assunto e um trecho do texto; a linha do enviado diz "Enviado por <nome> pelo ENSPACE". | O e-mail que Ana enviou mostra "Enviado por Ana Ribeiro pelo ENSPACE". | Importante | Obrigatório |
| RF106 | O hover da linha deve mostrar o botão "Responder" (RN914). | Hover na linha de "Minuta revisada" mostra "Responder". | Importante | Obrigatório |
| RF107 | O e-mail aberto deve ter "Responder" e, no recebido, "Marcar como não lido" (RN914). | Abrir um recebido e clicar em "Marcar como não lido" volta a contagem de não lidos. | Importante | Obrigatório |
| RF108 | Sem e-mail no item, a Mail Box deve mostrar "Nenhum e-mail encontrado.", a explicação e o botão "Novo e-mail". | Um item novo, sem e-mail, mostra o vazio com o botão. | Importante | Obrigatório |
| RF109 | A Mail Box deve listar só os e-mails ligados ao item, sem os e-mails que tarefas e fluxos enviam (RN915). | O e-mail do fluxo de renovação de CTR-00231 não aparece em Enviados. | Essencial | Obrigatório |
| RF110 | Sem a conta do Outlook integrada, a Mail Box deve continuar mostrando os e-mails; "Novo e-mail" e "Responder" abrem o compositor com o aviso de conta não integrada. | No cenário "Sem Outlook integrado", a lista aparece, e "Novo e-mail" abre o aviso "Nenhuma conta integrada disponível.". | Essencial | Obrigatório |

## Mail Box da tarefa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF121 | O painel da tarefa deve ter as abas Detalhes e Mail Box. | Abrir T-1042 mostra as 2 abas, com Detalhes aberta. | Essencial | Obrigatório |
| RF122 | A aba Mail Box da tarefa deve mostrar a Mail Box do item da tarefa, com a quantidade de não lidos no nome da aba. | T-1042, ligada a CTR-00231, mostra os e-mails de CTR-00231. | Essencial | Obrigatório |
| RF123 | Na tarefa sem item, a aba Mail Box deve mostrar "Tarefa sem item" e "A Mail Box é do item. Esta tarefa não tem item vinculado, por isso não tem e-mails.". | Uma tarefa rápida sem item mostra o vazio com o motivo. | Importante | Obrigatório |
| RF124 | "Novo e-mail" na Mail Box da tarefa deve abrir o compositor vinculado ao item da tarefa (RN906). | Em T-1042, o compositor abre vinculado a CTR-00231. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Tirar a exigência da pasta Mail Box afeta alguma categoria que esconde a Mail Box de propósito? | dev e produto | Se afeta, a categoria precisa de um jeito de esconder a aba |

# 5. Atalho nas tarefas

**Objetivo:** a pessoa escreve ao responsável de uma tarefa, por e-mail ou pelo WhatsApp, ou aos responsáveis de
várias tarefas, num e-mail só ou numa fila de conversas do WhatsApp, da lista, do quadro e do painel da tarefa.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo; 2. Mail Box em todo item e na tarefa.

**Onde vale:** Tarefas › Rápidas: a lista, a seleção de várias tarefas, o quadro e o painel da tarefa (aba Detalhes).

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Em Tarefas › Rápidas, na visão
Lista, selecione 3 tarefas; na visão do quadro, clique com o botão direito num cartão.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN401 | O destinatário do atalho da tarefa é o responsável da tarefa (o campo Responsável). O e-mail do responsável é o login do membro. | T-1042, com Bruno Teixeira como responsável, abre o e-mail para bruno.teixeira@example.com. | Obrigatório |
| RN402 | O e-mail da tarefa ligada a um item fica vinculado a esse item (RN906). | O e-mail de T-1042, ligada a CTR-00231, fica na Mail Box de CTR-00231. | Obrigatório |
| RN403 | O e-mail de uma tarefa abre com o assunto "Tarefa: <nome> (prazo <data>)", ou "Tarefa: <nome>" sem prazo, e com o texto do lembrete da tarefa. | "Tarefa: Confirmar data da audiência (prazo 08 de dez.)" e "Olá, Diego. Lembrete da tarefa "Confirmar data da audiência", prazo 08 de dez.". | Obrigatório |
| RN404 | O WhatsApp de uma tarefa vai para o telefone do responsável (P905) e abre com o texto do lembrete da tarefa, o mesmo do e-mail (RN403, RN917). | O WhatsApp de T-1042 abre a conversa com o telefone de Bruno Teixeira e "Olá, Bruno. Lembrete da tarefa...". | Obrigatório |

## Lista de tarefas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | A lista deve ter a coluna "Contato", com o botão de e-mail para o responsável de cada linha e a dica "Enviar e-mail para <nome>" (RN401, RN403, RN909). | A linha de T-1042 tem o botão com "Enviar e-mail para Bruno Teixeira". | Essencial | Obrigatório |
| RF402 | Na tarefa sem responsável, a coluna "Contato" deve mostrar "Sem responsável", com os botões indisponíveis (RN913, RN921). | A tarefa sem responsável mostra "Sem responsável" e os botões de e-mail e de WhatsApp cinza. | Importante | Obrigatório |
| RF403 | A coluna "Contato" deve ter, ao lado do botão de e-mail, o ícone do WhatsApp para o responsável, com a dica "WhatsApp para <nome>" (RN404). Sem telefone válido, o ícone fica indisponível com o motivo (RN921). | A linha de T-1042 tem o ícone com "WhatsApp para Bruno Teixeira"; T-1043, de Carla Nogueira, sem telefone, mostra o ícone cinza com "Sem telefone cadastrado". | Essencial | Obrigatório |

## E-mail em lote (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF411 | Com tarefas selecionadas, a barra da seleção deve ter o botão "E-mail para os <N> responsáveis" ("E-mail para o responsável" com 1), que abre 1 e-mail com cada responsável das tarefas selecionadas em Para (RN909). | 3 tarefas de Diego, Gabriela e Bruno: 1 e-mail com os 3 em Para. | Essencial | Obrigatório |
| RF412 | A barra deve dizer "Abre 1 e-mail com todos os responsáveis em Para." e, com tarefa sem responsável na seleção, quantas ficam de fora. | 4 tarefas, 1 sem responsável: a barra diz "1 tarefa sem responsável fica de fora.". | Importante | Obrigatório |
| RF413 | O e-mail em lote deve abrir com o assunto "<N> tarefas pendentes". | 3 tarefas abrem "3 tarefas pendentes". | Importante | Obrigatório |
| RF414 | Se cada tarefa selecionada está sem responsável, o botão do lote deve ficar indisponível com o motivo (RN913). | Só T-1052, sem responsável, selecionada: o botão fica cinza, com "Sem contato". | Importante | Obrigatório |

## WhatsApp em lote (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF415 | Com tarefas selecionadas, a barra da seleção deve ter, ao lado do e-mail em lote, o botão "WhatsApp para <N> responsáveis" ("WhatsApp para 1 responsável" com 1), que conta só os responsáveis com telefone válido e abre a fila "Avisar pelo WhatsApp" (RN922). | T-1042, T-1044 e T-1045, de Bruno Teixeira, Diego Martins e Fábio Castro, mostram "WhatsApp para 3 responsáveis". | Essencial | Obrigatório |
| RF416 | A dica do botão deve dizer "O WhatsApp abre 1 conversa por vez. Abra a conversa, envie e passe para a próxima.". Sem responsável com telefone válido, o botão fica indisponível com o motivo "Nenhuma pessoa com telefone válido." (RN921). | Só T-1043 e T-1050, de Carla Nogueira, sem telefone, selecionadas: o botão fica cinza, com o motivo. | Importante | Obrigatório |
| RF417 | A fila deve mostrar, no alto, "Ficam de fora, sem telefone válido: <nomes>." quando há responsável sem telefone válido. | Com T-1042, T-1043 e T-1044 selecionadas, a fila mostra "Ficam de fora, sem telefone válido: Carla Nogueira.". | Importante | Obrigatório |
| RF418 | A fila deve mostrar "Conversa <i> de <N>", a barra de progresso e o responsável da vez, com o nome, o telefone e o botão "Abrir conversa", que abre o WhatsApp com o texto da tarefa dele e vira "Aberta" (RN404). | "Abrir conversa" de Bruno Teixeira abre a conversa com o texto de T-1042, e o botão vira "Aberta". | Essencial | Obrigatório |
| RF419 | "Próxima" deve passar para o responsável seguinte; no último, a fila deve mostrar "Todas as conversas foram abertas." e "Fechar". | Depois da 3ª conversa aberta, a fila mostra a frase e "Fechar". | Importante | Obrigatório |

## Quadro e painel da tarefa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF421 | O menu do clique direito no cartão do quadro deve ganhar o nome da tarefa como título e, depois das ações que já tem ("Editar", "Duplicar", "Mover para", "Arquivar", "Enviar para Lixeira", "Copiar Link Externo"), "Abrir a Mail Box", "Enviar e-mail para <nome>", com os 2 caminhos do atalho (RN909), e "WhatsApp para <nome>", com o telefone embaixo (RN404). | Clique direito em T-1042 mostra as ações de hoje, "Abrir a Mail Box", "Enviar e-mail para Bruno Teixeira", que abre o submenu, e "WhatsApp para Bruno Teixeira". | Essencial | Obrigatório |
| RF422 | No cartão da tarefa sem item, o menu deve ficar sem "Abrir a Mail Box". | Uma tarefa rápida sem item mostra as ações de hoje e o e-mail, sem "Abrir a Mail Box". | Importante | Obrigatório |
| RF423 | No cartão da tarefa sem responsável, os itens de e-mail e de WhatsApp devem mostrar "Sem responsável", indisponíveis (RN913, RN921). | O menu da tarefa sem responsável mostra "Sem responsável" cinza no e-mail e no WhatsApp. | Importante | Obrigatório |
| RF424 | "Abrir a Mail Box" deve abrir o painel da tarefa na aba Mail Box. | Em T-1042, o painel abre na aba Mail Box com os e-mails de CTR-00231. | Importante | Obrigatório |
| RF425 | O quadro deve mostrar a dica "Clique no cartão para abrir a tarefa. Com o botão direito, envie e-mail ou WhatsApp ao responsável.". | A dica aparece acima das colunas. | Importante | Obrigatório |
| RF426 | A aba Detalhes do painel deve ter, na seção Responsável, o botão de e-mail, com os 2 caminhos do atalho, e o botão "WhatsApp para <nome>" (RN401, RN403, RN404, RN909). | Em T-1042, a aba Detalhes mostra "Enviar e-mail para Bruno Teixeira" e "WhatsApp para Bruno Teixeira". | Essencial | Obrigatório |
| RF427 | Na tarefa sem responsável, a aba Detalhes deve mostrar "Atribua um responsável para enviar o e-mail." no lugar do botão. | A tarefa sem responsável mostra a frase. | Importante | Obrigatório |

## Restrições (RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS401 | Os atalhos do quadro de tarefas entram no menu do clique direito que o cartão já tem; o cartão não ganha botão. O botão no cartão é o documento "Botão de e-mail no cartão do quadro de itens e de tarefas". | O cartão não ganha botão; o clique direito traz as ações de hoje e o atalho. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S401 | O e-mail em lote sai sem item vinculado, porque as tarefas selecionadas podem ser de itens diferentes. | produto | Com vínculo, falta a regra de qual item escolher |
| S402 | O responsável de 2 ou mais tarefas selecionadas entra 1 vez no Para e 1 vez na fila do WhatsApp, e "<N> responsáveis" conta pessoas, não tarefas. Na fila, o texto é o da 1ª tarefa dele na seleção. | produto | Muda a contagem do botão e o texto da conversa |

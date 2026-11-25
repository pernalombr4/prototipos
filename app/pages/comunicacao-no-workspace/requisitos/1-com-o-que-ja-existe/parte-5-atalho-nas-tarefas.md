# 5. Atalho nas tarefas

**Objetivo:** a pessoa escreve ao responsável de uma tarefa, ou aos responsáveis de várias tarefas num e-mail só, da
lista, do quadro e do painel da tarefa.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo; 2. Mail Box em todo item e na tarefa.

**Onde vale:** Tarefas › Rápidas: a lista, a seleção de várias tarefas, o quadro e o painel da tarefa (aba Detalhes).

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Em Tarefas › Rápidas, na visão
Lista, selecione 3 tarefas; na visão do quadro, clique com o botão direito num cartão.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN401 | O destinatário do atalho da tarefa é o responsável da tarefa (o campo Responsável). O e-mail do responsável é o login do membro. | T-1042, com Diego Martins como responsável, abre o e-mail para diego.martins@aurora.com.br. | Obrigatório |
| RN402 | O e-mail da tarefa ligada a um item fica vinculado a esse item (RN906). | O e-mail de T-1042, ligada a CTR-00231, fica na Mail Box de CTR-00231. | Obrigatório |
| RN403 | O e-mail de uma tarefa abre com o assunto "Tarefa: <nome> (prazo <data>)", ou "Tarefa: <nome>" sem prazo, e com o texto do lembrete da tarefa. | "Tarefa: Confirmar data da audiência (prazo 08 de dez.)" e "Olá, Diego. Lembrete da tarefa "Confirmar data da audiência", prazo 08 de dez.". | Obrigatório |

## Lista de tarefas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | A lista deve ter a coluna "Contato", com o botão de e-mail para o responsável de cada linha e a dica "Enviar e-mail para <nome>" (RN401, RN403, RN909). | A linha de T-1042 tem o botão com "Enviar e-mail para Diego Martins". | Essencial | Obrigatório |
| RF402 | Na tarefa sem responsável, a coluna "Contato" deve mostrar "Sem responsável", com o botão indisponível (RN913). | A tarefa sem responsável mostra "Sem responsável" e o botão cinza. | Importante | Obrigatório |

## E-mail em lote (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF411 | Com tarefas selecionadas, a barra da seleção deve ter o botão "E-mail para os <N> responsáveis" ("E-mail para o responsável" com 1), que abre 1 e-mail com cada responsável das tarefas selecionadas em Para (RN909). | 3 tarefas de Diego, Gabriela e Bruno: 1 e-mail com os 3 em Para. | Essencial | Obrigatório |
| RF412 | A barra deve dizer "Abre 1 e-mail com todos os responsáveis em Para." e, com tarefa sem responsável na seleção, quantas ficam de fora. | 4 tarefas, 1 sem responsável: a barra diz "1 tarefa sem responsável fica de fora.". | Importante | Obrigatório |
| RF413 | O e-mail em lote deve abrir com o assunto "<N> tarefas pendentes". | 3 tarefas abrem "3 tarefas pendentes". | Importante | Obrigatório |
| RF414 | Se cada tarefa selecionada está sem responsável, o botão do lote deve ficar indisponível com o motivo (RN913). | 2 tarefas sem responsável: o botão fica cinza. | Importante | Obrigatório |

## Quadro e painel da tarefa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF421 | O clique direito no cartão do quadro deve abrir um menu com o nome da tarefa como título, "Abrir tarefa", "Abrir a Mail Box" e "Enviar e-mail para <nome>", com os 2 caminhos do atalho (RN909). | Clique direito em T-1042 mostra os 3 itens; "Enviar e-mail para Diego Martins" abre o submenu. | Essencial | Obrigatório |
| RF422 | No cartão da tarefa sem item, o menu deve ficar sem "Abrir a Mail Box". | Uma tarefa rápida sem item mostra só "Abrir tarefa" e o e-mail. | Importante | Obrigatório |
| RF423 | No cartão da tarefa sem responsável, o item de e-mail deve mostrar "Sem responsável", indisponível (RN913). | O menu da tarefa sem responsável mostra "Sem responsável" cinza. | Importante | Obrigatório |
| RF424 | "Abrir a Mail Box" deve abrir o painel da tarefa na aba Mail Box. | Em T-1042, o painel abre na aba Mail Box com os e-mails de CTR-00231. | Importante | Obrigatório |
| RF425 | O quadro deve mostrar a dica "Clique no cartão para abrir a tarefa. Com o botão direito, envie e-mail ao responsável.". | A dica aparece acima das colunas. | Importante | Obrigatório |
| RF426 | A aba Detalhes do painel deve ter o botão de e-mail para o responsável, com os 2 caminhos do atalho (RN401, RN403, RN909). | Em T-1042, o botão "Enviar e-mail para Diego Martins" fica ao lado do responsável. | Essencial | Obrigatório |
| RF427 | Na tarefa sem responsável, a aba Detalhes deve mostrar "Atribua um responsável para enviar o e-mail." no lugar do botão. | A tarefa sem responsável mostra a frase. | Importante | Obrigatório |

## Restrições (RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS401 | O quadro de tarefas deve usar o `EnKanbanBoard` do SDK como está: o atalho fica no clique direito, sem botão no cartão. Imposta por: o `EnKanbanBoard` não aceita ação extra no cartão. | O cartão não ganha botão; o clique direito traz o menu. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S401 | O e-mail em lote sai sem item vinculado, porque as tarefas selecionadas podem ser de itens diferentes. | produto | Com vínculo, falta a regra de qual item escolher |
| S402 | O responsável de 2 ou mais tarefas selecionadas entra 1 vez no Para, e "<N> responsáveis" conta pessoas, não tarefas. | produto | Muda a contagem do botão |

# 2. Vincular a item no compositor

**Objetivo:** quem escreve um e-mail de qualquer tela busca e escolhe o item do e-mail entre as categorias que pode
ver, troca ou remove o item vindo da tela de origem e recebe no Para os contatos de outros itens.

**Depende de:** o épico "Escrever e-mail de qualquer tela e central Comunicações no menu" (o compositor e o bloco "Item vinculado"). As sugestões
pelo destinatário dependem também do épico "Escolher na categoria de onde vêm o nome e o e-mail do contato".

**Onde vale:** o compositor ("Nova Mensagem"), aberto do "Novo e-mail" da barra do topo, dos atalhos de e-mail, da
Mail Box e da central Comunicações.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Fase "2 · Remetente"; "Novo
e-mail" na tela Início, e o botão E-mail do item CTR-00231.

## Bloco "Vincular a item" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O compositor deve ter o bloco "Vincular a item" "(opcional)", separado dos campos do e-mail, no lugar do bloco "Item vinculado". | Aberto da tela Início, o compositor mostra o bloco com a busca vazia. | Essencial | Obrigatório |
| RF102 | Sem item, o bloco deve mostrar o campo de busca de item, com "Buscar por nome, referência ou ID". | Aberto da tela Início: o campo aparece vazio. | Essencial | Obrigatório |
| RF103 | Com o item escolhido, o bloco deve mostrar o nome, a referência e a categoria do item, com "Trocar" e o X "Remover vínculo" (RN902). | CTR-00231 escolhido: "Contrato de manutenção predial", "CTR-00231 · Contratos", "Trocar" e o X. | Essencial | Obrigatório |
| RF104 | "Trocar" deve abrir a busca no lugar do item, com o botão "Cancelar", que volta ao item escolhido. | Em CTR-00231, "Trocar" mostra a busca; "Cancelar" volta a CTR-00231. | Importante | Obrigatório |
| RF105 | O X "Remover vínculo" deve tirar o item do e-mail e voltar o bloco à busca vazia. | Em CTR-00231, o X deixa o bloco com a busca; a ajuda do De passa a ser a do e-mail sem item. | Importante | Obrigatório |
| RF106 | Aberto a partir de um item, o bloco deve vir com o item vinculado e a linha "Vinculado porque você começou no item. É possível trocar ou remover o vínculo." | Botão E-mail de CTR-00231: o bloco vem com CTR-00231 e a linha. | Essencial | Obrigatório |
| RF107 | Aberto a partir de uma tarefa com item, o bloco deve vir com o item da tarefa e a linha "Vinculado ao item da tarefa. É possível trocar ou remover o vínculo." | Tarefa T-1042, do item CTR-00231: o bloco vem com CTR-00231 e a linha. | Importante | Obrigatório |
| RF108 | Com o item escolhido pela busca ou pela sugestão, o bloco deve ficar sem a linha de origem. | Trocar CTR-00231 por CTR-00219 tira a linha "Vinculado porque você começou no item." | Desejável | Desejável |
| RF109 | Com item vinculado, o envio deve gravar o e-mail no item escolhido, como o envio com item de hoje (RN903). | CTR-00219 escolhido e e-mail enviado: o e-mail aparece na Mail Box de CTR-00219, e a ajuda do De mostra o endereço de CTR-00219. | Essencial | Obrigatório |

## Busca de item (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF110 | Com a busca vazia, a lista deve mostrar os 5 itens atualizados por último, sob "Atualizados por último". | O foco no campo vazio abre a lista com 5 itens. | Essencial | Obrigatório |
| RF111 | Com texto, a lista deve mostrar os 8 itens que mais combinam com o texto, com "<m> de <n> itens". | "contrato" combina com 37 itens: a lista mostra 8 e "8 de 37 itens". | Essencial | Obrigatório |
| RF112 | Com mais de 8 resultados, o rodapé deve mostrar "Mais <n> itens. Continue digitando para achar." | 12 itens combinam: "Mais 4 itens. Continue digitando para achar." | Importante | Obrigatório |
| RF113 | A busca deve procurar na referência, no ID, no nome, na categoria, nos contatos e nos campos de texto do item. | "Lumen" acha CTR-00231 pela contraparte; "47231" acha CTR-00231 pelo ID. | Essencial | Obrigatório |
| RF114 | A busca deve ignorar acento e diferença de maiúsculas. | "MANUTENCAO" acha "Contrato de manutenção predial". | Desejável | Desejável |
| RF115 | Com mais de 1 palavra no texto, a busca deve listar só os itens que têm cada palavra. | "manutenção 2024" acha "Manutenção predial (2024)" e deixa de fora "Contrato de manutenção predial". | Desejável | Desejável |
| RF116 | A lista deve agrupar os itens por categoria, com o nome da categoria no título do grupo. | "Marina" mostra o grupo Contratos com os 3 contratos dela. | Importante | Obrigatório |
| RF117 | Cada resultado deve mostrar a referência, o nome, o ID e a etapa do item. | CTR-00231: "Contrato de manutenção predial", "ID 47231 · Em minuta". | Importante | Obrigatório |
| RF118 | A busca deve listar só os itens que a pessoa pode ver, no workspace atual (RN901). | "CTR-00214", sem permissão para a pessoa, volta sem resultado. | Essencial | Obrigatório |
| RF119 | O rodapé da lista deve mostrar "Só aparecem itens que você pode ver." | O texto aparece com a busca vazia e com texto. | Importante | Obrigatório |
| RF120 | Se o texto não combina com item algum, a lista deve mostrar "Nenhum item com "<texto>"" e a dica "Procure pela referência (CTR-00231), pelo ID ou pelo nome do contato." | "xyz" mostra "Nenhum item com "xyz"" e a dica. | Importante | Obrigatório |

## Sugestões pelo destinatário (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF121 | Sem item vinculado e com o Para preenchido, o bloco deve mostrar acima da busca, em "Sugestões", os itens sugeridos para o e-mail (RN904). | Para marina.alves@example.com: "Sugestões" com CTR-00231, CTR-00219 e CTR-00207. | Importante | Obrigatório |
| RF122 | Cada sugestão deve ter a dica "<nome> é contato deste item". | Hover em CTR-00231: "Marina Alves é contato deste item". | Importante | Obrigatório |
| RF123 | O clique na sugestão deve vincular o item ao e-mail. | O clique em CTR-00219 deixa o bloco com CTR-00219, "Trocar" e o X. | Importante | Obrigatório |
| RF124 | Sem o contato configurado nas categorias (épico "Escolher na categoria de onde vêm o nome e o e-mail do contato"), o bloco deve mostrar só a busca, sem "Sugestões". | Workspace sem o cartão "Contato da categoria" salvo: o Para preenchido não mostra sugestões, e a busca funciona. | Importante | Obrigatório |

## Para com contatos de outros itens (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF125 | O autocompletar do Para deve sugerir também os contatos com e-mail dos itens que a pessoa pode ver (RN901), com o e-mail e a referência do item. | Compositor sem item, "rafa" no Para: sugere Rafael Monteiro, "rafael.monteiro@example.com · CTR-00230". | Importante | Obrigatório |
| RF126 | Cada endereço deve aparecer 1 vez nas sugestões do Para, mesmo quando é contato de mais de 1 item. | marina.alves@example.com, contato de 3 contratos, aparece 1 vez. | Desejável | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Quantos contatos de outros itens o Para sugere, e a busca deles usa a mesma rota da busca de item? | dev do back | O limite da lista do Para e a rota que a alimenta |
| S101 | Os contatos de um item, na busca e no Para, seguem a regra vigente: os campos de e-mail do item ou, com o cartão salvo, o "Contato da categoria". | produto | Sem o épico "Escolher na categoria de onde vêm o nome e o e-mail do contato", a busca procura nos campos de e-mail do item |

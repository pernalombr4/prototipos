# 4. Vincular e trocar depois, na leitura

**Objetivo:** na lista de mensagens, a pessoa vincula a um item o e-mail sem item e troca o item de um e-mail já
vinculado. O e-mail passa a aparecer na Mail Box do item escolhido.

**Depende de:** 1. Registro do e-mail enviado sem item; 2. Vincular a item no compositor (a busca de item). As
sugestões pelo destinatário dependem também do épico "Escolher na categoria de onde vêm o nome, o e-mail e o telefone do contato".

**Onde vale:** a lista da central Comunicações: menu da linha, coluna Item e leitura no painel lateral; a Mail Box do
item.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Fase "2 · Remetente"; Comunicações, filtro "Sem item", menu ⋮ de "Cadastro de fornecedor" › "Vincular a um item".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN301 | Um e-mail vinculado a um item aparece na Mail Box do item. | "Cadastro de fornecedor" vinculado a FOR-00040 aparece em Mail Box › Enviados de FOR-00040. | Obrigatório |
| RN302 | O item de um e-mail enviado pelo sistema não muda pela leitura. | O e-mail do sistema da tarefa T-1042 continua em CTR-00231. | Obrigatório |

## Abrir o vínculo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | O menu da linha do e-mail sem item deve trazer "Vincular a um item" no lugar de "Ver Item". | O ⋮ de "Cadastro de fornecedor" mostra "Vincular a um item". | Essencial | Obrigatório |
| RF302 | "Vincular a um item" deve abrir a leitura no painel lateral, com o bloco Item pronto para vincular. | O clique abre a leitura com as sugestões e a busca de item. | Importante | Obrigatório |
| RF303 | A coluna Item do e-mail sem item deve mostrar o botão "Vincular", que abre a leitura como "Vincular a um item". | A linha de "Cadastro de fornecedor" mostra "Vincular" na coluna Item. | Desejável | Desejável |

## Na leitura (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF304 | Na leitura do e-mail sem item, o bloco Item deve mostrar "Este e-mail não tem item. Ao vincular, ele passa a aparecer na aba Mail Box do item.", as "Sugestões pelo destinatário" e a busca de item. | A leitura de "Cadastro de fornecedor" mostra o texto e a busca. | Essencial | Obrigatório |
| RF305 | As "Sugestões pelo destinatário" devem ser os itens sugeridos (RN904) pelo remetente, no e-mail recebido, ou pelos destinatários, no e-mail enviado. | E-mail enviado sem item para marina.alves@example.com: sugere CTR-00231, CTR-00219 e CTR-00207. | Importante | Obrigatório |
| RF306 | Sem o contato configurado nas categorias (épico "Escolher na categoria de onde vêm o nome, o e-mail e o telefone do contato"), o bloco deve mostrar só a busca, sem as sugestões. | Workspace sem o cartão salvo: a leitura mostra o texto e a busca. | Importante | Obrigatório |
| RF307 | A busca de item da leitura deve seguir a busca do compositor: os 5 atualizados por último com a busca vazia, os 8 que mais combinam com o texto, agrupados por categoria, com ID e etapa, só com os itens que a pessoa pode ver (RN901). | "Papelaria" mostra FOR-00040 no grupo Fornecedores; CTR-00214, sem permissão, fica de fora. | Essencial | Obrigatório |
| RF308 | Na leitura do e-mail com item, o bloco Item deve mostrar o item com o botão "Trocar". | A leitura de "CTR-00231 · Minuta revisada" mostra CTR-00231 e "Trocar". | Essencial | Obrigatório |
| RF309 | "Trocar" deve abrir no bloco Item as sugestões, a busca de item e o botão "Cancelar", que volta ao item atual. | O clique em "Trocar" mostra a busca no lugar de CTR-00231; "Cancelar" volta a CTR-00231. | Importante | Obrigatório |
| RF310 | Na leitura do e-mail enviado pelo sistema, o bloco Item deve mostrar só o item, sem "Trocar" (RN302). | O e-mail do sistema de T-1042 mostra CTR-00231 sem o botão. | Importante | Obrigatório |

## Gravar o vínculo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF311 | Quando a pessoa escolhe o item na sugestão ou na busca, o sistema deve gravar o vínculo do e-mail com o item escolhido (RN902, RN903). | "Cadastro de fornecedor" com FOR-00040 escolhido: reabrir a leitura mostra FOR-00040. | Essencial | Obrigatório |
| RF312 | Depois de gravar o vínculo, o aviso deve dizer "E-mail vinculado" e "Aparece na aba Mail Box de <referência>." | "Aparece na aba Mail Box de FOR-00040." | Importante | Obrigatório |
| RF313 | O e-mail vinculado deve aparecer na Mail Box do item escolhido, em Recebidos ou em Enviados, conforme o tipo do e-mail (RN301). | "Cadastro de fornecedor" aparece em Mail Box › Enviados de FOR-00040. | Essencial | Obrigatório |
| RF314 | O e-mail com o item trocado deve sair da Mail Box do item anterior (RN902). | Trocar CTR-00231 por CTR-00219 tira o e-mail da Mail Box de CTR-00231. | Essencial | Obrigatório |
| RF315 | Depois de gravar o vínculo, a coluna Item da linha deve mostrar a referência do item escolhido. | A linha de "Cadastro de fornecedor" mostra FOR-00040 na coluna Item. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | Hoje não há rota para ligar um e-mail sem item a um item, nem para trocar o item. A rota é criada no back? | dev do back | Sem a rota, esta parte não sai |
| P302 | Quem pode vincular e trocar o item de um e-mail: só quem enviou, ou quem vê o e-mail na lista de mensagens? | produto | O botão "Vincular" e o "Trocar" ganham a condição de quem enviou |
| P303 | O e-mail vinculado depois do envio saiu sem o endereço do item em "Responder para": a resposta do destinatário continua chegando só no Outlook de quem enviou? | produto e dev do back | Com outra regra, a resposta precisa ser levada ao item pelo back |
| P304 | A troca do item fica no Logs de Auditoria dos 2 itens? | produto | Os 2 itens ganham a linha da troca no log |

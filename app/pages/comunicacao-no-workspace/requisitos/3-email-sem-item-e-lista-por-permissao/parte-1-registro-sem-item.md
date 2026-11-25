# 1. Registro do e-mail enviado sem item

**Objetivo:** o e-mail enviado pelo ENSPACE sem item vinculado fica gravado e aparece na aba Mensagens da central
E-mails, no lugar de ficar só no Outlook de quem enviou.

**Depende de:** o épico "E-mail com o que o produto já tem" (o compositor, o envio pela conta do Outlook e a aba
Mensagens).

**Onde vale:** o compositor aberto sem item (o "Novo e-mail" da barra do topo fora de um item, o "Novo e-mail" da
central); a central E-mails, aba Mensagens.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Fase "2 · Remetente"; na tela
Início, "Novo e-mail"; em E-mails › Mensagens, o filtro rápido "Sem item".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Cada e-mail enviado pelo ENSPACE fica gravado, com item ou sem item. | O e-mail "Cadastro de fornecedor", sem item, fica no ENSPACE. | Obrigatório |
| RN002 | A resposta a um e-mail sem item, enviado pela conta do Outlook, chega só no Outlook de quem enviou. | fornecedor.novo@example.com responde "Cadastro de fornecedor"; a resposta chega no Outlook de Ana Ribeiro, fora do ENSPACE. | Obrigatório |
| RN003 | O e-mail sem item enviado pela conta do Outlook aparece na aba Mensagens de quem enviou. | Ana Ribeiro, que enviou, vê "Cadastro de fornecedor" na aba Mensagens. | Obrigatório |

## Gravar o e-mail (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Quando a pessoa envia um e-mail pelo ENSPACE sem item vinculado, o sistema deve gravar o e-mail enviado (RN001). | Exemplo: "Novo e-mail" na tela Início, Para fornecedor.novo@example.com, assunto "Cadastro de fornecedor", enviado; o e-mail aparece na aba Mensagens. | Essencial | Obrigatório |
| RF002 | A gravação deve guardar o De, o Para, o Cc, o Cco, o assunto, a mensagem, os anexos, a data do envio e quem enviou, como guarda o e-mail com item. | A leitura de "Cadastro de fornecedor" mostra De, Para, Enviado por, a data e o corpo. | Essencial | Obrigatório |

## No compositor (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF003 | Sem item vinculado, a ajuda do De deve dizer "Sem item vinculado, a resposta chega só no seu Outlook." (RN002), no lugar de "Sem item vinculado, o e-mail fica só no seu Outlook e não aparece no ENSPACE." | "Novo e-mail" na tela Início: a ajuda embaixo do De mostra o texto novo. | Importante | Obrigatório |
| RF004 | Depois do envio sem item, o aviso deve dizer "Enviado de <remetente>, sem item vinculado. O e-mail fica em E-mails." e trazer o botão "Ver em E-mails". | Envio pela conta ana.ribeiro@example.com: "Enviado de ana.ribeiro@example.com, sem item vinculado. O e-mail fica em E-mails." | Importante | Obrigatório |
| RF005 | "Ver em E-mails" deve abrir a central E-mails na aba Mensagens. | O clique abre Mensagens, com o e-mail enviado no alto da lista, ordenada por Data. | Importante | Obrigatório |

## Na aba Mensagens (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF006 | A aba Mensagens deve listar o e-mail sem item para quem enviou (RN003). | Ana Ribeiro, que enviou, vê "Cadastro de fornecedor", do tipo Enviado, sem item na coluna Item. | Essencial | Obrigatório |
| RF007 | A dica do "i" da aba Mensagens deve dizer "Os e-mails recebidos e enviados pelo ENSPACE, com ou sem item." | Hover no "i" ao lado de "Mensagens" mostra o texto. | Importante | Obrigatório |
| RF008 | Os filtros rápidos devem ganhar "Sem item", que mostra só os e-mails sem item vinculado. | "Sem item" ligado: a lista mostra "Cadastro de fornecedor" e esconde os e-mails de CTR-00231. | Importante | Obrigatório |
| RF009 | O filtro da coluna Item deve ganhar a opção "Sem item". | No funil da coluna Item, "Sem item" aparece antes das referências. | Desejável | Desejável |
| RF010 | A leitura do e-mail sem item no painel lateral deve mostrar Tipo, De, Para, Cc, Enviado por e o corpo, como a leitura do e-mail com item. | Clique na linha de "Cadastro de fornecedor" abre a leitura com os campos. | Importante | Obrigatório |
| RF011 | O menu da linha do e-mail sem item deve trazer "Ver Detalhes" e "Responder", sem "Ver Item". | O ⋮ de "Cadastro de fornecedor" mostra as 2 ações. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S001 | O e-mail cujo envio falha ("E-mail não enviado") fica sem gravação, e o rascunho continua aberto. | dev do back | Com gravação, a aba Mensagens precisa de um estado de falha para o e-mail de pessoa |
| S002 | Até a parte 4. Vincular e trocar depois, na leitura, a célula Item do e-mail sem item mostra "-", como as outras células vazias da tabela. | dev do front | Com a parte 4, a célula ganha o botão "Vincular" |
| S003 | Os e-mails sem item enviados antes do lançamento ficam só no Outlook de quem enviou: não há como trazê-los. | dev do back | Com importação, a aba mostra também os antigos |

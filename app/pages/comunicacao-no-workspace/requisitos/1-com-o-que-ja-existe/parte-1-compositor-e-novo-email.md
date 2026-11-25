# 1. Compositor e Novo e-mail na barra do topo

**Objetivo:** a pessoa escreve um e-mail de qualquer tela, sem sair dela, vê de qual conta ele sai e, com um item na
tela, deixa o e-mail no item. O rascunho fica guardado enquanto ela navega.

**Onde vale:** a barra do topo, em cada tela do workspace; a gaveta "Nova Mensagem", que as outras telas abrem.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Clique em "Novo e-mail" no topo,
numa tela sem item e com o item CTR-00231 aberto. "Cenário: Sem Outlook integrado" e "Cenário: Envio falha" mostram os
2 casos de erro.

## "Novo e-mail" na barra do topo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | A barra do topo deve ter o botão "Novo e-mail", com rótulo, ao lado de Suporte, em cada tela do workspace (RN901). | O botão aparece na lista de itens, na Agenda e na Visão Geral do item. | Essencial | Obrigatório |
| RF002 | Quando a pessoa aperta a tecla C fora de campo de texto, o sistema deve abrir o compositor como o botão "Novo e-mail" abre. | C na lista de itens abre o compositor; C digitado na busca escreve a letra. | Importante | Desejável |
| RF003 | Enquanto há rascunho guardado, o botão "Novo e-mail" deve mostrar um ponto. | Minimizar um rascunho mostra o ponto; enviar ou descartar o tira. | Importante | Obrigatório |
| RF004 | Com um item aberto, "Novo e-mail" deve abrir o compositor vinculado ao item, com o 1º contato do item em Para (RN906, RN908). | Em CTR-00231, o compositor abre com "marina.alves@example.com" em Para e o bloco "Item vinculado" com CTR-00231. | Essencial | Obrigatório |
| RF005 | Com um item aberto, a dica do botão deve dizer "Escrever um e-mail vinculado a <referência>". | Em CTR-00231, a dica diz "Escrever um e-mail vinculado a CTR-00231". | Importante | Obrigatório |
| RF006 | Com uma tarefa aberta no painel, "Novo e-mail" deve abrir o compositor vinculado ao item da tarefa (RN906). | Com T-1042, ligada a CTR-00231, aberta, o compositor abre vinculado a CTR-00231. | Essencial | Obrigatório |
| RF007 | Nas telas sem item nem tarefa com item, "Novo e-mail" deve abrir o compositor sem vínculo e sem o bloco "Item vinculado", com a dica "Escrever um e-mail sem sair desta tela". | Na Agenda, o compositor abre sem o bloco do item. | Essencial | Obrigatório |

## Campos do compositor (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | O compositor deve manter os campos e a ordem da gaveta "Nova Mensagem" de hoje: De, Para, "Adicionar em Cópia" (Cc e Cco), Template, Assunto, Item vinculado, Mensagem, "Anexar arquivo" e "Inserir assinatura". | A ordem na tela é a do protótipo. | Essencial | Obrigatório |
| RF012 | O campo De deve mostrar, só para leitura, a conta do Outlook da pessoa, com a descrição "Sua conta do Outlook" (RN902). | Ana vê "ana.ribeiro@example.com" e "Sua conta do Outlook", sem lista para trocar. | Essencial | Obrigatório |
| RF013 | Com item vinculado, a ajuda do De deve dizer "Responder para: o endereço do item. A resposta volta para a aba Mail Box." e mostrar o endereço do item (RN904). | Em CTR-00231, a ajuda mostra o endereço de CTR-00231. | Essencial | Obrigatório |
| RF014 | Sem item vinculado, a ajuda do De deve dizer "Sem item vinculado, o e-mail fica só no seu Outlook e não aparece no ENSPACE." (RN905). | "Novo e-mail" na Agenda mostra a frase. | Essencial | Obrigatório |
| RF015 | O campo Para deve ser obrigatório e sugerir os contatos do item vinculado e os membros do workspace (RN907). | Em CTR-00231, digitar "mar" sugere "marina.alves@example.com" com o rótulo do campo; digitar "bru" sugere o membro Bruno. | Essencial | Obrigatório |
| RF016 | O campo Para deve aceitar um endereço digitado que não está nas sugestões, pela opção "Usar "<endereço>"". | Digitar "novo@cliente.com" mostra "Usar "novo@cliente.com"". | Importante | Obrigatório |
| RF017 | O campo Template deve listar os Modelos de E-mail do workspace. | No workspace com 3 modelos, o campo lista os 3. | Importante | Obrigatório |
| RF023 | Com item vinculado, escolher um modelo deve preencher o assunto e a mensagem, com as variáveis trocadas pelos dados do item. | Com CTR-00231 vinculado, o modelo "Envio para assinatura" preenche o assunto com a referência CTR-00231. | Importante | Obrigatório |
| RF018 | Sem item vinculado, o modelo deve preencher o assunto e a mensagem sem trocar as variáveis do item. | "Novo e-mail" na Agenda com um modelo: a variável da referência fica vazia. | Importante | Obrigatório |
| RF019 | Com item vinculado, o bloco "Item vinculado" deve mostrar nome, referência e categoria do item, sem "(opcional)", sem Trocar e sem remover, com a ajuda "O e-mail fica na Mail Box de <referência>, e a resposta volta para lá." (RN906). | Em CTR-00231, o bloco mostra "Contrato de manutenção predial", CTR-00231 e Contratos, sem botão de trocar. | Essencial | Obrigatório |
| RF020 | O campo Mensagem deve ser obrigatório, com o editor com negrito, itálico, sublinhado, tachado, lista com marcador, lista numerada e link. | A barra do editor tem os 7 recursos. | Essencial | Obrigatório |
| RF021 | "Anexar arquivo" e "Inserir assinatura" devem funcionar como na gaveta de hoje; "Inserir assinatura" insere a assinatura da conta do Outlook. | Anexar um PDF mostra o arquivo com o botão de remover. | Importante | Obrigatório |
| RF022 | Ao abrir o compositor, o cursor deve ir para o Para; com destinatário já preenchido, para o fim da mensagem. | Do item, o cursor fica na mensagem; da Agenda, no Para. | Importante | Desejável |

## Enviar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF031 | O compositor deve enviar o e-mail pelo botão Enviar e pelo atalho Ctrl+Enter, também dentro do editor. | Ctrl+Enter com o cursor na mensagem envia o e-mail. | Essencial | Obrigatório |
| RF032 | Se o Para está vazio, o sistema deve recusar o envio com "Informe pelo menos 1 destinatário." no campo. | Enviar sem destinatário mostra a frase, e nada sai. | Essencial | Obrigatório |
| RF033 | Se um endereço do Para é inválido, o sistema deve recusar o envio com ""<endereço>" não é um e-mail válido.". | "ana@" no Para mostra ""ana@" não é um e-mail válido.". | Essencial | Obrigatório |
| RF034 | Se a mensagem está vazia, o sistema deve recusar o envio com "Escreva a mensagem antes de enviar.". | Enviar só com assunto mostra a frase. | Essencial | Obrigatório |
| RF035 | Depois do envio com item vinculado, o aviso deve dizer "Vinculado a <referência>. As respostas voltam para o item." e ter o botão "Ver no item", que abre a Mail Box do item. | Enviar de CTR-00231 mostra o aviso; "Ver no item" abre Mail Box › Enviados de CTR-00231. | Essencial | Obrigatório |
| RF036 | Depois do envio sem item vinculado, o aviso deve dizer "Enviado de <remetente>. Sem item vinculado, o e-mail fica só no seu Outlook e não aparece no ENSPACE." (RN905). | Enviar da Agenda mostra o aviso com o endereço de Ana. | Essencial | Obrigatório |
| RF037 | Se o envio falha, o sistema deve mostrar o aviso "E-mail não enviado" e manter o compositor aberto com o rascunho. | No cenário "Envio falha", o texto continua na gaveta depois do aviso. | Essencial | Obrigatório |

## Gaveta e rascunho (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF041 | O compositor deve abrir numa gaveta que não escurece nem trava a página. | Com a gaveta aberta, a pessoa rola e clica na Visão Geral do item. | Essencial | Obrigatório |
| RF042 | Minimizar, Esc e o X devem guardar o rascunho numa barra no rodapé, que continua na troca de tela e reabre o compositor no clique. | Minimizar no item, abrir a Agenda: a barra "Rascunho" continua no rodapé e reabre o texto. | Essencial | Obrigatório |
| RF043 | Expandir deve alargar a gaveta; Reduzir volta à largura inicial. | Expandir mostra a mensagem mais larga; Reduzir volta. | Desejável | Desejável |
| RF044 | Descartar deve apagar o rascunho e mostrar o aviso "Rascunho descartado" com "Desfazer", que devolve o rascunho à gaveta. | Descartar e clicar em "Desfazer" reabre o texto. | Importante | Obrigatório |

## Sem a conta do Outlook integrada (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF051 | Sem a conta do Outlook integrada, o compositor deve mostrar, no lugar do formulário, "Nenhuma conta integrada disponível." e o botão "Integrar contas", que abre Perfil › Integrações (RN902). | No cenário "Sem Outlook integrado", "Novo e-mail" abre a gaveta com o aviso, sem os campos. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | O envio de hoje pela integração do Correio do Outlook (Microsoft) | Recebe Para, Cc, Cco, o endereço de resposta, o assunto, a mensagem, os anexos e a referência do item, como a gaveta "Nova Mensagem" envia hoje. Sem item, sai sem o endereço de resposta e sem a referência do item. | Obrigatório |

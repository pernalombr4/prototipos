# 2. Encaminhar

**Objetivo:** a pessoa encaminha um e-mail do ENSPACE a outro destinatário, com o texto e os anexos do original, e o
encaminhamento fica no item do original.

**Onde vale:** a Mail Box do item e a da tarefa (hover da linha e e-mail aberto), a aba Mensagens da central E-mails
(menu da linha e leitura no painel lateral) e o compositor "Nova Mensagem".

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 2 · Remetente", passe o
mouse num e-mail da Mail Box de CTR-00231 ou abra o menu ⋮ de uma linha da aba Mensagens.

## Onde fica o Encaminhar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | Na Mail Box do item e na da tarefa, o hover da linha do e-mail deve mostrar o botão "Encaminhar" ao lado de "Responder". | Hover num e-mail de CTR-00231: os botões Responder e Encaminhar aparecem; o nome acessível de Encaminhar leva o assunto. | Essencial | Obrigatório |
| RF102 | O e-mail aberto na Mail Box deve ter o botão "Encaminhar" entre "Responder" e "Marcar como não lido". | E-mail recebido aberto: "Responder", "Encaminhar" e "Marcar como não lido". | Essencial | Obrigatório |
| RF103 | Na aba Mensagens, o menu da linha deve ter "Encaminhar" depois de "Responder". | Menu ⋮ de um recebido: "Ver Detalhes", "Responder", "Encaminhar", "Marcar como não lido" e "Ver Item". | Essencial | Obrigatório |
| RF104 | A leitura no painel lateral da aba Mensagens deve ter o botão "Encaminhar" ao lado de "Responder". | Clique numa linha recebida: o painel mostra Responder e Encaminhar. | Essencial | Obrigatório |
| RF105 | O e-mail enviado pelo sistema não deve ter "Encaminhar" (RN902). | Linha "Do sistema": o menu ⋮ e a leitura não mostram "Encaminhar". | Importante | Obrigatório |

## O compositor do encaminhamento (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF111 | Quando a pessoa clica em "Encaminhar", o compositor deve abrir com "Enc:" antes do assunto original, no lugar de um "Re:" ou "Enc:" que o assunto já tenha. | "Re: CTR-00231 · Minuta revisada" encaminhado abre com "Enc: CTR-00231 · Minuta revisada". | Essencial | Obrigatório |
| RF112 | O compositor do encaminhamento deve abrir com o texto original citado na mensagem. | A mensagem abre com uma linha vazia e o texto da minuta citado abaixo. | Essencial | Obrigatório |
| RF113 | O compositor do encaminhamento deve abrir com os anexos do e-mail original. | Encaminhar o e-mail com minuta-v3-comentada.pdf abre com o anexo; a pessoa pode remover o anexo antes de enviar. | Essencial | Obrigatório |
| RF114 | O compositor do encaminhamento deve abrir com o Para vazio. | Encaminhar abre sem destinatário, com o cursor no Para. | Essencial | Obrigatório |
| RF115 | O compositor do encaminhamento deve vir com o item do e-mail original vinculado (RN901). | Encaminhar um e-mail de CTR-00231 abre com CTR-00231 vinculado; o enviado aparece em Mail Box › Enviados de CTR-00231. | Essencial | Obrigatório |
| RF116 | Quando a pessoa envia o encaminhamento, o sistema deve enviar ao destinatário os anexos que ficaram no compositor. | Exemplo: encaminhamento a joao@example.com com minuta-v3-comentada.pdf; o destinatário recebe o PDF. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI101 | Envio pela integração do Correio do Outlook (Microsoft) | Deve aceitar, no encaminhamento, os anexos do e-mail original guardados no ENSPACE, sem a pessoa baixar e subir de novo; o formato fica <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | No protótipo, o encaminhamento mostra o aviso "A resposta segue na mesma conversa do e-mail original.". O encaminhado entra na conversa do original, ou o compositor do encaminhamento fica sem esse aviso? | produto | Sem o aviso, o compositor do encaminhamento não mostra a linha |
| P102 | Se um anexo do original não está mais disponível no ENSPACE, o encaminhamento sai sem ele, com aviso, ou não sai? | dev do back | Ganha a linha do erro do anexo |

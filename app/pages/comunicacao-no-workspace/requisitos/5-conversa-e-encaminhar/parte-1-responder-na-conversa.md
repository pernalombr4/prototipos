# 1. Responder na mesma conversa

**Objetivo:** a resposta escrita pelo ENSPACE chega ao destinatário na mesma conversa do e-mail original, e o
compositor avisa isso.

**Onde vale:** o "Responder" da Mail Box do item e da tarefa (hover da linha e e-mail aberto) e o da lista da central Comunicações (menu da linha e leitura no painel lateral), que o épico "Enviar e-mail, WhatsApp e SMS de qualquer tela e central Comunicações no menu" já põe na
tela.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 2 · Remetente", abra
CTR-00231 › Mail Box e clique em "Responder" no e-mail "Re: CTR-00231 · Minuta revisada".

## Responder (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Quando a pessoa envia um e-mail aberto por "Responder", o sistema deve enviá-lo como resposta da conversa do e-mail original. | Exemplo: resposta ao e-mail de marina.alves@example.com; no Outlook de Marina, a resposta aparece na mesma conversa da minuta. | Essencial | Obrigatório |
| RF002 | O compositor aberto por "Responder" deve mostrar o aviso "A resposta segue na mesma conversa do e-mail original.", no lugar de "A resposta sai como uma mensagem nova, com o texto original citado. Ela não entra na mesma conversa.". | Clique em "Responder" na Mail Box de CTR-00231: o aviso novo aparece no alto do compositor. | Importante | Obrigatório |
| RF003 | O compositor aberto por "Responder" deve vir com "Re:" no assunto, o texto original citado e, em Para, o remetente do recebido ou o 1º destinatário do enviado, como no épico "Enviar e-mail, WhatsApp e SMS de qualquer tela e central Comunicações no menu". | Resposta a "Re: CTR-00231 · Minuta revisada" abre com o assunto "Re: CTR-00231 · Minuta revisada", sem "Re: Re:". | Importante | Obrigatório |
| RF004 | A resposta enviada deve ficar no item do e-mail original (RN901). | A resposta aparece em Mail Box › Enviados de CTR-00231. | Essencial | Obrigatório |
| RF005 | O e-mail enviado pelo sistema não deve ter "Responder" (RN902). | O e-mail "Do sistema" na lista de mensagens mostra só "Ver Detalhes", "Reenviar e-mail" e "Ver Item" no menu da linha. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Envio pela integração do Correio do Outlook (Microsoft) | Deve enviar a resposta ligada à mensagem original na conta do Outlook, com a referência da mensagem original guardada no registro do e-mail; o formato fica <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Se o e-mail original não tem a referência da conversa (recebido antes deste épico, ou de outra conta), a resposta sai como mensagem nova, com o aviso antigo? | dev do back | Ganha a linha do erro: o aviso de mensagem nova volta nesse caso |
| P002 | A Mail Box e a lista de mensagens passam a agrupar os e-mails por conversa? O protótipo mostra cada e-mail numa linha. | produto | Com agrupamento, entra uma parte nova de tela |

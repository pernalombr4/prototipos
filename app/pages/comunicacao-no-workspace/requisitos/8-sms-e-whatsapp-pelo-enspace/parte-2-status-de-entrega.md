# 2. Status de entrega na central

**Objetivo:** quem confere os envios sabe se a mensagem chegou, e não só se saiu. O status diz o que o ENSPACE fez; a
entrega diz o que o provedor respondeu depois.

**Onde vale:** a lista da central "Comunicações" (coluna, filtro e leitura no painel lateral), para quem tem a
permissão de hoje de ver os e-mails enviados.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 4 · Comunicações" e
"Perfil: Admin", abra Comunicações e ligue "Não entregues"; abra o e-mail "CTR-00230 · Vencimento próximo", Devolvido.

## Coluna e filtro (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | A tabela deve ter a coluna Entrega, depois de Status, com a entrega de cada mensagem pela RN905, para quem vê a coluna Status. | O e-mail do fluxo de vencimento de CTR-00230 mostra Devolvido; o e-mail que Ana enviou pelo Outlook mostra "-". | Essencial | Obrigatório |
| RF102 | O "-" de Entrega no e-mail pelo Outlook deve ter a dica "O Outlook não informa a entrega.". | Pairar no "-" mostra a dica. | Desejável | Desejável |
| RF103 | Com a entrega informada, a dica do status Enviado ao provedor deve passar a "O provedor aceitou a mensagem. A coluna Entrega mostra o que aconteceu depois.". | O e-mail Entregue mostra a dica nova no status. | Importante | Obrigatório |
| RF104 | A barra deve ter o filtro rápido "Não entregues", que deixa só as mensagens com o status Falhou ou com a entrega Devolvido, Bloqueado ou Não entregue. | Ligar "Não entregues" mostra o e-mail Devolvido de CTR-00230 e o SMS Não entregue de CTR-00229. | Essencial | Obrigatório |
| RF105 | O funil de Entrega deve filtrar por seleção, com as entregas da RN905 e "Sem valor (-)". | Marcar "Lido" deixa só os WhatsApp lidos. | Importante | Obrigatório |

## Leitura no painel lateral (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF111 | A leitura deve mostrar a linha Entrega e, com a entrega Devolvido, Bloqueado ou Não entregue, o "Motivo" e "Código <código> do provedor". | O e-mail Devolvido de CTR-00230 mostra "A caixa de e-mail do destinatário não existe." e "Código 550 5.1.1 do provedor". | Essencial | Obrigatório |
| RF112 | A leitura deve ter o "Histórico do envio": cada passo do status e da entrega, com a hora. | O WhatsApp lido de CTR-00223 mostra Na fila, Enviado ao provedor, Entregue e Lido, cada um com a hora. | Importante | Obrigatório |
| RF113 | Reenviar uma mensagem deve limpar a entrega, o motivo e o código, e a entrega nova chega com o novo envio. | Reenviar o e-mail Devolvido muda a Entrega para "-" e o status para Na fila. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI101 | Aviso de eventos da SendGrid (Event Webhook), rota pública <a definir> | Deve receber os eventos de entrega (delivered, deferred, bounce, blocked, dropped) de cada e-mail do sistema, conferir a assinatura do aviso e gravar a entrega, o motivo e o código no registro do envio, pelo id da mensagem na SendGrid. | Obrigatório |
| RI102 | Aviso de status da Twilio, que já existe para o WhatsApp do atendimento | Deve gravar a entrega (delivered, read, undelivered, failed), o motivo e o código no registro de cada SMS e WhatsApp enviado pelo número do workspace. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | A entrega do e-mail vem do aviso de eventos da SendGrid ou da consulta à Email Activity API na hora da leitura? A consulta pede complemento pago e tem histórico curto. | dev do back | Com a consulta, a coluna Entrega não filtra nem ordena |
| P102 | O e-mail do sistema que já está no registro antes desta parte fica com a Entrega "-"? | dev do back | Sem a resposta, o filtro "Não entregues" pode deixar de fora o que falhou antes |

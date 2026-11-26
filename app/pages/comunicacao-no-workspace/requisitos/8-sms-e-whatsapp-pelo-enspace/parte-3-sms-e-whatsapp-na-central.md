# 3. SMS e WhatsApp na central

**Objetivo:** quem pergunta "o cliente recebeu?" olha num lugar só: a central "Comunicações" mostra o e-mail, o SMS e
o WhatsApp que o ENSPACE envia, numa tabela, com o filtro por canal, e começa por ela uma mensagem em cada canal.

**Depende de:** 2. Status de entrega na central.

**Onde vale:** a central "Comunicações": o topo da lista, a barra, a tabela, o menu da linha e a leitura no painel
lateral.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 4 · Comunicações", abra
Comunicações; ligue os filtros "SMS" e "WhatsApp" e abra o SMS de CTR-00223.

## Nova mensagem (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | O topo da lista deve ter o botão "Nova mensagem", no lugar de "Novo e-mail", com o menu E-mail, SMS e WhatsApp. "E-mail" abre o compositor sem vínculo. | "Nova mensagem" abre o menu com os 3 canais. | Essencial | Obrigatório |
| RF202 | "SMS" deve abrir o painel "Enviar SMS" sem destinatário, com a descrição "Pelo número do workspace ou pelo seu celular." com a integração Twilio e "Pelo seu celular. Sem a integração Twilio, o ENSPACE não registra o SMS." sem a integração (RN901). | Com "Sem Twilio", o item SMS mostra a 2ª descrição. | Essencial | Obrigatório |
| RF203 | "WhatsApp" deve abrir, com a integração Twilio, o painel "Enviar WhatsApp" sem destinatário, com a descrição "Pelo WhatsApp do workspace, com modelo aprovado, ou pelo seu WhatsApp."; sem a integração, abre o WhatsApp da pessoa sem número, com a descrição "Pelo seu WhatsApp. Sem a integração Twilio, o ENSPACE não registra a conversa." (RN901, RN902). | Com "Sem Twilio", "WhatsApp" abre o WhatsApp Web para escolher a conversa. | Essencial | Obrigatório |

## Lista com os 3 canais (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF211 | A lista deve mostrar o SMS e o WhatsApp enviados pelo número do workspace, ao lado do e-mail, pela RN906. | O SMS do fluxo de vencimento de CTR-00223 aparece na lista de quem administra. | Essencial | Obrigatório |
| RF212 | O "i" do título deve dizer "Os e-mails dos itens e as mensagens que o ENSPACE envia por e-mail, SMS e WhatsApp, com o status de entrega.". | A dica aparece ao lado de "Comunicações". | Importante | Obrigatório |
| RF213 | A barra deve ter os filtros rápidos "E-mail", "WhatsApp" e "SMS". Ligados juntos, somam: "E-mail" e "SMS" mostram os e-mails e os SMS. | Ligar "SMS" deixa só os SMS; ligar também "E-mail" soma os e-mails. | Essencial | Obrigatório |
| RF214 | A tabela deve ter a coluna Canal, depois de Tipo, com o ícone e o nome do canal, e o funil de seleção com E-mail, WhatsApp e SMS. | Marcar WhatsApp no funil deixa só os WhatsApp. | Essencial | Obrigatório |
| RF215 | A coluna Assunto deve passar a "Assunto ou mensagem": no SMS e no WhatsApp, o começo do texto. | O SMS de CTR-00223 mostra "Olá, Caio. O contrato CTR-00223 vence em 15 dias..." na coluna. | Importante | Obrigatório |
| RF216 | A coluna "Saiu por" deve mostrar "Número do workspace" no SMS e "WhatsApp do workspace" no WhatsApp, com as dicas "O número de SMS do workspace, pela Twilio." e "O número de WhatsApp Business do workspace, pela Twilio.". | O WhatsApp de CTR-00223 mostra "WhatsApp do workspace". | Importante | Obrigatório |
| RF217 | O SMS e o WhatsApp que uma pessoa envia pelo número do workspace devem mostrar em "Enviado por" "<nome>, pelo ENSPACE". | O SMS que Ana envia de CTR-00230 pelo painel "Enviar SMS" aparece com "Ana Ribeiro, pelo ENSPACE". | Importante | Obrigatório |
| RF218 | Sem a integração Twilio, a lista não deve mostrar SMS nem WhatsApp do workspace (RN901). | Com "Sem Twilio", o filtro "SMS" não traz linha. | Essencial | Obrigatório |

## Leitura do SMS e do WhatsApp (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF221 | A leitura do SMS e do WhatsApp deve ter o canal e o destinatário no título e o texto num balão de conversa. | O SMS de CTR-00223 abre com o texto no balão. | Importante | Obrigatório |
| RF222 | A leitura do SMS deve ter a linha Tamanho, com "<N> SMS" pelas partes do texto (160 caracteres por SMS, ou 70 com acento). | O SMS de CTR-00223, com 96 caracteres e acento, mostra "2 SMS". | Importante | Obrigatório |
| RF223 | A leitura do WhatsApp deve ter a linha "Modelo aprovado", com o nome do modelo. | O WhatsApp de CTR-00223 mostra "lembrete_vencimento". | Importante | Obrigatório |
| RF224 | O menu da linha e a leitura do SMS e do WhatsApp devem ter "Reenviar SMS" e "Reenviar WhatsApp", com as regras de "Reenviar e-mail", e o aviso "Mensagem colocada na fila de envio". | "Reenviar SMS" no SMS Não entregue de CTR-00229 mostra o aviso e muda o status para Na fila. | Essencial | Obrigatório |

## WhatsApp do atendimento (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF231 | O WhatsApp que a Central de Atendimento envia deve aparecer com a origem "Atendimento" em "Enviado por" (P201). | O WhatsApp de SOL-00087 mostra "Atendimento". | Importante | Obrigatório |
| RF232 | O menu da linha e a leitura do WhatsApp do atendimento devem ter "Abrir a conversa no Atendimento", que abre a conversa do chamado na Central de Atendimento, sem "Reenviar WhatsApp". | O menu do WhatsApp de SOL-00087 mostra "Abrir a conversa no Atendimento" e não mostra "Reenviar WhatsApp". | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI201 | A lista da central, rota <a definir> | Deve devolver numa lista só o e-mail, o SMS e o WhatsApp, com o canal, o status, a entrega e a origem, e filtrar por canal e por entrega. | Obrigatório |
| RI202 | A leitura das mensagens do WhatsApp do atendimento, rota <a definir> | Deve devolver as mensagens enviadas pelas conversas do atendimento, com a permissão de P201. | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | Quem vê na central o WhatsApp do atendimento: só o atendente da conversa, o grupo dele, ou quem vê os e-mails do sistema? | produto e dev | Muda quem vê as linhas do WhatsApp do atendimento |

# 5. Enviar SMS pelo número do workspace

**Objetivo:** com a integração Twilio, a pessoa envia o SMS pelo número do workspace, com registro no item e na
central, sem sair do ENSPACE; os caminhos pelo próprio celular continuam no mesmo painel.

**Depende de:** 1. Canais de envio do workspace; 3. SMS e WhatsApp na central.

**Onde vale:** o painel "Enviar SMS", aberto por cada atalho de SMS (item, lista e quadro de itens, tarefas, Agenda) e
por "Nova mensagem" › SMS na central.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 4 · Comunicações", abra
CTR-00230 e clique em SMS no "Contato do item"; ligue "Sem Twilio" para ver o painel sem o envio pelo ENSPACE.

## Enviar pelo ENSPACE (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | Com a integração Twilio, o painel "Enviar SMS" deve ter o botão "Enviar pelo ENSPACE", abaixo da Mensagem, com a ajuda "Sai do número do workspace (<número>) e fica registrado no item e na central Comunicações. O SMS tem custo na conta Twilio do workspace." (RN902, RN907). | O painel de CTR-00230 mostra o botão e a ajuda com "+55 11 93000-1234". | Essencial | Obrigatório |
| RF402 | Os caminhos pelo celular ("Abrir no app de SMS", o QR code, "Copiar o número", "Copiar a mensagem" e "Google Messages Web") devem continuar no painel, abaixo de "Ou envie pelo seu celular". | Abaixo do botão, o painel mostra "Ou envie pelo seu celular" e os caminhos. | Essencial | Obrigatório |
| RF403 | A descrição do painel deve passar a "Envie pelo número do workspace, com registro no ENSPACE, ou pelo seu celular, sem registro.". | O painel de CTR-00230 mostra a descrição nova. | Importante | Obrigatório |
| RF404 | "Enviar pelo ENSPACE" deve ficar indisponível sem texto na Mensagem ou sem número válido no Para. | Apagar a Mensagem deixa o botão cinza. | Essencial | Obrigatório |
| RF405 | "Enviar pelo ENSPACE" deve enviar o SMS pelo número do workspace, gravar o envio com o item, o status Na fila e "Saiu por" "Número do workspace" (RN904), fechar o painel e mostrar o aviso "SMS enviado", com "O SMS saiu do número do workspace para <número>. O status de entrega aparece na central Comunicações.". | Enviar de CTR-00230 mostra o aviso, e o SMS aparece na central como Na fila, depois Enviado ao provedor e Entregue. | Essencial | Obrigatório |
| RF406 | Aberto sem destinatário ("Nova mensagem" › SMS), o painel deve ter o campo Para para digitar o número, e a ajuda do botão diz "Informe o destinatário para enviar pelo ENSPACE." até o número ser válido. | "Nova mensagem" › SMS abre o painel com o campo Para vazio e a ajuda. | Importante | Obrigatório |
| RF407 | Com a integração Twilio, a dica do botão SMS de cada atalho deve dizer "Envie pelo número do workspace, com registro no ENSPACE, ou pelo seu celular, sem registro.". | Pairar no SMS do item mostra a dica. | Importante | Obrigatório |
| RF408 | Sem a integração Twilio, o painel deve ficar sem "Enviar pelo ENSPACE" e com a descrição e os caminhos pelo celular da pessoa (RN901). | Com "Sem Twilio", o painel mostra só os caminhos pelo celular. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI401 | Envio de SMS pelo número do workspace, rota <a definir> | Deve receber o número do destinatário, o texto e o item, enviar pela API de mensagens da Twilio do workspace, sem o prefixo do WhatsApp, e devolver o envio gravado, com o status. | Obrigatório |

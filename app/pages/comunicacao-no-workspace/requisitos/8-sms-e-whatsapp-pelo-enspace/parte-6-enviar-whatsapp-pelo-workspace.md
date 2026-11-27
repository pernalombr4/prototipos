# 6. Enviar WhatsApp pelo workspace

**Objetivo:** com a integração Twilio, a pessoa escolhe, no atalho de WhatsApp, entre enviar pelo WhatsApp do
workspace, com modelo aprovado e registro no ENSPACE, e abrir a conversa no próprio WhatsApp, com texto livre, como
sem a integração.

**Depende de:** 1. Canais de envio do workspace; 3. SMS e WhatsApp na central; 4. Modelos de WhatsApp.

**Onde vale:** o painel "Enviar WhatsApp", aberto por cada atalho de WhatsApp de 1 destinatário (item, lista e quadro
de itens, tarefas, Agenda) e por "Nova mensagem" › WhatsApp na central.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 4 · Comunicações", abra
CTR-00223 e clique em WhatsApp no "Contato do item"; troque entre "WhatsApp do workspace" e "Seu WhatsApp"; ligue
"Sem Twilio" para ver o atalho abrir o WhatsApp direto.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN501 | O link do formulário público e o WhatsApp para 2 ou mais pessoas (a fila "Avisar pelo WhatsApp") abrem o WhatsApp da pessoa mesmo com a integração Twilio: o WhatsApp do workspace envia para 1 número, com modelo, e o envio em lote pelo workspace é o nó "Enviar WhatsApp" do Spaceflow. | Com a Twilio, "WhatsApp para 3 responsáveis" abre a fila, 1 conversa por vez no WhatsApp da pessoa. | Obrigatório |

## O painel (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | Com a integração Twilio, cada atalho de WhatsApp de 1 destinatário deve abrir o painel "Enviar WhatsApp para <nome>" ("Enviar WhatsApp" sem nome), com a descrição "Envie pelo WhatsApp do workspace, com modelo aprovado e registro no ENSPACE, ou abra a conversa no seu WhatsApp, sem registro." (RN902). | O WhatsApp de CTR-00223 abre "Enviar WhatsApp para Caio Fernandes". | Essencial | Obrigatório |
| RF502 | O campo Para deve mostrar o nome e o número do destinatário; sem destinatário, um campo para digitar o número. | "Nova mensagem" › WhatsApp abre o painel com o campo Para vazio. | Essencial | Obrigatório |
| RF503 | O campo "Como enviar" deve ter as 2 opções, "WhatsApp do workspace" e "Seu WhatsApp", com a dica de cada uma abaixo: "Com modelo aprovado. Fica registrado no ENSPACE." e "Texto livre. Não fica registrado no ENSPACE.". O painel abre em "WhatsApp do workspace". | Trocar para "Seu WhatsApp" troca a dica e o conteúdo do painel. | Essencial | Obrigatório |
| RF504 | Com a integração Twilio, a dica do botão WhatsApp de cada atalho deve dizer "Abre as opções de envio por WhatsApp: pelo WhatsApp do workspace, com modelo aprovado, ou pelo seu WhatsApp.". | Pairar no WhatsApp do item mostra a dica. | Importante | Obrigatório |
| RF505 | Sem a integração Twilio, o atalho de WhatsApp deve abrir direto a conversa no WhatsApp da pessoa, sem o painel (RN901). | Com "Sem Twilio", o WhatsApp de CTR-00223 abre o WhatsApp Web. | Essencial | Obrigatório |

## WhatsApp do workspace (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF511 | O campo "Modelo aprovado" deve listar os modelos de WhatsApp do workspace, com o 1º aprovado já escolhido e a ajuda "O WhatsApp do workspace só inicia conversa com modelo aprovado pela Meta.". O modelo que não está Aprovado aparece indisponível, com o status na Meta (RN903). | A lista mostra "pesquisa_de_satisfacao" cinza, com "Em análise". | Essencial | Obrigatório |
| RF512 | O painel deve ter 1 campo "Valor de {{<n>}}" por variável do modelo, já preenchido pelo item: {{1}} com o primeiro nome do destinatário, {{2}} com a referência do item e {{3}} com a data de vencimento do item, quando o item tem. A pessoa muda cada valor. | "lembrete_vencimento" em CTR-00223 abre com "Caio", "CTR-00223" e "25/10/2026". | Importante | Obrigatório |
| RF513 | A "Prévia" deve mostrar o texto do modelo com os valores no lugar das variáveis, e a variável sem valor continua como "{{<n>}}". | Apagar o valor de {{1}} mostra "Olá, {{1}}." na prévia. | Importante | Obrigatório |
| RF514 | O botão "Enviar pelo WhatsApp do workspace" deve ficar indisponível sem número válido, com a ajuda "Informe o número para enviar pelo WhatsApp do workspace.", ou com variável sem valor, com "Preencha os valores do modelo.". Com tudo preenchido, a ajuda diz "Sai do WhatsApp do workspace (<número>) e fica registrado no item e na central Comunicações. A mensagem tem custo na conta Twilio do workspace." (RN907). | Com o Para vazio, o botão fica cinza e a ajuda pede o número. | Essencial | Obrigatório |
| RF515 | "Enviar pelo WhatsApp do workspace" deve enviar o modelo com os valores, gravar o envio com o item, o modelo, o status Na fila e "Saiu por" "WhatsApp do workspace" (RN904), fechar o painel e mostrar o aviso "WhatsApp enviado", com "A mensagem saiu do WhatsApp do workspace para <número>. O status de entrega aparece na central Comunicações.". | Enviar de CTR-00223 mostra o aviso, e o WhatsApp aparece na central como Na fila, depois Enviado ao provedor, Entregue e Lido. | Essencial | Obrigatório |

## Seu WhatsApp (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF521 | A opção "Seu WhatsApp" deve ter o campo Mensagem, com o texto pronto do atalho, que a pessoa muda. | "Seu WhatsApp" em CTR-00223 mostra o texto pronto do item. | Essencial | Obrigatório |
| RF522 | "Abrir no meu WhatsApp" deve abrir a conversa no WhatsApp Web ou no app pelo link `https://wa.me/<número>?text=<texto>`, como o atalho sem a integração, e fechar o painel. O ENSPACE não registra a conversa. | "Abrir no meu WhatsApp" abre o WhatsApp Web com o número e o texto. | Essencial | Obrigatório |
| RF523 | "Abrir no meu WhatsApp" deve ficar indisponível sem texto na Mensagem. A ajuda diz "Abre a conversa no WhatsApp Web ou no app, com o texto pronto. Você revisa e envia. O ENSPACE não registra a conversa."; sem número, "Sem número: no seu WhatsApp, você escolhe a conversa.". | Sem número, a ajuda diz que a pessoa escolhe a conversa, e o link abre `https://wa.me/?text=<texto>`. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI501 | Envio de WhatsApp por modelo de uma pessoa, rota <a definir> | Deve receber o número, o modelo (Content SID), os valores das variáveis e o item, enviar pela Twilio do workspace e devolver o envio gravado, com o status. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S501 | Os valores sugeridos seguem a ordem do protótipo ({{1}} o primeiro nome, {{2}} a referência, {{3}} o vencimento) para cada modelo. | produto | Com um mapa por modelo, quem cria o modelo escolhe o campo de cada variável, na parte 4 |
| P501 | Dentro das 24 horas depois da última mensagem do contato, o WhatsApp do workspace aceita texto livre. O painel oferece o texto livre nessa janela? | produto e dev | Com o texto livre, a opção "WhatsApp do workspace" ganha o campo Mensagem quando a janela está aberta |

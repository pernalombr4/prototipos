# 10. E-mails do sistema na lista de mensagens

**Objetivo:** quem tem a permissão de hoje de ver os e-mails enviados confere, na lista de Comunicações, se o e-mail de
uma tarefa, de um fluxo ou do atendimento saiu, por onde saiu e por que falhou, e reenvia o que falhou ou foi
cancelado, sem uma tela própria para isso.

**Depende de:** 9. Lista de mensagens.

**Onde vale:** a lista da central "Comunicações", sobre os dados da tela E-mails Enviados de hoje.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Perfil: Admin", abra
Comunicações e ligue "Do sistema"; com "Perfil: Membro", o filtro e a coluna Status somem.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN951 | Um e-mail do sistema é o e-mail que uma tarefa, um fluxo do Spaceflow ou a Central de Atendimento envia, o da tela E-mails Enviados de hoje. Na lista, é do tipo Enviado. | O e-mail da tarefa T-1042 de CTR-00231 aparece como Enviado, com "Enviado por" "Tarefa · T-1042". | Obrigatório |
| RN952 | O e-mail do sistema só pode ser reenviado se o status for Enviado ao provedor, Falhou ou Cancelado. | O e-mail Cancelado pode ser reenviado; o Na fila e o Em processamento, não. | Obrigatório |
| RN953 | O status do e-mail do sistema é um dos 5 do registro de envio de hoje, cada um com o que quer dizer. Política: Única. | Linha 3: o status "Enviado ao provedor" quer dizer que o provedor aceitou o e-mail, sem a confirmação da entrega. | Obrigatório |

| Linha | Status | Dica |
|---|---|---|
| 1 | Na fila | "O envio espera a vez na fila do ENSPACE." |
| 2 | Em processamento | "O ENSPACE está entregando a mensagem ao provedor." |
| 3 | Enviado ao provedor | "O provedor aceitou a mensagem. O ENSPACE não confirma a entrega." |
| 4 | Falhou | "Motivo da falha: <motivo gravado>", ou "O provedor recusou a mensagem. O motivo está no detalhe." sem motivo gravado |
| 5 | Cancelado | "O envio foi cancelado antes de sair." |

## Linhas, filtro e colunas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF951 | Para quem tem a permissão de hoje de ver os e-mails enviados, a lista deve mostrar os e-mails do sistema, o filtro "Do sistema" da barra, a opção "Sistema" no filtro de "Enviado por" e a coluna Status (RN916, RN951). | Com "Perfil: Admin", os 3 aparecem; com "Perfil: Membro", nenhum dos 3. | Essencial | Obrigatório |
| RF952 | O filtro "Do sistema" da barra deve trocar a fonte da tabela: ligado, a tabela mostra só os e-mails do sistema; desligado, só os e-mails dos itens. | Ligar "Do sistema" mostra os e-mails dos fluxos, sem os da Mail Box dos itens. | Essencial | Obrigatório |
| RF953 | A opção "Sistema" no filtro de "Enviado por" deve ligar o filtro "Do sistema". | Marcar "Sistema" no funil de "Enviado por" mostra só os e-mails do sistema. | Importante | Obrigatório |
| RF954 | A coluna "Enviado por" do e-mail do sistema deve mostrar a origem: "Tarefa · <tarefa>", "Spaceflow · <nome do fluxo>" ou "Atendimento", com o ícone de cada origem. | O e-mail de T-1042 mostra "Tarefa · T-1042"; o do fluxo "Abertura de solicitação", "Spaceflow · Abertura de solicitação". | Importante | Obrigatório |
| RF955 | A coluna Status deve mostrar o status do e-mail do sistema pela RN953, com a dica da linha dele, e "-" nos e-mails dos itens. | O e-mail de T-1047 que falhou mostra Falhou, com a dica "Motivo da falha: Quota de emails excedida". | Essencial | Obrigatório |
| RF956 | O "i" do título deve somar a frase "Também os e-mails que tarefas e fluxos enviaram." para quem tem a permissão de ver os e-mails enviados. | Com "Perfil: Admin", a dica tem as 2 frases; com "Perfil: Membro", só a 1ª. | Desejável | Desejável |
| RF959 | O funil de Status deve filtrar por seleção, com os 5 status e "Sem valor (-)", para as linhas sem status. Quem não vê a coluna Status não tem o filtro dela. | Marcar "Sem valor (-)" deixa só os e-mails dos itens. | Importante | Obrigatório |
| RF958 | A coluna "Saiu por" do e-mail do sistema deve mostrar "ENSPACE", para o remetente padrão do ENSPACE, ou "Domínio da empresa", para o remetente com o domínio da empresa, cada um com a dica: "O remetente padrão do ENSPACE, pela SendGrid da plataforma." e "O remetente com o domínio da empresa, pela SendGrid do workspace.". | O e-mail do fluxo "Abertura de solicitação" mostra "ENSPACE"; o de T-1042, "Domínio da empresa". | Importante | Obrigatório |

## Menu da linha e leitura (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF961 | O menu da linha do e-mail do sistema deve ter "Ver Detalhes", "Reenviar e-mail" e, com item, "Ver Item", sem "Responder". | O menu do e-mail de fluxo mostra os 3 itens, sem "Responder". | Essencial | Obrigatório |
| RF962 | "Ver Item" no e-mail do sistema deve abrir o item na Visão Geral. | "Ver Item" abre CTR-00231 na Visão Geral. | Importante | Obrigatório |
| RF963 | Com o status Na fila ou Em processamento, "Reenviar e-mail" deve ficar indisponível, com o motivo "O envio ainda está na fila ou em processamento." (RN952). | O e-mail Em processamento mostra "Reenviar e-mail" cinza, com o motivo. | Essencial | Obrigatório |
| RF964 | A leitura do e-mail do sistema no painel lateral deve mostrar também Status, "Saiu por" e a origem, com a tarefa ou o fluxo, e o botão "Reenviar e-mail" no lugar de "Responder". | O painel do e-mail de T-1047 mostra Falhou, "Domínio da empresa", T-1047 e "Reenviar e-mail". | Essencial | Obrigatório |
| RF965 | "Reenviar e-mail" deve pôr o e-mail na fila de envio de hoje, mudar o status para Na fila e mostrar o aviso "E-mail colocado na fila de envio". | Reenviar o e-mail Falhou muda a coluna para Na fila. | Essencial | Obrigatório |
| RF966 | Com o status Falhou e o motivo gravado, a leitura deve mostrar "Motivo da falha" com a mensagem do envio. | O painel do e-mail de T-1047 mostra "Motivo da falha" e "Quota de emails excedida". | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P951 | A lista consegue juntar as 2 listas de hoje (os e-mails dos itens e os do sistema) com ordem e paginação únicas, sem back novo? Se não consegue, vale a troca de fonte desta parte, e a lista única fica no épico "Gravar e-mail enviado sem item e filtrar a lista de mensagens por permissão". | dev do back | Se consegue sem back, o filtro "Do sistema" passa a recortar uma lista só |
| P952 | Com "Do sistema" ligado, os filtros rápidos "Recebidos", "Não lidos" e "Com anexo" e os filtros de coluna de De, Para e Item valem sobre a lista do sistema, ou ficam indisponíveis? | dev e produto | Muda o que a barra oferece com a fonte do sistema |
| P953 | O registro de envio de hoje diz se o e-mail saiu pelo remetente padrão do ENSPACE ou pelo domínio da empresa? | dev do back | Sem o dado, "Saiu por" do e-mail do sistema sai desta parte e vai para o épico "Enviar SMS e WhatsApp pelo número do workspace, com a integração Twilio" |

# 10. E-mails do sistema na aba Mensagens

**Objetivo:** quem tem a permissão de hoje de ver os e-mails enviados confere, na aba Mensagens, se o e-mail de uma
tarefa ou de um fluxo saiu, e reenvia o que falhou, sem uma aba própria para isso.

**Depende de:** 9. Aba Mensagens.

**Onde vale:** a central "E-mails", aba Mensagens, sobre os dados da tela E-mails Enviados de hoje; o item E-mails
Enviados de Configurações › E-mails.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Perfil: Admin", abra E-mails
› Mensagens e ligue "Do sistema"; com "Perfil: Membro", o filtro e a coluna Status somem.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN951 | Um e-mail do sistema é o e-mail que uma tarefa ou um fluxo envia, o da tela E-mails Enviados de hoje. Na aba Mensagens, é do tipo Enviado. | O e-mail do fluxo de renovação de CTR-00231 aparece como Enviado, com "Enviado por" "Sistema · T-1042". | Obrigatório |
| RN952 | O e-mail do sistema só pode ser reenviado se o status não for Em processamento. | O e-mail com o status Falhou pode ser reenviado; o Em processamento, não. | Obrigatório |

## Linhas, filtro e coluna (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF951 | Para quem tem a permissão de hoje de ver os e-mails enviados, a aba Mensagens deve mostrar os e-mails do sistema, o filtro "Do sistema" da barra, a opção "Sistema" no filtro de "Enviado por" e a coluna Status (RN916, RN951). | Com "Perfil: Admin", os 3 aparecem; com "Perfil: Membro", nenhum dos 3. | Essencial | Obrigatório |
| RF952 | O filtro "Do sistema" da barra deve trocar a fonte da tabela: ligado, a tabela mostra só os e-mails do sistema; desligado, só os e-mails dos itens. | Ligar "Do sistema" mostra os e-mails dos fluxos, sem os da Mail Box dos itens. | Essencial | Obrigatório |
| RF953 | A opção "Sistema" no filtro de "Enviado por" deve ligar o filtro "Do sistema". | Marcar "Sistema" no funil de "Enviado por" mostra só os e-mails do sistema. | Importante | Obrigatório |
| RF954 | A coluna "Enviado por" do e-mail do sistema deve mostrar "Sistema · <tarefa>" quando há tarefa e "Sistema" sem tarefa. | O e-mail de T-1042 mostra "Sistema · T-1042". | Importante | Obrigatório |
| RF955 | A coluna Status deve mostrar Enviado, Em processamento ou Falhou no e-mail do sistema, e "-" nos e-mails dos itens. | Um e-mail de fluxo que falhou mostra Falhou. | Essencial | Obrigatório |
| RF956 | O "i" da aba Mensagens deve somar a frase "Também os e-mails que tarefas e fluxos enviaram." para quem tem a permissão de ver os e-mails enviados. | Com "Perfil: Admin", a dica tem as 2 frases; com "Perfil: Membro", só a 1ª. | Desejável | Desejável |
| RF957 | O item E-mails Enviados de Configurações › E-mails deve abrir a central na aba Mensagens, com o filtro "Do sistema" ligado. | Clicar em E-mails Enviados abre Mensagens com "Do sistema" marcado. | Essencial | Obrigatório |

## Menu da linha e leitura (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF961 | O menu da linha do e-mail do sistema deve ter "Ver Detalhes", "Reenviar e-mail" e, com item, "Ver Item", sem "Responder". | O menu do e-mail de fluxo mostra os 3 itens, sem "Responder". | Essencial | Obrigatório |
| RF962 | "Ver Item" no e-mail do sistema deve abrir o item na Visão Geral. | "Ver Item" abre CTR-00231 na Visão Geral. | Importante | Obrigatório |
| RF963 | Com o status Em processamento, "Reenviar e-mail" deve ficar indisponível (RN952). | O e-mail Em processamento mostra "Reenviar e-mail" cinza. | Essencial | Obrigatório |
| RF964 | A leitura do e-mail do sistema no painel lateral deve mostrar também Status e Tarefa, com o botão "Reenviar e-mail" no lugar de "Responder". | O painel do e-mail de T-1047 mostra Falhou, T-1047 e "Reenviar e-mail". | Essencial | Obrigatório |
| RF965 | "Reenviar e-mail" deve pôr o e-mail na fila de envio de hoje, mudar o status para Em processamento e mostrar o aviso "E-mail colocado na fila de envio". | Reenviar o e-mail Falhou muda a coluna para Em processamento. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P951 | A aba consegue juntar as 2 listas de hoje (os e-mails dos itens e os do sistema) com ordem e paginação únicas, sem back novo? Se não consegue, vale a troca de fonte desta parte, e a lista única fica no épico "E-mail sem item e lista por permissão". | dev do back | Se consegue sem back, o filtro "Do sistema" passa a recortar uma lista só |
| P952 | Com "Do sistema" ligado, os filtros rápidos "Recebidos", "Não lidos" e "Com anexo" e os filtros de coluna de De, Para e Item valem sobre a lista do sistema, ou ficam indisponíveis? | dev e produto | Muda o que a barra oferece com a fonte do sistema |

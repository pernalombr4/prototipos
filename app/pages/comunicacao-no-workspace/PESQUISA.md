# Comunicação no workspace: referências

Consulta em 05/10/2026, nas 3 partes da demanda:

1. Link do formulário público fácil de copiar.
2. Atalhos de contato por deep link (`mailto:`, `wa.me`, `sms:`).
3. E-mail de qualquer tela, com vínculo opcional a um item.

## Produtos pesquisados

| Rodada | Produtos |
|---|---|
| 1 | Obrigatórios: Notion, Twenty CRM, ClickUp, monday, Pipefy. Extras: HubSpot (raso), Pipedrive, Attio, Front, Typeform, Google Forms |
| 2 (pedido da Mikaela) | HubSpot a fundo, **Apollo.io**, ClickUp, monday (CRM e Emails & Activities), Twenty (código), Pipefy, Notion, Salesforce, Pipedrive, Zoho CRM, Freshsales, Close, **RD Station CRM, Agendor, Ploomes, Kommo** (brasileiros, WhatsApp por `wa.me`), Gmail, Outlook na web, Front, Missive |

A rodada 2 está no fim deste arquivo: "Rodada 2: pesquisa estendida" e "Avaliação da UX do
protótipo", que diz, decisão por decisão, se o mercado confirma e o que mudou.

**Sem print.** A pesquisa leu a documentação de cada produto e, no Twenty, o código. Algumas
centrais de ajuda (Apollo, ClickUp, monday, Salesforce) bloqueiam leitura automática: o que veio só
do buscador está marcado "só busca" e vale como indício. Fase declarada no `DECISOES.md`.

## Notion

**1. Link do formulário**

- O formulário é uma visualização do banco: `+` ao lado das visualizações › `Form`.
- `Share form`, no topo do construtor, abre "Who can fill out": `Anyone at {workspace} with link`,
  `Anyone on the web with link` ou `No access`. O link fica no topo desse menu.
- Mudar o acesso pede `Full access` ao banco; copiar o link pede só `View access`.

**2. Atalhos:** clicar na propriedade Email abre o app de e-mail; Phone pede ao aparelho para
ligar. O botão de banco tem `Send mail to` (envia pelo Gmail conectado). Não tem WhatsApp nem SMS,
e o `Open page or URL` não aceita fórmula, então não monta um `wa.me` por página.

**3. E-mail:** o Notion Mail saiu do ar em 22/09/2026. Não achei compositor com vínculo a página.

- https://www.notion.com/help/forms
- https://www.notion.com/help/database-properties?slug=database-properties
- https://www.notion.com/help/database-buttons
- https://www.heise.de/en/news/Notion-Mail-is-shutting-down-What-users-need-to-do-now-11345988.html

**Serve:** quem muda o acesso é um papel; quem copia o link é outro. Membro com leitura copia.
Mesma divisão do protótipo: o administrador torna público, o membro copia.
**Não serve:** o `Send mail to` envia pela conta conectada, e a demanda pede só abrir o app.

## Twenty CRM

**1. Link do formulário:** não tem formulário público nativo (issue #10991, fechada).

**2. Atalhos** (código da branch main)

- O clique no campo Emails segue a configuração `clickAction`. O padrão, `OPEN_IN_APP`, abre o
  compositor no painel lateral quando há conta conectada, e `mailto:` quando não há
  (`useOpenEmailInAppOrFallback.ts`).
- Phones gera `tel:` pela libphonenumber (`PhonesDisplay.tsx`). Com `clickAction = COPY`, copia.
- No hover aparece a outra ação (abrir ou copiar), também em campo só leitura (PR #25940).
- Não tem WhatsApp nem SMS.

**3. E-mail**

- O Command menu (Ctrl+K) tem `Compose email` em qualquer tela.
- O compositor abre no painel lateral: From (com mais de 1 conta), To, Cc, Bcc, Subject, corpo,
  Discard, Attach, Send.
- Recebe um `contextRecord`, que só ordena as sugestões de destinatário. Não há seletor de
  registro: o vínculo vem da sincronização (o e-mail entra na timeline de quem participa).

- https://docs.twenty.com/user-guide/calendar-emails/how-tos/can-i-send-emails-from-twenty
- https://docs.twenty.com/getting-started/core-concepts/calendar-and-email
- https://twenty.com/releases
- https://github.com/twentyhq/twenty/pull/25940
- https://github.com/twentyhq/twenty/issues/10991
- `packages/twenty-front/src/modules/`: `EmailsFieldDisplay.tsx`, `PhonesDisplay.tsx`,
  `useOpenEmailInAppOrFallback.ts`, `useOpenComposeEmailInSidePanel.ts`,
  `SidePanelComposeEmailPage.tsx`, `EmailComposerFields.tsx`, `useEmailRecipientSuggestions.ts`

**Serve:** com caixa, compositor interno; sem caixa, app da pessoa. É a escolha do botão E-mail
do protótipo. E o compositor de qualquer tela, numa entrada só.
**Não serve:** vínculo só pelo participante. E-mail para endereço fora dos registros fica solto, e
a demanda pede o vínculo escolhido por quem escreve.

## ClickUp

**1. Link do formulário**

- No Forms Hub, o hover mostra `Copy link`. O menu separa `Copy link to view` (interno) e
  `Copy public link` (para responder).
- Com o formulário aberto, `Copy link` fica no canto superior direito; a seta abre
  `Sharing settings` (expirar link, indexar, incorporar).
- O link público usa `forms.clickup.com`, e o interno, `app.clickup.com`.

**2. Atalhos:** Phone e Email clicáveis abrem o app (não confirmei o esquema de URL). Não
confirmei WhatsApp nativo.

**3. E-mail:** só de dentro da tarefa (`Comment` › `Email`, From da conta vinculada). O campo Email
da tarefa vira sugestão no To. A resposta entra na atividade da tarefa. Liga e desliga por espaço,
com permissão por papel.

- https://help.clickup.com/hc/en-us/articles/26301017413911-Forms-Hub
- https://help.clickup.com/hc/en-us/articles/7255560049815-Share-embed-and-export-Forms
- https://help.clickup.com/hc/en-us/articles/41521317138455-What-s-the-difference-between-public-and-internal-links
- https://help.clickup.com/hc/en-us/articles/6303747270807-Use-Email-in-ClickUp
- https://clickup.com/blog/feature-custom-fields/

**Serve:** nome diferente para link interno e público; copiar no hover da lista; e-mail do campo
sugerido no Para; liga e desliga por espaço.
**Não serve:** compor só dentro da tarefa.

## monday.com

**1. Link do formulário:** `Share form`, no canto superior direito, com link, incorporação e redes.
Nos planos Pro e Enterprise, pré-preenchimento por parâmetro de URL.

**2. Atalhos**

- Clicar na Email Column abre o leitor padrão. Em `Customize Email column`: o nome do item no
  assunto; **`CC to pulse`**, que põe em cópia o endereço único do item e faz a resposta virar
  atualização no item; e uma lista de BCC.
- Phone Column abre o app de ligação (número com código do país). SMS só pela integração Twilio.

**3. E-mail:** o Emails & Activities fica no item. `New email` abre com o To da coluna Email.
Associação manual (Pro e Ultimate): antes de salvar, a lista dos registros que recebem o e-mail,
com o de origem travado; depois do envio, `Manage Associations`. A lista só traz registros já
ligados, sem busca livre.

- https://support.monday.com/hc/en-us/articles/360000358700-Get-started-with-WorkForms
- https://support.monday.com/hc/en-us/articles/26808283008146-WorkForms-pre-fill-and-form-tags-settings
- https://support.monday.com/hc/en-us/articles/360002155560-The-Email-Column
- https://support.monday.com/hc/en-us/articles/360001151249-The-Phone-Column
- https://support.monday.com/hc/en-us/articles/360019213180-Emails-Activities
- https://support.monday.com/hc/en-us/articles/35433150651154-Manual-timeline-associations

**Serve:** o `CC to pulse`. O protótipo leva a ideia: no e-mail aberto no app da pessoa, a caixa do
item vai em cópia, e a resposta volta para a aba Mail Box sem o ENSPACE enviar nada. Também o nome
do item no assunto.
**Não serve:** o registro de origem travado. O documento pede que o vínculo pré-selecionado possa
sair.

## Pipefy

**1. Link do formulário:** compartilhar no cabeçalho do pipe ou `share form` › chave de público ›
link para copiar. Acessos: público com link, pessoas escolhidas ou a organização pelo portal. O
portal reúne formulários de vários pipes numa página. Só o admin edita formulário; não achei
copiar link dentro do card.

**2. Atalhos:** não achei `mailto`, `tel` nem WhatsApp nativo.

**3. E-mail**

- Cada card tem endereço próprio. O ícone de e-mail fica no card aberto. From fixo (o endereço do
  card); To digitado à mão.
- A caixa compartilhada do pipe: `Compose Email` › "Select the card you want to link this email
  to", ou `+Add new` para criar um card. Limite de 10 destinatários.

- https://help.pipefy.com/en/articles/7833696-how-to-share-forms
- https://help.pipefy.com/en/articles/4173939-how-to-share-public-forms
- https://help.pipefy.com/en/articles/9113800-how-to-set-up-the-new-portal
- https://help.pipefy.com/en/articles/900230-how-to-use-a-card-s-email-box
- https://help.pipefy.com/en/articles/5301189-configure-a-shared-inbox

**Serve:** é o modelo mais perto do ENSPACE: caixa por card e composição de outra tela escolhendo
o card. O From fixo do card confirma a leitura do develop (o remetente é o endereço do item).
**Não serve:** To digitado à mão; caixa compartilhada por pipe, não do workspace.

## HubSpot CRM

**1.** `Copy a share link` no formulário. **2.** Ligação pelo navegador ou telefone (ferramenta
própria, não deep link). **3.** O ícone de e-mail fica no painel esquerdo do registro; To com o
e-mail principal; From escolhe a conta ou o e-mail da equipe; `Associated with`, no rodapé, com
caixas de seleção dos registros que recebem o e-mail.

- https://knowledge.hubspot.com/one-to-one-email/send-and-reply-to-one-to-one-emails
- https://knowledge.hubspot.com/forms/create-and-edit-forms

**Serve:** o From à vista e o vínculo dentro do compositor. **Não serve:** compor só do registro.

## Pipedrive

**2.** Em `Tools and apps › Phone calls`, um modelo com `[number]`: `tel:`, `callto:`, `sip:`,
`facetime://`, `sms:` ou personalizado. WhatsApp pela integração com o WhatsApp Business (paga
por mensagem). **3.** Vínculo depois do envio: `Link item` no hover do assunto, em lote, dentro da
conversa ou no histórico, com sugestão e busca.

- https://support.pipedrive.com/en/article/callto-syntax-make-voip-calls-from-pipedrive
- https://support.pipedrive.com/en/article/whatsapp-integration
- https://support.pipedrive.com/en/article/link-emails-items

**Serve:** vincular depois um e-mail que chegou solto (a tela E-mails do protótipo faz isso).
**Não serve:** a escolha só depois do envio.

## Attio

**3.** A tecla `c` abre o compositor em qualquer tela; destinatário preenchido no registro;
vínculo pelo participante; rascunhos privados.

- https://attio.com/help/reference/email-calendar/send-emails-in-attio

**Serve:** o rascunho que sobrevive. No protótipo, fechar a gaveta não perde o texto, e o botão do
topo ganha um ponto enquanto há rascunho. **Não serve:** sem escolha manual de registro.

## Front

**3.** `Tags` › `Link` › colar a URL. O vínculo vira etiqueta, e `View conversations` lista as
conversas do mesmo link.

- https://help.front.com/t/60h1h1x/understanding-links

**Serve:** o vínculo como etiqueta clicável (a coluna Item da tela E-mails). **Não serve:** URL
colada à mão.

## Typeform e Google Forms

**1.** Typeform: `Share` › `Copy link`, botão de e-mail, QR code e redes. Google Forms: `Copy
responder link`, `Shorten URL`, `Pre-fill form`.

- https://help.typeform.com/hc/en-us/articles/360029252892-Share-your-form
- https://support.google.com/docs/answer/2839588?hl=en

**Serve:** "Enviar o link por" ao lado do copiar. **Não serve:** as 2 telas são de quem cria o
formulário, não de quem atende.

## O padrão que todos seguem

1. Copiar o link fica no próprio formulário ou na lista de formulários.
2. O link público tem nome próprio ("Copy public link", "Copy responder link").
3. E-mail e telefone clicáveis abrem o app padrão por `mailto:` e `tel:`.
4. Com caixa conectada, o clique no e-mail abre o compositor interno; sem caixa, `mailto:`.
5. O compositor tem De, Para, Cc, Cco, Assunto, corpo, anexo e modelo.
6. O vínculo nasce automático pelo participante; o manual entra quase sempre depois do envio.
7. O e-mail enviado aparece no registro e na pasta de enviados.

## O que nenhum deles faz

1. **Copiar o link público onde o atendente trabalha** (item, tarefa, tela inicial). Todos põem o
   botão no formulário. O protótipo põe nas telas de uso, e o de configuração continua lá.
2. **WhatsApp por `wa.me` com texto pronto e SMS como atalho.** Pipedrive e monday usam a API paga.
3. **Explicar por que o atalho está indisponível.** O Twenty troca o link por `#`. O protótipo
   desabilita e diz o motivo ("Sem telefone cadastrado").
4. **Pôr a caixa do registro em cópia em toda tela**, não só numa coluna (o monday faz na coluna
   Email).
5. **Compor fora do registro com busca livre de item** por nome, referência, ID e categoria,
   respeitando permissão. Pipefy chega perto, sem critério documentado.
6. **Ligar e desligar os atalhos no workspace inteiro**, por canal e por tela. Os outros
   configuram por campo ou por coluna.

---

# Rodada 2: pesquisa estendida

Consulta em 05/10/2026. Por produto, o que muda em relação à rodada 1 ou o que é novo.

## HubSpot (a fundo)

**1. Atalhos.**
- O registro tem ícones de atividade no alto do painel esquerdo: nota, e-mail, ligação, tarefa e
  reunião. A ajuda separa criar (Email, Note, Call, Task, Meeting, WhatsApp) de registrar ("Log":
  Email, Call, Meeting, LinkedIn, SMS, WhatsApp, Postal mail).
- Ligação: abre uma janela com o número da propriedade "Phone number", com "Call from browser",
  "Call from phone" ou "Call from HubSpot app". **Sem telefone, o botão continua e oferece "+ Add
  phone number".**
- WhatsApp exige conta WhatsApp Business conectada e template aprovado fora da janela de 24 horas.
  Não há botão `wa.me` nativo.

**2. Link de formulário:** "Review and update" › "Update" › "Copy a share link" › "Copy", no
editor. Nenhum atalho nas telas de vendas.

**3. E-mail.**
- O ícone de e-mail do registro abre uma janela pop-up.
- "From": clicar troca entre o e-mail pessoal e um endereço de equipe.
- **"Associated with": menu no canto inferior direito, com caixas de seleção.** Atividade de contato
  também vai para a empresa e os 5 negócios abertos mais recentes; depois do envio, "[x]
  associations" soma ou tira registros.
- Rascunho salvo aparece na linha do tempo. Fora do registro: CRM › Inbox › "Compose", sem campo de
  associação.
- Sem atalho de teclado nativo.

Fontes:
- https://knowledge.hubspot.com/records/work-with-records
- https://knowledge.hubspot.com/records/manually-log-activities-on-records
- https://knowledge.hubspot.com/one-to-one-email/send-and-reply-to-one-to-one-emails
- https://knowledge.hubspot.com/one-to-one-email/create-and-manage-one-to-one-email-drafts
- https://knowledge.hubspot.com/records/associate-activities-with-records
- https://knowledge.hubspot.com/calling/make-calls-in-the-hubspot-browser
- https://knowledge.hubspot.com/inbox/connect-whatsapp-to-the-conversations-inbox
- https://knowledge.hubspot.com/inbox/compose-and-reply-to-emails-in-the-conversations-inbox

**Serve:** "+ Add phone number" como próximo passo do dado que falta; sugerir o vínculo e deixar
corrigir. **Não serve:** WhatsApp pela API, com template da Meta.

## Apollo.io (só busca: a central de ajuda devolve 403)

- Na lista People, **"Email" e "Call" ficam na própria linha do contato**, com rótulo.
- Dado ausente vira ação: "Access email", "Access mobile" (gastam crédito), "Request phone number".
- Status de e-mail: verified, unavailable, user managed, catch-all.
- Discador com fila ("power dialing"). LinkedIn como tarefa de sequência. Sem WhatsApp nativo.
- "Emails" no menu, com os e-mails do time. Compositor com "From", "Send Now" e "Schedule".

Fontes:
- https://docs.apollo.io/docs/retrieve-mobile-phone-numbers-for-contacts
- Só busca: knowledge.apollo.io, artigos 31969477982221, 4734516058893, 30919852777229, 4423314404621

**Serve:** ação com rótulo na linha; dado ausente com próximo passo; a fila do discador como modelo
do lote. **Não serve:** revelar dado com crédito (prospecção fria).

## Salesforce (só busca)

- Compositor **acoplado na base da tela**: a pessoa navega com ele aberto; dá para maximizar.
- "From": o endereço da pessoa ou um da organização. "To" preenchido a partir do contato.
- **"Related To": campo de busca, pré-preenchido com o registro e trocável.**
- Einstein Activity Capture liga os endereços a contato, conta e oportunidade, com regra editável.

**Serve:** compositor que continua aberto na navegação; vínculo pré-preenchido e trocável.

## Zoho CRM, Freshsales e Close

- **Zoho:** a seta ao lado de "Send Email" abre "Send WhatsApp Template"; com mais de 1 número, a
  pessoa escolhe.
  ([ajuda](https://help.zoho.com/portal/en/kb/crm/connect-with-customers/business-messaging/articles/business-messaging-using-whatsapp-for-business-integration-with-zoho-crm))
- **Freshsales:** "Send SMS (Mobile)" e "Send SMS (Work)": o canal nomeia o campo de origem; SMS em
  lote pela lista.
  ([ajuda](https://crmsupport.freshworks.com/support/solutions/articles/50000002695-how-to-send-sms-messages-))
- **Close:** atalho por canal (Ctrl+Shift+E e-mail, Ctrl+Shift+D ligar, Ctrl+Shift+K SMS); "Call
  next lead" no discador; "/" insere snippet.
  ([atalhos](https://help.close.com/docs/keyboard-shortcuts), [e-mail](https://help.close.com/docs/emailing),
  [SMS](https://help.close.com/feature-guide/sms-and-mms))

**Serve:** a escolha do número no menu; o atalho de teclado; a fila com "próximo".

## CRMs brasileiros: WhatsApp por `wa.me`

- **Agendor:** "Enviar WhatsApp" abre um menu com 2 caminhos: "WhatsApp" (WhatsApp Web) e "Agendor
  Chat" (caixa do produto). **É o mesmo desenho do botão E-mail do protótipo.** Sem número, os
  botões somem.
  ([ajuda](https://ajuda.agendor.com.br/pt-BR/articles/4450589-como-integrar-o-agendor-ao-whatsapp))
- **Ploomes:** ícone ao lado do telefone, só com número válido; abre o WhatsApp Web em nova aba; a
  extensão traz "Modelos de mensagem".
  ([ajuda](https://suporte.ploomes.com/en/articles/5452131-how-to-start-a-whatsapp-conversation-from-a-customer-record))
- **RD Station CRM:** ícone nos contatos da oportunidade abre o WhatsApp Web (só busca); a extensão
  manda mensagem pronta e salva a conversa.
  ([página](https://www.rdstation.com/produtos/crm/vendas/vender-pelo-whatsapp/))
- **Kommo:** tudo pela API, com a conversa dentro do cartão do lead.
  ([blog](https://www.kommo.com/blog/whatsapp-crm/))

**Serve:** `wa.me` como prática do mercado brasileiro; menu de 2 caminhos; modelos de mensagem.
**Não serve:** esconder o botão sem dizer por quê.

## Gmail e Outlook na web

- **Gmail:** "Compose" em janela flutuante no canto inferior direito, minimizável, várias ao mesmo
  tempo. Atalhos `c` (escrever) e Ctrl+Enter (enviar). Descartar mostra "Undo".
  ([atalhos](https://support.google.com/mail/answer/6594))
- **Outlook:** `N` cria mensagem; Ctrl+Enter envia; o "De" vem escondido ("Show From"); rascunho
  salvo sozinho.
  ([atalhos](https://support.microsoft.com/en-us/office/keyboard-shortcuts-for-outlook-3cdeb221-7ae5-4c1d-8c1d-9e63216c1efd))

## Pipedrive, Front e Missive

- **Pipedrive:**
  - telefone clicável na lista e no detalhe; em Tools and apps › Phone calls, a pessoa escolhe o
    protocolo (`tel:`, `sms:`, `callto:`, `sip:`). No detalhe, a seta ao lado do telefone troca o
    método antes de ligar;
  - WhatsApp pela API, com aba no negócio e na pessoa; conversa nova exige template aprovado;
  - e-mail: vínculo automático pelo contato, que falha com mais de 1 negócio aberto. Vínculo à mão
    por **"Link item" ao passar o mouse no assunto**, "Link conversations" em lote e a aba
    **"Unlinked"**;
  - Smart BCC vai em Cco, e a resposta só entra se alguém a encaminhar.
  - [vincular](https://support.pipedrive.com/en/article/link-emails-items),
    [WhatsApp](https://support.pipedrive.com/en/article/whatsapp-integration),
    [protocolos](https://support.pipedrive.com/en/article/callto-syntax-make-voip-calls-from-pipedrive),
    [Smart BCC](https://support.pipedrive.com/en/article/smart-email-bcc)
- **Front:** o plugin do HubSpot, na barra lateral, acha o registro pelo e-mail ou pelo nome do
  remetente; o registro manual escolhe contato, empresa ou negócio. A regra "Log message in HubSpot"
  registra sozinha. ([ajuda](https://help.front.com/en/articles/1995))
- **Missive** (só busca): a barra lateral casa a conversa pelo e-mail ou telefone; a ação do
  Pipedrive no menu do e-mail vincula à mão.

**Serve:** "Vincular" na linha do e-mail sem item; a aba de e-mails sem item; sugerir o registro
pelo remetente.

## O que a rodada 2 acrescenta aos 5 obrigatórios

- **ClickUp** (só busca): "Copy link" na visão do formulário e "Copy public link" no Forms Hub;
  e-mail só de dentro da tarefa, na caixa de comentário.
- **monday** (só busca): coluna Phone clicável (exige DDI); WorkForms com "Shorten URL" e QR code;
  Emails & Activities em pop-up dentro do item; vínculo automático pela coluna Email.
- **Twenty** (código): o "From" só aparece com mais de 1 remetente; o compositor abre no painel à
  direita, refeito para não cobrir a página; número inválido não vira link.
- **Pipefy:** "From" fixo, com o endereço do card na dica; desligar o link público invalida o link
  na hora.
- **Notion:** quem quer `mailto:` com assunto monta o link à mão, e o link quebra sem codificar
  espaço e `:`.

## Avaliação da UX do protótipo

Para cada decisão da rodada 1: o que o mercado diz e o que mudou na rodada 2.

| Decisão | O mercado | O que mudou |
|---|---|---|
| Deep link sem envio (`mailto:`, `wa.me`, `sms:`) | Confirma para WhatsApp e SMS (Agendor, Ploomes, RD, Pipedrive). Para e-mail, os CRMs grandes enviam pelo produto | Nada: a parte 3 cobre o envio pelo produto. Número com menos de 10 dígitos dá "Telefone inválido" (Twenty, Ploomes) |
| Cartão "Contato rápido" no alto do painel do item | Confirma (HubSpot, Close, Freshsales, Agendor) | Nada |
| Menu "Contatar" na linha da lista de itens | Confirma em parte: Apollo põe "Email" e "Call" na linha; Pipedrive e monday deixam o telefone clicável na célula | Nada: a lista já tem muitas colunas. WhatsApp e SMS mostram o telefone de origem no menu (Freshsales) |
| Ícone ou botão com rótulo | Dividido: ícone no HubSpot, Close, Ploomes e RD; rótulo no Agendor, Apollo e Freshsales | Nada: rótulo no Contato rápido e nas barras; só ícone na coluna Contato da lista de tarefas, com dica e nome acessível |
| Canal sem dado desabilitado com o motivo | Contradiz: o mercado esconde o botão ou oferece completar o dado (HubSpot, Apollo) | Fica o motivo e soma o próximo passo: "Cadastrar telefone" e "Corrigir telefone" levam ao campo. O botão usa `aria-disabled` e continua no Tab |
| E-mail com 2 caminhos num menu | Confirma (Agendor tem o mesmo menu no WhatsApp; Pipedrive troca o método por uma seta e guarda um padrão) | Vira **botão dividido**: o clique escreve pelo ENSPACE, a seta abre o app (exemplo `FieldGroupDropdownExample` do Nuxt UI). Fica para depois: lembrar a última escolha de cada pessoa |
| Caixa do item em Cc no `mailto:` | Contradiz em parte: o mercado usa Cco e encaminhamento (HubSpot, Pipedrive). Com Cc, a resposta só volta com "responder a todos" | Fica o Cc, e a opção do app avisa: "a resposta volta quando a pessoa responde a todos" |
| Clique direito no cartão do kanban | Não cobre. Clique direito não aparece e não funciona no toque | Sem mudança: depende do SDK (`cardActions`), pedido no `COMPONENTES-CUSTOM.md` |
| Lote de WhatsApp e SMS | Não cobre por deep link (`wa.me` aceita 1 número) | Vira **fila** "Conversa 1 de N", com "Próxima" e a lista de quem fica de fora antes de começar (Close "Call next lead", discador do Apollo) |
| Lembrete da Agenda | Não cobre | O texto leva também o local do evento |
| Módulos por canal e por tela | Confirma por canal; não cobre por tela | Nada: é pedido do documento do Felipe |
| Contato por categoria | Confirma (Twenty por objeto, HubSpot, Close, monday) | Nada. Fica para depois: mais de 1 telefone, com escolha no menu (Freshsales, Zoho) |
| Texto inicial por categoria | Confirma, com modelos (Ploomes, RD) | Nada. Fica para depois: 2 ou 3 textos por categoria |
| Link público nas telas de uso | Não cobre: o mercado põe no construtor | Nada. Fica para depois: link curto para SMS e WhatsApp (monday) |
| "Novo e-mail" na barra do topo | Confirma (Gmail, Outlook, Twenty, HubSpot Inbox) | Soma o atalho **C** (na dica do botão) e **Ctrl+Enter** para enviar |
| Área "E-mails" | Confirma (Apollo, HubSpot Inbox, Pipedrive) | Soma **"Vincular" na linha** do e-mail sem item (Pipedrive "Link item") e **sugestão pelo remetente** |
| Compositor em gaveta | Dividido (Twenty gaveta; Gmail janela; Salesforce acoplado). Em comum: fica aberto enquanto a pessoa navega | Gaveta **sem camada escura** e sem travar a página; **Expandir**; **Minimizar** (e Esc) vira a barra do rodapé, que continua na troca de tela. Abre com o foco no "Para" ou, vindo do item, no texto |
| "Para" com sugestões | Confirma (Twenty, HubSpot, ClickUp, monday, Close) | Soma os contatos dos itens que a pessoa vê, além dos membros. Aberto do item, o contato já vem no "Para" |
| Template | Confirma (HubSpot, Pipedrive, monday, Close, Pipefy, ClickUp) | Nada. Fica para depois: trecho pronto pelo "/" no texto (Close, Twenty) |
| "De" visível | Confirma (HubSpot, Salesforce, Close; Twenty esconde com 1 opção; Pipefy fixo com dica) | Com 1 opção, o "De" vira texto. Ao trocar o item, o "De" ganha destaque, porque nenhum produto troca o remetente pelo vínculo |
| Bloco "Vincular a item" | Confirma o vínculo; o mercado usa formato mais compacto (HubSpot "Associated with", Salesforce "Related To") | Fica o bloco (pedido do documento). Soma **sugestões pelos destinatários** (HubSpot, Pipedrive, monday) |
| Descartar com Desfazer | Confirma (Gmail "Undo") | Soma "Rascunho salvo" no rodapé do compositor (Outlook, HubSpot) |

## O padrão que todos seguem (rodadas 1 e 2)

1. A ação de contato fica no alto do registro.
2. O destinatário vem de um campo principal do registro.
3. O compositor mostra o remetente quando há escolha e oferece templates.
4. O vínculo do e-mail começa automático, pelo endereço, e se corrige à mão.
5. WhatsApp por link abre o WhatsApp Web e não registra a conversa sozinho.
6. O link público de formulário se copia no construtor ou na visão do formulário.
7. Escrever tem atalho de 1 tecla (Gmail `c`, Outlook `N`) e enviar tem Ctrl+Enter.

## O que nenhum deles faz (rodadas 1 e 2)

1. Link de formulário público em tarefa ou num menu da tela inicial, com envio por WhatsApp ou SMS.
2. Botão indisponível que diz o motivo e leva ao campo para corrigir.
3. Fila de WhatsApp e SMS por deep link.
4. Remetente que muda conforme o item escolhido, no compositor aberto de qualquer tela.
5. Ligar e desligar canal por tela.
6. Caixa do registro em Cc no `mailto:` em toda tela.

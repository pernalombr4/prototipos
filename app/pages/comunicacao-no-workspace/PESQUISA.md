# Comunicação no workspace: referências

Consulta em 05/10/2026, nas 3 partes da demanda:

1. Link do formulário público fácil de copiar.
2. Atalhos de contato por deep link (`mailto:`, `wa.me`, `sms:`).
3. E-mail de qualquer tela, com vínculo opcional a um item.

Obrigatórias: Notion, Twenty CRM, ClickUp, monday e Pipefy. Extras: HubSpot, Pipedrive, Attio,
Front, Typeform e Google Forms.

**Sem print nesta rodada.** A pesquisa leu a documentação de cada produto (WebFetch e, onde ele
recebeu 403, o Chrome: ajudas do ClickUp, do monday e do Typeform). Só estão listadas as URLs
abertas. Fase declarada no `DECISOES.md`.

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

# Comunicação no workspace: briefing

## 1. A demanda como veio

Pedido da Mikaela em 05/10/2026, com um documento do Felipe:

> neste doc, estão solicitaçoes de melhoria de usabilidade no enspace. voce deve construir
> prototipos usando /prototipo /nuxt-ui pra isso. nao esqueça de integrar com a sdk do enspace.
> [...] voce deve construir o front das propostas que estao neste doc. agrupe o que fizer
> sentido [...] lembre-se de dar conta de TODOS os pontos daí: configuraçao (user configurador
> jornada) e jornada de usabilidade tambem daquilo ali. explore o enspace antes de propor.

E no meio da rodada:

> veja como funciona tambem nossa folders de emails pra ver se existe endereço do item etc pra
> isso fazer sentido, ok? ou se é endereço do workspace inteiro

O documento, "Usabilidades identificadas por Felipe para facilitar o uso de um usuário padrão",
copiado sem reescrever (as 7 imagens estão descritas na seção 6, porque mostram nome de pessoa e
não entram no repositório público):

> **9.1. Desenvolvimentos simples e fáceis.**
>
> **Communication Shortcuts**
>
> **(a) Acesso mais fácil de link de formulários públicos**
>
> Para acessar o link de formulário público, o usuário precisa ir até em categorias/forms para
> conseguir o link. O ideal é que nas telas de tarefas, itens ou onde o usuário preenche o
> formulário dentro do ENSPACE [SE] o formulário for público exista um botão para copiar o
> formulário para compartilhar com pessoas.
>
> **(b) Botões de interação com outras aplicações, úteis ao usuário**
>
> Nas telas padrão do ENSPACE inserir botões que chamam aplicações do próprio computador do
> usuário, como por exemplo: Email (mailto), Whatsapp Web, SMS.
>
> EMAIL: Precisamos implementar uma ação de "Enviar por e-mail" utilizando o cliente de e-mail
> padrão do usuário via protocolo mailto:. Ao clicar no botão, a aplicação deve abrir a janela de
> composição do cliente de e-mail configurado no dispositivo do usuário (ex.: Outlook, Apple Mail
> etc.). O link deverá ser montado dinamicamente neste formato:
> mailto:destinatario@email.com?subject=ASSUNTO&body=CORPO.
>
> WHATSAPP WEB: Ao clicar no botão de whatsapp, abrir diretamente a conversa com o número
> cadastrado: https://wa.me/14075551234.
>
> TXT Message (SMS): Acionar protocolo SMS: do sistema operacional. Caso exista um aplicativo
> registrado para esse protocolo, o sistema operacional será responsável por abri-lo. Ao clicar no
> botão de SMS, abrir o aplicativo de mensagens do dispositivo com o destinatário selecionado:
>
> Essas ações funcionam exclusivamente como atalhos (deep links). O ENSPACE não deverá gerar
> conteúdo da mensagem, enviar mensagens, realizar autenticação nos serviços ou integrar-se às
> contas de e-mail Whatsapp ou SMS do usuário.
>
> Fluxo esperado:
> - Usuário clica no ícone
> - ENSPACE abre o aplicativo/canal correspondente
> - Usuário escreve e envia a mensagem diretamente pelo aplicativo escolhido
>
> Caso o dado correspondente não esteja cadastrado no contrato (email ou telefone) o respectivo
> botão deverá ficar indisponível.
>
> Importante: Todos esses botões devem ter opção nas configurações de aparecerem ou não nas
> telas, do mesmo modo como foi feito em correções monetárias, comparador.
>
> Exemplo de Modelo: Formulário (se for público, apresenta a opção de copiar o link para envio) ·
> ITEM · TAREFAS (LISTA) · TELA SCHEDULE · TAREFA (KANBAN) · HOME
>
> **Desenvolvimento mediano: email via ENSPACE**
>
> Necessidade de criação de uma modal para envio de mensagem de e-mail usando a integração que já
> possuímos.
>
> Tornar a funcionalidade de e-mail do enspace (aba de email em folder) acessível a partir das
> principais telas do workspace, sem necessidade de o usuário entrar um folder.
>
> Atualmente, o ENSPACE já possui integração com a conta de e-mail do usuário e uma interface
> própria de e-mail, onde o usuário pode acessar para compor a mensagem, ver itens
> recebidos/enviados dentro de um item.
>
> Isso significa que, para acessar o E-mail, o usuário precisa primeiro navegar até um folder,
> mesmo quando está trabalhando em outras áreas do Workspace.
>
> O que é desejado: A funcionalidade existente de e-mail deverá passar a ser acessível também a
> partir das principais telas do ENSPACE: Home/entrada do Workspace · Tasks · Items · Kanban ·
> Folders
>
> O objetivo é transformar o e-mail em uma funcionalidade transversal do Workspace e não em uma
> funcionalidade cuja navegação dependa de estar dentro de um folder.
>
> Não deve ser criada uma nova funcionalidade ou nova integração de e-mail. Deve ser utilizada o
> mesmo componente, incluindo a integração, permissões, dados e comportamentos atuais.
>
> A alteração principal é a de disponibilidade de navegação. O usuário deve conseguir acessar o
> e-mail independentemente da tela principal do Workspace em que estiver.
>
> O E-mail deve ser tratado como um recurso global do Workspace, disponível durante uma navegação
> pelas principais áreas do ENSPACE, da mesma forma que outras funcionalidades transversais da
> plataforma.
>
> Importante: Vinculação de e-mail a item.
>
> O usuário ao redigir um e-mail dentro do ENSPACE, pode opcionalmente vincular esse e-mail a um
> item existente. O objetivo é fazer com que as comunicações relacionadas a um assunto, contrato,
> processo, solicitação, projeto ou qualquer outro item possam ser posteriormente consultadas
> dentro do contexto daquele item.
>
> O vínculo com o item é uma informação interna do ENSPACE e não interfere no conteúdo ou envio do
> e-mail.
>
> Na tela modal/composição do e-mail do ENSPACE deverá possuir um campo "vincular a item/buscar
> item". O campo deve ser opcional e ficar visualmente separado dos campos próprios do e-mail.
>
> A busca do item deverá funcionar como um searchable/autocomplete não como um dropdown. Ao clicar
> ou ao começar a digitar, o usuário deverá conseguir localizar um item existente. A pesquisa
> deverá considerar nome/titulo do item, ID, Folder, Workspace, outros campos relevantes para
> identificação.
>
> O objetivo é permitir que o usuário identifique claramente o item correto mesmo quando existirem
> itens com nomes semelhantes. A busca deverá respeitar as permissões do usuário. Um usuário nunca
> poderá localizar ou vincular um e-mail a um item ao qual não tenha acesso.
>
> Após selecionar um Item, o campo deverá apresentar claramente o vínculo: Vincular a Item ✓
> Contrato Microsoft · CTR-00231 ×
>
> O usuário poderá remover ou substituir o Item antes do envio. O vínculo é opcional. A ausência de
> Item não deve impedir o envio do e-mail.
>
> Quando o e-mail for iniciado a partir de um Item: Quando o usuário clicar em Enviar e-mail a
> partir da tela de um Item específico, o ENSPACE deverá abrir a composição com aquele Item
> automaticamente pré-selecionado. [...] O usuário poderá remover ou alterar esse vínculo antes de
> enviar.
>
> Comportamento após o envio: Quando o e-mail for enviado com um Item vinculado, o ENSPACE deverá
> persistir a relação entre: E-mail ↔ Item. Essa relação deve permitir que o mesmo e-mail seja
> posteriormente encontrado: na área de E-mail do usuário; e no histórico/atividade/comunicações do
> Item relacionado.
>
> O vínculo deve armazenar a referência do Item e não apenas seu nome, para permanecer consistente
> caso o Item seja posteriormente renomeado.
>
> O vínculo com Item deve ser fácil de utilizar, mas não intrusivo. O usuário deve conseguir enviar
> um e-mail sem pensar na estrutura interna do ENSPACE, mas, quando quiser contextualizar a
> comunicação, deve conseguir localizar e vincular o Item em poucos segundos.
>
> A lógica geral será: Redigir e-mail → opcionalmente localizar Item → vincular → enviar; ou,
> quando partir de um Item: Item → redigir e-mail → Item já vinculado → enviar.

## 2. Telas e jornadas em jogo

| Quem | Tela do develop | O que a demanda pede ali |
|---|---|---|
| Quem usa | Início | Atalhos de e-mail, WhatsApp e SMS; link de formulário público; e-mail do ENSPACE |
| Quem usa | Lista de itens e quadro de itens | Atalhos por item; link público da categoria; e-mail do ENSPACE |
| Quem usa | Item (painel da esquerda e pastas) | Contato rápido; e-mail com o item já vinculado |
| Quem usa | Tarefas Rápidas (quadro e lista) | Avisar o responsável; aviso em lote; link de tarefa de formulário |
| Quem usa | Agenda | Enviar lembrete aos participantes |
| Quem usa | Requisições (tela nativa `/request`) | Copiar e mandar o link do formulário público |
| Quem usa | A área de E-mail (hoje escondida) | Achar o e-mail enviado, com o item vinculado |
| Quem configura | Configurações › Sistema › Módulos | Ligar e desligar os atalhos, "do mesmo modo" que Correção Monetária e Comparações |
| Quem configura | Configurações › Estrutura › Categorias | De onde vêm o e-mail e o telefone do contato; formulário público |

## 3. O que seria sucesso

Quem atende fala com o cliente, manda o link do formulário e escreve o e-mail do ENSPACE sem sair
da tela em que está, e o e-mail aparece depois no item certo.

## 4. Um protótipo só

As 3 partes do documento mexem nas mesmas telas (início, item, tarefas, quadro) e no mesmo botão:
o E-mail do atalho (abre o app da pessoa) e o E-mail do ENSPACE (sai pela caixa do item) moram no
mesmo lugar e precisam de um comportamento só. Separar em 2 protótipos mostraria 2 botões de
E-mail na mesma tela, cada um num protótipo. Regra 10 da spec: 2 jornadas na mesma tela do
produto vivem na mesma tela do protótipo.

## 5. O que a pesquisa de UX já dizia

Procurei em `enspace-ux-research` (temas e `UX_REPORT.md`) por e-mail, WhatsApp, SMS,
formulário público, link e compartilhar. Não há tema sobre atalhos de contato nem sobre link de
formulário. Há 4 achados vizinhos:

- **S2-F1 (P1), "A Base nasce invisível":** telas nativas que só existem no dropdown do editor de
  menus, entre elas **Received Emails**. É a tela `/itemEmails` deste briefing. A proposta de lá
  (tela nativa com lugar nomeado) é a mesma direção da área "E-mails" no menu.
- **S3-F4 (P2), Notificações:** o campo obrigatório "Modelo de e-mail" abre com 0 opções, e a tela
  que o alimenta (Configurações › E-mails › Modelos de E-mail) não é citada. O compositor deste
  protótipo usa esses modelos no campo Template.
- **S3-F7 (P3) e S3-F1 (P1), Sistema:** 3 botões Salvar na mesma tela e alteração descartada em
  silêncio ao trocar de aba. Os módulos novos moram nessa tela e herdam os dois problemas, que não
  são deste protótipo resolver (regra 19).
- **C14 (P3), construtor de telas:** "Mailbox" em inglês no meio de opções em português. Mesmo
  padrão de "Mail Box" e "Emails Automáticos" nas pastas.

## 6. As imagens do documento

São 7 telas desenhadas pelo Felipe sobre um workspace de teste em inglês ("TestUSA"):

1. **Formulário (Legal Requests):** cartão "Share this form · Public form" com o link, "Copy link",
   abrir em nova aba e "Send link via Email · WhatsApp · SMS", entre o seletor de formulário e os
   campos.
2. **Item (Matter):** no painel da esquerda, acima de Identification, o cartão "Quick contact" com
   o seletor de pessoa (nome e papel), os botões Email, WhatsApp e SMS e o texto "Opens your mail
   app, WhatsApp Web or Messages with the matter name and ID prefilled. The contact is logged in
   Audit Logs."
3. **Tarefas (lista):** coluna "Contact" com 3 ícones por linha e, com linhas selecionadas, a barra
   "2 tasks selected · Notify assignees via Email · WhatsApp · SMS" e "Email opens one draft to
   both. WhatsApp and SMS open one chat per assignee."
4. **Schedule:** o evento abre um balão com data, item, participantes e "Send reminder via Email ·
   WhatsApp · SMS".
5. **Tarefa (kanban):** botão "Notify" em cada cartão, com o menu Email, WhatsApp e SMS e o dado de
   cada um.
6. **Home:** "Shortcuts: Email · WhatsApp · SMS · Public form link" embaixo da saudação, com o menu
   "Copy a public form link".
7. **Modal de e-mail:** "Nova mensagem" com De, Para (Cc, Cco), Assunto, o bloco "Vincular a Item
   (opcional)" com a busca, editor, "Anexar arquivo", "Anexar do ENSPACE", Descartar e Enviar.

## 7. Como o develop faz hoje

Investigado no workspace de exploração, **pela tela**, em 05/10/2026, sem nenhuma criação por
API. Para ver as pastas e o link público, criei pela tela no workspace de exploração:

- 6 pastas na categoria de teste (Tarefas, Anexos, Emails Automáticos, Mail Box, Notas, Campos);
- 1 formulário público, "Solicitacao externa (teste UX)".

As URLs abaixo omitem o host (o repositório é público).

### 7.1 Link de formulário público

O caminho de hoje, com 6 cliques a partir do menu:

1. Configurações › Estrutura › Categorias (`/workspaces/<ws>/settings/data/types`).
2. A seta da categoria (`/settings/data/types/<categoria>`), cartão Formulários.
3. A lista `/settings/data/types/<categoria>/forms`: colunas Criado em, Nome, Ícone, Visibilidade.
4. "Ações" › **Copiar**. Com o formulário Privado, Copiar fica desabilitado
   ([print](evidencias/08-formulario-copiar-desabilitado.jpg)). Público, o aviso é "Copiado!".

Há um segundo caminho: "Acessar" abre o construtor (`/forms/<hash>/builder`); a engrenagem tem
"Link Externo" e "Alternar Privacidade". O aviso desse é outro texto: "Link copiado para a sua
área de transferência." ([print](evidencias/09-construtor-link-externo.jpg)).

A visibilidade fica no Editar do formulário: abas Definição, Visual e Avançado; campos Nome,
Descrição, Tipo (Editar, Criação, Geral, Visualizar, Criação de Item (obsoleto), Tarefas
(obsoletas)) e Visibilidade (Privado, Público) ([print](evidencias/07-formularios-visibilidade.jpg)).

**Onde o membro usa o formulário:** a tela nativa Requisições (`/request`), com o seletor
"Formulários" e o formulário embaixo. O formulário público aparece igual ao privado: nenhum sinal
de que é público e nenhum link ([print](evidencias/10-requisicoes-sem-link.jpg)). A resposta pública
tem rota própria: `/public/<formulário>/Answer`.

### 7.2 Atalhos de contato

Não existem. O que existe para alimentar um atalho:

- **No item:** campo do tipo E-mail (`email`), Texto com Máscara (`EnlMask`, usado para telefone),
  Pessoa/Empresa (`EnPerson`) e o "E-mail do Requisitante" (`request_email`), que o painel do item
  mostra como "E-mail da solicitação" ([print](evidencias/20-item-painel-esquerdo.jpg)).
- **No membro:** a tela de perfil (`/profile`) tem só E-mail, Nome e Sobrenome. O schema do SDK
  tem `User.meta.phone`, mas nenhuma tela grava. Sem telefone, WhatsApp e SMS para o responsável
  de uma tarefa só funcionam com o dado vindo de fora (SSO ou API).
- **Na Agenda:** o modal "Evento" lista os participantes por e-mail. Os do Outlook não têm
  telefone.
- **Integração:** Configurações › Integrações tem "Whatsapp Twilio" (Canais de Mensagem), que
  envia pelo servidor ([print](evidencias/03-integracoes.jpg)). O documento pede o contrário:
  só abrir o app da pessoa, sem integração.

### 7.3 E-mail

**Cada item tem endereço próprio.** A pasta **Mail Box** ("Visualize mensagens recebidas e
enviadas na caixa de email.", [print](evidencias/05-tipos-de-pasta.jpg)) mostra no topo o endereço
do item com o botão de copiar, as abas Recebidos e Enviados e o lápis
([print](evidencias/19-mailbox-endereco-do-item.jpg)). O endereço é
`<referência do item>.<workspace>@develop.box.enspace.io`: a gaveta do item mostra o começo
(`levd8326af86da64a17970c1…`) e a página cheia do mesmo item, o fim
(`.teste-ux@develop.box.enspace.io`).

**O lápis abre "Nova Mensagem"**, uma gaveta à direita com Para (obrigatório), Adicionar em Cópia,
Template, Assunto, Mensagem (obrigatória, editor com barra), Anexar Arquivo e Enviar
([print](evidencias/06-mailbox-nova-mensagem.png)). **Não há campo De:** o e-mail sai do endereço
do item e a tela não diz. Não enviei e-mail (envio é ação para fora).

**O workspace também tem caixas.** Configurações › E-mails tem:

- E-mails Enviados (Criado em, Status, Email, E-mail em Cópia, Assunto, Tarefa,
  [print](evidencias/18-emails-enviados.jpg));
- Modelos de E-mail (Nome, Assunto, Ação, Usar Remetente por Domínio);
- Caixas de E-mail: a "Caixa de Triagem", criada com Nome, E-mail e Provedor
  (`develop.box.enspace.io`, [print](evidencias/17-caixa-de-email-criar.jpg)).

**Telas que existem e não estão no menu** (achadas na lista de rotas do produto):

- `/itemEmails`, "Emails Recebidos": Ações, Ticket, Data, de, Assunto, box, Tipo
  ([print](evidencias/11-emails-recebidos-escondida.jpg));
- `/messages`: atendimento com canais WhatsApp e E-mail, Atribuídas a mim, Não atribuídas, Todas
  ([print](evidencias/12-messages-atendimento.jpg));
- `/spaceChannel`, "Respostas de Formulários", com a origem "Formulário Privado".

**Outras peças:** a pasta "Emails Automáticos" (os e-mails que os fluxos mandaram), a integração
SendGrid ("usar o domínio de e-mail da sua empresa como remetente") e o gatilho `mailbox` do
Spaceflow, com a opção `link_item` (schema do SDK).

**Conclusão para o desenho:** e-mail vinculado sai do endereço do item, e a resposta volta para
ele. Sem item, sai de uma caixa do workspace. Isso contradiz uma frase do documento ("o vínculo
[...] não interfere no conteúdo ou envio"); a decisão está no `DECISOES.md`.

### 7.4 "Do mesmo modo como foi feito em correções monetárias, comparador"

- **Configurações › Sistema › Informações Básicas**, cartão **Módulos**: 3 chaves (Correção
  Monetária, Comparações, Juridico) e um Salvar ([print](evidencias/01-sistema-modulos.jpg)).
  No schema é `Workspace.modules`.
- **Na categoria**, o painel tem 12 cartões, e o último é "Correção Monetária"
  ([print](evidencias/04-categoria-painel.jpg)).
- `/settings/features` não é esse lugar: lista 5 funcionalidades beta (Novo Editor de Workflows,
  Nova Listagem de Registros e outras).

### 7.5 Telas visitadas

| Tela | Rota |
|---|---|
| Início | `/workspaces/<ws>` |
| Lista de itens (nova) | `/workspaces/<ws>/types/<categoria>?view=default` |
| Item (página cheia) | `/workspaces/<ws>/types/<categoria>/<id>` |
| Tarefas Rápidas | `/workspaces/<ws>/tasks/quick` |
| Tarefas Programadas | `/workspaces/<ws>/tasks/scheduled?view=default` |
| Agenda | `/workspaces/<ws>/schedule` |
| Requisições | `/workspaces/<ws>/request` |
| Emails Recebidos | `/workspaces/<ws>/itemEmails` |
| Atendimento | `/workspaces/<ws>/messages` |
| Respostas de Formulários | `/workspaces/<ws>/spaceChannel` |
| Sistema | `/workspaces/<ws>/settings/system` |
| Funcionalidades beta | `/workspaces/<ws>/settings/features` |
| Categorias, painel, Formulários, Pastas | `/workspaces/<ws>/settings/data/types/<categoria>/...` |
| E-mails (config) | `/workspaces/<ws>/settings/emails/{sent,templates,boxes}` |
| Integrações | `/workspaces/<ws>/settings/integrations` |
| Perfil | `/profile` |

## 8. Achados no caminho

Ficam como estão na casca do protótipo (regra 37):

1. **A Mail Box da página cheia do item perde a referência:** o endereço aparece como
   `.teste-ux@develop.box.enspace.io`. Na gaveta do mesmo item aparece certo.
2. **2 textos para copiar o mesmo link:** "Copiado!" (lista de formulários) e "Link copiado para a
   sua área de transferência." (construtor).
3. **"Nova Mensagem" não mostra de onde o e-mail sai.**
4. **3 telas de comunicação sem entrada no menu** (`/itemEmails`, `/messages`, `/spaceChannel`).
   Mesmo padrão de S2-F1.
5. **A trilha de Requisições mostra o nome da rota:** "request".
6. **Rótulos:** "Juridico" sem acento; "Mail Box" e "Emails Automáticos" sem tradução e sem hífen;
   "Mensagem é obrigatório." sem concordância.
7. **Agendadas ou Programadas:** o menu diz "Agendadas"; a trilha e a aba dizem "Programadas".
8. **Trocar de aba na gaveta do item pede "Alterações não salvas"** sem nada editado.
9. **O botão do cartão Correção Monetária no painel da categoria não abriu** a tela (3 cliques).
10. **O perfil não tem telefone**, embora o schema tenha `User.meta.phone`.

## 9. A casca da tela, item por item

Copiada do develop em 05/10/2026 e montada no `EnLayout` do SDK.

**Menu lateral (200 px):**

- Topo: o workspace (ícone redondo, nome, slug, seta) e "Buscar..." com `CTRL` `K`.
- Membro: Início · Spaceflows · Categorias (abre as categorias) · Tarefas (abre Agendadas e
  Rápidas) · Agenda · Knowledge.
- Configurações: Visão Geral · Sistema · Estrutura (Categorias, Listas, Spaceflow) · Gestão de
  Membros · Interface · E-mails (E-mails Enviados, Modelos de E-mail, Caixas de E-mail) ·
  Integrações · Agentes de IA · Logs · Credenciais.
- Ajuda: Releases · Documentação (com seta de link externo).
- Item ativo em azul; filho ativo com fundo.

**Barra do topo:** recolher o menu, voltar, avançar, recarregar, início, a trilha numa faixa
arredondada com `CTRL` `B` e a estrela; à direita a bandeira do idioma, o tema, Suporte, o sino
com "99+" e o avatar.

**O que entra na casca e não é cópia:**

- "Requisições" na seção Membro: entrada de menu configurada em Interface › Menus (tela nativa
  `/request`). Cliente costuma ter; o workspace de exploração não tinha.
- "E-mails" na seção Membro e "Novo e-mail" na barra do topo: proposta (ver `DECISOES.md`).

## 10. Preparo por API

Nenhum. O volume do protótipo (64 itens, 14 tarefas, 10 e-mails, 12 eventos) é dado fictício do
`mocks.ts`.

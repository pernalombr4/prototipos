# Comunicação no workspace: decisões

## A proposta em 1 minuto

**Um protótipo para as 3 partes do documento**, porque elas mexem nas mesmas telas e no mesmo
botão de E-mail (motivo no `BRIEFING.md`, seção 4).

| Parte do documento | Onde aparece no protótipo |
|---|---|
| (a) Link do formulário público | Requisições (cartão "Compartilhar este formulário"); Início ("Link de formulário público"); lista de itens da categoria; painel da tarefa de preencher formulário |
| (b) Atalhos de e-mail, WhatsApp e SMS | Início (Atalhos); item (Contato rápido); lista de itens (menu "Contatar"); quadro de itens (clique direito); tarefas (coluna Contato, aviso em lote, clique direito, painel); Agenda (lembrete) |
| Configuração dos atalhos | Sistema › Módulos ("Atalhos de comunicação": canais, telas, texto inicial, cópia para o item); Categorias › cartão "Atalhos de comunicação" (de quais campos vêm nome, e-mail e telefone) |
| E-mail do ENSPACE em todas as telas | "Novo e-mail" na barra do topo; "E-mails" no menu (Recebidos e Enviados, com o item); o compositor com "De" e "Vincular a item" |
| Configuração do e-mail | Sistema › Módulos ("E-mail do ENSPACE em todas as telas": de onde o e-mail sai e quais categorias têm a pasta Mail Box). Cada pessoa integra o Correio do Outlook no próprio perfil |

## O fluxo do e-mail

```
De qualquer tela                     Do item (Contato rápido ou Mail Box)
   │ Novo e-mail (topo)                 │ E-mail (botão dividido)
   ▼                                    ▼
Nova Mensagem ── De: sua conta do Outlook (a mesma nos 2 casos)
   │                                    │  Vincular a item: já preenchido
   │ Vincular a item (opcional)          │  (troca ou remove)
   │  busca: nome, referência, ID,       │
   │  categoria, contato                 │
   ▼                                    ▼
 Enviar ─────────────────────────────────┘
   │
   ├─ com item: Responder para = endereço do item; a resposta volta para a Mail Box;
   │            o e-mail aparece em E-mails e na Mail Box do item
   └─ sem item: sem Responder para; a resposta chega só no Outlook da pessoa;
                o e-mail aparece em E-mails, coluna Item "Sem item"

Sem o Correio do Outlook integrado: a gaveta mostra "Nenhuma conta integrada
disponível" e "Integrar contas"; o botão E-mail abre o app da pessoa (mailto:).
```

## Rodada 1 · 2026-10-05

- **Pedido (literal):** "voce deve construir o front das propostas que estao neste doc. agrupe o
  que fizer sentido [...] lembre-se de dar conta de TODOS os pontos daí: configuraçao (user
  configurador jornada) e jornada de usabilidade tambem daquilo ali". No meio da rodada: "veja
  como funciona tambem nossa folders de emails pra ver se existe endereço do item etc pra isso
  fazer sentido, ok? ou se é endereço do workspace inteiro".
- **Mudou:** protótipo novo, com 9 telas navegáveis pelo menu lateral:
  - Início, lista e quadro de itens, item, Tarefas Rápidas (quadro e lista), Agenda, Requisições,
    E-mails, Sistema e Categorias;
  - o compositor ("Nova Mensagem") abre de qualquer uma.
- **Fronteira:** muda o que o contorno tracejado mostra (chave "Mostrar o que muda" no andaime);
  não muda a casca (menu, barra do topo, trilha) nem o conteúdo de hoje das telas.
- **Maquete:**
  - os atalhos não abrem o app: mostram, num aviso, o link exato que abririam (`mailto:`,
    `https://wa.me/...`, `sms:`). Assim ninguém manda mensagem para número inventado;
  - "Abrir numa nova aba" do link público só avisa;
  - Enviar grava o e-mail na memória (some ao recarregar). O cenário "Envio falha" do andaime
    mostra o erro;
  - Anexar arquivo acrescenta um nome de arquivo fictício;
  - as pastas do item fora de Visão Geral, Tarefas e Mail Box mostram "Pasta fora deste
    protótipo";
  - "Tornar público" e "Tornar privado" no menu do formulário são atalho do protótipo para o Editar
    › Visibilidade (e para o "Alternar Privacidade" do construtor), que já existem.
- **Não deu:** prints das referências (a pesquisa leu a documentação, sem captura); `vue-tsc` para
  checar tipos (não está instalado e instalar mexe no `package.json`).
- **Ver:** `http://localhost:3000/comunicacao-no-workspace` · prints:
  [início](evidencias/prototipo-01-inicio-atalhos.jpg),
  [item](evidencias/prototipo-02-item-contato-rapido.jpg),
  [E-mail com 2 caminhos](evidencias/prototipo-03-email-dois-caminhos.jpg),
  [compositor e busca](evidencias/prototipo-04-compositor-busca-de-item.jpg),
  [Sistema › Módulos](evidencias/prototipo-05-sistema-modulos.jpg).

## Rodada 2 · 2026-10-05

- **Pedido (literal):**
  - "saiba que os atalhos de comunicaçao nao devem ser um modulo simplesmente deve existir no
    enspace. usuario nao precisa ativar. isso existe por padrao. ajuste esse ponto de jornada de
    configurador", e depois: "calma... o felipe pediu pra ser módulo? se sim, entao mantenha.";
  - "me diga quais produtos voce pesquisou pra executar esse prototipo. voce deve considerar hubspot
    na sua lista, alem de apollo. clickup tem que ser considerado, monday, twenty e outros tambem.
    garanta uma pesquisa mais extensa pra ver se a ux ta interessante e use
    /nuxt-ui:implement-component-with-props (MCP) /nuxt-ui pra melhorar o que precisar".
- **O módulo fica.** O documento do Felipe pede: "Todos esses botões devem ter opção nas
  configurações de aparecerem ou não nas telas, do mesmo modo como foi feito em correções
  monetárias, comparador". Correção Monetária e Comparador moram no cartão Módulos de Sistema.
- **Pesquisa:** 20 produtos na rodada 2 (lista e avaliação de cada decisão no `PESQUISA.md`, seção
  "Rodada 2").
- **Mudou:**
  - **E-mail em botão dividido:** o clique escreve pelo ENSPACE, a seta abre o app. Some o clique a
    mais da rodada 1;
  - **o aviso do Cc** no menu da seta: a resposta volta ao item quando a pessoa responde a todos;
  - **canal sem dado** continua no Tab (`aria-disabled`), diz o motivo e leva ao campo:
    "Cadastrar telefone", "Corrigir telefone", "Cadastrar e-mail";
  - **telefone com menos de 10 dígitos** dá "Telefone inválido" (o mock da Atlas tem um);
  - **compositor:** sem camada escura e sem travar a página; Expandir; Minimizar e Esc guardam o
    rascunho numa barra do rodapé, que continua na troca de tela; "Rascunho salvo" no rodapé;
  - **foco ao abrir:** no "Para"; vindo do item, no texto;
  - **atalhos de teclado:** C escreve (fora de campo de texto), Ctrl+Enter envia. As dicas mostram
    as teclas;
  - **"De":** com 1 opção vira texto; ganha destaque quando o vínculo troca o remetente;
  - **"Para":** sugere também os contatos dos itens que a pessoa vê;
  - **sugestão de item** no bloco "Vincular a item", pelos destinatários;
  - **E-mails:** "Vincular" na linha do e-mail sem item e sugestão de item pelo remetente na
    leitura;
  - **lote de WhatsApp e SMS** vira fila: quem fica de fora antes de começar, "Conversa 1 de N",
    "Abrir conversa" e "Próxima";
  - **lembrete da Agenda** leva o local do evento;
  - **link do editor** em português, espanhol e inglês (`_LinkDoEditor.vue`, cópia traduzida do
    exemplo `EditorLinkPopover` do Nuxt UI).
- **Descartado, com o motivo:**
  - trocar o bloco "Vincular a item" por uma linha junto do Enviar (formato do HubSpot e do
    Salesforce): o documento pede o vínculo "visualmente separado";
  - 2 ou 3 textos iniciais por categoria e mais de 1 telefone por contato: ficam para depois, porque
    mexem na configuração da categoria;
  - link curto e QR code para o link do formulário: dependem de serviço fora do ENSPACE;
  - lembrar a última escolha do botão E-mail: precisa de preferência por pessoa.
- **Maquete:** a mesma da rodada 1. O rascunho e os e-mails somem ao recarregar.
- **Não deu:**
  - o `/nuxt-ui:implement-component-with-props` é um prompt do MCP que a pessoa chama no chat; o
    agente não chama prompt. No lugar, as ferramentas do MCP `nuxt-ui`: metadados de `FieldGroup`,
    `DropdownMenu`, `Slideover`, `InputMenu` e `Editor`, e os exemplos `FieldGroupDropdownExample` e
    `EditorLinkPopover`;
  - Apollo, ClickUp, monday, Salesforce e RD Station: a ajuda bloqueia leitura automática (403 ou
    página montada por script). O que veio da busca está marcado "só busca" no `PESQUISA.md`.
- **Ver:** `http://localhost:3000/comunicacao-no-workspace` · prints:
  [E-mail em botão dividido](evidencias/prototipo-06-email-botao-dividido.jpg),
  [compositor com sugestão de item](evidencias/prototipo-07-compositor-sugestao-de-item.jpg),
  [rascunho minimizado](evidencias/prototipo-08-rascunho-minimizado.jpg),
  [fila de WhatsApp](evidencias/prototipo-09-fila-de-whatsapp.jpg),
  [E-mails com sugestão pelo remetente](evidencias/prototipo-10-emails-sugestao-pelo-remetente.jpg),
  [escuro e espanhol](evidencias/prototipo-11-escuro-espanhol.jpg).

## Rodada 3 · 2026-10-05

- **Pedido (literal):** "voce tem certeza que tudo que ta nesse prototipo cabe na estrutura LÓGICA
  do enspace? quando tiver certeza, me diga: qual a logica pro uso de cada ponto da
  funcionalidade? isso tem q estar documentado num docx."
- **Conferido:** o código da Mail Box no develop (gaveta "Nova Mensagem"), os schemas do SDK 0.17,
  a documentação de suporte (`en-docs`, só leitura) e as telas do workspace de exploração.
- **Premissa errada, corrigida:** o e-mail da Mail Box **não sai do endereço do item**. Sai da conta
  do Outlook que a pessoa integrou (Perfil › Integrações › Correio do Outlook), pela rota
  `user-integrations/microsoft/send-email`. O endereço do item vai em `replyTo` e `mailBox`, e a
  referência do item em `item_ref`. Sem conta integrada, a gaveta mostra "Nenhuma conta integrada
  disponível" e "Integrar contas". A pergunta da rodada 1 (o vínculo é o remetente?) acabou: o
  remetente é sempre a pessoa; o vínculo só define para onde a resposta volta e onde o e-mail fica.
- **Mudou:**
  - "De" fixo na conta do Outlook da pessoa; com item, a linha "Responder para" com o endereço do
    item; sem item, "a resposta chega só no seu Outlook";
  - saiu a "caixa para e-mail sem item" de Sistema › Módulos: caixa do workspace é remetente de
    fluxo e porta de entrada de Spaceflow, não do e-mail que a pessoa escreve;
  - cenário "Sem caixa de e-mail" virou "Sem Outlook integrado": a gaveta mostra o aviso de hoje e o
    botão E-mail abre o app da pessoa;
  - "Inserir assinatura" no compositor (existe hoje na Mail Box);
  - link público só para formulário público de tipo Criação ou Geral (Editar e Visualizar dependem
    de um item que o link não leva); na tarefa, a linha "a resposta cria um item novo e não conclui
    a tarefa";
  - Agenda: evento de item mostra "Contatos do item", sem local; evento de tarefa mostra o
    "Responsável"; só a reunião do Outlook tem participantes e local;
  - contato da categoria aceita os subcampos do Pessoa/Empresa (nome, e-mail e telefone de contato);
  - os e-mails enviados do mock saem da conta de quem enviou, não do endereço do item.
- **Confirmado, sem mudança:** módulo em Sistema › Módulos (como Correção Monetária e Comparações);
  cartão na categoria (como Correção Monetária); atalho na tela inicial (como "Acessar
  Comparações"); tarefa rápida com formulário (vem de Spaceflow); telefone sem tipo próprio (Texto
  com máscara), por isso o mapeamento por categoria.
- **Não deu:** a documentação diz que o Correio do Outlook "exibe sua caixa de entrada dentro do
  ENSPACE e permite vincular e-mails a tarefas e registros", e o código do develop não tem essa tela
  nem a rota de vínculo. Fica como pergunta ao dev.
- **Entrega:** `LOGICA-DA-FUNCIONALIDADE.docx`, com o funcionamento, a jornada e a justificativa de
  cada ponto.

## Por que cada decisão

### O e-mail sai da conta do Outlook da pessoa; o item recebe a resposta

Lido no código da gaveta "Nova Mensagem" da Mail Box (develop, 05/10/2026):

- o envio é `POST user-integrations/microsoft/send-email` com `to`, `cc`, `bcc`, `replyTo`,
  `subject`, `message`, `attachments` e `item_ref`;
- o remetente é a conta do Outlook que a pessoa integrou em Perfil › Integrações;
- no item, `replyTo` e `mailBox` recebem `<referência do item>.<workspace>@<domínio das caixas>`, e
  `item_ref` recebe a referência do item;
- sem conta integrada, a gaveta mostra "Nenhuma conta integrada disponível" e "Integrar contas".

Daí o compositor global usa o mesmo envio:

- **com item vinculado:** o mesmo envio de hoje. A resposta volta para a Mail Box do item;
- **sem item:** o mesmo envio sem `replyTo` e sem `item_ref`. A resposta chega só no Outlook da
  pessoa. **Pergunta ao dev:** o envio sem `item_ref` fica gravado em `sendmails` para aparecer na
  área E-mails?

Isso fecha com o documento: "O vínculo com o item é uma informação interna do ENSPACE e não
interfere no conteúdo ou envio do e-mail". O remetente não muda; o vínculo muda só o "Responder
para" e onde o e-mail fica guardado.

### O "De" aparece

A "Nova Mensagem" de hoje não diz de onde o e-mail sai (o texto "De (Contas Integradas)" existe no
código e não aparece na tela). O protótipo mostra a conta da pessoa e, com item, o "Responder para".
HubSpot, Salesforce, Close e Pipefy mostram o From.

### O botão E-mail tem 2 caminhos, num botão dividido

Com o módulo "E-mail do ENSPACE" ligado, o E-mail dos atalhos é um botão dividido
(`UFieldGroup` com `UDropdownMenu`, como o exemplo `FieldGroupDropdownExample` do Nuxt UI):

- **o clique no corpo escreve pelo ENSPACE:** sai da conta do Outlook da pessoa e fica na Mail Box
  do item;
- **a seta abre "Abrir no meu app de e-mail":** o `mailto:` que o documento pede.

O caminho do ENSPACE vem primeiro porque é o único em que a resposta sempre volta ao item. Com o
módulo desligado, ou sem o Correio do Outlook integrado, o botão abre direto o app. É a regra do Twenty (com caixa, compositor interno; sem
caixa, `mailto:`), com a escolha à vista, porque no ENSPACE as 2 coisas existem juntas. Agendor
tem o mesmo desenho no WhatsApp; o Pipedrive troca o método por uma seta. Na coluna de ícones não
cabe o botão dividido: lá, os 2 caminhos vão num menu.

### A caixa do item vai em cópia no e-mail do app

Ideia do monday ("CC to pulse"). Quando a pessoa abre o e-mail no Outlook, o `mailto:` leva a
caixa do item em `cc`. A resposta do cliente volta para a aba Mail Box, e o ENSPACE não enviou
nada. Liga e desliga em Sistema › Módulos ("Pôr a caixa do item em cópia").

HubSpot e Pipedrive usam Cco. Com Cco, a resposta só volta se alguém a encaminhar; com Cc, volta
quando o cliente responde a todos. O protótipo fica com o Cc e diz isso na opção do menu.

### "Não gerar conteúdo" e o texto inicial

O documento diz que o ENSPACE "não deverá gerar conteúdo da mensagem" e, no mesmo parágrafo, pede
`mailto:...?subject=ASSUNTO&body=CORPO`. O protótipo resolve assim:

- o assunto e o texto inicial vêm de um modelo curto, por categoria, com variáveis (`{referencia}`,
  `{titulo}`, `{nome}`, `{categoria}`);
- quem envia muda tudo no app antes de mandar;
- o administrador desliga em Sistema › Módulos ("Preencher assunto e mensagem"), e aí o app abre só
  com o destinatário.

### Quem é o contato: por categoria

O item não tem um campo "telefone do contrato" fixo: cada categoria tem os seus, e o ENSPACE não
tem tipo de campo telefone (o telefone é um Texto com máscara, como o CNPJ). Por isso o cartão
novo no painel da categoria (ao lado de Correção Monetária) diz de quais campos vêm o nome, o
e-mail e o telefone de cada contato. As origens possíveis: campo E-mail, Texto com máscara, o
"E-mail do Requisitante" (`request_email`) e os subcampos de contato do Pessoa/Empresa
(`contact_name`, `contact_email`, `contact_phone`). A configuração fica em `ItemType.settings`. Uma categoria pode ter mais de 1 contato (Contratos tem
"Contato da contraparte" e "Requisitante"); o Contato rápido do item deixa escolher. A prévia ao
lado mostra o link que cada atalho abre com o item de exemplo.

### Canal sem dado: desabilitado, com o motivo

Pedido do documento ("o respectivo botão deverá ficar indisponível"). O mercado esconde o botão
(Agendor, Ploomes, Twenty) ou oferece completar o dado (HubSpot "+ Add phone number", Apollo). O
protótipo junta as 2 coisas:

- **o motivo:** "Sem telefone cadastrado", "Sem e-mail cadastrado" ou "Telefone inválido" (menos
  de 10 dígitos), na dica e no nome acessível;
- **o próximo passo,** no Contato rápido: "Cadastrar telefone", "Corrigir telefone" ou "Cadastrar
  e-mail" abre a Visão Geral com o foco no campo;
- **`aria-disabled`, não `disabled`:** o botão continua no Tab, e o motivo chega a quem usa teclado.

Canal que o administrador desligou não aparece.

### Membro sem telefone

O perfil não tem telefone. O schema tem `User.meta.phone`, e o protótipo supõe esse dado em metade
dos membros, para mostrar os 2 estados. Para o aviso ao responsável de uma tarefa por WhatsApp ou
SMS funcionar de verdade, o perfil precisa do campo. **É dependência fora desta demanda** (regra
19: não resolver na tela B o problema da tela A): fica registrada, não desenhada.

### Link público: nas telas de uso, sem tirar da configuração

- **Só formulário público de tipo Criação ou Geral.** O link público abre o formulário sem item, e
  a resposta cria um item na categoria do formulário. Editar e Visualizar dependem de um item que o
  link não leva.
- **Requisições:** o cartão do mockup 1, entre o seletor e o formulário, só com formulário público.
  Formulário privado ganha 1 linha dizendo por que não há link.
- **Início:** o menu "Link de formulário público", com copiar e enviar por formulário.
- **Lista de itens:** o mesmo menu, só com os formulários da categoria, ao lado de "Novo registro".
- **Tarefa de preencher formulário** (`type: form`, gerada por Spaceflow): o cartão no painel da
  tarefa, com a linha "a resposta pelo link cria um item novo e não conclui esta tarefa". A tarefa
  só fecha quando o responsável preenche e conclui.
- **O Copiar da configuração continua** (regra 20: destaque soma, não substitui). Muda só o aviso: 1 texto em todo lugar, "Link
  copiado", no lugar dos 2 de hoje.

### Tarefas: lista com aviso em lote, quadro com clique direito

- **Lista:** a coluna Contato (3 ícones) e, com tarefas selecionadas, "Avisar responsáveis por".
  E-mail abre 1 rascunho para todos. WhatsApp e SMS viram uma fila, porque `wa.me` aceita 1 número
  e o navegador bloqueia várias abas abertas de uma vez:
  - antes de começar, a janela diz quem fica de fora por falta de telefone;
  - "Conversa 1 de N", com barra de progresso, "Abrir conversa" e "Próxima";
  - no fim, "Todas as conversas abertas." É o modelo do "Call next lead" do Close e do discador
    em fila do Apollo.
- **Quadro:** o mockup 5 põe "Notify" em cada cartão. O `EnKanbanBoard` 0.17 não aceita ação extra
  no cartão (sem slot e sem prop). O protótipo usa o clique direito (o board emite
  `context-mouse`) e o painel da tarefa, que abre no clique do cartão. **Pedido ao SDK:** uma prop
  de ações extras no menu do cartão (ver `COMPONENTES-CUSTOM.md`).

### Agenda: lembrete por participante

A Agenda junta 3 fontes: datas de itens (campo de data da categoria), tarefas (Fluxo Padrão e
Tarefas Rápidas) e reuniões do Outlook. O modal "Evento" ganha um atalho por pessoa e "E-mail para
todos", e a pessoa muda conforme a fonte:

- **reunião do Outlook:** os participantes. Só têm e-mail, então WhatsApp e SMS ficam
  desabilitados com o motivo;
- **data de um item:** os contatos do item (cartão "Atalhos de comunicação" da categoria);
- **prazo de uma tarefa:** o responsável.

O texto do lembrete leva data, hora e, na reunião do Outlook, o local.

### A área "E-mails" no menu

O documento pede que o e-mail apareça "na área de E-mail do usuário". Essa área existe escondida
(`/itemEmails`, "Emails Recebidos"; achado S2-F1 da pesquisa de UX: telas nativas que só existem no editor de menus). O protótipo a põe na seção Membro, com
Recebidos e Enviados, a coluna Item, o filtro "Com item" e "Sem item", e o vínculo depois do envio
(ideia do Pipedrive):

- **"Vincular" na própria linha** do e-mail sem item (o "Link item" do Pipedrive);
- **sugestão pelo remetente** na leitura: os itens em que quem escreveu é contato aparecem antes da
  busca livre.

O nome repete o "E-mails" de Configurações, como "Categorias" já se repete entre Membro e Estrutura.

### "Novo e-mail" na barra do topo

O documento pede o e-mail "da mesma forma que outras funcionalidades transversais da plataforma".
As transversais de hoje moram na barra do topo (Suporte, notificações). O botão tem rótulo, não só
ícone, para ser achado na primeira vez. Com rascunho guardado, ganha um ponto amarelo. A tecla **C**
escreve, fora de campo de texto (Gmail `c`, Outlook `N`), e a dica do botão mostra a tecla.

### O compositor não tranca a tela

- **Sem camada escura e sem travar a página** (`overlay` e `modal` desligados): a pessoa consulta o
  item com o e-mail aberto, como no Salesforce e no Gmail.
- **Expandir** alarga a gaveta para textos longos.
- **Minimizar, Esc e o X guardam o rascunho** numa barra do rodapé, que continua na troca de tela
  (`_RascunhoMinimizado.vue`). Descartar oferece "Desfazer".
- **Foco ao abrir:** no "Para"; vindo do item, com o destinatário pronto, no texto.
- **Ctrl+Enter envia**, também dentro do editor. A dica do Enviar mostra as teclas.
- **"Para"** sugere membros e os contatos dos itens que a pessoa vê.

### Busca de item

- **Rota nova.** A busca global (Ctrl K) não procura itens: navega por menus e ações (docs:
  Navegação). A busca de item entre categorias, filtrada por permissão, precisa ser construída.
- Só no workspace atual: o endereço do item e as permissões são do workspace.
- Busca, não lista: vazia, mostra os 5 atualizados por último; com texto, os 8 melhores e quantos
  ficaram de fora (regra 34: o controle se desenha para o volume real, e o workspace tem milhares de itens).
- Procura em referência, ID, nome, categoria, contatos e campos de texto (contraparte, CNPJ).
- Resultado agrupado por categoria, com ID, etapa e contraparte: itens de nome igual se distinguem.
- Item sem permissão não aparece, nem na contagem. A lista diz isso no rodapé.
- Antes da busca, **sugestões pelos destinatários:** até 3 itens em que alguém do "Para" é contato
  (HubSpot, Pipedrive e monday sugerem o registro pelo endereço).

## O que é do SDK

- **Usado:** `EnLayout` (a casca, pela primeira vez neste repositório), `EnTable` (lista de itens,
  lista de tarefas, E-mails, Formulários), `EnKanbanBoard` (quadro de itens e de tarefas) e os
  tipos do `enspace-sdk-schemas` (`Workspace`, `Member`, `ItemType`, `Field`, `Item`, `Task`).
- **Sem schema no SDK 0.17:** formulário, e-mail, caixa de e-mail e evento da Agenda. A forma veio
  das telas do develop e está marcada no `mocks.ts`.
- **Limites encontrados:**
  - `EnLayout` não repassa `ui` ao `USidebar`, que fixa 16rem. O develop usa ~200 px;
  - `EnKanbanBoard` não aceita ação extra no cartão.

## CSS e classes fora do token

Conferido com `grep "<style\|:deep(\|!important"`: nenhum `<style>`, `:deep()` ou `!important`.
Classes com valor arbitrário:

| Onde | Classe | Por quê |
|---|---|---|
| `_CascaDoEnspace.vue` | `[&>.peer]:[--sidebar-width:12.5rem]` | O `EnLayout` não repassa `ui` ao `USidebar`. Consulta: `Layout.vue.js` do SDK e `.nuxt/ui/sidebar.ts` |
| `_CascaDoEnspace.vue` | `w-[min(50rem,calc(100vw-30rem))]` | O slot `navbar-title` do `EnLayout` não estica (sem `flex-1`), e a trilha do develop ocupa o meio da barra |
| telas | `animate-[entrada_...]` | Usa o `@keyframes entrada` do `main.css` |
| `_TelaItem.vue`, `_TelaEmails.vue` | `[&_p]:my-1.5`, `[&_blockquote]:...` | Corpo do e-mail vem em HTML |
| `_TelaAgenda.vue` | `[&:nth-child(7n)]:border-r-0` | Grade do mês montada à mão: nem o Nuxt UI nem o SDK têm calendário de eventos (MCP: o `UCalendar` escolhe data) |
| `_CascaDoEnspace.vue` | `text-[9px]` | O selo "BR" da barra do topo do develop, em 24 px |
| `_BuscaDeItem.vue` | `text-[11px]` no `label` | O rótulo de grupo (nome da categoria) mais baixo que o resultado, como o develop |
| `_Compositor.vue` | `scale-[.98]` | Entrada do bloco "Vincular a item" ao trocar entre busca e item escolhido |
| `_TelaItem.vue` | `min-h-[calc(100dvh-4rem)]` | O item ocupa a altura da tela menos a barra do topo, como no develop |
| `_LinksPublicos.vue` | `w-[22rem]` | Largura do menu de links públicos: cabe o nome do formulário e os 2 botões |
| `_TelaEmails.vue`, `_TelaTarefas.vue` | `grid-cols-[5rem_1fr]`, `grid-cols-[8rem_1fr]` | Rótulo e valor em 2 colunas na leitura do e-mail e no painel da tarefa |
| `_TelaCategoria.vue` | `xl:grid-cols-[1fr_24rem]` | Configuração dos atalhos à esquerda, prévia dos links à direita |
| `_RascunhoMinimizado.vue` | `w-[min(26rem,calc(100vw-2rem))]` | A barra do rascunho cabe na tela estreita sem passar da borda |
| `_AcoesDeContato.vue` | `itemDescription: 'whitespace-normal'` | O tema do `DropdownMenu` corta a descrição em 1 linha; o aviso do Cc precisa ser lido inteiro |

## Crítica e acessibilidade

Rodadas `design:design-critique` e `design:accessibility-review` sobre o código e as telas.

**Corrigido nesta rodada:**

- o motivo do atalho indisponível só estava no tooltip: agora há linha visível no Contato rápido;
- a linha do e-mail na Mail Box abre e fecha sem `aria-expanded`: acrescentado;
- o ponto de "não lido" não tinha papel para leitor de tela: `role="img"` com rótulo;
- "Vinculado porque você começou no item" continuava depois de trocar o item à mão: some na troca;
- os 3 botões do Contato rápido quebravam linha: dividem a largura do cartão.

**Corrigido na rodada 2:**

- o E-mail com 2 caminhos custava 1 clique a mais: virou botão dividido;
- o botão sem dado saía do Tab (`disabled`): virou `aria-disabled`, com o motivo no nome acessível;
- o compositor abria com o foco no Expandir, a dica dele abria e o 1º Esc só fechava a dica: o foco
  vai para o "Para" ou para o texto;
- o aviso do Cc saía cortado no menu: quebra linha;
- a barra do rascunho ficava atrás da barra de andaime quando ela quebra em 2 linhas: subiu;
- o tema escuro e o espanhol ficaram conferidos ([print](evidencias/prototipo-11-escuro-espanhol.jpg)).

**Fica sem correção, com o motivo:**

- **o clique direito do quadro não chega pelo teclado.** O caminho de teclado é abrir o cartão (o
  painel da tarefa tem os mesmos atalhos). Correção de verdade depende do SDK;
- **WhatsApp e SMS no Início, sem destinatário,** abrem o app vazio. Estão porque o mockup 6 pede;
  o administrador desliga "Tela inicial" em Onde aparecem;
- **o "Novo e-mail" com rótulo pesa na barra do topo.** Ícone sozinho seria mais leve e mais
  difícil de achar;
- **o aviso com "Ver no item" some em 5 s.** O mesmo caminho existe na tela E-mails;
- **a tecla C abre o compositor em qualquer tela.** Quem não conhece o atalho pode abrir sem
  querer; Esc fecha sem perder nada.

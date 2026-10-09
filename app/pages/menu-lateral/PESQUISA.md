# Pesquisa — como o mercado resolve um menu nativo grande

**Rodada 1 · 16/09/2026.** Oito produtos: as cinco referências obrigatórias e mais três
escolhidas pela natureza do problema (gestão de dados e registros, pela tabela da Fase 3).

Os prints saíram das páginas oficiais de documentação, capturados no Chrome. Saem em `.gif`
porque é o formato que a captura desta sessão consegue gravar em disco; cada um tem dois
quadros da mesma página.

**Referência é padrão de interação, nunca identidade.** Nada de marca, cor, ícone ou texto
de outro produto atravessa para o protótipo.

---

## As cinco obrigatórias

### 1. Notion

[notion.com/help/navigate-with-the-sidebar](https://www.notion.com/help/navigate-with-the-sidebar)
· [print](evidencias/ref-notion-sidebar.gif)

**Como resolve, em passos:**

1. O topo da barra é fixo e curto: trocador de workspace, busca, `Home`, `Inbox` e afins.
2. O meio é feito de **seções nomeadas**: `Teamspaces`, `Shared`, `Private`, `Favorites`.
3. Cada seção recolhe clicando no próprio nome: "Click on the name of a sidebar section
   `Teamspaces`, `Shared`, or `Private` to collapse it and keep your sidebar nice and clean."
4. `Favorites` **não existe até você favoritar a primeira página**. A seção nasce do uso.
5. Lista longa não mora inteira na barra: você escolhe quantos itens cada seção mostra (de
   5 a todos) e um botão `More` abre um painel com o resto.
6. `Settings` fica no **rodapé**, fora das seções de conteúdo.

**O que serve:** a seção nomeada e recolhível como unidade de organização; Favoritos que
aparece só quando tem conteúdo; teto de itens por seção com escape para "ver o resto";
configuração fora do corpo do menu.

**O que não serve:** o aninhamento infinito de páginas ("you can nest pages inside other
pages with no limit"). No Notion a hierarquia **é** o conteúdo. No ENSPACE a hierarquia é
estrutura de dados, e é justamente ela que está entupindo o menu.

---

### 2. Twenty CRM

[docs.twenty.com/user-guide/getting-started/configure-your-workspace](https://docs.twenty.com/user-guide/getting-started/configure-your-workspace)
· [print](evidencias/ref-twenty-workspace.gif)

**Como resolve, em passos:**

1. A barra lateral tem uma seção `Workspace` que lista os objetos, padrão e customizados:
   People, Companies, Opportunities e os que o workspace criou.
2. Objeto é item de primeiro nível na seção. Não há terceiro nível para vistas ou
   formulários: a vista é escolhida **dentro da página do objeto**.
3. Toda a modelagem mora numa área à parte, alcançada por `Settings`, com endereços como
   `Settings → Data Model`, `Settings → Roles` e `Settings → Accounts`.
4. Objeto que o workspace não usa se **desativa** ("You can deactivate standard fields and
   objects you do not want to use"), e some da navegação.

**O que serve:** é o análogo mais direto do ENSPACE, porque também é um produto de objetos
configuráveis. Duas lições: **modelagem de dados não fica no menu de trabalho**, e
**desativar o objeto o tira da navegação** em vez de exigir que a pessoa conviva com ele.

**O que não serve:** a ordem dos objetos na navegação é fixa e a customização é limitada,
com pedido aberto no repositório
([issue #10455](https://github.com/twentyhq/twenty/issues/10455)). Não é modelo para o
ENSPACE, que já tem ordenação e permissão por seção.

---

### 3. ClickUp

[help.clickup.com — What is the Home Sidebar?](https://help.clickup.com/hc/en-us/articles/32057009861271-What-is-the-Home-Sidebar)
· [What is the Spaces Sidebar?](https://help.clickup.com/hc/en-us/articles/32490148963479-What-is-the-Spaces-Sidebar)
· [print](evidencias/ref-clickup-home-sidebar.gif)

**Como resolve, em passos:**

1. Existe uma **Global Navigation** no topo, e a barra lateral **troca de conteúdo** conforme
   o contexto: `Home Sidebar`, `Spaces Sidebar`, `Chat Sidebar`. Não é uma barra com tudo
   dentro; são barras diferentes para trabalhos diferentes.
2. A `Home Sidebar` tem itens fixados no topo (`Inbox` e `Replies` não podem ser
   desafixados) e seções abaixo, incluindo favoritos, que "is only displayed if you have
   favorited at least one item".
3. A `Spaces Sidebar` é só a hierarquia: Spaces, Folders, Lists. Você expande passando o
   mouse.
4. As configurações de cada Space, Folder ou List não viram linha de menu: são um item
   "Access Space settings" no próprio elemento.
5. A barra tem busca própria e permite esconder e reordenar Spaces.

**O que serve:** a ideia central da proposta. **Trocar o conteúdo da barra em vez de
empilhar contextos nela.** E configuração de um elemento acessada a partir do elemento, não
como ramo paralelo do menu.

**O que não serve:** a hierarquia Space › Folder › Subfolder › List tem quatro níveis dentro
da barra. É mais profundo que o ENSPACE tem hoje, e a demanda pede dois.

---

### 4. monday.com

[support.monday.com — Navigating monday's AI work platform](https://support.monday.com/hc/en-us/articles/35276662798098-Navigating-monday-s-AI-work-platform)
· [print](evidencias/ref-monday-left-pane.gif)

**Como resolve, em passos:**

1. O `left pane` é uma trilha estreita de ícones com os destinos principais: `Workspace`,
   `AI Sidekick`, `Vibe`, `AI Agents`, `Notetaker`, `Favorites` e `More`.
2. O que é usado pouco vive atrás de `More`: App Marketplace, Automation Hub, AI Workflows.
3. A pessoa escolhe o que aparece: `More › Customize menu`, com caixa de seleção por item.
   Alguns são fixos e "cannot be removed".
4. Dentro do workspace, o conteúdo (`Assets`, `Recents`, `Collaborators`, `Permissions`,
   pastas e subpastas) aparece no painel do workspace, não na trilha.
5. Administração não está no `left pane`.

**O que serve:** o menu `More` como destino do que é raro, em vez de esconder ou excluir. E
a customização por pessoa, com um núcleo que ninguém pode quebrar.

**O que não serve:** a trilha de ícones. O ENSPACE hoje tem barra com rótulo, e trocar por
ícone sem rótulo quebraria a regra 15 (não trocar a forma que o produto usa) e pioraria a
descoberta que já é o problema.

---

### 5. Pipefy

[help.pipefy.com — Search for specific pipes and databases](https://help.pipefy.com/en/articles/3541073-search-for-specific-pipes-and-databases)
· [print](evidencias/ref-pipefy-busca-favoritos.gif)

**Como resolve, em passos:**

1. A lista de processos **não é o menu**: é a home. O menu do topo tem poucos destinos
   (`Home`, `Portals`, `Requests`).
2. Com muitos processos, o caminho anunciado é a busca: "If your company has several pipes
   or databases in Pipefy, you may use the search bar to quickly find them."
3. Favoritar sobe o processo para o topo da lista, com estrela, e é pessoal: "This option
   won't affect how other users view Pipefy's homepage."
4. A lista tem abas de recorte (`My pipes`, `Other pipes`).

**O que serve:** quando a coleção cresce, a **página dedicada com busca** vira a navegação,
e o menu guarda só os destinos. É a resposta direta para "se eu tiver muitas categorias".

**O que não serve:** o Pipefy praticamente não tem barra lateral, e a lista é plana. O
ENSPACE tem barra e precisa dela, porque as categorias são o trabalho diário e não um
catálogo que se visita.

---

## As três extras

Escolhidas pela linha "Gestão de dados / registros / tabelas" e pela linha "Gestão de
trabalho" da tabela da Fase 3.

### 6. Linear

[Changelog — Personalized sidebar and new settings pages](https://linear.app/changelog/2024-12-18-personalized-sidebar)
· [Docs — Favorites](https://linear.app/docs/favorites)
· [print](evidencias/ref-linear-sidebar-settings.gif)

**A referência mais direta da pesquisa: o Linear resolveu este mesmo problema, e contou
como.**

**Como resolve, em passos:**

1. A barra é personalizável: reordenar, esconder o que se usa pouco e escolher como a
   notificação aparece, "with a count or dot".
2. O pouco usado vai para um menu `More`: "You can also hide items you don't need frequently
   behind a *More* menu."
3. Favoritos é uma seção com **pastas**: "Once you add your first favorite, the *Favorites*
   section appears in your sidebar above *Your Teams*", e dá para criar pasta e arrastar
   favoritos para dentro.
4. As configurações foram **reescritas do zero em páginas próprias**, em quatro seções:
   `Account`, `Features`, `Administration` e `Your teams`.
5. As configurações de um time saíram do menu e viraram uma visão única, alcançada pelo
   `···` ao lado do nome do time na barra.

**O que serve:** quase tudo. A separação entre barra de trabalho e páginas de configuração,
os grupos de configuração por natureza (conta, recurso, administração), o `More` para a
cauda longa, e a configuração de um elemento a partir do elemento.

**O que não serve:** o Linear tem `Teams` como unidade de agrupamento, que o ENSPACE não
tem. O equivalente aqui é a **seção de menu**, que já existe em `Interface › Menus`.

---

### 7. Attio

[attio.com/help — Navigating your workspace](https://attio.com/help/reference/productivity-collaborating/navigating-your-workspace)
· [print](evidencias/ref-attio-sidebar.gif)

**Como resolve, em passos:**

1. A barra tem seções fixas e nomeadas, nesta ordem: painel de controle, busca, navegação
   (`Home`, `Tasks`, `Notes`, `Emails`, `Calls`, `Reports`, `Sequences`, `Workflows`),
   `Favorites`, `Records`, `Lists`, `Chats`.
2. **`Records` é a seção dos objetos** e termina com um item `All objects`, que abre o
   catálogo completo. O print mostra Companies, People, Users, Deals, Workspaces e então
   `All objects`.
3. `Lists`, que é a coleção que mais cresce, tem **ordenação escolhível** pela engrenagem que
   aparece no hover do rótulo da seção: `Most relevant` (por frequência e recência),
   `Recently added`, `Alphabetical` e `Custom`.
4. `Favorites` tem pastas, e é pessoal: "Favorites and folders are personal to you and won't
   appear in other team members' sidebars."
5. As configurações do workspace saem do painel de controle, no topo, não do corpo da barra.

**O que serve:** é o desenho mais parecido com o que o ENSPACE precisa. Três peças entram na
proposta quase inteiras: a **seção de objetos com um `Ver todas` no fim**, a **ordenação da
seção que cresce** (por relevância, por nome, manual) e o **favorito pessoal, que não muda o
menu dos outros**.

**O que não serve:** a distinção `Records` versus `Lists` não tem equivalente no ENSPACE.
Aqui a categoria é uma coisa só.

---

### 8. Airtable

[support.airtable.com — Airtable home screen](https://support.airtable.com/docs/airtable-home-screen)
· [print](evidencias/ref-airtable-home.gif)

**Como resolve, em passos:**

1. A barra lateral da home tem poucos destinos e uma seção `Starred`, com workspaces, bases
   e interfaces marcados com estrela, que se reordena arrastando.
2. `Search` busca workspaces, bases e interfaces, e é apresentada como caminho de primeira
   classe, não como último recurso.
3. Cada workspace tem **página própria**, onde os itens mais críticos são fixados.
4. As configurações do workspace são outra área, com permissão por papel: "Owners can access
   workspace settings from the home screen".
5. Dentro de uma base, as vistas são organizadas em **seções de vista**, incluindo uma
   `My favorites`, e não viram níveis de menu.

**O que serve:** a página por coleção, o `Starred` arrastável e, sobretudo, **vistas como
seções dentro da tela, nunca como nível de navegação**. É o argumento para tirar
"Todos + formulários" do terceiro nível do menu do ENSPACE.

**O que não serve:** o modelo de workspace e base do Airtable é outra coisa. A "base" seria o
workspace do ENSPACE, não a categoria.

---

## O padrão que todos seguem

Oito produtos, e estas seis decisões aparecem em quase todos. Divergir de qualquer uma
precisa de motivo escrito.

| # | O padrão | Quem faz assim |
|---|---|---|
| 1 | **Administração não divide a barra com o trabalho do dia.** Configuração vira área própria, com navegação própria, alcançada por um endereço só. | Notion (rodapé), Linear (páginas próprias em 4 seções), Twenty (`Settings →`), ClickUp (settings no próprio elemento), Airtable (área com permissão), monday (fora do `left pane`), Attio (painel de controle) |
| 2 | **A barra tem no máximo dois níveis.** O terceiro vira aba, vista ou seção dentro da página. | Linear, Twenty, Attio, Airtable, Pipefy. ClickUp e Notion são as exceções, e nos dois a hierarquia é o produto |
| 3 | **Coleção que cresce sem limite não mora inteira na barra.** Mostra-se um recorte e oferece-se um "ver tudo" que leva a uma página com busca. | Notion (`More`), Attio (`All objects`), Airtable (busca e página do workspace), Pipefy (busca na home), Linear e monday (`More`) |
| 4 | **Favoritos é seção de primeira classe, pessoal, e nasce do uso.** Só aparece depois do primeiro favorito. | Notion, ClickUp, Linear, Attio, Airtable, monday, Pipefy. **Sete dos oito** |
| 5 | **Seções nomeadas, recolhíveis, com ordenação.** A seção é a unidade de organização do meio da barra. | Notion, ClickUp, Attio, Linear, monday, Airtable |
| 6 | **Busca é caminho de primeira classe, não último recurso.** Fica no topo, com atalho de teclado, e é o caminho anunciado quando a coleção é grande. | Todos os oito |

## O que nenhum deles faz

Aqui é onde o ENSPACE pode sair melhor, e não apenas igual:

1. **Nenhum deixa o administrador desenhar o menu para os outros e usa a mesma gramática nos
   itens nativos.** O ENSPACE **já tem** isso em `Interface › Menus`: seção com nome, ícone,
   ordem e grupos permitidos. Só que hoje a seção personalizada entra por baixo de um menu
   nativo que ela não pode tocar. Se os itens nativos virarem seções da mesma natureza, o
   administrador passa a montar **um** menu, e não a apendicar o dele no fim do de fábrica.
   É a peça que o ENSPACE tem e os oito não têm.

2. **Nenhum resolve o "duas coisas com o mesmo nome".** Notion, Attio e Twenty escapam por
   sorte, porque a configuração está em outra área. O ENSPACE vai resolver pelo mesmo
   caminho, e de quebra fecha a fricção **S1-F3** sem precisar renomear nada.

3. **Nenhum trata o teto da seção como configuração do workspace.** Notion deixa a pessoa
   escolher quantos itens vê; Attio deixa escolher a ordem. Ninguém deixa o administrador
   dizer "neste workspace, as seis categorias que importam são estas, e as outras vinte
   ficam no ver todas". No ENSPACE, onde quem monta o workspace não é quem usa, isso faz
   diferença.

---

## Trilha de ícones: é tendência de mercado?

**Pergunta da rodada 2, com o print do Jira antigo como referência:** "quando falamos em
menu de 2 níveis, o que pensamos foi naquele tipo de menu que primeiro tem uns grandes
ícones (opções maiores, agregadoras) e dentro um menu específico dali, como é no Jira por
exemplo."

**Resposta curta: o padrão existe e é usado por produtos grandes, mas ele não resolve o
problema desta demanda, e o Jira saiu dele.**

### Quem usa trilha de ícones, e para quê

| Produto | O que a trilha separa |
|---|---|
| **Microsoft Teams** | Chat, Teams, Calendário, Arquivos, apps. Modos de trabalho diferentes, cada um com conteúdo próprio. O admin fixa apps na trilha por política, e a pessoa pode fixar os seus |
| **Slack** | `Home`, `DMs`, `Activity`, `Files`, e `Later` e `Tools` atrás de `More`. Cada aba abre sua própria barra lateral |
| **monday.com** | `Workspace`, `AI Sidekick`, `Vibe`, `AI Agents`, `Notetaker`, `Favorites`, `More`. São produtos diferentes dentro da mesma conta |
| **ClickUp** | A `Global Navigation` troca entre `Home Sidebar`, `Spaces Sidebar` e `Chat Sidebar`. `Home` não pode ser desafixada; `Chat`, `AI Hub`, `Planner` e `App Center` se fixam pelo `More` |
| **Intercom** | Inbox, Tickets, Reports, Settings |

O que os cinco têm em comum: **vários modos de trabalho que convivem**. Conversa e tarefa e
calendário são coisas que a pessoa alterna o dia inteiro, e nenhuma cabe dentro da outra.
A trilha existe para trocar de modo sem perder o lugar no modo anterior.

### Quem não usa, e o que faz no lugar

Notion, Linear, Attio, Airtable, Twenty, Stripe, Asana e Pipefy: **uma barra só**, com
seções nomeadas, favoritos e busca, e a administração fora dela.

### E o Jira, que foi a referência da demanda

O print da demanda é a navegação **antiga** do Jira. Na navegação nova, documentada pela
própria Atlassian em
[What is the new navigation in Jira?](https://support.atlassian.com/jira-software-cloud/docs/what-is-the-new-navigation-in-jira/)
([print](evidencias/ref-jira-nova-navegacao.gif)), **a trilha azul de ícones não existe
mais**. A seção do documento se chama, literalmente, **"Navigation starts from the
sidebar"**, e a legenda numerada da imagem oficial diz:

> 2. Access essentials like **For you**, **Recent**, **Starred**, and **Apps**
> 3. Browse available **Spaces** and expand to navigate within them
> 6. Find **More** navigation items and **Customize sidebar**
> 7. **Search** across all apps on your site, and **Create** work items and requests
> 8. Use **AI Chat** and find utility items like **Notifications**, **Settings** (⚙), and **Account**

Ou seja: uma barra lateral com seções (`Starred`, `Spaces`, `More`), busca e `Create` na
barra de cima, e **`Settings` na barra de cima também**, fora do corpo do menu. É quase item
por item a proposta desta pasta, feita antes de eu ler esse documento.

### Por que a trilha não resolve esta demanda

1. **A trilha separa modos, e o ENSPACE tem um modo só.** Trabalho no ENSPACE é
   olhar e mexer em item de categoria. Tarefa, agenda e spaceflow orbitam isso, não são
   modos paralelos como conversa e calendário. Numa trilha, o ENSPACE teria uma área gorda
   e três magras.
2. **A trilha não tira linha do menu, ela tira da tela.** O problema medido é que 31 linhas
   nativas não cabem em 847 px. A trilha não apaga nenhuma linha: ela esconde as das outras
   áreas atrás de um clique. Ajuda, mas ao custo de a pessoa não ver mais o menu inteiro.
3. **O que resolve é a mesma coisa nos dois modelos:** tirar a administração do caminho e dar
   teto à lista que cresce. Isso já é o que a proposta faz, e é o que o Jira novo faz.
4. **Custo de aprendizado.** Trocar barra com rótulo por ícone sem rótulo piora a descoberta,
   que é exatamente a queixa do cliente ("todo mundo se confunde").

### O que foi feito com isso

O modelo de trilha foi **construído assim mesmo**, como alternativa visível no protótipo
(alternador `Modelo` na barra de andaime), com cinco áreas de conteúdo real: `Trabalho`,
`Dados`, `Seções`, `Configurações` e `Ajuda`. Não é espantalho: é a versão mais forte da
ideia, para a comparação acontecer olhando, e não discutindo.

A recomendação, sustentada pelo que está acima, continua sendo a **barra única**.

---

## Sobre HubSpot e Asana

A demanda citou os dois. Nenhum entrou como referência formal porque a documentação pública
não descreve a estrutura da navegação com precisão suficiente para virar entrada de
pesquisa, e a spec pede "descrito em passos, não em adjetivo". O que ambos fazem, e que já
está coberto pelos padrões 1 e 3 acima, é manter a administração em área separada (o
`⚙ Settings` do HubSpot é outra navegação inteira) e favoritar o que é usado com frequência
(`Starred` do Asana).

## Rodada 14: botão direito, arrastar e recolher no ClickUp

Pedido dela: "pesquise como o clickup trabalha com isso pra ter inspiração". A pergunta tem três
partes: o que se reordena, o que se recolhe e o que se personaliza. Fonte: a central de ajuda
oficial do ClickUp (versão 4.0). **Não foi possível usar o ClickUp logado:** esta sessão roda
num contêiner na nuvem, sem o Chrome dela, e entrar pelo navegador do contêiner exigiria digitar
senha, o que a regra 2 proíbe. A conferência na mão fica para uma sessão no app de desktop.

### O botão direito

- Botão direito em Space, Folder e List abre o **mesmo menu** que o `…` ao lado do nome. As
  duas portas levam ao mesmo lugar
  ([Space, Folder, and List settings](https://help.clickup.com/hc/en-us/articles/33777837994775-Space-Folder-and-List-settings)).
- O conteúdo muda com o nível e com a permissão, **a ordem dos blocos não**:
  - **Space:** Favorite, Rename, Copy link, Hide Space, Archive;
  - **Folder:** Favorite, Rename, Copy link, Move, Archive;
  - **List:** Favorite, Rename, Copy link, Email to List, Move, Archive.
- `Hide Space` tira o Space da barra **sem tirar o acesso**. A volta é `Show all Spaces`, no `…`
  da seção Spaces ([Hide or reorder Spaces](https://help.clickup.com/hc/en-us/articles/6309404591895-Hide-or-reorder-Spaces)).
- O que falta lá, e os usuários pedem: "Open in new window/tab" no botão direito
  ([pedido público](https://feedback.clickup.com/feature-requests/p/add-open-in-new-window-tab-to-sidebar-right-click-menu)).

### O que se reordena e o que não

- **Spaces:** arrastando, na Home Sidebar ou na Spaces Sidebar.
- **Seções da Home Sidebar:** arrastando na própria barra, ou num modal `Reorder sections`. As
  seções padrão **se reordenam mas não se escondem**
  ([Create custom Home Sidebar sections](https://help.clickup.com/hc/en-us/articles/32855333466903-Create-and-reorder-custom-Home-Sidebar-sections)).
- **Global Navigation (a trilha):** não se arrasta. Se liga e desliga por caixa de seleção em
  `More > Customize navigation`, e **Home é o único item que não se mexe**. Arrastar ali é pedido
  aberto ([Customize & reorder global nav](https://feedback.clickup.com/feature-requests/p/customize-reorder-home-sidebar-global-nav-menus)).

### O que se personaliza 100%

- **Seções próprias na Home Sidebar**, com nome livre, criadas pelo `+` da barra ou pelo `…` de
  uma seção, e dentro delas Spaces, Lists, Docs e o que mais a pessoa puser. É o equivalente da
  "seção do workspace" que o ENSPACE já tem em Interface > Menus.

### Recolher e expandir

- `Ctrl + \` (ou `Cmd + \`) mostra e esconde a barra
  ([Use keyboard shortcuts](https://help.clickup.com/hc/en-us/articles/6309030550167)).
- Recolhida, a barra volta pelo **ícone de expandir no alto da Global Navigation**
  ([Default Home Sidebar sections](https://help.clickup.com/hc/en-us/articles/32854720651543-Default-Home-Sidebar-sections-and-settings)).
- A barra também abre sozinha quando o mouse passa na borda, e esse é um pedido público **contra**
  o comportamento: "Personal Setting to Disable Sidebar Expand on Hover"
  ([pedido](https://feedback.clickup.com/feature-requests/p/disable-sidebar-hover-to-show-action)).

### O que serve, e o que não serve

| ClickUp | No ENSPACE | Por quê |
|---|---|---|
| Botão direito = menu do `…`, mesmos blocos em todo nível | **Serve.** Três blocos fixos: ir, arrumar, mexer | Quem aprende num lugar acha no outro |
| `Hide` com `Show all` para voltar | **Serve.** "Ocultar do menu" e "Itens ocultos" no pé | É a resposta direta a "o menu é muito cheio" |
| Home não se esconde; seções padrão não se escondem | **Serve.** Início e Categorias não se ocultam | Sem Início não há para onde voltar |
| Global Navigation não se arrasta | **Em parte.** Na trilha, Trabalho, Dados e Configurações ficam; as seções do workspace se arrastam | Ela pediu arraste na trilha, e as seções são do workspace |
| "Open in new tab" ausente | **O ENSPACE faz.** "Abrir em nova aba" no primeiro bloco | É o pedido dos próprios usuários de lá |
| `Ctrl + \` e ícone de expandir no alto | **Serve**, igual | Atalho que quem vem do ClickUp já tem na mão |
| Abrir sozinha no hover da borda | **Não serve** | É o comportamento que os usuários de lá pedem para desligar |
| `Archive` no botão direito | **Não entra** | Arquivar categoria e seção é decisão de configuração, não de navegação |

## Rodada 15: o ClickUp por dentro, nos prints da Mikaela

Ela usou o ClickUp logado e mandou 21 prints com a explicação. Isto **corrige** a seção da
rodada 14, que tinha saído da central de ajuda. Os prints não entraram no repositório: têm
e-mail de pessoa e o nome dela (regra 13).

| O que | Como o ClickUp faz |
|---|---|
| Trilha (Global Navigation) | Não se reordena e não se arrasta. Personalizar > Navegação liga e desliga cada item, com Início travado, e escolhe "Somente ícones" ou "Ícones e rótulos" |
| "Mais" na trilha | Aparece por padrão e guarda o que não está fixado. Alfinete no hover fixa; sem espaço, o novo toma o lugar do último, que vai para "Mais". No pé, "Personalizar navegação" |
| Hover na trilha | Passar o mouse num ícone que não é o aberto mostra o menu dele em popover. O menu aberto continua no fundo |
| Recolhido | A trilha fica só; o primeiro ícone vira "»", que reabre. O popover do hover continua valendo |
| Início | Clicar abre a página inicial e o menu Início. É o único menu com "Personalizar a barra lateral" |
| Itens nativos do Início | Ordem fixa. Personalizar > Início escolhe quais aparecem (dois travados). Os outros ficam em "⋯ Mais", com alfinete e atalho para Personalizar |
| Seções do Início | Se reordenam arrastando no próprio menu ou em Personalizar > Seções. Só "Chats com IA" se oculta. Clicar no nome recolhe e expande |
| Criar seção | Janela com ícone e nome. A seção nova entra no topo |
| "+" da seção | Busca o que já existe para pôr na seção, com "+" no pé para criar. Seção vazia mostra "+ Adicionar à seção" |
| "…" da seção | Ícone e nome editáveis no topo, marcar como lido, adicionar à seção, mostrar e ordenar (recentes, alfabética, personalizado), criar seção, reordenar seções, excluir |
| Itens de uma seção | Se arrastam dentro dela. O "…" do item abre: marcar como não lido, copiar link, favorito, renomear, excluir, notificações, compartilhamento |
| Hierarquia | Uma seção pode ter um item com filhos (Espaço > Pasta > Lista), que abre e fecha |
| Botão de Personalizar | No pé do menu Início até o primeiro uso; depois some de lá e fica no cabeçalho |
| Temas | Claro, escuro, automático, e uma cor de tema entre dez |

## Rodada 18: a Central de modelos do ClickUp, e "Usar" contra "Adicionar"

Ela mandou 9 prints da Central de modelos do ClickUp. O que eles mostram:

- **Lista:** à esquerda, Destaques, Modelos do espaço de trabalho e Modelos da ClickUp, com
  contagem; filtros de **Tipos de modelo** (Super Agent, Skill, Espaço, Pasta, Lista, Tarefa,
  Documento, Visualização, Quadro Branco) e **Complexidade** (Intermediário, Avançado,
  Iniciante). Em cima, a busca e três filtros em botão: **Casos de uso** (lista com busca,
  "Selecionar tudo" e várias marcadas ao mesmo tempo, com o número de marcadas no botão),
  Etiquetas e Criado por. Faixa "Crie seu primeiro modelo". Cartões com print, agrupados por
  área, com "Ver mais N".
- **Detalhe:** Voltar, ícone, nome, "…" ao lado do nome, Complexidade, **Usar modelo**; galeria
  com setas e pontos, que amplia em tela cheia com zoom e download; descrição; "Modelo inclui"
  (grupos de status, campos personalizados, tipos de visualização), cada um abrindo os itens; à
  direita, "Pela ClickUp" (Verificado), data de criação e quantas vezes foi usado.
- **"…" do detalhe:** "Adicionar ao espaço de trabalho: adicione este modelo ao seu espaço de
  trabalho para fazer alterações". Depois disso o modelo aparece em "Modelos baseados em seu
  espaço de trabalho", e o menu dela **não mudou**.

**A diferença entre os dois botões**, que ela pediu para investigar. A central de ajuda do
ClickUp não compara os dois lado a lado, mas os dois artigos dizem o bastante:

- "Add a template to your library" (help.clickup.com/hc/en-us/articles/6326023965591): adicionar
  guarda uma cópia na **biblioteca** do workspace, para achar de novo, renomear, descrever,
  compartilhar e ajustar. O original continua na Central.
- "Use Folder templates" (help.clickup.com/hc/en-us/articles/6308752167319): **usar** aplica,
  depois de deixar escolher nome, lugar e o que vem junto.

Ou seja: **adicionar é guardar, usar é aplicar.** O menu dela não mudou porque ela guardou.

### No ENSPACE

| ClickUp | ENSPACE | Por quê |
|---|---|---|
| Modelo | **Caso de uso** | É o nome que o produto já usa (Configurações > Interface > Casos de Uso) |
| Filtro "Casos de uso" | Filtro **Áreas** (Jurídico, Comercial, Financeiro…) | Aqui "caso de uso" já é a coisa; o filtro é pela área de negócio, com o mesmo desenho |
| Tipos de modelo | Workspace completo, Menu, Categoria, Tela | São os pacotes que o arquivo de exportação do ENSPACE carrega |
| "Modelo inclui": status, campos, visualizações | Menus e telas, Categorias e campos, Status | É o que um caso de uso do ENSPACE traz |
| Usar modelo | **Usar caso de uso**, com somar ou substituir antes | Ela pediu a escolha no Importar; aplicar um caso é a mesma operação |
| Adicionar ao espaço de trabalho | **Adicionar ao workspace**, dizendo na própria opção que o menu não muda | É justamente o que confundiu ela no ClickUp |
| Importar (pé do "+") | Importar caso de uso de outro workspace, com área de arraste e prévia | É a tela do protótipo `migracao-de-workspace`, trazida para perto do menu |
| Etiquetas, Criado por | Não entram | O caso de uso do ENSPACE não tem etiqueta nem autoria hoje |
| Print do modelo | Miniatura desenhada com o conteúdo do caso | Sem prints de telas que ainda não existem (`COMPONENTES-CUSTOM.md`) |

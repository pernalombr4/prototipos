# Pesquisa: Home

- O mercado divide a Home em 3 funções: criar algo, acompanhar o próprio trabalho e ir a um lugar.
- 8 dos 10 produtos mostram uma lista de tarefas por prazo com ação no lugar; 5 têm um botão de criar global no topo ou no menu lateral.
- A Home montável (QuickBooks, Asana, ClickUp, HubSpot) só agrada quando o widget escolhe de onde vem o dado: no ClickUp, os pedidos por filtro e por "Dashboard as Home" somam 681 votos abertos.
- O padrão pesa mais que o editor: Salesforce, HubSpot, Notion, monday e Twenty deixam o admin definir a entrada, e menos de 5% das pessoas mudam um padrão (Spool, 2011).
- O ENSPACE deve ter uma Home em grade de widgets, com o padrão do admin e a cópia de cada membro, um botão Criar no topo do menu lateral e widgets que carregam, falham e ficam vazios sozinhos.

## Como a pesquisa foi feita

- **Data:** 2026-11-11.
- **6 frentes de pesquisa de mesa em paralelo, só com fonte pública:**
  1. QuickBooks Online;
  2. HubSpot;
  3. monday.com;
  4. ClickUp;
  5. Notion, Twenty CRM e Pipefy;
  6. Asana, Salesforce Lightning, Jira/Atlassian e boas práticas de UX (NN/g, W3C, PatternFly, SAP, Salt).
- **Fontes por tipo:**
  - central de ajuda: monday e ClickUp devolvem 403 ao HTML, e os artigos saíram pela API pública do Zendesk (`/api/v2/help_center/en-us/articles/<id>.json`), que traz o mesmo corpo e a data de atualização;
  - fórum e quadro de pedidos: Intuit Community, HubSpot Ideas, quadro de feedback do ClickUp (votos lidos do campo `score`), comunidade do monday (pelo trecho do buscador, porque os tópicos dão 404), fórum do Asana;
  - changelog: notas do Notion, releases do Twenty no GitHub, atualizações mensais do Pipefy;
  - código: o Twenty é open source, e a página de entrada foi lida no repositório `twentyhq/twenty`, branch main.
- **Nenhuma conta foi criada.** A demanda autorizava, mas este agente não pode criar conta. Tudo veio de página pública, sem login.
- **Nenhum print dos concorrentes foi capturado.** Cada referência traz a URL da imagem publicada na central de ajuda do próprio produto; as imagens não foram abertas uma a uma, e a legenda vem do texto do artigo.
- **Sem entrevista, sem chamado, sem analytics.** A fala dos usuários do ENSPACE chegou pela redatora ("muito dura", "poucos atalhos", "feia, pouco flexível"); não há volume nem segmento. É a primeira lacuna desta pesquisa.
- **O ENSPACE de hoje** está no `BRIEFING.md`, investigado no develop pela tela em 2026-11-11.

## Referências

### Notion

**Como resolve**
1. Ao entrar, a pessoa vê a barra lateral em abas: Home, "Chats with Notion AI" e Meetings. Desde a 3.4 (2026-03-26), a Home é uma aba da barra, e não uma página inteira.
2. A aba Home empilha seções: Upcoming events, Recents, Favorites, Agents, Teamspaces, Shared pages, Private pages e Notion apps. No pé ficam "My Tasks", Library, Marketplace, Help e Trash.
3. Para personalizar, o menu `•••` de cada seção oferece "Show" (quantos itens), "Move up", "Move down", "Hide section" e "Customize sidebar". O mesmo menu acrescenta uma seção com visão de banco de dados e reseta a aba.
4. "Add view to sidebar" fixa uma visão de banco com os filtros e a ordenação dela. Limites: 3 visões, 25 atalhos e 25 seções por aba, até 6 abas.
5. O admin publica presets de aba; a pessoa adota um preset em "Add tab" e volta ao original em "Reset tab". Esconder um item muda só a barra da própria pessoa.
6. Para criar, há um menu ao lado do Inbox e um botão 📝 em cada aba. Os atalhos "New page", "New database" e "New agent" entram e saem da aba. Ctrl/Cmd+K abre a busca.
7. A Home de widgets de 2024 (versão 2.40) deixou de existir: as visões dela viraram uma página em Private, e quem abria na Home passou a abrir em "Last Visited".

**Fonte**
- [Notion Help, Navigate with the sidebar](https://www.notion.com/en-gb/help/home-and-my-tasks)
- [Notion Help, Customize your sidebar](https://www.notion.com/help/customize-your-sidebar)
- [Notion 3.4, 2026-03-26](https://www.notion.com/pt-br/releases/2026-03-26)
- [Notion 2.40, 2024-06-11](https://www.notion.com/releases/2024-06-11)
- Imagens: [menu de seção](https://images.ctfassets.net/spoqsaf9291f/2tpJheiXLOwBH9ZdZGnQt3/514bd06e33972f166580fa5c50bcdbdf/Group_61.png?w=3840&q=55&fm=webp); [barra lateral nova, GIF](https://images.ctfassets.net/spoqsaf9291f/6R8KIHTn55Om9GLLDHb5Id/2d8faff81a9759c0437e47aceffe3807/Sidebar_FINAL.gif)

**Serve ao ENSPACE**
- Seção que é visão salva, com filtro e ordenação próprios: é o widget "Itens de uma visualização" que o ENSPACE precisa para quem trabalha com itens.
- "Show" (quantos itens) por seção: controla a altura sem depender de redimensionar.
- Preset do admin com "Reset tab": é o par padrão do admin e volta ao padrão, em 2 gestos.

**Não serve**
- A Home dentro da barra lateral: o menu do ENSPACE já tem a seção de Configurações inteira, e uma Home ali disputaria espaço com ela.
- A lista vertical sem número, sem gráfico e sem prazo agrupado não responde a "o que preciso fazer hoje".

### Twenty CRM

**Como resolve**
1. No computador, não há Home. O código leva a pessoa ao 1º item do menu do workspace (`getFirstNavigationMenuItemLink.ts`), que pode ser uma lista de objeto ou um dashboard. Sem item válido, abre a lista do 1º objeto em ordem alfabética.
2. Quem tem a permissão Layouts define essa ordem para todos: passa o mouse em Workspace, clica na chave inglesa, arrasta e salva. Favoritos ficam no topo da barra e são pessoais.
3. O dashboard tem abas e widgets (gráfico, número, iFrame). No modo de edição, o widget se arrasta e se redimensiona, e a configuração abre num painel à direita. "Duplicate dashboard" fica no Ctrl/Cmd+K.
4. Todo dashboard é visível a todo o workspace: não existe dashboard privado. Filtro no nível do dashboard está como "coming soon".
5. Para criar, Ctrl/Cmd+K abre o menu de comandos, que cria registros e visões e importa CSV. Não achei um "+" global; a criação mora no botão da lista de cada objeto.
6. No 1º uso, a página e o cartão Getting Started (2026-11-02) listam passos com estado feito e "snooze until tomorrow".
7. No celular existe uma Home (`MobileHomePage`): navegação, Getting Started e chat de IA para quem tem a permissão.

**Fonte**
- [useDefaultHomePagePath.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/navigation/hooks/useDefaultHomePagePath.ts)
- [Twenty, Navigation](https://docs.twenty.com/user-guide/layout/capabilities/navigation.md)
- [Twenty, Dashboards](https://docs.twenty.com/user-guide/dashboards/capabilities/dashboards.md)
- [Issue #20815, dashboard como página de entrada](https://github.com/twentyhq/twenty/issues/20815)
- Imagens: [layout principal](https://mintcdn.com/twenty/nHykqzejUXmkEL88/images/user-guide/home/main-layout.png?fit=max&auto=format&n=nHykqzejUXmkEL88&q=85&s=6d60a2b584df62b14753d0eab33a9d5f); [abas do dashboard](https://mintcdn.com/twenty/rtjyQTAh0DrLn5Sz/images/user-guide/dashboard/dashboard-tabs.png)

**Serve ao ENSPACE**
- Ctrl/Cmd+K que cria registro: é o passo seguinte para o "Buscar..." do ENSPACE, que hoje responde "No matching data" a "criar".
- Getting Started com passo feito e adiar até amanhã: serve de estado de 1º uso para workspace novo.
- A issue #20815 pede um dashboard "Today" com tarefas atribuídas e reuniões como "the workspace member's daily homepage": a mesma demanda do ENSPACE.

**Não serve**
- Tudo público e sem cópia pessoal: um membro não arruma a própria tela sem mudar a de todos.
- Entrada implícita pela ordem do menu: a issue #21166 registra que a raiz levava a um objeto "Activities" só pela ordem alfabética.

### ClickUp

**Como resolve**
1. No 4.0 (o 3.0 saiu do ar em 2026-03-27), "Home" é o 1º ícone da navegação global e abre a Home Sidebar: Inbox, Replies, páginas fixadas, Favorites, Spaces e Recents.
2. A Home antiga de cards virou a página My Tasks: Home > My Tasks. As subpáginas Assigned to me, Today & Overdue e Personal List são fixas.
3. Na página My Tasks, "Manage cards" abre o catálogo com 9 cards: AI StandUp, Recents, Agenda, LineUp, Assigned to me, Reminders, Assigned comments, My Work e Personal List. "Add to Overview" liga; "Added" desliga.
4. A disposição acontece direto na tela, sem modo de edição: a alça à esquerda do título move; a borda redimensiona. Cabe 1 card de cada tipo, e um usuário relata só 2 larguras (50% e 100%).
5. O card My Work tem as abas To Do, Done e Delegated. To Do agrupa em Today, Overdue, Next e Unscheduled. Ao passar o mouse: concluir, mudar data, prioridade e responsável. O "+" de cada grupo cria a tarefa com o vencimento já preenchido.
6. Só a pessoa define a Home. Nenhum artigo cita padrão do admin.
7. Para criar, há o "+" no topo da Home Sidebar (16 tipos), o "+ New" na barra do topo, um "+" ao passar o mouse em cada local, o Ctrl/Cmd+K com "create" e as teclas T e R, que vêm desligadas. O destino padrão é a Personal List. Depois de criar, um aviso oferece abrir e copiar o link.
8. O Dashboard é outra tela: cerca de 70 cards, modo de edição, Auto Layout, desfazer até 5 mudanças e atualização a cada 30 min.

**Fonte**
- [My Tasks page (formerly Home)](https://help.clickup.com/hc/en-us/articles/18944788880791-My-Tasks-page-formerly-Home)
- [Use the My Work card](https://help.clickup.com/hc/en-us/articles/18947060934423-Use-the-My-Work-card)
- [Create items](https://help.clickup.com/hc/en-us/articles/6309854442391-Create-items)
- [Dashboard as Home / Homescreen, quadro de feedback](https://feedback.clickup.com/feature-requests/p/dashboard-as-home-homescreen)
- Imagens: [página My Tasks](https://help.clickup.com/hc/article_attachments/42699553943959); [card My Work](https://help.clickup.com/hc/article_attachments/19065165081111)

**Serve ao ENSPACE**
- O "+" por grupo de prazo, que preenche o vencimento: encurta "criar tarefa para hoje" a 1 clique e 1 campo.
- Os 4 grupos por prazo e a conclusão no hover: modelo direto para o widget Minhas tarefas.
- O aviso pós-criação com "abrir" e "copiar link": responde "onde foi parar o que criei".
- Hora da última leitura e botão de atualizar por card, e desfazer da disposição.

**Não serve**
- Home sem as ferramentas do Dashboard: o card da Home não filtra por local nem por campo, e é disso que os usuários reclamam.
- 1 card de cada tipo: impede 2 widgets de itens de categorias diferentes.
- Esconder a lista diária atrás de 1 clique a mais (Home > My Tasks).
- Teclas de atalho desligadas por padrão: quem não liga nunca descobre.

### monday.com

**Como resolve**
1. Ao entrar, abre a última workspace visitada. No layout de IA (artigo de 2026-09-23), o menu lateral é o ponto de partida: Workspace, AI Sidekick, Vibe, AI Agents, Notetaker, Favorites e More.
2. Não existe Home de widgets que a pessoa monte. Ela personaliza o menu em More > Customize menu, com caixas de marcar.
3. My Work, agora dentro de More, junta os itens atribuídos à pessoa em 6 faixas com contagem: Past dates, Today, This week, Next Week, Later e Without a date. Agrupa também por status, prioridade ou quadro, e "Hide done items" esconde o concluído.
4. "New item" no My Work pede o nome, o quadro, o grupo e a data. Limites: 50 quadros ou 1.000 itens, e só item mexido nos últimos 4 meses.
5. O admin escolhe a "Account home page" em Administration > General > Account: a Home padrão ou um app do monday vibe.
6. A grade de widgets mora no Dashboard: conectar quadros, catálogo de 30+ widgets, alternador Edit/View, só o dono move. Até 30 widgets; de 1 a 50 quadros conforme o plano.
7. Para criar, há o "+" da workspace (quadro, dashboard, doc) e o "New item" do My Work. Ctrl+B abre a Quick Search. A lista de atalhos não tem criar item global.

**Fonte**
- [Navigating monday's AI work platform](https://support.monday.com/hc/en-us/articles/35276662798098-Navigating-monday-s-AI-work-platform)
- [My Work](https://support.monday.com/hc/en-us/articles/360019300579)
- [Configure your Dashboard](https://support.monday.com/hc/en-us/articles/26233702292114-Configure-your-Dashboard)
- [monday vibe: best practices](https://support.monday.com/hc/en-us/articles/34101891654034-monday-vibe-best-practices-features-and-capabilities)
- Imagens: [faixas de data do My Work, GIF](https://support.monday.com/hc/article_attachments/31864074056594); [modo Edit do dashboard, GIF](https://support.monday.com/hc/article_attachments/26240419330066)

**Serve ao ENSPACE**
- Faixas de prazo com contagem e "Hide done items".
- "New item" com escolha de destino: no ENSPACE, categoria e etapa.
- Admin define a entrada da conta: confirma o padrão do workspace.
- "All at once" para a mesma coluna em vários quadros: referência para um widget que lê várias categorias.

**Não serve**
- Eliminar a Home e mandar a pessoa à última workspace: ela fica sem uma tela do dia.
- My Work dentro de More: gerou reclamação em 2026-06-10.
- Widgets lúdicos (Llama Farm, Quote of the Day): enfeitam e não servem a processo.
- Faixas fixas: a comunidade pede "This month" e "Without a date" no topo.

### Pipefy

**Como resolve**
1. Ao entrar, a pessoa vê a página inicial da empresa: a lista de pipes e bancos de dados, com busca no cabeçalho.
2. A única personalização é a estrela: o pipe favorito sobe ao topo, sem mudar a página dos outros.
3. "My work", no canto superior direito, lista os cards atribuídos em Near due date, Overdue, Late (passou do SLA da fase), Expired (passou do SLA do pipe) e Done. Colunas: título, vencimento, pipe, fase e criação.
4. O convidado vê "Tasks & Requests" (Pending e Done); o solicitante externo usa o Portal.
5. Para criar, o "+" dentro do pipe abre o formulário inicial (Start Form). Da página inicial se cria um pipe do zero ou pela Template Gallery. Não confirmei abrir o Start Form de um pipe sem entrar nele.
6. A IA fica no cabeçalho do pipe (AI Agents), não na página inicial.

**Fonte**
- [Getting started](https://help.pipefy.com/en/articles/2584689-getting-started)
- [Pipe filter](https://help.pipefy.com/en/articles/3541073-pipe-filter)
- [How to find all cards assigned to you](https://help.pipefy.com/en/articles/1602018-how-to-find-all-cards-assigned-to-you)
- [A new header experience is here, 2025-09-11](https://community.pipefy.com/product-updates/a-new-header-experience-is-here-4746)
- Imagens: [página inicial com o cabeçalho novo](https://uploads-us-west-2.insided.com/pipefy-en/attachment/c35a2e58-cac1-4c82-a326-01540fcdc6eb.png); [estado vazio com template](https://uploads-us-west-2.insided.com/pipefy-en/attachment/ecb1fcee-0f1e-44fe-b977-0842bf413f66.png)

**Serve ao ENSPACE**
- SLA estourado como faixa própria: o ENSPACE tem SLA nas tarefas programadas, e o widget Minhas tarefas pode separar "fora do SLA" de "em atraso".
- O Start Form é o formulário da categoria: a criação pela Home deve abrir o mesmo formulário que a categoria usa.
- Página diferente por público (membro, convidado, portal).

**Não serve**
- Página inicial que é só índice de processos, sem blocos: é a Home dura de hoje com outro conteúdo.
- Tarefas fora da página inicial e criação só dentro do pipe: 2 passos a mais para o dia a dia.

### QuickBooks Online

**Como resolve**
1. Ao entrar (nova experiência, obrigatória nos EUA desde 2025-10-01), a pessoa vê 4 blocos: carrossel de apps, Create actions, barra de chat do Intuit Intelligence e "Business at a glance" (widgets). O Business Feed de IA fica junto.
2. Os widgets atuais são Sales & Get Paid Funnel, Bank Accounts, Profit & Loss, Expenses, Cash Flow e Needs Attention. Cada um tem o próprio período; alguns não redimensionam.
3. Para personalizar: "Customize" no alto à direita, depois "Add or remove widgets" (caixas de marcar) ou arrastar e esticar na própria tela, e "Save". A versão de 2024 mostrava a alça de cada ação: quadrado de mover, bolinhas de esticar e lixeira.
4. Cada pessoa tem a sua. O catálogo segue o direito de acesso: o usuário limitado vê menos widgets. Nenhuma fonte cita "Restore default".
5. Para criar, as Create actions da Home mostram até 10 atalhos que a pessoa escolhe em "Show all"; sem escolha, o QuickBooks ordena pelo uso. O "+ Create" no menu lateral cria transação, projeto, tarefa, meta e cliente. Bookmarks ficam no menu, e há mais de 50 atalhos de teclado.
6. Em 2026, a Intuit simplificou a Home padrão porque ela "tentava fazer coisa demais".

**Fonte**
- [Customize your Home page](https://quickbooks.intuit.com/learn-support/en-us/help-article/product-setup/customize-home-page-quickbooks-online/L0ryPsyjD_US_en_US)
- [Understand the menu](https://quickbooks.intuit.com/learn-support/en-us/help-article/bookkeeping-processes/understand-navigation-menu-quickbooks-online/L310NeoHY_US_en_US)
- [Firm of the Future, 2026-08-20](https://www.firmofthefuture.com/product-update/customizations-supercharge-quickbooks/)
- [QuickBooks UK, What's improved in 2026](https://quickbooks.intuit.com/uk/blog/quickbooks-online-whats-new-2026/)
- Imagens: [Home atual](https://www.firmofthefuture.com/oidam/intuit/sbseg/en_us/Blog/stock-photos/homepage-dashboard-qbo-us-en.jpg); [mover widget, GIF de 2024](https://ahf.tlq.mybluehost.me/wp-content/uploads/2024/01/Home-CustomizingLayout-MovingWidgets_QBO-1.gif)

**Serve ao ENSPACE**
- Create actions com até 10 atalhos, ordem pelo uso e escolha manual que vence o automático: é o widget Criar rápido.
- 2 caminhos para o mesmo fim: a lista de marcar (descobrir o que existe) e o arrasto (arrumar).
- Período por widget.
- O catálogo que segue a permissão: o widget some para quem não lê o dado, sem configuração.

**Não serve**
- O Business Feed que não fecha, só adia por 2 semanas, e os anúncios na Home.
- Tirar os widgets Tasks e Reminders na migração.
- Migração imposta sem volta nem cópia da configuração antiga.
- Catálogo só financeiro, com 6 a 10 widgets.

### HubSpot

**Como resolve**
1. Ao entrar, a pessoa vê a página que escolheu em Profile & Preferences > Defaults. O admin define a página por grupo com Presets (Professional e Enterprise), e a escolha da pessoa vence o preset.
2. Na Home nova (beta, ligada pelo Super Admin, KB de 2026-09-11), a área principal mostra "Prepare for high-value meetings today" (Join, Prep) e "Follow up with active contacts" (Reply). À direita, "Your day at a glance" tem as abas Meetings, Tasks, Deals, Metrics, Activities, Campaigns e Tickets, cada uma com filtro.
3. Para personalizar a Home nova: "Customize Home" abre as abas About you (texto livre), Daily brief (liga e desliga feeds) e Side panel (ordena e esconde abas), e "Save". Não há posição nem tamanho livre.
4. A Home legada tinha 8 widgets fixos. O widget Tasks concluía em 1 clique (Mark complete) e mostrava New Task quando vazio.
5. No Customer success workspace, o admin monta o padrão pela biblioteca (Manage cards, "+ Add card", Create card). O cartão que ele adiciona chega ao Summary de cada pessoa. A pessoa reordena e redimensiona a própria cópia, e o padrão não muda.
6. Para criar, há o "+ Quick Create" no topo (contact, company, deal, ticket, task) e Bookmarks no menu, até 10. Ctrl/Cmd+K busca e mostra ações no resultado (Call, Email, Add note). Não há paleta de comandos.

**Fonte**
- [Use your home page](https://knowledge.hubspot.com/help-and-resources/use-your-home-page)
- [Manage user preferences with presets](https://knowledge.hubspot.com/user-management/manage-user-preferences-with-user-groups)
- [Customize the summary tab in the customer success workspace](https://knowledge.hubspot.com/customer-success/customize-the-summary-tab-in-the-customer-success-workspace)
- [A guide to HubSpot's navigation](https://knowledge.hubspot.com/help-and-resources/a-guide-to-hubspots-navigation)
- Imagens: [diálogo Customize Home](https://knowledge.hubspot.com/hs-fs/hubfs/Knowledge_Base_2023-24-25/KB-navigation/navigation-customize-home.png?width=500&height=446&name=navigation-customize-home.png); [reordenar e redimensionar no Customer success, GIF](https://knowledge.hubspot.com/hs-fs/hubfs/Knowledge_Base_2023-24-25/KB-customer-success/customer-success-reorder-resize-summary.gif?width=463&height=297&name=customer-success-reorder-resize-summary.gif)

**Serve ao ENSPACE**
- O modelo do Customer success: padrão do admin, cópia pessoal e cartão novo que chega a todos. É a hipótese (b) inteira.
- O cartão vazio que oferece o botão de criar (New Task, New meeting).
- Remover o relatório do dashboard sem apagar o relatório: o widget é uma referência à visualização.
- Filtro de sessão, que não muda a tela dos outros.

**Não serve**
- O "+ Quick Create" com 5 objetos fixos: no ENSPACE, as categorias são do cliente.
- A frase de IA que muda de texto com os mesmos dados.
- O redesenho imposto: 10 de 14 respostas negativas no anúncio.
- 3 camadas de página inicial (Home, dashboard padrão, view do workspace), cada uma com o próprio "definir como padrão".

### Asana

**Como resolve**
1. A Home é a 1ª tela ao abrir o Asana; o ícone de casa no topo do menu volta a ela.
2. Os widgets citados são Projects, People, My Priorities (My tasks), Private notepad, My Goals (Business e Enterprise), estatística de conclusão, status updates, tarefas que a pessoa atribuiu a outros, rascunhos de comentário e atalhos para projetos, tarefas e formulários.
3. Para personalizar, "Customize" no alto à direita abre a janela Customizations. A pessoa arrasta o widget da lista para a Home, reordena arrastando, tira, redimensiona e troca o fundo.
4. Só a pessoa define: 1 layout por pessoa, sincronizado entre dispositivos, em todos os planos.
5. Em 2026-05-06, um pedido no fórum quer várias Homes alternáveis ("there's one Home layout, and it has to serve every situation"); o Asana não respondeu.

**Fonte**
- [Asana Help, How to customize your home page](https://help.asana.com/s/article/how-to-customize-your-home-page)
- [Asana, página de produto Home](https://asana.com/features/project-management/home)
- [MakeUseOf, 2022](https://www.makeuseof.com/how-to-customize-asana-home/)
- [Fórum Asana, Multiple Home views, 2026-05-06](https://forum.asana.com/t/home-tab-multiple-home-views-switchable-layouts/1139862.md)
- Imagens: as notas não trazem URL de imagem; o artigo de ajuda explica a personalização em vídeo.

**Serve ao ENSPACE**
- Private notepad: confirma o Bloco de notas no catálogo.
- Tarefas que a pessoa atribuiu a outros: confirma o widget Tarefas que delegei.
- Atalho para formulários usados com frequência.

**Não serve**
- A Home só pessoal, sem padrão do admin.
- 1 layout para todo contexto: limite que o próprio fórum aponta.
- A lista de widgets mistura página de produto atual e artigo de 2022.

### Salesforce Lightning

**Como resolve**
1. O admin monta a Home no Lightning App Builder: a partir de um modelo, clonando outra Home ou pelo "Edit Page" da aba Home.
2. Ele arrasta componentes para as regiões do modelo: Assistant, Performance, Today's Events, Today's Tasks, Key Deals, list view, Recent Items, Report Chart e Rich Text (até 4.000 caracteres).
3. A página só aparece depois de ativada. A ativação tem 3 níveis: padrão da org, padrão do app ou combinação de app e perfil, que vence as outras.
4. "Set Component Visibility" mostra o componente só quando todos os filtros são verdadeiros.
5. "Edit Page" sobre a página padrão cria uma cópia que guarda a referência e recebe as novidades da Salesforce; a página feita do zero não recebe.
6. Nenhuma fonte mostra o usuário final mudando a Home; ele personaliza a barra de navegação.

**Fonte**
- [Trailhead, Lightning App Builder, Home page](https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder/lightning_app_builder_homepage)
- [Salesforce Ben, Customize your Salesforce Home Page](https://www.salesforceben.com/customize-your-salesforce-home-page-with-the-lightning-app-builder/)
- [Xtivia, Configuring Salesforce Home tabs](https://www.xtivia.com/blog/configuring-salesforce-home-tabs/)
- Imagens: as notas não trazem URL de imagem.

**Serve ao ENSPACE**
- Padrão por perfil, que vence o padrão geral: é o passo 2 do padrão do workspace.
- Visibilidade por condição: o widget aparece só para quem tem o dado.
- Cópia que guarda a referência ao padrão e recebe as novidades: é o mecanismo para "o widget novo do admin chega a todos".

**Não serve**
- O membro não mexe na Home: é a queixa "pouco flexível" de hoje.
- Montagem num construtor técnico, longe da tela que a pessoa usa.

### Jira e Atlassian

**Como resolve**
1. Ao entrar, a pessoa vê "For you" no menu: espaços recomendados no topo e 5 abas (Recommended, Assigned to me, Starred, Worked on, Viewed). A página lembra a última aba.
2. Recommended junta trabalho a vencer, menções, comentários e aprovações. O item abre num painel lateral, onde a pessoa atualiza sem sair da página.
3. A pessoa nova vê espaços e times sugeridos no lugar das abas vazias.
4. A personalização da página é a estrela. O menu se personaliza em More > Customize sidebar, só para a pessoa.
5. A grade de widgets mora no dashboard: linhas de 1 a 4 colunas, altura Small, Medium ou Large, alça para mover e "Move up" e "Move down" na barra da linha.
6. Search e Create ficam na barra do topo, em todos os apps Atlassian.
7. Com IA ligada: "Summarize comments", "Suggest a reply" e o cartão "Review your agent activity".

**Fonte**
- [Atlassian Support, What is the For you page](https://support.atlassian.com/jira-software-cloud/docs/what-is-the-for-you-page/)
- [Atlassian Support, Navigation reference guide](https://support.atlassian.com/ja/navigation/docs/navigation-reference-guide)
- [Atlassian Support, Customize your dashboard layout](https://support.atlassian.com/platform-experiences/docs/customize-your-dashboard-layout/)
- Imagens: as notas não trazem URL de imagem.

**Serve ao ENSPACE**
- "Move up" e "Move down" como alternativa ao arrasto: atende à WCAG 2.2, critério 2.5.7.
- O item que abre num painel lateral sem sair da Home.
- O vazio de 1º uso com sugestões.
- Create na barra fixa, em toda tela.

**Não serve**
- A Home que só se preenche pelo comportamento, sem montagem.
- Abas que escondem o conteúdo: o que está atrasado fica atrás de um clique.

## Matriz comparativa

Forte: faz completo e documentado. Adequado: faz com limite. Fraco: faz em parte ou fora da Home. Ausente: não faz. "?": as notas não dizem.

| Capacidade | ENSPACE hoje | Notion | Twenty | ClickUp | monday | Pipefy | QuickBooks | HubSpot | Asana | Salesforce | Jira |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Home de widgets que a pessoa monta | Ausente | Adequado | Fraco¹ | Adequado | Fraco¹ | Ausente | Forte | Adequado | Forte | Ausente | Fraco¹ |
| Padrão definido pelo admin ou por papel | Ausente | Adequado | Adequado | Ausente | Adequado | ? | Fraco² | Forte | Ausente | Forte | ? |
| Lista "minhas tarefas" por prazo | Fraco³ | Adequado | Fraco | Forte | Forte | Forte | Ausente | Forte | Adequado | Adequado | Adequado |
| Lista de registros de uma visão salva como widget | Ausente | Forte | Fraco⁴ | Fraco | Fraco¹ | Ausente | Ausente | Adequado | ? | Forte | ? |
| Números/gráficos na Home | Ausente | Ausente | Adequado | Fraco¹ | Fraco¹ | Fraco¹ | Forte | Adequado | Adequado | Forte | Fraco¹ |
| Atalhos e favoritos na Home | Fraco | Forte | Adequado | Forte | Adequado | Adequado | Adequado | Adequado | Adequado | Fraco | Adequado |
| Botão global de criar | Ausente | Adequado | Ausente | Forte | Fraco | Fraco | Forte | Adequado | ? | ? | Adequado |
| Criar pelo teclado ou Ctrl+K | Ausente | ? | Forte | Forte | Fraco | ? | Adequado | Fraco | ? | ? | ? |
| Criar tarefa já com prazo a partir da lista | Ausente | ? | ? | Forte | Adequado | ? | Ausente | Adequado | ? | ? | ? |
| Bloco de notas/texto | Ausente | Ausente | ? | Fraco¹ | Fraco¹ | ? | Ausente | Fraco¹ | Forte | Adequado | ? |
| IA na Home | Ausente | Adequado | Fraco⁵ | Adequado | Adequado | Ausente | Forte | Forte | ? | Adequado | Adequado |
| Restaurar padrão | Ausente | Forte | ? | Fraco⁶ | Ausente⁷ | ? | ? | ? | ? | ? | ? |

1. Existe só no dashboard, fora da Home.
2. O catálogo segue o direito de acesso; ninguém define um layout para os outros.
3. 3 cartões fixos, com erro de filtro na contagem e carregamento que parece vazio (`BRIEFING.md`).
4. A documentação diz que tabela ainda não existe em dashboard; a issue #20815 cita o widget `RECORD_TABLE`.
5. Chat de IA só na Home do celular.
6. Desfazer até 5 mudanças no dashboard; a Home não tem volta ao padrão.
7. Relato antigo da comunidade: quem trocou a Home por um dashboard não conseguiu voltar.

**Leitura da matriz**
- Nenhum produto é Forte em mais de 5 das 12 linhas. HubSpot e Notion somam mais Forte e Adequado (9 e 8 de 12); o ClickUp tem mais Forte (5).
- As linhas com mais Forte e Adequado são "minhas tarefas" (8 de 10) e "atalhos e favoritos" (9 de 10). São a convenção.
- As linhas com mais "?" e Ausente são "restaurar padrão" e "criar tarefa com prazo a partir da lista". São a chance de diferença.

## Achados

### A1. A lista de tarefas por prazo, com ação no lugar, é o bloco que todo mundo põe na entrada
- **Afirmação:** o bloco diário de maior uso é uma lista de tarefas agrupada por prazo, com concluir e criar no próprio bloco.
- **Evidência:** ClickUp agrupa em Today, Overdue, Next e Unscheduled, com "+" por grupo ([Use the My Work card](https://help.clickup.com/hc/en-us/articles/18947060934423-Use-the-My-Work-card)); monday usa 6 faixas com contagem ([My Work](https://support.monday.com/hc/en-us/articles/360019300579)); Pipefy separa Overdue, Late e Expired por SLA ([How to find all cards assigned to you](https://help.pipefy.com/en/articles/1602018-how-to-find-all-cards-assigned-to-you)); HubSpot conclui em 1 clique ([Use your home page](https://knowledge.hubspot.com/help-and-resources/use-your-home-page)).
- **Quantos:** 8 de 10 (Notion, ClickUp, monday, Pipefy, HubSpot, Asana, Salesforce, Jira).
- **Impacto no ENSPACE:** o ENSPACE já tem o bloco, mas dividido em 3 cartões, sem ação e com o erro "Filtro inválido" na contagem. Juntar num widget com grupos e ação resolve a parte "dura" sem conteúdo novo.
- **Confiança:** Alta.

### A2. O padrão que chega pronto pesa mais que o editor
- **Afirmação:** a maioria das pessoas fica com o padrão, então quem define o padrão define a Home que quase todo mundo vê.
- **Evidência:** menos de 5% dos usuários do Word mudaram alguma opção ([UIE, 2011](https://archive.uie.com/brainsparks/2011/09/14/do-users-change-their-settings/)); "Most users are not interested in doing the work required to tweak the user interface" ([NN/g, 2016](https://www.nngroup.com/articles/customization-personalization/)); o pedido mais antigo da HubSpot é o padrão de Home por papel ou time, com 4 pedidos no Ideas ([Ideas 569487](https://community.hubspot.com/t5/HubSpot-Ideas/Allow-possibility-to-define-default-Hubspot-Home-page-by-role-or/idi-p/569487)); Salesforce ativa a Home por app e perfil ([Trailhead](https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder/lightning_app_builder_homepage)).
- **Quantos:** 5 de 10 têm padrão do admin (Notion, Twenty, monday, HubSpot, Salesforce); 2 combinam padrão e cópia pessoal (HubSpot no Customer success, Notion com presets).
- **Impacto no ENSPACE:** o admin do workspace conhece o processo do cliente. Uma Home que ele monta para todos entrega valor a quem nunca abre o "Personalizar".
- **Confiança:** Alta. O dado de Spool é antigo e de 1 produto; não há número recente de SaaS B2B.

### A3. O botão de criar mora fora da Home, e a Home repete os atalhos
- **Afirmação:** criar acompanha a pessoa em toda tela; a Home ganha uma faixa com os atalhos mais usados.
- **Evidência:** QuickBooks tem "+ Create" no menu e até 10 Create actions na Home, ordenadas pelo uso ([Customize your Home page](https://quickbooks.intuit.com/learn-support/en-us/help-article/product-setup/customize-home-page-quickbooks-online/L0ryPsyjD_US_en_US)); ClickUp tem "+" no topo da Home Sidebar com 16 tipos ([Create items](https://help.clickup.com/hc/en-us/articles/6309854442391-Create-items)); Notion põe o menu de criar ao lado do Inbox ([Notion Help, Sidebar](https://www.notion.com/help/sidebar)); HubSpot e Atlassian põem Create na barra do topo ([A guide to HubSpot's navigation](https://knowledge.hubspot.com/help-and-resources/a-guide-to-hubspots-navigation); [Navigation reference guide](https://support.atlassian.com/ja/navigation/docs/navigation-reference-guide)).
- **Quantos:** 5 de 10 têm botão global; 3 de 10 criam pelo teclado ou pelo Ctrl+K (Twenty, ClickUp, QuickBooks).
- **Impacto no ENSPACE:** responde direto a "poucos atalhos". Hoje, criar tarefa custa 3 cliques e criar item 4, e o Ctrl+K não cria. Nenhum concorrente cria a partir do formulário de uma categoria definida pelo cliente (ver "O que nenhum deles faz").
- **Confiança:** Alta para o botão global. Baixa para a posição (topo ou menu): não achei dado de uso que compare.

### A4. Mudar o endereço do trabalho diário gera rejeição, mesmo quando a personalização cresce
- **Afirmação:** quem move a lista diária para mais longe ou impõe a mudança sem volta recebe a reclamação mais alta do lançamento.
- **Evidência:** no ClickUp 4.0, "pin favorites in 4.0" tem 51 votos, "change 4.0 sidebar navigation back" 26, "Add Inbox, My Tasks to Global Navigation" 17 ([quadro de feedback](https://feedback.clickup.com/feature-requests/p/pin-favorites-in-40)); no monday, um usuário reclama em 2026-06-10 do My Work dentro de More ([comentário no anúncio](https://developer-community.monday.com/product-updates/exciting-update-a-redesigned-left-navigation-sidebar-940)); no QuickBooks, o que se usa sempre ficou "3 camadas para dentro" e não há volta ([Intuit Community](https://quickbooks.intuit.com/community/do-more-with-quickbooks-6/how-do-i-customize-the-new-quickbooks-online-dashboard-so-i-can-find-things-and-fix-the-sales-widgets-284013)); no HubSpot, 10 de 14 respostas ao redesenho são negativas ([anúncio](https://community.hubspot.com/t/hubspots-new-design-brings-your-work-into-focus/151517)).
- **Quantos:** 4 de 10.
- **Impacto no ENSPACE:** a Home continua em Início, 1º item do menu, e as tarefas atrasadas continuam visíveis sem clique. A troca tem transição: a Home nova chega com o padrão do admin já preenchido.
- **Confiança:** Alta.

### A5. O carregamento e o vazio precisam de estados próprios, e o vazio oferece a ação seguinte
- **Afirmação:** o bloco que carrega mostra progresso; o bloco vazio diz o que mostraria e oferece o botão de começar.
- **Evidência:** "Não mostrar 'Nenhum registro' enquanto carrega" e "usar o vazio para ensinar" ([NN/g, Empty states](https://www.nngroup.com/articles/empty-state-interface-design/)); HubSpot mostra New Task no widget vazio ([Use your home page](https://knowledge.hubspot.com/help-and-resources/use-your-home-page)); a Personal List vazia do ClickUp mostra "Create a task" ([Personal List](https://help.clickup.com/hc/en-us/articles/31406068455959-Create-and-add-tasks-to-your-Personal-List)); o Jira troca abas vazias por sugestões ([For you](https://support.atlassian.com/jira-software-cloud/docs/what-is-the-for-you-page/)); o Twenty tem Getting Started ([commits](https://github.com/twentyhq/twenty/commits/main/packages/twenty-front/src/modules/getting-started)).
- **Quantos:** 5 de 10 documentam o vazio com ação.
- **Impacto no ENSPACE:** a Home de hoje diz "Nenhuma tarefa em atraso" enquanto carrega e quando o filtro falha. É o defeito mais visível, e o conserto não depende de personalização.
- **Confiança:** Alta.

### A6. Reordenar sem escolher a fonte do widget não resolve "inflexível"
- **Afirmação:** o que os usuários pedem é o widget que mostra o recorte deles (local, campo, filtro), mais que arrastar e redimensionar.
- **Evidência:** no ClickUp, "Filters and Sorting on Home Page" tem 327 votos e "Dashboard as Home / Homescreen" 354, os 2 abertos; "clickup home personalized card" ficou fora do roadmap ([Filters and Sorting](https://feedback.clickup.com/feature-requests/p/filter-tasks-on-the-my-work-section-of-home); [Dashboard as Home](https://feedback.clickup.com/feature-requests/p/dashboard-as-home-homescreen); [personalized card](https://feedback.clickup.com/feature-requests/p/clickup-home-personalized-card)); Notion fixa uma visão de banco com filtro ([Customize your sidebar](https://www.notion.com/help/customize-your-sidebar)); Salesforce tem o componente list view ([Salesforce Developers](https://developer.salesforce.com/docs/atlas.en-us.202.0.salesforce1.meta/salesforce1/flexible_page_about.htm)).
- **Quantos:** 3 de 10 fazem dentro da Home (Notion, HubSpot, Salesforce); 3 fazem só no dashboard (Twenty, ClickUp, monday).
- **Impacto no ENSPACE:** a Home de hoje só fala de tarefas. Quem trabalha com pedidos, contratos ou chamados precisa do widget que lê uma visualização salva da categoria.
- **Confiança:** Média. Os votos vêm de 1 produto; os outros sinais são de capacidade, não de pedido.

### A7. A edição tem modo explícito na maioria das grades, e o arrasto precisa de alternativa
- **Afirmação:** 7 dos 10 produtos usam modo de edição explícito em alguma grade; a alternativa ao arrasto por clique é exigência de acessibilidade.
- **Evidência:** modo explícito no QuickBooks, no Asana, na Home legada da HubSpot e nos dashboards de Twenty, monday, ClickUp e Jira; a Home do ClickUp move direto pela alça ([My Tasks page](https://help.clickup.com/hc/en-us/articles/18944788880791-My-Tasks-page-formerly-Home)); a WCAG 2.2, critério 2.5.7 (AA), pede que toda função de arrasto funcione com 1 ponteiro sem arrastar ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)); o Jira oferece "Move up" e "Move down" ([Customize your dashboard layout](https://support.atlassian.com/platform-experiences/docs/customize-your-dashboard-layout/)).
- **Quantos:** 7 de 10 têm modo explícito em alguma grade; o ClickUp, na Home, move direto.
- **Impacto no ENSPACE:** o Painel de tarefas já decidiu mover direto, sem modo, por pedido da redatora, com limiar de 4 px e Ctrl+Z (`painel-de-tarefas/DECISOES.md`). A Home segue o painel para o ENSPACE ter 1 padrão, e herda a alça de teclado e o menu do widget como alternativa.
- **Confiança:** Média. O mercado prefere o modo; a decisão do ENSPACE é de consistência.

### A8. A IA chegou à Home de 7 dos 10, e o que ela empurra sem botão de fechar vira a maior reclamação
- **Afirmação:** o bloco de IA só é aceito quando é opcional e se desliga.
- **Evidência:** o Business Feed do QuickBooks só adia por 2 semanas, e os usuários o chamam de "a total nuisance" ([Intuit Community](https://quickbooks.intuit.com/community/account-management-7/business-feed-boxes-77074)); há threads pedindo para desligar o Feed e o "Ask Intuit Assist" ([Intuit Community](https://quickbooks.intuit.com/learn-support/en-us/other-questions/give-us-the-option-to-disable-the-garbage-that-is-the-business/00/1588614)); a frase gerada da HubSpot muda com os mesmos dados ([Candu](https://www.candu.ai/blog/hubspot-breeze-agent-hub-review)); o AI StandUp do ClickUp é 1 card que a pessoa liga ([My Tasks page](https://help.clickup.com/hc/en-us/articles/18944788880791-My-Tasks-page-formerly-Home)).
- **Quantos:** 7 de 10 têm IA na Home ou ao lado dela.
- **Impacto no ENSPACE:** o Resumo do BENI entra no catálogo, fora do padrão de fábrica, e sai como qualquer widget.
- **Confiança:** Média. A rejeição está documentada em 2 produtos.

## O que os usuários pedem e reclamam

### QuickBooks: a Home nova trocou atalho por indicador e IA
- A thread "New dashboard, everyone hates it right? December 2025" resume o tom ([Intuit Community](https://quickbooks.intuit.com/community/do-more-with-quickbooks-6/new-dashboard-everyone-hates-it-right-december-2025-284013)).
- O que se usa sempre ficou "3 camadas para dentro", em vez de 1 clique (2025-12-04).
- O gráfico de vendas mostra 1 ponto com o total do período, sem tendência (2025-12-04 e 2025-12-11).
- Reclamações de dezembro de 2025 a fevereiro de 2026: mais anúncios na Home, sistema mais lento, layout poluído, "If it's not broke, don't fix it!" ([Intuit Community](https://quickbooks.intuit.com/community/other-questions-9/how-do-i-switch-the-quickbooks-online-dashboard-back-to-the-old-style-and-if-i-can-t-how-do-i-customize-the-new-home-page-91965)).
- O pedido que mais se repete: um painel pessoal só com links para clientes, fornecedores, contas e relatórios, sem IA nem previsão (2025-12-11, com apoio em caixa alta).
- A Intuit respondeu em 2026 com uma Home padrão mais enxuta e widgets redimensionáveis ([QuickBooks UK](https://quickbooks.intuit.com/uk/blog/quickbooks-online-whats-new-2026/)).
- Não achei elogio citável.

### ClickUp: os pedidos com mais votos são de filtro e fonte, não de layout

| Pedido | Votos | Status |
|---|---|---|
| "Customize Home" | cerca de 1.300 | concluído, sem dizer o que foi entregue |
| "Dashboard as Home / Homescreen" | 354 | aberto desde 2023-10-09 |
| "Add more options to customise Home 3.0" | 347 | concluído (versão 3.0) |
| "Filters and Sorting on Home Page" | 327 | aberto desde 2021-02-16 |
| "pin favorites in 4.0" | 51 | aberto |
| "change 4.0 sidebar navigation back" | 26 | aberto |
| "Add Inbox, My Tasks to Global Navigation" | 17 | aberto |
| "Free Text Card (or Notes card) on Home Screen" | 8 | aberto |
| "Add multiple of the same card in home" | 8 | aberto |
| "Bring back My Tasks to Sidebar" | 7 | aberto |
| "clickup home personalized card" | 5 | fora do roadmap |

- Comentários em "Dashboard as Home": "Dashboards are so much more powerful than the Home screen" (2024-10-01); uma usuária orienta a equipe a não usar a Home porque "confuses them" (2024-05-09); outro deixa um Dashboard fixado numa aba do navegador (2025-09-04).
- Em 2025-11-18, a equipe do ClickUp respondeu que precisa "revamp the home page", mas tem outras prioridades ([Dashboard as Home](https://feedback.clickup.com/feature-requests/p/dashboard-as-home-homescreen)).
- Em "Customize Home", usuários relatam que a configuração da página My Tasks não ficava salva depois de recarregar (maio de 2025) ([Customize Home](https://feedback.clickup.com/feature-requests/p/customize-home)).

### monday.com: a Home fixa e, em 2026, o My Work escondido
- Pedidos antigos por uma Home personalizável citam o Podio, que tinha Home de workspace montável; um usuário diz que a Home é a pior parte do monday ([Better customization + personalization of homepage](https://community.monday.com/t/better-customization-personalization-of-homepage/45518)).
- Quem trocou a Home padrão por um dashboard perdeu "My Workspaces" e os links de "Learn & get inspired", e não conseguiu voltar ([Home page: default vs dashboard](https://community.monday.com/t/home-page-default-vs-dashboard/69026)).
- Em 2026-06-10, um usuário reclama que o My Work saiu da barra, precisa ser achado e reconfigurado a cada abertura, e pede que vire a página de entrada ([comentário no anúncio](https://developer-community.monday.com/product-updates/exciting-update-a-redesigned-left-navigation-sidebar-940)).
- Pedidos sobre o My Work: faixas "This month" e "Next month" no lugar de "Later", "Without a date" no topo, filtros salvos.
- Os votos ficaram sem confirmação: os tópicos devolvem 404.

### HubSpot: o padrão por papel é o pedido mais antigo
- 4 pedidos no Ideas tratam do padrão de Home ou dashboard definido pelo admin: "Admin - set default home screen for company users", "Allow possibility to define default Hubspot Home page by role or team", "Set Dashboard View for All Users" e "Dashboard Landing/Home Page" ([Ideas 331808](https://community.hubspot.com/t5/HubSpot-Ideas/Admin-set-default-home-screen-for-company-users/idi-p/331808); [Ideas 254453](https://community.hubspot.com/t5/HubSpot-Ideas/Set-Dashboard-View-for-All-Users/idi-p/254453)).
- A resposta da HubSpot são os Presets, só em Professional e Enterprise. Os votos não abriram (403).
- O redesenho de 2026 teve 10 de 14 respostas negativas na 1ª página, com crítica a contraste baixo e à falta de opção por empresa ou time ([anúncio](https://community.hubspot.com/t/hubspots-new-design-brings-your-work-into-focus/151517)).
- No mesmo tópico, o elogio é condicional: o layout novo ganha se reduzir a busca pelo CRM, desde que a priorização seja confiável.

### Notion: a migração desfez a Home de widgets
- O Notion levou a Home "from a full-page experience to a part of your sidebar" ([Notion Help, Sidebar](https://www.notion.com/help/sidebar)).
- O widget My Tasks foi para o pé da aba Home; as visões personalizadas viraram uma página em Private; quem abria na Home passou a abrir em "Last Visited".
- Um guia independente diz que a Home antiga "still require[s] some polish", personalizava menos que uma página comum, e o autor quase não a usava ([thomasjfrank.com](https://thomasjfrank.com/learn-notion/notion-home/)).
- A barra nova entrou primeiro como opt-in, com volta pelo seletor de workspace ([matthiasfrank.de](https://matthiasfrank.de/en/notion-updates/ui-update-the-new-opt-in-sidebar/)).

### Asana e Pipefy
- Asana: pedido de várias Homes alternáveis em 2026-05-06, sem resposta ([Fórum Asana](https://forum.asana.com/t/home-tab-multiple-home-views-switchable-layouts/1139862.md)).
- Pipefy: nota 4,6 no Capterra (323 avaliações), com reclamação de filtro que mostra cards de que a pessoa é responsável mesmo com o filtro aplicado ([Capterra](https://capterra.com/p/144848/Pipefy/reviews/)).

## O padrão que todos seguem

1. **A entrada mostra o trabalho da pessoa:** tarefas atribuídas agrupadas por prazo, com contagem (8 de 10).
2. **Criar mora num lugar fixo, visível em toda tela:** "+" no topo do menu lateral ou na barra do topo (5 de 10). Quem põe atalhos de criação na Home também os tem fora dela.
3. **Favoritos e recentes ficam a 1 clique** (9 de 10).
4. **A personalização é por pessoa e não muda a tela dos outros.** Notion, ClickUp, HubSpot e Atlassian dizem isso em texto.
5. **A grade de widgets livres mora no dashboard,** e a Home tem um catálogo menor e de trabalho (ClickUp: 9 cards na Home e cerca de 70 no Dashboard).
6. **Mover e redimensionar pela alça e pela borda,** com os vizinhos abrindo espaço.
7. **O catálogo segue a permissão:** o widget some para quem não lê o dado (QuickBooks, Salesforce, Twenty).

Divergir de 1, 2 e 3 custa aprendizado a quem usa e precisa de motivo escrito. A proposta do ENSPACE segue os 7.

## O que nenhum deles faz

1. **Widget de uma visualização salva de categoria, com filtro próprio, que o membro põe na própria Home em qualquer plano.**
   - ClickUp deixou o "personalized card" fora do roadmap; monday e Twenty fazem só no dashboard; Salesforce faz só pelo admin; Notion faz como lista na barra lateral, sem contagem nem criar.
   - O ENSPACE já tem as visualizações salvas ("Pedidos em aberto", "Meus itens"). O widget só aponta para elas.
2. **Criar um item pelo formulário da própria categoria, a partir da Home.**
   - HubSpot cria 5 objetos fixos; ClickUp e QuickBooks criam tipos fixos; Pipefy abre o Start Form só dentro do pipe.
   - No ENSPACE, as categorias e os formulários são do cliente. O botão Criar lista as categorias que a pessoa pode criar e os formulários fixados, e abre o formulário que a categoria já usa.
3. **Um widget que falha sem quebrar a Home.**
   - Nenhuma fonte descreve o estado de erro por widget na Home. O mais perto: o ClickUp mostra a hora da última leitura e o botão de atualizar por card, e a HubSpot mostra "Too many data points requested" num relatório do dashboard.
   - A Home do ENSPACE de hoje mostra o JSON do erro na contagem e diz "Nenhuma tarefa" no lugar.
4. **Padrão do admin, cópia pessoal e widget novo que chega a todos, num modelo só e em todo plano.**
   - HubSpot faz isso só no Customer success workspace e só em Professional e Enterprise; Salesforce faz a cópia herdar a novidade da Salesforce, não a do admin; Notion tem preset e reset, sem herança.
5. **Volta ao padrão e desfazer juntos.** Notion reseta a aba; ClickUp desfaz 5 mudanças no dashboard. Nenhum oferece os 2 na Home.
6. **Criar tarefa com prazo a partir da lista em mais de 1 produto.** Só o ClickUp preenche o vencimento pelo grupo.

## Recomendação para o ENSPACE

A decisão para o protótipo: **Início vira uma grade de widgets com o padrão do workspace, a cópia de cada membro e um botão Criar no topo do menu lateral.** Abaixo, cada parte da hipótese conferida contra a evidência.

### (a) Grade de widgets do Painel de tarefas, com "Personalizar", catálogo e "Restaurar padrão"
- **A evidência concorda:**
  - 4 dos 10 têm Home montável (QuickBooks, Asana, ClickUp, HubSpot), e a redatora citou os 2 primeiros como exemplo;
  - catálogo com liga e desliga mais arrasto na tela é o desenho do QuickBooks e do ClickUp;
  - "Restaurar padrão" só o Notion tem: é diferença.
- **A evidência discorda em 1 ponto:** 7 dos 10 usam modo de edição explícito em alguma grade (A7). O ENSPACE segue o Painel de tarefas e move direto, por decisão da redatora, porque 1 padrão de painel vale mais que a convenção de fora. Para cobrir o risco de arrasto sem querer:
  - o limiar de 4 px e o Ctrl+Z que o painel já tem;
  - o menu "…" de cada widget com "Mover para cima", "Mover para baixo", "Tamanho padrão" e "Ocultar" (WCAG 2.5.7, como o Jira);
  - a alça de teclado do `UxGradeDePaineis`.
- **O que muda em relação ao painel:** o Painel de tarefas tem 8 painéis fixos e tirou o catálogo. A Home precisa do catálogo, porque o widget de itens e o de número pedem configuração (qual visualização, qual categoria). "Personalizar" abre o catálogo com busca, a lista do que está na Home e "Restaurar padrão".
- **Do ClickUp, evitar:** 1 widget de cada tipo e só 2 larguras. O widget de itens repete, 1 por visualização.

### (b) O admin define a Home padrão do workspace, cada membro tem a cópia dele, e o widget novo do admin chega a todos
- **A evidência concorda:** é o modelo do Customer success da HubSpot; o Salesforce prova o mecanismo da cópia que guarda a referência; a HubSpot faz a escolha da pessoa vencer o padrão; o Spool e a NN/g mostram que o padrão é o que a maioria vê (A2).
- **Como guardar:** a cópia do membro guarda só a diferença sobre o padrão (o que ele moveu, escondeu, acrescentou). Assim o widget novo do admin aparece na Home de todos, no lugar que o admin escolheu.
- **A evidência pede mais:** o padrão por papel é o pedido mais antigo da HubSpot e existe no Salesforce. Fica como passo 2: o modelo já aceita 1 padrão por perfil de acesso, e o protótipo mostra só o do workspace.
- **Em aberto:** o que acontece quando o admin tira um widget que o membro mudou. Nenhuma fonte responde; vai para o `DECISOES.md` como pergunta.

### (c) Widgets do padrão de fábrica e do catálogo
O padrão de fábrica é o que o workspace recebe antes de o admin mexer.

| Widget | No padrão | Evidência | Detalhe que a evidência pede |
|---|---|---|---|
| Criar rápido | sim | QuickBooks, Create actions | nova tarefa, novo item por categoria e formulários fixados; até 10; ordem pelo uso enquanto a pessoa não escolhe |
| Minhas tarefas | sim | ClickUp, monday, Pipefy, HubSpot | Em atraso, Hoje, Próximas, Sem prazo, com contagem; "+" por grupo preenche o prazo; concluir em 1 clique; o grupo recolhido fica recolhido (queixa do ClickUp); "fora do SLA" como marca (Pipefy) |
| Itens de uma visualização | sim | Notion, Salesforce, pedidos do ClickUp | aponta para uma visualização salva; contagem; "+" abre o formulário da categoria; repete |
| Atalhos | sim | pedido "só links" do QuickBooks; Notion; Asana | categorias, visualizações, painéis e formulários; lê os Favoritos que a pessoa já marca com Ctrl+B |
| Recentes | sim | ClickUp, HubSpot, Notion, Jira, Salesforce | itens e telas abertos há pouco |
| Agenda de hoje | sim, pequeno | ClickUp, HubSpot, Salesforce, Notion | some do padrão quando a pessoa não tem evento, como o ClickUp esconde seção vazia |

Catálogo, fora do padrão:

| Widget | Evidência |
|---|---|
| Número de uma visualização | ClickUp Calculation; monday Numbers; widget de número do Twenty |
| Saúde dos prazos | painel que já existe no Painel de tarefas |
| Gráfico de um painel | HubSpot "Add to dashboard"; tirar da Home não apaga o painel |
| Tarefas que delegei | ClickUp, aba Delegated; Asana |
| Bloco de notas | Asana Private notepad; pedido aberto no ClickUp |
| Comunicado do workspace | Confluence mostra avisos do site na Home; evidência fraca |
| Resumo do BENI | HubSpot, ClickUp, QuickBooks; opcional e desligável (A8) |

- **A evidência discorda em 1 ponto:** o QuickBooks simplificou a Home porque ela "tentava fazer coisa demais". 6 widgets no padrão é o teto. Agenda e Recentes entram pequenos, e o admin tira o que o workspace não usa.

### (d) Botão "Criar" no topo do menu lateral, com o mesmo menu do widget, busca e tecla "C"; ações de criar no Ctrl+K em seguida
- **A evidência concorda:**
  - o botão global existe em 5 de 10; no topo do menu lateral, em QuickBooks, ClickUp e Notion;
  - o mesmo menu na Home e no menu lateral é o que o QuickBooks faz (Create actions e "+ Create");
  - criar pelo Ctrl+K existe no Twenty e no ClickUp, e o ENSPACE responde hoje "No matching data" a "criar".
- **A evidência pede cuidado com a tecla:** o ClickUp usa T para tarefa e deixa as teclas desligadas por padrão. A tecla "C" só vale fora de campo de texto, e o atalho aparece escrito no botão e na dica, como o "Ctrl K" do "Buscar...".
- **Do ClickUp, copiar:** o aviso depois de criar, com "Abrir" e "Copiar link", e o destino claro (Tarefas rápidas, ou a categoria escolhida).
- **Fora do escopo:** a posição topo contra menu lateral não tem dado de uso. O menu lateral ganha porque a demanda o cita e porque o protótipo `menu-lateral` já desenhou um "+" no Início.

### (e) Cada widget carrega, falha e fica vazio sozinho
- **A evidência concorda:** a NN/g pede progresso no carregamento e vazio que ensina (A5); HubSpot e ClickUp põem o botão de criar no vazio; o ClickUp mostra a hora da última leitura por card.
- **Para o protótipo, 3 estados por widget:**
  - carregando: esqueleto no tamanho do widget, nunca "Nenhuma tarefa";
  - erro: mensagem em linguagem da tela ("Não foi possível carregar as tarefas") e "Tentar de novo", sem JSON; os outros widgets seguem;
  - vazio: o que o widget mostraria e o botão da ação seguinte ("Criar tarefa", "Escolher visualização").
- **Primeiro uso:** o workspace novo recebe um cartão de começo com passos e "adiar até amanhã", como o Getting Started do Twenty.

### O que não copiar
- **QuickBooks:** anúncio e Feed de IA no topo, sem fechar; widget que some na migração (Tasks e Reminders); mudança sem volta.
- **monday e ClickUp 4.0:** mover a lista diária para mais fundo (More, Home > My Tasks).
- **monday:** trocar a Home por um dashboard e perder os atalhos sem caminho de volta; widgets lúdicos.
- **Twenty:** todo dashboard público, sem cópia pessoal; entrada decidida pela ordem do menu.
- **ClickUp:** a Home com menos ferramentas que o dashboard; 1 card de cada tipo; teclas desligadas.
- **HubSpot:** a frase de IA que muda com os mesmos dados; 3 lugares diferentes para "definir como padrão".
- **Salesforce:** a Home que só o admin monta.

## Lacunas

- **Voz do usuário do ENSPACE:** sem entrevista, chamado ou analytics. Não se sabe quantos reclamam, de qual perfil, nem o que abrem depois da Home. O Clarity do UX Analytics pode medir o clique na Home e o caminho até criar.
- **Prints próprios:** nenhum concorrente foi visto logado; só as imagens das centrais de ajuda, não abertas uma a uma.
- **Padrão de fábrica dos concorrentes:** nenhum artigo diz quais cards vêm ligados na página My Tasks do ClickUp, nem descreve a Home padrão do monday seção a seção.
- **Grade:** nenhuma fonte dá número de colunas nem tamanhos mínimos da Home ou do dashboard, salvo o Jira (1 a 4 colunas, 3 alturas) e o PatternFly (3 e 4 colunas, 3 tamanhos).
- **Volta ao padrão:** QuickBooks, HubSpot e Asana não documentam "Restore default".
- **Conflito entre o padrão e a cópia:** nenhuma fonte diz o que acontece quando o admin tira ou muda um widget que o membro já arrumou.
- **Votos da HubSpot e do monday:** as páginas devolveram 403 e 404.
- **Twenty:** não achei como a issue #20815 foi resolvida, nem a data dos dashboards.
- **Pipefy:** não achei a página inicial completa, o botão de criar global nem se o admin define algo para todos.
- **Asana, Salesforce e Jira:** não há URL de imagem nas notas; parte dos widgets do Asana vem de artigo de 2022.
- **Quem personaliza:** não há estudo de 2024 a 2026 com a parcela de pessoas que mudam a Home em SaaS B2B; os números de blog se contradizem (48% contra 78%).
- **Posição do Criar:** não há dado de uso que compare topo, menu lateral e Home.
- **Celular:** a pesquisa não cobriu a Home no celular, salvo Notion e Twenty.

## Fontes

1. https://www.notion.com/en-gb/help/home-and-my-tasks
2. https://www.notion.com/help/customize-your-sidebar
3. https://www.notion.com/help/sidebar
4. https://www.notion.com/pt-br/releases/2026-03-26
5. https://www.notion.com/releases/2024-06-11
6. https://images.ctfassets.net/spoqsaf9291f/2tpJheiXLOwBH9ZdZGnQt3/514bd06e33972f166580fa5c50bcdbdf/Group_61.png?w=3840&q=55&fm=webp
7. https://images.ctfassets.net/spoqsaf9291f/6R8KIHTn55Om9GLLDHb5Id/2d8faff81a9759c0437e47aceffe3807/Sidebar_FINAL.gif
8. https://thomasjfrank.com/learn-notion/notion-home/
9. https://matthiasfrank.de/en/notion-updates/ui-update-the-new-opt-in-sidebar/
10. https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/navigation/hooks/useDefaultHomePagePath.ts
11. https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/navigation/utils/getFirstNavigationMenuItemLink.ts
12. https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/pages/mobile-home/MobileHomePage.tsx
13. https://github.com/twentyhq/twenty/commits/main/packages/twenty-front/src/modules/getting-started
14. https://github.com/twentyhq/twenty/issues/20815
15. https://github.com/twentyhq/twenty/issues/21166
16. https://docs.twenty.com/user-guide/layout/capabilities/navigation.md
17. https://docs.twenty.com/user-guide/dashboards/capabilities/dashboards.md
18. https://docs.twenty.com/user-guide/getting-started/how-tos/navigate-around-twenty.md
19. https://mintcdn.com/twenty/nHykqzejUXmkEL88/images/user-guide/home/main-layout.png?fit=max&auto=format&n=nHykqzejUXmkEL88&q=85&s=6d60a2b584df62b14753d0eab33a9d5f
20. https://mintcdn.com/twenty/rtjyQTAh0DrLn5Sz/images/user-guide/dashboard/dashboard-tabs.png
21. https://help.clickup.com/hc/en-us/articles/18944788880791-My-Tasks-page-formerly-Home
22. https://help.clickup.com/hc/en-us/articles/31007956275863-My-Tasks
23. https://help.clickup.com/hc/en-us/articles/18947060934423-Use-the-My-Work-card
24. https://help.clickup.com/hc/en-us/articles/6309854442391-Create-items
25. https://help.clickup.com/hc/en-us/articles/31406068455959-Create-and-add-tasks-to-your-Personal-List
26. https://help.clickup.com/hc/en-us/articles/26985557505303-Cards-feature-availability-and-limits
27. https://help.clickup.com/hc/en-us/articles/34275916892951-Move-and-resize-cards-on-Dashboards
28. https://help.clickup.com/hc/en-us/articles/6533695640343-What-is-the-AI-Command-Bar
29. https://help.clickup.com/hc/en-us/articles/6309030550167-Use-keyboard-shortcuts
30. https://help.clickup.com/hc/en-us/articles/31142608907543-Intro-to-ClickUp-4-0
31. https://help.clickup.com/hc/article_attachments/42699553943959
32. https://help.clickup.com/hc/article_attachments/19065165081111
33. https://feedback.clickup.com/feature-requests/p/customize-home
34. https://feedback.clickup.com/feature-requests/p/dashboard-as-home-homescreen
35. https://feedback.clickup.com/feature-requests/p/filter-tasks-on-the-my-work-section-of-home
36. https://feedback.clickup.com/feature-requests/p/clickup-home-personalized-card
37. https://feedback.clickup.com/feature-requests/p/pin-favorites-in-40
38. https://feedback.clickup.com/feature-requests/p/change-40-sidebar-navigation-back
39. https://feedback.clickup.com/feature-requests/p/add-inbox-my-tasks-to-global-navigation
40. https://feedback.clickup.com/feature-requests/p/bring-back-my-tasks-to-sidebar
41. https://feedback.clickup.com/feature-requests/p/free-text-card-or-notes-card-on-home-screen-desktop-browser
42. https://feedback.clickup.com/feature-requests/p/add-multiple-of-the-same-card-in-home
43. https://feedback.clickup.com/feature-requests/p/add-more-options-to-customise-home-30
44. https://support.monday.com/hc/en-us/articles/35276662798098-Navigating-monday-s-AI-work-platform
45. https://support.monday.com/hc/en-us/articles/360019300579
46. https://support.monday.com/hc/en-us/articles/26233702292114-Configure-your-Dashboard
47. https://support.monday.com/hc/en-us/articles/360002187819
48. https://support.monday.com/hc/en-us/articles/34101891654034-monday-vibe-best-practices-features-and-capabilities
49. https://support.monday.com/hc/en-us/articles/115005339905-monday-com-Shortcuts
50. https://support.monday.com/hc/article_attachments/31864074056594
51. https://support.monday.com/hc/article_attachments/26240419330066
52. https://community.monday.com/t/better-customization-personalization-of-homepage/45518
53. https://community.monday.com/t/home-page-default-vs-dashboard/69026
54. https://developer-community.monday.com/product-updates/exciting-update-a-redesigned-left-navigation-sidebar-940
55. https://help.pipefy.com/en/articles/2584689-getting-started
56. https://help.pipefy.com/en/articles/3541073-pipe-filter
57. https://help.pipefy.com/en/articles/1602018-how-to-find-all-cards-assigned-to-you
58. https://community.pipefy.com/product-updates/a-new-header-experience-is-here-4746
59. https://uploads-us-west-2.insided.com/pipefy-en/attachment/c35a2e58-cac1-4c82-a326-01540fcdc6eb.png
60. https://uploads-us-west-2.insided.com/pipefy-en/attachment/ecb1fcee-0f1e-44fe-b977-0842bf413f66.png
61. https://capterra.com/p/144848/Pipefy/reviews/
62. https://quickbooks.intuit.com/learn-support/en-us/help-article/product-setup/customize-home-page-quickbooks-online/L0ryPsyjD_US_en_US
63. https://quickbooks.intuit.com/learn-support/en-us/help-article/bookkeeping-processes/understand-navigation-menu-quickbooks-online/L310NeoHY_US_en_US
64. https://www.firmofthefuture.com/product-update/customizations-supercharge-quickbooks/
65. https://quickbooks.intuit.com/uk/blog/quickbooks-online-whats-new-2026/
66. https://www.firmofthefuture.com/oidam/intuit/sbseg/en_us/Blog/stock-photos/homepage-dashboard-qbo-us-en.jpg
67. https://ahf.tlq.mybluehost.me/wp-content/uploads/2024/01/Home-CustomizingLayout-MovingWidgets_QBO-1.gif
68. https://quickbooks.intuit.com/community/do-more-with-quickbooks-6/how-do-i-customize-the-new-quickbooks-online-dashboard-so-i-can-find-things-and-fix-the-sales-widgets-284013
69. https://quickbooks.intuit.com/community/other-questions-9/how-do-i-switch-the-quickbooks-online-dashboard-back-to-the-old-style-and-if-i-can-t-how-do-i-customize-the-new-home-page-91965
70. https://quickbooks.intuit.com/community/do-more-with-quickbooks-6/new-dashboard-everyone-hates-it-right-december-2025-284013
71. https://quickbooks.intuit.com/community/account-management-7/business-feed-boxes-77074
72. https://quickbooks.intuit.com/learn-support/en-us/other-questions/give-us-the-option-to-disable-the-garbage-that-is-the-business/00/1588614
73. https://knowledge.hubspot.com/help-and-resources/use-your-home-page
74. https://knowledge.hubspot.com/user-management/manage-user-preferences-with-user-groups
75. https://knowledge.hubspot.com/customer-success/customize-the-summary-tab-in-the-customer-success-workspace
76. https://knowledge.hubspot.com/help-and-resources/a-guide-to-hubspots-navigation
77. https://knowledge.hubspot.com/hs-fs/hubfs/Knowledge_Base_2023-24-25/KB-navigation/navigation-customize-home.png?width=500&height=446&name=navigation-customize-home.png
78. https://knowledge.hubspot.com/hs-fs/hubfs/Knowledge_Base_2023-24-25/KB-customer-success/customer-success-reorder-resize-summary.gif?width=463&height=297&name=customer-success-reorder-resize-summary.gif
79. https://community.hubspot.com/t/hubspots-new-design-brings-your-work-into-focus/151517
80. https://community.hubspot.com/t5/HubSpot-Ideas/Admin-set-default-home-screen-for-company-users/idi-p/331808
81. https://community.hubspot.com/t5/HubSpot-Ideas/Allow-possibility-to-define-default-Hubspot-Home-page-by-role-or/idi-p/569487
82. https://community.hubspot.com/t5/HubSpot-Ideas/Set-Dashboard-View-for-All-Users/idi-p/254453
83. https://www.candu.ai/blog/hubspot-breeze-agent-hub-review
84. https://help.asana.com/s/article/how-to-customize-your-home-page
85. https://asana.com/features/project-management/home
86. https://www.makeuseof.com/how-to-customize-asana-home/
87. https://forum.asana.com/t/home-tab-multiple-home-views-switchable-layouts/1139862.md
88. https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder/lightning_app_builder_homepage
89. https://www.salesforceben.com/customize-your-salesforce-home-page-with-the-lightning-app-builder/
90. https://www.xtivia.com/blog/configuring-salesforce-home-tabs/
91. https://developer.salesforce.com/docs/atlas.en-us.202.0.salesforce1.meta/salesforce1/flexible_page_about.htm
92. https://support.atlassian.com/jira-software-cloud/docs/what-is-the-for-you-page/
93. https://support.atlassian.com/ja/navigation/docs/navigation-reference-guide
94. https://support.atlassian.com/platform-experiences/docs/customize-your-dashboard-layout/
95. https://archive.uie.com/brainsparks/2011/09/14/do-users-change-their-settings/
96. https://www.nngroup.com/articles/customization-personalization/
97. https://www.nngroup.com/articles/empty-state-interface-design/
98. https://www.nngroup.com/articles/drag-drop/
99. https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
100. https://www.patternfly.org/patterns/dashboard/design-guidelines

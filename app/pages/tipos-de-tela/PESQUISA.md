# Pesquisa: tipos de tela

A pesquisa saiu do deep research de 2026-10-21, que cobriu 26 produtos de gestão de trabalho, BPM, no-code e enterprise pela documentação oficial. O Twenty CRM entrou nesta rodada, pela doc oficial e pelo código do repositório `twentyhq/twenty`. A pergunta: como o mercado organiza as telas que o admin põe no menu, para que os 13 tipos legados de Configurações > Interface > Telas caibam em 5 tipos de menu (Lista de itens, Fila de tarefas, Painel, Documentos e Página externa) e 1 módulo fixo, Requisições (Abrir requisição, Minhas requisições e Triagem), sem o tipo Customizado.

**Referência é padrão de interação, nunca identidade.** Nenhuma marca, cor, ícone ou texto dos produtos abaixo vai para o protótipo.

## Resumo

| # | Referência | Liga-se a | O que leva para o ENSPACE |
|---|---|---|---|
| 1 | Notion | Lista de itens, Painel, Abrir requisição | Tipo novo só quando a forma de exibição é nova; painel feito de visualizações |
| 2 | Twenty CRM | Lista de itens, Painel, Página externa, Fila de tarefas | "Me" fixo no topo do filtro de pessoa; visualização favoritada vai para o menu |
| 3 | ClickUp | Fila de tarefas, Painel, Página externa | Tela pessoal fixa; drill-down do painel; aviso de site que recusa iframe |
| 4 | monday.com | Painel, Documentos, Página externa, Minhas requisições | Filtro global e por widget com limite declarado; galeria de arquivos ancorada no item |
| 5 | Pipefy | Módulo Requisições, Fila de tarefas | Portal por área com permissão herdada; abrir e acompanhar no mesmo lugar |
| 6 | Airtable | Lista de itens, Triagem, Painel | "Viewer's records" como opção de filtro; Record review como lista e detalhe |
| 7 | Fluig | Fila de tarefas, Minhas requisições | "Movimentar em bloco" com trava e contador; fila do grupo como aba |
| 8 | Jira Service Management | Módulo Requisições, Triagem, Fila de tarefas | Portal com 3 vistas do solicitante; fila "Requires my approval" com lote |
| 9 | Smartsheet WorkApps | Página externa, Painel | Página nasce oculta; permissão por papel em cada página |

## As 5 obrigatórias

### 1. Notion

**Liga-se a:** Lista de itens, Painel e, em parte, Abrir requisição.

**Como resolve, em passos:**

1. O banco de dados tem 1 conjunto de visualizações: Table, Board, Timeline, Calendar, List, Gallery e Chart.
2. O Notion cria tipo novo só quando a forma de exibição é nova: Form (2024-10), Map (2025-11) e Dashboard (2026-03) entram como mais uma visualização do banco.
3. Filtro e ordenação valem só para quem mexeu até a pessoa clicar "Save for everyone".
4. "My tasks" reúne, num widget da Home, as tarefas atribuídas à pessoa em até 10 bancos do tipo Task database; o banco precisa de Status, Assignee e Due date.
5. O Dashboard view junta até 12 widgets, até 4 por linha; cada widget é 1 visualização de 1 ou mais bancos.
6. O filtro global do painel ("Filter multiple sources") só afeta o widget que tem a propriedade filtrada.
7. O formulário grava cada resposta como linha do banco, numa tabela "Responses"; o admin escolhe quem envia: membros com o link, qualquer pessoa com o link ou ninguém.
8. O acesso por coluna ("Property access") aceita exceção por campo de pessoa; uma visualização que filtra por coluna oculta pode não abrir para quem não vê a coluna.

**URL:**
- [Database views, filters, sorts & groups](https://www.notion.com/help/views-filters-and-sorts)
- [Dashboard view](https://www.notion.com/help/dashboards)
- [Task databases e My tasks](https://www.notion.com/he/help/guides/give-your-to-dos-a-home-with-task-databases)
- [Forms](https://www.notion.com/help/forms)
- [Property access](https://www.notion.com/help/database-property-access)
- [Releases 2024-10-24](https://www.notion.com/releases/2024-10-24) e [2025-11-17](https://www.notion.com/releases/2025-11-17)

**O que serve:**
- A regra "tipo novo só para forma nova" justifica fundir Consultas, Consultas (Grupo de Membros), Meus Itens e Telas Personalizadas em Lista de itens: os 4 mudam o recorte, não a forma.
- Painel feito de visualizações salvas reaproveita a tabela nova do ENSPACE em vez de criar um motor de widget à parte.
- O filtro global que pula o widget incompatível resolve o caso de 1 painel com categorias diferentes.

**O que não serve:**
- O filtro "Me" do Notion aparece só em blog de terceiro; a ajuda oficial não documenta. Não serve de fonte para o rótulo do escopo.
- O formulário do Notion não tem acompanhamento do solicitante: a doc não descreve lista do que a pessoa enviou. O módulo Requisições precisa de Minhas requisições.
- O Dashboard view exige plano Business ou Enterprise; o limite de 12 widgets é decisão de plano do Notion e não se copia.

Print: não capturado nesta rodada; a pesquisa foi feita por documentação oficial (URL acima).

### 2. Twenty CRM

**Liga-se a:** Lista de itens, Painel, Página externa e, pelo disparo em lote, Fila de tarefas.

**Como resolve, em passos:**

1. A barra lateral tem 2 seções: **Favorites**, pessoal, e **Workspace**, com os objetos e a mesma ordem para todos.
2. Quem tem a permissão **Layouts** reordena a seção Workspace pelo ícone de chave inglesa; o membro cria pasta e link próprio com o botão direito ou o "+".
3. Cada objeto tem visualizações (tabela, kanban, calendário). No menu "⋮" da visualização, "Add to favorites" leva a visualização para a seção Favorites.
4. A visibilidade da visualização tem 2 opções: **Workspace** (todos veem) ou **Unlisted** (só quem criou). A visualização padrão "All [objeto]" não muda de visibilidade.
5. Mudou o filtro, a barra oferece **Update view** para gravar na visualização atual ou **Create view** para gravar como nova.
6. No filtro de um campo que aponta para membro do workspace, a opção **Me** vem fixa no topo da lista de pessoas (componente `ObjectFilterDropdownRecordSelect.tsx`, item `CURRENT_WORKSPACE_MEMBER_SELECTABLE_ITEM_ID`). O filtro grava "usuário atual", não o nome de quem montou.
7. Restringir quem vê registro é outra camada: a permissão por linha ("Row-Level") fica no papel, com condição por objeto, só no plano Organization.
8. O painel tem abas, e cada aba tem widgets: barra, pizza, linha, agregado, tabela, texto rico e **iFrame**. Cada widget lê 1 objeto e tem filtro próprio.
9. O painel não tem filtro global ("Dashboard-level filters are not available yet") e todo membro do workspace vê todo painel.
10. O workflow com disparo manual roda pelo Ctrl+K ou por um botão fixo na barra do topo, depois de marcar registros. A opção **Bulk** passa a lista marcada de uma vez; a opção **Single** roda 1 vez por registro.
11. A etapa **Form** do workflow pede dados só para quem disparou; a doc indica outra etapa, "Send to Inbox", para pedir resposta ou aprovação de outra pessoa, sem descrevê-la.

**URL:**
- [Navigation](https://docs.twenty.com/user-guide/layout/capabilities/navigation.md)
- [View settings](https://docs.twenty.com/user-guide/views-pipelines/capabilities/view-settings.md) e [Restrict access to your view](https://docs.twenty.com/user-guide/views-pipelines/how-tos/restrict-access-to-your-view.md)
- [Filters and sorting](https://docs.twenty.com/user-guide/views-pipelines/capabilities/filters-and-sorting.md)
- [Código do filtro "Me"](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/object-record/object-filter-dropdown/components/ObjectFilterDropdownRecordSelect.tsx)
- [Permissions](https://docs.twenty.com/user-guide/permissions-access/capabilities/permissions.md)
- [Dashboards](https://docs.twenty.com/user-guide/dashboards/overview), [Widgets](https://docs.twenty.com/user-guide/dashboards/capabilities/widgets.md), [Chart settings](https://docs.twenty.com/user-guide/dashboards/capabilities/chart-settings.md) e [Dashboards FAQ](https://docs.twenty.com/user-guide/dashboards/how-tos/dashboards-faq.md)
- [Workflow triggers](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers.md) e [Workflow actions](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions.md)

**O que serve:**
- "Me" fixo no topo do filtro de pessoa é o desenho do escopo "Só os meus" da Lista de itens: 1 opção de filtro, não 1 tipo de tela.
- Filtro de visualização e permissão de linha moram em lugares diferentes. A Lista de itens precisa dizer que o escopo é recorte, não permissão.
- Visualização salva que vira item do menu pelo "Add to favorites" confirma o "o menu é a tela" do protótipo menu-lateral.
- O iFrame como widget de painel é o passo seguinte da Página externa: o mesmo conteúdo dentro do Painel.
- O disparo manual com a lista marcada, num botão da barra do topo, é o padrão do lote da Fila de tarefas: marcar, ver o botão, rodar.

**O que não serve:**
- O painel sem filtro global e sem painel privado fica abaixo do mínimo que o Painel novo pede (filtro global e por widget, permissão de quem vê). Não é modelo para o Painel.
- A etapa Form não chega a outra pessoa. Não serve de modelo para Abrir requisição nem para Triagem.
- As páginas consultadas do Twenty não descrevem tela de arquivos nem portal de requisição: não há referência dele para Documentos e para o módulo Requisições.

Print: não capturado nesta rodada; a pesquisa foi feita por documentação oficial (URL acima).

### 3. ClickUp

**Liga-se a:** Fila de tarefas, Painel e Página externa.

**Como resolve, em passos:**

1. A barra da Home traz por padrão Inbox, Chat Activity, Drafts and Sent, All Channels e **My Tasks**. Nenhum admin cria essa tela.
2. A página "My Tasks" leva no título "(formerly Home)": o nome antigo fica visível depois da troca.
3. Docs, Dashboards, Whiteboard, Form e Embed são visualizações de página: o membro adiciona com "+ View" dentro de Space, Folder ou List.
4. O Embed view pede "Any website" e a URL, ou "Embed HTML". A doc avisa que site que bloqueia iframe não abre.
5. No painel, clicar num dado do cartão (barra, pizza, cálculo, Task List) abre a lista das tarefas por trás; a lista do drill-down aceita colunas.
6. O filtro do painel vale para todo cartão compatível; cada cartão tem filtro próprio no modo de edição.

**URL:**
- [My Tasks page (formerly Home)](https://help.clickup.com/hc/en-us/articles/18944788880791-My-Tasks-page-formerly-Home)
- [Intro to ClickUp 4.0](https://help.clickup.com/hc/en-us/articles/12157360089495)
- [Use Page views](https://help.clickup.com/hc/en-us/articles/6310347914263-Use-Page-views)
- [Add an Embed view](https://help.clickup.com/hc/en-us/articles/6310077597335-Add-an-Embed-view)
- [Drill-down view for Dashboard cards](https://help.clickup.com/hc/en-us/articles/14995002699927-Drill-down-view-for-Dashboard-cards)
- [Quick card settings](https://help.clickup.com/hc/en-us/articles/29783428507415-Quick-card-settings)

**O que serve:**
- O aviso de iframe bloqueado vai para a Página externa, com a opção "Abrir em nova aba" no lugar.
- O drill-down com colunas liga o Painel à tabela nova: clicar no número abre os itens.
- "(formerly Home)" é o modelo para "Minhas requisições (antes em Telas)" durante a convivência com o legado.

**O que não serve:**
- My Tasks fica no segundo painel da Home, e os usuários pedem a tela na navegação global ([pedido](https://feedback.clickup.com/feature-requests/p/add-inbox-my-tasks-to-global-navigation)). No ENSPACE, o módulo Requisições fica no primeiro nível do menu.
- Embed como visualização dentro de uma lista não cabe no ENSPACE, onde a Página externa é item de menu próprio.

Print: não capturado nesta rodada; a pesquisa foi feita por documentação oficial (URL acima).

### 4. monday.com

**Liga-se a:** Painel, Documentos, Página externa e Minhas requisições.

**Como resolve, em passos:**

1. "My Work" reúne todo item em que a pessoa está num campo de pessoa, na conta inteira, em 6 grupos de data fixos (Past dates, Today, This week, Next Week, Later, Without a date).
2. O painel tem filtro global no canto de cima à direita, com filtros rápidos (quadro, grupo, coluna) e avançados, e cada widget tem o próprio funil.
3. O painel declara os limites: até 30 widgets, 20.000 itens somados e de 1 a 50 quadros conectados, conforme o plano.
4. O "Files Gallery" é visualização de quadro e widget de painel: lê as colunas de arquivo do item, alterna grade e lista e escolhe se inclui arquivos das atualizações.
5. O widget "Embed Everything" põe conteúdo de fora dentro do painel.
6. No monday service, o solicitante acompanha o que abriu em "My Tickets", comenta e vê o status mudar.

**URL:**
- [My Work](https://support.monday.com/hc/en-us/articles/360019300579-My-Work)
- [Filters on your Dashboard](https://support.monday.com/hc/en-us/articles/26236621618578-Filters-on-your-Dashboard)
- [The Dashboards](https://support.monday.com/hc/en-us/articles/360002187819-The-Dashboards)
- [The Files Gallery View](https://support.monday.com/hc/en-us/articles/360001264249-The-Files-Gallery-View)
- [The "Embed Everything" Widget](https://support.monday.com/hc/en-us/articles/360002383219-The-Embed-Everything-Widget)
- ["My tickets" on monday service](https://support.monday.com/hc/en-us/articles/24058038904594--My-tickets-on-monday-service)

**O que serve:**
- Filtro em 2 níveis com limite escrito é o mínimo do Painel novo.
- O Files Gallery é o desenho de Documentos: arquivo ligado ao item de origem, em grade ou lista.
- "My Tickets" confirma Minhas requisições como tela do solicitante, com status e comentário.

**O que não serve:**
- O monday não documenta ação em lote no My Work; a seleção múltipla é a do quadro. Não serve de modelo para o lote da Fila de tarefas.
- O Files Gallery não mostra arquivo de nuvem (Drive, Dropbox). Documentos do ENSPACE lista os arquivos que os fluxos geram, e o filtro por origem do monday não se aplica.
- Os 6 grupos fixos por data são de tarefa pessoal; a Lista de itens agrupa pelo que o admin escolhe.

Print: não capturado nesta rodada; a pesquisa foi feita por documentação oficial (URL acima).

### 5. Pipefy

**Liga-se a:** módulo Requisições (as 3 entradas) e Fila de tarefas.

**Como resolve, em passos:**

1. A barra do topo tem 2 entradas fixas para o solicitante: "Portals", para abrir pedido, e "Tasks & Requests", para acompanhar.
2. "Tasks & Requests" junta o que a pessoa pediu e o que espera ação dela, com abas Pending e Done, filtro por pipe, busca por título e contador de pendências ao lado do botão.
3. O admin monta o Portal em páginas por área (TI, RH, reembolso), com "+ Add Page", nome, descrição e capa; cada página recebe texto, formulário, link externo, imagem, vídeo e divisor.
4. O acesso ao portal tem 3 níveis: membros escolhidos, a empresa toda ou qualquer pessoa com o link.
5. O formulário segue a permissão do pipe: formulário restrito só aparece para quem já pode abri-lo. A busca central acha formulário fora do portal, com a mesma regra.
6. A tarefa de aprovação chega em "Tasks & Requests" ou por e-mail; a pessoa preenche e envia, 1 por vez.
7. O portal antigo saiu em 2 levas de 50% das contas, com 1 guia para o admin e outro para o solicitante.

**URL:**
- [How to set up the new portal](https://help.pipefy.com/en/articles/9113800-how-to-set-up-the-new-portal)
- [What are tasks](https://help.pipefy.com/en/articles/7039271-what-are-tasks)
- [For guests: create and track requests](https://help.pipefy.com/en/articles/8218127-how-to-create-and-keep-track-of-your-requests-in-pipefy)
- [Migração, guia do admin](https://help.pipefy.com/en/articles/9722026-migration-to-the-new-request-portal-guide-for-administrators) e [guia do solicitante](https://help.pipefy.com/en/articles/9740059-migration-to-the-new-request-portal-a-guide-for-requesters)

**O que serve:**
- Abrir e acompanhar no mesmo módulo: Abrir requisição e Minhas requisições ficam lado a lado.
- O catálogo por área, com o formulário restrito escondido de quem não pode abrir, é o desenho de Abrir requisição.
- O contador de pendências no item do menu vai para o módulo Requisições.
- O desligamento em levas, com 2 guias, entra no plano de aposentar os tipos legados.

**O que não serve:**
- Juntar "o que eu pedi" e "o que espera ação minha" numa lista só mistura Minhas requisições com Triagem. No ENSPACE, quem pede e quem responde são pessoas diferentes, e as 2 abas ficam separadas.
- A aprovação 1 a 1 não cobre a execução em massa que o ENSPACE já tem na Fila de tarefas.
- O portal aberto a qualquer pessoa com o link não entra: o módulo Requisições é para membro do workspace.

Print: não capturado nesta rodada; a pesquisa foi feita por documentação oficial (URL acima).

## As extras

### 6. Airtable (Interfaces e Record review)

**Liga-se a:** Lista de itens, Triagem e Painel.

**Como resolve, em passos:**

1. O Interface Designer oferece layouts por forma: List, Gallery, Kanban, Calendar, Timeline e Grid; depois Overview, Form, Dashboard, Record review e Record detail.
2. Todo layout tem os mesmos grupos de configuração: Data (tabela, Filter by, Sort by, Group by), User filters, User actions e Advanced.
3. O "Filter by" da página oferece All records, Specific records e **Viewer's records**; a última exige um campo de usuário e não vale em página pública.
4. O filtro do construtor vence o filtro do usuário final.
5. O Record review mostra a lista à esquerda (título, até 2 campos de prévia, cor por condição) e o detalhe à direita, com comentários, histórico e botões de ação.
6. O painel tem grupos; cada grupo lê 1 tabela, tem filtro próprio, e cada elemento tem filtro também. "Click to see underlying records" abre um painel lateral com os registros do número.
7. O construtor por elementos soltos (Blank) virou legado: fica em "More", não recebe recurso novo e a doc lista o que falta nele.

**URL:**
- [Getting started with Interface Designer](https://support.airtable.com/articles/8078126534-getting-started-with-airtable-interface-designer)
- [Record review](https://support.airtable.com/articles/4384405105-airtable-interface-layout-record-review)
- [Filtering records using conditions](https://support.airtable.com/articles/9290731839-filtering-records-using-conditions)
- [Dashboard layout](https://support.airtable.com/docs/interface-layout-dashboard)
- [Legacy Interface Designer functionality](https://support.airtable.com/articles/9769453548-legacy-interface-designer-functionality)

**O que serve:**
- O mesmo painel de configuração para todo tipo vira a regra do Criar menu: categoria, visualização, escopo e colunas no mesmo lugar, em todo tipo.
- "Viewer's records" no primeiro nível do filtro é o mesmo desenho do "Me" do Twenty: o escopo é opção, não tipo.
- O Record review é a base da aba Triagem: lista e detalhe, com o botão de decisão no detalhe.
- O Blank como legado é o caminho de Telas Personalizadas: criação escondida, tela antiga abrindo, lista do que falta.

**O que não serve:**
- O Record review não tem lote nem atalho de teclado documentados, e os pedidos de edição em massa no fórum seguem sem resposta. A Triagem precisa dos 2.
- O painel sem filtro único para todos os grupos fica abaixo do monday e do ClickUp.

Print: não capturado nesta rodada; a pesquisa foi feita por documentação oficial (URL acima).

### 7. Fluig (Central de Tarefas e Movimentar em bloco)

**Liga-se a:** Fila de tarefas e Minhas requisições.

**Como resolve, em passos:**

1. A Central de Tarefas lista as tarefas em que a pessoa é solicitante, responsável, gestor, autor ou aprovador.
2. As abas separam o recorte: resumo, tarefas a concluir, tarefas em pool (fila do grupo), tarefas em consenso e "Minhas solicitações".
3. O usuário comum vê só as solicitações que abriu, de que participou ou que são públicas.
4. Em "Tarefas a concluir", ao marcar 1 tarefa aparece "Movimentar em bloco", com o total selecionado.
5. O lote exige premissas: a próxima atividade vale para todas as tarefas marcadas.
6. No celular, o lote abre com toque longo na tarefa.

**URL:**
- [Central de Tarefas (TOTVS TDN)](https://tdn.totvs.com/x/V3A0E)
- [Tarefas a concluir e Movimentar em bloco](https://tdn.totvs.com/pages/releaseview.action?pageId=233763380)
- [Central de tarefas no My Fluig](https://tdn.totvs.com/pages/releaseview.action?pageId=574682610)

**O que serve:**
- O lote com trava (mesma próxima atividade) e o total no botão viram a regra da Fila de tarefas: só tarefas da mesma etapa, botão com o número marcado, processa só as marcadas.
- A fila do grupo como aba é o escopo "Minhas e do meu grupo" da Fila de tarefas, e não um tipo à parte.
- "Minhas solicitações" ao lado das tarefas confirma as 2 listas como telas fixas de quem usa.

**O que não serve:**
- A Central junta tarefas e solicitações numa tela só. No ENSPACE, Minhas requisições mora no módulo Requisições, e a Fila de tarefas é item de menu configurado pelo admin.
- A aba "tarefas em consenso" não tem par no fluxo do ENSPACE.

Print: não capturado nesta rodada; a pesquisa foi feita por documentação oficial (URL acima).

### 8. Jira Service Management (portal, filas e aprovação)

**Liga-se a:** módulo Requisições (Minhas requisições e Triagem) e Fila de tarefas.

**Como resolve, em passos:**

1. A fila é a tela nativa do agente: lista definida por condição, com transição e aprovação em lote a partir dela.
2. A fila nativa "Requires my approval" lista os pedidos que esperam o agente; ele marca todos ou alguns, clica Approve na barra de ação e confirma.
3. No portal, o solicitante logado abre "Requests" no canto de cima à direita, com 3 vistas: Approvals, My requests e All requests.
4. O solicitante filtra por status, tipo de pedido e quem criou; o pedido só aparece para quem criou ou foi incluído como participante.
5. O aprovador recebe e-mail com link para o portal, abre o pedido e aprova ou recusa.
6. O lote para aprovador do portal, que não é agente, vem de app de terceiro no Marketplace.

**URL:**
- [Manage incoming requests with queues](https://support.atlassian.com/jira-service-desk-cloud/docs/manage-your-incoming-requests-with-queues/)
- [Transition multiple requests at the same time](https://support.atlassian.com/jira-service-management-cloud/docs/transition-multiple-requests-at-the-same-time/)
- [View requests in the help center (doc Server)](https://confluence.atlassian.com/servicemanagementserver/view-requests-in-the-help-center-968670099.html)
- [Approving a service project request](https://confluence.atlassian.com/jirasoftwarecloud/approving-a-service-project-request-826883713.html)
- [Bulk Approvals for JSM (Marketplace)](https://marketplace.atlassian.com/apps/1225095/bulk-approvals-for-jira-service-management)

**O que serve:**
- As 3 vistas do portal separam o que eu pedi (My requests) do que espera minha decisão (Approvals). É a divisão entre Minhas requisições e Triagem.
- "Requires my approval" com seleção e barra de ação é o desenho da aprovação em lote na Triagem.
- A regra de visibilidade (criou ou participa) é a regra de Minhas requisições, escrita na tela.

**O que não serve:**
- Portal e fila são produtos separados, com público separado (cliente e agente). No ENSPACE, o mesmo membro pede e responde no mesmo módulo.
- A doc do portal que descreve as 3 vistas é da versão Server; a vista Cloud não foi confirmada nesta rodada.

Print: não capturado nesta rodada; a pesquisa foi feita por documentação oficial (URL acima).

### 9. Smartsheet WorkApps

**Liga-se a:** Página externa e Painel.

**Como resolve, em passos:**

1. O builder monta um app sem código com até 50 páginas: sheets, reports, forms, dashboards e conteúdo externo (Tableau, Google Docs).
2. Toda página nasce oculta para todos os papéis.
3. O builder cria papéis e define por página: Viewer, Hidden ou Editor.
4. O papel dá acesso a um report mesmo para quem não tem o compartilhamento dele; essa pessoa só vê o report dentro do app.
5. O app compartilhado aparece na página inicial de WorkApps, no filtro "Shared with you".

**URL:**
- [WorkApps overview](https://help.smartsheet.com/articles/2481969-workapps-by-smartsheet)
- [Add pages](https://help.smartsheet.com/articles/2482192-add-smartsheet-content-to-your-workapp)
- [Add roles](https://help.smartsheet.com/articles/2482193-add-roles-to-workapps)

**O que serve:**
- A página externa como página do app, ao lado das outras, confirma Página externa como tipo de menu.
- Página oculta até o admin liberar é o padrão para um tipo novo publicado no menu.

**O que não serve:**
- O app de páginas livres é outro produto, com plano próprio (Enterprise e Advanced Work Management). Telas Personalizadas não vira página livre; vira Lista de itens.
- O papel que abre um report sem o compartilhamento dele contraria a regra do ENSPACE: a tela respeita a permissão de quem vê.

Print: não capturado nesta rodada; a pesquisa foi feita por documentação oficial (URL acima).

## O padrão que todos seguem

- **Tipo é forma de exibição; recorte é parâmetro.** Nenhum dos 9 tem tipo de tela que muda só o escopo. "Meus itens" é opção de filtro: "Me" no Twenty, "Viewer's records" no Airtable, aba de pool no Fluig.
- **Tela de trabalho pessoal é fixa e ninguém cadastra.** My Tasks no ClickUp, My Work no monday, Tasks & Requests no Pipefy, Central de Tarefas no Fluig, Requests no portal do JSM. É o lugar do módulo Requisições no menu.
- **Abrir pedido e acompanhar pedido moram juntos.** Pipefy, JSM e monday service põem as 2 entradas lado a lado.
- **Formulário restrito some para quem não pode abrir.** Pipefy e JSM aplicam a permissão do processo ao catálogo.
- **Painel com filtro do widget e clique que abre os itens.** monday, ClickUp, Airtable e Notion têm os 2 níveis de filtro; o Twenty tem só o do widget, e a própria doc registra a falta.
- **Embed é visualização ou widget, com saída para nova aba.** ClickUp, monday, Twenty e Smartsheet. Nenhum tem tipo só para redirecionar, o que sustenta o fim do Customizado.
- **Arquivo se ancora no item.** O Files Gallery do monday lê as colunas de arquivo do item; o Airtable mostra o anexo como capa do registro.
- **Filtro de tela não é permissão.** O Twenty separa visualização de "Row-Level"; o Notion avisa que filtro por coluna oculta pode não abrir.
- **O legado sai devagar.** O Airtable rotula o Blank como legado e esconde a criação; o Pipefy desliga em 2 levas; o ClickUp mantém "(formerly Home)" no título.

Divergir de qualquer item acima pede motivo escrito no `DECISOES.md`.

## O que nenhum deles faz

- **Lote com trava na triagem do solicitante.** Só o Fluig e a fila do agente no JSM documentam lote, e nenhum dos 2 junta lote, atalho de teclado e resultado por item numa fila de aprovação de pedidos. O ENSPACE já tem a execução em massa nas Tarefas: a Fila de tarefas e a Triagem expõem esse recurso com trava (mesma etapa), contador e resultado de cada item.
- **Converter a tela antiga no lugar.** Airtable, Pipefy e Atlassian mantêm a tela antiga ou pedem que o admin refaça. Nenhum leva o menu, a posição, os grupos permitidos e o escopo para o tipo novo, com a lista do que não converteu. É o diferencial da migração dos 13 tipos.
- **Escrever o recorte ativo na tela.** Nenhum dos 9 mostra, no topo da lista, o escopo e o período que estão valendo ("Mostrando: apenas meus itens"; "Mostrando os últimos 30 dias: 12 itens ocultos"). O Twenty e o Airtable gravam o escopo no filtro, mas quem abre a tela não lê a regra.
- **Dizer no Criar menu que o escopo não protege o dado.** As referências separam filtro e permissão em telas diferentes, e nenhuma avisa no momento de configurar. O Criar menu do ENSPACE escreve isso junto do campo Escopo.
- **Documentos que reúne arquivo gerado por fluxo.** Os 9 listam anexo de item. Nenhum lista, num lugar só, o arquivo que a automação gerou, com o link para o item de origem.

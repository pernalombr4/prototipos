# Visualizações salvas acima da tabela: produtos de dados, CRM e gestão de trabalho

Pesquisa feita em 2026-10-23 para o redesenho da barra de "visualizações personalizadas" da tela de itens do ENSPACE. Escopo: só padrão de interação (forma, gesto, estado), sem marca, cor ou texto.

Produtos: Airtable, Linear, Attio, Asana, Jira, Baserow, NocoDB, Smartsheet, HubSpot, Salesforce e GitHub Projects.

Legenda de confiança:
- sem marca: lido na página oficial citada;
- "(busca)": veio do resumo do buscador sobre a página citada, sem leitura da página inteira;
- "(terceiro)": guia de terceiro ou fórum, pode descrever interface antiga;
- "não confirmado": nenhuma fonte lida confirma.

Fontes que não abriram:
- help.salesforce.com (página de carregamento com "CSS Error", também pelo r.jina.ai);
- trailhead.salesforce.com (404 na leitura direta);
- artigo de filtros do help.smartsheet.com (404);
- help.asana.com: o artigo de visualizações salvas é só um vídeo, sem texto.

## 1. Forma da barra: abas, pílulas, menu suspenso ou barra lateral; estado ativo; ícone por tipo; contagem de registros

### Takeaway
Há 3 formas:
- **abas horizontais:** HubSpot, GitHub Projects, Asana e as visualizações de equipe do Linear;
- **menu suspenso preso ao nome da visualização atual:** Attio, Baserow e Salesforce;
- **barra lateral com lista:** Airtable e NocoDB.

Nenhuma fonte lida mostra contagem de registros na aba ou no item da lista.

### Cited Findings
- **HubSpot:** cada visualização aberta é uma aba na página de índice do objeto (ex.: Contatos), com um ícone "+ add view" ao lado. — [HubSpot KB, create and manage saved views](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **HubSpot:** ao criar, escolhe-se o tipo da visualização (ex.: quadro, gantt); a página não descreve ícone por tipo na aba. — [HubSpot KB](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **HubSpot:** existem 2 layouts da página de índice; um vale para contas Free e Starter criadas depois de 30/03/2026 (busca). — [HubSpot KB, updated index page](https://knowledge.hubspot.com/records/manage-saved-views-in-the-updated-index-page)
- **GitHub Projects:** cada visualização salva fica numa aba própria; o botão "New view" fica à direita das abas. — [GitHub Docs, managing your views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- **Airtable:** as visualizações ficam numa barra lateral; o ícone de 3 barras horizontais abre a barra se estiver fechada. — [Airtable Support, getting started with views](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Airtable:** o clique no nome abre a visualização. — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Airtable:** tipos disponíveis: grade (padrão), formulário, calendário, galeria, kanban, linha do tempo, lista e gantt; a página não descreve os ícones. — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Airtable:** a barra lateral tem seções fixas no topo, "My favorites" e "My personal views", e seções criadas pelo usuário (planos pagos). — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Attio:** troca-se de visualização clicando no nome da atual, que abre um menu suspenso com a lista. — [Attio Help, create and manage table views](https://attio.com/help/reference/managing-your-data/views/create-and-manage-table-views)
- **Baserow:** o seletor é um menu suspenso no nome da visualização atual, no topo da tabela; numa tabela nova mostra "≡ Grid", com o ícone do tipo antes do nome. — [Baserow docs, create custom views](https://baserow.io/user-docs/create-custom-views-of-your-data)
- **Baserow:** a lista mostra as visualizações colaborativas mais as pessoais do próprio usuário. — [Baserow docs, overview of views](https://baserow.io/user-docs/overview-of-baserow-views)
- **NocoDB:** as visualizações ficam na barra lateral esquerda; cada uma tem um ícone à esquerda do nome, que o usuário troca clicando nele. — [NocoDB docs, actions on view](https://nocodb.com/docs/product-docs/views/actions-on-view)
- **NocoDB:** a visualização travada leva um ícone de cadeado na barra lateral; a pessoal, um ícone de usuário. — [NocoDB docs](https://nocodb.com/docs/product-docs/views/actions-on-view)
- **NocoDB:** a descrição da visualização aparece ao passar o mouse num ícone "info" ao lado do nome. — [NocoDB docs](https://nocodb.com/docs/product-docs/views/actions-on-view)
- **Linear:** as visualizações ligadas a uma equipe aparecem ao lado das padrão (All Issues, Active, Backlog) nas seções Issues e Projects da equipe. — [Linear Docs, custom views](https://linear.app/docs/custom-views)
- **Linear:** as visualizações de workspace ficam na página Views da barra lateral; as favoritas, na própria barra lateral. — [Linear Docs](https://linear.app/docs/custom-views)
- **Linear:** a página Views mostra o dono de cada visualização. — [Linear Docs](https://linear.app/docs/custom-views)
- **Asana:** visualização salva é uma aba do projeto (lista, quadro, calendário, linha do tempo); dá para ter várias abas do mesmo tipo. Anúncio de 26/07/2023. — [Fórum Asana, anúncio oficial](https://forum.asana.com/t/surface-the-most-relevant-information-by-saving-views-for-you-and-your-team/489251); [Fórum Asana, post de parceiro](https://forum.asana.com/t/the-1-game-changing-asana-feature-of-the-year-saved-view-tabs/616716) (terceiro)
- **Salesforce:** o seletor de list view é um menu suspenso no título da lista; sem lista fixada, ele abre em "Recently Viewed" (busca). — [Trailhead, work with list views](https://trailhead.salesforce.com/en/modules/lightning-experience-for-salesforce-classic-users/units/work-with-list-views)
- **Smartsheet:** filtro salvo é escolhido num menu suspenso aberto pelo botão "Filter" da barra de ferramentas; tabela, quadro e linha do tempo dividem os mesmos filtros. — [Smartsheet Help, filter your data](https://help.smartsheet.com/articles/2483528-filter-your-data-table-board-and-timeline-view)
- **Smartsheet:** filtro ativo põe um ícone no cabeçalho de cada coluna filtrada. — [Smartsheet Help](https://help.smartsheet.com/articles/2483528-filter-your-data-table-board-and-timeline-view)
- **Jira Cloud:** visualizações salvas existem em List e Timeline do espaço; a página oficial não diz se aparecem como aba ou menu suspenso. — [Atlassian Support, save and share views](https://support.atlassian.com/jira-software-cloud/docs/save-and-share-views-from-your-list/)
- **Jira, filtros salvos (modelo antigo):** a estrela marca o filtro como favorito; os favoritos aparecem em Issues > Filters e no painel esquerdo do navegador de issues (doc de versão Server/antiga). — [Atlassian, Using Filters](https://confluence.atlassian.com/display/JIRA/Using+Filters)

### Inferences
- Menu suspenso no nome da visualização (Attio, Baserow, Salesforce) cabe numa linha e cresce sem limite, mas esconde as outras visualizações.
- Aba (HubSpot, GitHub, Asana) deixa as visualizações à vista, ao custo do problema de transbordo (seção 2).
- Ícone por tipo está documentado em Baserow e NocoDB; em NocoDB o ícone é escolhido pelo usuário.
- Ícone de estado (cadeado, usuário) na própria lista aparece em NocoDB.

### Gaps
- Contagem de registros por visualização: não confirmado em nenhum produto.
- Estilo do estado ativo (sublinhado, fundo): nenhuma página oficial descreve; só print ou teste de tela confirma.
- Ícones por tipo em Airtable, HubSpot e GitHub: não confirmado nas páginas lidas.

## 2. Transbordo: nome longo, menu "+N", busca na lista, limite de abas, visualização ativa sempre visível

### Takeaway
O HubSpot é o único com limite publicado:
- até 5 abas abertas ficam fixas na página;
- abrir a 6ª fecha uma aba automaticamente;
- as demais visualizações se reabrem pelo "+ add view", com busca.

Busca dentro da lista de visualizações está documentada no HubSpot, no Baserow e no Linear (atalho O, V). Truncamento de nome longo não aparece em nenhuma página oficial lida.

### Cited Findings
- **HubSpot:** "up to 5 tabs automatically remain pinned on the index page unless you close them"; abrindo uma 6ª, a página diz que "the 6th will be automatically closed". — [HubSpot KB, updated index page](https://knowledge.hubspot.com/records/manage-saved-views-in-the-updated-index-page); [HubSpot KB, create and manage](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **HubSpot:** para abrir uma visualização que não está em aba, clica-se em "+ add view" > "Add view" e busca-se pelo nome. — [HubSpot KB](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **HubSpot:** fechar a aba (nome > X) esconde a visualização sem apagá-la; ela volta pelo mesmo pop-up. — [HubSpot KB](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **HubSpot:** uma página "All views" para reabrir visualizações aparece no resumo do buscador (busca); as 2 páginas lidas não a descrevem. — [HubSpot KB, updated index page](https://knowledge.hubspot.com/records/manage-saved-views-in-the-updated-index-page)
- **Baserow:** o menu suspenso lista as visualizações e filtra pelo nome enquanto se digita. — [Baserow docs, overview](https://baserow.io/user-docs/overview-of-baserow-views)
- **Linear:** O seguido de V abre a busca de visualizações. — [Linear Docs, custom views](https://linear.app/docs/custom-views)
- **Airtable:** Ctrl+Shift+K (Cmd+Shift+K no Mac) abre o seletor de visualizações da base. — [Airtable Support, keyboard shortcuts](https://support.airtable.com/docs/airtable-keyboard-shortcuts)
- **Airtable:** numa tabela com mais de 20 visualizações, a visualização nova ou duplicada nasce pessoal, não colaborativa. — [Airtable Support, getting started with views](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Asana:** o anúncio de 2023 permite "up to 50 tabs per project". — [Fórum Asana, anúncio oficial](https://forum.asana.com/t/surface-the-most-relevant-information-by-saving-views-for-you-and-your-team/489251)
- **Jira Cloud:** limite de 10 visualizações nomeadas por espaço, em List ou Timeline (terceiro); a página oficial não traz limite. — [jimiwikman.se](https://jimiwikman.se/atlassian/atlassian-resources/atlassian-app-updates/save-and-share-views-from-the-list-r1175/); [Atlassian Support](https://support.atlassian.com/jira-software-cloud/docs/save-and-share-views-from-your-list/)

### Inferences
- O HubSpot separa visualizações existentes de visualizações abertas: a barra mostra um subconjunto curto, escolhido pelo usuário, e o catálogo completo fica atrás de um "+" com busca.
- Esse é o único modelo documentado que limita a barra sem esconder visualização atrás de um "+N".
- A regra do Airtable (acima de 20 visualizações, a nova nasce pessoal) é uma trava contra o acúmulo de visualizações compartilhadas.

### Gaps
- Largura máxima, reticências e tooltip em nome longo: não confirmado em nenhum produto.
- Menu "+N" ou "More views" no fim da barra de abas: não confirmado em GitHub, Asana ou HubSpot.
- Se a visualização ativa fica sempre visível quando a barra transborda: não confirmado.
- Qual aba o HubSpot fecha ao abrir a 6ª (a mais antiga, a mais à direita?): não confirmado.

## 3. Reordenar por arrasto; ordem pessoal ou compartilhada

### Takeaway
Arrastar a aba ou o item da lista é o gesto documentado para reordenar (HubSpot, GitHub, Airtable em seções).

No HubSpot, arrastar para a 1ª posição também define a visualização padrão. Nenhuma fonte diz com clareza se a ordem é por pessoa ou da equipe; no Jira, só o admin do espaço reordena.

### Cited Findings
- **HubSpot:** clicar e arrastar a aba muda a posição; arrastar para a extremidade esquerda torna aquela a visualização padrão. — [HubSpot KB, create and manage](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **GitHub Projects:** clicar e arrastar a aba muda a posição; a nova ordem salva sozinha. — [GitHub Docs, managing your views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- **Airtable:** arrastam-se as seções e as visualizações para dentro de uma seção criada pelo usuário; "My favorites" e "My personal views" ficam sempre no topo. — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Jira Cloud:** só o admin do espaço renomeia ou reordena uma visualização salva. — [Atlassian Support](https://support.atlassian.com/jira-software-cloud/docs/save-and-share-views-from-your-list/)
- **NocoDB:** a página cita que editores reordenam visualizações travadas "in the sidebar", sem detalhar o gesto. — [NocoDB docs, actions on view](https://nocodb.com/docs/product-docs/views/actions-on-view)

### Inferences
- No HubSpot, a ordem das abas abertas e a escolha do padrão parecem ser do usuário, porque cada pessoa abre e fecha as próprias abas. Hipótese: a página não diz o escopo.
- Juntar "reordenar" com "definir padrão" num gesto só (HubSpot) dispensa um item de menu, mas o efeito não se vê.

### Gaps
- Escopo da ordem (pessoal ou de todos) em GitHub, HubSpot, Airtable e Asana: não confirmado.
- Reordenar no Baserow, no Attio e no Salesforce: não confirmado.

## 4. Criar: cliques, popover, modal ou página; tipo ou nome primeiro; herda os filtros atuais; nome padrão

### Takeaway
2 caminhos:
- **criar do zero pelo "+"**, quase sempre na ordem tipo, nome e (às vezes) visibilidade, num popover ou modal pequeno: Airtable, Baserow, HubSpot, Attio, NocoDB;
- **salvar como nova a partir do estado atual**, herdando filtro e ordenação: Attio "Save as new view", Linear Option/Alt+V, Smartsheet "Save filter", Jira "Save as", HubSpot "clone to new view".

### Cited Findings
- **Airtable:** "+ Create new…" > tipo > nome e escolha entre Collaborative, Personal ou Locked > "Create new view". — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Airtable:** a visualização nova nasce colaborativa; acima de 20 visualizações na tabela, nasce pessoal. — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Baserow:** menu suspenso > tipo (seção de baixo do menu) > permissão (Collaborative ou Personal) > nome único > "Create view". — [Baserow docs, create custom views](https://baserow.io/user-docs/create-custom-views-of-your-data)
- **HubSpot:** "+ add view" > tipo > nome > ícone de confirmar.
- **HubSpot:** em seguida, configuram-se filtros e colunas, e "Publish" no canto inferior direito grava a visualização.
- **HubSpot:** a página não diz se a visualização nova herda os filtros da atual. — [HubSpot KB, create and manage](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **HubSpot:** "clone to new view" (canto inferior direito) > nome > confirmar copia a visualização aberta. — [HubSpot KB](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **Attio:** nome da visualização > "+ Create new" > Table > título > "Confirm". — [Attio Help, table views](https://attio.com/help/reference/managing-your-data/views/create-and-manage-table-views)
- **Attio:** com filtro ou ordenação alterados, a seta ao lado de "Save for everyone" (ou "Save", na ordenação) leva a "Save as new view", que cria outra visualização com as mudanças. — [Attio Help, filter and sort views](https://attio.com/help/reference/managing-your-data/views/filter-and-sort-views)
- **GitHub Projects:** "New view" cria e salva a visualização na hora; a página não diz o nome padrão. — [GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- **Linear, 3 caminhos:** — [Linear Docs, custom views](https://linear.app/docs/custom-views)
  - do zero: Views > tipo (Issue, Project, Initiative) > "New view";
  - a partir de uma lista ou quadro com pelo menos 1 filtro: Option/Alt+V ou o ícone "Save view" ao lado de Display Options;
  - a partir das seções Issues ou Projects de uma equipe, ligada a ela.
- **NocoDB:** o modal de criação tem "Add Description". — [NocoDB docs, actions on view](https://nocodb.com/docs/product-docs/views/actions-on-view)
- **Smartsheet:** "Filter" > menu de filtros salvos > "New saved filter" > nome > "Just me" ou "Shared" > critérios > "Save". — [Smartsheet Help](https://help.smartsheet.com/articles/2483528-filter-your-data-table-board-and-timeline-view)
- **Smartsheet:** com um filtro salvo aplicado, "+ Add a filter" soma critérios temporários; "Save filter" transforma o conjunto num filtro salvo novo. — [Smartsheet Help](https://help.smartsheet.com/articles/2483528-filter-your-data-table-board-and-timeline-view)
- **Jira (doc antiga):** roda-se a busca, clica-se em "Save as" acima dos resultados e dá-se nome no diálogo "Save Filter". — [Atlassian, Using Filters](https://confluence.atlassian.com/display/JIRA/Using+Filters)
- **Jira (doc antiga):** num filtro existente, "Save > Save as" cria um filtro novo. — [Atlassian, Using Filters](https://confluence.atlassian.com/display/JIRA/Using+Filters)
- **Jira Cloud:** em List, ajustam-se filtro, agrupamento e colunas, e depois ícone "Save or reset view settings" > "Save list"; exige permissão de admin do espaço. — [Atlassian Support](https://support.atlassian.com/jira-software-cloud/docs/save-and-share-views-from-your-list/)
- **Salesforce:** menu List View Controls (engrenagem ao lado da busca) > "New" > nome > visibilidade ("Only I can see this view", "All users can see this view", "Share with groups") > condições no painel Filters > "Save" (terceiro). — [Xappex](https://www.xappex.com/blog/how-to-create-a-list-view-in-salesforce/)
- **Asana:** com filtro aplicado, o menu ao lado de "Save view" tem "Save as a new tab" (terceiro). — [Guideflow, Asana](https://www.guideflow.com/tutorial/how-to-create-a-saved-tab-in-a-project-in-asana)
- **Asana:** outro caminho é clicar de novo na aba List, "Make a copy" e renomear (comunidade, citado na busca). — [Fórum Asana, post de parceiro](https://forum.asana.com/t/the-1-game-changing-asana-feature-of-the-year-saved-view-tabs/616716)
- **Smartsheet Dynamic View:** "Save as New" fica no canto superior direito de Settings, só para o dono; a cópia não leva o compartilhamento (comunidade, citado no resumo da busca; o tópico exato não foi aberto). — [UMBC FAQ, dynamic view](https://umbc.atlassian.net/wiki/spaces/faq/pages/443252753/How+do+I+create+a+Smartsheet+dynamic+view)

### Inferences
- Do zero, a ordem é quase sempre tipo primeiro, depois nome (Airtable, Baserow, HubSpot, Attio).
- A visibilidade aparece no mesmo passo em Airtable, Baserow e Salesforce, e depois em HubSpot ("Manage sharing").
- O caminho mais curto para a pessoa que já filtrou é "salvar como nova" a partir do estado atual. Attio e Linear põem isso junto do botão de salvar ou num atalho.

### Gaps
- Nome padrão da visualização nova: não confirmado em nenhum produto, exceto a cópia do NocoDB ("<nome> copy", seção 5).
- Se "+ Create new" do Airtable, do Baserow e do HubSpot herda o filtro da visualização aberta: não confirmado.

## 5. Editar: renomear, menu de contexto, painel de colunas, filtros e ordenação; ordenação em vários níveis

### Takeaway
O menu da visualização fica:
- no "…" ao lado do nome: Airtable, Baserow, NocoDB, Linear;
- numa engrenagem perto da busca: GitHub, Salesforce;
- num painel de configuração lateral: HubSpot.

Itens comuns: renomear, duplicar, apagar, favoritar e copiar link. Colunas se escolhem por caixa de seleção num modal ou painel, com arrasto para reordenar.

Ordenação em vários níveis com arrasto: Attio. GitHub documenta só 2 níveis.

### Cited Findings
- **Airtable, menu "…":** "Rename view", "Duplicate view", "Add to 'My favorites'" (planos pagos), "Delete view". — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Airtable:** a seta ao lado do nome troca o tipo de permissão entre Collaborative, Personal e Locked. — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Airtable:** travar e destravar exige Owner ou Creator. — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **NocoDB, menu "…":** Rename (digita e Enter), "Duplicate view" (copia na hora, sem confirmação, com o nome "<nome> copy"), Delete (confirmação "Delete View"; não se desfaz), troca de permissão (Collaborative, Locked, Personal), "Edit Description". — [NocoDB docs, actions on view](https://nocodb.com/docs/product-docs/views/actions-on-view)
- **NocoDB:** "Copy another view's configuration", no "⋮" da barra de ferramentas, copia partes escolhidas da configuração de outra visualização (planos pagos). — [NocoDB docs](https://nocodb.com/docs/product-docs/views/actions-on-view)
- **Baserow, menu "⋮":** "Rename view" e "Duplicate view".
- **Baserow:** a cópia leva filtros, ordenações, campos visíveis e formatação, e fica independente da original. — [Baserow docs](https://baserow.io/user-docs/create-custom-views-of-your-data)
- **GitHub Projects, "View options" (engrenagem ao lado da busca):** "Duplicate view", "Rename view" (digita e Return; salva sozinho), "Delete view". — [GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- **GitHub Projects, campos:** botão "View" > "Configuration" > "Fields" marca e desmarca campos; o menu do cabeçalho tem "Hide field"; arrasta-se o cabeçalho para reordenar. — [GitHub Docs, table layout](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-table-layout)
- **GitHub Projects, ordenação:** "View" > "Sort" > campo; outro campo vira ordenação secundária; clicar de novo inverte a direção; "No sorting" remove.
- **GitHub Projects:** a página documenta só ordenação primária e secundária. — [GitHub Docs, table layout](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-table-layout)
- **HubSpot, painel de configuração (nome > "configure view"):** Name, configurações do tipo, Filters, Sort order, Sharing options (com copiar link), Export, Delete. — [HubSpot KB, updated index page](https://knowledge.hubspot.com/records/manage-saved-views-in-the-updated-index-page)
- **HubSpot, colunas:** ícone "edit columns" na borda direita da tabela abre um diálogo com caixas de seleção; arrasta-se para reordenar, "X" remove, "Apply" grava. — [HubSpot KB](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **Attio, colunas:** "View settings" no canto superior direito > "+ Add column".
- **Attio:** reordena-se arrastando no painel ou o próprio cabeçalho; o menu do cabeçalho tem "Hide attribute", "Move left" e "Move right". — [Attio Help, table views](https://attio.com/help/reference/managing-your-data/views/create-and-manage-table-views)
- **Attio, ordenação em vários níveis:** cada nível novo desempata o anterior, e a alça ":::" reordena os níveis por arrasto.
- **Attio, filtros:** filtros aninhados em grupos E/OU. — [Attio Help, filter and sort](https://attio.com/help/reference/managing-your-data/views/filter-and-sort-views)
- **Linear:** clicar no nome da visualização abre "Edit view…" e "Duplicate view...".
- **Linear:** o menu de 3 pontos tem "Copy view URL"; a estrela favorita. — [Linear Docs, custom views](https://linear.app/docs/custom-views)
- **Linear, "Display options" (Shift+V):** layout lista ou quadro (Cmd/Ctrl+B alterna), agrupamento, subagrupamento, ordenação dentro do grupo e propriedades exibidas. — [Linear Docs, display options](https://linear.app/docs/display-options)
- **Smartsheet:** "Filter" > lápis no filtro permite apagar, renomear, mudar o compartilhamento e editar critérios; um ícone duplica o filtro na linha dele. — [Smartsheet Help](https://help.smartsheet.com/articles/2483528-filter-your-data-table-board-and-timeline-view)
- **Salesforce, menu List View Controls:** Clone, Rename, Sharing Settings, Select Fields to Display, Delete, Reset Column Widths, editar filtros (busca, terceiro). — [Trailhead](https://trailhead.salesforce.com/en/modules/lightning-experience-for-salesforce-classic-users/units/work-with-list-views); [Xappex](https://www.xappex.com/blog/how-to-create-a-list-view-in-salesforce/)
- **Asana:** dá para renomear e remover abas (comunidade). — [Fórum Asana, post de parceiro](https://forum.asana.com/t/the-1-game-changing-asana-feature-of-the-year-saved-view-tabs/616716)

### Inferences
- Menu da visualização no "…" do próprio item é o padrão dos produtos de banco (Airtable, Baserow, NocoDB).
- GitHub e Salesforce põem as ações numa engrenagem fixa da barra, que vale para a visualização ativa.
- Duplicar sem confirmação, com o sufixo "copy" (NocoDB), é o fluxo mais curto documentado.
- Painel lateral único com nome, filtros, ordenação, compartilhamento e apagar (HubSpot) junta numa tela o que outros espalham em menu e popover.

### Gaps
- Renomear com clique duplo na aba: não confirmado em nenhum produto (GitHub e NocoDB documentam só pelo menu).
- "Copy link" no Airtable, no Baserow e no NocoDB: não confirmado nas páginas lidas.
- Ordenação com mais de 2 níveis no GitHub e no HubSpot: não confirmado.

## 6. Mudança não salva: sinal, ações, escopo (privado, equipe, todos) e permissão para editar visualização compartilhada

### Takeaway
3 modelos:
- **marca de não salvo + salvar explícito:** o GitHub mostra um ponto no nome da aba; Attio, Asana, Jira e HubSpot (layout antigo) mostram botão de salvar com "salvar como nova" e descartar ou resetar;
- **mudança pessoal persistente sobre a visualização compartilhada:** HubSpot (filtro grava no perfil do usuário), Linear (Display options persistem para o usuário; "Set as default" vale para todos) e Jira Cloud ("Reset" volta à versão do admin);
- **salvar só por quem tem permissão:** Jira Cloud (admin do espaço), HubSpot (criador ou Super Admin), Airtable e NocoDB (travar: Owner ou Creator).

### Cited Findings
- **GitHub Projects:** ordenar, reordenar, filtrar ou agrupar põe um ponto ao lado do nome da visualização. — [GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- **GitHub Projects:** salva-se em "View options" > "Save changes".
- **GitHub Projects:** quem não quer salvar ignora o ponto, e ninguém mais vê a mudança; a página não cita "Discard". — [GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- **Attio, ações:** "Save for everyone" aplica a todos; a seta ao lado leva a "Save as new view"; "Discard changes" descarta.
- **Attio, sem salvar:** a visualização volta à última versão salva no próximo carregamento, e os colegas não veem a mudança.
- **Attio, permissão:** "anyone with access to a view can change its filters". — [Attio Help, filter and sort](https://attio.com/help/reference/managing-your-data/views/filter-and-sort-views)
- **HubSpot:** filtro mudado numa visualização grava sozinho no perfil do usuário. — [HubSpot KB, updated index page](https://knowledge.hubspot.com/records/manage-saved-views-in-the-updated-index-page)
- **HubSpot:** só Super Admin ou o criador salvam mudanças na visualização; o Super Admin só edita filtros, colunas e ordenação (busca). — [HubSpot KB, create and manage](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **HubSpot (interface possivelmente antiga):** "Save view" abre "Save" (atualiza) ou "Save as new view" (cria cópia com nome e visibilidade); "Reset" cancela as mudanças (terceiro). — [Stream Creative](https://www.streamcreative.com/knowledge/filter-records-hubspot-crm)
- **HubSpot, visibilidade:** Private (padrão; só o dono e Super Admins), Team, Everyone ou Custom, via "Manage sharing". — [HubSpot KB](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **Jira Cloud:** só o admin do espaço salva a versão compartilhada; o membro muda a visualização para uso próprio sem alterar a dos outros; "Reset" volta à versão do admin. — [Atlassian Support](https://support.atlassian.com/jira-software-cloud/docs/save-and-share-views-from-your-list/)
- **Jira (doc antiga):** num filtro existente, "Save > Discard changes" descarta.
- **Jira (doc antiga):** só o dono edita o filtro; filtro compartilhado se clona ou pede-se troca de dono ao admin. — [Atlassian, Using Filters](https://confluence.atlassian.com/display/JIRA/Using+Filters)
- **Linear:** Display options persistem para o usuário ao fechar o menu; "Set as default" aplica a todo o workspace; "Reset to default" volta ao padrão salvo. — [Linear Docs, display options](https://linear.app/docs/display-options)
- **Linear:** filtro na URL é temporário: abrir o link aplica o filtro, mas ele não fica salvo na visualização. — [Linear Docs, custom views](https://linear.app/docs/custom-views)
- **Asana:** mudar coluna, ordenação ou filtro mostra um botão "Save View" no canto superior direito (comunidade). — [Fórum Asana, mudanças que revertem](https://forum.asana.com/t/changes-keep-reverting-back-in-asana-critical-bug-issue/909484)
- **Asana:** mudança não salva se perde ao sair da aba (comunidade).
- **Asana, dor relatada:** usuários acham que o produto "reverte" as mudanças, quando faltou salvar. — [Fórum Asana](https://forum.asana.com/t/changes-keep-reverting-back-in-asana-critical-bug-issue/909484)
- **Airtable:** visualização Locked impede mudança de configuração; travar exige Owner ou Creator; Personal e Locked só em planos pagos. — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **NocoDB:** visualização travada aceita mensagem do motivo; o editor ainda duplica, mas não renomeia, não apaga e não muda a configuração. — [NocoDB docs](https://nocodb.com/docs/product-docs/views/actions-on-view)
- **NocoDB:** a visualização pessoal tem dono, e Creator ou Owner podem transferi-la. — [NocoDB docs](https://nocodb.com/docs/product-docs/views/actions-on-view)
- **Baserow:** visualização colaborativa não vira pessoal; o caminho é duplicar como pessoal. — [Baserow docs](https://baserow.io/user-docs/create-custom-views-of-your-data)
- **Smartsheet:** nomear e salvar filtro exige Editor ou acima; compartilhar filtro, só Owner ou Admin (busca). — [Smartsheet Help](https://help.smartsheet.com/articles/2483528-filter-your-data-table-board-and-timeline-view)
- **Salesforce:** visibilidade escolhida na criação ("Only I can see this view", "All users can see this view", "Share with groups": grupos públicos, papéis, papéis e subordinados), alterável depois (terceiro). — [Xappex](https://www.xappex.com/blog/how-to-create-a-list-view-in-salesforce/)

### Inferences
- O ponto no nome da aba (GitHub) é o sinal mais leve documentado. Attio e Asana dependem do botão de salvar aparecer.
- A dor do Asana mostra o custo de descartar em silêncio ao sair.
- Visualização compartilhada com camada pessoal por cima (Jira Cloud, Linear, HubSpot) resolve "mudei sem querer a visualização de todos", ao custo de cada pessoa ver uma versão diferente do mesmo nome.
- Attio vai no extremo oposto: qualquer pessoa com acesso salva para todos.

### Gaps
- Barra "Save/Cancel" do Salesforce ao mudar filtros: não confirmado (help.salesforce.com não abriu).
- Sinal visual de "modificado" no HubSpot atual e no Attio: não confirmado.
- Se o ponto do GitHub persiste entre sessões: não confirmado.

## 7. Visualização padrão, URL da visualização, proteção da visualização do sistema

### Takeaway
Definir padrão:
- **HubSpot:** arrastar a aba para a 1ª posição;
- **Salesforce:** fixar com o ícone de alfinete, por usuário e por objeto;
- **Asana:** "Set as default" no menu da aba, para todo o projeto (terceiro);
- **Linear:** escolher uma favorita como página inicial nas preferências.

Proteção documentada: o Airtable exige pelo menos 1 visualização em grade colaborativa por tabela; Airtable e NocoDB têm travamento.

URL própria: Linear tem "Copy view URL"; HubSpot tem copiar link no painel de compartilhamento.

### Cited Findings
- **HubSpot:** arrastar a aba para a extremidade esquerda define a visualização padrão. — [HubSpot KB](https://knowledge.hubspot.com/records/create-and-manage-saved-views)
- **HubSpot:** "Sharing options" no painel de configuração tem copiar link. — [HubSpot KB, updated index page](https://knowledge.hubspot.com/records/manage-saved-views-in-the-updated-index-page)
- **Salesforce:** o alfinete ao lado do nome fixa a lista como padrão daquele objeto; fixar outra substitui a anterior; vale por usuário e por objeto (terceiro e busca no Trailhead). — [Xappex](https://www.xappex.com/blog/how-to-create-a-list-view-in-salesforce/); [Trailhead](https://trailhead.salesforce.com/en/modules/lightning-experience-for-salesforce-classic-users/units/work-with-list-views)
- **Salesforce:** sem lista fixada, o seletor abre em "Recently Viewed" (busca). — [Trailhead](https://trailhead.salesforce.com/en/modules/lightning-experience-for-salesforce-classic-users/units/work-with-list-views)
- **Asana:** clica-se de novo na aba e escolhe-se "Set as default" (terceiro). — [Guideflow, set default tab](https://www.guideflow.com/tutorial/how-to-set-tab-as-default-in-asana)
- **Asana:** o padrão vale para todos que abrem o projeto, e usuários pedem padrão por pessoa (comunidade, citado no resumo da busca; não confirmado em qual destes tópicos). — [Fórum Asana, Overview layout as default](https://forum.asana.com/t/overview-layout-as-project-default/108611); [Fórum Asana, saved views](https://forum.asana.com/t/surface-the-most-relevant-information-by-saving-views-for-you-and-your-team/489251?page=2)
- **Linear:** uma visualização favorita vira página inicial em Settings > Account > Preferences. — [Linear Docs, custom views](https://linear.app/docs/custom-views)
- **Linear:** "Copy view URL" no menu de 3 pontos; o link não dá acesso, e a visualização precisa estar compartilhada. — [Linear Docs](https://linear.app/docs/custom-views)
- **Jira Cloud:** só o admin do espaço define a visualização salva padrão. — [Atlassian Support](https://support.atlassian.com/jira-software-cloud/docs/save-and-share-views-from-your-list/)
- **Airtable:** toda tabela precisa de pelo menos 1 visualização em grade colaborativa acessível a todos; a única visualização não vira pessoal. — [Airtable Support](https://support.airtable.com/docs/getting-started-with-airtable-views)
- **Baserow:** toda tabela nova nasce com uma visualização em grade padrão. — [Baserow docs, overview](https://baserow.io/user-docs/overview-of-baserow-views)
- **NocoDB:** apagar pede confirmação e não se desfaz. — [NocoDB docs](https://nocodb.com/docs/product-docs/views/actions-on-view)

### Inferences
- Padrão por usuário (Salesforce, HubSpot, Linear) e padrão da equipe (Asana, Jira) convivem no mercado.
- A queixa no fórum do Asana indica demanda por padrão pessoal.
- A regra do Airtable (sempre resta 1 visualização compartilhada) protege a tabela de ficar sem visualização.

### Gaps
- URL própria por visualização no Airtable, no Attio, no Baserow, no NocoDB e no GitHub: não confirmado nas páginas lidas.
- Proteção específica da visualização "do sistema" (não apagável) no HubSpot e no Salesforce: não confirmado.

## 8. Atalhos de teclado e acessibilidade

### Takeaway
Atalhos documentados:
- **Airtable:** Ctrl/Cmd+Shift+K abre o seletor de visualizações; Ctrl/Cmd+Shift+F e +S abrem filtro e ordenação;
- **Linear:** O, V busca visualizações; Option/Alt+V salva como visualização; Shift+V abre Display options.

Nenhuma fonte lida trata de acessibilidade da barra (papel ARIA de aba, foco, leitor de tela).

### Cited Findings
- **Airtable:** Cmd Shift K / Ctrl Shift K "Opens the view switcher in the current base". — [Airtable Support, keyboard shortcuts](https://support.airtable.com/docs/airtable-keyboard-shortcuts)
- **Airtable:** Ctrl/Cmd+Shift+F abre o menu de filtro; Ctrl/Cmd+Shift+S, o de ordenação; Ctrl/Cmd+Shift+D, o de agrupamento; Ctrl/Cmd+F, a busca na visualização. — [Airtable Support, keyboard shortcuts](https://support.airtable.com/docs/airtable-keyboard-shortcuts)
- **Linear:** O seguido de V abre ou busca visualizações; Option/Alt+V salva lista ou quadro filtrado como visualização. — [Linear Docs, custom views](https://linear.app/docs/custom-views)
- **Linear:** Shift+V abre Display options; Cmd/Ctrl+B alterna lista e quadro. — [Linear Docs, display options](https://linear.app/docs/display-options)
- **Attio:** os atalhos documentados são de navegação nas células (setas, Enter, Cmd/Ctrl+C/V, Shift+clique); nenhum é de visualização. — [Attio Help, table views](https://attio.com/help/reference/managing-your-data/views/create-and-manage-table-views)

### Inferences
- Um seletor de visualizações com busca aberto por atalho (Airtable, Linear) resolve o transbordo para quem usa teclado, independente da forma da barra.

### Gaps
- Acessibilidade (role="tablist", navegação por setas entre abas, anúncio de "modificado"): não confirmado em nenhum produto.
- Atalhos de visualização no GitHub Projects, no HubSpot, no Salesforce, no Baserow e no NocoDB: não confirmado.

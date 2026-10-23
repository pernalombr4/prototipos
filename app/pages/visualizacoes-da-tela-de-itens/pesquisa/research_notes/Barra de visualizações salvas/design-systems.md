# Abas com transbordo e visualizações salvas acima de tabelas: o que os design systems especificam

Pesquisa feita em 2026-10-23. Limites de acesso nesta rodada:
- as páginas oficiais do SAP Fiori (sap.com/design-system) devolveram 403 à leitura direta; o que está na seção do SAP vem dos trechos que a busca devolveu dessas páginas e da ajuda do SAP, com o link de cada um;
- a página do Material 3 (m3.material.io) e o Storybook do Fluent carregam por JavaScript e não abriram; o Material entra pela doc do `material-web`;
- a doc atual do Polaris saiu de polaris.shopify.com (o endereço redireciona para shopify.dev, sem a página do IndexFilters); as regras vêm do `.mdx` e do código-fonte no GitHub do Polaris.

## 1. Shopify Polaris: IndexFilters e Tabs (visualizações salvas acima do IndexTable)

### Takeaway
O Polaris é o modelo mais completo de "abas de visualização salva" acima de tabela: aba "+" que abre modal de nome, menu por aba (renomear, duplicar, editar, editar colunas, excluir com confirmação), botão "Save" ou "Save as" conforme a visualização aceita alteração, e transbordo para um disclosure "More views" que nunca esconde a aba selecionada. Não há arrastar para reordenar.

### Cited Findings
- As abas do IndexFilters são "A list of saved views"; "New views can be created directly from the tab list"; o lojista pode "Create, rename, duplicate, or delete views" e "Edit the applied filters and search terms of a view". — [Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx)
- Permissão por visualização: "You can create views and control which actions can be performed on a particular view." — [Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx)
- Salvar: a ação primária é "either "Save" or "Save as" depending on whether the view is mutable"; a secundária é sempre "Cancel". Visualização nova nasce de editar "the filters, query, or sort selection of an existing view and saving it as new". — [Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx)
- O botão de busca e filtro alterna a tabela entre o modo "View" e o modo "Filter". — [Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx)
- Acessibilidade: o lojista precisa "Complete all actions using a keyboard" e "Be notified of state changes as they use the filter controls". — [Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx)
- Filtros promovidos: "Include no more than 2 or 3 promoted filters". — [Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx)
- Textos da interface (locale en): botão de transbordo "More views"; "+" com rótulo "Create new view" e tooltip "Create view"; ações da aba "Rename view", "Duplicate view", "Edit view", "Edit columns", "Delete view"; cópia nomeada "Copy of {name}". — [Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json)
- Excluir pede confirmação: título "Delete view?", texto "This can't be undone. {viewName} view will no longer be available in your admin.", botões "Cancel" e "Delete view". — [Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json)
- Renomear, duplicar e criar abrem modal com um campo "Name"; os botões são "Save" (renomear) ou "Create view" (duplicar e criar). Nome repetido é barrado com "A view with this name already exists. Please choose a different name." — [Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json)
- Barra de salvar do IndexFilters: botões "Cancel", "Update", "Save", "Save as"; o "Save as" abre o modal "Save view as" com campo "Name". Atalho de teclado: "Search and filter (F)". — [Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json)
- Nenhum limite de caracteres no nome da visualização aparece nos textos de Tabs ou IndexFilters. — [Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json)
- Transbordo: o componente mede as abas e separa `visibleTabs` e `hiddenTabs`; quando há aba escondida e a tela não é pequena, aparece um botão com popover que lista as escondidas (rótulo `disclosureText` ou "More views"). Ao abrir, o foco vai para a primeira aba escondida. — [Polaris, Tabs.tsx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/Tabs.tsx)
- Em tela pequena (`mdDown`) não há disclosure: todas as abas ficam numa linha com rolagem horizontal, e a aba ativa rola para a vista. — [Polaris, Tabs.tsx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/Tabs.tsx)
- A aba selecionada nunca vai para o transbordo: `getVisibleAndHiddenTabIndices` põe o índice selecionado em `visibleTabs` antes de medir as outras, e reserva a largura do botão de transbordo (`containerWidth - disclosureWidth`). As demais entram em ordem de índice; uma aba larga que não cabe vai para o menu, e uma estreita depois dela ainda pode ficar visível. — [Polaris, Tabs/utilities.ts](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/utilities.ts)
- Teclado das abas: setas esquerda e direita movem o foco com volta circular; com o disclosure fechado, só percorrem as visíveis; com ele aberto (ou no celular), percorrem visíveis e escondidas. Ao entrar na lista, o foco vai para a aba selecionada. — [Polaris, Tabs.tsx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/Tabs.tsx)
- `canCreateNewView` mostra a aba "+" e o modal de criação; `onCreateNewView(value)` devolve `Promise<boolean>`; depois de criar, o foco volta para a aba selecionada. `disabled` desliga abas, disclosure e "+". — [Polaris, Tabs.tsx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/Tabs.tsx)
- Regras das Tabs do Polaris: abas devem "Represent the same kind of content, such as a list-view with different filters applied"; não servem de navegação principal; o rótulo é curto, "generally kept to single word" (exemplos: All, Open, Unpaid). O modo "fitted" serve para "a few (2 or 3) items within a narrow column"; o padrão serve "especially when the number of tabs may be more than three". — [Polaris, tabs.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/navigation/tabs.mdx)

### Inferences
- A combinação "aba selecionada sempre visível + transbordo para menu + largura do botão reservada" é a regra mais concreta encontrada e se replica num componente próprio sobre o `UTabs`.
- O par "Save" (visualização própria, mutável) e "Save as" (visualização do sistema ou de outra pessoa) resolve o caso da visualização padrão que não se altera.
- A confirmação só no excluir (não no renomear) segue a regra do Carbon de pedir confirmação apenas quando há perda (seção 4).

### Gaps
- Número máximo de visualizações salvas: não confirmado (nem a doc nem os textos citam).
- Truncamento do rótulo da aba (largura máxima, reticências, tooltip): não confirmado no Polaris.
- Reordenar abas (arrastar ou por menu): o Polaris não oferece; nenhuma regra encontrada.
- A página atual em shopify.dev não abriu; a doc pode ter mudado depois do `.mdx` lido (não confirmado).

## 2. GitHub: Primer UnderlineNav e as abas de visualização do GitHub Projects

### Takeaway
O GitHub Projects mostra cada visualização como aba, cria com "New view" à direita, marca alteração não salva com um ponto ao lado do nome e salva por "View options > Save changes"; reordenar é arrastar a aba, com gravação automática. O Primer UnderlineNav é navegação por links (`aria-current="page"`), não `tablist`.

### Cited Findings
- "Each view appears on its own tab"; para criar, clicar em **New view**, à direita das visualizações existentes; a nova visualização é salva automaticamente. — [GitHub Docs, Managing your views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- Ordenar, reordenar, filtrar ou agrupar mostra um ponto ao lado do nome da visualização, sinal de alteração não salva; quem não quer manter pode ignorar o ponto, e outras pessoas não veem a alteração não salva. Para salvar: **View options** (engrenagem ao lado da busca) > **Save changes**. — [GitHub Docs, Managing your views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- Duplicar, renomear e excluir ficam em **View options** ("Duplicate view", "Rename view", "Delete view"); renomear grava ao pressionar Return. — [GitHub Docs, Managing your views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- Reordenar: arrastar a aba para a nova posição; a ordem é salva automaticamente. — [GitHub Docs, Managing your views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- UnderlineNav "provides navigation links to let users switch between 2 or more related views without leaving their current context"; para o mesmo padrão sem links, o Primer indica o UnderlinePanels. — [Primer, UnderlineNav](https://primer.style/product/components/underline-nav/)
- Estado: `aria-current="page"` no item atual. Ícones somem abaixo de uma largura (`hideIconsBreakpoint`, padrão `'medium'`); regra de ícone: "Either items in the navigation should have a leading icon or none of the items do." Em ponteiro grosso (toque), setas de rolagem controlam o transbordo. — [Primer, UnderlineNav](https://primer.style/product/components/underline-nav/)

### Inferences
- O ponto do GitHub e o asterisco do SAP (seção 3) são 2 formas do mesmo sinal: a visualização tem alteração não salva, visível só para quem alterou.
- Abas de visualização salva acima de tabela são troca de estado na mesma tela; o modelo semântico certo é `tablist` (APG) ou um grupo com `aria-current`, não links de página.

### Gaps
- "Discard changes" explícito no GitHub Projects: a doc não cita (não confirmado).
- Atalho de teclado para reordenar ou trocar de visualização no Projects: não confirmado.
- O comportamento do menu "More" do UnderlineNav (texto, aba selecionada mantida visível) não está no trecho lido da página; não confirmado nesta rodada.

## 3. SAP Fiori: gestão de visualizações (variant management)

### Takeaway
O SAP chama "view" na interface o que o controle chama "variant". Alteração não salva aparece como asterisco (*) depois do nome; "Save" grava por cima da visualização ativa e fica desligado quando o usuário não pode alterá-la; "Save As" cria nova (e serve para duplicar). O diálogo "Manage Views" renomeia, exclui, marca favorito, define padrão e "Apply Automatically"; a visualização "Standard" é sempre favorita e não se exclui.

Ressalva: as páginas oficiais do Fiori devolveram 403 à leitura direta. Cada item abaixo vem do trecho que a busca devolveu do endereço citado.

### Cited Findings
- Terminologia: "On the user interface, we now call variants "views", which is better understood by end users"; os controles SAPUI5 continuam com "variant management". — [SAP Fiori, Views (Variant Management)](https://experience.sap.com/fiori-design-web/2014/10)
- Asterisco: "Variants that have been modified but not saved are marked with an asterisk (*)." — [SAP Fiori, variant management v1-30](https://experience.sap.com/fiori-design-web/v1-30/variant-management)
- Na versão atual: quando a mudança na interface afeta a visualização salva, "the view is marked with an asterisk (*) to indicate the unsaved changes"; exemplo: incluir ou tirar filtro da barra de filtros. — [SAP Fiori, variant management usage v1-84](https://www.sap.com/design-system/fiori-design-web/v1-84/ui-elements/variant-management/usage)
- O nome da visualização abre os diálogos "My Views", "Manage Views" e "Save View"; o "My Views" lista os favoritos, incluindo a visualização padrão, as visualizações "Standard" entregues pelo sistema e as marcadas como favoritas pelo usuário. — [SAP Fiori, variant management usage v1-84](https://www.sap.com/design-system/fiori-design-web/v1-84/ui-elements/variant-management/usage)
- "Save As enables the user to save the current filter settings as a new variant. The Save As function can also be used to duplicate existing variants for later modification." — [SAP Fiori, variant management v1-30](https://experience.sap.com/fiori-design-web/v1-30/variant-management)
- "Save" sobrescreve a visualização ativa e fica desligado quando o usuário não tem permissão para salvá-la. — [SAP Fiori, variant management v1-30](https://experience.sap.com/fiori-design-web/v1-30/variant-management)
- "Manage Views" abre um diálogo para renomear, excluir e mudar propriedades das visualizações, conforme permissão; em geral o usuário não altera visualização de outra pessoa, e o key user pode. — [SAP Fiori, variant management usage v1-71](https://www.sap.com/design-system/fiori-design-web/v1-71/ui-elements/variant-management/usage); [SAP Fiori, v1-52](https://experience.sap.com/fiori-design-web/v1-52/variant-management)
- Favorito: a estrela no "Manage Views" põe ou tira a visualização do seletor; toda visualização nova nasce favorita; a que não é favorita continua acessível pelo "Manage Views". — [SAP Help, Manage Views](https://help.sap.com/docs/r/3d99fdeadde04524bdd33d35f1e13777/Cloud/en-US/1f638f22410349e5922a0699dd79bec8.html)
- Padrão: define a visualização que abre ao entrar no app; marcar como padrão torna a visualização favorita. — [SAP Help, Manage Views](https://help.sap.com/docs/r/3d99fdeadde04524bdd33d35f1e13777/Cloud/en-US/1f638f22410349e5922a0699dd79bec8.html)
- "Apply Automatically": executa a busca ou o filtro assim que a visualização é escolhida (ou ao entrar no app, para a padrão); só existe em app que aplica configuração a um conjunto de dados, como filtro de tabela. Favorito, padrão e "Apply Automatically" definidos pelo key user não obrigam o usuário final, que muda para si no "Manage Views". — [SAP Help, Manage Views](https://help.sap.com/docs/r/3d99fdeadde04524bdd33d35f1e13777/Cloud/en-US/1f638f22410349e5922a0699dd79bec8.html)
- "Standard": sempre favorita e não pode ser excluída. — [SAP Help, Manage Views](https://help.sap.com/docs/r/3d99fdeadde04524bdd33d35f1e13777/Cloud/en-US/1f638f22410349e5922a0699dd79bec8.html)
- Padrão só se define para o próprio usuário; visualização pública só se exclui quando foi o próprio usuário que a criou. — [SAP Community, key users e configurações padrão](https://community.sap.com/t5/technology-blog-posts-by-sap/sap-fiori-for-sap-s-4hana-yes-key-users-can-create-default-app-settings-for/ba-p/13553897)
- Compartilhar: o parâmetro `UI5FLEX_ENABLE_VARIANTS` define se o usuário cria e adapta visualizações e se compartilha; em `PRIVATE`, a caixa "Public" some; em `NONE`, o usuário ainda marca favorito e muda o padrão. — [SAP Help, Creating and Adapting Views](https://help.sap.com/docs/r/4fc8d03390c342da8a60f8ee387bca1a/latest/en-US/91ae3492323b42a79ca66fbfaf5af3f9.html)
- Ações descritas pelo SAP: "Save View" (atualiza a visualização atual) e "Save View as" (copia a atual para uma nova); o SAP entrega uma "Standard" em todo lugar que usa visualizações. — [SAP blog, novas opções para gerir visualizações (2022)](https://blogs.sap.com/2022/03/16/sap-fiori-for-sap-s-4hana-new-options-for-managing-views-for-filters-tables-and-charts/)

### Inferences
- Para o ENSPACE, o SAP dá o desenho de 2 níveis: seletor curto (só favoritas) e diálogo de gestão com todas, onde ficam renomear, excluir, favorito, padrão e compartilhar. Isso tira da barra a obrigação de mostrar tudo.
- "Save" desligado na visualização do sistema mais "Save As" sempre ligado é a mesma regra do Polaris ("Save" ou "Save as" conforme mutabilidade): 2 sistemas independentes chegam à mesma solução.
- O asterisco depois do nome funciona como sinal de alteração não salva também dentro de uma aba; combinado com um texto acessível ("alterações não salvas"), não depende só do símbolo.

### Gaps
- Colunas exatas do "Manage Views" na versão atual (por exemplo "Sharing", "Created By"): não confirmado; a busca não devolveu a lista.
- Reordenar visualizações no "Manage Views": não confirmado.
- Limite de visualizações a partir do qual o "My Views" ganha campo de busca: não confirmado.
- Regra de nome (obrigatório, repetido, tamanho máximo): não confirmado.
- O que acontece ao trocar de visualização com alteração não salva (descarta, pergunta): não confirmado.
- Teclado e leitor de tela do controle: não confirmado.

## 4. Carbon, Atlassian, Material 3, Fluent 2, Ant Design e Salesforce: transbordo, tipos de aba e quando usar

### Takeaway
Há 2 escolas de transbordo: rolagem com setas (Carbon, Material, Ant "slide", Polaris no celular) e menu "mais" (Fluent, Ant `more`, Polaris no desktop, Primer). Ninguém permite quebrar a linha de abas. Os rótulos ficam em 1 a 2 palavras; só o Carbon define truncamento (2 linhas e reticências com tooltip, nas abas verticais).

### Cited Findings
- Carbon: abas line e contained rolam na horizontal quando não cabem, com setas esquerda e direita; abas horizontais não quebram linha nem empilham. A página não cita menu de transbordo. — [Carbon, Tabs usage](https://carbondesignsystem.com/components/tabs/usage/)
- Carbon: no mínimo 2 abas em grupo não removível e 1 em grupo removível; contained grid-aware para 4 abas ou menos; até 8 abas grid-aware nos breakpoints Max, XLG e LG. — [Carbon, Tabs usage](https://carbondesignsystem.com/components/tabs/usage/)
- Carbon, line vs contained: line é autônoma, cabe dentro de componente e usa largura automática; contained é enfatizada, presa a um painel com o mesmo token de camada, para área definida como subpágina, e não vai dentro de modal. — [Carbon, Tabs usage](https://carbondesignsystem.com/components/tabs/usage/)
- Carbon, rótulo: "Labels should be one to two words"; "Line and tab labels do not need truncation since these types of tabs allow for horizontal scrolling"; nas verticais, o rótulo longo quebra em 2 linhas e trunca com reticências, com o título completo no tooltip do navegador (hover) e no tooltip do Carbon (foco). — [Carbon, Tabs usage](https://carbondesignsystem.com/components/tabs/usage/)
- Carbon, abas removíveis (dismissible): para conteúdo criado ou curado pelo usuário, ou para focar um conjunto de dados ou resultado de busca; não para informação crítica nem navegação. Aviso ou modal antes de fechar só quando fechar causa erro, exclusão sem querer ou perda de alteração não salva. Se todas podem ser removidas, um marcador mostra onde o "adicionar" cria a aba nova. — [Carbon, Tabs usage](https://carbondesignsystem.com/components/tabs/usage/)
- Carbon, teclado: setas esquerda e direita; ativação automática quando o painel carrega rápido, manual (Enter ou Espaço) quando carrega devagar. Alturas: 32px (sm) e 40px (md) em line. — [Carbon, Tabs usage](https://carbondesignsystem.com/components/tabs/usage/)
- Fluent 2: "Tabs in a horizontal tablist won't scroll or wrap to the next line"; "If you need to show more tabs, include an overflow menu button", com `role="tab"` no botão personalizado. Lista com muitas abas escondidas funciona pior; com pouco espaço, indica acordeão ou dropdown. — [Fluent 2, TabList usage](https://fluent2.microsoft.design/components/web/react/core/tablist/usage)
- Fluent 2: rótulo curto ("usually a noun or short phrase is best"), paralelo, em sentence case, sem pontuação final; um só formato (texto, texto com ícone ou só ícone) por lista; só ícone pede `aria-label` e tooltip; não usar aba para disparar ação (use botão) nem para ir a outra página (use link). — [Fluent 2, TabList usage](https://fluent2.microsoft.design/components/web/react/core/tablist/usage)
- Atlassian: "Don't use tabs to separate information that users need at the same time, such as filtering data within a single table"; manter poucas abas; rótulo "usually 1-2 words"; ordenar por importância ou frequência; setas movem entre abas e Tab vai para o conteúdo; evitar controles interativos aninhados ("dropdowns and buttons") nas abas. A página não trata transbordo nem truncamento. — [Atlassian, Tabs usage](https://atlassian.design/components/tabs/usage)
- Material (material-web): primárias ficam no topo sob a app bar; secundárias separam conteúdo dentro de uma área; um tipo por barra. `scrollToTab` rola a barra até a aba ativa quando há transbordo. `auto-activate` é `false` por padrão. Todo tab referencia um `role="tabpanel"` por `aria-controls`. — [material-web, tabs.md](https://raw.githubusercontent.com/material-components/material-web/main/docs/components/tabs.md)
- Ant Design: prop `more` com padrão `{ icon: <EllipsisOutlined />, trigger: 'hover' }` gera o menu de transbordo; demo com busca e teclado no menu ("Custom Popup Search"); `type="editable-card"` dá "+" e fechar (`onEdit`, `hideAdd`, `closable`); `tabBarExtraContent` põe ações à esquerda ou à direita da barra; demo "Draggable Tabs" com dnd-kit. "Card Tabs: for managing too many closeable views." — [Ant Design, Tabs](https://ant.design/components/tabs)
- Salesforce (Lightning Experience, não SLDS): o menu "List View Controls" cria, renomeia, clona e compartilha visualizações, escolhe campos visíveis e edita filtros; fixar (pin) torna uma visualização a padrão do objeto para o usuário. — [Trailhead, Work with List Views](https://trailhead.salesforce.com/content/learn/modules/lightning-experience-for-salesforce-classic-users/work-with-list-views)

### Inferences
- O Atlassian desaconselha aba para "filtrar dados de uma única tabela", mas o Polaris e o GitHub fazem exatamente isso com visualizações salvas. A leitura que concilia: a aba de visualização salva troca um conjunto inteiro de configuração (filtro, ordem, colunas), não um filtro solto; e a ação de filtrar fica fora das abas.
- O Atlassian e o Fluent pedem para não aninhar botão dentro da aba; o Polaris resolve com menu da aba (popover) e o GitHub com "View options" fora da aba. Para o ENSPACE, o menu por aba sai de um único gatilho (a aba ativa ou um botão de ação), sem vários botões dentro de cada aba.
- Para uma barra com quantidade aberta de visualizações criadas pelo usuário, o menu "mais" (Polaris, Fluent, Ant) serve melhor que a rolagem com setas (Carbon), porque mostra todas as escondidas de uma vez e aceita busca (demo do Ant).

### Gaps
- Material 3 (m3.material.io): fixed vs scrollable e limite de abas não lidos; a página não renderiza sem JavaScript. Não confirmado nesta rodada.
- Fluent: teclado dentro do menu de transbordo e se a aba selecionada fica visível: a página de uso não diz; o Storybook não abriu. Não confirmado.
- Salesforce SLDS: componente de controles de lista e tratamento de filtro alterado e não salvo: não encontrado.
- Jira (Atlassian): como os filtros salvos aparecem: não pesquisado com fonte; não confirmado.
- Largura máxima de rótulo em pixels ou caracteres: nenhum sistema define (Carbon diz expressamente que não precisa truncar line e contained).

## 5. Nuxt UI 4 (Reka UI): o que o UTabs entrega

### Takeaway
O `UTabs` do Nuxt UI 4 tem variantes `pill` (padrão) e `link`, `activationMode` automático ou manual, `content=false` para só a barra, e slots `list-leading` e `list-trailing`. Não tem transbordo, menu "mais", aba "+", menu por aba nem reordenação: tudo isso é construção própria.

### Cited Findings
- Props: `variant` `"pill" | "link"` (padrão `pill`); `size` `xs` a `xl` (padrão `md`); `orientation` horizontal ou vertical; `content` (`false` renderiza só os gatilhos); `activationMode` `"automatic" | "manual"` (padrão automático); `modelValue` com `v-model`; `unmountOnHide`. — [Nuxt UI, Tabs](https://ui.nuxt.com/docs/components/tabs)
- Item: `label`, `icon`, `avatar`, `badge`, `value`, `disabled`, `slot`, `ui`. Slots: `leading`, `default`, `trailing`, `content`, `list-leading`, `list-trailing`. Expõe `triggersRef`. — [Nuxt UI, Tabs](https://ui.nuxt.com/docs/components/tabs)
- O repositório de protótipos usa `@nuxt/ui` `^4.5.1` (package.json local, conferido em 2026-10-23).

### Inferences
- `list-trailing` é o lugar natural para o botão de transbordo e o "+"; `triggersRef` permite medir as abas para decidir o que vai ao menu, como o `TabMeasurer` do Polaris.
- O botão de transbordo dentro do `tablist` precisa de `role="tab"` (Fluent) ou ficar fora da lista com `aria-haspopup`; o padrão do Reka para isso não foi conferido.
- `slot` por item (`#<slot>-trailing`? não confirmado) pode carregar o asterisco de alteração não salva; conferir no código do componente.

### Gaps
- Transbordo, reordenação e menu por aba no UTabs: nenhuma prop na doc lida; ausência não confirmada no changelog.
- Nome exato dos slots por item (por exemplo `#<slot>-leading`): a doc lida mostra só os slots gerais; não confirmado.

## 6. Reordenar abas e o padrão de abas do WAI-ARIA

### Takeaway
Nenhum design system lido dá regra de acessibilidade para reordenar abas: o GitHub Projects e o Ant Design só arrastam. O APG define o padrão de abas (setas com volta circular, Home e End, ativação automática quando o painel aparece sem atraso, Delete e Shift+F10 opcionais), mas não define atalho de reordenar.

### Cited Findings
- APG: papéis `tablist`, `tab`, `tabpanel`; `aria-selected="true"` só na ativa; `aria-controls` na aba; `aria-labelledby` no painel; `aria-label` no tablist sem rótulo visível; `aria-haspopup="menu"` (ou `true`) na aba que tem menu. — [WAI-ARIA APG, Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- APG, teclado: Tab entra na aba ativa ("places focus on the active tab element") e o próximo Tab sai para o painel; seta esquerda e direita com volta circular; Espaço ou Enter ativa se não ativou no foco; Home e End (opcionais) vão à primeira e à última; Shift+F10 (opcional) abre o menu da aba; Delete (opcional) fecha a aba e o foco vai à seguinte, ou à anterior quando não há seguinte. — [WAI-ARIA APG, Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- APG, ativação: recomenda ativar no foco quando o painel aparece sem atraso perceptível; senão, "automatic activation slows focus movement", e a ativação manual (Espaço ou Enter) é a indicada. — [WAI-ARIA APG, Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- Painel sem conteúdo focável (ou cujo primeiro conteúdo não é focável) recebe `tabindex="0"`. — [WAI-ARIA APG, Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- Carbon segue a mesma regra de ativação: automática para painel rápido, manual para painel lento. — [Carbon, Tabs usage](https://carbondesignsystem.com/components/tabs/usage/)
- GitHub Projects: reordenar é arrastar a aba; a ordem grava sozinha. — [GitHub Docs, Managing your views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)
- Ant Design: reordenar por demo com dnd-kit, sem orientação de teclado na página. — [Ant Design, Tabs](https://ant.design/components/tabs)

### Inferences
- Trocar de visualização recarrega a tabela (consulta ao servidor); pelo APG e pelo Carbon, isso indica ativação manual (`activationMode="manual"` no UTabs), para que as setas não disparem uma consulta por aba percorrida.
- Uma alternativa de teclado para reordenar, sem regra de design system, é colocar "Mover para a esquerda" e "Mover para a direita" no menu da aba (aberto por Shift+F10, que o APG prevê) e anunciar a nova posição numa região `aria-live`. É inferência, não regra encontrada.

### Gaps
- Atalho de teclado para reordenar abas (por exemplo Ctrl+Shift+seta): nenhuma fonte de design system encontrada. Não confirmado.
- Texto de anúncio em região viva para reordenação de abas: nenhuma fonte encontrada.
- Comportamento recomendado para a aba ativa que está no menu de transbordo quanto ao foco de teclado: só o código do Polaris trata (seção 1); nenhuma regra escrita de design system.

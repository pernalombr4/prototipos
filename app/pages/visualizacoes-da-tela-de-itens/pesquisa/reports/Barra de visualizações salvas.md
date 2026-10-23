# Como o mercado desenha a barra de visualizações salvas

Pesquisa de 2026-10-23, feita a partir de 4 notas: produtos de trabalho (Notion, ClickUp, monday, Pipefy, Twenty), produtos de dados e CRM (Airtable, Linear, Attio, Asana, Jira, Baserow, NocoDB, Smartsheet, HubSpot, Salesforce, GitHub Projects), design systems e evidência de usabilidade. Serve ao redesenho da barra de visualizações personalizadas e do construtor de visualização na tela nova de itens do ENSPACE.

A barra que se repete no mercado é uma linha de abas com a visualização ativa sempre visível, um menu "Mais" para as que não cabem, um "+" que cria a partir da tabela como está e salvar explícito com marca de alteração não salva. O Polaris é a única fonte que publica a regra do transbordo em código: a aba selecionada nunca vai para o menu, e a largura do botão "More views" fica reservada ([Polaris, Tabs/utilities.ts](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/utilities.ts)). Para alteração não salva, os produtos separam "mexi" de "salvei": o GitHub põe um ponto no nome da aba, o SAP põe um asterisco, e ClickUp, Twenty e Attio mostram um botão de salvar com "salvar como nova" e "descartar". A visualização do sistema não se altera: Polaris e SAP desligam "Save" e mantêm "Save as". A evidência de usabilidade é mais fraca que a convenção: nenhum estudo publicado mede barras de visualizações salvas. O dado mais próximo é o estudo da NN/g (Nielsen Norman Group) com 179 pessoas, em que a navegação escondida foi usada em 27% dos casos no desktop, contra 48% da visível ([NN/g, Hamburger Menus](https://www.nngroup.com/articles/hamburger-menus/)). A norma que obriga é a WCAG 2.2, critério 2.5.7 (AA): reordenar por arrastar exige um caminho de 1 ponteiro sem arrastar, e o teclado sozinho não cumpre ([W3C, Understanding SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)). O `UTabs` do Nuxt UI 4 não traz transbordo, aba "+", menu por aba nem reordenação: o front constrói essas peças ([Nuxt UI, Tabs](https://ui.nuxt.com/docs/components/tabs)).

## Proposta para a tela nova de itens

Cada ponto cita a fonte que o sustenta. "Inferência" marca o que nenhuma fonte testou para este caso.

**Barra**
- Forma: 1 linha de abas, sem quebra de linha ([NN/g, Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/); [Fluent 2, TabList](https://fluent2.microsoft.design/components/web/react/core/tablist/usage)).
  - Ícone em todas as abas ou em nenhuma ([Primer, UnderlineNav](https://primer.style/product/components/underline-nav/); [Fluent 2, TabList](https://fluent2.microsoft.design/components/web/react/core/tablist/usage)).
  - Visualização padrão do sistema na 1ª posição, com cadeado, sem editar nem excluir ([Twenty, ViewPickerOptionDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerOptionDropdown.tsx)).
- Transbordo no desktop: botão "Mais (N)" no fim da linha, com largura reservada.
  - A aba ativa nunca entra no menu ([Polaris, Tabs/utilities.ts](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/utilities.ts)).
  - O menu tem campo de busca e mostra o nome inteiro ([ClickUp, Views Bar](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar); [Ant Design, Tabs](https://ant.design/components/tabs)).
  - Sem rolagem horizontal com setas no desktop: as pessoas ignoram setas laterais ([NN/g, Beware Horizontal Scrolling](https://www.nngroup.com/articles/horizontal-scrolling/)).
- Transbordo no celular: rolagem horizontal, com a aba ativa rolada para a vista ([Polaris, Tabs.tsx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/Tabs.tsx)).
- Nome longo: largura máxima por aba, reticências e pelo menos 4 caracteres visíveis ([Twenty, ViewPickerDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerDropdown.tsx); [Maersk, Truncation](https://designsystem.maersk.com/content/truncation/)).
  - O nome inteiro fica no nome acessível, no tooltip de foco e no menu "Mais"; o tooltip não é o único acesso ([NN/g, Tooltip Guidelines](https://www.nngroup.com/articles/tooltip-guidelines/)).
- Menu da aba: gatilho visível (kebab) na aba ativa, o mesmo menu no clique direito e em Shift+F10 ([NN/g, Contextual Menus](https://www.nngroup.com/articles/contextual-menus-guidelines/); [WAI-ARIA APG, Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)).
  - Itens: Renomear, Duplicar, Editar, Copiar link, Definir como padrão, Mover para a esquerda, Mover para a direita, Excluir.
  - Clique duplo para renomear só como atalho, com Esc cancelando ([Baymard, Users Double-Click](https://baymard.com/blog/users-double-click-online)). Inferência.
- Reordenar: arrastar na barra e dentro do menu "Mais", mais os itens "Mover" no menu da aba ([W3C, SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html); [Feedback ClickUp](https://feedback.clickup.com/feature-requests/p/reorder-viewstabs)).
  - A nova posição se anuncia numa região viva ([Salesforce UX, Accessible Drag and Drop](https://medium.com/salesforce-ux/4-major-patterns-for-accessible-drag-and-drop-1d43f64ebf09)).
- Teclado: padrão `tablist` do WAI-ARIA APG (guia de padrões de acessibilidade do W3C) com ativação manual, porque trocar de visualização consulta o servidor ([WAI-ARIA APG, Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/); [Carbon, Tabs](https://carbondesignsystem.com/components/tabs/usage/)).
  - No `UTabs`: `activationMode="manual"`.

**Alteração não salva**
- Marca no nome da aba (ponto ou asterisco) com texto acessível "alterações não salvas" ([GitHub Docs, Managing your views](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views); [SAP Fiori, variant management](https://www.sap.com/design-system/fiori-design-web/v1-84/ui-elements/variant-management/usage)).
- Ações à vista: Salvar, Salvar como nova, Descartar ([Twenty, UpdateViewButtonGroup.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/UpdateViewButtonGroup.tsx); [Attio, filter and sort](https://attio.com/help/reference/managing-your-data/views/filter-and-sort-views)).
  - Na visualização padrão e para quem não tem permissão, só "Salvar como nova" ([Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx); [SAP Fiori v1-30](https://experience.sap.com/fiori-design-web/v1-30/variant-management)).
- Até salvar, a mudança vale só para quem a fez ([Notion, 2022-03-15](https://www.notion.com/releases/2022-03-15); [GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)).
- Aviso antes de perder a mudança ao trocar de visualização ou sair ([NN/g, User Control and Freedom](https://www.nngroup.com/articles/user-control-and-freedom/); [Fórum Asana](https://forum.asana.com/t/changes-keep-reverting-back-in-asana-critical-bug-issue/909484)).

**Criar e construtor**
- "+" no fim da barra, com 2 modos: a partir da tabela atual (padrão) e em branco ([Twenty, useCreateViewFromCurrentState.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/hooks/useCreateViewFromCurrentState.ts)).
- Nome, ícone, tipo e visibilidade (só para mim ou para todos) no mesmo passo ([Airtable, views](https://support.airtable.com/docs/getting-started-with-airtable-views); [Baserow, custom views](https://baserow.io/user-docs/create-custom-views-of-your-data)).
  - Nome repetido barrado com mensagem ([Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json)).
- Construtor em painel lateral não modal, com a tabela atualizando ao lado. Inferência a partir de [NN/g, Modal & Nonmodal Dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/) e [NN/g, Complex Application Design](https://www.nngroup.com/articles/complex-application-design/).
  - Formulário único, sem assistente em etapas ([NN/g, Wizards](https://www.nngroup.com/articles/wizards/)).
  - Campo pelo rótulo que a pessoa vê; nada de nome interno nem tipo técnico como texto principal ([NN/g, Match Between System and Real World](https://www.nngroup.com/articles/match-system-real-world/)).
- Excluir pede confirmação nomeada, com botão "Excluir visualização" ([Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json); [NN/g, Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/)).
  - Renomear, reordenar e duplicar não pedem confirmação ([NN/g, Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/)).

**Decisões que a pesquisa não toma**
- A ordem das abas é pessoal (monday) ou de todos (Twenty)?
- Quem salva por cima da visualização compartilhada: qualquer pessoa com acesso (Attio), o criador (HubSpot) ou o admin (Jira Cloud)?
- A visualização padrão é por pessoa (Salesforce, SAP) ou do workspace (Asana, Jira Cloud)?

## 7 produtos usam abas, 5 usam menu suspenso e 2 usam barra lateral

A forma da barra divide o mercado em 3 famílias. A aba mostra as visualizações sem clique e gasta largura. O menu suspenso no nome da atual cabe em qualquer largura e esconde as demais. A barra lateral comporta a lista inteira e tira espaço da tabela.

| Forma | Produtos | Fonte |
|---|---|---|
| Abas horizontais | Notion, ClickUp, monday (cabeçalho expandido), HubSpot, GitHub Projects, Asana, Linear (visualizações de equipe) | [Notion](https://www.notion.com/help/views-filters-and-sorts); [ClickUp](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar); [monday](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views); [HubSpot](https://knowledge.hubspot.com/records/create-and-manage-saved-views); [GitHub](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views); [Asana](https://forum.asana.com/t/surface-the-most-relevant-information-by-saving-views-for-you-and-your-team/489251); [Linear](https://linear.app/docs/custom-views) |
| Menu suspenso no nome da atual | monday (cabeçalho recolhido), Pipefy, Twenty, Attio, Baserow, Salesforce | [monday](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views); [Pipefy](https://help.pipefy.com/en/articles/3143190); [Twenty](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerDropdown.tsx); [Attio](https://attio.com/help/reference/managing-your-data/views/create-and-manage-table-views); [Baserow](https://baserow.io/user-docs/create-custom-views-of-your-data); [Trailhead](https://trailhead.salesforce.com/en/modules/lightning-experience-for-salesforce-classic-users/units/work-with-list-views) |
| Barra lateral | Airtable, NocoDB | [Airtable](https://support.airtable.com/docs/getting-started-with-airtable-views); [NocoDB](https://nocodb.com/docs/product-docs/views/actions-on-view) |
| Menu de filtros salvos | Smartsheet | [Smartsheet](https://help.smartsheet.com/articles/2483528-filter-your-data-table-board-and-timeline-view) |

O Notion justifica as abas: elas destacam as visualizações importantes "em vez de escondê-las num dropdown" ([Notion, guia](https://www.notion.com/help/guides/databases-reimagined-whats-changed)). O monday oferece as 2 formas no mesmo board: a seta do cabeçalho alterna entre abas e menu ([monday, board views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)). No fórum do monday, usuários reclamam de visualizações que "não se acham" no dropdown e pedem abas ([Comunidade monday](https://community.monday.com/t/board-views-cannot-be-found-because-they-are-hidden-in-a-dropdown-should-be-viewable-via-tabs/11137)).

**Ícone por tipo.** O Twenty dá a cada visualização o ícone do tipo ao criar e deixa trocar ([Twenty, ViewPickerContentCreateMode.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentCreateMode.tsx)). O Baserow põe o ícone do tipo antes do nome ([Baserow](https://baserow.io/user-docs/create-custom-views-of-your-data)). O NocoDB deixa a pessoa escolher o ícone e marca a visualização travada com cadeado e a pessoal com um ícone de usuário ([NocoDB](https://nocodb.com/docs/product-docs/views/actions-on-view)). O Notion deixa cada aba em "Icon only", "Text only" ou os 2, e a escolha vale só para quem a fez ([Notion](https://www.notion.com/help/views-filters-and-sorts)).

**Contagem de registros.** Só o Twenty mostra a contagem, e só da visualização atual: "· {total}" ao lado do nome ([Twenty, ViewPickerDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerDropdown.tsx)). Contagem por aba: não confirmado em nenhum produto.

**Estado ativo.** Nenhuma central descreve como a aba ativa é marcada (sublinhado, fundo, negrito): não confirmado. O Nuxt UI oferece as variantes `pill` (padrão) e `link` ([Nuxt UI, Tabs](https://ui.nuxt.com/docs/components/tabs)).

**Aba e filtro, sem conflito.** O Atlassian desaconselha aba para "filtering data within a single table" ([Atlassian, Tabs](https://atlassian.design/components/tabs/usage)). O Polaris e o GitHub usam abas para isso. A leitura que concilia as 2 regras: a aba troca um conjunto inteiro de configuração (filtro, ordem, colunas), e o controle de filtrar fica fora das abas. O Polaris escreve a mesma regra: abas "Represent the same kind of content, such as a list-view with different filters applied" ([Polaris, tabs.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/navigation/tabs.mdx)).

## O Polaris é o único que garante a aba ativa fora do transbordo

Os design systems se dividem em 2 escolas de transbordo, e nenhum permite quebrar a linha de abas.

| Sistema | Transbordo | Aba ativa | Truncamento | Fonte |
|---|---|---|---|---|
| Polaris | Menu "More views" no desktop; rolagem horizontal no celular | Nunca vai para o menu; no celular rola para a vista | Não confirmado | [Tabs.tsx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/Tabs.tsx); [utilities.ts](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/utilities.ts) |
| Fluent 2 | Botão de menu de transbordo; a lista não rola nem quebra | Não confirmado | Não confirmado | [Fluent 2, TabList](https://fluent2.microsoft.design/components/web/react/core/tablist/usage) |
| Ant Design | Prop `more` (reticências, abre no hover); demo com busca no menu | Não confirmado | Não confirmado | [Ant Design, Tabs](https://ant.design/components/tabs) |
| Carbon | Rolagem horizontal com setas; sem menu citado | Não confirmado | Abas line e contained não truncam; verticais quebram em 2 linhas com reticências e tooltip | [Carbon, Tabs](https://carbondesignsystem.com/components/tabs/usage/) |
| Material (material-web) | Rolagem; `scrollToTab` rola até a ativa | Rola para a vista | Não confirmado | [material-web, tabs.md](https://raw.githubusercontent.com/material-components/material-web/main/docs/components/tabs.md) |
| Primer UnderlineNav | Setas de rolagem em toque; menu "More" não confirmado | Não confirmado | Não confirmado | [Primer, UnderlineNav](https://primer.style/product/components/underline-nav/) |
| Atlassian | Não trata | Não trata | Não trata | [Atlassian, Tabs](https://atlassian.design/components/tabs/usage) |
| Nuxt UI 4 | Nenhum | Nenhum | Nenhum | [Nuxt UI, Tabs](https://ui.nuxt.com/docs/components/tabs) |

O algoritmo do Polaris coloca a aba selecionada entre as visíveis antes de medir as outras. Ele reserva a largura do botão de transbordo (`containerWidth - disclosureWidth`) e distribui as demais em ordem de índice. Uma aba larga que não cabe vai para o menu, e uma estreita depois dela ainda pode ficar visível ([Polaris, utilities.ts](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/utilities.ts)). Ao abrir o menu, o foco vai para a 1ª aba escondida ([Polaris, Tabs.tsx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/Tabs.tsx)). No Nuxt UI, o slot `list-trailing` recebe o botão "Mais" e o "+", e o `triggersRef` permite medir as abas como o Polaris faz. Inferência das notas, sem teste no componente ([Nuxt UI, Tabs](https://ui.nuxt.com/docs/components/tabs)).

Entre os produtos, o transbordo vai de lista simples a gerenciador:

| Produto | Como trata o excesso | Fonte |
|---|---|---|
| Notion | "{#} more..." ao lado das abas | [Notion](https://www.notion.com/help/views-filters-and-sorts) |
| ClickUp | Menu com o número de extras; abre modal com busca, fixar, reordenar e agrupar; só aparece com a barra cheia | [ClickUp, Views Bar](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar); [ClickUp, reorder](https://help.clickup.com/hc/en-us/articles/26004419744023-Group-and-reorder-views) |
| monday | Fixadas visíveis ao abrir o board; cabeçalho recolhido vira menu; limite de 100 visualizações por board | [monday](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views) |
| HubSpot | Até 5 abas abertas; abrir a 6ª fecha uma; as outras se reabrem por "+ add view" com busca | [HubSpot, updated index page](https://knowledge.hubspot.com/records/manage-saved-views-in-the-updated-index-page); [HubSpot, saved views](https://knowledge.hubspot.com/records/create-and-manage-saved-views) |
| Twenty | Nome em até 130px (110px e 90px em telas menores) com reticências e tooltip; lista com altura máxima e rolagem; sem busca | [ViewPickerDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerDropdown.tsx); [ViewPickerListContent.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerListContent.tsx) |
| Baserow | O menu filtra pelo nome enquanto se digita | [Baserow, overview](https://baserow.io/user-docs/overview-of-baserow-views) |
| Asana | Até 50 abas por projeto | [Fórum Asana, anúncio](https://forum.asana.com/t/surface-the-most-relevant-information-by-saving-views-for-you-and-your-team/489251) |
| Airtable | Acima de 20 visualizações na tabela, a nova nasce pessoal | [Airtable](https://support.airtable.com/docs/getting-started-with-airtable-views) |

O HubSpot e o SAP separam o catálogo da barra. No HubSpot, a barra mostra só as abas abertas, e o catálogo completo fica atrás do "+" com busca ([HubSpot](https://knowledge.hubspot.com/records/create-and-manage-saved-views)). No SAP, o seletor "My Views" lista só as favoritas, e o diálogo "Manage Views" guarda todas ([SAP Help, Manage Views](https://help.sap.com/docs/r/3d99fdeadde04524bdd33d35f1e13777/Cloud/en-US/1f638f22410349e5922a0699dd79bec8.html)). Toda visualização nova do SAP nasce favorita ([SAP Help](https://help.sap.com/docs/r/3d99fdeadde04524bdd33d35f1e13777/Cloud/en-US/1f638f22410349e5922a0699dd79bec8.html)).

**Truncamento.** Nenhum produto, exceto o Twenty, publica regra de corte de nome. A queixa aparece no Airtable: o nome longo só se lê no hover ([Comunidade Airtable](https://community.airtable.com/legacy-product-ideas-75/giving-more-space-to-display-the-name-of-a-view-42634)). Os design systems de conteúdo pedem pelo menos 4 caracteres visíveis e preferem quebrar a linha a truncar ([Maersk, Truncation](https://designsystem.maersk.com/content/truncation/); [PatternFly, Truncation](https://v4-archive.patternfly.org/v4/ux-writing/truncation); [Wikimedia Codex](https://doc.wikimedia.org/codex/main/style-guide/content-overflow.html)). O PatternFly indica truncar no meio quando a parte que diferencia os itens fica no fim ([PatternFly](https://v4-archive.patternfly.org/v4/ux-writing/truncation)). Nomes como "Contratos 2025 SP" e "Contratos 2025 RJ" caem nesse caso. A NN/g lê rótulo longo de aba como sinal de escolhas complexas demais para abas, e pede rótulo de 1 a 2 palavras ([NN/g, Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/)). Nome de visualização é texto livre da pessoa, então a regra vira orientação no campo de nome, não trava.

## Arrastar é o gesto de todos; a WCAG 2.2 exige um 2º caminho

Todo produto com visualizações salvas reordena por arrastar. O escopo da ordem varia, e poucas fontes o declaram.

| Produto | Gesto e regra | Escopo da ordem | Fonte |
|---|---|---|---|
| Notion | Arrastar a aba | Não confirmado | [Notion](https://www.notion.com/help/views-filters-and-sorts) |
| ClickUp | Arrastar; fixadas só entre fixadas; reordena também no modal "more"; qualquer pessoa com acesso | Não confirmado | [ClickUp, reorder](https://help.clickup.com/hc/en-us/articles/26004419744023-Group-and-reorder-views); [ClickUp, Views Bar](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar) |
| monday | Arrastar ou usar o dropdown; fixadas só entre si | Por membro | [monday](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views) |
| Twenty | Arrastar no dropdown, em 2 listas (Workspace e pessoais); grava `position` na visualização | Compartilhada nas do workspace (inferido do modelo de dados) | [ViewPickerListContent.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerListContent.tsx) |
| HubSpot | Arrastar; a 1ª posição vira a visualização padrão | Não confirmado | [HubSpot](https://knowledge.hubspot.com/records/create-and-manage-saved-views) |
| GitHub Projects | Arrastar; grava sozinho | Não confirmado | [GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views) |
| Airtable | Arrastar em seções criadas pela pessoa; "My favorites" e "My personal views" fixas no topo | Não confirmado | [Airtable](https://support.airtable.com/docs/getting-started-with-airtable-views) |
| Jira Cloud | Só o admin do espaço reordena | De todos | [Atlassian Support](https://support.atlassian.com/jira-software-cloud/docs/save-and-share-views-from-your-list/) |
| Polaris | Não oferece | Não se aplica | [Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx) |

O histórico do ClickUp mostra 2 erros a evitar. Até 2024-09-04, só as fixadas se reordenavam, e as pessoas fixavam tudo para poder mover. No dia seguinte à liberação, um usuário relatou que as visualizações dentro do "n more" não se reordenavam, e a equipe tratou como bug ([Feedback ClickUp](https://feedback.clickup.com/feature-requests/p/reorder-viewstabs)). O gesto de reordenar precisa valer na barra e no menu de transbordo.

O gesto do HubSpot (arrastar para a 1ª posição define o padrão) poupa um item de menu, mas o efeito não aparece na tela ([HubSpot](https://knowledge.hubspot.com/records/create-and-manage-saved-views)). Um item explícito "Definir como padrão" deixa o efeito legível.

A WCAG 2.2, critério 2.5.7 (AA), exige que todo arrastar tenha alternativa com 1 ponteiro sem arrastar. O exemplo do W3C para lista é selecionar o item e usar botões de subir e descer. O W3C diz que "achieving keyboard equivalence for a dragging operation does not automatically meet this success criterion" ([W3C, SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)). Nenhum design system lido dá regra de acessibilidade para reordenar abas, e nenhum define atalho de teclado para isso: não confirmado ([Ant Design, Tabs](https://ant.design/components/tabs); [GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views)).

A NN/g dá o retorno visual do arrastar:
- alça de arrastar, com a ressalva de que o ícone não é "nearly as universal as designers may think";
- cursor de mover no hover;
- item pego com contorno, sombra ou deslocamento;
- vizinhos abrindo espaço em cerca de 100 ms quando o centro do item cruza a borda do outro;
- no teclado, alça alcançável por Tab, Espaço para pegar e setas para posicionar ([NN/g, Drag and Drop](https://www.nngroup.com/articles/drag-drop/)).

O leitor de tela recebe o estado por região viva, porque `aria-grabbed` e `aria-dropeffect` estão obsoletos ([Salesforce UX](https://medium.com/salesforce-ux/4-major-patterns-for-accessible-drag-and-drop-1d43f64ebf09); [Smashing Magazine, Dragon Drop](https://shop.smashingmagazine.com/2018/01/dragon-drop-accessible-list-reordering/)).

## Criar a partir da tabela atual é o caminho mais curto

Há 2 caminhos para criar. Do zero, pelo "+", a ordem é quase sempre tipo primeiro e nome depois. A partir do estado atual, a visualização nova herda filtro e ordenação.

| Produto | Do zero | A partir da atual | Fonte |
|---|---|---|---|
| Notion | "+" > tipo > nome | Copiar configuração de uma visualização existente | [Notion](https://www.notion.com/help/views-filters-and-sorts); [Notion, guia](https://www.notion.com/help/guides/databases-reimagined-whats-changed) |
| ClickUp | "+ View" > modal de tipo, com caixas "Private view" e "Pin view"; nome depois, no Customize | "Save as new view" | [ClickUp, add view](https://help.clickup.com/hc/en-us/articles/26032576190615-Add-a-view); [ClickUp, save](https://help.clickup.com/hc/en-us/articles/6310370965911-Save-view-changes) |
| monday | "+" abaixo do título; "More views" abre o Views Center | "Save to this view" no painel de filtro, com nome | [monday, views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views); [monday, filtros](https://support.monday.com/hc/en-us/articles/360003624660-The-Board-Filters) |
| Twenty | "Add view" > formulário no próprio dropdown: ícone, nome (foco automático), tipo; Enter cria | Modo `create-from-current` copia filtros, ordenações e agregações; nome já preenchido | [ViewPickerContentCreateMode.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentCreateMode.tsx); [useCreateViewFromCurrentState.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/hooks/useCreateViewFromCurrentState.ts) |
| Airtable | "+ Create new…" > tipo > nome e Collaborative, Personal ou Locked > "Create new view" | Não confirmado | [Airtable](https://support.airtable.com/docs/getting-started-with-airtable-views) |
| Baserow | Tipo > Collaborative ou Personal > nome único > "Create view" | Duplicar leva filtros, ordenações, campos e formatação | [Baserow](https://baserow.io/user-docs/create-custom-views-of-your-data) |
| HubSpot | "+ add view" > tipo > nome; depois filtros, colunas e "Publish" | "clone to new view" | [HubSpot](https://knowledge.hubspot.com/records/create-and-manage-saved-views) |
| Attio | Nome da visualização > "+ Create new" > Table > título > "Confirm" | "Save as new view" na seta do "Save for everyone" | [Attio, table views](https://attio.com/help/reference/managing-your-data/views/create-and-manage-table-views); [Attio, filter and sort](https://attio.com/help/reference/managing-your-data/views/filter-and-sort-views) |
| Linear | Views > tipo > "New view" | Option/Alt+V ou ícone "Save view", com pelo menos 1 filtro | [Linear](https://linear.app/docs/custom-views) |
| Polaris | Aba "+" > modal com campo "Name" > "Create view" | "Save as" abre "Save view as" com nome | [Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json) |
| Smartsheet | "New saved filter" > nome > "Just me" ou "Shared" > critérios > "Save" | "Save filter" sobre critérios temporários | [Smartsheet](https://help.smartsheet.com/articles/2483528-filter-your-data-table-board-and-timeline-view) |

O Twenty tem 2 detalhes que o ENSPACE reaproveita. Kanban exige o campo de etapas e Calendário exige o campo de data; sem campo adequado, o botão "Create" dá lugar a "Go to Settings" ([ViewPickerContentCreateMode.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentCreateMode.tsx)). Quem não tem a permissão de visualizações cria sempre visualização pessoal ([ViewPickerContentEffect.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentEffect.tsx)).

A visibilidade entra no mesmo passo da criação no Airtable, no Baserow, no Smartsheet e no Salesforce ([Airtable](https://support.airtable.com/docs/getting-started-with-airtable-views); [Baserow](https://baserow.io/user-docs/create-custom-views-of-your-data); [Smartsheet](https://help.smartsheet.com/articles/2483528-filter-your-data-table-board-and-timeline-view); [Xappex, terceiro](https://www.xappex.com/blog/how-to-create-a-list-view-in-salesforce/)). O HubSpot a deixa para depois, em "Manage sharing" ([HubSpot](https://knowledge.hubspot.com/records/create-and-manage-saved-views)).

Nome padrão da visualização nova: não confirmado em nenhum produto. Nome da cópia: "Copy of {name}" no Polaris e "<nome> copy" no NocoDB, que duplica sem confirmação ([Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json); [NocoDB](https://nocodb.com/docs/product-docs/views/actions-on-view)).

A NN/g apoia o padrão "a partir da atual" por um princípio geral: reusar as escolhas anteriores como padrão ([NN/g, Wizards](https://www.nngroup.com/articles/wizards/)). Nenhum estudo comparou criar a partir da atual com criar em branco. Um relato do Front mostra o custo de salvar menos que a tela: a pessoa refaz a busca todo dia ([Front Community](https://community.front.com/beta-inbox-ux-updates-76/option-to-save-a-search-as-a-view-3554)). A visualização salva precisa guardar o estado inteiro: filtros, colunas e ordem.

### O construtor fica num painel ou num menu único

O Notion reúne layout, propriedades, filtro, ordenação e agrupamento num menu "View options" ([Notion, guia](https://www.notion.com/help/guides/databases-reimagined-whats-changed)). O ClickUp abre o "Customize" numa barra lateral direita, com nome, ícone, campos, filtro, agrupamento e os controles de fixar, privar, proteger e padrão ([ClickUp, Customize](https://help.clickup.com/hc/en-us/articles/7255389296919-Customize-List-view)). O HubSpot abre um painel com nome, filtros, ordenação, compartilhamento, exportar e excluir ([HubSpot, updated index page](https://knowledge.hubspot.com/records/manage-saved-views-in-the-updated-index-page)). O Twenty divide: nome e ícone no dropdown, filtro e ordenação em chips numa 2ª linha, campos e layout no menu Options ([ViewBarDetails.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/ViewBarDetails.tsx); [Twenty, doc](https://docs.twenty.com/user-guide/views-pipelines/overview)).

| Parte do construtor | Como os produtos fazem | Fonte |
|---|---|---|
| Colunas | Caixas de seleção num diálogo, arrastar para reordenar, "Apply" grava (HubSpot); "Fields" marca e desmarca, cabeçalho arrastável (GitHub); "Hide attribute", "Move left", "Move right" no cabeçalho (Attio); "Property visibility" por visualização (Notion) | [HubSpot](https://knowledge.hubspot.com/records/create-and-manage-saved-views); [GitHub, table layout](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-table-layout); [Attio](https://attio.com/help/reference/managing-your-data/views/create-and-manage-table-views); [Notion](https://www.notion.com/help/views-filters-and-sorts) |
| Ordenação | Vários níveis, reordenados pela alça `⋮⋮` (Notion) ou `:::` (Attio); GitHub documenta só primária e secundária | [Notion](https://www.notion.com/help/views-filters-and-sorts); [Attio](https://attio.com/help/reference/managing-your-data/views/filter-and-sort-views); [GitHub](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-table-layout) |
| Filtro | Grupos AND/OR aninhados até 3 níveis (Notion); grupos E/OU (Attio); filtro rápido com a contagem de itens por opção (monday) | [Notion](https://www.notion.com/help/views-filters-and-sorts); [Attio](https://attio.com/help/reference/managing-your-data/views/filter-and-sort-views); [monday, filtros](https://support.monday.com/hc/en-us/articles/360003624660-The-Board-Filters) |
| Congelar coluna | "Freeze up to column" no cabeçalho (Notion) | [Notion](https://www.notion.com/help/views-filters-and-sorts) |

A NN/g desaconselha modal "for complex decision making that requires additional sources of information unavailable in the modal" ([NN/g, Modal & Nonmodal](https://www.nngroup.com/articles/modal-nonmodal-dialog/)). Escolher colunas e filtros pede olhar a tabela. A NN/g também recomenda prévia em tempo real em aplicação complexa ([NN/g, Complex Application Design](https://www.nngroup.com/articles/complex-application-design/)). Daí a inferência do painel lateral não modal com a tabela atualizando ao lado. Nenhum estudo comparou modal, painel e edição no lugar para configurar tabela. Assistente em etapas serve a tarefa rara de novato; criar visualização é tarefa frequente de quem usa a tabela todo dia ([NN/g, Wizards](https://www.nngroup.com/articles/wizards/)). Divulgação progressiva fica em até 2 níveis ([NN/g, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)).

### O menu da visualização vai de 3 a 13 grupos de ação

O Twenty tem 3 ações por linha: favoritar, editar, excluir ([ViewPickerOptionDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerOptionDropdown.tsx)). O clique direito do ClickUp tem 13 grupos, entre eles renomear, copiar link, fixar, privar, proteger, "Autosave for me", "Set as default view", duplicar, exportar e excluir ([ClickUp, Views Bar](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)). O Polaris fica no meio, com 5: "Rename view", "Duplicate view", "Edit view", "Edit columns", "Delete view" ([Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json)).

O gatilho do menu muda de lugar. Airtable, Baserow, NocoDB e Linear usam o "…" ao lado do nome. GitHub e Salesforce usam uma engrenagem fixa que vale para a visualização ativa. O monday usa 3 pontos na aba ativa e clique direito nas outras ([Airtable](https://support.airtable.com/docs/getting-started-with-airtable-views); [GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views); [monday](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)).

A NN/g dá a regra para o gatilho:
- visível, perto do conteúdo, sem depender de hover e com rótulo;
- menus "missed entirely" quando o ícone estava longe, pequeno ou com pouco contraste;
- as pessoas entendem o kebab como "mais opções" sem saber o que há dentro ([NN/g, Contextual Menus](https://www.nngroup.com/articles/contextual-menus-guidelines/)).

O SAP pede que nenhuma ação fique só no menu de contexto e indica um botão de ícone para abri-lo ([SAP, Contextual menus](https://www.sap.com/design-system/btp/components/extensions/contextual-menus/usage)). Atlassian e Fluent desaconselham botões aninhados dentro da aba ([Atlassian, Tabs](https://atlassian.design/components/tabs/usage); [Fluent 2, TabList](https://fluent2.microsoft.design/components/web/react/core/tablist/usage)). O APG resolve com `aria-haspopup` na aba e Shift+F10 para abrir o menu ([WAI-ARIA APG, Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)).

Renomear por clique duplo na aba: não confirmado em nenhum dos 16 produtos. Cerca de 10% dos participantes do Baymard, em geral com 50 anos ou mais, dão clique duplo em link e botão por hábito ([Baymard](https://baymard.com/blog/users-double-click-online)). Clique duplo serve de atalho, nunca de caminho único.

## Mudança não salva vale só para quem mexeu até alguém salvar

Os produtos que salvam visualização seguem 3 modelos.

| Modelo | Produtos | Sinal | Ações | Fonte |
|---|---|---|---|---|
| Marca e salvar explícito | GitHub Projects | Ponto ao lado do nome da aba | "View options" > "Save changes"; descartar não citado | [GitHub Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/managing-your-views) |
| | SAP Fiori | Asterisco depois do nome | "Save" (desligado sem permissão), "Save As" | [SAP v1-84](https://www.sap.com/design-system/fiori-design-web/v1-84/ui-elements/variant-management/usage); [SAP v1-30](https://experience.sap.com/fiori-design-web/v1-30/variant-management) |
| | Twenty | 2ª linha da barra abre sozinha | "Reset"; botão dividido "Update view" + "Create view"; na padrão, só "Save as new view" | [ViewBarDetails.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/ViewBarDetails.tsx); [UpdateViewButtonGroup.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/UpdateViewButtonGroup.tsx) |
| | ClickUp | Botão "Save view" aparece no canto | Seta: "Enable Autosave", "Save as new view", "Revert changes" | [ClickUp, save](https://help.clickup.com/hc/en-us/articles/6310370965911-Save-view-changes) |
| | Notion | Não confirmado | "Save for everyone", "Reset" | [Notion, 2022-03-15](https://www.notion.com/releases/2022-03-15) |
| | Attio | Não confirmado | "Save for everyone", "Save as new view", "Discard changes" | [Attio](https://attio.com/help/reference/managing-your-data/views/filter-and-sort-views) |
| | Polaris | Não confirmado | "Save" ou "Save as" conforme a visualização aceita alteração; "Cancel" | [Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx) |
| Camada pessoal sobre a compartilhada | HubSpot | Filtro grava sozinho no perfil da pessoa | Só o criador ou o Super Admin salvam na visualização | [HubSpot, updated index page](https://knowledge.hubspot.com/records/manage-saved-views-in-the-updated-index-page); [HubSpot](https://knowledge.hubspot.com/records/create-and-manage-saved-views) |
| | Jira Cloud | Não confirmado | Membro muda para si; "Reset" volta à versão do admin | [Atlassian Support](https://support.atlassian.com/jira-software-cloud/docs/save-and-share-views-from-your-list/) |
| | Linear | Não confirmado | Display options persistem para a pessoa; "Set as default" vale para o workspace | [Linear, display options](https://linear.app/docs/display-options) |
| Salvar por cima, para todos | monday | Não confirmado | "Save to this view" muda para todos (fórum) | [monday, filtros](https://support.monday.com/hc/en-us/articles/360003624660-The-Board-Filters); [Comunidade monday](https://community.monday.com/t/views-permissions-for-the-save-to-view-option/38358) |

O padrão comum tem 4 peças:
- a mudança vale só para quem a fez;
- um botão primário salva para todos;
- uma ação secundária cria outra visualização a partir da atual;
- uma ação descarta.

O SAP e o Polaris chegam, cada um por conta própria, à mesma regra para a visualização que não se altera: "Save" desligado e "Save as" ligado ([SAP v1-30](https://experience.sap.com/fiori-design-web/v1-30/variant-management); [Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx)).

O Asana mostra o custo de descartar em silêncio. A mudança não salva se perde ao sair da aba, e usuários relatam que o produto "reverte" o que fizeram ([Fórum Asana](https://forum.asana.com/t/changes-keep-reverting-back-in-asana-critical-bug-issue/909484)). A NN/g pede aviso antes de sair de formulário e chance de cancelar ([NN/g, User Control and Freedom](https://www.nngroup.com/articles/user-control-and-freedom/)). O Grafana separa "Aplicar" (prévia) de "Salvar" (definitivo) e avisa quando algo foi aplicado e não salvo ([Grafana Saga, Save pattern](https://grafana.com/developers/saga/patterns/save/)).

Quem mudou a visualização e não salvou volta à última versão salva no próximo carregamento no Attio ([Attio](https://attio.com/help/reference/managing-your-data/views/filter-and-sort-views)). Se a mudança sobrevive a recarregar no Notion e no Twenty: não confirmado. No Twenty, filtros que chegam pela URL não mostram "Reset" nem "Update view" ([UpdateViewButtonGroup.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/UpdateViewButtonGroup.tsx)). No Linear, o filtro na URL é temporário e não fica na visualização ([Linear](https://linear.app/docs/custom-views)). Pelo código do Twenty, a comparação cobre filtro, ordenação e busca; se colunas entram na comparação: não confirmado em nenhum produto.

**Escopo pessoal e para todos.** Os nomes variam, e a função é a mesma:

| Produto | Opções de visibilidade | Fonte |
|---|---|---|
| Airtable | Collaborative, Personal, Locked | [Airtable](https://support.airtable.com/docs/getting-started-with-airtable-views) |
| Baserow | Collaborative, Personal (colaborativa não vira pessoal; duplica-se como pessoal) | [Baserow](https://baserow.io/user-docs/create-custom-views-of-your-data) |
| NocoDB | Collaborative, Locked (com motivo), Personal (com dono transferível) | [NocoDB](https://nocodb.com/docs/product-docs/views/actions-on-view) |
| HubSpot | Private (padrão), Team, Everyone, Custom | [HubSpot](https://knowledge.hubspot.com/records/create-and-manage-saved-views) |
| Salesforce | "Only I can see this view", "All users can see this view", "Share with groups" (terceiro) | [Xappex](https://www.xappex.com/blog/how-to-create-a-list-view-in-salesforce/) |
| Smartsheet | "Just me", "Shared" | [Smartsheet](https://help.smartsheet.com/articles/2483528-filter-your-data-table-board-and-timeline-view) |
| ClickUp | "Private view" na criação; visualizações são públicas por padrão; "Protect" impede alteração | [ClickUp, add view](https://help.clickup.com/hc/en-us/articles/26032576190615-Add-a-view); [ClickUp, Views Bar](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar) |
| Twenty | Workspace, Unlisted | [Twenty, doc](https://docs.twenty.com/user-guide/views-pipelines/overview) |
| SAP Fiori | Caixa "Public", que some quando o administrador limita a privadas | [SAP Help, Creating and Adapting Views](https://help.sap.com/docs/r/4fc8d03390c342da8a60f8ee387bca1a/latest/en-US/91ae3492323b42a79ca66fbfaf5af3f9.html) |

Uma lista única e compartilhada de buscas salvas dificulta achar as próprias. Usuários da IBM pedem padrão por pessoa, dono, compartilhamento e pastas ([IBM Ideas](https://ibm-data-and-ai.ideas.ibm.com/ideas/CPDIDEAS-I-2908)). O Airtable separa "My favorites" e "My personal views" no topo da lista ([Airtable](https://support.airtable.com/docs/getting-started-with-airtable-views)), e o Twenty separa "Workspace" e "My unlisted views" ([ViewPickerListContent.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerListContent.tsx)).

## A visualização do sistema não se exclui nem se altera

Cada produto protege a visualização base de um jeito:
- o Twenty mantém a "All [Objeto]" com cadeado, sem editar nem excluir, e esconde "Delete" quando resta 1 visualização ([ViewPickerOptionDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerOptionDropdown.tsx));
- o SAP entrega uma "Standard" sempre favorita e não excluível ([SAP Help, Manage Views](https://help.sap.com/docs/r/3d99fdeadde04524bdd33d35f1e13777/Cloud/en-US/1f638f22410349e5922a0699dd79bec8.html));
- o Airtable exige pelo menos 1 visualização em grade colaborativa por tabela ([Airtable](https://support.airtable.com/docs/getting-started-with-airtable-views));
- o monday não exclui a visualização quando ela é a única além da principal ([monday](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)).

A trava explícita é outro caminho: Lock no monday, Protect no ClickUp, Locked no Airtable e no NocoDB.

**Visualização padrão** (a que abre ao entrar):

| Produto | Como se define | Escopo | Fonte |
|---|---|---|---|
| ClickUp | "Set as default view" (plano Business ou superior, donos e admins) | Do local | [ClickUp, Views Bar](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar) |
| HubSpot | Arrastar a aba para a 1ª posição | Não confirmado | [HubSpot](https://knowledge.hubspot.com/records/create-and-manage-saved-views) |
| Salesforce | Alfinete ao lado do nome; fixar outra substitui | Por pessoa e por objeto (terceiro) | [Xappex](https://www.xappex.com/blog/how-to-create-a-list-view-in-salesforce/) |
| SAP Fiori | Marcar como padrão no "Manage Views" | Por pessoa; o padrão do key user não obriga | [SAP Help](https://help.sap.com/docs/r/3d99fdeadde04524bdd33d35f1e13777/Cloud/en-US/1f638f22410349e5922a0699dd79bec8.html) |
| Asana | "Set as default" no menu da aba | Todos do projeto (terceiro); usuários pedem padrão por pessoa | [Guideflow](https://www.guideflow.com/tutorial/how-to-set-tab-as-default-in-asana) |
| Linear | Favorita como página inicial nas preferências | Por pessoa | [Linear](https://linear.app/docs/custom-views) |
| Jira Cloud | Admin do espaço define | Do espaço | [Atlassian Support](https://support.atlassian.com/jira-software-cloud/docs/save-and-share-views-from-your-list/) |
| Pipefy | A última usada abre na próxima entrada | Por pessoa | [Pipefy](https://help.pipefy.com/en/articles/3143190) |

**Link da visualização.** Notion tem "Copy link to view" ([Notion](https://www.notion.com/help/views-filters-and-sorts)). ClickUp copia o link no clique direito ([ClickUp, Views Bar](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)). Linear tem "Copy view URL", e o link não dá acesso: a visualização precisa estar compartilhada ([Linear](https://linear.app/docs/custom-views)). HubSpot copia o link nas opções de compartilhamento ([HubSpot, updated index page](https://knowledge.hubspot.com/records/manage-saved-views-in-the-updated-index-page)). Link por visualização no monday, no Airtable, no Attio, no Baserow, no NocoDB e no GitHub: não confirmado.

**Excluir.** O Polaris confirma com título "Delete view?", o texto "This can't be undone." e os botões "Cancel" e "Delete view" ([Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json)). O monday desfaz pelo "Undo" no log de atividade ([monday](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)). NocoDB e Twenty avisam que a exclusão não se desfaz ([NocoDB](https://nocodb.com/docs/product-docs/views/actions-on-view); [Twenty, doc](https://docs.twenty.com/user-guide/views-pipelines/overview)). A NN/g pede confirmação só para ação grave e irreversível, botões com o resultado em vez de "Sim" e "Não", e desfazer sempre que possível ([NN/g, Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/)). Excluir visualização compartilhada afeta outras pessoas, e entra nesse caso.

## Teclado e acessibilidade: o APG define a aba, ninguém define a barra

Nenhum dos 16 produtos documenta acessibilidade da barra (papel ARIA, foco, leitor de tela): não confirmado. Os atalhos publicados são poucos:

| Produto | Atalho | Fonte |
|---|---|---|
| Airtable | Ctrl/Cmd+Shift+K abre o seletor de visualizações; +F filtro; +S ordenação; +D agrupamento | [Airtable, shortcuts](https://support.airtable.com/docs/airtable-keyboard-shortcuts) |
| Linear | O, V busca visualizações; Option/Alt+V salva como visualização; Shift+V abre Display options | [Linear](https://linear.app/docs/custom-views); [Linear, display options](https://linear.app/docs/display-options) |
| Polaris | F abre "Search and filter" | [Polaris, locales/en.json](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/locales/en.json) |
| Twenty | Enter cria e salva; o campo de nome abre com foco | [ViewPickerContentCreateMode.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentCreateMode.tsx); [ViewPickerContentEditMode.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentEditMode.tsx) |

Um seletor com busca aberto por atalho (Airtable, Linear) resolve o transbordo para quem usa teclado, qualquer que seja a forma da barra.

O WAI-ARIA APG fixa o padrão de abas ([WAI-ARIA APG, Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)):
- papéis `tablist`, `tab` e `tabpanel`, com `aria-selected="true"` só na ativa;
- Tab entra na aba ativa, e o Tab seguinte vai ao painel;
- setas esquerda e direita andam entre abas, com volta ao início; Home e End são opcionais;
- ativação no foco só quando o painel aparece sem atraso perceptível; senão, Espaço ou Enter ativa;
- Shift+F10 abre o menu da aba que declara `aria-haspopup`;
- Delete fecha a aba excluível, e o foco vai à seguinte.

Trocar de visualização consulta o servidor e recarrega a tabela. Pelo APG e pelo Carbon, isso indica ativação manual, para que as setas não disparem uma consulta por aba percorrida ([Carbon, Tabs](https://carbondesignsystem.com/components/tabs/usage/)). O `UTabs` aceita `activationMode="manual"` ([Nuxt UI, Tabs](https://ui.nuxt.com/docs/components/tabs)).

O Polaris liga as setas ao transbordo: com o menu fechado, elas percorrem só as visíveis; com ele aberto, percorrem todas ([Polaris, Tabs.tsx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Tabs/Tabs.tsx)). O botão "Mais" dentro do `tablist` precisa de `role="tab"` ([Fluent 2, TabList](https://fluent2.microsoft.design/components/web/react/core/tablist/usage)), ou fica fora da lista com `aria-haspopup`. Como o Reka trata esse botão: não confirmado.

O Primer UnderlineNav é navegação por links, com `aria-current="page"` ([Primer, UnderlineNav](https://primer.style/product/components/underline-nav/)). A troca de visualização acontece na mesma tela, então o modelo é `tablist`, não link de página. O Polaris pede que tudo funcione pelo teclado e que a pessoa seja avisada das mudanças de estado nos controles de filtro ([Polaris, index-filters.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/index-filters.mdx)).

## A evidência sustenta pouco: nenhum estudo mede a barra

O material de usabilidade fala de padrões vizinhos: navegação escondida, abas, arrastar, menus e confirmação. Nenhuma fonte trata da barra de visualizações salvas nem de busca salva com teste de usuário.

| Achado | Tipo | O que sustenta na barra | Fonte |
|---|---|---|---|
| Navegação escondida usada em 27% dos casos no desktop, contra 48% da visível e 50% da combinada; 179 pessoas, 6 sites | Estudo | Visualização no menu "Mais" é menos achada; a ordem decide o que se descobre (extrapolação) | [NN/g, Hamburger Menus](https://www.nngroup.com/articles/hamburger-menus/) |
| Navegação escondida reduz a descoberta em mais de 20% e alonga a tarefa no desktop em pelo menos 39% | Estudo | Idem | [NN/g, Hamburger Menus](https://www.nngroup.com/articles/hamburger-menus/) |
| Poucas abas, rótulo de 1 a 2 palavras, 1 linha só; aba que vira carrossel perde descoberta | Diretriz NN/g | Menu "Mais" em vez de quebrar linha | [NN/g, Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/) |
| Rolagem horizontal ignorada no desktop; setas laterais passam despercebidas | Diretriz NN/g, 2014 | Sem carrossel de abas no desktop | [NN/g, Horizontal Scrolling](https://www.nngroup.com/articles/horizontal-scrolling/) |
| Tooltip não guarda informação essencial; não existe no toque | Diretriz NN/g | Nome inteiro também fora do tooltip | [NN/g, Tooltip Guidelines](https://www.nngroup.com/articles/tooltip-guidelines/) |
| Todo arrastar tem caminho de 1 ponteiro; teclado sozinho não cumpre | Norma (WCAG 2.2 AA) | "Mover para a esquerda/direita" no menu da aba | [W3C, SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) |
| Gatilho de menu visível, perto e com rótulo | Diretriz NN/g, 2025 | Kebab visível na aba ativa | [NN/g, Contextual Menus](https://www.nngroup.com/articles/contextual-menus-guidelines/) |
| Cerca de 10% dão clique duplo por hábito | Estudo pequeno | Clique duplo só como atalho | [Baymard](https://baymard.com/blog/users-double-click-online) |
| Confirmação só para o grave; desfazer quando possível | Diretriz NN/g | Confirmar só o excluir | [NN/g, Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/) |
| Modal não serve à decisão que pede informação de fora dele | Diretriz NN/g | Construtor em painel não modal (inferência) | [NN/g, Modal & Nonmodal](https://www.nngroup.com/articles/modal-nonmodal-dialog/) |
| Língua da pessoa, sem jargão nem termo do sistema | Diretriz NN/g | Rótulo do campo, sem nome interno | [NN/g, Match Between System and Real World](https://www.nngroup.com/articles/match-system-real-world/) |
| Estado vazio diz o que aconteceu, ensina e leva à ação | Diretriz NN/g | Barra só com a padrão ensina a criar a 1ª | [NN/g, Empty State](https://www.nngroup.com/articles/empty-state-interface-design/) |
| Menu de transbordo só para ação secundária ou rara | Design system | Visualização frequente não fica no "Mais" | [American Express, Menu](https://designinternet-qaeusw1green.americanexpress.com/components/actions/menu/usage) |

A NN/g não fixa número máximo de abas, e nenhuma fonte mede o ponto em que a descoberta cai. Nenhuma fonte comparou abas roláveis com menu "Mais". O estudo de 179 pessoas mede menu de navegação global, não barra de visualizações: aplicá-lo aqui é extrapolação.

## O que nenhuma fonte confirma

Estes pontos ficam como "não confirmado" e pedem teste de tela ou decisão de produto:
- Marca visual da aba ativa (sublinhado, fundo, negrito) em qualquer produto.
- Se a visualização ativa que está no "N more" sobe para a barra no Notion e no ClickUp.
- Largura máxima e corte de nome nas abas de Notion, ClickUp, monday, HubSpot, GitHub e Asana.
- Qual aba o HubSpot fecha ao abrir a 6ª.
- Escopo da ordem das abas (pessoal ou de todos) em Notion, ClickUp, GitHub, HubSpot, Airtable e Asana.
- Nome padrão da visualização nova em todos os produtos.
- Se o "+" herda os filtros da visualização aberta no Notion, no monday, no Airtable, no Baserow e no HubSpot.
- Marca de alteração não salva no Notion, no ClickUp, no monday, no Attio e no HubSpot atual.
- Se coluna escondida ou reordenada conta como alteração não salva.
- O que acontece ao trocar de visualização com alteração não salva no SAP.
- Renomear por clique duplo na aba, em qualquer produto.
- Acessibilidade da barra (papel ARIA, anúncio de "modificado") em qualquer produto.
- Atalho de teclado para reordenar abas, em qualquer design system.
- Transbordo no Material 3 (a página não abriu) e o teclado no menu de transbordo do Fluent.
- Limite de visualizações salvas no Polaris e regra de nome (obrigatório, tamanho) no SAP.
- Estudo com usuários sobre descoberta e reuso de visualizações ou buscas salvas.

As notas também registram fontes que não abriram: help.salesforce.com, trailhead.salesforce.com (404 na leitura direta), as páginas atuais do SAP Fiori (403), m3.material.io e o Storybook do Fluent. Os dados do Salesforce vêm de guia de terceiro (Xappex) e de resumo de busca.

## Conclusão

A escolha principal da barra não é entre aba e dropdown. É entre mostrar tudo e mostrar um subconjunto escolhido. HubSpot (5 abas abertas), SAP (só favoritas no seletor) e ClickUp (modal de gestão no "more") resolvem o crescimento com 2 níveis: uma barra curta e um lugar com busca que guarda todas. O estudo da NN/g indica que o que fica no 2º nível é menos achado. Por isso, quem decide o que fica visível precisa ser a pessoa (fixar, reordenar), e a visualização ativa nunca sai da barra.

O ENSPACE precisa fechar 3 políticas antes do desenho final, porque o mercado se divide nelas: escopo da ordem, quem salva por cima da visualização compartilhada e escopo da visualização padrão. A escolha mais segura para um workspace com dados de várias pessoas tem 3 partes: camada pessoal até salvar, "Salvar" restrito por permissão e "Salvar como nova" sempre ligado. Jira Cloud, SAP, Polaris e Twenty convergem nesse desenho. Como a evidência é quase toda convenção, o protótipo deve ser testado com usuários em 3 pontos: descoberta do menu "Mais", leitura da marca de não salvo e caminho de reordenar sem arrastar.

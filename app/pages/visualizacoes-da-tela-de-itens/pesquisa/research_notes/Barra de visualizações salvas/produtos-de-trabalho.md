# Barra de visualizações salvas e editor de visualização: Notion, ClickUp, monday.com, Pipefy e Twenty CRM

Pesquisa de 2026-10-23. Fonte primária: central de ajuda de cada produto e, no Twenty, o código-fonte no GitHub
(branch `main`, commit `c13b414`, de 2026-10-23). As centrais do ClickUp e do monday devolvem 403 ao acesso
direto; foram lidas pelo leitor `r.jina.ai`, e o link citado é o original. "Não confirmado" marca o que nenhuma
fonte descreve. Fórum e guia de terceiros vêm marcados como tal.

Legenda curta das fontes mais citadas:
- Notion: [N-ajuda](https://www.notion.com/help/views-filters-and-sorts), [N-2022](https://www.notion.com/releases/2022-03-15), [N-guia](https://www.notion.com/help/guides/databases-reimagined-whats-changed)
- ClickUp: [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar), [C-salvar](https://help.clickup.com/hc/en-us/articles/6310370965911-Save-view-changes), [C-ordem](https://help.clickup.com/hc/en-us/articles/26004419744023-Group-and-reorder-views), [C-fixar](https://help.clickup.com/hc/en-us/articles/26001290663959-Pin-a-view), [C-criar](https://help.clickup.com/hc/en-us/articles/26032576190615-Add-a-view), [C-customize](https://help.clickup.com/hc/en-us/articles/7255389296919-Customize-List-view)
- monday: [M-views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views), [M-filtros](https://support.monday.com/hc/en-us/articles/360003624660-The-Board-Filters)
- Pipefy: [P-views](https://help.pipefy.com/en/articles/3143190)
- Twenty: [T-doc](https://docs.twenty.com/user-guide/views-pipelines/overview) e os arquivos de [`views/view-picker/components`](https://github.com/twentyhq/twenty/tree/main/packages/twenty-front/src/modules/views/view-picker/components) e [`views/components`](https://github.com/twentyhq/twenty/tree/main/packages/twenty-front/src/modules/views/components)

## 1. Forma da barra: abas, dropdown, marcação da visão ativa, ícone por tipo, contagem

### Takeaway
Notion, ClickUp e monday (cabeçalho expandido) usam abas horizontais; monday com cabeçalho recolhido, Pipefy e Twenty usam 1 botão dropdown com o nome da visão atual. Só o Twenty documenta (no código) a contagem de registros ao lado do nome; nenhuma central descreve como a aba ativa é marcada.

### Cited Findings
**Notion**
- Visões aparecem como abas no topo da base; a visão de tabela é a inicial e as outras entram pelas abas — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts); [N-guia](https://www.notion.com/help/guides/databases-reimagined-whats-changed)
- Cada aba pode ser exibida como "Icon only", "Text only" ou ícone e texto, pelo menu da aba em "Display as"; a mudança vale só para quem a fez — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- Em base de página inteira, as visões também aparecem aninhadas na barra lateral, marcadas com `•` — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- O guia justifica as abas: destacam as visões importantes "em vez de escondê-las num dropdown" — [N-guia](https://www.notion.com/help/guides/databases-reimagined-whats-changed)

**ClickUp**
- A Views Bar fica no topo de Overview, All Tasks, Space, Folder, Subfolder ou List, abaixo da barra de ferramentas e do cabeçalho do local — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)
- Ordem fixa por blocos: Overviews primeiro (não se movem), depois as fixadas, depois as não fixadas; dentro de cada bloco, ordem de criação por padrão — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)
- As visões podem ser agrupadas por tipo, com o toggle "Group views by type" no menu More do local ou no menu de visões extras — [C-ordem](https://help.clickup.com/hc/en-us/articles/26004419744023-Group-and-reorder-views)

**monday.com**
- Cabeçalho expandido: as visões aparecem como abas no topo do board. Cabeçalho recolhido: uma seta ao lado do nome da visão atual abre a lista para trocar de visão. A seta à direita do cabeçalho alterna entre os 2 estados — [M-views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)
- O botão `+` de nova visão fica logo abaixo do título do board — [M-views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)

**Pipefy**
- Um dropdown no canto superior esquerdo, abaixo do nome do pipe, mostra a visão ativa; clicar no nome abre a lista das 3 visões (Kanban, Lista, Calendário) — [P-views](https://help.pipefy.com/en/articles/3143190)
- Apps de Calendário e Sprint também entram nesse menu (anúncio da comunidade de 2021) — [Comunidade Pipefy](https://community.pipefy.com/news-and-announcements-49/apps-and-integrations-calendar-and-sprint-970)

**Twenty**
- Um único botão no canto superior esquerdo: ícone da visão atual (ou ícone de lista quando não há visão), nome, "· {total de registros}" e chevron. Quando não há visão, o nome exibido é "All" — [ViewPickerDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerDropdown.tsx)
- À direita da mesma barra ficam Filtro, Ordenação e o menu Options; uma segunda linha (ViewBarDetails) aparece abaixo com os chips de filtro e ordenação — [ViewBar.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/ViewBar.tsx)
- Na lista aberta, cada visão mostra o ícone escolhido para ela; a visão atual recebe `selected` — [ViewPickerListContent.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerListContent.tsx); [ViewPickerOptionDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerOptionDropdown.tsx)
- Na criação, o ícone padrão segue o tipo de visão (`viewTypeIconKeyMapping`), e a pessoa pode trocar por outro — [ViewPickerContentCreateMode.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentCreateMode.tsx)

### Inferences
- Há 2 famílias: abas (visão vista sem clique, gasta largura) e dropdown (1 clique a mais, cabe em qualquer largura). O monday oferece as 2 no mesmo board, pelo recolher do cabeçalho.
- Contagem de itens junto do nome da visão aparece só no Twenty, e é a contagem da visão atual, não de cada visão da lista.

### Gaps
- Marcação visual da aba ativa (sublinhado, fundo, negrito) no Notion, ClickUp e monday: não confirmado; nenhuma central descreve.
- Contagem por visão nas abas do Notion, ClickUp e monday: não confirmado.

## 2. Transbordo: nomes longos, "N mais", visão ativa sempre visível, busca, fixadas, rolagem

### Takeaway
Notion e ClickUp mandam o excesso para um menu "N more"; o do ClickUp abre um modal com busca, fixar, reordenar e agrupar. O monday resolve com abas fixadas e com o cabeçalho recolhido. O Twenty corta o nome em 130px com reticências e tooltip, e a lista do dropdown rola. Nenhuma fonte diz se a visão ativa escondida no transbordo sobe para a barra.

### Cited Findings
**Notion**
- Com muitas visões, aparece "{#} more..." ao lado das abas para chegar às demais — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- Em tela pequena, a criação passa pelo nome da visão atual: clicar nele e escolher "New view" — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)

**ClickUp**
- Quando a barra enche, as visões extras vão para um menu; o número de visões extras aparece ao lado dele — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)
- O menu "more..." abre um modal em que se busca e abre visões, e onde se fixa, reordena e agrupa — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)
- Esse menu só aparece com a barra cheia — [C-ordem](https://help.clickup.com/hc/en-us/articles/26004419744023-Group-and-reorder-views)
- Fixadas aparecem antes das não fixadas; a recomendação é fixar só as de uso frequente — [C-fixar](https://help.clickup.com/hc/en-us/articles/26001290663959-Pin-a-view)

**monday.com**
- Visões fixadas "ficam visíveis quando o board abre"; só o dono do board fixa — [M-views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)
- Limite de 100 visões por board — [M-views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)
- Fórum: usuários reclamam de visões que "não se acham" por ficarem no dropdown e citam limite de 3 fixadas, contando a principal (post antigo; a página devolveu 404 na leitura direta, dado tirado do resumo da busca) — [Comunidade monday](https://community.monday.com/t/board-views-cannot-be-found-because-they-are-hidden-in-a-dropdown-should-be-viewable-via-tabs/11137)

**Twenty**
- Nome da visão no botão: `max-width: 130px`; 110px entre 376px e a largura móvel; 90px até 375px; texto cortado com o componente `OverflowingTextWithTooltip` (reticências e tooltip com o nome inteiro) — [ViewPickerDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerDropdown.tsx)
- A lista do dropdown usa `hasMaxHeight` (altura máxima, rola); as visões se dividem em "Workspace" e "My unlisted views", com rótulo de seção só quando as 2 existem — [ViewPickerListContent.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerListContent.tsx)
- A visão padrão (chave `INDEX`) sai da lista, salvo quando é a visão atual — [computeViewPickerVisibleViews.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/utils/computeViewPickerVisibleViews.ts)
- Não há busca dentro do dropdown de visões nos arquivos lidos — [ViewPickerListContent.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerListContent.tsx)
- Atalho para visão: "Add to favorites" leva a visão para a seção de favoritos da navegação — [T-doc](https://docs.twenty.com/user-guide/views-pipelines/overview)

**Pipefy**
- Só 3 visões fixas; não há transbordo — [P-views](https://help.pipefy.com/en/articles/3143190)

**Outros produtos (dor recorrente)**
- Airtable: nomes longos de visão cortados na lista, e o nome inteiro só aparece no hover — [Comunidade Airtable](https://community.airtable.com/legacy-product-ideas-75/giving-more-space-to-display-the-name-of-a-view-42634)

### Inferences
- O ClickUp é o único que trata o transbordo como gerenciador (modal com busca e organização), não só como lista. Para muitas visões, busca no transbordo é o diferencial documentado.
- Largura máxima fixa com reticências e tooltip (Twenty) é a regra explícita mais próxima de uma especificação; os outros não publicam limite.

### Gaps
- Se a visão ativa que está no "N more" é trazida para a barra visível (Notion, ClickUp): não confirmado.
- Largura máxima e corte de nome nas abas do Notion, ClickUp e monday: não confirmado.
- Rolagem horizontal da barra de abas em algum dos produtos: não confirmado.
- Quantas abas o monday mostra antes de transbordar: não confirmado.

## 3. Reordenar visões

### Takeaway
Todos com visões salvas permitem arrastar. O monday guarda a ordem por pessoa; o Twenty grava a posição na própria visão (compartilhada para as do workspace); ClickUp e Notion não dizem se a ordem é pessoal.

### Cited Findings
- Notion: "Reorder views by dragging them" — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- ClickUp: arrastar na horizontal; qualquer pessoa, inclusive convidado com edição, reordena e agrupa as visões a que tem acesso; disponível em todos os planos — [C-ordem](https://help.clickup.com/hc/en-us/articles/26004419744023-Group-and-reorder-views)
- ClickUp: fixadas só se reordenam entre fixadas e grupos; não fixadas, entre não fixadas — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)
- ClickUp, histórico: até 2024-09-04 só dava para reordenar visões fixadas, o que deixava "ícones de alfinete em toda visão"; nesse dia a equipe liberou reordenar todas. No dia seguinte um usuário relatou que as visões dentro do "n more" expandido não se reordenavam, e a equipe tratou como bug — [Feedback ClickUp](https://feedback.clickup.com/feature-requests/p/reorder-viewstabs)
- ClickUp: o modal do "more..." permite reordenar — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)
- monday: arrastar para a nova posição ou usar o dropdown de visões; "a ordem é salva por membro", cada pessoa mantém o próprio arranjo. Fixadas só se reordenam entre si, e depois de fixadas os outros membros não as reordenam — [M-views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)
- Twenty: arrastar dentro do dropdown, em 2 listas separadas (Workspace e não listadas); ao soltar, o front grava `position` de cada visão que mudou pela API; arrastar fica desligado quando a seção tem 1 visão — [ViewPickerListContent.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerListContent.tsx)
- Twenty: "arraste a visão pela alça; a ordem salva sozinha" — [T-doc](https://docs.twenty.com/user-guide/views-pipelines/overview)

### Inferences
- No Twenty, `position` é campo da visão; visão do workspace tem a mesma ordem para todos (inferido do modelo de dados; a doc não diz).
- A queixa do ClickUp mostra que ordenar só na barra visível, e não no transbordo, gera reclamação.

### Gaps
- Notion e ClickUp: ordem pessoal ou compartilhada: não confirmado.

## 4. Criar visão

### Takeaway
Notion, ClickUp e monday escolhem o tipo primeiro; o nome vem depois (Notion no fluxo; ClickUp só depois de aberta, no Customize). O Twenty abre um formulário dentro do próprio dropdown com nome, ícone e tipo juntos, e tem o modo "criar a partir da atual", que copia filtros, ordenações e agregações.

### Cited Findings
**Notion**
- Passos: `+` ao lado do nome da base ou das abas → escolher o tipo → dar o nome. Tipos: Table, Board, Timeline, Calendar, List, Gallery, Chart — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- Ao criar, dá para escolher uma fonte de dados e passar o mouse para pré-visualizar uma visão existente e recriar seus filtros, ordenações, agrupamento e propriedades visíveis — [N-guia](https://www.notion.com/help/guides/databases-reimagined-whats-changed)

**ClickUp**
- Passos: "+ View" na Views Bar (à direita do menu more) → abre o modal Views → escolher ou buscar o tipo. No canto inferior direito do modal, 2 caixas: "Private view" e "Pin view" — [C-criar](https://help.clickup.com/hc/en-us/articles/26032576190615-Add-a-view); [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)
- A visão abre já criada; nome e ajustes vêm depois, no menu Customize à direita — [C-criar](https://help.clickup.com/hc/en-us/articles/26032576190615-Add-a-view)
- "Save as new view" duplica a visão com a última mudança, sem alterar a original — [C-salvar](https://help.clickup.com/hc/en-us/articles/6310370965911-Save-view-changes)
- Configurações salvas podem virar padrão de toda visão nova criada pela pessoa (Default View Templates) — [C-salvar](https://help.clickup.com/hc/en-us/articles/6310370965911-Save-view-changes)

**monday.com**
- `+` abaixo do título do board; "More views" abre o Views Center; app views vêm do marketplace — [M-views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)
- Criar a partir do filtro: definir as condições → "Save to this view" no canto superior direito do painel de filtro → dar nome → salvar — [M-filtros](https://support.monday.com/hc/en-us/articles/360003624660-The-Board-Filters)
- Criação por IA (Sidekick) gera visão a partir de uma descrição, só para alguns widgets — [M-views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)

**Twenty**
- Pela lista: "Add view" no rodapé do dropdown → o dropdown troca para o modo "Create view": botão X no cabeçalho, seletor de ícone + campo de nome (foco automático), select "View type"; Kanban exige escolher o campo de etapas ("Stages") e Calendário o campo de data; sem campo adequado, aparece o aviso e o botão "Go to Settings" no lugar de "Create". Enter cria — [ViewPickerContentCreateMode.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentCreateMode.tsx); [ViewPickerCreateButton.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerCreateButton.tsx)
- Nome padrão: o campo nasce preenchido com o nome da visão de referência (a atual); o tipo também vem dela; no modo vazio o ícone é o do tipo, no modo "a partir da atual" é o da visão de referência — [ViewPickerContentEffect.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentEffect.tsx)
- Modos `create-empty` e `create-from-current`; só o segundo copia filtros, ordenações e agregações (`shouldCopyFiltersAndSortsAndAggregate`). Depois de criar, a tela troca para a visão nova — [useCreateViewFromCurrentState.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/hooks/useCreateViewFromCurrentState.ts)
- Visibilidade da nova: a da visão de referência, se a pessoa tem a permissão VIEWS; sem ela, sempre "Unlisted" (pessoal) — [ViewPickerContentEffect.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentEffect.tsx)
- Doc: 2 caminhos. Pelo dropdown (Add view → nome → Create → layout em Options → filtros → campos → Save) ou "editar primeiro" (montar filtros → "Save as new view" → nome → Create → seguir editando → "Update view") — [T-doc](https://docs.twenty.com/user-guide/views-pipelines/overview)

**Pipefy**
- Não há criação de visão; as 3 são fixas — [P-views](https://help.pipefy.com/en/articles/3143190)
- Ideia da comunidade (julho de 2024) pede salvar um conjunto de filtros como "View", porque hoje é preciso marcar e desmarcar filtros toda vez; status não confirmado — [Comunidade Pipefy](https://community.pipefy.com/ideas/saved-views-in-pipes-4013)

### Inferences
- Contagem de cliques (inferida dos passos): Notion 3 (`+`, tipo, nome); ClickUp 2 para criar e mais 2 ou 3 para nomear no Customize; Twenty 2 ou 3 a partir da barra modificada (chevron do Update view → Create view → Create, com nome já preenchido).
- "Criar a partir da atual" é explícito no Twenty, no "Save as new view" do ClickUp e no "Save to this view" do monday; no Notion o equivalente é copiar configuração de uma visão existente ao criar.

### Gaps
- Nome padrão de visão nova no Notion, ClickUp e monday: não confirmado.
- Se a visão nova do Notion ou do monday (pelo `+`) herda os filtros e colunas da atual: não confirmado.
- Formato do seletor de tipo do Notion (popover ou menu): não confirmado.

## 5. Editar visão: renomear, menu de contexto, painel de configurações, colunas, filtros, ordenação

### Takeaway
Notion e ClickUp têm menu na aba e um painel de configuração da visão (Notion: "View settings"/"View options" no canto superior direito; ClickUp: "Customize", painel lateral à direita). O Twenty edita nome e ícone dentro do dropdown e deixa filtros e ordenação como chips numa segunda linha. Ordenação em vários níveis está documentada no Notion. Renomear com duplo clique: nenhuma fonte descreve.

### Cited Findings
**Notion**
- Clicar no nome da visão abre: renomear, duplicar, excluir, copiar link, editar componentes — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- Menu de configurações no canto superior direito da base: Layout, Property visibility, Filter, Sort, Group, Sub-group, "Copy link to view"; Layout define abrir página em side peek, center peek ou página inteira — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- Tudo foi reunido num único menu "View options" (layout, propriedades, filtro, ordenação, agrupamento) — [N-guia](https://www.notion.com/help/guides/databases-reimagined-whats-changed)
- Propriedades: ligar e desligar por visão em Property visibility — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- Filtro simples: escolher a propriedade; filtro avançado: "Add advanced filter", regras com AND/OR, grupos aninhados até 3 níveis; filtro simples vira avançado por `•••` → "Add to advanced filter"; excluir por `•••` → "Delete filter" — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- Filtros rápidos (quick filters) aparecem no topo da base — [N-guia](https://www.notion.com/help/guides/databases-reimagined-whats-changed)
- Ordenação em vários níveis: as ordenações valem na ordem da lista e se reordenam arrastando pela alça `⋮⋮`; remover com `X` — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- Congelar coluna: clicar no nome da coluna → "Freeze up to column" — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- Bloqueio: "Lock database" impede mudança de estrutura (propriedades, layout, mostrar e esconder propriedades); qualquer editor desbloqueia (guia de terceiro) — [Simone Smerilli](https://www.simonesmerilli.com/writing/notion-database-settings)

**ClickUp**
- Clique direito no nome da visão: Rename, copiar link, adicionar aos favoritos, à seção da barra lateral ou ao topo; Customize view; Pin/Unpin; Private; Protect (ninguém altera a configuração); "Autosave for me"; "Set as default view" (Business ou superior, donos e admins); duplicar como outro tipo ou do mesmo tipo; Export (só List e Table); Templates; mover a visão de local; Delete (algumas não se restauram); Sharing & Permissions — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)
- Customize: botão no canto superior direito; abre a barra lateral direita com ícone e nome, opções da lista (status vazios, quebrar texto, mostrar tarefas fechadas etc.), More options (Default to Me Mode, duplicar, voltar ao padrão), Fields, Filter, Group, Subtasks, e os mesmos controles de fixar, privar, proteger, padrão, link, favoritos, exportar e compartilhar — [C-customize](https://help.clickup.com/hc/en-us/articles/7255389296919-Customize-List-view)
- Largura de coluna: arrastar a borda do cabeçalho — [C-customize](https://help.clickup.com/hc/en-us/articles/7255389296919-Customize-List-view)

**monday.com**
- Menu de 3 pontos na aba ativa; nas outras abas, clique direito. Itens documentados: Pin/Unpin view (dono do board), Lock view (Pro e Enterprise, com confirmação; dono e admin seguem editando; toda visão bloqueável menos app views), Hide main table (dono ou admin; exige outra visão), Delete — [M-views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)
- Filtro rápido: ícone Filter no topo esquerdo mostra filtros sugeridos com a contagem de itens de cada opção; filtro avançado: seta à direita do ícone ou "Switch to advanced filters"; limpar com "Clear all" — [M-filtros](https://support.monday.com/hc/en-us/articles/360003624660-The-Board-Filters)
- Item novo criado numa visão filtrada recebe o valor do primeiro filtro aplicável (Status, Label, Priority, People, Connect Boards) — [M-filtros](https://support.monday.com/hc/en-us/articles/360003624660-The-Board-Filters)

**Twenty**
- Cada linha da lista tem um menu `⋮` que aparece no hover: "Add to Favorite"/"Remove Favorite", "Edit", "Delete". Edit e Delete somem na visão padrão (INDEX) e para quem não tem a permissão VIEWS, salvo visão não listada (pessoal) — [ViewPickerOptionDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerOptionDropdown.tsx)
- Edit troca o dropdown para "Edit view": voltar (chevron) no cabeçalho, ícone + nome com foco automático, e botão "Delete" (vermelho, contorno) embaixo. Voltar, Enter e clique fora do dropdown salvam a mudança — [ViewPickerContentEditMode.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentEditMode.tsx); [ViewPickerDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerDropdown.tsx)
- Filtros e ordenações: chips editáveis na segunda linha (ordenações, separador, busca em qualquer campo, filtro avançado, filtros) e botão "+ Add filter" — [ViewBarDetails.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/ViewBarDetails.tsx)
- Layout, campos visíveis e ordem dos campos ficam no menu Options; Options → Visibility alterna Workspace e Unlisted — [T-doc](https://docs.twenty.com/user-guide/views-pipelines/overview)
- O menu Options muda conforme a visão: um componente para a padrão e outro para as criadas — [ObjectOptionsDropdownMenuContent.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/object-record/object-options-dropdown/components/ObjectOptionsDropdownMenuContent.tsx)

**Pipefy**
- Na Lista, um ícone de colunas mostra e esconde colunas — [Pipefy List view](https://help.pipefy.com/en/articles/6004107-list-view) (trecho de resultado de busca, sem leitura completa)
- Filtro aplicado atualiza a visão na hora; "Delete all" limpa (guia da comunidade, julho de 2026) — [Comunidade Pipefy](https://community.pipefy.com/card-management-152/how-to-use-filters-and-views-to-track-your-process-5419)

### Inferences
- O Notion e o ClickUp concentram a edição num lugar só (menu "View options" e painel "Customize"); o Twenty divide: nome e ícone no dropdown, filtro e ordenação em chips, campos e layout no Options.
- O menu de contexto do ClickUp tem 13 grupos de ação (contados na lista da central); o do Twenty tem 3. É o intervalo do mercado.

### Gaps
- Renomear por duplo clique na aba: não confirmado em nenhum dos 5.
- Como se reordenam colunas no Notion e no ClickUp pelo painel (arrastar na lista de propriedades?): não confirmado.
- Ordenação em vários níveis no ClickUp, monday e Twenty: não confirmado nas fontes lidas.
- Grupos OR no filtro avançado do monday: o artigo só cita "and"; não confirmado.

## 6. Mudanças não salvas: sinal, ações e escopo

### Takeaway
Os 4 que salvam visão separam "mexi" de "salvei", com variações: Notion mostra "Save for everyone" e "Reset"; ClickUp mostra "Save view" com seta para "Save as new view", "Revert changes" e "Autosave"; Twenty mostra "Reset" e o botão dividido "Update view" + "Create view" (na visão padrão, só "Save as new view"); monday usa "Save to this view" no painel de filtro. Até salvar, a mudança vale só para quem fez.

### Cited Findings
**Notion**
- Filtro e ordenação mudados numa visão compartilhada só afetam os outros depois de "Save for everyone"; "Reset" descarta — [N-2022](https://www.notion.com/releases/2022-03-15); [N-guia](https://www.notion.com/help/guides/databases-reimagined-whats-changed)
- No filtro simples, "Save for everyone" é uma escolha na hora de criar; desligado, o filtro vale só para a pessoa — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- A mesma opção existe para ordenações — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)

**ClickUp**
- Ao mudar qualquer opção, o botão "Save view" aparece no canto superior direito; a seta ao lado abre: "Enable Autosave", "Save as new view" (duplica com a última mudança, original intacta), "Revert changes" (desfaz a última mudança) — [C-salvar](https://help.clickup.com/hc/en-us/articles/6310370965911-Save-view-changes)
- "Save view" salva para todos com acesso; quem está na mesma visão vê a mudança ao sair ou recarregar — [C-salvar](https://help.clickup.com/hc/en-us/articles/6310370965911-Save-view-changes)
- Convidado não salva mudança de visão — [C-salvar](https://help.clickup.com/hc/en-us/articles/6310370965911-Save-view-changes)
- "Autosave for me" no menu da visão: as próximas mudanças salvam sozinhas — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)
- Para não deixar ninguém salvar: Protect, Private ou "Save as new view" — [C-salvar](https://help.clickup.com/hc/en-us/articles/6310370965911-Save-view-changes)

**monday.com**
- "Save to this view" no canto superior direito do painel de filtro, com nome — [M-filtros](https://support.monday.com/hc/en-us/articles/360003624660-The-Board-Filters)
- Fórum: "Save to this view" muda a visão para todos, e usuários pedem permissão para limitar quem salva (posts de comunidade; lidos só pelo resumo da busca) — [Comunidade monday](https://community.monday.com/t/views-permissions-for-the-save-to-view-option/38358)

**Twenty**
- Sinal: a segunda linha da barra (ViewBarDetails) se abre sozinha quando filtros, grupos de filtro, ordenações ou a busca em qualquer campo diferem da visão salva — [ViewBarDetails.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/ViewBarDetails.tsx)
- Ações nessa linha: "Reset" (botão discreto, reaplica filtros, grupos, ordenações e busca da visão salva) e, à direita, o grupo de salvar — [ViewBarDetails.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/ViewBarDetails.tsx)
- Visão criada: botão dividido sólido "Update view" + chevron com "Create view" (abre o modo criar a partir da atual). Visão padrão (INDEX): só "Save as new view" (contorno), porque a padrão não se altera — [UpdateViewButtonGroup.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/UpdateViewButtonGroup.tsx)
- "Update view" fica desabilitado para quem não tem a permissão VIEWS, salvo em visão não listada — [useCanPersistViewChanges.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/hooks/useCanPersistViewChanges.ts)
- Quando os filtros vêm da URL (query params), nem "Reset" nem "Update view" aparecem — [UpdateViewButtonGroup.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/UpdateViewButtonGroup.tsx)

**Pipefy**
- Sem visão salva; a escolha de visão é pessoal e "não afeta como os outros veem o pipe" — [P-views](https://help.pipefy.com/en/articles/3143190)

### Inferences
- Padrão comum: mudança local e temporária por padrão, botão primário de salvar para todos, ação secundária de criar outra a partir da atual, e ação de descartar.
- Só o ClickUp oferece salvar sempre sozinho (Autosave) por pessoa; só o Twenty bloqueia o salvar na visão padrão e empurra para "Save as new view".
- No Twenty, a diferença medida é só de filtro, ordenação e busca; colunas não entram na comparação do botão (lido no código; o comportamento das colunas não foi conferido na tela).

### Gaps
- Ponto ou marca na aba modificada (Notion, ClickUp, monday): não confirmado.
- Se a mudança não salva sobrevive a recarregar a página (Notion, Twenty): não confirmado.
- Se coluna escondida ou reordenada conta como mudança não salva no Notion e no ClickUp: não confirmado.

## 7. Visão padrão, link da visão e proteção da última ou da padrão

### Takeaway
ClickUp tem "Set as default view" restrito por plano e papel; o Twenty tem uma visão padrão fixa por objeto, sem edição nem exclusão; monday e Twenty impedem excluir a última. Link da visão existe no Notion, ClickUp e Twenty (este pela URL e favoritos).

### Cited Findings
- Notion: "Copy link to view" no menu da aba e no menu de configurações — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)
- ClickUp: "Set as default view" (Business ou superior, donos e admins, em certos locais); a padrão abre primeiro ao visitar o local — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar); [C-fixar](https://help.clickup.com/hc/en-us/articles/26001290663959-Pin-a-view)
- ClickUp: copiar link no clique direito; visões são públicas por padrão — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar); [C-fixar](https://help.clickup.com/hc/en-us/articles/26001290663959-Pin-a-view)
- ClickUp: algumas visões não se restauram depois de excluídas — [C-barra](https://help.clickup.com/hc/en-us/articles/19063083658135-Intro-to-the-Views-Bar)
- monday: não dá para excluir a visão quando ela é a única além da principal, mesmo com permissão; a tabela principal só se esconde se existir outra visão; visão excluída volta por "Undo" no log de atividade — [M-views](https://support.monday.com/hc/en-us/articles/360001267945-The-board-views)
- Pipefy: a última visão usada no pipe abre na próxima entrada — [P-views](https://help.pipefy.com/en/articles/3143190)
- Twenty: cada objeto tem a visão "All [Objeto]", de visibilidade fixa — [T-doc](https://docs.twenty.com/user-guide/views-pipelines/overview)
- Twenty: a visão padrão (INDEX) mostra sempre um ícone de cadeado na lista e não oferece Edit nem Delete; Delete some quando resta 1 visão (`isLastView`) — [ViewPickerOptionDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerOptionDropdown.tsx); [ViewPickerListContent.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerListContent.tsx)
- Twenty: excluir pede confirmação, com o aviso de que visão excluída não se recupera — [T-doc](https://docs.twenty.com/user-guide/views-pipelines/overview)

### Inferences
- Duas formas de proteger: visão padrão imutável (Twenty) ou trava explícita (Lock no monday, Protect no ClickUp, Lock database no Notion).

### Gaps
- Visão padrão escolhida pelo usuário no Notion e no monday: não confirmado.
- Se o Notion impede excluir a última visão: não confirmado.
- Link do monday para uma visão específica: não confirmado.

## 8. Atalhos de teclado e acessibilidade

### Takeaway
Nenhuma central documenta atalho para trocar ou criar visão. O único dado firme vem do código do Twenty: Enter confirma criar e editar dentro do dropdown, e o campo de nome recebe foco ao abrir.

### Cited Findings
- Twenty: Enter cria a visão no modo criar e salva no modo editar; o campo de nome abre com `autoFocus` — [ViewPickerContentCreateMode.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentCreateMode.tsx); [ViewPickerContentEditMode.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerContentEditMode.tsx)
- Twenty: o chevron do botão dividido tem `aria-label` "View update options"; o botão Create tem `aria-label` "Create new view" — [UpdateViewButtonGroup.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/components/UpdateViewButtonGroup.tsx); [ViewPickerCreateButton.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerCreateButton.tsx)
- Twenty: o nome cortado tem tooltip com o nome inteiro — [ViewPickerDropdown.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/views/view-picker/components/ViewPickerDropdown.tsx)
- Notion: só a pessoa vê a escolha de "Display as" (ícone, texto ou os 2) — [N-ajuda](https://www.notion.com/help/views-filters-and-sorts)

### Inferences
- Aba só com ícone (Notion) depende de rótulo acessível que a central não descreve.

### Gaps
- Atalhos de teclado para visões no Notion, ClickUp, monday e Pipefy: não confirmado.
- Navegação por teclado entre abas (setas, Tab) e papéis ARIA das abas: não confirmado em nenhum.
- Marcação visual da aba ativa: não confirmado (repete a lacuna da seção 1).

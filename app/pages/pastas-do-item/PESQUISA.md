# Pesquisa: abas na página de um registro

Pesquisa de 08/10/2026, por documentação de ajuda, changelog e código aberto (Twenty e o design system Vibe, do monday). **Sem prints de referência nesta rodada:** os produtos pedem conta, e a pesquisa foi por fonte escrita. O que não deu para confirmar em fonte está marcado como "não confirmado".

Obrigatórios: Notion, Twenty, ClickUp, monday, Pipefy. Extras, pela natureza do problema (registro com abas e aba de navegador): Airtable, Attio, HubSpot, VS Code.

## Twenty CRM

Fonte: código em `github.com/twentyhq/twenty`, `packages/twenty-front/src/modules/ui/layout/tab-list/` (TabList, TabListRow, TabMoreButton, TabListDropdown) e `twenty-ui` (Tab, TabButton).

- **Ativa:** barra de 40 px com uma linha de base de 1 px na largura toda; a ativa ganha um traço escuro de 1 px sobre essa linha e o texto passa de secundário para primário. A aba não tem borda, sombra nem fundo.
- **Hover:** fundo leve só no miolo da aba (raio médio, 8 px de folga), sem separador.
- **Arrastar:** dnd-kit; a aba arrastada fica translúcida e as outras se deslocam.
- **Excesso:** uma régua oculta mede cada aba; o botão "+N More ⌄" abre um menu sem busca. Se a ativa estiver escondida, o botão recebe o traço de ativa.
- **Contador:** prop `badge` depois do rótulo.
- **Endereço:** a aba ativa vai para o hash (`#tabId`).
- **Serve:** linha de base contínua, hover no miolo, régua de medida, contador, aba no endereço.
- **Não serve:** o traço de 1 px é fino demais para o tamanho de tela do ENSPACE; o protótipo usa 2 px.

## Notion

Fonte: notion.com/help/views-filters-and-sorts; releases de 2022-03-15 e 2026-03-26.

- **Arrastar:** reordena as abas de visualização arrastando, ou pelo menu "{#} more...".
- **Excesso:** "{#} more..." ao lado das abas; em tela estreita vira menu.
- **Menu:** "+" no fim da fila; clicar no nome da aba ativa abre renomear, duplicar, excluir, copiar link.
- **Visual da ativa e do hover:** não confirmado em fonte oficial.
- **Serve:** o menu aberto pela própria aba ativa (no protótipo, a seta ⌄ na ativa) e o link da visualização.

## ClickUp

Fonte: help.clickup.com, artigos 19063083658135 (Views Bar), 26004419744023 (reordenar), 35041742373015 (tarefa).

- **Arrastar:** na horizontal; a primeira visualização fica fixa.
- **Excesso:** "more..." com o número de escondidas; abre um modal com busca.
- **Menu:** botão direito com renomear, copiar link, fixar, duplicar, excluir; "+ View" à direita.
- **Contador:** os ícones da tarefa mostram contagem (comentários, relações).
- **Visual:** não confirmado.
- **Serve:** busca no menu de excesso (o ENSPACE já tem), botão direito, contador.
- **Não serve:** a tarefa usa ícones na vertical; trocaria a forma que o ENSPACE usa.

## monday.com

Fonte: support.monday.com, artigos 360001267945 e 360017143959; código do Vibe (`github.com/mondaycom/vibe`, `packages/components/tabs`).

- **Ativa (componente Tabs do Vibe):** sublinhado de 2 px na cor primária, que cresce do centro; com `stretchedUnderline`, uma linha cinza atravessa a lista inteira.
- **Hover:** fundo com raio de 4 px no miolo.
- **Arrastar:** cada pessoa reordena a própria vista.
- **Menu:** "⋯" à direita do nome da visualização.
- **Não confirmado:** que a barra de visualizações do quadro use esse componente; formato do excesso.
- **Serve:** sublinhado de 2 px na cor da marca sobre linha cinza contínua (é a proposta "Sublinhado").

## Pipefy

Fonte: help.pipefy.com, artigo 1030711; community.pipefy.com, tópico 5420.

- O card aberto empilha blocos (formulário, histórico, Anexos, Checklists, Comentários, E-mails), cada um com "⋯" para mover ou remover. Não há barra de abas documentada.
- **Não serve:** blocos empilhados não são abas.

## Airtable

Fonte: community.airtable.com, "problem reordering table tabs" (2020).

- Abas de tabela no topo da base; reordena arrastando ou pelo menu "All tables"; botão direito ou seta na aba abre o menu.
- **Excesso:** rolagem com setas; a comunidade relata a aba sumindo no arrasto.
- **Visual de aba fundida:** não confirmado em fonte.
- **Não serve:** rolagem com setas.

## Attio

Fonte: attio.com/help/reference/managing-your-data/records/configure-record-pages.

- "+ Add tab"; o "⋮" da aba oferece remover, mover para a esquerda ou direita, editar. Arrasto no modo "Configure page".
- **Serve:** "⋯" visível, além do botão direito.

## HubSpot

Fonte: knowledge.hubspot.com/object-settings/customize-records; developers.hubspot.com (componente Tabs).

- No máximo 5 abas; Activities fixa. Reordena num painel do editor de layout. O componente Tabs tem as variantes `default` e `enclosed` e manda o excesso para "More".
- **Não serve:** o limite de 5 (o cliente do ENSPACE cria folders sem limite).

## VS Code

Fonte: code.visualstudio.com/api/references/theme-color.

- Cores próprias para aba ativa e inativa, borda de cima da ativa, separador entre abas e borda sob a fileira. No arrasto, uma borda vertical marca onde a aba cai.
- **Serve:** é a referência da proposta "Aba de navegador": ativa com o fundo da página, traço de cor no topo, separador fino entre inativas que some ao lado da ativa.

## O padrão que todos seguem

- Aba sem borda nem sombra própria; texto inativo mais fraco, ativo mais forte.
- A ativa se marca embaixo (sublinhado) ou se funde ao conteúdo; nos 2 casos, uma linha de base separa a barra do conteúdo.
- Reordenar arrastando; excesso num menu no fim da fila; "+" no fim.
- Hover discreto: fundo leve que não muda a forma da aba.

## O que nenhum deles faz

- Nenhum desenha cada aba como chip com contorno, sombra e espaço entre elas, que é o desenho de hoje do ENSPACE.
- Nenhum documenta ocultar e reexibir uma aba de sistema pela própria barra.
- Nenhum documenta arrastar de dentro do menu de excesso de volta para a barra.
- Contador é sempre opcional, por aba.

# Pesquisa da rodada 2: agentes, pedido livre, barra flutuante e cor

Data 2026-10-09. Fontes em texto: help center, documentação e changelog oficiais. Sem prints nesta rodada.

Marcas usadas:

- **(terceiro):** a afirmação vem de guia, fórum ou pedido de usuário, não da fonte oficial;
- **(não confirmado):** procurei na fonte oficial e não achei.

Os 4 pedidos da redatora:

1. pedido livre além das ações prontas;
2. a barra do campo flutuando sobre a seleção, com a IA nela;
3. os agentes que a pessoa criou no ENSPACE dentro das opções de IA;
4. cor de texto e realce na barra.

Ponto de partida, medido em `padrao-dos-campos` (ver `BRIEFING.md`): a barra fixa do campo tem desfazer, refazer, título, negrito, itálico, sublinhado, tachado, código, emoji, alinhamento e mais. Não tem cor, realce nem IA.

---

## A. Agentes personalizados dentro do editor

### Confluence (Rovo)

- **Como aparece:**
  - com o texto selecionado, `/rovo` ou `/ai` e depois "Ask Rovo";
  - o menu traz **skills e agentes juntos**; a pessoa clica no nome do agente ou em "Browse agents";
  - "Browse agents" filtra por "Favorites" e "My agents" e tem busca por palavra;
  - "More actions …" › "View Agent" abre o perfil; clicar no cartão escolhe o agente;
  - outra porta: `@` no editor ou no comentário abre o "mention picker" com pessoas e agentes misturados.
- **Quantos e como se distingue:** a fonte não diz quantos aparecem antes de "Browse agents" nem como o ícone difere do Rovo padrão (não confirmado). No `@`, o agente divide a lista com pessoas, ordenada por atividade recente.
- **Contexto:**
  - pelo "Ask Rovo": o conteúdo da página ou o trecho selecionado;
  - pelo `@` numa lista: só a linha mencionada; numa tabela: só a célula;
  - depois de escolher o agente, a pessoa escreve o pedido ou clica num "conversation starter" (frase pronta do agente).
- **Sem permissão ou inativo:** agente restrito some do "mention picker". Sem IA liberada pelo admin, o "Ask Rovo" não abre.
- **Serve:**
  - agentes e ações prontas no mesmo menu, com "ver todos" e busca para quando a lista cresce;
  - o "conversation starter" do agente como atalho de pedido;
  - agente que a pessoa não pode usar não aparece.
- **Não serve:** misturar agente com pessoa no `@`. No campo do ENSPACE o `@` já é menção de pessoa (não confirmado no develop) e a mistura confunde.
- **Fonte:**
  - https://support.atlassian.com/rovo/docs/writing-and-reviewing-content-with-rovo-agents/
  - https://support.atlassian.com/confluence-cloud/docs/collaborate-on-confluence-content-with-ai-agents/

### Notion (Notion Agent, Custom Agents e skills)

- **Como aparece:**
  - Custom Agents ficam na barra lateral, seção "Agents", cada um com abas "Chat", "Activity" e "Settings";
  - a pessoa chama o agente por `@` numa página, numa propriedade de banco ou num comentário;
  - o agente também entra embutido na página ("Embed");
  - no menu de seleção de texto aparecem **skills** (pedidos salvos), não agentes: "Improve Writing", "Proofread", "Explain", "Reformat" e as skills da equipe.
- **Quantos e como se distingue:** a fonte não descreve ícone nem limite (não confirmado). No "/" e no menu de bloco, as skills da equipe vêm **antes** das padrão.
- **Contexto:** por padrão, a página aberta; com blocos selecionados, só eles. O agente responde com o acesso dele, não com o de quem pergunta.
- **Sem permissão ou inativo:**
  - usar o agente exige o nível "Can view and interact";
  - embutir na página não dá acesso;
  - se o admin desliga o modelo do agente, ele passa para o modelo padrão ou "Auto".
- **Serve:**
  - separar "pedido salvo" (skill, roda na seleção) de "agente" (conversa, tem regras e acesso próprios);
  - a pessoa escolhe quais skills entram no menu de seleção ("Add to text editor menu");
  - as da equipe vêm primeiro.
- **Não serve:** agente só por `@` ou barra lateral. No campo do ENSPACE a pessoa precisa achar o agente no mesmo menu da IA.
- **Fonte:**
  - https://www.notion.com/help/custom-agents
  - https://www.notion.com/help/custom-agents-sharing-and-permissions
  - https://www.notion.com/help/notion-agent
  - https://www.notion.com/help/create-and-manage-skills

### ClickUp (Brain e Super Agents)

- **Como aparece:**
  - Brain: `@brain` ou espaço em comentário de tarefa e em chat; `@` de Brain em comentário de Doc;
  - Super Agent: `@` pelo nome, só se o gatilho "Mention" estiver ligado, em comentário de tarefa e canal de chat;
  - Super Agent em Doc: estava "em construção" no quadro de pedidos (terceiro, feedback.clickup.com).
- **Quantos e como se distingue:** o agente tem avatar próprio; clicar no avatar abre a configuração dele. Não há seletor de agente dentro do Brain (não confirmado).
- **Contexto:** o Brain e os agentes aceitam campo personalizado e `@` no pedido. O agente responde em thread, com as instruções e ferramentas dele.
- **Sem permissão ou inativo:** sem o gatilho "Mention" ligado, o agente não atende pelo `@`.
- **Serve:** o agente tem avatar e nome, e a pessoa o reconhece na lista como reconhece um colega.
- **Não serve:** o agente não aparece no ponto em que se escreve no Doc, só em comentário e chat.
- **Fonte:**
  - https://help.clickup.com/hc/en-us/articles/6311550474263-Use-mentions (lido pelo resumo da busca; a página bloqueia leitura direta)
  - https://help.clickup.com/hc/en-us/articles/6309646134295-Intro-to-comments
  - https://help.clickup.com/hc/en-us/articles/20047225571479-Ask-ClickUp-AI
  - https://feedback.clickup.com/ai-super-agents/p/mention-superagents (terceiro)

### Google Docs (Gems no painel do Gemini)

- **Como aparece:** "Ask Gemini" no canto superior direito abre o painel lateral; dentro dele, "Gems" lista as prontas e as da pessoa. O pedido vai no campo do pé do painel.
- **Quantos e como se distingue:** prontas e personalizadas na mesma lista; a fonte não diz quantas nem o ícone (não confirmado).
- **Contexto:** a Gem usa `@` de arquivo e acesso ao Drive. Se lê o documento aberto sozinha, a fonte não diz (não confirmado).
- **Sem permissão ou inativo:** não há controle de admin para Gems no painel. Criar Gem só em gemini.google.com.
- **Serve:** a lista junta pronta e pessoal; a pessoa não precisa saber a diferença para usar.
- **Não serve:** a Gem não aparece na barra flutuante de seleção nem na barra do pé ("bottom bar"); fica longe do texto.
- **Fonte:**
  - https://support.google.com/docs/answer/14355406
  - https://workspaceupdates.googleblog.com/2025/07/gems-in-the-side-panel-of-google-workspace-apps.html
  - https://workspaceupdates.googleblog.com/2026/07/expanded-language-support-for-gemini-in-Google-Docs.html

### Microsoft Word (Copilot e agentes)

- **Como aparece:**
  - painel do Copilot pela aba Página Inicial; menu de 3 linhas no topo do painel; "Get Agents" para adicionar;
  - no chat do Copilot, `@` + nome do agente (ex.: Researcher, `@Word`);
  - na seleção, o Copilot entra pela mini barra, mas só com o Copilot padrão.
- **Quantos e como se distingue:** não confirmado na fonte.
- **Contexto:** não confirmado se o agente lê o documento aberto.
- **Sem permissão ou inativo:** agentes dependem de licença e de liberação do admin. Se o admin desliga, o agente não aparece.
- **Serve:** `@` no campo de pedido para trocar de agente sem sair da caixa.
- **Não serve:** agente só no painel lateral; a seleção não oferece agente.
- **Fonte:**
  - https://support.microsoft.com/en-au/topic/customize-with-agents-in-word-and-powerpoint-2419337e-8043-4f18-8bab-1ad1344d5cde
  - https://mc.merill.net/message/MC1187799 (espelho do Message Center, terceiro)
  - https://blog-en.topedia.com/2025/09/researcher-and-other-microsoft-copilot-agents-in-word/ (terceiro)

### monday.com (Sidekick e agentes)

- **Como aparece:** agente personalizado tem identidade própria; a pessoa o menciona com `@` nas Updates e o atribui a item (doc de desenvolvedor, versão alfa). No workdoc, a IA é o "Refine" da seleção e o "Start with AI" do doc vazio; nenhum dos 2 oferece agente.
- **Quantos e como se distingue:** não confirmado.
- **Contexto:** o agente segue as permissões da conta e lê quadros, docs e fluxos que tiver liberados.
- **Sem permissão ou inativo:** o admin define a quais quadros o agente tem acesso.
- **Serve:** agente tratado como membro (menção e atribuição).
- **Não serve:** nada dentro do editor de doc.
- **Fonte:**
  - https://developer.monday.com/apps/docs/connect-a-custom-agent
  - https://support.monday.com/hc/en-us/articles/24113404490258-monday-AI-workdocs (lido pelo resumo da busca; a página bloqueia leitura direta)

### Coda (Superhuman Docs) e Slack canvas

- **Coda:**
  - IA em painel lateral ("AI chat"), bloco de IA e revisor que deixa comentário na página ("AI reviewer");
  - o painel trabalha sobre a seleção, a página ou o doc inteiro, escolhidos numa lista;
  - Pack vira agente no Superhuman Go, fora do doc;
  - agente no editor: não confirmado.
- **Slack canvas:** "Edit with AI" na seleção, ícone de brilho ao passar o mouse numa seção. Agente no canvas: não confirmado.
- **Serve:** o "AI reviewer" do Coda é o equivalente ao agente tipo "Revisor" do ENSPACE: ele comenta em vez de reescrever.
- **Fonte:**
  - https://help.superhuman.com/hc/en-us/articles/46210156957197-Coda-AI-features (lido pelo resumo da busca)
  - https://coda.io/packs/build/latest/agents/upgrade/index.md
  - https://slack.com/help/articles/44415275664275

### O padrão

- O agente personalizado mora no `@` ou num painel lateral. Só o Confluence o põe no mesmo menu das ações prontas, sobre a seleção.
- Quando a lista cresce, há "ver todos" com busca e filtro "meus" e "favoritos" (Confluence).
- Agente sem permissão some da lista; não aparece desabilitado (Confluence, Word).
- O agente recebe a seleção como contexto; sem seleção, a página (Confluence, Notion).
- Pedido salvo (skill, prompt salvo) e agente são coisas diferentes: o pedido salvo roda direto na seleção; o agente abre conversa.

### O que ninguém faz

- Mostrar o tipo do agente (ex.: "Revisor") no item da lista.
- Mostrar o agente na barra fixa de um campo de formulário. Todos os casos são editor de documento ou comentário.
- Dizer por que um agente sumiu (inativo, sem acesso). Ele só não aparece.

---

## B. Pedido personalizado

### Confluence (Rovo)

- **Como aparece:** seleciona, abre "Ask Rovo", escreve o pedido ou escolhe uma opção da lista e envia ("Submit"). Ações prontas: "Improve writing", "Fix spelling and grammar", "Change tone", "Make shorter", "Make longer", "Translate", "Define" (lição oficial da Atlassian).
- **Resultado:** o texto novo entra no lugar da seleção, aos poucos; "Undo" na barra ou Ctrl+Z desfaz. "Ask Rovo" continua no chat.
- **Pedidos salvos:** há "predefined prompts" de partida; pedido salvo pela pessoa no editor não confirmado.
- **Serve:** o pedido livre e as ações dividem a mesma caixa; enviar com Enter.
- **Não serve:** troca direta sem prévia. O ENSPACE já mostra a proposta antes de gravar (rodada 1).
- **Fonte:**
  - https://support.atlassian.com/confluence-cloud/docs/use-atlassian-intelligence-to-help-write-or-edit-content/
  - https://learning.atlassian.com/learning/lesson/enhance-your-content-using-rovo

### Notion

- **Como aparece:** selecionar texto e "Edit with AI"; escrever o pedido ou escolher no menu. Saída: aceitar, descartar ou tentar de novo.
- **Pedidos salvos:**
  - skills são pedidos salvos como página;
  - a equipe põe a skill no menu de seleção com "Add to text editor menu";
  - lápis ao passar o mouse edita a skill; "Manage Skills" gerencia;
  - no chat, `/` + nome roda a skill;
  - lançado em 2026-03-20, planos Business e Enterprise.
- **Serve:** a pessoa transforma um pedido que repete em item fixo do menu.
- **Não serve:** skill como página do workspace pede um lugar para guardar texto longo que o ENSPACE não tem no campo.
- **Fonte:**
  - https://www.notion.com/help/guides/notion-ai-for-docs
  - https://www.notion.com/help/create-and-manage-skills
  - https://www.notion.com/releases/2026-03-20

### ClickUp

- **Como aparece:** na seleção, 2 botões: "Improve" (ação pronta) e "Edit" (ferramentas prontas ou pedido livre). Saída: substituir a seleção, inserir logo abaixo ou copiar.
- **Pedidos salvos:**
  - no campo de pedido, ícone de mais no canto inferior esquerdo › "Saved prompts";
  - "New Prompt" pede título e texto;
  - padrão: compartilhado com todos; dá para deixar privado;
  - só no plano Business Plus para cima.
- **Serve:** pedido salvo com título, chamado do próprio campo de pedido; compartilhado com a equipe por padrão.
- **Fonte:**
  - https://help.clickup.com/hc/en-us/articles/14800632845975-Write-with-Brain-AI (resumo da busca)
  - https://help.clickup.com/hc/en-us/articles/29081872559895-Save-share-and-reuse-ClickUp-AI-prompts (resumo da busca)

### Google Docs

- **Como aparece:** na barra flutuante da seleção, "Refine" › "Rephrase", "Shorten" ou "More" ("Elaborate", "More formal", "More casual", "Bulletize", "Summarize"). Na versão antiga, "Help me write" trazia "Custom" no topo da lista para pedido livre. Pedido livre hoje: barra do pé ("bottom bar"), com "Sources" e `@` de arquivo.
- **Resultado:** sugestão marcada no texto; aceitar uma, "Accept all" ou "Reject all".
- **Pedidos salvos:** não confirmado.
- **Serve:** as ações mais usadas à vista e o resto em "More"; a revisão como sugestão de edição.
- **Fonte:**
  - https://support.google.com/docs/answer/13951448
  - https://support.google.com/docs/answer/13447609 (versão antiga, com "Custom")

### Microsoft Word

- **Como aparece:** na mini barra da seleção, "Copilot" › "Auto Rewrite" ou um pedido livre ("deixe mais conciso", por exemplo).
- **Resultado:** "Replace", "Insert below" ou "Regenerate".
- **Serve:** 1 ação pronta e o pedido livre na mesma caixa; o trio de saída.
- **Fonte:** https://support.microsoft.com/en-US/word/copilot/rewrite-text-with-copilot-in-word

### monday.com e Slack canvas

- **monday:** "Refine" na seleção (encurtar, melhorar, elaborar, mudar tom), saída abaixo ou no lugar. Pedido livre só no "Start with AI" do doc vazio, não na seleção.
- **Slack canvas:** "Edit with AI" › "Use a custom prompt" ao lado de "Quick edits". Depois do resultado, "Keep", "Discard" ou o campo "Any changes?" para ajustar.
- **Serve:** o campo "Any changes?" para refinar o resultado sem recomeçar.
- **Fonte:**
  - https://support.monday.com/hc/en-us/articles/24113404490258-monday-AI-workdocs (resumo da busca)
  - https://slack.com/help/articles/44415275664275

### Editores de referência (Tiptap e BlockNote)

- **Tiptap:** o menu de IA tem campo de pedido ("Ask AI to help with your content...") e comandos em 2 grupos: Edit ("Adjust Tone", "Fix Spelling & Grammar", "Extend", "Shorten", "Simplify Language", "Improve Writing", "Emojify") e Write ("Continue Writing", "Summarize", "Translate To"). Saída: "Accept" e "Regenerate".
- **BlockNote:** o menu de IA aceita pedido livre ou comando pronto. Cada comando tem apelidos (`aliases`) que **filtram a lista pelo que se digita no campo**. Comandos mudam com e sem seleção.
- **Serve:** campo no topo, ações embaixo, filtro pelo texto digitado. Se nada bate, Enter manda o texto como pedido livre.
- **Fonte:**
  - https://tiptap.dev/docs/ui-components/components/ai-menu
  - https://www.blocknotejs.org/docs/features/ai/custom-commands

### O padrão

- Campo de pedido livre **no topo**, ações prontas **embaixo**, na mesma caixa (Notion, Confluence, Word, Tiptap, BlockNote).
- Digitar filtra as ações (BlockNote, por apelidos); Enter sem item escolhido manda o texto como pedido.
- Ações mais usadas à vista, o resto num "Mais" (Google Docs).
- Pedido salvo tem título, mora num lugar só e é compartilhado com a equipe por padrão (ClickUp, Notion).
- Saída com 3 escolhas: substituir, inserir abaixo, gerar de novo (Word, ClickUp, Notion).

### O que ninguém faz

- Salvar o pedido livre como ação direto da tela de resultado (não confirmado em nenhum).
- Mostrar os últimos pedidos livres da pessoa na caixa. Só um guia de terceiro cita favoritos no bloco de IA do Notion.

---

## C. Barra flutuante na seleção e formatação

### Notion

- **Botões:** a ordem oficial não está escrita. Um clone da barra no Obsidian (terceiro) usa: transformar em, cor, negrito, itálico, sublinhado, limpar formatação, link, tachado, código, equação, mais, comentário. A posição da IA: não confirmado. O Notion não tem barra fixa; a flutuante é a única.
- **Cor:**
  - 1 botão "A" abre texto e fundo no mesmo menu (terceiro);
  - 10 cores de texto e 10 de fundo com os mesmos nomes (ver tabela no fim);
  - Ctrl/Cmd+Shift+H aplica a última cor de texto ou fundo usada (oficial);
  - `/color` no começo ou fim do bloco muda a cor; `/default` remove (oficial).
- **Fonte:**
  - https://www.notion.com/help/keyboard-shortcuts
  - https://www.notion.com/help/writing-and-editing-basics
  - https://developers.notion.com/reference/rich-text
  - https://www.obsidianstats.com/plugins/notion-selection-toolbar (terceiro)

### Confluence

- **Botões:** a barra fixa tem estilo do parágrafo, negrito, itálico, "…" (sublinhado, tachado, código, subscrito, sobrescrito), listas, alinhamento e "Text and highlight color". Na seleção, a barra flutuante mostra "Improve writing", "Ask Rovo" e comentário, nesta ordem (lição oficial; ordem não confirmada no texto). A IA vem primeiro.
- **Cor:** 1 botão para cor do texto e realce ("Text and highlight color"). Número e nomes das cores: não confirmado. Um post antigo da comunidade cita 5 cores de realce (terceiro).
- **Fonte:**
  - https://support.atlassian.com/confluence-cloud/docs/format-text/
  - https://learning.atlassian.com/learning/lesson/enhance-your-content-using-rovo
  - https://community.atlassian.com/forums/discussion/2745718/how-to-highlight-text-in-confluence-cloud (terceiro)

### Google Docs

- **Botões:** a barra flutuante da seleção é curta: "Refine" do Gemini e ações de comentário. A formatação fica na barra fixa.
- **Cor:** 2 botões separados na barra fixa: "Text color" e "Highlight color". Paleta pronta e "Custom" (hex, RGB, conta-gotas); a cor criada fica disponível no arquivo todo. Opção "None" para tirar o realce: não confirmado.
- **Fonte:**
  - https://support.google.com/docs/answer/13951448
  - https://support.google.com/docs/answer/13267978

### ClickUp Docs

- **Botões:** a mesma barra de texto vale para Doc, descrição de tarefa, comentário e chat. Na seleção: "Improve" e "Edit" (IA). Posição na barra: não confirmado.
- **Cor:** cor de texto e realce no mesmo botão (terceiro). O changelog cita mais cores de realce, como roxo e azul.
- **Fonte:**
  - https://help.clickup.com/hc/en-us/articles/6325395888023 (resumo da busca)
  - https://feedback.clickup.com/changelog/more-colors-in-docs

### Coda, Craft, Slite e Linear

- **Coda:** barra de seleção não confirmada na fonte.
- **Craft:** barra de seleção com negrito, itálico, realce e link. O realce abre paleta com cor personalizada no fim (grade, espectro, RGB ou HSB); "o mesmo vale para cor de texto".
- **Slite:** a seleção abre uma segunda barra, que realça. Cor de texto com Cmd+E ou pela barra (changelog de 2024-09-20). Cmd+E é código no Notion e no Linear: o mesmo atalho faz coisas diferentes.
- **Linear:** a seleção abre uma barra de estilo; atalhos de negrito, itálico, sublinhado, tachado, código e link. Cor de texto: não aparece na documentação (não confirmado).
- **Fonte:**
  - https://support.craft.do/en/write-and-edit/formatting.md
  - https://slite.com/help/bFXThPEptkD0yG/Toolbar-and-Commands
  - https://slite.com/changelog/slite-in-technicolor
  - https://linear.app/docs/editor

### Tiptap (editor de referência)

- **Botões:** o modelo "Notion-like" tem barra flutuante com formatação por contexto, cor e realce, e IA ("AiAskButton"). Componentes: "turn-into-dropdown", "mark-button", "color-highlight-popover", "link-popover". Ordem: não confirmado.
- **Cor:**
  - "Color Text Popover": texto e realce no mesmo popover;
  - guarda as cores recentes (`useRecentColors(3)` no exemplo);
  - o realce tem opção de remover (ícone de proibido) e atalho Ctrl/Cmd+Shift+H.
- **Fonte:**
  - https://tiptap.dev/docs/ui-components/templates/notion-like-editor
  - https://tiptap.dev/docs/ui-components/components/color-text-popover
  - https://tiptap.dev/docs/ui-components/components/color-highlight-popover

### BlockNote (editor de referência)

- **Botões, na ordem do código:**
  1. tipo do bloco;
  2. botões de tabela e arquivo (só quando cabem);
  3. negrito, itálico, sublinhado, tachado;
  4. alinhar à esquerda, ao centro, à direita;
  5. cor;
  6. recuar, desfazer recuo;
  7. link;
  8. comentário.
- **IA:** o exemplo oficial põe o botão de IA ("AIToolbarButton", ícone de estrelas) **no fim** da barra.
- **Cor:**
  - 1 botão ("ColorStyleButton") com 2 seções: "Text color" e "Background color";
  - 10 cores: padrão, cinza, marrom, vermelho, laranja, amarelo, verde, azul, roxo, rosa;
  - não há "remover": a cor "padrão" é a primeira da lista e cumpre esse papel.
- **Fonte:**
  - https://github.com/TypeCellOS/BlockNote/blob/main/packages/react/src/components/FormattingToolbar/FormattingToolbar.tsx
  - https://raw.githubusercontent.com/TypeCellOS/BlockNote/main/packages/react/src/components/ColorPicker/ColorPicker.tsx
  - https://www.blocknotejs.org/docs/features/ai/getting-started

### Barras de editor em formulário: o que elas têm e o campo do ENSPACE não tem

| Produto | Cor do texto | Realce | Outros que o ENSPACE não tem | Fonte |
|---|---|---|---|---|
| Jira (descrição) | por marcação wiki (`{color}`); botão na barra: não confirmado | não confirmado | link, tabela, bloco de código; na tela nova de criação, a barra só aparece na seleção (terceiro) | https://confluence.atlassian.com/display/JIRAKB/Jira+Cloud+text+editor+formatting ; https://jira.atlassian.com/browse/JRACLOUD-99460 (terceiro) |
| Pipefy | não confirmado | não confirmado | editor novo em liberação desde 2026-06-01 (Portal, Interface e campos dinâmicos); lista de botões não publicada | https://community.pipefy.com/product-updates/text-editor-a-modernized-editing-experience-across-pipefy-5235 |
| monday (Updates) | sim | sim | tamanho do texto; "Write with AI" com "Insert as draft" ou "Update"; anexo (terceiro) | https://support.monday.com/hc/en-us/articles/115005900249 (resumo da busca) |
| HubSpot (módulo de texto) | sim (terceiro) | sim (terceiro) | limpar estilos ("removeTextStyle"); sobrescrito e subscrito no "More" | https://knowledge.hubspot.com/website-pages/edit-content-in-a-rich-text-module |
| Zendesk (composer) | sim, cores "acessíveis" predefinidas | sim, fundo no mesmo seletor | tabela, link, anexo; admin desliga a cor em "Turn on color text"; cor não passa no colar nem em código | https://support.zendesk.com/hc/en-us/articles/4408831849882 ; https://support.zendesk.com/hc/en-us/articles/4408884153242 |

Lista do que falta ao campo do ENSPACE, pelo que os 5 oferecem: **cor do texto, realce, link, tabela, limpar formatação, tamanho do texto, anexo**. Checklist, imagem e menção: não confirmado nas fontes destes 5.

### O padrão

- **Cor de texto e realce num botão só, com 2 seções** (Notion, Confluence, BlockNote, Tiptap, Zendesk, ClickUp). Só o Google Docs separa em 2 botões.
- Cerca de 10 cores, com os mesmos nomes para texto e fundo; "padrão" no topo serve para remover (Notion, BlockNote).
- Última cor usada: atalho no Notion (Ctrl/Cmd+Shift+H); 3 recentes no Tiptap.
- A barra flutuante é **menor** que a fixa quando as 2 existem (Google Docs, Confluence). Quando só há a flutuante, ela traz tudo (Notion, Jira na tela nova).
- A IA entra **no começo** da flutuante nos produtos (Confluence: "Improve writing", "Ask Rovo"). Os editores de referência a põem no fim por exemplo de código (BlockNote).

### O que ninguém faz

- Cor livre (hex) na barra flutuante. Só Google Docs e Craft têm cor personalizada, e na barra fixa ou no menu completo.
- Avisar contraste ruim da cor escolhida no tema escuro. O Zendesk só promete "cores acessíveis" de fábrica.
- Repetir a barra fixa inteira na flutuante.

---

## Tabela de cores do Notion

Os nomes na ordem do menu (texto e fundo usam os mesmos nomes). A ordem do menu vem de fonte de terceiro e do BlockNote, que copia a paleta; a API oficial lista os valores em ordem alfabética. O comando `/blue background` aparece no help oficial.

| # | Cor do texto | Cor de fundo | Valor na API |
|---|---|---|---|
| 1 | Default | Default background | `default` |
| 2 | Gray | Gray background | `gray` / `gray_background` |
| 3 | Brown | Brown background | `brown` / `brown_background` |
| 4 | Orange | Orange background | `orange` / `orange_background` |
| 5 | Yellow | Yellow background | `yellow` / `yellow_background` |
| 6 | Green | Green background | `green` / `green_background` |
| 7 | Blue | Blue background | `blue` / `blue_background` |
| 8 | Purple | Purple background | `purple` / `purple_background` |
| 9 | Pink | Pink background | `pink` / `pink_background` |
| 10 | Red | Red background | `red` / `red_background` |

- "Default background" não tem valor próprio na API (não confirmado no menu).
- O BlockNote usa as mesmas 10 cores, mas põe o vermelho em 4º lugar, logo depois do marrom.
- Fonte: https://developers.notion.com/reference/rich-text ; https://www.notion.com/help/keyboard-shortcuts ; https://optemization.super.site/post/notion-colors (terceiro; a página saiu do ar em 2026-10-09).

---

## D. Exploração ao vivo (2026-10-09)

Testado com clique e teclado, não pela documentação: o Notion atual (página particular de rascunho, com texto fictício, enviada à lixeira no fim), a demo do editor estilo Notion da Tiptap (`template.tiptap.dev/preview/templates/notion-like`) e a demo do BlockNote. Corrige a seção C: a barra de seleção do Notion **não é mais horizontal**.

### Notion atual

**Menu da seleção, de cima para baixo** (`evidencias/ref-notion-menu-da-selecao.png`):

1. **Tipo do bloco** ("Normal Text ›").
2. **Linha 1:** cor (A), negrito, itálico, sublinhado, limpar formatação.
3. **Linha 2:** link, tachado, código, equação, mais (⋯).
4. **Comentar**, reação e sugerir edição.
5. **Skills:** Improve writing, Proofread, Explain, Reformat, cada um com "Edit skill"; ícone de ajuste leva à Biblioteca de skills.
6. **Campo "Edit with AI"** no pé, com atalho.

**Cor** (`ref-notion-cores.png`): um botão só. Seções "Recently used", "Text color" (10 "A" em grade 5×2) e "Background color" (10 quadrados). A 1ª de cada seção é a padrão e remove a cor. Ctrl Shift H repete a última cor; "/vermelho" colore o bloco.

**Mais (⋯)** (`ref-notion-menu-mais.png`): busca no topo ("Search actions..."); Turn into ›, Color ›, Copy link to block, Duplicate, Move to, Delete, Comment, Suggest edits, Ask AI (Ctrl J), Skills ›; no pé, quem editou por último e a contagem de palavras e caracteres.

**Resultado da IA** (`ref-notion-resultado-da-ia.png`): o Notion aplica a mudança no texto com diff (o trecho antigo riscado, o novo realçado em azul). Uma barra em cima traz feedback (👍 👎), Insert below, Chat, Undo (Ctrl Z) e Accept (Enter).

**"/" no meio do texto** (`ref-notion-barra-comando.png`): o "/" vira um chip "Type to search" dentro da linha. Grupos: Suggested, Basic blocks (Text, Heading 1 a 4, listas, To-do, Toggle, Page, Callout, Quote, Table, Divider, Link to page), Media, Database. Cada bloco mostra o atalho markdown à direita (`#`, `##`, `-`, `[]`, `>`). "Close menu · esc" no pé. Filtrar por "ai" traz AI Meeting Notes, AI Block, Ask AI (Ctrl J) e o skill Explain.

**Linha vazia:** placeholder "Press 'space' for AI or '/' for commands".

**Ask AI (Ctrl J) pelo bloco ou pelo "/":** abre o painel lateral de chat com o trecho como chip de contexto, "+" (arquivos, Skills, navegador, conexões), seletor de modelo "Auto" (cada modelo com descrição e notas de velocidade e inteligência) e "@" para citar páginas.

**Agentes próprios:** ficam na barra lateral ("Agents") e na Biblioteca, ao lado dos Skills. **Não aparecem em nenhum menu do texto.**

### Tiptap, editor estilo Notion (demo com IA de verdade)

- **Barra da seleção, horizontal** (`ref-tiptap-barra-da-selecao.png`): Improve (IA) | Text ▾ | negrito, itálico, sublinhado, tachado, código | link | A ▾ | ⋮. O ⋮ abre uma 2ª linha: sobrescrito, subscrito, 4 alinhamentos, recuar e avançar.
- **Cor** (`ref-tiptap-cores.png`): "Text Color" e "Highlight Color", 10 de cada, no mesmo menu. O menu do bloco dá os nomes: Default, Gray, Brown, Orange, Yellow, Green, Blue, Purple, Pink, Red (texto e fundo).
- **Improve** (`ref-tiptap-menu-de-ia.png`): Adjust tone ›, Fix spelling & grammar, Extend text, Reduce text, Simplify text, Emojify | Ask AI, Complete sentence, Summarize, Translate ›.
- **Ask AI** (`ref-tiptap-pedido-livre.png`): campo "Ask AI what you want..." com chip "Tone" e botão enviar; embaixo, Edit (Adjust Tone, Fix spelling & grammar, Make longer, Make shorter, Simplify language, Improve writing, Emojify) e Write (Continue writing, Add a summary, Languages ›). 20 tons e 15 idiomas.
- **Resultado** (`ref-tiptap-resultado-da-ia.png`): o texto novo entra no lugar, em roxo, como proposta; embaixo, "Tell AI what else needs to be changed...", Try again, Discard e Apply.
- **"/"** (`ref-tiptap-barra-comando.png`): AI (Continue Writing, Ask AI) no topo; Style; Insert (Mention, Emoji, Table, Separator, Table of contents); Upload (Image).
- **Menu do bloco (⠿):** Color ›, Turn Into ›, Duplicate, Copy to clipboard, Copy anchor link, Ask AI (Ctrl J), Delete.

### BlockNote

- **Barra da seleção** (`ref-blocknote-barra-da-selecao.png`): tipo do bloco ▾ | negrito, itálico, sublinhado, tachado | 3 alinhamentos | cor | recuos | link | comentário | IA no fim.
- **IA** (`ref-blocknote-menu-de-ia.png`): campo "Ask AI anything..." com Improve Writing, Fix Spelling, Translate..., Simplify embaixo.

### O que muda na leitura da seção C

- O Notion juntou formatação, IA e pedidos salvos num só painel vertical, com o pedido livre no pé.
- Os 3 confirmam: pedido livre e ações na mesma caixa; o resultado aparece no texto como proposta, com aceitar, descartar e tentar de novo.
- O Ctrl J é o atalho de IA no Notion e na Tiptap: o mesmo que o protótipo usa.

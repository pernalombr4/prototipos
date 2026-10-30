# Decisões

**Fronteira:** muda o campo Editor de texto HTML inteiro (barra fixa, barra da seleção, "/", alça do bloco, cor, link, caixa do BENI, proposta dentro do texto, placeholder, contagem de palavras). Não muda a casca, o painel do item, a barra de folders nem os outros campos.

## Rodada 1 · 2026-10-08

- **Pedido (literal):** "permitir uso de ia durante escrita de texto no campo html por comando com "/"" e "colocar botão pra utilizar IA na barra de ferramentas do campo html"
- **Mudou:**
  - **Botão IA** no começo da barra fixa, em rosa suave, com dica "Escrever com o BENI" e Ctrl J.
    - Sem trecho selecionado: Pedir ao BENI, Continuar escrevendo, Resumir o texto, Rascunhar com os dados do item. Continuar e Resumir ficam desativados com o campo vazio.
    - Com trecho selecionado: Melhorar a escrita, Corrigir ortografia e gramática, Encurtar, Expandir, Mudar o tom (Formal, Amigável, Direto), Traduzir (Português, Inglês, Espanhol), Resumir e Pedir ao BENI.
  - **Grupo BENI (IA)** no topo do menu "/", com descrição em cada item: Pedir ao BENI, Continuar escrevendo, Resumir o texto, Rascunhar com os dados do item. "/ia", "/ai" e "/beni" filtram o grupo.
  - **Caixa do BENI**, logo abaixo do trecho ou da linha do cursor, dentro do campo:
    - pedido: campo livre com as sugestões embaixo; o que a pessoa digita vira o 1º item ("Seu pedido") e o Enter envia;
    - gerando: a resposta chega palavra por palavra, com o BENI animado e o botão Parar;
    - pronto: Substituir a seleção (ou Inserir), Inserir abaixo, Tentar de novo, Descartar e um campo para pedir ajuste ("mais curto", "em lista");
    - erro: "O BENI não respondeu." com Tentar de novo e Descartar; o campo não muda.
  - **O trecho fica realçado** enquanto a caixa está aberta, e o texto que entra acende e apaga em 2 s.
  - **Toast com Desfazer** depois de aceitar; o Ctrl Z do editor desfaz também.
  - **Rodapé da caixa:** "Lê este campo e mais 5 campos do item" abre a lista dos campos lidos e uma chave para não usá-los; "O BENI pode errar. Confira antes de salvar."; Esc fecha.
  - **Placeholder:** `Escreva ou digite "/" para acessar os comandos e a IA...`. Com a IA desligada, volta ao texto de hoje.
  - **IA desligada no workspace:** o botão fica no lugar, apagado, com a dica do motivo e de onde ligar (Configurações › Agentes de IA). O grupo do BENI sai do "/".
- **Por quê, em 1 linha cada:**
  - **O BENI propõe, a pessoa aplica.** O campo só muda no Substituir ou no Inserir. O Confluence troca o texto ao vivo; num campo que se salva junto com o item, a pessoa precisa ver antes de o original sumir (PESQUISA, Confluence e Google Docs).
  - **Caixa colada no texto**, não painel lateral: o campo HTML divide a tela com outros campos, e o painel tira o campo de vista (PESQUISA, ClickUp e Craft).
  - **Os campos do item como contexto**, com a lista visível: nenhum dos 9 produtos faz isso dentro do editor (PESQUISA, "O que nenhum deles faz").
  - **Botão apagado com motivo** em vez de sumir: quem não vê o botão não sabe que a IA existe nem a quem pedir.
  - **Botão no começo da barra:** é a ação nova e a que a demanda pede; as 11 ações de hoje ficam na mesma ordem.
- **Descartado:**
  - Espaço em linha vazia abre a IA (Notion, Confluence). Motivo: no campo HTML o espaço é digitação comum, e a pessoa abriria a caixa sem querer.
  - Menu flutuante na seleção com o botão IA. Motivo: fora do pedido; o botão da barra já muda conforme a seleção. Fica como sugestão para a próxima rodada (é a 3ª porta que Notion, Confluence e ClickUp têm).
- **Não deu:**
  - Medir no develop o menu "/" de hoje. Por quê: DNS fora e a liberação dela para usar o que os protótipos já sabem. Os grupos Texto, Listas e Inserir são suposição a conferir.
  - Conferir o Ctrl J no Chrome com tecla de verdade. Por quê: a automação não entrega a tecla com a janela escondida; testei o atalho por evento. No Chrome, Ctrl J abre Downloads se a página não impedir.
  - Prints. Por quê: a janela do navegador ficou minimizada durante a rodada e a captura não desenha.
- **Maquete:**
  - **O BENI é simulado** (`simulador.ts`): os 2 parágrafos do Parecer têm resposta pronta para cada ação; texto escrito pela pessoa recebe resposta de regra (corrigir troca palavras sem acento, encurtar fica com a 1ª frase, expandir acrescenta uma frase). Tradução de texto livre mostra o aviso "Simulação: a tradução está pronta só nos 2 parágrafos do exemplo."
  - A simulação escolhe a resposta do pedido livre por palavra: e-mail, lista ou pendências, resumo, risco; o resto vira o rascunho com os dados do item.
  - O texto gerado fica em português nos 3 idiomas da interface: é dado do workspace, como o conteúdo do campo.
  - Alinhamento não alinha: precisa da extensão TextAlign, que o protótipo não tem.
  - Emoji abre 12 emojis fixos; o produto tem o seletor completo.
  - A barra de folders troca de folder, mas só a Visão Geral tem conteúdo.
- **CSS fora da prop:** nenhum `<style>`, `:deep()` nem `!important`. Os seletores de Tailwind que restam:
  - `[&_li]`, `[&_p+p]`, `[&_strong]`, `[&_ul]` na resposta da caixa: o texto vem em HTML (`v-html`), sem componente para receber prop;
  - `[&>*]:size-full` no contêiner do BENI: o `Beni` desenha em 160 px e não tem prop de tamanho (README do `@be-enlighten/beni-avatar`).
- **Componentes:** `UEditor`, `UEditorToolbar`, `UEditorSuggestionMenu` (MCP `nuxt-ui`, `get-component` Editor e EditorSuggestionMenu: os comandos de IA são handlers próprios, `kind: 'beni'`, o mesmo item serve à barra e ao "/"), `UCommandPalette` (filtro e submenus de Tom e Traduzir), `UPopover`, `USwitch`, `UAlert`, `UBadge`, `UKbd`. Nenhum componente novo em `app/components/ux/`.
- **Crítica e acessibilidade** (`design:design-critique`, com a seção de acessibilidade dela; a skill `design:accessibility-review` não rodou nesta rodada):
  - A caixa cobre o texto abaixo do trecho e, no fim do campo, o campo seguinte. Ficou assim, como no Notion: empurrar o formulário para baixo a cada pedido faz a tela pular.
  - 2 campos HTML na mesma tela mostram 2 botões IA rosa. Ficou: o botão é o assunto da demanda; com 1 campo HTML por formulário, o destaque cai pela metade.
  - A resposta fica numa região `aria-live="polite"`; a caixa é `role="dialog"` com nome; o foco vai para o campo de pedido ao abrir e para o botão principal quando a resposta fica pronta; Esc fecha e devolve o foco ao trecho.
  - O botão IA desligado usa `aria-disabled` em vez de `disabled`, para a dica com o motivo continuar abrindo no foco e no hover.
- **Ver:** `pnpm dev` → http://localhost:3000/ia-no-campo-html · publicado: https://pernalombr4.github.io/prototipos/ia-no-campo-html/ · `?ia=desligada` e `?ia=erro` abrem os outros estados

## Rodada 2 · 2026-10-09
- **Pedido (literal):** "nao somente dev ser possivel ter açoes automaticas da ia, como tambem deve ser possível pedir algo personailzado. e quando selecionar um texto, a mesma barra do topo deve aparecer flutuante só para o texto selecoinado como contexto, podendo escolher IA ali. E nas opçoes de IA, alem de "Pergunte ao beni" a pessoa deve poder usar agentes dela que ela mesma criou no enspace. [...] pesquise o visual dos concorrentes e copie. aproveite até mesmo pra ver se tem oportunidade de melhoria na sua barra do campo. por exemplo, no seu modelo hoje nao da pra trocar a cor ou dar um destaque no texto." Depois: "se der pra copiar todas as funçoes do notion pra barra do campo html, ótimo"; "nosso prototipo do campo html deve melhorar a usabilidade geral dele, nao só pensar as funçoes de ia"; "não é a BEni no feminino e sim O beni"; "a pessoa deve poder, numa pregunta ao beni em si, escolher o modelo tambem. e no agente o modelo é uma pre-seleçao no perfil do agente, mas a pessoa pode mudar. entao tem q ter 2 botoes nisso"; "no camop html nós usamos o tiptap mesmo".
- **Pesquisa:** `PESQUISA-RODADA-2.md`. Ao vivo: o Notion atual (página particular de rascunho, enviada à lixeira no fim), a demo estilo Notion da Tiptap e a do BlockNote. Texto: Confluence, Notion, ClickUp, Google Docs, Word, monday, Coda, Slack e as barras de formulário de Jira, Pipefy, monday, HubSpot e Zendesk.
- **Mudou:**
  - **Barra fixa no padrão do Notion**, na ordem de hoje e com as funções que faltavam:
    - IA | desfazer, refazer | **Tipo do bloco ▾** (no lugar de "Título": texto, títulos 1 a 3, lista, lista numerada, checklist, citação, código) | negrito, itálico, sublinhado, tachado, código | **cor ▾**, **link**, **limpar formatação** | emoji, alinhamento ▾, mais ▾;
    - o "Mais" ganha menção (@), tabela, divisor, sobrescrito, subscrito, recuar e avançar recuo; dentro de uma tabela, adicionar e excluir linha e coluna;
    - a barra fica presa no topo do campo quando o texto é longo.
  - **Barra da seleção** (a mesma, menor, com a IA primeiro): Perguntar ao BENI | Texto ▾ | B I U S código | link | cor ▾ | ⋯ (sobrescrito, subscrito, alinhamentos, limpar).
  - **Cor no padrão do Notion:** um botão "A" com "Usadas recentemente", "Cor do texto" e "Cor de fundo", 10 cores cada (Padrão, Cinza, Marrom, Laranja, Amarelo, Verde, Azul, Roxo, Rosa, Vermelho); a Padrão tira a cor; Ctrl Shift H repete a última.
  - **Link com busca:** um campo só ("Cole um link ou busque um item"); a lista mostra o endereço digitado e os itens do workspace que batem com o nome; setas, Enter e Esc; no link existente, Abrir, Copiar e Remover; Ctrl K abre.
  - **Alça do bloco** (+ e ⠿, como no Notion): + abre o "/" numa linha nova; ⠿ arrasta o bloco e abre Transformar em, Cor (texto e fundo), Duplicar, Copiar texto, Mover para cima e para baixo, Perguntar ao BENI e Excluir.
  - **"/" no padrão do Notion:** BENI (IA) no topo, com os pedidos salvos; Blocos básicos com o atalho markdown na descrição (`#`, `-`, `1.`, `[ ]`, `>`, `---`); Inserir (tabela, link, menção, emoji); Cor do texto ("/vermelho").
  - **Menção (@) e emoji (:)** com menu próprio; **contagem de palavras e caracteres** no pé do campo.
  - **Caixa do BENI** (botão IA, barra da seleção, Ctrl J, "/", alça do bloco):
    - pedido livre no topo; o que a pessoa digita vira "Seu pedido" e filtra as ações;
    - grupos: Seus pedidos salvos; Editar o trecho (melhorar, corrigir, encurtar, expandir, simplificar, explicar, transformar em lista, 8 tons, 6 idiomas, resumir) ou Escrever (continuar, resumir o campo, extrair pendências, rascunhar com os dados do item); Pedir a um agente (5 e "Ver todos");
    - rodapé: o que a IA lê (trecho ou campo e os 5 campos do item, com chave), **Agente ▾** e **Modelo ▾**.
  - **Agentes do workspace** (Configurações › Agentes de IA): o seletor lista o BENI (padrão) e só os agentes ativos que a pessoa pode usar, cada um com o BENI dele (cor e acessório do cadastro, `beniTheme`), o tipo (Chat e texto, Revisor) e a descrição.
  - **Modelo** no formato do "Auto" do Notion: Auto e os 9 modelos do cadastro de agentes, cada um com perfil, velocidade e inteligência de 1 a 5 e consumo de en-credits. Com o BENI, a pessoa escolhe livre; com um agente, o modelo do perfil vem marcado "do agente", e trocar mostra "Só neste pedido. O perfil do agente continua com …".
  - **Proposta dentro do texto** (Notion e Tiptap): o trecho que sai fica riscado e o texto novo aparece realçado no lugar, sem gravar; a barra embaixo traz Aceitar (Enter), Descartar (Esc), Tentar de novo, Inserir abaixo, ajuste ("mais curto", "em lista"), 👍 👎 e "Salvar pedido" (o pedido livre vira pedido salvo). O Revisor mostra "O que o Revisor mudou". Durante a proposta o campo fica só leitura.
  - **O BENI no masculino** em toda a interface e nos documentos.
- **Por quê, em 1 linha cada:**
  - Pedido livre no topo: Notion, Tiptap e BlockNote fazem igual; na rodada 1 ele ficava atrás de "Pedir ao BENI" e passou despercebido.
  - Proposta no texto em vez da caixa: a pessoa compara no lugar, como no Notion; nada grava antes do Aceitar.
  - Agentes no menu do texto: o Notion não faz (agente só na barra lateral); só o Confluence põe agente no menu da seleção. Mostrar o tipo do agente nenhum faz.
  - 2 seletores separados: o agente decide quem responde e com que regras; o modelo decide com que motor. O agente pré-seleciona, a pessoa troca por pedido (pedido da redatora).
  - Cor por nome, tom pelo tema: hex fixo não passa de 4,5:1 nos 2 temas; aqui o HTML guarda `var(--cor-texto-vermelho)` e o tom muda com o tema.
- **Descartado:**
  - Painel vertical do Notion na seleção (formatação, skills e "Edit with AI" num só painel). Motivo: ela pediu "a mesma barra do topo" flutuante; o painel fica na pesquisa como alternativa.
  - Agente pelo "@" (Confluence, ClickUp). Motivo: no campo do ENSPACE o "@" é menção de pessoa.
  - Espaço em linha vazia abre a IA (Notion). Motivo: o mesmo da rodada 1.
  - Cor livre (hex) e tamanho de fonte. Motivo: nenhum dos editores de referência põe na barra; quebram o padrão do texto do item.
- **Não deu:**
  - Medir no develop o menu "/" de hoje. Por quê: DNS fora na rodada 1; a liberação dela foi não acessar.
  - Comentar e sugerir edição na seleção (Notion). Por quê: o campo HTML do ENSPACE não tem comentário por trecho; é outra demanda.
- **Maquete:**
  - O BENI e os agentes são simulados (`simulador.ts`): roteiro para os 2 parágrafos do Parecer, regra para o resto; o agente muda o estilo do rascunho; o Revisor corrige e lista o que mudou; o modelo muda só o tempo de resposta. Notas de velocidade, inteligência e consumo são inventadas.
  - "Gerenciar agentes" não navega; o endereço do item no link é fictício.
  - Pedidos salvos, agente e modelo escolhidos vivem só na sessão (`useState`): recarregar zera.
  - 👍 👎 só agradecem.
- **Técnico, para o dev:**
  - Extensões do TipTap acrescentadas, na 3.31.3 (a versão do Nuxt UI): `extension-text-style` (Color e BackgroundColor), `extension-text-align`, `extension-list` (TaskList e TaskItem), `extension-table` (TableKit), `extension-subscript`, `extension-superscript`, `extension-emoji`, mais `@tiptap/core` e `@tiptap/pm` para o plugin da proposta (`proposta.ts`, decorações do ProseMirror). O fundo usa o BackgroundColor, não o Highlight.
  - `nuxt.config.ts` ganhou `vite.optimizeDeps.include` com os pacotes do ProseMirror e do TipTap que o Nuxt UI usa, com o ok da redatora: sem isso o editor quebra com "Adding different instances of a keyed plugin". Os campos rodam em `<ClientOnly>` pelo mesmo motivo no servidor.
- **CSS fora da prop:** nenhum `<style>`, `:deep()` nem `!important`. Seletores Tailwind que restam:
  - na prop `ui.base` do editor, para checklist e tabela (`[&_ul[data-type=taskList]]`, `[&_li[data-type=taskItem]]`, `[&_table]`, `[&_td]`, `[&_th]`, `[&_.selectedCell]`): o tema do Nuxt UI não estiliza os 2 (conferido em `.nuxt/ui/editor.ts`);
  - na moldura do campo, `[&_.max-w-60]:w-80 [&_.max-w-60]:max-w-80`: o `EditorSuggestionMenu` 4.11.1 ignora `ui.content` (o `useEditorMenu.js`, linha 264, chama `content()` sem a classe da prop), e o "/" cortava os rótulos em 240 px;
  - no widget da proposta (`proposta.ts`): classes Tailwind no elemento que o plugin cria, porque decoração do ProseMirror não é componente.
- **Crítica e acessibilidade** (`design:accessibility-review`):
  - Contraste da cor do texto: no claro, laranja, amarelo, verde e rosa 600 ficavam abaixo de 4,5:1; no escuro, vermelho, azul, roxo e cinza 600. **Corrigido:** tom por tema (700 ou 600 no claro, 400 no escuro).
  - A proposta pronta não era anunciada ao leitor de tela. **Corrigido:** região `aria-live` com "Proposta pronta. Enter aceita, Esc descarta."
  - A barra da seleção não recebe foco pelo teclado (igual ao Notion). Ficou: tudo o que ela faz está na barra fixa e no "/".
  - Mover bloco por teclado não existe. Ficou: Mover para cima e para baixo estão no menu da alça; o atalho fica como sugestão ao dev.
  - Botões da barra com 28 px, abaixo dos 44 px de toque. Ficou: é a medida da barra de hoje no desktop.
  - Seletor de cor com nome em cada quadrado ("Texto vermelho") e `aria-pressed`; seletor de modelo com `aria-selected`.
- **Ver:** `pnpm dev` → http://localhost:3000/ia-no-campo-html · publicado: https://pernalombr4.github.io/prototipos/ia-no-campo-html/ · prints em `evidencias/proto-*.png` (proposta) e `evidencias/ref-*.png` (concorrentes)

## Rodada 3 · 2026-10-13
- **Pedido (literal):** "com o texto selecionado o botao ainda deve ser "ia", e nao "pergunte ao beni""
- **Mudou:** o botão da IA na barra da seleção passa a se chamar "IA", como na barra fixa; a dica ("Escrever com o BENI", Ctrl J) e o que ele abre continuam iguais.
- **Fronteira:** muda só o rótulo do botão na barra da seleção; não muda a barra fixa, o "/", a caixa do BENI nem o menu do bloco (que segue com "Perguntar ao BENI").
- **Ver:** `evidencias/proto-barra-da-selecao.png`

## Rodada 4 · 2026-10-13
- **Pedido (literal):** "o dropdown que abre nao ta desnecessariamente largo? ou acha que ta ok assim pelo padrao de mercado?" e, depois da proposta, "pode aplicar"
- **Mudou:**
  - a caixa do BENI virou 2 peças, como no Notion, na Tiptap e no BlockNote: o cartão do pedido na largura do campo (campo livre e rodapé com contexto, Agente e Modelo) e a lista de ações como menu de 288 px logo abaixo, à esquerda;
  - setas, Enter e filtro continuam na mesma lista (é a mesma `UCommandPalette`: a raiz virou o cartão, a lista saiu do fluxo e o rodapé entrou pelo slot `#footer`).
- **Fronteira:** muda só a forma da caixa; as ações, os grupos, os seletores e a barra da proposta continuam iguais.
- **Não deu:** Tom e Traduzir abrirem submenu ao lado, como na Tiptap. Por quê: a `UCommandPalette` abre filhos no lugar, com o botão de voltar no campo; submenu lateral pediria outro componente e o filtro por digitação deixaria de valer para a lista inteira. Ficou como está.
- **CSS fora da prop:** nenhum; tudo pela prop `ui` da paleta (`root`, `content`, `footer`).
- **Ver:** `evidencias/proto-caixa-do-beni.png`

## Rodada 5 · 2026-10-13
- **Pedido (literal):** "ta muito estranho. um campo enorme em cima e um pequeno abaixo ta horrivel. o mercado realmente faz assim? volte pra como tava antes se precisar"
- **Mudou:** a caixa do BENI volta a ser um cartão só, na largura do campo, como na rodada 3 (`_CaixaDoBeni.vue` e `_CampoHtml.vue` da rodada 3).
- **Descartado:** a caixa em 2 peças da rodada 4. Motivo: Notion, Tiptap e BlockNote fazem assim, mas lá o pedido tem a largura de uma coluna de texto; no campo do ENSPACE, mais largo, o contraste entre o pedido enorme e a lista estreita ficou estranho.
- **Ver:** `evidencias/proto-caixa-do-beni.png` (de volta à da rodada 2)

## Rodada 6 · 2026-10-14
- **Pedido (literal):** "se o cara ta com a ia desligada, nao deve simplesmente bloquear a açao. isso nao é bom cta. deve ter ali a possibilidade de ele clicar, mas ao clicar redireciona pra ele ativar a ia e renderiza ali mesmo o que hoje ta na nossa tela de integraçao pra ativar o chatgpt. veja como é hoje pra entender como adaptar pra esse contexto"
- **Hoje (develop):** Configurações › Integrações › OpenAI › "Instalar Integração" › modal com "Api Key" e "Salvar". Detalhe e achados no BRIEFING, "A IA de hoje".
- **Mudou:**
  - com a IA desligada, nada fica bloqueado: o botão IA (barra fixa, barra da seleção, menu do bloco), o Ctrl J e as ações do BENI no "/" continuam clicáveis;
  - o clique abre, no lugar da caixa do BENI, a caixa "Ative a IA para escrever com o BENI" (`_AtivarIa.vue`): a tela de integração de hoje trazida para o campo;
  - o "/" ganha "Ativar a IA" como 1º item do grupo BENI;
  - quem administra cola a chave ali mesmo, com o que falta na tela de hoje: "Onde pego a chave?" (página de chaves da OpenAI), o aviso de créditos, olho para mostrar a chave, erro no próprio campo e onde trocar depois;
  - ao ativar: "IA ativada", e a caixa vira a do BENI ali mesmo; se a pessoa tinha escolhido uma ação (Resumir, Continuar...), ela roda sozinha, e a caixa avisa antes ("Ao ativar, o BENI já faz o que você pediu");
  - a ativação vale para o workspace: o outro campo da tela também passa a ter IA;
  - quem não administra vê quem administra e "Pedir para ativar", com aviso de pedido enviado;
  - o andaime ganha o estado "Desligada (você é membro)".
- **Mudou também:** "Anexar arquivo" no rodapé da caixa do BENI, porque o "Subir Arquivo" já existe na IA de hoje (maquete: só o nome do arquivo entra).
- **Fronteira:** muda o que acontece com a IA desligada; não mudam a caixa do BENI, a proposta, os seletores nem a tela de Configurações › Integrações.
- **Simulação:** a chave não sai do navegador; qualquer chave que começa com `sk-` e tem 20 caracteres ou mais passa.
- **CSS fora da prop:** nenhum.
- **Detector de seta:** `proto-ativar-ia-*.png` saem com "SETA" em x=1565, que é o topo da barra de rolagem da página (recorte ampliado conferido), não o ponteiro.
- **Ver:** `?ia=desligada` e `?ia=membro` · `evidencias/proto-ativar-ia-admin.png`, `evidencias/proto-ativar-ia-membro-es.png`, `evidencias/hoje-openai-*.png`

## Rodada 7 · 2026-10-14
- **Pedido (literal):** "o modelo que voce fez ali pro campo, pra quando nao tem ia ativada, nao pod comportar só o chatgpt. hoje temos integraçao só com eles, mas teremos depois com claude, kimi... outras IAs. isso deve ser comportado ali. pode até simular com claude e gemini ali por exemplo. como seria a jornada? pode abrir um modal renderizando a nossa tela de integraçoes, por exemplo, e o cara executa por ali e já volta no campo com tudo ativado, pra facilitar. o quer acha?" e, depois da proposta, "pode aplicar"
- **Mudou:**
  - quem administra, com a IA desligada, vai do botão IA, do Ctrl J ou do "/" direto ao modal **"Conectar uma IA"** (`_ConectarIa.vue`), um só na página;
  - o modal é a seção Inteligência Artificial de Configurações › Integrações, não a tela inteira: 1 cartão por IA, no formato do cartão de hoje (logo, frase, botão);
    - ChatGPT (OpenAI): a integração que existe hoje;
    - Claude (Anthropic) e Gemini (Google): simulados;
    - Kimi (Moonshot AI) e DeepSeek: "Em breve", sem clique;
  - "Conectar" leva ao passo da chave no mesmo modal: onde pegar a chave de cada empresa, créditos, olho, erro no campo e o formato de cada chave (`sk-`, `sk-ant-`, `AIza`);
  - conectada: os modelos liberados, "Conectar outra IA" e "Voltar ao campo"; ao voltar, a ação escolhida roda, ou a caixa do BENI abre;
  - o seletor **Modelo** passa a depender das IAs conectadas (`ias.ts`): liberados primeiro; depois "Precisam de uma IA conectada", com "Conectar"; por último "Em breve". O clique em "Conectar" abre o modal no passo da chave e, conectada, o modelo fica escolhido;
  - agente com modelo de IA não conectada (o Assistente Jurídico usa Claude Opus 4.6): o pedido abre o modal no Claude, com o motivo, e roda ao voltar;
  - quem é membro continua com o pedido de ativação na caixa (`_PedirAtivacao.vue`, antes `_AtivarIa.vue`), agora citando ChatGPT, Claude ou Gemini.
- **Descartado:** a caixa de ativação dentro do campo da rodada 6 (só OpenAI). Motivo: com várias IAs, a lista e o formulário da chave não cabem embaixo do campo.
- **Não foi a tela inteira de Integrações:** ela tem dezenas de integrações e, hoje, rótulos com chave de tradução e a página de apps em branco (BRIEFING, "Achados").
- **Andaime:** "Ligada" e "Responde com erro" têm a OpenAI conectada, como hoje; as desligadas, nenhuma. Conectar pelo modal leva o andaime a "Ligada" e mantém o que foi conectado.
- **Fronteira:** muda o que acontece sem IA conectada e o seletor de Modelo; não mudam a caixa do BENI, a proposta, o seletor de agente nem a tela de Configurações.
- **Simulação:** a chave não sai do navegador; vale qualquer chave no formato da empresa.
- **CSS fora da prop:** nenhum.
- **Ver:** `?ia=desligada` (modal) e `?ia=ligada` com o Assistente Jurídico (modelo sem conexão) · `evidencias/proto-conectar-ia-lista-es.png`, `evidencias/proto-conectar-ia-pelo-modelo.png`, `evidencias/proto-conectar-ia-conectada.png`

## Rodada 8 · 2026-10-14
- **Pedido (literal):** "deixei conectar com qualquer chave falsa pra simular o que aconteceria a pessoa colocando a chave ali"
- **Mudou:** o modal "Conectar uma IA" conecta com qualquer chave preenchida; saiu a conferência do formato de cada empresa (`sk-`, `sk-ant-`, `AIza`) e o erro de chave inválida. O campo vazio continua pedindo a chave. O exemplo do campo ainda mostra o começo da chave de cada empresa.
- **Fronteira:** muda só a conferência da chave; o resto do modal e da jornada continua como na rodada 7.
- **Ver:** `?ia=desligada` › IA › Conectar no Claude › qualquer texto › Conectar

## Rodada 9 · 2026-10-14
- **Pedido (literal):** "pode colocar outro estado ali tambem, que é quando o cara tem mais de uma ia instalada e ele vai usar ia no campo. ele tem que selecionar o que vai usar, qual integraçao. nao? ou tem modo mais fluido? veja como concorrentes fazem isso." e, depois da proposta, "pode aplicar"
- **O que os concorrentes fazem:** ninguém pede para escolher a integração antes de usar. Quem administra conecta as chaves nas configurações; quem escreve escolhe o modelo, num seletor só, com "Auto" de padrão (Notion AI; GitHub Copilot, com os modelos das chaves num grupo e "Manage Models" no rodapé do seletor; Raycast; Zed).
- **Mudou:**
  - andaime com o estado **"Ligada, 3 IAs"** (ChatGPT, Claude e Gemini conectados);
  - sem passo extra: o botão IA abre a caixa do BENI direto, com "Auto";
  - o **Auto escolhe entre as IAs conectadas** (`modeloDoAuto`, em `ias.ts`): pedido curto ou de conferência vai ao modelo rápido, o resto ao de mais qualidade. A barra da proposta diz qual ele usou ("BENI · Auto: Claude Sonnet 4.6"), e a velocidade da escrita simulada segue esse modelo;
  - o **seletor de Modelo agrupa por IA**, com o logo no título: Auto no topo, as conectadas, as que pedem conexão (com "Conectar" no título) e as "Em breve";
  - quem administra vê no rodapé do seletor "Conectar outra IA" (ou "Ver as IAs conectadas", quando todas as disponíveis estão conectadas), que abre o modal da rodada 7;
  - a escolha de modelo continua valendo para os próximos pedidos da sessão; o agente continua trazendo o modelo dele.
- **Regra do Auto é do protótipo:** a do produto (quais modelos, em que ordem) é decisão do time.
- **Fica como sugestão ao time:** modelo padrão do workspace, escolhido por quem administra em Integrações; favoritos no seletor, como no Notion.
- **Fronteira:** mudam o andaime, o seletor de Modelo e o rótulo do modelo na barra da proposta; não mudam a caixa do BENI, o modal, o seletor de agente nem a proposta.
- **CSS fora da prop:** nenhum.
- **Ver:** `?ia=varias` · `evidencias/proto-varias-ias-seletor.png`, `evidencias/proto-varias-ias-auto.png`

## Aprovado · 2026-10-14
- **Pedido (literal):** "pode publicar e deixar na pagina de prototipos nao como em revisao, mas como ja finalizado, ja pronto"
- **Mudou:** o protótipo passa a **aprovado**, no card do índice (`definePageMeta`) e no `README.md`.

## Rodada 10 · 2026-10-20
- **Pedido (literal):** "tem um ponto: ao usar ia no enspace o user pode usufruir de todos os modelos que disponibilizamos, sem precisar de conexao nenhuma. ele conectar a ia dele significa só que o custo vai ser absorvido por ele. veja os impactos dessa informaçao na atual jornada e ajuste"
- **O que a regra derruba:** as rodadas 6 e 7 partiam de "sem integração, sem IA". Com a regra nova:
  - não existe IA desligada por falta de chave: o botão IA, o Ctrl J e o "/" abrem a caixa do BENI sempre;
  - nenhum modelo fica bloqueado: o agente com Claude Opus responde sem chave nenhuma;
  - a chave é opcional e só muda quem paga; o modal deixa de abrir sozinho no meio do pedido.
- **Mudou:**
  - saíram o modal que abria ao clicar em IA, o "Ativar a IA" do "/", a conexão exigida pelo modelo do agente e a caixa de pedido de ativação do membro (`_PedirAtivacao.vue`);
  - o seletor de Modelo libera todos os modelos. O grupo da empresa com chave conectada ganha o selo "Sua conta", com ícone de chave (como o Raycast marca os modelos da chave própria), e cada modelo diz "Cobrado na conta OpenAI" no lugar do consumo de en-credits;
  - o rodapé do seletor vira "Usar a chave de uma conta própria" (ou "Ver as chaves conectadas"), e é o único caminho até o modal dentro do campo;
  - o modal vira **"Chaves de IA do workspace"**, com "Opcional" na descrição e o aviso "Todos os modelos já funcionam sem chave, com os en-credits do ENSPACE. A chave só muda quem paga." Os botões viram "Conectar chave"; conectada, o modal lista os modelos que passam a ser cobrados na conta;
  - a barra da proposta diz em que conta o consumo caiu quando há chave: "Auto: Claude Sonnet 4.6 (conta Anthropic)". Sem chave, fica só o modelo (en-credits é o padrão);
  - o Auto escolhe entre todos os modelos, com chave ou sem;
  - o andaime troca "Ligada / Desligada / membro" por **Sem chave (en-credits)**, **Chave da OpenAI** (a única que o ENSPACE aceita hoje) e **3 chaves próprias**, mais "Responde com erro". Endereço antigo (`?ia=desligada`, `?ia=membro`) cai em "Sem chave".
- **Ficou de fora, como pergunta ao time:**
  - o que acontece quando os en-credits acabam. Um aviso com "Usar a chave de uma conta própria" seria a saída natural, mas a regra não foi dita;
  - se quem não administra vê o rodapé das chaves. O protótipo mostra a visão de quem administra;
  - se o Auto deve preferir os modelos que têm chave própria.
- **Fronteira:** mudam a entrada da IA, o seletor de Modelo, o modal das chaves, o rótulo do modelo na barra da proposta e o andaime; não mudam a caixa do BENI, a proposta, o seletor de agente nem a barra de ferramentas.
- **CSS fora da prop:** nenhum.
- **Ver:** `?ia=chave` · `evidencias/proto-chave-seletor.png`, `evidencias/proto-chave-modal.png`, `evidencias/proto-chave-barra.png`. As evidências das rodadas 6, 7 e 9 (`proto-ativar-*`, `proto-conectar-*`, `proto-varias-*`) ficam como histórico.

## Rodada 11 · 2026-10-20
- **Pedido (literal):** "quando acabar os en-credits, mostre o aviso com a chave própria. e pode colocar um estado aí sem créditos pra usar a ia o que acontece. como se comporta?"
- **Mudou:**
  - andaime com o estado **"Sem en-credits"**: os créditos do workspace acabaram e nenhuma chave está conectada;
  - nada bloqueia o clique: o botão IA, o Ctrl J e o "/" abrem a caixa do BENI como sempre;
  - enquanto o modelo escolhido depender de en-credits, a caixa mostra no topo o aviso **"Os en-credits do workspace acabaram"** (`_AvisoSemCreditos.vue`):
    - com "Auto": "Para seguir usando a IA, conecte a chave de uma conta própria. O consumo passa a ser cobrado nessa conta." e o botão "Usar a chave de uma conta própria", que abre o modal das chaves na lista;
    - com um modelo fixo (escolhido ou do agente): "O GPT-5.4 usa en-credits. Para seguir com ele, conecte a chave da conta OpenAI." e o botão "Conectar a chave da conta OpenAI", que abre o modal direto no passo da chave; se outra conta já tem chave, o aviso lembra que dá para trocar o modelo;
  - a ação pedida sem créditos não roda nem some: fica esperando, e o aviso diz "Ao conectar, o BENI faz o que você pediu: Resumir o campo.". Conectada a chave certa, a ação roda sozinha ao voltar ao campo;
  - sem créditos, o Auto escolhe só entre os modelos das contas com chave;
  - no seletor de Modelo, o modelo sem chave mostra "Sem en-credits" no lugar do consumo.
- **Não foi inventado:** compra ou recarga de en-credits, data de renovação e aviso antes de acabar. Nada disso foi dito; fica como pergunta ao time.
- **Contraste:** o botão do aviso começou amarelo sobre o fundo amarelo claro (abaixo de 4,5:1) e passou a neutro com contorno.
- **Fronteira:** muda o que acontece sem en-credits; não mudam a caixa do BENI, o modal das chaves, a proposta nem os outros estados.
- **CSS fora da prop:** nenhum.
- **Ver:** `?ia=semCreditos` · `evidencias/proto-sem-creditos-aviso.png`, `evidencias/proto-sem-creditos-depois-da-chave.png`
- **Pesquisa das ações rápidas do menu (pedida na mesma mensagem):** resposta no chat de 2026-10-20; aplicada na rodada 12.

## Rodada 12 · 2026-10-20
- **Pedido (literal):** "pode aplicar e publicar. publique junto um doc de requisitos pra um dev trabalhar nisso" e, em seguida, "coloque outro doc de requisitos junto, que é como fazer as barras do campo html, o comportamento dele, o que aparece ao colocar /, como é a barra de ferramentas etc. isso porque o campo não é assim hoje. seria algo meio 2 em 1, entao vou abrir 2 demandas usando um mesmo prototipo"
- **Pesquisa (rodada 11, no chat):** as ações rápidas que se repetem nos editores com IA são melhorar a escrita, revisar ortografia e gramática, encurtar ou expandir, mudar o tom, traduzir, resumir e continuar escrevendo (Tiptap, Confluence Rovo, Notion, Google Docs, Word, BlockNote e a IA de hoje do ENSPACE, que tem "Revisar").
- **Mudou:**
  - sem texto selecionado, a caixa do BENI ganha o grupo **"Editar o campo"** ("Revisar ortografia e gramática", "Melhorar a escrita", "Mudar o tom ›", "Traduzir ›", "Encurtar"), antes de "Escrever";
  - essas ações valem para o campo inteiro: a proposta risca o campo todo e o Aceitar substitui tudo;
  - "Extrair pendências" saiu da caixa e do "/": só o Notion tem, e lá é bloco do "/";
  - "Corrigir ortografia e gramática" virou **"Revisar ortografia e gramática"**, como a IA de hoje do ENSPACE, e passou a vir em 1º lugar também com seleção;
  - o "/" segue a mesma ordem: "Revisar", "Melhorar", "Encurtar", "Continuar", "Resumir", "Rascunhar" (Tom e Traduzir ficam na caixa, que tem os submenus).
- **2 documentos de requisitos, para 2 demandas com o mesmo protótipo:**
  - `REQUISITOS-EDITOR.md`: o campo Editor de texto HTML sem a IA (barra fixa, barra da seleção, cor, link, "/", atalhos, alça do bloco, menção, emoji, tabela, pé), com o lugar da IA reservado;
  - `REQUISITOS-IA.md`: o BENI no campo (entradas, caixa, ações, proposta, agente e modelo, chaves de conta própria, sem en-credits), que depende do primeiro.
- **Fronteira:** mudam as ações da caixa e do "/"; não mudam a proposta, os seletores, o modal das chaves nem o aviso de en-credits.
- **CSS fora da prop:** nenhum.
- **Ver:** `evidencias/proto-menu-sem-selecao.png`, `evidencias/proto-revisar-campo-inteiro.png`

## Rodada 13 · 2026-10-29
- **Pedido (literal):** "agora, com base nas regras definidas de escrita neste chat, ajuste a escrita deste card aqui https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE73DAC51A14FE4F9180A53D70F3C34 colocando no novo padrao com divisao em tasks" e "atualie tambem os docs de requisito desse item de campo html com ia no github".
- **Mudou (só os requisitos da IA; o protótipo não mudou):**
  - `REQUISITOS-IA.md` virou o épico `requisitos/epico.md`, em 9 partes, cada uma a tarefa do card: 1. Pedir ao BENI e aceitar a proposta; 2. Editar o campo inteiro; 3. O que a IA lê e anexo; 4. Pedidos salvos; 5. Outras entradas; 6. Modelo; 7. Agentes; 8. Chaves de IA do workspace; 9. Sem en-credits;
  - os IDs ficaram; entraram RI007 a RI010 (o que a geração recebe e devolve: campos do item e anexo, modelo, agente, conta cobrada);
  - RNF001 (contraste) e RS001 (idiomas) saíram para o padrão de qualidade do épico; o texto gerado no idioma do workspace e o BENI no masculino foram para a linha "Exceção deste épico";
  - RF005 e RF033 foram reescritos sem citar outra parte; o "(xxxx)" da dependência saiu, porque o card da demanda do front não foi achado no ENSPACE;
  - cada requisito ganhou a coluna Relevância (Desejável onde a prioridade é Desejável, Obrigatório no resto: proposta do agente);
  - `REQUISITOS-EDITOR.md` aponta para o épico.
- **Prints (regra 42):** 66 em `evidencias/requisitos/`, 1 por requisito com tela; 14 sem tela (interface, atributo de acessibilidade, tempo): RI001 a RI010, RNF002 a RNF004 e RS002. Detector de seta: 0 de 66.
- **Ferramenta:** `ferramentas/prints-de-requisito.mjs` ganhou o campo `antes` (troca o estado do andaime antes de a cena abrir a caixa) e as teclas Ctrl J e Ctrl Z.
- **Fronteira:** mudam os documentos de requisitos; não muda nenhuma tela.

## Rodada 14 · 2026-10-30

- **Pedido:** "nao é um print por requisito. isso vai ser insano. é um print por grupo de requisito. se, por exemplo, os 5 primeiros requisitos puderem aparecer no mesmo print, ótimo. basta colocar as caixinhas no print com o texto com o ID do requisito pra dar pra compreender." E: "confira se agora que no card a tabela de requisitos é escrita como LISTA, ainda permanece a indicaçao de quais sao necessarios, opcionais, importantes etc".
- **Prints (regra 42, revista):** 50 prints para 66 requisitos com tela, 1 por grupo de requisitos da mesma seção que aparecem na mesma tela; cada requisito tem a sua caixa magenta com o ID ao lado. O `grupos.json` diz o print de cada ID. O maior grupo junta 6 requisitos (o modal das chaves: RF047 a RF051 e RF057). RF027 (campo só leitura com a proposta aberta) entra no print de RF025 por `"junto"`. Os requisitos que ficam sozinhos pedem cada um um gesto que muda a tela (passar o mouse, abrir um menu, Esc, digitar). Detector de seta: 0 de 50.
- **Tarefas:** os requisitos de cada grupo ficam juntos na seção, com o print abaixo das caixas; cada caixa leva no fim a prioridade e a relevância ("(prioridade: Essencial; relevância: Obrigatório)").
- **Fronteira:** mudam os prints e o texto das tarefas do card; não muda nenhuma tela nem os documentos de requisitos.

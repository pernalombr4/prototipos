# Decisões

**Fronteira:** muda o campo Editor de texto HTML (botão IA na barra, grupo da BENI no "/", caixa da BENI, placeholder). Não muda a casca, o painel do item, a barra de folders, os outros campos nem os outros botões da barra.

## Rodada 1 · 2026-10-08

- **Pedido (literal):** "permitir uso de ia durante escrita de texto no campo html por comando com "/"" e "colocar botão pra utilizar IA na barra de ferramentas do campo html"
- **Mudou:**
  - **Botão IA** no começo da barra fixa, em rosa suave, com dica "Escrever com a BENI" e Ctrl J.
    - Sem trecho selecionado: Pedir à BENI, Continuar escrevendo, Resumir o texto, Rascunhar com os dados do item. Continuar e Resumir ficam desativados com o campo vazio.
    - Com trecho selecionado: Melhorar a escrita, Corrigir ortografia e gramática, Encurtar, Expandir, Mudar o tom (Formal, Amigável, Direto), Traduzir (Português, Inglês, Espanhol), Resumir e Pedir à BENI.
  - **Grupo BENI (IA)** no topo do menu "/", com descrição em cada item: Pedir à BENI, Continuar escrevendo, Resumir o texto, Rascunhar com os dados do item. "/ia", "/ai" e "/beni" filtram o grupo.
  - **Caixa da BENI**, logo abaixo do trecho ou da linha do cursor, dentro do campo:
    - pedido: campo livre com as sugestões embaixo; o que a pessoa digita vira o 1º item ("Seu pedido") e o Enter envia;
    - gerando: a resposta chega palavra por palavra, com a BENI animada e o botão Parar;
    - pronto: Substituir a seleção (ou Inserir), Inserir abaixo, Tentar de novo, Descartar e um campo para pedir ajuste ("mais curto", "em lista");
    - erro: "A BENI não respondeu." com Tentar de novo e Descartar; o campo não muda.
  - **O trecho fica realçado** enquanto a caixa está aberta, e o texto que entra acende e apaga em 2 s.
  - **Toast com Desfazer** depois de aceitar; o Ctrl Z do editor desfaz também.
  - **Rodapé da caixa:** "Lê este campo e mais 5 campos do item" abre a lista dos campos lidos e uma chave para não usá-los; "A BENI pode errar. Confira antes de salvar."; Esc fecha.
  - **Placeholder:** `Escreva ou digite "/" para acessar os comandos e a IA...`. Com a IA desligada, volta ao texto de hoje.
  - **IA desligada no workspace:** o botão fica no lugar, apagado, com a dica do motivo e de onde ligar (Configurações › Agentes de IA). O grupo da BENI sai do "/".
- **Por quê, em 1 linha cada:**
  - **A BENI propõe, a pessoa aplica.** O campo só muda no Substituir ou no Inserir. O Confluence troca o texto ao vivo; num campo que se salva junto com o item, a pessoa precisa ver antes de o original sumir (PESQUISA, Confluence e Google Docs).
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
  - **A BENI é simulada** (`simulador.ts`): os 2 parágrafos do Parecer têm resposta pronta para cada ação; texto escrito pela pessoa recebe resposta de regra (corrigir troca palavras sem acento, encurtar fica com a 1ª frase, expandir acrescenta uma frase). Tradução de texto livre mostra o aviso "Simulação: a tradução está pronta só nos 2 parágrafos do exemplo."
  - A simulação escolhe a resposta do pedido livre por palavra: e-mail, lista ou pendências, resumo, risco; o resto vira o rascunho com os dados do item.
  - O texto gerado fica em português nos 3 idiomas da interface: é dado do workspace, como o conteúdo do campo.
  - Alinhamento não alinha: precisa da extensão TextAlign, que o protótipo não tem.
  - Emoji abre 12 emojis fixos; o produto tem o seletor completo.
  - A barra de folders troca de folder, mas só a Visão Geral tem conteúdo.
- **CSS fora da prop:** nenhum `<style>`, `:deep()` nem `!important`. Os seletores de Tailwind que restam:
  - `[&_li]`, `[&_p+p]`, `[&_strong]`, `[&_ul]` na resposta da caixa: o texto vem em HTML (`v-html`), sem componente para receber prop;
  - `[&>*]:size-full` no contêiner da BENI: o `Beni` desenha em 160 px e não tem prop de tamanho (README do `@be-enlighten/beni-avatar`).
- **Componentes:** `UEditor`, `UEditorToolbar`, `UEditorSuggestionMenu` (MCP `nuxt-ui`, `get-component` Editor e EditorSuggestionMenu: os comandos de IA são handlers próprios, `kind: 'beni'`, o mesmo item serve à barra e ao "/"), `UCommandPalette` (filtro e submenus de Tom e Traduzir), `UPopover`, `USwitch`, `UAlert`, `UBadge`, `UKbd`. Nenhum componente novo em `app/components/ux/`.
- **Crítica e acessibilidade** (`design:design-critique`, com a seção de acessibilidade dela; a skill `design:accessibility-review` não rodou nesta rodada):
  - A caixa cobre o texto abaixo do trecho e, no fim do campo, o campo seguinte. Ficou assim, como no Notion: empurrar o formulário para baixo a cada pedido faz a tela pular.
  - 2 campos HTML na mesma tela mostram 2 botões IA rosa. Ficou: o botão é o assunto da demanda; com 1 campo HTML por formulário, o destaque cai pela metade.
  - A resposta fica numa região `aria-live="polite"`; a caixa é `role="dialog"` com nome; o foco vai para o campo de pedido ao abrir e para o botão principal quando a resposta fica pronta; Esc fecha e devolve o foco ao trecho.
  - O botão IA desligado usa `aria-disabled` em vez de `disabled`, para a dica com o motivo continuar abrindo no foco e no hover.
- **Ver:** `pnpm dev` → http://localhost:3000/ia-no-campo-html · publicado: https://pernalombr4.github.io/prototipos/ia-no-campo-html/ · `?ia=desligada` e `?ia=erro` abrem os outros estados

# Decisões: folders do item

## A proposta em uma linha

A folder vira aba: texto sobre uma linha de base que é a borda de cima do conteúdo. A ativa ganha um traço de cor (Sublinhado) ou o fundo da página (Aba de navegador). Nenhum dos 2 estilos tem contorno, sombra nem fundo colorido.

**Aprovada: Sublinhado** (rodada 4). É o padrão de página de registro (Twenty, monday, Attio), pesa menos na barra lateral estreita e não briga com a barra do topo. A Aba de navegador saiu do protótipo na rodada 4. Os requisitos para implementar estão em `REQUISITOS.md`.

## Rodada 1 · 2026-10-08

- **Pedido (literal):** "ta parecendo um monte de botao e nao abas. a ideia iniciail foi de ficar parecendo aba de navegador, usando /nuxt-ui [...] avalie e proponha melhoria"; "acho que ele ficar parecendo um botao quando ta selecionado é uma das coisas piuores visualmente"; "hoje se a pessoa arrasta e solta no mesmo lugar que tava antes aparece popup pra salvar"; "no navegador é muito mais fluido"; "listar o que foi resolvido depois, em tabela de antes x depois"
- **Mudou:** a tabela abaixo, item por item
- **Fronteira:** muda a barra de folders, o menu da folder, o "+N", o arrasto e a linha que abria a Visão Geral; não muda a casca, o painel do item, o conteúdo das folders nem os rótulos
- **Descartado:** `useSortable` (exemplo de arrastar do MCP do Nuxt UI). Motivo: pede `@vueuse/integrations` e `sortablejs`, que o app não tem; o arrasto foi feito por ponteiro, sobre o `UTabs`. Para o produto, o `useSortable` no `TabsList` serve
- **Descartado:** "⋯" dentro de cada aba. Motivo: a aba já é um botão, e botão dentro de botão é HTML inválido; o menu fica na seta ⌄ da ativa e no botão direito
- **Não deu:** reproduzir o popup de salvar ao soltar no mesmo lugar. Por quê: o arrasto nativo do HTML não responde à automação do Chrome; fica o relato dela
- **Maquete:** salvar a ordem, ocultar, excluir, renomear e criar mexem só na memória (o recarregar volta ao começo); a lista atrás da barra lateral é estática; Comentários, Logs e Anexos têm conteúdo simples; Salvar só mostra o aviso
- **Crítica e acessibilidade:** as skills `design:design-critique` e `design:accessibility-review` não rodaram nesta rodada. Conferência à mão: foco visível nas abas (anel do Nuxt UI), `role=tablist` e `role=tab` do `UTabs`, setas do teclado movem o foco e Enter ativa, Ctrl + Shift + seta move a folder com aviso no leitor de tela (`aria-live`), texto inativo em `text-muted`. Sem correção: o `UTabs` com `content=false` não gera `role=tabpanel`, como no produto
- **Ver:** `pnpm dev` › `http://localhost:3000/pastas-do-item` · `evidencias/proposta-sublinhado.png`, `proposta-aba-de-navegador.png`, `proposta-arrastar.png`, `proposta-mais-folders-na-barra-lateral.jpg`

### Antes e depois

| # | Antes (preview de 08/10) | Depois (protótipo) | O que mudou na interface |
|---|---|---|---|
| 1 | A ativa parece botão aceso: fundo e contorno azuis | A ativa é aba: traço de 2 px na cor da marca (Sublinhado) ou fundo da página com traço no topo (Navegador) | A marca da ativa saiu da caixa e foi para a borda que encosta no conteúdo. A ativa ganha só negrito e cor no texto |
| 2 | Cada folder é um chip com contorno, sombra e 4 px de espaço | Texto e ícone soltos, sem contorno nem sombra | Tirei a caixa de todas. O que separa uma folder da outra é o espaço do texto; no Navegador, um fio vertical entre as inativas, que some ao lado da ativa |
| 3 | Hover acende o chip inteiro, como botão | Sublinhado: texto mais forte e traço rosa fraco crescendo sobre a linha de base. Navegador: a aba inteira em cinza | Sem fundo no Sublinhado: o hover é uma prévia do traço da ativa, na cor de destaque mais fraca (rodada 2) |
| 4 | Barra e conteúdo não se tocam: faixa sem borda, linha solta 45 px abaixo | Linha de base contínua de ponta a ponta; o conteúdo começa logo abaixo dela | A linha de base virou a borda de cima do conteúdo. A linha solta da Visão Geral saiu, porque repetia a separação |
| 5 | Arrasto nativo: cópia translúcida por cima, original parada, vizinha troca só na borda | A própria folder segue o mouse por cima das vizinhas (no Sublinhado, só o espaço dela e a barra, sem ficha nem sombra); a vizinha desliza assim que o centro da arrastada passa da metade dela; a aberta leva o traço junto | Arrasto por ponteiro: depois de 5 px a folder engata, acompanha o mouse e as vizinhas abrem espaço com transição, como as abas do Chrome. Arrastar não abre a folder (rodada 2) |
| 6 | Soltar no mesmo lugar abre popup de salvar | Soltar no mesmo lugar não faz nada; ordem nova salva sozinha, com aviso "Ordem das folders salva." e Desfazer | A barra compara a posição de saída e a de chegada; só avisa quando muda. Sem popup de confirmação: o Desfazer cobre o arrependimento |
| 7 | "+ ⌄" abre menu com 1 item (Nova folder) | "+" cria a folder direto; "+N ⌄" só aparece quando sobra folder | Separei as 2 ações: criar é 1 clique; ver as escondidas é outro botão, que some quando cabem todas |
| 8 | Menu "+N" com lista, busca e alça de arrasto | Menu "+N" com busca (CommandPalette), contador e "⋯" na linha em foco | Usei o padrão Popover + CommandPalette do Nuxt UI: busca, teclado e mensagem "Nenhuma folder encontrada." vêm prontos. Escolher uma escondida a traz para a barra e a abre |
| 9 | Menu da folder só pelo botão direito (na barra); o botão direito não troca de folder | Seta ⌄ visível na ativa, botão direito e clique duplo para renomear; o botão direito continua sem trocar de folder | O menu ganhou uma porta à vista, como Notion e Attio. A folder abre só no clique, com Enter ou com Espaço (rodada 2) |
| 10 | Excluir aparece em folder do sistema | Em folder do sistema, Excluir aparece desabilitado com "Folder do sistema. Você pode ocultar." | O menu explica antes do clique, em vez de abrir um modal que recusa |
| 11 | Ocultar: não conferido (não ocultei nada no workspace) | Ocultar mostra aviso com Desfazer | O mesmo aviso da ordem: a ação é imediata e reversível por alguns segundos |
| 12 | Folder aberta não vai para o endereço | `?folder=anexos` no endereço | Dá para mandar o link de uma folder, e recarregar não volta para a Visão Geral (receita "Tabs com query" do Nuxt UI) |
| 13 | Sem contador | Comentários 3, Anexos 2 | Contador opcional depois do rótulo (`badge` do UTabs), que fica na cor da marca na ativa |
| 14 | Ativa que não cabe: não conferido | A ativa sempre aparece; entra no lugar da última que cabia | A régua invisível mede cada folder e reserva espaço para a ativa e para a seta dela |
| 15 | Reordenar pelo teclado: não conferido | Ctrl + Shift + seta move a folder ativa, com aviso para leitor de tela | Mesma lógica do arrasto, pelo teclado |

## Rodada 2 · 2026-10-08

- **Pedido (literal):** "na proposta do sublinhado, o hover ainda ta fazendo parecer um bloco [...] pra mim parece que deveria talvez só acender o texto, sem fazer background, ou isso estar mais integrado com a linha de base"; "ao clicar com botao direito numa folder que nao está aberta, o usuário nao deve ser redirecionado pra ela"; "o modo como voce desenhou o arraste na versao \"hoje\" ta melhor [...] tirando o fato de que ta passando por tras [...] o da versao sublinhada ta estranho pq a linha da base nao vem junto, e parece um destaque muito forte"
- **Pedido (literal), na mesma rodada:** "pode botar o hover com texto e traço, nem bote a opçao só texto [...] o hover deve aplicar levemente a cor de destaque [...] o hover deve colocar o texto mais forte e a barra num rosa mais fraco"
- **Mudou:** hover do Sublinhado sem fundo: o texto fica mais forte (`text-highlighted`) e um traço de 2 px na cor de destaque a 35 % (`bg-primary/35`) cresce do centro sobre a linha de base, no lugar onde fica o traço da ativa
- **Descartado:** hover só no texto. Motivo: escolha dela; o traço mostra que a folder é clicável
- **Mudou:** a folder abre no clique (soltar sem arrastar), com Enter ou com Espaço. Botão direito e arrasto não trocam a folder. Motivo: o `TabsTrigger` ativa no mousedown; a barra segura o mousedown e ativa no clique
- **Mudou:** o traço da ativa é da própria aba, não mais o indicador do `UTabs`; ao arrastar a ativa, o traço vai junto. Ao trocar de folder, o traço cresce do centro em vez de deslizar
- **Mudou:** arrastando, a folder vira uma ficha leve (fundo da página, contorno fino, sombra média) por cima das vizinhas, nos 3 estilos; a fechada continua com o texto neutro, sem a cor da ativa
- **Mudou:** a troca de folder anima o espaço da seta ⌄ (padding), para as vizinhas deslizarem em vez de pular
- **Fronteira:** muda hover, ativação e arrasto da barra; não muda o resto
- **Descartado:** traço deslizante entre folders (indicador do `UTabs`). Motivo: ele não acompanha a aba arrastada
- **Ver:** `http://localhost:3000/pastas-do-item?estilo=sublinhado` · `evidencias/proposta-hover.png`, `proposta-arrastar.png`, `proposta-arrastar-a-aberta.png`

## Rodada 3 · 2026-10-08

- **Pedido (literal):** "na hora de arrastar no modelo sublinhado, nao faça parecer um \"quadradinho\" a aba. simplesmente arraste o espaço dela + a barra de baixo, sem \"subir\" e colocar sombra [...] mas mantenha essa logica de \"passou da metade, ja troca de lugar\", como ta hoje, e passando por cima das barras ao lado"
- **Mudou:** no Sublinhado, a folder arrastada perde a ficha (contorno, sombra, canto e elevação). Desliza só o espaço dela, com o fundo da página para cobrir as vizinhas, e a barra embaixo: rosa forte na aberta, rosa fraco na fechada
- **Pedido (literal), na mesma rodada:** "na hora q eu começo a arrastar a aba em que eu to, some a setinha de dropdown. nao pode sumir. fica estranho"
- **Mudou:** a seta ⌄ da folder aberta fica visível no arrasto e anda junto com ela, quando ela é a arrastada e quando é a vizinha que desliza. Fica numa camada abaixo da folder arrastada, para não parecer dela quando outra passa por cima
- **Fronteira:** muda só a aparência do arrasto no Sublinhado e a seta durante o arrasto; a troca na metade, a camada por cima e os outros 2 estilos ficam como na rodada 2
- **Ver:** `http://localhost:3000/pastas-do-item?estilo=sublinhado` · `evidencias/proposta-arrastar.png`, `proposta-arrastar-a-aberta.png`

## Rodada 4 · 2026-10-08

- **Pedido (literal):** "o estilo aba de navegador pode deletar do prototipo. ta ruim. depois disso, escreva rapidamente num doc .md os requisitos pra deixar a aba no modelo sublinhado que voce criou. ta perfeito. é assim que tem que ser."
- **Mudou:** o estilo Aba de navegador saiu do protótipo (código, textos e `evidencias/proposta-aba-de-navegador.png`). Ficam Hoje e Sublinhado
- **Mudou:** Sublinhado aprovado; o selo no andaime diz "aprovada" e o status do protótipo é aprovado
- **Mudou:** `REQUISITOS.md` com os requisitos da barra no modelo Sublinhado, para o time de front
- **Pedido (literal), na mesma rodada:** "ainda ta sumindo a setinha de dropdown na hora que seguro a aba selecionada pra arrastar [...] nao pode sumir se eu estiver arrastando a aba emq ue estou no momento"
- **Mudou:** arrastando a folder aberta, a seta ⌄ fica por cima da aba (antes, o fundo da aba arrastada a cobria). Quando outra folder passa por cima da aberta, a seta continua por baixo. Conferido pelo DOM (`elementFromPoint` no ponto da seta) nos 2 casos
- **Pedido (literal), na mesma rodada:** "o requisito abrir folder (RA) nem precisa citar. pq ja ta assim hoje no real."
- **Mudou:** saiu o grupo RA (abrir no clique, botão direito, teclado) do `REQUISITOS.md`, porque o produto já se comporta assim
- **Pedido (literal), na mesma rodada:** "navegaçao por teclado é algo que nao tem hoje mas tem que ter nos requisitos."
- **Mudou:** `REQUISITOS.md` ganhou o grupo Teclado (RT-01 a RT-10): entrar pela folder aberta, setas, Home, End, Enter e Espaço, reordenar com Ctrl + Shift + seta, anúncio para leitor de tela, menu e "+N" sem mouse. O endereço ficou num grupo só dele (RE-01)
- **Mudou:** no protótipo, a barra se remonta quando a ordem muda, para as setas seguirem a ordem da tela (antes seguiam a ordem de quando a barra montou), e o foco volta para a folder movida pelo teclado
- **Não deu:** testar o Tab real. Por quê: a tecla Tab da automação não move o foco nesta janela; setas, Home, End, Enter, Espaço e Ctrl + Shift + seta foram conferidos por evento de teclado
- **Pedido (literal), na mesma rodada:** "os TAMANHOS que voce ta cravando em px nao precisam ser cravados. o dev vai saber o que fazer. nao precisa citar tamanhos em px nos requisitos. cite tambem nos requisitos que esse tooltip existe"
- **Mudou:** `REQUISITOS.md` sem medida cravada: px, ms, porcentagem e segundos viraram descrição ("linha fina", "transição suave", "tom mais claro", "alguns segundos")
- **Mudou:** requisito RV-10 (tooltip da barra: "Arraste para reordenar. Clique com o botão direito para mais opções.") e o tooltip "Nova folder" no RX-01
- **Descartado:** Aba de navegador. Motivo: ela achou ruim
- **Ver:** `http://localhost:3000/pastas-do-item` · `REQUISITOS.md`

### Como a barra foi montada

- Os 3 estilos são o mesmo `UTabs` do Nuxt UI (`variant="link"` nas propostas, `pill` na cópia de hoje), mudando só a prop `ui` com token semântico. Consultas ao MCP `nuxt-ui`: `search-components` ("tabs", "right click menu", "sortable drag reorder"), `get-component-metadata` (Tabs: `variant`, `activationMode`, `content`, slot `list-trailing`), `get-example` (PopoverCommandPalette, TabsRouteQuery, AccordionDragAndDrop), `search-composables` (useToast).
- Peças: `UTabs`, `UContextMenu` (botão direito), `UDropdownMenu` (seta da ativa e "⋯" do "+N"), `UPopover` + `UCommandPalette` ("+N"), `UTooltip`, `UModal` (Editar, Nova, Excluir), `useToast` (Desfazer).
- Sem CSS próprio: nenhum `<style>`, `:deep()` nem `!important`.
- A seta ⌄ da ativa é um botão à parte, posicionado sobre a ponta da aba, porque o `UTabs` não aceita botão dentro do gatilho.
- O arrasto lê o DOM dos gatilhos (`data-slot=trigger`), porque o `UTabs` não repassa atributo por item.
- Estilo, modo e folder vão para o endereço (`?estilo=navegador&onde=lateral&folder=anexos`), para mandar o link de cada versão.

# Construtor de expressões: decisões

## A proposta em 1 minuto

- **O texto continua sendo o que o campo grava.** O mesmo `config.expressionEditor.expression` de hoje. O
  visual é uma leitura desse texto, e não existe mais um 2º mapa de blocos guardado ao lado (o `operationsMap`
  de hoje). Assim a expressão escrita à mão abre no visual, e a do visual abre no texto.
- **Blocos em linha, como uma frase, no lugar do canvas.** `[Quantidade] × [Preço unitário] × (1 − [Desconto]
  ÷ 100)`. Cada parte composta fica numa moldura: a moldura é o parêntese. Sem arrastar, sem zoom, sem bloco
  cortado.
- **Lacuna tipada.** Tudo começa por uma lacuna ("+ número", "+ condição", "+ valor"). Clicar abre um seletor
  com busca que só mostra o que cabe ali. Escolheu, a próxima lacuna abre sozinha: dá para montar
  `Se Status é igual a Aprovado então "Liberar" senão "Aguardar"` só com o teclado.
- **"Usar dentro de"** transforma um bloco pronto em parte de uma conta, comparação, condição ou função. Escolhe
  o valor primeiro e a operação depois, o contrário do construtor de hoje.
- **O construtor só gera o que o motor calcula certo.** No modo "O que funciona hoje", ele conhece os limites
  medidos no develop (2 níveis de parênteses, data fora da conta, `equalText` para texto, unidade sem aspas,
  valor padrão para campo vazio, âncora para o `{{#each}}` recalcular) e gera texto que passa por eles.
- **Formulário de teste no lugar da pré-visualização.** Os campos da categoria, com o Valor Virtual calculando
  no meio deles pelo motor do develop portado. Recalcula só quando muda um campo que o develop enxerga, como no
  produto.
- **2 motores no andaime.** "O que funciona hoje" não muda nada no back-end. "Novas expressões" propõe um
  motor `{{~v3}}` com as mesmas bibliotecas, que faz o que hoje não dá.

## A fronteira

- **Muda:** o miolo de "Editor de Expressão" (a chave "Habilitar Editor Visual" vira as abas Visual e Texto, no
  mesmo lugar) e a seção abaixo do Salvar ("Pré-visualização do campo" vira "Testar no formulário").
- **Não muda:** a casca, a tabela de Campos, os 4 campos básicos da gaveta, o Salvar, a lista de itens e o modal
  Novo registro. O formato gravado é o mesmo texto que o back-end já lê.

## O que o construtor faz em cada motor

| | O que funciona hoje | Novas expressões (proposta de motor) |
|---|---|---|
| Texto gravado | `math(...)`, `dayjs(...)`, `sumArray(...)`, `format(...)`, `{{~v2}}` | `{{~v3}}` + uma conta do mathjs, 1 passo por linha |
| Campo na conta | `{{data.x \| (0)}}`: o padrão cobre vazio | `seVazio(data.x, 0)`: o campo entra como valor, não como texto |
| Texto na comparação | `equalText("{{data.x}}", "...")` com aspas duplas | `igual(data.x, "...")`, sem problema com aspas |
| Parênteses | até 2 níveis; acima disso, erro no "Para conferir" | sem limite |
| Datas | peça solta: somar, subtrair, tempo entre, formato, 1 ação | em qualquer conta e condição: `tempoEntre`, `somarTempo`, `antesDe` |
| Condição | ternário do mathjs (`? :`) | o mesmo, com datas e texto dentro |
| Listas | soma de 1 coluna; "para cada linha" com Handlebars | soma, contagem, média, maior e menor, com filtro ("só onde Situação é igual a Paga") |
| Passos com nome | não; o construtor recoloca o passo dentro da conta | sim (`subtotal = ...`) |
| Formato | `format(...)` dentro da expressão, com `"type":"number"` | configuração do campo, fora da expressão |
| Erro | o motor de hoje mostra 0 ou "Expression Processing Error"; o construtor impede antes | a mensagem diz o motivo (data vazia, tipo, escrita) |

Trocar de motor converte a expressão: a árvore é a mesma, só o texto muda. Os passos voltam para dentro da
conta no modo hoje.

## Expressão antiga, escrita à mão e o que o construtor não desenha

- **Expressão do construtor antigo abre corrigida.** `subtract(a, b, 10)` (dá 0 hoje) vira `a − b − 10`;
  `"type":"EnlNumber"` vira `"type":"number"`; unidade de data com aspas perde as aspas. Um aviso lista cada
  correção, e o Salvar grava a versão corrigida.
- **O que não tem bloco vira "trecho de texto".** `math(log10(1000))` aparece como um bloco amarelo com o texto
  original, gravado sem mudança, e o link "Editar no modo Texto".
- **Conferência:** os 13 exemplos do andaime passam por ler e gerar de novo e dão o mesmo resultado no motor do
  develop. Só a expressão antiga muda, de propósito (0 → 1.828,40).

## Rodada 1 · 2026-10-15
- **Pedido (literal):** "o objetivo é construir um construtor visual de expressoes que seja FUNCIONAL, para aplica-lo a qualquer lugar do enspace que trabalhe com expressoes, mas começando por esse campo." (demanda inteira no `BRIEFING.md`)
- **Mudou:** Editor de Expressão com abas Visual e Texto, blocos em linha, lacunas tipadas, seletor com busca, "Usar dentro de", "Se estiver vazio, usar", opções da lista de seleção na comparação
- **Mudou:** formato de exibição fora da conta (Número, Moeda, Percentual, Data), expressão gravada sempre à vista com Copiar, painel "Para conferir" com "Ver o bloco"
- **Mudou:** formulário de teste com 3 cenários (dados completos, tudo vazio, casos difíceis), "Usado na expressão" nos campos, valor gravado e campos que disparam o cálculo
- **Mudou:** lista de Orçamentos com o campo calculado em 8 itens e Novo registro calculando ao vivo
- **Mudou:** andaime com o motor (hoje ou novas expressões) e 13 exemplos
- **Fronteira:** muda o miolo do Editor de Expressão e a seção de pré-visualização; não muda a casca nem o formato que o back-end lê
- **Descartado:** canvas com arrastar (Vue Flow), o de hoje. Motivo: corta botão, exige zoom, não funciona por teclado e obriga a escolher a operação antes dos valores (Dimensões Cognitivas: comprometimento prematuro)
- **Descartado:** campo como `data.x` sem chaves dentro do `math()` no modo hoje, que o motor aceita. Motivo: o formulário do develop só recalcula com campo escrito `{{data.x}}`
- **Descartado:** "Se, então, senão" pelo `{{#if-condition}}` do Handlebars no modo hoje. Motivo: não tem senão, e campo vazio esconde os 2 lados; o ternário do mathjs cobre o caso
- **Descartado:** IA que escreve a expressão. Motivo: todos os concorrentes têm, mas a demanda é o construtor funcional; fica para outra rodada
- **Não deu:** testar a âncora `{{#if false}}{{data.x}}{{/if}}` no formulário real do develop. Por quê: medida pela função que extrai os campos (`fromValue` do develop), não com um item na tela
- **Não deu:** dias úteis (`businessDiff`). Por quê: depende do calendário do workspace e de um plugin do dayjs que o protótipo não carrega; o motor portado devolve "--"
- **Maquete:** Salvar grava em memória; a lista e o Novo registro usam a expressão salva; o reload volta ao exemplo inicial
- **Maquete:** as abas Visual, Regras e Condições, Eventos de Campo e Ajuda da gaveta; os outros campos da tabela de Campos; o motor `{{~v3}}` inteiro (funciona no protótipo, não existe no produto)
- **Maquete:** "hoje" fixo em 15/10/2026, para os exemplos de prazo não mudarem com o dia
- **Crítica e acessibilidade:** ver a seção abaixo
- **Ver:** http://localhost:3000/construtor-de-expressoes · `evidencias/proto-01` a `proto-06`

## Crítica e acessibilidade (rodada 1)

Feitas com o roteiro da skill `design:design-critique`, que inclui contraste, alvo de toque e leitura. A skill
`design:accessibility-review` não foi rodada à parte.

| Achado | Peso | O que ficou |
|---|---|---|
| O menu "⋮" de cada moldura aparece junto com o das molduras de fora quando o mouse está num bloco interno | médio | Corrigido em parte: o "⋮" só aparece no hover ou foco da moldura. Ficou: o hover no bloco interno também conta como hover no de fora |
| "Juntar outra parte" cola 2 contas sem espaço (`20539.44Aguardar`) | médio | Sem correção: é o comportamento do texto no produto. A pessoa junta uma parte de texto entre elas |
| O seletor abre para cima e corta a busca em tela baixa | médio | Corrigido com distância de colisão; em tela de 640 px de altura ainda encosta no topo |
| O operador mostra só o símbolo (×) | baixo | Mantido: a lista mostra "× vezes", "÷ dividido por" |
| Texto fixo de 1 caractere fica estreito | baixo | Corrigido: largura mínima de 8 caracteres |
| Contraste e foco | ok | Tokens do tema nos 2 modos; lacunas, campos e menus com foco visível e rótulo para leitor de tela; o resultado do Valor Virtual tem `aria-live` |
| Teclado | ok | Seletor por Enter e setas; fluxo guiado sem mouse; nada depende de arrastar |
| Alvo de toque | atenção | Botões `xs` com 24 px: passa o mínimo do WCAG 2.2 AA (24 px), fica abaixo dos 44 px recomendados para toque |

## CSS próprio e variantes

- `_FormularioDeTeste.vue`, `<style scoped>`: o pulso do campo calculado a cada resultado novo. Consulta: nenhuma
  prop do Nuxt UI anima a borda de um bloco; respeita `prefers-reduced-motion`.
- `_Bloco.vue`, classes `[&>button:last-child]:opacity-0` e `[&:hover>...]`: mostram o "⋮" só na moldura sob o
  mouse ou com foco. É utilitário do Tailwind, sem CSS próprio.
- `_TelaCampos.vue`, a gaveta com `:modal="false"` e `:dismissible="false"`: fecha só pelo X. No develop ela
  fecha ao clicar fora e perde o construtor; no protótipo isso também fecharia ao usar o andaime.

## Bibliotecas

`mathjs` 15.2.0 e `handlebars` 4.7.9, as mesmas do develop (lidas no bundle), e `dayjs` 1.11.13, todas com
versão fixa no `package.json`. São lógica, não componente visual: o motor do protótipo precisa ser o mesmo do
produto para o teste valer.

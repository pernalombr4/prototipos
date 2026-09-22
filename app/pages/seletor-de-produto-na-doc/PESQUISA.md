# Pesquisa: como outros produtos deixam escolher de qual produto é a documentação

Visitadas em 22/09/2026, pelo Chrome da usuária. **Não há print nesta pasta**: a ferramenta de
navegação desta sessão entrega a imagem para o agente ler e não grava arquivo em disco. Cada
entrada abaixo traz a URL exata e o que estava na tela, descrito em passos.

## As cinco obrigatórias

### Notion — `notion.com/help`

**Como resolve:** não resolve com seletor. O Notion tem subprodutos de verdade (Notion AI,
Notion Mail, Notion Calendar, Agentes) e todos moram **como seções da mesma árvore**: no menu da
esquerda há "Trabalhe com a IA do Notion", "Agentes no Notion" e "Notion Mail, Notion Calendar e
aplicativos", lado a lado com "Criar e formatar páginas". Não existe controle de produto em
lugar nenhum da página.

**O que serve:** é a prova de que um subproduto pequeno não precisa de seletor. Enquanto o
assunto couber em uma seção, seção basta, e o seletor só acrescenta um clique.
**O que não serve:** o ENSPACE já tem três produtos com instalação, permissão e público
diferentes. Enfiar os três na mesma árvore é o estado de hoje, que é o problema.

### Twenty CRM — `docs.twenty.com/developers`

**Como resolve:** por **link de seção no topo**, não por dropdown: `Getting Started`,
`User Guide`, `Developers`. Escolhido um, o menu da esquerda inteiro vira o daquela seção, e o
seletor de idioma fica no pé do menu lateral.

**O que serve:** confirma o comportamento que a demanda pede — escolher o contexto troca a
árvore inteira, não filtra a lista. **O que não serve:** com três links no topo, o ENSPACE
ficaria com sete itens na barra (`DOCS`, `DEV`, `BLOG`, `RELEASES` mais três produtos), e o que
é seção se misturaria com o que é produto.

### ClickUp — `help.clickup.com`

**Como resolve:** produto único, sem seletor. A barra tem `API & MCP`, `Categories` e `Status`.
A documentação de desenvolvedor sai por um link separado no topo, que é o mesmo desenho do `DEV`
do ENSPACE.

**O que serve:** mostra que "documentação de dev" é um eixo diferente de "produto". No ENSPACE,
o `DEV` deve continuar onde está mesmo com o seletor de produto do lado. **O que não serve:**
não tem subproduto, então não responde à demanda.

### Monday — `support.monday.com`

**Como resolve:** dois lugares ao mesmo tempo. Na barra do topo, um menu `Products`; e na
página inicial, uma faixa **"Explore by product"** com quatro cartões grandes (work management,
CRM, dev, service), cada um com ícone, nome e uma linha de descrição.

**O que serve:** a linha de descrição no cartão. É o reconhecimento de que nome de produto não
se explica sozinho, e é o que este protótipo trouxe para dentro do menu.
**O que não serve:** a faixa de cartões só existe na home do help center. Quem cai numa página
de artigo pelo Google não vê nada disso, e é justamente aí que a pessoa precisa saber em qual
produto está.

### Pipefy — `help.pipefy.com/en`

**Como resolve:** produto único. O único seletor de contexto na barra é o de idioma, com ícone
de globo e o nome do idioma por extenso, exatamente como o do ENSPACE.

**O que serve:** o idioma como referência de forma e de tamanho. O seletor de produto tem que
ser da mesma família visual do de idioma, senão a barra ganha dois desenhos de controle para a
mesma função de escolher contexto. **O que não serve:** não resolve a demanda.

## As extras, escolhidas pela natureza do problema

### Nuxt — `nuxt.com/docs/4.x` (a referência que veio na demanda)

**Como resolve, em passos:**

1. Colado na marca, um distintivo pequeno com a versão em uso: `v4.5.2` e um chevron.
2. Clicando, abre uma lista curta: `Version 5`, `Version 4` (marcada com um tique e pintada na
   cor da marca), `Version 3 (EOL)`, `Version 2 (EOL)`. Sem ícone, sem descrição.
3. Escolhendo `Version 3`, o site vai para `nuxt.com/docs/3.x/getting-started/introduction`:
   **a mesma página, na outra versão.** A versão está no caminho da URL.
4. E aparece uma **faixa de aviso no alto do conteúdo**: "Nuxt 3 reached end of life on 31 July
   2026", com os links de saída.

**O que serve:** três coisas, e são as três que este protótipo copiou. O controle grudado na
marca; a troca preservar a página em vez de jogar no começo; e o conteúdo **avisar em que
contexto a pessoa caiu**, em vez de deixar o distintivo ser a única pista.
**O que não serve:** o rótulo curto. `v4.5.2` cabe em um distintivo; `Plugin do Word` não, e um
distintivo minúsculo com o nome cortado é pior que um botão do tamanho certo.

### GitHub Docs — `docs.github.com/en`

**Como resolve:** ao lado da marca, o texto **"Select your plan:"** seguido de um botão com o
valor em uso (`Free, Pro, & Team`) e chevron. Aberto, a lista traz `Free, Pro, & Team`,
`Enterprise Cloud` e uma dezena de `Enterprise Server 3.x`. O item em uso leva **um ponto verde
à direita**, não um tique à esquerda.

**O que serve:** o rótulo dito por extenso, que é o que torna o controle descobrível. E a marca
do item em uso na direita, longe do ícone, que é onde este protótipo colocou o tique.
**O que não serve:** o rótulo externo ("Selecionar produto:") ocupa espaço que a barra do
ENSPACE não tem, porque ela já carrega quatro links, tema, idioma e entrar. Aqui o rótulo virou
título dentro do menu aberto e `aria-label` no botão.

### Atlassian Support — `support.atlassian.com`

**Como resolve:** um menu `Apps` na barra que abre um painel largo com cartões de produto (Jira
Software, Jira Service Management, Confluence, Bitbucket, Trello), mais abas `Cloud` e
`Data Center` **dentro do painel** e um link "See all other apps".

**O que serve:** o desenho para quando os produtos passam de meia dúzia, e a ideia de um segundo
eixo (lá é a forma de hospedagem) convivendo com o produto dentro do mesmo painel.
**O que não serve:** com três produtos, um painel desse tamanho é cerimônia. A lista simples
resolve, e o painel fica guardado para quando a lista passar de seis.

### Microsoft Learn — `learn.microsoft.com/office/dev/add-ins/word`

**Como resolve:** o produto hospedeiro é **um nó da árvore da esquerda** (Excel, OneNote,
Outlook, PowerPoint, Project, Visio, Word), e ao mesmo tempo existe uma segunda barra abaixo da
principal, com `Guides`, `Office applications` e `Resources`, sendo `Office applications` um
menu com a mesma lista.

**O que serve:** é o caso mais próximo do Plugin do Word, e mostra o custo de resolver pela
árvore: quem entra pela busca cai numa página de Word sem perceber que existe a mesma página
para Excel. O mesmo conteúdo aparece duas vezes, no menu e na árvore, e nenhuma das duas diz
qual está valendo. **O que não serve:** a duplicação. Aqui o produto vive em um lugar só.

---

# Segunda passada: a estética do controle

A rodada 1 acertou o comportamento e errou o desenho. O retorno dela foi direto: *"tá
grosseiro visualmente. feio. (…) o badge que o nuxt ui docs usa também é bem mais clean"*, com o
print da **nossa própria doc do SDK**, que já resolve isso melhor. Esta passada olha só a forma.

## A referência de dentro de casa: a doc do SDK

`localhost:3000/vue/start`, no print que ela mandou. É a melhor referência do conjunto porque já
é ENSPACE.

**Como é:** logo "EN" em quadrado arredondado, a palavra **SDK**, e ao lado uma pílula discreta
de borda fina com a marca do produto em miniatura (o "V" do Vue), o nome em caixa normal e uma
seta pequena. Aberta, a lista traz `Schemas`, `Core`, `Vue`, `UI`, `Beni Avatar`: **uma linha por
produto**, ícone pequeno à esquerda, nenhuma descrição, e o produto em uso escrito na cor da
marca. O painel tem a largura do conteúdo, não mais.

**O que serve:** tudo. Tamanho, caixa do texto, ícone por produto, item em uso pela cor, e o
painel curto. **O que não serve:** nada. É o alvo.

## Nuxt UI (`ui.nuxt.com`)

**Como é:** pílula totalmente arredondada com `v4.11.2` em verde sobre verde a 10%, sem borda
dura, uns 22px de altura, texto de 12px em peso normal, seta de 12px na mesma cor. Aberta: painel
estreito, linhas de 26px, item em uso em verde com tique verde à direita. Sem ícone.

**O que serve:** a fórmula de cor, que é a que este protótipo adotou: **uma família só, fundo a
10%, texto e seta na mesma cor**. **O que não serve:** o verde deles passa de contraste; o fúcsia
500 do ENSPACE sobre 10% dele mesmo dá 2,96:1 e reprova. Por isso o texto usa
`text-primary-700 dark:text-primary-300`, que é a correção de contraste que este repositório já
mantém em `app/tema-contraste.ts`.

## Tailwind CSS (`tailwindcss.com/docs`)

**Como é:** a mesma pílula, ainda mais apagada: `v4.3` em cinza sobre cinza claro, sem borda,
sem cor de marca. Seta minúscula.

**O que serve:** a prova de que o controle não precisa de cor para ser achado, desde que esteja
colado à marca. **O que não serve:** com três produtos que a pessoa talvez não conheça, o cinza
total esconde demais. Ficou no meio do caminho: cor da marca, mas em pílula.

## Supabase (`supabase.com/docs`)

**Como é:** menu `Products` na barra, painel de 210px com **ícones monocromáticos de traço**, uma
linha por produto, um rótulo minúsculo em caixa alta separando o grupo `MODULES`, e nenhuma
descrição, mesmo com dez produtos. E o produto em uso aparece **como cabeçalho do menu lateral**,
com o mesmo ícone.

**O que serve:** ícone monocromático e a ausência de descrição mesmo em escala. **O que não
serve:** repetir o produto no topo do menu lateral. Ali é redundante quando a pílula já está
colada à marca; faz sentido para eles porque o controle deles está escondido numa barra de menus.

## Sentry (`docs.sentry.io`)

**Como é:** o seletor de plataforma é uma **caixa de largura cheia no topo do menu lateral**,
com ícone e seta, acima da árvore que ele comanda.

**O que serve:** é o desenho certo quando a lista é enorme (dezenas de plataformas) e quando o
seletor precisa de um campo de busca. **O que não serve:** com três produtos, uma caixa de
largura cheia no menu lateral pesa mais que a árvore inteira.

## Prisma (`prisma.io/docs`)

**Como é:** o produto é um **segmento de caminho** ao lado da marca: `Prisma / docs / ORM`, com o
último segmento em monoespaçada. Peso visual quase zero.

**O que serve:** a leitura de hierarquia, que é o argumento a favor de manter a pílula colada ao
logo. **O que não serve:** um caminho em texto puro não parece clicável, e aqui o controle
precisa se anunciar.

## Svelte (`svelte.dev/docs`)

**Como é:** `Docs ⌄` na barra abre uma lista de quatro linhas de texto puro, sem ícone, sem
tique, sem cor.

**O que serve:** o lembrete de que o painel não precisa de enfeite. **O que não serve:** sem
marca nenhuma do item em uso, a pessoa precisa fechar o menu para saber onde está.

## Astro (`docs.astro.build`)

**Como é:** não tem seletor. Versão nova vira **faixa no topo do conteúdo**.

**O que serve:** confirma que faixa no conteúdo é o lugar de aviso de contexto, que é onde o
aviso de página sem equivalente ficou. **O que não serve:** não resolve a demanda.

## As cinco regras de forma que saíram daqui

Sete das oito documentações limpas concordam:

| # | Regra | O que a rodada 1 fazia |
|---|---|---|
| 1 | Pílula de 22 a 24px, não caixa de 29px | Caixa de 29px, do tamanho de um campo de formulário |
| 2 | Uma família de cor: fundo a 10%, texto e seta na mesma cor | Borda preta, fundo branco, texto escuro e seta ciano: quatro valores |
| 3 | Sem borda dura. Anel de 1px na própria cor, ou nada | Borda de 1px em preto puro |
| 4 | Caixa normal, peso médio, 12px | CAIXA ALTA, semibold, 13px |
| 5 | Painel da largura do conteúdo, uma linha por item | Painel de 336px com descrição de duas linhas por item |

## O padrão que todos seguem

1. **O controle de contexto mora colado à marca, no alto e à esquerda.** Nuxt, GitHub Docs,
   Atlassian e Monday põem no mesmo canto. Ninguém põe no menu lateral, e ninguém esconde num
   menu de engrenagem. Divergir disso custa a descoberta do recurso.
2. **Escolher troca a árvore inteira, não filtra a lista.** Em nenhum dos oito o contexto vira
   um filtro que esconde itens: ele troca a navegação.
3. **O contexto fica no endereço.** `nuxt.com/docs/3.x/...`, `support.atlassian.com/jira-software-cloud/...`,
   `learn.microsoft.com/office/dev/add-ins/word/...`. É o que faz o link enviado por outra pessoa
   abrir no produto certo, e o que faz o buscador indexar cada produto separado.
4. **O item em uso é marcado dentro do menu.** Tique no Nuxt, ponto verde no GitHub. Saber o que
   está valendo não pode depender de ler o botão fechado.

## O que nenhum deles faz

**Nenhum dos oito diz o que acontece quando a página não existe no outro lado.** O Nuxt chega
perto, porque avisa sobre a versão sem suporte, mas as versões têm a mesma árvore: trocar de
versão quase sempre acha a página equivalente. Entre produtos diferentes, o caso comum é o
contrário: `Selo do documento` existe no ENSPACE e no Plugin do Word, e não existe no Beni App.

Os três desfechos que a gente vê por aí, e por que nenhum presta:

| O que fazem | O que a pessoa sente |
|---|---|
| 404 no produto novo | "Quebrei alguma coisa" |
| Joga no começo, sem avisar | "Perdi o que eu estava lendo" |
| Mantém a página do produto antigo | "O seletor não funcionou" |

**É a brecha deste protótipo:** a troca leva para a página equivalente quando ela existe e, quando
não existe, leva para o começo da documentação do produto **dizendo isso em uma linha**, com o
caminho de volta ao alcance. Nenhum dos oito faz, e é barato de implementar.

**A segunda brecha, menor:** nenhum deles descreve o produto dentro do menu. Faz sentido para
versão (`v3` se explica sozinha) e para plano (`Enterprise Cloud` também). Não faz sentido para
"Beni App", que é nome próprio de uma coisa que a pessoa pode nunca ter visto. O Monday descreve,
mas só nos cartões da home, onde quem chega por link nunca passa.

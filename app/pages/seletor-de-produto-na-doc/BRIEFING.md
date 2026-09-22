# Seletor de produto na documentação

## A demanda, como ela veio

> acesse a doc do enspace https://docs.enspace.io/en
>
> prototipe o seguinte:
>
> como temos subprodutos, ela tem que ter um dropdown pra selecionar o produto que ta querendo
> ver naquela doc. algo similar ao que o nuxt docs faz (print), mas pode ir la checar tambem se
> quiser.
>
> mas em vez de ser um dropdown de versao, no nosso caso, é pra escolher o produto.
>
> opções: ENSPACE (selecionada por padrão); Plugin do Word; Beni App;

Veio com um print do `nuxt.com/docs/4.x`: o distintivo `v4.5.2` colado na marca, aberto, com
`Version 5`, `Version 4` marcada, `Version 3 (EOL)` e `Version 2 (EOL)`.

## A tela em jogo

`https://docs.enspace.io/en/docs` — qualquer página de documentação, porque o controle vive na
barra do topo e vale para todas.

**Por que a Fase 2 não foi no develop.** A regra é investigar sempre no ambiente de develop do
produto, e ela vale para tela do ENSPACE. Aqui o objeto é o próprio site de documentação, que
não tem par em develop: a Mikaela passou o endereço público, e o código que gera essa tela está
em disco, no repositório `en-docs` (**somente leitura** para este agente). Investigar pelo código
é mais preciso que investigar por print: os nomes de classe, as medidas e os rótulos de i18n
abaixo foram lidos do arquivo, não estimados da imagem.

## O que seria sucesso

Quem chega na documentação sabe, sem clicar em nada, de qual produto é o que está lendo. E, ao
trocar de produto, continua na página equivalente em vez de ser jogado no começo sem explicação.

## O que a pesquisa de UX já dizia

**Procurei e não havia nada sobre este assunto.** O `enspace-ux-research` não tem tema de
documentação: os temas existentes são `configuracoes-do-sistema`, `construtor-de-telas`,
`base-de-conhecimento`, `categorias`, `agenda` e `plataforma`. O `UX_REPORT.md` também não cita
o `docs.enspace.io` em nenhuma fricção.

O que chegou perto, e vale citar porque é sobre **documentação dentro do produto**:

- **S2-F2** (P1): *"A tela inteira é um campo de busca: sem título, sem explicação, sem estado
  vazio, sem listagem, sem como incluir conteúdo"* — é a Base de Conhecimento do produto, não a
  doc pública, mas é o mesmo defeito que este protótipo evita: **uma tela de conteúdo que não
  diz do que ela é.**
- **S2-F5** (P2): *"Português vazando na interface em inglês"*. Reforça a regra 35 aqui: o
  seletor de produto nasce nos três idiomas, e o nome do Plugin do Word muda com o idioma
  (`Plugin do Word` / `Word Plugin` / `Plugin de Word`), enquanto ENSPACE e Beni App não mudam.

## Como a documentação funciona hoje

O que a pessoa encontra hoje em `docs.enspace.io`:

1. A barra do topo tem **quatro links de seção**: `DOCS`, `DEV`, `BLOG`, `RELEASES`.
2. `DOCS` abre a documentação da plataforma. O menu da esquerda mostra a seção corrente da
   árvore de conteúdo, e a coluna da direita o "Nesta página".
3. `DEV` abre a documentação da API, com um visual próprio e um menu com verbos HTTP.
4. **Não existe nenhum controle de produto.** Toda a documentação é lida como se fosse de um
   produto só. Onde um subproduto aparece, ele aparece como página solta dentro da árvore da
   plataforma.
5. O contexto que a barra deixa escolher é **idioma** (`English`, e as traduções `pt` e `es`
   existem em `content/`) e **tema** (claro e escuro).

**Onde trava, e é o que a demanda ataca:** com Plugin do Word e Beni App entrando na doc, a
árvore da plataforma vira o lugar onde três assuntos disputam o mesmo menu. Quem procura o
plugin lê sobre a plataforma, quem procura a plataforma tropeça no plugin, e a busca devolve as
três coisas misturadas sem dizer de qual produto é cada resultado.

## A casca da tela, item por item

Copiado de `https://docs.enspace.io/en/docs` (22/09/2026) e do código do `en-docs`:
`app/components/space/SpaceNavigation.vue`, `app/layouts/docs.vue`,
`app/pages/docs/[...slug].vue` e `i18n/lang/{pt,en,es}.yaml`.

### Barra do topo

| Item | Como é |
|---|---|
| Fixação | `sticky top-0`, altura `var(--ui-header-height)` mais 23px |
| Fundo | Vidro: `bg-white/15` no claro, `bg-white/5` no escuro, `backdrop-blur-[10px]`, borda de baixo em `white/25` e `white/10` |
| Largura | `max-w-360`, padding `px-4 sm:px-6 lg:px-8` |
| Logo | `/ENSPACE.svg`, altura `h-5.25`, `invert` no claro e `invert-0` no escuro |
| Links | `DOCS` (`i-lucide-file-text`), `DEV` (`i-lucide-square-code`), `BLOG`, `RELEASES`. Caixa alta, `text-[0.875rem]`, `gap-8`, afastados do logo por `ml-28` |
| Tema | Botão com sol no claro e lua no escuro, `size-6`, opacidade 70% |
| Idioma | `USelect` com borda fina, altura `h-7.25`, canto `0.313rem`, seta em ciano no claro e fúcsia no escuro |
| Entrar | Botão preto no claro e branco no escuro, caixa alta, `h-7.25` |
| Celular | Hambúrguer de três barras que viram X, menu em `bg-cyan-50/95` e `bg-space-950/95` |

### Página

| Item | Como é |
|---|---|
| Grade | `UPage` em 12 colunas: menu à esquerda, conteúdo no meio, "Nesta página" à direita |
| Busca | `UContentSearchButton` no alto do menu, com `Ctrl K` |
| Menu | `UContentNavigation` `type="single"`, item ativo em primária, seção expansível com chevron |
| Cabeçalho | Seção acima do título, com o ícone num quadro `bg-primary/10 ring-primary/20` |
| Selo | `published` em info, `updated` em sucesso, `draft` em neutro, `deprecated` em erro |
| Ações | "Copiar texto" com ícone, e ao lado um menu com "Perguntar ao BENI (em breve)" e "Abrir no ChatGPT" |
| Sumário | `UContentToc` com o título "Nesta página", acompanhando a rolagem |

**O que está torto e fica torto** (achado, não licença para corrigir):

- o afastamento `ml-28` do grupo de links é um ajuste visual amarrado à largura do logo. Ele
  quebra assim que qualquer coisa entra ao lado da marca, que é exatamente o que a demanda pede.
  Está no `DECISOES.md` como a única medida da casca que a proposta mexe;
- o seletor de idioma mostra `English` por extenso e ocupa mais espaço que os outros controles
  da direita. Fica como está;
- o `DEV` abre uma documentação com outro visual, outro menu e outro cabeçalho. A diferença é
  anterior a esta demanda e não se resolve aqui;
- **os controles de ícone da direita não têm rótulo acessível.** A chave de tema, o seletor de
  idioma e o botão de entrar não trazem `aria-label`, então o leitor de tela anuncia "botão" na
  chave de tema. O protótipo colocou um rótulo fixo só na chave de tema, e pelo motivo técnico
  explicado no `DECISOES.md`, não por licença para arrumar a casca.

## O que foi preparado por API ou em massa

Nada. Não houve preparo de cenário: a documentação é pública e foi lida direto.

## Sobre a pasta `evidencias/`

**Esta rodada não tem print.** A ferramenta de navegação desta sessão devolve a imagem para o
agente ler, mas não grava arquivo em disco, então não havia o que mover para cá. A cópia da
casca foi conferida contra o **código-fonte** do `en-docs`, que é mais preciso que um print, e
cada arquivo está citado acima. Os prints do protótipo rodando vão na entrega da rodada.

# Menu da documentação

## A demanda, como ela veio

O pedido chegou em várias mensagens, na mesma conversa (29/09/2026). As partes que definem o critério de aceite:

> saiba que a organizaçao do repo en-docs deve refletir a organizaçao da arquitetura do enspace, refletindo a experiencia do usuario no front. [...] no começo, quando a doc era pequena, relfetíamos a estrutura do MENU de usuario do enspace na doc toda. os usuarios gostavam porque era facil se "encontrar" ali.
>
> contudo, os usuarios ja estao extremamente perdidos pra achar conteudos na doc. eles nao entedem os aninhamentos dos conteudos.

> é porque workspace fala de funçoes gerais do workspace. seçoes de menu fala das seçoes de menu em si, que ai entra a parte que o user se orienta pelo uso no sistema.

> considere que por boa pratica precisamos evitar paginas soltas, ok?

> sobre os assuntos repetidos: eles estao repetidos pq aparecem em diferentes telas e o user pode chegar la por diferentes checkpoints buscando na doc.

> saiba que a organizaçao desse repo reflete EXATAMENTE no menu da documentação no front. acha que sua proposta atende ao user leigo na organizaçao de menu?

> essa proposta de agora é boa, mas voce pode colocar ao lado outra que seja mais na estrutura do menu do enspace como foco principal mesmo. aí pegue essas 2 propostas e chame o agente /prototipo pra construir no github codando o prototipo desses 2 menus diferentes pelo menos

"Essa proposta de agora" é a proposta A (para leigo). A outra é a B (espelho do menu do ENSPACE).

## A tela em jogo

A barra lateral de `https://docs.enspace.io/pt/docs`, em qualquer página. A organização das pastas de `content/pt/1.docs` do `en-docs` vira essa barra, item por item.

**Por que a Fase 2 não foi no develop.** A regra de investigar no develop vale para tela do ENSPACE. O objeto aqui é o site de documentação, que não tem par em develop. A investigação foi no site publicado e no código do `en-docs` (somente leitura), como no protótipo `seletor-de-produto-na-doc`.

## O que seria sucesso

Quem não conhece o ENSPACE acha a página que procura pela barra, em poucos cliques, sem precisar entender como a doc se organiza.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research`. **Não há tema de documentação** (os temas são `agenda`, `base-de-conhecimento`, `categorias`, `configuracoes-do-sistema`, `construtor-de-telas` e `plataforma`), e o `UX_REPORT.md` não cita o `docs.enspace.io`.

2 fricções do menu do produto valem para a proposta B, que copia esse menu:

- **S1-F3** (P1): 2 itens "Categorias" no mesmo menu, com sentidos diferentes (os dados em Membro, o molde em Configurações > Estrutura). A doc herda a repetição: a B mantém os 2, e a linha "Este assunto também aparece em" liga um ao outro.
- **S3-P2** (P3): o menu lateral do produto tem contraste de 4,36:1, abaixo de AA. A B copia o desenho do menu, não o contraste: os textos usam os tokens `text-toned` e `text-muted` do tema.

## Como a documentação funciona hoje

Medido em 29/09/2026, no site publicado e no `content/pt/1.docs`:

| O quê | Medida |
|---|---|
| Páginas | 242 |
| Páginas com 7 níveis ou mais na URL | 119 |
| Página mais funda | Booleano, 10 níveis (`/pt/docs/workspace/sections/settings/structure/types/fields/options/unique/boolean`) |
| Cliques na barra até o Booleano | 9 |
| Largura da barra a 1440 px | 261 px |
| Links internos que dão 404 | 294 de 337, em 96 páginas |
| Páginas no mesmo nível que pastas | 33 |
| Pastas sem página índice | 16 |

O que a pessoa encontra na barra, em passos:

1. A barra abre com 8 itens no primeiro nível: Início, Conceitos, Registro e Acesso, Painel do Usuário, Workspace, Módulos, Ferramentas de IA, Limitações Conhecidas.
2. Para chegar a qualquer tela do produto, ela abre Workspace e depois "Seções de menu". Só então aparecem Membro, Configurações e Ajuda.
3. Cada pasta só abre e fecha. A página índice da pasta é o 1º filho, com o mesmo nome da pasta ("Workspace" dentro de "Workspace").
4. A barra abre 1 ramo por nível. Ela não abre sozinha no ramo da página atual: numa página funda, a barra aparece fechada.

**Onde trava:**

- **Nomes cortados.** Com 261 px, o nome corta desde o 1º nível ("Registro e…", "Seções de m…", "Configur…").
- **Pasta com nome em inglês na doc em PT.** As pastas sem índice ganham o nome da pasta do repositório: "Ai", "Logic And Control", "Documentation", "Integrations".
- **Busca em inglês.** O botão de busca diz "Search…" nos 3 idiomas.
- **Portas soltas.** O mesmo assunto tem páginas em telas diferentes (Correção Monetária, Chancela, Notificações), e 7 delas não têm link para as outras portas.

## A casca da tela, item por item

| Peça | De onde veio |
|---|---|
| Barra do topo | Cópia do `_CascaDaDoc.vue` do protótipo `seletor-de-produto-na-doc` (22/09/2026), sem o seletor de produto, que não existe no site |
| Grade | Medida no site a 1440 px: grade de 10 colunas, barra em 2 (`lg:col-span-2 lg:w-[calc(100%+20px)]`), centro em 8; no centro, texto em 9 de 12 e "Nesta página" em 3. O protótipo vizinho usava 3/6/3 |
| Barra lateral | Classes do tema do `UContentNavigation` do Nuxt UI 4.5.1 (a versão do `en-docs`): `list`, `listWithChildren`, `link`, `trigger`, o traço do item ativo e o `truncate` do nome |
| Comportamento da barra | `app/layouts/docs.vue`: `type="single"`, `highlight`, `level 0`, sem `default-open` |
| Cabeçalho da página | Seção acima do título com ícone em quadro, título, descrição, selo de status, "Copiar texto" com o menu ao lado |

**O que está torto e fica torto na casca de hoje:** o "Search…" em inglês, os nomes de pasta em inglês e os nomes cortados. Aparecem no menu "Hoje" como são.

## O que foi preparado

Nada foi criado nem mudado. O `paginas.ts` foi extraído do `content/{pt,en,es}/1.docs` do `en-docs` (somente leitura) por um script que rodou no diretório de scratch da sessão: título, descrição, `headline`, ícone, status e títulos de seção de cada página. `en` e `es` ainda estão na estrutura antiga do repositório; 43 páginas não acharam par e aparecem em PT, com aviso.

## Sobre a pasta `evidencias/`

**Esta rodada não tem print.** As ferramentas de navegação desta sessão mostram a imagem ao agente, mas não gravam arquivo em disco. As medidas acima foram lidas do site (JavaScript na página) e do código do `en-docs`.

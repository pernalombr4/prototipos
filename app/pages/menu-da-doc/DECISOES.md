# Decisões: menu da documentação

## As 4 propostas

As 4 usam as mesmas páginas da documentação. Muda onde cada página fica e como a barra se comporta.

| | A · Para leigo | B · Espelho do ENSPACE | C · Combinada | D · Até 4 níveis |
|---|---|---|---|---|
| Primeiro nível | Pelo uso: Boas-vindas, Comece aqui, Membro, Configurações, Ajuda, Painel do Usuário, Workspace, Módulos, Ferramentas de IA, Limitações Conhecidas | Pelo lugar do produto, em títulos fixos: Primeiros Passos (Boas-vindas e Conceitos), Acesso, Membro, Configurações, Ajuda, Painel do Usuário, Recursos, Referência (rodadas 5 e 6) | O da A, com "Mapa do menu" logo abaixo de Boas-vindas | O da C, com "Referência" no lugar de Ferramentas de IA |
| Seções do menu do produto | Pastas que recolhem | Títulos fixos, como no ENSPACE, com os itens, a ordem e os ícones de lá | Pastas que recolhem, como na A, e o menu do ENSPACE desenhado na página "Mapa do menu" | Como na C. As telas Campos e Spaceflow ficam sem filhos |
| Nível máximo | 6 | 5 abaixo do título fixo | 6 | 4 |
| Páginas com 5 níveis ou mais (hoje: 156) | 87 | 51 | 87 | 0 |
| Cliques até o Booleano (hoje: 9) | 6 | 5 | 6 pela barra; 5 pelo mapa | 4 |
| Linhas da barra ao abrir | 10 | 48 | 11 | 11 |
| Onde fica o que não está no menu do produto | Workspace (funções gerais), Módulos, Ferramentas de IA | Em títulos com o nome do lugar: Acesso (entrada e workspaces), Painel do Usuário, Recursos (Recursos e Navegação), Referência | Como na A | Como na A, mais os catálogos em Referência |

**O que muda nas 4:**

1. **A barra abre no ramo da página atual.** No site, isso é a prop `default-open` do `UContentNavigation`, que o `docs.vue` não passa hoje.
2. **A pasta abre a própria página índice.** A seta ao lado só abre e fecha. O índice deixa de aparecer como 1º filho com o mesmo nome da pasta.
3. **A pasta que só tem o índice aparece como link**, sem seta.
4. **O nome longo quebra linha** em vez de ser cortado.
5. **Nenhuma página solta.** Página que dividia nível com pasta vira pasta com `1.index.md` (a URL não muda). São 34 na A e na C e 31 na B; na D, as da C que ficaram. Pasta que não tinha índice ganha um (17 páginas novas na A e na C, 16 na B e 15 na D, marcadas "Página nova").
6. **"Opções" sai de Campos.** Seleção Única e Seleção Múltipla viram pastas irmãs, como o índice de Campos já lista. A página "Opções" vira seção do índice de Campos (fica fora das 4 árvores).
7. **Trilha de navegação** acima do título.
8. **"Este assunto também aparece em"**, com o caminho de cada porta no menu escolhido. As páginas repetidas continuam: são portas de telas diferentes.
9. **"Nesta seção"** na página índice: as páginas da pasta, 1 linha cada.

**Só na B:** os títulos de seção não recolhem. As tarefas de Membro ficam na ordem e com os nomes do submenu do produto: "Agendadas" e "Rápidas". Desde a rodada 4, a barra da B é o `UContentNavigation` (ver a rodada 4).

**Só na C:** a página "Seções de menu" sai de "Comece aqui", sobe para a raiz, logo abaixo de Boas-vindas, e vira "Mapa do menu". A página mostra o menu lateral do ENSPACE (Membro, Configurações, Ajuda e Menu do perfil, com os submenus que o produto tem), e cada item abre a página dele. Boas-vindas ganha uma chamada para o mapa. É a combinação que o `PESQUISA.md` sugere: a ordem da A no primeiro nível e o espelho da B como página de índice.

**Só na D:** a C com um teto de 4 níveis na barra. Página que passaria disso sai do espelho ou sobe:

1. **Tipos de campo e nós do Spaceflow vão para "Referência"**, na raiz, com as famílias e os grupos como pasta. Ferramentas de IA vai junto. Eles não são itens do menu do ENSPACE: são opções dentro de uma tela (a escolha do tipo de campo e o painel "Adicionar Nó"). As telas Campos e Spaceflow ficam no espelho, sem filhos, e levam ao catálogo pela linha "Este assunto também aparece em". Eventos de Campo e Condições Especiais vão para o fim de "Tipos de campo".
2. **Os grupos de Integrações saem** (Assinadores Digitais, Canais de Mensagem, E-mails, IA). Cada integração fica direto em Integrações.
3. **Ações em Massa vira irmã de Ações em Itens**, porque é outra tela (o modal "Ações em Lote").
4. **Etapas, Tarefas, Transições e Gatilhos viram seções da página Fluxos** (1.643 palavras juntas). É a única junção de conteúdo; o "também aparece em" que apontava para elas passa a apontar para Fluxos.

## Rodada 1 · 2026-09-29
- **Pedido (literal):** "essa proposta de agora é boa, mas voce pode colocar ao lado outra que seja mais na estrutura do menu do enspace como foco principal mesmo. aí pegue essas 2 propostas e chame o agente /prototipo pra construir no github codando o prototipo desses 2 menus diferentes pelo menos"
- **Mudou:** protótipo novo, com Hoje, A e B navegáveis sobre a árvore real da doc
- **Mudou:** modo "Lado a lado", com as 3 barras juntas e o contador de cada uma
- **Mudou:** 8 tarefas de leigo, com contador de cliques por menu e o caminho mais curto de cada um
- **Fronteira:** muda a barra lateral e 3 peças do corpo da página (trilha, "também aparece em", "Nesta seção"); não muda a barra do topo, o cabeçalho da página, o "Nesta página" nem a grade
- **Descartado:** tirar "Workspace" e "Seções de menu" da árvore sem deixar o conceito. Motivo: Workspace reúne as funções gerais, e Seções de menu orienta pelo uso. Na A, a página "Seções de menu" vai para "Comece aqui"; na B, o conceito vira os títulos fixos
- **Descartado:** unir as páginas repetidas. Motivo: cada uma é a porta de uma tela diferente
- **Não deu:** print em `evidencias/`. Por quê: as ferramentas desta sessão não gravam imagem em disco
- **Não deu:** conferir o menu do ENSPACE no develop. Por quê: o navegador interno parou no login. A casca do menu do produto veio do `BRIEFING.md` do protótipo `menu-lateral` (develop, 16/09/2026) e do print que a Mikaela mandou
- **Maquete:** o texto das seções da página (linhas neutras abaixo de cada H2 real)
- **Maquete:** a busca, o "Copiar texto", o menu do ChatGPT e os links da barra do topo não fazem nada
- **Maquete:** 43 páginas sem par em `en` e `es` aparecem em PT, com aviso
- **Maquete:** o menu do celular leva a barra da doc; no site, ele só tem os links de seção
- **Maquete:** travessão do texto real virou dois-pontos (regra 33)
- **Maquete:** ícones da B fora das seções do produto (Antes de entrar, Menu do perfil, Em todas as telas, Referência) são escolha do protótipo
- **Mudou (da crítica):** nas 2 propostas, a barra rola até o item ativo. Na B, a página aberta por um link do corpo ficava abaixo da dobra
- **Crítica:** caminho mais curto até o Booleano, pelo contador do protótipo: hoje 9 cliques, A 6, B 5
- **Crítica:** a barra da B abre com 48 linhas (1.723 px para 836 px visíveis a 1440 × 900); a A abre com 10 e a de hoje com 8. É o custo dos títulos sempre abertos, como no menu do produto, que também não cabe na tela (protótipo `menu-lateral`: 31 linhas, cerca de 1.040 px). Sem correção: é a escolha da B
- **Crítica:** na B, "Categorias" aparece 2 vezes à vista (Membro e Configurações > Estrutura), a mesma fricção S1-F3 do produto. No teste, o 1º clique foi na errada. Sem correção: a B copia o menu de propósito; a linha "também aparece em" liga as 2
- **Crítica:** a trilha e o `headline` repetem a seção em algumas páginas ("Assinadores Digitais" nos 2). Sem correção nesta rodada
- **Acessibilidade:** contraste medido, AA em tudo. Títulos fixos da B 4,77:1 (claro) e 6,47:1 (escuro); itens 8,39:1 e 7,96:1; item ativo 6,18:1 e 7,10:1
- **Acessibilidade:** pasta tem `aria-expanded` na seta, item ativo tem `aria-current="page"`, ramo fechado fica `inert` (fora do Tab), seta tem nome ("Abrir Sistema")
- **Acessibilidade:** nas propostas, cada pasta tem 2 paradas de Tab (a linha e a seta). A seta tem 28 px: passa no mínimo de 24 px da WCAG 2.2 AA, abaixo dos 44 px recomendados para toque. Sem correção nesta rodada
- **Ver:** https://pernalombr4.github.io/prototipos/menu-da-doc/ · local: `pnpm dev` → http://localhost:3000/menu-da-doc

## Rodada 2 · 2026-09-29
- **Pedido (literal):** "monta a proposta combinada: ordem da A com mapa da B, como uma terceira proposta"
- **Mudou:** proposta C no alternador de menu: a barra da A, com "Mapa do menu" na raiz, logo abaixo de Boas-vindas
- **Mudou:** página "Mapa do menu" (a antiga "Seções de menu"): o menu lateral do ENSPACE em blocos, com cada item levando à página dele. 37 itens, em 3 colunas a partir de 1280 px (Membro, Configurações, Ajuda e Menu do perfil) e em 2 abaixo disso
- **Mudou:** chamada para o mapa em Boas-vindas, só na C
- **Mudou:** o contador da tarefa mostra, na C, o caminho pela barra e o caminho pelo mapa
- **Mudou:** "Lado a lado" passa a escolher quais menus comparar (2 ou 3 dos 4). Começa com A, B e C; escolher um 4º tira o que entrou primeiro
- **Fronteira:** muda a barra (C), o corpo da página do mapa e de Boas-vindas (C) e o andaime; não muda A, B nem Hoje
- **Descartado:** o mapa como barra, ou como seção da barra. Motivo: é o que a B já testa, e a barra dela abre com 48 linhas. Na página, o mesmo menu cabe em 3 colunas
- **Descartado:** 4 barras juntas no lado a lado. Motivo: com 4, o texto da página fica com menos de 250 px
- **Crítica:** caminho mais curto até o Booleano na C, pelo contador: 6 cliques pela barra e 5 pelo mapa (mapa, Categorias de Estrutura, Campos, Seleção Única, Booleano)
- **Crítica:** a barra da C abre com 11 linhas (402 px), 1 a mais que a A. O mapa tem 678 px e começa a 379 px do topo: numa tela de 900 px, os últimos itens de Configurações (Logs, Credenciais) pedem rolagem
- **Crítica:** o mapa repete "Categorias" em Membro e em Configurações > Estrutura, como o produto (S1-F3). Aqui os 2 ficam em colunas separadas, sob o título de cada seção
- **Acessibilidade:** os itens do mapa usam os mesmos tokens da B (`text-toned` e `text-muted`, AA nos 2 temas). A ordem de leitura segue a do produto: Membro, Configurações, Ajuda, Menu do perfil
- **Maquete:** o que já era maquete na rodada 1 continua
- **Ver:** https://pernalombr4.github.io/prototipos/menu-da-doc/ · local: `pnpm dev` → http://localhost:3000/menu-da-doc

## Rodada 3 · 2026-09-29
- **Pedido (literal):** "pode aplicar como rodada 3, mantendo a versão atual, no caso, como uma terceira proposta la nos prototipos. mantenha as outras ai apareendo"
- **Pedido anterior, que define a regra:** "outra coisa que suas propostas devem evitar é aninhamento extremamente profundo. o user se perde nisso. nao é boa pratica. [...] falo de aninhamentos de 5, 6, 7 niveis. nao é que NAO PODE ter. mas deve ser evitado ao maximo."
- **Mudou:** proposta D no alternador: a C com no máximo 4 níveis na barra, pelas 4 mudanças descritas em "Só na D"
- **Mudou:** "Lado a lado" começa com B, C e D
- **Mudou:** o caminho pelo mapa também conta na D
- **Fronteira:** muda a barra da D e o corpo das páginas que a D mexe (Campos, Spaceflow, Fluxos, Integrações); não muda Hoje, A, B nem C
- **Descartado:** aplicar o teto às 4 propostas de uma vez. Motivo: o pedido foi manter as versões atuais e acrescentar uma. A D parte da C porque a C já junta a ordem da A e o mapa da B
- **Descartado:** fundir os índices das famílias de campo numa página só. Motivo: eles têm até 1.894 palavras; como pasta dentro do catálogo, cabem no 4º nível sem perder conteúdo
- **Crítica:** medido no módulo de dados, nível máximo e páginas com 5 níveis ou mais: hoje 9 e 156; A e C 6 e 87; B 5 (abaixo do título fixo) e 51; D 4 e 0
- **Crítica:** caminho mais curto até o Booleano: hoje 9, A 6, B 5, C 6 pela barra e 5 pelo mapa, D 4. Na D, o Booleano sai do mapa: o mapa leva à tela Campos, e de lá o catálogo é mais 1 passo
- **Crítica:** a D deixa 129 páginas no 4º nível (hoje, 25). O teto concentra a profundidade no limite, e cada pasta do 3º nível passa a ter mais filhos
- **Crítica:** em relação à C, 119 páginas mudam de endereço (96 vão para Referência, contando as 30 de Ferramentas de IA; 23 sobem 1 nível) e 4 viram seção de Fluxos. As 123 entram na tabela de redirecionamento
- **Maquete:** o que já era maquete nas rodadas 1 e 2 continua. Na página Fluxos, as 4 seções novas mostram só o título
- **Ver:** https://pernalombr4.github.io/prototipos/menu-da-doc/ · local: `pnpm dev` → http://localhost:3000/menu-da-doc

## Rodada 4 · 2026-09-30
- **Pedido (literal):** "certamente a opçao b é a melhor. vamos trabalhar nela. voce ta usando COMPONENTES do nuxt mesmo pra fazer esse menu? [...] veja de colocar o componente do modo correto aí, sem fazer nada personalizado se nao for estritamente necessario. vá nas docs do nuxt ui e veja o que da pra fazer."
- **Pedido (literal):** "pode olhar como funciona o código de en-docs tambem, só pra ver como é montado o menu la e usar isso como base"
- **Mudou:** Hoje e B usam o `UContentNavigation` e o `UContentSearchButton` do Nuxt UI (`_BarraDaDoc.vue`). Nas rodadas 1 a 3, a barra era desenhada à mão, copiando as classes do tema
- **Mudou:** Hoje recebe as props do `docs.vue` do en-docs e o ajuste de `listWithChildren` do `app.config.ts` de lá, passado pelo `ui` do componente para não mudar o tema dos outros protótipos
- **Mudou:** na B, o padrão do nuxt.com (`UPageAside` com `UContentNavigation :collapsible="false" highlight`), com níveis dentro dos grupos. Com `:collapsible="false"`, o componente trava todos os níveis; por isso o grupo é um item de 1º nível com `disabled: true`, que o tema desenha igual ao título de grupo do nuxt.com, e os níveis de dentro continuam recolhíveis
- **Mudou:** na B, o índice de cada pasta é o 1º filho, "Visão geral"; o de cada grupo, "Sobre esta seção". No en-docs, é o `navigation.title` do índice, sem código. O grupo não usa "Visão geral" porque Configurações tem a tela Visão Geral
- **Mudou:** `nuxt.config.ts` liga `ui.content`, a opção do Nuxt UI que registra os componentes de conteúdo. Sem ela, o `UContentNavigation` não existe no repositório de protótipos
- **Personalizado, e por quê:** 1) no grupo, `ui.linkTrailingIcon: 'hidden'` e `ui.trigger: 'cursor-default'` no item, porque o componente só esconde a seta quando a barra inteira está travada; 2) `ui.linkTitle: 'whitespace-normal! text-pretty'` na B, para o nome longo quebrar linha em vez de ser cortado; 3) pasta que só tem o índice aparece como link: no en-docs, é um ajuste no mapa da navegação do `app.vue`, como o nuxt.com faz no `asideNavigation`
- **Só existe por ser protótipo:** o item leva `active` e `onClick` (campos do próprio item), porque a doc do protótipo é uma página só. No en-docs, o item tem `path`, e o componente acha a página ativa pela rota. A classe `barra-ativo` no item ativo só serve para rolar a barra até ele
- **Fronteira:** muda a barra de Hoje e da B; não muda A, C e D (continuam desenhadas à mão, como nas rodadas 1 a 3), nem o corpo da página
- **Crítica:** o Booleano continua a 5 cliques na B. A B abre com 53 linhas (1.758 px), 5 a mais que antes, por causa do "Sobre esta seção" de cada grupo
- **Crítica:** a B ainda tem 51 páginas no 5º nível abaixo do grupo (Campos, Nós do Spaceflow, Assinadores). A regra de 4 níveis da D ainda não foi aplicada a ela
- **Crítica:** o botão de busca diz "Pesquisar…", porque o protótipo passa o idioma ao Nuxt UI. No site, que não passa, diz "Search…"
- **Ver:** https://pernalombr4.github.io/prototipos/menu-da-doc/ · local: `pnpm dev` → http://localhost:3000/menu-da-doc

## Rodada 5 · 2026-09-30
- **Pedido (literal):** "os titulos dos grandes agrupamentos do formato B do enspace no prototipo estao inconsistentes. um é "comece aqui", outro é "configuraçoes". um ta no imperativo, outro nao... tem que padronizar. Veja as regras de ux writing em /escrita pra analisar como melhoraria esses títulos agrupados."
- **Regra:** Membro, Configurações e Ajuda são rótulos do menu do ENSPACE e não se reescrevem. Os outros títulos seguem a forma deles: substantivo que nomeia uma área, com o nome que o produto ou a doc já usa (regra do ENSPACE: procurar o nome na interface e na documentação antes de inventar um). Nome de mais de 1 palavra segue a caixa do menu do produto ("Visão Geral", "Gestão de Membros")
- **Mudou:** "Comece aqui" (imperativo) vira "Primeiros Passos", o mesmo título da página inicial da doc em inglês ("Getting Started") e em espanhol ("Primeros Pasos")
- **Mudou:** "Antes de entrar" (locução de tempo: diz quando, não o quê) vira "Acesso", da página "Registro e Acesso", que já descreve criar conta, entrar e acessar workspaces
- **Mudou:** "Menu do perfil" (nome inventado pelo protótipo) vira "Painel do Usuário", o nome que a doc e o produto usam
- **Mudou:** "Em todas as telas" (locução de lugar) vira "Recursos", o nome que a doc já dá às funções gerais do workspace
- **Mudou:** o endereço dos 4 grupos acompanha o nome: `getting-started`, `access`, `user-panel` e `resources`
- **Fronteira:** muda o título de 4 grupos da B; não muda A, C, D nem Hoje. O bloco "Menu do perfil" do mapa da C fica como está
- **Descartado:** "Recursos Gerais". Motivo: a doc já chama essa área de "Recursos"; inventar outro nome contraria a regra do ENSPACE
- **Descartado:** "Entrada" para o grupo de acesso. Motivo: "Acesso" já existe na doc ("Registro e Acesso") e diz o que a pessoa vai fazer ali
- **Crítica:** "Acesso" repete a palavra do 1º item do grupo, "Registro e Acesso"
- **Crítica:** o índice de cada grupo se chama "Sobre esta seção", uma locução que foge do padrão de substantivo. Fica para decidir
- **Ver:** https://pernalombr4.github.io/prototipos/menu-da-doc/ · local: `pnpm dev` → http://localhost:3000/menu-da-doc

## Rodada 6 · 2026-09-30
- **Pedido (literal):** "e nao é estranho o inicio da doc ter "Boas-vindas" e outra doc chamada "seçoes de menu"?? nao deveria ser outro título nao? minha sugestao é que agrupe no inicio boas-vindas e conceitos. é o que faz sentido."
- **Mudou:** na B, o grupo Primeiros Passos passa a ter Boas-vindas e Conceitos. Conceitos sai de Referência
- **Mudou:** na B, "Seções de menu" deixa de ser página e vira a seção "Como a documentação se organiza", no fim de Boas-vindas. Os grupos da barra já são as seções do menu, e o conteúdo da página começa por "Como utilizar esta documentação", que é assunto de boas-vindas
- **Fronteira:** muda o grupo Primeiros Passos, o grupo Referência e a página Boas-vindas da B; não muda A, C, D nem Hoje. Na C e na D, "Seções de menu" continua sendo o "Mapa do menu"
- **Descartado:** manter "Seções de menu" como página com outro título, em Primeiros Passos ou em Referência. Motivo: na B, o assunto dela é a própria barra; como seção de Boas-vindas, quem chega lê isso primeiro, sem uma página a mais
- **Crítica:** o endereço de "Seções de menu" passa a levar a Boas-vindas, e entra na tabela de redirecionamento
- **Maquete:** a seção nova de Boas-vindas mostra só o título, como as outras
- **Ver:** https://pernalombr4.github.io/prototipos/menu-da-doc/ · local: `pnpm dev` → http://localhost:3000/menu-da-doc

## Rodada 7 · 2026-09-30
- **Pedido (literal):** "perceba que toda vez que tem niveis aninhados automaticamente o componente do nuxt deixa em negrito o titulo. isso ta estragando tudo visualmente. o componente em si permite desativar esse negrito? se sim, faça pr esse caminho. se nao, personalize e me conte como fez"
- **Causa:** o tema do `UContentNavigation` põe `font-semibold` no slot `trigger`, que é o botão de toda pasta, em qualquer nível
- **Mudou:** na B, a prop `ui` do componente recebe `trigger: 'cursor-pointer font-normal'`, e toda pasta fica com o peso das páginas (400)
- **Mudou:** o `ui` de cada título de grupo recebe `trigger: 'cursor-default font-semibold'`, e os 8 grupos continuam em seminegrito (600), como no nuxt.com. O `ui` do item vence o do componente, porque o Nuxt UI junta as classes nessa ordem
- **Fronteira:** muda o peso das pastas da B; não muda Hoje (cópia do site), A, C nem D
- **Crítica:** a página ativa continua com `font-medium` (500), a marca de ativo do tema
- **Ver:** https://pernalombr4.github.io/prototipos/menu-da-doc/ · local: `pnpm dev` → http://localhost:3000/menu-da-doc

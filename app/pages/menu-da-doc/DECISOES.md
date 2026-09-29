# Decisões: menu da documentação

## As 3 propostas

As 3 usam as mesmas 242 páginas. Muda onde cada página fica e como a barra se comporta.

| | A · Para leigo | B · Espelho do ENSPACE | C · Combinada |
|---|---|---|---|
| Primeiro nível | Pelo uso: Boas-vindas, Comece aqui, Membro, Configurações, Ajuda, Painel do Usuário, Workspace, Módulos, Ferramentas de IA, Limitações Conhecidas | Pelo lugar do produto, em títulos fixos: Comece aqui, Antes de entrar, Membro, Configurações, Ajuda, Menu do perfil, Em todas as telas, Referência | O da A, com "Mapa do menu" logo abaixo de Boas-vindas |
| Seções do menu do produto | Pastas que recolhem | Títulos fixos, como no ENSPACE, com os itens, a ordem e os ícones de lá | Pastas que recolhem, como na A, e o menu do ENSPACE desenhado na página "Mapa do menu" |
| Cliques até o Booleano | 6 | 5 | 6 pela barra; 5 pelo mapa |
| Linhas da barra ao abrir | 10 | 48 | 11 |
| Onde fica o que não está no menu do produto | Workspace (funções gerais), Módulos, Ferramentas de IA | Em títulos com o nome do lugar: Antes de entrar (entrada e workspaces), Menu do perfil, Em todas as telas (Recursos e Navegação), Referência | Como na A |

**O que muda nas 3:**

1. **A barra abre no ramo da página atual.** No site, isso é a prop `default-open` do `UContentNavigation`, que o `docs.vue` não passa hoje.
2. **A pasta abre a própria página índice.** A seta ao lado só abre e fecha. O índice deixa de aparecer como 1º filho com o mesmo nome da pasta.
3. **A pasta que só tem o índice aparece como link**, sem seta.
4. **O nome longo quebra linha** em vez de ser cortado.
5. **Nenhuma página solta.** Página que dividia nível com pasta vira pasta com `1.index.md` (a URL não muda). São 34 na A e na C e 31 na B. Pasta que não tinha índice ganha um (17 páginas novas na A e na C e 16 na B, marcadas "Página nova").
6. **"Opções" sai de Campos.** Seleção Única e Seleção Múltipla viram pastas irmãs, como o índice de Campos já lista. A página "Opções" vira seção do índice de Campos (fica fora das 3 árvores).
7. **Trilha de navegação** acima do título.
8. **"Este assunto também aparece em"**, com o caminho de cada porta no menu escolhido. As páginas repetidas continuam: são portas de telas diferentes.
9. **"Nesta seção"** na página índice: as páginas da pasta, 1 linha cada.

**Só na B:** os títulos de seção não recolhem, e o clique no título abre o índice da seção. As tarefas de Membro ficam na ordem e com os nomes do submenu do produto: "Agendadas" e "Rápidas".

**Só na C:** a página "Seções de menu" sai de "Comece aqui", sobe para a raiz, logo abaixo de Boas-vindas, e vira "Mapa do menu". A página mostra o menu lateral do ENSPACE (Membro, Configurações, Ajuda e Menu do perfil, com os submenus que o produto tem), e cada item abre a página dele. Boas-vindas ganha uma chamada para o mapa. É a combinação que o `PESQUISA.md` sugere: a ordem da A no primeiro nível e o espelho da B como página de índice.

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

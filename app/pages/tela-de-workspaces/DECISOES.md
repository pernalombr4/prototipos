# Decisões — Tela de entrada (Workspaces)

## A proposta em uma frase

A tela passa a **afirmar o que é** e a **ordenar por uso**, `Entrar` vira a ação primária,
`Criar workspace` desce para o rodapé com a consequência escrita — e o caminho de criação
começa perguntando a intenção, para devolver quem se enganou.

## Telas

| Rota | O que mostra |
|---|---|
| `/tela-de-workspaces` | Tudo: a tela de entrada, os cinco estados e a criação em camada |

Uma rota só, de propósito. No produto, escolher e criar acontecem na mesma tela — então no
protótipo também (rodada 2).

---

## As sete decisões, e por que cada uma

### 1. A tela ganha título e explicação

**"Escolha um workspace para entrar"** como `h1`, e abaixo: *"Workspace é o espaço da sua
empresa dentro do ENSPACE. Seu trabalho acontece dentro de um deles — esta tela só escolhe por
qual porta entrar."*

Hoje não existe `h1` nenhum (Briefing, trava #1). Sem rótulo, a pessoa projeta a intenção que
trouxe. A frase faz duas coisas de uma vez: define a palavra "workspace" e diz que esta tela
não executa nada, só escolhe.

### 2. Três exemplos do que se faz lá dentro

"Abrir e acompanhar chamados · Ver suas tarefas e prazos · Consultar dados e documentos".

É o que liga a tela ao que a empresa mandou a pessoa fazer. Quem veio abrir chamado lê
"abrir chamado" associado a **entrar**, não a criar.

### 3. "Continue de onde você parou" — a entrada de um clique

Um bloco destacado com o último workspace usado e um botão grande **"Entrar em Grupo Aurora"**,
com o nome dentro do rótulo.

É o atalho que resolve a esmagadora maioria das entradas, e é o que monday e Notion fazem
automaticamente (Pesquisa, padrão 1). Quando a pessoa tem um workspace só — o caso exato da
demanda — o bloco muda o rótulo para **"Seu workspace"** e a tela inteira vira uma porta só.

### 4. A lista deixa de ser grade de cards vazios

Vira lista em linhas, ordenada por uso recente, e cada linha diz algo: descrição **ou** número
de pessoas, mais "Você esteve aqui há 2 dias". `Sem descrição` desaparece.

Dezesseis cards grandes dizendo "Sem descrição" (trava #4) gastam a tela inteira sem informar.
Em linha, cabem mais, comparam-se melhor, e a mais provável fica em cima.

### 5. Convite pendente vira ação

Sai do card borrado e vira um aviso no topo: *"Rodrigo Petrone convidou você para Lumen
Contábil"*, com **Aceitar convite** e **Recusar**.

O que mais precisava de ação era o que menos parecia acionável (trava #6).

### 6. `Criar workspace` desce e passa a explicar a consequência

Vai do canto superior direito para o rodapé, depois de um separador, em botão `outline`, com o
texto: *"Criar um workspace abre um espaço **vazio**, com membros e configuração próprios.
**Não é aqui que se abre chamado** — para isso, entre no workspace da sua empresa."*

É a correção mais direta do erro relatado (trava #2) e o que os cinco de referência já fazem
(Pesquisa, padrão 2). A frase nomeia o engano em vez de torcer para que não aconteça.

### 7. A criação começa perguntando a intenção

`/criar` abre com **"O que você quer fazer?"** e duas escolhas: *"Abrir um chamado, pedir algo
ou enviar um documento"* ou *"Criar um espaço novo, vazio, para a minha equipe"*. Quem escolhe
a primeira é levado de volta com a explicação — e ainda pode insistir, se for mesmo o caso.

No formulário, um detector: se o Nome parecer assunto de chamado ("preciso", "solicito",
"acesso", "urgente", "férias"…), aparece o aviso *"Isso parece o assunto de um chamado, não o
nome de um espaço"*. E uma prévia mostra como o espaço vai aparecer na lista depois de criado.

**Nenhum dos oito produtos pesquisados faz isso** (Pesquisa, "o que nenhum deles faz"). Todos
apenas escondem o botão; se a pessoa achar, criam. Este é o pedaço original da proposta.

---

## A recomendação maior, que não cabe numa tela

**A melhor versão dessa tela é não existir.** monday, Notion e ClickUp levam direto ao último
espaço usado. Se o ENSPACE entrasse direto no último workspace — com o seletor virando um
*switcher* no topo —, a confusão relatada desapareceria por construção, porque a tela onde o
erro acontece deixaria de ser a porta de entrada.

Fica como recomendação de produto, não como protótipo: muda roteamento e sessão, não layout.
O protótipo entregue é a melhoria da tela **mantendo** a arquitetura atual.

---

## O que é maquete

Declarado conforme a regra 10. Nesta tela **não funciona de verdade**:

- **`Entrar`** — mostra um toast e não navega. Não existe "dentro do workspace" para ir.
- **Aceitar / Recusar convite** — muda a lista em memória; recarregar volta tudo.
- **`Criar workspace`** no fim do formulário — toast de sucesso, não cria nada.
- **Favoritar** — alterna e a aba Favoritos responde, mas some ao recarregar.
- **Barra superior** (ENSPACE, Suporte, avatar) — casca, só para dar contexto à tela.
- **Seletor de estados no rodapé** — andaime de protótipo, não é proposta de produto.

**Funciona de verdade** (é o que a proposta depende): busca, abas Todos/Favoritos/Recentes,
alternador card/lista, favoritar, ordenação por uso, a troca dos cinco estados, o desvio de
intenção dentro do modal, o preenchimento automático da referência, o detector de
nome-de-chamado, a prévia do card e todas as transições.

## Autocrítica

Rodada antes de entregar, e o que ficou de fora:

- **O texto explicativo é longo.** Três linhas no topo de uma tela que a pessoa vê todo dia
  viram ruído no quinto acesso. Uma versão futura deveria encolher depois da primeira semana —
  não implementei porque exigiria persistência, e protótipo aqui é 100% front-end.
- **"Não é aqui que se abre chamado" é uma negação.** Copy boa evita negar. Mantive porque o
  erro relatado é específico e caro, e nomear o engano funciona melhor que insinuá-lo. Vale
  testar a variante positiva: *"Para abrir chamado, entre no workspace da sua empresa."*
- **O detector de intenção erra.** Uma equipe chamada "Acesso e Identidade" dispara o aviso. É
  aviso, não bloqueio, e falso positivo custa uma linha lida — aceitei o custo.
- **Não testei com leitor de tela.** Contraste e foco seguem os tokens do Nuxt UI, mas a
  ordem de leitura do bloco "Continue de onde você parou" merece verificação.
- **Não implementei o estado "sem permissão"**, previsto na Fase 4. Não encontrei no develop
  uma tela de workspace sem permissão para usar de base, e inventar o comportamento seria
  desenhar regra de produto que não observei.

---

## Iterações

### Rodada 11 — 16/09/2026 · a estrela sai do hover

**Pedido:** *"faça com que as estrelinhas de favoritar apareçam nos cards de workspace por
padrão, não só com hover"*

A estrela só existia no hover quando o workspace não era favorito. Agora ela está sempre lá:
**amarela** quando é favorito, **cinza-fraca** quando não é, e amarela ao passar o mouse.

Vale a autocrítica: esconder ação no hover é o padrão que eu já tinha criticado na regra 24 —
afordância que só aparece depois que a pessoa passa por cima não ensina que existe. Quem nunca
usou favoritos não descobriria que dá para favoritar, e a aba **Favoritos** ficaria zerada para
sempre, que é exatamente o que acontece no produto hoje.

Fica só nos cards. Na visualização em lista a estrela continua sendo **indicador**, não botão,
porque lá a coluna de ações já está ocupada por Entrar.

### Rodada 10 — 16/09/2026 · revisão de texto

Rodada só de copy: levantei os 40 textos visíveis da tela, propus, ela validou item a item.

**A correção que puxou o resto: duas palavras para a mesma coisa.** A tela dizia *workspace* o
tempo todo; o construtor dizia *espaço* — "Como esse espaço se chama?", "Um espaço vazio",
"o ícone do espaço". Grave justamente aqui, porque **o trabalho desta tela é ensinar a palavra
"workspace"**: ensinar e, no passo seguinte, usar outra palavra desfaz o que a tela acabou de
fazer. Padronizado em *workspace* no fluxo inteiro.

A única sobrevivente é a frase de definição do topo — *"Workspace é o espaço da sua empresa no
ENSPACE"* —, onde "espaço" é a palavra comum que **explica** o termo, não um segundo nome
para ele.

**O que mais mudou:**

| Onde | De | Para |
|---|---|---|
| Topo | *"…acontece dentro de um deles. Esta tela só escolhe por qual porta entrar."* | *"É dentro de um deles que o seu trabalho acontece."* |
| Convite | Aceite para **poder** entrar | Aceite para entrar |
| Busca vazia | …peça acesso a quem administra **o workspace** | Confira o nome. Se ainda não achar, peça acesso a quem administra **o ENSPACE** |
| Nenhum workspace | …abra o link **de lá** | …abra o link **que veio nele** |
| Tooltip do Criar | **Abre** um espaço novo e vazio para a sua equipe | **Cria** um workspace vazio, só com você dentro |
| Modelo vazio | ou **siga** do zero | ou **comece** do zero |
| Prévia | Como vai aparecer | Como vai aparecer na sua lista |

Três dessas são consistência, não estilo: a busca vazia agora usa a mesma frase do estado
vazio logo abaixo; o "comece do zero" casa com o rótulo "Começar do zero" da opção acima; e o
tooltip usa o verbo do botão que ele explica.

**Reprovado:** trocar *"Não foi possível carregar seus workspaces"* por *"Seus workspaces não
carregaram"*. Fica como está.

**Em aberto:** "Ver em cards" mantém o anglicismo, por falta de termo de casa melhor. E o
`Full` no meio de `Proprietário / Membro / Leitor` virou achado no Briefing — vem do produto,
não do protótipo.

### Rodada 9 — 16/09/2026 · a identidade sai de baixo do "opcional"

**Pedido:** *"esse construtor aqui ter todos os outros campos escondidos pode ser ruim, não? pelo
menos o ícone que é importante pras pessoas. e saiba que o ícone nem sempre é ÍCONE mesmo. pode
ser uma imagem. é logo de fato. a empresa pode querer botar a imagem."*

**Fui conferir o que faltava ver.** O botão **Busca Avançada** do campo Ícone abre uma gaveta
com a biblioteca inteira, cada ícone com o **slug técnico em inglês** embaixo (`3d-cursor`,
`accessibility-alt`) e um botão de copiar. A busca é por esse slug: quem procura "balança" não
acha nada. E **não há envio de imagem em nenhum ponto do fluxo** — está no Briefing.

**As duas mudanças:**

1. **A identidade voltou para a superfície, ao lado do nome.** Um quadrado clicável à esquerda
   do campo, mostrando o logo ou o ícone atual, com um lápis no hover. É o mesmo par que
   aparece no card depois — nome e identidade lado a lado —, e resolve o erro que eu tinha
   cometido: enfiar em "opcional" uma decisão que as pessoas querem tomar. **Descrição e
   endereço continuam recolhidos**, porque esses sim são secundários de verdade.
2. **O campo passou a aceitar as duas naturezas.** O popover tem duas abas:
   - **Imagem** — área de arrastar e soltar para o **logo da empresa**, com prévia, trocar e
     remover. É a lacuna que o produto não cobre hoje;
   - **Ícone** — a biblioteca, buscável **por nome e categoria em português** ("balança",
     "jurídico"), não por slug em inglês.

   O ícone sugerido pelo nome continua valendo como padrão: quem não decidir nada sai com algo
   coerente.

**Sobre o nome do campo:** a tela chama de "Ícone", e a minha regra é usar o nome que está na
tela. Mas aqui o nome está errado sobre a própria coisa — é a identidade do espaço, e a empresa
quer o logo dela. O protótipo propõe tratar como **logo ou ícone** e deixa a divergência
registrada, em vez de herdar o rótulo por inércia.

**O que é maquete:** a imagem enviada vive só nesta aba, por `object URL`. Não sobe para lugar
nenhum — protótipo é 100% front-end.

### Rodada 8 — 16/09/2026 · o card volta ao tamanho da rodada 6

**Pedido:** *"agora ta pequeno demais. pode voltar os cards pra como eram antes"*

Voltou. O card da rodada 6 está de volta inteiro: ícone no topo à esquerda, selo de papel e
estrela à direita, título, descrição, e o rodapé ancorado com `62 pessoas · há 2 dias` de um
lado e `Entrar →` do outro. Grade, espaçamento e skeleton voltaram junto.

**O que mantive da rodada 7:** a **cor de identidade por workspace**. Ela não tem nada a ver com
tamanho — é cor no fundo do ícone — e a reclamação era de dimensão. Se preferir sem, é um
comando.

**O registro que importa:** as rodadas 6, 7 e 8 desenham a faixa. ~150 px foi *"muito grande
com pouca informação"*; ~72 px foi *"pequeno demais"*; o acordo ficou no primeiro formato, com a
meta enxugada numa linha e a cor carregando o sinal que faltava. Não vale recomprimir — está na
regra 26, com o resultado do teste.

### Rodada 7 — 16/09/2026 · densidade (revertida na 8)

**Pedido:** *"cards continuam ruins. muito grande com pouca informação"*

Estava certo: ~150 px de altura para quatro informações, e a grade mostrava dois ou três
workspaces por tela. Para quem tem 18, isso é rolagem pura.

**O card virou uma linha, não um quadro.** Ícone à esquerda, conteúdo à direita, três linhas:
nome, descrição (uma linha, truncada) e uma meta única — `62 pessoas · há 2 dias · Full`.
Altura caiu de ~150 px para ~72 px. Onde cabiam dois cards agora cabem seis.

O que sumiu, e por quê:

- **o selo de papel virou texto na meta.** Badge é peso visual caro para um metadado que se lê
  de passagem;
- **o rótulo "Entrar" saiu.** Com o card inteiro clicável, a afordância virou **uma seta que
  entra da esquerda no hover** — custa zero altura e diz a mesma coisa. No clique ela vira
  spinner;
- **a altura mínima e o rodapé ancorado saíram** — eram da rodada 6, e alinhavam a grade ao
  preço de um buraco em todo card sem descrição. Agora cada card tem a altura do próprio
  conteúdo (`items-start`): a grade fica levemente irregular e não sobra espaço morto. Num card
  compacto, a irregularidade custa menos que o buraco.

**E entrou informação que não custa espaço: cor de identidade por workspace.** O fundo do ícone
recebe uma cor derivada da referência, dentro da paleta da marca — fuchsia, cyan, purple, teal
e space. Deliberadamente **fora das cores semânticas**: nenhuma delas significa erro, sucesso ou
alerta. É o que faz reconhecer o espaço de relance, sem ler o nome — o que Slack, Linear e
Notion fazem com o mesmo objetivo. Era a proposta 4 que tinha ficado para depois; entrou agora
porque responde direto ao "pouca informação".

O skeleton de carregamento encolheu junto, senão ele prometeria um card que não existe mais.

**Ainda na fila:** sinal visual de recência na borda dos usados nos últimos dias.

### Rodada 6 — 16/09/2026 · o card vira um alvo só

**Pergunta:** *"é interessante o card do workspace ter o botão de entrar já que ele é totalmente
clicável? e tem melhoria visual a propor nos formatos dos cards?"*

**Primeiro, um defeito meu:** o card **não era** clicável — só o botão. Mas levantava, mudava a
borda e acendia o "Entrar" no hover. Prometia clique e não entregava, o que é pior que qualquer
uma das duas opções.

**A decisão: o card inteiro vira o alvo, e o botão vira afordância.**

Não era o botão que sobrava — era ter **dois alvos visualmente diferentes para a mesma ação**.
A saída foi fundir:

- o título traz um `<a href="/w/{reference}">` que se estica por cima do card inteiro
  (`after:absolute after:inset-0`). Isso mantém HTML válido — nada de botão dentro de link —,
  deixa **um** item na árvore de acessibilidade, dá foco por teclado com anel visível no card
  todo, e faz clique do meio e botão direito funcionarem. No produto o `href` leva ao
  workspace; aqui o clique é interceptado;
- o "Entrar" deixou de ser `<button>` e virou **`Entrar →`**, rótulo com seta que anda no hover
  e vira `Entrando…` com spinner ao clicar;
- a estrela de favorito continua botão de verdade, acima do link com `z-10`;
- **o card de convite não virou link.** Ele tem duas ações de peso igual — Aceitar e Recusar —
  e nenhum destino óbvio. Card clicável só funciona quando existe **uma** ação principal.

**As correções visuais que vieram junto:**

1. **O papel subiu.** O selo *Proprietário / Full* saiu do rodapé, onde competia com a ação, e
   foi para o topo com a estrela. Papel é metadado, não ação — e o rodapé ficou inteiro para a
   afordância.
2. **A grade se alinhou.** Área de título com altura mínima e rodapé ancorado (`mt-auto`): os
   cards da mesma linha terminam na mesma altura, mesmo com nome de três linhas ao lado de nome
   de uma.
3. **O ritmo mudou.** Nome com mais peso, descrição em duas linhas no máximo, e a recência
   desceu para a linha de meta junto do número de pessoas: `62 pessoas · há 2 dias`.
4. **"Sem descrição" sumiu.** Era o que eu critiquei no produto e tinha reaparecido no meu card.
   Sem descrição, a linha simplesmente não existe — o espaço vazio conta a mesma coisa sem
   gastar texto, e a altura mínima segura o alinhamento.

**Ficou para uma próxima rodada**, porque são proposta de produto e não correção: **cor de
identidade por workspace** (derivada do nome, dentro dos tokens) para reconhecer o espaço de
relance, e **sinal visual de recência** na borda dos usados nos últimos dias.

### Rodada 5 — 16/09/2026 · SDK do ENSPACE

**Pedido:** usar o SDK do ENSPACE para os protótipos saírem de acordo com a estrutura que já
existe.

**O que mudou nesta tela:**

1. **O mock passou a ser tipado pelo schema real.** `mocks.ts` importa `Workspace` do
   `@be-enlighten/enspace-sdk-schemas` e monta em cima dele. Os campos viraram os de verdade —
   `name`, `reference`, `status`, `description`, `icon`, `members_count` —, e `id` virou
   número, como na API. O que o protótipo acrescenta (`papel`, `favorito`, `ultimoAcessoMin`,
   convite) está marcado com comentário dizendo de onde vem.
2. **A visualização em lista virou `EnTable`**, a listagem padrão do produto, em modo dumb:
   recebe `columns` e `rows`, e a navegação sai por `@row-click`. Os slots `#cell-{key}`
   mantêm o ícone, a estrela de favorito, o selo de convite e os botões. O card continua sendo
   o padrão — o alternador segue valendo.
3. **A raiz virou `<EnApp locale="pt-BR">`**, que abraça o `UApp` do Nuxt UI por dentro e provê
   locale e mensagens para os componentes `En*`.

**Descoberta que vale registrar:** o schema de `Workspace` tem `description`, `icon` e
`members_count` — ou seja, o card mudo cheio de "Sem descrição" na tela de hoje **não é falta
de campo no modelo**. O dado cabe; o produto só não pede nem mostra.

### Rodada 4 — 16/09/2026

**Pedido:** *"nao precisamos dessa parte aqui"* (a lista "Abrir e acompanhar chamados · Ver
suas tarefas e prazos · Consultar dados e documentos") *"e o convite, alem de aparecer no topo,
deve aparecer no card também como aparece hoje. no topo seria só um atalho"*

**O que mudou:**

1. **A lista de exemplos saiu.** O título e a frase abaixo dele já dizem que o trabalho
   acontece dentro do workspace; os três exemplos repetiam a mesma ideia e empurravam a lista
   para baixo.
2. **O convite passou a existir nos dois lugares.** O card volta para a grade — com moldura
   tracejada, ícone de envelope, o selo *Convite pendente*, quem convidou e os botões
   **Aceitar** e **Recusar** no lugar de *Entrar*. O aviso do topo continua, agora no papel que
   é dele: **atalho**, não substituto. Vale para as duas visualizações, card e lista, e o
   contador de "Todos" passou a incluí-lo.

**O que aprendi, e virou regra:** aviso em destaque **soma** ao lugar natural do item, não o
substitui — regra 20. Eu tinha tirado o card da grade ao promover o convite para o topo, e com
isso quem procurasse o convite onde ele sempre esteve não o encontrava mais.

### Rodada 3 — 16/09/2026

**Pedido:** *"na hora de criar workspace nao tem que ter opçao entre abrir chamado e ele. isso
nao tem nada a ver. a jornada só tem que ser suficientemente boa. ja viu como é a jornada real
de criar workspace? ja testou? (…) veja como é o form por completo antes de finalizar. e
replique ali de modo intuitivo e interessante, com boa hierarquia de decisoes e que seja ainda
BONITO"*

**Antes de mexer:** percorri a criação inteira no develop, sem finalizar. O que achei está no
Briefing, seção "A jornada real de criar um workspace". O resumo: três campos obrigatórios,
sendo um deles decoração escolhida numa árvore de categorias e exibida como `carbon:scales`; e
um segundo passo que abre ~4 s em branco para, no Brasil, responder "Não há dados".

**O que mudou:**

1. **A pergunta de intenção saiu.** Você tem razão: interceptar chamado no meio da criação
   misturava dois assuntos. A criação agora é só uma boa criação. O que resolve a confusão é a
   tela de entrada — que já diz o que é, onde o trabalho acontece e deixa `Entrar` como a ação
   de maior peso.
2. **Uma decisão por vez, na ordem em que a pessoa decide.**
   **1 de 2 — o nome:** campo grande, foco automático, e o endereço aparecendo embaixo como
   consequência (`enspace.io/juridico-aurora`) em vez de um campo obrigatório chamado
   "Referência".
   **2 de 2 — de onde partir:** "Começar do zero" como opção de primeira classe (não como
   ausência de escolha), com os modelos ao lado.
3. **Ícone deixou de ser obrigatório e deixou de ser uma árvore.** Ele é *sugerido pelo nome*
   — digitar "Jurídico Aurora" já traz a balança — e fica dentro de "Ícone, descrição e
   endereço — opcional", recolhido. Aberto, são seis ícones em destaque e um "Ver todos" com
   busca por nome e categoria. Em nenhum momento aparece `carbon:scales`.
4. **Prévia ao vivo, à direita.** O card muda enquanto se digita: nome, ícone, descrição. Ao
   escolher um modelo, aparece **"Já vem com"** listando o que ele traz — a consequência fica
   visível **antes** de confirmar, não depois.
5. **O vazio passou a explicar.** Em vez de "Não há dados": *"Nenhum modelo para essa
   localidade — escolha outra acima, ou siga do zero, você não perde nada."* E a Localidade
   virou chips de múltipla escolha, com o que está marcado à vista.
6. **Movimento.** Barra de progresso que avança, transição lateral entre os passos, o ícone da
   prévia girando ao trocar, "Já vem com" entrando em cascata, `loading` no botão ao criar.

**Também nesta rodada:** briefing, pesquisa e decisões entraram **dentro do site**, no rodapé
de andaime, em "Por trás" → *O problema · As referências · As decisões*. O conteúdo vem dos
próprios `.md` desta pasta, importados como texto — fonte única, sem cópia paralela.

**O que aprendi, e virou regra:** *percorrer o fluxo inteiro antes de redesenhá-lo*. Eu tinha
visto só o passo 1 e redesenhei em cima disso — regra 18 da Parte 6.

### Rodada 2 — 16/09/2026

**Pedido:** *"nao ta legal ter que clicar em 2 botoes diferentes no mesmo card (…) isso tem que
ser jornada unica (…) o botao de atalho pra criar um novo tem que continuar no topo (…) seu
prototipo ta mal elaborado. sem usar animaçoes nem nada (…) voce mudou a aparencia de cards
pra lista. nao pode mudar. se for pra ser lista, daí tem que adicionar botao pra alternar."*

**O que mudou:**

1. **Uma porta só.** A rota `/criar` foi apagada. A criação virou **camada sobre a própria
   tela**, com os mesmos três passos — intenção → desvio → formulário. No produto isso é um
   modal sobre a lista; agora o protótipo também é. E o índice da raiz passou a ter um card
   com **um** link por protótipo.
2. **O atalho de criar voltou para o topo.** Fica no canto superior direito, onde sempre
   esteve. O que mudou é o **peso**, não o endereço: `outline` neutro em vez de sólido, então
   o destaque visual da tela continua sendo "Entrar em …". Ganhou tooltip — *"Abre um espaço
   vazio. Não é aqui que se abre chamado."* A desambiguação forte segue no modal.
3. **Card voltou a ser o padrão**, com **alternador card / lista** ao lado da busca. A lista
   continua existindo porque é melhor para comparar muitos workspaces — mas como escolha de
   quem usa, não como troca imposta por mim.
4. **Movimento.** Entrada dos cards em cascata, hover que levanta o card e acende ícone e
   botão, `TransitionGroup` ao filtrar, buscar e trocar de visualização, `loading` no botão
   que foi clicado, transição entre os passos do modal, e o convite saindo ao ser aceito.
   Tudo sob `prefers-reduced-motion`.
5. **Favoritar virou ação de verdade** — a estrela aparece no hover do card e alterna, e a aba
   Favoritos responde na hora. Na rodada 1 era só indicador.

**O que aprendi, e virou regra:** as quatro correções entraram como regras 14 a 17 da Parte 6
da spec e estão repetidas no `CLAUDE.md`. As duas que mais doem: *não trocar a forma que o
produto já usa sem oferecer a volta*, e *ação do topo continua no topo — rebaixa-se o peso,
nunca o endereço*.

### Rodada 1 — 16/09/2026

**Pedido:** a demanda original (Briefing, seção 1).
**Entregue:** as duas telas, os cinco estados, os sete pontos acima.
**Descartado:** reproduzir a tela atual lado a lado como comparativo — a evidência do estado
atual já está no Briefing, e manter duas versões vivas dobra o custo de cada iteração.

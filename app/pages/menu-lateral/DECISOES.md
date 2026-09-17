# Decisões — Menu lateral em dois níveis

## A proposta em uma frase

**A barra continua com os mesmos endereços, mas deixa de empilhar contextos: a
administração abre no lugar do menu em vez de morar dentro dele, e a lista de categorias
ganha teto com uma porta para o resto.**

O ganho que importa não é só o menu ficar menor: é ele **parar de crescer**. Hoje cada
categoria cadastrada soma uma linha, para sempre. Na proposta, 8 e 40 categorias dão
exatamente o mesmo menu.

| | Hoje | Proposta |
|---|---|---|
| Menu nativo, nenhuma categoria cadastrada | **31 linhas** | 9 linhas e um cartão |
| Com 8 categorias | 39 | **17** |
| Com 40 categorias | 71 | **17** |
| Níveis | 3 | **2** |
| Linhas de administração no menu de trabalho | 19 | **1** (a porta) |
| Teto da lista de categorias | nenhum | **5 mais os favoritos** |

As contas de "hoje" partem do **menu nativo**: 28 itens mais 3 rótulos de grupo, presentes em
qualquer workspace. Cada categoria com menu automático soma uma linha, então 8 dão 39 e 40 dão
71. As da proposta são contadas na tela: 4 destinos, Favoritos com cabeçalho e 3, Categorias
com cabeçalho, 5 e o "ver todas", mais 2 cabeçalhos de seção do workspace recolhidos, mais
Configurações e Ajuda no rodapé. No workspace vazio a seção de categorias vira um cartão que
ensina, e o menu fica em 9 linhas.

---

## As decisões, uma a uma

### 1. Configurações vira painel, não vira ramo

**O que muda:** clicar em Configurações **troca** o conteúdo da barra pela navegação de
administração, com a volta sempre visível no topo. Os 19 itens de hoje saem do meio do
trabalho e viram 8 grupos de 2 níveis, com um grupo aberto por vez.

**Por que:** é o padrão 1 da pesquisa, e os oito produtos fazem assim. A mecânica é a do
ClickUp (`Home Sidebar` e `Spaces Sidebar` se substituem) e a do Linear, que reescreveu as
configurações em páginas próprias divididas em `Account`, `Features`, `Administration` e
`Your teams`.

**Como isso não quebra a regra 16 e a regra 20:** o item **Configurações continua no menu
lateral**. O endereço não mudou; o que saiu de lá foram os filhos. Quem sempre clicou em
Configurações no menu continua clicando em Configurações no menu. A regra 20 diz que
destaque soma em vez de substituir, e é o que acontece: nada foi promovido para outro
lugar, só deixou de ser despejado antes da hora.

### 2. A seção de categorias ganha teto de cinco, mais os favoritos

**O que muda:** a barra mostra as **5 mais usadas** que não são favoritas, mais os
favoritos acima, mais um `Ver todas as N categorias` que abre a coleção inteira com busca.

**Por que:** é o padrão 3. O Attio mostra seis listas por padrão e tem um `All objects` no
fim da seção de registros; aqui são cinco, porque acima da seção ainda existem os favoritos,
que no Attio ficam em outro lugar. Notion faz com `More`, Airtable com `Starred` mais busca,
Pipefy manda direto para a busca quando "your company has several pipes".

**O que isso responde na demanda:** "se eu tiver muitas categorias entao... piorou". Com o
teto, 8 e 40 categorias dão exatamente o mesmo tamanho de menu. O estado **40 categorias**
do andaime existe para provar isso.

### 3. Favoritos, pessoal, nascendo do uso

**O que muda:** estrela em cada categoria, na barra e na camada de todas. A seção Favoritos
**só existe depois do primeiro favorito**.

**Por que:** sete dos oito produtos pesquisados têm favorito pessoal, e Notion e ClickUp
escondem a seção enquanto ela está vazia. É o que permite a cada pessoa ter o seu menu curto
sem que o administrador precise decidir por todo mundo.

### 4. Ordenação da seção que cresce

**O que muda:** engrenagem no hover do rótulo `Categorias`, com `Mais usadas`,
`Ordem alfabética` e `Criadas recentemente`.

**Por que:** copiado do comportamento do Attio, que oferece `Most relevant`,
`Recently added`, `Alphabetical` e `Custom` no hover do rótulo da seção. `Mais usadas` é o
padrão porque é o que faz o recorte de cinco acertar sem ninguém configurar nada.

### 5. Formulário vira aba, não terceiro nível

**O que muda:** `Categorias › <categoria> › Todos` deixa de existir. Ao abrir uma categoria, os
formulários aparecem como abas no topo da tela, ao lado de `Todos`.

**Por que:** é o padrão 2. Airtable organiza vistas em seções **dentro** da base, Twenty
escolhe a vista dentro da página do objeto, Linear e Attio idem. Nível de navegação é para
lugar, não para recorte do mesmo lugar.

**Autorização:** a demanda pede explicitamente ("menu dentro de sistema (abas) podem virar
menus soltos"), e aqui vale o inverso: menu solto virando aba.

### 6. Tarefas perde os filhos

**O que muda:** `Rápidas` e `Agendadas` saem da barra e viram abas dentro de Tarefas.

**Por que:** são dois recortes da mesma coisa, o mesmo caso do item 5. Linear faz assim em
`My Issues`, Asana em `My tasks`.

### 7. Seção personalizada e seção nativa usam a mesma gramática

**O que muda:** as seções que o administrador cria em `Interface › Menus` param de ser um
apêndice no fim do menu nativo e passam a ser seções iguais às nativas, com o mesmo
comportamento de recolher, contar e ordenar.

**Por que:** é o item 1 do "o que nenhum deles faz" da pesquisa. O ENSPACE já tem a peça,
só não a usa no próprio menu. A seção do workspace não ganha marca visual nenhuma: ver a
revisão de design mais abaixo.

### 8. O contraste sai daqui já passando

**O que muda:** o rótulo do item usa `text-default`, não `text-muted`.

**Por que:** a fricção **S3-P2** mediu o menu de hoje em **4,36:1**, abaixo do mínimo AA de
4,5:1, em 24 elementos. Se o menu vai ser redesenhado, não faz sentido carregar a reprovação
para dentro do desenho novo.

### 9. A fricção S1-F3 morre por separação, não por renomeação

A pesquisa de UX propôs renomear: "Meus cadastros" para os dados e "Definir cadastros" para
a estrutura. **Divergi, e registro aqui.**

Na proposta os dois "Categorias" **nunca aparecem juntos**: um vive no painel de trabalho,
o outro no painel de configurações, e os dois painéis se substituem. Resolver por separação
custa zero em aprendizado (ninguém precisa reaprender um nome) e é o que Notion, Attio e
Twenty fazem.

**Se a Mikaela preferir renomear assim mesmo**, o lugar é o painel de configurações, onde
"Categorias" poderia virar "Modelagem de categorias". Fica como pergunta em aberto.

---

## O de-para, item a item

Os 28 itens do menu nativo de hoje, onde cada um foi parar. Nenhum sumiu.

### Membro

| Hoje | Proposta |
|---|---|
| Início | Início, destino solto, mesma posição |
| Spaceflows | Spaceflows, destino solto, mesma posição |
| Categorias | Seção `Categorias`, com teto de 5 mais favoritos |
| Categorias › *cada categoria* | Item nível 2 da seção, ou da seção `Favoritos` |
| Categorias › categoria › Todos | **Aba `Todos`** na tela da categoria |
| Categorias › categoria › *formulário* | **Aba por formulário** na tela da categoria |
| Tarefas | Tarefas, destino solto |
| Tarefas › Agendadas | **Aba** dentro de Tarefas |
| Tarefas › Rápidas | **Aba** dentro de Tarefas |
| Agenda | Agenda, destino solto |
| *seção personalizada* | Seção igual às nativas, sem marca visual |

### Configurações

Todas passam a viver no painel de configurações. Grupo novo entre parênteses.

| Hoje | Proposta |
|---|---|
| Visão Geral | Workspace › Visão geral |
| Sistema (aba Informações Básicas) | Workspace › Informações básicas |
| Sistema (aba Calendário) | Workspace › Calendário |
| Sistema (aba Notificações) | Workspace › Notificações |
| Sistema (aba Dicionários) | Workspace › Dicionários |
| Sistema (aba Cobrança) | Workspace › Cobrança |
| Estrutura › Categorias | Estrutura de dados › Categorias |
| Estrutura › Listas | Estrutura de dados › Listas |
| Estrutura › Spaceflow | Estrutura de dados › Spaceflows |
| Gestão de Membros (aba Membros) | Pessoas e acesso › Membros |
| Gestão de Membros (aba Cargos) | Pessoas e acesso › Cargos e permissões |
| Gestão de Membros (aba Grupos) | Pessoas e acesso › Grupos |
| Interface › Menus | Interface › Menus |
| Interface › Telas | Interface › Telas |
| Interface › Casos de Uso | Interface › Casos de uso |
| E-mails › Caixas de E-mail | E-mails › Caixas de e-mail |
| E-mails › Modelos de E-mail | E-mails › Modelos de e-mail |
| E-mails › E-mails Enviados | E-mails › E-mails enviados |
| Integrações | Conexões › Integrações |
| Credenciais | Conexões › Credenciais |
| Agentes de IA | Inteligência artificial › Agentes de IA |
| Logs (aba Audit) | Auditoria › Logs de auditoria |
| Logs (aba Request) | Auditoria › Logs de requisição |

**Dezesseis abas viraram item de menu** (as 5 de Sistema, as 3 de Gestão de Membros e as 2 de
Logs entre elas), que é a troca que a demanda autorizou. Elas cabem porque saíram do menu de
trabalho: no painel de configurações, com um grupo aberto por vez, o painel mostra no máximo
14 linhas.

### Ajuda

| Hoje | Proposta (rodada 9) |
|---|---|
| Releases | Novidades da plataforma, dentro do ícone de ajuda |
| Documentação | Documentação, dentro do ícone de ajuda |
| (não existe) | Suporte, dentro do ícone de ajuda |
| Falar com o BENI | **Chat de IA**, menu de primeiro nível |

O grupo `Ajuda` virou **um ícone** no canto de baixo da barra, com o menu abrindo ao passar o
mouse. Notion, Stripe, Linear e Intercom fazem assim. É a única redução de endereço da
proposta, e vale registrar como divergência da regra 16: os destinos continuam alcançáveis em
um clique, mas deixaram de ter linha própria no corpo do menu.

O BENI foi no sentido contrário: era o primeiro item desta lista e virou destino nativo, com
o nome `Chat de IA`. Ferramenta de trabalho diário não mora no balcão de suporte.

### Auditoria, desde a rodada 10

| Hoje | Proposta |
|---|---|
| Configurações > Auditoria > Logs de auditoria | **Auditoria** > Logs de auditoria |
| Configurações > Auditoria > Logs de requisição | **Auditoria** > Logs de requisição |

Menu nativo de primeiro nível, fora das configurações. É a única parte da administração de
hoje que a proposta tira de lá em vez de arrumar lá dentro, e a razão é que ela não é
administração: é consulta.

### E a Base de Conhecimento

A fricção **S2-F1** diz que ela "não aparece em lugar nenhum por padrão". O protótipo a
mostra dentro da seção `Conhecimento`, que é uma seção de workspace, com a marca de tela
nativa. **Isso não resolve o S2-F1**: ela continua dependendo de alguém montar a seção. A
proposta de tornar nativa-visível-por-padrão é do tema
[base-de-conhecimento](../../../../enspace-ux-research/temas/base-de-conhecimento/) e não é
desta rodada (regra 19: não resolver na tela B o problema da tela A).

---

## O que funciona de verdade

Roda sobre o array em memória, no navegador. Recarregar a página volta tudo ao começo.

- recolher e expandir cada seção, nos dois painéis;
- **favoritar e desafavoritar**, com a categoria mudando de seção na hora e o toast dizendo
  o que aconteceu;
- **a camada `Ver todas`**, com busca que filtra por nome e por descrição, estado vazio de
  busca, e favoritar de dentro dela;
- **a ordenação** da seção Categorias, nas três opções;
- **a troca de painel** trabalho e configurações, com transição e volta;
- **a busca do painel de configurações**, que filtra os 23 itens e abre sozinha os grupos
  com resultado;
- **a paleta `Ctrl K`**, buscando em categorias, destinos e configurações, e navegando de
  verdade para o que for escolhido;
- **as abas de formulário** da tela da categoria, trocando a tabela;
- **o botão `+`**, com as quatro opções de criação;
- **o alternador de modelo** entre barra única e trilha de ícones, com as áreas navegáveis;
- **o filtro do menu**, que procura em todas as categorias e não só no recorte, e o filtro
  do painel de configurações;
- **o editor de menus**: reordenar, reagrupar, trocar o tipo da tela e as quatro recusas com
  o motivo;
- **os dois formulários de criação**, com o campo de lugar que só existe no modelo de trilha,
  a prévia que muda junto e o escopo por grupo de membros;
- **a seção criada aparecendo na barra ao vivo**, nos dois modelos;
- **arrastar para reordenar**, na barra e no editor, com a marca de onde vai cair, a recusa
  com o motivo preso na linha, e o caminho de teclado com Alt e as setas;
- **salvar e descartar**, com a barra de "Menu alterado" e nenhuma gravação antes do clique;
- **a ordenação `Personalizada` das categorias**, que liga sozinha ao arrastar e parte da
  ordem que estava na tela;
- os seis estados do andaime, incluindo vazio, carregando, erro e sem permissão.

## O que é maquete

Declarado, conforme a regra 10:

- **o miolo da direita**, fora das abas da categoria. Os números, as linhas e o esqueleto são
  ilustrativos: o que está sendo proposto é a navegação da esquerda (regra 19);
- **as quatro opções do `+`** abrem um toast dizendo qual formulário abririam. O menu é real,
  o formulário é maquete. O mesmo vale para **`Ajuda`**;
- **o trocador de workspace** não troca nada. A tela de escolha de workspace tem protótipo
  próprio, em [tela-de-workspaces](../tela-de-workspaces/);
- **`Configurar categoria`** leva para Estrutura › Categorias, mas não abre a categoria
  específica lá dentro;
- **a tabela de itens** é fictícia e não ordena nem pagina;
- **a barra some abaixo de 768 px** e a tela mostra só o aviso. O menu em telefone é outro
  desenho e não estava na demanda.

## O que a revisão achou, e o que foi corrigido

Rodei `design:accessibility-review` e `design:design-critique` sobre o protótipo já
montado, medindo no navegador.

### Contraste, medido no protótipo

O menu de hoje reprova em 4,36:1 (fricção **S3-P2**). A auditoria do protótipo achou uma
reprovação nova, minha:

| | Antes da correção | Depois |
|---|---|---|
| Item ativo, tema claro | **3,39:1** ❌ | 8,39:1 ✅ |
| Pior caso, tema claro | 3,39:1 | **8,39:1** ✅ |
| Pior caso, tema escuro | 6,65:1 | **7,96:1** ✅ |

A causa: o item ativo usava a cor de marca no texto (`text-primary`), que em 14px sobre
fundo claro dá 3,39:1. **Corrigido:** o estado ativo passou a ser dito por fundo, peso da
fonte, cor do ícone e `aria-current`, nunca por cor de texto. O mesmo valia para o
`Ver todas as N categorias`, que também era texto na cor de marca.

O critério é WCAG 1.4.3. Vale registrar que o token de cor vem do `en-docs` e não foi
tocado: a correção foi deixar de usar cor de marca como texto pequeno.

### O que mais entrou

- **o `✦` das seções do workspace saiu.** A primeira versão marcava as seções criadas pelo
  administrador com um sparkle. Num produto que tem o BENI, sparkle lê como "IA". A seção
  não precisa de marca: quem a montou sabe que é sua;
- **nome longo agora diz o nome inteiro.** "Solicitações de compra e reembolso" corta na
  largura da barra nos três idiomas. Ganhou `title`, senão o nome completo não existe em
  lugar nenhum da tela;
- **a estrela aparece no `focus-visible`, não só no hover**, senão quem navega por teclado
  não sabe que a ação existe;
- **estrela é botão irmão da linha, não filho.** Botão dentro de botão é HTML inválido e o
  de dentro some para o teclado;
- **`aria-pressed` na estrela, `aria-current="page"` no item ativo e `aria-expanded` no
  cabeçalho da seção**, para o leitor de tela dizer o que está fixado, onde a pessoa está e
  o que está aberto;
- **a linha de água do painel de comparação ganhou texto**, não só o tracejado: cor e forma
  sozinhas não comunicam.

### O que não corrigi, e por quê

- **o `Ver todas as N categorias` aparece mesmo quando todas já estão na barra** (caso das 8
  categorias). É redundante ali, e foi decisão consciente: ele é a porta do catálogo, onde
  se fixa e se desafixa, não uma válvula de estouro. Porta que aparece e some conforme o
  volume é pior que porta redundante. É o que o Attio faz com `All objects`;
- **as seções do workspace nascem recolhidas.** Um administrador que montou "Comercial"
  provavelmente quer ela aberta. Resolver isso pede um campo novo em `Interface > Menus`
  ("começa aberta"), que é invenção de superfície, então virou pergunta em aberto;
- **oito grupos em Configurações** é bastante. Testei seis, juntando E-mails em Conexões e
  IA em Estrutura, e ficou pior: "Caixas de e-mail" dentro de "Conexões" não é onde ninguém
  procura. Oito grupos com um aberto por vez mostram 11 linhas, contra as 19 de hoje.

### Medição do protótipo, no navegador

Com a janela em 1920 × 855, no estado de 40 categorias:

| | Valor |
|---|---|
| Altura do menu de trabalho | **571 px** |
| Altura disponível no protótipo | 571 px, sem rolagem |
| Altura do painel de configurações | 11 linhas, sem rolagem |
| Diferença entre 8 e 40 categorias | **nenhuma** |

Para comparar com os 1208 px medidos no develop: o menu proposto ocupa **menos da metade**,
e não cresce com o número de categorias.

---

## Perguntas em aberto

Precisam de resposta antes da rodada 2.

1. **Quantas categorias existem de verdade no maior workspace?** A regra 34 manda desenhar
   para o volume real, não para o do mock. O workspace de exploração do develop tem **uma**,
   e a spec proíbe criar volume por API sem autorização, então **modelei 40**. Se o teto real
   for 150, a camada `Ver todas` precisa de agrupamento e de virtualização, e a seção talvez
   precise de um segundo recorte. Se for 15, dá para simplificar.
   **Posso encher o `teste-ux` por API para medir de verdade?**

2. **O teto de seis é bom?** É o número do Attio. Pode virar preferência da pessoa, como no
   Notion, que deixa escolher entre 5 e todos. Vale a configuração ou o número fixo resolve?

3. **Renomear o "Categorias" da administração?** Ver a decisão 9. A separação já resolve o
   S1-F3; renomear resolveria mais, ao custo de mudar um rótulo que as pessoas já conhecem.

4. **A Ajuda pode mesmo virar um item só?** É a única redução de endereço da proposta.

6. **Os dashboards novos são uma tela cada, ou lista que o usuário cria?** Se forem lista, o
   problema das categorias se repete e eles precisam da mesma mecânica: favoritos, teto e
   "ver todas". O protótipo já está desenhado para isso, mas o número muda o desenho da
   seção (regra 34).

8. **Escopo por item faz sentido?** Hoje o produto escopa a seção. O formulário do item
   oferece "Restringir ainda mais neste item" como proposta, e isso é superfície nova: se
   não for para existir, sai em uma linha.

10. ~~A lista de categorias devia ganhar ordenação `Personalizada`?~~ **Feito na rodada 6.**

11. **A ordem personalizada é por pessoa ou por workspace?** No protótipo é por pessoa, como
    o favorito. Se o administrador puder fixar uma ordem para todos, aparece a pergunta de
    quem ganha quando os dois ordenam.

7. **A seção `Análise` deve nascer aberta ou recolhida?** Recolhida custa uma linha e esconde
   três; aberta custa quatro. Depende de quanto essas telas vão ser usadas no dia a dia.

5. **Seção do workspace devia poder nascer aberta?** Hoje `Interface › Menus` tem nome,
   ícone, ordem e grupos permitidos. Faltaria um "começa aberta" para o administrador
   decidir o que a equipe vê de cara. É campo novo, então não inventei.

---

## Rodadas

### Rodada 10 · 17/09/2026

**O que ela pediu**, literal:

> "auditoria nao fica em configuraçao. é um grande menu a parte."
>
> "se algo tem so um menu interno, ja deve abrir automaticamente nele. e todo menu de
> primeiro nivel quando clicado deve abrir o primeiro menu de primeiro nivel da lista."

#### Auditoria saiu das configurações

O grupo `Auditoria`, com `Logs de auditoria` e `Logs de requisição`, era o último item da
lista de configurações. Virou **seção nativa de primeiro nível**, e no modelo de trilha ganha
ícone próprio.

O motivo cabe numa frase: **configuração é onde se MUDA o workspace, auditoria é onde se OLHA
o que ele fez.** Quem consulta um log não está configurando nada, e quem está configurando não
quer passar pelo log. Guardar os dois atrás da mesma porta é o mesmo erro que a rodada 1
desfez com as 19 linhas de administração no meio do trabalho.

**Onde ela ficou:** depois das categorias, antes das seções do workspace. É primeiro nível
porque é assunto próprio, não porque é diário; acima das categorias ela empurraria o trabalho
de todo dia para baixo por um menu que se abre quando algo precisa ser explicado. **Se você
quiser mais acima, é um campo no `mocks.ts`.**

Fica uma pergunta: **quem enxerga Auditoria?** Está visível para todo o workspace, como estava
dentro das configurações (onde a porta já era restrita). Se log é assunto de administrador, a
seção precisa de escopo, e o escopo já existe no formulário.

#### As duas regras de abertura

Elas dizem a mesma coisa, de dois ângulos: **menu de primeiro nível não é beco sem saída.**

| Situação | O que acontece agora |
|---|---|
| Menu de primeiro nível com várias telas | Abre a lista **e já abre a primeira tela** |
| Menu de primeiro nível com **uma** tela só | Vira linha simples, sem seta, e clicar abre a tela |
| Fechar um menu que estava aberto | Só fecha, não navega |
| Ícone da trilha (modelo de dois níveis) | Trocar de área já abre a primeira tela da área |

Antes, clicar em `ANÁLISE` revelava três linhas e deixava a pessoa escolher de novo: um clique
cobrado sem nada em troca. Agora clicar em Análise abre o Dashboard de tarefas, clicar em
Auditoria abre os Logs de auditoria, clicar em Categorias abre a primeira categoria, e clicar
em `Correção monetária`, que tem uma tela só, abre a Calculadora avulsa **sem nem mostrar a
seta**.

**Duas fronteiras, que são decisão minha:**

1. **Fechar é só fechar.** Se fechar também navegasse, recolher a lista de categorias para
   ganhar espaço arrastaria a pessoa para dentro de uma categoria toda vez.
2. **A regra vale também para Favoritos, Categorias e Configurações**, que são menus de
   primeiro nível como os outros. Abrir Configurações cai em `Workspace > Visão geral`, que é
   o primeiro item da lista, e o grupo que abre é o do item ativo.

**O que a seção de uma tela só perde:** na barra ela deixa de ser um alvo onde se pode
SOLTAR outra tela arrastada, porque virou linha. O editor continua tratando ela como seção, e
é lá que se põe a segunda tela dentro dela.

#### Dois cliques mortos que apareceram no caminho

- **No modelo de trilha, clicar num item de configuração não mudava o miolo.** A barra marcava
  o item e a direita continuava na tela anterior: o painel de configuração só trocava o
  conteúdo quando a barra única o abria. Consertado.
- **"Voltar ao workspace" deixava o menu inteiro sem linha ativa**, porque devolvia para um id
  antigo (`inicio`) que a árvore não usa mais (`n-inicio`). Consertado, lendo o primeiro
  destino da árvore em vez de um id escrito à mão.

#### O tamanho, depois desta rodada

O modo "Só nativo" foi de 20 para **21 linhas** com a Auditoria. Medido nesta janela: o
conteúdo pede 758px e a área de rolagem tem 723px, então **transborda 35px aqui dentro**. Mas
a barra de andaime do protótipo come 76px que no produto não existem: sem ela, sobram 41px.

Ou seja: **cabe no produto, e não cabe na moldura do protótipo.** Se você quiser folga de
verdade, a variável é o teto da lista de categorias, hoje em cinco: baixar para quatro
devolve uma linha e meia. Não mexi porque o teto de cinco tem justificativa própria, escrita
na decisão 2.

No modelo de trilha, a Auditoria levou a trilha a **oito ícones** (Trabalho, Dados, Análise,
Auditoria, Conhecimento, Comercial, Comparações, Configurações). É mais um argumento para a
barra única, que a pesquisa já preferia: na trilha, cada seção nova custa um ícone numa
coluna que não cresce.

### Rodada 9 · 17/09/2026

**O que ela pediu**, literal:

> "analise deve ser um grande menu fora, de primeiro nivel, com os dashboards dentro"
>
> "ajuda em vez de ser um menu grande, deve ser um ícone de ajuda na base que com hover abre
> um dropdown com as opções de suporte, novidades, documentação"
>
> "o beni deve ser 'chat de ia' no menu grande"
>
> "teremos tambem outros menus nativos: inbox sera um deles. com notificaçoes pra abrir"

Quatro pedidos, e os quatro puxam para o mesmo lado: **o que se usa todo dia sobe, o que se
usa quando algo trava desce.**

#### Análise virou menu de primeiro nível

Estava dentro do painel de `Dados`, no modelo de trilha, e no fim da barra única. Agora:

- **Barra única:** seção de primeiro nível logo abaixo dos destinos nativos, **acima dos
  favoritos e das categorias**, com os três dashboards dentro.
- **Trilha:** ícone próprio, com painel próprio. Sai de dentro de Dados.

Ela abre **fechada** por padrão: as três telas ainda não existem, e três linhas com selo "Em
breve" abertas todo dia seria propaganda, não navegação. (Era a pergunta em aberto 8. Vira
decisão provisória: quando os dashboards existirem, vale medir de novo.)

#### A barra passou a ser desenhada na ordem da árvore

Esta é a mudança estrutural da rodada, e ela nasceu do pedido acima.

O gabarito da barra tinha blocos fixos: destinos, favoritos, categorias e, por último, as
seções. Ordem de gabarito, não ordem da árvore. Enquanto as duas coincidiam ninguém via a
diferença, mas **arrastar uma seção para cima dos destinos era um gesto que o editor aceitava
e a barra ignorava**: a árvore mudava e o desenho ficava igual.

Agora a barra percorre a árvore e desenha cada nó conforme o tipo. Foi assim que Análise
pôde ir para onde ela pediu, e é o que faz o que se arrasta ficar onde foi solto. Verificado:
subir Análise pelo teclado a leva para o meio dos destinos nativos, na barra, na hora.

Os favoritos são o único bloco que continua fora da árvore, porque são preferência de quem
usa e não configuração do workspace. Eles viajam grudados na seção de categorias, logo acima
dela, porque é de lá que eles saem.

#### Ajuda virou ícone na base

O rodapé tinha duas linhas, Configurações e Ajuda. Agora tem uma: Configurações ocupa a
linha e a Ajuda é um `?` na ponta direita. Passar o mouse abre **Suporte, Novidades da
plataforma e Documentação**. No modelo de trilha o mesmo ícone fica na base, entre a lupa e o
`+`.

O rodapé é o único trecho da barra que **não rola**: cada linha gasta ali é uma linha a
menos de navegação, todo dia, para um caminho que se usa quando algo trava.

**Sobre o hover e a acessibilidade.** Hover sozinho reprova na WCAG 2.1.1: sem mouse o menu
não existiria. Então o que está ali é um menu de verdade, com botão, `aria-haspopup`, setas e
Esc, e **o hover é um atalho por cima disso**. Quem passa o mouse abre sem clicar; quem usa
teclado abre com Enter; os dois chegam ao mesmo menu. O conteúdo não é portado para fora da
barra, senão atravessar do ícone até o menu disparava o `pointerleave` e fechava na cara da
pessoa.

#### O BENI virou "Chat de IA", e subiu

Era o primeiro item de Ajuda. Virou destino nativo, logo abaixo do Inbox. O nome mudou de
marca para função: quem chega hoje no workspace não sabe o que é um BENI, e "Chat de IA" se
lê sem tradução em pt, en e es.

#### Inbox, com as notificações

Destino nativo novo, logo abaixo de Início, com **contador do que não foi lido**. Ele não é
maquete: o contador da barra e a tela leem o mesmo estado, então abrir uma notificação baixa
o número na esquerda e "Marcar todas como lidas" o apaga. Verificado no navegador: 6, clique,
5, marcar todas, o selo some da barra.

Duas decisões dentro dele:

1. **Inbox é destino, não sino no canto.** Sino guarda a notificação num popover que some ao
   clicar fora; destino deixa voltar, reler e terminar depois. É o que o Linear, o ClickUp e
   o Notion fazem.
2. **O contador some no zero.** Número que nunca zera vira decoração e para de ser lido.

Tudo lido não esvazia a lista: o que já foi lido continua ali, porque "eu vi isso ontem, onde
foi mesmo?" é metade do uso de um inbox.

O texto das notificações é fictício e está em português nos três idiomas, como o nome das
categorias: é **dado** de maquete, não interface. O que troca de idioma é a moldura (título,
contador, "há 6 minutos", botão), e isso está nos três.

#### O menu nativo, agora

Com dois destinos novos e Análise subindo, o modo "Só nativo" ficou assim, e **continua
cabendo sem rolagem** (medido no navegador, transbordo zero):

> Início, Inbox, Chat de IA, Tarefas, Agenda, Spaceflows, Documentos, Análise, favoritos (3),
> Categorias (5 mais "Ver todas as 8"), e no rodapé Configurações com o ícone de ajuda.

São **20 linhas** ao todo, 19 na parte que rola e uma no rodapé, contra as 31 do menu de hoje.
E isso com três destinos que o menu de hoje nem tem.

#### Um conserto que veio junto

`Análise` estava na lista de painéis que podem receber uma seção nova, no formulário de
criação. Só que nenhum painel de Análise era desenhado: escolher aquela opção criava uma
seção que não aparecia em lugar nenhum. Saiu da lista.

#### Dois consertos que a rodada obrigou

**O selo da seção subiu para o cabeçalho.** Com Análise aberta na barra, "Dashboard de
tarefas" e "Dashboard de dados" viravam **a mesma linha cortada**: três selos "Em breve"
empurravam o nome de cada tela para o reticente. Agora, quando **todas** as telas de uma seção
são futuras, o selo aparece uma vez, no nome da seção, e as linhas de dentro ficam limpas.
Seção em que só uma é futura continua marcando linha por linha, porque ali o selo precisa
dizer qual.

**A barra lateral estava 24px atrás da barra de andaime.** A folga no rodapé do quadro era de
52px e a barra de andaime tem 76px (duas fileiras). Quem pagava era exatamente o rodapé do
menu, onde moram Configurações e agora o ícone de ajuda: o menu abria por cima dela. É
andaime, não produto, mas escondia a decisão que esta rodada pediu para mostrar.

#### As evidências

- [`evidencias/proposta-inbox-e-ajuda.gif`](evidencias/proposta-inbox-e-ajuda.gif): o Inbox
  com 6 não lidas, o clique que derruba o contador na barra, o "marcar todas" que apaga o
  selo, e a Ajuda abrindo no hover do ícone do rodapé.
- [`evidencias/proposta-analise-primeiro-nivel.gif`](evidencias/proposta-analise-primeiro-nivel.gif):
  Análise como menu de primeiro nível na barra única e como ícone próprio na trilha.

#### Perguntas que esta rodada abre

- **Quais são os outros menus nativos que vêm junto com o Inbox?** Você disse "inbox sera um
  deles", no plural. Cada um muda a conta de linhas.
- **O Chat de IA abre tela ou painel lateral?** Aqui ele é destino, como os outros. Se no
  produto ele abre por cima da tela atual, o lugar dele no menu muda.
- **O contador do Inbox conta o quê?** Aqui é "não lido". Se for "não resolvido", como no
  Linear, a regra de zerar muda.

### Rodada 8 · 17/09/2026

**O que ela pediu**, literal:

> "pode voltar pra base do menu o botao de criar e a lupa de busca. tava melhor."

> "saiba que o enspace tem módulos (que sao ativados dentro de sistema > informaçoes
> gerais), mas eles precisam passar a ter mais destaque no menu, ser uma opçao pra fora
> dali. esses modulos, quando ativados, acabam criando mais menus (de primeiro e segundo
> nivel), por exemplo, 'comercial' no seu exemplo poderia significar isso. / voce deve
> prototipar SOMENTE os menus nativos. estado 100% só com menus nativos. e aí outro modo da
> demonstração deve ter modulos ativados e menus personalizados junto (como ta agora)."

#### A lupa e o "+" voltaram para a base da trilha

Voltaram. E isso não briga com a rodada 3 nem com a 7, porque **são três buscas diferentes**,
e só uma desceu:

| Onde | O que é | Onde ficou |
|---|---|---|
| Barra do topo, centro | Busca geral do workspace (`CTRL K`) | Topo, e continua lá |
| Alto do painel | Filtro do próprio menu, que some o que não casa | Alto, e continua lá |
| Trilha (modelo de dois níveis) | O ícone de lupa e o `+` da trilha | **Base**, de volta |

Na trilha a lupa e o `+` são ícone sem rótulo, num corredor de 56 px. No topo eles disputavam
o olho com o workspace e com a primeira área, que é onde a navegação começa. Na base ficam
onde o polegar e o cursor já param quando a pessoa termina de ler a lista.

#### Módulos saiu de dentro de Informações Básicas

Hoje os módulos se ligam numa seção no fim de `Sistema > Informações Gerais`. Ligar um módulo
**muda o menu do workspace inteiro, para todo mundo**, e isso é grande demais para viver no
rodapé de outra tela.

Virou item próprio: `Configurações > Workspace > Módulos`. A tela diz, em uma frase, o que a
troca provoca: "Ligar um módulo acrescenta as telas dele ao menu lateral; desligar tira, e a
configuração fica guardada."

#### Cada módulo diz o que acrescenta ao menu, antes de ser ligado

Debaixo de cada módulo há a lista do que ele põe no menu, em selos: o menu de primeiro nível
em cheio, os de segundo em contorno. Hoje a pessoa liga e vai procurar o que apareceu. Aqui
ela lê antes e decide.

Essa lista **é lida da própria árvore do menu**, não é texto solto: o que o selo promete é
exatamente o que entra na barra.

> **Honestidade sobre o conteúdo:** os itens de segundo nível de Comparações vieram do fluxo
> documentado do módulo, não de tela observada no develop. A **mecânica** é a proposta; os
> rótulos exatos precisam da sua conferência.

#### Os dois modos da demonstração

Na barra de andaime, em `MENU`:

- **Só nativo.** Nenhum módulo, nenhuma seção que o workspace criou. É o menu de um workspace
  recém-aberto, e é o piso: se já confunde aqui, módulo e menu personalizado só agravam.
- **Com módulos e do workspace.** Dois módulos ligados (Comparações, Correção monetária) e as
  seções do workspace (Conhecimento, Comercial).

O que o modo nativo mostra, medido no navegador: a barra cabe inteira, **sem rolagem**, com
Início, Tarefas, Agenda, Spaceflows, Documentos, os três favoritos, cinco categorias mais o
"Ver todas as 8 categorias", a seção Análise e o rodapé com Configurações e Ajuda. O menu de
hoje, no mesmo espaço, pede 1208 px de altura para 847 px disponíveis.

No modelo de trilha o mesmo corte deixa a trilha com **quatro áreas**: Trabalho, Dados,
Configurações e Ajuda. Com tudo ligado ela vai a sete, e a seção de módulo marcada para a
trilha (Comparações) vira área própria, do lado de Conhecimento e Comercial.

#### Toda linha do menu agora tem origem

`nativo`, `modulo` ou `workspace`. Serve para três coisas: filtrar os dois modos acima, mostrar
o selo de procedência no editor de menus, e deixar explícito no código que **nativo é o
padrão** (linha sem origem declarada é nativa).

#### O que verifiquei, no navegador

- Em `Configurações > Workspace > Módulos`, desligar Comparações **tira a seção da barra ao
  vivo** na hora e o rodapé da tela passa a dizer "1 módulo ativo" (singular pelo dicionário,
  não por concatenação). Religar devolve a seção.
- Em "Só nativo" a barra fica com a lista acima e nada de CONHECIMENTO, COMERCIAL, COMPARAÇÕES
  ou CORREÇÃO MONETÁRIA.
- No modelo de trilha, a ordem da trilha é Trabalho, Dados, Conhecimento, Comercial,
  Comparações, Configurações, Ajuda, e a lupa e o Criar vêm **depois** de Ajuda, na base.

**Um erro meu, no caminho:** a marcação `origem: 'workspace'` tinha caído numa exportação
antiga do `mocks.ts` em vez das seções de verdade, e "Só nativo" continuava mostrando
Conhecimento e Comercial. Corrigido mirando pelo id da seção.

### Rodada 7 · 17/09/2026

**O que ela pediu**, literal:

> "a barra de busca deve ficar mais no alto. e na parte inferior nao deve repetir o perfil do
> user no menu. só la na esquerda superoir ja é suficiente."

#### O perfil saiu do rodapé do menu

Ficou só o avatar do topo, à esquerda, ao lado do nome do workspace. O rodapé da barra ficou
com Configurações e Ajuda.

Repetir o mesmo alvo em dois cantos da mesma tela não dobra o acesso, cria dúvida: quem vê os
dois pergunta se abrem a mesma coisa, e a resposta ("abrem") só se descobre clicando. E o
rodapé é o trecho mais disputado da barra, porque é o único que não rola junto com a lista.

Notion, ClickUp e monday põem a conta **em um canto só**. O Twenty põe no topo. Nenhum dos
sete que li repete.

#### A busca subiu

O filtro do menu passou a ser a primeira coisa depois do cabeçalho da barra, antes de Início.
Quem chega com um destino na cabeça digita; quem chega para olhar, ignora e desce. (A lupa da
trilha desceu de novo na rodada 8, pelo pedido dela; os dois pedidos falam de barras
diferentes, e a tabela da rodada 8 separa as três.)

### Rodada 6 · 17/09/2026

**O que ela pediu**, literal:

> "faz a ordenação personalizada nas categorias também"

Era a pergunta em aberto 10, e virou pedido. A lista de categorias agora tem **quatro**
ordenações, que são as do Attio:

| Ordenação | O que faz |
|---|---|
| Mais usadas | Por aberturas nos últimos 30 dias. É o padrão |
| Ordem alfabética | Pelo nome |
| Criadas recentemente | Pela data de criação |
| **Personalizada** | Respeita a ordem que a pessoa arrastou |

#### Arrastar liga a personalizada sozinho

Esta é a decisão que importa. Com um critério automático ligado, arrastar seria **desfeito no
recálculo seguinte**: a pessoa move, o menu volta, e ela conclui que o arraste não funciona.

Então arrastar com critério automático ligado **liga a Personalizada antes de mover**, e
avisa: "A ordenação virou Personalizada para o arraste valer."

O Attio exige escolher `Custom` no menu antes de poder arrastar. Diverge aqui de propósito:
exigir o passo anterior transforma um gesto direto em caça ao menu, e quem não achar o menu
conclui que a lista não se reordena. Ligar sozinho e dizer que ligou custa uma frase e resolve.

**Enquanto está no automático, a seção diz isso**, embaixo da lista: "Ordenada automaticamente.
Arraste para virar personalizada." A dica some quando a ordenação vira Personalizada.

#### A ordem parte do que está na tela

Ao virar Personalizada, a ordem é semeada com **a ordem que estava visível**, sempre, e não só
na primeira vez. Quem estava vendo a lista em ordem alfabética e arrasta espera que ela
continue alfabética e só o item movido mude de lugar. Reaproveitar uma ordem manual antiga
embaralharia tudo no primeiro gesto, que é o contrário do que o gesto pediu.

Categoria que nunca foi arrastada, ou criada depois, vai para o fim da lista, na ordem que já
tinha. Não some e não pula para o meio.

#### Onde essa ordem mora

A ordem das categorias é **preferência de quem usa**, como o favorito, e não configuração do
workspace, então ela fica **fora da árvore** do menu no `estado.ts`.

Mas viaja no **mesmo rascunho** e grava no **mesmo Salvar**: arrastar é arrastar, e ter duas
regras de gravação na mesma barra, uma que salva na hora e outra que espera, confundiria.
Arrastar categoria acende a mesma barra "Menu alterado", e `Descartar` desfaz junto com o
resto.

**A troca de critério pelo menu, essa sim, vale na hora.** É preferência de visualização,
reversível em um clique e sem nada a perder. O que espera o Salvar é a ordem construída à mão.

#### Sobre a verificação desta rodada

Verifiquei por script que a ordenação troca sozinha ao arrastar, que a dica some, que a barra
de salvar acende e que a ordem muda. **O antes/depois exato do arraste não deu para verificar**:
a janela do Chrome estava oculta, e aba oculta não calcula layout. Sem layout,
`getBoundingClientRect()` devolve altura zero, e a conta que decide "soltei na metade de cima
ou de baixo" cai sempre no mesmo lado. É artefato do teste, não do código: com a janela à
frente e um mouse de verdade, a coordenada existe.

Pelo mesmo motivo não deu para ler nenhum toast nesta rodada: em aba oculta o `innerText`
volta vazio e a fila de toasts não anda.

### Rodada 5 · 17/09/2026

**O que ela pediu**, literal:

> "faz a seçao criada aparecer na barra ao vivo
>
> e alem disso saiba que a reordenaçao SEMPRE deve ser por drag and drop. drag and drop dentro
> do proprio menu ou no modalzinho. e salvar depois de arrastar tudo. nao salva em tempo real"

#### 1. Uma árvore só, do editor até a barra

Era a pendência que eu tinha declarado na rodada 4, e ela cobrou. Antes o editor tinha uma
cópia sua e a barra lia o `mocks.ts` direto: criar uma seção mudava o editor e não mudava o
menu.

Agora existe o `estado.ts`, com **uma** árvore, e tudo lê dela: a barra única, a trilha e o
editor. Criar uma seção faz ela aparecer na barra na hora, e no modelo de trilha o campo
`lugar` decide se ela vira ícone na trilha ou seção dentro de um painel.

#### 2. Arrastar, e só arrastar

**As setinhas saíram.** Reordenar é arrastando, nos dois lugares:

- **dentro do próprio menu**, arrastando destino nativo ou seção;
- **no editor**, arrastando qualquer linha.

O arraste é o do navegador, HTML5 nativo, sem biblioteca: a regra 3 diz Nuxt UI e mais nada.

**Onde a coisa cai:**

| Onde você solta | O que acontece |
|---|---|
| Metade de cima de uma linha | Entra antes dela |
| Metade de baixo de uma linha | Entra depois dela |
| Meio de um cabeçalho de seção | Entra dentro daquela seção |

Uma linha azul mostra onde vai cair. Quando a regra do ENSPACE não deixa, a linha fica
vermelha, o item não sai do lugar, e **o motivo aparece preso na linha** que não coube, além
do toast. Toast some sozinho e passa despercebido no meio de um arraste, que é quando a
pessoa está olhando para a lista e não para o canto da tela.

**Precedente:** arrastar para reordenar na própria barra é o que o Attio faz
("Drag and drop favorites or folders in the sidebar to reorder them"), e o Notion, o Linear e
o monday também.

#### 3. Salvar depois, nunca em tempo real

Duas árvores no `estado.ts`: `rascunho`, onde o arraste mexe, e `aoVivo`, a linha de base.

- arrastar acende uma barra **"Menu alterado"** no rodapé da barra lateral, com `Salvar` e
  `Descartar`;
- o editor mostra o mesmo estado no rodapé, e os dois botões ficam desligados enquanto nada
  mudou ("Nada mudou ainda");
- **`Salvar` é a única gravação.** `Descartar` volta para o último salvo, e não para o estado
  de fábrica: testei criando uma seção, salvando, arrastando e descartando, e a seção salva
  ficou enquanto o arraste voltou atrás.

**Por que a barra mostra o rascunho e não o ao vivo:** arrastar sem ver o resultado é arrastar
no escuro. O que a regra dela protege é a **gravação**, e essa só acontece no clique.

#### 4. O teclado, que o arraste não cobre

Arraste nativo não tem teclado, e a WCAG 2.1.1 exige que tudo se faça sem mouse. Com o foco
no item, **Alt com as setas** move um passo. Não é botão na linha, é atalho, então a interface
continua sendo só arraste, como ela pediu. A dica está escrita no rodapé do editor.

#### O que não virou arraste, e por quê

**A lista de categorias continua ordenada por critério** (mais usadas, alfabética, criadas
recentemente), como no Attio, e não por arraste. Ordenar e reordenar são coisas diferentes:
com ordenação automática ligada, arrastar um item mente, porque o próximo recálculo desfaz.
O Attio resolve isso com uma quarta opção, `Custom`, que **desliga** a ordenação automática e
aí libera o arraste. Não implementei, e virou pergunta em aberto 10.

#### Um defeito encontrado e corrigido no caminho

**Classe Tailwind montada por interpolação não existe.** A primeira versão da marca de solta
fazia `before:bg-${cor}`, e o Tailwind lê o código-fonte para decidir o que gerar: a classe
nunca chegava ao CSS. Virou string literal por caso.

### Rodada 4 · 17/09/2026

**O que ela pediu**, literal:

> "deixe abrir o form de criação de seção de menu e criação de menus. nesse caso o user
> poderia criar no menu grandao e no menu pequeno sçoes pra ele. me mostre como vai ser isso.
> precisa estar escopado tambem"

Os dois formulários abrem de verdade, pelo `+ Criar` da barra de cima (`Seção de menu` e
`Novo item de menu`) e por dentro do editor, em `Configurações › Interface › Menus`.

#### O menu grandão e o menu pequeno

É a pergunta central da rodada, e a resposta é **um campo que só existe quando faz sentido**.

- **No modelo de barra única existe um lugar só.** O campo não aparece. Perguntar onde a
  seção vai seria inventar uma decisão que o modelo não tem.
- **No modelo de trilha existem dois**, e aí o campo aparece com as duas opções, cada uma
  dizendo para que serve:

| Opção | O que acontece | Quando usar |
|---|---|---|
| **Na trilha, com ícone próprio** (o menu pequeno) | Vira um ícone na barra estreita e abre um painel só dela | Área que a equipe usa o dia inteiro |
| **Dentro de um painel** (o menu grandão) | Vira uma seção recolhível dentro de uma área que já existe | Assunto que acompanha outro |

Escolhendo "dentro de um painel", um segundo campo pergunta **em qual**: Trabalho, Dados ou
Análise.

#### A prévia responde "me mostre como vai ser isso"

O formulário tem uma **prévia que muda junto** com o nome, o ícone, o lugar e o escopo. Quem
escolhe "na trilha" vê o ícone com o rótulo curto, do tamanho real, e descobre ali mesmo que
nome comprido trunca. Quem escolhe "dentro de um painel" vê o cabeçalho da seção com um item
embaixo.

Isso não é enfeite: **o truncamento do rótulo na trilha é o custo do modelo pequeno**, e a
prévia é onde ele aparece antes de a pessoa salvar.

#### O escopo

Não inventei nada: é o **Grupos Permitidos** que o produto já tem na seção de menu. Nenhum
grupo marcado significa que todo o workspace enxerga; marcando, só quem está nos grupos. O
resumo aparece na prévia e na linha da seção dentro do editor.

**O item herda o escopo da seção** e mostra de quem herda ("Herda o escopo de Análise"). A
caixa **"Restringir ainda mais neste item"** é **proposta minha**, e está marcada como tal:
hoje o produto só tem escopo na seção. Vale perguntar se faz sentido para vocês.

#### O formulário do item pede o que o tipo pede

Escolhido o tipo entre os 13, o formulário muda:

- tipo que lê categoria (`Consultas`, `Requisições`, `Meus Itens`, `Triagem`,
  `Consultas (Grupo de Membros)`) pede **categorias**, e avisa enquanto estiver vazio;
- tipo que precisa de URL (`Conteúdo Embutido`, `Customizado`) pede **caminho**;
- os outros não pedem nada além do nome e do ícone.

É o comportamento que a documentação de `Interface › Telas` descreve: "o sistema solicita a
seleção de uma ou mais categorias durante a configuração".

#### Detalhes que a rodada corrigiu

- **"1 grupos" virou "1 grupo".** Plural saindo do dicionário, nos três idiomas, e não
  concatenado no template. É onde a tradução quebra primeiro;
- **o seletor de ícones é o componente que já existe no repositório**
  (`app/components/ux/UxSeletorDeIcones.vue`), com busca em português e grade virtualizada,
  em vez de uma grade nova só para este formulário;
- **um defeito de montagem:** o formulário vive dentro do corpo do editor, que só renderiza
  quando o editor abre. Vindo do `+ Criar`, os dois abriam no mesmo instante e o componente
  montava com o modal já aberto, então o `watch` nunca disparava e a seção de destino nascia
  vazia. Resolvido com `immediate`.

**O que continua maquete:** salvar não persiste. A seção criada entra na árvore do editor em
memória e some no reload, como todo o resto do protótipo.

**O que ficou de fora, e por quê:** a seção criada **ainda não aparece na barra lateral ao
vivo**, só no editor. Ligar as duas pontas pede subir o estado do menu do editor para a
página inteira, o que é refatoração de verdade e merece uma rodada própria em vez de um
puxadinho no fim desta.

### Rodada 3 · 17/09/2026

**O que ela pediu**, literal:

> "a barra de busca deve ficar mais pro topo. e deve ter a barra de busca geral e a barra
> dentro de cada menu tambem, talvez.
>
> seçoes é a melhor ideia? os menus que voce botou em seçoes sao menus personalizados que o
> user criou.
>
> saiba que teremos tambem outras telas nativas aí em breve, sendo elas: dashboards de
> tarefas, dashboards de dados (itens), documentos (arquivos do workspace), meus relatórios
> (relatórios emitidos no workspace pelo usuario)
>
> e o user quando cria novos menus tem que escolher que tipo de tela ele ta botando ali:
> requisiçoes, tela de conteudo embedado, tela de formularios... por ai vai. e deve poder
> reordenar o menu e reagrupar, sem quebrar a logica do enspace. por exemplo, nao da pra
> deixar o cara botar uma categoria dentro de tarefas."

#### 1. A busca subiu, e viraram duas

**Busca global na barra de cima**, atravessando a tela inteira, com `Ctrl K`. É onde o Jira
novo a põe ("Search across all apps on your site, and Create work items"), e também o
Airtable e o HubSpot. Sair da barra lateral devolveu altura para a navegação, que é
justamente o que está sendo medido aqui.

**Filtro dentro do menu**, no topo da barra lateral. Não é a mesma coisa e por isso tem
outro ícone e outro texto: um **filtra o que está no menu**, o outro **busca conteúdo**.
ClickUp tem os dois ("Search your Home Sidebar" além da busca global) e o Slack também
(filtro de barra lateral com correspondência aproximada).

O "talvez" dela era justificado, e a resposta é sim: com teto de cinco categorias na seção,
sem filtro a pessoa não tem como alcançar pelo nome o que está fora do recorte sem abrir a
camada de todas. O filtro procura em **todas** as categorias, não só nas cinco visíveis.

**O painel de configurações também ganhou o seu**, filtrando os 23 itens.

#### 2. "Seções" não era a melhor ideia. Ela estava certa.

O balde `Seções` existia só no modelo de trilha, e agrupava por **mecanismo** ("são
seções") em vez de por assunto. É o mesmo vício que a pesquisa de UX aponta em
"Menu automático" (**S1-F4**): nome que descreve o mecanismo em vez do efeito.

- **Na barra única o problema nunca existiu**: `Conhecimento` e `Comercial` sempre
  apareceram com o nome que o administrador deu. Não há balde.
- **Na trilha, cada seção virou um ícone próprio**, como o Teams e o monday fazem com app
  fixado pelo administrador.

E isso **expôs o custo do modelo de trilha**, que é informação útil: a trilha passa a crescer
com o número de seções do workspace, e os rótulos dos ícones já truncam com dois
("Conhecim...", "Configuraç..."). O problema de volume mudou de lugar, não desapareceu. É
mais um argumento para a barra única.

#### 3. As quatro telas novas entraram

| Tela | Onde ficou |
|---|---|
| Documentos (arquivos do workspace) | destino solto, junto de Início, Tarefas, Agenda e Spaceflows |
| Dashboard de tarefas | seção `Análise`, recolhida por padrão |
| Dashboard de dados | seção `Análise` |
| Meus relatórios | seção `Análise` |

Todas com selo **Em breve**, porque ainda não existem no develop.

**A premissa, declarada:** agrupei as três de análise em vez de soltá-las. Solto, cada uma
custa uma linha permanente; na seção recolhida, as três custam uma. **Se a ideia for que elas
fiquem sempre visíveis, é só abrir a seção por padrão**, e aí custam quatro.

**O princípio que vale para o futuro:** toda coleção que cresce usa a mesma mecânica dos
favoritos, do teto e do "ver todas". Vale hoje para categorias, e vale para dashboards se
eles virarem lista que o usuário cria. Isso está na pergunta em aberto 6.

**Custo da rodada:** quatro telas novas entraram por **duas linhas** de menu, porque a seção
recolhe. No menu de hoje elas custariam quatro linhas fixas, em cima das 31.

#### 4. O editor de menus, com as regras de encaixe

`Configurações › Interface › Menus` agora abre o editor, e ele faz o que ela pediu:

- **escolher o tipo da tela**: os **13 tipos** que o produto já tem em `Interface › Telas`,
  de `Arquivos` a `Triagem`, num seletor por item;
- **reordenar**, com as setas, dentro do mesmo pai;
- **reagrupar**, com `Mover para`;
- **recusar o que quebra a lógica**, com o motivo na tela e no toast.

As quatro regras, tiradas do modelo que o produto já tem (seção tem itens, item é tela,
destino nativo é folha):

| # | Regra | Mensagem |
|---|---|---|
| R1 | Destino nativo é folha | "Tela nativa não recebe item dentro. Solte dentro de uma seção." |
| R2 | Só dois níveis | "O menu tem dois níveis. Seção não entra dentro de seção." |
| R3 | Categoria só na seção Categorias | "Categoria só entra na seção Categorias." |
| R4 | A seção Categorias só aceita categoria | "A seção Categorias só aceita categoria." |

O exemplo dela, categoria dentro de Tarefas, cai na R1. Evidência em
[`evidencias/editor-regras-de-encaixe.gif`](evidencias/editor-regras-de-encaixe.gif).

**Decisão de desenho:** o destino inválido **aparece na lista** e é recusado com o motivo,
em vez de ser escondido. Esconder deixa a pessoa sem entender por que não dá; recusar com o
motivo ensina a regra na primeira tentativa.

O editor também avisa quando o tipo escolhido **pede categoria e não tem** (Consultas,
Requisições, Meus Itens, Triagem e Consultas por Grupo), que é a regra que a documentação de
Telas descreve.

#### 5. O avatar saiu do rodapé da barra

Com o avatar na barra de cima, repetir nome e cargo no rodapé era altura gasta duas vezes.
Saiu, e os 44 px pagaram quase tudo o que as telas novas custaram.

**Medido depois de tudo:** o menu continua cabendo sem rolagem, com as cinco telas nativas,
os três favoritos, as cinco categorias, o "ver todas" e as três seções recolhidas.

**O que foi descartado nesta rodada:**

- **`Settings` na barra de cima**, como o Jira novo faz. Mudaria o endereço de quem já sabe
  clicar em Configurações no menu lateral (regra 16). Fica no rodapé da barra;
- **arrastar para reordenar.** As setas e o `Mover para` resolvem, são acessíveis pelo
  teclado e não pedem biblioteca fora do Nuxt UI (regra 3). Arrastar é o que o dev deve
  implementar por cima disso, e está declarado como maquete.

### Rodada 2 · 17/09/2026

**O que ela pediu**, literal:

> "tem coisa errada aí. voce pegou como exemplo um menu de hoje de um workspace especifico.
>
> e quando falamos em menu de 2 níveis, o que pensamos foi naquele tipo de menu que primeiro
> tem uns grandes icones (opçoes maiores, agregadoras) e dentro um menu especifico dali, como
> é no jira por exemplo
>
> faça desse modo simulado SE PERCEBER QUE É TENDENCIA DE MERCADO. Se nao for tendencia de
> mercado esse modelo, me prove com pesquisa.
>
> e pode simular a ação do botão de "+" que voce fez no topo tambem se ele for continuar
> existindo"

**1. O erro do menu de hoje, corrigido.** Ela está certa: o painel de comparação reproduzia
o menu do workspace `teste-ux` inteiro, com a categoria `leve`, o formulário `AUD Formulario`
e a seção `Knowledge` que alguém criou lá. Isso é o menu de **um** workspace, não do produto.

Agora o painel mostra o **menu nativo**: **31 linhas** (28 itens mais 3 rótulos de grupo) que
existem em qualquer workspace, com zero categorias cadastradas. Das 36 linhas que eu tinha
medido, 5 eram daquele workspace.

A medição em pixel continua sendo a do `teste-ux` (1208 px em 847 px), e a altura do menu
nativo é **derivada** dela, não medida à parte: 1208 / 36 = 33,5 px por linha, vezes 31 =
cerca de 1040 px. Continua acima dos 847 px. **O menu nativo não cabe na tela sozinho**, o
que é um argumento mais forte que o anterior, e não mais fraco.

**2. A trilha de ícones: pesquisada, construída, e não recomendada.** A pesquisa inteira está
no `PESQUISA.md`, seção "Trilha de ícones: é tendência de mercado?". O resumo:

- **o padrão é real**: Microsoft Teams, Slack, monday, ClickUp e Intercom usam trilha;
- **mas ele separa MODOS DE TRABALHO que convivem** (conversa, calendário, tarefa), e o
  ENSPACE tem um modo só, com satélites. Numa trilha, o ENSPACE fica com uma área gorda e
  três magras;
- **e o Jira, que foi a referência da demanda, saiu dele.** A navegação nova do Jira,
  documentada pela Atlassian, tem a seção "Navigation starts from the sidebar", sem trilha,
  com `Starred`, `Spaces` e `More` na barra, e `Search`, `Create` e `Settings` na barra de
  cima. É quase item por item o que esta pasta já propunha;
- **a trilha não apaga linha nenhuma**, ela esconde as das outras áreas atrás de um clique. O
  problema medido é volume de linha, não falta de gaveta.

**Construí assim mesmo**, como alternativa visível: o alternador `Modelo` na barra de andaime
troca entre `Barra única` e `Trilha e painel`. A trilha tem cinco áreas com conteúdo de
verdade (`Trabalho`, `Dados`, `Seções`, `Configurações`, `Ajuda`), porque comparar com um
espantalho não vale nada. Medido no navegador: as cinco áreas cabem sem rolagem.

O alternador fica no andaime, e não na tela, porque **no produto só um dos dois vai existir**.
Oferecer os dois ao usuário seria absurdo.

**3. O botão "+" agora abre menu de verdade.** Quatro opções: `Item em uma categoria`,
`Tarefa`, `Categoria` e `Seção de menu`. Cada uma dispara um toast dizendo qual formulário
abriria, porque o formulário em si é maquete. O botão existe nos dois modelos. No Jira novo,
`Create` fica na barra de cima; aqui fica ao lado da busca, que é onde o Linear e o Attio
põem.

**O que foi descartado nesta rodada:**

- **trilha como modelo padrão.** Pelos quatro motivos acima. Fica disponível para ela ver e
  decidir;
- **misturar os dois** (trilha para as áreas e barra para o conteúdo, ao mesmo tempo). Seria
  três níveis, que é o contrário do que a demanda pede.

### Rodada 1 · 16/09/2026

**O que ela pediu**, literal:

> "o menu do enspace na lateral esquerda é muito cheio e confuso. se eu tiver muitas
> categorias entao... piorou. mesmo sem menus personalizados so os nativos ja sao muitos.
> todo mundo se confunde" — "a ideia de produtos é fazer um menu em 2 níveis pro enspace."

**O que foi feito:** a proposta inteira acima, com os seis estados, a comparação lado a lado
com o menu medido no develop, e o de-para item a item.

**O que foi descartado no caminho:**

- **trilha de ícones no estilo monday.** Trocaria a forma que o produto usa (regra 15) e
  pioraria a descoberta, que é justamente a queixa;
- **agrupar categorias em pastas**, no estilo ClickUp. Criaria um terceiro nível, que é o
  contrário do que a demanda pede;
- **esconder Configurações atrás do avatar**, no estilo Attio. Mudaria o endereço de quem já
  sabe clicar em Configurações no menu (regra 16);
- **promover `Módulos` a item próprio** nas configurações. Hoje é uma seção dentro de
  Informações Básicas, e promover seria inventar um endereço que o produto não tem.

**Ressalva de processo:** a primeira medição desta rodada foi feita em produção, antes de eu
ter lido a spec deste repositório. Foi descartada e refeita no develop. Está registrado no
`BRIEFING.md`.

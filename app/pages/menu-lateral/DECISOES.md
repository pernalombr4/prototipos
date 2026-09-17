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

| Hoje | Proposta |
|---|---|
| Releases | Ajuda, no rodapé |
| Documentação | Ajuda, no rodapé |

O grupo `Ajuda` com dois itens virou **um** item de rodapé. Notion, Stripe, Linear e
Intercom fazem assim. É a única redução de endereço da proposta, e vale registrar como
divergência da regra 16: o destino continua alcançável em um clique, mas deixou de ter linha
própria no corpo do menu.

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

7. **A seção `Análise` deve nascer aberta ou recolhida?** Recolhida custa uma linha e esconde
   três; aberta custa quatro. Depende de quanto essas telas vão ser usadas no dia a dia.

5. **Seção do workspace devia poder nascer aberta?** Hoje `Interface › Menus` tem nome,
   ícone, ordem e grupos permitidos. Faltaria um "começa aberta" para o administrador
   decidir o que a equipe vê de cara. É campo novo, então não inventei.

---

## Rodadas

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

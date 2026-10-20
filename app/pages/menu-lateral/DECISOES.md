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

### Rodada 28 · 2026-10-20
- **Pedido (literal):** "se eu excluir um menu de dentro de uma seçao, como vou botar de novo depois? tirar da seçao é diferente de deletar."
- **Pedido (literal):** "'criar uma tela nova' é um texto que nao deve existir em lugar nenhum, porque isso é criar um MENU novo, simplesmente. o menu vem com um tipo de tela dentro. nao devemos usar tambem o texto 'menu com tela dentro'"
- **Pedido (literal):** "temos: seçoes, menus, submenus. no menu global de personalizaçao devo ser capaz de fazer a gestao de seçoes, dento das seçoes colocar menus e dentro dos menus colocar submenus. por enquanto isso ta fragmentado. reveja a experiencia."
- **Pedido (literal):** "trave o nivel: nao pode ter um submenu dentro de outro. no maximo 3 niveis: seçao > menu > submenu."
- **Pedido (literal):** "nao diferencie 'meu menu' e 'menu do workspace' no modal. isso deve ser diferenciado só na hora de salvar. só botar um botão de salvar aí na base desse modal pra qualquer alteraçao feita em qualquer aba"
- **Decisões dela, perguntadas:** a estrutura vale para o menu de cada pessoa e para o do workspace; submenu é qualquer menu que já existe.
- **Mudou:** 3 níveis no máximo, **seção > menu > submenu**, no menu de cada pessoa e no do workspace. Submenu não recebe submenu, e quem já tem submenus não vira submenu. A recusa diz "O menu tem no máximo 3 níveis: seção, menu e submenu. Submenu não recebe submenu.".
- **Mudou:** **tirar não é excluir.** "Remover da seção", que era vermelho, virou "Tirar da seção", sem vermelho e com "Desfazer" no aviso: o menu continua existindo e volta pelo "+". O submenu sai por "Tirar do menu". No menu do workspace, tirar sobe 1 nível (o submenu volta para a seção; o menu sai para o primeiro nível). "Excluir menu" é outra ação, vermelha, e só aparece no que o workspace criou.
- **Mudou:** Personalizar > "Seções e menus" (era "Seções") monta os 3 níveis numa árvore só: "No Início" (as seções do Início, com os menus e os submenus) e "Nas áreas da trilha" (as seções do workspace). Cada seção tem "Adicionar menu"; cada menu tem "Adicionar submenu", "Tirar" e mover; Integrações aparece com cadeado. Quem não configura vê as seções das áreas sem as ações de mudar.
- **Mudou:** **nada vale na hora** dentro da janela. Toda mudança, em qualquer aba (Navegação, Início e Seções e menus), vai para o rascunho, e o pé da janela tem "Descartar" e "Salvar". O "Salvar" pergunta "Salvar para todos" ou "Salvar só para mim"; quem não configura tem só "Salvar só para mim". Antes, a janela valia na hora e não tinha salvar.
- **Mudou:** "Adicionar em <nome>", uma janela só para escolher um menu que já existe, no "+" da seção, no "Adicionar submenu" e na árvore. O pé tem "Criar menu". No workspace, escolher MOVE o menu, porque a mesma tela não mora em 2 lugares.
- **Mudou:** o formulário "Criar menu" ganhou "Dentro de um menu, como submenu".
- **Mudou:** o menu de ações das telas do workspace ganhou "Adicionar submenu", "Tirar da seção" e "Tirar do menu"; o painel da trilha, o menu flutuante e o editor mostram o 3º nível.
- **Mudou:** saíram os textos "Criar uma tela nova", "Criar tela nova", "Nova tela", "Vincular tela existente" e "Menus com telas dentro". "Nova tela nesta seção" virou "Novo menu nesta seção"; "Tipo de tela" virou "Tipo de menu"; a busca diz "Pesquisar menus e categorias...".
- **Mudou (exemplo):** "Rotina do jurídico" tem o menu Logs de auditoria com o submenu Logs de requisição; Comercial tem Painel de vendas com o submenu Metas do trimestre.
- **Substitui:** a rodada 24. Lá, os submenus de um menu na seção pessoal eram as telas da seção do workspace, e reordená-los mudava o menu de todos. Agora o submenu da seção pessoal é escolha da pessoa, e reordenar muda só o menu dela.
- **Não mudou:** o filtro por tipo do Início ainda mostra "Telas" (rodada 27: o dev propõe o substituto).
- **Requisitos:** as fases 3, 4 e 5 em `requisitos/` ficaram desatualizadas nesta rodada (Personalizar, tirar e excluir, 3 níveis, salvar). Atualizar depois que o protótipo assentar.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral, botão direito no Início > "Personalizar navegação" > "Seções e menus" · print em `evidencias/rodada28-secoes-menus-e-submenus.jpg` (à esquerda, o Início com menu e submenu; no meio, as seções das áreas com "Minhas requisições" como submenu de "Triagem de propostas", a bolinha amarela e "Alterações não salvas"; à direita, o "Salvar" com os 2 alcances)

### Rodada 27 · 2026-10-20
- **Pedido (literal):** "nao precisa deletar, mas pode esconder do prototipo o 'barra unica', bloqueando o clique nesse botao e fazendo sempre abrir por padrao no modo de trilha."
- **Pedido (literal):** "divida esse desenvolvimento em fases lógicas de implementaçao, pra ajudar o dev num escopo tao grande. [...] divida e faça o doc de requisitos pra cada uma das fases. nao será lançado para o cliente ate acabar"
- **Pedido (literal):** "filtro no menu por TELA nao faz mais sentido. pode botar pro dev sugerir algo que tenha lógica."
- **Mudou:** o protótipo abre no modelo "Trilha e painel". O botão "Barra única" do andaime fica à vista, mas desligado, com o tooltip "Fora da proposta. O protótipo segue com a trilha.". O código da barra única continua no repositório.
- **Mudou:** os requisitos, em 6 fases de front-end, na pasta [`requisitos/`](requisitos/fases.md): 1, trilha e painel; 2, conteúdo do menu; 3, personalização; 4, arrumar o menu do workspace; 5, criar; 6, casos de uso e importação. Cada fase parte da anterior e termina num estado que o QA confere em develop; nada vai para o cliente antes da fase 6.
- **Mudou:** no requisito do filtro por tipo (fase 3, RF238 e P201), "Telas" saiu. Ficam "Categorias" e "Com pendências", e o dev propõe um terceiro tipo que faça sentido no menu novo. O protótipo continua mostrando a opção antiga até essa resposta.
- **Não mudou:** nenhuma tela do modelo de trilha.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral · os requisitos começam em `requisitos/fases.md`

### Rodada 26 · 2026-10-20
- **Pedido (literal):** "o menu de integraçoes nao deve ser reordenavel, assim como nenhum de configuraçoes"
- **Mudou:** Integrações tem ordem fixa, como Configurações. Apps, Credenciais e Webhooks não sobem, não descem, não saem para outra seção, e nada entra em Integrações.
- **Onde vale:** na barra única, no painel da trilha, no Início, no editor de menus e no teclado. A regra mora na árvore do menu (`ordemFixa` em `mocks.ts`, conferida em `estado.ts`), então nenhum caminho novo escapa dela.
- **O que some da tela:**
  - a alça de arraste das 3 linhas;
  - "Mover para cima", "Mover para baixo" e "Mover para" do botão direito e do "⋯";
  - "Nova tela nesta seção" e o "+" da seção no editor;
  - Integrações na lista "Dentro de uma seção" do formulário de menu novo.
- **Soltar algo em Integrações:** a seção fica vermelha, e o aviso diz "Integrações tem ordem fixa, como Configurações: nada entra, sai ou muda de lugar.".
- **Configurações:** já era assim. Os itens de lá não se arrastam e não têm menu de ações.
- **Não mudou:** o lugar da própria seção Integrações no menu e o ícone dela na trilha continuam móveis; o pedido foi sobre o que tem dentro. "Abrir", "Abrir em nova aba", "Copiar link" e "Ocultar do menu" continuam nas 3 linhas. Auditoria continua reordenável (rodada 24).
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral, seção Integrações · print em `evidencias/rodada26-integracoes-ordem-fixa.jpg` (o aviso depois de soltar "Logs de auditoria" em Integrações; o item voltou para Auditoria)

### Rodada 25 · 2026-10-20
- **Pedido (literal):** "do menu de personalizaçao, tire a aba de temas"
- **Mudou:** a janela Personalizar ficou com 3 abas: Navegação, Início e Seções. Saiu a aba Temas, da rodada 15, com a aparência (claro, escuro, automático) e a cor de destaque.
- **Não mudou:** a "Aparência" da aba Navegação ("Somente ícones" ou "Ícones e rótulos"), que é da trilha, e não do tema. O alternador claro e escuro da barra de andaime também fica: é controle do protótipo, não proposta.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral, modelo "Trilha e painel", botão direito no Início e "Personalizar navegação" · print em `evidencias/rodada25-personalizar-sem-temas.jpg`

### Rodada 24 · 2026-10-20
- **Pedido (literal):** "os submenus tambem devem poder ser reordenados, tipo esses de logs" (print da seção pessoal "Rotina do jurídico", com o menu Auditoria aberto e "Logs de auditoria" e "Logs de requisição" embaixo)
- **O defeito:** na seção pessoal do Início, as telas de um menu aberto (o terceiro recuo) eram a única linha do menu sem arraste e sem menu de ações. Os outros lugares sem arraste são de propósito: favoritos não têm ordem própria, e os itens de Configurações são fixos.
- **Mudou:** essas telas agora se reordenam pelos 3 caminhos do resto do menu: arrastar, Alt mais seta, e "Mover para cima" ou "Mover para baixo" no botão direito e no "⋯".
- **Mudou:** elas também ganharam o menu de ações das outras telas (abrir, abrir em nova aba, copiar link, mover, mover para, ocultar) e a bolinha amarela de alteração não salva.
- **A regra, igual à das telas de uma seção do administrador:** as telas são as do menu do workspace, então a ordem nova muda a árvore e passa pelo cartão "Salvar para todos" ou "Salvar só para mim". Só quem configura o workspace arrasta, como no resto do menu.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral, modelo "Trilha e painel", seção "Rotina do jurídico" · print em `evidencias/rodada24-submenus-reordenados.jpg` ("Logs de requisição" subiu, com a bolinha amarela, e o cartão de salvar apareceu)

### Rodada 23 · 2026-10-14
- **Pedido (literal):** "quando clicar com o botao direito em um elemento da trilha o que deve acontecer? porque nao ta acontecendo nada hoje. abre o menu do navegador" e, com um print do Teams, "no teams é assim, por exemplo, ao clicar com botao direito num icone da trilha"
- **O defeito:** o menu do botão direito da trilha (rodada 14) existia, mas só abria no ícone da área encaixada. Nos outros, o botão direito caía no menu do navegador. O `UContextMenu` do Nuxt UI entrega o evento ao filho, e o filho era o `UPopover` do hover, que não repassa o evento ao botão. O ícone encaixado usa `UTooltip`, que repassa, e por isso funcionava. A barra recolhida tinha o mesmo defeito nos ícones que abrem lista ao lado (`UDropdownMenu`).
- **Conserto:** uma `div` entre o menu do botão direito e o ícone, nos 2 lugares. Ela recebe o evento, e o hover, o clique e o arraste continuam no botão.
- **Mudou:** o menu da trilha segue a ordem do Teams, grupo por grupo:

  | Teams | ENSPACE | Em quais ícones |
  |---|---|---|
  | Abrir em nova janela | Abrir em nova aba | todos |
  | Compartilhar aplicativo | Copiar link | todos |
  | Mover para cima, Mover para baixo, Desafixar | Mover para cima, Mover para baixo, Tirar da trilha | todos, menos Início |
  | Desinstalar | Ocultar do menu | só seções (Análise, Auditoria, Comercial...) |
  | Personalizar barra de aplicativos | Personalizar navegação, e Recolher menu | todos |

- **Ficou fora, e por quê:**
  - "Sobre": no Teams mostra a ficha do app (quem fez, versão, permissões), e área do ENSPACE não tem ficha.
  - "Desinstalar" virou "Ocultar do menu", e não "Excluir": excluir uma seção vale para o workspace inteiro e mora no editor, com o cartão de salvar. Ocultar é o que cada pessoa tira para si, como o Desinstalar do app que ela mesma instalou.
  - "Abrir" saiu: o clique já abre, e o Teams também não repete. "Recolher menu" ficou, no último grupo, porque já estava aqui desde a rodada 14.
- **Não mudou:** o Início não sobe, não desce e não sai da trilha, porque é a âncora dela. Configurações e Dados não se ocultam, porque são nativos.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral, modelo "Trilha e painel", botão direito em qualquer ícone · print em `evidencias/rodada23-botao-direito-na-trilha.jpg` (o menu de Comercial)

### Rodada 22 · 2026-10-14
- **Pedido (literal):** "deve haver no menu uma opçao nativa para 'meus relatorios'. todos os relatorios extraidos no workspace vao pra lá. pode er outro nome esse menu, sem problemas. mas se meus relatorios for bom, ok."
- **O que o develop tem hoje (medido em 14/10/2026, workspace de exploração):** a tela já existe, em `/myReports`, e nenhum menu leva até ela. Só se chega lá pelo link do aviso que aparece ao extrair um relatório ("O relatório está sendo processado e pode ser acompanhado acessando Meus Relatórios Emitidos. Ao término do processamento, você será notificado por e-mail.") ou digitando o endereço. Conferido com 1 Relatório padrão em Excel, extraído pela tela numa categoria do workspace de exploração.
- **Mudou:** "Meus relatórios" virou **destino nativo**, logo depois de Documentos, nos dois modelos e na barra recolhida. Fica ao lado de Documentos porque as duas telas guardam arquivo. Sem selo "Em breve": a tela existe, falta só a porta.
- **Mudou:** saiu de dentro de Análise, onde morava desde a rodada 3 com "Em breve". Análise ficou com os 2 dashboards. Relatório extraído é arquivo que a pessoa baixa, não painel de análise.
- **Mudou:** a tela abre no miolo como **cópia da de hoje**: colunas Ações, Status, Modelo, Tabela, Entidade, Criado em, Registros e Filtros; ações Deletar, Download e Ver modelo, nessa ordem; o olho dos filtros com as abas "Visualização Personalizada" e "Visualização Padrão"; rodapé com página, 50 por página e "Mostrando 1 até N de N Relatórios". A tela não é o que está em discussão, então não ganhou melhoria de passagem.
- **A tela nova mora em outro protótipo:** `app/pages/meus-relatorios/`, de outra sessão, em andamento em 14/10/2026, redesenha a tela em si. Aqui ela fica como é hoje; quando aquele fechar, o miolo daqui pode trocar a cópia pela proposta de lá.
- **Mudou (proposta):** o título da tela é o nome do menu. Hoje são 3 nomes para a mesma tela: o cabeçalho diz "Relatórios", a trilha diz "Meus Relatórios" e o aviso diz "Meus Relatórios Emitidos".
- **Mudou (proposta):** o aviso de extração abre o destino do menu ("Abrir Meus relatórios") e fica 10 s na tela, porque com 5 s ele sumia antes do clique.
- **Mudou (proposta):** o relatório pronto e ainda não baixado tem fundo destacado na lista e conta no **número do menu**, como a notificação não lida do Inbox. Baixar apaga o número. Hoje o único aviso de "ficou pronto" é o e-mail.
- **Funciona no protótipo:** na tela de uma categoria, o ícone "Extrair relatório" (cópia do develop) abre "Relatório padrão" e a escolha do formato (Excel, CSV, DBF). A linha entra no topo de Meus relatórios como "Processando" e fica "Completa" 5 s depois; aí o menu ganha o número. O download é maquete: nenhum arquivo sai do navegador.
- **O nome:** ficou **"Meus relatórios"**, e não "Exportações" nem "Relatórios".
  - É o nome que a trilha do produto já usa, e "relatório" é a palavra do botão que alimenta a tela ("Extrair relatório", "Relatório padrão").
  - "Exportações" seria uma palavra nova.
  - "Relatórios" sozinho já nomeia os modelos de relatório da categoria (a tela Relatórios, nas configurações da categoria) e, no protótipo, o módulo "Relatórios de comparação". O "Meus" separa o arquivo que eu extraí do modelo que o administrador monta.
  - **Custo:** no modelo de trilha, com o painel na largura padrão, o nome mais o número corta em "Meus relatór…". Arrastar a borda do painel (rodada 19) mostra o nome inteiro.
- **Custo no menu:** 1 linha a mais entre os nativos da barra única.
- **Não medido, inferido:** o que Tabela e Entidade mostram num relatório com modelo (aqui, "Itens" e o nome da categoria) e o rótulo do status enquanto processa (aqui, "Processando"). No develop só vi "Completa".
- **Achados na tela de hoje (ficam como estão no protótipo):**
  1. A linha do Relatório padrão sai com Modelo, Tabela, Entidade e Registros vazios: quem extraiu de 3 categorias não sabe qual arquivo é qual.
  2. O olho dos filtros mostra IDs internos ("Form 3235", "Type 100", "Sort Created_at:DESC"), e não o nome do formulário e da categoria.
  3. "Deletar" vem antes de "Download" no menu de ações: a ação que apaga ocupa o lugar da ação mais usada.
  4. Textos com defeito: o vazio diz "Nenhum(a) Relatório Encontrado." e o rodapé vazio diz "Sem resultados desde.".
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral · abra Contratos, clique no ícone "Extrair relatório", escolha Excel e clique em "Abrir Meus relatórios" no aviso · print em `evidencias/rodada22-meus-relatorios.jpg` (em cima, o aviso na categoria; embaixo, a lista com o relatório processando e o número no menu)

### Rodada 21 · 2026-10-13
- **Pedido (literal):** "repare que o tamanho do menu que se abre num popover ta muito largo pro tamanho do texto das opçoes. como o clickup lida com isso? tem um tamanho minimo mais adequado? o tamanho é responsivo? o tamanho é fixo, mas menor que o nosso? e o notion? e outros concorrentes? pode acessar pra olhar. e pode copiar os bons exemplos."
- **Pesquisa:** ClickUp (242px, a largura do painel), Notion (260px e 265px fixos), GitLab (acompanha o texto, de 192px a 272px) e Material (do conteúdo, de 112dp a 280dp). Medidas e fontes no `PESQUISA.md`, "Rodada 21".
- **Mudou:** o menu que abre de lado acompanha o texto, entre 192px e 272px, como no GitLab (`FLUTUANTE`, em `moldura.ts`). Vale para o hover da trilha, os ícones da barra recolhida e o "⋯ Mais" do Início. Antes eram 288px fixos na trilha, 256px no "⋯ Mais" e, na barra recolhida, mínimo de 224px sem teto.
- **Medido depois, em px:** Auditoria 288 → 195; Análise 197; Comercial 213; Integrações 192 (o mínimo); Configurações 238; Dados 272 (o teto); "⋯ Mais" do Início 256 → 207; Análise na barra recolhida 192.
- **Mudou:** o nome maior que o teto quebra em 2 linhas, em vez de cortar com reticências. "Solicitações de compra e reembolso" aparece inteiro no hover da trilha e na barra recolhida.
- **Mudou:** no menu de lado, a linha não guarda mais à direita os 36px do "⋯" e da estrela, que ali não aparecem. Os favoritos mostram a estrela e continuam com a folga.
- **Mudou:** a caixa não alarga quando a pessoa abre um grupo dentro dela (Configurações). O grupo fechado continua ocupando a largura do que tem dentro, com altura zero e fora do Tab e do leitor de tela.
- **Não mudou:** o painel encaixado (larguras arrastáveis da rodada 19); a grade do "⋯ Mais" da trilha, que tem ícones em 3 colunas e não lista de texto; os menus de ações (botão direito e "⋯" da linha), que já acompanhavam o texto a partir de 224px.
- **Limite conhecido:** em janela baixa, quando a lista passa de 70% da altura, a barra de rolagem do Windows soma 15px à caixa. Exemplo: Configurações com "Inteligência artificial" aberta, a 695px de altura, vai de 238px para 253px. O GitLab faz o mesmo.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral, modelo "Trilha e painel", hover nos ícones · print em `evidencias/rodada21-menu-de-lado-na-largura-do-texto.jpg` (à esquerda, Auditoria com 2 itens; à direita, Dados no teto, com o nome longo em 2 linhas)

### Rodada 20 · 2026-10-13
- **Pedido (literal):** "é pra juntar tudo e colocar em main, junta tudo: seu trabalho + p de outra seçao"
- **Pedido (literal):** "cade o '... mais' nessas opçoes do menu trabalho? cade toda a parte personalizada que tava desenhada? sumiu? nao mandei tirar isso." e "nao tem mais os botoes no topo do menu aberto... muita coisa sumiu ou é bug no meu local?"
- **Não sumiu nada:** a pasta local estava na linha 14P a 17P, que nasceu da rodada 13 junto com a linha 14 a 19 e ainda não tinha as rodadas dela. O "⋯ Mais", os botões do topo do menu aberto e as seções pessoais são das rodadas 15, 17 e 19. Conferido depois da junção: estão todos lá.
- **Mudou:** as duas linhas viraram uma. O código é o da rodada 19; as rodadas 14P a 17P ficaram registradas acima, com o "P", e as decisões delas entraram aqui, por cima desse desenho.
- **Mudou:** **um formulário só para criar menu**, o `_CriarMenu`, aberto pelo "+" do Início, pelo "+" do topo, pelo "Novo menu" do editor e pelo "+" de cada seção. Antes eram dois, com campos e larguras diferentes: o do "+" (rodada 16) e o do editor (rodada 4).
- **Mudou:** **o tipo do menu é a tela** (decisão dela de 13/10, rodada 14P). Saíram "Vincular tela existente" e "Criar tela nova": a pessoa escolhe o "Tipo de menu", com a frase "O tipo é a tela que abre quando alguém clica neste menu", e o menu e a tela nascem juntos. Sem reuso: a mesma tela não aparece em dois menus, que foi a resposta dela.
- **Mudou:** no formulário único voltou o que a rodada 4 pediu e o formulário da rodada 16 tinha perdido: categorias e caminho quando o tipo pede, "Quem enxerga" (os Grupos Permitidos) e a prévia, que mostra a linha no menu e, embaixo, o que abre. Ficou o que a rodada 16 trouxe: onde ele mora, agora com três lugares (no Início, na trilha ou dentro de uma seção).
- **Mudou:** `Configurações > Interface > Telas` saiu. Sobrou `Menus`.
- **Mudou:** **a moldura única** (`moldura.ts`). Eram sete larguras de janela e três jeitos de rodapé para o mesmo tipo de tarefa. Agora: todo formulário (criar menu, seção, categoria e caso de uso, importar, usar, renomear, as maquetes) tem a mesma largura e o mesmo rodapé, `_RodapeDaJanela.vue`: contexto à esquerda, saída e ação à direita. Toda camada (editor, todas as categorias) tem a outra largura.
- **Mudou:** formulário abre **sempre por cima** de camada. O "Criar menu" chamado pelo editor nascia escondido atrás dele, porque as duas janelas tinham a mesma camada e quem foi montado antes fica embaixo.
- **Mudou:** o "+" do topo tem as mesmas portas do "+" do Início (seção, menu, categoria) e abre as mesmas janelas. Item e tarefa, que só davam um aviso, abrem uma janela de maquete declarada, com os campos que o produto pede (rodada 15P).
- **Mudou:** as janelas de criar menu e categoria saíram de dentro do modelo de trilha e foram para a página. Na barra única elas não existiam, e o "+" do topo e o editor não abririam nada ali.
- **Mudou:** "Adicionar item" do editor virou "Novo menu".
- **Conserto:** "+ > Seção de menu" abria o editor sem o formulário, porque o editor nasce só quando é aberto (rodada 13) e o watch dele não disparava nesse primeiro instante. Era o mesmo defeito que a rodada 14P tinha consertado na outra linha.
- **Não mudou, e por quê:** o botão direito é o da rodada 14 (padrão ClickUp, em todo item e nos dois modelos), mais completo que o das rodadas 16P e 17P. A pesquisa daquelas rodadas (Teams, VS Code, Slack, Notion) entrou no `PESQUISA.md` e confirma o desenho de lá.
- **Exceções da moldura, de propósito:** a Central de casos de uso (galeria que ocupa a tela), o menu nativo de hoje (réplica em tamanho real) e a busca (paleta de comandos).
- **Para conferir com ela:** "seção" quer dizer duas coisas no protótipo. No modelo de trilha, "Criar seção" cria a seção PESSOAL do Início (rodada 15); no editor, "Nova seção" cria a seção de menu do WORKSPACE (rodada 4). O "+" do topo segue o modelo. Os dois nomes iguais para coisas diferentes é a mesma dúvida que ela levantou na rodada 3 ("seções é a melhor ideia?").
- **Para conferir com ela:** o código ainda chama o tipo de `tipoDeTela` por dentro. O que a pessoa lê é "Tipo de menu"; o nome interno não mudou para não mexer em quinze arquivos da outra linha por uma troca que ninguém vê.
- **Maquete:** item e tarefa não salvam; menu criado e excluído vivem no rascunho, como o resto.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral · print em `evidencias/rodada20-criar-menu-unico.jpg` (o editor com o "Criar menu" por cima, já dentro da seção Conhecimento)

### Rodada 19 · 2026-10-13
- **Pedido (literal):** "pode mandar pra main o que ja fez e mergear normalmente."
- **Pedido (literal):** "com o menu aberto (expandido), eu devo poder arrastar a lateral, como no clickup, expandindo ainda mais ele (ate um limite saudavel) ou recolhendo. se eu recolher passando de um limite mininmo, ele minimiza o menu como se eu tivesse clicado ja no botao de minimizar"
- **Pedido (literal):** "e o botao mais q vc botou imitando o clickup, pode substituir ele por um botao igual do teams. simplesmente 3 pontos como símbolo. pode ter 'Mais' escrito sem problemas"
- **Pedido (literal):** "esse outro menu que voce botou, tem que ter como ha no notion uma opçao de qual o maximo de menus que mostra dentro de uma seçao. a pessoa pode escolher 5, 10, 15, 30... proponha quantidades factiveis. 'todos' é uma opção também."
- **Pedido (literal):** "a busca que voce fez no topo do menu, ao clicar tambem abre a busca global. nao pode acontecer isso. tem que abrir a busca local ali dentro do menu, num campo comum de barra de busca."
- **Mudou:** as rodadas 17 e 18 foram para a `main` (avanço direto, sem conflito).
- **Mudou:** a borda direita do menu aberto SE ARRASTA, nos dois modelos. Barra única: de 220 a 440 px (padrão 280). Trilha: de 264 a 480 px (padrão 304, com os 72 da trilha). Abaixo de 170 px (210 na trilha) o menu esmaece e a borda fica amarela: soltando ali, ele recolhe, e reabre do tamanho que tinha antes do gesto. Duplo clique volta ao padrão. Pelo teclado, a borda é um `separator` com foco: setas de 16 px, Home no mínimo, End no máximo, e seta para a esquerda no mínimo recolhe.
- **Mudou:** o "Mais" da trilha tem os três pontos do Teams, com "Mais" escrito embaixo.
- **Mudou:** "Mostrar na seção", no "…" e no botão direito de toda seção, nos dois modelos: 5, 10, 15, 30 ou Todos. 5 é o padrão de Categorias (o recorte de sempre) e Todos o das outras. Cortada, a seção ganha "Mais N", que abre o resto ali mesmo, e "Mostrar menos" volta. Categorias continua com "Ver todas as N", que abre a camada com busca. Filtrando, nada se corta.
- **Não mudou, e por quê:** a lupa do cabeçalho já abre o filtro local desde a rodada 17. A que ela viu abrir a busca global era a do site publicado, que ainda estava na rodada 16. Conferido de novo nesta rodada: a lupa abre o campo "Filtrar o menu" dentro do menu, e nenhuma janela se abre.
- **Descartado:** 20 entre as opções de limite. Motivo: entre 15 e 30 não muda nada que se perceba numa barra lateral.
- **Descartado:** recolher no meio do arraste, assim que passa do limite. Motivo: soltar é o que confirma; enquanto o botão está apertado dá para voltar, e o esmaecido avisa.
- **Maquete:** a largura e os limites não sobrevivem ao recarregar.
- **Crítica e acessibilidade:** a borda tem nome, valor atual, mínimo e máximo para o leitor de tela, e o teclado faz tudo o que o mouse faz. Fica: a borda tem 8 px de alvo, abaixo dos 24 px da WCAG 2.5.8; o recolher e o duplo clique têm caminho próprio (botão, Ctrl+\\ e teclado), então nada depende só dela.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral · prints em `evidencias/rodada19-*.png`

### Rodada 18 · 2026-10-09
- **Pedido (literal):** "os botoes de importar e modelos tambem sao importantes pro enspace, afinal temos importaçao e exportaçao, alem dos nossos casos de uso (modelos). [...] ao clicar em casos de uso posso selecionar varios para filtrar os modelos. o proprio user tambem pode criar um modelo replicavel. tem tipos de modelo e complexidade como filtro tambem. quando clico num modelo (que seria nossos casos de uso do enspace), a visao é detalhada sobre ele [...] eu posso clicar em 'usar modelo' ou ir nos 3 pontos ao lado do titulo do modelo e clicar em adicionar ao espaço de trabalho. nao sei a diferença entre as duas opçoes. veja se encontra em documentaçao do clickup [...] clicando na galeria posso expandir as imagens do modelo [...] e se eu coloco em importar, no caso do enspace, devo poder importar caso de uso extraido de outro workspace pra ja fazer os menus pra mim, e na hora seleciono se quero que sobrescreva ou some com o que ja tem."
- **Mudou:** o "+" do Início ganhou o pé do ClickUp: **Importar** e **Casos de uso**.
- **Mudou:** a **Central de casos de uso**. Destaques, Do seu workspace e Do ENSPACE; filtros de Tipo (workspace completo, menu, categoria, tela) e Complexidade; busca; **Áreas**, com busca, "Selecionar tudo" e várias marcadas; a faixa "Criar caso de uso"; cartões agrupados por área com "Ver mais". Doze casos do ENSPACE, inventados, em oito áreas.
- **Mudou:** o **detalhe**: ícone, nome, complexidade, área, "Usar caso de uso"; galeria com setas e pontos que amplia em tela cheia; descrição; "O que vem junto" (menus e telas, categorias e campos, status) abrindo item a item; à direita, quem fez, quando e quantas vezes foi usado.
- **Mudou:** os **dois botões**, com a diferença do ClickUp dita na tela. "Usar caso de uso" APLICA: mostra o que entra, pede somar ou substituir (e, substituindo, mostra o que sai, riscado) e onde os menus entram. "Adicionar ao workspace", no "…", só GUARDA uma cópia em "Do seu workspace", e a própria opção diz "O menu não muda". O toast repete.
- **Mudou:** **Criar caso de uso** a partir do menu de hoje: nome, área, complexidade, descrição e quais menus entram.
- **Mudou:** **Importar**: área de arraste (ou clique) para o `.json` de outro workspace, lido no próprio navegador; de onde veio e quando; o que entra; somar ou substituir. "Usar um arquivo de exemplo" para a demonstração. **Exportar** no pé do Importar e no "…" do caso, baixando o arquivo; o arquivo exportado se importa de volta.
- **Mudou:** Configurações > Interface > Casos de uso abre a mesma Central.
- **Fronteira:** muda o "+" do Início e cria a Central. Não muda o menu, as regras de encaixe e a tela de migração do protótipo `migracao-de-workspace`.
- **Descartado:** os filtros "Etiquetas" e "Criado por" do ClickUp. Motivo: caso de uso não tem etiqueta nem autoria no ENSPACE hoje.
- **Descartado:** as três opções do `migracao-de-workspace` (adicionar o que falta, atualizar e adicionar, substituir tudo). Motivo: aqui ela pediu duas, somar ou substituir. Lá a importação compara categoria por categoria; aqui o pacote entra inteiro. **Para conferir com ela:** se a importação pelo menu e a de Configurações devem ter as mesmas três opções.
- **Maquete:** os casos, os números de uso e as miniaturas são do protótipo. Usar e importar põem os menus no rascunho (acende o Salvar) e as categorias na lista; campos e status do caso não são criados. Nada sobrevive ao recarregar.
- **Crítica e acessibilidade:** somar e substituir são `radiogroup`; o botão de usar fica vermelho e troca de ícone quando é substituir; a galeria tem nome em cada ponto e em cada seta; a área de arraste abre com Enter e Espaço. Fica: a ampliação mostra a miniatura maior, sem zoom nem download.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral, modelo "Trilha e painel", "+" do Início · prints em `evidencias/rodada18-*.png`

### Rodada 17 · 2026-10-09
- **Pedido (literal):** "sobre sua opiniao anterior: pode aplicar" (a busca do menu fechada atrás da lupa do cabeçalho, nos dois modelos, a global só no topo, e a lupa da base da trilha tirada)
- **Pedido (literal):** "no clickup, os botoes do topo do menu aparecem com hover. usando a barra de inicio como exemplo: sem passar o mouse no topo vem só inicio e o botao de '+'. se passar o mouse em qualquer lugar do menu ficam os ícones. o botao do meio é filtro, da esquerda é a caixa de busca e da direita é pra fechar o menu. e no botao de criar, ao clicar voce pode descrever o que quer criar e, se nao for encontrada no menu, sobra a opçao de usar a ia pra criar pra voce. esse é um ponto interessante."
- **Mudou:** a busca do MENU vem fechada, nos dois modelos. É a lupa do cabeçalho: abre um campo no lugar do título, com o foco dentro, e Esc ou o "x" fecha e limpa. A busca do WORKSPACE fica só na barra do topo (Ctrl+K).
- **Mudou:** o filtro procura no que não está à vista: itens de "⋯ Mais", seções recolhidas e ocultas, todas as categorias (não só as cinco do recorte), e as telas de um menu posto numa seção. Filtrando, as seções com resultado abrem, as vazias somem e nada se arrasta.
- **Mudou:** sem resultado, o aviso tem "Buscar X no workspace", que abre a busca global já com o termo.
- **Mudou:** saiu a lupa da base da trilha. Ela abria a mesma busca do topo, e a lupa do cabeçalho agora faz outra coisa.
- **Mudou:** o cabeçalho do Início parado mostra só o título e o "+". Com o mouse em qualquer lugar do painel (ou o foco do teclado neles) aparecem a lupa, o filtro por tipo, Personalizar e recolher. Ligados, ficam à vista. Nas outras áreas, lupa e recolher; na barra única, lupa e recolher no topo, do mesmo jeito.
- **Mudou:** o filtro por tipo do Início, as pílulas do ClickUp com os tipos do ENSPACE: Categorias, Telas e Com pendências (Inbox e Tarefas com número). Marcadas juntas valem como "ou".
- **Mudou:** o "+" do Início abre "Descreva o que quer criar". O texto filtra Criar seção, Criar menu e Criar categoria; quando nada casa, aparece "Criar com IA" com o texto digitado, e o BENI monta e mostra antes de gravar, a regra de `ia-no-campo-html`. "Personalizar a barra lateral" fecha a lista.
- **Fronteira:** muda a busca do menu nos dois modelos, o cabeçalho e o "+" da trilha. Não muda a busca global, o conteúdo do menu e as regras de arraste.
- **Descartado:** "Importar" e "Modelos" no pé do "+", que o ClickUp tem. Motivo: o ENSPACE não tem essas portas no menu, e inventá-las seria proposta fora do pedido.
- **Descartado:** campo do menu sempre aberto, como o do Notion. Motivo: o do Notion é a busca global; aqui a global já mora no topo, e dois campos à vista parecem o mesmo.
- **Maquete:** "Criar com IA" só mostra o toast.
- **Crítica e acessibilidade:** os ícones escondidos no hover aparecem também com o foco do teclado (`focus-visible`), têm nome e o filtro por tipo diz se está ligado (`aria-pressed`). Esc fecha o filtro. Fica: na barra única, a linha da lupa ocupa a mesma altura do campo de antes, então o espaço não foi ganho ali, só a ambiguidade saiu.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral · prints em `evidencias/rodada17-*.png`

### Rodada 16 · 2026-10-09
- **Pedido (literal):** "basicamente, te mandei um monte de print do clickup e é assim que precisamos ter nosso menu, mas diferente do clickup, permitiremos reordenaçao na trilha e reordenação nos menus nativos, nao so nos personalizados! e nossas entidades possiveis de estarem no botao de customizar é: criar seçao, criar menu (e na hora de criar menu ja tem que poder vincular uma tela a ele ou criar essa tela, como o clickup tambem faz). criar categoria tambem é possibilidade. e deve ser possível o user ocultar nativos também, se quiser. e saiba que tem um novo menu no enspace: o menu integraçoes, e dentro dele tem apps, credenciais e webhooks como submenus. veja onde vai alocar isso na estrutura prototipada, mas tem q dar conta disso. [...] observe que esse menu aí de ajuda ta pessimo. olha o tamanho do ícone frente aos outros onde ele ta posicionado. muito ruim mesmo. [...] execute essas alteraçoes e pode fazer push pra main"
- **Mudou:** a trilha SE ARRASTA (diferente do ClickUp, a pedido dela): no próprio ícone, que vai para o rascunho e acende o Salvar; em Personalizar > Navegação, que vale na hora; Alt com as setas e "Mover para cima/baixo" no botão direito. Início fica no topo, é a âncora.
- **Mudou:** os itens nativos do Início SE ARRASTAM, no menu e em Personalizar > Início, com Alt e setas e "Mover" no "…".
- **Mudou:** tudo se oculta. Nenhum item nativo do Início fica travado (Início e Inbox eram), e qualquer seção se oculta pelo "…" (Categorias, Favoritos, as do administrador e as pessoais). Voltam por Personalizar ou por "⋯ Mais".
- **Mudou:** o "+ ▾" do Início tem as três entidades que ela pediu: Criar seção, Criar menu e Criar categoria, e depois "Personalizar a barra lateral". Menu e categoria são do workspace, e só quem configura cria (os outros veem o item desligado, com o motivo).
- **Mudou:** **Criar menu** numa janela só: ícone, nome, onde fica (no Início ou na trilha) e as telas. "Vincular tela existente" busca as telas dos menus que existem; "Criar tela nova" pede nome e tipo de tela, ali mesmo. O menu entra no rascunho e acende o Salvar, como o editor. No Início, entra no topo das seções; na trilha, entra fixado.
- **Mudou:** **Criar categoria**: ícone e nome. A categoria aparece em Categorias, no topo de "Mais usadas", e na busca.
- **Mudou:** **Integrações**, menu nativo novo, com Apps, Credenciais e Webhooks. Fica onde a Auditoria ficou na rodada 10: menu de primeiro nível, com ícone na trilha (fixado por padrão) e seção na barra única. O grupo "Conexões" (Integrações e Credenciais) saiu de Configurações, porque virou este menu.
- **Mudou:** a trilha cabe oito ícones (eram seis), para Integrações entrar sem tirar ninguém.
- **Mudou:** o ícone de Ajuda na trilha e na barra recolhida tem o tamanho dos vizinhos: caixa de 36 px e ícone de 20 px na trilha (era botão pequeno, ícone de 16 px), 40 e 20 na barra recolhida. Na barra aberta continua ao lado de Configurações, como estava.
- **Mudou:** o mapa de nomes do menu ficou num arquivo só (`rotulos.ts`). Antes eram cinco cópias, e um menu nativo novo teria que ser lembrado em cada uma.
- **Mudou:** com algo para salvar, a lista do painel ganha respiro embaixo e o cartão de salvar quebra a linha em vez de cortar "Descartar". O cartão cobria o "Personalizar a barra lateral".
- **Fronteira:** muda o modelo de trilha, a Ajuda nas colunas de ícones e o lugar das Integrações nos dois modelos. Não muda o resto da barra única nem as regras de encaixe da rodada 5.
- **Descartado:** Integrações dentro de Configurações, ao lado de Membros e Cargos. Motivo: ela disse que é um menu novo do ENSPACE, com submenus; e a regra desde a rodada 10 é que menu do produto com telas próprias vira primeiro nível.
- **Maquete:** "Vincular tela existente" cria um item novo com nome, ícone e tipo da tela escolhida (no produto, o item aponta para a mesma tela). A categoria criada só tem nome e ícone; o cadastro completo é em Configurações. Nada sobrevive ao recarregar.
- **Crítica e acessibilidade:** todo arraste novo tem caminho de teclado (Alt com setas e "Mover" nos menus). Ficam: o popover do hover continua só de mouse, como na rodada 15; o Início não sai do topo da trilha, e isso é decisão minha, para conferir com ela.
- **Ver:** publicado em https://pernalombr4.github.io/prototipos/menu-lateral/ (modelo "Trilha e painel") · prints em `evidencias/rodada16-*.png`

### Rodada 15 · 2026-10-09
- **Pedido (literal):** "clickup nao permite reordenar os menus da trilha. nem minimizalos. o estado minimizado, ao passar o mouse no icone, abre um popover trazendo o menu. o mesmo acontece se estou com 'Inicio' selecionado e passo o mouse em outro grande icone, por exemplo. o inicio continua aberto no fundo e o outro menu abre em popover. apenas o menu 'inicio', quando clicado, tem a opçao de personalizar a barra lateral. ele é equivalente ao nosso menu 'trabalho'. pode se chamar inicio inclusive. e na hora que clicamos nele, redireciona pra home e também abre esse menu especifico. [...] somente a seçao de chats com ia pode ser ocultada. o resto nao. só reordenar. [...] ao botar pra criar seçao abre um modal. criada ela aparece no topo da lista. [...] o clickup nao permite reordenar o que aparece no menu início, mas permite reordenar as seçoes entre si ate mesmo direto no menu [...] uma seçao pode ter menus com submenus dentro! entao o enspace passaria a ter suas proprias seçoes pra ficar similar! [...] se pinnar e nao tiver mais espaço, ele substitui o ultimo da trilha [...] ao miniminar o menu, a trilha fica assim com '>>' como primeiro icone"
- **Pedido (literal):** "tinha 5 mensagens agendadas que foram agora. leia essas mensagens e aplique o que existe no clickup ao nosso modelo tambem."
- **Mudou:** "Trabalho" virou **Início** (nos três idiomas). Clicar nele abre a página inicial e o menu Início, mesmo se ele já estiver aberto.
- **Mudou:** a trilha não se arrasta nem se reordena (sai o arraste da trilha da rodada 14). O que fica nela se escolhe em Personalizar > Navegação ou pelo alfinete em "Mais". Cabem seis ícones com o Início; fixar com a trilha cheia troca o último, e ele vai para "Mais", com um toast que diz quem saiu.
- **Mudou:** "Mais" na trilha: grade com o que não está nela, alfinete no hover e "Personalizar navegação" no pé.
- **Mudou:** passar o mouse num ícone que não é o aberto mostra o menu dele num popover por cima do painel, e o painel encaixado fica onde estava. Recolhido, todo ícone faz isso, e o primeiro ícone vira "»".
- **Mudou:** o menu Início, no desenho do ClickUp. Em cima, os itens nativos em ordem fixa; os que saíram ficam em "⋯ Mais", com alfinete e atalho para Personalizar. Embaixo, as seções: arrastam no próprio menu, recolhem pelo nome, e no hover mostram "…" e "+". Os itens ganharam o "…" no hover, que abre as mesmas ações do botão direito.
- **Mudou:** **seções pessoais**. "Criar seção" abre uma janela com ícone e nome, e a seção entra no topo. O "+" da seção busca o que já existe (menus com telas dentro, telas, categorias) e tem "Criar uma tela nova" no pé. Seção vazia mostra "+ Adicionar à seção". Um menu posto numa seção abre as telas dele como submenus, num terceiro recuo. O "…" da seção tem renomear, adicionar, ordenar (personalizada, alfabética, adicionadas por último), criar seção, reordenar seções e excluir.
- **Mudou:** **Personalizar**, com as quatro abas do ClickUp. Navegação (o que aparece na trilha, Início travado, "Somente ícones" ou "Ícones e rótulos"); Início (o que aparece, com Início e Inbox travados); Seções (arrastar, Alt com setas, só Favoritos se oculta, seções ocultas embaixo, "Criar seção"); Temas (claro, escuro, automático e cor de destaque). O botão fica no pé do menu Início até o primeiro uso, e depois vira ícone no cabeçalho.
- **Mudou:** o cabeçalho do Início tem busca, Personalizar (depois do primeiro uso), "«" para recolher e "+ ▾" para criar, que termina em "Personalizar a barra lateral".
- **Mudou:** o conteúdo de cada área saiu para `_PainelDaArea.vue`, porque agora aparece encaixado e em popover. Novos: `_MenuInicio.vue`, `_Personalizar.vue`, `_CriarSecao.vue`, `_AdicionarASecao.vue`, `trilha.ts` e `rotulos.ts`.
- **Fronteira:** muda o modelo de trilha. Não muda a barra única (rodada 14 continua como estava), as regras de encaixe da rodada 5 e o miolo da tela.
- **Descartado:** o arraste na trilha da rodada 14 (reordenar ícones, soltar item dentro de um ícone, levar seção para um painel arrastando). Motivo: o ClickUp não deixa, e ela corrigiu. Levar seção entre trilha e painel continua pelo botão direito.
- **Descartado:** "Marcar tudo como lido" e "Mostrar na seção: não lida, apenas menções" do "…" da seção. Motivo: são de chat no ClickUp, e o ENSPACE não tem leitura por seção.
- **Descartado:** renomear dentro do próprio "…" da seção, como o ClickUp. Motivo: campo de texto dentro de menu briga com a busca por letra do menu. Renomear abre a mesma janela de criar.
- **Não deu:** aplicar o mesmo à barra única. Por quê: entendi "ao nosso modelo" como o de trilha, que é o equivalente do ClickUp. Personalizar, seções pessoais e "Mais" cabem na barra única também, se ela quiser.
- **Maquete:** as preferências não sobrevivem ao recarregar. A seção "Rotina do jurídico" é exemplo do protótipo (numa conta nova a lista nasce vazia). A cor de destaque troca o `primary` só nesta aba do navegador. O limite de seis ícones é fixo, medido a 900 px de altura, e não acompanha a altura da janela.
- **Crítica e acessibilidade:** a seção do Início ganhou caminho de teclado (Alt com setas no cabeçalho e na aba Seções); o "…" dos itens tem rótulo próprio ("Mais ações de X"); "Somente ícones" põe o nome no `aria-label` de cada ícone. Ficam: o popover do hover só abre com mouse (no teclado, o ícone abre o menu encaixado, que tem o mesmo conteúdo); as miniaturas de Temas e as amostras de cor usam cor da paleta direto (`bg-fuchsia-500`, `bg-neutral-900`), porque mostram a própria cor, contra a regra de token só (Parte 2); a recusa "Seção não entra dentro de seção" para destino nativo continua da rodada 5.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral, Modelo "Trilha e painel" · prints em `evidencias/rodada15-*.png` · os prints do ClickUp que ela mandou NÃO entraram no repositório: têm e-mail de pessoa e nome dela, e o repositório é público (regra 13)

### Rodada 14 · 2026-10-09
- **Pedido (literal):** "perceba que no modelo de barra unica do menu do prototipo voce fez drag and drop nos elementos direto no menu. no de trilha e painel vc nao fez isso. tem que fazer, tanto na trilha quanto no painel. e ao clicar com botao direito em cada menu/trilha tem que ter funcionalidades aparecendo ali. pesquise como o clickup trabalha com iso pra ter inspiraçao. alem disso, falta voce prototipar o comportamento do menu fechado e aberto (minimizado/expandido)"
- **Pedido (literal, no meio da rodada):** "voce pode abrir mesmo o clickup e me pedir pra logar pra voce usar e entender o funcionamento: o que permite reordenar, o que permite colapsar, o que permite criar de menu 100% personalizado etc"
- **Mudou:** arrastar no PAINEL da trilha, com as mesmas regras de encaixe e o mesmo cartão de salvar da barra única (Trabalho, Dados e a seção aberta da trilha; as categorias de Dados também).
- **Mudou:** arrastar na TRILHA. Borda de cima ou de baixo de um ícone de seção reordena (e traz para a trilha a seção que estava num painel); meio do ícone põe o item dentro da seção; meio de Trabalho ou de Dados leva a seção para aquele painel. Recusa pinta vermelho e diz o motivo, como no painel.
- **Mudou:** botão direito em toda linha, cabeçalho de seção, categoria e ícone da trilha, nos dois modelos. Três blocos fixos, na ordem do ClickUp: ir (abrir, abrir em nova aba, copiar link), arrumar (favoritar, mover para cima e para baixo, mover para outra seção, levar para a trilha ou para um painel), mexer (renomear, ocultar, configurar). Tudo num arquivo só, `acoes.ts`.
- **Mudou:** "Ocultar do menu" e "Itens ocultos" no pé da barra, que traz de volta. Oculto continua na busca. Ocultar entra no rascunho como o arraste: "Salvar só para mim" é o Hide do ClickUp; "Salvar para todos" é o administrador tirando do menu de todos.
- **Mudou:** "Renomear" abre uma janela curta e vale só para o que o workspace criou. Nome nativo vem do produto.
- **Mudou:** recolher e expandir, nos dois modelos. Botão de painel no alto da barra e `Ctrl + \`, como no ClickUp. Barra única recolhida vira coluna de ícones na mesma ordem: destino abre direto, seção abre os itens de lado, Favoritos e Categorias saem do mesmo ícone, contador vira bolinha. Trilha recolhida fica só com a trilha, e o expandir aparece no alto dela.
- **Mudou:** recolhido não esconde o que falta salvar: um ícone de salvar com a bolinha amarela aparece na coluna e abre a barra.
- **Mudou:** o cartão de salvar e os avisos do pé viraram peças próprias (`_CartaoDeSalvar.vue`, `_AvisosDoMenu.vue`), usadas pelos dois modelos.
- **Fronteira:** muda o comportamento do menu lateral (arrastar, botão direito, recolher, ocultar). Não muda a ordem nem os itens do menu, as regras de encaixe da rodada 5, a barra do topo e o miolo da tela.
- **Descartado:** abrir a barra sozinha quando o mouse passa na borda, como o ClickUp faz. Motivo: é o pedido público contra a navegação de lá ("Disable Sidebar Expand on Hover"); quem recolheu quer a tela.
- **Descartado:** arrastar Trabalho, Dados e Configurações na trilha. Motivo: o ClickUp não deixa mexer no Home, e as três são a moldura; as seções do workspace mudam dentro dela.
- **Descartado:** ocultar Início e Categorias. Motivo: as seções padrão do ClickUp se reordenam mas não se escondem; sem Início não há para onde voltar.
- **Descartado:** "Arquivar" no botão direito, que o ClickUp tem. Motivo: arquivar categoria ou seção é configuração, não navegação.
- **Não deu:** abrir o ClickUp logado, como ela ofereceu. Por quê: esta sessão roda num contêiner na nuvem, sem o Chrome dela, e entrar pelo navegador do contêiner exigiria digitar senha (regra 2). A pesquisa saiu da central de ajuda oficial (`PESQUISA.md`, "Rodada 14"). A conferência à mão fica para uma sessão no app de desktop.
- **Não deu:** a verificação desta rodada foi num Chromium sem tela, dentro do contêiner, e não no Chrome dela (regra 2). Os prints saíram dali.
- **Maquete:** "Abrir em nova aba" (só toast). "Nova tela nesta seção" abre o editor com o formulário de tela, mas sem a seção já escolhida. Recolhido não sobrevive ao recarregar.
- **Crítica e acessibilidade:** a revisão de acessibilidade (WCAG 2.1 AA) achou e corrigiu: o `<aside>` se chamava "Configurações" e o `<nav>` se chamava "Início" para o leitor de tela (agora "Menu lateral" e "Navegação do workspace"); trocar de painel e recolher jogavam o foco no `<body>` (2.4.3), e agora ele vai para o primeiro botão do que entrou; linha e cabeçalho de seção não tinham anel de foco próprio (2.4.7); a estrela tinha 22 px (agora 24 px); o nome do cabeçalho de seção mudava com o estado ("Recolher X" / "Expandir X") e engolia selo e bolinha (agora o nome é o texto e o estado é o `aria-expanded`); Configurações bloqueada na trilha usava `disabled`, que tira o foco e esconde o motivo (agora `aria-disabled`); mover um item para outra seção não tinha caminho de teclado (2.1.1), e agora Shift+F10 abre o mesmo botão direito com "Mover para".
- **Crítica e acessibilidade (sem correção, e por quê):** contraste medido sobre o fundo da barra. Rótulo 8,91:1 (escuro 12,29), título de seção 7,96 (7,07), contador da seção 4,72 (4,98), texto apagado 4,53 (5,75): passam. **Não passam no claro:** estrela fixada e bolinha amarela, `warning` (amarelo 500) a 1,82:1 contra 3:1 (1.4.11), e o placeholder do filtro, 2,88:1. São cor do tema (cópia do `en-docs`) e a decisão é dela; o estado não depende só delas (estrela tem `aria-pressed` e preenchimento; bolinha tem rótulo e o cartão de salvar). Ícone ativo em `primary` dá 2,76:1 no claro, mas o ativo também é dito por fundo, peso e `aria-current`. A recusa "Seção não entra dentro de seção" aparece também quando quem é arrastado é um destino nativo: o texto é da rodada 5 e fica para ela decidir a redação. Arrastar continua sem anúncio para leitor de tela (4.1.3); o toast diz quando falha, não quando dá certo.
- **Ver:** `pnpm dev` → http://localhost:3000/menu-lateral · publicado em https://pernalombr4.github.io/prototipos/menu-lateral/ depois do merge na `main` · prints em `evidencias/rodada14-*.png`

### Linha paralela de 13/10/2026 (rodadas 14P a 17P)

Estas quatro rodadas foram feitas em outra conversa, ao mesmo tempo que as rodadas 14 a 19
acima, as duas partindo da rodada 13. Ficam registradas com o "P" para os números não
colidirem. O código delas foi substituído pelo desenho da rodada 19 na junção das duas
linhas, e as decisões que elas guardam foram reaplicadas por cima dele a partir da rodada 20.

### Rodada 17P · 13/10/2026

**O que ela pediu**, literal:

> "faça a mesma costura na barra única"

Era a pendência que a rodada 16 deixou escrita: na trilha o botão direito abria o menu do
produto, e na barra única abria o do navegador, para os mesmos objetos.

#### O mesmo menu, nos mesmos objetos

| Onde | O que o botão direito traz |
|---|---|
| Destino nativo (Início, Inbox, Tarefas) | Mover para cima, Mover para baixo, Copiar link, Personalizar o menu |
| Seção do workspace | Renomear, Mover, Copiar link, Personalizar o menu, Excluir |
| Tela dentro de seção do workspace | o mesmo da seção |
| Categoria e favorito | Fixar ou tirar dos favoritos, Copiar link, Configurar categoria |

**Duas diferenças em relação à trilha, e as duas vêm do modelo:**

1. Não existe "tirar da trilha": na barra única existe um lugar só.
2. **Destino nativo pode ser movido aqui**, porque nesta barra ele é um nó da árvore como
   qualquer outro, e reordenar o menu nativo é metade da proposta. O que ele continua não
   tendo é renomear e excluir, que é a regra do Teams.

**Categoria tem menu próprio** porque não é nó do menu: é dado. O que cabe ali é o que ela já
tem (o favorito, que era só a estrela no hover) mais o caminho para a configuração dela.

#### Sem um elemento a mais no desenho

O `UContextMenu` do Nuxt UI usa `as-child`: ele não embrulha a linha num `div` novo, funde-se
nela. Importava: um elemento a mais quebraria o `first:mt-0` das seções e as margens entre as
linhas. Conferido depois: arrastar pelo teclado continua movendo, o cartão acende e Descartar
devolve.

**A evidência:**
[`evidencias/proposta-botao-direito-barra.jpg`](evidencias/proposta-botao-direito-barra.jpg),
a seção do workspace na barra única com as seis linhas.

### Rodada 16P · 13/10/2026

**O que ela pediu**, literal:

> "clicando com botao direito num icone da trilha, o que acha que deve aparecer? implemente
> com base no que outros sisetmas fazem. pesquise."

A pesquisa está em [PESQUISA.md](PESQUISA.md), seção "Botão direito num ícone da trilha": Teams,
VS Code, Slack e Notion, com link para cada fonte. O padrão que os quatro repetem:

1. renomear vem primeiro;
2. tirar da barra não é excluir;
3. mover para cima e para baixo existe mesmo onde já se arrasta;
4. o que é de fábrica tem menu menor;
5. a última linha leva para a configuração da barra inteira.

#### O menu que ficou

| Item | O que faz | Vale para |
|---|---|---|
| Renomear | abre a camada do menu com a seção aberta para editar | seção |
| Tirar da trilha / Pôr na trilha | troca o `lugar` entre a trilha e o painel de Dados | seção |
| Mover para cima / para baixo | o mesmo que Alt mais as setas | seção |
| Copiar link | copia o caminho da área | todas |
| Personalizar o menu | abre a camada do menu na árvore | todas |
| Excluir | apaga a seção e as telas dela | só do workspace |

**Área nativa tem menu de duas linhas**: copiar link e personalizar o menu. É a regra do Teams,
onde o que vem de fábrica não se desafixa nem se exclui. Verificado: `Trabalho` mostra duas
linhas, `Conhecimento` mostra as seis.

**"Tirar da trilha" não apaga nada**, e é a diferença que a pesquisa mais insiste. Verificado:
o ícone sai da trilha e a seção aparece inteira dentro do painel de Dados. Descartar devolve.

#### O menu de contexto é a porta discreta do editor

Na rodada 12 ela mandou tirar o botão "Editar menu" do meio da barra. A pesquisa explica por
que nenhum dos quatro tem botão assim: a porta do editor vive no botão direito, na última
linha. É o "Personalizar barra de aplicativos" do Teams e o "criar seção" do Slack. Agora o
ENSPACE tem a mesma porta, e ela não ocupa um pixel da barra.

#### Renomear virou edição de verdade

O formulário só sabia criar. Agora ele abre preenchido com o que o nó tem, e salvar grava por
cima: nome, ícone, escopo, lugar na trilha e, no menu, o tipo. O título da camada vira
"Editar \<nome\>", e a moldura continua a mesma da rodada 15.

#### Um buraco que a rodada abriu, e fechou

O botão direito mexe no rascunho, e **no modelo de trilha não havia onde salvar**: o cartão
flutuante só existia na barra única. Dá para tirar da trilha, mover e excluir, e não havia
como gravar nem desfazer. O cartão passou a existir nos dois modelos, com os dois alcances.

**A evidência:**
[`evidencias/proposta-botao-direito-trilha.jpg`](evidencias/proposta-botao-direito-trilha.jpg).

#### Fica em aberto

- ~~**O mesmo menu na barra única.**~~ Feito na rodada 17.
- **Renomear no menu, e não só na seção.** O formulário já edita menu; falta a porta, que no
  modelo de trilha fica no painel, não na trilha.

### Rodada 15P · 13/10/2026

**O que ela pediu**, literal:

> "voce deve explorar todos os comportamentos do botao '+' na trilha. quando eu clicar deve
> aparecer o modal representando o que deve ocorrer ali."
>
> "ha inconsistencias no modelo de modal que aparece ao botar pra personalizar o menu ou ao
> botar pra criar seçao ou criar menu/item de menu. unifique a ideia. deixe tudo mais
> organizado ali. realmente os botoes de criar devem cortar caminho, mas deve haver
> consistencia entre os modais utilizados."

#### O que estava inconsistente

| | Personalizar o menu | Criar seção ou menu | Criar item, tarefa, categoria |
|---|---|---|---|
| Antes | modal largo, cabeçalho próprio, rodapé com contexto e dois botões | **outro** modal, mais estreito, por cima do primeiro, com outro rodapé | nada: um toast dizendo que abriria |

Dois modais empilhados para o mesmo assunto, com duas molduras diferentes na mesma tela. E
três portas do "+" que prometiam e não entregavam.

#### Uma camada, duas etapas

A criação deixou de ser um modal em cima do outro. Agora é **a mesma camada**, que mostra ou
a árvore ou o formulário:

- o título e a linha de apoio trocam de texto, não de lugar;
- a barra de ações do topo é "Nova seção / Novo menu" na árvore e "Voltar para o menu" no
  formulário, sempre na mesma posição;
- o rodapé tem a mesma geometria nas duas: contexto à esquerda, saída e ação à direita.

**O atalho continua cortando caminho**: quem escolhe "Novo menu" no "+" cai direto na etapa do
formulário, e quem quiser ver o menu inteiro clica em "Voltar para o menu". O que mudou é que
cortar caminho não significa mais abrir outra moldura.

#### As cinco portas do "+", todas com modal

| Opção | O que abre |
|---|---|
| Item em uma categoria | camada com os campos que a categoria pede |
| Tarefa | camada com título, responsável, prazo e descrição |
| Categoria | camada com nome, ícone, descrição e formulários |
| Seção de menu | a camada do menu, na etapa do formulário de seção |
| Novo menu | a camada do menu, na etapa do formulário de menu |

As três primeiras são **maquete declarada**: a camada diz isso num aviso, o rodapé repete que
a tela é de outro lugar do ENSPACE, e o botão de criar não salva nada. Elas existem porque o
"+" promete que alguma coisa acontece, e toast não é promessa cumprida. Os campos são os que o
produto pede, para a camada mostrar o tamanho do caminho que o atalho corta.

Isso vale para o "+" da trilha e para o "+" da barra do topo: é o mesmo menu nos dois.

#### A regra da moldura, agora escrita

Toda camada de trabalho desta tela usa a mesma: `max-w-3xl`, título mais uma linha de
descrição no cabeçalho, e rodapé com contexto à esquerda e duas ações à direita, saída antes
da ação. "Todas as categorias" entrou na regra.

**Uma exceção, de propósito:** "o menu nativo de hoje" continua estreito. Ele é uma réplica
da barra lateral em tamanho real, e numa moldura larga a réplica boiaria no vazio. Moldura
serve ao conteúdo; igualar por igualar seria o contrário da organização que ela pediu.

**As evidências:**
[`evidencias/proposta-mais-da-trilha.jpg`](evidencias/proposta-mais-da-trilha.jpg), o "+" da
trilha com as cinco portas, e
[`evidencias/proposta-camada-unica.jpg`](evidencias/proposta-camada-unica.jpg), a camada do
menu na etapa do formulário, com o caminho de volta e o rodapé único.

### Rodada 14P · 13/10/2026

**O que ela pediu**, literal:

> "telas nao devem ser apresentadas separadamente de menus. na hora de criar um menu,
> seleciona-se o tipo de menu ali. esse 'tipo de menu' é justamente a tela. aí já se cria uma
> tela vinculada a um menu automaticamente. pra facilitar a jornada do usuario. hoje ta muito
> ruim."

#### O produto de hoje tem duas portas

| Passo | Onde | O que a própria doc avisa |
|---|---|---|
| 1. Criar a tela | `Interface > Telas` | tela fora do menu "não aparecerão para os membros do workspace" |
| 2. Criar a seção e o item | `Interface > Menus` | "As telas precisam ser criadas" antes |

Duas portas, ordem obrigatória e um estado morto no meio: a tela que existe e ninguém vê.

#### O que mudou aqui

| Antes | Agora |
|---|---|
| `+ Criar > Novo item de menu` | `+ Criar > Novo menu` |
| Editor: `Adicionar item` | Editor: `Novo menu` |
| Campo `Tipo de tela` | Campo **`Tipo de menu`**, com a frase "O tipo é a tela que abre quando alguém clica neste menu" |
| `Configurações > Interface > Telas` | **saiu**: sobrou `Menus` |
| "Item é uma tela dentro de uma seção" | "O menu é a tela" |

A prévia do formulário passou a mostrar as duas metades do que está sendo criado: a linha como
ela fica no menu e, embaixo, o que abre ao clicar.

**A mecânica já estava certa desde a rodada 3**, quando ela pediu que criar menu pedisse o
tipo de tela. O que faltava era parar de chamar de duas coisas o que é uma só, e fechar a
porta paralela.

#### As três decisões que ela tomou

1. **`Telas` some de vez** das configurações. Não vira lista de órfãs nem inventário
   somente-leitura.
2. **Excluir o menu apaga a tela, sem confirmação.** Palavras dela: "as duas coisas sao
   unificadas. nao precisa ficar confirmando pq nao vai ter forma de GUARDAR separado".
3. **Sem reuso**: cada menu tem a sua tela. Duplicar o menu cria outra tela, independente.

#### Por que excluir sem perguntar funciona aqui

Excluir mexe no RASCUNHO, como arrastar: a linha some, a bolinha amarela acende, o cartão
flutuante aparece e **Descartar devolve**. Perguntar "tem certeza?" para uma ação que já tem
volta é só mais um clique. Verificado no navegador: excluir "Políticas internas" tira a linha,
o rodapé do editor passa a "Menu alterado", e Descartar traz de volta.

O botão só aparece onde faz sentido: **seção e tela do workspace**. Nativo e de módulo não
se exclui daqui, porque não nasceram aqui. `Auditoria`, que é nativa, mostra só o "+";
`Conhecimento`, que é do workspace, mostra os dois, e as telas dentro dela também.

#### Dois defeitos que esta rodada revelou

- **O menu criado nascia sem origem**, então contava como nativo e não podia ser excluído.
  Quem nasce no formulário é do workspace.
- **O editor quebrava inteiro** quando eu pôs `immediate` no watch que abre o formulário: ele
  roda no meio do `setup`, antes de a lista de seções existir. Virou `onMounted`, que é o
  lugar certo para "o componente nasceu já aberto". Era o que fazia `+ Criar > Novo menu`
  abrir o editor sem o formulário.

**A evidência:** [`evidencias/proposta-menu-e-tela.jpg`](evidencias/proposta-menu-e-tela.jpg).
O formulário "Novo menu" com o campo Tipo de menu, a frase que diz o que ele é, e a prévia
mostrando as duas metades: a linha dentro de Análise e, embaixo, o que abre ao clicar.

#### Fica em aberto

- **Tela do workspace dentro de seção nativa não some no modo "Só nativo".** O filtro de
  origem roda no primeiro nível; o "Painel de contratos" criado dentro de `Análise` continua
  aparecendo. Conserto maior do que parece: mexer na lista de filhos quebra a identidade dos
  nós que o arraste e os selects usam.
- **O que acontece com as telas que os clientes já têm fora do menu**, quando `Telas` sumir.
  Decisão de migração, não de desenho.


### Rodada 13 · 20/09/2026

**O que ela disse**, literal:

> "ta muito pesado qudno entro. tudo travando. tente refatorar pra deixar mais leve sem
> perder o que ja tem la"

Fui medir antes de mexer, e a maior parte do peso **não estava no protótipo**. Vale escrever
os números, porque a conclusão muda o que fazer.

#### O que estava travando de verdade

**O servidor de desenvolvimento estava com 1,58 GB de memória.** É o mesmo processo `node` do
`pnpm dev`, rodando havia horas, acumulando recompilação a cada arquivo que eu salvava. Com
ele nesse estado:

| Medida | Antes | Depois de reiniciar |
|---|---|---|
| Primeira resposta da página | 17,8 s | 0,19 s |
| Resposta com o servidor quente | 2,5 s | 0,45 s |
| Tela pronta no navegador | não chegava a responder | 0,34 s a 0,73 s |

Reiniciei o servidor. **Quando ele voltar a ficar pesado, é só parar e subir de novo**, e o
sintoma some:

```bash
pnpm dev
```

**A segunda causa é do Nuxt em desenvolvimento, e não tem conserto daqui:** a primeira vez
que se entra em CADA rota, o servidor compila aquela rota inteira na hora. Medido hoje, com o
servidor limpo: `/` levou 5 s na primeira vez e 0,3 s na segunda;
`/configuracoes-do-sistema`, 32 s e 0,67 s. Depois da primeira entrada, todas ficam rápidas.

#### O que deu para tirar do protótipo

**As três camadas só nascem quando alguém as abre.** "Ver todas", "o menu de hoje" e o editor
eram construídos na entrada, fechados, todas as vezes. Agora a página entra com zero janelas
montadas, e cada uma passa a existir na primeira vez que é aberta (e fica, para a animação de
saída continuar existindo).

**A pergunta "tem coisa para salvar?" deixou de serializar o menu inteiro.** Ela é feita em
toda renderização da barra, e respondia comparando o texto JSON das duas árvores, duas vezes.
Agora quem responde é a lista de linhas tocadas, que já existia para a bolinha amarela: quem
mexeu em alguma coisa está na lista, e ninguém mexe sem passar por lá.

De quebra consertou um exagero: escolher "Personalizada" no menu de ordenação acendia a barra
de salvar, e a decisão da rodada 6 diz que trocar o critério vale na hora. Agora só acende
quando alguém arrasta.

**A barra de andaime perdeu o `backdrop-blur`.** Uma faixa desfocada da largura da tela obriga
o navegador a recompor a página inteira a cada repintura, e isso é sentido como travada. O
fundo já era 95% opaco: ninguém vai notar a diferença, e ela também escondia menos.

#### O que eu tentei e desfiz

**Trazer pedaços por `import()` sob demanda** (o modelo de trilha, o painel de configurações,
as telas do miolo, e os quase 100 KB dos três `.md` que alimentam os botões "O problema / As
referências / As decisões").

Em produção isso seria certo. Em `pnpm dev` é **pior**, e dá para ver acontecendo: o servidor
só compila o pedaço na hora em que alguém pede, então o primeiro clique em "Trilha e painel"
deixava a barra **em branco** esperando, e um pedido de módulo novo chegou a segurar o
navegador por mais de 45 segundos. Trocar uma entrada mais leve por um clique pendurado, num
protótipo que existe para ser demonstrado, é mau negócio.

Ficou o que não depende de compilar nada na hora do clique.

#### Nada mudou na tela

Conferido no navegador depois da refatoração: o menu desenha igual, arrastar acende o cartão
com a bolinha, Descartar devolve a ordem, as três camadas abrem, o editor abre pelo "+" e a
barra entra com **zero** janelas montadas, contra três antes.

### Rodada 12 · 17/09/2026

**O que ela pediu**, literal:

> "esse botao editar menu ta horrivel. tire ele. simplesmente os elementos do menu devem ser
> reordenaveis, agrupaveis... etc. drag and drop e outras funçoes ativadas automaticamente
> ali. mas na hora que o user mover O PRIMEIRO, deve aparecer em algum lugar um toast ou algo
> do tipo dizendo que tem alterações nao salvas, com indicativo visual de bolinha amarela onde
> foi alterado e o botao flutuante de salvar pra todos os usuarios ou só alterar localmente."

O botão saiu. E ela tem razão no princípio: **não existe "modo de edição"**. O menu é editável
o tempo todo, e o que aparece é a **consequência** de ter mexido, não a permissão para mexer.

#### O que está ligado ali, sem porta nenhuma

| Gesto | O que faz |
|---|---|
| Arrastar uma linha para cima ou para baixo | Reordena |
| Arrastar uma linha para **o meio** de uma seção | Agrupa: ela entra na seção |
| Arrastar para fora, entre dois de primeiro nível | Desagrupa |
| Arrastar um cabeçalho de seção | Move a seção inteira |
| Alt com as setas | O mesmo, sem mouse |

A seção de uma tela só, que na rodada 10 virou linha simples, **voltou a aceitar que soltem
dentro dela**: senão agrupar naquela seção seria impossível na barra. Ela usa terços, como o
cabeçalho de seção: bordas reordenam, meio agrupa.

#### A bolinha amarela é "isto aqui foi você"

Guardo os ids que a pessoa **mexeu**, em vez de comparar as duas árvores e deduzir o que está
diferente. Comparando, um arraste só deixaria amarelo também todo mundo que andou de lugar por
tabela, e metade do menu ficaria marcada. A bolinha marca o gesto, não o efeito colateral.

Verificado: mover um item deixa **uma** bolinha, na linha movida.

#### O toast, uma vez

Dispara na **primeira** mexida de cada sessão de edição, e não a cada arraste: depois dela o
cartão flutuante fica na tela o tempo todo, e repetir o aviso seria barulho. O texto diz a
coisa que tira o medo: "Arraste o quanto quiser. Nada muda para ninguém até você salvar."

#### Salvar para todos, ou só para mim: são duas camadas de verdade

Não são dois rótulos do mesmo botão. O `estado.ts` passou a ter duas camadas:

| Camada | O que é |
|---|---|
| `aoVivo` | o menu **publicado**, que todo o workspace vê |
| `pessoal` | o **meu** menu, por cima daquele, quando eu arrumei só para mim |

A barra desenha o rascunho, e o rascunho nasce do meu menu se eu tiver um, senão do menu do
workspace. **Publicar joga a cópia pessoal fora**, de propósito: o que eu publiquei virou o de
todos, inclusive o meu.

Quem tem um menu só seu vê isso dito, no fim da lista, com a saída ao lado: "Este menu é só
seu" mais o botão de voltar ao do workspace. Menu pessoal sem caminho de volta seria uma
armadilha, e essa linha aparece **só quando existe**, ao contrário do botão que ela mandou
tirar.

**"Salvar para todos" só aparece para quem pode configurar.** Quem não pode enxerga um botão
só, "Salvar só para mim", e é o que sustenta a regra da rodada 11: o arraste da árvore pede
permissão, o das categorias não, e agora existe onde guardar o resultado de quem não pode
publicar.

#### O que foi verificado no navegador

- Mover um item: toast aparece, **uma** bolinha amarela na linha movida, cartão flutuante com
  os três caminhos.
- "Salvar só para mim": toast "Menu salvo só para você", cartão e bolinha somem, a linha
  "Este menu é só seu" aparece.
- "Voltar ao do workspace": a ordem publicada volta, e o aviso some. **É a prova de que as duas
  camadas são reais**, e não dois textos diferentes para a mesma gravação.
- "Salvar para todos": toast do workspace, e nenhuma linha de menu pessoal.
- Em "Sem permissão", o cartão mostra só "Salvar só para mim" e "Descartar".

**O que não consegui verificar daqui:** o gesto de arrastar com o mouse. Arraste HTML5 nativo
não se dirige por script, e o caminho que ele usa é o mesmo do teclado e o mesmo do editor,
que estão verificados. É limitação do teste, não do código.

**A evidência:** [`evidencias/proposta-salvar-com-alcance.gif`](evidencias/proposta-salvar-com-alcance.gif).
Mover uma linha, a bolinha amarela nela, o toast, o cartão flutuante, o "Salvar só para mim" e
a linha "Este menu é só seu" que aparece no fim da lista depois disso.

#### O que sobrou do editor

O editor em camada continua existindo, e continua sendo onde se **cria** (seção nova, tela
nova, tipo de tela) e onde as regras de encaixe explicam a recusa por escrito. Ele se abre por
`Configurações > Interface > Menus`, pelo "+" e pela busca geral. O que sumiu foi a linha fixa
no meio da barra.

### Rodada 11 · 17/09/2026

**O que ela pediu**, literal:

> "nao ta claro pro user ainda onde ele vai pra EDITAR os menus, porque o arraste nao ta
> liberado ao vivo direto no menu, so quando vai adicionar um novo"

Ela está certa nas duas metades, e a segunda metade merece uma correção de fato: **o arraste
ao vivo existia desde a rodada 5**, só que sem aviso nenhum. Quem não tentasse arrastar por
conta própria não descobria que dava. Funcionalidade que ninguém vê é funcionalidade que não
existe, então na prática o diagnóstico dela estava certo: não estava liberado, porque não
estava visível.

#### A pega de arraste, no hover

Cada linha e cada cabeçalho de seção mostra a **pega** (`⫴`) quando o mouse passa. Ela
aparece **no lugar do ícone**, não ao lado: assim o rótulo não anda meio pixel para o lado a
cada hover, que é o defeito da pega que "abre espaço". Notion, Linear e ClickUp fazem igual.

Quem usa teclado continua com Alt mais as setas, que existe desde a rodada 5.

#### A porta do editor, na própria barra

> **Revogado na rodada 12.** A linha "Editar menu" saiu: "esse botao editar menu ta horrivel.
> tire ele". O que ficou desta rodada é a pega de arraste e a entrada pela busca. A leitura
> dela é melhor: o menu não precisa de porta, precisa de estar editável.

O editor só aparecia por dois caminhos, e os dois eram tortos:

1. `Configurações > Interface > Menus`, que é fundo de gaveta;
2. o botão "+", que é para **criar**, não para arrumar o que já existe.

Agora existe **"Editar menu"**, uma linha no fim da própria lista, que é onde o ClickUp, o
monday e o Slack põem o "customizar barra". A dica dela diz a outra metade da história:
"Arraste aqui mesmo para reordenar. No editor você agrupa, cria e escolhe o tipo de cada
tela." Ou seja: a linha ensina que o arraste existe, mesmo para quem nunca passar o mouse
sobre uma linha do menu.

A mesma porta responde na **busca geral**: digitar "menu" traz `Editar menu` junto com
`Configurações > Menus`.

**O que fica em aberto:** com módulos e seções do workspace ligados, a lista rola, e a linha
fica abaixo da dobra. Pus no fim da lista porque é o padrão de mercado e porque o rodapé é
fixo e já está ocupado por Configurações e pela ajuda. Se você preferir permanente, o lugar
seria o rodapé, e aí ele volta a ter duas linhas.

**A evidência:** [`evidencias/proposta-porta-do-editor.gif`](evidencias/proposta-porta-do-editor.gif).
A pega aparecendo no hover, a linha "Editar menu" no fim da lista e o editor abrindo por ela.

#### Um erro que esta rodada revelou

**Quem não pode configurar estava arrastando o menu.** No estado "Sem permissão", as linhas
continuavam arrastáveis, a barra "Menu alterado" acendia e o Salvar aparecia, para uma pessoa
que não pode mudar o menu de ninguém.

Agora o arraste do MENU pede permissão, e o das CATEGORIAS não. Não é detalhe: a ordem das
categorias é preferência de quem usa, decidida na rodada 6, e continua livre para todo mundo.
Medido no navegador: em "Sem permissão" sobram exatamente as cinco categorias arrastáveis, e
nada da árvore; no estado normal, dezoito.

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

**A evidência:** [](evidencias/proposta-auditoria-e-abertura.gif).
Clicar em AUDITORIA abre a lista e já abre os Logs de auditoria; clicar em Correção
monetária, que tem uma tela só e por isso nem tem seta, abre a Calculadora avulsa.

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

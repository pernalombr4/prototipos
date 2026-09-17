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
| Linhas, workspace medido no develop (1 categoria) | **36** | 12 |
| Linhas com 8 categorias | 43 | **17** |
| Linhas com 40 categorias | 75 | **17** |
| Níveis | 3 | **2** |
| Linhas de administração no menu de trabalho | 19 | **1** (a porta) |
| Teto da lista de categorias | nenhum | **5 mais os favoritos** |

As contas de "hoje": 36 linhas foram medidas no develop com uma categoria, e cada categoria
com menu automático soma uma linha (36 menos 1, mais N). As da proposta contam o que a tela
renderiza: 4 destinos, Favoritos com cabeçalho e 3, Categorias com cabeçalho, 5 e o "ver
todas", mais 2 cabeçalhos de seção do workspace recolhidos, mais Configurações e Ajuda no
rodapé.

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
padrão porque é o que faz o recorte de seis acertar sem ninguém configurar nada.

### 5. Formulário vira aba, não terceiro nível

**O que muda:** `Categorias › leve › Todos` deixa de existir. Ao abrir uma categoria, os
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
só não a usa no próprio menu. O `✦` ao lado do nome diz que a seção é do workspace.

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

Os 33 itens de hoje, onde cada um foi parar. Nenhum sumiu.

### Membro

| Hoje | Proposta |
|---|---|
| Início | Início, destino solto, mesma posição |
| Spaceflows | Spaceflows, destino solto, mesma posição |
| Categorias | Seção `Categorias`, com teto de 6 mais favoritos |
| Categorias › *cada categoria* | Item nível 2 da seção, ou da seção `Favoritos` |
| Categorias › categoria › Todos | **Aba `Todos`** na tela da categoria |
| Categorias › categoria › *formulário* | **Aba por formulário** na tela da categoria |
| Tarefas | Tarefas, destino solto |
| Tarefas › Agendadas | **Aba** dentro de Tarefas |
| Tarefas › Rápidas | **Aba** dentro de Tarefas |
| Agenda | Agenda, destino solto |
| *seção personalizada* | Seção igual às nativas, com `✦` |

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
- os seis estados do andaime, incluindo vazio, carregando, erro e sem permissão.

## O que é maquete

Declarado, conforme a regra 10:

- **o miolo da direita**, fora das abas da categoria. Os números, as linhas e o esqueleto são
  ilustrativos: o que está sendo proposto é a navegação da esquerda (regra 19);
- **`Criar`** e **`Ajuda`** abrem um toast dizendo que são maquete, em vez de fingir um menu;
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

5. **Seção do workspace devia poder nascer aberta?** Hoje `Interface › Menus` tem nome,
   ícone, ordem e grupos permitidos. Faltaria um "começa aberta" para o administrador
   decidir o que a equipe vê de cara. É campo novo, então não inventei.

---

## Rodadas

### Rodada 1 · 16/09/2026

**O que ela pediu**, literal:

> "o menu do enspace na lateral esquerda é muito cheio e confuso. se eu tiver muitas
> categorias entao... piorou. mesmo sem menus personalizados so os nativos ja sao muitos.
> todo mundo se confunde" — "a ideia de produtos é fazer um menu em 2 níveis pro enspace."

**O que foi feito:** a proposta inteira acima, com os seis estados, a comparação lado a lado
com o menu medido no develop, e o de-para dos 33 itens.

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

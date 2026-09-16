# Decisões — Configurações do Sistema

## Rodada 6 — 16/09/2026 — o seletor de ícone para 50 mil

**O que ela pediu, literal:**

> "quando o user clicar em adicionar icone tem que renderizar um seletor que seja capaz de cobrir
> nosso caso de uso. isso porque temos uma biblioteca com mais de 50 mil icones. pense em como
> fazer e aplique"

### Primeiro procurei, depois escrevi

O protótipo vizinho `tela-de-workspaces` resolveu isso na rodada 13 dele, horas antes: busca como
navegação, grade virtualizada e biblioteca lida do pacote instalado. Reescrever do zero seria
retrabalho e, pior, daria ao ENSPACE dois seletores de ícone diferentes.

Então o seletor virou **componente compartilhado**, que é o degrau 4 da escada da spec:
`app/components/ux/UxSeletorDeIcones.vue`, registrado no
[`COMPONENTES-CUSTOM.md`](../../../COMPONENTES-CUSTOM.md).

### As três decisões que fazem 50 mil caber numa caixa

1. **A busca é a navegação.** Sem busca, a tela não mostra a biblioteca: mostra uma **curadoria**
   de 48 ícones que resolve o caso comum em um clique, mais atalhos por assunto (Jurídico,
   Pessoas, Finanças, Operação, Tecnologia, Saúde). Quem precisa de mais, digita.
2. **A grade é virtualizada.** Só as linhas visíveis existem no DOM. Medido no navegador:
   **busca por "e" devolve 1.526 ícones e coloca 101 botões na tela.** Com 50 mil o número de
   botões seria o mesmo; o que cresce é a barra de rolagem.
3. **A busca entende português e ignora acento.** Quem digita `balanca` acha `scale`. Testado.
   Hoje o produto só acha pelo slug em inglês, o que obriga a saber como o ícone se chama em
   outro idioma antes de procurá-lo.

### Como entra na tela

O tile do logo abre o popover, e "Escolher ícone" abre o seletor em camada. Escolher troca o
ícone na hora, a aba marca pendência e a barra de baixo oferece Salvar. O produto guarda o nome
no formato do iconify (`colecao:nome`), então a coleção entra e sai na borda do componente.

### O que é maquete aqui

- **A biblioteca do protótipo tem 2.128 ícones, não 50 mil**: são os do Lucide que existem
  offline neste repositório. O que se prova com eles é o comportamento em escala (virtualização,
  busca como navegação), que é o que muda de figura quando o número cresce.
- **No produto o índice não vem no bundle.** Aqui ele é um arquivo gerado; lá seria consulta ao
  servidor de ícones, com paginação e busca do lado do servidor. O desenho da tela não muda.
- **"Enviar imagem" continua sem abrir nada.** Upload é outra rodada.

---

## Rodada 5 — 16/09/2026 — dicionários com 14 mil chaves

**O que ela pediu, literal:**

> "saiba tambem que o dicionario ainda ta ruim.
>
> voce fez esse modelo e serve pra poucos campos. tenho um workspace hoje que chega a ter 14 mil
> chaves de traduçao. no seu modelo atual, sem nada ser colapsado/expansivel, é insano. seria um
> scroll infinito. como resolver isso? como outros produtos resolvem? pesquise no mercado e
> depois volte com soluçao de interface, ok?"

**Ela está certa, e o erro é de fundo.** A rodada 1 trocou a árvore por uma fila com filtro, o
que resolvia "me perco na árvore" e não resolvia "são 14 mil". Com o filtro em "faltam", a tela
renderizava **tudo o que o filtro devolvesse**: 9 mil linhas com um campo de texto em cada.

### A pesquisa

Está em [`PESQUISA.md`](PESQUISA.md), "Rodada 5 — traduzir 14 mil chaves". O que **Crowdin**,
**Weblate** e **Lokalise** fazem igual:

1. **Ninguém renderiza o conjunto inteiro.** Navega-se por container (arquivo, componente,
   pasta). No Crowdin, "All Strings" é um botão explícito, não o estado inicial. No Weblate, o
   componente abre em fatias: não traduzidas, inacabadas, com erro.
2. **A lista é paginada em dezenas.** Crowdin usa 50 por página; Lokalise troca para paginação
   por cursor acima de 5 mil.
3. **O filtro por status é o começo do trabalho**, não um refinamento.
4. **Existe um modo de fila**: uma string por vez, teclado, avanço automático ao salvar. É o
   "Zen mode" do Weblate e o "Automatically move to next string" do Crowdin.
5. **Ação em massa sobre o filtro**, para o que dá para resolver sem olhar uma a uma.

### A solução: três níveis, e a tela nunca mostra 14 mil

| Nível | O que aparece | Quantas linhas |
|---|---|---|
| **1. Visão geral** | as 18 categorias com progresso, e o que falta em cada uma | 18 cartões, **nenhuma chave** |
| **2. Recorte** | as chaves de uma categoria, ou o resultado de uma busca | **50 por página** |
| **3. Fila** | uma chave por vez, com contexto e teclado | **1** |

- **A tela abre no nível 1.** Sem categoria escolhida e sem busca, o universo é vazio de
  propósito: não existe caminho que liste 14 mil chaves por acidente.
- **A busca global cai no nível 2**, como no Weblate: buscar é recortar, e o recorte já é a fila.
- **Os grupos (Geral, Campos, Formulários) viraram filtro**, com a contagem no próprio botão, em
  vez de sanfona. Sanfona com 1.196 itens dentro empurra a página inteira para baixo.
- **A fila é o coração da proposta.** `Enter` salva e traz a próxima, `Esc` sai, e a chave
  traduzida sai da fila na hora, então o contador anda para trás enquanto o progresso anda para
  frente. É como se atravessa 9 mil chaves sem nunca ver 9 mil linhas.
- **A IA em massa mostra o preço antes**: "traduzir 9.036 chaves custa 1.808 en-credits", com
  link para o saldo. E age sobre o recorte atual, não sempre sobre tudo.

### O mock passou a ter o tamanho do problema

São **13.970 chaves** geradas por fórmula, em 18 categorias, com distribuição desigual de
progresso (algumas completas, uma pela metade, muitas intocadas). Sem isso, a solução não se
prova: era exatamente o tamanho que derrubava o desenho anterior.

**Medido no navegador, com as 13.970 no ar:** trocar de categoria, paginar, filtrar e digitar
na fila respondem na hora. A tradução em massa de **9.036 chaves** levou pouco mais de um
segundo (o tempo é a espera fingida da IA), e o **Descartar** devolveu as 9.036 ao estado salvo
em cerca de 140 ms.

### O que mudou por baixo, e por que importa

O estado das traduções saiu do `form` e virou store próprio no `estado.ts`, por um motivo
concreto: a pendência era calculada com `JSON.stringify` da fatia da aba, e com 14 mil chaves
isso significaria serializar 14 mil textos **a cada tecla digitada**. Agora cada chave se
observa sozinha (`shallowReactive`), e os números que a tela mostra (total preenchido, progresso
por categoria, quantas mudaram) são mantidos de forma incremental, na hora da edição.

### O que não fiz

- **Não implementei rolagem virtual.** Ela adiaria a decisão de navegação em vez de tomá-la, e
  exigiria biblioteca fora do Nuxt UI. A paginação de 50 é o que o Crowdin faz, e resolve.
- **Não trouxe "traduzido / aprovado" em dois estágios.** É vocabulário de tradução profissional;
  quem traduz aqui é quem configurou o workspace.
- **Importar e exportar planilha continuam maquete** (os botões não abrem nada). Para 14 mil
  chaves, essa é provavelmente a estrada principal de quem traduz em lote, e merece uma rodada
  só dela.

---

## Rodada 4 — 16/09/2026 — identidade em forma de perfil

**O que ela pediu, literal:**

> "em vez de "marca" o nome do campo que define imagem ou ícone deve ser "Logo"
>
> me questiono tambem se esse bloco nao poderia ter mais cara de "perfil", numa ordem um pouco
> mais logica de hierarquia que o pessoal ja ta acostumado na hora de definir identidade da
> organizaçao em sistemas como hubspot e outros de gestao empresarial.
>
> o que acha? pode rodar mais uma pesquisa antes de opinar, se precisar"

### "Marca" volta a ser "Logo"

Na rodada 1 eu troquei "Tipo de Logo" por "Marca" e registrei como divergência de nome, com o
argumento de que o campo guarda ícone *ou* imagem e "logo" seria só um dos casos. **Argumento
fraco:** ícone e imagem são as duas formas do logo, não duas coisas diferentes. O produto já
dizia "Logo", as pessoas já chamam de logo, e a linha da tabela de divergências foi removida.

### A pesquisa, antes de opinar

Rodei os quatro e está em [`PESQUISA.md`](PESQUISA.md), em "Rodada 4 — identidade como perfil".
O resumo: **Slack** edita um bloco chamado "Name, domain, and icon"; **Linear** fala em
"workspace logo, name and URL"; **Notion** lista Name, Icon, Domain e faz do próprio ícone o
controle; **HubSpot** separa "Company Information" de "Account Defaults" (idioma, fuso, moeda).

Os quatro concordam em três coisas, e as três contrariavam o meu bloco:

| O que eles fazem | O que eu tinha feito |
|---|---|
| logo + nome + identificador **juntos**, no topo | logo em quarto lugar, depois da descrição |
| o **logo é o primeiro elemento** e ele mesmo é o controle | um campo "Marca" com prévia, segmentado e botão, em linha |
| **idioma não mora na identidade** | idioma era o último campo do cartão de Identidade |

### O que mudou

1. **O bloco virou perfil:** o logo (64 px, com o lápis no canto) à esquerda, e **Nome** e
   **Referência** empilhados ao lado dele. Descrição embaixo, na largura inteira.
2. **O logo é o controle.** Clicar no símbolo abre a escolha (Ícone ou Imagem) e o botão de
   trocar. O campo "Marca", com prévia, segmentado e botão soltos na linha, deixou de existir:
   eram quatro pesos diferentes para uma decisão que quase ninguém revisita.
3. **"Idioma padrão" saiu da Identidade.** Identidade é quem o workspace é; idioma é padrão de
   comportamento, e o HubSpot separa as duas coisas.
4. A busca de configuração agora acha "Logo do workspace" por `marca`, `ícone`, `símbolo` e
   `avatar`.

### Correção no meio da rodada

Enquanto eu montava, chegou:

> "nome e referencia devem ficar lado a lado, em metade do tamanho, e descriçao abaixo
>
> e o campo idioma padrao nao tem que estar dentro de comportamento da interface. deve haver uma
> sessao de account defaults como é no hubspot.
>
> pode botar idioma, fuso e moeda tambem"

Nas duas ela estava certa, e a segunda corrige um atalho meu: eu tinha jogado o idioma dentro de
"Comportamento da interface" para não criar um cartão com uma linha só. Com fuso e moeda ao
lado, o cartão tem três campos e o problema deixa de existir.

5. **Nome e Referência lado a lado**, metade da largura cada, ao lado do logo. **Descrição
   embaixo**, na largura inteira.
6. **Seção nova: "Padrões do workspace"**, com **idioma, fuso horário e moeda** em três colunas.
   Três campos do mesmo tipo pedem grade de campos, não linha de ajuste: cada um ocupa um terço e
   a seção não fica com meia largura vazia.
7. O idioma voltou a ter a ressalva visível ("o que **você** criou se traduz em Dicionários"),
   com o link para a aba. Em campo de formulário isso cabe na ajuda, sem precisar do "?".

**O nome da seção.** O HubSpot chama de "Account Defaults", e eu escrevi **"Padrões do
workspace"**, não "Padrões da conta": no ENSPACE, conta é a da pessoa (tem Painel do Usuário e
carteira própria), e a auditoria já registrou que confundir workspace com pessoa é uma das
fricções desta tela (S3-F5). O padrão é o mesmo; o substantivo é o que existe aqui.

**Fuso e moeda não existem no produto hoje.** São proposta, e estão marcados como invenção no
`mocks.ts`. A moeda tem precedente na API, que já enumera BRL, USD, EUR e ENCOIN no schema de
carteira; o fuso não tem nada, e hoje toda data do workspace depende do fuso do navegador de
quem olha.

### O que não fiz

- **Não trouxe o vocabulário de empresa do HubSpot** (endereço, indústria, receita). Um workspace
  do ENSPACE não é uma empresa, é um espaço de trabalho dentro dela.
- **Não desfiz a grade de duas colunas** de Comportamento e Módulos. Ela resolveu o vazio da
  rodada 2 e continua valendo com a seção nova acima.

---

## Rodada 3 — 16/09/2026 — a zona de perigo volta a gritar, e a linha emagrece

**O que ela pediu, literal:**

> "a seçao de excluir workspace era interessante ser chamada de ZONA DE RISCO/DANGER ZONE em
> ingles
>
> chama mais atençao. precisamos realmente chamar atençao como é hoje já. com ícone, vermelho,
> fundo levemente destacado diferente...
>
> alem disso, as opçoes aqui parecem excessivamente detalhadas (print). será que não deveria ser
> só a opção e um help num tooltip num "?" explicando melhor o que é?"

### 1. A seção de exclusão

Na rodada 1 eu troquei "Zona de Perigo" por "Excluir workspace" e deixei o cartão igual aos
outros, só com o título vermelho. **Foi um erro meu**, e contra o que eu mesma tinha escrito no
briefing: a Zona de Perigo é uma das quatro coisas que a tela de hoje faz bem.

O que voltou, mais forte que antes:

- **nome de zona de novo**, com ícone de aviso antes dele;
- **borda vermelha, cabeçalho com fundo tingido** e o corpo levemente tingido — a seção não se
  parece com nenhuma outra da tela;
- **o que se perde saiu do modal e voltou para a tela**: quatro linhas com número real (1.842
  itens, 34 membros, 12 fluxos, 96 chaves traduzidas). Aviso que só aparece depois do clique
  chega tarde;
- o botão virou **vermelho sólido**, não mais contornado.

A confirmação continua pedindo que se digite a referência do workspace.

**Uma divergência de palavra, para você decidir.** Você escreveu "ZONA DE RISCO"; eu escrevi
**"Zona de perigo"**, por dois motivos: é o nome que o produto e a documentação já usam hoje (e
o seu próprio pedido foi "como é hoje já"), e "perigo" bate mais forte que "risco" para a única
ação da tela que apaga tudo sem volta. Em inglês os dois viram "Danger Zone", que é a convenção.
Se ainda assim você preferir "Zona de risco", é uma linha no `_AbaBasicas.vue`.

### 2. As opções excessivamente detalhadas

Você tem razão: eram **três linhas por chave** (rótulo, descrição e o "↳ efeito"), cinco chaves
seguidas, e isso vira parede. Onde eu não fui até o fim foi em colocar *tudo* no "?".

O que ficou:

| Onde | O quê | Por quê |
|---|---|---|
| Sempre na tela | rótulo + **uma linha** | é o que deixa a lista escaneável: dá para decidir sem hover e sem clique. Reescrevi as oito descrições para caberem em uma linha da coluna |
| Atrás do **"?"** ao lado do rótulo | o detalhe: efeito, exemplo, ressalva | é o que só interessa a quem parou naquela chave |
| Sempre na tela, **só quando ligado** | o risco | aviso que a pessoa precisa ver não se esconde atrás de hover |

**Por que não só o rótulo e o "?".** Uma tela de configuração se visita de vez em quando, e a
pessoa costuma chegar procurando "aquela opção que faz X" — sem a linha de descrição, achar o
que se procura exige abrir chave por chave. A linha é o índice; o "?" é o verbete.

**Por que popover e não tooltip.** O "?" é um botão de verdade: abre no clique, fecha no Esc,
funciona no toque e entra na ordem do teclado. Tooltip de hover deixaria de fora quem usa
teclado e quem usa telefone — e o conteúdo aqui tem duas a três linhas, que é muito para
tooltip.

**O que o produto já acertava e continua valendo:** o "?" existe hoje e o texto dele é bom. O
que estava errado era o endereço, no extremo direito da tela, a 1290 px do rótulo. Agora ele
encosta no nome da coisa que explica.

---

## Rodada 2 — 16/09/2026 — a largura das linhas de ajuste

**O que ela pediu, literal:**

> "isso nao ta legal. muito espaço vazio na lateral. tem que distribuir melhor isso aí
>
> se for o caso, é só colocar comportamentos da interface dividindo tela com modulos, cada um
> ocupando metade... nao sei se fica muito ruim. mas de um jeito com boa ux"

**O que estava errado, e era meu.** Na rodada 1 eu travei a linha de ajuste em 768 px para
aproximar o controle do rótulo — dentro de um cartão de 1.200 px. Ganhei a proximidade e comprei
um buraco: **a régua embaixo de cada linha parava a 870 px** e o resto do cartão ficava vazio.
Era o mesmo erro da tela de hoje de cabeça para baixo: lá o controle está longe demais, aqui o
cartão ficou largo demais para o conteúdo.

**O que mudou:**

1. **Comportamento da interface e Módulos passaram a dividir a largura** (`lg:grid-cols-2`), como
   ela sugeriu. Os dois são a mesma coisa em natureza — chaves que mudam o workspace inteiro — e
   em coluna de ~500 px o controle fica a 24 px do fim do texto, sem trava nenhuma. Some o vazio
   e some a distância, de uma vez.
   `items-start` no grid: os cartões têm alturas diferentes (cinco chaves contra três) e esticar
   o menor recriaria o vazio que estávamos tirando.
2. **A trava de 768 px saiu de todas as linhas.** A régua volta a ir de ponta a ponta do cartão,
   que é o que faz a lista parecer lista.
3. **A linha passou a se medir pelo cartão, não pela janela** (`@container` do Tailwind 4).
   Em cartão estreito — a coluna — o controle vai para a borda direita. Em cartão largo
   (≥ 56rem, que é o caso quando a tela encolhe e as colunas empilham) o texto para em 40rem e o
   controle vem logo depois, em vez de viajar até o outro lado; como a largura do texto é fixa,
   os controles continuam alinhados entre si. Medido no navegador: coluna de 500 px → vão de
   24 px; empilhado em 920 px → vão de 24 px. Em nenhum dos dois sobra buraco.
4. **Notificações e Calendário:** o toggle do topo de cada bloco perdeu a trava e passou a
   terminar na mesma borda da lista que ele governa — o switch fica na mesma coluna dos
   controles das regras e das ocorrências logo abaixo. Ali a distância vira estrutura, porque
   tem com o que se alinhar.

**Por que não fiz a Zona de Perigo virar terceira coluna.** Ela continua sozinha, na largura
inteira, embaixo. É a única ação sem volta da tela e a separação é parte do aviso — a tela de
hoje acerta nisso (está no briefing, em "o que funciona"), e espremê-la ao lado de uns toggles
tiraria o peso dela.

**A regra que ficou, e vale para as próximas telas:** quem estreita é o container, nunca a
linha. Se o controle está longe demais do rótulo, o cartão é que está largo demais para o
conteúdo — a resposta é dividir a largura, não encolher a linha dentro dela.

---

## Rodada 1 — 16/09/2026

**O que ela pediu:** as seis queixas do [`BRIEFING.md`](BRIEFING.md), copiadas literais lá.

**A tese da rodada:** as cinco abas não são cinco variações do mesmo assunto — são cinco
produtos diferentes atrás de uma linha de abas. A tela não fica boa se cada aba for arrumada
por dentro sem que a casca resolva o que é comum a todas: **achar**, **não perder o que se
mudou** e **aprender o que a coisa faz**. Por isso a proposta tem duas camadas.

---

## Camada 1 — a casca, que vale para as cinco abas

### 1.1 A aba vive na URL

`?aba=calendario`. Link direto, botão voltar e recarregar passam a funcionar. É a S3-F6 pela
metade, e é o padrão dos cinco obrigatórios da pesquisa (nenhum deles empilha cinco telas numa
URL só).

### 1.2 As abas viram abas de verdade

A linha de abas usa o `UTabs` do Nuxt UI, que implementa o padrão WAI-ARIA: `role="tablist"`,
`role="tab"`, `aria-selected`, um único ponto de entrada no Tab e navegação por setas. Hoje as
abas são `<span>` dentro de `<div>` e **nenhuma** das cinco aparece na ordem de foco — 46
elementos focáveis na tela, zero abas.

Não foi preciso criar componente: o produto já usa Nuxt UI e o componente já faz isso.

### 1.3 Uma convenção de gravação só

Some o "Salvar" de cada cartão (eram três só na primeira aba, mais o verde de largura total da
segunda). No lugar entra **uma barra de rodapé que só aparece quando há alteração pendente**,
com Descartar e Salvar, e que diz **em quais abas** há coisa não salva.

Isso resolve de uma vez a S3-F1 e a S3-F7, como a auditoria já tinha previsto:

- o formulário passa a viver **fora** do componente da aba (`estado.ts`), então trocar de aba
  não desmonta nada e nada se perde em silêncio;
- a aba com pendência ganha um ponto âmbar que pulsa;
- verde deixa de ser botão. Verde vira confirmação, que é o que ele já era no toast.

### 1.4 Busca de configuração (Ctrl+K)

Vinte e três configurações indexadas com os **sinônimos que as pessoas usam quando não sabem o
nome da coisa na tela** — "reajuste" acha Correção Monetária, "recesso" acha Ocorrências,
"quanto falta" acha o saldo. Escolher um resultado troca de aba, rola até a seção e **pisca a
seção por 2,4 s**.

O padrão é do Notion, incluindo o piscar (PESQUISA.md §1). É a resposta mais direta ao "não
consigo me encontrar": em vez de adivinhar a aba, digita-se o nome da coisa.

### 1.5 Documentação em cada seção

Cada seção tem **"Documentação ↗"** no canto, e cada aba tem o link do artigo dela logo abaixo
do título. Os endereços são os reais, conferidos hoje:

```
docs.enspace.io/pt/docs/workspace/sections/settings/system/{basic-information|calendar|
notifications|dictionaries|billing}
```

Essa é a queixa que custa menos para resolver e que ninguém no mercado resolve (PESQUISA.md,
"O que nenhum deles faz"): a documentação **já existe, escrita aba por aba**, e a tela nunca
apontou para ela.

### 1.6 A aba diz o que ela decide

Uma linha embaixo de cada aba dizendo do que ela trata — "é daqui que saem os prazos e o SLA
das tarefas" vale mais que o rótulo "Calendário".

---

## Camada 2 — o que muda dentro de cada aba

### Informações Básicas — "as informações são desorganizadas"

| Antes | Agora | Por quê |
|---|---|---|
| Quatro cartões, cada um com o seu Salvar | Quatro seções, uma barra de gravação | S3-F7 |
| Ajuda no "?" a 1290 px do rótulo | Descrição visível embaixo do rótulo | a ajuda existe e é boa; só estava longe |
| "Configurações Adicionais" em 1 coluna e "Módulos" em 2 | **A mesma linha** nos dois blocos | duas grades a três centímetros uma da outra era metade da sensação de bagunça |
| "Tipo de Logo" em dois cartões de 100 px | Um alternador de dois botões + prévia | escolha binária não precisa de 200 px de altura |
| Contador "0" solto na borda | `0 / 280`, ao lado da ajuda do campo | número sem rótulo não informa |
| Aviso da exclusão em linha corrida | Lista do que se perde, item a item, e confirmação digitando a referência | a Zona de Perigo já era boa; ficou legível |
| Sem aviso de consequência | Risco aparece **só quando o ajuste está ligado** | avisar sobre risco que não está correndo é ruído |

### Calendário — "parece que tá em MVP"

O que dava essa impressão, ponto a ponto:

1. **A data repetida dentro da célula.** O cabeçalho diz "7" e a caixa colorida diz
   "07/09/2026". Saiu. No lugar, a célula mostra **o nome do feriado ou da ocorrência**.
2. **Feriado com a mesma cor de fim de semana.** Agora feriado é âmbar, ocorrência é primária,
   fora do expediente é cinza, dia útil é o fundo normal. A legenda fica junto do calendário,
   não flutuando acima dele.
3. **Campo de tags para dias úteis.** Virou uma fileira de sete botões que dizem "útil" ou
   "folga", com uma frase de resumo embaixo — e um aviso vermelho quando ninguém sobrou (S3-F2).
4. **"Sincronizar Feriados" sem volta.** Agora é **"Importar feriados"**, com país explícito,
   **prévia da lista** e o botão dizendo o efeito: "Importar 6 feriados". E existe a lista do
   que já entrou, **agrupada por país**, com remoção — hoje não há tela nenhuma que desfaça o
   que foi gravado (S3-F3). O Veterans Day aparece sob "Estados Unidos", com selo
   "fora do país do workspace".
5. **O mês como resultado, não como formulário.** O bloco se chama "Como o mês fica" e diz
   quantos dias úteis sobraram. O tooltip que explica a causa — a melhor coisa da tela de hoje —
   continua, só nos dias que precisam de explicação.

### Notificações — "é até bonitinha, mas ninguém entende"

1. **O que o produto faz sozinho vira a primeira seção.** Os três e-mails nativos (1 dia antes,
   no dia, 1 dia depois) aparecem nomeados. Hoje eles não estão escritos em lugar nenhum da
   tela, e o toggle promete desligá-los sem dizer o que são.
2. **A regra vira frase.** "Avisar 3 dias antes do vencimento, com o modelo 'Prazo se
   aproximando'." Some o número com sinal: a direção é um botão **Antes / Depois**
   (padrão monday e ClickUp, PESQUISA.md §3 e §4).
3. **A frase aparece enquanto se edita**, num bloco fixo dentro do modal. Você lê a regra antes
   de salvar, não depois.
4. **Linha do tempo** com os avisos posicionados em relação ao vencimento — antes à esquerda,
   depois à direita. Quatro regras viram um desenho, não uma lista de números.
5. **O estado perigoso ganhou aviso**: toggle ligado e nenhuma regra = "Nenhum aviso será
   enviado". A documentação já avisava disso; a tela, não.
6. **Toggle desligado não esconde as regras** — mostra quantas estão guardadas e sem efeito.
7. O select de modelo de e-mail diz **onde os modelos se criam** (S3-F4).

### Dicionários — "com muito campo fica extenso demais"

O diagnóstico está no briefing: cada campo carrega até cinco textos traduzíveis, então a árvore
cresce por multiplicação. A árvore é **fiel à estrutura e ruim como plano de trabalho**.

A proposta trata tradução como **fila**, não como árvore:

- **filtro por status** — "Faltam 74" / "Traduzidas 22" / "Todas" (padrão Crowdin);
- **busca** no original e na tradução, e filtro por categoria;
- **progresso por categoria** em cartões clicáveis — o ENSPACE já mostrava progresso por nó, que
  é bom; aqui ele também vira filtro;
- **barra de trabalho grudada no topo** enquanto se rola, com o caminho
  `Categoria › Grupo › Campo` em cada bloco: você nunca perde de vista onde está;
- **Enter pula para a próxima que falta** — traduzir vira uma sequência, não uma caça;
- **custo da IA antes do clique**: "traduzir as 74 que faltam custa cerca de 15 en-credits",
  com link para o saldo na aba Cobrança.

A árvore de hoje não foi jogada fora: ela virou **agrupamento**, que é o que ela fazia de bom.

### Cobrança — "a melhor, mas parece pobre"

Ela parece pobre porque mostra um número e nenhuma consequência. O que entrou:

- **"Sua carteira"**, e a primeira linha diz que o saldo é da pessoa e vale em todos os
  workspaces (S3-F5 — hoje a tela diz "Carteira do usuário" dentro de um workspace);
- **"en-credit" definido** num popover, com três exemplos de custo — a unidade nunca foi
  explicada em lugar nenhum da tela;
- **ritmo e projeção**: consumo em 30 dias, média por dia de uso e "no ritmo atual, dura até 12
  de outubro" (padrão Stripe, PESQUISA.md §7). É a única coisa que responde à pergunta real;
- **linha do consumo diário** — 30 pontos, em SVG escrito à mão, sem biblioteca de gráfico;
- **"No que os créditos foram"**, por recurso, com execuções — hoje isso só existe espalhado
  nas linhas do extrato;
- **extrato legível**: data em português ("15 de set, 16:40" em vez de "yesterday"), nome do
  recurso em vez do slug `analista-de-duplicidade---juridico-bp`, e **selo do workspace** —
  âmbar quando o gasto aconteceu em outro workspace seu, que era o que mais confundia;
- **o pedido de recarga diz o efeito**: "com 2.000 a mais, o saldo passa a durar cerca de 44
  dias de uso".

---

## Nomes que o protótipo mudou — e por quê (regra 29)

O nome vem da tela. Quando ele contradiz a coisa, o protótipo propõe o certo e registra aqui:

| Na tela hoje | No protótipo | Motivo |
|---|---|---|
| `Juridico` | **Jurídico** | falta de acento, não é decisão de produto |
| ~~Tipo de Logo → Marca~~ | **Logo** | revertido na rodada 4: ícone e imagem são as duas formas do logo, não duas coisas |
| Linguagem Padrão | **Idioma padrão** | "linguagem" é tradução torta de *language* |
| Carteira do usuário | **Sua carteira** | "do usuário" não diz de qual; a carteira é de quem está olhando |
| Ativar notificações personalizadas | **Usar as minhas regras** | descreve o efeito, não o mecanismo |
| Sincronizar Feriados | **Importar feriados** | "sincronizar" promete duas vias; isso só traz |
| Habilitar Ocorrências | **Registrar ocorrências no calendário** | o rótulo antigo não diz onde aparece |

---

## O que é maquete (regra 10)

Funciona de verdade, sobre o mock, em memória: trocar de aba, a URL da aba, a busca com Ctrl+K
e o destaque da seção, todos os toggles, a pendência e a barra de Salvar/Descartar, os dias
úteis repintando o mês, importar e remover feriado, criar e remover ocorrência, criar/editar/
remover regra de aviso com a frase ao vivo, os filtros e a busca dos dicionários, o Enter que
pula para a próxima chave, o pedido de recarga e o filtro do extrato.

**Não funciona — é maquete:**

1. **"Trocar ícone" e "Enviar imagem"** não abrem nada. A escolha da marca está fora do escopo
   desta demanda e tem tela própria a desenhar.
2. **A tradução por IA** só tem sugestão para o vocabulário do exemplo (~50 termos). As chaves
   sem sugestão continuam vazias **de propósito**, e a tela diz isso — inventar tradução para
   tudo esconderia o comportamento real.
3. **Exclusão do workspace** percorre a confirmação inteira e não apaga nada; mostra um aviso
   dizendo isso.
4. **Salvar** troca o estado local e mostra o toast. Nada persiste: recarregar zera (regra 4).
5. **O calendário** só tem dado de setembro a dezembro de 2026. Navegar para 2028 mostra um mês
   correto, mas sem feriados.
6. **A projeção de saldo** usa média por dia de uso e um fator fixo para pular fim de semana. É
   plausível, não é o cálculo que o back faria.

---

## O que foi descartado, e por quê

- **Trocar a linha de abas por um menu lateral**, como Notion e Twenty fazem. É provavelmente
  melhor para cinco produtos diferentes — e foi descartado pela regra 15: o produto já ensinou
  "abas no topo", e tela de configuração não é lugar de reaprender navegação. Se essa troca for
  desejada, ela é uma decisão de produto, não um detalhe desta rodada.
- **Mover a Cobrança para fora de `settings/system`**, já que a carteira é da pessoa. Regra 20:
  destaque soma, não substitui — tirar a aba de onde as pessoas já a procuram faria elas
  pararem de achar. O que entrou foi a frase que explica o escopo.
- **Atalhos de teclado no estilo Linear (`G` `S`)**. Regra 19: é conserto de outra tela.
  Ficou só o Ctrl+K, que já é convenção de busca.
- **Converter en-credit em reais.** Quanto vale um crédito é decisão comercial; o protótipo não
  inventa preço. O que dava para fazer — definir a unidade e mostrar o consumo — foi feito.

---

## Achados fora do escopo, para a Mikaela decidir

Nenhum deles foi mexido: os dois moram em repositórios que este agente não escreve.

1. **Os links internos da documentação estão quebrados em produção.** As páginas do `en-docs`
   linkam `/workspace/settings/system/calendar`, mas o site serve
   `/pt/docs/workspace/sections/settings/system/calendar`. Conferido hoje: a primeira forma
   devolve "Page not found" e a segunda abre. Isso vale para os cinco links cruzados da página
   de Sistema — e provavelmente para o resto do `en-docs`.
2. **A documentação não cobre um dos toggles.** A tela tem cinco em Configurações Adicionais;
   o artigo de Informações Básicas descreve quatro — falta **"Mostrar URL de integração"**.
3. **`Juridico` sem acento** no produto (o módulo).
4. **A pendência que a auditoria deixou aberta** continua aberta: gravar "Dias Úteis" vazio e
   recarregar para ver se o back aceita array vazio. Não testei — teria mudado a configuração
   do workspace de exploração de novo, e o protótipo não dependia da resposta.

---

## A crítica que rodei no próprio trabalho

### `design:accessibility-review` — medido no navegador, não estimado

**O que passou:**

- A linha de abas entra na ordem do foco com **um único ponto de entrada**: o `tablist` tem
  `tabindex="0"` e delega para a aba ativa; as setas trocam de aba e a URL acompanha.
  Medido: Tab a partir do botão de busca → aba ativa → painel da aba. É o padrão WAI-ARIA, e é
  exatamente o que a S3-F6 diz não existir hoje.
- 41 elementos focáveis na tela, **nenhum sem nome acessível**.

**O que a crítica achou e eu corrigi na mesma rodada:**

| Achado | Medida | O que fiz |
|---|---|---|
| `text-dimmed` em texto de 11–12 px | **3,03:1** sobre branco (exige 4,5:1) | trocado por `text-muted` (**4,77:1**) nos 34 pontos onde carregava conteúdo |
| Os 10 botões que não são do Nuxt UI (dias da semana, segmentados, filtros, cartões de categoria) sem foco visível | WCAG 2.4.7 | contorno de 2 px com deslocamento, em todos |
| Remover feriado / ocorrência / regra só aparecia no hover | descoberta e toque | ficam a 60% de opacidade e acendem no hover e no foco |

Vale registrar o constrangimento: **eu cometi, com 3,03:1, a mesma falha que apontei no produto
com 4,22:1.** A auditoria mediu; eu não tinha medido até rodar a crítica.

**O que a crítica achou e eu não corrigi:**

- **O primário do tema dá 3,39:1 sobre branco** (fúcsia, texto de 14 px) — abaixo dos 4,5:1.
  Atinge o rótulo da aba ativa, os links e o texto claro sobre botão primário. A paleta é
  **cópia do `en-docs`** e este agente não edita aquele repositório (regra 0). É achado de
  sistema de design, vale para o produto inteiro, e fica para a Mikaela decidir.
- **Botões de ícone têm 24×24 px.** Cumprem o mínimo da WCAG 2.2 AA (2.5.8, 24 px), não chegam
  aos 44 px do nível AAA. Mantive o tamanho do Nuxt UI para não divergir do produto.

### `design:design-critique`

**Primeira impressão.** O olho vai para "Sistema", depois para a aba ativa, depois para o
primeiro campo. É a ordem certa. A tela já não parece uma pilha de cartões: parece uma tela com
assunto.

| Achado | Severidade | O que fiz |
|---|---|---|
| A linha "Marca" juntava quatro pesos diferentes (prévia, segmentado, texto de ajuda e botão) na mesma altura | 🟡 moderado | a ajuda desceu para o rodapé do campo, como nos outros; sobraram três elementos |
| O controle ficava a ~900 px do rótulo nas linhas de ligar/desligar — **o defeito que eu estava corrigindo** | 🟡 moderado | linha limitada a 768 px de largura de leitura |
| "Documentação ↗" aparece uma vez por seção (cinco por aba) | 🟢 menor | mantido. É repetição de propósito: o pedido da demanda é justamente que **cada coisa** leve ao artigo dela. O peso visual é o mais baixo que existe (fantasma, 12 px) |
| Medidas diferentes na mesma aba: o cartão de identidade ocupa 960 px e as linhas de ajuste param em 768 px | 🟢 menor | aceito. Campo de formulário em duas colunas pede largura; linha de rótulo + controle, não |
| A cor primária do protótipo é **fúcsia** (paleta do `en-docs`) e o produto hoje é **azul** | 🟢 menor | registrado. É a convenção deste repositório desde o primeiro protótipo; trocar é decisão da Mikaela, não desta rodada |

**O que funciona:**

- A barra de pendência resolve duas fricções com uma peça só, e deixa a tela sem nenhum botão
  "Salvar" solto.
- A aba de Notificações virou legível em português: a linha do tempo mostra em um olhar o que
  quatro regras fazem.
- A aba de Dicionários aguenta volume sem virar árvore: o filtro "Faltam 58" é o plano de
  trabalho que a tela de hoje não dá.
- A Cobrança responde "dura até quando", que é a pergunta que a pessoa tinha.

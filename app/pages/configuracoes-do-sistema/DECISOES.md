# Decisões — Configurações do Sistema

## Rodada 14 — 17/09/2026 — o conserto e a auditoria nas outras quatro abas

**O que ela pediu, literal:**

> "quebrou. talvez tenha que botar abaixo mesmo, como era antes. outro bloco só pra módulos.
> depois de fazer isso, repita a auditoria em todas as outras abas pra tirar exageros"

### O que eu quebrei na rodada 13

Juntar Comportamento e Módulos em duas colunas dentro de um cartão só **estourou o layout**: a
chave de cada linha foi parar no meio da tela, por cima da coluna vizinha.

**A causa:** `LinhaDeAjuste` usa container query (`@4xl`), e container query mede **o container**,
não a coluna. Dentro de um cartão de 1.160 px a linha entra no modo largo, reserva 40rem para o
rótulo e joga a chave para fora da coluna de 560. Foi erro de análise meu: eu tinha medido bordas
e fios, não o que o corte fazia com o controle.

**Consertado como ela mandou:** Módulos voltou a ser bloco próprio, abaixo, com título próprio.

**E um defeito que o conserto expôs:** com os cartões de novo em largura cheia, a chave parava em
x=753 num cartão que termina em 1.233, deixando 480 px de nada à direita. Era a mesma queixa da
rodada 2 ("quem estreita é o container, nunca a linha"). Agora a linha é `justify-between`: o
texto para de crescer aos 40rem e **a chave vai para a borda direita**, como em toda tela de
configuração que se preze.

### A auditoria nas outras quatro abas

Mesmo script, mesma largura, mesmo critério: **dentro de um cartão não entra outra moldura**, a
menos que o conteúdo seja grade de dados (a grade do mês fecha a tabela) ou um aviso que precisa
saltar (o "dura até" da carteira).

| Aba | Molduras antes | depois | O que saiu |
|---|---|---|---|
| Calendário | 7 | **5** | as listas de feriados e de ocorrências perderam a moldura e ficaram só com o fio entre linhas |
| Notificações | 8 | **3** | os três avisos nativos, a faixa da linha do tempo e as regras viraram fundo em vez de borda |
| Dicionários | 22 | **2** | as 20 categorias eram 20 molduras dentro de uma; viraram ladrilho de fundo, clicável do mesmo jeito |
| Cobrança | 9 | **5** | o painel do gráfico, os pedidos de recarga e o extrato perderam a borda; o aviso de saldo manteve a dele |
| Informações Básicas | 5 | 5 | já tinha sido cortada na rodada 13 |

**Das 51 molduras das cinco abas sobraram 20**, e o número de fios não subiu: o que saiu virou
espaço ou fundo, nunca linha nova. É o que a Mews recomenda no lugar de cartão aninhado, trocar a
borda pelo preenchimento.

**O que não mexi, e por quê:** a grade do mês (as bordas fecham a tabela), o aviso de saldo na
carteira (é o caso de destacar o que exige atenção), a moldura vermelha da zona de perigo, os
grupos de botão segmentado (são controle, não layout) e as listas dentro de modal, onde não existe
cartão para servir de moldura.

---

## Rodada 13 — 17/09/2026 — o corte das divisões visuais

**O que ela pediu, literal:**

> "analise o modo como voce ta propondo as divisoes de seçoes. é padrao de mercado? ou tem muito
> box e divider no seu, acabando por sujar a tela? PESQUISE antes de responder." (...) "pode
> aplicar o corte"

Pesquisa e método em [`PESQUISA.md`](PESQUISA.md), "Rodada 13".

### O veredito

Não era cartão demais: cartão por grupo é padrão (Polaris). Era **o mesmo agrupamento desenhado
três vezes**: moldura, linha sob o título dentro da moldura, e fio entre as linhas de conteúdo.
Em Informações Básicas isso dava **uma linha horizontal a cada 140 px de rolagem**, e duas delas
a 40 px uma da outra no topo, sem nada no meio.

### O corte, medido

| | Antes | Depois |
|---|---|---|
| Molduras | 5 | **4** |
| Fios | 13 | **7** |
| Fios estruturais | 6 | **0** |
| Altura da página | 1.831 px | 1.766 px |

Três cortes:

1. **A linha sob o título saiu de `_Secao`**, nas cinco abas. O título é 16 px semibold sobre
   texto de 14 px cinza: a hierarquia já estava na tipografia. Na **zona de perigo o fundo
   tingido continua** (agora com canto de cima arredondado, acompanhando a moldura): ali a faixa
   trabalha, e é o caso que o Material descreve.
2. **A faixa de subtítulo da tela perdeu a borda.** A lista de abas já tem a dela, 40 px acima.
3. **Comportamento e Módulos viraram um cartão só**, com duas colunas rotuladas. Mesma natureza
   de coisa, mesma largura de leitura, uma borda a menos para o olho atravessar. O `id="modulos"`
   virou âncora da coluna, e as três entradas da busca que apontavam para ele agora apontam para
   a moldura única.

**O que ficou de pé, com motivo:** a moldura por seção, que é o padrão e é a âncora da busca e do
link de documentação; os fios entre linhas de ajuste, que é o caso de lista repetida; e a moldura
vermelha da zona de perigo.

### O que a mesma medição diz das outras abas

Cobrança agora tem **9 molduras e 15 fios** em 2.433 px. A maior parte é conteúdo que pede
moldura mesmo (pedidos de recarga, painel da carteira, gráfico), mas é a próxima aba a auditar
com o mesmo critério: pergunta a fazer em cada caixa interna é se ela separa algo que o espaço
não separaria.

---

## Rodada 12 — 16/09/2026 — o calendário virou lugar de perguntar e de agir

**O que ela pediu, literal:**

> "acha que na aba calendario o calendario em si deve ser interativo? deve dar pra clicar nele?
> como voce faria pra melhorar?" (...) "pode implementar quando quiser. um componente e o modal
> de ocorrencia"

A pesquisa está em [`PESQUISA.md`](PESQUISA.md), "Rodada 12".

### A regra que separa o que pode do que não pode

**Clicar num dia é manipular uma data. A regra semanal é sobre todas as terças do ano.** Se
clicar em 22/09 pudesse desligar as terças, um clique mudaria 52 dias em silêncio. Por isso o
calendário ganhou ação **sobre a data** e continua sem poder editar **a regra**.

### Um defeito meu, corrigido de passagem

A célula era um `<div>` dentro de tooltip: o motivo de cada dia ("Feriado: Independência do
Brasil", "o dia da semana está fora do expediente") **só existia no hover**, e quem navega por
teclado não alcançava. Agora a célula é `<button>` com `aria-label` que diz a data e o estado, e
o motivo abre no clique e no foco.

### O que cada dia oferece

| Dia | O popover mostra |
|---|---|
| útil comum | o motivo, e **Marcar como exceção** |
| com ocorrência | **Suspender o expediente neste dia** (ou voltar a contar) e **Remover** |
| feriado | **Remover \<nome do feriado\>** |
| fim de semana | o motivo, **Marcar como exceção** e **Mudar os dias úteis da semana**, que rola até a seção de cima e a destaca |

O fim de semana é o caso que prova a regra: a célula **leva** até o lugar onde a regra mora, em
vez de editar a regra dali.

**Um padrão que sai do próprio dia:** marcar exceção num dia útil já nasce com "mantém o
expediente" desligado; num sábado, ligado. Marcar exceção num dia de trabalho quase sempre é
suspender, e num dia de folga é o contrário.

### Teclado

A grade inteira tem **uma** parada de tabulação, e as setas andam por dentro (padrão de grade,
tabindex rotativo). Quarenta e duas tabulações para atravessar um mês seria pior que não ter
teclado nenhum.

### A ocorrência ganhou fim

`Ocorrencia` agora tem `ate?`, e o modal tem **De** e **Até**. Sem isso, o recesso de fim de ano
era uma linha por dia: no mock, "Recesso de fim de ano" aparecia duas vezes, 28 e 29 de dezembro,
e um recesso de verdade viraria doze linhas iguais. Agora é uma linha, `28/12/2026 a 30/12/2026`,
e o mês pinta os três dias.

O resumo do mês passou a dizer **"1 dia com ocorrência"** em vez de "1 ocorrência": com
intervalo, o que ele conta é dia, e chamar dia de ocorrência daria "4 ocorrências" para duas.

### O que não entrou, de propósito

- **Arrastar para pintar dias úteis.** É editar regra por gesto, e é exatamente o que a regra
  acima proíbe.
- **Criar feriado pela célula.** Feriado tem país e vem de importação; a lista é o lugar certo.
- **Shift-clique para intervalo.** O "Até" no modal resolve o mesmo caso com muito menos
  superfície. Se o intervalo virar rotina, aí sim vale o gesto.
- **Virar agenda.** A tela é de configuração: o que ela mostra são regras e exceções, não eventos.

---

## Rodada 11 — 16/09/2026 — cada linha do consumo diz o que ela é

**O que ela pediu, literal:**

> "essa seção precisa de mais detalhe nos itens, talvez usando badges ou ícones com tooltip.
> o que significa cada linha? foi agente de ia? foi o chat de ia? foi outra coisa? sei la"

A pergunta estava certa e a seção não respondia. "Analista de duplicidade" e "Triagem de entrada"
são dois nomes no mesmo formato, e um é agente e o outro é nó de fluxo: cobram de jeitos
diferentes, se ajustam em telas diferentes e nada disso aparecia.

### A taxonomia veio da documentação, não da minha cabeça

Fui ler o que o produto documenta como consumidor de en-credits (`docs.enspace.io`, conferido em
16/09/2026). São três famílias, e só três:

| Família | O que é | Como cobra, segundo a doc |
|---|---|---|
| **Agente de IA** | agente do workspace, seu ou nativo (BENI, BENI BUILDER, REVIEWER) | "a cada interação; varia conforme o modelo de linguagem selecionado e a complexidade" |
| **Nó de IA no fluxo** | nó de IA dentro de um Spaceflow | "a execução de nós de I.A. consome en-credits; varia conforme o volume de dados e o tipo de operação" |
| **Tradução por IA** | tradução automática dos dicionários | "a tradução por IA consome en-credits" |

E o que **não** cobra também ficou claro: criar fluxo, rodar fluxo sem nó de IA, criar item,
enviar e-mail.

**Isso corrigiu o mock.** "Leitor de PDF" e "Resumo de chamado" eram invenção minha: não existe
extração de documento documentada como consumidor de crédito. Saíram, entraram BENI e REVIEWER,
que existem. O extrato acompanhou: a linha que dizia "Extração de documento" virou "Interação com
o BENI", e a da triagem virou "Execução de nó de IA".

### O que a linha mostra agora

```
🤖 Analista de duplicidade  [Agente de IA]        1.840 · 26 interações
██████████████████████████████████████████
```

- **Ícone e selo** com a família. O selo é botão: abre no ponteiro **e no foco**, porque a lição
  do gráfico (rodada 10) valia aqui também.
- **A unidade certa por família**: o agente tem *interações*, o nó tem *execuções*, a tradução tem
  *chaves*. Contar tudo como "execuções" era o que fazia "231 · 5 execuções" não querer dizer nada.
- **No detalhe**: o que é a família, **onde aquilo rodou** (`Chat de IA e fluxo de contratos`,
  `Spaceflow "Entrada de chamados"`), como cobra, a **média por uso** e o link para a documentação
  daquela família.

**A média é o número que a barra esconde.** A barra ordena por total, e total premia quem roda
muito. `71 en-credits por interação` do Analista contra `8` do BENI é o que responde de verdade
"onde mexer para gastar menos", que é a promessa do subtítulo da seção.

### Um detalhe de coerência

A soma das cinco linhas passou a bater com o consumo dos 30 dias da carteira: **2.747**. Antes
dava 2.649 e ninguém ia conferir, mas uma tela que promete explicar o gasto não pode ter dois
totais diferentes na mesma aba.

---

## Rodada 10 — 16/09/2026 — o gráfico do consumo passou a falar

**O que ela pediu, literal:**

> "o grafico da tela de cobrança deve ter mais informaçao com mouse hover. e informaçoes de eixo
> x e y pra facilitar a leitura. nada muito sobrecarregado. simples. usando os graficos do modelo
> de dash do nuxt. tem na doc deles"

O gráfico era um `<polyline>` que eu desenhei à mão: bonito, leve e **mudo**. Dava a silhueta do
gasto e não respondia nem "quanto foi aquele pico" nem "que dia é aquele vale". Sem escala, um
pico de 210 e um pico de 2.100 têm exatamente o mesmo desenho.

### A peça

O template de dashboard do Nuxt UI monta os gráficos com **Unovis** (`@unovis/vue`), e é o que
está aqui: `VisXYContainer` com `VisLine`, `VisArea`, dois `VisAxis`, `VisCrosshair` e
`VisTooltip`. As cores saem dos tokens (`--ui-primary`, `--ui-border`), então o gráfico troca de
tema junto com a tela, como manda a regra 35.

Ficou **de fora** de propósito o resto do painel do Unovis: legenda, zoom, seleção de período e
segunda série. Para 30 pontos e uma métrica só, cada um deles é peso sem resposta nova, e o
pedido foi "nada muito sobrecarregado".

### Os dois eixos

- **Y**: quatro marcas redondas tiradas do pico (0, 70, 140, 210) com linha de grade fina, e o
  rótulo `en-credits`. Marca quebrada (0, 52, 105, 157) não ajuda ninguém a ler.
- **X**: cinco paradas (18 ago, 25 ago, 1 set, 8 set, **hoje**), e não trinta. O último é "hoje"
  porque é assim que a pessoa pensa a ponta da linha.

### O que o ponteiro conta

Três linhas, no máximo:

```
Segunda-feira, 7 de setembro
Sem consumo
Feriado: Independência do Brasil.
```

1. **O dia com o dia da semana.** É o que explica o desenho: os vales são sábado e domingo.
2. **O valor**, ou "Sem consumo".
3. **O tamanho daquilo no período** (`7% do consumo dos 30 dias`) ou, quando o dia é zero, **o
   motivo**: fim de semana, feriado (lido dos feriados do próprio workspace, na aba Calendário)
   ou "Nenhuma execução neste dia".

O terceiro item é o que evita a leitura errada mais provável desta tela: vale no gráfico
parecendo falha de registro. Aqui o gráfico se explica sozinho.

### Duas notas de implementação

- **Só no cliente.** O Unovis mede o container para desenhar, e no prerender não existe container
  para medir. O gráfico entra num `<ClientOnly>` com um esqueleto da mesma altura, para a seção
  não pular quando ele aparece.
- **`text-muted` nas marcas, não `text-dimmed`.** O template do Nuxt usa `--ui-text-dimmed`; no
  escuro isso dá 3,03:1 e reprova no WCAG AA, o mesmo defeito que a auditoria apontou no produto.

### O que fica pendente

Tooltip é informação que só existe no hover: quem navega por teclado não alcança. O resumo do
período continua em texto ao lado (total, média, pico pela escala), mas o valor dia a dia, hoje,
só sai no mouse. Se esta tela virar produto, o caminho é o que o Highcharts faz: a série navegável
por seta com o valor anunciado.

---

## Rodada 9 — 16/09/2026 — a hierarquia real dos dicionários

**O que ela pediu, literal:**

> "a aba dicionarios nao ta fidedigna. abra os dicionarios do enspace. pra isso, pode entrar
> SOMENTE DESTA VEZ neste workspace que ja tem bastante campo criado (...) abra geral, abra
> campos, abra formularios, tudo ate O ULTIMO NIVEL DISPONIVEL pra voce entender exatamente as
> hierarquias do enspace que devem ser consideradas nas traduçoes. seu modelo ta muito mais
> simples que o real."

**Autorização pontual, e usada como tal.** Entrei no workspace indicado só para ler: abri a
árvore até o último nível, não criei, não editei, não salvei e não apaguei nada. Nenhum dado de
lá entrou no protótipo: o que atravessou foi **a estrutura**, que é o que a regra 9 permite.

### A hierarquia real, como ela é

```
Categoria                                          "Clients" = 710 chaves
├── Geral ............ 3 ...... Nome · Nome Singular · Descrição
├── Campos ........... 349
│   └── Campo ......... Nome · Descrição · Rótulo · Ajuda · Instrução · Placeholder
│       └── Opções .... uma chave por opção da lista
└── Formulários ...... 358
    └── Formulário .... Nome · Descrição
        └── Campos .... O MESMO CAMPO OUTRA VEZ, com os seis textos
            └── Opções     e as opções dele
```

**São sete níveis**, contra os três que eu tinha modelado. E o que eu não tinha visto é o que
mais pesa:

1. **O campo aparece duas vezes.** Uma na definição da categoria, outra dentro de cada
   formulário que o usa, cada uma com os seus seis textos e as suas opções. Por isso
   **Formulários tem mais chaves que Campos** (358 contra 349 em Clients), e por isso uma
   categoria de formulários sozinha chega a **2.440 chaves**.
2. **São seis textos por campo, não cinco**: Nome, Descrição, Rótulo, Ajuda, Instrução e
   Placeholder. Eu tinha deixado o Nome de fora.
3. **Categoria sem campo mostra só o Geral.** Vi uma com 3 chaves no total.
4. O workspace real tem **7.524 chaves em 27 categorias, com 180 traduzidas**. Confirma a ordem
   de grandeza da rodada 5 e corrige a distribuição: quase tudo intocado.

### O que mudou no protótipo

- **O mock foi refeito na estrutura real**: 7.476 chaves em 20 categorias, com o campo repetido
  dentro de cada formulário, os seis textos e as opções. O número quase bate com o real de
  propósito.
- **O formulário virou o segundo recorte.** Dentro de uma categoria, escolher Formulários mostra
  uma fila de chips com os formulários e quantas chaves cada um carrega (Cliente · 221,
  Eventos · 59). É o nível que faltava, e ele entra como filtro, não como mais um nível de
  sanfona: sanfona de sete níveis é a árvore que a rodada 5 aposentou.
- **Cada linha mostra o caminho inteiro**, como a árvore do produto:
  `Formulários › Cliente › Número`, com o tipo no selo (Nome, Descrição, Rótulo, Ajuda,
  Instrução, Placeholder, Opção). A fila também passou a mostrar o caminho.

### Um defeito do produto que apareceu na visita

Dentro de um formulário, a árvore de hoje trunca o rótulo da chave:
`Tax Classification › N…`, `› De…`, `› Ró…`, `› Aj…`, `› In…`, `› Pl…`. **Não dá para saber se
a linha é o Nome, a Descrição ou a Instrução sem passar o mouse.** Seis linhas seguidas do mesmo
campo, indistinguíveis. No protótipo isso não acontece porque o tipo é um selo, e o caminho vem
embaixo.

E o subtítulo da tela promete traduzir **"types, fields, formulários, estágios"**, mas não achei
grupo de estágios em nenhuma das categorias que abri. Ou a promessa sobra, ou os estágios estão
em outro lugar.

---

## Rodada 8 — 16/09/2026 — avaliação da hierarquia das abas

> ⏸ **Proposta, não aplicada.** Ela pediu avaliação e opinião, não mudança. Nada nesta seção está
> no protótipo; está aqui para ela decidir o que entra.

**O que ela pediu, literal:**

> "acha que as abas estao na melhor hierarquia possivel, considerando tambem o que outros
> sistemas fazem? considere: 1. a ordem das abas 2. o título das abas 3. os agrupamentos dentro
> delas (se tem aba que deveria ser so um conteudo dentro de outra etc) 4. a ordenaçao dos
> conteudos DENTRO das abas. faça a uma avaliaçao geral de ux e a pesquisa em outros sistemas e
> volte com a opiniao"

A pesquisa está em [`PESQUISA.md`](PESQUISA.md), "Rodada 8". O critério que organiza a resposta
inteira veio de lá: **aba é faceta da mesma entidade, no mesmo nível hierárquico**. E a
configuração em SaaS costuma ter **três camadas** (pessoal, conta, organização), não uma.

### Resposta curta

**Não, não está na melhor hierarquia.** Mas o problema não é a ordem: é que **duas das cinco abas
não são facetas do workspace**, e que **os títulos prometem mais do que as abas entregam**.

### 1. A ordem: é a parte que está quase certa

Identidade primeiro e dinheiro por último é a convenção, e a tela já faz isso. Se as cinco
ficarem como estão, a ordem que eu proporia é a mesma de hoje, com um argumento em vez de
acaso: **quem o workspace é → quando ele trabalha → o que ele avisa → como ele fala → quanto
ele gastou**.

### 2. Os títulos: quatro dos cinco prometem errado

| Hoje | Proposta | Por quê |
|---|---|---|
| Informações Básicas | **Geral** | "Básicas" não descreve módulos nem exclusão de workspace. "Geral" é o que Notion, Slack e Linear usam para exatamente este conteúdo, e some a colisão com "Visão Geral", que já existe no menu ao lado |
| Calendário | **Expediente** | O produto **tem** uma Agenda. Chamar isto de Calendário manda procurar a agenda aqui. O que a aba define é dia útil e feriado, e o Zendesk chama de Schedules |
| Notificações | **Avisos de prazo** | A aba só trata e-mail de tarefa com prazo. "Notificações" promete o sino, o push e o alerta do sistema, que moram em outro lugar |
| Dicionários | **Traduções** | "Dicionário" sugere glossário. O que se faz ali é traduzir, e é assim que Salesforce, Crowdin e Lokalise chamam |
| Cobrança | **Créditos** | Não há fatura, plano nem preço nesta aba: há saldo de en-credits e pedido de recarga. "Cobrança" promete boleto |

### 3. Os agrupamentos: aqui está o problema de verdade

Pelo critério da pesquisa, **quatro abas são facetas do workspace e uma é faceta da pessoa**:

| Aba | De quem é | Depende de | Onde deveria morar |
|---|---|---|---|
| Informações Básicas | workspace | — | fica |
| Calendário | workspace | — | fica (renomeada) |
| Notificações | workspace | **Modelos de E-mail**, que são a seção `Configurações › E-mails` | **dentro de E-mails** |
| Dicionários | workspace | **Estrutura** (categorias, campos, formulários), que é a seção vizinha | **junto de Estrutura**, ou como item próprio do menu |
| Cobrança | **da pessoa** | carteira que atravessa workspaces | **Painel do Usuário**, com resumo de consumo aqui |

Três consequências práticas, se isso for aceito:

1. **Notificações dentro de E-mails resolve a S3-F4 de raiz.** O campo obrigatório "Modelo de
   e-mail" abre hoje com zero opções porque os modelos moram em outra seção. Na mesma seção, a
   dependência deixa de ser invisível: criar o modelo e usar o modelo ficam a um clique.
2. **Traduções junto de Estrutura junta quem cria com quem traduz.** Hoje a pessoa cria o campo
   numa seção e vai traduzir em outra, sem nenhum caminho entre as duas.
3. **Cobrança fora daqui acaba com a confusão de escopo** que a auditoria registrou (S3-F5): a
   carteira é sua e atravessa workspaces, mas mora numa tela cujo cabeçalho inteiro diz o nome
   deste workspace.

**"Sistema" voltaria a ser o que o nome diz**: identidade, padrões, comportamento, módulos,
expediente e exclusão. Duas abas, ou nem isso: cabe numa tela só com seções.

### 4. A ordem dentro das abas: está certa, com uma dúvida

| Aba | Ordem atual | Veredito |
|---|---|---|
| Informações Básicas | Identidade → Padrões → Comportamento e Módulos → Zona de perigo | certa: quem é, o que vale por omissão, o que muda a tela, e o irreversível por último |
| Calendário | Dias úteis → Feriados → Ocorrências → Como o mês fica | certa: regra, exceção nacional, exceção sua, resultado |
| Notificações | O que o ENSPACE já avisa → Tarefas rápidas → Tarefas agendadas | certa: o padrão antes da exceção |
| Dicionários | Visão geral → recorte → fila | certa, e é o caminho do Salesforce |
| Cobrança | Carteira → No que foi → Pedidos → Extrato | certa: estado, causa, ação pendente, histórico |

**A dúvida honesta:** em Geral, **Módulos** talvez devesse vir antes de **Comportamento**. Ligar
um módulo acrescenta telas e campos ao workspace, o que é mais estrutural do que ajustar o
comportamento de telas que já existem. Mantive como está porque a mudança é de gosto e não tenho
evidência; se for para trocar, é uma linha.

### O que eu faria, em duas doses

**Dose 1, cabe nesta tela e nesta demanda:** os cinco títulos e a ordem argumentada. Muda rótulo,
não estrutura, e já melhora o "não consigo me encontrar".

**Dose 2, é decisão de produto:** mover Notificações para E-mails, Traduções para junto de
Estrutura e Cobrança para o Painel do Usuário. Isso mexe em telas que não são desta demanda
(regra 19), então não faço por conta própria.

---

## Rodada 7 — 16/09/2026 — enviar o logo com o campo de arquivo do Nuxt UI

**O que ela pediu, literal:**

> "no espaço de adicionar imagem deve ser o campo do nuxt ui de arquivo que pode clicar ou
> arrastar algo por cima dele"

Era a ponta que ficou de fora da rodada 6: "Enviar imagem" existia e não abria nada.

**O componente existe e é `UFileUpload`** (conferido em disco, como manda a regra 5). O padrão
dele já é `variant: "area"`, ou seja, a caixa tracejada que aceita clique **e** arraste, com
`dropzone` ligado por padrão. Não foi preciso criar nada: o degrau 2 da escada resolveu.

**Como ficou:** "Enviar imagem" abre a mesma camada que "Escolher ícone" abre, com o campo de
arquivo dentro, aceitando PNG, JPG, GIF e SVG. O arquivo escolhido vira prévia na hora, o tile
do logo mostra a imagem, o botão passa a dizer "Trocar imagem" e a aba marca pendência.

**Uma coisa que o campo não mostra, e que eu acrescentei:** a prévia dele é grande, e o logo na
barra lateral tem 64 px, cortado em quadrado. Embaixo da prévia grande entrou uma linha com a
imagem **no tamanho real** e o nome do arquivo. A ação de remover ficou só no X do próprio
campo: ter dois botões para a mesma coisa era o tipo de repetição que esta tela veio corrigir.

**O que é maquete:** nada sobe. O arquivo vira uma **URL de objeto criada no próprio navegador**,
que morre no reload; nenhum byte sai da máquina, como manda a regra 4. No produto, o upload
gravaria o arquivo e o workspace guardaria a URL, e é por isso que o campo `logoImagem` do
`mocks.ts` está marcado como invenção do protótipo.

---

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

**Uma correção durante a própria rodada.** O campo prometia "procure por contrato, balança,
caminhão" e `contrato` devolvia **zero**: a biblioteca gerada trazia o nome em inglês e alguns
poucos sinônimos, e faltava justamente o vocabulário de quem configura workspace. Entrou no
componente uma camada de **34 termos de negócio** (contrato, fornecedor, nota fiscal, prazo,
chamado, obra, frota, auditoria...), cada um apontando para os ícones que fazem sentido, e o que
vem por significado aparece antes do que vem por coincidência de letras. Agora `contrato`
devolve seis, começando por `file-signature`.

Essa camada mora no componente, e não no arquivo gerado, porque é curadoria: muda com o negócio,
não com a versão do pacote de ícones.

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

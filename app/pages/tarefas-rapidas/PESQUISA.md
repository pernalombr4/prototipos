# Pesquisa — quadros de tarefas no mercado

Cinco obrigatórias mais três escolhidas pela natureza do problema (gestão de trabalho):
Linear, Jira e Asana. Consultadas em 21/09/2026, pela documentação oficial de cada produto.

---

## 1. ClickUp

**Como resolve.** O Board view tem um menu **Customize** que muda o quadro que está na tela,
não uma cópia dele: escolher o campo de agrupamento (cada grupo vira uma coluna), a ordem dos
cartões dentro da coluna, ligar cor de coluna pelo campo do agrupamento e **recolher colunas
sem tarefa**. O cartão ganha ícones de propriedade (descrição, anexo, checklist, dependência),
trilha de localização e o nome da tarefa pai acima das subtarefas.

O totalizador é o **Column Calculations**: passa o mouse no fim da coluna, aparece
`Calculate`, e escolhe total, média, mínimo, máximo ou contagem. A documentação coloca esse
rodapé nas visões **Lista e Tabela**; no Board, o número de estimativa aparece no topo. Ou
seja: **o cálculo por coluna existe e é um padrão do produto, mas o lugar dele no board é o
topo, não o pé.** Tarefa escondida por filtro não entra na conta.

**URL.** `help.clickup.com/hc/en-us/articles/35342044832279-Customize-Board-view` e
`help.clickup.com/hc/en-us/articles/6310124537751-Calculate-columns-in-List-and-Table-view`

**O que serve.** O menu que reconfigura o quadro em pé, sem criar outra tela. O cálculo
escolhido por coluna. Recolher coluna vazia. O aviso de que filtro muda o número.

**O que não serve.** A quantidade de opções do Customize: o ENSPACE tem cinco campos que valem
agrupamento, não trinta. E o cálculo no topo disputa espaço com a contagem; no ENSPACE cabe
melhor no pé, que é o pedido da demanda.

---

## 2. Notion

**Como resolve.** O menu do canto superior direito abre **Group**, **Sub-groups**, **Layout**
(tamanho do cartão e prévia) e **Properties** (quais campos aparecem no cartão, com olho para
ligar e desligar e `⋮⋮` para arrastar a ordem). Cada coluna pode ser reordenada por arraste do
cabeçalho, escondida pelo menu de três pontos e pintada pela cor do campo do agrupamento.

O número cinza à direita do nome da coluna é **clicável** e vira uma calculadora: contagem
(todas, com valor, únicas, vazias, não vazias), porcentagem (vazias, não vazias), data (mais
antiga, mais recente, intervalo) e número (soma, média, mediana, mínimo, máximo, intervalo).

**URL.** `notion.com/help/boards`

**O que serve.** A lista de cálculos, que é a mais completa das oito e cabe inteira no ENSPACE
(contagem, soma, média, máximo, prazo mais próximo). Ligar e desligar campo do cartão com
reordenação. O sub-agrupamento como caminho futuro.

**O que não serve.** O cálculo no cabeçalho: no ENSPACE o cabeçalho já carrega nome, contagem
e cor, e o pedido é um rodapé.

---

## 3. Twenty CRM

**Como resolve.** No topo de cada coluna há um número clicável que abre um menu de agregação:
contagem, soma, média, mínimo, máximo sobre campos numéricos. O caso clássico é somar o valor
dos negócios por estágio. Os campos do cartão se configuram em **Options**, com olho para
visibilidade e arraste para ordem, e existe uma **Compact view** que esconde todos os campos e
deixa só o título.

**URL.** `docs.twenty.com/user-guide/views-pipelines/capabilities/kanban-views` e os PRs
`twentyhq/twenty#8833` e `#9233`

**O que serve.** A densidade como chave, não como preferência escondida: "compacto" é um botão.
E o cuidado com o que a conta considera: o próprio repositório registra o bug de a contagem
total não respeitar coluna oculta (issue `#11067`), que é exatamente a armadilha do
totalizador.

**O que não serve.** O menu de agregação por sub-menu com marca de seleção fica longo demais
para um rodapé estreito.

---

## 4. Monday

**Como resolve.** O menu de configurações do Kanban tem **Divide by**, que escolhe o campo que
vira raia (grupos do quadro, Status, coluna de conexão) e uma caixa **Hide empty groups**. Os
campos do cartão são escolhidos um a um, inclusive campos de subitem, e podem ser **editados
direto no cartão**, sem abrir.

O totalizador é o **Show Column Summary**: ligado nas configurações da coluna, ele aparece **no
pé do grupo**, para colunas de status, pessoas, números e outras.

**URL.** `support.monday.com/hc/en-us/articles/360000661379-The-Kanban-View`

**O que serve.** É a referência mais próxima do que a demanda pede: **o resumo mora no pé**.
E "ocultar grupos vazios" resolve a raia vazia que hoje ocupa uma coluna inteira.

**O que não serve.** Ligar o resumo pelas configurações da coluna esconde demais. No protótipo
o rodapé já está lá e o cálculo se troca clicando nele.

---

## 5. Pipefy

**Como resolve.** Cada fase é uma coluna com nome, e a fase carrega descrição, SLA,
responsáveis e alertas. O SLA por fase pinta o cartão atrasado, e o "tempo total na fase" é
contado pelo produto.

**URL.** `help.pipefy.com/en/articles/6004057-what-is-kanban-view` e
`help.pipefy.com/en/articles/614592-what-are-phases`

**O que serve.** O atraso como propriedade da fase, não só do cartão: é o que justifica o
cálculo **Atrasadas** no rodapé da raia, e a borda vermelha à esquerda do cartão vencido.

**O que não serve.** A fase do Pipefy é etapa de processo com configuração própria. A raia do
ENSPACE é um agrupamento que troca de campo, então não pode carregar configuração pesada.

---

## 6. Linear (extra: gestão de trabalho)

**Como resolve.** **Display options** define agrupamento (status, responsável, projeto,
prioridade, ciclo, etiqueta, pai, equipe, cliente, release, SLA), ordenação (manual, prioridade,
criação, atualização, prazo) e **quais propriedades aparecem** no cartão (id, status,
responsável, prioridade, SLA, projeto, prazo, marco, ciclo, release, estimativa, etiquetas,
links, tempo em status, datas, PRs). Descrição **nunca** aparece no cartão. Swimlanes podem ser
recolhidas.

**URL.** `linear.app/docs/display-options` e `linear.app/docs/board-layout`

**O que serve.** Duas coisas, e as duas entraram na proposta: **descrição fora do cartão por
padrão** (a documentação é explícita: cartão não mostra descrição) e o aviso de que, com muita
propriedade, nem tudo cabe. E ordenação manual que, ao trocar por um campo, faz o arraste mudar
só o grupo, não a posição.

**O que não serve.** A densidade extrema do Linear depende de vocabulário que a pessoa já
decorou. No ENSPACE, quem usa tarefa rápida não é usuário diário de ferramenta de engenharia.

---

## 7. Jira (extra: gestão de trabalho)

**Como resolve.** A coluna aceita **constraint** (Max work items). O Jira mostra o limite ao
lado do nome da coluna e **pinta a coluna** quando ela passa do limite. O limite se define pelo
menu da própria coluna. Swimlanes são configuradas por JQL, história, responsável ou épico. O
layout do cartão escolhe quais campos padrão aparecem.

**URL.** `support.atlassian.com/jira-software-cloud/docs/configure-columns/`

**O que serve.** O limite por raia com aviso visível, que virou o item "Definir limite de
cartões" do menu da raia. É o único dos oito que trata excesso de trabalho como problema de
tela.

**O que não serve.** Configurar swimlane por consulta. No ENSPACE o agrupamento tem que ser um
clique, não uma linguagem.

---

## 8. Asana (extra: gestão de trabalho)

**Como resolve.** O board liga data, responsável e campos personalizados no cartão, com a
configuração **separada** da configuração de colunas da lista. Dá para colorir o cartão por
campo personalizado, ordenar dentro da coluna por prazo ou prioridade e criar subgrupos em
linhas.

**URL.** `help.asana.com/s/article/board-view`

**O que serve.** Ordenar dentro da coluna por prazo é o padrão que resolve o caso mais comum
do ENSPACE: o que vence primeiro fica em cima.

**O que não serve.** Colorir o cartão inteiro por campo. Com quatro prioridades e quatro
situações, o quadro vira semáforo.

---

## O padrão que todos seguem

1. **Agrupar, ordenar e escolher os campos do cartão são controles da barra do quadro**, em
   cima, e mudam o que está na tela. Nenhum dos oito pede para criar outra visualização.
2. **Os campos do cartão são uma lista de ligar e desligar**, com ordem arrastável. Em cinco
   dos oito, o padrão de fábrica **não** inclui a descrição.
3. **A coluna tem menu próprio**: recolher, esconder, reordenar, e em alguns casos limite.
4. **Existe um número agregado por coluna**, clicável, com contagem, soma, média, mínimo e
   máximo. Notion, Twenty e ClickUp colocam no topo; Monday coloca no pé.
5. **Coluna vazia pode sumir**: "hide empty groups" aparece em ClickUp, Monday e Notion.
6. **O quadro não pagina.** Carrega mais por coluna, nunca "500 por página" no rodapé da tela.

Divergir de qualquer um desses seis custa aprendizado de quem usa e precisa de motivo escrito.
O ENSPACE hoje diverge de todos os seis: o que existe está no modal de criação da
visualização, e o rodapé é o da página.

## O que nenhum deles faz

1. **Nenhum mostra de onde a tarefa veio.** Os oito tratam o cartão como coisa autônoma. No
   ENSPACE a tarefa rápida é filha de um chamado ou demanda, criada por spaceflow, e essa
   origem é a primeira pergunta de quem abre o quadro: "de qual chamado é isso?". Mostrar o
   código do registro no cartão é vantagem que só o ENSPACE pode ter.
2. **Nenhum diz que a tarefa pede formulário antes de abrir.** Nos oito, abrir o cartão é
   barato. No ENSPACE, `crud` e `form` abrem um formulário com campos obrigatórios e
   condicionais, e `generic` só precisa de um clique. Separar os dois no cartão economiza
   abertura.
3. **Nenhum soma pontos de tarefa criada por automação.** Os cálculos são pensados para
   trabalho planejado por gente. Aqui o quadro inteiro nasce de spaceflow, então o rodapé
   responde outra pergunta: "quanto trabalho o fluxo jogou nesta raia hoje?".

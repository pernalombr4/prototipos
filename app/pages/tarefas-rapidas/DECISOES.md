# Decisões — Tarefas rápidas

## Rodada 1 — 21/09/2026

### A decisão que orienta todas as outras

A investigação no develop mostrou que **agrupar, ordenar, filtrar e montar o cartão já existem
no produto**, dentro de `+ Visualizar › Nova Visualização › Kanban`. O que falta não é a
função: é o **lugar**. Hoje elas são decisão de nascimento da tela; quem está usando o quadro
não alcança nenhuma delas.

Então a proposta não inventa recurso novo. Ela **traz para a barra do quadro o que já está no
modal de criação**, e acrescenta duas coisas que o produto de fato não tem: o totalizador no
pé da raia e os campos que faltam no cartão.

Isso muda o custo de implementar: a maior parte é mover controle de lugar e reusar o que o
`EnKanbanBoard` já faz.

---

### 1. Cabeçalho

| O que | Por quê |
|---|---|
| Três linhas: trilha e visualizações, comandos, estado | Hoje a barra mistura busca, período e quatro ícones sem rótulo numa linha só |
| `Filtros`, `Agrupar`, `Ordenar`, `Cartão`, `Período` como botões com o valor escrito ao lado | O padrão dos oito produtos pesquisados. O botão diz o que está valendo: `Agrupar: Situação` |
| Selo com a contagem de filtros ligados | Sem isso, filtro ligado some e a pessoa acha que o quadro está vazio |
| Terceira linha com os chips do que está filtrado, cada um com X | O caminho de volta. Era o que faltava para o filtro não virar armadilha |
| `Raias` ganha rótulo | É o ícone `Colunas` de hoje, que já faz marcar, ocultar, reordenar e fixar, escondido atrás de um ícone mudo |
| `Reports`, `Exportar`, `Arquivadas`, `Lixeira` viram um menu `Mais` | Regra 16: o endereço continua na direita, o peso visual é que baixa |
| `Nova tarefa` continua primário, na ponta direita | Regra 16 |
| Atalhos de período (hoje, 7 dias, 30 dias) e a escolha do campo de data | O `Criado em` de hoje já escolhe entre criação e vencimento, mas o calendário só aceita dia ou intervalo |
| A faixa vazia de `Filtros Rápidos` sai | Ocupa altura e não entrega nada |

### 2. Cartão fechado

| O que | Por quê |
|---|---|
| Título em duas linhas, sem capitalização por CSS | `Revisar Resposta Ao Cliente So...` some. O título volta a ser a frase que a pessoa escreveu |
| A data do cartão é o **prazo**, não a criação | Hoje o cartão mostra `created_at`. Tarefa vencida ontem aparece com a data de hoje |
| Cartão atrasado ganha borda esquerda vermelha e o selo com os dias | Atraso é o dado que muda a ordem do dia |
| Linha de identificação com o ícone do tipo e os 6 primeiros caracteres da referência | 32 caracteres ninguém lê. 6 bastam para conferir com a URL |
| Rodapé numa linha: prioridade, prazo, pontos, formulário, responsável | Hoje cada um desses ocupa uma linha inteira, e três deles nem aparecem |
| Prioridade `normal` não vira selo | 107 das 128 tarefas são normais. Selo em tudo é selo em nada |
| Descrição desligável, e fora do modo compacto | Linear não mostra descrição no cartão. Aqui ela fica, porque o spaceflow escreve instrução na descrição, mas quem manda é a pessoa |
| Três densidades: compacto, padrão, completo | Regra 26: densidade tem piso. Compacto é uma linha de título mais rodapé, não uma linha só |
| O cartão inteiro é o alvo de clique, pelo link esticado no título | Regra 25. O menu ⋮ é botão de verdade, com `z-10` |

**O cartão com todos os campos** é a primeira tarefa do mock (`Revisar a resposta ao
cliente...`, id 22078): urgente, atrasada, 13 pontos, com prazo, responsável, dois
colaboradores, duas etiquetas, chamado de origem, formulário e tarefa de notificação. Ela
existe para provar o pior caso. Em densidade `completo` ela ocupa cerca de 200 px de altura, e
é o limite do que cabe antes de o cartão virar formulário.

### 3. Cartão aberto

| O que | Por quê |
|---|---|
| Painel em três camadas: o que se decide, o que se responde, o rastro técnico | Hoje os DETALHES misturam ID e responsável na mesma lista |
| Situação e prioridade viram seletores no cabeçalho | Hoje a prioridade **não aparece** no painel, nem para ler |
| Prazo, pontos, tipo, colaboradores e etiquetas entram | Estão no payload e não estão na tela |
| O registro de origem vira um bloco com código, título e botão | Hoje é `Ticket: -`, sem link |
| O formulário da tarefa é renderizado com as condicionais funcionando | É o trabalho de verdade: `meta.form` traz `EnlDropdown` e `EnTextArea` com `%campo%` |
| Tarefa concluída mostra `meta.form_result` como lista de pergunta e resposta | O que foi respondido é a memória da decisão |
| `Guardar progresso` vira `Salvar sem concluir` | Português de Portugal no meio de pt-BR |
| O selo `pending` vira `Pendente` | Valor cru na interface |
| Dados técnicos recolhidos no fim | Ninguém abre uma tarefa para ver `node_execution` |

### 4. Raias

| O que | Por quê |
|---|---|
| Menu próprio: nova tarefa aqui, recolher, limite, ocultar | Notion, ClickUp, Jira e Monday têm menu por coluna |
| Recolher vira trilho vertical que continua contando | O quadro tem quatro raias e duas costumam estar vazias |
| `Ocultar raias vazias` na configuração do agrupamento | ClickUp, Monday e Notion |
| Limite de cartões, com o cabeçalho em vermelho ao passar | Jira. É o único jeito de a tela falar sobre excesso |
| `Ver mais 8` no fim da raia, no lugar de `500 por página` | Nenhum dos oito pagina quadro |
| Agrupamento troca as raias na hora: situação, prioridade, responsável, tipo, prazo | Tipo e prazo não existem no produto hoje. Prazo é o mais pedido: põe atrasadas na primeira raia |

### 5. Totalizador

O rodapé fica **preso no pé de cada raia**, sempre visível, e o cálculo se troca clicando
nele. Oito cálculos: tarefas, soma de pontos, média de pontos, maior pontuação, atrasadas, sem
responsável, prazo mais próximo e nenhum. `Atrasadas` e `Sem responsável` acendem em vermelho
quando o número é maior que zero. O padrão é **soma de pontos**, porque a contagem já está no
cabeçalho da raia.

Cada raia guarda o próprio cálculo. Monday e Notion fazem assim, e resolve o caso real: somar
pontos em Pendente e contar atrasadas em Bloqueada.

**Atenção para quem for implementar:** o número conta o que está filtrado, não o total da
raia. É a armadilha que o ClickUp documenta e que o Twenty registrou como bug (issue #11067).

---

## O que é maquete

Interação que está na tela e não funciona de verdade:

1. **`+ Visualizar`, as visualizações salvas e os itens de `Mais`** (Relatórios, Exportar,
   Arquivadas, Lixeira) são botões sem destino.
2. **`Abrir registro`** no bloco do chamado não navega. O item não vem no payload da tarefa;
   viria de `GET /ws/types/{slug}/items/{reference}`, que é chamada de rede e está proibida.
3. **Comentários e Histórico** abrem estado vazio. As rotas `/tasks/{id}/comments` e
   `/permissions` devolvem 404, mas a tela de hoje tem as duas abas.
4. **Arrastar entre raias** funciona para situação, prioridade e responsável. Nos
   agrupamentos por tipo e por prazo o arraste não faz nada: mudar a faixa de prazo pelo
   arraste mudaria a data, e isso precisa de uma decisão que não é desta tela.
5. **Copiar referência** mostra o toast sem escrever na área de transferência.
6. **Reordenar raia por arraste** não está implementado. O controle existe hoje no popover de
   `Colunas`, com arraste e fixar, e foi mantido como lista de marcar e desmarcar.
7. **`Editar` e `Duplicar`** do menu do cartão não abrem nada.
8. Tudo é estado em memória. Recarregar a página zera.

## Divergências registradas

1. **`external_task`**: o payload real devolve objeto ou `null`; o schema
   `@be-enlighten/enspace-sdk-schemas` declara número. O mock segue o schema e o campo está
   comentado no `mocks.ts`.
2. **`type`**: a demanda cita três valores (`crud`, `form`, `generic`); o schema declara cinco,
   com `start` e `approval`. O mock usa `approval` em duas tarefas, porque o agrupamento por
   tipo precisa aguentar os cinco.
3. **O nome "raia"**: a demanda chama de raia o que o produto chama de coluna no popover
   `COLUNAS VISÍVEIS`, e o que o mercado chama de coluna no board e de swimlane na horizontal.
   O protótipo escreve **raia** na interface, seguindo a demanda, e o handoff precisa decidir
   se o produto passa a chamar assim em todo lugar (regra 29).

## O que ficou de fora, de propósito

- **Sub-agrupamento** (raias horizontais dentro da coluna), que Notion, ClickUp e Asana têm.
  Com cinco campos de agrupamento e quatro situações, o quadro do ENSPACE ainda não pede. Fica
  registrado como o próximo passo natural.
- **A visão de tabela.** O produto já oferece `Tabela` como tipo de visualização no modal de
  criação, então o alternador de forma já existe e não precisa ser reinventado aqui
  (regra 15).
- **O modal de criação de tarefa.** Está na tela porque o botão precisa levar a algum lugar,
  com os campos de hoje mais pontos. Redesenhar o modal é outra jornada (regra 19).

## Sobre o `EnKanbanBoard`

A proposta **não substitui** o componente do SDK: ela descreve o que ele precisa ganhar. O
`EnKanbanBoard` de hoje já tem `groupBy`, `columns`, `defaultColumnSortField`,
`managedColumns`, `columnVisibility`, `columnOrder`, `showHeaderColumnControls`, arraste,
`doneStatus` e menu de contexto no cartão. Falta, para chegar nesta tela:

| O que falta | Como |
|---|---|
| Rodapé por coluna | `slot #column-footer` ou prop `columnSummary: { calc, field }` |
| Menu da coluna com limite e recolher | `columnLimit?: Record<string, number>` e `collapsedColumns?: string[]` |
| Campos do cartão ligáveis em tempo de uso | o `EnKanbanCardConfig` já existe; falta ele ser reativo e a barra que o edita |
| Carregar mais por coluna | `pageSizePerColumn` mais evento `load-more` |
| Densidade | `cardDensity: 'compact' \| 'default' \| 'full'` |

O estado `Como é hoje` do andaime renderiza o `EnKanbanBoard` de verdade, com o mesmo dado,
configurado como o develop configura. É a comparação lado a lado.

## Autocrítica

- **O rodapé pode ser lido como paginação.** Fica no mesmo lugar onde hoje está o `500 por
  página`. Mitiguei com o ícone de somatório e o rótulo do cálculo escrito, mas é a primeira
  coisa a testar com alguém de verdade.
- **Cinco controles na barra é muito para tela pequena.** Abaixo de 1200 px eles quebram em
  duas linhas. A saída seria agrupá-los num `Ajustar quadro`, e aí a função volta a ficar
  escondida, que é o problema que esta rodada resolve. Preferi a linha que quebra.
- **A cor da raia ficou só na bolinha e no ícone.** O quadro de hoje pinta o fundo inteiro da
  coluna com gradiente. Tirei porque com cinco agrupamentos o fundo colorido deixa de
  significar situação, e aí engana. Se ela quiser o gradiente de volta, ele volta como opção
  do menu de agrupamento, como o `Color columns` do Notion.
- **Não testei com 128 cartões numa raia só.** O mock tem 24 tarefas. O `Ver mais 8` resolve a
  rolagem, mas a conta do totalizador sobre 128 itens em memória ainda é barata; sobre
  milhares, não (regra 34). Com volume, o cálculo tem que vir do back, por
  `GET /tasks/count` com os mesmos filtros.

---

## Auditoria do próprio trabalho, antes de entregar

### Acessibilidade (`design:accessibility-review`, WCAG 2.1 AA)

Medi o contraste no navegador, nos dois temas, com o quadro cheio.

| # | Achado | Critério | Onde | O que fiz |
|---|---|---|---|---|
| 1 | Referência do cartão em `text-dimmed`, 11 px, dava **4,11:1** no tema escuro | 1.4.3 | cartão fechado | passou para `text-muted`, **6,47:1** |
| 2 | Rótulo do totalizador em `text-dimmed` sobre `bg-elevated/60` dava **4,39:1** no tema claro | 1.4.3 | rodapé da raia | rótulo em `text-toned` e fundo sólido, **7,34:1** |
| 3 | Rótulos do painel (`dt`) e títulos das seções dos popovers em `text-dimmed` | 1.4.3 | painel e barra | todos para `text-muted` |
| 4 | O valor do totalizador era um número solto, sem ligação com o rótulo para leitor de tela | 4.1.2 | rodapé da raia | ganhou `role="status"` e `aria-label` com o cálculo e o valor |
| 5 | A raia recolhida respondia a Enter, não a Espaço | 2.1.1 | raia recolhida | responde aos dois |

Medições depois da correção, no tema claro: rodapé **7,34:1**, referência **4,77:1**, botão da
barra **9,39:1**. No escuro: rodapé **6,92:1**, referência e descrição **6,47:1**, título da
raia e valor do totalizador **20,99:1**.

**O que ficou sem corrigir, e por quê:**

- **Arrastar cartão não tem equivalente de teclado.** O caminho por teclado existe e é outro:
  o menu do cartão tem `Mover para` com as quatro situações, alcançável por Tab. Manter o
  arraste acessível de verdade (com `aria-grabbed` e teclas) é trabalho de implementação, não
  de protótipo, e entra no handoff.
- **Alvos de 24 px** nos botões de ícone das raias e dos cartões. Passa no mínimo de 24x24 do
  WCAG 2.2 AA, não chega nos 44 px do critério AAA. Num quadro denso, 44 px empurraria duas
  informações para fora do cartão. Fica declarado.
- **O ícone do tipo no cartão** segue em `text-dimmed` (4,11:1 no escuro). É gráfico
  decorativo com rótulo em tooltip, e o critério de não texto é 3:1.

### Crítica de design (`design:design-critique`)

**Primeira impressão.** O que puxa o olho primeiro é o selo vermelho de atraso, e é isso
mesmo que se quer: a pergunta que abre o quadro é "o que está atrasado?". O segundo é o
número do rodapé, que era o que faltava.

| Achado | Gravidade | O que fiz |
|---|---|---|
| `Ordenar: Prazo` não dizia se era crescente ou decrescente | Moderado | o ícone do botão agora aponta para cima ou para baixo |
| Em densidade `padrão` com etiquetas o cartão chega a três linhas empilhadas antes do rodapé | Moderado | é o preço de mostrar etiqueta. Quem não quer desliga no `Cartão`, e o `Compacto` já tira |
| A linha de estado ("24 tarefas") fica órfã quando não há filtro ligado | Menor | mantida: é a âncora dos chips, e some visualmente por ser texto pequeno |
| Título e descrição, os dois com corte em duas linhas, ainda podem cortar no meio da frase | Menor | a descrição é desligável e já nasce fora do compacto. O título em duas linhas cobre 9 de 10 casos do mock |
| O menu ⋮ do cartão só aparece no hover | Menor | aceito: é o padrão dos oito produtos, e aparece também no foco por teclado |

**O que funciona:** a barra diz o que está valendo sem abrir nada (`Agrupar: Situação`,
`Ordenar: Prazo`); trocar o agrupamento redesenha o quadro na hora e o totalizador acompanha;
o cartão atrasado se identifica por três sinais somados (borda, selo e ordem).

---

## Rodada 2 — 21/09/2026

### O que ela pediu, literal

> ta ruim como voce fez. simule exatamente a tela do enspace como voce viu. o menu lateral do
> enspace ali ocupando o espaço que ele ja ocupa na esquerda, o header, o breacrumb... tudo o
> que ja existe hoje, pra garantir que vce ta mexendo SÓ no kanban, nao no resto da estrutura.
>
> e tente colocar isso como regra nos seus docs. que simula tudo 100% igual e só mexe no que é
> preciso. facilita os devs.

### O que mudou

**A tela agora vem inteira.** O quadro passou a viver dentro do `_CascaDoEnspace.vue`, que
reproduz o que o develop tem hoje:

- **menu lateral** com as três seções na ordem real (Membro, Configurações, Ajuda), os vinte
  itens, os chevrons de quem expande, `Tarefas` aberta com `Agendadas` e `Rápidas`, e
  `Rápidas` marcada como a tela atual. Recolhe para trilho de ícones pelo botão redondo da
  borda, como no produto;
- **barra do topo** com recolher, voltar, avançar, recarregar, início, a faixa arredondada da
  trilha (`Produtos › Tarefas › Rápidas`) com `CTRL` `B` e a estrela, e à direita idioma,
  tema, `Suporte`, sino e o avatar com bolinha verde;
- a lista do que foi copiado está no `BRIEFING.md`, em "A casca da tela, item por item", para
  a cópia poder ser conferida.

**A fronteira, em uma linha:** a proposta mexe **no conteúdo da tela de Tarefas Rápidas**
(barra de comandos, cartão fechado, cartão aberto, raia e totalizador) e **não mexe** em menu
lateral, barra do topo, trilha, atalhos nem no lugar de nenhum deles.

**Duas correções que vieram junto:**

1. **a trilha saiu da minha barra de comandos.** Eu tinha repetido `Produtos › Tarefas ›
   Rápidas` dentro do conteúdo, e no produto ela mora só na barra do topo. Era invenção minha,
   e sumiu;
2. **o `text-dimmed` que sobrava virou `text-muted`** em todo texto (a outra sessão mediu
   3,03:1 sobre branco). Sobraram 11 usos, todos em ícone, onde o critério é 3:1.

**A única coisa da casca que a proposta substitui** é o rodapé de paginação da página inteira
(`Mostrando 1 a N de N resultados`, `500 por página`), que vira `Ver mais` por raia. Está
declarado aqui e no briefing, e é mudança pedida pela demanda, não licença que eu tomei.

### O que virou regra

Isto deixou de ser decisão deste protótipo e virou **regra 37** da Parte 6 do
`AGENTE_PROTOTIPOS.md`, com um bloco próprio no `CLAUDE.md`: a tela vem inteira, a casca se
copia olhando o develop, mora em componente próprio marcado como "nada aqui é proposta", a
lista do que foi copiado entra no briefing, a fronteira vai no `DECISOES.md`, e a casca não
ganha melhoria de passagem. Se a proposta só couber mexendo na casca, isso é achado, não
licença.

---

## Rodada 3 — 21/09/2026

### O que ela pediu, literal

> e tambem prototipe vendo como é a quickview de tarefas rapidas (como ela abre na aba
> lateral), porque é nosso componente padrao de sidebar. olhe nossa sidebar de hoje e simule
> só MELHORIAS naquilo ali, nao mudanças estruturais como ta hoje

### O que eu tinha feito errado na rodada 1

O painel que entreguei era **outra coisa**: eu tinha jogado fora o trilho de ícones, trocado
as abas por botões meus, empilhado tudo em três camadas ("o que se decide, o que se responde,
o rastro técnico") e colocado seletores de situação e prioridade no cabeçalho. Era
reestruturação, não melhoria. Agora o painel voltou a ser o componente de hoje.

### A estrutura, que ficou igual

Medida no develop antes de mexer (está no `BRIEFING.md`, em "A quickview, item por item"):

| Peça | Como está no protótipo |
|---|---|
| Painel à direita, altura inteira, canto esquerdo arredondado | igual, 700 px |
| Trilho de ícones na borda esquerda, valor no hover | igual |
| Botão de expandir no pé do trilho | igual |
| Abas Tarefa, Comentários, Logs no topo | igual |
| Cabeçalho com título, selo da situação, `Prazo` e `Referência` | igual |
| Seção com ícone e nome ("Descrição") | igual |
| Comentários com estado vazio e o campo de escrever no rodapé | igual, com `@` e Ctrl+Enter no texto de ajuda |
| Logs em linha do tempo: bolinha, avatar, selo da ação, frase, data e tempo relativo | igual |
| Rodapé com guardar e concluir | igual |

### As melhorias, dentro dessa estrutura

| # | O que | Por quê |
|---|---|---|
| 1 | **Expandir o trilho alarga o painel** (700 px para 980 px) em vez de roubar espaço do conteúdo | Hoje a coluna de detalhes come o conteúdo: a descrição cai para 330 px e o editor ganha barra de rolagem horizontal |
| 2 | **O trilho ganha os cinco campos que faltavam**: prioridade, pontos, tipo, etiquetas e colaboradores | Estão no payload e não apareciam em lugar nenhum do painel. Agora são treze ícones, na mesma régua |
| 3 | **Campo sem valor fica apagado, não some** | É o comportamento que o "Concluída em" já tem hoje, agora valendo para todos |
| 4 | **Prioridade urgente e prazo vencido acendem em vermelho no trilho** | Dá para ver o que pega sem abrir nada |
| 5 | **Botão de fechar (X) na barra de abas** | Hoje o painel só sai no Esc ou clicando fora |
| 6 | **O selo da situação vira `Pendente`, com a cor da raia** | Hoje mostra `pending`, cru |
| 7 | **`Guardar progresso` vira `Salvar sem concluir`** | Português de Portugal no meio de pt-BR |
| 8 | **A referência mostra 6 caracteres com botão de copiar** | Hoje são os 32 caracteres inteiros, na linha de meta |
| 9 | **O prazo ganha a leitura relativa** ("Atrasada 2 dias") ao lado da data | A data sozinha obriga a fazer a conta |
| 10 | **O título não é mais repetido nem centralizado** quando o trilho abre | Hoje ele aparece duas vezes, e a segunda vez centralizado |
| 11 | **A barra do editor da descrição só aparece ao focar o texto** | Hoje ela está sempre lá, com onze botões, num painel que na maior parte do tempo é de leitura |
| 12 | **O registro de origem mostra código e título** no lugar de `-` | O `Ticket: -` de hoje não diz de qual chamado a tarefa veio |
| 13 | **O tempo relativo passa a dias acima de 24 horas** | "há 101 horas" não se lê |

### O que NÃO mudou, de propósito

- **Editar situação, prioridade e responsável continua fora do painel.** Hoje o painel não
  edita nenhum desses campos, e o caminho é o menu do cartão (`Mover para`, `Editar`). Mudar
  isso seria reestruturação.
- **O trilho continua sendo ícone sem rótulo em repouso.** É o desenho do componente; o que
  melhorou foi o conteúdo do cartãozinho que abre e a cor de quem pede atenção.
- **A largura de 700 px continua a mesma** no estado recolhido.
- **A seção de formulário é proposta, não cópia**: não consegui abrir a quickview de uma
  tarefa de formulário no workspace de exploração, porque lá não há tarefa criada por
  spaceflow. Está declarado no `BRIEFING.md`.

### Um defeito meu, corrigido

O cartão do quadro não abria com clique de mouse, só por teclado ou por código. O `line-clamp`
estava no `<h3>`, e `line-clamp` liga `overflow: hidden`, que **recortava o `after:inset-0` do
link esticado**: a área clicável virava só a caixa do título. O corte passou para um `<span>`
dentro do link, e o cartão inteiro voltou a ser clicável. Regra 25 continua valendo, e agora
funciona de verdade.

---

## Rodada 4 — 21/09/2026

### O que ela pediu, literal

> e saiba que o totalizador na base das raias pode somar qualquer campo que seja do tipo
> numero ou valor monetario, veja no payload quais sao possiveis alem de ponto.
>
> e a ordenaçao deve ser possivel por raia tambem, nao só no botao de ordenar global

### 1. O totalizador passou a ser campo mais operação

Antes era uma lista de oito cálculos fechados. Agora o rodapé escolhe **um campo** e **uma
operação**, e a lista de campos **sai do próprio dado carregado**.

**A resposta à pergunta "quais são possíveis além de ponto":** no ENSPACE o tipo numérico é um
só, **`EnlNumber`**, e **moeda não é um tipo à parte**: é o mesmo campo com
`cFormat.n_style: 'currency'`. O `cFormat` também carrega `locale`, `n_currencyDisplay` e
`n_minimumFractionDigits`, que é o que formata `R$ 11.800,00`. O inventário completo está no
`BRIEFING.md`, em "O que dá para somar".

Na tarefa, isso dá:

- **`points`**, o único número de negócio que a tarefa tem;
- **cada resposta numérica do formulário**, em `meta.form_result`. A definição vem junto, em
  `meta.form`, então o quadro sabe quais respostas são `EnlNumber` e como formatá-las **sem
  chamada a mais**. No mock isso aparece como "Horas estimadas de correção" (decimal), "Custo
  estimado do retrabalho" (moeda) e "Valor do pedido" (moeda);
- **contagens derivadas** (tarefas, atrasadas, sem responsável) e o **prazo mais próximo**, que
  não são campo mas respondem à mesma pergunta.

Operações: soma, média, mínimo, máximo e preenchidas. Campo derivado não tem operação, porque
contar é o que ele faz.

**Duas coisas que o desenho precisou dizer em voz alta:**

1. **`meta.form_result` só existe depois de concluída.** Somar "Custo estimado" na raia de
   pendentes dá vazio, e isso não é defeito. O rodapé mostra **quantas tarefas da raia têm
   aquele campo preenchido** e escreve "sem valor" quando não há nenhuma. É o mesmo cuidado que
   o ClickUp documenta (tarefa escondida por filtro não entra na conta) e que o Twenty
   registrou como bug (issue #11067).
2. **Campo numérico do item não entra**, porque não vem no payload da tarefa. Somar "valor do
   contrato" por raia exigiria uma chamada por item. Está declarado como decisão de back-end.

### 2. A ordenação agora é por raia também

O menu da raia ganhou **"Ordenar só esta raia"**, com os mesmos seis campos do botão global,
mais a direção e um **"Usar a ordem do quadro"** para voltar atrás. A raia com ordem própria
mostra uma seta ao lado da contagem, com o campo no tooltip: sem isso, uma raia fora da ordem
do quadro parece defeito.

**Isto não é invenção: o componente do produto já aceita.** O `EnKanbanColumn` do
`@be-enlighten/enspace-sdk-ui` tem `sortByField` e `sortDesc` **por coluna**, ao lado do
`defaultColumnSortField` do board. A capacidade está no SDK desde sempre; o que faltava era a
tela deixar escolher. É o mesmo padrão da rodada 1: a função existe, o lugar é que não.

Regra do desenho: **a raia manda sobre o quadro**. Trocar a ordem global não apaga a ordem que
a pessoa definiu numa raia; quem apaga é o "Usar a ordem do quadro".

### O que isso pede do back

Hoje o protótipo calcula em memória, sobre as tarefas carregadas. Com volume, os dois pedidos
viram chamada:

- o totalizador precisa de agregação com os mesmos filtros da tela, algo como
  `GET /tasks/count` e um `sum`/`avg` por campo, inclusive sobre chave de `form_result`;
- a ordem por raia precisa de `_sort` por requisição de coluna, já que cada raia pagina sozinha.

Está no `COMPONENTES-CUSTOM.md`, na linha do `_RaiaDoQuadro`.

---

## Rodada 5 — 21/09/2026

### O que ela pediu, literal

> a esquerda da nossa sidebar ta melhor que a que voce desenhou. no sentido de organizaçao dos
> campos. o icone ali no alto, o titulo grande, a badge de status... deixe o seu mais
> elaborado. o nosso tem icones, ta tudo bonitinho.
>
> voce deve ajustar o seu pra ficar igual OU melhor. pode melhorar a barra se quiser.
>
> alem disso, garanta que ao abrir a tarefa o user possa editar todos os campos aos quais têm
> acesso no form de criaçao da tarefa. e copie do nosso modelo o form de criaçao (os campos
> dele). mas pode deixar mais bonito o form de criaçao se for o caso, considerando padrao de
> mercado ok?

### 1. A coluna de identidade voltou, e ela estava certa

**Isto reverte a melhoria 10 da rodada 3.** Eu tinha tirado o ícone, o título e o selo do topo
da coluna expandida, chamando de duplicação. Ela está certa: aquela composição é boa, e o
problema nunca foi ter identidade na coluna; era o título aparecer **duas vezes**.

Agora a coluna expandida tem, na ordem do produto:

1. o rótulo **TAREFA**;
2. o **ícone do tipo** da tarefa, dentro de um quadrado arredondado em cor primária. No
   produto o ícone é sempre o mesmo; aqui ele diz se é formulário, ação em registro, aprovação
   ou simples;
3. o **título**, grande e centralizado;
4. a **referência curta** embaixo, em mono;
5. os **selos**: situação, prioridade (quando não é normal) e tarefa de notificação;
6. a lista **DETALHES**, com ícone por campo, como hoje.

E a duplicação sumiu pelo outro lado: **com a coluna aberta, o cabeçalho do conteúdo some**,
porque a identidade já está à esquerda. Fechada a coluna, ele volta. Nenhum dos dois estados
mostra o título duas vezes.

### 2. Os cinco campos do formulário de criação se editam no painel

Era o que faltava para o painel resolver a tarefa sem mandar a pessoa para o menu do cartão:

| Campo | Onde se edita |
|---|---|
| **Nome** | no próprio título: clique, vira campo, Enter salva e Esc desiste. Vale nos dois estados |
| **Responsável** | seletor na lista DETALHES |
| **Prioridade** | seletor na lista DETALHES, com o ícone da prioridade |
| **Data limite** | campo de data e hora na lista DETALHES, com "Atrasada 2 dias" logo abaixo |
| **Descrição** | o editor da seção Descrição, que já existia |

Com a coluna recolhida, o cartãozinho do trilho ganhou um botão **Editar** que abre a coluna e
**acende o campo pedido** por um instante. É o caminho de volta: o trilho não vira um beco.

**O que continua só de leitura, e por quê:** pontos, tipo, etiquetas, colaboradores, registro
de origem e as datas de sistema. Nenhum deles está no formulário de criação de hoje, então
editá-los é outra decisão, não esta. **Tarefa concluída não edita nada**: o painel passa a ser
registro do que foi feito.

### 3. O formulário de criação: os campos do produto, o acabamento refeito

**Os campos são os de hoje, na mesma ordem:** Nome (obrigatório), Data limite, Descrição,
Responsável e Prioridade. Não acrescentei nada. Pontos, tipo e etiquetas não existem na
criação do produto e ficaram fora, mesmo o totalizador gostando de pontos.

O que mudou, seguindo o que Linear, ClickUp e Asana fazem:

| O que | Por quê |
|---|---|
| O **nome** ocupa a linha inteira, em tamanho maior | É o campo que decide a tarefa. Hoje ele divide a primeira linha com a data |
| O **prazo** ganhou atalhos: hoje, amanhã, semana que vem | O calendário de hoje exige três cliques para "amanhã" |
| A **prioridade** virou seletor segmentado colorido | Hoje são quatro botões de rádio quebrando em duas linhas, com a cor no selo e não no controle |
| O **responsável** ganhou "atribuir a mim" | É o caso mais comum, e hoje exige abrir a lista |
| A **barra da descrição** só aparece ao escrever | Doze botões antes de a pessoa digitar a primeira letra |
| O rodapé diz **em qual raia a tarefa nasce** | Criar pelo "+" de uma raia e a tarefa aparecer em outra é surpresa |
| Cada rótulo tem **ícone**, como no painel | Era o que ela apontou: "o nosso tem ícones, tá tudo bonitinho" |

O `(obrigatório)` escrito substitui o quadradinho vermelho de hoje, que não diz o que é.

### Maquete nesta rodada

- A **descrição** continua texto simples com barra decorativa: o editor de verdade é do
  produto, e reescrevê-lo não é o assunto da tela.
- **Editar salva no array em memória.** Recarregar zera, como o resto do protótipo.

---

## Rodada 6 — 21/09/2026

### O que ela pediu, literal

> faltam tooltips nos cards
>
> e os cards podem ter icone de: responsavel, colaborador, criador
>
> tem que organizar tudo isso.
>
> e tem que ter tooltip pras badges do card

### 1. A regra do tooltip no cartão

**Se está no cartão sem rótulo escrito, tem tooltip, e o tooltip tem a forma "Rótulo: valor".**
Num cartão denso cada ícone e cada selo é uma abreviação; sem o nome por extenso, a pessoa abre
a tarefa só para conferir o que está vendo.

| O que ganhou tooltip | O que ele diz |
|---|---|
| Ícone do tipo | `Tipo: Aprovação` |
| Referência curta | `Referência: Df4Gh1Jk8Lz5Xc2Vb9Nm6Qw3Er0Ty7Ui`, os 32 caracteres inteiros |
| Selo de atraso | `Prazo: 19/09/2026, 21:00 (Atrasada 2 dias)`, que é a data que o selo esconde |
| Cada etiqueta | `Etiquetas: Cliente VIP` |
| O selo "mais 2" | `Etiquetas: Faturamento, Onboarding`, as que não couberam |
| Selo de prioridade | `Prioridade: Urgente` |
| Chip de prazo | `Prazo: 23/09/2026, 12:25 (Vence hoje)` |
| Chip de pontos | `Pontos: 8 pontos` |
| Ícone de formulário | `Pede formulário` |
| Registro de origem | `Chamado CHA-4812: Acesso negado ao portal depois da troca de plano` |
| As três pessoas | `Criada por: Mikaela Jardim`, `Colaboradores: Mikaela Jardim, Rafael Quintanilha`, `Responsável: Bruna Sato` |

Antes desta rodada só prioridade, prazo, pontos e responsável tinham tooltip, e três deles
mostravam só o rótulo (`Prioridade`), sem o valor. Agora são dez gatilhos por cartão.

### 2. As três pessoas, organizadas

Ordem fixa, da esquerda para a direita, terminando em quem tem que agir:

| Papel | Como aparece | Por quê |
|---|---|---|
| **Criador** | ícone de caneta + avatar pequeno | Avatar sozinho não diz o papel, e criador é o mais incomum dos três |
| **Colaboradores** | ícone de pessoas + grupo de avatares, no máximo dois com "+N" | Mesmo motivo, e o grupo já é convenção para "mais de um" |
| **Responsável** | avatar maior, sem ícone, na ponta | Avatar no canto do cartão é convenção de mercado para "é dessa pessoa". Pôr ícone nele seria explicar o óbvio |

Os três são campos ligáveis na barra (`Cartão › O que aparece no cartão`). **Criador nasce
desligado**: quem criou raramente muda uma decisão no quadro, e ligado por padrão ele só
disputa espaço. Em densidade compacta, só o responsável aparece.

E o atalho **Cartão completo** do andaime agora liga **todos** os campos, não só a densidade.
É o caso de borda pedido na demanda original: um cartão com tudo aparecendo.

### 3. Um defeito que só apareceu com tudo ligado

Com os três papéis visíveis numa raia no mínimo (17 rem), o rodapé do cartão **cortava o
responsável na borda**. O rodapé passou a quebrar em duas linhas em vez de recortar, e o código
do registro de origem parou de partir no meio (`DEM-` / `1190`). Vale a pena olhar sempre no
tamanho mínimo da raia, não no confortável.

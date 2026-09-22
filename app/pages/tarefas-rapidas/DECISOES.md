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

---

## Rodada 7 — 21/09/2026

### O que ela pediu, literal

> agora melhore a funcionalidade de definir limite do cartao. eu coloco limite ali e aparece
> simplesmente 2/6 ou 4/6 enfim... de onde vem o 6?

### De onde vinha o 6: de mim

Era um número cravado no código. O item de menu não perguntava nada: ligava `6` e desligava.
Defeito meu, e dos feios, porque a tela mostrava um número com ar de configuração que ninguém
tinha configurado.

### O que passou a acontecer

**O item do menu abre um diálogo**, com quatro coisas que faltavam:

1. **o contexto**: "Pendente. Nesta raia há 11 cartões agora". O número de hoje é a informação
   que falta para escolher o limite;
2. **o campo**, com mais e menos, começando **no número que a raia tem agora** quando ainda não
   há limite, e no limite atual quando já há. Nada de valor mágico;
3. **sugestões** (3, 5, 8, 10, 15), para quem só quer um número redondo;
4. **o que o limite faz**, escrito: *"A raia avisa quando passa do limite. Ninguém fica
   impedido de mover cartão."* Esta é a decisão de comportamento, e ela precisa estar na tela,
   não na cabeça de quem implementou.

E o caminho de volta: **"Tirar o limite"** aparece no rodapé do diálogo quando existe um.

**Na raia**, o número deixou de ser mudo:

- a contagem `11/8` ganhou tooltip: `Limite de cartões: 11 de 8 cartões`. Sem limite, o
  tooltip diz `Tarefas: 11`;
- a faixa de aviso ganhou ícone e um **Editar** que reabre o diálogo. Antes ela só acusava o
  problema e deixava a pessoa procurar onde resolver.

### Duas decisões que ficam registradas

1. **O limite avisa, não impede.** É o que o Jira faz: passar do limite pinta a coluna, mas o
   cartão entra. Bloquear o arraste transforma um aviso de processo em erro de sistema, e o
   time perde o caminho para resolver o problema de verdade (que é tirar trabalho da raia).
2. **O limite é da raia, e a raia muda com o agrupamento.** Ele fica guardado pelo valor
   (`pending`, `high`, um id de pessoa), então agrupar por prioridade mostra outros limites,
   não os de situação. É o comportamento certo, e é uma coisa a mais para o back guardar:
   limite por visualização e por valor de agrupamento.

---

## Rodada 8 — 21/09/2026

### O que ela pediu, literal

> prototipe tambem a possibilidade de reordenar as raias por arraste em tela e na config das
> raias tb (no popover)

### Os dois lugares

**No quadro.** O cabeçalho da raia virou área de arraste: aparece uma pega (`⋮⋮`) à esquerda
no hover, e soltar a raia sobre outra troca as duas de lugar. A raia que vai receber fica com
borda tracejada e anel, para a pessoa ver onde vai cair.

**No popover `Raias`.** Cada linha ganhou a pega de arraste, e continua com a caixa de marcar
que já existia. Arrastar uma linha sobre outra reordena, igual ao quadro.

### O cuidado que isso exigiu

A raia já recebia arraste de **cartão**. Agora recebe dois tipos de coisa, e eles não podem se
confundir: arrastar um cartão para outra raia move a tarefa, arrastar a raia reordena o quadro.

A separação é pelo **tipo do `dataTransfer`**: cartão viaja em `text/plain`, raia viaja em
`application/x-raia`. Durante o `dragover` o navegador não deixa ler o **valor** do
`dataTransfer`, só os **tipos**, e é por isso que o realce visual (azul para cartão, tracejado
para raia) consegue ser diferente antes mesmo de soltar. Testado nos dois sentidos: mover
cartão continua mudando a contagem das raias, e arrastar raia não mexe em cartão nenhum.

### O caminho de teclado

Arraste não tem equivalente de teclado, então cada linha do popover tem também **duas setas**,
esquerda e direita, com rótulo de leitor de tela. Quem não usa mouse reordena por ali, e a
primeira e a última linha têm a seta correspondente desabilitada. É o mesmo padrão que resolve
o arraste de cartão (o `Mover para` do menu do cartão).

### Duas decisões

1. **Trocar o agrupamento zera a ordem escolhida.** As raias de "situação" não são as mesmas
   de "prioridade"; carregar a ordem de uma para a outra produziria uma sequência que ninguém
   pediu. O botão **Voltar ao padrão**, no fim do popover, faz o mesmo à mão.
2. **A ordem é da visualização, não do workspace.** Ela mora junto com filtro, agrupamento e
   campos do cartão. Para o back, é mais um campo da visualização salva: a lista de valores na
   ordem escolhida.

### Maquete

A ordem vive em memória e o reload zera, como todo o resto. E **reordenar cartão dentro da
raia** continua fora: a ordem dos cartões é a do campo escolhido em `Ordenar`, e ordem manual
por arraste dentro da coluna é outra decisão (a que o Linear avisa: escolher um campo de
ordenação desliga o arraste vertical).

---

## Rodada 9 — 21/09/2026

### O que ela pediu, literal

> melhore esse popover da calculadora da base. ta ruim. 2 dropdowns um do lado do outro é bem
> ruim. se for preciso, faça um modal de config pra ele em vez de ser dropdown ali no clque
> mesmo. se nao der pra organizar assim. mas siga padrao de outros sistemas tipo clickup,
> notion etc que tem esses totalizadores/calculadores de base de tabela e/ou kanban

### O que o mercado faz, e o que eu tinha feito

Fui conferir os quatro que fazem isso:

| Produto | Como resolve |
|---|---|
| **Notion** | O número do grupo abre **um menu, uma coluna**. O campo não se escolhe: é a coluna clicada. O menu lista só os cálculos |
| **ClickUp** | Igual: passa o mouse no fim da coluna, `Calculate`, **uma lista** de total, média, mínimo, máximo, contagem |
| **Airtable** | Rodapé por coluna, **um dropdown** com as funções de resumo |
| **Twenty** | É kanban, como aqui, então o campo precisa ser escolhido: resolve com **um menu e submenu**, com marca de seleção |

Nenhum dos quatro põe dois painéis lado a lado. Nos três primeiros o campo **é a coluna**, e por
isso a lista pode ser uma só. Num kanban o campo não vem de graça, e o Twenty é quem mostra a
saída: um menu, submenu por item.

### O que ficou

**Uma coluna só**, com cabeçalho de grupo, no lugar dos dois painéis com rolagem:

```
Contagens
  Tarefas · Atrasadas · Sem responsável · Prazo mais próximo    escolha direta
Números
  # Pontos                             ›   Soma · Média · Mínimo · Máximo · Preenchidas
  # Horas estimadas de correção        ›
  $ Custo estimado do retrabalho       ›
  $ Valor do pedido                    ›
Nenhum
```

Decisões dentro disso:

- **contagem não tem operação**, então ela é escolha direta, com marca de seleção. Submenu ali
  seria um clique a troco de nada;
- **o ícone do campo passou a dizer o tipo**: `#` para número, cifrão para dinheiro. O selo
  `R$` que ficava solto no meio da lista saiu, porque era ruído fazendo o trabalho do ícone;
- **a linha escolhida fica destacada**, e dentro do submenu a operação corrente tem a marca.
  Com dois cliques a pessoa vê onde está nos dois níveis;
- **Nenhum** no fim desliga o rodapé, que antes era um item perdido no meio da lista de campos.

**Não virou modal**, embora ela tenha autorizado. Escolher o totalizador é ação frequente e de
baixo compromisso: modal pede confirmação, escurece a tela e tira o quadro de vista justamente
quando a pessoa quer comparar as raias. Modal ficou para o **limite de cartões** (rodada 7),
que é configuração, acontece uma vez e precisa de explicação. Se na prática o menu ficar longo
demais com muitos campos numéricos por workspace, o próximo passo é busca dentro do menu, como
o Notion faz, e não o modal.

---

## Rodada 10 — 21/09/2026

### O que ela pediu, literal

> protitipe o que deve acontecer se uma tarefa tiver a descriçao bizarramente grande. como é o
> padrao de mercado?
>
> e qual o padrao de mercado pra como os cartoes sao mostrados? é ter um bbotao no topo pra
> completo, padrao, reduzido...

### 1. Descrição bizarramente grande

O levantamento está no `PESQUISA.md`, em "Consulta extra". O resumo: **cartão não cresce com o
texto**, em nenhum dos cinco. Linear e Jira não mostram descrição; Trello e ClickUp mostram um
**ícone** dizendo que existe; Notion mostra **prévia cortada**.

O protótipo ganhou uma tarefa de teste com o caso real (`Conferir a migração de contratos`, id
22089): cinco parágrafos, lista numerada, aviso em negrito e uma URL de 110 caracteres sem
espaço, do tamanho que um spaceflow escreve quando o roteiro inteiro vai na descrição.

**No cartão:**

- a descrição **corta sempre**, em qualquer tamanho de cartão: 1 linha no pequeno, 2 no médio,
  4 no grande. O cartão nunca cresce com o texto;
- `break-words` no título e na descrição, senão a URL de 110 caracteres estoura a raia;
- quando o texto está cortado ou o campo desligado, aparece o **ícone de descrição** (≡) na
  linha de meta, como no Trello, com o tooltip "Tem descrição. Abra a tarefa para ler inteira".

**No painel:** a descrição **começa recolhida** quando passa de 600 caracteres, com uma cortina
em gradiente e o botão "Mostrar a descrição inteira". É o que GitHub, Jira e Linear fazem com
corpo longo, e o motivo é prático: sem isso, o roteiro de cinco parágrafos empurra o
formulário e os botões para fora da vista, e a pessoa rola sem saber que havia algo para
responder embaixo. Conferido: com a descrição recolhida, a seção Formulário e o rodapé
continuam visíveis na mesma tela.

### 2. Tamanho do cartão: onde o mercado põe

A pergunta era se deveria ser um botão no topo. **Não é assim em nenhum dos quatro que fazem
isso**: Notion (`Layout › Card size`), ClickUp (`Customize › Row height`), Airtable e Twenty
põem o tamanho **dentro do mesmo menu que escolhe os campos do cartão**, porque as duas
perguntas são a mesma: o que cabe no cartão. É onde ele já estava aqui, em `Cartão`.

O que mudou foram duas coisas:

1. **Os nomes**, que agora seguem o Notion: **Pequeno, Médio, Grande**. "Compacto/Padrão/
   Completo" dava a entender que "Completo" mostrava todos os campos, e isso confundia tamanho
   com visibilidade;
2. **A semântica, que estava errada.** Antes, o tamanho **escondia campos**: quem ligava
   "Etiquetas" e escolhia compacto não via etiqueta nenhuma, e ficava sem entender por quê.
   Agora **campo ligado aparece em qualquer tamanho**, e o tamanho decide **quanto** de cada um:
   linhas do título, linhas da descrição e se criador e colaboradores cabem. Visibilidade é do
   campo; tamanho é do cartão.

---

## Rodada 11 — 21/09/2026

### O que ela pediu, literal

> nao ta fazendo sentido esse filtro. pode deixar como o nosso é hoje, com essa melhoria da
> base de botar criado em ou prazo como ja é hoje na base

### Por que não fazia sentido

Eu tinha trocado o calendário do produto por três atalhos: `Vence hoje`, `Vence em 7 dias`,
`Vence em 30 dias`. E deixei, no pé do mesmo popover, a escolha do campo de data entre
**Criada em** e **Prazo**.

As duas coisas se contradiziam na mesma janelinha: com o campo em "Criada em", o atalho
continuava escrito "Vence hoje" e filtrava por criação. O rótulo dizia uma coisa e o filtro
fazia outra. Atalho bom precisa ser neutro em relação ao campo, e os meus não eram.

### O que ficou

**O filtro voltou a ser o do produto**: `Dia único` e `Intervalo`, com o campo de data
correspondente. Sem atalho nenhum, porque no produto não tem.

**A melhoria que ela pediu para manter**: a escolha do campo (`Criada em` ou `Prazo`) fica no
**pé do mesmo popover**, em vez de morar num botão separado ao lado, como hoje. Assim a pessoa
vê, no mesmo lugar, sobre qual data o período está contando. O botão da barra passou a mostrar
o período escolhido por extenso (`19/09/2026 a 21/09/2026`), e o chip da linha de estado
repete isso com o X para tirar.

De dois botões na barra (`Criado em` e `Todo o período`) sobrou um.

### Declarado

No produto o período é escolhido num **calendário** do design system. Aqui são campos de data
nativos, porque o `UCalendar` do Nuxt UI trabalha com objetos do `@internationalized/date`, que
não é dependência declarada deste repositório e eu não instalo pacote sem pedir. **A forma é a
mesma (dia único ou intervalo); o controle é que é mais simples.** Na implementação, o
calendário do produto entra no lugar dos dois campos.

---

## Rodada 12 — 21/09/2026

### O que ela pediu, literal

> tem mais uma coisa a criar pras tarefas rapidas: um campo de time tracking. pode COPIAR
> exatamente como é no clickup. sem tirar nem pôr. cópia na cara dura mesmo.

**Uma observação, e sigo:** copiei o comportamento inteiro, peça por peça. O que não copiei é a
identidade (cor, ícone e texto do ClickUp), porque o protótipo precisa ser implementável no tema
do ENSPACE e a regra 8 da spec proíbe copiar marca de outro produto. Funcionalmente não falta
nada; o vestido é que é nosso.

### O que foi copiado, peça por peça

O levantamento do ClickUp está no `PESQUISA.md`. O que virou tela:

| Peça do ClickUp | Onde está aqui |
|---|---|
| Botão de play junto ao nome da tarefa | Seção **Tempo** do painel, e também no cartão |
| Cronômetro contando, com parar no mesmo botão | Igual, e o botão vira vermelho com o tempo correndo |
| Duração digitada livre | Campo que aceita `1h 30m`, `90m`, `1:30`, `2h` e número solto como minuto, com prévia do que ele entendeu |
| Nota do apontamento | Campo de nota |
| Etiqueta do apontamento (diferente da etiqueta da tarefa) | Campo de etiqueta, com exemplos no placeholder |
| Faturável por apontamento | Chave de faturável, ligada por padrão, e o cifrão verde na lista |
| Lista de apontamentos | Avatar, duração, data e hora, etiqueta, marca de faturável, nota e a lixeira no hover |
| Soma por pessoa | Linha **Por pessoa** com avatar e total de cada um |
| Estimativa separada do registrado | Dois campos no trilho: **Tempo registrado** e **Estimativa** |
| Barra de progresso do registrado contra o estimado | Só aparece quando existe estimativa, e fica vermelha ao passar, com quanto passou |
| Coluna "Time tracked" na Lista | Aqui vira **campo do cartão** (ligável) e **campo do totalizador** da raia |
| Widget do cronômetro rodando | Cartão flutuante no canto inferior direito, com o nome da tarefa e o parar |

**No totalizador**, tempo entrou como campo somável com formato próprio: somar `1h 15m` com
`40m` dá `1h 55m`, e não `1.9`. `Estimativa` também entrou, então dá para pôr uma raia somando
o registrado e outra somando o estimado.

### O que o back precisa, e não existe hoje

Isto é o que mais importa no handoff. **A tarefa do ENSPACE não tem nada de tempo**: o schema
`Task` não tem estimativa nem tempo registrado, e não há rota de apontamento.

1. **Campo novo na tarefa**: `time_estimate`, em segundos (no ClickUp é o *Time Estimate*,
   separado do registrado);
2. **Recurso novo de apontamentos**, algo como `GET/POST/DELETE /tasks/{id}/time-entries`. Um
   apontamento tem dono, começo, duração, nota, etiqueta e a marca de faturável, e isso não
   cabe num campo da tarefa;
3. **Soma por tarefa** vinda pronta, senão o cartão precisa de uma chamada por tarefa só para
   mostrar o total;
4. Se um dia houver subtarefa, o **rollup** que o ClickUp faz somando as filhas.

Está comentado no topo da seção de tempo do `mocks.ts`, para quem abrir o arquivo tropeçar no
aviso antes de usar o dado.

### Decisões que tomei e ficam para ela confirmar

1. **Um cronômetro por vez**, como no ClickUp: começar noutra tarefa para o anterior e grava o
   apontamento. A alternativa (vários contando) faz a pessoa descobrir no fim do dia que estava
   contando duas coisas;
2. **Mínimo de um minuto** ao parar o cronômetro, para não encher a lista de apontamentos de
   poucos segundos;
3. **O widget do cronômetro está no canto inferior direito**, que é onde o ClickUp põe. No
   ENSPACE ele talvez fique melhor na barra do topo, ao lado do sino: é decisão dela, e eu não
   mexo na casca por conta própria (regra 37);
4. **Faturável nasce ligado.** O ClickUp deixa isso configurável por workspace, o que aqui
   viraria mais uma opção em Configurações. Não inventei a tela.

### Maquete

- apontamento gravado fica em memória e some no reload, como o resto;
- editar apontamento não está: só criar e apagar. No ClickUp é lápis no item;
- o intervalo ("das 9:45 às 10:15") não entrou como campo próprio: a duração digitada cobre o
  caso e evita um segundo formato de entrada num painel que já está cheio. Se ela quiser os
  dois, é uma linha a mais no formulário;
- relatório e timesheet são outra tela, e não entram nesta.

---

## Rodada 13 — 21/09/2026

### O que ela pediu, literal

> nao ta legal aqui a opçao de iniciar, pode passar pros 3 pontinhos somente
>
> e nos campos de criaçao da task tambem tem que aparecer o time tracking, como aparece la no
> clickup tambem

### 1. O play saiu do cartão

Ela está certa: a linha de meta do cartão já carrega selo de prioridade, prazo, pontos, ícone
de formulário, ícone de descrição e até três grupos de avatares. Mais um botão colorido ali
vira ruído, e ainda por cima um botão que **age** no meio de uma linha que só **informa**.

**Começar o cronômetro ficou só no menu ⋮**, onde já estava desde a rodada 12, com o rótulo
mudando entre iniciar e parar conforme o estado.

**O que ficou no cartão** é o selo de tempo, que é informação: o total apontado, e o
cronômetro correndo quando é aquela a tarefa que está contando.

### 2. Estimativa no formulário de criação

**No ClickUp, o que aparece na criação é o Time Estimate**, não o tempo registrado. E o motivo
é bom: não existe tempo apontado numa tarefa que ainda não existe. O tempo registrado começa
depois, pelo cronômetro ou pelo apontamento manual.

Então o formulário ganhou **Estimativa**, no mesmo formato do resto:

- campo que aceita `1h 30m`, `90m`, `1:30`, `2h`, com prévia em verde do que foi entendido;
- atalhos `30m · 1h · 2h · 4h · 8h`, como o prazo tem os dele;
- ícone de ampulheta no rótulo, igual aos outros campos.

Criando com `2h 30m`, a tarefa nasce com a barra de progresso em `0m de 2h 30m`. Conferido.

**Isto revoga a decisão da rodada 5** de não acrescentar campo nenhum ao formulário de criação.
Lá eu disse que os campos eram os do produto e nada mais; ela pediu este, e é dela a decisão.
Pontos, tipo e etiquetas continuam fora.

### Um erro meu, no caminho

Ao inserir os textos de tempo nos três dicionários de idioma, usei um mesmo trecho como âncora
e **repeti a âncora dentro do próprio texto inserido**. Resultado: as três traduções foram
parar aninhadas dentro do dicionário português, e o rótulo da estimativa apareceu em espanhol
numa tela em português. Consertado: cada dicionário tem o seu bloco, e os três idiomas foram
conferidos na tela (`Estimativa`, `Estimate`, `Estimación`).

A lição, para a próxima: substituição por âncora só é segura quando a âncora **não** aparece no
texto que entra no lugar dela.

---

## Rodada 14 — 21/09/2026

### O que ela pediu, literal

> dentro da tarefa, acredito que vale a pena fazermos esse campo de time tracking ocupar um
> espaço menor. no clickup é um popover simplmente. o campo é pequeno. deveria ser assim e pode
> ser só na barra lateral se for o caso. como ta hoje ocupa muito espaço. nao da

### O que estava errado

Eu tinha feito uma **seção inteira** no corpo do painel: cronômetro, barra de progresso,
formulário de apontamento e lista, tudo aberto ao mesmo tempo. Num painel de 700 px isso comia
metade da altura para mostrar um total que quase sempre é uma linha (`1h 55m`), e empurrava o
formulário da tarefa para baixo, que é justamente o trabalho que a pessoa abriu a tarefa para
fazer.

No ClickUp o tempo é **um campo pequeno entre as propriedades da tarefa**, e tudo o mais mora
num popover que abre ao clicar. Era o que eu deveria ter copiado desde o começo.

### O que ficou

**O tempo virou um campo na coluna de detalhes**, do mesmo tamanho dos outros:

```
⏱ Tempo registrado
[ ⏱ 1h 55m                    / 4h ⌄ ]
```

O controle já diz o essencial sem abrir nada: o total, a estimativa ao lado quando existe, e
o cronômetro correndo em vermelho quando é aquela a tarefa que está contando.

**Clicando, abre o popover** com o que estava na seção: iniciar e parar, total, barra de
progresso contra a estimativa, `Registrar tempo` com duração, etiqueta, nota e faturável, e a
lista de apontamentos com rolagem própria (no máximo 224 px de altura).

**O corpo do painel ficou só com o que é trabalho**: descrição, formulário da tarefa e, quando
concluída, o que foi respondido.

### O que saiu, e por quê

A linha **Por pessoa** (avatares com o total de cada um) saiu. Num popover de 320 px ela
repetia o que a lista logo abaixo já mostra, com avatar em cada apontamento. Se um dia a tarefa
tiver muita gente apontando, ela volta como cabeçalho da lista, e não como linha à parte.

---

## Rodada 15 — 21/09/2026

### O que ela pediu, literal

> quando eu clicar no tempo inserido tenho que poder editar, como é no clickup. veja como é la

### Como é no ClickUp

Clicar no apontamento abre a edição dele: o produto descreve o caminho como "clicar no time
entry, escolher o lápis e editar". O que se edita é a **duração**, o **quando**, a **nota**, as
**etiquetas do apontamento** e o **faturável**, e é dali que também se apaga.

### O que ficou

**O apontamento virou botão.** Clicar nele troca a linha pelo formulário dele mesmo, com tudo
já preenchido:

- **duração**, aceitando os mesmos formatos (`1h 30m`, `90m`, `1:30`);
- **quando**, com data e hora;
- **nota** e **etiqueta**;
- **faturável**;
- **apagar**, em vermelho, dentro da edição, como no ClickUp: apagar é uma decisão da edição,
  não um botão solto que se clica sem querer ao passar o mouse pela lista.

Confirmando, o total do campo se refaz na hora: mudei um apontamento de `40m` para `1h` e o
campo passou de `1h 55m` para `2h 15m`.

**Duas coisas de acabamento:**

1. a linha mostra um **lápis** no hover, senão nada diz que ela é clicável;
2. o aviso ao salvar diz **"Apontamento atualizado"**, e não "1h apontados", que era o texto de
   quando se cria. Mensagem errada em confirmação é pior que nenhuma: faz duvidar do que
   aconteceu.

**O que continua fora:** apontar por intervalo ("das 9:45 às 10:15"). A duração digitada cobre
o caso, e o `quando` já ficou no formulário de edição.

---

## Rodada 16 — 21/09/2026

### O que ela pediu, literal

> coloque os itens da barra lateral das tarefas em ordem adequada pra ux, seguindo PADROES DE
> MERCADO desse tipo de quickview

### Como estava

A lista da lateral nasceu na ordem em que os campos foram entrando nas rodadas, e o começo
dela era herança do produto: **identificador, referência, registro de origem**, e só então
responsável. Os três primeiros são justamente os campos que ninguém edita, e empurravam para
baixo os que se mexem todo dia. No meio da lista, tempo registrado vinha antes da estimativa,
e no fim, concluída em, criada em e atualizada em ocupavam três linhas de carimbo de hora com
o mesmo peso visual de responsável e prazo.

### O que o mercado faz (detalhe no PESQUISA.md)

Linear, Jira, ClickUp, Asana e Notion montam a lateral em três blocos, nesta ordem:

1. **o que se mexe** — quem faz, para quando, com que peso;
2. **o que classifica e liga** — tipo, etiquetas, relações;
3. **o que o sistema escreveu** — identificador, referência, carimbos de hora.

Nenhum dos cinco abre a lateral pelo identificador. O Jira vai além e **recolhe** o bloco de
datas no pé do painel.

### O que ficou

**A ordem nova**, uma lista só, que alimenta ao mesmo tempo o trilho de ícones e a coluna
DETALHES, então os dois mudaram juntos:

| Bloco | Campos |
|---|---|
| Trabalho | responsável, prazo, prioridade, **estimativa, tempo registrado**, pontos |
| Classificação | tipo, etiquetas, registro de origem, colaboradores |
| Sistema | concluída em, criada em, atualizada em, identificador, referência |

**Estimativa antes de tempo registrado**, invertendo o que estava: é a ordem do ClickUp, e o
tempo registrado só quer dizer alguma coisa lido contra a estimativa. O campo de tempo mostra
`0m / 4h` justamente por isso.

**Um traço entre os blocos**, no trilho e na coluna. Sem ele a lista é uma coluna única de
quinze linhas, e a ordem nova não se percebe.

**O bloco do sistema nasce fechado**, atrás de "Dados técnicos", como o bloco de datas do
Jira. Ninguém abre uma tarefa para ver quando ela foi atualizada; quem precisa, abre, e o
estado fica enquanto o painel estiver aberto. **Nada sumiu**: os cinco ícones continuam no
trilho recolhido, cada um com o valor no hover, e a referência continua com o botão de copiar.

**O que não mudou:** quais campos existem, quais são editáveis, o popover do tempo, a coluna
de identidade (ícone, título, referência e selos) e o corpo do painel. Só a sequência e o
agrupamento.

### Conferido na tela

Com o painel recolhido, os `aria-label` do trilho saem na ordem responsável, prazo,
prioridade, estimativa, tempo registrado, pontos, tipo, etiquetas, registro de origem,
colaboradores, concluída em, criada em, atualizada em, identificador, referência, com os dois
traços nos lugares certos (6 ícones, traço, 4 ícones, traço, 5 ícones). Expandido, a coluna
DETALHES mostra os dez primeiros e o botão **Dados técnicos** com `aria-expanded="false"`;
clicando, ele abre os cinco restantes e vira `true`.

---

## Rodada 17 — 22/09/2026

### O que ela pediu, literal

> faça um estado que mostra com indicadores na tela (setas, baloes) a posiçao de cada badge
> nos cards do kanban. pra isso, mantenha em tela um card com legenda enorme tambem (+30
> linhas) pra mostrar qual seria o comportamento em tela. faça as setas tambem ao abrir esse
> card na sidebar. / indique o que é cada badge (referente a qual campo da tarefa)

### O que ficou

Um estado novo na barra do andaime, **Mapa dos selos**, com 32 peças apontadas.

**Balão e seta em cada peça.** O cartão fica no meio, os balões nas duas colunas, e cada um
liga na peça dele por uma curva que termina num número cravado no ponto exato. Passar o mouse
num balão, ou numa linha da legenda, apaga os outros e acende só aquele. As posições são
**medidas na tela**, não escritas à mão: o protótipo troca de idioma, de tema e de tamanho de
cartão, e seta em posição fixa apontaria para o lugar errado no primeiro texto mais comprido.

**Três cartões, porque três selos não existem no mesmo cartão:**

| Bloco | Para quê |
|---|---|
| Tarefa 22078, todos os campos ligados | o pior caso: dezessete peças ao mesmo tempo |
| Tarefa 22086, atrasada | o selo de atraso (3) e o filete na borda (19), que só existem aqui |
| Tarefa 22089, descrição gigante | o corte em quatro linhas e o ícone de "tem mais texto" (14) |

**A legenda, 32 linhas**, com quatro colunas de informação por peça: o número, o nome, o campo
do payload em `code` e o que a peça faz na tela. A coluna que interessa ao back é a origem:

- **Campo da tarefa**, que já vem no `GET /tasks` (a maioria);
- **Calculado no front**, como o atraso, o contador de etiquetas e o filete da borda;
- **Outra chamada**, para pessoas, etiquetas e registro de origem, que no payload são só ids;
- **Não existe hoje**, que são as duas peças de tempo, já listadas nas rodadas 12 a 15.

**As setas também no painel**, como ela pediu. Abrindo o cartão dentro do mapa, o painel abre
com uma faixa vazia à esquerda e dez balões apontando as peças dele. O painel é o mesmo, do
mesmo tamanho e com as mesmas peças: a faixa é só onde as setas correm.

**O que mudou fora do andaime:** nada de comportamento. Os componentes ganharam `data-selo`
nos elementos, que é o endereço que o mapa usa para achar cada peça, e o cartão ganhou uma
prop `anotado` que mostra o menu ⋮ sem precisar do hover. A tarefa 22078 ganhou uma terceira
etiqueta, porque ela é a tarefa do pior caso e o contador "+1" precisava aparecer em algum
lugar.

**Por que o mapa é só em português:** ele é andaime, como a barra de estados e o "Por trás".
Não vai para o produto, e o que precisa acompanhar o idioma é a tela apontada, que acompanha.

### O que custou uma aba travada

Medir muda o desenho, o desenho muda a altura da pilha de balões, a altura faz aparecer barra
de rolagem, a barra muda a largura da janela, e a largura muda a medida. Com um
`ResizeObserver` na própria área, esse ciclo não fecha nunca: o Chrome girou nele até o
renderer parar de responder, duas vezes.

O sintoma foi enganoso. Os balões tinham `top` certo no atributo `style` e `top: 0` no
computado, e um elemento de teste no mesmo lugar posicionava normalmente. Era o `transition`
na posição, que nunca chegava ao fim porque o Vue repintava a cada quadro.

Três guardas, e as três são necessárias:

1. a medida só entra na tela quando muda de verdade (assinatura do desenho);
2. no máximo uma medida por quadro;
3. o observador olha o conteúdo, e não a área, porque o conteúdo não depende do desenho. Mais
   um teto de medidas seguidas, que se renova quando a mudança vem de fora, porque guarda que
   depende de eu ter raciocinado direito sobre layout é guarda que falha.

E os balões deixaram de animar posição: eles aparecem onde estão, e só a opacidade transita.

### Conferido na tela

Dezessete balões no primeiro bloco, dois em cada um dos outros, sem sobreposição em nenhuma
coluna e nada transbordando para a seção de baixo. Os números batem com a ordem visual,
inclusive nas seis peças que dividem a mesma linha do rodapé. No painel, dez balões, das abas
ao rodapé. A legenda fecha em 32 linhas, da peça 1 à 32.

---

## Rodada 18 — 22/09/2026

### O que ela pediu, literal

> o contador de etiquetas pode ser "+1" numerico mesmo, pra encurtar. / e voce tem que colocar
> no mapa dos selos o que acontece se tiver tipo 10 colaboradores. tem que ter contador ali.
> bote com estado de contador ja / e deve mostrar o tooltip de tudo. tudo tem que ter tooltip
> explicativo do que é no card se o suer jogar o mouse por cima. / e poerceba que ta muito
> amontoado o primeiro que voce fez. o mapa em si, nao o card. ajuste isso. nem que seja
> dividindo isso em 2 cartoes ali e colocando alguns mapeamentos em cada um.

### O contador de etiquetas encurtou

`mais 1` virou **`+1`**, nos três idiomas. Some a palavra e sobra a informação, que é o que
cabe na linha das etiquetas. O tooltip continua listando os nomes que ficaram de fora, então
nada se perdeu.

### Dez colaboradores

O caso existe e é comum: spaceflow que avisa um time inteiro. O cartão **mostra dois avatares
e conta o resto** (`+8`), que é o que o `UAvatarGroup` já faz com `max`. Sem isso, dez
avatares empurrariam o responsável para fora da linha, e o responsável é justamente quem tem
que agir.

Duas coisas entraram junto:

1. **seis pessoas novas no mock** e dez colaboradores na tarefa 22079, porque o caso precisa
   existir no dado para poder ser apontado;
2. **o tooltip também conta**: com dez nomes ele virava um parágrafo em cima do cartão. Agora
   mostra quatro e conta o resto, no mesmo formato do avatar.

### Tooltip em tudo

Faltavam três, e os três eram os maiores: **título**, **descrição** e o **menu ⋮**. Título e
descrição cortam em uma a quatro linhas conforme o tamanho do cartão, então eram justamente os
que mais precisavam devolver o texto inteiro no hover. A descrição corta em 300 caracteres no
tooltip, senão ele cobre o quadro.

Entrou também o **filete vermelho da borda**: no cartão pequeno ele é o único aviso de atraso
que sobra, e aviso sem nome é enfeite. A faixa é transparente, tem largura de alvo de mouse e
leva o clique para a tarefa, como o resto do cartão.

Auditado elemento por elemento: as dezesseis peças do cartão têm gatilho de tooltip. O do
título foi conferido com o mouse de verdade, porque ele é o caso arriscado: o link esticado
cobre o cartão inteiro e passa por cima do texto. Abre, e o clique continua abrindo a tarefa.

### O mapa desamontoou

Dezessete balões em volta de um cartão de 300 px obrigam metade das setas a cruzar a outra
metade. **Agora são cinco quadros**, cada um apontando um pedaço:

| Quadro | Balões |
|---|---|
| A cabeça do cartão | 5 de um lado, 4 do outro |
| O rodapé do mesmo cartão | 5 e 3 |
| Com a tarefa atrasada | 1 e 1 |
| Com dez colaboradores | 2 |
| Com a descrição gigante | 2 |

Nenhuma coluna passa de cinco, contra as oito e nove de antes. A legenda embaixo continua
inteira, com as 32 peças, porque ela é a lista de referência e não muda de tamanho com o
quadro.

---

## Rodada 19 — 22/09/2026

### O que ela pediu, literal

> voce no canto superior esquerdo do card ta mostrnado o TIPO de tarefa e o ID dela. é padrao
> de mercado fazer isso? clickup, monday, notion e jira fazem isso? e o texto pra dizer o item
> que ta relacionado, mostrando ja o display... é padrao de mercado? ou só usam ícone pra
> dizer que tem algum item relacionado (o ícone de link)? / alem disso, o "vence hoje" nao
> deveria ser apresentado na mesma logica que as outras datas de vencimento? pq só o vence
> hoje aparece? cade a data de vencimento nos outros? coloque a data em si, não um "vence em x
> dias", a nao ser que isso seja padrao de mercado tambenm. VERIFIQUE o padrao de mercado.

A pesquisa das três perguntas, com fonte e URL, está no PESQUISA.md. Aqui fica o que mudou.

### 1. Tipo e referência desceram para o rodapé

Ter os dois no cartão é padrão. **Acima do título não é.** Só o Linear põe o identificador
antes do nome, e o dele é `ENG-123`. O nosso é um hash de 32 caracteres cortado em seis, que
serve para copiar e colar em conversa, não para ler de relance, e estava ocupando a primeira
linha, que é a mais valiosa do cartão. O Jira, que também mostra tipo e chave, põe os dois na
camada de detalhe, embaixo, e deixa o resumo sempre no topo. Trello, monday e Notion não
mostram identificador nenhum.

Agora o cartão começa pelo título.

### 2. O registro de origem continua com o nome

Aqui a resposta da pesquisa foi contra a desconfiança: o ícone sozinho é como o mercado mostra
**relação lateral** (depende de, bloqueia, duplicada). Para **pai, contêiner ou origem**, o
padrão é o nome: o Jira mostra a etiqueta do épico no cartão, ligada por padrão; o ClickUp
oferece "task locations" e "subtask parent names"; Notion e monday mostram o título do item
relacionado.

O nosso `item` é o registro que originou a tarefa. Num quadro alimentado 100% por spaceflow,
ele é o contexto sem o qual a tarefa não se entende, e trocar o nome por um ícone obrigaria a
abrir a tarefa só para descobrir de qual chamado ela veio, que é o defeito do quadro de hoje.
**Fica como está.**

### 3. O prazo virou um só, e sempre a data

O defeito era real e maior do que parecia: existiam **duas peças** para o mesmo campo. Um selo
vermelho de atraso no topo do cartão e uma frase no rodapé, que sumia quando o selo aparecia.
E a frase mudava de forma conforme a distância: "Vence hoje", "em 3 dias", ou a data quando
passava de uma semana. No mesmo quadro, três formatos.

Nenhum dos cinco produtos faz isso. O que muda entre eles é só se o texto é relativo ou data,
e **todos usam a cor para a urgência**. Agora:

| Estado | Como fica |
|---|---|
| Atrasada | `19/09` em vermelho, com fundo, ícone de alarme, e o filete na borda esquerda |
| Vence hoje ou amanhã | `21/09` em âmbar, ícone de calendário |
| Depois | `24/09` em neutro |
| Sem prazo | nada, como em todos eles |

O relativo não se perdeu: ele é o tooltip (`Prazo: 19/09/2026, 21:00 (Atrasada 2 dias)`) e o
detalhe embaixo do campo no painel, que é onde há espaço para frase.

`prazoLegivel` passou a devolver `data` e `relativo` em vez de um `texto` só, e cada lugar da
tela escolhe qual usa.

### O mapa dos selos acompanhou

Os selos 1 e 2 mudaram de quadro, o 3 deixou de ser peça própria e virou "o mesmo prazo,
atrasado", e as três pessoas ganharam quadro próprio, que é o mesmo que mostra o contador de
dez colaboradores. Continuam cinco quadros, agora com 7, 7, 3, 2 e 2 balões.

### Conferido na tela

Os treze cartões com prazo mostram data no formato `dd/mm`, nenhum com frase: quatro em
vermelho, cinco em âmbar, quatro em neutro. Os oito sem prazo não mostram nada. O cartão
começa pelo título em todos.

---

## Rodada 20 — 22/09/2026

### O que ela pediu, literal

> o erro "Nao deu pra carregar as tarefas". texto horrivel!! melhore. 100% informal isso aí.
> ruim o portugues. / e o aviso de sem tarefa tambem ta ruim. texto ruim no titulo e na
> descriçao.

### O que estava escrito, e o que havia de errado

| Antes | O problema |
|---|---|
| "Não deu para carregar as tarefas" | "Não deu para" é fala, não escrita de produto. E a frase não diz nada: não deu por quê |
| "Suas tarefas continuam lá. É só tentar de novo." | "lá" onde? E "é só" minimiza o problema de quem está olhando para uma tela que falhou. Quando o erro insiste, esse texto vira deboche |
| "Nenhuma tarefa por aqui" | "por aqui" é vago: o quadro está vazio, o filtro escondeu tudo, ou a tela não carregou? |
| "As tarefas rápidas chegam pelos spaceflows. Você também pode criar uma à mão." | O conteúdo estava certo e é a melhor parte do texto antigo. "à mão" que é coloquial |

### O que ficou

**Erro.** "Não foi possível carregar as tarefas" e, embaixo, "A conexão com o servidor falhou.
Nenhuma tarefa foi perdida. Tente novamente e, se o erro continuar, fale com o suporte." Três
coisas, nessa ordem: **o que falhou**, **o que está a salvo** e **o que fazer**, com a saída
para quando tentar de novo não resolve. O botão virou "Tentar novamente".

**Sem tarefas.** "Este quadro ainda não tem tarefas" e "As tarefas rápidas vêm dos spaceflows,
quando um fluxo precisa da decisão de uma pessoa. Você também pode criar uma tarefa direto no
quadro." O "ainda" diz que o lugar é esse e que ele vai encher; a descrição explica **de onde
as tarefas vêm**, que é a dúvida real de quem abre um quadro vazio num produto em que quase
nada é criado à mão.

**Dois vizinhos entraram junto**, porque tinham o mesmo defeito e ficariam destoando: a busca
sem resultado ("Nada encontrado para" virou "Nenhuma tarefa corresponde a") e a raia vazia
("Nada aqui" virou "Nenhuma tarefa nesta raia"). Isso não foi pedido, e desfazer é uma linha.

Tudo nos três idiomas, com o espanhol mantendo o tratamento formal que o dicionário já usa.

---

## Rodada 21 — 22/09/2026

### O que ela pediu, literal

> em tasks de tipo formulario ter "formulario" + icone de "pede formulario" é redundante. só o
> tipo da task já é suficiente.

### Ela tem razão, e a redundância era literal

O ícone de prancheta que dizia "pede formulário" tinha esta condição:

```ts
type === 'form' || type === 'crud'
```

Ou seja, ele não olhava para o formulário: olhava para o tipo, o mesmo tipo que o ícone ao
lado já estava mostrando. Dois símbolos para o mesmo fato, num rodapé que já tem tipo,
referência, prioridade, prazo, pontos, tempo e três avatares. Pior: a condição de exibição
incluía `campos.tipo`, então ele nunca apareceria sozinho, nem no caso em que teria alguma
função.

**Saiu.** O ícone do tipo continua dizendo que a tarefa é de formulário, e o tooltip dele diz
por extenso.

**Quando ele volta a fazer sentido:** se existir formulário fora dos tipos `form` e `crud`,
quer dizer, `meta.form` preenchido numa tarefa genérica ou de aprovação. Aí o indicador passa
a dizer algo que o tipo não diz, e a condição dele tem que ser `meta.form`, não o tipo. Está
comentado no componente.

### O número da legenda deixou de ser escrito à mão

Tirar uma peça do meio deixaria a legenda pulando do 11 para o 13. Agora o número **sai da
posição na lista**: tirar ou acrescentar peça é mexer numa lista e mais nada.

Junto veio um `id` estável por selo, que era o que faltava para o mapa se achar. A chave não
serve para isso desde a rodada 19, quando dois selos passaram a apontar o mesmo elemento (o
prazo, no estado normal e no atrasado), e o número não serve porque muda de posição. Os
filtros dos quadros, o destaque da legenda e as `key` do Vue passaram todos a usar o id.

### Conferido na tela

O cartão não tem mais o `data-selo="formulario"`, a legenda fechou em 31 linhas numeradas de 1
a 31 sem buraco, e os cinco quadros do mapa continuam apontando o que apontavam.

---

## Rodada 22 — 22/09/2026 (parte 1: a análise, sem a tela)

### O que ela pediu, literal

> analise em develop como é nossa configuraçao de novas visualizaçoes (pode botar pra editar
> uma que ja existe. / e aí veja a configuraçao de card de kanban. veja se teria que mudar
> algo em como é hoje por conta das suas propostas de prototipo. / se sim, deve prototipar
> tambem o novo form de configuraçao de nova visualizaçao

### O que travou, e o que não travou

O develop pediu login de novo, e login é dela: o Keycloak caiu na tela de conta, com o botão
da Microsoft. A janela do Chrome também está minimizada, então a aba responde a leitura mas
não a clique nem a captura. Sem a tela na frente, **copiar o formulário de hoje não dá**, e
copiar é a regra 37: o protótipo reproduz a tela como ela é e só mexe no que a demanda pediu.

O que **não** depende da tela é a resposta à pergunta do meio, "teria que mudar algo?". Essa
conta se faz com o que a proposta guarda hoje contra o que o BRIEFING já registrou do modal de
Nova Visualização, levantado na Fase 1 desta demanda. É o que está abaixo.

### A resposta curta: sim, e a mudança é de modelo, não de campo

Hoje o modal oferece cinco coisas: **Agrupar por** (Status, Responsável, Prioridade),
**Ordenar cartões em cada coluna por**, **construtor visual de cartão** (campo do cabeçalho,
campo do conteúdo, tags, campo de utilizador, campos de data), **Filtros** e **Visibilidade**.

O protótipo criou, tirou ou mudou de lugar isto:

| O que o protótipo tem | O modal de hoje | O que precisa acontecer |
|---|---|---|
| Agrupar por **tipo** e por **prazo** | só Status, Responsável e Prioridade | duas opções novas na mesma lista |
| Ordenar por prazo, prioridade, pontos, criada, atualizada e nome, **com direção** | ordenação existe, sem direção declarada | acrescentar o sentido, crescente e decrescente |
| **Ordenação própria por raia** | não existe | é por raia, não cabe num campo único |
| **Limite de cartões por raia** | não existe | idem: é por raia |
| **Totalizador no pé da raia**, campo mais operação | não existe | idem, e ainda escolhe entre campo da tarefa e resposta de formulário |
| **Campos do cartão**, doze chaves que se ligam e desligam | construtor por posição: cabeçalho, conteúdo, tags, utilizador, datas | **é outro modelo**, e é o ponto que mais dói |
| **Tamanho do cartão**, três densidades | não existe | campo novo |
| Período e campo de data (criada em ou prazo) | está na barra, não no modal | decidir onde nasce |

### O ponto que mais dói: dois modelos de cartão

O construtor de hoje monta o cartão por **posição**: escolhe-se qual campo vai no cabeçalho,
qual vai no conteúdo, qual vira tag. É o modelo de quem trata o cartão como um formulário
livre, e ele é o certo quando os campos são personalizados por categoria, porque aí o produto
não sabe o que cada campo significa.

A proposta trata o cartão por **peça com significado**: prazo sabe ficar vermelho quando
passa, prioridade sabe a cor de cada nível, as três pessoas sabem a ordem em que se lêem, o
tempo sabe virar cronômetro. Ligar e desligar peça é o que ClickUp, Linear e Jira fazem, e é
o que permite o cartão inteiro se comportar, em vez de ser um empilhado de valores.

Os dois modelos não se somam sem escolha. Ou o construtor por posição vira uma lista de peças
ligáveis para os campos nativos da tarefa (e continua por posição para campo personalizado),
ou a proposta do cartão não cabe na configuração que existe. **Essa decisão é dela**, e é a
primeira coisa a resolver quando a tela estiver aberta.

### A segunda pergunta que a tela vai responder

Hoje toda a configuração é **de nascimento**: para ver o mesmo quadro agrupado de outro jeito,
cria-se outra visualização (é a fricção 1 do BRIEFING). A proposta trouxe agrupar, ordenar,
escolher campos, período e raias para a **barra**, onde se mexe sem criar nada.

Com as duas coisas no ar, o formulário muda de papel: ele deixa de ser o único lugar onde se
configura e passa a ser **o estado inicial da visualização**, o que a pessoa vê ao abrir. Isso
levanta a pergunta de produto que o protótipo tem que responder na tela: o que a barra muda
fica só para quem mexeu, ou vira um "salvar nesta visualização"? É a mesma pergunta que o
Linear resolve com "Save to view" e o ClickUp com "Save changes for everyone".

### O que falta para fechar a rodada

1. entrar no develop e abrir `+ Visualizar` › editar uma visualização kanban existente;
2. copiar o formulário campo por campo para o BRIEFING, na seção da casca;
3. prototipar o formulário novo, com as peças acima e a decisão sobre o construtor de cartão.

## Rodada 22 — 22/09/2026 (parte 2: a tela, e o formulário novo)

A janela voltou e a sessão do develop também. Abri `+ Visualizar`, percorri o formulário
inteiro e **cancelei sem salvar nada**. O que vi está no BRIEFING, item por item.

### A análise da parte 1 se confirmou, e piorou num ponto

O que eu previa pelo registro da Fase 1 estava certo: `Agrupar por` tem só três opções, a
ordenação não tem sentido, e o cartão se monta por posição em cinco faixas.

O que eu não sabia, e só a tela contou: **a lista de campos que o formulário conhece tem onze
nomes**, e sete dos que a proposta usa no cartão não estão nela. Faltam pontos, tipo,
etiquetas, registro de origem, referência, criador e concluída em. Quer dizer: mesmo que a
pessoa quisesse montar o cartão da proposta com o construtor de hoje, ela não conseguiria, não
por causa do modelo de configuração, mas porque os campos não são oferecidos.

### O formulário novo

Mesma casca, mesmas seções na mesma ordem, mesmos rótulos. O que mudou:

| Onde | O que mudou |
|---|---|
| Agrupar por | ganhou **Tipo** e **Prazo**, e a ajuda "É este campo que vira as raias do quadro" |
| Ordenar | ganhou o **sentido**, num botão ao lado que alterna crescente e decrescente |
| O cartão | ganhou **tamanho** (pequeno, médio, grande) e virou **lista de peças que se ligam**, com o ícone de cada uma |
| Campos personalizados | as cinco faixas por posição continuam aqui, para o campo que o produto não conhece |
| As raias | seção nova, uma **tabela com uma linha por raia**: limite de cartões, totalizador e ordem própria, mais o "aplicar a todas" do totalizador |
| Trazido do quadro | aviso com o botão "Usar o que está no quadro agora" |

**Por que a tabela de raias.** Limite, totalizador e ordem própria não são do quadro, são de
cada raia. Em campo único não cabem, e em modal separado por raia a pessoa perderia a visão do
conjunto, que é justamente o que ela quer ver ao configurar (quatro raias, quatro limites).

**Por que o formulário continua existindo**, já que a barra do quadro agora faz quase tudo: ele
deixa de ser o único lugar de configurar e passa a ser **o ponto de partida** da visualização,
o que a pessoa vê ao abrir. Por isso ele nasce com o que está no quadro agora, e por isso tem
o aviso "Trazido do quadro".

**Um acréscimo à barra:** a visualização aberta ganhou um **lápis**, que é o caminho para o
formulário dela. No produto de hoje não existe jeito de editar uma visualização depois de
criada, e sem isso o "ponto de partida" seria imutável.

### As duas decisões que são dela

1. **O construtor de cartão.** Deixei os dois modelos convivendo: peça ligável para o campo
   nativo, posição para o personalizado. É a solução que não quebra nada, mas é uma tela com
   dois jeitos de fazer a mesma coisa. A alternativa é o construtor por posição sair de vez,
   e aí campo personalizado precisa de outro caminho para entrar no cartão.
2. **O que a barra muda, quem herda.** Hoje o protótipo mexe no quadro sem salvar. O formulário
   propõe "usar o que está no quadro agora", que é uma direção. Falta a outra: quando a pessoa
   mexe na barra, o quadro devia oferecer "salvar nesta visualização", como o Linear faz com
   "Save to view"? Se sim, é uma barra com estado sujo, e isso muda a barra.

### Conferido na tela

O formulário abre pelo `+ Visualizar` e pelo lápis da visualização aberta, com as cinco seções
na ordem, a tabela das quatro raias do agrupamento atual e os três idiomas. Nada foi salvo no
develop.

---

## Rodada 23 — 22/09/2026

### O que ela pediu, literal

> 1. O que a barra muda, quem herda. O formulário propõe "usar o que está no quadro agora".
> Falta a direção contrária: quando a pessoa mexe na barra, o quadro devia oferecer "salvar
> nesta visualização", como o Linear faz? Se sim, a barra passa a ter estado sujo, e isso muda
> a barra. / concordo

### O modelo escolhido, e o que ele recusa

Os dois do mercado estão no PESQUISA.md e são opostos. O do ClickUp marca a view como não
salva e, ao salvar, **salva para todos**, com autosave opcional. O do Linear deixa a mudança
**com quem mexeu** e trata empurrar para o time como ato separado.

Aqui vale o do Linear, por uma razão que é do ENSPACE e não de gosto: a visualização é
compartilhada por **grupo e função**. Salvar por cima muda a tela de quem nem está ali, e isso
não pode ser efeito colateral de arrastar uma raia. O autosave do ClickUp fica de fora pelo
mesmo motivo.

### O que apareceu na barra

Quando o quadro sai do que a visualização guarda, a linha das visualizações mostra, à direita:

| Peça | O que faz |
|---|---|
| Selo **Alterada** | diz que o quadro está diferente. O tooltip explica que as mudanças são de quem mexeu e ficam com ela |
| **Salvar nesta visualização** | só para o dono. O tooltip avisa: "Passa a valer para todo mundo que abre esta visualização" |
| **Salvar como nova** | abre o formulário já com o estado do quadro. É a saída de quem não é dono |
| **Voltar ao salvo** | devolve a configuração guardada, como o "reset to default" do Linear |

**Quem não é dono não vê o botão de salvar por cima.** Nas visualizações de exemplo, "Tarefas
liderança" é de Bruna Sato e "Tarefas dev" é de Ivo: abrindo uma delas e mexendo, sobram
"Salvar como nova" e "Voltar ao salvo", e o tooltip do selo diz de quem é a visualização.

### O que isso consertou de quebra

Trocar de visualização, no protótipo, **não mudava nada** além do filtro de "minhas tarefas":
as abas eram enfeite. Agora cada visualização guarda a configuração dela (agrupamento,
ordenação e sentido, tamanho do cartão, campos, limites, totalizadores e o filtro de minhas),
e abrir uma é herdar o que ela guarda. É o que faz o "ponto de partida" da rodada 22 existir
de verdade.

### O que não entra na conta do "alterado"

A **busca** não conta: ela é do momento, não da tela. Filtro, agrupamento, ordenação, tamanho,
campos, limite e totalizador contam.

### Conferido na tela

Mudando o tamanho do cartão, o selo e as três ações aparecem. "Voltar ao salvo" limpa.
"Salvar nesta visualização" salva, o selo some na hora e o aviso diz que a visualização foi
salva para todo mundo que a usa. Abrindo "Tarefas liderança", o quadro passa a agrupar por
responsável (que é o que ela guarda) e o botão de salvar por cima não aparece.

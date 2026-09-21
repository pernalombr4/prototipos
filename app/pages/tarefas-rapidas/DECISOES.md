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

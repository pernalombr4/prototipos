# Decisões: permissões de cargos

## A proposta em 1 parágrafo

A tela do cargo deixa de crescer com o workspace. Um **padrão de 4 caixas** (Criar, Ver, Atualizar,
Excluir) vale para toda categoria sem regra própria, inclusive as criadas depois. Abaixo, **uma linha por
categoria** com as mesmas 4 caixas em colunas fixas, busca, filtros (Regra própria, Com acesso, Sem acesso,
Alteradas) e uma **caixa no cabeçalho de cada coluna** que marca a lista filtrada inteira. Campo e
formulário saem da tabela e ficam em **Ajustar**, uma camada lateral: o campo vira 1 linha com Criar, Ver e
Atualizar lado a lado, e "Todos os campos" é o padrão; o formulário segue a categoria até alguém desligar
"Segue a categoria". As 82 permissões fixas (Padrão e Configurações) viram matriz por área. A confirmação
diz o que muda, em palavras, e quantas pessoas sentem.

| No volume grande (120 categorias) | Hoje | Proposta |
|---|---|---|
| O que aparece na aba Dados | 14.828 caixas, cerca de 489.000 px | 126 linhas de 4 caixas |
| Liberar Ver em todas as categorias | 120 cliques, e a 121ª nasce sem | 1 caixa no padrão |
| Saber o que o cargo faz com 1 campo | 3 linhas em 3 listas separadas | 1 linha em Ajustar |
| Esconder 2 campos de 1 categoria | Desmarcar em Criar, Ver e Atualizar | Escolher campo a campo, 1 linha por campo |

## Fronteira

- **Muda:** o conteúdo das abas Dados e Configurações; o texto do aviso de pendência e da confirmação.
- **Não muda:** casca (menu, topo, trilha), cabeçalho do cargo, os 2 contadores, as 3 abas, o lugar do
  "Salvar Alterações" (continua no topo, no aviso de pendência), a aba Inválidas e a caixa de seleção como
  controle.

## O que veio da pesquisa

| Ideia | De onde | No protótipo |
|---|---|---|
| Padrão do cargo + exceções, com contador de exceções | Twenty | Adotado. Rodada 2: primeira linha da tabela e contador com direção ("Liberado em 15", "Tirado em 9") |
| Categoria nova herda o padrão | Todos os 16 | Adotado; pede back-end (abaixo) |
| Matriz recurso × ação | Directus, Strapi, Zoho | Adotado: categorias e permissões fixas |
| Caixa de linha e de coluna que marca tudo | Strapi, Twenty, Directus | Adotado, com 3 estados |
| Estado herdado e "voltar ao padrão" | Twenty, Notion | Adotado. Rodada 2: herdado em tom claro da cor primária, diferente em cor cheia, desfazer em cada caixa |
| Campo num segundo passo, com busca e "todos" | Twenty, Salesforce | Adotado: Ajustar › Campos |
| Resumo antes de salvar, com pessoas afetadas | Nenhum (oportunidade) | Adotado |
| Níveis nomeados (Nenhum, Ver, Editar, Total) | Notion, Retool, Pipefy | **Descartado.** A demanda diz que caixa funciona; 4 caixas na linha já dão o nível de relance |
| Filtro "só alteradas" ligado ao abrir | Twenty | **Descartado como padrão.** Abre em "Todas" para a tela não esconder categoria de quem chega; "Regra própria" fica a 1 clique, com contagem |
| Selecionar linhas e aplicar | Salesforce | **Adiado.** A caixa de coluna sobre a lista filtrada cobre o caso ("Filial Sul" + Excluir = 40 categorias) |
| Aba Permissões dentro da categoria | Attio, Notion, Airtable | **Adiado** para outra rodada: é a segunda porta da mesma regra |
| Escopo "só os meus itens" (`is_owner`) | HubSpot, Monday, Pipefy, ClickUp | Rodada 3: sublinha "Só se for o criador", uma caixa por ação (Ver, Atualizar, Excluir). Pede back-end (abaixo) |
| Parcial na célula | Directus, Strapi | Rodada 2: traço na caixa e dica "Ver em 76 de 80 campos"; o clique abre Ajustar › Campos |
| Ícone por ação e o que ela libera | Directus, Twenty, ClickUp, Jira | Rodada 2: ícone no cabeçalho, dica por ação e 1 linha de descrição por área fixa |
| Filhos na mesma grade | Appsmith, Retool | Rodada 2: a seta da categoria abre Campos, Quais itens e cada formulário na própria tabela |
| Ver exigido por Atualizar e Excluir | ClickUp, Appsmith, Twenty, Salesforce | Rodada 2: Ver marca sozinho e fica travado, com cadeado e "Exigido por Atualizar" |
| Quem acessa a categoria e comparar cargos | Salesforce (Object Access), HubSpot | Rodada 2: aba "Quem acessa" no Ajustar, com Tem e Não tem e "Esconder cargos iguais a este" |
| Pessoas no papel à vista | Strapi, Pipefy, monday | Rodada 2: selo "14 pessoas com este cargo" ao lado do título |

## O que a implementação precisa além da tela

1. **Padrão que vale para categoria futura.** Hoje cada permissão é `types::<categoria>::<ação>`. O padrão
   precisa de uma referência coringa (por exemplo `types::*::read`) e de uma regra de precedência: a
   permissão da categoria vence o coringa.
2. **"Todos os campos" sem lista.** Hoje Ver grava os 35 nomes; campo criado depois fica de fora até
   alguém editar o cargo. Precisa de um valor que signifique "todos", como `fields: ["*"]` ou lista vazia
   com esse sentido.
3. **Formulário que segue a categoria.** Hoje o formulário tem permissão própria e explícita (a doc exige
   Ver e Atualizar do formulário para executar a tarefa). Sem formulário marcado, ele precisa herdar a
   categoria.
4. **`EnTable` sem slot de cabeçalho.** A caixa de coluna é peça central e o `EnTable` só aceita rótulo em
   texto no cabeçalho. O protótipo usa o `UTable` (slot `#<coluna>-header`, `sticky`). Pedido para o SDK:
   slot `#header-{key}` no `EnTable`.
5. **Volume.** Acima de algumas centenas de categorias, a tabela precisa de virtualização (o `UTable` e o
   `EnTable` já têm a prop `virtualize`).
6. **Só se for o criador (`is_owner`).** O develop grava `rules: []` em toda permissão. "Só os itens que a pessoa criou"
   precisa de uma regra ali (por exemplo, criador = pessoa logada) e de o back-end aplicá-la na listagem,
   na edição e na exclusão.
7. **Quem acessa.** A aba lista o que cada cargo faz numa categoria: pede uma rota que devolva as
   permissões de todos os cargos para 1 categoria, ou a tela monta isso lendo `/ws/roles` inteiro.

Sem os itens 1 a 3, a tela ainda funciona: o front escreve a regra em cada categoria e formulário ao
salvar. Perde-se só a herança para o que for criado depois.

## Perguntas em aberto

- **Criar sem Ver.** Na rodada 2, Atualizar e Excluir passaram a exigir Ver. Criar continua solto, para o
  caso de quem só abre chamado sem ver os outros. Confirmar com produto se o back-end aceita Atualizar sem
  Ver hoje (cargo já gravado assim vira caso a migrar).
- **Regra igual ao padrão.** O protótipo trata categoria com as mesmas 4 caixas do padrão como "Segue o
  padrão". Quem quiser travar uma categoria para não acompanhar mudança futura do padrão não consegue.
- **Contagem de mudanças.** "1 alteração" é 1 categoria (ou 1 área fixa), mesmo que mexa em 35 campos. A
  confirmação detalha o resto.

## Rodada 1 · 2026-10-08
- **Pedido (literal):** "pesquise e proponha, depois de investigar como nosso modelo é hoje."
- **Mudou:** tela nova `permissoes-de-cargos`: padrão das categorias, matriz de categorias com busca,
  filtros e caixa de coluna, camada Ajustar (campos e formulários), matriz das permissões fixas,
  confirmação em palavras.
- **Fronteira:** muda o conteúdo das abas Dados e Configurações e o texto do aviso e da confirmação; não
  muda a casca, o cabeçalho, as abas e o lugar do Salvar.
- **Descartado:** níveis nomeados no lugar da caixa. Motivo: a demanda diz que a caixa funciona.
- **Descartado:** contador da aba em vermelho. Motivo: parece erro; virou selo neutro.
- **Não deu:** print das referências. Por quê: a pesquisa leu doc e código, sem abrir as telas.
- **Não deu:** diagrama de jornada. Por quê: a jornada fica numa tela só (camada lateral e confirmação por
  cima), sem passar de 2 telas.
- **Maquete:** salvar e o erro ao salvar são simulados em memória (900 ms); recarregar volta ao começo. A
  aba Inválidas é a de hoje, vazia. "Ignorar permissões para membros full" não entra.
- **Crítica e acessibilidade:** rodei a `design:design-critique`; a revisão de contraste, foco e rótulo foi
  feita dentro dela, sem rodar a `design:accessibility-review` à parte.
  - Corrigido: a caixa de coluna mexe em dezenas de categorias; o aviso ganhou "Desfazer" e fica 6 s.
  - Corrigido: a linha de detalhe da categoria passou de `text-dimmed` para `text-muted`, por contraste.
  - Corrigido: o aviso de pendência fixo no topo deixava o texto de baixo aparecer; ganhou fundo.
  - Ficou: herdado e próprio se distinguem pela cor da caixa (cinza ou primária). O selo "Regra própria"
    e o texto "Segue o padrão" na linha dizem o mesmo sem cor.
  - Ficou: no estado "Sem permissão para editar" a caixa desabilitada muda pouco no tema claro; o aviso no
    topo explica.
  - Ficou: abaixo de 900 px a tabela rola na horizontal. A tela é de administração, usada no computador.
  - Toda caixa tem rótulo para leitor de tela ("Ver: Contratos de Clientes", "Marcar Excluir nas 40
    categorias da lista").
- **CSS próprio:** nenhum (`<style>`, `:deep()` e `!important` não aparecem). Larguras e layout de tabela
  pela prop `ui` do `UTable` (`base: 'table-fixed'`), consultado no MCP `nuxt-ui` (`get-component Table`)
  e no tema gerado `.nuxt/ui/table.ts`.
- **Não deu:** refazer 3 prints depois das últimas correções. Por quê: a janela do Chrome ficou minimizada.
  - `proposta-02-ajustar-campos.jpg` mostra o tipo técnico do campo (`EnlDropdown`); a tela já mostra "Lista
    de Seleção Única".
  - `proposta-05-confirmar.jpg` mostra "categorias:liberou" sem espaço; a tela já corrigiu.
  - O print do tema escuro em espanhol saiu com a seta do mouse e foi descartado (regra da redatora de
    2026-10-06). O escuro e o espanhol foram conferidos na tela.
- **Ver:** `/permissoes-de-cargos` · `evidencias/proposta-01-categorias.jpg`, `proposta-02`, `proposta-03` e `proposta-05`

## Rodada 2 · 2026-10-08
- **Pedido (literal):** "voce tem que analisar VISUALMENTE se concorrentes apresentam tabelas melhores de ediçao de permissoes. veja isso e analise as oportunidads de melhora" e, depois das 12 propostas no chat, "pode aplicar tudo o que falou. eu avalio em tela se ta funcional"
- **Mudou:**
  - Ícone em cada ação (+, olho, lápis, lixeira) no cabeçalho de todas as tabelas, com dica do que a ação libera.
  - Herdado em tom claro da cor primária; diferente do padrão em cor cheia.
  - Desfazer em cada caixa que difere do padrão; o desfazer da linha continua.
  - Parcial na célula: traço e "Ver em 76 de 80 campos"; o clique abre Ajustar › Campos.
  - Exceção com direção: "Liberado em 15" e "Tirado em 9".
  - Descrição de 1 linha em cada área das permissões fixas.
  - Selo "14 pessoas com este cargo" ao lado do título.
  - Padrão como primeira linha da tabela, alinhado às colunas.
  - Seta na categoria abre, na mesma grade, Campos (todos, parte ou nenhum por ação), Quais itens e cada formulário (com "Segue a categoria").
  - Ver exigido por Atualizar e Excluir, em categoria, padrão, formulário, campo e permissões fixas: marca sozinho, fica travado, com cadeado e o motivo.
  - Quais itens: Todos ou Os seus, para Ver, Atualizar e Excluir; a caixa ganha um ícone de pessoa quando vale só para os seus. Reembolsos vem assim no mock.
  - Aba "Quem acessa" no Ajustar: os 7 cargos do workspace nesta categoria, com Tem e Não tem, e "Esconder cargos iguais a este".
  - 22 capturas de referência em `evidencias/ref-*.png` e a análise visual no `PESQUISA.md`.
- **Fronteira:** muda a tabela de categorias, as matrizes fixas, o Ajustar e o selo no título; não muda a casca, as abas, o aviso de pendências, a confirmação e o lugar do Salvar.
- **Mantido para comparar:** o padrão em cartão (rodada 1) fica no andaime, em "Padrão › Cartão (rodada 1)". Sai num commit próprio quando a redatora escolher.
- **Risco registrado:** com o padrão na primeira linha, a grade tem 2 controles de "todas": a linha do padrão (vale para categoria sem regra, inclusive futura) e a caixa do cabeçalho (marca a lista filtrada). A dica de cada um diz o alcance.
- **Maquete:** "Quem acessa" usa os outros 6 cargos com regra fixa no `mocks.ts`; o "Os seus" não filtra item nenhum, só grava a escolha. Recarregar volta ao começo.
- **Não deu:** conferir o visual final no servidor local. Por quê: o servidor que estava de pé é de outra conversa e gerou o CSS das classes novas de forma instável (a mesma classe aparecia e sumia entre recargas). Comportamento conferido pelo DOM; visual conferido no build publicado.
- **Crítica e acessibilidade:**
  - Toda caixa nova tem rótulo ("Ver: Contratos de Clientes"); o cadeado e a pessoa têm dica em texto, não só cor.
  - Parcial, herdado e travado não dependem só de cor: traço, tom e cadeado.
  - Ficou: a linha das categorias abertas fica longa com 12 formulários; a seta recolhe.
- **CSS próprio:** nenhum. Tom claro pela prop `ui` do `UCheckbox` (`indicator: 'bg-primary/40'`), consultada no tema gerado `.nuxt/ui/checkbox.ts`.
- **Não deu:** print da rodada 2. Por quê: a janela do Chrome estava escondida; conferi o visual pelo CSS calculado no site publicado (recuo das sublinhas, tom claro do herdado, desfazer sem sobrepor a caixa).
- **Ver:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/

## Rodada 3 · 2026-10-08
- **Pedido (literal):** "ta sem tooltip nos cadeados. nao precisa de icone nos titulos de criar, ver editar e excluir. pode diminuir a distancia entre as colunas, acredito. se uma permissao tiver "outras açoes", sendo mais de uma na mesma linha, como ficaria? é melhor dividir em mais colunas? agora, ainda tem um tipo de permissão que não temos, mas precisamos ter, que é: pode ter essa permissão desde que seja criador daquilo. ex.: pode ver itens na categoria x se tiver criado esse item. como isso seria configurado? seria uma permissao is_owner"
- **Mudou:**
  - Cadeado com dica: o motivo ("Exigido por Atualizar. Desmarque Atualizar para tirar Ver.") mora no próprio cadeado, que recebe foco pelo teclado. A caixa travada fica desabilitada e não abre dica.
  - Títulos Criar, Ver, Atualizar e Excluir sem ícone, nas 3 tabelas. A dica do que a ação libera continua no título.
  - Colunas de ação com 80 px fixos e sem recuo lateral; a coluna do nome fica com o resto.
  - Outras ações: até 2 aparecem na linha; a partir da 3ª, um botão "+N ações" abre a lista, e mostra quantas estão marcadas lá dentro.
  - Simulação no andaime ("Outras ações › Simular 5 na mesma área"): Tarefas rápidas ganha 5 ações inventadas para ver o caso.
  - Só se for o criador (`is_owner`): a sublinha virou uma caixa por ação (Ver, Atualizar, Excluir), no lugar do seletor "Todos / Os seus".
- **Descartado:** uma coluna para cada "outra ação". Motivo: cada uma existe numa área só (Usar Chat da IA só em IA, Reenviar só em Enviados), então cada coluna nova teria 1 caixa e 23 linhas vazias, e a tabela alargaria a cada função nova.
- **Fronteira:** muda o cadeado, os títulos das colunas, as larguras, a coluna Outras ações e a sublinha de criador; não muda o resto.
- **Maquete:** as 5 ações simuladas não existem no develop e não entram na contagem de Permissões Ativas.
- **Ver:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/

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
| Padrão do cargo + exceções, com contador "Diferente em N" | Twenty | Adotado: cartão do padrão e "Diferente em 12 categorias" |
| Categoria nova herda o padrão | Todos os 16 | Adotado; pede back-end (abaixo) |
| Matriz recurso × ação | Directus, Strapi, Zoho | Adotado: categorias e permissões fixas |
| Caixa de linha e de coluna que marca tudo | Strapi, Twenty, Directus | Adotado, com 3 estados |
| Estado herdado e "voltar ao padrão" | Twenty, Notion | Adotado: caixa cinza herda; selo "Regra própria" e botão de desfazer |
| Campo num segundo passo, com busca e "todos" | Twenty, Salesforce | Adotado: Ajustar › Campos |
| Resumo antes de salvar, com pessoas afetadas | Nenhum (oportunidade) | Adotado |
| Níveis nomeados (Nenhum, Ver, Editar, Total) | Notion, Retool, Pipefy | **Descartado.** A demanda diz que caixa funciona; 4 caixas na linha já dão o nível de relance |
| Filtro "só alteradas" ligado ao abrir | Twenty | **Descartado como padrão.** Abre em "Todas" para a tela não esconder categoria de quem chega; "Regra própria" fica a 1 clique, com contagem |
| Selecionar linhas e aplicar | Salesforce | **Adiado.** A caixa de coluna sobre a lista filtrada cobre o caso ("Filial Sul" + Excluir = 40 categorias) |
| Aba Permissões dentro da categoria | Attio, Notion, Airtable | **Adiado** para outra rodada: é a segunda porta da mesma regra |
| Escopo "só os meus itens" | HubSpot, Monday, Pipefy | **Fora do escopo.** O modelo tem `rules`, vazio em tudo que a tela marca hoje |

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

Sem os itens 1 a 3, a tela ainda funciona: o front escreve a regra em cada categoria e formulário ao
salvar. Perde-se só a herança para o que for criado depois.

## Perguntas em aberto

- **Criar sem Ver vale?** Os 16 produtos amarram Ver às outras ações. No ENSPACE, "Criar sem Ver" pode ser o
  caso de quem só abre chamado. O protótipo não amarra; a decisão é de produto.
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

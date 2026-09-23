# Pesquisa — como o mercado resolve cell, form e naked

A demanda nomeou quatro referências (Notion, ClickUp, Monday, Twenty CRM). A spec do agente
exige cinco obrigatórias, então entra Pipefy, e mais três pela natureza do problema (gestão de
dados e registros): Airtable, Attio e o Monday **developer** (que é a mesma marca, mas uma
fonte diferente: a API, e não a interface).

> **Aviso de método.** Notion, ClickUp, Monday e Attio exigem conta para ver a interface por
> dentro. **Eu não crio conta nem digito senha em formulário**, nem com e-mail temporário: é
> limite do agente, não escolha de método. Então a leitura destes quatro foi feita pela
> documentação oficial e pela API pública. O Twenty CRM é open source e foi lido **no código**,
> que é a fonte mais forte das oito.

---

## 1. Twenty CRM — a referência mais próxima do que precisamos

**URL:** `https://github.com/twentyhq/twenty` · `https://docs.twenty.com/user-guide/data-model/capabilities/fields`

**Como resolve, em passos:**

1. Cada tipo de campo tem **exatamente dois componentes**:
   `meta-types/display/components/<Tipo>FieldDisplay.tsx` e
   `meta-types/input/components/<Tipo>FieldInput.tsx`. São 26 pares.
2. O **mesmo** `FieldDisplay` é usado na célula da tabela e na linha do painel do registro.
   Não existe versão de célula e versão de painel: existe um desenho e dois invólucros.
3. O invólucro da célula corta em uma linha (`white-space: nowrap`, `text-overflow: ellipsis`,
   `min-height: 16px`).
4. O invólucro do painel é o `RecordInlineCellContainer`: ícone de 16 px, rótulo em cor
   terciária e largura fixa, valor ocupando o resto. No hover ganha fundo claro e cursor de
   clique; clicar troca o display pelo input **no lugar**.
5. Valor múltiplo passa por um `ExpandableList` com `maxInlineCount`. Para relação o limite é
   `MAX_RELATION_CHIPS_DISPLAYED_INLINE = 10`, e o contador `+N` só aparece quando o campo está
   focado.
6. Campo vazio não some: o painel renderiza um `StyledEmptyField` em cor clara.
7. Endereço é achatado em uma linha por `formatAddressDisplay`, com a lista de subcampos vindo
   de `settings.subFields`.

**O que serve:** tudo. É literalmente o modelo "um componente de leitura por tipo, dois
invólucros" que este protótipo propõe. O `ExpandableList` com limite por tipo é a origem do
`maximoNaCelula` do catálogo, e o `RecordInlineCellContainer` é a origem do formato cru.

**O que não serve:** o Twenty tem 17 tipos de campo e o ENSPACE tem 31, com famílias que o
Twenty não tem (repetidor, grupo, editor de documento, PDF com selo, chat). O padrão de
composição serve; a lista de tipos, não.

---

## 2. Notion — o side peek e a propriedade de página

**URL:** `https://www.notion.com/help/database-properties` · `https://www.notion.com/help/views-filters-and-sorts`

**Como resolve, em passos:**

1. São 24 tipos de propriedade. Tabela, quadro, lista e linha do tempo abrem a página em
   **side peek** por padrão.
2. No side peek, as propriedades aparecem **no topo da página**, uma por linha, cada linha com
   nome, ícone do tipo e valor. É a mesma lista da tabela, em coluna.
3. A visibilidade das propriedades é por **visão**: o que aparece na tabela e o que aparece no
   peek se configuram separadamente.
4. Select, multi-select e status são chips coloridos; pessoa é avatar; data é texto; checkbox é
   caixa. O mesmo desenho na célula e na página.
5. Cor condicional existe em Select, Multi-select, Status, Texto, Número, Data, Pessoa,
   Checkbox, Fórmula, Relação e Rollup, e é configurada **por visão**.

**O que serve:** a ideia de que o "naked" é a mesma lista da tabela, em coluna, e não um
formulário. E a visibilidade por visão, que o ENSPACE já tem no conceito de visualização.

**O que não serve:** no Notion a propriedade vira editor ao clicar em qualquer lugar,
inclusive na tabela. O ENSPACE hoje não edita na célula, e mudar isso é outra demanda
(regra 19: não resolver na tela B o problema da tela A).

---

## 3. Monday — a separação `value` e `text` na própria API

**URL:** `https://developer.monday.com/api-reference/reference/column-types-reference`

**Como resolve, em passos:**

1. São 27 tipos de coluna gravável, mais seis só de leitura (fórmula, espelho, progresso,
   log de criação, id do item, última atualização).
2. Toda coluna implementa a interface `ColumnValue` com quatro campos: `id`, `type`,
   **`value`** e **`text`**.
3. `value` é o JSON cru. `text` é a **forma legível**, calculada pelo servidor.
4. Campos específicos de cada tipo (o `label` do status, o `url` do link) só saem por fragmento
   GraphQL do tipo.

**O que serve:** e serve muito. O Monday resolve exatamente a distinção que a demanda pediu:
**formato de saída** é o `value`, **saída formatada** é o `text`, e as duas viajam juntas na
mesma resposta. Hoje o ENSPACE devolve só o cru e deixa o front formatar com o `cFormat`, o
que significa que **cada consumidor formata de um jeito** (a tela, a exportação, o e-mail, o
relatório). Está na lista de recomendações do `DECISOES.md`.

**O que não serve:** a lista de tipos do Monday é de gestão de trabalho, não de dados
estruturados. Nada de repetidor, grupo ou pessoa jurídica.

---

## 4. ClickUp — o campo que declara as próprias opções de formatação

**URL:** `https://help.clickup.com/hc/en-us/articles/6303499162647-Custom-Field-types`

**Como resolve, em passos:**

1. 23 tipos de Custom Field. Cada um publica, na própria documentação, **quais opções de
   configuração tem**: obrigatório, valor padrão, moeda, ordem das opções, cor por opção,
   ordenação automática ou manual.
2. Tipos de escolha (Dropdown e Labels) aceitam até 500 opções e colam lista de uma vez.
3. Money declara a moeda no campo, não no valor.
4. Progress tem duas variantes (automático e manual), e o automático declara **de onde** o
   progresso vem (subtarefas, checklists, comentários atribuídos).
5. Text é "automaticamente centralizado no meio" e tem limite de 2.048 caracteres; Text area
   tem 50.000. O limite é parte da definição do tipo.

**O que serve:** a disciplina de o tipo declarar as próprias opções, com exemplo escrito
(`$123.45`, `R$12,345.00`, `+1 (212) 555 1234`). É o que a ficha do protótipo faz com as
chaves de `cFormat` e `config`. E o limite de caracteres como parte do tipo, que o ENSPACE tem
em `cFormat.t_length` e não mostra em lugar nenhum.

**O que não serve:** o ClickUp não tem campo composto de verdade (nada como o `group` ou o
`EnRepeater`), então não ajuda nas três famílias mais difíceis do ENSPACE.

---

## 5. Pipefy — o tipo escolhido pela pergunta, não pelo dado

**URL:** `https://help.pipefy.com/en/articles/625205-field-types`

**Como resolve, em passos:**

1. A tabela de tipos da ajuda tem duas colunas: **tipo** e **"sugestão de aplicação"**. A
   documentação não descreve o dado, descreve a **pergunta** que o campo faz.
2. Separa `Dropdown Select` de `Radio Select` pelo tamanho da lista, em texto:
   *"formato de lista onde todas as opções ficam visíveis. Ideal para listas com poucos itens."*
3. Tem três tipos de data distintos (Date, Datetime, Due Date), porque as três respondem a
   perguntas diferentes.
4. Currency deixa **a pessoa escolher a moeda ao preencher**, para o mesmo campo servir a
   vários países.
5. Tem `Unique Values`, que vale só para sete tipos, e a lista dos sete está escrita.

**O que serve:** a regra escrita de quando o radio vira lista suspensa (está no catálogo deste
protótipo: acima de cinco opções) e a ideia de documentar o tipo pela pergunta que ele faz,
que é o que a linha "descrição" da ficha entrega.

**O que não serve:** o Pipefy não tem tabela de registros no sentido do ENSPACE (o formato
principal é o cartão em fase), então o formato célula não tem paralelo.

---

## 6. Airtable — o formato do valor documentado tipo a tipo

**URL:** `https://airtable.com/developers/web/api/field-model`

**Como resolve, em passos:**

1. A documentação de API tem uma entrada por tipo com o **formato exato do valor de célula**:
   `string`, `number`, `array<string>`, objeto com chaves nomeadas.
2. Percent guarda `0.123` e mostra `12,3%`. Duration guarda **segundos** e mostra `h:mm`.
   O valor cru e o formatado são explicitamente diferentes, e os dois estão escritos.
3. As opções que mudam a formatação são listadas por tipo: `precision`, `symbol`,
   `dateFormat` (local, amigável, EUA, europeu, ISO), `timeZone`, `timeFormat`,
   `durationFormat`.
4. Anexo devolve array de objetos com `id`, `filename`, `url` e dimensões.
5. Colaborador devolve `{ id, email, name }`, e a versão múltipla devolve array disso.

**O que serve:** é o modelo da tabela "formato de entrada, formato de saída, saída formatada"
que a ficha deste protótipo mostra. O Airtable prova que dá para documentar os três por tipo
sem virar um manual.

**O que não serve:** o Airtable guarda porcentagem como fração e o ENSPACE guarda o número
com `n_multiplier`. Copiar a convenção quebraria dado gravado.

---

## 7. Attio — o tipo que se comporta diferente em cada verbo

**URL:** `https://docs.attio.com/docs/attribute-types`

**Como resolve, em passos:**

1. 17 tipos de atributo, incluindo três que o ENSPACE não tem: `Actor reference` (quem fez),
   `Interaction` (último contato) e `Status`, separado de `Select`.
2. A documentação abre dizendo que os tipos *"podem se comportar de forma diferente ao criar,
   visualizar, filtrar e ordenar"*, e tem uma página por tipo com as quatro seções.
3. `Personal name` e `Location` são tipos próprios, não texto, porque precisam ordenar e
   filtrar por parte (sobrenome, cidade).

**O que serve:** a divisão em quatro verbos. Este protótipo cobre três (criar, ver em tabela,
ver em painel) e **deixa filtrar e ordenar de fora**, o que é uma lacuna consciente e está no
`DECISOES.md`.

**O que não serve:** separar `Status` de `Select` é decisão de modelo de dados, não de
renderização, e o ENSPACE já tem status de item como conceito próprio.

---

## 8. Monday developer, de novo, pelo lado dos tipos só de leitura

**URL:** `https://developer.monday.com/api-reference/reference/column-types-reference`

Vale destacar separado porque é o único dos oito que **classifica os tipos por quem escreve**:

- **graváveis** (27): a pessoa preenche;
- **só de leitura** (6): o sistema calcula (fórmula, espelho, progresso, logs, id, última
  atualização);
- **render-time** (1): o número automático, que nem existe no dado;
- **integração**: suporte parcial declarado.

**O que serve:** essa classificação resolve, de uma vez, o que fazer com `EnCustomCode`,
`EnChats` e `EnOnlyoffice` no formulário de criação: eles não são campos que se preenchem, são
campos que **nascem depois**. O protótipo os mostra desabilitados com a explicação, em vez de
um controle vazio que engana.

**O que não serve:** o ENSPACE não tem hoje essa marcação no `Field`, então ela teria que ser
derivada do tipo. Está nas recomendações.

---

## O padrão que todos seguem

1. **Um desenho por tipo, reusado.** Notion, Twenty e Airtable renderizam o mesmo tipo do
   mesmo jeito na tabela e no detalhe. Nenhum dos oito tem dois desenhos para o mesmo campo.
2. **Escolha é chip colorido, texto é texto.** Todos os oito. Cor vem da opção, não do campo.
3. **Lista longa vira "os primeiros + contador".** Twenty (`ExpandableList`), Notion, Monday,
   Airtable. Ninguém deixa a célula crescer.
4. **Número e moeda à direita, com a formatação declarada no campo.** Todos.
5. **O detalhe do registro é a mesma lista da tabela, em coluna, não um formulário.** Notion
   (side peek), Twenty (record page), Attio (record). O formulário aparece quando se clica.
6. **A documentação do tipo diz o formato do valor.** Airtable, Monday e ClickUp fazem isso
   tipo a tipo. É o que falta ao ENSPACE, e é o que a ficha deste protótipo entrega.
7. **Campo vazio é marcado, não some.** Twenty tem um componente só para isso.

## O que nenhum deles faz

1. **Nenhum mostra, para quem usa, o contrato do campo.** A informação existe só na
   documentação de desenvolvedor. A **ficha do campo** deste protótipo põe os três formatos e
   os três estágios do valor lado a lado, sobre o dado real. É o pedaço que pode ficar melhor
   que o mercado, ainda que como ferramenta interna.
2. **Nenhum trata display vazio de relação.** O ENSPACE tem o problema hoje (`display: ""`) e
   pode resolver melhor: cair para a referência em vez de deixar a célula em branco.
3. **Nenhum tem campo composto de verdade** no nível do `EnRepeater` e do `group`. Aqui o
   ENSPACE está sozinho, e o padrão de "o composto não cabe no resumo" é decisão nova.
4. **Só o Monday devolve o valor formatado junto com o cru.** Os outros sete deixam o cliente
   formatar. Se o ENSPACE adotar o par `value` + `text`, sai na frente de seis dos oito.

## Rodada 6: os dois gestos que ela apontou

Ela nomeou dois comportamentos de concorrente que quer no produto, e os dois
entraram no protótipo. **Esta seção é o padrão como eu o conheço e como ela o
descreveu; a conferência campo por campo dentro dos boards dela ficou bloqueada
no login.** O que precisa ser medido lá está no fim do `DECISOES.md`.

### O "zoom" do Notion na célula

Clicar numa célula da tabela do Notion não monta o controle dentro da célula: abre
um quadro que fica ancorado nela e **cresce para fora**, por cima da grade, com
borda e sombra, e cresce em altura conforme o conteúdo pede. O valor não se move
de lugar quando o quadro aparece, e é isso que faz parecer aproximação em vez de
"abriu um popup em outro canto".

| Produto | O que faz ao clicar na célula |
|---|---|
| **Notion** | quadro ancorado que salta para fora, cresce e ganha sombra |
| **ClickUp** | popup por tipo, com cabeçalho e ações, para os campos complexos |
| **Airtable** | edita dentro da célula e expande para fora só no texto longo |
| **Monday** | popup centrado, longe da célula |
| **Twenty CRM** | controle dentro da célula, do tamanho dela |

O Notion ganha porque resolve os dois problemas de uma vez: a altura fixa da linha
deixa de limitar o controle, e a pessoa não perde o lugar onde estava.

### A criação pela grade, do ClickUp

O ClickUp deixa criar tarefa digitando na própria tabela, sem abrir formulário.
No ClickUp a linha fica **no fim** do grupo; ela pediu **no começo**, e a razão é
boa: em tabela paginada, o fim da página não é o fim de nada e o item nasce longe
do olho.

| Produto | Criar pela tabela |
|---|---|
| **ClickUp** | linha no fim do grupo, digita o nome e Enter cria |
| **Notion** | linha no fim, com um "+ New" fixo no rodapé da tabela |
| **Airtable** | linha vazia permanente no fim |
| **Monday** | campo "+ Add item" no fim do grupo |
| **Twenty CRM** | botão no topo que insere uma linha editável no topo |

Quem cria no topo é o Twenty, e é o desenho que ela pediu. O que trouxemos do
ClickUp é o resto: a linha aceita valor em qualquer coluna antes de criar, e o
Enter fecha o ciclo sem passar pelo formulário.

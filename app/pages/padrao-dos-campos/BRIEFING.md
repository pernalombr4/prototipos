# Briefing — Padrão dos campos

## 1. A demanda, como ela veio

> agora, voce vai fazer um prototipo grande e importante.
>
> precisamos PADRONIZAR backend e frontend de todos os nossos campos para fazer o seguinte trabalho:
>
> * definir como cada um aparece em:
>    * tabela
>    * formulário
>    * sidebar/tela de detalhes do item ou tarefa
>
> sao os formatos cell, form e "naked".
>
> nossas referencias de mercado sao, nesse caso, ESPECIFICAMENTE: notion, clickup, monday e twenty crm.
>
> voce vai precisar prototipar o comportamento de todos os nossos campos em todos esses cenarios. pra isso, vai simular uma tabela de itens refletindo uma categoria que tenha TODOS OS TIPOS DE CAMPO criados. o titulo das colunas da tabela, que seriam as labels dos campos, podem ser o nome do tipo de campo mesmo, pra facilitar.
>
> voce deve prototipar com base especificamente na tela NOVA de itens. nao na antiga. (voce ve isso pelo banner lab quando acessar develop). Na tabela antiga nao mexeremos, entao considere:
>
> * o modo como o form aparece na hora de criar o item na tela nova
> * a sidebar do item na tela nova (as 2 colunas dela)
> * o modo como a tabela se comporta na tela nova
>
> é isso que precisa ser prototipado, pra cada tipo de campo.
>
> no prototipo voce deve dar informaçoes ao interagir sobre o backend de cada campo tambem, considerando:
>
> * qual o formato de entrada
> * o formato de saída
> * a saída formatada

E, na mesma rodada, mais duas instruções:

> saiba que na construçao do prototipo, em relaçao ao backend, formato de entrada, saida e saida formatada, voce pode apontar erros no doc que te enviei, ok? nao é fonte canonica de verdade, sao ensaios do time de produtos. se notar erros, pode sugerir diferente no protitpo, mas me reporte imediatamente a diferenciaçao que fez e vamos falar sobre.
>
> e sobre saída em relatorio, no prototipo voce deve permitir extrair relatorio em tela de verdade. pra termos um xlsx de saida pro dev ver exatamente as saidas planejadas.

## 2. A tela em jogo

A tela **nova** de itens, a que o Lab liga. No develop:

- `https://develop.enspace.io/workspaces/<ws>/types/<categoria>?view=default`
- com as funcionalidades **Nova Listagem de Registros** e **Nova Visualização de Itens**
  ativas em `https://develop.enspace.io/profile?tab=lab`
- a tela nova se reconhece pelo selo do Lab (o frasco) no canto superior direito

A tela antiga não é tocada.

## 3. O que seria sucesso

Quem abre a tela consegue dizer, para qualquer tipo de campo, como ele se desenha nos três
lugares e o que o back-end manda e devolve, sem perguntar para ninguém.

## 4. O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` antes de qualquer coisa. Não existe tema dedicado a campos,
mas existem quatro achados diretamente ligados a esta demanda.

| Fricção | O que diz | Como entra aqui |
|---|---|---|
| **N8** (acerto registrado) | *"O formulário de Campo é o bom padrão que o produto já tem"*: texto de ajuda sob cada campo, aviso de irreversibilidade, tooltip por tipo no dropdown, **pré-visualização ao vivo** e o formulário se adaptando ao tipo escolhido | É o padrão interno que o protótipo herda: rótulo clicável, ajuda embaixo e ficha com prévia ao vivo. Não inventei padrão: ele já existe a dois cliques |
| **U5** | *"Três sistemas de tabela no mesmo produto"* | É o problema de fundo. Padronizar a célula só resolve se a célula for a mesma peça em qualquer tabela |
| **N7** | A lista de campos mistura idiomas e erra a concordância: `ID`, `Criado em`, **`Editar em`**, **`reference`**, **`Display`**, **`data`** | Confirma que o rótulo do campo e o nome técnico estão embaralhados na interface. O protótipo separa os dois de propósito: o rótulo é texto, o `refId` é `font-mono` |
| **N1** | Criar registro em categoria sem campos abre um modal vazio | O estado vazio do formulário faz parte do padrão e está no protótipo |

Não havia nada sobre cell/form/naked nem sobre formato de saída. Isso é novo.

## 5. O que o develop faz hoje

### 5.1 A casca da tela, item por item

Copiada olhando, em 22/09/2026, de `/workspaces/teste-ux/types/leve?view=default`:

**Menu lateral (208 px aberto, 56 px recolhido)**

- topo: avatar redondo com as iniciais do workspace, nome, slug abaixo, chevron
- busca: ícone de lupa, "Buscar...", `Ctrl` `K`
- seção **Membro**: Início, Spaceflows, Categorias (expansível, aberta), Tarefas (expansível),
  Agenda, Knowledge (expansível)
- seção **Configurações**: Visão Geral, Sistema, Estrutura (expansível), Gestão de Membros,
  Interface (expansível), E-mails (expansível), Integrações, Agentes de IA, Logs, Credenciais
- seção **Ajuda**: Releases, Documentação (com seta de link externo)
- botão redondo de recolher, na borda direita, na metade da altura

**Barra do topo (44 px)**

- recolher painel, voltar, avançar, recarregar, início
- faixa arredondada central com ícone de ramificação e a trilha
  `teste ux 2 › Categorias › leve`, e `Ctrl` `B` + estrela à direita
- à direita: bandeira do idioma, sol (tema), **Suporte**, sino, avatar com chip verde

**A tela**

- abas `Itens` (ativa, ícone de tabela) e `+ Visualizar`
- selo do **Lab** (frasco), quadrado, canto superior direito
- barra de ferramentas: busca "Pesquisar registros", "Criado em", "Todo o período" e, à
  direita, quatro ícones (**Exportar**, **Colunas**, **Densidade**, **Mais opções**) mais o
  botão primário **+ Novo registro**
- tabela: coluna de seleção, coluna **Ações** com o menu `⋮`, e as colunas dos campos, cada
  uma com seta de ordenação e funil de filtro. O cabeçalho tem ícone de fixar coluna
- rodapé: "Mostrando 1 a 3 de 3 resultados", "100 por página" e a paginação

### 5.2 O formulário de criação

`+ Novo registro` abre um **modal centrado**, ~900 px:

- título "Novo registro" e X no canto
- os campos empilhados em **uma coluna só**, rótulo acima do controle, largura cheia
- corpo com altura fixa e muito espaço vazio abaixo do último campo
- rodapé com `Cancelar` e `Criar`

**Achados (não são proposta, são o que está lá):**

1. **Esc não fecha o modal.** Testado: a tecla não faz nada, é preciso clicar em Cancelar ou no X.
2. **Uma coluna só.** Com a categoria de teste (um campo) não incomoda. Com trinta campos vira
   rolagem de três telas.
3. **Nenhum texto de ajuda por campo**, ao contrário do formulário de Campo em Configurações
   (fricção N8), que tem.

### 5.3 A sidebar do item, e as duas colunas

`Ações › Ver Detalhes` abre um painel pela direita. Ele nasce estreito, com um trilho de
ícones à esquerda, e o botão `»` na borda esquerda **expande** para o formato de duas colunas:

**Coluna 1 (~270 px), os metadados**

- cabeçalho: ícone quadrado, a **referência** como título (quebrando em duas linhas), o nome
  da categoria abaixo, e `⋮` à direita
- selo com o nome da categoria
- seção **IDENTIFICAÇÃO**: `ID` → `47617`
- seção **ORIGEM**: `STATUS` → `Ativo`; `E-MAIL DA SOLICITAÇÃO` → o e-mail
- seção **HISTÓRICO**: `CRIADO EM` → `14/09/2026, 21:32:11`; `ATUALIZADO EM` → idem

Cada linha é: ícone pequeno, rótulo em **caixa alta miúda** e o valor embaixo, em peso médio.
Cada seção tem um ponto colorido antes do título.

**Coluna 2, os campos**

- abas `Visão Geral`, `Comentários`, `Logs de Auditoria`
- navegador de registro `‹ 1/3 ›` no canto direito do mesmo cabeçalho
- os campos da categoria, em **uma coluna**, rótulo acima do controle, tudo editável
- rodapé fixo com o botão `Salvar`

**É esta coluna 1 que resolve o formato "naked" da demanda.** Ela já existe e já tem o
desenho certo (ícone, rótulo em caixa alta, valor). Hoje ela só carrega metadado de sistema.

### 5.4 Os tipos de campo que existem de verdade

Três fontes, e elas **não batem**:

| Fonte | Quantos | Como se lê |
|---|---|---|
| `Field.type` do `@be-enlighten/enspace-sdk-schemas` | 24 | o enum do schema publicado |
| `GET /ws/types/:slug/fields` em develop | 25 distintos em uso | o que está gravado |
| O dicionário de i18n do develop (rótulo + descrição por tipo) | 22 | o que o seletor "Tipo de Campo" oferece |

**A união dá 31 tipos**, e as diferenças são informação:

- **no schema e não no seletor** (7): `EnlMask`, `EnlCheckbox`, `EnTreeSelect`, `EnlTimeRange`,
  `EnPDF` (tem rótulo no i18n, então está no seletor), `email`, `uploadImage`;
- **na API e não no schema** (7): `group`, `checkbox`, `EnESign`, `EnNotes`, `EnCustomCode`,
  `EnChats`, `EnCurrency`;
- **`checkbox` vs `EnlCheckbox`**: o schema tem `EnlCheckbox`, o dado gravado e o i18n têm
  `checkbox`. São o mesmo campo, com duas chaves.

O protótipo renderiza os 31, e marca cada um como **no seletor** ou **legado**. Tipo legado
não se cria mais, mas existe em dado gravado, e a tela precisa desenhar mesmo assim.

### 5.5 O formato de saída, observado

Lido em `GET /ws/types/:slug/items`, olhando só a **forma** do valor:

| Tipo | `data[refId]` devolve |
|---|---|
| `inputText`, `EnTextArea`, `EnHtml`, `EnlDropdown`, `radioButton` | `string` |
| `EnlNumber` | `number` |
| `inputSwitch` | `boolean` |
| `EnlCalendar` | `string` ISO 8601 com `Z` (`"2026-09-14T21:32:11.000Z"`) |
| `multiSelect`, `checkbox` | `array<string>` |
| `EnRel` | `{ id, display, reference }` |
| `EnRelMulti` | `array<{ id, display, reference }>` |
| `EnPerson` | `{ name, email, … }` |
| `EnAddress` | `{ street, number, complement, neighborhood, city, state, zip, country }` |
| `uploadFile` | `{ url, filename, mime, mimeType, size }` |
| `group` | objeto com os `refId` dos filhos |
| `EnRepeater` | `array<objeto>` com os `refId` dos filhos |

**Achado importante: `EnRel.display` volta vazio.** Em vários itens o objeto vem
`{ id, display: "", reference: "CLIC…" }` ou com `display` só com espaços. Acontece quando o
`config.rel.displayString` aponta para um campo que o item relacionado não preencheu. Hoje a
célula fica em branco e a pessoa não tem como saber que existe uma relação ali. O protótipo
trata isso: **display vazio cai para a referência, nunca para nada.**

### 5.6 O que preparei e o que não deu

- **Não criei a categoria de vitrine no develop.** O `API_TOKEN` de `config/tokens.md` tem
  escopo de leitura e só no workspace `be-enspace`, então não dava para preparar em massa por
  API no workspace de exploração. Criar 31 campos pela tela, um a um, num painel que ainda por
  cima renderiza fora da área visível (ver abaixo), custaria a rodada inteira. A vitrine existe
  **no mock**, com a estrutura tirada das três fontes acima.
- **O painel de criação de Campo renderiza fora da viewport.** Em `Estrutura › Categorias ›
  leve › Campos › Criar +`, com a janela em 1920 px, o conteúdo do painel começa em
  `x = 1928` (medido com `getBoundingClientRect`). O seletor "Tipo de Campo" fica inalcançável
  por clique. É achado, não proposta, e não foi consertado aqui.
- **Os prints do develop não foram commitados.** A única captura da sidebar de duas colunas
  mostra o e-mail de uma pessoa real no campo `E-MAIL DA SOLICITAÇÃO`, e o repositório é
  público (regra 13). A casca está descrita item por item acima, e os prints da entrega são os
  do próprio protótipo.

### 5.7 O documento do time de produtos

O doc `Melhoria dos campos.docx` no SharePoint **não pôde ser aberto**: o link exige sessão
autenticada da Microsoft, e o agente não digita senha nem faz login (regra 2). Então **não há
comparação com os ensaios do time** neste protótipo. O que está aqui saiu de três fontes
verificáveis: o schema publicado no SDK, a API de develop e o dicionário de i18n do produto.
Se o doc disser outra coisa, a divergência precisa ser conferida a olho com este briefing.

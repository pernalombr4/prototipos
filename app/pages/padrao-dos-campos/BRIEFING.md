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

### 5.3.1 Como se chega na sidebar e na tela dedicada

Medido em 22/09/2026, na tela nova:

| Gesto | O que abre | URL |
|---|---|---|
| **Duplo clique na linha** da tabela | a **quickview**, o painel pela direita | a mesma da lista, sem mudar |
| `⋮ › Ver Detalhes` | a mesma quickview | a mesma da lista |
| `⋮ › Editar` | a **tela dedicada do item**, em página inteira | `/workspaces/<ws>/types/<slug>/<REFERENCE>` |

A tela dedicada tem a **mesma estrutura de duas colunas** da quickview: à esquerda o bloco de
metadados em formato cru (ícone, rótulo em caixa alta, valor), à direita as abas `Visão Geral`,
`Comentários` e `Logs de Auditoria` com os campos em formulário e o `Salvar` no rodapé. O
navegador `‹ 1/3 ›` e o botão `«` de recolher a coluna da esquerda também são os mesmos.

Ou seja: **a coluna da esquerda é o lugar do formato cru nos dois lugares**, e a parte de
dentro é sempre formulário. A quickview é a versão em gaveta da tela dedicada.

### 5.4 Os tipos de campo que existem de verdade

> ⚠️ **Esta contagem está incompleta e vai ser corrigida.** Ao abrir o seletor "Tipo de Campo"
> em 22/09/2026, o menu é uma lista virtualizada com `scrollHeight = 1198 px` e item de 34 px,
> ou seja **cerca de 35 tipos oferecidos**, não 22. Os dez primeiros, na ordem em que aparecem:
> **Matriz de dados**, Texto Curto, Texto Longo, Número, **Duração**, Data (Calendário),
> Alternativa Binária, Caixas de Seleção, Botões de Seleção única, Lista de Seleção Única.
>
> Dois aprendizados imediatos:
>
> - **"Matriz de dados" existe e eu não tinha.** A descrição no i18n do produto é *"Permite
>   criar uma tabela personalizada onde cada linha representa um registro e cada coluna
>   representa um campo específico"*, com configurações próprias (`all_rows_required`,
>   `all_columns_unique_value`, `complement_label`). É parente do Repetidor, não o mesmo;
> - **"Duração" existe no seletor.** Eu havia classificado como `proposto` por não achar no
>   schema nem na API. Está errado: é tipo ativo.
>
> Os 25 restantes só se leem com a janela do Chrome visível, porque a lista é virtualizada e o
> virtualizador não renderiza em aba de fundo.

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
- ~~**O painel de criação de Campo renderiza fora da viewport.**~~ **Isto estava errado e foi
  retirado em 22/09/2026.** O painel realmente ficava parado em `x = 1928`, mas a causa era a
  **janela do Chrome minimizada**: sem a aba visível o navegador congela o `requestAnimationFrame`,
  e a transição de entrada do drawer do naive-ui fica presa no estado inicial
  (`transform: translateX(921px)`). Com a aba visível o painel abre normalmente. Não é defeito
  do produto. Fica aqui como armadilha de investigação, não como achado.
- **Os prints do develop não foram commitados.** A única captura da sidebar de duas colunas
  mostra o e-mail de uma pessoa real no campo `E-MAIL DA SOLICITAÇÃO`, e o repositório é
  público (regra 13). A casca está descrita item por item acima, e os prints da entrega são os
  do próprio protótipo.

### 5.7 O documento do time de produtos

O `Melhoria dos campos.docx` foi lido em 22/09/2026, pelo Chrome dela, na sessão já
autenticada. A primeira tentativa falhou porque o Word Online renderiza dentro de um iframe
sem texto acessível; o conteúdo saiu buscando o próprio arquivo pela API do SharePoint na
sessão da página e abrindo o `word/document.xml` no navegador.

**O que o documento tem:**

1. uma lista de 21 nomes de campo (com "Grupo" repetido);
2. anotações de pesquisa sobre ClickUp, Notion e Twenty CRM, com observações de comportamento;
3. **especificação técnica de 13 campos**, cada um com Entrada, Saída, Saída Formatada, Form,
   Cell e Naked. Exatamente a estrutura que esta demanda pediu;
4. a declaração de que faltam as especificações de **Grupo**, **Pessoa/Empresa** e **Campo
   virtual de valor dinâmico**;
5. uma seção inteira de **"Padronização de Formatos de Exportação em Excel (.xlsx)"**.

Os 13 especificados: Texto Curto, Texto Longo, Data, Duração, Alternativa Binária, Seleção
Única, Seleção Múltipla, Arquivo e Imagem, Endereço, Anotações e Comentários, ID Personalizado,
Número, Valor Monetário.

**O que ele não cobre, e existe em dado gravado no develop:** Relacionamento Simples e
Múltiplo (os dois mais usados depois de texto e lista: 36 e 20 campos criados no workspace que
consultei), Editor de texto HTML, E-mail, Texto com máscara, Seleção em árvore, Intervalo de
horas, PDF, Editor de Documentos, Assinatura eletrônica e Tag.

**O que ele planeja e não existe:** Duração (par de datas) e Campo virtual de valor dinâmico.
Os dois entraram no catálogo marcados como `proposto`, para o padrão nascer definido junto com
o campo.

A comparação item por item, com o que eu propus diferente, está no `DECISOES.md`.

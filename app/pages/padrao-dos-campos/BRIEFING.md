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

#### A lista definitiva do seletor: 34 tipos, em dois grupos

Lida item por item no seletor "Tipo de Campo" em 22/09/2026, percorrendo a lista virtualizada
até o fim. **O próprio produto separa em dois grupos, e o segundo se chama "Legado".**

**Atuais (28), na ordem em que o seletor mostra:**

| # | Rótulo no seletor |
|---|---|
| 1 | Matriz de dados |
| 2 | Texto Curto |
| 3 | Texto Longo |
| 4 | Número |
| 5 | Duração |
| 6 | Data (Calendário) |
| 7 | Alternativa Binária |
| 8 | Caixas de Seleção |
| 9 | Botões de Seleção única |
| 10 | Lista de Seleção Única |
| 11 | Lista de Seleção Múltipla |
| 12 | Arquivo |
| 13 | Imagem |
| 14 | Editor de texto HTML |
| 15 | Editor de Documentos |
| 16 | Tratamento de PDF |
| 17 | Tags |
| 18 | Relacionamento Simples |
| 19 | Relacionamento Múltiplo |
| 20 | Chat |
| 21 | Anotações |
| 22 | Grupo |
| 23 | Repetidor |
| 24 | Endereço |
| 25 | Pessoa/Empresa |
| 26 | Campo virtual (de valor dinâmico) |
| 27 | Valor Monetário |
| 28 | ID Personalizado |

**Legado (6), sob o cabeçalho "Legado" do próprio seletor:**

| # | Rótulo |
|---|---|
| 29 | E-mail |
| 30 | Texto com Máscara |
| 31 | Data |
| 32 | Hora |
| 33 | Datetime |
| 34 | Editor de HTML (v1) |

**O que isso corrige no protótipo:**

1. **"Matriz de dados" existe e eu não tinha em lugar nenhum.** A descrição no i18n do produto
   é *"Permite criar uma tabela personalizada onde cada linha representa um registro e cada
   coluna representa um campo específico"*, com configurações próprias
   (`all_rows_required`, `all_columns_unique_value`, `complement_label`). É parente do
   Repetidor, não o mesmo. **Falta no catálogo.**
2. **"Duração" e "Campo virtual (de valor dinâmico)" existem.** Eu os havia marcado como
   `proposto` por não achá-los no schema nem na API. Os dois são tipos atuais.
3. **O "Legado" é vocabulário do produto, não meu.** A separação `ativo` / `legado` do catálogo
   bate com o que o seletor faz, e a lista de legados é outra do que eu tinha: `Data`, `Hora`,
   `Datetime` e `Editor de HTML (v1)` são tipos legados próprios, distintos do
   `Data (Calendário)` atual.
4. **Quatro tipos que existem em dado gravado NÃO estão no seletor**, nem como legado:
   `EnESign` (assinatura eletrônica), `EnTreeSelect` (seleção em árvore), `EnlTimeRange`
   (intervalo de horas) e `EnlCheckbox`. Ou saíram de vez, ou têm outro nome. **A confirmar.**

Ainda falta, e depende da janela do Chrome estar visível: o **valor técnico** de cada rótulo,
as **Configurações Específicas** de cada tipo e o **modo de edição real** de cada um na tabela,
no formulário e na quickview. O primeiro tipo que consegui abrir foi `Texto com Máscara`, e a
seção "Configurações Específicas" dele já mostrou um erro do próprio produto:
*"Ocorreu um erro ao carregar os campos aninhados."*

#### Por que a exploração parou

O Chrome que a extensão controla está com a janela minimizada. Nessa condição o navegador
**congela o `requestAnimationFrame`** (medido: 0 quadros em 600 ms), e isso trava as
transições do naive-ui, a lista virtualizada do seletor e, quando o tipo escolhido precisa
carregar configuração aninhada, o renderizador inteiro deixa de responder. Substituir o
`requestAnimationFrame` por `setTimeout` na aba resolve as transições, mas o `setTimeout` de
aba em segundo plano também é limitado a um disparo por segundo, então qualquer sequência de
passos estoura o tempo. **A exploração tipo a tipo precisa da janela visível.**

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

---

## 6. O que cada campo faz de verdade no develop

Criei **29 dos 34 tipos** na categoria `leve` do workspace de exploração, pela tela, em
22/09/2026, e percorri o formulário e a tela do item com todos eles dentro. O que está abaixo
foi medido, não deduzido. Faltaram cinco, e o motivo de cada um está na seção 6.4.

### 6.1 A configuração de cada tipo, do próprio produto

Todo campo, seja qual for o tipo, tem as mesmas cinco abas no painel de criação
(`Definição`, `Visual`, `Regras e Condições`, `Eventos de Campo`, `Ajuda`) e a mesma base:
**Nome do campo** (31 caracteres), **Referência técnica** (31, irreversível depois de salvar),
**Rótulo Visível** (255), **Formulário**, **Largura** (Total 1/1), **Esquema de Cores**
(Primária, Sucesso, Aviso, Erro, Info), **Nome da Seção** (agrupa campos com o mesmo nome),
**Ordenação**, **Ícone** e **Validações Básicas**.

O que muda por tipo é a seção **Configurações Específicas**, que em alguns tipos se chama
**Configuração de Opções**:

| Tipo | Configurações próprias |
|---|---|
| Texto Curto | Transformadores de Texto, Botão de Cópia, Transcrição de Voz, **Máscaras** |
| Texto Longo | Transformadores de Texto, Botão de Cópia, Transcrição de Voz |
| Número | Mostrar Botões, Valor Mínimo, Valor Máximo |
| Valor Monetário | Configurar Correção Monetária |
| Duração | nenhuma |
| Data (Calendário) | Exibir Hora, Preencher com a data atual |
| Alternativa Binária | nenhuma |
| Lista de Seleção Única | Caixa de Busca, Editável, Origem da Lista, **Lista Personalizada (obrigatória)** com Exportar e Importar |
| Lista de Seleção Múltipla | as mesmas da Única |
| Botões de Seleção única | Origem da Lista, Lista Personalizada (obrigatória). **Sem** Caixa de Busca e **sem** Editável |
| Caixas de Seleção | Origem da Lista, Lista Personalizada (obrigatória) |
| Matriz de dados | Limitar a uma resposta por coluna, Rótulo Complementar, Tornar obrigatórias todas as linhas, Tornar obrigatórias todas as colunas |
| Arquivo | Tipos Permitidos, Tamanho máximo do arquivo, quantidade máxima |
| Imagem | Tamanho máximo do arquivo |
| Editor de texto HTML | nenhuma |
| Editor de Documentos | Permitir Upload de Documento Externo, Permitir upload de PDF, Chat, Comentar, Editar, Acompanhar Mudanças, Revisão |
| Tratamento de PDF | Tamanho máximo, quantidade máxima, e o bloco da **Chancela**: Inserir, Posição (Inferior Direito), Tipo, Configurar, Subir Imagem |
| Tags | nenhuma |
| Relacionamento Simples | Relação: Categoria, Formulários, Filtros de Exibição, Formato de Visualização, Agrupar por, Formulários usados para filtrar, Desanexar Agrupamento, Desabilitar Criação, Habilitar Dependência |
| Relacionamento Múltiplo | as do Simples, mais **Habilitar Aba deste campo na tabela do item** |
| Chat | nenhuma |
| Anotações | nenhuma |
| Grupo | Configurações das Condicionais (escopo "Somente este grupo"), **Aninhados**, Formato de Visualização |
| Repetidor | Habilitar Aba deste campo na tabela do item, Quantidade predefinida de itens, Valor Mínimo, Valor Máximo, **Aninhados**, Formato de Visualização, **Modo de Visualização (Lista)** |
| Endereço | País, com a nota "se atua em mais de um país, escolha Outros", e Aninhado |
| Pessoa/Empresa | Ativar preenchimento de endereço, Aninhado, **Configurações de Pessoa** com os Campos Disponíveis: `cnpj`, `name`, `cpf`, `razao_social`, `nome_fantasia` |
| Campo virtual (de valor dinâmico) | **Editor de Expressão**, Habilitar Editor Visual, com blocos de Matemática e de Campo |
| ID Personalizado | **Componentes (obrigatório)** |
| E-mail (legado) | nenhuma |
| **Texto com Máscara (legado)** | **não carrega**: mostra "Ocorreu um erro ao carregar os campos aninhados." e o botão Recarregar não resolve |
| Data, Hora, Datetime (legado) | nenhuma |
| Editor de HTML (v1) (legado) | Botão de Cópia |

**Detalhe da opção de lista.** Cada opção de um campo de escolha é um registro próprio, criado
num modal com: **Rótulo** (obrigatório), **Valor** (obrigatório, e é um `textarea`, não um
campo de uma linha), **Color Scheme** (Primária, Sucesso, Aviso, Erro, Info), **Icon** e
**Descrição**. A cor é **por opção**, e isso não está no `Field.options[]` do schema publicado,
que só tem `label`, `value`, `icon` e `description`. Divergência para o time de back-end.

### 6.2 O formulário de criação, controle por controle

Medido com os 29 campos dentro, em uma coluna, largura cheia. A altura é a do bloco inteiro
(rótulo mais controle), em pixels:

| Campo | Controle real | Altura |
|---|---|---|
| Texto Curto | `input` de uma linha | 60 |
| **Texto Longo** | **`textarea` de UMA linha, da mesma altura do Texto Curto** | 60 |
| Número | `input` de texto, não é `input[type=number]` | 60 |
| Valor Monetário | seletor de moeda (BRL) mais campo de valor mostrando `R$ 0` | 60 |
| **Duração** | **`input` de texto**, placeholder `Ex.: "1 dia", "2 semanas", "3 meses", "1 ano", "12 horas" ou "30 min"` | 62 |
| Data (Calendário) | seletor de data | 60 |
| **Alternativa Binária** | **`input[type=checkbox]`**, não uma chave | 52 |
| Arquivo | área de soltar com "Clique ou arraste um arquivo para esta área para fazer upload" e "Suporte para upload único ou em massa" | **170** |
| Imagem | a mesma área de soltar | **170** |
| Tags | `input` de texto simples | 60 |
| Editor de texto HTML | **editor de blocos** com barra (desfazer, refazer, título, negrito, itálico, sublinhado, tachado, código, emoji, alinhamento, mais) e placeholder `Escreva ou digite "/" para acessar os comandos...` | **268** |
| **Anotações** | **painel de conversa** com área de histórico e compositor embaixo (anexar, digitar, enviar) | **759** |
| Chat | painel de conversa | 273 |
| Endereço | bloco com **CEP, País, Rua, Número, Complemento, Bairro, Cidade, Estado** | 378 |
| Pessoa/Empresa | bloco com o campo **Tipo** | 108 |
| Tratamento de PDF | `input[type=file]` | 60 |
| Editor de Documentos | bloco de escolha | 72 |
| E-mail (legado) | `input` de texto | 64 |
| Datetime (legado) | **`input[type=datetime-local]`**, controle nativo do navegador | 61 |
| Data (legado) | seletor de data | 60 |
| Hora (legado) | **`input[type=time]`**, controle nativo | 61 |
| Editor de HTML (v1) (legado) | editor | 320 |
| Lista de Seleção Única | seletor | 60 |
| Lista de Seleção Múltipla | seletor | 60 |
| Botões de Seleção única | `input[type=radio]` visíveis | 89 |
| Caixas de Seleção | caixas visíveis | 73 |
| Texto com Máscara (legado) | `input` de texto | 76 |
| Repetidor | bloco | 140 |
| Campo virtual | `input` de texto, só leitura | 60 |

### 6.3 Os quatro achados que mudam a proposta

1. **Duração NÃO é um par de datas.** É um campo de texto que aceita duração em linguagem
   natural. O documento do time de produtos descreve Duração como "duas datas para determinar
   um período", com calendário duplo, e o produto faz outra coisa. **Eu havia seguido o
   documento e estava errado junto com ele.**
2. **Alternativa Binária é caixa de seleção no formulário, não chave.** O documento recomenda
   Toggle, dizendo que ele "transmite clareza imediata de alternância de estado", e o produto
   usa checkbox. Vale decidir qual fica, mas o protótipo tem que mostrar o que existe.
3. **Anotações é conversa, não texto.** São 759 px de painel com histórico e compositor de
   mensagem. Aqui **o documento estava certo e eu estava errado**: eu havia modelado
   `EnNotes` como uma string simples.
4. **Texto Longo é uma linha só.** O `textarea` nasce com a altura do Texto Curto e não
   cresce. Para um campo pensado para descrição, é o achado mais caro da lista.

### 6.3.1 O que a tela nova faz, e o que ela não faz

- **Clicar numa célula não faz nada.** Testado em várias colunas: nenhuma seleção, nenhuma
  edição, nenhum destaque. A edição na célula é **proposta**, não ajuste;
- **célula vazia mostra um hífen** (`-`), e é isso que o protótipo usa;
- **a coluna `Ações` é a segunda**, logo depois da seleção, e tem ícone de fixar. No protótipo
  ela sai no fim, porque o slot `#actions` do `EnTable` renderiza a última coluna. É limitação
  do `EnTable`, não escolha;
- **selecionar linha abre uma barra de ação em massa** com `1 Selecionado`, **Comparar** e
  **Excluir**. O protótipo ainda não tem essa barra;
- **a tela do item avisa quando está suja**: o rodapé mostra `Alterações não salvas`, com
  **Sair sem salvar** ao lado do **Salvar**. O protótipo só tem o Salvar;
- **a coluna da esquerda, hoje, só tem metadado de sistema**, nos dois lugares (quickview e
  tela dedicada): IDENTIFICAÇÃO (ID), ORIGEM (STATUS, E-MAIL DA SOLICITAÇÃO) e HISTÓRICO
  (CRIADO EM, ATUALIZADO EM). Pôr os campos da categoria ali, em formato cru, continua sendo
  **proposta**, e é o que a demanda pediu.

### 6.4 Os cinco tipos que não consegui criar, e por quê

| Tipo | O que trava |
|---|---|
| Matriz de dados | exige três configurações obrigatórias (linhas, colunas e rótulo) antes de salvar |
| ID Personalizado | exige **Componentes**, uma lista de partes do código (prefixo, número, sufixo) montada num sub-modal |
| Relacionamento Simples | exige **Categoria** de destino, e o seletor dela fica dentro do bloco Relação |
| Relacionamento Múltiplo | o mesmo do Simples |
| Grupo e Repetidor | foram criados, mas **sem campos aninhados**, então ainda não dá para ver o desenho deles com conteúdo |

### 6.5 Uma armadilha de investigação que custou caro

Com a **janela do Chrome minimizada**, o navegador congela o `requestAnimationFrame` (medido:
0 quadros em 600 ms). Isso trava as transições do naive-ui, a lista virtualizada do seletor de
tipo e, quando o tipo escolhido carrega configuração aninhada, o renderizador inteiro para de
responder. Trocar o `requestAnimationFrame` por `setTimeout` na aba resolve as transições, mas
o `setTimeout` de aba em segundo plano também é limitado a um disparo por segundo. **Não há
atalho: a janela tem que estar visível.** Entra na lista de armadilhas do develop.

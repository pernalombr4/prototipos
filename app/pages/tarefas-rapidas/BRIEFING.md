# Briefing — Tarefas rápidas

## A demanda, como ela veio

> va ate a tela de tarefas rapidas. veja como ela é hoje.
>
> tambem te mando um print de uma ja utilizada em produçao pra facilitar, mas explore.
>
> a do print mostra um board de tarefas rapidas que foi alimentado 100% por spaceflow. nenuma
> tarefa rapida aí foi criada à mão.
>
> percebemos que esse board tem problemas de design. a interface nao é tao padrao de mercado
> esteticamente e a usabilidade é atrapalhada pela falta de alguns campos na interface e de
> algumas funcionalidades de agrupar, ordenar as raias etc, assim como tem no clickup, por
> exemplo.
>
> voce deve trabalhar no front considerando melhorar a usabilidade:
>
> 1. no header
> 2. nos cards (abertos e fechados)
> 3. nas raias
> 4. ter um totalizador (calculadora) no fim de cada raia, como tem no clickup também.
>
> ---
>
> para te dar base do que precisa estar refletido na interface, e voce deve no seu prototipo
> fazer pelo menos 1 card com todos os campos possíveis aparecendo, pra entender como faríamos
> pra caber tudo no front, eu pesquisei a estrutura das tarefas e te envio abaixo.
>
> (segue o levantamento das 128 tarefas do workspace, com o payload completo de `GET /tasks`,
> os 24 campos nativos, os três formatos de `meta`, o `form_result` e os parâmetros de consulta.
> Está reproduzido na seção "O payload da tarefa" deste briefing.)

## A tela em jogo

**Tarefas › Rápidas**, o quadro de tarefas do workspace.

- develop: `https://develop.enspace.io/workspaces/<workspace>/tasks/quick`
- o print que ela mandou é do mesmo quadro em produção, no workspace de produto, com 128
  tarefas, todas criadas por spaceflow.

## O que seria sucesso

Quem abre o quadro entende, sem abrir cartão nenhum, o que está atrasado, o que é dela e
quanto trabalho tem em cada raia. E consegue reorganizar o quadro (agrupar, ordenar, escolher
o que o cartão mostra) sem criar outra visualização.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` antes de desenhar:

- `temas/README.md`: não existe tema sobre tarefas. Os seis temas são configurações do
  sistema, construtor de telas, base de conhecimento, categorias, agenda e plataforma.
- `UX_REPORT.md`, buscando por `tarefa`, `task`, `kanban` e `board`: as ocorrências são de
  **outro assunto**. Falam das *tasks dentro do fluxo* (`Types › Workflows › Stages › Tasks`),
  que é onde se configura a ação, e da Agenda que consome tarefas com data.
  - `S2-F4` (P1): o único caminho de publicação na Base de Conhecimento está a seis níveis
    dentro de `Types › Workflows › Stages › Tasks`, sem ligação com a tela que consome.
  - `S1-F2` (P2): a tela inicial da Agenda dá todo o destaque ao Outlook, e o caminho nativo,
    alimentado por tarefas e itens do workspace, parece secundário.
  - `S3-F4` (P2): notificação de tarefa exige "Modelo de e-mail" com zero opções.

**Sobre o quadro de tarefas rápidas em si, não havia nada.** Procurei e não tinha. O que as
três fricções acima têm em comum com esta demanda é o padrão: **a configuração existe, mas
mora longe da tela que ela governa.** É exatamente o que encontrei aqui na Fase 2.

## O que o develop faz hoje

Investigado em 21/09/2026, no workspace de exploração, pelo Chrome da usuária.
URL: `https://develop.enspace.io/workspaces/teste-ux/tasks/quick`.

### O fluxo real, em passos

1. Menu lateral › **Tarefas** › **Rápidas**.
2. O quadro abre com quatro raias fixas: **Pendente, Em andamento, Bloqueada, Concluída**.
   Cada uma com fundo em gradiente da cor da situação, a contagem à esquerda do nome e uma
   bolinha colorida no canto direito.
3. A barra de cima tem, nesta ordem: `Pesquisar tarefas...`, `Criado em`, `Todo o período`,
   e na direita quatro ícones sem rótulo, o botão **Nova tarefa** e uma seta.
4. O rodapé da página traz `Mostrando 1 a 1 de 1 resultados`, `500 por página` e a paginação.

### O que já existe e funciona

Isto é o achado que muda a proposta. **Agrupar, ordenar e configurar o cartão já existem no
produto.** Eles moram dentro de `+ Visualizar` › **Nova Visualização** › tipo **Kanban**:

| Controle | Onde está | O que oferece |
|---|---|---|
| **Agrupar por** | modal de nova visualização | Status, Responsável, Prioridade |
| **Ordenar cartões em cada coluna por** | modal de nova visualização | campo de data de atualização e outros |
| **Construtor visual de cartão** | modal de nova visualização | campo do cabeçalho, campo do conteúdo, tags, campo de utilizador, campos de data |
| **Filtros** | modal de nova visualização | filtros automáticos e filtros por campos personalizados |
| **Visibilidade** | modal de nova visualização | quem na empresa vê a tela |
| **Raias visíveis** | ícone sem rótulo na barra | marcar, desmarcar, reordenar por arraste, fixar, `Mostrar Todas`, `Resetar Ordem`, `Resetar Larguras`, `Ocultar Todas` |
| **Filtros rápidos** | seta no canto direito da barra | abre uma faixa **vazia** |

Os quatro ícones sem rótulo da direita são, pela árvore de acessibilidade: **Reports**,
**Colunas**, **Arquivadas** e **Lixeira**.

O menu do cartão (⋮) tem: Editar, Duplicar, Mover para ›, Arquivar, Enviar para Lixeira,
Copiar Link Externo.

O cartão aberto é um painel à direita com abas **Tarefa · Comentários · Logs de Auditoria**,
e um trilho de ícones que expande para **DETALHES**.

### A casca da tela, item por item

Copiada para o protótipo como está, porque a proposta mexe só no conteúdo (regra 37). Se algo
aqui estiver diferente do develop, é defeito de cópia, não sugestão.

**Menu lateral** (cerca de 200 px, borda à direita, botão redondo de recolher na borda):

1. topo: avatar circular do workspace, nome em negrito, slug abaixo em cinza, chevron à direita;
2. `Buscar` com lupa e as teclas `CTRL` `K`;
3. seção **Membro**: Início, Spaceflows, Categorias (com chevron), Tarefas (com chevron,
   **aberta**, mostrando `Agendadas` e `Rápidas`, com `Rápidas` marcada como ativa), Agenda,
   Knowledge (com chevron);
4. seção **Configurações**: Visão Geral, Sistema, Estrutura (chevron), Gestão de Membros,
   Interface (chevron), E-mails (chevron), Integrações, Agentes de IA, Logs, Credenciais;
5. seção **Ajuda**: Releases, Documentação (com seta de link externo).

**Barra do topo** (cerca de 44 px), da esquerda para a direita:

1. botão de recolher o menu, voltar, avançar, recarregar, início;
2. uma faixa arredondada que ocupa o meio e carrega a **trilha**: ícone, `teste ux 2` ›
   `Tarefas` › `Rápidas`, e na ponta direita as teclas `CTRL` `B` e a estrela de favoritar;
3. à direita: bandeira do idioma, sol do tema, `Suporte`, sino de notificações e o avatar da
   conta com bolinha verde.

**Conteúdo**, que é onde a proposta age:

1. linha das visualizações salvas, com `+ Visualizar` no fim;
2. barra de comandos;
3. faixa `Filtros Rápidos` (vazia hoje, recolhida atrás da seta da direita);
4. o quadro;
5. rodapé de paginação da página inteira: `Mostrando 1 a N de N resultados`, `500 por página`
   e as setas.

O item 5 é o único da casca que a proposta substitui, e está declarado no `DECISOES.md`: a
paginação da página vira `Ver mais` por raia.

### A quickview, item por item

O painel que abre ao clicar no cartão. É o componente padrão de painel lateral do produto,
então aqui ele foi medido antes de qualquer proposta. Visitado em 21/09/2026.

**A caixa.** `USlideover` à direita, altura inteira, canto esquerdo arredondado, anel em volta.
Largura **700 px fixos** (`max-w-[calc(100%-2rem)]`), sem alça de redimensionar. O fundo da
página fica visível e apagado; **não existe botão de fechar**: sai no Esc ou clicando fora.

**Trilho de campos**, colado na borda esquerda do painel, com **sete ícones sem rótulo**, um
a cada 60 px. Passando o mouse, cada um abre um cartãozinho com o nome do campo e o valor:

1. `#` Identificador (`#13186`)
2. 🏷 Ticket (`-`, com botão de copiar)
3. 👤 Responsável (`Mikaela Jardim`)
4. 📅 Data Limite (`23/09/2026, 12:25:06`)
5. 📅 Concluída em (`—`)
6. 📅 Criado em
7. 📅 Atualizado em

No pé do trilho, um `»` que **expande**. Expandir **não aumenta o painel**: os 700 px ficam,
o trilho vira uma coluna de 275 px com os rótulos, e o conteúdo cai para cerca de 330 px. O
editor da descrição ganha barra de rolagem horizontal, e o título é repetido, centralizado, no
topo da coluna nova.

**Abas**, no topo do conteúdo: `Tarefa`, `Comentários`, `Logs de Auditoria`.

- **Tarefa**: título grande, selo da situação com o valor cru (`pending`), duas linhas de meta
  (`Prazo` e `Reference`, esta com os 32 caracteres inteiros) e a seção **Descrição**, que é um
  editor de texto rico sempre aberto, com a barra de formatação sempre visível.
- **Comentários**: estado vazio com "Nenhum comentário ainda. Seja o primeiro!" e, no rodapé,
  o campo "Escreva um comentário... (@ para mencionar, Ctrl+Enter para enviar)" com o botão de
  enviar. Nesta aba o rodapé de ações some e dá lugar ao campo.
- **Logs de Auditoria**: linha do tempo com bolinha verde, avatar, selo da ação (`Criou`), a
  frase "Mikaela Jardim criou uma Tarefa" e, à direita, a data e o tempo relativo ("há 4
  horas").

**Rodapé** (nas abas Tarefa e Logs): `Guardar progresso` e `Concluir tarefa`.

**O que o painel não mostra, tendo no payload:** prioridade, pontos, tipo, etiquetas e
colaboradores. Nenhum deles aparece, nem no trilho, nem na coluna expandida, nem no cabeçalho.

**Não consegui ver** a quickview de uma tarefa de formulário: o workspace de exploração não
tem tarefa vinda de spaceflow, e criar uma pela tela exigiria montar um fluxo inteiro. O que o
painel faz com `meta.form` fica como pergunta aberta, e a seção de formulário do protótipo é
proposta, não cópia.

**Duas travadas.** Ao clicar na aba `Comentários` com o painel aberto, a página parou de
responder e só voltou com recarregamento. Aconteceu duas vezes seguidas, no mesmo ponto. Na
terceira vez, depois de ela destravar o ambiente, funcionou.

### Onde trava

1. **A configuração é de nascimento, não de uso.** Agrupar, ordenar e montar o cartão só
   acontecem quando se **cria** uma visualização. Para ver o mesmo quadro agrupado por
   prioridade, a pessoa precisa criar outra tela.
2. **O cartão mostra a data errada.** Criei uma tarefa com prazo em 23/09 e o cartão exibiu
   `21/09/2026, 12:25`, que é a data de criação. A tarefa vencida parece recém-chegada.
3. **O cartão fechado esconde o que decide.** Não mostra prazo, pontos, tipo, referência,
   etiquetas nem o chamado de origem. Mostra título, descrição, avatar, prioridade e a data
   de criação.
4. **O título é capitalizado por CSS e truncado em uma linha.** "Revisar resposta ao cliente
   sobre o chamado de acesso" vira `Revisar Resposta Ao Cliente So...`.
5. **A descrição ocupa o cartão.** Ela chega em HTML do spaceflow, costuma ter duas ou três
   frases, e é renderizada em duas linhas cortadas no meio da frase.
6. **O painel aberto esconde prioridade, pontos e tipo.** Os DETALHES trazem ID, Ticket,
   Responsável, Data Limite, Concluída em, Criado em, Atualizado em. A prioridade que acabei
   de definir na criação não aparece em lugar nenhum do painel.
7. **O selo de situação vem cru, em inglês**: `pending`.
8. **"Guardar progresso"** é português de Portugal no meio de uma interface em pt-BR.
9. **A referência aparece inteira**, 32 caracteres, como `5aSLp2ESU85cMMGqK0HJhaw2R2cHahTL`.
10. **Nenhum número além da contagem.** Não há soma de pontos, atrasadas, média, nada.
11. **A paginação é da página inteira, não da raia.** `500 por página` com 128 tarefas
    significa rolar o quadro todo. Não existe "ver mais" por raia.
12. **A faixa de Filtros Rápidos abre vazia** e come altura.
13. **O período só aceita dia único ou intervalo no calendário.** Sem atalho de hoje, 7 dias
    ou este mês.
14. **Raia vazia ocupa a mesma largura** e diz `Nenhum Resultado` no meio de um retângulo
    alto.

### Preparo do cenário

Uma tarefa criada à mão, pela própria tela, no workspace de exploração, para ver o cartão com
conteúdo. Nada foi criado por API. A tarefa continua lá.

## O payload da tarefa

Levantamento que ela mandou, sobre as 128 tarefas do workspace de produto. `GET /tasks` e
`GET /tasks/{id}` devolvem a mesma estrutura.

### Os 24 campos nativos

| Campo | Tipo | O que é |
|---|---|---|
| `id` | número | id interno |
| `created_at` / `updated_at` | ISO 8601 | criação e última alteração |
| `deleted_at` | ISO ou null | soft delete |
| `reference` | texto 32 | identificador público |
| `name` | texto | título do cartão |
| `description` | HTML | corpo, já renderizado |
| `type` | enum | `crud`, `form`, `generic` (o schema também declara `start` e `approval`) |
| `status` | enum | `pending`, `working`, `blocked`, `completed` |
| `priority` | enum | `low`, `normal`, `high`, `urgent` |
| `due_date` | ISO ou null | prazo |
| `points` | número | pontuação |
| `meta` | objeto | a parte variável |
| `creator` / `assigned_to` / `completed_by` | número ou null | pessoas |
| `completed_at` | ISO ou null | quando concluiu |
| `node_execution` | número ou null | nó do fluxo que gerou |
| `item` | número ou null | id do item a que está pendurada |
| `notification_task` | booleano | tarefa de notificação |
| `archived` | booleano | arquivada |
| `external_task` | objeto ou null | tarefa externa com link público |
| `tag_ids` | lista de números | etiquetas |
| `workspace` | texto | slug |
| `collaborators`, `permissions` | listas | declaradas no schema |

Distribuição: `crud` 60, `generic` 37, `form` 31; `pending` 74, `completed` 54; `normal` 107,
`high` 20, `urgent` 1; pontos de 0 a 13, com 16 tarefas pontuadas.

### O `meta`

- **`generic`**: `{}`.
- **`crud`**: `form` é a referência de um formulário de ação já cadastrado, `itemReference` é
  o item que a tarefa edita.
- **`form`**: `meta.form` é um **array com a definição dos campos**, com `label`, `type`
  (`EnlDropdown`, `EnTextArea`), `validation`, `options` e `conditionals`. A condicional
  aponta para outro campo do mesmo formulário com `%nome_do_campo%`.
- **Depois de concluída**: ganha `meta.form_result` com as respostas. Campo simples vem como
  texto, campo de relacionamento vem como objeto com `id`, `display` e `reference`.

### O que dá para somar: os campos numéricos do payload

Levantado no schema (`Field` do `@be-enlighten/enspace-sdk-schemas`) e no payload das tarefas.

**No ENSPACE, dinheiro não é um tipo de campo.** O tipo numérico é um só, **`EnlNumber`**, e o
que faz um número virar moeda é o formatador do campo, `cFormat`:

```json
"cFormat": { "type": "currency", "locale": "pt-BR", "n_style": "currency",
             "n_currencyDisplay": "symbol", "n_minimumFractionDigits": 2 }
```

`n_style` aceita `currency`, `decimal` e `percent`. Então quem soma precisa olhar o `cFormat`
do campo, não o `type`, para decidir se o total sai como `R$ 11.800,00` ou como `18,5`.

**Onde estão os números, na tarefa:**

| Origem | Campo | Serve para |
|---|---|---|
| **Da tarefa** | `points` | É o único número de negócio que a tarefa carrega. Soma, média, mínimo, máximo |
| **Do formulário** | cada resposta em `meta.form_result` cujo campo em `meta.form` seja `EnlNumber` | Soma, média, mínimo, máximo, e formatação por `cFormat` (inclusive moeda) |
| **Identificadores** | `id`, `creator`, `assigned_to`, `completed_by`, `node_execution`, `item`, `external_task` | São números, mas somá-los não quer dizer nada. Contar distintos, sim |
| **Listas** | `tag_ids` | Contagem |
| **Datas** | `created_at`, `updated_at`, `due_date`, `completed_at` | Mais antiga, mais recente, intervalo |
| **Booleanos** | `archived`, `notification_task` | Contagem e porcentagem |

**O ponto que muda o desenho:** a definição do formulário vem **junto com a tarefa**, em
`meta.form`, com `type` e `cFormat` de cada campo. Então o quadro sabe quais respostas são
numéricas e como formatá-las **sem nenhuma chamada a mais**. É isso que permite o totalizador
oferecer "Custo estimado do retrabalho" na lista de campos.

**E o limite honesto:** `meta.form_result` só existe **depois que a tarefa é concluída**. Numa
raia de pendentes, somar um campo de formulário dá vazio. Por isso o totalizador mostra quantas
tarefas da raia têm aquele campo preenchido.

**O que não dá, só com o payload da tarefa:** somar campo numérico do **item** (o chamado ou a
demanda), que é onde moram valores como "valor do contrato". A tarefa carrega só `item` e
`meta.itemReference`; o valor exige `GET /ws/types/{slug}/items/{reference}`, uma chamada por
item. Fica registrado como decisão de back-end, não de tela.

### O que não vem no payload

A tarefa **não tem campos personalizados próprios**. O que varia por workspace está em
`meta.form_result` e **no item relacionado, que não vem**. A tarefa carrega só `item` (id) e
`meta.itemReference`; os dados do chamado custam `GET /ws/types/{slug}/items/{reference}`.

Para o protótipo: o cartão se monta inteiro com o payload da tarefa. Qualquer coisa vinda do
item custa uma segunda chamada. Por isso o campo "Registro de origem" do cartão é ligável e
desligável, e vem desligado no modo compacto.

### Consulta

`_limit`, `_start`, `_sort`, `_q`, igualdade por `status`/`type`/`priority`/`points`, faixa
com `_gte`/`_lte`, `name_contains`, `completed_at_null`, `item`, `assigned_to`. Não existe
`populate`, nem sub-recurso de permissões ou comentários.

## Observações de método

- O arquivo `DOC-payload-da-tarefa-rapida.md` citado na demanda não está neste repositório.
  Usei o levantamento colado na conversa, reproduzido acima.
- O develop caiu no meio da investigação e voltou. A Fase 2 foi feita depois que voltou.
- As capturas de tela desta rodada não puderam ser gravadas em disco: a ferramenta de
  navegação desta sessão não devolveu caminho de arquivo. O que cada tela mostra está descrito
  acima, tela por tela, e a pasta `evidencias/` está esperando o print da próxima rodada.

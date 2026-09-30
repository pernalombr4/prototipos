# Briefing: painel de tarefas

## A demanda, como ela veio

> voce precisa construir um prototipo de uma tela nativa de dashboard de TAREFAS para o enspace. hoje nossa tela de dashboards (construçao de graficos) só leva em consideraçao dados de ITENS.
>
> precisamos de um dash nativo e nao editavel, só um painel fixo e padronizado com dados de tarefas, como fazem os sistemas de gestao de tarefas. pode pesquisar clickup, monday, jira, trello e outros que podem possuir dash de TAREFAS.
>
> saiba que a intençao é que gestores possam fazer a gestão de tarefas gerais no enspace (sejam tarefas rápidas ou agendadas), trazendo por exemplo:
>
> * SLA (atrasadas, no prazo, vencidas).
> * Tempo que a tarefa levou para ser cumprida (da criação à conclusão da tarefa).
> * Tempo que falta para vencer (com base em prazo definido).
> * Tarefas x Responsável (pessoas individuais, grupos ou "todos").
> * Status e Substatus (virtuais) de tarefas.
> * Contagem de tarefas por período (ex.: por semana, mês, ano).
>
> * Tempo médio de duração:
>    * de tarefa
>    * de etapa
>    * de fluxo (usar `flow item` como base de cálculo).
>
> nesse processo, alem de pesquisar, voce deve acessar develop e mapear o funcionamento da api de tarefas agendadas e tarefas rapidas. a pasta local en-api-docs pode te ajudar nisso. mas sua exploraçao é fundamental. de modo algum voce pode propor dashboards que NAO TENHAM COMO TER SEUS DADOS EXTRAIDOS DO QUE JA É NATIVO NO ENSPACE. tem que fazer sentido absoluto.
>
> use /nuxt-ui pra prototipar. /prototipo e /data:explore-data e /data:validate-data se cabiveis.

## A tela em jogo

- **Tarefas** no menu lateral, que hoje abre 2 listas: **Agendadas** (título da tela: "Tarefas Programadas") e **Rápidas**.
- O painel entra como 3º filho de Tarefas, **Painel**, antes das 2 listas.
- O painel de hoje, **Interface › Telas › tipo Dashboard**, fica como está: ele monta gráficos de itens de uma categoria.

## O que seria sucesso

O gestor abre uma tela e responde, sem montar nada: o que está vencido e com quem, se a equipe entrega no prazo, quanto tempo leva cada tarefa, etapa e fluxo, e se a fila cresce ou encolhe.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (repositório de auditoria de UX por persona) antes de desenhar.

- `temas/README.md`: não há tema de tarefas, dashboard, relatório ou SLA. Os 6 temas são configurações do sistema, construtor de telas, base de conhecimento, categorias, agenda e plataforma.
- `UX_REPORT.md`: "dashboard", "gráfico", "SLA" e "atraso" não aparecem.
- O que toca o assunto está no tema **construtor de telas** (`temas/construtor-de-telas/auditoria.md`):
  - **U9 (P2):** a tela do tipo Dashboard põe "Novo Painel", "Editar Dashboard", "Organizar painéis automaticamente" e "Forçar carregamento" na mesma linha, com o mesmo peso.
  - **Painéis, parte 4:** montar um painel exige 4 níveis de aninhamento, e os campos obrigatórios ficam escondidos em outra aba (C9).
  - **U6 (P1):** a tela "Tarefas Geral" abre em "Últimos 30 dias", com teto de 30 dias: o que é mais antigo fica inalcançável. A tela "Tarefas" abre com 3 filtros ligados.
  - **U1 (P1):** "AUD Tarefas Geral" aparece como "Tarefas Programadas"; o mesmo assunto tem 4 nomes.
- No `UX_REPORT.md`, 2 fricções tocam o prazo das tarefas:
  - **S3-F2 (P2):** o Calendário nasce com "Dias Úteis na Semana" vazio. É dele que depende o SLA em dias úteis.
  - **S3-F3 (P1):** "Sincronizar Feriados" grava feriados do Brasil e dos EUA misturados.

**O que isso muda na proposta:** o painel não pode ser mais um construtor. A pesquisa de UX já mostrou que montar um painel de itens custa 4 níveis e esconde o obrigatório. O painel de tarefas nasce pronto, sem configuração.

## O que o develop faz hoje

Investigado em 30/09/2026, no workspace de exploração, pelo Chrome da usuária.

### O painel de hoje só lê itens

- URL: `https://develop.enspace.io/workspaces/<ws>/pages/aud_paineis` (tela do tipo Dashboard, criada em Interface › Telas).
- A tela mostra os painéis salvos (ex.: "Itens por status", em barras) e 4 botões: Novo Painel, Editar Dashboard, Organizar painéis automaticamente, Forçar carregamento.
- **Novo Painel › Agrupamento de Dados** exige **Categoria**. Sem categoria, não salva. Tarefa não é categoria: não há como apontar o painel para tarefas.
- Prints: `evidencias/dev-01-painel-de-itens.jpg`, `evidencias/dev-02-novo-painel-exige-categoria.jpg`.

### As telas de tarefa não têm número nenhum

| Tela | URL | O que mostra de número |
|---|---|---|
| Tarefas › Rápidas | `/workspaces/<ws>/tasks/quick` | a contagem de cada raia do quadro |
| Tarefas › Agendadas | `/workspaces/<ws>/tasks/scheduled?view=default` | "Mostrando 1 a 4 de 4 resultados" |
| Início | `/workspaces/<ws>` | cartões "Tarefas em atraso", "Tarefas próximas" e "Tarefas rápidas" da própria pessoa |

- O ícone **Reports** do quadro de Rápidas abre "Relatório Padrão", que é **exportação** (Excel, CSV, DBF), não painel. Print: `evidencias/dev-03-rapidas-reports-e-exportacao.jpg`.
- Os cartões da Início mostram só as tarefas de quem está logado. O gestor não vê a equipe. Print: `evidencias/dev-08-home-cartoes-de-tarefa.jpg`.
- A lista de Agendadas tem a coluna **Status de SLA**, com os valores "Em Dia" e "Atrasado", e as colunas Criado em, Data Limite, Concluído em, Concluido por, Nome do Fluxo, Etapa do Fluxo e Status do Item. Print: `evidencias/dev-07-programadas-status-de-sla.jpg`.

### O fluxo real, em passos (montado pela tela nesta rodada)

O workspace de exploração não tinha fluxo nem tarefa programada. Montei um pela tela, para ver de onde saem SLA, responsável e tempo de etapa.

1. Configurações › Estrutura › Categorias › categoria de teste › **Fluxos** › Criar: "Fluxo dash tarefas", condicional "Sempre".
2. **Etapas**: "Triagem" (etapa inicial) e "Execução".
3. **Tarefas** da Triagem. O formulário tem 6 abas: Definição, Resultados, Visualização de Dados, Ação, Tempo de Resposta e Responsabilidade.
   - "Classificar pedido": ação Confirmação, SLA de 1 hora a partir da criação da tarefa, responsável "Todo Mundo".
   - "Encerrar triagem": ação Concluir Etapa, SLA de 2 dias corridos, responsável "Usuário Solicitante".
4. **Transição** da Triagem para a Execução.
5. Tarefa da Execução, "Executar pedido": ação Concluir Fluxo, SLA de 3 dias corridos, responsável "Usuários", com **Habilitar Atribuição** ligado.
6. Criei 2 itens na categoria. Cada um gerou as 2 tarefas da Triagem em Tarefas › Agendadas, com "Aguardando" e "Em Dia".
7. No 1º item: confirmei "Classificar pedido", concluí "Encerrar triagem" (o item passou para a Execução e a tarefa "Executar pedido" nasceu no mesmo minuto), assumi "Executar pedido" (virou "Trabalhando") e concluí (o fluxo terminou).
8. O 2º item ficou parado, para o SLA de 1 hora vencer.

**A aba Tempo de Resposta** tem Origem SLA (Baseado em Campo, Criação da Tarefa, Na Criação do Item), Cálculo do SLA (Dias Corridos, Dias Úteis, Horas), Valor SLA e "Habilitar notificação na tarefa". Prints: `evidencias/dev-04-...` e `evidencias/dev-05-...`.

**A aba Responsabilidade** tem "Habilitar Atribuição" e 7 tipos de responsável: Baseado em Campo, Email Externo, Grupo, Regras de Responsável, Usuários, Usuário Solicitante e Todo Mundo. Print: `evidencias/dev-06-tarefa-de-etapa-tipos-de-responsavel.jpg`.

**O painel da tarefa programada** tem as abas Tarefa, Item, Histórico e Comentários. O **Histórico** lista cada troca de status com data: Aguardando (18:04) e Trabalhando (18:04). É o `task_log` da API, e é dele que sai o tempo de espera e o de execução.

**O Log de Auditoria** (Configurações › Logs) registra o flow item. Ao concluir o fluxo, o item 42275 mudou `run_status` de `running` para `complete`, e o `stages_log` ficou com 4 linhas: `start` e `complete` da Triagem (21:02:29 e 21:04:03, em UTC) e `start` e `complete` da Execução (21:04:03 e 21:05:33). Prints: `evidencias/dev-09-log-flow-item-run-status.jpg` e `evidencias/dev-10-stages-log-do-flow-item.jpg` (e-mail tarjado).

### O que já existe e funciona

Tudo o que o painel precisa, o produto já grava. Nenhum campo novo.

| O que a demanda pede | De onde sai | Rota |
|---|---|---|
| Prazo | `due_date` (rápidas e programadas) | `/ws/tasks`, `/c-flow-item-tasks` |
| Vencida e no prazo | `due_date` comparado a agora; nas programadas o produto já calcula `is_overdue` ("Atrasado", "Em Dia") | as 2 |
| Concluída com atraso | `completed_at` depois de `due_date` | as 2 |
| Tempo da criação à conclusão | `created_at` e `completed_at` | as 2 |
| Tempo que falta para vencer | `due_date` menos agora | as 2 |
| Espera e execução | `task_log` (Aguardando, Trabalhando, Completa, com data) | `/c-flow-item-tasks` |
| Responsável pessoa | `assigned_to` (rápida), `assigned_users` e `assigned` (programada) | as 2 |
| Responsável grupo | `module_groups` com `responsibility_type: module_groups` | `/c-flow-item-tasks` |
| "Todos" | `responsibility_type: everybody` ("Todo Mundo" na tela) | `/c-flow-item-tasks` |
| Status | `status` (rápida), `work_status` e `status` (programada) | as 2 |
| Contagem por período | `created_at` e `completed_at` | as 2 |
| Tempo de etapa | `stages_log`: `start` e `complete` por `stage_id` | `/c-flow-items` |
| Tempo de fluxo | `stages_log` do 1º `start` ao último `complete`, com `run_status: complete` | `/c-flow-items` |
| Categoria, fluxo e etapa | `item_type_name`, `flow_name`, `stage_name` já vêm na programada | `/c-flow-item-tasks` |

### Onde trava

1. **O painel de hoje não aceita tarefa.** "Categoria" é obrigatória no Agrupamento de Dados.
2. **Não há visão de equipe.** Os cartões da Início mostram só as tarefas de quem está logado; as listas não somam nada.
3. **O "Reports" do quadro é exportação.** O nome promete relatório e entrega planilha.
4. **2 motores, 2 vocabulários.** Rápida: Pendente, Em andamento, Bloqueada, Concluída. Programada: Aguardando, Trabalhando, Completa, Removido. Juntar as 2 exige traduzir. A tarefa que o Spaceflow cria é tarefa rápida: mora em `/ws/tasks` e aparece em Rápidas.
5. **Prazo igual à criação.** O nó do Spaceflow sem prazo configurado grava `due_date` igual à hora de criação (medido pela rotina de QA de tarefas: 98 de 161 tarefas em develop). Essas tarefas nascem vencidas. Contá-las no SLA seria mentir.
6. **"Atrasado" no produto junta 2 situações.** A coluna Status de SLA das agendadas diz "Atrasado" para a tarefa aberta com prazo passado e para a concluída depois do prazo. A concluída até o prazo continua "Em Dia" depois que o prazo passa. Medido na rodada 2 numa tarefa de etapa com prazo às 19:02: `evidencias/dev-11-status-de-sla-apos-o-prazo.jpg`.
7. **A notificação de atribuição sai crua.** Ao assumir a tarefa, o toast mostrou `en-communications.notifications.task.assignmentWithout...`, a chave de tradução em vez do texto. Achado lateral: não é do painel.
8. **A API não agrega.** As rotas só listam e contam (`/count`). Média, mediana e soma por período exigem baixar tudo ou uma rota nova no back.

### Preparo do cenário

Tudo foi criado **pela tela**, no workspace de exploração: 1 fluxo, 2 etapas, 3 tarefas de etapa, 1 transição e 2 itens. Nada por API. O cenário continua lá.

## A API dos 2 motores

Fontes: a investigação de API da rotina de QA de kanban e tarefas (`inv-B-api.md`, 120 chamadas `GET` em develop em 25/09), o `en-api-docs` e o que medi nesta rodada.

### Tarefas rápidas e do Spaceflow: `GET /ws/tasks` (e `/tasks`)

- 24 chaves, tipadas pelo `Task` do `@be-enlighten/enspace-sdk-schemas`.
- Datas: `created_at`, `updated_at`, `due_date`, `completed_at`, `deleted_at`.
- Status: `pending`, `working`, `blocked`, `completed`. Mais `archived` e `deleted_at` (a lista esconde os 2).
- Pessoas: `assigned_to` (1 id ou `null`), `creator`, `completed_by`, `collaborators`.
- Origem: `node_execution` preenchido é tarefa do Spaceflow; `null` é rápida criada à mão. Desde a rodada 2, o painel chama a 1ª de "criada por fluxo" (junto com a tarefa de etapa) e a 2ª de "criada manualmente".
- Filtros que funcionam: `status`, `status_in`, `assigned_to`, `assigned_to_null`, `due_date_lt`, `due_date_gte`, `due_date_null`, `created_at_gte`, `completed_at_gte`, `item`, `type`, `priority`, `external_task_null`, `_q`.
- Armadilhas: sem `_limit`, devolve as 100 mais antigas; `_start` é deslocamento, não página; a tarefa criada já concluída pelo `POST` fica sem `completed_at`.
- Não há campo de atraso: a tela calcula pelo `due_date`.

### Tarefas programadas: `GET /c-flow-item-tasks`

- Sem schema no SDK. 20 a 23 chaves.
- Desnormalizadas para a lista: `item_reference`, `item_type_name`, `flow_name`, `stage_name`, `task_name`, `task_action_slug`.
- `work_status`: `waiting`, `working`, `complete`, `removed`. `status`: `active`, `inactive` (item excluído).
- `due_date` calculado pelo SLA da tarefa de etapa. `is_overdue` é **texto** ("Em Dia", "Atrasado"), vem só na lista e não filtra (400).
- Responsável: `responsibility_type` (7 valores), `unified_responsible` (texto com e-mails e grupos), `assigned` (quem assumiu), `assigned_users` e `module_groups` (com `__relations`).
- `task_log`: `[{email, created_at, work_status}]`, o histórico.
- `completed_at` e `updated_by_email` só nas concluídas.

### Itens no fluxo: `/c-flow-items`

- `{ id, item, flow, stage, status, run_status, stages_log, created_at, updated_at }`.
- `run_status`: `running`, `complete` (medido nesta rodada, ao concluir o fluxo) e `removed`.
- `stages_log`: `[{ status: "start" | "complete", stage_id, created_at, user? }]`.

### Configuração: `/c-stage-tasks`

- `sla`, `sla_type` (`hours`, `days`, `workDays`), `sla_origin` (`task_created`, `item_created`, `field`), `responsibility_type`, `start_type`, `action`.

### Execuções do Spaceflow: `GET /workflows/executions?workflow={id}`

Entrou na rodada 2, para o tempo de fluxo do Spaceflow. Formato do `WorkflowExecution` do `@be-enlighten/enspace-sdk-schemas`; a rota que responde em develop está no `en-api-docs` (`enspace-spaceflow-api.md`, medido pela rotina de QA do Spaceflow em 23 e 24/09). Não medi nesta rodada.

- `status`: `working`, `completed`, `error`, `deleted`. `created_at` é o início; `stopped_at`, o fim.
- `workflow` liga ao fluxo; `item`, ao item da categoria, quando o fluxo tem um.
- A tarefa rápida guarda `node_execution`: é por ele que a tarefa chega à execução e ao nome do fluxo.
- Armadilha: o nó de tarefa segura a execução em `working` até a tarefa ser concluída, e um "Mesclar" mal montado fica em `working` para sempre (`en-api-docs`). Por isso o painel mostra, ao lado do tempo, quantas execuções rodam e há quanto tempo.

## O dado, perfilado (`/data:explore-data`)

Perfil das 2 listas completas que a rotina de QA mediu em develop em 25/09 (sem dado pessoal: só chaves, datas, status e ids).

**`/ws/tasks`, 161 tarefas:**

| Campo | Preenchido | O que isso muda no painel |
|---|---|---|
| `due_date` | 91% | 98 delas têm prazo igual à criação: contam como sem prazo |
| `completed_at` | 35% (todas as 57 concluídas) | tempo de conclusão tem base |
| `assigned_to` | 19% | "Sem responsável" é a maior linha: precisa aparecer |
| `node_execution` | 91% | a maior parte das tarefas vem do Spaceflow |

- Tempo da criação à conclusão: mediana de 36 segundos, média de 43 horas, maior de 102 dias. A média sozinha engana: o painel mostra média e mediana.
- Das 56 concluídas com prazo, 32 terminaram depois do prazo.

**`/c-flow-item-tasks`, 42 instâncias:**

- Todas com `due_date`; `is_overdue` bate 100% com "prazo antes de agora".
- As 12 completas têm `completed_at`. Nenhuma completa tinha prazo vencido: não deu para ver o que o "Status de SLA" mostra numa concluída depois do prazo.
- Todas `responsibility_type: everybody` e sem responsável: em develop, "Todo mundo" domina.

## A casca da tela, item por item

A mesma casca do protótipo `tarefas-rapidas`, conferida de novo no develop em 30/09. Nada mudou.

**Menu lateral** (cerca de 200 px, borda à direita, botão redondo de recolher na borda):

1. topo: avatar do workspace, nome, slug abaixo e chevron;
2. Buscar, com as teclas CTRL K;
3. **Membro**: Início, Spaceflows, Categorias, Tarefas (aberta, com os filhos), Agenda, Knowledge;
4. **Configurações**: Visão Geral, Sistema, Estrutura, Gestão de Membros, Interface, E-mails, Integrações, Agentes de IA, Logs, Credenciais;
5. **Ajuda**: Releases, Documentação.

**Barra do topo** (cerca de 44 px): recolher, voltar, avançar, recarregar, início; a faixa da trilha (workspace › Tarefas › tela), com CTRL B e a estrela; à direita, bandeira do idioma, tema, Suporte, sino e avatar.

**A única mudança na casca** é o item **Painel** dentro de Tarefas, com o selo "Novo". Está no `DECISOES.md`.

## Observações de método

- **O token de API do `config/tokens.md` não é membro do workspace de exploração** (`403 You are not a member of this workspace`). Ler a sessão do navegador para chamar a API foi bloqueado. A exploração seguiu pela tela, pelo Log de Auditoria e pelas medições da rotina de QA.
- Não medi pela API o `run_status` de fluxo concluído: vi no Log de Auditoria, que mostra o antes e o depois.
- O SLA de 1 hora do 2º item vencia às 19:02. O que o "Status de SLA" mostra está no `DECISOES.md`, rodada 1.

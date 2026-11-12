# Épico: Painel de tarefas

**O que é:** Tarefas ganha um painel fixo, que junta num vocabulário só as tarefas de Rápidas (criadas manualmente ou pelo Spaceflow) e as tarefas de Agendadas (das etapas do fluxo da categoria). Quem acompanha a equipe vê o que venceu ou vai vencer, com quem está cada fila, se a equipe entrega no prazo e onde o tempo vai. Cada número, coluna e barra abre a lista das tarefas por trás dele.

**Onde vale:** Tarefas › Painel, o 1º item de Tarefas no menu lateral do workspace, acima de Agendadas e Rápidas. A lista do painel leva a Tarefas › Agendadas e a Tarefas › Rápidas.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, aprovado em 2026-10-14. **Para ver só o MVP, ligue o botão MVP na barra de baixo da tela**, que é a barra do protótipo; desligado, a tela mostra o painel completo. Os textos nos 3 idiomas estão no `textos.ts` de https://github.com/pernalombr4/prototipos/tree/main/app/pages/painel-de-tarefas.

**Regra de lançamento:** o MVP são as partes 1 a 7, lançadas juntas. As partes 8 a 14 entram depois do MVP, cada uma por si. O pedido dos gestores decide a ordem: recorte por origem ou por categoria puxa a parte 11, e pedido para esconder painel puxa a parte 14.

**Fora do escopo:** criar, editar, atribuir ou concluir tarefa pelo painel (a lista leva à tela da tarefa); montar painel próprio ou escolher métrica, porque o catálogo de painéis é fechado; os cartões de tarefa da Início e as telas de Agendadas e de Rápidas, que não mudam; a permissão para ver cada tarefa do workspace sem a licença Full; a visão do gestor por grupo, com um responsável pelo grupo.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

### MVP

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. A tela do painel e os filtros](parte-1-a-tela-do-painel-e-os-filtros.md) | O item Painel em Tarefas, o cabeçalho com "Atualizar", os filtros Período e Responsável, os painéis em arranjo fixo, o "Como calculamos" e os estados da tela | | É a base: as outras partes entram nesta tela e respondem aos 2 filtros |
| [2. A lista do recorte](parte-2-a-lista-do-recorte.md) | A lista lateral que cada painel abre: o resumo do recorte, a tabela com busca, ordenação e paginação, e "Abrir em Agendadas" e "Abrir em Rápidas" | 1 | Cada painel das partes 3 a 10 abre esta lista |
| [3. Os 4 números](parte-3-os-4-numeros.md) | Vencidas, A vencer, Concluídas no prazo e Tempo médio de conclusão, cada um abrindo a sua lista | 1 e 2 | É o trabalho principal do gestor: o que venceu, o que vai vencer e se a equipe entrega no prazo |
| [4. Criadas e concluídas e Tarefas por status](parte-4-criadas-e-concluidas-e-tarefas-por-status.md) | O gráfico de linhas das criadas e das concluídas por semana ou por mês, e as colunas por status | 1 e 2 | Diz se a fila cresce, com a mesma contagem que a parte 3 já pede ao back |
| [5. Tarefas por responsável](parte-5-tarefas-por-responsavel.md) | A fila de cada pessoa, de "Todo mundo", do e-mail externo e de "Sem responsável", em barras, com o seletor de status e a tabela de detalhe | 1 e 2 | É o "com quem" do trabalho principal |
| [6. Tarefas por grupo](parte-6-tarefas-por-grupo.md) | A fila de cada grupo de membros: a tarefa feita para o grupo e a de cada membro | 5 | Usa as barras, o seletor e as partes da barra da parte 5, e pede a leitura dos membros de cada grupo |
| [7. Tempo médio de duração](parte-7-tempo-medio-de-duracao.md) | O tempo médio por fluxo, por etapa e por tarefa, com a barra dividida onde o tempo vai e a descida de nível | 1 e 2 | Pede 2 leituras novas no back, então a base não espera por ela |

### Depois do MVP

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [8. Os números Abertas e Concluídas](parte-8-os-numeros-abertas-e-concluidas.md) | Os números Abertas (agora) e Concluídas (no período), cada um abrindo a sua lista | 3 | No MVP, o total aparece em Tarefas por status e na tabela de responsáveis |
| [9. SLA e as listas de prazo](parte-9-sla-e-as-listas-de-prazo.md) | O SLA em colunas, com "Abertas agora" e "Concluídas no período", e as listas Tarefas vencidas e Próximas a vencer | 3 | Mostra com outro desenho o que os números da parte 3 já abrem |
| [10. Tarefas por prioridade](parte-10-tarefas-por-prioridade.md) | As abertas agora, uma coluna por prioridade | 1 e 2 | A tarefa de Agendadas não tem prioridade: o painel diz mais quando ela ganhar |
| [11. Os filtros de origem e de categoria](parte-11-os-filtros-de-origem-e-de-categoria.md) | Os filtros Origem e Categoria, valendo para cada painel | 1 | No MVP, o filtro de responsável já separa as filas |
| [12. Agrupar por semana, mês ou ano](parte-12-agrupar-por-semana-mes-ou-ano.md) | O seletor "Agrupar por" no gráfico Criadas e concluídas | 4 | No MVP, a granularidade segue o período |
| [13. Colunas e Exportar na lista](parte-13-colunas-e-exportar-na-lista.md) | Esconder e mostrar colunas da lista, e exportar a lista em CSV | 2 | São opções que não mudam a decisão do gestor no MVP |
| [14. Personalizar o painel](parte-14-personalizar-o-painel.md) | Arrastar, redimensionar e ocultar painel, o botão Painéis e o arranjo guardado por membro | 1 | Pede preferência por membro no back e só muda alguma decisão quando o catálogo cresce |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | O painel conta as tarefas de Rápidas, criadas manualmente ou pelo Spaceflow (`/ws/tasks`), e as tarefas de Agendadas, das etapas do fluxo da categoria (`/c-flow-item-tasks`). | A tarefa "Revisar contrato" criada pelo nó do Spaceflow e a tarefa "Aprovar proposta" da etapa Análise entram nos mesmos números. | Obrigatório |
| RN902 | A tarefa arquivada, a tarefa na lixeira e a tarefa de Agendadas cujo item foi excluído ficam fora do painel. | Uma tarefa de Agendadas com `status: inactive` não conta em Vencidas. | Obrigatório |
| RN903 | A tabela a seguir define o status de cada tarefa no painel. Política: Única. | Linha 2: a tarefa de Agendadas com `work_status: working` é "Em andamento". | Obrigatório |

| Linha | Status no painel | Tarefa de Rápidas (`status`) | Tarefa de Agendadas (`work_status`) |
|---|---|---|---|
| 1 | Pendente | `pending` | `waiting` |
| 2 | Em andamento | `working` | `working` |
| 3 | Bloqueada | `blocked` | não existe |
| 4 | Concluída | `completed` | `complete` |

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN904 | Uma tarefa é considerada aberta quando o status no painel é Pendente, Em andamento ou Bloqueada (RN903). | Uma tarefa Bloqueada com prazo passado é aberta e vencida. | Obrigatório |
| RN905 | O prazo da tarefa é a "Data limite" em Rápidas e a "Data Limite" do SLA em Agendadas, gravadas no `due_date`. | A tarefa de Agendadas com "Data Limite" em 12/11/2026 às 18:00 tem esse prazo no painel. | Obrigatório |
| RN906 | Uma tarefa é considerada sem prazo quando não tem `due_date`, ou quando é do Spaceflow e o `due_date` é igual ao `created_at`, com 1 min de folga. | O nó do Spaceflow sem prazo configurado grava a hora de criação no `due_date`; a tarefa conta como sem prazo, e não como vencida. | Obrigatório |
| RN907 | A tabela a seguir define a situação do prazo de cada tarefa, em dias corridos a partir do momento da consulta. Política: Única. | Linha 3: tarefa aberta com prazo daqui a 3 dias é "A vencer". | Obrigatório |

| Linha | Tarefa | Prazo | Situação |
|---|---|---|---|
| 1 | aberta | sem prazo (RN906) | Sem prazo |
| 2 | aberta | antes de agora | Vencida |
| 3 | aberta | de agora até agora mais 7 dias | A vencer |
| 4 | aberta | depois de agora mais 7 dias | No prazo |
| 5 | concluída | sem prazo (RN906) | Sem prazo |
| 6 | concluída | data de conclusão até o prazo | No prazo |
| 7 | concluída | data de conclusão depois do prazo | Atrasada |

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN908 | A tarefa aberta conta no momento da consulta, sem o período. A tarefa concluída conta pela data de conclusão dentro do período, e a criada, pela data de criação dentro do período. | Com "Últimos 7 dias", uma tarefa vencida há 1 mês conta em Vencidas, e uma concluída há 10 dias fica fora de Concluídas no prazo. | Obrigatório |
| RN909 | Uma tarefa concluída sem data de conclusão (`completed_at` vazio) fica fora de cada conta de concluídas. | A tarefa de Rápidas criada já com o status Concluída não entra em Concluídas no prazo. | Obrigatório |
| RN910 | A tabela a seguir define para quem a tarefa foi designada. Política: Única. | Linha 4: tarefa de Agendadas com o tipo de responsável "Baseado em Campo" conta para cada pessoa que o campo indica. | Obrigatório |

| Linha | Tarefa | Responsável gravado | Conta para |
|---|---|---|---|
| 1 | de Rápidas | `assigned_to` preenchido | a pessoa |
| 2 | de Rápidas | `assigned_to` vazio | "Sem responsável" |
| 3 | de Agendadas | tipo de responsável "Todo Mundo" | "Todo mundo" |
| 4 | de Agendadas | tipo "Usuários", "Usuário Solicitante", "Baseado em Campo" ou "Regras de Responsável" | cada pessoa indicada |
| 5 | de Agendadas | tipo "Grupo" | o grupo |
| 6 | de Agendadas | tipo "Email Externo" | "E-mail externo" |

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN911 | Uma tarefa designada a 2 ou mais pessoas conta 1 vez para cada pessoa. | A tarefa de Agendadas para Ana e Bruno conta 1 vez na fila de Ana e 1 vez na de Bruno. | Obrigatório |
| RN912 | A fila de um responsável se divide em 5 partes, e cada tarefa cai em 1 parte só: Vencida é a aberta com prazo passado (Pendente, Em andamento ou Bloqueada); Pendente, Em andamento e Bloqueada são as outras abertas, pelo status; Concluída é a concluída no período. | Uma tarefa Em andamento com prazo de ontem cai em Vencida, e não em Em andamento. | Obrigatório |
| RN913 | O tempo de conclusão de uma tarefa é o tempo da criação (`created_at`) à conclusão (`completed_at`), em dias corridos. | Tarefa criada em 03/11/2026 às 09:00 e concluída em 05/11/2026 às 15:00 leva 2 d 6 h. | Obrigatório |
| RN914 | A semana vai de segunda a domingo, e o dia começa à meia-noite no horário de Brasília. | Uma tarefa concluída no domingo às 23:30, horário de Brasília, conta na semana que começou na segunda anterior. | Obrigatório |
| RN915 | O período anterior tem a duração do período escolhido e termina no começo do período escolhido. Em "Todo o período", não há período anterior. | Com "Últimos 30 dias" em 11/11/2026 às 15:00, o período vai de 13/10/2026 às 00:00 até a consulta, e o anterior, de 13/09/2026 às 09:00 a 13/10/2026 às 00:00. | Obrigatório |
| RN916 | Em "Todos", as filas de responsável e de grupo vão da que tem mais tarefas vencidas à que tem menos, depois do maior total ao menor e depois pelo nome. Nos outros filtros, vão do maior valor ao menor e depois pelo nome. | Ana, com 9 vencidas e 20 no total, vem antes de Bruno, com 4 vencidas e 50 no total. | Obrigatório |
| RN917 | O "No prazo" de uma fila é calculado como as concluídas da fila no período até o prazo, divididas pelas concluídas da fila no período que tinham prazo. O "Tempo médio" da fila é a média do tempo de conclusão (RN913) das concluídas da fila no período. | Ana concluiu 10 tarefas com prazo, 8 até o prazo: "No prazo" 80%. | Obrigatório |
| RN918 | A tabela a seguir define a faixa de prazo de cada tarefa aberta, pelo tempo do momento da consulta até o prazo. Política: Única. | Linha 4: tarefa aberta que vence daqui a 3 dias cai em "Em 1 a 7 dias". | Obrigatório |

| Linha | Prazo da tarefa aberta | Faixa |
|---|---|---|
| 1 | venceu há mais de 7 dias | Há mais de 7 dias |
| 2 | venceu há até 7 dias | Há até 7 dias |
| 3 | vence em até 24 h | Em até 24 h |
| 4 | vence em mais de 24 h e até 7 dias | Em 1 a 7 dias |
| 5 | vence em mais de 7 dias e até 30 dias | Em 8 a 30 dias |
| 6 | vence em mais de 30 dias | Em mais de 30 dias |
| 7 | sem prazo (RN906) | Sem prazo |

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN919 | Cada número, coluna, barra, lista e arquivo do painel conta só as tarefas que o membro vê em Tarefas › Rápidas e em Tarefas › Agendadas, com as permissões da licença e do cargo dele. | O Owner conta cada tarefa do workspace. Um Standard conta as tarefas que as listas dele mostram, e Vencidas abre a lista que ele já vê em Agendadas e em Rápidas. | Obrigatório |
| RN920 | A tabela a seguir define quem abre o painel. Política: Única. | Linha 3: um Standard com a permissão "Ver o painel de tarefas" no cargo abre o painel. | Obrigatório |

| Linha | Membro | Abre o painel |
|---|---|---|
| 1 | Owner | sim |
| 2 | Full, com "Ignorar Permissões para Membros Full" ligado no workspace | sim |
| 3 | Full, Standard ou Viewer, com a permissão "Ver o painel de tarefas" no cargo | sim |
| 4 | Full, Standard ou Viewer, sem a permissão "Ver o painel de tarefas" no cargo | não |
| 5 | usuário externo, que responde a tarefa pelo portal | não |

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN921 | A permissão "Ver o painel de tarefas" nasce desligada em cada cargo, no cargo que já existe e no cargo novo. | No lançamento, só as linhas 1 e 2 de RN920 abrem o painel, até quem edita cargos ligar a permissão. | Obrigatório |
| RN922 | Os números de cada responsável e de cada grupo (a fila, o "No prazo" e o "Tempo médio") aparecem para cada membro que abre o painel, contados com as tarefas que esse membro vê (RN919). | Um Standard com a permissão vê o "No prazo" de Ana, contado com as tarefas de Ana que ele vê. | Obrigatório |
| RN923 | Cada texto do painel omite quantas tarefas do workspace o membro deixa de ver. | O cabeçalho de um Standard diz "Tarefas que o seu perfil permite ver.", sem "113 de 240". | Obrigatório |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone e caixa de marcar com nome acessível, modal com título e descrição, foco visível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |
| Gráficos | Cada gráfico abre a dica ao passar o mouse e no foco do teclado, com o nome, cada parte com a cor e o valor, e o total. Cada coluna e cada barra é um botão, com o nome e o valor para o leitor de tela. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Tarefa de Rápidas | A tarefa de `/ws/tasks`: a criada manualmente e a que o nó do Spaceflow cria | Rápidas |
| Tarefa de Agendadas | A tarefa de `/c-flow-item-tasks`, de uma etapa do fluxo da categoria | Agendadas |
| Recorte | O conjunto de tarefas por trás de um número, de uma coluna ou de uma barra | o título da lista ("Vencidas", "Carla Nunes · Vencida") |
| Fila | As tarefas de um responsável ou de um grupo, abertas agora e concluídas no período | (sem nome na tela) |
| Resumo do recorte | A coluna à esquerda da lista, com o resumo do painel clicado | "Resumo" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P903 | Na coluna "Status de SLA" de Agendadas, "Atrasado" junta a vencida e a atrasada, que o painel separa. A coluna passa a usar as 2 palavras? | produto | Nada muda no painel; muda a tela de Agendadas, fora deste épico |
| P904 | O grupo saiu de Tarefas por responsável e ficou só em Tarefas por grupo, para a mesma tarefa não aparecer com 2 números. Fica assim? | produto | Com o grupo de volta, a parte 5 ganha a linha de cada grupo |
| P905 | Bloqueada aparece na barra de Tarefas por responsável e de Tarefas por grupo, e não tem filtro próprio no seletor. Ganha o filtro? | produto | As partes 5 e 6 ganham a opção "Bloqueada" no seletor |
| P906 | O ENSPACE não tem fuso por workspace, e o painel usa o horário de Brasília. O cliente fora do Brasil conta a semana e o mês no horário dele? | Time de back | Com fuso por workspace, RN914 passa a usar o fuso do workspace |
| P907 | Se o nó do Spaceflow sem prazo gravar `due_date: null`, a exceção de RN906 deixa de ser necessária. O back muda a gravação? | Time de back | RN906 fica só com "sem `due_date`" |
| P909 | O que Standard e Viewer veem hoje nas listas de Agendadas e de Rápidas: só as tarefas em que têm papel (criador, responsável, colaborador), ou cada tarefa que o cargo libera? | produto e time de back | Define o que RN919 conta para Standard e Viewer |
| P910 | A tarefa de um item que o membro não lê, por permissão de categoria ou de formulário, aparece nas listas dele? | produto e time de back | Com "não aparece", RN919 tira essa tarefa da conta |
| P911 | O Full com cargo reduzido vê a tarefa de Agendadas sem responsável e a tarefa com "Limitar acesso" que não o inclui? | produto e time de back | Define o que RN919 conta para o Full sem a linha 2 de RN920 |
| P908 | O painel Tarefas por tipo, com a ação da tarefa (aprovação, formulário, confirmação, integração), entra depois do MVP? | produto | Com o sim, o épico ganha uma parte depois da 14 |

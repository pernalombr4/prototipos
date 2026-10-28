# Agendas integradas em produtos de trabalho: ClickUp e Notion

Pesquisa feita em 2026-10-28. Li os artigos do help center do ClickUp pela API pública do Zendesk
(`help.clickup.com/api/v2/help_center/...`), porque a página HTML devolve 403 para leitura automática; o
link citado é sempre o da página pública. A data de atualização (`updated_at`) de cada artigo vai entre
parênteses quando a API a informou.

Mapa dos produtos, para ler o resto:

| Produto | O que é | Onde mora |
|---|---|---|
| ClickUp **Calendar view** | visualização de tarefas de uma List, Folder, Space ou Everything | barra de views (`+ View` > `Calendar`) |
| ClickUp **Planner** (o "ClickUp Calendar") | agenda pessoal: tarefas + eventos do Google ou Outlook, com time blocking | superfície própria, separada da Calendar view |
| Notion **Calendar view** | layout de database, dirigido por uma propriedade `Date` | dentro de qualquer página/database |
| **Notion Calendar** (ex-Cron) | app de agenda separado (desktop, web, mobile) que lê contas Google/Outlook/iCloud e databases do Notion | calendar.notion.so, app desktop |
| **Notion Mail** | cliente de e-mail que usa o Notion Calendar para marcar reunião | app separado |

## 1. Interface: visualizações, layout, cartão, cor, densidade, clique

### Takeaway
Os 2 produtos separam a "visualização de calendário da base" (simples, dirigida por campo de data) da
"agenda pessoal" (grade de horas, eventos externos e lista lateral de pendências para arrastar). O ClickUp
põe as 2 coisas dentro do mesmo app; o Notion põe a agenda pessoal num app à parte, ligado às databases.

### Cited Findings

**ClickUp Calendar view**
- Criar: `+View` na barra de views > `Calendar`; dá para marcar a view como privada ou fixá-la na barra. Abre no mês atual. — [Intro to Calendar view](https://help.clickup.com/hc/en-us/articles/6310085740183-Intro-to-Calendar-view)
- Escalas: o controle `Month` no canto superior esquerdo troca entre Day, 4 days, Week e Month; setas navegam pelo período; `Today` volta ao dia atual. — [Intro to Calendar view](https://help.clickup.com/hc/en-us/articles/6310085740183-Intro-to-Calendar-view)
- A view pode morar em Everything, Space, Folder, Subfolder ou List (`Customize` > `Layout options` > `Move view`); quanto mais alto o nível, mais Lists entram no mesmo calendário. — [Intro to Calendar view](https://help.clickup.com/hc/en-us/articles/6310085740183-Intro-to-Calendar-view); [How to manage multiple calendars in one view](https://help.clickup.com/hc/en-us/articles/40984709806103-How-to-manage-multiple-calendars-in-one-view) (2026-10-19)
- Painel lateral direito: `Unscheduled and overdue tasks` abre a lista de tarefas sem data ou atrasadas; o mesmo painel tem a seção `Your calendars`, com os calendários do Google para ligar e desligar. — [Intro to start dates](https://help.clickup.com/hc/en-us/articles/6308666892823-Intro-to-start-dates) (2026-10-19); [Google Calendar integration](https://help.clickup.com/hc/en-us/articles/6336507264663-Google-Calendar-integration) (2026-10-24)
- Cor: `Customize` > `Color tasks by` com 3 regras: Parent List (cor da List), Status (cor do status atual) ou o valor de um campo personalizado Dropdown. — [Customize and categorize tasks in Calendar view](https://help.clickup.com/hc/en-us/articles/7756018621207-Customize-and-categorize-tasks-in-Calendar-view) (2026-10-14)
- O cartão mostra os campos escolhidos em `Customize` > `Fields`: Assignee, Priority, Time Estimate, Sprint Points, Time Tracked, nome de Space/Folder/Subfolder/List, Subtasks, Parent name, Tags, Tasks in Multiple Lists e Custom Fields. Milestone ganha ícone de losango. — [Customize and categorize tasks in Calendar view](https://help.clickup.com/hc/en-us/articles/7756018621207-Customize-and-categorize-tasks-in-Calendar-view); [Intro to Calendar view](https://help.clickup.com/hc/en-us/articles/6310085740183-Intro-to-Calendar-view)
- Densidade e exibição: `Show weekends`, `Show hour grid lines` (sem efeito no mês), `Fade out tasks in the past` (esmaece o que passou), `Show week numbers` (some no dia), `Always stay on this date` (reabre na última data vista), formato `AM/PM` ou `24 HOUR`. — [Customize and categorize tasks in Calendar view](https://help.clickup.com/hc/en-us/articles/7756018621207-Customize-and-categorize-tasks-in-Calendar-view)
- `Me mode` mostra só as tarefas atribuídas a quem está vendo. — [Intro to Calendar view](https://help.clickup.com/hc/en-us/articles/6310085740183-Intro-to-Calendar-view)
- No mobile, as escalas são Day, Week, Month e Work week. — [Use Calendar view on mobile](https://help.clickup.com/hc/en-us/articles/7255373717143-Use-Calendar-view-on-mobile)

**ClickUp Planner (ClickUp Calendar)**
- Anunciado em 2025-10-01 pelo Head of Calendar and Scheduling: suporte a Google Workspace, Outlook/Microsoft 365 em beta aberto, AI Notetaker e time blocking de tarefa com IA. O calendário fica "ao lado" das prioridades, do trabalho atribuído e de um backlog personalizável. — [Why we built ClickUp Calendar](https://clickup.com/blog/why-we-built-clickup-calendar/)
- Disponível em todos os planos, inclusive para guests e limited members. — [What is the Planner?](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner) (2026-10-20)
- Layout: `Planner Sidebar` à esquerda (abre e fecha com `Ctrl + \`), com 4 grupos recolhíveis de tarefas: `Priorities` (Personal Priorities), `Assigned to me`, `Today & overdue` e `Backlog` (todas as tarefas da List e dos filtros escolhidos, com busca e filtros iguais aos da List view). Embaixo da grade, um `dock` de comandos com busca. — [What is the Planner?](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner)
- Escalas: Day, 4 days, week, month; as teclas `1` a `9` mostram N dias. `Hide weekends` e `Change appearance` (modo solid ou subtle). Eventos de dia inteiro ficam no cabeçalho do dia; clicar no cabeçalho ou no rótulo `All day` expande. Evento do Google marcado como "free" não aparece no cabeçalho, salvo reunião aceita. — [What is the Planner?](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner)
- Clique: em tarefa abre um preview; em evento abre os detalhes, com entrar na videochamada e "link tasks and Docs" ao evento. `Calendar Glance`, na barra, entra, marca e administra eventos. — [What is the Planner?](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner)
- Evento com nota da IA ganha ícone de bloco de notas. — [What is the Planner?](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner)

**Notion Calendar view (database)**
- Pré-requisito: a database precisa de uma propriedade `Date`. Criar: `/Calendar view` numa página, ou `+` ao lado do nome da view > `Calendar`. — [Calendar view databases](https://www.notion.com/help/calendars)
- Escalas: mês é o padrão; semana por `Layout` > `Show calendar as` > `Week`. Não há dia no desktop (no mobile, tocar a data abre o dia). Para horas até anos, o Notion manda para a Timeline view. As setas `<` `>` ao lado de `Today` navegam; rolar para baixo mostra os meses seguintes, mas não volta para meses passados. A view lembra o último intervalo visto. — [Calendar view databases](https://www.notion.com/help/calendars)
- Qual data dirige o calendário: `Layout` > `Show calendar by`, quando a database tem mais de uma propriedade de data. — [Calendar view databases](https://www.notion.com/help/calendars)
- Cartão: `Property visibility` liga e desliga cada propriedade no cartão (ícone de olho) e reordena por arrasto. — [Calendar view databases](https://www.notion.com/help/calendars)
- Clique: a Calendar view abre a página em `Center peek` por padrão; as alternativas são `Side peek` e `Full page` (`Layout` > `Open pages in`). — [Views, filters, sorts & groups](https://www.notion.com/help/views-filters-and-sorts)

**Notion Calendar (app)**
- Layout: barra lateral esquerda com as contas e calendários (`+ Add calendar account`), grade principal com botão `Today`, painel de contexto à direita (detalhes do evento, botão de link de agendamento). Eventos de dia inteiro no topo do dia. — [Getting started with Notion Calendar](https://www.notion.com/help/guides/getting-started-with-notion-calendar)
- Número de dias: controle `±` no desktop (1, 2 ou 3 dias no mobile); semana e mês pelo dropdown do canto superior direito. — [Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings); [Getting started with Notion Calendar](https://www.notion.com/help/guides/getting-started-with-notion-calendar)
- Densidade: `Zoom Hours In` / `Zoom Hours Out` (altura da hora) e `Zoom In` / `Zoom Out` / `Actual Size` (escala da interface), no menu `View`. A seção de dia inteiro recolhe pelas setas na coluna do fuso. Ajustes em `General`: mostrar fim de semana, eventos recusados, número da semana, início da semana, formato de hora, tema `Auto`/`Light mode`/`Dark mode`. — [Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings)
- Visibilidade e cor por calendário: ícone de olho ao lado do nome (riscado = escondido); `•••` > cor. — [Manage calendars & events in Notion Calendar](https://www.notion.com/help/manage-your-calendars-and-events)
- Item de database: com hora de início e fim vira bloco de horário; só com data vira evento `All-day`. Evento vindo de database traz a opção `Open in Notion`. — [Getting started with Notion Calendar](https://www.notion.com/help/guides/getting-started-with-notion-calendar)
- Barra de menu do desktop: contagem regressiva do próximo evento, com filtros de quais eventos entram (`All-day events`, `Events without participants`, `Events without conferencing/location`). — [Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings)
- A Home do Notion tem o widget `Upcoming events`, para ver e entrar nos eventos sem abrir o app de agenda; sem conexão, mostra `Connect Notion Calendar`. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)

### Inferences
- O padrão comum é a grade + uma lista lateral de "o que ainda não tem horário" (ClickUp: `Unscheduled and overdue tasks` e `Backlog`; Notion Calendar: painel da database). A lista lateral é o que transforma o calendário em ferramenta de planejamento, e é o que uma agenda externa (Outlook) não tem.
- Os 2 produtos deixam o usuário escolher qual campo de data dirige o calendário e qual regra pinta o cartão; nenhum dos 2 pinta por "origem" fixa.
- O clique abre um painel (preview, peek ou context panel) sem sair do calendário; a página inteira é opção, não padrão.

### Gaps
- Como o mês do ClickUp trata dia lotado ("+N more" ou rolagem): nenhuma fonte oficial descreve. Uma resenha de 2026 diz que itens da agenda às vezes saem cortados ([G2 Learn, Best calendar app](https://learn.g2.com/best-calendar-app)).
- Estado vazio e primeiro uso: nenhuma fonte descreve a tela vazia de nenhum dos 4 produtos.
- Como a tarefa com início e fim em dias diferentes aparece no ClickUp (barra contínua ou repetida): não documentado.
- Cor condicional na Calendar view do Notion: não achei fonte oficial.
- Mini calendário no Notion Calendar: o guia de introdução não descreve.

## 2. Interações: arrastar, redimensionar, criar, atalhos

### Takeaway
Os 2 produtos tratam o calendário como lugar de edição: arrastar muda a data do registro de origem, a lista
lateral serve de fonte para agendar, e o clique no espaço vazio cria. O ClickUp distingue "agendar o trabalho"
(bloco de foco, DO date) de "mudar o prazo"; o Notion não tem essa distinção.

### Cited Findings
- ClickUp Calendar view: arrastar a tarefa para outro dia muda as datas; arrastar do painel `Unscheduled and overdue tasks` para um dia grava início e prazo. — [Intro to Calendar view](https://help.clickup.com/hc/en-us/articles/6310085740183-Intro-to-Calendar-view); [Intro to start dates](https://help.clickup.com/hc/en-us/articles/6308666892823-Intro-to-start-dates)
- ClickUp Calendar view, criar: no mês, hover no dia e clique no `+`; nas outras escalas, clique num horário vazio: o horário vira o prazo e a estimativa de tempo define a altura do bloco. `Bulk Action Toolbar` edita várias tarefas de uma vez. — [Intro to Calendar view](https://help.clickup.com/hc/en-us/articles/6310085740183-Intro-to-Calendar-view)
- ClickUp Planner, agendar: arrastar a tarefa da `Planner Sidebar` para a grade cria um bloco de foco, com duração igual à estimativa de tempo. — [Schedule tasks from your Planner](https://help.clickup.com/hc/en-us/articles/35975611704087-Schedule-tasks-from-your-Planner) (2026-10-19)
- ClickUp Planner, criar tarefa: clique num horário ou no `+` da sidebar > `Task` > nome > escolher a List (`Select a List`) > `Save`. — [Schedule tasks from your Planner](https://help.clickup.com/hc/en-us/articles/35975611704087-Schedule-tasks-from-your-Planner)
- ClickUp Planner, pelo dock: `/` abre a busca, escolhe a tarefa, clica no horário, `Save`. — [Schedule tasks from your Planner](https://help.clickup.com/hc/en-us/articles/35975611704087-Schedule-tasks-from-your-Planner)
- ClickUp Planner, `AI Time-Blocking`: hover na tarefa > ícone de raio > horários sugeridos aparecem com contorno na grade > `Confirm work session` ou `Stop auto scheduling`. Ordem de prioridade: Personal Priorities, High e Urgent, prazo mais próximo, Normal, outras, Low. — [Schedule tasks from your Planner](https://help.clickup.com/hc/en-us/articles/35975611704087-Schedule-tasks-from-your-Planner)
- ClickUp: uma tarefa pode ter vários DO dates (blocos de foco) sem mudar início nem prazo; dá para escolher um horário livre e arrastar várias tarefas do backlog para o mesmo bloco. — [Why we built ClickUp Calendar](https://clickup.com/blog/why-we-built-clickup-calendar/)
- ClickUp Planner, atalhos: `Shift + W` semana, `Shift + M` mês, `Shift + T` hoje, setas mudam o período, `Go to date`, `Shift + 2` = `Meet with` (marca reunião com alguém do workspace). — [What is the Planner?](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner)
- Notion Calendar view: arrastar o cartão para outro dia muda a data; arrastar a borda esquerda ou direita estica o cartão por vários dias (intervalo de datas). — [Calendar view databases](https://www.notion.com/help/calendars)
- Notion Calendar (app): clique duplo num horário cria evento; arrastar entre dias cria evento de vários dias; o dropdown ao lado de `Event` troca o tipo para Focus, Out of office ou Birthday. `Shift` + clique seleciona vários eventos para arrastar juntos ou agir pelo botão direito. — [Getting started with Notion Calendar](https://www.notion.com/help/guides/getting-started-with-notion-calendar); [Manage calendars & events in Notion Calendar](https://www.notion.com/help/manage-your-calendars-and-events)
- Notion Calendar, database: clicar no nome da database na barra lateral abre um painel com as páginas dela; arrastar o item para a grade agenda; `+` cria página; o lápis edita propriedades rápido. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)
- Notion Calendar, atalhos: `T` hoje, `J`/`K` próximo e anterior, `←`/`→`, `S` compartilhar disponibilidade, `N`/`B` próximo e anterior evento, `Ctrl/⌘ K` menu de comandos, `?` lista completa, `O` (ou `⌘ K` + "show Notion database") para adicionar database. — [Getting started with Notion Calendar](https://www.notion.com/help/guides/getting-started-with-notion-calendar); [Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings); [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)
- Notion Calendar, equipe: arrastar um colega do menu para a grade cria 1:1 com título, horário, participante e videochamada preenchidos. — [Notion Calendar for teams](https://www.notion.com/help/notion-calendar-for-teams)

### Inferences
- "Arrastar da lista lateral para a grade" é a interação central dos 2 produtos para agendar o que já existe no sistema; no ENSPACE, equivale a arrastar uma tarefa ou um item sem data para o dia.
- O ClickUp define a duração do bloco pela estimativa de tempo da tarefa; sem campo de duração, o bloco precisa de um padrão.

### Gaps
- Sintaxe de criação rápida em linguagem natural (ex.: "amanhã 15h"): nenhuma fonte oficial descreve em nenhum dos 2.
- Redimensionar evento de horário (puxar a borda inferior) no Notion Calendar e no ClickUp: não documentado nas páginas lidas.
- O atalho `Ctrl/⌘ K` aparece com 2 funções no help do Notion (fim de semana e menu de comandos); as 2 páginas oficiais divergem.

## 3. Integração com as entidades do sistema

### Takeaway
No Notion, qualquer database com propriedade de data vira camada da agenda, e o evento se liga a uma página
(`Docs and links`, `Add AI meeting notes`). No ClickUp, tarefa e evento continuam separados: o evento pode
ganhar link para tarefas e Docs, mas mudar o evento não muda a tarefa. Nenhum dos 2 transforma evento externo
em registro do sistema.

### Cited Findings

**Qual data dirige o calendário**
- ClickUp: a tarefa aparece pela data de início, pelo prazo ou por campos personalizados do tipo Date, ligados um a um em `Customize`; tarefa sem nenhuma dessas datas ativa não aparece. — [Customize and categorize tasks in Calendar view](https://help.clickup.com/hc/en-us/articles/7756018621207-Customize-and-categorize-tasks-in-Calendar-view)
- ClickUp: subtarefas aparecem como eventos à parte com `Show subtasks`; ocorrências futuras de tarefa recorrente com `Show future recurring tasks` (plano pago). — [Customize and categorize tasks in Calendar view](https://help.clickup.com/hc/en-us/articles/7756018621207-Customize-and-categorize-tasks-in-Calendar-view)
- Notion Calendar view: uma propriedade `Date` por view (`Show calendar by`). — [Calendar view databases](https://www.notion.com/help/calendars)
- Notion Calendar (app): até 20 databases; com mais de uma propriedade de data, escolhe-se a primária; dá para adicionar mais de uma view da mesma database (`Add Notion database view`); filtros por `Status filter` e `Date filter` e `Color` por database no ícone de controles. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)
- Notion Calendar (app): a database também se liga a partir do Notion: nome da view > `Manage in Notion Calendar`. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)

**Editar o registro pela agenda**
- Notion Calendar: ao clicar num item da database, o painel direito edita título, data, hora, select (não multi-select, nesse painel) e status, e move o item para outro calendário, database ou view. Propriedades editáveis: Title, Date, Status, Select e multi-select, ícone da página, Text, Checkbox; ID e Person só leitura. Toda mudança grava na database original. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)
- Notion Calendar: data vinda de Formula, Created time ou Last edited time fica só leitura. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)
- Notion Calendar: permissão `Can view` liga a database; `Can edit content` permite criar e editar; página com permissão própria pode não aparecer. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)

**Criar registro pela agenda e escolher o tipo**
- ClickUp Planner: clicar no horário > `Task` > escolher a List; o mesmo `+` cria evento. — [Schedule tasks from your Planner](https://help.clickup.com/hc/en-us/articles/35975611704087-Schedule-tasks-from-your-Planner)
- Notion Calendar: `Settings` > `Calendars` > `Default calendar` define a database que recebe os eventos novos; no desktop, o quadrado ao lado do nome da database faz o mesmo. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)
- Com a database como calendário padrão, o evento novo vira só página do Notion e não chega ao Google, Outlook ou iCloud. — [2sync, How to use Notion Calendar](https://2sync.com/blog/how-to-use-notion-calendar) (terceiro)

**Ligar evento a registro e ver a reunião dentro do registro**
- Notion Calendar: o campo `Docs and links` do evento liga uma página existente (busca ou `Recent Notion pages`) ou cria uma nova. — [Getting started with Notion Calendar](https://www.notion.com/help/guides/getting-started-with-notion-calendar)
- Notion Calendar: o campo `Add AI meeting notes` oferece `Create new AI Meeting Note` (abre página nova com nome, data e hora do evento, na database de reuniões padrão), `Add note to existing page` e `Change workspace`. A nota nasce privada; `Settings` > `Notion AI` > `Auto-share with internal calendar event participants` compartilha com os participantes do workspace. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)
- Notion: o evento do calendário nunca vira página, então a reunião não ganha propriedades, relações nem notas numa database (só a nota de IA ligada). — [2sync, How to use Notion Calendar](https://2sync.com/blog/how-to-use-notion-calendar) (terceiro)
- Notion: não dá para pôr o Notion Calendar nem o Google Calendar dentro de uma página; o Google entra só como embed de leitura. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion); [Calendar view databases](https://www.notion.com/help/calendars)
- ClickUp Planner: o detalhe do evento permite "link tasks and Docs". — [What is the Planner?](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner)
- ClickUp: evento criado no Google não cria tarefa; mudar o evento não muda a tarefa relacionada, porque tarefa e evento são separados. — [Google Calendar integration](https://help.clickup.com/hc/en-us/articles/6336507264663-Google-Calendar-integration)
- ClickUp: o card `Agenda` do My Tasks mostra tarefas agendadas, lembretes e eventos externos juntos. — [Use the Agenda card in My Tasks](https://help.clickup.com/hc/en-us/articles/6311692450583-Scheduling-Time)

**Sincronização com Google e Outlook**
- ClickUp, Google, entrada: eventos do Google aparecem e se editam no Planner e nas Calendar views, em tempo real; só calendários de "My Calendars"; a escolha em `Your calendars` vale para todas as Calendar views da pessoa no workspace. A conexão é pessoal: ninguém mais vê o Google de quem conectou. — [Google Calendar integration](https://help.clickup.com/hc/en-us/articles/6336507264663-Google-Calendar-integration)
- ClickUp, Google, saída (`Sync tasks to calendar` > `Add sync`): de Space, Folder, Subfolder ou List, todas as tarefas ou só as atribuídas a mim; o ClickUp recomenda um calendário do Google dedicado e não aceita calendário compartilhado. — [Google Calendar integration](https://help.clickup.com/hc/en-us/articles/6336507264663-Google-Calendar-integration)
- ClickUp, Google, regras da saída: tarefa sem prazo, com prazo passado, com início a mais de 60 dias, fechada ou ocorrência futura de recorrente não sincroniza; tarefa sem hora vira dia inteiro; tarefa só com prazo começa 1 hora antes; o Google mostra toda tarefa como bloco de 30 minutos; renomear ou mudar data atualiza o evento em "alguns minutos"; ao desconectar, os eventos antigos ficam e saem à mão. — [Google Calendar integration](https://help.clickup.com/hc/en-us/articles/6336507264663-Google-Calendar-integration)
- ClickUp, Outlook: eventos sincronizam entre Outlook e Planner; tarefas do Planner não vão para o Outlook. O artigo do Outlook diz que só o Outlook vai para o Planner, e o "Open your Planner" descreve sincronia de eventos nos 2 sentidos: as páginas divergem. A conexão exige aprovação de escopos por um admin da Microsoft; a leitura roda em segundo plano por delta sync. — [Outlook Calendar integration](https://help.clickup.com/hc/en-us/articles/30618267005975-Outlook-Calendar-integration); [Open your Planner](https://help.clickup.com/hc/en-us/articles/35975772703767-Open-your-Planner); [Authorize the Planner's access to Microsoft 365](https://help.clickup.com/hc/en-us/articles/31645350834199-Authorize-the-Planner-s-access-to-Microsoft-365)
- ClickUp, iCal: só de mão única, do ClickUp para fora. — [iCal calendar sync](https://help.clickup.com/hc/en-us/articles/6304782034839-Sync-Calendar-views-with-an-external-calendar)
- Notion Calendar: contas Google, iCloud (senha de app) e Microsoft Outlook; Outlook com recorrência editável (ocorrência ou série), calendários delegados e link do Teams. — [Manage calendars & events in Notion Calendar](https://www.notion.com/help/manage-your-calendars-and-events)
- Notion Calendar: databases aparecem só no Notion Calendar, nunca no Google ou iCloud. — [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion)
- Notion Calendar: o mesmo evento (mesmo ID) em 2 calendários se funde em 1; para responder pelo outro calendário, esconda o primeiro. — [Manage calendars & events in Notion Calendar](https://www.notion.com/help/manage-your-calendars-and-events)

### Inferences
- O que torna a agenda integrada melhor que o Outlook ao lado, nos 2 produtos: (1) a lista lateral do que o sistema tem a fazer, pronta para arrastar; (2) editar o registro (data, status) sem sair da agenda; (3) criar o registro do tipo certo a partir do horário; (4) ligar a reunião ao registro e à nota da reunião. O Outlook dentro do sistema, sozinho, não faz nenhuma das 4.
- Nenhum dos 2 resolve "reunião do Outlook vira registro" (ex.: audiência marcada no Outlook virar item). É uma lacuna dos 2 que o ENSPACE pode cobrir.
- As regras de saída do ClickUp para o Google (bloco de 30 minutos, 60 dias, calendário dedicado) mostram que empurrar tarefa para a agenda externa gera ruído; o ClickUp limita para conter isso.

### Gaps
- Qual lado vence num conflito de edição simultânea: nem o ClickUp nem o Notion documentam.
- Se a reunião aparece dentro da página ou da tarefa ligada (ex.: lista de reuniões no registro): só a nota de IA está documentada no Notion; no ClickUp, nada.
- Se a Calendar view do ClickUp lê campo Date de qualquer List no nível Everything de uma vez: não documentado.

## 4. Filtros, views salvas, camadas, pessoal e equipe, disponibilidade, recorrência, fuso, avisos

### Takeaway
Filtro e view salva vêm do mecanismo geral de views dos 2 produtos. As camadas ligam e desligam por
calendário (ClickUp: `Your calendars`; Notion Calendar: olho ao lado de cada calendário e database). Link de
disponibilidade, fusos múltiplos e calendário de colega estão no Notion Calendar; no ClickUp, há `Meet with`.

### Cited Findings
- ClickUp: `Filter` no canto superior direito por Assignee, List, Priority ou Status; a configuração filtrada se salva como view com nome. — [How to manage multiple calendars in one view](https://help.clickup.com/hc/en-us/articles/40984709806103-How-to-manage-multiple-calendars-in-one-view)
- ClickUp: view de Space ou Folder compartilha por link público (sem conta); calendário público mostra sempre 12 horas; `Private view` para calendário só meu. — [How to manage multiple calendars in one view](https://help.clickup.com/hc/en-us/articles/40984709806103-How-to-manage-multiple-calendars-in-one-view); [Intro to Calendar view](https://help.clickup.com/hc/en-us/articles/6310085740183-Intro-to-Calendar-view)
- ClickUp Planner: muda semana, escala e fuso; o AI Time-Blocking não sugere horário fora do expediente. — [What is the Planner?](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner); [search snippet do help center sobre working hours, sem página lida](https://help.clickup.com/hc/en-us/sections/29051476964759-Calendar)
- ClickUp AI Notetaker: entra sozinho e anota todas as reuniões dos calendários primários escolhidos. — [What is the Planner?](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner)
- Notion Calendar view: filtro e ordenação em `View settings`, com `Save for everyone` (vale para todos da view) e `Add advanced filter` (E/OU em até 3 níveis). — [Views, filters, sorts & groups](https://www.notion.com/help/views-filters-and-sorts)
- Notion Calendar: calendário de colega por `•••` > `Show teammate calendar...` (precisa de Google Workspace); `Pin to calendar list` deixa fixo. — [Notion Calendar for teams](https://www.notion.com/help/notion-calendar-for-teams)
- Notion Calendar, disponibilidade: `S` abre `Share availability`; link recorrente (entrevistas) ou único; `Avoid conflicts` esconde horários que batem com eventos ocupados; o convidado escolhe e a reunião entra na agenda; reagendar e cancelar pelo link na descrição. — [Scheduling & availability in Notion Calendar](https://www.notion.com/help/availability-blocking-and-time-zones); [Getting started with Notion Calendar](https://www.notion.com/help/guides/getting-started-with-notion-calendar)
- Notion Mail: o ícone de calendário no compositor (ou `/schedule`) abre um mini Notion Calendar; arrastar marca os horários livres; volta ao compositor com o link gerado; a disponibilidade considera todos os calendários do Notion Calendar. — [Schedule meetings with Notion Mail](https://www.notion.com/en-gb/help/schedule-meetings-with-notion-mail)
- Notion Calendar, fusos: vários fusos com rótulo próprio e troca temporária; o fuso primário vem do Google na configuração inicial e mudanças não voltam ao Google. — [Time zones in Notion Calendar](https://www.notion.com/help/time-zones)
- Notion Calendar, avisos: convite novo e alteração, lembrete de reunião próxima com antecedência e som, notificação do navegador e do desktop; o Google define o lembrete padrão de evento. — [Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings)
- Notion Calendar, recorrência: documentada para calendários Outlook (editar ocorrência ou série). — [Manage calendars & events in Notion Calendar](https://www.notion.com/help/manage-your-calendars-and-events)
- Notion 2026: a release de 2026-04-17 criou uma aba de ajustes para ligar agenda e caixa de entrada; a de 2026-07-01 (Notion 3.6) liga Outlook Mail e Calendar para os agentes acharem horários e marcarem reunião. — [Notion releases 2026-04-17](https://www.notion.com/releases/2026-04-17); [Notion releases 2026-07-01](https://www.notion.com/releases/2026-07-01) (lidos por resumo de busca)

### Inferences
- A camada por fonte (cada calendário e cada database com olho e cor) é o modelo dos 2 para "várias fontes"; o ENSPACE tem 3 fontes fixas e pode tratar cada categoria com data como camada.
- Pessoal e equipe se separam por escopo da view (ClickUp: `Me mode`, `Private view`, nível Space) e por calendário de colega (Notion).

### Gaps
- Recorrência de tarefa dentro do ClickUp Calendar view além de `Show future recurring tasks`: não li o artigo de recorrência.
- Avisos do ClickUp ligados ao calendário: não documentados nas páginas lidas.
- Link de disponibilidade no ClickUp: não achei fonte oficial.

## 5. Reclamações e limitações conhecidas

### Takeaway
As queixas repetidas são sincronia com o Google que falha ou duplica (ClickUp), view lenta e cortada
(ClickUp), e, no Notion, limites do app separado: 20 databases, cerca de 5 calendários, mobile pobre e evento
que nunca vira página.

### Cited Findings
- ClickUp, G2 (2026): Calendar view "could be more refined", itens da agenda às vezes cortados, achar tarefa por projeto ou cliente pede cliques a mais; sincronia com o Google "may need occasional attention". — [G2 Learn, Best calendar app](https://learn.g2.com/best-calendar-app)
- ClickUp, G2: agendamento certo no ClickUp às vezes não se repete no Google; views lentas para carregar. — [G2 ClickUp reviews](https://www.g2.com/products/clickup/reviews?page=10)
- ClickUp, portal de feedback (jan. e fev. de 2026): pedido para a tarefa aparecer e ficar em sincronia no Google; o ClickUp respondeu que os eventos do Google já aparecem no ClickUp, e usuários seguem dizendo que a saída está incompleta e que reuniões para as quais foram convidados só aparecem com o botão de copiar. — [Google Calendar V2 Ideas](https://feedback.clickup.com/feature-requests/p/google-calendar-v2-ideas)
- ClickUp, Canny (cerca de 2 anos atrás, legado): mudança de data que não sincroniza, calendário do Google poluído e tarefa repetida 20 vezes. — [2 way sync for Google Calendar](https://clickup.canny.io/integrations/p/2-way-sync-for-google-calendar)
- ClickUp, portal de feedback (antigo, cerca de 2.500 dias): calendário com poucas tarefas levando 30 a 70 segundos para carregar; pedido de calendário e lista lado a lado para arrastar (hoje atendido pelo painel lateral). — [My Work + Calendar view](https://feedback.clickup.com/feature-requests/p/my-work-calendar-view)
- ClickUp, feedback: pedido de reagendamento automático quando entram reuniões; queixa de que o time blocker ignora as datas já gravadas na tarefa. — [Please add native calendar time blocking and smart auto-rescheduling](https://feedback.clickup.com/feature-requests/p/please-add-native-calendar-time-blocking-and-smart-auto-rescheduling-to-clickup)
- ClickUp: o próprio help center tem roteiro de gravação de trace de performance para o Planner lento. — [What is the Planner?](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner)
- Notion Calendar view: não volta para meses passados rolando; sem visão de dia no desktop. — [Calendar view databases](https://www.notion.com/help/calendars)
- Notion Calendar: acima de 5 calendários a performance cai e o app pode barrar; sem tempo de deslocamento; Focus e Out of office só com Google Workspace. — [Manage calendars & events in Notion Calendar](https://www.notion.com/help/manage-your-calendars-and-events)
- Notion Calendar, mobile: sem busca, sem semana, mês ou agenda (1 a 3 dias), sem links de agendamento, sem páginas anexadas, sem adicionar database, Outlook ainda ausente no mobile. — [2sync, How to use Notion Calendar](https://2sync.com/blog/how-to-use-notion-calendar) (terceiro)
- Notion Calendar nasceu do Cron (comprado em 2022) e foi relançado com o nome atual em janeiro de 2024. — [2sync, How to use Notion Calendar](https://2sync.com/blog/how-to-use-notion-calendar); [Notion releases 2024-01-17](https://www.notion.com/releases/2024-01-17)
- Legado: textos antigos dizem que o Notion Calendar só lia Google e que Outlook estava "a caminho"; o help atual documenta Outlook. — [Notion Calendar overview, Warwick](https://warwick.ac.uk/services/library/using/productivity-tools/notion-calendar); [Manage calendars & events in Notion Calendar](https://www.notion.com/help/manage-your-calendars-and-events)

### Inferences
- A sincronia de saída (tarefa virando evento no Google ou Outlook) concentra as queixas do ClickUp; a sincronia de entrada (eventos externos dentro do sistema) quase não gera queixa.
- No Notion, a integração forte mora num app separado; quem fica só na Calendar view da database não tem grade de horas, eventos externos nem lista de pendências.

### Gaps
- Data exata da entrada do Outlook no Notion Calendar: blogs de terceiros dão janeiro e junho de 2026; não achei a nota oficial ([notiontocalendar.com](https://notiontocalendar.com/blog/notion-calendar-outlook-vs-notion-to-calendar)).
- Threads recentes do Reddit (r/clickup, r/Notion) sobre os calendários: as buscas não devolveram nenhuma.
- Páginas não lidas por inteiro: clickup.com/features/calendar e as notas de release do Notion de 2026 (só por resumo de busca).

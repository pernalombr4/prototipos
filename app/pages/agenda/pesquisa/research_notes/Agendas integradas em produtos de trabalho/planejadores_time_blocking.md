# Planejadores e time blocking: como ferramentas de tarefas juntam tarefa e calendário

Pesquisa feita em 2026-10-28 para o redesenho da Agenda do ENSPACE. Produtos: Asana, Linear, Jira, Motion, Sunsama, Akiflow, Reclaim.ai e Microsoft To Do/Planner no Outlook. Os rótulos de interface ficam no idioma original. Limite da coleta: as páginas oficiais da Asana (help.asana.com) e algumas da Motion voltaram sem corpo ou com redirecionamento; nesses pontos a fonte é um guia de terceiro, marcado como tal.

## 1. Prazo (data sem hora), bloco de trabalho e reunião na mesma grade: faixa de dia inteiro, marcador de prazo, atraso

### Takeaway
Os produtos de gestão de trabalho (Asana, Jira, Linear) tratam a tarefa como um marcador de data: ela fica no dia do prazo, sem hora, e arrastar muda o prazo. Os planejadores (Sunsama, Akiflow, Motion, Reclaim, Outlook com To Do) separam o prazo do tempo planejado: o bloco na grade horária é uma entidade à parte (sessão, timebox, evento) ligada à tarefa, e a tarefa continua na lista do dia.

### Cited Findings
**Asana**
- O Calendar existe na aba do projeto e em My Tasks; em My Tasks mostra todas as tarefas atribuídas à pessoa, em todos os projetos, pelo due date. Se a aba não aparece, a pessoa clica em **+** e adiciona Calendar (guia de terceiro, 2026-06-10) — [Carly, How to Use Calendar View in Asana](https://www.usecarly.com/blog/how-to-use-calendar-view-in-asana/)
- A tarefa aparece só no due date, em grade mensal ou semanal; o guia diz que o Calendar não desenha o intervalo de vários dias e indica a Timeline para isso (terceiro; não confirmado em página oficial) — [Carly](https://www.usecarly.com/blog/how-to-use-calendar-view-in-asana/)
- Clicar num dia cria tarefa com prazo naquele dia; tarefas empilhadas no mesmo dia são o sinal de dia sobrecarregado — [Carly](https://www.usecarly.com/blog/how-to-use-calendar-view-in-asana/)
- Cor das tarefas por campo personalizado, responsável ou projeto; filtro por responsável ou status — [Carly](https://www.usecarly.com/blog/how-to-use-calendar-view-in-asana/)

**Jira**
- O item sem due date não aparece na grade, só na gaveta "Unscheduled work". Arrastar o item muda o due date; arrastar uma das bordas muda só o "Start date" ou só o "Due date", e o item ocupa o intervalo — [Atlassian, Schedule work in your calendar](https://support.atlassian.com/jira-software-cloud/docs/schedule-work-in-your-calendar)
- No Jira Service Management, soltar o item num dia preenche o campo due date com a data; o start date se define abrindo o item ou esticando o item pelos dias — [Atlassian, Use the calendar to view your issues (JSM)](https://support.atlassian.com/jira-service-management-cloud/docs/use-the-calendar-to-view-your-issues)
- Relato da comunidade: o arraste falha quando o campo Start date não está na tela do item — [Atlassian Community, Can't assign unscheduled items to calendar](https://community.atlassian.com/forums/Jira-questions/Jira-Work-Management-Can-t-assign-unscheduled-items-to-calendar/qaq-p/2374672)

**Linear**
- Linear não tem grade de calendário própria nas fontes achadas. O prazo aparece como ícone de calendário na issue, com cor por estado: vermelho quando atrasado, laranja quando vence em até 1 semana, cinza no resto — [Linear Docs, Due dates](https://linear.app/docs/due-dates)
- Filtros de view: Overdue, "1 week from now", "No due date"; ordenação por due date; atalho F e busca "due" — [Linear Docs, Due dates](https://linear.app/docs/due-dates)
- Uma visão mensal por due date existe por integração de terceiro (LinCal), que marca issue atrasada e não planejada e grava o arraste de volta no Linear — [Linear Integrations, LinCal](https://linear.app/integrations/lincal)

**Akiflow**
- 3 destinos conforme o que a tarefa tem: sem data vai para o Inbox ("Call Mike"); com data vai para Today ("Call Mike Today"); com data e hora vai para Today e para o calendário ("Call Mike Today 5 pm") — [Akiflow, Today Page](https://product.akiflow.com/articles/0741055-today-page)
- A tarefa arrastada para o calendário continua na lista Today, na seção "Scheduled on calendar": o bloco e a tarefa convivem — [Akiflow, Today Page](https://product.akiflow.com/articles/0741055-today-page)
- Atraso: a tarefa fica atrasada 1 hora depois do fim do horário agendado (30 min às 13h fica atrasada às 14h30); tarefa planejada para a semana fica atrasada no 1º dia da semana seguinte, conforme "Week starts on". A seção Overdue fica no topo, com selo vermelho tipo "2d ago" — [Akiflow, Today Page](https://product.akiflow.com/articles/0741055-today-page)
- Cartões "Live activity" no pé da página mostram o item de calendário em andamento e os da próxima hora — [Akiflow, Today Page](https://product.akiflow.com/articles/0741055-today-page)

**Motion**
- O agendador considera start date (nunca agenda antes), duration, deadline, priority (ASAP, High, Medium, Low), chunking, schedules (ex.: "Workday 9–5") com pausas, eventos "Busy" como tempo indisponível e recorrência — [Motion Help, What Auto-Scheduling considers](https://www.usemotion.com/help/time-management/auto-scheduling/reference-auto-scheduling/what-auto-scheduling-considers)
- A tarefa que não cabe na janela de agendamento recebe o estado "Could not fit" e fica no topo do calendário — [Motion Help, Task Scheduling FAQ](https://www.usemotion.com/help/project-management/task/task-scheduling-faq)
- Com hard deadline ligado, a tarefa pode ir para fora do horário de trabalho para cumprir o prazo; desligar o hard deadline impede isso — [Motion Help, Task Scheduling FAQ](https://www.usemotion.com/help/project-management/task/task-scheduling-faq)
- ASAP passa por cima dos outros parâmetros e deixa o campo de deadline cinza; a documentação diverge sobre se é o ASAP ou o hard deadline que leva a tarefa para fora do horário — [Motion Help, auto scheduling](https://www.usemotion.com/help/time-management/auto-scheduling)
- Recorrência perdida não se reagenda na mesma semana: vira atrasada, e a próxima ocorrência fica na data original. Evento recorrente é fixo; tarefa recorrente se move dentro da janela — [Motion Help, Task Scheduling FAQ](https://www.usemotion.com/help/project-management/task/task-scheduling-faq)

**Outlook com To Do**
- No Outlook clássico, arrastar a tarefa da To-Do Bar para a visão de dia ou semana cria evento no horário onde a pessoa solta; na visão de mês cria evento de dia inteiro (terceiro) — [Ablebits, How to add tasks to Outlook calendar](https://www.ablebits.com/office-addins-blog/add-tasks-outlook-calendar/)

### Inferences
- Há 2 modelos. No modelo "marcador", a tarefa é o próprio objeto do calendário e mover muda o prazo (Asana, Jira). No modelo "sessão", o bloco é tempo planejado e o prazo fica intacto (Akiflow, Sunsama, Motion, Outlook). Para o ENSPACE, onde o prazo da tarefa vem do SLA do fluxo, arrastar não deveria mudar o prazo sem querer: o modelo "sessão" protege o SLA.
- O prazo sem hora pede um lugar fixo fora da grade horária (faixa do dia ou lista do dia). Nenhuma fonte oficial descreve uma faixa all-day específica para prazos nesses produtos; o padrão observado é a lista do dia ao lado da grade (Akiflow Today, Sunsama).

### Gaps
- Como o Asana desenha due time (tarefa com hora) e start date no Calendar: a página oficial [help.asana.com/s/article/calendar-view](https://help.asana.com/s/article/calendar-view) voltou sem corpo.
- Tratamento visual de atraso no Asana e no Jira Calendar (cor, selo): não achado em fonte oficial.
- Linear: não achei feed iCal nativo nem grade de calendário nativa em late 2026; a busca não confirma nem nega.

## 2. Painel de não agendadas (backlog): conteúdo, filtro, arrastar para a grade, relação entre tempo planejado e prazo

### Takeaway
Todos têm uma coluna lateral com o que ainda não tem lugar na grade. Em Asana e Jira ela guarda o que não tem prazo, e arrastar cria o prazo. Em Akiflow e Sunsama ela guarda o que está planejado para o dia ou a semana sem horário, e arrastar cria a sessão sem mexer no prazo.

### Cited Findings
- Jira: botão "Unscheduled work" no canto superior direito abre uma gaveta à direita com os itens sem due date; busca e "Filter" por Assignee, Priority ou Status; arrastar para o dia define o due date — [Atlassian, Schedule work in your calendar](https://support.atlassian.com/jira-software-cloud/docs/schedule-work-in-your-calendar)
- Asana: tarefas sem due date ficam num painel lateral até a pessoa arrastar para uma data (terceiro) — [Carly](https://www.usecarly.com/blog/how-to-use-calendar-view-in-asana/)
- Akiflow: o Inbox junta o que foi capturado sem data; da lista a pessoa move para Today ou direto para o calendário. O botão "Week", no pé da página Today, mostra quantas tarefas estão planejadas para a semana; aberto, aceita arrastar para Today ou para o calendário, e a tarefa sai da seção Week ao ganhar data — [Akiflow, Today Page](https://product.akiflow.com/articles/0741055-today-page)
- Sunsama: arrastar a tarefa da lista e soltar no calendário cria o timebox; o atalho é hover e tecla `X`, ou botão direito e "Add to calendar". A ajuda manda definir antes a estimativa ou o planned time, para o evento nascer com a duração certa — [Sunsama Help, Timeboxing: the basics](https://help.sunsama.com/docs/getting-started/basics/timeboxing-the-basics)
- Sunsama: sem planned time, o bloco usa "Default duration when scheduling tasks" — [Sunsama Help, Account Settings](https://help.sunsama.com/docs/user-settings)
- Sunsama: a mesma tarefa pode ir para o calendário mais de uma vez (várias sessões); depois de solta, a pessoa ajusta hora e duração com o mouse — [Sunsama Help, Daily Planning: the basics](https://help.sunsama.com/docs/getting-started/basics/daily-planning-the-basics)
- Outlook: Calendar, botão **My Day** na barra do topo, aba **To Do**, arrastar a tarefa para o horário. Resultado: um evento criado a partir da tarefa, para "book time to work on it" — [Microsoft Support, Drag a task to your calendar with To Do in Outlook](https://support.microsoft.com/en-US/Outlook/calendar/drag-a-task-to-your-calendar-with-to-do-in-outlook)
- Outlook na web: o painel My Day abre ao lado para editar a tarefa ou pôr nota depois do arraste — [Microsoft To Do Blog, side-by-side view](https://techcommunity.microsoft.com/t5/microsoft-to-do-blog/stay-organized-in-outlook-web-with-a-side-by-side-view-of-your/ba-p/2594713)
- Reclaim 2.0 (contas criadas depois de maio de 2026): o produto deixou de criar 1 evento por tarefa. Junta tarefas do Reclaim e de integrações (Asana, Todoist, Google Tasks, ClickUp, Linear) e recomenda as "Relevant Now" ou marca as "At Risk" dentro de tempo já protegido (Focus Time, Habit). A pessoa liga uma busca salva de tarefas a um bloco de Focus Time ou Habit, com filtros Source, Keyword, Due date, Project e Label — [Reclaim Help, Reclaim 2.0 Tasks overview](https://help.reclaim.ai/en/articles/16558552-reclaim-2-0-tasks-overview)
- Reclaim 1.0 (legado): o due date é o limite para agendar, com padrão de 3 dias; o Reclaim agenda blocos antes do prazo e os mantém flexíveis até o prazo se aproximar — [Reclaim Help, What are Reclaim Tasks?](https://help.reclaim.ai/en/articles/5108936); [Reclaim, Google Tasks integration](https://reclaim.ai/features/google-tasks-integration)

### Inferences
- O painel lateral filtrável (responsável, prioridade, status) é o padrão comum. No ENSPACE, o filtro natural seria categoria, fluxo, prazo do SLA e processo.
- O Reclaim 2.0 indica o caminho inverso ao de 2024: em vez de encher o calendário com blocos por tarefa, mostrar dentro de um bloco de foco quais tarefas cabem. É um sinal de que 1 bloco por tarefa gera ruído.

### Gaps
- Nenhuma fonte achada descreve um alerta quando a sessão planejada cai depois do prazo da tarefa (Sunsama, Akiflow). O Motion trata isso pelo agendador ("Could not fit", hard deadline).

## 3. Sinais de capacidade: horas planejadas por dia, aviso de excesso, tempo livre entre reuniões

### Takeaway
Só os planejadores medem carga. Sunsama soma o tempo planejado contra um limite diário em horas; Motion e Reclaim usam o tempo livre entre eventos "Busy" como insumo do agendador. Asana e Jira não têm medida de horas no calendário; o sinal é visual (muitas tarefas no mesmo dia).

### Cited Findings
- Sunsama: limite diário de carga em horas, com opção "Custom by day"; quando a soma chega perto ou passa do limite, o número muda de cor e o Sunsama avisa que a pessoa está "overcommitted". Só conta tarefa de contexto "work"; contexto pessoal fica fora — [Sunsama Help, Account Settings](https://help.sunsama.com/docs/user-settings)
- Sunsama: "Planned time recommendations" sugere estimativa pelo histórico; "Count planned time as actual time" usa o planejado como real quando não houve registro — [Sunsama Help, Account Settings](https://help.sunsama.com/docs/user-settings)
- Sunsama: uma linha do tempo de carga ajuda a não assumir mais do que cabe ao adiar tarefas para outros dias (arrastar para outra coluna) — [Sunsama Help, Daily Planning: the basics](https://help.sunsama.com/docs/getting-started/basics/daily-planning-the-basics)
- Motion: evento marcado "Busy" é tempo indisponível; evento "Free" ou calendário fora de "My Calendars" faz a tarefa cair por cima da reunião. Evento de dia inteiro "Busy" pode ser marcado "Free" para liberar tempo — [Motion Help, Task Scheduling FAQ](https://www.usemotion.com/help/project-management/task/task-scheduling-faq)
- Motion: tarefa longa se divide em pedaços (minimum chunk duration) que cabem nas brechas entre eventos — [Motion Help, What Auto-Scheduling considers](https://www.usemotion.com/help/time-management/auto-scheduling/reference-auto-scheduling/what-auto-scheduling-considers)
- Reclaim 2.0: o agente "Defend Meeting Overload" cria Focus Time só quando a carga de reuniões passa de um limite — [Reclaim Help, Reclaim 2.0 Tasks overview](https://help.reclaim.ai/en/articles/16558552-reclaim-2-0-tasks-overview)
- Asana: tarefas empilhadas num dia indicam sobrecarga, sem cálculo de horas (terceiro) — [Carly](https://www.usecarly.com/blog/how-to-use-calendar-view-in-asana/)

### Inferences
- O cálculo de carga depende de estimativa de duração na tarefa. A tarefa do ENSPACE tem prazo e SLA, mas a pesquisa não diz se tem duração estimada; sem esse campo, a medida possível é contagem de tarefas por dia somada ao tempo de reunião.

### Gaps
- Interface exata do número de carga no Sunsama (onde fica, formato): a fonte descreve a regra, não o desenho.
- Akiflow: não achei medida de horas planejadas por dia na página Today.

## 4. Concluir pelo calendário, detalhe em painel lateral, reagendar atrasos em lote (roll over)

### Takeaway
O rollover automático é o padrão dos planejadores: o que não foi feito passa para o dia seguinte e aparece primeiro. O Sunsama deixa a pessoa escolher entre passar tudo sozinho ou escolher item a item. Concluir pelo bloco aparece no Reclaim ("Start Task" e marcar completa); nas outras fontes oficiais lidas, esse gesto não está descrito.

### Cited Findings
- Akiflow: tarefa não concluída no dia passa para o dia seguinte; as atrasadas ficam no topo da Today, na seção Overdue — [Akiflow, Today Page](https://product.akiflow.com/articles/0741055-today-page)
- Akiflow: "Show Done" mostra ou esconde as concluídas e exibe a contagem das concluídas no dia — [Akiflow, Today Page](https://product.akiflow.com/articles/0741055-today-page)
- Akiflow: selecionar várias atrasadas e arrastar para horários da semana seguinte (tutorial de terceiro; não confirmado na ajuda oficial) — [AI Indigo, Getting started with Akiflow](https://aiindigo.com/tutorials/getting-started-with-akiflow-mastering-unified-task-calendar-management)
- Sunsama: "Automatically rollover tasks during evening planning" ligado passa as pendentes para amanhã sozinho; desligado, um aviso pede para escolher quais passam. "Task rollover position" põe as que passaram no topo ou no fim da lista; "Priority rollover" escolhe quais prioridades se mantêm — [Sunsama Help, Account Settings](https://help.sunsama.com/docs/user-settings)
- Sunsama: oferece reagendar sozinho quando há conflito ou quando a tarefa termina antes — [Sunsama Help, Timeboxing: the basics](https://help.sunsama.com/docs/getting-started/basics/timeboxing-the-basics)
- Sunsama: pedido aberto no roadmap para a tarefa concluída mostrar no calendário o tempo real, e não o planejado — [Sunsama Roadmap](https://roadmap.sunsama.com/improvements/p/make-completed-tasks-on-the-calendar-reflect-actual-time-rather-than-planned-tim)
- Reclaim 2.0: "Start Task" mede o tempo; ao parar, a pessoa ajusta o tempo registrado, continua registrando, apaga o registro, marca a tarefa como completa ou escolhe em que calendário o trabalho aparece. As mudanças passam pelo "Preview Mode" (ajustar, descartar ou aplicar) — [Reclaim Help, Reclaim 2.0 Tasks overview](https://help.reclaim.ai/en/articles/16558552-reclaim-2-0-tasks-overview)
- Motion: a tarefa não concluída continua sendo empurrada para a frente no calendário até ser feita (avaliação de usuário) — [Capterra, Motion Reviews](https://www.capterra.com/p/214264/Motion/reviews/)
- Outlook na web: depois de arrastar, o painel My Day ao lado permite editar a tarefa e pôr nota — [Microsoft To Do Blog](https://techcommunity.microsoft.com/t5/microsoft-to-do-blog/stay-organized-in-outlook-web-with-a-side-by-side-view-of-your/ba-p/2594713)

### Inferences
- Para o ENSPACE, o rollover só vale para o tempo planejado (a sessão), nunca para o prazo do SLA: a tarefa atrasada continua atrasada, e o que se move é o horário em que a pessoa pretende fazê-la.

### Gaps
- Concluir tarefa com checkbox direto no bloco do calendário: não descrito nas páginas oficiais lidas de Sunsama, Akiflow, Asana e Outlook.
- Se concluir a tarefa no To Do atualiza ou apaga o evento criado no Outlook: a página da Microsoft não diz.

## 5. Sincronização com Google e Outlook: onde mora o bloco, privacidade (só ocupado), conflitos

### Takeaway
Há 3 níveis. Assinatura iCal só de leitura e com atraso (Asana). Bloco gravado como evento no calendário externo, com escolha de disponibilidade e privacidade (Sunsama, Akiflow). E nada de sincronização (Linear sem nativo; Planner perdeu o feed iCal em 2026).

### Cited Findings
- Asana: Calendar, **···**, **Sync to Calendar**, copiar o link iCal e assinar no Google ("From URL") ou no Outlook ("Subscribe from web"). A sincronização é de mão única; edição feita no calendário externo não volta. O calendário externo atualiza no próprio ritmo e pode atrasar horas (terceiro) — [Carly](https://www.usecarly.com/blog/how-to-use-calendar-view-in-asana/); [Asana Apps, Google Calendar](https://asana.com/es/apps/google-calendar); [TechRepublic, How to sync Asana with Google Calendar](https://www.techrepublic.com/article/asana-sync-google-calendar/)
- Sunsama: o timebox vira evento no calendário interno do Sunsama ou, se a pessoa escolher, num Google, Outlook ou iCloud conectado, pelo botão "Calendar Settings" em "Pick which calendars tasks are scheduled to" — [Sunsama Help, Timeboxing: the basics](https://help.sunsama.com/docs/getting-started/basics/timeboxing-the-basics); [Sunsama Help, Account Settings](https://help.sunsama.com/docs/user-settings)
- Sunsama: disponibilidade "Show as busy" ou "Show as available"; privacidade "Calendar default", "Private" ou "Public". Tarefa de canal privado ou contexto pessoal sai sempre "Private" — [Sunsama Help, Account Settings](https://help.sunsama.com/docs/user-settings)
- Sunsama: com o calendário do Sunsama como padrão, as sessões de trabalho ficam só no Sunsama e não aparecem nos calendários externos — [Sunsama Help, Timeboxing FAQs](https://help.sunsama.com/docs/usage-guides/timeboxing/timeboxing-faqs)
- Akiflow: o bloco criado ao arrastar sincroniza nos 2 sentidos com Google Calendar ou Outlook (resumo de busca a partir da ajuda; não li a página da sincronização) — [Akiflow, Today Page](https://product.akiflow.com/articles/0741055-today-page); [Morgen, Akiflow Review 2026](https://www.morgen.so/blog-posts/akiflow-review)
- Motion: conflito com reunião quando o calendário de origem não está em "My Calendars" ou quando o evento está "Free" — [Motion Help, Task Scheduling FAQ](https://www.usemotion.com/help/project-management/task/task-scheduling-faq)
- Microsoft Planner: entrou no Outlook na web e no novo Outlook para Windows a partir de maio de 2026, ligado por padrão, com tarefas pessoais e planos compartilhados ao lado do e-mail e do calendário — [Message Center MC1309747](https://mc.merill.net/message/MC1309747)
- Microsoft Planner: a reformulação de 2026 retira os feeds iCalendar, e as tarefas do Planner deixam de sincronizar com Outlook, Google e Apple Calendar (imprensa, não documentação da Microsoft) — [Neowin, Planner overhaul cuts iCalendar feeds](https://www.neowin.net/amp/microsoft-planner-major-overhaul-begins-rolling-out-to-users-cuts-icalendar-feeds/)
- Microsoft Planner: desde meados de julho a meados de outubro de 2026, start date e due date deixam de ter ordem obrigatória (o prazo pode cair antes do início) — [Message Center MC1392567](https://mc.merill.net/message/MC1392567)
- Comunidade Microsoft: start e due date das tarefas não aparecem no calendário do plano; as respostas sugerem Power Automate ou complemento de terceiro — [Tech Community, Tasks to calendar](https://techcommunity.microsoft.com/discussions/planner/tasks-to-calendar/4189)
- Reclaim: um usuário relata 300 tarefas criadas pelo Reclaim no Google Calendar que ele não consegue apagar nem no Google nem no Reclaim (avaliação única) — [Google Workspace Marketplace, Reclaim.ai](https://workspace.google.com/marketplace/app/ai_for_google_calendar_reclaimai/950518663892?hl=es)

### Inferences
- Gravar o bloco no Outlook é o que faz o colega ver que a pessoa está ocupada; a escolha "busy" ou "available" e "Private" precisa existir por bloco ou por padrão. No ENSPACE, com dado jurídico, o padrão seguro é "Private" (o título do processo não vai para o Outlook de quem vê a agenda compartilhada).
- O incidente do Reclaim mostra o risco de gravar em massa no calendário externo sem um jeito de desfazer em lote.

### Gaps
- Motion: como as tarefas agendadas aparecem no Google ou Outlook (evento, ocupado ou livre, qual calendário). A página de FAQ não diz.
- Reclaim: regra oficial de "Free" para "Busy" dos blocos de tarefa e hábito. Só achei fonte de baixa qualidade, que não uso.

## 6. Rituais diários e semanais e primeiro uso (estado vazio)

### Takeaway
O Sunsama transforma o planejamento num fluxo guiado de passos, com hora marcada e lembrete; desde 2026 há a versão por agente (beta), que monta o plano e pede revisão. Os outros não têm ritual guiado nas fontes lidas.

### Cited Findings
- Sunsama, ritual clássico: revisão do dia anterior; escolher no que trabalhar; adiar o não essencial; ordenar o trabalho. No fim, timebox opcional ou ordem vertical da lista — [Sunsama, Official daily planning guide](https://sunsama.com/blog/the-official-daily-planning-guide); [Sunsama Help, Daily Planning: the basics](https://help.sunsama.com/docs/getting-started/basics/daily-planning-the-basics)
- Sunsama: em dia cheio de reuniões, a pessoa encaixa tarefas nas brechas do calendário; em dia livre, só ordena a lista — [Sunsama Help, Daily Planning: the basics](https://help.sunsama.com/docs/getting-started/basics/daily-planning-the-basics)
- Sunsama: "When do you plan your day" define quando o aviso de planejamento aparece; "Default channel for rituals tasks" define o canal das tarefas de planejamento, encerramento e revisão — [Sunsama Help, Account Settings](https://help.sunsama.com/docs/user-settings)
- Sunsama, primeiro uso: o fluxo guiado roda 1 vez e se repete na hora de planejamento dos 2 dias seguintes — [Sunsama Help, Setting Up Your Sunsama Account](https://help.sunsama.com/docs/setting-up-your-sunsama)
- Sunsama, planejamento por agente (beta, 2026): Settings > Beta, "Agentic Daily Planning"; tecla P ou "Daily planning" em "Daily rituals"; no 1º uso a configuração pede ligar ferramentas, descrever o trabalho e dar um tema a cada dia da semana; a pessoa escreve o foco e o que atrapalha, clica "Plan my day" (2 a 4 minutos; o menu mostra "Ready"); revisa em "Review Plan" as ações por dia (mais = tarefa criada, seta = tarefa movida) e as "judgement calls" (manter, mover para hoje, descartar, ou "Keep the agent's plan for all"); pode "Undo", "Undo all" ou "Re-plan"; "Next" abre o "Daily plan", com opção de compartilhar no Slack ou Teams, e "Get started" — [Sunsama Help, Daily Planning](https://help.sunsama.com/docs/daily-planning)
- Reclaim 2.0: mudanças de agenda pedidas no Reclaim Chat aparecem primeiro no "Preview Mode" — [Reclaim Help, Reclaim 2.0 Tasks overview](https://help.reclaim.ai/en/articles/16558552-reclaim-2-0-tasks-overview)

### Inferences
- O padrão "proposta, revisão, aplicar ou desfazer" (Sunsama agente, Reclaim Preview Mode, Motion via "Could not fit") é a resposta a quem não confia em agendamento automático. Para o ENSPACE, um "planejar meu dia" que proponha horários para as tarefas com prazo próximo e peça confirmação segue esse padrão.

### Gaps
- Estado vazio (sem tarefas, sem calendário ligado) de Akiflow, Motion, Asana e Jira: não achei descrição em fonte oficial.
- Ritual semanal do Sunsama: a página oficial lida só cita o link para "Weekly Planning".

## 7. Queixas e limites conhecidos

### Takeaway
As queixas se repetem por modelo. Agendamento automático: perda de controle e tarefa por cima de reunião. Ritual manual: cansaço do ritual e falta de automação. Gestão de trabalho: calendário que só lê o prazo e sincronização de mão única.

### Cited Findings
- Motion: usuário relata em junho de 2026 tarefas agendadas por cima de eventos já "busy", e que vigiar o agendador anula o propósito (citação via agregador) — [Saner.ai, Motion Reviews 2026](https://blog.saner.ai/motion-reviews)
- Motion: agendamento automático rígido para mudanças de última hora (avaliação) — [Capterra, Motion Reviews](https://www.capterra.com/p/214264/Motion/reviews/)
- Motion: queixas mais frequentes de onboarding difícil, interface carregada, app móvel fraco e preço (agregador com interesse comercial) — [Saner.ai, Motion Reviews 2026](https://blog.saner.ai/motion-reviews)
- Sunsama: o planejamento manual é o produto e o limite; usuários relatam abandonar porque o ritual vira tarefa; sessão matinal de 10 a 15 minutos; falta de agendamento automático (agregadores) — [Saner.ai, Sunsama Reviews 2026](https://blog.saner.ai/sunsama-reviews); [Saner.ai, Sunsama vs Motion](https://blog.saner.ai/sunsama-vs-motion)
- Sunsama: o bloco concluído mostra o tempo planejado, não o real (pedido no roadmap) — [Sunsama Roadmap](https://roadmap.sunsama.com/improvements/p/make-completed-tasks-on-the-calendar-reflect-actual-time-rather-than-planned-tim)
- Asana: tarefa sem data não aparece; tarefa de vários dias aparece só no prazo; sincronização nativa só de leitura e de mão única (terceiro que vende integração própria) — [Carly](https://www.usecarly.com/blog/how-to-use-calendar-view-in-asana/)
- Jira: a página do Jira Work Management diz que item sem due date não aparece, o que contradiz a gaveta Unscheduled work (provável versão antiga) — [Atlassian, What is the calendar? (JWM)](https://support.atlassian.com/jira-work-management/docs/using-the-calendar/); comparar com [Schedule work in your calendar](https://support.atlassian.com/jira-software-cloud/docs/schedule-work-in-your-calendar)
- Planner: perda do feed iCal na reformulação de 2026 e problemas relatados no redesenho — [Neowin](https://www.neowin.net/amp/microsoft-planner-major-overhaul-begins-rolling-out-to-users-cuts-icalendar-feeds/); [Neowin, Planner refresh issues](https://www.neowin.net/amp/microsoft-refreshes-planner-with-new-design-and-features/)
- Reclaim: blocos criados em massa que o usuário não consegue apagar (1 avaliação) — [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/ai_for_google_calendar_reclaimai/950518663892?hl=es)

### Inferences
- A queixa do ENSPACE ("é igual abrir o calendário da Microsoft fora do sistema") corresponde ao nível iCal da Asana: o calendário só mostra o que já existe. O que os planejadores acrescentam e o Outlook sozinho não tem: a lista do que falta planejar ao lado da grade, o arraste que cria tempo planejado sem mudar o prazo, a soma de horas contra um limite, a passagem automática do não feito e o atraso no topo.

### Gaps
- Reclamações sobre culpa ou ansiedade com rollover e atraso: não achei fonte direta; os agregadores não citam threads verificáveis.
- Fontes de avaliação usadas aqui (Saner.ai, Carly, Morgen) têm interesse comercial; os pontos delas estão marcados como terceiro.

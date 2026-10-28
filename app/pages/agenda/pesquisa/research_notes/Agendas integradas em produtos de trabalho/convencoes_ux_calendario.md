# Convenções de interface e usabilidade de calendários (linha de base para a Agenda do ENSPACE)

Pesquisa feita em 2026-10-28. Fontes primárias: ajuda oficial do Google Calendar, do Outlook (novo Outlook e Outlook na web), do Apple Calendar, do Fantastical e do Notion Calendar; site do Vimcal; WAI-ARIA APG; WCAG 2.2; Atlassian Design System; Nielsen Norman Group. Rótulos de interface ficam no idioma original do produto. Só padrões de interação; nenhuma identidade de marca.

Limites desta coleta, para quem escreve o relatório:
- As páginas do Material 3 (m3.material.io) e do Fluent 2 (fluent2.microsoft.design) carregam por JavaScript e não abriram; o que aparece delas aqui vem de fonte secundária e está marcado.
- Não achei artigo da NN/g nem da Baymard específico sobre a grade de calendário (vista semana ou mês). A NN/g aparece só pelo artigo geral de modal × não modal.
- Várias afirmações sobre aparência (cor da linha do agora, visual da tarefa no Google) só têm fonte secundária ou antiga e estão marcadas como tal.

## 1. Layout: barra do topo, barra lateral, painel de detalhe, vista padrão, início da semana, horário de trabalho, linha do agora

### Takeaway
O padrão comum aos 5 produtos é: no topo, o botão Today, as setas de anterior e próximo, o rótulo do período e o seletor de vista (Day, Week, Month, às vezes Year, Schedule ou N dias); na lateral esquerda, um mini calendário e a lista de calendários com caixa de seleção colorida. A vista escolhida vira a padrão, o início da semana se escolhe nas configurações, e fim de semana e escala de horas se ligam e desligam.

### Cited Findings
**Barra do topo e navegação**
- Google Calendar: o seletor de vista fica no canto superior direito, com Day, Week, Month, Year, Schedule e 4 days — [Google Calendar Help, View your day, week, or month](https://support.google.com/calendar/answer/6110849?hl=en&co=GENIE.Platform%3DDesktop)
- Google Calendar: as setas no canto superior esquerdo andam para o período anterior ou o próximo; o botão Today, também no canto superior esquerdo, volta para hoje — [Google Calendar Help, answer 6110849](https://support.google.com/calendar/answer/6110849?hl=en&co=GENIE.Platform%3DDesktop)
- Google Calendar: o mini calendário do canto superior esquerdo leva a uma data específica — [Google Calendar Help, answer 6110849](https://support.google.com/calendar/answer/6110849?hl=en&co=GENIE.Platform%3DDesktop)
- Google Calendar: a vista escolhida passa a ser a padrão até a pessoa trocar ("After you choose a new view, it becomes your default view until you change it") — [Google Calendar Help, answer 6110849](https://support.google.com/calendar/answer/6110849?hl=en&co=GENIE.Platform%3DDesktop)
- Novo Outlook para Windows: as vistas são Day, Work Week, Full Week, Month e Three-day; o Outlook na web tem Day, Work Week, Full Week e Month (lista tirada da tabela de atalhos) — [Microsoft Support, Keyboard shortcuts for Outlook](https://support.microsoft.com/en-us/office/keyboard-shortcuts-for-outlook-3cdeb221-7ae5-4c1d-8c1d-9e63216c1efd)
- Apple Calendar (Mac): 4 vistas, Day, Week, Month e Year; existe comando "Go to today" e "Go to a specific date" — [Apple Support, Calendar keyboard shortcuts](https://support.apple.com/guide/calendar/keyboard-shortcuts-ical002/mac)
- Fantastical (Mac): a janela completa tem vistas day, week, month, quarter e year — [Flexibits, Calendar Views](https://flexibits.com/fantastical/help/calendar-views)
- Notion Calendar: o número de dias exibidos se ajusta pelo controle "±" ao lado da última data mostrada, com "-" e "+"; no celular, escolhe-se 1, 2 ou 3 dias no menu da lateral — [Notion Help, Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings)

**Barra lateral esquerda**
- Google Calendar: a lateral tem "My calendars" (calendários da pessoa) e "Other calendars" (calendários compartilhados de pessoas, salas ou grupos) — [Google Calendar Help, answer 6110849](https://support.google.com/calendar/answer/6110849?hl=en&co=GENIE.Platform%3DDesktop)
- Google Calendar: as tarefas são um calendário da lista "My calendars"; desmarcar a caixa "Tasks" esconde todas as tarefas da grade — [Google Calendar Help, Create & manage tasks](https://support.google.com/calendar/answer/9901136?hl=en)
- Apple Calendar: a lista de calendários tem caixas de seleção; Space liga ou desliga o calendário selecionado, Command-clique liga ou desliga todos, Option-Command-clique mostra só aquele calendário — [Apple Support, Calendar keyboard shortcuts](https://support.apple.com/guide/calendar/keyboard-shortcuts-ical002/mac)
- Apple Calendar: a captura de tela da ajuda mostra a vista Month com os calendários coloridos listados na lateral, agrupados pela conta — [Apple Support, Change how you view events](https://support.apple.com/guide/calendar/change-how-you-view-events-icl1017/mac)
- Fantastical: a lateral da janela completa mostra um mini calendário do mês e um resumo dos eventos da vista atual — [Flexibits, Calendar Views](https://flexibits.com/fantastical/help/calendar-views)
- Outlook na web e novo Outlook: com mais de 1 calendário marcado no painel esquerdo, aparece o botão Split view, que mostra os calendários lado a lado; desligado, os calendários se sobrepõem numa grade só (overlay). Fonte secundária: blog e fórum Microsoft Q&A — [Microsoft Q&A, calendar overlay split view](https://learn.microsoft.com/en-us/answers/questions/5883319/calendar-overlay-split-view); [Ablebits, Outlook calendar view](https://www.ablebits.com/office-addins-blog/outlook-calendar-view/)
- Google Calendar: a vista lado a lado de calendários não funciona em Week nem em Month ("The side-by-side calendars won't work for the week or month view") — [Google Calendar Help, answer 6110849](https://support.google.com/calendar/answer/6110849?hl=en&co=GENIE.Platform%3DDesktop)

**Painel do lado direito**
- Google Calendar: um painel lateral abre pelo botão do canto inferior direito e dá acesso a Tasks — [Google Calendar Help, answer 9901136](https://support.google.com/calendar/answer/9901136?hl=en)
- Apple Calendar: o detalhe do evento abre num inspector (Command-I mostra as informações; Option-Command-I edita na janela do inspector); existe um painel Availability que abre com Shift-Command-A — [Apple Support, Calendar keyboard shortcuts](https://support.apple.com/guide/calendar/keyboard-shortcuts-ical002/mac)

**Início da semana, fim de semana, escala e densidade**
- Google Calendar: em Settings > View options escolhe-se o dia em que a semana começa, monta-se uma vista personalizada e liga-se um calendário alternativo; a mudança grava sozinha — [Google Calendar Help, answer 6110849](https://support.google.com/calendar/answer/6110849?hl=en&co=GENIE.Platform%3DDesktop)
- Google Calendar: as opções de início são sábado, domingo ou segunda; o padrão é domingo. Fonte secundária — [MakeUseOf, change first day of week](https://www.makeuseof.com/change-first-day-of-week-google-calendar/)
- Google Calendar: desmarcar "Show weekends" deixa só de segunda a sexta. Fonte secundária — [SlashGear, hidden Google Calendar features](https://www.slashgear.com/1989925/hidden-google-calendar-features-need-to-try-using/)
- Notion Calendar: em General escolhe-se o dia de início da semana; em General > Calendar view liga-se ou desliga-se o fim de semana e a exibição de eventos recusados (declined) — [Notion Help, Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings)
- Notion Calendar: no desktop, View > Zoom Hours In/Out muda a altura das horas (densidade da grade) — [Notion Help, Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings)
- Outlook: a escala da grade (time scale) fica em Calendar > View > Time scale no novo Outlook; os intervalos mais comuns são 15 e 30 minutos, e há também 5, 6, 10 e 60 — [Microsoft Support, Change the calendar time scale in Outlook](https://support.microsoft.com/en-US/outlook/calendar/change-the-calendar-time-scale-in-outlook)
- Outlook: horário de trabalho (working hours) é uma configuração separada da escala; ele diz aos outros quando marcar reunião. Fonte secundária — [Microsoft Support, time scale](https://support.microsoft.com/en-US/outlook/calendar/change-the-calendar-time-scale-in-outlook) (a afirmação sobre working hours veio do resumo da busca, não confirmada na página)
- Google Calendar: o horário de trabalho fica em Settings > General > Working hours, com a opção de avisar quem convida fora desse horário. Fonte secundária — [Wellesley LTS, Working Hours](https://www1.wellesley.edu/lts/techsupport/google/gappscalendar/workhours)
- Google Calendar: há a opção de deixar os eventos passados com cores mais apagadas; e uma opção de densidade ("Density and color" > "Data density" > "Compact"). Fonte secundária, 1 blog cada — [SlashGear](https://www.slashgear.com/1989925/hidden-google-calendar-features-need-to-try-using/)
- Fantastical: nas configurações escolhe-se quantas semanas a vista Month mostra e se aparecem números de semana. Fonte secundária — [Flexibits, Fantastical iOS settings](https://flexibits.com/fantastical-ios/help/settings)

**Linha do agora**
- Google Calendar: a linha da hora atual aparece nas vistas Day e Week; anunciada em 2007 com a opção "Show current time". Fonte antiga — [Google Workspace Updates, 2007](https://workspaceupdates.googleblog.com/2007/06/google-calendar-adds-current-time-line.html?hl=en)
- Calendários de terceiros que sincronizam com o Google têm relatos de linha do agora atrasada até 30 minutos ou parada — [Mozilla Support, red line does not move](https://support.mozilla.org/de/questions/1309481); [Week Plan, time 30 minutes off](https://support.weekplan.net/en/communities/1/topics/7239-time-on-calendar-is-30-minutes-off)

**Tema**
- Notion Calendar: General > Theme oferece Auto, Light mode e Dark mode — [Notion Help, Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings)

### Inferences
- A barra do topo com 4 peças (Today, anterior/próximo, rótulo do período, seletor de vista) e a lateral com mini calendário mais lista de calendários com caixa colorida é o mínimo comum; quem usa Outlook ou Google espera achar cada peça nesse lugar.
- Lembrar a última vista escolhida (Google) evita que a pessoa refaça a escolha a cada visita.
- A lista de "camadas" com caixa de seleção é o lugar onde o produto separa tipos (o Google trata Tasks como um calendário da lista). Para o ENSPACE, cada categoria ou tipo de compromisso pode virar uma linha dessa lista.
- Início da semana configurável é obrigatório para o público brasileiro: o padrão do Google é domingo, mas a pessoa troca.
- A linha do agora precisa se atualizar sozinha; o relato de linha parada em outros produtos mostra que o erro existe e é notado.

### Gaps
- Rolagem automática para o horário de trabalho ao abrir a vista Week: nenhuma fonte oficial encontrada descreve esse comportamento em nenhum dos produtos.
- Destaque visual do horário de trabalho na grade (faixa mais clara fora do expediente): sem fonte oficial; só uma extensão de terceiros para o Google ([GCal WorkShade, Chrome Web Store](https://chromewebstore.google.com/detail/gcal-workshade/fakdcpoalljmfmdbkefbbmblpmmafjan)), o que sugere que o Google não faz isso por padrão, sem prova.
- Caminho atual do working hours no novo Outlook: não confirmado em página da Microsoft.
- Painel de detalhe à direita do novo Outlook (quando o evento abre em painel, popover ou janela): sem fonte oficial coletada.

## 2. Exibição dos eventos: faixa de dia inteiro, sobreposição, eventos de vários dias, excesso no mês ("+3 more"), densidade, cor e legenda, modo escuro, tarefa × reunião

### Takeaway
As fontes oficiais confirmam a faixa "All day" (o Google põe nela o prazo de tarefa; o Notion deixa recolher) e a separação de tarefa por calendário próprio com ícone de concluir. O excesso no mês ("+N more" com popover) e o evento de vários dias como barra contínua são padrão de mercado documentado só em fonte secundária.

### Cited Findings
**Faixa de dia inteiro**
- Google Calendar: o prazo (deadline) de uma tarefa aparece na seção "All day"; tarefa sem data não aparece no calendário — [Google Calendar Help, answer 9901136](https://support.google.com/calendar/answer/9901136?hl=en)
- Notion Calendar: a seção de dia inteiro recolhe e expande pelas 2 setas da coluna de fuso, ou por ctrl/⌘ + K > "Collapse all-day section" / "Expand all-day section" — [Notion Help, Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings)

**Tarefa × evento**
- Google Calendar: uma tarefa com data e hora de início pode ocupar um intervalo na grade; conclui-se a tarefa pelo ícone Complete à esquerda do nome e depois "Mark completed" — [Google Calendar Help, answer 9901136](https://support.google.com/calendar/answer/9901136?hl=en)
- Google Calendar: tarefas concluídas se escondem desmarcando "Show completed tasks" no menu do seletor de vista — [Google Calendar Help, answer 9901136](https://support.google.com/calendar/answer/9901136?hl=en)
- Google Calendar: guias de terceiros descrevem a tarefa com um ícone de caixa ou de visto, mais leve que o evento comum. Fonte secundária, não confirmada na ajuda do Google — [Qualtir, Google Calendar tasks guide](https://qualtir.com/blog/google-calendar-tasks-guide); [2sync, tasks in Google Calendar](https://2sync.com/blog/tasks-in-google-calendar)
- Fantastical: o item novo é evento por padrão; vira tarefa pelo seletor no canto superior direito da área de criação, ou começando o texto com "reminder", "todo", "task" ou "√"; pontos de exclamação no fim aumentam a prioridade — [Flexibits, Adding events and tasks](https://flexibits.com/fantastical/help/adding-events-and-tasks)
- Apple Calendar: a captura de tela da vista Day mostra eventos, um lembrete agendado e uma área à direita para adicionar lembretes — [Apple Support, Change how you view events](https://support.apple.com/guide/calendar/change-how-you-view-events-icl1017/mac)

**Estado de disponibilidade por símbolo, além da cor**
- Fantastical: o estado de disponibilidade tem símbolo próprio: ponto cheio (ocupado), círculo (livre), sinal de proibido (indisponível), círculo pontilhado (talvez disponível) — [Flexibits, Calendar Views](https://flexibits.com/fantastical/help/calendar-views)

**Excesso na vista mês e eventos de vários dias (fonte secundária)**
- O padrão mais usado mostra 2 a 3 eventos por dia e um indicador "+N more"; o clique abre um popover ou expande a célula — [Muzli, Calendar UI inspiration 2026](https://muz.li/inspiration/calendar/)
- O FullCalendar recolhe o excesso num link "+ more" que abre um popover com todos os eventos do dia — [Medium, FullCalendar React](https://medium.com/@sehaj23chawla/fullcalendar-react-elevate-your-scheduling-ui-with-views-modes-and-popovers-897661b92419)
- Excesso não pode sumir sem aviso: mostra-se a contagem explícita que abre o dia inteiro; na vista semana, eventos sobrepostos ficam todos visíveis, lado a lado ou empilhados com controle de excesso explícito — [skills.sh, UX patterns: calendar](https://skills.sh/thedaviddias/ux-patterns-for-developers/calendar)
- Problema relatado num redesenho: o "+1 more" esconde um item pendente, e a proposta passa despercebida — [GitHub, biddaloy issue 1406](https://github.com/tareq89/biddaloy/issues/1406)
- Evento de vários dias repetido como chip separado em cada dia é defeito; o certo é 1 barra contínua na linha da semana, que retoma no começo da linha seguinte com as pontas marcadas para mostrar que continua — [GitHub, biddaloy issue 1406](https://github.com/tareq89/biddaloy/issues/1406)
- Na célula do mês, a barra do evento pode cobrir o número do dia e o destaque de hoje; a correção proposta reserva o canto superior direito para o número, o espaço abaixo para as barras e, abaixo delas, o indicador de excesso — [GitHub, nodus issue 1019](https://github.com/Drakonis96/nodus/issues/1019)
- Fantastical (versão antiga, iPhone): a vista mês mostra pontos coloridos em vez de títulos. Comentário de fórum — [Mac Power Users forum](https://talk.macpowerusers.com/t/fantastical-justification/8704)

### Inferences
- Para o ENSPACE, tarefa com prazo e compromisso com hora pedem 2 tratamentos: o prazo vai para a faixa de dia inteiro (como o Google faz com a tarefa) e o compromisso ocupa o intervalo da grade. A tarefa leva um sinal de concluir na própria linha.
- O símbolo junto da cor (como o Fantastical faz com disponibilidade) é o jeito de não depender só de cor para dizer o estado.
- "+N more" deve abrir a lista completa do dia sem trocar de tela, e item com ação pendente não deve ficar escondido atrás do excesso.
- Faixa de dia inteiro recolhível (Notion) evita que dias com muitos prazos empurrem a grade de horas para baixo.

### Gaps
- Algoritmo de sobreposição na vista semana (colunas lado a lado, cascata, largura mínima) dos produtos citados: sem documentação oficial.
- Contraste de cor do evento no modo escuro (como os produtos clareiam ou escurecem a cor do calendário): nenhuma fonte achada.
- Conjuntos de cor do Google ("Modern" e "Classic") e legenda: a busca não trouxe fonte.
- Quantos eventos a célula do mês mostra antes do "+N more" no Google, Outlook e Apple: sem fonte oficial.
- Visual exato da tarefa no Google (forma, cor, ícone): a ajuda oficial não descreve.

## 3. Interação: clicar no espaço vazio, criação rápida e formulário completo, arrastar, atalhos, desfazer, linguagem natural, paleta de comandos, ir para data

### Takeaway
Criar clicando no espaço vazio e abrir um campo rápido com opção de formulário completo é o padrão do Google; arrastar para baixo define a duração. Os atalhos convergem: t ou Today para hoje, letras ou números para vista, c ou N para criar, g ou Shift-Command-T para ir a uma data, z para desfazer. Linguagem natural é o diferencial do Fantastical e do Vimcal; paleta ⌘K é do Notion Calendar.

### Cited Findings
**Criar evento**
- Google Calendar: clicar num horário sem evento ("Click any time on the calendar that doesn't already have an event scheduled"), digitar título e detalhes, salvar — [Google Calendar Help, Create an event](https://support.google.com/calendar/answer/72143?hl=en)
- Google Calendar: o campo rápido mostra "Add title and time" e cria o evento no horário digitado — [Google Calendar Help, answer 72143](https://support.google.com/calendar/answer/72143?hl=en)
- Google Calendar: para evento mais longo, arrasta-se o mouse para baixo enquanto se escolhe o horário — [Google Calendar Help, answer 72143](https://support.google.com/calendar/answer/72143?hl=en)
- Google Calendar: o caminho para o formulário completo é Create > Create event > More options — [Google Calendar Help, Create events in different time zones](https://support.google.com/calendar/answer/37064?hl=en)
- Google Calendar: o mesmo clique no espaço vazio cria tarefa escolhendo "Task" no quadro de criação — [Google Calendar Help, answer 9901136](https://support.google.com/calendar/answer/9901136?hl=en)
- Google Calendar: Shift + C cria evento rápido em qualquer vista — [Google Calendar Help, answer 72143](https://support.google.com/calendar/answer/72143?hl=en)

**Linguagem natural**
- Fantastical: digita-se o evento como se fala ("Soccer practice every Tuesday with John at 6pm"); "/" e o nome escolhem o calendário, "with" chama convidados, "at" o local, a frase de alerta ("alert 30 minutes") cria aviso; texto entre aspas não é interpretado — [Flexibits, Adding events and tasks](https://flexibits.com/fantastical/help/adding-events-and-tasks)
- Fantastical: enquanto se digita, a prévia do evento aparece e pode ser arrastada para outro dia ou hora, e os detalhes se atualizam — [Flexibits, Adding events and tasks](https://flexibits.com/fantastical/help/adding-events-and-tasks)
- Fantastical: qualquer evento ou tarefa pode ser salvo como modelo — [Flexibits, Adding events and tasks](https://flexibits.com/fantastical/help/adding-events-and-tasks)
- Vimcal: "just type it, and it's scheduled"; promete resposta abaixo de 100 ms e atalho para tudo, sem listar as teclas no site — [Vimcal](https://vimcal.com/)
- Vimcal: "Time Travel" mostra a sobreposição de horário de trabalho entre fusos — [Vimcal](https://vimcal.com/)

**Atalhos de teclado (comparação)**

| Ação | Google Calendar | Outlook na web | Novo Outlook (Windows) | Apple Calendar (Mac) |
|---|---|---|---|---|
| Hoje | t | Alt+Shift+Y | Alt+Shift+Y ou Home | Command-T |
| Próximo período | j ou n | Shift+→ | Ctrl+Alt+→ (dia) | Command-→ |
| Período anterior | não confirmado (ver Gaps) | Shift+← | Ctrl+Alt+← (dia) | Command-← |
| Vista dia | 1 ou d | Shift+Alt+1 | Ctrl+Alt+1 | Command-1 |
| Vista semana | 2 ou w | Shift+Alt+3 (Full Week) | Ctrl+Alt+2 ou Alt+- | Command-2 |
| Vista mês | 3 ou m | Shift+Alt+4 | Ctrl+Alt+4 ou Alt+= | Command-3 |
| Criar | c | N | Ctrl+N | Command-N |
| Ir para data | g | não listado | não listado | Shift-Command-T |
| Desfazer | z | não listado | não listado | não listado |
| Buscar | / | não listado | não listado | Command-F |

Fontes da tabela: [Google Calendar Help, Keyboard shortcuts](https://support.google.com/calendar/answer/37034?hl=en); [Microsoft Support, Keyboard shortcuts for Outlook](https://support.microsoft.com/en-us/office/keyboard-shortcuts-for-outlook-3cdeb221-7ae5-4c1d-8c1d-9e63216c1efd); [Apple Support, Calendar keyboard shortcuts](https://support.apple.com/guide/calendar/keyboard-shortcuts-ical002/mac)

- Google Calendar: os atalhos só funcionam depois de ligar "Enable keyboard shortcuts" em Settings; outros atalhos: 4 ou x (vista personalizada), 5 ou a (Agenda), e (detalhe do evento), Backspace ou Delete (apagar), Ctrl/Cmd + s (salvar no detalhe), Esc (voltar do detalhe para a grade), r (atualizar), s (Settings) — [Google Calendar Help, answer 37034](https://support.google.com/calendar/answer/37034?hl=en)
- Outlook: no Outlook na web os atalhos valem quando o conjunto "Outlook" está escolhido em Settings; F6 ou Ctrl+Shift+Tab (novo Outlook) e Ctrl+F6 (web) passam entre as regiões do calendário. A página da Microsoft dá Ctrl+Alt+2 para Work Week e para Full Week no novo Outlook, provável erro da página — [Microsoft Support, answer 3cdeb221](https://support.microsoft.com/en-us/office/keyboard-shortcuts-for-outlook-3cdeb221-7ae5-4c1d-8c1d-9e63216c1efd)
- Apple Calendar: com um evento selecionado, Control-Option-↑/↓ move 15 minutos na vista dia ou semana; Control-Option-←/→ move 1 dia; Tab e Shift-Tab passam de um evento para o seguinte; Command-+ e Command-- aumentam e diminuem o texto — [Apple Support, answer ical002](https://support.apple.com/guide/calendar/keyboard-shortcuts-ical002/mac)
- Notion Calendar: "?" abre a lista pesquisável de todos os atalhos; atalhos globais (mostrar a barra de menu, entrar na reunião) ficam em Settings > Menu bar > System-wide keyboard shortcuts — [Notion Help, Notion Calendar keyboard shortcuts](https://www.notion.com/help/notion-calendar-keyboard-shortcuts)
- Notion Calendar: ⌘/Ctrl + K abre o menu de comandos, com comandos como "Collapse all-day section" — [Notion Help, Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings); um site brasileiro diz que o menu dá acesso a quase toda ação pelo teclado. Fonte secundária — [Showmetech, guia do Notion Calendar](https://www.showmetech.com.br/notion-calendar-guia-completo/)

**Ir para data**
- Google: tecla g ou o mini calendário — [Google Calendar Help, answer 37034](https://support.google.com/calendar/answer/37034?hl=en); [answer 6110849](https://support.google.com/calendar/answer/6110849?hl=en&co=GENIE.Platform%3DDesktop)
- Apple: Shift-Command-T — [Apple Support, answer ical002](https://support.apple.com/guide/calendar/keyboard-shortcuts-ical002/mac)

### Inferences
- A criação em 2 tempos (campo rápido no lugar do clique, "More options" para o formulário completo) mantém a grade visível no caso comum; só quem precisa de mais campos sai da grade.
- Quem vem do Google espera arrastar para baixo para definir a duração.
- Atalho de 1 letra (t, d, w, m, c, g, z) só com opção de ligar, como o Google faz, para não atrapalhar quem digita em campo de formulário. "?" abrindo a lista de atalhos é convenção (Notion; e o Google também usa "?", ver Gaps).
- Desfazer (z no Google) é a rede de proteção contra arrastar ou apagar sem querer; o produto do ENSPACE deveria oferecer desfazer depois de mover ou apagar.
- Para um produto em português, linguagem natural exige interpretar datas e horas em pt-BR; é diferencial, não linha de base.

### Gaps
- Tecla do período anterior no Google: a página de atalhos coletada lista só j/n para o próximo; k/p para o anterior e "?" para a lista de atalhos são de conhecimento prévio, não confirmados na resposta obtida.
- Toast de desfazer com botão "Undo" depois de mover ou apagar: sem fonte oficial coletada (só o atalho z do Google).
- Arrastar para mover e redimensionar evento existente: nenhuma ajuda oficial coletada descreve; o Apple Calendar documenta o equivalente pelo teclado.
- Atalhos específicos do Vimcal e do Notion Calendar (j/k, t, c): os sites oficiais não listam na página aberta.
- Linguagem natural no Google Calendar (o campo "Add title and time" interpreta hora): a ajuda diz só que cria no horário digitado.

## 4. Problemas comuns de usabilidade

### Takeaway
As fontes mostram 4 armadilhas documentadas: modal que tira o contexto da grade, excesso que esconde item sem aviso, evento de vários dias quebrado em pedaços e alvo de toque pequeno. Excesso de cor, legenda confusa, estado vazio e configuração antes do valor não têm fonte específica de calendário nesta coleta.

### Cited Findings
- Modal interrompe, faz a pessoa perder o fio da tarefa, cobre a informação necessária para responder e aumenta o custo da interação; use não modal quando a pessoa precisa consultar o conteúdo principal enquanto age — [NN/g, Modal & Nonmodal Dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/)
- Modal se justifica para aviso de erro irreversível, informação essencial para terminar um processo e tarefa curta que não exige consultar outro conteúdo; no celular, o não modal pode virar modal e precisa de teste — [NN/g, Modal & Nonmodal Dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/)
- Excesso no mês que some sem contagem esconde eventos; a contagem explícita precisa abrir o dia — [skills.sh, UX patterns: calendar](https://skills.sh/thedaviddias/ux-patterns-for-developers/calendar)
- "+1 more" escondendo item pendente faz a pessoa perder a proposta — [GitHub, biddaloy issue 1406](https://github.com/tareq89/biddaloy/issues/1406)
- Evento de vários dias repetido como chip em cada dia não se lê como 1 intervalo — [GitHub, biddaloy issue 1406](https://github.com/tareq89/biddaloy/issues/1406)
- Barra de evento cobrindo o número do dia e o destaque de hoje; indicador de excesso sobreposto ao último evento — [GitHub, nodus issue 1019](https://github.com/Drakonis96/nodus/issues/1019)
- Planeje os estados de dado desde o começo: vazio, parcial, desatualizado e com falha — [skills.sh, UX patterns: calendar](https://skills.sh/thedaviddias/ux-patterns-for-developers/calendar)
- Alvo de ponteiro: mínimo de 24 × 24 px CSS (WCAG 2.2, 2.5.8, nível AA); alvo menor passa se um círculo de 24 px centrado nele não encosta em outro alvo; o critério AAA (2.5.5) pede 44 × 44 — [W3C, Understanding SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Atlassian: data desabilitada precisa do motivo escrito no texto em volta (quais datas estão disponíveis e por quê) — [Atlassian Design System, Calendar usage](https://atlassian.design/components/calendar/usage)
- Busca em calendário: estudo da UCL achou a lista mais rápida que a grade para procurar datas, quebras de mês e o mês seguinte; a grade foi mais rápida para procurar dias da semana, e destacar os dias na lista anulou a diferença — [UCL Discovery, estudo grade × lista](https://discovery.ucl.ac.uk/id/eprint/1408077/1/Revised%20Aug%202013.pdf)

### Inferences
- O detalhe do evento em popover ou painel lateral, não em modal de tela cheia, segue a NN/g: a pessoa continua vendo a grade e o dia em volta.
- Evento curto de 15 minutos na vista semana fica com altura menor que 24 px em escala de 30 minutos; precisa de espaço em volta ou de outra forma de clique para passar no 2.5.8.
- Para os usuários do ENSPACE que comparam com o Outlook, a lista por data (vista Agenda ou Schedule) atende quem procura "o que vence quando"; a grade atende quem procura "o que tenho na terça".

### Gaps
- Pesquisa da NN/g ou da Baymard sobre calendário de trabalho (cor demais, legenda, estado vazio, configuração antes do valor): não encontrada; a busca por "nngroup calendar" não trouxe artigo.
- Limite recomendado de cores na grade: sem fonte.
- Orientação de estado vazio específica de calendário: só a nota genérica do skills.sh.

## 5. Acessibilidade: semântica de grade, teclado, leitor de tela, foco, movimento reduzido

### Takeaway
O WAI-ARIA APG dá a receita: grade com 1 só parada de Tab, setas movendo dia a dia e semana a semana, Page Up/Down trocando de mês, rótulo da grade ligado ao título do mês com `aria-live="polite"`, foco que volta ao botão que abriu. A WCAG pede alvo de 24 px e opção de desligar animação disparada por interação.

### Cited Findings
**Semântica**
- Calendário como `grid` sobre `table`; `row`, `columnheader` e `gridcell` vêm implícitos de `tr`, `th` e `td`; nome da grade por `aria-labelledby` apontando para o título de mês e ano — [WAI-ARIA APG, Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- `aria-selected="true"` só na célula da data selecionada; cabeçalhos de coluna com `abbr` para o leitor de tela dizer o nome inteiro do dia quando a tela mostra 2 letras — [WAI-ARIA APG, Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Botões de navegação com `aria-label` ("Next Year"); o título de mês e ano com `aria-live="polite"`, para a troca de período ser anunciada — [WAI-ARIA APG, Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Na grade de dados: `aria-rowcount` e `aria-colcount` quando há linha ou coluna virtualizada; `aria-readonly` em grade não editável não se usa; não pôr papéis ARIA de linha e célula numa `table` nativa — [WAI-ARIA APG, Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- Leitor de tela em modo aplicação anuncia só elementos focáveis e seus rótulos; conteúdo não focável na célula pode se perder — [WAI-ARIA APG, Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- Atlassian: a tecnologia assistiva anuncia o calendário como tabela; ao focar uma data, anuncia dia, mês e ano inteiros, na ordem do idioma — [Atlassian Design System, Calendar usage](https://atlassian.design/components/calendar/usage)

**Teclado**
- ← e → andam 1 dia; ↑ e ↓ andam 1 semana; Home e End vão ao primeiro e último dia da semana; Page Up/Down vão ao mesmo dia do mês anterior ou seguinte (se o dia não existe, ao último dia do mês); Shift + Page Up/Down trocam de ano; Space ou Enter escolhe — [WAI-ARIA APG, Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Grade de dados: as setas param na borda e não dão a volta (dar a volta desorienta quem usa tecnologia assistiva); Ctrl+Home e Ctrl+End vão à primeira e à última célula; Enter ou F2 entra no widget da célula e Escape sai — [WAI-ARIA APG, Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- Atlassian: as setas percorrem o calendário inteiro; data desabilitada não se escolhe — [Atlassian Design System, Calendar usage](https://atlassian.design/components/calendar/usage)
- Outlook: F6 ou Ctrl+F6 passa entre as regiões do calendário (lista lateral, grade, barra) — [Microsoft Support, answer 3cdeb221](https://support.microsoft.com/en-us/office/keyboard-shortcuts-for-outlook-3cdeb221-7ae5-4c1d-8c1d-9e63216c1efd)
- Apple Calendar: Tab e Shift-Tab passam de evento em evento, e as setas também — [Apple Support, answer ical002](https://support.apple.com/guide/calendar/keyboard-shortcuts-ical002/mac)

**Foco**
- Roving tabindex: 1 célula com `tabindex="0"`, as outras com `-1`; o script move o `0` com o foco — [WAI-ARIA APG, Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Ao abrir, o foco vai para a data do campo ou, sem data, para hoje; ao fechar (escolha, OK, Cancel ou Escape), o foco volta ao botão que abriu — [WAI-ARIA APG, Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- Só 1 elemento da grade fica na sequência de Tab da página — [WAI-ARIA APG, Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)

**Movimento e tamanho**
- SC 2.3.3 (AAA): animação disparada por interação precisa poder ser desligada, salvo quando essencial; técnica recomendada: a media query `prefers-reduced-motion` (C39); transição de página que respeita a preferência é o exemplo dado — [W3C, Understanding SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- Alvo mínimo de 24 × 24 px CSS (2.5.8, AA) — [W3C, Understanding SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Apple Calendar: Command-+ e Command-- mudam o tamanho do texto — [Apple Support, answer ical002](https://support.apple.com/guide/calendar/keyboard-shortcuts-ical002/mac)

### Inferences
- O APG documenta o mini calendário (seletor de data). Para a grade grande da semana, com eventos, vale o Grid Pattern: cada evento é um botão focável; Enter abre o detalhe; Escape volta para a grade, como o Esc do Google.
- A troca de semana ou mês pelas setas do topo deve anunciar o novo período pelo mesmo `aria-live="polite"` do título.
- Deslizar a grade ao trocar de período é animação disparada por interação: some com `prefers-reduced-motion`.

### Gaps
- Como Google, Outlook e Apple anunciam um evento no leitor de tela (ordem de título, hora, local): a página de acessibilidade do Google tentada (answer 1631760) deu 404.
- Padrão APG específico para grade de agenda com eventos de duração: não existe padrão dedicado; só o Grid Pattern genérico.

## 6. Celular e tela estreita

### Takeaway
O celular troca a semana de 7 dias por 1 a 3 dias e por lista cronológica: o Notion oferece 1, 2 ou 3 dias, o Google tem 3 Day e Schedule, o Outlook tem Three-day, e o Fantastical abre o mês puxando a faixa de dias para baixo.

### Cited Findings
- Notion Calendar no celular: escolhe-se 1, 2 ou 3 dias no menu da lateral — [Notion Help, Notion Calendar settings](https://www.notion.com/help/notion-calendar-settings)
- Google Calendar no Android: troca-se a vista pelo Menu do canto superior esquerdo; exemplos oficiais: Schedule e Month — [Google Calendar Help, answer 6110849](https://support.google.com/calendar/answer/6110849)
- Google Calendar no Android: vistas Schedule, Day, 3 Day, Week e Month; a 3 Day mostra hoje e os 2 dias seguintes. Fonte secundária — [Android Authority](https://www.androidauthority.com/google-calendar-view-button-fix-biggest-annoyance-3605774); a vista 3 Day foi para a gaveta de navegação em 2015 — [Google Workspace Updates, 2015](https://workspaceupdates.googleblog.com/2015/04/month-view-added-to-google-calendar-app_8.html)
- Novo Outlook para Windows: vista Three-day com atalho Alt+3 — [Microsoft Support, answer 3cdeb221](https://support.microsoft.com/en-us/office/keyboard-shortcuts-for-outlook-3cdeb221-7ae5-4c1d-8c1d-9e63216c1efd)
- Fantastical no iPhone: puxar a DayTicker (faixa de dias) para baixo abre o mês; deslizar para os lados troca de mês, sincronizado com a lista de eventos abaixo — [Flexibits, Fantastical iOS Calendar Views](https://www.flexibits.com/fantastical-ios/help/calendar-views)
- Abaixo de 360 px de largura a grade fica pequena demais para agir; o celular costuma usar a lista (agenda) como vista principal e o mês como navegação compacta. Fonte secundária — [Muzli, Calendar UI inspiration 2026](https://muz.li/inspiration/calendar/)
- No celular, diálogo não modal pode virar modal — [NN/g, Modal & Nonmodal Dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/)

### Inferences
- Na Agenda do ENSPACE em tela estreita: lista por dia como padrão, mais 3 dias como grade; o mês fica como seletor compacto no topo.
- O painel de detalhe que fica ao lado no desktop vira folha de baixo ou tela própria no celular, e o foco volta ao item da lista ao fechar.

### Gaps
- Ponto de quebra (largura) em que Google ou Outlook trocam de layout na web: sem fonte oficial.
- Tamanho de alvo de toque nos apps móveis desses produtos: sem fonte.
- Material 3 (date pickers docked, modal e modal input): só fonte secundária, porque a página oficial não abriu. Segundo ela, não use o modal para data distante como data de nascimento; use o modal input ou o docked — [kotlinlang, Material3 DatePicker](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-date-picker.html) (resumo da busca); [Android Developers, Date pickers](https://developer.android.com/develop/ui/compose/components/datepickers)

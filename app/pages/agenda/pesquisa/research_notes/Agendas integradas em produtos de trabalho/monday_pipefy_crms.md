# Agendas integradas em produtos de trabalho: monday.com, Pipefy, Twenty, Airtable, Attio e HubSpot

Coleta de 2026-10-28. Rótulos de tela no idioma original do produto. Cada afirmação tem a fonte na mesma linha; o que não achei em fonte está em "Gaps".

## 1. Que campo alimenta a agenda, quantos tipos de registro ela mistura e como colore

### Takeaway
Airtable é o mais completo: 1 data de início, data de fim opcional e até 20 campos de data na mesma vista, com cor por campo. Twenty, Pipefy e a Calendar View do monday leem 1 campo de data de 1 tipo de registro; só o Calendar widget do monday (painel) e os widgets do Twenty juntam fontes. Nenhum dos 6 mistura tipos de registro diferentes na vista de agenda da própria tabela.

### Cited Findings
**monday.com**
- A Calendar View exige pelo menos 1 coluna de data no board; aceita coluna "Date" (prazo ou evento de 1 dia) e "Timeline" (início e fim, cobre vários dias); com várias colunas de data, a pessoa escolhe qual posiciona o item — [monday blog, 2026](https://monday.com/blog/project-management/monday-calendar/)
- A Calendar View mostra 1 board só; para juntar boards, o caminho é o Calendar widget de dashboard, onde a pessoa escolhe os boards, as colunas de data ou timeline e os filtros — [monday blog, 2026](https://monday.com/blog/project-management/monday-calendar/)
- Cor do item na Calendar View: por grupo do board, por "Status Column" ou por "People Column" — [monday blog, 2026](https://monday.com/blog/project-management/monday-calendar/)
- Escalas: mês, semana e dia — [monday blog, 2026](https://monday.com/blog/project-management/monday-calendar/)
- A coluna Timeline guarda início e fim e tem lembretes de data em "Add/edit date reminders", no menu da coluna — [monday support: The Timeline Column](https://support.monday.com/hc/en-us/articles/115005333969-The-Timeline-Column)
- O widget de agenda existe como artigo próprio, "The Calendar Widget" — [monday support](https://support.monday.com/hc/en-us/articles/360001262965-The-Calendar-Widget)

**Pipefy**
- A vista Calendar mostra só cards que têm "Due date" preenchido — [Pipefy help: Choosing pipe views](https://help.pipefy.com/en/articles/3143190-choosing-pipe-views)
- Liga-se em "Tools" > "Apps" > "Calendar" > "Enable" e depois em "Pipe views" > "Calendar" — [Pipefy help: How to enable the Calendar App](https://help.pipefy.com/en/articles/724040-how-to-enable-the-calendar-app)
- Escalas: mês, semana, dia e "Agenda" (lista dos cards que vencem nos próximos 30 dias, ordenada pelo vencimento; as setas ao lado de "Today" andam até 1 mês antes ou depois) — [Pipefy help: How to enable the Calendar App](https://help.pipefy.com/en/articles/724040-how-to-enable-the-calendar-app)
- Card com 2 campos de vencimento aparece 1 vez só, pela data preenchida por último; a comunidade sugere mostrar a 2ª data no subtítulo do card — [Pipefy Community: Ability to Show Two Dates on Calendar View](https://community.pipefy.com/ask-the-community-43/ability-to-show-two-dates-on-calendar-view-3300)
- Cor do prazo: amarelo quando o vencimento se aproxima, vermelho quando passou — [resumo da busca sobre o Pipefy; fonte primária: Pipefy Deadline & SLA](https://www.pipefy.com/deadline-sla-tracking/)

**Twenty (open source)**
- A vista Calendar serve a qualquer objeto com campo de data; cada registro vira 1 evento na data do campo escolhido em "Options" > "Calendar" > campo de data > "Update view" — [Twenty docs: Calendar View](https://docs.twenty.com/user-guide/views-pipelines/capabilities/calendar-view)
- O campo precisa ser do tipo "Date" ou "Date & Time" (exemplo com "Due Date" de Tasks) — [Twenty docs: Create a calendar view for tasks due](https://docs.twenty.com/user-guide/views-pipelines/how-tos/create-a-calendar-view-for-tasks-due)
- Histórico: 1.10.0 (2025-11-11) trouxe a vista só em mês; 2.37.0 (2026-08-28) trouxe dia e semana, ligados por padrão — [Twenty releases](https://twenty.com/releases)
- 2.24.0 (2026-07-24): widget de dashboard mostra registros como agenda; 2.26.0 (2026-07-31): registros relacionados aparecem como agenda dentro da página do registro — [Twenty releases](https://twenty.com/releases)

**Airtable**
- A vista pede 1 campo de data de início; nos planos pagos, data de fim (vira faixa) e mais campos de data, até 20 campos ou faixas na mesma vista, cada um com rótulo — [Airtable support: Getting started with calendar views](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- Cor: por campo de seleção única, por condições de filtro próprias ou, com vários campos de data, pelo campo de origem — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- Escalas: "Day", "3 day", "Week", "2 week", "Month" (padrão) e "Custom" (1 a 6 dias ou semanas); sem visão de ano; campo com hora mostra grade horária em Week, 3 day e Day — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- A vista e o layout de calendário das Interfaces leem 1 tabela; juntar tabelas pede página "Blank" com vários widgets, tabela unificada por sync (Business ou Enterprise) ou extensão paga "Master Calendar" — [Airtable Community: Single Calendar Across Multiple Tables?](https://community.airtable.com/base-design-9/single-calendar-across-multiple-tables-31432); [Airtable Community: Combine two different table data in one calendar view](https://community.airtable.com/interface-designer-12/combine-two-different-table-data-in-one-calendar-view-46448); [Airtable support: Interface Designer](https://support.airtable.com/articles/8078126534-getting-started-with-airtable-interface-designer)

**Attio e HubSpot**
- Attio mostra reuniões como lista do dia na Home ("Meetings", com setas para trocar de dia) e em "View upcoming meetings" (cmd/ctrl + k, hoje e amanhã); o artigo não descreve grade de agenda — [Attio help: View emails and meetings](https://attio.com/help/reference/email-calendar/view-emails-and-meetings)
- HubSpot: o artigo da sincronização não descreve vista de agenda dentro do HubSpot — [HubSpot KB: calendar sync](https://knowledge.hubspot.com/integrations/use-hubspots-integration-with-google-calendar-or-outlook-calendar)

### Inferences
- Os produtos de registro com campo personalizado (Airtable, Twenty, monday) tratam a agenda como mais uma vista da tabela, ligada a 1 campo de data. A mistura de fontes fica no painel (widget), não na vista.
- O Pipefy, o mais próximo do ENSPACE em processo, é o mais limitado: 1 campo, 1 data por card, só filtro de tempo.
- Escolher o campo de data na configuração da vista resolve o caso "categoria com vários campos de data" (audiência, prazo, distribuição) sem duplicar categoria.

### Gaps
- Se Airtable e Twenty aceitam campo de fórmula ou lookup como fonte de data: as páginas não falam.
- Cor no Twenty e cor no Calendar widget do monday: não documentadas nas páginas lidas.
- O support.monday.com devolveu 403 ao WebFetch; as afirmações do monday vêm do blog oficial e dos trechos de busca dos artigos de suporte.

## 2. O que o card mostra e o que acontece no clique

### Takeaway
O padrão é card curto com campos escolhidos pela pessoa e clique que abre o registro sem sair da agenda. O Airtable tem 2 níveis: modal pequeno com nome e data, e "Edit details" para o registro inteiro.

### Cited Findings
- Airtable: "Customize labels" na barra escolhe os campos do card, a ordem, negrito, itálico e sublinhado, "Hide all" e "Show all"; capa vinda de anexo ("fit" ou "crop", só a 1ª imagem); campo vazio aparece como "(empty)" — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- Airtable: clique no card abre modal para editar o campo primário e a data; "Edit details" abre o registro expandido; "Delete" exclui; clique no item da barra lateral abre o registro expandido; botão direito no card oferece "Go to date" — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- Airtable: a ordem dos cards no dia é por idade do registro, do mais antigo ao mais novo, e não muda — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- Airtable: "Calendar date height" "Compact" (padrão) ou "Expanded" (até 1.000 registros) — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- Twenty: "Options" > "Fields" liga e desliga cada campo do evento pelo ícone de olho; a doc sugere Title, Assignee e Status para tarefas — [Twenty docs: Calendar View](https://docs.twenty.com/user-guide/views-pipelines/capabilities/calendar-view); [Twenty docs: tasks due](https://docs.twenty.com/user-guide/views-pipelines/how-tos/create-a-calendar-view-for-tasks-due)
- monday: "Configure which information appears on calendar entries"; no app móvel, a pessoa muda o status do item pela entrada da agenda — [monday blog, 2026](https://monday.com/blog/project-management/monday-calendar/)
- Attio: a reunião mostra data, hora, link da chamada de vídeo, status da gravação e participantes, mais a lista "Linked records" — [Attio help: View emails and meetings](https://attio.com/help/reference/email-calendar/view-emails-and-meetings)

### Inferences
- Card configurável por vista dá a cada categoria do ENSPACE o rótulo dela (processo: número e vara; tarefa: responsável e status).
- O modal curto do Airtable (nome + data) com saída para o registro completo é o padrão mais barato para "confirmar e voltar à agenda".

### Gaps
- O que o clique abre no Twenty (painel lateral ou página): a doc não diz.
- O que o clique abre no monday (item card lateral, usual nas outras vistas): sem fonte primária lida.

## 3. Criar registro num espaço vazio

### Takeaway
Só o Airtable documenta: + no dia ou clique duplo no horário cria o registro com a data preenchida; com vários campos de data, um menu pergunta qual campo recebe a data. No monday, criar pela agenda falha quando a data não cai na coluna que alimenta a vista.

### Cited Findings
- Airtable: em "Month" ou "2 week", passar o mouse no dia e clicar no + ou dar clique duplo; em "Week", "3 day" ou "Day", clique duplo no horário; com 1 campo de data, a data entra sozinha; com vários, um menu pede o campo; registro de faixa usa a data clicada como início — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- monday: relato de item criado pela Calendar View que some depois de "create item"; o autor descobriu que a data tem de ir para a coluna que alimenta a agenda; com vários boards, só 1 aceitava criar item (fórum, cerca de 2024) — [monday Community: item immediately disappears](https://community.monday.com/t/adding-a-new-item-in-calendar-view-item-immediately-disappears/92021)
- monday: o artigo do Calendar widget fala em criar evento clicando no dia e arrastando por um intervalo (trecho de busca) — [monday support: The Calendar Widget](https://support.monday.com/hc/en-us/articles/360001262965-The-Calendar-Widget)
- Twenty 2.35.0 (2026-08-26): criar evento de agenda a partir da timeline do registro, com o contato já como convidado — [Twenty releases](https://twenty.com/releases)
- HubSpot: no registro de contato, empresa, deal ou ticket, "Schedule a meeting" no painel esquerdo; "Save" põe a reunião na agenda e manda o convite — [HubSpot KB: schedule a meeting with a contact](https://knowledge.hubspot.com/integrations/schedule-a-meeting-with-a-contact)
- Attio: registrar reunião manual na aba "Activity" > "Log activity" > "Log meeting" (título, resumo, data e hora, participantes, registros ligados; o registro de origem já entra ligado e quem cria vira host) — [Attio help: Log activities on records](https://attio.com/help/reference/managing-your-data/records/add-record-activities)

### Inferences
- Nenhum produto documenta escolher o tipo de registro ao clicar no espaço vazio de uma agenda mista. Numa agenda do ENSPACE com várias fontes, essa escolha (categoria, depois o formulário dela) seria desenho próprio.
- O caso do monday mostra o risco: registro criado pela agenda tem de gravar a data no campo que a vista lê, senão some da tela.
- Nos CRMs, a criação de reunião nasce no registro (contato, deal), não na grade: o vínculo vem primeiro, a data depois.

### Gaps
- Pipefy e Twenty: criar card ou registro clicando num dia da agenda não aparece na doc.
- Quais campos o formulário pede ao criar pela agenda (só título? obrigatórios?): nenhuma fonte detalha.

## 4. Arrastar para remarcar e lista de registros sem data

### Takeaway
Arrastar grava no campo de data em Airtable, Twenty e monday. A lista de "sem data" ao lado da agenda só existe no Airtable, e lá arrastar para a lista apaga a data.

### Cited Findings
- Airtable: arrastar o card para outro dia muda a data; arrastar da lista lateral para um dia agenda; arrastar o card para a lista limpa a data ("unschedules"); nos planos pagos, arrastar a faixa move e arrastar a borda muda a duração — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- Airtable: lista lateral com "All records", "Records with dates" (cronológica) e "Records without dates", busca em todos os campos, X esconde e "Show record list" volta — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- Twenty: PR #27421 move a agenda para o provedor de arrastar comum; soltar num dia continua atualizando o campo de data — [GitHub twentyhq/twenty PR #27421](https://github.com/twentyhq/twenty/pull/27421)
- monday: o blog oficial diz que arrastar o item muda as datas e os fluxos ligados acompanham — [monday blog: interactive calendar](https://monday.com/blog/project-management/interactive-calendar/)

### Inferences
- A lista de "sem data" resolve o item de categoria com campo de data vazio, que hoje não aparece em agenda nenhuma.
- Para tarefa de fluxo com prazo e SLA, arrastar muda o compromisso: vale confirmar antes de gravar e mostrar o efeito no prazo.

### Gaps
- Pipefy: arrastar card na agenda não aparece na doc nem na comunidade lida.
- Versão do Twenty em que o arrastar chegou à agenda: não confirmada.

## 5. Sincronização com Google e Outlook e vínculo das reuniões aos registros

### Takeaway
Os CRMs (Attio, Twenty, HubSpot) fazem o que o usuário do ENSPACE sente falta: a reunião sincronizada se liga sozinha à pessoa pelo e-mail do participante e à empresa pelo domínio, e aparece na aba de atividade do registro. Os produtos de trabalho (monday, Airtable, Pipefy) só empurram datas para fora.

### Cited Findings
**Attio**
- Cada evento não privado do Google Calendar ou do Outlook vira uma reunião no Attio — [resumo da busca; Attio help: View emails and meetings](https://attio.com/help/reference/email-calendar/view-emails-and-meetings)
- Vínculo automático: pessoa pelo e-mail do participante, empresa pelo domínio do e-mail; "+" ao lado de "Linked records" liga a qualquer outro registro, e o x desliga — [Attio help: View emails and meetings](https://attio.com/help/reference/email-calendar/view-emails-and-meetings)
- A reunião pode ser ligada a registro de qualquer objeto, por exemplo um Deal — [Attio Community changelog: Connect any record to your meetings](https://www.attio.community/c/changelog/connect-any-record-to-your-meetings)
- Aparece nas abas "Overview" e "Activity" da pessoa e da empresa, na Home e no Ask Attio; tirar o e-mail ou o domínio do registro tira as reuniões dele, e devolver o e-mail devolve as reuniões — [Attio help: View emails and meetings](https://attio.com/help/reference/email-calendar/view-emails-and-meetings)
- Evento privado não sincroniza; participante em blocklist esconde a reunião; reunião criada à mão só aparece nos registros ligados — [Attio help: View emails and meetings](https://attio.com/help/reference/email-calendar/view-emails-and-meetings)
- Gravação de chamada (Pro e Enterprise) só em reunião vinda da agenda; a gravação não existe sem reunião — [Attio help: View emails and meetings](https://attio.com/help/reference/email-calendar/view-emails-and-meetings)

**Twenty**
- Aba "Calendar" ao lado de "Emails" em People, Companies e Opportunities, com assunto, hora, duração e participantes; vínculo pelo e-mail dos participantes; a oportunidade mostra as reuniões da empresa ligada a ela — [Twenty docs: Calendar](https://docs.twenty.com/user-guide/calendar-emails/capabilities/calendar)
- Só sincroniza reunião externa (só colegas do mesmo domínio fica privada); evento privado não sincroniza; a visibilidade segue a do e-mail — [Twenty docs: Calendar](https://docs.twenty.com/user-guide/calendar-emails/capabilities/calendar)
- Linha do tempo: Google Calendar em 0.11.0 (2024-05-06), com controle do que os colegas veem; evento na timeline do registro em 0.20.0; criação automática de contato pelos eventos em 0.21.0; Microsoft 365 em 0.42.0; CalDAV em 1.3.0; recorrência do Google em 2.2.0; abas atualizadas sem recarregar em 2.16.0; criar evento no Google ou Microsoft por IA e workflow, com link de Meet ou Teams, em 2.18.0 (2026-07-02) — [Twenty releases](https://twenty.com/releases)

**HubSpot**
- Reunião criada na agenda conectada só entra na timeline de contato que já existe, com o e-mail igual à propriedade "Email"; o HubSpot não cria contato para convidado — [HubSpot KB: calendar sync](https://knowledge.hubspot.com/integrations/use-hubspots-integration-with-google-calendar-or-outlook-calendar)
- Editar ou apagar na agenda atualiza o HubSpot; reunião marcada no HubSpot vai para a agenda; apagar no HubSpot não apaga no Google ou Outlook — [HubSpot KB: calendar sync](https://knowledge.hubspot.com/integrations/use-hubspots-integration-with-google-calendar-or-outlook-calendar)
- Limites: só a agenda principal; Google ou Outlook, não os 2; evento anterior à conexão não entra; evento privado não entra; recorrência traz as 5 próximas, até 1 ano; evento de domínio interno e de usuário não é criado — [HubSpot KB: calendar sync](https://knowledge.hubspot.com/integrations/use-hubspots-integration-with-google-calendar-or-outlook-calendar)
- A reunião do contato segue a associação padrão de atividade; o Super Admin pode, por exemplo, ligar só ao deal mais recente em vez dos 5 mais recentes; reunião registrada na empresa vai também ao contato mais recente e a todos os deals abertos dela — [HubSpot KB: automatic associations](https://knowledge.hubspot.com/object-settings/configure-automatic-activity-associations)
- O meetings tool liga 1 agenda (Google, Office 365 ou Exchange); quem agenda pelo link não marca por cima de evento existente; sem agenda, a página de agendamento fica em "offline mode" — [HubSpot KB: Connect your calendar](https://knowledge.hubspot.com/meetings-user-guide/integrate-your-calendar-to-use-in-the-meetings-tool)

**monday, Airtable e Pipefy**
- monday: sincroniza colunas Date ou Timeline com Google ou Outlook pelo menu da coluna; o artigo de suporte diz que a integração com o Google é de mão única (mudança no Google não volta ao board) — [monday support: Calendar sync](https://support.monday.com/hc/en-us/articles/360001362725-Calendar-Integration-); [Google Calendar Integration](https://support.monday.com/hc/en-us/articles/4404712420754-Google-Calendar-Integration); [Outlook Calendar Integration](https://support.monday.com/hc/en-us/articles/4404712396562-Outlook-Calendar-Integration); contradito em parte pelo [monday blog, 2026](https://monday.com/blog/project-management/monday-calendar/), que chama de 2 vias as receitas de sincronia (evento criado de um lado aparece do outro)
- Airtable: link iCal da vista para agendas externas; imprimir ou salvar em PDF — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- Airtable: usuários relatam que o Google Calendar atualiza agenda externa a cada 24 horas, e que Outlook e Apple Calendar se saem melhor — [Airtable Community: Single Calendar Across Multiple Tables?](https://community.airtable.com/base-design-9/single-calendar-across-multiple-tables-31432)

### Inferences
- O que torna a agenda integrada melhor que o Outlook ao lado é o vínculo: a reunião do Outlook cai sozinha no processo, no cliente ou na pessoa certa, e aparece na aba do registro. Só os CRMs fazem isso, e por regra simples (e-mail e domínio).
- Para o ENSPACE, a chave de vínculo pode ser e-mail de participante contra campo de e-mail de categoria (cliente, parte, advogado) e, no jurídico, número do processo no assunto do evento. Esta 2ª chave não aparece em nenhum dos produtos.
- O vínculo automático sempre tem saída manual ("+ Linked records" no Attio) e regra de privacidade (evento privado, só colegas, blocklist).

### Gaps
- Attio: se a sincronia escreve de volta na agenda (criar ou mover evento pelo Attio): o artigo lido não diz.
- Twenty: direção da sincronia (só leitura ou 2 vias) não está na doc; a 2.18.0 mostra criação de evento no Google ou Microsoft por workflow.
- Twenty: como a oportunidade casa com a reunião além da empresa ligada: a doc não detalha.
- HubSpot: se tarefas sincronizam com Google ou Outlook: o artigo de tarefas não fala ([HubSpot KB: Use tasks](https://knowledge.hubspot.com/tasks/use-tasks)).

## 6. Filtros, vistas salvas, permissão e agenda dentro do registro ou do painel

### Takeaway
A agenda é uma vista salva com filtros próprios em Airtable, Twenty e monday; o Pipefy só filtra por tempo. Twenty e monday põem agenda em painel, e o Twenty põe a agenda dos registros relacionados dentro da página do registro.

### Cited Findings
- monday: filtro por membro, status, grupo e qualquer coluna, e busca por nome e conteúdo; o widget de dashboard junta boards com filtro e é descrito como "Interactive, but optimized for oversight and reporting"; o 1º dia da semana se muda em "Language and region" — [monday blog, 2026](https://monday.com/blog/project-management/monday-calendar/)
- monday: "My Work" junta os itens da pessoa de vários boards — [monday support: My Work](https://support.monday.com/hc/en-us/articles/360019300579-My-Work)
- Pipefy: a vista escolhida vale só para a própria pessoa e reabre na última usada — [Pipefy help: Choosing pipe views](https://help.pipefy.com/en/articles/3143190-choosing-pipe-views)
- Pipefy: a agenda só filtra por tempo; filtro por outros critérios é pedido de melhoria; não há filtro "Overdue" (usa-se "Due date" "is before" hoje); "My work" lista os cards da pessoa por vencimento próximo e atrasado — [Pipefy Community: Calendar View for Cards](https://community.pipefy.com/ideas/calendar-view-for-cards-3876); [Pipefy help: cards assigned to you](https://help.pipefy.com/en/articles/1602018-how-to-find-all-cards-assigned-to-you)
- Twenty: cada vista guarda filtros, ordenação e campos visíveis; exemplos de vista: "My Tasks" (Assignee = Me), "This Week", "Overdue" (Due Date antes de hoje e Status diferente de Done); a doc sugere vista pessoal como "Unlisted" — [Twenty docs: Layout](https://docs.twenty.com/getting-started/core-concepts/layout); [Twenty docs: tasks due](https://docs.twenty.com/user-guide/views-pipelines/how-tos/create-a-calendar-view-for-tasks-due)
- Twenty: agenda em widget de dashboard (2.24.0) e agenda de registros relacionados dentro da página do registro (2.26.0) — [Twenty releases](https://twenty.com/releases)
- Airtable: Owner, Creator e Editor mudam a vista; Commenter só muda as vistas pessoais dele; o app móvel tem agenda básica — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- Airtable: "Go to date", "Today" e setas que andam 1 unidade ou o período inteiro — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)

### Inferences
- Vistas prontas como "Minhas", "Esta semana" e "Atrasadas" respondem às perguntas diárias de quem abre a agenda e cabem como abas da Agenda do ENSPACE.
- Agenda dos relacionados na página do registro (Twenty 2.26.0) é o desenho para "audiências e prazos deste processo".

### Gaps
- Permissão por linha na agenda (a pessoa só vê o que pode ver no registro): nenhuma fonte trata.
- Calendar View do monday: se a vista é pessoal ou do board: não achei fonte.

## 7. Reclamações e limites conhecidos

### Takeaway
As queixas repetem 3 pontos: uma data só por card (Pipefy), uma tabela só por agenda (Airtable, Calendar View do monday) e criação pela agenda que não grava a data certa (monday). Nos CRMs, o limite é o vínculo só com registro que já existe.

### Cited Findings
- Pipefy: 1 data por card, pela última preenchida; só filtro de tempo — [Pipefy Community: Two Dates](https://community.pipefy.com/ask-the-community-43/ability-to-show-two-dates-on-calendar-view-3300); [Pipefy Community: Calendar View for Cards](https://community.pipefy.com/ideas/calendar-view-for-cards-3876)
- Airtable: pedidos recorrentes de agenda de várias tabelas, com posts de 2023 em diante — [Airtable Community: due dates from separate tables](https://community.airtable.com/base-design-9/calendar-view-that-can-display-due-dates-from-separate-tables-46054); [Airtable Community: 3 separate tables](https://community.airtable.com/other-questions-13/how-best-to-create-a-calendar-view-from-3-separate-tables-19090)
- Airtable: ordem fixa dos cards no dia, sem visão de ano, agenda básica no móvel — [Airtable support](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)
- monday: item criado pela agenda some quando a data não vai para a coluna da vista — [monday Community](https://community.monday.com/t/adding-a-new-item-in-calendar-view-item-immediately-disappears/92021)
- HubSpot: só contato existente recebe a reunião; só a agenda principal; Google ou Outlook — [HubSpot KB: calendar sync](https://knowledge.hubspot.com/integrations/use-hubspots-integration-with-google-calendar-or-outlook-calendar)
- HubSpot: pedido de 3 anos por quadro de tarefas com arrastar para mudar status — [HubSpot Community: bring back the task board view](https://community.hubspot.com/t/bring-back-the-task-drag-drop-board-view/29096)
- Attio: a busca do workspace não lê o conteúdo de e-mails e reuniões — [Attio help: View emails and meetings](https://attio.com/help/reference/email-calendar/view-emails-and-meetings)

### Inferences
- A Agenda do ENSPACE já mistura 3 fontes, o que os 6 produtos não fazem numa vista só. O que falta, pelos exemplos, é: escolher o campo de data por categoria, cor por fonte ou campo, card configurável, clique que abre o item no lugar, arrastar que grava, lista de "sem data" e vínculo do Outlook ao item.

### Gaps
- Reviews do G2 sobre agenda desses 6 produtos: não li nesta coleta.
- HubSpot: vista de agenda de tarefas e task queues; o artigo de tarefas lido não descreve vistas nem filas.

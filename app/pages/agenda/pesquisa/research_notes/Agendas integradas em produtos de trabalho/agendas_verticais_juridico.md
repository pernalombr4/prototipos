# Agendas em software vertical: jurídico (Brasil e exterior) e, em contraste, agendamento de serviço

Pesquisa feita em 2026-10-28. Fontes: páginas dos fabricantes, central de ajuda, Trailhead e avaliações de usuários. Aviso de método: help.clio.com, clio.com/features e reclameaqui.com.br devolveram HTTP 403 ao robô de leitura. Para o Clio, os fatos vêm do trecho indexado pela busca e de terceiros (Lawyerist, API do Clio), sempre marcados. Página de marketing descreve o que o fabricante diz que existe; quando só há marketing, a nota diz.

## 1. Quais entidades aparecem na agenda e como se ligam ao processo, ao cliente e ao caso

### Takeaway
Nos produtos jurídicos, a agenda mostra tipos fixos do domínio: tarefa, evento, prazo, audiência e, nos americanos, prazo prescricional (SOL). Cada um tem um vínculo opcional com o caso (matter, case, project). O vínculo serve para filtrar a agenda pelo caso e para abrir a agenda dentro do caso, numa aba ou subaba. Nenhuma fonte pública descreve com detalhe o que o painel de um evento mostra do caso ao abrir.

### Cited Findings
- Astrea (Aurum) tem 4 tipos de atividade na agenda: **Tarefas** (ação operacional sem dia definido), **Eventos** (reunião e atendimento, com horário), **Prazos** (data limite dos prazos das publicações) e **Audiências** (data da audiência marcada). Prazos e Audiências só existem nos planos Company e VIP. — [Aurum, Agenda para advogados](https://www.aurum.com.br/blog/agenda-para-advogados)
- Astrea: visualização por dia, semana, mês ou lista. Cada atividade aceita comentário e anexo, e o histórico fica registrado nela. — [Aurum, Agenda para advogados](https://www.aurum.com.br/blog/agenda-para-advogados)
- MyCase: a agenda mostra eventos (compromisso, prazo, reunião interna). Por escolha do usuário, também mostra **"Task Deadlines"** e **"Statute of Limitation Dates"**. As visões são **"Staff"**, **"Day"**, **"Week"**, **"Month"** e **"Agenda"**. — [MyCase, Calendar Overview](https://supportcenter.mycase.com/en/articles/9370065-calendar-overview)
- MyCase: o evento nasce ligado a um caso. Para criar um evento sem caso, o usuário marca **"this event is not linked to a case."** Ou seja, o vínculo é o padrão e a exceção é explícita. — [MyCase, Calendar Overview](https://supportcenter.mycase.com/en/articles/9370065-calendar-overview)
- MyCase: o evento tem tipo com cor própria (link **"Customize"** na seção **"Event Type"**), local cadastrado ou novo, recorrência (**"this event repeats"**) e vários lembretes por e-mail ou pop-up. O evento pode ser compartilhado com usuários do escritório e com clientes, e as informações adicionais ficam visíveis a todos com quem ele foi compartilhado. — [MyCase, Calendar Overview](https://supportcenter.mycase.com/en/articles/9370065-calendar-overview)
- MyCase: a agenda filtra por caso específico e por local. Pela tela do caso, o caminho é **Case Details > Events**. — [MyCase, Calendar Overview](https://supportcenter.mycase.com/en/articles/9370065-calendar-overview); [busca indexada do artigo Rule Based Calendaring do MyCase](https://help.mycase.com/s/article/Rule-Based-Calendaring-in-MyCase-via-CalendarRules?)
- Filevine (marketing): cada caso tem a própria agenda, com audiência, depoimento (deposition) e reunião com cliente. Do item da agenda, o usuário abre documentos e notas do caso. — [Filevine, Calendaring](https://filevine.com/features/calendaring/)
- Clio (trecho indexado): a regra de prazo processual se cria pela aba principal **Calendar** ou pela subaba **Calendar** do matter. O evento criado fora do Clio é trazido ao abrir o evento e ligá-lo a um matter (este segundo ponto vem de página de terceiro, não do Clio). — [Clio Help Center, artigo 9289840995867](https://help.clio.com/hc/en-us/articles/9289840995867); [caeluslaw, Clio calendar (terceiro)](https://caeluslaw.pages.dev/features/clio-calendar)
- Projuris (blog do fabricante): os compromissos da agenda vêm de contratos, procurações, certidões, processos, imóveis e requisições. O escritório organiza os compromissos por processo, cliente, matéria, prazo e prioridade. — [Projuris, Agenda jurídica no Outlook](https://www.projuris.com.br/blog/agenda-juridica-2/); [Projuris, Agenda digital](https://www.projuris.com.br/agenda-digital-vantagens/)
- Projuris ADV: a base de conhecimento tem a seção "Tarefas, Audiências e Compromissos". O conteúdo não foi recuperado. Diretórios de terceiros citam um "Calendário de Audiências e Compromissos". — [Projuris ADV, base de conhecimento](https://projurisadv.atlassian.net/wiki/spaces/BDC/pages/93650945/Processos); [B2B Stack, Projuris ADV](https://www.b2bstack.com.br/product/projurisadv/funcionalidades)
- ADVBOX (marketing): a agenda filtra por colaborador, cliente, processo ou data. — [ADVBOX, Softwares para advogados](https://advbox.com.br/blog/softwares-para-advogado)
- Legal One (marketing): a captura de publicações e andamentos vira "prazo, tarefa e lembrete na agenda da equipe". — [Thomson Reuters, Legal One Firm](https://www.thomsonreuters.com.br/pt/produtos/legal-one-firm.html)

### Inferences
- O padrão comum: a agenda é uma lente sobre registros do domínio (tipo + caso + responsável), e não um calendário com campo "caso" opcional. O MyCase deixa isso visível no formulário: o vínculo com o caso é o padrão e a ausência dele exige marcar uma caixa.
- A dupla entrada aparece em todos: agenda geral com filtro por caso, e agenda dentro do caso (subaba Calendar no Clio, Case Details > Events no MyCase, agenda por caso no Filevine). Para o ENSPACE, isso equivale a uma aba Agenda dentro do item do processo, além da tela Agenda geral.
- O Astrea separa "Tarefa" (sem horário) de "Evento" (com horário). Isso corresponde à diferença entre tarefa com prazo e compromisso com hora que a agenda do ENSPACE precisa mostrar de formas distintas.

### Gaps
- Nenhuma fonte pública acessível descreve o painel que abre ao clicar num evento (quais campos do caso aparecem: partes, número do processo, vara, responsável). O artigo do MyCase diz explicitamente que não cobre isso. A confirmação exige teste com conta.
- A Central de Ajuda do Astrea, do Projuris e do Legal One não apareceu nas buscas. A descrição desses 3 vem de blog e página de produto.
- PracticePanther: só há descrição de diretório ("add events and sync with Google & Outlook"). Nenhuma fonte primária foi lida.

## 2. Cálculo de prazo (dias úteis, feriados, regras de tribunal), prazo fatal × prazo interno e alertas

### Takeaway
Nos EUA, o cálculo vem de um motor de regras de tribunal (CalendarRules, que hoje é do Clio, ou LawToolBox). O usuário escolhe jurisdição, gatilho (trigger) e data, e o sistema cria a série de eventos ligados ao caso; mudar a data do gatilho atualiza os dependentes em lote. No Brasil, o padrão documentado é outro: a publicação capturada gera um prazo, e o escritório separa o "prazo fatal" (o prazo judicial) do prazo interno, que vence antes. A ADVBOX chama esse método de D-1.

### Cited Findings
- Clio (trecho indexado da central de ajuda): depois de escolher o gatilho, as regras encontram os eventos de tribunal da jurisdição e põem as datas na agenda. Os campos obrigatórios são nome da regra, matter, jurisdição já cadastrada, gatilho (Trigger) e data do gatilho. Em seguida, o usuário escolhe em qual agenda os eventos entram, adiciona usuários do escritório como participantes e clica **Add to Calendar**. Os lembretes se definem na hora ou depois. — [Clio Help Center, artigo 9289840995867](https://help.clio.com/hc/en-us/articles/9289840995867)
- Clio: a jurisdição se cadastra em **Settings > Court Rules > Jurisdictions**. Pela documentação da API, só o administrador da conta adiciona jurisdição, e o recurso não existe em todos os planos. — [Clio Help Center](https://help.clio.com/hc/en-us/articles/9289840995867); [Clio Jurisdictions To Triggers API](https://apis.io/apis/clio/clio-jurisdictions-to-triggers-api/)
- Clio: quem criou a regra (ou tem permissão de edição) muda a data e a hora do gatilho e atualiza os eventos ligados em lote. Desde a melhoria de 2022 (atualizada em 2023), o evento tem hora marcada em vez de dia inteiro, há regras para os 50 estados e o usuário cria regras próprias, com gatilho e ações customizados. — [Clio Help Center](https://help.clio.com/hc/en-us/articles/9289840995867); [Lawyerist, Clio Court Rules enhancements (2022-09-02, atualizado 2023-11-13)](https://lawyerist.com/news/clio-court-rules-enhancements/)
- Clio e CalendarRules: o Clio anunciou a integração com o CalendarRules e hoje vende o CalendarRules como produto próprio ("CalendarRules by Clio"). — [Clio, press release](https://www.clio.com/about/press/clio-and-calendarrules-offer-new-integration-to-help-lawyers-better-manage-busy-law-firms-and-calendars/); [Legal Technology Hub, CalendarRules by Clio](https://www.legaltechnologyhub.com/vendors/calendarrules-by-clio/)
- MyCase: o usuário clica **Add Court Rule** na agenda ou em **Case Details > Events**. Um assistente liga os eventos a um caso, cria todos os eventos da regra e os põe na agenda com as configurações escolhidas. Depois disso, cada evento se edita como evento comum. — [busca indexada do artigo Rule Based Calendaring do MyCase](https://help.mycase.com/s/article/Rule-Based-Calendaring-in-MyCase-via-CalendarRules?)
- MyCase também anunciou integração com o LawToolBox (regras dos 50 estados). — [PRWeb, MyCase e LawToolBox](https://www.prweb.com/releases/mycase-and-lawtoolbox-join-forces-to-help-lawyers-increase-efficiency-806263258.html)
- Filevine, **Deadline Chains**: o usuário digita uma data inicial (data da audiência, data do fato), e os prazos anteriores e posteriores se calculam a partir dela. O prazo dependente parte do dia em que o prazo anterior recebe data ou é concluído. Apagar a data de um prazo apaga os dependentes. Calendários judiciais (judicial calendars) definem como os dias se contam na cadeia. Mudança feita no editor avançado vale para todas as cadeias em andamento. — [Filevine Support, Deadline Chains](https://support.filevine.com/hc/en-us/articles/360004150372); [Filevine Support](https://support.filevine.com/hc/en-us/articles/360004194251)
- Filevine (marketing): concluir uma tarefa faz o próximo prazo aparecer na agenda sem digitação. — [Filevine, Calendaring](https://filevine.com/features/calendaring/)
- ADVBOX, método D-1 (whitepaper, só o trecho indexado pela busca; o PDF não tem texto extraível): o assistente recebe a intimação e a marca como lida. Depois, atribui a tarefa ao advogado com "prazo final" em 5 dias a partir de hoje e "prazo fatal" no dia anterior ao prazo judicial (D-1). Alertas por e-mail vão ao controlador, ao responsável e aos gestores. O material pede que o campo de prazo fatal não seja usado em outras tarefas. — [ADVBOX, Whitepaper Sistema Prazo Fatal D-1](https://advbox.com.br/blog/wp-content/uploads/2021/02/Whitepaper-Sistema-Prazo-Fatal-D1.pdf); [ADVBOX, aula de implantação D-1 e prazo fatal (2023)](https://advbox.com.br/blog/wp-content/uploads/2023/03/aula-implantacao-d-menos-1-e-prazo-fatal-na-ADVBOX.pdf)
- ADVBOX (marketing): a IA de intimações (Justin-e) lê a intimação, calcula prazos e sugere tarefas. — [ADVBOX, IA para escritório](https://advbox.com.br/ia-para-escritorio-de-advocacia)
- Legal One Premium (marketing): resumo de processos e publicações e sugestão de prazo por IA. Em maio de 2026, a Thomson Reuters anunciou IA generativa para triagem de publicações e identificação de prazos. — [Thomson Reuters, Legal One Firm](https://www.thomsonreuters.com.br/pt/produtos/legal-one-firm.html); [Thomson Reuters, sala de imprensa, 2026-05-20](https://www.thomsonreuters.com.br/pt/sala-de-imprensa/tr-automatiza-rotinas-juridicas-com-novas-funcionalidades-de-ia-no-legal-one.html)
- Astrea: o item Prazos "informa a data limite" dos prazos das publicações. A calculadora gratuita da Aurum, separada do produto, considera feriados nacionais e recesso forense e conta em dias úteis ou corridos a partir do DJEN, da intimação ou da citação eletrônica. — [Aurum, Agenda para advogados](https://www.aurum.com.br/blog/agenda-para-advogados); [Aurum, Calculadora de prazos](https://www.aurum.com.br/calculadora-de-prazos-processuais); [Aurum, calendário de feriados](https://aurum.com.br/calculadora-de-prazos-processuais/calendario-de-feriados)
- Astrea, avaliações: um usuário diz que a prioridade (baixa, média, alta) existe só para tarefa, não para prazo. Outro diz que o prazo só se conta ao distribuir tarefa a partir da publicação, e não quando é lançado à mão. Um terceiro diz que o sistema não considera recesso, feriado e fim de semana. Esta última avaliação contradiz o material da Aurum e não tem data. — [B2B Stack, avaliações do Astrea](https://www.b2bstack.com.br/product/astrea/avaliacoes?page=2); [B2B Stack, página 9](https://www.b2bstack.com.br/product/astrea/avaliacoes?page=9)
- Projuris (blog): alertas antes de audiência, reunião, protocolo e vencimento. — [Projuris, Agenda digital](https://www.projuris.com.br/agenda-digital-vantagens/)

### Inferences
- Há 2 modelos de cálculo. EUA: gatilho + regra de tribunal gera N eventos encadeados, e mover o gatilho move a cadeia. Brasil: a intimação publicada gera 1 prazo judicial, e o escritório deriva dele um prazo interno anterior (D-1, D-5). Para o ENSPACE, isso pede 2 datas no mesmo registro de prazo (fatal e interna) e a agenda mostrando as 2, com a fatal destacada.
- A regra da ADVBOX ("não use o campo prazo fatal em outras tarefas") mostra que, sem tipo próprio, o prazo fatal se dilui entre tarefas comuns. Isso a favor de o prazo processual ser um tipo distinto na agenda, e não uma tarefa com etiqueta.
- A edição em lote dos dependentes (Clio, Filevine) é o ponto onde a agenda deixa de ser um calendário: mover 1 data recalcula as outras do mesmo caso.

### Gaps
- Nenhuma fonte primária mostra como o Astrea, o Projuris ou o Legal One desenham na agenda a diferença entre prazo fatal e prazo interno (cor, ícone, 2 marcas no mesmo dia).
- Não há documentação pública de regra de tribunal brasileira (dias úteis por tribunal, feriado local, suspensão) dentro desses produtos. Só a calculadora avulsa da Aurum.
- Os canais e a antecedência dos alertas do Astrea e do Projuris não estão descritos.

## 3. Criar evento pela agenda × pelo caso; eventos automáticos vindos de publicação e intimação

### Takeaway
Os produtos americanos oferecem as 2 portas para a mesma ação: botão na agenda geral e botão dentro do caso. Nos 2 casos, o vínculo com o caso entra no formulário. Os brasileiros apostam na terceira porta: a publicação capturada é tratada numa fila, e o tratamento gera o prazo ou a tarefa com responsável, que então aparece na agenda.

### Cited Findings
- MyCase: o evento se cria pelo botão **"Add Event"** ou clicando numa data. A regra de tribunal sai de **Add Court Rule**, na agenda ou em **Case Details > Events**. — [MyCase, Calendar Overview](https://supportcenter.mycase.com/en/articles/9370065-calendar-overview); [busca indexada do artigo Rule Based Calendaring](https://help.mycase.com/s/article/Rule-Based-Calendaring-in-MyCase-via-CalendarRules?)
- Clio: a regra de tribunal sai da aba principal Calendar ou da subaba Calendar do matter. — [Clio Help Center](https://help.clio.com/hc/en-us/articles/9289840995867)
- ADVBOX: a plataforma lê publicações de diários e processos eletrônicos e traz a cópia da intimação. Cada intimação se atribui a um responsável, com prazo e prioridade. — [ADVBOX, Softwares para advogados](https://advbox.com.br/blog/softwares-para-advogados-tres-razoes-para-usar-a-advbox/)
- ADVBOX (marketing): agentes executam ações automáticas quando uma tarefa é concluída ou uma etapa muda, e geram tarefas automáticas. — [ADVBOX, IA para escritório](https://advbox.com.br/ia-para-escritorio-de-advocacia)
- Astrea: robôs buscam os processos pela OAB ou pelo número CNJ. Um usuário elogia que o tratamento das publicações "já direciona a tarefa ao responsável". — [Aurum, Priorizar tarefas](https://www.aurum.com.br/blog/priorizar-tarefas-com-astrea/); [B2B Stack, avaliações do Astrea](https://www.b2bstack.com.br/product/astrea/avaliacoes?page=2)
- Legal One Firm Starter: "módulo exclusivo para leitura e tratamento de publicações". A publicação vira prazo, tarefa e lembrete na agenda da equipe. — [Thomson Reuters, Legal One Firm Starter (PDF, 2021)](https://www.thomsonreuters.com.br/content/dam/ewp-m/documents/brazil/pt/pdf/other/legal-one-firm-starter-revisado-2021-updated.pdf); [Thomson Reuters, Legal One Firm](https://www.thomsonreuters.com.br/pt/produtos/legal-one-firm.html)
- Filevine: a conclusão de um prazo da cadeia cria o próximo na agenda. — [Filevine, Calendaring](https://filevine.com/features/calendaring/); [Filevine Support, Deadline Chains](https://support.filevine.com/hc/en-us/articles/360004150372)

### Inferences
- A sequência brasileira tem 4 passos: captura → fila de publicações → tratamento (ler, decidir, atribuir) → prazo ou tarefa na agenda. A agenda é o destino, não a origem. Para o ENSPACE, que já captura publicações e gera tarefas por fluxo, a agenda pode mostrar, em cada prazo, a publicação que o originou, e oferecer um atalho para as publicações ainda não tratadas.
- Criar pela agenda com o caso pré-escolhido (dentro do caso) ou escolhido no formulário (agenda geral) é o mínimo comum a todos.

### Gaps
- Não achei descrição pública de como o Astrea ou o Legal One mostram, no evento da agenda, a ligação de volta à publicação de origem.
- Não confirmei se algum produto cria audiência automaticamente a partir da intimação (só prazo e tarefa estão documentados).

## 4. Agenda de equipe: filtro por advogado, delegação, carga de trabalho e disponibilidade

### Takeaway
O padrão jurídico é a sobreposição de agendas por pessoa, com cor por usuário e liga/desliga individual. O MyCase tem uma visão "Staff" com uma coluna por pessoa. Delegação e filtro "por responsável, criador ou envolvido" aparecem no Astrea. Carga de trabalho como métrica explícita não aparece nos jurídicos. Ela aparece no console de despacho (seção 6).

### Cited Findings
- MyCase: visão **"Staff"**. O filtro escolhe toda a equipe ou só as pessoas ligadas a um caso ou atividade. Cada agenda de usuário se liga e desliga. Cada usuário tem uma cor, para ver quem está ocupado ao convidar. — [MyCase, Calendar Overview](https://supportcenter.mycase.com/en/articles/9370065-calendar-overview)
- Astrea: tarefa se delega a outra pessoa, que acompanha o andamento. O filtro **"Atribuição"** separa por responsável, criador ou pessoas envolvidas. O filtro **"Pessoas"** busca por nome. O filtro **"Atividades"** filtra por tipo e status ("a concluir", "concluídas", "canceladas", "todas"). O filtro **"Etiquetas"** usa categorias do usuário. — [Aurum, Agenda para advogados](https://www.aurum.com.br/blog/agenda-para-advogados)
- Filevine (marketing): agenda do escritório inteiro para ver conflito de horário e distribuir pessoas e recursos. O **"Calendar Events Report"** dá dados de eventos futuros e passados para medir produtividade e horas faturáveis. — [Filevine, Calendaring](https://filevine.com/features/calendaring/)
- Clio: a agenda se compartilha com outros usuários do Clio. Um avaliador elogia ver a agenda de todos num lugar só. — [Clio Help Center, Calendar Set Up and Settings (trecho indexado)](https://help.clio.com/hc/en-us/articles/9290016489883); [SpotSaaS, avaliações do Clio](https://www.spotsaas.com/product/clio/reviews?page=27)
- Clio: na regra de tribunal, o usuário escolhe a agenda de destino e os participantes do escritório. — [Clio Help Center](https://help.clio.com/hc/en-us/articles/9289840995867)

### Inferences
- "Staff" do MyCase (coluna por pessoa) é o equivalente jurídico das faixas por recurso do console de despacho, sem a lista de trabalho sem data ao lado.
- Nenhum jurídico pesquisado mostra "carga" (quantos prazos fatais por advogado na semana). Para o ENSPACE, que tem tarefas com SLA por responsável, é um espaço sem concorrente documentado.

### Gaps
- Não achei, em fonte primária, recurso de disponibilidade (achar horário livre comum) para marcar reunião nos jurídicos.
- Permissão de ver a agenda de outro (só ocupado × detalhes) não está documentada nas fontes lidas.

## 5. Sincronização com Outlook e Google e o que a agenda nativa acrescenta

### Takeaway
3 desenhos coexistem. (a) Mão única, sistema → Outlook (Projuris): o sistema é a fonte e o Outlook é só vitrine. (b) Mão dupla restrita a uma agenda dedicada (MyCase: só a agenda "MyCase" dentro do Outlook sincroniza). (c) Mão dupla ampla (Clio, Doctoralia). A agenda nativa acrescenta o que o Outlook não guarda: o tipo jurídico (prazo, audiência, SOL), o vínculo com o caso, a cadeia de prazos e o filtro por caso e responsável. O MyCase deixa de fora da sincronização justamente o prazo prescricional (SOL).

### Cited Findings
- Projuris: integração de mão única, Projuris → Outlook. Vão título, descrição, início e fim, local e participantes, inclusive externos com e-mail válido. Mudar no Projuris atualiza o Outlook, e excluir no Projuris remove do Outlook. Evento criado no Outlook não vai ao Projuris. Evento sincronizado apagado no Outlook volta na sincronização seguinte. A ativação é por usuário: **Hub de Integrações** → **Outlook Calendar** → autorizar a conta **Microsoft**. A tela mostra o status da conexão e a data da última sincronização. — [Projuris, Agenda jurídica no Outlook](https://www.projuris.com.br/blog/agenda-juridica-2/)
- MyCase: mão dupla, mas só a agenda "MyCase" dentro do Outlook sincroniza; as outras agendas do Outlook ficam invisíveis. Só sincronizam os eventos aos quais o usuário está ligado no MyCase. Datas de SOL não vão ao Outlook. Eventos que já existiam no Outlook não aparecem no MyCase. Em caso de falha, o caminho é o botão Sync em **"Manage Integrations"**. — [MyCase, Outlook Calendar Sync FAQ](https://supportcenter.mycase.com/en/articles/12624867-outlook-calendar-sync-faq); [MyCase, How do I link MyCase with Outlook](https://supportcenter.mycase.com/en/articles/9370159-how-do-i-link-mycase-with-outlook)
- Clio: sincroniza e compartilha com Outlook, Google e outros usuários do Clio. A página do diretório de apps diz que criar, mudar ou apagar em qualquer lado reflete no outro. Uma página de terceiro diz que edição feita no Outlook nem sempre volta ao Clio e recomenda tratar o Clio como fonte. — [Clio Help Center, Calendar Set Up and Settings (trecho indexado)](https://help.clio.com/hc/en-us/articles/9290016489883); [Clio App Directory, Office 365 Calendar](https://www.clio.com/app-directory/office-365-calendar/); [caeluslaw, Clio calendar (terceiro)](https://caeluslaw.pages.dev/features/clio-calendar)
- Astrea: vincula Google Agenda, Outlook e Apple, com informações "espelhadas". Sentido e frequência não estão descritos. — [Aurum, Agenda para advogados](https://www.aurum.com.br/blog/agenda-para-advogados)
- Legal One: integração com Google e Outlook 365, só contas corporativas. — [Thomson Reuters, Legal One Firm](https://www.thomsonreuters.com.br/pt/produtos/legal-one-firm.html)
- ADVBOX: sincroniza com Google, Apple e Outlook. — [ADVBOX, Softwares para advogados](https://advbox.com.br/blog/softwares-para-advogado)
- Doctoralia (Docplanner): mão dupla em tempo real com Google, Office 365, Outlook.com, Apple e Exchange, construída sobre a API do Cronofy. O sistema lê os eventos da agenda pessoal do médico para calcular a disponibilidade mostrada ao paciente. O que se cria no Docplanner (folga, curso) vai para a agenda do médico. O objetivo declarado é evitar agendamento duplo. — [Cronofy, case Docplanner](https://www.cronofy.com/case-studies/medical-appointment-scheduling-docplanner)

### Inferences
- A frase do usuário do ENSPACE ("é praticamente igual a abrir o calendário da Microsoft fora do sistema") corresponde ao caso em que a agenda nativa só reexibe eventos genéricos. Os concorrentes justificam a agenda nativa pelo que o Outlook não representa: tipo do domínio, vínculo com o caso, cadeia de prazos, filtros por caso e responsável e ações (concluir, reagendar e recalcular).
- O Projuris assume a mão única por desenho e diz isso na tela (status e última sincronização). É uma resposta simples ao problema de qual lado vale.
- No modelo Doctoralia, a agenda externa entra só como "ocupado" para calcular disponibilidade. Para o ENSPACE, o Outlook pode entrar como camada de ocupação (faixa cinza) em vez de eventos completos misturados aos do sistema.

### Gaps
- Não achei fonte primária sobre como o Astrea e o Legal One resolvem conflito (edição dos 2 lados) e duplicidade.

## 6. Consoles de despacho e agendamento: lista de trabalho sem data + faixas por recurso + arrastar para atribuir

### Takeaway
O Salesforce Field Service é o modelo de referência. Lista de atendimentos à esquerda (com filtros "In Jeopardy" e não agendados), Gantt com 1 linha por técnico, mapa. O usuário arrasta da lista para a linha, ou usa "Schedule" para o sistema escolher. A violação de regra aparece como triângulo amarelo no bloco. No Calendly + CRM, o agendamento nasce no registro (lead, contato, oportunidade), e não numa agenda solta.

### Cited Findings
- Salesforce Field Service, **Scheduling Console** (aberto pelo App Launcher): 3 áreas. Gantt (recursos em linhas, atendimentos em blocos, filtro de recursos, ausências, vários dias), lista de atendimentos abertos e agendados (listas customizadas e filtros para o urgente) e mapa (rotas, trânsito, local exato). O usuário agenda arrastando da lista para o Gantt. — [Trailhead, Get to Know the Scheduling Console](https://trailhead.salesforce.com/content/learn/modules/scheduling-console-basics/get-to-know-the-scheduling-console)
- Fluxo do despachante, em 9 passos. (1) **"All Service Appointments"** → **"In Jeopardy"** para ver o que vai estourar o prazo. (2) Filtrar os não agendados, sem técnico nem horário. (3) Selecionar e clicar **"Schedule"**: o sistema acha técnico com habilidade e disponibilidade. (4) Ou arrastar para um espaço vazio do Gantt, o caminho que pode criar violação. (5) Triângulo amarelo = violação de regra (técnico sem a habilidade exigida, início antes do permitido). (6) Hover no bloco mostra o detalhe. (7) Clique direito → **"Get candidates"**. (8) Escolher candidato e horário → **"Schedule"**. (9) Clique direito → **"Dispatched"**: o técnico recebe aviso no celular. — [Trailhead, Manage Service Appointments](https://trailhead.salesforce.com/content/learn/modules/field-service-dispatcher-console-for-dispatchers/manage-service-appointments)
- A violação é avaliada contra a política de agendamento selecionada. A ação **Reschedule** no popover reagenda sozinha para um candidato adequado. — [Trailhead, Modify Appointments in the Gantt](https://trailhead.salesforce.com/content/learn/modules/scheduling-console-basics/modify-appointments-in-the-gantt)
- Field sets definem as colunas da lista, o tooltip do Gantt, o lightbox do recurso e os filtros de recurso. — [Trailhead, Customize Dispatcher Console Settings](https://trailhead.salesforce.com/en/content/learn/modules/dispatcher-console-for-admins/customize-dispatcher-console-settings)
- Calendly + Salesforce: a reunião marcada cria um registro CalendlyAction e é anexada ao lead ou contato existente; prospect novo vira lead, contato ou oportunidade. O lead é atribuído a quem recebeu a reunião. O roteamento por dono manda o visitante à página de agendamento do dono do registro no Salesforce. As respostas do formulário de roteamento ficam no Salesforce. — [Calendly Help Center](https://help.calendly.com/hc/en-us/articles/21923904283287); [Calendly, integração Salesforce](https://www.calendly.com/integration/salesforce)
- Contraponto ao Calendly: a Salesforce Ben diz que não há roteamento quando o lead já existe no Salesforce. Isso contradiz a afirmação de roteamento por dono do Calendly, e pode depender de plano ou de data. — [Salesforce Ben, guia da integração Calendly](https://www.salesforceben.com/a-comprehensive-guide-to-salesforce-calendly-integration/)
- Doctoralia: o paciente escolhe horário no perfil do médico. A disponibilidade vem da agenda do médico em tempo real. — [Cronofy, case Docplanner](https://www.cronofy.com/case-studies/medical-appointment-scheduling-docplanner)

### Inferences
- Para o ENSPACE, o desenho transferível tem 4 peças: (a) lista lateral de tarefas e prazos sem data ou com risco de SLA ("In Jeopardy" ↔ tarefa perto de estourar o SLA); (b) faixas por responsável; (c) arrastar da lista para a faixa atribui pessoa e data numa ação só; (d) marca visual de violação (sem habilidade, fora do prazo fatal, pessoa ausente) com hover que diz a regra.
- O tooltip do Gantt definido por field set equivale a escolher quais campos da categoria aparecem no cartão da agenda. Isso cabe no modelo low-code do ENSPACE (campos customizados por categoria).

### Gaps
- O artigo do Trailhead não cobre o indicador de capacidade ou utilização por recurso. Esse ponto ficou sem fonte.
- A documentação da Doctoralia para o profissional (bloquear horário, pausas) não apareceu nas buscas; só o case do Cronofy.

## 7. Reclamações e limitações conhecidas

### Takeaway
As queixas documentadas se concentram em 3 pontos: sincronização com Outlook que falha ou só vai num sentido, prazo que não é tratado como entidade de primeira classe (sem prioridade, contagem só pelo caminho da publicação) e recurso de prazo e audiência preso a plano caro.

### Cited Findings
- Astrea: prioridade só em tarefa, não em prazo. O prazo só se conta quando sai de publicação, e não quando é lançado à mão. Um usuário diz que o sistema não considera recesso, feriado e fim de semana (sem data; contradiz o material da Aurum). — [B2B Stack, avaliações do Astrea](https://www.b2bstack.com.br/product/astrea/avaliacoes?page=2); [B2B Stack, página 9](https://www.b2bstack.com.br/product/astrea/avaliacoes?page=9)
- Astrea: os tipos Prazos e Audiências só existem nos planos Company e VIP. O plano Light gratuito limita a 40 processos monitorados. — [Aurum, Agenda para advogados](https://www.aurum.com.br/blog/agenda-para-advogados)
- Astrea, Reclame Aqui: há reclamação com o título "Decepção com o Astrea: promessa comercial não cumpre a realidade, suporte ruim e limitações graves na plataforma". O conteúdo não foi lido (HTTP 403). — [Reclame Aqui, Aurum](https://www.reclameaqui.com.br/aurum/decepcao-com-o-astrea-promessa-comercial-nao-cumpre-a-realidade-suporte-ruim-e-limitacoes-graves-na-plataforma_ZLyD4iACrsk48yYh/)
- Clio: avaliador diz que a sincronização com o Outlook nem sempre funciona. Outros avaliadores reclamam da demora do suporte. — [SpotSaaS, avaliações do Clio](https://www.spotsaas.com/product/clio/reviews?page=27); [TrustRadius, Clio](https://www.trustradius.com/products/clio/reviews/support-rating)
- Clio: regra de tribunal só a partir do plano Essentials (fonte de terceiro); a API do Clio confirma que o recurso não existe em todos os planos. — [caeluslaw (terceiro)](https://caeluslaw.pages.dev/features/clio-calendar); [Clio Jurisdictions To Triggers API](https://apis.io/apis/clio/clio-jurisdictions-to-triggers-api/)
- MyCase: a própria central de ajuda avisa que eventos já existentes no Outlook não aparecem no MyCase, que só a agenda "MyCase" sincroniza e que datas de SOL não sincronizam. — [MyCase, Outlook Calendar Sync FAQ](https://supportcenter.mycase.com/en/articles/12624867-outlook-calendar-sync-faq)
- Projuris: o que se cria ou apaga no Outlook não volta. O evento apagado no Outlook reaparece. — [Projuris, Agenda jurídica no Outlook](https://www.projuris.com.br/blog/agenda-juridica-2/)
- Filevine: prazos importados do Timely não aparecem como Deadline Chains. — [Filevine Support, Timely](https://support.filevine.com/hc/en-us/articles/360058318352-Timely)
- Salesforce Field Service: mover 1 atendimento ligado não move o par (resposta de comunidade de 2024, não oficial). Um despachante não via ausências no Gantt até desmarcar uma configuração (comunidade, 2023). — [Trailblazer Community, fslgantt](https://trailhead.salesforce.com/trailblazer-community/topics/fslgantt); [Trailblazer Community, fsldispatcherconsole](https://trailhead.salesforce.com/trailblazer-community/topics/fsldispatcherconsole)

### Inferences
- As limitações dos jurídicos ficam na fronteira com a agenda externa e na falta de tipo próprio para o prazo. A agenda nativa do ENSPACE se diferencia se o prazo processual tiver tipo, prioridade e as 2 datas (fatal e interna), venha ele de publicação ou de lançamento manual.

### Gaps
- Reclame Aqui do Projuris, da ADVBOX e do Legal One sobre agenda não foram pesquisados a fundo; o site bloqueou a leitura.
- Não há avaliação independente da ADVBOX nas fontes lidas; tudo vem do fabricante.

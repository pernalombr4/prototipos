# Pesquisa: esperar até uma data relativa a um campo

Pesquisa feita em 14/10/2026, só com fonte pública: documentação oficial, código aberto e fórum. Cobre as 5
obrigatórias (Notion, Twenty CRM, ClickUp, monday, Pipefy) e 8 de automação (n8n, Zapier, Make, Power
Automate, HubSpot, Salesforce Flow, ActiveCampaign, Pipedrive).

**Sem print de referência nesta rodada.** Nenhum produto foi aberto na tela; as páginas de ajuda do monday,
ClickUp, ActiveCampaign e Salesforce Help deram 403, e o texto delas vem do trecho que a busca trouxe.

Legenda de cada afirmação:
- **[doc]**: confirmado na documentação oficial ou no código-fonte.
- **[fórum]**: relato de usuário ou consultor, sem confirmação oficial.
- **[dedução]**: inferência, a testar.

## Resumo em 4 linhas

- **2 modos de espera em todo lugar:** "por um tempo" e "até um momento".
- **Para pessoa leiga, ninguém pede fórmula:** HubSpot, Salesforce e ActiveCampaign montam "30 dias antes do
  campo" com campo, número, unidade e direção.
- **As ferramentas técnicas pedem expressão** (n8n, Zapier, Make, Power Automate), e 3 delas não esperam meses.
- **Nenhum mostra a data calculada num item real antes de salvar.** É a chance do Spaceflow.

## Resumo em 1 tabela

| Produto | Espera até data de campo | Deslocamento antes/depois | Data passada | Campo muda depois |
|---|---|---|---|---|
| HubSpot | Sim, nativo, sem fórmula | Sim: "Before date" / "After date", em dias, horas ou minutos | Segue na hora; ramo opcional "After the date" | Não documentado |
| Salesforce Flow | Sim (Scheduled Path) | Sim: "Days Before", "Hours After", meses | Não documentado | Pode rodar de novo na data nova (nota de release) |
| ActiveCampaign | Sim: "Wait until custom date field matches" | Sim, dias antes ou depois | Escolha: continua ou sai | Não documentado; campo vazio fica esperando |
| Pipedrive | Só como gatilho ("Date trigger") | Sim, até 180 dias antes ou depois | Não documentado | Não documentado |
| monday.com | Só como gatilho ("When date arrives") | Sim, dias antes ou depois | Não documentado | Não roda de novo [fórum] |
| ClickUp | Só como gatilho ("Due date arrives") | Disputado: sem "antes" no gatilho de vencimento [fórum] | Não documentado | Não documentado |
| Pipefy | Não; contorno com 2 automações | "Relative", "Exactly" N dias "ahead" | Não documentado | Não documentado |
| Notion | Não | Não | Não se aplica | Não se aplica |
| Twenty CRM | Sim: Delay "Scheduled Date" com variável | Não (sem campo de deslocamento) | **Erro**: o fluxo falha | Não |
| Zapier | Sim: "Delay Until" com campo mapeado | Só com passo extra (Formatter) | Escolha da tolerância; padrão 1 dia | Não; máximo de 1 mês |
| n8n | Sim: Wait "At Specified Time" com expressão | Só por expressão Luxon | Não documentado | Não |
| Make | Não (Sleep vai até 300 segundos) | Por fórmula addDays em outro desenho | Não se aplica | Não se aplica |
| Power Automate | Sim: "Delay until" com expressão | Só por expressão addDays | Não documentado | Não; execução morre em 30 dias |

O vencimento do cliente costuma estar a meses ou anos. Zapier (1 mês) e Power Automate (30 dias por
execução) não atendem esse prazo com 1 passo só.

---

## Automação

### HubSpot (workflows): o melhor exemplo para pessoa leiga

Como funciona, em passos [doc]:
1. No fluxo, clicar em **+** e escolher **Delay**.
2. Em "Delay type", escolher **Until a date property**.
3. Em "Property", escolher a propriedade de data do registro.
4. Em "Perform this action", marcar **On date**, **Before date** ou **After date**.
5. Em "Before" ou "After", digitar o número e escolher dias, horas ou minutos.
6. Horário: **Use the time from the date property** (só para data com hora) ou **Choose a custom time**.
7. Fuso: do portal ou do contato (o do contato vem do IP e cai no do portal se faltar).
8. Opcional: **Yes, add a branch** cria 3 saídas: "On the date", "After the date" e "Date property unknown".

Outros tipos de espera no mesmo menu [doc]: "For a set amount of time" (com opção de só dias úteis),
"Until a calendar date", "Until a day or time", "Until an event occurs".

| Ponto | Resposta |
|---|---|
| Aceita campo | Sim, é o próprio objeto da espera [doc] |
| Deslocamento | Antes ou depois, em dias, horas ou minutos [doc] |
| Horário do dia | Sim, do campo ou fixo [doc] |
| Fuso | Do portal ou do contato [doc] |
| Data já passou | Sem ramo, o registro segue na hora; com ramo, vai para "After the date" [doc] |
| Campo vazio | Vai para "Date property unknown" quando o ramo existe [doc]; sem ramo, não documentado |
| Campo muda durante a espera | Não documentado. Editar a configuração do atraso reprograma quem espera [doc] |
| Prévia da data calculada | Não. A tela "View records waiting in a delay" mostra quantos esperam e o tempo restante [doc] |

Vocabulário útil: "Until a date property", "Before date", "After date", "Date property unknown".

Fonte: https://knowledge.hubspot.com/workflows/use-delays e https://knowledge.hubspot.com/workflows/use-date-delays

### Salesforce Flow (Scheduled Paths)

Como funciona [doc, Trailhead]:
1. No fluxo disparado por registro (criar ou atualizar), ligar "Actions and Related Records".
2. Adicionar um **Scheduled Path** e dar nome (ex.: "30 Days Before Close").
3. **Time Source**: "When Record is Created or Updated" ou um campo de data do registro (ex.: Close Date).
4. **Offset Number**: o número (ex.: 30).
5. **Offset Options**: unidade e direção juntas (ex.: "Days Before", "Days After"; minutos, horas, dias, meses).

| Ponto | Resposta |
|---|---|
| Aceita campo | Sim, o campo é a "Time Source" [doc] |
| Deslocamento | Antes ou depois; minutos, horas, dias, meses [doc] |
| Horário e fuso | Não achei na doc pública de Scheduled Path |
| Data já passou | Não documentado na fonte que abri |
| Campo muda depois | Nota de release: com fluxo disparado por atualização e Time Source em campo, uma data futura nova faz o caminho rodar nessa data, mesmo que já tenha rodado [doc, release Spring '21]. No Process Builder antigo, a doc diz que o horário é recalculado e a ação é cancelada se o registro sair do critério [doc] |
| Prévia | Não [dedução] |

Observação: o nome do caminho costuma repetir a regra ("30 Days Before Close"), o que vira uma prévia em
texto feita à mão.

Fontes: https://trailhead.salesforce.com/content/learn/modules/record-triggered-flows/add-a-scheduled-task-to-your-flow,
https://help.salesforce.com/s/articleView?language=en_US&id=release-notes.rn_forcecom_flow_fbuilder_scheduled_paths.htm&type=5&release=230.19.0,
https://help.salesforce.com/s/articleView?id=platform.process_limits_scheduled_processing.htm&language=en_US&type=5

### ActiveCampaign ("Wait")

Como funciona [doc, pela busca; a página deu 403 no fetch]:
1. Criar antes um campo personalizado de data no contato.
2. Na automação, ação **Wait**, opção **Wait until custom date field matches** (recomendada pela própria
   ActiveCampaign desde janeiro de 2025).
3. Escolher o campo e: igual a hoje, ou N dias antes, ou N dias depois.

| Ponto | Resposta |
|---|---|
| Aceita campo | Sim, campo de data personalizado [doc] |
| Deslocamento | Dias antes ou depois [doc] |
| Data já passou | A pessoa escolhe: o contato continua ou sai da automação [doc] |
| Campo vazio | O contato fica parado no Wait até o campo ganhar valor [doc] |
| Campo muda | Não documentado |
| Data com hora | Campo "Date & Time" não funciona com janela relativa [doc] |

Fontes: https://help.activecampaign.com/hc/en-us/articles/18125306552220,
https://help.activecampaign.com/hc/en-us/articles/115001351304

### Pipedrive (gatilho, não espera)

Como funciona [doc]:
1. Criar automação e escolher o gatilho **Date trigger** (atividade, negócio, organização, pessoa).
2. Escolher o campo de data (padrão ou personalizado).
3. Escolher: data exata, antes da data ou depois da data, com N dias (até 180).
4. Escolher hora e fuso da execução.

Não é espera dentro do fluxo: o fluxo começa na data. Plano Growth ou superior. Data passada e mudança do
campo: não documentados.

Fonte: https://support.pipedrive.com/en/article/automations-date-triggers

### Zapier ("Delay by Zapier")

Como funciona [doc]:
1. Adicionar o passo **Delay by Zapier**, evento **Delay Until**.
2. Em **Date/Time Delayed Until**, digitar uma data ou mapear um campo de passo anterior.
3. Em **How Should We Handle Dates In The Past?**, escolher a tolerância: seguir se atrasou até 15 minutos,
   até 1 hora, até 1 dia (padrão) ou sempre seguir.

Para "30 dias antes" é preciso um passo antes [doc]: **Formatter by Zapier**, Date/Time, **Add/Subtract
Time**, com expressão no formato "-30 days" (sinal, número, espaço, unidade). Exemplos da doc:
"+8 hours 1 minute", "-1 day +8 hours". O formato é rígido: "- 2 days" e "+1month" falham [doc, artigo da
comunidade Zapier].

| Ponto | Resposta |
|---|---|
| Aceita campo | Sim [doc] |
| Deslocamento | Só com Formatter [doc] |
| Limite | Espera máxima de 1 mês [doc] |
| Data já passou | Segue na hora se fora da tolerância escolhida [doc] |
| Campo muda | Não; o passo guarda a data calculada. Mudar o Zap durante a espera mata a execução [doc] |
| Fuso | Não documentado no artigo |
| Prévia | Só no teste do passo ("Data out") [doc] |

O campo de tolerância é o único rótulo do mercado que pergunta à pessoa o que fazer com data passada.

Fontes: https://help.zapier.com/hc/en-us/articles/8496288754829-Add-delays-to-Zaps,
https://help.zapier.com/hc/en-us/articles/31162113958925,
https://community.zapier.com/featured-articles-65/formatter-features-date-add-subtract-compare-11002

### n8n (nó Wait)

Como funciona [doc]:
1. Nó **Wait**, campo "Resume": **After Time Interval**, **At Specified Time**, **On Webhook Call** ou
   **On Form Submitted**.
2. "After Time Interval": **Wait Amount** + **Wait Unit** (segundos, minutos, horas, dias). É o desenho
   atual do Spaceflow.
3. "At Specified Time": **Date and Time**, com seletor de data ou expressão.

Para "30 dias antes do campo", só expressão Luxon [doc, cookbook]: o padrão documentado é
`DateTime.fromISO(<data>).minus({days: 30})`. O `{{ $json.date.minus(30,'days') }}` do pedido só funciona
se o campo já for DateTime; vindo como texto, precisa de `toDateTime()` ou `DateTime.fromISO` [dedução].

| Ponto | Resposta |
|---|---|
| Aceita campo | Sim, por expressão [doc] |
| Deslocamento | Só por expressão [doc] |
| Unidades | Segundos a dias no intervalo; qualquer unidade Luxon na expressão [doc] |
| Fuso | A doc do nó diz que vale o fuso do servidor; o código lê o fuso do workflow e converte para UTC. Divergência entre doc e código [doc + código] |
| Data já passou | Não documentado. O código não barra data passada; a retomada fica com o agendador, o que indica seguir logo [dedução] |
| Valor negativo no intervalo | Barrado pelo código (precisa ser 0 ou mais) [código] |
| Campo muda | Não; a data é calculada uma vez [dedução] |
| Longa duração | Esperas longas ficam salvas no banco [doc] |

Fontes: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/,
https://docs.n8n.io/code/cookbook/luxon/,
https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Wait/Wait.node.ts

### Make (Sleep)

- O módulo **Sleep** espera no máximo 300 segundos; um módulo tem limite de 5 minutos e o cenário de 40
  minutos [fórum, moderadores do Make].
- Não existe "esperar até uma data" nativo [fórum].
- Contorno recomendado: gravar o item num **Data Store** com a data-alvo calculada
  (`addDays(<data>; -30)`, formatado com `formatDate`) e ter um segundo cenário agendado que processa só
  os itens cuja data chegou [fórum].
- Data passada, fuso e mudança do campo: ficam por conta de quem monta o segundo cenário.

Fontes: https://community.make.com/t/can-we-make-the-module-sleep-for-more-than-5-minutes-in-make/46281,
https://community.make.com/t/how-can-i-sleep-a-scenario-until-7-30am-not-just-seconds-delay-pro-plan-only-seeing-seconds/97622,
https://www.xray.tech/post/date-time-functions-make

### Power Automate (Schedule: Delay e Delay until)

- **Delay**: quantidade + unidade [fórum, blogs].
- **Delay until**: um carimbo de data em UTC, digitado ou vindo de expressão [fórum].
- "30 dias antes": expressão `addDays(<campo>, -30)`; para subtrair use `sub()`, nunca o sinal de menos
  solto [fórum].
- Fuso: o carimbo precisa estar em UTC; no horário de verão sai 1 hora deslocado se a pessoa não converter
  [fórum].
- Limite: uma execução vive no máximo 30 dias, contando a espera. Esperar até uma data mais distante não
  retoma [fórum, citando a página de limites da Microsoft].
- Data passada: não achei na doc; a hipótese comum é seguir na hora [dedução].
- Campo muda: não recalcula [dedução].
- No Power Automate Desktop, a ação "Add to datetime" aceita valor negativo, em segundos a anos [doc].

Fontes: https://go.collab365.com/how-to-use-the-delay-delay-until-actions-in-power-automate,
https://go.collab365.com/overcoming-power-automate-30-day-limits,
https://powerusers.microsoft.com/t5/Building-Flows/Delay-until-not-working/m-p/2124543,
https://learn.microsoft.com/en-us/power-automate/desktop-flows/actions-reference/datetime

---

## Gestão de trabalho

### Notion (automações de database)

- Gatilhos: "Page added", "Property edited", "Every {frequency}" [doc].
- Não há gatilho de data chegando nem espera dentro da automação [doc].
- Data relativa só como fórmula (`dateAdd`), que não dispara nada [fórum].

Resposta: **não tem**. Fonte: https://www.notion.com/help/database-automations

### Twenty CRM (workflows, código aberto)

O código está em `packages/twenty-server/src/modules/workflow/workflow-executor/workflow-actions/delay/`.

- Ação **Delay** com 2 modos [doc + código]:
  - **Duration**: dias, horas, minutos e segundos juntos (`duration: { days, hours, minutes, seconds }`).
  - **Scheduled Date**: uma data e hora (`scheduledDateTime`), que pode vir de variável de passo anterior.
- Não há campo de deslocamento. "30 dias antes do campo" não tem como montar sem um passo de código antes
  [código + dedução].
- Data passada: o fluxo **falha** com a mensagem "Scheduled date cannot be in the past" [código + doc].
- Data inválida: não é barrada antes e quebra adiante [código].
- Sem limite máximo de espera; esperar não gasta crédito [doc].
- Existe também a ação `wait-for-event` [código].
- Campo muda: não recalcula; o momento de retomar é gravado uma vez [código].

Fontes: https://docs.twenty.com/user-guide/workflows/capabilities/workflow-actions,
https://github.com/twentyhq/twenty/tree/main/packages/twenty-server/src/modules/workflow/workflow-executor/workflow-actions/delay

### ClickUp (Automations)

- Gatilhos de data: **Due date arrives** e **Start date arrives**. Disparam às 4h, hora local, no dia [doc,
  pela busca; a página da ajuda deu 403 no fetch].
- A ajuda cita um gatilho de data antes/depois, com padrão "1 Day Before The start date" e exemplo de "10
  dias antes do vencimento" [doc, pela busca].
- O pedido "7 dias antes do vencimento" aparece como "completed" no fórum de ideias, mas usuários dizem em
  2025 e 2026 que ainda não acham a opção [fórum].
- Gatilho para campo de data personalizado: anunciado pela ClickUp [fórum oficial].
- Contorno antigo: segundo campo de data já deslocado [fórum].
- Data passada e mudança do campo: não documentados.

Resposta: **gatilho de data existe; o "X dias antes" é confuso para o próprio usuário**.

Fontes: https://help.clickup.com/hc/en-us/articles/6312128853015,
https://feedback.clickup.com/feature-requests/p/relative-date-time-for-automations-ex-schedule-7-days-before-due-date

### monday.com (Automations)

- Receita de alerta: **When date arrives**, com opção de dias antes ou depois e uma hora fixa [doc, pela
  busca; a página deu 403 no fetch].
- A hora guardada na coluna é ignorada; vale a hora da receita para todos os itens [fórum, blog].
- Coluna de fórmula não serve de gatilho; precisa espelhar numa coluna de data [fórum].
- Mudar a data depois que a automação já rodou não a dispara de novo [fórum].
- Fuso: o de quem criou a automação [fórum].
- Padrão oficial para "N dias depois de um evento": 2 automações e uma coluna de data auxiliar [doc].

Resposta: **tem gatilho "quando a data chegar", com dias antes; não reprograma**.

Fontes: https://support.monday.com/hc/en-us/articles/360000227739-Alerts-and-Reminders-with-Automations,
https://support.monday.com/hc/en-us/articles/36118127125778-Trigger-an-automation-after-a-set-number-of-days,
https://community.monday.com/t/automations-not-running-when-date-column-arrives/123016

### Pipefy (Automations)

Não há "X dias antes" num passo só. O contorno oficial usa 2 automações [doc]:
1. Gatilho **A recurring activity** (ex.: a cada 30 minutos) + ação **Move card** para uma fase de
   lembrete, com cenário no campo de data: **Relative**, **Exactly**, N dias, **ahead**.
2. Gatilho **A card enters a phase** + ação **Send an email template**.

Alternativa [fórum]: uma automação grava num campo de vencimento auxiliar a data relativa ("base + N
dias"), e a segunda dispara quando esse vencimento chega.

- Conta dias corridos, não úteis [doc].
- Data passada e mudança do campo: não documentados.

Resposta: **não tem nativo; contorno com fase ou campo auxiliar**.

Fontes: https://help.pipefy.com/en/articles/7973710-how-to-automatically-send-email-templates-before-or-after-due-dates,
https://community.pipefy.com/ask-the-community-43/how-to-start-a-trigger-x-days-before-a-start-date-1511

---

## O que serve e o que não serve para o ENSPACE

| Produto | Serve | Não serve, e por quê |
|---|---|---|
| HubSpot | Campo + "Before/On/After" + número e unidade; hora do dia e fuso separados; saídas para data passada e campo vazio | O ramo de 3 saídas: no Spaceflow o Atraso tem 1 saída, e ramificar já é papel do nó Condicional |
| Salesforce | O nome do caminho repete a regra ("30 Days Before Close"): vira o resumo no card do nó; recalcular quando o campo muda | Unidade e direção num controle só ("Days Before"): em 3 idiomas, a combinação explode |
| ActiveCampaign | A pergunta "continuar ou sair" quando a data passou | Campo vazio parado para sempre, sem aviso |
| Pipedrive, monday, ClickUp | O vocabulário "dias antes de" | Data como gatilho: no Spaceflow o gatilho já é a criação do contrato, a espera vem depois |
| Pipefy | Nada novo | Pede 2 automações e uma fase de lembrete |
| Notion | Nada | Não tem espera nem gatilho de data |
| Twenty CRM | O modo "data agendada" separado do modo "duração", no mesmo nó | Falhar o fluxo quando a data passou; sem deslocamento |
| Zapier | Perguntar o que fazer com data passada | Passo extra de Formatter com "-30 days"; limite de 1 mês |
| n8n | Os 2 modos no mesmo nó (o desenho atual do Spaceflow é o "After Time Interval" dele) | Expressão Luxon para o deslocamento |
| Make, Power Automate | Nada | Make não espera mais de 300 s; Power Automate morre em 30 dias |

## (1) O padrão que todos seguem

- **2 modos de espera**: "por um tempo" (quantidade + unidade) e "até um momento". Twenty, n8n, Zapier,
  Power Automate e HubSpot separam assim.
- **A data vem de um campo do registro**, escolhido numa lista. Nos produtos para pessoa leiga (HubSpot,
  ActiveCampaign, Pipedrive, monday, Salesforce) não há fórmula: a pessoa escolhe o campo.
- **Deslocamento em 3 peças**: número + unidade + direção. Rótulos: "Before date" / "After date",
  "Days Before", "dias antes" / "dias depois", "ahead".
- **"Na data"** é uma opção à parte, ao lado de antes e depois (HubSpot "On date", Pipedrive "data exata").
- **Unidade principal é dia**; horas e minutos aparecem nos produtos de automação.
- **Hora do dia é configurável** e fica separada da data (HubSpot, Pipedrive, monday, ClickUp às 4h).
- **Ferramentas técnicas pedem expressão** (n8n Luxon, Power Automate `addDays`, Zapier Formatter, Make
  `addDays`). As de negócio escondem o cálculo.
- **Data passada, na maioria: segue na hora**, sem avisar. Exceções: Twenty falha; Zapier e ActiveCampaign
  deixam a pessoa escolher.
- **A data é calculada uma vez**, na entrada da espera. Ninguém documenta recálculo claro quando o campo
  muda, exceto o Salesforce.

## (2) O que nenhum deles faz (oportunidades para o Spaceflow)

- **Prévia em linguagem natural com um item real.** Nenhum mostra "Para o contrato CT-0042, com vencimento
  em 15/03/2027, o fluxo continua em 13/02/2027". O mais perto é o nome do caminho no Salesforce, digitado
  à mão, e o teste de passo do Zapier.
- **Aviso, no editor, de que a data cai no passado** para parte dos itens. Todos descobrem só na execução.
  Dá para contar: "3 dos 40 contratos abertos já estão a menos de 30 dias do vencimento".
- **Escolha explícita do que fazer com data passada**, em linguagem simples. Só Zapier (tolerância) e
  ActiveCampaign (continuar ou sair) perguntam, e com rótulo técnico. Proposta: "Se a data já passou:
  continuar agora / encerrar o fluxo".
- **Recalcular quando o campo muda.** É o pedido mais repetido nos fóruns (monday, HubSpot, Salesforce) e
  nenhum produto de gestão de trabalho faz. Para contrato, renovação e aditivo mudam o vencimento.
- **Caminho para campo vazio** explicado na tela. Só o HubSpot tem ramo "Date property unknown", e só se a
  pessoa pedir. ActiveCampaign espera para sempre sem avisar.
- **Mostrar, no item, que ele está esperando e até quando.** HubSpot mostra a lista de quem espera e o
  tempo restante, mas no fluxo, não no registro.
- **Espera longa sem limite escondido.** Zapier (1 mês) e Power Automate (30 dias) cortam o caso do
  contrato sem avisar no editor.
- **Frase única montada pelos controles**: "Esperar até [30] [dias] [antes de] [Data de vencimento]", lida
  como frase. Os produtos espalham número, unidade, direção e campo em campos soltos.

## Limites desta pesquisa

- Páginas de ajuda do monday, ClickUp, ActiveCampaign e Salesforce Help deram 403 ou não renderizaram; o
  conteúdo delas veio do trecho que a busca trouxe.
- Nenhum produto foi aberto na tela. Tudo marcado [dedução] e [fórum] pede teste antes de virar decisão.

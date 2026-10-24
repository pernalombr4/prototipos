# Fila, desligamento e cota protegem os fluxos

As 21 plataformas protegem fluxos em 3 camadas, e só a do meio fica com quem desenha o fluxo. A conta ou o plano guarda a cota mensal e o limite por minuto (monday, ClickUp, Airtable, Pipefy, Retool, n8n Cloud). O fluxo guarda poucas regras de comportamento, num painel de configurações separado do desenho ou nas configurações do gatilho (n8n, Make, Zapier, HubSpot, Power Automate). O nó guarda retentativa e tempo limite. **O excesso espera na fila por padrão, e descartar exige escolha explícita**: só Inngest, Hatchet, GitHub Actions e Windmill oferecem descarte ou troca pela execução mais nova, sempre em código ou em tela de desenvolvedor. **O desligamento automático por erro repetido aparece em 7 plataformas**, quase sempre como regra fixa, com aviso a 1 pessoa implícita: quem ligou ou editou o fluxo por último. **A detecção de loop em execução existe só no AWS Lambda** (cerca de 16 chamadas na mesma cadeia), no Jodoo e no Salestrekker; os demais avisam no desenho, bloqueiam toda cadeia (Notion) ou não fazem nada (Airtable, ClickUp, Twenty). O teto de custo de IA por execução existe no Zapier (75 tarefas, com pausa para aprovação) e no n8n (10 iterações no nó do agente). Nenhuma plataforma para usuário de negócio deixa pôr um teto diário por fluxo, escolher na tela o destino do excesso ou ver, junto da proteção, quantas execuções ela segurou. Essas 3 lacunas, somadas à tarefa humana que segura a execução por dias, formam o espaço do Spaceflow.

Pesquisa feita em 2026-10-24, com documentação oficial dos fornecedores; fonte de terceiro ou fórum vem marcada no texto. Rótulos de tela aparecem em inglês, como o produto escreve.

## Painel do fluxo, gatilho e nó concentram as regras que o usuário muda

Quem constrói fluxo encontra a proteção em 5 lugares, e cada plataforma escolhe 2 ou 3 deles. A tabela mostra onde cada uma põe o que o usuário pode mudar.

| Lugar | Plataformas | Como se chega | Exemplos de rótulo |
|---|---|---|---|
| Painel de configurações do fluxo, fora do desenho | n8n, Make, Zapier, HubSpot, Windmill | n8n: menu de 3 pontos > Settings, modal "Workflow settings". Make: engrenagem no Scenario Builder. Zapier: ícone de advanced settings na barra lateral do editor. HubSpot: "Settings" no topo à esquerda. Windmill: "Flow Settings" > aba "Concurrency" | "Timeout Workflow", "Errors before deactivation", "Flood protection", "Run actions at specific times only" |
| Configurações do gatilho | Power Automate, HubSpot, Salesforce, Twenty | Power Automate: 3 pontos do gatilho > Settings. HubSpot: Edit enrollment trigger > aba Settings | "Concurrency Control", "Re-enroll", "Only when a record is updated to meet the condition requirements" |
| Configurações de cada nó | n8n, Retool, Windmill | aba Settings do nó (n8n), Settings do bloco (Retool), menu Advanced do passo (Windmill) | "Retry On Fail", "On Error", "Max Iterations" |
| Código | Inngest, Trigger.dev, Temporal, Step Functions, GitHub Actions, Airflow, Hatchet | arquivo da função ou do fluxo; a tela serve para observar, pausar e repetir | `concurrency`, `throttle`, `debounce`, `retries` |
| Conta, plano ou instância | monday, ClickUp, Airtable, Pipefy, Notion, Twenty, Salesforce, n8n (concorrência) | página de uso do administrador ou variável de ambiente | cota mensal, limite por minuto |

O n8n concentra mais campos num lugar só. O modal "Workflow settings" reúne ordem de execução, "Error Workflow (to notify when this one errors)", fuso horário, o que guardar do histórico, "Save execution progress" e "Timeout Workflow", que abre o campo "Timeout After" em horas, minutos e segundos ([n8n Docs](https://docs.n8n.io/workflows/settings/)). As regras por nó ficam na aba Settings de cada nó: "Retry On Fail" e "On Error", com as opções "Stop Workflow", "Continue" e "Continue (using error output)" ([n8n Docs: Nodes](https://docs.n8n.io/workflows/components/nodes/)). O Make faz o mesmo na engrenagem do cenário, com "Process data in order", "Store incomplete executions", "Errors before deactivation" e "Cycles per run" ([Make Help](https://help.make.com/scenario-settings)).

O Zapier divide o mesmo conjunto por plano. A barra lateral do editor tem "Flood protection" nos planos pagos; o Enterprise ganha ainda "Autoreplay override", "Error ratio override" e "Polling interval" ([Zapier Help](https://help.zapier.com/hc/en-us/articles/32466537676685)). A notificação de erro fica em outro lugar, no histórico do Zap, em "Error notification settings" ([Zapier Help](https://help.zapier.com/hc/en-us/articles/8496289225229)). O Power Automate põe a proteção de volume no gatilho: "Concurrency Control" e o grau de paralelismo ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers)).

Os rótulos estão migrando do termo técnico para o efeito. O Make trocou "Sequential processing" por "Process data in order" e "Number of consecutive errors" por "Errors before deactivation" ([Make Help](https://help.make.com/scenario-settings)). O Zapier trocou "Held" por "On hold" e escreve o valor recomendado no próprio rótulo: "Turn off if errors occur (recommended)" ([Zapier Help](https://help.zapier.com/hc/en-us/articles/20505304170637); [Zapier Help](https://help.zapier.com/hc/en-us/articles/8496216132621-Zap-is-not-running)). O n8n põe a finalidade entre parênteses no nome do campo. O Power Automate mantém "Concurrency Control" e "Degree of Parallelism" ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config)). Mesmo o rótulo simples gera dúvida quando o status não diz o motivo: o fórum do Zapier tem usuários perguntando o que significa "tasks being held" ([Zapier Community](https://community.zapier.com/how-do-i-3/tasks-being-held-what-does-that-mean-43163)), e o Zapier respondeu com uma página só de motivos e correções ([Zapier Help](https://help.zapier.com/hc/en-us/articles/37454233721869-How-to-troubleshoot-held-Zap-or-step-runs)).

## O excesso espera na fila por padrão; descartar é escolha explícita

Teto de volume por período existe em código e quase nunca na tela de negócio. Entre as plataformas visuais, só o Windmill aceita "N execuções por janela de X segundos" no fluxo, com chave opcional por argumento, e só nos planos Cloud e Enterprise ([Windmill](https://www.windmill.dev/docs/flows/concurrency_limit)). O n8n limita execuções simultâneas por instância, não por fluxo, e não conta execução manual, de subfluxo nem de erro ([n8n Docs](https://docs.n8n.io/hosting/scaling/concurrency-control/)).

| Plataforma | Limite publicado | Escopo | Quem muda | Fonte |
|---|---|---|---|---|
| Zapier | segura acima de 100 eventos de uma vez; o teto sobe até 1.500 | Zap com gatilho por consulta periódica (polling) | usuário, plano pago | [Zapier Help](https://help.zapier.com/hc/en-us/articles/32466537676685) |
| Power Automate | 1 a 100 execuções simultâneas; fila de espera de 10 mais o paralelismo | gatilho do fluxo | usuário; ligar não tem volta | [Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config) |
| Make | 1 execução por vez com "Process data in order" | cenário | usuário | [Make Help](https://help.make.com/scenario-settings) |
| Windmill | N execuções por janela de X segundos, com chave | fluxo ou passo | usuário, Cloud e Enterprise | [Windmill](https://www.windmill.dev/docs/flows/concurrency_limit) |
| Retool | 100 execuções do mesmo fluxo em 15 minutos; 200 gatilhos em 10 segundos | fluxo, na Cloud | plataforma | [Retool](https://docs.retool.com/workflows/concepts/limits) |
| n8n Cloud | 5, 20, 50 ou 200 simultâneas, conforme o plano | instância | plano | [n8n Docs (espelho)](https://n8n-docs.teamlab.info/manage-cloud/concurrency/) |
| monday | 250 gatilhos por minuto desaceleram; 4.500 bloqueiam | automação | plataforma | [monday](https://support.monday.com/hc/en-us/articles/9060097050258-Automation-and-integration-rate-limits) |
| Twenty | 100 por minuto entram na fila; acima de 5.000 por hora falham | workspace | administrador do self-host | [Twenty](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/engine/core-modules/twenty-config/config-variables.ts) |
| Airflow | 16 execuções ativas por DAG (o fluxo do Airflow) | DAG | configuração | [Airflow](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html) |
| GitHub Actions | 1 em execução por grupo; até 100 pendentes com `queue: max` | grupo de concorrência | desenvolvedor | [GitHub Docs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency) |

O Power Automate tem 2 armadilhas documentadas. A Microsoft se contradiz sobre o padrão do paralelismo: a página de limites diz 25, e o guia de gatilhos diz 1 ([Microsoft Learn: limites](https://learn.microsoft.com/en-us/power-automate/limits-and-config); [Microsoft Learn: gatilhos](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers)). E ligar o controle de concorrência não tem volta sem apagar e recriar o gatilho. A própria Microsoft recomenda deixá-lo desligado "to ensure all triggers result in flow runs", porque o gatilho que chega com a fila cheia pode se perder ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config)).

O destino do excesso varia, mas a fila sem perda é o padrão dominante.

| Destino do excesso | Quem faz assim | A execução se perde? |
|---|---|---|
| Espera na fila, em ordem de chegada | n8n, Windmill, Make, Inngest (`throttle`, `concurrency`), Trigger.dev, Hatchet (`GROUP_ROUND_ROBIN`), Step Functions (Map), Twenty até 100 por minuto | Não |
| Roda mais devagar | monday (faixa de desaceleração), Power Automate (throttling) | Não |
| Fica retida até uma pessoa confirmar | Zapier ("On hold", e-mail, replay a 1 por segundo) | Não, se a pessoa confirmar |
| Muda para a próxima janela de horário | HubSpot ("Action rescheduled for...") | Não |
| A plataforma descarta a nova | Inngest (`rateLimit`, `singleton: skip`, `idempotency`), Hatchet (`CANCEL_NEWEST`) | Sim, com registro |
| As repetidas viram 1 | Windmill e Trigger.dev (debounce), Inngest (`debounce`, `batchEvents`) | Junta em 1 |
| A nova substitui a antiga | GitHub Actions, Inngest (`singleton: cancel`), Hatchet (`CANCEL_IN_PROGRESS`) | Sim, a antiga |
| Falha com registro | Twenty acima de 5.000 por hora, monday na faixa de bloqueio | Sim |
| Tudo para até o mês virar | ClickUp, Airtable | Fica sem rodar |
| Some sem registro | Power Automate com a fila cheia, ou webhook que chega com o fluxo desligado | Sim |
| Desfaz a gravação de quem salvou | Salesforce (`LimitException`) | Sim |

O n8n processa a fila em ordem de chegada, e a execução enfileirada não aceita retentativa ([n8n Docs](https://docs.n8n.io/hosting/scaling/concurrency-control/)). **O Zapier é o único que segura o excesso e pergunta ao dono**: manda e-mail, guarda os dados do gatilho e reprocessa a 1 execução por segundo, então 1.000 execuções levam pouco mais de 15 minutos ([Zapier Help](https://help.zapier.com/hc/en-us/articles/8496181445261-Flood-protection-limits-in-Zaps)). O status "On hold" cobre 8 motivos, de pico de volume a conta desconectada, e "no data is lost" depois da correção ([Zapier Help](https://help.zapier.com/hc/en-us/articles/37454233721869-How-to-troubleshoot-held-Zap-or-step-runs)).

O monday e o Twenty usam 2 faixas. Na 1ª, o monday desacelera; na 2ª, "Incoming runs will fail with errors, which may raise the automation's error rate and lead to auto-disable" ([monday](https://support.monday.com/hc/en-us/articles/9060097050258-Automation-and-integration-rate-limits)). O Twenty deixa até 100 execuções por minuto entrarem na fila e grava como `FAILED`, com "Throttle limit reached", tudo o que passa de 5.000 por hora ([Twenty](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/workflow/workflow-runner/services/core-workflow-runner.service.ts)). Execução manual pula a fila do Twenty, mas respeita o teto da hora.

O Inngest tem o vocabulário mais claro para separar o que perde do que não perde. `throttle` atrasa o início e "it is not discarded" ([Inngest](https://www.inngest.com/docs/guides/throttling)). `rateLimit` pula o excesso e deve ser usado "only when you can discard excess runs" ([Inngest](https://www.inngest.com/docs/guides/rate-limiting)). `debounce` espera o silêncio e roda 1 vez com o último evento; o campo `timeout` limita quanto tempo os eventos novos podem adiar a execução ([Inngest](https://www.inngest.com/docs/guides/debounce)). O Trigger.dev deixa escolher entre o 1º e o último dado da rajada, com `mode` igual a `leading` ou `trailing` ([Trigger.dev](https://trigger.dev/changelog/debounced-task-runs)).

A deduplicação segue o mesmo desenho em todo lugar: uma chave e uma janela de tempo. O Inngest ignora o evento repetido por 24 horas e o mantém visível no histórico ([Inngest](https://www.inngest.com/docs/guides/handling-idempotency)). O Trigger.dev devolve a execução original por 30 dias e libera a chave quando a execução falha ([Trigger.dev](https://trigger.dev/docs/idempotency)). O Zapier compara o `id` de cada registro do polling com todos os já vistos e zera a lista quando o Zap é desligado ([Zapier Platform](https://platform.zapier.com/build/deduplication)). O Temporal oferece a matriz mais completa: quando o fluxo já terminou, permite repetir, permite só se o anterior falhou ou rejeita; quando ainda está rodando, falha, reaproveita a execução aberta ou encerra a antiga ([Temporal](https://docs.temporal.io/workflow-execution/workflowid-runid)).

## Retentativa fica no nó; o desligamento por erro fica com a plataforma

Retentativa é regra do passo em quase todas as plataformas. A exceção são Make e Zapier, onde retentar significa reprocessar a execução inteira que falhou. Os padrões convergem para backoff exponencial que dobra a espera a partir de 1 segundo.

| Plataforma | Tentativas padrão | 1ª espera | Crescimento | Fonte |
|---|---|---|---|---|
| Temporal (atividade) | ilimitadas | 1 s | ×2, até 100× a 1ª espera | [Temporal](https://docs.temporal.io/encyclopedia/retry-policies) |
| Step Functions | 3 | 1 s | ×2 | [AWS](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html) |
| Inngest | 4 (de 0 a 20) | sem dado | sem dado | [Inngest](https://www.inngest.com/docs/reference/typescript/functions/create) |
| Power Automate, plano Low | até 2 | 5 min | exponencial, até cerca de 10 min | [Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config) |
| Power Automate, Medium e High | até 12 | 7 s | exponencial, até cerca de 1 h | [Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config) |
| HubSpot (webhook) | durante 3 dias | 1 min | crescente, até 8 h entre tentativas | [HubSpot](https://knowledge.hubspot.com/workflows/how-do-i-use-webhooks-with-hubspot-workflows) |
| Airflow | 0 | 300 s | sem dado | [Airflow](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html) |
| Windmill | definido por passo | constante ou exponencial | exemplo: 6, 18, 54, 162 s | [Windmill](https://www.windmill.dev/docs/flows/retries) |

O Temporal tem uma regra que protege o fluxo de efeito duplicado: a atividade retenta por padrão, mas "Workflow Executions do not retry by default" ([Temporal](https://docs.temporal.io/encyclopedia/retry-policies)). O HubSpot não retenta erro 4XX, salvo o 429, e respeita o `Retry-After` ([HubSpot](https://knowledge.hubspot.com/workflows/how-do-i-use-webhooks-with-hubspot-workflows)). O Zapier troca a configuração numérica por 3 opções por Zap no autoreplay: a padrão da conta, "Always Replay" e "Never Replay" ([Zapier Help](https://help.zapier.com/hc/en-us/articles/14167175792909-Decide-how-your-Zap-handles-errors-with-advanced-settings)).

O tempo limite separa 2 relógios: o de esperar para começar e o de rodar. O Inngest tem `timeouts.start` e `timeouts.finish` ([Inngest](https://www.inngest.com/docs/reference/typescript/functions/create)). O n8n deixa o usuário pôr um tempo limite no fluxo, com teto por plano na Cloud ([n8n Docs](https://docs.n8n.io/workflows/settings/)). Nas outras, o teto é fixo: 30 dias por execução no Power Automate, 6 horas por job no GitHub Actions, infinito no Temporal ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config); [GitHub Docs](https://docs.github.com/en/actions/reference/limits); [Temporal](https://docs.temporal.io/encyclopedia/detecting-workflow-failures)).

A espera por uma pessoa recebe tratamento à parte nas plataformas que a têm. O Retool limita a execução assíncrona a 30 horas, mas tira o limite quando o fluxo tem bloco de tarefa de usuário ou de espera, e o bloco de espera aceita até 60 dias ([Retool](https://docs.retool.com/workflows/concepts/limits)). O GitHub Actions conta 35 dias por execução, com espera e aprovação incluídas ([GitHub Docs](https://docs.github.com/en/actions/reference/limits)). **O Inngest não ocupa vaga de concorrência durante a espera**: "step.sleep(), step.sleepUntil(), step.waitForEvent(), and step.invoke() do not use a slot while they wait" ([Inngest](https://www.inngest.com/docs/guides/concurrency)). O Trigger.dev libera a vaga só quando a execução é salva em ponto de espera, 60 segundos depois do início da espera ([Trigger.dev](https://trigger.dev/docs/queue-concurrency)).

O desligamento automático por erro aparece em 7 plataformas. Só o Make deixa o usuário escolher o número.

| Plataforma | Quando desliga | Quem define | Fonte |
|---|---|---|---|
| Make | após N erros seguidos ("Errors before deactivation"); com gatilho instantâneo, no 1º erro | usuário | [Make Help](https://help.make.com/scenario-settings) |
| Zapier | 95% de erro nos últimos 7 dias, com mais de 20 execuções; carência de 24 h no Team e 72 h no Enterprise | plataforma, com exceção por Zap | [Zapier Help](https://help.zapier.com/hc/en-us/articles/8496216132621-Zap-is-not-running) |
| Power Automate | 14 dias de falha contínua ou de throttling; 90 dias sem gatilho, com aviso 30 dias antes | plataforma | [Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config) |
| Notion | qualquer erro numa automação que funcionava | plataforma | [Notion](https://www.notion.com/help/database-automations) |
| monday | limite de taxa, loop, limite de itens, dono desativado | plataforma | [monday](https://support.monday.com/hc/en-us/articles/360010415679-Why-is-my-automation-deactivated) |
| Airtable | problema de autenticação na conta conectada | plataforma | [Airtable](https://support.airtable.com/articles/6756755850-troubleshooting-airtable-automations) |
| Airflow | `max_consecutive_failed_dag_runs`, padrão 0 (nunca), experimental | configuração | [Airflow](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html) |

O Zapier distingue o erro que conta para o desligamento. "Safely halted" e "Handled error" não desligam o Zap quando se repetem; "Errored" repetido desliga ([Zapier Help](https://help.zapier.com/hc/en-us/articles/20505304170637)). O Inngest pausa sem perder: durante a pausa, a plataforma "still receives and stores those events, but skips the paused function", e o usuário reprocessa depois o período pausado ([Inngest](https://www.inngest.com/docs/guides/pause-functions)).

O aviso de falha vai para 1 pessoa implícita na maioria dos casos. O Airtable avisa quem ligou a automação e, se essa pessoa sai, todos os donos do workspace ([Airtable](https://support.airtable.com/articles/6756755850-troubleshooting-airtable-automations)). O Salesforce avisa, por padrão, quem editou o fluxo por último, numa regra única para a organização inteira ([Salesforce Help](https://help.salesforce.com/s/articleView?language=en_US&id=platform.flow_troubleshoot_error_email.htm&type=5)). Só Airtable (assinantes) e HubSpot (usuários e times, no Enterprise) deixam escolher quem recebe ([HubSpot](https://knowledge.hubspot.com/workflows/manage-your-workflow-settings)). O Zapier deixa escolher a frequência: "Immediately", "Immediately, then hourly summary", "Hourly summary" ou "Never" ([Zapier Help](https://help.zapier.com/hc/en-us/articles/8496289225229)). O monday admite que alguns motivos de desativação não geram notificação e aparecem só na página de automações do quadro ([monday](https://support.monday.com/hc/en-us/articles/360010415679-Why-is-my-automation-deactivated)).

O fluxo de erro é a alternativa ao desligamento nas plataformas para desenvolvedor e no n8n. O "Error Workflow" do n8n começa pelo nó Error Trigger e recebe a execução, o último nó e a mensagem ([n8n Docs](https://docs.n8n.io/flow-logic/error-handling/)). O Windmill roda um passo especial quando as retentativas acabam, e o fluxo termina com falha, salvo se esse passo devolver `recover: true` ([Windmill](https://www.windmill.dev/docs/flows/flow_error_handler)). O Step Functions desvia para um estado de reserva com `Catch` ([AWS](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html)).

## Cota mensal e janela de horário pertencem à conta, não ao fluxo

Toda cota mensal das plataformas de negócio vale para a conta. Nenhuma das 8 plataformas de gestão e CRM pesquisadas deixa o usuário pôr cota em 1 automação.

| Plataforma | Cota mensal (planos) | O que conta | Ao estourar | Fonte |
|---|---|---|---|---|
| monday | 25.000 ações no Pro; até 250.000 no Enterprise | cada ação, cada passo de condição, 1 por pessoa notificada | o excesso sai do mês seguinte; com o mês esgotado, a conta não edita nem cria automação | [monday](https://support.monday.com/hc/en-us/articles/11381357489810-monday-workflows-active-workflows-and-actions) |
| ClickUp | 100 (Free), 1.000 (Unlimited), 5.000 (Business), 25.000 (Business Plus), 250.000 (Enterprise) | ações | todas as automações do workspace param até o mês virar; aviso em 90% e 100% | [ClickUp](https://help.clickup.com/hc/en-us/articles/23477062949911-Automations-feature-availability-and-limits) |
| Airtable | 100 (Free), 25.000 (Team), 100.000 (Business), 500.000 (Enterprise Scale) | toda execução, inclusive a que falha | param até o dia 1 do mês seguinte | [Airtable](https://support.airtable.com/articles/3669392397-getting-started-with-airtable-automations) |
| Pipefy | 15 (Starter), 300 (Business), 2.000 (Enterprise) | cada disparo, mesmo com a condição falsa | comprar pacote ou mudar de plano | [Pipefy](https://help.pipefy.com/en/articles/6445865-how-pipefy-enumerates-automation-jobs-vs-automation-rules) |

**Execução que não faz nada também custa.** O Pipefy cobra a verificação: "The verification itself is an automation job, even if the action doesn't happen" ([Pipefy](https://help.pipefy.com/en/articles/6445865-how-pipefy-enumerates-automation-jobs-vs-automation-rules)). O monday cobra o passo de condição, e o Airtable cobra a execução que falhou ([monday](https://support.monday.com/hc/en-us/articles/11381357489810-monday-workflows-active-workflows-and-actions); [Airtable](https://support.airtable.com/articles/3669392397-getting-started-with-airtable-automations)). Por isso o loop vira problema de custo, além de estabilidade. O suporte do Airtable chega a zerar o contador depois de um loop acidental ([Airtable](https://support.airtable.com/docs/troubleshooting-airtable-automations)).

A janela de horário por fluxo aparece completa só no HubSpot. O painel "Settings" tem "Run actions at specific times only", com dias e horas no fuso da conta; "Don't run actions on specific dates", com datas que se repetem todo ano; e "Schedule workflow to turn off automatically", que desliga o fluxo numa data marcada ([HubSpot](https://knowledge.hubspot.com/workflows/manage-your-workflow-settings)). Fora da janela, o registro entra no fluxo, e a ação muda para o próximo horário permitido, com a mensagem "Outside time window settings. Action rescheduled for [new date and time]" ([HubSpot](https://knowledge.hubspot.com/workflows/troubleshoot-common-workflow-errors)). O Make limita a janela no agendamento do gatilho, segundo o fórum do próprio Make ([Make Community](https://community.make.com/t/can-i-make-a-scenario-run-only-in-the-day-time/100444)). O n8n aplica o fuso do fluxo ao gatilho agendado ([n8n Docs](https://docs.n8n.io/workflows/settings/)). Para gatilho agendado, o Retool exige que a execução anterior termine antes da próxima começar ([Retool](https://docs.retool.com/workflows/concepts/limits)).

O HubSpot tem ainda a regra mais simples contra repetição por registro: a reinscrição vem desligada. O registro entra no fluxo só na 1ª vez que cumpre o gatilho, e o registro em andamento não entra de novo até terminar ([HubSpot](https://knowledge.hubspot.com/workflows/manage-workflow-enrollment-settings)). O Salesforce chega ao mesmo efeito com a opção de entrada "only when the record is updated to meet the condition requirements" e a comparação com `$Record__Prior` ([Salesforce Architects](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered)).

## Loop e custo de IA têm a proteção mais rara

O fluxo que dispara a si mesmo é o incidente mais citado nos fóruns. Uma automação do Airtable mandou 1 e-mail por segundo durante cerca de 2 horas ([Airtable Community](https://community.airtable.com/automations-8/automation-sending-e-mails-in-infinite-loop-23565)). Uma do monday criou 1 item novo a cada 15 segundos em outro quadro, e o usuário resolveu apagando e recriando a automação ([monday Community](https://community.monday.com/t/why-does-an-automation-keeping-repeating/23775)). O Zapier documenta o caso da resposta automática que cai no próprio gatilho porque a busca inclui a pasta de enviados ([Zapier Help](https://help.zapier.com/hc/en-us/articles/8496232045453)). As plataformas respondem com 5 estratégias.

| Estratégia | Quem | Como funciona | Fonte |
|---|---|---|---|
| Conta a cadeia e interrompe | AWS Lambda, Jodoo, Salestrekker | Lambda: para em cerca de 16 chamadas na mesma cadeia, ligado por padrão. Jodoo: até 10 níveis. Salestrekker: não redispara a automação que já rodou na cadeia | [AWS](https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html); [Jodoo](https://help.jodoo.com/en/articles/10043744-trigger-validation); [Salestrekker](https://support.salestrekker.com/en/articles/8232619-can-one-automation-start-another) |
| Bloqueia toda cadeia | Notion | "Database automations can't be triggered by other automations" | [Notion](https://www.notion.com/help/database-automations) |
| Avisa no desenho | monday, Pipefy | monday avisa e deixa salvar; Pipefy marca na API os pares de evento e ação que podem formar loop | [monday](https://support.monday.com/hc/en-us/articles/360010415679-Why-is-my-automation-deactivated); [Pipefy](https://developers.pipefy.com/reference/automation-actions) |
| Condiciona a entrada | HubSpot, Salesforce | reinscrição desligada; roda só quando o registro passa a cumprir a condição | [HubSpot](https://knowledge.hubspot.com/workflows/manage-workflow-enrollment-settings); [Salesforce Architects](https://architect.salesforce.com/docs/architect/decision-guides/guide/record-triggered) |
| Nada estrutural | Airtable, ClickUp, Twenty | o loop para na cota ou no limite de taxa | [Airtable](https://support.airtable.com/articles/6756755850-troubleshooting-airtable-automations); [ClickUp](https://help.clickup.com/hc/en-us/articles/6312097314199-Use-Automation-Actions); [Twenty](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/workflow/workflow-trigger/automated-trigger/listeners/workflow-database-event-trigger.listener.ts) |

O Lambda é o modelo mais completo. Rastreia a cadeia sem custo, interrompe a próxima chamada, avisa por e-mail no máximo 1 vez por função a cada 24 horas e deixa o dono escolher entre "Allow recursive loops" e "Terminate recursive loops" ([AWS](https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html)). A chamada interrompida vai para o destino de falha, quando existe. O Twenty já marca a execução disparada por fluxo com a origem `WORKFLOW`, mas o gatilho não usa essa marca para filtrar ([Twenty](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/workflow/workflow-trigger/automated-trigger/listeners/workflow-database-event-trigger.listener.ts)). Um moderador do monday aponta a mesma lacuna: não há como saber se a mudança veio de pessoa ou de automação ([monday Community](https://community.monday.com/t/possible-infinite-loop-caused-by-api-and-monday-integrations-automations/49950)).

O aviso no desenho tem um custo documentado. A comunidade da Tulip pede um aviso de loop mais preciso, por excesso de falso positivo ([Tulip Community](https://community.tulip.co/t/make-automation-loop-warning-more-precise-to-reduce-false-positives/12693)). Aviso que dispara demais ensina o usuário a ignorá-lo.

O teto de custo de IA segue 2 modelos: por execução, com pausa para aprovação, e por período, com aviso em limiar e corte.

| Plataforma | Teto | Ao atingir | Fonte |
|---|---|---|---|
| Zapier | 75 tarefas por execução, ajustável até 500; o passo custa 1×, 3× ou 5× conforme o nível do modelo, desde 2026-06-15 | o passo pausa e pede aprovação no histórico do Zap | [Zapier Help](https://help.zapier.com/hc/en-us/articles/46425475442829) |
| n8n | "Max Iterations", padrão 10, no nó do agente | o agente para de tentar | [n8n Docs](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/openai-functions-agent/) |
| HubSpot | crédito da conta | a ação pausa e retenta a cada 24 horas por até 60 dias | [HubSpot](https://knowledge.hubspot.com/workflows/troubleshoot-common-workflow-errors) |
| Copilot Studio | limite mensal de crédito por agente, com "Stop usage" (fonte de terceiro) | o agente desliga no limite | [Rajeev Pentyala](https://rajeevpentyala.com/2026/09/10/19567/) |
| monday | crédito de IA da conta, aviso em 80% e 100% (fonte de terceiro) | o uso de IA pausa; o resto das automações continua | [Breeze](https://www.breeze.pm/articles/monday-ai-credits-run-out) |

O Zapier põe o Premium como padrão do passo novo em plano pago. Um Premium com 2 chamadas de ferramenta custa 15 tarefas ([Zapier Help](https://help.zapier.com/hc/en-us/articles/46425475442829)). Um comentário de terceiro chama a pausa para aprovação de falha silenciosa em automação que ninguém acompanha ([nocode.tech](https://www.nocode.tech/article/zapiers-ai-step-pricing-is-eating-no-code-budgets-heres-how-to-audit-yours)). Na comunidade do n8n, usuários pedem um teto rígido de chamadas de ferramenta por execução, contra o gasto de tokens em loop de lógica ([n8n Community](https://community.n8n.io/t/feat-ai-tools-add-max-tool-interactions-to-ai-agent-nodes-to-prevent-infinite-loops/295587)).

## O padrão que todos seguem

As 21 plataformas convergem em 8 decisões, mesmo com interfaces diferentes.

| Decisão | Padrão dominante | Valor típico | Quem foge |
|---|---|---|---|
| Onde mora a cota | conta ou plano | mensal, com aviso em 80% a 100% | nenhuma das plataformas de negócio |
| Onde moram as regras do fluxo | painel de configurações separado do desenho, ou o gatilho | 5 a 12 campos | Retool e Windmill põem quase tudo no bloco |
| Destino do excesso | fila em ordem de chegada, sem perda | sem teto de fila publicado | Zapier retém e pergunta; Power Automate perde com a fila cheia |
| Descarte | opção explícita, com nome próprio | janela de 24 horas a 30 dias | nenhuma |
| Retentativa | no nó, com espera que dobra | 3 tentativas, 1 s, ×2 | Airflow (0); Make e Zapier reprocessam a execução inteira |
| Erro repetido | a plataforma desliga o fluxo e avisa | Zapier: 95% em 7 dias; Make: N seguidos | Make deixa escolher N; Airflow vem desligado |
| Quem recebe o aviso | 1 pessoa implícita | quem ligou ou editou por último | Airtable e HubSpot deixam escolher |
| Rótulo | o efeito no lugar do termo técnico, com o valor recomendado escrito | "Process data in order", "(recommended)" | Power Automate e n8n mantêm o termo técnico |

O padrão tem uma lógica comum. A plataforma protege a si mesma com teto fixo na conta e protege o cliente com fila. Ela deixa o usuário mudar só o que não ameaça a infraestrutura: ordem, tempo limite, retentativa, janela e aviso. Quando a perda é possível, o fornecedor dá um nome próprio a ela (`rateLimit`, `Discard data if storage is full`) e escreve o aviso na documentação. O Make avisa que o dado descartado não volta ([Make Help](https://help.make.com/scenario-settings)).

Aplicado aos gatilhos e nós do Spaceflow, o padrão aponta uma proteção já testada em outro produto para cada risco.

| Gatilho ou nó do Spaceflow | Risco documentado em outro produto | Proteção que outro produto já usa |
|---|---|---|
| Ações de Itens por categoria | a ação grava no item e redispara o fluxo (Airtable, Power Automate) | campos observados e filtro (Twenty); "só quando passa a cumprir a condição" (Salesforce); reinscrição desligada (HubSpot); debounce por item (Inngest, Windmill) |
| Webhook | pico de volume; reenvio duplicado; evento perdido com o fluxo desligado (Power Automate) | fila sem perda; chave de idempotência por 24 horas (Inngest); retenção com replay (Zapier) |
| E-mail recebido | resposta automática que volta para a caixa observada (Zapier) | filtro de origem no gatilho; teto de volume com retenção (Zapier) |
| Timer | execução nova antes de a anterior terminar | 1 por vez, a próxima espera a anterior (Retool); fuso do fluxo (n8n); janela de horário (HubSpot) |
| Manual | baixo; quem dispara está olhando | fora do limite de concorrência (n8n); fora da fila, dentro do teto da hora (Twenty) |
| Iniciar Fluxo | cadeia A → B → A | contador de cadeia: cerca de 16 (Lambda), 10 níveis (Jodoo) |
| Nó de IA | gasto de crédito em loop de ferramenta | teto por execução com pausa para aprovação (Zapier); teto de iterações no nó (n8n) |
| Tarefa humana | execução aberta por dias ocupa vaga de concorrência | a espera não ocupa vaga (Inngest); limite de tempo à parte para espera humana (Retool, GitHub Actions) |

## O que nenhum deles faz

7 lacunas aparecem em todas as plataformas para usuário de negócio pesquisadas. A coluna do meio mostra o produto que chega mais perto.

| Lacuna | Quem chega mais perto | Por que pesa no Spaceflow |
|---|---|---|
| Teto diário ou mensal por fluxo, definido por quem desenha | Windmill (janela em segundos, tela de desenvolvedor); Inngest (`rateLimit` até 24 horas, em código) | a cota da conta para todos os fluxos quando 1 fluxo estoura, como no ClickUp e no Airtable |
| Escolha na tela do destino do excesso: fila, descarte ou retenção | Inngest, Hatchet e GitHub Actions, em código; Zapier oferece só retenção | Webhook e E-mail pedem retenção; Ações de Itens pedem debounce; Timer pede descarte da sobreposição |
| Contador do que a proteção segurou, ao lado da proteção | Inngest (gráfico de fila e marca de limite atingido); Trigger.dev (`running` e `queued` na API) | o dono do fluxo não sabe se a proteção trabalhou ou se o fluxo parou de receber evento |
| Contador de cadeia entre fluxos, com aviso no desenho e corte em execução | Lambda corta em execução; monday avisa no desenho; nenhum faz os 2 | o nó Iniciar Fluxo torna a cadeia explícita: a plataforma conhece A → B no desenho e consegue contar em execução |
| Opção "ignorar mudanças feitas por fluxos" no gatilho | Twenty grava a origem `WORKFLOW` e não filtra por ela; o moderador do monday aponta a falta | é a correção mais citada nos fóruns de Power Automate e Workato, sempre montada à mão |
| Teto de crédito de IA por fluxo e por período | Zapier (por execução); Copilot Studio (por agente e por mês, segundo terceiro) | o nó de IA do Spaceflow consome crédito da conta; 1 fluxo em loop esgota o crédito de todos |
| Espera humana fora da conta de concorrência, explicada ao usuário de negócio | Inngest, em código | fluxo com tarefa humana pausa por dias; se a espera ocupar vaga, 10 pedidos parados travam o fluxo inteiro |

A fonte da correção montada à mão, citada na linha 5, são os blogs de Power Automate e a orientação da Workato: condição de gatilho, conta de serviço que fez a última edição, coluna de controle ([Tom Riha](https://tomriha.com/how-to-avoid-infinite-trigger-loop-in-power-automate/); [Workato](https://www.workato.com/product-hub/workato-tip-avoiding-infinite-loops/)).

2 lacunas de informação limitam esta comparação. A pesquisa não achou o padrão do "Errors before deactivation" do Make, a lista de valores do menu "Flood protection" do Zapier nem o prazo de validade da execução retida no Zapier. Também não achou documentação oficial do comportamento do excesso no Pipefy e no Notion nem dos créditos de IA do monday, que vieram de 2 blogs que divergem entre si.

O Spaceflow junta 3 traços que nenhuma das 21 plataformas junta: gatilho por item, nó que chama outro fluxo e tarefa humana que segura a execução por dias. Cada traço muda uma proteção. O gatilho por item pede a chave por item que as plataformas para desenvolvedor já usam (`key` no Inngest, `concurrencyKey` no Trigger.dev), traduzida para "por item". O Iniciar Fluxo transforma a detecção de loop, que nas outras plataformas depende de rastreio, numa conta simples sobre a cadeia que a própria plataforma montou. A tarefa humana obriga a separar "execuções rodando" de "execuções esperando uma pessoa", porque o limite de execuções simultâneas que funciona no Make ou no Power Automate trava um fluxo com aprovação. O padrão de mercado oferece a base: fila sem perda, desligamento com aviso e rótulo que descreve o efeito. As 7 lacunas apontam o que falta construir em cima dela.

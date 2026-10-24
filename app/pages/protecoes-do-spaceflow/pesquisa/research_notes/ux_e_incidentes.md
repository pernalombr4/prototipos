# Proteções de fluxos de automação: UX das proteções e incidentes que as motivaram

Pesquisa feita em 2026-10-24, só com fontes da web. Rótulos de tela citados em inglês, como aparecem no produto. Fonte oficial do fornecedor vem marcada como tal; blog de terceiro e fórum, também.

## Quais produtos mostram as proteções numa aba ou seção própria do fluxo, e como agrupam os campos (rótulos e textos de ajuda)

### Takeaway
Os 4 produtos com documentação clara (Make, n8n, Zapier, Power Automate) põem as proteções num painel de configurações do fluxo, separado do desenho: Make em "Scenario settings" (ícone de engrenagem), n8n no modal "Workflow settings", Zapier na barra lateral "advanced settings" do editor, Power Automate nas "settings" do gatilho. HubSpot usa a aba "Settings" do gatilho de inscrição para controlar reinscrição. O padrão é número escolhido de uma lista ou campo numérico com limite máximo, com um valor marcado como "(recommended)" em 2 casos (Zapier e n8n).

### Cited Findings
**Make (Scenario settings, engrenagem no Scenario Builder)**
- Rótulos atuais: "Process data in order", "Keep data confidential", "Store incomplete executions", "Discard data if storage is full", "Use updated variable values", "Errors before deactivation", "Commit after each module", "Commit trigger last", "Cycles per run" — [Make Help: Scenario settings](https://help.make.com/scenario-settings)
- Os rótulos antigos eram "Sequential processing" e "Allow storing of incomplete executions"; cópias de terceiros (Boost.space, Ibexa Connect, Adobe Workfront Fusion) ainda usam esses nomes — [Make: scenario settings (versão antiga)](https://make.com/en/help/scenarios/scenario-settings); [Adobe Workfront Fusion](https://experienceleague.adobe.com/docs/workfront/using/adobe-workfront-fusion/scenarios-in-fusion/scenario-settings-panel.html?lang=en)
- "Process data in order": termina cada execução antes de começar a próxima e pausa execuções novas até resolver as incompletas; vale também para webhook, que por padrão roda em paralelo — [Make Help](https://help.make.com/scenario-settings)
- A Adobe avisa que o processamento sequencial pode atrasar a execução do cenário — [Adobe Workfront Fusion](https://experienceleague.adobe.com/docs/workfront/using/adobe-workfront-fusion/scenarios-in-fusion/scenario-settings-panel.html?lang=en)
- "Errors before deactivation": número de erros seguidos antes de desativar o cenário; com gatilho instantâneo, o cenário desativa no 1º erro e a configuração é ignorada — [Make Help](https://help.make.com/scenario-settings)
- "Discard data if storage is full": descarta os dados da execução que falhou quando a pasta de execuções incompletas está cheia; o dado descartado não volta. "Keep data confidential" traz aviso de que as opções de resolver erro ficam muito limitadas — [Make Help](https://help.make.com/scenario-settings)
- "Store incomplete executions": os dados guardados contam no limite de armazenamento do plano — [Make: scenario settings (versão antiga)](https://make.com/en/help/scenarios/scenario-settings)
- "Cycles per run": máximo de ciclos numa execução; "Run once" ignora e faz 1 ciclo. A página não diz o padrão da maioria dos campos — [Make Help](https://help.make.com/scenario-settings)

**n8n (modal Workflow settings, menu Workflow > Settings)**
- Rótulos: "Execution order" com opções "v1 (recommended)" e "v0 (legacy)"; "Error Workflow (to notify when this one errors)"; "This workflow can be called by"; "Timezone"; "Save failed production executions"; "Save successful production executions"; "Save manual executions"; "Save execution progress"; "Timeout Workflow" (ao ligar, aparece "Timeout After" em horas, minutos e segundos; o n8n Cloud limita o máximo por plano); "Redact production execution data"; "Redact manual execution data"; "Estimated time saved" — [n8n Docs: Configure workflow settings](https://docs.n8n.io/build/manage-workflows/configure-workflow-settings)
- O fluxo de erro precisa começar pelo nó Error Trigger e pode servir a vários fluxos — [n8n Docs: Error handling](https://docs.n8n.io/flow-logic/error-handling/)
- Proteção de IA fica no próprio nó do agente, não no painel do fluxo: "Max Iterations", padrão 10, descrito como "Enter the number of times the model should run to try and generate a good answer from the user's prompt" — [n8n Docs: OpenAI Functions Agent](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/openai-functions-agent/)

**Zapier (barra lateral do editor > ícone de advanced settings)**
- Passos: abrir o Zap, clicar no ícone de advanced settings na barra lateral esquerda, expandir o menu "Flood protection" e escolher um número da lista. Vale só para gatilho por polling; máximo de 1.500 eventos de uma vez; não existe no plano Free — [Zapier Help: Adjust flood protection limits](https://help.zapier.com/hc/en-us/articles/32466537676685)
- O padrão é segurar quando o gatilho traz mais de 100 registros de uma vez — [Zapier Help: Troubleshoot held runs](https://help.zapier.com/hc/en-us/articles/37454233721869-How-to-troubleshoot-held-Zap-or-step-runs)
- Mesmo com o limite maior, o app de origem pode aplicar rate limit; e se o app limita registros por poll, o Zapier não passa disso — [Zapier Help](https://help.zapier.com/hc/en-us/articles/32466537676685)
- Enterprise ainda muda "Autoreplay override", "Error ratio override" e "Polling interval" — [Zapier Help](https://help.zapier.com/hc/en-us/articles/32466537676685)
- "Error ratio override" tem 2 opções: "Turn off if errors occur (recommended)" (padrão) e "Keep running if errors occur"; Zap com o override ligado nunca entra no período de carência — [Zapier Help: Zap is not running](https://help.zapier.com/hc/en-us/articles/8496216132621-Zap-is-not-running)
- Passo de IA: limite por execução de 75 tarefas (padrão), que pode subir até 500 — [Zapier Help: AI by Zapier model tier pricing](https://help.zapier.com/hc/en-us/articles/46425475442829)

**Power Automate (settings do gatilho)**
- "Concurrency Control" fica nas configurações do gatilho e vem desligado; ligado, aceita de 1 a 100 execuções simultâneas (padrão 25). Ligar não tem volta sem apagar e recriar o gatilho — [Microsoft Learn: Limits of automated, scheduled, and instant flows](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Fila de espera com Concurrency Control ligado: 10 mais o grau de paralelismo; gatilho que chega com a fila cheia pode ser retentado pelo conector e se perder. A própria Microsoft recomenda deixar o Concurrency Control desligado para que todo gatilho vire execução — [Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- "Apply to each": paralelismo padrão 1, ajustável de 1 a 50; até 5.000 itens no plano Low e 100.000 nos outros. "Until": padrão 60 iterações, máximo 5.000 — [Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config)

**HubSpot (Edit > Edit enrollment trigger > aba Settings)**
- Por padrão, o registro entra no fluxo só na 1ª vez que cumpre o gatilho; o interruptor "Re-enroll" libera reinscrição e pede a escolha de quais gatilhos reinscrevem. Registro inscrito não reentra no mesmo fluxo até terminar. A mesma aba tem critérios de desinscrição (sair ao não cumprir mais o critério, ao atingir a meta, ao entrar em segmento de supressão) — [HubSpot KB: Manage workflow enrollment settings](https://knowledge.hubspot.com/workflows/manage-workflow-enrollment-settings)

### Inferences
- Os produtos separam 3 famílias de proteção, mesmo sem nomeá-las assim: volume de entrada (flood protection, concorrência), comportamento diante de erro (desativar após N erros, guardar execução incompleta, fluxo de erro) e limite dentro da execução (ciclos, iterações, tempo limite, tarefas de IA por execução).
- O padrão "valor recomendado escrito no próprio rótulo da opção" aparece no Zapier ("(recommended)") e no n8n ("v1 (recommended)"); é um jeito de orientar sem texto de ajuda separado.
- Proteção que não tem volta (Concurrency Control do Power Automate) ou que perde dado (Discard data do Make) recebe aviso na doc; nada indica aviso na tela no caso do Power Automate.

### Gaps
- Não achei a lista de números que o menu "Flood protection" do Zapier oferece nem o texto de ajuda exato na tela.
- Make não diz o padrão de "Errors before deactivation" nem de "Cycles per run" na página atual.
- Pipefy, ClickUp, monday e Airtable: não achei painel de proteção por fluxo documentado; as buscas trouxeram só fórum e blog de terceiro.
- n8n: a página não lista as opções de "This workflow can be called by".

## Quais status o histórico de execuções usa para execução afetada por limite, e como liberar ou repetir a execução retida

### Takeaway
Zapier é o mais completo: 11 status, com "On hold" (antes "Held") para execução retida por flood protection, conta desconectada ou limite do plano, e "Needs review" para aprovação humana; a execução retida guarda os dados do gatilho e volta com replay. Power Automate desacelera (throttling) sem um status próprio documentado e avisa por e-mail. Make move a execução que falhou para a pasta de execuções incompletas. Airtable usa "cancelled" para execução pendente quando a automação é desligada.

### Cited Findings
**Zapier**
- Os 11 status de execução: Delayed, Errored, Filtered, Handled error, On hold, Needs review, Running, Safely halted, Scheduled, Skipped (só como status de passo), Successful — [Zapier Help: Review run statuses in Zaps](https://help.zapier.com/hc/en-us/articles/20505304170637)
- "On hold": a execução espera a correção de um problema (conta desconectada, limite do plano, flood protection) e os dados do gatilho ficam guardados; dá para repetir (replay) execução ou passo em "On hold" — [Zapier Help: Review run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637)
- "Safely halted" e "Handled error" não desligam o Zap quando se repetem; "Errored" repetido desliga — [Zapier Help: Review run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637)
- "Scheduled": execução com erro na fila para rodar de novo porque o autoreplay está ligado — [Zapier Help: Review run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637)
- Nomes antigos: "Held", "Stopped" (dividido em "Errored" e "Halted"); a API usa valores em minúsculas como `held`, `filtered`, `halted`, `error` — [Zapier Help (antigo)](https://help.zapier.com/hc/en-us/articles/8496291148685); [Zapier API: get zap runs](https://docs.zapier.com/api-reference/workflow/experimental/get-zap-runs.md)
- 8 motivos de execução retida: mais de 100 passos disparados de uma vez (flood protection), app desconectado, limite de tarefas do plano ou app premium fora do plano, pagamento vencido, rebaixamento do plano Team, fim do teste ou mudança de plano, política de acesso a apps do Enterprise, Zap com mais de 100 passos. Com o motivo corrigido, "no data is lost" — [Zapier Help: How to troubleshoot held Zap or step runs](https://help.zapier.com/hc/en-us/articles/37454233721869-How-to-troubleshoot-held-Zap-or-step-runs)
- Para flood protection, o Zapier sugere a ação "delay after queue", que espaça as execuções — [Zapier Help: troubleshoot held runs](https://help.zapier.com/hc/en-us/articles/37454233721869-How-to-troubleshoot-held-Zap-or-step-runs)
- Passo de IA que atinge o limite de tarefas na execução: o Zapier pausa o passo e pede aprovação; a aprovação acontece no Zap history — [Zapier Help: AI by Zapier model tier pricing](https://help.zapier.com/hc/en-us/articles/46425475442829)
- Desligamento por erro: o Zapier desliga o Zap que erra em 95% das vezes e rodou mais de 20 vezes nos últimos 7 dias; nos planos Team e Enterprise, o dono recebe e-mail e um período de carência (24 h no Team, 72 h no Enterprise) — [Zapier Help: Zap is not running](https://help.zapier.com/hc/en-us/articles/8496216132621-Zap-is-not-running)
- O autoreplay vale para o próximo erro, não repete execuções que já falharam (resposta no fórum) — [Zapier Community: Zap was stopped due to high error ratio](https://community.zapier.com/how-do-i-3/zap-was-stopped-due-to-high-error-ratio-how-to-check-for-error-11681)
- Incidente do próprio Zapier: e-mails "High Error Ratio" avisando que o Zap seria desligado foram enviados sem corresponder ao uso real — [Zapier Status](https://status.zapier.com/incidents/01KQZ4FRSDVSVE53CFEJYSVFNP)
- Fórum: usuários perguntam o que significa "tasks being held" e pedem para tirar a flood protection de um Zap; um funcionário diz que o suporte sobe o limite, normalmente até 1.000 por execução — [Zapier Community: tasks being held](https://community.zapier.com/how-do-i-3/tasks-being-held-what-does-that-mean-43163); [Zapier Community: removing flood protection](https://community.zapier.com/how-do-i-3/removing-flood-protection-from-a-specific-zap-96)

**Power Automate**
- Acima do limite de vazão (janela deslizante), a atividade do fluxo desacelera e volta sozinha quando cai abaixo do limite; fluxo acima do limite por 14 dias seguidos é desligado. Fluxo com falha contínua por 14 dias também; fluxo sem gatilho por 90 dias pode ser desligado, com aviso 30 dias antes (licença premium fica fora disso) — [Microsoft Learn: limits and config](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Criador e co-criadores recebem e-mail quando o fluxo começa a sofrer throttling e quando ele é desligado; dá para religar, mas o fluxo volta a ser desligado se continuar acima do limite — [Microsoft Learn: limits and config](https://docs.microsoft.com:443/en-us/power-automate/limits-and-config) (resumo da busca; a frase sobre o e-mail no início do throttling não apareceu no trecho que li da página atual, que diz só "monitor email for notifications")

**Make**
- Com "Store incomplete executions" ligado, a execução que falhou pausa e vai para a pasta de execuções incompletas para corrigir e continuar de onde parou; desligado, a execução para e entra em rollback — [Make Help: Scenario settings](https://help.make.com/scenario-settings)

**Airtable**
- O histórico de cada automação mostra as execuções com falha e a mensagem de erro; "cancelled" costuma indicar que a automação foi desligada com execução pendente. Execuções com falha e com sucesso contam na cota mensal; o suporte pode zerar o contador depois de um loop acidental — [Airtable Support: Troubleshooting Airtable automations](https://support.airtable.com/docs/troubleshooting-airtable-automations)

**Copilot Studio (crédito de IA)**
- No estouro da capacidade, agentes personalizados ficam indisponíveis para conversa nova, com a mensagem "This agent is currently unavailable"; conversa em andamento termina — [Microsoft Learn: throttling errors agents](https://learn.microsoft.com/hi-in/troubleshoot/power-platform/copilot-studio/licensing/throttling-errors-agents); [Topedia (terceiro)](https://blog-en.topedia.com/2025/09/copilot-studio-billing-and-capacity-enforcement-was-activated/)
- O administrador recebe e-mail e aviso no Power Platform admin center (fonte de treinamento da Microsoft) — [Microsoft Agent Academy](https://microsoft.github.io/agent-academy/recruit-v2/10-understanding-licensing/)

### Inferences
- "Retido" e "aguardando revisão" são estados diferentes no Zapier: "On hold" espera a correção de uma causa; "Needs review" espera uma pessoa. A pausa do passo de IA por custo usa aprovação no histórico, o que a aproxima do segundo.
- O padrão comum para não perder dado é guardar a entrada do gatilho e permitir replay depois (Zapier "On hold", Make "incomplete executions").
- O aviso por e-mail com carência antes de desligar (Zapier Team/Enterprise, Power Automate 30 dias antes) é a forma de evitar que o desligamento automático surpreenda o dono.

### Gaps
- Não achei o texto exato do e-mail nem do banner do Zapier para flood protection, nem se existe e-mail específico para execução retida.
- Não achei prazo de validade da execução retida no Zapier.
- Power Automate: não achei um status de execução chamado "throttled" no histórico; a doc fala em desacelerar.
- Make: não achei o texto do aviso quando o cenário é desativado por erros.

## Incidentes e conversas de fórum sobre automação descontrolada (loop, enxurrada de e-mail, custo de IA) e as proteções criadas em resposta

### Takeaway
O caso mais comum é o fluxo que dispara a si mesmo: a ação grava no mesmo registro ou na mesma caixa que o gatilho observa. Há relatos em Zapier, Airtable, monday e Power Automate. Os fornecedores respondem mais com orientação (condição no gatilho, campo de controle) do que com detecção automática; a exceção documentada é o throttling. No custo de IA, Zapier criou em 2026 o limite de 75 tarefas por execução com pausa para aprovação.

### Cited Findings
**Loops e enxurrada de e-mail**
- Zapier: 1 e-mail que casou com o gatilho fez o Zap rodar sem parar e mandar centenas de e-mails; a causa provável era o passo 2 redisparar o passo 1 — [Zapier Community: zaps continuously firing](https://community.zapier.com/troubleshooting-99/zaps-continuously-firing-when-not-supposed-to-25911)
- A ajuda do Zapier descreve 2 loops: resposta automática que cai no gatilho porque a busca inclui a pasta Enviados (solução: gatilho New Conversation e `in:inbox`) e atualização do mesmo registro do Airtable que disparou o Zap — [Zapier Help](https://help.zapier.com/hc/en-us/articles/8496232045453)
- Airtable: automação mandando 1 e-mail por segundo por cerca de 2 horas; outra que "fires off 1000's of emails in an hour" — [Airtable Community: infinite loop](https://community.airtable.com/automations-8/automation-sending-e-mails-in-infinite-loop-23565); [Airtable Community: 1000's of emails](https://community.airtable.com/automations-8/automation-fires-off-1000-s-of-emails-in-an-hour-22756)
- Airtable (oficial): loop acontece quando a ação redispara o gatilho da mesma automação ou quando 2 automações da mesma base se disparam; exemplo "When a record enters a view" com "Create a new record". Orientação: desligar todas, revisar sobreposições e religar uma a uma — [Airtable Support: Troubleshooting](https://support.airtable.com/docs/troubleshooting-airtable-automations)
- Airtable: usuário relata que a automação continuou rodando depois de desligada, sem resposta oficial no tópico — [Airtable Community](https://community.airtable.com/automations-8/automation-sending-e-mails-in-infinite-loop-23565)
- monday: automação de status criando item novo a cada 15 segundos em outro quadro; a resposta foi procurar o suporte, e o usuário resolveu apagando e recriando — [monday Community: automation keeps repeating](https://community.monday.com/t/why-does-an-automation-keeping-repeating/23775)
- monday: moderador diz que não há como saber se a mudança veio de pessoa ou de automação, o que dificulta evitar loop em integração — [monday Community: possible infinite loop](https://community.monday.com/t/possible-infinite-loop-caused-by-api-and-monday-integrations-automations/49950)
- monday: blog de desenvolvedor diz que o motor de automação não tem detecção de ciclo e conta com intervalo de 1 a 2 segundos entre execuções (terceiro, não confirmado pelo fornecedor) — [DEV Community: Infinite cycles in monday.com automations](https://dev.to/piotrdiuk/infinite-cycles-in-mondaycom-automations-51kp)
- Power Automate: o loop típico é atualizar o mesmo item do SharePoint ou do Dataverse que o gatilho observa. Soluções da comunidade: condição de gatilho (bloqueia o início; não aceita conteúdo dinâmico), checar a conta de serviço que fez a última edição, coluna de controle "Processed" e condição antes de atualizar — [Tom Riha](https://tomriha.com/how-to-avoid-infinite-trigger-loop-in-power-automate/); [Manuel T. Gomes](https://manueltgomes.com/microsoft/power-platform/powerautomate/power-automate-common-questions/how-to-stop-an-infinite-trigger-loop-in-power-automate/); [RSM: Dynamics 365](https://technologyblog.rsmus.com/technologies/microsoft/how-to-prevent-infinite-loops-in-power-automate-flows-for-dynamics-365-ce)
- Workato orienta filtrar no gatilho as mudanças feitas por automação, para disparar só em evento de negócio real — [Workato: Avoiding infinite loops](https://www.workato.com/product-hub/workato-tip-avoiding-infinite-loops/)

**Proteções contra cadeia de automações em produtos menores**
- Salestrekker: uma automação não redispara outra que já rodou na mesma cadeia; a cadeia para — [Salestrekker: Can one automation start another](https://support.salestrekker.com/en/articles/8232619-can-one-automation-start-another)
- Jodoo: cadeia de automações aninhadas vai até 10 níveis e para depois disso — [Jodoo: Trigger validation](https://help.jodoo.com/en/articles/10043744-trigger-validation)

**Custo de IA**
- Zapier, desde 2026-06-15: passo de IA cobrado por nível de modelo (Standard 1x, Advanced 3x, Premium 5x); cada chamada de ferramenta soma o mesmo multiplicador (Premium com 2 chamadas = 15 tarefas). Premium é o padrão de passo novo em plano pago. Limite de 75 tarefas por execução (até 500) com pausa para aprovação — [Zapier Help: AI by Zapier model tier pricing](https://help.zapier.com/hc/en-us/articles/46425475442829)
- Comentário de terceiro chama a pausa para aprovação de falha silenciosa em automação sem supervisão — [nocode.tech](https://www.nocode.tech/article/zapiers-ai-step-pricing-is-eating-no-code-budgets-heres-how-to-audit-yours) (opinião, não verificada)
- n8n: pedido na comunidade de um limite rígido de chamadas de ferramenta por execução, citando "token bleeding" em loop de lógica — [n8n Community: Max Tool Interactions](https://community.n8n.io/t/feat-ai-tools-add-max-tool-interactions-to-ai-agent-nodes-to-prevent-infinite-loops/295587)
- n8n: relato de agente que chamava a mesma ferramenta de resumo até parar por tempo em 20 iterações; correção com instrução de sistema mais fechada e "Require Specific Output" — [DEV Community: Wire an AI agent into n8n](https://dev.to/techpotions/wire-an-ai-agent-into-n8n-2de9)
- Copilot Studio: o bloqueio começa em 125% da capacidade pré-paga (vários terceiros; não confirmado na doc oficial lida). O administrador pode definir limite mensal de crédito por agente, com limiar de aviso e opção "Stop usage" que desliga o agente no limite — [Topedia](https://blog-en.topedia.com/2025/09/copilot-studio-billing-and-capacity-enforcement-was-activated/); [Rajeev Pentyala](https://rajeevpentyala.com/2026/09/10/19567/)
- Copilot Studio: se a configuração que deixa o ambiente usar crédito do tenant estiver desligada, o ambiente para mesmo com crédito sobrando no tenant (fórum) — [Microsoft Tech Community](https://techcommunity.microsoft.com/discussions/copilot-studio/issue-on-copilot-studio-credit-consumption/4559167)
- monday AI credits: avisos em 80% e 100% da cota; depois, uso de IA pausado até comprar mais; automações sem IA continuam. As 2 fontes de terceiro divergem sobre automação com AI Blocks já ativa (uma diz que continua, outra que pausa). Limite por usuário e aviso por limiar seriam só no Enterprise — [Breeze (terceiro)](https://www.breeze.pm/articles/monday-ai-credits-run-out); [Till Freitag (terceiro)](https://till-freitag.com/en/blog/monday-ai-credits-pricing-en)
- Outros fornecedores com teto de gasto de IA definido pelo administrador: Personio (limite mensal desliga recursos de IA para todos) e Ironclad (só administrador limita) — [Personio](https://support.personio.de/hc/en-us/articles/38265391496093); [Ironclad](https://support.ironcladapp.com/hc/en-us/articles/43055016202135)

### Inferences
- Loop entre automações é o incidente mais citado e a resposta mais comum é ensinar o usuário a fechar o gatilho; poucos produtos detectam o ciclo sozinhos (Salestrekker e Jodoo, pela profundidade da cadeia).
- A falta de "quem fez a mudança" (pessoa ou automação) aparece como causa estrutural no monday; uma origem visível na mudança ajudaria a condição de gatilho.
- Os tetos de custo de IA seguem 2 modelos: limite por execução com pausa para aprovação (Zapier) e limite por período com aviso em limiar e corte (Copilot Studio, monday, Personio).

### Gaps
- Não achei postmortem público de fornecedor sobre incidente de loop ou de custo de IA de cliente.
- Não achei, em fonte oficial, os controles de crédito de IA do Make, do Airtable AI nem do AI Builder do Power Automate (sem busca específica por falta de orçamento de chamadas).
- Duplicidade por webhook reenviado e bloqueio por rate limit de terceiro: só aparecem de passagem (aviso do Zapier sobre rate limit do app; fila de espera do Power Automate que pode perder gatilho). Não achei material de UX específico sobre deduplicação.
- monday: não achei a doc oficial de AI credits; os dados vêm de 2 blogs que divergem.

## Padrões de padrão seguro e de prevenção de configuração ruim (ex.: aviso quando o fluxo pode disparar a si mesmo)

### Takeaway
Os padrões seguros documentados são: proteção ligada por padrão com número moderado (Zapier 100 registros, n8n 10 iterações, Zapier IA 75 tarefas, Power Automate "Until" 60), opção recomendada marcada no rótulo e desligamento automático após erro repetido. O aviso de autodisparo existe no Power Automate como alerta no desenho do fluxo, mas só há fonte de comunidade para isso.

### Cited Findings
- Zapier segura acima de 100 registros por padrão e oferece "Turn off if errors occur (recommended)" como padrão — [Zapier Help: held runs](https://help.zapier.com/hc/en-us/articles/37454233721869-How-to-troubleshoot-held-Zap-or-step-runs); [Zapier Help: Zap is not running](https://help.zapier.com/hc/en-us/articles/8496216132621-Zap-is-not-running)
- n8n "Max Iterations" padrão 10 — [n8n Docs](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/openai-functions-agent/)
- Make: com gatilho instantâneo (webhook), o cenário desativa no 1º erro — [Make Help](https://help.make.com/scenario-settings)
- Power Automate: o aviso de que o fluxo pode disparar a si mesmo é alerta de desenho, não erro; um usuário do fórum confirma que é aviso — [Power Users Community](https://powerusers.microsoft.com/t5/General-Power-Automate/how-to-combine-2-actions-in-flow/m-p/1875942) (texto exato do aviso não confirmado em doc da Microsoft)
- Power Automate: a Microsoft desaconselha ligar o Concurrency Control quando todo gatilho precisa virar execução, e a mudança não tem volta — [Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- HubSpot: reinscrição desligada por padrão; registro em andamento não reentra — [HubSpot KB](https://knowledge.hubspot.com/workflows/manage-workflow-enrollment-settings)
- Tulip (outro produto): a comunidade pede que o aviso de loop de automação seja mais preciso, por excesso de falso positivo — [Tulip Community](https://community.tulip.co/t/make-automation-loop-warning-more-precise-to-reduce-false-positives/12693)

### Inferences
- Reinscrição desligada por padrão (HubSpot) é uma barreira simples contra o autodisparo: o mesmo registro não reentra enquanto a execução anterior não termina.
- O pedido da Tulip mostra o custo de um aviso de loop impreciso: o usuário passa a ignorar. Vale avisar só quando a ação grava no mesmo objeto e campo que o gatilho observa.

### Gaps
- Não achei texto oficial do aviso de autodisparo do Power Automate nem de qualquer outro produto grande.
- Não achei documentação de validação no momento de salvar (bloquear fluxo que se dispara) em Zapier, Make, n8n, monday, ClickUp ou Pipefy.

## Acessibilidade para quem não é técnico: como os fornecedores evitam jargão (concorrência, throttling) nos rótulos

### Takeaway
A tendência é trocar o termo técnico pelo efeito. Make renomeou "Sequential processing" para "Process data in order" e "Allow storing of incomplete executions" para "Store incomplete executions". Zapier diz "Flood protection", "On hold" e "Safely halted". Power Automate e n8n mantêm o termo técnico ("Concurrency Control", "Degree of Parallelism", "Execution order v1/v0").

### Cited Findings
- Make: rótulos atuais "Process data in order", "Store incomplete executions", "Errors before deactivation", "Cycles per run" — [Make Help](https://help.make.com/scenario-settings); rótulos antigos "Sequential processing", "Allow storing of incomplete executions" — [Make (versão antiga)](https://make.com/en/help/scenarios/scenario-settings)
- Zapier trocou "Held" por "On hold" e "Stopped/Halted" por "Safely halted", com a explicação de que a execução parou de propósito — [Zapier Help: run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637); [Zapier Help (antigo)](https://help.zapier.com/hc/en-us/articles/8496291148685)
- n8n põe a finalidade no rótulo: "Error Workflow (to notify when this one errors)" e "This workflow can be called by" — [n8n Docs](https://docs.n8n.io/build/manage-workflows/configure-workflow-settings)
- Power Automate: "Concurrency Control", "degree of parallelism" e "Apply to each concurrency" — [Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- O fórum do Zapier tem usuários perguntando o que "tasks being held" quer dizer — [Zapier Community](https://community.zapier.com/how-do-i-3/tasks-being-held-what-does-that-mean-43163)

### Inferences
- O rótulo que descreve o efeito ("processar em ordem", "desativar após N erros") dispensa explicar concorrência; o termo técnico pode ficar no texto de ajuda.
- Mesmo um rótulo simples ("held") gera dúvida quando o status não diz o motivo nem o que fazer; o Zapier respondeu com uma página só de motivos e correções.

### Gaps
- Não achei texto de UX writing do fornecedor (blog, guia de estilo) que explique essas renomeações.
- Não achei pesquisa com usuário sobre esses rótulos.

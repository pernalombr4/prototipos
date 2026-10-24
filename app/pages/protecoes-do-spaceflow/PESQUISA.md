# Pesquisa: como os produtos protegem um fluxo

## Síntese

**Método:** pesquisa documental (documentação oficial, código-fonte do Twenty, fóruns para comportamento de borda) em
4 frentes paralelas · **Fontes:** 21 plataformas · **Data:** 24/10/2026. O relatório completo, com link em cada
afirmação, está em [`pesquisa/reports/`](pesquisa/reports/) e as notas de cada frente em
[`pesquisa/research_notes/`](pesquisa/research_notes/).

**Resumo.** As plataformas separam a proteção em 3 camadas: a conta guarda a cota e o teto por minuto, que o usuário
não muda; o fluxo guarda as regras de comportamento, num painel de configurações ou no gatilho; o nó guarda
retentativa e tempo limite. O excesso espera na fila por padrão. Descartar é escolha explícita, com nome próprio.
O desligamento por erro existe em 7 plataformas, quase sempre como regra fixa. Loop e custo de IA são as proteções
mais raras.

## As 5 obrigatórias

### Notion

- **Como resolve:** bloqueio total. "Database automations can't be triggered by other automations": automação de
  banco de dados nunca dispara outra; só um botão clicado por uma pessoa dispara. Qualquer erro em execução pausa a
  automação até alguém religar a chave "Active".
- **Fonte:** [Notion: Database automations](https://www.notion.com/help/database-automations).
- **Serve:** a opção "mudanças feitas por fluxos não disparam este fluxo" vem daqui, como escolha e não como regra.
- **Não serve:** o bloqueio fixo. No Spaceflow, encadear fluxo é recurso (nó Iniciar Fluxo, Webhook entre fluxos).

### Twenty CRM

- **Como resolve:** 2 limites por workspace, definidos pelo administrador da instância em variável de ambiente. O
  brando (100 execuções a cada 60 s) segura na fila com o status `NOT_STARTED`. O rígido (5.000 por hora) grava a
  execução como `FAILED` com "Throttle limit reached". A execução nascida de um fluxo leva a marca
  `createdBy.source = WORKFLOW`, mas o gatilho não usa essa marca para evitar autodisparo.
- **Fonte:** código em `twentyhq/twenty`, `workflow-throttling.workspace-service.ts` e `config-variables.ts`
  (branch `main`, 24/10/2026). Em 12/2024 o Twenty tinha um limite por fluxo (10 por segundo, PR #9263) e trocou
  pelo limite por workspace.
- **Serve:** os 2 níveis de excesso (primeiro espera, depois corta) e a marca de origem, que viabiliza "ignorar
  mudanças feitas por fluxos".
- **Não serve:** limite só no servidor, sem tela. Quem desenha o fluxo não vê nem muda.

### ClickUp

- **Como resolve:** cota mensal de ações por workspace (Free 100, Unlimited 1.000, Business 5.000, Business Plus
  25.000, Enterprise 250.000). No teto, todas as automações do workspace pausam até o fim do mês. Alerta por e-mail em
  90% e 100%. Contra loop, só um aviso na documentação: "To end the loop, disable the trigger."
- **Fonte:** [ClickUp: Automations feature availability and limits](https://help.clickup.com/hc/en-us/articles/23477062949911).
- **Serve:** o alerta antes do teto (90%).
- **Não serve:** 1 automação que estoura pausa todas. A proposta põe o teto no fluxo, para o estouro de 1 não parar
  os outros.

### monday.com

- **Como resolve:** limite por automação publicado em 2 níveis. Gatilhos: 250 por 60 s fica mais lento, 4.500 por
  60 s bloqueia. Ações: 500 por 60 s fica mais lento, 10.000 por 60 s bloqueia. No bloqueio, a execução falha e pode
  levar ao desligamento automático. Avisa no desenho quando a pessoa monta um loop, mas deixa salvar.
- **Fonte:** support.monday.com (lido por curl; o site recusa leitura automática), notas em
  `research_notes/work_management_crm.md`.
- **Serve:** os 2 níveis (atrasar, depois bloquear) e o aviso de loop no desenho.
- **Não serve:** o número é fixo e o usuário não escolhe o que fazer com o excesso.

### Pipefy

- **Como resolve:** cota mensal de "automation jobs" por plano (15, 300, 2.000 e 15 milhões). Cada verificação do
  gatilho conta, mesmo quando a condição falha. A API marca os pares de evento e ação que podem formar loop
  (`eventsBlacklist`, `triggerEvents`).
- **Fonte:** [Pipefy: automation jobs vs automation rules](https://help.pipefy.com/en/articles/6445865).
- **Serve:** conhecer de antemão quais combinações formam ciclo, para avisar no desenho.
- **Não serve:** nenhuma regra por automação na tela; o comportamento do loop em execução não está documentado.

## As extras (automação e fluxo)

| Produto | Como resolve | Serve ao Spaceflow |
|---|---|---|
| **Make** | Painel "Scenario settings" na engrenagem: "Process data in order" (1 por vez), "Errors before deactivation", "Cycles per run", "Store incomplete executions". O Make trocou os rótulos técnicos ("Sequential processing") pelo efeito | rótulo pelo efeito; desligar depois de N erros seguidos, com N escolhido pelo usuário |
| **Zapier** | "Flood protection": acima de 100 eventos de uma vez, segura e manda e-mail ao dono, que libera ou apaga. Status "On hold" com replay. Desliga o Zap com 95% de erro em 7 dias. Passo de IA pausa para aprovação em 75 tarefas numa execução | reter e pedir aprovação; teto de IA por execução; aviso "na hora, resumo por hora ou nunca" |
| **Power Automate** | "Concurrency Control" no gatilho, de 1 a 100, desligado por padrão; depois de ligado não volta. Fila de 10 mais o paralelismo; acima disso o gatilho se perde | o limite de execuções ao mesmo tempo; o que não fazer (perder disparo, ligar sem volta) |
| **n8n** | Modal "Workflow settings": "Error Workflow", "Timeout Workflow" com "Timeout After". "Max Iterations" do agente de IA, padrão 10 | tempo máximo da execução; fluxo de erro |
| **HubSpot** | Aba Settings: janela de horário, datas sem execução, desligar numa data, reinscrição desligada por padrão, alerta de mudança na taxa de inscrição | janela de horário; "cada item dispara 1 vez" |
| **Inngest** | Em código: `throttle` atrasa e guarda, `rateLimit` descarta, `debounce` junta, `concurrency` com `key` por entidade, `idempotency` por 24 h. A espera não ocupa vaga de concorrência | o vocabulário dos 4 destinos do excesso; a vaga por item; a espera fora da conta |
| **AWS Lambda** | Detecta o laço recursivo e corta depois de cerca de 16 chamadas na mesma cadeia, com e-mail ao dono | o contador de cadeia em execução |
| **GitHub Actions** | `concurrency` com `cancel-in-progress`: a nova cancela a anterior | "cancelar a anterior" para o Timer |

## O padrão que todos seguem

- **Painel de configurações separado do desenho**, com 5 a 12 campos. O Spaceflow já separa o desenho das outras
  abas; a aba Proteções segue a mesma lógica.
- **O excesso espera na fila, sem perda.** Descartar tem nome próprio e aviso.
- **A plataforma desliga o fluxo que erra demais e avisa 1 pessoa**: quem ligou ou editou por último.
- **Rótulo pelo efeito, com o valor recomendado escrito** ("Process data in order", "(recommended)"). Quem mantém o
  termo técnico (Power Automate, n8n) fala com desenvolvedor.
- **Proteção ligada por padrão com número moderado**: 100 eventos, 10 iterações, 75 tarefas.

## O que nenhum deles faz

1. **Teto diário por fluxo, escolhido por quem desenha.** Nos produtos de negócio a cota é da conta.
2. **Escolha na tela do destino do excesso:** fila, ignorar ou reter. Só existe em código.
3. **Contador do que a proteção segurou, ao lado da proteção.**
4. **Contador de cadeia com aviso no desenho e corte na execução.** O monday só avisa; o Lambda só corta.
5. **"Ignorar mudanças feitas por fluxos" no gatilho.** O Twenty grava a origem e não usa.
6. **Teto de crédito de IA por fluxo e por dia.**
7. **Espera humana fora da conta de execuções ao mesmo tempo, explicada ao usuário de negócio.** Só o Inngest, em
   código. No Spaceflow pesa mais que em qualquer outro: Formulário, Aprovação e Tarefa seguram a execução por dias.

O Spaceflow junta 3 traços que nenhum dos 21 junta: gatilho por item, nó que chama outro fluxo e tarefa humana que
segura a execução. A proposta usa os 3: a vaga por item, o contador de cadeia que conhece o Iniciar Fluxo, e a espera
que não ocupa vaga.

## Lacunas da pesquisa

- Sem print das referências: as telas de configuração de Make, Zapier, Power Automate e HubSpot pedem conta paga, e
  a pesquisa foi documental. Os rótulos citados vêm da documentação oficial.
- Não confirmados: o padrão de "Errors before deactivation" do Make (fontes de comunidade citam 3); a lista de valores
  do "Flood protection" do Zapier; os créditos de IA do monday (2 blogs que divergem); o comportamento do excesso no
  Pipefy e no Notion.
- A Microsoft se contradiz sobre o padrão de paralelismo do Power Automate (25 numa página, 1 em outra).

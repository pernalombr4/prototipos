# Pesquisa: gestão global de execuções

## Síntese

**Método:** pesquisa documental (documentação oficial, código-fonte aberto, fóruns para comportamento de borda) em 4
frentes paralelas · **Fontes:** mais de 30 produtos · **Data:** 24/10/2026. O relatório completo, com link em cada
afirmação, está em [`pesquisa/reports/`](pesquisa/reports/) e as notas de cada frente em
[`pesquisa/research_notes/`](pesquisa/research_notes/).

**Resumo.** O mercado resolve 2 das 3 partes do pedido. Números agregados e lista global de execuções são padrão
(n8n, Make, Power Automate, Workato, Temporal, monday.com, HubSpot). A busca por entidade de negócio aparece em 3
formas: chave declarada por quem monta o fluxo (n8n, Workato, Temporal, Camunda), busca no conteúdo das execuções
(Make, Inngest) e linha do tempo na tela do registro (Pipefy, monday.com, HubSpot). Nenhum produto segue uma operação
de fluxos encadeados por evento de registro (o fluxo A grava o item e o evento do item dispara o fluxo B): todos
ligam pai e filho só na chamada explícita de subfluxo. O ENSPACE grava o item e dispara o fluxo seguinte no mesmo
backend, então gravar a causa no momento do disparo custa pouco.

## As 4 frentes

| Frente | Produtos | O que trouxe para a central | Notas |
|---|---|---|---|
| Ferramentas de trabalho, CRM e BPM | Notion, Twenty, ClickUp, monday.com, Pipefy, HubSpot, Salesforce, Jira, Airtable, ServiceNow, Bizagi | linha do tempo na tela do registro (aba Fluxos do item); "Health" com causa em palavras (Precisa de atenção); estado do problema (HubSpot) | [`business_tools.md`](pesquisa/research_notes/business_tools.md) |
| Automação no-code | n8n, Zapier, Make, Power Automate, Workato, Pipedream, Windmill, Activepieces, Retool, Tray | números no topo com clique para a lista; janela de 7 dias comparada à anterior; "Need your attention" (Make); filhas escondidas por padrão | [`ipaas_no_code.md`](pesquisa/research_notes/ipaas_no_code.md) |
| Motores para desenvolvedores | Temporal, Camunda, Airflow, Prefect, Dagster, Step Functions, Inngest, Trigger.dev, Conductor, Hatchet | 5 grupos de status com espera nomeada; "Ir para a origem" (Trigger.dev); visões salvas com link (Temporal); reprocessar com prévia (Inngest) | [`dev_engines.md`](pesquisa/research_notes/dev_engines.md) |
| Mineração de processos e observabilidade | Celonis, Power Automate Process Mining, Datadog, X-Ray, Grafana Tempo, Confluent, OpenTelemetry, Honeycomb, NN/g, Google SRE | cascata da cadeia (Honeycomb); evento como nó entre produtor e consumidor (Confluent); mapa gerado sozinho com clique para a lista (X-Ray); painel que abre no que pede ação | [`patterns_observability.md`](pesquisa/research_notes/patterns_observability.md) |

## O que nenhum deles faz

1. Ligar execuções encadeadas por evento de registro.
2. Mostrar, na tela do registro, a cadeia inteira que ele disparou.
3. Herdar o registro raiz ao longo da cadeia.
4. Avisar o ciclo pela configuração, antes de rodar.
5. Tratar a operação (vários fluxos independentes) como objeto de negócio em ferramenta no-code.
6. Juntar mapa configurado e mapa observado numa ferramenta para quem não é técnico.

Os itens 1 a 3 são a fase 2 do protótipo (aba Cadeia, "Com a cadeia" na busca e no item, ligações observadas no
mapa). O item 4 reaproveita o aviso de ciclo do `protecoes-do-spaceflow`.

## Do relatório para o protótipo

| Bloco do relatório | Onde está no protótipo |
|---|---|
| 1. Cadeia da execução | faixa da cadeia e aba Cadeia no detalhe da execução |
| 2. Por onde o item passou | busca na aba Execuções e "Ver jornada no mapa" |
| 3. Mapa da operação | aba Mapa da operação |
| 4. Lista global | aba Execuções |
| 5. Números no topo | Visão geral, 5 números e gráfico por dia |
| 6. Precisa de atenção | Visão geral, com estado do problema e reprocessar em lote |
| 7. Aba de fluxos no item | tela do item, aba Fluxos |
| 8. Avisos da operação | fora desta rodada |

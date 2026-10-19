# Segurança no admin: pesquisa

Pesquisa de 2026-10-19, em 2 etapas pedidas pela redatora:

1. **Pesquisa profunda** (skill `deep-research`): 6 frentes em paralelo, uma por grupo de pedidos, sobre documentação oficial, centrais de ajuda, changelogs e Microsoft Learn. O relatório completo está na segunda parte deste arquivo, com a URL de cada afirmação.
2. **Síntese** (skill `product-management:synthesize-research`): os temas, o que eles significam para o ENSPACE e as recomendações em ordem de prioridade, logo abaixo.

Referências: as 5 obrigatórias (Notion, Twenty CRM, ClickUp, monday.com, Pipefy) e 14 extras escolhidas pelo problema (Atlassian Admin e Guard, GitHub Enterprise, Slack Enterprise Grid, Google Workspace, Microsoft Entra e Sentinel, Azure DevOps, Azure AI Foundry, Figma, Linear, Airtable, Power Platform, n8n, Stripe, Standard Webhooks, AWS Backup).

**Sem print das referências.** As telas de admin desses produtos ficam atrás de plano Enterprise e de login; a pesquisa leu a documentação oficial de cada tela. O que serve e o que não serve está em cada ponto do relatório.

## Síntese

### Método

| | |
|---|---|
| Fontes | documentação oficial e central de ajuda de 19 produtos, mais OWASP, Microsoft Learn e AWS |
| Pergunta | como o console de administração acima dos workspaces resolve cada um dos 10 pedidos, em tela (menu, campos, estados) |
| Limite | páginas do monday.com e do ClickUp recusaram a leitura automática (403); o que está sobre eles veio do resumo do buscador ou de terceiro, marcado no relatório |

### Achados, do mais forte para o mais fraco

| # | Achado | Evidência | Confiança |
|---|---|---|---|
| A1 | **5 dos 10 pedidos não têm tela em nenhum dos 5 concorrentes:** inventário de tokens com teto, allowlist HTTP, HMAC obrigatório, envio nativo ao Sentinel e painel de continuidade. | Notion, Twenty, ClickUp, monday e Pipefy, um a um | Alta |
| A2 | **Notion é o modelo mais próximo do ENSPACE:** 2 níveis (organização e workspace), "Person or agent" no filtro do log, controles de IA depois de um vazamento por PDF. Atlassian é a referência mais completa fora dos concorrentes. | Notion Help, Atlassian Support | Alta |
| A3 | **O mercado bloqueia em 3 estados, não em 2.** Azure ("block" ou "annotate"), Box ("monitorar") e GitHub (barrar no uso sem revogar) deixam ver o efeito antes de barrar. Nenhum dos 5 concorrentes oferece isso. | Azure AI Foundry, Box Shield, GitHub Docs | Alta |
| A4 | **"Revogação imediata" depende do ENSPACE, não do SCIM.** O Entra manda mudanças a cada 40 minutos, aproximadamente; quem promete imediato oferece botão de encerrar sessão e teto de sessão. | Microsoft Learn, Notion, Atlassian | Alta |
| A5 | **A allowlist precisa conferir na execução.** O Power Platform não avalia URL montada com variável; o n8n confere depois de montar, no redirecionamento e na resolução DNS, e teve 2 brechas corrigidas em 2026. | Microsoft Learn, n8n Docs, VulnCheck | Alta |
| A6 | **Prompt injection não tem solução completa.** OWASP e Anthropic dizem que nenhuma defesa zera o risco. O que vira tela: limite de saída, confirmação humana, leitura de anexo e log. O caso Rovo mostra que desligar a busca na web não fecha outra ferramenta que abre URL. | OWASP LLM01, Anthropic, CSA sobre Rovo | Média |
| A7 | **Domínio "aprovado" e domínio "reivindicado" são coisas diferentes** com nomes parecidos. O primeiro facilita a entrada; só o segundo trava conta e workspace fora do ambiente. | Twenty, monday, Atlassian, Notion | Alta |
| A8 | **Ninguém mostra a continuidade em tela.** RTO e RPO vivem em DPA, política de DR e trust center; o máximo em tela é a região dos dados (Notion, monday) e a mudança de região agendada (Atlassian). | Twenty Legal FAQ, monday DR Policy, Atlassian Trust | Média |
| A9 | **Retenção de log é fixa pelo plano em todo produto lido** (90 a 365 dias). Para guardar mais, todos mandam ao SIEM. O ENSPACE já guarda 720 dias, acima de todos. | Linear, Airtable, Atlassian, Google, Notion; develop | Alta |

### Matriz de prioridade

| | Impacto alto | Impacto menor |
|---|---|---|
| **Comum no mercado** | Log com login, leitura, download e exportação (1); SCIM e sessões (6); trava de domínio (7) | Convite só para domínios autorizados (8) |
| **Raro no mercado, decisivo para segurança** | Tokens com teto e inventário (2); conta de serviço (3); allowlist HTTP (4); HMAC obrigatório (9) | Painel de continuidade (10); tentativas de injeção (5) |

### O padrão que todos seguem

- Segurança fica num console acima dos workspaces, agrupada por tema (identidade, acesso programático, dados, auditoria), não por pedido.
- É recurso do plano mais alto, e só o dono da organização mexe.
- Segredo (token, chave SCIM, segredo de webhook) aparece 1 vez, com Copiar; depois só "Trocar" e "Revogar".
- Revogar é irreversível e pede confirmação.

### O que nenhum deles faz (a chance do ENSPACE)

- Mostrar o **efeito antes de salvar**: quantos tokens ficam fora, quais fluxos param, quem perde a exportação.
- **Só registrar** como estado intermediário em toda regra de bloqueio.
- Avisar o **administrador** antes de um token expirar.
- Mostrar, na conta de serviço, **onde ela é usada**.
- Política de **assinatura obrigatória** para todo webhook da organização.
- Mostrar o **último backup concluído** e o último teste de recuperação.

### Recomendações para o protótipo, em ordem

1. **Menu:** manter o menu de hoje e acrescentar "Envio ao SIEM" em Logs e 3 grupos: Identidade (Domínios, SCIM, Sessões, Convites), Integrações (Tokens, Contas de serviço, Webhooks, Destinos de saída) e Proteção de dados (Exportação e download, IA e BENI, Continuidade). Liga com A1 e A2.
2. **Reaproveitar o cartão de Configurações Gerais** em toda tela nova, para o dev não criar um segundo padrão.
3. **Estado triplo** (Desligado, Só registrar, Bloquear) nos controles de bloqueio de exportação e de instrução escondida; modo equivalente na allowlist. Liga com A3.
4. **Efeito antes de salvar** na política de tokens, na allowlist e na exportação. Liga com A3.
5. **Texto honesto sobre o SCIM** e botão "Encerrar sessões" na hora. Liga com A4.
6. **Allowlist conferida na execução**, com a rede interna sempre bloqueada e a IA presa à mesma lista. Liga com A5 e A6.
7. **Domínio com 2 chaves separadas** (bloquear fora e entrar sem convite) e a lista de contas de fora. Liga com A7.
8. **Continuidade só de leitura**, alimentada pelo contrato, com o adendo para baixar. Liga com A8.
9. **Retenção visível** no Audit Log, com troca de prazo dentro do contrato. Liga com A9.

### Perguntas em aberto

- Qual RTO, RPO e nível de redundância a infraestrutura consegue contratar para o ambiente dedicado? Os números da tela de Continuidade são ilustrativos.
- O ENSPACE vai ter detector de instrução escondida? Sem ele, o painel "Tentativas detectadas" não vai para o produto.
- O admin do cliente é o mesmo ENSPACE Admin de hoje com escopo por organização, ou um app separado? O protótipo assume o mesmo, com o chip da organização no topo.
- Conta de serviço ocupa licença? O protótipo segue o mercado (Pipefy, Airtable, Atlassian): não ocupa.

---

# Relatório da pesquisa profunda

Título do relatório: **Notion e Atlassian desenham o console de segurança.**

Dos 10 controles que o cliente corporativo pediu, os melhores entre os 5 concorrentes diretos do ENSPACE (Notion, Twenty CRM, ClickUp, monday.com e Pipefy) cobrem 4: Notion e monday.com têm registro de auditoria, SCIM (o protocolo que cria e desativa usuários a partir do provedor de identidade), trava de domínio e liga/desliga de exportação, sempre no plano Enterprise. O Notion é o modelo mais próximo do ENSPACE: tem 2 níveis de administração (organização e workspace), põe "pessoa ou agente" no mesmo filtro do registro de auditoria e reforçou os controles de IA depois de um vazamento público por prompt injection em setembro de 2025. Em 5 pedidos, nenhum dos 5 concorrentes tem tela: inventário central de tokens com teto de expiração, allowlist de destinos para requisições HTTP de automação, assinatura HMAC obrigatória de webhooks, envio nativo ao Microsoft Sentinel e painel de continuidade com RTO (tempo para voltar ao ar) e backup. Nesses 5, as telas de referência vêm de GitHub, Atlassian, Microsoft Power Platform, Stripe e Azure DevOps. O padrão do mercado também tem limites que o ENSPACE pode usar a seu favor: nenhum produto pesquisado deixa o admin escolher a retenção do log, mostra tentativas de injeção bloqueadas ou exibe o último backup concluído. Para o protótipo, a conclusão é um console com 5 seções (Identidade, Acesso programático, Dados, Auditoria e Continuidade), em que cada controle de bloqueio tem 3 estados visíveis: desligado, só registrar e bloquear.

## Os 10 pedidos lado a lado

A tabela resume o que cada produto documenta. "Não achado" quer dizer que a documentação oficial consultada não descreve o recurso; ausência na doc não prova ausência no produto. As páginas de ajuda do monday.com e do ClickUp devolveram 403 ao leitor automático, e parte do que está aqui sobre eles vem do resumo do buscador ou de guia de terceiro, marcado no texto.

| Pedido | Notion | Twenty | ClickUp | monday.com | Pipefy | Melhor referência |
|---|---|---|---|---|---|---|
| 1. Audit log e SIEM | Sim, com SIEM por webhook, 365 dias | Não | Sim no Enterprise, detalhe só em terceiro | Sim, API de consulta | Por pipe, sem login | GitHub, Azure DevOps |
| 2. Governança de tokens | Parcial (conexões por membro) | Lista do workspace, aceita "Never" | Token nunca expira | Token sem expiração | Não achado | GitHub, Atlassian |
| 3. Conta de serviço | Admin token da organização | Chave de API com papel | Não achado | Não (usuário de integração) | Sim | Atlassian, Airtable |
| 4. Allowlist HTTP | Não achado | Não achado | Não achado | Não achado | Não achado | Power Platform, n8n |
| 5. Prompt injection | Busca web, confirmação, allowlist de MCP | Papel do agente | Liga/desliga | Liga/desliga por papel | Liga/desliga | Azure Prompt Shields, GitHub |
| 6. SCIM e sessões | Sim, desloga ao desativar | Só SSO | SCIM com Entra | SCIM com Entra | Provisionamento com SSO | Atlassian, Linear |
| 7. Trava de domínio | Sim | Só "domínio aprovado" | Só em terceiro | Sim ("Claim domain") | Não achado | Linear, Slack |
| 8. Exportação e convite | Interruptor e exceção por teamspace | Só Admin (espelho da doc) | Não por papel | Admin × não admin | Membro do pipe exporta | Atlassian Guard, Airtable |
| 9. HMAC obrigatório | Assina, não obriga | Assina com carimbo de tempo | Assina, não obriga | JWT condicional | Não achado | Stripe, Standard Webhooks |
| 10. RTO e backup | Residência com tela, sem RTO | RTO e RPO de 6 h | Sem número | RTO 24 h, RPO 12 h | Sem número | Atlassian |

## Rastrear: o registro de auditoria e o caminho até o Sentinel

### 1. Audit log com SIEM e retenção: o Notion registra leitura, o GitHub mostra a saúde do envio

O Notion tem o registro mais completo entre os 5, só no Enterprise e só para donos da organização. Ele existe em 2 níveis, cada um no seu menu: organização (seletor de workspace > "Manage organization" > "Data & Compliance" > "Audit log") e workspace (Settings > "Audit log"). Os filtros são Organization (1 workspace ou todos), Date (até 365 dias), **Person or agent**, Event, Teamspace e Related. O catálogo cobre o que o cliente pediu, com uma falha: tem "Login" e "Logout", **"Page viewed"** (inclusive quando uma integração ou IA externa lê a página), **"File downloaded"** e 8 eventos de exportação, mas **não registra login com falha**. Exportar o próprio log gera o evento "Audit Log exported". O CSV respeita os filtros ativos e cobre até 365 dias. O envio ao SIEM (o sistema que centraliza e correlaciona eventos de segurança) fica em Settings > "Connections" > "Custom SIEM integration": cola-se a URL de um webhook e clica-se em "Connect". O envio aceita 1 webhook por workspace, manda JSON sem conteúdo de página, tenta de novo até 7 vezes em cerca de 24 horas e deixa de fora os eventos de organização. Os conectores prontos são Datadog, Panther, Splunk e Sumo Logic; **o Microsoft Sentinel não aparece** ([Notion Help](https://www.notion.com/help/audit-log)).

O monday.com guarda o registro em avatar > "Administration" > "Security" > aba "Audit", com sessões, dispositivo, IP, horário sempre em GMT e filtros "User name" e "Event type" ([monday.com](https://support.monday.com/hc/en-us/articles/360001259429-The-Audit-Log), lido pelo resumo do buscador). Ele tem o que falta ao Notion: segundo um catálogo de terceiro, os eventos incluem `login`, **`failed-login`** e 5 tipos de exportação ([CData](https://cdn.cdata.com/help/MOK/ado/pg_AuditLogtable-auditlogs.htm)). Para o SIEM, o admin gera um token em Security > Audit > "Monitor by API" e o SIEM consulta a rota `/audit-api/get-logs`, com até 50 requisições por minuto ([monday.com](https://support.monday.com/hc/en-us/articles/4406042650002-Audit-Log-API)). O único conector pronto encontrado é o do Palo Alto Cortex; **nenhum para o Sentinel** ([Cortex XSOAR](https://xsoar.pan.dev/docs/reference/integrations/monday-event-collector)). O Pipefy tem registro por pipe (Manage > "Audit logs", abas "Card activity" e "Configuration changes"), com 180 dias na tela e 30 dias no CSV, sem login, sem visualização e sem SIEM ([Pipefy Help](https://help.pipefy.com/en/articles/15062678-audit-logs-for-pipes-and-cards)). O ClickUp declara audit log com exportação no Enterprise, sem retenção publicada ([ClickUp Learn](https://clickup.com/learn/topic/operations/tools/features/audit-trails/)); colunas e filtros só aparecem em guia de terceiro. O Twenty não tem registro de organização: os PRs mais próximos fecharam como rascunho parado em setembro de 2026 ([GitHub twentyhq](https://github.com/twentyhq/twenty/issues?q=audit+log)).

A tela de envio contínuo, que nenhum dos 5 tem, aparece no GitHub e no Azure DevOps com o mesmo formato. No GitHub (Settings da enterprise > "Audit log" > "Log streaming"), o admin escolhe o destino (Azure Event Hubs, Splunk, S3, Datadog e outros), clica em **"Check endpoint"** e só então salva; pode pausar por até 7 dias sem perder eventos; a plataforma confere a saúde do envio a cada 24 horas e avisa os donos por e-mail quando falha ([GitHub Docs](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/streaming-the-audit-log-for-your-enterprise)). O Azure DevOps é o único com destino que o Sentinel lê direto (Azure Monitor Logs): pede "Resource ID" e "Tenant ID", valida pela conta de quem configura, desliga o envio sozinho quando ele falha, mostra o erro ao lado e recupera até 7 dias ao religar; a credencial nunca volta à tela ([Microsoft Learn](https://learn.microsoft.com/azure/devops/organizations/audit/auditing-streaming)). O WorkOS, que vende audit log a outros SaaS, define 4 estados para um envio: Active, Inactive, Error e Invalid ([WorkOS Docs](https://workos.com/docs/audit-logs/log-streams/streaming-destinations-and-payload-formats/microsoft-sentinel)).

Para o Sentinel, há 3 caminhos hoje. No primeiro, o Sentinel consulta a API de leitura do SaaS por um conector do Codeless Connector Framework (CCF) ([Microsoft Learn](https://learn.microsoft.com/en-in/azure/sentinel/data-connector-connection-rules-reference)). No segundo, o SaaS envia ao Sentinel pela Logs Ingestion API (CCF Push, em prévia): o cliente clica em "Deploy" no Sentinel e recebe **6 valores para colar no SaaS**: Tenant ID, Application ID, Secret do app no Entra, Data Collection Endpoint Uri, Data Collection Rule Immutable ID e Stream Name ([Microsoft Learn](https://learn.microsoft.com/en-us/azure/sentinel/isv/create-push-codeless-connector)). No terceiro, o SaaS grava num Azure Event Hub do cliente, como o GitHub. O par "Workspace ID + Shared Key" pertence à HTTP Data Collector API, que a Microsoft anunciou aposentar em 2026-09-14 ([Azure Updates](https://azure.microsoft.com/en-us/updates/azure-monitor-data-collection-api-retirement/)); outra página da Microsoft diz que a ingestão continua com TLS 1.2 ([Azure docs](https://docs.azure.cn/en-us/azure-monitor/logs/custom-logs-migrate)). As 2 fontes divergem, e esse par não deve entrar numa tela nova.

A retenção é fixa pelo plano em todos os produtos lidos: 90 dias no Linear e no Azure DevOps, 180 dias no Airtable e na Atlassian sem Guard, 6 meses no Google Workspace e 365 dias no Notion e na Atlassian com Guard ([Linear](https://linear.app/docs/audit-log); [Airtable](https://airtable.com/developers/web/api/audit-logs-overview); [Atlassian](https://support.atlassian.com/security-and-access-policies/docs/accessing-audit-log-activities/); [Google](https://knowledge.workspace.google.com/admin/reports/data-retention-and-lag-times?hl=en)). Para guardar mais, todos mandam exportar ou enviar ao SIEM. Para nomear eventos, o Slack é a referência: `user_login_failed`, `file_downloaded` e exportação em 4 tempos (iniciada, concluída, apagada, baixada) ([Slack](https://docs.slack.dev/reference/audit-logs-api/methods-actions-reference)).

**O padrão que todos seguem:** tabela de eventos com filtros por ator, tipo de evento e data; exportação em CSV limitada à retenção; retenção fixa pelo plano; API de leitura paginada que o SIEM consulta; recurso só no plano mais alto e só para o dono da organização.

**O que nenhum deles faz:** nenhum dos 5 concorrentes envia ao Sentinel de forma nativa nem mostra a saúde do envio ao SIEM; o Notion não registra login com falha; nenhum produto pesquisado deixa o admin escolher a retenção.

**Recomendação para a tela do ENSPACE:**
- Menu Auditoria > "Registro de auditoria", com filtro de workspace no topo (organização inteira ou 1 workspace), como no Notion.
- Filtros: Pessoa ou agente, Evento, Workspace, Data e IP. O ator tem 4 tipos: pessoa, conta de serviço, BENI e fluxo do Spaceflow.
- Catálogo com nome `<objeto>.<verbo>`: `auth.login`, `auth.login_failed`, `item.viewed`, `file.downloaded`, `export.started`, `export.downloaded`, `audit.exported`.
- Exportação assíncrona, com o estado "Gerando exportação" e aviso por e-mail, como no Figma e no Airtable.
- Aba "Envio ao SIEM" com a lista de destinos e o estado de cada um (Ativo, Pausado, Erro, Credencial inválida), botão "Testar conexão" antes de "Salvar", Pausar e Excluir.
- Destino "Microsoft Sentinel" com os 6 campos do CCF Push; destinos "Azure Event Hubs" e "HTTPS" para quem não usa o Push; credencial mostrada 1 vez.
- Retenção exibida como leitura ("365 dias, plano Enterprise"), com link para o envio ao SIEM. Um seletor de prazo seria inédito no mercado e pede decisão de custo.

## Controlar quem chama a API: tokens e contas de serviço

### 2. Governança de tokens: só GitHub, Atlassian e Linear dão ao admin a lista inteira

O GitHub tem a tela mais completa. Em Settings da organização > "Personal access tokens" > **"Active tokens"**, o admin vê todo token que acessa a organização, filtra por Owner, Repository e Permissions, marca vários e clica em "Revoke..."; o dono recebe e-mail ([GitHub Docs](https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/reviewing-and-revoking-personal-access-tokens-in-your-organization)). A política fica na aba ao lado: "Set maximum lifetimes for personal access tokens" e "Require administrator approval", que deixa o token pendente até o admin aprovar e acrescenta o campo "Justification" ao diálogo de criação ([GitHub Docs](https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/setting-a-personal-access-token-policy-for-your-organization)). Na enterprise, cada política tem 3 estados: deixar cada organização decidir, restringir ou permitir; nos 2 últimos a organização não sobrescreve. O teto vai de 1 a 366 dias, e uma caixa isenta os administradores para não quebrar automação antiga. **Apertar a política não revoga o token existente**: o token fora da regra passa a ser barrado no uso ([GitHub Docs](https://docs.github.com/en/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-personal-access-tokens-in-your-enterprise)).

A Atlassian põe o inventário em "Insights" > **"API token activity"**, em qualquer plano: quantos tokens ativos existem, quando cada um nasceu, quando expira e o último uso; "Revoke" na linha ou "Revoke tokens" em lote, sem desfazer ([Atlassian](https://support.atlassian.com/organization-administration/docs/revoke-user-api-tokens); [Atlassian](https://support.atlassian.com/organization-administration/docs/understand-user-api-tokens)). Desde 2024-12-15, todo token novo expira em até 1 ano; os antigos ganharam expiração em lote, com datas entre 2026-03-14 e 2026-05-12 ([Atlassian](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)). O aviso antes de expirar vai só ao dono, cerca de 1 mês antes, e os pedidos de aviso ao admin seguem abertos ([Atlassian Community](https://community.atlassian.com/forums/Atlassian-Account-questions/Are-reminders-proactively-sent-prior-to-API-Token-exiration/qaq-p/3259388)). O Linear deixa o admin decidir em "Administration > API" se membro cria chave e revogar as chaves do workspace ([Linear Docs](https://linear.app/docs/api-and-webhooks)).

Entre os 5 concorrentes, o quadro é mais fraco. O Twenty lista as chaves do workspace e oferece 15, 30 e 90 dias, 1 ano, 2 anos e **"Never"**, sem política de admin que corte opções ([twentyhq/twenty](https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-front/src/modules/settings/developers/constants/ExpirationDates.ts)). O token do ClickUp nunca expira ([ClickUp Developer](https://developer.clickup.com/docs/authentication)); o do monday.com não tem duração, e o admin só regenera o próprio ([monday Developer](https://developer.monday.com/api-reference/docs/authentication)). O Notion não tem token pessoal: em "Settings > Connections", o dono Enterprise vê quem instalou cada conexão e desconecta membros ([Notion Help](https://www.notion.com/help/add-and-manage-connections-with-the-api)). O painel de admin do Pipefy não tem aba de tokens ([Pipefy Help](https://help.pipefy.com/en/articles/9532592-admin-panel-alpha)). Fora do mercado de SaaS, o Microsoft Entra resolve o mesmo problema para credencial de app com "Restrict max password lifetime" e "Block password addition", cada uma com estado On/Off e "Applies to" com exclusões ([Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-app-management-policies)).

**O padrão que todos seguem:** onde existe inventário, as colunas são nome, dono, criação, último uso e expiração; revogar é irreversível; o segredo aparece 1 vez; a política age no diálogo de criação (corta opções do dropdown) e no uso (barra o token fora da regra), nunca revogando em massa sem aviso.

**O que nenhum deles faz:** nenhum dos 5 concorrentes tem inventário central de tokens com revogação pelo admin; nenhum produto tem um interruptor isolado "proibir token sem validade" (é efeito do teto); nenhum avisa o admin antes de um token expirar.

**Recomendação para a tela do ENSPACE:**
- Menu Acesso programático > "Tokens de API", com a tabela: nome, dono, workspaces, escopo, criação, último uso, expira em e estado (Ativo, Expira em 7 dias, Fora da política, Revogado).
- Filtros por dono, workspace e estado; seleção em lote com "Revogar"; e-mail ao dono quando o admin revoga.
- Aba "Política": "Validade máxima" em dropdown (30, 60, 90, 180 e 365 dias) e "Exigir aprovação do administrador". Com teto definido, a opção "Sem validade" some do diálogo de criação.
- Ao salvar uma política mais estrita, a tela mostra quantos tokens ficam fora dela e oferece 2 caminhos: barrar no uso a partir de uma data ou dar prazo ao dono.
- Caixa "Isentar contas de serviço", como a isenção do GitHub.
- Aviso ao admin e ao dono 30, 7 e 1 dia antes da expiração: nenhum concorrente faz.

### 3. Contas de serviço: credencial da organização, sem licença e com ator próprio no log

O Pipefy é o único dos 5 com conta de serviço completa: nome da empresa > "Members and Permissions" > aba "Service Accounts" > "Create Service Account", com nome, descrição de até 140 caracteres, papel e **duração do token de 5 minutos a 30 dias, que não muda depois**. A conta não consome licença se nasce nessa tela, e a credencial é Client ID e Client Secret no fluxo OAuth `client_credentials` ([Pipefy Help](https://help.pipefy.com/en/articles/9027789-service-accounts); [Pipefy Developers](https://developers.pipefy.com/reference/service-accounts)). O Notion tem "admin tokens" da organização (Manage organization > General > "Manage organization-level admin API tokens"), em que o ator do log é o "admin bot" ([Notion Help](https://www.notion.com/help/admin-apis-for-enterprise-organizations)). O Twenty atribui um papel à chave de API (Settings > Members > Roles > "Assignment" > "API Keys") para saber qual integração fez cada ação ([Twenty Docs](https://docs.twenty.com/user-guide/permissions-access/capabilities/permissions.md)). No monday.com, a comunidade recomenda criar um usuário de integração, porque o token de um admin expõe os quadros privados dele ([monday Community](https://community.monday.com/t/how-to-create-user-with-access-to-all-boards-to-use-with-api/42429)).

Nas referências, a Atlassian põe a conta em "Directory" > "Service accounts", com até 5 grátis por organização, token de 1 a 365 dias e escopos fixos depois de criados; rotacionar é criar outro token e revogar o antigo ([Atlassian](https://support.atlassian.com/user-management/docs/manage-api-tokens-for-service-accounts/)). O Airtable aceita até 30 contas no Enterprise Scale, sem custo de licença, e o perfil mostra nome, último uso, criação e quem criou ([Airtable Support](https://support.airtable.com/docs/service-accounts-overview)). O Figma organiza a criação em 3 blocos ("Describe your token", "Choose scopes", "Choose resources") e, ao renovar, mantém o segredo antigo válido por mais 24 horas ([Figma Developers](https://developers.figma.com/docs/rest-api/plan-access-tokens/)).

**O padrão que todos seguem:** só admin cria; a conta não ocupa licença, com teto de quantidade ou exigência de plano; o formulário pede nome, descrição, papel ou escopos, recursos alcançados e validade; o segredo aparece 1 vez; o log mostra a conta como ator.

**O que nenhum deles faz:** nenhuma documentação lida mostra, na tela da conta de serviço, quais automações e integrações usam a credencial; só o Figma documenta janela de troca em que o segredo antigo e o novo valem juntos.

**Recomendação para a tela do ENSPACE:**
- Menu Acesso programático > "Contas de serviço" > "Criar conta de serviço".
- Formulário em 3 blocos, como no Figma: Descrição (nome, finalidade), Permissões (papel por workspace) e Credencial (validade limitada pela política do ponto 2).
- Selo "Não consome licença" e o limite do plano visível ("3 de 10 contas").
- Aba "Onde é usada": fluxos do Spaceflow, webhooks e integrações que chamaram a API com essa credencial nos últimos 30 dias.
- "Trocar segredo" com 24 horas em que os 2 valem; "Desativar" separado de "Excluir".

## Fechar a porta de entrada: identidade, sessão e domínio

### 6. SCIM com Entra e revogação de sessão: ninguém promete "imediato" só pelo SCIM

O Notion põe o SCIM em "Manage organization" > "General" > "SCIM provisioning", só para dono da organização no Enterprise, com 1 token por workspace e revogação pelo ícone de lixeira. Quando o Entra manda `active=false` ou DELETE, o Notion remove do workspace e **desloga de todas as sessões ativas** ([Notion SCIM](https://www.notion.com/help/provision-users-and-groups-with-scim)). O painel "Managed users" lista nome, e-mail, workspaces, último acesso e estado do 2FA, com as ações suspender, excluir, deslogar e redefinir senha, e os controles globais "Log out all users" e "Session duration", de 1 hora a 180 dias ([Notion Managed users](https://www.notion.com/help/managed-users-dashboard)); o guia Enterprise do Notion diz 90 dias, e as 2 páginas divergem ([Notion Enterprise guide](https://www.notion.com/help/guides/the-ultimate-quickstart-guide-to-notion-for-enterprise)). O monday.com põe o SCIM em Admin > "Security" > aba "Login" > "SCIM" > "Generate", que mostra "Tenant URL" e "Secret Token" ([Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/saas-apps/mondaycom-provisioning-tutorial)). O ClickUp tem guia oficial de SCIM com Entra, sem detalhe de sessão ([ClickUp](https://help.clickup.com/hc/en-us/articles/23249507200791-Microsoft-Entra-ID-SCIM-configuration-guide), pelo resumo do buscador). O Pipefy liga "Enable users provisioning" em Company settings, com SSO obrigatório ([Pipefy](https://help.pipefy.com/en/articles/8709382-groups-and-users-provisioning-in-pipefy)). O Twenty só tem SSO com Entra e criação de usuário no primeiro login; o SCIM aparece apenas na página de preços ([Twenty](https://docs.twenty.com/user-guide/permissions-access/capabilities/sso-configuration); [PR #23588](https://github.com/twentyhq/twenty/pull/23588)).

O limite vem do Entra. Ele roda ciclos incrementais a cada 40 minutos, aproximadamente, e exige do fornecedor SCIM 2.0 com desativação por `active=false` ([Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/app-provisioning/use-scim-to-provision-users-and-groups)). App novo da galeria do Entra não aceita mais token Bearer de longa duração: pede OAuth client credentials ou Workload Identity Federation. O CAE, a avaliação contínua de acesso do Entra, propaga uma desativação em até 15 minutos, mas só para recursos da Microsoft ([Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-continuous-access-evaluation)). Por isso os produtos fecham a janela com 2 recursos além do SCIM: botão de deslogar e teto de sessão. A Atlassian tem os 2: chave SCIM que expira 1 ano depois de criada, desde janeiro de 2025 ([Atlassian](https://support.atlassian.com/provisioning-users/docs/configure-user-provisioning-with-an-identity-provider/)); tempo ocioso e expiração de sessão de 15 minutos a 30 dias; e "reset sessions", que desloga em cerca de 10 minutos ([Atlassian](https://support.atlassian.com/security-and-access-policies/docs/set-idle-session-duration-for-external-users)). O Linear, com SCIM ligado, tira do admin a gestão de usuários pela tela e oferece um "manual override" temporário para suspender ([Linear](https://linear.app/docs/scim)).

**O padrão que todos seguem:** URL base copiável e token mostrado 1 vez; desativação por `active=false`; botão para deslogar 1 pessoa ou todas; teto de duração de sessão; tudo no plano Enterprise.

**O que nenhum deles faz:** nenhum produto pesquisado promete revogação imediata só pelo SCIM; nenhuma documentação descreve, do lado do SaaS, um painel com as últimas chamadas SCIM recebidas; nenhuma fonte mostra um SaaS de terceiro recebendo do Entra os eventos de revogação em tempo real.

**Recomendação para a tela do ENSPACE:**
- Menu Identidade > "Provisionamento (SCIM)": URL base, "Gerar token" (mostrado 1 vez), validade de 1 ano, quem criou, "Revogar" e "Gerar outro".
- Bloco "Últimas chamadas recebidas": hora, operação (criar, atualizar, desativar), pessoa e resultado.
- Texto fixo na tela: "Ao desativar no Entra, o ENSPACE encerra as sessões quando recebe a mudança. O Entra envia mudanças a cada 40 minutos, aproximadamente. Para encerrar agora, use Encerrar sessões."
- Menu Identidade > "Sessões": "Encerrar sessões" por pessoa e "Encerrar todas as sessões", com confirmação; "Duração máxima da sessão" e "Tempo ocioso" (faixa de 15 minutos a 30 dias, como a Atlassian).
- Selo "Gerenciado pelo Entra" na lista de membros, com a ação manual bloqueada e um "Suspender agora" de emergência, como o Linear.

### 7. Contas e workspaces fora do ambiente: verificar, reivindicar e travar

O mercado resolve este pedido em 3 passos: verificar o domínio por registro TXT no DNS, reivindicar as contas que já existem e ligar uma trava de criação. O Notion tem os 3. Em "Verify domain(s)", o registro TXT abre 14 dias de período de aviso; "Browse workspaces" lista os workspaces criados com o domínio fora do Enterprise, com as ações "Require account change", "Delete workspaces" e "Claim workspaces"; e "Domain management > Workspace creation" com a opção **"Only workspace owners"** limita quem cria workspace com o domínio. A chave "External workspace access" decide se usuários gerenciados entram em workspaces de fora ([Notion Enterprise guide](https://www.notion.com/help/guides/the-ultimate-quickstart-guide-to-notion-for-enterprise)). O monday.com faz o mesmo em Administration > Security > aba **"Claim domain"**, com 1 TXT por domínio e 2 escolhas depois de verificar: impedir que outros criem contas com o domínio ou só ligar o domínio à conta ([monday.com](https://support.monday.com/hc/en-us/articles/18705654232466-Claim-your-business-domain-on-monday-com), pelo resumo do buscador). O Linear junta tudo em 1 painel, "SAML & SCIM", com a chave **"Disable new workspace creation"** ([Linear](https://linear.app/docs/saml-and-access-control)). No Slack, o domínio reivindicado impede que membros de outros workspaces convidem e-mails desse domínio ([Slack](https://slack.com/help/articles/5513043606547-Claim-and-verify-email-domains)).

É preciso separar 2 conceitos que os produtos chamam por nomes parecidos. "Domínio aprovado" (Twenty "Approved Access Domains", monday.com "Authorized domain", Atlassian "Approved domains") facilita a entrada sem convite e não bloqueia nada fora do ambiente ([Twenty](https://docs.twenty.com/user-guide/settings/domains-settings); [monday.com](https://support.monday.com/hc/en-us/articles/115005319589)). "Domínio reivindicado" é o que trava. A Atlassian acrescenta 2 detalhes úteis: aceita 3 métodos de verificação (HTTPS, TXT ou sincronização com Entra) e deixa somar métodos, para o domínio não cair se o TXT sumir; e trata "Claim accounts" como passo separado, com contagem e exportação antes ([Atlassian](https://support.atlassian.com/user-management/docs/verify-a-domain-to-manage-accounts)). No ClickUp, o controle de domínio só aparece em guia de terceiro; no Pipefy, não aparece.

**O padrão que todos seguem:** verificação por TXT, recurso Enterprise, trava de criação como chave única depois do domínio verificado.

**O que nenhum deles faz:** nenhum dos 5 concorrentes aceita mais de 1 método de verificação; nenhum separa na mesma tela "domínio aprovado" e "domínio reivindicado", e o cliente confunde os 2.

**Recomendação para a tela do ENSPACE:**
- Menu Identidade > "Domínios": tabela com domínio, estado (Aguardando DNS, Verificado, Falhou), método e "Adicionar método".
- Para cada domínio verificado, 2 chaves com texto que diz o efeito:
  - "Bloquear contas e workspaces fora desta organização": quem tem e-mail do domínio só entra nos workspaces da organização;
  - "Entrar sem convite": quem tem e-mail do domínio entra direto, com papel padrão.
- Lista "Contas do domínio fora da organização", com "Trazer para a organização", como o "Browse workspaces" do Notion. Para ambiente dedicado, essa lista pesa menos que a trava.
- Chave "Criar workspace": Só administradores da organização ou Todos.

## Controlar o que sai: exportação, destinos HTTP, IA e webhooks

### 8. Exportação, download e convite: o Atlassian Guard separa 3 bloqueios que os concorrentes juntam

O Notion tem a chave **"Disable export"** na aba Security do workspace, que bloqueia PDF, HTML, Markdown e CSV, e a chave "Disable guests" ([Notion](https://www.notion.com/help/guides/notion-enterprise-security-provisions)). O guia de administração recomenda desligar a exportação no workspace e religar só no teamspace que precisa ([Notion cheat sheet](https://notion.notion.site/Enterprise-admin-cheat-sheet-1b2efdeead0580a48196e4231033721e)). O monday.com impede não admin de exportar para Excel em Admin > Permissions, só na conta inteira ([monday Support](https://support.monday.com/hc/en-us/articles/26989749858578-Export-a-board-to-Excel); [monday Community](https://community.monday.com/t/can-you-disable-export-functionality/16054)). No ClickUp, a equipe confirma em fórum que membro exporta tudo o que vê, e o pedido de bloquear por papel segue aberto ([ClickUp Feedback](https://feedback.clickup.com/feature-requests/p/restrict-who-can-export-data)). No Pipefy, o "Membro do pipe" exporta relatórios, e um cliente pediu em 2025-09 para tirar esse acesso ([Pipefy Help](https://help.pipefy.com/en/articles/614597-pipe-roles-and-permissions); [Pipefy Community](https://community.pipefy.com/ideas/restrict-member-level-access-to-reports-and-extract-database-4766)).

O desenho mais completo é a política de segurança de dados do Atlassian Guard, com regras separadas para **Export data**, **Attachment download** e **Public links**, alcance por organização com exceção por espaço e, no Guard Premium, por classificação do dado ([Atlassian](https://support.atlassian.com/security-and-access-policies/docs/what-is-a-data-security-policy/)). O Airtable bloqueia download de CSV, impressão e copiar e colar, escolhe entre aplicar a todos ou só a quem não é membro (com allowlist de domínios confiáveis) e mostra ao usuário que a ação está bloqueada por política do admin ([Airtable](https://support.airtable.com/docs/collaboration-export-controls-in-admin-panel)). O Box Shield roda os controles de download em **modo monitorar**, que registra a violação sem bloquear ([Box Support](https://support.box.com/hc/en-us/articles/7711419517331)). O Slack bloqueia download no desktop fora de faixas de IP permitidas ([Slack](https://slack.com/help/articles/360016181794)).

Para convite, o monday.com vem com "Only admins can invite new users" ligado por padrão ([monday.com](https://support.monday.com/hc/en-us/articles/115005319589)); a Atlassian aprova domínio por produto com a caixa "Required", que exige aprovação do admin ([Atlassian](https://support.atlassian.com/user-management/docs/control-how-users-get-access-to-products/)). Uma lista de "domínios autorizados para convite" no ClickUp só aparece em guia de terceiro ([ConsultEvo](https://consultevo.com/clickup-allow-list-domains/)), e o Notion não documenta lista de domínios para convidado.

**O padrão que todos seguem:** 1 interruptor de exportação na organização, recurso Enterprise; recorte por admin × não admin; convidado tratado à parte.

**O que nenhum deles faz:** nenhum dos 5 concorrentes separa exportar, baixar anexo e gerar link público; nenhum tem modo "só registrar" antes de bloquear; nenhum documenta, em fonte oficial, uma lista de domínios para onde se pode convidar.

**Recomendação para a tela do ENSPACE:**
- Menu Dados > "Exportação e download", com 3 regras separadas: Exportar itens (CSV, Excel, PDF), Baixar anexos e Gerar link público.
- Cada regra com "Quem pode": Todos, Só estes papéis ou licenças (membro, convidado, externo) ou Ninguém; e "Exceções por workspace".
- Modo de cada regra: Desligada, Só registrar ou Bloquear. O "Só registrar" mostra quem seria bloqueado antes de bloquear.
- Prévia do texto que a pessoa bloqueada vê: "Exportação bloqueada pela política da sua organização."
- Menu Identidade > "Convites": "Só administradores convidam", lista "Domínios autorizados para convite" (só domínios verificados ou aprovados) e chave "Convidados externos".

### 4. Allowlist de destinos do Spaceflow: o Power Platform tem a tela, o n8n tem a checagem certa

Nenhum dos 5 concorrentes tem allowlist de destino para automação: a ação HTTP do Pipefy aceita POST, PUT, DELETE, GET e PATCH para qualquer endereço ([Pipefy Help](https://help.pipefy.com/en/articles/8392669-how-to-create-integrations-with-http-requests)), e a documentação de Notion, Twenty, ClickUp e monday.com não descreve o recurso. A tela de referência é o "connector endpoint filtering" do Microsoft Power Platform, em prévia: Data Policies > Prebuilt Connectors > "Configure connector > Connector endpoints" abre um painel com **lista ordenada de padrões Allow ou Deny**, com curinga, botões "Move up" e "Move down" e uma última regra `*` fixa, Allow ou Deny. O criador do fluxo que aponta para endereço bloqueado vê erro de política no editor. O limite documentado é grave para o Spaceflow: **a regra não avalia endereço montado com variável** na execução ([Microsoft Learn](https://learn.microsoft.com/en-us/power-platform/admin/connector-endpoint-filtering)). No Copilot Studio, o mesmo bloqueio aparece ao salvar, numa faixa de erro com botão "Details" ([Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-copilot-studio/dlp-example-2)).

O n8n mostra a checagem que falta ao Power Platform. Na credencial, o campo "Allowed HTTP Request Domains" tem 3 modos: todos, lista ou nenhum ([n8n Docs](https://docs.n8n.io/build/understand-workflows/create-and-edit-credentials)). A proteção contra SSRF (requisição forjada para a rede interna) bloqueia faixas privadas, loopback e link-local e confere também o redirecionamento e a resolução DNS; ela vem **desligada por padrão** ([n8n Docs](https://docs.n8n.io/deploy/host-n8n/configure-n8n/security/enable-ssrf-protection/)). A allowlist do n8n teve 2 desvios corrigidos em 2026, um deles em nós de IA com URL base escolhida pelo usuário ([VulnCheck](https://www.vulncheck.com/advisories/n8n-credential-exfiltration-via-allowed-http-request-domains-bypass-in-dynamic-node-parameters-endpoint); [Corgea](https://corgea.com/advisories/vulnerabilities/GHSA-64xh-79j6-r5v8)). O Salesforce exige que todo host externo esteja em "Remote Site Settings" ([Salesforce](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/api/apex_callouts_remote_site_settings.htm)), e o ServiceNow controla a saída por faixa de IP ([ServiceNow](https://www.servicenow.com/docs/r/q0JUS4fl39QNjim0ATT18w/2O0_JeL~iW8JVnqZttoDEw)). Zapier, Workato e Retool não têm allowlist de domínio de saída no console.

**O padrão que todos seguem:** entre os que têm o recurso, padrão de endereço com curinga, Allow ou Deny, ordem de avaliação e regra final para "todo o resto".

**O que nenhum deles faz:** nenhum dos 5 concorrentes restringe destinos; nenhuma fonte documenta botão "testar URL" contra a lista, modo "só registrar" para a allowlist ou a lista de fluxos afetados por uma regra nova.

**Recomendação para a tela do ENSPACE:**
- Menu Dados > "Destinos de saída", com o modo: Permitir todos, Só os destinos da lista ou Só registrar.
- Tabela ordenada: padrão (`*.empresa.com.br`, `https://api.parceiro.com/v1/*`), Permitir ou Bloquear, Mover para cima ou para baixo; última linha fixa "Todo o resto".
- Checagem na execução do nó HTTP, depois de montar a URL com os valores do item, no redirecionamento e na resolução DNS.
- Bloqueio de IP privado e loopback sempre ligado, mostrado como leitura ("Rede interna: sempre bloqueada").
- Campo "Testar endereço" que diz qual regra casa.
- Antes de salvar uma regra, a lista de fluxos do Spaceflow que chamaram destinos que ela bloqueia nos últimos 30 dias.
- No fluxo bloqueado, aviso no editor do nó e erro na execução com o nome da regra.

### 5. Prompt injection: o Notion criou os controles depois de um vazamento, e a tela que falta é a de tentativas

Em setembro de 2025, um PDF com texto branco sobre fundo branco fez os agentes do Notion lerem a lista de clientes e montarem uma URL para o servidor do atacante pela ferramenta de busca na web ([The Decoder](https://the-decoder.com/notion-ai-agents-get-security-update-after-data-leak/); [Simon Willison](https://simonwillison.net/2025/Sep/19/notion-lethal-trifecta)). O padrão do ataque junta 3 condições no mesmo agente: acesso a dado privado, leitura de conteúdo não confiável e um canal para fora. Hoje, Settings > "Notion AI" tem "AI Web Search" com **"Enable web search for workspace"** e **"Require confirmation for web requests"**, além de "Model controls" e "Usage" ([Notion FAQ](https://www.notion.com/help/notion-ai-faqs)). Em "Agents", o admin decide quem cria agentes e vê o diretório com criador e última atividade ([Notion](https://www.notion.com/help/custom-agents-sharing-and-permissions)). O registro de auditoria ganhou "Agent viewed web URL" e eventos de allowlist de servidores MCP, mas **nenhum evento de injeção detectada** ([Notion Developers](https://developers.notion.com/compliance/audit-log-events.md)).

Os outros 4 param no liga/desliga. O monday.com tem Administration > "AI governance" > "AI permissions", com "Enable AI features" e tipos de agente liberados por papel; desligar desativa todos os agentes, e religar não restaura o estado anterior ([monday.com](https://support.monday.com/hc/en-us/articles/30934592475410-AI-Permissions); [monday.com](https://support.monday.com/hc/en-us/articles/38507028226066-Managing-permissions-for-monday-service-AI-agents)). O Pipefy expõe `aiEnabled`, `aiAssistantsEnabled` e `pipeAiAgentsEnabled` pela API ([Pipefy Developers](https://developers.pipefy.com/reference/update-ai-settings-mutation)). O ClickUp liga ou desliga a IA para o workspace inteiro numa ClickApp ([ClickUp](https://help.clickup.com/hc/en-us/articles/13826034537623-ClickUp-AI-FAQ), pelo resumo do buscador). O Twenty dá ao agente de IA um papel próprio, que o limita mesmo quando o workflow tem permissão maior ([Twenty Docs](https://docs.twenty.com/user-guide/ai/capabilities/permissions-access-control.md)).

As referências mostram o que pode virar tela. O Azure AI Foundry detecta "User prompt attack" (direto) e **"Document attack"** (instrução escondida em documento, e-mail ou página), este **desligado por padrão**, com a ação bloquear ou só anotar e um resultado binário, sem nível de sensibilidade ([Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection)). O GitHub deixa o admin da organização ligar o firewall do agente Copilot e manter a allowlist de saída ([GitHub Changelog](https://github.blog/changelog/2026-04-03-organization-firewall-settings-for-copilot-cloud-agent/)). O Google descreve 6 camadas para o Gemini e diz que nenhuma é configurável pelo admin ([Google Workspace](https://knowledge.workspace.google.com/admin/security/indirect-prompt-injections-and-googles-layered-defense-strategy-for-gemini?hl=en)). O caso do Atlassian Rovo, em 2026, mostra um erro a evitar: **desligar a busca na web não removeu a ferramenta que abre URLs** ([CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-atlassian-rovo-prompt-injection-20260811-c/)). O OWASP lista 7 mitigações, entre elas privilégio mínimo, aprovação humana para ação de risco e separação do conteúdo externo, e afirma que nenhum método previne por completo ([OWASP](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)); a Anthropic mede 1% de sucesso de ataque adaptativo mesmo com as defesas ([Anthropic](https://www.anthropic.com/research/prompt-injection-defenses)).

**O padrão que todos seguem:** liga/desliga da IA, quem pode usar ou criar agente por papel e limite de créditos; o Notion soma a chave de busca na web e a confirmação humana antes de requisição externa.

**O que nenhum deles faz:** nenhum dos 5 mostra ao admin as tentativas de injeção bloqueadas nem oferece detector de instrução escondida em documento; nenhum produto pesquisado tem nível de sensibilidade configurável.

**Recomendação para a tela do ENSPACE:**
- Menu Dados > "Assistente de IA (BENI)": "Ativar o BENI", "Quem pode usar" (papéis) e "Quem cria agentes e nós de IA".
- Bloco "Saída para fora": "Busca na web" e "Pedir confirmação antes de o BENI acessar um endereço externo". O nó de IA e o nó HTTP chamado pela IA seguem a mesma lista de "Destinos de saída" do ponto 4, para não repetir o erro do Rovo.
- Bloco "Conteúdo lido": "Ler anexos e documentos" e "Detectar instrução escondida em documentos", com Bloquear ou Só registrar.
- Bloco "Ações que pedem confirmação": enviar, editar, excluir e chamar API.
- Painel "Tentativas bloqueadas" (data, fonte lida, item, ação barrada): nenhum concorrente tem, e o painel exige um detector real por trás.
- Eventos no registro de auditoria: `ai.item_read`, `ai.url_accessed`, `ai.injection_blocked`.

### 9. HMAC obrigatório: todos assinam, ninguém obriga

Os concorrentes assinam o corpo da mensagem com HMAC-SHA256 (uma assinatura calculada com um segredo compartilhado, que prova a origem e a integridade da mensagem). O Notion usa `X-Notion-Signature` com o token que chega na criação, e trocar o token exige recriar a assinatura ([Notion API](https://developers.notion.com/reference/webhooks)). O Twenty usa `X-Twenty-Webhook-Signature` e `X-Twenty-Webhook-Timestamp`, com o carimbo de tempo dentro do texto assinado ([Twenty Docs](https://docs.twenty.com/developers/extend/webhooks)). O ClickUp usa `X-Signature`, com o segredo só na resposta da criação ([ClickUp API](https://developer.clickup.com/docs/webhooksignature)). O monday.com manda JWT só quando o webhook nasce de um app com OAuth ([monday Apps](https://developer.monday.com/apps/docs/advanced-concepts)). No Pipefy, nenhuma fonte mostra assinatura; o webhook aceita cabeçalhos próprios ([Pipefy Community](https://community.pipefy.com/questions/233)).

A Stripe tem a melhor tela: o segredo fica na página do webhook, oculto até "Revelar segredo"; "Substituir segredo" expira o antigo na hora ou em até 24 horas, e nesse intervalo cada mensagem leva 1 assinatura por segredo ativo; a aba "Entregas de eventos" mostra estado, código HTTP e próxima tentativa, com "Reenviar" por até 15 dias ([Stripe Docs](https://docs.stripe.com/webhooks)). O Standard Webhooks, especificação aberta adotada por OpenAI, Anthropic, Twilio e outros, fixa os cabeçalhos `webhook-id`, `webhook-timestamp` e `webhook-signature` e aceita várias assinaturas no mesmo cabeçalho durante a troca ([Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md); [standardwebhooks.com](https://www.standardwebhooks.com/)). Assinatura como política da organização só aparece em produtos de outro mercado: Xurrent e 4me ligam webhooks a uma "webhook policy" ([Xurrent](https://www.xurrent.com/product-updates/introducing-webhook-policies); [4me](https://help.4me.com/help/webhook_policy)), e o Contentstack habilita HMAC na organização, mas cada webhook ainda escolhe ([Contentstack](https://www.contentstack.com/docs/administration/hmac-signing)).

**O padrão que todos seguem:** HMAC-SHA256 sobre o corpo cru; os mais seguros põem o carimbo de tempo no texto assinado e rejeitam diferença maior que 5 minutos (Stripe, Slack).

**O que nenhum deles faz:** nenhum produto pesquisado tem uma política de organização que barre webhook sem assinatura; ClickUp, Notion e GitHub não documentam troca de segredo com período em que o antigo e o novo valem juntos.

**Recomendação para a tela do ENSPACE:**
- Menu Acesso programático > "Webhooks" > aba "Política": chave "Exigir assinatura em todo webhook".
- Ao ligar, a tela lista os webhooks sem segredo e oferece "Gerar segredo e avisar o dono" ou "Pausar o envio até configurar".
- Formato Standard Webhooks, com tolerância de 5 minutos, descrito na própria tela com exemplo de verificação.
- Na página de cada webhook: segredo oculto até "Mostrar", "Trocar segredo" com 24 horas de sobreposição e aba "Entregas".

## Continuar no ar: RTO, redundância e backup

### 10. RTO, redundância geográfica e backup segregado: o número existe em PDF, nunca na tela

Dos 5 concorrentes, 2 publicam número. O Twenty declara **RTO e RPO de 6 horas** (RPO é a perda máxima de dados aceita) "conforme o DPA", backup contínuo com snapshot diário, retenção de 30 dias e cópias em locais separados dentro da UE, e gera o DPA assinado na própria tela de configurações, em `/settings/legal/dpa` ([Twenty Legal FAQ](https://docs.twenty.com/user-guide/legal/how-tos/legal-faq)). O monday.com traz **RTO de 24 horas e RPO de 12 horas** numa política de DR de março de 2025, número lido no trecho indexado pela busca, porque o PDF não foi extraído ([monday.com DR Policy](https://dapulse-res.cloudinary.com/image/upload/v1742139129/Disaster_Recovery_Policy_-_March_2025_V2.5.pdf)), e um site de DR em outra região da AWS ([monday.com Trust Center](https://monday.com/trustcenter/datasecure)). O Notion fala em backups automáticos entre regiões e plano de DR testado 1 vez por ano, sem número ([Notion security](https://www.notion.com/sv/security)). O ClickUp diz só "fully redundant" ([ClickUp Security](https://clickup.com/security)); o Pipefy roda na Oracle Cloud nos EUA, em várias zonas, sem número ([Pipefy Security](https://pipefy.com/security/)).

Na tela, o Notion é o único dos 5 que deixa escolher a região: Organization settings > "Data & Compliance" > "Data Residency" define a região de workspaces novos, e cada região tem a sua região de backup (Frankfurt com backup na Irlanda, Oregon com backup em Ohio) ([Notion](https://www.notion.com/help/data-residency)). O monday.com só mostra a região, sem edição, em Admin > General > Profile ([monday.com](https://support.monday.com/hc/en-us/articles/4404392703250-Data-residency)). A Atlassian é a referência completa: publica RPO de 1 hora e RTO de 6 horas como meta ([Atlassian Trust](https://www.atlassian.com/trust/security/data-management)), vende um Backup and Restore com RTO de 12 horas e RPO de 24 horas ([Atlassian](https://support.atlassian.com/organization-administration/docs/overview-of-atlassian-backups/)) e tem uma tela de mudança de região com janela, estados "MOVE SCHEDULED" e "MOVE IN PROGRESS" e cancelamento só no primeiro ([Atlassian](https://support.atlassian.com/security-and-access-policies/docs/move-data-to-another-location/)). O Slack publica o par de cada região e mostra que **São Paulo faz backup na mesma região** ([Slack](https://slack.com/help/articles/360035633934)).

O backup segregado pedido pelo cliente corresponde, na AWS, a cópia para outra região e para outra conta, com Vault Lock em modo compliance, em que nem o root nem a AWS apagam a cópia, ou com o cofre logicamente isolado ([AWS Whitepaper](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html); [AWS Backup](https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html)). A AWS descreve 4 estratégias de DR, do backup e restauração (RTO em horas) ao ativo/ativo (perto de zero), e avisa que replicação contínua não protege contra exclusão maliciosa. Entre os SaaS, a Atlassian é o único caso de backup na conta do próprio cliente, e já não oferece a opção a clientes novos.

**O padrão que todos seguem:** RTO e RPO como meta escrita em documento (DPA, política de DR, página de trust), nunca como garantia com crédito; backup na mesma jurisdição, em outra região ou zona; evidência no trust center, atrás de pedido de acesso.

**O que nenhum deles faz:** nenhum produto pesquisado mostra ao cliente o último backup concluído, a região de backup em tela ou o RTO contratado; nenhum dos 5 cita backup em conta de nuvem separada ou imutável.

**Recomendação para a tela do ENSPACE:**
- Menu "Continuidade", só leitura, alimentado pelo contrato do ambiente dedicado:
  - Região de produção e Região de backup;
  - Conta do backup: mesma conta ou separada; Imutável: sim, com retenção mínima;
  - Frequência e retenção do backup;
  - RTO e RPO contratados, com link para o adendo;
  - Último backup concluído e Último teste de recuperação (data e resultado).
- Botão "Baixar adendo de continuidade", como o DPA do Twenty.
- Nível de redundância em 3 opções descritas, sem edição pelo cliente: Backup em outra região, Ambiente de espera em outra região, Ativo/ativo.

## Um menu de 5 seções cobre os 10 pedidos

Os produtos maduros agrupam segurança por tema, não por pedido: o Notion separa "Data & Compliance" de "Identity & provisioning", a Atlassian separa "Directory", "Security" e "Insights", e o GitHub junta tokens e políticas em "Personal access tokens". Seguindo esse agrupamento, o console do ENSPACE organiza os 10 controles assim:

| Seção do menu | Itens | Pedidos |
|---|---|---|
| Identidade | Domínios, Provisionamento (SCIM), Sessões, Convites | 6, 7, 8 |
| Acesso programático | Tokens de API, Contas de serviço, Webhooks | 2, 3, 9 |
| Dados | Exportação e download, Destinos de saída, Assistente de IA (BENI) | 4, 5, 8 |
| Auditoria | Registro de auditoria, Envio ao SIEM | 1 |
| Continuidade | Região, backup, RTO e RPO, último teste | 10 |

3 decisões de interface se repetem em todas as seções e dão unidade ao protótipo. A primeira é o estado triplo Desligado, Só registrar e Bloquear, que o Azure (bloquear ou anotar) e o Box (monitorar) usam e que nenhum dos 5 concorrentes oferece. A segunda é o efeito antes de salvar: quantos tokens ficam fora da política, quais fluxos param, quem perde a exportação. A terceira é o segredo mostrado 1 vez, com "Trocar" ao lado de "Revogar". O ponto 8 aparece em 2 seções porque o cliente juntou exportação e convite num pedido só.

## Conclusão

O pedido do cliente cobra do ENSPACE um nível que só Notion e Atlassian alcançam por inteiro, e em 5 itens o ENSPACE passa à frente dos 5 concorrentes diretos só por ter a tela. A vantagem está onde o mercado para no documento: o Sentinel com os 6 campos do CCF Push, o aviso de token que expira, a lista de fluxos afetados por uma regra de destino, a política de assinatura obrigatória e o último backup concluído. Nenhum desses itens exige inventar um padrão: cada um tem referência publicada (Microsoft, GitHub, Power Platform, Standard Webhooks, AWS Backup).

O risco está em 2 promessas que o mercado evita fazer. A revogação "imediata" depende do ciclo de cerca de 40 minutos do Entra, e a tela precisa dizer isso e oferecer "Encerrar sessões" para o resto. A proteção contra prompt injection não tem método completo, segundo o OWASP; o caminho honesto, que o Notion seguiu depois do incidente, é mostrar controles de saída e de confirmação humana com data, e só exibir "tentativas bloqueadas" quando houver detector por trás. Os 2 pontos pedem decisão de engenharia antes do protótipo: a checagem da allowlist na execução, depois de montar a URL, e a ligação entre `active=false` do SCIM e o encerramento de todas as sessões do usuário.

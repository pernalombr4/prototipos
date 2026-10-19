# Segurança no admin: briefing

## A demanda como veio

> observe esses pedidos de um cliente.
>
> sao todos a nivel de admin
>
> pode entrar no admin em develop: control.develop.enspace.io, pra ver como funciona e prototipar soluçao pra cada um dos pontos levantados pelo cliente (pro que couber prototipo). basicamente o admin é o local pra administratr essas configuraçoes maiores sobre workspaces num ambiente separado. o cliente vai ver todos os seus workspaces e pode fazer a gestao.
>
> simule o atual menu do admin + as opções que precisamos entregar pro cliente.
>
> e coloque na barra de interaçao com o prototipo botoes de atalho pra ver cada um dos pontos.
>
> antes PESQUISE PROFUNDAMENTE /deep-research /product-management:synthesize-research como outros sistemas fazem gestoes similares em suas plataformas administrativas/de gestao.
>
> aí sim prototipe.

Depois, no meio da rodada: "nao precisa explorar o admin INTEIRO, somente o que fizer sentido e tiver relaçao com os pedidos do cliente ok?"

### Os 10 pedidos do cliente

Vieram por e-mail da área de Segurança da Informação de um cliente corporativo do setor de energia. **O repositório é público:** o nome do cliente, das pessoas e os contatos ficam fora. Os pedidos, resumidos sem mudar o sentido:

| # | Pedido |
|---|---|
| 1 | Logs e SIEM: o Audit Log registra login aceito e recusado, visualização de registro, download e exportação? Integra com o Microsoft Sentinel por API ou outro mecanismo automático? Qual a retenção? |
| 2 | Governança de tokens de API: inventário e revogação centralizada para o administrador, prazo máximo obrigatório de expiração e bloqueio de token sem validade. |
| 3 | Credencial para integrações: conta ou credencial de serviço, sem depender da conta pessoal de alguém. |
| 4 | Allowlist para o nó de Requisição HTTP dos Spaceflows: lista de destinos autorizados. |
| 5 | Prompt injection: controles específicos para documentos e registros processados pela IA. Há evolução planejada ou prazo? |
| 6 | SCIM com Microsoft Entra ID e revogação imediata das sessões quando a pessoa é desativada ou removida. |
| 7 | Impedir que pessoas do domínio corporativo criem contas ou workspaces fora do ambiente autorizado, ativo antes da entrada em produção. |
| 8 | Restringir exportação e download de dados e anexos por cargo ou licença; restringir convites a domínios autorizados. |
| 9 | Autenticação de webhooks por assinatura HMAC, configurável como obrigatória no ambiente. |
| 10 | RTO formal para o ambiente, opções de redundância geográfica e backups segregados da região e/ou da conta de produção. |

O cliente pede também a previsão de entrega dos itens que dependem de desenvolvimento. **Prazo não é decisão de protótipo:** o protótipo mostra a tela; a data é do time de produto e de engenharia.

## Tela e jornada

ENSPACE Admin (`control.develop.enspace.io`), o painel que administra a instância acima dos workspaces. A proposta é o admin que o **cliente** usa para governar a própria organização: vê só os workspaces dele e configura segurança, identidade, integrações e dados.

## O que seria sucesso

A pessoa de segurança do cliente abre o admin, acha cada um dos 10 pontos no menu e consegue configurar ou conferir cada um sem pedir nada ao suporte.

## O que a pesquisa de UX já dizia

Procurei em `../enspace-ux-research` (temas, `UX_REPORT.md`) por admin, segurança, token, log e auditoria. **Não há auditoria do ENSPACE Admin.** O tema mais próximo é `configuracoes-do-sistema` (configurações do workspace, não do admin), e 3 fricções de lá valem para as telas novas:

- **S3-F1:** alteração não salva é descartada em silêncio ao trocar de aba. Nas telas novas, toda configuração mostra "1 alteração não salva" e tem Salvar e Descartar explícitos.
- **S3-F6:** as abas não têm URL própria. Aqui a tela vai na URL (`?tela=tokens`).
- **S3-F7:** 3 convenções de Salvar na mesma tela. Aqui todas as telas de configuração usam o mesmo par Descartar e Salvar no cabeçalho, ou no fim do formulário.

## O develop hoje

Visto em 2026-10-19, pela tela, com a conta da redatora (perfil Admin). Só as telas ligadas aos pedidos.

| Tela | URL | O que tem |
|---|---|---|
| Login | `/login` | "Painel de Controle Enterprise", entrada única "Entrar com Enspace Account" (SSO) |
| Home | `/a/dashboard?entity=requests&period=daily&start=...&end=...` | 4 contadores (Usuários, Workspaces, Requests, Logs de IA) e gráfico |
| Audit | `/a/security/audit` | tabela ID, Action, Model, Reference, User, Workspace, IP Address, Date; busca, período ("Em todo o período", 7, 14, 30 dias, 3 e 6 meses, 1 ano), Colunas; gaveta com Usuário, Workspace, Membro, Modelo, Rastreamento, Requisição ("API Token: Não"), Datas (com "Expira em"), Alterações e Dados |
| Request | `/a/security/request` | log de requisições HTTP: Endpoint, Method, Status, Duration, User, Workspace, IP, Date |
| AI Usage | `/a/security/ai-usage` | log de uso de IA: Provider, Model, Cost, Input, Output, Total, Duration |
| Workflows | `/a/security/workflow` | log dos fluxos: Level, Event (`workflow.completed`, `edge.traversed`), Workflow, Node, Duration |
| Users | `/a/users` | ID, E-mail, Confirmado, Bloqueado, Criado; Ativação em Massa, Exportar |
| Workspaces | `/a/workspaces` | ID, Nome, Status, Membros, Carteira, Criado; gaveta com abas Dados, Membros, Logs, Statistics |
| Configurações Gerais | `/a/settings` | 32 configurações em 4 grupos (Sistema, Segurança, IA, Cobrança), cartões com título, chave técnica, selo "sem efeito" ou "alterada do padrão", descrição e controle |

Evidência: [`evidencias/develop-configuracoes-gerais.jpg`](evidencias/develop-configuracoes-gerais.jpg) e [`evidencias/develop-configuracoes-seguranca.jpg`](evidencias/develop-configuracoes-seguranca.jpg). As telas de log mostram e-mail de pessoas reais do develop: **o print não foi commitado** (repositório público); a descrição acima substitui.

### O que já existe e serve

- **Audit Log** existe e grava toda criação e alteração de modelo, com IP, workspace e a marca "API Token". A retenção está implícita: o evento de 19/10/2026 "expira em" 08/10/2028, **720 dias**.
- **Request Log** e **Workflow Log** já guardam o que o envio ao SIEM e a allowlist precisam (endpoint, status, nó, fluxo).
- **Configurações Gerais** já tem o cartão de configuração que as telas novas reaproveitam (`_Regra.vue`).
- Configurações que tocam os pedidos e **estão marcadas "sem efeito"**: `allow_create_workspaces` (pedido 7), `session_timeout_minutes` (pedido 6), `enable_audit_log` (pedido 1), `max_workspaces_per_user`. Os 3 primeiros são o germe do que o cliente pediu, hoje sem funcionar.
- Rate limit de webhooks públicos de workflow (`webhook_rate_limit_*`): existe, sem assinatura.

### Onde trava, pedido a pedido

| # | Hoje no admin |
|---|---|
| 1 | O log só tem `Create` e `Update` sobre modelos. Nenhum evento de login (aceito ou recusado), visualização, download ou exportação. Não há envio ao SIEM nem retenção visível. |
| 2 | Não há lista de tokens no admin. No schema, `ApiKey.expires_at` é opcional: token sem validade é permitido. |
| 3 | Não há conta de serviço. A integração usa o token de uma pessoa. |
| 4 | O nó de Requisição HTTP chama qualquer endereço; nenhuma configuração de destino. |
| 5 | Só o log "AI Usage" (custo e tokens). Nenhum controle de leitura, saída ou confirmação. |
| 6 | Não há SCIM nem lista de sessões. `session_timeout_minutes` está "sem efeito". |
| 7 | Não há verificação de domínio. `allow_create_workspaces` vale para a instância inteira e está "sem efeito". |
| 8 | Não há regra de exportação por cargo nem lista de domínios para convite. |
| 9 | O schema `Webhook` não tem segredo de assinatura. |
| 10 | Nenhuma tela de continuidade, backup ou região. |

## A casca da tela, item por item

Copiada de `/a/dashboard` e `/a/settings` em 2026-10-19. Mora em `_CascaDoAdmin.vue`.

- **Barra do topo (56 px):** quadrado rosa com foguete, "ENSPACE" em rosa com "Admin" sobrescrito, "CONTROL PANEL" embaixo; à direita a bandeira do idioma, o ícone de sol (tema), avatar, nome, "Admin" e seta.
- **Menu lateral:** busca "Pesquisar..." com `CTRL` `K`; grupos e itens, nesta ordem e com estes rótulos:
  - GERAL: Home, Users, Workspaces
  - FINANCEIRO: Wallets, Transactions, Credit Requests
  - INFRAESTRUTURA: Dashboard, Queues, Cache, Migrations
  - PRODUCT: Features, Feedbacks, Preferences, Communications, Notifications, Notification Types
  - LOGS: Audit, Request, AI Usage, Workflows
  - PLANS: Planos, Produtos, Assinaturas
  - CONFIGURAÇÕES: Configurações Gerais
- **Item ativo:** texto rosa e fundo rosa claro.
- **Cabeçalho de página:** seta de voltar e título ("Audit Logs", "a-settings").
- **Fundo:** gradiente rosa claro no topo.

Diferenças da cópia, declaradas: o ícone de Cache (octicon) e o de Migrations (eos-icons) não existem na coleção instalada aqui (lucide) e entram os mais próximos; a bandeira vira o selo "BR"; a barra de rolagem rosa do menu fica de fora.

**Achado da casca (fica como está):** o menu mistura inglês e português ("Users", "Planos", "Configurações Gerais") e o título da tela de configurações é a chave técnica "a-settings".

## Preparo

Nada foi criado no develop. A exploração foi só leitura, pela tela. O dado do protótipo é inventado (`mocks.ts`), com a estrutura de `ApiKey`, `Webhook` e `Workspace` do `enspace-sdk-schemas` e as colunas do Audit Log de hoje.

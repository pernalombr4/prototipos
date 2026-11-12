# O painel conta o que cada membro vê

O mercado separa 2 decisões que a pergunta em aberto P002 do protótipo (qual permissão abre Tarefas › Painel) junta numa só: quem abre a tela e quais tarefas entram em cada número. Para abrir, os 15 produtos pesquisados usam papel, licença ou compartilhamento. Os painéis fixos e nativos, como as abas Reports e SLA do Jira Service Management, o Dashboards Basic do Pipefy e o Explore Lite do Zendesk, abrem sem configuração para quem já trabalha o processo. Para contar, **9 dos 15 produtos usam as permissões de quem olha**, e os 5 BI pesquisados (Power BI, Tableau, Looker, Metabase e Sisense) aplicam o filtro de linha antes do total, no servidor. Asana, Smartsheet, Salesforce e o Performance Analytics do ServiceNow têm uma superfície que conta com as permissões do criador ou de um usuário fixo, e por isso mostram números de registros que o visualizador não abre. A visão de gestor por equipe só aparece onde o modelo de dado tem hierarquia ou time (Salesforce, HubSpot, Zendesk, ServiceNow), quase sempre no plano mais caro. Nenhum produto mostra métricas de equipe a convidado ou a cliente de portal. **A proposta para o ENSPACE, para a redatora validar:** o painel abre para todo membro que vê tarefas, o cargo ganha a caixa "Ver o painel de tarefas" para o administrador desligar, e cada número conta só as tarefas que o membro abre nas listas de Rápidas e de Agendadas. Só essa regra faz o número bater com a lista que o clique abre, e o ENSPACE já a aplica às contagens de itens desde a release 3.2.0. Antes do desenvolvimento, o produto precisa escrever a regra de visibilidade das listas, que a documentação deixa com 5 lacunas, e decidir como o gestor com licença Standard vê a equipe inteira.

Fontes acessadas em 2026-11-11; a data da página aparece quando a página mostra uma. Os caminhos do en-docs são relativos a `en-docs/content/pt/`.

## 2 decisões que o mercado separa: abrir a tela e contar as linhas

Todo produto pesquisado responde 2 perguntas em lugares diferentes. A pergunta de tela é quem abre o painel ou o relatório. A pergunta de linha é quais registros entram em cada número para quem abriu. O Looker dá nome às camadas: **acesso a conteúdo** (pastas e dashboards), **acesso a dado** (conjuntos de modelos e filtro de acesso por linha) e **acesso a função**; a pasta não controla dado nenhum ([Looker docs, Access control and permission management](https://docs.cloud.google.com/looker/docs/access-control-and-permission-management)). O Jira pede 3 permissões para um gadget mostrar dado: o painel compartilhado, o filtro compartilhado e a navegação nos projetos que o filtro consulta; sem 1 delas, o gadget fica sem resultado ([Atlassian KB, 2025-09-26](https://support.atlassian.com/jira/kb/gadget-on-shared-dashboard-returns-could-not-be-retrieved-error/)). O HubSpot escreve a mesma separação no CRM: o acesso ao painel não passa por cima da permissão de registro, de fonte ou de campo ([HubSpot, Manage reports in your reports list, 2026-08-18](https://knowledge.hubspot.com/reports/manage-reports-in-your-reports-list)).

A tabela resume as 2 respostas de cada produto. Cada linha tem fonte nas seções seguintes.

| Produto | Quem abre (tela) | O que cada número conta (linha) |
|---|---|---|
| ClickUp | membro e admin; convidado só o painel compartilhado com ele | o que quem olha acessa na origem |
| monday.com | painel Main: toda a conta; Private: os convidados do dono | o que quem olha acessa nos boards |
| Asana | privado ao dono até ele compartilhar; quem recebe só lê | gráfico: permissões do criador; detalhe: de quem olha |
| Wrike | membros do espaço, conforme o tipo do espaço; Collaborator e Viewer não abrem | o que foi compartilhado com quem olha |
| Smartsheet | Admin ou Viewer do painel | por widget: quem editou por último ou quem olha |
| Notion | quem acessa o banco de dados | herda a permissão do banco e da página |
| Jira | quem recebe o painel e o filtro | o que quem olha navega nos projetos |
| Jira Service Management | agente, só leitura, em abas fixas | não documentado |
| Zendesk | papel do Explore: Admin, Editor, Viewer ou No access | escopo próprio do Explore: grupos, marcas ou tudo |
| Freshdesk | agentes, por padrão; edição pelo papel | não documentado no Analytics |
| ServiceNow | criador e admin, até compartilhar | lista: quem olha; pontuação do Performance Analytics: coletada sem a permissão do registro |
| Pipefy | Basic: admin e membro do pipe; Pro: permissão por painel | visão restrita: só os cards da pessoa |
| Kissflow | papéis de administrador do processo e de relatório | não documentado |
| HubSpot | permissão Reports access, com níveis | o que quem olha acessa nos registros |
| Salesforce | pasta compartilhada e permissão do perfil | relatório: quem olha; painel: criador, usuário fixo ou quem olha |

A separação pesa no ENSPACE porque cada número, coluna e barra do painel abre a lista das tarefas por trás dele ([épico do painel](../../requisitos/epico.md)). A regra de tela decide quem chega à página. A regra de linha decide se o número e a lista concordam.

## 9 dos 15 produtos contam com as permissões de quem olha

O padrão do mercado é o número calculado com as permissões de quem abre o painel. No ClickUp, o painel tem as permissões do lugar onde o dado mora, e o convidado só vê um cartão se acessa as tarefas por trás dele ([ClickUp, Share Dashboards, 2026-10-14](https://help.clickup.com/hc/en-us/articles/6312198211863-Share-Dashboards); [ClickUp, Dashboards feature availability and limits, 2026-10-29](https://help.clickup.com/hc/en-us/articles/21257864098071-Dashboards-feature-availability-and-limits)). No monday.com, **os widgets respeitam sempre a permissão dos boards ligados**: 2 pessoas veem números diferentes no mesmo painel, e quem vê parte dos itens recebe valores calculados só sobre essa parte ([monday.com, Dashboard permissions, 2026-04-03](https://support.monday.com/hc/en-us/articles/360015914079-Dashboard-permissions)). No Wrike, um widget que puxa tarefas da conta inteira mostra a cada pessoa só as tarefas compartilhadas com ela ([Wrike, Dashboards in Wrike, 2026-09-24](https://help.wrike.com/hc/en-us/articles/209604469-Dashboards-in-Wrike)). O Notion herda a permissão do banco de dados ([Notion, Dashboards view](https://www.notion.com/help/dashboards)). O HubSpot mostra ao usuário com acesso só aos próprios registros apenas esses registros nos relatórios ([HubSpot user permissions guide, 2026-10-13](https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide)). No Salesforce, o mesmo relatório devolve contagens diferentes para pessoas diferentes, por causa do compartilhamento privado e da hierarquia de papéis ([Salesforce Help, Report Returns Different Record Counts, 2026-07-14](https://help.salesforce.com/s/articleView?id=000333143&language=en_US&type=1)). No ServiceNow, cada linha de um relatório de lista passa pela permissão de leitura da tabela de origem, e o relatório avisa quantas linhas saíram por segurança ([ServiceNow, Report permission issues, 2026-09-10](https://www.servicenow.com/docs/r/now-intelligence/reporting/report-permission-issues.html)).

O Jira e o Pipefy completam os 9 com fontes mais fracas. No Jira, respostas da comunidade descrevem o gadget com resultado parcial e sem erro quando a segurança de issue esconde parte delas ([Atlassian Community](https://community.atlassian.com/forums/Jira-questions/Dashboard-Gadgets-are-not-shown-correctly-to-All-Logged-In-User/qaq-p/1977694)). No Pipefy, uma resposta da equipe de 2022-11-09 diz que o usuário de visão restrita vê no painel só os dados dos cards atribuídos a ele; a ajuda oficial não trata do assunto ([Pipefy Community](https://community.pipefy.com/ask-the-community-43/pipe-dashboard-permissions-for-restricted-view-users-2071)).

4 produtos têm uma superfície que conta com as permissões de outra pessoa. **O Asana desenha os gráficos com as permissões do criador**, iguais para todo visualizador, e filtra pelo visualizador só o detalhe que o clique abre ([Asana, Universal reporting](https://help.asana.com/s/article/universal-reporting)). Uma resposta no fórum do Asana, de 2026-05-09, afirma o contrário, e nenhuma resposta da equipe resolve o conflito ([Asana Forum, How Do Reports Work](https://forum.asana.com/t/how-do-reports-work/1140345)). O Smartsheet deixa escolher por widget de relatório. No modo **Last widget Editor**, o widget mostra o dado de quem o editou por último, igual para todos e visível mesmo a quem não acessa as planilhas. No modo **Their own perspective**, cada visualizador precisa do compartilhamento das planilhas, e o widget fica vazio no painel publicado ([Smartsheet, Control widget content when source is a report](https://help.smartsheet.com/articles/2480331-control-what-people-see-report-chart-widget)). O Salesforce oferece 3 opções em **View Dashboard As**: o criador, outra pessoa nomeada ou o visualizador ([Salesforce Help, Configure Dashboard Data Visibility](https://help.salesforce.com/s/articleView?id=sf.dashboards_view_as.htm&language=en_US&type=5)). A ajuda avisa que **o painel estático pode mostrar a quem olha mais do que ele veria**, inclusive dado pessoal quando quem executa é um administrador ([Salesforce Help, Dashboard Data Visibility Considerations](https://help.salesforce.com/s/articleView?id=sf.dashboards_view_as_considerations.htm&language=en_US&type=5)). O painel dinâmico, que conta pelo visualizador, tem **limite de 3 a 10 por organização**, conforme a edição, não atualiza por agendamento e não fica em pasta privada ([Salesforce Help, Dynamic Dashboards](https://help.salesforce.com/s/articleView?id=sf.dashboards_dynamic_overview.htm&language=en_US&type=5)). No ServiceNow, um processo agendado coleta a pontuação do Performance Analytics. A permissão do indicador controla onde ele aparece, e a linha da pontuação só fica protegida com outra regra de leitura, segundo a comunidade ([ServiceNow Community](https://www.servicenow.com/community/platform-analytics-forum/restricting-access-to-pa-indicator-scores/m-p/3595379)).

O service desk acrescenta um modelo e várias lacunas. **O Zendesk dá ao Explore um escopo de dado próprio**, definido no papel do Explore: os grupos do usuário, grupos escolhidos ou tudo, com o escopo por grupo só no Enterprise ([Zendesk, Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)). A ajuda não liga esse escopo à regra de quais tickets o agente acessa no Support. O Explore também não distingue grupo privado de público, e o administrador alinha as 2 regras à mão (mesma fonte). O HubSpot documenta 1 exceção à própria regra: quem não acessa um pipeline restrito vê os registros dele nos relatórios ([HubSpot, Limit access to your HubSpot assets, 2026-09-30](https://knowledge.hubspot.com/account-security/limit-access-to-your-hubspot-assets)). O Jira Service Management, o Analytics do Freshdesk e o Kissflow não documentam se o relatório filtra pelo visualizador. No Freshdesk, relatos da comunidade se contradizem ([Freshworks Community](https://community.freshworks.com/ideas/restricted-access-in-analytics-22753)).

A conta por um usuário fixo existe para entregar a quem lidera um número da equipe sem abrir os registros a ele. O custo aparece no clique: no Asana, o visualizador vê no gráfico uma contagem cujo detalhe ele não abre. O limite do Salesforce aos painéis dinâmicos indica que calcular por visualizador custa mais ao servidor; a ajuda não diz o motivo do limite, e essa leitura é desta pesquisa. Asana, Smartsheet e Salesforce descrevem na própria ajuda o efeito da conta por outra pessoa. É esse o efeito que o painel do ENSPACE reproduz se contar o workspace inteiro para todo membro.

## Os 5 BI calculam o total depois do filtro de linha, no servidor

Os 5 BI tratam o filtro de linha como regra do servidor, aplicada antes de qualquer soma. No Power BI, o filtro avalia cada linha, e gráficos, tabelas e totais refletem só as linhas liberadas ([Microsoft Learn, RLS with Power BI, 2026-07-08](https://learn.microsoft.com/en-us/fabric/security/service-admin-row-level-security)). **Quem não está em nenhum papel de segurança de linha não vê dado nenhum**, e quem está em 2 papéis vê a soma dos 2. A FAQ da mesma página responde que não há como esconder o detalhe e liberar só o total. A segurança de linha vale só para o papel Viewer do workspace: Admin, Member e Contributor escapam dela porque editam o modelo (mesma fonte).

Os outros 4 fazem o mesmo, cada um com um ponto de falha próprio. O Tableau avisa que o filtro de usuário montado no workbook cai para quem pode salvar ou baixar o conteúdo, e recomenda a política de dado aplicada no servidor na maioria dos casos ([Tableau Help, Overview of row-level security options](https://help.tableau.com/current/online/en-us/rls_options_overview.htm)). O Looker exige declarar o filtro de acesso em cada Explore: **a Explore sem a declaração fica sem restrição**, e todo usuário de uma Explore com filtro precisa de valor no atributo, administrador incluído ([Looker docs, access_filter](https://docs.cloud.google.com/looker/docs/reference/param-explore-access-filter)). No Metabase, a versão filtrada da tabela substitui a original em todo lugar, o atributo que não casa devolve vazio, e SQL nativo e link público contornam a regra ([Metabase docs, Row and column security](https://www.metabase.com/docs/latest/permissions/row-and-column-security)). O Sisense tira do total as linhas não liberadas, mesmo quando o campo protegido não está no widget. Ele recomenda negar tudo a quem não tem regra e fica com a combinação mais restritiva entre a regra de usuário e a de grupo ([Sisense docs, Data Access Security](https://docs.sisense.com/main/SisenseLinux/data-access-security.htm)).

Nos guias de analytics embarcado, quem decide a identidade e a regra é o app hospedeiro. No Power BI Embedded, os papéis atribuídos no serviço não afetam o token do embed, e a conta de serviço só carrega o usuário final quando o token leva a identidade dele ([Microsoft Learn, Security in Power BI embedded analytics, 2025-12-15](https://learn.microsoft.com/en-us/power-bi/developer/embedded/embedded-row-level-security)). O Looker exige um identificador externo único por usuário, porque o identificador reaproveitado pode mostrar dado a quem não teria acesso ([Looker docs, Signed embedding](https://docs.cloud.google.com/looker/docs/signed-embedding)). O embed do Metabase sem identidade não aplica segurança de linha. O filtro só restringe quando o servidor o grava travado no token, e **esconder o filtro na tela não restringe nada** ([Metabase docs, Guest embedding](https://www.metabase.com/docs/latest/embedding/guest-embedding)). No painel nativo do ENSPACE, o equivalente é o back-end aplicar, na mesma consulta que gera o número, a regra de visibilidade que as listas de tarefas já aplicam.

Os guias de segurança pedem o mesmo em termos gerais. O controle AC-6 do NIST SP 800-53, o catálogo de controles de segurança do governo dos EUA, pede liberar só o acesso necessário para as tarefas atribuídas, com revisão periódica dos privilégios ([CSF Tools, NIST SP 800-53 r5 AC-6](https://csf.tools/reference/nist-sp-800-53/r5/ac/ac-6/)). O guia de autorização da OWASP, a fundação aberta de segurança de aplicações web, pede negar por padrão, conferir a permissão em toda requisição e em cada objeto, decidir no servidor e centralizar a lógica ([OWASP, Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)).

Desses produtos saem 4 lições para o painel:
- o total e a contagem saem depois do filtro, na mesma consulta do servidor;
- a regra de combinação precisa estar escrita: o Power BI soma os papéis, o Sisense fica com o mais restritivo e o Metabase devolve erro;
- editar e exportar podem escapar da regra de linha (Power BI, Tableau), então a exportação em CSV do painel segue a mesma regra;
- o número calculado de antemão para todos, como a pontuação do Performance Analytics, escapa da permissão do registro.

## Painel fixo abre para quem trabalha o processo; o controle fino é pago

Os painéis que o produto entrega prontos abrem para quem já trabalha o processo. No Jira Service Management, a permissão de navegar no espaço, dada ao papel de agente, **abre as abas Reports, People e SLA só para leitura** ([Atlassian, Customize JSM permissions](https://support.atlassian.com/jira-service-management-cloud/docs/customize-jira-service-management-permissions)). O colaborador, com licença do Jira e sem papel de agente, não tem relatórios na lista de permissões, e o cliente do portal também não ([Atlassian, What are space roles in JSM](https://support.atlassian.com/jira-service-management-cloud/docs/what-are-user-types-and-roles/)). Segundo a comunidade, não há como bloquear 1 relatório por pessoa ou por grupo ([Atlassian Community](https://community.atlassian.com/forums/Jira-Service-Management/Permission-to-see-Reports/qaq-p/1669499)). O Dashboards Basic do Pipefy, grátis em todos os planos, traz painéis padrão que ninguém personaliza, sem papéis nem permissões, e abre para administradores e membros do pipe ([Pipefy, What are dashboards, 2024-01-10](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)). Um pedido de 2025-09-18 descreve o membro exportando a base inteira do pipe e pede um papel só de cards; em 2026-03-27, o suporte respondeu que o acesso de membro inclui os relatórios do pipe, e o pedido segue aberto ([Pipefy Community](https://community.pipefy.com/ideas/restrict-member-level-access-to-reports-and-extract-database-4766)). O Explore Lite do Zendesk dá a todo usuário do Support os painéis prontos, só para leitura ([Zendesk, Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)). O Freshdesk abre os relatórios aos agentes por padrão ([Freshdesk, Report sharing in Freshdesk Analytics, 2024-06-07](https://support.freshdesk.com/en/support/solutions/articles/50000004707-report-sharing-in-freshdesk-analytics)).

O padrão de abertura muda com a natureza do painel. **O painel que o usuário cria nasce fechado**: o do Asana é privado ao dono ([Asana, Universal reporting](https://help.asana.com/s/article/universal-reporting)), o relatório novo do ServiceNow abre só para o criador e o administrador ([ServiceNow, Report permission issues](https://www.servicenow.com/docs/r/now-intelligence/reporting/report-permission-issues.html)), e o gráfico de carga criado na Home do Wrike é privado ([Wrike, Sharing Workload Charts, 2026-09-24](https://help.wrike.com/hc/en-us/articles/9781066282007-Sharing-Workload-Charts)). **O painel que o produto entrega pronto nasce aberto** para quem trabalha o processo. O painel do ENSPACE tem catálogo fechado, igual para todo membro ([parte 14](../../requisitos/parte-14-personalizar-o-painel.md), RN652), e pertence ao 2º grupo.

5 dos 15 produtos documentam uma chave liga e desliga do administrador para o painel. O Asana desliga o Reporting no domínio inteiro, e a aba some para todos ([Asana, Universal reporting](https://help.asana.com/s/article/universal-reporting)). O Zendesk liga ou desliga o Explore por pessoa no Professional e por papel no Enterprise ([Zendesk, Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)). O HubSpot tira os relatórios do menu de quem não tem a permissão Reports access ([HubSpot user permissions guide](https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide)). O Freshdesk define o nível de Analytics no papel ([Freshdesk, Report sharing](https://support.freshdesk.com/en/support/solutions/articles/50000004707-report-sharing-in-freshdesk-analytics)). O Dashboards Pro do Pipefy tem, por painel, a opção de não mostrar o painel ([Pipefy, What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)). ClickUp, monday.com, Wrike, Smartsheet e Notion limitam por plano, sem chave para desligar o painel.

O controle fino custa mais nos fornecedores que o oferecem. O Pipefy cobra o Dashboards Pro à parte, **US$ 2,99 por usuário por mês**, nos planos Business e acima, pelo preço publicado em 2024 ([Pipefy, What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)). O escopo por grupo do Zendesk é do Enterprise ([Zendesk, Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)). O compartilhamento de painel por time do HubSpot é do Enterprise ([HubSpot, Manage your dashboards, 2026-07-29](https://knowledge.hubspot.com/dashboards/manage-your-dashboards)). O painel dinâmico do Salesforce começa no Enterprise ([Salesforce Help, Dynamic Dashboards](https://help.salesforce.com/s/articleView?id=sf.dashboards_dynamic_overview.htm&language=en_US&type=5)), e o Analytics do Kissflow só existe no Enterprise ([Kissflow, FAQs: Analytics](https://community.kissflow.com/t/y4h9qz6/faqs-analytics)).

Convidado e externo ficam fora das métricas da equipe. O convidado do ClickUp abre só o painel compartilhado com ele, só lê e não vê a carga de trabalho ([ClickUp, Dashboards feature availability, 2026-10-29](https://help.clickup.com/hc/en-us/articles/21257864098071-Dashboards-feature-availability-and-limits); [ClickUp, Workload view feature availability, 2026-10-28](https://help.clickup.com/hc/en-us/articles/30657456679703-Workload-view-feature-availability-and-limits)). O convidado do monday.com entra como leitor gratuito ([monday.com, Dashboard permissions](https://support.monday.com/hc/en-us/articles/360015914079-Dashboard-permissions)). As licenças Collaborator e Viewer do Wrike não abrem painéis, qualquer que seja o espaço ([Wrike, Creating a Dashboard, 2026-11-10](https://help.wrike.com/hc/en-us/articles/22009878498455-Creating-a-Dashboard)). O convidado do Pipefy não vê card ([Pipefy, company guest and external guest, 2026-08-13](https://help.pipefy.com/en/articles/6093562-differences-between-company-guest-and-external-guest)), e o usuário guest e de portal do Salesforce não acessa as pastas de relatórios ([Salesforce Help, Viewer Access](https://help.salesforce.com/s/articleView?id=sf.analytics_folder_viewer.htm&language=en_US&type=5)). Nenhuma fonte de service desk mostra métricas de equipe ao cliente do portal.

| Produto | Chave do administrador | Convidado e externo | Gestor por equipe |
|---|---|---|---|
| ClickUp | limite de uso por plano | só o compartilhado, leitura; sem carga de trabalho | não documentado |
| monday.com | limite de boards por plano | leitor gratuito | pela divisão dos boards |
| Asana | desliga o Reporting no domínio | só o compartilhado | filtro do criador por time |
| Wrike | plano pago | Collaborator e Viewer sem painel | espaço privado por equipe |
| Smartsheet | plano Pro ou acima | externo só lê | não pesquisado |
| Notion | plano Business para dashboards | regra do banco de dados | acesso pela propriedade pessoa |
| Jira | compartilhamento e esquema de permissão | não pesquisado | filtro compartilhado |
| Jira Service Management | sem bloqueio de relatório por pessoa | cliente sem relatório | não documentado |
| Zendesk | Explore por pessoa ou por papel | compartilhamento externo só por editor completo | escopo por grupo, no Enterprise |
| Freshdesk | nível de Analytics no papel | não documentado | escopo de tickets por grupo |
| ServiceNow | regra de acesso, papel e compartilhamento | não pesquisado | elemento do recorte por papel |
| Pipefy | Pro: não mostrar o painel | convidado não vê card | não |
| Kissflow | papéis de relatório no Enterprise | papel externo sem relatório | não |
| HubSpot | Reports access por usuário | não documentado | acesso do time e times aninhados |
| Salesforce | permissões do perfil | guest e portal sem pasta | hierarquia de papéis |

## Visão de gestor por equipe só existe onde o dado sabe quem lidera quem

O recorte "o gestor vê a equipe dele" aparece em 5 produtos, todos com uma estrutura que liga o registro a um time e o time a quem o lidera. No Salesforce, quem tem **View My Team's Dashboards** vê o painel como ele mesmo ou como qualquer pessoa abaixo dele na hierarquia de papéis, e o painel dinâmico mostra os vendedores juntos e um a um ([Salesforce Help, Configure Dashboard Data Visibility](https://help.salesforce.com/s/articleView?id=sf.dashboards_view_as.htm&language=en_US&type=5); [Salesforce Help, Dynamic Dashboards](https://help.salesforce.com/s/articleView?id=sf.dashboards_dynamic_overview.htm&language=en_US&type=5)). No HubSpot, o acesso a registros tem 3 níveis (todos, os do time, só os próprios), e os relatórios seguem o nível; o nível do time exige o Professional, e os times aninhados, o Enterprise ([HubSpot, Assign access to records, 2026-07-14](https://knowledge.hubspot.com/records/assign-access-to-records); [HubSpot, Create and manage teams](https://knowledge.hubspot.com/user-management/create-and-manage-teams)). O Zendesk limita o dado do Explore aos grupos do usuário ou a grupos escolhidos, no Enterprise, e dá ao papel de líder de time o nível Editor por padrão ([Zendesk, Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)). A restrição de painel pelo visualizador, do Zendesk, tem como exemplo documentado o responsável pelo ticket, sem exemplo de grupo ([Zendesk, Dynamically adapting dashboard data based on viewer](https://support.zendesk.com/hc/en-us/articles/5282695803290-Dynamically-adapting-dashboard-data-based-on-viewer)). O ServiceNow restringe por papel quais elementos de um recorte, como um grupo de atendimento, cada papel enxerga ([ServiceNow, Control ability to view breakdown elements, 2025-01-30](https://www.servicenow.com/docs/r/3dUp4IlSpaXzwDcoDj_v6g/vLQlhIzawn9qsDHlSfSEqA)). O Freshdesk limita o painel inicial do agente aos grupos do escopo dele e compartilha relatórios com grupos de agentes ([Freshworks, Advanced ticket scope, 2026-05-15](https://crmsupport.freshworks.com/support/solutions/articles/50000002804-advanced-ticket-scope); [Freshdesk, Report sharing](https://support.freshdesk.com/en/support/solutions/articles/50000004707-report-sharing-in-freshdesk-analytics)).

Nos produtos de gestão de trabalho e de BPM (gestão de processos), o recorte de equipe não existe como permissão. ClickUp, monday.com, Asana, Wrike, Smartsheet e Notion não documentam um gestor que vê só a equipe. O recorte sai da divisão do dado: 1 espaço ou board por equipe, sem acesso aos outros. No ClickUp, a relação de gestor só deixa editar a capacidade da pessoa na carga de trabalho, sem mudar o que cada um vê ([ClickUp, Workload view feature availability](https://help.clickup.com/hc/en-us/articles/30657456679703-Workload-view-feature-availability-and-limits)). No Pipefy e no Kissflow, o dado tem 2 recortes: só os cards ou itens da pessoa, ou o processo inteiro ([Pipefy, Pipe roles and permissions, 2026-08-17](https://help.pipefy.com/en/articles/614597-pipe-roles-and-permissions); [Kissflow, Managing process roles and permissions](https://community.kissflow.com/t/83yzjcs/managing-process-roles-and-permissions)). O gestor recebe o processo inteiro, com as filas das outras equipes.

O ENSPACE está no 2º grupo. Os grupos de membros dizem quem faz parte; nenhum campo diz quem lidera. A documentação diz que grupo não controla permissão (en-docs `1.docs/4.Settings/05.Access/4.Member Groups.md`, "Organize membros em grupos"). Um painel por grupo para o gestor do grupo pede um conceito novo, o responsável pelo grupo, e muda essa regra. É uma decisão do modelo de permissão do workspace, maior que o painel.

## Número por pessoa é monitoramento de trabalhador e pede finalidade declarada

O painel mostra a fila de cada pessoa em barras. Em "Ver tabela", ele mostra 1 linha por pessoa com pendentes, vencidas, concluídas, "No prazo" e "Tempo médio", ordenada pela pessoa com mais vencidas ([parte 5](../../requisitos/parte-5-tarefas-por-responsavel.md), RF212 e RF213). A fila serve para redistribuir trabalho. "No prazo" e "Tempo médio" por pessoa medem desempenho.

As autoridades europeias tratam essa medida como monitoramento. A ICO, autoridade de proteção de dados do Reino Unido, publicou em 2023-10-03 a guia sobre monitoramento de trabalhadores, hoje em revisão por causa do Data (Use and Access) Act; ela vale para qualquer relação de trabalho ([ICO, Monitoring workers](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/monitoring-workers/)). Pelos resumos de escritórios de advocacia, a guia cita ferramentas de produtividade como exemplo de monitoramento e pede que ele seja necessário, proporcional e transparente. Os mesmos resumos dizem que a ICO recomenda avaliação de impacto (DPIA) antes de começar, obrigatória quando o monitoramento pode levar a perda financeira, como na gestão de desempenho ([HFW](https://www.hfw.com/insights/ICO-Publishes-Guidance-on-Monitoring-Workers); [Cooley](https://cdp.cooley.com/new-uk-guidance-on-workplace-monitoring/)). A Opinião 2/2017 do Grupo de Trabalho do Artigo 29, antecessor do Comitê Europeu de Proteção de Dados, pede ao empregador 4 respostas antes de monitorar (necessidade e base legal, justiça, proporcionalidade e transparência) e o método menos intrusivo, também segundo resumos ([A&L Goodbody](https://www.algoodbody.com/insights-publications/article-29-working-party-opinion-on-data-processing-at-work)).

No Brasil, a LGPD dá os princípios, e a ANPD ainda não tem guia sobre trabalho. O Art. 6 pede finalidade específica e informada, necessidade (o mínimo para a finalidade), transparência e segurança contra acesso não autorizado. O Art. 20 dá direito de revisão da decisão automatizada que define o perfil profissional, e o Art. 38 deixa a ANPD exigir relatório de impacto ([Planalto, Lei 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)). Em 2026-07-09, o Conselho Nacional de Proteção de Dados enviou à ANPD **o tratamento de dados nas relações de trabalho como 1 dos 6 temas prioritários da Agenda Regulatória 2027-2028**, com monitoramento e assimetria entre empregador e trabalhador entre os motivos ([gov.br/anpd, CNPD](https://www.gov.br/anpd/pt-br/cnpd/cnpd-encaminha-contribuicoes-prioritarias-para-a-agenda-regulatoria-da-anpd-2027-2028)). Pela leitura desta pesquisa, o cliente do ENSPACE decide a finalidade do tratamento dos dados dos trabalhadores dele, e o ENSPACE decide o padrão: o que o painel mostra por pessoa sem nenhuma configuração.

A inferência por subtração é o outro risco. A política da CMS, que regula os dados do Medicare e do Medicaid nos EUA, proíbe publicar célula com valor de 1 a 10 e qualquer número que permita deduzir esse valor a partir de outros. No exemplo da própria página, o total da coluna menos as outras faixas devolve a faixa suprimida ([ResDAC, CMS Cell Size Suppression Policy, 2024-01-26](https://resdac.org/articles/cms-cell-size-suppression-policy)). O ataque de diferença generaliza o caso: 2 agregados que diferem em 1 pessoa revelam o valor dela, e um limite mínimo por consulta não basta ([Open Exam Prep, CIPT 7.1](https://open-exam-prep.com/study-guides/cipt/use-controls-pets/aggregation-inference-risk)). Num painel de equipes de 3 pessoas, suprimir célula pequena esconde quase tudo e tira o propósito de abrir cada tarefa. A proteção que cabe é outra: **se todo número sai das tarefas que quem olha já abre, nenhuma subtração revela tarefa escondida**. O risco aparece quando o painel mostra um total maior que o escopo de quem olha, como na alternativa C desta proposta ou num aviso "você vê X de Y".

O mercado não esconde a carga dos colegas. No ClickUp, o membro vê a carga de trabalho do lugar, e só o convidado fica fora ([ClickUp, Workload view feature availability](https://help.clickup.com/hc/en-us/articles/30657456679703-Workload-view-feature-availability-and-limits)). No Wrike, todo usuário regular exporta os gráficos de carga que acessa ([Wrike, Exporting Workload Charts](https://help.wrike.com/hc/en-us/articles/4404399235223-Exporting-Workload-Charts)). Nenhum produto documenta esconder do membro o desempenho de um colega. A proposta desta pesquisa para esse ponto não tem precedente no mercado; ela vem dos princípios de necessidade e de menor intrusão.

## Sem permissão e dado parcial: o número vazio sem explicação é a queixa comum

Nos BI, a falta de permissão aparece como painel quebrado. No Power BI, o relatório que usa dado protegido mostra a mesma mensagem de campo apagado, e a própria Microsoft reconhece que o relatório parece quebrado ([Microsoft Learn, RLS with Power BI](https://learn.microsoft.com/en-us/fabric/security/service-admin-row-level-security)). O tile do Looker sem acesso ao modelo fica em branco ou com erro ([Looker docs, Access control](https://docs.cloud.google.com/looker/docs/access-control-and-permission-management)), e o Metabase devolve vazio sem aviso quando o atributo não casa ([Metabase docs, Row and column security](https://www.metabase.com/docs/latest/permissions/row-and-column-security)). No ClickUp, quem recebe o painel sem acesso à origem vê cada cartão em 0 ou sem resultado, e um pedido de melhoria reclama disso ([ClickUp Feedback](https://feedback.clickup.com/feature-requests/p/dashboard-view-only-access-without-access-to-the-underlying-data)). O Harness recebeu o mesmo pedido: o widget sem permissão parece só não carregar ([Harness Ideas](https://ideas.harness.io/feature-request/p/show-lack-or-permissions-or-data-when-user-has-no-access-to-data-in-a-dashboard)).

Alguns produtos explicam o dado parcial. O monday.com marca no painel o acesso que falta e oferece o pedido de acesso ([monday.com, Dashboard permissions](https://support.monday.com/hc/en-us/articles/360015914079-Dashboard-permissions)). O Asana avisa no portfólio compartilhado que há projetos sem acesso ([Asana, Portfolio privacy and sharing](https://help.asana.com/s/article/portfolio-privacy-and-sharing)). O ServiceNow informa quantas linhas saíram por segurança ([ServiceNow, Report permission issues](https://www.servicenow.com/docs/r/now-intelligence/reporting/report-permission-issues.html)), e o Zendesk deixa o usuário conferir o próprio escopo no perfil ([Zendesk, Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)).

O aviso do ServiceNow mostra o limite dessa explicação: dizer quantas linhas saíram entrega o tamanho do que está escondido. Com o filtro por responsável, "você vê 12 de 15" diz que 3 tarefas daquela pessoa estão fora do alcance de quem olha. **O escopo dito em texto explica sem contar**, por exemplo "Tarefas que o seu perfil permite ver".

Para a tela inteira sem permissão, a convenção é esconder o que a pessoa nunca usa e explicar o resto. O artigo de Vitaly Friedman resume a regra: desabilitar, com o motivo e o caminho para liberar, o que a pessoa pode vir a usar, e esconder o que não serve a ela; a lista do que esconder inclui permissões e controles de acesso ([Smashing Magazine, Hidden vs. Disabled In UX, 2024-05-21](https://smashingmagazine.com/2024/05/hidden-vs-disabled-ux/)). O design system da Emarsys usa, para a página restrita, um estado "Permission Denied" com a permissão exigida e um caminho de volta ([Emarsys Design System, Permission handling](https://designsystem.emarsys.net/docs/patterns/permission-handling/)). Jakob Nielsen registra que não há dado empírico definitivo sobre esconder ou desabilitar ([UX Tigers, Inactive buttons](https://www.uxtigers.com/post/inactive-buttons)).

## O ENSPACE já conta pelo visualizador em 3 lugares, e a regra das tarefas tem 5 lacunas

O acesso no ENSPACE tem 2 níveis: a licença dá o acesso base, e o cargo restringe dentro dele, sem nunca ampliar (en-docs `1.docs/4.Settings/05.Access/3.Roles and Permissions.md`, "Defina o que cada membro pode fazer"). O Owner é a única licença que nenhum cargo reduz (en-docs `1.docs/4.Settings/05.Access/2.Members/1.index.md`, "Tipos de licença"). A configuração "Ignorar Permissões para Membros Full", ligada, equipara o Full ao Owner (en-docs `1.docs/4.Settings/03.System/2.Basic Information.md`).

| Licença | Tarefas | Configurações do workspace | Gerenciar membros |
|---|---|---|---|
| Owner | irrestrito | total | sim |
| Full | todas; o cargo pode reduzir | sim | sim |
| Standard | conforme as permissões do cargo | não | não |
| Viewer | somente leitura, conforme o cargo | não | não |

O cargo controla a área Tarefas como acesso e interação com tarefas rápidas e agendadas, sem listar as ações (en-docs `1.docs/4.Settings/05.Access/3.Roles and Permissions.md`, "O que as permissões controlam"). A release 3.2.0, de 2026-10-27, aplicou as permissões de criar, atualizar, excluir e restaurar tarefas e passou a mostrar as Tarefas Rápidas no menu para todos os membros (en-docs `2.blog/docs/release-3-2-0.md`, item 3.4). Nenhuma fonte cita uma ação de ver, ou de ver todas. A mesma página do cargo avisa que **"Atualmente, as permissões não se aplicam a dashboards, relatórios ou integrações de terceiros"**. Um painel novo não herda o controle por cargo sem trabalho no back.

A visibilidade de cada tarefa nasce hoje de 4 fontes:
- **o papel na tarefa:** nas Rápidas, Criador, Responsável, Colaborador e "Usuários com permissão" veem a tarefa, e o Owner tem permissão irrestrita sobre todas (en-docs `1.docs/3.Member/5.Tasks/3.Quick.md`, "Matriz de permissões");
- **o "Limitar acesso" da tarefa de aprovação:** restringe por usuário, grupo ou cargo; em branco, a tarefa fica visível para todos os membros (en-docs `1.docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/3.Actions/Approval-Node.md`);
- **a licença:** a tarefa agendada sem responsável aparece só para Full e Owner (en-docs `1.docs/4.Settings/04.Structure/2.Types/10.Responsibility Rules.md`, "Como funciona");
- **o cargo**, que vale por cima do papel na tarefa (en-docs `1.docs/3.Member/5.Tasks/3.Quick.md`, "Papéis e permissões nas tarefas").

As Tarefas Agendadas abrem filtradas em "Sob responsabilidade", e a documentação não diz o que o Standard vê ao tirar o filtro (en-docs `1.docs/3.Member/5.Tasks/2.Scheduled.md`, "Filtros e visualizações").

O ENSPACE já conta pelo visualizador em 3 lugares. Desde a 3.2.0, o membro com permissão por formulário vê só os itens dos formulários autorizados na tela de itens, **nas contagens** e na busca por referência (en-docs `2.blog/docs/release-3-2-0.md`, item 3.2); a 3.3.0, de 2026-10-29, estendeu a permissão do cargo ao Full no acesso aos itens (en-docs `2.blog/docs/release-3-3-0.md`, item 2.24). Os agentes de IA respeitam as permissões do membro que conversa com eles (en-docs `1.docs/4.Settings/09.AI Agents.md`). Em Comparações, cada responsável vê só as próprias requisições em andamento, e o aprovador vê todas (en-docs `2.blog/docs/release-3-3-0.md`, item 1.3). O caso de Comparações é o desenho que o painel precisa: quem executa vê o que é dele, e um papel acima vê tudo.

O grupo de membros restringe visibilidade em 2 lugares, apesar de a documentação dizer que ele não controla permissão: a seção do menu com "Grupos Permitidos" (en-docs `1.docs/4.Settings/06.Interface/2.Menus.md`, "Configuração de uma seção") e o "Limitar acesso" da tarefa de aprovação. A restrição por "Grupos Permitidos" vale para as telas do menu configurável. Tarefas › Painel é item nativo e fica fora dela, pela leitura desta pesquisa.

O usuário externo não é membro e não tem licença. Ele entra no portal de tarefa externa por link ou por código de 6 dígitos, vê só as tarefas atribuídas a ele e não acessa outros dados do workspace (en-docs `1.docs/3.Member/5.Tasks/6.External Task Portal.md`, "Como funciona"). No painel, ele aparece só como a fila "E-mail externo" ([parte 1](../../requisitos/parte-1-a-tela-do-painel-e-os-filtros.md), RF007).

O protótipo deixou a permissão em aberto. RF016, o estado sem permissão, mostra "Seu perfil não vê o painel de tarefas" a quem não tem a permissão de P002 ([parte 1](../../requisitos/parte-1-a-tela-do-painel-e-os-filtros.md)). O texto da tela diz que o painel mostra as tarefas do workspace inteiro e pede acesso de leitura a Tarefas e a "Tarefas Programadas" ([textos.ts](../../textos.ts), linhas 611 e 612). A documentação não confirma essa ação de leitura e chama essas tarefas de Agendadas. Os outros protótipos escrevem a regra de perfil numa RN com a tabela "Owner ou Full" contra "Standard ou Viewer", e nenhum deles definiu a regra para um número agregado do workspace.

As 5 lacunas que a regra do painel precisa fechar:
- a lista das ações da área Tarefas no editor de cargo;
- o que Standard e Viewer veem nas Agendadas sem o filtro "Sob responsabilidade" e nas Rápidas sem papel na tarefa;
- se a tarefa de um item que o membro não lê aparece para ele;
- se o Full com cargo reduzido vê a tarefa agendada sem responsável;
- o que a permissão por etapa de fluxo controla; ela aparece só na lista do que a migração copia (en-docs `1.docs/4.Settings/06.Interface/4.UseCases.md`, "O que a migração copia").

A documentação também se contradiz num ponto que o painel toca: a ferramenta de IA Criar Cargo diz que cargo não define permissão de acesso, contra a página de cargos (en-docs `1.docs/8.Reference/3.AI Tools/roles/create-role.md`, "Pontos de atenção").

## Proposta para o ENSPACE, para a redatora validar

A proposta tem 3 alternativas. A recomendada vem primeiro.

| | A. Conta o que cada membro vê (recomendada) | B. Só Owner e Full | C. Permissão que mostra tudo |
|---|---|---|---|
| Quem abre | todo membro com a caixa "Ver o painel de tarefas" no cargo | Owner e Full | quem recebe a caixa nova |
| O que conta | as tarefas que o membro abre nas listas | o workspace inteiro | o workspace inteiro |
| O número bate com a lista do clique | sim | sim para o Owner; para o Full com cargo reduzido, só com a regra de A | não |
| Gestor com licença Standard | vê com licença Full ou com "Ver todas as tarefas" | não vê | vê |
| Trabalho no back | aplicar a regra das listas à conta | 1 conta do workspace | 1 conta do workspace e a permissão nova |
| Precedente | ClickUp, monday.com, Wrike, HubSpot, relatórios do Salesforce, os 5 BI; no ENSPACE, contagem de itens, IA e Comparações | relatórios da empresa do Pipefy, Kissflow, relatório novo do ServiceNow | escopo "tudo" do Zendesk, painel estático do Salesforce, Asana, Smartsheet |

### A. Conta o que cada membro vê (recomendada)

- **Quem abre:**
  - todo membro cujo cargo tem a caixa nova "Ver o painel de tarefas", na área Tarefas;
  - a caixa nasce ligada em todo cargo, porque o painel só mostra tarefa que a lista já mostra (pergunta 6);
  - o Owner abre sempre, como em toda área;
  - sem a caixa, o item Painel sai do menu, como o Spaceflow sai para quem não vê fluxos desde a 3.2.0 (en-docs `2.blog/docs/release-3-2-0.md`, item 3.5);
  - o endereço direto mostra o estado sem permissão (RF016), com o nome da permissão e quem procurar.
- **O que cada número conta:**
  - as tarefas que o membro abre em Tarefas › Rápidas e em Tarefas › Agendadas, pela mesma regra: papel na tarefa, "Limitar acesso", licença e cargo;
  - Owner e Full contam o workspace inteiro, menos o que o cargo do Full tira;
  - Standard e Viewer contam o que as listas deles mostram; a fila "Sem responsável" das Agendadas, por exemplo, aparece só para Owner e Full, como na lista;
  - o servidor calcula cada número no pedido, com o escopo de quem pede; um número calculado de antemão para o workspace serve só a quem conta todas as tarefas.
- **Visão de gestor:**
  - no MVP, quem acompanha a equipe inteira usa a licença Full, com o cargo tirando o que ele não usa em Configurações;
  - se o gestor de operação costuma ter licença Standard, a área Tarefas ganha "Ver todas as tarefas", que vale para as listas e para o painel juntos (pergunta 7);
  - o gestor por grupo fica fora do MVP, porque pede o conceito de responsável pelo grupo (pergunta 7).
- **Números por pessoa:**
  - a fila de cada pessoa (pendentes, em andamento, vencidas e concluídas) segue a regra de linha;
  - "No prazo" e "Tempo médio" na linha de um colega aparecem só para quem conta o workspace inteiro; Standard e Viewer veem esses 2 números na própria linha e nas filas de grupo (pergunta 8);
  - "Como calculamos" diz que o painel mostra números por pessoa e quem os vê.
- **Convidado e externo:** não abrem o painel; a tarefa deles conta na fila "E-mail externo" para quem vê a tarefa.
- **Por que é a recomendada:**
  - cada número abre a lista por trás dele, e só a conta pelo visualizador faz o número bater com a lista sem mostrar tarefa que a pessoa não abre;
  - nenhum número inclui tarefa escondida, então a subtração entre 2 números não revela nada;
  - é a regra de 9 dos 15 produtos e dos 5 BI, e a que a OWASP e o NIST pedem;
  - o ENSPACE já conta assim os itens desde a 3.2.0, e os agentes de IA respeitam a permissão de quem conversa;
  - a regra de linha já existe nas listas; o trabalho é escrevê-la e aplicá-la à conta.
- **Custo e risco:**
  - contar por visualizador custa mais ao servidor que 1 conta do workspace; o Salesforce limita os painéis dinâmicos;
  - a regra das listas tem 5 lacunas na documentação (perguntas 1 a 5);
  - a nota do en-docs de que as permissões não se aplicam a dashboards muda com o lançamento do painel.

### B. Só Owner e Full, o workspace inteiro

- **O que muda:** P002 fecha com "Owner e Full"; Standard e Viewer veem o estado sem permissão.
- **A favor:**
  - é a regra mais simples de escrever e de testar;
  - segue o par "Owner ou Full" que os outros protótipos usam para o que vale para todos;
  - tem precedente nos relatórios da empresa do Pipefy, que abrem só para o administrador da empresa ([Pipefy, What are company reports, 2024-01-09](https://help.pipefy.com/en/articles/1698930-company-reports)), e no Kissflow, onde só os papéis de administrador veem todos os relatórios ([Kissflow, Managing process members and permissions](https://community.kissflow.com/t/p8h9qtp/managing-process-members-and-permissions)).
- **Contra:**
  - o gestor com licença Standard fica sem painel;
  - o Full com cargo que reduz Tarefas conta tarefa que não abre, a menos que o painel aplique a regra de A;
  - os painéis fixos do mercado abrem para quem trabalha o processo.
- **Quando serve:** como 1º passo de A, se a regra das listas não fica pronta a tempo do MVP.

### C. Permissão nova que mostra o workspace inteiro

- **O que muda:** a caixa "Ver o painel de tarefas" dá a quem a recebe os números do workspace inteiro, sem regra de linha.
- **A favor:**
  - o gestor com licença Standard vê a equipe sem mudar a licença;
  - 1 conta do workspace custa menos ao servidor.
- **Contra:**
  - o número deixa de bater com a lista: o clique mostra tarefa que a pessoa não abre, ou mostra menos linhas que o número;
  - a tarefa de aprovação com "Limitar acesso" para 1 grupo entra nas barras de quem está fora do grupo;
  - o total menos o que a lista mostra revela quantas tarefas estão escondidas, por pessoa e por grupo;
  - contraria a contagem de itens da 3.2.0, que já respeita a permissão de formulário.

### O que muda no protótipo e nos requisitos, se A for aprovada

- P002, a pergunta sobre a permissão que abre o painel: fecha com A.
- Nova RN de perfis, no formato dos outros protótipos:

  | | Owner | Full | Standard | Viewer |
  |---|---|---|---|---|
  | Abre o painel | sempre | com "Ver o painel de tarefas" | com "Ver o painel de tarefas" | com "Ver o painel de tarefas" |
  | Tarefas que os números contam | todas | todas, menos o que o cargo tira | as que as listas mostram a ele | as que as listas mostram a ele |
  | "No prazo" e "Tempo médio" de um colega | sim | sim, quando conta todas | não | não |
  | Liga e desliga a caixa num cargo | sim | com a permissão de editar cargos | não | não |

- RF016, o estado sem permissão: texto novo, sem "o workspace inteiro" e sem "Tarefas Programadas".
- RF014, o workspace sem tarefa: 2 textos, conforme quem olha conta todas as tarefas ou parte delas.
- RN651, o arranjo de cada membro: a frase "o conteúdo de cada painel é igual para cada membro" passa a valer para o catálogo e o cálculo; os números seguem o que cada membro vê.
- RS001, a conta no servidor: ganha "com o escopo de quem pede".
- Cabeçalho do painel: 1 linha com o escopo.
- "Como calculamos": 1 parágrafo sobre o escopo e os números por pessoa.
- Parte 13, exportar: o CSV leva só as linhas que a lista mostra.
- Todo texto novo entra em PT, EN e ES, pela regra 35 da spec de protótipos.

Textos propostos, em PT:

| Onde | Texto |
|---|---|
| Cabeçalho, para quem conta todas | "Todas as tarefas do workspace." |
| Cabeçalho, para quem conta parte | "Tarefas que o seu perfil permite ver." |
| RF016 | "Seu perfil não tem acesso ao painel de tarefas. Para ver o painel, peça a permissão Ver o painel de tarefas a quem administra o workspace." |
| RF014, para quem conta parte | "Ainda não há tarefas que o seu perfil permite ver." |
| "Como calculamos" | "Cada número conta as tarefas que você vê em Tarefas › Agendadas e em Tarefas › Rápidas." |

### Perguntas que o produto precisa responder

| Nº | Pergunta | O que muda conforme a resposta |
|---|---|---|
| 1 | A área Tarefas do cargo tem hoje uma ação de ver, ou de ver todas, além de criar, atualizar, excluir e restaurar? | Com a ação, A a usa; sem ela, "Ver todas as tarefas" é permissão nova |
| 2 | Quais tarefas o Standard e o Viewer veem nas Agendadas sem o filtro "Sob responsabilidade" e nas Rápidas sem papel e sem "Limitar acesso"? | A resposta é a regra de linha do painel |
| 3 | A tarefa ligada a um item que o membro não lê aparece na lista dele? | Define se essa tarefa conta no painel |
| 4 | O Full com cargo que reduz Tarefas vê a tarefa agendada sem responsável e a tarefa com "Limitar acesso" que não o inclui? | Define se o Full conta sempre o workspace inteiro |
| 5 | A permissão por etapa de fluxo restringe a tarefa da etapa? | Com restrição, ela entra na regra de linha |
| 6 | "Ver o painel de tarefas" nasce ligada nos cargos que já existem? | Ligada, o painel aparece para todos no lançamento; desligada, só para o Owner até o administrador ligar |
| 7 | O gestor de operação costuma ter licença Standard? O produto quer o responsável pelo grupo? | Define se "Ver todas as tarefas" entra no MVP e se o gestor por grupo entra no roteiro |
| 8 | "No prazo" e "Tempo médio" de um colega aparecem para Standard e Viewer? O cliente ganha uma chave para esconder os números por pessoa? O grupo de 1 membro segue a regra de pessoa? | Define a regra dos números por pessoa |
| 9 | A exportação em CSV da parte 13 pede permissão própria? | Define se a parte 13 ganha caixa no cargo |

## Conclusão

A pergunta P002 fala da tela, mas a decisão que define o painel é a regra de linha, porque cada número do ENSPACE abre a lista por trás dele. Com a conta pelo visualizador, a caixa de tela vira um ajuste de baixo risco, e o trabalho real passa a ser escrever a regra de visibilidade que as listas de Rápidas e de Agendadas já aplicam sem documentação. Esse texto serve também às listas e aos agentes de IA, que dependem da mesma regra.

O painel também antecipa 2 decisões que o ENSPACE ainda não tomou. A 1ª é o que é um gestor: o mercado só entrega a visão por equipe quando o modelo de dado sabe quem lidera quem, e os grupos do ENSPACE sabem só quem faz parte. A 2ª é o que o produto mostra por pessoa sem configuração: o tema entrou na lista de prioridades enviada à ANPD para 2027-2028, e o padrão que o painel fixa agora é o ponto de partida dos clientes quando a ANPD tratar do assunto.

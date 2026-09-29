# Pesquisa de referências: menu da documentação

Esta rodada não tem print porque as ferramentas usadas (busca e leitura de página) não gravam imagem em disco. Levantamento feito em 2026-09-29.

Referências: os 5 obrigatórios, mais 3 escolhidos.
- **Airtable:** mesmo domínio do ENSPACE (bases, campos, formulários, automações) e uma página por tipo de campo.
- **Linear:** o único precedente de doc com seção nomeada pelo menu lateral do app, que é a ideia da proposta B.
- **HubSpot:** produto grande que usa os nomes do menu do app na doc.

## Notion

- **URLs vistas:** [notion.com/help](https://www.notion.com/help), [category/databases](https://www.notion.com/help/category/databases), [intro-to-databases](https://www.notion.com/help/intro-to-databases), [database-properties](https://www.notion.com/help/database-properties).
- **Primeiro nível:** organizado por objetivo do usuário, com verbo. Abaixo de cada grupo ficam categorias com nomes do produto. São 14 grupos: Get started, Workspace basics, Create & format pages, Build databases, Share & collaborate, Automation & connections, Work with Notion AI, Agents in Notion, Admin & security, Calendar & Apps, Get started on marketplace, Manage your plan, Fix a problem, Developer Platform.
- **Profundidade:** 2 cliques. A pessoa clica na categoria "Databases" na barra e depois no artigo "Database properties" na página da categoria.
- **Barra:** mostra 2 níveis (grupo e categoria), todos visíveis. Os artigos não aparecem na barra. A categoria da página atual fica marcada.
- **Breadcrumb e relacionados:** breadcrumb curto (Help Center > Databases). No fim do artigo, "Up next" indica 1 artigo seguinte. O corpo liga para outros artigos, e há um índice "Contents" no topo.
- **Rótulos:** o grupo usa um verbo que não existe na interface ("Build databases"). A categoria usa o nome do produto ("Databases", "Automations", "Notion Calendar").
- **Tipos de campo:** 1 artigo cobre os 24 tipos de propriedade numa tabela.
- **Serve:** o objetivo fica no primeiro nível e o nome do produto no segundo. Ajuda e referência técnica ficam no fim ("Fix a problem", "Developer Platform").
- **Não serve:** a barra não lista os artigos. Quem está numa página de tipo de campo não vê os outros tipos sem voltar à categoria. No ENSPACE, com uma página por tipo, isso obriga a voltar a cada troca.

## Twenty CRM

- **URLs vistas:** [twenty.com/user-guide](https://twenty.com/user-guide) redireciona (308) para [docs.twenty.com/user-guide/introduction](https://docs.twenty.com/user-guide/introduction). Índice completo: [\_llms/en/user-guide.md](https://docs.twenty.com/_llms/en/user-guide.md). Página de campos: [fields](https://docs.twenty.com/user-guide/data-model/capabilities/fields). Configuração do menu no repositório: [packages/twenty-docs/docs.json](https://github.com/twentyhq/twenty/blob/main/packages/twenty-docs/docs.json). Regras do Mintlify (a plataforma de documentação que o Twenty usa): [organize/navigation](https://www.mintlify.com/docs/organize/navigation).
- **Primeiro nível:** organizado por público e etapa, em 3 abas: Getting Started, User Guide e Developers. Dentro de User Guide, a organização é por funcionalidade, em 12 grupos: Data Model, Data Migration, Calendar & Emails, Email Campaigns, Workflows, AI, Layout, Dashboards, Permissions & Access, Billing, Settings, Legal.
- **Profundidade:** 2 a 3 cliques. A pessoa escolhe a aba User Guide, abre "Reference" sob Data Model e clica em Fields. O caminho mais fundo tem 4 níveis: Workflows > How-Tos > CRM Automations > página.
- **Barra:** o grupo de topo é título fixo com ícone; pela regra do Mintlify, grupo de topo não recolhe. Os subgrupos "Reference" e "How-Tos" recolhem. A documentação do Mintlify não diz se a barra abre sozinha no ramo atual; não conferido.
- **Breadcrumb e relacionados:** o docs.json liga o breadcrumb acima do título (opção "eyebrows: breadcrumbs"). A página Fields não tem bloco de relacionados. O texto dá o caminho no app: Settings, Data Model, objeto, "+ New Field".
- **Rótulos:** parte dos grupos repete o app (Data Model, Workflows, Dashboards, Settings, Billing). "Layout" é agrupamento da doc: junta barra lateral, visualizações e página do registro.
- **Tipos de campo:** 1 página (Fields) com tabela de 18 tipos.
- **Serve:** a doc separa o guia do usuário da referência para desenvolvedor em abas. Cada funcionalidade tem as mesmas 2 pastas: Reference (o que é) e How-Tos (como fazer). O topo fica fixo e a pasta só aparece do segundo nível para baixo. A configuração é aberta e serve de modelo.
- **Não serve:** "Layout" junta 3 lugares diferentes do app sob um nome que a pessoa não vê na tela. A tabela única de tipos não comporta a configuração de cada tipo de campo do ENSPACE.

## ClickUp

- **URLs vistas:** [help.clickup.com/hc/en-us](https://help.clickup.com/hc/en-us) devolveu HTTP 403 à leitura automática. A estrutura vem da API pública do Zendesk (a plataforma da central de ajuda): [categories.json](https://help.clickup.com/api/v2/help_center/en-us/categories.json) e [sections.json](https://help.clickup.com/api/v2/help_center/en-us/sections.json). Artigo de exemplo: [Custom Field types](https://help.clickup.com/hc/en-us/articles/6303499162647-Custom-Field-types).
- **Primeiro nível:** misto. São 9 categorias com nomes do produto: Get started, ClickUp Agents, ClickUp Brain AI, Features and ClickApps, Chat, Integrations, API, and MCP, Mobile, Technical Support, Data, privacy, and security. A home descreve cada categoria por objetivo ("Browse articles by feature", "Take your work anywhere").
- **Profundidade:** 4 cliques até "Custom Field types": Features and ClickApps > Custom Fields > Intro to Custom Fields > artigo. A estrutura é categoria > seção > subseção > artigo, com 155 seções no total.
- **Barra, breadcrumb e relacionados:** não conferidos (HTTP 403). O corpo de "Custom Field types" liga para 5 ou mais artigos do mesmo tema.
- **Rótulos:** as seções usam os nomes do produto: cada ClickApp (Priority, Tags, Sprints, Time tracking) e cada visualização (List view, Board view, Gantt view). Em Get started, "Use cases" agrupa por Role, Feature e Industry.
- **Serve:** um assunto grande ganha subseções (Custom Fields vira Intro, Create, Manage e Formula Fields). Os casos de uso por papel ficam separados da referência por recurso.
- **Não serve:** 4 níveis e cerca de 40 seções soltas em "Features and ClickApps". O rótulo "ClickApps" exige conhecer o jargão do produto.

## Monday

- **URLs vistas:** [support.monday.com/hc/en-us](https://support.monday.com/hc/en-us) devolveu HTTP 403. A estrutura vem da API pública do Zendesk: [categories.json](https://support.monday.com/api/v2/help_center/en-us/categories.json), [sections.json](https://support.monday.com/api/v2/help_center/en-us/sections.json) e os artigos da seção [Board elements](https://support.monday.com/hc/en-us/sections/12052553955474-Board-elements). Artigo de exemplo: [The Status Column](https://support.monday.com/hc/en-us/articles/360001269685-The-Status-Column).
- **Primeiro nível:** misto. Primeiro vêm os temas e tarefas, depois as linhas de produto. São 12 categorias: Getting started, Reporting, Connect & automate, Profile & administration, Plans & billing, Data, infra & security, monday work management, monday CRM, monday dev, monday service, Workforms, Workcanvas.
- **Profundidade:** 3 cliques até um tipo de coluna (Getting started > Board elements > The Status Column). A seção Board elements tem 54 artigos.
- **Barra, breadcrumb e relacionados:** não conferidos (HTTP 403). O corpo de "The Status Column" liga para outros artigos, e o artigo tem a etiqueta "column".
- **Rótulos:** seções com nomes do produto (Board views, Dashboards, Widgets, Automations, Integrations, Workdocs) e seções de início escritas como tarefa (Create your first board, Connect your boards).
- **Tipos de campo:** 1 artigo por tipo de coluna, mais o índice "Available column types on monday.com".
- **Serve:** o modelo de 1 página por tipo com uma página-índice é o mesmo do ENSPACE. A seção de início usa rótulo de tarefa.
- **Não serve:** 54 artigos numa seção só. "Board views" fica sob "Reporting", longe do quadro onde a pessoa usa a visualização.

## Pipefy

- **URLs vistas:** [help.pipefy.com/pt-BR](https://help.pipefy.com/pt-BR/), [Funcionalidades | Usuários Admin](https://help.pipefy.com/pt-BR/collections/3751824-funcionalidades-usuarios-admin), [Comece Aqui](https://help.pipefy.com/pt-BR/collections/47910-comece-aqui), [Tipos de campos](https://help.pipefy.com/pt-BR/articles/625205-tipos-de-campos), [Como criar automações](https://help.pipefy.com/pt-BR/articles/686823-como-criar-automacoes).
- **Primeiro nível:** misto, com público explícito. São 11 coleções: Comece Aqui, Configurações Gerais, Funcionalidades | Usuários Admin, Convidados & Solicitantes, Pipefy AI, APIs, Segurança e Gestão de TI, Planos, Cobrança e Pagamento, Android e iOS App, Pipefy Para Seu Negócio, Integrações, FAQ.
- **Profundidade:** 4 cliques até "Tipos de campos": Funcionalidades | Usuários Admin > Sobre Pipes > Campos & Fases > Tipos de campos.
- **Barra:** o artigo não tem barra lateral. A navegação passa pelo breadcrumb e pelas páginas de coleção.
- **Breadcrumb e relacionados:** breadcrumb completo, com 5 itens. O bloco "Conteúdos relacionados" no fim traz 2 links, tanto em "Tipos de campos" quanto em "Como criar automações".
- **Rótulos:** as sub-coleções usam os nomes do produto em português: Pipe, Formulários, Campos & Fases, Cards, Etiquetas, Portais, Database, Automações, Painéis, Relatórios, Interfaces.
- **Tipos de campo:** 1 artigo cobre os 21 tipos.
- **Serve:** a doc separa admin de convidado e solicitante, o mesmo corte de Configurações e Membro no ENSPACE. O artigo termina com relacionados. É um produto de processos em português, com vocabulário próximo ao do ENSPACE.
- **Não serve:** 4 cliques até o artigo, com breadcrumb de 5 itens. Automações aparece em 2 coleções (Comece Aqui > Definições Gerais e Funcionalidades | Usuários Admin > Automações), e o leitor não sabe qual é a principal.

## Airtable

- **URLs vistas:** [support.airtable.com](https://support.airtable.com/), [Airtable Fields](https://support.airtable.com/collections/6863767017-airtable-fields), [Date field type](https://support.airtable.com/articles/1819632575-date-field-type).
- **Primeiro nível:** organizado por objeto do produto. Depois de "Getting started with Airtable", as coleções seguem em ordem alfabética. São 18 coleções: Getting started with Airtable, Airtable AI, Airtable Automations, Airtable Bases, Airtable Betas, Collaborating in Airtable, Airtable Enterprise Support, Airtable Extensions, Airtable Fields, Integrating with Airtable, Airtable Interface Designer, Learning and Resources, Managing Airtable, Airtable Policy, Airtable Records, Airtable Sync, Airtable Views, Airtable Workspaces.
- **Profundidade:** 3 cliques até um tipo de campo (Airtable Fields > Date-based fields > Date field type).
- **Barra:** o artigo não tem barra lateral. O breadcrumb tem 4 itens (All Collections > Airtable Fields > Date-based fields > Date field type). O artigo abre com um índice de seções.
- **Relacionados:** o bloco no fim lista os tipos da mesma família (Created time and Created by, Duration, Last modified time, Date dependencies).
- **Rótulos:** a doc usa os nomes do produto (Bases, Fields, Records, Views, Interface Designer, Automations) e nomeia os controles da tela ("Include time", "Date format").
- **Tipos de campo:** 10 sub-coleções agrupam os tipos por família (Date-based fields, Select and user fields, Number-Based Fields, Rollup, lookup, and count fields), mais o artigo "Field type overview".
- **Serve:** agrupar os tipos por família reduz a lista que a pessoa percorre; o artigo de visão geral dá o índice; os relacionados levam aos tipos irmãos. É o que falta para encurtar os 9 cliques até a página de tipo de campo do ENSPACE.
- **Não serve:** a ordem alfabética não segue nem o uso nem o menu do app. 13 dos 18 rótulos começam com "Airtable", o que atrasa a leitura rápida.

## Linear

- **URLs vistas:** [linear.app/docs](https://linear.app/docs), índice [linear.app/llms.txt](https://linear.app/llms.txt), [Inbox](https://linear.app/docs/inbox).
- **Primeiro nível:** organizado por objeto e por lugar do produto. São 18 títulos: Getting started, Account, Administration, AI, Code, Your sidebar, Teams, Issues, Issue properties, Projects, Initiatives, Cycles, Views, Find and filter, Linear Asks, Integrations, Analytics, Importers. "Your sidebar" traz os itens do menu lateral do app: Inbox, My issues, Pulse, Reviews, Favorites.
- **Profundidade:** 1 clique, do título fixo direto à página.
- **Barra:** os títulos são fixos e mostram as páginas embaixo. A leitura da página não mostra pasta que recolhe. O ramo atual já está sempre aberto.
- **Breadcrumb e relacionados:** não há breadcrumb na página Inbox nem bloco de relacionados. O corpo cita caminhos do app (Inbox settings > Priority filter; Account > Notifications).
- **Rótulos:** iguais aos do app: Inbox, My issues, Favorites, Cycles, Initiatives.
- **Tipos de campo:** "Issue properties" tem 1 página por propriedade (Due dates, Estimates, Priority, Issue labels, SLAs), a 1 clique.
- **Serve:** é o precedente de seção nomeada pelo lugar do produto, a ideia central da proposta B. A barra rasa (1 clique) mostra que títulos fixos funcionam quando cada título tem poucas páginas.
- **Não serve:** o público é técnico e já conhece o app. Não há breadcrumb. A doc não copia o menu 1:1: mistura seções que não estão no menu lateral (Getting started, Find and filter, Importers).

## HubSpot Knowledge Base

- **URLs vistas:** [knowledge.hubspot.com](https://knowledge.hubspot.com/), [CRM](https://knowledge.hubspot.com/crm), [property-field-types-in-hubspot](https://knowledge.hubspot.com/properties/property-field-types-in-hubspot), menu do app: [guia de navegação do HubSpot](https://knowledge.hubspot.com/help-and-resources/a-guide-to-hubspots-navigation).
- **Primeiro nível:** organizado pelo menu do produto, com extras, em ordem alfabética. São 13 categorias: Account & Setup, AI, Automation, Content, CRM, Data, Get Started, Marketing, Partners, Reporting & Data, Revenue, Sales, Service.
- **Profundidade:** 3 cliques (CRM > Properties > artigo de tipos de propriedade).
- **Barra:** as seções expandem. Na página de CRM, a seção CRM abre sozinha e mostra 12 subcategorias.
- **Breadcrumb e relacionados:** breadcrumb com 4 itens (Knowledge Base > CRM > Properties > artigo). O topo do artigo avisa qual assinatura cada recurso exige. Bloco de relacionados: não confirmado.
- **Rótulos:** categorias repetem itens do menu do app (CRM, Marketing, Content, Automation, Reporting & Data); subcategorias repetem as ferramentas (Properties, Records, Tasks, Inbox, Snippets).
- **Tipos de campo:** 1 artigo cobre todos os tipos de propriedade.
- **Serve:** a doc usa os nomes do menu do app na 1ª e na 2ª camada sem copiar a ordem. A barra abre o ramo atual. O artigo avisa o plano exigido por recurso.
- **Não serve:** a ordem alfabética põe "Get Started" em 7º lugar. Categorias sem item no menu do app (Get Started, Partners, Revenue) ficam misturadas às do app, sem marca de diferença.

## O padrão que todos seguem

- **"Começar" no topo:** 7 de 8 abrem com Getting started ou Comece Aqui. A exceção é a HubSpot, que ordena em ordem alfabética.
- **Nome da página igual ao nome da coisa no produto:** os 8 usam o nome da tela ou do objeto no rótulo da página (Databases, Board views, Campos & Fases, Custom Fields, Issue properties, Properties). O Notion agrupa por verbo no topo, mas usa o nome do produto no segundo nível.
- **De 1 a 4 cliques até o artigo:** nenhum chega a 5. Até o tipo de campo: Linear 1, Notion 2, Twenty 2 a 3, Monday 3, Airtable 3, HubSpot 3, ClickUp 4, Pipefy 4.
- **Breadcrumb:** aparece em 5 dos 6 conferidos (Notion, Twenty, Pipefy, Airtable, HubSpot). O Linear não tem. ClickUp e Monday ficaram sem conferência.
- **Página que lista todos os tipos de campo:** 7 de 8 têm. Uns põem todos os tipos numa página só (Notion, Twenty, ClickUp, Pipefy, HubSpot). Outros usam índice e 1 página por tipo (Monday, Airtable).
- **API, cobrança e suporte embaixo ou em área própria:** 5 de 8 (Notion, Twenty, ClickUp, Pipefy, Linear).
- **Topo fixo:** entre os 4 com barra lateral conferida, 3 deixam o topo fixo (Notion, Twenty, Linear). Só a HubSpot recolhe o topo.

## O que nenhum deles faz

- **Nenhum copia o menu do app item a item, na mesma ordem e com os mesmos ícones.** O Linear chega mais perto com "Your sidebar", mas acrescenta seções fora do menu e muda a ordem.
- **Nenhum oferece um mapa do menu do app** com link de cada item para o artigo. É a chance de o ENSPACE usar o espelho de B também como página de índice.
- **Nos artigos vistos, nenhum tem um campo fixo "onde fica no produto" no topo.** O caminho do menu aparece solto no texto (Twenty, Linear, Airtable) ou não aparece (HubSpot).
- **Nos blocos de relacionados vistos (Pipefy, Airtable, "Up next" do Notion), o link leva a artigo do mesmo tema.** Nenhum liga o mesmo recurso visto em outra tela, como o campo no formulário e o mesmo campo na tabela de itens. É o que a linha "Este assunto também aparece em" das 2 propostas faz.

## O que isso diz sobre A e B

- **A segue a convenção** no primeiro nível, com "Comece aqui" primeiro e a referência técnica por último, e no breadcrumb. A barra que abre no ramo atual tem precedente na HubSpot.
- **A diverge num ponto:** as pastas recolhíveis no topo. 3 dos 4 com barra deixam o topo fixo.
- **B segue a convenção** nos rótulos (nome do produto) e nos títulos fixos dos sites de documentação (Linear, Twenty).
- **B diverge** ao copiar ordem, itens e ícones do app. Nenhum dos 8 faz isso; o único precedente parcial é o Linear, cujo público é técnico. Para divergir, o ENSPACE precisa de motivo, como um dado de que o usuário leigo procura a doc pelo nome da tela.
- **As 2 propostas precisam cortar a profundidade.** As referências chegam ao artigo em 1 a 4 cliques; o ENSPACE hoje pede até 9.
- **As referências sustentam uma combinação:** a ordem de A no primeiro nível; os rótulos do app no segundo nível; o espelho do menu como seção ou página de índice (modelo "Your sidebar" do Linear); os tipos de campo agrupados por família, com uma página de visão geral (modelo Airtable e Monday).

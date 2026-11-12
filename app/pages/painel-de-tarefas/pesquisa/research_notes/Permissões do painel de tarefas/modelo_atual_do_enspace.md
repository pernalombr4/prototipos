# Modelo atual de permissões do ENSPACE (quem vê o quê), para o painel de Tarefas

Fontes lidas em 2026-11-11, só leitura, na cópia local da documentação oficial (PT). Abreviações dos caminhos:
`docs/` = `en-docs/content/pt/1.docs/`;
`blog/` = `en-docs/content/pt/2.blog/docs/` (notas de versão);
`proto/` = `enspace-prototipos/app/pages/`.
Cada fato traz o arquivo e o título da seção. O que a doc não diz está em "Gaps".

## 1. Licenças, cargos e granularidade da permissão

### Takeaway
O acesso tem 2 camadas: a licença (Owner, Full, Standard, Viewer) dá o teto, e o cargo, editável em Configurações > Gestão de Membros > Cargos, restringe dentro dele. O CRUD documentado é o de categoria, formulário e campo; Tarefas, Spaceflows, Agenda, IA e Configurações aparecem como áreas do cargo, sem a lista das ações de cada uma.

### Cited Findings
- 4 tipos de licença: Owner, Full, Standard e Viewer. A tabela da doc: Itens = Irrestrito / Todos / Conforme permissões / Somente leitura; Tarefas = Irrestrito / Todas / Conforme permissões / Somente leitura; Configurações do workspace = Total / Sim / Não / Não; Gerenciar membros = Sim / Sim / Não / Não. — [docs/4.Settings/05.Access/2.Members/1.index.md, "Tipos de licença"](<docs/4.Settings/05.Access/2.Members/1.index.md>)
- Owner: acesso irrestrito, único tipo que nenhum cargo reduz; todo workspace tem ao menos 1 (o criador); co-owner e transferência só pelo suporte. — mesma seção.
- Full: acesso amplo, com configurações; com todas as permissões do cargo se equipara ao Owner, mas o cargo pode reduzir. Standard: dia a dia (dados, tarefas, formulários), sem configurações e sem gerenciar membros; com todas as permissões se equipara ao Full, fora as configurações. Viewer: "acesso 100% somente leitura", vê dados e tarefas conforme o cargo e pode ser ainda mais restrito (só algumas categorias). — mesma seção.
- Rótulos na tela: a coluna Tipo mostra "Proprietário, Full, Standard ou Visualizador"; o modal Detalhes do Membro troca a licença entre "Full, Standard, Visualizador" e a mudança vale na hora. — [mesmo arquivo, "A tela de Gestão de Membros" e "Alterar tipo de licença ou cargo"](<docs/4.Settings/05.Access/2.Members/1.index.md>)
- "O tipo de licença (Owner, Full, Standard, Viewer) determina o acesso base, enquanto o cargo refina esse acesso"; "O cargo nunca amplia o acesso além do permitido pela licença, mas pode restringi-lo ainda mais." — [docs/4.Settings/05.Access/3.Roles and Permissions.md, "Defina o que cada membro pode fazer"](<docs/4.Settings/05.Access/3.Roles and Permissions.md>)
- Exemplo da doc: um Standard com cargo de "acesso total a itens" vê todos os itens, mas não entra nas configurações; o workspace aceita quantos cargos forem necessários. — [docs/1.Getting Started/2.Concepts.md, "Cargo"](<docs/1.Getting Started/2.Concepts.md>)
- Áreas que o cargo controla: Categorias e itens (CRUD por categoria, formulário e campo); Tarefas ("acesso e interação com tarefas rápidas e agendadas"); Spaceflows ("visualização e acompanhamento de execuções"); Agenda; IA; Configurações (membros, cargos, grupos, menus, telas, casos de uso, listas, integrações, e-mails, logs e credenciais). — [Roles and Permissions.md, "O que as permissões controlam"](<docs/4.Settings/05.Access/3.Roles and Permissions.md>)
- "Atualmente, as permissões não se aplicam a dashboards, relatórios ou integrações de terceiros. Essa expansão está nos planos futuros da plataforma." — mesma seção, nota.
- CRUD (Criar, Ler, Atualizar, Excluir) só está descrito "para categorias e itens", em 3 níveis: por categoria, por formulário e por campo. — [Roles and Permissions.md, "Permissões por categoria, formulário e campo"](<docs/4.Settings/05.Access/3.Roles and Permissions.md>)
- A tela do cargo mostra o contador "Permissões Ativas" e abas; a doc nomeia 2: **Dados** (categorias, formulários e campos) e **Inválidas** (permissões obsoletas ou de objeto que você não acessa). — [Roles and Permissions.md, "Permissões inválidas"](<docs/4.Settings/05.Access/3.Roles and Permissions.md>)
- Passos do editor: Configurações > Gestão de Membros > aba Cargos; criar ou editar; "Para cada área do workspace, defina o que o cargo pode fazer"; salvar vale na hora para todos com o cargo. — [Roles and Permissions.md, "Como configurar um cargo"](<docs/4.Settings/05.Access/3.Roles and Permissions.md>)
- A migração de workspace leva "as permissões de categoria, campo, formulário, etapa de fluxo e visualização": há permissão por etapa de fluxo e por visualização, que nenhuma outra página descreve. — [docs/4.Settings/06.Interface/4.UseCases.md, "O que a migração copia"](<docs/4.Settings/06.Interface/4.UseCases.md>)
- Release 3.2.0 (2026-10-27), correção 3.4: a correção "aplica as permissões de criar, atualizar, excluir e restaurar tarefas e exibe as Tarefas Rápidas no menu para todos os membros". — [blog/release-3-2-0.md, "3.4 Tarefas: Exclusão sem permissão era confirmada..."](<blog/release-3-2-0.md>)
- Release 3.2.0, correção 3.5: o Spaceflow aparece no menu só para quem tem "a permissão de ver os fluxos". Correção 3.3: Comparações têm permissão de ver e de excluir, conferida também na API. — [blog/release-3-2-0.md, itens 3.3 e 3.5](<blog/release-3-2-0.md>)
- Só Owner e Full (com permissão) abrem a Gestão de Membros. — [docs/4.Settings/05.Access/1.index.md, "Controle quem acessa o workspace"](<docs/4.Settings/05.Access/1.index.md>)
- "Membros com licença Standard e Viewer podem visualizar apenas a Visão Geral. As demais configurações exigem permissões específicas." — [docs/4.Settings/01.index.md, nota final](<docs/4.Settings/01.index.md>). Na Visão Geral, as ações rápidas ficam desabilitadas para Standard e Viewer. — [docs/4.Settings/02.Overview.md, "Ações Rápidas"](<docs/4.Settings/02.Overview.md>)
- Configuração do workspace "Ignorar Permissões para Membros Full": ligada, o Full ignora as regras do cargo e se equipara ao Owner. — [docs/4.Settings/03.System/2.Basic Information.md](<docs/4.Settings/03.System/2.Basic Information.md>)
- Categoria e formulário novos nascem "sem permissões liberadas" (mínimo acesso); o Owner tem acesso automático; o modal Ver, Criar, Atualizar e Excluir só abre para quem pode configurar permissão ("ser membro Full, ter cargo atribuído ou possuir permissão para editar cargos"). — [docs/4.Settings/04.Structure/2.Types/01.index.md, "Permissões após a criação"](<docs/4.Settings/04.Structure/2.Types/01.index.md>); [docs/4.Settings/04.Structure/2.Types/03.Forms.md, "Permissões do formulário"](<docs/4.Settings/04.Structure/2.Types/03.Forms.md>)
- Padrão "para todos": só Owner, ou Full com permissão de sobrescrita, muda o padrão da View Lateral da categoria. — [docs/3.Member/4.Types/3.Items/3.Read.md, "View Lateral", nota](<docs/3.Member/4.Types/3.Items/3.Read.md>). Só Full e Owner aplicam a ordem para todos; Standard e Viewer reordenam só para si. — [blog/release-3-2-0.md, linha 183](<blog/release-3-2-0.md>)
- Na tela de workspaces, o card diz "Seu papel": Proprietário ou Membro; a doc fala em 2 participantes (Proprietário e Membros, com permissões dos cargos). — [docs/2.Access/2.Workspace/2.Management and Access.md, "Visão geral da tela" e "Papéis dentro do workspace"](<docs/2.Access/2.Workspace/2.Management and Access.md>)
- Os agentes de IA "respeitam as permissões do membro que está interagindo". — [docs/4.Settings/09.AI Agents.md](<docs/4.Settings/09.AI Agents.md>)
- Contradição: a ferramenta de IA Criar Cargo diz "Cargos são apenas organização — não definem permissões de acesso por si só". — [docs/8.Reference/3.AI Tools/roles/create-role.md, "Pontos de atenção"](<docs/8.Reference/3.AI Tools/roles/create-role.md>); contradiz [Roles and Permissions.md, "Defina o que cada membro pode fazer"](<docs/4.Settings/05.Access/3.Roles and Permissions.md>)
- Contradição: "Não é possível transferir a propriedade de um workspace" — [Management and Access.md, "Papéis dentro do workspace"](<docs/2.Access/2.Workspace/2.Management and Access.md>); contradito por "Para adicionar co-owners ou transferir a propriedade, entre em contato com o suporte" — [Members/1.index.md, "Tipos de licença"](<docs/4.Settings/05.Access/2.Members/1.index.md>)

### Inferences
- O vocabulário que já existe para escrever a regra do painel é: licença (Owner, Full, Standard, Viewer), cargo, permissão de área (Tarefas, Configurações) e a dupla "para todos" (Owner ou Full) e "só para mim" (Standard ou Viewer).
- A área Tarefas do cargo tem, pela nota da 3.2.0, as ações criar, atualizar, excluir e restaurar. Uma ação de "ver" ou "ver todas" não aparece em nenhuma fonte. Usar "leitura de Tarefas" como chave do painel pede confirmar no produto se essa ação existe.
- A nota "permissões não se aplicam a dashboards" indica que um painel novo não herda controle por cargo sem trabalho no back.

### Gaps
- A lista exata das permissões da área Tarefas no editor de cargo (nomes das caixas, se Rápidas e Agendadas são separadas, se há "ver") não está documentada.
- As abas da tela do cargo além de Dados e Inválidas não estão documentadas.
- A permissão por etapa de fluxo e por visualização aparece só na lista da migração; o que cada uma controla não está documentado.
- O que significa "Somente leitura" do Viewer em Tarefas (todas as tarefas do workspace ou só as dele) não está documentado.

## 2. Grupos de membros e o papel deles na permissão

### Takeaway
Pela doc, grupo é organizacional e não dá permissão: o cargo dá. Mesmo assim, o grupo já restringe visibilidade em 3 lugares: a seção do menu ("Grupos Permitidos"), o "Limitar acesso" das tarefas do Spaceflow e a responsabilidade das tarefas.

### Cited Findings
- Grupo é conjunto manual de membros; "Grupos são organizacionais. Eles não controlam permissões (isso é papel do cargo)"; um membro pode estar em vários grupos, sem limite de grupos nem de membros. — [docs/4.Settings/05.Access/4.Member Groups.md, "Organize membros em grupos"](<docs/4.Settings/05.Access/4.Member Groups.md>)
- Usos: responsabilidade de tarefas, responsabilidade de itens, condicionais e filtros, notificações. — [Member Groups.md, "Onde os grupos são usados"](<docs/4.Settings/05.Access/4.Member Groups.md>)
- Tirar um membro do grupo tira na hora as atribuições que dependiam do grupo. — [Member Groups.md, "Editar ou remover membros de um grupo"](<docs/4.Settings/05.Access/4.Member Groups.md>)
- Mesma regra no índice: "Grupos são organizacionais — não controlam permissões diretamente (isso é papel do cargo)". — [docs/4.Settings/05.Access/1.index.md, "Grupos"](<docs/4.Settings/05.Access/1.index.md>)
- Contradição: grupos facilitam "a configuração de acesso em lote" — [Members/1.index.md, "Gerencie quem acessa o workspace"](<docs/4.Settings/05.Access/2.Members/1.index.md>); "Grupos permitem organizar membros para facilitar permissões, responsabilidades e automações em lote" — [docs/2.Access/2.Workspace/1.index.md, "Membros, cargos e grupos"](<docs/2.Access/2.Workspace/1.index.md>)
- Menu: cada seção tem "Grupos Permitidos", que restringe a visibilidade da seção; sem grupo, todos veem. — [docs/4.Settings/06.Interface/2.Menus.md, "Configuração de uma seção"](<docs/4.Settings/06.Interface/2.Menus.md>)
- Tarefa de aprovação do Spaceflow: "Limitar acesso" restringe quem vê a tarefa por Usuário, Grupo ou Cargo, com a ação Ver, Editar ou Deletar. — [docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/3.Actions/Approval-Node.md, "Permissões e Responsabilidade da Tarefa"](<docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/3.Actions/Approval-Node.md>)
- Regra de responsabilidade do tipo Grupo: "Todos os membros do grupo serão responsáveis". — [docs/4.Settings/04.Structure/2.Types/10.Responsibility Rules.md, "Aba Responsabilidade"](<docs/4.Settings/04.Structure/2.Types/10.Responsibility Rules.md>)
- Tela do tipo "Consultas (Grupo de Membros)" mostra itens filtrados pelos grupos do usuário; a execução em massa da tela Tarefas lista só as tarefas pendentes "atribuídas ao próprio usuário ou a um grupo do qual ele faz parte". — [docs/4.Settings/06.Interface/3.Screens.md, "Tipos de tela disponíveis" e "Execução do lote"](<docs/4.Settings/06.Interface/3.Screens.md>)
- A migração leva os grupos, e cada grupo importado nasce vazio. — [UseCases.md, "O que a migração não copia"](<docs/4.Settings/06.Interface/4.UseCases.md>)
- Em develop, a aba Responsabilidade da tarefa de etapa tem 7 tipos: Baseado em Campo, Email Externo, Grupo, Regras de Responsável, Usuários, Usuário Solicitante e Todo Mundo; na API, o grupo vem em `module_groups` com `responsibility_type: module_groups`. — [proto/painel-de-tarefas/BRIEFING.md, linhas 94 e 113](<proto/painel-de-tarefas/BRIEFING.md>)

### Inferences
- "Tarefas por grupo" no painel lê a responsabilidade por grupo, que já existe. O grupo como chave de "quem vê o painel" tem precedente no menu ("Grupos Permitidos"), mas contraria a frase da doc de que grupo não dá permissão.

### Gaps
- Se o "Limitar acesso" por Grupo ou Cargo existe também no nó de Tarefa (o básico) e na tarefa rápida manual não está documentado.

## 3. Quem vê quais tarefas hoje (Rápidas e Agendadas)

### Takeaway
A doc não tem a permissão "ver todas as tarefas". Nas Rápidas, a tarefa tem papéis (Criador, Responsável, Colaborador, "Usuários com permissão"), e a tarefa de aprovação sem "Limitar acesso" fica visível a todos os membros. Nas Agendadas, a tela abre filtrada em "Sob responsabilidade", e a tarefa sem responsável só aparece para Full e Owner. O Owner vê e faz tudo em toda tarefa.

### Cited Findings
- Tarefas Rápidas: a matriz tem 4 colunas, Criador / Owner, Responsável, Colaboradores e "Usuários com permissão"; as 4 veem a tarefa; "Usuários com permissão" só veem (não comentam, não editam, não veem a aba de Logs). — [docs/3.Member/5.Tasks/3.Quick.md, "Matriz de permissões"](<docs/3.Member/5.Tasks/3.Quick.md>)
- "As permissões do workspace, de cargo e de licença, continuam valendo: o papel na tarefa não as sobrescreve." O Owner "tem permissão irrestrita sobre todas as tarefas, qualquer que seja o papel dele nelas". — [Quick.md, "Papéis e permissões nas tarefas"](<docs/3.Member/5.Tasks/3.Quick.md>)
- Só Criador e Owner editam data limite e prioridade, arquivam, mandam para a lixeira e restauram. — [Quick.md, "Matriz de permissões" e "Quem arquiva, exclui e restaura"](<docs/3.Member/5.Tasks/3.Quick.md>)
- A matriz tem a linha "Editar nome, descrição e permissões da tarefa": a tarefa rápida guarda permissões próprias. — [Quick.md, "Matriz de permissões"](<docs/3.Member/5.Tasks/3.Quick.md>)
- Tarefa de aprovação: "Limitar acesso [...] Se deixado em branco, a tarefa fica visível para todos os membros do workspace." A nota manda à matriz das Rápidas para "membros com permissão limitada". — [Approval-Node.md, "Permissões e Responsabilidade da Tarefa"](<docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/3.Actions/Approval-Node.md>)
- O nó de Início em modo Manual gera tarefa com "limitar acesso, vincular item, criador, colaboradores e atribuição de responsável". — [docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/2.Triggers/3.Start-Flow-Node.md, linha 161](<docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/2.Triggers/3.Start-Flow-Node.md>)
- O nó de Tarefa (básico) documenta Atribuir a, Responsável alternativo, Colaboradores ("também podem visualizar e interagir") e Destinatários de E-mail; não documenta "Limitar acesso". — [docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/3.Actions/Task-Node.md, "Configurações do Nó"](<docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/3.Actions/Task-Node.md>)
- O quadro das Rápidas é de equipe: "A tela serve a quem precisa ver o andamento das atividades da equipe"; a mudança de um membro aparece na tela de todos na hora. — [Quick.md, introdução e "Sincronização em tempo real"](<docs/3.Member/5.Tasks/3.Quick.md>). "Visualizar tarefas geradas por Spaceflows em um board compartilhado." — [docs/3.Member/5.Tasks/1.index.md, "Tarefas Rápidas"](<docs/3.Member/5.Tasks/1.index.md>)
- Desde a 3.2.0, as Tarefas Rápidas aparecem no menu para todos os membros. — [blog/release-3-2-0.md, item 3.4](<blog/release-3-2-0.md>)
- Criar ou editar item numa tarefa de CRUD manual exige a permissão do cargo na categoria; sem ela, o ENSPACE avisa e barra. — [Quick.md, "Validação de permissão de cargo"](<docs/3.Member/5.Tasks/3.Quick.md>)
- Ausência temporária: as tarefas do ausente aparecem para todos os substitutos, que herdam as permissões dele sobre elas. — [Quick.md, "Ausência temporária e substituição"](<docs/3.Member/5.Tasks/3.Quick.md>); [docs/4.Settings/05.Access/2.Members/2.Temporary absences.md, "O que acontece durante a ausência"](<docs/4.Settings/05.Access/2.Members/2.Temporary absences.md>)
- Subtarefa: sem Colaboradores, só Responsáveis; não herda colaboradores nem "permissões dinâmicas" da tarefa pai. — [Quick.md, "Subtarefas"](<docs/3.Member/5.Tasks/3.Quick.md>)
- Tarefas Agendadas: a tela abre com 3 filtros, "Tarefas Abertas", "Sob responsabilidade" ("tarefas onde você é um dos responsáveis") e "Tarefas Internas" ("apenas tarefas do seu workspace"). — [docs/3.Member/5.Tasks/2.Scheduled.md, "Filtros e visualizações"](<docs/3.Member/5.Tasks/2.Scheduled.md>). O tutorial diz: "Clique em um deles para ver o conjunto completo de tarefas." — [Scheduled.md, "Passo a passo: ajustar as colunas e os filtros da tabela"](<docs/3.Member/5.Tasks/2.Scheduled.md>)
- "Se nenhuma regra for atendida, a tarefa fica sem responsável atribuído. Nesse caso, apenas membros com acesso Full ou Owner poderão visualizá-la e se atribuir manualmente." — [Responsibility Rules.md, "Como funciona"](<docs/4.Settings/04.Structure/2.Types/10.Responsibility Rules.md>)
- Tipos de responsável da regra: Usuários, Grupo, Usuário Solicitante, "Todo mundo" ("todos os membros do workspace ficam como responsáveis") e Baseado em Campo. Com "Habilitar Atribuição", quando um membro se atribui, os outros responsáveis perdem a interação. — [Responsibility Rules.md, "Aba Responsabilidade" e "Atribuição nas tarefas do fluxo"](<docs/4.Settings/04.Structure/2.Types/10.Responsibility Rules.md>)
- A tarefa de fluxo define "Responsáveis: Quem deve executar a tarefa (usuários, papéis, grupos, etc.)". — [docs/4.Settings/04.Structure/2.Types/04.Flow/3.Tasks.md, "O que posso configurar em uma tarefa?"](<docs/4.Settings/04.Structure/2.Types/04.Flow/3.Tasks.md>)
- Início: "Tarefas rápidas" lista as atribuídas a você; "Tarefas em atraso" e "Tarefas próximas" listam agendadas, sem dizer de quem. — [docs/3.Member/2.Home.md, "Tarefas em atraso", "Tarefas próximas" e "Tarefas rápidas"](<docs/3.Member/2.Home.md>). Medido em develop pelo agente de protótipos: "Os cartões da Início mostram só as tarefas de quem está logado; as listas não somam nada." — [proto/painel-de-tarefas/BRIEFING.md, "Onde trava", item 2](<proto/painel-de-tarefas/BRIEFING.md>)
- Tipos de tela da Interface: "Tarefas" (tarefas vinculadas ao workspace) e "Tarefas Geral" ("todas as tarefas do workspace em uma visão consolidada"), sem regra de permissão. — [Screens.md, "Tipos de tela disponíveis"](<docs/4.Settings/06.Interface/3.Screens.md>)
- Contradição sobre o que é tarefa agendada: "programadas para datas específicas, com recorrência opcional. Aparecem na agenda" — [Concepts.md, "Tarefas"](<docs/1.Getting Started/2.Concepts.md>); contra "geradas automaticamente por workflows [...] Não podem ser criadas manualmente" — [Tasks/1.index.md, "Tarefas Agendadas"](<docs/3.Member/5.Tasks/1.index.md>)
- Nome: a doc chama "Tarefas Agendadas" (menu "Agendadas"); o texto do protótipo diz "Tarefas Programadas". — [Scheduled.md](<docs/3.Member/5.Tasks/2.Scheduled.md>); [proto/painel-de-tarefas/textos.ts, linha 612](<proto/painel-de-tarefas/textos.ts>)

### Inferences
- Hoje a visibilidade da tarefa nasce de 4 fontes: o papel na tarefa (Criador, Responsável direto, por grupo ou "Todo mundo", Colaborador), o "Limitar acesso" da tarefa (em branco, todos veem), a licença (Owner vê tudo; Full vê também a agendada sem responsável) e o cargo (criar, atualizar, excluir e restaurar tarefas).
- Um painel do workspace inteiro mostra números de tarefas que um Standard ou Viewer não abre uma a uma. A regra do painel precisa escolher: contar só o que o membro vê, ou restringir o painel a quem vê tudo (Owner, Full, ou uma permissão nova).

### Gaps
- O conjunto que um Standard vê ao tirar o filtro "Sob responsabilidade" nas Agendadas (só as dele e dos grupos, ou todas do workspace) não está documentado.
- O que um Standard vê nas Rápidas quando a tarefa não tem "Limitar acesso" e ele não tem papel nela: a doc só afirma "visível para todos" no nó de aprovação.
- Se a tarefa agendada sem responsável fica visível a um Full com cargo reduzido não está documentado.
- O sentido de "Tarefas Internas" (oposto de tarefa externa? de outro workspace?) não está documentado.

## 4. Visibilidade no nível do item e tarefa ligada a item sem acesso

### Takeaway
O cargo filtra o item por categoria, formulário e campo, com CRUD. Desde a 3.2.0, a contagem e a busca também respeitam a permissão de formulário. A doc não diz se uma tarefa ligada a um item que o membro não lê aparece para ele.

### Cited Findings
- CRUD por categoria, formulário e campo; "O sistema filtra automaticamente os campos e ações disponíveis conforme as permissões do cargo". — [Roles and Permissions.md, "Permissões por categoria, formulário e campo"](<docs/4.Settings/05.Access/3.Roles and Permissions.md>)
- Regra desde a 3.2.0: para ver os itens de um formulário, o membro precisa da permissão Ver da categoria mais a do formulário; ele vê só os itens dos formulários autorizados "na tela de todos os itens, na tela de cada formulário, nas contagens e na busca por referência"; sem permissão de formulário configurada, Ver da categoria mostra todos os itens. — [blog/release-3-2-0.md, "3.2 Permissões: Membros com acesso por formulário deixavam de ver os itens"](<blog/release-3-2-0.md>)
- Release 3.3.0 (2026-10-29), correção 2.24: a permissão do cargo passa a valer no acesso aos itens, também para licença Full e para o nó de CRUD. Correção 2.9: o link direto de item sem acesso mostra que o item não foi encontrado ou que falta acesso. — [blog/release-3-3-0.md, itens 2.24 e 2.9](<blog/release-3-3-0.md>)
- Início: as categorias aparecem para todos (ou para ninguém); sem permissão, a categoria aparece e não abre. — [Home.md, "Categorias"](<docs/3.Member/2.Home.md>)
- Formulário Privado: só membros com permissão o usam; Público: link sem autenticação. — [Forms.md](<docs/4.Settings/04.Structure/2.Types/03.Forms.md>)
- Tarefa de CRUD manual: o membro só preenche se o cargo tiver Ver e Atualizar no formulário do nó. — [Roles and Permissions.md, "Quais formulários aparecem na árvore de permissões"](<docs/4.Settings/05.Access/3.Roles and Permissions.md>)
- Tarefa de aprovação com item vinculado: "O aprovador pode visualizar o item vinculado diretamente na tarefa, mas não pode editá-lo por ali." — [Approval-Node.md, "Permissões e Responsabilidade da Tarefa"](<docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/3.Actions/Approval-Node.md>)
- A tarefa agendada tem a aba Itens com "Acessar Item", que leva ao item de origem. — [Scheduled.md, "Como acessar o Item vinculado à Tarefa"](<docs/3.Member/5.Tasks/2.Scheduled.md>)
- Restrição por dono do item: nenhuma regra de permissão. Há telas que filtram: "Meus Itens" (itens atribuídos ao usuário logado) e "Consultas (Grupo de Membros)". — [Screens.md, "Tipos de tela disponíveis"](<docs/4.Settings/06.Interface/3.Screens.md>)

### Inferences
- A correção da 3.2.0 é precedente direto para o painel: "contagens" já respeitam a permissão do membro na tela de itens. Um painel que conta tarefas pela categoria do item teria a mesma expectativa.

### Gaps
- Se a tarefa (rápida ou agendada) de um item que o membro não lê aparece na lista dele, e o que a aba Itens mostra nesse caso, não está documentado.
- Permissão por etapa de fluxo (citada só na migração) poderia restringir a tarefa da etapa; não documentado.

## 5. Usuários externos: portal de tarefa externa, convidados e e-mail

### Takeaway
O externo não é membro e não tem licença. Ele recebe a tarefa por e-mail, entra no portal por link ou código de 6 dígitos e vê só as tarefas atribuídas a ele, com edição só nos campos que o fluxo libera.

### Cited Findings
- O portal serve "usuários convidados (não membros do workspace)"; cada tarefa atribuída a um externo gera um link único; ele vê a lista de tarefas pendentes e concluídas, os detalhes (título, descrição, prazo, status) e os campos de interação. — [docs/3.Member/5.Tasks/6.External Task Portal.md, "Como funciona"](<docs/3.Member/5.Tasks/6.External Task Portal.md>)
- "O portal de tarefas externas é somente leitura para o usuário externo, exceto nos campos de interação explicitamente configurados no fluxo. O usuário não tem acesso a outros dados do workspace." — mesmo arquivo, nota.
- Acesso: o e-mail "Nova Tarefa Externa" traz "Acessar Tarefa"; sem identificação, o portal manda um código de verificação e abre a tela "Verifique seu e-mail", com 6 campos. — [External Task Portal.md, "Acesso ao portal"](<docs/3.Member/5.Tasks/6.External Task Portal.md>)
- O link é único e ligado à tarefa; a doc pede não compartilhar entre usuários. — mesmo arquivo, aviso.
- "Habilitar Tarefa Externa" manda a tarefa por e-mail a quem está fora do workspace, sem conta no ENSPACE; o fluxo guarda `{{external_task}}` com `.link` e `.email`. — [Task-Node.md, "Tarefa Externa"](<docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/3.Actions/Task-Node.md>); [Approval-Node.md, "Tarefa Externa"](<docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/3.Actions/Approval-Node.md>)
- "Atribuir a" do nó de Tarefa lista só membros: e-mail que não é de membro não entra. "Destinatários de E-mail" só recebem notificação. — [Task-Node.md, "Configurações do Nó"](<docs/4.Settings/04.Structure/4.Spaceflow/2.Nodes/3.Actions/Task-Node.md>)
- O card da tarefa rápida tem "Copiar link externo", que copia o link da tarefa no portal externo. — [Quick.md, "Menu contextual do card"](<docs/3.Member/5.Tasks/3.Quick.md>)
- A tarefa de etapa aceita o responsável "Email Externo" (medido em develop). — [proto/painel-de-tarefas/BRIEFING.md, linha 94](<proto/painel-de-tarefas/BRIEFING.md>)
- O filtro "Responsável" do protótipo tem o grupo "Outros", com "Todo mundo", "E-mail externo" e "Sem responsável". — [proto/painel-de-tarefas/requisitos/parte-1-a-tela-do-painel-e-os-filtros.md, RF007, linha 42](<proto/painel-de-tarefas/requisitos/parte-1-a-tela-do-painel-e-os-filtros.md>)

### Inferences
- O externo entra no painel só como valor de "Responsável" ("E-mail externo"); ele não abre o painel, porque não é membro.

### Gaps
- Licença ou papel de "convidado" dentro do workspace (fora as 4 licenças e o status Pendente do convite) não está documentado.
- O que o portal mostra de uma tarefa agendada (fluxo de categoria) com responsável "Email Externo" não está documentado: a página do portal fala só do Spaceflow.

## 6. Telas de análise, painel e relatório que já existem, e as permissões delas

### Takeaway
Existem a tela do tipo Painéis (dashboard de widgets), os modelos de Relatórios por categoria, a Início pessoal, a Visão Geral das Configurações, os Logs e a carteira de créditos. A única trava documentada de um dashboard é o menu: a tela só aparece se estiver numa seção, e a seção pode ser restrita por grupo. A doc diz que as permissões do cargo não valem para dashboards nem relatórios.

### Cited Findings
- Tela do tipo Painéis: widgets que "consolidam dados de categorias, tarefas e outros recursos do workspace", com fonte de dados, tipo de gráfico, filtros e cores. — [Screens.md, "Dashboard (Painéis)"](<docs/4.Settings/06.Interface/3.Screens.md>). Contradito pela medição em develop: "O painel de hoje não aceita tarefa. 'Categoria' é obrigatória no Agrupamento de Dados." — [proto/painel-de-tarefas/BRIEFING.md, "Onde trava", item 1](<proto/painel-de-tarefas/BRIEFING.md>)
- Tela que não está no menu não aparece para os membros; fica só na configuração. — [Screens.md, "Como criar uma tela"](<docs/4.Settings/06.Interface/3.Screens.md>). Seção do menu com "Grupos Permitidos"; sem grupo, todos veem. — [Menus.md, "Configuração de uma seção"](<docs/4.Settings/06.Interface/2.Menus.md>)
- "Atualmente, as permissões não se aplicam a dashboards, relatórios ou integrações de terceiros." — [Roles and Permissions.md, "O que as permissões controlam"](<docs/4.Settings/05.Access/3.Roles and Permissions.md>)
- Relatórios: modelo por categoria, de itens ou de tarefas de fluxo, exportado na tela de itens e na de Tarefas Agendadas; monta-se em Configurações > Estrutura > Categorias > Relatórios. Permissão de quem exporta não documentada. — [docs/4.Settings/04.Structure/2.Types/06.Reports.md, "Crie modelos de relatórios personalizados"](<docs/4.Settings/04.Structure/2.Types/06.Reports.md>)
- Início: "painel pessoal"; cartões Categorias (global), Tarefas em atraso, Tarefas próximas e Tarefas rápidas (atribuídas a você). — [Home.md, "Acompanhe seu dia de trabalho"](<docs/3.Member/2.Home.md>)
- Visão Geral das Configurações: indicadores de quantidade de categorias, integrações e membros; Standard e Viewer veem a tela com as ações rápidas desabilitadas. — [docs/4.Settings/02.Overview.md, "Ações Rápidas" e "Informações do Workspace"](<docs/4.Settings/02.Overview.md>)
- Logs (Audit e Request) ficam em Configurações > Logs; logs entram na área Configurações do cargo; o Audit Log registra o membro com o "tipo de acesso". — [docs/4.Settings/10.Logs/2.audit.md, "O que é Registrado"](<docs/4.Settings/10.Logs/2.audit.md>); [Roles and Permissions.md, "O que as permissões controlam"](<docs/4.Settings/05.Access/3.Roles and Permissions.md>)
- Consumo: a carteira de en-credits e o histórico de transações dizem qual funcionalidade gerou o consumo; a aprovação de pedido de crédito é de quem acessa o sistema administrativo do ENSPACE. Quem abre a tela no workspace não está escrito nesse arquivo. — [docs/4.Settings/03.System/6.Billing.md, "Histórico de transações" e "Solicitações de crédito"](<docs/4.Settings/03.System/6.Billing.md>)
- Contas dentro das listas: totalizador por coluna nas Rápidas (contagem ou soma de campo numérico); filtro de período nas Agendadas "para analisar o histórico de produtividade". — [Quick.md, "Totalizadores"](<docs/3.Member/5.Tasks/3.Quick.md>); [Scheduled.md, "Filtros e visualizações"](<docs/3.Member/5.Tasks/2.Scheduled.md>)
- Comparações: na aba Requisições em Andamento, "cada responsável vê só as próprias requisições, e o aprovador vê todas". — [blog/release-3-3-0.md, "1.3 Comparações"](<blog/release-3-3-0.md>)

### Inferences
- Comparações traz um modelo de leitura já publicado: o executor vê o que é dele, e um papel acima vê tudo. É o mesmo desenho de "Sob responsabilidade" contra "ver tudo" que o painel precisa decidir.
- Um painel nativo em Tarefas › Painel fica fora do menu configurável (Interface > Menus); a trava por "Grupos Permitidos" não vale para ele sem decisão de produto.

### Gaps
- Permissão de quem vê ou edita uma tela do tipo Painéis, além do menu, não está documentada.
- Permissão para exportar relatório não está documentada.

## 7. Como o protótipo do painel e os outros protótipos escreveram a regra de perfil

### Takeaway
O painel deixou a permissão em aberto (P002) e o texto da tela pede "acesso de leitura a Tarefas e a Tarefas Programadas". Os outros protótipos escrevem a regra em 2 grupos, "Owner ou Full" contra "Standard ou Viewer", numa RN com tabela de perfis e RF com "Estado sem permissão" no critério de aceite.

### Cited Findings
- RF016: sem a permissão de P002, Tarefas › Painel mostra "Seu perfil não vê o painel de tarefas", com quem procurar. P002: "Qual permissão abre o painel: uma permissão nova, só o administrador, ou a leitura de Tarefas e de Tarefas Programadas, como diz o texto do protótipo?" P003: o item fica em Tarefas ou na Início. — [proto/painel-de-tarefas/requisitos/parte-1-a-tela-do-painel-e-os-filtros.md, linhas 61, 74 e 75](<proto/painel-de-tarefas/requisitos/parte-1-a-tela-do-painel-e-os-filtros.md>)
- Texto do estado: "O painel mostra as tarefas do workspace inteiro. Peça acesso de leitura a Tarefas e a Tarefas Programadas a quem administra o workspace." (EN e ES nas linhas 909 a 910 e 1207 a 1208). — [proto/painel-de-tarefas/textos.ts, linhas 611 e 612](<proto/painel-de-tarefas/textos.ts>). O estado "semPermissao" está no seletor da barra. — [proto/painel-de-tarefas/index.vue, linhas 78, 86 e 680](<proto/painel-de-tarefas/index.vue>)
- DECISOES: o item novo no menu é a única mudança na casca, e a pergunta sobre o lugar ficou para a redatora. — [proto/painel-de-tarefas/DECISOES.md, linha 249](<proto/painel-de-tarefas/DECISOES.md>)
- PESQUISA do painel (concorrentes): Notion, "Quem vê e quem edita segue a permissão do banco"; Pipefy, no plano Pro, 3 níveis por dashboard (View and Edit, Read Only, Don't show dashboard); Zoho Projects, permissão por painel (Full Access, Editor, Viewer). — [proto/painel-de-tarefas/PESQUISA.md, linhas 40, 266 e 538](<proto/painel-de-tarefas/PESQUISA.md>)
- menu-lateral: "RN003 Só quem tem licença Owner ou Full pode abrir Configurações", com o critério "Membro com licença Basic vê o ícone com cadeado"; RF006 descreve o estado sem permissão (cadeado, Tab, tooltip "Você não administra este workspace"). — [proto/menu-lateral/requisitos/fase-1-trilha-e-painel.md, linhas 36 e 50](<proto/menu-lateral/requisitos/fase-1-trilha-e-painel.md>). RN301 (mudar o menu para todos), RF308 e RF328 seguem o mesmo par Owner ou Full. — [proto/menu-lateral/requisitos/fase-4-arrumar-o-menu.md, linhas 34, 65 e 115](<proto/menu-lateral/requisitos/fase-4-arrumar-o-menu.md>). RN404 e RN505 também. — [fase-5-criar.md, linha 37; fase-6-casos-de-uso-e-importacao.md, linha 37](<proto/menu-lateral/requisitos/>). RN205: toda licença ordena as próprias categorias. — [fase-3-personalizacao.md, linha 39](<proto/menu-lateral/requisitos/fase-3-personalizacao.md>)
- A licença "Basic" do menu-lateral não existe na doc: a doc tem Owner, Full, Standard e Viewer. — [Members/1.index.md, "Tipos de licença"](<docs/4.Settings/05.Access/2.Members/1.index.md>)
- tela-de-workspaces RF031: o selo vem do `type` do membro, não do `role`: `owner` "Proprietário", `full` "Full", `standard` "Membro", `viewer` "Leitor". A doc usa "Visualizador" para o Viewer. — [proto/tela-de-workspaces/requisitos/parte-1-escolher-e-entrar.md, linha 43](<proto/tela-de-workspaces/requisitos/parte-1-escolher-e-entrar.md>)
- visualizacoes-da-tela-de-itens: RN004 "A tabela de perfis abaixo define o que cada perfil pode fazer na barra. Política: Única.", com a tabela "Linha | Ação | Owner ou Full | Standard ou Viewer". — [proto/visualizacoes-da-tela-de-itens/requisitos/barra-de-visualizacoes/epico.md, linhas 39 e 44](<proto/visualizacoes-da-tela-de-itens/requisitos/barra-de-visualizacoes/epico.md>). RN011 repete o formato. — [criar-configurar-e-salvar/epico.md, linhas 35 e 40](<proto/visualizacoes-da-tela-de-itens/requisitos/criar-configurar-e-salvar/epico.md>)
- "Quem vê" da visualização: "Só eu", "Todos do workspace" e "Grupos e funções"; para Standard ou Viewer, os 2 últimos ficam desligados, com a nota "Só Owner e Full mudam quem vê uma visualização de todos." — [criar-configurar-e-salvar/parte-2-painel-configurar.md, RF061, linha 46](<proto/visualizacoes-da-tela-de-itens/requisitos/criar-configurar-e-salvar/parte-2-painel-configurar.md>). Tooltip "Seu perfil cria visualizações só para você." — [parte-3-criar-pelo-catalogo.md, RF091, linha 20](<proto/visualizacoes-da-tela-de-itens/requisitos/criar-configurar-e-salvar/parte-3-criar-pelo-catalogo.md>)
- RF145 e RF159: a cópia repete o "quem vê" da original quando quem duplica é Owner ou Full, e fica só de quem duplica quando é Standard ou Viewer. — [barra-de-visualizacoes/parte-2-menu.md, linha 32](<proto/visualizacoes-da-tela-de-itens/requisitos/barra-de-visualizacoes/parte-2-menu.md>); [criar-configurar-e-salvar/parte-1-alteracoes-e-salvar.md, linha 43](<proto/visualizacoes-da-tela-de-itens/requisitos/criar-configurar-e-salvar/parte-1-alteracoes-e-salvar.md>)
- P003 do filtro: o filtro automático "isOwner" da tela de itens é dono, criador ou responsável? — [proto/visualizacoes-da-tela-de-itens/requisitos/filtros/parte-4-filtros-no-construtor.md, linha 30](<proto/visualizacoes-da-tela-de-itens/requisitos/filtros/parte-4-filtros-no-construtor.md>)
- pastas-do-item: "quem é owner salva a ordem para todos, pelo popup"; falta decidir o escopo para quem não é owner. — [proto/pastas-do-item/REQUISITOS.md, linhas 56 e 116](<proto/pastas-do-item/REQUISITOS.md>)

### Inferences
- O padrão de escrita dos protótipos é: 1 RN com a tabela de perfis por licença (Owner ou Full contra Standard ou Viewer), RF que cita a RN, e critério de aceite com "Estado sem permissão". O painel pode seguir esse formato para fechar P002.
- O texto atual do painel ("leitura de Tarefas e de Tarefas Programadas") supõe uma ação "ler" na área Tarefas do cargo, que a doc não confirma (seção 1, Gaps), e usa "Programadas" onde a doc diz "Agendadas".

### Gaps
- Nenhum protótipo anterior definiu regra de perfil para um dado agregado do workspace inteiro (painel, contagem, métrica); os precedentes tratam de configuração "para todos" contra "só para mim".

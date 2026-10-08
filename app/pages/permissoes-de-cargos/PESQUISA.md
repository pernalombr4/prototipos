# Pesquisa: permissões por cargo que escalam

16 produtos: os 5 obrigatórios (Notion, Twenty, ClickUp, Monday, Pipefy) e 11 extras (Airtable,
Salesforce, Jira, Google Workspace, Linear, Directus, Strapi, Retool, HubSpot, Zoho Creator, Attio).
Feita em 2026-10-08 com a doc oficial de cada produto e, no Twenty, com o código do front lido no GitHub.

**Sem print de referência nesta rodada:** a pesquisa leu doc e código, sem abrir as telas. Cada entrada
traz a URL da fonte. O que o protótipo adotou de cada um está no `DECISOES.md`.

## Resumo para decidir

- **Ninguém mostra tudo.** Os 16 produtos escalam de 3 jeitos, e os melhores combinam os 3:
  - **Padrão + exceções:** o cargo tem um padrão para todos os recursos, e a tela lista só os recursos que
    fogem dele (Twenty, Attio, Retool, Notion).
  - **Permissão no próprio recurso:** a regra mora na categoria, no campo ou na coluna, e o cargo não lista
    recursos (Notion, Airtable, Attio, Monday, ClickUp, Linear).
  - **Níveis nomeados em vez de checkbox atômico:** 3 a 5 níveis cumulativos (Nenhum, Ver, Editar, Total)
    resolvem a maioria dos casos; o checkbox fino fica atrás de um clique (Notion, Retool, Directus, Pipefy,
    Monday, HubSpot).
- **O modelo mais próximo do que o ENSPACE precisa é o do Twenty**, que é open source:
  - 4 checkboxes globais no topo ("ver/editar/excluir/destruir em todos os objetos"), cada uma com o
    contador "Revogado em N objetos".
  - Abaixo, uma tabela só com os objetos que têm regra própria; vazia por padrão.
  - "Adicionar regra" abre um seletor com busca que já esconde os objetos com regra.
  - Dentro do objeto, cada campo mostra se segue o padrão (marcado, com X para revogar) ou se foi alterado
    (desmarcado, com ícone laranja para voltar ao padrão).
- **A matriz recurso × ação funciona até umas dezenas de linhas** (Directus, Strapi, Zoho Creator). Com 100
  categorias ela precisa de busca, de filtro "só alterados" e de um estado por célula que diga "tudo, nada ou
  personalizado" (Directus).
- **Oportunidade:** nenhum dos 16 junta, numa tela só, padrão + exceções, 3 níveis de profundidade
  (categoria > formulário > campo), seleção de várias categorias para aplicar o mesmo nível e uma prévia do
  impacto antes de salvar.

## Catálogo de padrões

| Padrão | Quem faz | Serve ao ENSPACE? |
|---|---|---|
| Matriz: linhas = recursos, colunas = ações, checkbox na célula | Directus, Strapi, Zoho Creator, Salesforce (campos) | Sim, como vista de detalhe; sozinha não escala para 100 linhas |
| Checkbox de linha ou de coluna que marca tudo | Strapi (linha marca todas as ações), Twenty (linha "All" nos campos), Directus (All/None ao passar o mouse na linha) | Sim |
| Padrão do cargo + exceções por recurso | Twenty, Attio, Retool, Notion (padrão do teamspace) | Sim, é o centro da proposta |
| Herança hierárquica com estado "herdado" e "personalizado" | Twenty (ícone de voltar ao padrão), Notion, ClickUp, Retool (pasta) | Sim: categoria > formulário > campo |
| Estado indeterminado no pai | Google Workspace (árvore de privilégios), Directus (célula "personalizado") | Sim, na linha da categoria quando os formulários divergem |
| Busca e "só alterados" | Twenty (lista só exceções, busca de objeto e de campo), Salesforce ("View Summary" mostra só o que está ligado), ClickUp (busca de permissão) | Sim |
| Edição em massa por seleção de linhas | Salesforce (até 200 permission sets de uma vez), Monday (atribuir papel em massa por filtro de time) | Sim, aplicado a categorias |
| Níveis predefinidos (Nenhum/Ver/Editar/Total) | Notion, Retool, Attio, Pipefy, Monday, Directus, HubSpot | Sim, na linha; checkbox atômico no detalhe |
| Permissão definida no recurso (aba Permissões na categoria) | Attio, Notion, Airtable, Monday (coluna), ClickUp, Linear | Sim, como segunda porta para a mesma regra |
| Modelo reutilizável ligado a vários recursos | Jira (permission scheme), Salesforce (permission set) | Talvez: "modelo de permissão" para categorias parecidas |
| Escopo pela relação com o item (meus, do meu time, todos) | HubSpot, Monday (Assigned contributor), Pipefy (Restricted view), Notion (regra por propriedade Pessoa), Strapi (condição "criador") | Sim, se o ENSPACE tiver ou planejar esse escopo |
| Dependência automática entre ações | Twenty, Salesforce, Google Workspace | Sim: editar liga ver; tirar ver tira o resto |

---

## Obrigatórios

### 1. Notion

**Como resolve, em passos**

1. A pessoa abre a página ou o banco de dados e clica em **Share**, no topo à direita.
2. Vê a lista de pessoas, grupos e teamspace com acesso, cada um com o nível ao lado.
3. Abre o dropdown do nível e escolhe: **Full access**, **Can edit**, **Can edit content** (só banco: edita
   itens e propriedades, não a estrutura), **Can create** (só banco, planos Business e Enterprise: cria itens
   sem ver os dos outros), **Can comment**, **Can view**.
4. A subpágina herda o acesso da página pai. Para mudar, a pessoa abre a subpágina e altera ali.
5. Padrão do teamspace: `•••` ao lado do teamspace > **Teamspace settings** > **Members** > **Permissions**.
   O dono define o nível padrão para donos, membros e pessoas do workspace fora do teamspace; vale para
   páginas novas.
6. Regra por linha no banco: **Share** > **Page-level access** > **Add a new rule** > escolhe uma propriedade
   Pessoa ou "Created by" > escolhe o nível > **Create rule**.

**Nível:** no recurso (página, banco), com herança do pai e exceção na filha. Níveis nomeados. Regra por
propriedade Pessoa no banco. Quando há 2 concessões, vence a mais permissiva.

**Volume:** não existe tela do cargo. O volume se resolve pela herança: define no teamspace ou na página
pai, e só as exceções aparecem nas filhas.

**Fonte:** https://www.notion.com/help/sharing-and-permissions e
https://www.notion.com/help/guides/grant-access-teamspaces

**Para o ENSPACE**
- Serve:
  - Níveis nomeados, com 1 frase cada.
  - "Can edit content" separa editar itens de mudar a estrutura, a mesma fronteira entre usar e configurar
    uma categoria.
  - Regra por propriedade Pessoa equivale a "só itens em que sou responsável".
- Não serve:
  - Sem visão por cargo: para saber o que um grupo vê, abre-se página por página. Auditoria fica difícil.
  - "Mais permissivo vence" não deixa negar uma exceção.

### 2. Twenty CRM (open source)

**Como resolve, em passos** (doc oficial e componentes em
`packages/twenty-front/src/modules/settings/roles/role-permissions/`)

1. **Settings > Members > Roles**. Em "All Roles", **+ Create Role**, ou abre um papel existente. O papel tem
   as abas **Permissions** e **Assignment** (a quem se atribui: membros, chaves de API, agentes de IA).
2. Aba **Permissions**, seção **Objects**, subtítulo "Objects and fields permissions settings": uma tabela de
   4 linhas, uma por ação, cada uma com checkbox:
   - "See Records on All Objects"
   - "Edit Records on All Objects"
   - "Delete Records on All Objects" (exclusão recuperável)
   - "Destroy Records on All Objects" (exclusão definitiva)
3. Embaixo de cada rótulo, a linha mostra o resumo das exceções: "Revoked for N objects" (checkbox em cor
   de aviso) ou "Granted for N objects" (`SettingsRolePermissionsObjectsTableRow.tsx`).
4. Dependências automáticas: desmarcar "See" desmarca as outras 3; marcar editar, excluir ou destruir marca
   "See" (`SettingsRolePermissionsObjectsSection.tsx`).
5. Subseção **Object-Level**: tabela só com os objetos que têm regra própria. Sem regra, mostra "No
   permissions have been set for individual objects." Cada linha tem ícone, nome do objeto, resumo da regra,
   resumo de campos ("see" e "update") e menu de opções. Clicar na linha abre a regra.
6. Botão **+ Add rule**: abre uma página com busca ("Search an object") e cartões de objeto divididos em
   **Standard** e **Custom**. Objetos que já têm regra não aparecem. O botão fica desativado quando todos os
   objetos já têm regra (`SettingsRolePermissionsObjectLevelObjectPicker.tsx`).
7. Dentro do objeto: as ações daquele objeto e a tabela **Fields Permissions** ("Ability to interact with
   this object's fields"):
   - busca "Search a field...";
   - colunas Nome, Tipo de dado, **See** e **Edit**;
   - uma linha **All** no topo, que restringe todos os campos ou remove todas as restrições de uma vez.
8. Cada checkbox de campo é um `OverridableCheckbox` com 2 estados:
   - **padrão (herdado):** marcado e travado, com um X cinza ao lado. Clicar no X revoga.
   - **exceção:** desmarcado, com ícone laranja de desfazer. Clicar volta ao padrão.
   Tirar "See" de um campo tira "Edit" também.
9. Restrição por linha (plano Organization): filtros que limitam quais registros o papel vê ou edita.
10. Seções **Settings** ("Settings All Access" ou flags uma a uma) e **Actions** ("Application All Access"
    ou Send Email, Import CSV, Export CSV).
11. **Finish** e **Save**.

**Nível:** papel (1 por membro) > padrão para todos os objetos > exceção por objeto > exceção por campo >
filtro de linha. O mais específico vence.

**Volume:** o melhor exemplo de padrão + exceções. A tela não cresce com o número de objetos: cresce com o
número de exceções. O contador "Revoked for N objects" resume o que está escondido.

**Fonte:**
- https://docs.twenty.com/user-guide/permissions-access/capabilities/permissions.md
- https://github.com/twentyhq/twenty/tree/main/packages/twenty-front/src/modules/settings/roles/role-permissions

**Para o ENSPACE**
- Serve:
  - O modelo inteiro: padrão do cargo, lista só de exceções, contador, seletor com busca, "voltar ao padrão".
  - O estado herdado com X para revogar e o estado alterado com ícone de desfazer, que deixam claro o que
    foi mexido.
  - A linha "All" na tabela de campos.
- Não serve ou precisa adaptar:
  - Só 4 ações. O ENSPACE tem mais ações por categoria.
  - Só 2 níveis de profundidade (objeto > campo). O ENSPACE precisa de 3 (categoria > formulário > campo).
  - Adiciona exceção uma por vez; não seleciona várias categorias de uma vez.
  - Para saber o estado de um objeto sem exceção, a pessoa deduz do padrão no topo: o objeto não aparece.

### 3. ClickUp

**Como resolve, em passos**

2 telas separadas: o que o cargo pode fazer no sistema, e onde ele entra.

1. **Papel:** avatar do workspace > **Settings** > **Security & Permissions** > seção **Custom Role
   Permissions**.
2. A tabela tem **linhas = permissões** e **colunas = papéis** (Admin, Member, Guest e os personalizados).
   Cada célula é um toggle. Há busca no topo.
3. **+ New Role** > nome > escolhe o papel base de onde herdar (Admin, Member ou Guest) > **Create**. O papel
   vira uma coluna nova, já com os toggles do base.
4. Atribuição: **People** > dropdown na coluna **Role** ao lado de cada pessoa.
5. **Local:** na barra lateral, passa o mouse no Space, Folder ou List > `...` > **Sharing & Permissions**.
   O modal lista pessoas com toggle de acesso e dropdown de nível (Full edit, Edit, Comment, View only).
6. O local pode virar privado (ícone de cadeado) e ter um nível padrão para quem for convidado depois.
7. Campo personalizado tem permissão própria (Custom Field permissions).

**Nível:** papel global só para ações do sistema (gerenciar usuários, excluir itens, exportar). Acesso a dado
definido no recurso, herdado na hierarquia Space > Folder > List > Task, com override abaixo.

**Volume:** a tabela do papel não lista recursos, então não cresce com o workspace. O recurso carrega a
própria regra.

**Fonte:**
- https://help.clickup.com/hc/en-us/articles/6309195687959-Manage-Custom-Role-permissions
- https://help.clickup.com/hc/en-us/articles/6309266954263
- https://help.clickup.com/hc/en-us/articles/31233419651607-Set-permissions-on-individual-locations

**Para o ENSPACE**
- Serve:
  - Matriz transposta (permissões × cargos) para comparar cargos lado a lado.
  - Criar cargo a partir de um existente.
  - Separar "o que o cargo faz no sistema" de "em quais categorias ele entra".
- Não serve:
  - Acesso por local é dado a pessoas, não a cargos.
  - Para ver tudo que um cargo acessa, abre-se local por local.

### 4. Monday.com

**Como resolve, em passos**

1. **Papel da conta (Enterprise):** foto do perfil > **Administration** > aba **Permissions**.
2. À esquerda, a lista de papéis ("Custom account roles"). À direita, checkboxes agrupadas por área: Account,
   Boards, Items, Dashboards, Workflow, Docs, User Management, Admin Privileges.
3. **New role** > nome > tipo base (qualquer um menos admin) > **Create**. O papel personalizado só reduz o
   que o base permite; nunca passa dele.
4. Atribuição: **Directory** > **Users** > coluna **User role**. Dá para filtrar por time e atribuir em massa.
5. **Board:** **Invite** > adiciona pessoa ou time > dropdown de papel no board: Owner, Editor, Contributor,
   **Assigned contributor** (edita só itens em que está numa coluna Pessoa) e Viewer. O dono ajusta o que
   cada papel do board pode fazer e o acesso geral padrão.
6. Fora do Enterprise, o board tem 1 conjunto para todos: editar tudo, editar só conteúdo, editar só itens
   atribuídos, ou ver e comentar.
7. **Coluna:** menu `⋯` do cabeçalho > Settings > **Restrict column editing** ou **Restrict column view** >
   escolhe pessoas ou times. Edição e visão não se restringem na mesma coluna.

**Nível:** conta (papel com teto), board (papel do board), coluna.

**Volume:** a regra mora no board e na coluna; o papel da conta não lista boards.

**Fonte:**
- https://support.monday.com/hc/en-us/articles/8292728458386-Custom-roles-for-account-permissions
- https://support.monday.com/hc/en-us/articles/31152393208466-Board-permissions-on-Enterprise
- https://support.monday.com/hc/en-us/articles/360011926640 (column permissions)

**Para o ENSPACE**
- Serve:
  - "Assigned contributor": escopo pelo vínculo com o item, comum em processo.
  - Papel com teto: o personalizado parte de um base e só tira.
  - Restrição de campo no próprio cabeçalho do campo, onde a pessoa já está.
- Não serve:
  - Nenhuma visão consolidada por papel.
  - Restrição de coluna por pessoa e time, não por papel; editar e ver são exclusivos.

### 5. Pipefy

**Como resolve, em passos**

1. **Pipe:** nas configurações do pipe, define público ou privado.
2. Botão de membros no cabeçalho do pipe: lista cada pessoa e o papel dela naquele pipe.
3. Papéis fixos por pipe: **Read-only** (vê todos os cards e comenta), **Restricted view** (cria cards; vê e
   edita só os que criou ou de que é responsável), **Pipe member** (vê, edita e move todos), **Pipe admin**
   (também configura o pipe). O glossário cita ainda **Start form only** (só usa o formulário inicial).
4. **Database:** papéis admin, member e read only.
5. **Papel da empresa:** Admin dashboard > **Create role** > nome e descrição > começa vazio ou copia um
   predefinido (Super admin, Administrator, Member, Company guest, External guest) > **Create role**.
6. No papel: **Permissions**, com categorias que expandem e recolhem (admin panel, pipes, databases,
   automações e agentes de IA) > permite ou bloqueia > **Save**. Depois **People** > **Assign users**.

**Nível:** empresa (papel personalizado), pipe e database (papel fixo por pessoa). A doc não traz permissão por
fase nem por campo; o campo tem só a opção de ser editável em outras fases.

**Volume:** papéis fixos por pipe evitam matriz. O papel da empresa usa acordeão por categoria de permissão.

**Fonte:**
- https://help.pipefy.com/en/articles/614597-pipe-roles-and-permissions
- https://help.pipefy.com/en/articles/6418478-custom-roles
- https://help.pipefy.com/en/articles/6027079-company-roles-and-permissions

**Para o ENSPACE**
- Serve:
  - Concorrente direto no Brasil, com público parecido.
  - Os 4 níveis por pipe e "Start form only" mapeiam para categoria e formulário do ENSPACE.
  - Criar papel copiando um predefinido.
- Não serve:
  - Granularidade baixa: sem fase, sem campo.
  - Papel por pipe é dado pessoa a pessoa; com 100 pipes, o admin repete o convite 100 vezes.

---

## Extras

### 6. Airtable

**Passos**
1. Papéis fixos na base: Owner, Creator, Editor, Commenter, Read only.
2. **Campo:** seta ao lado do nome do campo > **Edit field permissions** > dropdown "Who can edit values in
   this field?".
3. **Tabela:** seta ao lado da tabela > **Edit table permissions** > "Who can create records?" e "Who can
   delete records?".
4. Na tela de uso, um cadeado aparece no lugar do `+` quando a pessoa não pode criar.
5. Nos planos pagos, o **field manager** mostra todos os campos da tabela num lugar.

**Nível:** papel fixo + regra no recurso (tabela, campo). **Volume:** a regra mora no recurso; não há tela por
papel.

**Fonte:** https://support.airtable.com/articles/2296468758-airtable-field-and-table-editing-permissions

**Para o ENSPACE:** serve a pergunta em linguagem comum ("Quem pode criar registros?") e o cadeado na tela de
uso. Não serve a ausência de visão por papel e os papéis fixos.

### 7. Salesforce (Profiles e Permission Sets)

**Passos**
1. Setup > **Permission Sets** > abre o conjunto > **Object Settings**: lista de todos os objetos, com busca
   **Find Settings**.
2. Clica no objeto > **Edit**. Vê **Object Permissions** (Read, Create, Edit, Delete, View All, Modify All) e
   **Field Permissions** (Read Access e Edit Access por campo).
3. **View Summary**: mostra numa página só o que está ligado no conjunto (objetos, campos, permissões de
   usuário).
4. **Permission Set Groups** somam vários conjuntos. Para tirar algo de um grupo, cria-se um **Muting
   Permission Set**: coluna **Muted** com checkbox por permissão. Ao salvar, a confirmação lista as
   permissões dependentes que também saem.
5. **Edição em massa:** na list view de permission sets, as colunas são permissões escolhidas (até 15). A
   pessoa marca as linhas, dá duplo clique numa célula, liga ou desliga e escolhe "All n selected records".
   Até 200 conjuntos de uma vez.

**Nível:** perfil + conjuntos aditivos + grupos + muting (exceção que tira) > objeto > campo.

**Volume:** busca, resumo só do que está ligado, edição em massa, dependências automáticas.

**Fonte:**
- https://help.salesforce.com/s/articleView?id=platform.perm_set_groups_muting.htm
- https://developer.salesforce.com/docs/atlas.en-us.248.0.securityImplGuide.meta/securityImplGuide/perm_sets_inline_editing.htm
- https://trailhead.salesforce.com/content/learn/modules/permission-set-groups/mute-permissions-in-permission-set-groups

**Para o ENSPACE**
- Serve: o resumo "só o que está ligado", a edição em várias linhas com "aplicar a todos os selecionados" e o
  aviso de dependências ao salvar.
- Não serve: navegação profunda (1 objeto por vez), vocabulário técnico, modelo de 4 camadas difícil de
  explicar.

### 8. Jira (permission schemes)

**Passos**
1. Settings > Issues > **Permission schemes** > escolhe o esquema > **Permissions**.
2. Lista fixa de permissões agrupadas (projeto, item, comentários, anexos, registro de horas). Cada linha
   mostra quem recebe.
3. **Update** na linha > escolhe quem recebe: papel de projeto, grupo, usuário, ou alguém relativo ao item
   (relator, responsável, campo de usuário).
4. O esquema se liga a vários projetos. Mudar o esquema muda todos.
5. Pessoas entram no papel dentro de cada projeto: Project settings > **People**.

**Nível:** esquema reutilizável > papel de projeto > pessoa por projeto. **Volume:** 100 projetos apontam para
poucos esquemas.

**Fonte:** https://support.atlassian.com/jira/kb/grant-access-to-single-jira-project-that-uses-a-shared-permission-scheme/
e https://support.atlassian.com/jira/kb/jira-permissions-general-overview/

**Para o ENSPACE**
- Serve: "modelo de permissão" aplicado a várias categorias parecidas; quem recebe pode ser "o responsável
  pelo item".
- Não serve: a tela é lista de permissões com nomes em texto, sem checkbox; exceção num projeto exige
  clonar o esquema.

### 9. Google Workspace (papéis de administrador)

**Passos**
1. Admin console > Menu > **Account** > **Admin roles** > **Create new role** > nome > **Continue**.
2. Lista "Privilege Name" em seções que expandem e recolhem, com checkbox por privilégio. No privilégio de
   API, marcar o pai libera todas as ações; ou se marca ação a ação (Create, Read, Update, Delete).
3. Dependências automáticas: Create dá Read e Update; Update ou Delete dão Read.
4. **Continue** > tela de revisão dos privilégios > **Create Role** > atribui.

**Nível:** papel global sobre privilégios administrativos. **Volume:** árvore com pai e filhos, seções
recolhidas.

**Fonte:** https://support.google.com/a/answer/2406043 e https://support.google.com/a/answer/1219251

**Para o ENSPACE:** serve a árvore pai > filhos, o passo de revisão antes de criar e as dependências
automáticas. Não serve o escopo: são privilégios de administração, não dados por recurso. A doc não mostra
se o pai fica indeterminado quando só parte dos filhos está marcada.

### 10. Linear

**Passos**
1. Team settings > **Access and permissions**.
2. Para cada área (etiquetas, modelos, configurações do time, membros), a pessoa escolhe: todos os membros
   ou só os donos do time.
3. Acesso ao time: qualquer membro entra, ou só quem o dono adicionar.

**Nível:** time, com dono do time. Não herda para subtime. **Volume:** a regra mora no time e é binária.

**Fonte:** https://linear.app/docs/members-roles

**Para o ENSPACE:** serve delegar ao dono da categoria decisões simples, sem passar pelo admin. Não serve
para dado por cargo.

### 11. Directus (políticas com matriz coleção × ação)

**Passos**
1. Settings > **Access Control** > abre a política (ou o papel).
2. Tabela: **linhas = coleções**, **colunas = ícones** de Create, Read, Update, Delete e Share.
3. Clicar no ícone abre um menu com **All Access**, **No Access** ou **Use Custom**. O ícone muda para mostrar
   o estado: tudo, nada ou personalizado.
4. Passar o mouse no nome da coleção mostra **All** e **None** para a linha inteira.
5. **Use Custom** abre uma gaveta com: permissão de item (filtro), permissão de campo (quais campos), validação
   de campo e valores padrão.
6. Papéis contêm políticas e papéis filhos. Políticas se somam: campos por união, filtros por OU.

**Nível:** política > coleção × ação > item (filtro) > campo. **Volume:** atalhos de linha e estado por célula;
o detalhe só aparece em "personalizado".

**Fonte:** https://directus.com/docs/guides/auth/access-control e
https://docs.directus.io/user-guide/user-management/permissions

**Para o ENSPACE**
- Serve: a célula com 3 estados (tudo, nada, personalizado) é o tri-state que a linha da categoria precisa
  quando os formulários divergem; o detalhe na gaveta mantém a matriz curta.
- Não serve: a doc não mostra busca nem filtro na matriz; com 100 coleções a lista é longa.

### 12. Strapi (papéis com acordeão por content type)

**Passos**
1. Settings > Administration panel > **Roles** > **Add new role** ou editar.
2. Abas **Collection types**, **Single types**, **Plugins**, **Settings**.
3. Linha = content type, colunas create, read, update, delete, publish. Marcar a caixa do content type
   concede todas as ações.
4. Clicar no nome do content type expande linhas por campo, com checkbox por ação.
5. Cada permissão concedida tem um botão de engrenagem que abre "Define conditions" (por exemplo, só o
   criador). Um ponto marca a permissão com condição.
6. **Save**.

**Nível:** papel > content type × ação > campo > condição. **Volume:** abas por tipo e acordeão por linha.

**Fonte:** https://docs.strapi.io/cms/features/rbac

**Para o ENSPACE**
- Serve: o acordeão dentro da matriz (categoria expande para formulários ou campos), a caixa de linha que
  marca tudo e o ponto que marca condição.
- Não serve: sem busca, sem padrão + exceções.

### 13. Retool (permission groups)

**Passos**
1. Settings > **Permissions** > abre o grupo.
2. Abas **Apps**, **Resources**, **Workflows**, **Agents**.
3. Cada app, recurso ou pasta recebe um nível cumulativo: **Use** < **Edit** < **Own**.
4. Atalho para o grupo inteiro: **Use all**, **Edit all**, **Own all**.
5. Regra da pasta vale para o que está dentro, mas não sobrescreve item com regra própria.
6. Grupos se somam.

**Nível:** grupo > pasta > item. **Volume:** "aplicar a todos" + pasta + exceção no item.

**Fonte:** https://docs.retool.com/permissions/quickstart e https://docs.retool.com/org-users/guides/user-permissions

**Para o ENSPACE:** serve o nível cumulativo de 3 degraus e o "aplicar a todos" como padrão. Não serve a
granularidade: 3 níveis só.

### 14. HubSpot

**Passos**
1. Settings > **Users & Teams** > usuário ou permission set > aba de CRM.
2. Para cada objeto (contatos, empresas, negócios, tickets, tarefas, objetos personalizados), dropdowns
   **View**, **Edit**, **Delete** e **Communicate**.
3. Cada dropdown escolhe o escopo: todos os registros, os do meu time, os meus, ou nenhum. Uma caixa
   **Unassigned** amplia para registros sem dono.
4. Toggles à parte: importar, exportar, excluir em massa, editar associações.

**Nível:** conjunto > objeto × ação > escopo de dono. **Volume:** lista curta de objetos.

**Fonte:** https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide

**Para o ENSPACE:** serve trocar o sim/não por escopo (todos, do time, meus). Não serve o volume: o CRM tem
poucos objetos.

### 15. Zoho Creator

**Passos**
1. Modo de edição > **Settings** > **User Permissions** > aba **Permissions** > **Add Permission** ou abre o
   conjunto.
2. Tabela por componente com colunas **Access**, **View**, **Edit**, **Delete**.
3. A caixa **More** revela colunas raras: Import, Export/Print, View All, Modify All, Create new report,
   comentários.
4. Quando o formulário tem vários relatórios, clicar na ação abre a lista de relatórios para escolher.
5. **Field Permission** abre um popup com **Visibility** e **Read Only** por campo > **Done** > **Save**.

**Nível:** conjunto > formulário e relatório × ação > campo. **Volume:** colunas raras escondidas; campo num
popup.

**Fonte:** https://help.zoho.com/portal/en/kb/creator/user-guide/users-and-control/permissions/articles/configure-add-permission-set

**Para o ENSPACE:** o produto mais parecido em estrutura (low-code com formulário e relatório). Serve o
"More" que esconde colunas pouco usadas e o campo num popup à parte. Não serve: a tabela cresce 1 linha por
formulário, e a doc não mostra busca nem padrão.

### 16. Attio

**Passos**
1. **Workspace settings** > **Objects** > objeto > aba **Permissions**. Também pela página de registros >
   **Share**.
2. Linha **Workspace access**: o padrão para todos os membros.
3. **+ Add** para **Teams**, **Members** e **Automations**, cada um com dropdown **Full access**, **Read and
   write** ou **Read only**.
4. Vence o nível mais permissivo; time e membro só ampliam o padrão.

**Nível:** recurso > padrão do workspace > time > membro. **Volume:** a regra mora no objeto.

**Fonte:** https://attio.com/help/reference/managing-your-data/objects/manage-access-to-objects

**Para o ENSPACE:** serve a aba Permissões dentro do recurso, com o padrão no topo e as exceções embaixo.
Não serve: exceção só amplia, nunca restringe; sem visão por time.

---

## O padrão que todos seguem

1. **Ver é pré-requisito.** Editar, excluir e criar ligam "ver"; tirar "ver" tira o resto (Twenty,
   Salesforce, Google, Notion).
2. **Papel novo nasce de um existente.** Copia-se um base e ajusta-se (ClickUp, Monday, Pipefy, Zoho
   Creator). Em Monday, o personalizado só reduz o base.
3. **Níveis nomeados na superfície, checkbox fino atrás de um clique.** Gaveta, popup ou página do recurso
   (Directus, Zoho, Twenty, Strapi).
4. **Campo é o último nível**, sempre num segundo passo e com busca quando a lista é longa (Twenty,
   Salesforce, Zoho).
5. **Concessões se somam.** Vence o mais permissivo (Notion, Attio, Directus, Retool). Só Salesforce
   (muting) e Twenty (revogação por objeto e campo) restringem por exceção.
6. **Recurso novo herda o padrão.** Ninguém pede que se configure cada categoria nova.
7. **Dono e admin ignoram restrição** (Monday, Attio, ClickUp).
8. **Escopo pelo vínculo com o item** aparece em quase todos que lidam com processo: só os meus, os
   atribuídos a mim, os do meu time (Monday, Pipefy, HubSpot, Notion, Strapi).

## O que nenhum deles faz

Pelo que a doc e o código mostram, nenhum dos 16 faz:

1. **Matriz cargos × categorias numa tela**, para comparar o que cada cargo pode em cada categoria. O
   ClickUp compara cargos, mas só nas ações do sistema.
2. **3 níveis de profundidade na mesma tela** (categoria > formulário > campo) com herança e estado
   herdado/personalizado em cada nível. O Twenty tem 2 (objeto > campo).
3. **Filtro "só alterados" como controle visível**, que alterna entre ver tudo e ver só exceções. O Twenty
   mostra só exceções por desenho; não deixa ver tudo.
4. **Selecionar várias categorias e aplicar o mesmo nível de uma vez.** O Salesforce faz isso com conjuntos,
   não com objetos.
5. **Prévia do impacto antes de salvar:** quantas pessoas e categorias mudam. O Google tem revisão e o
   Salesforce lista dependências, mas nenhum mostra pessoas afetadas.
6. **"Ver como este cargo":** abrir o workspace com os olhos do cargo para conferir.
7. **Ida e volta entre recurso e cargo:** na categoria, ver quais cargos têm acesso e pular para a tela do
   cargo; no cargo, pular para a categoria. Cada produto escolhe um lado.

## Proposta de combinação que a pesquisa sugeriu

O protótipo seguiu a maior parte; as diferenças e o motivo estão no `DECISOES.md`, seção "O que veio da
pesquisa".


- **Topo da tela do cargo:** padrão para todas as categorias, em níveis nomeados (Nenhum, Ver, Editar,
  Total) com checkbox fino num "personalizar". Contador como o do Twenty: "Diferente em 12 categorias".
- **Lista de categorias:**
  - filtro "Só alteradas" ligado por padrão, com alternância para "Todas";
  - busca;
  - linha da categoria com o nível e um estado indeterminado quando os formulários divergem (célula de 3
    estados do Directus);
  - seleção de várias linhas + "Aplicar nível" (Salesforce).
- **Dentro da categoria:** acordeão para formulários (Strapi) e campos num segundo passo com busca e linha
  "Todos" (Twenty). Cada item mostra herdado ou alterado, com "voltar ao padrão".
- **Segunda porta:** aba Permissões na categoria, com o padrão no topo e as exceções por cargo embaixo
  (Attio), editando a mesma regra.
- **Antes de salvar:** resumo do que muda e quantas pessoas são afetadas.

## Lacunas desta pesquisa

- ClickUp, Monday e Salesforce devolveram 403 em algumas páginas; o conteúdo veio do resumo da busca sobre a
  página oficial.
- Notion: a doc não confirma um aviso de "permissão alterada" nem um botão de restaurar a herança na
  subpágina.
- Directus: os estados de ícone e o atalho All/None vêm da doc antiga e de guia da comunidade; a doc atual
  não descreve a tela.
- Google Workspace: a doc não mostra se o pai fica indeterminado.
- Airtable: a doc não lista as opções do dropdown de campo e de tabela.
- Attio: 2 páginas oficiais divergem (uma diz que o mais específico vence; a de objetos diz que vence o mais
  permissivo). Usei a de objetos.
- Nenhuma tela foi aberta: a descrição vem de doc e, no Twenty, de código.

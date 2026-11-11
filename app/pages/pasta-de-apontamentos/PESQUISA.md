# Nenhum produto guarda apontamento rico sem virar tarefa

Pesquisa de 2026-11-11, feita em help center, documentação oficial, changelog e blog dos fornecedores. Fórum, revendedor e app de terceiro estão marcados como tal na frase.

## Resumo

O mercado resolve a lista de apontamentos dentro de um registro de 2 jeitos, e nenhum atende ao pedido. O primeiro é a linha de checklist (GitHub, ClickUp, monday, Pipefy, Linear): leve, mas sem print, arquivo nem estado além de feito. O segundo é o registro inteiro (sub-issue, subtarefa, página de banco do Notion, item de punch do Procore, defeito do Qase): rico, mas multiplica cards. O GitHub tentou um meio-termo, os tasklist blocks, e o aposentou em 2025-04-30 ([GitHub Changelog](https://github.blog/changelog/2025-02-18-github-issues-projects-february-18th-update/)). Os mais próximos são o comentário atribuído do ClickUp (corpo rico, responsável e "Resolve") e o app Smart Checklist do Jira (status por item e item obrigatório que trava a transição). As peças do ciclo vêm de 3 famílias: a revisão de PR traz o rascunho com envio em lote e o pedido de nova rodada; a construção traz a regra "quem corrige não fecha"; a aprovação de arquivo traz a decisão da rodada e o PDF por versão. Nenhum produto junta essas peças numa pasta que o admin põe em qualquer categoria, com rodada como atributo da entrada e contador por estado. Esse é o espaço do ENSPACE, e o nome recomendado para o tipo de pasta é "Apontamentos".

## As 5 obrigatórias

### Notion: cada apontamento vira página de um banco de dados

**Como resolve**
1. O admin cria um banco de apontamentos ou liga os Sub-items em Database settings > More settings, que criam uma relação do banco com ele mesmo ([wisechecker, terceiro](https://wisechecker.com/notion-sub-items-how-to-set-up-nested-database-rows/)).
2. No template do registro-mãe, o admin insere uma view linkada do banco, filtrada para mostrar só as entradas daquele registro ([ctnet, terceiro](https://www.ctnet.co.uk/getting-around-notion-sub-items-issue-experiment/)).
3. Um Button com a ação "Add page to" cria a entrada com as propriedades preenchidas, e "Send notification to" avisa até 20 membros ou uma propriedade People ([Notion Help: Buttons](https://www.notion.com/help/buttons)).
4. Cada entrada é uma página, com corpo rico e propriedades de responsável e estado.

**URL:** https://www.notion.com/help/buttons

**O que serve ao ENSPACE**
- A lista aparece dentro do registro, filtrada para ele.
- A entrada tem corpo rico de verdade: texto, imagem, arquivo e link.
- O botão cria a entrada e avisa a pessoa num gesto só.

**O que não serve, e o motivo**
- Cada apontamento é uma página de banco, com o peso de uma subtarefa. É o que a redatora quer evitar.
- A montagem é manual e frágil: o Button exige Full access ou Can edit, o banco de destino não pode ser Private nem Shared, e os valores do template do banco sobrescrevem os do botão ([Notion Help: Buttons](https://www.notion.com/help/buttons)). Para cliente de jurídico, obra e RH, montar banco, view e botão à mão é configuração demais.
- As fontes lidas não citam estado de conferência nem rodada.

### Twenty CRM: aba nomeada no layout de cada objeto

**Como resolve**
1. Cada objeto tem o próprio layout de página, feito de abas e widgets ([Twenty docs: Layout](https://docs.twenty.com/user-guide/layout/overview)).
2. Na tela, o admin adiciona, remove, reordena e redimensiona widgets e os arrasta entre abas, inclusive para uma aba vazia ([Twenty docs: Layout](https://docs.twenty.com/user-guide/layout/overview); [Twenty releases](https://twenty.com/releases)).
3. Os widgets citados são fields, related records, emails, timeline, calendar, tasks, notes, files, charts e iFrames ([Twenty docs: Layout](https://docs.twenty.com/user-guide/layout/overview)).
4. Em código, `definePageLayoutTab` cria a aba com título, posição, ícone e widgets, e o widget `RECORD_TABLE` mostra uma view salva com limite de registros ([Twenty docs: Page Layouts](https://docs.twenty.com/developers/extend/apps/layout/page-layouts)).
5. Notes e tasks são widgets internos, com editor que salva sozinho ([Twenty releases](https://twenty.com/releases)).

**URL:** https://docs.twenty.com/user-guide/layout/overview

**O que serve ao ENSPACE**
- É o modelo mais próximo da pasta configurável: o admin põe uma aba com nome e ícone no layout do tipo de registro, e todo registro daquele tipo ganha a aba.
- O widget de lista mora dentro da aba e herda o layout do objeto.

**O que não serve, e o motivo**
- A lista dentro da aba é de tasks ou de registros relacionados: cada entrada é um registro inteiro.
- As fontes lidas não citam estado de conferência, rodada nem contador.

### ClickUp: checklist com responsável e comentário atribuído

**Como resolve**

Pela checklist:
1. Na tarefa, a seção de checklists tem, em cada item, um ícone que atribui uma pessoa ([ClickUp: Use task checklists](https://help.clickup.com/hc/en-us/articles/6309942197783-Use-task-checklists)).
2. O item aceita até 5 níveis de sub-itens, se reordena arrastando e se move para outra checklist da mesma tarefa.
3. O botão de subtarefa converte 1 item ou a checklist inteira.

Pelo comentário atribuído:
1. O comentário, que já aceita texto rico e anexo, recebe um responsável e vira item de ação. A pessoa recebe aviso, e o comentário não resolvido aparece nas subtarefas, nas listas de tarefa e no Team view ([ClickUp: Assign comments](https://help.clickup.com/hc/en-us/articles/6311126397591-Assign-comments)).
2. O responsável marca "Resolve", e o nome de quem resolveu fica ao lado do visto.
3. A Home tem a página Assigned Comments, com a aba "Delegated by me" e o filtro de resolvidos ([ClickUp: View assigned comments](https://help.clickup.com/hc/en-us/articles/34489586379031-View-assigned-messages-and-comments)).

O Proofing anota imagem, vídeo e PDF ([ClickUp: Proofing](https://help.clickup.com/hc/en-us/articles/6325985679383-Annotate-images-videos-and-PDFs-with-Proofing)).

**URL:** https://help.clickup.com/hc/en-us/articles/6311126397591-Assign-comments

**O que serve ao ENSPACE**
- O comentário atribuído é o híbrido mais próximo do pedido: corpo rico, responsável, "Resolve" e o nome de quem resolveu.
- As visões "atribuídos a mim" e "delegados por mim" fora do registro.
- Converter em subtarefa com 1 clique, como saída para o apontamento que cresce.

**O que não serve, e o motivo**
- O item de checklist é 1 linha: não carrega print, vídeo nem a coleção do Postman, que são o motivo da demanda.
- O comentário atribuído fica no meio da conversa. A tarefa não mostra a lista ordenada dos apontamentos.
- Quem recebe o comentário também o resolve. Ninguém confere.
- O responsável do item de checklist só recebe aviso se ligou "Checklist items assigned to me" e segue a tarefa ([ClickUp: Use task checklists](https://help.clickup.com/hc/en-us/articles/6309942197783-Use-task-checklists)).

### monday: checklist dentro de uma Update

**Como resolve**
1. No item, a pessoa abre Updates, clica no campo, escolhe o ícone de checklist, escreve as linhas e clica em "Update". Os itens se marcam dentro da própria Update ([monday: The Updates Section](https://support.monday.com/hc/en-us/articles/115005900249-The-Updates-Section)).
2. A coluna nativa mais próxima é a Checkbox, com verdadeiro ou falso por item ([monday API: Checkbox](https://developer.monday.com/api-reference/reference/checkbox)).
3. O progresso em porcentagem ou contagem e a automação "checklist completa muda o status" vêm do app de terceiro Smart Checklist ([Smart Checklist: progress](https://smart-checklist-monday.helpscoutdocs.com/article/12-checklist-progress); [Titan Apps, fornecedor](https://titanapps.io/blog/monday-checklist-template)).
4. O Item Card, aberto em Updates > "Add View", junta as colunas do item num lugar só ([monday: The Item Card](https://support.monday.com/hc/en-us/articles/360017143959-The-Item-Card)).

**URL:** https://support.monday.com/hc/en-us/articles/115005900249-The-Updates-Section

**O que serve ao ENSPACE**
- O progresso visível fora do item, numa coluna do quadro.
- O gatilho "lista completa", que a comunidade pede há anos para a checklist nativa ([monday Community](https://community.monday.com/t/add-automation-to-update-status-based-on-checklists/2873)). No ENSPACE, vira gatilho do Spaceflow.

**O que não serve, e o motivo**
- A checklist mora num comentário: some no histórico, sem progresso no quadro nem automação nativa ([Titan Apps, fornecedor](https://titanapps.io/blog/monday-checklist-template)).
- O subitem, a alternativa rica, conta no limite de itens do quadro ([mondaywiki, terceiro](https://mondaywiki.com/monday-com-subitem-versus-items/)).
- O contador depende de app pago de terceiro.

### Pipefy: campo checklist com opções que o admin define

**Como resolve**
1. O admin cria o campo checklist, em `checklist_vertical` ou `checklist_horizontal`, no formulário inicial ou no da fase, com a lista de opções ([Pipefy developers: Fields](https://developers.pipefy.com/reference/fields)).
2. Nas configurações da fase, o lápis no campo abre "this field is required" ([Pipefy: Moving cards](https://help.pipefy.com/en/articles/614653-moving-cards-through-the-pipe)).
3. Card com campo obrigatório vazio não muda de fase.
4. Pela API, `createPhaseField` cria o campo na fase ([Pipefy developers: Create fields in a phase](https://developers.pipefy.com/reference/create-fields-in-a-phase)).

**URL:** https://help.pipefy.com/en/articles/614653-moving-cards-through-the-pipe

**O que serve ao ENSPACE**
- A lista que segura a etapa, como opção do admin.
- A configuração por tipo de registro, igual em todo card do pipe.

**O que não serve, e o motivo**
- As opções são fixas. Cada teste com itens diferentes exige mudar o formulário.
- O item não tem corpo, responsável nem estado próprio.
- Campo obrigatório na primeira fase quebra a automação que move o card ao criar ([Pipefy: My automation is not moving cards](https://help.pipefy.com/en/articles/2908614-my-automation-is-not-moving-cards-what-can-i-do)).

## As extras

### GitHub: task list, sub-issue e revisão de PR

**Como resolve**
1. Task list: cada linha `- [ ]` vira caixa de marcar na descrição; o item que cita outra issue se marca sozinho quando ela fecha; a lista de issues mostra "x of y tasks"; hover no item converte em issue ([GitHub Docs: About tasklists](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-tasklists)).
2. Sub-issue: "Create sub-issue" no fim da descrição, até 100 por pai e 8 níveis; os Projects mostram "Sub-issue progress" ([GitHub Docs: Adding sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues)).
3. Revisão de PR: o revisor escreve comentários "pending", que só ele vê; "Submit review" envia todos de uma vez com 1 veredito (Comment, Approve ou Request changes) e um resumo ([GitHub Docs: Reviewing proposed changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request)).
4. O autor ou quem tem escrita marca "Resolve conversation"; o filtro separa não resolvidas, resolvidas e desatualizadas ([GitHub Docs: Commenting on a PR](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request)).
5. Depois de corrigir, o autor clica no ícone de sincronizar ao lado do revisor e abre a rodada seguinte ([GitHub Docs: Requesting a review](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/requesting-a-pull-request-review)).
6. A regra "Require conversation resolution before merging" barra o merge com comentário aberto ([GitHub Docs: Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)).

**URL:** https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request

**Serve:** o rascunho do revisor com envio em lote e 1 aviso só; o veredito da rodada; o pedido de reteste com 1 clique; o contador "x of y"; a trava de avanço com apontamento aberto.

**Não serve:** a task list é 1 linha de texto, e o sub-issue é um registro por correção. O autor resolve a própria conversa, então o revisor não confere. O comentário de linha e a marca "Viewed" dependem de diff de código, que contrato e obra não têm.

### Linear: checklist na descrição que vira sub-issue

**Como resolve**
1. A checklist mora no texto da descrição; selecionar a lista e usar Cmd/Ctrl+Shift+O cria 1 sub-issue por linha ([Linear Docs: Parent and sub-issues](https://linear.app/docs/parent-and-sub-issues)).
2. O menu "…" do comentário cria "new sub-issue from comment".
3. A thread se resolve pela mensagem raiz ou por uma resposta, que fica destacada como a resolução ([Linear Docs: Comment on issues](https://linear.app/docs/comment-on-issues)).
4. O Triage aceita, recusa com motivo ou marca como duplicado antes do fluxo normal ([Linear Docs: Triage](https://linear.app/docs/triage)).

**URL:** https://linear.app/docs/parent-and-sub-issues

**Serve:** a resolução que aponta para a resposta de quem corrigiu; a recusa com motivo, para o executor que discorda do apontamento.

**Não serve:** os mesmos 2 extremos do GitHub, linha ou sub-issue. O fechamento automático do pai quando as filhas fecham não serve: o fim da rodada é decisão de quem testou.

### Jira: apps de checklist e Product Discovery

**Como resolve**
1. O app Smart Checklist (Railsware) dá a cada item um status: To Do, In Progress, Skipped e Done; o admin cria status próprio com nome, cor e estado "checked" ou "unchecked" ([Railsware: Custom Statuses](https://railsware.atlassian.net/wiki/spaces/CHK/pages/3495297056/Custom+Statuses)).
2. Desde a v6.7.0, o item pode ser obrigatório, e o validador "All mandatory items completed" barra a transição com a mensagem configurada ([Railsware: Validate mandatory items](https://railsware.atlassian.net/wiki/spaces/CHK/pages/3807641616/Validate+Mandatory+Items+Completion+on+Issue+Transition)).
3. No Jira Product Discovery, o "insight" é evidência ligada a uma ideia e se copia para várias ideias ([Atlassian: JPD insights](https://www.atlassian.com/software/jira/product-discovery/guides/insights/overview)).

**URL:** https://railsware.atlassian.net/wiki/spaces/CHK/pages/3495297056/Custom+Statuses

**Serve:** o status por item com nome livre e significado fixo (conta ou não conta como feito); o item obrigatório que trava a etapa. O mercado paga app para ter esse objeto, que o Jira nativo não tem.

**Não serve:** é app de terceiro, e o validador só existe no plano Pro. As próprias páginas da Railsware divergem sobre o estado do In Progress ([Railsware: Checklist items states](https://railsware.atlassian.net/wiki/spaces/CHK/pages/88866901/Checklist+items+states)).

### Asana: Proofing e Approvals

**Como resolve**
1. No Proofing, a pessoa clica num ponto da imagem anexada e escreve; cada comentário cria uma subtarefa atribuída a quem subiu a imagem ([Asana blog](https://blog.asana.com/2019/04/design-feedback-proofing/)).
2. Approval é um tipo de tarefa; "Request changes" e "Rejected" contam como concluída no back-end, e a equipe do Asana chamou isso de comportamento esperado ([Asana Forum](https://forum.asana.com/t/approvals-request-change-should-keep-the-task-incomplete/76962)).

**URL:** https://blog.asana.com/2019/04/design-feedback-proofing/

**Serve:** o feedback preso à evidência, como evolução da entrada.

**Não serve:** cada anotação vira subtarefa. O "pedir mudança" que fecha a tarefa mostra o erro a evitar: no ENSPACE, "Reaberto" mantém a entrada aberta.

### BugHerd: quadro de feedback do site

**Como resolve**
1. O cliente aponta, clica e comenta no site; o feedback cai num kanban com screenshot, navegador, sistema, resolução e elemento da página ([BugHerd Features](https://bugherd.com/features)).
2. As colunas são Feedback, Backlog, Todo, Doing, Done e Archive. Done quer dizer "feito, ainda não verificado pelo dono", e Archive guarda o que foi concluído ou fechado por outro motivo ([BugHerd: statuses](https://support.bugherd.com/en/articles/11430490-what-do-the-different-statuses-mean-for-my-tasks)).

**URL:** https://support.bugherd.com/en/articles/11430490-what-do-the-different-statuses-mean-for-my-tasks

**Serve:** o estado "feito, não verificado" nomeado; o Archive como fechamento sem correção.

**Não serve:** o kanban é separado do registro, o problema de cards a mais que a redatora já tem. A captura pelo widget só serve a quem testa site.

### Marker.io: o executor resolve, quem reportou reabre

**Como resolve**
1. Os status são Open, In Progress, Waiting for Approval, Resolved e Closed, sem ordem obrigatória; o admin renomeia "Waiting for Approval", que marca a vez do cliente, do QA ou do aceite final ([Marker.io blog](https://marker.io/blog/introducing-in-progress-and-waiting-for-approval-statuses)).
2. Done na ferramenta ligada vira Resolved e manda e-mail a quem reportou, que pode reabrir ([Marker.io 101](https://help.marker.io/en/articles/11588515-marker-io-101)).
3. O convidado acompanha o status pelo portal, mas não o muda; o pedido está aberto no fórum de ideias ([Marker.io feedback](https://feedback.marker.io/feature-request/p/allow-guest-to-change-feedback-status)).

**URL:** https://marker.io/blog/introducing-in-progress-and-waiting-for-approval-statuses

**Serve:** o estado de espera pela conferência; a reabertura por quem reportou; poucos campos por apontamento (prioridade, 1 responsável, tipo).

**Não serve:** o estado vive na ferramenta externa, e a própria doc se contradiz sobre a sincronização ser de 1 ou de 2 vias ([Marker.io: status sync](https://help.marker.io/en/articles/5096332-status-sync-in-marker-io); [Marker.io: Jira](https://help.marker.io/en/articles/6413986-jira-integration)). Isso cria 2 verdades.

### Jam e Userback: captura técnica e reabertura automática

**Como resolve**
1. O Jam anexa à issue do Linear console, rede, URL, dispositivo, navegador e viewport, com replay de até 2 minutos ([Jam docs: Linear](https://jam.dev/docs/linear)).
2. O Userback reabre o feedback resolvido quando quem reportou responde ([Userback: closing the loop](https://support.userback.io/en/articles/14012297-best-practices-for-closing-the-feedback-loop-with-userback)).

**Serve:** o contexto técnico como anexo da entrada; a resposta de quem reportou que reabre, como opção.

**Não serve:** a captura pressupõe site testado, o que jurídico e obra não têm.

### Figma: comentário preso ao canvas

**Como resolve**
1. O comentário fica preso a um ponto do canvas; a tecla C abre o modo comentário e a lista lateral, com filtros "Only your threads", "Show resolved" e "Only current page" ([Figma Help: comments](https://help.figma.com/hc/en-us/articles/360041547593)).
2. "Resolve" tira o comentário do canvas e da lista; desfazer exige ligar "Show resolved".

**Serve:** a lista lateral com filtros prontos.

**Não serve:** o resolvido some e perde o rastro do reteste. O fórum pede para ver quem resolveu e quando ([Figma forum](https://forum.figma.com/ask-the-community-7/view-who-resolved-a-comment-and-when-11396)).

### Frame.io, Filestage e Ziflow: comentário como to-do e decisão da versão

**Como resolve**
1. Frame.io: "Mark As Complete" no comentário aplicado; a lista ordena por Completed, esconde ou mostra só os concluídos e exporta em CSV, XML, texto ou FIOJSON respeitando o filtro; "Copy Link" leva ao comentário ([Frame.io Help: Comments panel](https://help.frame.io/en/articles/9105278-comments-panel-overview)).
2. Filestage: a lista de comentários funciona como to-do interno; o revisor fecha a revisão com Aprovar ou Pedir mudanças; nova versão não apaga a anterior; o relatório sai em PDF por versão ou do arquivo inteiro ([Filestage: to-do list](https://help.filestage.io/en/articles/3641608-use-the-to-do-list); [Filestage: verify feedback](https://help.filestage.io/en/articles/9113215-how-to-verify-that-everyone-s-feedback-has-been-met)).
3. Ziflow: decisões Approved, Approved with changes, Changes required, Not relevant e Decision pending; 1 Changes required deixa a etapa inteira em Changes required ([Ziflow: decision calculation](https://help.ziflow.com/hc/en-us/articles/38343701869204)).
4. Ziflow: checklist do admin, no plano Enterprise, em que o revisor dá Passed ou Failed por item; o blog argumenta que caixa desmarcada não distingue discordância de esquecimento ([Ziflow blog: checklists](https://www.ziflow.com/blog/introducing-checklists-more-creative-reviews)).

**URL:** https://help.filestage.io/en/articles/9113215-how-to-verify-that-everyone-s-feedback-has-been-met

**Serve:** a decisão da rodada calculada dos vereditos; o veredito ativo Passou ou Falhou no reteste; o PDF da rodada; o link direto para 1 apontamento; a exportação que respeita o filtro.

**Não serve:** o comentário se prende a pixel ou timecode de 1 arquivo. O to-do do Filestage é invisível ao revisor, e quem corrige e quem confere precisam ver o mesmo estado.

### Procore: punch list com 3 papéis e 2 portões

**Como resolve**
1. O item nasce Draft (criado por outro) ou Initiated (criado pelo gestor); o gestor contesta (In Dispute) ou envia aos responsáveis (Work Required) ([Procore FAQ: Punch List Workflow](https://v2.support.procore.com/faq-what-is-the-punch-list-work-flow)).
2. Cada responsável responde: Work Required, Ready for Review, Work Not Accepted ou Resolved. O item vai a Ready to Close quando o gestor resolve todas as respostas, e o Final Approver fecha ou devolve.
3. O "Ball in Court" mostra de quem é a vez, com banner no item e no e-mail ([Procore: Punch List Emails](https://v2.support.procore.com/product-manuals/punch-list-project/tutorials/about-punch-list-emails)).
4. O item recebe foto pela câmera, cria-se em massa por planilha XLSX e exporta em PDF ([Procore: Import](https://v2.support.procore.com/product-manuals/punch-list-project/tutorials/import-punch-list-items); [Procore: Export PDF](https://v2.support.procore.com/product-manuals/punch-list-project/tutorials/export-a-punch-list-item-as-a-pdf)).

**URL:** https://v2.support.procore.com/faq-what-is-the-punch-list-work-flow

**Serve:** "com quem está" calculado pelo estado; o atraso que conta só enquanto a vez é do responsável; a criação em massa.

**Não serve:** 9 status, resposta por responsável e 2 portões foram feitos para obra com subempreiteiros e aceite contratual. Num escritório de advocacia, isso é burocracia.

### Fieldwire: punch na planta e relatório por público

**Como resolve**
1. Os status padrão são Priority 1, 2 e 3, Completed e Verified; desde 2020-11-30 o admin cria status com cor, tipo e ordem ([Fieldwire: custom statuses](https://www.fieldwire.com/blog/fieldwire-announces-custom-task-statuses/)).
2. A construtora marca Completed, e o arquiteto ou o dono marca Verified ([Fieldwire: punch lists](https://www.fieldwire.com/blog/use-fieldwire-to-manage-punch-lists/)).
3. O relatório "PDF Detailed" filtra por categoria e status, liga ou desliga fotos e mensagens e serve a cada público: abertas para o subempreiteiro, concluídas para o arquiteto, verificadas para o cliente ([Fieldwire: punch list report](https://www.fieldwire.com/blog/create-punch-list-report/)).

**URL:** https://www.fieldwire.com/blog/create-punch-list-report/

**Serve:** a verificação em 2 passos; o PDF filtrado por estado para cada destinatário, que substitui o Word.

**Não serve:** a prioridade como status impede ver, ao mesmo tempo, o que está aberto e o que é urgente. O pino na planta só serve à obra.

### Autodesk Build: 1 objeto Issue para todo uso

**Como resolve**
1. O admin escolhe os status de cada projeto, e o mesmo fluxo serve a punch list, segurança e coordenação ([Autodesk: Issue Statuses](https://help.autodesk.com/cloudhelp/ENU/Build-Issues/files/create-issues/Issues_Statuses.html)).
2. Item com campo obrigatório vazio fica em Draft até o campo ser preenchido ([APS](https://aps.autodesk.com/node/2756)).
3. Criador, responsável e admin mudam o status; só criador, dono e admin fecham ([Autodesk: Issues in Document Management](https://help.autodesk.com/cloudhelp/ENU/BIM360D-Document-Management/files/To-Work-with-Document-Management/GUID-2E10E17D-D814-4357-AD94-7AD10B1B55D4.html)).

**Serve:** um tipo único para vários usos, com status escolhidos por projeto; a regra "quem fecha é quem abriu".

**Não serve:** a issue é registro próprio na ferramenta de obra, não uma lista dentro de outro registro.

### SafetyCulture (Mitti): ação que nasce da pergunta da inspeção

**Como resolve**
1. A ação nasce de uma pergunta e herda a foto e a nota da resposta; "Open actions" vincula uma ação aberta de outra inspeção em vez de duplicar ([Mitti Help 000082](https://help.mitti.com/en-US/000082)).
2. Os status ficam em 2 grupos, aberto (To Do, In Progress) e fechado (Complete, Can't Do), com nomes renomeáveis, transição restrita por grupo e atualização em lote de até 100 ações ([SafetyCulture Help 001812](https://help.safetyculture.com/en-US/001812)).

**URL:** https://help.safetyculture.com/en-US/001812

**Serve:** o par fixo aberto e fechado sob nomes livres; o "Can't Do" como fechamento sem correção; a ação em lote.

**Não serve:** a conferência do inspetor não é status nativo e costuma ser uma nova inspeção. A ação obrigatória por lógica gera inspeção incompleta ou ação duplicada ([Community idea 476](https://community.safetyculture.com/ideas/multiple-action-items-created-for-1-question-and-scoring-476)).

### TestRail, Qase e Xray: resultado por caso, defeito à parte

**Como resolve**
1. TestRail: status Passed, Blocked, Untested, Retest e Failed; cada resultado entra como linha nova no histórico do caso, e nada se sobrescreve ([TestRail: statuses](https://support.testrail.com/hc/en-us/articles/7077935129364); [TestRail: Submitting results](https://support.testrail.com/hc/en-us/articles/15813183376148)).
2. TestRail: "Rerun" abre nova execução só com os status escolhidos, por exemplo Failed e Retest ([TestRail: Rerunning](https://support.testrail.com/hc/en-us/articles/16081372340628-Rerunning-test-cases)).
3. Qase: marcar Failed abre "Create/attach defect"; o defeito fica no projeto mesmo se a execução for apagada ([Qase: Defects](https://docs.qase.io/general/issues/defects)).
4. Xray: 1 passo em FAIL deixa a execução inteira em FAIL, e o defeito se liga à execução ou ao passo ([Xray: Test Runs](https://confluence.getxray.app/display/XRAY/Test+Runs)).

**URL:** https://support.testrail.com/hc/en-us/articles/15813183376148

**Serve:** o histórico do reteste como linha nova; a rodada seguinte que repete só o que falhou.

**Não serve:** o modelo pede uma biblioteca de casos de teste por trás. "Pendências do contrato" não tem caso, só o achado. No Xray, o print e o resultado obtido não passam para o defeito por padrão, segundo o fórum ([Atlassian Community](https://community.atlassian.com/forums/Jira-questions/Why-Xray-is-not-pulling-comments-actuals-and-evidence-when/qaq-p/1615618)).

### CLMs (Ironclad): pendência como comentário no redline

**Como resolve**
1. A Ironclad recomenda marcar as questões internamente antes de devolver o redline, para evitar rodadas a mais; os comentários se atribuem a colegas, e com tudo aprovado sai a versão limpa ([Ironclad: contract redlining](https://ironcladapp.com/journal/contracts/contract-redlining/)).

**Serve:** a lógica do rascunho interno antes do envio, igual à do PR.

**Não serve:** a lista de pendências não é estruturada com estado; ela fica nos comentários do documento.

## O padrão que todos seguem

| Padrão | Quem faz assim |
|---|---|
| A lista tem 2 formas: linha de checklist ou registro inteiro | GitHub, Linear, ClickUp, monday, Pipefy, Notion, Shortcut |
| O apontamento se prende a uma âncora: linha de código, pixel, timecode, ponto da planta, pergunta, caso de teste | GitHub, Figma, Frame.io, Fieldwire, SafetyCulture, TestRail |
| Na revisão de arquivo, o estado do comentário é binário (feito ou não); a nuance vai para a decisão da versão | Figma, Frame.io, Filestage, Ziflow |
| Os status se dividem em aberto e fechado, com nomes renomeáveis | SafetyCulture, Smart Checklist, Fieldwire, Autodesk, Marker.io |
| Na obra, quem corrige não fecha; no software, quem corrige costuma resolver | Procore, Fieldwire, Autodesk; GitHub, ClickUp, Figma |
| O apontamento que cresce vira registro por 1 clique | GitHub, Linear, ClickUp, Shortcut, Qase |
| A lista tem filtros por estado e pessoa e esconde os resolvidos | Figma, Frame.io, GitHub, ClickUp |
| A rodada, quando existe, é versão do arquivo, execução nova ou pedido de nova revisão | Filestage, Ziflow, TestRail, GitHub |

O mercado escolhe entre leveza e riqueza. Quem quer o apontamento leve aceita a linha de texto. Quem quer o apontamento rico aceita um registro por correção. O GitHub testou o objeto intermediário e o tirou do ar em 2025-04-30, trocando-o por sub-issues ([GitHub Changelog](https://github.blog/changelog/2025-02-18-github-issues-projects-february-18th-update/)). O motivo da aposentadoria não aparece na fonte. O ENSPACE precisa de uma razão clara para o objeto intermediário existir: a pasta guarda o retorno, e a tarefa continua sendo o lugar do trabalho.

## O que nenhum deles faz

- **Entrada rica dentro do registro sem virar registro.** O mais perto é o comentário atribuído do ClickUp, mas ele fica solto na conversa, sem lista própria na tarefa.
- **Tipo de pasta que o admin põe em qualquer categoria.** O Twenty põe aba no layout do objeto, mas a lista é de tasks. O Pipefy põe campo na fase, mas com opções fixas.
- **Rodada como atributo da entrada.** A mesma entrada atravessa as rodadas 1, 2 e 3, com o veredito de cada uma no histórico. O TestRail guarda o histórico por caso, e o Ziflow leva o checklist do admin entre versões; nenhum faz isso com entrada livre.
- **Contador por estado.** O GitHub mostra "x of y tasks" e o Smart Checklist mostra porcentagem, só entre feito e total. Nenhuma fonte mostra abertos, aguardando conferência, conferidos e descartados lado a lado.
- **Corrigido separado de conferido numa ferramenta de uso geral.** A obra separa, com fluxo pesado. O Marker.io nomeia a espera, mas o convidado não aprova nem reabre pelo portal.
- **Envio da rodada em lote fora do código.** Só a revisão de PR do GitHub junta os apontamentos num rascunho e os envia com 1 veredito e 1 aviso.
- **Evidência que acompanha a correção.** No Xray, o print fica para trás quando o defeito nasce do passo.
- **PDF da rodada em qualquer tipo de registro.** O Fieldwire e o Filestage fazem, cada um no próprio nicho.

Cada peça existe em algum produto. A chance do ENSPACE é juntar as 8 numa pasta só, igual para o retorno de teste, as pendências do contrato e os achados de auditoria.

## Nome do tipo de pasta

| Nome | Prós | Contras |
|---|---|---|
| **Apontamentos** | Neutro entre QA ("apontamentos do teste"), auditoria, jurídico ("apontamentos da minuta") e obra ("apontamentos da vistoria"). Diz que alguém apontou e outra pessoa resolve | Em algumas empresas, "apontamento" é registro de horas. Pede descrição curta no catálogo de pastas |
| **Pendências** | Tradução corrente de punch list e termo comum no onboarding. Leigo entende na hora | Não diz que alguém confere. Colide com "tarefa pendente" do próprio ENSPACE |
| **Achados** | Termo de auditoria e QA (finding). Diz que a entrada veio de uma inspeção | Soa técnico para contrato e onboarding. Não cobre a correção |
| **Ressalvas** | Usado no aceite de obra e no parecer jurídico ("aceite com ressalvas") | Registro formal demais. Pouco usado em software |
| **Retornos** | É o termo que o time já usa ("retorno de testes") | Preso ao QA. Em jurídico e obra, "retorno" lembra resposta ao cliente, não lista a corrigir |

**Recomendação:** tipo de pasta "Apontamentos", com a descrição "lista do que uma revisão encontrou, com responsável, conferência e rodadas". O admin dá o nome da pasta em cada categoria: "Retorno de teste", "Pendências do contrato", "Achados de auditoria". Assim o termo técnico fica no catálogo, e a pessoa vê na tela o nome da área dela. A escolha é inferência dos termos usados nas fontes; nenhum nome passou por teste com usuários.

## O que isto pede ao protótipo

- **Ciclo de estados:** 4 significados fixos, com nome editável pelo admin, como no SafetyCulture.
  - Aberto: a vez é do responsável.
  - Corrigido: a vez é de quem apontou, que confere.
  - Conferido: fechado, conta como resolvido.
  - Descartado: fechado sem correção, com motivo obrigatório, fora da conta de pendentes.
  - "Reaberto" é a volta de Corrigido para Aberto, registrada no histórico com o comentário ou o print da recusa.
- **Quem marca o quê:**
  - o responsável leva a entrada a Corrigido, com comentário opcional do que fez;
  - só quem apontou (ou o verificador que o admin define) leva a Conferido ou devolve a Aberto;
  - o responsável que discorda pede o descarte com motivo, e quem apontou confirma;
  - cada transição guarda quem e quando;
  - "com quem está" sai do estado, como o "Ball in Court" do Procore;
  - atribuir avisa sempre, sem depender de seguir o registro.
- **Rodadas:**
  - a rodada é atributo da entrada, nunca cópia;
  - "Pedir reteste" fecha a rodada N do lado do responsável e abre a N+1, que mostra primeiro o que está Corrigido;
  - no reteste, cada entrada recebe veredito ativo (Passou ou Falhou), como no Ziflow; caixa vazia não vale como reprovação;
  - a lista agrupa por rodada, e a rodada mostra a decisão calculada: 1 Falhou reprova a rodada.
- **Contador:**
  - no cabeçalho da pasta e na aba: "8 de 12 conferidos", com a conta por estado;
  - numa coluna opcional da listagem da categoria.
- **Envio em lote:**
  - quem testa escreve as entradas em rascunho, que só ele vê;
  - "Enviar rodada" publica todas com um resumo e manda 1 aviso aos responsáveis.
- **Saída em PDF:**
  - PDF da pasta filtrado por estado e por rodada, com imagens, referência e histórico, no lugar do .docx;
  - CSV como segunda opção, respeitando o mesmo filtro.
- **Converter em tarefa como saída:**
  - botão na entrada que cria a tarefa e mantém o vínculo, com o estado da tarefa visível na entrada;
  - a entrada continua na pasta; o padrão é não converter.
- **Configuração pelo admin:**
  - adicionar o tipo "Apontamentos" à categoria e à tarefa, com nome e ícone;
  - renomear os estados sem mudar o significado;
  - ligar campos opcionais: prioridade, prazo, referência (tela, cláusula, local);
  - modelo de lista para cliente de obra e jurídico, e colar várias linhas de uma vez;
  - trava opcional: o registro não avança de status com entrada aberta;
  - gatilho do Spaceflow "todos os apontamentos conferidos".
- **Entrada:** título curto, corpo rico (texto, imagem colada, vídeo por link, arquivo como a coleção do Postman), autor, responsável, rodada de origem e link direto para a entrada.

## Lacunas da pesquisa

- Não há prints das referências; tudo vem de texto das fontes.
- Os help centers do ClickUp, do monday, do Pipefy e do Asana devolveram 403, 404 ou página vazia ao WebFetch; o que vem deles saiu do trecho da busca que cita o artigo oficial.
- ClickUp: não confirmei se o item de checklist aceita prazo ou anexo próprio, nem se o comentário atribuído aceita mais de 1 responsável ou reabre depois de resolvido.
- Asana: não li o help oficial de Approvals e Proofing; estados e plano vêm do blog e do fórum.
- Notion: não confirmei em fonte oficial o comportamento do bloco de to-do; Sub-items e o padrão de view linkada vêm de terceiros.
- Twenty: não confirmei se o admin cria e renomeia aba pela tela, sem código, nem os campos exatos da task.
- Pipefy: não li as Connections nem as checklists de fase.
- Xray: a página oficial de reteste recusou conexão.
- Smart Checklist: não confirmei anexo por item.
- Procore: não confirmei o PDF da lista inteira nem os campos obrigatórios por padrão.
- Fieldwire: as fontes são blog e marketing do fornecedor; não li o help center.
- Autodesk Build: a lista atual de status está em imagem na página oficial.
- Frame.io: não confirmei como "Mark As Complete" se comporta entre versões.
- Marker.io e BugHerd: não confirmei contador de progresso no portal nem permissão por papel em cada transição.
- Não pesquisados: Lumiform, GoAudits, Ruttl, Usersnap, Loom, Plane, Zephyr, Juro, Litera e DocuSign CLM.
- Nenhuma fonte mede quantos apontamentos uma rodada real tem, nem se a separação entre Corrigido e Conferido pesa para equipe pequena.
- Os 5 nomes não passaram por teste com usuários, e não medi volume de busca de "apontamentos" contra "pendências".

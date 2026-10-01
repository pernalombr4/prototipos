# Pesquisa: importar estrutura num workspace que já tem conteúdo

Esta rodada não tem print das referências: a pesquisa foi feita só por busca e leitura de documentação (2026-10-01).

**Pergunta:** como cada produto aplica uma estrutura, um modelo ou uma configuração num espaço que já tem conteúdo, com escolha do que fazer no conflito e prévia das mudanças.

**Pontos observados em cada referência:**

- nome dos modos (criar só novos, atualizar existentes, substituir);
- como o produto reconhece "o mesmo item" (chave, nome, id);
- como mostra a prévia (contagem, lista, árvore);
- se pede confirmação extra para apagar;
- se oferece backup ou desfazer.

**Resumo em tabela:**

| Produto | O que importa | Modos | Chave do "mesmo item" | Prévia | Trava para apagar | Desfazer |
|---|---|---|---|---|---|---|
| Notion | linhas de CSV; template inteiro | só adicionar | nenhuma | não | não se aplica | histórico da página (fonte de terceiros) |
| Twenty | registros (CSV); objetos e campos (app) | criar e atualizar; `--no-delete`; padrão apaga | campo único; `universalIdentifier` | plano com add/change/destroy | confirmação ou `--force` | não |
| ClickUp | template de Space, Folder, List | importar tudo ou escolher itens | nenhuma | não | não se aplica | não confirmado |
| Monday | linhas de Excel; template de board | Add as new items, Skip, Update | coluna escolhida | não confirmado | não se aplica | não confirmado |
| Pipefy | linhas de planilha; pipe inteiro | só criar | nenhuma | não | não se aplica | não |
| Directus | esquema e configuração | `add`, `merge`, `mirror` | nome; mapa de ids; campos de identificação | plano com +, ~, DELETE e contagem | digitar o nome do perfil | não (versionar os arquivos) |
| Airtable | linhas de CSV; template de base | adicionar ou mesclar | campo de mescla | contagem de novos, alterados e sem mudança | não se aplica | snapshot da base |
| HubSpot | registros | Create and update, Create only, Update only | Record ID, e-mail, domínio | não confirmado | não se aplica | filtrar por importação e excluir |
| Salesforce | metadados (change set) | só adicionar ou alterar | nome do componente | lista de componentes; Validate | change set não apaga | não; falha reverte tudo |
| Strapi (Config Sync) | configuração | importar ou exportar, total ou parcial | nome da configuração | tabela de diferenças e diff por item | não confirmado | não confirmado |

---

## Notion

**Como resolve:**

1. Para acrescentar linhas numa database, a pessoa abre a database em página inteira.
2. Clica no menu `••` e escolhe **Merge with CSV**.
3. Associa cada coluna do CSV a uma propriedade da database.
4. O Notion cria uma linha nova para cada linha do CSV.
5. Linhas que já existem não são atualizadas. O próprio Notion avisa para tomar cuidado com duplicatas.
6. Para usar um template, a pessoa clica em **Duplicate** na página pública.
7. Escolhe o workspace e o local (páginas privadas ou um teamspace).
8. O Notion cria uma cópia nova. Não existe aplicar template sobre páginas que já existem.

**URL:**

- https://www.notion.com/help/import-data-into-notion
- https://www.notion.com/help/finding-templates-on-marketplace
- https://www.notion.com/help/start-with-a-template
- https://theorganizednotebook.com/blogs/blog/how-to-import-merge-export-csv-files-notion (desfazer pelo histórico da página; fonte de terceiros, não confirmado na doc oficial)

**Serve para o ENSPACE:**

- A associação de colunas antes de importar. O ENSPACE pode mostrar "categoria do arquivo → categoria do workspace" do mesmo jeito.
- O aviso explícito de que o modo só acrescenta e pode duplicar. É o problema atual do ENSPACE dito em voz alta.

**Não serve:**

- Não reconhece o que já existe. Repete o defeito que o ENSPACE quer corrigir.
- Não mostra prévia antes de gravar.
- O template sempre vira cópia nova; não ensina nada sobre aplicar por cima.

---

## Twenty CRM

**Como resolve (registros, pela tela):**

1. A pessoa abre o objeto (Pessoas, Empresas), clica no menu `⋮` e escolhe **Import records**.
2. Envia o arquivo (CSV, XLSX ou XLS).
3. O código tem 6 etapas: enviar, escolher aba, escolher linha de cabeçalho, associar colunas, validar, importar.
4. Na etapa de validação, a tela pinta de amarelo as linhas com erro e as duplicadas dentro do próprio arquivo.
5. A pessoa corrige ou remove essas linhas na própria tela.
6. Ao importar, o Twenty procura cada linha pelos campos únicos: `id` e `email` em Pessoas, `id` e `domain` em Empresas, só `id` em objetos customizados.
7. Achou: atualiza. Não achou: cria.
8. Se o valor bate com um registro na lixeira, o Twenty restaura esse registro com os dados novos.

**Como resolve (objetos e campos, pela linha de comando de apps):**

1. O desenvolvedor descreve objetos, campos e telas num manifesto.
2. `yarn twenty plan` calcula e mostra a diferença sem gravar nada.
3. O plano lista um bloco por entidade e fecha com um resumo, no formato "2 to add, 1 to change, 1 to destroy".
4. `yarn twenty apply` aplica a diferença.
5. O padrão apaga do workspace tudo o que o app criou e o manifesto não declara mais, inclusive tabelas com dados.
6. Mudança destrutiva pede confirmação; `--force` pula a confirmação.
7. `--no-delete` torna a aplicação só de acréscimo: cria e atualiza, nunca apaga.
8. Cada entidade tem um `universalIdentifier`. Esse id é o mesmo em todos os workspaces e reconhece "o mesmo objeto" entre eles.

**URL:**

- https://docs.twenty.com/user-guide/data-migration/overview
- https://docs.twenty.com/user-guide/data-migration/capabilities/uniqueness-constraints
- https://docs.twenty.com/user-guide/data-migration/how-tos/import-contacts-via-csv
- https://docs.twenty.com/developers/extend/apps/operations/sync-and-recovery
- https://github.com/twentyhq/twenty/pull/11283 (upsert por qualquer campo único)
- https://github.com/twentyhq/twenty/tree/main/packages/twenty-front/src/modules/spreadsheet-import/steps/components (as 6 etapas)

**Observação:** a página de visão geral da migração diz que a importação só cria. A página de unicidade e o código dizem que ela atualiza quando o campo único bate. A versão do código é a mais recente.

**Serve para o ENSPACE:**

- O resumo "a adicionar, a alterar, a remover" em uma linha antes de aplicar.
- Separar 2 decisões: atualizar ou não, e apagar ou não. `--no-delete` é o modo 2 do ENSPACE (mesclar).
- A validação que marca os problemas na própria lista, antes de gravar.
- Um id estável que atravessa workspaces. No ENSPACE, o .json exportado precisa de um identificador que sobreviva à importação; sem ele, a única chave é o nome.

**Não serve:**

- O plano de objetos e campos é texto de terminal para desenvolvedor. A pessoa leiga do ENSPACE não lê esse formato.
- A restauração silenciosa de item da lixeira surpreende quem não sabe que ele estava lá.
- O Twenty não exporta a configuração do modelo de dados pela tela. Não existe o par Exportar/Importar que o ENSPACE já tem.
- A importação pela tela não mostra quantas linhas vão atualizar e quantas vão criar (o próprio PR diz que a tela ainda não faz isso).

---

## ClickUp

**Como resolve:**

1. Para criar um Space a partir de template, a pessoa clica no `+` ao lado do Space, escolhe **Templates** e o template.
2. Escolhe **Import everything** (tudo como está) ou **Customize import items** (marca e desmarca o que entra).
3. Os itens marcáveis são tarefas, propriedades de tarefa, campos customizados, visualizações e automações.
4. Escolhe as datas: **Import as is** ou **Remap Dates**.
5. Escolhe tarefas arquivadas: não incluir, incluir arquivadas, incluir e desarquivar.
6. Clica em **Use Template**.
7. Template de List e de Folder pode ser aplicado numa List ou Folder que já existe. O conteúdo do template entra junto do que já está lá.
8. Template de Space cria um Space novo. A comunidade pede há anos aplicar template num Space existente.
9. O importador de planilha sempre cria tarefas novas. Importar o mesmo arquivo 2 vezes duplica tudo.

**URL:**

- https://help.clickup.com/hc/en-us/articles/6309379377303-Use-Space-templates
- https://help.clickup.com/hc/en-us/articles/6308883440407-Use-List-templates (leitura direta bloqueada, HTTP 403; conteúdo confirmado pelo trecho da busca)
- https://help.clickup.com/hc/en-us/articles/6308752167319-Use-Folder-templates
- https://feedback.clickup.com/feature-requests/p/apply-template-to-an-existing-list-folder-or-space
- https://feedback.clickup.com/feature-requests/p/bulk-upload-to-update-existing-tasks-via-excel

**Serve para o ENSPACE:**

- A escolha por tipo de item antes de importar ("Customize import items"). O ENSPACE pode deixar desmarcar, por exemplo, modelos de e-mail ou relatórios.
- O padrão é "importar tudo"; a escolha fina fica um nível abaixo.

**Não serve:**

- Aplicar sobre o existente só acrescenta. O ClickUp não reconhece o que já existe nem avisa da duplicata.
- Não há prévia do resultado.
- O que acontece com campos de mesmo nome ao aplicar numa List existente não está documentado (não confirmado).

---

## Monday

**Como resolve (importar linhas num board que já existe):**

1. A pessoa clica na seta ao lado de **New item** e escolhe **Import items**.
2. Arrasta o Excel ou CSV para a área de envio, ou clica em **Browse**.
3. Na etapa **Set duplicate behavior**, escolhe o que fazer com linhas que batem com itens do board.
4. **Add as new items:** cria um item para cada linha. É o padrão.
5. **Skip:** pula as linhas que já existem.
6. **Update:** sobrescreve os itens existentes com os dados do arquivo.
7. Em Skip e Update, a pessoa escolhe a coluna que define "o mesmo item" (por exemplo e-mail ou telefone).

**Como resolve (estrutura):**

1. **Duplicate board** oferece 3 níveis: **Structure only**, **Structure and items**, **Structure, items and updates**.
2. Duplicar sempre cria um board novo.
3. **Managed templates** liga boards criados a partir de um modelo ao modelo de origem.
4. A pessoa edita o modelo e clica em **Publish**; as mudanças suportadas chegam a todos os boards ligados.
5. A publicação leva uma nota de versão, que aparece como discussão em cada board.
6. Aplicar um template num board que já existe não é nativo. A comunidade usa apps de terceiros (não confirmado na doc oficial).

**URL:**

- https://support.monday.com/hc/en-us/articles/360000219209-Import-files-from-Excel (leitura direta bloqueada, HTTP 403; nomes das opções confirmados pelo trecho da busca)
- https://monday.com/blog/product/custom-automation-advancements-excel-import-updates-and-more/
- https://support.monday.com/hc/en-us/articles/360000304399-How-to-duplicate-a-board
- https://support.monday.com/hc/en-us/articles/18229256953234-Managed-templates-on-monday-com (leitura direta bloqueada, HTTP 403; conteúdo pelo trecho da busca)
- https://community.monday.com/t/apps-for-copying-board-structure-to-existing-boards/65699

**Serve para o ENSPACE:**

- 3 opções com nomes curtos e verbos diretos: adicionar como novo, pular, atualizar. É o mesmo trio que o ENSPACE precisa.
- O padrão seguro vem marcado.
- A nota de versão do Managed templates: o ENSPACE pode guardar "quem importou, quando, qual arquivo" no workspace.

**Não serve:**

- A pessoa escolhe a coluna de comparação. Na estrutura do ENSPACE quem escolhe a chave é o sistema; a pessoa leiga não sabe o que é chave.
- Não há modo "substituir tudo".
- Prévia e desfazer não confirmados.

---

## Pipefy

**Como resolve:**

1. O **Importer** fica em **Tools > Apps > Importer**.
2. A pessoa escolhe o destino: o pipe atual ou uma tabela de database conectada.
3. Arrasta um .xlsx e associa cada coluna a um campo do formulário.
4. Clica em **import cards**.
5. O Pipefy cria um card novo para cada linha. Não atualiza card existente.
6. Um e-mail confirma o fim da importação.
7. A associação de colunas pode ser salva para a próxima importação.
8. Para copiar a estrutura, a pessoa usa **Duplicate this pipe** (mesma empresa) ou **Clone to** (outra empresa).
9. O clone leva fases, campos, automações, campos condicionais e modelos de e-mail.
10. O clone não leva cards conectados nem campos de conexão; automações que dependem deles quebram.
11. O pipe novo recebe "(Copy 1)" no nome. O clone nunca se mescla a um pipe existente.

**URL:**

- https://help.pipefy.com/en/articles/2446394-how-to-import-data-from-spreadsheets
- https://help.pipefy.com/en/articles/2908494-how-to-clone-a-pipe
- https://community.pipefy.com/news-announcements-49/pipefy-enables-users-to-create-a-copy-of-a-pipe-inside-a-company-or-across-companies-959
- https://api-docs.pipefy.com/reference/mutations/clonePipes/

**Serve para o ENSPACE:**

- A lista explícita do que vai e do que não vai no clone. O ENSPACE pode mostrar "o arquivo não traz itens nem usuários" antes de importar.
- O aviso de que algo quebra depois (automação ligada a campo de conexão). O ENSPACE tem o mesmo risco com fluxos e campos de relacionamento.
- O sufixo "(Copy 1)" marca a cópia. Serve como comportamento do modo 3 quando o nome já existe e a pessoa escolhe criar mesmo assim.

**Não serve:**

- Não há aplicar sobre o existente. Clonar sempre cria um pipe novo.
- Não há prévia nem desfazer.
- O Pipefy não tem arquivo de exportação de estrutura pela tela (não confirmado nesta rodada; só a API `clonePipes`).

---

## Directus

**Como resolve (API de esquema):**

1. `GET /schema/snapshot` gera a foto do modelo de dados: coleções, campos e relações.
2. `POST /schema/diff` compara essa foto com o projeto de destino e devolve a diferença.
3. A diferença vem em 4 grupos: coleções, campos, campos de sistema e relações.
4. Cada mudança traz um código: `N` (novo), `E` (editado), `D` (removido).
5. O modo padrão é `mirror`: o destino fica igual ao arquivo, inclusive removendo o que o arquivo não tem.
6. `mode: merge` gera uma diferença só de acréscimo, sem remoções.
7. A diferença leva um hash do esquema de destino. Se o destino mudar entre a comparação e a aplicação, o Directus recusa e pede nova comparação.
8. `POST /schema/apply` aplica só as operações da diferença.
9. Uma foto parcial deixa intacto tudo o que está fora dela.
10. Só administrador acessa esses endereços.

**Como resolve (Environment Sync, esquema e configuração):**

1. O Directus sincroniza esquema e configuração (fluxos, papéis, permissões, ajustes, traduções). Usuários só entram se a pessoa pedir.
2. Os modos se chamam `add`, `merge` e `mirror`.
3. `add`: cria; nunca atualiza o que existe; nunca apaga.
4. `merge` (padrão): cria e atualiza; nunca apaga.
5. `mirror`: cria, atualiza e apaga.
6. Para reconhecer "o mesmo registro", o Directus consulta primeiro um mapa de ids de aplicações anteriores (`id_map.json`).
7. Sem mapa, usa um campo de identificação: `name` para papéis, `name` + pasta para fluxos, `email` para usuários.
8. Quando há ambiguidade, pergunta à pessoa no terminal e recusa na automação. A doc diz que ambiguidade "is never resolved by guessing".
9. Antes de aplicar, mostra o plano: `+` adicionado, `~` alterado, `DELETE` removido, e o resumo "+N new ~N updated ✖N deleted".
10. Aplicar pede confirmação. `--yes` pula a confirmação, mas nunca autoriza remoção.
11. Remover exige um consentimento à parte: digitar o nome do perfil de destino, ou passar `--dangerously-allow-delete`.
12. Não há backup nem desfazer embutido. A recomendação é versionar os arquivos.

**URL:**

- https://directus.com/docs/api/schema
- https://directus.com/docs/tutorials/migration/promoting-changes-between-environments-in-directus
- https://directus.com/docs/guides/environment-sync/how-it-works
- https://directus.com/docs/guides/environment-sync/reference

**Serve para o ENSPACE:**

- Os 3 modos são os 3 modos da proposta, com a mesma lógica: `add` = só adicionar o novo; `merge` = mesclar; `mirror` = substituir tudo.
- O padrão é o modo do meio (mesclar), nunca o destrutivo.
- O plano em 3 grupos com contagem no topo: novos, alterados, removidos.
- A confirmação de remoção separada da confirmação de aplicar. Digitar o nome do workspace é o gesto equivalente para o modo 1.
- A regra "ambiguidade não se resolve no chute": se 2 categorias têm o mesmo nome, a tela pergunta.
- O hash que invalida a prévia se o workspace mudou depois da comparação.
- O mapa de ids: o ENSPACE pode guardar "categoria X do arquivo = categoria Y deste workspace" para a próxima importação.

**Não serve:**

- Tudo é API ou terminal. O plano é texto com símbolos; a pessoa leiga precisa de nomes e ícones.
- Não há backup. Para o ENSPACE, o modo 1 sem backup é arriscado demais para quem não é técnico.

---

## Airtable

**Como resolve (CSV numa tabela existente):**

1. A pessoa abre **Tools > Extensions** e adiciona a extensão **CSV import**.
2. Arrasta o CSV.
3. Liga **Merge with existing records** para atualizar em vez de só criar.
4. Escolhe o **Merge field**, o campo que define "o mesmo registro". A doc sugere um id ou e-mail.
5. A comparação diferencia maiúsculas de minúsculas. "Ana@x.com" e "ana@x.com" viram 2 registros.
6. **Skip blank or invalid CSV values** impede que célula vazia apague valor existente.
7. **Create missing select options** cria opções novas em campos de seleção.
8. Associa colunas a campos.
9. A prévia mostra registros de exemplo e 3 contagens: a atualizar, sem mudança, a criar.
10. A pessoa clica em **Create records**.
11. A doc recomenda tirar um **base snapshot** antes. Se der errado, a pessoa restaura o snapshot.

**Como resolve (template):**

1. **Use template** cria sempre uma base nova num workspace.
2. Não existe aplicar template numa base que já existe. A comunidade copia tabela por tabela.

**URL:**

- https://support.airtable.com/articles/3067164948-csv-import-extension
- https://support.airtable.com/docs/using-airtable-templates
- https://community.airtable.com/base-design-9/using-a-template-in-an-existing-base-28530

**Serve para o ENSPACE:**

- A prévia com 3 contagens, incluindo "sem mudança". Mostrar o que não muda tranquiliza a pessoa.
- "Célula vazia não apaga valor existente." No ENSPACE: no modo mesclar, propriedade ausente no arquivo mantém o valor atual.
- O snapshot antes de importar. O ENSPACE pode exportar o workspace atual automaticamente antes de aplicar e oferecer o arquivo para baixar.

**Não serve:**

- A pessoa escolhe o campo de mescla. Na estrutura do ENSPACE, a chave tem de ser escolha do sistema.
- A comparação sensível a maiúsculas gera duplicata por diferença de digitação. O ENSPACE precisa normalizar nomes ou avisar de nomes parecidos.
- O snapshot é passo manual e opcional; a pessoa esquece.

---

## HubSpot

**Como resolve:**

1. A pessoa envia o arquivo de contatos.
2. Num menu, escolhe o comportamento: **Create and update contacts**, **Create new contacts only** ou **Update existing contacts only**.
3. "Create and update" é o padrão.
4. Para reconhecer o mesmo contato, o HubSpot usa o **Record ID**. Sem ele, usa o e-mail (contatos) ou o domínio (empresas).
5. Se a linha traz Record ID, ele vence o e-mail.
6. Sem Record ID nem e-mail, o HubSpot só cria.
7. A pessoa associa colunas a propriedades. Erros aparecem com um ícone de alerta.
8. Depois da importação, uma tela de histórico mostra o que foi criado e atualizado e os erros.
9. Não existe desfazer importação. A pessoa filtra registros pela importação e exclui os que vieram dela.

**URL:**

- https://knowledge.hubspot.com/import-and-export/import-contacts-quick-import
- https://knowledge.hubspot.com/import-and-export/understand-the-import-tool
- https://knowledge.hubspot.com/import-and-export/view-and-analyze-previous-imports
- https://www.bardeen.ai/answers/how-to-undo-an-import-in-hubspot (sem desfazer nativo; fonte de terceiros)

**Serve para o ENSPACE:**

- Os nomes dos modos dizem o verbo e o alvo: "criar e atualizar", "criar só novos", "atualizar só existentes".
- A hierarquia de chaves: id primeiro, nome (ou e-mail) depois. O ENSPACE pode usar o id do arquivo quando o workspace de destino é o de origem, e o nome quando é outro.
- O histórico de importações com o que cada uma criou. Permite achar e reverter o que uma importação trouxe.

**Não serve:**

- Não há "substituir tudo".
- Prévia antes de gravar não confirmada.
- Reverter exige filtrar e excluir na mão.

---

## Salesforce

**Como resolve (change set):**

1. No ambiente de origem, a pessoa cria um **Outbound Change Set** e adiciona componentes (objetos, campos, layouts, fluxos).
2. **View/Add Dependencies** lista o que cada componente precisa e permite incluir.
3. **Upload** envia o pacote ao ambiente de destino. Depois do envio, o pacote não muda mais.
4. No destino, o pacote aparece em **Inbound Change Sets** com a lista de componentes.
5. **Validate** roda todas as checagens sem gravar e mostra o resultado de sucesso ou erro.
6. **Deploy** valida e aplica. **Quick Deploy** aplica direto se a validação anterior passou.
7. A aplicação é atômica: se um componente falha, nada é aplicado.
8. Change set não apaga componentes.
9. O que entrou não volta atrás.
10. Pela linha de comando, `sf project deploy preview` mostra 4 listas: a implantar, a apagar, conflitos e ignorados.

**URL:**

- https://www.salesforceben.com/everything-you-need-to-know-about-salesforce-change-sets/
- https://help.salesforce.com/s/articleView?id=sf.changesets_inbound_test_deploy.htm&language=en_US&type=5
- https://developer.salesforce.com/docs/platform/salesforce-cli-reference/guide/cli_reference_project.html
- https://www.npmjs.com/package/@salesforce/plugin-deploy-retrieve

**Serve para o ENSPACE:**

- A validação separada da aplicação. O ENSPACE pode checar dependências antes (fluxo que aponta para campo inexistente, grupo de permissão que cita categoria ausente) e listar os problemas.
- A aplicação atômica: ou entra tudo, ou nada. Evita workspace pela metade.
- A lista de dependências: importar uma tela sem a categoria que ela lista vira erro claro, não tela vazia.
- A lista "conflitos" do preview: itens que existem dos 2 lados com conteúdo diferente.

**Não serve:**

- O processo tem 2 ambientes, upload e e-mail. É fluxo de administrador técnico.
- Change set não remove nada; não cobre o modo "substituir".
- Sem desfazer.

---

## Strapi (plugin Config Sync)

**Como resolve:**

1. O plugin grava a configuração do Strapi (papéis, permissões, ajustes de plugins) em arquivos JSON numa pasta.
2. Na tela de ajustes do painel, uma tabela lista as diferenças entre a pasta e o banco.
3. A pessoa clica num item da tabela e vê a diferença daquele item lado a lado, no estilo git.
4. Os botões **Import** e **Export** levam a configuração num sentido ou no outro.
5. A sincronização pode ser parcial: só uma parte da configuração.
6. A pessoa pode excluir um item ou um tipo inteiro da sincronização.
7. O nome das categorias de diferença, o texto da confirmação e a existência de modo sem remoção não estão na doc lida (não confirmado).

**URL:**

- https://docs.pluginpal.io/config-sync/admin-gui
- https://market.strapi.io/plugins/strapi-plugin-config-sync
- https://cdn.jsdelivr.net/npm/strapi-plugin-config-sync@3.1.0/README.md

**Serve para o ENSPACE:**

- A lista de diferenças em 2 níveis: primeiro a tabela de itens, depois o detalhe do item clicado.
- Excluir um tipo inteiro da importação (por exemplo "não mexer em grupos de permissão").

**Não serve:**

- O detalhe é diff de código (JSON). A pessoa leiga do ENSPACE nunca vê JSON; o detalhe precisa ser "campo X: texto → número".
- Regras de conflito e confirmação não confirmadas.

---

## O padrão que todos seguem

1. **Arquivo primeiro, decisão depois.** Todos começam pelo envio do arquivo (arrastar ou escolher) e só então perguntam o que fazer.
2. **3 modos, com o seguro como padrão.**
   - Só criar: Monday "Add as new items" e "Skip", HubSpot "Create new contacts only", Directus `add`.
   - Criar e atualizar: Monday "Update", HubSpot "Create and update", Airtable "Merge with existing records", Directus `merge`, Twenty com `--no-delete`.
   - Espelhar e apagar: Directus `mirror`, Twenty `apply` padrão.
   - O modo que apaga nunca é o padrão. Directus e HubSpot deixam o modo do meio marcado; Monday deixa o mais conservador.
3. **"O mesmo item" se reconhece por uma chave, em ordem de força.** Id estável primeiro (HubSpot Record ID, Twenty `universalIdentifier`, Directus `id_map.json`). Campo natural depois (e-mail, domínio, nome). Na estrutura (Directus, Salesforce, Strapi) a chave é o nome da coisa.
4. **A prévia é um resumo com contagem, depois a lista.** Airtable: a atualizar, sem mudança, a criar. Directus: "+N new ~N updated ✖N deleted". Twenty: "2 to add, 1 to change, 1 to destroy". Salesforce: implantado, apagado, conflitos, ignorados.
5. **Apagar pede um segundo consentimento.** Twenty pede confirmação para mudança destrutiva. Directus pede digitar o nome do destino e separa "aplicar" de "apagar".
6. **Desfazer quase não existe.** Os que tratam do assunto mandam fazer cópia antes (Airtable snapshot, Directus arquivos versionados) ou excluir depois pelo histórico (HubSpot).

## O que nenhum deles faz

1. **Prévia estrutural para leigo.** Quem compara estrutura (Directus, Twenty, Salesforce, Strapi) mostra texto de terminal ou diff de código. Quem fala com leigo (Monday, Airtable, HubSpot) compara linhas de planilha, não estrutura. Nenhum mostra "categoria Contratos: 2 campos novos, 1 campo muda de tipo" numa tela feita para quem não é técnico.
2. **Backup automático antes de substituir.** Nenhum exporta sozinho o estado atual antes do modo destrutivo. O Airtable só recomenda; o Directus manda versionar.
3. **Desfazer a importação inteira com 1 clique.** Nenhum oferece. O HubSpot chega perto com o filtro por importação, mas a exclusão é manual.
4. **Escolha item a item dentro do modo.** Os modos valem para o arquivo inteiro. Nenhum deixa a pessoa marcar "esta categoria atualiza, aquela fica como está" na própria prévia (o ClickUp escolhe por tipo, não por item).
5. **Aviso de consequência em cascata.** Só o Pipefy avisa que automação ligada a campo de conexão quebra, e só na doc. Nenhum mostra na prévia "este fluxo usa um campo que o modo substituir vai remover".
6. **Aviso de nome parecido.** O Airtable documenta que maiúscula diferente vira duplicata, mas nenhum avisa na tela "Contrato" e "Contratos" antes de criar um segundo item.

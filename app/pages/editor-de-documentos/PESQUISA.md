# Pesquisa: documento Word ligado a um item

Pesquisa feita em 08/10/2026, só lendo a documentação oficial de cada produto (e o código do Twenty, que é aberto). 2 frentes:

1. **A limitação técnica**: dá para trabalhar no Word com um documento que mora no ENSPACE?
2. **As referências de interação**: como 9 produtos mostram, criam, abrem, travam e versionam um documento ligado a um registro.

Não há prints das referências nesta rodada: a pesquisa foi por leitura de documentação. As URLs estão em cada entrada.

---

## A limitação técnica

**Pergunta da demanda:** "parece que só daria pra trabalharmos com o word web com o doc dele em nuvem, ja qe nao ta salvo no local".

**Resposta: a limitação é o contrário.** O Word instalado (Windows e Mac) alcança o arquivo do ENSPACE sem pedir nada à Microsoft. O difícil é o Word para a web.

### Word para a web

- Editar no Word para a web um arquivo que não está no OneDrive ou no SharePoint exige o protocolo **WOPI** e entrar no **Cloud Storage Partner Program (CSPP)** da Microsoft.
  - O CSPP aceita só empresa cujo negócio é armazenamento em nuvem, analisa caso a caso, exige seguros (US$ 1 milhão de responsabilidade geral e cibernética), coautoria funcionando e verificação de 4 a 5 semanas.
  - Os termos obrigam o Word, Excel e PowerPoint para a web a aparecer **como primeira opção ou padrão de edição**: conflita com o ONLYOFFICE como padrão.
  - Fontes: [visão geral do CSPP](https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/overview), [termos](https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/legal/cspp-terms), [requisitos WOPI](https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/wopi-requirements), [prazos](https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/build-test-ship/shipping).
- **Alternativa sem CSPP:** copiar o arquivo para o OneDrive ou SharePoint de quem edita, pelo Microsoft Graph, abrir lá e trazer de volta ao concluir ([upload](https://learn.microsoft.com/en-us/graph/api/driveitem-put-content), [check-out](https://learn.microsoft.com/en-us/graph/api/driveitem-checkout), [webhooks](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/concepts/using-webhooks)). Exige conta corporativa Microsoft 365 e consentimento; o arquivo sai do ENSPACE enquanto alguém edita.

### Word instalado (Windows e Mac)

- **Esquema de URI do Office:** `ms-word:ofe|u|<url>` abre para edição, `ofv` só leitura ([documentação](https://learn.microsoft.com/en-us/office/client-developer/office-uri-schemes)). O caminho aceita até 256 caracteres.
- **Para o Salvar voltar ao ENSPACE**, o endereço precisa responder **WebDAV com bloqueio** (OPTIONS, PROPFIND, LOCK, UNLOCK, GET, PUT). Sem isso, o Word abre em leitura. Não precisa de CSPP. É o caminho do Nextcloud e de produtos como IT Hit.
- **Autenticação:** o Word faz as próprias requisições, sem a sessão do navegador. Saída usual: token curto no caminho da URL.
- **Pontos a testar antes de prometer:** comportamento no Mac (há relato de só leitura com `ofe` + WebDAV que funcionava no Windows) e políticas de TI que bloqueiam o protocolo.

### O suplemento do Word como ponte

- O .docx pode levar dentro o vínculo com o item (custom XML part com item, campo, versão), e o suplemento lê esse vínculo ([estado e configurações](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/persisting-add-in-state-and-settings)).
- `Office.context.document.getFileAsync(Compressed)` lê o .docx inteiro em fatias de até 4 MB, e o suplemento envia para a API do ENSPACE ([Office.Document](https://learn.microsoft.com/en-us/javascript/api/office/office.document)). A documentação diverge sobre o Word para a web: testar.
- O painel pode abrir sozinho com o documento (`Office.AutoShowTaskpaneWithDocument`), **mas não para suplemento publicado na loja da Microsoft**: só implantação centralizada ou sideload ([documentação](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/automatically-open-a-task-pane-with-a-document)). Como o suplemento do ENSPACE vai para a loja, o painel abre pelo botão.

### Concorrência entre ONLYOFFICE e Word

Não existe coautoria entre os 2 editores. O que funciona:

- **Bloqueio com dono e validade** (WebDAV LOCK, check-out): quem abriu no Word edita; os outros leem.
- **Aviso "em edição por"**: o callback do ONLYOFFICE informa quem conectou e desconectou ([callback](https://api.onlyoffice.com/docs/docs-api/usage-api/callback-handler/)); com alguém no ONLYOFFICE, o "Abrir no Word" espera.
- **Versão em todo salvamento**: o servidor recusa salvar por cima de versão mais nova (409/412) e oferece salvar como nova versão.
- **Bloqueio órfão**: expira sozinho (por exemplo, 30 min) e é renovado enquanto o Word está aberto.

### Caminhos, do menor para o maior esforço

| Caminho | Word Windows | Word Mac | Word web | Exige | Risco principal |
|---|---|---|---|---|---|
| **A. WebDAV + `ms-word:ofe`** (o Ctrl+S grava no item) | Sim | Testar | Não | Endpoint WebDAV classe 2, bloqueio, token curto na URL | Office decide sozinho entre leitura e escrita; Mac |
| **B. Suplemento como ponte** (arquivo baixado com o vínculo; "Salvar no ENSPACE" no painel) | Sim | Sim | Testar | Só o suplemento e a API com versão | O Ctrl+S grava no computador; a pessoa precisa usar o painel |
| **C1. Cópia no OneDrive pelo Graph** | Sim | Sim | Sim | Microsoft 365 corporativo e consentimento | O arquivo sai do ENSPACE durante a edição |
| **C2. CSPP + WOPI** | Só com CSPP Plus | Só com CSPP Plus | Sim | Aprovação, seguros, Office como padrão | Elegibilidade e o conflito com o ONLYOFFICE padrão |

**Recomendação:** A como caminho principal, B como saída de emergência (e o painel do suplemento como contexto nos dois), C1 como fase 2 quando cliente pedir o Word para a web. C2 não serve enquanto o ONLYOFFICE for o padrão.

---

## As referências

### Notion
- **Como resolve:** o documento é o corpo da página do item; arquivo entra na propriedade Files & media. Modelo pelo menu do botão New, que já preenche propriedades. Presença por avatares no topo; "editado por X" no menu. Versões em Version history, com restaurar.
- **Fontes:** [arquivos](https://www.notion.com/help/images-files-and-media), [modelos](https://www.notion.com/help/database-templates), [histórico](https://www.notion.com/help/duplicate-delete-and-restore-content), [colaboração](https://www.notion.com/help/collaborate-with-people).
- **Serve:** modelo que preenche ao criar; presença por avatar; "editado por X há Y"; restaurar.
- **Não serve:** o documento deixa de ser .docx. O cliente do ENSPACE precisa do .docx para assinar e mandar ao jurídico.

### Twenty CRM (código aberto)
- **Como resolve:** aba Files do registro, linha com ícone, nome, data e menu ⋮ (Baixar, Renomear, Excluir). Estado vazio "No Files" com Add file e área de soltar. Clique abre prévia em modal; não edita .docx. Notas salvam sozinhas (500 ms após parar de digitar).
- **Fonte:** [componentes de arquivos](https://github.com/twentyhq/twenty/tree/main/packages/twenty-front/src/modules/activities/files/components).
- **Serve:** a linha do arquivo com menu ⋮; o estado vazio com área de soltar; salvar sem Ctrl+S.
- **Não serve:** a prévia usa o visualizador público da Microsoft, que não abre arquivo privado.

### ClickUp
- **Como resolve:** anexos na tarefa (arrastar ou Upload) e campo Files. Prévia do Office pelo visualizador da Microsoft. Editar o anexo e salvar como versão nova é pedido aberto no fórum; o contorno é baixar e reenviar. O ClickUp Doc (editor próprio) tem presença e histórico com autor e restaurar.
- **Fontes:** [anexos](https://help.clickup.com/hc/en-us/articles/6309666546199-Add-attachments-to-tasks), [prévia Office](https://help.clickup.com/hc/en-us/articles/37682636758551-Activate-the-Preview-Word-Excel-and-Powerpoint-files-in-ClickUp-ClickApp), [pedido no fórum](https://feedback.clickup.com/feature-requests/p/ability-to-edit-an-attachment-and-then-save-it-as-a-new-version).
- **Serve:** histórico com autor e restaurar; o pedido aberto confirma que editar o .docx anexado é dor sem solução no mercado.
- **Não serve:** versão como "arquivo v2" separado bagunça a lista.

### monday.com
- **Como resolve:** coluna Files com miniatura e prévia no hover; versões na prévia (Add version, Set to current). Coluna monday Doc cria em branco já com o nome do item. Abrir no Word só por app de marketplace que guarda no SharePoint.
- **Fontes:** [Files Column](https://support.monday.com/hc/en-us/articles/360000597900-The-Files-Column), [versões](https://support.monday.com/hc/en-us/articles/360021698980-File-versioning), [Doc Column](https://support.monday.com/hc/en-us/articles/4499184558610-The-Doc-Column), [comunidade](https://community.monday.com/t/editing-documents-in-monday/51443).
- **Serve:** documento novo já com o nome do item; "tornar atual"; versões com autor e data.
- **Não serve:** o documento não puxa dados do item; Word depende de terceiros.

### Pipefy
- **Como resolve:** campo Anexo sem edição nem versão. PDF Generator: escolher o template no card, ver a **prévia preenchida** e baixar. Document Generator gera PDF por automação (fase, campo ou botão).
- **Fontes:** [PDF Generator](https://help.pipefy.com/en/articles/2414660-pdf-generator), [templates](https://help.pipefy.com/en/articles/2414717-create-pdf-templates).
- **Serve:** a prévia do documento preenchido antes de criar. Substitui a pergunta "Tem certeza que deseja gerar...?" do develop.
- **Não serve:** só PDF, não editável; o PDF manual vai para o computador e se perde do card.

### Box (a referência mais próxima)
- **Como resolve:** na prévia, botão Open com escolha do app e padrão salvo. Com o Box Edit, abre no Word do computador e oferece **bloquear o arquivo** com duração; cada Save do Word vira versão nova e mostra "salvo no Box". Cadeado na lista; "Request Unlock" para pedir liberação. Version History com Make Current. Modelos com tags pelo suplemento do Word (Box Doc Gen).
- **Fontes:** [Box Tools](https://support.box.com/hc/en-us/articles/360043696694-Opening-and-Editing-Files-with-Box-Tools), [bloqueio](https://support.box.com/hc/en-us/articles/360043697174-Locking-Unlocking-Files), [versões](https://support.box.com/hc/en-us/articles/360043697054-Accessing-Version-History), [app padrão](https://support.box.com/hc/en-us/articles/360049504033-Choosing-a-Default-Application-to-Open-a-File).
- **Serve:** botão Abrir com escolha e padrão; bloqueio com dono; "salvo no Box"; tornar atual.
- **Não serve:** o padrão é por tipo de arquivo na conta, não por campo; o Box Edit exige instalar programa.

### Dropbox
- **Como resolve:** menu Open com Word para a web; ao terminar, "Save and return to Dropbox". Padrão de app por tipo em Settings. No desktop, coautoria com AutoSave; bloquear antes para editar sozinho.
- **Fontes:** [Office no Dropbox](https://help.dropbox.com/view-edit/collaborate-on-microsoft-office), [botão Open](https://help.dropbox.com/desktop-web/open-button), [versões](https://help.dropbox.com/delete-restore/recover-older-versions).
- **Serve:** o rótulo de voltar salvando; o padrão escolhido pela pessoa.
- **Não serve:** versão e autoria em telas separadas.

### SharePoint, OneDrive, Lists e Teams
- **Como resolve:** "Abrir no navegador / Abrir no aplicativo / Mudar padrão" no mesmo menu; preferência por pessoa no Teams. Check out: só você edita. Version History com restaurar e comentário. Anexo do Lists não tem coautoria nem versão.
- **Fontes:** [abrir no app](https://support.microsoft.com/en-us/office/open-a-onedrive-or-sharepoint-file-in-the-desktop-app-instead-of-the-browser-761c66d2-7bc3-490e-a536-b3f71f41636b), [check out](https://support.microsoft.com/en-us/sharepoint/libraries/check-out-or-check-in-files-in-a-document-library), [versões](https://support.microsoft.com/en-us/sharepoint/data-and-lists/view-the-version-history-of-an-item-or-file-in-a-list-or-library).
- **Serve:** navegador e aplicativo no mesmo menu; preferência por pessoa; reserva explícita.
- **Não serve:** o anexo do Lists é o mesmo problema do ENSPACE hoje.

### Google Drive
- **Como resolve:** .docx abre no Google Docs em modo Office, salvando em .docx (selo ".DOCX" ao lado do nome). No Word desktop com o Drive para computador, aviso "Wait to Edit" com **"Notify me when it's safe to edit"**, e "New Version Created" com Get latest.
- **Fontes:** [modo Office](https://support.google.com/docs/answer/9406611), [presença no Office](https://support.google.com/drive/answer/13470231).
- **Serve:** o melhor aviso de "alguém está com o arquivo aberto" e o "avise quando liberar".
- **Não serve:** converter gera cópia e divide o documento em 2.

---

## O padrão que todos seguem

| Convenção | Quem faz |
|---|---|
| Cartão ou linha do arquivo com tipo, nome, data, autor e menu ⋮ (baixar, renomear, excluir) | Twenty, Box, Dropbox, SharePoint, monday |
| Botão **Abrir** com menu de destino (navegador, aplicativo) e padrão guardado | Box, Dropbox, SharePoint, Teams, Google Drive |
| Salvamento automático sem Ctrl+S; no desktop, cada Salvar vira versão | Notion, ClickUp Doc, Twenty, Office web, Box |
| Presença por avatar | Notion, ClickUp Doc, Box/Office, Word |
| Reserva explícita com dono e "pedir liberação"; cadeado na lista | Box, Dropbox, SharePoint |
| Histórico com autor, data, prévia e restaurar (tornar atual) | Notion, ClickUp Doc, monday, Box, Dropbox, SharePoint |
| Estado vazio com área de soltar | Twenty, ClickUp, monday |

O develop hoje não tem nenhuma das 7.

## O que nenhum deles faz

1. **Editor escolhido por campo e lembrado por pessoa.** Todos guardam o padrão por tipo de arquivo, na conta. O ENSPACE pode deixar o configurador do campo decidir quais editores valem e a pessoa lembrar a escolha.
2. **No próprio registro, quem está com o documento, onde e desde quando.** O Google avisa só dentro do Word; o Box mostra um cadeado sem nome. O ENSPACE mostra no cartão do campo e na célula da lista, com "Avisar quando liberar".
3. **Modelo preenchido com os dados do item, com prévia antes de criar, e o resultado ainda em .docx editável.** Pipefy gera PDF; monday precisa de terceiros; Box Doc Gen exige outra tela.
4. **Versão com a origem** (modelo, em branco, enviado, editado no ENSPACE, editado no Word, restaurado). Nenhum histórico diz por onde a versão foi salva.
5. **O mesmo estado de salvamento nos 2 editores** ("Salvando", "Salvo agora", "Salvo no ENSPACE às 14:22").
6. **Criar, em branco ou por modelo, e enviar no mesmo lugar**, sem gaveta intermediária.

## Condição e repetição no modelo (2026-10-21)

Pesquisa feita a pedido da redatora ("o montador de condiçoes ainda ta um pouco ruim, e de each tambem"), em 3 frentes: Pipefy, ClickUp e monday; geradores de documento e ferramentas de contrato; padrões de montador de regras e estudos com leigos. Só documentação, central de ajuda e comunidade; nenhuma conta aberta. Ironclad, Formstack e Clio Draft deram 403: o que vem deles é o trecho da busca.

### Pipefy, ClickUp e monday

| Produto | Condição | Documento com dados |
|---|---|---|
| Pipefy | Automação: E dentro do grupo, OU entre grupos, 2 níveis ([781403](https://help.pipefy.com/en/articles/781403-how-to-set-up-automation-conditions)); operador pelo tipo ([API](https://developers.pipefy.com/reference/conditions)); filtro de cards com até 5 condições no total ([2371316](https://help.pipefy.com/en/articles/2371316-card-filter-search)) | O PDF não aceita condição nem dado de card conectado; o suporte responde "not available" ([comunidade](https://community.pipefy.com/ask-the-community-43/generating-pdfs-best-practice-for-dealing-with-limitations-4101)) |
| ClickUp | Filtro em 1 linha: conector, campo, operador, valor e lixeira; só a 2ª linha tem o seletor E/OU, as seguintes repetem em cinza; "+ Nested filter" cria grupo ([filtros](https://help.clickup.com/hc/en-us/articles/6308875427223-Use-filters-to-search-tasks)); automação só com E, pedido de OU fechado ([pedido](https://feedback.clickup.com/feature-requests/p/please-support-or-for-the-trigger)) | Docs sem campo dinâmico nativo ([pedido](https://feedback.clickup.com/feature-requests/p/dynamic-task-field-variables-in-clickup-docs)) |
| monday | Automação em frase com lacunas ("When status changes to something…"), "+ add condition" ([custom](https://support.monday.com/hc/en-us/articles/360012254440-Build-your-own-custom-automation)); filtro avançado com grupo em caixa cinza ([filtros](https://support.monday.com/hc/en-us/articles/25722908508946-Advanced-board-filters)); WorkForms com ícone na pergunta que tem lógica e ícone vermelho na regra quebrada ([WorkForms](https://support.monday.com/hc/en-us/articles/27989721912722-Using-conditional-logic-in-WorkForms)) | Workdocs insere coluna com "{" ([Workdocs](https://support.monday.com/hc/en-us/articles/24108289323282-Integrate-workdocs-into-your-workflow)); sem condição no documento. O app DocuGen repete subitens numa tabela com 1 linha modelo ([placeholders](https://support.docugen.io/hc/en-us/articles/360018605599-List-of-DocuGen-placeholders)) |

Nenhum dos 3 tem condição dentro de documento gerado. O que serve deles é o montador de filtro e de automação.

### Geradores de documento e contrato

| Produto | Condição | Repetição |
|---|---|---|
| Juro | Seleciona o texto e clica em "Add rules"; operador pelo tipo; E ou OU; modo Viewing mostra o resultado ao vivo ([regras](https://intercom.help/juro/en/articles/5653125-adding-and-managing-rules)) | Não encontrado |
| DocuSign | Seleciona o texto; "Add Rule" na margem direita abre o Rule Builder ([dica](https://community.docusign.com/tips-from-docusign-155/docusign-trainer-tip-create-a-dynamic-document-template-with-conditional-logic-25709)); E e OU não se misturam, e a comunidade pede ([pedido](https://community.docusign.com/ideas/allow-compound-conditional-logic-in-document-rules-doc-gen-24011)) | Tabela dinâmica: escolhe o campo de cada coluna ([blog](https://www.docusign.com/blog/developers/generate-and-send-agreements-dynamic-tables-using-document-generation-esignature)) |
| PandaDoc | "Add conditional rule" num bloco; vale a 1ª regra que bate; conteúdo padrão quando nenhuma bate ([regras](https://support.pandadoc.com/hc/en-us/articles/4423209193367-Conditional-content-for-senders-)) | Tabela de preços com subtotal por seção ([tabela](https://support.pandadoc.com/en/articles/9714705-pricing-table-optional-items-and-editable-quantity)) |
| Ironclad | Destaca o texto e escolhe a condição; condição global com nome, reutilizável ([global](https://support.ironcladapp.com/hc/en-us/articles/42434042849815-Create-a-Global-Condition)) | Não encontrado |
| S-Docs | "All conditions are met / Any condition is met"; condição com nome; sem aninhar ([condição](https://help.sdocs.com/sdocs/enhanced-template-editor/conditional-logic-in-the-enhanced-editor)) | Não aceita condição em lista |
| Word | Regras de mala direta: Se, Então, Senão, com "em branco" e "não em branco" ([regras](https://support.microsoft.com/en-us/word/set-the-rules-for-a-mail-merge)) | Seção repetível ([content control](https://msdn.microsoft.com/en-us/library/jj889465)) |
| Zoho Writer | Seção com ícone de condição no Navigator ([seção](https://help.zoho.com/portal/en/kb/writer/automation-guide/merge-configuration/articles/how-to-use-conditional-sections-in-document-merge)) | Repeat de parágrafo, linha, coluna ou célula; escolhe a lista e os campos; número da linha por campo Auto-number; Preview Merge ([repeat](https://help.zoho.com/portal/en/kb/writer/automation-guide/merge-configuration/articles/writer-mail-merge-documents-repeat-data-blocks)) |
| HotDocs | "Create a Conditional Region" no texto selecionado; comparações pelo tipo; ELSE IF e ELSE; opção de não deixar parágrafo vazio ([região](https://help.hotdocs.com/author/current/Field_Editor_Conditional_Region.htm)) | Região repetida ([visão geral](https://help.hotdocs.com/author/current/Repeated_Region_Overview.htm)) |
| PDFMonkey | O painel da condição fica verde quando o trecho aparece e vermelho quando some, com os dados de teste ([lógica](https://pdfmonkey.io/docs/builder-templates/conditions-and-loops/)) | Nome do item sugerido no singular da lista; testes de primeiro e último |
| docxtemplater | `{#cond}` | `{#loop}` na 1ª célula repete a linha; `{^lista}` é o texto da lista vazia ([tags](https://docxtemplater.com/docs/tag-types/)) |

### Padrões de montador e estudos

- **Frase:** Zapier ("Only continue if {campo} {lógica} {valor}"), Typeform, Jotform e Carbon mostram a regra como frase ([Zapier](https://help.zapier.com/hc/en-us/articles/8495925071757), [Carbon](https://raw.githubusercontent.com/carbon-design-system/ibm-products/main/packages/ibm-products/src/components/ConditionBuilder/ConditionBuilder.mdx)).
- **Todas ou qualquer uma:** Salesforce Flow ("All Conditions Are Met", "Any Condition Is Met") e SLDS, que começa em "todas" sem mostrar o seletor ([Trailhead](https://trailhead.salesforce.com/content/learn/modules/flow-build-logic/define-multiple-paths-in-a-flow), [SLDS](http://spring-21.lightningdesignsystem.com/guidelines/rules-filters-logic/)).
- **1 conectivo por grupo**, e aninhamento até o 3º nível no Airtable e no Notion ([Airtable](https://support.airtable.com/docs/filtering-records-using-conditions), [Notion](https://notion.com/help/views-filters-and-sorts)).
- **"É qualquer um de"** troca o OU mais comum por 1 condição com vários valores ([Linear](https://linear.app/docs/filters.md)).
- **Teste contra um registro:** o Zapier responde "the Zap would have continued" ([teste](https://help.zapier.com/hc/en-us/articles/8496276332557)).
- **Leigos e E/OU:** no estudo de Pane, "E" foi usado como sequência ("e então") em 29% dos casos; 95% das operações sobre vários objetos foram ditas como conjunto ("todos os…"), não como laço; formulário em tabela (valores do mesmo formulário = E, formulário ao lado = OU) venceu o texto ([slides](https://cseweb.ucsd.edu/~mcoblenz/teaching/291P_winter2026/slides/11_natural_programming.pdf), [IEEE](https://ieeexplore.ieee.org/document/874379)).
- **Regras simples bastam:** 78% dos comportamentos desejados cabiam em 1 gatilho e 1 ação (Ur et al., CHI 2014, [Brown](https://archive2.news.brown.edu/2007-2015/articles/2014/04/smarthome.html)).
- **Repetição:** tabela com cabeçalho fixo e 1 linha modelo (HotDocs, Nintex, Gavel); 3 formatos de saída (tabela, lista, texto corrido) no Page Designer do Airtable ([Page Designer](https://support.airtable.com/articles/6125406684-editing-a-page-designer-extension)); texto para lista vazia, filtro e "último item" no Gavel ([Gavel](https://helpdocs.gavel.io/workflows/repeating-items)).

### Armadilhas encontradas

- Parágrafo vazio onde o trecho sumiu (DocuSign recomenda tag extra; HotDocs tem opção).
- 1 regra por trecho, que obriga a duplicar texto (Juro, PandaDoc).
- E e OU trocados sem a pessoa perceber (comunidade do Pipefy, [post](https://community.pipefy.com/automations-150/conditions-in-automations-and-and-or-in-practice-5374)).
- Limite escondido (Pipefy: 5 condições no filtro).
- Lista vazia que quebra a condição em volta (Conga).

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

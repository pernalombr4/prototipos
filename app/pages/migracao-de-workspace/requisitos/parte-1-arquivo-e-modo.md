# 1. Arquivo e modo

**Objetivo:** quem importa abre a camada "Importar estrutura", envia o arquivo da exportação, confere de onde ele
veio e escolhe o modo de importação antes de qualquer alteração no workspace.

**Onde vale:** Configurações › Interface › Casos de Uso (`/workspaces/<ws>/settings/interface/usecases`), cartão
"Migração de Workspace", botão Importar Workspace e o passo "Arquivo e modo" da camada que ele abre.

**Protótipo:** https://pernalombr4.github.io/prototipos/migracao-de-workspace/. O workspace vazio se abre pelo cenário
"Workspace vazio" da barra inferior.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN004 | Um workspace vazio só pode receber migração no modo Somente inclusão. | Workspace sem entidade de estrutura: Somente inclusão marcada, as outras 2 opções desabilitadas. | Obrigatório |

## Tela Casos de Uso (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Quando o membro clica em Importar Workspace, o sistema deve abrir a camada "Importar estrutura" no passo "Arquivo e modo", sem iniciar migração. | Exemplo: workspace com 5 categorias; o clique mostra a camada com os passos "Arquivo e modo" e "Revisar", e o workspace continua com 5 categorias. | Essencial | Obrigatório |
| RF031 | O sistema deve mostrar abaixo do cartão "Migração de Workspace" o aviso informativo "Nada é duplicado" com o texto "O sistema reconhece as categorias que já existem. Você escolhe se elas são alteradas ou não.", no lugar do aviso de duplicação. | O texto "elas serão duplicadas" não aparece; o bloco Importar diz "Envie o arquivo da exportação. Antes de importar, você escolhe o que fazer com o que já existe e revisa as alterações." | Importante | Obrigatório |

## Arquivo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF002 | O sistema deve permitir que o membro envie o arquivo de estrutura arrastando o arquivo para a área do passo ou escolhendo o arquivo no computador. | A área diz "Arraste o arquivo da estrutura até aqui" e "Ou clique para escolher. Use o arquivo .json baixado em Exportar Workspace."; arrastar e escolher mostram o mesmo resumo (RF004). | Essencial | Obrigatório |
| RF003 | Se o arquivo enviado não é um arquivo de estrutura, o sistema deve mostrar no passo o aviso de erro "Esse arquivo não é uma estrutura do ENSPACE" com "Use o arquivo .json baixado em Exportar Workspace, sem editar." | Exemplo: `relatorio.pdf` solto na área mostra o aviso; a área continua disponível e Continuar continua desabilitado. | Essencial | Obrigatório |
| RF004 | Quando o arquivo termina de ser lido, o sistema deve mostrar o nome do arquivo, o workspace de origem, a data e a hora da exportação e a quantidade de entidades por tipo presente no arquivo. | Exemplo: "Estrutura de Matriz Contencioso, exportada em 01/10/2026, 12:48" com 8 categorias, 37 campos, 13 formulários e 8 etapas de fluxo; arquivo sem fluxo não mostra "etapas de fluxo". | Importante | Obrigatório |
| RF005 | Quando o membro clica em Trocar arquivo, o sistema deve voltar à área de arraste e ocultar o modo de importação. | O resumo some, a área volta e o campo Modo de importação some. | Desejável | Desejável |
| RF010 | Enquanto o arquivo não terminou de ser lido, o sistema deve desabilitar o botão Continuar. | Sem arquivo, Continuar não responde; com o arquivo lido, Continuar abre o passo Revisar. | Importante | Obrigatório |

## Modo de importação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF006 | Quando o arquivo termina de ser lido, o sistema deve mostrar o campo Modo de importação com Somente inclusão, Inclusão e atualização e Substituição total, cada uma com a descrição. | As descrições: "Cria o que não existe no workspace e mantém o restante.", "Cria o que não existe e atualiza o que já existe. Não remove nada.", "Deixa o workspace igual ao arquivo."; antes da leitura, o campo não aparece. | Essencial | Obrigatório |
| RF007 | Quando o modo aparece num workspace com estrutura, o sistema deve marcar Somente inclusão com o selo "Recomendado". | Exemplo: workspace com 5 categorias; Somente inclusão marcada e com o selo. | Importante | Obrigatório |
| RF009 | Quando o membro escolhe Substituição total, o sistema deve mostrar abaixo das opções o aviso de erro "Remove tudo o que não está no arquivo, inclusive os itens cadastrados.", sem a quantidade de itens. | O aviso aparece na Substituição total e some ao voltar para Somente inclusão. | Essencial | Obrigatório |
| RF008 | Enquanto o workspace de destino é um workspace vazio, o sistema deve marcar Somente inclusão, desabilitar as outras 2 opções, ocultar o selo "Recomendado" e mostrar "Workspace vazio: todo o conteúdo do arquivo é incluído.", conforme RN004. | Workspace sem entidade de estrutura: Inclusão e atualização e Substituição total não podem ser escolhidas. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P7 | Quem pode importar: só o administrador do workspace? | produto | Estado "sem permissão" em RF001. |
| P8 | Qual é o tamanho máximo do arquivo? | back-end | Aviso com o limite em RF003. |

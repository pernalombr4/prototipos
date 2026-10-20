# Requisitos: importação de estrutura na tela Casos de Uso

**Objetivo:** quem importa a estrutura de outro workspace escolhe o que acontece com o que já existe e vê, antes de
confirmar, o que entra, o que muda e o que sai, em estrutura e nunca em JSON. Nada é duplicado.

**Onde vale:** Configurações › Interface › Casos de Uso (`/workspaces/<ws>/settings/interface/usecases`), cartão
"Migração de Workspace", botão Importar Workspace e a camada que ele abre.

**Referência visual:** protótipo em https://pernalombr4.github.io/prototipos/migracao-de-workspace/, aprovado em
14/10/2026; o fluxo da categoria entrou em 20/10/2026 e aguarda aprovação. Prints em `evidencias/proposta-r5-*.jpg`,
`proposta-r4-revisar.jpg` e `proposta-r6-fluxo-da-categoria.jpg`; produto de hoje em `evidencias/develop-*.jpg`. A
barra inferior do protótipo e o botão tracejado "Protótipo: usar arquivo de exemplo" não entram no produto.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre aspas são os da interface em português; inglês e espanhol estão no `textos.ts`.
"(em revisão)" marca o que ainda não foi aprovado. Os requisitos valem para cada entidade que o arquivo de estrutura
leva (RN009); os exemplos citam algumas entidades só para ilustrar.

**Fora do escopo:** Exportar Workspace, título e descrição da tela, menu lateral e barra do topo continuam como estão.

## Resumo

| Grupo | O que muda em relação ao develop de 01/10/2026 | Requisitos |
|---|---|---|
| Tela Casos de Uso | O botão Importar continua no lugar e passa a abrir a camada; o aviso de duplicação sai | RF001, RF031 |
| Arquivo e modo | Área de arraste, validação, resumo do arquivo e os 3 modos de importação; hoje importa na hora e duplica | RF002 a RF010 |
| Revisão | Prévia com contadores e lista só das alterações, em estrutura; hoje não existe prévia | RF011 a RF017, RF021, RF022, RF032 |
| Fluxo da categoria | Etapas, tarefas e configurações da etapa na revisão | RF018 a RF020 |
| Confirmação | Cópia antes de importar; e-mail na Substituição total; voltar sem perder a escolha | RF023, RF024, RF033 |
| Migração | Andamento com etapas, cancelar, concluída, cancelada, falha e aviso no sino; sem desfazer | RF025 a RF030 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN001 (aguarda P1) | Uma entidade do arquivo é considerada correspondente de uma entidade do workspace quando as 2 têm chaves de identidade iguais (proposta em S1). | A categoria `processos_judiciais` é a mesma nos 2 lados, mesmo com o nome "Processos judiciais" num e "Processos judiciais trabalhistas" no outro. |
| RN002 | A tabela a seguir define a situação de cada entidade na migração. Política: Única. | Linha 8: a categoria "Contratos de honorários", só no workspace, sai com os 48 itens na Substituição total. |
| RN003 | Cada entidade do arquivo que tem correspondente no workspace deve continuar como 1 entidade depois da migração. | Importar "Partes" num workspace que já tem "Partes" deixa 1 categoria "Partes", nos 3 modos. |
| RN004 | Um workspace vazio só pode receber migração no modo Somente inclusão. | Workspace sem entidade de estrutura: Somente inclusão marcada, as outras 2 opções desabilitadas. |
| RN005 | Uma migração na Substituição total que remove ao menos 1 entidade só pode começar se o e-mail digitado for igual ao e-mail do membro logado. | Com ana.souza@exemplo.com.br logada, digitar "ana@exemplo.com.br" não libera o botão. |
| RN006 | Uma migração concluída não pode ser desfeita. | A tela de migração concluída não tem botão de desfazer; a volta é pela cópia do workspace. |
| RN007 | Uma migração só pode ser cancelada enquanto está em andamento. | Cancela na etapa "Criando categorias"; concluída, não cancela. |
| RN008 (aguarda P2) | Uma migração cancelada ou com falha não pode deixar alteração na estrutura do workspace. | Falha na etapa "Criando campos e listas" não deixa categoria nova no workspace. |
| RN009 | Cada tipo de entidade que o arquivo de estrutura leva deve entrar na migração e na prévia. | O fluxo da categoria aparece na prévia com as etapas; um tipo novo que a exportação passar a levar aparece sem requisito novo. |

**RN002, situação de cada entidade por modo** (cada linha se cita como RN002.1 a RN002.8):

| Linha | Está no arquivo | Está no workspace | Diferença entre as 2 | Modo | Situação | O que a migração faz |
|---|---|---|---|---|---|---|
| 1 | sim | não | não se aplica | os 3 | Novo | cria a entidade |
| 2 | sim | sim | não | os 3 | Inalterado | nada |
| 3 | sim | sim | sim | Somente inclusão | Inalterado | mantém a entidade do workspace |
| 4 | sim | sim | sim | Inclusão e atualização | Alterado | aplica o que o arquivo tem de diferente |
| 5 | sim | sim | sim | Substituição total | Alterado | aplica o que o arquivo tem de diferente |
| 6 | não | sim | não se aplica | Somente inclusão | Inalterado | nada |
| 7 | não | sim | não se aplica | Inclusão e atualização | Inalterado | nada |
| 8 | não | sim | não se aplica | Substituição total | Removido | remove a entidade e, na categoria, os itens cadastrados nela |

## Tela Casos de Uso

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF001 | Quando o membro clica em Importar Workspace, o sistema deve abrir a camada "Importar estrutura" no passo "Arquivo e modo", sem iniciar migração. | Exemplo: workspace com 5 categorias; o clique mostra a camada com os passos "Arquivo e modo" e "Revisar", e o workspace continua com 5 categorias. | Essencial |
| RF031 | O sistema deve mostrar abaixo do cartão "Migração de Workspace" o aviso informativo "Nada é duplicado" com o texto "O sistema reconhece as categorias que já existem. Você escolhe se elas são alteradas ou não.", no lugar do aviso de duplicação. | O texto "elas serão duplicadas" não aparece; o bloco Importar diz "Envie o arquivo da exportação. Antes de importar, você escolhe o que fazer com o que já existe e revisa as alterações." | Importante |

## Arquivo e modo

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF002 | O sistema deve permitir que o membro envie o arquivo de estrutura arrastando o arquivo para a área do passo ou escolhendo o arquivo no computador. | A área diz "Arraste o arquivo da estrutura até aqui" e "Ou clique para escolher. Use o arquivo .json baixado em Exportar Workspace."; arrastar e escolher mostram o mesmo resumo (RF004). | Essencial |
| RF003 | Se o arquivo enviado não é um arquivo de estrutura, o sistema deve mostrar no passo o aviso de erro "Esse arquivo não é uma estrutura do ENSPACE" com "Use o arquivo .json baixado em Exportar Workspace, sem editar." | Exemplo: `relatorio.pdf` solto na área mostra o aviso; a área continua disponível e Continuar continua desabilitado. | Essencial |
| RF004 | Quando o arquivo termina de ser lido, o sistema deve mostrar o nome do arquivo, o workspace de origem, a data e a hora da exportação e a quantidade de entidades por tipo presente no arquivo. | Exemplo: "Estrutura de Matriz Contencioso, exportada em 01/10/2026, 12:48" com 8 categorias, 37 campos, 13 formulários e 8 etapas de fluxo; arquivo sem fluxo não mostra "etapas de fluxo". | Importante |
| RF005 | Quando o membro clica em Trocar arquivo, o sistema deve voltar à área de arraste e ocultar o modo de importação. | O resumo some, a área volta e o campo Modo de importação some. | Desejável |
| RF006 | Quando o arquivo termina de ser lido, o sistema deve mostrar o campo Modo de importação com Somente inclusão, Inclusão e atualização e Substituição total, cada uma com a descrição. | As descrições: "Cria o que não existe no workspace e mantém o restante.", "Cria o que não existe e atualiza o que já existe. Não remove nada.", "Deixa o workspace igual ao arquivo."; antes da leitura, o campo não aparece. | Essencial |
| RF007 | Quando o modo aparece num workspace com estrutura, o sistema deve marcar Somente inclusão com o selo "Recomendado". | Exemplo: workspace com 5 categorias; Somente inclusão marcada e com o selo. | Importante |
| RF008 | Enquanto o workspace de destino é um workspace vazio, o sistema deve marcar Somente inclusão, desabilitar as outras 2 opções, ocultar o selo "Recomendado" e mostrar "Workspace vazio: todo o conteúdo do arquivo é incluído.", conforme RN004. | Workspace sem entidade de estrutura: Inclusão e atualização e Substituição total não podem ser escolhidas. | Essencial |
| RF009 | Quando o membro escolhe Substituição total, o sistema deve mostrar abaixo das opções o aviso de erro "Remove tudo o que não está no arquivo, inclusive os itens cadastrados.", sem a quantidade de itens. | O aviso aparece na Substituição total e some ao voltar para Somente inclusão. | Essencial |
| RF010 | Enquanto o arquivo não terminou de ser lido, o sistema deve desabilitar o botão Continuar. | Sem arquivo, Continuar não responde; com o arquivo lido, Continuar abre o passo Revisar. | Importante |

## Revisão

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF011 | Quando o membro clica em Continuar, o sistema deve calcular a situação de cada entidade conforme RN001, RN002 e RN009, para o modo escolhido, sem alterar o workspace. | Exemplo: na Inclusão e atualização, "Processos judiciais" aparece Alterada, "Garantias" Nova e "Contratos de honorários" fica fora da lista (RN002.7); o workspace continua com 5 categorias. | Essencial |
| RF012 | Quando a prévia é calculada, o sistema deve mostrar os contadores Novos, Alterados, Removidos e Inalterados com a quantidade de categorias e de entidades fora das categorias em cada situação. | Exemplo: Inclusão e atualização com o arquivo de exemplo mostra 15 Novos, 3 Alterados, 0 Removidos e 9 Inalterados; o contador zerado aparece esmaecido. | Importante |
| RF013 | O sistema deve listar na prévia só as entidades nas situações Novo, Alterado e Removido, com a frase "A lista mostra só as alterações." acima da lista. | "Partes", igual nos 2 lados, fica fora da lista e conta em Inalterados; não existe chave para mostrar o que não muda. | Importante |
| RF014 | O sistema deve organizar a lista em Categorias, com as entidades de cada categoria agrupadas por tipo dentro dela, e em Outros componentes, com as entidades fora das categorias agrupadas por tipo, cobrindo cada tipo de entidade da RN009. | Exemplo: "Processos judiciais" mostra "Campos (12) +3 ~3 −1", "Formulários (3) +1", "Pastas (3) +1" e "Fluxo (5 etapas) +1 ~1 −1"; categoria alterada abre expandida, nova e removida vêm recolhidas. | Essencial |
| RF015 | O sistema deve mostrar em cada entidade a situação, com ícone, cor e texto concordando em gênero, e, na entidade alterada, cada propriedade que muda como "<propriedade>: <valor atual riscado> → <valor do arquivo>". | Exemplos: "Nome: Vara → Vara ou tribunal"; "Tipo: Texto longo → Texto com formatação"; "Opções novas: Curitiba, Porto Alegre"; "Garantias" mostra "Nova" e o campo "Instância" mostra "Novo". | Essencial |
| RF016 | O sistema deve mostrar, ao lado do nome de cada entidade que tem tipo, o tipo pelo nome da tela de configuração daquela entidade. | Exemplo: o campo "Comarca" (`EnlDropdown`) mostra "Lista de opções"; tipo sem nome mapeado mostra "Outro tipo". | Importante |
| RF017 | Quando a prévia tem uma categoria Removida, o sistema deve mostrar o nome riscado e, em vermelho, a quantidade de itens cadastrados nela. | Exemplo: "Contratos de honorários advocatícios com escritórios parceiros", riscada, com "48 itens cadastrados" e a marca "Removida". | Essencial |
| RF021 | Enquanto o workspace de destino é um workspace vazio, o sistema deve mostrar no passo Revisar o título "Workspace vazio", o texto "A importação adiciona:" e as categorias do arquivo com a quantidade de campos, no lugar dos contadores e da lista. | Exemplo: arquivo com 8 categorias num workspace vazio mostra as 8, sem contadores. | Importante |
| RF032 | Enquanto as entidades do arquivo não têm correspondente no workspace e o modo não é Substituição total, o sistema deve mostrar o título "Nenhuma categoria do arquivo existe aqui", o texto "A importação adiciona tudo e não altera o que já existe:" e as categorias do arquivo, no lugar dos contadores e da lista. | Exemplo: workspace com "Compras" e arquivo só com "Garantias" e "Multas", na Somente inclusão. Na Substituição total vale RF014. | Desejável |
| RF022 | Se a prévia não tem entidade Nova, Alterada ou Removida, o sistema deve mostrar o aviso "Nada a importar" com "O workspace já tem tudo o que está no arquivo." e oferecer só o botão Fechar. | Exemplo: o arquivo exportado do próprio workspace mostra o aviso, sem o botão Importar. | Desejável |

## Fluxo da categoria

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF018 (em revisão) | Quando a categoria tem etapas Novas, Alteradas ou Removidas, o sistema deve mostrar no grupo Fluxo as etapas na ordem do fluxo e, dentro de cada etapa, as entidades da etapa que mudam. | Exemplos: etapa "Nome: Análise → Análise de mérito"; tarefa "Emitir parecer" com "Responsável: Advogado responsável → Coordenação jurídica"; "Audiências" sem fluxo no workspace recebe "Fluxo (2 etapas) +2". | Essencial |
| RF019 (em revisão) | Quando a prévia tem uma etapa Removida, o sistema deve mostrar o nome riscado e, em vermelho, a quantidade de itens na etapa e de tarefas abertas dela. | Exemplo: "Revisão jurídica", riscada, com "12 itens nesta etapa" e "4 tarefas abertas". | Importante |
| RF020 (em revisão) | Se uma entidade que a migração cria ou altera cita um membro ou outra entidade que não existe no workspace de destino, o sistema deve mostrar abaixo dela o aviso "Aponta para <nome>, que não existe neste workspace." | Exemplo: a regra de responsável "Diretoria aprova acima de R$ 100 mil" mostra "Aponta para Carla Mendes, que não existe neste workspace."; a etapa que a contém abre expandida. | Importante |

## Confirmação

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF023 | Enquanto o workspace de destino tem estrutura, o sistema deve mostrar no passo Revisar a opção "Baixar uma cópia do workspace antes", marcada, com a ajuda "Depois de concluída, a migração não tem como ser desfeita." | Marcada, o arquivo de estrutura do workspace é baixado antes de a migração começar; no workspace vazio, a opção não aparece. | Importante |
| RF024 | Enquanto o modo é Substituição total e a prévia tem ao menos 1 entidade Removida, o sistema deve mostrar o aviso de erro "Remove tudo o que não está no arquivo, inclusive os itens cadastrados.", o texto "Para confirmar, digite seu e-mail:", o e-mail do membro logado e o campo para digitá-lo, conforme RN005. | Digitar "ana.souza@exemplo.com.br" mostra ✓ e habilita "Substituir workspace", na cor de erro; nos outros modos, o botão é "Importar", na cor primária, sem e-mail. | Essencial |
| RF033 | Quando o membro clica em Voltar no passo Revisar, o sistema deve abrir o passo "Arquivo e modo" com o arquivo e o modo escolhidos. | Exemplo: Substituição total escolhida; Voltar mostra o mesmo arquivo e a Substituição total marcada. A revisão não tem botão de trocar o modo. | Importante |

## Migração

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF025 | Enquanto a migração está em andamento, o sistema deve mostrar "Importando a estrutura", "Isso leva alguns minutos em workspaces grandes.", a barra com a porcentagem e as etapas "Conferindo o arquivo", "Criando categorias", "Criando campos e listas", "Montando formulários e telas" e "Ajustando permissões e menus", com a concluída, a atual e as próximas diferenciadas. | Exemplo: na etapa "Criando campos e listas", as 2 anteriores têm ✓, a atual gira e a barra mostra 40%; Fechar não interrompe a migração. | Importante |
| RF026 | Enquanto a migração está em andamento, o sistema deve permitir que o membro cancele a migração pelo botão "Cancelar migração", conforme RN007. | O rodapé mostra "Cancelar migração", com contorno na cor de erro, e "Fechar". | Essencial |
| RF027 | Quando a migração termina sem falha, o sistema deve mostrar "Migração concluída", o resumo das categorias novas, alteradas e removidas sem as quantidades zeradas e o botão "Ver categorias". | Exemplo: "8 categorias novas." sem "0 categorias alteradas"; com a cópia marcada, "A cópia de antes da importação está na sua pasta de downloads."; sem botão de desfazer (RN006). | Importante |
| RF028 | Quando a migração é cancelada, o sistema deve mostrar "Migração cancelada", "Nada foi migrado." e o botão Fechar. | Exemplo: cancelada em "Criando categorias"; o workspace continua com as 5 categorias de antes (RN008). | Essencial |
| RF029 | Se a migração falha, o sistema deve mostrar o aviso de erro "A migração falhou" com "Nada foi migrado.", sem a etapa em que parou, e os botões Fechar e "Tentar de novo". | Exemplo: falha em "Criando campos e listas"; o nome da etapa não aparece. "Tentar de novo" recomeça com o mesmo arquivo e o mesmo modo. | Essencial |
| RF030 | Quando a migração termina concluída ou com falha, o sistema deve enviar o aviso com o resultado ao sino do membro que iniciou a migração. | Exemplo: ana.souza@exemplo.com.br fechou a camada durante a migração; o sino de ana.souza@exemplo.com.br mostra o resultado. | Importante |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI001 | `POST /migration-requests` (`type=structure`) | Deve receber o arquivo de estrutura e o modo de importação, no campo <a definir>, com 3 valores <a definir>. |
| RI002 | Prévia da migração, rota <a definir> | Deve devolver a situação de cada entidade conforme RN002 e RN009, os itens das categorias removidas e os itens e tarefas abertas das etapas removidas, sem alterar o workspace. |
| RI003 | Cancelamento da migração, rota <a definir> | Deve interromper a migração em andamento e devolver o status cancelado (RN007, RN008). |
| RI004 | `GET /migration-requests?status_in=pending&status_in=processing&type=structure` | Deve devolver a etapa atual da migração, no campo <a definir>; hoje devolve só o status. |
| RI005 | Cancelamento de migração concluída ou com falha | A rota de cancelamento deve devolver erro com o status HTTP <a definir>, sem mudar a estrutura. |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF001 | As marcas de situação devem atender à WCAG 2.2 AA, critério 1.4.1 (uso de cor). | Em tons de cinza, Novo, Alterado, Removido e Inalterado se distinguem pelo ícone e pelo texto, nos temas claro e escuro. | Importante |
| RNF002 | A camada deve desligar as transições quando o sistema operacional pede movimento reduzido (WCAG 2.2, critério 2.3.3). | Com `prefers-reduced-motion: reduce`, a troca de passo acontece sem deslizamento. | Desejável |
| RS001 | Cada texto da camada deve existir em português, inglês e espanhol. Imposta por: spec dos protótipos, regra 35. | Trocar o idioma para espanhol troca marcas, tipos e avisos. | Essencial |
| RS002 | A camada deve funcionar nos temas claro e escuro. Imposta por: spec dos protótipos, regra 35. | No tema escuro, as 4 marcas e os avisos de erro continuam legíveis. | Importante |
| RS003 | Cada texto da camada deve ser escrito sem travessão. Imposta por: spec dos protótipos, regra 33. | Os textos da camada não contêm "—" nem "–". | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | Qual chave reconhece a mesma entidade nos 2 workspaces: `slug` e `refId`, `migration_hash` ou outra? Etapa e tarefa não têm `slug`. | back-end | Fecha RN001 e RI002. Com chave fraca (nome), renomear vira remover e criar. |
| P2 | A migração já é tudo ou nada hoje? | back-end | Se não for, RN008, RF028 e RF029 exigem mudança no back-end ou outro texto. |
| P3 | Na Substituição total, os itens de uma categoria removida vão para a lixeira ou são excluídos de vez? | produto | Texto de RF009 e RF024. |
| P4 | Na Substituição total, para onde vão os itens e as tarefas abertas de uma etapa removida? | produto | RF019 e, talvez, uma escolha de etapa de destino na confirmação. |
| P5 | Tarefa cujo responsável não existe no destino entra sem responsável, com o responsável padrão da etapa ou não entra? | produto | RF020 para membros. |
| P6 | O Spaceflow (`/workflows`) também migra? Hoje ele não está no arquivo de exportação. | produto | A exportação passa a levar o Spaceflow, e ele entra pela RN009. |
| P7 | Quem pode importar: só o administrador do workspace? | produto | Estado "sem permissão" em RF001. |
| P8 | Qual é o tamanho máximo do arquivo? | back-end | Aviso com o limite em RF003. |
| P9 | O andamento ganha a etapa "Montando fluxos e tarefas"? Qual é o texto do aviso no sino? | produto | RF025 e RF030. |
| P10 | RF018 a RF020, do protótipo de 20/10/2026, estão aprovados? | produto | Tira o "(em revisão)". |
| P11 | Qual é o tempo máximo aceitável para calcular a prévia de um arquivo com 300 campos? | produto e back-end | Entra um RNF de desempenho. |
| P12 | Arquivos exportados antes desta mudança continuam aceitos? | back-end | Entra um RT ou um aviso em RF003. |
| P13 | Falha ao gerar a cópia do workspace (RF023) impede a migração? | produto | Entra o comportamento de erro em RF023. |
| S1 | A chave de identidade é `slug` na categoria, `refId` no campo e o nome nas entidades sem `slug` nem `refId` (proposta do protótipo). | Resposta a P1 | RN001 |
| S2 | O back-end consegue calcular a prévia antes de importar. | Desenho da rota de RI002 | RF011 |
| S3 | O back-end informa a etapa em andamento. | Resposta de RI004 com a etapa | RF025 |
| S4 | As referências entre entidades importadas (rota para etapa, condicional que lê campo) são recriadas apontando para o workspace de destino. | Teste de importação com fluxo no develop | RF020 |

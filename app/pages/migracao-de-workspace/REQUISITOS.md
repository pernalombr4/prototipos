# Requisitos: importação de estrutura na tela Casos de Uso

**Objetivo:** quem importa a estrutura de outro workspace escolhe o que acontece com o que já existe e vê, antes de
confirmar, o que entra, o que muda e o que sai, em estrutura e nunca em JSON. Nada é duplicado.

**Onde vale:** Configurações › Interface › Casos de Uso (`/workspaces/<ws>/settings/interface/usecases`), cartão
"Migração de Workspace", botão **Importar Workspace**, e a camada que esse botão abre.

**Referência visual:** protótipo navegável em https://pernalombr4.github.io/prototipos/migracao-de-workspace/,
aprovado em 14/10/2026 (rodada 5 e fechamento). Código, textos nos 3 idiomas e decisões em
https://github.com/pernalombr4/prototipos/tree/main/app/pages/migracao-de-workspace. Prints da proposta em
`evidencias/proposta-r5-*.jpg` e `evidencias/proposta-r4-revisar.jpg`; prints do produto de hoje em
`evidencias/develop-*.jpg`. A barra inferior do protótipo (cenário, final da importação, tema, idioma) e o botão
tracejado "Protótipo: usar arquivo de exemplo" são ferramentas de revisão e não entram no produto. O fluxo da
categoria na comparação (RV-15 a RV-21) entrou nos requisitos em 20/10/2026, depois da aprovação, e ainda não está
no protótipo.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
Nenhum texto de tela leva travessão.

**Fora do escopo:** o Exportar Workspace, o título e a descrição da tela Casos de Uso, o menu lateral e a barra do
topo continuam como estão.

## Resumo

| Grupo | O que muda em relação ao develop de 01/10/2026 |
|---|---|
| Tela Casos de Uso (RT) | O botão Importar continua no mesmo lugar e passa a abrir a camada. O aviso "serão duplicadas" sai |
| Arquivo (RA) | Hoje o botão abre o seletor do sistema e importa na hora. Passa a ter área de arraste, validação e resumo do arquivo |
| Modo de importação (RM) | Hoje não existe escolha: tudo entra como novo e duplica. Passa a ter 3 modos, e o workspace vazio só aceita a inclusão |
| Revisão (RV) | Hoje não existe prévia. Passa a ter contagem e árvore só com as alterações, em estrutura, inclusive o fluxo da categoria (etapas e tarefas) |
| Confirmação (RC) | A Substituição total pede o e-mail de quem confirma, como a exclusão de categoria |
| Migração em andamento (RG) | Etapas com porcentagem e Cancelar migração |
| Fim da migração (RF) | Concluída, cancelada e falha. Não existe desfazer |
| Dados (RD) | O que o arquivo e a API já têm e o que o back-end precisa acrescentar |
| Componentes e acessibilidade (RK) | Componentes, tema, idioma, movimento e teclado |

## Tela Casos de Uso (RT)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RT-01 | O botão **Importar Workspace** deve continuar no mesmo lugar do cartão "Migração de Workspace" e abrir a camada "Importar estrutura", com a descrição "Traga categorias, campos e formulários de outro workspace." | O clique não abre mais o seletor de arquivos do sistema, e nada é importado nesse clique. |
| RT-02 | O texto do bloco Importar deve ser "Envie o arquivo da exportação. Antes de importar, você escolhe o que fazer com o que já existe e revisa as alterações." | O texto antigo ("O sistema importará todas as categorias e seus respectivos componentes") sai. |
| RT-03 | O aviso "Atenção: O sistema não identifica categorias pré-existentes no workspace. Se o arquivo contiver categorias já cadastradas, elas serão duplicadas." deve sair. No lugar, um aviso informativo com o título "Nada é duplicado" e o texto "O sistema reconhece as categorias que já existem. Você escolhe se elas são alteradas ou não." | Nenhum dos 3 modos (RM) duplica categoria. |
| RT-04 | Durante uma importação, o botão **Exportar Workspace** não deve girar nem ficar desabilitado. | Hoje os 2 botões giram juntos; com a mudança, só a camada mostra o andamento (RG). |

## Arquivo (RA)

A camada tem 2 passos, mostrados num indicador de etapas no topo: **Arquivo e modo** e **Revisar**.

| ID | Requisito | Critério de aceite |
|---|---|---|
| RA-01 | O passo 1 deve abrir com uma área de arraste, com o título "Arraste o arquivo da estrutura até aqui" e o texto "Ou clique para escolher. Use o arquivo .json baixado em Exportar Workspace." | Soltar o arquivo na área ou clicar nela e escolher o arquivo produzem o mesmo resultado. |
| RA-02 | A área deve aceitar só arquivo `.json`. | Outro formato não é lido. |
| RA-03 | Arquivo que não é `.json` ou não tem a estrutura da exportação deve mostrar, no próprio passo, o aviso de erro "Esse arquivo não é uma estrutura do ENSPACE" com o texto "Use o arquivo .json baixado em Exportar Workspace, sem editar." | A área continua disponível para outro arquivo. Nada é importado. |
| RA-04 | Enquanto o arquivo é lido, o lugar da área deve mostrar o nome do arquivo, um ícone girando e "Lendo o arquivo...". | A leitura não deixa a camada parada sem indicação. |
| RA-05 | Lido o arquivo, a área deve dar lugar a um cartão com o nome do arquivo, "Estrutura de <workspace de origem>, exportada em <data e hora>" e as quantidades: categorias, campos, formulários, etapas de fluxo e outros componentes. A quantidade de etapas só aparece quando o arquivo traz fluxo. | Exemplo: "Estrutura de Matriz Contencioso, exportada em 01/10/2026, 12:48 · 8 categorias · 37 campos · 13 formulários · 15 outros componentes". |
| RA-06 | O cartão deve ter o botão **Trocar arquivo**, que volta à área de arraste e esconde o modo de importação. | Trocar o arquivo não importa nada. |
| RA-07 | O botão **Continuar** deve ficar desabilitado até o arquivo ser lido. | Sem arquivo lido, não se chega à revisão. |
| RA-08 | O rodapé do passo 1 deve ter **Cancelar**, que fecha a camada sem importar. | Nenhuma mudança no workspace. |

## Modo de importação (RM)

Os 3 modos formam uma escada: cada um faz o que o anterior faz e mais uma coisa. Nenhum duplica.

| ID | Requisito | Critério de aceite |
|---|---|---|
| RM-01 | Lido o arquivo, o campo **Modo de importação** deve aparecer abaixo do cartão do arquivo, com 3 opções lado a lado, cada uma com título e 1 linha de descrição. | O campo não aparece antes de o arquivo ser lido. |
| RM-02 | **Somente inclusão**: "Cria o que não existe no workspace e mantém o restante." Deve criar categorias, campos, formulários, pastas, etapas e tarefas do fluxo e componentes que o workspace não tem, sem alterar nem remover nada do que já existe. | Uma categoria que existe nos 2 lados com nome diferente fica com o nome atual. |
| RM-03 | **Inclusão e atualização**: "Cria o que não existe e atualiza o que já existe. Não remove nada." Deve fazer o que a Somente inclusão faz e aplicar as diferenças do arquivo ao que existe nos 2 lados (nome, tipo de campo, opções novas, nome e configuração da etapa e da tarefa). | Nada é removido, nem opção de lista: a opção que só existe no workspace continua. |
| RM-04 | **Substituição total**: "Deixa o workspace igual ao arquivo." Deve fazer o que a Inclusão e atualização faz e remover o que não está no arquivo, inclusive opções de lista, etapas e tarefas do fluxo, e as categorias com os itens cadastrados nelas. | Depois da importação, a estrutura do workspace é igual à do arquivo. |
| RM-05 | **Somente inclusão** deve vir marcada e com o selo "Recomendado". | Abrir a camada e ler o arquivo mostra a Somente inclusão escolhida. |
| RM-06 | Ao escolher **Substituição total**, deve aparecer abaixo das opções o aviso de erro "Remove tudo o que não está no arquivo, inclusive os itens cadastrados.", sem contar os itens. | Trocar para outro modo some com o aviso. |
| RM-07 | Com o **workspace vazio**, a Somente inclusão deve vir marcada, as outras 2 opções devem ficar desabilitadas, o selo "Recomendado" não deve aparecer, e a linha "Workspace vazio: todo o conteúdo do arquivo é incluído." deve aparecer abaixo das opções. | Não é possível escolher Inclusão e atualização nem Substituição total num workspace sem estrutura. |
| RM-08 | Para mudar o modo depois de chegar à revisão, a pessoa usa o botão **Voltar** do passo 2. | A revisão não tem botão próprio de trocar o modo. |

## Revisão (RV)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RV-01 | O passo 2 deve mostrar no topo 4 contadores: **Novos**, **Alterados**, **Removidos** e **Inalterados**, cada um com ícone (+, lápis, −, =), número e cor própria. O contador zerado fica esmaecido. | Os contadores somam categorias e outros componentes; campos, formulários, pastas e o fluxo aparecem dentro da categoria. |
| RV-02 | Abaixo dos contadores, a frase "A lista mostra só as alterações." | A revisão não tem chave para mostrar o que não muda. |
| RV-03 | A lista deve mostrar só o que é novo, alterado ou removido, em 2 árvores: **Categorias** e **Outros componentes**. | O que fica inalterado entra só no contador Inalterados. |
| RV-04 | Cada categoria deve abrir em **Campos (N)**, **Formulários (N)**, **Pastas (N)** e **Fluxo (N etapas)**, com o total da categoria entre parênteses e, à direita, os contadores do grupo (+N, ~N, −N). | Exemplo: "Campos (12) +3 ~3 −1". |
| RV-05 | **Outros componentes** deve agrupar Listas, Telas, Grupos de permissão, Modelos de e-mail, Relatórios, Modelos de documento e Itens de menu, cada grupo com os contadores. | Grupo sem alteração não aparece. |
| RV-06 | Cada nó deve ter uma marca com ícone, cor e texto: **Novo**, **Alterado**, **Removido** ou **Inalterado**, concordando em gênero com o que marca. | "Nova" categoria, "Novo" campo, "Removida" pasta. A marca não depende só da cor. |
| RV-07 | O campo deve mostrar o tipo em linguagem de quem usa, ao lado do nome: Texto curto, Texto longo, Texto com formatação, Lista de opções, Valor em dinheiro, Data, Anexo, Ligação com outra categoria e os demais do `textos.ts`. | Nenhum nome técnico (`EnlDropdown`, `inputText`) aparece. |
| RV-08 | A alteração deve aparecer em estrutura, abaixo do nome: "Nome: <antes> → <depois>", "Tipo: <antes> → <depois>", "Opções novas: <lista>" e "Opções removidas: <lista>". O valor antigo vem riscado. | Exemplo: "Tipo: ~~Texto longo~~ → Texto com formatação". Nenhum JSON aparece. |
| RV-09 | O que é removido deve aparecer riscado. A categoria removida deve mostrar, em vermelho, "<N> itens cadastrados". | Exemplo: "~~Contratos de honorários~~ 48 itens cadastrados · Removida". |
| RV-10 | A categoria alterada deve abrir já expandida. A categoria nova ou removida deve vir recolhida, porque entra ou sai inteira. | A pessoa vê de cara o que muda por dentro. |
| RV-11 | Na Somente inclusão, o que existe nos 2 lados com diferença deve contar como Inalterado e ficar fora da lista. | Uma categoria que só ganha campos novos aparece como Alterada, e os campos como Novos. |
| RV-12 | **Workspace vazio**, ou arquivo sem nenhuma categoria em comum com o workspace (fora da Substituição total), não deve mostrar árvore: mostra o título ("Workspace vazio" ou "Nenhuma categoria do arquivo existe aqui"), o texto ("A importação adiciona:" ou "A importação adiciona tudo e não altera o que já existe:") e a lista das categorias do arquivo com a quantidade de campos, seguida de "+ <N> outros componentes". | A comparação só aparece quando há o que comparar. |
| RV-13 | Arquivo igual ao workspace deve mostrar o aviso "Nada a importar" com "O workspace já tem tudo o que está no arquivo." e só o botão **Fechar**. | O botão Importar não aparece. |
| RV-14 | O rodapé do passo 2 deve ter **Voltar** e **Importar**. | Voltar leva ao passo 1 com o arquivo e o modo mantidos. |

### Fluxo da categoria

O fluxo da categoria vem no arquivo em `c-type-flows` (o fluxo), `c-flow-stages` (as etapas), `c-stage-tasks` (as
tarefas programadas de cada etapa) e nas configurações da etapa: `c-stage-statuses`, `c-stage-routes`,
`c-stage-triggers`, `c-type-notifications`, `c-responsible-rules` e `c-type-conditionals`.

| ID | Requisito | Critério de aceite |
|---|---|---|
| RV-15 | Dentro da categoria, o grupo **Fluxo (N etapas)** deve listar as etapas que mudam, na ordem do fluxo, cada uma com a marca (RV-06). | Etapa é feminino: "Nova", "Alterada", "Removida". |
| RV-16 | Cada etapa deve abrir nas **tarefas** que mudam, com o nome da tarefa e o tipo de ação em linguagem de quem usa, e a marca. | Tarefa sem alteração não aparece. |
| RV-17 | A alteração da etapa e da tarefa deve aparecer em estrutura, como a do campo (RV-08), uma linha por propriedade que muda, com o nome da propriedade como a tela de configuração do fluxo o mostra. Exemplos: "Nome: <antes> → <depois>", "Posição: <antes> → <depois>", "Responsável: <antes> → <depois>". | Nenhum JSON aparece. A lista final de propriedades sai do schema de `c-flow-stages` e `c-stage-tasks`. |
| RV-18 | A mudança nas configurações da etapa (status, rotas para outra etapa, gatilhos, notificações, regras de responsável e condicionais) deve aparecer como uma linha por configuração, abaixo da etapa, com a marca e o que muda. | Exemplo: "Rota para Aprovação · Nova", "Notificação ao responsável · Alterada". |
| RV-19 | Rota ou condicional que aponta para uma etapa, um campo ou um status que não existe no workspace depois da importação deve aparecer com o aviso "Aponta para <nome>, que não existe neste workspace." | A pessoa vê a referência quebrada antes de importar. |
| RV-20 | Na Substituição total, a etapa removida deve mostrar, em vermelho, "<N> itens nesta etapa" e "<N> tarefas abertas", quando houver. | Exemplo: "~~Revisão jurídica~~ 12 itens nesta etapa · 4 tarefas abertas · Removida". |
| RV-21 | Categoria do arquivo com fluxo, entrando num workspace em que a categoria existe sem fluxo, deve mostrar o grupo Fluxo com todas as etapas como Novas. | Na Somente inclusão, o fluxo inteiro entra. |

## Confirmação (RC)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RC-01 | Abaixo da lista, a caixa **Baixar uma cópia do workspace antes**, marcada, com a ajuda "Depois de concluída, a migração não tem como ser desfeita." | Marcada, a importação baixa antes o mesmo arquivo do Exportar Workspace. Com o workspace vazio, a caixa não aparece. |
| RC-02 | Na **Substituição total** com algo a remover, deve aparecer o aviso de erro com o título "Remove tudo o que não está no arquivo, inclusive os itens cadastrados.", o texto "Para confirmar, digite seu e-mail:", o e-mail de quem está logado e um campo para digitá-lo. | É o mesmo padrão da exclusão de categoria em Estrutura › Categorias. |
| RC-03 | Na Substituição total, o botão deve se chamar **Substituir workspace**, na cor de erro, e ficar desabilitado até o e-mail digitado ser igual ao de quem está logado. | O campo mostra um ✓ quando o e-mail confere. |
| RC-04 | Nos outros modos, o botão se chama **Importar**, na cor primária, sem pedir e-mail. | Clicar inicia a migração (RG). |

## Migração em andamento (RG)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RG-01 | Iniciada a migração, a camada deve mostrar "Importando a estrutura", "Isso leva alguns minutos em workspaces grandes.", uma barra com porcentagem e as 5 etapas: "Conferindo o arquivo", "Criando categorias", "Criando campos e listas", "Montando formulários e telas", "Ajustando permissões e menus". | A etapa concluída tem ✓ verde; a atual, ícone girando; as próximas, círculo vazio. |
| RG-02 | A camada deve dizer "Pode fechar esta janela. Avisamos no sino quando terminar." | Fechar a camada não interrompe a migração. O sino avisa o fim (concluída ou falha). |
| RG-03 | O rodapé deve ter **Cancelar migração**, com contorno na cor de erro, e **Fechar**. | Cancelar migração interrompe a migração em andamento (RF-03). |
| RG-04 | Cancelar só deve existir enquanto a migração está em andamento. | Depois de concluída, nenhuma ação desfaz a migração. |

## Fim da migração (RF)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF-01 | **Concluída**: "Migração concluída" com o resumo por categoria, sem as partes zeradas, e o botão **Ver categorias**, que leva a Estrutura › Categorias. | Exemplo: "4 categorias novas, 2 categorias alteradas, 1 categoria removida." ou só "8 categorias novas.". |
| RF-02 | Com a cópia marcada (RC-01), a tela de concluída deve dizer "A cópia de antes da importação está na sua pasta de downloads." | Sem a cópia, a frase não aparece. |
| RF-03 | **Cancelada**: "Migração cancelada" com "Nada foi migrado." e o botão **Fechar**. | O workspace fica como estava antes da importação. |
| RF-04 | **Falha**: o aviso de erro "A migração falhou" com "Nada foi migrado.", e os botões **Fechar** e **Tentar de novo**. | O aviso não diz em que etapa parou. Tentar de novo inicia a migração com o mesmo arquivo e o mesmo modo. |
| RF-05 | Não deve existir botão nem ação de desfazer a migração. | A volta ao estado anterior é pela cópia (RC-01), importada com Substituição total. |
| RF-06 | Reabrir a camada depois de concluída, cancelada ou com falha deve começar do passo 1, sem arquivo. | Durante a migração em andamento, reabrir a camada mostra o andamento (RG). |

## Dados (RD)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RD-01 | O arquivo da exportação já traz o que a comparação precisa: `c-item-types`, `c-fields`, `c-forms`, `c-form-blocks`, `c-folders`, `c-lists`, `c-screens`, `c-menu-items`, `module-groups`, `group-email-templates`, `c-type-reports`, `c-document-templates` e as chaves do fluxo da categoria: `c-type-flows`, `c-flow-stages`, `c-stage-tasks`, `c-stage-statuses`, `c-stage-routes`, `c-stage-triggers`, `c-type-notifications`, `c-responsible-rules` e `c-type-conditionals`. | O resumo do arquivo (RA-05) e a revisão (RV) saem dele, sem dado novo na exportação. |
| RD-02 | O back-end deve reconhecer "a mesma coisa" nos 2 lados por chave estável, nunca pela posição. Proposta do protótipo: `slug` na categoria, `refId` no campo, nome no formulário e na pasta, `slug`, `reference` ou nome nos componentes; na etapa e na tarefa, que não têm `slug`, a chave fica com o back-end (`migration_hash`, se a exportação passar a gravar nelas, ou nome e categoria). O arquivo também traz `migration_hash`. | A chave final é decisão do back-end (Em aberto). Renomear uma categoria no arquivo aparece como "Nome: antes → depois", não como uma removida e outra nova. |
| RD-03 | O back-end deve calcular a prévia (o que entra, muda e sai em cada modo) a partir do arquivo e do workspace, antes de importar. | A revisão mostra o resultado de cada modo sem importar nada. |
| RD-04 | O pedido de migração (`POST /migration-requests`, hoje assíncrono, com status `pending` e `processing`) deve receber o modo escolhido. | Os 3 modos (RM) produzem resultados diferentes com o mesmo arquivo. |
| RD-05 | O back-end deve informar a etapa em andamento da migração, para a barra e as etapas de RG-01. | Sem essa informação, a tela não tem como mostrar o avanço real. |
| RD-06 | A migração deve ser tudo ou nada: cancelada ou com falha, nenhuma alteração fica no workspace. | RF-03 e RF-04 dizem "Nada foi migrado."; isso só é verdade se o back-end garantir. |
| RD-07 | O back-end deve aceitar cancelar uma migração em andamento. | RG-03 funciona. |
| RD-08 | A prévia deve trazer a quantidade de itens cadastrados em cada categoria que sai na Substituição total. | RV-09 mostra o número. |
| RD-09 | A prévia deve trazer, para cada etapa que sai na Substituição total, a quantidade de itens na etapa e de tarefas abertas dela. | RV-20 mostra os números. |
| RD-10 | A importação deve recriar as referências do fluxo (rota para outra etapa, condicional sobre um campo, regra de responsável, gatilho) apontando para as etapas, campos, status e membros do workspace de destino, pela mesma chave de RD-02. | Depois da importação, nenhuma rota ou condicional aponta para o id do workspace de origem. |

## Componentes e acessibilidade (RK)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RK-01 | A camada usa componentes do Nuxt UI: `UModal`, `UStepper` (indicador de etapas), `UFileUpload` (área de arraste), `URadioGroup` em cartões com opção desabilitada por item (modo), `UTree` (árvores), `UAlert` (avisos), `UCheckbox`, `UInput` e `UProgress`. | Nenhum CSS próprio no protótipo; a aparência vem de props e da prop `ui`. |
| RK-02 | Cor e espaço devem vir só de token semântico. | Nenhum hex cru. |
| RK-03 | A camada deve funcionar nos temas claro e escuro. | Marcas, contadores e avisos têm contraste nos 2 temas. |
| RK-04 | Todo texto deve existir em PT, EN e ES. | Trocar o idioma troca todos os textos, inclusive marcas e tipos de campo. |
| RK-05 | A camada deve ter movimento: o modo de importação entra com transição, os passos trocam com deslizamento, os contadores e a lista entram em cascata, e o aviso da Substituição total desce suave. Tudo deve respeitar `prefers-reduced-motion`. | Com movimento reduzido no sistema, nada anima. |
| RK-06 | O campo do e-mail deve ter `aria-label`; os botões de ícone também. | O leitor de tela lê o nome de cada controle. |
| RK-07 | As marcas da revisão não devem depender só da cor: cada uma tem ícone e texto, e o removido vem riscado. | A revisão se lê em tons de cinza. |

## Em aberto

| Pergunta | O que muda conforme a resposta |
|---|---|
| Qual chave o back-end usa para reconhecer a mesma categoria, campo e formulário: `slug` e `refId`, `migration_hash` ou outra? | Fecha RD-02. Com chave mais fraca (nome), renomear vira remover e criar. |
| A migração é tudo ou nada hoje? | Se não for, RF-03 e RF-04 não podem dizer "Nada foi migrado." e o cancelamento precisa de outro texto. |
| Na Substituição total, os itens das categorias removidas vão para a lixeira ou são apagados de vez? | Muda o aviso de RM-06 e de RC-02 (hoje "Remove ... inclusive os itens cadastrados"). |
| O Spaceflow (fluxos de `/workflows`) também deve migrar? Hoje ele não está no arquivo de exportação: as chaves `c-type-flows`, `c-flow-stages` e `c-stage-tasks` são o fluxo da categoria. | Se sim, a exportação passa a levar os fluxos do Spaceflow e a revisão ganha o grupo Spaceflow em Outros componentes. |
| Na Substituição total, para onde vão os itens de uma etapa removida e as tarefas abertas dela? | Define o texto de RV-20 e talvez uma escolha de etapa de destino na confirmação (RC). |
| Responsável de tarefa que é membro do workspace de origem e não existe no destino: a tarefa entra sem responsável, com o responsável padrão da etapa ou não entra? | Define o aviso de RV-19 para membros. |
| A lista de etapas do carregamento (RG-01) ganha "Montando fluxos e tarefas"? O carregamento aprovado tem 5 etapas e não cita o fluxo. | Muda RG-01. |
| Quem pode importar: só administrador do workspace? | Define se a camada precisa de estado "sem permissão". |
| Há limite de tamanho do arquivo? | Entra um aviso em RA-03 com o limite. |

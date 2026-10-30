# 2. Revisão

**Objetivo:** antes de confirmar, quem importa vê a situação de cada entidade no modo escolhido (nova, alterada,
removida ou inalterada) e só o que muda, em estrutura e nunca em JSON, sem alterar o workspace.

**Depende de:** 1. Arquivo e modo.

**Onde vale:** o passo "Revisar" da camada "Importar estrutura", na tela Casos de Uso.

**Protótipo:** https://pernalombr4.github.io/prototipos/migracao-de-workspace/, botão "Protótipo: usar arquivo de
exemplo" e Continuar. Os cenários "Workspace vazio" e "Já igual ao arquivo" se abrem pela barra inferior.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Uma entidade do arquivo é considerada correspondente de uma entidade do workspace quando as 2 têm chaves de identidade iguais. | A categoria `processos_judiciais` é a mesma nos 2 lados, mesmo com o nome "Processos judiciais" num e "Processos judiciais trabalhistas" no outro. | Obrigatório |
| RN002 | A tabela a seguir define a situação de cada entidade na migração. Política: Única. | Linha 8: a categoria "Contratos de honorários", só no workspace, sai com os 48 itens na Substituição total. | Obrigatório |
| RN009 | Cada tipo de entidade que o arquivo de estrutura leva deve entrar na migração e na prévia. | O fluxo da categoria aparece na prévia com as etapas; um tipo novo que a exportação passar a levar aparece sem requisito novo. | Obrigatório |

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

## Prévia (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | Quando o membro clica em Continuar, o sistema deve calcular a situação de cada entidade conforme RN001, RN002 e RN009, para o modo escolhido, sem alterar o workspace. | Exemplo: na Inclusão e atualização, "Processos judiciais" aparece Alterada, "Garantias" Nova e "Contratos de honorários" fica fora da lista (RN002.7); o workspace continua com 5 categorias. | Essencial | Obrigatório |
| RF012 | Quando a prévia é calculada, o sistema deve mostrar os contadores Novos, Alterados, Removidos e Inalterados com a quantidade de categorias e de entidades fora das categorias em cada situação. | Exemplo: Inclusão e atualização com o arquivo de exemplo mostra 15 Novos, 3 Alterados, 0 Removidos e 9 Inalterados; o contador zerado aparece esmaecido. | Importante | Obrigatório |
| RF013 | O sistema deve listar na prévia só as entidades nas situações Novo, Alterado e Removido, com a frase "A lista mostra só as alterações." acima da lista. | "Partes", igual nos 2 lados, fica fora da lista e conta em Inalterados; não existe chave para mostrar o que não muda. | Importante | Obrigatório |
| RF014 | O sistema deve organizar a lista em Categorias, com as entidades de cada categoria agrupadas por tipo dentro dela, e em Outros componentes, com as entidades fora das categorias agrupadas por tipo, cobrindo cada tipo de entidade da RN009. | Exemplo: "Processos judiciais" mostra "Campos (12) +3 ~3 −1", "Formulários (3) +1", "Pastas (3) +1" e "Fluxo (5 etapas) +1 ~1 −1"; categoria alterada abre expandida, nova e removida vêm recolhidas. | Essencial | Obrigatório |

## Entidade na lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF015 | O sistema deve mostrar em cada entidade a situação, com ícone, cor e texto concordando em gênero, e, na entidade alterada, cada propriedade que muda como "<propriedade>: <valor atual riscado> → <valor do arquivo>". | Exemplos: "Nome: Vara → Vara ou tribunal"; "Tipo: Texto longo → Texto com formatação"; "Opções novas: Curitiba, Porto Alegre"; "Garantias" mostra "Nova" e o campo "Instância" mostra "Novo". | Essencial | Obrigatório |
| RF016 | O sistema deve mostrar, ao lado do nome de cada entidade que tem tipo, o tipo pelo nome da tela de configuração daquela entidade. | Exemplo: o campo "Comarca" (`EnlDropdown`) mostra "Lista de opções"; tipo sem nome mapeado mostra "Outro tipo". | Importante | Obrigatório |
| RF017 | Quando a prévia tem uma categoria Removida, o sistema deve mostrar o nome riscado e, em vermelho, a quantidade de itens cadastrados nela. | Exemplo: "Contratos de honorários advocatícios com escritórios parceiros", riscada, com "48 itens cadastrados" e a marca "Removida". | Essencial | Obrigatório |

## Casos sem lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | Enquanto o workspace de destino é um workspace vazio, o sistema deve mostrar no passo Revisar o título "Workspace vazio", o texto "A importação adiciona:" e as categorias do arquivo com a quantidade de campos, no lugar dos contadores e da lista. | Exemplo: arquivo com 8 categorias num workspace vazio mostra as 8, sem contadores. | Importante | Obrigatório |
| RF032 | Enquanto as entidades do arquivo não têm correspondente no workspace e o modo não é Substituição total, o sistema deve mostrar o título "Nenhuma categoria do arquivo existe aqui", o texto "A importação adiciona tudo e não altera o que já existe:" e as categorias do arquivo, no lugar dos contadores e da lista. | Exemplo: workspace com "Compras" e arquivo só com "Garantias" e "Multas", na Somente inclusão. Na Substituição total vale RF014. | Desejável | Desejável |
| RF022 | Se a prévia não tem entidade Nova, Alterada ou Removida, o sistema deve mostrar o aviso "Nada a importar" com "O workspace já tem tudo o que está no arquivo." e oferecer só o botão Fechar. | Exemplo: o arquivo exportado do próprio workspace mostra o aviso, sem o botão Importar. | Desejável | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI002 | Prévia da migração, rota <a definir> | Deve devolver a situação de cada entidade conforme RN002 e RN009, os itens das categorias removidas e os itens e tarefas abertas das etapas removidas, sem alterar o workspace. | Obrigatório |

## Não funcionais (RNF)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RNF001 | As marcas de situação devem atender à WCAG 2.2 AA, critério 1.4.1 (uso de cor). | Em tons de cinza, Novo, Alterado, Removido e Inalterado se distinguem pelo ícone e pelo texto, nos temas claro e escuro. | Importante | Obrigatório |

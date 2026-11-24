# 1. Tabela de categorias

**Objetivo:** o administrador vê e muda o que o cargo faz em cada categoria numa linha só, com 4 caixas, e libera ou
tira uma ação em várias categorias de uma vez.

**Onde vale:** a seção Categorias da aba Dados, na tela do cargo.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, aba Dados, seção Categorias.

## Tabela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | A seção Categorias deve mostrar 1 linha por categoria do workspace, com as colunas Categoria, Criar, Ver, Atualizar, Excluir, Campos, Formulários e o botão Ajustar. | Exemplo: workspace com 120 categorias mostra 120 linhas de 4 caixas, sem caixa de campo na tabela. | Essencial | Obrigatório |
| RF002 | Cada caixa de ação deve ligar ou desligar a ação do cargo na categoria daquela linha. | Marcar Ver em "Contratos de Clientes" e salvar dá ao cargo a permissão de ver os itens da categoria. | Essencial | Obrigatório |
| RF003 | A linha da categoria deve mostrar abaixo do nome a quantidade de campos e de formulários da categoria. | "24 campos · 3 formulários". | Desejável | Desejável |
| RF004 | A linha alterada e ainda não salva deve mostrar "Alterada, não salva". | Marcar Criar numa categoria mostra o aviso na linha até salvar ou descartar. | Importante | Obrigatório |

## Busca e filtros (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF005 | O campo "Buscar categoria" deve filtrar as linhas pelo nome da categoria a cada letra digitada. | Exemplo: "contr" deixa só as categorias com "contr" no nome, sem diferença de maiúscula e acento. | Essencial | Obrigatório |
| RF006 | A tabela deve ter os filtros Todas, Com acesso, Sem acesso e Alteradas, cada um com a contagem de categorias. | Com acesso conta a categoria com ao menos 1 ação; Sem acesso, a categoria sem nenhuma; Alteradas, a categoria com alteração não salva. | Importante | Obrigatório |
| RF007 | Com busca ou filtro, a tabela deve mostrar "Mostrando {n} de {total} categorias". | "Mostrando 12 de 120 categorias". | Importante | Obrigatório |
| RF008 | Sem resultado na busca, a tabela deve mostrar "Nenhuma categoria com esse nome" e o botão "Limpar busca". | "Limpar busca" volta a mostrar todas as categorias. | Importante | Obrigatório |
| RF009 | Sem resultado no filtro, a tabela deve mostrar "Nenhuma categoria neste filtro" e o botão "Ver todas". | "Ver todas" volta ao filtro Todas. | Importante | Obrigatório |
| RF010 | No workspace sem categorias, a seção deve mostrar "Este workspace ainda não tem categorias". | O workspace novo mostra o aviso no lugar da tabela. | Desejável | Desejável |

## Caixa de coluna (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | O cabeçalho de cada ação deve ter uma caixa que marca ou desmarca a ação em cada categoria da lista filtrada. | Exemplo: busca "Filial Sul" com 40 categorias; marcar Excluir no cabeçalho liga Excluir nas 40, e as outras 80 ficam como estavam. | Essencial | Obrigatório |
| RF012 | A caixa de coluna deve mostrar marcada com a ação em cada categoria da lista, traço com a ação em parte delas e vazia com 0 categorias com a ação. | 40 categorias na lista, 12 com Ver: a caixa de Ver mostra o traço. | Essencial | Obrigatório |
| RF013 | A caixa de coluna deve ter o nome acessível com a ação e a quantidade. | "Marcar Excluir nas 40 categorias da lista". | Importante | Obrigatório |
| RF014 | Depois da caixa de coluna, a tela deve mostrar o toast "{ação} marcado em {n} categorias", com "Desfazer" por 6 s. | "Desfazer" volta as 40 categorias ao estado de antes, inclusive o Ver que veio junto. | Essencial | Obrigatório |

## Ver exigido (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF015 | Marcar Atualizar ou Excluir deve marcar Ver na mesma categoria e travar a caixa de Ver (RN901). | Marcar Excluir em "Reembolsos" marca Ver, que fica desabilitado. | Essencial | Obrigatório |
| RF016 | O Ver travado deve mostrar um cadeado com a dica "Exigido por {ação}. Desmarque {ação} para tirar Ver.". | O cadeado de Ver em "Reembolsos" diz "Exigido por Excluir. Desmarque Excluir para tirar Ver.". | Importante | Obrigatório |
| RF022 | O cadeado do Ver travado deve receber foco pelo teclado e abrir a dica no foco. | Com Tab até o cadeado, a dica aparece. | Importante | Obrigatório |
| RF017 | Desmarcar Atualizar e Excluir deve destravar Ver e manter Ver marcado. | Desmarcar Excluir em "Reembolsos" deixa Ver marcado e liberado. | Importante | Obrigatório |

## Célula parcial (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF018 | A caixa da ação que vale só em parte dos campos ou dos formulários da categoria deve mostrar o traço. | Ver em 76 de 80 campos de "Contratos" mostra o traço em Ver. | Essencial | Obrigatório |
| RF019 | A caixa com traço por campo deve ter a dica "{ação} em {n} de {total} campos. Clique para ajustar.". | Ver em 76 de 80 campos mostra "Ver em 76 de 80 campos. Clique para ajustar.". | Importante | Obrigatório |
| RF023 | O clique na caixa com traço por campo deve abrir Ajustar na aba Campos. | O clique no traço de Ver em "Contratos" abre Ajustar › Campos de "Contratos". | Importante | Obrigatório |
| RF020 | A caixa com traço por formulário deve ter a dica "{ação} só em: {formulários}. Clique para liberar em todos os formulários.". | Ver só em Criminal mostra "Ver só em: Criminal. Clique para liberar em todos os formulários.". | Importante | Obrigatório |
| RF024 | O clique na caixa com traço por formulário deve liberar a ação em cada formulário da categoria. | Ver só em Criminal em "Processos Judiciais": o clique marca Ver em Cível, Criminal e Trabalhista. | Importante | Obrigatório |

## Sem permissão para editar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | Para quem não tem a permissão de atualizar cargos, a tela deve mostrar "Você vê este cargo, mas não edita." e desabilitar cada caixa. | O membro sem a permissão vê as caixas no estado salvo e não consegue marcar nenhuma. | Essencial | Obrigatório |

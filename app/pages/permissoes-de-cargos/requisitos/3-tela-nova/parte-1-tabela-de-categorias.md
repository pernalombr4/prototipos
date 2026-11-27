# 1. Tabela de categorias

**Objetivo:** o administrador vê e muda o que o cargo faz em cada categoria numa linha só, com 4 caixas, e libera ou
tira uma ação em várias categorias de uma vez.

**Onde vale:** a tela do cargo, abas Categorias e Funcionalidades.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, aba Categorias.

## Abas da tela do cargo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF025 | A aba Dados deve virar 2 abas no topo: Categorias, que abre primeiro, e Funcionalidades. As abas ficam Categorias, Funcionalidades, Configurações e Inválidas, cada uma com a contagem "{marcadas}/{total}" como hoje. | Abrir o cargo mostra Categorias; a contagem de Categorias soma as ações de categoria e de formulário. | Essencial | Obrigatório |
| RF035 | Cada permissão deve cair na aba que o código já usa para separar a árvore: o que começa com `types::<slug>` em Categorias; o grupo das permissões que não são categoria nem configuração em Funcionalidades; `settings::` e os prefixos de administração em Configurações. | Uma referência nova `tasks::...` aparece em Funcionalidades sem mudar a regra das abas. | Essencial | Obrigatório |
| RF026 | Trocar de aba não deve perder as alterações não salvas. | Marcar Ver numa categoria, ir a Funcionalidades e voltar mantém Ver marcado e "Alterada, não salva". | Essencial | Obrigatório |

## Tabela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | A aba Categorias deve mostrar 1 linha por categoria do workspace, com as colunas Categoria, Criar, Ver, Atualizar, Excluir e Restrições. | Exemplo: workspace com 120 categorias mostra 120 linhas de 4 caixas, sem caixa de campo na tabela. | Essencial | Obrigatório |
| RF002 | Cada caixa de ação deve ligar ou desligar a ação do cargo na categoria daquela linha. | Marcar Ver em "Contratos de Clientes" e salvar dá ao cargo a permissão de ver os itens da categoria. | Essencial | Obrigatório |
| RF003 | A linha da categoria deve mostrar abaixo do nome a quantidade de campos e de formulários da categoria. | "24 campos · 3 formulários". | Desejável | Desejável |
| RF004 | A linha alterada e ainda não salva deve mostrar "Alterada, não salva". | Marcar Criar numa categoria mostra o aviso na linha até salvar ou descartar. | Importante | Obrigatório |

## Categoria aberta (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF027 | O clique no nome da categoria ou na seta deve abrir, na própria tabela, as sublinhas da categoria; o segundo clique fecha. | O clique em "Processos Judiciais" mostra as sublinhas abaixo dela, sem sair da tabela. | Essencial | Obrigatório |
| RF028 | As sublinhas devem vir nesta ordem: cada formulário, "Itens sem formulário" quando a categoria tem a origem, e Campos. | "Processos Judiciais" mostra Cível, Criminal, Trabalhista e Campos. | Essencial | Obrigatório |
| RF029 | O nome e a seta devem ter o nome acessível "Mostrar formulários, campos e quais itens de {categoria}" e dizer se a categoria está aberta. | O leitor de tela lê o nome e "expandido" ou "recolhido". | Importante | Obrigatório |
| RF030 | Várias categorias podem ficar abertas ao mesmo tempo. | Abrir "Contratos" com "Processos Judiciais" aberta mantém as 2 abertas. | Desejável | Desejável |

## Coluna Restrições (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF031 | A coluna Restrições deve mostrar 1 resumo por limite da categoria: "{n} de {total} formulários" quando ao menos 1 formulário fica sem ação, "Formulários em parte" quando cada formulário tem ao menos 1 ação e ao menos 1 ação tem traço, e "{n} de {total} campos" com campos escolhidos. | Ver só em Criminal mostra "1 de 3 formulários"; Ver em 76 de 80 campos mostra "76 de 80 campos". | Essencial | Obrigatório |
| RF032 | A categoria sem limite deve mostrar "Sem restrição", e a categoria sem ação, "Sem acesso". | "Fornecedores" com as 4 ações inteiras mostra "Sem restrição". | Importante | Obrigatório |
| RF033 | Cada resumo deve ser um botão com ícone e dica: no de formulários, cada ação restrita com os formulários, até 3, ou "{ação} em {n} de {total}". | O resumo "1 de 3 formulários" tem a dica "Criar: Criminal · Ver: Criminal · Atualizar: Criminal". | Importante | Desejável |
| RF034 | O clique num resumo deve abrir a categoria (RF027). Com a categoria já aberta, ela continua aberta. | O clique em "1 de 3 formulários" mostra as sublinhas de "Processos Judiciais". | Essencial | Obrigatório |

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
| RF016 | O Ver travado deve mostrar um cadeado que abre um popover com o título "Exigido por {ação}." e o texto "Desmarque {ação} para tirar Ver.". O popover abre no hover e no clique do cadeado ou da caixa; o clique fixa o popover até clicar fora ou apertar Esc. | O clique no cadeado de Ver em "Reembolsos" abre "Exigido por Excluir." e o popover fica aberto ao tirar o mouse. | Importante | Obrigatório |
| RF022 | O cadeado do Ver travado deve receber foco pelo teclado e abrir o popover com Enter ou espaço. | Com Tab até o cadeado e Enter, o popover abre; Esc fecha. | Importante | Obrigatório |
| RF017 | Desmarcar Atualizar e Excluir deve destravar Ver e manter Ver marcado. | Desmarcar Excluir em "Reembolsos" deixa Ver marcado e liberado. | Importante | Obrigatório |

## Célula parcial (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF018 | A caixa da ação que vale só em parte dos campos ou dos formulários da categoria deve mostrar o traço. | Ver em 76 de 80 campos de "Contratos" mostra o traço em Ver. | Essencial | Obrigatório |
| RF019 | A caixa com traço por campo deve ter a dica "{ação} em {n} de {total} campos. Clique para escolher os campos.". | Ver em 76 de 80 campos mostra "Ver em 76 de 80 campos. Clique para escolher os campos.". | Importante | Obrigatório |
| RF023 | O clique na caixa com traço por campo deve abrir a camada "Campos de {categoria}", sem apagar a escolha feita. | O clique no traço de Ver em "Contratos" abre "Campos de Contratos". | Importante | Obrigatório |
| RF020 | A caixa com traço por formulário deve ter a dica "{ação} só em: {formulários}. Clique para liberar em todos os formulários.". | Ver só em Criminal mostra "Ver só em: Criminal. Clique para liberar em todos os formulários.". | Importante | Obrigatório |
| RF024 | O clique na caixa com traço por formulário deve liberar a ação em cada formulário da categoria. | Ver só em Criminal em "Processos Judiciais": o clique marca Ver em Cível, Criminal e Trabalhista. | Importante | Obrigatório |

## Sem permissão para editar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | Para quem não tem a permissão de atualizar cargos, a tela deve mostrar "Você vê este cargo, mas não edita." e desabilitar cada caixa. | O membro sem a permissão vê as caixas no estado salvo e não consegue marcar nenhuma. | Essencial | Obrigatório |

# 3. Seções pessoais

**Objetivo:** a pessoa cria seções no próprio Início, põe nelas menus e categorias do workspace e, nos menus que o
workspace criou, submenus. Tirar da seção não exclui nada.

**Depende de:** 1. Preferências guardadas e a janela Personalizar.

**Onde vale:** o painel do Início e a aba "Seções e menus" da janela "Personalizar".

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, seção "Rotina do jurídico".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | Uma seção pessoal só aparece para a pessoa que a criou. | "Rotina do jurídico", de Ana, não aparece para Bruno. | Obrigatório |
| RN202 | Tirar um menu de uma seção pessoal ou de outro menu não exclui o menu: o menu continua existindo e pode voltar. | Contratos sai de "Rotina do jurídico" e volta pelo "+" da seção. | Obrigatório |
| RN203 | Uma seção pessoal só mostra o menu que a pessoa pode abrir pelos grupos permitidos do menu no workspace. | Menu restrito ao grupo Comercial some da seção pessoal de quem sai do grupo. | Obrigatório |

## Criar e mexer na seção (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | "Criar seção" deve abrir uma janela com ícone e nome; a seção criada entra no topo das seções do Início (RN201). | Criar "Rotina do jurídico": a seção aparece acima de Favoritos. | Essencial | Obrigatório |
| RF202 | No hover, o título de uma seção pessoal deve mostrar os botões "…" e "+". | Passar o mouse em "Rotina do jurídico" mostra os 2 botões. | Importante | Obrigatório |
| RF203 | O "…" da seção pessoal deve ter "Renomear", "Adicionar", "Ordenar seção" (personalizada, alfabética, adicionadas por último), "Criar seção", "Reordenar seções", "Mostrar na seção", "Ocultar seção" e "Excluir seção". | Ordenar "alfabética" reordena os itens da seção na hora. | Importante | Obrigatório |
| RF204 | "Renomear" deve abrir a janela de criar seção, preenchida. | Renomear "Rotina do jurídico" abre a janela com o nome atual. | Importante | Obrigatório |
| RF205 | "Excluir seção" deve tirar a seção do Início da pessoa e avisar "<nome> foi excluída."; os menus que estavam nela continuam no workspace (RN202). | Excluir "Rotina do jurídico": Contratos continua em Categorias. | Essencial | Obrigatório |
| RF206 | As seções do Início devem se reordenar arrastando pelo título e por Alt com as setas no título. | Arrastar Favoritos acima de "Rotina do jurídico" troca a ordem. | Importante | Desejável |

## Menus e submenus da seção (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF211 | O "+" da seção pessoal deve abrir a janela "Adicionar em <nome da seção>", que busca os menus e as categorias do workspace que ainda não estão na seção e põe o escolhido nela (RN203). | Buscar "contratos" e escolher: Contratos entra na seção e sai da lista. | Essencial | Obrigatório |
| RF212 | Seção pessoal vazia deve mostrar a linha "Adicionar à seção", que abre a janela "Adicionar em <nome da seção>". | Seção nova mostra a linha até receber o primeiro menu. | Importante | Obrigatório |
| RF213 | O menu que o workspace criou deve receber submenus pela ação "Adicionar submenu", que abre a janela "Adicionar em <nome do menu>" (RN903 e RN904). | Políticas internas recebe Base de Conhecimento; Logs de auditoria não tem a ação. | Essencial | Obrigatório |
| RF214 | Os submenus devem aparecer embaixo do menu, num terceiro recuo. | Políticas internas mostra Base de Conhecimento embaixo, com recuo maior. | Essencial | Obrigatório |
| RF225 | O menu com submenus deve abrir e fechar pela seta. | A seta de Políticas internas esconde e mostra Base de Conhecimento. | Importante | Obrigatório |
| RF215 | Os itens de uma seção pessoal e os submenus de um menu devem se reordenar arrastando e por Alt com as setas. | Arrastar Contratos acima de Políticas internas dentro da seção. | Importante | Desejável |
| RF216 | Arrastar um item de uma seção pessoal para outra seção pessoal deve mover o item para a outra seção. | Arrastar Contratos de "Rotina do jurídico" para "Comercial do dia". | Importante | Desejável |
| RF217 | "Tirar da seção" e "Tirar do menu" devem tirar o atalho e avisar "<nome> saiu da seção. Ele continua existindo e pode voltar pelo "+"." ou "<nome> saiu do menu. Ele continua existindo e pode voltar.", com "Desfazer" (RN202). | Tirar Contratos e clicar em "Desfazer": Contratos volta ao mesmo lugar. | Essencial | Obrigatório |
| RF218 | Arrastar um menu para dentro de um submenu, ou um menu com submenus para dentro de outro menu, deve ser recusado com o aviso "O menu tem no máximo 3 níveis: seção, menu e submenu. Submenu não recebe submenu." (RN903). | Soltar Contratos dentro de Base de Conhecimento: Contratos volta ao lugar, e o aviso aparece. | Essencial | Obrigatório |
| RF219 | Arrastar para dentro de um destino nativo, tela nativa, tela de módulo ou categoria deve ser recusado com o aviso "Menu nativo não recebe submenu. Solte dentro de uma seção." (RN904). | Soltar Contratos dentro de Relatórios: o aviso aparece. | Essencial | Obrigatório |

## Na janela Personalizar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF221 | A aba "Seções e menus" deve listar, em "No Início", as seções do Início, com os menus e os submenus de cada seção pessoal, e reordenar as seções arrastando e por Alt com as setas. | "Rotina do jurídico" mostra Políticas internas e, embaixo, Base de Conhecimento. | Importante | Obrigatório |
| RF222 | A aba "Seções e menus" deve listar as seções ocultas em "Seções ocultas", com o botão que mostra de novo, e ter "Criar seção". | Mostrar Favoritos devolve a seção ao Início. | Importante | Desejável |
| RF223 | Na aba "Seções e menus", a linha de cada seção do Início deve mostrar no hover "Excluir seção" (só na seção pessoal) e "Ocultar seção", nessa ordem, à esquerda do "+", que fica à vista sem o hover. | Passar o mouse em "Rotina do jurídico" mostra a lixeira, o olho riscado e o "+", da esquerda para a direita. | Importante | Desejável |
| RF224 | Na aba "Seções e menus", cada menu de seção pessoal deve ter o "⋯" com "Mover para cima", "Mover para baixo", "Adicionar submenu" (RN904) e "Tirar da seção"; cada submenu, com mover e "Tirar do menu". | O "⋯" de Logs de auditoria não tem "Adicionar submenu"; o de Políticas internas tem. | Importante | Obrigatório |

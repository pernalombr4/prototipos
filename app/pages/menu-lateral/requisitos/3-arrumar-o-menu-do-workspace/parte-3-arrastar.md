# 3. Arrastar

**Objetivo:** quem configura o workspace arrasta linhas e seções do menu do workspace direto na barra. O lugar
recusado fica vermelho, e o aviso diz o motivo.

**Depende de:** 1. Submenu e rascunho.

**Onde vale:** as linhas, os títulos de seção e os ícones de seção do menu do workspace.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, arrastar em Comercial.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | Início, Dados e Configurações ficam onde estão na trilha; só as seções mudam de lugar na trilha. | Arrastar Dados para baixo de Comercial é recusado. | Obrigatório |
| RN202 | A tabela a seguir define onde cada tipo de linha pode ser solto. Política: Única, a primeira linha que casa decide. | Linha 5: Contratos (categoria) solto dentro de Comercial é recusado. | Obrigatório |

| Linha | O que é solto | Onde | Resultado | Motivo na tela |
|---|---|---|---|---|
| 1 | qualquer | dentro de Integrações, ou um item de Integrações em qualquer lugar | recusado | "Integrações tem ordem fixa, como Configurações: nada entra, sai ou muda de lugar." |
| 2 | qualquer | dentro de um destino nativo, tela nativa, tela de módulo ou categoria (RN903) | recusado | "Menu nativo não recebe submenu. Solte dentro de uma seção." |
| 3 | qualquer | dentro de um submenu; ou um menu com submenus dentro de outro menu (RN902) | recusado | "O menu tem no máximo 3 níveis: seção, menu e submenu. Submenu não recebe submenu." |
| 4 | seção ou destino nativo | dentro de uma seção ou de um menu | recusado | "Seção não entra dentro de seção nem de menu." |
| 5 | categoria | fora da seção Categorias | recusado | "Categoria só entra na seção Categorias." |
| 6 | menu | dentro da seção Categorias | recusado | "A seção Categorias só aceita categoria." |
| 7 | Início, Dados ou Configurações | outro lugar da trilha (RN201) | recusado | "Início, Dados e Configurações ficam onde estão. Só as seções mudam de lugar na trilha." |
| 8 | qualquer outro caso | qualquer outro lugar | aceito | (sem aviso) |

## Arrastar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | Ao passar o mouse numa linha ou num título de seção do menu do workspace, o sistema deve mostrar a alça de arraste no lugar do ícone, sem mover o texto. | O rótulo não anda quando a alça aparece. | Essencial | Obrigatório |
| RF202 | Arrastar uma linha pela metade de cima ou de baixo de outra deve soltá-la antes ou depois dela. | Arrastar Clientes abaixo de Chamados troca a ordem. | Essencial | Obrigatório |
| RF203 | Arrastar uma linha para o terço do meio de um título de seção deve pô-la dentro da seção, como último item; as bordas do título soltam antes ou depois da seção. | Soltar Painel de vendas no meio de Análise põe o menu dentro de Análise. | Essencial | Obrigatório |
| RF204 | Arrastar um título de seção, ou o ícone de uma seção na trilha, deve mover a seção inteira. | Arrastar Comercial acima de Análise move os menus juntos. | Essencial | Obrigatório |
| RF205 | Enquanto a linha está no ar, o sistema deve mostrar a marca do lugar onde a linha vai cair. | A linha de 2 px aparece entre as linhas de destino. | Importante | Obrigatório |
| RF206 | Só deve haver alça de arraste no menu do workspace para quem cumpre a RN901. | Membro com licença Basic: nenhuma linha do menu do workspace mostra a alça. | Essencial | Obrigatório |
| RF207 | O arraste aceito deve entrar no rascunho, com a bolinha amarela na linha movida. | Soltar Painel de vendas em Análise acende a bolinha e o cartão "Alterações não salvas". | Essencial | Obrigatório |

## Regras de encaixe (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF211 | Enquanto a linha está sobre um lugar recusado pela RN202, o destino deve ficar vermelho. | Arrastar Contratos sobre Comercial pinta Comercial de vermelho. | Essencial | Obrigatório |
| RF212 | Se a pessoa solta num lugar recusado pela RN202, o sistema deve deixar a linha onde estava e mostrar o motivo da tabela num aviso. | Soltar Logs de auditoria em Integrações: o aviso da linha 1 aparece, e o item continua em Auditoria. | Essencial | Obrigatório |
| RF213 | As linhas de Integrações e de Configurações não devem mostrar alça de arraste (RN904). | Passar o mouse em Credenciais não mostra alça. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | O arraste aceito deve ser anunciado ao leitor de tela? Hoje o aviso só aparece quando a soltura falha. | acessibilidade | Um requisito de anúncio. |
| P202 | A linha 4 recusa também destino nativo dentro de seção, com o texto de seção. Ganha texto próprio? | produto | Um motivo novo na tabela. |

# 1. Trilha, painel e menu flutuante

**Objetivo:** a barra lateral passa a ter a trilha, com 1 ícone por área, e o painel, com o menu da área aberta. O
menu de outra área abre ao lado do ícone sem sair da tela, e a barra recolhe para só a trilha.


**Onde vale:** a barra lateral de toda tela de um workspace.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | A trilha mostra no máximo 8 ícones de área, contando o Início. As áreas que passam disso ficam em "Mais". | Workspace com 9 áreas: 8 na trilha, 1 em "Mais". | Obrigatório |
| RN002 | O Início é o primeiro ícone da trilha em todo workspace. | O primeiro ícone abaixo do workspace é o Início. | Obrigatório |
| RN003 | Fechar uma seção só fecha a seção, sem trocar a tela aberta. | Recolher Categorias não abre uma categoria. | Obrigatório |
| RN004 | Cada seção de Configurações > Interface > Menus é uma área da trilha, com as telas dela no painel, na ordem e com os grupos permitidos que a tela de Menus define (RN903). | A seção Comercial, com 3 telas, vira o ícone Comercial na trilha. | Obrigatório |

## Trilha (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O sistema deve mostrar a trilha à esquerda de toda tela do workspace, com os ícones nesta ordem: Início, Dados, Análise, Auditoria, as seções do workspace (RN004), Integrações e Configurações (RN002). | Exemplo: workspace com a seção Comercial mostra Início, Dados, Análise, Auditoria, Comercial, Integrações e Configurações. | Essencial | Obrigatório |
| RF002 | Cada ícone da trilha deve mostrar embaixo o nome da área, em 1 linha, cortado com reticências quando não cabe. | "Configurações" aparece como "Configur…". | Essencial | Obrigatório |
| RF003 | Abaixo do último ícone de área, a trilha deve mostrar o botão "Mais", com o ícone de 3 pontos. | O botão aparece em todo workspace, logo abaixo de Configurações. | Essencial | Obrigatório |
| RF004 | Quando a pessoa clica em "Mais", o sistema deve abrir ao lado uma grade de 3 colunas com as áreas que não couberam na trilha (RN001). | Exemplo: com 2 seções a mais que o teto, a grade mostra as 2. | Essencial | Obrigatório |
| RF005 | O botão direito num ícone da trilha deve abrir o menu com "Abrir em nova aba", "Copiar link" e "Recolher menu". | Botão direito em Auditoria mostra os 3 itens; o menu do navegador não abre. | Importante | Desejável |

## Abrir uma área (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | Quando a pessoa clica num ícone de área, o sistema deve mostrar o menu da área no painel e abrir a primeira tela dela (RN902). | Exemplo: clicar em Auditoria mostra o painel Auditoria e abre Logs de auditoria. | Essencial | Obrigatório |
| RF012 | Quando a pessoa clica no Início, o sistema deve abrir a página inicial e o menu Início, também quando o Início já está aberto. | Com o Início aberto em Tarefas > Agendadas, clicar no Início volta para a página inicial. | Essencial | Obrigatório |
| RF013 | Quando a pessoa clica em Dados, o sistema deve abrir a primeira categoria favorita e, sem favorita, a primeira categoria de Categorias. | Com Contratos como primeira favorita, clicar em Dados abre Contratos. | Importante | Obrigatório |
| RF014 | O ícone da área aberta deve mostrar o estado ativo por fundo e cor do ícone e levar `aria-current="page"`. | Com Auditoria aberta, só o ícone de Auditoria tem o fundo de ativo. | Essencial | Obrigatório |
| RF015 | Quando uma tela abre por link, por voltar ou pela busca, o sistema deve abrir no painel a área que contém a tela. | Abrir o link de Logs de requisição a partir do Início troca o painel para Auditoria. | Essencial | Obrigatório |

## Painel (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | O painel deve mostrar no topo o nome da área aberta e, embaixo, o menu dela, com rolagem própria. | Com Auditoria aberta, o topo diz "Auditoria" e só o menu rola. | Essencial | Obrigatório |
| RF022 | A largura padrão da barra com o painel aberto deve ser 304 px: 72 px da trilha e 232 px do painel. | Medido no navegador, sem largura salva: 304 px. | Importante | Desejável |
| RF023 | A linha da tela aberta deve mostrar o estado ativo por fundo, peso da fonte e cor do ícone, e levar `aria-current="page"`. | Com Logs de auditoria aberto, a linha tem fundo e texto em negrito. | Essencial | Obrigatório |
| RF024 | O estado ativo da linha e do ícone não deve depender só de cor. | Em tons de cinza, a linha ativa se distingue pelo fundo e pelo peso da fonte. | Essencial | Obrigatório |
| RF025 | Em repouso, o cabeçalho do painel deve mostrar só o nome da área; com o mouse no painel ou o foco nos botões, mostra também a lupa e "Recolher menu". | Sem o mouse no painel, só aparece o nome da área. | Importante | Desejável |

## Menu flutuante (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF031 | Quando o mouse para 180 ms sobre um ícone de área que não é a área aberta, o sistema deve mostrar o menu da área num menu flutuante à direita do ícone, sem trocar o painel nem a tela aberta. | Com o Início aberto, parar o mouse em Auditoria mostra Logs de auditoria e Logs de requisição ao lado; o painel continua no Início. | Essencial | Obrigatório |
| RF032 | O menu flutuante deve fechar 120 ms depois que o mouse sai do ícone e do menu flutuante. | Levar o mouse do ícone até o menu flutuante não o fecha. | Essencial | Obrigatório |
| RF033 | O menu flutuante deve começar com o nome da área em negrito, separado do menu por uma linha. | O menu flutuante de Auditoria começa com "Auditoria". | Importante | Desejável |
| RF034 | A largura do menu flutuante deve acompanhar o texto mais longo dele, com mínimo de 192 px e máximo de 272 px; o nome maior que o máximo quebra em 2 linhas, sem reticências. | "Solicitações de compra e reembolso" aparece inteiro, em 2 linhas, num menu de 272 px. | Importante | Desejável |
| RF035 | A altura do menu flutuante deve ser no máximo 70% da altura da janela, com rolagem própria. | Janela de 700 px: o menu flutuante de Configurações tem no máximo 490 px. | Importante | Obrigatório |
| RF036 | Abrir ou fechar um grupo dentro do menu flutuante não deve mudar a largura dele. | Em Configurações, abrir Inteligência artificial mantém a largura. Exceção aceita: a barra de rolagem do sistema operacional. | Desejável | Opcional |
| RF037 | Pelo teclado, Enter no ícone deve abrir a área no painel, com os itens que o menu flutuante mostraria. | Percorrer a trilha só com Tab, Enter e Esc abre cada área. | Essencial | Obrigatório |

## Recolher (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF041 | Quando a pessoa clica em "Recolher menu" ou aperta Ctrl+\, o sistema deve esconder o painel e deixar só a trilha. | Ctrl+\ com o painel aberto: a barra fica com 72 px. | Essencial | Obrigatório |
| RF042 | Com a barra recolhida, o primeiro ícone da trilha deve ser "»", com o tooltip "Expandir menu"; clicar nele ou apertar Ctrl+\ abre o painel da área que estava aberta. | Recolher com Auditoria aberta e expandir: o painel volta em Auditoria. | Essencial | Obrigatório |
| RF043 | Com a barra recolhida, todo ícone de área deve abrir o menu flutuante, inclusive o da área aberta. | Recolhida com Auditoria aberta, parar o mouse em Auditoria mostra o menu flutuante dela. | Essencial | Obrigatório |
| RF044 | Ao recolher ou expandir, o sistema deve levar o foco para o primeiro controle da barra lateral, o seletor de workspace. | Pelo teclado, depois de Ctrl+\, o Tab seguinte continua na barra. | Importante | Desejável |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT001 | Até a liberação geral, a barra nova só deve aparecer no workspace com a chave do menu novo ligada; nos outros, a barra de hoje continua igual. Critério de fim: a chave ligada em cada workspace. | Workspace sem a chave mostra a barra de hoje; com a chave, a trilha. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | O teto de 8 ícones foi medido numa janela de 900 px de altura. Ele deve acompanhar a altura da janela? | produto | RN001 vira um cálculo pela altura disponível. |
| P002 | O filtro por tipo no cabeçalho do Início ("Categorias", "Com pendências") entra? A opção "Telas" perdeu o sentido; o dev propõe um terceiro tipo ou confirma que bastam 2. | dev, com aprovação de produto | Um grupo de RF a mais nesta parte. |

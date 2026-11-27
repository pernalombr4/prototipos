# 5. Criar menu e criar categoria

**Objetivo:** o "+" do Início cria menu e categoria a partir do menu. A janela "Criar menu" cria o menu e a tela dele
juntos, num formulário só, no lugar das 2 telas de hoje (Telas e Menus) em ordem obrigatória.

**Depende de:** 1. Submenu e rascunho.

**Onde vale:** o "+" do cabeçalho do Início, o "+" de cada seção do workspace, a janela "Criar menu", a janela "Criar
categoria" e Configurações > Interface.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, "+" do Início > "Criar menu".

## O "+" do Início (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | O "+" do cabeçalho do Início deve abrir a lista com o campo "Descreva o que quer criar" e as opções "Criar menu" e "Criar categoria". | Clicar no "+" mostra o campo com o foco e as opções. | Essencial | Obrigatório |
| RF402 | O texto digitado deve filtrar as opções. | Digitar "menu" deixa só "Criar menu". | Importante | Desejável |
| RF403 | Se a pessoa não cumpre a RN901, as opções de criar devem aparecer desligadas, com "Só quem configura o workspace". | Membro com licença Basic: "Criar menu" desligado, com a explicação. | Essencial | Obrigatório |
| RF404 | Com o épico Personalizar o meu menu no ar, a lista deve ter também "Criar seção", que cria a seção pessoal, e "Personalizar a barra lateral". | "Criar seção" abre a janela de seção pessoal. | Importante | Desejável |

## Criar menu (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF411 | O "+" do Início, o "+" de cada seção do workspace e o "Criar menu" do pé da janela "Adicionar em <nome>" devem abrir a janela "Criar menu". | As 3 portas abrem a mesma janela. | Essencial | Obrigatório |
| RF412 | A janela deve pedir ícone e nome; sem nome, "Criar menu" mostra "Dê um nome ao menu." no campo e não cria nada. | Clicar em "Criar menu" com o nome vazio: a janela continua aberta, com o erro. | Essencial | Obrigatório |
| RF413 | A janela deve ter o campo "Tipo de menu", com a dica "O tipo é a tela que abre quando alguém clica neste menu." e os tipos de tela do produto (RN905). | A lista mostra os tipos que hoje ficam em Interface > Telas. | Essencial | Obrigatório |
| RF414 | Quando o tipo escolhido pede categorias ou caminho, a janela deve mostrar esses campos, com a dica "Este tipo pede ao menos uma categoria", sem cor de erro. | Escolher um tipo que lista itens mostra o campo de categorias, sem vermelho. | Essencial | Obrigatório |
| RF415 | Se falta categoria ou caminho num tipo que os pede, "Criar menu" deve mostrar o erro no campo ("Escolha ao menos uma categoria para este tipo.") e não criar o menu. | A janela continua aberta, com o campo em vermelho. | Importante | Obrigatório |
| RF416 | O campo "Onde ele fica" deve ser uma lista de seleção com "No Início", "Na trilha", "Dentro de uma seção" e "Dentro de um menu"; os 2 últimos abrem o campo "Dentro de qual seção" ou "Dentro de qual menu", sem Integrações (RN904). | Escolher "Dentro de uma seção" mostra a lista de seções; Integrações não está nela. | Essencial | Obrigatório |
| RF417 | "Dentro de qual menu" deve listar só os menus que o workspace criou e que estão dentro de uma seção (RN902 e RN903). | Tarefas > Painel não aparece; Painel de vendas aparece. | Essencial | Obrigatório |
| RF418 | Em "Onde ele fica", o lugar sem destino possível deve aparecer desligado. | Workspace sem menu criado: "Dentro de um menu" aparece desligado. | Desejável | Opcional |
| RF419 | O campo "Quem enxerga" deve ser uma lista de seleção múltipla com os grupos de membros do workspace; vazia, mostra "Todo o workspace". | Escolher o grupo Jurídico restringe o menu a ele, e a prévia diz "1 grupo". | Essencial | Obrigatório |
| RF420 | A janela deve mostrar a prévia: a linha como fica no menu e, embaixo, o tipo e quem enxerga. | Mudar o nome e o tipo muda a prévia na hora. | Importante | Desejável |
| RF421 | Aberta pelo "+" de uma seção, a janela deve vir com "Dentro de uma seção" e a seção escolhidos; aberta pelo "Criar menu" de "Adicionar em <menu>", com "Dentro de um menu" e o menu. | "+" de Conhecimento: a janela vem dentro de Conhecimento. | Importante | Desejável |
| RF422 | Criar deve pôr o menu e a tela no rascunho, com a bolinha amarela, sem publicar. | O cartão "Alterações não salvas" aparece depois de criar. | Essencial | Obrigatório |
| RF423 | Configurações > Interface não deve listar Telas, porque a tela nasce com o menu. | O grupo Interface não lista Telas. | Essencial | Obrigatório |

## Criar categoria (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF431 | "Criar categoria" deve abrir uma janela com ícone e nome; sem nome, o botão "Criar" fica desligado. | Com o nome vazio, "Criar" não cria a categoria. | Essencial | Obrigatório |
| RF432 | A categoria criada deve aparecer em Categorias, na busca "Buscar... Ctrl K" e em Configurações > Estrutura de dados > Categorias. | Criar "Patrimônio": a linha aparece em Categorias. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI401 | Criar menu | Deve receber nome, ícone, tipo de menu, categorias ou caminho quando o tipo pede, lugar e grupos, e criar o menu e a tela juntos (RN905). Rota <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P401 | O que acontece com as telas que os clientes já têm fora de qualquer menu quando Telas sair? | produto | Um plano de migração e um requisito de transição para RF423. |
| P402 | "Criar com IA" (o BENI monta a proposta a partir do texto digitado) entra? O que ele grava depois que a pessoa aprova? | produto | Um grupo de requisitos e uma rota a mais. |

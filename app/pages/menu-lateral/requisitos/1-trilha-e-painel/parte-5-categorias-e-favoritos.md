# 5. Categorias e Favoritos

**Objetivo:** a seção Categorias mostra até 5 categorias e leva às outras por "Ver todas". A estrela que já existe
na barra do topo passa a alimentar a seção Favoritos. O workspace sem categoria mostra um cartão com o próximo passo.

**Depende de:** 1. Trilha, painel e menu flutuante; 3. Início com os destinos nativos.

**Onde vale:** as seções Favoritos e Categorias do Início e de Dados e a camada "Ver todas as categorias".

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, cenários "Sem personalização" e "Workspace novo".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN401 | Favorito é preferência de cada pessoa: favoritar não muda o menu de mais ninguém. | Ana favorita Contratos; o menu de Bruno não muda. | Obrigatório |
| RN402 | A seção Categorias mostra no máximo 5 categorias que não são favoritas, pela ordem ativa. | Com 40 categorias e 3 favoritas, a seção mostra 5 linhas e o "Ver todas". | Obrigatório |
| RN403 | A ordem "Mais usadas" segue o histórico de navegação da pessoa; sem histórico, a ordem é alfabética. | Conta nova: Categorias em ordem alfabética. | Obrigatório |
| RN404 | Favoritos mostra só os favoritos do workspace aberto. | Contratos favoritado no workspace A não aparece no workspace B. | Obrigatório |

## Categorias (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | A seção Categorias deve mostrar as categorias conforme a RN402, com o total ao lado do título. | Com 40 categorias: 5 linhas, e o título mostra "Categorias 40". | Essencial | Obrigatório |
| RF402 | A seção Categorias deve terminar com a linha "Ver todas as N categorias", também quando a seção já mostra cada categoria. | Com 4 categorias, a linha diz "Ver todas as 4 categorias". | Essencial | Obrigatório |
| RF403 | "Ver todas as N categorias" deve abrir uma camada com cada categoria do workspace, busca por nome e por descrição e a estrela de cada uma. | Buscar "reembolso" acha "Solicitações de compra e reembolso". | Essencial | Obrigatório |
| RF404 | Se a busca da camada não acha nada, a camada deve dizer que nada foi encontrado para o termo. | Buscar "xyz" mostra o estado vazio com o termo. | Importante | Desejável |
| RF405 | O "…" do título Categorias deve ter o submenu "Ordenar por", com "Mais usadas", "Ordem alfabética" e "Criadas recentemente"; a ordem padrão é "Mais usadas" (RN403). | Trocar para "Ordem alfabética" reordena as 5 linhas na hora. | Importante | Desejável |
| RF406 | Um nome de categoria cortado na largura do painel deve mostrar o nome inteiro no tooltip. | "Solicitações de compra e reembolso" mostra o nome inteiro ao passar o mouse. | Importante | Obrigatório |
| RF407 | Se o workspace não tem categoria, a seção deve mostrar o cartão "Nenhuma categoria ainda", com a explicação do que é uma categoria. | Workspace novo: o cartão aparece no lugar da lista. | Importante | Obrigatório |
| RF408 | Para quem cumpre a RN901, o cartão do workspace sem categoria deve ter "Criar categoria", que abre a criação de categoria de hoje; para os outros, o cartão diz que a primeira categoria aparece ali quando existir. | Membro com licença Basic: o cartão não tem botão. | Importante | Obrigatório |

## Favoritos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF411 | Cada categoria do painel Dados e da camada "Ver todas" deve ter uma estrela que favorita e desfavorita a categoria, ligada aos mesmos favoritos da estrela da barra do topo (RN401). | Favoritar Clientes pela estrela da linha acende a estrela do topo na tela de Clientes. | Essencial | Obrigatório |
| RF412 | A estrela deve aparecer no hover da linha e no foco do teclado; na categoria favorita, fica visível sem hover. | Pelo Tab, a estrela aparece ao focar a linha. | Importante | Desejável |
| RF413 | A estrela deve ser um botão irmão da linha, com `aria-pressed`. | O leitor de tela diz se a categoria está favoritada. | Importante | Desejável |
| RF414 | A seção Favoritos só deve aparecer depois do primeiro favorito do workspace, acima de Categorias (RN404). | Conta nova: não há seção Favoritos; favoritar a primeira faz a seção aparecer. | Essencial | Obrigatório |
| RF415 | Ao favoritar ou desfavoritar, o sistema deve mostrar um aviso com o nome da categoria. | Desfavoritar Clientes mostra "Clientes saiu dos seus favoritos." | Desejável | Opcional |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RNF401 | O tamanho do menu não deve mudar entre 8 e 40 categorias. | Contar as linhas do Início com 8 e com 40 categorias: o mesmo número. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P401 | Hoje os favoritos ficam no navegador, com no máximo 10, e valem para todos os workspaces. O teto de 10 continua por workspace? | produto | RN404 ganha o teto. |
| P402 | Quantas categorias tem o maior workspace de produção? Com mais de 150, a camada "Ver todas" pode precisar de agrupamento. | dado de produção | RF403 ganha agrupamento ou carregamento por partes. |
| P403 | "Começar por um caso de uso", o segundo botão do cartão no protótipo, entra quando a Central de casos de uso existir (épico Casos de uso e importação de menu). | produto | RF408 ganha o segundo botão. |

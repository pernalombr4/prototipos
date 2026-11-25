# 4. Categorias

**Objetivo:** a pessoa entra numa categoria ou cria um item nela direto da Home, e escolhe quais categorias o widget
mostra e em que ordem.

**Depende de:** 1. A grade e o Personalizar.

**Onde vale:** o widget Categorias da Home, no grupo Itens e categorias do catálogo. Substitui os cartões de categoria
da Home de hoje, que mostram 4 por vez com o botão "Acessar".

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "MVP" em "Versão". Para ver o vazio, escolha
"Workspace vazio" em "Estado".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN301 | Sem categoria escolhida, o widget mostra cada categoria que a pessoa acessa (RN901), na ordem do workspace. | Num workspace com 6 categorias e nenhuma escolhida, o widget mostra as 6. | Obrigatório |

## O cartão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | O widget deve mostrar 1 cartão por categoria (RN301), em colunas de mesma largura, com cartões de mesma altura. | Categorias com nome curto e longo têm cartões do mesmo tamanho. | Essencial | Obrigatório |
| RF302 | Cada cartão deve mostrar o ícone e a cor da categoria, o nome em 1 linha e a descrição da categoria em até 2 linhas, com reticências no que passar. | O nome e a descrição cabem na altura do ícone, como no protótipo; a categoria sem descrição mostra só o nome. | Essencial | Obrigatório |
| RF303 | Ao passar o mouse, o cartão deve mostrar o nome e a descrição inteiros na dica. | A descrição cortada no cartão aparece inteira na dica. | Desejável | Desejável |
| RF304 | O clique no cartão deve abrir a categoria. | Clicar em Chamados de TI abre a tela de itens da categoria. | Essencial | Obrigatório |
| RF305 | Ao lado de cada cartão, o botão só de ícone "+" deve criar item na categoria, com a dica "Criar <nome no singular>", ou "Criar item em <categoria>" quando a categoria não tem nome no singular. | Exemplo: Chamados de TI com singular "chamado" mostra "Criar chamado". | Essencial | Obrigatório |
| RF306 | Na categoria com 2 ou mais formulários, o "+" deve abrir o menu "Escolha o formulário", com 1 opção por formulário; escolhido o formulário, abre o modal de criação com o formulário. | Exemplo: Contratos com os formulários Novo contrato e Aditivo mostra as 2 opções. | Essencial | Obrigatório |
| RF307 | Na categoria com 1 formulário ou nenhum, o "+" deve abrir o modal de criação direto, como o produto faz hoje. | Categoria sem formulário abre o modal com todos os campos da categoria. | Essencial | Obrigatório |
| RF308 | O cabeçalho do widget deve ter o botão só de ícone "Ver todas as categorias", que abre a lista de categorias do workspace. | O botão tem a dica "Ver todas as categorias". | Importante | Desejável |

## Escolher quais e em que ordem (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF309 | "Configurar" no widget deve abrir o modal "Configurar Categorias", com a lista das categorias que a pessoa acessa, cada uma com a caixa de marcar e as setas de subir e descer. | O texto de ajuda do modal é o do protótipo. | Essencial | Obrigatório |
| RF310 | O modal deve ter "Marcar todas" e "Desmarcar todas". | "Desmarcar todas" e "Salvar" voltam o widget à regra RN301. | Importante | Obrigatório |
| RF311 | "Salvar" deve mostrar no widget só as categorias marcadas, na ordem da lista. | Marcar Contratos e Chamados de TI, com Contratos em cima, mostra os 2 nessa ordem. | Essencial | Obrigatório |
| RF312 | No catálogo, Itens e categorias > Categorias deve abrir a escolha de RF309 e RF310; o botão do pé adiciona o widget com a escolha ou, com o widget já na Home, salva a escolha nele. | Sem o widget, o botão diz "Adicionar à Home"; com o widget na Home, "Salvar na Home". | Importante | Obrigatório |

## Vazio (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF313 | No workspace sem categoria, o widget deve mostrar "Nenhuma categoria ainda" e, para o administrador, "Crie a primeira categoria para o time começar a registrar itens." com o botão "Criar categoria". | "Criar categoria" abre a criação de categoria do produto. | Importante | Obrigatório |
| RF314 | No workspace sem categoria, o membro deve ver "O administrador ainda não criou categorias neste workspace.", sem botão. | O membro não vê "Criar categoria". | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | Sem escolha, o widget mostra cada categoria que a pessoa acessa ou só as marcadas hoje em "mostrar na tela inicial" (`show_types_on_initial_screen`)? | produto | RN301 |
| P302 | O modal de criação aberto pelo "+" passa a ter o título "Criar <nome no singular>", como no protótipo, no lugar de "Novo registro"? | produto | O modal de criação muda também fora da Home |

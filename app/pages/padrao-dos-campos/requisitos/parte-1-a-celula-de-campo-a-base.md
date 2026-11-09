# 1. A célula de campo: a base

**Objetivo:** cada coluna de campo da tabela de itens desenha o valor com o mesmo componente, no espaço que a coluna tem, sem invadir a linha de baixo nem a coluna do lado.

**Onde vale:** o componente de leitura de campo do `@be-enlighten/enspace-sdk-ui`, no formato célula, em cada coluna de campo da tabela da tela nova de itens (`/workspaces/<ws>/types/<categoria>`).

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. A tabela tem 1 coluna por tipo de campo, e o rótulo da coluna é o nome do tipo. Os parâmetros de cada tipo saem do botão "Baixar relatório (.xlsx)", na barra do topo da tela.

## A célula, em qualquer tipo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Cada célula de campo da tabela deve desenhar o valor com o componente de leitura de campo, no formato célula, em 1 linha de altura fixa. | Exemplo: numa categoria com 1 campo de cada tipo, as colunas usam o mesmo componente, e nenhuma linha muda de altura conforme o conteúdo. | Essencial | Obrigatório |
| RF002 | A célula deve alinhar o conteúdo conforme o alinhamento do tipo (RN905): no início para texto, no fim para número e Valor Monetário, e no centro para o campo cujo conteúdo é um alvo e não um valor. | Exemplo: a coluna de Número alinha à direita; a de Anotações centraliza o ícone, com desvio zero do centro da célula. | Essencial | Obrigatório |
| RF003 | A coluna de alinhamento no centro deve centralizar também o rótulo do cabeçalho. | Exemplo: o cabeçalho "Chat" fica sobre o ícone, e não à esquerda da coluna. | Importante | Obrigatório |
| RF004 | Número e Valor Monetário devem sair com dígitos de largura fixa. | Exemplo: `1.234,56` e `98,70` em linhas seguidas têm as vírgulas na mesma coluna de pixels. | Importante | Obrigatório |
| RF005 | A célula de um campo sem valor deve ficar em branco, com o rótulo "Vazio" só para leitor de tela (RN903). | Exemplo: a coluna de Texto Longo do item sem valor não mostra hífen, "null" nem "-". | Essencial | Obrigatório |
| RF006 | Quando o valor não cabe na largura da coluna, a célula deve cortá-lo com reticências e mostrar o valor inteiro no balão do passar o mouse. | Exemplo: um Texto Curto de 90 caracteres numa coluna de 200 px termina em reticências, e o balão traz o texto inteiro. | Essencial | Obrigatório |
| RF007 | O conteúdo da célula deve caber na largura da coluna e manter a altura da linha, de 96 px até a largura que a pessoa abrir. | Exemplo: apertando cada uma das colunas até o mínimo, nada invade a coluna vizinha e a linha continua com a mesma altura. | Essencial | Obrigatório |
| RF008 | A largura inicial de cada coluna de campo deve ser a largura mínima do tipo (RN905). | Exemplo: a coluna de Valor Monetário abre com 160 px e a de Texto Curto com 200 px. | Importante | Obrigatório |
| RF009 | A tabela deve aceitar a largura mínima por coluna e recusar largura menor que 96 px. | Exemplo: arrastando a coluna de Tags para além do limite, ela para em 96 px, onde ainda cabem 1 selo cortado e o contador. | Importante | Obrigatório |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS001 | O componente de leitura do campo e a função que transforma valor em texto devem morar no `@be-enlighten/enspace-sdk-ui`, de onde a tabela os consome. Imposta por: Mikaela, em 09/11/2026. | O pacote exporta os 2, e a tela de itens não tem desenho de campo próprio. | Essencial | Obrigatório |
| RS002 | O componente de leitura não deve buscar dado, recebendo o campo e o valor por propriedade. Imposta por: regra dos componentes base do SDK. | O componente não faz chamada de rede. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P002 | O balão do passar o mouse carrega o valor inteiro de cada célula cortada. Em tabela com 35 colunas, isso é texto a mais no desenho de cada linha. | Time de front | Com custo alto, o balão passa a montar só na abertura |

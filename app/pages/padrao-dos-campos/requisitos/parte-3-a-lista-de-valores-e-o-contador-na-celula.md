# 3. A lista de valores e o contador na célula

**Objetivo:** o campo que guarda lista mostra, na célula, os valores que cabem na coluna e conta os que ficaram de fora, em qualquer largura.

**Depende de:** 1. A célula de campo: a base; 2. O desenho de cada família na célula.

**Onde vale:** o componente de leitura de campo do `@be-enlighten/enspace-sdk-ui`, no formato célula, nas colunas de lista de seleção múltipla, caixas de seleção, tags, relação múltipla e campo composto da tabela da tela nova de itens.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. Arraste a borda do cabeçalho da coluna de Tags para ver o corte acontecer. Os parâmetros de cada tipo saem do botão "Baixar relatório (.xlsx)", na barra do topo da tela.

## Lista de valores na célula (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF012 | O campo que guarda lista deve mostrar os valores que couberem na largura e, no lugar dos que não couberem, 1 contador "+N". | Exemplo: Tags com 5 valores em 240 px mostra `urgente`, `multa`, `concessionaria` e `+2`. | Essencial | Obrigatório |
| RF013 | O contador deve ser o último elemento a ceder espaço: primeiro sai o terceiro valor, depois o segundo, e 1 valor cortado com reticências sobrevive ao lado do contador. | Exemplo: a mesma Tags em 96 px mostra `urgen...` e `+4`, e nunca 3 selos ilegíveis sem contador. | Essencial | Obrigatório |
| RF014 | O contador deve mostrar a lista inteira no balão do passar o mouse. | Exemplo: o balão de `+2` traz os 5 valores, separados por barra. | Importante | Obrigatório |
| RF015 | Quando a largura comporta mais valores que o teto do tipo (RN905), a célula deve parar no teto. | Exemplo: Lista de Seleção Múltipla com teto 2 mostra 2 valores e `+3` numa coluna de 400 px. | Desejável | Desejável |

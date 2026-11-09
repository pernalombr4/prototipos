# 9. Os campos compostos e o anexo no formulário

**Objetivo:** Endereço, Matriz de dados, Grupo, Repetidor, anexo e relação se preenchem no formulário com o bloco que cada um pede.

**Depende de:** 5. A moldura do formulário.

**Onde vale:** os campos de Endereço, Matriz de dados, Grupo, Repetidor, Arquivo, Imagem, Tratamento de PDF e relação, no modal "Novo registro" da tela nova de itens e na aba Visão Geral do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. No formulário, os campos compostos ocupam a linha inteira da grade.

## Os blocos compostos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF133 | O Endereço deve mostrar os subcampos do país configurado no campo. | Exemplo: com o Brasil configurado, aparecem CEP, País, Rua, Número, Complemento, Bairro, Cidade e Estado. | Importante | Obrigatório |
| RF134 | A Matriz de dados deve mostrar o Rótulo Complementar como título do bloco, as linhas em linhas e as colunas em colunas, com 1 resposta por linha. | Exemplo: marcar a segunda coluna de uma linha desmarca a primeira, e as outras linhas não mudam. | Importante | Obrigatório |
| RF135 | A Matriz de dados não deve imprimir o número da coluna abaixo da opção. | Exemplo: a grade mostra só o rótulo de cada coluna, no cabeçalho. | Importante | Obrigatório |
| RF136 | O Repetidor e o Grupo devem mostrar cada campo aninhado com o controle que o tipo dele tem no formulário. | Exemplo: um Repetidor com Texto Curto e Data dentro usa os mesmos 2 controles das colunas desses tipos. | Importante | Obrigatório |

## Anexo e relação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF137 | O campo de anexo deve listar cada arquivo com nome, tamanho e as ações baixar, renomear, remover e reordenar, com o reordenar também por arrasto. | Exemplo: 3 arquivos listados; arrastar o terceiro para o topo muda a ordem, e o menu de cada linha traz as 4 ações. | Importante | Obrigatório |
| RF138 | O campo de relação deve mostrar o item relacionado pelo `display` e, quando o `display` está vazio, pela referência (RN904). | Exemplo: o registro sem `display` aparece como `CLIC-0042`, e não como linha em branco. | Importante | Obrigatório |

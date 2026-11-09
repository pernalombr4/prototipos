# 4. A saída de cada campo no relatório .xlsx

**Objetivo:** quem exporta a tabela de itens recebe a mesma tabela que está na tela, e cada coluna chega na planilha
com o tipo de célula que o Excel entende: número soma, data ordena e anexo abre.

**Depende de:** 1. A célula na tabela.

**Onde vale:** o Exportar da barra de ferramentas da tela nova de itens, e o arquivo `.xlsx` que ele gera.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. **Clique em "Baixar relatório (.xlsx)" na
barra do topo da tela** para ver a saída: a primeira aba do arquivo é a tabela extraída, com 1 coluna por tipo de
campo, e a segunda traz os parâmetros de cada tipo.

## O arquivo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | A exportação deve trazer as colunas visíveis da tabela, na mesma ordem da tela, e 1 linha por item listado. | Exemplo: uma tabela com 35 colunas gera uma planilha com as mesmas 35 colunas, na mesma ordem. | Essencial | Obrigatório |
| RF302 | O cabeçalho de cada coluna deve ser o rótulo do campo, e não a referência técnica. | Exemplo: a coluna sai como "Valor Monetário", e não como `valor_monetario`. | Essencial | Obrigatório |
| RF303 | O texto de cada valor exportado deve ser igual ao que a tela mostra (RN901): máscara, casas decimais e rótulo de opção. | Exemplo: a opção gravada como `em_analise` sai como "Em análise", igual à célula. | Essencial | Obrigatório |
| RF304 | A largura de cada coluna da planilha deve sair da largura da coluna na tela. | Exemplo: a coluna de Texto Curto abre mais larga que a de Número, sem a pessoa redimensionar nada. | Desejável | Opcional |
| RF305 | O campo sem valor deve sair como célula vazia (RN903). | Exemplo: nenhuma célula traz "-", "null" ou "undefined". | Essencial | Obrigatório |
| RF306 | As máscaras de data e de número devem seguir a localidade do idioma de quem exporta, com a moeda seguindo o valor (RN906). | Exemplo: na planilha em português, `US$ 7.250,90` continua em dólar, e a data sai como `14/09/2026`. | Importante | Obrigatório |

## O tipo de célula por tipo de campo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF310 | O Número deve sair como número, e não como texto. | Exemplo: `SOMA` e `MÉDIA` funcionam na coluna, sem converter nada. | Essencial | Obrigatório |
| RF311 | O Valor Monetário deve sair como número, com a máscara da moeda daquela célula. | Exemplo: na mesma coluna, 1 célula mostra `R$ 1.234,56` e outra `US$ 7.250,90`, e as 2 somam. | Essencial | Obrigatório |
| RF312 | O arquivo deve carregar 1 formato de célula por moeda que aparece na exportação, sem coluna de código da moeda. | Exemplo: uma tabela com 3 moedas gera 3 formatos, e a planilha tem as mesmas colunas da tela. | Essencial | Obrigatório |
| RF313 | A Data deve sair como data, e não como texto. | Exemplo: filtrar a coluna por mês e ordenar por ela funcionam na planilha. | Essencial | Obrigatório |
| RF314 | O campo de anexo deve sair como hyperlink para o primeiro arquivo, com o nome dele e o contador dos demais. | Exemplo: `laudo-tecnico.pdf (+2)`, clicável, abrindo o primeiro arquivo. | Importante | Obrigatório |
| RF315 | O campo que guarda lista (seleção múltipla, caixas de seleção, tags e relação múltipla) deve sair como texto, com os valores separados por vírgula e espaço. | Exemplo: `urgente, multa, concessionaria`, sem o contador que a célula usa. | Essencial | Obrigatório |
| RF316 | A Alternativa Binária deve sair com o texto do valor, e não com `true` e `false`. | Exemplo: a coluna traz "Sim" e "Não". | Importante | Obrigatório |
| RF317 | O campo de Anotações deve sair inteiro, com 1 mensagem por linha dentro da célula, no formato "autor: texto". | Exemplo: 3 anotações viram 3 linhas na mesma célula. | Importante | Obrigatório |
| RF318 | O campo de Chat deve sair como célula vazia, com a coluna presente. | Exemplo: a coluna "Chat" existe na planilha e não traz histórico de conversa. | Importante | Obrigatório |
| RF319 | O campo composto (Grupo, Repetidor e Matriz de dados) deve sair como texto, com os pares "rótulo: valor" separados por vírgula e espaço. | Exemplo: `Elétrica: Não conforme, Hidráulica: Conforme`. | Importante | Obrigatório |
| RF320 | O texto rico deve sair sem as marcas de formatação. | Exemplo: `<p>Laudo com <strong>ressalva</strong></p>` sai como `Laudo com ressalva`. | Importante | Obrigatório |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS301 | A exportação deve montar o arquivo no back-end. Imposta por: Mikaela, em 09/11/2026. | O Exportar da tela devolve o arquivo pronto, e o front não monta planilha. | Essencial | Obrigatório |
| RNF301 | A tela e a exportação devem ler a regra de texto de cada tipo de 1 fonte só. | Mudar a máscara de um tipo muda a tela e a planilha, sem 2 alterações. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | A exportação de hoje já entrega alguma coluna como número, data ou hyperlink, ou todas saem como texto? | Time de back | Define se a mudança é de tipo de célula ou de montagem do arquivo inteiro |
| P302 | A exportação de hoje leva as colunas visíveis da tela ou todos os campos da categoria? | Time de back | Com todos os campos, a planilha deixa de espelhar a tela e o RF301 muda |
| P303 | A regra de texto por tipo vive hoje no front, no `cFormat` que cada tela aplica. Para a planilha dizer o mesmo que a tela, essa regra precisa existir também no back. | Time de back | Com a API devolvendo a saída formatada junto do valor cru, a exportação lê o valor já formatado |

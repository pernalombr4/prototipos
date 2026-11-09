# 11. O relatório: a tabela extraída

**Objetivo:** quem exporta a tabela de itens recebe a mesma tabela que está na tela: as mesmas colunas, na mesma ordem, com o mesmo texto em cada célula.

**Depende de:** 1. A célula de campo: a base.

**Onde vale:** o Exportar da barra de ferramentas da tela nova de itens, e o arquivo `.xlsx` que ele gera.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. **Clique em "Baixar relatório (.xlsx)" na barra do topo da tela** para ver a saída: a primeira aba do arquivo é a tabela extraída, com os mesmos cabeçalhos da tela.

## O arquivo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | A exportação deve trazer as colunas visíveis da tabela, na mesma ordem da tela, e 1 linha por item listado. | Exemplo: uma tabela com 35 colunas gera uma planilha com as mesmas 35 colunas, na mesma ordem. | Essencial | Obrigatório |
| RF302 | O cabeçalho de cada coluna deve ser o rótulo do campo, e não a referência técnica. | Exemplo: a coluna sai como "Valor Monetário", e não como `valor_monetario`. | Essencial | Obrigatório |
| RF303 | O texto de cada valor exportado deve ser igual ao que a tela mostra (RN901): máscara, casas decimais e rótulo de opção. | Exemplo: a opção gravada como `em_analise` sai como "Em análise", igual à célula. | Essencial | Obrigatório |
| RF304 | A largura de cada coluna da planilha deve sair da largura da coluna na tela. | Exemplo: a coluna de Texto Curto abre mais larga que a de Número, sem a pessoa redimensionar nada. | Desejável | Opcional |
| RF305 | O campo sem valor deve sair como célula vazia (RN903). | Exemplo: nenhuma célula traz "-", "null" ou "undefined". | Essencial | Obrigatório |
| RF306 | As máscaras de data e de número devem seguir a localidade do idioma de quem exporta, com a moeda seguindo o valor (RN906). | Exemplo: na planilha em português, `US$ 7.250,90` continua em dólar, e a data sai como `14/09/2026`. | Importante | Obrigatório |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS301 | A exportação deve montar o arquivo no back-end. Imposta por: Mikaela, em 09/11/2026. | O Exportar da tela devolve o arquivo pronto, e o front não monta planilha. | Essencial | Obrigatório |
| RNF301 | A tela e a exportação devem ler a regra de texto de cada tipo de 1 fonte só. | Mudar a máscara de um tipo muda a tela e a planilha, sem 2 alterações. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P302 | A exportação de hoje leva as colunas visíveis da tela ou todos os campos da categoria? | Time de back | Com todos os campos, a planilha deixa de espelhar a tela e o RF301 muda |
| P303 | A regra de texto por tipo vive hoje no front, no `cFormat` que cada tela aplica. Para a planilha dizer o mesmo que a tela, essa regra precisa existir também no back. | Time de back | Com a API devolvendo a saída formatada junto do valor cru, a exportação lê o valor já formatado |

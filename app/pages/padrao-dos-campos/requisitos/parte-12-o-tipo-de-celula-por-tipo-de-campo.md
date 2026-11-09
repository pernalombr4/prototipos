# 12. O tipo de célula por tipo de campo na planilha

**Objetivo:** cada coluna da planilha chega com o tipo de célula que o Excel entende: número soma, data ordena e anexo abre.

**Depende de:** 11. O relatório: a tabela extraída.

**Onde vale:** o arquivo `.xlsx` que o Exportar da tela nova de itens gera.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. **Clique em "Baixar relatório (.xlsx)" na barra do topo da tela** e abra o arquivo: cada coluna sai no tipo de célula do seu tipo de campo, e a segunda aba traz os parâmetros de cada tipo.

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

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | A exportação de hoje já entrega alguma coluna como número, data ou hyperlink, ou todas saem como texto? | Time de back | Define se a mudança é de tipo de célula ou de montagem do arquivo inteiro |

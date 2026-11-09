# 4. O Valor Monetário na célula

**Objetivo:** quem olha a coluna de Valor Monetário lê o valor na moeda dele e descobre, sem sair da tabela, de onde esse valor veio.

**Depende de:** 1. A célula de campo: a base.

**Onde vale:** a coluna de Valor Monetário da tabela da tela nova de itens.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. Passe o mouse no "i" ao lado de um valor da coluna Valor Monetário. O item 4 da lista tem 2 períodos de correção.

## O valor e o quadro de correção (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF030 | A célula de Valor Monetário deve mostrar o valor com o símbolo da moeda daquele valor (RN906). | Exemplo: na mesma coluna, 1 item mostra `R$ 1.234,56` e outro mostra `US$ 7.250,90`. | Essencial | Obrigatório |
| RF031 | A célula de Valor Monetário deve ter o "i" ao lado do valor, em todo valor monetário, que ao passar o mouse abre o quadro com Valor inicial, Correções acumuladas e Valor atual. | Exemplo: o valor sem correção nenhuma também tem o "i", e o quadro mostra as correções acumuladas em zero. | Essencial | Obrigatório |
| RF032 | O quadro do "i" deve ter "Mostrar Legenda", que expande dentro do mesmo quadro com os grupos Vigência do Período (Ativo, Inativo, Não Vinculado) e Status da Correção (Bem-sucedida, Erro fatal, Pendente, Falha temporária). | Exemplo: o ponteiro entra no quadro sem fechá-lo, e o clique em "Mostrar Legenda" abre os 7 textos. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | A lista de períodos que o quadro do "i" mostra não pôde ser lida em develop: nenhum item tinha correção aplicada. O formato usado no protótipo é proposta. | Time de back | Define os campos de cada período que o quadro lê |

# 6. Texto, número, data e escolha no formulário

**Objetivo:** os campos de digitar e de escolher têm, no formulário, o controle que o tipo pede, com o limite e as opções que a configuração do campo define.

**Depende de:** 5. A moldura do formulário.

**Onde vale:** os campos das famílias texto, número, data e escolha, no modal "Novo registro" da tela nova de itens e na aba Visão Geral do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. O botão "+ Novo registro" abre o formulário com 1 campo de cada tipo.

## Texto, número e data (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF110 | O Texto Longo deve nascer com 3 linhas de altura e crescer até 6 linhas conforme o texto. | Exemplo: o campo nasce mais alto que o Texto Curto, e 3 parágrafos aparecem sem rolagem interna. | Essencial | Obrigatório |
| RF114 | O Número deve usar controle numérico, com os limites configurados no campo. | Exemplo: um campo com mínimo 0 e máximo 100 recusa 120. | Importante | Obrigatório |
| RF115 | O Valor Monetário deve ter o seletor de moeda ao lado do valor, limitado às moedas que o campo permite, e abrir na moeda padrão do campo (RN906). | Exemplo: um campo que permite BRL e USD mostra 2 opções, e não a lista de 179 moedas. | Importante | Obrigatório |
| RF116 | O seletor de moeda deve ter busca a partir de 10 opções. | Exemplo: com 2 moedas permitidas, o seletor abre sem campo de busca. | Desejável | Desejável |
| RF117 | A Duração deve usar campo de texto que aceita duração escrita, com o texto de exemplo do produto. | Exemplo: `2 semanas` é aceito, e o campo não abre calendário nenhum. | Importante | Obrigatório |
| RF118 | O calendário do campo de data deve oferecer os atalhos Hoje, Amanhã, Semana que vem, 2 semanas e 4 semanas. | Exemplo: o atalho "2 semanas" preenche a data de hoje mais 14 dias. | Desejável | Desejável |
| RF119 | O campo de data deve mostrar o controle de hora quando a configuração do campo tem Exibir Hora ligado. | Exemplo: com Exibir Hora desligado, o controle pede só a data. | Importante | Obrigatório |

## Escolha (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF120 | Os Botões de Seleção única devem virar lista suspensa acima de 5 opções. | Exemplo: com 5 opções, os botões aparecem; com 6, aparece a lista. | Importante | Obrigatório |
| RF121 | A lista de seleção deve ter busca a partir de 10 opções. | Exemplo: com 9 opções a lista abre sem busca; com 10, com busca. | Importante | Obrigatório |
| RF122 | A Lista de Seleção Múltipla deve mostrar cada valor escolhido como selo com x dentro do controle, e a lista de opções abaixo. | Exemplo: 3 valores escolhidos aparecem como 3 selos, e o x de um deles o remove. | Importante | Obrigatório |
| RF123 | Cada opção na lista deve aparecer com o rótulo e a cor configurados nela. | Exemplo: "Em análise" aparece na cor configurada, e não o valor `em_analise`. | Importante | Obrigatório |
| RF124 | A Alternativa Binária deve usar caixa de marcar, como o formulário de hoje. | Exemplo: o controle é 1 caixa, e não uma chave de alternância. | Importante | Obrigatório |

# 1. Linha de filtros e chip por campo

**Objetivo:** a pessoa vê e muda cada filtro da lista numa linha abaixo da barra de ferramentas, com 1 chip por campo,
sem abrir modal nem gaveta.

**Onde vale:** a barra de ferramentas e a linha de filtros da tela de itens, na Tabela e no Kanban; em Tarefas Rápidas
e Tarefas Agendadas, com os campos e os filtros automáticos da RN009.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. A visualização "Em análise"
abre com o chip "Status: Em análise".

## Linha de filtros (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF034 | A linha de filtros abaixo da barra de ferramentas deve mostrar, nesta ordem: cada filtro automático ligado numa etiqueta com X, 1 chip por campo filtrado e "+ Filtro". | Em "Em análise", a linha mostra "Status: Em análise" e "+ Filtro"; o X da etiqueta "Só itens meus" desliga o filtro. | Importante | Obrigatório |
| RF124 | A linha de filtros deve aparecer quando a visualização ativa tem filtro, quando tem alteração não salva ou depois do botão Filtros, na Tabela e no Kanban. | Em "Itens", sem filtro, a linha só aparece depois do botão Filtros. | Importante | Obrigatório |
| RF106 | O botão Filtros da barra de ferramentas deve mostrar a linha de filtros, mesmo sem filtro, com "+ Filtro" aberto. | Em "Itens", o botão abre a lista de campos. | Importante | Obrigatório |
| RF132 | A gaveta "Filtros por campo" da barra de ferramentas deve sair do produto. | Clicar no botão Filtros não abre gaveta lateral. | Essencial | Obrigatório |
| RF099 | Os filtros automáticos e os chips devem valer juntos, conforme RN007. | "Área: Jurídico" com "Status: Em análise" mostra só os itens em análise do Jurídico. | Essencial | Obrigatório |

## "+ Filtro" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF094 | "+ Filtro" deve listar cada campo da tela (RN009) com o ícone do tipo e a busca "Filtrar por...". | Digitar "ven" deixa só "Vencimento"; sem resultado, aparece "Nenhum campo encontrado." | Essencial | Obrigatório |
| RF095 | Escolher em "+ Filtro" um campo sem chip deve criar o chip do campo e abri-lo. | Escolher "Área" em "Em análise" cria e abre o chip "Área". | Essencial | Obrigatório |
| RF112 | Escolher em "+ Filtro" um campo que já tem chip deve abrir o chip existente. | Escolher "Status" em "Em análise" abre "Status: Em análise". | Importante | Obrigatório |
| RF134 | Nos filtros, cada campo e cada filtro automático deve aparecer pelo rótulo, e não pelo nome técnico ("reference", "isOwner", "inGroups", "inputText"). | A lista do "+ Filtro" mostra "Referência", não "reference". | Essencial | Obrigatório |

## Chip por campo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF096 | O chip deve mostrar o campo e o que está escolhido ("Status: Em análise, Aprovado") e abrir um painel com a condição no topo e o valor embaixo. | Marcar "Aprovado" em "Em análise" mostra os itens em análise e os aprovados. | Essencial | Obrigatório |
| RF057 | O painel do chip deve oferecer a condição e o valor do tipo do campo, conforme RN008. | O chip de Vencimento oferece "Nos próximos", com o número de dias. | Importante | Obrigatório |
| RF135 | Em seleção e pessoa, o painel do chip deve mostrar as opções em caixas, com busca a partir de 7 opções e "Limpar seleção". | O chip "Área", com 5 opções, não tem busca; "Limpar seleção" desmarca as 5. | Importante | Obrigatório |
| RF117 | Trocar a condição entre "É" e "Não é" deve manter as opções marcadas. | "Status é Aprovado" vira "Status não é Aprovado". | Importante | Obrigatório |
| RF097 | O chip sem valor escolhido não deve filtrar. | O chip "Área" recém-criado não muda a tabela. | Importante | Obrigatório |
| RF113 | O chip sem valor escolhido deve aparecer tracejado, só com o nome do campo. | O chip "Área" recém-criado aparece tracejado. | Desejável | Desejável |
| RF098 | O "⋯" do chip deve ter "Excluir filtro", que tira o chip da linha de filtros. | Excluir "Status: Em análise" mostra os 48 itens. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI005 | Visualização (`ModelView`), `filters.field_filters` | Deve guardar "É" e "Não é" com 1 ou mais opções (`in` e `nin` com lista). Hoje cada filtro guarda 1 valor digitado; a busca da API já aceita `_in` e `_nin`. Formato: <a definir>. | Obrigatório |
| RI007 | Visualização (`ModelView`), condição "Nos próximos" | Deve guardar "Nos próximos N dias" como regra relativa (campo e N) e calcular o intervalo a cada abertura, a partir da data do dia. A busca da API tem `_gte` e `_lte` com data fixa e não tem operador relativo. Formato e quem calcula (front ou back): <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P011 | "Contém (case sensitive)" e "Não contém (case sensitive)", que o funil de texto oferece hoje, continuam? O protótipo não os tem. | Mikaela | Com eles, o texto ganha 2 condições na RN008 |
| P012 | O ícone vermelho de limpar filtros, que aparece hoje ao lado do período, continua? No protótipo, quem desfaz é "Excluir filtro" no "⋯" de cada chip e "Descartar" na barra flutuante. | Mikaela | Com ele, entra um requisito de "Limpar filtros" na linha de filtros |

# 2. Menu da coluna

**Objetivo:** pelo título da coluna, a pessoa ordena, filtra e oculta a coluna; o funil do título abre o chip do campo
na linha de filtros.

**Depende de:** 1. Linha de filtros e chip por campo.

**Onde vale:** o título de cada coluna da Tabela, na tela de itens, em Tarefas Rápidas e em Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. O menu abre com o botão direito
no título da coluna, ou com Shift + F10 no título em foco.

## Funil e menu da coluna (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF130 | O funil do título da coluna deve abrir o chip do campo na linha de filtros, no lugar do painel "Filtrar <campo>" de hoje; o chip nasce vazio quando o campo ainda não tem chip. | O funil de "Status" em "Em análise" abre "Status: Em análise". | Essencial | Obrigatório |
| RF107 | O botão direito ou Shift + F10 no título de uma coluna deve abrir o menu da coluna, ancorado no título, com "Ordenar crescente", "Ordenar decrescente", "Filtrar" e "Ocultar coluna". | O menu de "Área" abre logo abaixo do título "Área". | Importante | Obrigatório |
| RF118 | "Ordenar crescente" e "Ordenar decrescente" devem ordenar a tabela pela coluna do menu. | "Ordenar decrescente" em "Valor do contrato" põe o maior valor em cima. | Importante | Obrigatório |
| RF108 | "Filtrar" no menu da coluna deve abrir o chip do campo da coluna, como o funil. | "Filtrar" em "Área" abre o chip "Área" com as 5 áreas. | Importante | Obrigatório |
| RF109 | "Ocultar coluna" deve tirar a coluna da visualização. | Ocultar "Área" tira a coluna, e o construtor de visualização a mostra entre as ocultas. | Importante | Obrigatório |
| RF131 | A seta de ordenar e o alfinete de fixar coluna do título devem continuar como hoje. | Fixar a coluna "Referência" continua no alfinete. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI006 | Cabeçalho da tabela | O `EnTable` do SDK (`@be-enlighten/enspace-sdk-ui`) não tem slot de cabeçalho: tem só `cell-{key}`, `actions`, `empty` e `pagination`. A tabela da branch do PR 2936 já desenha ordenar, funil e alfinete no título; o menu da coluna e o funil novo entram nesse cabeçalho. Se a tabela final vier do SDK, o `EnTable` precisa de um slot `header-{key}`. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P009 | O menu da coluna precisa de um gatilho visível além do botão direito? A tabela da branch já tem funil e alfinete no título; o funil pode virar a porta do menu, ou continuar abrindo só o chip. | Mikaela e time de front | Muda o funil e o gatilho do menu da coluna |
| P015 | "Ocultar coluna" pode tirar a última coluna visível? O protótipo deixa. | Mikaela | Se não pode, "Ocultar coluna" fica desligado na última coluna visível |

# Pedido de mudança: estrutura de filtros da tela de itens

**Objetivo:** a pessoa filtra a lista sem abrir modal. Filtro simples é 1 chip por campo na linha de filtros; quando 1 campo só não basta, as regras com E, Ou e grupos ficam no filtro avançado, com um construtor próprio. Todo filtro aplicado na tela vira rascunho da visualização e pode ser salvo nela.

**Onde vale:** na tela nova de itens de cada categoria e, com a mesma lógica, em Tarefas Rápidas e Tarefas Agendadas, com os campos e os filtros automáticos da tabela de parâmetros de `REQUISITOS.md` (RF074 a RF076).

**Relação com `REQUISITOS.md`:** aquele documento cobre o construtor de visualizações (barra, lista do "+N", criar, painel, salvar). Este é o pedido de mudança da estrutura dos filtros: o que existe hoje, o que muda na lógica, o que muda no front e os requisitos. Os IDs seguem a numeração única do protótipo; os requisitos que vieram de lá mantêm o ID.

**Referência visual:** protótipo `visualizacoes-da-tela-de-itens`, estilo Proposta, rodada 5 de 23/10/2026: `evidencias/r5-chip-simples.jpg`, `r5-filtro-avancado.jpg`, `r5-botao-filtros.jpg`, `r5-menu-da-coluna.jpg` e `r5-painel-filtros.jpg`. A tela de hoje: `evidencias/develop-06-funil-da-coluna.jpg`, `develop-07-gaveta-de-filtros.jpg` e `develop-08-filtro-da-visualizacao.jpg`. Referências de mercado: `evidencias/ref-notion-*.jpg` e `ref-clickup-4-filtros.jpg`.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre aspas são os da interface em português. Medidas ficam a cargo do front.

**Fora do escopo:** a busca "Pesquisar registros" e o período ("Criado em", "Todo o período"); salvar, descartar e a barra flutuante (`REQUISITOS.md`, RF029 a RF035).

## Como é hoje

Conferido pela tela na branch do PR 2936, workspace de exploração, em 23/10/2026.

| # | Onde | O que acontece | Evidência |
|---|---|---|---|
| H1 | Título de cada coluna da tabela | Seta de ordenar, funil e alfinete de fixar a coluna. O funil abre "Filtrar <campo>" com "+ Adicionar Filtro"; cada regra é uma frase ("É totalmente Igual a <valor>") com o botão de confirmar. A regra só vale depois de confirmada. Com filtro, o funil ganha um ponto. | `develop-06-funil-da-coluna.jpg` |
| H2 | Funil de um campo de texto | 6 condições: "Igual", "Diferente", "Contém", "Não contém", "Contém (case sensitive)" e "Não contém (case sensitive)". | `develop-06-funil-da-coluna.jpg` |
| H3 | Mais de 1 regra no mesmo campo | A 2ª regra aparece embaixo da 1ª, sem conector visível (nem E nem Ou). | sem evidência visual: a 2ª regra só aparece depois de confirmar a 1ª, e a tabela fica vazia no workspace de exploração |
| H4 | Barra de ferramentas, ícone de filtros | Abre a gaveta "Filtros por campo" à esquerda ("Os mesmos filtros da tabela"), com 1 seção por campo. Mostra o nome técnico "reference". Campo de seleção filtra por caixas, com "Buscar opções..." e "Todos". | `develop-07-gaveta-de-filtros.jpg` |
| H5 | Filtro aplicado pela tabela | O funil e o ícone de filtros ganham um ponto, e um ícone vermelho de limpar filtros aparece ao lado do período. Nenhum controle grava esse filtro na visualização. | sem evidência visual: conferido na tela; o print mostraria a tabela vazia |
| H6 | Construtor de visualização, seção Filtros | "Filtros Automáticos" ("isOwner", "inGroups") e "Filtros por Campos Personalizados", cada um com "Adicionar", que abre um 2º modal. | `develop-02-filtro-automatico.jpg` |
| H7 | 2º modal "Adicionar Filtro" | "Campo", "Operação" e "Valor" em texto livre. A operação tem as mesmas 10 opções para todo campo: "Igual", "Diferente", "Menor", "Maior", "menor ou Igual", "Maior ou igual", "Contém", "não contém", "Inclui um dos" e "Não inclui nenhum dos". | `develop-08-filtro-da-visualizacao.jpg` |
| H8 | Dado da visualização | `filters.field_filters`, uma lista de `{field, op, value}` em que cada filtro vale junto com os outros, e `filters.quick_filters`. | `@be-enlighten/enspace-sdk-schemas`, `ModelView` |
| H9 | Busca da API | `_where` aceita `_and`, `_or` e `_nor` aninhados, e os operadores `_lt`, `_lte`, `_gt`, `_gte`, `_ne`, `_in`, `_nin`, `_contains`, `_ncontains`, `_containss`, `_ncontainss` e `_null`. | `@be-enlighten/enspace-sdk-schemas`, `EnlightenQueryWhere` |

## O que muda na lógica

| Hoje | Proposta | Requisitos |
|---|---|---|
| O filtro da tabela (funil, gaveta) e o filtro salvo na visualização são 2 coisas; o da tabela não se grava (H5). | Um filtro só: o que se aplica na tela é rascunho da visualização ativa e se salva nela pela barra flutuante. | RF110, P013 |
| As regras do mesmo campo aparecem sem conector (H3); campos diferentes valem juntos (H8). | Filtros simples valem juntos (1 chip por campo). O filtro avançado tem conector explícito, E ou Ou, e grupos de 1 nível. Os 3 tipos de filtro valem juntos. | RN007, RF099 a RF102, P010, S003 |
| As condições não dependem do tipo do campo no construtor (H7); o valor é texto livre. | A condição e o valor seguem o tipo do campo. | RF057, RF105, RF117 |
| "Inclui um dos" e "Não inclui nenhum dos" com valor digitado (H7). | "É" e "Não é" com 1 ou mais opções marcadas em caixas; marcar várias vale como "qualquer uma". | RF096, RF117, RI005 |
| A regra só existe depois de confirmada (H1). | A regra sem valor existe, não filtra e não conta no resultado, nem dentro de um grupo "Ou". | RF097, RF103 |
| Não há data relativa. | "Nos próximos N dias", recalculada a cada abertura. | RF057, RI007 |
| `field_filters` guarda uma lista (H8). | Além da lista, a visualização guarda a árvore do filtro avançado. | RI005 |

## O que muda no front

| Hoje | Proposta | Requisitos |
|---|---|---|
| Funil no título abre "Filtrar <campo>" com regras em frase (H1). | O funil abre o chip do campo na linha de filtros. O botão direito no título abre o menu da coluna. | RF130, RF107 a RF109, RF118, RF131 |
| Ícone de filtros abre a gaveta "Filtros por campo" (H4). | A gaveta sai. O botão Filtros mostra a linha de filtros com "+ Filtro" aberto. | RF132, RF106, RF094 |
| Filtro aplicado só aparece como ponto no funil e no ícone (H5). | Cada filtro aparece na linha de filtros, como chip, e o filtro avançado como "N regras". | RF034, RF124, RF096 |
| Construtor: "Adicionar" abre um 2º modal por filtro (H6, H7). | A seção Filtros do painel tem as linhas por campo e o construtor do filtro avançado, sem modal. | RF056, RF058, RF133 |
| Nome técnico ("reference", "isOwner", "inGroups") (H4, H6). | Rótulo legível. | RF134 |
| Não há filtro avançado. | Construtor com "Onde", "E" ou "Ou", grupos, "Duplicar", "Transformar em grupo" e "Desfazer o grupo". | RF100 a RF105, RF115, RF116 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN007 | Os filtros automáticos, os filtros por campo e o filtro avançado de uma visualização valem juntos: o item aparece só quando passa nos 3. | "Status é Em análise" no chip e "Área é Jurídico" no filtro avançado mostram só os itens em análise do Jurídico. |

## Linha de filtros (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF034 | A linha de filtros abaixo da barra de ferramentas deve mostrar, nesta ordem: os filtros automáticos em etiqueta com X, 1 chip por filtro por campo (RF096), o chip "N regras" do filtro avançado (RF100) e "+ Filtro" (RF094). | Mudar qualquer um cria rascunho (RF110). | Importante |
| RF124 | A linha de filtros deve aparecer quando a visualização ativa tem filtro, quando tem rascunho ou depois do botão Filtros (RF106), na Tabela e no Kanban. | Em "Itens", sem filtro, a linha não aparece até o botão Filtros. | Importante |
| RF106 | O botão Filtros da barra de ferramentas deve mostrar a linha de filtros, mesmo sem filtro, com "+ Filtro" aberto. | Em "Itens", o botão abre a lista de campos. | Importante |
| RF132 | A gaveta "Filtros por campo" da barra de ferramentas deve sair: o botão Filtros abre a linha de filtros (RF106). | Clicar no botão Filtros não abre gaveta lateral. | Essencial |
| RF094 | "+ Filtro" deve listar cada campo da categoria com o ícone do tipo e a busca "Filtrar por..." e, no fim, "Filtro avançado", com a contagem de regras quando o filtro avançado existe. | Digitar "ven" deixa só "Vencimento". | Essencial |
| RF095 | Escolher um campo sem chip em "+ Filtro" deve criar o chip do campo e abri-lo. | Escolher "Área" em "Em análise" cria e abre o chip "Área". | Essencial |
| RF112 | Escolher em "+ Filtro" um campo que já tem chip deve abrir o chip existente. | Escolher "Status" em "Em análise" abre o chip "Status: Em análise". | Importante |
| RF110 | Toda mudança da linha de filtros e do menu da coluna deve virar rascunho da visualização ativa e mostrar a barra flutuante (`REQUISITOS.md`, RF029 e RF031). | Marcar uma opção no chip mostra "Você alterou <nome>". | Essencial |

## Chip por campo (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF096 | O chip deve mostrar o campo e o que está escolhido ("Status: Em análise, Aprovado") e abrir um painel com o campo e a condição no topo e, em seleção e pessoa, as opções em caixas, com busca a partir de 7 opções e "Limpar seleção". | Marcar "Aprovado" em "Em análise" mostra os itens em análise e os aprovados. | Essencial |
| RF097 | O chip sem valor escolhido não deve filtrar. | "Filtrar" na coluna "Área" cria o chip "Área"; a tabela não muda. | Importante |
| RF113 | O chip sem valor escolhido deve aparecer tracejado, só com o nome do campo. | O chip "Área" recém-criado aparece tracejado. | Desejável |
| RF098 | O "⋯" do chip deve ter "Excluir filtro" e "Levar para o filtro avançado". | Os 2 itens aparecem no "⋯" de cada chip. | Importante |
| RF114 | "Levar para o filtro avançado" deve mover a regra para o fim do filtro avançado, criar o filtro avançado quando não existe e abri-lo. | Levar "Status: Em análise, Aprovado" deixa o chip "1 regra" com a mesma tabela. | Importante |
| RF099 | Os filtros devem valer conforme RN007. | O chip "Área: Jurídico" junto com "3 regras" mostra só os itens do Jurídico que passam nas 3 regras. | Essencial |

## Filtro avançado (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF100 | O filtro avançado deve mostrar "Onde" na 1ª linha; na 2ª, a escolha "E" ("Todas as regras precisam valer.") ou "Ou" ("Pelo menos 1 regra precisa valer."), que vale para o grupo inteiro; da 3ª em diante, o conector em texto. | Trocar "E" por "Ou" na 2ª linha troca o texto da 3ª. | Essencial |
| RF101 | Cada regra deve ter campo, condição, valor (RF057) e "⋯" com "Duplicar", "Transformar em grupo" e "Excluir"; cada grupo, "⋯" com "Duplicar", "Desfazer o grupo" e "Excluir". | "Desfazer o grupo" devolve as regras do grupo para o lugar dele. | Importante |
| RF102 | "Adicionar regra" deve oferecer "Adicionar regra" e "Adicionar grupo" ("Um grupo junta regras com E ou Ou."). O grupo fica num fundo próprio, tem conector próprio e só tem regras (S003). | Dentro do grupo, "Adicionar regra" não oferece grupo. | Essencial |
| RF103 | A regra sem valor não deve contar no resultado, nem dentro de um grupo "Ou". | Um grupo "Ou" com "Área é Jurídico" e uma regra de Status sem opção mostra só o Jurídico. | Essencial |
| RF104 | O grupo que fica sem regra deve sair do filtro avançado. | Excluir a única regra de um grupo tira o grupo. | Importante |
| RF115 | O filtro avançado sem regra deve sair quando o painel do filtro avançado fecha. | Excluir a única regra e fechar tira o chip "N regras". | Importante |
| RF116 | "Excluir filtro avançado" deve apagar cada regra e cada grupo do filtro avançado. | O chip "N regras" sai da linha de filtros. | Importante |

## Condição e valor (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF057 | A condição e o valor devem seguir o tipo do campo: seleção e pessoa com "É" e "Não é" (1 ou mais opções), "Está vazio" e "Está preenchido"; texto com "Contém", "É", "Está vazio" e "Está preenchido"; valor com "Maior ou igual a", "Menor ou igual a" e "É"; data com "Nos próximos" (dias), "A partir de", "Até", "Está vazio" e "Está preenchido". | Filtro de Vencimento oferece "Nos próximos" com dias. | Importante |
| RF105 | Trocar o campo de uma regra deve recomeçar a condição e o valor. | Trocar "Status" por "Valor do contrato" troca a condição para "Maior ou igual a". | Importante |
| RF117 | Trocar a condição entre "É" e "Não é" deve manter as opções marcadas. | "Status é Aprovado" vira "Status não é Aprovado". | Importante |
| RF134 | Nos filtros, cada campo e cada filtro automático deve aparecer pelo rótulo, e não pelo nome técnico ("reference", "isOwner", "inGroups", "inputText"). | A lista do "+ Filtro" mostra "Referência", não "reference". | Essencial |

## Coluna da tabela (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF130 | Na Tabela, o funil do título da coluna deve abrir o chip do campo na linha de filtros (RF095 e RF112), no lugar do painel "Filtrar <campo>" de hoje. | O funil de "Status" abre o chip "Status". | Essencial |
| RF107 | Na Tabela, o botão direito ou Shift + F10 no título de uma coluna deve abrir o menu da coluna, ancorado no título, com "Ordenar crescente", "Ordenar decrescente", "Filtrar" e "Ocultar coluna" (P009). | O menu de "Área" abre logo abaixo do título "Área". | Importante |
| RF108 | "Filtrar" no menu da coluna deve abrir o chip do campo da coluna (RF095). | "Filtrar" em "Área" abre o chip "Área" com as 5 áreas. | Importante |
| RF109 | "Ocultar coluna" deve tirar a coluna da visualização. | Ocultar "Área" tira a coluna e a mostra entre as ocultas no painel. | Importante |
| RF118 | "Ordenar crescente" e "Ordenar decrescente" devem ordenar a tabela pela coluna do menu. | "Ordenar decrescente" em "Valor do contrato" põe o maior valor em cima. | Importante |
| RF131 | A seta de ordenar e o alfinete de fixar coluna do título devem continuar como hoje. | Fixar a coluna "Referência" continua no alfinete. | Importante |

## Seção Filtros do painel Configurar (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF056 | Filtros deve ter os filtros automáticos como chaves com nome legível ("Só itens meus", "Só itens dos meus grupos"); "Por campo", com cada filtro numa linha (o campo em cima, a condição e o valor lado a lado) e "Adicionar filtro"; e "Filtro avançado", com o construtor de RF100 a RF104 ou o botão "Adicionar filtro avançado". No painel, o conector de cada regra vai em cima dela. Nada abre 2º modal. | No painel, o filtro de "Revisão trimestral" aparece com o grupo, e cada regra cabe na largura do painel. | Essencial |
| RF058 | "Adicionar filtro" deve criar o filtro num campo de seleção que ainda não tem filtro. | Com "Status é Em análise", o filtro novo nasce em "Área". | Importante |
| RF133 | No construtor de visualização, o 2º modal "Adicionar Filtro" e o 2º modal dos "Filtros Automáticos" devem sair; a seção Filtros do painel segue RF056. | Adicionar um filtro no painel não abre modal. | Essencial |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI005 | Visualização (`ModelView`), filtros | Deve guardar o filtro avançado (grupo com conector E ou Ou e regras, com grupo dentro de grupo em 1 nível) e as condições "é" e "não é" com 1 ou mais opções (`in` e `nin` com lista). Hoje guarda só `field_filters`, uma lista em que cada filtro vale junto com os outros; a busca da API já aceita `_where` com `_and` e `_or`. Formato: <a definir>. |
| RI006 | Cabeçalho da tabela | O protótipo usa o `EnTable` do SDK (`@be-enlighten/enspace-sdk-ui`), sem slot de cabeçalho: tem só `cell-{key}`, `actions`, `empty` e `pagination`. A tabela da branch já desenha ordenar, funil e alfinete no título. O menu da coluna (RF107) e o funil (RF130) entram nesse cabeçalho; se a tabela final vier do SDK, o `EnTable` precisa de um slot `header-{key}`. |
| RI007 | Visualização (`ModelView`), regra de data relativa | Deve guardar "Nos próximos N dias" como regra relativa (campo, N) e calcular o intervalo a cada abertura, a partir da data do dia. A busca da API tem `_gte` e `_lte` com data fixa; não tem operador relativo. Formato e quem calcula (front ou back): <a definir>. |

## Não funcionais (RNF)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF003 | A linha de filtros, o chip, o filtro avançado, o menu da coluna e a seção Filtros do painel devem funcionar em português, inglês e espanhol sem texto cortado nos botões. | Conferir os 3 idiomas no andaime do protótipo. | Importante |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P003 | O filtro automático "isOwner" da tela de itens é dono, criador ou responsável? O protótipo escreve "itens em que você é o dono". | Time de back | Muda o rótulo de RF056. |
| P009 | O menu da coluna precisa de um gatilho visível além do botão direito? A tabela da branch já tem funil e alfinete no título; o funil pode virar a porta do menu, ou continuar abrindo só o chip (RF130). | Mikaela e time de front | Muda RF107 e RF130. |
| P010 | Hoje, as regras do mesmo campo no funil e na gaveta aparecem sem conector. Elas valem com E ou com Ou? | Time de back | Se valem com Ou, a migração dos filtros de hoje para o chip muda (RI005). |
| P011 | "Contém (case sensitive)" e "Não contém (case sensitive)", que o funil de texto oferece hoje, continuam? O protótipo não os tem. | Mikaela | Com eles, o texto ganha 2 condições em RF057. |
| P012 | O ícone vermelho de limpar filtros, que aparece hoje ao lado do período, continua? No protótipo, quem desfaz é "Descartar" na barra flutuante e o "⋯" de cada chip. | Mikaela | Com ele, entra um requisito de "Limpar filtros" na linha de filtros. |
| P013 | Os filtros aplicados hoje pelo funil e pela gaveta ficam guardados em algum lugar (endereço, sessão, visualização)? Na tela, nada oferece gravá-los na visualização. | Time de front | Define a migração para o rascunho de RF110. |
| S003 | O filtro avançado tem grupo dentro de grupo em só 1 nível; o Notion aceita mais. 1 nível cobre "A e (B ou C)" e mantém o filtro legível. | Mikaela confirma | Com mais níveis, "Transformar em grupo" e "Adicionar grupo" passam a valer dentro do grupo. |

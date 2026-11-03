# 3. Filtro avançado

**Objetivo:** quando 1 chip por campo não basta, a pessoa junta regras com E ou Ou, em grupos de 1 nível, num construtor
aberto pela linha de filtros.

**Depende de:** 1. Linha de filtros e chip por campo.

**Onde vale:** a linha de filtros e o "+ Filtro" da tela de itens, de Tarefas Rápidas e de Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. A visualização "Revisão
trimestral" abre com o chip "3 regras", com 1 grupo "Ou".

## Na linha de filtros (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF136 | A lista do "+ Filtro" deve terminar em "Filtro avançado", com a contagem de regras quando o filtro avançado existe. | Em "Revisão trimestral", o fim da lista mostra "Filtro avançado" com "3". | Essencial | Obrigatório |
| RF137 | O filtro avançado deve aparecer na linha de filtros como o chip "N regras", depois dos chips por campo, e abrir o construtor. | Em "Revisão trimestral", o chip "3 regras" abre o construtor com o grupo. | Essencial | Obrigatório |
| RF138 | O filtro avançado deve valer junto com os filtros automáticos e os chips, conforme RN007. | "Área: Jurídico" junto com "3 regras" mostra só os itens do Jurídico que passam nas 3 regras. | Essencial | Obrigatório |
| RF114 | O "⋯" de cada chip deve ter "Levar para o filtro avançado", que move a regra do chip para o fim do filtro avançado, cria o filtro avançado quando não existe e o abre. | Levar "Status: Em análise, Aprovado" deixa o chip "1 regra", com a mesma tabela. | Importante | Obrigatório |
| RF116 | "Excluir filtro avançado" deve apagar cada regra e cada grupo do filtro avançado. | O chip "N regras" sai da linha de filtros. | Importante | Obrigatório |
| RF115 | O filtro avançado sem regra deve sair quando o construtor fecha. | Excluir a única regra e fechar o construtor tira o chip "N regras". | Importante | Obrigatório |

## Construtor de regras (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF100 | O construtor deve mostrar "Onde" na 1ª regra; na 2ª, a escolha "E" ("Todas as regras precisam valer.") ou "Ou" ("Pelo menos 1 regra precisa valer."), que vale para o grupo inteiro; da 3ª em diante, o conector em texto. | Trocar "E" por "Ou" na 2ª regra troca o texto da 3ª. | Essencial | Obrigatório |
| RF101 | Cada regra deve ter campo, condição e valor, conforme RN008, e o "⋯" com "Duplicar", "Transformar em grupo" e "Excluir". | "Transformar em grupo" põe a regra num grupo novo, no mesmo lugar. | Importante | Obrigatório |
| RF139 | Cada grupo deve ter o "⋯" com "Duplicar", "Desfazer o grupo" e "Excluir". | "Desfazer o grupo" devolve as regras do grupo para o lugar dele. | Importante | Obrigatório |
| RF102 | "Adicionar regra" deve oferecer "Adicionar regra" e "Adicionar grupo" ("Um grupo junta regras com E ou Ou."); o grupo fica num fundo próprio, com conector próprio, e só tem regras. | Dentro do grupo, "Adicionar regra" não oferece grupo. | Essencial | Obrigatório |
| RF105 | Trocar o campo de uma regra deve recomeçar a condição e o valor. | Trocar "Status" por "Valor do contrato" troca a condição para "Maior ou igual a". | Importante | Obrigatório |
| RF103 | A regra sem valor não deve contar no resultado, nem dentro de um grupo "Ou". | Um grupo "Ou" com "Área é Jurídico" e uma regra de Status sem opção mostra só o Jurídico. | Essencial | Obrigatório |
| RF104 | O grupo que fica sem regra deve sair do filtro avançado. | Excluir a única regra de um grupo tira o grupo. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI008 | Visualização (`ModelView`), filtro avançado | Deve guardar a árvore do filtro avançado: um grupo com conector E ou Ou e regras, com grupo dentro de grupo em 1 nível. Hoje a visualização guarda só `field_filters`, uma lista em que cada filtro vale junto com os outros; a busca da API já aceita `_where` com `_and` e `_or` aninhados. Formato: <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S003 | O filtro avançado tem grupo dentro de grupo em só 1 nível; o Notion aceita mais. 1 nível cobre "A e (B ou C)" e mantém o filtro legível. | Mikaela confirma | Com mais níveis, "Transformar em grupo" e "Adicionar grupo" passam a valer dentro do grupo |

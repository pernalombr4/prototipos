# 5. Filtro, ordem, numeração e total

**Objetivo:** quem monta a repetição escolhe quais linhas saem e em que ordem, numera as linhas, soma uma informação de
moeda e escreve o texto que aparece quando nenhuma linha sai.

**Depende de:** 2. Condições; 4. Repetições.

**Onde vale:** o montador de repetição da aba "Repetições" do editor de modelos e o bloco de repetição no documento.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", botão "Editor
de modelos", aba "Repetições" e "Editar" na repetição de Parcelas.

## Numeração e total (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF253 | A repetição nova deve nascer no formato Tabela, com "Numerar as linhas" ligada, a soma ligada quando há informação de moeda marcada e a parte "Se a lista estiver vazia". | Para Parcelas, a repetição nova traz Vencimento e Valor da parcela, a coluna "Nº" e a linha "Total". | Importante | Obrigatório |
| RF222 | A chave "Numerar as linhas" (Tabela e Texto corrido) deve numerar as linhas a partir de 1, depois do filtro e da ordem: na Tabela, na coluna "Nº"; no Texto corrido, com "<n>. " antes de cada linha. | Com 2 parcelas em aberto, a prévia mostra 1 e 2. | Importante | Obrigatório |
| RF223 | Na Tabela com uma informação de moeda, a chave "Somar <informação> no fim" deve acrescentar a linha "Total" com a soma das linhas que saem. | Com 2 parcelas de R$ 61.500,00, o total é R$ 123.000,00. | Importante | Obrigatório |

## Filtro e ordem (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF224 | "Filtrar as linhas" deve abrir "Só as linhas em que", com as mesmas linhas de Campo, Condição e Valor do montador de condição, sem o botão "Grupo", sobre as informações da lista, e "Tirar o filtro". | "Situação é Em aberto" deixa de fora a parcela paga. | Importante | Obrigatório |
| RF254 | Com uma linha do filtro incompleta, o filtro deve mostrar "Complete o campo, a condição e o valor de cada linha." e desabilitar "Inserir repetição" ou "Salvar repetição". | Uma linha de filtro sem Valor desabilita o botão. | Importante | Obrigatório |
| RF225 | "Ordenar por" deve oferecer, numa linha só, "Na ordem da lista" (padrão) e cada informação da lista, com "Crescente" ou "Decrescente". | "Vencimento, Decrescente" põe 10/01/2027 antes de 10/12/2026. | Importante | Obrigatório |

## Lista vazia (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF226 | O montador deve ter o botão "Se a lista estiver vazia", que acrescenta a parte de mesmo nome ao montador e ao bloco do documento, com o texto "Não há <lista>." para a pessoa trocar no documento. | Para Parcelas, o bloco ganha a parte "Se a lista estiver vazia" com "Não há parcelas.". | Importante | Obrigatório |
| RF235 | A parte "Se a lista estiver vazia" deve ter, no montador, a lixeira "Remover "Se a lista estiver vazia"" e a ajuda "Aparece quando nenhuma linha sai. O texto fica no documento, na parte "Se a lista estiver vazia" do bloco.". | A lixeira tira a parte do montador e, ao salvar, do bloco. | Importante | Obrigatório |
| RF241 | O botão "Se a lista estiver vazia" deve sumir enquanto a parte existe. | Remover a parte devolve o botão. | Importante | Obrigatório |
| RF233 | Quando 0 linhas saem, o documento deve mostrar só o texto da parte "Se a lista estiver vazia", sem a tabela, os títulos e o total; sem essa parte, nada aparece no lugar da repetição. | Com o filtro "Valor da parcela está vazio", a prévia do CTR-0142 mostra "Não há parcelas.". | Importante | Obrigatório |

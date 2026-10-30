# 4. Repetições

**Objetivo:** quem monta o modelo repete um trecho para cada linha de uma lista do item, escolhendo pela lateral a
lista, o formato (tabela, lista ou texto) e as informações de cada linha.

**Depende de:** 1. Editor de modelos e campos.

**Onde vale:** a aba "Repetições" da lateral do editor de modelos, o montador de repetição e o bloco de repetição no
documento.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", botão "Editor
de modelos" e aba "Repetições".

## A lista do modelo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF217 | A aba Repetições deve listar as repetições do modelo em "Neste modelo (<N>)", cada uma com o cabeçalho do bloco, o selo do formato e o selo "<N> linhas", "1 linha" ou "Lista vazia" para o item da prévia, com "Localizar no documento", "Editar" e o menu "Mais ações" com "Excluir a repetição". | O CTR-0142 mostra "3 linhas" na repetição de Parcelas. | Essencial | Obrigatório |
| RF250 | Sem repetição no modelo, a lista deve mostrar "Este modelo ainda não tem repetições.". | A lista não fica vazia sem explicação. | Desejável | Desejável |
| RF248 | "Excluir a repetição" deve apagar o bloco e mostrar "Repetição excluída.". | A tabela de Parcelas sai do documento. | Importante | Obrigatório |
| RF218 | A aba deve ter o botão "Nova repetição" e a ajuda "Clique no documento onde a repetição deve entrar e clique em Nova repetição.". | O bloco novo entra depois do parágrafo do cursor. | Essencial | Obrigatório |
| RF076 | Enquanto o cursor está dentro de um bloco de repetição, a aba Campos deve mostrar as informações daquela lista no topo, para inserir. | Com o cursor na tabela de Parcelas, "Vencimento" aparece para inserir. | Importante | Obrigatório |

## O montador (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF236 | O montador deve mostrar, abaixo do título, "Aqui se define o que repete, como aparece e quais linhas saem. Títulos e textos se escrevem no documento, dentro do bloco.". | A ajuda aparece ao criar e ao editar uma repetição. | Importante | Obrigatório |
| RF237 | O montador deve separar as escolhas em 3 seções: "O que repete" (Lista), "Como aparece" (Formato, Informações de cada linha, numeração e total) e "Quais linhas saem" (filtro e ordem). | As 3 seções aparecem nessa ordem, separadas por linha. | Importante | Obrigatório |
| RF073 | O montador deve escolher a Lista (campo Repetidor da categoria) e as "Informações de cada linha". | Escolher "Parcelas" mostra "Número, Vencimento, Valor da parcela, Situação". | Essencial | Obrigatório |
| RF252 | Trocar a Lista deve marcar as 2 primeiras informações da lista nova e tirar o filtro, a ordem e a soma. | Depois da troca, "Quais linhas saem" volta a "Filtrar as linhas" e "Na ordem da lista". | Importante | Obrigatório |
| RF219 | O montador deve ter "Formato", em lista, com "Tabela" (padrão), "Lista numerada", "Lista com marcadores" e "Texto corrido". | Escolher "Lista numerada" troca a tabela por uma lista no documento. | Essencial | Obrigatório |
| RF220 | As informações marcadas devem poder subir e descer ("Mover para cima", "Mover para baixo"), e a ordem delas é a ordem das colunas ou do texto. | Subir "Valor da parcela" põe a coluna antes de "Vencimento". | Importante | Obrigatório |
| RF074 | Se a lista de informações marcadas fica vazia, o montador deve mostrar "Escolha ao menos 1 informação." e desabilitar "Inserir repetição". | O bloco não nasce vazio. | Importante | Obrigatório |
| RF227 | O montador deve mostrar o resultado para o item da prévia: "Com o <referência>, saem <N> linhas.", "Com o <referência>, sai 1 linha.", "Com o <referência>, nenhuma linha sai, e aparece o texto de "Se a lista estiver vazia"." ou "Com o <referência>, nenhuma linha sai, e nada aparece no lugar.". | Com o CTR-0142: "Com o CTR-0142, saem 3 linhas.". | Importante | Obrigatório |
| RF245 | "Cancelar" e a seta "Voltar à lista" do montador de repetição devem fechar o montador sem mudar o documento. | Mudar o formato e cancelar deixa o bloco como estava. | Importante | Obrigatório |

## No documento (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF075 | "Inserir repetição" deve criar um bloco emoldurado com o cabeçalho "Para cada linha de <lista>", acrescido de "só onde <frase>" com filtro e de "por <informação> ↑" ou "↓" com ordem, e o rodapé "Fim da repetição". | O esqueleto `{{FOR item IN variavel}}` de hoje não aparece no documento. | Essencial | Obrigatório |
| RF221 | No formato Tabela, o bloco deve ter a linha de títulos, editável no documento, e 1 linha modelo com as etiquetas; os títulos digitados ficam ao trocar as colunas. | Trocar "Vencimento" por "Data de vencimento" no título e acrescentar uma coluna mantém "Data de vencimento". | Importante | Obrigatório |
| RF228 | No Texto corrido, as linhas devem sair na mesma frase, separadas por ";", com "e" antes da última. | "Vencimento: 10/11/2026, Valor da parcela: R$ 61.500,00; Vencimento: ... e Vencimento: ...". | Desejável | Desejável |
| RF229 | "Salvar repetição" deve manter o texto digitado no bloco quando a lista, o formato, as informações, a numeração e o total não mudam. | Mudar só o filtro mantém o texto do bloco. | Importante | Obrigatório |

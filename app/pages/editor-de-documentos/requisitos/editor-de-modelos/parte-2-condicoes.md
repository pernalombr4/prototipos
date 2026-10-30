# 2. Condições

**Objetivo:** quem monta o modelo escolhe, pela lateral, quando um trecho do documento aparece, com linhas de Campo,
Condição e Valor que se leem como frase, e vê o resultado para o item da prévia.

**Depende de:** 1. Editor de modelos e campos.

**Onde vale:** a aba "Condições" da lateral do editor de modelos, o montador de condição e o bloco de condição no
documento.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", botão "Editor
de modelos" e aba "Condições".

## A lista do modelo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF205 | A aba Condições deve listar as condições do modelo em "Neste modelo (<N>)", na ordem do documento, cada uma com a frase da 1ª parte, um selo por parte a mais e o selo "Aparece: <parte>" ou "Não aparece" para o item da prévia. | Com o CTR-0142, o cartão da cláusula 4 mostra "Aparece: Se". | Essencial | Obrigatório |
| RF249 | Sem condição no modelo, a lista deve mostrar "Este modelo ainda não tem condições.". | A lista não fica vazia sem explicação. | Desejável | Desejável |
| RF206 | Cada condição da lista deve ter "Localizar no documento", que rola o documento até o bloco e o destaca. | O bloco pisca no documento. | Importante | Obrigatório |
| RF207 | Cada condição da lista deve ter o botão "Editar", que abre o montador com a condição. | O montador mostra as partes e as linhas da condição. | Essencial | Obrigatório |
| RF208 | O menu "Mais ações" de cada condição deve ter "Tirar a condição e manter o texto" e "Excluir a condição e o texto". | Os 2 itens aparecem no menu. | Importante | Obrigatório |
| RF246 | "Tirar a condição e manter o texto" deve deixar no documento o texto de cada parte, sem bloco, e mostrar "Condição tirada. O texto continua no documento.". | A cláusula 4 continua no documento, com as 3 versões do texto. | Importante | Obrigatório |
| RF247 | "Excluir a condição e o texto" deve apagar o bloco com o texto de cada parte e mostrar "Condição e texto excluídos.". | A cláusula 4 sai do documento. | Importante | Obrigatório |
| RF209 | Enquanto o cursor está dentro de um bloco de condição ou de repetição, o cartão do bloco na lista deve ficar destacado com "O cursor está aqui". | Clicar na cláusula 4 destaca o cartão dela; clicar na tabela de Parcelas destaca o cartão da repetição. | Desejável | Desejável |

## Criar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF210 | A aba deve ter o botão "Nova condição" e a ajuda "Selecione no documento o trecho que depende de uma condição e clique em Nova condição. Sem seleção, a condição entra no cursor com um texto para você trocar.". | O botão abre o montador vazio. | Essencial | Obrigatório |
| RF071 | Se há texto selecionado no documento, os parágrafos tocados pela seleção devem passar inteiros para a 1ª parte do bloco, que fica no lugar deles; o montador mostra "Os parágrafos do trecho selecionado passam para dentro da condição.". | Selecionar a cláusula 3 com clique triplo deixa a cláusula 3 no bloco, e a cláusula 4 fica fora. | Importante | Obrigatório |
| RF211 | Um bloco de condição ou de repetição tocado só em parte pela seleção deve ficar fora da condição nova. | O bloco vizinho continua inteiro. | Importante | Obrigatório |
| RF212 | Sem seleção, o bloco novo deve entrar depois do parágrafo do cursor, com o texto "Escreva aqui o texto que aparece quando a condição vale.". | O texto padrão aparece dentro da parte "Se". | Importante | Obrigatório |

## O montador (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF234 | O montador deve mostrar, abaixo do título, "Aqui se define quando cada texto aparece. O texto de cada parte se escreve no documento, dentro do bloco.". | A ajuda aparece ao criar e ao editar uma condição. | Importante | Obrigatório |
| RF065 | O montador deve montar a condição com linhas de Campo, Condição e Valor, com o Campo e a Condição lado a lado e o Valor abaixo. | Nenhuma escolha exige digitar a referência técnica do campo. | Essencial | Obrigatório |
| RF201 | A linha nova deve nascer vazia, com "Escolha o campo", e Condição e Valor desabilitados até a escolha do campo. | A linha nova não traz um campo já escolhido. Hoje nasce com "Status é igual a Assinado". | Importante | Obrigatório |
| RF242 | Ao escolher o campo, a Condição deve vir com a 1ª opção do tipo (RF066) e o Valor, vazio. | Escolher "Valor" traz "é igual a" e o Valor em branco. | Importante | Obrigatório |
| RF066 | A lista de condições deve depender do tipo do campo: texto com "é igual a", "é diferente de", "contém", "está vazio" e "está preenchido"; opção e pessoa com "é", "não é", "está vazio" e "está preenchido"; número e moeda com "é igual a", "é diferente de", "é maior que", "é menor que", "é maior ou igual a", "é menor ou igual a", "está vazio" e "está preenchido"; data com "é antes de", "é depois de", "é igual a", "está vazio" e "está preenchido". | Escolher "Status" mostra só "é", "não é", "está vazio" e "está preenchido". | Essencial | Obrigatório |
| RF067 | O Valor deve ser escolhido na lista de opções, com mais de 1 escolha, quando o campo é de opção ou de pessoa; digitado com máscara quando é número ou moeda; escolhido no calendário quando é data; digitado livre quando é texto. | "Status é Em revisão, Aguardando assinatura" vale para os 2 status. | Essencial | Obrigatório |
| RF213 | As condições "está vazio" e "está preenchido" não devem pedir Valor. | A linha fica só com Campo e Condição. | Importante | Obrigatório |
| RF068 | O botão "Condição" deve acrescentar outra linha. | Clicar 1 vez deixa 2 linhas. | Importante | Obrigatório |
| RF243 | O botão "Remover a condição" de uma linha deve ficar desabilitado quando há 1 linha só. | A condição nunca fica sem linha. | Importante | Obrigatório |
| RF098 | Com 2 ou mais linhas, o montador deve mostrar "Precisa valer" com "Todas as condições" e "Qualquer uma". | Com 2 linhas e "Todas as condições", o trecho só aparece quando as 2 valem. | Importante | Obrigatório |
| RF232 | Cada linha a partir da 2ª deve mostrar o conectivo em cinza: "e" com "Todas as condições" e "ou" com "Qualquer uma". | Com "Qualquer uma", as linhas mostram "ou". | Importante | Obrigatório |
| RF204 | Com as linhas completas, o montador deve mostrar o resultado para o item da prévia: "Com o <referência>, aparece o texto de "<parte>"." ou "Com o <referência>, nenhum texto desta condição aparece.". | Com o CTR-0142: "Com o CTR-0142, aparece o texto de "Se".". | Importante | Obrigatório |
| RF215 | Com alguma linha incompleta, o montador deve mostrar "Complete o campo, a condição e o valor de cada linha." e desabilitar "Inserir condição" ou "Salvar condição". | Uma linha sem Valor desabilita o botão. | Essencial | Obrigatório |
| RF238 | "Cancelar" e a seta "Voltar à lista" do montador devem fechar o montador sem mudar o documento. | Mudar o valor e cancelar deixa o bloco como estava. | Importante | Obrigatório |

## No documento (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF070 | "Inserir condição" deve criar no documento um bloco emoldurado, com 1 cabeçalho por parte ("Se <frase>") e o rodapé "Fim da condição". | O esqueleto `{{}}{{IF variavel === 'valor'}} conteúdo {{END-IF}}` de hoje não aparece no documento. | Essencial | Obrigatório |
| RF069 | A frase de cada parte deve vir em português, com os valores como a pessoa os vê. | "Se Valor é maior que R$ 150.000,00 e Status é Em revisão ou Aguardando assinatura". | Essencial | Obrigatório |
| RF216 | "Salvar condição" deve atualizar os cabeçalhos do bloco e manter o texto de cada parte que já existia; a parte removida sai do documento com o texto dela. | Mudar o valor de "Se" mantém o texto da cláusula 4. | Essencial | Obrigatório |

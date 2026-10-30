# 3. Grupo, "Senão, se" e "Nos demais casos"

**Objetivo:** quem monta a condição mistura E e OU num grupo de linhas e escreve textos alternativos para cada caso,
com "Senão, se" e "Nos demais casos", no mesmo bloco.

**Depende de:** 2. Condições.

**Onde vale:** o montador de condição da aba "Condições" do editor de modelos e o bloco de condição no documento.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", botão "Editor
de modelos", aba "Condições" e "Editar" na condição da cláusula 4.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN008 | As partes de uma condição são avaliadas em ordem, e só aparece o texto da 1ª parte que vale; o texto de "Nos demais casos" aparece quando a avaliação chega ao fim sem parte que valha. | Com "Se Valor > R$ 150.000,00" e "Senão, se Valor > R$ 50.000,00": o CTR-0142 (R$ 184.500,00) mostra o texto de "Se"; o CTR-0141 (R$ 62.000,00), o de "Senão, se"; o CTR-0133 (R$ 36.000,00), o de "Nos demais casos". | Obrigatório |
| RN009 | Um grupo fica dentro de uma parte e só contém linhas de condição; grupo dentro de grupo não existe. | "Valor > R$ 150.000,00 e (Status é Em revisão ou Responsável é Carla Menezes)". | Obrigatório |

## Grupo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF200 | O botão "Grupo" deve acrescentar à parte uma caixa com o próprio "Precisa valer" e 2 linhas (RN009). | "Valor é maior que R$ 150.000,00 e (Status é Em revisão ou Responsável é Carla Menezes)". | Importante | Obrigatório |
| RF244 | O grupo deve nascer com "Qualquer uma" e ter a lixeira "Remover o grupo". | O grupo novo mostra "ou" na 2ª linha. | Importante | Obrigatório |
| RF214 | Um grupo que fica com 1 linha deve virar linha comum da parte. | Remover 1 das 2 linhas do grupo desfaz a caixa. | Desejável | Desejável |

## Partes da condição (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF202 | O botão "Senão, se…" deve acrescentar uma parte com regra própria, avaliada depois das anteriores (RN008). | A parte nova aparece com o selo "Senão, se" e a lixeira "Remover esta parte"; no documento, o bloco ganha o cabeçalho "Senão, se <frase>". | Importante | Obrigatório |
| RF203 | O botão "Nos demais casos", ao lado de "Senão, se…", deve acrescentar ao montador a parte "Nos demais casos", sem regra, com a lixeira "Remover "Nos demais casos"" e a ajuda "Aparece quando nenhuma parte acima vale. O texto fica no documento, na parte "Nos demais casos" do bloco.". | Clicar no botão cria a parte no montador e, ao salvar, no bloco do documento, com "Escreva aqui o texto dos demais casos.". | Importante | Obrigatório |
| RF240 | O botão "Nos demais casos" deve sumir enquanto a parte "Nos demais casos" existe. | Remover a parte devolve o botão. | Importante | Obrigatório |

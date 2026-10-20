# Requisitos: fase 6, casos de uso e importação

**Objetivo:** montar menus a partir de um caso de uso pronto, do ENSPACE ou do próprio workspace, e levar os menus de
um workspace para outro por arquivo. É a última fase: depois dela, o menu novo pode ir para o cliente.

**Onde vale:** o pé do "+" do Início, a Central de casos de uso, a janela Importar e Configurações > Interface > Casos
de uso.

**Referência visual:** https://pernalombr4.github.io/prototipos/menu-lateral/, modelo "Trilha e painel", "+" do
Início. O mapa das 6 fases está em [fases.md](fases.md).

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre
aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.

**Fora do escopo:** a tela de migração de workspace do protótipo `migracao-de-workspace`, que compara categoria por
categoria; os casos de uso, os números de uso e as miniaturas do protótipo são dado de maquete.

## Resumo

| Grupo | O que muda em relação ao menu de hoje | Requisitos |
|---|---|---|
| Portas | O "+" do Início ganha Importar e Casos de uso no pé | RF501 a RF503 |
| Central de casos de uso | Galeria com filtros, áreas e busca | RF504 a RF509 |
| Detalhe do caso | Galeria de imagens, o que vem junto e quem fez | RF510 a RF513 |
| Usar e guardar | "Usar caso de uso" aplica; "Adicionar ao workspace" só guarda | RF514 a RF519, RF529 e RF530 |
| Criar caso de uso | A partir do menu de hoje, com os prints da galeria | RF520, RF521 e RF531 a RF534 |
| Importar e exportar | Arquivo `.json` de outro workspace, somar ou substituir | RF522 a RF528 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN501 | Usar um caso de uso aplica os menus dele ao workspace; adicionar ao workspace só guarda uma cópia do caso, sem mudar o menu. | "Adicionar ao workspace" põe o caso em "Do seu workspace" e o menu continua igual. |
| RN502 | Ao aplicar um caso ou importar um arquivo, a pessoa escolhe entre somar ao menu de hoje ou substituir o menu de hoje. | Somar mantém Comercial; substituir tira Comercial. |
| RN503 | O que um caso de uso ou um arquivo aplica entra no rascunho da fase 4, como as outras mudanças no menu. | Usar um caso acende "Alterações não salvas". |
| RN504 | O arquivo exportado leva a estrutura dos menus e das categorias, sem dado de item. | O arquivo de "Jurídico" leva as categorias e os campos, sem nenhum contrato. |
| RN505 | Só quem tem licença Owner ou Full pode usar, importar ou criar caso de uso (RN404 da fase 5). | Membro com licença Basic vê as portas desligadas. |

## Portas (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF501 | A lista do "+" do Início deve ter, no pé, "Importar" e "Casos de uso". | Os 2 aparecem abaixo de "Personalizar a barra lateral". | Essencial |
| RF502 | "Casos de uso" do "+" e Configurações > Interface > Casos de uso devem abrir a Central de casos de uso. | As 2 portas abrem a Central na vista "Destaques". | Essencial |
| RF503 | Se a pessoa não cumpre a RN505, "Importar" e "Casos de uso" devem aparecer desligados, com "Só quem configura o workspace". | Estado sem permissão: os 2 itens desligados. | Essencial |

## Central de casos de uso (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF504 | A Central deve ter as vistas "Destaques", "Do seu workspace" e "Do ENSPACE". | Trocar a vista troca os cartões. | Essencial |
| RF505 | A Central deve filtrar por Tipo (workspace completo, menu, categoria, tela) e por Complexidade. | Marcar "menu" deixa só casos do tipo menu. | Importante |
| RF506 | A Central deve ter "Áreas", com busca, "Selecionar tudo" e mais de 1 área marcada ao mesmo tempo. | Marcar Jurídico e Comercial mostra os casos das 2. | Importante |
| RF507 | A Central deve ter busca por nome do caso. | Buscar "contrato" acha os casos com "contrato" no nome. | Importante |
| RF508 | Os cartões devem vir agrupados por área, cada grupo com "Ver mais". | O grupo Jurídico mostra os primeiros cartões e "Ver mais". | Desejável |
| RF509 | A Central deve ter a faixa "Criar caso de uso", que abre o formulário de RF520. | A faixa aparece em "Do seu workspace". | Importante |

## Detalhe do caso (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF510 | Clicar num cartão deve abrir o detalhe: ícone, nome, complexidade, área e o botão "Usar caso de uso". | O detalhe abre na mesma Central, com caminho de volta. | Essencial |
| RF511 | O detalhe deve ter a galeria de imagens, com setas e pontos, que amplia em tela cheia. | Clicar na imagem amplia; Esc fecha. | Importante |
| RF512 | O detalhe deve listar "O que vem junto": menus e telas, categorias e campos, e status, abrindo item a item. | Abrir "Menus e telas" mostra os menus do caso. | Essencial |
| RF513 | O detalhe deve mostrar, à direita, quem fez, quando e quantas vezes o caso foi usado. | Os 3 dados aparecem em todo caso. | Desejável |

## Usar e guardar (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF514 | "Usar caso de uso" deve mostrar o que entra no workspace antes de aplicar. | A janela lista os menus e as categorias do caso. | Essencial |
| RF515 | "Usar caso de uso" deve pedir "somar" ou "substituir" (RN502), num grupo de opções exclusivas. | Uma das 2 opções fica escolhida por vez. | Essencial |
| RF516 | Com "substituir" escolhido, a janela deve mostrar riscado o que sai do menu de hoje. | Substituir mostra Comercial riscado. | Essencial |
| RF529 | Com "substituir" escolhido, o botão de usar deve ficar vermelho e trocar de ícone. | Trocar para substituir muda a cor do botão. | Importante |
| RF517 | "Usar caso de uso" deve pedir onde os menus entram. | Os lugares são os de "Onde ele fica" da fase 5. | Importante |
| RF518 | Aplicar deve pôr os menus no rascunho (RN503) e as categorias na lista de Categorias. | Depois de usar, o cartão "Alterações não salvas" aparece. | Essencial |
| RF519 | O "…" do caso deve ter "Adicionar ao workspace", com a explicação "O menu não muda" (RN501). | Adicionar põe o caso em "Do seu workspace" e o menu não muda. | Importante |
| RF530 | Depois de "Adicionar ao workspace", o aviso deve dizer que o caso foi guardado e que o menu não mudou. | O aviso aparece depois de adicionar. | Desejável |

## Criar caso de uso (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF520 | "Criar caso de uso" deve pedir nome, área, complexidade, descrição e quais menus do workspace entram. | Sem nome, a janela não salva e mostra o erro no campo. | Importante |
| RF521 | O caso criado deve aparecer em "Do seu workspace". | Criar "Rotina do jurídico" põe o cartão na vista. | Importante |
| RF531 | "Criar caso de uso" deve ter o campo "Imagens da galeria", que recebe imagens PNG, JPG ou GIF arrastadas ou escolhidas pelo clique, mais de 1 por vez, com a miniatura de cada uma e o botão que tira a imagem. | Soltar 2 prints mostra as 2 miniaturas no campo. | Importante |
| RF532 | A galeria do detalhe (RF511) deve mostrar os prints do caso na ordem em que subiram. | Caso com 2 prints: a galeria tem 2 pontos. | Importante |
| RF534 | O cartão do caso na Central deve usar o primeiro print como capa. | Caso com 2 prints: o cartão mostra o primeiro. | Desejável |
| RF533 | Sem imagem, a galeria deve mostrar a prévia montada com os menus, os status e os campos do caso. | Caso criado sem print: a galeria mostra a prévia dos menus. | Importante |

## Importar e exportar (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF522 | "Importar" deve ter uma área que recebe o arquivo `.json` arrastado ou escolhido pelo clique, e que abre também com Enter e Espaço. | Soltar o arquivo exportado de outro workspace o carrega. | Essencial |
| RF523 (removido) | | | |
| RF524 | Com o arquivo lido, a janela deve mostrar o workspace de origem, a data da exportação e o que entra. | A janela diz "De <workspace>, exportado em <data>". | Essencial |
| RF525 | "Importar" deve pedir "somar" ou "substituir" (RN502), como RF515 e RF516. | Substituir mostra riscado o que sai. | Essencial |
| RF526 | Importar deve pôr os menus no rascunho (RN503). | Depois de importar, o cartão "Alterações não salvas" aparece. | Essencial |
| RF527 | O pé de "Importar" deve ter "Exportar o meu menu", que baixa o arquivo do menu de hoje (RN504). | O arquivo baixado se importa de volta noutro workspace. | Essencial |
| RF528 | O "…" de cada caso deve ter "Exportar arquivo", que baixa o arquivo do caso. | O arquivo do caso se importa de volta. | Importante |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI501 | Listar casos de uso | Deve devolver os casos do ENSPACE e os do workspace, com tipo, complexidade, área, imagens, o que vem junto, autor, data e número de usos. Rota <a definir>. |
| RI502 | Aplicar caso de uso | Deve receber o caso, o modo (somar ou substituir) e o lugar dos menus, e devolver o rascunho resultante sem publicar (RN503). Rota <a definir>. |
| RI503 | Criar e guardar caso de uso | Deve receber os campos de RF520 e as imagens de RF531, ou a cópia de um caso do ENSPACE. Rota <a definir>. |
| RI504 | Exportar e importar | O arquivo deve ter formato e versão próprios (no protótipo, `enspace-caso-de-uso`, versão 1), o workspace de origem, a data e as imagens do caso (no protótipo, as imagens ficam fora do arquivo). Formato final <a definir>. |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF501 | Somar e substituir devem ser um grupo de opções com papel `radiogroup`. | O leitor de tela anuncia as 2 opções como grupo. | Importante |
| RNF502 | Cada ponto e cada seta da galeria deve ter nome para o leitor de tela. | O leitor de tela lê o nome de cada ponto e de cada seta. | Importante |
| RT501 | O menu novo vai para o cliente depois que esta fase passa no QA. Critério de fim: a liberação. | As 6 fases conferidas em develop antes da liberação. | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P501 | A importação pelo menu e a de Configurações (protótipo `migracao-de-workspace`) devem ter as mesmas opções? Lá são 3 (adicionar o que falta, atualizar e adicionar, substituir tudo); aqui são 2. | produto | RF515 e RF525 ganham a terceira opção. |
| P502 | Usar um caso cria também os campos e os status das categorias, ou só os menus e as categorias? No protótipo, campos e status não são criados. | produto | RF518 ganha campos e status. |
| P503 | Quem cura os casos "Do ENSPACE" e as imagens da galeria? | produto | Um fluxo de publicação dos casos. |
| P505 | O que a janela Importar faz com um arquivo que não foi exportado do ENSPACE, ou de uma versão que ela não lê? O protótipo não trata o caso. | produto | Um RF de erro na leitura do arquivo. |
| P504 | Os filtros "Etiquetas" e "Criado por" do ClickUp ficaram fora porque o caso de uso não tem etiqueta nem autoria hoje. Entram depois? | produto | RF505 ganha 2 filtros. |

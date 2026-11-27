# 2. Central de casos de uso e usar caso de uso

**Objetivo:** a Central mostra os casos de uso do ENSPACE e do workspace. "Usar caso de uso" aplica os menus do caso
no rascunho; "Adicionar ao workspace" só guarda uma cópia do caso.

**Depende de:** 1. Exportar o meu menu.

**Onde vale:** o pé do "+" do Início, a Central de casos de uso e Configurações > Interface > Casos de uso.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, "+" do Início > "Casos de uso".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Usar um caso de uso aplica os menus dele ao workspace; adicionar ao workspace só guarda uma cópia do caso, sem mudar o menu. | "Adicionar ao workspace" põe o caso em "Do seu workspace", e o menu continua igual. | Obrigatório |

## Portas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | A lista do "+" do Início deve ter, no pé, "Importar" e "Casos de uso". | Os 2 aparecem no pé da lista. | Essencial | Obrigatório |
| RF102 | "Casos de uso" do "+" e Configurações > Interface > Casos de uso devem abrir a Central de casos de uso, na vista "Destaques". | As 2 portas abrem a Central em "Destaques". | Essencial | Obrigatório |
| RF103 | Se a pessoa não cumpre a RN901, "Importar" e "Casos de uso" devem aparecer desligados, com "Só quem configura o workspace". | Membro com licença Basic: os 2 itens aparecem desligados. | Essencial | Obrigatório |

## Central (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF111 | A Central deve ter as vistas "Destaques", "Do seu workspace" e "Do ENSPACE". | Trocar a vista troca os cartões. | Essencial | Obrigatório |
| RF112 | A Central deve filtrar por Tipo ("Workspace completo", "Menu", "Categoria", "Tela") e por Complexidade. | Marcar "Menu" deixa só os casos do tipo menu. | Importante | Desejável |
| RF113 | O filtro "Áreas" deve ser uma lista de seleção múltipla, com busca e "Selecionar tudo" dentro da lista. | Marcar Jurídico e Comercial mostra os casos das 2 áreas. | Importante | Desejável |
| RF114 | A Central deve buscar pelo nome, pela descrição e pela área do caso. | Buscar "contrato" acha os casos com "contrato" no nome ou na descrição. | Importante | Obrigatório |
| RF115 | Os cartões devem vir agrupados por área; a área com mais de 3 casos mostra os 3 primeiros e "Ver mais". | Área com 4 casos: o grupo mostra 3 cartões e "Ver mais". | Desejável | Opcional |
| RF116 | Cada vista da Central deve ter a faixa "Criar caso de uso". | A faixa aparece em "Destaques", "Do seu workspace" e "Do ENSPACE". | Importante | Obrigatório |

## Detalhe do caso (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF121 | Clicar num cartão deve abrir o detalhe na Central, com ícone, nome, complexidade, área, o botão "Usar caso de uso" e o caminho de volta. | O detalhe abre na Central, e o caminho de volta devolve a vista de antes. | Essencial | Obrigatório |
| RF122 | O detalhe deve ter a galeria de imagens, com setas e pontos. | As setas trocam a imagem, e o ponto ativo muda. | Importante | Obrigatório |
| RF123 | Clicar na imagem da galeria deve ampliá-la em tela cheia; Esc fecha. | Clicar amplia; Esc volta ao detalhe. | Importante | Desejável |
| RF124 | O detalhe deve listar "O que vem junto", em 3 grupos: "Seções e menus", "Categorias e campos" e "Status", cada grupo abrindo item a item. | Abrir "Seções e menus" mostra os menus do caso. | Essencial | Obrigatório |
| RF125 | O detalhe deve mostrar, à direita, quem fez o caso, quando e quantas vezes foi usado. | Os 3 dados aparecem em cada caso. | Desejável | Opcional |

## Usar e guardar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF131 | "Usar caso de uso" deve abrir a janela que lista os menus e as categorias que entram no workspace, antes de aplicar. | A janela lista os menus e as categorias do caso. | Essencial | Obrigatório |
| RF132 | A janela deve pedir "Somar" ou "Substituir" (RN903), num grupo de opções exclusivas. | Uma das 2 opções fica escolhida por vez. | Essencial | Obrigatório |
| RF133 | Com "Substituir" escolhido, a janela deve mostrar riscadas as seções do menu de hoje que saem. | Escolher "Substituir" mostra riscadas as seções do workspace. | Essencial | Obrigatório |
| RF134 | Com "Substituir" escolhido, o botão de usar deve ficar vermelho e trocar de ícone. | Trocar para "Substituir" muda a cor do botão. | Importante | Desejável |
| RF135 | A janela deve pedir onde os menus entram: "No Início" ou "Na trilha". | A escolha tem as 2 opções. | Importante | Obrigatório |
| RF136 | Aplicar deve pôr os menus no rascunho (RN902) e as categorias na lista de Categorias. | Depois de usar, o cartão "Alterações não salvas" aparece. | Essencial | Obrigatório |
| RF137 | O "…" do caso deve ter "Adicionar ao workspace", com a explicação "Guarda uma cópia para você ajustar antes de usar. O menu não muda." inteira (RN101). | A explicação aparece sem corte, e adicionar põe o caso em "Do seu workspace" sem mudar o menu. | Importante | Obrigatório |
| RF138 | Depois de "Adicionar ao workspace", o aviso deve dizer que o caso foi guardado e que o menu não mudou. | O aviso aparece depois de adicionar. | Desejável | Desejável |
| RF139 | O "…" de cada caso deve ter "Exportar arquivo", que baixa o arquivo do caso no formato da parte 1. | O arquivo do caso se importa de volta pela janela "Importar". | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI101 | Listar casos de uso | Deve devolver os casos do ENSPACE e os do workspace, com tipo, complexidade, área, imagens, o que vem junto, autor, data e número de usos. Rota <a definir>. | Obrigatório |
| RI102 | Aplicar caso de uso | Deve receber o caso, o modo (somar ou substituir) e o lugar dos menus, e devolver o rascunho resultante sem publicar (RN902). Rota <a definir>. | Obrigatório |
| RI103 | Adicionar ao workspace | Deve guardar a cópia de um caso do ENSPACE nos casos do workspace. Rota <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Quem cura os casos "Do ENSPACE" e as imagens da galeria? | produto | Um fluxo de publicação dos casos. |
| P102 | Os filtros "Etiquetas" e "Criado por" do ClickUp ficaram fora porque o caso de uso não tem etiqueta nem autoria hoje. Entram depois? | produto | RF112 ganha 2 filtros. |

# 6. Agrupar e etiquetas

**Objetivo:** a pessoa com muitos workspaces os agrupa por licença ou por etiquetas que só ela vê, e recolhe o grupo
que não está usando.

**Depende de:** 2. Menu "⋯", sair e excluir.

**Onde vale:** a barra da lista, o card, a lista e o menu "⋯" da tela `/workspaces`, e os modais de etiqueta.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN501 | As etiquetas de uma pessoa são vistas só por essa pessoa. | Outro membro do mesmo workspace não vê as etiquetas de Mariana. | Obrigatório |

## Agrupar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | A barra deve ter o botão Agrupar à direita, antes de Ordenar. | Agrupar fica à esquerda de Ordenar. | Essencial | Obrigatório |
| RF502 | Agrupar deve ser um menu suspenso, com o rótulo "Agrupar" sem agrupamento e "Agrupar: Etiqueta" ou "Agrupar: Licença" quando agrupa. | O botão diz o agrupamento ativo. | Essencial | Obrigatório |
| RF503 | O menu Agrupar deve ter as opções "Nenhum", "Etiqueta" e "Licença", com a ativa marcada; sem etiqueta criada, "Etiqueta" mostra "Nenhuma criada ainda". | Sem etiquetas, a opção mostra o aviso. | Essencial | Obrigatório |
| RF504 | Trocar o agrupamento deve abrir de novo os grupos recolhidos. | Recolher um grupo e trocar o agrupamento mostra cada grupo aberto. | Desejável | Desejável |
| RF505 | A ordem do menu Ordenar deve valer dentro de cada grupo. | Agrupado por licença e em "Nome, de A a Z", cada grupo fica em ordem alfabética. | Importante | Obrigatório |

## Grupos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF506 | Sem agrupamento, a lista deve ser uma só, sem título. | Nenhum título de grupo aparece. | Essencial | Obrigatório |
| RF507 | Agrupado por licença, os grupos devem seguir a ordem "Convites pendentes", "Proprietário", "Full", "Membro" e "Leitor". | O convite fica no grupo próprio, no topo. | Essencial | Obrigatório |
| RF508 | Agrupado por etiqueta, a lista deve ter 1 grupo por etiqueta, na ordem de criação, e depois "Sem etiqueta". | A etiqueta criada primeiro é o 1º grupo. | Essencial | Obrigatório |
| RF509 | Agrupado por etiqueta, o workspace com 2 etiquetas deve aparecer nos 2 grupos. | Marcar 2 etiquetas num workspace faz o card aparecer 2 vezes. | Importante | Obrigatório |
| RF510 | A lista deve mostrar só os grupos com pelo menos 1 workspace. | Sem nenhum Leitor, não há grupo "Leitor". | Importante | Obrigatório |
| RF511 | O título do grupo deve mostrar o nome e a contagem e recolher ou abrir o grupo ao clicar. | Recolher esconde os cards do grupo e mantém o título. | Essencial | Obrigatório |
| RF512 | Agrupado por etiqueta, com etiqueta criada e sem busca, o fim dos grupos deve ter o botão "+ Nova etiqueta", que abre o modal "Criar etiqueta". | O botão some com texto na busca. | Desejável | Desejável |
| RF513 | Na visualização em lista, com agrupamento, cada grupo deve ter a própria tabela. | Agrupar por licença mostra uma tabela por licença. | Importante | Obrigatório |
| RF514 | Com agrupamento, a seção "Ocultos" deve ficar no fim da lista, depois do último grupo. | Agrupado por licença, a seção "Ocultos" fica abaixo do grupo "Leitor". | Importante | Obrigatório |

## Etiquetas no card, na lista e na busca (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF515 | O card deve mostrar até 2 etiquetas e o selo "+{n}" para as demais, que abre as etiquetas do workspace ao passar o mouse ou focar. | Um workspace com 30 etiquetas mostra 2 e "+28", e o card não cresce. | Importante | Obrigatório |
| RF516 | A lista deve ganhar a coluna "Etiquetas", depois de "Licença", com 1 etiqueta e "+{n}". | As etiquetas aparecem só na coluna "Etiquetas". | Importante | Obrigatório |
| RF518 | A busca deve procurar também nas etiquetas. | Buscar "clientes" mostra os workspaces com a etiqueta "Clientes". | Importante | Obrigatório |
| RF519 | O menu "⋯" deve ter o item "Etiquetas", logo depois do 1º item. | O item abre o modal "Etiquetas de {nome}". | Essencial | Obrigatório |

## Etiquetas pessoais (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF520 | O item "Etiquetas" do "⋯" deve abrir o modal "Etiquetas de {nome}", com uma caixa de marcar por etiqueta da pessoa (RN501); marcar e desmarcar vale na hora. | Marcar uma etiqueta faz o selo aparecer no card. | Essencial | Obrigatório |
| RF521 | O modal deve ter o campo "Nova etiqueta", de até 30 caracteres, e o botão "Criar", desabilitado com o campo vazio; Enter também cria, e a etiqueta criada vem marcada. | Criar "RH e pessoas" adiciona e marca a etiqueta. | Essencial | Obrigatório |
| RF522 | Um nome igual ao de uma etiqueta da pessoa, sem contar acento e maiúscula, deve reaproveitar a etiqueta existente. | Criar "clientes" com "Clientes" existente não duplica. | Importante | Obrigatório |
| RF523 | O botão "Pronto" deve fechar o modal, mantendo o que foi marcado. | Fechar não desfaz o que foi marcado. | Importante | Obrigatório |
| RF524 | O "+ Nova etiqueta" e o aviso sem etiquetas devem abrir o modal "Criar etiqueta". | Os 2 caminhos abrem o mesmo modal. | Importante | Obrigatório |
| RF525 | O campo "Nome da etiqueta" deve receber o foco ao abrir o modal e aceitar até 30 caracteres. | Abrir o modal e digitar escreve no nome. | Importante | Obrigatório |
| RF526 | "Em quais workspaces" deve listar os workspaces da pessoa, sem os convites, em ordem alfabética, com caixa de marcar e a busca "Buscar workspace". | Buscar "aurora" filtra a lista do modal. | Essencial | Obrigatório |
| RF527 | O botão "Criar em {n} workspaces" deve ficar desabilitado sem nome ou sem workspace marcado; ao criar, a lista passa a agrupar por etiqueta. | Criar "Clientes" em 3 workspaces mostra o grupo "Clientes 3". | Essencial | Obrigatório |
| RF528 | Sem etiqueta criada, agrupar por etiqueta deve pôr os workspaces no grupo "Sem etiqueta", com o aviso "Você ainda não criou etiquetas" e o botão "+ Criar etiqueta". | Sem etiquetas, a lista mostra 1 grupo e o aviso. | Importante | Obrigatório |
| RF529 | O aviso sem etiquetas deve sumir quando a primeira etiqueta for criada. | Criar a primeira etiqueta tira o aviso. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P501 | Qual o limite e a validação do nome da etiqueta? Hoje, no protótipo: no máximo 30 caracteres, sem outra validação. | produto | RF521 e RF525 ganham a validação |

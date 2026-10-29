# 8. Etiquetas

**Objetivo:** a pessoa marca os workspaces com etiquetas que só ela vê, agrupa a lista por elas e as acha pela busca.

**Depende de:** 2. Buscar e aceitar convite; 3. Menu "⋯", sair e excluir; 7. Agrupar.

**Onde vale:** o card, a lista, a busca e o menu "⋯" da tela `/workspaces`, o menu Agrupar e os modais de etiqueta.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN501 | As etiquetas de uma pessoa são vistas só por essa pessoa. | Outro membro do mesmo workspace não vê as etiquetas de Mariana. | Obrigatório |

## Agrupar por etiqueta (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF530 | O menu Agrupar deve ganhar a opção "Etiqueta", entre "Nenhum" e "Licença"; sem etiqueta criada, a opção mostra "Nenhuma criada ainda". | Sem etiquetas, a opção mostra o aviso. | Essencial | Obrigatório |
| RF508 | Agrupado por etiqueta, a lista deve ter 1 grupo por etiqueta, na ordem de criação, e depois "Sem etiqueta". | A etiqueta criada primeiro é o 1º grupo. | Essencial | Obrigatório |
| RF509 | Agrupado por etiqueta, o workspace com 2 etiquetas deve aparecer nos 2 grupos. | Marcar 2 etiquetas num workspace faz o card aparecer 2 vezes. | Importante | Obrigatório |
| RF512 | Agrupado por etiqueta, com etiqueta criada e sem busca, o fim dos grupos deve ter o botão "+ Nova etiqueta", que abre o modal "Criar etiqueta". | O botão some com texto na busca. | Desejável | Desejável |
| RF528 | Sem etiqueta criada, agrupar por etiqueta deve pôr os workspaces no grupo "Sem etiqueta", com o aviso "Você ainda não criou etiquetas" e o botão "+ Criar etiqueta". | Sem etiquetas, a lista mostra 1 grupo e o aviso. | Importante | Obrigatório |
| RF529 | O aviso sem etiquetas deve sumir quando a primeira etiqueta for criada. | Criar a primeira etiqueta tira o aviso. | Importante | Obrigatório |

## Etiquetas no card, na lista e na busca (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF515 | O card deve mostrar até 2 etiquetas e o selo "+{n}" para as demais, que abre as etiquetas do workspace ao passar o mouse ou focar. | Um workspace com 30 etiquetas mostra 2 e "+28", e o card não cresce. | Importante | Obrigatório |
| RF516 | A lista deve ganhar a coluna "Etiquetas", depois de "Licença", com 1 etiqueta e "+{n}". | As etiquetas aparecem só na coluna "Etiquetas". | Importante | Obrigatório |
| RF518 | A busca deve procurar também nas etiquetas. | Buscar "clientes" mostra os workspaces com a etiqueta "Clientes". | Importante | Obrigatório |
| RF519 | O menu "⋯" deve ter o item "Etiquetas", logo depois do 1º item. | O item abre o modal "Etiquetas de {nome}". | Essencial | Obrigatório |

## Modais de etiqueta (RF)

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

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P501 | Qual o limite e a validação do nome da etiqueta? Hoje, no protótipo: no máximo 30 caracteres, sem outra validação. | produto | RF521 e RF525 ganham a validação |
| P502 | As etiquetas usam um sistema de etiquetas reutilizável do produto ou um modelo só desta tela? A nota do campo "Dependências" do card propõe avaliar o sistema reutilizável. | dev que escreveu a nota e produto | Com o sistema reutilizável, esta parte espera esse sistema; as outras partes seguem sem ela |

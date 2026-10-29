# 7. Agrupar

**Objetivo:** a pessoa com muitos workspaces os agrupa por licença e recolhe o grupo que não está usando.

**Depende de:** 2. Buscar e aceitar convite; 6. Ocultos.

**Onde vale:** a barra da lista, os cards e a lista da tela `/workspaces`.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces.

## Agrupar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | A barra deve ter o botão Agrupar à direita, antes de Ordenar. | Agrupar fica à esquerda de Ordenar. | Essencial | Obrigatório |
| RF502 | Agrupar deve ser um menu suspenso, com o rótulo "Agrupar" sem agrupamento e "Agrupar: {opção}" quando agrupa. | Agrupado por licença, o botão diz "Agrupar: Licença". | Essencial | Obrigatório |
| RF503 | O menu Agrupar deve ter as opções "Nenhum" e "Licença", com a ativa marcada. | A opção ativa aparece marcada no menu. | Essencial | Obrigatório |
| RF504 | Trocar o agrupamento deve abrir de novo os grupos recolhidos. | Recolher um grupo e trocar o agrupamento mostra cada grupo aberto. | Desejável | Desejável |
| RF505 | A ordem do menu Ordenar deve valer dentro de cada grupo. | Agrupado por licença e em "Nome, de A a Z", cada grupo fica em ordem alfabética. | Importante | Obrigatório |

## Grupos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF506 | Sem agrupamento, a lista deve ser uma só, sem título. | Nenhum título de grupo aparece. | Essencial | Obrigatório |
| RF507 | Agrupado por licença, os grupos devem seguir a ordem "Convites pendentes", "Proprietário", "Full", "Membro" e "Leitor". | O convite fica no grupo próprio, no topo. | Essencial | Obrigatório |
| RF510 | A lista deve mostrar só os grupos com pelo menos 1 workspace. | Sem nenhum Leitor, não há grupo "Leitor". | Importante | Obrigatório |
| RF511 | O título do grupo deve mostrar o nome e a contagem e recolher ou abrir o grupo ao clicar. | Recolher esconde os cards do grupo e mantém o título. | Essencial | Obrigatório |
| RF513 | Na visualização em lista, com agrupamento, cada grupo deve ter a própria tabela. | Agrupar por licença mostra uma tabela por licença. | Importante | Obrigatório |
| RF514 | Com agrupamento, a seção "Ocultos" deve ficar no fim da lista, depois do último grupo. | Agrupado por licença, a seção "Ocultos" fica abaixo do grupo "Leitor". | Importante | Obrigatório |

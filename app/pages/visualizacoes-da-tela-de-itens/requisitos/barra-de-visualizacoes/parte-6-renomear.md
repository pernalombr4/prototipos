# 6. Renomear

**Objetivo:** a pessoa troca o nome de uma visualização na própria pílula ou na linha da lista do "+N", sem abrir o
construtor de visualização.

**Depende de:** 1. Pílulas e lista do "+N"; 2. Menu da visualização (o item Renomear).

**Onde vale:** a pílula e a linha da lista do "+N", na tela de itens, em Tarefas Rápidas e em Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. O clique duplo na pílula
"Vencidos" abre o campo de renomear.

## Renomear (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF025 | Clique duplo na pílula, F2 ou Renomear no menu deve trocar a pílula por um campo com o nome selecionado, conforme RN004. | O campo aparece no lugar da pílula. | Importante | Obrigatório |
| RF066 | F2 deve renomear a pílula ativa. | O campo de renomear abre sem mouse. | Importante | Obrigatório |
| RF122 | O clique duplo no nome de uma linha da lista do "+N", ou Renomear no "⋯" da linha, deve abrir o campo de renomear na própria linha, com a lista aberta. | Renomear "Vencidos" para "Contratos vencidos" muda a linha e a pílula. | Importante | Obrigatório |
| RF026 | Enter ou sair do campo deve gravar o nome, com Desfazer no aviso (RN010). | O nome novo aparece na pílula; Desfazer volta o anterior. | Importante | Obrigatório |
| RF079 | Esc no campo de renomear deve desistir e voltar o nome anterior. | O nome não muda. | Importante | Obrigatório |
| RF027 | Se o nome já existe na tela, o sistema deve manter o nome anterior e avisar "Já existe uma visualização chamada <nome>. O nome anterior foi mantido." | Renomear "Vencidos" para "Compras" mostra o aviso. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S001 | Standard ou Viewer pode renomear e excluir visualização que é só sua (RN004, linha 2). | Mikaela confirma | Se não pode, Renomear e Excluir somem para esse perfil |

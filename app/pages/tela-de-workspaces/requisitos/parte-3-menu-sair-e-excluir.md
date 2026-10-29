# 3. Menu "⋯", sair e excluir

**Objetivo:** cada workspace da lista ganha o menu "⋯", com sair do workspace e, para o proprietário, excluir o
workspace, sem a pessoa precisar entrar nele.

**Depende de:** 1. Escolher e entrar.

**Onde vale:** o card e a linha da lista da tela `/workspaces`.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces. No protótipo, "Excluir workspace" mostra
um toast no lugar do modal de exclusão.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Um proprietário só deixa o workspace pela exclusão do workspace. | No workspace de que Mariana é proprietária, o menu oferece "Excluir workspace" no lugar de "Sair do workspace". | Obrigatório |

## Menu "⋯" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | Cada card e cada linha que não são convite devem mostrar o menu "⋯", visível sem passar o mouse. | O card de convite não tem "⋯". | Essencial | Obrigatório |
| RF102 | Na lista, o 1º item do menu deve ser "Entrar", que entra direto no workspace; no card, o menu começa sem "Entrar". | Clicar no "⋯" da linha abre o menu sem entrar no workspace. | Importante | Obrigatório |
| RF103 | Os itens do menu devem seguir esta ordem: "Abrir sempre ao entrar", "Etiquetas", separador, "Ocultar da lista" e, por último, o item de saída. Cada item entra no menu com a parte que o entrega. | Com todos os itens prontos, o menu mostra esta ordem. | Essencial | Obrigatório |
| RF104 | Para quem não é proprietário, o último item deve ser "Sair do workspace", em vermelho. | O menu de um workspace de Membro termina em "Sair do workspace". | Essencial | Obrigatório |
| RF105 | Para o proprietário, o último item deve ser "Excluir workspace", em vermelho, que abre o modal de exclusão que o produto já usa dentro do workspace (RN101). | Num workspace de proprietário, o menu não mostra "Sair do workspace". | Essencial | Obrigatório |

## Sair do workspace (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF106 | "Sair do workspace" deve pedir confirmação num modal "Sair de {nome}?", com o aviso de que a pessoa perde o acesso e só volta com um convite novo. | Fechar o modal mantém o workspace na lista. | Essencial | Obrigatório |
| RF107 | O modal deve ter "Cancelar" e "Sair do workspace", em vermelho. | "Cancelar" fecha sem sair. | Importante | Obrigatório |
| RF108 | Ao confirmar a saída, a tela deve tirar o workspace da lista. | A aba "Todos" conta 1 a menos. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | A API já tem a ação de sair do workspace? | dev do back-end | Se não tem, a saída é obra nova nesta parte |

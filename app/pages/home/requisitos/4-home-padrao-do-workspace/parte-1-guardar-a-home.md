# 1. Guardar a Home no workspace

**Objetivo:** a Home padrão fica guardada no workspace, e a Home de cada pessoa fica guardada com a pessoa, para a Home
abrir igual em qualquer navegador e aparelho.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** o back do workspace e a Home do workspace.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | A Home de uma pessoa guarda os widgets, a configuração de cada widget, a ordem e o tamanho. | A escolha de categorias do widget Categorias acompanha a Home. | Obrigatório |

## Guardar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O workspace deve guardar a Home padrão (RN001). | O administrador salva a Home padrão num navegador; outro membro abre a Home noutro navegador e recebe a Home salva. | Essencial | Obrigatório |
| RF002 | O workspace deve guardar a Home de cada pessoa que personalizou (RN001), separada por pessoa. | Renata arruma a Home no computador e vê a mesma Home no celular. | Essencial | Obrigatório |
| RF003 | Na 1ª visita depois desta parte, a Home deve levar para o workspace a disposição que a pessoa já tinha guardada no navegador. | Quem arrumou as lâminas antes não perde a arrumação. | Importante | Desejável |
| RF004 | "Restaurar padrão" deve apagar a Home guardada da pessoa, que volta a receber a Home padrão. | Depois de restaurar, a pessoa recebe as mudanças que o administrador fizer na Home padrão. | Essencial | Obrigatório |
| RF005 | Se o workspace ainda não tem Home padrão salva, a Home padrão deve ser a do épico Home em widgets, com Categorias e tarefas. | Workspace novo abre com Categorias, os 4 números, Vencidas, Vencem em breve, Minhas tarefas e Abertas por status. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | <a definir> | Lê e grava a Home padrão do workspace. Lugar sugerido: `group-configs.data`, ao lado de `show_types_on_initial_screen`. | Obrigatório |
| RI002 | <a definir> | Lê, grava e apaga a Home da pessoa no workspace. Lugar sugerido: `group-members.meta`. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | A Home padrão e a Home da pessoa ficam nos campos sugeridos ou numa entidade nova? | dev | RI001 e RI002 |
| P002 | Quando 2 abas da mesma pessoa salvam a Home, vale a última que salvou? | dev | RF002 |

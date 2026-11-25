# 1. Comunicado

**Objetivo:** o administrador publica na Home um aviso para o workspace inteiro, e cada membro que tem o widget lê o
aviso.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** o widget Comunicado, no grupo Equipe e notas do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". Para editar, escolha
"Administrador" em "Ver como".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | O workspace tem 1 comunicado por vez, e só o administrador (membro com o tipo `full` ou `owner`) escreve, edita e publica o comunicado. | Publicar um texto novo troca o comunicado anterior. | Obrigatório |

## O widget (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O widget deve mostrar o título e o texto do comunicado, quem publicou e quando: "<nome>, hoje", "<nome>, ontem" ou "<nome>, há <n> dias". | Exemplo: "Renata Alves, ontem". | Essencial | Obrigatório |
| RF002 | Para o administrador, o widget deve ter "Editar comunicado", que troca o texto por um campo com "Cancelar" e "Publicar". | O membro não vê "Editar comunicado". | Essencial | Obrigatório |
| RF003 | "Publicar" deve gravar o comunicado (RN001) com o administrador como autor e a data de agora. | Os membros veem o texto novo na próxima carga da Home. | Essencial | Obrigatório |
| RF004 | Sem comunicado, o widget deve mostrar "Nenhum comunicado publicado." e, para o administrador, o botão "Escrever comunicado". | O membro vê só o texto, sem o botão. | Importante | Obrigatório |
| RF005 | O catálogo deve mostrar o selo "Só o administrador edita" no Comunicado. | O selo aparece na linha do Comunicado no catálogo. | Desejável | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | <a definir> | Lê e grava o comunicado do workspace, com o título, o texto, o autor e a data. A chave `workspace_announcements` existe no locale do front e nada a usa. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | O comunicado entra na Home de todos, ou só de quem pôs o widget? | produto | Se entra para todos, depende do épico Home padrão do workspace |
| P002 | O comunicado aceita formatação, link e data de expiração? | produto | RF002 e RI001 |

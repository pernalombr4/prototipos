# 1. Tarefas que delegei

**Objetivo:** a pessoa acompanha na Home as tarefas que criou para outras pessoas e que ainda estão abertas.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** o widget Tarefas que delegei, no grupo Tarefas > Listas do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Uma tarefa delegada é a tarefa rápida aberta que a pessoa criou, com responsável preenchido e diferente da pessoa, fora do fluxo da categoria. | A tarefa que Renata criou para Bruno, pendente, é delegada; a que Renata criou para si não é. | Obrigatório |

## O widget (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O widget deve listar as tarefas delegadas (RN001) pendentes, em andamento e bloqueadas, com o prazo mais próximo primeiro. | A tarefa delegada concluída sai do widget. | Essencial | Obrigatório |
| RF002 | Cada linha deve mostrar o nome da tarefa, "Com <responsável>" e o prazo. | Exemplo: "Revisar proposta", "Com Bruno Lima", "Amanhã". | Essencial | Obrigatório |
| RF003 | O clique na linha deve abrir a tarefa. | Clicar na linha abre a tarefa em Tarefas > Rápidas. | Essencial | Obrigatório |
| RF004 | Sem tarefa delegada aberta, o widget deve mostrar "Você não delegou nenhuma tarefa aberta.". | Quem nunca delegou vê o texto. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | `GET /tasks` | Deve aceitar o filtro `creator` igual à pessoa, `assigned_to` diferente da pessoa e preenchido, e `node_execution` vazio. A tela Tarefas não tem hoje o filtro "criadas por mim". | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | A tarefa agendada entra? Hoje ela não guarda quem a criou nem quem a delegou como campo; quem delegou fica só como e-mail no histórico da tarefa. | produto e dev | Sem campo novo, o widget fica só com a tarefa rápida |

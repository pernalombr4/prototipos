# 1. Compromissos do dia

**Objetivo:** a pessoa vê na Home, em ordem de horário, o que há hoje na Agenda dela.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** o widget Compromissos do dia, no grupo Agenda do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Um compromisso do dia é o que começa entre 00:00 e 23:59 de hoje no fuso do workspace, de 1 destas 3 fontes: o calendário conectado da pessoa, o prazo de uma tarefa aberta da pessoa e a data de item (RN902). | A tarefa que vence amanhã às 09:00 não entra. | Obrigatório |

## O widget (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O widget deve listar os compromissos do dia (RN001) do mais cedo ao mais tarde. | Exemplo: 09:00 reunião, 14:00 prazo de tarefa e 18:00 data de item, nessa ordem. | Essencial | Obrigatório |
| RF002 | Cada linha deve mostrar a hora, o título e a fonte, com o ícone e o nome "Calendário", "Tarefa" ou "Item". | Exemplo: "14:00", "Aprovar reembolso", ícone e nome "Tarefa". | Essencial | Obrigatório |
| RF003 | O clique na linha deve abrir o compromisso na origem: a tarefa, o item ou o evento do calendário. | Clicar no prazo de tarefa abre a tarefa. | Essencial | Obrigatório |
| RF004 | O cabeçalho do widget deve ter o botão só de ícone "Abrir a Agenda", que abre a tela Agenda. | O clique troca a Home pela tela Agenda. | Importante | Desejável |
| RF005 | Sem compromisso hoje, o widget deve mostrar "Nada na agenda hoje.". | Workspace novo, sem calendário conectado, mostra o texto. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | O compromisso que já passou continua na lista do dia ou sai? | produto | RF001 |

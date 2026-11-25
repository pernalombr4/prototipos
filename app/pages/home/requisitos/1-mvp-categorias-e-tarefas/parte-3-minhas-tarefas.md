# 3. Minhas tarefas

**Objetivo:** a pessoa vê as tarefas abertas dela, rápidas e agendadas, separadas pelo prazo, conclui em 1 clique e
cria uma tarefa rápida sem sair da Home.

**Depende de:** 1. A grade e o Personalizar.

**Onde vale:** o widget Minhas tarefas da Home, no grupo Tarefas > Listas do catálogo. O widget junta os 3 cartões de
tarefa da Home de hoje ("Tarefas em atraso", "Tarefas próximas" e "Tarefas rápidas").

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "MVP" em "Versão".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | Uma tarefa é da pessoa quando a pessoa é a responsável pela tarefa. | A tarefa em que Renata só colabora não entra no Minhas tarefas de Renata. | Obrigatório |
| RN202 | Uma tarefa está aberta quando a tarefa rápida está pendente ou em andamento, ou quando a tarefa agendada está aguardando ou em andamento. | Uma tarefa rápida concluída sai do widget. | Obrigatório |
| RN203 | A tabela a seguir define a aba de cada tarefa aberta pelo prazo. Política: Única. | Linha 4: a tarefa que vence em 12 dias não aparece em nenhuma aba. | Obrigatório |

| Linha | Prazo da tarefa | Aba |
|---|---|---|
| 1 | antes de agora | Em atraso |
| 2 | de agora até o fim de hoje | Hoje |
| 3 | de amanhã até o fim do 7º dia depois de hoje | Próximas |
| 4 | depois do 7º dia | nenhuma |
| 5 | sem prazo | Sem prazo |

## A lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | O widget deve listar as tarefas abertas da pessoa (RN201, RN202), rápidas e agendadas, nas abas Em atraso, Hoje, Próximas e Sem prazo, conforme RN203. | Exemplo: tarefa agendada que venceu ontem fica em Em atraso. | Essencial | Obrigatório |
| RF202 | Cada aba deve mostrar quantas tarefas tem; a contagem de Em atraso fica em vermelho quando passa de 0. | Com 2 vencidas, a aba mostra "Em atraso 2" em vermelho. | Importante | Obrigatório |
| RF203 | Dentro de cada aba, a tarefa com o prazo mais próximo deve vir primeiro. | Em Próximas, a de amanhã vem antes da de daqui a 3 dias. | Importante | Obrigatório |
| RF204 | O filtro "Tipo de tarefa" deve oferecer Todas, Rápidas e Agendadas, com Todas ao abrir. | Rápidas mostra o mesmo recorte do cartão "Tarefas rápidas" da Home de hoje. | Importante | Obrigatório |
| RF205 | Cada linha deve mostrar o nome da tarefa, o selo Rápida ou Agendada, o item e a categoria da tarefa agendada, o prazo e o selo da prioridade Alta ou Urgente. | Exemplo: "Aprovar reembolso", Agendada, "23384 · Reembolsos", "Hoje, 18:00", Urgente. | Essencial | Obrigatório |
| RF206 | O prazo deve aparecer como "Venceu hoje", "Venceu ontem" ou "Venceu há <n> dias" em Em atraso; "Hoje, <hora>" em Hoje; "Amanhã" ou "Em <n> dias" em Próximas; e "Sem prazo". | Exemplo: tarefa que venceu há 3 dias mostra "Venceu há 3 dias". | Importante | Obrigatório |
| RF207 | O clique na linha deve abrir a tarefa. | A tarefa agendada abre no item; a rápida, em Tarefas > Rápidas. | Essencial | Obrigatório |
| RF208 | O botão "Ver todas", no pé do widget, deve abrir a tela Tarefas. | O clique troca a Home pela tela Tarefas. | Importante | Desejável |
| RF209 | A aba sem tarefa deve mostrar o texto vazio dela: "Nenhuma tarefa em atraso.", "Nenhuma tarefa vence hoje.", "Nenhuma tarefa nos próximos 7 dias." ou "Todas as suas tarefas têm prazo.". | Workspace novo mostra o texto vazio em cada aba. | Importante | Obrigatório |

## Concluir (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF210 | A caixa de marcar de cada linha deve concluir a tarefa em 1 clique, com o toast "Tarefa concluída." e o nome da tarefa. | A linha sai da aba, e a contagem da aba cai 1. | Essencial | Obrigatório |
| RF211 | O toast de "Tarefa concluída." deve ter "Desfazer", que devolve a tarefa ao status de antes. | Concluir e desfazer uma tarefa em andamento a devolve em andamento. | Importante | Obrigatório |

## Adicionar tarefa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF212 | O botão "Adicionar tarefa", no pé do widget, deve abrir ali mesmo um campo de nome, com o texto de ajuda "Nome da tarefa. Enter cria.". | Esc fecha o campo sem criar. | Importante | Obrigatório |
| RF213 | Enter no campo deve criar uma tarefa rápida com o nome digitado, a pessoa como responsável, prioridade Normal e o prazo pela aba aberta: hoje às 18:00 em Em atraso e Hoje, amanhã às 18:00 em Próximas, sem prazo em Sem prazo. | Exemplo: em Próximas, "Ligar para o fornecedor" nasce com prazo amanhã 18:00 e aparece em Próximas. | Importante | Obrigatório |
| RF214 | Se o campo está vazio, Enter não deve criar tarefa. | Enter com o campo vazio deixa o campo aberto e a aba igual. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | A tarefa agendada que pede ação (aprovação, formulário, assinatura) se conclui pela caixa de marcar, ou a caixa abre a tarefa para a pessoa agir? Hoje existe `PUT /c-flow-item-tasks/:id/complete`. | produto e dev | RF210 vale só para a tarefa rápida e a agendada sem ação |
| P202 | "Ver todas" abre Tarefas > Rápidas, Tarefas > Agendadas ou a aba do filtro "Tipo de tarefa"? | produto | RF208 |

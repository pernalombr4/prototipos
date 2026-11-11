# Briefing: Prazo final nas Tarefas Rápidas

## A demanda, como ela veio

> crie um prototipo com base nos requisitos abaixo. e saiba que pra P5 (na tabela final) minha resposta é SIM. entao ja faça com isso em mente

> nao precisa prototipar "como é hoje", ok? só gasto de token se fizer isso.

Os requisitos que vieram junto, sem reescrever:

```text
Requisitos: Prazo final nas Tarefas Rápidas

Objetivo: cada tarefa rápida pode ter 2 datas: o vencimento, que já existe e marca o atraso, e o prazo final, a data em que a tarefa precisa estar concluída.
Onde vale: Tarefas Rápidas (criação, detalhe, tabela e kanban), Spaceflow e API de tarefas.
Fora do escopo: Tarefas Programadas do fluxo da categoria; mudança no nome ou no comportamento do vencimento atual.

Regras de negócio
RN001 (em revisão) Cada tarefa rápida pode ter 0 ou 1 prazo final. Obrigatório
RN002 O prazo final segue o esquema de permissões do vencimento, em cada papel e em cada ação. Obrigatório
RN003 (em revisão) O prazo final aceita o tipo de valor que o vencimento aceita. Obrigatório
RN004 O prazo final de uma tarefa rápida não pode ser anterior ao vencimento dela. Vencimento 20/11 e prazo final 20/11 ou 25/11: aceito. Vencimento 20/11 e prazo final 18/11: recusado. Obrigatório
RN005 Uma tarefa rápida é considerada atrasada quando a data atual passa do vencimento; o prazo final não muda o atraso. Vencimento 20/11, prazo final 25/11, hoje 22/11: a tarefa está atrasada. Obrigatório

Criação e edição
RF001 Quando o membro cria uma tarefa rápida, o sistema deve oferecer o campo "Prazo final" junto do vencimento.
RF002 Quando o membro abre o detalhe da tarefa rápida, o sistema deve mostrar o prazo final e permitir alterá-lo, conforme RN002.
RF003 O sistema deve permitir apagar o prazo final de uma tarefa rápida, conforme RN002.
RF004 Se o membro não tem permissão para alterar o vencimento, o sistema deve mostrar o prazo final só para leitura (RN002).
RF013 Se o membro informa um prazo final anterior ao vencimento, o sistema deve recusar o valor e mostrar o aviso no próprio campo (RN004).
RF014 Se o membro altera o vencimento para depois do prazo final, o sistema deve recusar o valor e mostrar o aviso no próprio campo (RN004).

Tabela e kanban
RF005 A tabela de Tarefas Rápidas deve ter a coluna "Prazo final".
RF012 A coluna "Prazo final" da tabela deve permitir filtrar pelo prazo final, como as colunas de data que já filtram.
RF007 Os filtros da tela de Tarefas Rápidas devem oferecer o prazo final, na tabela e no kanban, com as opções do filtro de vencimento.
RF006 Quando a tarefa rápida tem prazo final, o cartão do kanban deve mostrar o prazo final. (Desejável)
RF008 O sistema deve permitir ordenar a tabela de Tarefas Rápidas pelo prazo final. (Opcional)

Spaceflow
RF009 O Spaceflow deve oferecer o prazo final da tarefa rápida como variável em cada nó que oferece o vencimento como variável.
RF010 Se a tarefa rápida não tem prazo final, o Spaceflow deve entregar a variável vazia, do mesmo modo que entrega o vencimento vazio.
RF011 Quando o prazo final de uma tarefa rápida muda, o gatilho de tarefa atualizada deve disparar do mesmo modo que dispara quando o vencimento muda.

Interfaces
RI001 Rotas da API que leem e gravam a tarefa rápida <a definir>: recebem e devolvem o prazo final no campo <a definir>, com as permissões da RN002.
RI002 Rotas da API que gravam a tarefa rápida <a definir>: recusam a gravação que fere a RN004, com erro de validação no status <a definir>, sem alterar a tarefa.

Transição
RT001 (em revisão) Na entrada da funcionalidade, cada tarefa rápida existente fica com o prazo final vazio, sem cópia do vencimento.

Padrão de qualidade: idiomas, temas, chamada à API, avisos, animação, acessibilidade, visual, documentação.

Em aberto
P2 O rótulo na tela é "Prazo final", "Data limite" ou outro?
P4 A Agenda, o sino e os cartões de tarefas da Home mostram o prazo final? Existe lembrete pelo prazo final?
P5 O Spaceflow também grava o prazo final, na ação que cria ou altera tarefa rápida?   → resposta da redatora: SIM
P7 O campo aparece em todo workspace ou se liga por workspace?
P8 Qual é o texto do aviso de RF013 e RF014?
S1 O tipo de valor do prazo final segue o do vencimento (RN003).
S2 As tarefas existentes começam sem prazo final (RT001).
```

## A tela em jogo

- **Tarefas › Rápidas**, nas visualizações tabela e kanban, no painel da tarefa e no modal de criação.
- **Spaceflow**, no gatilho "Tarefa atualizada" e nas ações que criam ou alteram tarefa rápida.
- Rodada 5: **Painel de tarefas** (`/tasks/dashboard`, no develop desde 11/11/2026), **Agenda**, **pasta Tarefas
  do item** e o **Relatório Padrão** das Tarefas Rápidas. O que o develop mostra está no `DECISOES.md`, rodada 5.

## O que seria sucesso

Quem acompanha uma tarefa vê, no mesmo lugar, quando ela atrasa e até quando ela precisa estar
concluída, e o sistema não deixa as 2 datas ficarem em ordem trocada.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (`temas/README.md`, `UX_REPORT.md` e as auditorias, por
"prazo final", "data limite", "deadline" e "vencimento"). Não havia nada sobre o assunto. O
protótipo `tarefas-rapidas` deste repositório já tinha registrado que não existe tema de
tarefas lá.

## O que o develop faz hoje

Sem investigação nova nesta rodada, a pedido da redatora ("nao precisa prototipar como é
hoje"). A fonte é o `BRIEFING.md` do protótipo `tarefas-rapidas`, investigado no develop em
21/09/2026. O que pesa nesta demanda:

- o vencimento (`due_date`) tem 3 rótulos na tela hoje:
  - **"Prazo"** no painel da tarefa;
  - **"Data limite"** na lista de colunas da tabela e no modal de Nova Visualização;
  - **"Campo data de vencimento"** na ordenação do kanban;
- em inglês o painel diz "Due date", e em espanhol "Fecha límite";
- o filtro de data da barra escolhe o campo (`Criado em` ou o vencimento) e o período
  (`Todo o período`, um dia ou um intervalo no calendário);
- o cartão do kanban mostra uma data só, e o `EnKanbanCardConfig` do SDK tem um campo de data
  só (`dueDateField`);
- o painel da tarefa abre à direita com as abas Tarefa, Comentários e Logs de Auditoria.

### A casca da tela

Importada do protótipo `tarefas-rapidas` (`_CascaDoEnspace.vue`), sem cópia nova. O item por
item está no briefing de lá.

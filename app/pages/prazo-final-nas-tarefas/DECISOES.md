# Decisões: Prazo final nas Tarefas Rápidas

## Rodada 1 · 2026-11-10

- **Pedido (literal):** "crie um prototipo com base nos requisitos abaixo. e saiba que pra P5 (na tabela final) minha resposta é SIM. entao ja faça com isso em mente" e "nao precisa prototipar \"como é hoje\", ok? só gasto de token se fizer isso."
- **Fronteira:** muda o par de datas na criação, no painel, na tabela, no kanban e no Spaceflow; não muda o rótulo nem o comportamento do prazo de hoje, nem o resto da tela.

### Onde cada requisito está

| Requisito | Onde ver no protótipo |
|---|---|
| RF001, RF013 | Nova tarefa: "Prazo" e "Prazo final" lado a lado; prazo final antes do prazo bloqueia "Criar tarefa" com o aviso no campo |
| RF002, RF003 | Clique numa tarefa: seção Datas do painel; alterar salva na hora, com toast; o X apaga o prazo final |
| RF004 | Andaime "Só vê as datas": as 2 datas viram texto com cadeado e o aviso do papel |
| RF014 | No painel, prazo depois do prazo final: o campo mostra o aviso e a tarefa fica com o prazo anterior |
| RN005 | "Hoje" fixo em 22/11/2026; a primeira tarefa (prazo 20/11, prazo final 25/11) aparece "Atrasada" |
| RF005, RF012, RF008 | Tabela: coluna "Prazo final" com ordenar e filtrar no cabeçalho; sem prazo final, a célula fica vazia e vai para o fim na ordenação |
| RF007 | Barra: o campo de data do filtro ganha "Prazo final"; o mesmo filtro vale para tabela e kanban |
| RF006 | Kanban: o cartão mostra o prazo (calendário) e o prazo final (bandeira) |
| RF009, RF011 | Andaime "Spaceflow" › nó "Tarefa atualizada": a lista de variáveis traz "Prazo final", com o selo Novo |
| RF010 | Spaceflow › Execuções › execução 9030: prazo final "vazio", fluxo concluído |
| P5 (sim) | Spaceflow › nó "Criar tarefa rápida": prazo e prazo final como data fixa ou variável; em "Alterar tarefa rápida", também "Não alterar" e "Apagar a data" |

### Decisões

| O que | Por quê |
|---|---|
| O campo novo se chama "Prazo final" (en "Final deadline", es "Plazo final") | É o rótulo dos requisitos. "Data limite" já nomeia o vencimento na tabela e no modal de Nova Visualização, e "Fecha límite" é o vencimento em espanhol. Usar um deles para o campo novo daria o mesmo nome a 2 datas |
| O vencimento continua "Prazo" (o rótulo do painel) | Fora do escopo mudar o nome. Ver a pergunta P2 abaixo |
| Ajuda fixa embaixo de cada data: "A tarefa fica atrasada quando esta data passa" e "O prazo final não muda o atraso" | Com 2 datas, a pessoa precisa saber qual delas acende o "Atrasada" (RN005) |
| Bandeira para o prazo final, calendário para o prazo | O mesmo par de ícones na tabela, no cartão, no painel e no Spaceflow |
| Recusa da RN004 sempre no campo que a pessoa acabou de mexer | RF013 e RF014. Na criação, o aviso vai no prazo final, que é o campo novo |
| O valor recusado fica escrito no campo, com o aviso; a tarefa fica com o valor anterior | A pessoa vê o que digitou e corrige. A tabela e o kanban não mudam |
| Salvar no painel é ao sair do campo ou no Enter, sem botão; carregamento no próprio campo e toast | O campo de data emite a cada segmento digitado. Gravar ali salvou 30/01 no meio de "30/11" na conferência, e repetiu o toast 3 vezes |
| Sem permissão, as datas viram texto com cadeado, e não campo desabilitado | Campo cinza parece defeito. Texto com cadeado diz que é leitura |
| O filtro de período da barra é o de hoje, com "Prazo final" no campo de data | RF007 pede "as opções do filtro de vencimento". Os atalhos Hoje, Esta semana e Este mês são simplificação do protótipo para o calendário de dia e intervalo |
| O filtro da coluna (RF012) tem "A partir de" e "Até", e liga um chip acima da tabela | O chip mostra o filtro ligado e tira com um clique |
| Na ordenação, a tarefa sem prazo final vai para o fim nos 2 sentidos | RF008 só fala da ordem crescente; no decrescente, vazio no topo esconderia as datas |
| P5: as ações de Criar e Alterar tarefa rápida gravam o prazo final, com data fixa ou variável | Resposta da redatora |
| Com as 2 datas fixas no nó, a RN004 se confere ao salvar o nó | O erro aparece antes de o fluxo rodar |
| Com variável, a RN004 só se confere na execução: o nó falha, a tarefa não é gravada e a execução mostra o motivo | A mesma regra da API (RI002). Um aviso no nó diz isso antes de salvar |

### Requisitos novos que a P5 pede (para o documento de requisitos)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF015 | As ações do Spaceflow que criam ou alteram tarefa rápida devem permitir preencher o prazo final, com data fixa ou variável, do mesmo modo que o vencimento. | Nó "Criar tarefa rápida" com prazo final = variável Prazo final do gatilho; a tarefa criada tem o prazo final da tarefa que disparou. |
| RF016 | Se, na execução, o prazo final ficar antes do vencimento, a ação deve falhar sem gravar a tarefa, e a execução deve mostrar o motivo (RN004). | Prazo 30/11 e prazo final 25/11 chegam ao nó; a tarefa não é criada, e a execução diz "O prazo final precisa ser igual ou posterior ao prazo". |
| RF017 | Se as 2 datas do nó são fixas e o prazo final fica antes do vencimento, o nó não deve salvar e deve mostrar o aviso no campo do prazo final (RN004). | Prazo 20/11 e prazo final 18/11 no nó; "Salvar" mostra o aviso e o nó fica como estava. |

### Perguntas que o protótipo levantou

| ID | Pergunta | O que muda |
|---|---|---|
| P2 (reforço) | "Prazo" e "Prazo final" lado a lado parecem a mesma data com 2 nomes. O vencimento passa a se chamar "Vencimento" na tela, ou fica "Prazo"? | Rótulos do painel, da tabela e do Spaceflow; e o fora do escopo, que hoje proíbe mudar o nome |
| P8 (proposta) | Texto proposto: "O prazo final precisa ser igual ou posterior ao prazo (20/11/2026)." e "O prazo precisa ser igual ou anterior ao prazo final (25/11/2026)." | Texto do aviso |
| P9 | A tarefa pode ter prazo final sem prazo? O protótipo aceita, porque nenhuma regra proíbe | RN001 e RN004 |
| P10 | No kanban, o cartão do prazo final que já passou (com o prazo também passado) ganha destaque próprio? O protótipo não destaca, porque o atraso conta só pelo prazo | RF006 e RN005 |

### Para o dev

- **Kanban:** o `EnKanbanCardConfig` do SDK tem um campo de data só (`dueDateField`). RF006 pede um segundo campo de data no cartão (`finalDueDateField`, nome de trabalho). O protótipo desenha o cartão à mão por isso.
- **Tabela:** o protótipo usa `UTable` porque o `EnTable` recebe o rótulo da coluna como texto e não tem slot de cabeçalho, onde ficam ordenar e filtrar. Se a tabela do produto já filtra por coluna, o prazo final usa o mesmo controle.
- **Nome do campo na API:** `final_due_date` no `mocks.ts` é nome de trabalho; RI001 segue "a definir".

- **Maquete:** abas Comentários e Logs do painel, "Guardar progresso" e "Concluir tarefa", o nó "Enviar e-mail", o canvas do Spaceflow (reduzido a uma coluna de nós) e a data de criação das tarefas (derivada do id, só para o filtro "Criado em" funcionar). "Hoje" é fixo em 22/11/2026. Tudo em memória; recarregar zera.
- **Não deu:** a Fase 3 (referências) não rodou, a pedido de economia; está declarado no `PESQUISA.md`. A tela de hoje não foi revisitada no develop; a fonte é o briefing do `tarefas-rapidas`, de 21/09/2026.
- **Conferência no Chrome:** RF013, RF014, RF002 (1 toast por alteração), tabela, kanban, Spaceflow (editor e execução 9029) em pt-BR e es, nos temas claro e escuro, sem erro no console.
- **Crítica e acessibilidade:** botões só de ícone (ordenar, filtrar, apagar, tirar filtro) têm nome acessível; painel e modal têm título e descrição; o cartão do kanban é um alvo só, com foco visível. Sem correção: as skills `design:design-critique` e `design:accessibility-review` não rodaram, pelo pedido de economia; o contraste dos selos pequenos de status não foi medido.
- **Ver:** `http://localhost:3000/prazo-final-nas-tarefas` · `evidencias/proposta-painel-rf014.jpg`, `proposta-kanban.jpg`, `proposta-spaceflow-execucao.jpg`

## Rodada 2 · 2026-11-10

- **Pedido (literal):** "\"prazo\" e \"prazo final\" parecem nomes ruins, nao? talvez \"vencimento\" e \"prazo final\" sejam nomes melhores. ou \"data de vencimento\" e \"data final\"." Depois, sobre a recomendação de "Vencimento" e "Prazo final": "Sim, trocar".
- **Mudou:** o vencimento se chama "Vencimento" em toda a tela (painel, criação, tabela, filtro da barra, avisos, toasts e Spaceflow).
- **Mudou:** em espanhol, "Fecha límite" vira "Vencimiento"; em inglês fica "Due date". O campo novo continua "Prazo final", "Final deadline" e "Plazo final".
- **Fronteira:** muda só o rótulo do vencimento; o comportamento dele não muda.
- **Descartado:** "Data de vencimento" e "Data final". Motivo: "Data final" parece o fim de um período e pede uma "data inicial" ao lado; "Data de" alonga o cabeçalho da coluna sem acrescentar sentido.
- **P2 fechada:** "Vencimento" e "Prazo final".
- **Para o documento de requisitos:**
  - o item "mudança no nome do vencimento atual" sai do Fora do escopo (o comportamento continua fora);
  - requisito novo:

    | ID | Requisito | Critério de aceite |
    |---|---|---|
    | RF018 | O vencimento da tarefa rápida deve se chamar "Vencimento" (en "Due date", es "Vencimiento") em cada tela que o mostra. | O painel, o modal de criação, a coluna da tabela, o filtro, o modal de Nova Visualização e o seletor de variáveis do Spaceflow mostram "Vencimento"; nenhum mostra "Prazo" nem "Data limite" para essa data. |
- **Não deu:** conferir os outros lugares que hoje nomeiam o vencimento (Agenda, sino, cartões da Home e as Tarefas Programadas, que estão fora do escopo). A lista do RF018 cobre só as telas de Tarefas Rápidas e o Spaceflow.
- **Ver:** https://pernalombr4.github.io/prototipos/prazo-final-nas-tarefas/

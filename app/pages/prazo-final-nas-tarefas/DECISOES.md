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

## Rodada 3 · 2026-11-10

- **Pedido (literal):** "observe mais um ponto de pesquisa. com base nele voce deve definir instruction e help desses campos e, por ux, qual campo vem antes e qual vem depois no fluxo de leitura/configuraçao" (a pesquisa está resumida no `PESQUISA.md`, rodada 3).
- **Mudou:** cada data ganha instrução (entre o rótulo e o campo: o que a data significa) e ajuda (abaixo do campo: a regra), no painel, na criação e no nó do Spaceflow.
- **Mudou:** o calendário nativo já limita as datas: o vencimento não passa do prazo final, e o prazo final não fica antes do vencimento. O aviso de RF013 e RF014 continua para a data digitada.
- **Fronteira:** muda o texto em volta dos campos e o limite do calendário; não muda rótulo, regra nem posição.

### Instrução e ajuda

| Campo | Instrução | Ajuda |
|---|---|---|
| Vencimento | Data planejada para a conclusão da tarefa. | Depois desta data, a tarefa é marcada como atrasada. |
| Prazo final | Data em que a tarefa precisa estar concluída, como um prazo legal ou contratual. | O prazo final deve ser igual ou posterior ao vencimento e não altera o atraso. |

Em inglês e espanhol, no `textos.ts` (`prazoInstrucao`, `prazoAjuda`, `prazoFinalInstrucao`, `prazoFinalAjuda`).

| Por quê | |
|---|---|
| A instrução diz o papel da data | A pesquisa mostra que o mercado usa o par "data de trabalho" e "data limite". O vencimento é a data planejada; o prazo final é a data limite, com o exemplo do prazo legal ou contratual, que é o caso do cliente jurídico |
| A ajuda diz a regra que surpreende | No mercado, quem marca o atraso é a data limite. No ENSPACE é o vencimento (RN005), e o prazo final não pode ficar antes dele (RN004). As 2 regras vão escritas, porque quem vem de outro produto espera o contrário |
| O aviso de erro toma o lugar da ajuda | O campo mostra 1 texto embaixo por vez; a instrução continua em cima |

### Ordem: Vencimento antes, Prazo final depois

| Por quê | |
|---|---|
| Ordem do tempo | O vencimento é sempre igual ou anterior ao prazo final (RN004). Ler da esquerda para a direita, ou de cima para baixo, é ler do mais cedo para o mais tarde |
| Dependência na configuração | O prazo final é limitado pelo vencimento: quem preenche o vencimento primeiro já encontra o calendário do prazo final começando nele |
| O que decide o dia a dia vem primeiro | O vencimento marca o atraso e é a data que a equipe olha todo dia; o prazo final é a garantia |
| O padrão dos produtos lidos | Things (When, depois Deadline), OmniFocus (Defer e Planned, depois Due) e Todoist (Date, depois Deadline) põem a data de trabalho antes da data limite |

No painel e na criação, as 2 datas passam a ficar empilhadas, Vencimento em cima: com a instrução, lado a lado os campos desalinhavam (a instrução do prazo final ocupa 3 linhas no painel), e empilhar mantém a leitura de cima para baixo.

A mesma ordem vale no painel, na criação, nas colunas da tabela, na linha de datas do cartão do kanban, no nó do Spaceflow e na lista de variáveis. Já era a ordem do protótipo; a rodada 3 registra o motivo.

### O que a pesquisa reforça, sem mudar a tela nesta rodada

- **P10 ganha peso:** o mercado separa "atrasada" de "perdeu o prazo final" (OmniFocus, MS Project, Motion), e para o cliente jurídico é esse estado que importa. Hoje a tarefa atrasada 1 dia e a que perdeu o prazo final mostram o mesmo selo. Proposta para a próxima rodada, se produtos quiser: selo próprio "Prazo final vencido" e destaque da data no cartão e na tabela.
- **P4 (lembrete):** o mercado prende o lembrete à data de trabalho (Things) ou às 2 datas (OmniFocus).
- **Maquete:** igual à rodada 1.

## Rodada 4 · 2026-11-10

- **Pedido (literal):** "Sim, desenhar" (o estado "Prazo final vencido", P10).
- **Mudou:** a tarefa não concluída com o prazo final no passado ganha o estado "Prazo final vencido", que toma o lugar do "Atrasada" onde o selo aparece.
- **Mudou:** tabela: a data do prazo final fica em vermelho, com o selo "Vencido"; a coluna Vencimento perde o selo "Atrasada" nessa linha, para não repetir.
- **Mudou:** kanban: o cartão ganha borda esquerda mais grossa, fundo vermelho claro, o prazo final em vermelho e o selo "Prazo final vencido" no lugar de "Atrasada".
- **Mudou:** painel: o selo do cabeçalho vira "Prazo final vencido".
- **Mudou:** barra: o botão "Prazo final vencido (2)" filtra só essas tarefas, na tabela e no kanban. Só aparece quando há alguma.
- **Mudou:** o mock ganha a tarefa "Protocolar a contestação do processo trabalhista" (vencimento 17/11, prazo final 19/11). Com "Coletar as assinaturas do aditivo" (21/11 e 21/11), são 2 tarefas no estado novo.
- **Fronteira:** muda a forma de mostrar a tarefa atrasada cujo prazo final passou; não muda a regra do atraso (RN005).

| Por quê | |
|---|---|
| 1 selo só por tarefa | Pela RN004, toda tarefa com prazo final vencido já está atrasada. Mostrar os 2 selos repete a informação; o selo mais grave vale pelos 2 |
| Selo cheio (sólido) para o vencido, claro (sutil) para o atrasado | A diferença entre os 2 estados aparece no peso, sem cor nova. O mercado faz parecido: o Motion usa vermelho e laranja, o OmniFocus separa Due Soon de Overdue |
| A bandeira acompanha o selo | É o ícone do prazo final em toda a tela; o selo diz qual data venceu |
| Botão de filtro na barra, com a contagem | Para o cliente jurídico, essas são as tarefas que pedem ação imediata. O botão mostra quantas são sem abrir filtro nenhum, e some quando não há nenhuma |

### Para o documento de requisitos

| ID | Requisito | Critério de aceite | Relevância sugerida |
|---|---|---|---|
| RN006 | Uma tarefa rápida está com o prazo final vencido quando não está concluída e a data atual passa do prazo final. | Vencimento 17/11, prazo final 19/11, hoje 22/11, status Em andamento: prazo final vencido. A mesma tarefa concluída: sem o estado. | Obrigatório |
| RF019 | Quando a tarefa rápida está com o prazo final vencido (RN006), a tabela, o cartão do kanban e o painel devem mostrar o selo "Prazo final vencido" no lugar do selo "Atrasada". | A tarefa da RN006 mostra "Prazo final vencido" nos 3 lugares e não mostra "Atrasada"; a tarefa só atrasada continua com "Atrasada". | Desejável |
| RF020 | A tela de Tarefas Rápidas deve oferecer um atalho que filtra as tarefas com o prazo final vencido, com a contagem delas, na tabela e no kanban. | Com 2 tarefas no estado, o botão diz "Prazo final vencido (2)" e, ligado, deixa só as 2. Sem nenhuma, o botão não aparece. | Opcional |

### Perguntas que ficam

| ID | Pergunta | O que muda |
|---|---|---|
| P10 (fechada como proposta) | O estado existe? | Proposto acima; produtos confirma ao aprovar |
| P11 | Existe o estado anterior, "prazo final próximo" (OmniFocus: Due Soon)? Com quantos dias de antecedência? | Selo e filtro de aviso antes de vencer; casa com o lembrete da P4 |
| P12 | O estado "Prazo final vencido" vira variável ou gatilho no Spaceflow (por exemplo, avisar o gestor quando o prazo final vence)? | Novo gatilho ou condição no grupo Spaceflow |

- **Maquete:** igual à rodada 1. O "hoje" continua fixo em 22/11/2026.

## Rodada 5 · 2026-11-11

- **Pedido (literal):** "tem que botar nos requisitos que isso saia em relatorio nativo de tarefas, que isso seja puxado pra agenda (e prototipar como), dentro do item isso tambem tem que aparecer quando a tarefa surgir ali, no kanban e no dashboard de tarefas (novo) / pra este ultimo, veja o dash de tarefas em develop (subiu hoje) e proponha as laminas novas com essa data, como devem ser etc. / atualize requisitos e o prototipo conforme necessario"
- **Mudou:** o documento inteiro de requisitos agora mora em `requisitos/` (épico e 7 partes desde o fechamento de 2026-11-11), com o original e as rodadas 1 a 5 (RF021 a RF039, RN007, RI003).
- **Mudou:** o andaime "Área" ganha Painel de tarefas, Agenda e Item. A barra de Tarefas Rápidas ganha o ícone "Extrair Relatório".
- **Fronteira:** muda o lugar do prazo final em cada tela; não muda nenhuma lâmina, coluna ou opção que já existe, salvo o seletor da Saúde dos prazos e o segmento da Carga por responsável.

### Onde cada requisito está

| Requisito | Onde ver no protótipo |
|---|---|
| RF021, RF022 | Tarefas Rápidas › ícone Extrair Relatório › Relatório Padrão › Excel: a prévia do arquivo (andaime) com Vencimento, Prazo final e Prazo final vencido |
| RF023, RF025 | Agenda › Configurar › Tarefas Rápidas: "Prazo final" na Data e a opção "Marcar o prazo final" |
| RF024, RF026, RF027 | Agenda: o marcador com a bandeira no dia do prazo final; vermelho cheio em 19/11 e 21/11; clicar abre o painel |
| RF028, RF029 | Item › CTR-0142 ou PRC-0087 › pasta Tarefas |
| RF006 | Kanban, como na rodada 1, agora Obrigatório |
| RF030 a RF037, RF039 | Painel de tarefas |

### O Painel de tarefas do develop (visto em 11/11/2026, workspace de exploração)

Lâminas, de cima para baixo: os 6 números (Abertas agora, Concluídas, Criadas, Vencidas, No prazo, Tempo médio de conclusão); Entrada e saída (Entrada × saída e Backlog); Abertas por status; Saúde dos prazos (Vencidas, Vencem em 7 dias, No prazo, Sem prazo, e Concluídas no prazo); Prioridade (Prioridade, Tipo, Categoria, Item); Pontos; Origem e execução; Atividade; Carga por responsável (Abertas e Concluídas, com Vencidas e Em dia); as listas Vencidas e Vencem em breve. No topo, o seletor Tarefas rápidas, os períodos (Últimos 30 dias, Últimos 90 dias, Personalizado) e o Filtro.

### As lâminas do prazo final

| Lâmina | Nova ou muda | Por quê |
|---|---|---|
| Prazo final vencido (número) | Nova, depois de "No prazo" | É o número que o cliente jurídico cobra primeiro. O "Vencidas" continua contando pelo vencimento (RN007): trocar a conta mudaria o que o painel já diz |
| Dentro do prazo final (número) | Nova | O par do "No prazo": no mock, 20% das concluídas cumprem o vencimento e 75% cumprem o prazo final. É a diferença entre atraso tolerado e prazo perdido |
| Saúde dos prazos | Muda: seletor Vencimento e Prazo final | As mesmas 4 faixas, contadas pela data escolhida. Uma lâmina nova repetiria o desenho |
| Carga por responsável | Muda: 3 segmentos em Abertas | Separa quem tem prazo final vencido de quem só está atrasado dentro da folga. Em Concluídas: dentro do prazo final, depois do prazo final e sem prazo final |
| Prazo final vencido (lista) | Nova | O par da lista Vencidas: onde o gestor age. "venceu há N dias" |
| Prazo final em até 7 dias (lista) | Nova | O par de "Vencem em breve". A tarefa atrasada leva o selo "Atrasada": é a que está na folga e precisa sair |
| Tarefas agendadas | Sem as lâminas novas | O prazo final só existe na tarefa rápida |

**Aprovado pela redatora em 2026-11-11** ("Sim, seguir"): as 6 lâminas e a posição delas no painel, como no protótipo. A P15 (onde as lâminas entram) fecha com a posição do protótipo: os 2 números depois de "No prazo" e as 2 listas ao lado de "Vencidas" e "Vencem em breve". As relevâncias Desejável e Opcional continuam à espera de confirmação.

Descartado: uma lâmina "Atrasadas pela folga" (dias até o prazo final de cada atrasada). Repetia a lista "Prazo final em até 7 dias".

### Agenda, relatório e item

| O que | Por quê |
|---|---|
| A tarefa continua no dia da opção "Data"; o prazo final ganha um marcador próprio | Mudar a data da tarefa tiraria o vencimento da Agenda. O marcador põe as 2 datas na grade sem configurar nada |
| Marcador ligado por padrão, com a opção para desligar | Quem não usa o prazo final não vê nada novo; quem usa não precisa descobrir a opção |
| Tarefa em cor neutra, marcador do prazo final em vermelho claro, vencido em vermelho cheio | O vermelho fica só para a data que não se move. A cor neutra das tarefas rápidas vem do protótipo `agenda` |
| No relatório, "Prazo final vencido" é "Sim" ou "Não", e fica vazio sem prazo final | "Não" numa tarefa sem prazo final diria que há um prazo cumprido |
| No item, a mesma tabela de Tarefas Rápidas | A tarefa se lê igual onde aparece; ordenar e filtrar vêm junto |

### Para o dev

- **Relatório:** a prévia do arquivo é andaime. O caminho (ícone, Relatório Padrão, formato, aviso) é o do develop, visto pelo protótipo `meus-relatorios` em 14/10/2026.
- **Painel:** as lâminas seguem a moldura do develop (ponto colorido, "i" de "Como calculamos", seletor no canto). A etiqueta "Lâmina nova" e "Lâmina que muda" e a caixa tracejada dos números são andaime.
- **RI003:** o painel do develop agrega no back; as contagens novas pedem o prazo final na mesma agregação.

- **Maquete:** sem casca nas áreas Painel, Agenda e Item, a pedido da redatora ("nao precisa prototipar como é hoje"). As lâminas do develop que não mudam não foram reproduzidas. A Agenda mostra só novembro de 2026, sem as setas de mês. No item, só a pasta Tarefas tem conteúdo. "Hoje" continua 22/11/2026; o painel usa as concluídas do mock e um histórico fictício.
- **Não deu:** a pasta Tarefas da tela do item não foi vista no develop: a categoria de exploração não tinha item nos últimos 30 dias (P13). Os relatórios do menu do membro (`/reports`) dão 404 no develop; o relatório nativo de tarefas é o Relatório Padrão das Tarefas Rápidas.
- **Conferência no Chrome:** painel em pt-BR claro e es escuro; Agenda, Configuração, marcador abrindo o painel; item; relatório até a prévia. Sem erro no console.
- **Ver:** `evidencias/proposta-painel-de-tarefas.jpg`, `proposta-painel-de-tarefas-es-escuro.jpg`, `proposta-agenda.jpg`, `proposta-agenda-configuracao.jpg`, `proposta-item-tarefas.jpg`, `proposta-relatorio-colunas.jpg`

## Requisitos e card · 2026-11-11

- **Pedido (literal):** "no final, pode criar um card de user story no enspace, com raul como responsavel, dividido do modo como voce ja conhece: o epico é a user story e as tarefas dentro do item sao as partes de desenvolvimento referentes, aí me devolva o link."
- **Feito:** o `REQUISITOS.md` virou épico em `requisitos/epico.md`, com 7 partes, 1 arquivo por parte. Os IDs ficaram como estavam.
  - 1. O prazo final na tarefa rápida (a base); 2. Tabela, kanban e prazo final vencido; 3. Relatório Padrão; 4. Agenda; 5. Tarefa dentro do item; 6. Painel de tarefas; 7. Spaceflow.
  - As regras que valem para 2 ou mais partes (RN002, RN004, RN005 e RN006) ficam no épico; RN001 e RN003 ficam na parte 1, e RN007, na parte 6.
  - P4, P7 e P11 atravessam as partes e ficam no épico; as outras perguntas ficam na parte que elas mudam.
- **Corte:** a parte 6 pede agregação nova no back (RI003), então nenhuma outra espera por ela.
- **Sinal de tamanho:** as partes 1 (13 linhas) e 6 (11 linhas) passam de 1,5 vez a mediana (6). Ficam inteiras: cada uma é 1 funcionalidade (o campo na tarefa; as lâminas do painel).
- **Mudou no texto:** RF019 e RF028 agora dizem o que o protótipo mostra. Na tabela, o selo da célula do prazo final é "Vencido"; no cartão do kanban e no painel da tarefa, "Prazo final vencido".
- **Corrigido no protótipo:** o texto de "Como calculamos" das lâminas saía cortado em 1 linha; a dica agora quebra a linha.
- **Prints de requisito:** `requisitos/prints.json` e `evidencias/requisitos/`, 1 print por grupo. RI001, RI002, RI003 e RT001 não têm tela.

- **Card no ENSPACE** (desenvolvimento-enlighten2): `USEFBB2EBB2FFF948A5AA9D58612ECF8` (593783), "[TAREFAS] Prazo final nas Tarefas Rápidas", com o Raul como responsável e o link do protótipo.
  - A descrição é o épico, aberto por Problema e Proposta; o critério de aceite vai no campo próprio (`requisitos/criterio-de-aceite.md`).
  - As 7 tarefas são as partes, com as caixas de marcar e o print de cada grupo (tarefas 25380 a 25386).
  - Tipo, prioridade, status e branch do card ficaram em branco: o pedido não disse.

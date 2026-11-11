# 6. Painel de tarefas

**Objetivo:** o gestor vê no Painel de tarefas quantas tarefas rápidas passaram do prazo final, quantas vencem nos próximos 7 dias, que parte foi concluída dentro do prazo final e com quem estão as vencidas.

**Depende de:** 1. O prazo final na tarefa rápida.

**Onde vale:** Tarefas › Painel, com "Tarefas rápidas" no seletor do topo. Os 2 números entram depois de "No prazo", e as 2 listas, ao lado de "Vencidas" e "Vencem em breve".

**Protótipo:** https://pernalombr4.github.io/prototipos/prazo-final-nas-tarefas/, área Painel de tarefas. As etiquetas "Lâmina nova" e "Lâmina que muda" e a caixa tracejada dos números são da barra do protótipo, não do produto. As lâminas que não mudam não estão no protótipo.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN007 | Cada número que o Painel de tarefas já calcula pelo vencimento continua calculado pelo vencimento. | O card Vencidas conta as tarefas atrasadas (RN005), com ou sem prazo final. | Obrigatório |

## Os números (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF030 | O Painel de tarefas deve ter o número "Prazo final vencido": as tarefas abertas na RN006, com o percentual das abertas e quantas têm o prazo final nos próximos 7 dias. | Exemplo: 9 abertas, 2 com prazo final vencido, 3 com prazo final até 29/11: "2", "22% das abertas · 3 vencem em 7 dias". | Essencial | Obrigatório |
| RF031 | O Painel de tarefas deve ter o número "Dentro do prazo final": o percentual das tarefas concluídas no período com prazo final que foram concluídas até o prazo final. | Exemplo: 8 concluídas com prazo final, 6 até o prazo final: "75%", "6 de 8 concluídas com prazo final". Sem nenhuma, mostra "-" e "sem concluídas com prazo final". | Importante | Desejável |

## As lâminas que mudam (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF032 | A lâmina "Saúde dos prazos" deve ter o seletor "Vencimento" e "Prazo final", que troca a data das faixas e do número ao lado. | Com Prazo final: Prazo final vencido, Vencem em 7 dias, No prazo e Sem prazo final, e "Concluídas dentro do prazo final". Com Vencimento: a lâmina como é hoje. | Importante | Desejável |
| RF033 | A lâmina "Carga por responsável", em Abertas, deve separar na barra de cada pessoa as tarefas com prazo final vencido, as atrasadas ainda dentro do prazo final e as em dia. | Exemplo: Carla com 1 tarefa com prazo final vencido e 1 em dia mostra 2 segmentos e a legenda dos 3. | Importante | Desejável |

## As listas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF034 | O Painel de tarefas deve ter a lista "Prazo final vencido", com as tarefas da RN006, da mais antiga para a mais recente, cada uma com o responsável, a prioridade e há quantos dias o prazo final venceu. | Exemplo: "Protocolar a contestação do processo trabalhista", prazo final 19/11, hoje 22/11: "venceu há 3 dias". | Essencial | Obrigatório |
| RF035 | O Painel de tarefas deve ter a lista "Prazo final em até 7 dias", com as tarefas abertas cujo prazo final cai de hoje a hoje mais 7 dias, da mais próxima para a mais distante, com o selo "Atrasada" quando a tarefa está atrasada (RN005). | Exemplo: vencimento 20/11, prazo final 25/11, hoje 22/11: "vence em 3 dias" e "Atrasada". | Importante | Desejável |
| RF036 | Quando o membro clica numa tarefa das listas de RF034 ou RF035, o painel deve abrir a tarefa. | O painel da tarefa abre com o prazo final na seção Datas. | Importante | Obrigatório |

## Em cada lâmina (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF037 | Cada lâmina de RF030 a RF035 deve ter o "Como calculamos" com o texto do protótipo. | O "i" ao lado do título mostra a conta da lâmina. | Desejável | Desejável |
| RF039 | Com "Tarefas agendadas" no seletor do Painel de tarefas, as lâminas de RF030 a RF035 e o seletor de RF032 não devem aparecer. | Tarefas agendadas mostra só as lâminas de hoje. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI003 | Agregação do Painel de tarefas <a definir> | Deve devolver as contagens de RF030 a RF033 e as listas de RF034 e RF035, com os filtros de período e responsável do painel. | Obrigatório |

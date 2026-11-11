# 4. Criadas e concluídas e Tarefas por status

**Objetivo:** o gestor vê se a fila cresce ou encolhe ao longo do período e quantas tarefas estão em cada status agora.

**Depende de:** 1. A tela do painel e os filtros; 2. A lista do recorte.

**Onde vale:** a 2ª linha de painéis de Tarefas › Painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP ligado. Passe o mouse nos pontos de Criadas e concluídas e clique nas colunas de Tarefas por status.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN151 | A série conta por semana nos períodos Últimos 7 dias, Últimos 30 dias, Últimos 90 dias e Este mês, e por mês nos períodos Este ano, Últimos 12 meses e Todo o período. A semana segue RN914. | "Últimos 90 dias" mostra 1 ponto por semana; "Este ano", 1 ponto por mês. | Obrigatório |
| RN152 | A tarefa criada conta no ponto da data de criação, e a concluída, no ponto da data de conclusão (RN909). | Tarefa criada em 03/11/2026 e concluída em 10/11/2026 conta como criada na semana de 02/11 e como concluída na semana de 09/11. | Obrigatório |
| RN153 | Um ponto é parcial quando a semana ou o mês dele começa antes do período ou termina depois do fim do período. | Com "Últimos 30 dias" começando numa quarta-feira, a 1ª semana do gráfico é parcial. | Obrigatório |
| RN154 | O saldo de um ponto é calculado como as criadas menos as concluídas daquele ponto. | 12 criadas e 9 concluídas: saldo +3. | Obrigatório |

## Criadas e concluídas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF151 | O painel "Criadas e concluídas" deve mostrar 2 linhas, "Criadas" e "Concluídas", com 1 ponto por semana ou por mês do período (RN151 e RN152). | Exemplo: "Últimos 30 dias" mostra 5 ou 6 pontos por linha. | Essencial | Obrigatório |
| RF152 | A granularidade do painel deve seguir o período escolhido, sem seletor de semana, mês ou ano. | Trocar o período de "Últimos 90 dias" para "Este ano" troca os pontos de semana para mês. | Essencial | Obrigatório |
| RF153 | Em "Todo o período", a série deve começar no mês da tarefa mais antiga do workspace. | Exemplo: a 1ª tarefa criada em março de 2025 faz a série começar em março de 2025. | Importante | Obrigatório |
| RF154 | A dica de cada ponto deve mostrar a semana ou o mês, as criadas, as concluídas e o saldo (RN154), com o saldo em amarelo quando passa de 0. | Exemplo: "Semana de 02/11", "Criadas 12", "Concluídas 9", "Saldo +3" em amarelo. | Importante | Obrigatório |
| RF155 | A dica de um ponto parcial (RN153) deve dizer "Parcial: conta só os dias dentro do período." | Exemplo: a 1ª semana de "Últimos 30 dias" que começou numa quarta-feira leva o aviso. | Importante | Desejável |

## Tarefas por status (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF156 | O painel "Tarefas por status" deve mostrar 1 coluna por status, na ordem Pendente, Em andamento, Bloqueada e Concluída (RN903), com o total em cima de cada coluna. | Exemplo: 4 colunas com 52, 38, 6 e 125. | Essencial | Obrigatório |
| RF157 | As colunas Pendente, Em andamento e Bloqueada devem contar as abertas agora, e a coluna Concluída, as concluídas no período (RN908). | Exemplo: trocar o período muda só a coluna Concluída. | Essencial | Obrigatório |
| RF158 | Cada coluna deve ter a cor do status, igual à cor daquele status nas barras de Tarefas por responsável. | Pendente em cinza, Em andamento na cor de informação, Bloqueada em amarelo e Concluída em verde. | Importante | Desejável |
| RF159 | O clique numa coluna deve abrir a lista das tarefas daquele status: as abertas pelo prazo, da mais antiga à mais distante, e as concluídas da conclusão mais recente à mais antiga. | Exemplo: o clique em Bloqueada abre a lista com as 6 bloqueadas, a de prazo mais antigo no topo. | Essencial | Obrigatório |
| RF160 | O resumo da lista de uma coluna deve mostrar o nome do status em cada tela, o total e a divisão pela situação do prazo (RN907), com o número e a porcentagem de cada situação. | Exemplo: "Pendente em Rápidas, Aguardando em Agendadas" 52; "Vencida" 20, 38%; "A vencer" 18, 35%. | Importante | Obrigatório |

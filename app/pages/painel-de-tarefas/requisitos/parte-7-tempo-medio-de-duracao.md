# 7. Tempo médio de duração

**Objetivo:** o gestor vê quanto leva, em média, cada fluxo, cada etapa e cada tarefa, e em que etapa ou tarefa o tempo de um fluxo vai.

**Depende de:** 1. A tela do painel e os filtros; 2. A lista do recorte.

**Onde vale:** o painel "Tempo médio de duração", na 4ª linha de Tarefas › Painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP ligado. Troque o seletor do painel e clique num fluxo para descer de nível.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN301 | O tempo de uma etapa é o tempo do registro `start` ao registro `complete` da mesma etapa (`stage_id`), no `stages_log` do item no fluxo da categoria, em dias corridos. | A etapa Análise com `start` em 03/11/2026 às 09:00 e `complete` em 04/11/2026 às 09:00 leva 1 d. | Obrigatório |
| RN302 | O tempo de um fluxo da categoria é o tempo do 1º `start` ao último `complete` do `stages_log`, nos itens com `run_status: complete` que concluíram o fluxo no período. | O item que entrou no fluxo em 01/11/2026 e saiu da última etapa em 06/11/2026 leva 5 d. | Obrigatório |
| RN303 | O tempo de um fluxo do Spaceflow é o tempo do `created_at` ao `stopped_at` da execução com `status: completed`, nas execuções concluídas no período. | A execução criada às 10:00 e parada às 10:45 leva 45 min. | Obrigatório |
| RN304 | O tempo de uma tarefa é o tempo de conclusão (RN913), agrupado pelo nome da tarefa de Agendadas, dentro da etapa, ou pelo nome do nó do Spaceflow, dentro do fluxo. A tarefa criada manualmente fica numa linha só, "Tarefas criadas manualmente". | 30 tarefas "Aprovar proposta" da etapa Análise formam 1 linha; 50 tarefas criadas manualmente formam outra. | Obrigatório |
| RN305 | A divisão de um fluxo da categoria é a média de cada etapa nos itens que concluíram o fluxo, com a etapa pulada valendo 0. A soma das partes é a média do fluxo. | Fluxo com média de 5 d: Triagem 1 d, Análise 3 d, Aprovação 1 d. | Obrigatório |
| RN306 | A divisão de um fluxo do Spaceflow é a média de cada tarefa do fluxo, na ordem em que a execução cria as tarefas, mais a espera entre uma e outra. Quando a soma das tarefas passa da média do fluxo, a barra do fluxo fica sem divisão. | Fluxo com média de 2 d e tarefas de 0,5 d e 1 d: a espera entre uma e outra é de 0,5 d. | Obrigatório |
| RN307 | Na tarefa de Agendadas com "Habilitar Atribuição", a espera é a média da criação até alguém assumir, e a execução, a média de assumir até concluir. A tarefa só se divide em espera e execução quando cada concluída daquela linha foi assumida. | "Aprovar proposta" com média de 2 d: espera de 1 d 12 h e execução de 12 h. | Obrigatório |
| RN308 | A etapa mais lenta de um fluxo é a de maior média entre as etapas daquele fluxo, quando o fluxo tem 2 ou mais etapas com tempo no período. | No fluxo com Triagem 1 d, Análise 3 d e Aprovação 1 d, a mais lenta é Análise. | Obrigatório |

## Os 3 níveis (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | O painel deve ter o seletor "Por fluxo", "Por etapa" e "Por tarefa", e abrir em "Por fluxo". | O seletor aparece acima das barras, com "Por fluxo" marcado. | Essencial | Obrigatório |
| RF302 | Cada nível deve mostrar 1 barra horizontal por linha, da maior média para a menor, com a média na ponta. | Exemplo: em "Por tarefa", a tarefa de 3 d vem antes da de 1 d. | Essencial | Obrigatório |
| RF303 | "Por fluxo" deve mostrar cada fluxo da categoria (RN302) e cada fluxo do Spaceflow (RN303) com tempo no período, com o selo "Categoria" ou "Spaceflow". | Exemplo: o fluxo "Contratos" da categoria e o Spaceflow "Onboarding" aparecem no mesmo gráfico. | Essencial | Obrigatório |
| RF304 | Em "Por fluxo", a barra do fluxo da categoria deve se dividir nas etapas (RN305), e a do Spaceflow, nas tarefas (RN306), na ordem, com a parte mais lenta em amarelo. | Exemplo: a barra de "Contratos" mostra Triagem, Análise em amarelo e Aprovação. | Essencial | Obrigatório |
| RF305 | Em "Por fluxo", a espera entre uma tarefa e outra do Spaceflow deve aparecer em cinza, quando passa de 1% da média do fluxo. | A legenda mostra "Espera entre uma e outra" só quando alguma barra tem a parte cinza. | Importante | Desejável |
| RF306 | "Por etapa" deve mostrar cada etapa de cada fluxo da categoria (RN301), com o nome do fluxo junto do nome da etapa, e a etapa mais lenta de cada fluxo em amarelo (RN308). | Exemplo: "Análise" com "Contratos" ao lado, em amarelo. O Spaceflow não aparece, porque não tem etapa. | Essencial | Obrigatório |
| RF307 | "Por tarefa" deve mostrar cada linha de tarefa (RN304), com a origem e o caminho "<fluxo> › <etapa>" junto do nome. | Exemplo: "Aprovar proposta" com "Fluxo · Contratos › Análise". | Essencial | Obrigatório |
| RF308 | Em "Por tarefa", a barra da tarefa de Agendadas com "Habilitar Atribuição" deve se dividir em espera e execução (RN307). | Exemplo: "Aprovar proposta" mostra "Espera" e "Execução", com a legenda das 2. | Importante | Obrigatório |
| RF309 | Se nada foi concluído no período no nível escolhido, o painel deve mostrar "Nada concluído no período." no lugar das barras. | Exemplo: "Últimos 7 dias" sem item que concluiu o fluxo mostra a mensagem em "Por fluxo". | Importante | Obrigatório |

## Descer de nível (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF310 | O clique num fluxo da categoria deve trocar o painel para "Por etapa", só com as etapas daquele fluxo, e mostrar o selo "<fluxo>" com "×". | Exemplo: o clique em "Contratos" mostra Triagem, Análise e Aprovação e o selo "Contratos". | Essencial | Obrigatório |
| RF311 | O clique num fluxo do Spaceflow deve trocar o painel para "Por tarefa", só com as tarefas daquele fluxo, e mostrar o selo "<fluxo>" com "×". | Exemplo: o clique em "Onboarding" mostra as tarefas que o Spaceflow cria. | Essencial | Obrigatório |
| RF312 | O clique numa etapa deve trocar o painel para "Por tarefa", só com as tarefas daquela etapa, e mostrar o selo "<fluxo> › <etapa>" com "×". | Exemplo: o clique em "Análise" mostra o selo "Contratos › Análise". | Essencial | Obrigatório |
| RF313 | O clique no "×" do selo e a troca do seletor pelo membro devem tirar o recorte e mostrar o nível inteiro. | Exemplo: depois de "Contratos › Análise", o "×" mostra cada tarefa do workspace em "Por tarefa". | Essencial | Obrigatório |
| RF314 | O clique numa tarefa deve abrir a lista das tarefas concluídas no período que formam aquela linha, da que levou mais tempo à que levou menos. | Exemplo: o clique em "Aprovar proposta" abre a lista com as 30 concluídas. | Essencial | Obrigatório |
| RF315 | O resumo da lista de uma tarefa deve mostrar o fluxo, quantas foram concluídas, a média em destaque, a mediana, o tempo em que 90% terminaram e, quando há, a espera e a execução. | Exemplo: "Fluxo" Contratos, "Concluídas" 30, "Média" 2 d, "Mediana" 1 d 4 h, "90% em até" 5 d, "Espera · Execução" 1 d 12 h · 12 h. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI301 | `/c-flow-items` | Deve devolver o `stages_log` e o `run_status` de cada item, com filtro por fluxo e por período. Hoje não há rota de leitura documentada. | Obrigatório |
| RI302 | `/workflows/executions` | Deve aceitar o filtro pela data de fim (`stopped_at`) e devolver a contagem. | Obrigatório |
| RI303 | `/c-flow-item-tasks` | Deve devolver o `task_log` de cada tarefa, com a hora em que a tarefa passou a "Trabalhando", que separa a espera da execução (RN307). | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | `/c-flow-items` não tem rota de leitura documentada. O back abre a leitura com o `stages_log`, ou o tempo de etapa e de fluxo sai da agregação no servidor? | Time de back | Sem a leitura, RN301 e RN302 se calculam no servidor, e RI301 sai |
| P302 | A média conta só o que terminou: a tarefa parada há 2 meses some da média. O painel mostra, junto de cada tempo, quantas ainda estão em andamento e há quanto tempo? | produto | Com o sim, cada barra ganha a contagem das em andamento e a idade delas |

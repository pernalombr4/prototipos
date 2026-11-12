# 1. A tela do painel e os filtros

**Objetivo:** o gestor abre Tarefas › Painel e vê os painéis das tarefas que o perfil dele permite ver, recortados pelo período e pelos responsáveis que escolher.

**Onde vale:** Tarefas › Painel, no menu lateral do workspace, e a área Tarefas do editor de cargo, em Configurações › Gestão de Membros › Cargos.

**Protótipo:** https://pernalombr4.github.io/prototipos/painel-de-tarefas, com o botão MVP ligado na barra de baixo. Os estados da tela (carregando, vazio, filtro sem resultado, erro e sem permissão) estão no seletor de estado da mesma barra.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN002 | Uma tarefa entra no filtro de um responsável quando foi designada àquele responsável (RN910) ou quando aquela pessoa a assumiu ou concluiu. | Filtrar "Carla Nunes" traz a tarefa do grupo Jurídico que ela assumiu. | Obrigatório |
| RN003 | A tabela a seguir define o começo de cada período; o fim é o momento da consulta. Política: Única. | Linha 1: em 11/11/2026 às 15:00, "Últimos 7 dias" vai de 05/11/2026 às 00:00 até 11/11/2026 às 15:00. | Obrigatório |

| Linha | Período | Começa em |
|---|---|---|
| 1 | Últimos 7 dias | 00:00 de 6 dias antes de hoje |
| 2 | Últimos 30 dias | 00:00 de 29 dias antes de hoje |
| 3 | Últimos 90 dias | 00:00 de 89 dias antes de hoje |
| 4 | Este mês | 00:00 do dia 1 do mês atual |
| 5 | Este ano | 00:00 de 1º de janeiro do ano atual |
| 6 | Últimos 12 meses | 00:00 do dia 1 do mês, 11 meses antes do atual |
| 7 | Todo o período | sem começo |

## O item no menu e o cabeçalho (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O menu lateral do workspace deve ter o item "Painel" como 1º filho de Tarefas, acima de "Agendadas" e "Rápidas". | Clicar em Tarefas › Painel abre o painel, com a trilha "Tarefas › Painel". | Essencial | Obrigatório |
| RF002 | O item "Painel" do menu deve levar o selo "Novo". | O selo aparece ao lado de "Painel" e some depois do prazo de P001. | Desejável | Desejável |
| RF003 | O cabeçalho do painel deve mostrar o título "Painel de tarefas" e a hora em que os números foram calculados, em "Atualizado às <hora>". | Exemplo: o painel aberto às 14:32 mostra "Atualizado às 14:32". | Importante | Obrigatório |
| RF019 | Quando o membro vê cada tarefa do workspace (RN919), o cabeçalho deve mostrar "Todas as tarefas do workspace.". | Exemplo: o Owner vê a frase abaixo do título. | Essencial | Obrigatório |
| RF020 | Quando o membro vê só parte das tarefas do workspace (RN919), o cabeçalho deve mostrar "Tarefas que o seu perfil permite ver." (RN923). | Exemplo: um Standard com a permissão vê a frase abaixo do título, sem o total do workspace. | Essencial | Obrigatório |
| RF004 | Quando o membro clica em "Atualizar", o painel deve recalcular cada painel com os filtros escolhidos e trocar a hora de "Atualizado às". | Exemplo: uma tarefa concluída em Rápidas depois da abertura do painel entra nos números depois do clique. | Importante | Obrigatório |

## Quem abre o painel (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF017 | A área Tarefas do editor de cargo deve ter a caixa "Ver o painel de tarefas", desligada em cada cargo (RN920 e RN921). | Exemplo: ligar a caixa no cargo "Analista" e salvar faz cada membro com esse cargo ver Tarefas › Painel. | Essencial | Obrigatório |
| RF018 | O menu lateral deve mostrar o item "Painel" só ao membro que abre o painel (RN920). | Exemplo: um Viewer com cargo sem a caixa não vê "Painel" em Tarefas. | Essencial | Obrigatório |

## Os filtros (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF005 | A barra de filtros deve ter o filtro "Período", com as opções Últimos 7 dias, Últimos 30 dias, Últimos 90 dias, Este mês, Este ano, Últimos 12 meses e Todo o período (RN003). | As 7 opções aparecem nesta ordem. | Essencial | Obrigatório |
| RF006 | O painel deve abrir com o período "Últimos 30 dias". | Ao entrar em Tarefas › Painel, o filtro mostra "Últimos 30 dias". | Essencial | Obrigatório |
| RF007 | A barra de filtros deve ter o filtro "Responsável", de escolha múltipla, com a lista dividida em "Pessoas", "Grupos" e "Outros". | "Outros" tem "Todo mundo", "E-mail externo" e "Sem responsável". | Essencial | Obrigatório |
| RF008 | O filtro "Responsável" deve dizer quantos responsáveis estão escolhidos. | Exemplo: sem escolha, mostra "Todos os responsáveis"; com 1, o nome dele; com 2, "2 responsáveis". | Importante | Obrigatório |
| RF009 | Quando o membro muda um filtro, cada painel deve recalcular com o filtro novo (RN002 e RN908). | Exemplo: trocar para "Últimos 7 dias" muda Concluídas no prazo e mantém Vencidas, que conta as abertas agora. | Essencial | Obrigatório |
| RF010 | Enquanto há responsável escolhido, a barra deve mostrar "Limpar filtros", que tira cada responsável escolhido e mantém o período. | Exemplo: com "Carla Nunes" e "Últimos 90 dias", o clique deixa "Todos os responsáveis" e "Últimos 90 dias". | Importante | Obrigatório |

## Os painéis (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | O painel deve mostrar os painéis em 4 linhas: Vencidas, A vencer, Concluídas no prazo e Tempo médio de conclusão; Criadas e concluídas e Tarefas por status; Tarefas por responsável e Tarefas por grupo; Tempo médio de duração. | A ordem é a mesma do protótipo com o botão MVP ligado. | Essencial | Obrigatório |
| RF012 | Cada membro deve ver os painéis no arranjo fixo, sem mover, redimensionar nem ocultar painel. | 2 membros diferentes veem os painéis na mesma posição e no mesmo tamanho. | Essencial | Obrigatório |
| RF013 | Cada painel deve ter o botão (i) "Como calculamos", que abre a regra da conta daquele painel. | Exemplo: o (i) de Vencidas diz que o prazo é a "Data limite" nas Rápidas e a "Data Limite" do SLA nas Agendadas. O texto de cada painel está no protótipo. | Importante | Obrigatório |

## Os estados da tela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF014 | Se o membro vê cada tarefa do workspace (RN919) e o workspace não tem tarefa de Rápidas nem de Agendadas, o painel deve mostrar "Ainda não há tarefas neste workspace" no lugar dos painéis. | Exemplo: num workspace novo, sem tarefa, a tela mostra a mensagem. | Importante | Obrigatório |
| RF021 | Se o membro vê só parte das tarefas do workspace (RN919) e as listas dele em Agendadas e em Rápidas estão vazias, o painel deve mostrar "Ainda não há tarefas que o seu perfil permite ver" no lugar dos painéis. | Exemplo: um Standard com a permissão e sem tarefa nas listas dele vê a mensagem. | Importante | Obrigatório |
| RF015 | Se os filtros escolhidos não trazem tarefa, o painel deve mostrar "Nenhuma tarefa com esses filtros", com a sugestão de ampliar o período ou tirar um filtro. | Exemplo: "Últimos 7 dias" com o responsável "E-mail externo", sem tarefa no período, mostra a mensagem e mantém os filtros na tela. | Importante | Obrigatório |
| RF016 | Se o membro que não abre o painel (RN920) entra no endereço de Tarefas › Painel, a tela deve mostrar "Seu perfil não tem acesso ao painel de tarefas", com o pedido da permissão "Ver o painel de tarefas" a quem administra o workspace. | Exemplo: um Standard sem a caixa no cargo abre o endereço do painel, e a tela mostra só a mensagem, sem número. | Essencial | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS001 | Cada contagem e cada tempo do painel deve chegar calculado do servidor, com os filtros e as permissões do membro que pede (RN919). Imposta por: produto, no protótipo aprovado. | Na aba Rede do navegador, abrir o painel não percorre a listagem de `/ws/tasks` nem a de `/c-flow-item-tasks` página por página, e a resposta para um Standard traz só a contagem das tarefas que ele vê. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | O selo "Novo" do item "Painel" fica até quando? | produto | Define quando RF002 tira o selo |
| P003 | O item "Painel" fica em Tarefas ou o painel entra na Início, ao lado dos cartões de tarefa de hoje? | produto | Muda o endereço de RF001 |

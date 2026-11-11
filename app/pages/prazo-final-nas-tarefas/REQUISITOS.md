# Requisitos: Prazo final nas Tarefas Rápidas

**Objetivo:** cada tarefa rápida pode ter 2 datas: o vencimento, que já existe e marca o atraso, e o prazo final, a
data em que a tarefa precisa estar concluída. O prazo final aparece em cada lugar onde a tarefa rápida aparece.

**Onde vale:** Tarefas Rápidas (criação, painel da tarefa, tabela, kanban e Relatório Padrão), Painel de tarefas,
Agenda, pasta Tarefas da tela do item, Spaceflow e API de tarefas.

**Fora do escopo:** Tarefas Programadas do fluxo da categoria; mudança no comportamento do vencimento atual.

**Protótipo:** https://pernalombr4.github.io/prototipos/prazo-final-nas-tarefas/

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 (em revisão) | Cada tarefa rápida pode ter 0 ou 1 prazo final. | Tarefa sem prazo final é válida. | Obrigatório |
| RN002 | O prazo final segue o esquema de permissões do vencimento, em cada papel e em cada ação. | O papel que só vê o vencimento só vê o prazo final. | Obrigatório |
| RN003 (em revisão) | O prazo final aceita o tipo de valor que o vencimento aceita. | Vencimento só com data: prazo final só com data. | Obrigatório |
| RN004 | O prazo final de uma tarefa rápida não pode ser anterior ao vencimento dela. | Vencimento 20/11 e prazo final 20/11 ou 25/11: aceito. Vencimento 20/11 e prazo final 18/11: recusado. | Obrigatório |
| RN005 | Uma tarefa rápida é considerada atrasada quando a data atual passa do vencimento; o prazo final não muda o atraso. | Vencimento 20/11, prazo final 25/11, hoje 22/11: atrasada. | Obrigatório |
| RN006 | Uma tarefa rápida é considerada com o prazo final vencido quando não está concluída e a data atual passa do prazo final. | Vencimento 17/11, prazo final 19/11, hoje 22/11, Em andamento: prazo final vencido. A mesma tarefa concluída: sem o estado. | Obrigatório |
| RN007 | Cada número que o Painel de tarefas já calcula pelo vencimento continua calculado pelo vencimento. | O card Vencidas conta as tarefas atrasadas (RN005), com ou sem prazo final. | Obrigatório |

## Criação e edição (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Quando o membro cria uma tarefa rápida, o sistema deve oferecer o campo "Prazo final" logo abaixo do "Vencimento". | O modal Nova tarefa mostra Vencimento e, abaixo, Prazo final, os 2 opcionais. | Essencial | Obrigatório |
| RF002 | Quando o membro abre o painel da tarefa rápida, o sistema deve mostrar o prazo final e permitir alterá-lo, conforme RN002. | Exemplo: prazo final alterado para 27/11; o toast confirma, e a tabela mostra 27/11. | Essencial | Obrigatório |
| RF003 | O sistema deve permitir apagar o prazo final de uma tarefa rápida, conforme RN002. | O X do campo apaga o prazo final, e a coluna fica vazia. | Essencial | Obrigatório |
| RF004 | Se o membro não tem permissão para alterar o vencimento, o sistema deve mostrar o prazo final só para leitura (RN002). | As 2 datas aparecem como texto, com o aviso do papel. | Essencial | Obrigatório |
| RF013 | Se o membro informa um prazo final anterior ao vencimento, o sistema deve recusar o valor e mostrar o aviso no próprio campo (RN004). | Exemplo: vencimento 20/11, prazo final 18/11: "O prazo final precisa ser igual ou posterior ao vencimento (20/11/2026)." A tarefa fica como estava. | Essencial | Obrigatório |
| RF014 | Se o membro altera o vencimento para depois do prazo final, o sistema deve recusar o valor e mostrar o aviso no próprio campo (RN004). | Exemplo: prazo final 25/11, vencimento 27/11: "O vencimento precisa ser igual ou anterior ao prazo final (25/11/2026)." | Essencial | Obrigatório |
| RF018 | O vencimento da tarefa rápida deve se chamar "Vencimento" (en "Due date", es "Vencimiento") em cada tela que o mostra. | Painel, criação, coluna da tabela, filtro, Nova Visualização, Relatório Padrão, opções de data da Agenda e variáveis do Spaceflow mostram "Vencimento"; nenhum mostra "Prazo" nem "Data limite" para essa data. | Importante | Obrigatório |
| RF038 | Cada campo de data deve mostrar a instrução acima e a ajuda abaixo, com os textos do protótipo. | Vencimento: "Data planejada para a conclusão da tarefa." e "Depois desta data, a tarefa é marcada como atrasada." Prazo final: "Data em que a tarefa precisa estar concluída, como um prazo legal ou contratual." e "O prazo final deve ser igual ou posterior ao vencimento e não altera o atraso." | Importante | Desejável |

## Tabela, kanban e estado vencido (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF005 | A tabela de Tarefas Rápidas deve ter a coluna "Prazo final", depois da coluna "Vencimento". | Tarefa sem prazo final mostra a célula vazia. | Essencial | Obrigatório |
| RF012 | A coluna "Prazo final" deve permitir filtrar pelo prazo final, como as colunas de data que já filtram. | Exemplo: prazo final até 25/11 deixa só as tarefas com prazo final até 25/11. | Importante | Obrigatório |
| RF007 | Os filtros da tela de Tarefas Rápidas devem oferecer o prazo final, na tabela e no kanban, com as opções do filtro de vencimento. | O campo de data do filtro da barra lista Criado em, Vencimento e Prazo final. | Importante | Obrigatório |
| RF006 | Quando a tarefa rápida tem prazo final, o cartão do kanban deve mostrar o prazo final depois do vencimento. | O cartão mostra as 2 datas, cada uma com o ícone próprio. | Essencial | Obrigatório |
| RF008 | O sistema deve permitir ordenar a tabela de Tarefas Rápidas pelo prazo final, com as tarefas sem prazo final no fim. | Ordem crescente e decrescente; sem prazo final, no fim nas 2. | Desejável | Opcional |
| RF019 | Quando a tarefa rápida está com o prazo final vencido (RN006), a tabela, o cartão do kanban e o painel da tarefa devem mostrar o selo "Prazo final vencido" no lugar do selo "Atrasada". | A tarefa da RN006 mostra "Prazo final vencido" nos 3 lugares e não mostra "Atrasada"; a tarefa só atrasada continua com "Atrasada". | Importante | Desejável |
| RF020 | A tela de Tarefas Rápidas deve oferecer um atalho que filtra as tarefas com o prazo final vencido, com a contagem delas, na tabela e no kanban. | Com 2 tarefas no estado, o botão diz "Prazo final vencido (2)" e, ligado, deixa só as 2. Sem nenhuma, o botão não aparece. | Desejável | Opcional |

## Relatório Padrão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | O arquivo do Relatório Padrão de Tarefas Rápidas deve trazer as colunas "Vencimento", "Prazo final" e "Prazo final vencido", nessa ordem, em cada formato (Excel, CSV e DBF). | Exemplo: tarefa com vencimento 17/11 e prazo final 19/11, Em andamento, hoje 22/11: a linha traz 17/11/2026, 19/11/2026 e "Sim". | Essencial | Obrigatório |
| RF022 | Se a tarefa não tem prazo final, as células "Prazo final" e "Prazo final vencido" do arquivo devem ficar vazias. | A tarefa sem prazo final não traz "Não" na coluna "Prazo final vencido". | Importante | Obrigatório |

## Agenda (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF023 | A opção "Data" das Tarefas Rápidas na Configuração da Agenda deve oferecer "Prazo final". | A lista mostra Criado em, Vencimento, Prazo final e Concluído em. | Importante | Obrigatório |
| RF024 | Quando a tarefa rápida tem prazo final, a Agenda deve mostrar um marcador "Prazo final: <nome da tarefa>" no dia do prazo final, além da tarefa no dia da opção "Data". | Exemplo: Data = Vencimento; tarefa com vencimento 20/11 e prazo final 25/11 aparece em 20/11 e tem o marcador em 25/11. | Essencial | Obrigatório |
| RF025 | A Configuração da Agenda deve ter a opção "Marcar o prazo final" nas Tarefas Rápidas, ligada por padrão, que mostra ou esconde o marcador do RF024. | Desligada e salva, os marcadores somem; a tarefa continua no dia da opção "Data". Com Data = Prazo final, a opção não aparece. | Importante | Desejável |
| RF026 | Quando a tarefa está com o prazo final vencido (RN006), o marcador do prazo final deve aparecer com o destaque de vencido do protótipo; com a tarefa concluída, riscado. | O marcador de 19/11 da tarefa da RN006 aparece em vermelho cheio; o da tarefa concluída aparece riscado. | Importante | Desejável |
| RF027 | Quando o membro clica no marcador do prazo final, a Agenda deve abrir o painel da tarefa, como faz com a tarefa. | O painel abre com o prazo final na seção Datas. | Importante | Obrigatório |

## Tarefa dentro do item (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF028 | Em cada lugar da tela do item onde a tarefa rápida ligada ao item aparece, o sistema deve mostrar o vencimento e o prazo final, com o estado de RF019. | Exemplo: item CTR-0142 com 4 tarefas rápidas; a pasta Tarefas mostra as 2 datas de cada uma, e "Coletar as assinaturas do aditivo" (21/11 e 21/11, hoje 22/11) mostra o prazo final vencido. | Essencial | Obrigatório |
| RF029 | Quando o membro abre a tarefa rápida pela tela do item, o painel da tarefa deve mostrar o prazo final com as regras de RF002 a RF004. | O prazo final se altera e se apaga ali, conforme RN002. | Importante | Obrigatório |

## Painel de tarefas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF030 | O Painel de tarefas deve ter o número "Prazo final vencido": as tarefas abertas na RN006, com o percentual das abertas e quantas têm o prazo final nos próximos 7 dias. | Exemplo: 9 abertas, 2 com prazo final vencido, 3 com prazo final até 29/11: "2", "22% das abertas · 3 vencem em 7 dias". | Essencial | Obrigatório |
| RF031 | O Painel de tarefas deve ter o número "Dentro do prazo final": o percentual das tarefas concluídas no período com prazo final que foram concluídas até o prazo final. | Exemplo: 8 concluídas com prazo final, 6 até o prazo final: "75%", "6 de 8 concluídas com prazo final". Sem nenhuma, mostra "-" e "sem concluídas com prazo final". | Importante | Desejável |
| RF032 | A lâmina "Saúde dos prazos" deve ter o seletor "Vencimento" e "Prazo final", que troca a data das faixas e do número ao lado. | Com Prazo final: Prazo final vencido, Vencem em 7 dias, No prazo e Sem prazo final, e "Concluídas dentro do prazo final". Com Vencimento: a lâmina como é hoje. | Importante | Desejável |
| RF033 | A lâmina "Carga por responsável", em Abertas, deve separar na barra de cada pessoa as tarefas com prazo final vencido, as atrasadas ainda dentro do prazo final e as em dia. | Exemplo: Carla com 1 tarefa com prazo final vencido e 1 em dia mostra 2 segmentos e a legenda dos 3. | Importante | Desejável |
| RF034 | O Painel de tarefas deve ter a lista "Prazo final vencido", com as tarefas da RN006, da mais antiga para a mais recente, cada uma com o responsável, a prioridade e há quantos dias o prazo final venceu. | Exemplo: "Protocolar a contestação do processo trabalhista", prazo final 19/11, hoje 22/11: "venceu há 3 dias". | Essencial | Obrigatório |
| RF035 | O Painel de tarefas deve ter a lista "Prazo final em até 7 dias", com as tarefas abertas cujo prazo final cai de hoje a hoje mais 7 dias, da mais próxima para a mais distante, com o selo "Atrasada" quando a tarefa está atrasada (RN005). | Exemplo: vencimento 20/11, prazo final 25/11, hoje 22/11: "vence em 3 dias" e "Atrasada". | Importante | Desejável |
| RF036 | Quando o membro clica numa tarefa das listas de RF034 ou RF035, o painel deve abrir a tarefa. | O painel da tarefa abre com o prazo final na seção Datas. | Importante | Obrigatório |
| RF037 | Cada lâmina de RF030 a RF035 deve ter o "Como calculamos" com o texto do protótipo. | O "i" ao lado do título mostra a conta da lâmina. | Desejável | Desejável |
| RF039 | Com "Tarefas agendadas" no seletor do Painel de tarefas, as lâminas de RF030 a RF035 e o seletor de RF032 não devem aparecer. | Tarefas agendadas mostra só as lâminas de hoje. | Importante | Obrigatório |

## Spaceflow (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF009 | O Spaceflow deve oferecer o prazo final da tarefa rápida como variável em cada nó que oferece o vencimento como variável. | O gatilho "Tarefa atualizada" lista "Prazo final" depois de "Vencimento". | Essencial | Obrigatório |
| RF010 | Se a tarefa rápida não tem prazo final, o Spaceflow deve entregar a variável vazia, do mesmo modo que entrega o vencimento vazio. | A execução mostra o prazo final vazio, e o fluxo conclui. | Essencial | Obrigatório |
| RF011 | Quando o prazo final de uma tarefa rápida muda, o gatilho de tarefa atualizada deve disparar do mesmo modo que dispara quando o vencimento muda. | Alterar só o prazo final gera 1 execução. | Essencial | Obrigatório |
| RF015 | As ações do Spaceflow que criam ou alteram tarefa rápida devem permitir preencher o prazo final com data fixa ou variável, do mesmo modo que o vencimento. | Nó "Criar tarefa rápida" com prazo final = variável Prazo final do gatilho: a tarefa criada tem o prazo final da tarefa que disparou. | Essencial | Obrigatório |
| RF016 | Se, na execução, o prazo final ficar antes do vencimento, a ação deve falhar sem gravar a tarefa e com o motivo na execução (RN004). | Vencimento 30/11 e prazo final 25/11 chegam ao nó: a tarefa não é criada, e a execução mostra o aviso da RN004. | Essencial | Obrigatório |
| RF017 | Se as 2 datas do nó são fixas e o prazo final fica antes do vencimento, o nó deve recusar o salvamento com o aviso no campo do prazo final (RN004). | Vencimento 20/11 e prazo final 18/11 no nó: "Salvar" mostra o aviso, e o nó fica como estava. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Rotas que leem e gravam a tarefa rápida <a definir> | Devem receber e devolver o prazo final no campo <a definir>, com as permissões da RN002. | Obrigatório |
| RI002 | Rotas que gravam a tarefa rápida <a definir> | Devem recusar a gravação que fere a RN004, com erro de validação no status <a definir>, sem alterar a tarefa. | Obrigatório |
| RI003 | Agregação do Painel de tarefas <a definir> | Deve devolver as contagens de RF030 a RF033 e as listas de RF034 e RF035, com os filtros de período e responsável do painel. | Obrigatório |

## Transição (RT)

| ID | Requisito | Como conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT001 (em revisão) | Na entrada da funcionalidade, cada tarefa rápida existente deve ficar com o prazo final vazio, sem cópia do vencimento. | Nenhuma tarefa anterior à entrada tem prazo final. | Essencial | Obrigatório |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone e caixa de marcar com nome acessível, modal com título e descrição, foco visível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P4 | O sino e os cartões de tarefas da Home mostram o prazo final? Existe lembrete pelo prazo final? A Agenda já está em RF023 a RF027. | Produtos | Requisitos novos para o sino e a Home |
| P7 | O campo aparece em todo workspace ou se liga por workspace? | Produtos | Uma configuração por workspace e o que cada tela faz com o campo desligado |
| P8 | O texto do aviso de RF013 e RF014 é o do protótipo? | Produtos | Texto do aviso |
| P9 | A tarefa pode ter prazo final sem vencimento? O protótipo aceita, porque nenhuma regra proíbe. | Produtos | RN001 e RN004 |
| P11 | Existe o estado "prazo final próximo", antes de vencer? Com quantos dias? O painel usa 7 dias, como a lista "Vencem em breve". | Produtos | Selo e filtro de aviso; prazo das listas do painel |
| P12 | O prazo final vencido vira gatilho ou condição no Spaceflow? | Produtos | Gatilho novo no Spaceflow |
| P13 | A pasta Tarefas do item mostra hoje as tarefas rápidas ligadas ao item? O protótipo não conferiu o conteúdo de hoje. | Develop, num item com tarefa rápida | Onde o RF028 se aplica dentro do item |
| P14 | O relatório também ganha a coluna "Prazo final vencido", ou só "Prazo final"? | Produtos | RF021 |
| P15 | As lâminas novas do Painel de tarefas entram depois das que existem, ou no lugar de alguma? O protótipo põe os 2 números depois de "No prazo" e as 2 listas ao lado de "Vencidas" e "Vencem em breve". | Produtos | Ordem do painel |
| S1 | O tipo de valor do prazo final segue o do vencimento (RN003). | Back-end | RN003 |
| S2 | As tarefas existentes começam sem prazo final (RT001). | Produtos | RT001 |

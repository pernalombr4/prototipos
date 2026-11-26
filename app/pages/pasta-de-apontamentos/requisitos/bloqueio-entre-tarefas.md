# Requisitos: Bloqueio entre tarefas rápidas

**Objetivo:** uma tarefa rápida pode esperar outra ser concluída. Enquanto espera, ela fica Bloqueada e diz por quem espera; quando a última bloqueadora é concluída, ela volta ao status que tinha e o responsável recebe o aviso. Por padrão o bloqueio só avisa; com a trava ligada, a tarefa não começa nem é concluída antes das bloqueadoras.

**Onde vale:** Tarefas › Rápidas (quadro e painel da tarefa, no formulário atual e na interface nova) e a pasta Tarefas do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/pasta-de-apontamentos/?vista=tarefa&formulario=nova (cenário Produto para a bloqueadora sem acesso; cenário Jurídico para a trava).

**Fora do escopo:** o bloqueio entre itens; o filtro "Bloqueadas" na página do projeto; o aviso no marco do projeto; as ordens início com início, fim com fim e início com fim.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 (em revisão) | Uma tarefa bloqueada espera cada bloqueadora ser concluída (fim para início). | "Colher assinaturas" espera "Aprovar a minuta final" ser concluída. | Obrigatório |
| RN002 (em revisão) | Uma tarefa é considerada em espera quando ao menos 1 bloqueadora não está concluída, contando as bloqueadoras que a pessoa não vê. | 1 bloqueadora visível concluída e 1 sem acesso aberta: a tarefa continua em espera. | Obrigatório |
| RN003 (em revisão) | Uma tarefa não pode bloquear a si mesma, a própria subtarefa nem uma tarefa que já a bloqueia. | A tarefa A bloqueada por B não oferece B em "Esta tarefa bloqueia...". | Obrigatório |
| RN004 (em revisão) | Com a trava ligada, uma tarefa em espera não pode ser iniciada nem concluída como Concluída. | "Colher assinaturas" com trava e minuta em andamento: Em andamento e Concluída são recusados. | Obrigatório |
| RN005 (em revisão) | Concluir uma tarefa como "Não será feita" ou "Duplicada de outra tarefa" não depende das bloqueadoras. | Tarefa travada e em espera fecha como "Não será feita". | Obrigatório |

## Relacionar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 (em revisão) | O menu de relacionar da tarefa deve ter o grupo "Bloqueio", com as opções "Esta tarefa bloqueia..." e "Esta tarefa está bloqueada por...", cada uma com busca de tarefa. | O grupo se chama "Bloqueio" nos 2 formulários; o rótulo do botão é "Relacionar ou adicionar bloqueio". | Essencial | Obrigatório |
| RF002 (em revisão) | Quando a pessoa escolhe uma tarefa em "Esta tarefa bloqueia...", o sistema deve gravar a tarefa atual em "Bloqueada por" da tarefa escolhida. | A bloqueia B: B mostra A na aba Bloqueada por, e A mostra B na aba Bloqueia. | Essencial | Obrigatório |
| RF003 (em revisão) | A busca do grupo "Bloqueio" deve ficar sem as tarefas que a RN003 proíbe. | A busca de A não lista A, a subtarefa de A nem a tarefa que já bloqueia A. | Essencial | Obrigatório |
| RF004 (em revisão) | O "x" da linha na aba Bloqueada por ou Bloqueia deve remover o bloqueio nas 2 tarefas. | Remover B de "Bloqueada por" em A tira A da aba Bloqueia de B. | Essencial | Obrigatório |

## Status automático e aviso (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF005 (em revisão) | Quando uma tarefa Pendente ou Em andamento passa a estar em espera (conforme RN002), o sistema deve mudar o status dela para Bloqueada e guardar o status anterior. | Tarefa Em andamento recebe bloqueadora aberta: vira Bloqueada. | Essencial | Obrigatório |
| RF006 (em revisão) | Quando a última bloqueadora de uma tarefa Bloqueada pelo RF005 é concluída, o sistema deve devolver a tarefa ao status anterior. | Concluir "Aprovar a minuta final" leva "Colher assinaturas" de Bloqueada para Pendente. | Essencial | Obrigatório |
| RF007 (em revisão) | Quando o RF006 libera uma tarefa, o sistema deve avisar o responsável dela no sino com o texto "<quem concluiu> concluiu a última tarefa que "<tarefa>" esperava. Ela está liberada." | O responsável vê o aviso; o clique no aviso abre a tarefa. | Importante | Obrigatório |
| RF008 (em revisão) | Quando uma bloqueadora concluída é reaberta, o sistema deve devolver a tarefa que a espera a Bloqueada e mostrar o aviso "<tarefa> voltou a Bloqueada". | Reabrir "Aprovar a minuta final" devolve "Colher assinaturas" a Bloqueada. | Importante | Obrigatório |
| RF009 (em revisão) | Enquanto as bloqueadoras de uma tarefa não mudam, o sistema deve manter o status que a pessoa escolheu à mão. | Sem trava, a pessoa move a tarefa em espera para Em andamento, e ela continua Em andamento. | Importante | Obrigatório |
| RF010 (em revisão) | Enquanto a tarefa está em espera, a aba Bloqueada por deve mostrar o aviso "Esta tarefa espera "<nome da 1ª bloqueadora aberta>"." | "Revisar a migração das pastas ocultas" mostra a espera de "Liberar acesso de leitura ao banco de develop". | Importante | Obrigatório |

## Trava (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 (em revisão) | A aba Bloqueada por deve ter a chave "Travar até as bloqueadoras serem concluídas", desligada na tarefa nova. | A chave liga e desliga, e o estado fica gravado na tarefa. | Essencial | Obrigatório |
| RF012 (em revisão) | Se a pessoa tenta iniciar ou concluir uma tarefa travada em espera, o sistema deve recusar a mudança e mostrar o aviso "A tarefa está travada", com o número de bloqueadoras abertas. | "Colher assinaturas" travada: a seta de avançar o status mostra o aviso, e o status continua Bloqueada. | Essencial | Obrigatório |
| RF013 (em revisão) | Quando a tarefa travada em espera abre o modal "Concluir tarefa" com o motivo Concluída, o modal deve mostrar que a trava está ligada e desabilitar o botão Concluir. | Trocar o motivo para "Não será feita" habilita o botão, conforme RN005. | Essencial | Obrigatório |
| RF014 (em revisão) | Quando a tarefa sem trava em espera abre o modal "Concluir tarefa" com o motivo Concluída, o modal deve mostrar o número de bloqueadoras abertas e trocar o botão por "Concluir mesmo assim". | "Revisar a migração das pastas ocultas" mostra "Esta tarefa ainda espera 2 tarefas" e o botão "Concluir mesmo assim". | Essencial | Obrigatório |
| RF015 (em revisão) | Quando a pessoa inicia uma tarefa sem trava em espera, o sistema deve mostrar o aviso "A tarefa começou antes da hora", com o número de bloqueadoras abertas. | A tarefa vai para Em andamento e o aviso aparece. | Importante | Desejável |

## Bloqueadora sem acesso (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF016 (em revisão) | Quando a bloqueadora está numa categoria que a pessoa não vê, a aba Bloqueada por deve mostrar a linha "Tarefa sem acesso", sem nome, data nem responsável, com a dica "Está numa categoria que você não vê. Ela conta como bloqueio até ser concluída." | "Revisar a migração das pastas ocultas" lista 1 tarefa visível e 1 "Tarefa sem acesso". | Essencial | Obrigatório |
| RF017 (em revisão) | A contagem da aba Bloqueada por deve somar as bloqueadoras sem acesso. | 1 visível e 1 sem acesso: a aba mostra 2. | Importante | Obrigatório |

## Cartão do quadro (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF018 (em revisão) | Enquanto a tarefa espera uma bloqueadora visível, o cartão deve mostrar "Bloqueada por <nome da 1ª bloqueadora aberta>". | O cartão de "Colher assinaturas" mostra "Bloqueada por Aprovar a minuta final". | Importante | Obrigatório |
| RF019 (em revisão) | Enquanto a tarefa espera só bloqueadoras sem acesso, o cartão deve mostrar "Bloqueada por <n> tarefa sem acesso" ou "Bloqueada por <n> tarefas sem acesso". | Bloqueadora visível concluída e 1 sem acesso aberta: "Bloqueada por 1 tarefa sem acesso". | Importante | Obrigatório |
| RF020 (em revisão) | Enquanto a trava está ligada e a tarefa espera, o cartão deve mostrar o selo "Travada". | O cartão de "Colher assinaturas" tem o selo Travada ao lado do bloqueio. | Desejável | Desejável |

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

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Bloqueadora | Tarefa que outra espera ser concluída | aba "Bloqueada por" |
| Trava | Opção da tarefa que impede iniciar e concluir antes das bloqueadoras | "Travar até as bloqueadoras serem concluídas" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | Uma bloqueadora fechada como "Não será feita" ou "Duplicada" libera quem a espera? O protótipo libera, porque a tarefa fica Concluída. | Redatora | Se não libera, RN001 passa a pedir o motivo Concluída e o RF006 muda. |
| P2 | O sistema deve impedir ciclo longo (A bloqueia B, B bloqueia C, C bloqueia A)? O protótipo só impede o ciclo direto (RN003). | Redatora e dev | Com o impedimento, a busca precisa percorrer a cadeia antes de oferecer a tarefa. |
| P3 | Há limite de bloqueadoras por tarefa? O GitHub aceita até 50 por tipo de relação. | Dev | Um limite vira RN e aviso na busca. |
| P4 | Quem pode ligar e desligar a trava: o responsável, quem criou a tarefa ou só o administrador? | Redatora | Muda quem vê a chave habilitada. |
| P5 | O Spaceflow deve criar bloqueio entre as tarefas que gera e ter o gatilho "tarefa liberada"? | Redatora | Abre requisitos no construtor de fluxos. |
| S1 | O bloqueio liga tarefas de categorias e projetos diferentes, só dentro do mesmo workspace. | Redatora confirma | Entre workspaces, a "Tarefa sem acesso" vira o caso comum e a permissão precisa de regra própria. |
| S2 | Hoje o modelo de tarefa rápida tem o status Bloqueada, mas nenhum campo diz o que bloqueia. A relação, a trava e o status anterior são campos novos. | Dev confirma no modelo de tarefas | Se já houver campo para a relação, o RF002 reaproveita. |

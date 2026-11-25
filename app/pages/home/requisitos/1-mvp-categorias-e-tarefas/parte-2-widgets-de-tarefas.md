# 2. Widgets de tarefas

**Objetivo:** a pessoa põe na Home, uma por uma, as lâminas do Painel de tarefas, e o administrador escolhe se elas
mostram as tarefas dele ou as do workspace.

**Depende de:** 1. A grade e o Personalizar.

**Onde vale:** a Home do workspace e o grupo Tarefas do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "MVP" em "Versão". Para ver o controle do
administrador, escolha "Administrador" em "Ver como".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Cada widget de tarefa usa a regra de contagem e de faixa da lâmina de mesmo nome em Tarefas > Painel. | Vencidas na Home e Vencidas no Painel de tarefas mostram o mesmo número para o mesmo escopo. | Obrigatório |
| RN102 | Só o administrador escolhe ver as tarefas do workspace na Home (RN902); o membro vê só as tarefas dele. | Um membro com 3 tarefas abertas vê 3 em Abertas agora, mesmo com 40 abertas no workspace. | Obrigatório |

## Os widgets (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O grupo Tarefas do catálogo deve oferecer, em Números: Abertas agora, Concluídas, Criadas, Vencidas e Vencem em 7 dias. | Os 5 aparecem em Números, com a descrição do protótipo. | Essencial | Obrigatório |
| RF102 | O grupo Tarefas deve oferecer, em Listas: Vencidas e Vencem em breve, além de Minhas tarefas. | Vencidas (lista) mostra as mais antigas primeiro. | Essencial | Obrigatório |
| RF103 | O grupo Tarefas deve oferecer, em Gráficos: Abertas por status, Prioridade, Carga por responsável, Atividade, Saúde dos prazos e Entrada e saída. | Os 6 aparecem em Gráficos. | Essencial | Obrigatório |
| RF104 | Cada widget de tarefa deve mostrar o dado da lâmina de mesmo nome do catálogo do Painel de tarefas, conforme RN101. | Vencem em 7 dias, Saúde dos prazos e Entrada e saída, que hoje só existem no Painel de tarefas, também entram na Home. | Essencial | Obrigatório |
| RF105 | O cabeçalho de cada widget de tarefa deve ter o botão só de ícone "Abrir o Painel de tarefas", que abre Tarefas > Painel. | O botão não aparece em Minhas tarefas. | Importante | Desejável |
| RF106 | Os widgets com período devem mostrar o período no subtítulo, com o texto do protótipo. | Exemplo: Concluídas mostra "Últimas 4 semanas"; Vencidas (lista), "Rápidas e agendadas". | Desejável | Desejável |

## De quem são as tarefas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF107 | Para o administrador, o topo da Home deve mostrar o controle "Minhas tarefas · Workspace", com "Minhas tarefas" escolhido ao abrir a Home. | O controle fica entre a saudação e "Personalizar". | Essencial | Obrigatório |
| RF108 | A escolha no controle deve valer para cada widget de tarefa da Home, menos Minhas tarefas, que mostra só as tarefas da pessoa nas 2 escolhas. | Com "Workspace", Abertas agora soma as tarefas de todos; Minhas tarefas continua igual. | Essencial | Obrigatório |
| RF109 | Para o membro, o topo da Home não deve mostrar o controle "Minhas tarefas · Workspace" (RN102). | Na Home de um membro, o topo tem só "Personalizar" e "Criar". | Essencial | Obrigatório |
| RF110 | Enquanto a Home está em modo de edição, o controle "Minhas tarefas · Workspace" deve ficar escondido. | Ao clicar em "Personalizar", o controle some e volta ao clicar em "Concluir". | Desejável | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | "Minhas tarefas" nas lâminas conta só a tarefa em que a pessoa é responsável, ou também a que ela colabora? | produto; hoje segue a regra do Painel de tarefas | RN101 e RF108 |

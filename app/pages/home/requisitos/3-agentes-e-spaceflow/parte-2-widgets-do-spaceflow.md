# 2. Widgets do Spaceflow

**Objetivo:** quem cuida dos fluxos vê na Home quantas execuções correram, quais pararam com erro, em qualquer passo, e
quais estão esperando, e repete o passo que falhou sem abrir a execução.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** os widgets Execuções dos fluxos, Falhas nos fluxos e Fluxos em andamento, no grupo Spaceflow do
catálogo. A execução abre na tela de execução do Spaceflow.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". Para ver o "Sem
acesso", escolha "Membro" em "Papel".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Só a pessoa com a permissão de fluxos (`workflows`) vê os 3 widgets. | O membro sem a permissão não vê o grupo Spaceflow no catálogo. | Obrigatório |
| RN102 | Uma execução está parada quando está em andamento há mais de 2 dias. | A execução que começou há 3 dias e espera uma assinatura está parada. | Desejável |
| RN103 | A taxa de conclusão é o número de execuções concluídas dividido pelo número de execuções concluídas, com erro e canceladas, no período, arredondado para o inteiro mais próximo. | 214 concluídas, 6 com erro e 3 canceladas dão 96%. | Obrigatório |

## Catálogo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O catálogo deve mostrar o grupo Spaceflow só para quem tem a permissão de fluxos (RN101), com o selo "Pede acesso aos fluxos" em cada widget. | O membro sem a permissão não vê o grupo Spaceflow no catálogo. | Essencial | Obrigatório |
| RF102 | Se a pessoa sem a permissão tem um dos 3 widgets na Home, o widget deve mostrar "Sem acesso" com "Você não tem acesso a Spaceflow. Peça ao administrador ou remova o widget.". | O menu "⋯" do widget continua com "Remover da Home". | Importante | Obrigatório |
| RF103 | O cabeçalho dos 3 widgets deve ter o botão só de ícone "Abrir o Spaceflow", que abre a lista de fluxos. | O clique troca a Home pela lista de fluxos. | Importante | Desejável |

## Execuções dos fluxos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF104 | O widget deve mostrar, com o subtítulo "Últimos 7 dias", quantas execuções do workspace estão Em andamento, Concluídas, Com erro e Canceladas no período. | Exemplo: 9, 214, 6 e 3. | Essencial | Obrigatório |
| RF105 | Abaixo dos números, o widget deve mostrar a barra com a proporção de cada status e a frase "<n>% das execuções terminadas foram concluídas" (RN103). | Exemplo: "96% das execuções terminadas foram concluídas". | Importante | Obrigatório |
| RF106 | Sem execução no período, o widget deve mostrar "Nenhum fluxo rodou nos últimos 7 dias.". | Workspace sem fluxo mostra o texto. | Importante | Obrigatório |

## Falhas nos fluxos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF107 | O widget deve listar as execuções com erro dos últimos 7 dias, da que falhou por último à mais antiga, com cada tipo de passo. | Uma falha de e-mail e uma de agente de IA aparecem juntas. | Essencial | Obrigatório |
| RF108 | Cada linha deve mostrar o ícone do tipo do passo, com o nome do tipo na dica, o nome do fluxo, o número do item, "Falhou em: <passo>", a mensagem de erro em 1 linha e há quanto tempo falhou. | Exemplo: "Aprovação de compras", "#23147", "Falhou em: Avisar o financeiro", "há 2 h". | Essencial | Obrigatório |
| RF109 | O clique na linha deve abrir a execução no Spaceflow. | Clicar na linha abre a execução com o passo que falhou. | Essencial | Obrigatório |
| RF110 | O botão "Repetir" de cada linha deve executar de novo o passo que falhou. | A linha sai da lista, e o widget mostra o toast "O passo voltou para a fila do fluxo." com o nome do fluxo. | Essencial | Obrigatório |
| RF111 | Sem falha no período, o widget deve mostrar "Nenhum fluxo parou com erro nos últimos 7 dias.". | Sem falha nos últimos 7 dias, o widget mostra o texto. | Importante | Obrigatório |

## Fluxos em andamento (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF112 | O widget deve listar as execuções em andamento do workspace, da mais antiga à mais nova. | A que começou há 6 dias vem antes da que começou há 30 minutos. | Essencial | Obrigatório |
| RF113 | Cada linha deve mostrar o ícone do tipo do passo em que a execução espera, o nome do fluxo, o número do item, "Aguarda: <passo>" e "Começou <há quanto tempo>". | Exemplo: "Aprovação de compras", "#23154", "Aguarda: Aprovação da diretoria", "Começou há 3 dias". | Essencial | Obrigatório |
| RF114 | A execução parada (RN102) deve mostrar o selo "Parado há mais de 2 dias" e o ícone em amarelo. | A execução que começou há 6 dias mostra o selo; a de 20 horas, não. | Importante | Desejável |
| RF115 | O clique na linha deve abrir a execução no Spaceflow. | Clicar na linha abre a execução com o passo em espera. | Essencial | Obrigatório |
| RF116 | Sem execução em andamento, o widget deve mostrar "Nenhum fluxo em andamento.". | Sem execução em andamento, o widget mostra o texto. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI101 | `GET /workflows/metrics` | Recebe `startDate` e `endDate` e devolve a contagem das execuções do workspace por status. | Obrigatório |
| RI102 | `GET /workflows/executions` | Recebe o status (`error` ou `working`) como filtro e devolve as execuções com o fluxo e o item. | Obrigatório |
| RI103 | `PUT /workflows/nodes/:id/retry` | Recebe o id da execução do passo que falhou. É a chamada que a tela de execução já usa. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | A tela de execução pede confirmação antes de repetir: "Deseja executar novamente? Tarefas, processos e sub-fluxos podem ser criados novamente.". O "Repetir" da Home pede a mesma confirmação? O protótipo não pede. | produto | RF110 ganha o modal de confirmação |
| P102 | O passo que falhou, a mensagem e o passo em que a execução espera vêm da execução do passo: 1 chamada por execução da lista. A rota de execuções pode devolver o passo atual junto? | dev | Sem isso, o widget faz 1 chamada por linha ou mostra só o fluxo e o item |
| P103 | Os widgets mostram as execuções de todos os fluxos do workspace ou só dos fluxos que a pessoa edita? | produto | RF104, RF107 e RF112 |

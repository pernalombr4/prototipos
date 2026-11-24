# 1. Itens sem formulário e ações por formulário

**Objetivo:** o cargo com a categoria inteira vê e mexe nos itens sem formulário e nos formulários criados depois, e
o cargo restrito a alguns formulários vê só os itens deles. Criar, Atualizar e Excluir por formulário valem em toda
porta, sem mudar o que a pessoa vê.

**Onde vale:** Ajustar › Formulários e as sublinhas de formulário da tabela de categorias; a listagem, a criação, a
edição e a exclusão de itens pela tela, pela API, pela importação, pelo Spaceflow, pelos agentes de IA e pelas tarefas
de formulário.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. Em "Processos Judiciais", abra a seta
ou clique em Ajustar › Formulários.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Os itens sem formulário são uma origem da categoria, como cada formulário, e cada ação do cargo vale ou não nessa origem. | Em "Processos Judiciais", as origens são Cível, Criminal, Trabalhista e "Itens sem formulário". | Obrigatório |
| RN002 | A ação marcada na categoria inteira vale em cada origem, inclusive no formulário criado depois. | No workspace de produtos, o cargo com Ver inteiro em "Demandas" vê a demanda criada por um agente de IA do Spaceflow. | Obrigatório |
| RN003 | A ação com traço vale só nas origens marcadas. O formulário criado depois entra desmarcado nela. | Com Ver só em Criminal, o cargo não vê Cível, não vê o item criado pela API e não vê o formulário "Tributário" criado depois. | Obrigatório |
| RN004 | Criar, Atualizar e Excluir por origem valem em toda porta de criação e edição do item. | Com Atualizar só em Criminal, a API recusa a edição de um item de Cível pelo cargo. | Obrigatório |

## Itens sem formulário na tela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Ajustar › Formulários deve ter a linha "Itens sem formulário", abaixo dos formulários, com as 4 caixas e a frase "Criados pelo formulário padrão, pela API, por importação, pelo Spaceflow ou por agente de IA." (RN001). | A linha aparece em "Processos Judiciais" e segue as regras de caixa pai e filhas dos formulários. | Essencial | Obrigatório |
| RF002 | A seta da linha da categoria deve mostrar a sublinha "Itens sem formulário", com as mesmas 4 caixas. | A seta de "Processos Judiciais" mostra a sublinha depois de Trabalhista. | Importante | Obrigatório |
| RF003 | A linha "Todos os formulários" deve ter a frase "Inclui os itens sem formulário e os formulários criados depois." (RN002). | A frase aparece abaixo do rótulo. | Importante | Obrigatório |
| RF004 | O aviso da aba deve dizer "Formulário criado depois entra na ação marcada em "Todos os formulários". Na ação com traço, ele entra desmarcado." (RN002, RN003). | O aviso aparece abaixo da tabela. | Importante | Obrigatório |
| RF005 | A categoria sem formulário deve mostrar só a categoria, sem a linha "Itens sem formulário". | A coluna Formulários mostra "Sem formulários", e a seta não abre sublinha de origem. | Importante | Obrigatório |

## Listagem (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF006 | Com Ver inteiro na categoria, a listagem deve devolver os itens de cada formulário e os sem formulário (RN002). | Exemplo: "Demandas" com Ver inteiro; a demanda criada pelo agente de IA, sem formulário, aparece na lista do cargo. | Essencial | Obrigatório |
| RF007 | Com Ver com traço, a listagem deve devolver só os itens das origens marcadas em Ver (RN003). | Exemplo: "Processos Judiciais" com Ver só em Criminal; o processo de Cível e o processo criado pela API não aparecem, e o de Criminal aparece. | Essencial | Obrigatório |
| RF008 | Com Ver com traço e "Itens sem formulário" marcado, a listagem deve devolver também os itens sem formulário. | Ver em Criminal e em "Itens sem formulário": aparecem os processos de Criminal e os criados pela API. | Essencial | Obrigatório |
| RF009 | A listagem deve ignorar Criar, Atualizar e Excluir por formulário (RN901). | Exemplo: Ver inteiro e Criar só em Cozinha; a lista mostra os itens de Cozinha, de Quintal e os sem formulário. | Essencial | Obrigatório |
| RF010 | Se o cargo tenta abrir pelo endereço um item de uma origem sem Ver, o sistema deve negar o acesso como nega na categoria sem Ver. | Com Ver só em Criminal, abrir o endereço de um processo de Cível mostra o aviso de sem acesso. | Essencial | Obrigatório |

## Criar, Atualizar e Excluir por origem (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | Com Criar com traço, o sistema só deve criar o item nas origens marcadas em Criar (RN004). | Criar só em Cozinha: o formulário Quintal não aparece para o cargo, e a API recusa o item de Quintal. | Essencial | Obrigatório |
| RF012 | Com Atualizar com traço, o sistema só deve aceitar a edição de item das origens marcadas em Atualizar (RN004). | Atualizar só em Criminal: a tela e a API recusam a edição de um processo de Cível. | Essencial | Obrigatório |
| RF013 | Com Excluir com traço, o sistema só deve aceitar a exclusão de item das origens marcadas em Excluir (RN004). | Excluir só em Criminal: o sistema recusa a exclusão de um processo de Cível. | Essencial | Obrigatório |
| RF014 | A tarefa de formulário do fluxo da categoria deve seguir a regra de Criar e Atualizar por origem de RF011 e RF012. | Com Atualizar inteiro na categoria, a tarefa de formulário de um formulário criado depois aceita a edição. | Essencial | Obrigatório |
| RF015 | Criar sem Ver deve continuar valendo, na categoria e por origem (RN902). | Exemplo: "Denúncias" com Criar e sem Ver; a pessoa cria a denúncia e a lista da categoria fica vazia para ela. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Permissão do cargo para a origem "Itens sem formulário" | Uma referência própria por ação, ao lado da referência de cada formulário; o formato fica <a definir>. | Obrigatório |
| RI002 | Gravação da ação inteira | A ação inteira se grava só na categoria, sem a lista de formulários, e vale para cada origem (RN002). | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT001 | Na migração, a ação marcada em cada formulário da categoria deve virar a ação inteira, sem lista de formulários. Critério de fim: cargos migrados. | O cargo que hoje tem Ver em Cível, Criminal e Trabalhista passa a ver também os itens sem formulário. | Essencial | Obrigatório |
| RT002 | Na migração, a ação marcada em parte dos formulários deve ficar com traço nas mesmas origens, sem "Itens sem formulário". Critério de fim: cargos migrados. | O cargo com Ver só em Criminal continua sem ver Cível e os itens sem formulário. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S001 | O item criado pelo formulário padrão da categoria é gravado sem formulário e entra em "Itens sem formulário". | dev do back | Se o formulário padrão ganhar origem própria, a linha dele entra entre os formulários |
| P001 | Na RT002, o cargo que hoje vê os itens sem formulário pela correção do card USE87A7C6 deve ganhar "Itens sem formulário" marcado, para não perder o que vê? | produto | Marcando, o caso Cível e Criminal precisa de ajuste à mão depois da migração |
| P002 | O formulário criado depois numa ação com traço entra desmarcado. Produto confirma? | produto | Entrando marcado, RN003 e o aviso de RF004 mudam |

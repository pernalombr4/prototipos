# 2. Listagem e abertura

**Objetivo:** a listagem e a abertura de itens seguem o Ver de cada origem, inclusive o de "Itens sem formulário", em
toda porta, e os cargos gravados hoje continuam vendo o que veem.

**Depende de:** 1. Origem na tela de permissões.

**Onde vale:** a listagem e a abertura de itens pela tela, pela API, pelo MCP e pelos agentes de IA.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. Em "Processos Judiciais", o cargo tem
Ver só em Criminal.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN602 | Com Ver em cada origem da categoria, o cargo vê cada item da categoria. | No workspace de produtos, "Demandas" com Ver em cada formulário e em "Itens sem formulário": a demanda criada pelo agente de IA aparece para o cargo. | Obrigatório |
| RN603 | Com Ver em parte das origens, o cargo vê só os itens das origens marcadas. | "Processos Judiciais" com Ver só em Criminal: o cargo não vê Cível nem o processo criado pela API. | Obrigatório |
| RN604 | A listagem considera só o Ver por origem. Criar, Atualizar e Excluir por formulário não restringem o que a pessoa vê. | Na categoria "casa do raul", com Ver em cada origem e Criar só em Cozinha, a pessoa vê os itens de Cozinha, de Quintal e os sem formulário. | Obrigatório |
| RN605 | Criar pode valer sem Ver. | Numa categoria de denúncias, o cargo com Criar e sem Ver cria a denúncia e não vê nenhuma. | Obrigatório |

## Listagem e abertura (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF611 | Com Ver em cada origem da categoria, a listagem deve devolver os itens de cada formulário e os sem formulário (RN602). | Exemplo: "Demandas" com Ver em cada origem; a demanda criada pelo agente de IA, sem formulário, aparece na lista do cargo. | Essencial | Obrigatório |
| RF612 | Com Ver em parte das origens, a listagem deve devolver só os itens das origens marcadas em Ver (RN603). | Exemplo: "Processos Judiciais" com Ver só em Criminal; o processo de Cível e o processo criado pela API não aparecem, e o de Criminal aparece. | Essencial | Obrigatório |
| RF613 | Com Ver em parte das origens e em "Itens sem formulário", a listagem deve devolver também os itens sem formulário. | Ver em Criminal e em "Itens sem formulário": aparecem os processos de Criminal e os criados pela API. | Essencial | Obrigatório |
| RF614 | A listagem deve ignorar Criar, Atualizar e Excluir por formulário (RN604). | Exemplo: Ver em cada origem e Criar só em Cozinha; a lista mostra os itens de Cozinha, de Quintal e os sem formulário. | Essencial | Obrigatório |
| RF615 | Se o cargo tenta abrir pelo endereço um item de uma origem sem Ver, o sistema deve negar o acesso como nega na categoria sem Ver. | Com Ver só em Criminal, abrir o endereço de um processo de Cível mostra o aviso de sem acesso. | Essencial | Obrigatório |
| RF616 | A categoria sem permissão de formulário gravada deve continuar mostrando cada item ao cargo com Ver na categoria. | O cargo com Ver em "Fornecedores", sem formulário, vê cada item da categoria. | Essencial | Obrigatório |
| RF617 | Criar sem Ver na categoria deve continuar valendo (RN605). | Exemplo: "Denúncias" com Criar e sem Ver; a pessoa cria a denúncia e a lista da categoria fica vazia para ela. | Importante | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT611 | Na migração, o cargo com uma ação em cada formulário da categoria deve ganhar essa ação também em "Itens sem formulário". Critério de fim: cargos migrados. | O cargo que hoje tem Ver em Cível, Criminal e Trabalhista passa a ver também os itens sem formulário. | Essencial | Obrigatório |
| RT612 | Na migração, o cargo com uma ação em parte dos formulários deve ficar sem a ação em "Itens sem formulário". Critério de fim: cargos migrados. | O cargo com Ver só em Criminal continua sem ver Cível e os itens sem formulário. | Essencial | Obrigatório |

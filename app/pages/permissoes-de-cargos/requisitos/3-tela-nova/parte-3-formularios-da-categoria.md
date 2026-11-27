# 3. Formulários da categoria

**Objetivo:** o administrador restringe uma ação do cargo a alguns formulários da categoria, com a categoria como
caixa pai e os formulários como caixas filhas: marcar só alguns deixa a categoria com traço.

**Depende de:** 1. Tabela de categorias.

**Onde vale:** as sublinhas de formulário da categoria aberta e o resumo de formulários da coluna Restrições.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. Clique em "Processos Judiciais" ou no
resumo "1 de 3 formulários".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | A ação marcada na categoria inteira vale em cada formulário da categoria. A ação com traço vale só nos formulários marcados. | Ver com traço em "Processos Judiciais", só com Criminal: o cargo vê os processos criados pelo formulário Criminal e não vê os de Cível. | Obrigatório |
| RN202 | Um formulário criado depois entra desmarcado em cada ação do cargo. | O formulário "Tributário" criado em "Processos Judiciais" fica sem ação até alguém marcá-lo no cargo. | Obrigatório |

## Sublinhas de formulário (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | A categoria aberta deve mostrar 1 sublinha por formulário, com as caixas Criar, Ver, Atualizar e Excluir. A linha da categoria é a caixa pai. | "Processos Judiciais" aberta mostra Cível, Criminal e Trabalhista, com 4 caixas cada. | Essencial | Obrigatório |
| RF215 | Cada origem que a árvore de hoje mostra na categoria deve virar uma sublinha, com as mesmas regras de caixa dos formulários. | Com o épico "Itens sem formulário" no ar, "Itens sem formulário" aparece depois de Trabalhista, com a descrição que a árvore mostra. | Essencial | Obrigatório |
| RF202 | Marcar uma ação num formulário, com a ação desligada na categoria, deve ligar a ação na categoria com traço (RN201). | Marcar Ver em Criminal, sem Ver na categoria, deixa Ver de "Processos Judiciais" com traço. | Essencial | Obrigatório |
| RF203 | Marcar a caixa da categoria, ou clicar nela com traço, deve marcar a ação em cada formulário. | O clique no traço de Ver em "Processos Judiciais" marca Ver em Cível, Criminal e Trabalhista. | Essencial | Obrigatório |
| RF204 | Desmarcar 1 formulário numa ação marcada inteira deve deixar a ação da categoria com traço. | Desmarcar Ver em Cível deixa Ver da categoria com traço. | Essencial | Obrigatório |
| RF205 | Desmarcar o último formulário marcado numa ação deve desligar a ação na categoria. | Com Ver só em Criminal, desmarcar Criminal desliga Ver em "Processos Judiciais". | Essencial | Obrigatório |
| RF206 | Desmarcar a caixa da categoria deve desligar a ação na categoria e em cada formulário. | Desmarcar Criar em "Processos Judiciais" tira Criar da categoria e dos 3 formulários. | Essencial | Obrigatório |
| RF207 | Marcar Atualizar ou Excluir num formulário deve marcar e travar Ver no mesmo formulário (RN901). | Marcar Atualizar em Criminal trava Ver em Criminal. | Essencial | Obrigatório |
| RF209 | A categoria aberta deve avisar, na coluna Restrições da última sublinha de origem, que o formulário criado depois entra desmarcado na ação com traço (RN202). | O aviso aparece ao lado da última origem. O texto entra nos 3 idiomas, a partir do aviso do protótipo. | Importante | Obrigatório |
| RF216 | A categoria sem formulário não deve ter sublinha de formulário. | "Fornecedores", sem formulário, aberta mostra só a sublinha Campos. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S201 | A tela grava as permissões de formulário como a árvore de hoje: a ação na categoria e a ação em cada formulário marcado. | dev do front | Nada muda no que o back recebe; só a forma de marcar |

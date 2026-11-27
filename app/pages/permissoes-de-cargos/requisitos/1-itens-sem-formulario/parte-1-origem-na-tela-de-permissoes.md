# 1. Origem na tela de permissões

**Objetivo:** a tela de permissões do cargo mostra a origem "Itens sem formulário" junto dos formulários de cada
categoria, e o cargo grava a permissão dela como grava a de um formulário.

**Onde vale:** Configurações > Gestão de membros > Cargos > o cargo, aba Dados, a árvore de cada categoria com
formulário.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. Clique em "Processos Judiciais": a linha
"Itens sem formulário", abaixo dos formulários, é o que o nó da árvore de hoje mostra.

## Na tela de permissões (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF601 | Na tela de permissões do cargo, cada categoria com formulário deve ter a origem "Itens sem formulário" junto dos formulários, com as mesmas ações de um formulário (RN601). | Na árvore de "Processos Judiciais", o nó "Itens sem formulário" aparece depois de Trabalhista, com Criar, Ver, Atualizar e Excluir. | Essencial | Obrigatório |
| RF602 | A origem deve ter a descrição "Criados pelo formulário padrão, pela API, por importação, pelo Spaceflow ou por agente de IA.". | A descrição aparece junto do nome, nos 3 idiomas. | Importante | Obrigatório |
| RF603 | Marcar uma ação na categoria inteira deve marcar a ação também em "Itens sem formulário", como marca em cada formulário. | Marcar Ver em "Demandas" marca Ver em cada formulário e em "Itens sem formulário". | Essencial | Obrigatório |
| RF604 | A categoria sem formulário não deve mostrar a origem "Itens sem formulário". | "Fornecedores", sem formulário, mostra só as 4 ações da categoria. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI601 | Permissão do cargo para a origem "Itens sem formulário" | Uma referência própria por ação, ao lado da referência de cada formulário, aceita na gravação do cargo; o formato fica <a definir>. | Obrigatório |

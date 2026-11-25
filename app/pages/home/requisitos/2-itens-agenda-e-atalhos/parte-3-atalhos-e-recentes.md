# 3. Atalhos e Recentes

**Objetivo:** a pessoa abre da Home as telas que fixou e as que abriu por último.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** os widgets Atalhos e Recentes, no grupo Telas e atalhos do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | Os atalhos são os favoritos da pessoa, os mesmos da estrela do produto, até 10, guardados no navegador. | Favoritar uma visualização pela estrela faz a visualização aparecer em Atalhos. | Obrigatório |
| RN202 | Os recentes são as telas que a pessoa abriu por último, até 20, do histórico de navegação que o produto guarda no navegador. | A tela aberta há 5 minutos vem antes da aberta ontem. | Obrigatório |

## Atalhos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | O widget Atalhos deve listar os favoritos da pessoa (RN201), com o nome, o tipo e onde fica. | Exemplo: "Contratos a vencer", "Visualização · Contratos". | Essencial | Obrigatório |
| RF202 | Com o widget de 6 colunas ou mais, os atalhos devem aparecer em grade, e não em lista. | Com 4 colunas, os atalhos ficam em lista; com 8, em grade. | Desejável | Desejável |
| RF203 | O clique no atalho deve abrir a tela. | Clicar no atalho abre a tela favoritada. | Essencial | Obrigatório |
| RF204 | "Configurar" no widget Atalhos deve abrir a escolha de quais favoritos aparecem, em caixas de marcar. | Desmarcar 1 favorito tira o atalho do widget e deixa o favorito na estrela. | Importante | Desejável |
| RF205 | Sem favorito, o widget deve mostrar "Fixe aqui o que você abre todo dia.". | Quem nunca favoritou vê o texto. | Importante | Obrigatório |

## Recentes (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF206 | O widget Recentes deve listar as telas do histórico (RN202), da mais recente à mais antiga, com o nome, o tipo, onde fica e há quanto tempo. | Exemplo: "há 5 min", "há 2 h", "ontem", "há 3 dias". | Essencial | Obrigatório |
| RF207 | O clique na linha deve abrir a tela. | Clicar na linha abre a tela. | Essencial | Obrigatório |
| RF208 | Sem histórico, o widget deve mostrar "O que você abrir aparece aqui.". | Navegador sem histórico do produto mostra o texto. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | O protótipo aceita link externo em Atalhos; o favorito de hoje guarda só tela do produto. Atalho de link externo entra nesta parte ou fica para depois? | produto | Link externo pede onde guardar o endereço |
| P202 | O histórico guarda a página, não o item visto. Recentes mostra o item pelo título, ou pela tela em que a pessoa estava? | dev | RF206 |

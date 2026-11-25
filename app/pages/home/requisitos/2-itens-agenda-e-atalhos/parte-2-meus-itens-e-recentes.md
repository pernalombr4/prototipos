# 2. Meus itens e itens recentes

**Objetivo:** a pessoa volta aos itens que criou e vê os itens mais novos do workspace sem abrir cada categoria.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** os widgets Meus itens e Itens criados recentemente, no grupo Itens e categorias do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Um item é da pessoa quando a pessoa criou o item, o critério do filtro "Meus Itens" da tela de itens. O item não tem responsável. | O item que Renata criou e outra pessoa editou continua em Meus itens de Renata. | Obrigatório |

## Meus itens (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O widget Meus itens deve listar os itens da pessoa (RN101) nas categorias que a pessoa acessa (RN901), do mais novo ao mais antigo. | O item criado por outra pessoa não aparece, mesmo com edição de Renata. | Essencial | Obrigatório |
| RF102 | Cada linha deve mostrar o título do item e, embaixo, a categoria, o número e a etapa do fluxo. | Exemplo: "Notebook sem rede", "Chamados de TI · 23384 · Em atendimento". | Essencial | Obrigatório |
| RF103 | O clique na linha deve abrir o item. | Clicar na linha abre a tela do item. | Essencial | Obrigatório |
| RF104 | Sem item da pessoa, o widget deve mostrar "Você ainda não criou nenhum item.". | Membro que nunca criou item vê o texto. | Importante | Obrigatório |

## Itens criados recentemente (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF105 | O widget Itens criados recentemente deve listar os 8 itens criados por último nas categorias que a pessoa acessa (RN901). | Com 20 itens, aparecem os 8 mais novos. | Essencial | Obrigatório |
| RF106 | Cada linha deve mostrar o avatar de quem criou o item, com a dica "Criado por <nome>", o título, a categoria, o número, a etapa e a data de criação. | Passar o mouse no avatar mostra "Criado por Bruno Lima". | Essencial | Obrigatório |
| RF107 | O clique na linha deve abrir o item. | Clicar na linha abre a tela do item. | Essencial | Obrigatório |
| RF108 | Sem item nas categorias da pessoa, o widget deve mostrar "Nenhum item criado ainda.". | Workspace novo mostra o texto. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Meus itens mostra quantos itens no máximo e tem "Ver todos", que abre a tela de itens com o filtro "Meus Itens"? | produto | RF101 |
| P102 | O valor que o protótipo mostra à direita de Meus itens sai de qual campo, já que cada categoria cria os seus? | produto | Sem resposta, a linha não mostra valor |

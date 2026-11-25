# 2. Itens por categoria

**Objetivo:** a pessoa vê quantos itens há em cada categoria que acessa, lado a lado.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** o widget Itens por categoria, no grupo Itens e categorias do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão".

## O widget (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O widget deve mostrar 1 barra horizontal por categoria que a pessoa acessa, com o nome e o número de itens, da categoria com mais itens à com menos. | A categoria sem item aparece com 0 no fim. | Essencial | Obrigatório |
| RF102 | O clique na barra deve abrir a categoria. | Clicar na barra de Contratos abre a tela de itens de Contratos. | Importante | Obrigatório |
| RF103 | No workspace sem item, o widget deve mostrar "Nenhum item criado ainda.". | Workspace novo mostra o texto. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI101 | <a definir> | Devolve, numa chamada, o número de itens de cada categoria que a pessoa acessa. Hoje a conta pede 1 chamada a `items/count` por categoria. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | A contagem considera só os itens que a pessoa vê pela permissão da categoria (itens próprios, do grupo) ou todos da categoria? | produto | RI101 |
| P102 | Item inativo e item na lixeira entram na conta? | produto | RF101 |

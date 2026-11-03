# 1. Pílulas e lista do "+N"

**Objetivo:** a pessoa troca de visualização pela barra, lê o resumo de cada uma sem abri-la e, quando a tela aperta,
acha cada visualização na lista do "+N".

**Onde vale:** a barra de visualizações acima da lista, na tela de itens, em Tarefas Rápidas e em Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. "Tela: Estreita" e
"Visualizações: 18", na barra inferior, mostram o "+N".

## Pílula (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Cada visualização deve aparecer como pílula com o ícone e o nome, sem o traço embaixo que marca as folders. | A barra de visualizações e a barra de folders não se confundem lado a lado. | Essencial | Obrigatório |
| RF003 | O nome da pílula deve ser cortado pela largura máxima da pílula, com reticências, e não por número de letras. | "Revisão trimestral dos contratos de fornecedores estratégicos" aparece como "Revisão trimestral do...". | Essencial | Obrigatório |
| RF009 | A visualização ativa deve ir para o endereço da página (`?view=<referência>`). | Recarregar mantém a visualização; o link leva direto a ela. | Importante | Obrigatório |
| RF008 | O botão "+ Visualização", com o tooltip "Nova visualização", deve abrir a criação de visualização. | O botão aparece em cada largura de tela. | Importante | Obrigatório |

## Tooltip da pílula (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF004 | O tooltip da pílula deve mostrar, nesta ordem: o nome inteiro e a descrição; o tipo e quem vê em etiquetas, e "Versão só sua" e "Alterações não salvas" quando valem; "Agrupado por", no Kanban; "Filtros", com 1 etiqueta por filtro; "Ordenação", com 1 etiqueta por nível e a seta da direção; no rodapé, as dicas "Arraste para reordenar" e "Clique duas vezes para renomear", fora da visualização do sistema. O tooltip não mostra contagem de itens. | "Vencendo em 30 dias" mostra Tabela, Todos veem, as etiquetas "Vencimento nos próximos 30 dias" e "Status não é Vencido" e a etiqueta "Vencimento" com a seta para cima. | Importante | Obrigatório |
| RF111 | Quando a visualização tem filtro avançado, o tooltip deve mostrar o filtro avançado com "E" parte por parte, como filtros a mais; com "Ou", as partes ficam separadas por "ou", e o grupo de dentro vai numa etiqueta, entre parênteses. | "Revisão trimestral" mostra "Valor do contrato maior ou igual a R$ 60.000" e "(Status é Aprovado ou Assinado ou Prioridade é Alta)". | Importante | Desejável |

## Quando a tela aperta (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF119 | O botão da lista ("+N ⌄") deve aparecer só quando ao menos 1 visualização fica fora da barra; quando cada visualização cabe, a barra termina em "+ Visualização". | Com 4 visualizações na tela larga, só "+ Visualização" aparece; com 18, aparece o "+N". | Essencial | Obrigatório |
| RF005 | O N do botão da lista deve ser o número de visualizações que não cabem na largura da barra, sem contar a aberta. | Com 18 visualizações na tela estreita, o botão mostra "+15". | Essencial | Obrigatório |
| RF006 | A visualização ativa deve aparecer na barra em cada largura de tela, no lugar da última pílula que cabia quando a ativa está depois do corte. | Abrir pela lista uma visualização que não cabe a traz para a barra. | Essencial | Obrigatório |
| RF007 | O botão da lista, quando existe, e o "+ Visualização" devem vir logo depois da última pílula visível, sem rolagem horizontal. | Com 4 visualizações na tela larga, os 2 botões ficam colados em "Vencendo em 30 dias"; na tela estreita, os 2 continuam visíveis. | Essencial | Obrigatório |

## Lista do "+N" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF070 | A lista do "+N" deve mostrar, na ordem da barra, o ícone e o nome inteiro de cada visualização da tela, as da barra e as que não cabem, sem contagem de itens, com a busca "Pesquisar visualização...". | Digitar filtra; sem resultado, aparece "Nenhuma visualização encontrada.". | Essencial | Obrigatório |
| RF120 | Sem busca, a lista deve mostrar a divisória "Não cabem na barra" antes da 1ª visualização que não cabe. | Com 18 visualizações na tela estreita, a divisória fica depois da 3ª linha. | Essencial | Obrigatório |
| RF121 | A linha da visualização aberta deve aparecer destacada, com o ícone na cor primária e a marca de aberta. | Abrir "Vencidos" pela lista destaca a linha "Vencidos". | Importante | Obrigatório |
| RF123 | O fim da lista deve ter "Nova visualização", que fecha a lista e abre a criação de visualização, como "+ Visualização". | Clicar em "Nova visualização" fecha a lista e abre a criação. | Importante | Obrigatório |

## Teclado (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF063 | A barra deve ter `role="tablist"` com o rótulo "Visualizações", e cada pílula `role="tab"`, com ativação manual: Enter ou Espaço abre a visualização. | O leitor de tela anuncia "Visualizações, lista de abas". | Essencial | Obrigatório |
| RF064 | As setas para a esquerda e para a direita devem mover o foco entre as pílulas visíveis, sem abri-las. | A lista não muda enquanto o foco anda. | Essencial | Obrigatório |
| RF067 | Na lista do "+N", as setas para cima e para baixo devem andar entre as linhas, e Enter abre a visualização da linha em foco. | Qualquer visualização da lista abre só pelo teclado. | Importante | Obrigatório |

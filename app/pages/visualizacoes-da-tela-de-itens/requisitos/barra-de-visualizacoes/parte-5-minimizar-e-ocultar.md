# 5. Minimizar e ocultar

**Objetivo:** a pessoa deixa uma pílula só com o ícone, ou tira da barra uma visualização que não usa, sem perder a
visualização: a oculta continua na lista do "+N". As 2 escolhas valem só para ela (RN002).

**Depende de:** 1. Pílulas e lista do "+N"; 2. Menu da visualização e renomear.

**Onde vale:** o grupo "Só para mim" do menu da visualização, a barra e a lista do "+N", na tela de itens, em Tarefas
Rápidas e em Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens, com "Visualizações: 4" na barra
inferior.

## Minimizar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF125 | "Minimizar" deve deixar a pílula só com o ícone, com o nome no tooltip e no nome acessível; "Mostrar o nome" desfaz. | "Quadro por status" minimizada mostra só o ícone, e o tooltip continua com o nome. | Importante | Obrigatório |
| RF154 | O cálculo de quantas pílulas cabem na barra deve usar a largura da pílula minimizada. | Minimizar 1 pílula na tela estreita pode trazer mais 1 pílula para a barra. | Importante | Obrigatório |

## Ocultar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF126 | "Ocultar da barra" deve tirar a visualização da barra e deixá-la na lista do "+N", com o nome em cinza e o ícone de oculta, com Desfazer no aviso (RN010). | Ocultar "Vencendo em 30 dias" mostra a linha em cinza na lista; Desfazer devolve a pílula. | Importante | Obrigatório |
| RF153 | Cada visualização oculta deve contar no N do botão da lista e fazer o botão aparecer. | Com 4 visualizações na tela larga, ocultar 1 mostra "+1". | Importante | Obrigatório |
| RF155 | "Mostrar na barra" deve devolver a visualização ao lugar dela na ordem da pessoa. | "Vencendo em 30 dias" volta para a posição em que estava. | Importante | Obrigatório |
| RF128 | A visualização oculta que a pessoa abre pela lista deve aparecer na barra enquanto estiver aberta e sair quando a pessoa abrir outra. | Abrir "Vencendo em 30 dias" pela lista põe a pílula na barra; abrir "Itens" tira a pílula. | Importante | Obrigatório |
| RF129 | A visualização do sistema (RN001) não deve oferecer "Ocultar da barra"; a pílula do sistema pode ser minimizada. | O menu de "Itens" tem "Minimizar" e não tem "Ocultar da barra". | Importante | Obrigatório |
| RF069 | Os ícones de oculta e de minimizada, na lista do "+N", devem ter nome acessível ("Oculta da barra" e "Minimizada"). | O leitor de tela lê os 2. | Importante | Obrigatório |

# 7. Largura do painel e filtro do menu

**Objetivo:** a borda do painel se arrasta para mostrar nomes longos, e a lupa do cabeçalho filtra o menu da área
aberta.

**Depende de:** 1. Trilha, painel e menu flutuante.

**Onde vale:** a borda direita do painel e o cabeçalho do painel.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/

## Largura do painel (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF601 | A borda direita do painel deve se arrastar entre 264 px e 480 px de largura da barra, contando os 72 px da trilha. | Arrastar até o fim para em 480 px. | Importante | Desejável |
| RF602 | A largura escolhida deve continuar depois de recarregar a página no mesmo navegador. | Arrastar até 480 px e recarregar: a barra continua com 480 px. | Importante | Desejável |
| RF603 | Arrastar a borda abaixo de 210 px deve esmaecer o painel. | Em 200 px, o painel fica esmaecido. | Importante | Desejável |
| RF604 | Soltar a borda abaixo de 210 px deve recolher a barra; expandir depois volta à largura de antes do gesto. | Soltar em 200 px recolhe; expandir volta a 304 px. | Importante | Desejável |
| RF605 | Duplo clique na borda deve voltar à largura padrão de 304 px. | Duplo clique depois de arrastar: 304 px. | Desejável | Opcional |
| RF606 | A borda deve ser um `separator` com foco: as setas mudam 16 px, Home vai ao mínimo, End vai ao máximo, e a seta para a esquerda no mínimo recolhe. | Pelo teclado, a borda faz o que o mouse faz. | Importante | Desejável |

## Filtro do menu (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF611 | A lupa do cabeçalho do painel deve abrir o campo "Filtrar o menu" no lugar do nome da área, com o foco dentro. | Clicar na lupa não abre a busca "Buscar... Ctrl K". | Essencial | Obrigatório |
| RF612 | Esc ou o "x" do campo deve fechar o filtro e limpar o termo. | Esc devolve o nome da área e o menu inteiro. | Essencial | Obrigatório |
| RF613 | O filtro deve procurar também nas seções recolhidas e nas categorias que ficam fora do teto da seção Categorias. | Filtrar "fornec" acha Fornecedores, que estava fora das 5 categorias. | Essencial | Obrigatório |
| RF614 | Enquanto a pessoa filtra, a seção com resultado deve abrir, e a seção sem resultado sai da lista. | Filtrar "modelos" no painel de Configurações abre o grupo com Modelos e esconde os outros. | Importante | Obrigatório |
| RF615 | Enquanto a pessoa filtra, cada seção deve mostrar cada resultado, sem o teto da seção. | Filtrar "o" no painel Dados mostra cada categoria com "o" no nome, e não só 5. | Importante | Obrigatório |
| RF616 | Se o filtro não acha nada, o painel deve dizer "Nada no menu com "termo"." e ter o botão "Buscar "termo" no workspace", que abre a busca "Buscar... Ctrl K" já com o termo. | Filtrar "xyz" e clicar no botão abre a busca com "xyz". | Importante | Desejável |

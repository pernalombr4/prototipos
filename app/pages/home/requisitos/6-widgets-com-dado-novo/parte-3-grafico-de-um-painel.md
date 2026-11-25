# 3. Gráfico de um painel

**Objetivo:** a pessoa traz para a Home um painel de uma tela do tipo Dashboard que ela já usa.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** o widget Gráfico de um painel, no grupo Telas e atalhos do catálogo. O painel continua na tela de
origem.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". No protótipo, o
widget mostra 1 painel fixo, sem a escolha.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | O widget mostra o painel com os itens e os filtros que o painel tem na tela de origem; a Home não muda o painel. | Mudar o painel na tela muda o widget na próxima carga da Home. | Obrigatório |

## O widget (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | "Configurar" no widget deve pedir a tela do tipo Dashboard e o painel dela. | Só aparecem as telas que a pessoa acessa. | Essencial | Obrigatório |
| RF202 | O widget deve mostrar o painel escolhido (RN201), com o subtítulo "Da tela <tela>". | Exemplo: o painel Compras por mês mostra "Da tela Compras". | Essencial | Obrigatório |
| RF203 | O cabeçalho do widget deve ter o botão só de ícone "Abrir a tela", que abre a tela de origem. | O clique troca a Home pela tela de origem. | Importante | Desejável |
| RF204 | Se a tela não tem dados, o widget deve mostrar "A tela <tela> ainda não tem dados.". | A tela sem item mostra o texto no lugar do gráfico. | Importante | Obrigatório |
| RF205 | Se a pessoa perde o acesso à tela, o widget deve mostrar "Sem acesso" com "Você não tem acesso a <tela>. Peça ao administrador ou remova o widget.". | O menu "⋯" do widget continua com "Remover da Home". | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | O widget desenha o painel com o mesmo componente da tela Dashboard, que busca os itens e agrega no navegador? | dev | O custo de carga da Home |
| P202 | Se o painel ou a tela é excluído, o widget mostra o quê? | produto | Novo estado do widget |

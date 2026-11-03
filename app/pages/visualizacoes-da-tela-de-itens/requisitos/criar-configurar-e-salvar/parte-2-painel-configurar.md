# 2. Painel Configurar

**Objetivo:** a pessoa configura a visualização num painel ao lado da tabela, vê cada ajuste na tabela ou no quadro na
hora e salva pelo rodapé do painel, sem 2º modal.

**Depende de:** 1. Alterações não salvas e salvar.

**Onde vale:** "Configurar" no menu da visualização, na tela de itens, em Tarefas Rápidas e em Tarefas Agendadas. O
painel substitui o modal de edição de visualização de hoje.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. "Configurar" no menu da
visualização ativa abre o painel.

## Painel (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF048 | Configurar deve abrir o painel à direita da tabela, que encolhe para o painel caber sem cobrir os itens. | Os itens continuam visíveis com o painel aberto. | Essencial | Obrigatório |
| RF049 | Cada ajuste no painel deve aparecer na tabela ou no quadro na hora, como alteração não salva. | Ocultar a coluna "Área" tira a coluna sem salvar. | Essencial | Obrigatório |
| RF050 | Com o painel aberto, trocar de pílula deve mostrar no painel a configuração da nova ativa. | Trocar para "Acima de R$ 100 mil" mostra o filtro de valor. | Importante | Desejável |
| RF051 | As seções do painel devem ficar separadas por linha, com o rótulo em cima de cada campo, nesta ordem: Nome (com o ícone no mesmo grupo) e Descrição; Exibição; Cartão, no Kanban, ou Colunas, na Tabela; Filtros; Ordenação; Quem vê. | Nenhum campo fica empurrado por rótulo ao lado. | Essencial | Obrigatório |
| RF055 | Cada campo deve aparecer pelo rótulo e pelo ícone do tipo, sem o nome técnico do tipo ("inputText", "EnlCalendar", "EnlNumber", "radioButton", "EnAssignees"). | Nenhum nome técnico aparece no painel, em Itens e nas tarefas. | Essencial | Obrigatório |
| RF033 | Com o painel aberto, a barra flutuante não deve aparecer: salvar e descartar ficam só no rodapé do painel. | A ação de salvar nunca aparece em 2 lugares. | Essencial | Obrigatório |
| RF062 | O rodapé do painel deve ter o estado ("Alterações não salvas" ou "Tudo salvo"), Descartar e o botão de salvar com seta da barra flutuante. | Sem alteração não salva, Descartar e salvar ficam desligados. | Essencial | Obrigatório |

## Exibição, Cartão e Colunas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF052 | Exibição deve ter Tabela e Kanban; no Kanban, "Agrupar por" com os campos da tela (RN013). | Trocar para Kanban mostra o quadro agrupado por Status. | Essencial | Obrigatório |
| RF053 | No Kanban, a seção Cartão deve ter "Título do cartão", "Texto de apoio", "Etiquetas", "Pessoa" e "Data", gravados no cartão da visualização. | Escolher "Prioridade" em Etiquetas mostra a prioridade em cada cartão. | Essencial | Obrigatório |
| RF054 | Na Tabela, Colunas deve listar as visíveis na ordem da tabela, com alça de arrastar, subir e descer e o olho para ocultar, e as ocultas embaixo, com o olho riscado para mostrar. | Ocultar "Área" tira a coluna da tabela na hora. | Essencial | Obrigatório |

## Ordenação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF059 | Ordenação deve aceitar mais de 1 nível ("Ordenar por", "Depois por"), cada nível com campo e direção. | Ordenar por Vencimento e depois por Valor aplica os 2 níveis na tabela. | Importante | Obrigatório |
| RF083 | No Kanban, o título da seção Ordenação deve ser "Ordem dos cartões em cada coluna". | Trocar para Kanban troca o título. | Desejável | Opcional |

## Quem vê (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF060 | Quem vê deve ter "Todos do workspace", "Só eu" e "Grupos e funções"; com "Grupos e funções", a escolha de grupos e de funções. | Escolher "Só eu" grava a visualização como só minha. | Essencial | Obrigatório |
| RF061 | Para Standard ou Viewer, "Todos do workspace" e "Grupos e funções" devem aparecer desligados (RN011), com a nota "Só Owner e Full mudam quem vê uma visualização de todos. As suas alterações ficam só para você." | Standard vê só "Só eu" ligado. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Visualização (`ModelView`), ordenação | Deve guardar a ordenação com mais de 1 nível (lista de campo e direção); hoje guarda 1 campo (`defaultColumnSortField` e `sortOrder`). Formato: <a definir>. | Obrigatório |

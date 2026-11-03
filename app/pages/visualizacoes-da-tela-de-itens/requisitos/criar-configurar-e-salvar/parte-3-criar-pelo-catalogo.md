# 3. Criar pelo catálogo

**Objetivo:** a pessoa escolhe Tabela ou Kanban e já ganha a visualização nova, genérica, aberta no painel Configurar
para dar nome e ajustar; o modal "Nova Visualização" de hoje sai.

**Depende de:** 2. Painel Configurar. A caixa "Fixar no início" usa a fixação do épico "Barra de visualizações".

**Onde vale:** o botão "+ Visualização" da barra de visualizações e "Nova visualização" no fim da lista do "+N", na tela
de itens, em Tarefas Rápidas e em Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. "+ Visualização" abre o
catálogo.

## Catálogo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF040 | "+ Visualização" deve abrir o catálogo "Nova visualização" com os tipos Tabela e Kanban, cada um com ícone, nome e 1 linha de descrição, e as caixas "Só para mim" e "Fixar no início". | Abrir o catálogo não cria nada; fechar o catálogo deixa a barra como estava. | Essencial | Obrigatório |
| RF090 | Com "Só para mim" marcado, a visualização nova deve nascer com "Só eu" em Quem vê; desmarcado, com "Todos do workspace". | Owner que cria sem marcar vê "Todos do workspace" no painel. | Essencial | Obrigatório |
| RF091 | Para Standard ou Viewer, "Só para mim" deve vir marcado e desligado, com o tooltip "Seu perfil cria visualizações só para você." (RN011, linha 2). | Standard vê a caixa marcada e não consegue desmarcar. | Essencial | Obrigatório |
| RF092 | Com "Fixar no início" marcado, a visualização nova deve nascer fixada, depois da última fixada. | Com Meus contratos fixada, o Kanban novo fica na 3ª posição, depois de Itens e Meus contratos. | Importante | Desejável |

## A visualização nova (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF041 | Escolher o tipo deve criar a visualização na hora, com o nome do tipo, abri-la e abrir o painel em modo de criação, com o título "Nova visualização". | Escolher Kanban mostra a pílula "Kanban" ativa e o quadro agrupado por Status. | Essencial | Obrigatório |
| RF081 | A Tabela nova deve começar com cada coluna da tela, sem filtro e sem ordenação. | A tabela mostra os 48 itens e cada coluna. | Essencial | Obrigatório |
| RF088 | O Kanban novo deve começar agrupado por Status (em Tarefas Agendadas, por Status da Tarefa), sem filtro, sem ordenação e com o cartão sem etiqueta. | O texto de apoio aparece inteiro em cada cartão. | Essencial | Obrigatório |
| RF089 | Se o nome do tipo já existe na tela, a visualização nova deve receber o nome do tipo com o próximo número livre. | Criar 2 Tabelas seguidas dá "Tabela" e "Tabela 2". | Importante | Obrigatório |

## Modo de criação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF043 | O campo Nome do modo de criação deve vir em foco, com o nome do tipo selecionado, e ser obrigatório. | Digitar troca o nome inteiro. | Essencial | Obrigatório |
| RF082 | A pílula em criação deve mostrar o nome enquanto a pessoa digita. | Digitar "Contratos por etapa" muda a pílula a cada letra. | Importante | Desejável |
| RF093 | No modo de criação, cada ajuste do painel deve entrar direto na visualização nova, sem alteração não salva e sem o botão de salvar. | O rodapé mostra só "Descartar visualização" e "Concluir". | Essencial | Obrigatório |
| RF044 | Se a pessoa conclui com o Nome vazio, o sistema deve mostrar "Informe um nome." no campo e devolver o foco ao campo Nome. | O painel continua aberto. | Essencial | Obrigatório |
| RF045 | Se o nome já existe na tela, o sistema deve mostrar "Já existe uma visualização com este nome." no campo. | O painel continua aberto. | Essencial | Obrigatório |
| RF046 | "Concluir", Enter no campo Nome ou o X do painel deve manter a visualização e fechar o painel. | A pílula fica com o nome dado, e o aviso diz "Visualização <nome> criada.". | Essencial | Obrigatório |
| RF047 | "Descartar visualização", no rodapé do painel ou no menu da pílula em criação, deve apagar a visualização em criação e voltar para a visualização de onde a pessoa saiu. | Nada fica gravado, e a pílula de origem volta ativa. | Essencial | Obrigatório |
| RF162 | O menu da pílula em criação deve ter só "Descartar visualização". | O botão direito na pílula em criação mostra 1 item. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P008 | Quais campos o cartão do Kanban novo mostra em cada categoria? O protótipo usa Fornecedor, Valor do contrato, Responsável e Vencimento, escolhidos à mão. O cartão do `EnKanbanBoard` tem altura fixa: com título, texto de apoio, etiqueta, pessoa e data, o texto de apoio some. | Mikaela e time de front | Define a regra de escolha dos campos e se o cartão cresce com o conteúdo |
| S005 | Standard ou Viewer pode criar visualização só para si (RN011, linha 2). | Mikaela confirma | Se não pode, "+ Visualização" some para esse perfil |

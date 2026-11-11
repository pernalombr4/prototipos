# Épico: Prazo final nas Tarefas Rápidas

**O que é:** cada tarefa rápida pode ter 2 datas: o vencimento, que já existe e marca o atraso, e o prazo final, a data em que a tarefa precisa estar concluída, como um prazo legal ou contratual. O prazo final aparece em cada lugar onde a tarefa rápida aparece: na tarefa, na tabela, no kanban, no Relatório Padrão, na Agenda, na tela do item, no Painel de tarefas e no Spaceflow.

**Onde vale:** Tarefas › Rápidas, Tarefas › Painel, Agenda, a pasta Tarefas da tela do item, o Spaceflow e a API de tarefas.

**Protótipo:** https://pernalombr4.github.io/prototipos/prazo-final-nas-tarefas/. A barra de baixo da tela é a barra do protótipo: "Área" troca entre Tarefas Rápidas, Painel de tarefas, Agenda, Item e Spaceflow. "Hoje" no protótipo é 22/11/2026.

**Fora do escopo:** as Tarefas Agendadas do fluxo da categoria; mudança no comportamento do vencimento atual, que continua marcando o atraso.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. O prazo final na tarefa rápida](parte-1-o-prazo-final-na-tarefa-rapida.md) | O campo "Prazo final" na criação e no painel da tarefa, a validação contra o vencimento, o nome "Vencimento", a instrução e a ajuda, a API e as tarefas existentes sem prazo final | | É a base: as outras partes leem o prazo final que esta grava |
| [2. Tabela, kanban e prazo final vencido](parte-2-tabela-kanban-e-prazo-final-vencido.md) | A coluna, o filtro e a ordenação pelo prazo final, a data no cartão do kanban, o selo "Prazo final vencido" e o atalho que filtra as vencidas | 1 | É onde o membro trabalha a tarefa no dia a dia |
| [3. Relatório Padrão](parte-3-relatorio-padrao.md) | As colunas "Vencimento", "Prazo final" e "Prazo final vencido" no arquivo do Relatório Padrão | 1 | Pede só o dado da parte 1 |
| [4. Agenda](parte-4-agenda.md) | O marcador do prazo final no dia dele, a opção "Prazo final" na Data e a opção "Marcar o prazo final" na Configuração | 1 | Pede só o dado da parte 1 |
| [5. Tarefa dentro do item](parte-5-tarefa-dentro-do-item.md) | As 2 datas e o selo de vencido na pasta Tarefas do item, e o prazo final no painel da tarefa aberto dali | 1 e 2 | Usa a tabela e o selo da parte 2 |
| [6. Painel de tarefas](parte-6-painel-de-tarefas.md) | Os números "Prazo final vencido" e "Dentro do prazo final", o seletor da Saúde dos prazos, os segmentos da Carga por responsável e as listas do prazo final | 1 | Pede agregação nova no back, então as outras partes não esperam por ela |
| [7. Spaceflow](parte-7-spaceflow.md) | O prazo final como variável, o gatilho de tarefa atualizada e o prazo final nas ações que criam ou alteram tarefa rápida | 1 | Pede só o dado da parte 1 |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN002 | O prazo final segue o esquema de permissões do vencimento, em cada papel e em cada ação. | O papel que só vê o vencimento só vê o prazo final. | Obrigatório |
| RN004 | O prazo final de uma tarefa rápida não pode ser anterior ao vencimento dela. | Vencimento 20/11 e prazo final 20/11 ou 25/11: aceito. Vencimento 20/11 e prazo final 18/11: recusado. | Obrigatório |
| RN005 | Uma tarefa rápida é considerada atrasada quando a data atual passa do vencimento; o prazo final não muda o atraso. | Vencimento 20/11, prazo final 25/11, hoje 22/11: atrasada. | Obrigatório |
| RN006 | Uma tarefa rápida é considerada com o prazo final vencido quando não está concluída e a data atual passa do prazo final. | Vencimento 17/11, prazo final 19/11, hoje 22/11, Em andamento: prazo final vencido. A mesma tarefa concluída: sem o estado. | Obrigatório |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone e caixa de marcar com nome acessível, modal com título e descrição, foco visível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Vencimento | A data planejada para a conclusão; depois dela, a tarefa fica atrasada. Antes se chamava "Data limite" | "Vencimento" |
| Prazo final | A data em que a tarefa precisa estar concluída; não altera o atraso | "Prazo final" |
| Prazo final vencido | O estado da tarefa aberta depois do prazo final (RN006) | "Prazo final vencido" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P4 | O sino e os cartões de tarefas da Home mostram o prazo final? Existe lembrete pelo prazo final? | Produtos | Requisitos novos para o sino e a Home |
| P7 | O campo aparece em todo workspace ou se liga por workspace? | Produtos | Uma configuração por workspace e o que cada tela faz com o campo desligado |
| P11 | Existe o estado "prazo final próximo", antes de vencer? Com quantos dias? O Painel de tarefas usa 7 dias, como a lista "Vencem em breve". | Produtos | Selo e filtro de aviso na parte 2; prazo das listas na parte 6 |

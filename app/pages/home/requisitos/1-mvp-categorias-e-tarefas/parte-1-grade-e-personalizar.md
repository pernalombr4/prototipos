# 1. A grade e o Personalizar

**Objetivo:** a pessoa abre a Home, vê os widgets da Home padrão e arruma a própria Home: muda cada widget de lugar e
de tamanho, adiciona pelo catálogo e remove.

**Onde vale:** a Home do workspace (`/workspaces/<workspace>`).

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "MVP" em "Versão". "Personalizar" fica no topo, ao
lado do botão Criar.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | A disposição da Home vale para 1 pessoa em 1 workspace. | A Home que Renata arrumou em Operações Lumina não muda a Home de Renata em outro workspace nem a de outro membro. | Obrigatório |
| RN002 | Cada widget entra 1 vez na Home. | Com Vencidas na Home, o catálogo mostra "Na Home" no lugar de "Adicionar" para Vencidas. | Obrigatório |

## Topo da Home (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O topo da Home deve mostrar a data de hoje por extenso e a saudação pelo horário com o primeiro nome da pessoa: "Bom dia" até 11:59, "Boa tarde" até 17:59 e "Boa noite" depois. | Exemplo: Renata Alves às 14:30 vê "Boa tarde, Renata!". | Importante | Desejável |
| RF002 | Abaixo da saudação, o topo deve mostrar quantas tarefas da pessoa estão em atraso e quantas vencem hoje. | Exemplo: 2 em atraso e 3 para hoje mostram "Você tem 2 tarefas em atraso e 3 para hoje."; sem nenhuma das 2, "Nenhuma tarefa sua vence hoje.". | Importante | Desejável |

## A Home padrão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF003 | Enquanto a pessoa não arrumou a Home, a Home deve mostrar, nesta ordem: Categorias, Abertas agora, Concluídas, Criadas, Vencidas (número), Vencidas (lista), Vencem em breve, Minhas tarefas e Abertas por status. | No 1º acesso de um membro, a Home mostra os 9 widgets na ordem e no tamanho do protótipo. | Essencial | Obrigatório |
| RF004 | No workspace sem tarefa nem categoria, a Home padrão deve mostrar os mesmos widgets, cada um com o estado vazio dele. | Workspace recém-criado: cada widget aparece no lugar e diz o que falta. | Importante | Obrigatório |
| RF005 | Se a pessoa remove o último widget, a Home deve mostrar "Sua Home está vazia" com o botão "Adicionar widget", que entra no modo de edição com o catálogo aberto. | Remover os 9 widgets mostra o aviso; o botão abre o catálogo. | Importante | Obrigatório |

## Modo de edição (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF006 | O botão "Personalizar" deve pôr a Home em modo de edição, com a barra "Personalizando a Home" fixa no alto da tela enquanto a pessoa rola. | A barra continua visível depois de rolar até o último widget. | Essencial | Obrigatório |
| RF007 | A barra de edição deve ter, nesta ordem: "Adicionar widget", "Concluir", o botão só de ícone "Restaurar padrão" e o botão só de ícone "Cancelar". | Os 2 botões de ícone mostram a dica ao passar o mouse. | Essencial | Obrigatório |
| RF008 | Em modo de edição, cada widget deve mostrar a alça de arraste, "Subir", "Descer", "Configurar" (só no widget que tem configuração) e "Remover". | Abertas agora não mostra "Configurar"; Categorias mostra. | Essencial | Obrigatório |
| RF009 | Em modo de edição, o clique no corpo do widget não deve concluir tarefa, abrir item nem abrir tela. | Clicar numa tarefa de Minhas tarefas em edição não abre a tarefa. | Essencial | Obrigatório |
| RF010 | Arrastar o widget pelo cabeçalho deve mudar o widget de lugar. | Arrastar pelo corpo não move o widget. | Essencial | Obrigatório |
| RF027 | Puxar o canto do widget deve mudar o tamanho, dentro do mínimo e do máximo de colunas e linhas de cada widget. | Os limites de cada widget estão no protótipo; Abertas agora não passa de 6 colunas. | Essencial | Obrigatório |
| RF011 | Pelo teclado, as setas devem mover e redimensionar o widget com foco, com o anúncio da posição ou do tamanho novo ao leitor de tela. | Exemplo: "Vencidas na posição 3 de 9."; "Vencidas com 6 colunas e 6 linhas.". | Importante | Obrigatório |
| RF012 | "Subir" e "Descer" devem trocar o widget de posição com o vizinho, sem arraste. | "Subir" no 1º widget fica desabilitado. | Importante | Obrigatório |
| RF013 | "Concluir" deve sair do modo de edição e guardar a Home (RN001), com o toast "Home salva.". | Recarregar a página mostra a Home como ficou. | Essencial | Obrigatório |
| RF014 | "Cancelar" deve sair do modo de edição e descartar cada mudança feita desde que a pessoa entrou nele. | Mover 2 widgets e cancelar devolve os 2 ao lugar de antes. | Essencial | Obrigatório |
| RF015 | "Restaurar padrão" deve trocar a Home da pessoa pela Home padrão (RF003), sem pedir confirmação, com o toast "Home padrão restaurada." e "Desfazer". | "Desfazer" devolve a Home de antes. | Importante | Obrigatório |

## Catálogo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF016 | "Adicionar widget" deve abrir o painel lateral "Adicionar widget" sem escurecer nem travar a Home. | Com o painel aberto, a pessoa vê o widget novo entrar na Home. | Essencial | Obrigatório |
| RF017 | O 1º nível do catálogo deve mostrar os grupos Tarefas e Itens e categorias, cada um com a descrição e quantos widgets tem. | Tarefas mostra 14 opções; Itens e categorias, 1. | Essencial | Obrigatório |
| RF018 | O 2º nível de Tarefas deve separar os widgets em Números, Listas e Gráficos, com o ícone, o nome, a descrição e "Adicionar" ou o selo "Na Home" de cada widget (RN002). | Abrir Tarefas e voltar com "Voltar" devolve ao 1º nível. | Essencial | Obrigatório |
| RF019 | O campo "Buscar widget" deve procurar pelo nome nos 2 grupos de uma vez. | Exemplo: "venc" mostra Vencidas (número), Vencidas (lista), Vencem em 7 dias e Vencem em breve; sem resultado, "Nenhum widget com esse nome.". | Importante | Obrigatório |
| RF020 | "Adicionar" deve pôr o widget no topo da Home, logo depois de Categorias quando Categorias é o 1º, no tamanho padrão dele. | Adicionar Prioridade com Categorias no topo põe Prioridade na 2ª posição. | Essencial | Obrigatório |

## Menu "⋯" do widget (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | Fora do modo de edição, cada widget deve ter o menu "⋯" com "Configurar" (só no widget que tem configuração), "Tamanho padrão" e "Remover da Home". | O menu abre sem entrar no modo de edição. | Importante | Obrigatório |
| RF022 | "Tamanho padrão" deve voltar o widget ao tamanho com que o widget entra pelo catálogo. | Categorias esticado a 6 linhas volta a 3. | Desejável | Desejável |
| RF023 | "Remover" e "Remover da Home" devem tirar o widget da Home com o toast "<widget> saiu da Home." e "Desfazer". | "Desfazer" devolve o widget à mesma posição e ao mesmo tamanho. | Essencial | Obrigatório |

## Estado de cada widget (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF024 | Cada widget deve carregar o próprio dado de forma independente dos outros. | Com a rota de tarefas lenta, Categorias aparece antes dos widgets de tarefa. | Essencial | Obrigatório |
| RF025 | Se a busca do dado de um widget falha, só esse widget deve mostrar "Não foi possível carregar", "Os outros widgets continuam funcionando." e "Tentar de novo". | Os outros widgets continuam com o dado deles. | Essencial | Obrigatório |
| RF026 | Se a pessoa não tem permissão para o dado de um widget, o widget deve mostrar "Sem acesso" e "Você não tem acesso a <nome>. Peça ao administrador ou remova o widget.". | O menu "⋯" continua com "Remover da Home". | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | No celular, a grade vira 2 colunas e o modo de edição fica disponível, como no protótipo? | produto | RF006 a RF012 valem só no computador |

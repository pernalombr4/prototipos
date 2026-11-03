# 4. Versão só minha

**Objetivo:** a pessoa salva a própria versão de uma visualização de todos, que vale só para ela, e volta à versão de
todos quando quiser.

**Depende de:** 1. Alterações não salvas e salvar.

**Onde vale:** a barra flutuante, a pílula e o menu da visualização, na tela de itens, em Tarefas Rápidas e em Tarefas
Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. Tirar o chip "Status: Em
análise" da visualização "Em análise" mostra a barra flutuante, com "Salvar só para mim" na seta.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN005 | Uma versão "só para mim" vale só para quem a salvou, por cima da versão compartilhada da visualização. | Mikaela salva "Em análise" só para ela com o filtro "Área é Financeiro"; os outros veem "Em análise" sem esse filtro. | Obrigatório |
| RN012 | A visualização do sistema de cada tela ("Itens", "Tarefas Rápidas", "Tarefas Programadas") só recebe alteração como versão "só para mim" ou como visualização nova. | Em "Itens", salvar oferece "Salvar só para mim" e "Salvar como nova visualização". | Obrigatório |

## Salvar só para mim (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF032 | Com a versão só minha, o botão de salvar e a ajuda da barra devem seguir a tabela a seguir, no lugar da tabela da parte "1. Alterações não salvas e salvar", conforme RN011 e RN012; as outras opções da linha ficam na seta. | Owner ou Full em "Em análise" vê "Salvar para todos", com "Salvar só para mim" e "Salvar como nova visualização" na seta. | Essencial | Obrigatório |

| Linha | Visualização ativa | Perfil | Botão principal | Na seta | Ajuda da barra flutuante |
|---|---|---|---|---|---|
| 1 | De todos, fora a do sistema | Owner ou Full | "Salvar para todos" | "Salvar só para mim", "Salvar como nova visualização" | "Salve para tornar esta versão o padrão desta visualização." |
| 2 | De todos | Standard ou Viewer | "Salvar só para mim" | "Salvar como nova visualização" | "Salve para manter esta versão como a sua." |
| 3 | A do sistema | cada perfil | "Salvar só para mim" | "Salvar como nova visualização" | "Salve para manter esta versão como a sua." |
| 4 | Só minha (Quem vê "Só eu") | cada perfil | "Salvar" | "Salvar como nova visualização" | "Salve para tornar esta versão o padrão desta visualização." |

## Versão só minha (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF010 | A pílula que tem versão "só para mim" (RN005) deve mostrar um ícone de pessoa depois do nome, com o nome acessível "Versão só sua". | O tooltip da pílula diz "Você usa a sua versão. Os outros veem a de todos." | Importante | Obrigatório |
| RF161 | O menu da visualização com versão só minha deve ter "Voltar à versão de todos", no grupo "Só para mim", que apaga a versão só minha e mostra a versão compartilhada. | Depois de "Voltar à versão de todos", "Em análise" perde o ícone de pessoa e o filtro "Área é Financeiro". | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI002 | Versão "só para mim" | Deve guardar, por pessoa e por visualização, a versão pessoal (RN005) e permitir apagá-la ("Voltar à versão de todos"). A visualização (`ModelView`) não guarda nada por pessoa hoje. Rota e formato: <a definir>. | Obrigatório |

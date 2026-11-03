# 3. Reordenar e fixar

**Objetivo:** a pessoa põe as visualizações na ordem dela, arrastando na barra ou na lista do "+N", ou pelo teclado, e
fixa no começo as que usa mais. A ordem e as fixadas valem só para ela (RN002).

**Depende de:** 1. Pílulas e lista do "+N"; 2. Menu da visualização e renomear.

**Onde vale:** a barra e a lista do "+N", na tela de itens, em Tarefas Rápidas e em Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN006 | As fixadas ficam juntas logo depois da visualização do sistema, na ordem em que foram fixadas. | "Meus contratos" foi fixada primeiro e fica na posição 2; "Vencendo em 30 dias", fixada depois, fica à direita dela. | Obrigatório |

## Arrastar na barra (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | A pílula deve ser arrastada pela própria pílula, que segue o mouse na horizontal, como as folders. | Não existe cópia translúcida. | Essencial | Obrigatório |
| RF077 | Durante o arrasto, a vizinha deve trocar de lugar quando o centro da pílula arrastada passa da metade da vizinha. | A vizinha desliza antes de a arrastada chegar à borda dela. | Essencial | Obrigatório |
| RF012 | A visualização do sistema deve ficar na posição 1, sem arrastar. | Arrastar "Itens" não faz nada; soltar outra pílula antes de "Itens" a deixa na posição 2. | Essencial | Obrigatório |
| RF013 | Soltar em outro lugar deve gravar a ordem da pessoa (RN002), com Desfazer no aviso (RN010). | O aviso diz "A ordem vale só para você."; Desfazer volta a ordem anterior. | Essencial | Obrigatório |
| RF014 | Soltar no mesmo lugar não deve mostrar aviso nem gravar. | Arrastar e voltar ao lugar não mostra nada. | Importante | Desejável |
| RF015 | O clique que encerra o arrasto não deve abrir a visualização arrastada. | Soltar "Vencidos" em outro lugar mantém a ativa. | Essencial | Obrigatório |
| RF078 | O 1º clique depois de um arrasto, em outro controle, deve funcionar. | Depois de arrastar, o 1º clique no "+N" abre a lista. | Essencial | Obrigatório |

## Arrastar na lista do "+N" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF148 | Cada linha da lista, menos a da visualização do sistema, deve mostrar a alça de arrastar em repouso. | Sem passar o mouse, as alças aparecem; "Itens" não tem alça. | Essencial | Obrigatório |
| RF072 | Arrastar uma linha da lista deve mudar a ordem, com linha-guia no ponto de queda, e gravar a ordem como soltar na barra. | Arrastar "Pessoas" para logo depois de "Itens" põe "Pessoas" na 2ª posição da barra. | Essencial | Obrigatório |
| RF149 | Arrastar uma linha para cima da divisória "Não cabem na barra" deve levar a visualização para a barra. | Arrastar "Jurídico" para antes de "Quadro por status" mostra "Jurídico" na barra. | Essencial | Desejável |
| RF080 | Com a busca da lista preenchida, as linhas não devem arrastar. | Com "jur" na busca, a alça some. | Importante | Obrigatório |

## Fixar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF016 | "Fixar no início" deve levar a visualização para depois da última fixada (RN006) e mostrar um alfinete depois do nome. | Fixar "Vencendo em 30 dias" e depois "Alta prioridade" deixa a ordem Itens, Meus contratos, Vencendo em 30 dias, Alta prioridade. | Essencial | Obrigatório |
| RF017 | "Desafixar" deve tirar o alfinete e levar a visualização para logo depois das que continuam fixadas. | A desafixada fica na 1ª posição depois das fixadas. | Importante | Obrigatório |
| RF150 | A visualização do sistema não deve oferecer "Fixar no início". | O menu de "Itens" não tem "Fixar no início". | Importante | Obrigatório |

## Teclado (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF065 | Ctrl + Shift + seta para a esquerda ou para a direita deve mover a pílula ativa 1 posição e gravar a ordem como soltar na barra. | O foco continua na pílula movida. | Importante | Obrigatório |
| RF085 | Na lista do "+N", Ctrl + Shift + seta para cima ou para baixo deve mover a linha em foco 1 posição. | A lista se reordena só pelo teclado. | Importante | Obrigatório |
| RF068 | Cada mudança de posição deve ser anunciada numa região `aria-live` ("<nome> movida para a posição <N>."). | O anúncio sai ao arrastar, fixar e mover pelo teclado. | Importante | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI003 | Ordem da barra de cada pessoa | Deve guardar a ordem e as fixadas de cada pessoa em cada tela (RN002). A visualização (`ModelView`) não guarda nada por pessoa hoje. Rota e formato: <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Sem "Mover para a esquerda" e "Mover para a direita" (retirados do protótipo), o arrasto fica sem alternativa de 1 clique, que a WCAG 2.2 pede (critério 2.5.7). Ctrl + Shift + seta é teclado, não clique. Qual alternativa entra? | Mikaela | Entra um controle de 1 clique, ou a lacuna fica registrada |

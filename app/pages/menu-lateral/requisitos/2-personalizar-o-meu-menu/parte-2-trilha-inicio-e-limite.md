# 2. Trilha, Início e quantos itens cada seção mostra

**Objetivo:** a pessoa escolhe o que fica na trilha e em que ordem, o que aparece no Início, o que sai do próprio
menu, a ordem das categorias e quantos itens cada seção mostra.

**Depende de:** 1. Preferências guardadas e a janela Personalizar.

**Onde vale:** a trilha, o botão direito da trilha, a grade "Mais", o painel do Início e as abas "Navegação" e
"Início" da janela "Personalizar".

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Fixar uma área com a trilha cheia troca a última área da trilha, que vai para "Mais". | Trilha com 8 ícones: fixar Conhecimento manda Integrações para "Mais". | Obrigatório |
| RN102 | Início não se oculta. | O botão direito em Início não tem "Ocultar do menu". | Obrigatório |
| RN103 | A ordem personalizada das categorias é preferência de cada pessoa, em toda licença. | Membro com licença Basic arrasta as próprias categorias. | Obrigatório |

## Trilha (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | A aba Navegação deve listar as áreas com uma caixa de marcar cada: marcada fica na trilha, desmarcada fica em "Mais". | Desmarcar Auditoria e salvar tira o ícone da trilha. | Essencial | Obrigatório |
| RF102 | Na aba Navegação, o Início deve aparecer marcado e travado, com a dica "O Início fica sempre na trilha. Clicar nele abre a página inicial e este menu." (RN902). | A caixa do Início não desmarca. | Essencial | Obrigatório |
| RF103 | Na aba Navegação, as áreas marcadas devem se reordenar arrastando pela alça e por Alt com as setas. | Arrastar Comercial para cima de Análise e salvar troca a ordem na trilha. | Importante | Obrigatório |
| RF104 | A aba Navegação deve ter "Aparência", com "Somente ícones" e "Ícones e rótulos". | "Somente ícones" tira o nome de baixo dos ícones e põe o nome no `aria-label` de cada um. | Importante | Desejável |
| RF105 | Na grade de "Mais", cada área deve mostrar no hover o alfinete "Fixar na trilha". | Fixar Conhecimento põe o ícone na trilha. | Essencial | Obrigatório |
| RF106 | Quando fixar troca uma área (RN101), o sistema deve avisar quem entrou e quem saiu. | Aviso: "Conhecimento entrou na trilha no lugar de Integrações, que foi para Mais." | Importante | Desejável |
| RF107 | O menu do botão direito de um ícone da trilha deve ganhar "Mover para cima", "Mover para baixo" e "Tirar da trilha", depois de "Copiar link"; o Início não mostra esses itens (RN902). | Botão direito em Comercial mostra os 3; no Início, não. | Essencial | Obrigatório |

## Ocultar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF111 | O botão direito numa linha do menu e num ícone de seção da trilha deve ter "Ocultar do menu", que tira o item do menu da pessoa e avisa "<nome> saiu do menu." (RN102). | Ocultar Políticas internas: a linha some, e a busca "Buscar... Ctrl K" ainda acha. | Essencial | Obrigatório |
| RF112 | Com algum item oculto, o pé do painel deve mostrar "N itens ocultos", que lista os ocultos e devolve cada um ao menu. | Com 1 oculto, o pé diz "1 item oculto". | Essencial | Obrigatório |

## Início (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF121 | A aba Início deve listar os destinos nativos com uma caixa de marcar cada e reordenar arrastando e por Alt com as setas. | Desmarcar Agenda e salvar tira a linha do Início e a põe em "⋯ Mais". | Essencial | Obrigatório |
| RF122 | Quando a pessoa esconde algum destino nativo, o Início deve mostrar a linha "⋯ Mais" depois dos destinos. | Com Agenda escondida, "⋯ Mais" aparece. | Essencial | Obrigatório |
| RF123 | "⋯ Mais" deve abrir ao lado a lista dos destinos escondidos, cada um com o alfinete que o devolve ao Início, e "Personalizar" no pé. | Fixar Agenda devolve a linha ao Início. | Essencial | Obrigatório |
| RF124 | As categorias devem se reordenar arrastando; o primeiro arraste troca a ordem para "Personalizada", que entra no "Ordenar por", e avisa (RN103). | Em "Mais usadas", arrastar Clientes muda a ordem para "Personalizada". | Importante | Desejável |

## Quantos itens a seção mostra (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF131 | O botão direito do título de toda seção deve ter "Mostrar na seção", com "5 itens", "10 itens", "15 itens", "30 itens" e "Todos". | Escolher 5 numa seção com 8 itens mostra 5. | Importante | Obrigatório |
| RF132 | O padrão deve ser "5 itens" em Categorias e "Todos" nas outras seções. | Conta nova: Categorias mostra 5; Comercial mostra cada tela dela. | Importante | Obrigatório |
| RF133 | Seção cortada, fora Categorias, deve terminar com "Mais N", que abre o resto ali mesmo, e depois "Mostrar menos", que volta; Categorias termina com "Ver todas as N categorias". | Seção com 8 e limite 5: "Mais 3". | Importante | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Dados, Configurações e Categorias podem sair do menu da pessoa? No protótipo, Dados e Configurações se desmarcam na aba Navegação, e Categorias tem "Ocultar seção". | produto | RN102 ganha os 3, ou o protótipo tira as opções. |

# 6. Ocultos

**Objetivo:** a pessoa tira da lista o workspace que não usa sem perder o acesso, e o devolve quando quiser.

**Depende de:** 2. Buscar e aceitar convite; 3. Menu "⋯", sair e excluir.

**Onde vale:** o menu "⋯", a barra da lista e o fim da lista da tela `/workspaces`.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces.

## Ocultar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | Ocultar um workspace deve tirá-lo da lista, das abas e das contagens (RN903). | Ocultar um workspace tira 1 da aba "Todos". | Essencial | Obrigatório |
| RF402 | A busca deve procurar também nos workspaces ocultos. | "treinamento" acha o oculto "Treinamento interno 2025". | Essencial | Obrigatório |
| RF403 | O oculto achado pela busca deve mostrar "Oculto": no rodapé do card e em selo na lista. | O card do oculto diz "Oculto" no rodapé. | Importante | Obrigatório |
| RF405 | Depois do separador, o menu "⋯" deve ter "Ocultar da lista" ou, no oculto, "Mostrar na lista". | O rótulo do item muda conforme o workspace está oculto. | Essencial | Obrigatório |
| RF406 | O toast de ocultar pelo "⋯" deve ter "Desfazer", que devolve o workspace ao lugar. | "Desfazer" devolve o workspace ao lugar. | Essencial | Obrigatório |
| RF416 | Ocultar o workspace padrão deve desfazer o padrão (RN904). | Depois de ocultar o padrão, o bloco do topo volta a "Continue de onde você parou". | Essencial | Obrigatório |
| RF417 | Depois de ocultar o padrão, o "Desfazer" deve devolver também o padrão. | Depois do "Desfazer", o bloco do topo volta a dizer "Abre direto quando você entra". | Essencial | Obrigatório |

## Visibilidade (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF407 | A barra deve ter o botão "Visibilidade", entre Ordenar e o alternador. | O rótulo nunca diz "Ocultos": o botão abre o que aparece e o que está oculto. | Essencial | Obrigatório |
| RF408 | Com oculto, o botão "Visibilidade" deve mostrar o número de ocultos. | Ocultar 2 workspaces mostra o contador 2. | Importante | Obrigatório |
| RF409 | O botão "Visibilidade" deve abrir o painel "O que aparece na sua lista", com a busca "Buscar workspace" por nome, sem acento. | O painel abre abaixo do botão, ou acima, se faltar espaço. | Essencial | Obrigatório |
| RF410 | Com oculto, o painel deve ter o botão "Mostrar todos", que devolve os ocultos à lista. | O botão não aparece com 0 ocultos. | Desejável | Desejável |
| RF411 | O painel deve ter 2 seções com contagem, "Na lista ({n})" e "Ocultos ({n})", cada uma em ordem alfabética. | Cada workspace aparece em 1 das 2 seções. | Essencial | Obrigatório |
| RF412 | Cada linha do painel deve ter um botão de olho que mostra ou oculta o workspace com 1 clique e leva a linha para a outra seção. | Clicar no olho tira o card da grade sem fechar o painel. | Essencial | Obrigatório |
| RF413 | O painel deve listar só os workspaces que não são convite pendente. | O convite de Lumen Contábil fica fora do painel. | Importante | Obrigatório |

## Seção "Ocultos" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF414 | Com oculto e sem busca, o fim da lista deve ter a seção "Ocultos ({n})", recolhida ao abrir a tela; a seção aberta mostra os ocultos esmaecidos, com "Mostrar na lista" no "⋯". | "Mostrar na lista" num oculto devolve só aquele; sem oculto, a seção some. | Essencial | Obrigatório |
| RF415 | Na linha da seção, o botão "Mostrar de novo" (1 oculto) ou "Mostrar todos de novo" (mais de 1) deve devolver os ocultos à lista, com "Desfazer" no toast. | Os ocultos voltam à lista, e a seção some. | Desejável | Desejável |

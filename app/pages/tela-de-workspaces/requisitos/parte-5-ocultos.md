# Requisitos: tela de workspaces, parte 5, ocultos

**Objetivo:** a pessoa tira da lista o workspace que não usa sem perder o acesso, e o devolve quando quiser.

**Onde vale:** o menu "⋯", a barra da lista e o fim da lista da tela `/workspaces`.

**Referência visual:** https://pernalombr4.github.io/prototipos/tela-de-workspaces, aprovado em 14/10/2026 e
revisado até 20/10/2026.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

**Épico:** [epico.md](epico.md). Depende da parte 2; segue a RN903 e a RN904.

**Fora do escopo:** a seção "Ocultos" com agrupamento (parte 6, RF514).

## Resumo

| Grupo | O que muda em relação ao develop de 16/09/2026 | Requisitos |
|---|---|---|
| Ocultar | Hoje não existe. Pelo menu "⋯", com "Desfazer" | RF401 a RF406, RF416, RF417 |
| Visibilidade | Botão na barra que abre o painel do olho, como o editor de propriedades do Notion | RF407 a RF413 |
| Seção "Ocultos" | Os ocultos ficam numa seção recolhível no fim da lista | RF414, RF415 |
| Dados | A API passa a guardar os ocultos de cada pessoa | RI401 |

## Ocultar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | Ocultar um workspace deve tirá-lo da lista, das abas e das contagens (RN903). | Ocultar um workspace tira 1 da aba "Todos". | Essencial | Obrigatório |
| RF402 | A busca deve procurar também nos workspaces ocultos. | "treinamento" acha o oculto "Treinamento interno 2025". | Essencial | Obrigatório |
| RF403 | O card de um oculto achado pela busca deve mostrar, à esquerda do rodapé, o ícone de olho cortado e "Oculto". | O card do oculto diz "Oculto" no rodapé. | Importante | Obrigatório |
| RF404 | Na lista, a coluna Workspace de um oculto deve mostrar o selo "Oculto" na 2ª linha. | A linha do oculto mostra o selo. | Importante | Obrigatório |
| RF405 | O menu "⋯" (RF103) deve ter, depois do separador, "Ocultar da lista" (ícone de olho cortado) ou, no oculto, "Mostrar na lista" (ícone de olho). | O rótulo do item muda conforme o workspace está oculto. | Essencial | Obrigatório |
| RF406 | Ocultar pelo "⋯" deve mostrar o toast "{nome} saiu da sua lista", com "Você continua com acesso. Para exibi-lo novamente, use Visibilidade, ao lado de Ordenar, ou a seção Ocultos, no fim da lista." e "Desfazer". | "Desfazer" devolve o workspace ao lugar. | Essencial | Obrigatório |
| RF416 | Ocultar o workspace padrão deve desfazer o padrão (RN904). | Depois de ocultar o padrão, o bloco do topo volta a "Continue de onde você parou". | Essencial | Obrigatório |
| RF417 | Depois de ocultar o padrão, o "Desfazer" do toast (RF406) deve devolver o workspace à lista e o padrão. | Depois do "Desfazer", o bloco do topo volta a dizer "Abre direto quando você entra". | Essencial | Obrigatório |

## Visibilidade (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF407 | A barra deve ter o botão "Visibilidade", com ícone de olho e seta, entre Ordenar e o alternador, visível sem passar o mouse. | O rótulo nunca diz "Ocultos": o botão abre os 2 lados, o que aparece e o que está oculto. | Essencial | Obrigatório |
| RF408 | Com oculto, o botão "Visibilidade" deve ganhar fundo e um contador com o número de ocultos, com o nome acessível "Visibilidade, {n} workspaces ocultos"; sem oculto, o botão fica com borda. | Ocultar 2 workspaces mostra o contador 2. | Importante | Obrigatório |
| RF409 | O botão "Visibilidade" deve abrir um painel de 20rem com o título "O que aparece na sua lista", o texto "Clique no olho para mostrar ou ocultar um workspace. Você continua com acesso aos ocultos." e a busca "Buscar workspace", por nome e sem acento. | O painel abre logo abaixo do botão, ou acima, se faltar espaço. | Essencial | Obrigatório |
| RF410 | Com oculto, o painel deve ter, à direita do título, o botão com borda e ícone de olho "Mostrar todos", que devolve os ocultos à lista. | O botão não aparece com 0 ocultos. | Desejável | Desejável |
| RF411 | O painel deve ter 2 seções com contagem, "Na lista ({n})" primeiro e "Ocultos ({n})" depois, cada uma em ordem alfabética, com rolagem a partir de 18rem. | Os nomes das seções se opõem: o que aparece e o que está oculto. | Essencial | Obrigatório |
| RF412 | Cada linha do painel deve ter o nome do workspace e, à direita, um botão de olho que alterna entre mostrar e ocultar com 1 clique, vale na hora e leva a linha para a outra seção. Olho aberto: aparece na lista. Olho riscado: oculto, com o nome em cinza. O nome acessível é "Ocultar {nome} da lista" ou "Mostrar {nome} na lista". | Clicar no olho de um workspace tira o card da grade sem fechar o painel. | Essencial | Obrigatório |
| RF413 | O painel deve listar só os workspaces que não são convite pendente. | O convite de Lumen Contábil fica fora do painel. | Importante | Obrigatório |

## Seção "Ocultos" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF414 | Com oculto e sem busca, o fim da lista deve ter a seção "Ocultos", depois de um divisor, recolhida ao abrir a tela, com chevron, ícone de olho cortado, "Ocultos" e a contagem em cinza. Aberta, a seção mostra os ocultos como cards (ou linhas, na lista) esmaecidos, com "Oculto" no rodapé e "Mostrar na lista" no "⋯". | Abrir a seção mostra os ocultos; "Mostrar na lista" num deles devolve só aquele. | Essencial | Obrigatório |
| RF415 | Na linha do divisor, à direita, o botão com borda e ícone de olho "Mostrar de novo" (1 oculto) ou "Mostrar todos de novo" (mais de 1) deve devolver os ocultos à lista, com o toast "1 workspace voltou para a lista" ou "{n} workspaces voltaram para a lista" e "Desfazer". | Sem oculto, a seção some. | Desejável | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI401 | Ocultos (rota <a definir>) | A API deve guardar, por pessoa, os workspaces ocultos e devolver a marca na listagem. | Obrigatório |

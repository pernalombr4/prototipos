# Requisitos: tela de workspaces, parte 8, criar com caso de uso

**Objetivo:** ao criar o workspace, a pessoa começa de um caso de uso que já traz menus, categorias e status, ou
escolhe começar do zero.

**Onde vale:** o passo 2 do modal "Criar workspace".

**Referência visual:** https://pernalombr4.github.io/prototipos/tela-de-workspaces, aprovado em 14/10/2026 e
revisado até 20/10/2026. O filtro "Áreas" segue a rodada 29 (RF704 e RF716). A Central tem a cara da central do protótipo `menu-lateral` (padrão da Central de modelos do
ClickUp).

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

**Épico:** [epico.md](epico.md). Depende da parte 7 e do catálogo de casos de uso (RI701). A Central também está nos
protótipos `menu-lateral` e `galeria-de-casos-de-uso` (P902 do épico).

**Fora do escopo:** criar, importar e exportar caso de uso.

## Resumo

| Grupo | O que muda em relação ao develop de 16/09/2026 | Requisitos |
|---|---|---|
| Central de casos de uso | O passo 2 vira a Central, com filtros, busca, áreas e "Criar do zero" | RF701 a RF708, RF716 |
| Detalhe do caso | Prints reais, o que vem junto e "Criar com {caso}" | RF709 a RF713 |
| Concluir | Voltar ao passo 1 e criar | RF714, RF715 |
| Dados | O que cada caso de uso traz | RI701 |

## Central de casos de uso (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF701 | No passo 2, o modal deve ter 72rem de largura e 88% da altura da tela. | O passo 2 ocupa quase a altura da tela. | Importante | Obrigatório |
| RF702 | O passo 2 deve ser a Central de casos de uso, com o progresso "2 de 2", "Quer começar de um caso de uso?" e "Um caso de uso já traz menus, categorias e status prontos. Dá para mudar tudo depois." | O passo abre sem tela em branco e sem a mensagem "Não há dados". | Essencial | Obrigatório |
| RF703 | A lateral esquerda deve ter o título "Casos de uso", as fontes "Destaques" e "Do ENSPACE" com contagem e os filtros em caixas de marcar: "Localidade" ("Brasil" marcado ao abrir, "Estados Unidos", "Global"; sem marca, valem as 3) e "Complexidade" ("Iniciante", "Intermediário", "Avançado"). Em tela estreita, a lateral sai. | Desmarcar Brasil e marcar Estados Unidos mostra só os casos dos Estados Unidos. | Essencial | Obrigatório |
| RF704 | Acima dos cartões, a Central deve ter a busca "Buscar casos de uso" (nome, descrição e área, sem acento) e o botão "Áreas", que abre uma lista suspensa de seleção múltipla com a busca "Buscar área" e a marca de seleção em cada área marcada. A lista fica aberta enquanto a pessoa marca, e o botão mostra num selo a quantidade marcada. | Marcar 2 áreas mostra o selo "2" no botão, com a lista aberta. | Importante | Obrigatório |
| RF716 | O pé da lista de "Áreas" deve ter "Selecionar tudo" e "Limpar", com a contagem "{n} de {total}"; cada ação fica desligada quando não tem o que fazer. | Com as 8 áreas marcadas, "Selecionar tudo" fica desligado e a contagem diz "8 de 8". | Importante | Obrigatório |
| RF705 | Antes dos cartões, a Central deve ter a faixa "Prefere começar do zero?" e "Um workspace vazio, montado por você. É o caminho mais comum.", com o botão com borda "Criar do zero", que cria o workspace vazio. | "Criar do zero" cria o workspace vazio sem abrir caso de uso. | Essencial | Obrigatório |
| RF706 | Cada cartão deve ter, no alto, o 1º print do caso de uso (RF710) e, embaixo, o ícone e o nome. | Cada prévia mostra o conteúdo do próprio caso, e não um desenho genérico. | Essencial | Obrigatório |
| RF707 | Em "Destaques" e sem filtro, a seção "Em destaque" (cartões com estrela) deve vir primeiro; depois, os cartões por área, com a complexidade em selo (Iniciante verde, Intermediário amarelo, Avançado vermelho), 3 por área e "Ver mais {n}" ou "Ver menos". | Uma área com 5 casos mostra 3 e "Ver mais 2". | Importante | Obrigatório |
| RF708 | Sem resultado, a Central deve mostrar "Nenhum caso de uso com esses filtros", "Mude os filtros ou comece do zero: você não perde nada." e "Limpar filtros". | Filtrar por uma área sem caso mostra as 3 frases. | Importante | Obrigatório |

## Detalhe do caso (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF709 | Clicar no cartão deve abrir o detalhe, com "← Casos de uso"; ícone de 64px, nome, complexidade e área; o botão principal "Criar com {caso}"; a galeria de prints do caso (RF710), com setas e pontos; e a "Descrição". | "Criar com Gestão de contratos" cria o workspace com o caso. | Essencial | Obrigatório |
| RF710 | A galeria e a miniatura do cartão devem mostrar **prints reais das telas do workspace que o caso de uso cria** (o menu com as telas, o quadro com os status, o formulário da categoria, o painel), na ordem cadastrada; o 1º print é a miniatura do cartão. No protótipo, os prints são desenhos feitos com o conteúdo do caso, e o produto não usa o desenho. | Cada caso mostra os próprios prints, em ordem; nenhum caso mostra desenho genérico. | Essencial | Obrigatório |
| RF711 | Clicar num print da galeria deve ampliar a imagem. | O print abre ampliado. | Importante | Obrigatório |
| RF712 | O detalhe deve ter "O que vem junto", com blocos que abrem item a item: "Menus e telas" ("{m} menus e {t} telas"), "Categorias e campos" e "Status". | Abrir "Menus e telas" lista os menus e as telas do caso. | Essencial | Obrigatório |
| RF713 | À direita do detalhe, o cartão "Feito pelo ENSPACE" deve mostrar o selo "Verificado", "Revisado pelo time do ENSPACE.", "Criado em", "Usado" ("{n} vezes") e "Localidade". | O cartão mostra os 5 dados do caso. | Desejável | Desejável |

## Concluir (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF714 | O rodapé do passo 2 deve ter "← Voltar", que volta ao passo 1 com o que foi preenchido, e o texto "Escolha um caso de uso ou comece do zero." | Voltar ao passo 1 mantém nome, descrição e referência. | Essencial | Obrigatório |
| RF715 | Ao criar, do zero ou com caso, o modal deve fechar, mostrar o toast "Workspace "{nome}" criado" e levar a pessoa para dentro do workspace novo. | Depois de criar, a pessoa está no workspace novo. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI701 | Catálogo de casos de uso (rota <a definir>) | Deve devolver de cada caso de uso: nome, ícone, área, complexidade, localidades, descrição, destaque, data de criação, número de usos, o que vem junto (menus e telas, categorias e campos, status) e a lista ordenada de prints (RF710). Caso sem print fica fora da Central. | Obrigatório |

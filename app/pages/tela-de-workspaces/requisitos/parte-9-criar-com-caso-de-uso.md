# 9. Criar com caso de uso

**Objetivo:** ao criar o workspace, a pessoa começa de um caso de uso que já traz menus, categorias e status, ou
escolhe começar do zero.

**Depende de:** 8. Criar workspace, passo 1; o catálogo de casos de uso com prints.

**Onde vale:** o passo 2 do modal "Criar workspace".

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces. A Central segue a do protótipo
`menu-lateral` (padrão da Central de modelos do ClickUp).

## Central de casos de uso (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF702 | O passo 2 deve ser a Central de casos de uso, com o título "Quer começar de um caso de uso?". | O passo abre sem tela em branco e sem a mensagem "Não há dados". | Essencial | Obrigatório |
| RF703 | A lateral deve ter as fontes "Destaques" e "Do ENSPACE", com contagem, e os filtros "Localidade" ("Brasil" marcado ao abrir; sem marca, valem as 3) e "Complexidade"; no celular, a lateral sai. | Desmarcar Brasil e marcar Estados Unidos mostra só os casos dos Estados Unidos. | Essencial | Obrigatório |
| RF704 | A Central deve ter a busca "Buscar casos de uso", por nome, descrição e área, sem acento. | "contratos" acha "Gestão de contratos". | Importante | Obrigatório |
| RF716 | O botão "Áreas" deve abrir uma lista de seleção múltipla, com busca, "Selecionar tudo", "Limpar" e "{n} de {total}", que fica aberta enquanto a pessoa marca. | Marcar 2 áreas mostra "2" no botão, com a lista aberta. | Importante | Obrigatório |
| RF705 | Antes dos cartões, a Central deve ter o botão "Criar do zero", que cria o workspace vazio. | "Criar do zero" cria o workspace vazio sem abrir caso de uso. | Essencial | Obrigatório |
| RF706 | Cada cartão deve mostrar o 1º print do caso de uso, o ícone e o nome. | Cada cartão mostra o print do próprio caso. | Essencial | Obrigatório |
| RF707 | Em "Destaques" e sem filtro, a seção "Em destaque" deve vir primeiro; depois, os cartões por área, 3 por área, com "Ver mais {n}". | Uma área com 5 casos mostra 3 e "Ver mais 2". | Importante | Obrigatório |
| RF708 | Sem resultado, a Central deve mostrar "Nenhum caso de uso com esses filtros" e "Limpar filtros". | Filtrar por uma área sem caso mostra a mensagem. | Importante | Obrigatório |

## Detalhe do caso (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF709 | Clicar no cartão deve abrir o detalhe do caso, com "← Casos de uso", o botão principal "Criar com {caso}", a galeria de prints e a descrição. | "Criar com Gestão de contratos" cria o workspace com o caso. | Essencial | Obrigatório |
| RF710 | A galeria e o cartão devem mostrar **prints reais das telas do workspace que o caso de uso cria**, na ordem cadastrada. No protótipo, os prints são desenhos, e o produto não usa o desenho. | Nenhum caso mostra desenho genérico. | Essencial | Obrigatório |
| RF711 | Clicar num print da galeria deve ampliar a imagem. | O print abre ampliado. | Importante | Obrigatório |
| RF712 | O detalhe deve ter "O que vem junto", com "Menus e telas", "Categorias e campos" e "Status", que abrem item a item. | Abrir "Menus e telas" lista os menus e as telas do caso. | Essencial | Obrigatório |
| RF713 | O detalhe deve mostrar o cartão "Feito pelo ENSPACE", com "Verificado", "Criado em", "Usado" ("{n} vezes") e "Localidade". | O cartão mostra os dados do caso. | Desejável | Desejável |

## Concluir (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF714 | "← Voltar" deve levar ao passo 1 com o que foi preenchido. | Voltar ao passo 1 mantém nome, descrição e referência. | Essencial | Obrigatório |
| RF715 | Ao criar, do zero ou com caso, o modal deve fechar e levar a pessoa para dentro do workspace novo. | Depois de criar, a pessoa está no workspace novo. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI701 | Catálogo de casos de uso (rota <a definir>) | Deve devolver de cada caso de uso: nome, ícone, área, complexidade, localidades, descrição, destaque, data de criação, número de usos, o que vem junto (menus e telas, categorias e campos, status) e a lista ordenada de prints. Caso sem print fica fora da Central. | Obrigatório |

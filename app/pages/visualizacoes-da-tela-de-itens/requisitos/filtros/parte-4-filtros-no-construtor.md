# 4. Filtros no construtor de visualização

**Objetivo:** no construtor de visualização, a pessoa monta os filtros da visualização na própria seção Filtros, sem 2º
modal, com a mesma condição e o mesmo construtor de regras da linha de filtros.

**Depende de:** 1. Linha de filtros e chip por campo; 3. Filtro avançado.

**Onde vale:** a seção Filtros do construtor de visualização: o modal "Nova Visualização" de hoje ou o painel
Configurar do épico "Criar, configurar e salvar visualização", ao lado da tabela.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. A seção Filtros fica no
painel Configurar, aberto por "Configurar" no menu da visualização.

## Seção Filtros (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF133 | O 2º modal "Adicionar Filtro" e o 2º modal dos "Filtros Automáticos" devem sair do construtor de visualização. | Adicionar um filtro no construtor não abre modal. | Essencial | Obrigatório |
| RF056 (removido) | As chaves dos filtros automáticos viraram o bloco "Filtros rápidos" da parte 5. | | | |
| RF140 | O grupo "Por campo" deve mostrar cada filtro por campo numa linha, com o campo em cima e a condição e o valor lado a lado, conforme RN008. | Em "Em análise", a linha mostra Status, "É" e "Em análise". | Essencial | Obrigatório |
| RF058 | "Adicionar filtro" deve criar a linha num campo de seleção que ainda não tem filtro. | Com "Status é Em análise", o filtro novo nasce em "Área". | Importante | Obrigatório |
| RF141 | Trocar o campo de uma linha "Por campo" deve recomeçar a condição e o valor. | Trocar "Status" por "Valor do contrato" troca a condição para "Maior ou igual a". | Importante | Obrigatório |
| RF142 | O grupo "Filtro avançado" deve mostrar o construtor do filtro avançado da linha de filtros ou, sem filtro avançado, o botão "Adicionar filtro avançado". | Em "Revisão trimestral", o grupo mostra as 3 regras; em "Itens", o botão. | Essencial | Obrigatório |
| RF143 | No construtor da seção Filtros, o conector de cada regra deve ficar em cima da regra. | Em "Revisão trimestral", cada regra cabe na largura do painel Configurar. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P003 | O filtro rápido do sistema "isOwner" da tela de itens é dono, criador ou responsável? O protótipo escreve "Meus itens", com a ajuda "Itens em que você é o dono.". | Time de back | Muda o nome legível de "isOwner" |

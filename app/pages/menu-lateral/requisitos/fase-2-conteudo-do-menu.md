# Requisitos: fase 2, conteúdo do menu

**Objetivo:** o Início e Dados ganham o que a pessoa usa todo dia: os destinos nativos, os favoritos e as categorias
com teto. O menu para de crescer com o número de categorias.

**Onde vale:** o painel do Início, o painel de Dados, a tela de uma categoria, a tela de Tarefas e a busca da barra do
topo.

**Referência visual:** https://pernalombr4.github.io/prototipos/menu-lateral/, modelo "Trilha e painel". O mapa das 6
fases está em [fases.md](fases.md).

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre
aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.

**Fora do escopo:** o que cada pessoa esconde ou reordena (fase 3), arrastar no menu do workspace (fase 4) e o
conteúdo das telas de Inbox, Chat de IA e Meus relatórios.

## Resumo

| Grupo | O que muda em relação ao menu de hoje | Requisitos |
|---|---|---|
| Destinos nativos do Início | Entram Inbox, Chat de IA e Meus relatórios; o BENI sai de Ajuda e vira Chat de IA | RF101 a RF108 |
| Favoritos | Estrela em cada categoria; a seção só existe depois do primeiro favorito | RF109 a RF113 |
| Categorias | Teto de 5 mais usadas e "Ver todas"; hoje cada categoria soma 1 linha | RF114 a RF121 |
| Tela da categoria e de Tarefas | O terceiro nível do menu vira aba | RF122 a RF124 |
| Busca do workspace | A busca fica na barra do topo, com Ctrl+K | RF125 a RF126 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN101 | Favorito é preferência de cada pessoa: favoritar não muda o menu de mais ninguém. | Ana favorita Contratos; o menu de Bruno não muda. |
| RN102 | A seção Categorias mostra no máximo 5 categorias que não são favoritas, escolhidas pela ordem ativa. | Com 40 categorias e 3 favoritas, a seção mostra 5 linhas e o "Ver todas". |
| RN103 | O contador de um destino nativo só aparece acima de 0. | Inbox com 0 não lidas fica sem número. |
| RN104 | Um relatório conta no número de Meus relatórios quando está pronto e a pessoa ainda não o baixou. | 2 prontos, 1 baixado: o número é 1. |

## Destinos nativos do Início (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF101 | O painel do Início deve mostrar, no topo, os destinos nativos nesta ordem: Início, Inbox, Chat de IA, Tarefas, Agenda, Spaceflows, Documentos, Meus relatórios. | A ordem aparece assim num workspace sem preferência salva. | Essencial |
| RF102 | O Inbox deve mostrar ao lado do nome o número de notificações não lidas (RN103). | Com 6 não lidas, a linha mostra 6; abrir 1 notificação muda para 5. | Essencial |
| RF103 | O Chat de IA deve abrir a tela do BENI. | Clicar em Chat de IA abre o chat. O item "Falar com o BENI" sai de Ajuda. | Essencial |
| RF104 | Meus relatórios deve abrir a tela `/myReports`, que hoje só se alcança pelo link do aviso de extração. | Clicar em Meus relatórios abre a lista de relatórios extraídos. | Essencial |
| RF105 | Meus relatórios deve mostrar ao lado do nome o número de relatórios prontos e não baixados (RN104, RN103). | Extrair 1 relatório: ao ficar pronto, o número sobe 1; baixar baixa 1. | Importante |
| RF106 | Quando a pessoa extrai um relatório, o aviso deve ter o botão "Abrir Meus relatórios", que abre o destino do menu. | Extrair em Contratos e clicar no botão: abre Meus relatórios, com o relatório novo no topo. | Importante |
| RF107 | O título da tela `/myReports` deve ser o nome do menu, "Meus relatórios". | Hoje a tela tem 3 nomes ("Relatórios", "Meus Relatórios" e "Meus Relatórios Emitidos"); passa a ter 1. | Importante |
| RF108 | Destino que ainda não existe no produto deve mostrar o selo "Em breve". | Documentos mostra "Em breve" enquanto a tela não existe. | Desejável |

## Favoritos (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF109 | Cada categoria do menu e da camada "Ver todas" deve ter uma estrela que favorita e desfavorita a categoria (RN101). | Clicar na estrela de Clientes põe Clientes em Favoritos. | Essencial |
| RF110 | A estrela deve aparecer no hover da linha e no foco do teclado; na categoria favorita, a estrela fica visível sem hover. | Pelo Tab, a estrela aparece ao focar a linha. | Importante |
| RF111 | A estrela deve ser um botão irmão da linha, com `aria-pressed`. | O leitor de tela diz se a categoria está favoritada. | Importante |
| RF112 | A seção Favoritos só deve aparecer depois do primeiro favorito, acima de Categorias. | Conta nova: não há seção Favoritos; favoritar a primeira faz a seção aparecer. | Essencial |
| RF113 | Ao favoritar ou desfavoritar, o sistema deve mostrar um aviso com o nome da categoria. | Desfavoritar Clientes mostra "Clientes saiu dos seus favoritos." | Desejável |

## Categorias (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF114 | A seção Categorias deve mostrar as categorias conforme a RN102, com o total ao lado do título. | Com 40 categorias: 5 linhas, e o título mostra "Categorias 40". | Essencial |
| RF115 | A seção Categorias deve terminar com a linha "Ver todas as N categorias", também quando todas já aparecem. | Com 8 categorias, a linha diz "Ver todas as 8 categorias". | Essencial |
| RF116 | "Ver todas as N categorias" deve abrir uma camada com todas as categorias, busca por nome e por descrição, e a estrela de cada uma. | Buscar "reembolso" acha "Solicitações de compra e reembolso". | Essencial |
| RF117 | Se a busca da camada não acha nada, a camada deve dizer que nada foi encontrado para o termo. | Buscar "xyz" mostra o estado vazio com o termo. | Importante |
| RF118 | Ao passar o mouse no título Categorias, o sistema deve mostrar o botão "Ordenar por", com "Mais usadas", "Ordem alfabética", "Criadas recentemente" e "Personalizada". | Trocar para "Ordem alfabética" reordena as 5 linhas na hora. | Importante |
| RF119 | A ordem padrão de Categorias deve ser "Mais usadas". | Conta nova: a seção está em "Mais usadas". | Importante |
| RF120 | Se o workspace não tem categoria, a seção deve mostrar um cartão com "Nenhuma categoria ainda" e a explicação do que é uma categoria. | Workspace novo: o cartão aparece no lugar da lista. | Importante |
| RF121 | Um nome de categoria cortado na largura do painel deve mostrar o nome inteiro no tooltip. | "Solicitações de compra e reembolso" mostra o nome inteiro ao passar o mouse. | Importante |

## Tela da categoria e de Tarefas (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF122 | Ao abrir uma categoria, o sistema deve mostrar os formulários como abas no topo da tela, depois da aba "Todos". | Contratos mostra Todos, Contrato de prestação, Contrato de fornecimento, Aditivo e Distrato. | Essencial |
| RF123 | O menu não deve ter mais o terceiro nível Categoria > Formulário. | Na barra, Contratos é 1 linha, sem seta. | Essencial |
| RF124 | Tarefas deve abrir uma tela com as abas Rápidas e Agendadas, que saem da barra. | Na barra, Tarefas é 1 linha, sem filhos. | Essencial |

## Busca do workspace (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF125 | A barra do topo deve ter o campo "Buscar em tudo", que abre a busca do workspace também pelo atalho Ctrl+K. | Ctrl+K em qualquer tela abre a busca. | Essencial |
| RF126 | A busca do workspace deve achar categorias, destinos nativos, telas dos menus e itens de Configurações, e abrir o que a pessoa escolher. | Buscar "logs" acha Logs de auditoria e Logs de requisição. | Essencial |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI101 | Contagem de notificações não lidas da pessoa | Deve devolver o número que o Inbox mostra. Rota <a definir>. |
| RI102 | Contagem de relatórios prontos e não baixados da pessoa | Deve devolver o número de Meus relatórios. Rota <a definir>. |
| RI103 | Uso de cada categoria pela pessoa | Deve devolver o que ordena "Mais usadas". Rota e medida <a definir>. |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF101 | O tamanho do menu não deve mudar entre 8 e 40 categorias. | Contar as linhas do Início com 8 e com 40 categorias: o mesmo número. | Essencial |
| RT101 | Até o fim da fase 6, o menu novo só deve aparecer em develop (RT001 da fase 1). | Em produção, o menu de hoje continua igual. | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | O nome do destino é "Meus relatórios" ou "Exportações"? O protótipo `meus-relatorios` propõe "Exportações" para a mesma tela. | produto | RF104 a RF107 e o texto do aviso. |
| P102 | O que conta o número de Tarefas? O protótipo mostra um número fixo. | produto | Tarefas ganha uma RN como a RN103. |
| P103 | O que conta o Inbox: não lidas ou não resolvidas? | produto | RN103 muda a regra de zerar. |
| P104 | O Chat de IA abre uma tela ou um painel por cima da tela atual? | produto | RF103 muda o comportamento do clique. |
| P105 | O teto de 5 categorias deve ser fixo ou preferência da pessoa? A fase 3 já tem "Mostrar na seção" com 5, 10, 15, 30 e Todos. | produto | RN102 passa a ler a preferência. |
| P106 | Quantas categorias tem o maior workspace de produção? Com mais de 150, a camada "Ver todas" pode precisar de agrupamento. | dado de produção | RF116 ganha agrupamento ou carregamento por partes. |
| S101 | Suposição: "Mais usadas" mede o uso da própria pessoa. | produto | RN102 e RI103 mudam de pessoa para workspace. |

# Requisitos: visualizações personalizadas (barra e construtor)

**Objetivo:** a pessoa troca, cria, ajusta e organiza visualizações sem sair da lista, enxerga todas com a tela apertada e decide se o que mudou vale para todos ou só para ela.

**Onde vale:** na tela nova de itens de cada categoria (`/workspaces/<ws>/types/<categoria>`) e, com a mesma lógica, nas visualizações de Tarefas Rápidas (`/tasks/quick`) e de Tarefas Agendadas (`/tasks/scheduled`, título "Tarefas Programadas"). As diferenças de parâmetro estão no grupo "Tarefas Rápidas e Agendadas".

**Referência visual:** protótipo `visualizacoes-da-tela-de-itens`, estilo Proposta, rodadas 1 a 5 de 23/10/2026. Prints em `evidencias/proposta-*.jpg`, `r2-*.jpg`, `r3-*.jpg`, `r4-*.jpg` e `r5-*.jpg`; as referências do ClickUp e do Notion em `evidencias/ref-clickup-*.jpg` e `ref-notion-*.jpg`; a tela de hoje em `evidencias/develop-*.jpg`.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre aspas são os da interface em português. Medidas ficam a cargo do front; o requisito descreve o comportamento.

**Fora do escopo:** a casca da tela, a barra de ferramentas (busca, período, ícones, "Novo registro"), a tabela e o cartão do quadro do `EnKanbanBoard`.

## Resumo

| Grupo | O que muda em relação à branch do PR 2936 (23/10/2026) | Requisitos |
|---|---|---|
| Regras de negócio | Perfis, versão só minha, ordem pessoal e ordem padrão, visualização do sistema | RN001 a RN006 |
| Barra | Pílula com corte pela largura, tooltip organizado em partes e sem contagem, "+N" com a ativa sempre na barra, "+ Visualização" | RF001 a RF010, RF111 |
| Arrastar e fixar | Arrastar na barra e no "+N", fixadas juntas no começo | RF011 a RF017, RF077, RF078 |
| Menu da visualização | Seta ⌄ na ativa, botão direito, grupos "Só para mim" e "Para todos" | RF018 a RF024 |
| Renomear | Na própria pílula | RF025 a RF028, RF079 |
| Lista do "+N" | Editor de todas as visualizações: busca, divisória das que não cabem, arrastar, renomear na linha, sem contagem | RF070 a RF073, RF080, RF119 a RF123 |
| Mudança não salva | Ponto na pílula e barra flutuante na base com salvar e X | RF029 a RF035, RF086, RF087 |
| Ordem padrão | "Aplicar minha ordem para todos" e "Recuperar a ordem padrão" | RF036 a RF039 |
| Criar | "+ Visualização" abre o catálogo de tipos; o tipo escolhido cria uma visualização genérica com o painel aberto | RF040, RF041, RF043 a RF047, RF081, RF082, RF088 a RF093 |
| Painel Configurar | Painel ao lado da tabela, ao vivo, sem 2º modal, rótulos legíveis | RF048 a RF062, RF083 |
| Teclado e acessibilidade | Setas, F2, Shift + F10, Ctrl + Shift + seta, anúncio ao leitor de tela | RF063 a RF069, RF084, RF085 |
| Filtros | Chip por campo, filtro avançado com E, Ou e grupos, "+ Filtro" com busca, menu da coluna | RN007, RF094 a RF110, RF112 a RF118 |
| Tarefas Rápidas e Agendadas | A mesma lógica, com campos, agrupamento e filtros automáticos próprios | RF074 a RF076 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN001 | A visualização do sistema de cada tela (Itens, Tarefas Rápidas, Tarefas Programadas) não pode ser excluída, renomeada nem alterada para todos. | Em Itens, o menu mostra Excluir desligado com a explicação; salvar oferece só "Salvar só para mim" e "Salvar como nova visualização". |
| RN002 | A ordem da barra e as fixadas são de cada pessoa. | Mikaela arrasta "Vencidos" para o começo; os outros membros continuam vendo a ordem padrão. |
| RN003 | A ordem padrão é a ordem que vale para quem não mudou a própria ordem. Só Owner ou Full pode mudar a ordem padrão. | Owner aplica a ordem dele para todos; quem nunca reordenou passa a ver essa ordem. |
| RN004 | A tabela a seguir define o que cada perfil pode fazer. Política: Única. | Linha 3: Standard ou Viewer salva só para si. |
| RN005 | Uma versão "só para mim" vale só para quem a salvou, por cima da versão de todos da mesma visualização. | Mikaela salva "Em análise" só para ela com o filtro "Área é Financeiro"; os outros veem "Em análise" sem esse filtro. |
| RN006 | As fixadas ficam juntas logo depois da visualização do sistema, na ordem em que foram fixadas. | "Meus contratos" foi fixada primeiro e fica na posição 1; "Vencendo em 30 dias", fixada depois, fica à direita dela. |
| RN007 | Os filtros automáticos, os filtros por campo e o filtro avançado de uma visualização valem juntos: o item aparece só quando passa nos 3. | "Status é Em análise" no chip e "Área é Jurídico" no filtro avançado mostram só os itens em análise do Jurídico. |

| Linha | Ação | Owner ou Full | Standard ou Viewer |
|---|---|---|---|
| 1 | Criar visualização para todos ou para grupos e funções | sim | não |
| 2 | Criar visualização só para si | sim | sim |
| 3 | Salvar mudança numa visualização de todos | para todos ou só para si | só para si |
| 4 | Renomear e excluir visualização de todos | sim | não |
| 5 | Renomear e excluir visualização que é só sua | sim | sim |
| 6 | "Abrir primeiro para todos" | sim | não |
| 7 | "Aplicar minha ordem para todos" e "Recuperar a ordem padrão" | sim | não |
| 8 | Reordenar, fixar e desafixar na própria barra | sim | sim |
| 9 | Configurar, Duplicar e Copiar link | sim | sim |

## Barra (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF001 | Cada visualização deve aparecer como pílula com o ícone e o nome, sem traço embaixo (o traço é a marca das folders). | Barra de visualizações e barra de folders não se confundem lado a lado. | Essencial |
| RF002 | A pílula ativa deve ter fundo suave na cor de destaque, texto em negrito na cor de texto forte e o ícone na cor de destaque. | O texto da ativa passa de 4,5:1 sobre o fundo dela (RNF001). | Essencial |
| RF003 | O nome da pílula deve ser cortado pela largura máxima da pílula, com reticências, e não por número de letras. | "Revisão trimestral dos contratos de fornecedores estratégicos" aparece como "Revisão trimestral do..." | Essencial |
| RF004 | O tooltip da pílula deve mostrar, nesta ordem: o nome inteiro e a descrição; o tipo e quem vê em etiquetas (mais "Versão só sua" e "Alterações não salvas" quando valem); "Agrupado por" no Kanban; "Filtros" com 1 etiqueta por filtro; "Ordenação" com 1 etiqueta por nível e a seta da direção; no rodapé, "Arraste para reordenar" e "Clique duas vezes para renomear". O tooltip não mostra contagem de itens. | "Vencendo em 30 dias" mostra Tabela, Todos veem, as etiquetas "Vencimento nos próximos 30 dias" e "Status não é Vencido" e a etiqueta "Vencimento" com a seta para cima. | Importante |
| RF111 | No tooltip, o filtro avançado com "E" deve entrar parte por parte, como filtros a mais; com "Ou", as partes ficam separadas por "ou". O grupo de dentro vai numa etiqueta, entre parênteses. | "Revisão trimestral" mostra "Valor do contrato maior ou igual a R$ 60.000" e "(Status é Aprovado ou Assinado ou Prioridade é Alta)". | Importante |
| RF005 | Quando as pílulas não couberem na largura da barra, o botão "+N ⌄" deve mostrar N igual ao número de visualizações que ficam fora da barra. | Com todas visíveis, o botão mostra só a seta "⌄" (RF119). | Essencial |
| RF006 | Em cada largura de tela, a visualização ativa deve aparecer na barra, no lugar da última pílula que cabia quando a ativa estiver depois do corte. | Abrir pela lista do "+N" uma visualização que não cabe a traz para a barra. | Essencial |
| RF007 | O botão da lista ("+N ⌄" ou "⌄") e o "+ Visualização" devem vir logo depois da última pílula visível, sem rolagem horizontal, como no Notion e no ClickUp. | Com 4 visualizações na tela larga, os 2 botões ficam colados em "Vencendo em 30 dias"; com a tela estreita, os 2 continuam visíveis. | Essencial |
| RF008 | O botão de criar deve mostrar "+ Visualização" com o tooltip "Nova visualização". | O tooltip aparece ao parar o mouse no botão. | Importante |
| RF009 | A visualização ativa deve ir para o endereço da página (`?view=<referência>`). | Recarregar mantém a visualização; o link leva direto a ela. | Importante |
| RF010 | A pílula que tem versão "só para mim" (RN005) deve mostrar um ícone de pessoa depois do nome. | O tooltip da pílula diz "Você usa a sua versão. Os outros veem a de todos." | Importante |

## Arrastar e fixar (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF011 | A pílula deve ser arrastada pela própria pílula, que segue o mouse na horizontal, como as folders. | Não existe cópia translúcida. | Essencial |
| RF077 | Durante o arrasto, a vizinha deve trocar de lugar quando o centro da pílula arrastada passar da metade da vizinha. | A vizinha desliza antes de a arrastada chegar à borda dela. | Essencial |
| RF012 | A visualização do sistema deve ficar na posição 1, sem arrastar. | Arrastar "Itens" não faz nada; soltar outra pílula antes de "Itens" a deixa na posição 2. | Essencial |
| RF013 | Soltar em outro lugar deve gravar a ordem da pessoa (RN002) e mostrar "Ordem das visualizações salva." com "A ordem vale só para você." e o botão Desfazer. | Desfazer volta a ordem anterior. | Essencial |
| RF014 | Soltar no mesmo lugar não deve mostrar aviso nem gravar. | Arrastar e voltar ao lugar não mostra nada. | Importante |
| RF015 | O clique que encerra o arrasto não deve abrir a visualização arrastada. | Soltar "Vencidos" em outro lugar mantém a ativa. | Essencial |
| RF078 | O 1º clique depois de um arrasto, em outro controle, deve funcionar. | Depois de arrastar, o 1º clique no "+N" abre a lista. | Essencial |
| RF016 | "Fixar no início" deve levar a visualização para depois da última fixada (RN006) e mostrar um alfinete depois do nome. | Fixar "Vencendo em 30 dias" e depois "Alta prioridade" deixa a ordem Itens, Meus contratos, Vencendo em 30 dias, Alta prioridade. | Essencial |
| RF017 | "Desafixar" deve tirar o alfinete e levar a visualização para logo depois das que continuam fixadas. | A desafixada fica na 1ª posição depois das fixadas. | Importante |

## Menu da visualização (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF018 | A pílula ativa deve mostrar uma seta ⌄ depois do nome, que abre o menu da visualização. | A seta aparece só na ativa e acompanha a pílula no arrasto. | Essencial |
| RF019 | O botão direito em cada pílula deve abrir o menu de RF018 para aquela visualização, sem trocar a visualização ativa. | Botão direito numa pílula não ativa mostra o menu dela. | Essencial |
| RF020 | O 1º grupo do menu deve ter Renomear (com o atalho F2), Configurar, Duplicar e Copiar link, conforme RN004. | Standard ou Viewer não vê Renomear numa visualização de todos. | Essencial |
| RF021 | O grupo "Só para mim" deve ter Fixar no início ou Desafixar, "Voltar à versão de todos" (quando existe versão só minha) e, para Owner ou Full, "Recuperar a ordem padrão". | Standard ou Viewer vê só Fixar no início. | Essencial |
| RF022 | O grupo "Para todos" deve aparecer só para Owner ou Full, com "Abrir primeiro para todos", "Aplicar minha ordem para todos" e Excluir. | Standard ou Viewer não vê o grupo. | Essencial |
| RF023 | Na visualização do sistema e na que abre primeiro, Excluir deve aparecer desligado com a explicação, conforme RN001. | Não abre modal de recusa. | Importante |
| RF024 | Excluir deve pedir confirmação num modal com o título "Excluir a visualização <nome>?", o texto "A visualização sai da barra de todos os membros. Os itens continuam na categoria." e o botão "Excluir visualização" em vermelho. | Cancelar mantém a visualização. | Essencial |

## Renomear (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF025 | Clique duplo na pílula, F2 ou Renomear no menu deve trocar a pílula por um campo com o nome selecionado, conforme RN004. | O campo aparece no lugar da pílula. | Importante |
| RF026 | Enter ou sair do campo deve gravar o nome. | O nome novo aparece na pílula. | Importante |
| RF079 | Esc no campo de renomear deve desistir e voltar o nome anterior. | O nome não muda. | Importante |
| RF027 | Se o nome já existir na categoria, o sistema deve manter o nome anterior e avisar "Já existe uma visualização chamada <nome>. O nome anterior foi mantido." | Renomear "Vencidos" para "Compras" mostra o aviso. | Importante |
| RF028 | Gravar o nome deve mostrar "Visualização renomeada para <nome>." com Desfazer. | Desfazer volta o nome anterior. | Desejável |

## Lista do "+N" (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF070 | A lista do "+N" deve ter busca ("Pesquisar visualização...") e, na ordem da barra, o ícone e o nome inteiro de cada visualização da tela, as da barra e as que não cabem, sem contagem de itens. | Digitar filtra; sem resultado, aparece "Nenhuma visualização encontrada." | Essencial |
| RF071 | Cada linha da lista deve mostrar a alça de arrastar em repouso e o "⋯" do menu só no hover ou no foco da linha. | Sem passar o mouse, as alças aparecem e os "⋯" não. | Essencial |
| RF072 | Arrastar uma linha da lista deve mudar a ordem, com linha-guia no ponto de queda e a gravação de RF013. | Arrastar "Pessoas" para o topo da lista a põe antes de "Jurídico". | Essencial |
| RF080 | Com a busca da lista preenchida, as linhas não devem arrastar. | Com "jur" na busca, a alça some. | Importante |
| RF073 | Para Owner ou Full, o rodapé da lista deve ter "Aplicar minha ordem para todos" e "Recuperar a ordem padrão" (RF036 a RF039). | Standard ou Viewer não vê o rodapé. | Essencial |
| RF119 | O botão da lista deve existir mesmo sem visualização fora da barra, só com a seta "⌄" e o nome acessível "Todas as visualizações". | Com 4 visualizações na tela larga, a seta abre a lista com as 4. | Essencial |
| RF120 | Sem busca, a lista deve mostrar a divisória "Não cabem na barra" antes da 1ª visualização que não cabe. Arrastar uma linha para cima da divisória leva a visualização para a barra. | Arrastar "Jurídico" para antes de "Quadro por status" mostra "Jurídico" na barra. | Essencial |
| RF121 | A linha da visualização aberta deve aparecer destacada, com o ícone na cor primária e a marca de aberta; a linha da visualização do sistema não arrasta. | "Itens" fica sem alça, sempre na 1ª linha. | Importante |
| RF122 | O clique duplo no nome de uma linha, ou "Renomear" no "⋯" da linha, deve abrir o campo de renomear na própria linha, com a lista aberta e a gravação de RF025 a RF028. | Renomear "Vencidos" para "Contratos vencidos" muda a linha e a pílula e mostra "Desfazer". | Importante |
| RF123 | O fim da lista deve ter "Nova visualização", que fecha a lista e abre o catálogo de RF040. | Clicar em "Nova visualização" mostra Tabela e Kanban. | Importante |

## Mudança não salva (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF029 | Quando a pessoa muda filtro, ordenação ou coluna da visualização ativa, pela linha de filtros, pelo cabeçalho da tabela ou pelo painel, o sistema deve guardar a mudança como rascunho, sem gravar. | Recarregar a página desfaz o rascunho (P006). | Essencial |
| RF030 | A visualização com rascunho deve mostrar um ponto na cor de alerta: na seta ⌄ quando ativa, depois do nome quando não ativa e na linha do "+N". | Trocar de visualização mantém o ponto na que ficou com rascunho. | Essencial |
| RF031 | Enquanto existir rascunho na visualização ativa e o painel estiver fechado, o sistema deve mostrar uma barra flutuante centrada na base da tela com "Você alterou <nome>", a ajuda, Descartar e o botão de salvar com seta (RF032). | Aplicar "Área é Financeiro" em "Em análise" mostra a barra. | Essencial |
| RF032 | O botão de salvar deve seguir a tabela a seguir; as outras opções da linha ficam na seta. | Owner ou Full em "Em análise" vê "Salvar para todos", com "Salvar só para mim" e "Salvar como nova visualização" na seta. | Essencial |
| RF033 | Com o painel aberto, a barra flutuante não deve aparecer: salvar e descartar ficam só no rodapé do painel, com a seta de RF032. | A ação de salvar nunca aparece em 2 lugares. | Essencial |
| RF034 | A linha de filtros abaixo da barra de ferramentas deve mostrar, nesta ordem: os filtros automáticos em etiqueta com X, 1 chip por filtro por campo (RF096), o chip "N regras" do filtro avançado (RF100) e "+ Filtro" (RF094). | Mudar qualquer um cria rascunho (RF029). | Importante |
| RF035 | Descartar deve voltar a visualização ao que estava salvo e mostrar "Alterações descartadas." | O ponto e a barra flutuante somem. | Essencial |
| RF086 | A barra flutuante deve ter um X com o tooltip "Fechar sem salvar. O ajuste continua aplicado para você.", que fecha a barra e mantém o rascunho aplicado. | Fechar a barra depois de retirar "Status é Em análise" mantém os 48 itens na tabela e o ponto na pílula. | Essencial |
| RF087 | Depois do X, a barra flutuante deve voltar quando a pessoa fizer outra mudança na mesma visualização. | Ordenar por Fornecedor depois do X mostra a barra de novo. | Importante |

| Linha | Visualização ativa | Perfil | Botão principal | Na seta | Ajuda da barra flutuante |
|---|---|---|---|---|---|
| 1 | De todos (não é a do sistema) | Owner ou Full | "Salvar para todos" | "Salvar só para mim", "Salvar como nova visualização" | "Salve para tornar esta versão o padrão desta visualização." |
| 2 | De todos | Standard ou Viewer | "Salvar só para mim" | "Salvar como nova visualização" | "Salve para manter esta versão como a sua." |
| 3 | A do sistema | qualquer | "Salvar só para mim" | "Salvar como nova visualização" | "Salve para manter esta versão como a sua." |
| 4 | Só minha | qualquer | "Salvar" | "Salvar como nova visualização" | "Salve para tornar esta versão o padrão desta visualização." |

## Ordem padrão (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF036 | "Aplicar minha ordem para todos" deve gravar a ordem da pessoa como ordem padrão (RN003) e mostrar "Sua ordem agora é a de todos." com Desfazer. | Desfazer volta a ordem padrão anterior. | Essencial |
| RF037 | "Recuperar a ordem padrão" deve trocar a ordem da pessoa pela ordem padrão, desafixar as fixadas e mostrar "Ordem padrão recuperada." com Desfazer. | Desfazer volta a ordem e as fixadas da pessoa. | Essencial |
| RF038 | As 2 ações devem ficar desligadas quando a ordem da pessoa é igual à ordem padrão. | Sem reordenar nada, as 2 aparecem desligadas. | Importante |
| RF039 | As 2 ações devem aparecer só para Owner ou Full (RN004, linha 7). | Standard ou Viewer não as vê no menu nem no "+N". | Essencial |

## Criar (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF040 | "+ Visualização" deve abrir o catálogo "Nova visualização" com os tipos Tabela e Kanban, cada um com ícone, nome e 1 linha de descrição, e as caixas "Só para mim" e "Fixar no início". | Abrir o catálogo não cria nada; fechar o catálogo deixa a barra como estava. | Essencial |
| RF041 | Escolher o tipo deve criar a visualização na hora, com o nome do tipo, abri-la e abrir o painel em modo de criação, com o título "Nova visualização". | Escolher Kanban mostra a pílula "Kanban" ativa e o quadro agrupado por Status. | Essencial |
| RF042 | (removido na rodada 4: "Começar de" saiu; a visualização nova nasce genérica, RF081 e RF088) | | |
| RF081 | A Tabela nova deve começar com cada coluna da categoria, sem filtro e sem ordenação. | A tabela mostra os 48 itens e cada coluna. | Essencial |
| RF088 | O Kanban novo deve começar agrupado por Status, sem filtro e sem ordenação, com o cartão sem etiqueta (P008). | O texto de apoio aparece inteiro em cada cartão. | Essencial |
| RF089 | Se o nome do tipo já existir na categoria, a visualização nova deve receber o nome do tipo com o próximo número livre. | Criar 2 Tabelas seguidas dá "Tabela" e "Tabela 2". | Importante |
| RF090 | Com "Só para mim" marcado, a visualização nova deve nascer com "Só eu" em Quem vê; desmarcado, com "Todos do workspace". | Owner que cria sem marcar vê "Todos do workspace" no painel. | Essencial |
| RF091 | Para Standard ou Viewer, "Só para mim" deve vir marcado e desligado, com o tooltip "Seu perfil cria visualizações só para você." (RN004, linha 2). | Standard vê a caixa marcada e não consegue desmarcar. | Essencial |
| RF092 | Com "Fixar no início" marcado, a visualização nova deve nascer fixada, depois da última fixada (RF016). | Com Itens e Meus contratos fixadas, o Kanban novo fica na 3ª posição. | Importante |
| RF043 | O campo Nome do modo de criação deve vir em foco, com o nome do tipo selecionado, e ser obrigatório. | Digitar troca o nome inteiro. | Essencial |
| RF082 | A pílula em criação deve mostrar o nome enquanto a pessoa digita. | Digitar "Contratos por etapa" muda a pílula na hora. | Importante |
| RF093 | No modo de criação, cada ajuste do painel deve entrar direto na visualização nova, sem rascunho, sem o estado "Alterações não salvas" e sem o botão de salvar. | O rodapé mostra só "Descartar visualização" e "Concluir". | Essencial |
| RF044 | Se a pessoa concluir com o Nome vazio, o sistema deve mostrar "Informe um nome." no campo e devolver o foco ao campo Nome. | O painel continua aberto. | Essencial |
| RF045 | Se o nome já existir na categoria, o sistema deve mostrar "Já existe uma visualização com este nome." no campo. | O painel continua aberto. | Essencial |
| RF046 | "Concluir", Enter no campo Nome ou o X do painel deve manter a visualização, fechar o painel e mostrar "Visualização <nome> criada." | A pílula fica com o nome dado. | Essencial |
| RF047 | "Descartar visualização", no rodapé do painel ou no menu da pílula em criação, deve apagar a visualização em criação e voltar para a visualização de onde a pessoa saiu. | Nada fica gravado e a pílula de origem volta ativa. | Essencial |

## Painel Configurar (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF048 | Configurar deve abrir o painel à direita da tabela, que encolhe para o painel caber sem cobrir os itens. | Os itens continuam visíveis com o painel aberto. | Essencial |
| RF049 | Cada ajuste no painel deve aparecer na tabela ou no quadro na hora, como rascunho (RF029). | Adicionar o filtro "Área é Financeiro" reduz a tabela sem salvar. | Essencial |
| RF050 | Com o painel aberto, trocar de pílula deve mostrar no painel a configuração da nova ativa. | Trocar para "Acima de R$ 100 mil" mostra o filtro de valor. | Importante |
| RF051 | As seções do painel devem ficar separadas por linha, com o rótulo em cima de cada campo: Nome (com o ícone no mesmo grupo) e Descrição; Exibição; Cartão (no Kanban) ou Colunas (na Tabela); Filtros; Ordenação; Quem vê. | Nenhum campo fica empurrado por rótulo ao lado. | Essencial |
| RF052 | Exibição deve ter Tabela e Kanban; no Kanban, "Agrupar por" com os campos de seleção da categoria. | Trocar para Kanban mostra o quadro agrupado por Status. | Essencial |
| RF053 | No Kanban, a seção Cartão deve ter "Título do cartão", "Texto de apoio", "Etiquetas", "Pessoa" e "Data", gravados no cartão da visualização. | Escolher "Prioridade" em Etiquetas mostra a prioridade em cada cartão. | Essencial |
| RF054 | Na Tabela, Colunas deve listar as visíveis na ordem da tabela, com alça de arrastar, subir e descer e o olho para ocultar, e as ocultas embaixo, com o desenho de linha das visíveis e o olho riscado para mostrar. | Ocultar "Área" tira a coluna da tabela na hora. | Essencial |
| RF055 | Cada campo deve aparecer pelo rótulo e pelo ícone do tipo, sem o nome técnico do tipo ("inputText", "EnlCalendar"). | Nenhum nome técnico aparece no painel. | Essencial |
| RF056 | Filtros deve ter os filtros automáticos como chaves com nome legível ("Só itens meus", "Só itens dos meus grupos"); "Por campo", com cada filtro numa linha (o campo em cima, a condição e o valor lado a lado) e "Adicionar filtro"; e "Filtro avançado", com o construtor de RF100 a RF104 ou o botão "Adicionar filtro avançado". No painel, o conector de cada regra vai em cima dela. Nada abre 2º modal. | No painel, o filtro de "Revisão trimestral" aparece com o grupo, e cada regra cabe na largura do painel. | Essencial |
| RF057 | A condição e o valor devem seguir o tipo do campo: seleção e pessoa com "É" e "Não é" (1 ou mais opções), "Está vazio" e "Está preenchido"; texto com "Contém", "É", "Está vazio" e "Está preenchido"; valor com "Maior ou igual a", "Menor ou igual a" e "É"; data com "Nos próximos" (dias), "A partir de", "Até", "Está vazio" e "Está preenchido". | Filtro de Vencimento oferece "Nos próximos" com dias. | Importante |
| RF058 | "Adicionar filtro" deve criar o filtro num campo de seleção que ainda não tem filtro. | Com "Status é Em análise", o filtro novo nasce em "Área". | Importante |
| RF059 | Ordenação deve aceitar mais de 1 nível ("Ordenar por", "Depois por"), cada nível com campo e direção. | Ordenar por Vencimento e depois por Valor aplica os 2 níveis na tabela (RI001). | Importante |
| RF083 | No Kanban, o título da seção Ordenação deve ser "Ordem dos cartões em cada coluna". | Trocar para Kanban troca o título. | Desejável |
| RF060 | Quem vê deve ter "Todos do workspace", "Só eu" e "Grupos e funções"; com "Grupos e funções", a escolha de grupos e de funções. | Escolher "Só eu" grava a visualização como só minha. | Essencial |
| RF061 | Para Standard ou Viewer, "Todos do workspace" e "Grupos e funções" devem aparecer desligados, com a nota "Só Owner e Full mudam quem vê uma visualização de todos. As suas alterações ficam só para você." | Ao criar, "Só eu" vem marcado. | Essencial |
| RF062 | O rodapé do painel deve ter o estado ("Alterações não salvas" ou "Tudo salvo"), Descartar e o botão de salvar de RF032; no modo de criação, "Descartar visualização" e "Concluir" (RF093). | Sem rascunho, Descartar e salvar ficam desligados. | Essencial |

## Teclado e acessibilidade (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF063 | A barra deve ter `role="tablist"` com o rótulo "Visualizações", e cada pílula `role="tab"`, com ativação manual (Enter ou Espaço abre). | O leitor de tela anuncia "Visualizações, lista de abas". | Essencial |
| RF064 | Setas para a esquerda e para a direita devem mover o foco entre as pílulas visíveis, sem abri-las. | O conteúdo não muda enquanto o foco anda. | Essencial |
| RF065 | Ctrl + Shift + seta para a esquerda ou para a direita deve mover a pílula ativa 1 posição, com a gravação de RF013. | O foco continua na pílula movida. | Importante |
| RF066 | F2 deve renomear a pílula ativa (RF025). | O campo de renomear abre sem mouse. | Importante |
| RF084 | Shift + F10 deve abrir o menu da pílula ativa. | O menu abre sem mouse. | Importante |
| RF067 | Na lista do "+N", as setas para cima e para baixo devem andar entre as linhas, e Enter abre a visualização da linha em foco. | Dá para abrir uma visualização escondida só pelo teclado. | Importante |
| RF085 | Na lista do "+N", Ctrl + Shift + seta para cima ou para baixo deve mover a linha em foco 1 posição. | Dá para reordenar a lista só pelo teclado. | Importante |
| RF068 | Toda mudança de posição deve ser anunciada numa região `aria-live` ("<nome> movida para a posição <N>."). | O anúncio sai ao arrastar, fixar e mover pelo teclado. | Importante |
| RF069 | O ponto de mudança não salva e o ícone de versão só minha devem ter nome acessível ("Alterações não salvas", "Versão só sua"). | O leitor de tela lê os 2. | Importante |

## Filtros (RF)

Referência: o filtro do Notion (chip por campo e filtro avançado, `evidencias/ref-notion-*.jpg`) e o do ClickUp (`ref-clickup-4-filtros.jpg`), explorados em 23/10/2026.

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF094 | "+ Filtro" deve listar cada campo da categoria com o ícone do tipo e a busca "Filtrar por..." e, no fim, "Filtro avançado", com a contagem de regras quando o filtro avançado existe. | Digitar "ven" deixa só "Vencimento". | Essencial |
| RF095 | Escolher um campo sem chip em "+ Filtro" deve criar o chip do campo e abri-lo. | Escolher "Área" em "Em análise" cria e abre o chip "Área". | Essencial |
| RF112 | Escolher em "+ Filtro" um campo que já tem chip deve abrir o chip existente. | Escolher "Status" em "Em análise" abre o chip "Status: Em análise". | Importante |
| RF096 | O chip deve mostrar o campo e o que está escolhido ("Status: Em análise, Aprovado") e abrir um painel com o campo e a condição no topo e, em seleção e pessoa, as opções em caixas, com busca a partir de 7 opções e "Limpar seleção". | Marcar "Aprovado" em "Em análise" mostra os itens em análise e os aprovados. | Essencial |
| RF097 | O chip sem valor escolhido não deve filtrar. | "Filtrar" na coluna "Área" cria o chip "Área"; a tabela não muda. | Importante |
| RF113 | O chip sem valor escolhido deve aparecer tracejado, só com o nome do campo. | O chip "Área" recém-criado aparece tracejado. | Desejável |
| RF098 | O "⋯" do chip deve ter "Excluir filtro" e "Levar para o filtro avançado". | Os 2 itens aparecem no "⋯" de cada chip. | Importante |
| RF114 | "Levar para o filtro avançado" deve mover a regra para o fim do filtro avançado, criar o filtro avançado quando não existe e abri-lo. | Levar "Status: Em análise, Aprovado" deixa o chip "1 regra" com a mesma tabela. | Importante |
| RF099 | Os filtros devem valer conforme RN007. | O chip "Área: Jurídico" junto com "3 regras" mostra só os itens do Jurídico que passam nas 3 regras. | Essencial |
| RF100 | O filtro avançado deve mostrar "Onde" na 1ª linha; na 2ª, a escolha "E" ("Todas as regras precisam valer.") ou "Ou" ("Pelo menos 1 regra precisa valer."), que vale para o grupo inteiro; da 3ª em diante, o conector em texto. | Trocar "E" por "Ou" na 2ª linha troca o texto da 3ª. | Essencial |
| RF101 | Cada regra deve ter campo, condição, valor (RF057) e "⋯" com "Duplicar", "Transformar em grupo" e "Excluir"; cada grupo, "⋯" com "Duplicar", "Desfazer o grupo" e "Excluir". | "Desfazer o grupo" devolve as regras do grupo para o lugar dele. | Importante |
| RF102 | "Adicionar regra" deve oferecer "Adicionar regra" e "Adicionar grupo" ("Um grupo junta regras com E ou Ou."). O grupo fica num fundo próprio, tem conector próprio e só tem regras (S003). | Dentro do grupo, "Adicionar regra" não oferece grupo. | Essencial |
| RF103 | A regra sem valor não deve contar no resultado, nem dentro de um grupo "Ou". | Um grupo "Ou" com "Área é Jurídico" e uma regra de Status sem opção mostra só o Jurídico. | Essencial |
| RF104 | O grupo que fica sem regra deve sair do filtro avançado. | Excluir a única regra de um grupo tira o grupo. | Importante |
| RF115 | O filtro avançado sem regra deve sair quando o painel do filtro avançado fecha. | Excluir a única regra e fechar tira o chip "N regras". | Importante |
| RF116 | "Excluir filtro avançado" deve apagar cada regra e cada grupo do filtro avançado. | O chip "N regras" sai da linha de filtros. | Importante |
| RF105 | Trocar o campo de uma regra deve recomeçar a condição e o valor. | Trocar "Status" por "Valor do contrato" troca a condição para "Maior ou igual a". | Importante |
| RF117 | Trocar a condição entre "É" e "Não é" deve manter as opções marcadas. | "Status é Aprovado" vira "Status não é Aprovado". | Importante |
| RF106 | O botão Filtros da barra de ferramentas deve mostrar a linha de filtros, mesmo sem filtro, com "+ Filtro" aberto. | Em "Itens", o botão abre a lista de campos. | Importante |
| RF107 | O botão direito ou Shift + F10 no título de uma coluna deve abrir o menu da coluna, ancorado no título, com "Ordenar crescente", "Ordenar decrescente", "Filtrar" e "Ocultar coluna" (P009). | O menu de "Área" abre logo abaixo do título "Área". | Importante |
| RF108 | "Filtrar" no menu da coluna deve abrir o chip do campo da coluna (RF095). | "Filtrar" em "Área" abre o chip "Área" com as 5 áreas. | Importante |
| RF109 | "Ocultar coluna" deve tirar a coluna da visualização. | Ocultar "Área" tira a coluna e a mostra entre as ocultas no painel. | Importante |
| RF118 | "Ordenar crescente" e "Ordenar decrescente" devem ordenar a tabela pela coluna do menu. | "Ordenar decrescente" em "Valor do contrato" põe o maior valor em cima. | Importante |
| RF110 | Toda mudança da linha de filtros e do menu da coluna deve virar rascunho (RF029) e mostrar a barra flutuante (RF031). | Marcar uma opção no chip mostra "Você alterou <nome>". | Essencial |

## Tarefas Rápidas e Agendadas (RF)

A barra e o construtor dessas 2 telas são os mesmos da tela de itens (conferido na branch do PR 2936 em 23/10/2026: a mesma barra, o mesmo modal "Nova Visualização" com Tabela e Kanban, Filtros, Visibilidade e Ordenação). As diferenças são de parâmetro, não de lógica.

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF074 | As telas Tarefas Rápidas e Tarefas Agendadas devem seguir RN001 a RN007, RF001 a RF123, RI001 a RI006 e RNF001 a RNF002, com os parâmetros da tabela a seguir. | Os prints e critérios de aceite deste documento valem trocando os parâmetros. | Essencial |
| RF075 | Os filtros automáticos das tarefas devem aparecer como chaves com os nomes que a tela já usa: "Minhas Tarefas", "Aberto", "Atrasado", "Atribuídos", "Tarefas Externas", "Tarefas Internas". | Nenhum filtro automático abre 2º modal. | Essencial |
| RF076 | Os campos das tarefas devem aparecer pelo rótulo e pelo ícone do tipo, sem o nome técnico (hoje: "EnlNumber", "radioButton", "EnAssignees", "EnHtml", "inputSwitch", "hidden"), conforme RF055. | Nenhum nome técnico aparece no painel. | Essencial |

| Parâmetro | Itens | Tarefas Rápidas | Tarefas Agendadas |
|---|---|---|---|
| Visualização do sistema (RN001) | Itens | Tarefas Rápidas | Tarefas Programadas |
| Campos de coluna, filtro e ordenação | os campos da categoria | ID, Nome, Criado em, Data limite, Status, Permissões, Responsável, Responsável externo, Colaboradores, Prioridade, Descrição | ID, Status da Tarefa, Status de SLA, Responsáveis, Tipo, Referência do Item, Tarefa, Título, Descrição, Criado em, Data Limite, Concluído em, Concluído por, Nome do Fluxo, Etapa do Fluxo, Status do Item |
| "Agrupar por" no Kanban | os campos de seleção da categoria | Status, Responsável, Prioridade | Status da Tarefa |
| Filtros automáticos | "Só itens meus", "Só itens dos meus grupos" | os 6 de RF075 | os 6 de RF075 |
| Endereço | `/types/<categoria>?view=` | `/tasks/quick?view=` | `/tasks/scheduled?view=` |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI001 | Visualização (`ModelView`) | Deve guardar a ordenação com mais de 1 nível (lista de campo e direção); hoje guarda 1 campo (`defaultColumnSortField` e `sortOrder`). Formato: <a definir>. |
| RI002 | Versão "só para mim" | Deve guardar, por pessoa e por visualização, a versão pessoal (RN005) e permitir apagá-la ("Voltar à versão de todos"). Rota e formato: <a definir>. |
| RI003 | Ordem da barra | Deve guardar a ordem e as fixadas de cada pessoa (RN002) e a ordem padrão da tela (RN003). Rota e formato: <a definir>. |
| RI004 | Visualização que abre primeiro | Deve marcar 1 visualização por tela com `default` e devolvê-la ao abrir a tela sem `?view=`. |
| RI005 | Visualização (`ModelView`), filtros | Deve guardar o filtro avançado (grupo com conector E ou Ou e regras, com grupo dentro de grupo em 1 nível) e as condições "é" e "não é" com 1 ou mais opções (`in` e `nin` com lista). Hoje guarda só `field_filters`, uma lista em que cada filtro vale junto com os outros; a busca da API já aceita `_where` com `_and` e `_or`. Formato: <a definir>. |
| RI006 | `EnTable` do SDK (`@be-enlighten/enspace-sdk-ui`) | Deve ter um slot de cabeçalho por coluna (`header-{key}`) para o gatilho visível do menu da coluna; hoje tem só `cell-{key}`, `actions`, `empty` e `pagination`. |

## Não funcionais (RNF)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF001 | O texto da pílula ativa deve ter contraste de pelo menos 4,5:1 sobre o fundo dela (WCAG 2.2, critério 1.4.3), nos temas claro e escuro. | No protótipo, o texto escuro dá 16,65:1; o rosa sobre rosa claro dava 2,88:1 e foi trocado. | Essencial |
| RNF002 | A barra, o painel e a barra flutuante devem funcionar em português, inglês e espanhol sem texto cortado nos botões. | Conferir os 3 idiomas no andaime do protótipo. | Importante |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Sem "Mover para a esquerda/direita" (retirado na rodada 2), o arrasto fica sem alternativa de 1 clique sem arrastar, que a WCAG 2.2 pede (critério 2.5.7). Qual alternativa entra? | Mikaela | Entra um controle de 1 clique, ou a lacuna fica registrada. |
| P002 | "Abrir primeiro para todos" vale para o workspace inteiro ou por pessoa? O protótipo assume o workspace. | Mikaela e produto | Muda RI004 e o texto do menu. |
| P003 | O filtro automático "isOwner" da tela de itens é dono, criador ou responsável? O protótipo escreve "itens em que você é o dono". | Time de back | Muda o rótulo de RF056. |
| P004 | Quantas visualizações uma categoria tem nos clientes? O protótipo testa 1, 4 e 18. | Dado de uso | Com dezenas, a busca do "+N" vira o caminho principal. |
| P005 | Duplicar, na tela de hoje, mostrou "(copy)", a coluna "reference" e o aviso "Visualização editada com sucesso", e depois de 2 Duplicar seguidos a 1ª cópia sumiu. Hipótese, sem contraprova: o 2º Duplicar grava por cima da cópia anterior. | QA da tela de itens | Se confirmado, é defeito a corrigir antes desta entrega. |
| P006 | O rascunho (RF029) deve sobreviver a recarregar a página? O protótipo zera. | Mikaela | Muda RF029 e RI002. |
| P007 | O menu chama a tela de "Agendadas" e o título dela diz "Tarefas Programadas". Qual nome fica? | Mikaela | Muda o nome da visualização do sistema na tabela de parâmetros. |
| P008 | Quais campos o cartão do Kanban novo mostra em cada categoria? O protótipo usa Fornecedor, Valor do contrato, Responsável e Vencimento, escolhidos à mão. O cartão do `EnKanbanBoard` tem altura fixa: com título, texto de apoio, etiqueta, pessoa e data, o texto de apoio some (já visível em `r3-cartao-kanban.jpg`). | Mikaela e time de front | Define a regra de escolha dos campos e se o cartão cresce com o conteúdo. |
| P009 | O menu da coluna precisa de um gatilho visível (a seta no título ao passar o mouse, como no Notion)? O protótipo usa só botão direito e Shift + F10, porque o `EnTable` não tem slot de cabeçalho (RI006). | Mikaela e time de front | Com gatilho visível, o SDK ganha o slot de RI006. |
| S001 | Standard ou Viewer pode criar, renomear e excluir visualização que é só sua (RN004, linhas 2 e 5). | Mikaela confirma | Se não puder, o "+ Visualização" some para esse perfil. |
| S003 | O filtro avançado tem grupo dentro de grupo em só 1 nível; o Notion aceita mais. 1 nível cobre "A e (B ou C)" e mantém o filtro legível. | Mikaela confirma | Com mais níveis, "Transformar em grupo" e "Adicionar grupo" passam a valer dentro do grupo. |
| S002 | Recuperar a ordem padrão também desafixa, porque fixar faz parte da ordem pessoal (RF037). | Mikaela confirma | Se não, as fixadas ficam no começo depois de recuperar. |

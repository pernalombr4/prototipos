# Requisitos: tela Exportações (hoje "Meus Relatórios")

**Objetivo:** quem extrai um relatório baixa o arquivo sem caçar a tela. O aviso de extração termina com o botão
Baixar, a tela fica sempre no menu lateral e cada linha diz o que o arquivo é.

**Onde vale:** tela `/workspaces/<ws>/myReports`, o menu lateral, o aviso que aparece depois de escolher o formato
do relatório e o sino.

**Referência visual:** protótipo navegável em https://pernalombr4.github.io/prototipos/meus-relatorios/, aprovado em
14/10/2026 e revisado até a rodada 7 (19/10/2026). Código, textos nos 3 idiomas e decisões em
https://github.com/pernalombr4/prototipos/tree/main/app/pages/meus-relatorios. A barra inferior do protótipo
(estado, nome, tema, idioma) é ferramenta de revisão e não entra no produto.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.

**Fora do escopo:** a tabela de itens, a de tarefas, o ícone "Extrair Relatório", o menu "Relatório Padrão" e o
modal "Formato de extração" (Excel, CSV, DBF) continuam como estão.

## Resumo

| Grupo | O que muda em relação ao develop de 14/10/2026 |
|---|---|
| Nome (RN) | 1 nome só, Exportações, no lugar dos 4 nomes de hoje |
| Menu lateral (RL) | A tela vira item fixo do menu, com o estado (gerando, prontos não vistos) |
| Aviso de extração (RA) | O aviso acompanha a geração e termina com Baixar, na mesma aba; hoje some em 5 s e o link abre outra aba |
| Sino (RS) | Hoje não avisa. Passa a guardar o aviso de pronto e de erro |
| Barra da tela (RB) | Busca, período, Limpar filtros e Colunas |
| Colunas (RC) | Tabela nova, com 8 colunas de dado; hoje 5 de 8 colunas mostram "-" |
| Filtro e ordenação (RF) | Filtro no cabeçalho de toda coluna de dado; ordenação nas de texto, número e data |
| Menu da linha (RM) | Logo depois do checkbox, com Baixar dentro |
| Popover de filtros (RP) | Os filtros aplicados em frase, no hover; hoje são JSON num modal |
| Seleção e rodapé (RR) | Seleção em massa com Baixar e Excluir; paginação de 15 |
| Painel (RD) | Hoje não existe. O clique na linha abre o painel com os dados e o botão Baixar |
| Ações (RO) | Baixar, Extrair novamente, Abrir na origem, Copiar link, Excluir com Desfazer |
| Formatação (RT) | Data com hora, tamanho legível e nome de arquivo legível |
| Estados (RE) | Carregando, vazio, erro e sem resultado |
| Dados (RI) | O que a API já tem e o que precisa acrescentar |
| Componentes e acessibilidade (RK) | Tabela, tema, idioma, movimento e teclado |

## Nome (RN)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RN-01 | A tela deve se chamar "Exportações" (EN "Exports", ES "Exportaciones"). | O nome aparece igual no item do menu, na trilha, na aba da tela, no título da aba do navegador e nos avisos. |
| RN-02 | Os nomes de hoje ("Meus Relatórios Emitidos", "Meus Relatórios", "Relatórios", "My Reports") devem sair. | Nenhum deles aparece em tela nenhuma. |
| RN-03 | A rota pode continuar `/workspaces/<ws>/myReports`. | Link antigo continua abrindo a tela. |

## Menu lateral (RL)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RL-01 | O item deve ficar na seção Membro, entre Agenda e Knowledge, com o ícone `i-lucide-file-down` e sem chevron. | 1 clique no item abre a tela. |
| RL-02 | O item deve ficar realçado quando a tela está aberta, como os outros itens. | Com a tela aberta, o item tem o fundo e a cor de item ativo. |
| RL-03 | Com relatório na fila ou gerando, o item deve mostrar um ícone girando (`i-lucide-loader-circle`, cor info) à direita do rótulo. | O ícone some quando nenhum relatório está na fila ou gerando. O leitor de tela lê "Relatório gerando". |
| RL-04 | O item deve mostrar um contador, selo sólido na cor primária, com os relatórios que ficaram prontos enquanto a pessoa estava fora da tela. | Extrair em Contratos e esperar ficar pronto mostra "1". O leitor de tela lê "1 relatório pronto para baixar". |
| RL-05 | O contador deve zerar ao abrir a tela. Baixar um relatório deve tirá-lo da conta. | Abrir a tela some com o selo. |
| RL-06 | Com o menu recolhido, um ponto de 8 px no canto do ícone deve avisar: cor info pulsando quando há relatório gerando; cor primária quando há pronto não visto. | O tooltip do ícone recolhido mostra "Exportações". |

## Aviso de extração (RA)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RA-01 | Depois de escolher o formato, deve aparecer o aviso "Gerando o relatório de <origem>", com o texto "Pode continuar trabalhando. Avisamos aqui quando ficar pronto.", ícone girando e cor info. | O aviso não some sozinho enquanto o relatório gera. O aviso verde de hoje não aparece. |
| RA-02 | O aviso de geração deve ter o botão "Ver em Exportações" (outline, neutro). | O clique abre a tela na mesma aba, com o painel daquele relatório aberto. |
| RA-03 | Quando o relatório fica pronto, o mesmo aviso deve se atualizar no lugar para "Relatório pronto", texto "<origem>, <N> registros.", ícone `i-lucide-circle-check` e cor success. | Não aparece um segundo aviso. |
| RA-04 | O aviso de pronto deve ter os botões "Baixar" (primário) e "Ver em Exportações" (outline). | Baixar baixa o arquivo sem sair da tela atual. |
| RA-05 | O aviso de pronto deve sumir em 12 s, com barra de tempo. | A barra esvazia e o aviso fecha. |
| RA-06 | Quando a geração falha, o aviso deve mostrar "Erro ao gerar o relatório" e "O relatório de <origem> não foi gerado. O motivo está em Exportações." | "Ver em Exportações" abre o painel com o motivo. |
| RA-07 | O e-mail de relatório pronto deve continuar. | O e-mail chega como hoje. |

## Sino (RS)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RS-01 | Relatório pronto deve gerar a notificação "Seu relatório de <origem> está pronto", com `i-lucide-file-down` na cor primária. | A notificação aparece no topo da lista do sino. |
| RS-02 | Relatório com erro deve gerar a notificação "Erro ao gerar o relatório de <origem>", com `i-lucide-circle-alert` na cor error. | A notificação aparece no topo da lista do sino. |
| RS-03 | Cada notificação deve mostrar quando chegou: "agora", "há N min" ou "há N h". | O tempo avança sem recarregar. |
| RS-04 | A notificação não lida deve ter texto mais forte e ponto na cor primária à direita. | Depois de lida, o texto fica normal e o ponto some. |
| RS-05 | O clique na notificação deve marcá-la como lida, abrir a tela e abrir o painel do relatório. | O painel mostra o relatório da notificação. |
| RS-06 | Baixar o relatório deve marcar a notificação dele como lida. "Marcar todas como lidas" deve marcar todas. | Nenhum ponto de não lida sobra. |

## Barra da tela (RB)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RB-01 | A tela deve ter 1 aba, com o nome da tela e o ícone `i-lucide-file-down`, sem "+ Visualizar". | A aba aparece realçada, como a aba de itens da tabela nova. |
| RB-02 | A barra deve ter o campo de busca sem borda, placeholder "Pesquisar relatórios", ícone de lupa e X para limpar quando há texto. | O X aparece só com texto digitado. |
| RB-03 | A busca deve procurar, sem diferenciar acento nem maiúscula, no nome do relatório, na descrição, na origem, na visualização, no nome do arquivo e no campo e valor de cada filtro aplicado. | "vigencia" acha o relatório com filtro "Fim da vigência". |
| RB-04 | A barra deve ter "Criado em" com o menu de período: Todo o período (padrão), Hoje, Últimos 7 dias, Últimos 30 dias, Últimos 90 dias. O período conta a partir da 0h do dia de início. | Com período escolhido, o botão fica realçado (variante soft). |
| RB-05 | "Limpar filtros" (ícone `i-lucide-filter-x`) deve aparecer quando há busca, período ou filtro de coluna, e limpar tudo. | Depois do clique, a lista volta inteira e o botão some. |
| RB-06 | O botão "Colunas", à direita, deve ligar e desligar Origem, Formato, Registros, Filtros e Tamanho. | Seleção, menu da linha, Relatório, Status e Criado em não aparecem na lista. |
| RB-07 | Status, Origem e Formato não devem ter filtro na barra: o filtro deles é o da coluna (RF). | A barra mostra só busca, período, Limpar filtros e Colunas. |

## Colunas (RC)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RC-01 | A tabela deve ter, nesta ordem e com esta largura de partida: Seleção (44 px), Menu da linha (48 px), Relatório (320), Status (160), Origem (210), Formato (110), Registros (128), Filtros (140), Tamanho (120), Criado em (180). | As colunas aparecem nessa ordem e o nome da origem não corta em 12 letras. |
| RC-02 | Relatório deve mostrar o ícone do formato num quadrado de 32 px: XLSX `i-lucide-file-spreadsheet` cor success; CSV `i-lucide-file-text` cor info; DBF `i-lucide-database` neutro. | O quadrado tem fundo da mesma cor, em 10% de opacidade. |
| RC-03 | Relatório deve mostrar o nome do modelo do construtor de relatórios, ou "Relatório Padrão", e embaixo a descrição do modelo, em 1 linha cortada, com o texto inteiro no `title`. | Sem descrição, aparece só o nome. "Relatório Padrão" aparece em cor mais apagada (`text-toned`) que o nome de modelo. O nome da visualização não aparece na coluna. |
| RC-04 | Status deve mostrar um selo subtle: Na fila (`i-lucide-clock`, neutro), Gerando (`i-lucide-loader-circle` girando, info), Pronto (`i-lucide-circle-check`, success), Falhou (`i-lucide-circle-alert`, error). | Gerando mostra "Gerando 64%" e uma barra de progresso de 96 px embaixo do selo. |
| RC-05 | Origem deve mostrar o ícone e o nome da categoria ou da lista: Tarefas Rápidas com `i-lucide-clipboard-list`, Tarefas Agendadas com `i-lucide-calendar-check`. | Nome longo corta, com o texto inteiro no `title`. |
| RC-06 | Formato deve mostrar um selo outline, monoespaçado, em maiúsculas. | XLSX, CSV ou DBF. |
| RC-07 | Registros deve ficar à direita, com separador de milhar do idioma. | "118.420". Sem arquivo, mostra "-" apagado. |
| RC-08 | Filtros deve mostrar o selo soft "1 filtro" ou "N filtros", com ícone de filtro, ou "Sem filtro" apagado. | O hover no selo abre o popover (RP). |
| RC-09 | Tamanho deve ficar à direita, no formato de RT-03. | Sem arquivo, mostra "-". |
| RC-10 | Criado em deve mostrar a data curta (RT-01). | "Hoje, 15:20". |
| RC-11 | O clique em qualquer ponto da linha que não seja botão, checkbox ou popover deve abrir o painel (RD). | O cursor vira mão sobre a linha. |
| RC-12 | A ordem padrão deve ser Criado em, do mais novo para o mais antigo. | O relatório extraído agora aparece na 1ª linha. |
| RC-13 | Status e progresso devem mudar sozinhos na tabela, no painel e no menu, sem recarregar e sem botão de atualizar. Um relatório gera por vez; os outros ficam "Na fila". | "Na fila" vira "Gerando" quando o da frente fica pronto. |

## Filtro e ordenação (RF)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF-01 | Toda coluna de dado deve ter o funil (`i-lucide-funnel`) logo depois do nome, com o tooltip "Filtrar <coluna>". | Seleção e Menu da linha não têm funil. |
| RF-02 | O clique no funil deve abrir o filtro num popover de 256 px, com o nome da coluna em maiúsculas no topo e "Limpar" à direita quando o filtro está ativo. | "Limpar" desfaz só o filtro daquela coluna. |
| RF-03 | Com filtro ativo, o funil deve ficar na cor primária (variante soft). | Dá para ver quais colunas estão filtradas sem abrir nada. |
| RF-04 | Relatório deve filtrar por "Contém o texto", no nome ou na descrição, sem diferenciar acento nem maiúscula. | "auditoria" deixa só "Contratos para auditoria". |
| RF-05 | Status deve filtrar por caixas: Na fila, Gerando, Pronto, Falhou. | Marcar Falhou deixa só os que falharam. |
| RF-06 | Origem deve filtrar por caixas com as origens da lista, cada uma com o seu ícone. Depois de 256 px de altura, a lista rola. | Só aparecem origens que existem na lista. |
| RF-07 | Formato deve filtrar por caixas: XLSX, CSV, DBF. | Marcar CSV deixa só os CSV. |
| RF-08 | Registros deve filtrar por Mínimo e Máximo, em campos numéricos sem botões de mais e menos. Relatório sem registros sai quando há limite. | Mínimo 1.000 deixa só os de 1.000 registros ou mais. |
| RF-09 | Filtros deve filtrar por caixas: Com filtro, Sem filtro. | Marcar Sem filtro deixa só os que mostram "Sem filtro". |
| RF-10 | Tamanho deve filtrar por caixas: Até 100 KB, De 100 KB a 1 MB, Acima de 1 MB. | Marcar Acima de 1 MB deixa só os maiores. |
| RF-11 | Criado em deve filtrar pelo período, em opções de rádio, com o mesmo estado do período da barra (RB-04). | Mudar na coluna muda na barra, e o contrário. |
| RF-12 | Os filtros devem se somar: E entre colunas, OU entre as caixas de uma coluna. Mudar qualquer filtro deve voltar à página 1. | Status Pronto com Formato CSV deixa só os CSV prontos. |
| RF-13 | Relatório, Origem, Registros, Filtros, Tamanho e Criado em devem ordenar pelo clique no nome da coluna. Status e Formato não ordenam: são categorias. | O nome de Status e de Formato não é clicável. |
| RF-14 | Texto e número devem ordenar em 3 cliques: crescente, decrescente, volta à ordem padrão (RC-12). Criado em começa do mais novo para o mais antigo. Filtros ordena pela quantidade de filtros. | O ícone mostra o estado: `arrow-up-down` sem ordem, `arrow-up-narrow-wide` crescente, `arrow-down-wide-narrow` decrescente, na cor primária quando ativo. |

## Menu da linha (RM)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RM-01 | O menu ⋮ deve ficar na 2ª coluna, logo depois do checkbox, e abrir alinhado à esquerda. | O menu não aparece no fim da linha. |
| RM-02 | O 1º grupo deve ter a ação principal: "Baixar" (`i-lucide-download`) quando está Pronto; "Tentar novamente" (`i-lucide-rotate-cw`) quando Falhou. Na fila e Gerando não têm esse grupo. | Baixar não aparece solto na tabela. |
| RM-03 | O 2º grupo deve ter "Ver detalhes", "Extrair novamente", "Abrir na origem" e "Copiar link". | "Extrair novamente" sai quando Falhou e fica desabilitado em Na fila e Gerando. "Copiar link" aparece só quando está Pronto. |
| RM-04 | O 3º grupo deve ter "Excluir" (`i-lucide-trash-2`), em vermelho. | Excluir fica separado das outras ações. |

## Popover de filtros (RP)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RP-01 | O popover deve abrir com o mouse sobre o selo da coluna Filtros, em 150 ms, e fechar em 120 ms. Não deve ser tooltip. | Dá para levar o mouse para dentro do popover e clicar nele. |
| RP-02 | O popover deve abrir embaixo do selo, alinhado ao início, com 12 px de folga da borda da tela. | Na última linha visível, o popover não sai da tela. |
| RP-03 | O popover deve ter 384 px de largura e altura máxima de 24rem ou 70% da tela, o que for menor. A lista deve rolar por dentro. | Com 20 filtros, o título continua visível e a lista rola. |
| RP-04 | O topo deve mostrar "FILTROS APLICADOS" e a quantidade à direita. | "20" no relatório com 20 filtros. |
| RP-05 | Cada filtro deve ocupar 1 linha: o campo num selo cortado em 160 px, a condição inteira ("é", "contém", "entre", "antes de", "depois de", "está vazio") e o valor em destaque, cortado. O texto inteiro deve ficar no `title` da linha. | Valor longo não quebra a linha. |
| RP-06 | O rodapé deve ficar fixo, fora da rolagem, com "Ordenação: <campo, sentido>" em até 2 linhas e o link "Ver todos os detalhes", que abre o painel. | O rodapé continua visível ao rolar a lista. |

## Seleção e rodapé (RR)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RR-01 | O checkbox do cabeçalho deve marcar e desmarcar as linhas da página e ficar parcial quando só parte da página está marcada. | Marcar 2 de 15 deixa o checkbox do cabeçalho parcial. |
| RR-02 | Ao marcar a 1ª linha, deve subir uma barra flutuante, centralizada embaixo, com "N selecionados", "Baixar", "Excluir" e o X "Limpar seleção". | A barra some quando a seleção zera. |
| RR-03 | "Baixar" na barra deve baixar só os prontos selecionados e ficar desabilitado quando nenhum selecionado está pronto. | Com 1 pronto e 1 com erro marcados, baixa 1 arquivo. |
| RR-04 | "Excluir" na barra deve excluir todos os selecionados (RO-07). Relatório excluído deve sair da seleção. | A barra some depois de excluir. |
| RR-05 | O rodapé deve mostrar à esquerda "N de M selecionado(s)", em que M é o total depois dos filtros, e à direita a paginação com primeira, anterior, páginas, próxima e última. | Filtrar muda o M. |
| RR-06 | Cada página deve ter 15 relatórios. | A 16ª linha aparece na página 2. |

## Painel (RD)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RD-01 | O painel deve abrir à direita, com até 28rem de largura e sem fundo escuro. | A tabela continua visível e clicável; clicar em outra linha troca o conteúdo do painel. |
| RD-02 | O cabeçalho deve ter o ícone do formato num quadrado de 40 px, "Detalhes do relatório" em texto pequeno, o nome do relatório (1 linha, cortado), a descrição do modelo (até 2 linhas) quando existe e o X para fechar. | O X fecha o painel. |
| RD-03 | O bloco de ação deve começar pelo selo de status e pela data curta. | Os 4 status aparecem com o selo de RC-04. |
| RD-04 | Pronto deve mostrar o nome do arquivo numa caixa com clipe, em fonte monoespaçada, cortado com o texto inteiro no `title`. Embaixo, o botão primário de largura total "Baixar <FORMATO> · <tamanho>", o botão de ícone "Extrair novamente" (outline, com tooltip) e o ⋮ com "Copiar link", "Abrir na origem" e "Excluir". | O botão mostra o tamanho real ("Baixar XLSX · 61 KB") e o estado de carregamento ao clicar. |
| RD-05 | Na fila deve mostrar uma barra de progresso indeterminada e "Começa assim que o relatório da frente terminar. Pode sair desta tela: o menu avisa quando ficar pronto." | Nenhum botão de baixar aparece. |
| RD-06 | Gerando deve mostrar a barra com a porcentagem e "Pode sair desta tela. O menu e o sino avisam quando ficar pronto." | A barra avança sem recarregar. |
| RD-07 | Falhou deve mostrar um alerta vermelho com o título "Erro ao gerar o relatório" e a mensagem do back-end, o botão soft "Tentar novamente", de largura total, e o ⋮. | Exemplo de mensagem: "O relatório passou de 100.000 registros. Filtre a tabela ou use uma visualização menor e extraia novamente." |
| RD-08 | O Resumo deve ter 2 colunas, rótulo à esquerda (8,5rem): Origem, Visualização, Formato, Registros, Tamanho, Pedido em, Pronto em e Baixado. Tamanho, Pronto em e Baixado aparecem só quando está Pronto. | Em Na fila, Gerando e Falhou, o Resumo para em Pedido em. |
| RD-09 | Origem deve mostrar o ícone e o nome, e o clique deve fazer o mesmo que "Abrir na origem" (RO-05). | O nome se comporta como link. |
| RD-10 | Registros deve mostrar "Nenhum registro" quando é 0 e "-" sem arquivo. | Relatório de Fornecedores sem avaliação mostra "Nenhum registro". |
| RD-11 | Pronto em deve mostrar a data longa e, embaixo, "2 s para gerar" (acima de 60 s, "N min para gerar"). | O tempo é a diferença entre o pedido e o fim da geração. |
| RD-12 | Baixado deve mostrar "1 vez", "N vezes" ou "Ainda não". | O número sobe a cada download. |
| RD-13 | Filtros aplicados deve mostrar a quantidade no título e os filtros em 2 colunas: o campo à esquerda (9rem, cortado) e a condição inteira à direita, quebrando linha na própria coluna. Embaixo, "Ordenação: <campo, sentido>". | No painel, nenhum valor corta. Sem filtro, mostra "Saíram todos os registros da visualização." |
| RD-14 | "N colunas no arquivo" deve mostrar as 6 primeiras colunas em selos outline e o link "Ver todas (+N)", que alterna para "Ver menos". | Com 9 colunas, o link diz "Ver todas (+3)". |
| RD-15 | O painel não deve ter histórico nem rodapé de Salvar. | O painel termina nas colunas do arquivo. |

## Ações (RO)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RO-01 | Baixar deve baixar o arquivo com o nome legível (RT-04), registrar o download e mostrar o aviso "Baixando <nome do arquivo>". | "Baixado" sobe 1 e o relatório sai do contador do menu. |
| RO-02 | Baixar vários deve baixar os prontos num .zip e mostrar "Baixando N arquivos num .zip". | O .zip tem 1 arquivo por relatório pronto selecionado. |
| RO-03 | Extrair novamente deve criar um pedido novo com a mesma origem, formato, modelo, filtros, ordenação e colunas, no topo da lista e "Na fila", abrir o painel do pedido novo e mostrar "Extraindo novamente, com os mesmos filtros". | O pedido antigo continua na lista. |
| RO-04 | Tentar novamente deve fazer o mesmo que Extrair novamente, a partir do pedido que falhou. | Um pedido novo aparece "Na fila". |
| RO-05 | Abrir na origem deve abrir a tela de origem (categoria ou lista de tarefas) com os filtros e a ordenação do relatório aplicados. | A tabela de origem mostra os mesmos filtros do relatório. |
| RO-06 | Copiar link deve copiar o link do arquivo e mostrar "Link copiado. Ele só abre para quem tem acesso ao workspace." | Pessoa fora do workspace não abre o link. |
| RO-07 | Excluir deve tirar o relatório da lista e mostrar "Relatório excluído" ou "N relatórios excluídos", com o botão "Desfazer". | Desfazer devolve o relatório à mesma posição. Se o painel estava aberto nele, o painel fecha. |

## Formatação (RT)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RT-01 | A data curta deve ser "Hoje, hh:mm", "Ontem, hh:mm" ou "dd/mm/aaaa, hh:mm", no fuso do workspace e no formato do idioma. | Relatório de anteontem mostra a data completa. |
| RT-02 | A data longa deve ter segundos: "14/10/2026, 15:20:02". | Usada em Pedido em e Pronto em. |
| RT-03 | O tamanho chega da API em KB. Abaixo de 1 KB, em bytes ("410 B"); abaixo de 10 KB, com 1 casa ("7,3 KB"); abaixo de 1.024 KB, sem casa ("61 KB"); acima disso, em MB com 1 casa ("18,4 MB"). | Nenhum tamanho aparece como "7.31". |
| RT-04 | O nome do arquivo deve ser `<origem>_<modelo>_<AAAA-MM-DD-HHmm>.<ext>`, cada parte sem acento, em minúsculas, com hífen no lugar de espaço e até 40 caracteres. Com Relatório Padrão, o trecho do modelo sai. | `contratos_vencimentos-do-mes_2026-10-14-1520.xlsx` e `tarefas-rapidas_2026-10-14-1538.csv`. Nenhum arquivo baixa como `default_1vo8sbnlud.xlsx`. |
| RT-05 | Números devem usar o separador de milhar do idioma. | "1.312" em PT, "1,312" em EN. |

## Estados (RE)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RE-01 | Carregando deve mostrar a tabela com o ícone de carregamento girando no lugar das linhas. | A barra continua usável. |
| RE-02 | Sem nenhum relatório, a tela deve mostrar no centro, com até 448 px de largura, o ícone `i-lucide-file-down`, "Nenhum relatório ainda" e "Para ter um relatório, abra uma tabela de itens ou de tarefas e clique em Extrair Relatório. O arquivo aparece aqui." | Não tem botão. A barra continua na tela. |
| RE-03 | Erro ao carregar deve mostrar no centro, com até 448 px de largura, o ícone `i-lucide-cloud-alert`, "Erro ao carregar os relatórios", "Os arquivos continuam salvos. Tente novamente em alguns instantes." e o botão primário "Tentar novamente". | O botão carrega a lista de novo. |
| RE-04 | Busca ou filtro sem resultado deve manter a tabela na tela, com os cabeçalhos, e mostrar dentro dela o ícone `i-lucide-search-x`, o título, "Procure pelo nome da categoria, da visualização ou do modelo." e o botão outline "Limpar filtros". | Com busca, o título é "Nada encontrado para "<termo>"". Só com filtro de coluna, o título não leva o termo. O protótipo mostra aspas vazias nesse caso; o texto final está em aberto. |

## Dados (RI)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RI-01 | A tela deve usar o que `GET /c-report-requests?__relations=processed_report,report` já devolve: `id`, `data.unique_key` (`tasks`, `c_items`), `data.type`, `data.form`, `extraction_format`, `filters` (com `_sort`), `status`, `user`, `created_at`, `updated_at`, `processed_report` (`name`, `size` em KB, `url`, `mime`) e `report` (o modelo, ou `null` no Relatório Padrão). | Origem, formato, tamanho e data com hora aparecem sem dado novo. |
| RI-02 | O back-end deve devolver os status `pending`, `processing` e `error`, além de `complete` (nomes a confirmar), o progresso de 0 a 100 e a mensagem de erro. | Os 4 status de RC-04 e a barra de progresso aparecem. |
| RI-03 | O back-end deve guardar a quantidade de registros do arquivo. | A coluna Registros deixa de mostrar "-" nos prontos. |
| RI-04 | O back-end deve guardar o nome da visualização de origem e as colunas exportadas. | O Resumo e "N colunas no arquivo" aparecem preenchidos. |
| RI-05 | O back-end deve devolver os filtros em frase (campo, operador, valor) e a ordenação legível. Pode montar a partir de `filters`, `_sort` e do schema da categoria. | O popover e o painel não mostram JSON. |
| RI-06 | O back-end deve guardar a data de cada download. | "Baixado" e o contador do menu funcionam. |
| RI-07 | O modelo do construtor de relatórios deve ter descrição (`report.description`). Confirmar se o construtor já guarda. | A descrição aparece embaixo do nome na coluna Relatório. |
| RI-08 | Cada pessoa deve ver só os próprios relatórios. | Outra pessoa do workspace não vê os relatórios de quem extraiu. |

## Componentes e acessibilidade (RK)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RK-01 | A tabela deve ter a aparência do `EnTable` do enspace-sdk-ui (0.17.0). O protótipo usa o `UTable` do Nuxt UI com as classes que o `EnTable` passa a ele, porque o `EnTable` não tem slot de cabeçalho e o filtro da coluna mora no cabeçalho. | Pedido ao SDK: slot `#header-{key}` no `EnTable`, ou filtro e ordenação por coluna nativos. Com isso, a tela volta ao `EnTable` sem mudar o desenho. |
| RK-02 | Cor e espaço devem vir só de token semântico, sem CSS próprio. | Nenhum hex cru. |
| RK-03 | A tela deve funcionar nos temas claro e escuro. | Selo, funil e progresso têm contraste nos 2 temas. |
| RK-04 | Todo texto deve existir em PT, EN e ES. | Trocar o idioma troca todos os textos, inclusive avisos e sino. |
| RK-05 | A tela deve ter movimento: a tabela entra com transição, a troca de tela faz fade, a barra de seleção sobe, o contador do menu entra com escala e o botão Baixar do painel mostra carregamento. Tudo deve respeitar `prefers-reduced-motion`. | Com movimento reduzido no sistema, nada anima. |
| RK-06 | Todo botão de ícone deve ter `aria-label`; o checkbox de linha deve ter como rótulo o nome do relatório. | O leitor de tela lê o nome de cada controle. |
| RK-07 | "Ver detalhes", no menu da linha, deve ser o caminho de quem usa o teclado para abrir o painel. | Dá para abrir o painel sem mouse. O popover da coluna Filtros abre só com o mouse; o painel cobre quem usa teclado. |

## Em aberto

| Pergunta | O que muda se a resposta for sim |
|---|---|
| O arquivo deve expirar? O mercado expira entre 1 h e 30 dias. | Entra o status "Expirado", e "Extrair novamente" vira a ação principal da linha. |
| O administrador deve ver as exportações de todas as pessoas, como no HubSpot? | A tela ganha uma 2ª aba e RI-08 muda. |
| "Extrair Relatório" deve passar a "Exportar", para casar com o nome da tela? | Muda o ícone de extrair das tabelas de itens e de tarefas. |
| Qual é o título do estado sem resultado quando só há filtro de coluna? | Fecha RE-04. |

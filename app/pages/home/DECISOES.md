# Decisões: Home

Registro das rodadas. A mais recente em cima.

## Cards no ENSPACE · 2026-11-25

- **Pedido (literal):** "Sim, criar os 7" e "depois de criar os cards, pode mudar o status do prototipo no goithub pra aprovado".
- **Cards** (desenvolvimento-enlighten2, `user_story`, To Do, aprovação do PO "Sim", sem responsável): a descrição é o `epico.md` de cada épico, e o critério de aceite vai no campo próprio. Tipo e prioridade são proposta do agente, porque a redatora não disse:

  | Épico | Card | Tipo | Prioridade | Tarefas |
  |---|---|---|---|---|
  | 1. Home em widgets, com Categorias e tarefas | [USEC795895B62E54B949B808B6F8F269](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USEC795895B62E54B949B808B6F8F269) | Melhoria | Alta | 26591 a 26595 |
  | 2. Widgets de itens, agenda e atalhos | [USED5D5E3E293344E868DEC6D17B4B50](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USED5D5E3E293344E868DEC6D17B4B50) | Melhoria | Media | 26596 a 26599 |
  | 3. Widgets de agentes de IA e do Spaceflow | [USE2E26C55343634F58947CEB91D5458](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE2E26C55343634F58947CEB91D5458) | Melhoria | Media | 26600 e 26601 |
  | 4. Home padrão do workspace | [USE2810D9F7E77147729839B3350FB3A](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE2810D9F7E77147729839B3350FB3A) | Inovação | Media | 26602 e 26603 |
  | 5. BENI na Home | [USE92A0D5769F064ABD872A115A6C87F](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE92A0D5769F064ABD872A115A6C87F) | Inovação | Media | 26604 a 26606 |
  | 6. Widgets da Home com dado novo | [USE92C3256A993C46DE93F2F067B6C5F](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE92C3256A993C46DE93F2F067B6C5F) | Inovação | Media | 26607 a 26609 |
  | 7. Comunicado e Bloco de notas | [USEE645604A8C0A4062B56CCC635AAAC](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USEE645604A8C0A4062B56CCC635AAAC) | Inovação | Media | 26610 e 26611 |

- **Prints de requisito:** 140, em `evidencias/requisitos/<épico>/`, 1 subpasta por épico, porque os IDs se repetem entre os épicos; o `prints.json` de cada épico mora na pasta dele em `requisitos/`. 16 requisitos levam "Sem print" (rotas de back-end, a migração do navegador, o Configurar do Gráfico de um painel e a página de conversa em tela cheia).
- **Requisitos alinhados ao protótipo aprovado** (o texto descrevia outra tela): RF019, RF406, RF408, RF410 e RF414 do épico 1; RF104 do épico 3; RF109 do épico 5; RF202 e RF203 do épico 6. O "Papel" das instruções virou "Ver como", o rótulo do andaime, e o `textos.ts` saiu da descrição do card.
- **O protótipo simplifica, e o requisito fica como está:** RF407 do épico 1 (o ícone da categoria sem a cor); RF003 do épico 3 (o protótipo abre a conversa flutuante, que é do épico 5); RF110 do épico 5 (as palavras-chave tratam "oi" como tarefa); RF001 do épico 6 (a ordem das tarefas delegadas no dado simulado).
- **Status:** a Home passa a "aprovado" no índice e no `README.md`.
- **Falta:** conferir os cards na tela do ENSPACE. A tarefa 26609 foi conferida pela API: caixas de marcar, os 2 prints e o "Sem print".

## Rodada 10 · 2026-11-25

- **Pedido (literal):** "no final pode escrever os docs de requisitos separando em epicos. / um pro mvp, depois os outros restantes. / o mvp pode ser ainda mais enxuto em widgets, ok? pode ter só categorias e tarefas. / depois vamos entrando com o restante separando os epicos necessarios / --- / no chrome eu mesma vou testar pra nao atrasar"
- **Mudou no protótipo:**
  - o MVP leva só Categorias e os 14 widgets de tarefas (os 13 do Painel de tarefas e Minhas tarefas). Os outros 9 saem do MVP e continuam na "Proposta completa";
  - a Home padrão do MVP: Categorias na largura toda, os 4 números (Abertas agora, Concluídas, Criadas, Vencidas), Vencidas, Vencem em breve, Minhas tarefas e Abertas por status;
  - a descrição do grupo Itens e categorias no catálogo do MVP fala só das categorias.
- **Requisitos em 7 épicos** (`requisitos/README.md`), pela regra "Épico pelo esforço" da skill `requisitos`:
  - com o que já existe: 1. Home em widgets, com Categorias e tarefas (o MVP); 2. Itens, agenda e atalhos; 3. Agentes de IA e Spaceflow;
  - novidades: 4. Home padrão do workspace; 5. BENI na Home; 6. Widgets com dado novo; 7. Comunicado e notas.
- **Sinal de corte mantido:** a parte 1 do MVP tem 29 linhas (mediana de 17) e a parte 2 do épico 5 tem 13 (mediana de 6). Cada uma é 1 funcionalidade só (personalizar a Home; o rascunho na conversa), e o tamanho sozinho não corta funcionalidade.
- **Fronteira:** muda só o conteúdo do MVP. A "Proposta completa", a casca e os widgets ficam como na rodada 9.
- **Teste no navegador:** fica com a redatora, no Chrome dela. A rodada passou no `vue-tsc` sem erro na Home e o `/home` responde 200 no servidor local.

## Rodada 9 · 2026-11-24

- **Pedido (literal):** "melhore o padding interno pra que o titulo nao fique parecendo "colado" lá no alto. melhore o alinhamento também. o título não deve passar da altura do ícone e o texto da desrciçao nao deve descer alem da base do icone. de repente vale aumentar o ícone pra ficar descriçao + titulo ali no espaço que o ícone ocupa. e o truncamento se mantem / adicione tambem widgets de spaceflow: erros em fluxos é um deles. em vez de ser só erro nos agentes, faça algo similar pra mostrar falhas dos fluxos em geral / e outros status que voce achar interessantes de trazer aí."
- **Mudou:**
  - **cartão de Categorias:** o ícone passa de 40 px para 56 px, e o texto ocupa no máximo a altura dele (título de 20 px, 4 px de espaço e até 2 linhas de descrição de 16 px). O bloco centraliza na altura do ícone, com 12 px de respiro em cima e embaixo. O nome continua truncado em 1 linha e a descrição em 2;
  - **grupo Spaceflow no catálogo**, com 3 widgets:
    - **Execuções dos fluxos:** as execuções dos últimos 7 dias por status (em andamento, concluídas, com erro, canceladas), a barra com a proporção e a taxa de conclusão das terminadas;
    - **Falhas nos fluxos:** a execução que parou com erro em qualquer passo (e-mail, agente de IA, requisição HTTP e os outros), com o passo, a mensagem, o item e o botão Repetir. Substitui a ideia de "Falhas dos agentes", que a rodada 8 tirou;
    - **Fluxos em andamento:** a execução que espera, a mais antiga primeiro, com o passo (aprovação, assinatura, tarefa, formulário, espera). A que espera há mais de 2 dias leva o selo "Parado".
  - o clique na linha abre a execução no Spaceflow, e o botão do cabeçalho abre o Spaceflow;
  - **permissão:** os 3 pedem a permissão de fluxos. No catálogo levam o selo "Pede acesso aos fluxos", e o membro do protótipo, que não a tem, não os vê no catálogo e vê "Sem acesso" se o administrador os puser na Home padrão.
- **MVP:** os 3 entram no MVP. A contagem por status já tem rota, a lista sai da rota de execuções com filtro de status, e o Repetir é a mesma chamada da tela de execução. A tabela "Spaceflow na Home (rodada 9)" do `BRIEFING.md` traz as citações. Nenhum dos 3 entra na Home padrão: quem quer, põe pelo catálogo.
- **Por que não "falhas dos agentes":** o tipo do passo fica dentro do JSON `node` da execução do passo, sem coluna para filtrar. Separar só os agentes pede rota nova; a falha de qualquer passo sai da rota que já existe.
- **Componentes:** `_WSpaceflow.vue`, com `UScrollArea`, `UButton`, `UTooltip`, `UIcon` e `UBadge`. Nenhum CSS próprio além da barra que cresce, que reusa o `home-crescer-x` do widget de itens.
- **Fronteira:** muda o cartão de Categorias e o catálogo ganha o grupo Spaceflow. A casca, a grade, a barra de edição e os outros widgets ficam como na rodada 8.
- **Teste no navegador:** não feito nesta rodada. O Chrome da redatora ficou desconectado e o navegador do app não abriu (a máquina ficou com 0,3 GB de memória livre). A rodada passou no `vue-tsc` sem erro na Home e o `/home` responde 200 no servidor local.

## Rodada 8 · 2026-11-24

- **Pedido (literal):** "Meus itens / Os itens em que você é o responsável. / nao faz sentido. é itens que aquele usuário criou. nao rsponsavel. nao existe responsabilidade por item. / Prazos de itens / Itens com data de vencimento ou vigência nos próximos 30 dias. / tambem nao existe. itens nao tem campo de data de vencimento. sao campos de data aleatorios que o user pode criar, nao da pro sistema prever. / revisoes por ia nao faz sentido / creditos de ia também nao, nem falhas dos agentes / --- / ajuste isso e, apos deletar o que nao faz sentido ou modificar a descriçao, pode prototipar um botao que contenha somente o MVP da solução. tente guiar o mvp com base no que ja existe hoje no código e seria simples de fazer. use /investigar-codigo pra garantir que ta correto."
- **Mudou:**
  - **Meus itens:** passa a ser "Os itens que você criou". O item guarda quem o criou (`Item.user`), e a busca de itens de develop já tem o filtro "Meus Itens" por esse campo. Em Itens criados recentemente, o avatar da linha é de quem criou, com a dica "Criado por <nome>";
  - **saem:** Prazos de itens, Revisões por IA, Créditos de IA e Falhas dos agentes. O grupo IA fica com o BENI e Agentes de IA, e o selo "Só o administrador vê" sai com os 2 widgets do administrador;
  - **o item não tem responsável:** o modal de criar item perde o campo Responsável, e o rascunho de item do BENI também. A tarefa continua com responsável (`assigned_to`);
  - **a Agenda** junta o item pelo campo de data que a Agenda da categoria usa, sem filtro de pessoa, como a tela Agenda faz hoje;
  - **o botão do MVP:** o andaime ganha "Versão: Proposta completa · MVP". O MVP mostra só o que se faz no front, com dado e componente que o develop já tem. A tabela "O MVP, widget por widget (rodada 8)" do `BRIEFING.md` traz o motivo de cada um.
- **O que o MVP tem:**
  - os 13 widgets de tarefas que já estão no catálogo do Painel de tarefas do SDK, mais Minhas tarefas;
  - Compromissos do dia, Categorias, Meus itens, Itens criados recentemente, Agentes de IA, Atalhos e Recentes;
  - a grade, o Personalizar, a barra de edição, o Restaurar padrão e o botão Criar com Item e Tarefa;
  - "Minhas tarefas · Workspace" só para o administrador;
  - a Home padrão do MVP: a Home de develop de hoje (Categorias, 4 números, Vencidas, Vencem em breve) mais Minhas tarefas, Compromissos do dia, Meus itens, Agentes de IA, Atalhos e Recentes.
- **O que fica fora do MVP:**
  - **Home padrão montada pelo administrador** e o selo "Novo": pede um campo novo no workspace. No MVP cada pessoa arruma a própria Home, guardada no navegador, como develop já faz;
  - **rascunho de item e de tarefa na conversa do BENI:** é interação nova. No MVP, "Pedir ao BENI" e o clique num agente abrem a conversa em tela cheia, que já aceita o pedido e o agente pela URL. A conversa flutuante não recebe um agente de fora;
  - **widget BENI:** o resumo não tem rota;
  - **Tarefas que delegei:** a tarefa agendada não guarda quem a delegou;
  - **Agenda da semana e do mês:** a tela Agenda já mostra os 2;
  - **Itens por categoria:** não há contagem agregada (1 chamada por categoria);
  - **Gráfico de um painel:** o painel está preso a uma tela, e escolher tela e painel é configuração nova;
  - **Comunicado e Bloco de notas:** pedem modelo e rota novos. O grupo "Equipe e notas" some do catálogo do MVP.
- **Componentes:** nenhum novo. O botão de versão é andaime, como os de estado e de papel.
- **Fronteira:** muda o widget Meus itens, o grupo IA, o modal de item, o rascunho de item do BENI e a Agenda. A casca, a grade, a barra de edição e a Home padrão da proposta completa ficam como na rodada 7.
- **Ver:** `evidencias/rodada8-*.jpg`

## Rodada 7 · 2026-11-24

- **Pedido (literal):** "alem disso, no widget de categoirias, nao da pra dizer "6 em aberto", "4 em aberto"... nem existe esse conceito de aberto. Pode tirar isso. lembre-se de que "em aberto" nao existe no widget de categorias. deve ser só o onme da categoria, a descriçao dela abaixo e o botao de açao. alem disso, veja se tem mais widgets de IA que voce poderia sugerir. assim teríamos uma seçao somente pra IA. poe nem ser só beni. pode ser o beni + funcionalidades de agentes de IA puxadas pra widget, se fizer sentido. nao crie só porque to pedindo. tem que realmente apresentar algum ganho. o botao de restaurar o padrao ta em posiçao ruim ali também. acredito que deva estar ao lado do de cancelar a operaçao? ou nao? como o ux design define esse tipo de coisa por regra? pesquise pra executar. o widget "agenda de hoje" deve se chamar "compromissos do dia""
- **Mudou:**
  - Categorias: cada card mostra o nome, a descrição da categoria em até 2 linhas e o botão de criar. "Em aberto" sai de toda a Home:
    - o widget "Itens em aberto por categoria" vira "Itens por categoria";
    - Meus itens e Prazos de itens deixam de filtrar por "em aberto";
    - a Agenda junta os itens pela data, sem filtro de estado.
    O item do ENSPACE não tem estado de aberto (`BRIEFING.md`, "A IA do workspace e a categoria");
  - "Agenda de hoje" passa a se chamar "Compromissos do dia" (EN "Today's appointments", ES "Compromisos del día");
  - a barra de edição em 3 grupos: Adicionar widget | Concluir | Restaurar padrão e X. Restaurar sai de perto do Concluir e vai para junto do X, os 2 que desfazem. O divisor separa os grupos, para o Restaurar não ser clicado no lugar do primário. Sem diálogo de confirmação: o aviso "Home restaurada" traz Desfazer. A pesquisa está em `PESQUISA.md`, "Onde fica o Restaurar padrão";
  - o catálogo ganha o grupo **IA**, com 5 widgets. O BENI sai de "BENI e equipe", que vira "Equipe e notas" (Comunicado e Bloco de notas). Cada widget novo entrou por um ganho que a Home não tinha:
    - **Agentes de IA:** os agentes do workspace (os do sistema e os criados nele), com a cor de cada um. O clique abre a conversa flutuante com aquele agente. Ganho: hoje só se chega a um agente pela tela Agentes de IA ou pela página de conversa;
    - **Revisões por IA:** concluídas no mês, na fila ou revisando, nota média e a lista de documentos com o status e a nota (amarela abaixo de 70). Ganho: quem manda um contrato para o revisor vê o andamento sem abrir o item;
    - **Créditos de IA** (só o administrador): o saldo, quantos dias ele dura no ritmo dos últimos 7 dias, o consumo dos últimos 30 dias, Comprar créditos e Ver extrato. O selo "Saldo baixo" aparece com menos de 14 dias. Ganho: o crédito acaba e a IA para; hoje só se vê na tela de carteira;
    - **Falhas dos agentes** (só o administrador): o passo de agente que falhou num fluxo do Spaceflow, com o erro, o fluxo, o item e Repetir. Ganho: a falha de um agente para o fluxo em silêncio, e hoje só aparece na execução do fluxo;
  - a conversa flutuante atende qualquer agente: o cabeçalho, a cor do avatar, a saudação, o campo e o aviso do rodapé trocam para o agente escolhido. O BENI continua com o rascunho de item e de tarefa;
  - o membro não vê Créditos nem Falhas no catálogo, e eles saem da Home dele (a carteira e a execução dos fluxos pedem permissão de administrador). O selo no catálogo diz "Só o administrador vê"; o do Comunicado continua "Só o administrador edita";
  - no workspace vazio, Agentes de IA mostra só o BENI, e Revisões e Falhas mostram o estado vazio.
- **Componentes:** o avatar dos agentes é o mesmo `@be-enlighten/beni-avatar`, com a cor do agente (`beniTheme`). As barras de consumo crescem com o keyframe global `home-crescer-y`, pelo mesmo motivo do `home-crescer-x` da rodada 6.
- **Fronteira:** muda o widget Categorias, os nomes "Itens por categoria" e "Compromissos do dia", a barra de edição, o catálogo (grupo IA) e a conversa flutuante. A casca, a grade e a Home padrão ficam como na rodada 6.
- **Descartado:**
  - **Conversas recentes:** a conversa flutuante já lista as conversas da pessoa (`GET /ai/chats`); o widget repetiria a mesma lista;
  - **Propostas do BENI:** a proposta só existe na prévia do editor, sem gravação nem rota;
  - **Uso de IA por pessoa:** o dado só existe no painel admin, fora do workspace;
  - **Confirmação antes de Restaurar padrão:** o Desfazer no aviso e o X já recuperam a Home.
- **Depende de:** filtrar as execuções de nó pelo tipo `ai_agent`. Não confirmado no código; sem o filtro, o front separa as execuções de agente.
- **MAQUETE:** fora do BENI, a resposta do agente na conversa é uma frase fixa que diz que, no produto, responde o agente com o modelo e as ferramentas dele.
- **Ver:** `evidencias/rodada7-*.jpg` e `evidencias/rodada7-barra-de-edicao.png`

## Rodada 6 · 2026-11-24

- **Pedido (literal):** "se estou vendo como membro, nao deve existir no topo o filtro "minhas tarefas/workspace" somenre owner ve isso. --- na seleçao de categorias na hora de adicionar o widget deve poder selecionar todos e desmarcar todos tambem. pra facilitar. --- os botoes dessa barra estão excessivos. parece muito texto e muito botao. alem disso a ordem deles nao ta muito lógica. vejas como pode melhorar, sem tirar nenhum botão. talvez o cancelar ser somente um X pode ser bom... sei lá... --- prototipe o "pedir ao beni" do botao criar. como seria a interaçao? --- o resumo do beni deve aparecer por padrao, pra induzir o user a usar ia, mesmo no estado inicial. deve fazer aprte do padrao mesmo. e o atalho de categorias deve ser por padrao o widget do topo, o primeiro de todos. --- criar tarefa só pode ser tarefa rápida. então pode reduzir essa jornada. --- nos widgets, a categorizaçao que voce fez com "Naveçao e agenda" ficou nonsense. talvez tenha que ser tarefas e agenda. ou se fizer sentido ter MAIS widgets de agenda, por exemplo, trazendo a PROPRIA agenda em miniatura pra home, podssa ser separada a categoria. veja isso. a sensçao é de que somente a seçao de tarefas ta bem alimentada. veja o restante como da pra alimentar mais e setorizar melhor talvez."
- **Correção no meio da rodada (literal):** "o resumo do beni (widget) nao deve ter chat de conversa. é só o resumo dele mesmo. mas ele pode ter um botao que, ao ser clicado, abre o chat flutuante do beni pra facilitar.mas o user deve digitar no chat, nao no widget"
- **Mudou:**
  - "Minhas tarefas · Workspace" só aparece para o administrador. O membro vê sempre as próprias tarefas. Em develop o alternador aparece para todos (`BRIEFING.md`, "O BENI e o alternador de escopo");
  - no 3º nível do catálogo (Categorias), "Marcar todas" e "Desmarcar todas" ao lado da contagem. Cada um fica desligado quando não tem efeito;
  - a barra de edição, na ordem de uso:
    - Adicionar widget (a ação principal enquanto se edita);
    - Restaurar padrão vira ícone com dica, só na Minha Home;
    - um divisor;
    - Concluir;
    - Cancelar vira X com a dica "Cancelar e descartar as mudanças";
    - a frase de ajuda só aparece em tela larga (xl).
    Nenhum botão saiu;
  - "Pedir ao BENI" do Criar abre a conversa flutuante do BENI com o texto digitado. O BENI responde com um rascunho:
    - tarefa rápida: nome, data limite, responsável e prioridade;
    - item: a categoria, o formulário (com escolha quando a categoria tem mais de 1) e os campos que entendeu;
    - categoria: a sugestão, com "Montar categoria";
    - pergunta: a ajuda com exemplos.
    O rascunho tem Criar, "Revisar no formulário" (abre o modal de sempre já preenchido) e Descartar. Criado, mostra a referência e Abrir. A conversa tem Nova conversa, Tela cheia e Fechar;
  - o widget BENI é só o resumo do dia e o botão "Conversar com o BENI", que abre a mesma conversa com o cursor no campo dela. No workspace vazio, o BENI se apresenta no lugar do resumo;
  - Home padrão: Categorias em 1º, na largura toda; depois os 4 números; BENI e Agenda de hoje lado a lado; Vencidas e Vencem em breve; Minhas tarefas e o gráfico; Comunicado, Atalhos e Recentes;
  - Criar ▸ Tarefa abre direto o modal de tarefa rápida, sem a escolha entre rápida e agendada;
  - o catálogo passa a ter 5 grupos, cada um com mais opções:
    - Tarefas (15): as lâminas da rodada 5;
    - Agenda (3): Agenda de hoje, Agenda da semana (7 colunas, a partir de hoje) e Agenda do mês (o calendário; o dia escolhido lista o que há nele);
    - Itens e categorias (5): Categorias (que leva à escolha e à ordem), Meus itens, Itens criados recentemente, Prazos de itens e Itens em aberto por categoria;
    - Telas e atalhos (3);
    - BENI e equipe (3): BENI, Comunicado e Bloco de notas.
- **Componentes:**
  - a conversa usa `UChatMessages`, `UChatPrompt`, `UChatPromptSubmit` e `UChatShimmer`. A janela é um painel fixo próprio no canto, como o `AiChatFloat` de develop: o `USlideover` e o `UModal` do Nuxt UI escurecem a tela, e a conversa flutuante deixa a Home à vista;
  - a Agenda do mês é uma grade própria: o `UCalendar` pede `@internationalized/date`, que o app não importa, e não desenha os pontos de cada dia;
  - o keyframe de entrada das barras de "Itens em aberto por categoria" está num `<style>` global com nome único: o `@keyframes` com escopo do Vue muda de nome e o `animate-[...]` do Tailwind não o acha.
- **Fronteira:** muda o que está no Criar (Tarefa e Pedir ao BENI), a barra de edição, o catálogo, a Home padrão, o widget BENI e o alternador de escopo. A casca, a grade e o modal de item ficam como na rodada 5.
- **Descartado:**
  - a tarefa agendada no Criar: ela nasce do fluxo da categoria, não de um botão;
  - "Mostrar todas" no Configurar do widget Categorias: com "Marcar todas" no catálogo, ele repetia a ação;
  - campo de pedido e sugestões dentro do widget BENI, que a correção da redatora tirou: o pedido acontece só na conversa;
  - "Navegação e agenda" como grupo do catálogo.
- **MAQUETE:** o BENI entende o texto por regras de palavra-chave (`beni.ts`), para a conversa responder no protótipo. No produto, quem entende é o agente de IA do workspace.
- **Ver:** `evidencias/rodada6-*.jpg` e `evidencias/rodada6-*.png`

## Rodada 5 · 2026-11-24

- **Pedido (literal):** "observe como ta a home hoje em develop. note que os elementos do dashboard de tarefas foram levados pra lá. o usuário deve poder pegar esses elementos como lâminas. pra agrupar melhor a sidebar de adicionar widgets, você pode fazer um menu que vai de um nível pro outro, em arvore, do tipo. selecionei que quero puxar ali dados de tarefas > aparecem as opções pra mim de cada lamina/informação. Selecionei que quero botar categorias > seleciono quais quero mostrar. inúteis e pode tirar: numero de uma visualização, itens de uma visualização. o widget de categorias ta estranho. todos os cards ali dentro deveriam ter o mesmo tamanho. o user deveria poder definir a ordem em que eles aparecem dentro do widget também. o estado inicial do primeiro acesso na verdade é com os widgets vazios. eles estão ali, mas sem informação. e ai pode ser como você já colocou mesmo. mas seria estado inicial com workspace vazio (acabou de criar) e estado configurado (é o que vc ta chamando de inicial hoje). entendido? e o estado sem widgets continua la."
- **O develop hoje:** a Home já monta as lâminas do Painel de tarefas, tem o alternador "Minhas tarefas · Workspace" e já edita na própria Home, com "Adicionar painel" num menu curto de 4 lâminas (`BRIEFING.md`, "A Home em 24/11/2026"). O protótipo leva essa edição adiante: o catálogo inteiro, em árvore, e os widgets que não são de tarefa.
- **Mudou:**
  - cada lâmina do Painel de tarefas é um widget, com o nome e a regra do SDK:
    - Números: Abertas, Concluídas, Criadas, Vencidas e Vencem em 7 dias. Abertas, Concluídas e Criadas têm a curva das 4 semanas; Vencidas e Vencem em 7 dias, a parte das abertas;
    - Listas: Vencidas e Vencem em breve, nas faixas do SDK ("Há até 7 dias", "Há mais de 7 dias", "Nas próximas 24 h", "Em 1 a 7 dias"), com o tempo no selo; Minhas tarefas e Tarefas que delegei continuam;
    - Gráficos: Abertas por status, Prioridade (só tarefa rápida), Carga por responsável, Atividade (4 semanas), Saúde dos prazos e Entrada e saída;
  - "Minhas tarefas · Workspace" no topo da Home, ao lado de Personalizar: troca as lâminas todas de uma vez. Minhas tarefas = as atribuídas a mim;
  - a Home padrão segue a de develop: os 4 números, Vencidas e Vencem em breve, Categorias na largura toda, e depois Minhas tarefas, o gráfico de um painel, Comunicado, Atalhos e Recentes;
  - o catálogo vira árvore de 2 níveis:
    - 1º nível: Tarefas, Categorias, Navegação e agenda, Equipe e notas, cada um com quantas opções tem;
    - Tarefas > as lâminas em Números, Listas e Gráficos, cada uma com Adicionar ou "Na Home";
    - Categorias > quais aparecem e em que ordem, com "Adicionar à Home" ou, quando o widget já está nela, "Salvar na Home";
    - a busca do 1º nível procura em todas as folhas;
  - saíram "Itens de uma visualização" e "Número de uma visualização", e com eles a escolha de visualização e de título no Configurar;
  - o widget Categorias tem cartões do mesmo tamanho (colunas iguais, altura fixa, nome truncado) e mostra as categorias na ordem escolhida. A ordem se muda com Subir e Descer, no catálogo e no Configurar;
  - estados de partida no andaime:
    - **Workspace vazio (primeiro acesso):** o workspace acabou de nascer. Os widgets da Home padrão estão no lugar, sem dado: os números em 0, "Nada por aqui" nas listas, "Sem tarefas para mostrar." nos gráficos, Categorias com "Criar categoria" para o administrador (o membro lê que o administrador ainda não criou), Comunicado com "Escrever comunicado" para o administrador;
    - **Workspace configurado:** o que se chamava "Estado inicial (primeiro acesso)": a Home padrão com o dado do mocks.ts;
    - Carregando, Sem widgets, Erro num widget e Sem acesso num widget continuam. Erro cai na primeira lista ou gráfico de tarefas; Sem acesso, no gráfico de um painel ("Você não tem acesso a Painéis de compras").
- **CSS próprio:** entra o `.lista-move` do `_OrdemDeCategorias.vue`, para a linha deslizar ao Subir e Descer (o `TransitionGroup` pede a classe; o Nuxt UI não tem lista reordenável).
- **Fronteira:** muda o que entra na Home (as lâminas), o catálogo, o widget Categorias e os estados. Criar, Personalizar na própria Home e a casca ficam como na rodada 4.
- **Descartado:**
  - arrastar para ordenar as categorias: os exemplos do Nuxt UI pedem `@vueuse/integrations` e `sortablejs`, que o app não importa, e Subir e Descer servem também a quem não arrasta (WCAG 2.5.7);
  - um alternador de escopo em cada lâmina: em develop ele é um só, no topo.
- **Ver:** `evidencias/rodada5-*.jpg`

## Rodada 3 · 2026-11-11

- **Pedido (literal):** "alem disso verifique no codigo se os widgets que voce sugeriu fazem sentido, do tipo "tarefas que eu criei e deleguei", faz sentido criar isso? tem no codigo e é ok de mexer? e quais dados vai cruzar pra chegar nisso entao? pq isso tem que estar nos requisitos" e "ao clicar em personalizar, a forma mais clean é realmente abrir uma SIDEBAR? os outros produtos fazem assim tambem? ou de outro modo?"
- **Leitura do código:** a fonte de cada widget, o veredito e os dados que se cruzam estão no `BRIEFING.md`, "De onde vem o dado de cada widget (código)". Essa tabela entra nos requisitos.
- **Mudou:** "Tarefas que delegei" mostra só tarefa rápida. A tarefa programada não grava quem a criou nem quem a delegou como campo (`enlighten-api@develop 5587592e8 api/c-flow-item-tasks/models/c-flow-item-tasks.settings.json:34-158`); a descrição do catálogo diz "Tarefas rápidas que você criou para outras pessoas".
- **Para os requisitos, por esforço:**
  - só front: Minhas tarefas (faixas Hoje e Sem prazo), Tarefas que delegei, Agenda, Gráfico de um painel, Atalhos e Recentes;
  - front e rota nova sobre dado que existe: Itens e Número de uma visualização, contagem "em aberto" das Categorias, Resumo do BENI, guardar a Home;
  - back-end novo: Comunicado e Notas;
  - fora do alcance hoje: prazo de item na Saúde dos prazos (o item não tem prazo próprio) e tarefa programada em Tarefas que delegei.
- **Personalizar:** decidido na rodada 4.

## Rodada 4 · 2026-11-11

- **Pedido:** "Sim, trocar", em resposta a "Troco o Personalizar pela edição na própria Home?".
- **Como os outros fazem** (ajuda pública, lida em 2026-11-11):
  - QuickBooks: "Customize" põe a Home em edição; arrastar e esticar acontecem nela; "Add or remove widgets" abre um painel só com o catálogo; "Save" no fim ([Customize your Home page](https://quickbooks.intuit.com/learn-support/en-us/help-article/product-setup/customize-home-page-quickbooks-online/L0ryPsyjD_US_en_US));
  - Asana: menu "Customize" para escolher widgets; mover e redimensionar na própria Home ([How to customize your home page](https://help.asana.com/s/article/how-to-customize-your-home-page));
  - Jira (dashboards): alça no topo de cada widget e barra que aparece ao passar o mouse, na própria página ([Customize your dashboard layout](https://support.atlassian.com/platform-experiences/docs/customize-your-dashboard-layout/));
  - ClickUp: move direto na tela; "Manage cards" abre só o catálogo (`PESQUISA.md`, ClickUp).
- **Mudou:**
  - "Personalizar" põe a Home em edição. Personalizar e Criar saem, e no alto entra uma barra fixa: "Personalizando a Home", a dica de arrastar e redimensionar, o seletor Minha Home ou Home padrão do workspace (só o administrador), "Adicionar widget", "Restaurar padrão" (só na Minha Home), "Cancelar" e "Concluir";
  - fora da edição, nada se arrasta nem se redimensiona: a Home é lugar de trabalho. O menu "…" de cada widget continua com Configurar, Tamanho padrão e Remover;
  - na edição, cada widget tem borda tracejada, a alça à esquerda do título e, à vista, Subir, Descer, Configurar e Remover. Subir e Descer são a alternativa ao arraste da WCAG 2.5.7. O corpo do widget fica inerte: o clique não abre item nem conclui tarefa;
  - "Cancelar" devolve as 2 Homes ao que eram ao clicar em Personalizar; "Concluir" salva e avisa ("Home salva." ou "Home padrão do workspace salva.");
  - o painel lateral virou só o catálogo ("Adicionar widget"), aberto pela barra. Saiu a aba "Na sua Home", que repetia em lista a Home de trás;
  - o aviso da Home padrão perdeu o próprio "Concluir edição": quem conclui é a barra;
  - o estado "Sem widgets" oferece "Adicionar widget", que já entra na edição com o catálogo aberto;
  - no celular, o seletor da Home desce para a linha de baixo da barra.
- **CSS próprio:** sai o `.lista-move` do `_Personalizar.vue`, que deixou de existir; ficam os de `_WMinhasTarefas.vue` e `_WOutros.vue`.
- **Fronteira:** muda só o jeito de personalizar. Widgets, Criar e casca ficam como na rodada 3.
- **Descartado:** modal centralizado (o "Customize Home" da HubSpot nova). Esconde a Home enquanto a pessoa a arruma, e a HubSpot nem tem posição nem tamanho livre.
- **Ver:** `evidencias/rodada4-personalizar-na-home.jpg`, `rodada4-catalogo.jpg`

## Rodada 2 · 2026-11-11

- **Pedido (literal):** "a home também deve poder ter atalho pras categorias. o "criar rápido" ta ruim. deveria ser só um botão bem objetivo mesmo. quando botar pra criar, abre as opçoes "item" e "tarefa", aí ramifica na hora de criar, item > seleciona qual categoria > seleciona qual form (se nao tiver form vai direto). tarefa > rapida ou agendada > abre o modal de criaçao. e aí pode tirar o botão de criação do menu lateral ou, se nao for tirar, deixe identico ao do prototipo de menu lateral de 2 niveis, incluindo opçao de "pedir ao beni" a criaçao de algo. se voce INSISTIR que é bom ter os atalhos especificos de crioação no widget de criar, ja com atalho pra categoria especifica e tal, aí voce vai ter que deixar melhor. usabilidade nao ta legal, specialemnte ux writing, que nao faz sentido no codigo. [...] e vai perceber que "abrir chamado" nao seria um nome possivel, pq chamado é uma categoria e simplesmente pra gente é "criar item em x categoria" ou "criar X", sendo X o nome da categoria."
- **Pedido no meio da rodada:** "home vazia = estado inicial? ou o estado inicial = home padrao? nomeie como ESTADO INICIAL (primeiro acesso) o que for representar isso."
- **O que o código diz** (en-space@develop e3a6cd15a, só leitura):
  - a Home monta 4 blocos fixos, sem configuração pela pessoa: `src/pages/workspaces/[workspace]/index.vue:15-31` (`WelcomeCard`, `WorkspaceCategories`, `WorkspaceTasks`, `WorkspaceComparisons`);
  - os cartões de categoria da Home dependem de `show_types_on_initial_screen`: `src/components/workspace/WorkspaceCategories.vue:49`, ligado em `SettingsGeneralConfigs.vue:128`;
  - o modal de criar item se chama "Novo registro" e o seletor, "Formulario" (sem acento): `EntityItemsFormsUpsert.vue:27-29`;
  - o seletor de formulário só aparece com 2 ou mais formulários, e vem com o primeiro escolhido: `EntityItemsFormsUpsert.vue:123` e `:296`;
  - a chave global de criar item é "Criar Item": `locales/pt-BR.yml:1973`;
  - os campos da tarefa usam "Data limite", "Colaboradores" e "Item relacionado": `locales/pt-BR.yml:4249-4264`;
  - não há botão Criar global no menu lateral; o BENI aparece como "BENI AI", em Ajuda.
- **Mudou:**
  - um botão **Criar** no topo da Home, ao lado de Personalizar, com a tecla C. Ele ramifica:
    - Item > categoria > formulário (só com 2 ou mais; com 1 ou nenhum, abre o modal direto, a mesma regra do produto);
    - Tarefa > Tarefa rápida ou Tarefa agendada > modal;
    - Pedir ao BENI, com o texto digitado na busca;
  - ao digitar na raiz, as categorias aparecem junto, para quem já sabe onde vai;
  - saiu o Criar do menu lateral: a casca volta a ser igual ao develop;
  - o widget **Criar rápido** virou o widget **Categorias**: o cartão inteiro acessa a categoria e o "+" ao lado cria nela; com 2 ou mais formulários, o "+" pergunta qual;
  - o texto de criar segue a categoria: "Criar <nome no singular>" (`singular_name`) ou, sem singular, "Criar item em <categoria>". Some "Abrir chamado" e qualquer verbo inventado;
  - o modal do item tem o mesmo título do "+" e diz de qual formulário vem ("Formulário Equipamento de TI" ou "Todos os campos da categoria");
  - o modal de tarefa tem os campos e rótulos do produto: Nome, Data limite, Prioridade, Responsável, Colaboradores e Descrição;
  - tarefa agendada pede também o **Item relacionado**, obrigatório, com busca por título e por número;
  - o widget Categorias se configura: a pessoa marca quais categorias aparecem; sem nenhuma marcada, aparecem todas as que ela acessa;
  - os Atalhos deixam de ter categoria e formulário (o widget Categorias cobre isso) e ficam com visualização, tela e link;
  - andaime: "Estado inicial (primeiro acesso)" mostra a Home padrão do workspace, que é o que a pessoa vê no primeiro acesso; o antigo "Vazio" virou "Sem widgets".
- **Fronteira:** muda o topo da Home (botão Criar), o primeiro widget e os modais de criar; o menu lateral, a barra do topo e a trilha ficam como o develop.
- **Descartado:**
  - manter o widget Criar rápido com atalhos para uma categoria específica: repetia o que o widget Categorias faz pelo "+" e obrigava a pessoa a montar a lista;
  - manter o Criar no menu lateral: o produto não tem criar global ali, e o "+" do protótipo `menu-lateral` serve para criar estrutura (seção, menu, categoria). 2 portas para criar item confundiam;
  - cartões grandes para escolher o tipo de tarefa: a lista do próprio menu Criar resolve em 1 clique.
- **NOVO, para o dev confirmar:** criar tarefa agendada à mão. A leitura do código não achou essa criação pela tela; hoje ela nasce do fluxo da categoria. A proposta supõe que ela mora num item, por isso o Item relacionado é obrigatório.
- **Diferença com o develop, de propósito:** o produto chama o modal de "Novo registro" e o seletor de "Formulario". O protótipo usa o nome da categoria no título e "Formulário" com acento.
- **Corrigido na conferência:** o modal de configurar o widget pulava quando a primeira categoria era marcada (o "Mostrar todas" aparecia e empurrava a lista). Agora o botão fica sempre no lugar, desativado sem escolha. Os cartões de categoria deixaram de esticar quando há poucos.
- **Maquete:** Pedir ao BENI (só o aviso; no produto, abre o chat do BENI AI), Acessar a categoria e "Ver todas as categorias".
- **Ver:** `pnpm dev` → http://localhost:3000/home · `evidencias/rodada2-criar.jpg`, `rodada2-criar-item-formulario.jpg`, `rodada2-modal-do-item.jpg`, `rodada2-tarefa-agendada-escuro-es.jpg`

## Rodada 1 · 2026-11-11

- **Pedido (literal):** "a home do enspace nao é boa hoje. os usuarios sentem que é muito dura e tem poucos atalhos. é feia, pouco flexível etc. pode pesquisar quickbooks e hubspot como exemplos. ambos trabalham com widgets pra dar liberdade pro user montar a home. Monday e clickup são outros excelentes exemplos. pesquise PROFUNDAMENTE. se precisar crie conta de usuario pra explorar. considere também o enspace atual em develop, a nova tela de dashboard de tarefas etc. talvez atalho pra criar item e criar tarefa também com botao na home. isso pode ser relevante também. ou no menu lateral. enfim... pesquise e decida como prototipar pro enspace."
- **Pedidos no meio da rodada:**
  - "lembre de usar somente nuxt pra prototipar, com /nuxt-ui [...]"
  - "muito cuidado com a largura horizontal dos elemntos na home. ta com muito espaço sobrando. tem que definir um espaço ali pra ser ocupado de modo responsivo a depender do tamanho da tela, sem ficar parecendo um bloco no meio. tem que ficar BONITO como homes de outros produtos."
- **Conta de usuário:** nenhuma foi criada. Criar conta em serviço de terceiros é vedado a este agente; a pesquisa usou documentação, central de ajuda, changelog, vídeo e avaliação pública (`PESQUISA.md`, "Como a pesquisa foi feita").
- **Mudou:**
  - a Home vira uma grade de widgets com a mesma grade do Painel de tarefas (`UxGradeDePaineis`): arrastar pela alça, redimensionar pelo canto, 12 colunas;
  - "Personalizar" abre um painel lateral com 2 abas: "Na sua Home" (Subir, Descer e Remover, a alternativa ao arraste da WCAG 2.5.7) e "Adicionar widget" (catálogo em 4 grupos, com busca);
  - Home padrão do workspace: o administrador edita a Home que todos recebem; o widget que ele acrescenta depois chega à Home de quem já personalizou, com o selo "Novo";
  - widgets do padrão: Criar rápido, Minhas tarefas, uma visualização salva (Pedidos em aberto), Comunicado, Atalhos e Recentes;
  - catálogo: Tarefas que delegou, Agenda, Número de uma visualização, Saúde dos prazos, Gráfico de um painel, Notas e Resumo do BENI;
  - cada widget carrega, falha ("Tentar de novo") e fica sem acesso sozinho; a Home vazia oferece "Adicionar widget";
  - botão "Criar" no topo do menu lateral, com busca e a tecla C, para tarefa rápida, item e formulário;
  - modais de nova tarefa (Nome, Data limite, Prioridade, Responsável) e de novo item;
  - concluir tarefa na própria Home, com "Desfazer" no aviso.
- **Largura (pedido do meio da rodada):** a grade ocupa a largura toda da área de conteúdo, com margem que cresce com a tela (16 px no celular, 40 px a partir de 1536 px). Saiu o bloco centralizado de 1440 px. A tabela da visualização ganhou coluna de título com largura por faixa de tela e o valor alinhado à direita.
- **Fronteira:** muda o conteúdo da Home e o botão Criar no menu lateral; o resto da casca (menu, barra do topo, trilha) não muda.
- **Descartado:**
  - modal com sombra para Personalizar: escondia a Home enquanto a pessoa mexia nela. O painel é `USlideover` com `:overlay="false"` e `:modal="false"`;
  - `UInputDate`: pede `@internationalized/date`, que o projeto não instala. A data usa `UInput type="datetime-local"`, a decisão do `prazo-final-nas-tarefas`;
  - Criar rápido com o menu ancorado na faixa inteira (slot `#anchor` do `UPopover`): travava o navegador ao carregar. O menu abre pelo botão "Mais".
- **CSS próprio, com motivo:**
  - `_WOutros.vue`, `@keyframes crescer`: as barras do gráfico crescem ao entrar; o Nuxt UI não tem gráfico;
  - `_Personalizar.vue` e `_WMinhasTarefas.vue`, `.lista-move` e `.lista-*`: o `TransitionGroup` só anima por classe; o Nuxt UI não tem lista ordenável.
- **Maquete:** Resumo do BENI, "Mais campos" do modal, "Abrir" e "Ver todas" (só o aviso), a contagem de usos que ordena os atalhos de criar.
- **Ver:** `pnpm dev` → http://localhost:3000/home · `evidencias/rodada1-home.jpg`, `rodada1-menu-criar.jpg`, `rodada1-celular.png`, `rodada1-widget-novo-para-o-membro.jpg`

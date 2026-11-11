# Briefing: Home

## A demanda, como ela veio

> a home do enspace nao é boa hoje. os usuarios sentem que é muito dura e tem poucos atalhos. é feia, pouco flexível etc.
>
> pode pesquisar quickbooks e hubspot como exemplos. ambos trabalham com widgets pra dar liberdade pro user montar a home.
>
> Monday e clickup são outros excelentes exemplos. pesquise PROFUNDAMENTE. se precisar crie conta de usuario pra explorar.
>
> considere também o enspace atual em develop, a nova tela de dashboard de tarefas etc.
>
> talvez atalho pra criar item e criar tarefa também com botao na home. isso pode ser relevante também. ou no menu lateral. enfim... pesquise e decida como prototipar pro enspace.
>
> /deep-research /product-management:competitive-brief /product-management:synthesize-research

## A tela em jogo

- **Início**, o primeiro item do menu lateral, em `/workspaces/<ws>`. A aba do navegador chama a tela de "Home".
- O botão de criar pedido na demanda pode morar na Home ou no menu lateral. Os 2 entram na proposta.

## O que seria sucesso

Quem abre o workspace vê, na Home que montou, o que precisa fazer hoje e cria uma tarefa ou um item em 1 clique, sem atravessar o menu.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (auditoria de UX por persona) antes de desenhar.

- `temas/README.md`: não há tema sobre a Home. Os 6 temas são configurações do sistema, construtor de telas, base de conhecimento, categorias, agenda e plataforma.
- `UX_REPORT.md`: "home", "início" e "tela inicial" só aparecem em 2 fricções vizinhas:
  - **S3-P1 (P2):** a barra do topo usa chaves de tradução como rótulo acessível (`button.home`, `button.back`). O botão da casinha, que leva à Home, não tem nome para o leitor de tela.
  - **S1-F2 (P2):** é sobre a tela inicial da Agenda, não a do workspace.
- O protótipo `menu-lateral` (deste repositório) já propôs um "+" no Início do menu, que cria seção, menu e categoria, e abre item e tarefa como maquete (rodadas 15P a 18). Esta proposta reaproveita a ideia e leva o "+" ao alcance de quem não configura.

**O que isso muda:** não há fricção registrada sobre a Home. O peso da proposta vem da fala dos usuários, trazida pela redatora, e do que o develop mostra abaixo.

## O que o develop faz hoje

Investigado em 11/11/2026, no workspace de exploração, pelo Chrome da usuária.

### A Home

- URL: `https://develop.enspace.io/workspaces/<ws>` (título da aba: "<workspace>/Home").
- De cima para baixo:
  1. Saudação: "Boa tarde, <nome>! 👋" e "Pronto para um dia produtivo? Vamos trabalhar juntos!".
  2. 2 cartões lado a lado: **Tarefas em atraso** e **Tarefas próximas**.
  3. 1 cartão na largura toda: **Tarefas rápidas**.
- Cada cartão tem ícone, título com uma seta para baixo, botão de recarregar, a contagem "Mostrando 1-1 de 1 itens" e a paginação "Página 1 de 1".
- A seta ao lado do título abre um menu com 1 opção só, o próprio título em minúscula ("tarefas em atraso"). Não há outra escolha.
- Cartão vazio: "Nenhuma tarefa em atraso" e o botão "Acessar tarefas".
- Não há como esconder, mover, redimensionar nem acrescentar cartão. A Home é igual para todo membro, e o administrador também não a muda.
- Não há botão de criar na Home, nem atalho para categoria, visualização, formulário ou painel.

![Home logo depois de abrir: os 3 cartões dizem "Nenhuma tarefa", antes de os dados chegarem](evidencias/develop-home-carregando.jpg)

### Onde trava

- **O carregamento parece estado vazio.** Nos primeiros segundos os 3 cartões dizem "Nenhuma tarefa em atraso". "Tarefas rápidas" também diz "em atraso". Depois o cartão de Tarefas rápidas troca para a tarefa que existe. Não há esqueleto de carregamento.
- **O erro da API aparece cru na tela.** Em "Tarefas em atraso" e "Tarefas próximas", a contagem mostra `Mostrando 1-NaN de { "statusCode": 400, "error": "Bad Request", "message": "Filtro inválido" } itens`. Abaixo, o cartão diz "Nenhuma tarefa em atraso", que não é verdade: a tarefa atrasada existe e aparece no cartão de baixo.
- **A Home só fala de tarefas.** Quem trabalha com itens (pedidos, contratos, chamados) não vê nada do que é dele.

![Home depois de carregar: o erro de filtro na contagem dos 2 cartões de cima; o e-mail da linha foi borrado](evidencias/develop-home-erro-de-filtro.jpg)

### Quanto custa criar hoje

| Para | Caminho a partir da Home | Cliques |
|---|---|---|
| Criar tarefa rápida | Tarefas > Rápidas > "+ Nova tarefa" > formulário | 3 até o formulário |
| Criar item | Categorias > <categoria> > Todos > "Criar +" > formulário | 4 até o formulário, e a pessoa precisa saber em qual categoria |
| Criar pela busca (Ctrl+K) | "Digite um comando ou busque..." lista só os menus. "criar" e "nova" respondem "No matching data", em inglês | não dá |

O formulário "Nova tarefa" tem: Nome (obrigatório), Data limite, Descrição (texto rico), Responsável, Colaboradores e Prioridade (Baixa, Normal, Alta, Urgente; Normal marcada).

### O que já existe e serve à Home

- **Painel de tarefas** (Tarefas > Painel, `/tasks/dashboard`), já em develop: números do topo (Abertas agora, Concluídas, Criadas, Vencidas, No prazo, Tempo médio de conclusão), Entrada e saída, Abertas por status, Saúde dos prazos, Prioridade, Pontos, Origem e execução, Atividade, Carga por responsável e a lista de vencidas. O protótipo `painel-de-tarefas` desenhou a grade que se arrasta e redimensiona (`UxGradeDePaineis`) e o botão que mostra e esconde painéis. A Home usa a mesma grade e o mesmo jeito de mexer, para o ENSPACE ter 1 padrão só de painel.
- **Visualizações salvas** das categorias (abas como "Pedidos em aberto", "Urgentes da semana", "Meus itens"): é delas que sai o widget de itens.
- **Formulários** de cada categoria, que aparecem no menu dentro da categoria.
- **Favoritos:** a estrela na trilha do topo, com o atalho Ctrl+B.
- **Agenda**, o sino de notificações e a Knowledge.

### Preparo por API

Nenhum. Toda a investigação aconteceu pela tela.

## A casca da tela, item por item

Copiada de `https://develop.enspace.io/workspaces/<ws>` em 11/11/2026. A base é a casca do `painel-de-tarefas`, conferida de novo no develop.

**Menu lateral**
- Topo: avatar e nome do workspace, slug embaixo, seta para trocar de workspace.
- "Buscar..." com Ctrl K.
- Membro: Início (ativo), Spaceflows, Categorias (expande), Tarefas (expande: Agendadas, Rápidas, Painel), Agenda, `menu.member.reports.label` (a chave de tradução aparece crua; fica como está, é achado), Knowledge (expande).
- Configurações: Visão Geral, Sistema, Estrutura (expande), Gestão de Membros, Interface (expande), E-mails (expande), Integrações (expande), Agentes de IA, Logs.
- Ajuda: Releases, Documentação (abre fora).
- Botão redondo na borda para recolher.

**Barra do topo**
- Recolher menu, voltar, avançar, recarregar, casinha (Home).
- Trilha: "Workspaces > <slug>", com Ctrl B e a estrela.
- Bandeira do idioma, sol (tema), "Suporte", sino com "99+", avatar com a bolinha verde.

**Achados da casca (ficam como estão):**
- `menu.member.reports.label` no menu, sem tradução.
- "No matching data" em inglês na busca.

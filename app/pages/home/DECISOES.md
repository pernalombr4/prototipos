# Decisões: Home

Registro das rodadas. A mais recente em cima.

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

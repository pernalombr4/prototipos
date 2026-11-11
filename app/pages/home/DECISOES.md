# Decisões: Home

Registro das rodadas. A mais recente em cima.

## Rodada 3 · 2026-11-11

- **Pedido (literal):** "alem disso verifique no codigo se os widgets que voce sugeriu fazem sentido, do tipo "tarefas que eu criei e deleguei", faz sentido criar isso? tem no codigo e é ok de mexer? e quais dados vai cruzar pra chegar nisso entao? pq isso tem que estar nos requisitos" e "ao clicar em personalizar, a forma mais clean é realmente abrir uma SIDEBAR? os outros produtos fazem assim tambem? ou de outro modo?"
- **Leitura do código:** a fonte de cada widget, o veredito e os dados que se cruzam estão no `BRIEFING.md`, "De onde vem o dado de cada widget (código)". Essa tabela entra nos requisitos.
- **Mudou:** "Tarefas que delegei" mostra só tarefa rápida. A tarefa programada não grava quem a criou nem quem a delegou como campo (`enlighten-api@develop 5587592e8 api/c-flow-item-tasks/models/c-flow-item-tasks.settings.json:34-158`); a descrição do catálogo diz "Tarefas rápidas que você criou para outras pessoas".
- **Para os requisitos, por esforço:**
  - só front: Minhas tarefas (faixas Hoje e Sem prazo), Tarefas que delegei, Agenda, Gráfico de um painel, Atalhos e Recentes;
  - front e rota nova sobre dado que existe: Itens e Número de uma visualização, contagem "em aberto" das Categorias, Resumo do BENI, guardar a Home;
  - back-end novo: Comunicado e Notas;
  - fora do alcance hoje: prazo de item na Saúde dos prazos (o item não tem prazo próprio) e tarefa programada em Tarefas que delegei.
- **Personalizar:** decisão aberta, à espera da redatora (ver a resposta da rodada).

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

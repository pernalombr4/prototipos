# Decisões: Home

Registro das rodadas. A mais recente em cima.

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

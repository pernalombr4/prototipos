# Decisões

## Rodada 1 · 2026-10-23

- **Pedido (literal):** "precisamos nos inspirar também pra fazer as abas de visualizações personalizadas. estas nao precisam parecer \"abas\" [...] da pra gente se aproveitar do componente de drag and drop, o de dropdown e outras coisas. nao pode ter a exata mesma aparencia, senao confunde o user, mas precisa ser consistente com o design das folders [...] foque no construtor de nova visualiaçoes somente na tela nova de itens"; "e ai melhore a usabilidade dele"; validação: "Validado. Rode o /deep-research e o /product-management:synthesize-research e monte o protótipo."
- **Mudou:** barra em pílula clara. A ativa tem fundo suave na cor de destaque, texto forte e ícone na cor de destaque. Sem traço embaixo: o traço é a marca das folders.
- **Mudou:** da barra de folders, iguais: arrastar (a própria pílula segue o mouse, troca na metade da vizinha, soltar no lugar não faz nada, aviso com Desfazer), seta ⌄ na ativa com o menu, botão direito, "+N" com busca e "+" na ponta.
- **Mudou:** "Itens" fica sempre em 1º, não se arrasta, não se renomeia e não se exclui; o menu explica por quê.
- **Mudou:** nome cortado pela largura (até 10rem), com reticências. O tooltip mostra o nome inteiro, o resumo ("Tabela · Status é Em análise · Ordenado por Vencimento, crescente · Todos veem"), a contagem de itens e a dica de arrastar.
- **Mudou:** a ativa nunca vai para o "+N"; se não cabe, entra no lugar da última que cabia (regra do Polaris). O "+N" mostra a contagem de cada visualização e o menu "⋯" de cada linha.
- **Mudou:** menu da visualização em 3 grupos: Renomear (F2), Configurar, Duplicar, Copiar link; "Só para mim": Fixar no início, Mover para a esquerda, Mover para a direita; "Para todos": Abrir primeiro para todos, Excluir.
- **Mudou:** renomear na própria pílula, por clique duplo ou F2. Enter grava, Esc desiste. Nome repetido não grava e avisa.
- **Mudou:** criar em 1 passo num popover preso ao "+": Nome, Exibir como (Tabela ou Kanban, com Agrupar por), "Começar com os filtros e colunas atuais" ligado e Quem vê. A visualização criada abre na hora; o aviso tem o atalho Configurar.
- **Mudou:** linha de filtros abaixo da barra de ferramentas, com cada filtro em chip removível e "+ Filtro" rápido por campo de seleção.
- **Mudou:** mexer em filtro, ordenação (também pelo cabeçalho da tabela) ou coluna cria um rascunho. A pílula ganha um ponto na seta; as não ativas com rascunho ganham o ponto depois do nome. A linha mostra "Alterações não salvas", Descartar e Salvar, com "Salvar como nova visualização" na seta.
- **Mudou:** em Itens e para quem só lê, o único caminho é "Salvar como nova visualização" (Polaris e SAP).
- **Mudou:** painel "Configurar visualização" à direita, sem cobrir a tabela, que muda ao vivo. Seções: nome, ícone e descrição; Exibição; Colunas (arrastar, subir e descer, olho para ocultar); Filtros ("Só itens meus", "Só itens dos meus grupos" e linhas por campo, sem 2º modal); Ordenação em vários níveis; Quem vê.
- **Mudou:** o filtro novo nasce num campo de seleção ainda sem filtro. Repetir o campo ("Status é Em análise" e "Status é Aprovado") zerava a tabela.
- **Mudou:** a visualização ativa vai para o endereço (`?view=`), e Copiar link copia esse endereço.
- **Mudou:** Duplicar cria na hora, ao lado da original, com "(cópia)", e o aviso tem o atalho Renomear.
- **Mudou:** Excluir pede confirmação com o nome e o botão "Excluir visualização", porque some para todos.
- **Fronteira:** muda a barra de visualizações, o criar, o configurar e a linha de filtros. Não muda a casca, a barra de ferramentas (busca, período, ícones, Novo registro), a tabela nem o quadro.
- **Escolha sem resposta dela, assumida:** ordem da barra e fixar valem só para quem fez (como "Só para mim" das folders); "Abrir primeiro para todos" vale para o workspace; quem pode editar salva para todos. As 3 estão em "Perguntas em aberto" no `PESQUISA.md`.
- **Descartado:** sublinhado na ativa. Motivo: é a marca das folders; ela pediu que as 2 barras não se confundam.
- **Descartado:** dropdown único, como no Twenty e no Attio. Motivo: a demanda pede barra, e o fórum do monday registra que visualização escondida em dropdown "não se acha".
- **Descartado:** rolagem horizontal com setas. Motivo: é o que a tela faz hoje, e a NN/g mostra que as pessoas ignoram setas laterais.
- **Descartado:** texto da ativa na cor de destaque. Motivo: 2,88:1 sobre o fundo rosa claro, abaixo dos 4,5:1 da WCAG 1.4.3. Passou para `text-highlighted` (16,65:1); a cor de destaque ficou no fundo e no ícone.
- **Descartado:** `autoresize` na descrição do painel. Motivo: a aba do Chrome parou de responder ao abrir o painel numa visualização com descrição; sem o `autoresize`, não repetiu. **Causa não confirmada:** depois, a mesma aba mostrou a página respondendo a 2 quadros por segundo com a janela coberta, que também explica o sintoma.
- **Não deu:** arrastar dentro da lista do "+N". Por quê: o `UCommandPalette` não reordena. O caminho de 1 clique está no menu "⋯" de cada linha (Mover para a esquerda e para a direita).
- **Não deu:** conferir o `isOwner` no produto. Por quê: o filtro só aparece com o nome técnico; o protótipo escreve "itens em que você é o dono", e isso precisa de confirmação do time.
- **Não deu:** rodar o typecheck. Por quê: o repositório não tem `vue-tsc`; o servidor local compilou e as telas rodaram sem erro no console.
- **Maquete:**
  - nada persiste: recarregar volta ao estado inicial;
  - Copiar link tenta a área de transferência e sempre mostra o aviso;
  - na cópia de hoje, o filtro por campo personalizado abre o submodal e não grava, e a alça das colunas não arrasta;
  - barra de ferramentas, Novo registro, ações da linha e cartões do quadro são cópia sem ação;
  - "Tela estreita" limita a área a 44rem para simular o aperto sem mexer na janela.
- **Crítica e acessibilidade:**
  - contraste da ativa corrigido (ver Descartado);
  - o `UTabs` põe o `aria-label` na raiz e não no `tablist`; o protótipo põe o rótulo no `tablist` depois de montar, e o requisito para o produto é rotular o `TabsList`;
  - teclado conferido: setas e Enter (do `UTabs`, ativação manual), Ctrl + Shift + seta, F2, Shift + F10 (abre o menu da ativa), busca e Enter no "+N";
  - alvos: pílula com 32px de altura e seta com 24px, dentro do mínimo de 24px da WCAG 2.5.8;
  - subtítulo do painel cortado com reticências: passou a quebrar linha;
  - sem correção: o tooltip repete "Arraste para reordenar" em todo hover, o que pesa para quem usa todo dia; fica para ela decidir;
  - sem correção: o cartão do quadro (`EnKanbanBoard`) é alto e mostra 3 por coluna; é do SDK, fora da fronteira.
- **Ver:** `http://localhost:3000/visualizacoes-da-tela-de-itens` · `https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens`
  - barra e tooltip: `evidencias/proposta-barra.jpg`;
  - "+N" com busca e contagem: `evidencias/proposta-mais.jpg`;
  - criar em 1 passo: `evidencias/proposta-criar.jpg`;
  - menu (Shift + F10) e aviso de ordem com Desfazer: `evidencias/proposta-menu-e-aviso.jpg`;
  - painel com mudança não salva: `evidencias/proposta-painel-nao-salva.jpg`;
  - estado vazio: `evidencias/proposta-vazia.jpg`;
  - tela estreita: `evidencias/proposta-estreita.jpg`;
  - cópia de hoje: `evidencias/hoje-estreita.jpg`, `evidencias/hoje-menu.jpg`, `evidencias/hoje-modal.jpg`;
  - a branch do PR: `evidencias/develop-01-modal.jpg` a `develop-05-aperto.jpg`.

### Como a barra foi montada

- Consultas ao MCP `nuxt-ui`: `get-component-metadata` de Tabs (variantes, `activationMode`, slots `default`, `trailing` e `list-trailing`) e de Slideover (`modal`, `overlay`); a escolha foi não usar o Slideover, para a tabela continuar visível e encolher ao lado do painel.
- Peças: `UTabs`, `UContextMenu`, `UDropdownMenu`, `UPopover` + `UCommandPalette`, `UTooltip`, `UInput`, `USelect`, `USelectMenu`, `USwitch`, `URadioGroup`, `UFieldGroup`, `UModal`, `useToast`, `EnTable`, `EnKanbanBoard`, `EnLayout`.
- Sem CSS próprio: nenhum `<style>`, `:deep()` nem `!important`.
- O `ModelView` do `enspace-sdk-schemas` tipa o mock. Invenções marcadas no `mocks.ts`: ordenação em vários níveis (`config.sorts`), `fixada` e a contagem.

## Rodada 2 · 2026-10-23
- **Pedido (literal):** "pode tirar as opçoes de mover pra esquerda ou pra direita"; "esse form do print ta visualmente bagunçado"; "alteraçoes nao salvas e o botao de salvar estao aparecendo no topo e na base ao mesmo tempo, mas na base faltando a opçao do dropdown ao lado do botao de salvar"; "uma view fixada deve ir o mais pra esquerda possivel. hoje isso nao ta ocorrendo."; "deve haver arraste dentro do dropdown do print e esses numeros nao fazem sentido aí."
- **Mudou:** saíram "Mover para a esquerda" e "Mover para a direita" do menu.
- **Mudou:** fixar leva a visualização logo depois de Itens, antes das outras fixadas. A causa de não ir: a função gravava a lista 2 vezes seguidas, e a 2ª lia a lista antiga.
- **Mudou:** a lista do "+N" arrasta para mudar a ordem (o mesmo arrasto por ponteiro da barra, com linha-guia), sem os números de itens, com a dica "Arraste para mudar a ordem."; com busca preenchida não arrasta.
- **Mudou:** com o painel aberto, salvar e descartar ficam só no rodapé dele; o rodapé ganhou a seta com as outras formas de salvar.
- **Mudou:** formulário do painel refeito: seções separadas por linha, rótulo sempre em cima, ícone e nome no mesmo grupo, cada filtro num cartão com o campo em cima e condição e valor lado a lado (sem a coluna "Onde/e" que empurrava os campos), ordenação no mesmo cartão em 1 linha, colunas visíveis e ocultas com o mesmo desenho de linha.
- **Mudou:** depois de soltar um arrasto, o clique seguinte não é mais engolido (antes, o 1º clique no "+N" depois de arrastar não abria a lista).
- **Pedido (literal), na mesma rodada:** "o botao de criar pode deixar mais ou menos como ta hoje em dia [...] pode deixar como \"+ Visualização\" o texto ou algo do tipo e o texto como \"criar visualização\" ou \"Nova visualização\""
- **Mudou:** botão "+ Visualização" com tooltip "Nova visualização", como o "+ View" do ClickUp.
- **Pedido (literal), na mesma rodada:** "a experiencia de criar ta ruim. tem um atalho (popoover) no botao de criar, mas rcia com qualquer configuraçao basica e depois o user tem que descobrir que ele pode editar [...] talvez a view ja deva ser criada com o drawer de configuraçao aberto"
- **Mudou:** "+ Visualização" cria e abre o painel em modo de criação: título "Nova visualização", nome em foco e obrigatório, "Começar de" (visualização atual ou do zero), colunas, filtros, ordenação e quem vê, com a tabela mostrando o resultado. A pílula "Nova visualização" acompanha o nome digitado. Rodapé: Cancelar e Criar visualização. Nada grava antes de criar; cancelar (ou fechar o painel) volta para a visualização de origem.
- **Pedido (literal), na mesma rodada:** "pro user que é owner/full tudo oq ele faz deve ser possivel salvar pra todos ou só pra ele mesmo"; "a reordenaçao deve ter botao de aplicar minha ordem para todos la no menu geral (no +N) e nos menus contextuais das views tambem [...] recuperar a ordem padrão [...] se for outro tipo de user essas opçoes nao existem. tem q prototipar as 2 coisas (full/owner e standard/viewer)"
- **Mudou:** andaime "Perfil": Owner ou Full; Standard ou Viewer (no lugar de "Permissão").
- **Mudou:** salvar conforme o perfil:
  - Owner ou Full, visualização de todos: "Salvar para todos", com "Salvar só para mim" e "Salvar como nova visualização" na seta;
  - Standard ou Viewer, e a Itens do sistema: "Salvar só para mim", com "Salvar como nova visualização" na seta;
  - visualização que só a pessoa vê: "Salvar".
- **Mudou:** "Salvar só para mim" grava a versão da pessoa por cima da de todos. A pílula ganha um ícone de pessoa, o tooltip explica, e o menu oferece "Voltar à versão de todos" (com Desfazer).
- **Mudou:** só para Owner ou Full, no rodapé do "+N" e no menu de cada visualização: "Aplicar minha ordem para todos" (grupo "Para todos") e "Recuperar a ordem padrão" (grupo "Só para mim"), desligados quando a ordem da pessoa já é a padrão. Recuperar também desafixa, porque fixar faz parte da ordem pessoal.
- **Mudou:** Standard ou Viewer não renomeia nem exclui visualização de todos, não vê o grupo "Para todos" e cria visualização só para si: no painel, "Só eu" vem marcado, as outras opções aparecem desligadas e uma nota explica que só Owner e Full mudam quem vê.
- **Mudou:** o mock deixou de usar `structuredClone` (falhava com objetos reativos aninhados depois de recuperar a ordem) e passou a copiar por JSON.
- **Fronteira:** muda a barra, o "+N", o menu, o criar, o painel e o salvar; não muda a casca, a barra de ferramentas, a tabela nem o quadro.
- **Descartado:** o popover de criar (rodada 1) e o `_CriarVisualizacao.vue`. Motivo: criava com o mínimo e escondia que a visualização se configura depois; ela pediu o painel aberto na criação. O print `evidencias/proposta-criar.jpg` fica como registro da rodada 1.
- **Descartado:** contagem de itens no "+N". Motivo: pedido dela. A contagem continua no tooltip da pílula.
- **Descartado:** arrasto nativo do navegador na lista do "+N". Motivo: não roda pela automação de teste; o arrasto por ponteiro dá o mesmo comportamento da barra.
- **Não deu:** reproduzir 1 sumiço da visualização em criação. Por quê: aconteceu 1 vez, ao clicar em "+ Visualização" enquanto um menu de contexto fechava; nas tentativas seguintes não repetiu.
- **Maquete:** a versão "só para mim" e a ordem de todos vivem na memória da página; trocar de perfil não troca de pessoa (a mesma pessoa vê as 2 permissões).
- **Crítica e acessibilidade:**
  - sem "Mover para a esquerda/direita", o arrasto da barra e do "+N" fica sem o caminho de 1 clique que a WCAG 2.2 pede (critério 2.5.7). Continuam Ctrl + Shift + seta na barra e na lista do "+N"; o requisito do 1 clique fica para ela decidir;
  - as colunas do painel ainda usam o arrasto nativo, mantêm os botões de subir e descer, e a automação não as testou.
- **Ver:** `http://localhost:3000/visualizacoes-da-tela-de-itens`
  - criar com o painel aberto: `evidencias/r2-criar-painel.jpg`;
  - criar como Standard ou Viewer: `evidencias/r2-criar-standard.jpg`;
  - "+N" com arrastar e as ações de ordem: `evidencias/r2-mais-com-ordem.jpg`;
  - salvar do Owner ou Full: `evidencias/r2-salvar-owner.jpg`;
  - menu do Owner ou Full, com a versão só sua: `evidencias/r2-menu-owner.jpg`;
  - menu do Standard ou Viewer: `evidencias/r2-menu-standard.jpg`.

## Rodada 3 · 2026-10-23
- **Pedido (literal):** "no dropdown do +N deve por padrao aparecer o simbolo de arraste em todos, nao so com hover. o menu de 3 pontos sim deve seguir aparecendo só com hover"
- **Mudou:** a alça de arrastar aparece em todas as linhas do "+N" sem hover; o "⋯" continua só no hover ou no foco.
- **Pedido (literal), na mesma rodada:** "na hora que o user colocar um filtro ali na tela, no uso dele mesmo, deve aparecer pra ele a opçao de tornar aquilo padrao se quiser, num menui flutuante na base inferior. isso acontece em outros produtos"
- **Mudou:** mexeu em filtro, ordenação ou coluna, aparece uma barra flutuante centrada na base da tela: "Você alterou <nome>", a ajuda ("Salve para tornar esta versão o padrão desta visualização." para quem salva para todos; "Salve para manter esta versão como a sua." para quem salva só para si), Descartar e o botão de salvar com a seta. Saiu o salvar da linha de filtros. Com o painel aberto, a barra some e quem salva é o rodapé do painel.
- **Pedido (literal), na mesma rodada:** "uma view que fixei primeiro sempre fica na posiçao 1 de fixo. se eu fixar outra depois ela vai pra depois da primeira fixada, à direita da primeira fixada. arrume isso. é regra do protótipo"
- **Mudou:** as fixadas ficam juntas depois de Itens, na ordem em que foram fixadas: a nova fixada entra à direita da última fixada. Conferido: fixar "Vencendo em 30 dias" e depois "Alta prioridade" deixa Itens, Meus contratos, Vencendo em 30 dias, Alta prioridade.
- **Pedido (literal), na mesma rodada:** "esse sistema de views personalizdas existe tambem pras telas de tarefas rápidas e agendadas [...] veja se batem os mesmos requisitos da tela de itens ou tem configuraçoes que sejam substancialmente diferentes [...] se nao for substancialmente diferente, basta no doc de requisitos escrever pro dev que ele precisa usar a mesma logica"
- **Mudou:** `REQUISITOS.md` novo, com os requisitos das rodadas 1 a 3 e o grupo "Tarefas Rápidas e Agendadas". Conferido na branch do PR 2936: as 2 telas têm a mesma barra e o mesmo construtor. Diferem só os parâmetros: os campos (fixos da tarefa), o "Agrupar por" do Kanban (Rápidas: Status, Responsável, Prioridade; Agendadas: Status da Tarefa) e os filtros automáticos ("Minhas Tarefas", "Aberto", "Atrasado", "Atribuídos", "Tarefas Externas", "Tarefas Internas", já com nome legível). Conclusão: a mesma lógica, com uma tabela de parâmetros.
- **Mudou:** o painel ganhou, no tipo Kanban, a seção Cartão ("Título do cartão", "Texto de apoio", "Etiquetas", "Pessoa", "Data"), gravada no `config.cardConfig` do schema, e a Ordenação passa a se chamar "Ordem dos cartões em cada coluna". Achado da comparação: o construtor de hoje tem o "Construtor visual de cartão" e o "Ordenar cartões em cada coluna por" no Kanban, inclusive na tela de itens; o protótipo não tinha porque a rodada 1 não abriu o Kanban do construtor.
- **Fronteira:** muda o "+N", o salvar, o fixar e o Kanban do painel; não muda a casca, a barra de ferramentas, a tabela nem o cartão do `EnKanbanBoard`.
- **Não deu:** mostrar o texto de apoio inteiro no cartão do quadro. Por quê: o cartão do `EnKanbanBoard` corta a linha do conteúdo; é do SDK, fora da fronteira.
- **Não deu:** print da barra flutuante no perfil Standard. Por quê: a janela do Chrome ficou em segundo plano e o print estourou o tempo; a página respondeu e mostrou "Salvar só para mim" com a ajuda certa (conferido pelo DOM).
- **Crítica e acessibilidade:** a barra flutuante é uma região com nome ("Alterações não salvas"); o ponto de alerta repete o texto, não depende só da cor.
- **Ver:** `http://localhost:3000/visualizacoes-da-tela-de-itens` · `REQUISITOS.md`
  - barra flutuante de salvar: `evidencias/r3-barra-flutuante.jpg`;
  - "+N" com a alça em repouso: `evidencias/r3-mais-com-alca.jpg`;
  - cartão do Kanban no painel: `evidencias/r3-cartao-kanban.jpg`.

## Rodada 4 · 2026-10-23
- **Pedido (literal):** "o processo de criaçao de nova view ainda ta ruim. veja como é no clickup. entre la e explore. pode copiar o fluxo de usabilidade deles na criaçao de uma nova view. o nosso ainda ta perguntando se copia "a atual", sendo q o user ta numa nova, nem sabe mais qual é atual... [...] a logica de selecionar antes se é tabela ou kanban e entrar com uma visualizaçao "generalizada" ali pode ser interessante."
- **Referência (ClickUp, explorado na conta dela em 23/10/2026):** "+ Visualização" abre um catálogo de tipos (ícone, nome e 1 linha de descrição) com as caixas "Visualização privada" e "Fixar visualização" no rodapé. Escolher o tipo cria na hora uma visualização com o nome do tipo e configuração genérica, abre-a e abre o painel "Personalizar visualização" com o nome selecionado. Prints: `evidencias/ref-clickup-1-tipos.jpg`, `ref-clickup-2-painel.jpg`, `ref-clickup-3-filtro.jpg`.
- **Mudou:** "+ Visualização" abre o catálogo "Nova visualização" (`_CatalogoDeTipos.vue`) com Tabela e Kanban e as caixas "Só para mim" e "Fixar no início". Para Standard ou Viewer, "Só para mim" vem marcado e travado.
- **Mudou:** o tipo escolhido cria a visualização genérica com o nome do tipo ("Tabela", "Tabela 2"): Tabela com cada coluna, sem filtro e sem ordenação; Kanban agrupado por Status, com o cartão sem etiqueta. O painel abre com o nome selecionado: digitar já troca.
- **Mudou:** no modo de criação, cada ajuste entra direto na visualização nova. O rodapé tem só "Descartar visualização" e "Concluir"; Enter no nome e o X do painel também concluem.
- **Pedido (literal), na mesma rodada:** "quando o user editar algum filtro de visualizaçao ou alguma outra coisa q se aplique (tipo ordenaçao), deve haver uma logica tipo essa do notion (print) aparecendo num menu contextual flutuante na base. [...] se a pessoa nao mexer ali, o filtro simplesmente aplica pra ela naquele momento. [...] pode ser um "x" pra ela fechar esse contextual"
- **Mudou:** a barra flutuante da rodada 3 já tinha Descartar e "Salvar para todos" com "Salvar como nova visualização" na seta (o "Reset" e o "Save for everyone" do Notion). Ganhou o X: fecha sem salvar, o ajuste continua aplicado e o ponto continua na pílula. Outra mudança na mesma visualização traz a barra de volta.
- **Fronteira:** muda o "+ Visualização", o modo de criação do painel e a barra flutuante; não muda a casca, a barra de ferramentas, a tabela nem o cartão do `EnKanbanBoard`.
- **Descartado:** "Começar de" com "Visualização atual" e "Do zero" (rodadas 2 e 3). Motivo: dentro da visualização nova, "atual" já não diz qual era; o tipo escolhido antes resolve o ponto de partida.
- **Achado:** o cartão do `EnKanbanBoard` tem altura fixa (`h-48` no `EnKanbanCard`). Com título, texto de apoio, etiqueta, pessoa e data, o texto de apoio fica com 7 px e some (já aparecia em `r3-cartao-kanban.jpg`). O Kanban genérico nasce sem etiqueta para o cartão abrir legível; a regra de escolha dos campos ficou em P008 no `REQUISITOS.md`.
- **Corrigido na rodada:** o nome selecionado ao criar perdia o texto a cada tecla (o `watch` disparava a cada mudança do rascunho e selecionava o campo de novo).
- **Atenção:** a visualização "Quadro" criada no ClickUp durante a exploração ficou no "Project 1" da conta dela.
- **Ver:** `http://localhost:3000/visualizacoes-da-tela-de-itens` · `REQUISITOS.md` (grupo Criar, RF086 e RF087)
  - catálogo de tipos: `evidencias/r4-catalogo.jpg`;
  - Kanban genérico criado, com o painel e o nome selecionado: `evidencias/r4-kanban-criado.jpg`;
  - barra flutuante com o X e a seta de salvar: `evidencias/r4-barra-flutuante.jpg`.

## Rodada 5 · 2026-10-23
- **Pedido (literal):** "agora va nessa tela do notion, clique no botao de filtro destacado no print e coloque pra criar regra avançada. explore o construtor de filtros e regras do notion e do clickup. pegue como inspiraçao pro nosso caso de construção de views e de filtragem no botao direto de filtro na tabela tambem, e nas colunas."
- **Referência (Notion e ClickUp, explorados na conta dela em 23/10/2026):** o Notion tem 2 camadas: o chip por campo (opções em caixas, "Add to advanced filter") e o filtro avançado ("Where", "And" ou "Or" por grupo, "Add filter group", "Turn into group"). O ClickUp tem 1 caixa "Filtros" com "Adicionar filtro agrupado" em cada regra. O menu da coluna do Notion tem "Filter"; o do ClickUp não. Prints: `evidencias/ref-notion-1-filtro-avancado.jpg`, `ref-notion-2-filtro-simples.jpg`, `ref-notion-3-menu-da-coluna.jpg`, `ref-clickup-4-filtros.jpg`. O filtro de teste no Notion e no ClickUp foi desfeito: a página dela ficou com as 2 regras que já tinha.
- **Pedido (literal), com o aceite da proposta:** "pode aplicar suas sugestoes. e esse popover do print ta horrivel. totalmente mal organizado. e nao precisa dizer qtd de itens. da pra elaborar melhor visualmente isso aí, com umas badges e tudo mais, mas sem exageros"
- **Mudou:** a dica da pílula ganhou partes: nome e descrição; o tipo e quem vê em etiquetas; "Filtros" e "Ordenação" em 2 colunas, 1 etiqueta por filtro e por nível; os atalhos no rodapé. Saiu a contagem de itens. O filtro avançado entra parte por parte, com "ou" entre as partes quando o conector é Ou.
- **Mudou:** a linha de filtros segue o Notion. Cada filtro por campo é um chip ("Status: Em análise, Aprovado") com as opções em caixas, "Limpar seleção" e o "⋯" com "Excluir filtro" e "Levar para o filtro avançado". O chip sem valor não filtra e fica tracejado.
- **Mudou:** o filtro avançado (chip "N regras") tem "Onde", "E" ou "Ou" na 2ª linha, grupo de 1 nível num fundo próprio, "Duplicar", "Transformar em grupo" e "Desfazer o grupo". Ele vale junto com os chips e os filtros automáticos. A regra sem valor não conta, nem num grupo "Ou".
- **Mudou:** "+ Filtro" lista os campos com busca e termina em "Filtro avançado". O botão Filtros da barra de ferramentas, que hoje não faz nada no protótipo, abre essa lista.
- **Mudou:** o painel Configurar usa o mesmo construtor: "Por campo" e "Filtro avançado". No painel, que é estreito, o conector vai em cima da regra.
- **Mudou:** o título da coluna abre um menu no botão direito (ou Shift + F10): "Ordenar crescente", "Ordenar decrescente", "Filtrar" (abre o chip do campo) e "Ocultar coluna".
- **Mudou:** "é" e "não é" num campo de seleção ou de pessoa aceitam várias opções. Nos mocks, os filtros de seleção passaram de `eq` para `in` com lista.
- **Pedido (literal), na mesma rodada:** "no momento em que o user clicar no +N, nao devem aparecer so os que estao ocultos, mas os que ja estao na barra tambem. nao é simplesmente um lugar onde se armazena o que nao ta cabendo. é um editor completo ali."
- **Mudou:** o "+N" lista todas as visualizações, na ordem da barra, com a divisória "Não cabem na barra". Arrastar uma linha para cima da divisória leva a visualização para a barra. A linha aberta tem destaque e a marca de aberta. O clique duplo no nome renomeia na própria linha. O botão existe mesmo sem visualização fora da barra, só com a seta.
- **Fronteira:** muda a dica da pílula, o "+N", a linha de filtros, a seção Filtros do painel e o menu da coluna; não muda a casca, a barra de ferramentas (o botão Filtros só ganhou ação), a tabela nem o cartão do `EnKanbanBoard`.
- **Achado:** o `EnTable` não tem slot de cabeçalho, só `cell-{key}`, `actions`, `empty` e `pagination`. O menu da coluna abre no botão direito porque não há onde pôr a seta no título. Ficou em RI006 e P009 do `REQUISITOS.md`.
- **Achado:** o `ModelView` guarda os filtros numa lista em que tudo vale junto (`field_filters`). A busca da API já aceita grupos (`_where` com `_and` e `_or`). O filtro avançado pede um formato novo na visualização (RI005).
- **Suposição:** grupo dentro de grupo em 1 nível (S003). O Notion aceita mais; 1 nível cobre "A e (B ou C)".
- **Sem evidência visual:** a dica da pílula. Ela só abre com o mouse parado sobre a pílula, e o print levaria o ponteiro. Conferida na tela em "Vencendo em 30 dias" e "Revisão trimestral".
- **Ver:** `http://localhost:3000/visualizacoes-da-tela-de-itens` · `REQUISITOS.md` (RF004, RF034, RF056, RF057, RF070, RF094 a RF122, RI005, RI006)
  - chip por campo, com 2 opções marcadas: `evidencias/r5-chip-simples.jpg`;
  - filtro avançado com grupo: `evidencias/r5-filtro-avancado.jpg`;
  - "+ Filtro" aberto pelo botão Filtros: `evidencias/r5-botao-filtros.jpg`;
  - menu da coluna Área: `evidencias/r5-menu-da-coluna.jpg`;
  - seção Filtros do painel: `evidencias/r5-painel-filtros.jpg`;
  - "+N" como editor de todas, depois de renomear na linha: `evidencias/r5-mais-editor.jpg`.

## Rodada 6 · 2026-10-23
- **Pedido (literal):** "perceba que o botao travado na extrema direita nao faz bem ao ux. se temos poucas pastas, o user demora pra perceber. por padrao notion e clickup deixam ao lado, como nos prints"
- **Mudou:** o botão da lista ("+N ⌄", ou só "⌄" quando tudo cabe) e o "+ Visualização" vêm logo depois da última pílula visível, na tela larga e na estreita. Antes ficavam presos na ponta direita da barra.
- **Mudou:** o fim da lista do "+N" ganhou "Nova visualização", como o "New view" do Notion. Ela fecha a lista e abre o catálogo de tipos no "+ Visualização".
- **Corrigido na rodada:** o catálogo aberto pela lista fechava sozinho, porque o foco voltava para o botão "+N". A lista não devolve o foco quando a ação é "Nova visualização".
- **Fronteira:** muda só o lugar dos 2 botões e o fim da lista do "+N".
- **Ver:** `http://localhost:3000/visualizacoes-da-tela-de-itens` · `REQUISITOS.md` (RF007, RF123)
  - tela larga com 4 visualizações: `evidencias/r5-botoes-junto-poucas.jpg`;
  - tela estreita com 18, lista aberta: `evidencias/r5-botoes-junto-estreita.jpg`.

## Rodada 7 · 2026-10-23
- **Pedido (literal):** "pode adicionar as opçoes de ocultar visualização e de minimizar tambem (minimizar deixa so o icone). pode fazer com que o dropdown q é o editor apareça somente se tiver quantidade que nao da pra mostrar em tela. sem isso, se todas as views estao cabendo na tela, só o "+ visualizaçao" deve aparecer"
- **Mudou:** o grupo "Só para mim" do menu ganhou "Minimizar" (a pílula fica só com o ícone; o nome continua no tooltip e no nome acessível) e "Ocultar da barra" (a visualização sai da barra e fica na lista do "+N", em cinza, com o ícone de oculta). Os 2 têm o caminho de volta: "Mostrar o nome" e "Mostrar na barra". Ocultar avisa com Desfazer.
- **Mudou:** o "+N" só aparece quando alguma visualização fica fora da barra, porque não cabe ou porque foi ocultada. Quando tudo cabe, a barra termina em "+ Visualização". Isso desfaz o botão "⌄" sozinho da rodada 5.
- **Mudou:** a visualização oculta, aberta pela lista, aparece na barra enquanto está aberta (a mesma regra da ativa que não cabe).
- **Regra:** "Itens" pode ser minimizada e não pode ser ocultada. Ocultar e minimizar são de cada pessoa, como a ordem e as fixadas (RN002).
- **Suposição:** "Recuperar a ordem padrão" não mostra as ocultas nem tira a minimização (S004).
- **Fronteira:** muda o menu da pílula, a barra e a lista do "+N".
- **Ver:** `http://localhost:3000/visualizacoes-da-tela-de-itens` · `REQUISITOS.md` (RN002, RF005, RF021, RF119, RF125 a RF129, S004)
  - menu com Minimizar e Ocultar da barra: `evidencias/r7-menu-ocultar-minimizar.jpg`;
  - barra com "Quadro por status" minimizada e "Vencendo em 30 dias" oculta ("+1"): `evidencias/r7-barra-minimizada-e-oculta.jpg`;
  - lista do "+N" com a oculta em cinza: `evidencias/r7-lista-com-oculta.jpg`.

## Requisitos em 2 documentos · 2026-10-23
- **Pedido (literal):** "separe 2 requisitos: um é um pedido de mudança na estrutura do construtor de filtros da tela (os filtros rapidos sao diferenets e os compelxos sao regras, com um construtor diferente...) tudo o que muda na logica e no front tem que ser relatada. a outra parte é se ater 100% às mudanças pertinentes ao próprio construtor de visualizaçoes ali"
- **Mudou:** `REQUISITOS-FILTROS.md` (novo) é o pedido de mudança dos filtros: como é hoje (H1 a H9, conferidos na branch), o que muda na lógica, o que muda no front, os requisitos, as interfaces e o que está em aberto. `REQUISITOS.md` ficou só com o construtor de visualizações. Os requisitos que mudaram de documento mantêm o ID.
- **Achado na conferência:** a tabela da branch já tem, no título de cada coluna, ordenar, funil de filtro e alfinete de fixar; o ícone de filtros da barra de ferramentas abre a gaveta "Filtros por campo"; o construtor já oferece "Inclui um dos" e "Não inclui nenhum dos". O RI006 foi reescrito: falta slot de cabeçalho no `EnTable` do SDK, não na tabela da branch.
- **Novos:** RF130 a RF134 (funil abre o chip, ordenar e alfinete ficam, a gaveta sai, os 2º modais saem, rótulo no lugar do nome técnico), RI007 (data relativa), RNF003 e P010 a P013.
- **Ver:** `REQUISITOS-FILTROS.md` · `REQUISITOS.md`
  - funil da coluna, hoje: `evidencias/develop-06-funil-da-coluna.jpg`;
  - gaveta "Filtros por campo", hoje: `evidencias/develop-07-gaveta-de-filtros.jpg`;
  - 2º modal "Adicionar Filtro" do construtor, hoje: `evidencias/develop-08-filtro-da-visualizacao.jpg`.

## Requisitos em 3 épicos · 2026-11-03
- **Pedido (literal):** "veja como eles se dividem em stories de acordo com as novas regras de escrita de requisitos e edite os docs de requisito com base nisso [...] divida em quantos epicos forem necessarios. mas sem exagerar só pra querer fragmentar."
- **Mudou:** `REQUISITOS.md` e `REQUISITOS-FILTROS.md` saíram (ficam no git). No lugar, 3 épicos em `requisitos/`, cada um com o `epico.md` e 1 documento por parte, no molde da skill `requisitos` (Relevância em cada tabela, padrão de qualidade no épico, parte que se basta):
  - `requisitos/filtros/`, "Filtros da tela de itens", em 4 partes: linha de filtros e chip, menu da coluna, filtro avançado, filtros no construtor. O "Como é hoje" (H1 a H9) e o que muda na lógica e na tela ficaram no `epico.md`, agora por parte;
  - `requisitos/barra-de-visualizacoes/`, "Barra de visualizações", em 5 partes: pílulas e lista do "+N", menu e renomear, reordenar e fixar, ordem para todos, minimizar e ocultar;
  - `requisitos/criar-configurar-e-salvar/`, "Criar, configurar e salvar visualização", em 3 partes: alterações não salvas e salvar, painel Configurar, criar pelo catálogo.
- **Por que 3 e não 4 ou 5:** cada épico vai ao cliente sem o outro. O filtro avançado ficou como parte do épico de filtros: ele mora na linha de filtros (chip "N regras", "+ Filtro") e usa a mesma condição por tipo de campo (RN008), então não se lança sozinho. "Alterações não salvas e salvar" ficou como parte 1 do épico de criar e configurar: sozinha teria 1 documento só, sem épico.
- **Corte das partes:** o que depende de mudança no back ficou fora da base: a árvore do filtro avançado (RI008, parte 3 dos filtros) e a ordem de cada pessoa (RI003, parte 3 da barra). A parte 1 dos filtros passa de 1,5 vez a mediana (18 linhas contra 10,5) e ficou inteira: linha, "+ Filtro" e chip só funcionam juntos.
- **Saíram do texto** (o dev não começou; a numeração fica com o buraco):
  - RF002 (cor da pílula ativa) e RNF001 (contraste): viraram a linha "Exceção deste épico" do padrão de qualidade da barra;
  - RNF002 e RNF003 (3 idiomas sem texto cortado): padrão de qualidade;
  - RF028 e RF127 (aviso com Desfazer ao renomear e ao ocultar): viraram a RN010, 1 regra para cada mudança da barra;
  - RF074 (as tarefas seguem os documentos): virou o "Onde vale" de cada épico, com a tabela de parâmetros na RN009 (filtros) e na RN013 (criar e configurar);
  - RF075 (filtros automáticos das tarefas): entrou no critério do RF056; RF076 (nome técnico nas tarefas): entrou no RF055;
  - RF110 (filtro vira alteração não salva): é o RF029;
  - RF042: já estava removido.
- **Divididos:** RN001 (excluir, renomear e ocultar, na barra) e RN012 (alterar para todos, em criar e configurar); RN004 (perfis da barra) e RN011 (perfis de criar e salvar); RI005 (É e Não é com lista, parte 1 dos filtros) e RI008 (árvore, parte 3); RF034 e RF094 em RF136 e RF137 (o filtro avançado na linha); RF069 em RF156 (ponto) e no RF010 (versão só sua); RF071 em RF148 (alça); RF120 em RF149 (arrastar para a barra); RF056 em RF140 a RF143; S001 em S005 (criar só para si).
- **Novos, tirados do protótipo:** Duplicar (RF144 a RF146), Copiar link (RF147), "Salvar como nova visualização" (RF157 a RF160), "Abrir primeiro para todos" (RF151, RF152), "Voltar à versão de todos" (RF161), o menu da pílula em criação (RF162), a visualização do sistema sem "Fixar no início" (RF150), o cálculo com a pílula minimizada (RF154) e "Mostrar na barra" (RF155); RN008 (condições por tipo de campo, que era o texto do RF057).
- **Perguntas novas:** P014 e P017 (a ordem de lançamento entre os épicos), P015 (ocultar a última coluna), P018 (nome repetido em "Salvar como nova visualização").
- **Ver:** `requisitos/filtros/epico.md` · `requisitos/barra-de-visualizacoes/epico.md` · `requisitos/criar-configurar-e-salvar/epico.md`

## Prints dos requisitos e 2 correções · 2026-11-03
- **Pedido (literal):** "agora abra 3 cards diferentes no enspace, na categoria user_story, cada um representando um epico [...] com as evidencias visuais dos requisitos etc."
- **Mudou:** `requisitos/prints.json` (novo) diz o caminho de cada print; os prints, 1 por grupo de requisitos, ficam em `evidencias/requisitos/`. Os requisitos sem tela levam o motivo: interface do back-end, arrastar (não aparece num print parado), anúncio para leitor de tela, endereço da página e o funil e o alfinete do título da coluna, que o `EnTable` do SDK não desenha.
- **Corrigido no protótipo** (achados ao tirar os prints):
  - escolher um campo no "+ Filtro" criava o chip e não o deixava aberto: o foco voltava para o "+ Filtro" e fechava o chip. Agora o chip abre, como pede o RF095;
  - o painel em modo de criação tinha o nome acessível "Configurar visualização"; agora é "Nova visualização", o título que ele mostra.
- **Fronteira:** muda o `_LinhaDeFiltros.vue` (foco ao escolher o campo) e o `_PainelDeConfiguracao.vue` (nome acessível). Nenhuma tela muda de forma.
- **Links do épico de filtros:** a coluna de evidência do "Como é hoje" aponta para o endereço do GitHub, que abre no card.

## Cards no ENSPACE · 2026-11-03
- **Criados** no `desenvolvimento-enlighten2`, categoria `user_story`, 1 por épico, com o `epico.md` na descrição e 1 tarefa por parte, cada requisito numa caixa de marcar e o print do grupo abaixo:
  - "Filtros da tela de itens", 4 tarefas: https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE6E95ABE05B3048F88350116D550F5
  - "Barra de visualizações", 5 tarefas: https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE549F27D01CC540E6B02FFA72DAC02
  - "Criar, configurar e salvar visualização", 3 tarefas: https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USEFE27DD99101D4E47B955D3086AE21
- **Prints:** 97 prints para 142 requisitos; os outros levam o motivo de não ter print. Nenhum print tem ponteiro do mouse.

## Tarefas divididas onde a lógica pede · 2026-11-03
- **Pedido (literal):** "veja se nao tem oportunidade de fragmentar ainda mais as tarefas que foram geradas nos ietns. olhe pras maiores tarefas de cada um e veja se faz sentido logico fragmentar. se nao fizer, mantenha como ta hoje."
- **Dividido:**
  - Barra, "2. Menu da visualização e renomear" (19 requisitos): o renomear saiu para "6. Renomear" (RF025, RF026, RF027, RF066, RF079, RF122). Tem campo, validação e teclado próprios, entra pelo clique duplo e pelo F2 sem passar pelo menu, e nenhuma parte depende dele. O menu ficou com 13 e leva Renomear como item que chega com a parte 6, do jeito que já levava os itens das outras partes (RF021).
  - Criar, "1. Alterações não salvas e salvar" (14 requisitos e 2 RN): a versão só minha saiu para "4. Versão só minha" (RN005, RN012, RF032, RF010, RF161, RI002). Pede um lugar novo no back para guardar a versão de cada pessoa (RI002), o mesmo motivo que já deixou a ordem de cada pessoa fora da base da barra. A base ganhou o RF163, a tabela do botão de salvar sem "Salvar só para mim": Standard ou Viewer salva só como nova até a parte 4 chegar. A ajuda da barra nas linhas 2 e 3 é proposta, sem texto no protótipo.
  - As 2 partes novas ficam no fim, e as tarefas que já existiam não mudam de número.
- **Mantidas inteiras:**
  - Barra, "1. Pílulas e lista do "+N"" (17): é a base; o tooltip (2 requisitos) sozinho não faz parte.
  - Barra, "3. Reordenar e fixar" (19, acima de 1,5 vez a mediana depois da divisão): fixar é uma forma de reordenar, grava na mesma ordem de cada pessoa (RI003) e muda a posição pela RN006; o teclado é a alternativa ao arrasto e sai junto com ele.
  - Criar, "3. Criar pelo catálogo" (16): catálogo, visualização nova e modo de criação são 1 fluxo.
  - Filtros, "1. Linha de filtros e chip por campo" (18): linha, "+ Filtro" e chip só funcionam juntos, como já registrado.
- **No ENSPACE:** a tarefa 6 do card "Barra de visualizações" e a tarefa 4 do card "Criar, configurar e salvar visualização" foram criadas; as tarefas 2 a 5 da barra e a 1 de criar foram reescritas, e a descrição dos 2 cards ganhou a parte nova na tabela das partes.

## Aprovado · 2026-11-03
- **Pedido (literal):** "marque como aprovado este prototipo"
- **Mudou:** o status passa de "em revisão" para "aprovado", no card do índice (`definePageMeta`) e no `README.md`. A versão aprovada é a dos requisitos em 3 épicos, com os cards no ENSPACE.

## Descrição dos cards enxuta · 2026-11-03
- **Pedido (literal):** "publique e mude os cards pq foi aprovado. mas nem precisa citar essa informaçao lá. inutil nos cards. corte o maximo de info inutil."
- **Saiu dos 3 épicos e da descrição dos 3 cards:**
  - o status e o estilo do protótipo ("estilo "Proposta", em revisão desde 23/10/2026"); o protótipo abre na proposta;
  - a lista dos controles da barra inferior do protótipo: fica 1 frase, que diz que ela é só para revisão e que "Perfil" troca o perfil (nos épicos com regra por perfil);
  - a explicação da prioridade: fica só a legenda da relevância;
  - no épico de filtros, "Como é hoje" (H1 a H9), "O que muda na lógica" e "O que muda na tela": eram a investigação, e cada mudança já está nas partes e no `BRIEFING.md`;
  - no épico da barra, o P004 (quantas visualizações os clientes têm): não muda o que o dev constrói.
- **Ficou:** o que é, onde vale, o link do protótipo e dos textos, fora do escopo, as partes, as RN, o padrão de qualidade, o glossário e o que está em aberto. As tarefas não mudaram.

## Rodada 8 · 2026-11-11 (aguarda validação)
- **Pedido (literal):**
  - "precisamos permitir que o user crie filtros rapidos pra ficar como botoes na tela nas visualizaçoes personalizadas. fez sentrido a demanda? isso ja acontece no prototipo? se nao, adicione e aguarde minha validaçao."
  - "tanto pra novas visualizaçoes de itens quanto pra novas visualizaçoes de tarefas o user deve ser capaz de fazer isso, beleza? criar os proprios filtros rapidos, no caso, criar um filtro e defini-lo como filtro rapido."
  - "nao só enquanto ta visualizando ele deve poder criar o filtro, mas na hora de criar uma nova visualizaçao personalizada ele tem a configuraçao de filtros automaicos, correto? nesse momento ele deve poder fazer isso tambem."
  - "mas lembre que na hora de criar views, ja tem filtros rapidos sugeridos pelo sistema. e o user deve poder criar mais. essa deve ser a jornada."
  - "quando o usuario ta na tela geral de itens e coloca pra usar um filtro rapido, ta ruim ainda. filtro rapido é algo que ja deve estar em tela. hoje os filtros rapidos nativos sao "meus itens" itens dos meus grupos". mas nao estao na interface (erro dos devs). ja devem aparecer por padrão ali pro user. se ele colocar pra criar filtro rapido, aí sim deve poder criar."
- **Como é hoje** (lido no código do front e do back, branch develop, em 2026-11-11): o filtro rápido da visualização guarda só a chave de um filtro pronto do produto, sem condição de campo. Nos itens, os prontos são "Só os itens meus" e "Só os itens dos meus grupos"; nas Tarefas Rápidas e Agendadas, outros prontos, como Minhas tarefas, Aberto e Atrasado. Os que a visualização marca sem "obrigatório" viram botões na barra da tabela. Os 2 nativos não aparecem na tela hoje, e a redatora aponta isso como erro. A pessoa não cria um filtro rápido com regra própria: a demanda faz sentido e pede ao back um lugar para guardar o nome e as regras de cada botão.
- **Proposta:**
  - os 2 filtros rápidos nativos, "Meus itens" e "Dos meus grupos", aparecem como botões em toda visualização, também na tela geral de itens, sem a pessoa configurar nada. A linha de filtros aparece sempre que há um botão;
  - o filtro rápido é um botão na linha de filtros, com nome e regras; as regras usam o mesmo construtor do filtro avançado (E, Ou e grupos);
  - clicar liga e desliga o botão. Ligar não é alteração da visualização: vale até sair da tela;
  - criar, editar e excluir o botão é alteração da visualização e passa pela barra de alterações não salvas, com as permissões de salvar que já existem;
  - criar na tela, com a visualização aberta:
    - no menu do chip: "Salvar como filtro rápido". O modal vem com o nome do chip e a regra dele; ao criar, o chip sai e o botão nasce ligado, e a tabela não muda;
    - no "+ Filtro": "Filtro rápido", que abre o modal vazio;
  - criar na configuração, também ao criar uma visualização nova: o painel ganha o bloco "Filtros rápidos", no lugar dos 2 filtros automáticos, em 2 partes:
    - "Do sistema": os 2 nativos, cada um com 3 usos: "Como botão" (o padrão, sem nada gravado), "Sempre aplicado" (o filtro automático de hoje, que continua como chip fixo) e "Não usar" (esconde o botão nesta visualização);
    - "Criados por você": os botões da pessoa, com editar e excluir em cada um, e "Adicionar filtro rápido";
  - cada filtro por campo do painel ganha o botão "Salvar como filtro rápido", que faz o mesmo que o menu do chip;
  - editar e excluir na tela: botão direito no filtro rápido, ou "Excluir filtro rápido" dentro do modal de edição;
  - a dica do botão mostra a regra e "Clique para ligar ou desligar. Botão direito para editar.";
  - o modal pede nome (até 40 caracteres, sem repetir na mesma visualização) e pelo menos 1 regra com valor.
  - quando os botões não cabem na linha (tela estreita, muitos botões ou muitos chips), os que sobram vão para um "+N" no fim do grupo, como as pílulas da barra de visualizações:
    - o "+N" abre a lista dos escondidos; clicar liga o filtro, e o botão ligado vai para a linha no lugar do último desligado;
    - os criados pela pessoa têm o lápis de editar na lista, e o fim da lista tem "Novo filtro rápido";
    - o botão ligado nunca fica escondido no "+N";
    - os chips dos filtros aplicados nunca se escondem: os botões cedem lugar primeiro, e os chips só quebram para a linha de baixo quando nem o "+N" com os botões ligados cabe.
- **Tarefas:** a mesma lógica vale para as visualizações das Tarefas Rápidas e das Tarefas Agendadas: os filtros prontos delas (como Minhas tarefas, Aberto e Atrasado) aparecem como botões do sistema, e a pessoa cria outros. O protótipo mostra a tela de itens.
- **Fronteira:** muda a linha de filtros, o menu do chip e o painel de configuração (os 2 filtros automáticos viram os nativos do bloco de filtros rápidos); a visualização de exemplo "Vencendo em 30 dias" tem 2 botões criados pela pessoa; o modal novo fica em `_EditorDeFiltroRapido.vue`. A barra de visualizações, a tabela e os filtros prontos não mudam.
- **Prints:** `evidencias/r8-*.jpg`, 17 prints; os 3 do "+N" (`r8-filtros-rapidos-no-mais`, `r8-mais-filtros-rapidos-aberto`, `r8-filtro-ligado-sai-do-mais`) foram tirados em tela estreita.
- **Em aberto:**
  - o botão ligado fica ligado ao voltar à visualização, ou volta desligado como no protótipo?
  - quem não pode salvar a visualização pode criar filtro rápido só para si?
  - existe um limite de botões por visualização?

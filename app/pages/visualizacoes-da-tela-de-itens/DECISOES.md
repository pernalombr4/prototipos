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

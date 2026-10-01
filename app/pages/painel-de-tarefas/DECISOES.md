# Decisões: painel de tarefas

## Rodada 7 · 2026-10-01

- **Pedido (literal):** "tarefas por prioridade tem que ter cor diferente por coluna"
- **Mudou:** cada coluna de Tarefas por prioridade tem a cor da prioridade, a mesma do protótipo de Tarefas Rápidas (`tarefas-rapidas/quadro.ts`): Urgente em vermelho, Alta em amarelo, Normal em cinza, Baixa na cor de informação. Antes, as 4 eram da cor primária.
  - Normal fica em cinza, e não no neutro do tema (quase preto), para não pesar mais que Urgente: é a coluna mais alta, com 90 de 101 no mock.
  - Vermelho e amarelo também querem dizer "vencida" e "a vencer" em outros painéis. Fica a cor do protótipo de Tarefas Rápidas, para a mesma prioridade ter a mesma cor nos 2 protótipos (o produto hoje não colore a prioridade).
  - A dica diz "● Abertas: 2", com o ponto na cor da coluna.
- **Fronteira:** muda só a cor das colunas de prioridade.
- **Ver:** `https://pernalombr4.github.io/prototipos/painel-de-tarefas`. Sem print, a pedido da redatora.

## Rodada 6 · 2026-10-01

- **Pedido (literal):** "tasks a vencer pode manter ok? como lista mesmo e fazer umaseparada pra vencidas". Contexto: a comparação com o painel básico do ClickUp, que tem o cartão "Tasks Due This Week or Overdue".
- **Mudou:** entrou o painel **Tarefas vencidas**, uma lista no mesmo desenho de Próximas a vencer. Ficam 14 painéis.
  - Ordem: da que venceu há menos tempo à mais antiga. As 2 listas partem de agora, uma para trás e outra para frente. A mais antiga, quase sempre esquecida, fica no fim; o número Vencidas abre a lista na ordem inversa.
  - Subtítulos pelas faixas ("Há até 7 dias", "Há mais de 7 dias"), com o total de cada uma. Ícone e prazo em vermelho.
  - O arranjo padrão põe SLA, Tarefas vencidas e Próximas a vencer na mesma linha, 4 colunas cada: do passado para o futuro. A chave do `localStorage` passou a `layout:v6`.
- **Mudou:** `_ListaProximas.vue` virou `_ListaDePrazo.vue`, com `modo="vencidas"` ou `modo="proximas"`.
- **Mudou:** no MVP, o item que sai virou "Tarefas vencidas e Próximas a vencer": os números Vencidas e A vencer abrem as mesmas listas.
- **Validação:** a lista tem o mesmo total do número Vencidas e fica em ordem, nas 3 origens (377 checagens, 0 falhas).
- **Fronteira:** muda só a linha de prazo. Próximas a vencer continua lista, como pedido.
- **Em aberto:** o painel "Tarefas por tipo" (ação da tarefa: aprovação, formulário, confirmação, integração), a única dimensão das referências que o painel não mostra. Espera o sim da redatora.
- **Ver:** `https://pernalombr4.github.io/prototipos/painel-de-tarefas`. Sem print, a pedido da redatora.

## Rodada 5 · 2026-10-01

- **Pedido (literal):** "a interaçao com todos os graficos deve ter popovers. como tem no grafico de linhas, por exemplo. voce nao botou isso em todos."
- **Mudou:** todo gráfico abre uma dica ao passar o mouse, no desenho da do gráfico de linhas: o nome em cima, cada parte com o ponto da cor e o valor, e o total quando a barra ou a coluna se divide.
  - Barras horizontais (Tarefas por responsável e Tempo médio de duração): ganharam a dica. Antes, só o `title` do navegador, e só nas partes da barra.
    - A dica segue o ponteiro, como no gráfico de linhas. No foco do teclado, abre presa à barra.
    - Em "Todos" dos responsáveis: as 5 partes e o total. No tempo por fluxo: cada etapa e a média. Na barra de uma parte só: o filtro ("Vencida: 18") ou "Média".
  - Colunas (SLA, Tarefas por status, Tarefas por prioridade): a dica já existia e repetia o nome ("Vencida", "● Vencida: 113"). Agora diz o que o número conta ("● Abertas agora: 113") e, na coluna empilhada, soma o total.
- **Como:** `UPopover` no modo de passar o mouse (`mode="hover"`), sem gatilho, ancorado num ponto que segue o ponteiro (`reference` com `getBoundingClientRect`). Consulta: MCP `nuxt-ui` (`get-component-metadata Popover`: `mode`, `reference`, `openDelay`) e o código do componente (sem slot padrão, não há gatilho). A dica não recebe o ponteiro (`pointer-events-none` pela prop `ui`), para não piscar.
- **Fronteira:** muda só o passar do mouse e o foco nos gráficos. Clique, dado e desenho dos painéis ficam como estavam.
- **Ver:** `https://pernalombr4.github.io/prototipos/painel-de-tarefas`. Sem print, a pedido da redatora.

## Rodada 4 · 2026-10-01

- **Pedido (literal):** "o dash de tempo ate o prazo é inutil. pode tirar."
- **Mudou:** saiu o painel **Tempo até o prazo** (as abertas em 7 faixas, da vencida há mais de 7 dias à de prazo depois de 30 dias). Ficam 13 painéis.
  - SLA e Próximas a vencer dividem a linha, 6 colunas cada.
  - A chave do `localStorage` passou a `layout:v5`: quem tinha arranjo salvo volta ao padrão.
  - As faixas continuam no cálculo: a quickview de Vencidas e de A vencer e os subtítulos de Próximas a vencer ("Em até 24 h", "Em 1 a 7 dias") usam as mesmas faixas.
- **Mudou:** o MVP ficou com 8 painéis. Criadas e concluídas ocupa 8 colunas ao lado de Tarefas por status; Tarefas por responsável, a linha toda.
- **Fronteira:** só sai o painel. Não mudam as regras de cálculo, os outros painéis nem a casca.
- **Ver:** `https://pernalombr4.github.io/prototipos/painel-de-tarefas`. Sem print, a pedido da redatora.

## Rodada 3 · 2026-09-30

- **Pedido (literal):**
  - "ta ruim a usabilidade desse personalizar e tal... simplesmente os dashes deveriam ser arrastaveis e redimensionáveis já de cara. sem precisar ativar nenhuma opção de personalizar. o botão ali deveria ser um botão simplesmente de edição de visibilidade [...] (tipo o botao de ediçao de colunas que tem nas tabelas). e manter os 3 pontos no card pra opção de ocultar aparecer. tela cheia nao faz sentido."
  - "essa sidebar que abre deve ser como no admin, que tem uma barrinha de quickview nela. e a quickview deve resumir os numeros/informaçoes do card/painel clicado"; "essa barra lateral pode ser expandida ao clicar no limite dela"
  - "na abertura da tabela pode tirar essa barra superior [...] senao fica muito cabeçalho"; "a area clicavel pra arraste nao deve ser só o topo do card. deve ser ele por inteiro"
  - "o dash de tempo por fluxo e outro tempo por etapa e outro tempo por tarefa tava melhor quando eles eram todos juntos e tinha um filtrinho"; "deve manter o mesmo estilo [...] é pra ter cara de dashboard. no maximo uma lista/tabela"
  - "tarefas por responsavel nao deveria ser um gráfico em vez de uma tabela? essa tabela que ta hoje pode abrir como detalhe do gráfico"
  - "evite colocar informações desnecessrias nos paineis [...] abertas 174. isso ja era informaçao suficiente. nao precisa do subtexto"; "vale colocar um painel de contagem de tarefas por status"; "o tempo médio de duração não é a mediana. é a média"
  - "pesquise sobre as melhores praticas de construçao de dashboards de BI pra escolher os melhores formatos de grafico pra cada caso"
  - "crie um botao na barra da base do prototipo [...] pra marcar o que voce consideraria pra um MVP"
  - "no painel de sla em vez de mostrar as 2 linhas juntas é mais fácil botar barras verticais e colocar um filtro pra ver abertas agora e ja enerradas"; "coloque tambem um board de tarefas por prioridade."
  - "voce botou filtro no tarefas por resopnsavel. nao é isso. deve ser agrupado como tava antes mesmo. pode até ter esses filtros, mas deve ter uma visao "todos" como mais um filtro com agrupamentos."
  - "saiba que o mvp precisa ter o tempo medio de duraçao por fluxo, por etapa e por tarefa. mas a visualizaçao atual ta meio ruim... [...] ta pobre demais. de todo modo, precisa ter."; "nao precisa de print de nada pra nao gastar token a toa."
- **Mudou:** o painel se arrasta e se redimensiona direto, sem modo de edição.
  - Arrastar: segurando em qualquer ponto do painel. O arraste só começa com 4 px de movimento, e o clique do fim de um arraste é engolido: clique continua sendo clique.
  - Redimensionar: o canto inferior direito, que aparece ao passar o mouse.
  - Ctrl+Z desfaz.
- **Mudou:** "Personalizar" virou o botão **Painéis**, o editor de visibilidade no desenho do "Colunas" das tabelas: uma caixa por painel, por grupo, mais "Mostrar todos" e "Restaurar padrão". O painel que volta entra no lugar padrão dele.
- **Mudou:** o "…" do painel ficou com "Tamanho padrão" e "Ocultar painel". Saíram a tela cheia, o catálogo "Adicionar painel" e o modo de edição.
- **Mudou:** a lista de cada painel ganhou a quickview do admin à esquerda (`USplitter`).
  - Expandida: o tipo, o ícone, o recorte, o número, os selos e o "Resumo" (ícone, rótulo e valor), com a parte clicada em destaque.
  - Recolhida: o trilho de ícones, cada um com rótulo e valor ao passar o mouse.
  - Clicar no limite expande ou recolhe; arrastar muda a largura.
- **Mudou:** a lista abre sem a faixa de título; o "fechar" foi para a ponta da barra da lista.
- **Mudou:** cada painel ganhou o formato de gráfico da mensagem dele (tabela "Formato de cada painel", abaixo, e `PESQUISA.md`, "Formatos de gráfico").
- **Mudou:** painéis enxutos:
  - número só com ícone, título e valor, sem subtexto e sem selo de variação;
  - título sem descrição embaixo;
  - nada de porcentagem repetida, nota de rodapé ou saldo dentro do painel;
  - o detalhe foi para a quickview e para o "Como calculamos".
- **Mudou:** **SLA** virou colunas, uma por situação do prazo, com o seletor "Abertas agora" ou "Concluídas no período". Antes eram 2 roscas e, depois, 2 barras 100% juntas.
- **Mudou:** **Tarefas por status** (Pendente, Em andamento, Bloqueada, Concluída) entrou como colunas empilhadas pela situação do prazo. "Status e situação do prazo" saiu: dizia a mesma coisa.
- **Mudou:** **Tarefas por prioridade** entrou: as abertas agora, uma coluna por prioridade (Urgente, Alta, Normal, Baixa), na cor primária.
  - Só a tarefa rápida e a do Spaceflow têm prioridade. A tarefa de etapa grava `priority: "0"` (42 de 42 em develop) e fica de fora; a quickview mostra quantas.
  - Em develop, 145 de 161 tarefas de `/ws/tasks` são normais. O mock tem mais urgentes e baixas, para as 4 colunas aparecerem.
- **Mudou:** "Não iniciada" virou **Pendente**, a palavra da demanda e da tela de Rápidas.
- **Mudou:** **Tarefas por responsável** virou gráfico de barras horizontais, com o seletor "Todos, Pendente, Em andamento, Vencida, Concluída". A tabela abre pelo "Ver tabela".
  - "Todos", o padrão, é a barra agrupada: vencida (em qualquer status) na base, depois pendente, em andamento, bloqueada e concluída no período. As partes não se sobrepõem.
  - Os outros filtros mostram uma parte só, com o mesmo número da parte.
  - Ordem: em "Todos", pelas vencidas; nos filtros, pelo número do filtro. Só as 10 primeiras filas.
- **Mudou:** os 3 tempos voltaram a ser 1 painel, com o seletor "Por fluxo, Por etapa, Por tarefa" e o mesmo gráfico nas 3 vistas.
  - Por fluxo: a barra se divide nas etapas do fluxo da categoria (ou nas tarefas do Spaceflow), na ordem, com o nome dentro da parte. A mais lenta fica em amarelo; a espera entre uma e outra, em cinza.
  - Por etapa: a etapa mais lenta de cada fluxo em amarelo.
  - Por tarefa: na tarefa de etapa com "Habilitar Atribuição", a barra se divide em espera e execução.
  - Desce de nível no clique: fluxo da categoria para as etapas dele, fluxo do Spaceflow para as tarefas dele, etapa para as tarefas dela. Um selo com "×" mostra o recorte.
  - Tudo pela **média**; a mediana e o p90 ficam na quickview.
- **Mudou:** "Tempo mediano" virou **Tempo médio** na tabela e na quickview de responsáveis.
- **Mudou:** o arranjo padrão ganhou uma linha de prazo (SLA, Tempo até o prazo e Próximas a vencer, 4 colunas cada) e a prioridade ao lado de responsáveis. A chave do `localStorage` passou a `layout:v4`: quem tinha arranjo salvo volta ao padrão.
- **Mudou:** o botão **MVP** na barra do andaime mostra o recorte da primeira entrega (seção "Recorte do MVP", abaixo).
- **Fronteira:** muda o conteúdo da tela do painel e a lista lateral. Não muda a casca, as listas de Agendadas e Rápidas, nem as regras de cálculo.
- **Descartado:** modo de edição. Motivo: pedido da redatora; o ClickUp usa para evitar arraste sem querer, e aqui o limiar de 4 px e o Ctrl+Z cobrem.
- **Descartado:** comparação com o período anterior no número (selo "+78%"). Motivo: pedido da redatora. A pesquisa recomenda número com contexto; a comparação ficou na quickview ("Período anterior").
- **Descartado:** rolagem infinita no SLA, no status e na prioridade. Motivo: são até 7 colunas.
- **Não deu:** foco do teclado nas colunas do Unovis. Por quê: o Unovis não recebe foco. Cada gráfico de colunas tem uma lista `sr-only` de botões, que aparece no foco.
- **Não deu:** dividir a barra do Spaceflow "Onboarding de colaborador". Por quê: as tarefas correm em paralelo e a soma das médias passa da média do fluxo. A barra fica inteira; descer de nível mostra as tarefas.
- **Maquete:** a largura da quickview fica no `localStorage` (`autoSaveId` do `USplitter`, chave `reka:painel-de-tarefas-quickview-v2`).
- **Crítica e acessibilidade:** seção "Crítica e acessibilidade", rodada 3.
- **Ver:** `https://pernalombr4.github.io/prototipos/painel-de-tarefas`. Sem print nesta rodada, a pedido da redatora.

### Formato de cada painel (rodada 3)

| Painel | Mensagem | Formato | Diferença da pesquisa |
|---|---|---|---|
| Números | valor único | número grande, sem subtexto | sem comparação, por pedido da redatora |
| SLA | parte de um todo, 3 ou 4 partes | colunas com seletor "Abertas agora" ou "Concluídas no período" | a pesquisa sugeria barra 100%; a redatora pediu colunas e um filtro |
| Tempo até o prazo (saiu na rodada 4) | distribuição em faixas ordenadas | colunas, cor por grupo | cor com significado (vencida, a vencer), em vez de um matiz só |
| Próximas a vencer | o que fazer primeiro | lista em ordem de prazo | nenhuma |
| Criadas e concluídas | 2 séries no tempo | linhas, com o nome na ponta | nenhuma |
| Tarefas por status | poucas categorias com composição | colunas empilhadas | a pesquisa sugeria barras horizontais; colunas por ser 4 status curtos |
| Tarefas por prioridade | categorias em ordem | colunas, uma cor só (rodada 7: uma cor por prioridade) | a redatora pediu uma cor por coluna |
| Tarefas por responsável | ranking entre muitas categorias, com composição | barras horizontais empilhadas, top 10, com filtro por parte | nenhuma |
| Tempo médio de duração | ranking de uma grandeza e onde ela vai | barras horizontais divididas nas partes, da mais lenta à mais rápida | nenhuma |

## Recorte do MVP (rodadas 3 e 4)

Pedido: "como deixaria a funcionalidade no mvp. como enxugaria? tiraria algumas opçoes da tela? reduziria a quantidade de graficos? ambos? faça uma escolha pelo vies de produto mesmo". A resposta é **os 2**. O detalhe está no botão MVP do protótipo e no `mvp.ts`.

- **O trabalho:** "quando abro a semana, quero ver o que venceu ou está para vencer, e com quem, para cobrar antes de virar problema". Em segundo lugar, saber se a equipe entrega no prazo e se a fila cresce.
- **Fica (8 painéis fixos; 9 na rodada 3, com Tempo até o prazo):**
  - Vencidas, A vencer, Concluídas no prazo e Tempo médio de conclusão;
  - Criadas e concluídas; Tarefas por status; Tarefas por responsável;
  - Tempo médio de duração, por fluxo, etapa e tarefa (decisão da redatora: "o mvp precisa ter");
  - filtros de período e responsável;
  - a lista com a quickview, que é componente nativo e já existe.
- **Sai:**
  - arrastar, redimensionar e o botão Painéis (com 8 painéis, arrumar não muda decisão);
  - SLA e Próximas a vencer (repetem os números);
  - Tarefas por prioridade (a tarefa de etapa não tem prioridade, e em develop quase tudo é normal);
  - Abertas e Concluídas como números;
  - filtros de origem e categoria;
  - "Colunas", "Exportar" e o seletor de semana, mês e ano.
- **O back do MVP:** 1 rota de agregação sobre `/ws/tasks` e `/c-flow-item-tasks`, com período e responsável, e 2 leituras para o tempo de duração: `/c-flow-items` com o `stages_log` e `/workflows/executions`.
- **Risco:** o gestor quer ver o workspace inteiro? Hoje cada pessoa vê só as próprias tarefas. Teste: mostrar a 5 gestores e ver se o primeiro clique é em Vencidas.

## Rodada 2 · 2026-09-30

- **Pedido (literal):**
  - "a divisao que voce fez entre rapidas, spaceflow e programadas nao tem sentido. isso porque as tarefas de spaceflow sao tarefas rapidas. pode fazer uma divisao só entre "tarefas criadas manualmente" e "tarefas criadas por fluxo", sem dividir spaceflow e c-flows nisso."
  - "o usuario deve ter a possibilidade de reordenar os cards de graficos (todos os paineis) e tambem redimensionar, como é no clickup. pode também ocultar algum ou adicionar de volta se quiser."
  - "vence nas proximas 24h poderia ser "a vencer" e dar um prazo maior. [...] use o corte comum no mercado"
  - "observe a estrutura de dashboards feita com o template de dash do nuxt. ta melhor que os seus. tem que acompanhar o nuxt viu? é a estrutura do nosso admin."
  - "na hora de clicar nos seus cards tudo bem abrir a lista de tarefas, só veja como é abertura de lista/tabela no admin pra copiar a estrutura de tabela do nuxt nisso tambem."
  - "e nos paineis que sao listas, pode colocar scroll infinito em vez de um botao pra abrir mais"
- **Mudou:** origem em 2, "Criadas manualmente" e "Criadas por fluxo".
  - Por fluxo: a tarefa do Spaceflow (`node_execution` preenchido) e a tarefa de etapa do fluxo da categoria.
  - O motor por baixo continua no modelo (`motor`), só para o "Abrir em Agendadas" ou "Abrir em Rápidas" da lista.
  - Tempo por fluxo põe os 2 motores lado a lado, com um selo "Categoria" ou "Spaceflow". O do Spaceflow vem da execução (`created_at` a `stopped_at`).
- **Mudou:** "Vence em 24 h" virou **"A vencer"**: aberta com prazo nos próximos 7 dias corridos.
  - É o corte mais comum: Linear, Jira, Todoist e Asana usam 7 dias; monday.com e Wrike, a semana do calendário; o Trello, 24 h. O ClickUp não tem janela na cor e oferece "Next 7 days" no filtro (`PESQUISA.md`, seção "A vencer").
  - O detalhe do número mostra quantas vencem em até 24 h, o destaque que Linear, ClickUp e Todoist dão ao dia do prazo.
  - "Tempo até o prazo" agrupa as faixas em Vencidas, A vencer e Depois de 7 dias.
- **Mudou:** cada pessoa arruma o painel, como no ClickUp:
  - "Personalizar" liga o modo de edição; "Concluir" desliga. Fora dele, nada se move (o motivo que o ClickUp deu para criar o modo);
  - mover: arrastar o painel; os outros se reacomodam. Pelo teclado, setas na alça;
  - redimensionar: canto inferior direito, em passos da grade de 12 colunas, com mínimo e máximo por painel. Pelo teclado, setas no canto;
  - ocultar: menu "…" do painel, com "Desfazer" no aviso;
  - trazer de volta: "Adicionar painel", catálogo com busca, onde o painel na tela aparece como "Adicionado" (como o "Manage cards" do ClickUp);
  - "Desfazer" (e Ctrl+Z) e "Restaurar padrão";
  - "Tela cheia" no menu "…" de todo painel.
- **Mudou:** os 7 blocos viraram 15 painéis independentes: os 6 números, SLA, Tempo até o prazo, Próximas a vencer (antes era o rodapé de prazos), Criadas e concluídas, Status, Responsáveis e Tempo por tarefa, por etapa e por fluxo (antes eram 3 abas).
- **Mudou:** desenho do template de dashboard do Nuxt UI, que o admin do ENSPACE usa:
  - número com ícone em círculo da cor primária, título em caixa alta e variação num selo (`HomeStats`);
  - barra de filtros com botões fantasma e período com ícone de calendário (`UDashboardToolbar` e `HomeDateRangePicker`);
  - gráfico que ocupa a altura do painel (`HomeChart`).
- **Mudou:** a lista aberta por um número segue a tabela do admin (tela Usuários): busca à esquerda; "Colunas" e "Exportar" à direita; rodapé com "Mostrando 1 a 20 de N", itens por página e paginação com primeira e última página.
- **Mudou:** rolagem infinita nos painéis de lista (Próximas a vencer, Responsáveis, Tempo por tarefa), no lugar de "Mostrar os N". Lotes de 8 a 15 linhas; no produto, cada lote é uma página da API. Cada painel rola dentro de um `UScrollArea`.
- **Fronteira:** muda o conteúdo da tela do painel. Não muda a casca (menu, barra do topo, trilha), as listas de Agendadas e Rápidas, nem as regras de cálculo, fora a janela de "a vencer".
- **Descartado:** layout do painel igual para todo o workspace, como no dashboard do ClickUp. Motivo: o painel é nativo e o mesmo para todos; o que muda é quem olha. O arranjo por pessoa segue a página pessoal do ClickUp (My Tasks).
- **Descartado:** "Duplicar painel" e "Exportar painel", que o ClickUp tem no menu "…". Motivo: o conteúdo é fixo, e 2 cópias do mesmo número não respondem nada novo. A exportação fica na lista.
- **Descartado:** "Atualizar" por painel. Motivo: o painel todo atualiza junto pelo botão do topo, e o horário aparece ao lado.
- **Não deu:** intervalo de datas personalizado no período (o calendário do `HomeDateRangePicker`). Por quê: o `UCalendar` com intervalo precisa do `@internationalized/date`, que não está instalado neste repositório. Ficaram os 7 atalhos, cada um com as datas ao lado.
- **Não deu:** arrastar com a biblioteca do exemplo do Nuxt UI (`useSortable`). Por quê: `@vueuse/integrations` e `sortablejs` não estão instalados. O arrastar e o redimensionar são do navegador (`UxGradeDePaineis`, registrado em `COMPONENTES-CUSTOM.md`).
- **Maquete:** o arranjo de cada pessoa fica no `localStorage` do navegador (chave `enspace-prototipos:painel-de-tarefas:layout:v1`). No produto, é uma preferência por membro.
- **Maquete:** a rolagem infinita espera 350 ms a cada lote, para imitar a página seguinte da API.
- **Maquete:** "Exportar" da lista mostra um aviso; "Colunas" funciona só na tela.
- **Crítica e acessibilidade:** detalhe na seção "Crítica e acessibilidade", rodada 2.
- **Ver:** `https://pernalombr4.github.io/prototipos/painel-de-tarefas` · `evidencias/prototipo-06-rodada-2-topo.jpg` · `evidencias/prototipo-07-rodada-2-modo-de-edicao.jpg` · `evidencias/prototipo-09-rodada-2-lista-como-no-admin.jpg`

## Rodada 1 · 2026-09-30

- **Pedido (literal):** "voce precisa construir um prototipo de uma tela nativa de dashboard de TAREFAS para o enspace. [...] precisamos de um dash nativo e nao editavel, só um painel fixo e padronizado com dados de tarefas" (a demanda inteira está no `BRIEFING.md`).
- **Mudou:** protótipo novo, em `Tarefas › Painel`, com 7 blocos fixos:
  - 6 números no topo: abertas, vencidas, vencem em 24 h, concluídas, % concluídas no prazo e tempo médio de conclusão;
  - SLA: abertas agora (no prazo, vence em 24 h, vencida, sem prazo) e concluídas no período (no prazo, atrasada, sem prazo);
  - tempo até o prazo, em 7 faixas, com as 5 próximas a vencer;
  - status e substatus virtuais: cada status dividido pela situação do prazo;
  - criadas e concluídas por semana, mês ou ano, com o saldo;
  - tarefas por responsável: pessoas, grupos, "Todo mundo", e-mail externo e sem responsável, em 2 leituras (designada para, quem assumiu);
  - tempo médio de tarefa, de etapa e de fluxo, em 3 abas.
- **Mudou:** todo número abre a lista das tarefas que o formam, num painel lateral.
- **Mudou:** filtros globais: período, origem (rápidas, Spaceflow, programadas), responsável e categoria.
- **Fronteira:** muda o conteúdo da tela nova e o menu ganha o item "Painel" dentro de Tarefas; não muda nada nas listas de Agendadas e Rápidas, nem no painel de itens da Interface.
- **Descartado:** construtor de widgets. Motivo: a demanda pede painel fixo, e a pesquisa de UX já mostrou que montar um painel de itens exige 4 níveis e esconde o obrigatório.
- **Descartado:** burndown, velocity e carga contra capacidade. Motivo: o ENSPACE não tem sprint, estimativa nem capacidade por pessoa. Não há dado.
- **Descartado:** ranking de pessoas ("quem mais concluiu"). Motivo: expõe gente; a demanda é gerir tarefa.
- **Descartado:** pausa de SLA. Motivo: o ENSPACE não grava pausa.
- **Não deu:** ler a API pelo token de develop. Por quê: o token do `config/tokens.md` não é membro do workspace de exploração (403), e ler a sessão do navegador foi bloqueado. A exploração seguiu pela tela, pelo Log de Auditoria e pela medição da rotina de QA de tarefas.
- **Não deu:** print das referências de mercado. Por quê: a ajuda de ClickUp, monday.com, Asana e Wrike bloqueia leitura automática, e print do produto exige conta em cada um. O `PESQUISA.md` descreve cada um em passos, com URL.
- **Maquete:** o botão "Atualizar" só gira; o dado não muda.
- **Maquete:** clicar numa linha da lista lateral e nos botões "Abrir em Agendadas" e "Abrir em Rápidas" mostra um aviso. No produto, a linha abre a tarefa e os botões abrem a lista com o mesmo filtro.
- **Maquete:** clicar numa barra do gráfico de criadas e concluídas não abre lista.
- **Maquete:** o período não tem intervalo personalizado (só as 7 opções prontas).
- **Crítica e acessibilidade:** detalhe na seção "Crítica e acessibilidade", abaixo.
- **Ver:** `http://localhost:3000/painel-de-tarefas` · `https://pernalombr4.github.io/prototipos/painel-de-tarefas` · `evidencias/prototipo-01-topo.jpg`

---

## Onde o painel mora

**Tarefas › Painel**, 1º filho de Tarefas, com o selo "Novo".

- É a visão de conjunto das 2 listas que já estão ali (Agendadas e Rápidas). Por isso fica em cima delas.
- Não entra em Interface › Telas como mais um tipo de tela. Motivo: tela da Interface é configurável e depende de alguém criar e pôr no menu. A demanda pede painel nativo.
- **É a única mudança na casca**, e é achado, não licença (regra 37): o menu ganha 1 item. Pergunta para a Mikaela: o lugar é esse, ou o painel entra na Início, ao lado dos cartões de tarefa de hoje?

## As definições

A demanda fala em "atrasadas, no prazo, vencidas". Os produtos pesquisados não concordam sobre essas palavras, e o ENSPACE usa "Atrasado" na coluna Status de SLA das programadas. O painel fixa o sentido de cada uma e mostra a regra em todo cartão ("Como calculamos").

| Palavra | Quando | Regra | Campo |
|---|---|---|---|
| **No prazo** | aberta | prazo daqui a mais de 7 dias | `due_date` > agora + 7 dias |
| **A vencer** | aberta | prazo nos próximos 7 dias corridos (rodada 2; antes, 24 h) | `due_date` entre agora e agora + 7 dias |
| **Vencida** | aberta | prazo passou e a tarefa segue aberta | `due_date` < agora |
| **No prazo** | concluída | terminou até o prazo | `completed_at` <= `due_date` |
| **Atrasada** | concluída | terminou depois do prazo | `completed_at` > `due_date` |
| **Sem prazo** | as 2 | sem `due_date`, ou prazo igual à hora de criação | `due_date` nulo, ou `due_date` = `created_at` (1 min de folga) |

**Divergência de nome (regra 29):** o "Atrasado" da coluna Status de SLA das agendadas junta o que o painel separa em "Vencida" (aberta, prazo passou) e "Atrasada" (concluída depois do prazo). Medido na rodada 2 (`evidencias/dev-11-status-de-sla-apos-o-prazo.jpg`): a concluída até o prazo segue "Em Dia" depois dele. O painel separa as 2 palavras porque respondem perguntas diferentes: vencida é o que está parado agora; atrasada é o que foi entregue tarde. A soma das 2 bate com o "Atrasado" do produto (checagem automática no mock). **Pergunta para a Mikaela:** a coluna Status de SLA ganha as 2 palavras, ou o painel mostra "Atrasado" com as 2 partes dentro?

**Consequência do "a vencer" de 7 dias:** a tarefa de etapa costuma ter SLA de horas ou poucos dias. Aberta e dentro do prazo, ela cai quase sempre em "A vencer", e "No prazo" (mais de 7 dias) fica raro. A faixa "Em até 24 h" separa o urgente.

**Origem** (rodada 2):

| Painel | Rápida (`/ws/tasks`) | Agendada (`/c-flow-item-tasks`) |
|---|---|---|
| Criada manualmente | `node_execution` nulo | não existe |
| Criada por fluxo | `node_execution` preenchido (Spaceflow) | toda tarefa de etapa |

**Status virtual** (os 2 motores num vocabulário só):

| Painel | Rápida e Spaceflow (`status`) | Programada (`work_status` e `status`) |
|---|---|---|
| Pendente (rodada 3; antes, Não iniciada) | `pending` (Pendente) | `waiting` (Aguardando) |
| Em andamento | `working` (Em andamento) | `working` (Trabalhando) |
| Bloqueada | `blocked` (Bloqueada) | não existe |
| Concluída | `completed` (Concluída) | `complete` (Completa) |
| Removida | não entra (a lista esconde arquivada e excluída) | `removed` ou `status: inactive` (item excluído) |

**Substatus virtual:** a situação do prazo (tabela de cima) dentro de cada status.

**Prioridade** (rodada 3): `priority` da rápida e da tarefa do Spaceflow (`low`, `normal`, `high`, `urgent`: Baixa, Normal, Alta, Urgente). A tarefa de etapa grava `"0"` e fica fora do painel de prioridade.

**Responsável:**

| Tipo de responsável na tarefa de etapa | Linha no painel |
|---|---|
| Todo Mundo (`everybody`) | "Todo mundo" |
| Grupo (`module_groups`) | o grupo |
| Usuários, Usuário Solicitante, Baseado em Campo, Regras de Responsável | cada pessoa |
| Email Externo | "E-mail externo" |
| Rápida com `assigned_to` | a pessoa |
| Rápida sem `assigned_to` | "Sem responsável" |

- Tarefa de 2 pessoas conta para as 2; a tela avisa que a soma pode passar do total.
- As partes da barra (rodada 3), sem sobreposição: **Vencida** é a aberta de prazo passado, em qualquer status; **Pendente**, **Em andamento** e **Bloqueada** são as outras abertas, pelo status; **Concluída** é do período. Abertas = vencidas + pendentes + em andamento + bloqueadas.
- "Quem assumiu" usa `assigned` (quem clicou em Atribuir) ou quem concluiu (`updated_by_email`, `completed_by`): 1 linha por tarefa.

**Tempos:**

- **Tarefa:** `created_at` até `completed_at`. Nas programadas com "Habilitar Atribuição", o `task_log` divide em espera (até "Trabalhando") e execução.
- **Etapa:** `start` até `complete` do mesmo `stage_id` no `stages_log` do flow item.
- **Fluxo da categoria:** 1º `start` até o último `complete`, nos flow items com `run_status: complete`.
- **Fluxo do Spaceflow** (rodada 2): `created_at` até `stopped_at` da execução com `status: completed`. O Spaceflow não tem etapa: a vista "Por etapa" mostra só fluxo da categoria, e o "Como calculamos" diz isso.
- **Onde o tempo vai** (rodada 3): no fluxo da categoria, a média de cada etapa nos itens que concluíram o fluxo (etapa pulada conta 0), então a soma das partes é a média do fluxo. No Spaceflow, a média de cada tarefa e o resto como espera entre uma e outra; se a soma passa da média do fluxo (tarefas em paralelo), a barra não divide.
- **Espera e execução** (rodada 3): a média de criada até assumida e de assumida até concluída, só quando todas as concluídas do grupo foram assumidas. Aí as 2 somam a média do grupo.
- O painel mostra a **média** (rodada 3, pedido da redatora). A mediana e o p90 ficam na quickview: em develop, a média do tempo de conclusão foi 43 h e a mediana, 36 s. Sozinha, a média engana.
- Ao lado de cada tempo, quantos ainda estão em andamento e há quanto tempo: sem isso, o item parado há 2 meses some da média.

**Filtro de responsável:** pega a tarefa designada à pessoa (ou ao grupo, a "Todo mundo", ao e-mail externo) e também a que a pessoa assumiu ou concluiu. Assim, filtrar "Carla Nunes" mostra a tarefa do grupo Jurídico que ela pegou.

**Período:** cada bloco diz se é "Agora" (abertas, vencidas, faixas) ou "No período" (concluídas, criadas, tempos). A comparação é com o período anterior do mesmo tamanho e, desde a rodada 3, aparece só na quickview. Semana de segunda a domingo, no horário de Brasília (o ENSPACE não tem fuso por workspace).

## O que o back precisa

O painel usa só dado que o ENSPACE já grava. Falta uma coisa: **agregar no servidor**. As rotas de hoje listam e contam; o painel precisa de média, mediana e contagem por grupo sem baixar milhares de tarefas.

| Pedido | Por quê |
|---|---|
| Rota de agregação sobre `/ws/tasks` e `/c-flow-item-tasks`, com os mesmos filtros das listas | contagem por status, por situação do prazo, por responsável e por semana, mês ou ano |
| Média e percentis (50 e 90) de `completed_at - created_at` | o painel mostra a média; a quickview, a mediana e o p90 |
| Contagem das abertas por `priority` | painel de prioridade (rodada 3) |
| Leitura de `/c-flow-items` com `stages_log`, filtrável por fluxo e período | tempo de etapa e de fluxo; hoje não há rota de leitura documentada |
| `/workflows/executions` filtrável por período (`stopped_at`) e com contagem | tempo de fluxo do Spaceflow sem baixar todas as execuções |
| Preferência por membro para o arranjo do painel (ordem, tamanho, ocultos) | "Personalizar" guarda por pessoa; o protótipo usa o `localStorage` |
| `is_overdue` calculado também no detalhe, e filtrável | hoje é texto, só na lista, e dá 400 no filtro |
| Nó do Spaceflow sem prazo gravar `due_date: null` | hoje grava a hora da criação e a tarefa nasce vencida |
| Fuso do workspace | "semana" e "mês" dependem de onde começa o dia |

## Validação dos números (`/data:validate-data`)

**Resultado: pronto para mostrar, com as ressalvas abaixo.** Rodada 3: 371 checagens automáticas sobre o mock, 0 falhas (rodada 2: 353; rodada 1: 433, com 4 origens).

- Rodada 3:
  - prioridade: as 4 colunas + as tarefas de etapa sem prioridade = abertas;
  - responsável: abertas = vencidas + pendentes + em andamento + bloqueadas, linha por linha; em "Quem assumiu", cada parte soma o total do painel;
  - fluxo: as partes da barra + a espera entre elas = a média do fluxo (diferença abaixo de 1 s);
  - tarefa: espera + execução = a média, quando a barra divide.

- Rodada 2:
  - criadas manualmente + criadas por fluxo = todas; tarefa manual nunca tem fluxo nem etapa;
  - "A vencer" = faixas "Em até 24 h" + "Em 1 a 7 dias", nas 3 origens;
  - Próximas a vencer = abertas com prazo à frente, em ordem de prazo;
  - o "Atrasado" do produto (regra medida) = Vencida + Atrasada do painel, tarefa por tarefa;
  - tempo por fluxo tem os 2 motores; execução concluída tem `stopped_at` depois do início.
- Totais que batem entre blocos, em todos os 7 períodos e 3 origens:
  - abertas = SLA das abertas = soma das faixas = soma dos status abertos;
  - concluídas = SLA das concluídas = linha "Concluída" do status;
  - criadas e concluídas do gráfico = números do topo, nas 3 granularidades.
- Datas: nenhuma conclusão antes da criação; "assumida" sempre entre criação e conclusão; nada no futuro.
- Etapa e fluxo: a soma das etapas de um fluxo concluído bate com a duração do fluxo (diferença máxima de 4 s).
- Responsável: em "Designada para", a soma das linhas passa do total quando há tarefa de 2 pessoas; em "Quem assumiu", bate com o total.

**Ressalvas que a tela já mostra** (rodada 3: no "Como calculamos" e no ponteiro, não mais em nota dentro do painel):

1. Tarefa do Spaceflow com prazo igual à criação conta como sem prazo; o "Como calculamos" do SLA diz isso.
2. Rápida criada já concluída não tem `completed_at`; fica fora de tempo e de SLA, e o "Como calculamos" das concluídas diz isso.
3. O 1º e o último ponto do gráfico podem cobrir só parte da semana, do mês ou do ano; o ponteiro diz "Parcial".
4. Tempo de etapa e de fluxo conta só o que terminou; o que está em andamento aparece ao lado, com a idade.
5. Arquivadas e tarefas da lixeira não entram (a API esconde as 2).

**O mock não é o develop.** Os volumes foram escolhidos para a tela contar uma história (uma etapa gargalo, uma pessoa sobrecarregada, um grupo lento). O aumento de "concluídas" contra o período anterior (+80%) vem do trabalho recente que o gerador acrescenta, não de tendência real.

## Crítica e acessibilidade

### Rodada 3

**Crítica (`design:design-critique`):**

- Corrigido: a barra de "Cobrança de fornecedor" (14 h contra 8 d da maior) sumia: a largura calculada ficava negativa. Toda barra tem pelo menos 4 px.
- Corrigido: em "Pendente", a barra saía preta (o neutro do tema), mais pesada que a vencida. Agora é cinza, a convenção de "a fazer".
- Corrigido: o SLA de 2 barras 100% juntas pedia leitura de ida e volta; virou colunas com um seletor.
- Sem correção: a prioridade em develop é quase toda normal (145 de 161). O painel mostra uma coluna alta e 3 baixas. Por isso a prioridade saiu do MVP.
- Sem correção: o rótulo na ponta das linhas de "Criadas e concluídas" encosta na linha quando as 2 séries terminam perto.

**Acessibilidade (`design:accessibility-review`), medido no Chrome:**

- Nome dentro da parte da barra: contraste mínimo de 10,25:1 no claro e 7,83:1 no escuro. Os tons são a cor primária misturada ao fundo, e o amarelo leva texto preto.
- Cada barra é um botão cujo nome traz as partes: "Sem responsável: 68. Vencida 27, Pendente 10, Em andamento 9, Bloqueada 2, Concluída 20".
- Os seletores são `UTabs` com nome: "Contar as tarefas", "Abertas ou concluídas", "Nível".
- Arrastar segue com a alça de teclado em cada painel ("Mover SLA. Use as setas."), agora visível ao passar o mouse.
- Sem medição nesta rodada: tela estreita de 430 px e toque.

### Rodada 2

**Crítica (`design:design-critique`):**

- Corrigido: o título dos números ("TEMPO MÉDIO DE CONCLUSÃO") cortava ao lado do ícone. O ícone e as ações ficam numa linha; o título, na de baixo, com a largura toda. O selo "Agora" ou "No período" subiu para o lado do ícone.
- Corrigido: a tabela de responsáveis rolava para o lado com 7 colunas da grade. Ficou com 8 colunas no arranjo padrão e larguras iniciais que cabem.
- Corrigido: no tempo por etapa, "11 h 36 min" quebrava em 2 linhas; no tempo por fluxo, os números se espremiam em 2 colunas estreitas. Agora a duração não quebra, e as 2 colunas só aparecem quando o painel é largo.
- Corrigido: o menu de origem cortava "Criadas manualmente". O menu cresce com o texto.
- Corrigido: o documento inteiro rolava junto com o painel (um texto só para leitor de tela escapava do contêiner). Agora só a área do painel rola.
- Sem correção: com a grade densa, aumentar um painel pode deixar um buraco na linha de cima. O ClickUp resolve com "Auto layout"; aqui o painel que cabe no buraco sobe, mas nem sempre há um que caiba. "Desfazer" e "Restaurar padrão" cobrem.
- Sem correção: "Vencidas" é 65% das abertas no mock. O gerador deixa tarefas esquecidas, como o develop mostrou (101 de 161 pendentes). É o retrato de um workspace sem gestão de prazo.

**Acessibilidade (`design:accessibility-review`), medido no Chrome:**

- Teclado: no modo de edição, cada painel tem a alça "Mover Abertas. Use as setas." e o canto "Mudar o tamanho de SLA. Use as setas.". O foco fica na alça depois de mover.
- Corrigido: o anúncio para leitor de tela ("Abertas na posição 2 de 15.", "Tempo até o prazo: 5 colunas por 8 linhas.") dizia a posição de antes. Agora diz a nova.
- Esc desfaz o arraste em andamento e sai do modo de edição quando o catálogo está fechado.
- O arrastar só começa depois de 4 px de movimento: clique continua sendo clique.
- Cada painel é uma `section` com o título como nome (`aria-labelledby`); o menu "…" diz de qual painel é ("Mais ações: SLA").
- Número com variação: o selo diz "+78%" na tela e "+78% vs. anterior" para o leitor de tela.
- O texto colorido novo (selos de variação, prazos a vencer) usa o tom 700 no claro e 300 no escuro, a mesma regra da rodada 1.
- Tela estreita (430 px): sem rolagem lateral; números em 2 colunas, o resto em 1; o canto de redimensionar some.
- Sem correção: avisos de hidratação dos ícones de ordenação do `EnTable` no `pnpm dev` (ícones do SDK). Não aparecem no estático.
- Sem correção: arrastar pelo toque não foi medido num aparelho.

### Rodada 1

**Crítica (`design:design-critique`):**

- O olho vai 1º para "Vencidas" em vermelho. Está certo: é por onde o gestor começa.
- Corrigido: o cartão de SLA esticava até a altura do vizinho e deixava um vazio. SLA e Status agora empilham à esquerda, prazos à direita.
- Corrigido: a tabela de responsáveis empurrava o painel para baixo e cortava nomes. Foi para a largura toda, com as 8 maiores filas e "Mostrar os N".
- Corrigido: "Sem prazo" pintado com o neutro do tema (quase preto) pesava mais que "Vencida". Agora é cinza.
- Corrigido: a composição do tempo de fluxo tinha a maior etapa em cinza, lida como vazio. Agora é uma rampa da cor primária, da 1ª etapa à última.
- Corrigido: duração "7 d 24 h" (arredondamento) vira "8 d".
- Corrigido: em inglês, "Dashboard" cortava no menu por causa do selo "New". O selo ficou menor.
- Corrigido (revisão de microtexto): "Abertas com prazo até amanhã, esta hora" virou "Abertas com prazo nas próximas 24 horas"; o estado vazio perdeu a figura ("o painel se enche sozinho"); a regra do gráfico explica o saldo.
- Sem correção: SLA e Status repetem a situação do prazo. Mantido porque respondem perguntas diferentes: SLA diz quanto vence; Status diz em que status a tarefa parou.
- Sem correção: nome das tarefas do mock fica em português no inglês e no espanhol. É dado do workspace, não texto de interface.

**Acessibilidade (`design:accessibility-review`), medido no Chrome, rodada 1:**

- Corrigido: texto em amarelo (1,91:1), verde-azulado (2,49:1) e vermelho pequeno (3,81:1) não passavam. Agora usam o tom 700 no claro e 300 no escuro, a mesma regra do `app/tema-contraste.ts`: mínimo de 4,93:1 no claro e 10,2:1 no escuro.
- Sem correção: as iniciais do `UAvatar` ficam em 4,18:1 (claro) e 4,38:1 (escuro). É o padrão do componente; mexer seria CSS próprio num componente do Nuxt UI.
- Sem correção: o placeholder dos seletores ("Todos os responsáveis") fica em 3,03:1. É o `text-dimmed` padrão do Nuxt UI.
- Teclado: todo número, faixa, linha de status e legenda de SLA é botão; o "Como calculamos" é botão próprio acima do cartão (`z-10`). O foco aparece no cartão (anel) e no botão.
- Corrigido: os 9 botões "Como calculamos" tinham o mesmo nome para o leitor de tela. Agora cada um diz o assunto ("Como calculamos: Vencidas").
- Títulos em ordem: 1 `h1`, um `h2` por bloco, `h3` dentro dos blocos.
- Gráfico: tem `role="img"` com o resumo em texto. O valor de cada barra só aparece no ponteiro do mouse. Registrado como limite.
- Tela estreita (430 px): sem rolagem lateral; os cartões viram 2 colunas; o menu lateral some, como no produto.

## CSS próprio

- `_GraficoSerie.vue`, `<style scoped>`: variáveis do Unovis (`--vis-*`) apontando para os tokens do tema. Consulta: skill `nuxt-ui` e MCP (`search-components "chart"` devolveu 0 componentes). O Nuxt UI não tem gráfico, e o Unovis não lê token sozinho. Mesmo bloco do `configuracoes-do-sistema/_GraficoDeConsumo.vue`.
- Barras de status com largura proporcional ao total (`style="width: …%"`): o `UProgressGroup` divide a barra em partes, mas não encolhe a barra inteira. Consulta: MCP `get-component ProgressGroup`.
- Cor "cinza apagado" (`var(--ui-text-dimmed)`) passada como cor do `UProgressGroup` e do `UProgress`. Correção da rodada 3: o tema gerado (`.nuxt/ui/progress-group.ts`) só tem as cores da paleta (primary a neutral); a cor CSS não pinta. Por isso a barra empilhada da rodada 3 é HTML próprio (abaixo).
- Rodada 2, `app/components/ux/UxGradeDePaineis.vue`: a grade de painéis. Largura e altura de cada painel em variáveis CSS (`--w`, `--h`) lidas por utilitário do Tailwind (`col-span-(--w)`, `row-span-(--h)`); o fantasma do arraste posicionado por `style` (`left`, `top`). Consulta: MCP `nuxt-ui` (`search-components "grid"`: `PageGrid`, que só distribui; `"drag"`: `EditorDragHandle` e `Splitter`, que não reordenam cartão; `TableDragAndDropExample` usa `useSortable`, não instalado).
- Rodada 2, rolagem infinita: `IntersectionObserver` do navegador (`_Sentinela.vue`), dentro do `UScrollArea`. Consulta: MCP `nuxt-ui` (`get-example ScrollAreaInfiniteScrollExample` e `TableInfiniteScrollExample`): os 2 usam `useInfiniteScroll` do `@vueuse/core`, não instalado.
- Rodada 3, `_BarrasHorizontais.vue`: a barra empilhada é uma fila de `span` com `flex-grow` pelo valor e cor por `style`, com o nome dentro da parte. Consulta: MCP `nuxt-ui` (`get-component ProgressGroup`) e o tema gerado: o `UProgressGroup` só aceita cor da paleta e não põe texto dentro da parte. A barra de uma cor da paleta segue no `UProgressGroup`. Largura da barra por `style` (`max(0.25rem, calc(…% - 4.5rem))`), pela mesma razão das barras de status.
- Rodada 3, `_BlocoTempos.vue`: os tons das partes são `color-mix(in oklab, var(--ui-primary) N%, var(--ui-bg))`, cor CSS passada por `style`. O tema não tem tons intermediários da primária como token.
- Rodada 3, `_GraficoColunas.vue`, `<style scoped>`: as mesmas variáveis do Unovis do `_GraficoSerie.vue`.

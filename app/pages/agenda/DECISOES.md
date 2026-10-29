# Agenda · Decisões

## Rodada 1 · 28/10/2026

### Pedido literal

> 3 decisoes eu concordo. pode prototipar tudo

> garanta que ta usando /nuxt-ui:setup-project-with-template (MCP) se for cabivel e /nuxt-ui:find-component-for-usecase
> (MCP) e /nuxt-ui:implement-component-with-props (MCP) pra construir esse prototipo de modo bem realista e cabivel ao
> enspace.

> nao precisa botar no prototipo um botao pra ver como é hoje. economize codigo.

As 3 decisões aprovadas no chat, antes de prototipar:

1. A tarefa com SLA ganha um bloco de trabalho e o prazo fica intacto. Item e tarefa sem SLA mudam de data.
2. A agenda da equipe fica para a rodada 2.
3. A agenda do item é uma aba no painel lateral, que abre na própria Agenda (1 porta só).

### A decisão que orienta as outras

A Agenda passa a ser **lugar de ação sobre o ENSPACE**, não espelho do Outlook (A1 e A2 da
[síntese](pesquisa/SINTESE.md)). Tudo o que a pessoa vê, ela move, conclui, cria ou liga ali mesmo, sem sair da tela.

### Mudou: frente de UI/UX

| O que muda | Por quê | Trava do briefing |
|---|---|---|
| Barra do topo convencional: título, Hoje, setas, período por extenso, seletor Dia · Semana · Mês · Lista | O esqueleto que a pessoa conhece do Outlook e do Google | T2 |
| Fundo verde e vermelho sai; o dia não útil ganha hachura discreta e o fora do expediente, um tom mais escuro | A cor fica livre para dizer o tipo do evento | T2 |
| Hora em 24 h em todo lugar | Hoje mistura "9:00 AM" e "18:04" | T2 |
| Semana e Dia abrem às 08 h, com faixa de dia inteiro e linha da hora atual | Hoje abrem na madrugada, sem as 2 | T3 |
| Cor por tipo: tarefas e blocos no primário, reunião do Outlook no ciano, cada categoria com a cor escolhida | Hoje tarefa e reunião passada têm a mesma cor | T2 |
| Detalhe em popover junto do evento, com data, hora, Teams, participantes com resposta e ações | Hoje é um modal sem data, hora nem ação | T4 |
| Lateral com mini calendário, camadas com caixa colorida e filtro de responsável | Hoje não há filtro e a fonte só liga no painel, com recarga | T7 |
| Configuração legível: a categoria pelo nome, o campo pelo rótulo, início e fim opcionais, cor numa paleta de 5 | Hoje é hexadecimal e "Tipo ID: 1314 - created_at - display" | T8 |
| Salvar a configuração atualiza a grade sem recarregar | Hoje a grade fica 5 s em branco | T8 |
| Primeiro acesso mostra as tarefas da pessoa; o Outlook vira um card na lateral | S1-F2: a persona leu "Conecte seu calendário do Outlook" e saiu | T1 |
| Vista Lista: 14 dias agrupados por dia | A "Agenda" do Pipefy, do Google e do Outlook | |

### Mudou: frente de funcionalidades

| O que entra | Como funciona | Trava |
|---|---|---|
| **Criar pelo horário** | Clique ou arrasto num horário vazio abre a criação rápida com a hora preenchida, em 3 abas: Reunião, Tarefa rápida, Item | T5 |
| **Arrastar grava** | Reunião, tarefa sem SLA, item e bloco mudam de data ou hora; o toast diz o que mudou e tem Desfazer | T6 |
| **Tarefa com SLA** | Fica como marcador no dia do prazo, com cadeado. Arrastada para a grade, ganha um bloco de trabalho; o prazo fica | decisão 1 |
| **Para agendar** | Painel com Atrasadas, "Vencem nesta semana, sem tempo reservado" e Sem data; o cartão se arrasta para a grade | T9 |
| **Reunião ligada a item** | O domínio do e-mail de um participante sugere o item ("Ligar" ou "Não é este"); "Ligado a" liga à mão | T9 |
| **Agenda do item** | Aba Agenda no painel do item: Agendar reunião, próximas, anteriores e as datas do item | decisão 3 |
| **Agendar a partir do item** | "Agendar reunião" volta à grade com um aviso; o horário clicado cria a reunião já ligada | decisão 3 |
| **Concluir na agenda** | Concluir e Reabrir no popover da tarefa | |
| **Categoria como camada** | Qualquer categoria com campo de data vira camada, com cor própria | T8 |

### Fronteira

- **Muda:** o conteúdo da tela Agenda (barra, lateral, grade, popovers, painel do item, configuração).
- **Não muda:** a casca do ENSPACE (menu lateral, barra do topo, trilha), copiada do develop em
  `_CascaDaAgenda.vue` e listada no [BRIEFING](BRIEFING.md), seção "A casca da tela, item por item".

### Componentes

Pela skill e pelo MCP `nuxt-ui` (`find-component-for-usecase`, `get-component-metadata`):

| Peça | Componente | Nota |
|---|---|---|
| Detalhe do evento e criação rápida | `UPopover` com `reference` virtual, controlado por `:open` | Ancora no evento ou no horário clicado |
| Painel do item e configuração | `USlideover` | O mesmo lado do painel de tarefa do develop |
| Abas da criação e do painel | `UTabs` | |
| Participantes | `UInputTags` | E-mail digitado e Enter, como no develop |
| Responsável, "Ligado a" | `USelectMenu` | Com busca |
| Campo, hora, categoria | `USelect` | |
| Estado vazio | `UEmpty` | Grade, lista e aba Agenda do item |
| Aviso de falha e de agendamento | `UAlert` | |
| Desfazer | `useToast` com ação | |
| Vista e setas | `UFieldGroup` com `UButton` | |

**`setup-project-with-template`:** não cabe. O repositório já existe; o template oficial Calendar foi lido no MCP e
serviu de base para a geometria da grade.

**A grade é componente próprio** (`app/components/ux/UxCalendario.vue` e `geometriaDoCalendario.ts`). O Nuxt UI tem
`UCalendar`, que é seletor de data, e o SDK não tem agenda. Registro no `COMPONENTES-CUSTOM.md`.

### CSS e utilitários arbitrários

Nenhum `<style>`. Os utilitários fora da escala do Tailwind, com o motivo:

| Utilitário | Onde | Motivo |
|---|---|---|
| `bg-[repeating-linear-gradient(...)]` | `UxCalendario.vue`, dia não útil | Hachura com a cor de borda do tema; não há utilitário de listra |
| `[&>.peer]:[--sidebar-width:12.5rem]` | `_CascaDaAgenda.vue` | O `EnLayout` não repassa `ui` ao `USidebar`, que fixa 16rem; o develop usa cerca de 200 px |
| `h-dvh` | `_CascaDaAgenda.vue` | A grade rola por dentro, como no develop |
| `w-[22rem]`, `max-w-[calc(100vw-2rem)]` | popovers | Largura do conteúdo do popover, que o Nuxt UI deixa livre |
| `w-[min(50rem,calc(100vw-30rem))]` | trilha da casca | A faixa da trilha do develop |
| `ring-offset-(--ui-bg)`, `ring-(--ui-border-inverted)` | paleta da configuração | Anel da cor escolhida, legível nos 2 temas |
| `pb-(--altura-do-andaime)` | `index.vue` | A barra de andaime não cobre o fim da grade |
| `text-[9px]` a `text-[11px]` | rótulos de hora, mini calendário, selo de idioma | Tamanhos do develop, menores que `text-xs` |
| `animate-[entrada_...]` | eventos, lista, cartões | A curva `entrada` do `main.css`, que respeita `prefers-reduced-motion` |
| `grid-cols-[9rem_1fr]`, `z-[1]`, `z-[5]`, `-top-[5px]` | grade e lista | Coluna da hora, cabeçalho fixo, linha da hora atual |

### Limite da paleta

O tema tem 5 matizes fora do erro: primário (fúcsia), ciano (info e secondary), verde-água (success), amarelo
(warning) e neutro. A configuração oferece só essas 5. Com mais de 5 camadas, 2 repetem a cor.

| Camada | Cor |
|---|---|
| Minhas tarefas e blocos de trabalho | primary |
| Tarefas rápidas | neutral |
| Contratos | warning |
| Processos | success |
| Clientes (desligada no início) | neutral |
| Outlook, meu calendário | info |
| Outlook, Jurídico (compartilhado) | neutral |

**Pergunta ao produto:** o ENSPACE vai ganhar mais matizes no tema, ou a cor da categoria fica presa a 5?

### Descartado

- **Botão "como é hoje":** pedido literal da redatora; o develop está descrito no BRIEFING.
- **Agenda da equipe e carga por responsável:** rodada 2 (decisão 2). O filtro de responsável já aceita várias pessoas.
- **Agendamento automático (Motion, Reclaim):** a pesquisa mostra perda de controle e tarefa por cima de reunião.
- **Ritual de planejamento do dia (Sunsama):** pesado para quem só quer ver o dia.
- **Escolher a cor em hexadecimal:** a paleta do tema garante contraste nos 2 temas.

### Não deu

- **Recorrência e fuso horário:** fora desta rodada; a reunião recorrente aparece como eventos soltos.
- **Arrastar a borda para mudar a duração:** só o arrasto de criar define a duração; mover mantém a duração.
- **Teclado na grade (setas entre dias, Page Up e Page Down):** os eventos e horários são botões focáveis com Tab;
  a navegação por setas do WAI-ARIA APG fica para a implementação.

### Maquete

- Dado fictício do `mocks.ts`: workspace Aurora Serviços, e-mails `.example`, nenhum cliente real.
- O dia é fixo (28/10/2026, 10:40), para os prints e a revisão mostrarem a mesma semana.
- Conectar o Outlook simula 1,2 s de carregamento; nada sai do navegador.
- A sugestão de vínculo compara o domínio do e-mail do participante com o `dominio` do item no mock. Na
  implementação, a regra precisa de um campo de e-mail ou domínio por categoria (pergunta em aberto na síntese).
- O reload volta tudo ao início; o andaime tem Reiniciar e 5 cenários: Semana cheia, Primeiro acesso, Outlook fora do
  ar, Semana vazia e Carregando.

### Perguntas em aberto

- A configuração da Agenda vale para o workspace inteiro ou para cada pessoa? O protótipo trata como do workspace, como no develop.
- Ligar a reunião a item pelo e-mail pede um campo de contato por categoria: existe um campo padrão?
- O Google entra no roteiro, ou o Outlook é a única integração?
- O bloco de trabalho vai para o Outlook como evento ocupado?

### Crítica e acessibilidade

Feitas com as skills `design:design-critique` e `design:accessibility-review` (WCAG 2.1 AA), nos 2 temas, em
2026-10-28.

**Primeira impressão.** O olho vai primeiro ao dia de hoje (o círculo fúcsia) e à linha da hora atual, e depois ao
painel Para agendar com o selo de pendentes. É a ordem certa: onde estou, o que falta.

**O que funciona:**

- o esqueleto do Outlook, sem nada a aprender;
- a faixa de dia inteiro separa o prazo da reunião, e o cadeado diz qual prazo não se move;
- o bloco tracejado diz "tempo reservado" sem legenda;
- a hachura marca fim de semana e feriado sem pintar a coluna inteira.

**Corrigido nesta rodada:**

| Achado | Critério | Correção |
|---|---|---|
| Hora da grade, "Dia inteiro", e-mail do Outlook e notas com `text-dimmed`: 4,1:1 no escuro | 1.4.3 | `text-muted` |
| Hora dentro do evento com `text-muted` sobre o fundo colorido: 4,4:1 no claro | 1.4.3 | `text-toned` |
| Fechar o popover com Esc deixava o foco no `body`: a âncora é virtual | 2.4.3 | O foco volta ao botão que abriu |

**Ficou sem corrigir, e por quê:**

| Achado | Critério | Motivo |
|---|---|---|
| Texto branco sobre o fúcsia do tema (Novo, hoje): 3,4:1 | 1.4.3 | É o `primary` do tema, copiado do en-docs; muda no tema, não no protótipo |
| Dias do mês vizinho com `text-dimmed`: 3,0:1 no claro | 1.4.3 | Rebaixados de propósito, como no Google; o número também está no mês dele |
| Tarefas rápidas e o calendário Jurídico têm a mesma cor neutra | 1.4.1 | Limite da paleta (5 matizes); o ícone de cada evento separa os 2 |
| Na quarta cheia, 3 eventos sobrepostos ficam estreitos e cortam o título | | O Outlook faz igual; o popover mostra o título inteiro |
| Popover sem nome acessível próprio | 4.1.2 | O foco entra no popover, mas o leitor de tela não anuncia o nome do evento; fica para a implementação (`aria-labelledby` no título) |
| Grade sem setas entre dias (WAI-ARIA APG) | 2.1.1 | Tudo se alcança com Tab, e o "Novo" cria sem o mouse; as setas ficam para a implementação |

### Ver

- Protótipo: `/agenda` (o andaime leva a cada cenário e às telas de dentro).
- [BRIEFING](BRIEFING.md) · [PESQUISA](PESQUISA.md) · [SINTESE](pesquisa/SINTESE.md)

| Print | O que mostra |
|---|---|
| ![](evidencias/semana-claro.png) | A semana no tema claro: faixa de dia inteiro, linha da hora atual, blocos tracejados e o painel Para agendar |
| ![](evidencias/semana-escuro.png) | A mesma semana no tema escuro |
| ![](evidencias/reuniao-com-sugestao.png) | A reunião do Outlook com o item sugerido pelo e-mail do participante |
| ![](evidencias/tarefa-com-sla.png) | A tarefa com SLA: o prazo trancado e o tempo reservado |
| ![](evidencias/agenda-do-item.png) | A aba Agenda no painel do contrato |
| ![](evidencias/configuracao.png) | A configuração com a categoria pelo nome, o campo pelo rótulo e a cor na paleta |

## Rodada 2 · 29/10/2026

### Pedido literal

> certo, se tem relaçao da agenda pro item, como é a relação contraria, do item pra agenda? como é o front do item? isso
> ta no prototipo? e como é o front da tarefa, ja que a agenda vai pra tarefa e temos que pensar a volta disso tambem?
> deve ser possivel, do item, marcar algo na agenda e, da tarefa, mexer na agenda? e como interagir com OUTLOOK no
> item/tarefa? tem que pensar tudo isso.

> e sobre este ponto > Onde pode não caber: categoria com campo obrigatório. [...] voce precisa prototipar essa ideia
> aqui.

> e sobre o trecho da sua resposta "riscos que voce precisa julgar", voce deve prototipar feedback ao usurio de cada um
> desses cenarios. e no caso, nao permitir nada que ele nao possa fazer (se nao pode criar item numa categoria nem pode
> aparecer pra ele a opçao na hora de fazer isso)

### A decisão que orienta as outras

**A Agenda não oferece o gesto que vai falhar.** Sem permissão, o evento não se arrasta, o botão não aparece e a
categoria some da criação. Onde a pessoa espera a ação e ela não está, uma linha diz o motivo. A regra mora em
`estado.ts` (`ehMinha`, `podeConcluir`, `podeEditarItem`, `podeCriarEm`, `ehOrganizador`), e toda tela lê dela.

### Mudou: a volta, do item e da tarefa para a Agenda

| O que entra | Onde | Como funciona |
|---|---|---|
| **Pasta Agenda na tela do item** | Depois de Tarefas, na barra de pastas | O mesmo conteúdo da aba Agenda do painel (`_AgendaDoItem.vue`): agendar reunião, ligar reunião existente, próximas e anteriores com "Entrar na reunião", tarefas com o tempo reservado e as datas do item com "Ver na Agenda" |
| **Agendar reunião sem ir à grade** | Item e tarefa | Formulário no lugar: dia, início, fim, participantes (o contato do item já entra), Teams e a linha de conflito com a agenda da pessoa. Na Agenda, "Escolher o horário na grade" volta ao caminho da rodada 1 |
| **Ligar reunião existente** | Item | Lista das reuniões da pessoa nos próximos 14 dias, sem vínculo, fora as particulares e as diárias |
| **Aba Agenda no painel da tarefa** | Depois de Comentários | Prazo editável quando a tarefa é da pessoa e não tem SLA; trancado com o motivo quando tem. Tempo reservado com "Reservar tempo", conflito e "Mostrar como ocupado no Outlook". Reuniões do item e "Agendar reunião sobre a tarefa" |
| **1 painel de tarefa só** | Agenda, item e Tarefas | A Agenda abre o mesmo painel da tela de Tarefas, com a aba Agenda a mais. "Acessar Item" leva à tela do item |

### Mudou: campo obrigatório na criação rápida

| Situação | O que a pessoa vê |
|---|---|
| A categoria pede obrigatórios que o popover não tem | Uma caixa lista os campos que faltam; o botão vira "Continuar no formulário" |
| A categoria não pede | "Mais campos" abre o mesmo formulário, opcional |
| No formulário | "Novo registro" com todos os campos da categoria. A data e as horas vêm preenchidas pelo horário escolhido, com a ajuda "Preenchido pelo horário escolhido na Agenda". Criar confere os obrigatórios e o formato do e-mail |

### Mudou: cada risco tem resposta na tela

| Risco | O que a pessoa vê |
|---|---|
| Fluxo do Spaceflow no campo de data | O popover avisa "Alterar Fim da vigência dispara o fluxo Aviso de renovação". Mover pede confirmação com o efeito do fluxo; depois, o toast não tem Desfazer e um segundo toast diz que o fluxo rodou |
| Reunião organizada por outra pessoa | Não se arrasta nem muda de horário. "Organizada por Paulo Brandão. Só quem organiza a reunião altera o horário." e a resposta ao convite (Sim, Talvez, Não) |
| Item sem permissão de editar | Não se arrasta; a data some do popover e uma linha diz o motivo. Agendar e ligar reunião somem da Agenda do item |
| Categoria sem permissão de criar | Some da aba Item da criação; sem nenhuma categoria, a aba Item some |
| Tarefa de outra pessoa | Não se arrasta, não conclui; uma linha diz quem é o responsável |
| Tarefa de aprovação ou com formulário | Não conclui com 1 clique: "Cumprir tarefa" abre o modal com Aprovar e Reprovar, ou com o campo do formulário antes de "Concluir Etapa" |
| Falha no vínculo | Toast de aviso que fica: "Reunião criada no Outlook, sem o vínculo", com "Ligar de novo" |
| Privacidade | Evento particular do Outlook não se liga a item e não entra na sugestão. Ao ligar, a nota diz o que quem tem acesso ao item passa a ver |
| Outlook desconectado | Reunião some da criação; no item, as reuniões ligadas continuam à vista e um aviso leva a Conectar |

### Mudou: tarefas na Agenda pelo prazo, e o painel "Para agendar" virou "Sem data"

Pedido da redatora: "tem como configurar pra automaticamente toda TAREFA aparecer na agenda ja? uma config global, no
caso, usando a due date da tarefa? no caso \"toda tarefa atribuida a mim\"". Ela também perguntou se o painel "Para
agendar" fazia sentido.

| O que | Antes | Agora |
|---|---|---|
| Configuração | Só categorias, Outlook e horário | Bloco **Tarefas** no topo: "Mostrar as tarefas atribuídas a cada pessoa", ligado por padrão, para o workspace inteiro. Tarefas do fluxo e tarefas rápidas entram na Agenda de quem as recebeu, no dia e na hora do prazo |
| Desligado | Não existia | Somem da grade as tarefas e os blocos, as camadas Tarefas e Tarefas rápidas da lateral e o botão "Sem data" |
| Cada pessoa | Camadas na lateral | Continua: oculta Tarefas ou Tarefas rápidas na lateral, sem mudar a configuração |
| Painel | "Para agendar", aberto, com Atrasadas, "Vencem nesta semana, sem tempo reservado" e Sem data | **"Tarefas sem data"**, fechado por padrão. O botão "Sem data" da barra mostra quantas são e abre o painel. Arrastar o cartão para a grade dá o prazo |

Por que o painel encolheu:
- ele saiu da pesquisa de mercado (ClickUp, Jira, Airtable), não da demanda;
- Atrasadas repetia a grade: a tarefa atrasada já aparece no dia do prazo, com o alerta;
- "sem tempo reservado" cobrava reservar tempo, que é opção da tarefa (aba Agenda do painel), não pendência;
- sobra o que a grade não mostra: a tarefa sem prazo.

Os prints `criacao-com-obrigatorios.png` e `reuniao-de-outra-pessoa.png` são de antes do ajuste e mostram o painel
antigo aberto; o que eles provam não muda.

### Mudou: cumprir a tarefa sem sair da Agenda

Pedido da redatora: "deve ser possível o usuário cumprir a tarefa diretamente pela agenda, renderizando o modal da
tarefa ali na agenda. o botao de \"Ir pra tarefa\" nao deve sumir".

- O popover da tarefa troca "Concluir" por **Cumprir tarefa**, no primário, para a tarefa aberta da pessoa.
- Cumprir tarefa abre o **modal da tarefa** sobre a grade: item, vencimento (com o cadeado do SLA), responsável e a ação
  de cada tipo:
  - tarefa comum: "Concluir Etapa";
  - aprovação: Aprovar e Reprovar;
  - formulário: o campo obrigatório, e "Concluir Etapa" liberado depois do preenchimento.
- Concluiu, o modal fecha, o toast confirma e a grade risca a tarefa.
- **Ir para a tarefa** fica no popover e no rodapé do modal. Abre a tarefa inteira (abas Tarefa, Item, Histórico,
  Comentários e Agenda), para quem prefere a tela completa. No develop, a Agenda abre direto o painel, sem esse passo.
- A ação é 1 componente só (`_CumprirTarefa.vue`), usado no modal e na aba Tarefa do painel.
- Tarefa de outra pessoa: o popover mostra só "Ir para a tarefa", como antes.

### Mudou: "Conectar Outlook" abre a tela de integrações do perfil

Pedido da redatora: "na hora que o user clicar em conectar oulook, tem que renderizar a tela de integraçao que temos
hoje pra conectar o outlook". No develop, a conexão fica em Perfil › Integrações, fora do workspace.

- Todo "Conectar Outlook" da Agenda (lateral, Configuração, pasta Agenda do item, criação de reunião) leva à tela de
  integrações. "Tentar novamente", do Outlook fora do ar, continua só refazendo a leitura: a conta segue conectada.
- **Cópia** (`_CascaDoPerfil.vue` e o miolo de `_TelaDeIntegracoes.vue`), vista em 29/10/2026 em
  `https://develop.enspace.io/profile?tab=integrations`: barra do topo sem menu lateral, abas Perfil, Cobrança,
  Integrações, Dev, Lab e Segurança, o cabeçalho Integrações e a seção Outlook com os cartões Calendário e Correio.
- **Não deu:** ver o estado inicial no develop. A conta do develop já está conectada, e desconectar mexeria na conta da
  redatora. O DOM e o código da página não trazem o rótulo do botão sem conexão, e a pesquisa de UX não tem print da
  tela. O estado "Não conectado" do protótipo é proposta, não cópia.
- **Proposta:**
  - "Voltar para a Agenda" (ou "Voltar para o item") no alto, e o aviso de sucesso com o mesmo botão;
  - o estado em palavras no cartão: "Não conectado", "Conectado como <conta>", a recusa da Microsoft com "Tentar de
    novo". No develop há só um ponto verde e o botão desligado "Integrado";
  - antes do clique, o que o botão faz (abre a janela da Microsoft) e o que a Agenda ganha;
  - "Reconectar" e "Desconectar" com nome. No develop há um ícone de atualizar sem rótulo nem dica (achado).
- A janela da Microsoft é simulada: um modal tracejado que diz o que acontece no produto, com "Simular autorização" e
  "Simular recusa". O protótipo não imita a página da Microsoft e não pede nenhum dado.

### Mudou: a reunião se liga a mais de um item

Pedido da redatora: "deve ser possivel ligar um evento a mais de um item".

- A reunião guarda uma lista de itens (`itens: number[]` no `mocks.ts`), não um item só. Exemplo do mock: a preparação
  da audiência liga o processo e o contrato; a negociação com a Ondas Telecom liga o contrato e o cliente.
- No popover da reunião, cada item ligado tem a própria linha, com "Abrir item" e o botão de desligar. "Ligar a outro
  item" continua abaixo enquanto houver item para ligar. A sugestão pelo domínio ignora o item que já está ligado.
- Na criação, "Ligado a" da reunião aceita vários itens. A tarefa rápida continua com 1 item: no produto, a tarefa
  pertence a um item.

### Mudou: criar no padrão do Google Agenda, com o horário opcional

Pedido da redatora: "se voce clica no header, pode estar criando só evento/tarefa [...] e pode optar por adicionar um
horario reservado pra aquilo. se eu clico em adicionar horario automaticamente sai do topo e vai pra baixo".

- O popover de criação troca a linha de texto ("29 de outubro · Dia inteiro") por um bloco "Quando": a data, e o botão
  "Adicionar horário" ("Reservar horário" na tarefa rápida).
- Com o horário: início e fim em passos de 15 minutos, o fim com a duração ("15:00 (1 h)"), e "Dia inteiro" para
  voltar. Mudar o início mantém a duração. O fantasma muda de lugar na hora: desce para a grade com o horário e volta
  para a faixa do alto sem ele.
- O horário sugerido é o próximo quarto de hora de agora, hoje, e 09:00 nos outros dias, com 1 hora de duração.
- A tarefa rápida fica na faixa do alto, no dia do prazo. Com "Reservar horário", a mesma criação reserva o tempo na
  grade (o bloco que o arraste cria), e a frase abaixo diz o que acontece com cada um.
- O item só ganha horário quando a categoria tem campo de hora (Audiência do Processo tem; Próxima visita do Cliente
  não). Sem campo de hora, o botão não aparece e a frase diz por quê.
- Clicar na grade continua criando com o horário do clique, e os mesmos campos deixam mudar.

### Mudou: Google Agenda preparado, em breve

Pedido da redatora: "prepare o prototipo pra receber integração com google agenda [...] coloque um "em breve" e a opçao
ainda disabled".

- `PROVEDORES`, no `estado.ts`, lista os calendários externos com `disponivel`. O Google está com `false`, e toda tela
  lê a lista: ligar o Google é trocar a flag e ligar a janela de autorização.
- A reunião tem `provedor` (`'outlook' | 'google'`), para a grade e o popover saberem de onde ela vem quando houver 2.
- Onde aparece, desligado e com "Em breve":
  - na tela de integrações, a seção Google com o cartão "Agenda do Google" e "Conectar" desligado;
  - na Configuração, a seção Outlook virou "Calendários externos", com o Outlook e a linha do Google;
  - na lateral, abaixo do Outlook, a linha "Google Agenda".

### Mudou: botão direito no evento

Pedido da redatora: "pense tambem no que deve ocorrer se eu clicar com botao direito no evento. tanto o teams quanto o
meet apresentam opçoes". O Teams (que é a agenda do Outlook) tem o menu mais completo: participar, chat, copiar o link,
abrir, encaminhar, mostrar como, categorizar, particular, duplicar, salvar .ics e excluir. O Google Agenda tem a
resposta ao convite, participar, excluir e a cor.

- O menu (`menuDoEvento.ts`) abre no evento da grade. No vazio, fica o menu do navegador.
- Entra só o que a pessoa pode fazer, a mesma regra do popover:
  - **reunião de outra pessoa:** "Você vai?" com Sim, Não e Talvez, que vai ao Outlook;
  - **reunião no Teams:** participar e copiar o link;
  - **toda reunião:** abrir os detalhes e, com itens ligados, o submenu com cada item;
  - **reunião minha:** cancelar, com Desfazer;
  - **tarefa:** cumprir (ou reabrir), ir para a tarefa, reservar horário, abrir o item, copiar o link;
  - **tempo reservado:** as ações da tarefa e "Remover tempo reservado", com Desfazer;
  - **item:** abrir os detalhes, abrir o item, copiar a referência.
- **"Agendar reunião sobre isto"**, na tarefa e no item, vem do Outlook, que marca uma reunião no Meet a partir de um
  evento. Aqui, a criação de reunião abre com o título já preenchido e o vínculo feito, no dia do prazo (ou hoje, se já
  passou). Sobre a tarefa, a reunião se liga à tarefa; sobre o item, ao item (ver "Mudou: modelagem").
- Ao fechar, o menu não devolve o foco ao evento: o foco de volta fechava o popover que a ação acabava de abrir.
- Do Teams, ficou de fora o que o ENSPACE não guarda: encaminhar, mostrar como, categorizar, salvar .ics e duplicar. A
  cor é a da fonte, na Configuração; trocar por evento quebraria a leitura por fonte.

### Mudou: modelagem

A análise de entidades e relações da rodada 2 apontou 17 lacunas (B1 a B17). Pedido da redatora: "se vc ta agendando
reuniao pra tarefa, é pra tarefa, nao pro item. o item fica com a tarefa vinculada a ele e ela, por sua vez, tem uma
reuniao", e "pode aplicar todas as correçoes, nao só as de alta prioridade. apique todas as decisoes recomendadas".

**As 3 decisões recomendadas, aplicadas:**

1. O vínculo é do workspace, não da pessoa. Quem tem acesso ao item vê a reunião ligada, com quem ligou e quando.
2. Ligar uma reunião recorrente liga a série inteira. "Só esta" liga só aquela ocorrência.
3. Trocar o responsável da tarefa oferece ao novo responsável os horários reservados que ainda não começaram. Eles
   passam para a Agenda dele só se ele aceitar; recusou, saem.

**A reunião e o que ela liga:**

| Id | Lacuna | No protótipo |
|---|---|---|
| B1 | "Agendar reunião" na tarefa ligava ao item | A reunião agendada sobre a tarefa se liga à tarefa. O item chega a ela pela tarefa: a pasta Agenda mostra "Pela tarefa ...", e o painel da tarefa tem "Reuniões da tarefa" |
| B2 | O vínculo era uma lista dentro da reunião | O vínculo é uma entidade própria: reunião, alvo (item ou tarefa), série, situação (ligado ou recusado), origem (criação, manual ou sugestão), quem ligou e quando |
| B3 | O vínculo dependia do id do evento na agenda de cada pessoa | A chave é o identificador do evento no Outlook, igual para todos os participantes. O mesmo workshop em 2 calendários aparece 1 vez |
| B4 | A reunião mostrava todo item ligado | O item sem permissão de leitura vira "1 item sem acesso", sem título nem referência |
| B10 | A reunião recorrente não existia como série | A série tem id próprio. Ligar oferece "Toda a série" ou "Só esta"; a série aparece 1 vez em "Ligar reunião existente" |
| B11 | Cancelar apagava a reunião | Cancelar tira a reunião da grade e a deixa no histórico do item, riscada e marcada "Cancelada" |
| B15 | O domínio da sugestão era um campo fixo no item | O domínio sai dos campos de e-mail do item. Domínio público (gmail.com e afins) e o da própria empresa ficam fora |
| B16 | Reunião particular ligada mostrava o título | O vínculo fica; quem não participa vê "Evento particular", com data e hora |
| B17 | A reunião não tinha fuso | A reunião de quem organiza em outro fuso mostra, no detalhe, a hora de lá com o nome do fuso no idioma da tela |

**A tarefa e o tempo reservado:**

| Id | Lacuna | No protótipo |
|---|---|---|
| B5 | O tempo reservado não tinha dono | Cada horário reservado tem dono. O oferecido traz "Aceitar o horário" e "Recusar"; quem ofereceu vê "aguardando" |
| B6 | O tempo reservado não ia ao Outlook | O horário reservado vira evento no Outlook. Remover ou mover avisa que o Outlook também muda |
| B13 | A tarefa só aparecia para o responsável | Quem colabora também vê a tarefa, com o ícone de pessoas e "Você colabora", e reserva o próprio horário. Quem conclui é o responsável |
| B14 | A tarefa rápida não dizia a que item pertence | O detalhe da tarefa rápida tem "Item da tarefa", com "Sem item". A tarefa de fluxo sempre tem item |

**O item e as datas:**

| Id | Lacuna | No protótipo |
|---|---|---|
| B7 | Os calendários do Outlook eram uma lista fixa | Os calendários vêm da conexão: o da pessoa e os compartilhados, cada um com nome e cor |
| B8 | A categoria entrava na Agenda por 1 data só | A categoria entra por mais de uma data ("Adicionar outra data"); a lateral mostra "Contratos · Fim da vigência" e "Contratos · Data de assinatura" |
| B9 | O evento durava 1 dia | A data pode ter data de fim, e o item ocupa os dias entre as 2. A reunião também pode durar vários dias |
| B12 | O responsável do item era fixo | A data escolhe o campo de pessoa que diz de quem é o item. Sem campo, todas as pessoas veem |

**Regras de dependência:**

- Concluir a tarefa tira os horários reservados que ainda não começaram e diz quantos saíram.
- Atribuir a tarefa a outra pessoa, pelo botão direito ("Atribuir a"), oferece os horários futuros a ela, com Desfazer.
- "Não é este" recusa a sugestão, e o mesmo item não volta a ser sugerido para aquela reunião.
- O campo de data que sai do formulário da categoria deixa a data fora da Agenda, com o aviso na Configuração, até a
  troca do campo.
- Criar o item pela Agenda grava quem criou e, com o campo de pessoa configurado, o responsável.

### Julgado: criar no alto à moda do Outlook

A redatora mostrou o Outlook: 1 clique no alto abre um campo no próprio dia, basta digitar o título, e o evento nasce
de dia inteiro. O horário fica no "Agendador", num 2º modal, e é ali que o Outlook perde para o Google.

- O popover já faz a mesma conta de gestos: clicar, digitar, Enter. O título vem focado.
- Ele mostra, no mesmo lugar, o tipo (reunião, tarefa rápida, item) e o horário, que no Outlook ficam em outra tela.
- Fica o popover. O campo no próprio dia volta à mesa se o teste com pessoas mostrar que o popover pesa.

### Julgado: agendamento de horários (página de reserva)

Pedido da redatora: "trazer a funcionalidade de agendamento de horario tambem pode ser interessante. julgue se realmente
é, considerando que hoje temos só integração com oulook".

O agendamento de horários do Google Agenda é uma página pública em que alguém de fora escolhe um horário livre e a
reunião entra no calendário. **Recomendação: não construir agora.**

- O Outlook já tem a mesma coisa: o Personal Bookings ("Bookings with me"), com página pública, tipos de reunião de 15 e
  30 minutos e a reunião caindo direto no calendário do Outlook
  ([Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/bookings/personal-bookings-faq?view=o365-worldwide)).
  Ele depende de licença com o Bookings (Business Standard e Premium, A3 e A5, E3 e E5, nestas com o administrador
  ligando), e o administrador pode desligar
  ([Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/bookings/bookings-in-outlook?view=o365-worldwide)).
- Fazer a nossa repete o Outlook e pede o que o ENSPACE não tem hoje: página pública fora do login, cálculo de
  disponibilidade e criação de reunião em nome de quem reserva.
- Ganho maior e mais barato, dentro da Agenda:
  - em "Agendar reunião", sugerir os horários livres de todos os participantes internos (o Outlook informa o livre e o
    ocupado);
  - quando a pessoa tem Bookings, um campo no perfil com o link da página dela, para mandar ao cliente pelo item.
- Fica fora do protótipo. Vale reabrir se o Google entrar e o cliente sem Bookings pedir.

### Fronteira

- **Muda:** a pasta Agenda na tela do item, a aba Agenda no painel da tarefa, o formulário completo na criação, os
  avisos de permissão e de risco, o bloco Quando da criação, a reunião com vários itens, o menu do botão direito e as linhas do Google.
  Na modelagem: o "Ligado a" do detalhe, a lista de reuniões da pasta Agenda e do painel da tarefa, a Configuração por
  data, os rótulos das camadas na lateral e o horário oferecido.
- **Não muda:** a tela do item e o painel da tarefa fora dessas partes. As 2 cascas foram copiadas de novo do develop em
  29/10 (`_TelaDoItem.vue`, `_PainelDaTarefa.vue`): abas sublinhadas, painel do item em caixas, trilho de ícones do
  painel da tarefa, "Detalhes da Tarefa" e "Concluir Etapa". As outras pastas e a aba Comentários mostram só "não muda".
- **Achado, não proposta:** o develop tem 2 painéis de tarefa. O da Agenda (abas Tarefa, Item, Histórico) é diferente do
  de Tarefas › Agendadas (trilho de ícones, abas Tarefa, Item, Histórico, Comentários). O protótipo usa o de Tarefas
  nos 2 lugares.

### Descartado

- Botão desligado com dica para o que a pessoa não pode fazer: o pedido foi não oferecer. A linha do motivo fica onde a
  pessoa espera a ação.
- Ligar pelo Mail Box do item (convidar o endereço do item na reunião do Outlook): proposto e retirado na mesma rodada,
  a pedido da redatora. A pessoa precisaria saber que o item tem endereço, e o endereço apareceria entre os convidados
  do cliente. Nenhum produto da [pesquisa](pesquisa/SINTESE.md) liga assim: Attio, Twenty e HubSpot ligam pelo e-mail
  do participante e pelo domínio, Notion e ClickUp pelo vínculo manual, Clio e Odoo criando a reunião dentro do
  registro. O protótipo já tem os 3 caminhos: a sugestão pelo domínio, "Ligado a" e "Ligar reunião existente", e
  "Agendar reunião" no item e na tarefa.

- Página própria de agendamento de horários: o Outlook já tem o Personal Bookings (ver "Julgado" acima).

### Andaime

O menu "Ir para" ganhou o grupo Rodada 2: tela do item, painel da tarefa, criar item com obrigatórios, item com fluxo na
data, item só para leitura, reunião de outra pessoa, tarefa de aprovação, evento particular e "Simular falha no próximo
vínculo". O atalho mostra todas as pessoas quando o filtro esconde o evento.

O grupo Modelagem leva a cada caso novo: reunião ligada pela tarefa, vínculo feito por outra pessoa, reunião com item
sem acesso, série ligada, item com reunião particular de outra pessoa, horário oferecido, tarefa em que se colabora,
reunião em outro fuso, evento de vários dias e data com campo removido.

### Perguntas em aberto

- A pergunta da rodada 1 "o bloco vai para o Outlook como ocupado?" virou opção por bloco, ligada por padrão. Confirmar
  com produto.
- Ligar a reunião sem sair do Outlook pede um suplemento do Outlook (o caminho do HubSpot e do Salesforce, fora da
  pesquisa): entra no roteiro?
- O fluxo com gatilho em campo de data roda quando a data muda pela Agenda, ou só pelo formulário do item?
- O horário reservado tem duração padrão de 1 hora. Fica fixo ou vira configuração da pessoa (30 min, 1 h, 2 h)?
- Respondida na modelagem: a reunião ligada a 2 itens aparece no histórico dos 2, porque cada vínculo é um registro
  próprio. Fica a outra metade: o e-mail da reunião, quando houver, também vai aos 2?
- Respondida na modelagem: a tarefa compartilhada com a pessoa (quem colabora) entra na Agenda dela. Fica a outra
  metade: a tarefa atribuída a um grupo de que ela faz parte também entra?
- O vínculo feito por outra pessoa pode ser desfeito por quem edita o item. Desfazer pede aviso a quem ligou?
- Quem recusa o horário oferecido devolve o horário a quem tinha, ou ele some? O protótipo tira.

### Ver

| Print | O que mostra |
|---|---|
| ![](evidencias/tela-do-item-agenda.png) | A pasta Agenda na tela do item: agendar, ligar, reuniões, tarefas e datas do item |
| ![](evidencias/painel-da-tarefa-agenda.png) | A aba Agenda no painel da tarefa: prazo do SLA trancado, tempo reservado e o conflito |
| ![](evidencias/criacao-com-obrigatorios.png) | A criação rápida avisa os 2 obrigatórios e passa a "Continuar no formulário" |
| ![](evidencias/formulario-do-item.png) | O formulário completo, com a data vinda da Agenda e os obrigatórios cobrados |
| ![](evidencias/fluxo-na-data.png) | A confirmação antes de mudar a data que dispara o fluxo |
| ![](evidencias/reuniao-de-outra-pessoa.png) | Reunião de outra pessoa: sem mudar o horário, com a resposta ao convite |
| ![](evidencias/configuracao-tarefas.png) | O bloco Tarefas no topo da Configuração, ligado por padrão |
| ![](evidencias/develop-perfil-integracoes.png) | O develop em 29/10: Perfil › Integrações com o Outlook já conectado |
| ![](evidencias/janela-da-microsoft.png) | "Conectar" abre a janela da Microsoft, simulada, com autorizar e recusar |
| ![](evidencias/integracoes-conectado.png) | Calendário conectado, com a conta e a volta para a Agenda; Correio recusado, com "Tentar de novo" |
| ![](evidencias/cumprir-tarefa-na-agenda.png) | O modal da tarefa sobre a grade: Concluir Etapa e, no rodapé, Ir para a tarefa |
| ![](evidencias/painel-sem-data.png) | O painel Tarefas sem data, aberto pelo botão da barra, com as 3 tarefas sem prazo |
| ![](evidencias/criacao-com-horario.png) | Tarefa rápida criada na faixa do alto, com "Reservar horário": o fantasma desce para 09:00 às 10:00 |
| ![](evidencias/reuniao-com-dois-itens.png) | Reunião criada pelo botão direito da tarefa, ligada ao contrato e ao cliente, cada um na sua linha |
| ![](evidencias/menu-da-tarefa.png) | O botão direito na tarefa: cumprir, ir para a tarefa, reservar horário, abrir o item, agendar reunião |
| ![](evidencias/menu-da-reuniao.png) | O botão direito na reunião que organizo: detalhes, os 2 itens ligados e cancelar |
| ![](evidencias/integracoes-google-em-breve.png) | A tela de integrações com o Google Agenda em breve, com o Conectar desligado |
| ![](evidencias/modelagem-12-reuniao-sobre-a-tarefa.png) | B1: "Agendar reunião sobre isto" na tarefa abre a criação com "Ligado a: Tarefa · Protocolar contestação" |
| ![](evidencias/modelagem-13-reuniao-ligada-a-tarefa.png) | B1: a reunião criada mostra a tarefa em "Ligado a", com quem ligou e "Ir para a tarefa" |
| ![](evidencias/modelagem-14-reunioes-da-tarefa.png) | B1: o painel da tarefa lista "Reuniões da tarefa" e diz que as do item ficam na pasta do item |
| ![](evidencias/modelagem-01-reuniao-pela-tarefa.png) | B1: a pasta Agenda do CT-2047 mostra a reunião "Pela tarefa Conferir o cálculo de reajuste..." |
| ![](evidencias/modelagem-02-ligada-por-outra-pessoa.png) | B2 e B3: "Ligada por Tomás Arantes em 26/10/2026", com a sugestão pelo e-mail do participante |
| ![](evidencias/modelagem-03-item-sem-acesso.png) | B4: a reunião com um chamado ligado mostra "1 item sem acesso" |
| ![](evidencias/modelagem-04-serie-ligada.png) | B10: a série ligada ao CL-124, com "Toda a série" e "Só esta" |
| ![](evidencias/modelagem-05-particular-e-cancelada.png) | B11 e B16: o evento particular de Paulo sem título e a visita cancelada, riscada, nas anteriores |
| ![](evidencias/modelagem-06-horario-oferecido.png) | B5: o horário reservado por Diego oferecido a Lia, com Aceitar e Recusar |
| ![](evidencias/modelagem-07-tarefa-em-que-colabora.png) | B13: a tarefa de Tomás em que Lia colabora, com o próprio horário a reservar |
| ![](evidencias/modelagem-08-outro-fuso.png) | B17: a reunião de Lisboa com "13:00 às 13:45 no fuso de quem organizou (Horário da Europa Ocidental)" |
| ![](evidencias/modelagem-09-varias-datas-e-campo-removido.png) | B8, B9 e B12: Clientes com 2 datas, data de fim, responsável e o aviso do campo removido |
| ![](evidencias/modelagem-10-tarefa-atribuida.png) | "Atribuir a" no botão direito: a tarefa sai da Agenda, com Desfazer |
| ![](evidencias/modelagem-11-horario-oferecido-ao-novo-responsavel.png) | Decisão 3: o horário futuro da tarefa atribuída fica oferecido a Diego Salles |

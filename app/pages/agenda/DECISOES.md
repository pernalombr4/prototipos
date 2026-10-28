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

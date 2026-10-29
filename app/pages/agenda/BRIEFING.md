# Agenda · Briefing

## A demanda como ela veio

> observe a tela AGENDA do enspace.
>
> se ja estiver configurada no workspace que voce entrar, vai faltar ver o estado inicial dela ainda, ok? considere isso.
>
> a agenda tem 2 problemas:
>
> 1. os usuarios acham feia e confusa de usar. Basicamente, problemas de UI e UX grandes.
> 2. a agenda mal se integra ao enspace. os usuarios retornam que é praticamente a mesma coisa que abrir a agenda da microsoft do lado de fora do sistema e ficar olhando, o que é ainda melhor pq a interface nao é confusa. nao fica integrada com as entidades do sistema realmente, como em outros softwares
>
> com base nisso, /deep-research /product-management:synthesize-research pesquise como outros produtos utilizam agendas integradas. recomendo olhar clickup e notion. e aumente a lista olhando outros produtos. veja a interface e as funcionalidades.
>
> o prototipo que resultar disso deve ter 2 frentes:
>
> 1. melhoria de interface e usabilidade (ui/ux)
> 2. ganho de novas funcionalidades
>
> antes de prototipar traga a ideia do prototipo aqui no chat pra eu validar.

E, no meio da rodada: "como agente de ux ja pesquisou a agenda, voce pode ver la se tem prints do estado inicial dela, quando nao ha nada configurado, assim te facilita."

- **Tela:** Membro › Agenda (`/workspaces/<workspace>/schedule`), com o painel Configuração aberto pela engrenagem.
- **Sucesso:** quem abre a Agenda vê, sem configurar nada, o que tem para fazer e as reuniões do dia, e age ali mesmo sobre os itens e as tarefas do ENSPACE, o que o Outlook ao lado não faz.

## O que a pesquisa de UX já dizia

Procurei em `enspace-ux-research/temas/agenda/` e no `UX_REPORT.md`.

- **S1-F2 (P2, VISUAL):** a tela inicial dá todo o destaque ao Outlook. O texto de apoio fala só de Outlook e o card dele vem primeiro; o caminho nativo ("Visualização Unificada", "Configurar tarefas/itens") parece secundário. A persona Giovana leu "Conecte seu calendário do Outlook", concluiu "essa agenda não é pra mim" e saiu.
  - Proposta de lá: o texto descreve o que a Agenda é antes de falar de integração; "Configurar tarefas/itens" vira a ação primária e ganha o rótulo "Escolher o que aparece na agenda".
  - Ressalva de lá: não mostrar tudo por padrão; a escolha do que exibir é de quem usa.
- **S3-F2 (P2):** o Calendário do sistema nasce sem dias úteis e pinta o mês inteiro de "Dia Não Útil".
- **S3-F3 (P1):** "Sincronizar Feriados" grava feriados do Brasil e dos EUA misturados, sem escolher país. A Agenda usa esse calendário para pintar os dias.

## O estado inicial (sem nada configurado)

Fonte: o GIF `S1-F2-configurar-tarefas-itens.gif` do `enspace-ux-research`, gravado em 2026-08-18 no workspace de exploração. Não regravei: o workspace já estava configurado.

1. Título "Bem-vindo ao Calendário ENSPACE" com o logo.
2. Texto: "Conecte seu calendário do Outlook com ENSPACE para visualizar seus eventos agendados, criar reuniões e organizar suas tarefas e itens em um só lugar".
3. 2 cards lado a lado:
   - "Sincronize eventos do Outlook", botão "Integrar Agenda Outlook", nota "Redireciona para autenticação";
   - "Visualização Unificada", botão "Configurar tarefas/itens", nota "Escolha o que deseja ver".
4. "Configurar tarefas/itens" abre o painel Configuração com 3 abas (Tarefas, Itens, Integrações), cada uma com um "Ativo" desligado.

## O que o develop faz hoje (configurado)

Visto em 2026-10-28, no workspace de exploração, com o Outlook da conta conectado. URL: `/workspaces/<workspace>/schedule` (sem query string; vista e data não vão para a URL).

### Barra do topo

- "Hoje", setas "Período anterior" e "Período seguinte", rótulo "outubro 2026".
- À direita: "Visualização" (Dia, Semana, Mês), "Data" (seletor de data), as etiquetas "Dia Útil" e "Dia Não Útil" e a engrenagem.
- As etiquetas são texto parado (`span`), sem clique: servem de legenda.
- A engrenagem só responde com hover antes do clique (controle naive-ui).

### Vista Mês (a padrão)

- O fundo da coluna inteira é verde (dia útil) ou vermelho (dia não útil).
- Os dias do mês anterior e do seguinte têm a mesma aparência dos dias do mês.
- Hoje é só um círculo roxo no número do dia.
- Cabem 4 eventos por dia; o resto vira "+ N eventos", e o clique nele troca para a vista Dia e recarrega a grade.
- O evento do Outlook mostra a hora em 12 h ("9:00 AM"); a tarefa mostra em 24 h ("18:04"). A interface está em português.
- Cor por estado: evento do Outlook já passado em amarelo, futuro em azul. A tarefa vem em amarelo por padrão, a mesma cor da reunião passada: não se distingue tarefa de reunião.

### Vistas Semana e Dia

- Grade de 00 h a 23 h, que abre na madrugada (01 h). Para chegar no horário comercial, a pessoa rola.
- Sem faixa de dia inteiro, sem linha da hora atual.
- O fundo verde e vermelho cobre a coluna toda.
- Evento longo fica estreito e quebra o título em várias linhas.

### Abrir um evento do Outlook

Modal "Evento" no meio da tela, que cobre a grade:

- título truncado, com "--" embaixo;
- "Reunião do Microsoft Teams", com "--" embaixo;
- "Participantes": lista de e-mails, sem nome e sem foto.

Faltam a data, a hora, o link para entrar na reunião e qualquer ação. Nada liga a reunião a um item, a um cliente ou a uma tarefa.

### Abrir uma tarefa

Painel lateral à direita, com o título "#273512 - Executar pedido" e 3 abas:

- **Tarefa:** Criado em, Vencimento em, Feito em, Compartilhado com, Responsável (em e-mail). Botão desligado "Você não é o responsável pela tarefa", com a própria pessoa como responsável e a tarefa já concluída. Fica como achado a conferir; não investiguei.
- **Item:** Referência (o código longo), Criado em, Categoria, Formulário (vazio) e o botão "Acessar Item".
- **Histórico.**

O painel é o melhor pedaço da tela: a tarefa abre sem sair da Agenda.

### Criar

- Só pelo botão flutuante "+" ("Criar Evento"), no canto inferior direito. O BENI fica por cima dele: o clique abre o chat do BENI. Só com o BENI fechado e um clique pelo DOM o modal abriu.
- Clique ou clique duplo num horário vazio da grade não faz nada.
- Modal "Criar Evento":
  - Integração (obrigatório): a conta do Outlook;
  - Título (obrigatório) e Descrição (texto rico);
  - Data de Início: vem preenchida com o agora, com segundos ("16:56:16"), mesmo com a grade em outro dia;
  - Data de Término (obrigatório);
  - Criar Reunião: abre "Participantes Obrigatórios" e "Participantes Opcionais", por e-mail digitado e Enter.
- O "+" só cria evento no Outlook. Não cria tarefa nem item, e o evento não se liga a nada do ENSPACE.

### Mover

Nenhum elemento é arrastável. Para mudar a data de uma tarefa ou de uma reunião, a pessoa sai da Agenda.

### Filtrar

Não há filtro na tela: nem por pessoa, nem por categoria, nem por fonte. Ligar ou desligar uma fonte é no painel Configuração, e o Salvar recarrega tudo.

### Painel Configuração (engrenagem)

4 abas: Tarefas, Tarefas Rápidas, Itens, Integrações. As 3 primeiras têm um "Ativo".

- **Tarefas e Tarefas Rápidas:**
  - "Configuração": Data (1 campo: Criado em, Data Limite, Concluído em ou um campo do item) e Conteúdo (1 campo como rótulo: ID, Status, Status da Tarefa, Status de SLA, Responsáveis, Tipo, Referência do Item...);
  - "Configuração de Cor": "Tarefa Em Andamento" e "Tarefa Completa", cada uma com Cor Primária e Cor da Borda em código hexadecimal.
- **Itens:**
  - lista "Tipos" com "Adicionar", que abre o modal "Tipo ID: - -";
  - o modal pede Tipo e cores; Data e Conteúdo só aparecem depois do Tipo;
  - 1 data só: não há início e fim, nem duração;
  - categoria sem campo de data só oferece "Criado em" e "Editar em" (o rótulo deveria ser "Editado em");
  - o tipo salvo aparece como "Tipo ID: 1314 - created_at - display": o nome técnico, não o da categoria.
- **Integrações:**
  - Outlook, com "Estados dos Eventos": "Evento Completo" e "Evento Futuro", cada um com Cor Primária e Cor da Borda;
  - "Calendários Compartilhados", com "Adicionar".
- **Salvar:** toast "Configuração salva". A grade volta para Mês e fica em branco por cerca de 5 s, sem indicador de carregamento.

### O que já existe e funciona

- 3 fontes do ENSPACE (Tarefas, Tarefas Rápidas, Itens de qualquer categoria) e o Outlook na mesma grade.
- Cor por estado em cada fonte.
- Calendários compartilhados do Outlook.
- Painel lateral da tarefa com a aba do item e o "Acessar Item".
- Dia útil e não útil vindos do Calendário do sistema.
- Criar evento e reunião do Teams no Outlook sem sair do ENSPACE.

### Onde trava, em resumo

| # | Onde | O que acontece |
|---|---|---|
| T1 | Primeiro acesso | A tela fala de Outlook; o que o ENSPACE já tem fica escondido atrás de "Configurar tarefas/itens" (S1-F2) |
| T2 | Grade | Verde e vermelho em tela cheia; tarefa e reunião na mesma cor; hora em 12 h e 24 h misturadas; dia fora do mês igual ao do mês |
| T3 | Semana e Dia | Abre na madrugada, sem faixa de dia inteiro e sem linha da hora atual |
| T4 | Evento do Outlook | Modal que cobre a grade, sem data, hora, link nem ação; participante só por e-mail |
| T5 | Criar | Só o "+", coberto pelo BENI; só cria evento do Outlook; o horário vazio não responde |
| T6 | Mover | Nada se arrasta |
| T7 | Filtrar | Nenhum filtro; liga e desliga fonte só no painel, com recarga |
| T8 | Configuração | Hexadecimal, nomes técnicos ("Tipo ID: 1314 - created_at - display"), 1 data por fonte, rótulo "Editar em" |
| T9 | Integração | A reunião não se liga a item, cliente ou processo; o item não mostra a agenda dele; não há lista do que falta agendar |

## Preparo e limites desta rodada

- **Mudei a configuração do workspace de exploração pela tela:** liguei Tarefas, Tarefas Rápidas e Itens (categoria "Orcamento teste valor virtual", data Criado em, conteúdo Display). Ficou ligado.
- **Prints:** a grade e os modais mostram reuniões reais da conta do Outlook conectada (nomes de cliente) e e-mails de pessoas. O repositório é público, então nenhum desses prints entra em `evidencias/`. Na rodada do protótipo, refaço as capturas do develop com o Outlook fora da tela ou com recorte só do painel Configuração.
- **Não vi:** a tela sem o Outlook conectado (a conta já estava ligada) e quem enxerga a configuração (se ela vale para o workspace ou para a pessoa).

## A casca da tela, item por item

Copiada do develop (`/workspaces/<workspace>/schedule`) em 28/10/2026 e montada no `EnLayout` do SDK, em
`_CascaDaAgenda.vue`. A base é a casca de `comunicacao-no-workspace` (05/10/2026), com a ordem de Membro conferida de
novo.

**Menu lateral (cerca de 200 px):**

- Topo: o workspace (ícone redondo, nome, slug, seta) e "Buscar..." com `CTRL` `K`.
- Membro: Início · Spaceflows · Categorias (abre as categorias) · Tarefas (abre Agendadas e Rápidas) · Agenda ·
  Knowledge.
- Configurações: Visão Geral · Sistema · Estrutura · Gestão de Membros · Interface · E-mails · Integrações · Agentes
  de IA · Logs · Credenciais.
- Ajuda: Releases · Documentação (com seta de link externo).
- Agenda é o item ativo.

**Barra do topo:** voltar, avançar, recarregar, início, a trilha numa faixa arredondada (workspace › Agenda) com
`CTRL` `B` e a estrela; à direita a bandeira do idioma, o tema, Suporte, o sino com "99+" e o avatar.

**O que fica de fora:**

- o BENI flutuante, como nas outras cascas deste repositório;
- o botão flutuante "+" ("Criar Evento"): é proposta, não casca. A criação passa para o "Novo" da barra da Agenda e
  para o clique no horário (T5).

## Rodada 2: o item e a tarefa no develop (29/10/2026)

Observado pela tela, no workspace de exploração, no Chrome da redatora. Os prints mostram dado de cliente e e-mail de
gente e ficam fora de `evidencias/`.

### Tela do item

Endereço `/types/<categoria>/<referência>?folder=<pasta>`: a pasta aberta vai para a URL.

- **Painel da esquerda:** ícone de arquivo num círculo, a referência (quebra em linhas quando é longa), a categoria em
  fonte mono, o selo da categoria e 3 grupos com rótulo em caixa alta (Identificação, Origem, Histórico). Cada grupo é
  uma caixa com borda; cada linha tem ícone, rótulo pequeno em caixa alta e o valor em negrito (ID, Status, E-mail
  solicitante, Criado em, Atualizado em). Botão « para recolher.
- **Pastas:** abas sublinhadas com ícone: Visão Geral, Comentários, Logs de Auditoria, Tarefas, Anexos, Emails
  Automáticos, Mail Box, Notas, Campos; ícone de nova pasta na ponta. A ativa fica no primário, com sublinhado e seta.
- **Visão Geral:** o formulário do item, editável; Salvar no canto de baixo.
- **Tarefas:** sub-aba "Tarefas Rápidas", "+ Visualizar", um quadro (Pendente, Em andamento, Bloqueada, Concluída) e
  "+ Nova tarefa".
- **Mail Box:** o endereço próprio do item (`<referência>.<workspace>@develop.box.enspace.io`) com botão de copiar, e
  Recebidos e Enviados.
- **Nada sobre agenda:** o item não mostra reunião, prazo de tarefa nem as datas dele num calendário.

### Painel da tarefa em Tarefas › Agendadas

- **Trilho de ícones à esquerda**, cada um com dica: painel, ID (#273511), Tarefa, Referência do item, Nome do Fluxo,
  Etapa do Fluxo, Status.
- **Abas:** Tarefa, Item, Histórico, Comentários.
- **Tarefa:** "Detalhes da Tarefa" com ícone de atualizar; Criado em, Vencimento em ("02/10/2026, 18:02:48 BRT") e
  Compartilhado com; divisória; "Concluir Etapa" no primário, na largura toda.
- **Item:** "Detalhes do Item", "Acessar Item" no primário e o ícone de ocultar; Referência, "Criado em: 30/09/2026
  por <pessoa>" em mono, Categoria e Formulário.

### Onde trava, na volta

| # | Onde | O que acontece |
|---|---|---|
| T10 | Item | Não há como ver nem marcar nada na agenda a partir do item |
| T11 | Tarefa | O painel não leva à Agenda e não reserva tempo; o prazo só muda fora dele |
| T12 | Painel da tarefa | São 2 painéis diferentes: o da Agenda (abas Tarefa, Item, Histórico) e o de Tarefas (trilho de ícones e Comentários) |
| T13 | Outlook | O Mail Box do item já tem endereço próprio, mas nada liga um convite do Outlook ao item |

### A casca, item por item (rodada 2)

- `_TelaDoItem.vue`: painel da esquerda e barra de pastas como acima; a pasta Agenda entra depois de Tarefas. As
  outras pastas, menos a Visão Geral, mostram só "não muda".
- `_PainelDaTarefa.vue`: trilho de ícones, abas, "Detalhes da Tarefa", "Concluir Etapa" e "Detalhes do Item" como
  acima; a aba Agenda entra depois de Comentários, que mostra só "não muda".
- O menu lateral continua o da rodada 1, com Credenciais. Em 29/10 o develop não mostrou Credenciais para esta conta e
  mostrou seta em Integrações; a casca não mudou nesta rodada.

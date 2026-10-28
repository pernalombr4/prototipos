# Agenda · Síntese da pesquisa

Feita com a skill `product-management:synthesize-research` em 2026-10-28.

## Visão geral

- **Pergunta:** por que a Agenda do ENSPACE parece feia, confusa e pouco integrada, e o que outros produtos fazem para a agenda valer mais que o Outlook aberto ao lado?
- **Fontes, em 3 métodos:**
  - **Voz do cliente:** o retorno de usuários trazido pela redatora (2 queixas, sem número de pessoas);
  - **Pesquisa de UX:** a fricção S1-F2 do `enspace-ux-research` (persona BR-GEN-LEIGA, 2026-08-18) e as S3-F2 e S3-F3 do Calendário do sistema;
  - **Observação da tela:** o develop em 2026-10-28, no workspace de exploração ([BRIEFING.md](../BRIEFING.md), travas T1 a T9);
  - **Mercado:** 5 notas de pesquisa com 25 produtos, em `research_notes/`, e o relatório em `reports/`;
  - **Mercado em tela:** ClickUp e Notion nas contas da redatora, Odoo pelo demo público, em 2026-10-28 (seção "O que a tela dos outros mostrou").
- **Limite:** não há chamado, entrevista nem dado de uso da Agenda nesta rodada. A frequência abaixo conta fontes, não pessoas.

## O que a tela dos outros mostrou

Visto em 2026-10-28, sem criar nem salvar nada: os fluxos de criação foram abertos e descartados. Os prints mostram agendas pessoais da redatora e ficam fora do repositório.

| Produto | Onde | O que se vê |
|---|---|---|
| ClickUp | Planejador (`/calendar`) | Grade semanal que abre no horário de agora, não à meia-noite; faixa "O dia todo"; fora do horário de trabalho e fim de semana hachurados; linha vermelha da hora atual com o rótulo "5:04"; hoje num selo vermelho |
| ClickUp | Planejador, topo | "Semana" como seletor; um botão abre a lista de calendários por conta, com caixa de seleção colorida e "mais 15", e os do workspace ("Minhas folgas", "Feriados") |
| ClickUp | Evento do Google | Popover junto do evento, não modal: data, duração ("1h"), recorrência, fuso, botão "Entrar no Google Meet", participantes em avatar com "2 Sim", "Presença confirmada?" |
| ClickUp | Configurações › Bloqueio de tempo | "Mostrar tarefas atribuídas a mim com data final"; lista padrão das tarefas criadas no planejador; prefixo do bloco ("Work on"); horário de trabalho do workspace ou próprio |
| ClickUp | Visualização Calendário da lista | A tarefa abre o modal completo (campos e atividade) por cima do calendário |
| Notion | Barra lateral, aba Meetings | "Upcoming events" lista os próximos eventos com hora e "Join"; o menu do evento tem "Open in calendar" |
| Notion | Notion Calendar | Pede login próprio, separado do Notion web: não vi a grade |
| Odoo | Calendar (demo) | "My Activities" é uma camada com caixa de seleção, ao lado dos calendários da pessoa; as atividades de registros ficam na faixa de dia inteiro, com ícone de relógio; "Meet with" sobrepõe a agenda de outra pessoa; mini calendário na lateral |
| Odoo | Popover da atividade | Título, link para o registro de origem (o projeto) e 3 ações ali mesmo: reagendar, concluir, editar |
| Odoo | Clique num horário vazio | "New Event" já com o horário clicado (10:00 a 11:00), participante, videoconferência; "Save", "More Options", "Discard" |
| Odoo | Oportunidade do CRM | Botão "No Meeting" no topo do registro; "Planned Activities" com "13 days overdue" em vermelho, "Done" e "Edit" |
| Odoo | Reuniões da oportunidade | A mesma agenda, filtrada pela oportunidade (chip "Opportunity: Modern Open Space"), com trilha de volta; o evento novo nasce com o nome da oportunidade e ligado a ela |

Twenty (demo público) não carregou: a página ficou em branco.

## Achados

### A1. A Agenda mostra o ENSPACE, mas não deixa agir sobre ele

- **Evidência:**
  - cliente: "é praticamente a mesma coisa que abrir a agenda da microsoft do lado de fora do sistema e ficar olhando";
  - develop: nada se arrasta (T6); o horário vazio não responde e o "+" só cria evento do Outlook (T5); a reunião não se liga a item (T9);
  - mercado: ClickUp, Notion, Airtable, Twenty e monday gravam a data no registro quando a pessoa arrasta; ClickUp e Airtable criam o registro pelo clique no horário.
- **Frequência:** 3 de 3 métodos.
- **Impacto:** alto. É a razão de a pessoa preferir o Outlook.
- **Confiança:** alta.

### A2. A reunião vive solta, sem o cliente, o processo ou o item

- **Evidência:**
  - cliente: "nao fica integrada com as entidades do sistema realmente, como em outros softwares";
  - develop: o modal "Evento" mostra só e-mails e "--" (T4);
  - mercado: Attio, Twenty e HubSpot ligam a reunião à pessoa pelo e-mail do participante e à empresa pelo domínio; a reunião aparece na atividade do registro. Notion Calendar liga o evento a uma página ("Docs and links"). Clio e MyCase abrem a agenda dentro do caso. Em tela, o Odoo abre a agenda filtrada pelo registro e cria a reunião já ligada a ele.
- **Frequência:** 3 de 3 métodos.
- **Impacto:** alto. É o que nenhum calendário externo faz.
- **Confiança:** alta.

### A3. A grade foge das convenções que a pessoa já conhece

- **Evidência:**
  - cliente: "feia e confusa de usar";
  - develop: fundo verde e vermelho em tela cheia, tarefa e reunião na mesma cor, 12 h e 24 h misturadas, semana que abre na madrugada, sem faixa de dia inteiro e sem linha da hora atual (T2, T3);
  - mercado: Google, Outlook, Apple, Fantastical e Notion Calendar seguem o mesmo esqueleto (Hoje, setas, período, seletor de vista no topo; mini calendário e lista de calendários com cor na lateral; faixa de dia inteiro; prazo de tarefa diferente de reunião).
- **Frequência:** 3 de 3 métodos.
- **Impacto:** alto na primeira impressão; médio no uso diário.
- **Confiança:** alta.

### A4. O primeiro acesso vende o Outlook, não o ENSPACE

- **Evidência:**
  - UX: S1-F2, a persona leu "Conecte seu calendário do Outlook" e saiu;
  - develop: estado inicial com 2 cards e o caminho nativo atrás de "Configurar tarefas/itens" (T1);
  - mercado: nenhuma fonte documenta estado vazio de agenda; o padrão dos CRMs e do Google é a agenda já mostrar o que é da pessoa.
- **Frequência:** 2 de 3 métodos.
- **Impacto:** alto para quem chega; nulo para quem já configurou.
- **Confiança:** média.

### A5. Configurar a Agenda exige saber o modelo de dados

- **Evidência:**
  - develop: cor em hexadecimal, "Tipo ID: 1314 - created_at - display", 1 data por fonte, "Editar em", Salvar que recarrega a grade em branco (T8); fonte só liga e desliga no painel (T7);
  - mercado: Notion ("Show calendar by"), ClickUp ("Customize") e Airtable deixam escolher campo de início e de fim, regra de cor e camadas que ligam com 1 clique.
- **Frequência:** 2 de 3 métodos.
- **Impacto:** médio. Quem configura é o admin, mas quem usa não consegue ajustar a própria vista.
- **Confiança:** alta.

### A6. Falta o lugar do que ainda não tem hora

- **Evidência:**
  - develop: a tarefa sem data e a atrasada não aparecem; não há lista ao lado da grade (T9);
  - mercado: ClickUp ("Unscheduled and overdue tasks"), Jira ("Unscheduled work"), Airtable ("Records without dates"), Akiflow, Sunsama e o console do Salesforce Field Service têm a lista lateral para arrastar para a grade.
- **Frequência:** 2 de 3 métodos.
- **Impacto:** médio a alto para quem tem fila de tarefas com SLA.
- **Confiança:** média.

### A7. Prazo não é reunião: o SLA precisa de um desenho próprio

- **Evidência:**
  - develop: a tarefa aparece como um evento a mais, com a hora do vencimento;
  - mercado: Asana e Jira mostram o prazo como marcador no dia; Sunsama, Akiflow, Motion e ClickUp criam uma sessão de trabalho ligada à tarefa sem mexer no prazo; ADVBOX separa prazo interno e prazo fatal; o protótipo `modulo-juridico` já leva prazo interno, fatal e audiência à Agenda.
- **Frequência:** 2 de 3 métodos.
- **Impacto:** alto no jurídico e em fluxo com SLA.
- **Confiança:** média.

## Segmentos

| Segmento | O que precisa da Agenda |
|---|---|
| Quem executa tarefas de fluxo | Ver o que vence, o que está em risco de SLA, e reservar tempo para fazer |
| Quem atende cliente ou processo (jurídico, consultoria) | Reunião e audiência ligadas ao item, com o contexto a 1 clique |
| Quem coordena equipe | Ver a agenda e a carga de cada pessoa, redistribuir |
| Quem configura o workspace | Escolher o que aparece sem saber nome técnico de campo |

Sem dado para dimensionar cada segmento nesta rodada.

## Matriz de prioridade

| | Impacto alto | Impacto médio |
|---|---|---|
| **Frequente** | A1 agir na agenda · A2 reunião ligada ao item · A3 convenções da grade | A5 configuração |
| **Menos frequente** | A4 primeiro acesso · A7 prazo e SLA | A6 lista do que falta agendar |

## Oportunidades

1. **Agenda como lugar de ação:** criar, mover e concluir sem sair dela (A1).
2. **Reunião com contexto:** ligar evento do Outlook a item, sozinho pelo e-mail ou à mão, e mostrar a agenda dentro do item (A2).
3. **Grade convencional e calma:** o esqueleto que a pessoa já conhece do Outlook, no tema do ENSPACE (A3).
4. **Valor no primeiro minuto:** mostrar as tarefas da pessoa antes de pedir Outlook (A4).
5. **Camadas em vez de configuração:** ligar e desligar fonte na lateral, escolher cor numa paleta (A5).
6. **Fila do que falta agendar e prazo como marcador:** separar "quando vence" de "quando vou fazer" (A6, A7).

## Perguntas em aberto

- Quantas pessoas usam a Agenda hoje, e com quais fontes ligadas?
- A configuração vale para o workspace inteiro ou para cada pessoa?
- O Outlook é a única integração, ou o Google entra no roteiro?
- Ligar reunião a item pelo e-mail pede saber qual campo de e-mail cada categoria tem: há um campo padrão de contato?
- Próximo passo sugerido: ler os chamados de Agenda no workspace de produtos (fora do alcance desta sessão) e testar o protótipo com 3 a 5 pessoas de clientes que já usam a Agenda.

# Agenda · Pesquisa

As 5 referências obrigatórias e mais 4 escolhidas pela natureza do problema:

- **Odoo:** o único ERP com demo aberto, onde a agenda junta reunião e atividade de registro;
- **Airtable:** a agenda de base de dados mais completa (várias datas, lista do que não tem data);
- **Attio:** o vínculo automático da reunião ao registro pelo e-mail;
- **Sunsama:** o bloco de trabalho separado do prazo.

Consulta em 2026-10-28. ClickUp e Notion foram vistos em tela, nas contas da redatora; Odoo, pelo demo público; os
outros, pela documentação oficial. Nada foi criado nem salvo nas contas: os fluxos de criação foram abertos e
descartados. A coleta completa, com a fonte de cada frase, está em [`pesquisa/`](pesquisa/): 5 notas, o relatório e
a [`SINTESE.md`](pesquisa/SINTESE.md) com os achados A1 a A7.

**Sobre os prints:** ClickUp e Notion mostram a agenda pessoal da redatora (reuniões, nomes, e-mails), e este
repositório é público, então ficam sem print. Twenty, monday, Pipefy, Airtable, Attio e Sunsama foram lidos pela
documentação: o demo do Twenty ficou em branco e os outros pedem conta. Cada entrada diz o motivo.

---

## 1. ClickUp

**Passos.** Menu lateral › Planejador (`/calendar`) › semana › clicar num evento do Google › Configurações ›
Bloqueio de tempo. Depois, uma lista › visualização Calendário › clicar numa tarefa.

**URL.** `app.clickup.com/<ws>/calendar` · [What is the Planner](https://help.clickup.com/hc/en-us/articles/29051586233879-What-is-the-Planner) ·
[Schedule tasks from your Planner](https://help.clickup.com/hc/en-us/articles/35975611704087-Schedule-tasks-from-your-Planner)

**Print.** Sem print: a grade mostra a agenda pessoal da redatora.

**O que se viu.**

- A semana abre no horário de agora, não à meia-noite.
- Faixa "O dia todo" no alto; fora do horário de trabalho e fim de semana hachurados.
- Linha vermelha da hora atual, com o rótulo da hora.
- O evento abre num popover junto dele: data, duração, "Entrar no Google Meet", participantes com resposta.
- Lista lateral "Unscheduled and overdue tasks": arrastar para a grade cria um bloco de trabalho, e o prazo fica.
- A lista de calendários abre por um botão, com caixa colorida por conta.

**O que serve.**

- O popover no lugar do modal.
- A semana que abre no horário útil.
- A separação entre "agendar o trabalho" e "mudar o prazo".
- A lista do que falta agendar ao lado da grade.

**O que não serve.**

- A lista de calendários escondida atrás de um botão: no ENSPACE as camadas ficam à vista, na lateral.
- O evento não muda a tarefa: ligar é só um link. O ENSPACE pode ir além, porque o item é a entidade.

## 2. Notion

**Passos.** Barra lateral › aba Meetings › "Upcoming events" › menu do evento › "Open in calendar". Database ›
"+ Add view" › Calendar › "Show calendar by".

**URL.** `notion.so` · [Use Notion Calendar with Notion](https://www.notion.com/help/use-notion-calendar-with-notion) ·
[Calendars](https://www.notion.com/help/calendars)

**Print.** Sem print: a barra lateral mostra as reuniões da redatora. O Notion Calendar pede login próprio, separado
do Notion web: a grade não foi vista em tela.

**O que se viu e o que a doc diz.**

- "Upcoming events" na barra lateral: os próximos eventos com hora e "Join".
- Qualquer database com data vira camada do Notion Calendar, com olho ao lado para ligar e desligar.
- O evento se liga a uma página ("Docs and links").
- "Show calendar by" escolhe o campo de data da vista.

**O que serve.**

- A database como camada que se liga e desliga com 1 clique.
- O evento ligado a um registro.
- Escolher o campo de data pelo nome.

**O que não serve.**

- A agenda num app à parte, com login próprio: é o "abrir o Outlook do lado" que a demanda quer evitar.
- O limite de 20 databases e o evento que nunca vira página.

## 3. Twenty CRM

**Passos (doc).** Objeto › "Options" › "Calendar" › campo de data › "Update view". Pessoa, empresa ou oportunidade ›
aba "Calendar".

**URL.** [Calendar View](https://docs.twenty.com/user-guide/views-pipelines/capabilities/calendar-view) ·
[Calendar](https://docs.twenty.com/user-guide/calendar-emails/capabilities/calendar) · [Releases](https://twenty.com/releases)

**Print.** Sem print: o demo público ficou em branco em 2026-10-28.

**O que a doc diz.**

- A reunião sincronizada se liga à pessoa pelo e-mail do participante e à empresa pelo domínio.
- Aba "Calendar" ao lado de "Emails" no registro; a oportunidade mostra as reuniões da empresa ligada.
- Desde a 2.26.0 (2026-07-31), a agenda dos registros relacionados aparece dentro da página do registro.
- Só sincroniza reunião externa; reunião só entre colegas fica privada.

**O que serve.**

- O vínculo pelo e-mail e pelo domínio, sem trabalho manual.
- A agenda dentro do registro.
- A regra de privacidade para reunião interna.

**O que não serve.** A vista de calendário lê 1 objeto e 1 campo: não mistura fontes.

## 4. monday.com

**Passos (doc).** Board › "+" › Calendar View › escolher a coluna Date ou Timeline. Dashboard › Calendar widget.

**URL.** [monday Calendar](https://monday.com/blog/project-management/monday-calendar/) ·
[The Calendar Widget](https://support.monday.com/hc/en-us/articles/360001262965-The-Calendar-Widget)

**Print.** Sem print: pede conta, e o suporte devolveu 403 à leitura automática.

**O que a doc diz.**

- A coluna Timeline guarda início e fim.
- Cor por grupo, por status ou por pessoa.
- Arrastar muda as datas, e os fluxos ligados acompanham.
- Para juntar boards, só o widget de painel.
- Relato no fórum: o item criado pela agenda some quando a data não cai na coluna que a vista lê.

**O que serve.**

- Início e fim no mesmo campo.
- O aviso do fórum: o que nasce pela agenda grava a data no campo que a agenda lê.

**O que não serve.** A agenda presa a 1 board, e a mistura só em painel de relatório.

## 5. Pipefy

**Passos (doc).** Pipe › "Tools" › "Apps" › "Calendar" › "Enable". Depois "Pipe views" › "Calendar".

**URL.** [How to enable the Calendar App](https://help.pipefy.com/en/articles/724040-how-to-enable-the-calendar-app) ·
[Choosing pipe views](https://help.pipefy.com/en/articles/3143190-choosing-pipe-views)

**Print.** Sem print: pede conta.

**O que a doc diz.**

- Só aparece card com "Due date".
- Mês, semana, dia e "Agenda" (os próximos 30 dias em lista).
- Prazo amarelo quando se aproxima e vermelho quando passou.
- Card com 2 datas aparece 1 vez, pela última preenchida; filtro só por tempo.

**O que serve.**

- A vista "Agenda" em lista.
- A cor do prazo pelo risco.

**O que não serve.** 1 data por card e nenhum filtro: é o ponto em que o Pipefy está igual ao ENSPACE de hoje.

## 6. Odoo (extra: ERP com demo aberto)

**Passos.** `demo.odoo.com` › Calendar › clicar numa atividade › clicar num horário vazio. CRM › oportunidade ›
"No Meeting" › "Planned Activities".

**URL.** `demo.odoo.com/odoo/calendar`

**Print.** Sem print: o demo abre uma base nova a cada acesso, e os prints da exploração não foram guardados.

**O que se viu.**

- "My Activities" é uma camada com caixa de seleção, ao lado dos calendários da pessoa.
- A atividade do registro fica na faixa de dia inteiro, com ícone de relógio.
- O popover da atividade tem o link para o registro de origem e 3 ações: reagendar, concluir, editar.
- Clique num horário vazio abre "New Event" com o horário já preenchido.
- O botão de reuniões da oportunidade abre a mesma agenda filtrada por ela, e o evento novo nasce ligado.

**O que serve.**

- A tarefa como marcador de dia inteiro, separada da reunião.
- Concluir no popover.
- A agenda filtrada pelo registro, com o vínculo já feito.

**O que não serve.** A atividade não tem duração nem bloco de trabalho: o tempo para fazer fica de fora.

## 7. Airtable (extra: agenda de base de dados)

**URL.** [Getting started with calendar views](https://support.airtable.com/articles/1834189958-getting-started-with-airtable-calendar-views)

**Print.** Sem print: pede conta.

**O que a doc diz.**

- Data de início, data de fim opcional e até 20 campos de data na mesma vista, com cor por campo.
- Lista lateral com "Records without dates": arrastar para um dia agenda, arrastar de volta limpa a data.
- Clique duplo no horário cria o registro; com vários campos de data, um menu pergunta qual recebe a data.

**O que serve.**

- Início e fim por fonte.
- A lista do que não tem data.
- Criar pelo horário perguntando o tipo.

**O que não serve.** 1 tabela por vista: juntar tabelas pede extensão paga.

## 8. Attio (extra: vínculo da reunião)

**URL.** [View emails and meetings](https://attio.com/help/reference/email-calendar/view-emails-and-meetings)

**Print.** Sem print: pede conta.

**O que a doc diz.**

- Todo evento não privado do Google ou do Outlook vira reunião.
- A reunião se liga à pessoa pelo e-mail e à empresa pelo domínio.
- "+" ao lado de "Linked records" liga a mais um registro de qualquer objeto, e o x desliga.
- A reunião aparece na aba de atividade do registro.

**O que serve.** O vínculo automático com saída manual ao lado: a sugestão e o "Ligar a" do protótipo.

**O que não serve.** Não há grade de agenda: a reunião só aparece em lista.

## 9. Sunsama (extra: bloco de trabalho)

**URL.** [Timeboxing: the basics](https://help.sunsama.com/docs/getting-started/basics/timeboxing-the-basics)

**Print.** Sem print: pede conta.

**O que a doc diz.**

- Arrastar a tarefa da lista para a grade cria um timebox; a tarefa continua na lista do dia.
- O prazo da tarefa não muda.
- O tempo planejado se soma contra um limite diário.

**O que serve.** O bloco separado do prazo: é a decisão 1 desta rodada (tarefa com SLA ganha bloco, o prazo fica).

**O que não serve.** O ritual guiado de planejamento diário: pesado para quem só quer ver o dia.

---

## O padrão que todos seguem

- **Topo:** Hoje, setas, o período por extenso, o seletor de vista (Google, Outlook, ClickUp, Notion, Pipefy).
- **Lateral:** mini calendário e camadas com caixa colorida que ligam e desligam sem recarregar.
- **Faixa de dia inteiro** separada da grade horária; o prazo de tarefa mora nela.
- **Semana que abre no horário útil** e linha da hora atual.
- **Detalhe em popover** junto do evento; o registro completo abre num painel, sem tirar a grade da tela.
- **Clique no horário vazio cria**, com a hora já preenchida.
- **Arrastar grava** no campo de data de origem.

## O que nenhum deles faz

- **Ligar a reunião do Outlook a um registro de qualquer categoria.** Os CRMs ligam a pessoa e a empresa; o
  ENSPACE pode ligar ao processo, ao contrato ou ao cliente pelo domínio do participante.
- **Tratar o prazo de SLA como trava.** Nenhuma agenda documenta o prazo que não se move por arrasto, com o bloco de
  trabalho no lugar.
- **Escolher o tipo ao criar numa agenda mista.** Só o Airtable pergunta o campo; ninguém pergunta reunião, tarefa
  ou item da categoria.
- **Mostrar na lista do que falta agendar a tarefa que vence na semana sem tempo reservado.** As listas guardam o que
  não tem data, não o que tem data e não tem tempo.

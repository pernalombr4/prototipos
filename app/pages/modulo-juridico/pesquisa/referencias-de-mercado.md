# Referências de mercado para o módulo jurídico do ENSPACE

Pesquisa documental, só leitura na web. Acesso a todas as fontes em 2026-10-26.

## Resumo

- As 5 plataformas genéricas (Notion, Twenty, ClickUp, monday.com, Pipefy) entregam jurídico como estrutura: template de quadro, campos, status e lembrete. Nenhuma conta prazo processual por regra de tribunal nem captura publicação.
- A única exceção encontrada é um agente de IA de terceiro no Notion que diz calcular prazos para trás a partir de 1 data. A página não diz qual regra, qual tribunal nem quais feriados ele usa.
- Os produtos jurídicos (Legal One, Clio, LawToolBox, CompuLaw/Milana, Projuris) têm 2 núcleos de código: a captura de publicação que vira prazo e o motor de regra que gera a cadeia de prazos a partir de um gatilho e recalcula quando o gatilho muda.
- Provisão por data-base é núcleo no produto brasileiro (Projuris corrige a provisão mês a mês e guarda o histórico da mudança de prognóstico). Nos ELMs americanos pesquisados, a documentação pública só trata de accrual de honorários, não de reserva ASC 450.
- Barreira de sigilo, no Clio, é uma permissão do caso (todos ou lista de usuários e grupos), não um módulo à parte.
- A hipótese de trabalho se confirma para prazo, captura e provisão. Ela pede 2 ajustes: a barreira de sigilo é recurso de permissão da plataforma; e pagamentos jurídicos têm uma parte de comportamento (accrual por período com trava) se o ENSPACE quiser servir ao financeiro.

## Índice

1. [Método e limites](#método-e-limites)
2. [Plataformas genéricas](#plataformas-genéricas)
   - [Notion](#notion) · [Twenty](#twenty) · [ClickUp](#clickup) · [monday.com](#mondaycom) · [Pipefy](#pipefy)
3. [Produtos jurídicos](#produtos-jurídicos)
   - [Legal One](#thomson-reuters-legal-one-brasil) · [Clio](#clio-eua) · [LawToolBox](#lawtoolbox-eua) · [CompuLaw e Milana](#compulaw-e-milana-aderant-eua) · [ELM corporativo](#elm-corporativo-legal-tracker-passport-brightflag-teamconnect) · [Bônus: Projuris, ADVBOX](#bônus-projuris-e-advbox-brasil)
4. [O padrão que todos seguem](#o-padrão-que-todos-seguem)
5. [O que nenhum deles faz](#o-que-nenhum-deles-faz)
6. [Tabela final: área jurídica × template × motor](#tabela-final-área-jurídica--template--motor)
7. [Fontes](#fontes)

## Método e limites

- 41 consultas entre buscas e leituras de página.
- Fontes bloqueadas ou fora do ar:
  - `help.clio.com/hc/en-us/articles/9289840995867` (Court Rules) devolveu 403. O conteúdo veio do resumo da busca e de um artigo do Lawyerist.
  - `notion.com/templates/category/legal` devolveu 404. Os templates do Notion vieram da busca (Gumroad e afins).
- Quase toda fonte de produto jurídico é material do próprio fornecedor. O relatório descreve o que o fornecedor afirma; nada foi testado.
- "Não documentado" neste relatório quer dizer: a fonte pública lida não fala do assunto. Não quer dizer que o produto não faz.

## Plataformas genéricas

### Notion

**Como entrega jurídico:** template de terceiro, vendido fora do Notion, e 1 agente de IA de terceiro.

Passos do template (ex.: "Legal Case Management", "Law Firm OS", "Lawyer Case Manager"):
1. A pessoa compra o template no Gumroad (de US$ 0 a US$ 249).
2. Duplica no workspace dela.
3. Recebe bancos de dados ligados: clientes, casos, contatos, tarefas, horas faturáveis, documentos.
4. Prazos são datas digitadas à mão, com visão de calendário.

Passos do agente "Court Deadline Calculator" (custom agent template, autor Raghav R Handa, ligado ao LexOS):
1. A pessoa informa 1 data-âncora (audiência, protocolo, julgamento).
2. O agente calcula para trás a cadeia de prazos e cria 1 tarefa por prazo dentro do caso.
3. As tarefas aparecem no painel e na revisão semanal.

**Comportamento jurídico real:** nenhum no produto. O agente é de terceiro e a página não diz qual conjunto de regras, qual jurisdição, se conta dias úteis ou corridos nem quais feriados usa.

**Serve ao ENSPACE:**
- A forma de entrega "1 data gera a cadeia de tarefas no caso" é a experiência que o motor de prazos precisa ter.
- Mostra o risco que o ENSPACE evita com motor próprio: cálculo sem fonte da regra nem memória.

**Não serve:**
- Template sem lógica e vendido por terceiro. Nada ali é módulo.
- Cálculo por IA sem regra declarada não passa em auditoria de prazo.

### Twenty

**Como entrega jurídico:** nada pronto. Nenhum app jurídico apareceu no marketplace nem no GitHub.

O conceito de "app" é a referência que importa. Passos, pela documentação:
1. O dev cria um pacote TypeScript com o `twenty-sdk` (`create-twenty-app`).
2. No pacote, declara entidades: objetos e campos (tratados como os nativos), funções de lógica (rodam em rota HTTP, agenda cron ou evento do banco, em processo Node isolado), componentes de tela em React (painel lateral, widget, menu de comando), skills e agentes de IA, visões e itens de menu.
3. O SDK acha as declarações no build; não há arquivo de registro.
4. O dev publica: `twenty app publish --private` para o próprio servidor, ou `twenty app publish` para o npm e o marketplace.
5. A lógica só enxerga o que o papel (role) do app permite.

A documentação lida não diz como o app se instala por workspace, como se atualiza nem se o usuário pode editar o objeto que o app criou.

**Serve ao ENSPACE:**
- O app do Twenty junta, num pacote só e versionado, o que o ENSPACE separa em 2: estrutura (caso de uso) e comportamento (módulo).
- Sugere a forma de entrega: ligar o módulo jurídico instala junto o caso de uso de contencioso, e a estrutura continua editável pelo cliente.

**Não serve:**
- O app pede programador. O cliente do ENSPACE é o jurídico sem dev.
- Não há conteúdo jurídico para copiar.

### ClickUp

**Como entrega jurídico:** templates oficiais na galeria do ClickUp.

Passos do "Legal Client Management" (pasta):
1. A pessoa adiciona o template ao workspace e escolhe o Space.
2. Recebe 8 status (Open, In Progress, Drafted, With Opposing Counsel, With Client, Reviewed, Signed, Closed), 7 campos (ex.: Amount, Document Status, Hours, Paid, Payment Type) e 6 visões (List, Payments, Calendar, Chart e outras).
3. Digita os dados do cliente e do caso.
4. Monta, ela mesma, automações de lembrete para prazos e audiências.

Há também templates de linha do tempo para caso judicial, Gantt para advogados e SOP de casos.

**Comportamento jurídico real:** nenhum. A página diz que prazo e audiência entram à mão e o lembrete é configurado pela pessoa.

**Serve ao ENSPACE:**
- Prova que status, campos e visões de um escritório cabem em template. Isso é caso de uso no ENSPACE.

**Não serve:**
- Nada de regra de prazo, captura ou provisão.

### monday.com

**Como entrega jurídico:** template e, desde 2026, agentes de IA genéricos aplicados ao jurídico.

Passos do template "Legal Case Management CRM":
1. A pessoa instala o template.
2. Recebe 6 quadros: Accounts, Leads, Contacts, Deals, Legal Cases (tipo, cliente, início e fim) e Contracts.
3. Recebe 12 painéis de receita e funil e 5 automações (ex.: avisar quando chega e-mail, preencher "última interação").
4. O FAQ promete um quadro de audiências com lembrete, mas a lista de quadros da mesma página não traz esse quadro.

Passos da página "AI departments: Legal":
1. Agente Request Intaker valida o pedido, acha duplicado e encaminha ao advogado certo.
2. Agente Contract Drafter busca precedentes e redige no modelo aprovado; a minuta fica marcada como "DRAFT" até alguém confirmar.
3. Quadro de CLM acompanha etapa, dono, aprovação e data de renovação.
4. Outros agentes: relatório de casos, monitor regulatório, detector de risco, marcas, pesquisa.
5. Cada agente tem permissão própria e registro de atividade.

Marketplace: a busca não achou app que calcule prazo judicial.

**Comportamento jurídico real:** nenhum de prazo processual, captura de tribunal, reserva ou barreira de sigilo. A página promete que caso privilegiado "fica privilegiado", sem dizer como.

**Serve ao ENSPACE:**
- Intake, minuta e CLM são entregues como quadro + agente genérico. Confirma que contratos e consultivo são caso de uso.
- A marca "DRAFT até confirmar" é o padrão de revisão humana que o prazo sugerido também precisa.

**Não serve:**
- Contencioso brasileiro não aparece. O template é CRM de escritório americano.

### Pipefy

**Como entrega jurídico:** templates gratuitos, quase todos em inglês, e casos de uso montados pelo cliente.

Passos do template (ex.: "Legal Documentation Control", "Legal Contract Drafting", "Business Contract Analysis", "Contracts Renewal", "Legal Negotiation Support", "Task Management for Law Firms"):
1. A pessoa clica em "Use this Free Template" e o pipe é clonado na conta.
2. Recebe fases em kanban, formulário e campos. No "Legal Documentation Control": que documento chegou, quem entrega e até quando, se tem toda a informação e todas as assinaturas.
3. Adapta fases e campos.

Caso citado: o jurídico da própria Pipefy revisa NDA com IA contra um playbook e manda para assinatura pelo PipeSign, montado sem dev.

**Comportamento jurídico real:** nenhum. Não há template de contencioso, de procuração nem integração com tribunal nas fontes.

**Serve ao ENSPACE:**
- É o concorrente mais parecido em forma (pipe = categoria com fases). Ele entrega jurídico só como caso de uso. O motor de prazo seria diferença real do ENSPACE contra a Pipefy.

**Não serve:**
- Sem conteúdo brasileiro de contencioso para copiar.

## Produtos jurídicos

### Thomson Reuters Legal One (Brasil)

**Como resolve captura e prazo:**
1. O sistema captura publicações e andamentos de todo o Brasil; no plano Starter, monitora nomes nos Diários.
2. Cada publicação vira prazo, tarefa e lembrete na agenda da equipe.
3. A "roleta" (plano Advanced) agenda o compromisso e sugere o executante pelo critério do escritório: responsável pela pasta, rodízio, sorteio ou capacidade.
4. No Painel de distribuição, a equipe redistribui a fila (ex.: férias).
5. A controladoria confere e confirma a distribuição, em vez de decidir uma por uma.
6. A agenda é única, com kanban, lista e calendário.
7. Desde 2026-05-20, nos pacotes Premium e Exclusive: a IA resume a publicação e sugere o prazo; o comunicado diz que a IA opera com validação humana, sem descrever o passo de confirmação.

**Não documentado:** calendário forense por tribunal, suspensões, memória do cálculo, provisão. Permissão é "por perfil", sem sigilo por caso.

**Serve ao ENSPACE:**
- O fluxo captura, prazo sugerido, distribuição, conferência da controladoria é o desenho de referência no Brasil.
- A controladoria confirma em lote. A tela do ENSPACE precisa da fila de revisão, não só do prazo pronto.

**Não serve:**
- É sistema fechado de escritório; o cliente não muda a estrutura.

### Clio (EUA)

**Prazo por regra (Court Rules, vindo da compra da CalendarRules em 2021):**
1. A pessoa abre o caso e escolhe a jurisdição e o gatilho (trigger) com data e hora.
2. A regra gera os eventos ligados no calendário. A biblioteca cobre os 50 estados (o help fala em 2.200 jurisdições).
3. Ao editar o gatilho, a pessoa muda em lote os eventos seguintes (melhoria de 2022, atualizada em 2023).
4. A pessoa cria regra própria com gatilho e ações.

O help do Clio deu 403. O resumo da busca indica que os eventos ligados não se editam em lote, um por um, o que conflita com o Lawyerist. Conferir antes de citar.

**Barreira e conflito:**
1. Cada caso nasce visível para toda a firma.
2. Em permissões do caso, a pessoa troca "Everyone" por usuários ou grupos específicos (até 20).
3. O administrador bloqueia usuários de qualquer caso e vê os casos de que está bloqueado.
4. Checagem de conflito: da busca global, dos contatos ou na criação do caso ("Save and run conflict check"); busca por pessoa, empresa ou palavra, com variações de nome.
5. Quem roda a checagem e quem vê o relatório é definido por papel.

**Serve ao ENSPACE:**
- Gatilho gera cadeia; mudar o gatilho propaga. É o contrato mínimo do motor de prazos.
- A barreira é uma permissão do caso. No ENSPACE, cabe na permissão por item da plataforma, não no módulo jurídico.
- Checagem de conflito na criação do caso é um gesto de formulário: cabe em caso de uso com busca.

**Não serve:**
- Regras dos EUA. O calendário forense brasileiro é outro conteúdo.

### LawToolBox (EUA)

Vendido como complemento dentro de Outlook, Teams, Clio, Smokeball, Centerbase, Actionstep, PracticePanther.

**Como mostra e recalcula a cadeia:**
1. A pessoa escolhe o conjunto de regras e informa a data do gatilho. 1 data de julgamento gera mais de 80 prazos.
2. Os prazos aparecem no Deadline Chart, filtráveis pela data do gatilho.
3. Para mudar o gatilho: menu de ações do evento, "Recalculate", nova data, "Save and Next". Os prazos dependentes se ajustam.
4. Para mudar 1 prazo só: "Edit Entry", com notas e rótulos; o calendário sincronizado atualiza.
5. No Centerbase, o recálculo gera 2 listas: "Deadlines" e "Removed Deadlines".
6. No Smokeball, o evento aberto mostra o gatilho e a data do gatilho.
7. Ordem do juiz troca a regra: a hashtag `#cutoff` remove os prazos legais de encerramento da instrução e usa o gatilho da ordem.

**Não documentado:** citação da regra em cada prazo e histórico depois do recálculo.

**Serve ao ENSPACE:**
- "Removed Deadlines" é a forma mais clara de mostrar o que o recálculo tirou.
- Exceção por ordem do juiz (o `#cutoff`) é o caso que o motor precisa prever: decisão que sobrepõe a regra.
- Mostrar o gatilho no prazo derivado é o primeiro degrau da memória do cálculo.

**Não serve:**
- Ele vive dentro de outro sistema. O ENSPACE é o sistema.

### CompuLaw e Milana (Aderant, EUA)

**Como resolve, pelo informe de migração de 2026:**
1. A pessoa escolhe o gatilho numa árvore de seleção com filtros de busca.
2. Cada evento fica ligado à fórmula da regra que o gerou.
3. Prazo adiado (continued) ajusta sozinho os eventos ligados.
4. Exclusões por caso controlam quais prazos valem: só para erro médico, só para uma divisão, por forma de citação (correio, fax), por audiência por telefone, por preferência do advogado.
5. Advogados da própria Aderant mantêm as regras; a atualização chega sozinha.
6. Regras próprias da firma (contratual, regulatório) convivem com as regras de tribunal.
7. Ao migrar para fora, os eventos viram registros soltos, sem recálculo.

**Serve ao ENSPACE:**
- "Evento ligado à fórmula" é o requisito central: prazo derivado guarda a regra, para recalcular e para explicar.
- Exclusões por caso mostram que o rito e a forma de intimação mudam a cadeia. No Brasil: rito, Fazenda Pública em dobro, intimação pelo DJEN ou pelo Domicílio.
- Regra própria da firma ao lado da regra de tribunal: o ENSPACE já tem o mecanismo genérico de prazo; o módulo soma a regra de tribunal.

**Não serve:**
- Base de regras paga e mantida por advogados. O ENSPACE precisa decidir quem mantém o calendário forense.

### ELM corporativo (Legal Tracker, Passport, Brightflag, TeamConnect)

**Legal Tracker (Thomson Reuters), accruals:**
1. A empresa define a periodicidade (mensal, trimestral, anual), o prazo de lançamento e a janela de entrada.
2. O escritório externo lança o valor não faturado no sistema.
3. A empresa revisa por 1 de 3 opções: revisão obrigatória por usuários, revisão por administradores ou sem revisão.
4. Ao fim da janela, o sistema trava o valor e o guarda como registro permanente do período.
5. O relatório de accrual soma não faturado + faturas pendentes e é exportado para o financeiro.

Isso é accrual de honorários, não reserva de perda (ASC 450).

**Passport, Brightflag, TeamConnect, Onit:** nenhuma fonte pública lida documenta reserva de perda com probabilidade e histórico. O TeamConnect anuncia telas e campos configuráveis; o Brightflag trata accrual como parte do caso. A leitura provável: a reserva é campo configurado pelo cliente, não motor.

**Serve ao ENSPACE:**
- "Trava por período com registro permanente" é o desenho exato da provisão por data-base.
- Janela, revisão e trava: o mesmo rito serve à provisão do CPC 25.

**Não serve:**
- Foco em gasto com escritório externo, não em contingência.

### Bônus: Projuris e ADVBOX (Brasil)

**Projuris (Empresa e ADV):**
1. Captura intimação de diário oficial e eletrônica por OAB, nome ou termo.
2. Controla o prazo conforme a origem: DJEN ou Domicílio Judicial Eletrônico.
3. No caso AGCO: o módulo de distribuição cadastra a ação nova com os campos já preenchidos.
4. O escritório parceiro pede mudança de prognóstico (remoto, possível, provável) por "requisição", com justificativa e aprovação.
5. O sistema calcula a provisão com correção monetária mês a mês, em reais e em dólares.
6. O relatório mensal de contingência caiu de 5 dias com 7 pessoas para cerca de 2 horas com 1 pessoa, e segue para a contabilidade.

**ADVBOX:** calcula prazo integrado ao processo; o blog lista as exclusões: feriados nacionais e municipais, recesso de 20/12 a 06/01, suspensão de expediente.

**Regra que a captura precisa seguir (CNJ e tribunais):**
- Desde a Resolução CNJ 569/2024, o DJEN é o marco oficial da contagem quando a lei não exige intimação pessoal; o sistema local do tribunal só informa.
- DJEN: publicação no 1º dia útil depois da disponibilização; prazo começa no dia útil seguinte.
- Domicílio: citação conta do 5º dia útil depois da confirmação (CPC, art. 231, IX); intimação não aberta conta como feita no 10º dia corrido.

**Serve ao ENSPACE:**
- Requisição de mudança de prognóstico com aprovação é o histórico de risco que o módulo precisa.
- Correção mês a mês em 2 moedas: o ENSPACE já tem Correção Monetária; a provisão reusa esse motor.
- DJEN e Domicílio contam diferente. A captura precisa saber a origem para gerar o prazo certo.

**Não serve:**
- Produto fechado; o cliente não modela a estrutura.

## O padrão que todos seguem

- **Plataforma genérica entrega jurídico como template.** Notion, ClickUp, monday.com e Pipefy dão quadros, campos, status e lembrete. A data do prazo entra à mão.
- **A IA genérica vira o novo "jurídico" das plataformas.** monday.com e Pipefy entregam intake, minuta e revisão de contrato com agente genérico e playbook do cliente. Nenhum agente conta prazo processual.
- **Produto jurídico tem 2 núcleos de código:**
  - captura de publicação ou intimação que vira prazo, com fila de conferência humana;
  - motor de regra: gatilho gera a cadeia de prazos ligada à regra, e mudar o gatilho recalcula a cadeia.
- **A base de regras é conteúdo mantido pelo fornecedor** (Aderant com advogados próprios, Clio com a CalendarRules, LawToolBox). Não é configuração do cliente.
- **Exceção por caso existe em todos os motores maduros:** exclusão por tipo de caso, forma de citação, ordem do juiz.
- **A IA entra como sugestão, nunca como decisão:** Legal One sugere prazo com validação humana; monday.com marca a minuta como "DRAFT" até confirmar.
- **Período travado é o desenho do dado financeiro:** Legal Tracker trava o accrual por período; Projuris gera o relatório mensal de contingência.
- **Barreira de sigilo é permissão do caso,** não módulo (Clio: todos ou lista; CosmoLex: tira o caso até da checagem de conflito).

## O que nenhum deles faz

Oportunidades para o ENSPACE. Cada uma é ausência na documentação pública lida, não prova de que o produto não faz.

1. **Motor de prazo dentro de uma plataforma no-code.** Os genéricos não têm motor; os jurídicos não deixam o cliente modelar a estrutura. O Twenty chega perto com o app, mas pede programador.
2. **Memória do cálculo dia a dia.** Clio, LawToolBox e Milana mostram o gatilho e a cadeia. Nenhum documenta, no prazo, quais dias foram pulados e por quê (feriado municipal, portaria de suspensão, recesso).
3. **Histórico do recálculo.** Só o LawToolBox no Centerbase lista os prazos removidos. Nenhum documenta "antes e depois" do prazo quando o gatilho ou o feriado muda.
4. **Captura, prazo, provisão e sigilo no mesmo item.** No Legal One, captura e prazo; no Projuris, captura e provisão; no Clio, prazo e permissão. Nenhuma fonte mostra os 4 juntos, editáveis pelo cliente.
5. **Provisão por data-base como foto travada.** O Legal Tracker trava o período, mas só para honorários. O Projuris corrige mês a mês, mas a fonte não fala em trava por data-base. Nenhum ELM americano documenta reserva ASC 450 com histórico.
6. **Módulo que instala o caso de uso junto.** Nenhuma plataforma genérica liga comportamento e estrutura num gesto de pessoa não técnica. O Twenty faz isso para dev.
7. **Origem da intimação na regra.** Só o Projuris diz separar DJEN e Domicílio. Nenhum documenta como mostra ao usuário qual regra de contagem a origem aplicou.

## Tabela final: área jurídica × template × motor

| Área jurídica | Template nas plataformas genéricas? | Motor próprio nos produtos jurídicos? | Evidência | Leitura para o ENSPACE |
|---|---|---|---|---|
| Prazo processual (contagem por regra, cadeia, recálculo) | Não. Só data digitada e lembrete. Exceção: agente de IA de terceiro no Notion, sem regra declarada | Sim. Núcleo do produto | Clio Court Rules; LawToolBox "Recalculate"; Milana "linked to rule formulas"; ClickUp e monday.com só lembrete | Módulo |
| Calendário forense e suspensões | Não | Sim, como base de regras mantida pelo fornecedor. Detalhe por tribunal brasileiro não documentado | Aderant: regras atualizadas por advogados próprios; ADVBOX: lista de exclusões | Módulo (conteúdo mantido por alguém) |
| Captura de publicação e intimação | Não | Sim. Captura vira prazo com fila de conferência | Legal One (roleta e controladoria); Projuris (DJEN e Domicílio); Aderant eDockets (PACER) | Módulo |
| Prazo sugerido por IA | Não para prazo processual | Sim, com validação humana | Legal One, 2026-05-20, Premium e Exclusive | Módulo, com revisão obrigatória |
| Provisão e histórico de risco por data-base | Não | Sim no Brasil (Projuris). Não documentado nos ELMs americanos | Projuris/AGCO: correção mês a mês, requisição com aprovação | Módulo |
| Accrual de honorários por período | Não | Sim (trava por período) | Legal Tracker: janela, revisão, trava, relatório | Módulo se servir ao financeiro; senão caso de uso |
| Barreira de sigilo por caso | Não como produto jurídico; existe permissão genérica | Sim, como permissão do caso | Clio: todos ou até 20 usuários e grupos; bloqueio pelo admin | Recurso de permissão da plataforma, não módulo jurídico |
| Checagem de conflito | Não | Sim, busca na criação do caso | Clio: pessoa, empresa, palavra, variações | Caso de uso com busca; módulo só se precisar de relatório protegido |
| Contencioso (estrutura do caso) | Sim | Sim, mas fechado | ClickUp Legal Client Management; monday.com Legal Cases | Caso de uso |
| Contratos (CLM) | Sim, com agente de IA | Fora do escopo pesquisado | Pipefy Contract Drafting e Renewal; monday.com CLM board e Contract Drafter | Caso de uso |
| Consultivo e intake | Sim, com agente de IA | Fora do escopo pesquisado | monday.com Request Intaker; Pipefy Legal Documentation Control | Caso de uso |
| Procurações | Sem template encontrado | Não pesquisado | Busca na Pipefy sem resultado | Caso de uso (sem referência) |
| Societário | Não pesquisado | Não pesquisado | Fora desta rodada | Caso de uso (sem referência) |
| Marcas sem conector | Só agente de monitoramento genérico | Não pesquisado | monday.com IP & Trademark agent | Caso de uso |
| Canal de denúncias | Não pesquisado | Não pesquisado | Fora desta rodada | Caso de uso (sem referência) |

## Fontes

Acesso em 2026-10-26.

Plataformas genéricas
- Twenty, Apps: https://docs.twenty.com/getting-started/core-concepts/apps
- Twenty, Data model: https://docs.twenty.com/getting-started/core-concepts/data-model
- Twenty, Glossary: https://docs.twenty.com/getting-started/core-concepts/glossary
- Notion, Court Deadline Calculator: https://www.notion.com/en-gb/custom-agent-templates/court-deadline-calculator
- Notion, templates de terceiros: https://lawandnotion.gumroad.com/l/Lawandnotionfirm · https://iamanais.gumroad.com/l/legal-case-management · https://sevestil.gumroad.com/l/lawyer-case-manager
- ClickUp, Legal Client Management: https://clickup.com/templates/legal-client-management-t-4391871
- ClickUp, Timeline for Court Case: https://clickup.com/templates/timeline/for-court-case
- monday.com, Legal Case Management CRM: https://monday.com/crm/marketplace/template/legal-case-management-crm
- monday.com, AI departments Legal: https://monday.com/ap/ai-departments/legal
- monday.com, comunidade: https://community.monday.com/t/anyone-familiar-with-using-the-case-management-template-for-legal-matters/78507
- Pipefy, Legal Documentation Control: https://www.pipefy.com/templates/legal-documentation-control
- Pipefy, Legal Contract Drafting: https://www.pipefy.com/templates/drafting-contracts-legal/
- Pipefy, Legal Negotiation Support: https://pipefy.com/templates/legal-negotiation-support
- Pipefy, NDA com IA e PipeSign: https://analise.com/premio-analise-dna-fenalaw/eficiencia-na-gestao-de-ndas-pipefy-ai-pipesign

Produtos jurídicos
- Legal One Firm: https://www.thomsonreuters.com.br/pt/produtos/legal-one-firm.html
- Legal One, IA (2026-05-20): https://www.thomsonreuters.com.br/pt/sala-de-imprensa/tr-automatiza-rotinas-juridicas-com-novas-funcionalidades-de-ia-no-legal-one.html
- Clio Court Rules (403): https://help.clio.com/hc/en-us/articles/9289840995867
- Lawyerist, Clio Court Rules: https://lawyerist.com/news/clio-court-rules-enhancements/
- Clio, conflict checks: https://help.clio.com/hc/articles/35286010477979
- Clio, matter permissions: https://help.clio.com/hc/en-us/articles/9286062516123
- CosmoLex, Ethical Wall: https://support.cosmolex.com/knowledge-base/configuring-an-ethical-wall/
- LawToolBox, reagendar no Deadline Chart: https://support.lawtoolbox.com/support/solutions/articles/16000208065-faq-how-to-edit-reschedule-events-on-the-deadline-chart
- LawToolBox, corte por ordem do juiz: https://support.lawtoolbox.com/support/solutions/articles/16000131924-faq-discovery-cut-off-per-judge-order
- Centerbase, LawToolBox: https://support.centerbase.com/hc/en-us/articles/360019446112-LawToolBox-Create-Triggers-Calculate-Deadlines-and-Create-Appointments
- Smokeball, LawToolBox: https://support.smokeball.com/hc/en-us/articles/6009518909847
- Aderant, CompuLaw para Milana (2026): https://www.aderant.com/wp-content/uploads/2026/08/CompuLaw-to-Milana-Solutions-Brief-2026.pdf
- Aderant eDockets: https://www.aderant.com/solutions-edockets
- Legal Tracker, accruals: https://www.thomsonreuters.com/en-us/help/legal-tracker/company/accruals-and-unbilled-amounts/understanding-accruals
- Mitratech TeamConnect: https://mitratech.com/solutions/legal-operations/legal-matter-management/
- Brightflag, matter: https://help.brightflag.com/en/articles/753131-what-is-a-matter-in-brightflag
- Projuris, caso AGCO: https://www.projuris.com.br/blog/case-de-sucesso-agco/
- Projuris, intimações eletrônicas: https://www.projuris.com.br/blog/intimacoes-eletronicas-como-controlar-prazos/
- Projuris, DJEN: https://www.projuris.com.br/blog/djen/
- Projuris, provisionamento: https://www.projuris.com.br/blog/provisionamento-do-contencioso/
- ADVBOX, contagem de prazo: https://advbox.com.br/blog/legislacao-contagem-de-prazo/
- TJRR, Manual DJEN e DJE: https://tjrr.jus.br/images/sti/docspdf/Manual_para_DJEN_e_DJE.pdf

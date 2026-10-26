# Pesquisa: módulo jurídico

## Síntese

**Método:** pesquisa documental, sem conta nos produtos · **Fontes:** 5 plataformas obrigatórias, 5 produtos jurídicos e
4 ELMs corporativos · **Data:** 2026-10-26. O relatório completo, com a URL de cada afirmação, está em
[`pesquisa/referencias-de-mercado.md`](pesquisa/referencias-de-mercado.md). A pesquisa de mercado de 2026-10-24 (Brasil
e EUA) é a fonte da triagem e está resumida no `BRIEFING.md`.

**Resumo.**

- As 5 plataformas genéricas entregam jurídico como template: quadro, campos, status e lembrete. O prazo é uma data
  digitada.
- Os produtos jurídicos têm 2 núcleos de código:
  - a captura de publicação que vira prazo, com fila de conferência;
  - o motor de regra, em que um gatilho gera a cadeia de prazos e mudar o gatilho recalcula.
- Provisão por data-base é núcleo no produto brasileiro (Projuris). Os ELMs americanos documentam só accrual de
  honorários.
- Barreira de sigilo, no Clio, é permissão do caso. Fica com a plataforma, não com o módulo.

A pesquisa confirma a triagem do `BRIEFING.md`: o mercado põe em código o que este protótipo chama de módulo (prazo,
captura, provisão) e põe em template o que este protótipo chama de caso de uso.

## As 5 obrigatórias

| Produto | Como entrega jurídico | Serve ao ENSPACE | Não serve |
|---|---|---|---|
| Notion | Template de terceiro (Gumroad); 1 agente de terceiro, "Court Deadline Calculator", que calcula a cadeia a partir de 1 data | "1 data gera as tarefas no caso" é a experiência que o motor precisa ter | O agente não diz regra, tribunal nem feriados: não passa em auditoria de prazo |
| Twenty | Nada jurídico pronto. O "app" junta objetos, lógica e telas num pacote versionado, feito por programador | Um gesto que liga comportamento e estrutura: ligar o módulo e instalar o caso de uso | Pede programador; o cliente do ENSPACE é o jurídico sem dev |
| ClickUp | Template "Legal Client Management": 8 status, 7 campos, 6 visões; lembrete montado pela pessoa | Status, campos e visões de um escritório cabem em template: é caso de uso | Sem regra de prazo, captura ou provisão |
| monday.com | Template "Legal Case Management CRM" e agentes de IA genéricos (intake, minuta, CLM) | Intake e contrato como quadro e agente: contratos e consultivo são caso de uso. A minuta fica marcada até alguém confirmar | Contencioso brasileiro não aparece |
| Pipefy | Templates de documentação, minuta e renovação de contrato; o cliente adapta fases e campos | É o concorrente mais parecido (pipe = categoria com fases). Entrega jurídico só como caso de uso: o motor de prazo é diferença real | Sem contencioso, procuração ou tribunal |

## Os produtos jurídicos

| Produto | Como resolve | O que veio para o protótipo |
|---|---|---|
| Legal One (Brasil) | Captura de todo o Brasil; a publicação vira prazo e tarefa; a controladoria confere a distribuição; desde 2026-05-20 a IA sugere o prazo com validação humana | A caixa de Intimações é uma fila de revisão: nenhum prazo vira tarefa sem uma pessoa confirmar |
| Projuris (Brasil) | Separa a origem DJEN e Domicílio; mudança de prognóstico pede justificativa e aprovação; provisão corrigida mês a mês | A origem aparece na intimação e muda a contagem; mudança de risco pede motivo antes de fechar a data-base |
| Clio Court Rules (EUA) | Jurisdição e gatilho geram os eventos; mudar o gatilho muda os seguintes em lote. O help deu 403 e as fontes divergem | O prazo guarda a entrada do cálculo, para recalcular |
| LawToolBox (EUA) | "Recalculate" no evento; no Centerbase, a lista "Removed Deadlines"; ordem do juiz remove a regra legal | O histórico do prazo mostra o antes e o depois de cada recálculo |
| Milana / CompuLaw (EUA) | Cada evento ligado à fórmula da regra; exclusões por caso; regras mantidas por advogados da Aderant | Cada prazo mostra a regra e o fundamento. Quem mantém o calendário forense é pergunta para o time (P3 do `DECISOES.md`) |
| Legal Tracker e outros ELMs (EUA) | Accrual de honorários por período, com janela, revisão e trava | A data-base fechada não se edita, como o período travado |

## O padrão que todos seguem

- Plataforma genérica entrega jurídico como template, com a data do prazo digitada.
- Produto jurídico captura a publicação e põe uma pessoa para conferir antes de virar prazo.
- O prazo derivado fica ligado à regra que o gerou, e mudar a entrada recalcula.
- A base de regras é conteúdo mantido pelo fornecedor, não configuração do cliente.
- A IA sugere; uma pessoa confirma.
- Dado financeiro se fecha por período e não se edita depois.

O protótipo segue os 6. Divergir de qualquer um custaria o aprendizado de quem vem de um desses produtos.

## O que nenhum deles faz

Ausência na documentação pública lida, não prova de que o produto não faz.

1. Motor de prazo dentro de uma plataforma no-code.
2. A memória do cálculo dia a dia, com cada dia pulado, o motivo e a fonte.
3. O histórico do recálculo, com o antes e o depois de cada prazo.
4. Captura, prazo e provisão no mesmo item, que o cliente modela.
5. Provisão por data-base como foto travada, com motivo para cada mudança.
6. Um gesto que liga o módulo e instala o caso de uso.
7. Mostrar qual regra de contagem a origem da intimação (DJEN ou Domicílio) aplicou.

## Do relatório para o protótipo

| Achado | Onde está no protótipo |
|---|---|
| Fila de revisão antes do prazo (Legal One) | Jurídico › Intimações, abas Para revisar, Confirmadas e Descartadas |
| Origem muda a contagem (Projuris; itens 2 e 7) | Memória do cálculo: disponibilização e publicação no DJEN; ciência ou ciência tácita no Domicílio |
| Prazo ligado à regra (Milana; item 2) | Memória do cálculo em Intimações, em Prazos e na aba Prazos do processo |
| Recálculo com antes e depois (LawToolBox; item 3) | Módulo Jurídico › Calendário forense: adicionar ou remover suspensão recalcula e grava o histórico |
| Período travado (Legal Tracker; item 5) | Jurídico › Provisão: fechar a data-base, que fica somente leitura |
| Mudança de prognóstico com justificativa (Projuris) | Provisão: motivo obrigatório para cada mudança antes de fechar |
| Captura, prazo e provisão no mesmo item (item 4) | Tela do processo: abas Prazos, Intimações e Risco e provisão |
| Template para o resto (as 5 obrigatórias) | Módulo Jurídico › Casos de uso: 7 áreas que ficam como configuração |
| Ligar o módulo e instalar o caso de uso (Twenty; item 6) | Fora desta rodada: pergunta P1 do `DECISOES.md` |

## Rodada 3: captura em softwares jurídicos

Pesquisa profunda de 2026-10-26, com fonte e data em cada afirmação:
[relatório](pesquisa/reports/Captura%20em%20softwares%20jur%C3%ADdicos.md) e as 4 notas em
`pesquisa/research_notes/Captura em softwares jurídicos/` (fontes oficiais e datas, suítes corporativas, software de
escritório, fornecedores e APIs).

### O que muda a tela

- **2 canais fixam o prazo.** Desde 16/05/2025, o DJEN é o meio oficial da intimação do advogado (Res. CNJ 569/2024), e
  o Domicílio Judicial Eletrônico é o da empresa. Portal do tribunal e central de recortes viram meio de alerta.
- **A data depende do meio.**
  - DJEN: a publicação é o 1º dia útil depois da disponibilização, e o prazo começa no dia útil seguinte;
  - Domicílio: abrir o teor pela API conta como ciência (Res. CNJ 455/2022, art. 20); sem leitura, a ciência é tácita
    em 10 dias corridos;
  - citação no Domicílio: confirmar em 3 dias úteis, sob multa de até 5% (CPC, art. 246, § 1º-C); o prazo começa depois
    do 5º dia útil seguinte à confirmação;
  - meio contra meio: o STJ ainda julga o conflito no Tema 1.180.
- **Configurar pede 3 cadastros:** a fonte (com credencial e estado), o termo (CNPJ, nome com variações e exceções, OAB
  com UF) e a abrangência. O mercado cobra por termo.
- **A fila segue 2 modelos:** abas por estado (Legal One, Themis, Astrea) ou caixa com classificação por IA (EasyJur,
  Projuris ADV). Todos têm "processo não encontrado" com 2 saídas: vincular ou cadastrar.
- **A saúde aparece por credencial** (status do login no tribunal, aviso de certificado vencido), nunca por execução.

### O que nenhum deles mostra

Ausência na documentação pública lida, não prova de que o produto não faz.

1. A mesma comunicação vinda de 2 meios agrupada, com as 2 datas e qual vale.
2. O histórico de execuções da fonte, inclusive a que rodou e não achou nada.
3. A prova de chegada de cada captura: hora, fonte, id na fonte, hash do DJEN e certidão.

### Do relatório para o protótipo (rodada 3)

| Achado | Onde está no protótipo |
|---|---|
| Fonte como cadastro com estado (seção 7, item 1) | Módulo Jurídico › Fontes: 6 fontes, quem roda, frequência, última execução, situação |
| Termo com variações, exceções e abrangência (item 2) | Módulo Jurídico › Termos monitorados, com o consumo do contrato |
| Entrada única para robô e fornecedor (item 3) | Fonte "Fornecedor de recortes do cliente" por webhook; "Adicionar fonte" com webhook, API ou e-mail |
| Fila com estados e "processo não encontrado" (item 4) | Jurídico › Capturas: visualizações Para tratar, Distribuições, Andamentos, Tratadas, Descartadas; vincular ou cadastrar |
| Duplicidade agrupada (item 5) | Coluna Origem com "+1 fonte"; o painel diz por onde mais chegou |
| Data oficial e data de alerta (item 6) | Bloco "A mesma intimação chegou por 2 meios" e a regra em Destino |
| Domicílio com a decisão de ciência explícita (item 7) | Modal antes de abrir o teor; confirmação da citação com o prazo de 3 dias úteis |
| Saúde por fonte, com o silêncio confirmado (item 9) | Botão de saúde na barra da caixa; execuções com "Sem resultado" e "Falhou" no painel da fonte |
| Prova de cada captura (item 10) | Bloco "Dados da captura" no painel, com hash e certidão |
| IA que sugere e espera confirmação (item 8) | A regra sugerida pelo teor, que já existia; nada novo nesta rodada |

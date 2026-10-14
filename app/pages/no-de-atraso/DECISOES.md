# Decisões: Nó de Atraso com data de referência

## Rodada 1 · 2026-10-14

- **Pedido (literal):** a demanda inteira está no `BRIEFING.md`, primeira seção.
- **Fronteira:** muda o modal do nó Atraso e o texto do card dele no canvas. Não muda a paleta de nós, o
  Start, os outros nós, o canvas nem a casca das Configurações.

### O que a proposta faz

1. **"Esperar" ganha 2 modos**, em 2 cartões lado a lado:
   - **Por um tempo**: o nó de hoje, com Quantidade de Tempo e Unidade. A quantidade vira número inteiro a
     partir de 1; "abc" não grava mais.
   - **Até uma data do item**: a novidade.
2. **A espera até a data se monta como frase**, sem fórmula:
   - "Continuar o fluxo [30] [dias] [antes de] [Data de vencimento]".
   - Direção: antes de, depois de, na data de. "Na data de" esconde o número e a unidade.
   - Unidade: dias, semanas, meses, horas. Mês segue a regra do dayjs: 31/03 menos 1 mês dá 28/02.
   - O campo vem de uma lista agrupada pelo nó de onde vem ("Do nó Início"), com busca, o mesmo padrão das
     variáveis do CRUD. Datas do sistema (Criado em, Atualizado em) levam a etiqueta "do sistema"; campo com
     hora leva "com hora".
   - Sem campo de data chegando ao nó, a lista diz por quê e o que fazer.
3. **Horário e fuso:** "às 09:00" por padrão, de 30 em 30 minutos, no fuso do workspace. Com campo que guarda
   hora, aparece "O horário gravado no campo". Com espera em horas, o horário fica desligado e o texto
   explica.
4. **Os 3 casos que o mercado esconde, perguntados em linguagem simples:**
   - Se a data já tiver passado: **Continuar na hora** (padrão) ou Encerrar o fluxo.
   - Se o campo estiver vazio: **Encerrar o fluxo** (padrão) ou Continuar na hora.
   - **Recalcular se a data mudar** (ligado): se alguém alterar o vencimento durante a espera, a nova data vale.
5. **Prévia com os itens da categoria**, dentro do modal:
   - Contagem: "34 esperam", "4 já passaram da data", "2 sem data". Clicar num número mostra um item do grupo.
   - "Ver com o item" escolhe o contrato. A frase diz o dia e a hora: "Data de vencimento: 15/03/2027. O fluxo
     continua em 13/02/2027, às 09:00."
   - Linha do tempo com Criado, Hoje, Continua e o campo.
6. **"Ver o cálculo"**, recolhido: a conta em dayjs e o que o nó grava, para quem configura pela API e para o
   dev.
7. **O card do nó diz quanto espera:** "Continua 30 dias antes de Data de vencimento, às 09:00." Hoje mostra
   a descrição genérica.
8. **Validação no Salvar:** sem campo de data, o seletor fica vermelho com "Escolha o campo de data." e o modal
   não fecha.

### Por que assim

- **Frase em vez de fórmula:** HubSpot, Salesforce e ActiveCampaign, os 3 que atendem pessoa leiga, montam o
  deslocamento com campo, número, unidade e direção. Os que pedem expressão (n8n, Zapier, Power Automate) são
  os técnicos. A pessoa do caso (configuradora de contrato) é a do primeiro grupo.
- **2 modos no mesmo nó, não um nó novo:** n8n e Twenty fazem assim, e quem procura "esperar" acha num lugar
  só. O nó já se chama Atraso.
- **Direção separada da unidade** (contra o "Days Before" do Salesforce): em 3 idiomas, a combinação
  multiplica as opções.
- **Uma saída, sem ramo** (contra o HubSpot): ramificar é papel do nó Condicional. Data passada e campo vazio
  viram regra simples (continuar ou encerrar).
- **Prévia com item real:** nenhum dos 13 produtos mostra a data calculada antes de salvar. É o que tira a
  dúvida de quem não sabe se "30 dias antes" pegou o campo certo.
- **Padrões das 2 perguntas:** contrato que já está a menos de 30 dias do vencimento ainda precisa do aviso,
  então data passada continua. Contrato sem vencimento não tem o que avisar, então encerra.

### O que o nó passa a gravar (proposta para o back-end)

Os campos de hoje (`label`, `delay`, `unit`) continuam valendo no modo "por um tempo". Os novos:

```json
{
  "mode": "until_date",
  "date_source": "start.data_de_vencimento",
  "offset_amount": 30,
  "offset_unit": "day",
  "offset_direction": "before",
  "time": "09:00",
  "if_past": "continue",
  "if_empty": "end",
  "recalculate": true
}
```

A conta em dayjs, como o "Ver o cálculo" mostra:

```js
dayjs({{start.data_de_vencimento}})
  .subtract(30, 'day')
  .hour(9).minute(0).second(0)
  .tz('America/Sao_Paulo', true)
```

`recalculate` pede ao back-end ouvir a atualização do campo enquanto o fluxo espera. É a parte mais cara da
proposta; sem ela, a data é calculada uma vez, na entrada do nó, como em todos os produtos pesquisados.

- **Descartado:** ramo de saída para data passada e campo vazio, como no HubSpot. Motivo: o Atraso tem 1 saída
  e o Condicional já ramifica.
- **Descartado:** campo de texto com `{{ }}` e expressão livre. Motivo: é o modelo do n8n e do Power Automate,
  feito para quem programa; o "Ver o cálculo" cobre quem precisa ver a conta.
- **Descartado:** dias úteis. Motivo: o caso pede dias corridos; dias úteis depende do calendário do workspace
  e merece rodada própria.
- **Não deu:** confirmar onde o ENSPACE guarda o fuso do workspace. O texto "No fuso do workspace: Brasília
  (UTC−3)" supõe que existe um fuso por workspace; a aba Sistema › Calendário é a candidata, sem conferir.
- **Não deu:** abrir HubSpot, Salesforce e os outros na tela; a pesquisa é por documentação e não tem print.
- **Maquete:** a prévia calcula de verdade sobre 40 contratos fictícios, com "hoje" fixo em 14/10/2026 10:30.
  Salvar fecha o modal, troca o card e mostra o aviso, em memória. Abas do editor, trilho, zoom (funciona),
  minimapa e Adicionar Nó são estáticos.
- **CSS próprio:** nenhum `<style>`. A grade do canvas usa `bg-[linear-gradient(...var(--ui-border)...)]`
  (token), e a escrita vertical de ENTRADA e SAÍDA usa `[writing-mode:vertical-rl]`; nenhum componente do
  Nuxt UI faz texto vertical.

### Componentes

- `URadioGroup` com `variant="card"` para os 2 modos (conferido no MCP do Nuxt UI e no disco).
- `UInputNumber` com `min` 1 no lugar do `UInput` de texto.
- `USelectMenu` com itens agrupados (`type: 'label'`), `search-input`, slots `#item-trailing` e `#empty`.
- `USelect` para os horários: o `UInputTime` pede `@internationalized/date`, que este repositório não
  instala.
- `UCollapsible` para "Ver o cálculo"; `USwitch` com `description` para recalcular.

## Rodada 2 · 2026-10-14

- **Pedido (literal):** "esses textos no nó de delay estao pessimos no seu print. e até uma data DO ITEM nem
  faz sentido. pode ser só "até uma data específica", mas esses textos estao pessimos. os nomes precisam estar
  mais formais. "por um tempo" ta ridiculo e "ate uma data especifica" ainda fica ruim tb."
- **Mudou:** a copy do modal inteira passa ao registro formal, nos 3 idiomas:

| Antes | Agora |
|---|---|
| Esperar | Tipo de atraso |
| Por um tempo | **Duração fixa**: "Pausa a execução por um período definido." |
| Até uma data do item | **Data de referência**: "Pausa a execução até uma data calculada a partir de um campo de data." |
| Continuar o fluxo | Retomar a execução |
| Escolha o campo | Selecione o campo de data |
| Horário | Horário de retomada |
| No fuso do workspace | Fuso horário do workspace |
| Se a data já tiver passado | Quando a data calculada já tiver passado |
| Se o campo estiver vazio | Quando o campo não estiver preenchido |
| Continuar na hora | Retomar imediatamente |
| Recalcular se a data mudar | Recalcular quando o campo for alterado |
| Prévia | Simulação |
| Ver com o item | Item de exemplo |
| 31 esperam · 7 já passaram da data · 2 sem data | 31 aguardando · 7 com data já passada · 2 sem data preenchida |
| O fluxo continua em 13/02/2027 | Retomada em 13/02/2027 |
| Ver o cálculo | Ver cálculo |
| Card: "Continua 30 dias antes de…" | Card: "Retoma 30 dias antes de Data de vencimento, às 09:00." |

- **Mudou:** "Data de referência" no lugar de "data do item": a data pode vir de qualquer nó que chega ao
  Atraso, não só do item do gatilho. A lista de campos agrupa por "Nó Início".
- **Mudou:** o campo de data ganhou linha própria ("Campo de data", obrigatório); a frase embaixo fica
  "Retomar a execução [30] [dias] [antes de] Data de vencimento". Com o seletor dentro da frase, o nome do
  campo cortava e o erro pintava a linha inteira de vermelho.
- **Mudou:** a linha do tempo da simulação perdeu o ponto "Criado" (colava no "Hoje"); os rótulos das pontas
  alinham para dentro da caixa.
- **Mudou:** a quantidade do deslocamento tem teto de 999.
- **Descartado:** "Até uma data específica". Motivo: a redatora reprovou; "específica" sugere data fixa
  digitada, e a data vem de um campo.
- **Ver:** `pnpm dev` › `/no-de-atraso` · `evidencias/proposta-01-data-de-referencia.jpg`,
  `proposta-02-simulacao.jpg`, `proposta-03-erro-sem-campo.jpg`, `proposta-04-sem-campo-de-data.png`

## Rodada 3 · 2026-10-14

- **Pedido (literal):** "o campo de tipo de atraso deve ser simplesmente um dropdown com 2 opçoes e as
  descriçoes nos helps"
- **Mudou:** "Tipo de atraso" deixa os 2 cartões e vira `USelect` com Duração fixa e Data de referência. A
  lista mostra só os nomes.
- **Mudou:** as 2 descrições vão para o "?" do campo, o mesmo ícone de ajuda de "Nome do Nó". O tooltip mostra
  as duas, com o nome em negrito.
- **Mudou:** "Abrir o nó" e o clique no card fecham e reabrem o modal. Com a aba aberta em segundo plano, o
  modal ficava marcado como aberto sem aparecer.
- **CSS próprio:** nenhum. O tooltip de várias linhas usa a prop `ui.content` (`h-auto max-w-80 flex-col`);
  o tema dele fixa `h-6`.
- **Ver:** `/no-de-atraso` · `evidencias/proposta-05-tipo-de-atraso-dropdown.jpg`

## Rodada 4 · 2026-10-14

- **Pedido (literal):** "todos os campos devem ter um instruction abaixo, curto, explicando pra que ele serve,
  porque o user é realmente muito leigo / e campos que voce botou como radio buttons pode colocar como dropdown
  tambem na configuração / o campo de data não é selecionável. é um campo aberto pra arrastar uma variavel pra
  ele. voce pode botar já essa variável escrita ali num exemplo pra facilitar, do tipo
  {{nodes.trig.data_de_vencimento_contrato}}"
- **Mudou:** todo campo da proposta tem uma instrução curta embaixo (o `help` do `UFormField`): Nome do Nó,
  Tipo de atraso, Quantidade de Tempo, Unidade, Campo de data, Retomar a execução, Horário de retomada e as 2
  regras. O "?" de Tipo de atraso continua com a descrição dos 2 tipos.
- **Mudou:** "Quando a data calculada já tiver passado" e "Quando o campo não estiver preenchido" viram
  dropdown.
- **Mudou:** o Campo de data deixa de ser lista e vira campo aberto, que recebe a variável arrastada.
  - Vazio, mostra o exemplo `{{nodes.trig.data_de_vencimento_contrato}}`; no caso do cliente, vem preenchido
    com ele.
  - Ao arrastar por cima, o campo ganha contorno e o texto "Solte aqui para usar esta data".
  - Com variável de data, aparece "Usando Data de vencimento, do nó Start.", em verde.
  - Com variável que não é data (ex.: Contratante), o erro diz "Contratante não é uma data. Arraste uma
    variável de data." Texto que não bate com nenhuma variável dá "Variável não encontrada entre as que chegam
    a este nó."
  - Aceita também o formato que o painel do develop entrega hoje, `{{ input.data.<campo> }}`.
- **Mudou:** a faixa ENTRADA abre o painel **Variáveis de Entrada**, cópia do develop: título, "Arraste as
  variáveis para os campos que você deseja configurar.", "Filtrar por nome ou chave...", a árvore
  "Start - (trigger)" com ID, Criado em, Editar em, Referência, E-mail do Requisitante, Display e o grupo
  "data" com os campos do contrato. O arrasto leva o mesmo pacote do develop (`key`, `label`,
  `meta.dataType`). Proposta sobre a casca: ao escolher "Data de referência" com o campo vazio, o painel abre
  sozinho; e um botão no fim do campo também abre o painel. Data aparece com ícone em destaque na árvore.
- **Mudou:** a faixa ENTRADA fica depois do formulário no DOM, com `order-first`, para o primeiro foco do
  modal continuar no X.
- **Mudou:** o cenário do andaime "Sem campo de data" vira "Sem variável": o painel abre vazio com "Nenhuma
  variável chega até este nó."
- **Fronteira:** muda o modal do Atraso e o comportamento da faixa ENTRADA dentro dele. Não muda o painel de
  variáveis dos outros nós.
- **Achado do develop:** o painel entrega `{{ input.data.vitrine_data }}` (medido em 14/10/2026, arrastando
  "Data (Calendário)"), e não o formato `{{nodes.trig.…}}` do exemplo. O protótipo usa o formato do exemplo e
  aceita os 2; qual vale no produto é decisão do time.
- **Conferido:** o arrasto, os erros e o foco pelo DOM (variável de texto dá o erro, variável de data dá
  "Usando…", o primeiro foco é o X). O print ficou para a rodada 5, quando o Chrome voltou à tela.
- **Ver:** `/no-de-atraso` · `evidencias/dev-05-variaveis-de-entrada.jpg` (o painel no develop) ·
  `evidencias/proposta-06-variaveis-de-entrada.jpg` (o painel na proposta)

## Rodada 5 · 2026-10-14

- **Pedido (literal):** "e o que exatamente significa RETOMAR IMEDIATAMENTE. retomar o que? toda opçao deve ter
  um help com tooltip."
- **Mudou:** "retomar" sai do nó inteiro. O nome diz o que acontece:

| Antes | Agora |
|---|---|
| Retomar imediatamente (opção) | Avançar para o próximo nó |
| Retomar a execução (frase) | Avançar para o próximo nó [30] [dias] [antes de] Data de vencimento |
| Horário de retomada | Horário |
| Retomada em 13/02/2027 (simulação) | Avança para o próximo nó em 13/02/2027 |
| A execução é retomada imediatamente | O fluxo avança para o próximo nó na hora |
| Retoma 30 dias antes de… (card) | Avança 30 dias antes de… |

- **Mudou:** toda opção de dropdown da proposta tem um "?" no fim da linha, com tooltip dizendo o que ela faz:
  Tipo de atraso, Unidade, a unidade e a direção da frase, e as 2 regras. Exemplos:
  - Avançar para o próximo nó: "O fluxo não espera: segue na hora para o nó ligado depois do Atraso."
  - Encerrar o fluxo: "O fluxo para neste nó. Os nós seguintes não rodam para este item."
  - Meses: "Meses do calendário. 1 mês antes de 31/03 é 28/02."
- **Fora:** o dropdown de Horário (48 horários de meia em meia hora) e o Item de exemplo da simulação não têm
  "?" por opção: a opção é o próprio valor, e o campo já tem instrução embaixo.
- **Componente:** o "?" entra pelo slot `#item-trailing` do `USelect`, antes do ✓ da opção marcada. O tooltip
  quebra linha pela prop `ui` (`content: 'h-auto max-w-72'`, `text: 'whitespace-normal'`); o tema do Tooltip
  trunca o texto em 1 linha. Sem CSS próprio.
- **Acessibilidade:** o "?" dentro da opção abre no hover; pelo teclado o tooltip não abre. A instrução embaixo
  do campo cobre quem navega por teclado. Fica como achado para o time.
- **Em aberto:** a variável dentro da frase, no lugar do texto "Data de vencimento" (respondido na conversa,
  sem aprovação ainda).
- **Ver:** `/no-de-atraso` · `evidencias/proposta-07-ajuda-em-cada-opcao.jpg`

## Rodada 6 · 2026-10-14

- **Pedido (literal):** "Antes de publicar, faz a variável dentro da frase, no lugar do texto Data de
  vencimento." e "e tambem "encerrar o fluxo" pode ser "encerrar o fluxo com erro" a opçao"
- **Mudou:** o bloco "Campo de data" sai. A regra inteira fica numa frase só, e o fim dela é o lugar de soltar
  a variável: **Avançar para o próximo nó** [30] [dias] [antes de] [📅 Data de vencimento ×].
  - Vazio: caixa tracejada "Arraste a data aqui"; o clique abre Variáveis de Entrada.
  - Arrastando por cima: contorno e "Solte aqui para usar esta data".
  - Com variável de data: etiqueta com o nome legível; a chave
    (`{{nodes.trig.data_de_vencimento_contrato}}`) aparece no tooltip. O × remove.
  - Clique no nome da etiqueta: vira campo de texto com a chave, para quem configura escrevendo.
  - Texto que não é variável conhecida também aparece como campo de texto, para corrigir.
  - Variável que não é data: só a etiqueta fica vermelha, e a mensagem vem embaixo da frase.
- **Mudou:** a instrução da frase passa a cobrir as 2 coisas: "Arraste a variável da data para o fim da frase
  e diga quanto tempo antes ou depois dela o fluxo segue para o próximo nó." Some a linha verde "Usando…": a
  etiqueta já diz o nome.
- **Mudou:** "Encerrar o fluxo" vira **"Encerrar o fluxo com erro"** nas 2 regras. O tooltip diz que a
  execução fica registrada com erro; a simulação diz "O fluxo é encerrado com erro neste nó."
- **Componente:** sem `error` no `UFormField` da frase: ele pinta de vermelho todos os controles de dentro. A
  mensagem é um `<p role="alert">` embaixo da frase.
- **Ver:** `/no-de-atraso` · `evidencias/proposta-08-variavel-na-frase.jpg`,
  `evidencias/proposta-09-variavel-que-nao-e-data.jpg`

## Rodada 7 · 2026-10-14

- **Pedido (literal):** "observe que a opção "na data de" faz mudar a disposiçao do campo ali e isso fica
  estraho na usabilidade. nesse caso deve-se perguntar antes pro user se ele quer, quando o tipo de atraso for
  data de referencia, usar a data fixa ou um tempo dinamico calculado com base numa vairavel de data / e ai
  dependendo da opçao aparece só o campo de variavel ou aparece todos os campos dentro de "avançar para o
  proximo nó""
- **Mudou:** com Data de referência, o primeiro campo é **Quando avançar**, um dropdown com 2 opções e "?" em
  cada uma:
  - **Na data da variável** (a "data fixa" do pedido): aparece só o campo **Data da variável**, com a
    instrução "Arraste a variável da data. O fluxo segue para o próximo nó nesse dia.";
  - **Antes ou depois da data** (o "tempo dinâmico"): aparece a frase inteira, **Avançar para o próximo nó**
    [30] [dias] [antes de] [variável].
- **Mudou:** "na data de" sai do dropdown de direção, que fica só com "antes de" e "depois de". Quem volta de
  "Na data da variável" para "Antes ou depois da data" reencontra a direção que tinha escolhido.
- **Nome das opções:** "data fixa" e "tempo dinâmico" viraram "Na data da variável" e "Antes ou depois da
  data". Para quem é leigo, "data fixa" sugere digitar uma data, e a data vem da variável de cada item.
- **Dado gravado:** não muda. "Na data da variável" grava `offset_direction: 'on'`; a outra opção grava
  `before` ou `after`.
- **Fronteira:** muda só o bloco da Data de referência. Horário, as 2 regras, recalcular e a simulação seguem
  iguais nas 2 opções.
- **Ver:** `/no-de-atraso` · `evidencias/proposta-10-na-data-da-variavel.jpg`,
  `evidencias/proposta-11-antes-ou-depois-da-data.jpg`

## Rodada 8 · 2026-10-14

- **Pedido (literal):** "os textos ainda estao pessimos. o noem do campo "como avançar" é horrivel. os titulos
  das opçoes tambem sao horriveis... "antes ou depois da data" é o tipo de texto que se coloca num help, nao no
  nome da opçao. veja como outros produtos nomeiam os nomes dos campos dentro dos nodes. é mais objetivo. mais
  curto. mais tecnico (sem precisar ser dificil). assim ta só ridicularizando. ajuste isso e pode dar push pra
  main depois"
- **Contexto:** a rodada 7 foi feita em outra sessão, a pedido da redatora; esta rodada parte dela.
- **Referência:** HubSpot ("Delay type", "On date / Before date / After date", "Time of day"), Salesforce
  ("Time Source", "Offset"), n8n ("Resume", "Wait Amount", "Wait Unit") e Zapier ("Delay Until", "Date/Time").
  Rótulo de 1 ou 2 palavras; a explicação vai para o help e o tooltip.
- **Mudou:** "Momento" junta a pergunta da rodada 7 com a direção, como o HubSpot: **Na data**, **Antes da
  data**, **Depois da data**. Sai o dropdown de direção da frase; no lugar fica o texto fixo "antes de" ou
  "depois de". Grava o mesmo `offset_direction`.
- **Mudou:** os rótulos:

| Antes | Agora |
|---|---|
| Tipo de atraso: Duração fixa / Data de referência | Tipo de atraso: **Duração** / **Data** |
| Quando avançar: Na data da variável / Antes ou depois da data | **Momento**: Na data / Antes da data / Depois da data |
| Data da variável | **Data** |
| Avançar para o próximo nó [30] [dias] [antes de] [variável] | **Deslocamento** [30] [dias] antes de [variável] |
| Quando a data calculada já tiver passado | **Data no passado** |
| Quando o campo não estiver preenchido | **Data vazia** |
| Avançar para o próximo nó / Encerrar o fluxo com erro | **Continuar** / **Encerrar com erro** |
| Recalcular quando o campo for alterado | **Recalcular se a data mudar** |
| Card: Avança 30 dias antes de… | Card: **Até 30 dias antes de Data de vencimento, às 09:00.** |

- **Mudou:** helps e tooltips também ficam curtos ("Identifica o nó no fluxo.", "Tempo de espera.", "Quando o
  item não tem a data preenchida."). A simulação: "Continua em 13/02/2027, às 09:00."
- **Ver:** `/no-de-atraso` · `evidencias/proposta-12-rotulos-curtos-antes-da-data.jpg`,
  `evidencias/proposta-13-rotulos-curtos-na-data.jpg`

## Rodada 9 · 2026-10-14

- **Pedido (literal):** "nao precisa ter um check ao selecionar, só um destaque de background e a opçao em
  semibold. pra nao empurrar o simbolo do tooltip"
- **Mudou:** nos dropdowns da proposta, a opção escolhida não tem mais ✓; fica com fundo (`bg-elevated`) e
  semibold. O "?" de todas as opções fica na mesma coluna.
- **Componente:** prop `ui` do `USelect`, sem CSS próprio: `itemTrailingIcon: 'hidden'` e, em `item`,
  `data-[state=checked]:font-semibold data-[state=checked]:text-highlighted data-[state=checked]:before:bg-elevated`
  (o fundo do item vem do `before:`, como o hover do tema). Vale para os 8 dropdowns da proposta, Horário
  incluído.
- **Fronteira:** a versão "Como é hoje" continua com o ✓, como o develop.
- **Ver:** `/no-de-atraso` · `evidencias/proposta-14-opcao-escolhida-sem-check.jpg`

## Rodada 10 · 2026-10-14

- **Pedido (literal):** "perceba que tem campos pela metade deixando sobrar espaço. fica com uma aparencia meio
  "quebrada". ajuste isso / e no tipo de atraso, tente elaborar melhor o nome das opçoes, do tipo "data
  específica" ou "duração", nao sei. algum nome mais intuitivo porque tem espaço no campo pro nome ser um bocado
  mais longo, mas sem exagero"
- **Mudou:** Momento e Horário passam à largura total do modal, como Tipo de atraso e Deslocamento. As 2 regras
  (Data no passado e Data vazia) continuam lado a lado, cada uma com metade, sem sobra.
- **Mudou:** as opções do Tipo de atraso: **Intervalo de tempo** e **Data específica** (EN: Time interval,
  Specific date; ES: Intervalo de tiempo, Fecha específica). Os tooltips das opções continuam explicando cada
  uma.
- **Ver:** `/no-de-atraso` · `evidencias/proposta-15-largura-total-e-tipos.jpg`

## Rodada 11 · 2026-10-14

- **Pedido (literal):** "pode tirar o "ver calculo" do nó e fazer push pra main" e "pode tirar tambem a parte de
  simulaçao"
- **Mudou:** saem do modal a seção **Ver cálculo** (a conta em dayjs e o JSON gravado) e a **Simulação** (a
  contagem dos itens, o item de exemplo e a linha do tempo). O modal termina em "Recalcular se a data mudar".
- **Fica:** a conta em dayjs e o formato do que o nó grava continuam nesta página, na rodada 1 ("O que o nó
  passa a gravar"), e no `espera.ts` (`expressaoDayjs`, `dadoGravado`, `calcular`), como referência para o dev.
  O `mocks.ts` mantém os 40 contratos fictícios, que hoje nenhuma tela usa.
- **Ver:** `/no-de-atraso` · `evidencias/proposta-16-sem-simulacao-e-calculo.jpg`

## Rodada 12 · 2026-10-14

- **Pedido (literal):** "pode tirar tambem a opçao "recalcular se a data mudar", aí commita e publica"
- **Mudou:** sai a chave **Recalcular se a data mudar**. O modal termina em Data no passado e Data vazia.
- **Mudou:** o nó deixa de gravar `recalculate`. A data é calculada uma vez, quando o item chega ao nó, como em
  todos os produtos pesquisados. O JSON da rodada 1 ainda mostra o campo; vale o desta rodada.
- **Ver:** `/no-de-atraso` · `evidencias/proposta-17-sem-recalcular.jpg`

## Fechamento · 2026-10-14

- **Pedido (literal):** "o status desse prototipo ta em revisao na tela geral de prototipos / pode colocar que
  ele ta pronto agora"
- **Mudou:** status `aprovado` no `definePageMeta` (selo verde no índice) e no README.

# Pesquisa: como os construtores de fluxo configuram o nó

## Síntese

**Método:** pesquisa documental (documentação oficial, código-fonte do Twenty e do n8n, guias de design) mais a
exploração do develop · **Fontes:** 13 construtores, 6 guias de design (NN/g, Baymard, GOV.UK, Carbon, WCAG,
Microsoft) e os 17 modais do Spaceflow · **Data:** 15/10/2026.

**Resumo.** Os 13 construtores convergem em 6 decisões: configurar o passo com o fluxo à vista; ajuda que muda o
preenchimento escrita sob o campo, não em tooltip; campos em 3 camadas (essencial, opcional recolhido, execução à
parte); dado de etapa anterior como etiqueta com etapa e campo; passo incompleto marcado no nó com a ativação
bloqueada; e o "+" de adicionar no próprio fluxo. O Spaceflow faz o contrário em 4 delas: ajuda só no "?",
obrigatório marcado como erro ao abrir, chave crua no campo e card sem resumo nem pendência escrita. Quase tudo se
corrige com rótulo, ajuda, ordem e destaque, sem função nova.

### Temas

| # | Tema | Onde aparece | O que muda no Spaceflow |
|---|---|---|---|
| 1 | **Informação que decide o preenchimento fica escondida** | NN/g ("Don't use tooltips for information that is vital to task completion"); Carbon e GOV.UK pedem texto sob o campo; no develop, quase toda ajuda está só no "?" | Instrução de 1 frase sob todo campo; o "?" fica para a explicação longa e para cada opção |
| 2 | **Botão sem texto não é achado** | NN/g pede rótulo visível no ícone; WCAG 1.4.11 pede 3:1 no controle; no develop, Adicionar nó, Salvar e o trilho são só ícone | "Adicionar nó" e "Salvar versão" com texto, no mesmo lugar; trilho e zoom com tooltip |
| 3 | **O card precisa dizer o que o nó faz e o que falta** | n8n e HubSpot montam o subtítulo do nó com a configuração; Zapier e HubSpot marcam o passo incompleto; o Twenty não faz nenhum dos 2 | Resumo de 1 linha no card; pendência com palavra ("Falta: Título da tarefa"); saídas com rótulo |
| 4 | **Ordem e agrupamento pela tarefa** | n8n ordena do escopo amplo ao estreito; Power Automate e n8n separam essencial, avançado e execução; Salesforce divide o e-mail em destinatário, remetente e conteúdo | Seções com título; o secundário recolhido com "opcional"; destinatário antes do corpo; campo dependente depois do campo de que depende |
| 5 | **Variável legível** | Zapier, Make e Twenty mostram a variável como etiqueta com etapa e campo e inserem por um botão no campo | Etiqueta "Contratante · Contrato criado"; botão {x} que abre Variáveis de entrada e insere com 1 clique; o arrasto continua |
| 6 | **Comportamento que surpreende vira aviso fixo** | n8n (info box), Twenty (aviso no formulário), Zapier (campo "Copy"); no develop, as surpresas estão só na documentação | Aviso curto onde a surpresa acontece: fallback das Rotas, laço da caixa de e-mail, Notificação que sai sem pendentes, cifrão no corpo do e-mail |

### Achados → oportunidades

| Achado | Oportunidade | Impacto | Esforço |
|---|---|---|---|
| A ajuda do develop está no "?"; 3 ajudas repetem o rótulo e 2 estão trocadas | Reescrever as ajudas e pôr a instrução sob o campo | Alto | Baixo |
| O card mostra a descrição genérica do tipo | Resumo de 1 linha montado do `data` do nó | Alto | Médio |
| Erro do card só no hover do "!" | Pendência escrita no rodapé do card e atalho "N nós com pendência" | Alto | Baixo |
| Obrigatório marcado como erro ao abrir | Asterisco no rótulo; vermelho só ao pedir para ver as pendências | Médio | Baixo |
| O modal abre como Modificado sem mudança | Comparar o rascunho depois que o editor normaliza o HTML | Médio | Baixo |
| "Campos da Ação" abre submodal "Mostrar Chaves" | Escolher campos na própria seção, com tipo e remover | Médio | Médio |
| Chave crua no campo | Etiqueta legível e prévia sob o campo de texto | Médio | Médio |
| Saídas sem rótulo no card | Rótulo em cada alça (Aprovado, Verdadeiro, rotas, Sempre) | Médio | Baixo |
| Status do fluxo escondido no trilho, em inglês | Selo "Ativo" na barra das abas | Médio | Baixo |

### Quem configura

| Perfil | Como trabalha | Do que precisa |
|---|---|---|
| Configurador de negócio (o foco) | Monta fluxo de área (contratos, compras) seguindo um exemplo | Rótulo do produto, instrução sob o campo, variável com nome legível, saber o que falta |
| Configurador técnico | Integra sistema (HTTP, webhook), escreve variável à mão | A chave técnica a 1 clique, nomes do protocolo (GET, URL, JSON), nada escondido atrás de linguagem leiga |

### Recomendações

1. **Alta:** instrução sob todo campo, ajudas reescritas, pendência escrita no card e resumo no card. São os 3
   temas com mais convergência e menos esforço.
2. **Média:** seções com opcional recolhido, nova ordem do E-mail e do CRUD, etiqueta de variável, rótulo nas saídas.
3. **Média:** botões do canvas com texto e status do fluxo na barra das abas.
4. **Baixa:** trocar modal por painel lateral (o n8n mantém os 2; pede teste com quem usa antes).

### O que ainda não se sabe

- Se o público prefere modal ou painel lateral: nenhuma fonte compara com usuário de negócio.
- O que fazem "Correspondência exata de horário" (Agendamento), os 4 formatos de corpo do HTTP e o Mesclar sem
  entrada obrigatória: a documentação não diz. As ajudas da proposta marcam isso como "confirmar com o time".

### Notas de método

- Pesquisa por documentação e código, sem abrir os produtos na tela: não há print de referência
  (`evidencias/ref-*.png`). As centrais do monday e do ClickUp devolveram HTTP 403; os rótulos deles vêm de trechos
  de busca.
- Os 5 obrigatórios (Notion, Twenty CRM, ClickUp, Monday, Pipefy) e 8 extras (n8n, Make, Zapier, Power Automate,
  HubSpot, Salesforce Flow, Retool Workflows, Windmill).

## Rodada 3: como os outros nomeiam "iniciar outro fluxo"

| Produto | Nome do passo | Passa dados? | Espera e devolve? |
|---|---|---|---|
| HubSpot | "Enroll in another workflow" | Não (inscreve o registro) | Não: o fluxo de origem segue |
| n8n | "Execute Sub-workflow" (antes "Execute Workflow") | Sim | Por padrão sim; a opção "Wait for Sub-Workflow Completion" desliga |
| Zapier | "Call a Sub-Zap" | Sim (entradas do Sub-Zap) | Sim: o Sub-Zap termina em "Return From a Sub-Zap" |
| Make | "Call a scenario" (subscenario) | Sim (scenario inputs) | Devolve com "Return output" |
| Power Automate | "Run a Child Flow" | Sim | Sim: o fluxo pai espera o filho |
| Salesforce Flow | "Subflow" | Sim | Sim: devolve as saídas do fluxo filho |

O nó do ENSPACE só dispara (documentação: "Este nó não é um subfluxo"), como o do HubSpot. Os nomes com "sub" e
"chamar" prometem passar e receber dado. Daí a recomendação "Iniciar outro fluxo" (detalhe no `DECISOES.md`, rodada 3).

Fontes: [HubSpot Community](https://community.hubspot.com/t5/Lists-Lead-Scoring-Workflows/QUESTION-What-is-the-behaviour-after-Workflow-Action-Enroll-in/m-p/556090) ·
[n8n docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflow/) ·
[Zapier Help](https://help.zapier.com/hc/en-us/articles/8496308527629) ·
[Make Help](https://help.make.com/scenario-inputs) ·
[Manuel Gomes, Run a Child Flow](https://manueltgomes.com/reference/power-automate-action-reference/run-child-flow-action/) ·
[Trailhead, Subflow](https://trailhead.salesforce.com/content/learn/modules/flow-build-logic/run-flow-within-flow)

## Relatório completo

Os 13 construtores de fluxo convergem em 6 decisões de tela. A configuração do passo abre num painel ancorado ao canvas, com o fluxo à vista. A ajuda que muda o preenchimento fica escrita sob o campo, e não num tooltip. Os campos se dividem em 3 camadas: essencial, opções avançadas e comportamento de execução. O dado de uma etapa anterior entra por um botão no próprio campo e aparece como chip com o nome da etapa e do campo. O passo incompleto ganha marca no nó, e a ativação trava até a pendência sair. O "+" de adicionar etapa fica no próprio fluxo, entre os nós e no fim. Quase tudo isso cabe no Spaceflow só com rótulo, ajuda, disposição e descoberta. Fica de fora o que mexe no motor: teste de etapa isolada, nova tentativa automática, fórmula, favoritos e IA que monta o fluxo. A melhoria de maior retorno é o resumo de 1 linha no cartão do nó ("Esperar 2 dias", "Enviar e-mail para Solicitante"): o n8n e o HubSpot montam esse resumo a partir da configuração, e o Twenty, a referência mais próxima do ENSPACE, não tem. Os produtos divergem em 2 pontos sem resposta definitiva: como marcar obrigatório e opcional, e se o contêiner é modal ou painel (o n8n testa os 2 ao mesmo tempo). Os rótulos de monday e ClickUp vêm de trechos de busca, porque as centrais de ajuda bloquearam a leitura direta, e nenhum dos modelos foi testado com o público do ENSPACE.

### Painel ancorado ao canvas substitui o modal em 6 dos 13 produtos

Zapier, Power Automate, HubSpot, Salesforce, Twenty e o workflow builder do monday configuram o passo num **painel lateral que deixa o fluxo visível**. O Zapier abre uma barra à direita com 3 abas na ordem do trabalho: "Setup" (app, evento e conta), "Configure" e "Test"; depois de publicado, as abas viram "App & event" e "Step details" ([Zapier Help](https://help.zapier.com/hc/en-us/articles/16722578092429)). O Power Automate abre o painel à esquerda, e o mesmo painel que lista as ações vira o painel de configuração depois da escolha. As abas seguem a natureza do ajuste: **"Parameters" para os campos, "Settings" para timeout, repetição e segurança, "Code View" para o JSON e "Testing"**. Um botão "Layout" alterna entre propriedades no cartão expandido e propriedades no painel, e a Microsoft recomenda o painel para fluxos grandes ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/flows-designer)). O HubSpot usa o painel esquerdo com "Save" no topo ([HubSpot KB](https://knowledge.hubspot.com/workflows/create-workflows)); o Salesforce, um "side panel" fechado com "Close" ([Trailhead](https://trailhead.salesforce.com/content/learn/modules/flow-build-logic/define-multiple-paths-in-a-flow)). No Send Email do Salesforce, desde o Summer '25, o painel se divide em 3 seções: destinatário, remetente e conteúdo ([Salesforce Ben](https://www.salesforceben.com/how-to-effectively-use-the-send-email-action-in-salesforce-flow-a-deep-dive/), fonte secundária).

O n8n é a exceção e mostra o custo de cada escolha. Ele abre, com clique duplo ou Enter, um **modal de 3 colunas: INPUT, parâmetros e OUTPUT** ([n8n, atalhos](https://docs.n8n.io/build/keyboard-shortcuts)). Desde a v1.113.0 testa, atrás de uma flag, um "focus panel" à direita do canvas para abrir menos o modal e manter o diagrama à vista, sem remover o modal ([fórum n8n](https://community.n8n.io/t/help-us-test-some-canvas-improvements/201703)). O modal serve a quem precisa ver o dado que entra e sai; o painel serve a quem precisa ver onde o passo está no fluxo. O Pipefy resolve a mesma tensão de outro jeito: uma tela de 2 colunas, com o evento à esquerda ("Every time...") e a ação à direita ("Do this..."), que se lê como frase de causa e efeito ([Pipefy Help](https://help.pipefy.com/en/articles/686823-automation)). O Windmill divide o passo em cabeçalho, editor e 3 abas: "Step input", "Test this step" e "Advanced" ([Windmill](https://www.windmill.dev/docs/flows/editor_components)).

O cabeçalho do painel tem o mesmo desenho nos produtos com código ou documentação detalhada. O Twenty mostra **ícone na cor da categoria, nome do passo editável no lugar (o placeholder é a categoria) e um rótulo pequeno com a categoria** ("Trigger", "Data", "Flow", "Human Input", "AI"). O nome salva com Enter, Tab ou clique fora, e Esc descarta ([Twenty, SidePanelWorkflowStepInfo.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/side-panel/components/SidePanelWorkflowStepInfo.tsx)). O Power Automate também deixa renomear a ação no topo do painel ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/flows-designer)). O nome editável tem uma função além da estética: é ele que torna legível a lista de dados agrupada por etapa, tratada adiante.

Para o Spaceflow, o modal atual cobre o fluxo e esconde a posição do nó. Trocar o modal por painel é mudança de disposição, sem função nova, mas tem custo de engenharia. A alternativa mínima mantém o modal e escreve no cabeçalho onde o nó está, por exemplo "Etapa 4 de 9, depois de Aprovação", junto do ícone, da categoria e do nome editável. Abas, quando existirem, seguem a divisão do Power Automate e do n8n: o essencial primeiro e o técnico numa aba à parte. Nós simples (Esperar, Unir, Fim) dispensam abas; um formulário único, como no HubSpot, basta.

### A ajuda que muda o preenchimento fica escrita sob o campo

As diretrizes de design e os produtos concordam: **o que a pessoa precisa para preencher fica visível sob o campo; o tooltip guarda só contexto extra**. A NN/g recomenda não pôr em tooltip nenhuma informação necessária para concluir a tarefa, como requisitos de campo ([NN/g, Tooltip Guidelines](https://www.nngroup.com/articles/tooltip-guidelines/)). O GOV.UK pede rótulo visível, hint para a ajuda que serve à maioria, hint de 1 frase curta e nenhum link dentro do hint, porque o leitor de tela não anuncia o link ([GOV.UK Design System](https://design-system.service.gov.uk/components/text-input/)). O Carbon chama o texto persistente sob o campo de forma preferida de ajuda e manda o estado de erro ou aviso tomar o lugar dele quando o estado muda ([Carbon](https://carbondesignsystem.com/components/form/usage/)). O placeholder nunca substitui o rótulo: some ao digitar, impede revisar o formulário e se confunde com valor já preenchido ([NN/g, Placeholders](https://www.nngroup.com/articles/form-design-placeholders/), estudo de 2014 revisto em 2018).

O n8n tem a hierarquia de ajuda mais completa entre os 13, com 5 tipos de papel definido. A **info box amarela** fica entre os campos, só para o essencial e com uso raro; o **hint** fica abaixo do campo; o **node hint** aparece nos painéis; o **tooltip** só entra quando acrescenta algo; o **placeholder** começa com "e.g." e mostra a entrada esperada ([n8n, Node UI design](https://docs.n8n.io/integrations/creating-nodes/plan/node-ui-design/)). A descrição de liga/desliga começa com "Whether...", e o texto usa o termo que o serviço usa na interface, nunca o da API, com 1 termo por conceito ([n8n, UX guidelines](https://docs.n8n.io/integrations/creating-nodes/build/reference/ux-guidelines/)). O Zapier exige ajuda com no mínimo 20 caracteres, sob o rótulo, em voz ativa, dizendo o que fazer e sem repetir o nome do campo ([Zapier Platform](https://docs.zapier.com/platform/build/add-fields)). A Microsoft fixa o título da ação em verbo e objeto ("Send an email"), o gatilho no formato "When a ___", até 80 caracteres e título diferente da descrição ([Microsoft Learn, string guidance](https://learn.microsoft.com/en-us/connectors/custom-connectors/connector-string-guidance)). O Power Automate contradiz o GOV.UK e o Carbon num ponto: põe a descrição do parâmetro dentro da caixa do campo, como placeholder ([Microsoft Learn](https://learn.microsoft.com/en-us/connectors/custom-connectors/connector-string-guidance)).

A microcopy do Twenty mostra o padrão aplicado nó a nó: **placeholder com exemplo concreto e hint que diz a consequência**. No "Create or Update Record", o campo "Unique fields" explica que o sistema compara esses campos, atualiza o registro se ele existe e cria um novo se não existe ([Twenty, UpsertRecord](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/components/WorkflowEditActionUpsertRecord.tsx)). No Classify, o campo "Name" diz que o nome serve para achar a resposta nos passos seguintes ([Twenty, Classify](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/classify-action/components/WorkflowEditActionClassify.tsx)). O n8n escreve a descrição de cada opção como efeito: no Switch, "Items will be ignored" e "Items will be sent to the extra, separate, output" ([n8n, SwitchV3](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Switch/V3/SwitchV3.node.ts)); no Merge, o hint de um modo é uma pergunta do usuário sobre usar os dados de 1 só caminho ([n8n, Merge](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Merge/v3/actions/mode/index.ts)).

O aviso fixo dentro do formulário fica para o comportamento que surpreende. No Wait do n8n, um aviso diz que a URL do webhook nasce na hora da execução e qual variável a guarda ([n8n, Wait](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Wait/Wait.node.ts)). No Form do Twenty, com gatilho que não é manual, um aviso diz que formulários foram feitos para gatilho manual e que, nesse caso, ele só aparece na execução ([Twenty, FormBuilder](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/form-action/components/WorkflowEditActionFormBuilder.tsx)). O Zapier tem um tipo de campo, "Copy", que não recebe dado e só mostra uma nota para avisos importantes ([Zapier Platform](https://docs.zapier.com/integrations/build/field-definitions)).

Na marcação de obrigatório, as fontes se contradizem. A Baymard manda **marcar os 2**, obrigatório e opcional; em 2021, só 14% dos sites do benchmark faziam isso, e a falta de marca gerou erro de validação e abandono em checkout ([Baymard](https://baymard.com/research-articles/required-optional-form-fields)). O Carbon manda **marcar a minoria** de forma consistente: "(optional)" quando a maioria é obrigatória, "(required)" quando a maioria é opcional ([Carbon](https://carbondesignsystem.com/components/form/usage/)). O próprio Zapier diverge entre o asterisco da central de ajuda e o "(required)" em vermelho da documentação de plataforma ([Zapier Help](https://help.zapier.com/hc/en-us/articles/8496257774221); [Zapier Platform](https://docs.zapier.com/platform/build/add-fields)); o Make põe o rótulo obrigatório em negrito ([Make](https://help.make.com/module-settings)). A Baymard mediu checkout de e-commerce; o Carbon fala de formulário de produto, que é o caso do Spaceflow. A regra do Carbon serve melhor aos nós com muitos opcionais, desde que a convenção seja uma só em todos os nós.

Para o Spaceflow em português, as regras se adaptam assim: caixa de frase em vez de Title Case; "ex.:" em vez de "e.g."; liga/desliga descrito com "Se..."; título do nó em verbo no infinitivo mais objeto ("Enviar e-mail", "Atualizar item"); hint de 1 frase que diz o efeito; e o termo que o usuário já vê no ENSPACE, não o nome do campo na API.

### 3 camadas tiram o técnico do caminho sem escondê-lo

Os produtos separam o formulário do passo em 3 níveis, com nomes diferentes. O Power Automate classifica cada parâmetro como "important" (sempre visível, primeiro), "advanced" (atrás de um menu) ou "internal" (escondido, com valor padrão) ([Microsoft Learn, OpenAPI extensions](https://learn.microsoft.com/en-us/connectors/custom-connectors/openapi-extensions)). O n8n abre o nó mostrando só recurso, operação e campos obrigatórios; os opcionais ficam numa coleção **"Options", em que cada opção só entra no formulário quando escolhida em "Add option"**, e o comportamento de execução ("Retry On Fail", "On Error", "Notes") mora na aba "Settings" ([n8n, Node UI design](https://docs.n8n.io/integrations/creating-nodes/plan/node-ui-design/); [n8n, Nodes](https://docs.n8n.io/workflows/components/nodes/)). O Make esconde atrás de "Advanced settings" os campos que pedem conhecimento técnico ([Make](https://help.make.com/module-settings)). O Twenty manda falha e nova tentativa para uma página à parte, "Node settings", com o aviso de ligar a repetição só em passos seguros de rodar 2 vezes ([Twenty, StepSettings](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/side-panel/pages/workflow/step/settings/components/SidePanelWorkflowStepSettingsContent.tsx)); no e-mail, CC, CCO e In-Reply-To só aparecem depois de "Advanced options" ([Twenty, EmailBase](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/components/WorkflowEditActionEmailBase.tsx)).

A NN/g dá o limite: **mais de 2 níveis de divulgação costumam ter baixa usabilidade**, e o botão de avançado precisa ficar visível e ter rótulo que diga o que está atrás ([NN/g, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/), artigo de 2006). O dropdown "Advanced parameters" do Power Automate novo, em que se marca cada campo para exibi-lo, obriga a pessoa a saber o nome do campo antes de vê-lo ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/modern-approvals)). Para o público semi-técnico, uma seção recolhível que mostra todos os opcionais ao abrir resolve melhor, com rótulo que nomeia o conteúdo ("Mais opções: cópia e resposta") em vez de "Mais opções" sozinho.

Dentro de cada camada, o campo dependente só aparece depois do campo de que depende. No n8n, ligar "Send Body" revela "Body Content Type", e a escolha revela "Specify Body" ([n8n, HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)). No HubSpot, marcar "Business days only" troca horas e minutos por dias, e a opção de usar a hora da propriedade fica **cinza, com motivo, quando a propriedade não tem hora** ([HubSpot KB, delays](https://knowledge.hubspot.com/workflows/use-delays)). O campo desabilitado com motivo ensina mais que o campo que some sem aviso. A ordem segue o escopo, do amplo para o estreito: o n8n ordena os obrigatórios por importância e escopo ([n8n](https://docs.n8n.io/integrations/creating-nodes/plan/node-ui-design/)), e o Update Record do Twenty pede objeto, depois registro, depois "Fields to update", e mostra só os campos escolhidos ([Twenty, UpdateRecord](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/components/WorkflowEditActionUpdateRecord.tsx)).

Nos nós de lógica, 2 padrões ajudam o leigo. O primeiro é a condição em grupos: o Pipefy aplica E dentro do grupo e OU entre grupos ([Pipefy Help](https://help.pipefy.com/en/articles/781403-how-to-set-up-automation-conditions)), e o n8n admite que a interface lida mal com E e OU misturados e recomenda oferecer "tudo E" ou "tudo OU" ([n8n](https://docs.n8n.io/integrations/creating-nodes/plan/node-ui-design/)). O segundo é o seletor que se lê como frase: o Delay do Twenty e o Wait do n8n chamam o seletor de "Resume", com opções do tipo "numa data" e "depois de um tempo" ([Twenty, Delay](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/delay-actions/components/WorkflowEditActionDelay.tsx); [n8n, Wait](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Wait/Wait.node.ts)). O gatilho manual do Twenty tem uma frase que muda com a escolha e diz o efeito, por exemplo que o registro selecionado segue para o fluxo ([Twenty, TriggerManual](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-trigger/components/WorkflowEditTriggerManual.tsx)).

### O dado de etapa anterior aparece como chip que diz etapa, campo e exemplo

Todos os produtos com documentação detalhada inserem o dado de uma etapa anterior por um **botão no próprio campo**, com uma lista agrupada por etapa e busca. O Zapier põe um "+" no fim do campo; o valor inserido vira uma **"pill" com ícone do app, número do passo, nome do campo em negrito e o valor de exemplo em cinza**. O valor cinza vem do teste, e o dado só anda num sentido: de etapas anteriores para a atual ([Zapier Help](https://help.zapier.com/hc/en-us/articles/8495924713997)). O Make abre o painel de mapeamento ao clicar no campo, insere o item como um bloco colorido e, ao passar o mouse no item mapeado, faz o módulo de origem pulsar no canvas ([Make, Mapping](https://help.make.com/mapping)). O Twenty põe um botão "{x}" na borda direita de cada campo, com título "Select Step" e busca em passos e campos ao mesmo tempo; a variável inserida vira chip com "x" para remover ([Twenty, VariablesDropdownSteps](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-variables/components/WorkflowVariablesDropdownSteps.tsx)). Sem variável disponível, o botão fica cinza e o tooltip explica que as variáveis vêm do gatilho e dos passos anteriores ([Twenty, VariablesDropdown](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-variables/components/WorkflowVariablesDropdown.tsx)).

Os produtos de negócio dão nome ao botão ou ao símbolo. O Pipefy chama de "Dynamic field" ([Pipefy Help](https://help.pipefy.com/en/articles/726710-dynamic-content)). O Notion usa `@` para propriedade, pessoa ou página e `∑` para fórmula, só em ações ([Notion Help](https://www.notion.com/help/database-automations)). O HubSpot abre um painel "Insert data" com um dropdown que escolhe a fonte ([HubSpot KB](https://knowledge.hubspot.com/workflows/add-data-variables-to-workflow-actions)). O Power Automate oferece 3 entradas: o raio azul do conteúdo dinâmico, o "fx" da expressão e a tecla "/" dentro do campo. O nome de cada valor junta etapa e saída, como "Responses Approver name" ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/flows-designer)). O Notion ainda oferece **atalhos prontos no destinatário, "Whoever triggered" e "Page creator"**, que resolvem o caso mais comum sem abrir a lista ([Notion Help](https://www.notion.com/help/database-automations)).

As ferramentas técnicas expõem a sintaxe. O n8n deixa arrastar um campo do painel INPUT para o parâmetro e escreve sozinho a expressão `{{ $json.campo }}`, com prévia imediata do valor calculado ([n8n, Data mapping](https://docs.n8n.io/data/data-mapping/data-mapping-ui/); [n8n, Expressions](https://docs.n8n.io/code/expressions/)). O Windmill dá 3 modos por campo (valor fixo, texto com `${...}` e expressão JavaScript) e só lista resultados anteriores **depois que o passo ou o fluxo foi testado** ([Windmill](https://www.windmill.dev/docs/flows/architecture)). Esse requisito trava o leigo, e o contraste com Twenty e HubSpot, que listam as variáveis antes de qualquer teste, mostra uma vantagem que o Spaceflow precisa manter.

O chip legível responde às 3 perguntas de quem não programa: de qual etapa vem, qual campo é e que valor chega. O caminho técnico (`{{node_3.output.x}}`) responde só à última, e só para quem lê código. As regras do Zapier completam o quadro: nunca pedir que a pessoa digite um ID e nunca pedir lista separada por vírgula ([Zapier Platform](https://docs.zapier.com/platform/build/add-fields)). O Twenty contraria a segunda regra no campo "To" do e-mail, que pede endereços separados por vírgula ([Twenty, EmailBase](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/components/WorkflowEditActionEmailBase.tsx)). No Spaceflow, mostrar a variável como chip "Etapa · Campo" é mudança de apresentação, desde que o editor já conheça a origem do dado; a expressão, se existir, fica no segundo nível.

### A maioria deixa salvar incompleto e trava só a ativação

Zapier, Power Automate e HubSpot **permitem salvar um passo incompleto, marcam a pendência no nó e bloqueiam a ativação**. O Zapier põe um ícone de aviso no canto superior esquerdo do passo e reúne os problemas no "Zap status" da barra esquerda; o Zap com campo obrigatório vazio não liga ([Zapier Help](https://help.zapier.com/hc/en-us/articles/8496199466125); [Zapier Help, editor](https://help.zapier.com/hc/en-us/articles/16722578092429)). O Power Automate responde ao salvar com check verde e a mensagem "Your flow is ready to go. We recommend you test it", ou com X vermelho e o erro também no cartão que o causou; o "Flow checker" fica na barra ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/flows-designer)). O HubSpot salva "Create task" sem detalhes, pinta de amarelo no minimapa a ação pendente e traz no alerta o link para revisá-la ([HubSpot KB](https://knowledge.hubspot.com/workflows/choose-your-workflow-actions)). Make e Notion seguem o modelo oposto: **barram o salvar** quando falta campo obrigatório ([Make](https://help.make.com/module-settings); [Notion Help](https://www.notion.com/help/database-automations)). O Notion ainda separa 2 momentos: o erro de configuração bloqueia o salvar, e a automação que quebra depois (propriedade apagada, conexão inválida) é pausada com aviso. Para fluxo longo montado aos poucos, o modelo de aviso no nó atrapalha menos que o bloqueio ao fechar o formulário.

A mensagem de erro segue regras parecidas nas 3 fontes que as publicam. O n8n pede que a mensagem traga o rótulo do campo e diga o que mudar, e manda evitar as palavras "error", "problem", "failure" e "mistake" ([n8n, UX guidelines](https://docs.n8n.io/integrations/creating-nodes/build/reference/ux-guidelines/)). O GOV.UK pede mensagem específica para cada estado, começando pelo verbo ("Enter...") ([GOV.UK](https://design-system.service.gov.uk/components/text-input/)). O Twenty escreve erros no próprio campo, como "Limit must be greater than 0." e "Broken field reference. Select the field again to fix this condition." ([Twenty, FindRecords](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/find-records-action/components/WorkflowEditActionFindRecords.tsx); [Twenty, FilterFieldSelect](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/filters/components/WorkflowStepFilterFieldSelect.tsx)). Sobre o momento, a Baymard mediu em 2024 que **31% dos sites não têm validação inline** e que validar durante a digitação irrita; o certo é validar ao sair do campo, tirar o erro na tecla que corrige e confirmar o que está certo ([Baymard](https://baymard.com/blog/inline-form-validation)). O Carbon separa **erro, que bloqueia, de aviso, que sinaliza risco sem bloquear** ([Carbon](https://carbondesignsystem.com/components/form/usage/)).

No teste, o mercado se divide em 2 grupos. As ferramentas técnicas testam cada passo sozinho: "Execute step" no hover do nó do n8n, com "Pin data" para fixar a saída ([n8n, Nodes](https://docs.n8n.io/workflows/components/nodes/); [n8n, Data pinning](https://docs.n8n.io/data/data-pinning/)); "Run this module only" no Make, com uma janela que separa o que foi enviado ("Input") do que voltou ("Output") ([Make](https://help.make.com/mapping)); "Test this step" no Windmill; "Run with previous blocks" no Retool ([Retool](https://docs.retool.com/workflows/guides/blocks)). O Zapier tem aba "Test" com "Test step", "Skip test", "Data in" e "Data out", e avisa que o teste executa a ação de verdade ([Zapier Help](https://help.zapier.com/hc/en-us/articles/8496257774221)). Os produtos de negócio testam menos: o Pipefy manda provocar o evento no pipe ([Pipefy Help](https://help.pipefy.com/en/articles/686823-automation)), o Notion não documenta teste, e o Twenty só tem aba "Test" nas ações técnicas, HTTP e código ([Twenty, HttpRequest](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/http-request-action/components/WorkflowEditActionHttpRequest.tsx)). O Power Automate testa o fluxo inteiro e marca cada cartão com check e tempo gasto; o conector pode trazer uma instrução de como disparar o gatilho no teste, como "To see it work, add a task in Outlook." ([Microsoft Learn, OpenAPI extensions](https://learn.microsoft.com/en-us/connectors/custom-connectors/openapi-extensions)).

Teste de etapa é função nova e fica fora do escopo do Spaceflow. Cabem 3 coisas: a instrução de como disparar no nó Início; um link "Ver última execução deste nó" no modal, se o histórico já existir; e a mesma palavra para erro e aviso no cartão e no modal.

### O canvas ensina pelo "+" no fluxo e pelo resumo no cartão

O "adicionar etapa" mora no próprio fluxo em todos os produtos com canvas. O Power Automate novo põe o **"+" entre as ações**; no designer clássico, "New step" ficava só no fim ([Microsoft Learn](https://learn.microsoft.com/en-ie/power-automate/classic-vs-modern-designer)). O n8n mostra no fluxo vazio um quadrado tracejado "Add first step" ([n8n, curso](https://docs.n8n.io/courses/level-one/chapter-1)). O Twenty usa "Add a Trigger" no fluxo vazio, "Add a step" no fim e "Insert action" na aresta ([Twenty, CreateStepElement](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-diagram/components/WorkflowDiagramCreateStepElement.tsx); [Twenty, Edge](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-diagram/workflow-edges/components/WorkflowDiagramDefaultEdgeEditable.tsx)). O monday mostra o "+" ao passar o mouse na linha entre 2 blocos ([monday support](https://support.monday.com/hc/en-us/articles/20598895919122-The-workflow-builder-features-and-capabilities), trecho de busca). O Retool abre "Add block" ao arrastar a partir de um bloco ([Retool](https://docs.retool.com/workflows/guides/blocks)).

O "+" e as ações do nó que só aparecem no hover têm um problema documentado. A NN/g recomenda rótulo visível em ícone, porque poucos ícones são universais e o hover não existe no toque ([NN/g, Icon Usability](https://www.nngroup.com/articles/icon-usability/), artigo de 2014); sem rótulo, o mínimo é tooltip, aberto também pelo foco do teclado ([NN/g, Tooltip Guidelines](https://www.nngroup.com/articles/tooltip-guidelines/)). O n8n tem uma barra de atalhos no hover do nó, e a comunidade pede mais botões nela porque abrir o nó para fixar a saída quebra o foco ([fórum n8n](https://community.n8n.io/t/add-pin-output-button-to-node-hover-shortcut-bar/298513)). A WCAG 2.2 exige **contraste de 3:1** para o que identifica o controle e seu estado e isenta só o controle desabilitado ([W3C, SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). Um botão discreto do Spaceflow que funciona e fica abaixo de 3:1 é falha AA, e parecer desabilitado sem estar é o pior caso.

O seletor de etapas agrupa por intenção. O Power Automate tem "Favorites", "AI Capabilities", "Built-in tools" e "By connector" ([Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/flows-designer)); o HubSpot agrupa por atrasos, ramificações, comunicação, CRM, IA e dados ([HubSpot KB](https://knowledge.hubspot.com/workflows/choose-your-workflow-actions)); o Twenty usa 5 grupos, "Data", "AI", "Flow", "Core" e "Human Input", **sem descrição por tipo** ([Twenty, SelectAction](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/side-panel/pages/workflow/action/components/SidePanelWorkflowSelectAction.tsx)). O Power Automate dá a cada ação título e descrição de 1 frase ([Microsoft Learn](https://learn.microsoft.com/en-us/connectors/custom-connectors/connector-string-guidance)). No n8n, escolher a ação já cria o nó com a operação selecionada, o que corta 1 passo ([n8n, Nodes](https://docs.n8n.io/workflows/components/nodes/)).

O cartão do nó separa os produtos. O n8n monta o **subtítulo a partir dos parâmetros principais** e pode exibir a nota do nó como subtítulo ([n8n, Node UI design](https://docs.n8n.io/integrations/creating-nodes/plan/node-ui-design/); [n8n, Nodes](https://docs.n8n.io/workflows/components/nodes/)); o Wait gera um texto de espera para o nó ([n8n, Wait](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Wait/Wait.node.ts)). O HubSpot define, por ação, um **modelo de resumo do cartão com os valores configurados**, como "Create widget {{widgetName}}", em vários idiomas, inclusive pt-br ([HubSpot Developers](https://developers.hubspot.com/docs/api/automation/custom-workflow-actions)). O Twenty mostra só ícone, categoria e nome, e a busca no código do diagrama não achou marca de nó incompleto ([Twenty, StepNode](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-diagram/workflow-nodes/components/WorkflowDiagramStepNodeEditableContent.tsx)). Nas arestas, o Twenty escreve "if", "else if" e "else" ([Twenty, getBranchLabel](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/workflow-actions/if-else-action/utils/getBranchLabel.ts)); o Salesforce transforma o nome de cada resultado da Decisão num caminho e nomeia o "Default Outcome", que roda quando nenhuma regra bate ([Trailhead](https://trailhead.salesforce.com/content/learn/modules/flow-build-logic/define-multiple-paths-in-a-flow)); o n8n deixa renomear a saída de fallback do Switch ([n8n, SwitchV3](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Switch/V3/SwitchV3.node.ts)). A biblioteca React Flow UI, base comum de canvas, traz componentes prontos para indicador de status no nó e handle com rótulo ([reactflow.dev/ui](https://reactflow.dev/ui)).

### Limites desta pesquisa

Nada foi visto na tela: todos os achados vêm de documentação oficial, código-fonte (Twenty e n8n) e, quando marcado, fonte secundária. Sem evidência visual: pesquisa documental, nenhuma tela foi aberta. As centrais de ajuda do monday e do ClickUp devolveram HTTP 403; os rótulos desses 2 vêm de trechos que a busca devolveu das páginas oficiais e precisam de conferência no produto antes de entrar num briefing. O layout atual do Retool Workflows e a largura dos painéis de todos os produtos ficaram sem fonte. Nenhuma fonte compara, com usuário de negócio, frase, 2 colunas, modal e painel lateral, e nenhuma mede o efeito do resumo no cartão. A tabela final marca "sim" sob a condição de que o dado já exista no editor do Spaceflow; esta pesquisa não abriu o Spaceflow para conferir.

### Conclusão

O corte entre ferramentas técnicas e de negócio passa pelo teste e pela sintaxe, e não pelo formulário. n8n, Make e Windmill testam cada passo e mostram a expressão; Pipefy, Notion e o Twenty nas ações de leigo não testam e escondem a sintaxe atrás de chip ou símbolo. O público semi-técnico do Spaceflow fica entre os 2, e a resposta coerente é adotar a apresentação das ferramentas de negócio (chip legível, frase, 3 camadas, ajuda escrita) em todo nó, e deixar o vocabulário técnico só nos nós cujo público é técnico, como HTTP e as configurações de IA. A segunda conclusão é sobre prioridade: o resumo no cartão e a marca de pendência com texto são as 2 lacunas que nem o Twenty preenche, e as 2 dependem só de dado que o nó já guarda. A escolha entre modal e painel é a única que pede teste com usuário antes de decidir, porque o próprio n8n mantém os 2.

### O padrão que todos seguem

- O "+" de adicionar etapa fica no próprio fluxo, entre os nós e no fim, com rótulo no fluxo vazio ("Add first step", "Add a Trigger").
- O passo tem nome editável no topo do contêiner, com o tipo como padrão.
- O rótulo é curto, no termo que o usuário já vê no produto, e a ajuda que muda o preenchimento fica escrita sob o campo.
- O técnico sai do caminho principal: opções avançadas recolhidas e comportamento de execução (erro, repetição, nota) em aba ou página à parte.
- O campo dependente só aparece depois do campo de que depende, em ordem do escopo amplo para o estreito.
- O dado de etapa anterior entra por um botão no próprio campo, numa lista agrupada por etapa, com busca, e só de etapas anteriores.
- O passo incompleto ganha marca no nó do canvas, e o fluxo não ativa com campo obrigatório vazio.
- O seletor de etapas agrupa por intenção ou tipo, com busca.

### O que nenhum deles faz

Na documentação e no código lidos:

- Nenhum escreve, dentro do contêiner de configuração, onde o nó fica no fluxo (posição e etapa anterior). Os painéis dependem do canvas visível; o modal do n8n cobre o canvas e não compensa.
- Nenhum documenta selo de pendência com palavra no nó. Zapier usa ícone, n8n usa triângulo, HubSpot usa amarelo no minimapa, e o Twenty não marca.
- Nenhum avisa, no próprio campo, o que acontece quando a variável chega vazia. O Pipefy diz isso na central de ajuda; o Zapier só no erro de execução.
- Nenhum mostra quais etapas seguintes usam a saída do nó aberto. O Make mostra a origem do dado (o módulo pulsa), nunca o destino.
- Nenhum põe uma frase-resumo da configuração no topo do formulário de um nó rico. O monday usa a frase como editor de regra simples; o Notion não gera frase-resumo.
- Nenhum mostra rótulo amigável e chave técnica lado a lado para público misto. O Salesforce gera o "API Name" a partir do rótulo, mas em campo separado.
- Nenhum publica teste com usuário que compare modal, painel lateral, 2 colunas e frase, nem que meça o efeito do resumo no cartão.

### Aplicação ao Spaceflow

| Padrão | Quem faz | Aplicável sem função nova | Onde |
|---|---|---|---|
| "+" visível entre nós e no fim, com rótulo "Adicionar etapa" no fluxo vazio | Power Automate, n8n, Twenty, monday | Sim | Canvas |
| Ações do nó com tooltip aberto também pelo teclado; ação principal com rótulo | NN/g; n8n (barra no hover) | Sim | Canvas |
| Ícone e borda de botão com contraste de 3:1 | WCAG 2.2, SC 1.4.11 | Sim | Canvas e modal |
| Seletor de etapas agrupado por intenção, título em verbo + objeto e 1 frase de efeito | Power Automate, HubSpot, Twenty | Sim | Canvas (seletor) |
| Escolher a operação já cria o nó ("Criar item", "Atualizar item") | n8n | Sim, se as operações já existem | Canvas (seletor) |
| Resumo de 1 linha no cartão, por modelo de tipo de nó | n8n, HubSpot | Sim, se o dado já está no nó | Canvas |
| Selo de pendência com texto ("Falta configurar"), não só cor | Nenhum (lacuna); Zapier e n8n usam ícone | Sim, se a validação já existe | Canvas |
| Rótulo nos ramos com o nome da regra e caminho "Nenhuma regra atendida" nomeado | Twenty, Salesforce, n8n | Sim | Canvas; nós Condicional e Rotas |
| Painel lateral com o fluxo visível no lugar do modal | Zapier, Power Automate, HubSpot, Salesforce, Twenty | Sim (disposição), com custo de engenharia | Modal |
| Posição do nó escrita no cabeçalho ("Etapa 4 de 9, depois de Aprovação") | Nenhum (lacuna) | Sim | Modal |
| Cabeçalho com ícone por categoria, nome editável e rótulo de categoria | Twenty, Power Automate | Sim | Modal |
| Rótulo visível, ajuda de 1 frase sob o campo, placeholder com "ex.:" | n8n, Zapier, GOV.UK, Carbon | Sim | Modal |
| Aviso fixo só para efeito que surpreende (espera, link gerado na execução, ação real) | n8n (info box), Twenty, Zapier ("Copy") | Sim | Nós Esperar, Aprovação, Formulário, Início por webhook |
| Descrição de opção que diz a consequência | n8n (Switch, Merge), Twenty | Sim | Nós Rotas, Unir, Roteador de IA |
| 3 camadas: essencial, "Mais opções" recolhido, execução à parte | Power Automate, n8n, Make, Twenty | Sim | Modal |
| Campo dependente aparece depois da escolha; desabilitado com motivo | n8n, HubSpot | Sim, se a lógica já existe | Modal |
| Uma convenção única para obrigatório e opcional | Carbon, Baymard (divergem no como) | Sim | Modal |
| Condição em grupos: E dentro, OU entre grupos, ou "tudo E / tudo OU" | Pipefy, n8n, Twenty | Sim, se a lógica já é essa | Nó Condicional |
| Seletor que se lê como frase ("Retomar: numa data / depois de um tempo") | Twenty, n8n | Sim | Nó Esperar |
| Variável como chip "Etapa · Campo", lista por etapa com busca, tooltip quando não há variável | Zapier, Make, Twenty | Sim, se o editor já conhece a origem | Modal (todo campo que aceita variável) |
| Atalhos "quem disparou" e "responsável do item" no topo do destinatário | Notion | Sim, se as variáveis já existem | Nós Enviar e-mail, Criar tarefa, Aprovação |
| Erro ao sair do campo, com nome do campo e o que fazer | Baymard, GOV.UK, n8n, Twenty | Sim | Modal |
| Erro (bloqueia) e aviso (não bloqueia) com a mesma palavra no cartão e no modal | Carbon | Sim | Canvas e modal |
| Salvar incompleto, publicar bloqueado, lista de pendências com link para cada nó | Zapier, Power Automate, HubSpot | Sim, se o bloqueio na publicação já existe | Canvas (barra superior) |
| Instrução de como disparar o fluxo para testar | Power Automate | Sim | Nó Início |
| Link "Ver última execução deste nó" | Make e Zapier (janela de entrada e saída) | Sim, se o histórico já existe | Modal |
| Frase-resumo da configuração no topo do formulário | monday (como editor), Twenty (frase dinâmica) | Sim | Modal (topo) |
| Frase-receita como único editor | monday | Não: não comporta corpo de e-mail, mapeamento longo nem HTTP | Nenhum |
| Teste de etapa isolada, dado fixado, resultado simulado | n8n, Make, Zapier, Windmill, Power Automate | Não | Nós HTTP e IA |
| Nova tentativa e continuar em falha | Twenty, n8n, Power Automate | Não, se o motor não tem | Modal (execução) |
| Expressão ou fórmula no primeiro nível | n8n, Power Automate, Notion | Não; se existir, vai para o nível técnico | Modal |
| Prévia das próximas execuções do agendamento | Twenty | Não, salvo se a tela já calcula | Nó Início agendado |
| Favoritos, mais usados, painéis fixados lado a lado | Power Automate | Não | Canvas |
| IA que monta o fluxo a partir de texto | monday, Notion | Não | Canvas |
| Nota visível no cartão do nó | n8n, Windmill | Não, se o Spaceflow não tem nota | Canvas |

# Pesquisa: centrais e construtores de agentes de IA

Mais de 30 produtos lidos em 2026-11-16: SaaS de trabalho, ERPs e plataformas corporativas, sistemas jurídicos e
construtores genéricos. Fonte: documentação e comunicados oficiais de cada fornecedor, com o link em cada linha. O
relatório inteiro (cerca de 10 mil palavras, com data de cada fonte) foi entregue à redatora junto deste protótipo.

**Sem evidência visual das referências:** a maior parte das telas exige conta paga ou login corporativo (Notion
Business, Agentforce, Copilot Studio, Harvey). A leitura foi pela documentação; nenhum print de concorrente entra aqui.

**Limites:** as páginas de ajuda do ClickUp e do monday.com devolveram 403; a pesquisa leu o trecho que o buscador mostra. O
Agent Builder e o Evals da OpenAI saem do ar em 2026-11-30 e ficaram só como contexto.

## As 5 referências obrigatórias

### Notion (Custom Agents)

Como resolve:
1. "Agents" no menu lateral lista os agentes; o "+" cria.
2. 3 portas: "Create with AI chat" (descreve e revisa o rascunho), modelo pronto ou "Create blank".
3. Cada agente tem as abas Chat, Activity, Insights e Settings (Instructions, Triggers, Tools and access, Model).
4. O admin limita os modelos em "Models Custom Agents can use". Agente com modelo desmarcado passa ao padrão.
5. Activity registra cada execução com passos e erros. Insights mostra créditos por execução.
6. Compartilhamento em 3 níveis: Full Access, Can Edit, Can View and Interact. Version history reverte.

Fonte: [Notion Help, Custom Agents](https://www.notion.com/help/custom-agents).

- **Serve:** a lista de modelos do admin com destino declarado; os 3 níveis de acesso; Activity e créditos por agente.
- **Não serve:** não pede confirmação antes de agir; o conhecimento é página concedida, sem arquivo fixo; auditoria só no plano mais caro.

### Twenty CRM

Como resolve:
1. O agente é um nó do workflow e usa os gatilhos do workflow.
2. Desde a v2.26.0, o nó fixa um modelo concreto na criação.
3. O agente só acessa o que o papel do usuário pode ver.

Fontes: [Twenty Docs, AI overview](https://docs.twenty.com/user-guide/ai/overview.md); [twenty v2.26.0](https://newreleases.io/project/github/twentyhq/twenty/release/twenty%2Fv2.26.0).

- **Serve:** o agente como nó de fluxo (casa com o Spaceflow); o modelo fixado, que não muda quando o padrão do servidor muda; a permissão herdada do papel.
- **Não serve:** não há central nem formulário documentados; sem aprovação, custo ou teste.

### ClickUp (Super Agents)

Como resolve:
1. "AI" > "Create Agent": descreve o agente; o construtor faz perguntas e monta o perfil. Há catálogo e agente em branco.
2. Perfil com Instructions & Skills, Triggers, Tools, Knowledge e Memory.
3. "All Agents" no AI Hub busca, filtra e ordena, inclusive por status e modelo.
4. Activity lista execuções; "Credits" mostra o custo, só para admin e gerentes do agente.
5. O agente aparece como usuário do workspace.

Fonte: [ClickUp Help, Create a Super Agent](https://help.clickup.com/hc/en-us/articles/37033397273111-Create-a-Super-Agent) (trecho do buscador).

- **Serve:** criação por conversa; filtros na central; custo visível para quem administra.
- **Não serve:** o modelo não se escolhe ("definido automaticamente", segundo o fórum oficial), o oposto da demanda 2.

### monday.com (AI Agents)

Como resolve:
1. "AI Agents" no menu, "+ New agent": descrever ou começar em branco.
2. Aba Profile com identidade (papel, avatar, cor), instruções, acesso a quadros e arquivos, ferramentas, skills e modelo.
3. Cada recurso é `READ` ou `READ_WRITE`. Skills da conta servem a vários agentes.
4. O agente nasce inativo. "Chats and activity" mostra cada execução com créditos.

Fontes: [monday Support](https://support.monday.com/hc/en-us/articles/38411699315346-Build-and-configure-your-AI-agent); [monday Developer, Agents](https://developer.monday.com/api-reference/reference/agents).

- **Serve:** confirma a Personalização do ENSPACE (papel, avatar, cor); leitura e escrita separadas por recurso; biblioteca compartilhada entre agentes (a forma da biblioteca de modelos de resposta).
- **Não serve:** sem limite de modelos pelo admin; sem rascunho; o "Undo" não desfaz o que o agente escreveu, só a confirmação antes resolve.

### Pipefy (AI Agents 2.0)

Como resolve:
1. Só o admin do pipe cria. Botão "AI Agents" no cabeçalho do pipe.
2. Passos: Create (nome e descrição obrigatória), Knowledge (pipe, documentos, texto simples) e Behaviors (gatilho e instrução).
3. "/" insere campo ou ação dentro da instrução.
4. Limites declarados na ajuda: 5 behaviors, 3 ações por behavior, 15.000 caracteres por instrução.
5. Logs com gatilho, ações e erros. 1 clique sugere uma instrução melhor.

Fonte: [Pipefy Help, Create an AI Agent 2.0](https://help.pipefy.com/en/articles/12526171-create-an-ai-agent-2-0).

- **Serve:** o concorrente mais próximo (SaaS de processos); o "/" de campo como base do modelo de resposta com campos; limites declarados na tela.
- **Não serve:** sem teste, versão, escolha de modelo nem custo; central por pipe, que fragmenta a gestão.

## Referências extras

| Produto | Como resolve, em 1 linha | Serve ao ENSPACE |
|---|---|---|
| [ServiceNow AI Agent Studio](https://www.servicenow.com/docs/) | Cada ferramenta do agente é Supervised (pede aprovação) ou Autonomous | O modo por ferramenta da demanda 1 |
| [Dust](https://docs.dust.tt/) | Nível de risco por ferramenta; no risco alto some o "não perguntar de novo" | "Confirmar e não perguntar de novo" só para o que grava |
| Microsoft Copilot Studio (roadmap RM570434) | Aprovar, aprovar para a sessão ou negar a ação; "Compare with" compara 2 execuções de teste | Cartão com 3 saídas; lista de modelos do admin |
| [Salesforce Agentforce](https://help.salesforce.com/) | Testar em Simulate (sem efeito) ou Live Test, com o rastro de cada passo; versões com rascunho | "Simular ferramentas que gravam", rastro, versões |
| [Claude (Anthropic)](https://support.anthropic.com/) | Por ferramenta: Always allow, Needs approval ou Blocked, com teto do admin; explica leitura integral × busca por trechos | Políticas do workspace; a diferença entre arquivo de referência e base de conhecimento |
| [Harvey Workflow Builder](https://www.harvey.ai/) | Até 50 arquivos de referência fixos no fluxo; bloco de redação com modelo | Arquivos de referência (demanda 3) |
| [Glean Agents](https://docs.glean.com/) | Preview ao lado do editor, com cada passo; variáveis no texto | Testar com rastro; campos no modelo |
| [Langdock](https://docs.langdock.com/) | Aprovação por ferramenta; "Switch model" quando o modelo sai do ar; modelos de arquivo | Destino declarado para modelo fora da lista |
| [n8n AI Agent](https://docs.n8n.io/) | Mostra a ferramenta e os parâmetros antes de aprovar | O cartão mostra os valores que o agente montou |
| [HubSpot Breeze](https://knowledge.hubspot.com/) | Run history com custo por execução; Clone de agente | Atividade com créditos; Duplicar |
| [Atlassian Rovo](https://support.atlassian.com/rovo/) | Recomenda no máximo 5 ferramentas por agente | Agente novo nasce sem ferramenta |

## O padrão que todos seguem

- **Criação com 2 portas que terminam no mesmo formulário:** descrever em linguagem natural ou partir de modelo pronto ou em branco. No protótipo: "Descrever o agente", 6 modelos e "Começar do zero".
- **O modelo pertence ao agente, e o admin limita a lista.** Destino declarado quando o modelo sai da lista. No protótipo: Modelo padrão, Modelos permitidos e Políticas.
- **Escopo explícito de ferramentas, com leitura livre e escrita sob aprovação.** No protótipo: aba Ferramentas, efeito de cada uma e o modo Pede confirmação ou Executa direto.
- **O agente age com a permissão de quem conversa.** No protótipo: aviso na aba Acesso.
- **Teste com rastro; operação com custo.** No protótipo: aba Testar com "Ver rastro" e a Atividade com créditos.
- **Compartilhamento em níveis:** usar, editar e administrar. No protótipo: aba Acesso (quem usa, dono, editores).
- **Versão publicada separada do rascunho.** No protótipo: "Salvar rascunho", "Publicar versão N" e a aba Versões.

## O que nenhum deles faz

Cada item virou parte do protótipo:

- **Comparar modelos lado a lado no teste**, com a mesma mensagem, tempo e créditos, e "Usar como padrão".
- **Preencher só os campos de um modelo de resposta aprovado**, com o realce do que foi preenchido e a correção campo a campo antes de copiar.
- **Editar os parâmetros antes de aprovar** (o destinatário, o assunto, a mensagem) e aprovar em seguida.
- **Mostrar o custo antes de executar** a consulta paga, no próprio cartão.
- **Dizer como o arquivo é lido** e avisar quando ele não cabe no contexto de um modelo permitido.
- **Mostrar uso e custo no card da central:** modelos no chat, ferramentas que pedem confirmação, conversas em 30 dias.
- **Deixar a pessoa trocar o modelo na conversa dentro do que o agente permite.** O mercado não deixa trocar; o ENSPACE já deixa e ganha a trava.

A Personalização (papel, abordagem, estilo, cor do BENI) é a parte em que o ENSPACE já está à frente: fica como está.

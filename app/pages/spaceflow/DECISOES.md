# Decisões: Spaceflow, configuração dos nós

## Rodada 1 · 2026-10-15

- **Pedido (literal):** a demanda inteira está no `BRIEFING.md`, primeira seção.
- **Fronteira:** muda o peso e o texto dos controles do editor, o card do nó, a paleta e o miolo dos modais dos 17
  nós. Não muda a casca, o lugar de nenhum controle, a moldura do modal (ENTRADA, SAÍDA, rodapé), os nós, os campos
  e as opções que cada nó tem, nem o que o nó grava.

### O editor

| Hoje | Proposta |
|---|---|
| Adicionar nó: botão redondo só com ícone, sem rótulo acessível | Mesmo lugar, com o texto "Adicionar nó" |
| Salvar: disquete pequeno com ponto | Mesmo canto, "Salvar versão" com a contagem de alterações; neutro quando está tudo salvo |
| Status do fluxo e versão só no popover do trilho, "active" em inglês | Selo "Ativo" e a versão na barra das abas; o popover continua |
| Trilho com 4 ícones sem rótulo | Os mesmos 4, com tooltip (Detalhes do fluxo, Identificação, Gatilho, Histórico) |
| Zoom com 6 botões de 26 px, nome só no `title` | Os mesmos 6, com 32 px e tooltip |
| Card com a descrição genérica do tipo | Tipo em cima, nome, **resumo de 1 linha** montado da configuração ("Quando um item de Contratos for criado", "GET api.receita…/cnpj/CNPJ", "Valor do contrato é maior que 100000") |
| Rodapé do card: OK, MODIFICADO, "2 ERRO(S)" e o motivo só no hover do "!" | "Configurado", "Modificado" ou **"Falta: Título da tarefa e mais 1"**, com a lista completa no tooltip |
| Saídas sem nome no card | Rótulo em cada saída: Aprovado e Rejeitado, Verdadeiro e Falso, as rotas e Sempre, as rotas da IA e Nenhuma |
| Abrir o nó: só duplo clique | O duplo clique continua; no hover aparece "Configurar" |
| Nada avisa quantos nós têm pendência | Atalho "N nós com pendência" no canto de cima, que abre o primeiro |
| Paleta: Triggers, Ações, I.A., Lógica e Controle, 1 grupo aberto por vez | Gatilhos, Ações, IA, Lógica e controle, Documentos, Integrações; vários abertos; a busca abre os grupos que acharam algo; descrição de cada nó em 1 frase de efeito |

### O modal (padrão de todos os nós)

1. **Cabeçalho:** ícone, nome do tipo, selo do grupo, a descrição de 1 frase e onde o nó está ("Depois de: Acima de
   R$ 100 mil?", "Saídas: Aprovado, Rejeitado"). Nenhum dos 13 produtos pesquisados diz isso no contêiner.
2. **Seções com título**, cada uma recolhível. O secundário vem recolhido e com o selo "opcional"; recolhida, a seção
   diz quantos campos estão preenchidos.
3. **Todo campo:** rótulo curto, asterisco quando obrigatório, instrução de 1 frase sempre visível embaixo e "?"
   com a explicação longa. Em dropdown, "?" por opção e a opção escolhida sem ✓, com fundo e semibold (padrão do
   `no-de-atraso`, rodadas 4, 5 e 9).
4. **Obrigatório não é erro ao abrir.** O rodapé diz "2 campos obrigatórios vazios" e leva ao primeiro; só então os
   campos ficam vermelhos. Dá para salvar incompleto, como hoje: o card mostra o que falta.
5. **Variável legível:** a variável sozinha num campo vira etiqueta "Referência · Contrato criado", com a chave no
   tooltip e editável num clique. No campo de texto, a chave continua no texto e uma prévia embaixo mostra
   "Aprovar contrato [Referência]".
6. **Inserir variável com 1 clique:** o botão {x} do campo abre Variáveis de entrada e marca o campo; clicar na
   variável insere. O arrasto do develop continua. O painel agrupa por nó, com ícone de tipo (texto, número, data).
7. **SAÍDA mostra o que o nó entrega** (decisão, motivo da rejeição, resposta da IA, campos da resposta HTTP) e as
   saídas do nó.
8. **Abrir e fechar sem mexer não é "Modificado".** O rascunho é comparado depois que o editor de texto normaliza o
   HTML. No develop, 7 nós abrem como Modificado e pedem confirmação para fechar.
9. **Campo de meia largura só com par.** Sem vizinho de meia largura, o campo ocupa a linha (rodada 10 do
   `no-de-atraso`).

### Os nós, campo a campo

Rótulos que mudam (os que não estão aqui ficaram como no develop, com ajuda nova):

| Nó | Hoje | Proposta |
|---|---|---|
| Início | Modo de Início: Manual, Ações de Itens, Webhook, Timer, Caixa de Entrada | **Iniciar por**: Manual, Evento em item, Webhook, Agendamento, E-mail recebido, todas com "?" |
| Início | Categoria de Referência · Ação de Gatilho (Criação, Atualização, Exclusão) | **Categoria** · **Quando o item for** (Criado, Alterado, Excluído) |
| Início | Título Dinâmico | **Título da execução**, numa seção "Execução" |
| Início, Webhook | Formulário (opcional, sem explicar) | **Campos recebidos**: "Use os mesmos nomes do JSON enviado. Só estes campos viram variáveis com nome." |
| Início, Webhook | URL e token fora do modal | **Endereço e segurança**: endereço e cabeçalho do token com Copiar, dentro do modal |
| Início, Timer | Periodicidade (Hora, Dia…), mês, dia, hora | **Frequência** (A cada hora, Todo dia, Toda semana, Todo mês, Todo ano), com cada campo só quando a frequência pede |
| Tarefa, Aprovação, Formulário | Definição da Tarefa · Nome da Tarefa · Conteúdo da Tarefa | **Tarefa** · **Título da tarefa** · **Instruções** |
| idem | Permissões e Responsabilidade da Tarefa (1 bloco) | **Responsáveis** (Responsável, Responsável alternativo, Colaboradores, Criador) e **Acesso e item** (Item vinculado, Quem pode ver), separados |
| idem | Atribuir a | **Responsável**, com troca entre membro e variável |
| idem | Tempo de conclusão: Tipo de prazo (Estático, Dinâmico), Cálculo do Tempo de Conclusão da Tarefa, Valor do Tempo de Conclusão da Tarefa, Tempo de Conclusão em dias úteis | **Prazo**: Contar a partir de (Criação da tarefa, Uma data) · Data de partida · Prazo e Unidade lado a lado · Só dias úteis |
| idem | Classificação da Tarefa: Pontos da Tarefa, Prioridade da tarefa | **Classificação** (opcional): Prioridade e Pontos lado a lado |
| idem | Habilitar Tarefa Externa | **Pessoa de fora** (opcional): Enviar a tarefa por e-mail |
| Aprovação | Nada sobre as saídas | Aviso: "Saídas: Aprovado e Rejeitado. Na rejeição, o motivo é obrigatório e fica na variável motivo_rejeicao." |
| E-mail | Provedor, Layout Base, Templates de E-mail, Assunto, Corpo, Para, CC, BCC… | **Destinatários** (Para, Cópia e Cópia oculta lado a lado, Responder para) · **Mensagem** (Modelo, Assunto, Corpo) · **Anexos** (opcional) · **Envio** (opcional: Provedor e Layout) |
| E-mail | Layout: Enspace, Sem Layout Predefinido / Empty | **Layout**: Padrão do ENSPACE, Sem layout |
| E-mail | Nenhum aviso sobre o corpo | "?" do Corpo: cifrão colado em número ou em & corrompe o texto no envio |
| Operações CRUD | Modo de Execução primeiro; Ação: Criar, Ler um item, Ler vários itens (desativado), Atualizar, Excluir | Categoria, depois **Operação**: Criar item, Buscar um item, Buscar vários itens (Em breve), Alterar item, Excluir item; Modo de execução numa seção "Execução" |
| Operações CRUD | Campos da Ação: "+" que abre o submodal "Mostrar Chaves" | **Campos**: "Adicionar campos" na própria seção; cada linha com ícone do tipo, valor e remover |
| IA Geradora | Instrução de sistema · Prompt | **Prompt** primeiro · **Regras fixas** (é a instrução de sistema, dito no "?") · Modelo e Criatividade numa seção recolhida |
| IA Geradora, IA Roteadora | Criatividade da resposta: campo de número | **Criatividade**: régua de 0 a 2 com "Previsível" e "Criativo" nas pontas |
| Agente de IA | Raciocínio → "Thinking (raciocínio)… Vazio = padrão do provedor" | **Raciocínio**: Padrão do modelo, Desligado, Baixo, Médio, Alto, com "?" |
| IA Roteadora | Rotas → "Defina pelo menos 2 rotas" | Cada rota com **Nome da rota** (vira o rótulo da saída) e **Quando usar**; linha fixa "Nenhuma rota se aplica" |
| I.A. Extrair | Importar arquivos · URLs de arquivos · Dados de contexto | **IA Extratora** · **O que extrair** (nome, tipo, o que procurar) · **De onde ler**: Arquivo do fluxo, Arquivo fixo, Texto |
| Condicionais | Ramo Ou antes de Ramo E; regra só no "?" | **Todas estas** (E) antes de **Pelo menos uma destas** (OU); a regra escrita embaixo e muda com "Basta um dos grupos" (antes "Separar Ramos") |
| Condicionais, Rotas | Operadores com símbolo | "é igual a", "é maior que", "está preenchido"…; o valor some quando o operador não pede |
| Rotas | Fallback sem explicação | Aviso: todas as rotas atendidas seguem juntas, e a saída **Sempre** segue em toda execução |
| Mesclar | Rótulo para as linhas agregadas (Rótulo, Obrigatório) | **Entradas**: Nome da entrada e **Esperar** |
| Fim | Só o nome | Aviso: todo caminho precisa terminar num Fim |
| Requisição HTTP | Timeout (ms) | **Tempo limite**, numa seção "Avançado", com o padrão em segundos na ajuda |
| Requisição HTTP | Credencial sem o tipo | O tipo (Bearer Token, API Key, Basic Auth) ao lado do nome; "?" diz que credencial errada só falha na execução, com 401 |
| Requisição HTTP | Corpo: JSON Fields, JSON Body, JSON Builder, JSON Parameters | Os 4 com nome em português e o original entre parênteses, e "?" por opção |
| Requisição HTTP | Resposta: Chave do campo, Nome do campo, Caminho de origem | **Variável**, **Rótulo**, **Caminho na resposta** |
| Atraso | Quantidade de Tempo e Unidade | O modal aprovado no `no-de-atraso`, importado de lá sem mudança (pedido dela) |

### Por que assim

- **Instrução sob o campo:** NN/g, Carbon e GOV.UK; tooltip esconde o que decide o preenchimento.
- **Resumo e pendência com palavra no card:** n8n e HubSpot montam o subtítulo; nenhum dos 13 escreve a pendência.
- **3 camadas:** Power Automate, n8n, Make e Twenty; a NN/g limita a 2 níveis de recolher, e a proposta usa 1.
- **Rótulo meio-termo:** o mesmo registro do `no-de-atraso` (rodada 8): curto, técnico sem ser difícil. Os nomes de
  protocolo (GET, URL, JSON, webhook, prompt) ficam, para o usuário técnico.

### Chaves que o schema não tipa

O `data` do nó é `$loose`. Estas chaves aparecem na tela do develop ou na documentação, mas o schema não as nomeia;
o protótipo usa um nome provisório, para o time trocar pelo real: `backup_assignee` (Responsável alternativo),
`changed_fields` (Campos alterados), `mailboxes` (Caixas de e-mail), `template` (Modelo do e-mail), `body_type`
(formato do corpo HTTP).

- **Descartado:** painel lateral no lugar do modal. Motivo: muda a estrutura, que a demanda pede para manter.
- **Descartado:** testar o passo, nova tentativa, continuar em falha, criar nó com 1 clique na paleta. Motivo: função
  nova.
- **Descartado:** frase-receita (monday) como editor. Motivo: não comporta corpo de e-mail, mapeamento nem HTTP.
- **Não deu:** abrir os produtos de referência na tela; a pesquisa é por documentação e código, sem print.
- **Não deu:** abrir o "Iniciar Fluxo" (2º Início do canvas, tipo `start`); ele não está na paleta.
- **Não deu:** confirmar o que fazem "Horário exato" (Agendamento), os 4 formatos de corpo do HTTP e o Mesclar sem
  entrada obrigatória. As ajudas dizem "confirmar com o time".
- **Maquete:** abas Execuções, Versões, Comentários e Logs; setas de versão; auto-layout; arrastar nó dentro do
  canvas; ligar nó novo. "Salvar versão" só zera a contagem. O endereço do webhook é fictício. Arquivo escolhido em
  Anexos não sobe: entra só o nome. Recarregar volta ao começo.
- **CSS próprio:** nenhum `<style>`, `:deep()` ou `!important`. A grade do canvas usa `bg-[linear-gradient(…)]` com o
  token `--ui-border`, e o texto vertical de ENTRADA e SAÍDA usa `[writing-mode:vertical-rl]` (nenhum componente do
  Nuxt UI faz texto vertical). Posição de nó, aresta e alça vai em `style`, porque vem da coordenada do nó.
- **Crítica e acessibilidade:** skill `design:design-critique` e conferência pelo DOM.
  - Corrigido: rótulo das saídas no card passou de 11 px para 12 px (no zoom padrão ficava abaixo de 10 px).
  - Corrigido: a seção recolhida dizia "1 ✓"; agora diz "1 preenchido".
  - Corrigido: modal abria "Modificado" sem mudança por causa do editor de texto (o mesmo defeito do develop).
  - Conferido: nenhum botão sem nome acessível no modal; zoom com 32 px (WCAG 2.5.8 pede 24 px); o "?" do rótulo
    recebe foco e abre o tooltip pelo teclado.
  - Fica: o "?" dentro da opção de um dropdown só abre no hover (o mesmo achado do `no-de-atraso`); a instrução sob
    o campo cobre quem usa teclado.
  - Fica: "Configurar" aparece no hover e no foco do card; no toque, vale o toque duplo do develop.
  - Fica: o minimapa cobre parte do canto do canvas, como no develop.
- **Ver:** `/spaceflow` · `evidencias/proposta-01-canvas.jpg` a `proposta-12-escuro-espanhol.jpg` (canvas, variável
  na Aprovação, E-mail, CRUD, Condicional, HTTP, Início por evento, rotas da IA, paleta, pendências no card, Como é
  hoje, escuro em espanhol)

## Rodada 2 · 2026-10-15

- **Pedido (literal):** "ja deixe na tela um fluxo configurado com todos os nós pra facilitar a navegaçao de quem vai testar"
- **Mudou:** o fluxo de exemplo (os 17 nós, configurados) passa de 1 faixa de 3.800 px para 2 faixas: a de cima vai
  do Início ao Mesclar, a de baixo do CRUD ao Fim. A aresta que desce de uma faixa para a outra vai em cotovelo, pelo
  corredor entre as 2.
- **Mudou:** o editor abre com o zoom que mostra o fluxo inteiro (largura e altura do canvas). O botão "Ajustar à
  tela" faz a mesma conta.
- **Mudou:** o modal da Aprovação não abre mais sozinho ao carregar. A tela começa no fluxo; o nó abre pelo duplo
  clique, por "Configurar" ou por "Abrir nó" na barra do protótipo.
- **Maquete:** a posição dos nós é do protótipo; no produto, quem monta o fluxo decide.
- **Ver:** `/spaceflow` · `evidencias/proposta-13-fluxo-inteiro-na-tela.jpg`

## Rodada 3 · 2026-10-15

- **Pedido (literal):** "permissoes é interessante agrupar com resopnsaveis, do tipo: responsaveis e permissoes. nao?"
  e "perceba que faltou uma copisa: quando voce adiciona MAIS um no de inicio no fluxo ele se comporta diferente do
  nó de início colocado no começo. inclusive vale ver se ele deve se chamar mesmo início ou ter outro nome... talvez
  subfluxo ou algo assim. sugira e prototipe isso"
- **Mudou:** no bloco de tarefa (Aprovação, Tarefa, Formulário, CRUD manual e o nó novo), a seção vira
  **Responsáveis e permissões**: Responsável, Responsável alternativo, Colaboradores, Criador e Quem pode ver. O Item
  vinculado, que aparece dentro da tarefa, passa para a seção Tarefa. Some a seção "Acesso e item".
- **Mudou:** o 2º Início do canvas (tipo `start`) vira um nó próprio, **Iniciar outro fluxo**, no grupo Ações da
  paleta. O "Início" da paleta fica cinza, com "Já está no fluxo" e a frase que aponta o nó novo.
- **Mudou:** o modal do nó novo:
  - **Modo**: Automático (inicia o fluxo e segue sem esperar) ou Manual (cria uma tarefa em que a pessoa escolhe;
    este fluxo espera a conclusão), com "?" por opção;
  - **Fluxo** (Automático) ou **Fluxos para escolher** (Manual). A lista mostra todos os fluxos do workspace: os que
    não podem ser destino ficam cinza, com o motivo ("Inativo", "Início não é Manual");
  - o próprio fluxo aparece com "Este fluxo" e, escolhido, um aviso de laço;
  - aviso fixo: o fluxo iniciado começa do zero, não recebe as variáveis deste e não devolve nada; para mandar dado,
    Requisição HTTP para o webhook dele;
  - no Manual, as seções Tarefa, Responsáveis e permissões e Prazo.
- **Mudou:** card com tipo "Iniciar outro fluxo" e resumo ("Inicia Cadastro de fornecedor e segue"; no Manual,
  "Tarefa: escolher entre 3 fluxos"). O fluxo de exemplo ganha o nó, na Rota 2 do nó Rotas.

### O nome: Iniciar outro fluxo, não Subfluxo

| Nome | Onde se usa | Por que sim ou não |
|---|---|---|
| **Iniciar outro fluxo** (recomendado) | HubSpot: "Enroll in another workflow" | Diz o que acontece. É o único dos pesquisados que, como o ENSPACE, só dispara e segue |
| Subfluxo | Salesforce (Subflow), n8n (Execute Sub-workflow), Zapier (Sub-Zap), Make (subscenario), Power Automate (Run a Child Flow) | Nesses 5, o "sub" recebe dados e devolve resultado; quem conhece espera isso. A documentação do ENSPACE avisa: "Este nó não é um subfluxo" |
| Chamar fluxo | Zapier ("Call a Sub-Zap"), Make ("Call a scenario") | "Chamar" sugere resposta, pelo mesmo motivo |
| Iniciar Fluxo | Nome atual na documentação do ENSPACE | Na tela, o card diz "Início", igual ao gatilho. "Iniciar outro fluxo" desfaz a confusão com o Início |
| Disparar fluxo | Nenhum dos pesquisados | Possível, mas "disparar" é o verbo dos gatilhos no produto |

- **Fronteira:** muda o nome, o lugar na paleta e o modal do 2º Início. Não muda o que ele grava (`type`, `workflow`,
  `workflows` e o bloco de tarefa) nem a regra de quem pode ser destino.
- **Achado do develop:** a lista "Workflow" oferece o próprio fluxo como destino, sem aviso.
- **Achado do develop:** o 2º Início nasce em cima do primeiro, com a mesma descrição do gatilho ("Início del flujo.
  Defina el disparador de ejecución.").
- **Achado do develop:** o editor tem um lápis no hover do nó, sem texto; o "Configurar" da proposta é o mesmo atalho
  com rótulo.
- **Mudou:** o zoom de ajuste desconta a barra do protótipo, que em janela estreita quebra em 2 linhas.
- **Maquete:** a lista de fluxos do workspace é fictícia.
- **Ver:** `/spaceflow` · `evidencias/dev-12-dois-inicios-no-canvas.jpg` a `dev-15-iniciar-fluxo-manual.jpg` (develop)
  · `evidencias/proposta-14-iniciar-outro-fluxo.jpg` a `proposta-17-paleta-inicio-ja-no-fluxo.jpg`

# Decisões — Tela de entrada (Workspaces)

## A proposta em uma frase

A tela passa a **afirmar o que é** e a **ordenar por uso**, `Entrar` vira a ação primária,
`Criar workspace` desce para o rodapé com a consequência escrita — e o caminho de criação
começa perguntando a intenção, para devolver quem se enganou.

## Telas

| Rota | O que mostra |
|---|---|
| `/tela-de-workspaces` | Tudo: a tela de entrada, os cinco estados e a criação em camada |

Uma rota só, de propósito. No produto, escolher e criar acontecem na mesma tela — então no
protótipo também (rodada 2).

---

## As sete decisões, e por que cada uma

### 1. A tela ganha título e explicação

**"Escolha um workspace para entrar"** como `h1`, e abaixo: *"Workspace é o espaço da sua
empresa dentro do ENSPACE. Seu trabalho acontece dentro de um deles — esta tela só escolhe por
qual porta entrar."*

Hoje não existe `h1` nenhum (Briefing, trava #1). Sem rótulo, a pessoa projeta a intenção que
trouxe. A frase faz duas coisas de uma vez: define a palavra "workspace" e diz que esta tela
não executa nada, só escolhe.

### 2. Três exemplos do que se faz lá dentro

"Abrir e acompanhar chamados · Ver suas tarefas e prazos · Consultar dados e documentos".

É o que liga a tela ao que a empresa mandou a pessoa fazer. Quem veio abrir chamado lê
"abrir chamado" associado a **entrar**, não a criar.

### 3. "Continue de onde você parou" — a entrada de um clique

Um bloco destacado com o último workspace usado e um botão grande **"Entrar em Grupo Aurora"**,
com o nome dentro do rótulo.

É o atalho que resolve a esmagadora maioria das entradas, e é o que monday e Notion fazem
automaticamente (Pesquisa, padrão 1). Quando a pessoa tem um workspace só — o caso exato da
demanda — o bloco muda o rótulo para **"Seu workspace"** e a tela inteira vira uma porta só.

### 4. A lista deixa de ser grade de cards vazios

Vira lista em linhas, ordenada por uso recente, e cada linha diz algo: descrição **ou** número
de pessoas, mais "Você esteve aqui há 2 dias". `Sem descrição` desaparece.

Dezesseis cards grandes dizendo "Sem descrição" (trava #4) gastam a tela inteira sem informar.
Em linha, cabem mais, comparam-se melhor, e a mais provável fica em cima.

### 5. Convite pendente vira ação

Sai do card borrado e vira um aviso no topo: *"Rodrigo Petrone convidou você para Lumen
Contábil"*, com **Aceitar convite** e **Recusar**.

O que mais precisava de ação era o que menos parecia acionável (trava #6).

### 6. `Criar workspace` desce e passa a explicar a consequência

Vai do canto superior direito para o rodapé, depois de um separador, em botão `outline`, com o
texto: *"Criar um workspace abre um espaço **vazio**, com membros e configuração próprios.
**Não é aqui que se abre chamado** — para isso, entre no workspace da sua empresa."*

É a correção mais direta do erro relatado (trava #2) e o que os cinco de referência já fazem
(Pesquisa, padrão 2). A frase nomeia o engano em vez de torcer para que não aconteça.

### 7. A criação começa perguntando a intenção

`/criar` abre com **"O que você quer fazer?"** e duas escolhas: *"Abrir um chamado, pedir algo
ou enviar um documento"* ou *"Criar um espaço novo, vazio, para a minha equipe"*. Quem escolhe
a primeira é levado de volta com a explicação — e ainda pode insistir, se for mesmo o caso.

No formulário, um detector: se o Nome parecer assunto de chamado ("preciso", "solicito",
"acesso", "urgente", "férias"…), aparece o aviso *"Isso parece o assunto de um chamado, não o
nome de um espaço"*. E uma prévia mostra como o espaço vai aparecer na lista depois de criado.

**Nenhum dos oito produtos pesquisados faz isso** (Pesquisa, "o que nenhum deles faz"). Todos
apenas escondem o botão; se a pessoa achar, criam. Este é o pedaço original da proposta.

---

## A recomendação maior, que não cabe numa tela

**A melhor versão dessa tela é não existir.** monday, Notion e ClickUp levam direto ao último
espaço usado. Se o ENSPACE entrasse direto no último workspace — com o seletor virando um
*switcher* no topo —, a confusão relatada desapareceria por construção, porque a tela onde o
erro acontece deixaria de ser a porta de entrada.

Fica como recomendação de produto, não como protótipo: muda roteamento e sessão, não layout.
O protótipo entregue é a melhoria da tela **mantendo** a arquitetura atual.

---

## O que é maquete

Declarado conforme a regra 10. Nesta tela **não funciona de verdade**:

- **`Entrar`** — mostra um toast e não navega. Não existe "dentro do workspace" para ir.
- **Aceitar / Recusar convite** — muda a lista em memória; recarregar volta tudo.
- **`Criar workspace`** no fim do formulário — toast de sucesso, não cria nada.
- **Favoritar** — alterna e a aba Favoritos responde, mas some ao recarregar.
- **Barra superior** (ENSPACE, Suporte, avatar) — casca, só para dar contexto à tela.
- **Seletor de estados no rodapé** — andaime de protótipo, não é proposta de produto.

**Funciona de verdade** (é o que a proposta depende): busca, abas Todos/Favoritos/Recentes,
alternador card/lista, favoritar, ordenação por uso, a troca dos cinco estados, o desvio de
intenção dentro do modal, o preenchimento automático da referência, o detector de
nome-de-chamado, a prévia do card e todas as transições.

## Autocrítica

Rodada antes de entregar, e o que ficou de fora:

- **O texto explicativo é longo.** Três linhas no topo de uma tela que a pessoa vê todo dia
  viram ruído no quinto acesso. Uma versão futura deveria encolher depois da primeira semana —
  não implementei porque exigiria persistência, e protótipo aqui é 100% front-end.
- **"Não é aqui que se abre chamado" é uma negação.** Copy boa evita negar. Mantive porque o
  erro relatado é específico e caro, e nomear o engano funciona melhor que insinuá-lo. Vale
  testar a variante positiva: *"Para abrir chamado, entre no workspace da sua empresa."*
- **O detector de intenção erra.** Uma equipe chamada "Acesso e Identidade" dispara o aviso. É
  aviso, não bloqueio, e falso positivo custa uma linha lida — aceitei o custo.
- **Não testei com leitor de tela.** Contraste e foco seguem os tokens do Nuxt UI, mas a
  ordem de leitura do bloco "Continue de onde você parou" merece verificação.
- **Não implementei o estado "sem permissão"**, previsto na Fase 4. Não encontrei no develop
  uma tela de workspace sem permissão para usar de base, e inventar o comportamento seria
  desenhar regra de produto que não observei.

---

## Iterações

### Rodada 38 · 2026-10-30
- **Pedido (literal):** a redatora, "nao é um print por requisito. isso vai ser insano. é um print por grupo de
  requisito. se, por exemplo, os 5 primeiros requisitos puderem aparecer no mesmo print, ótimo. basta colocar as
  caixinhas no print com o texto com o ID do requisito pra dar pra compreender"; "confira se agora que no card a tabela
  de requisitos é escrita como LISTA, ainda permanece a indicaçao de quais sao necessarios, opcionais, importantes etc";
  e o sim para aplicar o mesmo a este card.
- **Mudou (repositório):**
  - 101 prints para 156 requisitos com tela, 1 por grupo de requisitos da mesma seção que aparecem na mesma tela;
    cada requisito tem a sua caixa magenta com o ID acima. O `evidencias/requisitos/grupos.json` diz o print de cada ID.
    Os prints de 1 por requisito que não servem mais saíram;
  - a legenda do `requisitos/epico.md` troca "sem parênteses, é Obrigatório" pela escala inteira de prioridade e de
    relevância.
- **Mudou (ENSPACE):** nas 10 tarefas do card `USEDB9945FD15ED4FA29BECA30882A4E`, os requisitos do mesmo print ficam
  juntos, com o print abaixo das caixas, e cada caixa termina com "(prioridade: X; relevância: Y)". A descrição do card
  recebe a legenda nova.
- **Não mudou:** nenhuma tela do protótipo e nenhum requisito.

### Rodada 37 · 2026-10-29
- **Pedido (literal):** o 2º retorno do dev, "cada checkbox de requisito deve ter abaixo um print mostrando o requisito
  em tela. ja tem o prototipo e ele deve continuar sendo citado no começo de toda task, pra facil referencia. e tambem
  deve continuar sendo citado na story"; e a redatora: "tem que deixar registrado que sempre vai fazer no final
  (printar requisitos) e deixar salvo la. essa regra deve acabar valendo tambem pra skill de prototipos."
- **Mudou (repositório):**
  - 156 prints, 1 por requisito e interface, em `evidencias/requisitos/<ID>.jpg`, com o destaque magenta no controle
    do requisito e sem a seta do mouse (156 ok no `detectar_seta_mouse.py`);
  - `requisitos/prints.json` diz a cena, os passos e o alvo de cada print. Ficam sem print, com o motivo na tarefa:
    RF309 (o login acontece antes desta tela), RF711 (o protótipo não amplia o print da galeria), RI601 e RI701
    (interface, sem tela);
  - `ferramentas/prints-de-requisito.mjs` tira os prints num Chrome sem janela; `ferramentas/tarefas_em_lista.py`
    põe cada requisito numa caixa da lista de marcar, com o print abaixo pelo endereço do GitHub;
  - a regra 42 e a seção "Protótipo aprovado: o card no ENSPACE" do `AGENTE_PROTOTIPOS.md`, e o passo 8 do
    `CLAUDE.md`. A skill `prototipo` lê a spec inteira, então a regra vale também para ela;
  - a lista de marcar nas tarefas sai do teste da rodada 36 e vira regra;
  - a legenda da Relevância no `epico.md` diz que, nas tarefas, ela vem entre parênteses no fim do requisito.
- **Mudou (ENSPACE):** as 10 tarefas do card `USEDB9945FD15ED4FA29BECA30882A4E` levam o print abaixo de cada caixa; o
  link do protótipo continua no começo de cada tarefa e na descrição do card, que recebe a legenda nova.
- **Não mudou:** os `.md` de `requisitos/` continuam em tabela, sem print.
- **Fora deste repositório, pendente:** a skill `requisitos` e o `requisitos_para_enspace.py` (`agentes-base`), que
  ainda geram a tarefa em tabela; a conversão fica no `tarefas_em_lista.py` daqui. O formato da lista de marcar no
  `en-api-docs`. Este agente não escreve lá.

### Rodada 36 · 2026-10-29
- **Pedido (literal):** o retorno do dev, "sera que nao é melhor, fazer os requisitos ali em uma lista simples? ou
  talvez a lista de tarefas, tipo [ ] O modal "Criar workspace" deve abrir na Central de casos de uso (…) as colunas de
  critério, prioridade e relevancia podem só estar ocupando muito espaço e aumentando a carga cognitiva"; e a
  redatora: "teste isso somente para as tarefas do item que estamos tratando. se funcionar bem, fica como regra que as
  TAREFAS sao escritas assim. nosso doc interno nao (gitub nao recebe em formato de lista)"
- **Mudou (ENSPACE):** as 10 tarefas do card `USEDB9945FD15ED4FA29BECA30882A4E` (24373 a 24380, 24388 e 24389) trocam
  as tabelas por linhas:
  - requisito e interface: 1 item da "Task List" do editor por linha, `<ID> <requisito>`, sem critério de aceite,
    prioridade e relevância. A 1ª gravação escreveu "[ ]" como texto, e o dev não marcava com 1 clique (correção da
    redatora, com print); a 2ª usa o HTML que o editor grava (`ul data-type="taskList"`, `li data-type="taskItem"`,
    copiado da tarefa 939 do mesmo workspace);
  - a relevância diferente de Obrigatório fica no fim, entre parênteses: "(desejável)";
  - regra de negócio e pergunta em aberto: `<ID> <texto>`, sem caixa; a pergunta leva "(quem responde: …)";
  - as 3 tabelas de decisão (opções de ordenar e texto do último acesso) continuam tabela;
  - os títulos das seções perdem o "(RF)", e o texto de cada tarefa cai para cerca de metade;
  - 2 parágrafos seguidos levam 1 linha em branco entre eles, o parágrafo vazio `<p></p>` do editor (regra da
    redatora, com print: "tem que pular uma linhazinha quando tiver fazendo quebra de paragrafo, sempre"). Os textos
    das 10 partes passam no lint de escrita sem aviso.
- **Fora deste repositório, pendente:** a regra da linha em branco no `agentes-base` (skill `manutencao-estrutural`)
  e o formato da lista de marcar no `en-api-docs`. Este agente não escreve lá, e a sessão aberta para isso foi
  barrada pela permissão do modo automático.
- **Não mudou:** os `.md` de `requisitos/` continuam em tabela; a descrição do card também.
- **Em teste:** vira regra só se a redatora aprovar o resultado. A conversão é um script da sessão sobre o HTML do
  `requisitos_para_enspace.py html`.

### Rodada 35 · 2026-10-29
- **Pedido (literal):** "mude a ordem da jornada na criaçao de workspace. a primeira coisa que deve aparecer é a
  galeria de casos de uso com a opçao de iniciar vazio, sem caso de uso. depois a pessoa define nome/ref/descriçao...
  as identificaçoes do workspace"; e, vendo o passo 2: "faltou um scroll nessa parte da modal, ta cortando as
  ifnormaçoes de callout na hora de preencher esses dados"
- **Mudou (passo 1, a Central de casos de uso):**
  - abre a criação, com o título "Como você deseja começar?";
  - "Começar do zero" (antes "Criar do zero") e "Usar {caso}" (antes "Criar com {caso}") não criam nada: levam ao passo 2;
  - o rodapé tem Cancelar, que fecha o modal, no lugar de Voltar.
- **Mudou (passo 2, a identificação):**
  - no topo, o quadro "Ponto de partida" mostra o caso escolhido ou "Workspace vazio", com o botão Trocar, que volta ao
    passo 1 e mantém o texto digitado;
  - depois vêm nome, identidade, descrição, referência e o callout do endereço, como antes;
  - o rodapé tem Voltar e "Criar workspace", que só aqui cria o workspace;
  - o modal para em 88% da altura da tela: os campos rolam, e o rodapé fica fixo.
- **Texto formal:** a ajuda do passo 1 troca "Dá para mudar tudo depois" por "Você pode alterar tudo depois".
- **Fronteira:** muda a ordem dos 2 passos da criação, o quadro do ponto de partida e a rolagem do passo 2; não muda a
  galeria, o detalhe do caso nem os campos da identificação.
- **Requisitos:** mudaram só depois da aprovação da redatora ("com isso feito, aprovado").
  - A parte 9 virou "9. Criar workspace, identificação" (`parte-9-criar-identificacao.md`): RF602, RF603, RF605 e
    RF612 falam da identificação; nascem RF622 (rolagem com rodapé fixo) e RF623 (criar e entrar); P601 reescrita.
  - Na parte 10, RF702, RF705 e RF709 descrevem a Central como 1º passo, com "Começar do zero" e "Usar {caso}", que não
    criam; RF714 volta à Central; nascem RF717 (Cancelar), RF718 (ponto de partida com Trocar) e RF719 (o caso traz o
    que mostra). RF715 saiu: o criar e entrar virou RF623.
  - O `epico.md` ganhou o texto novo do modal e das linhas 9 e 10.
- **Mudou (ENSPACE):** com o ok da redatora ("Atualizar e subir"), as tarefas 24388 ("9. Criar workspace,
  identificação") e 24389 ("10. Criar com caso de uso") do card `USEDB9945FD15ED4FA29BECA30882A4E` foram reescritas
  pelo `requisitos_para_enspace.py atualizar`; a leitura pelo MCP confere o nome e as tabelas novas. Depois, com o
  ok da redatora ("Atualizar descrição"), a descrição do card (`descricao_da_user_story`) recebeu o `epico.md` novo
  pelo `updateItem` do MCP; os outros campos do card ficaram como estavam.
- **Mudou (ENSPACE, depois):** a pedido da redatora ("atualize o card no enspace e as tarefas do item com base na ultima
  atualização dos documentos de requisitos"), a descrição do card ganhou o `epico.md` desta rodada (o modal em 2
  passos e as linhas 9 e 10), pelo MCP; as tarefas 24388 e 24389 foram gravadas de novo com o mesmo texto. As 10
  tarefas conferem com os documentos.
- **Ver:** `evidencias/rodada35-tarefa-10-no-card.png`

### Rodada 34 · 2026-10-29
- **Pedido (literal):** "Dividir a parte 7"
- **Por que:** pelo corte das partes da skill `requisitos`, a parte 7 juntava 2 funcionalidades (agrupar por licença,
  que funciona sozinho, e as etiquetas) e acendia o sinal de corte (29 linhas, mediana 17); o campo "Dependências" do
  card propõe avaliar um sistema de etiquetas reutilizável, e essa decisão não pode segurar o agrupar
- **Mudou (requisitos):**
  - "7. Agrupar" fica com o botão, a opção "Licença", os grupos recolhíveis, a tabela por grupo e a seção "Ocultos" no
    fim (11 linhas); depende de "2. Buscar e aceitar convite" (o grupo de convites) e de "6. Ocultos"
  - "8. Etiquetas" nasce com RN501, agrupar por etiqueta, a etiqueta no card, na lista e na busca, o item do "⋯" e os 2
    modais (19 linhas); depende das partes 2, 3 e 7
  - RF502 e RF503 deixam de citar a etiqueta, e a opção "Etiqueta" do menu Agrupar virou RF530, na parte 8
  - P502 nova na parte 8: sistema de etiquetas reutilizável ou modelo só desta tela
  - as partes 8 e 9 viraram 9 e 10. Os IDs não mudaram
- **Mudou (ENSPACE):** as tarefas 24379, 24380 e 24388 viraram 7, 8 e 9; a 24389 é a "10. Criar com caso de uso"; a
  descrição do card ganhou a tabela das partes nova
- **Fronteira:** muda a documentação e o ENSPACE; não muda nenhuma tela do protótipo
- **Ver:** `evidencias/rodada34-10-tarefas.png`, `evidencias/rodada34-tarefa-8-etiquetas.png`

### Rodada 33 · 2026-10-29
- **Pedido (literal):** "aplica a divisao, mas a regra de corte é menos sobre tamanho e mais sobre logica. tem que
  levar em consideraçao o tamanho, mas o corte deve continuar sendo, em primeiro lugar, funcional/logico"
- **Por que dividir a parte 1:** 37 linhas de requisito contra a mediana de 16,5, em 7 seções; o objetivo dizia "Usa só
  o que a API já tem", e a P004 (o nome de quem convidou) pode pedir obra no back-end, segurando a base de que as partes
  2 a 6 dependiam
- **Mudou (requisitos):**
  - "1. Escolher e entrar" fica com cabeçalho, barra, card, lista e a tela sem workspace (19 linhas)
  - "2. Buscar e aceitar convite" nasce com a busca, o convite no topo, no card e na lista, e a P004 (21 linhas); busca
    e convite ficam juntos porque o RF021 os liga
  - o convite que estava na lista da parte 1 foi para a parte 2: RF039 inteiro, o selo (RF045, saído do RF037), a
    descrição "{quem} convidou você" (RF046, saída do RF038) e o clique na linha (RF047, saído do critério do RF040)
  - a contagem da aba "Todos" (RF024) perdeu as 2 condições que dependem da parte 2: "sem o filtro da busca" virou
    RF048, e "com os convites", RF049
  - as partes 2 a 8 viraram 3 a 9; dependem da nova parte 2 as de recentes, ocultos e agrupar, que usam a busca. Os IDs
    não mudaram
- **Mudou (ENSPACE):** as tarefas 24373 a 24380 seguem a nova ordem (1 a 8), a 24388 é a "9. Criar com caso de uso", e
  a descrição do card ganhou a tabela das partes nova
- **Fronteira:** muda a documentação e o ENSPACE; não muda nenhuma tela do protótipo
- **Virou regra:** skill `requisitos`, "Corte das partes": primeiro a lógica (1 funcionalidade por parte, base mínima,
  risco isolado), e o tamanho só pede outra leitura (sinal do `conferir_requisitos.py`)
- **Ficou para a redatora:** o sinal acusa a parte 7, Agrupar e etiquetas (29 linhas, mediana 17)
- **Ver:** `evidencias/rodada33-tarefas-renumeradas.png`, `evidencias/rodada33-tarefa-2-buscar-e-aceitar-convite.png`

### Rodada 32 · 2026-10-29
- **Pedido (literal):** "o que ta em vermelho nao precisa ser escrito. só enche o texto e dificulda a leitura do dev";
  "o texto da tarefa deve carregar todos os requisitos em si proprio"; "a story vai ser o doc de epico mesmo"; "o
  titulo da task o dev acha que "parte 1 de 8" fica muito grande. pode ser "1.", "2.", "3."" (retorno do dev sobre as
  tarefas da rodada 31)
- **Mudou (requisitos):** o épico e as 8 partes reescritos no formato novo da skill `requisitos`
  - cada parte abre por Objetivo, Depende de (só quando depende), Onde vale e Protótipo; título "<n>. <nome>"
  - saíram da parte: convenção, legenda da Relevância, link para o épico, Fora do escopo, Resumo e as tabelas de RI
    que só repetiam o RF ("a API deve guardar..."); a licença pelo `type` virou RF031, e o nome de quem convidou, P004
  - saiu o que o padrão de qualidade cobre: toast, carregamento, esqueleto, erro com "Tentar de novo", animação,
    nome acessível, medida e cor (RF009, RF023, RF027, RF029, RF034, RF035, RF041, RF042, RF044, RF219, RF305, RF306,
    RF604, RF701; RNF901 a RNF908 e RS901 a RS905 do épico; RS001 entrou no RF036). A numeração fica com o buraco
  - nenhum requisito cita ID de outra parte: a coisa se diz pelo nome
  - o épico: o que é, as partes (com a ordem), RN comuns, o bloco "Padrão de qualidade" e o que está em aberto; saíram
    a convenção dos IDs, a nota "proposta do agente" e a correspondência R1 a R126 (fica no git, commit `33d8a60`)
- **Mudou (ENSPACE):** a descrição do card `USEDB9945FD15ED4FA29BECA30882A4E` (`descricao_da_user_story`) é o épico, de
  45 KB para 9,6 KB; as 8 tarefas (24373 a 24380) ganham o nome "<n>. <nome>" e o texto novo, com as RN comuns que
  citam. A descrição anterior está guardada fora do repositório, na cópia de origem da manutenção
- **Fronteira:** muda a documentação e o ENSPACE; não muda nenhuma tela do protótipo
- **Virou regra:** skill `requisitos`, "O texto que o dev lê" e "Padrão de qualidade"; regra 41 da spec
- **Ver:** `evidencias/rodada32-tarefas-com-nome-novo.png`, `evidencias/rodada32-tarefa-4-se-basta.png`,
  `evidencias/rodada32-descricao-do-card.png`

### Rodada 31 · 2026-10-29
- **Pedido (literal):** "busque esse card no enspace e insira na aba de tarefas dessa user story os seus fragmentos. é
  como se a propria user_story fosse o epico e as tarefas dentro dela fossem as stories, as partes a fazer"
- **Mudou:** o card `user_story` `USEDB9945FD15ED4FA29BECA30882A4E`, que a redatora escreveu com R1 a R126, ganha 8
  tarefas, 1 por parte do épico, cada uma com os requisitos da parte
  - partes 1 e 2 pelo MCP (`createTask`); 3 a 8 pela REST (`POST /ws/tasks` com `item`), a pedido dela
  - cada tarefa diz quais R do card ela cobre, pela correspondência do épico
- **Fronteira:** muda só o ENSPACE; a descrição do card e as telas do protótipo continuam como estão
- **Virou regra:** regra 41 da spec, "Protótipo aprovado: o card no ENSPACE"
- **Ver:** `evidencias/rodada31-tarefas-do-card.png`

### Rodada 30 · 2026-10-29
- **Pedido (literal):** "como voce fragmentaria se fosse escrever como um épico?"; depois da análise, "Pode reescrever"
- **Mudou:** o `REQUISITOS.md` (R1 a R126) vira o épico `requisitos/epico.md`, com 8 partes
  - partes: escolher e entrar; menu, sair e excluir; recentes e favoritos; workspace padrão; ocultos; agrupar e
    etiquetas; criar (passo 1); criar com caso de uso
  - cada tabela ganha Prioridade e Relevância, as 2 propostas pelo agente
  - o épico guarda as regras comuns, os requisitos da tela inteira e a correspondência de cada R antigo com o ID novo
  - o filtro "Áreas" da Central segue a rodada 29 (RF704 e RF716), que o documento antigo não tinha
- **Fronteira:** muda só a documentação; não muda nenhuma tela do protótipo
- **Não deu:** juntar num lugar só os requisitos da Central de casos de uso, que se repetem em 3 protótipos. Por quê:
  pede decisão de produto (P902 do épico)

### Rodada 29 · 2026-10-20
- **Pedido (literal):** "aplica o mesmo menu de áreas no menu-lateral e tela-de-workspaces e poed commitar e dar push nesses 2"
- **Mudou:** o filtro "Áreas" da Central deixa de ser um popover montado à mão e passa a ser o `USelectMenu` múltiplo, igual ao da `galeria-de-casos-de-uso` (rodada 2 de lá, onde ela achou o "Selecionar tudo" "um botao aleatorio no meio de algo que é um dropdown")
  - a busca é a do próprio componente; cada área marcada ganha a marca de seleção na linha
  - "Selecionar tudo" e "Limpar" viram links no pé da lista, com a contagem ("2 de 8"); cada um se desliga quando não tem o que fazer
  - o botão mostra a quantidade marcada num selo; a lista continua aberta enquanto a pessoa marca
- **Fronteira:** muda só o menu de Áreas; não muda o resto da Central
- **Ver:** `evidencias/rodada29-areas-no-select-menu.jpg`

### Rodada 28 · 2026-10-20

- **Pedido (literal):** "esse botao ta confuso. como a label dele é "ocultos", parece que ao clicar esse "na
  lista" é uma lista de ocultos. ta contraintuitivo"; depois da sugestão, "e se o nome do botao for
  "visibilidade"? o resto concordo, pode aplicar"; "no formato lista nao deve ter botao de entrar, so os 3
  pontinhos de açao. uma das açoes pode ser entrar"; "as tags de workspace devem estar numa coluna separada aí no
  prototipo, pra ser possivel truncar e colocar popup com hover praa ver todas as etiquetas. imagina uma pessoa
  que vai criar 30 etiquetas e colocar isso tudo num workspace só?"
- **Mudou (Visibilidade):**
  - O botão "Ocultos" vira "Visibilidade", com ícone de olho e um contador de ocultos.
  - No painel, cada linha tem um botão de olho no lugar da caixa de marcar: aberto, aparece; riscado, oculto.
  - As seções ficam "Na lista" e depois "Ocultos", e o texto passa a ser "Clique no olho para mostrar ou ocultar
    um workspace. Você continua com acesso aos ocultos."
  - O toast de ocultar aponta para Visibilidade e para a seção Ocultos do fim da lista.
- **Mudou (lista):** sai o botão "Entrar"; "Entrar" vira o 1º item do "⋯" na lista. A linha inteira continua
  entrando. No card, o "⋯" não ganha "Entrar", porque o card já é todo clicável.
- **Mudou (etiquetas):**
  - Na lista, as etiquetas saem da coluna Workspace e ganham coluna própria, com 1 selo e "+N".
  - No card, até 2 selos e "+N".
  - Passar o mouse (ou focar) no "+N" abre um popover com todas (`_EtiquetasResumidas.vue`).
  - Cada selo tem no máximo 8rem, cortado com reticências.
  - No mock, o Grupo Aurora ganha 4 etiquetas, para mostrar o corte.
- **Fronteira:** muda o botão e o painel de visibilidade, a coluna de ações e as etiquetas; não muda o resto
  da lista nem o card.
- **Requisitos:** R34, R42, R47, R48, R50, R58, R63, R64, R66 e R67.

### Rodada 27 · 2026-10-20

- **Pedido (literal):** "quando for proprietario a opçao aí deve ser de deletar o workspace, aí no prototipo
  ao clicar deve indicar num toast que vai mostrar o mesmo modal de exclusao de workspace atual (quando tentamos
  excluir por dentro do workspace), pro dev saber o que fazer"; "os ocultos nao deve ter só um "Mostrar todos"
  deve ter algo tipo um chevron pra dar pra ver quais estao ocultos ali, abaixo do divider de ocultos, podem
  estar com aparencia esmaecida e um botao de tirar todos eles do oculto ou a opção de tirrar do oculto no menu
  especifico (3 pontinhos) do card de cada um dos ocultos (…) tambem atualize os requisitos com base nisso"; "pode
  ser um chevron mantendo tipo esse padrao os ocultos!"
- **Mudou (proprietário):** no "⋯", o último item vira "Excluir workspace" (lixeira, vermelho), no lugar do
  "Sair do workspace" desabilitado. No protótipo, o clique mostra o toast "Excluir {nome}" e "No produto, esta
  opção abre o mesmo modal de exclusão de workspace usado hoje dentro do workspace."
- **Mudou (ocultos):** o aviso centralizado do fim da lista vira a seção "Ocultos", depois de um divisor, no
  mesmo padrão dos grupos: chevron, ícone, nome e contagem, em cinza.
  - Começa recolhida; aberta, mostra os ocultos esmaecidos, como card ou linha, com "Oculto" no rodapé.
  - Cada oculto tem "Mostrar na lista" no "⋯"; o botão "Mostrar de novo" (ou "Mostrar todos de novo") fica na
    linha do divisor, à direita.
  - É um grupo a mais no fim: vale em cards, em lista e com qualquer agrupamento; some durante a busca.
- **Decidido:** Q1 do REQUISITOS (o proprietário pode sair?) fecha: não sai; exclui.
- **Fronteira:** muda o último item do "⋯" e o fim da lista; o painel "Ocultos" da barra continua.
- **Requisitos:** R59, R60, R61, R68, R69 e Q1.

### Rodada 26 · 2026-10-20

- **Pedido (literal):** "Endereço do workspace: enspace.io/fdgdf Não dá para mudar depois de criar. O nome,
  sim. TA RIDICULO ESSE TEXTO. ESCREVE DE MODO MAIS FORMAL"
- **Mudou (registro formal, nos 3 idiomas):**
  - callout: "Após a criação do workspace, a referência e o endereço não podem ser alterados. O nome pode ser
    alterado a qualquer momento.";
  - ajuda da Referência: "Gerada a partir do nome. Aceita apenas letras minúsculas, números e hífens.";
  - ajuda do nome, no mesmo tom: "É o nome que a sua equipe vai procurar na lista. Pode ser alterado depois."
- **Fronteira:** muda só o texto; o callout e os campos ficam onde estavam.

### Rodada 25 · 2026-10-20

- **Pedido (literal):** "o preview do endereço do workspace deve continuar aparecendo num callout logo abaixo
  do nome, como era antes, acredito. opine sobre. ou logo abaixo da ref. mas é bom botar em callout pra
  destacar pro user. o user nao entende que isso é definitivo, nao pode ser alterado depois, é url etc"; depois
  da opinião, "concordo".
- **Mudou:** o endereço volta como destaque, num callout logo abaixo da Referência (`UAlert` info suave, ícone
  de cadeado): "Endereço do workspace: enspace.io/{referência}" e "Não dá para mudar depois de criar. O nome,
  sim."
  - Abaixo da Referência, não do nome: o endereço vem da Referência, e o aviso de que é definitivo vale para
    ela. O texto de apoio do topo já diz que o nome dá para mudar; o callout fecha o contraste.
  - A ajuda da Referência encolhe para "Vem do nome. Só letras minúsculas, números e hífen." e deixa de
    repetir o endereço.
- **Mantido:** a Referência continua sem `*`, como pedido na rodada 24; o callout já chama a atenção.
- **Fronteira:** muda só o bloco da Referência no passo 1.

### Rodada 24 · 2026-10-20

- **Pedido (literal):** "essa tela tem o modal de criaçao com "descriçao e endereço". endereço deve se
  chamar "referencia" com help ou instruction explicando o que é, e os campos nao devem estar ocultos, só nao
  marcados com * de obrigatório (é o simbolo que usamos, um * vermelho ou um ! padrao nuxt)" e "alem disso,
  esse modal ta pessimo. olhe o protitpo de menu lateral em 2 niveis. veja como é feita a parte de casos de
  uso la (com cara de "lojinha"). deve ter essa aparencia. ajuste"
- **Mudou (passo 1):**
  - "Nome" ganha rótulo com o `*` vermelho de obrigatório, pela prop `required` do `UFormField`.
  - "Descrição" e "Referência" saem da seção recolhida "Descrição e endereço (opcional)" e ficam à vista,
    sem `*`.
  - "Endereço" passa a se chamar "Referência", o nome do campo no produto, com a ajuda "Identifica o
    workspace no endereço. Vem do nome; mude só se precisar. Endereço: enspace.io/{referência}". A caixa
    separada "Endereço do workspace" sai: o endereço agora vive na ajuda do campo.
- **Mudou (passo 2):** vira a Central de casos de uso, com a cara da central do protótipo `menu-lateral`
  (rodada 18 de lá, padrão da Central de modelos do ClickUp).
  - O modal cresce para 72rem e 88% da altura no passo 2; a prévia "Como vai aparecer na sua lista" fica só
    no passo 1.
  - Lateral com "Destaques" e "Do ENSPACE" e os filtros "Localidade" (Brasil marcado de início) e
    "Complexidade"; em cima, a busca e "Áreas".
  - A faixa "Prefere começar do zero?" com "Criar do zero" substitui o cartão "Começar do zero".
  - Cartões com a prévia desenhada a partir do conteúdo do caso, "Em destaque" e grupos por área.
  - O detalhe tem galeria, descrição, "O que vem junto", "Feito pelo ENSPACE", criado em, uso, localidade e
    o botão "Criar com {caso}".
  - Os "modelos" (Templates no produto) passam a se chamar "casos de uso", como no `menu-lateral`: são os
    casos do tipo workspace de lá, copiados para o `mocks.ts` desta pasta com a localidade. A prévia
    (`_PreviaDoCaso.vue`) também é cópia da de lá: protótipo não importa de outro.
- **Fronteira:** muda o modal de criação; a tela de entrada fica como estava.
- **Descartado:** "Do seu workspace" e "Adicionar ao workspace" da central do `menu-lateral`. Motivo: quem cria
  um workspace ainda não tem workspace de onde trazer caso de uso.
- **Não deu:** conferir pelo Chrome. Por quê: o Chrome não alcançou o servidor local desta sessão (página de
  erro); conferi no navegador embutido, que aqui não precisa de login, porque o protótipo não usa o develop.
- **Maquete:** criar só mostra o toast; nenhum caso é aplicado de verdade.
- **Ver:** https://pernalombr4.github.io/prototipos/tela-de-workspaces

### Correção · 2026-10-19 · cartões de modelo vazios na criação

- **Pedido:** corrigir o erro achado ao escrever os requisitos para o dev ("sim, quero").
- **Erro:** desde 2026-09-16 (commit `e5ba1ba`, a passagem para o SDK), o passo 2 da criação mostrava os
  cartões de modelo sem ícone, sem nome e sem descrição. O mock dos modelos usava `name`, `description` e
  `icon`; a tela e o tipo `Template` leem `nome`, `descricao` e `icone`.
- **Mudou:** os 3 modelos do `mocks.ts` voltam a usar `nome`, `descricao` e `icone`. Os cartões, a prévia e o
  botão "Criar com {modelo}" voltam a mostrar o modelo.
- **Fronteira:** muda só o dado dos modelos; a tela de criação fica como estava.

### Rodada 23 · 2026-10-19

- **Pedido (literal):** "esse botao na verdade deve ser pra mostrar os que tao ocultos, reverter a
  ocultaçao. altere isso e pode fazer commit e push pra main"
- **Mudou:** o botão do aviso no fim da lista ("1 workspace oculto") deixa de abrir o painel e desfaz a
  ocultação de uma vez: "Mostrar de novo" com 1 oculto, "Mostrar todos de novo" com mais de 1.
  - O toast confirma ("1 workspace voltou para a lista") e traz Desfazer.
  - Escolher um a um continua no painel "Ocultos" da barra.
- **Fronteira:** muda só esse botão; o painel, o menu "⋯" e os contadores ficam como estão.
- **Maquete:** em memória; o reload volta ao mock.

### Aprovado · 2026-10-14

- **Pedido (literal):** "pode publicar com status aprovado na tela de prototipos enspace"
- **Mudou:** o status do protótipo passa de "em revisão" para "aprovado" (`definePageMeta`); o card do
  índice mostra o selo verde. A versão aprovada é a da rodada 22.

### Rodada 22 · 2026-10-14

- **Pedido (literal):** "eu preicso de um boitao na base pra simular o caso em que nao ha etiqueta. e o
  botao só um (caso do chamado) deve se chamar "só um workspce""
- **Mudou:** o botão do andaime "Só um (caso do chamado)" vira "Só um workspace".
- **Já existia:** o botão "Sem etiquetas" entrou no andaime na rodada 21. Ele não aparecia no site porque a
  publicação falhou entre 21h10 e 21h23 (UTC): o build quebrou num commit de outro protótipo (`no-de-atraso`,
  rodada 11) e voltou no commit seguinte dele. A rodada 21 está publicada desde então.
- **Fronteira:** muda só o rótulo do andaime, que não é proposta de produto.

### Rodada 21 · 2026-10-14

- **Pedido (literal):** "simule um caso em que o cara não tem nenhuma etiqueta criada. quando ele poe pra
  agrupar o que aparece? pode tentar ver como outros sistemas lidam com isso tambem, mas normalmente é um
  "ungrouped" e tudo aparecendo junto. mas vai ter atalho pra criar etiquetas daí? como vai ser?"
- **Referência:** o Notion, agrupando por uma propriedade sem valor, põe tudo num grupo "No <propriedade>"
  e oferece "+ New group" no fim dos grupos. O ClickUp não tem grupo para o que não tem etiqueta; usa o
  filtro "Is not set".
- **Mudou (andaime):** estado novo, "Sem etiquetas": os mesmos 18 workspaces, sem nenhuma etiqueta criada.
  Voltar a "Vários workspaces" devolve as etiquetas do mock.
- **Mudou (agrupar sem etiqueta):** "Agrupar por: Etiqueta" mostra tudo num grupo só, "Sem etiqueta (17)".
  Acima dele, um aviso: "Você ainda não criou etiquetas. Etiquetas agrupam seus workspaces do seu jeito, e
  só você vê. Enquanto não houver nenhuma, tudo fica em "Sem etiqueta"", com o botão "Criar etiqueta".
  - No menu Agrupar, a opção Etiqueta avisa embaixo: "Nenhuma criada ainda".
- **Mudou (atalho de criar):** "Criar etiqueta" abre um modal com o nome e a lista de workspaces para marcar
  (com busca). O botão diz quantos levam a etiqueta ("Criar em 3 workspaces") e só libera com nome e pelo
  menos 1 workspace marcado: etiqueta sem workspace não teria grupo para aparecer.
  - Ao criar, a lista passa a agrupar por etiqueta e o grupo novo aparece; o aviso some.
  - Com etiquetas já criadas, "+ Nova etiqueta" fica no fim dos grupos e abre o mesmo modal, como o
    "+ New group" do Notion.
- **Mudou (botões):** "+ Nova etiqueta" e "Escolher o que aparece" (no fim da lista) saem com borda e ícone,
  pelo mesmo motivo das rodadas 18 e 20: como link, não pareciam clicáveis.
- **Fronteira:** muda o agrupamento quando não há etiqueta, o atalho de criar e os 2 botões; não muda o
  modal de etiquetas de um workspace (menu "⋯"), que continua igual.
- **Maquete:** a etiqueta criada vive em memória; trocar o estado do andaime ou recarregar zera.
- **Crítica e acessibilidade:** conferência à mão; as skills não rodaram. O modal usa `UFormField` com
  rótulo no nome e `UCheckbox` com o nome do workspace em cada linha.
- **Ver:** https://pernalombr4.github.io/prototipos/tela-de-workspaces (andaime: "Sem etiquetas")

### Rodada 20 · 2026-10-14

- **Pedido (literal):** "abriu! mas "Mostrar todos" nao parece um botao clicavel. só melhore isso."
- **Mudou:** "Mostrar todos", no painel de Ocultos, vira botão com borda e ícone de olho. Como link cinza,
  não parecia clicável; é a mesma correção do "Abrir sempre este ao entrar" na rodada 18.
- **Fronteira:** muda só esse botão; o resto do painel fica como está.
- **Ver:** https://pernalombr4.github.io/prototipos/tela-de-workspaces

### Rodada 19 · 2026-10-14

- **Pedido (literal):** "no agrupar por nao bote papel, e sim "licença"" e "nao da pra entender o que ta
  acontercendo quando clica em ocultos. pode ser um dropdown quando clica em ocultos com uma seleçao como
  se fosse um editor da visualizaçao, pra vc dar um check nos que vc quer que apareça de novo e em quais
  voce quer ocultar (…) como um editor de colunas ou visualizaçoes do notion por exemplo."
- **Mudou (licença):** "Agrupar por: Papel" vira "Licença", com o ícone de crachá. A coluna da lista que
  dizia "Papel" também vira "Licença".
  - Motivo: no schema, Proprietário, Full, Membro e Leitor são o `type` do membro (`owner`, `full`,
    `standard`, `viewer`). Papel é outro campo (`role`). O selo do card sempre mostrou a licença.
  - O campo do mock continua `papel`, com comentário explicando, para não mexer em 18 registros.
- **Mudou (editor de ocultos):** "Ocultos" abre um painel, como o de propriedades do Notion.
  - Título "O que aparece na sua lista" e a frase "Desmarque para ocultar. Você continua com acesso, e a
    busca ainda encontra."
  - Cada workspace com uma marcação: marcado aparece na lista, desmarcado fica oculto. Vale na hora, e o
    item troca de seção.
  - 2 seções, com contagem: "Ocultos" primeiro, porque quem abre "Ocultos" procura por eles; depois
    "Na lista". Dentro delas, ordem alfabética.
  - Busca no topo do painel e "Mostrar todos" quando há oculto.
  - O botão diz "Ocultos (1)" quando há oculto e "Ocultos" quando não há; antes ele sumia.
  - Convite pendente não entra no painel: ele se resolve aceitando ou recusando.
- **Mudou (lista):** os ocultos não aparecem mais misturados na grade com o selo "Oculto"; só a busca os
  encontra. O aviso do fim da lista ("1 workspace oculto") abre o mesmo painel, pelo botão "Escolher o que
  aparece".
- **Fronteira:** muda o rótulo do agrupamento e da coluna, e o controle de ocultos; não muda o menu "⋯"
  (que continua ocultando um por vez), as etiquetas, a busca nem o card.
- **Maquete:** o que se marca no painel vive em memória; o reload volta ao mock.
- **Crítica e acessibilidade:** conferência à mão; as skills não rodaram.
  - Cada linha é um `UCheckbox` com o nome do workspace como rótulo: o leitor de tela anuncia "marcado"
    ou "desmarcado".
  - Ficou sem correção: o painel abre por cima da barra de andaime do protótipo quando a tela é baixa.
    Isso só acontece no protótipo; o produto não tem essa barra.
- **Ver:** https://pernalombr4.github.io/prototipos/tela-de-workspaces

### Rodada 18 · 2026-10-14

- **Pedido (literal):** "no texto da base dos cards nao precisa da quantidade de membros, só do último
  acesso. pode colocar um símbolo de reloginho e colocar algo como "acessado há..." e o tempo. pro texto
  ficar mais direto"; "sobre as etiquetas, pode tentar copiar o clickup nos botoes de "agrupar por" e
  "Ordenar por" (…) ordenar pode ser do tipo: ultimos acessados, primeiros "criados" etc"; "no card de
  continue de onde parou o botao de abrir sempre este ao entrar nao ta parecendo um botão"; "tem que ser
  um pouquinho mais facil de achar os ocultos. pense como outros produtos normalmente fazem."
- **Mudou (rodapé do card):** uma informação só, com ícone: relógio e "Acessado há 2 dias" ("Nunca
  acessado" quando a pessoa nunca entrou). O número de pessoas saiu. O padrão mostra a casa e "Abre ao
  entrar"; o oculto, o olho cortado e "Oculto".
  - O mesmo texto vale na coluna "Último acesso" da lista e no bloco do topo.
- **Mudou (Agrupar e Ordenar, como no ClickUp):** o botão "Agrupar por etiqueta" vira 2 menus na barra
  da lista. Cada botão diz o que está valendo ("Agrupar: Papel", "Ordenar: Mais novos") e muda de fundo
  quando sai do padrão. O menu marca a opção escolhida.
  - Agrupar por: Nenhum, Etiqueta ou Papel. Por papel, os convites ficam num grupo próprio, no topo.
  - Ordenar por: Acessados por último (padrão), Acessados há mais tempo, Criados por último, Criados
    primeiro, Nome de A a Z. "Nunca acessado" vai para o fim nas 2 ordens de acesso.
  - Os grupos recolhem pela seta do título, como no ClickUp.
  - A ordem por criação usa o `created_at`, campo real do schema de `Workspace`, agora no mock.
- **Mudou (bloco do topo):** "Abrir sempre este ao entrar" vira botão com borda e ícone. Como link
  cinza, não parecia clicável. "Voltar a escolher ao entrar" segue o mesmo formato.
- **Mudou (ocultos):** botão "Ocultos (1)" na barra da lista, ao lado de Ordenar, que liga e desliga os
  ocultos na lista. Só aparece quando há oculto.
  - É o "Show closed" do ClickUp. O aviso no fim da lista continua, como o "Hidden teams" do Teams, que
    fica no fim da lista de times.
  - O toast de ocultar diz onde achar: "Para ver de novo, use Ocultos, ao lado de Ordenar."
- **Fronteira:** muda o rodapé do card, a barra da lista, o botão do bloco do topo e o acesso aos ocultos;
  não muda a busca, as abas, o menu "⋯", as etiquetas nem a criação.
- **Descartado:** uma aba "Ocultos" ao lado de Todos, Favoritos e Recentes. Motivo: a barra do ClickUp já
  tem o lugar desse controle, e aba nova competiria com as 3 que filtram por uso.
- **Descartado:** ordenar em mais de um nível ("+ Adicionar ordem" do ClickUp). Motivo: com 18 workspaces,
  1 critério basta.
- **Maquete:** agrupamento, ordem e grupos recolhidos vivem em memória; o reload volta ao padrão.
- **Crítica e acessibilidade:** conferência à mão; as skills não rodaram.
  - O título do grupo é botão com `aria-expanded` e nome "Recolher ou abrir Proprietário".
  - Os menus usam o item `checkbox` do `UDropdownMenu`, que o leitor de tela anuncia como marcado.
  - Não conferi a largura de celular: a barra quebra linha (`flex-wrap`), mas não vi a tela a 375px.
- **Ver:** https://pernalombr4.github.io/prototipos/tela-de-workspaces

### Rodada 17 · 2026-10-14

- **Pedido (literal):** sobre as 7 oportunidades da pesquisa de mercado: "1. impossivel fazer 2. legal
  3. impossivel 4. concordo 5. legal 6. impossivel 7. nao tem esse conceito, mas a pessoa poderia ter
  uma funcionalidade ali de tags pra ela mesma agrupar, talvez?" e "pode corrigir os erros tambem".
- **Mudou (erro 1):** o workspace do bloco "Continue de onde você parou" volta para a lista. Antes ele
  saía da grade, e buscar "grupo aurora" respondia "Nenhum workspace". É a regra 20: destaque soma, não
  substitui.
- **Mudou (erro 2):** os contadores batem com o que aparece. "Todos (7)" mostrava 6 cards e
  "Favoritos (2)" mostrava 1. Agora contam a lista sem os ocultos.
- **Mudou (erro 3, achado nesta rodada):** na lista, sem resultado de busca, o vazio aparecia 2 vezes
  (o do `EnTable` e o `UEmpty`). Fica só o `UEmpty`.
- **Mudou (oportunidade 4, busca):** a busca volta para o topo, onde o produto já a tem, logo abaixo da
  explicação. Ela diz quantos são ("Buscar entre seus 17 workspaces").
  - `/` e `Ctrl+K` (`⌘K` no Mac) focam a busca de qualquer ponto da página.
  - Enter entra no primeiro resultado e Esc limpa, como o produto faz hoje. A dica aparece embaixo do
    campo enquanto se digita.
  - Busca sem acento e por nome, endereço, descrição e etiqueta: "saude" acha "Aurora Saúde Homologação".
  - Enquanto se busca, o convite e o bloco do topo saem de cena, e a aba volta para Todos: o resultado
    sobe para logo abaixo do campo.
- **Mudou (oportunidade 2, workspace padrão):** "Abrir sempre este ao entrar" no bloco do topo e no menu
  "⋯" de cada workspace.
  - Com padrão, o bloco do topo passa a mostrar o padrão, com o rótulo "Abre direto quando você entra" e
    a frase "Na próxima vez que você entrar no ENSPACE, vai direto para Grupo Aurora."
  - "Voltar a escolher ao entrar" desfaz. O card do padrão diz "Abre ao entrar" na linha de baixo.
  - É o caminho para quem só abre chamado nunca mais ver esta tela, sem mudar o roteamento para todo
    mundo. Referência: HubSpot (fixar e "Set as default").
- **Mudou (oportunidade 5, ocultar e sair):** o menu "⋯" ganha "Ocultar da lista" e "Sair do workspace".
  - Oculto sai da lista e dos contadores, mas a busca ainda acha, com o selo "Oculto". No fim da lista,
    "1 workspace oculto · Mostrar". O toast de ocultar tem Desfazer. Ocultar o padrão desfaz o padrão.
  - Sair pede confirmação, porque é a única ação da tela que não se desfaz: "Você perde o acesso a tudo
    o que está lá dentro. Para voltar, alguém do workspace precisa convidar você de novo."
  - Referência: Teams (ocultar e sair de organização).
- **Mudou (oportunidade 7, etiquetas pessoais):** "Etiquetas" no menu "⋯" abre um modal com as
  etiquetas da pessoa para marcar, e um campo para criar outra. "Só você vê."
  - As etiquetas aparecem no card e na lista.
  - "Agrupar por etiqueta", ao lado do alternador card/lista, divide a lista em seções (Clientes,
    Internos, Testes, Sem etiqueta). Workspace com 2 etiquetas aparece nas 2 seções.
- **Mudou (mock):** de 7 para 18 workspaces, o volume da conta medida no develop (regra 34). Ganharam
  etiquetas, um workspace já oculto ("Treinamento interno 2025") e 2 de homologação. Campos novos
  `etiquetas` e `oculto` marcados como invenção do protótipo.
- **Mudou (lista):** na visualização em lista, selos e etiquetas descem para uma segunda linha da célula
  do nome; na mesma linha eles espremiam o nome até "L…".
- **Fronteira:** muda a busca (lugar e atalho), o bloco do topo (padrão), o menu "⋯" do card e da linha,
  as etiquetas e os ocultos; não muda a casca, o card, as abas, o alternador, o convite nem a criação.
- **Fronteira, estado "Só um":** com 1 workspace, não há busca nem lista. O bloco do topo é a única porta;
  a lista repetiria o mesmo card. O "Abrir sempre este ao entrar" continua lá: é o caso da demanda.
- **Descartado:** oportunidades 1 (pendências por workspace), 3 (selo de ambiente) e 6 (itens recentes
  de todos os workspaces). Motivo: a redatora avaliou como impossíveis.
- **Descartado:** renomear e apagar etiqueta. Motivo: o pedido é agrupar; gerenciar etiqueta fica para
  quando a ideia for aprovada.
- **Não deu:** a regra de quem pode sair. "Sair do workspace" fica desabilitado para Proprietário, com a
  explicação "Quem é proprietário não sai por aqui." Por quê: não observei no develop o que acontece
  quando o dono sai; a trava é suposição e precisa de confirmação de produto.
- **Maquete:** padrão, ocultos, saídas e etiquetas vivem em memória e o reload zera. No produto, o padrão
  vale no próximo login; aqui só muda o bloco do topo e mostra um toast.
- **Crítica e acessibilidade:** as skills `design:design-critique` e `design:accessibility-review` não
  rodaram nesta rodada; a conferência foi à mão.
  - O botão "⋯" tem nome acessível ("Mais ações de RH Aurora"); "Agrupar por etiqueta" usa
    `aria-pressed`; os 2 modais têm título e descrição.
  - O menu "⋯" fica sempre visível, não só no hover (rodada 11).
  - Ficou sem correção: a coluna do nome na lista ainda trunca nomes longos. O `EnTable` não aceita
    largura de coluna; a célula ganhou `sm:min-w-44`.
- **Verificação:** a janela do Chrome pintava 1 quadro por segundo nesta sessão, então as transições
  levavam segundos para assentar. Conferi a lógica pelo estado da tela e tirei as capturas depois de a
  transição terminar.
- **Ver:** https://pernalombr4.github.io/prototipos/tela-de-workspaces

### Rodada 16 — 21/09/2026 · contraste medido, e a régua consertada antes

A régua vinha antes da tela. A ferramenta de medir contraste compunha o fundo subindo pela
árvore até achar uma camada opaca, e decidia a opacidade lendo o texto da cor: se não
começasse com `rgba`, tratava como opaca. Com o tema em `oklch`, o navegador devolve
`oklab(0.31 0.02 -0.05 / 0.2)` para um `bg-*/20`. A subida parava no primeiro cartão e
compunha contra uma base branca fixa.

No tema claro o engano se escondia, porque o papel é branco mesmo. No escuro ele media texto
branco contra cinza claro: **37 reprovações, quase todas falsas** — incluindo todos os títulos
de cartão a "1,47:1". A opacidade agora sai de pintar a cor num canvas limpo e ler o quarto
canal, que funciona em qualquer notação, e a base vem do `color-scheme` em vez de ser branca
por decreto. Medido de novo: **2 reprovações no escuro**, não 37.

Vale como regra de método: *número que reprova a tela inteira é suspeito de ser da régua.*

**O que era meu, e foi corrigido:**

| onde | antes | depois |
|---|---|---|
| Rótulos do andaime e da barra simulada (`muted` sobre fundo tingido) | 4,18 a 4,46 | `text-toned`, 7,4 a 7,85 |
| Botão de idioma ativo (`soft`, cor da marca) | 2,56 | pela correção do tema, passa |
| Chip de estado ativo do andaime (cor cheia da marca) | 3,39 | neutro |
| Aba ativa do painel "Por trás" | 3,39 | neutro |
| Trechos de código nos documentos do painel | 4,18 (35 deles) | `--ui-text-toned` |
| Texto de apoio do construtor (`dimmed`) | 3,03 | `muted`, 4,77 |
| Iniciais na prévia do logo (fuchsia e teal a `-600`) | 3,34 e 4,18 | `-700`, 4,88 e 6,48 |
| Endereço gerado (`enspace.io/…`, cor cheia da marca) | 3,23 | `primary-700` |
| Descrição do cartão selecionado (fundo rosado por baixo) | 4,40 | `text-toned` |

Duas escolhas que **não** viraram correção. O quadrado colorido do card veste um ícone, e
ícone pede 3:1, não 4,5:1: a paleta lá continua no `-600`. E o ícone do estado vazio de
modelos, pelo mesmo motivo.

**O que sobrou é cor de tema, e não é decisão de protótipo:** os botões de cor cheia
(`Entrar`, `Criar um workspace`, `Continuar`, `Criar workspace`) dão 3,39:1 de branco sobre
`#FF04D1`; a aba ativa da lista dá os mesmos 3,39:1 de `#FF04D1` sobre branco; e `Tentar de
novo` dá 3,81:1 de branco sobre o `error` do tema. Nenhuma sai daqui: mexer nelas é decidir
sobre a marca, no `en-docs`, que este repositório só lê.

No tema escuro, depois de tudo: **zero reprovações**, na tela e no construtor.

### Rodada 15 — 16/09/2026 · tema e idioma, para o dev usar como referência

**Pedido:** todo protótipo passa a ter alternador de tema claro/escuro e de idioma entre
português, inglês e espanhol, *"pros devs poderem já usar como referência"*.

Virou a **regra 35**, e esta tela é a primeira a cumprir.

**O que entrou:**

- **`<ControlesDePrototipo />`**, componente compartilhado na barra de andaime: chave de tema e
  os três idiomas. Qualquer protótipo herda com uma linha.
- **`textos.ts` na pasta**, com a copy nos três idiomas num `Record<Idioma, …>` tipado. A tela
  inteira passou a ler de lá: 60 textos traduzidos, incluindo o construtor.
- O idioma escolhido alimenta o **`<EnApp locale>`** do `enspace-sdk-ui` no `app.vue`, então os
  componentes `En*` e o Nuxt UI trocam de idioma junto com a tela.
- Plural, data e contagem saem do dicionário (`haDias`, `pessoas`), não concatenados no
  template: é onde a tradução quebra primeiro.

**Por que os dois juntos:** o protótipo é o que o dev abre para implementar. Se ele só existe em
claro e em português, o contraste ruim e o rótulo estourado aparecem depois do código escrito,
que é o lugar mais caro de descobrir.

### Rodada 14 — 16/09/2026 · o seletor refeito pelo que o mercado faz

**Pedido:** *"ta ruim o seletor. veja como o mercado lida com isso."*

Fui pesquisar (Pesquisa, seção complementar). Notion, Linear, ClickUp e Jira convergem em cinco
coisas, e o meu seletor acertava **uma**.

| O padrão do mercado | O que eu tinha |
|---|---|
| Ninguém abre com a biblioteca inteira | Abria com 2.128 ícones em ordem alfabética |
| Cor é escolha explícita, de primeira classe | Cor era derivada do nome, sem a pessoa saber |
| Existe padrão de esforço zero: **cor + iniciais** | Não existia |
| Upload é caminho de primeira classe | ✅ já era |
| O nome sugere o ícone | ✅ já era |

**O seletor agora abre assim:**

1. **Cor primeiro**, cinco amostras da paleta da marca, valendo para os três modos. Começa
   sugerida pelo nome, e dá para trocar. Linear e ClickUp tratam cor assim.
2. **Três modos: Iniciais · Ícone · Imagem**, com **Iniciais como padrão** — as duas letras do
   nome sobre a cor, com a frase *"É o que a maioria dos workspaces usa. Não precisa escolher
   nada."* É o padrão do ClickUp e do avatar de iniciais do Jira.
3. **Ícone abre numa curadoria de 48**, agrupada pelo que o ENSPACE faz: empresa, pessoas,
   chamados, jurídico, finanças, operação, tecnologia, saúde. Cabe na tela sem rolar e resolve o
   caso comum em um clique. A biblioteca inteira continua lá, mas **atrás da busca** — que é o
   que Notion e Jira fazem.
4. **A grade virtualizada da rodada 13 não morreu**: ela agora é o resultado da busca, não a
   porta de entrada. Continua sendo o que aguentaria 50 mil.

**O que segue original.** Nenhum dos quatro busca por significado no idioma de quem usa — todos
buscam pelo nome técnico, em inglês. Aqui "balança", "chamado" e "caminhão" encontram, e é
exatamente o que o "Busca Avançada" do produto não faz.

**Correção de bastidor:** a biblioteca gerada ignorava os 219 *aliases* do Iconify, e
`building-2` e `file-signature` são aliases. Eles funcionavam em desenvolvimento e teriam
quebrado no site publicado. São 2.128 ícones agora, aliases incluídos.

### Rodada 13 — 16/09/2026 · o seletor de ícones no tamanho real da biblioteca

**Pedido:** *"quando o user clicar em adicionar ícone tem que renderizar melhor o seletor. isso
porque temos uma biblioteca com mais de 50 mil ícones. não dá esse modelo atual."*

Estava certo, e o erro é de método: **eu desenhei para o meu mock, não para o produto.** Como
o mock tinha 26 ícones em 6 categorias, uma caixa de 320 px com a lista inteira aberta parecia
resolver. Com 50 mil, esse desenho não é ruim — ele é impossível.

**O que mudou:**

1. **A biblioteca de verdade entrou.** O seletor agora lista os **1.909 ícones do Lucide** que
   existem offline neste repositório, lidos do pacote instalado e gerados em `icones.ts`. Não
   são 50 mil, e está escrito no arquivo que não são: o que o protótipo prova é o **padrão**
   que aguenta escala, não o número.
2. **Busca virou a navegação.** Campo com foco automático, e as categorias viraram **atalho**
   (chips que filtram), não a forma principal de achar. Com biblioteca grande, ninguém navega:
   procura.
3. **Busca em português, por significado.** O produto hoje só acha por slug em inglês — quem
   procura "balança" não acha nada, precisa saber que é `scale` (Briefing). Aqui cada ícone
   carrega sinônimos em PT-BR, e "balança", "caminhão", "chamado" e "remédio" encontram.
   Acento não atrapalha: "balanca" acha "balança".
4. **Grade virtualizada.** Só as linhas visíveis existem no DOM — umas 50 células de cada vez,
   em vez de 1.909. É o que permite rolar a biblioteca inteira sem travar, e é o mesmo
   mecanismo que aguentaria 50 mil.
5. **A tela diz onde você está**: "1.909 ícones na biblioteca" vira "23 ícones encontrados de
   1.909" ao buscar. E o vazio explica em vez de só sumir: *"Tente outra palavra, ou envie o
   logo da empresa na aba Imagem."*

**Detalhe de implementação que vale registrar:** o site é estático, então não existe servidor
para entregar ícone sob demanda. A biblioteca inteira precisou ir **embutida no bundle do
cliente** (599 KB, `icon.clientBundle.icons` no `nuxt.config.ts`). Num produto com servidor
isso não seria necessário.

### Rodada 12 — 16/09/2026 · o criar ganha destaque onde ele é a única saída

**Pedido:** no estado sem nenhum workspace, o botão do centro passa a ser rosa.

Faz sentido e não contradiz o resto. Nos outros estados, criar é secundário **porque existe
uma ação melhor**: entrar. No estado vazio não existe onde entrar, então criar deixa de ser
alternativa e vira a única saída que a tela oferece. Ação única pede peso de ação primária.

O botão do topo continua neutro nesse estado, e é assim que tem que ser: dois rosas na mesma
tela para a mesma ação tirariam o destaque um do outro.

### Rodada 11 — 16/09/2026 · a estrela sai do hover

**Pedido:** *"faça com que as estrelinhas de favoritar apareçam nos cards de workspace por
padrão, não só com hover"*

A estrela só existia no hover quando o workspace não era favorito. Agora ela está sempre lá:
**amarela** quando é favorito, **cinza-fraca** quando não é, e amarela ao passar o mouse.

Vale a autocrítica: esconder ação no hover é o padrão que eu já tinha criticado na regra 24 —
afordância que só aparece depois que a pessoa passa por cima não ensina que existe. Quem nunca
usou favoritos não descobriria que dá para favoritar, e a aba **Favoritos** ficaria zerada para
sempre, que é exatamente o que acontece no produto hoje.

Fica só nos cards. Na visualização em lista a estrela continua sendo **indicador**, não botão,
porque lá a coluna de ações já está ocupada por Entrar.

### Rodada 10 — 16/09/2026 · revisão de texto

Rodada só de copy: levantei os 40 textos visíveis da tela, propus, ela validou item a item.

**A correção que puxou o resto: duas palavras para a mesma coisa.** A tela dizia *workspace* o
tempo todo; o construtor dizia *espaço* — "Como esse espaço se chama?", "Um espaço vazio",
"o ícone do espaço". Grave justamente aqui, porque **o trabalho desta tela é ensinar a palavra
"workspace"**: ensinar e, no passo seguinte, usar outra palavra desfaz o que a tela acabou de
fazer. Padronizado em *workspace* no fluxo inteiro.

A única sobrevivente é a frase de definição do topo — *"Workspace é o espaço da sua empresa no
ENSPACE"* —, onde "espaço" é a palavra comum que **explica** o termo, não um segundo nome
para ele.

**O que mais mudou:**

| Onde | De | Para |
|---|---|---|
| Topo | *"…acontece dentro de um deles. Esta tela só escolhe por qual porta entrar."* | *"É dentro de um deles que o seu trabalho acontece."* |
| Convite | Aceite para **poder** entrar | Aceite para entrar |
| Busca vazia | …peça acesso a quem administra **o workspace** | Confira o nome. Se ainda não achar, peça acesso a quem administra **o ENSPACE** |
| Nenhum workspace | …abra o link **de lá** | …abra o link **que veio nele** |
| Tooltip do Criar | **Abre** um espaço novo e vazio para a sua equipe | **Cria** um workspace vazio, só com você dentro |
| Modelo vazio | ou **siga** do zero | ou **comece** do zero |
| Prévia | Como vai aparecer | Como vai aparecer na sua lista |

Três dessas são consistência, não estilo: a busca vazia agora usa a mesma frase do estado
vazio logo abaixo; o "comece do zero" casa com o rótulo "Começar do zero" da opção acima; e o
tooltip usa o verbo do botão que ele explica.

**Reprovado:** trocar *"Não foi possível carregar seus workspaces"* por *"Seus workspaces não
carregaram"*. Fica como está.

**Em aberto:** "Ver em cards" mantém o anglicismo, por falta de termo de casa melhor. E o
`Full` no meio de `Proprietário / Membro / Leitor` virou achado no Briefing — vem do produto,
não do protótipo.

### Rodada 9 — 16/09/2026 · a identidade sai de baixo do "opcional"

**Pedido:** *"esse construtor aqui ter todos os outros campos escondidos pode ser ruim, não? pelo
menos o ícone que é importante pras pessoas. e saiba que o ícone nem sempre é ÍCONE mesmo. pode
ser uma imagem. é logo de fato. a empresa pode querer botar a imagem."*

**Fui conferir o que faltava ver.** O botão **Busca Avançada** do campo Ícone abre uma gaveta
com a biblioteca inteira, cada ícone com o **slug técnico em inglês** embaixo (`3d-cursor`,
`accessibility-alt`) e um botão de copiar. A busca é por esse slug: quem procura "balança" não
acha nada. E **não há envio de imagem em nenhum ponto do fluxo** — está no Briefing.

**As duas mudanças:**

1. **A identidade voltou para a superfície, ao lado do nome.** Um quadrado clicável à esquerda
   do campo, mostrando o logo ou o ícone atual, com um lápis no hover. É o mesmo par que
   aparece no card depois — nome e identidade lado a lado —, e resolve o erro que eu tinha
   cometido: enfiar em "opcional" uma decisão que as pessoas querem tomar. **Descrição e
   endereço continuam recolhidos**, porque esses sim são secundários de verdade.
2. **O campo passou a aceitar as duas naturezas.** O popover tem duas abas:
   - **Imagem** — área de arrastar e soltar para o **logo da empresa**, com prévia, trocar e
     remover. É a lacuna que o produto não cobre hoje;
   - **Ícone** — a biblioteca, buscável **por nome e categoria em português** ("balança",
     "jurídico"), não por slug em inglês.

   O ícone sugerido pelo nome continua valendo como padrão: quem não decidir nada sai com algo
   coerente.

**Sobre o nome do campo:** a tela chama de "Ícone", e a minha regra é usar o nome que está na
tela. Mas aqui o nome está errado sobre a própria coisa — é a identidade do espaço, e a empresa
quer o logo dela. O protótipo propõe tratar como **logo ou ícone** e deixa a divergência
registrada, em vez de herdar o rótulo por inércia.

**O que é maquete:** a imagem enviada vive só nesta aba, por `object URL`. Não sobe para lugar
nenhum — protótipo é 100% front-end.

### Rodada 8 — 16/09/2026 · o card volta ao tamanho da rodada 6

**Pedido:** *"agora ta pequeno demais. pode voltar os cards pra como eram antes"*

Voltou. O card da rodada 6 está de volta inteiro: ícone no topo à esquerda, selo de papel e
estrela à direita, título, descrição, e o rodapé ancorado com `62 pessoas · há 2 dias` de um
lado e `Entrar →` do outro. Grade, espaçamento e skeleton voltaram junto.

**O que mantive da rodada 7:** a **cor de identidade por workspace**. Ela não tem nada a ver com
tamanho — é cor no fundo do ícone — e a reclamação era de dimensão. Se preferir sem, é um
comando.

**O registro que importa:** as rodadas 6, 7 e 8 desenham a faixa. ~150 px foi *"muito grande
com pouca informação"*; ~72 px foi *"pequeno demais"*; o acordo ficou no primeiro formato, com a
meta enxugada numa linha e a cor carregando o sinal que faltava. Não vale recomprimir — está na
regra 26, com o resultado do teste.

### Rodada 7 — 16/09/2026 · densidade (revertida na 8)

**Pedido:** *"cards continuam ruins. muito grande com pouca informação"*

Estava certo: ~150 px de altura para quatro informações, e a grade mostrava dois ou três
workspaces por tela. Para quem tem 18, isso é rolagem pura.

**O card virou uma linha, não um quadro.** Ícone à esquerda, conteúdo à direita, três linhas:
nome, descrição (uma linha, truncada) e uma meta única — `62 pessoas · há 2 dias · Full`.
Altura caiu de ~150 px para ~72 px. Onde cabiam dois cards agora cabem seis.

O que sumiu, e por quê:

- **o selo de papel virou texto na meta.** Badge é peso visual caro para um metadado que se lê
  de passagem;
- **o rótulo "Entrar" saiu.** Com o card inteiro clicável, a afordância virou **uma seta que
  entra da esquerda no hover** — custa zero altura e diz a mesma coisa. No clique ela vira
  spinner;
- **a altura mínima e o rodapé ancorado saíram** — eram da rodada 6, e alinhavam a grade ao
  preço de um buraco em todo card sem descrição. Agora cada card tem a altura do próprio
  conteúdo (`items-start`): a grade fica levemente irregular e não sobra espaço morto. Num card
  compacto, a irregularidade custa menos que o buraco.

**E entrou informação que não custa espaço: cor de identidade por workspace.** O fundo do ícone
recebe uma cor derivada da referência, dentro da paleta da marca — fuchsia, cyan, purple, teal
e space. Deliberadamente **fora das cores semânticas**: nenhuma delas significa erro, sucesso ou
alerta. É o que faz reconhecer o espaço de relance, sem ler o nome — o que Slack, Linear e
Notion fazem com o mesmo objetivo. Era a proposta 4 que tinha ficado para depois; entrou agora
porque responde direto ao "pouca informação".

O skeleton de carregamento encolheu junto, senão ele prometeria um card que não existe mais.

**Ainda na fila:** sinal visual de recência na borda dos usados nos últimos dias.

### Rodada 6 — 16/09/2026 · o card vira um alvo só

**Pergunta:** *"é interessante o card do workspace ter o botão de entrar já que ele é totalmente
clicável? e tem melhoria visual a propor nos formatos dos cards?"*

**Primeiro, um defeito meu:** o card **não era** clicável — só o botão. Mas levantava, mudava a
borda e acendia o "Entrar" no hover. Prometia clique e não entregava, o que é pior que qualquer
uma das duas opções.

**A decisão: o card inteiro vira o alvo, e o botão vira afordância.**

Não era o botão que sobrava — era ter **dois alvos visualmente diferentes para a mesma ação**.
A saída foi fundir:

- o título traz um `<a href="/w/{reference}">` que se estica por cima do card inteiro
  (`after:absolute after:inset-0`). Isso mantém HTML válido — nada de botão dentro de link —,
  deixa **um** item na árvore de acessibilidade, dá foco por teclado com anel visível no card
  todo, e faz clique do meio e botão direito funcionarem. No produto o `href` leva ao
  workspace; aqui o clique é interceptado;
- o "Entrar" deixou de ser `<button>` e virou **`Entrar →`**, rótulo com seta que anda no hover
  e vira `Entrando…` com spinner ao clicar;
- a estrela de favorito continua botão de verdade, acima do link com `z-10`;
- **o card de convite não virou link.** Ele tem duas ações de peso igual — Aceitar e Recusar —
  e nenhum destino óbvio. Card clicável só funciona quando existe **uma** ação principal.

**As correções visuais que vieram junto:**

1. **O papel subiu.** O selo *Proprietário / Full* saiu do rodapé, onde competia com a ação, e
   foi para o topo com a estrela. Papel é metadado, não ação — e o rodapé ficou inteiro para a
   afordância.
2. **A grade se alinhou.** Área de título com altura mínima e rodapé ancorado (`mt-auto`): os
   cards da mesma linha terminam na mesma altura, mesmo com nome de três linhas ao lado de nome
   de uma.
3. **O ritmo mudou.** Nome com mais peso, descrição em duas linhas no máximo, e a recência
   desceu para a linha de meta junto do número de pessoas: `62 pessoas · há 2 dias`.
4. **"Sem descrição" sumiu.** Era o que eu critiquei no produto e tinha reaparecido no meu card.
   Sem descrição, a linha simplesmente não existe — o espaço vazio conta a mesma coisa sem
   gastar texto, e a altura mínima segura o alinhamento.

**Ficou para uma próxima rodada**, porque são proposta de produto e não correção: **cor de
identidade por workspace** (derivada do nome, dentro dos tokens) para reconhecer o espaço de
relance, e **sinal visual de recência** na borda dos usados nos últimos dias.

### Rodada 5 — 16/09/2026 · SDK do ENSPACE

**Pedido:** usar o SDK do ENSPACE para os protótipos saírem de acordo com a estrutura que já
existe.

**O que mudou nesta tela:**

1. **O mock passou a ser tipado pelo schema real.** `mocks.ts` importa `Workspace` do
   `@be-enlighten/enspace-sdk-schemas` e monta em cima dele. Os campos viraram os de verdade —
   `name`, `reference`, `status`, `description`, `icon`, `members_count` —, e `id` virou
   número, como na API. O que o protótipo acrescenta (`papel`, `favorito`, `ultimoAcessoMin`,
   convite) está marcado com comentário dizendo de onde vem.
2. **A visualização em lista virou `EnTable`**, a listagem padrão do produto, em modo dumb:
   recebe `columns` e `rows`, e a navegação sai por `@row-click`. Os slots `#cell-{key}`
   mantêm o ícone, a estrela de favorito, o selo de convite e os botões. O card continua sendo
   o padrão — o alternador segue valendo.
3. **A raiz virou `<EnApp locale="pt-BR">`**, que abraça o `UApp` do Nuxt UI por dentro e provê
   locale e mensagens para os componentes `En*`.

**Descoberta que vale registrar:** o schema de `Workspace` tem `description`, `icon` e
`members_count` — ou seja, o card mudo cheio de "Sem descrição" na tela de hoje **não é falta
de campo no modelo**. O dado cabe; o produto só não pede nem mostra.

### Rodada 4 — 16/09/2026

**Pedido:** *"nao precisamos dessa parte aqui"* (a lista "Abrir e acompanhar chamados · Ver
suas tarefas e prazos · Consultar dados e documentos") *"e o convite, alem de aparecer no topo,
deve aparecer no card também como aparece hoje. no topo seria só um atalho"*

**O que mudou:**

1. **A lista de exemplos saiu.** O título e a frase abaixo dele já dizem que o trabalho
   acontece dentro do workspace; os três exemplos repetiam a mesma ideia e empurravam a lista
   para baixo.
2. **O convite passou a existir nos dois lugares.** O card volta para a grade — com moldura
   tracejada, ícone de envelope, o selo *Convite pendente*, quem convidou e os botões
   **Aceitar** e **Recusar** no lugar de *Entrar*. O aviso do topo continua, agora no papel que
   é dele: **atalho**, não substituto. Vale para as duas visualizações, card e lista, e o
   contador de "Todos" passou a incluí-lo.

**O que aprendi, e virou regra:** aviso em destaque **soma** ao lugar natural do item, não o
substitui — regra 20. Eu tinha tirado o card da grade ao promover o convite para o topo, e com
isso quem procurasse o convite onde ele sempre esteve não o encontrava mais.

### Rodada 3 — 16/09/2026

**Pedido:** *"na hora de criar workspace nao tem que ter opçao entre abrir chamado e ele. isso
nao tem nada a ver. a jornada só tem que ser suficientemente boa. ja viu como é a jornada real
de criar workspace? ja testou? (…) veja como é o form por completo antes de finalizar. e
replique ali de modo intuitivo e interessante, com boa hierarquia de decisoes e que seja ainda
BONITO"*

**Antes de mexer:** percorri a criação inteira no develop, sem finalizar. O que achei está no
Briefing, seção "A jornada real de criar um workspace". O resumo: três campos obrigatórios,
sendo um deles decoração escolhida numa árvore de categorias e exibida como `carbon:scales`; e
um segundo passo que abre ~4 s em branco para, no Brasil, responder "Não há dados".

**O que mudou:**

1. **A pergunta de intenção saiu.** Você tem razão: interceptar chamado no meio da criação
   misturava dois assuntos. A criação agora é só uma boa criação. O que resolve a confusão é a
   tela de entrada — que já diz o que é, onde o trabalho acontece e deixa `Entrar` como a ação
   de maior peso.
2. **Uma decisão por vez, na ordem em que a pessoa decide.**
   **1 de 2 — o nome:** campo grande, foco automático, e o endereço aparecendo embaixo como
   consequência (`enspace.io/juridico-aurora`) em vez de um campo obrigatório chamado
   "Referência".
   **2 de 2 — de onde partir:** "Começar do zero" como opção de primeira classe (não como
   ausência de escolha), com os modelos ao lado.
3. **Ícone deixou de ser obrigatório e deixou de ser uma árvore.** Ele é *sugerido pelo nome*
   — digitar "Jurídico Aurora" já traz a balança — e fica dentro de "Ícone, descrição e
   endereço — opcional", recolhido. Aberto, são seis ícones em destaque e um "Ver todos" com
   busca por nome e categoria. Em nenhum momento aparece `carbon:scales`.
4. **Prévia ao vivo, à direita.** O card muda enquanto se digita: nome, ícone, descrição. Ao
   escolher um modelo, aparece **"Já vem com"** listando o que ele traz — a consequência fica
   visível **antes** de confirmar, não depois.
5. **O vazio passou a explicar.** Em vez de "Não há dados": *"Nenhum modelo para essa
   localidade — escolha outra acima, ou siga do zero, você não perde nada."* E a Localidade
   virou chips de múltipla escolha, com o que está marcado à vista.
6. **Movimento.** Barra de progresso que avança, transição lateral entre os passos, o ícone da
   prévia girando ao trocar, "Já vem com" entrando em cascata, `loading` no botão ao criar.

**Também nesta rodada:** briefing, pesquisa e decisões entraram **dentro do site**, no rodapé
de andaime, em "Por trás" → *O problema · As referências · As decisões*. O conteúdo vem dos
próprios `.md` desta pasta, importados como texto — fonte única, sem cópia paralela.

**O que aprendi, e virou regra:** *percorrer o fluxo inteiro antes de redesenhá-lo*. Eu tinha
visto só o passo 1 e redesenhei em cima disso — regra 18 da Parte 6.

### Rodada 2 — 16/09/2026

**Pedido:** *"nao ta legal ter que clicar em 2 botoes diferentes no mesmo card (…) isso tem que
ser jornada unica (…) o botao de atalho pra criar um novo tem que continuar no topo (…) seu
prototipo ta mal elaborado. sem usar animaçoes nem nada (…) voce mudou a aparencia de cards
pra lista. nao pode mudar. se for pra ser lista, daí tem que adicionar botao pra alternar."*

**O que mudou:**

1. **Uma porta só.** A rota `/criar` foi apagada. A criação virou **camada sobre a própria
   tela**, com os mesmos três passos — intenção → desvio → formulário. No produto isso é um
   modal sobre a lista; agora o protótipo também é. E o índice da raiz passou a ter um card
   com **um** link por protótipo.
2. **O atalho de criar voltou para o topo.** Fica no canto superior direito, onde sempre
   esteve. O que mudou é o **peso**, não o endereço: `outline` neutro em vez de sólido, então
   o destaque visual da tela continua sendo "Entrar em …". Ganhou tooltip — *"Abre um espaço
   vazio. Não é aqui que se abre chamado."* A desambiguação forte segue no modal.
3. **Card voltou a ser o padrão**, com **alternador card / lista** ao lado da busca. A lista
   continua existindo porque é melhor para comparar muitos workspaces — mas como escolha de
   quem usa, não como troca imposta por mim.
4. **Movimento.** Entrada dos cards em cascata, hover que levanta o card e acende ícone e
   botão, `TransitionGroup` ao filtrar, buscar e trocar de visualização, `loading` no botão
   que foi clicado, transição entre os passos do modal, e o convite saindo ao ser aceito.
   Tudo sob `prefers-reduced-motion`.
5. **Favoritar virou ação de verdade** — a estrela aparece no hover do card e alterna, e a aba
   Favoritos responde na hora. Na rodada 1 era só indicador.

**O que aprendi, e virou regra:** as quatro correções entraram como regras 14 a 17 da Parte 6
da spec e estão repetidas no `CLAUDE.md`. As duas que mais doem: *não trocar a forma que o
produto já usa sem oferecer a volta*, e *ação do topo continua no topo — rebaixa-se o peso,
nunca o endereço*.

### Rodada 1 — 16/09/2026

**Pedido:** a demanda original (Briefing, seção 1).
**Entregue:** as duas telas, os cinco estados, os sete pontos acima.
**Descartado:** reproduzir a tela atual lado a lado como comparativo — a evidência do estado
atual já está no Briefing, e manter duas versões vivas dobra o custo de cada iteração.

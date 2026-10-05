# Comunicação no workspace: lógica da funcionalidade

Para dev e produto. Protótipo: https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/
(05/10/2026, rodada 3).

## 1. Resumo

O documento do Felipe pede 3 coisas, e cada uma tem configuração e uso:

| Parte | O que a pessoa faz | Onde configura |
|---|---|---|
| Atalhos de contato | Abre o e-mail, o WhatsApp ou o SMS dela, já com o destinatário e um texto inicial | Sistema › Módulos e o cartão "Atalhos de comunicação" da categoria |
| Link de formulário público | Copia ou envia o link do formulário público sem ir à configuração | Formulários da categoria (visibilidade, já existe) |
| E-mail do ENSPACE em qualquer tela | Escreve o e-mail do ENSPACE de qualquer tela e, se quiser, vincula a um item | Sistema › Módulos e o Correio do Outlook de cada pessoa |

Regras que valem para tudo:

- **Atalho não envia nada.** WhatsApp, SMS e "Abrir no meu app" só abrem o app da pessoa (deep
  link). Quem envia é ela.
- **O e-mail do ENSPACE sai da conta do Outlook da pessoa.** É o envio que a pasta Mail Box (a pasta
  de e-mail do item) já usa hoje. O item vinculado não muda o remetente: ele define para onde a
  resposta volta.
- **Dado que falta deixa o botão indisponível, com o motivo** e, no item, o atalho para preencher.
- **Tudo liga e desliga** em Configurações › Sistema › Módulos, como Correção Monetária e
  Comparações.

## 2. Como a lógica foi conferida

| Fonte | O que confirmou |
|---|---|
| Código da gaveta "Nova Mensagem" da Mail Box, no develop | De onde o e-mail sai, o "Responder para" e como o vínculo é gravado |
| Schemas do SDK do ENSPACE 0.17 (`Item`, `ItemType`, `Field`, `Task`, `Member`, `User`, `Workspace`) | Onde cada dado mora e onde a configuração cabe |
| Documentação de suporte (docs.enspace.io) | Formulários, Agenda, Tarefas, Caixas de E-mail, Módulos, busca global, logs |
| Telas do workspace de exploração (develop) | Tarefa rápida, Tarefas Programadas, perfil, Requisições |

Correção em relação às rodadas 1 e 2: o e-mail não sai do endereço do item. Sai da conta do Outlook
da pessoa (6.1). O protótipo já mostra assim.

## 3. Configuração (quem administra o workspace)

### 3.1 Módulo "Atalhos de comunicação"

**Como funciona**

- Fica em Configurações › Sistema › Informações Básicas, cartão Módulos, ao lado de Correção
  Monetária e Comparações. Ligado, abre um painel com:
  - **Canais:** E-mail, WhatsApp e SMS. Canal desligado some de todas as telas.
  - **Onde aparecem:** Tela inicial, Tela do item, Lista e quadro de itens, Tarefas, Agenda e Link
    de formulário público. Cada tela liga e desliga.
  - **Preencher assunto e mensagem:** liga o texto inicial de cada categoria. Desligado, o app abre
    só com o destinatário.
  - **Pôr a caixa do item em cópia:** no e-mail aberto no app da pessoa, o endereço do item vai em
    Cc. A resposta volta para a Mail Box quando o cliente responde a todos.
- O Salvar do cartão Módulos grava, como nos outros módulos.
- Dado: `Workspace.modules` aceita um objeto por chave. Proposta: `modules.atalhos_de_comunicacao`
  com `canais`, `lugares`, `textoInicial` e `copiaParaOItem`.

**Como a pessoa usa**

1. Abre Configurações › Sistema.
2. Liga "Atalhos de comunicação" no cartão Módulos.
3. Escolhe canais e telas.
4. Clica em Salvar.
5. Clica em "Escolher o contato de cada categoria" para ir ao cartão da categoria (3.2).

**Por que assim**

O documento pede: "Todos esses botões devem ter opção nas configurações de aparecerem ou não nas
telas, do mesmo modo como foi feito em correções monetárias, comparador". Os 2 módulos citados moram
nesse cartão.

### 3.2 Cartão "Atalhos de comunicação" da categoria

**Como funciona**

- Novo cartão no painel da categoria (Configurações › Estrutura › Categorias › categoria), ao lado
  do cartão Correção Monetária.
- Define os **contatos** da categoria. Cada contato tem rótulo e 3 origens: nome, e-mail e telefone.
  Uma categoria pode ter mais de 1 contato (Contratos: "Contato da contraparte" e "Requisitante").
- Origens aceitas:

| Dado | Campos que servem |
|---|---|
| Nome | Texto curto; Pessoa/Empresa › Nome de contato |
| E-mail | Campo E-mail; Pessoa/Empresa › E-mail de contato; E-mail do Requisitante (`request_email`) |
| Telefone | Texto com máscara; Pessoa/Empresa › Telefone de contato |

- Define o **texto inicial** da categoria: assunto e mensagem, com as variáveis `{referencia}`,
  `{titulo}`, `{nome}` e `{categoria}`.
- Mostra a prévia dos links com um item de exemplo.
- Dado: `ItemType.settings` aceita um objeto. Proposta: `settings.atalhos` com `contatos`,
  `assunto` e `mensagem`.

**Como a pessoa usa**

1. Abre a categoria e o cartão "Atalhos de comunicação".
2. Escolhe, para cada contato, de quais campos vêm nome, e-mail e telefone.
3. Ajusta o texto inicial e confere a prévia.
4. Clica em Salvar.

**Por que assim**

- O ENSPACE não tem tipo de campo telefone: o telefone é um Texto com máscara, como o CNPJ. O
  sistema não sabe sozinho qual campo é o telefone; quem configura diz.
- Cada categoria tem seus campos. O contato de um contrato não mora no mesmo campo que o de uma
  solicitação.
- O texto inicial é por categoria porque o assunto de um contrato e o de uma solicitação são
  diferentes.

### 3.3 Módulo "E-mail do ENSPACE em todas as telas"

**Como funciona**

- Fica no mesmo cartão Módulos. Ligado, mostra "Novo e-mail" na barra do topo, "E-mails" no menu e
  o caminho "Escrever pelo ENSPACE" nos atalhos.
- Mostra de onde o e-mail sai (a conta do Outlook de cada pessoa) e quais categorias têm a pasta
  Mail Box. Sem a pasta, o e-mail vinculado não aparece na tela do item.
- Não tem caixa a escolher. A Caixa de E-mail do workspace (Configurações › E-mails) é remetente de
  notificações e fluxos e porta de entrada de Spaceflow; não é remetente do e-mail que a pessoa
  escreve.

**Como a pessoa usa**

1. Liga o módulo no cartão Módulos e salva.
2. Confere a lista de categorias com a pasta Mail Box.
3. Avisa o time para integrar o Correio do Outlook (3.4).

**Por que assim**

O documento pede: "Não deve ser criada uma nova funcionalidade ou nova integração de e-mail. Deve
ser utilizada o mesmo componente, incluindo a integração, permissões, dados e comportamentos
atuais". O módulo só muda onde o componente aparece.

### 3.4 Correio do Outlook (cada pessoa, já existe)

**Como funciona**

- Perfil › Integrações › Correio do Outlook, com login na conta Microsoft corporativa.
- Sem essa integração, a gaveta "Nova Mensagem" mostra "Nenhuma conta integrada disponível" e o
  botão "Integrar contas".
- Só Microsoft. Quem usa Google só tem o caminho "Abrir no meu app de e-mail".

**Como a pessoa usa**

1. Clica nas iniciais, no canto superior direito, e em Configurações do Usuário.
2. Abre Integrações e clica em Sincronizar no card Correio do Outlook.
3. Faz login na Microsoft e aceita as permissões.

## 4. Atalhos de contato (quem usa)

### 4.1 Regras de todos os atalhos

**Como funciona**

| Canal | Link que abre | Quando fica indisponível |
|---|---|---|
| E-mail | `mailto:<para>?cc=<endereço do item>&subject=<assunto>&body=<mensagem>` | Contato sem e-mail |
| WhatsApp | `https://wa.me/<número com DDI>?text=<mensagem>` | Contato sem telefone, ou telefone com menos de 10 dígitos |
| SMS | `sms:+<número com DDI>?body=<mensagem>` | O mesmo do WhatsApp |

- Número sem DDI ganha 55 na frente.
- O texto inicial vem da categoria, com as variáveis já trocadas. A pessoa muda tudo no app antes de
  enviar.
- Botão indisponível continua no Tab do teclado (`aria-disabled`), com o motivo na dica e no nome
  acessível: "Sem e-mail cadastrado", "Sem telefone cadastrado", "Telefone inválido".
- Canal desligado na configuração não aparece.
- O ENSPACE não registra o clique em WhatsApp e SMS. O Log de Auditoria só registra criação,
  alteração e exclusão de dados. O e-mail enviado pelo ENSPACE fica na Mail Box.

**Por que assim**

- O documento pede deep link: "O ENSPACE não deverá gerar conteúdo da mensagem, enviar mensagens,
  realizar autenticação nos serviços ou integrar-se às contas".
- O texto inicial existe porque o próprio documento pede `mailto:...?subject=ASSUNTO&body=CORPO`. O
  administrador desliga em 3.1.
- O motivo na tela responde a pergunta que um botão cinza deixa: por que não funciona?

### 4.2 Botão E-mail com 2 caminhos

**Como funciona**

- Com o módulo 3.3 ligado e o Correio do Outlook integrado, o E-mail é um botão dividido:
  - **clique no corpo:** abre o compositor do ENSPACE com o item vinculado (seção 6);
  - **seta:** "Abrir no meu app de e-mail", o `mailto:` de 4.1.
- Sem o módulo ou sem a integração, o botão abre direto o app.
- Onde só cabe ícone (coluna da lista de tarefas), os 2 caminhos vão num menu.

**Por que assim**

O caminho do ENSPACE vem primeiro porque só nele a resposta sempre volta para o item. O app da
pessoa fica a 1 clique para quem prefere o Outlook ou não tem a integração.

### 4.3 Item: cartão "Contato rápido"

**Como funciona**

- No alto do painel esquerdo do item, acima de Identificação.
- Seletor do contato (os contatos da categoria, 3.2), a linha com e-mail e telefone e os 3 botões.
- Quando falta dado, uma linha diz o que falta e oferece "Cadastrar telefone", "Corrigir telefone"
  ou "Cadastrar e-mail". O botão abre a Visão Geral com o cursor no campo.

**Como a pessoa usa**

1. Abre o item.
2. Escolhe o contato, se houver mais de 1.
3. Clica em E-mail, WhatsApp ou SMS.
4. Se o botão estiver indisponível, clica em "Cadastrar telefone", preenche e salva.

**Por que assim**

É o desenho do Felipe (mockup 2). HubSpot, Close e Agendor põem o contato no alto do registro.

### 4.4 Lista de itens: menu "Contatar"

**Como funciona**

- O menu da linha ganha "Contatar", com um grupo por contato e os canais. WhatsApp e SMS mostram o
  telefone; indisponível mostra o motivo.

**Como a pessoa usa**

1. Abre o menu da linha do item.
2. Passa o mouse em Contatar e escolhe contato e canal.

**Por que assim**

A lista já tem muitas colunas. O menu da linha já existe e recebe a ação sem ocupar espaço.

### 4.5 Quadro de itens e de tarefas: clique direito

**Como funciona**

- O cartão do quadro ganha o menu de clique direito com os atalhos.
- No quadro de tarefas, o painel da tarefa (abre no clique do cartão) tem os mesmos atalhos. É o
  caminho pelo teclado.

**Por que assim**

O mockup 5 põe "Notify" no cartão. O `EnKanbanBoard` do SDK não aceita ação extra no cartão. O
clique direito é o que dá para fazer sem mudar o SDK. Pedido ao SDK: uma prop `cardActions`.

### 4.6 Tarefas: avisar o responsável

**Como funciona**

- Quem recebe é o **responsável** da tarefa (`Task.assigned_to`), um membro.
- Lista: coluna Contato com 3 ícones por linha.
- Seleção de várias tarefas: barra "Avisar responsáveis por E-mail, WhatsApp, SMS".
  - **E-mail:** 1 rascunho para todos.
  - **WhatsApp e SMS:** uma fila. Antes de começar, a janela diz quem fica de fora por falta de
    telefone. Depois, "Conversa 1 de N", "Abrir conversa" e "Próxima".
- O membro não tem telefone hoje: o perfil tem só nome e e-mail. O SDK tem `User.meta.phone`, mas
  nenhuma tela grava. Sem isso, WhatsApp e SMS para o responsável ficam indisponíveis.

**Como a pessoa usa**

1. Abre Tarefas › Rápidas, na visão Lista.
2. Seleciona as tarefas.
3. Clica em WhatsApp na barra.
4. Clica em "Abrir conversa", envia no WhatsApp, volta e clica em "Próxima".

**Por que assim**

- O link `wa.me` abre 1 conversa com 1 número. O navegador bloqueia várias abas abertas de uma vez.
  A fila é o jeito de avisar vários sem integração.
- O mockup 3 diz: "Email opens one draft to both. WhatsApp and SMS open one chat per assignee".

### 4.7 Agenda: enviar lembrete

**Como funciona**

O modal "Evento" ganha "Enviar lembrete", com um atalho por pessoa e "E-mail para todos". A pessoa
muda conforme a origem do evento:

| Origem do evento | Quem recebe | Telefone |
|---|---|---|
| Reunião do Outlook | Os participantes | Não tem: só e-mail |
| Data de um item (campo de data da categoria) | Os contatos do item (3.2) | O do contato |
| Prazo de uma tarefa | O responsável | O do perfil, quando existir |

O texto leva data, hora e, na reunião do Outlook, o local.

**Como a pessoa usa**

1. Abre a Agenda e clica no evento.
2. Clica em "E-mail para todos" ou no canal de uma pessoa.

**Por que assim**

A Agenda junta essas 3 origens (docs: Agenda). Só a reunião do Outlook tem participantes; nas
outras, quem recebe vem do item ou da tarefa.

### 4.8 Tela inicial: Atalhos

**Como funciona**

- Abaixo da saudação: E-mail, WhatsApp, SMS e "Link de formulário público".
- Sem destinatário: o app abre vazio e a pessoa escolhe para quem. O uso esperado é mandar o link de
  um formulário público.

**Por que assim**

É o mockup 6. A tela inicial já recebe atalho de módulo: com Comparações ligado, aparece "Acessar
Comparações" ali.

## 5. Link de formulário público

### 5.1 A regra

**Como funciona**

- O link aparece só para formulário **público** de tipo **Criação** ou **Geral**.
- O link é o que já existe: `/public/<formulário>/Answer`. Abre sem login e não expira.
- Quem responde pelo link cria um item na categoria do formulário.
- "Copiar link" mostra o aviso "Link copiado", o mesmo texto em todo lugar.
- "Enviar o link por" usa os atalhos de 4.1, com o link no texto.

**Por que assim**

- Editar e Visualizar dependem de um item que o link não leva.
- Hoje o link só se copia em Configurações › Estrutura › Categorias › Formulários, com 6 cliques. O
  documento pede o link "nas telas de tarefas, itens ou onde o usuário preenche o formulário".
- Hoje há 2 avisos para a mesma ação: "Copiado!" e "Link copiado para a sua área de transferência".

### 5.2 Onde aparece

| Tela | O que aparece | Jornada |
|---|---|---|
| Requisições | Cartão "Compartilhar este formulário" entre o seletor e o formulário | Escolhe o formulário, clica em Copiar link ou em Enviar o link por |
| Tela inicial e lista de itens | Menu "Link de formulário público" (na lista, só os da categoria) | Abre o menu, copia ou envia |
| Painel da tarefa de formulário | O mesmo cartão, com a linha "A resposta pelo link cria um item novo em <categoria>. Esta tarefa continua aberta até você concluí-la." | Abre a tarefa, copia ou envia |
| Formulários da categoria | "Copiar" (já existe) e "Tornar público/privado" no menu da linha | Atalho para o Editar › Visibilidade, que já existe |

Formulário privado mostra 1 linha dizendo por que não há link.

**Por que a linha na tarefa**

A tarefa de formulário vem de um Spaceflow e só fecha quando o responsável preenche e conclui. A
resposta pelo link público cria um item à parte. Sem a linha, a pessoa acha que o link conclui a
tarefa.

## 6. E-mail do ENSPACE em qualquer tela

### 6.1 Como o envio funciona hoje (base de tudo)

Lido no código da gaveta "Nova Mensagem" da Mail Box:

- O envio é `POST user-integrations/microsoft/send-email`, com `to`, `cc`, `bcc`, `replyTo`,
  `subject`, `message`, `attachments` e `item_ref`.
- O remetente é a conta do Outlook que a pessoa integrou.
- No item, `replyTo` e `mailBox` recebem o endereço do item, e `item_ref` recebe a referência do
  item. O endereço do item é `<referência do item em minúsculas>.<referência do
  workspace>@<domínio das caixas>` (no develop, `develop.box.enspace.io`).
- A resposta do cliente chega no endereço do item e aparece em Mail Box › Recebidos. O enviado
  aparece em Mail Box › Enviados, com Reenviar.
- O template (Configurações › E-mails › Modelos de E-mail) troca as variáveis pelos dados do item.
- Há "Inserir assinatura", com a assinatura da conta do Outlook.

O vínculo fica gravado pela referência do item, não pelo nome. É o que o documento pede.

### 6.2 "Novo e-mail" na barra do topo

**Como funciona**

- Botão com rótulo na barra do topo, ao lado de Suporte. A tecla C abre o compositor fora de campo
  de texto. Com rascunho guardado, o botão ganha um ponto.

**Como a pessoa usa**

1. Em qualquer tela, clica em "Novo e-mail" ou aperta C.
2. Escreve (6.3) e envia.

**Por que assim**

O documento pede o e-mail "da mesma forma que outras funcionalidades transversais da plataforma".
As transversais de hoje (Suporte, notificações) moram na barra do topo.

### 6.3 O compositor

**Como funciona**

| Campo | Regra |
|---|---|
| De | A conta do Outlook da pessoa, só leitura. Proposta: hoje a tela não mostra |
| Responder para | Com item: o endereço do item, e "A resposta volta para a aba Mail Box". Sem item: "a resposta chega só no seu Outlook" |
| Para | Obrigatório. Sugere os contatos do item vinculado, os membros e os contatos dos itens que a pessoa vê |
| Cc e Cco | Atrás de "Adicionar em Cópia", como hoje |
| Template | Os Modelos de E-mail. As variáveis só se preenchem com item vinculado |
| Assunto | Livre |
| Vincular a item (opcional) | Bloco separado dos campos do e-mail (6.4) |
| Mensagem | Obrigatória. Editor com negrito, itálico, listas e link |
| Anexar arquivo e Inserir assinatura | Como hoje |

- Enviar: botão ou Ctrl+Enter. Depois do envio, o aviso traz "Ver no item" ou "Ver em E-mails".
- Descartar: o aviso traz "Desfazer".
- A gaveta não escurece nem trava a página. Minimizar, Esc e o X guardam o rascunho numa barra no
  rodapé, que continua na troca de tela. Expandir alarga a gaveta.
- Ao abrir, o cursor vai para o Para; vindo do item, com destinatário pronto, vai para o texto.

**Por que assim**

- É a mesma gaveta "Nova Mensagem" de hoje, na mesma ordem, como o documento pede.
- O "De" e o "Responder para" à vista evitam que a pessoa ache que o e-mail sai do endereço do item.
- A gaveta que não trava a página deixa consultar o item enquanto escreve, como Salesforce e Gmail.

### 6.4 Vincular a item

**Como funciona**

- Campo de busca (autocompletar), não lista. Vazio, mostra os 5 itens atualizados por último. Com
  texto, os 8 melhores e quantos ficaram de fora.
- Procura em referência, ID, nome, categoria, contatos e campos de texto. Agrupa por categoria e
  mostra ID e etapa, para separar itens de nome parecido.
- Só itens que a pessoa pode ver, no workspace atual. Item sem permissão não aparece nem na
  contagem.
- Antes da busca, até 3 sugestões: itens em que alguém do Para é contato.
- Escolhido o item: nome, referência e categoria, com Trocar e o X para remover.
- Aberto a partir de um item: já vem vinculado, com a linha "Vinculado porque você começou no item".
- Categoria sem pasta Mail Box: aviso de que o e-mail não aparece na tela do item.

**Como a pessoa usa**

- Do item: clica em E-mail; o item já está vinculado; envia.
- De outra tela: clica em "Novo e-mail", preenche o Para, clica na sugestão ou digita na busca,
  escolhe o item e envia.

**Por que assim**

- O documento pede busca por "nome/titulo do item, ID, Folder, Workspace" e que a pessoa nunca ache
  item sem acesso.
- A busca global de hoje (Ctrl K) não procura itens: navega por menus e ações. A busca de item entre
  categorias precisa ser construída.
- Só o workspace atual porque o endereço do item e as permissões são do workspace.

### 6.5 Sem o Correio do Outlook integrado

- A gaveta mostra "Nenhuma conta integrada disponível." e "Integrar contas", que abre Perfil ›
  Integrações. É o comportamento de hoje.
- O botão E-mail dos atalhos abre o app da pessoa (`mailto:`), sem o caminho do ENSPACE.

### 6.6 Área "E-mails" no menu

**Como funciona**

- Entrada "E-mails" na seção Membro do menu. Abas Recebidos e Enviados, busca e o filtro Todos, Com
  item e Sem item.
- Recebidos: o que chegou nos endereços dos itens e nas Caixas de E-mail do workspace. A coluna Item
  mostra o item ou "Sem item".
- Enviados: o que a pessoa enviou pelo ENSPACE, com ou sem item.
- E-mail sem item tem "Vincular" na linha. Na leitura, aparecem antes os itens em que o remetente é
  contato.
- Só aparecem e-mails de itens que a pessoa pode ver.

**Como a pessoa usa**

1. Abre E-mails no menu.
2. Filtra "Sem item".
3. Clica em Vincular, escolhe a sugestão ou busca o item.

**Por que assim**

- O documento pede que o e-mail vinculado apareça "na área de E-mail do usuário". Essa área existe
  escondida: a tela "Emails Recebidos" (`/itemEmails`), sem entrada no menu.
- Os dados existem: recebidos em `c-mailbox-messages`, enviados em `sendmails`.

### 6.7 Mail Box do item (já existe)

- Endereço do item com botão de copiar, abas Recebidos e Enviados, lápis para escrever e Responder
  em cada e-mail.
- O protótipo só acrescenta: o lápis abre o mesmo compositor de 6.3, já vinculado ao item.

## 7. O que precisa ser construído

| Ponto | Front | Back |
|---|---|---|
| Módulo "Atalhos de comunicação" (3.1) | Chave e painel no cartão Módulos | Guardar em `Workspace.modules` |
| Contato da categoria (3.2) | Cartão no painel da categoria | Guardar em `ItemType.settings` |
| Atalhos (4.1 a 4.8) | Montar os links, o motivo de indisponível, o botão dividido, a fila | Nada |
| Telefone do membro (4.6) | Campo telefone no perfil | Gravar em `User.meta.phone` |
| Clique direito no quadro (4.5) | Menu de contexto | No SDK: prop `cardActions` no `EnKanbanBoard` |
| Link público (5) | Cartão e menu nas telas de uso | Nada: o link e a visibilidade já existem |
| Compositor global (6.2 e 6.3) | Gaveta aberta de qualquer tela, "De" e "Responder para" | Nada com item; sem item, confirmar o envio sem `item_ref` |
| Vincular a item (6.4) | Campo de busca com sugestões | Rota de busca de item entre categorias, filtrada por permissão |
| Área "E-mails" (6.6) | Tela com Recebidos, Enviados e Vincular | Listar por pessoa e permissão; rota para vincular e-mail sem item a um item |

## 8. Perguntas para dev e produto

1. **Envio sem item:** o `send-email` sem `item_ref` grava o e-mail em `sendmails`? Sem isso, o
   e-mail sem item não aparece em E-mails › Enviados.
2. **Vincular depois:** não há rota para ligar um e-mail recebido (ou enviado) sem item a um item.
   Criar?
3. **Caixas do workspace:** quem vê, na área E-mails, o que chega numa Caixa de E-mail do workspace?
   Hoje a Caixa de E-mail é porta de entrada de Spaceflow.
4. **Correio do Outlook:** a documentação diz que a integração "exibe sua caixa de entrada dentro do
   ENSPACE e permite vincular e-mails a tarefas e registros". O código do develop não tem essa tela
   nem a rota. Existe em outro lugar ou é plano?
5. **Telefone do membro:** entra no perfil? Sem ele, WhatsApp e SMS para o responsável da tarefa
   não funcionam.
6. **SDK:** a prop `cardActions` no `EnKanbanBoard` entra no roteiro do SDK?
7. **Registro do contato:** o mockup do Felipe diz que o contato fica no Log de Auditoria. O log só
   registra mudança de dado. Registrar o clique em WhatsApp e SMS pede um tipo de evento novo. Vale?

## 9. O que o protótipo não faz

- Não abre o app: mostra num aviso o link exato que abriria (`mailto:`, `https://wa.me/...`,
  `sms:`).
- Não envia e-mail: guarda na memória e some ao recarregar.
- A referência do item aparece curta (ex.: CTR-00231) para leitura. No produto é o código de 32
  caracteres (ex.: LEV4E6DB…), e o endereço do item usa esse código.
- O andaime (barra de baixo) troca os cenários: Normal, Sem Outlook integrado e Envio falha.

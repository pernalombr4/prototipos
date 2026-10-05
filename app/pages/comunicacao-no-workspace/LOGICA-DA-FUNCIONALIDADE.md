# Comunicação no workspace: lógica da funcionalidade

Para dev e produto. Protótipo: https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/
(05/10/2026, rodada 4).

## 1. Resumo

O documento do Felipe pede 3 coisas, e cada uma tem configuração e uso:

| Parte | O que a pessoa faz | Onde configura |
|---|---|---|
| Atalhos de contato | Abre o e-mail, o WhatsApp ou o SMS dela, já com o destinatário e um texto inicial | Sistema › Módulos e o cartão "Atalhos de comunicação" da categoria |
| Link de formulário público | Copia ou envia o link do formulário público sem ir à configuração | Formulários da categoria (visibilidade, já existe) |
| E-mail do ENSPACE em qualquer tela | Escreve o e-mail do ENSPACE de qualquer tela e, se quiser, vincula a um item | Sistema › Módulos e o Correio do Outlook no perfil de cada pessoa |

Regras que valem para tudo:

- **Atalho não envia nada.** WhatsApp, SMS e "Abrir no meu app" só abrem o app da pessoa (deep
  link). Quem envia é ela.
- **O e-mail do ENSPACE sai da conta do Outlook da pessoa.** É o envio que a pasta Mail Box (a pasta
  de e-mail do item) já usa hoje. O item vinculado não muda o remetente: ele define para onde a
  resposta volta.
- **O Correio do Outlook é do perfil de cada pessoa, não do workspace.** Cada pessoa integra a
  própria conta em Perfil › Integrações. O administrador não liga pelos outros.
- **Dado que falta deixa o botão indisponível, com o motivo** e, no item, o atalho para preencher.
- **Tudo liga e desliga** em Configurações › Sistema › Módulos, como Correção Monetária e
  Comparações.

Cada ponto das seções 3 a 6 tem um bloco **Depende de**: o que precisa existir, onde se resolve e o
que a pessoa vê quando falta. A seção 2 junta todas as dependências num mapa.

## 2. Mapa de dependências

| # | Dependência | De quem é | Existe hoje? | Pontos afetados | Se faltar |
|---|---|---|---|---|---|
| D1 | Correio do Outlook integrado no perfil da pessoa | Cada pessoa (Perfil › Integrações) | Sim | 4.2, 5.2, 6 inteira | A gaveta mostra "Nenhuma conta integrada disponível"; o botão E-mail abre o app da pessoa |
| D2 | Conta Microsoft corporativa | TI do cliente | Sim, só Microsoft | Os mesmos de D1 | Quem usa Google fica só com "Abrir no meu app de e-mail" |
| D3 | Calendário do Outlook integrado no perfil (é outra integração, separada do Correio) | Cada pessoa (Perfil › Integrações) | Sim | 4.7 | As reuniões do Outlook não aparecem na Agenda |
| D4 | Módulo "Atalhos de comunicação" ligado, com o canal e a tela ligados | Administrador (Sistema › Módulos) | Não: é novo | 4, 5 | O botão não aparece |
| D5 | Módulo "E-mail do ENSPACE em todas as telas" ligado | Administrador (Sistema › Módulos) | Não: é novo | 4.2, 6 | Sem "Novo e-mail", sem "E-mails" no menu; o botão E-mail abre o app |
| D6 | Contatos configurados na categoria | Administrador (cartão da categoria) | Não: é novo | 4 | Botões indisponíveis em todos os itens da categoria |
| D7 | Campos de contato na categoria (E-mail, Texto com máscara, Pessoa/Empresa) | Administrador (Estrutura › Categorias › Campos) | Sim | 3.2, 4 | Não há campo para escolher no cartão |
| D8 | Dado do contato preenchido no item (e-mail; telefone com 10 dígitos ou mais) | Quem usa (Visão Geral do item) | Sim | 4 | Botão indisponível com o motivo |
| D9 | Pasta Mail Box na categoria | Administrador (Estrutura › Categorias › Pastas) | Sim | 4.2, 6 | O e-mail sai, mas ele e a resposta não aparecem na tela do item |
| D10 | Permissão de ver a categoria e o item | Cargo (Gestão de Membros) | Sim | 4, 6.4, 6.6 | O item não aparece na busca nem na área E-mails |
| D11 | Permissão de editar o campo do contato | Cargo (Gestão de Membros) | Sim | 4.3 | Sem o botão "Cadastrar telefone"; fica só o motivo |
| D12 | Telefone do membro no perfil | Dev (tela de perfil e `User.meta.phone`) | Não | 4.6, 4.7 | WhatsApp e SMS indisponíveis para o responsável da tarefa |
| D13 | Formulário com visibilidade Público e tipo Criação ou Geral | Administrador (Editar do formulário) | Sim | 5 | O link não aparece; formulário privado mostra o porquê |
| D14 | Tela Requisições no menu | Administrador (Interface › Menus) | Sim | 5.2 | Sem o cartão nessa tela; sobram tela inicial, lista e tarefa |
| D15 | Spaceflow que gera tarefa de formulário (nó Formulário ou Operações de Dados manual) | Administrador (Spaceflow) | Sim | 5.2 | Não há tarefa de formulário |
| D16 | Configurações da Agenda: categorias com campo de data e tipos de tarefa marcados | Administrador (Agenda › Configurações, vale para o workspace) | Sim | 4.7 | O evento não aparece na Agenda |
| D17 | Modelos de E-mail cadastrados | Administrador (Configurações › E-mails › Modelos de E-mail) | Sim | 6.3 | Campo Template vazio |
| D18 | Apps no computador da pessoa: e-mail padrão (`mailto:`), WhatsApp (app ou Web, com login), SMS (`sms:`: no Windows, Vincular ao Celular; no Mac, Mensagens com iPhone) | Cada pessoa ou o TI | Fora do ENSPACE | 4, 5 | O navegador não abre nada ou pergunta qual app usar |
| D19 | Rota de busca de item entre categorias, filtrada por permissão | Dev (back) | Não | 6.4 | Sem a busca de "Vincular a item" |
| D20 | Envio sem item gravado em `sendmails` e rota para vincular e-mail sem item a um item | Dev (back) | A confirmar / Não | 6.6 | E-mail sem item fora da área E-mails; sem "Vincular" |
| D21 | Prop `cardActions` no `EnKanbanBoard` | Dev (SDK) | Não | 4.5 | Atalho só no clique direito, sem botão no cartão |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Acesso a Configurações › Sistema | Cargo (Gestão de Membros) | Não vê o cartão Módulos |
| Back aceitar e guardar `modules.atalhos_de_comunicacao` (o campo já existe) | Dev | A configuração não grava |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Módulo 3.1 ligado (D4) | Sistema › Módulos | O cartão mostra "Módulo desligado" e os atalhos não aparecem |
| Campos de contato na categoria (D7) | Estrutura › Categorias › Campos | Não há campo para escolher; o canal fica indisponível |
| Back aceitar e guardar `settings.atalhos` (o campo já existe) | Dev | A configuração não grava |

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
  Mail Box.
- Não tem caixa a escolher. A Caixa de E-mail do workspace (Configurações › E-mails) é remetente de
  notificações e fluxos e porta de entrada de Spaceflow; não é remetente do e-mail que a pessoa
  escreve.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Correio do Outlook no perfil de cada pessoa (D1). Ligar o módulo não liga a integração de ninguém | Cada pessoa, em Perfil › Integrações | Para essa pessoa: aviso "Nenhuma conta integrada disponível" e o botão E-mail abre o app |
| Conta Microsoft corporativa (D2) | TI do cliente | Só "Abrir no meu app de e-mail" |
| Pasta Mail Box em cada categoria que recebe e-mail (D9) | Estrutura › Categorias › Pastas | O e-mail vinculado e a resposta não aparecem na tela do item. O endereço do item existe; falta onde ver |

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

- Perfil › Integrações › Correio do Outlook, com login na conta Microsoft corporativa (OAuth2).
- Sem essa integração, a gaveta "Nova Mensagem" mostra "Nenhuma conta integrada disponível" e o
  botão "Integrar contas".
- Só Microsoft. Google não tem integração.
- É diferente do Calendário do Outlook (D3), que traz as reuniões para a Agenda. Uma não liga a
  outra.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Conta Microsoft corporativa (D2) | TI do cliente | Não há o que integrar |
| Autorização do app do ENSPACE na conta Microsoft. A documentação avisa que ele pode aparecer como "não verificado"; onde o TI bloqueia apps assim, o TI precisa liberar | TI do cliente | O login falha |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Módulo 3.1 ligado, com o canal e a tela ligados (D4) | Sistema › Módulos | O botão não aparece |
| Contatos configurados na categoria (D6) | Cartão "Atalhos de comunicação" da categoria | Botão indisponível |
| Dado preenchido no item (D8) | Visão Geral do item | Botão indisponível com o motivo |
| Permissão de ver o item (D10) | Cargo | A pessoa não chega ao item |
| App registrado no computador para cada link (D18) | Computador da pessoa ou TI | O navegador não abre nada ou pergunta qual app usar |
| Permissão do navegador para abrir app externo (pergunta na 1ª vez) | Navegador da pessoa | O app não abre até a pessoa permitir |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 4.1 | Ver 4.1 | Ver 4.1 |
| Módulo 3.3 ligado (D5) | Sistema › Módulos | Botão simples, que abre o app |
| Correio do Outlook no perfil da pessoa (D1, D2) | Perfil › Integrações | Botão simples, que abre o app |
| Pasta Mail Box na categoria do item (D9) | Estrutura › Categorias › Pastas | O e-mail sai, mas não aparece na tela do item |

**Por que assim**

O caminho do ENSPACE vem primeiro porque só nele a resposta sempre volta para o item. O app da
pessoa fica a 1 clique para quem prefere o Outlook ou não tem a integração.

### 4.3 Item: cartão "Contato rápido"

**Como funciona**

- No alto do painel esquerdo do item, acima de Identificação.
- Seletor do contato (os contatos da categoria, 3.2), a linha com e-mail e telefone e os 3 botões.
- Quando falta dado, uma linha diz o que falta e oferece "Cadastrar telefone", "Corrigir telefone"
  ou "Cadastrar e-mail". O botão abre a Visão Geral com o cursor no campo.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 4.1 e 4.2, com a tela "Tela do item" ligada | Sistema › Módulos | O cartão não aparece |
| Permissão de editar o campo do contato (D11) | Cargo | Sem "Cadastrar telefone"; fica só o motivo. Regra para o dev: o protótipo mostra o botão sempre |
| O campo do contato no formulário da Visão Geral | Formulário Editar ou Geral da categoria | "Cadastrar telefone" leva a um campo que não está na tela |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 4.1, com a tela "Lista e quadro de itens" ligada | Sistema › Módulos | Sem "Contatar" no menu |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 4.1, com a tela do quadro ligada | Sistema › Módulos | Sem o menu |
| Para o botão no cartão (o "Notify" do mockup 5): prop `cardActions` no `EnKanbanBoard` (D21) | Dev (SDK) | Fica só o clique direito |

**Por que assim**

O `EnKanbanBoard` do SDK não aceita ação extra no cartão. O clique direito é o que dá para fazer sem
mudar o SDK.

### 4.6 Tarefas: avisar o responsável

**Como funciona**

- Quem recebe é o **responsável** da tarefa (`Task.assigned_to`), um membro.
- Lista: coluna Contato com 3 ícones por linha.
- Seleção de várias tarefas: barra "Avisar responsáveis por E-mail, WhatsApp, SMS".
  - **E-mail:** 1 rascunho para todos.
  - **WhatsApp e SMS:** uma fila. Antes de começar, a janela diz quem fica de fora por falta de
    telefone. Depois, "Conversa 1 de N", "Abrir conversa" e "Próxima".

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 4.1, com a tela "Tarefas" ligada | Sistema › Módulos | Sem a coluna e sem a barra |
| Tarefa com responsável | Quem cria ou pega a tarefa | Botões indisponíveis: "Sem responsável" |
| E-mail do membro | Sempre existe: é o login | Não se aplica |
| Telefone do membro no perfil (D12). Hoje o perfil tem só nome e e-mail; o SDK tem `User.meta.phone`, mas nenhuma tela grava | Dev (tela de perfil e back) | WhatsApp e SMS indisponíveis para todos os responsáveis |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 4.1, com a tela "Agenda" ligada | Sistema › Módulos | Sem "Enviar lembrete" |
| Reunião: Calendário do Outlook no perfil (D3), que não é o Correio do Outlook | Perfil › Integrações | A reunião não aparece na Agenda |
| Data de item: a categoria marcada nas Configurações da Agenda, com o campo de data, e permissão na categoria (D16, D10) | Agenda › Configurações; cargo | O evento não aparece |
| Data de item: contatos configurados na categoria (D6) | Cartão da categoria | Sem quem recebe |
| Prazo de tarefa: "Fluxo Padrão" ou "Tarefas Rápidas" marcados nas Configurações da Agenda (D16) | Agenda › Configurações | A tarefa não aparece |
| Prazo de tarefa: telefone do membro (D12) | Dev | Só e-mail |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Módulo 3.1 com a tela "Tela inicial" ligada (D4) | Sistema › Módulos | A linha Atalhos não aparece |
| Para o menu de link: formulário público de Criação ou Geral (D13) | Editar do formulário | O menu mostra "Nenhum formulário público" e a dica do porquê |
| Apps no computador (D18) | Computador da pessoa | O app não abre |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Formulário Público, de tipo Criação ou Geral (D13) | Editar do formulário › Visibilidade | O link não aparece |
| Tela "Link de formulário público" ligada no módulo 3.1 (D4) | Sistema › Módulos | O link só se copia na configuração, como hoje |
| Enviar o link por WhatsApp e SMS: apps no computador (D18) | Computador da pessoa | O app não abre |
| Enviar o link pelo e-mail do ENSPACE: Correio do Outlook (D1) | Perfil › Integrações | O e-mail abre no app da pessoa |

**Por que assim**

- Editar e Visualizar dependem de um item que o link não leva.
- Hoje o link só se copia em Configurações › Estrutura › Categorias › Formulários, com 6 cliques. O
  documento pede o link "nas telas de tarefas, itens ou onde o usuário preenche o formulário".
- Hoje há 2 avisos para a mesma ação: "Copiado!" e "Link copiado para a sua área de transferência".

### 5.2 Onde aparece

| Tela | O que aparece | Jornada | Depende também de |
|---|---|---|---|
| Requisições | Cartão "Compartilhar este formulário" entre o seletor e o formulário | Escolhe o formulário, clica em Copiar link ou em Enviar o link por | A tela Requisições no menu (D14) |
| Tela inicial e lista de itens | Menu "Link de formulário público" (na lista, só os da categoria) | Abre o menu, copia ou envia | Permissão de ver a categoria (D10) |
| Painel da tarefa de formulário | O mesmo cartão, com a linha "A resposta pelo link cria um item novo em <categoria>. Esta tarefa continua aberta até você concluí-la." | Abre a tarefa, copia ou envia | Um Spaceflow que gera a tarefa de formulário (D15) |
| Formulários da categoria | "Copiar" (já existe) e "Tornar público/privado" no menu da linha | Atalho para o Editar › Visibilidade, que já existe | Acesso à configuração da categoria |

Formulário privado mostra 1 linha dizendo por que não há link.

**Por que a linha na tarefa**

A tarefa de formulário vem de um Spaceflow e só fecha quando o responsável preenche e conclui. A
resposta pelo link público cria um item à parte. Sem a linha, a pessoa acha que o link conclui a
tarefa.

## 6. E-mail do ENSPACE em qualquer tela

**Depende de, para a seção inteira**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Módulo 3.3 ligado (D5) | Sistema › Módulos | Nada desta seção aparece; fica a Mail Box do item, como hoje |
| Correio do Outlook no perfil da pessoa (D1), com conta Microsoft (D2) | Cada pessoa, em Perfil › Integrações | A gaveta mostra "Nenhuma conta integrada disponível" e "Integrar contas"; os atalhos de e-mail abrem o app |
| Pasta Mail Box na categoria do item (D9) | Estrutura › Categorias › Pastas | O e-mail vinculado sai, mas não aparece na tela do item |

### 6.1 Como o envio funciona hoje (base de tudo)

Lido no código da gaveta "Nova Mensagem" da Mail Box:

- O envio é `POST user-integrations/microsoft/send-email`, com `to`, `cc`, `bcc`, `replyTo`,
  `subject`, `message`, `attachments` e `item_ref`.
- O remetente é a conta do Outlook que a pessoa integrou. **Por isso a Mail Box do item já depende
  do Correio do Outlook hoje:** sem ele, a gaveta não deixa escrever.
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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Módulo 3.3 ligado (D5) | Sistema › Módulos | O botão não aparece |
| Correio do Outlook (D1) | Perfil › Integrações | O botão abre a gaveta com o aviso "Nenhuma conta integrada disponível" |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Correio do Outlook (D1) | Perfil › Integrações | Aviso no lugar do formulário |
| Modelos de E-mail cadastrados (D17) | Configurações › E-mails › Modelos de E-mail | Campo Template vazio |
| Assinatura configurada na conta do Outlook | Outlook da pessoa | "Inserir assinatura" não insere nada |
| Envio sem item: confirmar que o `send-email` sem `item_ref` grava em `sendmails` (D20) | Dev (back) | O e-mail sai, mas não aparece em E-mails › Enviados |

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

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Rota de busca de item entre categorias, filtrada por permissão (D19). A busca global (Ctrl K) não procura itens: navega por menus e ações | Dev (back) | Sem a busca; o vínculo só vem quando a pessoa começa no item |
| Permissão de ver a categoria e o item (D10) | Cargo | O item não aparece |
| Contatos configurados nas categorias (D6), para as sugestões | Cartão da categoria | Sem sugestões; a busca continua |
| Pasta Mail Box na categoria escolhida (D9) | Estrutura › Categorias › Pastas | Aviso no bloco; o e-mail não aparece na tela do item |

**Como a pessoa usa**

- Do item: clica em E-mail; o item já está vinculado; envia.
- De outra tela: clica em "Novo e-mail", preenche o Para, clica na sugestão ou digita na busca,
  escolhe o item e envia.

**Por que assim**

- O documento pede busca por "nome/titulo do item, ID, Folder, Workspace" e que a pessoa nunca ache
  item sem acesso.
- Só o workspace atual porque o endereço do item e as permissões são do workspace.

### 6.5 Sem o Correio do Outlook integrado

- A gaveta mostra "Nenhuma conta integrada disponível." e "Integrar contas", que abre Perfil ›
  Integrações. É o comportamento de hoje.
- O botão E-mail dos atalhos abre o app da pessoa (`mailto:`), sem o caminho do ENSPACE.
- No protótipo: cenário "Sem Outlook integrado", na barra de baixo.

### 6.6 Área "E-mails" no menu

**Como funciona**

- Entrada "E-mails" na seção Membro do menu, que entra junto com o módulo 3.3. Abas Recebidos e
  Enviados, busca e o filtro Todos, Com item e Sem item.
- Recebidos: o que chegou nos endereços dos itens e nas Caixas de E-mail do workspace. A coluna Item
  mostra o item ou "Sem item".
- Enviados: o que a pessoa enviou pelo ENSPACE, com ou sem item.
- E-mail sem item tem "Vincular" na linha. Na leitura, aparecem antes os itens em que o remetente é
  contato.
- Só aparecem e-mails de itens que a pessoa pode ver.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Listar recebidos e enviados por pessoa e por permissão. Os dados existem (`c-mailbox-messages` e `sendmails`); a tela "Emails Recebidos" (`/itemEmails`) existe sem entrada no menu | Dev (back e front) | Sem a área |
| Envio sem item gravado e rota de vincular depois (D20) | Dev (back) | E-mail sem item fora da lista; sem "Vincular" |
| Regra de quem vê o que chega nas Caixas de E-mail do workspace | Produto | A definir; hoje a caixa é porta de entrada de Spaceflow |
| Permissão de ver o item (D10) | Cargo | O e-mail do item não aparece |

**Como a pessoa usa**

1. Abre E-mails no menu.
2. Filtra "Sem item".
3. Clica em Vincular, escolhe a sugestão ou busca o item.

**Por que assim**

O documento pede que o e-mail vinculado apareça "na área de E-mail do usuário". Essa área existe
escondida: a tela "Emails Recebidos", sem entrada no menu.

### 6.7 Mail Box do item (já existe)

- Endereço do item com botão de copiar, abas Recebidos e Enviados, lápis para escrever e Responder
  em cada e-mail.
- O protótipo só acrescenta: o lápis abre o mesmo compositor de 6.3, já vinculado ao item.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Pasta Mail Box na categoria (D9) | Estrutura › Categorias › Pastas | A aba não aparece no item |
| Correio do Outlook (D1), para escrever e responder | Perfil › Integrações | A pessoa lê, mas a gaveta não deixa escrever |

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
5. **Quem não usa Microsoft:** cliente com Google fica só com o `mailto:`. Isso basta, ou a
   integração com Google entra no roteiro?
6. **Telefone do membro:** entra no perfil? Sem ele, WhatsApp e SMS para o responsável da tarefa
   não funcionam.
7. **SDK:** a prop `cardActions` no `EnKanbanBoard` entra no roteiro do SDK?
8. **Registro do contato:** o mockup do Felipe diz que o contato fica no Log de Auditoria. O log só
   registra mudança de dado. Registrar o clique em WhatsApp e SMS pede um tipo de evento novo. Vale?

## 9. O que o protótipo não faz

- Não abre o app: mostra num aviso o link exato que abriria (`mailto:`, `https://wa.me/...`,
  `sms:`).
- Não envia e-mail: guarda na memória e some ao recarregar.
- Não tem cargo nem permissão de edição: "Cadastrar telefone" aparece sempre (no produto, só para
  quem pode editar o campo).
- A referência do item aparece curta (ex.: CTR-00231) para leitura. No produto é o código de 32
  caracteres (ex.: LEV4E6DB…), e o endereço do item usa esse código.
- O andaime (barra de baixo) troca os cenários: Normal, Sem Outlook integrado e Envio falha.

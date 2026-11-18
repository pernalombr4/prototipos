# Comunicação no workspace: lógica da funcionalidade

Para dev e produto. Protótipo: https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/
(18/11/2026, rodada 6). O controle "Fase", na barra de baixo do protótipo, troca entre as 3 fases.

## 1. Resumo

O documento do Felipe pede 3 coisas. Cada uma tem configuração e uso:

| Parte | O que a pessoa faz | Onde configura |
|---|---|---|
| Atalho de e-mail | Escreve ao contato do item, ao responsável da tarefa ou aos participantes de um evento, pelo ENSPACE ou pelo app de e-mail dela | Sistema › Módulos. Na Fase 2, também o cartão "Contato da categoria" |
| Link de formulário público | Copia ou envia o link do formulário público sem ir à configuração | Formulários da categoria (visibilidade, já existe) |
| E-mail do ENSPACE em qualquer tela | Escreve o e-mail de qualquer tela. Com um item aberto, o e-mail fica no item | Correio do Outlook no perfil de cada pessoa |

Regras que valem para tudo:

- **O canal é só e-mail.** WhatsApp e SMS ficam fora do plano.
- **Uma chave liga tudo:** "Atalhos de comunicação", em Configurações › Sistema › Módulos. Quem
  administra não escolhe telas nem canais.
- **O e-mail do ENSPACE sai da conta do Outlook da pessoa** (Fase 1). Na Fase 2, sai também de uma
  caixa do workspace. O item vinculado define para onde a resposta volta, não o remetente.
- **O Correio do Outlook é do perfil de cada pessoa.** Cada pessoa integra a própria conta em Perfil
  › Integrações. O administrador não liga pelos outros.
- **Contato sem e-mail deixa o botão indisponível, com o motivo** e, no item, o atalho para
  preencher.

Cada ponto das seções 4 a 7 diz em que fase entra e tem um bloco **Depende de**: o que precisa
existir, onde se resolve e o que a pessoa vê quando falta. A seção 3 junta as dependências num mapa.

## 2. As 3 fases

Cada fase soma à anterior.

| Fase | O que entra | O que já existe no produto | O que é novo |
|---|---|---|---|
| 1 · MVP | Atalho de e-mail nas telas de uso, com o contato tirado dos campos de e-mail que o item já tem; "Novo e-mail" no topo, que reconhece o item ou a tarefa aberta; compositor com o "De" à vista e o item da tela de origem; Mail Box em todo item e no painel da tarefa; link do formulário público nas telas de uso; lembrete por e-mail na Agenda | Envio pela conta do Outlook da pessoa; endereço do item; registro do e-mail com item; Mail Box do item; campos de e-mail da categoria e E-mail do Requisitante; link público e visibilidade do formulário; Modelos de E-mail | As telas e o módulo, sobre os dados e as rotas que já existem |
| 2 · Remetente | Contato por categoria (cartão "Contato da categoria"); busca de item entre categorias no compositor ("Vincular a item (opcional)"), com as sugestões pelo destinatário e o autocompletar do Para com contatos de outros itens; área E-mails no menu; escolher o "De" (conta do Outlook ou caixa do workspace); responder na mesma conversa; encaminhar; registrar o e-mail enviado sem item; vincular e trocar o vínculo depois | Caixas de E-mail do workspace, que hoje só recebem; tela "Emails Recebidos", sem entrada no menu; configuração da categoria em JSON | O contato da categoria (dado novo, a avaliar com os devs); a busca de item entre categorias; a lista de e-mails por pessoa e permissão; envio por caixa do workspace; resposta na conversa; encaminhar; registro sem item; rota de vínculo |
| 3 · Tarefa | "Vincular a tarefa" no compositor; Mail Box própria da tarefa ("Desta tarefa" e "Do item"); coluna Tarefa na área E-mails | Nada: a tarefa não tem vínculo com e-mail | Vínculo do e-mail com a tarefa |

**O que o código do develop faz hoje** (lido em 17/11/2026). É a base da Fase 1:

| Pergunta | Hoje |
|---|---|
| De onde sai o e-mail que a pessoa escreve? | Da integração dela com o Correio do Outlook. Não há envio pela caixa do workspace |
| O ENSPACE guarda o e-mail enviado? | Só com item. E-mail sem item fica só no Outlook da pessoa |
| Para que servem as caixas do workspace? | Receber (Central de Atendimento) e iniciar fluxo. Não enviam |
| Há resposta na mesma conversa? | Não: o "Responder" está comentado na tela. Na Fase 1, responder abre um e-mail novo com "Re:" |
| A tarefa tem vínculo com e-mail? | Não |

## 3. Mapa de dependências

| # | Dependência | De quem é | Existe hoje? | Fase | Pontos afetados | Se faltar |
|---|---|---|---|---|---|---|
| D1 | Correio do Outlook integrado no perfil da pessoa | Cada pessoa (Perfil › Integrações) | Sim | 1 | 5.1, 7 inteira | Fase 1: a gaveta mostra "Nenhuma conta integrada disponível." e o botão E-mail abre o app da pessoa. Fase 2: o "De" oferece só as caixas do workspace |
| D2 | Conta Microsoft corporativa | TI do cliente | Sim, só Microsoft | 1 | Os mesmos de D1 | Quem usa Google fica só com "Abrir no meu app de e-mail" |
| D3 | Calendário do Outlook integrado no perfil (outra integração, separada do Correio) | Cada pessoa (Perfil › Integrações) | Sim | 1 | 5.5 | As reuniões do Outlook não aparecem na Agenda |
| D4 | Módulo "Atalhos de comunicação" ligado | Administrador (Sistema › Módulos) | Não: é novo | 1 | 5, 6, 7.2 | Nenhum atalho de e-mail, sem "Novo e-mail" no topo e sem link público nas telas de uso |
| D5 | Contato configurado na categoria | Administrador (cartão "Contato da categoria") | Não: é novo, a avaliar com os devs | 2 | 4.2, 5.2, 5.3, 5.5, 7.4 | O item mostra "Nenhum contato neste item"; a lista e o quadro ficam sem o submenu "E-mail" |
| D6 | Campos de e-mail na categoria (E-mail, Pessoa/Empresa, E-mail do Requisitante) | Administrador (Estrutura › Categorias › Campos) | Sim | 1 | 4.2, 5.1, 5.2, 5.3, 5.5 | Fase 1: o item fica só com o contato "Requisitante", quando há. Fase 2: não há campo para escolher no cartão. O ícone ao lado do campo não aparece |
| D7 | E-mail preenchido no item | Quem usa (Visão Geral do item) | Sim | 1 | 5 | Botão indisponível: "Sem e-mail cadastrado" |
| D8 | Mail Box em todo item, sem a pasta precisar ser adicionada na categoria | Dev (front) | Não: hoje a Mail Box é uma pasta que alguém adiciona na categoria | 1 | 7.8, 7.9 | Na categoria sem a pasta, o e-mail sai, mas ele e a resposta não aparecem na tela do item |
| D9 | Permissão de ver a categoria e o item | Cargo (Gestão de Membros) | Sim | 1 | 5, 7.4, 7.7 | A pessoa não chega ao item. Na Fase 2, o item não aparece na busca nem na área E-mails |
| D10 | Permissão de editar o campo de e-mail | Cargo (Gestão de Membros) | Sim | 2 | 5.2 | Sem "Cadastrar e-mail"; fica só o motivo |
| D11 | Formulário com visibilidade Público e tipo Criação ou Geral | Administrador (Editar do formulário) | Sim | 1 | 6 | O link não aparece; formulário privado mostra o porquê |
| D12 | Tela Requisições no menu | Administrador (Interface › Menus) | Sim | 1 | 6.2 | Sem o cartão nessa tela; sobram a lista de itens e a tarefa |
| D13 | Spaceflow que gera tarefa de formulário (nó Formulário ou Operações de Dados manual) | Administrador (Spaceflow) | Sim | 1 | 6.2 | Não há tarefa de formulário |
| D14 | Configurações da Agenda: categorias com campo de data e tipos de tarefa marcados | Administrador (Agenda › Configurações) | Sim | 1 | 5.5 | O evento não aparece na Agenda |
| D15 | Modelos de E-mail cadastrados | Administrador (Configurações › E-mails › Modelos de E-mail) | Sim | 1 | 7.3 | Campo Template vazio |
| D16 | App de e-mail padrão no computador da pessoa (`mailto:`) | Cada pessoa ou o TI | Fora do ENSPACE | 1 | 5.1, 6 | O navegador não abre nada ou pergunta qual app usar |
| D17 | Rota de busca de item entre categorias, filtrada por permissão | Dev (back) | Não | 2 | 7.3, 7.4, 7.7 | Sem a busca de "Vincular a item"; fica o item da tela de origem, como na Fase 1 |
| D18 | Lista de e-mails por pessoa e por permissão, para a área E-mails | Dev (back e front) | Em parte: os dados e a tela "Emails Recebidos" existem; a tela não tem entrada no menu | 2 | 7.7 | Sem a área E-mails |
| D19 | Envio por caixa do workspace | Dev (back) | Não: as caixas só recebem | 2 | 7.3 | O "De" tem só a conta do Outlook |
| D20 | Resposta na mesma conversa e encaminhar | Dev (back e front) | Não: o "Responder" está comentado na tela | 2 | 7.5 | Responder abre um e-mail novo com "Re:"; sem "Encaminhar" |
| D21 | Registro do e-mail enviado sem item e rota para vincular e trocar o vínculo depois | Dev (back) | Não | 2 | 7.3, 7.7 | Sem item, o e-mail fica só no Outlook; sem "Vincular" |
| D22 | Vínculo do e-mail com a tarefa | Dev (back) | Não | 3 | 7.3, 7.7, 7.9 | Sem "Vincular a tarefa"; a Mail Box da tarefa mostra os e-mails do item |
| D23 | Prop `cardActions` no `EnKanbanBoard`, o quadro do SDK (o kit de componentes do ENSPACE) | Dev (SDK) | Não | Opcional | 5.3, 5.4 | O atalho fica só no clique direito, sem botão no cartão |

## 4. Configuração (quem administra o workspace)

### 4.1 Módulo "Atalhos de comunicação" (Fase 1)

**Como funciona**

- Fica em Configurações › Sistema › Informações Básicas, cartão Módulos, ao lado de Correção
  Monetária e Comparações.
- É 1 chave só. Ligada, mostra o bloco "O que o módulo ativa":
  - E-mail no campo de e-mail do item;
  - E-mail no menu da lista e do quadro de itens;
  - E-mail para o responsável da tarefa;
  - Lembrete por e-mail na Agenda;
  - Novo e-mail no topo de toda tela;
  - Link do formulário público nas telas de uso.
- O fim do bloco muda com a fase:
  - Fase 1: "O contato de cada item vem dos campos de e-mail que a categoria já tem e do e-mail de
    quem abriu a requisição.", sem link;
  - Fase 2: "Defina na própria categoria os campos de nome e de e-mail do contato." e o link
    "Escolher o contato de cada categoria", que abre o cartão da categoria (4.2).
- A Mail Box do item e da tarefa e, na Fase 2, a área E-mails não dependem da chave.
- O Salvar do cartão Módulos grava, como nos outros módulos.
- Dado: a chave fica junto dos outros módulos do workspace (`Workspace.modules`).

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Acesso a Configurações › Sistema | Cargo (Gestão de Membros) | Não vê o cartão Módulos |
| Back aceitar e guardar a chave nova em `Workspace.modules` | Dev | A configuração não grava |

**Como a pessoa usa**

1. Abre Configurações › Sistema.
2. Liga "Atalhos de comunicação" no cartão Módulos.
3. Clica em Salvar.
4. Na Fase 2, clica em "Escolher o contato de cada categoria" (4.2).

**Por que assim**

- O documento pede: "Todos esses botões devem ter opção nas configurações de aparecerem ou não nas
  telas, do mesmo modo como foi feito em correções monetárias, comparador". Os 2 módulos citados
  moram nesse cartão.
- Com 1 canal e telas fixas, não há o que escolher além de ligar e desligar.

### 4.2 Cartão "Contato da categoria" (Fase 2, a avaliar com os devs)

**Como funciona**

- Na Fase 1 não há cartão: o contato vem dos campos de e-mail que o item já tem (5.2).
- 13º cartão no painel da categoria (Configurações › Estrutura › Categorias › categoria), ao lado
  do cartão Correção Monetária. Descrição: "Quem é o contato do item e o assunto do e-mail."
- A página tem 3 blocos:
  - **"Quem é o contato":** cada contato tem o "Nome do contato na tela" e 2 origens, nome e
    e-mail. Uma categoria tem 1 ou mais contatos (Contratos: "Contato da contraparte" e
    "Requisitante"). "Adicionar contato" cria outro;
  - **"Assunto do e-mail":** o assunto com que o e-mail abre, com as variáveis `{referencia}`,
    `{titulo}`, `{nome}` e `{categoria}` (botões em "Inserir:");
  - **"Prévia: o que o botão E-mail abre":** para cada contato, com um item de exemplo, o Para, o
    Assunto e o Cc (o endereço do item).
- Origens aceitas:

| Dado | Campos que servem |
|---|---|
| Nome | Texto curto; Pessoa/Empresa › Nome de contato |
| E-mail | Campo E-mail; Pessoa/Empresa › E-mail de contato; E-mail do Requisitante (campo padrão de toda categoria) |

- Com o módulo desligado, o cartão mostra "Módulo desligado". A página avisa que a configuração
  fica guardada e passa a valer quando alguém ligar o módulo.
- Dado: a categoria já guarda configuração em JSON. O contato caberia ali, mas é dado novo. Onde
  guardar é pergunta para os devs (9, pergunta 1).

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Módulo 4.1 ligado (D4) | Sistema › Módulos | A configuração grava, mas os atalhos não aparecem |
| Campos de e-mail na categoria (D6) | Estrutura › Categorias › Campos | Não há campo para escolher |
| Back aceitar e guardar o contato da categoria | Dev | A configuração não grava |

**Como a pessoa usa**

1. Abre a categoria e o cartão "Contato da categoria".
2. Escolhe, para cada contato, de quais campos vêm o nome e o e-mail.
3. Ajusta o assunto e confere a prévia.
4. Clica em Salvar.

**Por que assim**

- Cada categoria tem os seus campos. O contato de um contrato não mora no mesmo campo que o de uma
  solicitação, e o sistema não sabe sozinho qual campo é o do contato.
- O assunto é por categoria porque o de um contrato e o de uma solicitação são diferentes.
- Na Fase 2, o contato alimenta o "Contato do item" (5.2), o submenu da lista (5.3), o lembrete da
  Agenda (5.5) e as sugestões do compositor (7.4).
- Fica na Fase 2 porque é dado novo: pede onde guardar no back. A Fase 1 usa só o que o item já
  tem.

### 4.3 Correio do Outlook (cada pessoa, já existe)

**Como funciona**

- Perfil › Integrações › Correio do Outlook, com login na conta Microsoft corporativa (OAuth2,
  o protocolo de autorização da Microsoft).
- Sem essa integração, a gaveta "Nova Mensagem" mostra "Nenhuma conta integrada disponível." e o
  botão "Integrar contas".
- Só Microsoft. Google não tem integração.
- É diferente do Calendário do Outlook (D3), que traz as reuniões para a Agenda. Uma não liga a
  outra.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Conta Microsoft corporativa (D2) | TI do cliente | Não há o que integrar |
| Autorização do app do ENSPACE na conta Microsoft. A documentação avisa que ele pode aparecer como "não verificado"; onde o TI bloqueia apps assim, o TI libera | TI do cliente | O login falha |

**Como a pessoa usa**

1. Clica nas iniciais, no canto superior direito, e em Configurações do Usuário.
2. Abre Integrações e clica em Sincronizar no card Correio do Outlook.
3. Faz login na Microsoft e aceita as permissões.

### 4.4 Caixas de E-mail do workspace como remetente (Fase 2)

**Como funciona**

- As caixas já existem em Configurações › E-mails › Caixas de E-mail. Hoje recebem (Central de
  Atendimento) e iniciam fluxo.
- Na Fase 2, as caixas aparecem no "De" do compositor (7.3). A configuração da caixa não muda.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Envio por caixa do workspace (D19) | Dev (back) | O "De" tem só a conta do Outlook |
| Regra de quem envia por qual caixa | Produto (9, pergunta 2) | A definir |

## 5. Atalho de e-mail (quem usa)

### 5.1 Regras de todo atalho (Fase 1)

**Como funciona**

- O atalho tem 2 caminhos:
  - **"Escrever pelo ENSPACE":** abre o compositor (7.3), com o item vinculado e o contato em Para;
  - **"Abrir no meu app de e-mail":** abre o app padrão do computador pelo link
    `mailto:<para>?cc=<endereço do item>&subject=<assunto>`.
- O botão E-mail é dividido: o clique no corpo escreve pelo ENSPACE; a seta ("Outras formas de
  enviar e-mail") abre o app. Onde só cabe ícone ou menu (linha da tabela, cartão, tarefa), os 2
  caminhos vão num menu.
- Sem por onde enviar pelo ENSPACE (Fase 1 sem o Correio do Outlook), o botão abre direto o app.
- O assunto abre preenchido. Na Fase 1, com um padrão fixo, sem configuração. Na Fase 2, vem do
  cartão "Contato da categoria", com as variáveis trocadas. A pessoa muda tudo antes de enviar.
- No app, o endereço do item vai em Cc. A cópia chega à Mail Box do item, e a resposta volta para
  lá quando o destinatário responde a todos. Sem o Cc, o ENSPACE não fica sabendo do e-mail.
- Contato sem e-mail deixa o botão indisponível, com o motivo na dica e no nome acessível: "Sem
  e-mail cadastrado" ou "Sem contato". O botão continua no Tab do teclado (`aria-disabled`).
- Com o módulo desligado, o botão não aparece.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Módulo 4.1 ligado (D4) | Sistema › Módulos | O botão não aparece |
| Fase 1: campos de e-mail na categoria (D6) | Estrutura › Categorias › Campos | Sem contato para o botão |
| Fase 2: contato configurado na categoria (D5) | Cartão "Contato da categoria" | Sem contato para o botão |
| E-mail preenchido no item (D7) | Visão Geral do item | Botão indisponível com o motivo |
| Permissão de ver o item (D9) | Cargo | A pessoa não chega ao item |
| Correio do Outlook (D1), para "Escrever pelo ENSPACE" | Perfil › Integrações | O botão abre direto o app |
| App de e-mail padrão no computador (D16), para "Abrir no meu app de e-mail" | Computador da pessoa ou TI | O navegador não abre nada ou pergunta qual app usar |

**Por que assim**

- O caminho do ENSPACE vem primeiro porque só nele o e-mail sempre fica no item.
- O app fica a 1 clique para quem prefere o Outlook ou não tem a integração. O documento pede o
  `mailto:`.
- O motivo na tela responde a pergunta que um botão cinza deixa: por que não funciona?

### 5.2 Item: "Contato do item" e ícone no campo de e-mail (Fase 1)

**Como funciona**

- **"Contato do item":** cartão no alto do painel esquerdo do item, acima de Identificação.
  - "Para quem": seletor com os contatos do item, quando há mais de 1;
  - na Fase 1, os contatos vêm do que o item já tem:
    - cada campo do tipo e-mail da categoria preenchido no item, com o nome do campo como rótulo e
      sem nome de pessoa;
    - o E-mail de contato de cada campo Pessoa/Empresa, com o nome do subcampo Nome de contato;
    - o e-mail de quem abriu a requisição, com o rótulo "Requisitante";
  - na Fase 2, os contatos vêm do cartão "Contato da categoria" (4.2): os que têm nome ou e-mail;
  - a linha embaixo do contato mostra o e-mail. Sem nome, mostra o nome do campo de onde o contato
    vem;
  - o botão E-mail dividido (5.1), com a linha "O e-mail sai pelo ENSPACE e fica na Mail Box de
    <referência>. A seta abre o seu app de e-mail.";
  - contato sem e-mail (Fase 2): "Este contato não tem e-mail cadastrado." e o botão "Cadastrar
    e-mail", que abre a Visão Geral com o cursor no campo. Na Fase 1, campo vazio não vira contato;
  - item sem nenhum contato preenchido: "Nenhum contato neste item" e "Os campos de contato deste
    item estão vazios." Na Fase 2, com o botão "Escolher os campos de contato", que abre o cartão da
    categoria.
- **Ícone de e-mail ao lado de cada campo de e-mail** da Visão Geral (campo E-mail e Pessoa/Empresa
  › E-mail de contato). A dica diz "Enviar e-mail para <nome do campo>". Não pede configuração: vale
  para todo campo desse tipo.
- **Mail Box em todo item** (7.8).

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 5.1 | Ver 5.1 | Ver 5.1 |
| Fase 2: permissão de editar o campo de e-mail (D10) | Cargo | Sem "Cadastrar e-mail"; fica só o motivo. Regra para o dev: o protótipo mostra o botão sempre |
| O campo de e-mail no formulário da Visão Geral | Formulário Editar ou Geral da categoria | Na Fase 1, a pessoa não preenche o e-mail do contato na tela do item. Na Fase 2, "Cadastrar e-mail" leva a um campo que não está na tela |
| Fase 2: "Cadastrar e-mail" não serve para o E-mail do Requisitante | Não se aplica | O campo é preenchido na criação do item |

**Como a pessoa usa**

1. Abre o item.
2. Escolhe o contato em "Para quem", se houver mais de 1.
3. Clica em E-mail, ou no ícone ao lado do campo de e-mail.
4. Sem contato, preenche o campo de e-mail na Visão Geral e salva. Na Fase 2, com o botão
   indisponível, clica em "Cadastrar e-mail", preenche e salva.

**Por que assim**

- É o desenho do Felipe (mockup 2). HubSpot, Close e Agendor põem o contato no alto do registro.
- O ícone no campo resolve o caso comum sem configuração: o e-mail está na tela, e o botão fica ao
  lado dele.

### 5.3 Lista e quadro de itens: submenu "E-mail" (Fase 1)

**Como funciona**

- **Lista:** o menu da linha ganha o submenu "E-mail", com um grupo por contato e os 2 caminhos de
  5.1. A coluna "Contato" mostra o nome e o e-mail do 1º contato do item. Na Fase 2, a coluna
  leva o rótulo do 1º contato da categoria.
- **Quadro:** o clique direito no cartão traz o mesmo submenu. A dica do quadro diz "Clique com o
  botão direito num cartão para enviar e-mail ao contato."
- Contato sem e-mail aparece com o motivo, indisponível.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 5.1 | Ver 5.1 | Sem o submenu |
| Para o botão no cartão (o "Notify" do mockup 5): prop `cardActions` no `EnKanbanBoard` (D23) | Dev (SDK) | Fica só o clique direito |

**Como a pessoa usa**

1. Abre o menu da linha, ou clica com o botão direito no cartão.
2. Passa o mouse em E-mail e escolhe o contato e o caminho.

**Por que assim**

- A lista já tem muitas colunas. O menu da linha já existe e recebe a ação sem ocupar espaço.
- O `EnKanbanBoard` do SDK não aceita ação extra no cartão. O clique direito funciona sem mudar o
  SDK.

### 5.4 Tarefas: e-mail para o responsável (Fase 1)

**Como funciona**

- Quem recebe é o **responsável** da tarefa (`Task.assigned_to`), um membro. O e-mail do membro
  sempre existe: é o login.
- **Lista:** coluna Contato, com o botão de e-mail por linha. Tarefa sem responsável mostra "Sem
  responsável".
- **Seleção de várias tarefas:** a barra ganha "E-mail para os <N> responsáveis", que abre 1 e-mail
  com todos em Para ("Abre 1 e-mail com todos os responsáveis em Para."). A barra diz quantas
  tarefas sem responsável ficam de fora.
- **Quadro:** o clique direito no cartão traz "Abrir tarefa", "Abrir a Mail Box" e "Enviar e-mail
  para <nome>".
- **Painel da tarefa:** abas Detalhes e Mail Box. Detalhes tem o botão de e-mail para o
  responsável; sem responsável, "Atribua um responsável para enviar o e-mail." A Mail Box está em
  7.9.
- O e-mail abre com assunto "Tarefa: <nome> (prazo <data>)" e o texto do lembrete. Com a tarefa
  ligada a um item, o e-mail vai vinculado a esse item.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 5.1 | Ver 5.1 | Sem a coluna e sem a barra |
| Tarefa com responsável | Quem cria ou pega a tarefa | Botão indisponível: "Sem responsável" |

**Como a pessoa usa**

1. Abre Tarefas › Rápidas, na visão Lista.
2. Seleciona as tarefas.
3. Clica em "E-mail para os <N> responsáveis", escreve e envia.

**Por que assim**

- O mockup 3 pede 1 rascunho para todos os responsáveis.
- Com só e-mail, o lote cabe num e-mail: não há fila de conversas.

### 5.5 Agenda: lembrete por e-mail (Fase 1)

**Como funciona**

O modal "Evento" ganha "Enviar lembrete", com o botão de e-mail por pessoa ("Enviar e-mail para
<nome>") e "E-mail para todos (<N>)". Quem recebe muda conforme a origem do evento:

| Origem do evento | Quem recebe (rótulo no modal) |
|---|---|
| Reunião do Outlook | "Participantes" |
| Data de um item (campo de data da categoria) | "Contatos do item" (5.2) |
| Prazo de uma tarefa | "Responsável" |

O e-mail abre com o assunto "Lembrete: <evento> (<quando>)" e o texto com data, hora e, na reunião
do Outlook, o local. A ajuda diz "O e-mail abre com data, hora e assunto preenchidos. É possível
alterar o texto antes do envio."

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 5.1 | Ver 5.1 | Sem "Enviar lembrete" |
| Reunião: Calendário do Outlook no perfil (D3), que não é o Correio do Outlook | Perfil › Integrações | A reunião não aparece na Agenda |
| Data de item: a categoria marcada nas Configurações da Agenda, com o campo de data, e permissão na categoria (D14, D9) | Agenda › Configurações; cargo | O evento não aparece |
| Data de item, Fase 1: campos de e-mail na categoria (D6) | Estrutura › Categorias › Campos | Sem quem recebe |
| Data de item, Fase 2: contato configurado na categoria (D5) | Cartão "Contato da categoria" | Sem quem recebe |
| Prazo de tarefa: "Fluxo Padrão" ou "Tarefas Rápidas" marcados nas Configurações da Agenda (D14) | Agenda › Configurações | A tarefa não aparece |

**Como a pessoa usa**

1. Abre a Agenda e clica no evento.
2. Clica em "E-mail para todos" ou no botão de uma pessoa.

**Por que assim**

A Agenda junta 3 origens. Só a reunião do Outlook tem participantes; nas outras, quem recebe vem do
item ou da tarefa.

### 5.6 Tela inicial: sem atalhos

O mockup 6 do Felipe põe os atalhos e o "Link de formulário público" abaixo da saudação. O
protótipo não põe, porque a tela inicial não tem contexto para eles:

| Atalho | O que faltaria na tela inicial |
|---|---|
| E-mail | Item para vincular e contato para o Para. O e-mail sem contexto já existe no "Novo e-mail" da barra do topo (7.2) |
| Link de formulário público | Qual formulário: o workspace tem vários, de categorias diferentes |

O link público fica onde o formulário está em uso (6.2). **Pergunta para produto:** o Felipe
concorda em tirar a linha da tela inicial?

## 6. Link de formulário público (Fase 1)

### 6.1 A regra

**Como funciona**

- O link aparece só para formulário **público** de tipo **Criação** ou **Geral**.
- O link é o que já existe: `/public/<formulário>/Answer`. Abre sem login e não expira.
- Quem responde pelo link cria um item na categoria do formulário.
- "Copiar link" mostra o aviso "Link copiado", o mesmo texto em todo lugar.
- "Enviar o link por" usa o atalho de e-mail de 5.1, com o link no texto e o Para em branco.
- "Abrir numa nova aba" abre a página pública.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Formulário Público, de tipo Criação ou Geral (D11) | Editar do formulário › Visibilidade | O link não aparece |
| Módulo 4.1 ligado (D4) | Sistema › Módulos | O link só se copia na configuração, como hoje |
| Enviar o link pelo app: app de e-mail padrão (D16) | Computador da pessoa | O app não abre |
| Enviar o link pelo ENSPACE: Correio do Outlook (D1) | Perfil › Integrações | O e-mail abre no app da pessoa |

**Por que assim**

- Editar e Visualizar dependem de um item que o link não leva.
- Hoje o link só se copia em Configurações › Estrutura › Categorias › Formulários, com 6 cliques. O
  documento pede o link "nas telas de tarefas, itens ou onde o usuário preenche o formulário".
- Hoje há 2 avisos para a mesma ação: "Copiado!" e "Link copiado para a sua área de transferência".

### 6.2 Onde aparece

| Tela | O que aparece | Jornada | Depende também de |
|---|---|---|---|
| Requisições | Cartão "Compartilhar este formulário" entre o seletor e o formulário | Escolhe o formulário, clica em "Copiar link" ou em "Enviar o link por" | A tela Requisições no menu (D12) |
| Lista de itens | Botão "Link de formulário público" ao lado de "Novo registro", só com os formulários públicos da categoria | Abre o menu, copia ou envia | Permissão de ver a categoria (D9) |
| Painel da tarefa de formulário | O mesmo cartão, com a linha "A resposta pelo link cria um item novo em <categoria>. Esta tarefa continua aberta até você concluí-la." | Abre a tarefa, copia ou envia | Um Spaceflow que gera a tarefa de formulário (D13) |
| Formulários da categoria | "Copiar" (já existe) e "Tornar público" ou "Tornar privado" no menu da linha | Atalho para o Editar › Visibilidade, que já existe | Acesso à configuração da categoria |

Formulário privado mostra 1 linha: "Formulário privado: só membros do workspace respondem. Por isso
não tem link para enviar."

**Por que a linha na tarefa**

A tarefa de formulário vem de um Spaceflow e só fecha quando o responsável preenche e conclui. A
resposta pelo link público cria um item à parte. Sem a linha, a pessoa acha que o link conclui a
tarefa.

## 7. E-mail do ENSPACE em qualquer tela

**Depende de, para a seção inteira**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Correio do Outlook no perfil da pessoa (D1), com conta Microsoft (D2) | Cada pessoa, em Perfil › Integrações | Fase 1: a gaveta mostra "Nenhuma conta integrada disponível." e "Integrar contas"; os atalhos abrem o app. Fase 2: o "De" oferece só as caixas do workspace |
| Mail Box em todo item (D8) | Dev (front) | Na categoria sem a pasta, o e-mail vinculado sai, mas não aparece na tela do item |

### 7.1 Como o envio funciona hoje (base da Fase 1)

Lido no código da gaveta "Nova Mensagem" da Mail Box, no develop:

- O envio é `POST user-integrations/microsoft/send-email`, com `to`, `cc`, `bcc`, `replyTo`,
  `subject`, `message`, `attachments` e `item_ref`.
- O remetente é a conta do Outlook que a pessoa integrou. **Por isso a Mail Box do item já depende
  do Correio do Outlook hoje:** sem ele, a gaveta não deixa escrever.
- No item, `replyTo` e `mailBox` recebem o endereço do item, e `item_ref` recebe a referência do
  item. O endereço do item é `<referência do item em minúsculas>.<referência do
  workspace>@<domínio das caixas>`.
- O registro do e-mail enviado exige o item. Sem item, o e-mail sai, mas não fica no ENSPACE.
- A resposta do destinatário chega no endereço do item e aparece em Mail Box › Recebidos. O enviado
  aparece em Mail Box › Enviados.
- O template (Configurações › E-mails › Modelos de E-mail) troca as variáveis pelos dados do item.
- Há "Inserir assinatura", com a assinatura da conta do Outlook.

O vínculo fica gravado pela referência do item, não pelo nome. É o que o documento pede.

### 7.2 "Novo e-mail" na barra do topo (Fase 1)

**Como funciona**

- Botão com rótulo na barra do topo, ao lado de Suporte. A tecla C abre o compositor fora de campo
  de texto. Com rascunho guardado, o botão ganha um ponto.
- **Reconhece a tela aberta:**
  - com um item aberto, o compositor abre vinculado a ele, com o 1º contato com e-mail em Para. A
    dica do botão diz "Escrever um e-mail vinculado a <referência>";
  - com uma tarefa aberta no painel, o compositor abre vinculado ao item da tarefa. Na Fase 3,
    também à tarefa;
  - nas outras telas, abre sem vínculo. A dica diz "Escrever um e-mail sem sair desta tela". Na
    Fase 1, o compositor abre sem o bloco do item; na Fase 2, com a busca (7.4).

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Módulo 4.1 ligado (D4) | Sistema › Módulos | O botão não aparece |
| Correio do Outlook (D1) | Perfil › Integrações | Fase 1: o botão abre a gaveta com o aviso "Nenhuma conta integrada disponível." |

**Como a pessoa usa**

1. Em qualquer tela, clica em "Novo e-mail" ou aperta C.
2. Escreve (7.3) e envia.

**Por que assim**

- O documento pede o e-mail "da mesma forma que outras funcionalidades transversais da plataforma".
  As transversais de hoje (Suporte, notificações) moram na barra do topo.
- Quem está num item quase sempre escreve sobre ele. Na Fase 1, a tela de origem é o único jeito
  de vincular o e-mail a um item. Na Fase 2, o vínculo pronto evita o passo de buscar.

### 7.3 O compositor

**Como funciona**

| Campo | Regra | Fase |
|---|---|---|
| De | Fase 1: a conta do Outlook da pessoa, só leitura, com "Sua conta do Outlook". Hoje a tela não mostra o remetente | 1 |
| De, com escolha | Lista em 2 grupos: "Sua conta" (o Outlook) e "Caixas do workspace". A caixa escolhida mostra "Caixa do workspace" | 2 |
| Ajuda do De | Com item: "Responder para: o endereço do item. A resposta volta para a aba Mail Box." e o endereço. Sem item, Fase 1: "Sem item vinculado, o e-mail fica só no seu Outlook e não aparece no ENSPACE." Sem item, Fase 2: "Sem item vinculado, a resposta chega só no seu Outlook." ou, com caixa, "Sem item vinculado, a resposta chega na caixa <nome>, na Central de Atendimento." | 1 e 2 |
| Para | Obrigatório. Sugere os contatos do item vinculado e os membros | 1 |
| Para, com os contatos de outros itens | O autocompletar sugere também os contatos dos itens que a pessoa vê | 2 |
| Cc e Cco | Atrás de "Adicionar em Cópia", como hoje | 1 |
| Template | Os Modelos de E-mail. As variáveis só se preenchem com item vinculado | 1 |
| Assunto | Livre. Vindo de um atalho, já vem com o assunto da categoria | 1 |
| Item vinculado | Só quando o compositor abre de uma tela com item. Sem item de origem, o bloco não aparece (7.4) | 1 |
| Vincular a item (opcional) | Bloco separado dos campos do e-mail, com busca (7.4) | 2 |
| Vincular a tarefa (opcional) | Lista das tarefas do item vinculado (ou de todas, sem item) e "Nenhuma tarefa". Ajuda: "O e-mail aparece também na Mail Box da tarefa." | 3 |
| Mensagem | Obrigatória. Editor com negrito, itálico, sublinhado, tachado, listas e link | 1 |
| Anexar arquivo e Inserir assinatura | Como hoje | 1 |

- Enviar: botão ou Ctrl+Enter. O aviso depois do envio:
  - com item: "Vinculado a <referência>. As respostas voltam para o item.", com "Ver no item";
  - sem item, Fase 1: "Enviado de <remetente>. Sem item vinculado, o e-mail fica só no seu Outlook
    e não aparece no ENSPACE.";
  - sem item, Fase 2: "Enviado de <remetente>, sem item vinculado. O e-mail fica em E-mails.", com
    "Ver em E-mails".
- Falha no envio: "E-mail não enviado". O rascunho continua aberto.
- Descartar: o aviso "Rascunho descartado" traz "Desfazer".
- A gaveta não escurece nem trava a página. Minimizar, Esc e o X guardam o rascunho numa barra no
  rodapé, que continua na troca de tela. Expandir alarga a gaveta.
- Ao abrir, o cursor vai para o Para; com destinatário pronto, vai para o texto.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Correio do Outlook (D1) | Perfil › Integrações | Fase 1: aviso no lugar do formulário |
| Modelos de E-mail cadastrados (D15) | Configurações › E-mails › Modelos de E-mail | Campo Template vazio |
| Assinatura configurada na conta do Outlook | Outlook da pessoa | "Inserir assinatura" não insere nada |
| Fase 2: busca de item entre categorias (D17) | Dev (back) | Fica o item da tela de origem, sem busca |
| Fase 2: envio por caixa do workspace (D19) | Dev (back) | O "De" fica só com a conta do Outlook |
| Fase 2: registro do e-mail sem item (D21) | Dev (back) | Sem item, o e-mail fica só no Outlook |
| Fase 3: vínculo do e-mail com a tarefa (D22) | Dev (back) | Sem "Vincular a tarefa" |

**Por que assim**

- É a mesma gaveta "Nova Mensagem" de hoje, na mesma ordem, como o documento pede.
- O "De" e o "Responder para" à vista evitam que a pessoa ache que o e-mail sai do endereço do item.
- Na Fase 1, a ajuda do De avisa que o e-mail sem item não fica no ENSPACE. Sem o aviso, a pessoa
  procura o e-mail no ENSPACE e não acha.
- Na Fase 2, a ajuda diz para onde vão as respostas, porque muda com o remetente.
- A gaveta que não trava a página deixa consultar o item durante a escrita, como Salesforce e Gmail.

### 7.4 Item vinculado (Fase 1) e Vincular a item (Fase 2)

**Como funciona na Fase 1: "Item vinculado"**

- O bloco aparece só quando o compositor abre de uma tela com item: o item, a tarefa com item, a
  Mail Box ou o "Novo e-mail" do topo com um item aberto.
- Mostra nome, referência e categoria, sem "(opcional)", sem Trocar e sem remover.
- Ajuda: "O e-mail fica na Mail Box de <referência>, e a resposta volta para lá."
- Sem item de origem, o bloco não aparece. A ajuda do De já avisa que o e-mail fica só no Outlook
  (7.3).

**Como funciona na Fase 2: "Vincular a item (opcional)"**

- Campo de busca (autocompletar), não lista. Vazio, mostra os 5 itens atualizados por último. Com
  texto, os 8 melhores e quantos ficaram de fora.
- Procura em referência, ID, nome, categoria, contatos e campos de texto. Agrupa por categoria e
  mostra ID e etapa, para separar itens de nome parecido.
- Só itens que a pessoa pode ver, no workspace atual. Item sem permissão não aparece nem na
  contagem.
- Antes da busca, até 3 sugestões: itens em que alguém do Para é contato.
- Escolhido o item: nome, referência e categoria, com Trocar e o X para remover.
- Aberto a partir de um item: já vem vinculado, com a linha "Vinculado porque você começou no item.
  É possível trocar ou remover o vínculo."
- Aberto a partir de uma tarefa: "Vinculado ao item da tarefa. É possível trocar ou remover o
  vínculo."
- Trocar o item na Fase 3 limpa a tarefa vinculada quando ela é de outro item.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Fase 2: rota de busca de item entre categorias, filtrada por permissão (D17). A busca global (Ctrl K) não procura itens: navega por menus e ações | Dev (back) | Sem a busca; fica o item da tela de origem, como na Fase 1 |
| Permissão de ver a categoria e o item (D9) | Cargo | O item não aparece |
| Fase 2: contato configurado nas categorias (D5), para as sugestões | Cartão "Contato da categoria" | Sem sugestões; a busca continua |

**Como a pessoa usa**

- Do item: clica em E-mail; o item já está vinculado; envia.
- De outra tela, na Fase 2: clica em "Novo e-mail", preenche o Para, clica na sugestão ou digita
  na busca, escolhe o item e envia.

**Por que assim**

- Na Fase 1, o item vem da tela de origem porque o envio com item já existe. A busca entre
  categorias pede rota nova no back.
- O documento pede busca por "nome/titulo do item, ID, Folder, Workspace" e que a pessoa nunca ache
  item sem acesso.
- Só o workspace atual porque o endereço do item e as permissões são do workspace.

### 7.5 Responder e encaminhar

**Como funciona**

| | Fase 1 | Fase 2 |
|---|---|---|
| Responder | Abre um e-mail novo, com "Re:" no assunto, o texto original citado e o aviso "A resposta sai como uma mensagem nova, com o texto original citado. Ela não entra na mesma conversa." | A resposta segue na mesma conversa. O aviso diz "A resposta segue na mesma conversa do e-mail original." |
| Encaminhar | Não há | Abre o compositor com "Enc:", o texto citado, os anexos e o Para vazio |

- O e-mail respondido ou encaminhado mantém o item vinculado (e a tarefa, na Fase 3).
- "Responder" aparece no hover da linha da Mail Box, no e-mail aberto e, na Fase 2, na área
  E-mails.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Fase 2: resposta na mesma conversa e encaminhar (D20) | Dev (back e front) | Fica o comportamento da Fase 1 |

**Por que assim**

O "Responder" está comentado na tela do develop. A Fase 1 entrega a resposta com o que o envio de
hoje aceita: um e-mail novo, com o aviso para a pessoa não esperar a mesma conversa.

### 7.6 Sem o Correio do Outlook integrado

- Fase 1: a gaveta mostra "Nenhuma conta integrada disponível." e "Integrar contas", que abre
  Perfil › Integrações. É o comportamento de hoje. O botão E-mail dos atalhos abre o app da pessoa
  (`mailto:`).
- Fase 2: o "De" oferece só as caixas do workspace. A pessoa escreve pelo ENSPACE sem a integração.
- No protótipo: cenário "Sem Outlook integrado", na barra de baixo.

### 7.7 Área "E-mails" no menu (Fase 2)

**Como funciona**

- Na Fase 1 não há a entrada no menu. O e-mail fica na Mail Box do item e da tarefa (7.8, 7.9).
- Entrada "E-mails" na seção Membro do menu. O subtítulo diz "Os e-mails recebidos e enviados pelo
  ENSPACE, com ou sem item."
- Segue o padrão de tabela e filtros das telas novas do develop (Logs de Auditoria e a tabela nova
  de itens):
  - **barra:** busca, período ("Todo o período", "Hoje", "Últimos 7 dias", "Últimos 30 dias"),
    "Limpar filtros", "Colunas" e o botão que mostra os filtros rápidos;
  - **filtros rápidos:** "Recebidos", "Enviados", "Não lidos", "Com anexo" e "Sem item";
  - **colunas:** "Ações" primeiro (menu ⋮), depois Tipo, De, Para, Assunto, Item, Tarefa (Fase 3),
    Enviado por e Data. "Colunas" esconde e mostra as opcionais;
  - **cabeçalho:** ordenar e o funil do filtro da coluna. No texto, o operador em frase ("É
    totalmente Igual a", "É totalmente Diferente De", "Contém parcialmente", "Não contém" e as
    variantes que diferenciam maiúsculas), cada operador 1 vez. Na seleção, busca, "Todos" e
    "Limpar";
  - **paginação:** "Mostrando 1 a 10 de 10 resultados", com 10, 25, 50 ou 100 por página;
  - **clique direito na linha:** o mesmo menu da coluna Ações.
- Menu de ações: "Ver Detalhes", "Responder", "Encaminhar", "Marcar como não lido" (no recebido
  lido) e "Ver Item" ou, sem item, "Vincular a um item".
- O clique na linha abre a leitura num painel lateral: Tipo, De (com o nome da caixa, quando é
  caixa do workspace), Para, Cc, Enviado por, Tarefa (Fase 3), o item vinculado e o corpo. Botões:
  "Responder", "Encaminhar" e "Marcar como não lido".
- **Vínculo com o item na leitura:**
  - com item: o item, com "Trocar";
  - sem item: "Este e-mail não tem item. Ao vincular, ele passa a aparecer na aba
    Mail Box do item.", as "Sugestões pelo destinatário" (itens em que o remetente ou o
    destinatário é contato) e a busca de 7.4. O aviso confirma "E-mail vinculado".
- Só aparecem e-mails de itens que a pessoa pode ver.
- O botão "Novo e-mail" no alto da tela abre o compositor sem vínculo.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Lista de e-mails por pessoa e permissão (D18). Os dados existem; a tela "Emails Recebidos" (`/itemEmails`) existe sem entrada no menu | Dev (back e front) | Sem a área |
| Registro do e-mail sem item e rota para vincular e trocar o vínculo (D21) | Dev (back) | Sem o filtro "Sem item" e sem "Vincular" |
| Busca de item entre categorias (D17), para vincular na leitura | Dev (back) | Sem a busca; ficam as sugestões |
| Encaminhar (D20) | Dev | Sem "Encaminhar" |
| Fase 3: vínculo com a tarefa (D22) | Dev (back) | Sem a coluna Tarefa |
| Permissão de ver o item (D9) | Cargo | O e-mail do item não aparece |

**Como a pessoa usa**

1. Abre E-mails no menu.
2. Filtra (por exemplo, "Não lidos" ou "Sem item").
3. Clica na linha para ler; responde ou, sem item, clica na sugestão ou busca o item para vincular.

**Por que assim**

- O documento pede que o e-mail vinculado apareça "na área de E-mail do usuário". Essa área existe
  escondida: a tela "Emails Recebidos", sem entrada no menu.
- Fica na Fase 2 porque a lista por pessoa e permissão pede trabalho no back (D18).
- O padrão das telas novas do develop evita uma tabela com comportamento próprio.

### 7.8 Mail Box do item (Fase 1)

**Como funciona**

- Vem em todo item, sem a pasta precisar ser adicionada na categoria.
- Cabeçalho: o endereço do item, com "Copiar o endereço da caixa", e o botão "Novo e-mail" com
  rótulo, no lugar do lápis de hoje. "Novo e-mail" abre o compositor vinculado ao item, com o 1º
  contato em Para.
- Abas Recebidos e Enviados. Recebidos mostra quantos não lidos.
- Cada linha mostra remetente ou destinatário, assunto e trecho. O enviado diz "Enviado por <nome>
  pelo ENSPACE" ou, na Fase 2, "Enviado por <nome> pela caixa <caixa>".
- No hover da linha: "Responder" e, na Fase 2, "Encaminhar". O e-mail aberto tem os mesmos botões e
  "Marcar como não lido".
- Na Fase 3, o e-mail vinculado a uma tarefa mostra a referência da tarefa.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Mail Box em todo item (D8) | Dev (front) | A aba só aparece onde alguém adicionou a pasta, como hoje |
| Correio do Outlook (D1), para escrever e responder | Perfil › Integrações | A pessoa lê, mas a gaveta não deixa escrever (Fase 1) |

**Por que assim**

- Todo item já tem endereço. Sem a pasta, o e-mail que chega nesse endereço não aparece em lugar
  nenhum da tela do item.
- O botão com rótulo é achado na 1ª vez; o lápis sozinho não diz que escreve e-mail.

### 7.9 Mail Box da tarefa

**Como funciona**

- Fica na aba Mail Box do painel da tarefa (Tarefas › Rápidas). A aba mostra quantos não lidos.
- Fases 1 e 2: os e-mails do item da tarefa. Tarefa sem item mostra "Tarefa sem item" e "A Mail Box
  é do item. Esta tarefa não tem item vinculado, por isso não tem e-mails."
- Fase 3: o seletor "Desta tarefa" (os e-mails vinculados à tarefa) e "Do item <referência>" (todos
  os e-mails do item). A tarefa sem item mostra os e-mails dela.
- "Novo e-mail" abre o compositor vinculado ao item da tarefa e, na Fase 3, à tarefa.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 7.8 | Ver 7.8 | Ver 7.8 |
| Fase 3: vínculo do e-mail com a tarefa (D22) | Dev (back) | Só os e-mails do item |

**Por que assim**

- Na Fase 1, a tarefa mostra o que já existe: a Mail Box do item dela. Quem trabalha na tarefa lê o
  e-mail sem sair do painel.
- Na Fase 3, o item com muitas tarefas separa o e-mail de cada tarefa sem perder o histórico do
  item.

## 8. O que precisa ser construído

### Fase 1 · MVP

| Ponto | Front | Back |
|---|---|---|
| Módulo "Atalhos de comunicação" (4.1) | Chave e bloco "O que o módulo ativa" no cartão Módulos | Guardar a chave em `Workspace.modules` |
| Atalho de e-mail (5.1 a 5.5) | Botão dividido, ícone no campo, submenu, coluna, lote, lembrete, motivo de indisponível, contato tirado dos campos de e-mail do item | Nada |
| Clique direito no quadro (5.3, 5.4) | Menu de contexto | Opcional, no SDK: prop `cardActions` no `EnKanbanBoard` |
| Link público (6) | Cartão e menu nas telas de uso | Nada: o link e a visibilidade já existem |
| "Novo e-mail" e compositor (7.2, 7.3) | Gaveta aberta de qualquer tela, contexto da tela, "De" e "Responder para", bloco "Item vinculado" com o item da tela de origem | Nada: o envio com item já existe |
| Responder (7.5) | E-mail novo com "Re:", texto citado e aviso | Nada |
| Mail Box em todo item e na tarefa (7.8, 7.9) | Aba em todo item; aba no painel da tarefa | Nada |

### Fase 2 · Remetente

| Ponto | Front | Back |
|---|---|---|
| Contato da categoria (4.2) | Cartão e página no painel da categoria; "Escolher os campos de contato" no item; link no cartão Módulos | Guardar o contato (onde: pergunta 1) |
| Vincular a item (7.4) | Campo de busca com sugestões, Trocar e remover; autocompletar do Para com contatos de outros itens | Rota de busca de item entre categorias, filtrada por permissão |
| Área E-mails (7.7) | Entrada no menu, tabela, filtros e painel de leitura no padrão do develop | Lista por pessoa e permissão |
| "De" com as caixas do workspace (4.4, 7.3) | Lista em 2 grupos e a ajuda de para onde vão as respostas | Envio por caixa do workspace; regra de quem envia por qual caixa |
| Resposta na mesma conversa (7.5) | Religar o "Responder" | Enviar como resposta da conversa original |
| Encaminhar (7.5, 7.7, 7.8) | Botão e ação no menu | Encaminhar com os anexos |
| Registro sem item (7.3, 7.7) | Filtro "Sem item" e aviso com "Ver em E-mails" | Gravar o enviado sem item |
| Vincular e trocar depois (7.7) | "Vincular a um item", sugestões e "Trocar" na leitura | Rota para vincular e trocar o item de um e-mail |

### Fase 3 · Tarefa

| Ponto | Front | Back |
|---|---|---|
| Vincular a tarefa (7.3) | Campo "Vincular a tarefa" no compositor | Guardar a tarefa no registro do e-mail |
| Mail Box da tarefa (7.9) | Seletor "Desta tarefa" e "Do item" | Listar os e-mails por tarefa |
| Coluna Tarefa (7.7) | Coluna, filtro e campo na leitura | O mesmo dado do vínculo |

## 9. Perguntas para dev e produto

1. **Contato por categoria (Fase 2):** onde guardar? A categoria já guarda configuração em JSON; o
   contato cabe ali ou pede estrutura própria? Quem pode editar?
2. **Envio por caixa do workspace (Fase 2):** a rota de envio passa a aceitar a caixa como
   remetente? Quem envia por qual caixa: todo membro, um cargo ou os membros ligados à caixa? Sem
   item, a resposta cai na Central de Atendimento: é o destino certo?
3. **Registro de e-mail sem item (Fase 2):** o enviado sem item passa a ser gravado? Quem o vê na
   área E-mails: só quem enviou, ou todos com acesso à caixa usada?
4. **Vincular depois (Fase 2):** não há rota para ligar um e-mail sem item a um item, nem para
   trocar o item. Criar?
5. **Resposta na mesma conversa (Fase 2):** o "Responder" está comentado na tela do develop. O que
   falta para religar?
6. **Caixas do workspace na área E-mails (Fase 2):** quem vê o que chega numa Caixa de E-mail do
   workspace? Hoje a caixa é porta de entrada de Spaceflow e da Central de Atendimento.
7. **Mail Box em todo item (Fase 1):** tirar a exigência da pasta afeta alguma categoria que
   esconde a Mail Box de propósito?
8. **Vínculo com tarefa (Fase 3):** o registro do e-mail ganha a tarefa. A tarefa sem item tem
   Mail Box própria?
9. **Correio do Outlook:** a documentação diz que a integração "exibe sua caixa de entrada dentro do
   ENSPACE e permite vincular e-mails a tarefas e registros". O código do develop não tem essa tela
   nem a rota. Existe em outro lugar ou é plano?
10. **Quem não usa Microsoft:** o cliente com Google fica só com o `mailto:` na Fase 1. Na Fase 2,
    as caixas do workspace atendem esse cliente, ou a integração com Google entra no roteiro?
11. **SDK:** a prop `cardActions` no `EnKanbanBoard` entra no roteiro do SDK?
12. **Tela inicial:** o Felipe concorda em tirar os atalhos da tela inicial (5.6)?

## 10. O que o protótipo não faz

- Não abre o app de verdade: abre uma simulação, com o selo "Simulação · fora do ENSPACE" e o link
  exato no topo. Ela segue as regras desta especificação:
  - **app de e-mail:** com o endereço do item em Cc, a cópia chega à Mail Box do item; sem ele, o
    ENSPACE não fica sabendo;
  - **página pública do formulário:** a resposta cria um item na categoria do formulário;
  - **Integrar contas:** Perfil › Integrações e o consentimento da Microsoft; aceitar libera o
    compositor.
- Não envia e-mail de verdade nem grava nada fora do navegador: tudo fica na memória e some ao
  recarregar.
- O Salvar da Visão Geral grava no item (em memória). É o fim da jornada "Cadastrar e-mail".
- Não tem cargo nem permissão de edição: "Cadastrar e-mail" aparece sempre (no produto, só para
  quem edita o campo).
- A referência do item aparece curta (ex.: CTR-00231) para leitura. No produto é o código de 32
  caracteres, e o endereço do item usa esse código.
- Os ícones são do conjunto lucide, o único instalado. O develop usa o conjunto solar; o dev usa o
  ícone do produto.
- A barra de baixo troca a fase (1 · MVP, 2 · Remetente, 3 · Tarefa) e o cenário (Normal, Sem
  Outlook integrado, Envio falha).

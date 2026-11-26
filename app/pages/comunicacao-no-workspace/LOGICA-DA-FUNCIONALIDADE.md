# Comunicação no workspace: lógica da funcionalidade

Para dev e produto. Protótipo: https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/
(24/11/2026, rodada 8). O controle "Fase", na barra de baixo do protótipo, troca entre as 3 fases.
O controle "Perfil" mostra a central E-mails pelo olhar de quem administra ou do membro. O controle
"Dados" mostra o workspace novo, o primeiro uso e o workspace em uso (7.7).

## 1. Resumo

O documento do Felipe pede 3 coisas. Cada uma tem configuração e uso:

| Parte | O que a pessoa faz | Onde configura |
|---|---|---|
| Atalho de e-mail | Escreve ao contato do item, ao responsável da tarefa ou aos participantes de um evento, pelo ENSPACE ou pelo app de e-mail dela | Nada a ligar: vem sempre ligado. Na Fase 2, o cartão "Contato da categoria" |
| Atalho de WhatsApp | Abre a conversa no WhatsApp com o mesmo contato, com o texto pronto, e envia o link do formulário público | Nada a ligar. Na Fase 2, o telefone e o texto pronto no cartão "Contato da categoria" |
| Atalho de SMS | Abre o painel "Enviar SMS" para o mesmo telefone, com o texto pronto e os caminhos para enviar do celular | Nada a ligar. Na Fase 2, o mesmo telefone e o mesmo texto pronto do WhatsApp |
| Link de formulário público | Copia ou envia o link do formulário público sem ir à configuração | Formulários da categoria (visibilidade, já existe) |
| E-mail do ENSPACE em qualquer tela | Escreve o e-mail de qualquer tela. Com um item aberto, o e-mail fica no item. Lê e responde na central E-mails | Correio do Outlook no perfil de cada pessoa. Modelos, caixas e regras do workspace, na central E-mails |

Regras que valem para tudo:

- **Os canais são e-mail, WhatsApp e SMS.** O WhatsApp abre por um link do próprio WhatsApp, e o SMS pelo painel
  "Enviar SMS" (5.8), com o texto pronto; a pessoa envia do celular dela, e o ENSPACE não registra a mensagem.
- **O e-mail vem sempre ligado.** Não há chave em Sistema › Módulos nem em outro lugar, em nenhuma
  fase. O atalho aparece onde há endereço de e-mail (4.1).
- **Tudo do e-mail fica numa central só:** "E-mails", na seção Membro do menu, com as abas
  Mensagens, Modelos, Caixas de E-mail e Configurações (7.7). Os itens de Configurações › E-mails
  abrem as abas dela.
- **Os e-mails que tarefas e fluxos enviam ficam na aba Mensagens**, com o filtro "Do sistema", para
  quem tem a permissão de hoje de vê-los. Não há aba própria para eles.
- **O e-mail do ENSPACE sai da conta do Outlook da pessoa** (Fase 1). Na Fase 2, sai também de uma
  caixa do workspace. O item vinculado define para onde a resposta volta, não o remetente.
- **O Correio do Outlook é do perfil de cada pessoa.** Cada pessoa integra a própria conta em Perfil
  › Integrações. O administrador não liga pelos outros.
- **Contato sem e-mail ou sem telefone válido deixa o botão indisponível, com o motivo** e, no item,
  o atalho para preencher ou corrigir.

Cada ponto das seções 4 a 7 diz em que fase entra e tem um bloco **Depende de**: o que precisa
existir, onde se resolve e o que a pessoa vê quando falta. A seção 3 junta as dependências num mapa.

## 2. As 3 fases

Cada fase soma à anterior.

| Fase | O que entra | O que já existe no produto | O que é novo |
|---|---|---|---|
| 1 · MVP | Atalho de e-mail nas telas de uso, com o contato tirado dos campos de e-mail que o item já tem; "Novo e-mail" no topo, que reconhece o item ou a tarefa aberta; compositor com o "De" à vista e o item da tela de origem; Mail Box em todo item e no painel da tarefa; link do formulário público nas telas de uso; lembrete por e-mail na Agenda; central E-mails no menu, com as 4 abas, os e-mails do sistema na aba Mensagens e os estados vazios | Envio pela conta do Outlook da pessoa; endereço do item; registro do e-mail com item; Mail Box do item; campos de e-mail da categoria e E-mail do Requisitante; link público e visibilidade do formulário; tela "Emails Recebidos", sem entrada no menu; as telas Modelos de E-mail, Caixas de E-mail e E-mails Enviados, com as permissões delas; a tabela das telas novas do produto; integração SendGrid | As telas, sobre os dados, as rotas e as permissões que já existem. A lista única dos e-mails dos itens e dos enviados pelo sistema pode pedir back (D24) |
| 2 · Remetente | Contato por categoria (cartão "Contato da categoria"); busca de item entre categorias no compositor ("Vincular a item (opcional)"), com as sugestões pelo destinatário e o autocompletar do Para com contatos de outros itens; na central, a lista de mensagens por pessoa e permissão, o e-mail sem item e "Caixas como remetente"; escolher o "De" (conta do Outlook ou caixa do workspace); responder na mesma conversa; encaminhar; registrar o e-mail enviado sem item; vincular e trocar o vínculo depois | Caixas de E-mail do workspace, que hoje só recebem; configuração da categoria em JSON | O contato da categoria (dado novo, a avaliar com os devs); a busca de item entre categorias; a lista de e-mails por pessoa e permissão; envio por caixa do workspace; resposta na conversa; encaminhar; registro sem item; rota de vínculo |
| 3 · Tarefa | "Vincular a tarefa" no compositor; Mail Box própria da tarefa ("Desta tarefa" e "Do item"); coluna Tarefa na aba Mensagens da central | Nada: a tarefa não tem vínculo com e-mail | Vínculo do e-mail com a tarefa |

**O que o código do develop faz hoje** (lido em 17/11/2026 e 24/11/2026). É a base da Fase 1:

| Pergunta | Hoje |
|---|---|
| De onde sai o e-mail que a pessoa escreve? | Da integração dela com o Correio do Outlook. Não há envio pela caixa do workspace |
| O ENSPACE guarda o e-mail enviado? | Só com item. E-mail sem item fica só no Outlook da pessoa |
| Para que servem as caixas do workspace? | Receber (Central de Atendimento) e iniciar fluxo. Não enviam |
| Há resposta na mesma conversa? | Não: o "Responder" está comentado na tela. Na Fase 1, responder abre um e-mail novo com "Re:" |
| A tarefa tem vínculo com e-mail? | Não |
| Onde ficam modelos, caixas e e-mails enviados pelo sistema? | Em Configurações › E-mails, em 3 telas. Cada uma pede a permissão de leitura dela, em geral de quem administra |
| Que tabela essas 3 telas usam? | A tabela antiga. Logs de Auditoria e as telas novas de itens usam a tabela nova, com a coluna Ações primeiro |
| O e-mail que tarefas e fluxos enviam aparece na Mail Box do item? | Não. Fica só na tela E-mails Enviados, numa lista separada dos e-mails dos itens |
| Há uma tela com os e-mails dos itens? | A tela "Emails Recebidos", sem entrada no menu |

## 3. Mapa de dependências

| # | Dependência | De quem é | Existe hoje? | Fase | Pontos afetados | Se faltar |
|---|---|---|---|---|---|---|
| D1 | Correio do Outlook integrado no perfil da pessoa | Cada pessoa (Perfil › Integrações) | Sim | 1 | 5.1, 7 inteira | Fase 1: a gaveta mostra "Nenhuma conta integrada disponível." e o botão E-mail abre o app da pessoa. Fase 2: o "De" oferece só as caixas do workspace |
| D2 | Conta Microsoft corporativa | TI do cliente | Sim, só Microsoft | 1 | Os mesmos de D1 | Quem usa Google fica só com "Abrir no meu app de e-mail" |
| D3 | Calendário do Outlook integrado no perfil (outra integração, separada do Correio) | Cada pessoa (Perfil › Integrações) | Sim | 1 | 5.5 | As reuniões do Outlook não aparecem na Agenda |
| D4 | Permissões de hoje de ver os modelos, as caixas e os e-mails enviados pelo sistema | Cargo (Gestão de Membros) | Sim | 1 | 7.7 | A pessoa não vê as abas Modelos e Caixas de E-mail, nem a seção Configurações do menu. Na aba Mensagens, não vê os e-mails do sistema, o filtro "Do sistema" nem a coluna Status. Na aba Configurações, vê só "Sua conta de envio" |
| D5 | Contato configurado na categoria | Administrador (cartão "Contato da categoria") | Não: é novo, a avaliar com os devs | 2 | 4.2, 5.2, 5.3, 5.5, 7.4 | O item mostra "Nenhum contato neste item"; a lista e o quadro ficam sem o submenu "E-mail" |
| D6 | Campos de e-mail na categoria (E-mail, Pessoa/Empresa, E-mail do Requisitante) | Administrador (Estrutura › Categorias › Campos) | Sim | 1 | 4.2, 5.1, 5.2, 5.3, 5.5 | Fase 1: o item fica só com o contato "Requisitante", quando há. Fase 2: não há campo para escolher no cartão. O ícone ao lado do campo não aparece |
| D7 | E-mail preenchido no item | Quem usa (Visão Geral do item) | Sim | 1 | 5 | Botão indisponível: "Sem e-mail cadastrado" |
| D8 | Mail Box em todo item, sem a pasta precisar ser adicionada na categoria | Dev (front) | Não: hoje a Mail Box é uma pasta que alguém adiciona na categoria | 1 | 7.8, 7.9 | Na categoria sem a pasta, o e-mail sai, mas ele e a resposta não aparecem na tela do item |
| D9 | Permissão de ver a categoria e o item | Cargo (Gestão de Membros) | Sim | 1 | 5, 7.4, 7.7 | A pessoa não chega ao item. Na Fase 2, o item não aparece na busca nem na aba Mensagens |
| D10 | Permissão de editar o campo de e-mail | Cargo (Gestão de Membros) | Sim | 2 | 5.2 | Sem "Cadastrar e-mail"; fica só o motivo |
| D11 | Formulário com visibilidade Público e tipo Criação ou Geral | Administrador (Editar do formulário) | Sim | 1 | 6 | O link não aparece; formulário privado mostra o porquê |
| D12 | Tela Requisições no menu | Administrador (Interface › Menus) | Sim | 1 | 6.2 | Sem o cartão nessa tela; sobram a lista de itens e a tarefa |
| D13 | Spaceflow que gera tarefa de formulário (nó Formulário ou Operações de Dados manual) | Administrador (Spaceflow) | Sim | 1 | 6.2 | Não há tarefa de formulário |
| D14 | Configurações da Agenda: categorias com campo de data e tipos de tarefa marcados | Administrador (Agenda › Configurações) | Sim | 1 | 5.5 | O evento não aparece na Agenda |
| D15 | Modelos de E-mail cadastrados | Administrador (E-mails › Modelos) | Sim | 1 | 7.3, 7.7 | Campo Template sem opções; a aba Modelos mostra "Nenhum modelo" e "Novo modelo" |
| D16 | App de e-mail padrão no computador da pessoa (`mailto:`) | Cada pessoa ou o TI | Fora do ENSPACE | 1 | 5.1, 6 | O navegador não abre nada ou pergunta qual app usar |
| D17 | Rota de busca de item entre categorias, filtrada por permissão | Dev (back) | Não | 2 | 7.3, 7.4, 7.7 | Sem a busca de "Vincular a item"; fica o item da tela de origem, como na Fase 1 |
| D18 | Lista de e-mails por pessoa e por permissão, para a aba Mensagens | Dev (back e front) | Em parte: os dados e a tela "Emails Recebidos" existem; a tela não tem entrada no menu | 2 | 7.7 | A aba Mensagens mostra o que a tela "Emails Recebidos" mostra hoje (9, pergunta 13) |
| D19 | Envio por caixa do workspace | Dev (back) | Não: as caixas só recebem | 2 | 4.4, 7.3, 7.7 | O "De" tem só a conta do Outlook; sem o bloco "Caixas como remetente" |
| D20 | Resposta na mesma conversa e encaminhar | Dev (back e front) | Não: o "Responder" está comentado na tela | 2 | 7.5 | Responder abre um e-mail novo com "Re:"; sem "Encaminhar" |
| D21 | Registro do e-mail enviado sem item e rota para vincular e trocar o vínculo depois | Dev (back) | Não | 2 | 7.3, 7.7 | Sem item, o e-mail fica só no Outlook; sem "Vincular" |
| D22 | Vínculo do e-mail com a tarefa | Dev (back) | Não | 3 | 7.3, 7.7, 7.9 | Sem "Vincular a tarefa"; a Mail Box da tarefa mostra os e-mails do item |
| D23 | Desenho do botão de e-mail no cartão do quadro (o "Notify" do mockup 5) | Produtos | Não | Opcional | 5.3, 5.4 | O atalho fica só no clique direito, sem botão no cartão |
| D24 | Lista única dos e-mails dos itens e dos enviados pelo sistema, com ordem e paginação únicas, para a aba Mensagens | Dev (back) | Não: hoje são 2 listas separadas | 1 | 7.7 | O filtro "Do sistema" troca a fonte da tabela, 1 lista por vez (9, pergunta 14) |

## 4. Configuração (quem administra o workspace)

### 4.1 Sem módulo: o e-mail vem sempre ligado (todas as fases)

**Como funciona**

- Não há chave em Configurações › Sistema › Módulos nem em outro lugar, em nenhuma fase. O cartão
  Módulos fica como hoje: Correção Monetária, Comparações e Jurídico.
- Desde o 1º dia aparecem os atalhos de e-mail, o "Novo e-mail" do topo, o link do formulário
  público nas telas de uso e a central E-mails no menu.
- O atalho só aparece onde há endereço de e-mail: o campo de e-mail do item, o responsável da
  tarefa, os participantes do evento. Sem e-mail, o botão fica indisponível, com o motivo (5.1).
- Escrever pelo ENSPACE pede a conta do Outlook integrada (D1). Sem ela, o botão abre o app de
  e-mail da pessoa.
- O que se configura do e-mail fica na central, aba Configurações (7.7).

**Por que assim**

- Nos CRMs e help desks pesquisados não há chave geral de e-mail: ele nasce ligado, e o que se
  controla é a permissão e a conta conectada. Os 24 produtos e as fontes estão em
  `PESQUISA-MODULOS-E-EMAIL.md`, nesta pasta.
- O documento do Felipe pede: "Todos esses botões devem ter opção nas configurações de aparecerem
  ou não nas telas, do mesmo modo como foi feito em correções monetárias, comparador". A redatora
  decidiu em 24/11/2026 seguir sem a chave: o atalho já some onde não há e-mail, e o envio já pede
  a conta do Outlook.
- Sem a chave, a Fase 1 não tem dado novo para guardar no workspace.

### 4.2 Cartão "Contato da categoria" (Fase 2, a avaliar com os devs)

**Como funciona**

- Na Fase 1 não há cartão: o contato vem dos campos de e-mail e de telefone que o item já tem (5.2, 5.7).
- 13º cartão no painel da categoria (Configurações › Estrutura › Categorias › categoria), ao lado
  do cartão Correção Monetária. Descrição: "Quem é o contato do item e o assunto do e-mail."
- A página tem 3 blocos:
  - **"Quem é o contato":** cada contato tem o "Nome do contato na tela" e 3 origens: nome,
    e-mail e telefone. Uma categoria tem 1 ou mais contatos (Contratos: "Contato da contraparte" e
    "Requisitante"). "Adicionar contato" cria outro;
  - **"Assunto do e-mail":** o assunto com que o e-mail abre, com as variáveis `{referencia}`,
    `{titulo}`, `{nome}` e `{categoria}` (botões em "Inserir:");
  - **"Texto pronto do WhatsApp e do SMS":** o texto com que a conversa e o SMS abrem, com as mesmas variáveis;
  - **"Prévia: o que os botões E-mail, WhatsApp e SMS abrem":** para cada contato, com um item de
    exemplo, o Para, o Assunto e o Cc (o endereço do item), e o telefone e o texto do WhatsApp e do
    SMS; telefone fixo traz o aviso "Telefone fixo não recebe SMS".
- Origens aceitas:

| Dado | Campos que servem |
|---|---|
| Nome | Texto curto; Pessoa/Empresa › Nome de contato |
| E-mail | Campo E-mail; Pessoa/Empresa › E-mail de contato; E-mail do Requisitante (campo padrão de toda categoria) |
| Telefone | Texto com máscara com a máscara CEL; Pessoa/Empresa › Telefone de contato |

- Na central, E-mails › Configurações › "Contato do item" leva ao cartão pelo link "Escolher o
  contato de cada categoria".
- Dado: a categoria já guarda configuração em JSON. O contato caberia ali, mas é dado novo. Onde
  guardar é pergunta para os devs (9, pergunta 1).

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Campos de e-mail na categoria (D6) | Estrutura › Categorias › Campos | Não há campo para escolher |
| Back aceitar e guardar o contato da categoria | Dev | A configuração não grava |

**Como a pessoa usa**

1. Abre a categoria e o cartão "Contato da categoria", ou clica em "Escolher o contato de cada
   categoria" em E-mails › Configurações.
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
- Na central, E-mails › Configurações › "Sua conta de envio" mostra a conta integrada, com
  "Gerenciar integração", ou "Nenhuma conta integrada.", com "Integrar contas". Os 2 botões abrem
  Perfil › Integrações (7.7).

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

- As caixas já existem. Hoje ficam em Configurações › E-mails › Caixas de E-mail; na proposta,
  na aba Caixas de E-mail da central (7.7). Recebem (Central de Atendimento) e iniciam fluxo.
- Na Fase 2, as caixas aparecem no "De" do compositor (7.3). A configuração da caixa não muda.
- Quem administra escolhe quais entram no "De" em E-mails › Configurações › "Caixas como
  remetente": 1 chave "Disponível no campo De" por caixa e o botão Salvar. Só as caixas ligadas
  entram no "De".

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Envio por caixa do workspace (D19) | Dev (back) | O "De" tem só a conta do Outlook |
| Guardar quais caixas entram no "De" | Dev (back) | A escolha não grava |
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
- O atalho vem sempre ligado, sem chave (4.1).

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
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
- **Quadro:** o menu do clique direito que o cartão já tem (Ver Detalhes, Editar, Mover para,
  Enviar para Lixeira, Copiar Link) ganha o mesmo submenu. A dica do quadro diz "Clique com o
  botão direito num cartão para enviar e-mail ao contato."
- Contato sem e-mail aparece com o motivo, indisponível.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 5.1 | Ver 5.1 | Ver 5.1 |
| Para o botão no cartão (o "Notify" do mockup 5): o desenho do botão (D23) | Produtos | Fica só o clique direito |

**Como a pessoa usa**

1. Abre o menu da linha, ou clica com o botão direito no cartão.
2. Passa o mouse em E-mail e escolhe o contato e o caminho.

**Por que assim**

- A lista já tem muitas colunas. O menu da linha já existe e recebe a ação sem ocupar espaço.
- O cartão do quadro já tem menu no clique direito. O atalho entra nele sem ocupar espaço no
  cartão.

### 5.4 Tarefas: e-mail para o responsável (Fase 1)

**Como funciona**

- Quem recebe é o **responsável** da tarefa (o campo Responsável), um membro. O e-mail do membro
  sempre existe: é o login.
- **Lista:** coluna Contato, com o botão de e-mail por linha. Tarefa sem responsável mostra "Sem
  responsável".
- **Seleção de várias tarefas:** a barra ganha "E-mail para os <N> responsáveis", que abre 1 e-mail
  com todos em Para ("Abre 1 e-mail com todos os responsáveis em Para."). A barra diz quantas
  tarefas sem responsável ficam de fora.
- **Quadro:** o menu do clique direito que o cartão já tem (Editar, Duplicar, Mover para, Arquivar,
  Enviar para Lixeira, Copiar Link Externo) ganha "Abrir a Mail Box" e "Enviar e-mail para <nome>".
- **Painel da tarefa:** abas Detalhes e Mail Box. Detalhes tem o botão de e-mail para o
  responsável; sem responsável, "Atribua um responsável para enviar o e-mail." A Mail Box está em
  7.9.
- O e-mail abre com assunto "Tarefa: <nome> (prazo <data>)" e o texto do lembrete. Com a tarefa
  ligada a um item, o e-mail vai vinculado a esse item.

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Tudo de 5.1 | Ver 5.1 | Ver 5.1 |
| Tarefa com responsável | Quem cria ou pega a tarefa | Botão indisponível: "Sem responsável" |

**Como a pessoa usa**

1. Abre Tarefas › Rápidas, na visão Lista.
2. Seleciona as tarefas.
3. Clica em "E-mail para os <N> responsáveis", escreve e envia.

**Por que assim**

- O mockup 3 pede 1 rascunho para todos os responsáveis.
- O e-mail em lote cabe num e-mail. O WhatsApp e o SMS em lote viram uma fila, 1 pessoa por vez, porque o link do
  WhatsApp e o do SMS levam 1 número.

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
| Tudo de 5.1 | Ver 5.1 | Ver 5.1 |
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

### 5.7 WhatsApp em cada atalho (Fase 1)

**Como funciona**

- Onde há atalho de e-mail para uma pessoa, há também o de WhatsApp: o botão no Contato do item, o
  ícone ao lado do campo de telefone, o submenu "WhatsApp" da lista e do quadro, o ícone na coluna
  Contato das tarefas, o item no clique direito do cartão de tarefa, o botão no painel da tarefa e o
  ícone por pessoa no modal "Evento" da Agenda.
- O atalho abre numa aba nova o link do próprio WhatsApp, `https://wa.me/<número>?text=<texto>`. O
  WhatsApp Web ou o app abre a conversa com o texto no campo; a pessoa revisa e aperta Enviar. Sem
  número (o link do formulário), o link é `https://wa.me/?text=<texto>`, e a pessoa escolhe a
  conversa ou o grupo.
- O telefone vem do campo Texto com máscara com a máscara CEL e do Telefone de contato do
  Pessoa/Empresa. O produto não tem campo do tipo telefone.
- O número é o telefone só com os dígitos; com 10 ou 11 dígitos, ganha o 55; com menos de 10, é
  inválido.
- O texto pronto: no item, "Olá, <primeiro nome>. Escrevo sobre <referência> · <nome do item>."; na
  tarefa e na Agenda, o texto do e-mail daquela tela; no link do formulário, o texto do e-mail do
  link. Na Fase 2, o texto do item vem do cartão "Contato da categoria".
- Para várias pessoas (responsáveis das tarefas selecionadas, "WhatsApp para todos" da Agenda), a
  fila "Avisar pelo WhatsApp" diz quem fica de fora e abre 1 conversa por vez: "Conversa 1 de N",
  "Abrir conversa", "Próxima".
- Sem telefone ou com telefone inválido, o atalho fica indisponível com o motivo ("Sem telefone
  cadastrado", "Telefone inválido"). No item, "Corrigir telefone" leva ao campo.

**Depende de**

| O que precisa existir | Onde se resolve | Sem isso, a pessoa vê |
|---|---|---|
| Telefone no item | Campo Texto com máscara CEL ou Pessoa/Empresa na categoria | O atalho indisponível, com "Sem telefone cadastrado" |
| Telefone do membro (tarefas e Agenda) | O cadastro do usuário tem o campo, mas nenhuma tela o preenche (pergunta 15) | O atalho indisponível para cada responsável |
| WhatsApp no computador ou no celular da pessoa | Fora do ENSPACE | A página do WhatsApp pede para entrar ou instalar |

**Por que assim**

O link do WhatsApp não pede back-end nem conta paga: a mensagem sai do WhatsApp de quem envia, como
nos CRMs brasileiros (RD Station CRM, Agendor, Ploomes, Kommo). O registro da conversa no item
pediria a API paga do WhatsApp Business, fora do plano. A fila existe porque o link leva 1 número e
o navegador bloqueia várias abas abertas de uma vez.

Na Fase 1, o e-mail e o telefone de um mesmo contato vêm de 2 campos e aparecem como 2 contatos
("E-mail do contato" e "Telefone do contato"). Só o Pessoa/Empresa junta os 2. Juntar é o cartão
"Contato da categoria" (4.2).

### 5.8 SMS em cada atalho (Fase 1)

**Como funciona**

- Onde há atalho de WhatsApp, há também o de SMS, ao lado: o botão no Contato do item, o ícone ao
  lado do campo de telefone, o submenu "SMS" da lista e do quadro, o ícone na coluna Contato das
  tarefas, o item no clique direito do cartão de tarefa, o botão no painel da tarefa, o ícone por
  pessoa na Agenda e o link do formulário.
- O atalho abre o painel "Enviar SMS": o Para (nome e número, com "Copiar o número"), a mensagem com o
  texto pronto, que a pessoa pode mudar, e a contagem "<N> caracteres · <M> SMS".
- O botão principal, "Abrir no app de SMS", abre o link `sms:+<número>?body=<texto>` (RFC 5724). No
  celular e no Mac, o app de mensagens abre pronto; no Windows, abre o app registrado para `sms:`,
  quando há.
- "Outros caminhos", na ordem:
  - **Abrir no celular:** o QR code do mesmo link; a câmera do celular abre o app de SMS pronto;
  - **Copiar a mensagem:** para o Vincular ao Celular do Windows ou qualquer outro app;
  - **Google Messages Web:** copia a mensagem e abre a conversa nova; a pessoa cola o número e a
    mensagem. Só com Android.
- O número é o do WhatsApp (5.7), com o "+". O texto pronto é o do WhatsApp.
- Telefone fixo (DDD e 8 dígitos) deixa o SMS indisponível, com "Telefone fixo não recebe SMS"; o
  WhatsApp continua disponível.
- Para várias pessoas, a fila "Avisar por SMS", com "Abrir SMS" e os 2 botões de copiar por pessoa.

**Depende de**

| O que precisa existir | Onde se resolve | Sem isso, a pessoa vê |
|---|---|---|
| Celular no item | Campo Texto com máscara CEL ou Pessoa/Empresa na categoria | O atalho indisponível, com o motivo |
| Telefone do membro (tarefas e Agenda) | Mesmo caso do WhatsApp (pergunta 15) | O atalho indisponível para cada responsável |
| Celular da pessoa com plano de SMS | Fora do ENSPACE | Nada a enviar |
| App para `sms:` no computador | Mac: Mensagens; Windows: o app que a pessoa definir | No Windows sem app, o QR code e o "Copiar" |

**Por que assim**

Nenhum caminho sem back-end funciona para todos (pesquisa em `PESQUISA.md`, "SMS no computador"). O
Teams corporativo só envia SMS nos Estados Unidos e no Canadá. O Vincular ao Celular não tem link
documentado que abra a conversa pronta. O Google Messages Web não aceita número nem texto no link. O
painel junta os 4 caminhos que não pedem back-end, e o QR code garante o cliente Microsoft no
Windows. O envio pelo próprio ENSPACE, com registro no item, pede serviço de SMS pago (pergunta 18).

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

Como a gaveta "Nova Mensagem" da Mail Box funciona hoje, no develop:

- O e-mail sai pela integração do Correio do Outlook, com Para, Cc, Cco, o endereço de resposta, o
  assunto, a mensagem, os anexos e a referência do item.
- O remetente é a conta do Outlook que a pessoa integrou. **Por isso a Mail Box do item já depende
  do Correio do Outlook hoje:** sem ele, a gaveta não deixa escrever.
- No item, a resposta vai para o endereço do item, e o e-mail fica ligado à referência do item. O
  endereço do item é `<referência do item em minúsculas>.<referência do
  workspace>@<domínio das caixas>`.
- O registro do e-mail enviado exige o item. Sem item, o e-mail sai, mas não fica no ENSPACE.
- A resposta do destinatário chega no endereço do item e aparece em Mail Box › Recebidos. O enviado
  aparece em Mail Box › Enviados.
- O template (hoje em Configurações › E-mails › Modelos de E-mail; na proposta, na aba Modelos da
  central) troca as variáveis pelos dados do item.
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
| Modelos de E-mail cadastrados (D15) | E-mails › Modelos | Campo Template vazio |
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
- "Responder" aparece no hover da linha da Mail Box, no e-mail aberto e na aba Mensagens da
  central.

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
- Na central, E-mails › Configurações › "Sua conta de envio" mostra "Nenhuma conta integrada." e
  "Integrar contas".
- Fase 2: o "De" oferece só as caixas do workspace. A pessoa escreve pelo ENSPACE sem a integração.
- No protótipo: cenário "Sem Outlook integrado", na barra de baixo.

### 7.7 Central "E-mails" no menu (Fase 1)

**Como funciona**

- Entrada "E-mails" na seção Membro do menu, nas 3 fases. Junta tudo do e-mail em 4 abas, com o
  botão "Novo e-mail" no alto, que abre o compositor sem vínculo.
- Cada aba segue a permissão que já existe no develop (lido em 24/11/2026). Quem não tem a
  permissão não vê a aba.

| Aba | O que mostra | Quem vê | Fase |
|---|---|---|---|
| Mensagens | Os e-mails recebidos e enviados e, para quem tem a permissão, os enviados pelo sistema (abaixo) | Todo membro. Os e-mails do sistema, só quem tem a permissão de hoje de ver os e-mails enviados | 1. Na 2, a lista por pessoa e permissão e o e-mail sem item. Na 3, a coluna Tarefa |
| Modelos | A tela Modelos de E-mail de hoje: Ações, Nome, Assunto e Usar remetente por domínio, com "Novo modelo" | Quem tem a permissão de hoje de ver os modelos de e-mail, em geral quem administra | 1 |
| Caixas de E-mail | A tela Caixas de E-mail de hoje: Ações, Nome, E-mail e Provedor, com "Nova caixa" | Quem tem a permissão de hoje de ver as caixas, em geral quem administra | 1 |
| Configurações | O membro vê "Sua conta de envio". Quem administra vê também "Contato do item", "Remetente com o domínio da empresa" e, na Fase 2, "Caixas como remetente" | Todos; o conteúdo muda com a permissão | 1. Na 2, o link do contato por categoria e "Caixas como remetente" |

- O conteúdo de Modelos e Caixas de E-mail é o das telas de hoje. Mudam o endereço e a tabela.
- **Configurações › E-mails** continua no menu de Configurações, com os 3 itens de hoje. Cada um
  abre a central, sem 2 lugares chamados "E-mails":
  - Modelos de E-mail abre a aba Modelos;
  - Caixas de E-mail abre a aba Caixas de E-mail;
  - E-mails Enviados abre a aba Mensagens já com o filtro "Do sistema".
- O membro não vê a seção Configurações do menu.

**As tabelas da central**

Mensagens, Modelos e Caixas de E-mail seguem a tabela das telas novas do produto, a mesma de Logs de
Auditoria e das telas novas de itens:

- a coluna Ações vem primeiro, com 1 botão de 3 pontos (⋮) que abre o menu da linha;
- o clique direito na linha abre o mesmo menu;
- a barra tem a busca;
- o paginador diz "Mostrando 1 a N de N resultados", com 10, 25, 50 ou 100 por página.

| Tabela | Menu da linha |
|---|---|
| Mensagens | Ver abaixo, em "Aba Mensagens" |
| Modelos | "Usar em um e-mail", "Editar" e "Excluir" |
| Caixas de E-mail | "Editar" e "Excluir" |

Hoje as telas Modelos de E-mail, Caixas de E-mail e E-mails Enviados usam a tabela antiga. A
proposta as leva para a tabela nova.

**Aba Configurações**

| Bloco | Quem vê | O que mostra |
|---|---|---|
| "Sua conta de envio" | Todos | A conta do Outlook integrada, com "Gerenciar integração", ou "Nenhuma conta integrada.", com "Integrar contas". Os 2 abrem Perfil › Integrações (4.3) |
| "Contato do item" | Quem administra | Fase 1: "O contato de cada item vem dos campos de e-mail que a categoria já tem e do e-mail de quem abriu a requisição." Fase 2: o link "Escolher o contato de cada categoria", que abre o cartão da categoria (4.2) |
| "Caixas como remetente" | Quem administra, Fase 2 | 1 chave "Disponível no campo De" por caixa e o botão Salvar. Só as caixas ligadas entram no "De" do compositor (4.4) |
| "Remetente com o domínio da empresa" | Quem administra | A integração SendGrid de hoje, com "Abrir Integrações" |

Os blocos de quem administra levam a linha "Visível só para quem administra o workspace."

**Aba Mensagens**

- Fase 1: o subtítulo diz "Os e-mails recebidos e enviados pela Mail Box dos itens." A aba parte
  da tela "Emails Recebidos" de hoje e mostra os e-mails que o ENSPACE já grava: os que têm item.
  Se essa tela basta e quem a vê é pergunta para os devs (9, pergunta 13).
- Fase 2: o subtítulo diz "Os e-mails recebidos e enviados pelo ENSPACE, com ou sem item." Só
  aparecem e-mails de itens que a pessoa pode ver (D18).
- Segue a tabela das telas novas do produto (acima), com os filtros delas:
  - **barra:** busca, período ("Todo o período", "Hoje", "Últimos 7 dias", "Últimos 30 dias"),
    "Limpar filtros", "Colunas" e o botão que mostra os filtros rápidos;
  - **filtros rápidos:** "Recebidos", "Enviados", "Do sistema" (só com a permissão de ver os
    e-mails enviados), "Não lidos", "Com anexo" e, na Fase 2, "Sem item";
  - **colunas:** "Ações" primeiro (botão ⋮), depois Tipo, De, Para, Assunto, Item, Tarefa (Fase 3),
    Enviado por, Status (só com a permissão de ver os e-mails enviados) e Data. "Colunas" esconde e
    mostra as opcionais;
  - **cabeçalho:** ordenar e o funil do filtro da coluna. No texto, o operador em frase ("É
    totalmente Igual a", "É totalmente Diferente De", "Contém parcialmente", "Não contém" e as
    variantes que diferenciam maiúsculas), cada operador 1 vez. Na seleção, busca, "Todos" e
    "Limpar".
- Menu da linha: "Ver Detalhes", "Responder", "Marcar como não lido" (no recebido lido) e "Ver
  Item". Na Fase 2, também "Encaminhar" e, no e-mail sem item, "Vincular a um item" no lugar de
  "Ver Item". O e-mail do sistema tem outro menu (abaixo).
- O clique na linha abre a leitura num painel lateral: Tipo, De (com o nome da caixa, quando é
  caixa do workspace), Para, Cc, Enviado por, Tarefa (Fase 3), o item vinculado e o corpo. Botões:
  "Responder", "Marcar como não lido" (no recebido) e, na Fase 2, "Encaminhar".
- **Vínculo com o item na leitura:**
  - com item: o item. Na Fase 2, com "Trocar";
  - sem item (Fase 2): "Este e-mail não tem item. Ao vincular, ele passa a aparecer na aba
    Mail Box do item.", as "Sugestões pelo destinatário" (itens em que o remetente ou o
    destinatário é contato) e a busca de 7.4. O aviso confirma "E-mail vinculado".

**Os e-mails enviados pelo sistema, na aba Mensagens**

São os e-mails que tarefas e fluxos enviam, os da tela E-mails Enviados de hoje. Entram como linhas
da aba Mensagens, do tipo Enviado:

- **quem vê:** só quem tem a permissão de hoje de ver os e-mails enviados vê essas linhas, o filtro
  "Do sistema", a opção "Sistema" no filtro de "Enviado por" e a coluna Status. O membro sem a
  permissão não vê nada disso;
- **filtro:** o filtro rápido "Do sistema" e a opção "Sistema" no filtro da coluna "Enviado por";
- **"Enviado por":** "Sistema · <tarefa>" quando há tarefa; sem tarefa, "Sistema";
- **coluna Status:** Enviado, Em processamento ou Falhou. Nas outras linhas, "-";
- **menu da linha:** "Ver Detalhes", "Reenviar e-mail" (indisponível com o status Em
  processamento) e "Ver Item", que abre o item na Visão Geral. Sem "Responder" nem "Encaminhar";
- **leitura no painel lateral:** mostra também Status e Tarefa, com o botão "Reenviar e-mail".
  Reenviar muda o status para Em processamento e mostra o aviso "E-mail colocado na fila de
  envio";
- **Mail Box:** o e-mail do sistema não entra na Mail Box do item, como hoje.

**Estado inicial da central**

Sem nenhum e-mail na aba Mensagens, a tabela mostra o próximo passo. O protótipo mostra os casos
pelo controle "Dados" e pelo cenário "Sem Outlook integrado".

| Caso | O que a pessoa vê |
|---|---|
| Workspace novo: nada configurado, nada enviado (sem modelo, sem caixa, sem a conta do Outlook, sem e-mail) | Mensagens mostra "Nenhum e-mail ainda", o texto do próximo passo e o botão "Integrar conta do Outlook". Quem administra vê também "Criar modelo" e "Criar caixa de e-mail", que levam às abas Modelos e Caixas de E-mail |
| Workspace novo, aba Modelos | "Nenhum modelo", "O modelo preenche o assunto e a mensagem de um e-mail. Crie o primeiro para a equipe usar." e "Novo modelo" |
| Workspace novo, aba Caixas de E-mail | "Nenhuma caixa de e-mail", "A caixa recebe os e-mails enviados ao workspace e pode iniciar um fluxo." e "Nova caixa" |
| Workspace novo, compositor | O campo Template fica sem opções |
| Primeiro uso: tudo configurado, nada enviado | Mensagens mostra "Nenhum e-mail ainda", "Escreva o primeiro e-mail. Ele aparece aqui e na Mail Box do item vinculado." e o botão "Novo e-mail" |
| Nenhum e-mail e sem a conta do Outlook | O vazio pede para integrar a conta: "Os e-mails que você troca pelos itens aparecem aqui. Para enviar pelo ENSPACE, integre a sua conta do Outlook." e "Integrar conta do Outlook" |
| Com filtro e sem resultado | O vazio de hoje: "Nenhum e-mail com estes filtros." e "Limpar filtros" |

No workspace novo, o texto do próximo passo muda com o perfil:

- quem administra: "Os e-mails que as pessoas trocam pelos itens aparecem aqui. Para começar,
  integre a sua conta do Outlook e crie os modelos e as caixas do workspace.";
- membro: o mesmo texto do caso sem a conta do Outlook, só com "Integrar conta do Outlook".

**Depende de**

| Dependência | Onde se resolve | Se faltar |
|---|---|---|
| Permissões de hoje de ver os modelos, as caixas e os e-mails enviados (D4) | Cargo (Gestão de Membros) | A pessoa não vê as abas Modelos e Caixas de E-mail nem os e-mails do sistema em Mensagens; em Configurações, vê só "Sua conta de envio" |
| Lista única dos e-mails dos itens e dos enviados pelo sistema (D24) | Dev (back); 9, pergunta 14 | O filtro "Do sistema" troca a fonte da tabela, 1 lista por vez |
| Correio do Outlook (D1), para "Sua conta de envio" | Perfil › Integrações | O bloco mostra "Nenhuma conta integrada." e "Integrar contas" |
| Fase 1: a tela "Emails Recebidos", que existe sem entrada no menu, como base da aba Mensagens | Dev (front); 9, pergunta 13 | Sem a aba Mensagens; o e-mail fica na Mail Box do item e da tarefa (7.8, 7.9) |
| Fase 2: lista de e-mails por pessoa e permissão (D18) | Dev (back e front) | A aba Mensagens mostra o que a tela "Emails Recebidos" mostra hoje |
| Fase 2: registro do e-mail sem item e rota para vincular e trocar o vínculo (D21) | Dev (back) | Sem o filtro "Sem item" e sem "Vincular" |
| Fase 2: busca de item entre categorias (D17), para vincular na leitura | Dev (back) | Sem a busca; ficam as sugestões |
| Fase 2: encaminhar (D20) | Dev | Sem "Encaminhar" |
| Fase 2: envio por caixa do workspace (D19), para "Caixas como remetente" | Dev (back) | Sem o bloco "Caixas como remetente" |
| Fase 2: contato configurado na categoria (D5), para o link de "Contato do item" | Cartão "Contato da categoria" | Fica o texto da Fase 1, sem link |
| Fase 3: vínculo com a tarefa (D22) | Dev (back) | Sem a coluna Tarefa |
| Permissão de ver o item (D9) | Cargo | O e-mail do item não aparece |

**Como a pessoa usa**

1. Abre E-mails no menu, ou um dos 3 itens de Configurações › E-mails.
2. Em Mensagens, filtra (por exemplo, "Não lidos"; na Fase 2, "Sem item").
3. Clica na linha para ler e responde. Na Fase 2, sem item, clica na sugestão ou busca o item para
   vincular.
4. Para saber se o e-mail de um fluxo saiu, quem tem a permissão filtra "Do sistema" e confere o
   Status. Se falhou, clica em "Reenviar e-mail".
5. Quem administra abre Modelos ou Caixas de E-mail para o que hoje fica em Configurações ›
   E-mails.
6. Em Configurações, cada pessoa confere a conta de envio; quem administra ajusta o resto.

**Por que assim**

- O documento pede que o e-mail vinculado apareça "na área de E-mail do usuário". Essa área existe
  escondida: a tela "Emails Recebidos", sem entrada no menu.
- 1 lugar para o e-mail, com a configuração junto do uso, é o desenho de Pipefy, Help Scout e
  Bitrix24 (`PESQUISA-MODULOS-E-EMAIL.md`). Os guias de UX pedem 1 caminho por opção: por isso
  Configurações › E-mails abre a central e não vira um 2º destino.
- Fica na Fase 1 porque só reorganiza telas e permissões que existem. A lista por pessoa e
  permissão (D18), o e-mail sem item, "Caixas como remetente" e o contato por categoria pedem back
  e ficam na Fase 2.
- A tabela das telas novas do produto evita uma tabela com comportamento próprio. Com ela, as 3
  tabelas da central têm o mesmo menu de 3 pontos e o mesmo clique direito.
- **Os e-mails do sistema numa coluna e num filtro, sem aba própria** (pedido da redatora em
  24/11/2026: "me questiono se "enviados pelo sistema" deveria existir como aba ou deveria ser mais
  uma coluna e mais um filtro na aba de mensagens. veja o que é melhor."):
  - quem quer saber se o cliente recebeu um e-mail procura num lugar só, seja o e-mail escrito por
    uma pessoa ou enviado por um fluxo;
  - uma aba a mais repetiria a mesma tabela, com colunas quase iguais;
  - o filtro rápido "Do sistema" dá o mesmo recorte em 1 clique.
- **Risco para o back na Fase 1:** hoje são 2 listas separadas, a dos e-mails dos itens e a dos
  enviados pelo sistema. Juntar as 2 numa tabela com paginação pode pedir trabalho no back (D24;
  9, pergunta 14).
- O estado inicial diz o próximo passo porque a tabela vazia, sozinha, não diz o que falta: a conta
  do Outlook, os modelos, as caixas ou o 1º e-mail.

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
| Atalho de e-mail (5.1 a 5.5) | Botão dividido, ícone no campo, submenu, coluna, lote, lembrete, motivo de indisponível, contato tirado dos campos de e-mail do item | Nada |
| Clique direito no quadro (5.3, 5.4) | Itens novos no menu que o cartão já tem | Nada |
| WhatsApp (5.7) | Botão, ícone e submenu nas telas dos atalhos, fila para várias pessoas, link do formulário pelo WhatsApp, motivo de indisponível | Nada: o link é do próprio WhatsApp |
| SMS (5.8) | Botão, ícone e submenu ao lado do WhatsApp, o painel "Enviar SMS" com o QR code, a contagem e os botões de copiar, a fila, o link do formulário por SMS, o motivo do telefone fixo | Nada: o link `sms:` é do aparelho |
| Link público (6) | Cartão e menu nas telas de uso | Nada: o link e a visibilidade já existem |
| "Novo e-mail" e compositor (7.2, 7.3) | Gaveta aberta de qualquer tela, contexto da tela, "De" e "Responder para", bloco "Item vinculado" com o item da tela de origem | Nada: o envio com item já existe |
| Responder (7.5) | E-mail novo com "Re:", texto citado e aviso | Nada |
| Mail Box em todo item e na tarefa (7.8, 7.9) | Aba em todo item; aba no painel da tarefa | Nada |
| Central E-mails (7.7) | Entrada no menu; 4 abas que seguem a permissão de hoje; Mensagens, Modelos e Caixas de E-mail na tabela das telas novas do produto; aba Mensagens sobre a tela "Emails Recebidos", com os e-mails do sistema (filtro "Do sistema", coluna Status e "Reenviar e-mail"); estado inicial do workspace novo e do primeiro uso; aba Configurações; os 3 itens de Configurações › E-mails abrem as abas | As telas, os dados e as permissões já existem (pergunta 13). A lista única dos e-mails dos itens e do sistema pode pedir back (D24, pergunta 14) |

### Fase 2 · Remetente

| Ponto | Front | Back |
|---|---|---|
| Contato da categoria (4.2) | Cartão e página no painel da categoria, com a origem do telefone e o texto pronto do WhatsApp; "Escolher os campos de contato" no item; link em E-mails › Configurações | Guardar o contato e o texto pronto (onde: pergunta 1) |
| Vincular a item (7.4) | Campo de busca com sugestões, Trocar e remover; autocompletar do Para com contatos de outros itens | Rota de busca de item entre categorias, filtrada por permissão |
| Aba Mensagens por pessoa e permissão (7.7) | Filtro da lista pelo que a pessoa pode ver | Lista por pessoa e permissão |
| "De" com as caixas do workspace (4.4, 7.3, 7.7) | Lista em 2 grupos e a ajuda de para onde vão as respostas; bloco "Caixas como remetente" em E-mails › Configurações | Envio por caixa do workspace; guardar quais caixas entram no "De"; regra de quem envia por qual caixa |
| Resposta na mesma conversa (7.5) | Religar o "Responder" | Enviar como resposta da conversa original |
| Encaminhar (7.5, 7.7, 7.8) | Botão e ação no menu | Encaminhar com os anexos |
| Registro sem item (7.3, 7.7) | Filtro "Sem item" e aviso com "Ver em E-mails" | Gravar o enviado sem item |
| Vincular e trocar depois (7.7) | "Vincular a um item", sugestões e "Trocar" na leitura | Rota para vincular e trocar o item de um e-mail |

### Fase 3 · Tarefa

| Ponto | Front | Back |
|---|---|---|
| Vincular a tarefa (7.3) | Campo "Vincular a tarefa" no compositor | Guardar a tarefa no registro do e-mail |
| Mail Box da tarefa (7.9) | Seletor "Desta tarefa" e "Do item" | Listar os e-mails por tarefa |
| Coluna Tarefa na aba Mensagens (7.7) | Coluna, filtro e campo na leitura | O mesmo dado do vínculo |

## 9. Perguntas para dev e produto

1. **Contato por categoria (Fase 2):** onde guardar? A categoria já guarda configuração em JSON; o
   contato cabe ali ou pede estrutura própria? Quem pode editar?
2. **Envio por caixa do workspace (Fase 2):** a rota de envio passa a aceitar a caixa como
   remetente? Quem envia por qual caixa: todo membro, um cargo ou os membros ligados à caixa? Sem
   item, a resposta cai na Central de Atendimento: é o destino certo?
3. **Registro de e-mail sem item (Fase 2):** o enviado sem item passa a ser gravado? Quem o vê na
   aba Mensagens: só quem enviou, ou todos com acesso à caixa usada?
4. **Vincular depois (Fase 2):** não há rota para ligar um e-mail sem item a um item, nem para
   trocar o item. Criar?
5. **Resposta na mesma conversa (Fase 2):** o "Responder" está comentado na tela do develop. O que
   falta para religar?
6. **Caixas do workspace na aba Mensagens (Fase 2):** quem vê o que chega numa Caixa de E-mail do
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
11. **Botão no cartão do quadro:** onde fica e qual o rótulo (o "Notify" do mockup 5, "E-mail" ou só
    o ícone)?
12. **Tela inicial:** o Felipe concorda em tirar os atalhos da tela inicial (5.6)?
13. **Aba Mensagens na Fase 1:** a tela "Emails Recebidos" de hoje basta como base da aba? Ela
    mostra também os enviados com item, ou só os recebidos? Quem a vê hoje: todo membro, ou só quem
    vê o item do e-mail?
14. **E-mails do sistema na aba Mensagens (Fase 1):** a aba consegue juntar as 2 listas de hoje (os
    e-mails dos itens e os enviados pelo sistema) com ordem e paginação únicas, sem back novo? Se
    não, a saída da Fase 1 é o filtro "Do sistema" trocar a fonte da tabela (1 lista por vez), e a
    lista única fica para a Fase 2.
15. **Telefone do membro:** o WhatsApp ao responsável da tarefa e ao participante da Agenda usa o
    telefone do membro. O cadastro do usuário tem o campo, mas nenhuma tela deixa a pessoa
    preenchê-lo. O perfil ganha o campo?
16. **Máscara do telefone:** a máscara do Texto com máscara pode ser escrita à mão. O campo de
    telefone com outra máscara, como "(##) ####-####", também conta como telefone?
17. **SMS no Windows:** com o Vincular ao Celular pareado, o link `sms:` abre a conversa com o número
    e o texto? Teste no Windows 11, com Android e com iPhone. Se não abre, o QR code sobe para o 1º
    lugar no Windows.
18. **SMS pelo próprio ENSPACE:** o envio por serviço de SMS (Twilio, Zenvia, Azure Communication
    Services pelo Messaging Connect), com registro no item, entra no roteiro? Pede back-end, custo por
    SMS e remetente cadastrado.
19. **QR code:** qual biblioteca gera o código no navegador, sem serviço de fora?
20. **iPhone:** o iOS aceita `sms:+<número>?body=<texto>`? Versões antigas liam `&body=`.

## 10. O que o protótipo não faz

- Não abre o app de verdade: abre uma simulação, com o selo "Simulação · fora do ENSPACE" e o link
  exato no topo. Ela segue as regras desta especificação:
  - **app de e-mail:** com o endereço do item em Cc, a cópia chega à Mail Box do item; sem ele, o
    ENSPACE não fica sabendo;
  - **página pública do formulário:** a resposta cria um item na categoria do formulário;
  - **app de SMS e Google Messages Web:** a conversa com o número e o texto, ou vazia no Google
    Messages Web, com "Colar" para o que foi copiado; o ENSPACE não registra o SMS;
  - **Integrar contas:** Perfil › Integrações e o consentimento da Microsoft; aceitar libera o
    compositor.
- Não envia e-mail de verdade nem grava nada fora do navegador: tudo fica na memória e some ao
  recarregar.
- O Salvar da Visão Geral grava no item (em memória). É o fim da jornada "Cadastrar e-mail".
- Não tem cargo nem permissão de edição: "Cadastrar e-mail" aparece sempre (no produto, só para
  quem edita o campo).
- O seletor "Perfil: Admin | Membro", na barra de baixo, mostra a central E-mails pelos 2 olhares.
  O membro vê só as abas Mensagens e Configurações, com "Sua conta de envio", e o menu sem a seção
  Configurações. Em Mensagens, o membro não vê os e-mails do sistema, o filtro "Do sistema" nem a
  coluna Status. No produto, quem decide é a permissão de hoje de cada aba e dos e-mails enviados
  (D4).
- O seletor "Dados: Workspace novo | Primeiro uso | Em uso", na barra de baixo, mostra o estado
  inicial da central (7.7). Workspace novo tira os modelos, as caixas, a conta do Outlook e os
  e-mails. Primeiro uso tira só os e-mails. Em uso traz os dados de exemplo.
- Nas abas Modelos e Caixas de E-mail, "Novo modelo", "Nova caixa", "Editar", "Excluir" e o clique
  na linha mostram o aviso "Esta ação não tem efeito no protótipo.", como o "Abrir Integrações" de
  Configurações. "Usar em um e-mail" abre o compositor com o modelo.
- Em Mensagens, "Reenviar e-mail" muda o status para "Em processamento". O protótipo lê os e-mails
  do sistema da mesma lista dos outros; no produto, são 2 listas (D24).
- A referência do item aparece curta (ex.: CTR-00231) para leitura. No produto é o código de 32
  caracteres, e o endereço do item usa esse código.
- O QR code do painel "Enviar SMS" é um desenho de exemplo e não abre nada na câmera; o dev usa uma
  biblioteca que gera o código do link (pergunta 19).
- Os ícones são do conjunto lucide, o único instalado. O develop usa o conjunto solar; o dev usa o
  ícone do produto.
- A barra de baixo troca a fase (1 · MVP, 2 · Remetente, 3 · Tarefa), o perfil (Admin, Membro), os
  dados (Workspace novo, Primeiro uso, Em uso) e o cenário (Normal, Sem Outlook integrado, Envio
  falha).

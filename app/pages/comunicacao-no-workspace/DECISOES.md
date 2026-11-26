# Comunicação no workspace: decisões

## A proposta em 1 minuto

**Um protótipo para as 3 partes do documento**, porque elas mexem nas mesmas telas e no mesmo
botão de E-mail (motivo no `BRIEFING.md`, seção 4). Os canais são **e-mail, WhatsApp e SMS**: os 2
últimos saíram na rodada 6; o WhatsApp voltou na 10, pelo link do próprio WhatsApp, e o SMS na 11,
pelo painel "Enviar SMS", que junta os caminhos para enviar do celular da pessoa.

**O protótipo se divide em 4 fases**, escolhidas no controle "Fase" da barra de baixo. A Fase 4 é o
destino: a central vira "Comunicações" e guarda o e-mail, o SMS e o WhatsApp que o ENSPACE envia.

| Fase | O que entra | Base |
|---|---|---|
| 1 · MVP | Atalhos e telas que só usam o que o produto já tem, sem back-end novo: botão E-mail nas telas de uso (o contato vem dos campos de e-mail do item), "Novo e-mail" no topo, Mail Box na tarefa (a do item dela), link do formulário público, a central E-mails com as telas de e-mail de hoje em abas e as 5 melhorias da rodada 14 (coluna "Saiu por", os 5 status, o motivo da falha, a origem no "Enviado por" e o Reenviar no Cancelado) | Lido no código do develop: o envio sai do Outlook da pessoa e só fica registrado com item; os 5 status, o motivo e a origem já estão no registro do envio |
| 2 · Remetente | Escolher o "De" (Outlook ou caixa do workspace) e quais caixas entram nele, responder na mesma conversa, encaminhar, registrar e-mail sem item e vincular depois; o contato por categoria, a busca de item entre categorias e a lista de mensagens por pessoa | Funcionalidade nova, com back-end |
| 3 · Tarefa | Vincular o e-mail a uma tarefa e a Mail Box própria da tarefa ("Desta tarefa" e "Do item") | Funcionalidade nova |
| 4 · Comunicações | A central "Comunicações", com o e-mail, o SMS e o WhatsApp que o ENSPACE envia: filtro por canal, coluna Entrega e filtro "Não entregues"; os nós "Enviar SMS" e "Enviar WhatsApp" no Spaceflow; os modelos de WhatsApp aprovados pela Meta; "Enviar pelo ENSPACE" no painel "Enviar SMS"; a seção "Canais de envio do workspace" | Back novo: status de entrega pelo webhook da SendGrid (C1), envio de SMS pela Twilio do workspace (C2) e de WhatsApp com modelo aprovado (C3), da pesquisa de 2026-11-26 |

| Parte do documento | Onde aparece no protótipo |
|---|---|
| (a) Link do formulário público | Requisições (cartão "Compartilhar este formulário"); lista de itens da categoria; painel da tarefa de preencher formulário |
| (b) Atalho de e-mail, WhatsApp e SMS | Item (Contato do item na lateral e ícone ao lado do campo de e-mail e do de telefone); lista e quadro de itens (submenus "E-mail", "WhatsApp" e "SMS"); tarefas (coluna Contato, e-mail em lote, fila do WhatsApp e do SMS, clique direito, painel); Agenda (lembrete por e-mail, por WhatsApp e por SMS); o painel "Enviar SMS" |
| Configuração | Aba Configurações da central E-mails: a conta de envio de cada pessoa e, para quem administra, o contato do item, o remetente com o domínio da empresa e (Fase 2) as caixas no "De". Sem chave em Sistema › Módulos: o e-mail vem sempre ligado. Categorias › cartão "Contato da categoria" (Fase 2, a avaliar com os devs) |
| E-mail do ENSPACE em todas as telas | "Novo e-mail" no topo, que reconhece o item ou a tarefa aberta; o compositor; a central "E-mails" no menu, com Mensagens (também os enviados pelo sistema, para quem tem a permissão), Modelos, Caixas de E-mail e Configurações, cada aba pela permissão de hoje; o estado vazio de cada tabela diz o próximo passo |

## O fluxo do e-mail

```
De qualquer tela                     Do item, da tarefa ou da Mail Box
   │ Novo e-mail (topo: já vinculado    │ E-mail (botão dividido ou ícone)
   │ ao item ou à tarefa aberta)        │
   ▼                                    ▼
Nova Mensagem ── De: Fase 1, o Outlook da pessoa
   │               Fase 2, o Outlook ou uma caixa do workspace
   │ Item: Fase 1, só o da tela de      │ Item vinculado: já preenchido
   │ origem; Fase 2, busca (opcional)   │
   │ Vincular a tarefa (Fase 3)         │
   ▼                                    ▼
 Enviar ─────────────────────────────────┘
   │
   ├─ com item: Responder para = endereço do item; aparece na Mail Box do item
   │            (e, na Fase 2, em E-mails)
   └─ sem item: Fase 1, nada fica no ENSPACE (só no Outlook da pessoa);
                Fase 2, aparece em E-mails com "Vincular", para ligar ao item depois

Sem o Correio do Outlook integrado: a gaveta mostra "Nenhuma conta integrada
disponível" e "Integrar contas"; o botão E-mail abre o app da pessoa (mailto:).
```

## Rodada 1 · 2026-10-05

- **Pedido (literal):** "voce deve construir o front das propostas que estao neste doc. agrupe o
  que fizer sentido [...] lembre-se de dar conta de TODOS os pontos daí: configuraçao (user
  configurador jornada) e jornada de usabilidade tambem daquilo ali". No meio da rodada: "veja
  como funciona tambem nossa folders de emails pra ver se existe endereço do item etc pra isso
  fazer sentido, ok? ou se é endereço do workspace inteiro".
- **Mudou:** protótipo novo, com 9 telas navegáveis pelo menu lateral:
  - Início, lista e quadro de itens, item, Tarefas Rápidas (quadro e lista), Agenda, Requisições,
    E-mails, Sistema e Categorias;
  - o compositor ("Nova Mensagem") abre de qualquer uma.
- **Fronteira:** muda o que o contorno tracejado mostra (chave "Mostrar o que muda" no andaime);
  não muda a casca (menu, barra do topo, trilha) nem o conteúdo de hoje das telas.
- **Maquete:**
  - os atalhos não abrem o app: mostram, num aviso, o link exato que abririam (`mailto:`,
    `https://wa.me/...`, `sms:`). Assim ninguém manda mensagem para número inventado;
  - "Abrir numa nova aba" do link público só avisa;
  - Enviar grava o e-mail na memória (some ao recarregar). O cenário "Envio falha" do andaime
    mostra o erro;
  - Anexar arquivo acrescenta um nome de arquivo fictício;
  - as pastas do item fora de Visão Geral, Tarefas e Mail Box mostram "Pasta fora deste
    protótipo";
  - "Tornar público" e "Tornar privado" no menu do formulário são atalho do protótipo para o Editar
    › Visibilidade (e para o "Alternar Privacidade" do construtor), que já existem.
- **Não deu:** prints das referências (a pesquisa leu a documentação, sem captura); `vue-tsc` para
  checar tipos (não está instalado e instalar mexe no `package.json`).
- **Ver:** `http://localhost:3000/comunicacao-no-workspace` · prints:
  [início](evidencias/prototipo-01-inicio-atalhos.jpg),
  [item](evidencias/prototipo-02-item-contato-rapido.jpg),
  [E-mail com 2 caminhos](evidencias/prototipo-03-email-dois-caminhos.jpg),
  [compositor e busca](evidencias/prototipo-04-compositor-busca-de-item.jpg),
  [Sistema › Módulos](evidencias/prototipo-05-sistema-modulos.jpg).

## Rodada 2 · 2026-10-05

- **Pedido (literal):**
  - "saiba que os atalhos de comunicaçao nao devem ser um modulo simplesmente deve existir no
    enspace. usuario nao precisa ativar. isso existe por padrao. ajuste esse ponto de jornada de
    configurador", e depois: "calma... o felipe pediu pra ser módulo? se sim, entao mantenha.";
  - "me diga quais produtos voce pesquisou pra executar esse prototipo. voce deve considerar hubspot
    na sua lista, alem de apollo. clickup tem que ser considerado, monday, twenty e outros tambem.
    garanta uma pesquisa mais extensa pra ver se a ux ta interessante e use
    /nuxt-ui:implement-component-with-props (MCP) /nuxt-ui pra melhorar o que precisar".
- **O módulo fica.** O documento do Felipe pede: "Todos esses botões devem ter opção nas
  configurações de aparecerem ou não nas telas, do mesmo modo como foi feito em correções
  monetárias, comparador". Correção Monetária e Comparador moram no cartão Módulos de Sistema.
- **Pesquisa:** 20 produtos na rodada 2 (lista e avaliação de cada decisão no `PESQUISA.md`, seção
  "Rodada 2").
- **Mudou:**
  - **E-mail em botão dividido:** o clique escreve pelo ENSPACE, a seta abre o app. Some o clique a
    mais da rodada 1;
  - **o aviso do Cc** no menu da seta: a resposta volta ao item quando a pessoa responde a todos;
  - **canal sem dado** continua no Tab (`aria-disabled`), diz o motivo e leva ao campo:
    "Cadastrar telefone", "Corrigir telefone", "Cadastrar e-mail";
  - **telefone com menos de 10 dígitos** dá "Telefone inválido" (o mock da Atlas tem um);
  - **compositor:** sem camada escura e sem travar a página; Expandir; Minimizar e Esc guardam o
    rascunho numa barra do rodapé, que continua na troca de tela; "Rascunho salvo" no rodapé;
  - **foco ao abrir:** no "Para"; vindo do item, no texto;
  - **atalhos de teclado:** C escreve (fora de campo de texto), Ctrl+Enter envia. As dicas mostram
    as teclas;
  - **"De":** com 1 opção vira texto; ganha destaque quando o vínculo troca o remetente;
  - **"Para":** sugere também os contatos dos itens que a pessoa vê;
  - **sugestão de item** no bloco "Vincular a item", pelos destinatários;
  - **E-mails:** "Vincular" na linha do e-mail sem item e sugestão de item pelo remetente na
    leitura;
  - **lote de WhatsApp e SMS** vira fila: quem fica de fora antes de começar, "Conversa 1 de N",
    "Abrir conversa" e "Próxima";
  - **lembrete da Agenda** leva o local do evento;
  - **link do editor** em português, espanhol e inglês (`_LinkDoEditor.vue`, cópia traduzida do
    exemplo `EditorLinkPopover` do Nuxt UI).
- **Descartado, com o motivo:**
  - trocar o bloco "Vincular a item" por uma linha junto do Enviar (formato do HubSpot e do
    Salesforce): o documento pede o vínculo "visualmente separado";
  - 2 ou 3 textos iniciais por categoria e mais de 1 telefone por contato: ficam para depois, porque
    mexem na configuração da categoria;
  - link curto e QR code para o link do formulário: dependem de serviço fora do ENSPACE;
  - lembrar a última escolha do botão E-mail: precisa de preferência por pessoa.
- **Maquete:** a mesma da rodada 1. O rascunho e os e-mails somem ao recarregar.
- **Não deu:**
  - o `/nuxt-ui:implement-component-with-props` é um prompt do MCP que a pessoa chama no chat; o
    agente não chama prompt. No lugar, as ferramentas do MCP `nuxt-ui`: metadados de `FieldGroup`,
    `DropdownMenu`, `Slideover`, `InputMenu` e `Editor`, e os exemplos `FieldGroupDropdownExample` e
    `EditorLinkPopover`;
  - Apollo, ClickUp, monday, Salesforce e RD Station: a ajuda bloqueia leitura automática (403 ou
    página montada por script). O que veio da busca está marcado "só busca" no `PESQUISA.md`.
- **Ver:** `http://localhost:3000/comunicacao-no-workspace` · prints:
  [E-mail em botão dividido](evidencias/prototipo-06-email-botao-dividido.jpg),
  [compositor com sugestão de item](evidencias/prototipo-07-compositor-sugestao-de-item.jpg),
  [rascunho minimizado](evidencias/prototipo-08-rascunho-minimizado.jpg),
  [fila de WhatsApp](evidencias/prototipo-09-fila-de-whatsapp.jpg),
  [E-mails com sugestão pelo remetente](evidencias/prototipo-10-emails-sugestao-pelo-remetente.jpg),
  [escuro e espanhol](evidencias/prototipo-11-escuro-espanhol.jpg).

## Rodada 3 · 2026-10-05

- **Pedido (literal):** "voce tem certeza que tudo que ta nesse prototipo cabe na estrutura LÓGICA
  do enspace? quando tiver certeza, me diga: qual a logica pro uso de cada ponto da
  funcionalidade? isso tem q estar documentado num docx."
- **Conferido:** o código da Mail Box no develop (gaveta "Nova Mensagem"), os schemas do SDK 0.17,
  a documentação de suporte (`en-docs`, só leitura) e as telas do workspace de exploração.
- **Premissa errada, corrigida:** o e-mail da Mail Box **não sai do endereço do item**. Sai da conta
  do Outlook que a pessoa integrou (Perfil › Integrações › Correio do Outlook), pela integração do
  Correio do Outlook. A resposta vai para o endereço do item, e o e-mail fica ligado à referência do
  item. Sem conta integrada, a gaveta mostra "Nenhuma conta integrada
  disponível" e "Integrar contas". A pergunta da rodada 1 (o vínculo é o remetente?) acabou: o
  remetente é sempre a pessoa; o vínculo só define para onde a resposta volta e onde o e-mail fica.
- **Mudou:**
  - "De" fixo na conta do Outlook da pessoa; com item, a linha "Responder para" com o endereço do
    item; sem item, "a resposta chega só no seu Outlook";
  - saiu a "caixa para e-mail sem item" de Sistema › Módulos: caixa do workspace é remetente de
    fluxo e porta de entrada de Spaceflow, não do e-mail que a pessoa escreve;
  - cenário "Sem caixa de e-mail" virou "Sem Outlook integrado": a gaveta mostra o aviso de hoje e o
    botão E-mail abre o app da pessoa;
  - "Inserir assinatura" no compositor (existe hoje na Mail Box);
  - link público só para formulário público de tipo Criação ou Geral (Editar e Visualizar dependem
    de um item que o link não leva); na tarefa, a linha "a resposta cria um item novo e não conclui
    a tarefa";
  - Agenda: evento de item mostra "Contatos do item", sem local; evento de tarefa mostra o
    "Responsável"; só a reunião do Outlook tem participantes e local;
  - contato da categoria aceita os subcampos do Pessoa/Empresa (nome, e-mail e telefone de contato);
  - os e-mails enviados do mock saem da conta de quem enviou, não do endereço do item.
- **Confirmado, sem mudança:** módulo em Sistema › Módulos (como Correção Monetária e Comparações);
  cartão na categoria (como Correção Monetária); atalho na tela inicial (como "Acessar
  Comparações"); tarefa rápida com formulário (vem de Spaceflow); telefone sem tipo próprio (Texto
  com máscara), por isso o mapeamento por categoria.
- **Não deu:** a documentação diz que o Correio do Outlook "exibe sua caixa de entrada dentro do
  ENSPACE e permite vincular e-mails a tarefas e registros", e o código do develop não tem essa tela
  nem a rota de vínculo. Fica como pergunta ao dev.
- **Entrega:** `LOGICA-DA-FUNCIONALIDADE.docx`, com o funcionamento, a jornada e a justificativa de
  cada ponto.

## Rodada 4 · 2026-10-05

- **Pedido (literal):** "nesse caso voce ja ta notando que, por exemplo, pra funcionar a caixa de
  email do item depende de a integraçao com outlook estar ativada no workspace/perfil do user. na
  hora que for descrever os pontos no doc tem q deixar bem explicitas essas dependencias que sejam
  similares a isso aí".
- **Mudou no documento:**
  - seção 2 nova, "Mapa de dependências": 21 dependências (D1 a D21), com de quem é, se existe hoje,
    os pontos afetados e o que a pessoa vê quando falta;
  - bloco "Depende de" em cada ponto (18 blocos), com onde se resolve e o que acontece se faltar;
  - o Correio do Outlook aparece como integração do **perfil de cada pessoa**, não do workspace: o
    administrador não liga pelos outros;
  - dependências que não estavam escritas: Calendário do Outlook (separado do Correio) para as
    reuniões da Agenda; permissão de editar o campo para "Cadastrar telefone"; tela Requisições no
    menu; Configurações da Agenda; apps no computador da pessoa para `mailto:`, `wa.me` e `sms:`;
    autorização do app do ENSPACE na conta Microsoft; assinatura no Outlook.
- **Mudou no protótipo:** a dica do menu de links vazio diz "Público e do tipo Criação ou Geral".
- **Fica de fora do protótipo:** cargo e permissão de edição. "Cadastrar telefone" aparece sempre;
  o documento diz a regra para o dev.

## Rodada 5 · 2026-10-07

- **Pedido (literal):** "atalhos NA HOME fazem sentido? vai pegar link do que ali? vai ter email
  vinculado a que? nao vejo logica. alem disso, voce tem que de fato simular o comportamento dos
  botoes. só o botao de email ta com comportamento previsivel".
- **Saiu a linha "Atalhos" da tela inicial.** Na tela inicial não há destinatário (WhatsApp e SMS
  abriam vazios), item para vincular ao e-mail nem formulário certo para o link. O e-mail sem
  contexto já existe no "Novo e-mail"; o link público fica onde o formulário está em uso. "Tela
  inicial" saiu de "Onde aparecem" em Sistema › Módulos.
- **Os botões simulam o app de fora** (`_AppExterno.vue`, andaime, não proposta). Cada janela leva o
  selo "Simulação · fora do ENSPACE", o link exato e a frase do que acontece no produto:
  - WhatsApp e Mensagens: texto inicial pronto, envio na conversa, "O ENSPACE não registra";
  - app de e-mail: De, Para, Cc e Assunto preenchidos; com o endereço do item em Cc, a cópia chega à
    Mail Box do item;
  - "Abrir numa nova aba" do formulário: a página pública; a resposta cria o item na categoria;
  - "Integrar contas": Perfil › Integrações, Sincronizar e o consentimento da Microsoft; aceitar
    libera o compositor;
  - a fila de WhatsApp e SMS das tarefas e o lembrete da Agenda abrem a mesma simulação.
- **Outros botões que só davam aviso:**
  - "Salvar" e "Sair sem salvar" da Visão Geral do item gravam e desfazem: "Corrigir telefone" fecha
    a jornada e o WhatsApp libera;
  - "Anexar arquivo" abre o seletor de arquivos do computador (o arquivo não sai do navegador);
  - "Copiar link" do item copia o endereço do item.
- **Corrigido no caminho:** o lembrete para todos dizia "Olá, . Lembrete"; sem nome, vira "Olá.". O
  evento de item na Agenda lê os contatos do item na hora (o que a Visão Geral salvou vale ali).
- **Registro novo:** a data é o dia do protótipo (05/10) com a hora do relógio.
- **Ver:** prints [WhatsApp](evidencias/prototipo-13-simulacao-whatsapp.jpg),
  [app de e-mail](evidencias/prototipo-14-simulacao-app-de-email.jpg),
  [formulário público](evidencias/prototipo-15-simulacao-formulario-publico.jpg).

## Rodada 6 · 2026-11-17

- **Pedido:** o retorno geral sobre o protótipo e o "De" escolhido pela pessoa ("se sai do outlook
  ou de alguma caixa específica do enspace"). Aprovação do plano, literal: "pode aplicar. ícone ao
  lado do campo, chave em módulos ok", com 4 observações:
  - "nao teremos conexao com whatsapp e sms";
  - o módulo de e-mail em todas as telas "nao faz sentido. deve simplesmente aparecer a chave do
    modulo atalhos de comunicaçao";
  - "o user nao deve poder configurar onde eles aparecem, nem os canais";
  - "precisa prototipar a logica de ter um contato pra cada categoria [...] aí avaliamos com os
    devs".
  Para a tabela: "use /investigar-codigo pra ler o componente de tabelas do enspace usado na tela
  de logs e nas novas telas de itens".
- **Fases no andaime.** O controle "Fase" da barra de baixo troca entre 1 · MVP, 2 · Remetente e
  3 · Tarefa. A Fase 1 só usa o que o código do develop já faz:
  - o envio sai da integração da pessoa com o Correio do Outlook; não há envio pela caixa do
    workspace;
  - o e-mail enviado só fica registrado no ENSPACE com item;
  - as caixas do workspace (Central de Atendimento) só recebem;
  - "Responder" está comentado na tela do develop: na Fase 1, responder abre um e-mail novo, com
    "Re:" e o aviso de que não continua a conversa;
  - tarefa não tem vínculo com e-mail.
- **Saiu:** WhatsApp, SMS, telefone do contato, texto inicial do app, a fila de envio das tarefas,
  a escolha de telas e canais em Sistema › Módulos e o módulo "E-mail do ENSPACE em todas as telas".
- **Sistema › Módulos:** 1 chave, "Atalhos de comunicação", com a lista do que ela ativa e o link
  para o contato de cada categoria.
- **Contato da categoria (a avaliar com os devs):** o cartão 13 da categoria diz de quais campos
  vêm o nome e o e-mail de cada contato e o assunto do e-mail, com a prévia de Para, Assunto e Cc.
  Alimenta o "Contato do item" na lateral do item, que voltou. A categoria guarda configuração em
  JSON hoje, mas o contato é dado novo.
- **Item:** o "Contato rápido" virou "Contato do item", com o botão E-mail dividido; o campo de
  e-mail ganhou o ícone ao lado; a Mail Box tem o botão "Novo e-mail" com rótulo no lugar do lápis
  e "Responder" no hover da linha.
- **"Novo e-mail" do topo reconhece a tela:** com um item ou uma tarefa aberta, o compositor já abre
  vinculado a ela. A dica do botão diz a qual item.
- **Tarefas:** o painel tem as abas Detalhes e Mail Box. Fases 1 e 2: a Mail Box do item da tarefa.
  Fase 3: "Desta tarefa" e "Do item". Tarefa sem item mostra o vazio com o motivo (Fases 1 e 2).
- **Compositor:**
  - Fase 2: o "De" é uma lista em 2 grupos, a conta do Outlook e as caixas do workspace, com a ajuda
    de para onde vão as respostas;
  - Fase 3: "Vincular a tarefa";
  - sem item na Fase 1, a ajuda do "De" avisa que o e-mail não fica no ENSPACE.
- **E-mails refeita no padrão do develop** (tela de Logs de Auditoria e telas novas de itens):
  - ações na 1ª coluna, com o rótulo "Ações" e o menu ⋮; o mesmo menu no clique direito da linha;
  - cabeçalho com ordenar e o funil do filtro da coluna (`_FiltroDeColuna.vue`): texto com
    operadores em frase ("É totalmente Igual a", "Contém parcialmente"...), um por operador; seleção com
    busca, Todos e Limpar;
  - barra com busca, período, "Limpar filtros", Colunas e os filtros rápidos (Recebidos, Enviados,
    Não lidos, Com anexo e, na Fase 2, Sem item);
  - paginação "Mostrando 1 a 10 de 10 resultados" com itens por página;
  - a leitura do e-mail abre em painel lateral, com Responder, Encaminhar (Fase 2) e o vínculo com
    o item (sugestões pelo remetente e busca).
- **Ícones:** o develop usa o conjunto solar; o protótipo usa lucide, o único instalado. A forma do
  ícone é a mais próxima; o dev usa o do produto.
- **Corrigido no caminho:**
  - nome e e-mail do contato colados na lista de itens;
  - a classe da marca de proposta não chegava ao botão de e-mail (o componente não tinha raiz);
  - o compositor piscava vazio ao fechar depois de enviar;
  - texto de interface no registro formal (Sistema, Agenda) e o vazio da Mail Box da tarefa.
- **Ver:** prints [E-mails](evidencias/prototipo-16-emails-tabela.jpg),
  [filtro da coluna](evidencias/prototipo-17-filtro-de-coluna.jpg),
  [De com as caixas](evidencias/prototipo-18-compositor-escolher-de.jpg),
  [Mail Box da tarefa](evidencias/prototipo-19-tarefa-mail-box.jpg),
  [contato da categoria](evidencias/prototipo-20-contato-da-categoria.jpg).
- **Valem até a rodada 5 e saíram aqui:** as seções "Canal sem dado", "Membro sem telefone" e
  "'Não gerar conteúdo' e o texto inicial" abaixo, e os prints de WhatsApp (09 e 13).

## Rodada 6, ajuste · 2026-11-18

- **Pedido (literal):** "pode deixar na fase 2 todos esses itens que voce falou que dao trabalho no
  backend."
- **Foram para a Fase 2:**
  - o cartão "Contato da categoria". Na Fase 1, o contato do item vem dos campos de e-mail que ele
    já tem, do subcampo de e-mail de Pessoa/Empresa e do e-mail de quem abriu a requisição;
    Sistema › Módulos diz isso no lugar do link para a categoria;
  - a busca de item entre categorias. Na Fase 1, o compositor só leva o item da tela de origem,
    fixo ("Item vinculado", sem Trocar nem remover); sem item de origem, o bloco não aparece. As
    sugestões de item e o autocompletar com contatos de outros itens também são Fase 2;
  - a área "E-mails" no menu, que pede a lista por pessoa e permissão.
- **No caminho:** sem nome de pessoa, a lateral do item mostra embaixo do e-mail o nome do campo,
  em vez de repetir o e-mail. Quem volta para a Fase 1 estando em E-mails ou no contato da
  categoria sai dessas telas.

## Rodada 7 · 2026-11-24

- **Pedido (literal):** "a configuração do módulo não deve ocorrer na tela de sistema. essa tela é
  mais direta." e "tem que ver como fazer com que essa tela geral já dê atalhos pra configuraçao
  tambem, pra que o user nao precise interagir com 2 lugares chamados "emails"." Depois da
  pesquisa, a escolha: "pode seguir com a hipótese A / o e-mail vem sempre ligado e tudo fica numa
  central "E-mails" no menu, com a configuração dentro dela." Sobre desligar os atalhos: "veja se
  realmente é necessário deixar desligar os atalhos na fase 2. talvez nao seja necessario."
- **Pesquisa:** [PESQUISA-MODULOS-E-EMAIL.md](PESQUISA-MODULOS-E-EMAIL.md), com 24 produtos e os
  guias de interface da Apple, do Android, do NN/g e do Carbon. Nos CRMs e help desks, o e-mail é parte da base, não módulo. Pipefy, Help
  Scout e Bitrix24 guardam a configuração do e-mail dentro da própria tela de e-mail.
- **Sem módulo, em nenhuma fase:**
  - a chave "Atalhos de comunicação" saiu de Sistema › Módulos, que voltou a ser cópia de hoje (3
    chaves: Correção Monetária, Comparações e Jurídico);
  - os atalhos não ganharam chave nem na Fase 2. Nenhum produto pesquisado tem chave geral de
    e-mail; o atalho só aparece onde o item tem e-mail, e o envio pede a conta do Outlook
    integrada. Quem não quer usar não clica, e o botão não ocupa lugar onde não há contato;
  - a Fase 1 perdeu o único trabalho de back que tinha: guardar a chave do módulo.
- **A central "E-mails"** fica na seção Membro nas 3 fases, com 5 abas:

  | Aba | O que mostra | Quem vê |
  |---|---|---|
  | Mensagens | a tabela de e-mails da rodada 6 | todo membro |
  | Modelos | a tela Modelos de E-mail de hoje, com "Usar em um e-mail" | quem tem a permissão de hoje |
  | Caixas de E-mail | a tela Caixas de E-mail de hoje | quem tem a permissão de hoje |
  | Enviados pelo sistema | a tela E-mails Enviados de hoje: o que tarefas e fluxos enviaram, com "Reenviar e-mail" | quem tem a permissão de hoje |
  | Configurações | "Sua conta de envio" para todos; para quem administra, "Contato do item", "Remetente com o domínio da empresa" (SendGrid) e, na Fase 2, "Caixas como remetente" | todo membro, com o recorte |

- **Configurações › E-mails vira atalho:** os 3 itens de hoje continuam no menu de Configurações e
  abrem a aba certa da central (marcados como proposta). Fica 1 destino só, e quem procura pelo
  caminho antigo chega ao mesmo lugar.
- **Perfil no andaime:** o seletor "Perfil: Admin | Membro" mostra a central pelos 2 olhares. O
  membro vê Mensagens e Configurações, só com a própria conta de envio, e não vê a seção
  Configurações do menu.
- **Saiu junto:** o aviso de módulo desligado na categoria e a condição do módulo nas telas de
  itens, tarefas e Requisições.
- **Ver:** prints [central em Mensagens](evidencias/prototipo-21-central-mensagens.jpg),
  [aba Configurações de quem administra](evidencias/prototipo-22-central-configuracoes.jpg),
  [central do membro](evidencias/prototipo-23-central-membro.jpg).

## Rodada 8 · 2026-11-24

- **Pedido (literal):**
  - "voce nao ta seguindo o componente de tabelas do enspace nesse prototipo. [...] o botao de
    açoes, inclusive, é um botao unico de 3 pontos com dropdown com as opçoes";
  - "me questiono se "enviados pelo sistema" deveria existir como aba ou deveria ser mais uma
    coluna e mais um filtro na aba de mensagens. veja o que é melhor.";
  - "estado inicial (assim que cria o workspace, nada feito, nada configurado, nada enviado...)" e
    "estado inicial (primeira vez vendo a tela de email, sem ter enviado nada e tal, mas pode ja
    estar configurado)".
- **A tabela do develop em toda a central.** Lido no código do develop em 24/11/2026: as telas
  novas (Logs de Auditoria, itens) usam a mesma tabela, com a coluna Ações primeiro (117 px), 1
  botão ⋮ que abre o menu da linha, o mesmo menu no clique direito, barra com busca e o paginador.
  O protótipo ganhou a cópia dela (`_TabelaDoEnspace.vue`) e do paginador (`_Paginador.vue`), e
  Mensagens, Modelos e Caixas usam as 2. Os ícones soltos de Modelos e Caixas saíram. Hoje as telas
  de Configurações › E-mails usam a tabela antiga; a central as leva para a nova.
- **"Enviados pelo sistema" virou filtro, não aba.** Os e-mails que tarefas e fluxos enviam entram
  em Mensagens:
  - o filtro rápido "Do sistema" e a opção "Sistema" no filtro de "Enviado por";
  - "Enviado por" mostra "Sistema · T-1042" quando há tarefa;
  - a coluna Status (Enviado, Em processamento, Falhou);
  - no menu ⋮ e na leitura, "Reenviar e-mail" no lugar de Responder;
  - Configurações › E-mails › E-mails Enviados abre Mensagens com o filtro ligado.

  Só quem tem a permissão de hoje de ver os enviados vê essas linhas, o filtro e a coluna. O
  e-mail do sistema continua fora da Mail Box do item, como hoje.
- **Estados iniciais, no controle "Dados" do andaime:**

  | Dados | O que o workspace tem | A aba Mensagens mostra |
  |---|---|---|
  | Workspace novo | nada: sem modelo, sem caixa, sem a conta do Outlook, sem e-mail | "Nenhum e-mail ainda", o próximo passo e "Integrar conta do Outlook"; quem administra vê também "Criar modelo" e "Criar caixa de e-mail" |
  | Primeiro uso | modelos, caixas e a conta do Outlook prontos, sem e-mail | "Nenhum e-mail ainda" e "Novo e-mail" |
  | Em uso | os dados de exemplo | a tabela |

  Modelos e Caixas vazios mostram o mesmo padrão, com "Novo modelo" e "Nova caixa". O 2º estado
  inicial ficou, porque o próximo passo muda: sem configuração, integrar; com configuração,
  escrever.
- **Ver:** prints [Mensagens com "Do sistema" e o menu ⋮](evidencias/prototipo-24-mensagens-do-sistema.jpg),
  [Modelos com o menu ⋮](evidencias/prototipo-25-modelos-menu-de-acoes.jpg),
  [workspace novo](evidencias/prototipo-26-workspace-novo-mensagens.jpg),
  [primeiro uso](evidencias/prototipo-27-primeiro-uso-mensagens.jpg).
- **Pedido (aba Configurações):** "a largura aqui nao ta estranha nao? e os recados nao estao muito
  soltos na tela? [...] e precisamos dos retangulos? [...] tem que seguir corretamente nosso design
  system."
- **Mudou:** a aba segue o padrão das telas de configuração novas do develop (Integrações › Webhooks,
  lido no código em 24/11/2026):
  - largura total da área, como as outras abas, no lugar da coluna estreita no meio;
  - cada grupo tem um cabeçalho (`UPageCard` naked, título e descrição) e 1 cartão (`UPageCard`
    subtle), no lugar de 4 cartões soltos;
  - os 2 recados soltos viraram descrição de cabeçalho: "Sua conta de envio" e "Regras do
    workspace", que diz que só quem administra vê o grupo;
  - dentro de "Regras do workspace", cada regra é uma linha (`UFormField`: rótulo e explicação à
    esquerda, ação à direita), separadas por `USeparator`, como no modelo de configurações do
    Nuxt UI.
- **Ver:** print [Configurações no padrão](evidencias/prototipo-28-configuracoes-no-padrao.jpg).
- **Pedido (ícones e títulos):** "voce mudou a aba de configuraçoes e acabou perdendo algumas coisas
  interessantes: os ícones que tava utlizando, título da seçao etc".
- **Mudou:** os ícones e o peso dos títulos voltaram dentro do estilo novo:
  - cabeçalho de seção com ícone no título (`#title` do `UPageCard`): pessoa em "Sua conta de
    envio", escudo em "Regras do workspace";
  - cada regra com ícone e o nome em negrito (`#label` do `UFormField`): contato, caixa de entrada
    e globo;
  - a descrição recua até o texto do título, para ícone e texto formarem uma coluna.
- **Ver:** print [Configurações com os ícones](evidencias/prototipo-30-configuracoes-com-icones.jpg).
- **Pedido (cartão da conta):** "perceba que o primeiro "card" ta estranho. diferente do padrao dos
  outros. só uma badge verde flutuante dentro. super estranho".
- **Mudou:** a conta de envio virou uma linha igual às regras: ícone de e-mail, "Correio do Outlook" em
  negrito, o status como descrição (círculo verde e "Conta conectada: <e-mail>", ou alerta amarelo e o
  aviso de que o botão E-mail abre o aplicativo do computador) e o botão à direita. O selo verde saiu.
- **Ajuste (alinhamento):** "meio colado, meio torto o texto em comparaçao ao simbolo". O ícone do
  status fica na coluna do ícone do título, e o texto na coluna do nome, cada ícone centrado na
  própria linha, com um respiro entre o nome e o status. Medido na tela: ícones e textos em 2 colunas
  exatas.
- **Ver:** print [a conta de envio em linha](evidencias/prototipo-31-conta-de-envio-em-linha.jpg).
- **Pedido (texto ao lado da busca):** "esses textos instrucionais ao lado das caixas de busca devem
  ser retirados. ta horrivel [...] talvez a própria aba possa ter um "i" de informaçao com tooltip
  indicando esse texto. acha que funciona?"
- **Mudou:** o texto saiu da barra de Modelos e Caixas, e o subtítulo de Mensagens saiu de baixo do
  título. Cada uma das 4 abas tem um "i" ao lado do nome, com o texto num `UTooltip`. As 4 abas
  explicam o que guardam do mesmo jeito.
- **Por que o "i", e não um aviso na tela:** o texto descreve a aba e só ajuda na primeira visita.
  Um aviso fixo ocuparia altura em toda visita, numa tela de tabela. Quando a lista está vazia, o
  estado vazio já dá a explicação completa e o próximo passo.
- **Ver:** print [o "i" de Modelos aberto](evidencias/prototipo-29-dica-da-aba-no-i.jpg).
- **Requisitos (2026-11-25):** pedido "pode criar os docs de requisitos dos epicos, ok? como achar que faz
  sentido". Saíram 6 épicos e 1 documento avulso em [requisitos/](requisitos/README.md): o épico 1 só mexe na
  tela, com o back de hoje; os outros pedem back novo ou mudança no SDK. O card no ENSPACE espera a confirmação
  da redatora.

## Rodada 9 · 2026-11-25 (prints de requisito e cards)

- **O SDK passou de 0.17 para 0.21** (atualização do repositório, outra sessão). O `EnKanbanBoard`
  0.21 tem menu de clique direito próprio no cartão e segura o evento: o submenu "E-mail" do quadro
  tinha sumido do protótipo. O `cliqueDireitoNoCartao` (em `estado.ts`) pega o clique direito antes
  do cartão e reabre o menu do protótipo, nos 2 quadros.
- **O quadro do produto não é o `EnKanbanBoard`:** é um componente do front, e o cartão já tem menu
  no clique direito (código da develop lido em 2026-11-25; falta conferir na tela). Itens: Ver
  Detalhes, Editar, Mover para, Enviar para Lixeira, Copiar Link (Duplicar quando a categoria
  permite). Tarefas: Editar, Duplicar, Mover para, Arquivar, Enviar para Lixeira, Copiar Link
  Externo. O menu do protótipo passa a copiar esse menu e a somar a proposta: "E-mail" no quadro de
  itens; "Abrir a Mail Box" e "Enviar e-mail para <nome>" no de tarefas. "Abrir tarefa" sai: no
  produto, o clique no cartão e o "Editar" já abrem a tarefa.
- **Requisitos alinhados:** RF311, RS301, RF421, RF422 e RS401 do épico 1 e RF312 do épico 6 citam o
  menu que o cartão já tem. O documento "Botão de e-mail no cartão do quadro" perde a prop do SDK
  (o botão é do front) e continua à parte só porque o botão ainda não tem desenho. A LOGICA segue
  igual (D23, 5.3, 5.4 e a pergunta 11).
- **Cartão do quadro de itens:** mostrava "Sem contato" quando o contato não tinha nome, mesmo com
  e-mail. Agora mostra o e-mail.
- **Correções que os prints de requisito acharam:**
  - o compositor abre por cima do painel da tarefa e do modal "Evento" da Agenda, e não fecha com
    clique fora;
  - "Trocar", na leitura do e-mail com item, mostra as sugestões, a busca e "Cancelar" (antes dizia
    que o e-mail não tinha item);
  - o filtro de período conta a partir do dia do protótipo (05/10/2026), não do relógio do
    computador;
  - o e-mail sem item aparece só para quem enviou (RN003 do épico 3): "Cadastro de fornecedor" passa
    a ser de Ana Ribeiro, que usa o protótipo;
  - na fase 1, "Do sistema" troca a fonte da tabela; a lista única é da fase 2.
- **Exemplos dos requisitos alinhados aos dados do protótipo** (nomes, referências, contagens), para o
  print mostrar o que o exemplo diz. Pergunta nova: P004 do épico 2, o assunto com {nome} quando o
  contato não tem nome.
- **Cards no ENSPACE** (desenvolvimento-enlighten2, 2026-11-25): 1 `user_story` por épico, com o
  documento do épico na descrição e 1 tarefa por parte; o documento "Botão de e-mail no cartão do
  quadro de itens e de tarefas" vira 1 card sem tarefas, com o documento inteiro na descrição. Todos com prioridade Média,
  status To Do, aprovação do PO e o link do protótipo.

  | Card (título no ENSPACE) | Tipo | Tarefas |
  |---|---|---|
  | [\[COMUNICAÇÃO NO WORKSPACE\] Escrever e-mail de qualquer tela e central E-mails no menu](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE43B719A7958E477E896536B49D307) | Melhoria | 10 |
  | [\[COMUNICAÇÃO NO WORKSPACE\] Escolher na categoria de onde vêm o nome e o e-mail do contato](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE9ECFA785A7DF40F0B715D3384C6D8) | Inovação | 2 |
  | [\[COMUNICAÇÃO NO WORKSPACE\] Gravar e-mail enviado sem item e filtrar Mensagens por permissão](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USEA192C88EF210435D86E3D0D759DD7) | Inovação | 5 |
  | [\[COMUNICAÇÃO NO WORKSPACE\] Enviar e-mail pelas Caixas de E-mail do workspace](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USEEA43CA2899994226AA8A6002D5799) | Inovação | 2 |
  | [\[COMUNICAÇÃO NO WORKSPACE\] Responder na mesma conversa e encaminhar e-mail](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USEE7549AB3B7AC401A8D2B5791E7D2C) | Inovação | 2 |
  | [\[COMUNICAÇÃO NO WORKSPACE\] Vincular e-mail a uma tarefa](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE0D4EAB388F5E4E238D7E3BDF138B1) | Inovação | 4 |
  | [\[COMUNICAÇÃO NO WORKSPACE\] Botão de e-mail no cartão do quadro de itens e de tarefas](https://be.enspace.io/workspaces/desenvolvimento-enlighten2/types/user_story/USE38811F4778A94A3983977CD6F8F9A) | Melhoria | 0 |

## Rodada 10 · 2026-11-25 (o WhatsApp volta)

Pedido da redatora: "pode voltar todos de whatsapp que tinha". Voltam os 8 pontos de WhatsApp que a
rodada 6 tirou; o SMS, a fileira de atalhos da tela inicial e a escolha de canais em Sistema ›
Módulos continuam fora.

| O que voltou | Onde |
|---|---|
| Botão WhatsApp no Contato do item e ícone ao lado do campo de telefone | `_TelaItem.vue`, `_BotaoWhatsApp.vue` |
| Submenu "WhatsApp" no menu da linha e no clique direito do cartão | `_TelaItens.vue` |
| Tarefas: ícone na coluna Contato, item no clique direito, botão no painel e a fila em lote ("Conversa 1 de N") | `_TelaTarefas.vue`, `_FilaDoWhatsApp.vue` |
| Agenda: ícone por pessoa e "WhatsApp para todos (N)", com a fila | `_TelaAgenda.vue` |
| Link do formulário público pelo WhatsApp, sem número | `_CompartilharFormulario.vue`, `_LinksPublicos.vue` |
| Os estados "Sem telefone cadastrado" e "Telefone inválido", com "Cadastrar telefone" e "Corrigir telefone" | `_TelaItem.vue`, `atalhos.ts` |
| Fase 2: a origem do telefone no "Contato da categoria" e o texto pronto do WhatsApp por categoria, sem chave de ligar | `_TelaCategoria.vue`, `estado.ts` |
| A simulação do WhatsApp Web: escolher a conversa, texto no campo, enviar | `_AppExterno.vue` |

- **O link é o do próprio WhatsApp** (ajuda do WhatsApp, "conversa em um clique", lida em
  2026-11-25; `PESQUISA.md`): `https://wa.me/<número>?text=<texto>`, ou `https://wa.me/?text=<texto>`
  sem número, e a pessoa escolhe a conversa. Abre o WhatsApp Web ou o app; a pessoa aperta Enviar; o
  ENSPACE não fica sabendo do envio. Não pede back-end, então fica no épico 1.
- **De onde vem o telefone, sem configuração:** o develop não tem campo do tipo telefone. Fica o
  Texto com máscara com a máscara "CEL: (###) #####-####" (lido no código do front, na develop de
  2026-11-25) e o Telefone de contato do Pessoa/Empresa. O mock ganhou essa máscara em
  "Telefone do contato", "Telefone de quem pediu" e "WhatsApp comercial".
- **O número:** só os dígitos, sem zero no começo; com 10 ou 11 dígitos ganha o 55; com menos de 10
  é inválido. "9210-8834", de CTR-00226, mostra o estado inválido.
- **Para várias pessoas, uma fila:** o link leva 1 número, e o navegador bloqueia várias abas de uma
  vez. A fila diz quem fica de fora e abre 1 conversa por vez, como na rodada 5. Os botões do lote
  contam só quem tem telefone válido e, com 0, ficam indisponíveis com `aria-disabled`.
- **Limite da Fase 1:** sem configuração, o e-mail e o telefone de um mesmo contato vêm de 2 campos
  e aparecem como 2 contatos ("E-mail do contato" e "Telefone do contato"). Só o Pessoa/Empresa junta
  os 2. Juntar é o "Contato da categoria" da Fase 2. Pergunta S904 do épico 1.
- **Texto pronto:** na Fase 1, fixo ("Olá, {nome}. Escrevo sobre {referencia} · {titulo}."); na
  Fase 2, o da categoria. Na tarefa e na Agenda, o texto do e-mail daquela tela.
- **O telefone do membro** (tarefas e Agenda) continua sem tela no produto: o cadastro do usuário tem
  o campo, e nenhuma tela o preenche. Pergunta P905 do épico 1.
- **Ajustes de passagem:** o submenu "E-mail" deixa de listar o contato que é só um campo de
  telefone; a coluna Contato mostra o telefone quando o contato não tem e-mail; as dicas dos 2
  quadros citam o WhatsApp.
- **Requisitos:** épico 1 (RN907, RN908 e RN917 a RN923; partes 3 a 7), épico 2 (RN901, RN904 e
  RN905; partes 1 e 2) e o documento do botão no cartão (RF007 e RF008). Os prints estão em
  `evidencias/requisitos/`.

## Rodada 11 · 2026-11-26 (o SMS volta)

Pedido da redatora: voltar com os atalhos de SMS, com a estética e a UX do ENSPACE, e ver como
enquadrar; depois, conferir se o Google Messages Web é a melhor escolha, porque a maior parte dos
clientes usa Microsoft. A pesquisa está em `PESQUISA.md`, "SMS no computador".

| O que entrou | Onde |
|---|---|
| Botão SMS ao lado do WhatsApp no Contato do item, e ícone ao lado do campo de telefone | `_TelaItem.vue`, `_BotaoSms.vue` |
| O painel "Enviar SMS": Para com "Copiar o número", mensagem com a contagem de SMS, "Abrir no app de SMS" e os outros caminhos (QR code, copiar, Google Messages Web) | `_PainelDoSms.vue` |
| Submenu "SMS" no menu da linha e no clique direito do cartão | `_TelaItens.vue` |
| Tarefas: ícone na coluna Contato, item no clique direito, botão no painel e a fila "Avisar por SMS" | `_TelaTarefas.vue`, `_FilaDoWhatsApp.vue` |
| Agenda: ícone por pessoa e "SMS para todos (N)", com a fila | `_TelaAgenda.vue` |
| Link do formulário público por SMS, sem número | `_CompartilharFormulario.vue`, `_LinksPublicos.vue` |
| Fase 2: o texto pronto da categoria passa a "Texto pronto do WhatsApp e do SMS"; a prévia avisa o telefone fixo | `_TelaCategoria.vue` |
| A simulação do app de mensagens e do Google Messages Web | `_AppExterno.vue`, `simulador.ts` |

- **Enquadramento:** o SMS entra no épico 1, ao lado do WhatsApp: é link, sem back-end. O envio
  pelo próprio ENSPACE, por um serviço de SMS, com registro no item, fica fora (P909 do épico 1).
- **Por que um painel, e não um link direto como o WhatsApp:** o `wa.me` funciona em qualquer
  computador com navegador. O `sms:` depende do aparelho: no celular e no Mac abre o app pronto; no
  Windows, só se houver app registrado, e o Vincular ao Celular nem sempre assume. O Teams
  corporativo não envia SMS no Brasil. O Google Messages Web não aceita número nem texto no link e só
  serve a quem tem Android. Então o botão abre um painel com os 4 caminhos, na ordem do que mais
  funciona, e a pessoa escolhe o dela.
- **O QR code é a resposta para o cliente Microsoft:** a câmera do celular lê o código e abre o app
  de SMS com o número e o texto, sem pareamento, sem Teams e sem app no Windows. O protótipo desenha
  um código de mentira (andaime); a biblioteca que gera o código fica com os devs (P908).
- **Copiar é o caminho do Vincular ao Celular:** "Copiar o número" no Para e "Copiar a mensagem" nos
  outros caminhos.
- **Telefone fixo não recebe SMS:** número do Brasil com DDD e 8 dígitos deixa o SMS indisponível,
  com o motivo; o WhatsApp continua, porque o fixo pode ter WhatsApp Business. CTR-00231
  (+55 11 3456-7710) mostra o estado; CTR-00230 (+55 11 99876-1203), o painel.
- **Contagem:** "62 caracteres · 1 SMS", com a ajuda do limite (160, ou 70 com acento). Informa e
  não bloqueia.
- **Texto pronto:** o mesmo do WhatsApp, em cada fase. Na Fase 2, 1 texto por categoria para os 2
  canais.
- **A fila do WhatsApp ficou genérica** (`canal="sms"`): "Avisar por SMS", "Abrir SMS" e os 2 botões
  de copiar por pessoa; o fixo fica de fora, com "Ficam de fora, sem celular válido".
- **Requisitos:** épico 1 (RN908, RN924 a RN929; partes 3 a 7, com o painel em RF251 a RF258),
  épico 2 (RN903, RN905, RN105; partes 1 e 2) e o documento do botão no cartão (RF009). Os prints
  estão em `evidencias/requisitos/`.

## Rodada 14 · 2026-11-26 (a central de comunicações e os nós de mensagem do Spaceflow)

- **Pedido (literal):** "sim, põe as 5 melhorias na central / mas voce nao deve prototipar só o "por enquanto", se dá pra cehgar num desenho final, deixe na proposta completa o lugar onde queremos chegar. / pode fazer até os nós do spaceflow em abas separadas do prototipo. pode colocar la o que for neessario e fazer a central ser a central de comunicaçoes em geral guardando sms, wpp e email conforme suas recomendaçoes".
- **A pesquisa** (repositório pesquisa-de-mercado, `runs/2026-11-26-twilio-sendgrid-na-central-de-comunicacao/RELATORIO.md`):
  - a Twilio do ENSPACE hoje só envia WhatsApp, só na Central de Atendimento, com a credencial de cada workspace;
  - a SendGrid leva todo e-mail do sistema, e o status "Enviado" quer dizer que ela aceitou, não que entregou;
  - o menu vira "Comunicações" quando um 2º canal sai do sistema com registro: os nós de SMS e WhatsApp do Spaceflow;
  - o back sai em 3 peças: C1, o status de entrega do e-mail pelo webhook da SendGrid; C2, o envio de SMS pela Twilio do workspace; C3, o envio de WhatsApp com modelo aprovado pela Meta.
- **Mudou no protótipo, em todas as fases (as 5 melhorias):**
  - coluna "Saiu por": o Outlook da pessoa, a caixa do workspace, o ENSPACE ou o domínio da empresa;
  - os 5 status do registro: Na fila, Em processamento, Enviado ao provedor, Falhou e Cancelado, cada um com a dica do que quer dizer;
  - "Motivo da falha" no painel de leitura, com a mensagem do envio, como "Quota de emails excedida";
  - a origem no "Enviado por": Tarefa, Spaceflow (com o fluxo e o nó) ou Atendimento;
  - "Reenviar" também no Cancelado, e indisponível no Na fila e no Em processamento, com o motivo.
- **Mudou no protótipo, na Fase 4 nova (o destino):**
  - o menu e a central passam a "Comunicações", e "Nova mensagem" oferece E-mail, SMS e WhatsApp (este, desabilitado, com o motivo);
  - a aba Mensagens ganha os filtros E-mail, WhatsApp, SMS e "Não entregues", e as colunas Canal e Entrega;
  - o painel de leitura mostra o SMS e o WhatsApp como balão de conversa, o modelo aprovado, o número de partes do SMS, o código do erro da operadora e o "Histórico do envio";
  - o WhatsApp do atendimento aparece com "Abrir a conversa no Atendimento", sem reenviar: a conversa continua sendo do chamado;
  - a aba Modelos alterna E-mail e WhatsApp; a de WhatsApp mostra o status da Meta (Aprovado, Em análise, Recusado);
  - a aba Configurações ganha "Canais de envio do workspace": e-mail, SMS e WhatsApp, cada um com o estado e o atalho para Integrações;
  - o painel "Enviar SMS" ganha "Enviar pelo ENSPACE", pelo número do workspace; o envio entra na central e passa de Na fila a Entregue; "Abrir no app" continua, como 2ª opção;
  - Estrutura › Spaceflow abre o fluxo "Lembrete de vencimento do contrato", com os nós novos "Enviar SMS" e "Enviar WhatsApp", no modal de configuração do develop (variáveis de entrada para arrastar, de saída, "Se o envio falhar" e "Esperar a confirmação de entrega");
  - o controle "Sem Twilio", na barra de baixo, mostra os nós com erro e a central sem SMS e WhatsApp.
- **Requisitos:** as 5 melhorias entram nas partes 8 a 10 do épico 1. A Fase 4 pede épico próprio (back C1, C2 e C3): a confirmar com a redatora antes de escrever.
- **Fronteira:** muda a central (as 4 abas), o painel "Enviar SMS" e a entrada Spaceflow do menu, na Fase 4. A moldura do editor do Spaceflow é cópia do protótipo `no-de-atraso`, que copiou o develop; os outros nós do fluxo ficam como no produto. As outras telas ficam como na rodada 13.

## Rodada 13 · 2026-11-26 (a tela inicial volta sem atalhos de comunicação)

- **Pedido (literal):** "pela logica de mercado, deveria mesmo ser widget de comunicaçao ou botoes fixos na home já, por padrao?" e, depois da pesquisa, "pode seguir a recomendaçao em todos esses lugares".
- **A pesquisa** (repositório pesquisa-de-mercado, `runs/2026-11-26-comunicacao-na-home/RELATORIO.md`): nenhum produto lido (CRMs, gestão de trabalho, helpdesks) põe botões de canal na Home. O compor sem destinatário mora num ponto global, igual em toda tela, e o envio por canal sai do contato do registro.
- **Mudou no protótipo:** os cartões E-mail e WhatsApp e SMS da rodada 12 saíram da tela inicial. Ela volta a ser a cópia do develop, como na rodada 5. O e-mail sem item continua no "Novo e-mail" da barra do topo, e o WhatsApp e o SMS, nos atalhos de cada registro.
- **Na Home nova** (protótipo `home`, rodada 12): o widget E-mail fica só com os enviados de um item, WhatsApp e SMS viram 2 widgets, e os 3 ficam opcionais no catálogo, fora da Home padrão.
- **Requisitos:** o fora do escopo do épico 1 cita os 3 widgets opcionais da Home nova e diz que a tela inicial de hoje continua sem atalhos de comunicação. A seção 5.6 e a pergunta 12 da `LOGICA-DA-FUNCIONALIDADE.md` mudam junto.
- **Fronteira:** muda só a tela inicial. As outras telas ficam como na rodada 12.

## Rodada 12 · 2026-11-26 (e-mail, WhatsApp e SMS na tela inicial)

- **Pedido (literal):** "uma das seçoes possiveis de widget lá deve ser de comunicação, e deve ter 2 widgets: email, whatsapp e sms / pra ficar na tela inicial esses botoes, nao só o enviar email / atualize o prototipo da home em si com essa ideia e atualize este tambem".
- **De onde vem:** a rodada 11 da Home nova (protótipo `home`) criou o grupo Comunicação no catálogo de widgets, com E-mail e WhatsApp e SMS. Os requisitos ficam lá, na parte 5 do épico "Widgets de itens, agenda, atalhos e comunicação na Home".
- **Mudou neste protótipo:**
  - a tela inicial ganha 2 cartões acima das tarefas (`_ComunicacaoNoInicio.vue`), com a marca de proposta;
  - E-mail: os e-mails que a pessoa enviou de um item e "Novo e-mail", que abre o compositor sem item;
  - WhatsApp e SMS: o Número, a Mensagem e os 2 botões, que abrem o WhatsApp e o painel "Enviar SMS" deste protótipo.
- **Revê a rodada 5,** que tirou a linha "Atalhos" da tela inicial ("vai pegar link do que ali? vai ter email vinculado a que?"): cada cartão tem o próprio destino. O link de formulário público continua fora, porque a tela inicial não sabe qual formulário.
- **Requisitos:** no épico 1, sai P904 (a pergunta sobre a tela inicial, respondida pela redatora), e o fora do escopo aponta os 2 widgets para o épico da Home nova. LOGICA-DA-FUNCIONALIDADE, seção 5.6 e pergunta 12.
- **Fronteira:** muda só a faixa dos 2 cartões na tela inicial. A saudação e os 3 cartões de tarefas continuam cópia do develop.

## Por que cada decisão

### O e-mail sai da conta do Outlook da pessoa; o item recebe a resposta

Como a gaveta "Nova Mensagem" da Mail Box funciona no develop (05/10/2026):

- o e-mail sai pela integração do Correio do Outlook, com Para, Cc, Cco, o endereço de resposta, o
  assunto, a mensagem, os anexos e a referência do item;
- o remetente é a conta do Outlook que a pessoa integrou em Perfil › Integrações;
- no item, a resposta vai para `<referência do item>.<workspace>@<domínio das caixas>`, e o e-mail
  fica ligado à referência do item;
- sem conta integrada, a gaveta mostra "Nenhuma conta integrada disponível" e "Integrar contas".

Daí o compositor global usa o mesmo envio:

- **com item vinculado:** o mesmo envio de hoje. A resposta volta para a Mail Box do item;
- **sem item:** o mesmo envio, sem o endereço de resposta e sem a referência do item. A resposta
  chega só no Outlook da pessoa. **Pergunta ao dev:** o envio sem item fica gravado para aparecer na
  área E-mails?

Isso fecha com o documento: "O vínculo com o item é uma informação interna do ENSPACE e não
interfere no conteúdo ou envio do e-mail". O remetente não muda; o vínculo muda só o "Responder
para" e onde o e-mail fica guardado.

### O "De" aparece

A "Nova Mensagem" de hoje não diz de onde o e-mail sai (o texto "De (Contas Integradas)" existe no
código e não aparece na tela). O protótipo mostra a conta da pessoa e, com item, o "Responder para".
HubSpot, Salesforce, Close e Pipefy mostram o From.

Na Fase 2, o "De" vira escolha: a conta do Outlook da pessoa ou uma caixa do workspace. Hoje as
caixas do workspace só recebem; enviar por elas é funcionalidade nova. A ajuda embaixo do "De" diz
para onde vão as respostas: a caixa escolhida, o item (quando há) ou o Outlook da pessoa.

### O botão E-mail tem 2 caminhos, num botão dividido

Com o Correio do Outlook integrado, o E-mail dos atalhos é um botão dividido
(`UFieldGroup` com `UDropdownMenu`, como o exemplo `FieldGroupDropdownExample` do Nuxt UI):

- **o clique no corpo escreve pelo ENSPACE:** sai da conta do Outlook da pessoa e fica na Mail Box
  do item;
- **a seta abre "Abrir no meu app de e-mail":** o `mailto:` que o documento pede.

O caminho do ENSPACE vem primeiro porque é o único em que a resposta sempre volta ao item. Sem o
Correio do Outlook integrado, o botão abre direto o app. É a regra do Twenty (com caixa, compositor interno; sem
caixa, `mailto:`), com a escolha à vista, porque no ENSPACE as 2 coisas existem juntas. Agendor
tem o mesmo desenho no WhatsApp; o Pipedrive troca o método por uma seta. Na coluna de ícones não
cabe o botão dividido: lá, os 2 caminhos vão num menu.

### A caixa do item vai em cópia no e-mail do app

Ideia do monday ("CC to pulse"). Quando a pessoa abre o e-mail no Outlook, o `mailto:` leva a
caixa do item em `cc`. A resposta do cliente volta para a aba Mail Box, e o ENSPACE não enviou
nada. Até a rodada 5, ligava e desligava em Sistema › Módulos ("Pôr a caixa do item em cópia").

HubSpot e Pipedrive usam Cco. Com Cco, a resposta só volta se alguém a encaminhar; com Cc, volta
quando o cliente responde a todos. O protótipo fica com o Cc e diz isso na opção do menu.

### "Não gerar conteúdo" e o texto inicial (até a rodada 5)

O documento diz que o ENSPACE "não deverá gerar conteúdo da mensagem" e, no mesmo parágrafo, pede
`mailto:...?subject=ASSUNTO&body=CORPO`. O protótipo resolve assim:

- o assunto e o texto inicial vêm de um modelo curto, por categoria, com variáveis (`{referencia}`,
  `{titulo}`, `{nome}`, `{categoria}`);
- quem envia muda tudo no app antes de mandar;
- o administrador desliga em Sistema › Módulos ("Preencher assunto e mensagem"), e aí o app abre só
  com o destinatário.

### Quem é o contato: por categoria

O item não tem um campo "telefone do contrato" fixo: cada categoria tem os seus, e o ENSPACE não
tem tipo de campo telefone (o telefone é um Texto com máscara, como o CNPJ). Por isso o cartão
novo no painel da categoria (ao lado de Correção Monetária) diz de quais campos vêm o nome, o
e-mail e o telefone de cada contato. As origens possíveis: campo E-mail, Texto com máscara, o
"E-mail do Requisitante" (`request_email`) e os subcampos de contato do Pessoa/Empresa
(`contact_name`, `contact_email`, `contact_phone`). A configuração fica em `ItemType.settings`. Uma categoria pode ter mais de 1 contato (Contratos tem
"Contato da contraparte" e "Requisitante"); o Contato rápido do item deixa escolher. A prévia ao
lado mostra o link que cada atalho abre com o item de exemplo.

### Canal sem dado: desabilitado, com o motivo (até a rodada 5)

Pedido do documento ("o respectivo botão deverá ficar indisponível"). O mercado esconde o botão
(Agendor, Ploomes, Twenty) ou oferece completar o dado (HubSpot "+ Add phone number", Apollo). O
protótipo junta as 2 coisas:

- **o motivo:** "Sem telefone cadastrado", "Sem e-mail cadastrado" ou "Telefone inválido" (menos
  de 10 dígitos), na dica e no nome acessível;
- **o próximo passo,** no Contato rápido: "Cadastrar telefone", "Corrigir telefone" ou "Cadastrar
  e-mail" abre a Visão Geral com o foco no campo;
- **`aria-disabled`, não `disabled`:** o botão continua no Tab, e o motivo chega a quem usa teclado.

Canal que o administrador desligou não aparece.

### Membro sem telefone (até a rodada 5)

O perfil não tem telefone. O schema tem `User.meta.phone`, e o protótipo supõe esse dado em metade
dos membros, para mostrar os 2 estados. Para o aviso ao responsável de uma tarefa por WhatsApp ou
SMS funcionar de verdade, o perfil precisa do campo. **É dependência fora desta demanda** (regra
19: não resolver na tela B o problema da tela A): fica registrada, não desenhada.

### Link público: nas telas de uso, sem tirar da configuração

- **Só formulário público de tipo Criação ou Geral.** O link público abre o formulário sem item, e
  a resposta cria um item na categoria do formulário. Editar e Visualizar dependem de um item que o
  link não leva.
- **Requisições:** o cartão do mockup 1, entre o seletor e o formulário, só com formulário público.
  Formulário privado ganha 1 linha dizendo por que não há link.
- **Lista de itens:** o mesmo menu, só com os formulários da categoria, ao lado de "Novo registro".
- **Tarefa de preencher formulário** (`type: form`, gerada por Spaceflow): o cartão no painel da
  tarefa, com a linha "a resposta pelo link cria um item novo e não conclui esta tarefa". A tarefa
  só fecha quando o responsável preenche e conclui.
- **O Copiar da configuração continua** (regra 20: destaque soma, não substitui). Muda só o aviso: 1 texto em todo lugar, "Link
  copiado", no lugar dos 2 de hoje.

### Tarefas: lista com aviso em lote, quadro com clique direito

- **Lista:** a coluna Contato (3 ícones) e, com tarefas selecionadas, "Avisar responsáveis por".
  E-mail abre 1 rascunho para todos. WhatsApp e SMS viram uma fila, porque `wa.me` aceita 1 número
  e o navegador bloqueia várias abas abertas de uma vez:
  - antes de começar, a janela diz quem fica de fora por falta de telefone;
  - "Conversa 1 de N", com barra de progresso, "Abrir conversa" e "Próxima";
  - no fim, "Todas as conversas abertas." É o modelo do "Call next lead" do Close e do discador
    em fila do Apollo.
- **Quadro:** o mockup 5 põe "Notify" em cada cartão. O `EnKanbanBoard` 0.17 não aceita ação extra
  no cartão (sem slot e sem prop). O protótipo usa o clique direito (o board emite
  `context-mouse`) e o painel da tarefa, que abre no clique do cartão. **Pedido ao SDK:** uma prop
  de ações extras no menu do cartão (ver `COMPONENTES-CUSTOM.md`).

### Agenda: lembrete por participante

A Agenda junta 3 fontes: datas de itens (campo de data da categoria), tarefas (Fluxo Padrão e
Tarefas Rápidas) e reuniões do Outlook. O modal "Evento" ganha um atalho por pessoa e "E-mail para
todos", e a pessoa muda conforme a fonte:

- **reunião do Outlook:** os participantes;
- **data de um item:** os contatos do item, tirados dos campos de e-mail do item (no épico "Contato
  da categoria", do cartão "Contato da categoria");
- **prazo de uma tarefa:** o responsável.

O texto do lembrete leva data, hora e, na reunião do Outlook, o local.

### A área "E-mails" no menu

O documento pede que o e-mail apareça "na área de E-mail do usuário". Essa área existe escondida
(a tela "Emails Recebidos"; achado S2-F1 da pesquisa de UX: telas nativas que só existem no editor
de menus). O protótipo a põe na seção Membro como a central "E-mails" (rodada 7), com a aba
Mensagens: filtros rápidos "Recebidos", "Enviados", "Do sistema", "Não lidos", "Com anexo" e "Sem
item", a coluna Item e o vínculo depois do envio (ideia do Pipedrive):

- **"Vincular" na própria linha** do e-mail sem item (o "Link item" do Pipedrive);
- **sugestão pelo remetente** na leitura: os itens em que quem escreveu é contato aparecem antes da
  busca livre.

Até a rodada 6, o nome repetia o "E-mails" de Configurações. Desde a rodada 7, é 1 lugar só: a
central reúne as telas de e-mail de hoje em abas, e os itens de Configurações › E-mails abrem a aba
deles.

### Os enviados pelo sistema: filtro em Mensagens, não aba

Quem quer saber se o cliente recebeu um e-mail procura num lugar só, tenha sido escrito por uma
pessoa ou enviado por um fluxo. Uma aba a mais repetiria a mesma tabela, com quase as mesmas
colunas. O filtro rápido "Do sistema" dá o mesmo recorte em 1 clique, e o atalho de Configurações
› E-mails › E-mails Enviados chega com ele ligado.

O risco é do back: hoje são 2 listas (os e-mails dos itens e os enviados pelo sistema). Se juntar
as 2 com ordem e paginação únicas pedir back novo, a saída da Fase 1 é o filtro trocar a fonte da
tabela, uma lista por vez. A pergunta está na lógica da funcionalidade.

### A central vira "Comunicações" só na Fase 4

Na Fase 1, a central só tem e-mail para mostrar: o WhatsApp e o SMS dos atalhos saem do aparelho
da pessoa, e o ENSPACE não fica sabendo do envio. Chamar de "Comunicações" uma central só com e-mail
promete o que a pessoa não acha ali. O nome muda quando o sistema passa a enviar SMS e WhatsApp com
registro (os nós do Spaceflow e o "Enviar pelo ENSPACE"). A tabela continua 1 só, com o filtro por
canal: quem procura "o cliente recebeu?" olha num lugar, qualquer que seja o canal.

### O status do envio e a entrega ficam em 2 colunas

O status diz o que o ENSPACE fez (pôs na fila, entregou ao provedor, falhou). A entrega diz o que
o provedor respondeu depois (entregue, devolvido, bloqueado, lido). Numa coluna só, "Enviado"
parece "Entregue", que é o engano de hoje: a SendGrid aceitou, e o e-mail pode ter voltado. O
e-mail da Mail Box sai pelo Outlook e não tem entrega; mostra "-".

### O WhatsApp do atendimento abre o chamado

A conversa do WhatsApp da Central de Atendimento tem requerente, atendente e fechamento por
inatividade. Ela aparece na central para a busca ficar num lugar, mas a ação é "Abrir a conversa no
Atendimento": responder ali criaria 2 portas para a mesma conversa.

### "Nova mensagem › WhatsApp" fica desabilitado

O WhatsApp pela Twilio só aceita texto livre dentro das 24 horas depois da última mensagem do
cliente. Fora disso, só com modelo aprovado pela Meta. Uma mensagem avulsa, sem item e sem modelo,
não sai. O caminho é o nó "Enviar WhatsApp" do Spaceflow, com o modelo, ou o atalho do item, que
abre o WhatsApp da pessoa. O motivo aparece no próprio menu.

### O SMS pelo ENSPACE não tira o "Abrir no app"

Enviar pelo número do workspace tem custo por SMS e pede a integração. Quem prefere o próprio
celular continua com "Abrir no app", "Copiar mensagem" e o QR code, agora abaixo de "Ou envie
pelo seu celular".

### Os nós de mensagem seguem o modal de hoje

Os nós "Enviar SMS" e "Enviar WhatsApp" usam o modal de configuração do develop: variáveis de
entrada à esquerda, de saída abaixo, "Modificado" no rodapé. Quem já monta o nó "Enviar e-mail"
não aprende tela nova. O nó de WhatsApp só lista os modelos aprovados; os outros aparecem
desabilitados, com o status da Meta.

### O estado vazio diz o próximo passo

A tabela do develop mostra, sem dado, só o ícone e "Nenhum resultado encontrado". Num workspace
novo isso não ajuda: a pessoa não sabe se falta configurar ou se ainda não chegou nada. O vazio da
central usa o `UEmpty` do Nuxt UI (título, texto e botões) e muda com o que falta:

- sem a conta do Outlook: integrar a conta; quem administra também cria modelo e caixa;
- com tudo pronto: escrever o primeiro e-mail;
- com filtro: o vazio de hoje, com "Limpar filtros".

### "Novo e-mail" na barra do topo

O documento pede o e-mail "da mesma forma que outras funcionalidades transversais da plataforma".
As transversais de hoje moram na barra do topo (Suporte, notificações). O botão tem rótulo, não só
ícone, para ser achado na primeira vez. Com rascunho guardado, ganha um ponto amarelo. A tecla **C**
escreve, fora de campo de texto (Gmail `c`, Outlook `N`), e a dica do botão mostra a tecla.

### O compositor não tranca a tela

- **Sem camada escura e sem travar a página** (`overlay` e `modal` desligados): a pessoa consulta o
  item com o e-mail aberto, como no Salesforce e no Gmail.
- **Expandir** alarga a gaveta para textos longos.
- **Minimizar, Esc e o X guardam o rascunho** numa barra do rodapé, que continua na troca de tela
  (`_RascunhoMinimizado.vue`). Descartar oferece "Desfazer".
- **Foco ao abrir:** no "Para"; vindo do item, com o destinatário pronto, no texto.
- **Ctrl+Enter envia**, também dentro do editor. A dica do Enviar mostra as teclas.
- **"Para"** sugere membros e os contatos dos itens que a pessoa vê.

### Busca de item

- **Rota nova.** A busca global (Ctrl K) não procura itens: navega por menus e ações (docs:
  Navegação). A busca de item entre categorias, filtrada por permissão, precisa ser construída.
- Só no workspace atual: o endereço do item e as permissões são do workspace.
- Busca, não lista: vazia, mostra os 5 atualizados por último; com texto, os 8 melhores e quantos
  ficaram de fora (regra 34: o controle se desenha para o volume real, e o workspace tem milhares de itens).
- Procura em referência, ID, nome, categoria, contatos e campos de texto (contraparte, CNPJ).
- Resultado agrupado por categoria, com ID, etapa e contraparte: itens de nome igual se distinguem.
- Item sem permissão não aparece, nem na contagem. A lista diz isso no rodapé.
- Antes da busca, **sugestões pelos destinatários:** até 3 itens em que alguém do "Para" é contato
  (HubSpot, Pipedrive e monday sugerem o registro pelo endereço).

## O que é do SDK

- **Usado:** `EnLayout` (a casca, pela primeira vez neste repositório), `EnTable` (lista de itens,
  lista de tarefas, E-mails, Formulários), `EnKanbanBoard` (quadro de itens e de tarefas) e os
  tipos do `enspace-sdk-schemas` (`Workspace`, `Member`, `ItemType`, `Field`, `Item`, `Task`).
- **Sem schema no SDK 0.17:** formulário, e-mail, caixa de e-mail e evento da Agenda. A forma veio
  das telas do develop e está marcada no `mocks.ts`.
- **Limites encontrados:**
  - `EnLayout` não repassa `ui` ao `USidebar`, que fixa 16rem. O develop usa ~200 px;
  - `EnKanbanBoard` não aceita ação extra no cartão.

## CSS e classes fora do token

Conferido com `grep "<style\|:deep(\|!important"`: nenhum `<style>`, `:deep()` ou `!important`.
Classes com valor arbitrário:

| Onde | Classe | Por quê |
|---|---|---|
| `_CascaDoEnspace.vue` | `[&>.peer]:[--sidebar-width:12.5rem]` | O `EnLayout` não repassa `ui` ao `USidebar`. Consulta: `Layout.vue.js` do SDK e `.nuxt/ui/sidebar.ts` |
| `_CascaDoEnspace.vue` | `w-[min(50rem,calc(100vw-30rem))]` | O slot `navbar-title` do `EnLayout` não estica (sem `flex-1`), e a trilha do develop ocupa o meio da barra |
| telas | `animate-[entrada_...]` | Usa o `@keyframes entrada` do `main.css` |
| `_TelaItem.vue`, `_TelaEmails.vue` | `[&_p]:my-1.5`, `[&_blockquote]:...` | Corpo do e-mail vem em HTML |
| `_TelaAgenda.vue` | `[&:nth-child(7n)]:border-r-0` | Grade do mês montada à mão: nem o Nuxt UI nem o SDK têm calendário de eventos (MCP: o `UCalendar` escolhe data) |
| `_CascaDoEnspace.vue` | `text-[9px]` | O selo "BR" da barra do topo do develop, em 24 px |
| `_BuscaDeItem.vue` | `text-[11px]` no `label` | O rótulo de grupo (nome da categoria) mais baixo que o resultado, como o develop |
| `_Compositor.vue` | `scale-[.98]` | Entrada do bloco "Vincular a item" ao trocar entre busca e item escolhido |
| `_TelaItem.vue` | `min-h-[calc(100dvh-4rem)]` | O item ocupa a altura da tela menos a barra do topo, como no develop |
| `_LinksPublicos.vue` | `w-[22rem]` | Largura do menu de links públicos: cabe o nome do formulário e os 2 botões |
| `_TelaEmails.vue`, `_TelaTarefas.vue` | `grid-cols-[5rem_1fr]`, `grid-cols-[8rem_1fr]` | Rótulo e valor em 2 colunas na leitura do e-mail e no painel da tarefa |
| `_TelaCategoria.vue` | `xl:grid-cols-[1fr_24rem]` | Configuração dos atalhos à esquerda, prévia dos links à direita |
| `_RascunhoMinimizado.vue` | `w-[min(26rem,calc(100vw-2rem))]` | A barra do rascunho cabe na tela estreita sem passar da borda |
| `_AppExterno.vue` | `max-h-[90dvh]` | A simulação cabe na altura da tela e rola por dentro |
| `_AcoesDeContato.vue` | `itemDescription: 'whitespace-normal'` | O tema do `DropdownMenu` corta a descrição em 1 linha; o aviso do Cc precisa ser lido inteiro |
| `_TelaEmails.vue` | `sm:max-w-[700px]` no painel | A largura do painel lateral de leitura do develop (tela de Logs de Auditoria) |
| `_TabelaDoEnspace.vue` | 117 px nas Ações | As larguras fixas da tabela do develop; a coluna de Ações tem 117 px lá |
| `_TabelaDoEnspace.vue` | `sticky left-0` com a largura medida no vazio | Com colunas largas, a tabela passa da tela; o vazio fica no meio da parte visível |

## Crítica e acessibilidade

Rodadas `design:design-critique` e `design:accessibility-review` sobre o código e as telas.

**Corrigido nesta rodada:**

- o motivo do atalho indisponível só estava no tooltip: agora há linha visível no Contato rápido;
- a linha do e-mail na Mail Box abre e fecha sem `aria-expanded`: acrescentado;
- o ponto de "não lido" não tinha papel para leitor de tela: `role="img"` com rótulo;
- "Vinculado porque você começou no item" continuava depois de trocar o item à mão: some na troca;
- os 3 botões do Contato rápido quebravam linha: dividem a largura do cartão.

**Corrigido na rodada 2:**

- o E-mail com 2 caminhos custava 1 clique a mais: virou botão dividido;
- o botão sem dado saía do Tab (`disabled`): virou `aria-disabled`, com o motivo no nome acessível;
- o compositor abria com o foco no Expandir, a dica dele abria e o 1º Esc só fechava a dica: o foco
  vai para o "Para" ou para o texto;
- o aviso do Cc saía cortado no menu: quebra linha;
- a barra do rascunho ficava atrás da barra de andaime quando ela quebra em 2 linhas: subiu;
- o tema escuro e o espanhol ficaram conferidos ([print](evidencias/prototipo-11-escuro-espanhol.jpg)).

**Fica sem correção, com o motivo:**

- **o clique direito do quadro não chega pelo teclado.** O caminho de teclado é abrir o cartão (o
  painel da tarefa tem os mesmos atalhos). Correção de verdade depende do SDK;
- **o mockup 6 (atalhos na tela inicial) ficou de fora** na rodada 5: ali não há destinatário, item
  nem formulário certo. Falta o Felipe concordar;
- **o "Novo e-mail" com rótulo pesa na barra do topo.** Ícone sozinho seria mais leve e mais
  difícil de achar;
- **o aviso com "Ver no item" some em 5 s.** O mesmo caminho existe na tela E-mails;
- **a tecla C abre o compositor em qualquer tela.** Quem não conhece o atalho pode abrir sem
  querer; Esc fecha sem perder nada.

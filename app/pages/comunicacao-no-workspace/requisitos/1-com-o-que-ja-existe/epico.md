# Épico: Escrever e-mail de qualquer tela e central E-mails no menu

**O que é:** a pessoa escreve o e-mail de cada tela de uso do ENSPACE: do item, da lista e do quadro de itens, das
tarefas, da Agenda e do "Novo e-mail" da barra do topo. Nos mesmos lugares, o atalho de WhatsApp abre a conversa com
o contato no WhatsApp Web ou no app, com o texto pronto, e o link do formulário público também sai pelo WhatsApp. Com
item na tela, o e-mail fica na Mail Box do item, que passa
a existir em todo item e no painel da tarefa. O link do formulário público aparece onde o formulário está em uso, e a
central "E-mails" no menu junta as telas de e-mail de hoje em 4 abas. É só tela: o envio pela conta do Outlook, o
endereço do item, o e-mail gravado com o item, a Mail Box, os campos de e-mail e de telefone, o link público, a tela
"Emails Recebidos" e as telas de Configurações › E-mails já existem no back de hoje. O WhatsApp abre por um link do
próprio WhatsApp, sem back-end.

**Onde vale:** a barra do topo; o item (painel esquerdo, Visão Geral e Mail Box); a lista e o quadro de itens da
categoria; Tarefas › Rápidas (lista, quadro e painel da tarefa); a Agenda (modal "Evento"); Requisições; Configurações
› Estrutura › Categorias › Formulários; a entrada "E-mails" na seção Membro do menu e os 3 itens de Configurações ›
E-mails.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/, aprovado em 24/11/2026. Na barra
de baixo, o controle "Fase" em "1 · MVP" mostra este épico; "Perfil" troca entre quem administra e o membro; "Dados"
mostra o workspace novo, o primeiro uso e o workspace em uso; "Cenário" mostra "Sem Outlook integrado" e "Envio
falha". A barra de baixo é ferramenta de revisão e não entra no produto. Os textos nos 3 idiomas estão no protótipo: o controle "Idioma" da barra de baixo troca entre PT, EN e ES.

**Fora do escopo:**
- o contato configurado por categoria, o cartão "Contato da categoria", o telefone do contato e o texto pronto do WhatsApp por categoria (épico "Escolher na categoria de onde vêm o nome e o e-mail do contato");
- a busca de item para vincular no compositor, o autocompletar do Para com contatos de outros itens, o e-mail sem item gravado no ENSPACE, "Vincular a um item" depois do envio, a lista da aba Mensagens por pessoa e permissão e a lista única dos e-mails do sistema e dos itens (épico "Gravar e-mail enviado sem item e filtrar Mensagens por permissão");
- a caixa do workspace no "De" e o bloco "Caixas como remetente" (épico "Enviar e-mail pelas Caixas de E-mail do workspace");
- a resposta na mesma conversa e "Encaminhar" (épico "Responder na mesma conversa e encaminhar e-mail");
- "Vincular a tarefa", a Mail Box própria da tarefa e a coluna Tarefa da aba Mensagens (épico "Vincular e-mail a uma tarefa");
- o botão de e-mail no cartão do quadro (documento "Botão de e-mail no cartão do quadro de itens e de tarefas"); aqui o quadro usa o clique direito;
- atalhos e link de formulário na tela inicial: a tela inicial continua como hoje;
- o envio pelo WhatsApp sem a pessoa apertar Enviar e o registro da conversa do WhatsApp no item;
- SMS e integração com Google.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Compositor e Novo e-mail na barra do topo](parte-1-compositor-e-novo-email.md) | A gaveta "Nova Mensagem" aberta de qualquer tela, com o "De" à vista, o item da tela de origem e o rascunho minimizado; o botão "Novo e-mail" e a tecla C | | Cada atalho das outras partes abre esta gaveta |
| [2. Mail Box em todo item e na tarefa](parte-2-mail-box-do-item-e-da-tarefa.md) | A aba Mail Box em todo item e no painel da tarefa, com "Novo e-mail" e "Responder" | 1 | O e-mail que as partes 3 a 7 vinculam ao item aparece aqui |
| [3. Atalho de e-mail e WhatsApp no item](parte-3-atalho-no-item.md) | O cartão "Contato do item", com E-mail e WhatsApp, e o ícone ao lado de cada campo de e-mail e de telefone | 1, 2 | É o atalho principal; as partes 4 a 7 repetem o mesmo botão em outras telas |
| [4. Atalho na lista e no quadro de itens](parte-4-atalho-na-lista-e-no-quadro.md) | Os submenus "E-mail" e "WhatsApp" no menu da linha e no clique direito do cartão, e a coluna Contato | 1 | Usa os contatos do item e os 2 caminhos do atalho |
| [5. Atalho nas tarefas](parte-5-atalho-nas-tarefas.md) | O e-mail e o WhatsApp ao responsável na lista, no lote, no quadro e no painel da tarefa | 1, 2 | O painel da tarefa ganha a aba Mail Box na parte 2 |
| [6. Lembrete na Agenda](parte-6-lembrete-na-agenda.md) | "Enviar lembrete" no modal "Evento", por e-mail e por WhatsApp, por pessoa e para todos | 1 | Usa os contatos do item e os 2 caminhos do atalho |
| [7. Link de formulário público](parte-7-link-de-formulario-publico.md) | Copiar e enviar o link público, por e-mail e por WhatsApp, em Requisições, na lista de itens, na tarefa de formulário e nos Formulários da categoria | 1 | "Enviar o link por" usa os atalhos de e-mail e de WhatsApp |
| [8. Central E-mails](parte-8-central-emails.md) | A entrada no menu, as 4 abas pela permissão de hoje, Modelos e Caixas de E-mail na tabela nova, a aba Configurações e os itens de Configurações › E-mails | 1 | "Novo e-mail" e "Usar em um e-mail" abrem o compositor |
| [9. Aba Mensagens](parte-9-aba-mensagens.md) | A tabela dos e-mails dos itens, com barra, filtros, menu da linha, leitura no painel lateral e o estado inicial | 8 | A aba mora na central |
| [10. E-mails do sistema na aba Mensagens](parte-10-emails-do-sistema.md) | O filtro "Do sistema", a coluna Status e "Reenviar e-mail", para quem tem a permissão de hoje | 9 | Soma linhas, filtro e coluna à tabela da parte 9 |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | O e-mail do workspace não tem chave de módulo: os atalhos de e-mail, o "Novo e-mail" e a central "E-mails" existem em cada workspace desde a criação. | Configurações › Sistema › Módulos continua com 3 chaves: Correção Monetária, Comparações e Jurídico. | Obrigatório |
| RN902 | O e-mail escrito pelo ENSPACE sai da conta do Outlook que a pessoa integrou ao próprio perfil, pelo Correio do Outlook. | Ana integrou ana.ribeiro@example.com em Perfil › Integrações; o e-mail que ela escreve no item CTR-00231 sai desse endereço. | Obrigatório |
| RN903 | Cada pessoa integra a própria conta do Outlook. Quem administra o workspace não integra a conta de outra pessoa. | Bruno, sem a integração, continua sem ela depois que a administradora integrou a conta dela. | Obrigatório |
| RN904 | Um e-mail com item vinculado tem como endereço de resposta o endereço do item e fica na Mail Box do item. O endereço do item é `<referência do item em minúsculas>.<referência do workspace>@<domínio das caixas>`. | O e-mail enviado de CTR-00231 aparece em Mail Box › Enviados, e a resposta do cliente chega em Mail Box › Recebidos. | Obrigatório |
| RN905 | Um e-mail sem item vinculado sai pela conta do Outlook da pessoa e fica só no Outlook dela: o ENSPACE não guarda esse e-mail. | O e-mail escrito pelo "Novo e-mail" na Agenda, sem item, não aparece na aba Mensagens. | Obrigatório |
| RN906 | O item vinculado vem só da tela de origem: o item, a tarefa com item, a Mail Box do item, um atalho com item ou o "Novo e-mail" com um item ou uma tarefa com item aberta. O vínculo grava a referência do item. | O e-mail aberto pelo atalho da tarefa T-1042, ligada a CTR-00231, sai vinculado a CTR-00231. | Obrigatório |
| RN907 | Os contatos de um item são, na ordem dos campos da categoria: cada campo do tipo E-mail preenchido e cada campo Texto com máscara com a máscara CEL preenchido, com o nome do campo como rótulo e sem nome de pessoa; cada campo Pessoa/Empresa com E-mail de contato ou Telefone de contato, com o Nome de contato como nome e os 2 dados no mesmo contato; e, por último, o e-mail de quem abriu a requisição, com o rótulo "Requisitante". Campo vazio não vira contato. | CTR-00230 tem "E-mail do contato" e "Telefone do contato" preenchidos, "E-mail do financeiro" vazio e o E-mail do Requisitante: os contatos são "E-mail do contato", "Telefone do contato" e "Requisitante". | Obrigatório |
| RN908 | O 1º contato do item para o e-mail é o 1º contato da lista com e-mail; para o WhatsApp, o 1º contato com telefone. | Em CTR-00231, o 1º contato do e-mail é "E-mail do contato", e o do WhatsApp, "Telefone do contato". | Obrigatório |
| RN909 | Cada atalho de e-mail tem 2 caminhos: "Escrever pelo ENSPACE", que abre o compositor com o item vinculado e o contato em Para, e "Abrir no meu app de e-mail", que abre o app de e-mail padrão do computador. Escrever pelo ENSPACE é o caminho principal; o app fica atrás da seta "Outras formas de enviar e-mail" ou, onde só cabe ícone ou menu, como 2º item do menu. | No item, o clique no corpo do botão E-mail abre o compositor; a seta abre o app. | Obrigatório |
| RN910 | Sem a conta do Outlook integrada, o atalho de e-mail abre direto o app de e-mail do computador. | Bruno, sem a integração, clica em E-mail no item e o app abre, sem o compositor. | Obrigatório |
| RN911 | O e-mail aberto no app segue o link `mailto:<para>?cc=<endereço do item>&subject=<assunto>`: o contato em Para, o endereço do item em Cc e o assunto padrão. Sem item, o link não leva Cc. O Cc é o que traz a cópia para a Mail Box do item e a resposta de quem usa "Responder a todos". | `mailto:marina.alves@example.com?cc=ctr-00231.aurora@<domínio das caixas>&subject=<assunto padrão codificado para URL>`. | Obrigatório |
| RN912 | O e-mail de um atalho de item abre com o assunto padrão, igual em cada categoria e sem configuração (S901). A pessoa muda o assunto e o texto antes de enviar. | O atalho de CTR-00231 abre com "CTR-00231 · Contrato de manutenção predial". | Obrigatório |
| RN913 | Um destinatário sem e-mail deixa o atalho indisponível, com o motivo: "Sem e-mail cadastrado" para o contato sem e-mail e "Sem contato" para a falta de contato. O atalho indisponível continua no Tab do teclado, com o motivo na dica e no nome acessível. | A tarefa sem responsável mostra o botão cinza; o leitor de tela lê "Sem contato". | Obrigatório |
| RN914 | Responder um e-mail abre um e-mail novo, com "Re:" no assunto, o texto original citado, o item vinculado do e-mail original e o aviso "A resposta sai como uma mensagem nova, com o texto original citado. Ela não entra na mesma conversa.". | Responder "Minuta revisada" de CTR-00231 abre "Re: Minuta revisada", vinculado a CTR-00231. | Obrigatório |
| RN915 | O e-mail que tarefas e fluxos enviam não entra na Mail Box do item. | O e-mail do fluxo de renovação de CTR-00231 não aparece em Mail Box › Enviados. | Obrigatório |
| RN917 | Cada atalho de WhatsApp abre numa aba nova o link do WhatsApp `https://wa.me/<número>?text=<texto codificado para URL>`. O WhatsApp Web ou o app do WhatsApp abre a conversa com o número e o texto no campo de mensagem; a pessoa revisa e aperta Enviar. Sem número, o link é `https://wa.me/?text=<texto>`, e a pessoa escolhe a conversa ou o grupo. O ENSPACE não envia a mensagem, não grava a conversa e não fica sabendo do envio. | O WhatsApp de CTR-00231 abre `https://wa.me/551134567710?text=Ol%C3%A1.%20Escrevo%20sobre%20CTR-00231...`. | Obrigatório |
| RN918 | O telefone vem de 2 lugares, sem configuração: o campo do tipo Texto com máscara com a máscara "CEL: (###) #####-####" e o Telefone de contato do campo Pessoa/Empresa. O ENSPACE não tem campo do tipo telefone. | Em Contratos, "Telefone do contato" é Texto com máscara CEL; em Fornecedores, o Pessoa/Empresa tem o Telefone de contato. | Obrigatório |
| RN919 | O número do link é o telefone só com os dígitos e sem zero no começo. Com 10 ou 11 dígitos, ganha o código do Brasil, 55, na frente; com 12 ou mais, fica como está, já com o código do país. Com menos de 10 dígitos, o telefone é inválido. | "(11) 98765-4321" vira 5511987654321; "+55 11 3456-7710" vira 551134567710; "9210-8834" é inválido. | Obrigatório |
| RN920 | O WhatsApp do item abre com o texto pronto "Olá, <primeiro nome>. Escrevo sobre <referência> · <nome do item>.", igual em cada categoria e sem configuração (S903). Sem nome, o texto começa por "Olá.". Na tarefa e na Agenda, o texto é o do e-mail daquela tela. A pessoa muda o texto antes de enviar. | O WhatsApp de CTR-00231 abre "Olá. Escrevo sobre CTR-00231 · Contrato de manutenção predial.". | Obrigatório |
| RN921 | Um destinatário sem telefone válido deixa o atalho de WhatsApp indisponível, com o motivo: "Sem telefone cadastrado", "Telefone inválido" (menos de 10 dígitos) ou "Sem contato". O atalho indisponível segue RN913: fica no Tab, com o motivo na dica e no nome acessível. | O responsável sem telefone mostra o ícone do WhatsApp cinza, com "Sem telefone cadastrado". | Obrigatório |
| RN922 | O WhatsApp para várias pessoas abre 1 conversa por vez, numa fila: o link do WhatsApp leva 1 número, e o navegador bloqueia várias abas abertas de uma vez. A fila diz quem fica de fora por falta de telefone válido. | "WhatsApp para 3 responsáveis" abre "Conversa 1 de 3"; "Próxima" passa para a 2ª. | Obrigatório |
| RN923 | O WhatsApp não depende da conta do Outlook nem de chave de módulo: o atalho existe em cada workspace, para cada pessoa. | Bruno, sem a integração do Outlook, abre o WhatsApp do item. | Obrigatório |
| RN916 | A tabela a seguir define quem vê cada aba da central "E-mails" e os e-mails do sistema, pelas permissões de leitura de hoje. Política: Única. | Linha 5: o membro sem a permissão de ver os e-mails enviados não vê os e-mails do sistema na aba Mensagens. | Obrigatório |

| Linha | O que | Quem vê |
|---|---|---|
| 1 | Aba Mensagens, com os e-mails dos itens | Todo membro (P901) |
| 2 | Aba Modelos | Quem tem a permissão de hoje de ver os modelos de e-mail |
| 3 | Aba Caixas de E-mail | Quem tem a permissão de hoje de ver as caixas de e-mail |
| 4 | Aba Configurações | Todo membro; a seção "Regras do workspace", só quem administra o workspace (S902) |
| 5 | Os e-mails do sistema na aba Mensagens, o filtro "Do sistema", a opção "Sistema" no filtro de "Enviado por" e a coluna Status | Quem tem a permissão de hoje de ver os e-mails enviados |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone e caixa de marcar com nome acessível, modal com título e descrição, foco visível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |
| Ícones | O protótipo usa o conjunto lucide; o produto usa o ícone equivalente do conjunto solar. |
| Referência do item | O protótipo mostra a referência curta (CTR-00231). No produto, a referência e o endereço do item usam o código de 32 caracteres. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Endereço do item | O endereço de e-mail que cada item já tem; recebe as respostas e as cópias | "Copiar o endereço da caixa", na Mail Box |
| Compositor | A gaveta em que se escreve o e-mail, a mesma "Nova Mensagem" da Mail Box de hoje | "Nova Mensagem" |
| Atalho de e-mail | O botão ou o item de menu que abre o e-mail para um destinatário da tela | "E-mail", "Enviar e-mail para <nome>" |
| Contato do item | O destinatário tirado dos campos de e-mail do item e do E-mail do Requisitante | "Contato do item", "Para quem" |
| E-mail do sistema | O e-mail que tarefas e fluxos enviam, listado hoje na tela E-mails Enviados | "Do sistema", "Sistema" |
| Central E-mails | A tela da seção Membro do menu com as abas Mensagens, Modelos, Caixas de E-mail e Configurações | "E-mails" |
| Atalho de WhatsApp | O botão, o ícone ou o item de menu que abre a conversa no WhatsApp com o texto pronto | "WhatsApp", "WhatsApp para <nome>" |
| Campo de telefone | O campo Texto com máscara com a máscara CEL e o Telefone de contato do Pessoa/Empresa | O nome do campo |
| Fila do WhatsApp | O modal que abre 1 conversa por vez quando o WhatsApp vai para várias pessoas | "Avisar pelo WhatsApp", "Conversa 1 de N" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S901 | O assunto padrão do atalho de item é "<referência> · <nome do item>", como no protótipo. O assunto fixo, sem configuração, ainda não tem texto definido. | produto | Muda o assunto com que o compositor e o app abrem nas partes 3 e 4 |
| S902 | "Quem administra", para a seção "Regras do workspace" e para os botões "Criar modelo" e "Criar caixa de e-mail" do estado inicial, é quem tem ao menos 1 das permissões de hoje de ver os modelos, as caixas ou os e-mails enviados. | produto e dev | Com outra regra (cargo de administrador, por exemplo), muda quem vê a seção nas partes 8 e 9 |
| P901 | Quem vê a tela "Emails Recebidos" hoje: todo membro, ou só quem vê o item do e-mail? Ela mostra também os enviados com item? | dev | Muda o que a aba Mensagens mostra a cada membro nas partes 8 e 9 |
| P902 | A documentação do Correio do Outlook diz que a integração exibe a caixa de entrada dentro do ENSPACE e vincula e-mails a tarefas e registros. O develop não tem essa tela. Existe em outro lugar ou é plano? | produto e dev | Se existe, a central "E-mails" precisa conviver com ela ou substituí-la |
| P903 | O cliente que usa Google, e não Microsoft, fica só com "Abrir no meu app de e-mail". Está aceito para este épico? | produto | Sem aceite, a integração com Google entra no roteiro |
| P904 | A tela inicial fica sem os atalhos de e-mail e de WhatsApp e sem o link de formulário público, como no protótipo? | produto | Se não, a tela inicial entra num épico próprio, com a escolha do formulário e do item |
| S903 | O texto pronto do WhatsApp é "Olá, <primeiro nome>. Escrevo sobre <referência> · <nome do item>.", como no protótipo. | produto | Muda o texto com que o WhatsApp abre nas partes 3 e 4 |
| S904 | Sem configuração, o e-mail e o telefone de um mesmo contato aparecem como 2 contatos ("E-mail do contato" e "Telefone do contato"), porque vêm de 2 campos. Só o Pessoa/Empresa junta os 2. Juntar campos soltos é a configuração do épico "Escolher na categoria de onde vêm o nome e o e-mail do contato". | produto | Para juntar já neste épico, falta a regra de qual telefone vai com qual e-mail |
| P905 | De onde vem o telefone do membro, para o WhatsApp ao responsável da tarefa e ao participante da Agenda? O cadastro do usuário tem o campo de telefone, mas nenhuma tela do develop deixa a pessoa preenchê-lo. | produto e dev | Sem tela para o telefone, o WhatsApp das partes 5 e 6 fica indisponível até o perfil ganhar o campo |
| P906 | A máscara do Texto com máscara pode ser escrita à mão. O campo de telefone com outra máscara, como "(##) ####-####", fica de fora? | produto e dev | Se entra, RN918 passa a aceitar uma lista de máscaras de telefone |

# 2. O contato da categoria nos atalhos

**Objetivo:** com o cartão "Contato da categoria" salvo, os atalhos de e-mail, de WhatsApp e de SMS do item, da lista, do
quadro, do compositor e da Agenda usam os contatos, o assunto e o texto pronto da categoria. O item sem contato leva
quem usa ao campo que falta ou ao cartão da categoria.

**Depende de:** 1. Cartão "Contato da categoria"; o épico "Escrever e-mail de qualquer tela e central Comunicações no menu" (o cartão "Contato do
item", o submenu "E-mail", a coluna "Contato", o compositor, o lembrete da Agenda e o bloco "Contato do item" da
aba Canais e regras de Configurações › Comunicações).

**Onde vale:** a tela do item (cartão "Contato do item" e Visão Geral); a lista e o quadro de itens; o compositor; o
modal "Evento" da Agenda; a aba Canais e regras de Configurações › Comunicações.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Fase "2 · Remetente"; "Ir para" ›
"Item CTR-00231" e "Ir para" › "Lista de itens (Contratos)".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Os contatos de um item são os contatos da categoria com nome, e-mail ou telefone preenchido no item, na ordem da página "Contato da categoria". O e-mail e o telefone do mesmo contato ficam juntos. | CTR-00231: "Contato da contraparte" (Marina Alves) e "Requisitante" (carla.nogueira@example.com). CTR-00224, sem contato e sem requisitante, fica sem contato. | Obrigatório |
| RN102 | O assunto do e-mail aberto por um atalho do item é o assunto da categoria, com as variáveis trocadas pelos valores do item e do contato escolhido (RN903). | Contratos com "{referencia} · {titulo}": CTR-00231 abre com "CTR-00231 · Contrato de manutenção predial". | Obrigatório |
| RN103 | O assunto da categoria é sugestão: quem envia pode mudar o assunto antes de enviar. | No compositor, o assunto preenchido aceita edição. | Obrigatório |
| RN104 | O WhatsApp aberto por um atalho do item vai para o telefone do contato escolhido e abre com o texto pronto da categoria, com as variáveis trocadas (RN903, RN905). Quem envia pode mudar o texto antes de enviar. | Contratos: o WhatsApp de CTR-00231 para Marina Alves abre com "Olá, Marina. Escrevo sobre CTR-00231 · Contrato de manutenção predial.". | Obrigatório |
| RN105 | O SMS aberto por um atalho do item vai para o celular do contato escolhido e abre o painel "Enviar SMS" com o mesmo texto pronto do WhatsApp (RN104, RN905). O telefone fixo deixa o SMS indisponível, com "Telefone fixo não recebe SMS". | Contratos: o SMS de CTR-00230 para Rafael Monteiro abre o painel com "Olá, Rafael. Escrevo sobre CTR-00230 · Contrato de licença de software de gestão."; o de CTR-00231, com o fixo de Marina Alves, fica indisponível. | Obrigatório |

## Contato do item (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O cartão "Contato do item" deve listar os contatos do item (RN101), com o "Nome do contato na tela" como rótulo de cada um. | CTR-00231: "Para quem" oferece Marina Alves (Contato da contraparte) e carla.nogueira@example.com (Requisitante). | Essencial | Obrigatório |
| RF102 | Para o contato com nome e sem e-mail, o cartão deve mostrar "Este contato não tem e-mail cadastrado." | CTR-00229: Juliana Freitas, com o aviso e o botão E-mail indisponível com "Sem e-mail cadastrado". | Essencial | Obrigatório |
| RF103 | Para quem tem a permissão de editar o campo de origem do e-mail, o aviso deve trazer o botão "Cadastrar e-mail". | CTR-00229, com a permissão de editar "E-mail do contato": o botão aparece ao lado do aviso. | Importante | Obrigatório |
| RF104 | "Cadastrar e-mail" deve abrir a Visão Geral do item com o cursor no campo de origem do e-mail do contato. | CTR-00229: o cursor vai para "E-mail do contato"; preencher e salvar libera o botão E-mail. | Importante | Obrigatório |
| RF105 | Sem a permissão de editar o campo de origem do e-mail, o cartão deve mostrar só o aviso. | CTR-00229, com cargo sem edição do campo: aviso sem "Cadastrar e-mail". | Importante | Obrigatório |
| RF106 | Para o contato com origem do e-mail no E-mail do Requisitante (RN902), o cartão deve mostrar só o aviso, sem "Cadastrar e-mail". | Item sem requisitante, com o contato "Requisitante" com nome: aviso sem botão. | Importante | Obrigatório |
| RF107 | O item sem contato (RN101) deve mostrar "Nenhum contato neste item", "Os campos de contato deste item estão vazios." e o botão "Escolher os campos de contato". | CTR-00224 mostra os 2 textos e o botão. | Importante | Obrigatório |
| RF108 | "Escolher os campos de contato" deve abrir a página "Contato da categoria" da categoria do item. | Em CTR-00224, o botão abre a página de Contratos. | Importante | Obrigatório |

## WhatsApp e SMS no Contato do item (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF120 | O contato escolhido deve mostrar o telefone embaixo do e-mail, e o botão WhatsApp deve abrir a conversa com esse telefone e o texto pronto da categoria (RN104). | CTR-00231: Marina Alves, marina.alves@example.com e +55 11 3456-7710; o WhatsApp abre com "Olá, Marina...". | Essencial | Obrigatório |
| RF121 | Para o contato sem telefone, o cartão deve mostrar "Sem telefone: o WhatsApp e o SMS estão indisponíveis." e, para quem tem a permissão de editar o campo de origem do telefone, o botão "Cadastrar telefone", que abre a Visão Geral com o cursor nesse campo. | CTR-00228: Otávio Rezende, com o aviso e "Cadastrar telefone", que leva a "Telefone do contato". | Importante | Obrigatório |
| RF122 | Para o contato com telefone inválido, o cartão deve mostrar "Telefone inválido: o WhatsApp e o SMS estão indisponíveis." e "Corrigir telefone", com a mesma condição e o mesmo destino de RF121. | CTR-00226: Sérgio Batista, 9210-8834, com o aviso e "Corrigir telefone". | Importante | Obrigatório |
| RF123 | Na Visão Geral, o campo escolhido como origem do telefone deve ter os ícones do WhatsApp e do SMS, como o campo de telefone do épico "Escrever e-mail de qualquer tela e central Comunicações no menu", com o texto pronto da categoria. | Em FOR-00040, "WhatsApp comercial" e "Pessoa/Empresa › Telefone de contato" abrem com o texto de Fornecedores. | Importante | Obrigatório |
| RF126 | O botão SMS, ao lado do WhatsApp, deve abrir o painel "Enviar SMS" com o telefone do contato escolhido e o texto pronto da categoria; com telefone fixo, fica indisponível com o motivo (RN105). | CTR-00230: o painel abre com "Enviar SMS para Rafael Monteiro" e o texto da categoria; CTR-00231 deixa o SMS cinza com "Telefone fixo não recebe SMS". | Essencial | Obrigatório |

## Assunto do atalho (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF109 | Cada atalho de e-mail do item, da lista e do quadro deve abrir o e-mail com o assunto da categoria (RN102, RN103), em "Escrever pelo ENSPACE" e em "Abrir no meu app de e-mail". | CTR-00231: o botão E-mail abre o compositor com "CTR-00231 · Contrato de manutenção predial"; a seta abre o app com o mesmo assunto no `mailto:`. | Essencial | Obrigatório |

## Lista e quadro de itens (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF110 | O submenu "E-mail" do menu da linha deve ter 1 grupo por contato do item (RN101), com o título "<Nome do contato na tela> · <nome>", ou só o rótulo quando o contato não tem nome. | CTR-00231: "Contato da contraparte · Marina Alves" e "Requisitante". | Essencial | Obrigatório |
| RF111 | O clique direito no cartão do quadro deve trazer os submenus "E-mail", "WhatsApp" e "SMS" do menu da linha, com os grupos de RF110 e as linhas de RF124 e RF127. | No quadro de Contratos, o clique direito em CTR-00231 mostra os 2 grupos do e-mail e as linhas do WhatsApp e do SMS. | Importante | Obrigatório |
| RF124 | O submenu "WhatsApp" do menu da linha deve ter 1 linha por contato do item com telefone, com o título "<Nome do contato na tela> · <nome>" e o telefone embaixo (RN104). | CTR-00231: "Contato da contraparte · Marina Alves" e "+55 11 3456-7710". | Essencial | Obrigatório |
| RF127 | O submenu "SMS" do menu da linha deve ter as mesmas linhas de RF124; a linha do telefone fixo fica indisponível, com "Telefone fixo não recebe SMS" (RN105). | CTR-00230: "Contato da contraparte · Rafael Monteiro" e "+55 11 99876-1203". | Essencial | Obrigatório |
| RF112 | O cabeçalho da coluna "Contato" deve levar o "Nome do contato na tela" do 1º contato da categoria. | Contratos: a coluna se chama "Contato da contraparte"; Solicitações, "Quem pediu". | Importante | Obrigatório |
| RF113 | A célula da coluna deve mostrar o nome e o e-mail que o item tem no 1º contato da categoria. | CTR-00231: Marina Alves marina.alves@example.com; CTR-00224, sem e-mail no contato: "Sem contato". | Importante | Obrigatório |

## Compositor (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF114 | Com um item vinculado, o Para do compositor deve sugerir os contatos do item com e-mail (RN101), com o "Nome do contato na tela" e o e-mail. | CTR-00231: o Para sugere Marina Alves (Contato da contraparte · marina.alves@example.com). | Importante | Obrigatório |
| RF115 | O "Novo e-mail" da barra do topo e da Mail Box, com um item aberto, deve pôr em Para o 1º contato do item com e-mail. | Em CTR-00231, o Para abre com Marina Alves, de marina.alves@example.com. | Importante | Obrigatório |

## Agenda (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF116 | No modal "Evento" de uma data de item, "Contatos do item" deve listar os contatos do item (RN101), cada um com o botão "Enviar e-mail para <nome>". | Evento "Assinatura: Contrato de manutenção predial", de CTR-00231: Marina Alves e carla.nogueira@example.com. | Importante | Obrigatório |
| RF117 | "E-mail para todos (<N>)" deve contar e pôr em Para só os contatos do item com e-mail. | Evento de CTR-00231: "E-mail para todos (2)" abre 1 e-mail com marina.alves@example.com e carla.nogueira@example.com em Para. | Importante | Obrigatório |
| RF125 | Cada contato da lista deve ter o ícone do WhatsApp com o telefone do contato da categoria, e "WhatsApp para todos (<N>)" deve contar só os contatos com telefone válido. | Evento de CTR-00231: Marina Alves com o ícone e "WhatsApp para todos (1)". | Importante | Obrigatório |
| RF128 | Cada contato da lista deve ter o ícone do SMS com o telefone do contato da categoria, e "SMS para todos (<N>)" deve contar só os contatos com celular (RN105). | Evento de CTR-00231: Marina Alves, com telefone fixo, tem o ícone do SMS cinza, e o botão diz "SMS para todos (0)". | Importante | Obrigatório |

## Configurações › Comunicações (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF118 | Para quem administra, o bloco "Contato do item" da aba Canais e regras deve mostrar "Defina na própria categoria os campos de nome, e-mail e telefone do contato." e o link "Escolher o contato de cada categoria". | Perfil de quem administra, aba Canais e regras: o texto e o link aparecem no lugar do texto sobre os campos de e-mail. | Importante | Obrigatório |
| RF119 | "Escolher o contato de cada categoria" deve levar ao cartão "Contato da categoria". | No protótipo, o link abre a página de Contratos. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Quem vê "Escolher os campos de contato": cada membro, ou só quem acessa a configuração da categoria? O protótipo mostra a quem usa. | produto | Sem acesso à configuração, o item mostra só os 2 textos |
| P102 | "Escolher o contato de cada categoria" abre a lista de categorias (Estrutura › Categorias) ou a página de uma categoria? O protótipo abre Contratos. | produto | O destino do link |
| P103 | O campo de origem do e-mail fora do formulário da Visão Geral: "Cadastrar e-mail" some, ou abre o formulário Editar da categoria? | produto e dev do front | O botão de RF103 ganha a condição do formulário |
| P104 | O contato sem nome e sem e-mail no item fica fora do submenu "E-mail", como no cartão "Contato do item"? O protótipo mostra o grupo indisponível no submenu. | produto | O submenu lista cada contato da categoria, com o motivo |
| P105 | No evento de 0 contatos com e-mail, "E-mail para todos (<N>)" some ou fica indisponível? | produto | O critério de RF117 |

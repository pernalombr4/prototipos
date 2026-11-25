# 2. O contato da categoria nos atalhos

**Objetivo:** com o cartão "Contato da categoria" salvo, os atalhos de e-mail do item, da lista, do quadro, do
compositor e da Agenda usam os contatos e o assunto da categoria. O item sem contato leva quem usa ao campo que falta
ou ao cartão da categoria.

**Depende de:** 1. Cartão "Contato da categoria"; o épico "Escrever e-mail de qualquer tela e central E-mails no menu" (o cartão "Contato do
item", o submenu "E-mail", a coluna "Contato", o compositor, o lembrete da Agenda e o bloco "Contato do item" da
central E-mails).

**Onde vale:** a tela do item (cartão "Contato do item" e Visão Geral); a lista e o quadro de itens; o compositor; o
modal "Evento" da Agenda; a central E-mails, aba Configurações.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Fase "2 · Remetente"; "Ir para" ›
"Item CTR-00231" e "Ir para" › "Lista de itens (Contratos)".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Os contatos de um item são os contatos da categoria com nome ou e-mail preenchido no item, na ordem da página "Contato da categoria". | CTR-00231: "Contato da contraparte" (Marina Alves) e "Requisitante" (carla.nogueira@example.com). CTR-00224, sem contato e sem requisitante, fica sem contato. | Obrigatório |
| RN102 | O assunto do e-mail aberto por um atalho do item é o assunto da categoria, com as variáveis trocadas pelos valores do item e do contato escolhido (RN903). | Contratos com "{referencia} · {titulo}": CTR-00231 abre com "CTR-00231 · Contrato de manutenção predial". | Obrigatório |
| RN103 | O assunto da categoria é sugestão: quem envia pode mudar o assunto antes de enviar. | No compositor, o assunto preenchido aceita edição. | Obrigatório |

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

## Assunto do atalho (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF109 | Cada atalho de e-mail do item, da lista e do quadro deve abrir o e-mail com o assunto da categoria (RN102, RN103), em "Escrever pelo ENSPACE" e em "Abrir no meu app de e-mail". | CTR-00231: o botão E-mail abre o compositor com "CTR-00231 · Contrato de manutenção predial"; a seta abre o app com o mesmo assunto no `mailto:`. | Essencial | Obrigatório |

## Lista e quadro de itens (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF110 | O submenu "E-mail" do menu da linha deve ter 1 grupo por contato do item (RN101), com o título "<Nome do contato na tela> · <nome>", ou só o rótulo quando o contato não tem nome. | CTR-00231: "Contato da contraparte · Marina Alves" e "Requisitante". | Essencial | Obrigatório |
| RF111 | O clique direito no cartão do quadro deve trazer o submenu "E-mail" do menu da linha, com os grupos de RF110. | No quadro de Contratos, o clique direito em CTR-00231 mostra os 2 grupos. | Importante | Obrigatório |
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

## Central E-mails (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF118 | Para quem administra, o bloco "Contato do item" da aba Configurações deve mostrar "Defina na própria categoria os campos de nome e de e-mail do contato." e o link "Escolher o contato de cada categoria". | Perfil de quem administra, aba Configurações: o texto e o link aparecem no lugar do texto sobre os campos de e-mail. | Importante | Obrigatório |
| RF119 | "Escolher o contato de cada categoria" deve levar ao cartão "Contato da categoria". | No protótipo, o link abre a página de Contratos. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Quem vê "Escolher os campos de contato": cada membro, ou só quem acessa a configuração da categoria? O protótipo mostra a quem usa. | produto | Sem acesso à configuração, o item mostra só os 2 textos |
| P102 | "Escolher o contato de cada categoria" abre a lista de categorias (Estrutura › Categorias) ou a página de uma categoria? O protótipo abre Contratos. | produto | O destino do link |
| P103 | O campo de origem do e-mail fora do formulário da Visão Geral: "Cadastrar e-mail" some, ou abre o formulário Editar da categoria? | produto e dev do front | O botão de RF103 ganha a condição do formulário |
| P104 | O contato sem nome e sem e-mail no item fica fora do submenu "E-mail", como no cartão "Contato do item"? O protótipo mostra o grupo indisponível no submenu. | produto | O submenu lista cada contato da categoria, com o motivo |
| P105 | No evento de 0 contatos com e-mail, "E-mail para todos (<N>)" some ou fica indisponível? | produto | O critério de RF117 |

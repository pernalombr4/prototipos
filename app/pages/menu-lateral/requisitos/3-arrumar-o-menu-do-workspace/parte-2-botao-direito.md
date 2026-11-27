# 2. Botão direito

**Objetivo:** toda linha e todo título de seção do menu do workspace ganham um menu de ações, pelo botão direito e
pelo "…" do hover: abrir, mover, mudar de nível e renomear.

**Depende de:** 1. Submenu e rascunho.

**Onde vale:** as linhas e os títulos de seção do menu do workspace, no painel e no menu flutuante.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, botão direito em Painel de vendas.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Nome nativo vem do produto: só o que o workspace criou se renomeia. | Comercial se renomeia; Auditoria, não. | Obrigatório |
| RN102 | Categoria só mora na seção Categorias, e a seção Categorias só recebe categoria. | "Mover para" de Contratos não lista Comercial. | Obrigatório |

## Menu de ações da linha (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O botão direito numa linha do menu do workspace deve abrir o menu de ações da linha. | Botão direito em Contratos abre o menu de ações. | Essencial | Obrigatório |
| RF102 | O menu de ações de uma linha deve ter estes blocos, nesta ordem: ir ("Abrir", "Abrir em nova aba", "Copiar link"); arrumar ("Mover para cima", "Mover para baixo", "Mover para"); nível ("Adicionar submenu", "Tirar da seção", "Tirar do menu", conforme a linha); mexer ("Renomear", "Ocultar do menu"). | Botão direito em Painel de vendas mostra os blocos ir, arrumar, nível e mexer. | Essencial | Obrigatório |
| RF103 | "Mover para" deve listar as seções do workspace e, para quem está dentro de uma seção, "Primeiro nível do menu", sem Integrações (RN904) e conforme a RN102. | Em Painel de vendas, a lista não tem Categorias nem Integrações. | Importante | Obrigatório |
| RF104 | "Renomear" só deve aparecer no que o workspace criou (RN101) e abrir uma janela curta com o nome; o nome novo entra no rascunho. | Botão direito em Auditoria não tem "Renomear". | Importante | Obrigatório |
| RF105 | Numa linha de Integrações, o menu de ações não deve ter os itens de mover (RN904). | Botão direito em Credenciais: "Abrir", "Abrir em nova aba", "Copiar link" e "Ocultar do menu". | Essencial | Obrigatório |
| RF106 | Item que a pessoa não pode usar pela RN901 deve aparecer desligado, com a explicação "Só quem configura o workspace". | Membro com licença Basic: "Mover para cima" aparece desligado, com a explicação. | Importante | Obrigatório |
| RF107 | Shift+F10 numa linha com foco deve abrir o menu de ações da linha. | Pelo teclado, Shift+F10 em Contratos abre o menu. | Importante | Desejável |
| RF108 | Alt com a seta para cima ou para baixo, numa linha ou num título com foco, deve mover 1 lugar entre os vizinhos, no rascunho. | Alt+↓ em Logs de auditoria a põe depois de Logs de requisição. | Essencial | Obrigatório |

## Menu de ações do título de seção (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF111 | O menu de ações de um título de seção dentro do painel deve ter recolher ou expandir, "Copiar link", "Novo menu nesta seção", mover, "Mostrar na seção" e o bloco mexer. | Botão direito no título Comercial mostra os itens. | Importante | Obrigatório |
| RF112 | O título de Integrações não deve ter "Novo menu nesta seção" nem os itens de mover (RN904). | Botão direito no título Integrações não tem os itens. | Importante | Obrigatório |
| RF113 | O botão direito no ícone de uma seção do workspace na trilha deve ter os itens de mover, no rascunho. | Botão direito no ícone Comercial mostra "Mover para cima" e "Mover para baixo". | Importante | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S101 | Suposição: "Ocultar do menu" e "Mostrar na seção" são os do épico Personalizar o meu menu e só aparecem com ele no ar. | produto | O menu de ações sai sem os 2 itens até lá. |

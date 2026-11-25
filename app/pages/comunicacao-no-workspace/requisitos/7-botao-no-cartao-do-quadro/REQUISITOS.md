# Requisitos: Botão de e-mail no cartão do quadro

**Objetivo:** o cartão do quadro de itens e o do quadro de tarefas ganham um botão de e-mail
que o teclado alcança. O épico "Escrever e-mail de qualquer tela e central E-mails no menu" põe o atalho só no menu do clique direito do
cartão.

**Depende de:** o clique direito no cartão com o submenu "E-mail", do épico "Escrever e-mail de qualquer tela e central E-mails no menu".

**Onde vale:** o quadro de itens (lista de itens da categoria, visualização em quadro) e o quadro de Tarefas › Rápidas,
os 2 com o mesmo cartão de quadro do produto.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/, aprovado em 24/11/2026. O protótipo
não tem o botão no cartão: mostra o mesmo menu no clique direito do cartão, no quadro de itens e no de tarefas. Os
textos nos 3 idiomas estão no protótipo: o controle "Idioma" da barra de baixo troca entre PT, EN e ES.

**Fora do escopo:** o clique direito no cartão, que fica no épico "Escrever e-mail de qualquer tela e central E-mails no menu"; outras ações
no cartão além do e-mail.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## O botão no cartão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | No quadro de itens, cada cartão deve ter o botão de e-mail, com as opções do submenu "E-mail" do clique direito: um grupo por contato do item, com "Escrever pelo ENSPACE" e "Abrir no meu app de e-mail". | Cartão de CTR-00231: o botão abre o menu com os contatos e os 2 caminhos de cada um. | Desejável | Opcional |
| RF002 | No quadro de tarefas, cada cartão deve ter o botão de e-mail para o responsável, com "Enviar e-mail para <nome>" e os 2 caminhos. | Cartão de T-1042: o botão abre "Enviar e-mail para Bruno Teixeira". | Desejável | Opcional |
| RF003 | Se o contato do item não tem e-mail, a opção dele no menu do botão deve ficar indisponível, com o motivo "Sem e-mail cadastrado" ou "Sem contato". | Item sem e-mail no contato: a opção aparece indisponível, com "Sem e-mail cadastrado". | Desejável | Opcional |
| RF004 | Se a tarefa não tem responsável, o botão do cartão deve ficar indisponível, com o motivo "Sem responsável". | Cartão de T-1052, sem responsável: o botão mostra "Sem responsável" na dica e no nome acessível. | Desejável | Opcional |
| RF005 | O botão de e-mail do cartão deve ser alcançável pelo Tab e abrir o menu pelo teclado. | Com Tab até o cartão de CTR-00231 e Enter no botão, o menu abre. | Desejável | Opcional |
| RF006 | O clique direito no cartão deve continuar com o submenu "E-mail", junto do botão. | Clique direito no cartão de CTR-00231: o menu de contexto continua com "E-mail". | Desejável | Opcional |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Onde fica o botão no cartão e qual o rótulo: "Notificar", "E-mail" ou só o ícone? O protótipo não desenha o botão. | produto | Define o desenho do botão nos 3 idiomas |
| P002 | Com o botão no cartão, as dicas dos quadros mudam? Hoje dizem "Clique com o botão direito num cartão para enviar e-mail ao contato." e "Clique no cartão para abrir a tarefa. Com o botão direito, envie e-mail ao responsável.". | produto | Textos novos para as 2 dicas, nos 3 idiomas |
| S001 | O clique no botão de e-mail não abre o item nem o painel da tarefa, como faz o clique no resto do cartão. | produto, no desenho do botão, ou dev | Se abrir, o menu e o painel aparecem juntos |

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

# Épico: Responder na mesma conversa e encaminhar e-mail

**O que é:** a resposta escrita pelo ENSPACE passa a seguir na mesma conversa do e-mail original, no lugar do e-mail
novo com "Re:" do épico "Enviar e-mail, WhatsApp e SMS de qualquer tela e central Comunicações no menu". O e-mail ganha "Encaminhar", com o texto citado e os
anexos. Nos 2 casos, o e-mail continua no item do original.

**Onde vale:** a Mail Box do item e a da tarefa (hover da linha e e-mail aberto) e a lista da central Comunicações
(menu da linha e leitura no painel lateral), com o compositor "Nova Mensagem".

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/, aprovado em 24/11/2026. Na barra de
baixo, escolha "Fase: 2 · Remetente" e abra a Mail Box de CTR-00231 ou a lista de mensagens. Os textos nos 3 idiomas estão no protótipo: o controle "Idioma" da barra de baixo troca entre PT, EN e ES.

**Fora do escopo:** responder e encaminhar o e-mail enviado pelo sistema (tarefas e fluxos), que tem "Reenviar e-mail"
no lugar; a escolha do remetente (épico "Enviar e-mail pelas Caixas de E-mail do workspace"); a tarefa vinculada (épico "Vincular e-mail a uma tarefa").

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Responder na mesma conversa](parte-1-responder-na-conversa.md) | A resposta enviada como resposta da conversa original, com o aviso novo | | Religa o "Responder" que já aparece nas telas |
| [2. Encaminhar](parte-2-encaminhar.md) | O botão "Encaminhar" na Mail Box e na lista de mensagens e o compositor com "Enc:", o texto citado e os anexos | | Independe da parte 1; vem depois porque pede o envio dos anexos do original |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | O e-mail respondido ou encaminhado mantém o item vinculado do e-mail original. | Resposta e encaminhamento de um e-mail de CTR-00231 ficam na Mail Box de CTR-00231. | Obrigatório |
| RN902 | O e-mail enviado pelo sistema não pode ser respondido nem encaminhado. | O e-mail "Do sistema" mostra "Reenviar e-mail", sem "Responder" e sem "Encaminhar". | Obrigatório |

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

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | O "Responder" está desligado na tela do develop. O que falta, no envio pela integração do Correio do Outlook, para responder e encaminhar a partir do e-mail original? | dev do back e do front | Define a obra das 2 partes |
| P902 | Com o épico "Enviar e-mail pelas Caixas de E-mail do workspace" no ar, a resposta e o encaminhamento enviados por uma caixa seguem as mesmas regras? | dev do back | Sem o mesmo caminho na caixa, as 2 partes valem só para a conta do Outlook |

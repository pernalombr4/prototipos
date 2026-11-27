# Épico: Enviar SMS e WhatsApp pelo número do workspace, com a integração Twilio

**O que é:** com a integração Twilio do workspace, o ENSPACE passa a enviar SMS e WhatsApp pelo número do workspace,
de uma pessoa (atalhos e "Nova mensagem") e de um fluxo (nós "Enviar SMS" e "Enviar WhatsApp" do Spaceflow). Cada
envio fica no item e na central "Comunicações", que passa a mostrar os 3 canais e o status de entrega, também do
e-mail. A integração soma um caminho aos atalhos e mantém os sem integração: a pessoa continua podendo enviar pelo próprio
celular e pelo próprio WhatsApp. Pede back novo: o status de entrega do e-mail pelo aviso de eventos da SendGrid, o
envio de SMS pela Twilio do workspace e o envio de WhatsApp com modelo aprovado pela Meta. Depende do épico
"Enviar e-mail, WhatsApp e SMS de qualquer tela e central Comunicações no menu", que entrega a central, os atalhos, o painel
"Enviar SMS" e os 5 status do envio.

**Onde vale:** a central "Comunicações" (lista, leitura e "Nova mensagem"); Configurações › Comunicações (abas Modelos
e Canais e regras); os atalhos de SMS e de WhatsApp do item, da lista e do quadro de itens, das tarefas e da Agenda;
Configurações › Dados › Spaceflow, no editor do fluxo.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/, com o controle "Fase" em
"4 · Comunicações". O controle "Sem Twilio" mostra o workspace sem a integração, e "Ir para" › "Spaceflow (nós de
mensagem)" abre o fluxo "Lembrete de vencimento do contrato". A barra de baixo é ferramenta de revisão e não entra no
produto. Os textos nos 3 idiomas estão no protótipo: o controle "Idioma" da barra de baixo troca entre PT, EN e ES.

**Fora do escopo:**
- a conversa do WhatsApp na Central de Atendimento, que continua como hoje;
- o WhatsApp de texto livre pelo número do workspace, fora de uma conversa aberta pelo contato: a Meta só aceita modelo aprovado;
- o envio em lote de SMS e de WhatsApp por uma pessoa pelo número do workspace: o lote pelo workspace é o fluxo do Spaceflow;
- o custo de cada envio na central (P902);
- o consentimento e o descadastro do destinatário (P901).

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Canais de envio do workspace](parte-1-canais-de-envio.md) | A seção "Canais de envio do workspace" na aba Canais e regras, com o e-mail do sistema, o SMS e o WhatsApp, o estado de cada um e os atalhos | | Diz a quem administra se o workspace já envia por cada canal; as outras partes leem o mesmo estado |
| [2. Status de entrega na central](parte-2-status-de-entrega.md) | A coluna Entrega, o filtro "Não entregues", o motivo, o código do provedor e o "Histórico do envio", com o aviso de eventos da SendGrid para o e-mail | | Vale já para o e-mail do sistema, antes do SMS e do WhatsApp |
| [3. SMS e WhatsApp na central](parte-3-sms-e-whatsapp-na-central.md) | "Nova mensagem" com os 3 canais, os filtros e a coluna Canal, a leitura do SMS e do WhatsApp, "Reenviar" e o WhatsApp do atendimento | 2 | Mostra o que as partes 5, 6 e 7 enviam |
| [4. Modelos de WhatsApp](parte-4-modelos-de-whatsapp.md) | O alternador E-mail e WhatsApp na aba Modelos, a tabela com o status na Meta e "Novo modelo de WhatsApp" | 1 | O WhatsApp do workspace só envia modelo aprovado: as partes 6 e 7 escolhem o modelo daqui |
| [5. Enviar SMS pelo número do workspace](parte-5-enviar-sms-pelo-workspace.md) | "Enviar pelo ENSPACE" no painel "Enviar SMS", com o registro, e os caminhos pelo celular abaixo | 1, 3 | O envio aparece na central da parte 3 |
| [6. Enviar WhatsApp pelo workspace](parte-6-enviar-whatsapp-pelo-workspace.md) | O painel "Enviar WhatsApp", com "WhatsApp do workspace" e "Seu WhatsApp", aberto pelos atalhos | 1, 3, 4 | Usa os modelos da parte 4 e aparece na central da parte 3 |
| [7. Nós Enviar SMS e Enviar WhatsApp no Spaceflow](parte-7-nos-do-spaceflow.md) | Os 2 nós na paleta, o modal de configuração, o cartão do nó e o envio pelo fluxo | 1, 3, 4 | O envio do fluxo aparece na central e usa os modelos da parte 4 |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | O ENSPACE só envia SMS e WhatsApp pelo número do workspace se o workspace tem a integração Twilio ligada, com o número de cada canal. Sem a integração, os atalhos de SMS e de WhatsApp funcionam sem integração, pelo celular e pelo WhatsApp da pessoa: o SMS abre o painel com os caminhos pelo celular, e o WhatsApp abre a conversa no WhatsApp da pessoa. | Com "Sem Twilio", o botão WhatsApp do item abre o WhatsApp Web direto, sem painel. | Obrigatório |
| RN902 | A integração soma um caminho e mantém os sem integração: com a Twilio, cada atalho de SMS oferece o número do workspace e os caminhos pelo celular da pessoa, e cada atalho de WhatsApp oferece o WhatsApp do workspace e o WhatsApp da pessoa. | Com a Twilio, o painel "Enviar SMS" mostra "Enviar pelo ENSPACE" e, abaixo, "Abrir no app de SMS" e o QR code. | Obrigatório |
| RN903 | O WhatsApp pelo número do workspace só envia modelo com o status Aprovado na Meta. O modelo Em análise e o Recusado aparecem indisponíveis, com "<status> na Meta. Só o modelo aprovado pode ser enviado.". | "pesquisa_de_satisfacao", Em análise, aparece cinza na escolha do modelo. | Obrigatório |
| RN904 | Cada SMS e cada WhatsApp enviado pelo número do workspace fica registrado no item e na central "Comunicações", com os 5 status do envio (Na fila, Em processamento, Enviado ao provedor, Falhou, Cancelado) e a entrega. O que a pessoa envia pelo próprio celular ou pelo próprio WhatsApp não fica registrado. | O SMS que Ana envia de CTR-00230 pelo ENSPACE aparece na central como "Ana Ribeiro, pelo ENSPACE"; o que ela abre no app do celular, não. | Obrigatório |
| RN905 | A tabela a seguir define a entrega de cada mensagem, que o provedor informa depois do status Enviado ao provedor. Política: Única. | Linha 4: o e-mail para um endereço que não existe fica Devolvido, com o código "550 5.1.1". | Obrigatório |
| RN906 | O SMS e o WhatsApp que uma pessoa envia pelo número do workspace aparecem para todo membro que vê o item. O SMS e o WhatsApp que um fluxo envia seguem a permissão de hoje de ver os e-mails enviados, como o e-mail do sistema. | O membro vê o SMS que Ana enviou de CTR-00230; o SMS do fluxo de vencimento, só com a permissão. | Obrigatório |
| RN907 | Cada SMS e cada WhatsApp pelo número do workspace tem custo na conta Twilio do workspace. A ajuda do botão que envia diz o custo. | A ajuda de "Enviar pelo ENSPACE" termina com "O SMS tem custo na conta Twilio do workspace.". | Obrigatório |

| Linha | Entrega | Canal | O que quer dizer |
|---|---|---|---|
| 1 | Entregue | E-mail, SMS e WhatsApp | O provedor confirmou a entrega |
| 2 | Lido | WhatsApp | O destinatário abriu a mensagem |
| 3 | Adiado | E-mail | O servidor do destinatário pediu para tentar depois |
| 4 | Devolvido | E-mail | O endereço não existe ou recusou; a leitura mostra o motivo e o código |
| 5 | Bloqueado | E-mail | O servidor do destinatário bloqueou a mensagem como spam |
| 6 | Não entregue | SMS e WhatsApp | A operadora ou a Meta recusou; a leitura mostra o motivo e o código |
| 7 | "-" | E-mail pelo Outlook da pessoa | O Outlook não informa a entrega |

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

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Número do workspace | O número de SMS do workspace na integração Twilio | "Número do workspace" |
| WhatsApp do workspace | O número de WhatsApp Business do workspace na integração Twilio | "WhatsApp do workspace" |
| Modelo de WhatsApp | O texto com variáveis ({{1}}, {{2}}) aprovado pela Meta, o único que o WhatsApp do workspace envia a quem não abriu uma conversa | "Modelo aprovado" |
| Entrega | O que o provedor informou depois de aceitar a mensagem | "Entrega" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | Quem registra que o destinatário aceitou receber SMS e WhatsApp, e onde fica o descadastro (a resposta "SAIR")? | produto e jurídico | Sem a regra, o envio pelo número do workspace não pode sair; com ela, as partes 5, 6 e 7 ganham a condição |
| P902 | O SMS e o WhatsApp saem da conta Twilio do cliente ou da plataforma? A central mostra o custo de cada envio? | produto | Com o custo na central, a parte 3 ganha a coluna; com a conta da plataforma, muda o texto de RN907 |

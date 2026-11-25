# Épico: BENI na Home

**O que é:** o BENI ganha 3 lugares na Home: o widget com o resumo do dia, o rascunho de item e de tarefa montado na
conversa a partir do "Pedir ao BENI" e a conversa flutuante que abre já com o agente clicado. Cada um pede algo que o
produto ainda não tem: rota do resumo, interação nova na conversa e o agente recebido de fora pela conversa flutuante.

**Onde vale:** a Home do workspace, o botão Criar e a conversa flutuante do BENI AI.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". A troca de idioma do protótipo mostra os textos em português, inglês e espanhol. No protótipo, quem
entende o pedido é uma lista de palavras-chave, e não a IA. A barra de baixo é ferramenta de revisão e não entra no
produto.

**Fora do escopo:** criar categoria pela conversa, que no protótipo só mostra a sugestão.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Conversa flutuante com o agente](parte-1-conversa-flutuante.md) | A conversa flutuante que abre com o agente e o pedido vindos de fora | o épico Widgets de agentes de IA e do Spaceflow na Home | As partes 2 e 3 abrem a conversa flutuante |
| [2. Rascunho na conversa](parte-2-rascunho-na-conversa.md) | O rascunho de tarefa rápida e de item, com Criar, Revisar no formulário e Descartar | 1 e o épico Home em widgets, com Categorias e tarefas | Troca a conversa em tela cheia do "Pedir ao BENI" pela flutuante com o rascunho |
| [3. Widget BENI](parte-3-widget-beni.md) | O resumo do dia e o botão "Conversar com o BENI" | 1 | Pede a rota do resumo |

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

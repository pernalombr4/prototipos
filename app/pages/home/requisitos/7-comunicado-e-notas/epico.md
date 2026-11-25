# Épico: Comunicado e Bloco de notas na Home

**O que é:** a Home ganha 2 widgets de texto: o comunicado que o administrador escreve para o workspace inteiro e o
bloco de notas, que só a própria pessoa vê. Os 2 pedem modelo e rota novos: hoje o produto só tem nota de item.

**Onde vale:** a Home do workspace e o grupo Equipe e notas do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". A troca de idioma do protótipo mostra os textos em português, inglês e espanhol. A barra de baixo é
ferramenta de revisão e não entra no produto.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Comunicado](parte-1-comunicado.md) | O aviso do administrador para o workspace | o épico Home em widgets, com Categorias e tarefas | Serve a todo o workspace |
| [2. Bloco de notas](parte-2-bloco-de-notas.md) | O texto pessoal da pessoa na Home | o épico Home em widgets, com Categorias e tarefas | Independe da parte 1 |

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

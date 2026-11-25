# Épico: Widgets da Home com dado novo

**O que é:** o catálogo da Home ganha 3 widgets que pedem dado ou rota que o produto ainda não tem: as tarefas que a
pessoa delegou, a contagem de itens por categoria e o gráfico de um painel de uma tela Dashboard.

**Onde vale:** a Home do workspace e os grupos Tarefas, Itens e categorias e Telas e atalhos do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". Os textos nos 3
idiomas estão no `textos.ts` de https://github.com/pernalombr4/prototipos/tree/main/app/pages/home. A barra de baixo é
ferramenta de revisão e não entra no produto.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Tarefas que delegei](parte-1-tarefas-que-delegei.md) | As tarefas abertas que a pessoa criou para outra pessoa | o épico Home em widgets, com Categorias e tarefas | A tarefa rápida já guarda quem criou; falta o filtro |
| [2. Itens por categoria](parte-2-itens-por-categoria.md) | A contagem de itens de cada categoria, em barras | o épico Home em widgets, com Categorias e tarefas | Pede contagem agregada |
| [3. Gráfico de um painel](parte-3-grafico-de-um-painel.md) | Um painel de uma tela Dashboard dentro da Home | o épico Home em widgets, com Categorias e tarefas | Pede a configuração de tela e painel |

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

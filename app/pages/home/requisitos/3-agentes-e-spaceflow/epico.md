# Épico: Widgets de agentes de IA e do Spaceflow na Home

**O que é:** o catálogo da Home ganha o widget dos agentes de IA, que abre a conversa já com o agente, e 3 widgets do
Spaceflow: as execuções por status, os fluxos que pararam com erro e os que estão em andamento. Todos usam as rotas que
o produto já tem.

**Onde vale:** a Home do workspace e os grupos IA e Spaceflow do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". Os textos nos 3
idiomas estão no `textos.ts` de https://github.com/pernalombr4/prototipos/tree/main/app/pages/home. A barra de baixo é
ferramenta de revisão e não entra no produto.

**Fora do escopo:** o widget BENI com o resumo do dia, a conversa flutuante que abre com o agente clicado (épico BENI
na Home) e a falha só dos passos de agente de IA, que pede filtro novo.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Agentes de IA](parte-1-agentes-de-ia.md) | O widget com os agentes do workspace e do sistema | o épico Home em widgets, com Categorias e tarefas | A conversa em tela cheia já recebe o agente |
| [2. Widgets do Spaceflow](parte-2-widgets-do-spaceflow.md) | Execuções dos fluxos, Falhas nos fluxos com Repetir e Fluxos em andamento | o épico Home em widgets, com Categorias e tarefas | Independe da parte 1 |

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

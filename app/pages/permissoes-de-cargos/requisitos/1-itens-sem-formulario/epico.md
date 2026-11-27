# Épico: Itens sem formulário

**O que é:** os itens sem formulário viram uma origem da categoria, como cada formulário, com as 4 ações no cargo.
O cargo com a categoria inteira volta a ver esses itens, e o cargo restrito a alguns formulários vê só os itens deles.
Hoje os itens sem formulário somem de todo cargo com permissão de formulário gravada: é o que esconde do cargo as
demandas criadas pelo agente de IA do Spaceflow no workspace de produtos.

**Onde vale:** a tela de permissões do cargo (Configurações > Gestão de membros > Cargos > o cargo, aba Dados, a
árvore de cada categoria) e a listagem e a abertura de itens em toda porta: a tela, a API, o MCP e os agentes de IA.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, aprovado em 24/11/2026. Clique em
"Processos Judiciais": a categoria abre e mostra a linha "Itens sem formulário". Na tela de hoje, a mesma escolha é 1 nó na
árvore da categoria, junto dos formulários. O resto da tela do protótipo é outro desenvolvimento.

**Fora do escopo:** a tela nova de permissões do protótipo; Criar, Atualizar e Excluir por formulário valendo na API;
o formulário criado depois.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Origem na tela de permissões](parte-1-origem-na-tela-de-permissoes.md) | O nó "Itens sem formulário" em cada categoria com formulário e a gravação da permissão dele | | Sem a origem gravada, a listagem não tem o que ler |
| [2. Listagem e abertura](parte-2-listagem-e-abertura.md) | A listagem e a abertura de itens pelo Ver de cada origem, em toda porta, e a migração dos cargos | 1 | Usa a permissão que a parte 1 grava |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN601 | Os itens sem formulário são uma origem da categoria, como cada formulário. O item criado pelo formulário padrão também fica sem formulário. | Em "Processos Judiciais", as origens são Cível, Criminal, Trabalhista e "Itens sem formulário". | Obrigatório |

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
| P601 | A correção na develop desde 16/11/2026 mostra os itens sem formulário a todo cargo com Ver na categoria. Este épico a substitui antes de ela ir para produção? | produto e dev do back | Indo para produção antes, o cargo com Ver só em Criminal passa a ver os processos sem formulário até este épico sair |
| S601 | A listagem do MCP e a dos agentes de IA usam a mesma checagem de permissão da tela e da API. | dev do back | Se usarem outra, a parte 2 vale também nelas |

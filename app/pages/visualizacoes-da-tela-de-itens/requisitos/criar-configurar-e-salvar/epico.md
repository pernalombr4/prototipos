# Épico: Criar, configurar e salvar visualização

**O que é:** o que a pessoa muda na lista (filtro, ordenação, coluna) fica como alteração não salva da visualização
ativa, e uma barra flutuante na base da tela oferece salvar para todos, só para ela ou como nova visualização. A
visualização se configura num painel ao lado da tabela, que mostra cada ajuste na hora, no lugar do modal de hoje. A
visualização nova nasce de um catálogo de tipos (Tabela ou Kanban) e já abre no painel.

**Onde vale:** a tela nova de itens de cada categoria (`/workspaces/<ws>/types/<categoria>`) e, com a mesma lógica, as
telas Tarefas Rápidas (`/tasks/quick`) e Tarefas Agendadas (`/tasks/scheduled`), com os campos e o "Agrupar por" da
RN013.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. Os textos nos 3 idiomas estão no `textos.ts` de
https://github.com/pernalombr4/prototipos/tree/main/app/pages/visualizacoes-da-tela-de-itens. A barra inferior do protótipo é só para revisão; nela, "Perfil" troca Owner ou Full por Standard ou Viewer.

**Fora do escopo:** a barra de visualizações (pílula, menu, arrastar, ocultar), que é do épico "Barra de
visualizações"; a linha de filtros e a seção Filtros do painel, que são do épico "Filtros da tela de itens"; o cartão do
quadro do `EnKanbanBoard`.

**Relevância** (no fim de cada requisito): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Alterações não salvas e salvar](parte-1-alteracoes-e-salvar.md) | O ponto de alteração não salva, a barra flutuante com salvar para todos ou como nova e o X que fecha sem salvar | | É a base: o painel salva por ela, e os filtros da tela viram alteração não salva por ela |
| [2. Painel Configurar](parte-2-painel-configurar.md) | O painel ao lado da tabela, ao vivo, sem 2º modal, com Nome, Exibição, Cartão ou Colunas, Ordenação com níveis e Quem vê | 1 | Troca o modal de hoje; a criação da parte 3 abre este painel |
| [3. Criar pelo catálogo](parte-3-criar-pelo-catalogo.md) | "+ Visualização" abre o catálogo Tabela ou Kanban; o tipo escolhido cria a visualização genérica, já aberta no painel em modo de criação | 2 | Precisa do painel; tira o modal "Nova Visualização" de hoje |
| [4. Versão só minha](parte-4-versao-so-minha.md) | "Salvar só para mim" na barra flutuante, o ícone "Versão só sua" na pílula e "Voltar à versão de todos" | 1 | Fica fora da base porque a versão de cada pessoa pede um lugar novo no back. Até ela chegar, Standard ou Viewer salva a mudança numa visualização de todos só como nova, e a linha 3 da RN011 vale inteira com esta parte |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN011 | A tabela de perfis abaixo define o que cada perfil pode criar e salvar. Política: Única. | Linha 3: Standard ou Viewer salva só para si a mudança numa visualização de todos. | Obrigatório |
| RN013 | Os campos e o "Agrupar por" de cada tela são os da tabela de parâmetros abaixo. Política: Única. | Linha 2: em Tarefas Rápidas, o Kanban agrupa por Status, Responsável ou Prioridade. | Obrigatório |

Perfis (RN011).

| Linha | Ação | Owner ou Full | Standard ou Viewer |
|---|---|---|---|
| 1 | Criar visualização para todos ou para grupos e funções | sim | não |
| 2 | Criar visualização só para si | sim | sim |
| 3 | Salvar mudança numa visualização de todos | para todos ou só para si | só para si |
| 4 | Mudar quem vê uma visualização de todos | sim | não |

Parâmetros de cada tela (RN013).

| Linha | Tela | Campos de coluna, cartão e ordenação | "Agrupar por" no Kanban |
|---|---|---|---|
| 1 | Itens | os campos da categoria | os campos de seleção da categoria |
| 2 | Tarefas Rápidas | ID, Nome, Criado em, Data limite, Status, Permissões, Responsável, Responsável externo, Colaboradores, Prioridade, Descrição | Status, Responsável, Prioridade |
| 3 | Tarefas Agendadas | ID, Status da Tarefa, Status de SLA, Responsáveis, Tipo, Referência do Item, Tarefa, Título, Descrição, Criado em, Data Limite, Concluído em, Concluído por, Nome do Fluxo, Etapa do Fluxo, Status do Item | Status da Tarefa |

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

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Alteração não salva | Mudança na visualização ativa que vale só para a pessoa até ela salvar ou descartar | "Alterações não salvas" |
| Barra flutuante | A barra na base da tela que aparece com a alteração não salva | "Você alterou <nome>" |
| Versão só minha | A versão de uma visualização de todos que vale só para quem a salvou | "Versão só sua" |
| Painel Configurar | O painel ao lado da tabela que configura a visualização | "Configurar", "Nova visualização" |
| Catálogo de tipos | A escolha entre Tabela e Kanban ao criar | "Nova visualização" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P017 | Este épico pode ir ao cliente antes do épico "Filtros da tela de itens"? Antes dele, a seção Filtros do painel é a do modal de hoje, com 2º modal, e o filtro está no funil e na gaveta de hoje. | produto | Saindo antes, o painel leva a seção Filtros de hoje até o outro épico chegar, e o filtro do funil e da gaveta passa a virar alteração não salva |

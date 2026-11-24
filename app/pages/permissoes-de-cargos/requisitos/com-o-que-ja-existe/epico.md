# Épico: Permissões de cargos, a tela nova com o que já existe

**O que é:** a tela de permissões do cargo troca a árvore de caixas por uma tabela com 1 linha por categoria e 4
caixas (Criar, Ver, Atualizar, Excluir). Campos e formulários saem da tabela e ficam em Ajustar, uma camada lateral, e
as permissões fixas viram uma matriz por área. A tela grava as mesmas permissões que a árvore grava hoje: nada muda no
back.

**Onde vale:** Configurações > Gestão de membros > Cargos > o cargo, nas abas Dados e Configurações.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, aprovado em 24/11/2026. Os textos nos
3 idiomas estão no arquivo de textos da pasta do protótipo:
https://github.com/pernalombr4/prototipos/tree/main/app/pages/permissoes-de-cargos. A barra "Protótipo" no pé da tela
(estados da tela e simulações) é ferramenta de revisão e não entra no produto. O protótipo mostra também o que é do
épico "Permissões de cargos: regras novas no back": a linha do padrão, a coluna Quais itens e a linha "Itens sem
formulário" ficam fora deste épico.

**Fora do escopo:** o padrão para todas as categorias, "Segue o padrão", "Regra própria" e o desfazer por caixa; a
coluna e a aba Quais itens (criador e responsável); a linha "Itens sem formulário"; o que o cargo vê dos itens sem
formulário e do formulário criado depois. Tudo isso está no épico "Permissões de cargos: regras novas no back". A aba
Inválidas, a casca da tela, o cabeçalho do cargo e o lugar de "Salvar Alterações" continuam como estão.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Tabela de categorias](parte-1-tabela-de-categorias.md) | 1 linha por categoria com 4 caixas, busca, filtros, a caixa de coluna com desfazer, Ver travado por Atualizar e Excluir e a célula parcial | | É a base: as outras partes abrem dela |
| [2. Campos da categoria](parte-2-campos-da-categoria.md) | Ajustar › Campos, com "Todos os campos" ou campo a campo, e a coluna Campos | 1 | Abre do botão Ajustar da linha |
| [3. Formulários da categoria](parte-3-formularios-da-categoria.md) | Ajustar › Formulários como caixa pai e filhas por ação, as sublinhas de formulário e a coluna Formulários | 1 | Abre do botão Ajustar e da seta da linha |
| [4. Permissões fixas](parte-4-permissoes-fixas.md) | A matriz por área das permissões fixas, nas abas Dados e Configurações, com "+N ações" | | Muda só as permissões fixas; corre em paralelo |
| [5. Pessoas do cargo e confirmação](parte-5-pessoas-e-confirmacao.md) | A janela das pessoas do cargo, o aviso de alterações pendentes e a confirmação que diz o que muda e para quantas pessoas | | Fecha o fluxo de salvar; corre em paralelo |
| [6. Quem acessa](parte-6-quem-acessa.md) | A aba Quem acessa no Ajustar, com o que cada cargo faz na categoria | 2 | Mora na camada Ajustar |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Atualizar e Excluir só podem valer onde Ver vale: na categoria, no formulário, no campo e na área fixa. | Com Atualizar em Contratos, Ver em Contratos fica marcado e não se desmarca. | Obrigatório |
| RN902 | Uma alteração de permissão só vale para as pessoas do cargo depois de salva. | Marcar Ver em Contratos e fechar a tela sem salvar não muda o que as pessoas veem. | Obrigatório |

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
| Exceção deste épico | Cada caixa tem o nome da ação e do lugar ("Ver: Contratos de Clientes"). Traço, cadeado e parcial nunca dependem só de cor. Abaixo de 900 px, a tabela rola na horizontal: a tela é de administração. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Caixa de coluna | A caixa no cabeçalho de uma ação que marca ou desmarca a ação em cada categoria da lista filtrada | (sem nome na tela) |
| Traço | O estado da caixa quando a ação vale só em parte dos campos ou dos formulários | (sem nome na tela) |
| Permissão fixa | Permissão que não depende de categoria, como Agenda, IA ou Cargos | As áreas das seções Padrão e Configurações |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S901 | Este épico grava as mesmas permissões que a árvore de hoje, inclusive as de formulário. O que o cargo vê dos itens sem formulário segue o back da versão em uso. | dev do back | Nada muda neste épico; o épico "Permissões de cargos: regras novas no back" corrige |
| P901 | A correção do card USE87A7C6, na develop desde 16/11/2026, mostra os itens sem formulário a todo cargo com Ver na categoria. Ela vai para produção antes do épico "Permissões de cargos: regras novas no back"? | produto e dev do back | Indo antes, o cargo restrito a alguns formulários passa a ver os itens sem formulário (o caso de Processos com Cível e Criminal) até o outro épico sair |
| P902 | O épico sai inteiro, ou cada parte pode ir ao cliente quando fica pronta? | produto | Saindo por parte, a tabela da parte 1 precisa de um caminho para os campos e os formulários da árvore de hoje até as partes 2 e 3 saírem |

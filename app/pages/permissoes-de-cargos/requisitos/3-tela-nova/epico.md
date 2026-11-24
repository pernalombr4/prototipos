# Épico: Tela nova de permissões

**O que é:** a tela de permissões do cargo troca a árvore de caixas por uma tabela com 1 linha por categoria e 4
caixas (Criar, Ver, Atualizar, Excluir). Campos e formulários saem da tabela e ficam em Ajustar, uma camada lateral,
e salvar mostra em palavras o que muda e para quantas pessoas. A tela grava as mesmas permissões que a árvore grava
hoje: nada muda no back. As 4 partes sobem juntas: a tabela sem o Ajustar perde o caminho para campos e formulários.

**Onde vale:** Configurações > Gestão de membros > Cargos > o cargo, seção Categorias da aba Dados.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, aprovado em 24/11/2026. Os textos nos
3 idiomas estão no arquivo de textos da pasta do protótipo:
https://github.com/pernalombr4/prototipos/tree/main/app/pages/permissoes-de-cargos. A barra "Protótipo" no pé da tela
(estados da tela e simulações) é ferramenta de revisão e não entra no produto. O protótipo mostra também o que é de
outros épicos: a linha do padrão, a coluna Quais itens, a matriz das permissões fixas e a aba Quem acessa.

**Fora do escopo:** o padrão para todas as categorias (épico "Padrão para todas as categorias"); a coluna e a aba
Quais itens (épico "Quais itens: criador e responsável"); a matriz das permissões fixas (épico "Permissões fixas em
matriz"); a aba Quem acessa (épico "Quem acessa"); a regra de "Itens sem formulário" e das ações por formulário no
back. A aba Inválidas, a casca da tela, o cabeçalho do cargo e o lugar de "Salvar Alterações" continuam como estão.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Tabela de categorias](parte-1-tabela-de-categorias.md) | 1 linha por categoria com 4 caixas, busca, filtros, a caixa de coluna com desfazer, Ver travado por Atualizar e Excluir e a célula parcial | | É a base: as outras partes abrem dela |
| [2. Campos da categoria](parte-2-campos-da-categoria.md) | Ajustar › Campos, com "Todos os campos" ou campo a campo, e a coluna Campos | 1 | Abre do botão Ajustar da linha |
| [3. Formulários da categoria](parte-3-formularios-da-categoria.md) | Ajustar › Formulários como caixa pai e filhas por ação, as sublinhas de formulário e a coluna Formulários | 1 | Abre do botão Ajustar e da seta da linha |
| [4. Pessoas do cargo e confirmação](parte-4-pessoas-e-confirmacao.md) | A janela das pessoas do cargo, o aviso de alterações pendentes e a confirmação que diz o que muda e para quantas pessoas | 1 | Fecha o fluxo de salvar a tabela |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Atualizar e Excluir só podem valer onde Ver vale: na categoria, no formulário e no campo. | Com Atualizar em Contratos, Ver em Contratos fica marcado e não se desmarca. | Obrigatório |
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
| Origem | De onde o item veio: cada formulário da categoria e, quando a tela de hoje a mostra, "Itens sem formulário" | Os formulários e "Itens sem formulário" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S901 | Este épico grava as mesmas permissões que a árvore de hoje, inclusive as de formulário. O que o cargo vê segue o back da versão em uso. | dev do back | Nada muda neste épico |
| P903 | O cargo gravado hoje com Atualizar ou Excluir sem Ver: a tela marca Ver ao abrir, ou mostra o cargo como está até alguém salvar? | produto | Marcando ao abrir, salvar dá Ver a cargos que hoje não têm |

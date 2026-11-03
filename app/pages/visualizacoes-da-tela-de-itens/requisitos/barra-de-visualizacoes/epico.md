# Épico: Barra de visualizações

**O que é:** a barra de visualizações acima da lista vira uma fileira de pílulas que cada pessoa arruma do jeito dela:
arrasta, fixa, minimiza, oculta e renomeia. Quando a tela aperta, nenhuma visualização se perde: o "+N" aparece só
quando alguma fica fora da barra e é o editor de todas. Owner ou Full decide a ordem padrão e a visualização que abre
primeiro.

**Onde vale:** a barra de visualizações da tela nova de itens de cada categoria (`/workspaces/<ws>/types/<categoria>`)
e, com a mesma lógica, a de Tarefas Rápidas (`/tasks/quick`) e a de Tarefas Agendadas (`/tasks/scheduled`). Muda de uma
tela para outra só a visualização do sistema (RN001).

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens, estilo "Proposta", em revisão
desde 23/10/2026. Os textos nos 3 idiomas estão no `textos.ts` de
https://github.com/pernalombr4/prototipos/tree/main/app/pages/visualizacoes-da-tela-de-itens. A barra inferior do
protótipo (Estilo, Visualizações, Perfil, Tela, tema e idioma) é ferramenta de revisão e não entra no produto: "Tela"
troca a largura, "Visualizações" troca a quantidade (1, 4 ou 18) e "Perfil" troca Owner ou Full por Standard ou Viewer.

**Fora do escopo:** criar visualização, o construtor de visualização e salvar alterações, que são do épico "Criar,
configurar e salvar visualização"; os filtros da lista, que são do épico "Filtros da tela de itens"; a barra de folders
do item; a casca da tela.

**Prioridade e relevância** (nas tarefas, entre parênteses no fim de cada requisito): a prioridade é Essencial,
Importante ou Desejável. A relevância diz o que o dev pode deixar de fazer: Obrigatório, o dev faz. Desejável, o dev
faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande
para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Pílulas e lista do "+N"](parte-1-pilulas-e-lista.md) | A pílula com o nome cortado pela largura, o tooltip de resumo, a visualização no endereço, o "+N" só quando alguma fica fora da barra, a lista com busca e o teclado da barra | | É a base: as outras partes põem ações na pílula e na lista |
| [2. Menu da visualização](parte-2-menu.md) | A seta ⌄ da ativa, o botão direito e o "⋯" da lista abrem o menu, com os grupos "Só para mim" e "Para todos", Configurar, Duplicar, Copiar link e Excluir | 1 | O menu é a porta de fixar, minimizar, ocultar e da ordem para todos |
| [3. Reordenar e fixar](parte-3-reordenar-e-fixar.md) | Arrastar na barra e na lista, fixar no início, mover pelo teclado e a ordem de cada pessoa | 1 e 2 | Fica fora da base porque a ordem de cada pessoa pede um lugar novo no back |
| [4. Ordem para todos](parte-4-ordem-para-todos.md) | "Aplicar minha ordem para todos", "Recuperar a ordem padrão" e "Abrir primeiro para todos", para Owner ou Full | 2 e 3 | A ordem padrão parte da ordem de cada pessoa da parte 3 |
| [5. Minimizar e ocultar](parte-5-minimizar-e-ocultar.md) | A pílula só com o ícone e a visualização tirada da barra, que continua na lista do "+N" | 1 e 2 | Muda o cálculo de quantas pílulas cabem e o N do "+N" da parte 1 |
| [6. Renomear](parte-6-renomear.md) | O campo de renomear na pílula e na linha da lista, por clique duplo, pelo atalho de teclado e por Renomear no menu, com o aviso de nome repetido | 1 e 2 | Funcionalidade própria, com campo, validação e teclado; nenhuma outra parte depende dela |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | A visualização do sistema de cada tela ("Itens", "Tarefas Rápidas", "Tarefas Programadas") não pode ser excluída, renomeada nem ocultada da barra. | Em "Itens", o menu mostra Excluir desligado, sem Renomear e sem "Ocultar da barra". | Obrigatório |
| RN002 | A ordem da barra, as fixadas, as ocultas e as minimizadas são de cada pessoa. | Mikaela arrasta "Vencidos" para o começo; os outros membros continuam vendo a ordem padrão. | Obrigatório |
| RN004 | A tabela de perfis abaixo define o que cada perfil pode fazer na barra. Política: Única. | Linha 1: Standard ou Viewer não renomeia uma visualização de todos. | Obrigatório |
| RN010 | Cada mudança feita na barra (ordem, fixar, nome, ocultar e ordem padrão) pode ser desfeita pelo Desfazer do aviso da mudança. | Desfazer no aviso "Ordem das visualizações salva." volta a ordem anterior. | Obrigatório |

Perfis (RN004).

| Linha | Ação | Owner ou Full | Standard ou Viewer |
|---|---|---|---|
| 1 | Renomear e excluir visualização de todos | sim | não |
| 2 | Renomear e excluir visualização que é só sua | sim | sim |
| 3 | "Abrir primeiro para todos" | sim | não |
| 4 | "Aplicar minha ordem para todos" e "Recuperar a ordem padrão" | sim | não |
| 5 | Reordenar, fixar, minimizar e ocultar na própria barra | sim | sim |
| 6 | Configurar, Duplicar e Copiar link | sim | sim |

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
| Exceção deste épico | A pílula ativa tem o texto na cor de texto forte, não na cor primária: o rosa sobre o fundo rosa claro dava 2,88:1. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Pílula | Cada visualização na barra, com ícone e nome | (sem nome na tela) |
| Visualização do sistema | A visualização que cada tela já traz, na posição 1 | "Itens", "Tarefas Rápidas", "Tarefas Programadas" |
| Lista do "+N" | A lista de todas as visualizações da tela, aberta pelo botão "+N ⌄" | "+N" |
| Fixada | Visualização que a pessoa prendeu no começo da barra | "Fixar no início" |
| Ordem padrão | A ordem da barra para quem não mudou a própria | "Recuperar a ordem padrão" |
| Visualização que abre primeiro | A que abre quando a pessoa entra na tela sem `?view=` no endereço | "Abrir primeiro para todos" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P007 | O menu chama a tela de "Agendadas", e o título dela diz "Tarefas Programadas". Qual nome fica? | Mikaela | Muda o nome da visualização do sistema na RN001 |
| P004 | Quantas visualizações uma categoria tem nos clientes? O protótipo testa 1, 4 e 18. | Dado de uso | Com dezenas, a busca da lista do "+N" vira o caminho principal, e a reordenação na lista pesa mais que na barra |

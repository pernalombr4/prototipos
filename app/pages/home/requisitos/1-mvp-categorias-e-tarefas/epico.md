# Épico: Home em widgets, com Categorias e tarefas

**O que é:** a Home do workspace passa a ser uma grade de widgets que cada pessoa arruma: muda de lugar, muda o
tamanho, adiciona e remove. O catálogo traz Categorias e os widgets de tarefas, e o topo ganha o botão Criar, que
leva a item, tarefa rápida ou conversa com o BENI. Tudo usa o dado, a rota e o componente que o produto já tem.

**Onde vale:** a Home do workspace (`/workspaces/<workspace>`, item "Início" do menu lateral).

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "MVP" escolhido em "Versão" na barra de baixo. A troca de idioma do protótipo mostra os textos em português, inglês e espanhol. A
barra de baixo (estado, papel, versão, tema, idioma) é ferramenta de revisão e não entra no produto.

**Fora do escopo:** a Home padrão montada pelo administrador, os widgets de itens, agenda, atalhos, IA e Spaceflow, o
rascunho de item e de tarefa na conversa do BENI e o menu lateral, que fica como está. Cada um tem o seu épico.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. A grade e o Personalizar](parte-1-grade-e-personalizar.md) | O topo da Home, a grade, o modo de edição, o catálogo, o menu "⋯" de cada widget e os estados de cada widget | | É a base: as outras partes são widgets e ações dentro dela |
| [2. Widgets de tarefas](parte-2-widgets-de-tarefas.md) | Os 13 widgets das lâminas do Painel de tarefas e o "Minhas tarefas · Workspace" só do administrador | 1 | São as lâminas que a Home de hoje já mostra |
| [3. Minhas tarefas](parte-3-minhas-tarefas.md) | O widget com as tarefas da pessoa em 4 abas por prazo, Concluir e Adicionar tarefa | 1 | Junta os 3 cartões de tarefa da Home de hoje |
| [4. Categorias](parte-4-categorias.md) | O widget Categorias: acessar, criar item pelo "+", escolher quais e em que ordem | 1 | O "+" abre o mesmo modal de criação da parte 5 |
| [5. Botão Criar](parte-5-botao-criar.md) | O botão Criar com Item, Tarefa e Pedir ao BENI, e a tecla C | | Corre em paralelo com as partes 1 a 4 |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Uma categoria só aparece na Home de uma pessoa que tem acesso à categoria. | Quem não acessa Contratos não vê Contratos no widget Categorias nem no Criar. | Obrigatório |
| RN902 | O administrador do workspace é o membro com o tipo `full` ou `owner`. | Um membro comum não vê o controle "Minhas tarefas · Workspace". | Obrigatório |

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
| S1 | A Home de cada pessoa fica guardada no navegador, como a Home de hoje guarda a disposição das lâminas. Noutro navegador ou aparelho, a pessoa vê a Home padrão. | produto | Guardar no servidor é o épico Home padrão do workspace |

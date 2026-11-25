# Épico: Home padrão do workspace

**O que é:** o administrador monta a Home padrão do workspace, que cada membro recebe enquanto não arruma a própria. O
widget que o administrador acrescenta chega também a quem já personalizou, com o selo "Novo". A Home de cada pessoa
passa a ficar guardada no workspace e segue a pessoa em qualquer navegador.

**Onde vale:** o modo de edição da Home (Personalizar) e a Home de cada membro.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão" e "Administrador"
em "Papel". Os textos nos 3 idiomas estão no `textos.ts` de
https://github.com/pernalombr4/prototipos/tree/main/app/pages/home. A barra de baixo é ferramenta de revisão e não
entra no produto.

**Fora do escopo:** Home padrão diferente por cargo ou por grupo.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Guardar a Home no workspace](parte-1-guardar-a-home.md) | O lugar no back da Home padrão do workspace e da Home de cada pessoa | o épico Home em widgets, com Categorias e tarefas | Hoje nenhum campo guarda a disposição da Home fora do navegador |
| [2. Editar a Home padrão](parte-2-editar-a-home-padrao.md) | O "Editando: Minha Home · Home padrão do workspace", o aviso de edição e o selo "Novo" | 1 | Precisa do lugar onde a Home padrão fica |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Só o administrador do workspace (membro com o tipo `full` ou `owner`) edita a Home padrão. | O membro comum não vê o seletor "Editando". | Obrigatório |
| RN902 | Quem não personalizou a Home recebe a Home padrão inteira, na ordem e no tamanho em que o administrador a salvou. | O administrador tira Prioridade da Home padrão; quem nunca personalizou deixa de ver Prioridade. | Obrigatório |

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

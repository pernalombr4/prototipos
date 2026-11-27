# Épico: personalizar o meu menu

**O que é:** cada pessoa arruma a própria navegação: o que fica na trilha e em que ordem, o que aparece no Início,
quantos itens cada seção mostra e as próprias seções, com menus e submenus. A preferência fica guardada para a pessoa
no servidor e vale em qualquer navegador. Nada muda no menu dos outros.

**Onde vale:** a trilha, o painel do Início, a grade "Mais", o botão direito da trilha e a janela "Personalizar".

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, cenário "Em uso" do andaime "Estado", aprovado
em 2026-11-27. Os textos em português, inglês e espanhol estão no protótipo, pelo seletor de idioma.

**Fora do escopo:** mudar o menu do workspace, que todo mundo vê, e "Salvar para todos" (épico Arrumar o menu do
workspace na própria barra).

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Preferências guardadas e a janela Personalizar](parte-1-janela-personalizar.md) | A preferência de navegação guardada por pessoa e a janela "Personalizar", com "Salvar" e "Descartar" | | É a base: as outras partes gravam aqui |
| [2. Trilha, Início e quantos itens cada seção mostra](parte-2-trilha-inicio-e-limite.md) | O que fica na trilha e no Início, ocultar, a ordem das categorias e "Mostrar na seção" | 1 | Usa a preferência e a janela |
| [3. Seções pessoais](parte-3-secoes-pessoais.md) | As seções do Início que cada pessoa cria, com menus e submenus | 1 | É a parte maior e a que menos as outras usam |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Cada preferência deste épico vale só para quem a fez. Fora da janela Personalizar, vale na hora; dentro dela, vale quando a pessoa salva. | Ana tira Auditoria da trilha e salva; a trilha de Bruno não muda. | Obrigatório |
| RN902 | O Início não sai da trilha nem muda de posição nela. | O Início não tem "Tirar da trilha". | Obrigatório |
| RN903 | O menu tem no máximo 3 níveis: seção, menu e submenu. Submenu não recebe submenu, e o menu que tem submenus não vira submenu. | Políticas internas, com o submenu Base de Conhecimento, não entra em outro menu. | Obrigatório |
| RN904 | Só o menu que o workspace criou recebe submenu. Destino nativo, tela nativa, tela de módulo e categoria só ficam numa seção. | Relatórios, Logs de auditoria e Tarefas > Painel não recebem submenu. | Obrigatório |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone e caixa de marcar com nome acessível, modal com título e descrição, foco visível no teclado. Todo arraste tem caminho de teclado: Alt com as setas ou "Mover" num menu. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Seção pessoal | Seção do Início que só a pessoa que criou vê | o nome que a pessoa deu |
| Submenu | Menu dentro de outro menu, no 3º nível | o nome do menu |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | "Seção" quer dizer 2 coisas: a seção pessoal do Início (este épico) e a seção do menu do workspace. Os 2 nomes ficam iguais? | produto | Os textos de "Criar seção" nos 2 épicos. |
| P902 | A largura do painel, hoje guardada no navegador, passa a seguir a pessoa nesta preferência? | produto | A parte 1 guarda a largura. |

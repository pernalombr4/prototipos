# Épico: Nova tela de workspaces

**O que é:** a tela `/workspaces`, a primeira depois do login, passa a servir só para escolher onde entrar. A pessoa
entra no workspace dela em 1 clique, arruma a lista do jeito dela (favoritos, padrão, ocultos e etiquetas) e cria
workspace num modal de 2 passos, que pode começar de um caso de uso.

**Onde vale:** a tela `/workspaces` e o modal "Criar workspace", que abre sobre ela.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces, aprovado em 14/10/2026 e revisado até
20/10/2026. Os textos nos 3 idiomas estão no `textos.ts` de
https://github.com/pernalombr4/prototipos/tree/main/app/pages/tela-de-workspaces. A barra inferior do protótipo
(estado, tema, idioma, "Por trás") é ferramenta de revisão e não entra no produto.

**Fora do escopo:** a barra do topo (ENSPACE, Suporte, avatar), que continua como está; etiquetas compartilhadas com
outras pessoas; criar, importar e exportar caso de uso.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Escolher e entrar](parte-1-escolher-e-entrar.md) | Cabeçalho, card, lista, aba "Todos", ordem por criação e por nome e a tela sem workspace. Usa só o que a API já tem | | Substitui a tela de hoje sem mudar a API; é a base das outras |
| [2. Buscar e aceitar convite](parte-2-buscar-e-aceitar-convite.md) | A busca com os atalhos e o convite pendente no topo, no card e na lista | 1 | Fica fora da base porque o nome de quem convidou pode pedir mudança na API; as partes 4, 6 e 7 usam a busca |
| [3. Menu "⋯", sair e excluir](parte-3-menu-sair-e-excluir.md) | O menu "⋯" do card e da linha, com "Sair do workspace" e, para o proprietário, "Excluir workspace" | 1 | O menu é a porta do padrão, dos ocultos e das etiquetas |
| [4. Recentes e favoritos](parte-4-recentes-e-favoritos.md) | Último acesso, abas "Favoritos" e "Recentes", estrela, ordem por acesso e o bloco do topo "Continue de onde você parou" | 1 e 2 | O bloco do topo nasce aqui; a parte 5 só troca o que ele mostra |
| [5. Workspace padrão](parte-5-workspace-padrao.md) | "Abrir sempre ao entrar", o padrão no bloco do topo e o login direto no workspace | 3 e 4 | Precisa do menu e do bloco do topo |
| [6. Ocultos](parte-6-ocultos.md) | Ocultar pelo menu, o botão "Visibilidade" e a seção "Ocultos" no fim da lista | 2 e 3 | Vem depois da 5: ocultar o padrão desfaz o padrão |
| [7. Agrupar e etiquetas](parte-7-agrupar-e-etiquetas.md) | Agrupar por licença e por etiqueta, grupos recolhíveis, os 2 modais de etiqueta e a busca por etiqueta | 2 e 3 | Agrupar respeita a ordem e a seção "Ocultos" das partes anteriores |
| [8. Criar workspace, passo 1](parte-8-criar-passo-1.md) | O modal "Criar workspace" com nome, descrição, referência e identidade (cor, iniciais, ícone e imagem) | | Abre pelo botão "Criar workspace", que já existe; corre em paralelo com as partes 2 a 7 |
| [9. Criar com caso de uso](parte-9-criar-com-caso-de-uso.md) | O passo 2 do modal: a Central de casos de uso, "Criar do zero" e "Criar com {caso}" | 8 e o catálogo de casos de uso | O catálogo de casos de uso com prints ainda não existe |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | A cor de identidade é a soma dos códigos dos caracteres de um texto, resto da divisão por 5, na ordem fúcsia (0), ciano (1), roxo (2), verde-azulado (3) e `space` (4). O card calcula sobre a `reference`; a criação sugere sobre o nome. | O mesmo workspace tem a mesma cor em cada visita à tela. | Obrigatório |
| RN902 | Cada pessoa tem no máximo 1 workspace padrão. | Com Grupo Aurora como padrão, só o bloco dele diz "Abre direto quando você entra". | Obrigatório |
| RN903 | Um workspace oculto sai da lista, das abas e de cada contagem da tela; a pessoa continua com acesso, e a busca o encontra. | Ocultar um workspace tira 1 da aba "Todos"; buscar o nome dele o mostra. | Obrigatório |
| RN904 | Um workspace deixa de ser o padrão quando a pessoa o oculta ou sai dele. | Depois de ocultar o padrão, o bloco do topo volta a "Continue de onde você parou". | Obrigatório |

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
| Exceção deste épico | A paleta de identidade (RN901) é a única cor fixa. O branco sobre a cor primária da marca (`#FF04D1`) dá 3,39:1 nos botões de cor cheia; mudar é decisão de marca. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Bloco do topo | Destaque acima da lista com 1 workspace e o botão "Entrar em {nome}" | "Continue de onde você parou", "Seu workspace" ou "Abre direto quando você entra" |
| Workspace padrão | O workspace que abre direto depois do login, sem passar por esta tela | "Abre ao entrar" |
| Oculto | Workspace que a pessoa tirou da própria lista sem perder o acesso | "Oculto" |
| Etiqueta pessoal | Marcador que só a pessoa vê, usado para agrupar os workspaces dela | "Etiquetas" |
| Convite pendente | Workspace para o qual a pessoa foi convidada e ainda não aceitou | "Convite pendente" |
| Cor de identidade | A cor do ícone do workspace, calculada pela RN901 | (sem nome na tela) |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | Cada parte pode ir ao cliente quando fica pronta, ou o épico sai inteiro? Hoje cada parte deixa a tela usável. | produto | Saindo por parte, as partes 1 e 8 respondem às perguntas de lançamento parcial delas; saindo inteiro, essas perguntas caem |
| P902 | A Central de casos de uso aparece em 3 protótipos: este (parte 9), o `menu-lateral` e a `galeria-de-casos-de-uso`. Os requisitos dela passam a morar num lugar só? | produto | A parte 9 passa a usar o documento único da Central |
| P903 | O aviso de convite (parte 2) tem "Aceitar convite" de cor cheia, e o bloco do topo (parte 4) pede "Entrar em {nome}" como o único botão de cor cheia fora dos estados vazio e de erro. Qual vale com os 2 na tela? | redatora | Muda a variante de "Aceitar convite" ou a do botão do bloco do topo |
| P904 | A cor escolhida na criação (parte 8) fica guardada e vale no card, ou o card recalcula a cor pela `reference` (RN901)? Hoje o campo `icon` guarda só o ícone ou o logo. | produto e dev | Se fica guardada, o workspace passa a guardar a cor, e o card lê a cor guardada |

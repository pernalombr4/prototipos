# Requisitos: o widget "Seus projetos" na tela Início

**Objetivo:** a tela Início mostra os projetos do menu da pessoa num bloco a mais, ao lado do conteúdo que ela já
tem. A Início continua sendo a Início: "Seus projetos" é 1 dos blocos dela.

**Onde vale:** tela Início, nas 2 formas que ela pode ter quando Projetos for lançado: em widgets, como propõe o
protótipo home, ou como a Início de hoje, sem widgets. Faz parte do MVP de Projetos.

**Depende de:** quando a Início estiver em widgets, do épico "Home em widgets, com Categorias e tarefas" do protótipo
home (a grade e o Personalizar).

**Protótipo:** https://pernalombr4.github.io/prototipos/projetos/, rodada 16, tela Início. Os textos nos 3 idiomas
estão em `app/pages/projetos/textos.ts`, grupo `inicio`.

**Fora do escopo:** a situação do projeto (Status do projeto) no widget; ordenar ou filtrar os projetos dentro do
widget.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN801 | "Seus projetos" é 1 bloco da tela Início. O conteúdo que a Início já mostra continua nela. | Início em widgets: "Seus projetos" ao lado de "Minhas tarefas" e "Categorias". | Obrigatório |
| RN802 | Os projetos de "Seus projetos" são os projetos ativos que estão no menu lateral da pessoa, na ordem do menu. | Rita com Financeiro, Jurídico e Obra Aurora no menu vê os 3, nessa ordem. | Obrigatório |

## Onde o bloco entra (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF801 | Se a tela Início usa widgets, "Seus projetos" deve ser 1 widget do catálogo da Início (RN801). | O widget aparece no Personalizar e se adiciona, se move e se tira como os outros. | Essencial | Obrigatório |
| RF802 | Se a tela Início não usa widgets, "Seus projetos" deve ser 1 seção da tela, abaixo da saudação (RN801). | A saudação e o resto do conteúdo da Início continuam na tela. | Essencial | Obrigatório |

## O conteúdo do bloco (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF803 | O bloco deve listar cada projeto de RN802 com o ícone, o nome e o número de categorias. | Exemplo: "Financeiro, 3 categorias". | Essencial | Obrigatório |
| RF804 | O clique num projeto do bloco deve abrir a página do projeto, na Visão geral. | Clicar em Financeiro abre a Visão geral do Financeiro. | Essencial | Obrigatório |
| RF805 | Quando a pessoa vê ao menos 1 projeto no workspace, o bloco deve ter o botão "Ver todos os projetos", que abre a tela "Todos os projetos". | Pessoa sem nenhum projeto visível não vê o botão. | Importante | Desejável |
| RF806 | Se o workspace não tem projeto e a pessoa é Proprietário ou Full, o bloco deve mostrar "Este workspace ainda não tem projetos" e o botão "Criar projeto". | O botão abre a janela Criar projeto. | Importante | Desejável |
| RF807 | Se a pessoa não tem projeto no menu e não está no caso de RF806, o bloco deve mostrar "Os projetos de que você participa aparecem aqui quando você os mostra no menu." | Participante que ocultou todos os projetos do menu vê o texto. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S1 | O bloco segue a ordem do menu lateral da pessoa (RN802). | redatora | RN802 |
| P1 | O bloco tem um número máximo de projetos, com "Ver todos os projetos" para o resto? Hoje o protótipo mostra todos os do menu. | redatora | RF803, RF805 |
| P2 | Quando a Início estiver em widgets, "Seus projetos" entra na Início padrão de quem ainda não personalizou? | redatora e o épico "Home em widgets" | RF801 |

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

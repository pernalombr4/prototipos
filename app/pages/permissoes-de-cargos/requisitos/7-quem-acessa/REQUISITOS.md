# Requisitos: Quem acessa

**Objetivo:** o administrador compara, dentro do Ajustar, o que cada cargo do workspace faz na categoria, sem abrir a
tela de cada cargo.

**Depende de:** épico "Tela nova de permissões", onde fica o Ajustar.

**Onde vale:** o botão Ajustar da linha da categoria, aba Quem acessa.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. Em qualquer categoria, clique em
Ajustar › Quem acessa.

**Fora do escopo:** mudar outro cargo por esta aba.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Quem acessa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | O Ajustar deve ter a aba "Quem acessa", com a quantidade de cargos do workspace no rótulo da aba. | O workspace com 7 cargos mostra "Quem acessa" com 7. | Importante | Desejável |
| RF502 | A aba deve mostrar 1 linha por cargo, com as colunas Cargo, Pessoas, Criar, Ver, Atualizar e Excluir, e "Tem" ou "Não tem" em cada ação. | O cargo "Financeiro" mostra "Tem" em Ver e "Não tem" em Excluir. | Importante | Desejável |
| RF503 | A primeira linha deve ser o cargo aberto, com o rótulo "Este cargo" e as alterações ainda não salvas. | Marcar Excluir na tabela mostra "Tem" em Excluir na linha "Este cargo". | Importante | Desejável |
| RF504 | A chave "Esconder cargos iguais a este" deve deixar só os cargos que diferem do cargo aberto em ao menos 1 ação. | Sem cargo diferente, a aba mostra "Todos os cargos fazem o mesmo que este.". | Desejável | Opcional |
| RF505 | A aba deve mostrar a frase "O que cada cargo do workspace faz nesta categoria. Para mudar outro cargo, abra a tela dele.". | A frase aparece acima da tabela, e a aba só mostra "Tem" e "Não tem", sem caixa de marcar. | Importante | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI501 | `GET /ws/roles` e `GET /ws/roles/{id}/permissions` | Os cargos do workspace e as permissões de cada um dão as linhas da aba. | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P501 | Com muitos cargos, ler as permissões de cada um ao abrir a aba fica lento? | dev do back | Lento, a aba pede uma rota que devolva as permissões de todos os cargos para 1 categoria, e este épico passa a pedir essa rota ao back |

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

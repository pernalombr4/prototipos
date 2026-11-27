# Épico: arrumar o menu do workspace na própria barra

**O que é:** quem configura o workspace arruma o menu de todos direto na barra: submenu (3º nível), botão direito,
arraste, excluir e criar menu e categoria. Toda mudança fica num rascunho até "Salvar para todos" ou "Salvar só para
mim". Configurações > Interface > Menus passa a abrir a árvore inteira do menu.

**Onde vale:** as linhas, os títulos de seção e os ícones de seção do menu do workspace, o "+" do Início, a janela
"Criar menu" e Configurações > Interface > Menus.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, cenário "Em uso" do andaime "Estado", aprovado
em 2026-11-27. Os textos em português, inglês e espanhol estão no protótipo, pelo seletor de idioma.

**Fora do escopo:** casos de uso e importação; o dashboard no menu da categoria; os formulários de criar item e
tarefa, que são os do produto.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Submenu e rascunho](parte-1-submenu-e-rascunho.md) | A árvore de 3 níveis no menu do workspace, o rascunho, "Salvar para todos" e "Salvar só para mim" | | É a base mais difícil: cada gesto das outras partes grava no rascunho |
| [2. Botão direito](parte-2-botao-direito.md) | O menu de ações de cada linha e de cada título de seção: mover, renomear, tirar da seção | 1 | O caminho mais simples para mudar o menu |
| [3. Arrastar](parte-3-arrastar.md) | O arraste no menu do workspace, com as regras de encaixe e a recusa com o motivo | 1 | Mais trabalhoso que o botão direito; usa o mesmo rascunho |
| [4. Excluir](parte-4-excluir.md) | Excluir seção, menu e submenu do workspace, no rascunho | 1 e 2 | Entra no menu de ações da parte 2 |
| [5. Criar menu e criar categoria](parte-5-criar-menu-e-categoria.md) | O "+" do Início e a janela "Criar menu", que cria o menu e a tela juntos | 1 | Pede rota nova no back |
| [6. Editor de menus](parte-6-editor-de-menus.md) | Configurações > Interface > Menus com a árvore inteira | 3 e 5 | Usa o arraste e a janela "Criar menu" |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Só quem tem licença Owner ou Full muda o menu do workspace de cada membro. | Membro com licença Basic só tem "Salvar só para mim". | Obrigatório |
| RN902 | O menu tem no máximo 3 níveis: seção, menu e submenu. Submenu não recebe submenu, e o menu que tem submenus não vira submenu. | Painel de vendas, com o submenu Metas do trimestre, não entra em outro menu. | Obrigatório |
| RN903 | Só o menu que o workspace criou recebe submenu. Destino nativo, tela nativa, tela de módulo e categoria só ficam numa seção. | Relatórios, Logs de auditoria e Tarefas > Painel não recebem submenu. | Obrigatório |
| RN904 | Os itens de Integrações e de Configurações têm ordem fixa e não mudam de lugar. | Apps, Credenciais e Webhooks ficam nessa ordem em todo workspace. | Obrigatório |
| RN905 | O menu é a tela: cada menu tem 1 tela, e uma tela não mora em 2 menus. | Pôr Minhas requisições dentro de Triagem de propostas tira o menu de onde estava. | Obrigatório |
| RN906 | O menu dentro de uma seção do workspace é do workspace, como a seção; o nativo levado para uma seção do workspace continua nativo. | Painel de vendas, em Comercial, é do workspace; Logs de auditoria levado para Comercial continua nativo. | Obrigatório |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone e caixa de marcar com nome acessível, modal com título e descrição, foco visível no teclado. Todo arraste tem caminho de teclado: Alt com as setas ou "Mover para" no menu de ações. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. Os formulários de criar, editar e renomear têm a mesma largura e o mesmo rodapé. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Rascunho | As mudanças no menu do workspace que ainda não foram salvas | "Alterações não salvas" |
| Versão pessoal | O menu do workspace que a pessoa salvou só para si | "Este menu é só seu." |
| Submenu | Menu dentro de outro menu, no 3º nível | o nome do menu |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | Quem salvou para todos fica registrado no log de auditoria? | produto | Um RF de registro na parte 1. |
| P902 | Se 2 administradores salvam para todos ao mesmo tempo, qual rascunho vale? | dev | Um RF de conflito ao salvar na parte 1. |

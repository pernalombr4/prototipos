# Épico: casos de uso e importação de menu

**O que é:** quem configura o workspace monta menus a partir de um caso de uso pronto, do ENSPACE ou do próprio
workspace, e leva o menu de um workspace para outro por arquivo. O que entra vai para o rascunho do menu, como as
outras mudanças.

**Onde vale:** o pé do "+" do Início, a Central de casos de uso, a janela "Importar" e Configurações > Interface > Casos
de uso.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, "+" do Início > "Casos de uso", aprovado em
2026-11-27. Os textos em português, inglês e espanhol estão no protótipo, pelo seletor de idioma.

**Fora do escopo:** a migração de workspace que compara categoria por categoria (protótipo `migracao-de-workspace`).
Os casos de uso, os números de uso e as miniaturas do protótipo são dado de maquete.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Exportar o meu menu](parte-1-exportar.md) | O arquivo do menu de hoje, com formato e versão próprios | | Define o arquivo que as outras partes leem |
| [2. Central de casos de uso e usar caso de uso](parte-2-central-e-usar.md) | A Central, o detalhe do caso, "Usar caso de uso" e "Adicionar ao workspace" | 1 | O caso de uso aplicado usa o mesmo conteúdo do arquivo |
| [3. Criar caso de uso](parte-3-criar-caso-de-uso.md) | O caso criado a partir do menu de hoje, com as imagens da galeria | 2 | O caso criado aparece na Central |
| [4. Importar o arquivo do menu](parte-4-importar.md) | A janela "Importar", que lê o arquivo de outro workspace e soma ou substitui | 1 e 2 | Usa o arquivo da parte 1 e a escolha somar ou substituir da parte 2 |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Só quem tem licença Owner ou Full usa, importa, exporta ou cria caso de uso. | Membro com licença Basic vê "Importar" e "Casos de uso" desligados. | Obrigatório |
| RN902 | O que um caso de uso ou um arquivo aplica entra no rascunho do menu do workspace e só muda o menu dos outros depois de "Salvar para todos". | Usar um caso acende "Alterações não salvas". | Obrigatório |
| RN903 | Ao aplicar um caso ou importar um arquivo, a pessoa escolhe entre somar ao menu de hoje ou substituir o menu de hoje. | Somar mantém Comercial; substituir tira Comercial. | Obrigatório |
| RN904 | O arquivo e o caso de uso levam a estrutura dos menus e das categorias, sem dado de item. | O arquivo de "Jurídico" leva as categorias e os campos, sem nenhum contrato. | Obrigatório |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1, também nos pontos da galeria no tema escuro. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a Central carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone com nome acessível, modal com título e descrição, foco visível no teclado. Somar e substituir são um grupo de opções com papel `radiogroup`. Cada ponto e cada seta da galeria tem nome para o leitor de tela. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. As janelas de usar, criar e importar têm a largura e o rodapé dos outros formulários do menu; a Central ocupa a tela. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | A importação pelo menu e a de Configurações (protótipo `migracao-de-workspace`) devem ter as mesmas opções? Lá são 3 (adicionar o que falta, atualizar e adicionar, substituir tudo); aqui são 2. | produto | As partes 2 e 4 ganham a terceira opção. |
| P902 | Usar um caso ou importar um arquivo cria também os campos e os status das categorias, ou só os menus e as categorias? No protótipo, campos e status não são criados. | produto | As partes 2 e 4 ganham campos e status. |

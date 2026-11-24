# Épico: Permissões de cargos, regras novas no back

**O que é:** o cargo ganha 3 regras que o back ainda não aplica. A primeira é um padrão que vale para toda categoria
sem regra própria, inclusive as criadas depois. A segunda trata os itens sem formulário como mais uma origem da
categoria, e o que a pessoa vê passa a depender só de Ver. A terceira permite que Ver, Atualizar e Excluir valham só
nos itens que a pessoa criou ou em que ela é a responsável. Cada regra pede mudança no back e aparece na tela nova de
permissões do cargo.

**Onde vale:** Configurações > Gestão de membros > Cargos > o cargo, aba Dados, e a listagem, a criação, a edição e a
exclusão de itens em toda porta: a tela, a API, a importação, o Spaceflow, os agentes de IA e as tarefas de formulário.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, aprovado em 24/11/2026. Os textos nos
3 idiomas estão no arquivo de textos da pasta do protótipo:
https://github.com/pernalombr4/prototipos/tree/main/app/pages/permissoes-de-cargos. A barra "Protótipo" no pé da tela
é ferramenta de revisão e não entra no produto.

**Fora do escopo:** a tabela de categorias, Ajustar › Campos e Formulários, as permissões fixas, a confirmação e Quem
acessa, que são do épico "Permissões de cargos: a tela nova com o que já existe". Este épico parte da tela desse
épico e só acrescenta.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Itens sem formulário e ações por formulário](parte-1-itens-sem-formulario.md) | A origem "Itens sem formulário", a listagem que só olha o Ver, Criar, Atualizar e Excluir por formulário valendo em toda porta e a ação inteira que inclui o formulário criado depois | | Resolve hoje 2 casos que se contradizem: o agente de IA cujos itens somem e a categoria com Cível e Criminal |
| [2. Padrão para todas as categorias](parte-2-padrao.md) | A linha do padrão, a categoria que segue o padrão, a regra própria, o desfazer por caixa e o contador de exceções | | Corre em paralelo; é a base do padrão da parte 3 |
| [3. Quais itens: criador e responsável](parte-3-quais-itens.md) | A coluna e a aba Quais itens, as regras de criador e de responsável e o filtro "Só alguns itens" | 2, só para a regra no padrão | Pede a regra mais nova no back; a regra na categoria sai sem a parte 2 |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | O que a pessoa vê numa categoria depende só de Ver. Criar, Atualizar e Excluir, na categoria, no formulário ou com regra de itens, não mudam a listagem. | Com Ver em toda a categoria e Criar só no formulário Cozinha, a pessoa vê os itens de Cozinha, de Quintal e os sem formulário. | Obrigatório |
| RN902 | Criar pode valer sem Ver. Atualizar e Excluir só valem onde Ver vale. | Numa categoria de denúncias, o cargo com Criar e sem Ver cria a denúncia e não vê nenhuma. | Obrigatório |

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
| Exceção deste épico | Herdado do padrão, regra própria e regra de itens nunca dependem só de cor: o tom vem com o texto "Segue o padrão", o selo "Regra própria" e o ícone com dica. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Origem | De onde o item veio: um formulário da categoria ou nenhum | Os formulários e "Itens sem formulário" |
| Item sem formulário | Item gravado sem formulário: criado pelo formulário padrão, pela API, por importação, pelo Spaceflow ou por agente de IA | "Itens sem formulário" |
| Padrão | As permissões que valem para cada categoria sem regra própria | "Padrão para todas as categorias" |
| Regra própria | As permissões gravadas numa categoria, que vencem o padrão | "Regra própria" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | A correção do card USE87A7C6, na develop desde 16/11/2026, mostra os itens sem formulário a todo cargo com Ver na categoria. A parte 1 substitui essa correção? | dev do back | Substituindo, a correção sai antes de ir para produção, e a parte 1 cobre os 2 casos |
| P902 | As 3 partes são objetivos que se lançam sozinhos. Viram 3 épicos? | produto | Em 3 épicos, cada um ganha o próprio card e o seu documento |
| P903 | Como migrar os cargos gravados pela árvore de hoje? | produto e dev do back | Cada parte tem a sua regra de transição (RT); a resposta decide se a migração roda de uma vez ou ao salvar o cargo |

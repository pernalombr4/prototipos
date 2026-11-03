# Épico: Filtros da tela de itens

**O que é:** a pessoa filtra a lista sem abrir modal nem gaveta. O filtro de 1 campo é um chip numa linha de filtros
abaixo da barra de ferramentas; quando 1 campo não basta, as regras com E, Ou e grupos ficam no filtro avançado, que tem
construtor próprio. O funil da coluna abre o chip, o título da coluna ganha um menu, e o construtor de visualização
monta os filtros sem o 2º modal.

**Onde vale:** a tela nova de itens de cada categoria (`/workspaces/<ws>/types/<categoria>`) e, com a mesma lógica, as
telas Tarefas Rápidas (`/tasks/quick`) e Tarefas Agendadas (`/tasks/scheduled`), com os campos e os filtros automáticos
da RN009.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens, estilo "Proposta", em revisão
desde 23/10/2026 (rodada 7). Os textos nos 3 idiomas estão no `textos.ts` de
https://github.com/pernalombr4/prototipos/tree/main/app/pages/visualizacoes-da-tela-de-itens. A barra inferior do
protótipo (Estilo, Visualizações, Perfil, Tela, tema e idioma) é ferramenta de revisão e não entra no produto.

**Fora do escopo:** a busca "Pesquisar registros" e o período ("Criado em", "Todo o período"); guardar o filtro na
visualização (alteração não salva, barra flutuante e salvar), que é do épico "Criar, configurar e salvar
visualização"; a barra de visualizações, que é do épico "Barra de visualizações".

**Prioridade e relevância** (nas tarefas, entre parênteses no fim de cada requisito): a prioridade é Essencial,
Importante ou Desejável. A relevância diz o que o dev pode deixar de fazer: Obrigatório, o dev faz. Desejável, o dev
faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande
para o ganho.

## Como é hoje

Conferido pela tela na branch do PR 2936, no workspace de exploração, em 23/10/2026.

| # | Onde | O que acontece | Evidência |
|---|---|---|---|
| H1 | Título de cada coluna da tabela | Seta de ordenar, funil e alfinete de fixar a coluna. O funil abre "Filtrar <campo>" com "+ Adicionar Filtro"; cada regra é uma frase ("É totalmente Igual a <valor>") com o botão de confirmar, e só vale depois de confirmada. Com filtro, o funil ganha um ponto. | [develop-06](../../evidencias/develop-06-funil-da-coluna.jpg) |
| H2 | Funil de um campo de texto | 6 condições: "Igual", "Diferente", "Contém", "Não contém", "Contém (case sensitive)" e "Não contém (case sensitive)". | [develop-06](../../evidencias/develop-06-funil-da-coluna.jpg) |
| H3 | Mais de 1 regra no mesmo campo | A 2ª regra aparece embaixo da 1ª, sem conector visível (nem E nem Ou). | sem evidência visual: a 2ª regra só aparece depois de confirmar a 1ª, e a tabela fica vazia no workspace de exploração |
| H4 | Barra de ferramentas, ícone de filtros | Abre a gaveta "Filtros por campo" à esquerda ("Os mesmos filtros da tabela"), com 1 seção por campo e o nome técnico "reference". Campo de seleção filtra por caixas, com "Buscar opções..." e "Todos". | [develop-07](../../evidencias/develop-07-gaveta-de-filtros.jpg) |
| H5 | Filtro aplicado pela tabela | O funil e o ícone de filtros ganham um ponto, e um ícone vermelho de limpar filtros aparece ao lado do período. Nenhum controle grava esse filtro na visualização. | sem evidência visual: conferido na tela; o print mostraria a tabela vazia |
| H6 | Construtor de visualização, seção Filtros | "Filtros Automáticos" ("isOwner", "inGroups") e "Filtros por Campos Personalizados", cada um com "Adicionar", que abre um 2º modal. | [develop-02](../../evidencias/develop-02-filtro-automatico.jpg) |
| H7 | 2º modal "Adicionar Filtro" | "Campo", "Operação" e "Valor" em texto livre. A operação tem as mesmas 10 opções para cada campo: "Igual", "Diferente", "Menor", "Maior", "menor ou Igual", "Maior ou igual", "Contém", "não contém", "Inclui um dos" e "Não inclui nenhum dos". | [develop-08](../../evidencias/develop-08-filtro-da-visualizacao.jpg) |
| H8 | Dado da visualização | `filters.field_filters`, uma lista de `{field, op, value}` em que cada filtro vale junto com os outros, e `filters.quick_filters`. | `@be-enlighten/enspace-sdk-schemas`, `ModelView` |
| H9 | Busca da API | `_where` aceita `_and`, `_or` e `_nor` aninhados, e os operadores `_lt`, `_lte`, `_gt`, `_gte`, `_ne`, `_in`, `_nin`, `_contains`, `_ncontains`, `_containss`, `_ncontainss` e `_null`. | `@be-enlighten/enspace-sdk-schemas`, `EnlightenQueryWhere` |

## O que muda na lógica

| Hoje | Proposta | Parte |
|---|---|---|
| O filtro da tabela (funil, gaveta) e o filtro salvo na visualização são 2 coisas; o da tabela não se grava (H5). | Um filtro só: o que se aplica na tela é alteração não salva da visualização ativa e se salva nela pela barra flutuante. | épico "Criar, configurar e salvar visualização", parte "1. Alterações não salvas e salvar" |
| As regras do mesmo campo aparecem sem conector (H3); campos diferentes valem juntos (H8). | Os chips valem juntos (1 chip por campo). O filtro avançado tem conector explícito, E ou Ou, e grupos de 1 nível. Os filtros automáticos, os chips e o filtro avançado valem juntos (RN007). | 1. Linha de filtros e chip por campo; 3. Filtro avançado |
| A condição não depende do tipo do campo no construtor (H7); o valor é texto livre. | A condição e o valor seguem o tipo do campo (RN008). | 1. Linha de filtros e chip por campo |
| "Inclui um dos" e "Não inclui nenhum dos" com valor digitado (H7). | "É" e "Não é" com 1 ou mais opções marcadas em caixas; marcar várias vale como "qualquer uma". | 1. Linha de filtros e chip por campo |
| A regra só existe depois de confirmada (H1). | O chip e a regra sem valor existem, não filtram e não contam no resultado, nem dentro de um grupo "Ou". | 1. Linha de filtros e chip por campo; 3. Filtro avançado |
| Não há data relativa. | "Nos próximos N dias", recalculada a cada abertura. | 1. Linha de filtros e chip por campo |
| `field_filters` guarda uma lista (H8). | Além da lista, a visualização guarda a árvore do filtro avançado. | 3. Filtro avançado |

## O que muda na tela

| Hoje | Proposta | Parte |
|---|---|---|
| Filtro aplicado só aparece como ponto no funil e no ícone (H5). | Cada filtro aparece na linha de filtros, como chip, e o filtro avançado como "N regras". | 1. Linha de filtros e chip por campo; 3. Filtro avançado |
| O ícone de filtros abre a gaveta "Filtros por campo" (H4). | A gaveta sai. O botão Filtros mostra a linha de filtros com "+ Filtro" aberto. | 1. Linha de filtros e chip por campo |
| Nome técnico ("reference", "isOwner", "inGroups") (H4, H6). | Rótulo legível. | 1. Linha de filtros e chip por campo; 4. Filtros no construtor de visualização |
| O funil do título abre "Filtrar <campo>" com regras em frase (H1). | O funil abre o chip do campo. O botão direito no título abre o menu da coluna, com ordenar, filtrar e ocultar. | 2. Menu da coluna |
| Não há filtro avançado. | Construtor com "Onde", "E" ou "Ou", grupos, "Duplicar", "Transformar em grupo" e "Desfazer o grupo". | 3. Filtro avançado |
| No construtor de visualização, "Adicionar" abre um 2º modal por filtro (H6, H7). | A seção Filtros tem os filtros automáticos em chaves, as linhas por campo e o construtor do filtro avançado, sem modal. | 4. Filtros no construtor de visualização |

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Linha de filtros e chip por campo](parte-1-linha-de-filtros-e-chip.md) | A linha de filtros com os filtros automáticos, 1 chip por campo e "+ Filtro"; a condição e o valor pelo tipo do campo; a gaveta "Filtros por campo" sai | | É a base: as outras partes abrem o chip ou moram na linha de filtros |
| [2. Menu da coluna](parte-2-menu-da-coluna.md) | O funil do título abre o chip do campo; o botão direito no título abre "Ordenar crescente", "Ordenar decrescente", "Filtrar" e "Ocultar coluna" | 1 | Precisa do chip; depende de onde o cabeçalho da tabela deixa pôr o menu |
| [3. Filtro avançado](parte-3-filtro-avancado.md) | O chip "N regras" e o construtor com "Onde", E ou Ou, grupos de 1 nível, "Duplicar", "Transformar em grupo" e "Desfazer o grupo" | 1 | Fica fora da base porque a visualização ainda não guarda a árvore de regras: pede mudança no dado da visualização |
| [4. Filtros no construtor de visualização](parte-4-filtros-no-construtor.md) | A seção Filtros do construtor de visualização sem 2º modal: os filtros automáticos em chaves, os filtros por campo em linhas e o construtor do filtro avançado | 1 e 3 | Usa a condição da parte 1 e o construtor da parte 3; vale no modal de hoje e no painel Configurar |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN007 | Os filtros automáticos, os filtros por campo e o filtro avançado de uma visualização valem juntos: o item aparece só quando passa em cada um deles. | "Status é Em análise" no chip e "Área é Jurídico" no filtro avançado mostram só os itens em análise do Jurídico. | Obrigatório |
| RN008 | As condições e o valor de cada tipo de campo são os da tabela a seguir. Política: Única. | Linha 4: um filtro de Vencimento oferece "Nos próximos", com o número de dias. | Obrigatório |
| RN009 | Os campos e os filtros automáticos de cada tela são os da tabela de parâmetros abaixo da RN008. Política: Única. | Linha 2: em Tarefas Rápidas, "+ Filtro" lista Prioridade, e "Atrasado" é um filtro automático. | Obrigatório |

Condições por tipo de campo (RN008). "Está vazio" e "Está preenchido" não pedem valor.

| Linha | Tipo do campo | Condições | Valor |
|---|---|---|---|
| 1 | Seleção e pessoa | "É", "Não é", "Está vazio", "Está preenchido" | 1 ou mais opções marcadas em caixas; marcar várias vale como "qualquer uma" |
| 2 | Texto | "Contém", "É", "Está vazio", "Está preenchido" | o texto digitado |
| 3 | Valor | "Maior ou igual a", "Menor ou igual a", "É" | o número |
| 4 | Data | "Nos próximos" (dias), "A partir de", "Até", "Está vazio", "Está preenchido" | o número de dias, em "Nos próximos"; a data, nas outras |

Parâmetros de cada tela (RN009).

| Linha | Tela | Campos que filtram | Filtros automáticos |
|---|---|---|---|
| 1 | Itens | os campos da categoria | "Só itens meus", "Só itens dos meus grupos" |
| 2 | Tarefas Rápidas | ID, Nome, Criado em, Data limite, Status, Permissões, Responsável, Responsável externo, Colaboradores, Prioridade, Descrição | "Minhas Tarefas", "Aberto", "Atrasado", "Atribuídos", "Tarefas Externas", "Tarefas Internas" |
| 3 | Tarefas Agendadas | ID, Status da Tarefa, Status de SLA, Responsáveis, Tipo, Referência do Item, Tarefa, Título, Descrição, Criado em, Data Limite, Concluído em, Concluído por, Nome do Fluxo, Etapa do Fluxo, Status do Item | os 6 da linha 2 |

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

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Linha de filtros | A faixa abaixo da barra de ferramentas que mostra cada filtro aplicado e o "+ Filtro" | (sem nome na tela) |
| Chip | O filtro de 1 campo na linha de filtros, que abre a condição e o valor | "<Campo>: <valor>" |
| Filtro automático | Filtro pronto da tela, ligado ou desligado | "Só itens meus", "Minhas Tarefas" |
| Filtro avançado | O conjunto de regras com conector E ou Ou e grupos | "N regras", "Filtro avançado" |
| Regra | 1 campo, 1 condição e 1 valor dentro do filtro avançado | (sem nome na tela) |
| Grupo | Regras juntas com conector próprio, dentro do filtro avançado | "Adicionar grupo" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P010 | Hoje, as regras do mesmo campo no funil e na gaveta aparecem sem conector (H3). Elas valem com E ou com Ou? | Time de back | Se valem com Ou, a migração dos filtros de hoje para o chip (parte 1) e para o filtro avançado (parte 3) muda |
| P013 | Os filtros aplicados hoje pelo funil e pela gaveta ficam guardados em algum lugar (endereço, sessão, visualização)? Na tela, nada oferece gravá-los na visualização. | Time de front | Define a migração para a alteração não salva do épico "Criar, configurar e salvar visualização" |
| P014 | Este épico pode ir ao cliente antes do épico "Criar, configurar e salvar visualização"? Antes dele, o filtro aplicado na linha de filtros vale só até a pessoa sair da tela, como hoje. | produto | Saindo antes, a linha de filtros guarda o filtro como o funil guarda hoje (P013) |
| P007 | O menu chama a tela de "Agendadas", e o título dela diz "Tarefas Programadas". Qual nome fica? | Mikaela | Muda o nome da tela na tabela de parâmetros da RN009 |

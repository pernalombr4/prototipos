# Épico: Filtros da tela de itens

**O que é:** a pessoa filtra a lista sem abrir modal nem gaveta. O filtro de 1 campo é um chip numa linha de filtros
abaixo da barra de ferramentas; quando 1 campo não basta, as regras com E, Ou e grupos ficam no filtro avançado, que tem
construtor próprio. O funil da coluna abre o chip, o título da coluna ganha um menu, e o construtor de visualização
monta os filtros sem o 2º modal. Os filtros rápidos são botões que a pessoa liga e desliga com 1 clique: os do sistema
aparecem em toda visualização, e a pessoa cria os próprios.

**Onde vale:** a tela nova de itens de cada categoria (`/workspaces/<ws>/types/<categoria>`) e, com a mesma lógica, as
telas Tarefas Rápidas (`/tasks/quick`) e Tarefas Agendadas (`/tasks/scheduled`), com os campos e os filtros automáticos
da RN009.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. Os textos nos 3 idiomas estão no `textos.ts` de
https://github.com/pernalombr4/prototipos/tree/main/app/pages/visualizacoes-da-tela-de-itens.

**Fora do escopo:** a busca "Pesquisar registros" e o período ("Criado em", "Todo o período"); guardar o filtro na
visualização (alteração não salva, barra flutuante e salvar), que é do épico "Criar, configurar e salvar
visualização"; a barra de visualizações, que é do épico "Barra de visualizações".

**Relevância** (no fim de cada requisito): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Linha de filtros e chip por campo](parte-1-linha-de-filtros-e-chip.md) | A linha de filtros com os filtros automáticos, 1 chip por campo e "+ Filtro"; a condição e o valor pelo tipo do campo; a gaveta "Filtros por campo" sai | | É a base: as outras partes abrem o chip ou moram na linha de filtros |
| [2. Menu da coluna](parte-2-menu-da-coluna.md) | O funil do título abre o chip do campo; o botão direito no título abre "Ordenar crescente", "Ordenar decrescente", "Filtrar" e "Ocultar coluna" | 1 | Precisa do chip; depende de onde o cabeçalho da tabela deixa pôr o menu |
| [3. Filtro avançado](parte-3-filtro-avancado.md) | O chip "N regras" e o construtor com "Onde", E ou Ou, grupos de 1 nível, "Duplicar", "Transformar em grupo" e "Desfazer o grupo" | 1 | Fica fora da base porque a visualização ainda não guarda a árvore de regras: pede mudança no dado da visualização |
| [4. Filtros no construtor de visualização](parte-4-filtros-no-construtor.md) | A seção Filtros do construtor de visualização sem 2º modal: os filtros automáticos em chaves, os filtros por campo em linhas e o construtor do filtro avançado | 1 e 3 | Usa a condição da parte 1 e o construtor da parte 3; vale no modal de hoje e no painel Configurar |
| [5. Filtros rápidos](parte-5-filtros-rapidos.md) | Os filtros rápidos do sistema como botões em toda visualização; o filtro rápido criado pela pessoa, com nome e regras; o bloco "Filtros rápidos" no painel Configurar | 1, 3 e 4 | Usa o construtor da parte 3 e a seção Filtros da parte 4; pede ao back um lugar para guardar o nome e as regras de cada botão |
| [6. Filtros rápidos que não cabem na linha](parte-6-filtros-rapidos-que-nao-cabem.md) | O "+N" no fim dos botões, com a lista dos escondidos; o botão ligado fica na linha; os chips nunca se escondem | 5 | Só a tela muda; fica à parte porque a medida da linha é trabalho próprio |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN007 | Os filtros rápidos ligados ou sempre aplicados, os filtros por campo e o filtro avançado de uma visualização valem juntos: o item aparece só quando passa em cada um deles. | "Status é Em análise" no chip e "Área é Jurídico" no filtro avançado mostram só os itens em análise do Jurídico. | Obrigatório |
| RN008 | As condições e o valor de cada tipo de campo são os da tabela a seguir. Política: Única. | Linha 4: um filtro de Vencimento oferece "Nos próximos", com o número de dias. | Obrigatório |
| RN009 | Os campos e os filtros rápidos do sistema de cada tela são os da tabela de parâmetros abaixo da RN008. Política: Única. | Linha 2: em Tarefas Rápidas, "+ Filtro" lista Prioridade, e "Atrasado" é um filtro rápido do sistema. | Obrigatório |

Condições por tipo de campo (RN008). "Está vazio" e "Está preenchido" não pedem valor.

| Linha | Tipo do campo | Condições | Valor |
|---|---|---|---|
| 1 | Seleção e pessoa | "É", "Não é", "Está vazio", "Está preenchido" | 1 ou mais opções marcadas em caixas; marcar várias vale como "qualquer uma" |
| 2 | Texto | "Contém", "É", "Está vazio", "Está preenchido" | o texto digitado |
| 3 | Valor | "Maior ou igual a", "Menor ou igual a", "É" | o número |
| 4 | Data | "Nos próximos" (dias), "A partir de", "Até", "Está vazio", "Está preenchido" | o número de dias, em "Nos próximos"; a data, nas outras |

Parâmetros de cada tela (RN009).

| Linha | Tela | Campos que filtram | Filtros rápidos do sistema |
|---|---|---|---|
| 1 | Itens | os campos da categoria | "Meus itens", "Dos meus grupos" |
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
| Filtro rápido do sistema | Filtro pronto da tela, que vira botão, fica sempre aplicado ou fica de fora (RN016) | "Meus itens", "Minhas Tarefas" |
| Filtro rápido criado | Botão com nome e regras que a pessoa cria na visualização | "Alta prioridade" |
| "+N" | O botão que guarda os filtros rápidos que não cabem na linha de filtros | "+3" |
| Filtro avançado | O conjunto de regras com conector E ou Ou e grupos | "N regras", "Filtro avançado" |
| Regra | 1 campo, 1 condição e 1 valor dentro do filtro avançado | (sem nome na tela) |
| Grupo | Regras juntas com conector próprio, dentro do filtro avançado | "Adicionar grupo" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P010 | Hoje, as regras do mesmo campo no funil e na gaveta aparecem sem conector. Elas valem com E ou com Ou? | Time de back | Se valem com Ou, a migração dos filtros de hoje para o chip (parte 1) e para o filtro avançado (parte 3) muda |
| P013 | Os filtros aplicados hoje pelo funil e pela gaveta ficam guardados em algum lugar (endereço, sessão, visualização)? Na tela, nada oferece gravá-los na visualização. | Time de front | Define a migração para a alteração não salva do épico "Criar, configurar e salvar visualização" |
| P014 | Este épico pode ir ao cliente antes do épico "Criar, configurar e salvar visualização"? Antes dele, o filtro aplicado na linha de filtros vale só até a pessoa sair da tela, como hoje. | produto | Saindo antes, a linha de filtros guarda o filtro como o funil guarda hoje (P013) |
| P007 | O menu chama a tela de "Agendadas", e o título dela diz "Tarefas Programadas". Qual nome fica? | Mikaela | Muda o nome da tela na tabela de parâmetros da RN009 |

# Requisitos: Itens sem formulário

**Objetivo:** o cargo com a categoria inteira vê os itens sem formulário, e o cargo restrito a alguns formulários vê
só os itens deles. Hoje os itens sem formulário somem de todo cargo com permissão de formulário gravada: é o que
esconde do cargo as demandas criadas pelo agente de IA do Spaceflow no workspace de produtos.

**Onde vale:** a tela de permissões do cargo (Configurações > Gestão de membros > Cargos > o cargo, aba Dados, a
árvore de cada categoria) e a listagem e a abertura de itens em toda porta: a tela, a API, o MCP e os agentes de IA.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. Em "Processos Judiciais", Ajustar ›
Formulários mostra a linha "Itens sem formulário". Na tela de hoje, a mesma escolha é 1 nó na árvore da categoria,
junto dos formulários.

**Fora do escopo:** a tela nova de permissões (épico "Tela nova de permissões"); Criar, Atualizar e Excluir por
formulário valendo na API e o formulário criado depois (épico "Ações por formulário em toda porta").

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Os itens sem formulário são uma origem da categoria, como cada formulário. O item criado pelo formulário padrão também fica sem formulário. | Em "Processos Judiciais", as origens são Cível, Criminal, Trabalhista e "Itens sem formulário". | Obrigatório |
| RN002 | Com Ver em cada origem da categoria, o cargo vê cada item da categoria. | No workspace de produtos, "Demandas" com Ver em cada formulário e em "Itens sem formulário": a demanda criada pelo agente de IA aparece para o cargo. | Obrigatório |
| RN003 | Com Ver em parte das origens, o cargo vê só os itens das origens marcadas. | "Processos Judiciais" com Ver só em Criminal: o cargo não vê Cível nem o processo criado pela API. | Obrigatório |
| RN004 | A listagem considera só o Ver por origem. Criar, Atualizar e Excluir por formulário não restringem o que a pessoa vê. | Na categoria "casa do raul", com Ver em cada origem e Criar só em Cozinha, a pessoa vê os itens de Cozinha, de Quintal e os sem formulário. | Obrigatório |
| RN005 | Criar pode valer sem Ver. | Numa categoria de denúncias, o cargo com Criar e sem Ver cria a denúncia e não vê nenhuma. | Obrigatório |

## Na tela de permissões (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Na tela de permissões do cargo, cada categoria com formulário deve ter a origem "Itens sem formulário" junto dos formulários, com as mesmas ações de um formulário (RN001). | Na árvore de "Processos Judiciais", o nó "Itens sem formulário" aparece depois de Trabalhista, com Criar, Ver, Atualizar e Excluir. | Essencial | Obrigatório |
| RF002 | A origem deve ter a descrição "Criados pelo formulário padrão, pela API, por importação, pelo Spaceflow ou por agente de IA.". | A descrição aparece junto do nome, nos 3 idiomas. | Importante | Obrigatório |
| RF003 | Marcar uma ação na categoria inteira deve marcar a ação também em "Itens sem formulário", como marca em cada formulário. | Marcar Ver em "Demandas" marca Ver em cada formulário e em "Itens sem formulário". | Essencial | Obrigatório |
| RF004 | A categoria sem formulário não deve mostrar a origem "Itens sem formulário". | "Fornecedores", sem formulário, mostra só as 4 ações da categoria. | Importante | Obrigatório |

## Listagem e abertura (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF006 | Com Ver em cada origem da categoria, a listagem deve devolver os itens de cada formulário e os sem formulário (RN002). | Exemplo: "Demandas" com Ver em cada origem; a demanda criada pelo agente de IA, sem formulário, aparece na lista do cargo. | Essencial | Obrigatório |
| RF007 | Com Ver em parte das origens, a listagem deve devolver só os itens das origens marcadas em Ver (RN003). | Exemplo: "Processos Judiciais" com Ver só em Criminal; o processo de Cível e o processo criado pela API não aparecem, e o de Criminal aparece. | Essencial | Obrigatório |
| RF008 | Com Ver em parte das origens e em "Itens sem formulário", a listagem deve devolver também os itens sem formulário. | Ver em Criminal e em "Itens sem formulário": aparecem os processos de Criminal e os criados pela API. | Essencial | Obrigatório |
| RF009 | A listagem deve ignorar Criar, Atualizar e Excluir por formulário (RN004). | Exemplo: Ver em cada origem e Criar só em Cozinha; a lista mostra os itens de Cozinha, de Quintal e os sem formulário. | Essencial | Obrigatório |
| RF010 | Se o cargo tenta abrir pelo endereço um item de uma origem sem Ver, o sistema deve negar o acesso como nega na categoria sem Ver. | Com Ver só em Criminal, abrir o endereço de um processo de Cível mostra o aviso de sem acesso. | Essencial | Obrigatório |
| RF011 | A categoria sem permissão de formulário gravada deve continuar mostrando cada item ao cargo com Ver na categoria. | O cargo com Ver em "Fornecedores", sem formulário, vê cada item da categoria. | Essencial | Obrigatório |
| RF015 | Criar sem Ver na categoria deve continuar valendo (RN005). | Exemplo: "Denúncias" com Criar e sem Ver; a pessoa cria a denúncia e a lista da categoria fica vazia para ela. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Permissão do cargo para a origem "Itens sem formulário" | Uma referência própria por ação, ao lado da referência de cada formulário, aceita na gravação do cargo; o formato fica <a definir>. | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT001 | Na migração, o cargo com uma ação em cada formulário da categoria deve ganhar essa ação também em "Itens sem formulário". Critério de fim: cargos migrados. | O cargo que hoje tem Ver em Cível, Criminal e Trabalhista passa a ver também os itens sem formulário. | Essencial | Obrigatório |
| RT002 | Na migração, o cargo com uma ação em parte dos formulários deve ficar sem a ação em "Itens sem formulário". Critério de fim: cargos migrados. | O cargo com Ver só em Criminal continua sem ver Cível e os itens sem formulário. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | A correção do card USE87A7C6, na develop desde 16/11/2026, mostra os itens sem formulário a todo cargo com Ver na categoria. Este épico a substitui antes de ela ir para produção? | produto e dev do back | Indo para produção antes, o cargo com Ver só em Criminal passa a ver os processos sem formulário até este épico sair |
| S001 | A listagem do MCP e a dos agentes de IA usam a mesma checagem de permissão da tela e da API. | dev do back | Se usarem outra, RF006 a RF010 valem também nelas |

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

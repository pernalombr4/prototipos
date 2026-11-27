# Requisitos: Ações por formulário em toda porta

**Objetivo:** Criar, Atualizar e Excluir marcados por formulário valem na tela, na API, na importação, no Spaceflow e
nas tarefas de formulário. A ação marcada na categoria inteira vale também no formulário criado depois.

**Depende de:** épico "Itens sem formulário", que cria a origem "Itens sem formulário".

**Onde vale:** a criação, a edição e a exclusão de itens em toda porta: a tela, a API, a importação, o Spaceflow, os
agentes de IA e as tarefas de formulário do fluxo da categoria; e a gravação das permissões de formulário do cargo.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. Clique em "Processos Judiciais": as linhas
dos formulários mostram Criar, Ver e Atualizar só em Criminal.

**Fora do escopo:** o que a pessoa vê (épico "Itens sem formulário") e a tela nova de permissões (épico "Tela nova de
permissões").

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Criar, Atualizar e Excluir por origem valem em toda porta de criação, edição e exclusão do item. | Com Criar só em Criminal, a API recusa o processo de Cível criado pelo cargo. | Obrigatório |
| RN002 | A ação marcada na categoria inteira vale em cada origem, inclusive no formulário criado depois. | Com Atualizar em toda a categoria, o cargo edita os processos do formulário "Tributário" criado depois. | Obrigatório |
| RN003 | Na ação marcada em parte das origens, o formulário criado depois entra desmarcado. | Com Ver só em Criminal, o formulário "Tributário" criado depois fica sem Ver. | Obrigatório |
| RN004 | Atualizar e Excluir só valem na origem em que Ver vale. Criar pode valer sem Ver. | Com Criar em Cível e Ver só em Criminal, o cargo cria processos de Cível e não vê nenhum deles. | Obrigatório |

## Criar, Atualizar e Excluir por origem (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | Com Criar em parte das origens, o sistema só deve criar o item nas origens marcadas em Criar (RN001). | Criar só em Cozinha: o formulário Quintal não aparece para o cargo, e a API recusa o item de Quintal. | Essencial | Obrigatório |
| RF012 | Com Atualizar em parte das origens, o sistema só deve aceitar a edição de item das origens marcadas em Atualizar (RN001). | Atualizar só em Criminal: a tela e a API recusam a edição de um processo de Cível. | Essencial | Obrigatório |
| RF013 | Com Excluir em parte das origens, o sistema só deve aceitar a exclusão de item das origens marcadas em Excluir (RN001). | Excluir só em Criminal: o sistema recusa a exclusão de um processo de Cível. | Essencial | Obrigatório |
| RF014 | A tarefa de formulário do fluxo da categoria deve seguir a regra de Criar e Atualizar por origem de RF011 e RF012. | Com Atualizar em toda a categoria, a tarefa de formulário de um formulário criado depois aceita a edição. | Essencial | Obrigatório |
| RF015 | Criar sem Ver por origem deve continuar valendo (RN004). | Criar em Cível sem Ver em Cível: o cargo cria o processo e não o vê na lista. | Importante | Obrigatório |

## Formulário criado depois (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF016 | A ação marcada na categoria inteira deve valer no formulário criado depois, sem editar o cargo (RN002). | Exemplo: Ver em toda "Processos Judiciais"; o formulário "Tributário" criado amanhã já tem Ver para o cargo. | Essencial | Obrigatório |
| RF018 | Na categoria aberta, o aviso ao lado de "Itens sem formulário" deve dizer "Formulário criado depois entra na ação marcada na categoria inteira. Na ação com traço, ele entra desmarcado." (RN002, RN003). | O aviso aparece na coluna Restrições, na linha "Itens sem formulário". | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI002 | Gravação da ação inteira | A ação marcada na categoria inteira se grava só na categoria, sem a lista de origens, e vale para cada origem (RN002). | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT003 | Na migração, a ação marcada em cada origem da categoria deve virar a ação inteira, gravada só na categoria. Critério de fim: cargos migrados. | O cargo com Ver em cada origem de "Processos Judiciais" passa a ter Ver no formulário criado depois. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P003 | A edição e a exclusão de item pela API conferem hoje o formulário do item? A criação pela API confere só a permissão da categoria. | dev do back | Conferindo, RF012 e RF013 já valem na API e ficam só como critério |
| P004 | Na tela de hoje, sem a tela nova, onde fica o aviso de RF018? | produto | Sem a tela nova no ar, o aviso entra como dica no nó da categoria, ou espera a tela nova |
| P005 | O formulário criado depois numa ação marcada em parte das origens entra desmarcado. Produto confirma? | produto | Entrando marcado, RN003 e o aviso de RF018 mudam |

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

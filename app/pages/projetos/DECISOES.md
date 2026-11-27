# Decisões · Projetos no workspace

## A proposta em uma frase

**O projeto é 1 nível novo entre o workspace e as categorias: reúne categorias, telas e pessoas e decide
quem vê as categorias dele, sem mudar campos, formulários, fluxos nem o endereço de nenhuma categoria.**

| | Hoje | Proposta |
|---|---|---|
| Níveis do workspace | 1 (categorias lado a lado) | 2 (projetos e categorias) |
| Quem vê uma categoria | O cargo, categoria por categoria | O projeto (aberto, fechado ou privado) e, dentro dele, o cargo |
| Separar uma área ou um cliente | Outro workspace, sem o cadastro comum | 1 projeto no mesmo workspace |
| Menu de quem participa de 2 de 57 projetos | Não se aplica | 2 projetos no painel; os demais no diretório |

## A fronteira

- **Muda:** o ícone Projetos na trilha (abaixo de Início), o painel de projetos, a página do projeto, o
  diretório, a tela sem acesso, criar, configurar e arquivar projeto, mover categoria, o chip do projeto na
  lista da categoria, o vínculo "Item sem acesso", a coluna Projeto em Tarefas, "Seus projetos" no Início e
  "Categorias do workspace" no painel Dados.
- **Não muda:** a casca do menu novo (protótipo `menu-lateral`, rodada 35), a lista da categoria (abas,
  barra e `EnTable`), campos, formulários, fluxos do Spaceflow, cargos e o endereço da categoria.

## As decisões, uma a uma

### 1. Projetos é um ícone da trilha, logo abaixo de Início

- O ícone só aparece quando a pessoa vê ao menos 1 projeto. No workspace sem projetos, a trilha fica como
  é hoje, e a proprietária cria o primeiro pelo "+" ou pelo estado vazio do Início.
- O painel mostra os projetos do menu da pessoa, com as categorias dentro. O rodapé "Ver todos os N
  projetos" abre o diretório.
- Motivo: em Notion, ClickUp, Jira e Linear o nível de projeto fica abaixo de um bloco pessoal fixo, e o
  menu mostra só os da pessoa (PESQUISA.md, "O padrão que todos seguem").

### 2. 3 visibilidades, e o padrão é Fechado

| Visibilidade | Ícone | Quem vê o projeto | Quem vê as categorias |
|---|---|---|---|
| Aberto | `globe` | Todos os membros | Todos, conforme o cargo |
| Fechado | `lock` | Todos os membros, no diretório | Só os participantes; os demais pedem acesso |
| Privado | `eye-off` | Só os participantes | Só os participantes |

- Fechado é o padrão: o projeto aparece no diretório, e o conteúdo fica com quem participa. Segue a síntese
  de 16/09 ("o default decide contra a visibilidade") e o Fechado que a página órfã `/projects` do develop
  já trazia.
- Diferença do relatório: lá, Fechado e Privado tinham o mesmo cadeado. Aqui o Privado usa `eye-off`, porque
  o cadeado diz "existe e está trancado", que é o Fechado.
- Só proprietário e Full deixam um projeto Aberto: abrir expõe as categorias ao workspace inteiro.

### 3. Quem não participa: o Fechado se apresenta, o Privado não existe

- Fechado: a tela sem acesso diz o nome do projeto e oferece "Pedir acesso ao projeto". O pedido chega ao
  administrador em Configurações > Acesso.
- Privado: a tela é a mesma de "Página não encontrada". Ninguém confirma que o projeto existe (regra do
  GitHub para repositório privado).
- No campo de vínculo, o item de uma categoria que a pessoa não lê aparece como "Item sem acesso", com
  cadeado. O nome do item não aparece; o tooltip diz o projeto só quando ele é Fechado. Hoje o servidor
  manda o texto do item a quem não lê a categoria (relatório, achado do `display`).

### 4. Mover categoria mostra o efeito antes, com números

- O diálogo diz quem vê hoje e quem vê depois, com a contagem de pessoas, se a categoria sai do menu de
  alguém e se algum vínculo passa a mostrar "Item sem acesso".
- "O que não muda" fica no mesmo diálogo: campos, formulários, fluxos, painéis e endereço.
- A categoria pertence a 1 projeto só, ou ao workspace. Em Criar projeto, a categoria de outro projeto
  aparece desabilitada com "Pertence ao projeto X".

### 5. Ocultar do meu menu é diferente de sair e de arquivar

- "Ocultar do meu menu" e "Mostrar no meu menu" valem só para a pessoa (o "Ocultar espaço" do ClickUp).
- "Mostrar no menu de todos os participantes" é escolha do administrador, na criação.
- A busca do painel acha também o projeto fora do menu, marcado "Fora do seu menu" (Linear, "Exploring").

### 6. Papéis: administrador do projeto e participante

- Proprietário e Full administram todo projeto ("Acesso pelo workspace") e aparecem como herdados em
  Participantes.
- O administrador do projeto edita o projeto, as categorias, as telas e os participantes, sem entrar nas
  configurações do workspace (Pipefy, admin do pipe).
- O participante usa as categorias com a permissão padrão do projeto: 4 caixas, Ver, Criar, Editar e
  Excluir. A exploração do ClickUp pôs a permissão padrão do Espaço em "Serve"; a permissão fina continua no
  cargo.
- Participante pode ser pessoa, grupo de membros ou cargo, o mesmo modelo da página órfã do develop.
- O convidado (licença Visualizador de fora da empresa) vê só os projetos em que entrou, e a trilha fica
  com Início, Projetos e Ajuda.

### 7. Configurações do projeto: 1 rascunho, 1 Salvar

- 5 abas (Geral, Categorias, Participantes, Acesso, Arquivar e excluir) num painel lateral, com a marca
  "Alterações não salvas" e 1 rodapé com Descartar e Salvar. Responde a S3-F1 e S3-F7.
- Arquivar tira o projeto do menu de todos e mantém categorias e fluxos ativos; a proprietária restaura pela
  vista Arquivados do diretório.
- Excluir pede o nome digitado e só a proprietária faz. As categorias voltam ao workspace com os itens.

### 8. A categoria de projeto continua achável

- O painel Dados mostra "Categorias do workspace" (as sem projeto) e "Ver todas as N categorias", que lista
  todas as que a pessoa vê, com o chip do projeto.
- Tarefas ganha a coluna Projeto e o filtro por projeto.

## O nome continua em aberto

"Projetos" é provisório, por escolha da redatora antes da rodada 1. O que pesa:
- "Projeto" já existe na página órfã `/projects` do develop e no SDK;
- o cliente usa o nível para área e cliente, não só para projeto com início e fim (Financeiro, Obra Aurora);
- o Jira trocou "projects" por "spaces" e ouviu queixa de colisão de nome; o monday tem board e project, e
  os usuários confundem os 2.

Alternativas para decidir com ela: Projetos, Espaços, Áreas.

## Rodada 1 · 2026-11-25
- **Pedido (literal):** "Sim, prototipar"
- **Mudou:** protótipo novo sobre o menu novo, com 4 pessoas em "Ver como" (proprietária, administradora do
  Financeiro, participante do Financeiro, convidada da Aurora), 3 cenários (sem projetos, 4 projetos, 57
  projetos) e 3 estados do painel (normal, carregando, erro).
- **Fronteira:** muda o que está em "A fronteira"; não muda a casca nem a lista da categoria.
- **Descartado:** o passo 2 de fluxo e recursos do ClickUp. Motivo: no ENSPACE fluxo e recursos moram na
  categoria.
- **Descartado:** arquivar sem confirmação (ClickUp). Motivo: o projeto some do menu de todos.
- **Descartado:** o "Default" do Notion (entrada obrigatória). Motivo: o Aberto já cobre "todos veem".
- **Não deu:** explorar o GitHub Projects. Por quê: o Chrome abriu o GitHub deslogado, e o agente não digita
  senha.
- **Não deu:** ver na tela o campo de vínculo do develop. Por quê: nenhuma categoria do workspace de
  exploração tem campo de relacionamento, e criar um seria escrita fora do escopo da exploração.
- **Maquete:**
  - Análise, Comercial, Configurações e Mais na trilha, Spaceflows e Agenda no painel Início, telas e
    painéis das categorias: avisam que são maquete;
  - as linhas das categorias que não são Contas a pagar são ilustrativas;
  - os pedidos de acesso pendentes em Configurações > Acesso vêm do mock;
  - as contagens de pessoas somam grupos e cargos sem cruzar quem está em 2 grupos;
  - a atividade recente da página do projeto está só em português (dado do mock);
  - o reload zera tudo.
- **Crítica e acessibilidade:**
  - texto e ícone com significado em `text-dimmed` (3,03:1 no claro) passaram para `text-muted` (4,77:1);
  - a contagem de quem vê o projeto somava 2 vezes a pessoa que entra direto e por grupo: corrigida;
  - o diálogo de mover não dava números: agora dá antes e depois;
  - a seção Favoritos aparecia vazia para a convidada: some quando não há favorito;
  - a coluna Categorias do diretório ficava em branco no projeto Fechado de que a pessoa não participa:
    mostra a contagem, porque o Fechado já se apresenta no diretório;
  - sem correção, por ser do tema copiado do en-docs: `primary` tem 3,39:1 no claro, abaixo de 4,5:1 para
    texto pequeno;
  - sem correção, por ser do SDK: o `EnTable` mostra "—" na célula vazia da coluna Processo;
  - sem correção, por ser da casca compartilhada: os botões do andaime ("O problema", "As referências", "As
    decisões") ficam em português nos 3 idiomas;
  - os botões de ações que aparecem no hover também aparecem com o foco do teclado; reordenar tem Alt e as
    setas.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-painel-de-projetos.png`: Financeiro como proprietária;
  - `evidencias/entrega-mover-categoria.png`: Notas fiscais para o Jurídico, de 10 para 7 pessoas;
  - `evidencias/entrega-item-sem-acesso.png`: Contas a pagar como participante, com "Item sem acesso";
  - `evidencias/entrega-diretorio.png`: o diretório como participante, com "Pedir acesso";
  - `evidencias/entrega-sem-acesso-fechado.png`: a tela sem acesso do projeto Fechado.

## Rodada 2 · 2026-11-25
- **Pedido (literal):** "pode prototipar, mas prototipe em seguida uma versao com o menu atual do enspace, isso
  porque nao sabemos se os devs ja vao ter o menu novo quando forem fazer a logica de projetos, entao o de hoje
  pode ajudar a basear tambem. aí só botar uma chave na base (com menu novo / com menu atual) pra mudar o menu
  pro user que ta vendo o prototipo"
- **Mudou:**
  - chave "Menu novo / Menu atual" no andaime; a troca mantém a tela aberta e a pessoa de "Ver como";
  - casca nova `_CascaDoMenuAtual.vue`, cópia do menu de hoje do develop;
  - no menu atual, Projetos é uma seção logo abaixo de Spaceflows (abaixo de Início, para o convidado), com os
    projetos do menu da pessoa, as categorias e as telas dentro e "Ver todos os N projetos" no fim;
  - o "+" de criar projeto fica no próprio item Projetos, no hover, e só para quem cria;
  - a seção Categorias passa a listar só as categorias do workspace, mais "Ver todas (N)", que abre a mesma
    janela "Todas as categorias" do painel Dados;
  - ações do projeto (•••), reordenar (arraste, Alt e setas) e mover categoria iguais às do painel do menu novo;
  - as telas da área de conteúdo são as mesmas nas 2 cascas.
- **Fronteira:** muda a seção Projetos e o conteúdo da seção Categorias; não muda o resto do menu de hoje.
- **Diferença entre as 2 cascas:** o menu de hoje não tem lugar para busca de projeto. Quem tem muitos projetos
  acha pelo diretório, que já tem busca. No cenário sem projetos, a seção some e Categorias lista todas.
- **Maquete:**
  - o menu atual é resumido: as categorias não abrem as visualizações delas;
  - Spaceflows, Agendadas, Rápidas, Agenda, Relatórios, Knowledge, Configurações e Ajuda avisam que são maquete.
- **Crítica e acessibilidade:**
  - linhas com `py-2` e menu com 16.5rem, medidos contra o print do develop, para os nomes não cortarem;
  - os prints da rodada 1 saíram de novo, sem o ícone do Nuxt DevTools.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-menu-atual-projeto.png`: o menu atual com o Financeiro aberto, como proprietária.

## Rodada 3 · 2026-11-26
- **Pedido (literal):** "Sim, rodada 3", em resposta a "Faço a rodada 3 com as 3 camadas juntas, ou você quer
  ajustar algo antes?". Antes, a redatora pediu "antes de fazer a rodada 3 ajustada pelo codigo me responda isso
  pra considerarmos tambem esses pontos ja", sobre como projeto, seção do workspace e favoritos convivem.
- **Base:** a pesquisa `pesquisa-de-mercado/runs/2026-11-26-o-que-o-projeto-guarda-alem-de-categorias/` e a
  leitura do código do ENSPACE de 2026-11-26 (develop), ponto a ponto.
- **Mudou:**
  - a página do projeto ganha 4 abas: Visão geral, Itens, Automações e Painel;
  - Visão geral abre com o Status do projeto: situação (No prazo, Em risco, Atrasado, Concluído), início, fim
    previsto, texto, autor e as atualizações anteriores; quem administra publica, os demais leem;
  - Itens mostra os itens de todas as categorias do projeto numa tabela e num quadro, com Responsável, Prazo e
    Status de cada categoria; "Novo registro" pergunta a categoria;
  - Configurações ganha a aba Campos comuns: por categoria, qual campo entra em Responsável, Prazo e Status, com
    "Não usar", e em que coluna do quadro cai cada valor do status;
  - Automações lista os fluxos do Spaceflow que escutam uma categoria do projeto e os avisos de prazo das
    categorias; "Novo fluxo" pede a categoria e o gatilho e abre o Spaceflow;
  - Painel mostra 1 widget "Itens por status" por categoria, mais "Itens em aberto por responsável", que soma as
    categorias;
  - modelo de projeto: "Salvar como modelo" nas Configurações e "Começar de" no Criar projeto;
  - as 3 camadas no menu: o "?" do painel Projetos explica quando usar cada uma; a seção do workspace Comercial
    abre o painel dela, com atalho para categoria de projeto; os Favoritos do Início vêm da estrela da barra do
    topo e aceitam projeto;
  - o ponto do status ao lado do nome do projeto no painel, no menu atual e uma coluna Status no diretório;
  - a 2ª chave do andaime, "Mostrar o que pede back-end novo", contorna em azul o que não existe no back hoje.
- **Fronteira:** muda a página do projeto, as Configurações, o Criar projeto, o painel Início (Favoritos) e o
  painel da seção Comercial; não muda a casca dos 2 menus nem as telas das categorias.

### Cabe hoje × pede peça nova no back-end

| Parte | Cabe hoje | Pede peça nova |
|---|---|---|
| Status do projeto | | O projeto não existe no back; o status vai junto dele |
| Itens de todas as categorias | | A consulta de itens lê 1 categoria por vez; a visão cruzada e o mapa de campos são novos |
| Automações | Os fluxos já escutam 1 categoria; os avisos de prazo já são por categoria | Listar por projeto pede saber quais categorias são do projeto |
| Gatilho do projeto inteiro | | 1 fluxo para todas as categorias do projeto; fica fora desta rodada |
| Painel por categoria | Cada widget lê 1 categoria, como os painéis de hoje | |
| Widget que soma categorias | | Somar categorias numa conta só é novo |
| Modelo de projeto | O importador de estrutura do produto já copia categorias, campos, formulários, visualizações e fluxos | Guardar o modelo com o projeto e aplicar a um projeto novo |
| Seção do workspace | É o menu personalizado de hoje (Interface, Menus) | O atalho para categoria de projeto, que segue o acesso do projeto |
| Favoritos | Os favoritos de categoria já existem | Favoritar o projeto |

### O modelo segue o importador de hoje
O importador de estrutura do produto, o mesmo dos casos de uso, define 3 regras que o modelo herda:
- os fluxos entram desligados: a página avisa quantos vieram do modelo e pede revisão antes de ligar;
- o importador limpa responsáveis, destinatários, colaboradores e credenciais dos fluxos: o modelo diz que não
  traz itens, participantes nem os responsáveis dos fluxos;
- cada categoria do modelo vira uma categoria nova no projeto, nunca reaproveita uma que existe; quem quer
  usar uma categoria do workspace a escolhe no campo "Categorias que já existem".

### As 3 camadas convivem
- **Projeto:** guarda as categorias e decide quem vê os itens.
- **Seção do workspace:** atalhos que o administrador monta em Interface, Menus; não muda o acesso a nada. O
  atalho para categoria de projeto só aparece para quem entra no projeto.
- **Favoritos:** os atalhos de cada pessoa, pela estrela; só ela vê.

- **Maquete:** as telas da seção Comercial, "Configurar avisos", "Editar painel", abrir um fluxo e "Abrir no
  Spaceflow" dão um aviso; nada sai do protótipo.
- **Achados, sem correção:**
  - o quadro do SDK põe o título do cartão em maiúscula a cada palavra ("Viagem A Joinville");
  - o menu atual não tem lugar para a seção do workspace: no menu de hoje ela é o próprio menu personalizado;
  - o botão Salvar desabilitado das Configurações quase não se distingue do habilitado (estilo do Nuxt UI).
- **Crítica e acessibilidade:**
  - as abas das Configurações rolam na horizontal sem barra de rolagem visível, para os 6 rótulos caberem;
  - o nome do fluxo quebra linha em vez de cortar;
  - os pontos de status têm `aria-label` e dica com o nome da situação, sem depender da cor;
  - as chaves de fluxo ficam desabilitadas para quem não administra, e "Novo fluxo", "Atualizar status" e
    "Configurações" somem.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-status-do-projeto.png`: Visão geral do Financeiro, com o status;
  - `evidencias/entrega-itens-do-projeto.png`: Itens das 3 categorias, com o contorno do back-end novo;
  - `evidencias/entrega-automacoes.png`: os 4 fluxos e o aviso de prazo do Financeiro;
  - `evidencias/entrega-painel-do-projeto.png`: os 3 widgets por categoria e o de soma, em azul;
  - `evidencias/entrega-campos-comuns.png`: a aba Campos comuns, com Reembolsos sem campo de prazo;
  - `evidencias/entrega-criar-com-modelo.png`: Criar projeto a partir do modelo Obra;
  - `evidencias/entrega-secao-do-workspace.png`: Oportunidades aberta pela seção Comercial;
  - `evidencias/entrega-camadas.png`: o "?" das 3 camadas.

## Rodada 4 · 2026-11-26
- **Pedido (literal):** "assim que o user clicar em projetos, ele deve ja ver a tela com "ver todos os projetos",
  essa do print, nao aquele atalho estranho" e "garanta que voce ta usando o component de tabela do enspace. use
  /investigar-codigo e leia a sdk pra achar a tabela la (se existir). tabela, filtros... todo o esquema de talas
  como a tela de logs, relatórios, itens...".
- **O que o código diz (develop, 2026-11-26):**
  - o SDK tem a tabela: `EnTable` (colunas, seleção, ordenação, paginação, colunas que se escondem e estado
    vazio), o porte da tabela das listagens do produto; ele não traz busca nem filtros;
  - Logs de auditoria, Relatórios, Itens, Tarefas, Execuções, Credenciais e Assinaturas montam a tela com a
    mesma sequência: a barra de busca e filtros, a tabela e o paginador;
  - a barra tem, à esquerda, a busca (com ponto vermelho quando há termo), o período e "Limpar filtros"; à
    direita, Colunas e o botão que mostra ou esconde a linha de filtros rápidos; a 2ª linha recebe os filtros;
  - o paginador mostra "Mostrando X a Y de N resultados", itens por página (25, 50, 100, 500) e as páginas,
    numa faixa de fundo elevado.
- **Mudou:**
  - clicar em Projetos abre Todos os projetos, com o painel Projetos ao lado; no menu atual, clicar no título
    da seção Projetos faz o mesmo, e a seta continua abrindo e fechando a seção;
  - o diretório segue o esquema das listagens: barra com busca, período de criação, "Limpar filtros", Colunas
    e o botão dos filtros rápidos; a 2ª linha tem Visibilidade, Status e Administrador, com várias escolhas;
  - a tabela continua o `EnTable` do SDK, agora com ordenação por Projeto, Participantes, Categorias e Criado em,
    e com as colunas que a pessoa esconde pelo botão Colunas (Projeto fica sempre);
  - o paginador do produto entrou no lugar do rodapé do `EnTable` (`_Paginador.vue`, cópia, nada é proposta).
- **Fronteira:** muda só a tela do diretório e o destino do clique em Projetos. O painel lateral, a página do
  projeto e as janelas ficam como na rodada 3. "Ver todos os N projetos" continua no rodapé do painel, para voltar
  ao diretório depois de abrir um projeto.
- **Achado:** o `EnTable` do SDK não tem como pôr o funil de filtro no cabeçalho da coluna, como a tabela do
  produto faz; por isso os filtros do diretório ficam na linha de filtros rápidos.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-projetos-abre-o-diretorio.png`: Todos os projetos aberto pelo clique em Projetos;
  - `evidencias/entrega-diretorio-colunas.png`: 52 projetos, o menu Colunas e a coluna Administradores escondida;
  - `evidencias/entrega-diretorio-paginador.png`: o paginador do produto, com 3 páginas de 25.

## Rodada 5 · 2026-11-26
- **Pedido (resumo do literal):** o painel não abria de dentro do projeto; não dava para criar nem editar o que
  fica no projeto pelo menu; as tarefas do projeto não tinham lugar; faltava justificativa de produto. Automações
  deve trazer a interface do Spaceflow, e Painéis, a lógica de construção de dashboard do produto, unindo o painel
  de tarefas e o de itens, sem inventar padrão. Referência: o menu do espaço no ClickUp.
- **O que o código diz (develop, 2026-11-26, pela `investigar-codigo`):**
  - a área de membro do Spaceflow lista os workflows em cartões: ícone, nome, versão, Ativo ou Inativo, descrição
    (ou "Nenhuma descrição informada"), o gatilho cru (`c_items:<categoria> -> create|update|delete`), data e
    "Abrir"; o botão "Novo Workflow" abre o modal de Nome, Descrição e Ícone;
  - o painel de tarefas tem blocos fixos que a pessoa mostra ou esconde (números, por status, carga por
    responsável, fila de prazos e outros); o painel de itens tem painéis que a pessoa monta: título, categoria,
    tipo de gráfico, agrupar por, função e campo de data;
  - os 2 usam a mesma grade do SDK (`EnDashboardCanvas`, `EnDashboardCustomize`, período e o "Adicionar painel"
    por grupo); o SDK não tem gráfico de funil nem de pizza.
- **Mudou:**
  - o "+" da linha do projeto abre "Adicionar em <projeto>": Nova categoria, Categoria do workspace, Nova tarefa,
    Novo painel e Novo Workflow; quem participa sem administrar vê só Nova tarefa;
  - a árvore do projeto (painel Projetos e menu atual, o mesmo componente) tem Visão geral, Tarefas e Automações
    fixos, e as seções Categorias e Painéis, cada uma com o "+" no hover, o "•••" por linha, arrastar para
    reordenar e a linha "Adicionar ..." quando está vazia;
  - painel: clicar abre, duplo clique renomeia, e o "•••" tem Abrir, Editar painel, Renomear, Duplicar e Excluir
    (com Desfazer); categoria: Mover para outro projeto, Tirar do projeto (com Desfazer) e Configurações;
  - aba Tarefas: as tarefas rápidas e as agendadas dos itens das categorias do projeto, no esquema das listagens
    (busca, filtros rápidos de Status, Responsável e Categoria, `EnTable` e paginador);
  - aba Automações: os cartões do Spaceflow; a tabela de avisos saiu;
  - aba Painéis: um painel só com os blocos de tarefas e os painéis de itens na mesma grade do SDK, com período,
    Categoria e Responsável; Personalizar usa a barra do SDK; "Painel de itens" abre o modal do produto;
  - Visão geral: 4 números clicáveis (Tarefas abertas, Vencidas, Itens, Workflows ativos), cada um abre a sua aba,
    e a seção "Fila de prazos".
- **Fronteira:** muda a árvore do projeto no menu, o "+" e as abas Tarefas, Automações, Painéis e Visão geral. O
  diretório, as janelas de configurar e mover e a casca do produto ficam como na rodada 4.
- **Escolhas por limite do SDK:** o funil aparece como barras e a pizza como rosca, com a legenda ao lado. O filtro
  de Responsável não se aplica aos painéis de itens (o item não tem responsável nativo); a tela avisa.
- **Fora do menu:** a linha "Itens" ficou só como aba. No menu, as categorias já levam aos itens.
- **Pede back-end novo (marca azul):** a fonte de dados de itens no painel unificado, com o escopo do projeto e o
  período; a estrutura de menu por projeto; "Tirar do projeto" e o filtro de categoria dos workflows. A lista de
  tarefas filtrada pelas categorias do projeto já existe hoje.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-r5-menu-adicionar.png`: o "+" do projeto com o que se adiciona;
  - `evidencias/entrega-r5-menu-do-painel.png`: o "•••" do painel no menu;
  - `evidencias/entrega-r5-menu-atual-es.png`: a mesma árvore no menu atual, em espanhol;
  - `evidencias/entrega-r5-visao-geral.png`: os 4 números e a fila de prazos;
  - `evidencias/entrega-r5-tarefas.png`: a aba Tarefas;
  - `evidencias/entrega-r5-automacoes.png` e `entrega-r5-novo-workflow.png`: os cartões do Spaceflow e o modal;
  - `evidencias/entrega-r5-painel-do-projeto.png` e `entrega-r5-paineis-de-itens.png`: o painel unificado;
  - `evidencias/entrega-r5-personalizar.png`, `entrega-r5-adicionar-painel.png` e
    `entrega-r5-novo-painel-de-itens.png`: personalizar e montar um painel de itens;
  - `evidencias/entrega-r5-paineis-de-itens-escuro.png`: tema escuro, com a marca do que pede back-end.

## Rodada 6 · 2026-11-26
- **Pedido (literal):** "as opçoes do botão "+" tambem devem aparecer quando clicar nos 3 pontinhos. o "+" é só
  atalho." e "ta muito apertado. dá pra aumentar a largura de tudo aí. ta esquisito com muito espaço sobrando."
- **Mudou:**
  - o "•••" da linha do projeto abre com "Adicionar", um submenu com a mesma lista do "+" (Categoria: Nova
    categoria e Categoria do workspace; Trabalho: Nova tarefa, Novo painel e Novo Workflow), como o "Criar novo"
    do menu do espaço no ClickUp; vale no painel Projetos e no menu atual, e quem participa sem administrar vê
    só Nova tarefa;
  - a lista mora num lugar só (`adicionarAoProjeto.ts`), e o "+" virou o atalho dela;
  - a página do projeto passou de 1152 px para até 1536 px de largura, com margem lateral maior; os cartões de
    categoria vão a 3 por linha em tela larga.
- **Fronteira:** muda o "•••" do projeto e a largura da página do projeto. O resto fica como na rodada 5.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-r6-acoes-com-adicionar.png`: o "•••" com o submenu Adicionar aberto;
  - `evidencias/entrega-r6-pagina-larga.png`: a Visão geral na largura nova.
  - O detector de seta marca as 2 capturas no topo da barra de rolagem da página (1565,52 com a página no topo e
    1565,103 com ela rolada); a marca acompanha a barra e a imagem não tem ponteiro. A redatora confirmou o falso
    positivo em 2026-11-26, e as 2 capturas ficam. O ajuste do detector fica fora deste repositório.

## Rodada 7 · 2026-11-26
- **Pedido (literal):** "os filtros de tarefas devem estar na mesma linha, todos. inclusive o "todas, rapidas e
  agendadas", na msm linha dos filtros rapidos ali abaixo.", "e se tem esse filtro, deve ter coluna de qual tipo
  de tarefa é na tabela. analise bem o modo como ta fazendo essa tabela.", "a tela de itens alem do filtro de
  categoria deve ter o funcionamento normal de filtros que tem hoje no enspace tambem, e todas as colunas que
  façam sentido serem mostradas a partir dos dados que vao ser usados aí" e "as automaçoes nao devem ter filtro
  por categoria."
- **O que o código diz (develop, 2026-11-26, pela `investigar-codigo`):**
  - as listas de tarefas e a de itens usam a mesma barra: busca, período com o campo de data e "Limpar filtros"; à
    direita Relatórios (na de itens), Colunas, "Filtros por campo" (um painel à esquerda com um acordeão por campo)
    e o botão de criar; embaixo, a linha de filtros rápidos, com botões que ligam e desligam;
  - os filtros rápidos das tarefas são Minhas tarefas, Tarefas em Aberto, Atrasadas, Atribuídas a mim, Tarefas
    Externas e Tarefas Internas;
  - colunas da tarefa rápida: ID, Nome, Criada em, Data limite, Status, Responsável e Prioridade; da tarefa agendada:
    Status da Tarefa, Status de SLA, Responsáveis, Tipo (o nome da categoria), Referência do Item, Tarefa e Título.
    A tarefa agendada não tem Prioridade;
  - o `EnTable` do SDK aceita largura por coluna (`columnSizing`), colunas visíveis e redimensionar.
- **Mudou:**
  - Tarefas: todos os filtros numa linha só (Todas, Rápidas e Agendadas; Status; Responsável; Categoria; Atrasadas;
    Minhas tarefas), com o período e o menu Colunas na barra;
  - Tarefas, a tabela: cada informação na sua coluna (antes o item e a categoria iam numa 2ª linha do título), com
    os nomes do produto: Tarefa, Tipo de tarefa (Rápida ou Agendada, a coluna que o filtro pede), Referência do item,
    Categoria, Responsável, Data limite, Status e Prioridade; Workflow e Criada em ficam no menu Colunas. Prioridade
    fica vazia na agendada, como no produto. Cada coluna tem largura própria, e o título deixou de cortar;
  - Itens: a barra da tabela de itens do produto (busca, campo de data e período, "Limpar filtros", Relatórios,
    Colunas, Filtros por campo, Campos comuns, Novo registro), o painel Filtros por campo (Status, Responsável,
    Prazo e Criado por), a linha de filtros rápidos com Categoria (proposta), Somente os meus e Vencidos, a ordenação
    nas colunas e o paginador;
  - Itens, as colunas: Referência, Título, Categoria, Status, Responsável, Prazo e Criado em; Atualizado em e Criado
    por no menu Colunas. Só entra coluna que vale para todas as categorias: as do item no produto e as 3 do mapa de
    campos comuns. Campo de uma categoria só fica na tela do item;
  - Automações: sem o filtro de categoria e sem a linha da categoria no cartão (o gatilho já diz a categoria). O
    cartão é o do Spaceflow, sem acréscimo;
  - 2 tarefas do Financeiro passaram para a usuária do protótipo, para "Minhas tarefas" ter resultado.
- **Fronteira:** muda o conteúdo das abas Tarefas, Itens e Automações. O menu, a Visão geral e o Painel ficam como na
  rodada 6.
- **Pede back-end novo:** sai o filtro de categoria dos workflows (rodada 5). O resto da lista da rodada 5 continua.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-r7-tarefas.png`: os filtros numa linha e a coluna Tipo de tarefa;
  - `evidencias/entrega-r7-itens.png`: a barra da tabela de itens, com o filtro rápido Vencidos ligado;
  - `evidencias/entrega-r7-itens-filtros-por-campo.png`: o painel Filtros por campo com o Status aplicado;
  - `evidencias/entrega-r7-automacoes.png`: os cartões sem o filtro de categoria.
  - O detector de seta passou nas 4. A captura de Itens com 11 linhas tinha a barra de rolagem da página e o detector
    marcou o topo dela, como nas capturas da rodada 6; com a página sem rolagem, passou. Reforça o falso positivo da
    rodada 6.

## Rodada 8 · 2026-11-26
- **Pedido (literal):** "discussions pode prototipar somente dentro de projetos por enquanto" e "pode colocar
  meta/iniciativa prototipado ja agora do modo como pensou." Origem: a pesquisa sobre Milestones, Stacks,
  Projects e Discussions do GitHub (`pesquisa-de-mercado\runs\2026-11-26-github-milestones-stacks-discussions\`).
  O bloqueio entre tarefas (os stacks) foi para a pasta-de-apontamentos, a pedido da redatora: "aqui nao".
- **Mudou:**
  - **Discussões, só dentro do projeto:** aba nova na página do projeto e entrada no menu do projeto, com o número de
    abertas. 3 formatos: Discussão (conversa aberta), Pergunta (quem perguntou marca a resposta certa, que fica em
    destaque) e Anúncio (só o administrador do projeto publica; entra fixado e escolhe quem recebe aviso). Busca,
    filtro por formato, Abertas e Fechadas; a discussão abre no painel lateral, com Fixar, Fechar e Reabrir para quem
    administra. Cada mensagem tem "Criar tarefa": a tarefa nasce no projeto, com o texto da mensagem, categoria,
    responsável e data limite, e a mensagem mostra a tarefa criada;
  - **Marcos na Visão geral:** seção só de leitura, com nome, progresso (a parte concluída das tarefas do marco),
    data-alvo, "Data-alvo passada" em vermelho e as metas para as quais o marco contribui (o clique abre a meta).
    Entrou como a base mínima da Meta, sem tela de criar nem editar marco: decisão do agente, para a meta ter o que
    ligar. Não fazia parte do pedido;
  - **Metas no workspace:** tela própria, aberta pelo pé do painel de Projetos (ao lado de "Ver todos") e pelo pé da
    seção Projetos do menu atual. Lista no `EnTable` (Meta, Situação, Progresso, Data-alvo, Dono, Projetos e marcos),
    com busca e ordenação. A meta abre no painel lateral: progresso, situação, data-alvo, dono, os projetos e os
    marcos ligados (de vários projetos), cada um com o seu progresso, e as atualizações. O proprietário do workspace
    e o dono da meta ligam projetos e marcos e publicam atualização (situação e texto); os outros só leem;
  - **Progresso da meta:** a média do progresso dos projetos e dos marcos ligados, nunca item a item. O progresso do
    projeto é a parte concluída das tarefas dele;
  - **Projeto sem acesso:** quem não participa de um projeto ligado vê a linha "Projeto sem acesso", com cadeado e
    sem nome, e o marco dele como "Marco de projeto sem acesso". O progresso continua na conta: a meta mostra o
    mesmo número para todos;
  - **Situação da meta:** a da última atualização, com as mesmas cores e ícones do Status do projeto.
- **Fronteira:** muda a página do projeto (aba Discussões e seção Marcos na Visão geral) e entra a tela Metas. O menu
  ganha só o atalho Metas e a entrada Discussões do projeto; a casca, as outras abas e o diretório ficam como na
  rodada 7.
- **Inventado (não existe no ENSPACE):** a discussão e as mensagens dela, o marco e a meta, com os campos em
  `metasEDiscussoes.ts`. Todos pedem back-end novo.
- **Em aberto:**
  - Discussões no workspace (fora de projeto): fica para depois, pelo pedido;
  - quem cria e edita marco, e se o marco pode ficar sem tarefa;
  - se a meta pode ligar outra meta (meta e submeta);
  - se o progresso da meta deve pesar projeto e marco de forma diferente.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-r8-discussoes.png`: a aba Discussões do Financeiro, com o anúncio fixado e a pergunta
    respondida;
  - `evidencias/entrega-r8-discussao-tarefa.png`: a pergunta aberta, com a resposta marcada e a tarefa criada a
    partir da mensagem;
  - `evidencias/entrega-r8-metas.png`: a meta aberta para a proprietária, com projetos, marcos e atualizações;
  - `evidencias/entrega-r8-meta-sem-acesso.png`: a mesma meta vista por quem só participa do Financeiro, com o
    Jurídico como "Projeto sem acesso".
  - O detector de seta passou nas 4. A captura da seção Marcos tinha a barra de rolagem da página e o detector marcou
    o topo dela (o falso positivo das rodadas 6 e 7); a captura saiu da entrega, e os marcos aparecem no painel da
    meta.

## Rodada 9 · 2026-11-26
- **Pedido (literal):** "esse botao ver todos deve sumir. metas ser um botao aí é pessimo tambem. deveria ser um menu
  aí dentro, assim como os próprios projetos são. pode botar um menu geral de projetos tambem [...] e nao ta clara a
  usabilidade das metas. como o progresso é marcado? [...] como os marcos sao criados. cade o crud de marcos?? [...]
  nao ta bem amarrado como vamos criar isso aí e nem como o andamento de cada coisa é definido. automaticamente? com o
  usuario indicando manualmente algum andamento? onde?"
- **Mudou no menu:**
  - o pé do painel de Projetos ("Ver todos" e o botão Metas) saiu;
  - o topo do painel ganhou 2 itens gerais, no mesmo desenho das linhas de projeto: **Todos os projetos** (o
    diretório, onde a pessoa já cai ao clicar em Projetos na trilha, com o número de projetos) e **Metas**. O item da
    tela aberta fica destacado;
  - no menu atual, Metas subiu para o topo da seção Projetos; o item "Projetos" da seção já abre o diretório.
- **Como o andamento é definido (a cadeia):**
  - **tarefa → marco:** o progresso do marco é automático: tarefas concluídas ÷ tarefas ligadas. Ninguém digita
    percentual. Marco sem tarefa fica em 0%. Marco concluído conta 100%;
  - **marco → meta automática:** a meta "Automático, pelos marcos" é a média dos marcos que contam: os ligados direto
    à meta e todos os marcos dos projetos ligados (cada marco conta 1 vez). O projeto entra pelos marcos dele; projeto
    sem marco aparece como "Sem marcos: não entra na conta", com o botão "Criar marco" para quem administra;
  - **meta por valor:** para o que não vem de tarefa (receita, contratos, percentual da carteira), a meta "Por um
    valor" tem valor inicial, valor-alvo e unidade (percentual, reais ou número). O dono informa o valor atual ao
    publicar a atualização, junto com a situação e o texto; o histórico guarda cada valor. Os projetos e marcos
    ligados ficam para acompanhar e não entram na conta;
  - **situação** (No prazo, Em risco, Atrasado) continua manual, na atualização, nos 2 modos;
  - a rodada 8 tirava a média de projetos e marcos juntos, contando o mesmo trabalho 2 vezes; a rodada 9 troca pela
    cadeia acima.
- **CRUD do marco: a aba Marcos do projeto** (também no menu do projeto, com o número de abertos):
  - lista com Abertos e Concluídos, responsável, data-alvo (vermelha quando passou) e progresso; o aviso "Como o marco
    avança" explica a regra no topo;
  - Novo marco: nome, descrição, responsável, data-alvo e tarefas;
  - o marco abre no painel lateral: progresso, tarefas (concluir, tirar do marco, adicionar), as metas para as quais
    conta, e no menu "⋯" Editar, Concluir (ou Reabrir) e Excluir;
  - concluir o marco tira dele as tarefas abertas, que continuam no projeto; a confirmação diz quantas;
  - excluir o marco tira ele das metas;
  - só o administrador do projeto cria, edita, conclui e exclui marco e liga tarefa; o participante vê e conclui a
    própria tarefa.
- **A tarefa entra no marco por 3 caminhos:** ao criar ou editar o marco, por "Adicionar tarefas" no painel do marco e
  pelo campo Marco da tarefa (coluna nova na aba Tarefas, trocada na própria linha, e campo na janela Nova tarefa).
  Cada tarefa fica em 1 marco; ligar a outro tira do anterior.
- **A Visão geral** mostra só os marcos abertos, com "Ver marcos"; cada cartão abre o marco na aba Marcos.
- **Nova meta e Editar meta:** o campo "Como medir" escolhe o modo, com a explicação de cada um; no modo por valor
  aparecem valor inicial, valor-alvo e unidade. A lista de metas ganhou a coluna "Como medir", e o progresso da meta
  por valor aparece como "6% de 20%". Proprietário do workspace e dono da meta editam e excluem.
- **Fronteira:** mudam o painel de Projetos e o menu atual (itens gerais no lugar do pé), a página do projeto (aba
  Marcos, coluna e campo Marco nas tarefas, seção da Visão geral) e a tela Metas. A casca, o diretório, as outras
  abas e as Discussões ficam como na rodada 8.
- **Inventado (não existe no ENSPACE):** o marco (com responsável, descrição, status e tarefas), o campo Marco da
  tarefa, o modo de medir da meta e o valor da atualização, em `metasEDiscussoes.ts`. Todos pedem back-end novo.
- **Em aberto:**
  - se o participante do projeto pode ligar a própria tarefa a um marco;
  - se a meta pode ligar outra meta (meta e submeta);
  - se o marco pode pesar mais que outro na média da meta;
  - se a meta por valor pode ler o número de um campo (soma de Valor Monetário de uma categoria) em vez de o dono
    informar.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-r9-aba-marcos.png`: o painel com Todos os projetos e Metas no topo e a aba Marcos do
    Financeiro;
  - `evidencias/entrega-r9-painel-do-marco.png`: o marco aberto, com o progresso pelas tarefas e a meta para a qual
    conta;
  - `evidencias/entrega-r9-coluna-marco.png`: a aba Tarefas com a coluna Marco;
  - `evidencias/entrega-r9-meta-automatica-participante.png`: a meta automática, com a fórmula e os marcos que contam
    (pelo projeto ou ligados à meta), vista por quem só participa do Financeiro;
  - `evidencias/entrega-r9-meta-por-valor.png`: a meta por valor, com "6% de 20%" e o campo Valor atual na
    atualização.
  - O detector de seta passou nas 5. A meta automática vista pela proprietária rola dentro do painel, e o detector
    marca a barra de rolagem (o falso positivo das rodadas 6 a 8); a captura saiu, e a da participante, que cabe sem
    rolagem, entrou no lugar.

## Rodada 10 · 2026-11-26
- **Pedido (literal), com os prints de um GitHub Project:**
  - quadro na aba Tarefas, além da lista;
  - "faz sentido valer somente para tarefa rápidas, esqueça as agendadas [...] pode tirar a ideia de tarefas
    agendadadas de todo o prototipo";
  - usar os conceitos do GitHub Project e da issue para amarrar as entidades e a usabilidade: barra lateral editável,
    relacionamentos, sub-issues, item e tarefa, o menu de adicionar, as visões tabela, quadro e roadmap;
  - "é importante que voce leia a docuemntaçao do github pra entender melhor esses relacionametnos e a interatividade
    pratica tambem";
  - e, no meio da rodada: "naquele prototipo de tarefas que voce olhou, um que ta no meu repo no github, tem a ideia
    de subtarefas. veja se voce fez igual, ok? pq é pra seguirem a mesma logica. pq aí quando colocarem em pratica
    aquele prototipo a subtask será criada e depois da pra reutilizar aí".
- **Pesquisa:** `pesquisa-de-mercado/runs/2026-11-26-github-projects-issues-relacoes/RELATORIO.md` (documentação do
  GitHub sobre Projects, issues, sub-issues, dependências e campos). Dela vieram 4 decisões:
  - o rascunho do GitHub (item sem repositório, que vira issue depois) é a tarefa sem item;
  - campo da issue mora na issue e campo do projeto só no projeto: a barra lateral da tarefa separa "Da tarefa" de
    "Neste projeto";
  - o rodapé "+" do quadro do GitHub (digitar e Enter cria o rascunho) é o rodapé da tabela;
  - arrastar no quadro grava o valor da coluna.
- **De-para GitHub → ENSPACE:**

  | GitHub | ENSPACE neste protótipo |
  |---|---|
  | Project | Projeto |
  | Issue | Tarefa rápida |
  | Draft issue | Tarefa sem item, só no projeto |
  | Repositório da issue | Item vinculado (categoria) |
  | Assignees | Responsável e Colaboradores |
  | Labels | Etiquetas |
  | Milestone | Marco (campo do projeto) |
  | Sub-issue | Subtarefa |
  | Pull request | Os itens das categorias (aba Itens) |
  | Table, Board | Tabela, Quadro |
  | Roadmap | Fica em aberto |

- **Só tarefa rápida:** a tarefa agendada saiu do protótipo (coluna Origem, coluna Tipo, filtro e textos). O item
  "Agendadas" do menu atual fica, porque é a casca copiada do produto (regra 37).
- **Quadro:** o `EnKanbanBoard` do SDK, com 1 coluna por status (Pendente, Em andamento, Bloqueada, Concluída).
  - Arrastar o cartão grava o status; "Enviar para" no menu do cartão faz o mesmo sem arrastar.
  - O cartão mostra o responsável, a data limite e 2 etiquetas: o item (ou "Sem item") e a divisão ("1/3" na mãe,
    "Subtarefa" na subtarefa, com o nome da mãe na dica).
  - O cartão do SDK tem altura fixa: a descrição não cabia junto das etiquetas e saiu do cartão. O título sai com
    cada palavra em maiúscula (comportamento do SDK).
  - "Arquivar" no menu do cartão só mostra um aviso de maquete.
- **A tarefa abre num painel lateral** (clique na linha ou no cartão), no modelo da issue:
  - à esquerda: título e descrição editáveis, Subtarefas e Relacionamentos (item vinculado, com "Abrir na categoria",
    e a tarefa-mãe);
  - à direita, **Da tarefa:** Responsável, Colaboradores, Status, Prioridade, Data limite, Pontos, Etiquetas e Item
    (no máximo 1);
  - à direita, **Neste projeto:** Projeto (só leitura: vem da categoria do item, ou é o projeto da tarefa sem item) e
    Marco (só o administrador do projeto troca);
  - menu "⋯": Copiar link e Excluir tarefa.
- **Subtarefas, iguais às do protótipo `pasta-de-apontamentos`** (rodadas 2 e 5 de lá), para o dev construir 1 vez e
  usar nos 2 lugares:
  - o mesmo campo novo `parent` (aqui `mae`), 1 nível só: a subtarefa não tem subtarefas;
  - a subtarefa é uma tarefa rápida inteira, com responsável, data, prioridade e pontos;
  - a linha de criação igual: título, responsável, data, prioridade e pontos; Enter salva e deixa a linha aberta; Esc
    cancela;
  - "Vincular tarefa existente" (tarefa do projeto, sem mãe e sem subtarefas) e "Desvincular";
  - contagem "1 de 3 concluídas" e a soma dos pontos;
  - na lista e no quadro, a subtarefa só aparece com "Mostrar subtarefas como cartões" ligado; a mãe mostra
    "Subtarefas: 1 de 3" e a subtarefa, "Parte de <mãe>";
  - concluir a mãe com subtarefa aberta oferece concluir as abertas, num aviso com o botão;
  - os textos são os de lá, nos 3 idiomas.
  - O bloqueio entre tarefas fica no `pasta-de-apontamentos` e não entrou aqui.
- **Tarefa rápida no rodapé da tabela:** digitar o título e Enter cria a tarefa sem item no projeto, com a pessoa como
  responsável e a data de hoje. "Tarefa num item" abre a janela Nova tarefa.
- **Do produto (lido no código do ENSPACE):** a tarefa rápida tem status, prioridade, responsável, colaboradores, data
  limite, descrição, etiquetas, pontos e até 1 item. Não tem tarefa-mãe nem relacionamento com outra tarefa.
- **Inventado (pede back-end novo):** a tarefa-mãe (`parent`), o projeto da tarefa sem item e o marco da tarefa.
- **Fronteira:** mudam a aba Tarefas do projeto (Tabela e Quadro, subtarefas, rodapé) e o painel da tarefa, que é
  novo. A casca, a Visão geral, Itens, Marcos, Discussões, Automações e Metas ficam como na rodada 9.
- **Não provado:** o gesto de arrastar o cartão. A extensão do Chrome não dispara o arraste do quadro do SDK; o
  "Enviar para", que chama a mesma função, foi testado e move o cartão.
- **Em aberto:**
  - a visão Roadmap (tarefas numa linha do tempo pelas datas);
  - "Adicionar tarefa existente" no rodapé, como o "Add item from repository" do GitHub;
  - converter a tarefa sem item em item de uma categoria, como o rascunho que vira issue.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-r10-tarefa-com-subtarefas.png`: a tarefa aberta, com 3 subtarefas, os pontos e a barra
    lateral em "Da tarefa" e "Neste projeto";
  - `evidencias/entrega-r10-quadro-de-tarefas.png`: o quadro com a busca "fe" e as subtarefas ligadas, mostrando
    "1/3" na mãe e "Subtarefa" no cartão da subtarefa;
  - `evidencias/entrega-r10-subtarefa-em-ingles.png`: a subtarefa aberta em inglês, com "Part of" e a tarefa-mãe em
    Relationships.
  - O detector de seta passou nas 3. O quadro sem busca rola a página, e o detector marca a barra de rolagem (o falso
    positivo das rodadas 6 a 9); a captura saiu, e a com busca, que cabe sem rolagem, entrou no lugar.

## Rodada 11 · 2026-11-26
- **Pedido (literal):**
  - "na hora de adicionar tarefas ao marco deve ter atalho pra criar uma nova na base do dropdown tambem";
  - "na hora de criar metaas, o dorpdown deve seguir a mesma logica: deve ser possivel criar um novo projeto, rciar
    um novo marco... veja quais dropdowns devem ter algo assim no prototipo TODO. é lógica de sempre ter atalho pra
    facilitar o user".
- **A regra:** todo seletor que escolhe uma coisa que a pessoa pode criar tem, no pé, o atalho de criar, como o
  "Create new issue" no fim dos menus do GitHub. O atalho mora em `_AtalhoDeCriar.vue` e os textos em
  `textosDeAtalhos.ts` (PT, EN e ES).
  - Com texto na busca, o botão diz o que cria ("Criar o marco "Auditoria anual"") e cria com esse nome.
  - Sem texto, o botão leva o foco para a busca e mostra a dica ("Digite o nome do novo marco na busca.").
  - O novo já sai escolhido no seletor, com um aviso.
  - O marco criado fora de um projeto (na meta) pergunta o projeto: 1 botão por projeto que a pessoa administra.
- **Onde entrou (13 seletores):**

  | Tela | Seletor | Cria | Como nasce |
  |---|---|---|---|
  | Painel do marco | Adicionar tarefas | Tarefa | sem item, no projeto, a pessoa responsável, data limite = data-alvo do marco; entra no marco |
  | Novo marco e Editar marco | Tarefas | Tarefa | a mesma, com a data-alvo do formulário |
  | Painel da meta | Ligar projetos | Projeto | só o nome, a pessoa como administradora, visibilidade Aberto; a tela fica na meta |
  | Painel da meta | Ligar marcos | Marco | no projeto escolhido, a pessoa responsável, data-alvo = a da meta |
  | Nova meta e Editar meta | Projetos ligados | Projeto | como no painel |
  | Nova meta e Editar meta | Marcos ligados | Marco | como no painel, com a data-alvo do formulário |
  | Painel da tarefa | Etiquetas | Etiqueta | só o nome; nome repetido usa a que existe |
  | Painel da tarefa | Marco | Marco | no projeto, data-alvo = data limite da tarefa; só quem administra o projeto |
  | Aba Tarefas, coluna Marco | Marco | Marco | como no painel da tarefa |
  | Janela Nova tarefa | Categoria | Categoria | no projeto, sem campos |
  | Janela Nova tarefa | Marco | Marco | como no painel da tarefa |
  | Configurações do projeto, Categorias | Adicionar categoria do workspace | Categoria | no projeto, sem campos |
  | Criar projeto | Categorias do projeto | Categoria | no workspace, já escolhida; entra no projeto quando ele é criado |

- **Onde não entrou, e por quê:**
  - filtros, período, paginação, ordenação, status, prioridade, situação, papel, visibilidade, unidade, formato e
    "Como medir": a lista é fixa, nada se cria;
  - pessoas (responsável, dono, participantes, colaboradores): pessoa entra no workspace por convite, fora do
    projeto. Fica em aberto se o atalho "Convidar pessoa" entra aqui;
  - Item da tarefa: criar item pede o formulário da categoria, que o protótipo não tem;
  - "Vincular tarefa existente" da subtarefa: "Adicionar subtarefa" fica ao lado;
  - modelo do Criar projeto, painel do Painel, categoria do Novo fluxo e da tarefa criada da discussão, destino do
    Mover categoria: criar ali tira a pessoa da tarefa que ela está fazendo. Ficam em aberto.
- **Corrigido de passagem:** os contadores de id ficavam dentro de `useProjetos()`, e cada componente recomeçava a
  conta. A categoria criada nas Configurações e a criada no Criar projeto saíam com o mesmo id, e a segunda
  aparecia com o nome da primeira. Os contadores foram para fora do composable.
- **Comportamento a decidir:** o que o atalho cria fica criado mesmo quando a pessoa cancela a janela (a categoria
  da Nova tarefa, o projeto da Nova meta), como a etiqueta criada no menu do GitHub.
- **Fronteira:** mudam os 13 seletores da tabela. A casca e o resto das telas ficam como na rodada 10.
- **Inventado (pede back-end novo):** o marco e a etiqueta da tarefa rápida criados no seletor seguem o que a
  rodada 9 e a rodada 10 já inventaram. Projeto e categoria usam a criação que o protótipo já tinha, com menos
  campos.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-r11-criar-tarefa-no-marco.png`: "Adicionar tarefas" no painel do marco, com "Criar a tarefa
    "Separar os comprovantes"";
  - `evidencias/entrega-r11-criar-marco-na-meta.png`: "Marcos ligados" na Nova meta, com 1 botão por projeto;
  - `evidencias/entrega-r11-criar-projeto-na-meta.png`: "Projetos ligados" na Nova meta, com "Criar o projeto";
  - `evidencias/entrega-r11-criar-etiqueta-na-tarefa.png`: Etiquetas no painel da tarefa, com "Criar a etiqueta".
  - O detector de seta passou nas 4.

## Rodada 12 · 2026-11-26
- **Pedido (literal):**
  - "dentro do projeto deve ser possivel ver tambem as metas ligadas a ele";
  - "na tela de metas, projetos e marcos devem ser duas colunas diferentes";
  - "pode só colocar "marcos" e todos ali obviamente contam.";
  - "na ordem das abas do projeto deve vir visao geral, itens e depois tarefas.";
  - "a coluna seu acesso nao tem nada a ver. deve ter uma coluna de açoes, como toda tabela do enspce, e essa coluna
    de açao pode ter a açao de mostrar ou ocultar no menu, dentre outras opçoes que façam sentido (editar,
    deletar...)";
  - "observe todas as outras tabelas e veja em quais falta coluna de açao... nao consigo finalizar um marco pela
    tabela direto";
  - "a sidebar de configuraçoes do projeto deve carregar o exato mesmo formulario da criaçao do projeto [...] tem
    que ser uma sidebar, e tem que ter as mesmas abas";
  - "veja se da pra deixar com MENOS abas. condensar mais. participantes e acesso com certeza deveriam ser a mesma
    aba";
  - "nao ta clara essa configuraçao dos valores dos status ok?";
  - "o campo de referencia do projeto deve copiar o nome [...] na ediçao nao pode mais ser alterado".
- **Como a meta sabe o andamento do projeto:**
  - a meta automática tem 1 lista só, "Marcos", e o andamento dela é a média de todos os marcos da lista;
  - a lista junta os marcos ligados um a um e todos os marcos dos projetos ligados, inclusive os criados depois;
  - o projeto aparece na meta quando está ligado ou quando tem um marco ligado;
  - o andamento do projeto na meta é a média dos marcos dele que estão na lista;
  - na meta medida por valor, as listas só acompanham: o andamento é o valor que o dono informa.
- **Metas:** a tabela tem as colunas Projetos e Marcos, separadas, e a coluna Ações (Abrir meta, Editar meta,
  Excluir meta). O painel da meta tem 2 seções:
  - Projetos: cada projeto diz como entrou ("Projeto ligado: os 2 marcos dele estão na meta" ou "1 marco ligado à
    meta") e o andamento dele na meta. O projeto que só está ali pelos marcos não tem o X: sai quando os marcos saem;
  - Marcos: a lista única. O marco que vem do projeto ligado não tem o X: sai quando o projeto sai.
- **Metas dentro do projeto:** a Visão geral ganhou a seção Metas, abaixo de Marcos. Cada linha diz como o projeto
  entra na meta, o dono, a data-alvo, a situação, "Este projeto: N%" e o andamento da meta. Clicar abre o painel da
  meta; "Ver metas" leva à tela Metas.
- **Abas do projeto:** Visão geral, Itens, Tarefas, Marcos, Discussões, Automações e Painéis. O menu lateral fica
  como estava.
- **Coluna Ações:** onde entrou e o que tem.

  | Tela | Ações |
  |---|---|
  | Todos os projetos | Abrir a página do projeto, Mostrar ou Ocultar no meu menu, Copiar o link; quem administra: Configurações do projeto e Arquivar ou excluir. Sem acesso: Pedir acesso. Arquivado: Restaurar |
  | Metas | Abrir meta, Editar meta, Excluir meta |
  | Tarefas do projeto | Abrir, Concluir ou Reabrir, Copiar link, Excluir tarefa (com confirmação) |
  | Itens do projeto | Visualizar, Abrir na categoria, Copiar link |
  | Marcos | Abrir, Copiar link; quem administra: Editar, Concluir ou Reabrir, Excluir |
  | Discussões | Abrir, Copiar link; quem modera: Fixar, Fechar ou Reabrir |

  - A coluna "Seu acesso" do diretório saiu. A coluna Ações fica fora do seletor de colunas.
  - **Achado (casca, regra 37):** Minhas tarefas e a lista da categoria são cópia do produto e não ganharam a coluna
    Ações nesta rodada. Automações são cartões, com o menu ⋯ que já tinham.
- **Criar e configurar projeto num formulário só:** `_FormularioDoProjeto.vue` substitui `_CriarProjeto.vue` e
  `_ConfiguracoesDoProjeto.vue`. É a mesma sidebar, com as mesmas abas, para criar e para editar.
  - As abas passaram de 6 para 3: Geral, Categorias e campos, Acesso e segurança. Participantes, visibilidade,
    permissão padrão e pedidos de acesso ficam juntos em Acesso e segurança.
  - Só na criação: "Começar de" (o modelo). Só na edição: Salvar como modelo, Arquivar e excluir (no fim de Geral) e
    os pedidos de acesso.
  - "Arquivar ou excluir", no diretório, abre a sidebar já rolada até a seção. As abas ficam fixas no topo durante a
    rolagem.
  - O que antes só se definia nas configurações (categorias e os campos delas, permissão padrão, participantes) já
    se define na criação.
- **Categorias e campos:** cada categoria é um cartão com 2 blocos.
  - "Campos na aba Itens do projeto": qual campo da categoria é o Responsável, o Prazo e o Status do projeto.
  - "Grupos do status": diz que cada categoria tem os próprios valores de status e que, no projeto, eles se juntam em
    3 grupos (A fazer, Em andamento, Concluído), que são as colunas do quadro de itens e o filtro de status. A tabela
    mostra cada valor da categoria, uma seta e o grupo escolhido. Antes, "Colunas do quadro" não dizia de onde
    vinham os valores nem para onde iam.
- **Referência do projeto:** na criação, preenche sozinha a partir do nome (minúsculas, sem acento, hífen no lugar do
  espaço), como na criação de categoria e campo. A pessoa pode mudar até criar; depois de mexer, o nome não reescreve
  mais. Valida o formato e a repetição. Na edição, fica só para consulta, com cadeado.
- **Coluna Ações à esquerda, com ⋮:** a pedido da redatora, "a coluna de açoes é sempre a primeira da esquerda e os 3
  pontinhos sao na vertical. em todas as tabelas. o enspace tem esse padrao."
  - Tarefas, Itens, Metas e Todos os projetos têm Ações como 1ª coluna, e o menu abre para a direita.
  - Em Itens, a caixa de seleção do EnTable continua antes de Ações: ela vem do componente.
  - As listas de Marcos e Discussões levam o ⋮ no início da linha, pelo mesmo padrão.
  - A lista de categorias do formulário e o topo dos painéis de meta, marco, discussão e tarefa trocam o ⋯ pelo ⋮ (o
    topo dos painéis, com o sim da redatora). O menu da casca e os cartões de projeto ficam como estavam.
- **Andaime sem as chaves de marcação:** "Mostrar o que muda" e "Mostrar o que pede back-end novo" saíram da barra do
  protótipo, a pedido da redatora: "é tudo novidade nessa tela de projetos".
- **Fronteira:** mudam Metas, Visão geral do projeto, a ordem das abas, as tabelas e listas da coluna Ações e a
  sidebar de criar e configurar. A casca e o menu lateral ficam como na rodada 11.
- **Inventado (pede back-end novo):** meta, marco, projeto e referência do projeto já eram propostas das rodadas
  anteriores. Os grupos do status, a referência fixa e a exclusão da tarefa pela tabela seguem o que essas rodadas
  inventaram.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-r12-metas-tabela.png`: Metas com as colunas Projetos, Marcos e Ações;
  - `evidencias/entrega-r12-painel-da-meta.png`: painel da meta com Projetos e a lista única de Marcos;
  - `evidencias/entrega-r12-visao-geral-metas.png`: seção Metas na Visão geral, com "Este projeto: 27%";
  - `evidencias/entrega-r12-marcos-acoes-da-linha.png`: menu ⋯ na linha do marco, com Concluir;
  - `evidencias/entrega-r12-diretorio-acoes.png`: coluna Ações em Todos os projetos;
  - `evidencias/entrega-r12-criar-projeto-geral.png`: Criar projeto com a referência preenchida pelo nome;
  - `evidencias/entrega-r12-criar-projeto-categorias.png`: Categorias e campos na criação, com os grupos do status;
  - `evidencias/entrega-r12-configurar-geral.png`: a mesma sidebar na edição, com a referência travada;
  - `evidencias/entrega-r12-configurar-categorias.png`: Categorias e campos na edição;
  - `evidencias/entrega-r12-configurar-acesso.png`: Acesso e segurança, com participantes e visibilidade juntos.
  - O detector de seta passou nas 10. Em 4, a barra de rolagem dava falso positivo; os prints foram refeitos com a
    barra escondida por CSS temporário na página.

## Rodada 13 · 2026-11-27

- **Pedido da redatora:** "\"mostrar no meu menu\" deve ser opçao \"adicionar ao menu\" e na hora que editar o menu
  aparece salvar pra mim ou salvar pra todos se for o owner. se for user comum é só salvar pra ele." e "deve haver uma
  coluna na tabela do projeto de oculto ou visivel no menu. coluna de visibilidade".
- **De onde vem a regra:** lida no código do front do ENSPACE (develop, 2026-11-27), na barra de informações do item e
  na barra de pastas:
  - a mudança pessoal salva na hora; o aviso diz "Só para você." e traz Desfazer;
  - "Para todos" aparece só para quem administra (Proprietário, quem cria e edita na categoria ou o Full, quando o
    workspace permite) e pede confirmação, com os botões Cancelar e "Salvar para todos";
  - o "Para todos" muda o padrão para quem não personalizou o seu; quem personalizou fica com o dele;
  - os rótulos do produto: "Só para mim", "Para todos", "Salvar para todos", "Aplicar minha ordem para todos".
- **No protótipo:**
  - "Mostrar no meu menu" virou "Adicionar ao menu", e "Ocultar do meu menu" virou "Ocultar do menu";
  - usuário comum: a opção salva direto, só para ele, com o aviso "Só para você." e Desfazer;
  - Proprietário e Full: a mesma opção abre "Salvar para mim" e "Salvar para todos". No topo da página do projeto, o
    botão abre as 2 escolhas;
  - "Salvar para todos" pede confirmação ("Adicionar ao menu de todos?" ou "Ocultar do menu de todos?") e muda a
    opção "Mostrar no menu de todos os participantes" do projeto;
  - projeto que está no menu de quem administra, mas não no de todos, ganha o atalho "Adicionar ao menu de todos";
  - Todos os projetos ganhou a coluna "Visibilidade no menu": Visível ou Oculto no menu de quem vê, e "No menu de
    todos" embaixo quando o projeto vai para o menu de todos. Projeto sem acesso ou arquivado fica sem valor;
  - o nome da coluna leva "no menu" porque a coluna Visibilidade (Aberto, Fechado, Privado) já existe e diz quem vê o
    projeto.
- **Fora desta rodada:** a ordem do menu continua só pessoal. O "Aplicar minha ordem para todos" das pastas fica para
  quando a redatora pedir.
- **Fronteira:** mudam as opções de menu do projeto (menu lateral, Todos os projetos e página do projeto) e a tabela
  de Todos os projetos. A casca fica como estava.
- **Ver:** https://pernalombr4.github.io/prototipos/projetos
  - `evidencias/entrega-r13-pagina-salvar-para-mim-ou-todos.png`: Proprietária no topo da página, com as 2 escolhas;
  - `evidencias/entrega-r13-confirmar-para-todos.png`: a confirmação do "Salvar para todos";
  - `evidencias/entrega-r13-coluna-visibilidade-no-menu.png`: a coluna Visibilidade no menu;
  - `evidencias/entrega-r13-usuario-comum-so-para-voce.png`: usuário comum adiciona ao menu, com "Só para você." e
    Desfazer.
  - O detector de seta passou nas 4. A da página foi refeita com a barra de rolagem escondida por CSS temporário.

## Modelo de dados · 2026-11-27

- **O que é:** o diagrama de entidade e relacionamento do protótipo e 18 brechas nas relações, em
  `MODELO-DE-DADOS.md`. Nenhuma tela mudou.
- **As que mais pesam:** mover categoria deixa o marco com tarefas de outro projeto (B9); a subtarefa entra em outro
  marco que a mãe (B10); excluir projeto deixa marcos, discussões e painéis sem dono (B12); o marco só entra numa meta
  pela meta (B1); ligar o projeto à meta conta todos os marcos (B6).
- **Próximo passo:** a redatora escolhe quais brechas viram rodada e responde P1 a P5.

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
    1565,103 com ela rolada); a marca acompanha a barra e a imagem não tem ponteiro. Falso positivo a confirmar com
    a redatora; o ajuste do detector fica fora deste repositório.

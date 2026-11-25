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

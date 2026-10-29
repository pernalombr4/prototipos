# 1. Escolher e entrar

**Objetivo:** a pessoa entende que esta tela só escolhe onde entrar e entra no workspace dela em 1 clique, pelo card ou
pela lista. Usa só o que a API já tem.

**Onde vale:** a tela `/workspaces`, a primeira depois do login.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces.

## Cabeçalho (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O cabeçalho deve saudar a pessoa pelo primeiro nome: "Olá, {primeiro nome}". | Com o usuário "Mariana Duarte", aparece "Olá, Mariana". | Importante | Obrigatório |
| RF002 | A tela deve ter o título `h1` "Escolha um workspace para entrar". | O leitor de tela anuncia o título como cabeçalho de nível 1. | Essencial | Obrigatório |
| RF003 | Abaixo do título, a tela deve mostrar "Workspace é o espaço da sua empresa no ENSPACE. É **dentro** de um deles que o seu trabalho acontece." | Só "dentro" fica em negrito. | Essencial | Obrigatório |
| RF004 | O botão "Criar workspace" deve ficar no canto superior direito, como hoje, com borda e sem cor cheia. | O botão não tem cor cheia. | Essencial | Obrigatório |
| RF005 | O botão "Criar workspace" deve ter o tooltip "Cria um workspace vazio, só com você dentro." | Passar o mouse no botão mostra o tooltip. | Desejável | Desejável |

## Barra da lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF022 | A barra deve ter as abas à esquerda e, à direita, Ordenar e o alternador de visualização. | Ordenar e o alternador ficam na mesma linha das abas no computador. | Essencial | Obrigatório |
| RF024 | A aba "Todos ({n})" deve contar os workspaces da pessoa, sem os ocultos (RN903). | A contagem bate com os cards que a aba mostra. | Essencial | Obrigatório |
| RF025 | Ordenar deve ser um menu suspenso com o rótulo "Ordenar: {critério curto}" e os critérios da tabela abaixo. | Escolher "Criados por último" faz o botão dizer "Ordenar: Mais novos". | Essencial | Obrigatório |
| RF026 | O alternador deve ter 2 botões de ícone, "Ver em cards" (padrão) e "Ver em lista". | A tela abre em cards. | Importante | Obrigatório |

**Critérios de ordenação (RF025)**

| Opção no menu | No botão | Regra |
|---|---|---|
| Criados por último | Mais novos | `created_at` mais recente primeiro |
| Criados primeiro | Mais antigos | `created_at` mais antigo primeiro |
| Nome, de A a Z | Nome | ordem alfabética (pt-BR) |

## Card (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF028 | O card inteiro deve ser o alvo de Entrar: o nome é um link estendido sobre o card, e os controles do card ficam acima do link. | Clicar no card entra; clique do meio abre em nova aba; Tab para no card 1 vez. | Essencial | Obrigatório |
| RF030 | O ícone do card deve usar a cor de identidade da `reference` (RN901). | O mesmo workspace tem a mesma cor em cada visita. | Importante | Obrigatório |
| RF031 | O selo da licença deve vir do `type` do membro, e não do papel (`role`): `owner` é "Proprietário", `full` é "Full", `standard` é "Membro" e `viewer` é "Leitor". | Um membro `standard` com papel de administrador mostra "Membro". | Essencial | Obrigatório |
| RF032 | Sem descrição, o card deve ficar sem a linha da descrição. | Um workspace sem descrição não mostra "Sem descrição". | Importante | Obrigatório |
| RF033 | À direita do rodapé, o card deve mostrar "Entrar →". | Cada card mostra "Entrar →". | Essencial | Obrigatório |

## Visualização em lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF036 | A lista deve usar o `EnTable` do `@be-enlighten/enspace-sdk-ui`, com as colunas "Workspace", "Descrição", "Licença" e a de ações, sem título. | A lista é um `EnTable` com as 4 colunas, nessa ordem. | Importante | Obrigatório |
| RF037 | A coluna Workspace deve mostrar o ícone e o nome. | Um nome longo termina em reticências. | Importante | Obrigatório |
| RF038 | Sem descrição, a coluna Descrição deve mostrar "{n} pessoas". | Nenhuma célula da coluna fica vazia. | Importante | Obrigatório |
| RF040 | Clicar numa linha deve entrar no workspace. | Clicar na linha de Vértice Log entra em Vértice Log. | Essencial | Obrigatório |

## Sem workspace (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF043 | Sem workspace, a tela deve mostrar "Você ainda não faz parte de nenhum workspace", a orientação de pedir convite a quem administra o ENSPACE e o botão de cor cheia "Criar um workspace". | "Criar um workspace" tem cor cheia porque é a única saída. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Se esta parte sair antes de "4. Recentes e favoritos": a tela com 1 workspace só mostra o card sozinho? A ordem padrão é "Criados por último" ou "Nome, de A a Z"? A barra mostra a aba "Todos" sozinha? | produto | Ganha o estado com 1 workspace, o critério padrão de Ordenar e a regra das abas |

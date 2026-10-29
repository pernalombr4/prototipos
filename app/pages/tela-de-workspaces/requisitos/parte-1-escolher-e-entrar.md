# 1. Escolher e entrar

**Objetivo:** a pessoa entende que esta tela só escolhe onde entrar e entra no workspace dela em 1 clique, pela busca,
pelo card ou pela lista. Usa só o que a API já tem.

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

## Busca (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF006 | A busca deve ficar abaixo da explicação, com o placeholder "Buscar entre seus {n} workspaces", em que {n} é o número da aba "Todos". | Com 17 na aba "Todos", o placeholder diz "Buscar entre seus 17 workspaces". | Essencial | Obrigatório |
| RF007 | Com menos de 2 workspaces, a tela deve esconder a busca. | Na tela sem workspace, não há campo de busca. | Importante | Obrigatório |
| RF008 | O fim do campo deve mostrar a tecla `/` com o campo vazio e o botão "Limpar busca" com texto. | Digitar uma letra troca a tecla `/` pelo botão de limpar. | Importante | Obrigatório |
| RF010 | As teclas `/` e `Ctrl+K` (`⌘K` no Mac) devem pôr o foco na busca, com a página rolada até o topo. | Com a página rolada até o fim, `/` leva ao topo com o cursor no campo. | Desejável | Desejável |
| RF011 | Na busca, Enter deve entrar no primeiro resultado que não seja convite. | Buscar "vertice" e apertar Enter entra em Vértice Log. | Desejável | Desejável |
| RF012 | Na busca, Esc deve limpar o texto. | Apertar Esc esvazia o campo e a lista volta inteira. | Desejável | Desejável |
| RF013 | Com texto no campo, a dica dos atalhos Enter e Esc deve aparecer abaixo do campo. | Digitar uma letra mostra a dica. | Desejável | Desejável |
| RF014 | A busca deve ignorar acento e maiúscula e procurar em nome, `reference` e descrição. | "saude" acha "Aurora Saúde Homologação". | Essencial | Obrigatório |
| RF015 | Sem resultado, a tela deve mostrar "Nenhum workspace com "{termo}"", com a orientação de pedir acesso a quem administra o ENSPACE na empresa. | Buscar "xyz" mostra a mensagem. | Essencial | Obrigatório |

## Convite pendente (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF016 | Cada convite pendente deve aparecer no topo como aviso, com "{quem} convidou você para {workspace}" e os botões "Aceitar convite" e "Recusar". | O convite de Lumen Contábil mostra "Rodrigo Petrone convidou você para Lumen Contábil". | Essencial | Obrigatório |
| RF017 | O convite deve aparecer também como card na lista, com borda tracejada, o selo "Convite pendente" e os botões "Aceitar" e "Recusar". | O card fica na lista com o aviso no topo. | Essencial | Obrigatório |
| RF018 | O card de convite deve responder só aos botões "Aceitar" e "Recusar". | Clicar no corpo do card de convite não faz nada. | Essencial | Obrigatório |
| RF019 | "Aceitar" deve transformar o convite em card comum. | Depois de aceitar, o card ganha "Entrar →", e clicar nele entra no workspace. | Essencial | Obrigatório |
| RF020 | "Recusar" deve tirar o workspace da tela. | O aviso e o card somem; a aba "Todos" conta 1 a menos. | Essencial | Obrigatório |
| RF021 | Enquanto houver texto na busca, os avisos de convite do topo devem sumir. | Digitar "rh" esconde o aviso de Lumen Contábil. | Importante | Obrigatório |

## Barra da lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF022 | A barra deve ter as abas à esquerda e, à direita, Ordenar e o alternador de visualização. | Ordenar e o alternador ficam na mesma linha das abas no computador. | Essencial | Obrigatório |
| RF024 | A aba "Todos ({n})" deve contar os workspaces da pessoa, com os convites e sem os ocultos (RN903), sem o filtro da busca. | A contagem bate com os cards que a aba mostra sem busca. | Essencial | Obrigatório |
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
| RF033 | À direita do rodapé, o card deve mostrar "Entrar →". | Cada card que não é convite mostra "Entrar →". | Essencial | Obrigatório |

## Visualização em lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF036 | A lista deve usar o `EnTable` do `@be-enlighten/enspace-sdk-ui`, com as colunas "Workspace", "Descrição", "Licença" e a de ações, sem título. | A lista é um `EnTable` com as 4 colunas, nessa ordem. | Importante | Obrigatório |
| RF037 | A coluna Workspace deve mostrar o ícone e o nome e, na linha de convite, o selo "Convite pendente". | Um nome longo termina em reticências. | Importante | Obrigatório |
| RF038 | Sem descrição, a coluna Descrição deve mostrar "{n} pessoas"; no convite, "{quem} convidou você". | Nenhuma célula da coluna fica vazia. | Importante | Obrigatório |
| RF039 | A coluna de ações deve mostrar "Aceitar" e "Recusar" só na linha de convite. | A linha comum não tem botão "Entrar". | Importante | Obrigatório |
| RF040 | Clicar numa linha que não é convite deve entrar no workspace. | Clicar na linha de Vértice Log entra; clicar na linha de convite não entra. | Essencial | Obrigatório |

## Sem workspace (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF043 | Sem workspace, a tela deve mostrar "Você ainda não faz parte de nenhum workspace", a orientação de pedir convite a quem administra o ENSPACE e o botão de cor cheia "Criar um workspace". | "Criar um workspace" tem cor cheia porque é a única saída. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Se esta parte sair antes de "3. Recentes e favoritos": a tela com 1 workspace só mostra o card sozinho? A ordem padrão é "Criados por último" ou "Nome, de A a Z"? A barra mostra a aba "Todos" sozinha? | produto | Ganha o estado com 1 workspace, o critério padrão de Ordenar e a regra das abas |
| P004 | A API de hoje já traz o nome de quem convidou? | dev do back-end | Se não traz, trazer o nome é obra nova nesta parte |

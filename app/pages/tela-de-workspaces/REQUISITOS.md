# Requisitos: tela de entrada (Workspaces)

**Objetivo:** a pessoa entende que esta tela só escolhe onde entrar, entra no workspace dela em 1 clique e não
confunde "Criar workspace" com abrir chamado.

**Onde vale:** a tela `/workspaces`, primeira depois do login, e o modal "Criar workspace" que abre sobre ela.

**Referência visual:** protótipo navegável em https://pernalombr4.github.io/prototipos/tela-de-workspaces,
aprovado em 14/10/2026 e revisado até 19/10/2026. Código, textos nos 3 idiomas e decisões em
https://github.com/pernalombr4/prototipos/tree/main/app/pages/tela-de-workspaces. A barra inferior do protótipo
(estado, tema, idioma, "Por trás") é ferramenta de revisão e não entra no produto.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Fora do escopo:** a barra do topo (ENSPACE, Suporte, avatar) continua como está.

## Resumo

| Requisitos | Grupo | O que muda em relação ao develop de 16/09/2026 |
|---|---|---|
| R1 a R5 | Cabeçalho | A tela ganha título e explicação; hoje não tem `h1`. "Criar workspace" fica no topo, mas deixa de ser o botão de cor cheia |
| R6 a R13 | Busca | Atalho de teclado, busca sem acento e por etiqueta; os resultados sobem para logo abaixo do campo |
| R14 a R18 | Convite pendente | Hoje é um card apagado, sem ação visível. Passa a ter aviso no topo e card com Aceitar e Recusar |
| R19 a R26 | Bloco do topo e padrão | Hoje não existe. Mostra o último acessado com o botão "Entrar em {nome}" e permite abrir direto no login |
| R27 a R35 | Barra da lista | Abas com contagem certa, Agrupar e Ordenar como no ClickUp, Visibilidade e o alternador cards/lista |
| R36 a R46 | Card | O card inteiro vira o alvo de Entrar; some o "Sem descrição"; o rodapé mostra o último acesso |
| R47 a R51 | Visualização em lista | Alternativa ao card, com o `EnTable` do produto |
| R52 a R57 | Grupos | Hoje não existe. Por licença ou por etiqueta, recolhíveis |
| R58 a R61 | Menu "⋯" | Hoje não existe. Padrão, etiquetas, ocultar e sair; para o proprietário, excluir |
| R62 a R70 | Ocultos | Hoje não existe. Tirar da lista sem perder o acesso; os ocultos ficam numa seção recolhível no fim da lista |
| R71 a R81 | Etiquetas pessoais | Hoje não existe. Etiquetas que só a pessoa vê, para agrupar |
| R82 a R84 | Sair do workspace | Hoje não existe nesta tela |
| R85 a R109 | Criar workspace | 1 decisão por vez; só o nome é obrigatório; ícone deixa de ser obrigatório; logo da empresa por upload; o passo 2 vira a Central de casos de uso, como a do protótipo do menu lateral |
| R110 a R115 | Estados | Carregando, só um workspace, nenhum, erro e sem etiquetas |
| R116 a R120 | Dados | O que a API já tem e o que precisa acrescentar |
| R121 a R126 | Componentes e acessibilidade | Tema, idioma, movimento e teclado |

## Cabeçalho

| ID | Requisito | Critério de aceite |
|---|---|---|
| R1 | O cabeçalho deve saudar pelo primeiro nome: "Olá, {primeiro nome}". | Com o usuário "Mariana Duarte", aparece "Olá, Mariana". |
| R2 | A tela deve ter o título `h1` "Escolha um workspace para entrar". | O leitor de tela anuncia o título como cabeçalho de nível 1. |
| R3 | Abaixo do título, a explicação: "Workspace é o espaço da sua empresa no ENSPACE. É **dentro** de um deles que o seu trabalho acontece.", com "dentro" em negrito. | O texto aparece inteiro, com só "dentro" em negrito. |
| R4 | "Criar workspace" deve ficar no canto superior direito, como hoje, em botão com borda, cor neutra e ícone `+`. | O botão de cor cheia da tela é o "Entrar em {nome}" (R22), não o "Criar workspace". |
| R5 | "Criar workspace" deve ter o tooltip "Cria um workspace vazio, só com você dentro." | Passar o mouse no botão mostra o tooltip. |

## Busca

| ID | Requisito | Critério de aceite |
|---|---|---|
| R6 | A busca deve ficar abaixo da explicação, em tamanho grande, com no máximo 28rem, e o placeholder "Buscar entre seus {n} workspaces", {n} = total da aba Todos. | Com 17 na aba Todos, o placeholder diz "Buscar entre seus 17 workspaces". |
| R7 | A busca não deve aparecer com 1 workspace ou nenhum, nem nos estados Carregando e Erro. | No estado "Só um workspace", não há campo de busca. |
| R8 | Com o campo vazio, o fim do campo deve mostrar a tecla `/`; com texto, um botão de limpar com o nome acessível "Limpar busca". | Digitar uma letra troca o `/` pelo botão de limpar. |
| R9 | `/` e `Ctrl+K` (`⌘K` no Mac) devem focar a busca de qualquer ponto da página e rolar até o topo. | Com a página rolada até o fim, `/` leva ao topo com o cursor no campo. |
| R10 | Enter deve entrar no primeiro resultado que não seja convite; Esc deve limpar. Com texto no campo, a dica "Enter entra no primeiro resultado. Esc limpa a busca." aparece embaixo. | Buscar "vertice" e apertar Enter entra em Vértice Log. |
| R11 | A busca deve ignorar acento e maiúscula e procurar em nome, `reference`, descrição e etiquetas, incluindo os ocultos. | "saude" acha "Aurora Saúde Homologação"; "treinamento" acha o oculto "Treinamento interno 2025". |
| R12 | Ao digitar a primeira letra, a aba deve voltar para Todos; enquanto houver texto, os avisos de convite e o bloco do topo devem sumir. | Na aba Favoritos, digitar "rh" mostra RH Aurora, que não é favorito. |
| R13 | Sem resultado: "Nenhum workspace com "{termo}"" e "Confira o nome. Se ainda não achar, peça acesso a quem administra o ENSPACE na sua empresa." | Buscar "xyz" mostra as 2 frases. |

## Convite pendente

| ID | Requisito | Critério de aceite |
|---|---|---|
| R14 | Cada convite deve aparecer no topo como aviso na cor secundária, ícone de envelope aberto: "{quem} convidou você para {workspace}" e "Aceite para entrar neste workspace.", com os botões "Aceitar convite" (cheio) e "Recusar". | O convite de Lumen Contábil mostra "Rodrigo Petrone convidou você para Lumen Contábil". |
| R15 | O convite deve aparecer também como card na lista, com borda tracejada, o selo "Convite pendente", "{quem} convidou você" e o rodapé "Aceite para entrar", "Aceitar" e "Recusar". | O card fica na lista mesmo com o aviso no topo. |
| R16 | O card de convite não deve ser clicável inteiro nem ter estrela ou "⋯". | Clicar no corpo do card de convite não faz nada. |
| R17 | Aceitar deve transformar o convite em card comum, com o toast "Convite de {nome} aceito". | Depois de aceitar, o card ganha estrela, "⋯" e "Entrar →". |
| R18 | Recusar deve tirar o workspace da tela, com o toast "Convite de {nome} recusado". | O aviso e o card somem; a aba Todos conta 1 a menos. |

## Bloco do topo e workspace padrão

| ID | Requisito | Critério de aceite |
|---|---|---|
| R19 | O bloco deve mostrar o workspace padrão; sem padrão, o último acessado não oculto. Sem nenhum dos dois, ou com texto na busca, não aparece. | Sem padrão, o bloco mostra o workspace de acesso mais recente. |
| R20 | O rótulo do bloco deve ser "Continue de onde você parou"; com 1 workspace só, "Seu workspace"; com padrão, "Abre direto quando você entra", com ícone de casa e a borda do bloco na cor primária. | Definir o padrão troca o rótulo e a borda na hora. |
| R21 | O bloco deve mostrar o ícone num quadrado de 48px com fundo primário suave, o nome e a descrição; sem descrição, o tempo do último acesso (R44). | Um workspace sem descrição mostra "Acessado há…" no lugar. |
| R22 | O botão "Entrar em {nome}" deve ser o principal da tela: cor cheia, tamanho grande, ícone de entrar, carregamento ao clicar. | É o único botão de cor cheia da tela fora dos estados vazio e de erro. |
| R23 | O workspace do bloco deve continuar na lista. | Grupo Aurora aparece no bloco e na grade; buscar "grupo aurora" o encontra. |
| R24 | Abaixo de um divisor: sem padrão, o botão com borda e ícone de casa "Abrir sempre este ao entrar"; com padrão, "Na próxima vez que você entrar no ENSPACE, vai direto para {nome}." e o botão com borda "Voltar a escolher ao entrar". | Os 2 botões têm borda; nenhum é link cinza. |
| R25 | Definir o padrão deve mostrar o toast "{nome} abre direto quando você entrar" com "Para trocar, use o menu de qualquer workspace."; tirar, "Você volta a escolher o workspace ao entrar." | Cada ação mostra o toast certo. |
| R26 | Deve existir no máximo 1 padrão. Ocultar ou sair do padrão desfaz o padrão. No login, o padrão deve abrir direto, sem passar por esta tela. | Com padrão definido, o login seguinte cai dentro do workspace. |

## Barra da lista

| ID | Requisito | Critério de aceite |
|---|---|---|
| R27 | A barra deve ter as abas à esquerda e, à direita, Agrupar, Ordenar, Ocultos e o alternador; em tela estreita, empilha e quebra linha. | A 375px de largura, nenhum botão sai da tela. |
| R28 | As abas devem contar sem busca: "Todos ({n})" = não ocultos, incluindo convites; "Favoritos ({n})" = favoritos não ocultos, sem convites; "Recentes ({n})" = já acessados, não ocultos, sem convites. | Cada contagem bate com os cards que a aba mostra. |
| R29 | Agrupar deve ser um menu suspenso, como no ClickUp: botão com ícone de camadas e seta; "Agrupar", com borda, sem agrupamento; "Agrupar: Etiqueta" ou "Agrupar: Licença", com fundo, quando agrupa. | O botão diz o agrupamento ativo. |
| R30 | O menu Agrupar deve ter o título "Agrupar por" e as opções "Nenhum", "Etiqueta" e "Licença", com a ativa marcada. Sem etiqueta criada, "Etiqueta" mostra "Nenhuma criada ainda" embaixo. | No estado sem etiquetas, a opção mostra o aviso. |
| R31 | Trocar o agrupamento deve abrir de novo os grupos recolhidos. | Recolher um grupo e trocar o agrupamento mostra todos abertos. |
| R32 | Ordenar deve ser um menu suspenso com ícone de setas: "Ordenar: {critério curto}", com borda no padrão e com fundo nos outros. O menu tem o título "Ordenar por" e os critérios da tabela abaixo, em 3 blocos. | Escolher "Criados por último" faz o botão dizer "Ordenar: Mais novos". |
| R33 | A ordem deve valer dentro de cada grupo; "Nunca acessado" vai para o fim nas 2 ordens de acesso. | Em "Acessados há mais tempo", os nunca acessados ficam no fim. |
| R34 | O botão "Visibilidade" deve ficar sempre visível, com ícone de olho e seta. Com oculto, ganha fundo e um contador com o número de ocultos (nome acessível "Visibilidade, {n} workspaces ocultos"); sem oculto, fica com borda. Abre o painel de R64. | O rótulo nunca diz "Ocultos": o botão abre os 2 lados, o que aparece e o que está oculto. |
| R35 | O alternador deve ter 2 botões de ícone, "Ver em cards" (padrão) e "Ver em lista"; o ativo na cor primária suave. | A tela abre em cards. |

**Critérios de ordenação (R32)**

| Opção no menu | No botão | Regra |
|---|---|---|
| Acessados por último (padrão) | Último acesso | último acesso mais recente primeiro |
| Acessados há mais tempo | Acesso mais antigo | último acesso mais antigo primeiro |
| Criados por último | Mais novos | `created_at` mais recente primeiro |
| Criados primeiro | Mais antigos | `created_at` mais antigo primeiro |
| Nome, de A a Z | Nome | ordem alfabética (pt-BR) |

## Card

| ID | Requisito | Critério de aceite |
|---|---|---|
| R36 | A grade deve ter 3 colunas no desktop, 2 no tablet e 1 no celular, com 16px entre os cards. | A 375px, os cards ficam um embaixo do outro. |
| R37 | O card inteiro deve ser o alvo de Entrar: o nome é um link estendido sobre o card. Estrela e "⋯" ficam acima do link. | Clicar em qualquer ponto do card entra; clique do meio abre em nova aba; Tab para no card 1 vez, com anel de foco. |
| R38 | O topo do card deve ter, à esquerda, o ícone num quadrado de 40px na cor de identidade; à direita, o selo da licença, a estrela e o "⋯". | Os 3 elementos da direita ficam na mesma linha. |
| R39 | A cor de identidade deve vir da soma dos códigos dos caracteres de `reference`, resto da divisão por 5: fúcsia, ciano, roxo, verde-azulado ou `space`. Fundo a 10%, ícone no tom 600 (400 no escuro; `space` 300). | O mesmo workspace tem sempre a mesma cor; nenhuma é vermelho, verde de sucesso ou amarelo de alerta. |
| R40 | O selo da licença deve ser suave: "Proprietário" em primária, "Full" em secundária, "Membro" e "Leitor" em neutro. | Cada licença tem a cor da regra. |
| R41 | A estrela deve ficar sempre visível: amarela no favorito; cinza-fraca nos outros, amarela no hover. Nome acessível: "Adicionar aos favoritos" ou "Remover dos favoritos". | Favoritar atualiza a aba Favoritos na hora. |
| R42 | O corpo deve ter altura mínima de 64px, nome em até 2 linhas, descrição em até 2 linhas e as etiquetas: até 2 selos neutros com borda e ícone de etiqueta (cada um com no máximo 8rem, cortado com reticências) e, se houver mais, o selo "+{n}". Passar o mouse ou focar no "+{n}" abre um popover com todas as etiquetas; nome acessível "Mais {n} etiquetas". Sem descrição, a linha não existe. | Um workspace com 30 etiquetas mostra 2 e "+28", e o card não cresce. |
| R43 | O rodapé deve ter uma informação só, com ícone de 14px: padrão, casa e "Abre ao entrar"; oculto (só pela busca), olho cortado e "Oculto"; os demais, relógio e o tempo de R44. | Nenhum card mostra o número de pessoas. |
| R44 | O tempo deve seguir a escala da tabela abaixo. | Acesso de 2 dias atrás mostra "Acessado há 2 dias". |
| R45 | À direita do rodapé, "Entrar →" em cinza; ao clicar, "Entrando…" com um ícone girando. | Clicar no card mostra o carregamento antes de entrar. |
| R46 | No hover e no foco, o card deve subir 4px, ganhar sombra e borda primária; "Entrar →" fica primário e a seta anda 4px. | O foco por teclado produz o mesmo efeito do hover. |

**Tempo do último acesso (R44)**

| Tempo | Texto |
|---|---|
| menos de 60 minutos | "Acessado há {n} min" |
| menos de 24 horas | "Acessado há 1 hora" / "Acessado há {n} horas" |
| menos de 30 dias | "Acessado há 1 dia" / "Acessado há {n} dias" |
| 30 dias ou mais (dias ÷ 30, arredondado) | "Acessado há 1 mês" / "Acessado há {n} meses" |
| nunca | "Nunca acessado" |

## Visualização em lista

| ID | Requisito | Critério de aceite |
|---|---|---|
| R47 | A lista deve usar o `EnTable` do `@be-enlighten/enspace-sdk-ui`, com as colunas "Workspace", "Descrição", "Licença", "Etiquetas", "Último acesso" (ordenável) e a de ações, sem título. | A coluna "Último acesso" ordena ao clicar no cabeçalho. |
| R48 | Coluna Workspace: ícone em 32px; na 1ª linha, o nome com reticências, a estrela se favorito e a casa se padrão; na 2ª linha, só os selos "Convite pendente" e "Oculto". Largura mínima de 11rem. Coluna Etiquetas: 1 selo e "+{n}", com o mesmo popover de R42. | As etiquetas nunca aparecem dentro da coluna Workspace. |
| R49 | Coluna Descrição: a descrição; sem ela, "{n} pessoas"; no convite, "{quem} convidou você". Coluna Último acesso: o tempo de R44; no convite, "Aceite para entrar". | Nenhuma célula fica vazia, menos a Licença do convite. |
| R50 | Coluna de ações: só o "⋯", sem botão "Entrar"; no convite, "Aceitar" e "Recusar". Clicar na linha entra, menos no convite; enquanto entra, um ícone girando aparece ao lado do "⋯". | Clicar no "⋯" abre o menu sem entrar no workspace. |
| R51 | Com agrupamento, cada grupo deve ter a própria tabela. | Agrupar por licença mostra uma tabela por licença. |

## Grupos

| ID | Requisito | Critério de aceite |
|---|---|---|
| R52 | Sem agrupamento, a lista deve ser uma só, sem título. | Nenhum título de grupo aparece. |
| R53 | Por licença: "Convites pendentes" (ícone de envelope) primeiro, depois "Proprietário", "Full", "Membro" e "Leitor" (ícone de crachá). | O convite fica no grupo próprio, no topo. |
| R54 | Por etiqueta: um grupo por etiqueta, na ordem de criação, e depois "Sem etiqueta". O workspace com 2 etiquetas aparece nos 2 grupos. | Marcar 2 etiquetas num workspace faz o card aparecer 2 vezes. |
| R55 | Grupo vazio não deve aparecer. | Sem nenhum Leitor, não há grupo "Leitor". |
| R56 | O título do grupo deve ser um botão com seta, ícone, nome e contagem em cinza, que recolhe ou abre o grupo (seta gira 90°), com `aria-expanded` e o nome acessível "Recolher ou abrir {nome}". | Recolher esconde os cards do grupo e mantém o título. |
| R57 | Agrupado por etiqueta, com etiqueta criada e sem busca, o fim dos grupos deve ter o botão com borda "+ Nova etiqueta", que abre o modal de R76. | O botão some com texto na busca. |

## Menu "⋯"

| ID | Requisito | Critério de aceite |
|---|---|---|
| R58 | O menu deve existir no card e na linha, sempre visível, nunca no convite, com o nome acessível "Mais ações de {nome}". Na lista, o 1º item é "Entrar" (ícone de entrar), que entra direto; no card não, porque o card inteiro já entra. | O "⋯" aparece sem passar o mouse. |
| R59 | Itens, nesta ordem: "Abrir sempre ao entrar" ou "Voltar a escolher ao entrar" (casa); "Etiquetas" (etiquetas); separador; "Ocultar da lista" (olho cortado) ou "Mostrar na lista" (olho); por último, em vermelho, "Sair do workspace" (sair) ou, para o proprietário, "Excluir workspace" (lixeira). | O rótulo do 1º e do 3º item muda conforme o estado do workspace. |
| R60 | Para o proprietário, o último item deve ser "Excluir workspace", que abre o mesmo modal de exclusão de workspace que o produto já usa dentro do workspace. No protótipo, um toast avisa isso: "Excluir {nome}" e "No produto, esta opção abre o mesmo modal de exclusão de workspace usado hoje dentro do workspace." | Num workspace de proprietário, o menu não mostra "Sair do workspace". |
| R61 | Cada item deve levar à regra da própria seção: padrão (R24 a R26), etiquetas (R71), ocultar (R62), sair (R82) e excluir (R60). | Cada item tem o efeito descrito na seção dele. |

## Ocultos

| ID | Requisito | Critério de aceite |
|---|---|---|
| R62 | O oculto deve sair da lista e de todos os contadores; a pessoa continua com acesso e a busca o encontra. | Ocultar um workspace tira 1 da aba Todos. |
| R63 | Ocultar pelo "⋯" deve mostrar o toast "{nome} saiu da sua lista", com "Você continua com acesso. Para exibi-lo novamente, use Visibilidade, ao lado de Ordenar, ou a seção Ocultos, no fim da lista." e "Desfazer". | "Desfazer" devolve o workspace ao lugar. |
| R64 | O botão Visibilidade deve abrir um painel de 20rem, como o editor de propriedades do Notion: título "O que aparece na sua lista", texto "Clique no olho para mostrar ou ocultar um workspace. Você continua com acesso aos ocultos." e busca "Buscar workspace", por nome e sem acento. | O painel abre logo abaixo do botão, ou acima, se faltar espaço. |
| R65 | Com oculto, o painel deve ter, à direita do título, o botão com borda e ícone de olho "Mostrar todos", que devolve todos à lista. | O botão não aparece com 0 ocultos. |
| R66 | O painel deve ter 2 seções com contagem, "Na lista ({n})" primeiro e "Ocultos ({n})" depois, cada uma em ordem alfabética. As seções rolam a partir de 18rem. | Os nomes das seções se opõem: o que aparece e o que está oculto. |
| R67 | Cada linha deve ter o nome do workspace e, à direita, um botão de olho: olho aberto, aparece na lista; olho riscado, oculto, com o nome em cinza. Um clique alterna, vale na hora e o item troca de seção. Nome acessível: "Ocultar {nome} da lista" ou "Mostrar {nome} na lista". Convite pendente não entra no painel. | Clicar no olho de um workspace tira o card da grade sem fechar o painel. |
| R68 | Com oculto e sem busca, o fim da lista deve ter a seção "Ocultos", depois de um divisor, no mesmo padrão dos grupos (R56): chevron, ícone de olho cortado, "Ocultos" e a contagem, em cinza. A seção começa recolhida. Aberta, mostra os ocultos como cards (ou linhas, na visualização em lista) esmaecidos, com "Oculto" no rodapé; cada um tem "Mostrar na lista" no "⋯". Vale com e sem agrupamento. | Abrir a seção mostra os ocultos; "Mostrar na lista" num deles devolve só aquele. |
| R69 | Na linha do divisor, à direita, o botão com borda e ícone de olho "Mostrar de novo" (1 oculto) ou "Mostrar todos de novo" (mais) deve devolver todos de uma vez, com o toast "1 workspace voltou para a lista" ou "{n} workspaces voltaram para a lista" e "Desfazer". | Sem oculto, a seção some. |
| R70 | Ocultar o padrão deve desfazer o padrão; o "Desfazer" devolve os 2. | Depois do "Desfazer", o bloco do topo volta a dizer "Abre direto quando você entra". |

## Etiquetas pessoais

| ID | Requisito | Critério de aceite |
|---|---|---|
| R71 | O item "Etiquetas" do "⋯" deve abrir o modal "Etiquetas de {nome}", com o texto "Só você vê. Use para agrupar seus workspaces do seu jeito." e uma caixa de marcar por etiqueta. Marcar e desmarcar vale na hora. | Marcar uma etiqueta faz o selo aparecer no card. |
| R72 | O modal deve ter o campo "Nova etiqueta" (ícone, no máximo 30 caracteres) e o botão "Criar", desabilitado com o campo vazio. Enter também cria. A etiqueta criada vem marcada. | Criar "RH e pessoas" adiciona e marca a etiqueta. |
| R73 | Um nome igual a uma etiqueta existente, sem contar acento e maiúscula, deve reaproveitar a existente. | Criar "clientes" com "Clientes" existente não duplica. |
| R74 | O modal deve fechar pelo botão "Pronto". | Fechar não desfaz o que foi marcado. |
| R75 | Só a pessoa deve ver as próprias etiquetas. | Outro membro do mesmo workspace não vê as etiquetas dela. |
| R76 | O "+ Nova etiqueta" (R57) e o aviso sem etiquetas (R80) devem abrir o modal "Criar etiqueta", com o texto "Dê um nome e marque os workspaces que vão levar a etiqueta. Só você vê." | Os 2 caminhos abrem o mesmo modal. |
| R77 | O campo "Nome da etiqueta" deve receber foco ao abrir, com o placeholder "Ex.: Clientes" e no máximo 30 caracteres. | Abrir o modal e digitar escreve no nome. |
| R78 | "Em quais workspaces" deve listar os workspaces (menos convites) em ordem alfabética, com caixa de marcar e a busca "Buscar workspace"; a lista rola a partir de 16rem. | Buscar "aurora" filtra a lista do modal. |
| R79 | O rodapé deve mostrar "Marque pelo menos 1 workspace." enquanto nenhum estiver marcado, "Cancelar" e "Criar em 1 workspace" ou "Criar em {n} workspaces", desabilitado sem nome ou sem workspace marcado. Ao criar, a lista passa a agrupar por etiqueta, com o toast "Etiqueta "{nome}" criada em {n} workspaces". | Criar "Clientes" em 3 workspaces mostra o grupo "Clientes 3". |
| R80 | Sem nenhuma etiqueta, agrupar por etiqueta deve pôr todos num grupo "Sem etiqueta", com um aviso neutro acima: "Você ainda não criou etiquetas", "Etiquetas agrupam seus workspaces do seu jeito, e só você vê. Enquanto não houver nenhuma, tudo fica em "Sem etiqueta"." e o botão com borda "+ Criar etiqueta". | No estado sem etiquetas, a lista mostra 1 grupo e o aviso. |
| R81 | O aviso de R80 deve sumir assim que a primeira etiqueta for criada. | Criar a primeira etiqueta tira o aviso. |

## Sair do workspace

| ID | Requisito | Critério de aceite |
|---|---|---|
| R82 | Sair deve pedir confirmação num modal: "Sair de {nome}?" e "Você perde o acesso a tudo o que está lá dentro. Para voltar, alguém do workspace precisa convidar você de novo." | Fechar o modal não muda nada. |
| R83 | O modal deve ter "Cancelar" e "Sair do workspace" (vermelho, ícone de sair, carregamento ao clicar). | O botão vermelho mostra carregamento antes de concluir. |
| R84 | Ao sair, o workspace deve sumir da tela, desfazer o padrão se era ele e mostrar o toast "Você saiu de {nome}". | A aba Todos conta 1 a menos. |

## Criar workspace

### Estrutura e passo 1

| ID | Requisito | Critério de aceite |
|---|---|---|
| R85 | A criação deve abrir num modal sobre a própria tela, com 2 passos: no passo 1, 56rem e a prévia ao vivo à direita (20rem, some em tela estreita); no passo 2, 72rem e 88% da altura da tela. | A URL não muda ao abrir. |
| R86 | O topo do modal deve ter 2 barras de progresso na cor primária e "1 de 2" ou "2 de 2"; a troca de passo desliza para o lado. | No passo 2, as 2 barras estão preenchidas. |
| R87 | O passo 1 deve ter o título "Como esse workspace se chama?" e o texto "É o nome que a sua equipe vai procurar na lista. Pode ser alterado depois." | |
| R88 | Identidade e nome devem ficar na mesma linha, sob o rótulo "Nome" com o `*` vermelho de obrigatório (`UFormField` com `required`): quadrado clicável de 44px (lápis no hover) e o campo grande do nome, com foco ao abrir e o placeholder "Jurídico Aurora, Vértice Log, RH…". | O `*` vermelho aparece só no Nome. |
| R89 | O nome deve ter a ajuda "De 3 a 50 caracteres."; com 1 ou 2 caracteres, ela vira "Pelo menos 3 caracteres." em vermelho. | Com "Ju", aparece o aviso vermelho. |
| R90 | "Descrição" deve ficar à vista, sem `*`: ajuda "Uma frase dizendo para que serve. {n}/140", placeholder "Ex.: Chamados, RH e jurídico do Grupo Aurora", no máximo 140 caracteres. | O campo aparece sem clicar em nada; o contador vai de 0/140 a 140/140. |
| R91 | "Referência" deve ficar à vista, sem `*`, em fonte monoespaçada, com o placeholder "grupo-aurora" e a ajuda "Gerada a partir do nome. Aceita apenas letras minúsculas, números e hífens." Logo abaixo, um callout info suave com ícone de cadeado: "Endereço do workspace: enspace.io/{referência}" e "Após a criação do workspace, a referência e o endereço não podem ser alterados. O nome pode ser alterado a qualquer momento." | Com "Jurídico Aurora", o callout mostra `enspace.io/juridico-aurora` e muda a cada tecla na Referência. |
| R92 | A referência deve vir do nome (minúsculas, sem acento, só letras, números, espaço e hífen, espaços viram hífen, no máximo 50) e acompanhar o nome até a pessoa editar o campo Referência. | Editar a Referência e depois mudar o nome mantém a referência editada. |
| R93 | O passo 1 deve ter "Cancelar" e "Continuar →", ativo só com 3 caracteres ou mais, sem contar espaços nas pontas. | "  ab  " não libera o "Continuar". |

### Identidade

| ID | Requisito | Critério de aceite |
|---|---|---|
| R94 | O quadrado deve abrir uma janela de 22rem com "Cor" primeiro: 5 amostras redondas (fúcsia, ciano, roxo, verde-azulado, `space`), sugerida pelo nome (soma dos códigos, resto por 5) e válida para os 3 modos. | Trocar a cor muda iniciais, ícone e prévia. |
| R95 | Deve haver 3 modos num seletor: "Iniciais" (padrão), "Ícone" e "Imagem". | O modal abre em Iniciais. |
| R96 | Iniciais: contam só palavras com mais de 1 letra; com 1 palavra, as 2 primeiras letras; com mais, a 1ª letra das 2 primeiras; nome vazio, "W". Textos: "As iniciais do nome, na cor escolhida." e "É o que a maioria dos workspaces usa. Não precisa escolher nada." | "Jurídico Aurora" vira "JA"; "Financeiro" vira "FI". |
| R97 | Ícone sem busca: "Mais usados", 48 ícones em 8 colunas, escolhidos pelo que o ENSPACE faz (empresa, pessoas, chamados, jurídico, finanças, operação, tecnologia, saúde). | Os 48 cabem sem rolar. |
| R98 | A busca de ícones deve ser em português, por significado, sem acento, com o placeholder "Buscar em {total} ícones: balança, caminhão…" e um x para limpar. | "balanca" acha a balança. |
| R99 | Com busca, a biblioteca inteira deve aparecer numa grade virtualizada (264px de altura, células de 44px), com "{achados} de {total}" embaixo e volta ao topo a cada busca. Sem resultado: "Nada para "{termo}"" e "Tente outra palavra, ou envie o logo da empresa na aba Imagem." | Rolar a biblioteca inteira não trava a tela. |
| R100 | Sem ícone escolhido, deve valer o sugerido pelo nome ("jurídico": balança; "rh": pessoas; "logística": caminhão; padrão: prédio). O escolhido fica com borda e fundo primários; cada ícone tem tooltip com o nome. | "RH Aurora" no modo Ícone mostra o ícone de pessoas. |
| R101 | Imagem: área tracejada "Arraste o logo aqui" e "ou clique para escolher · PNG, JPG ou SVG", que aceita arrastar e clicar, só imagem. Com imagem: miniatura, nome do arquivo, "Trocar" e "Remover". A imagem tem prioridade sobre ícone e iniciais. | Arrastar um PNG mostra o logo no quadrado e na prévia. |
| R102 | O campo `icon` deve guardar o ícone ou a URL do logo; a tela nunca deve mostrar o id técnico. | Depois de escolher, não aparece texto como `carbon:scales`. |

### Passo 2: Central de casos de uso

| ID | Requisito | Critério de aceite |
|---|---|---|
| R103 | O passo 2 deve ser a Central de casos de uso, com a cara da central do protótipo do menu lateral (padrão da Central de modelos do ClickUp). Cabeçalho: progresso "2 de 2", "Quer começar de um caso de uso?" e "Um caso de uso já traz menus, categorias e status prontos. Dá para mudar tudo depois." | O passo abre sem tela em branco e nunca mostra "Não há dados". |
| R104 | A lateral esquerda (some em tela estreita) deve ter o título "Casos de uso", as fontes "Destaques" e "Do ENSPACE" com contagem e os filtros em caixas de marcar: "Localidade" ("Brasil" marcado de início, "Estados Unidos", "Global"; nenhuma marcada vale todas) e "Complexidade" ("Iniciante", "Intermediário", "Avançado"). | Desmarcar Brasil e marcar Estados Unidos mostra só os casos dos Estados Unidos. |
| R105 | Em cima da lista: a busca "Buscar casos de uso" (nome, descrição e área, sem acento) e o botão "Áreas", que abre uma lista com a busca "Buscar área", "Selecionar tudo" e várias marcadas, com a contagem no botão. Antes dos cartões, a faixa "Prefere começar do zero?" e "Um workspace vazio, montado por você. É o caminho mais comum.", com o botão com borda "Criar do zero". | "Criar do zero" cria o workspace vazio sem abrir caso nenhum. |
| R106 | Cada cartão deve ter, no alto, o 1º print do caso de uso (R107a), e embaixo o ícone e o nome. Em Destaques e sem filtro, a seção "Em destaque" (cartões com estrela) vem primeiro; depois, os cartões por área, com a complexidade em selo (Iniciante verde, Intermediário amarelo, Avançado vermelho), 3 por área e "Ver mais {n}" ou "Ver menos". Sem resultado: "Nenhum caso de uso com esses filtros", "Mude os filtros ou comece do zero: você não perde nada." e "Limpar filtros". | Cada prévia mostra o conteúdo do próprio caso, não um desenho genérico. |
| R107 | Clicar no cartão deve abrir o detalhe: "← Casos de uso"; ícone de 64px, nome, complexidade e área; o botão principal "Criar com {caso}"; a galeria de prints do caso (R107a), com setas e pontos; e a "Descrição". | "Criar com Gestão de contratos" cria o workspace com o caso. |
| R107a | A galeria e a miniatura do cartão devem mostrar **prints reais das telas do workspace que o caso de uso cria** (por exemplo: o menu com as telas, o quadro com os status, o formulário da categoria, o painel). Cada caso de uso deve ter os prints cadastrados com ele; o 1º é a miniatura do cartão. Clicar no print deve ampliar a imagem. No protótipo, os prints são desenhos feitos com o conteúdo do caso, porque essas telas ainda não existem; o produto não deve usar o desenho. | Cada caso mostra os próprios prints, em ordem, e nenhum caso mostra desenho genérico. |
| R108 | O detalhe deve ter "O que vem junto", com blocos que abrem item a item: "Menus e telas" ("{m} menus e {t} telas"), "Categorias e campos" e "Status". À direita: o cartão "Feito pelo ENSPACE", com o selo "Verificado" e "Revisado pelo time do ENSPACE.", "Criado em", "Usado" ("{n} vezes") e "Localidade". | Abrir "Menus e telas" lista os menus e as telas do caso. |
| R109 | O rodapé do passo 2 deve ter "← Voltar" (volta ao passo 1 com o que foi preenchido) e "Escolha um caso de uso ou comece do zero." Ao criar, do zero ou com caso, o modal fecha, aparece o toast "Workspace "{nome}" criado" e a pessoa entra no workspace novo. | Voltar ao passo 1 mantém nome, descrição e referência. |

## Estados

| ID | Requisito | Critério de aceite |
|---|---|---|
| R110 | Carregando: esqueleto com 1 bloco de 112px e 6 cards de 144px na grade. | O esqueleto tem o formato do card. |
| R111 | Só um workspace: sem busca, sem barra e sem lista; só o bloco do topo, com "Seu workspace" e "Abrir sempre este ao entrar". | O workspace não aparece 2 vezes. |
| R112 | Nenhum workspace: ícone de porta fechada, "Você ainda não faz parte de nenhum workspace", "Quem administra o ENSPACE na sua empresa precisa convidar você. Se recebeu um convite por e-mail, abra o link que veio nele." e o botão de cor cheia "Criar um workspace". | Aqui "Criar" tem cor cheia porque é a única saída. |
| R113 | Erro: aviso vermelho com ícone de alerta, "Não foi possível carregar seus workspaces", "A conexão falhou. Seus workspaces continuam lá. É só tentar de novo." e o botão "Tentar de novo". | "Tentar de novo" mostra o carregamento e recarrega. |
| R114 | Sem etiquetas: R80 e R81. | |
| R115 | Vários workspaces: todos os requisitos deste documento. | |

## Dados

| ID | Requisito | Critério de aceite |
|---|---|---|
| R116 | A tela deve usar do `Workspace` da API: `id`, `name`, `reference`, `description`, `icon`, `members_count` e `created_at`. | A ordem "Criados por último" usa `created_at`. |
| R117 | A licença deve vir do `type` do membro: `owner` (Proprietário), `full` (Full), `standard` (Membro), `viewer` (Leitor). | O selo mostra o rótulo da licença, não o papel (`role`). |
| R118 | O convite pendente deve trazer o nome de quem convidou. | O aviso mostra o nome. |
| R119 | A API deve passar a guardar, por usuário: último acesso a cada workspace, favoritos, workspace padrão (no máximo 1), ocultos e etiquetas pessoais com os workspaces de cada uma. | Recarregar a página mantém padrão, ocultos, favoritos e etiquetas. |
| R119a | Cada caso de uso deve trazer: nome, ícone, área, complexidade, localidades, descrição, se é destaque, data de criação, quantas vezes foi usado, o que vem junto (menus e telas, categorias e campos, status) e a lista ordenada de prints (R107a). | Um caso sem print não entra na central. |
| R120 | O login deve ler o workspace padrão e abrir direto nele. | Com padrão, o login não passa por esta tela. |

## Componentes e acessibilidade

| ID | Requisito | Critério de aceite |
|---|---|---|
| R121 | A tela deve funcionar nos temas claro e escuro, só com os tokens semânticos do Nuxt UI e do tema do ENSPACE; a única cor fixa é a paleta de identidade (R39). | Todo texto passa 4,5:1 nos 2 temas. Exceção conhecida: o branco sobre a cor primária da marca (`#FF04D1`) dá 3,39:1, nos botões de cor cheia; mudar é decisão de marca (DECISOES, rodada 16). |
| R122 | Todo texto deve existir em pt-BR, inglês e espanhol; plural, número e tempo vêm do dicionário, nunca de texto concatenado. | Em espanhol, nenhum rótulo estoura o botão. |
| R123 | Os cards devem entrar em cascata (55ms entre um e outro); filtrar, buscar, agrupar e trocar de visualização animam entrada e saída; janelas e modais abrem com transição. | Com `prefers-reduced-motion`, nada anima. |
| R124 | Todo botão só de ícone deve ter nome acessível; caixas de marcar levam o nome do workspace como rótulo; modais têm título e descrição. | O leitor de tela lê o nome de todo botão. |
| R125 | Ação clicável fora de texto corrido deve ser botão com borda ou fundo, nunca link cinza. | "Abrir sempre este ao entrar", "Mostrar todos" e "Mostrar de novo" têm borda. |
| R126 | Texto de interface não deve ter travessão. | Nenhum texto da tela tem "—" ou "–". |

## Em aberto

| ID | Questão | Hoje no protótipo |
|---|---|---|
| Q1 | O proprietário pode sair do workspace? | decidido em 20/10/2026: não sai; o menu oferece "Excluir workspace" (R60) |
| Q2 | Qual o limite e a validação do nome da etiqueta? | máximo de 30 caracteres, sem outra validação |

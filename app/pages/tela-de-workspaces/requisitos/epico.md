# Épico: tela de workspaces

**Objetivo:** a pessoa entende que a tela de entrada só escolhe onde entrar, entra no workspace dela em 1 clique,
arruma a lista do jeito dela (favoritos, padrão, ocultos e etiquetas) e não confunde "Criar workspace" com abrir
chamado.

**Onde vale:** a tela `/workspaces`, primeira depois do login, e o modal "Criar workspace" que abre sobre ela.

**Referência visual:** protótipo navegável em https://pernalombr4.github.io/prototipos/tela-de-workspaces, aprovado
em 14/10/2026 e revisado até 20/10/2026 (rodada 29). Código, textos nos 3 idiomas e decisões em
https://github.com/pernalombr4/prototipos/tree/main/app/pages/tela-de-workspaces. A barra inferior do protótipo
(estado, tema, idioma, "Por trás") é ferramenta de revisão e não entra no produto.

**Regra de lançamento:** <a definir> (P901).

**Convenção dos IDs:** a numeração é única no épico. A parte 1 usa 001 a 099, a parte 2 usa 101 a 199, e assim por
diante até a parte 8 (701 a 799). O que vale para 2 ou mais partes fica neste documento, com 901 a 999. RF é requisito
funcional, RN é regra de negócio, RI é interface, RNF é não funcional e RS é restrição. Os IDs do documento de
19/10/2026 (R1 a R126) estão em "Correspondência com o documento anterior".

**Prioridade e relevância:** as 2 colunas são proposta do agente, a confirmar com a redatora.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

**Fora do escopo:** a barra do topo (ENSPACE, Suporte, avatar) continua como está.

## As partes

| Parte | O que entrega | Depende de | Documento |
|---|---|---|---|
| 1 | Escolher e entrar: cabeçalho, busca, convite pendente, card, lista, aba "Todos", ordem por criação e por nome e os estados da tela. Usa só o que a API já tem | nada | [parte-1-escolher-e-entrar.md](parte-1-escolher-e-entrar.md) |
| 2 | O menu "⋯" do card e da linha, com "Sair do workspace" e, para o proprietário, "Excluir workspace" | 1 | [parte-2-menu-sair-e-excluir.md](parte-2-menu-sair-e-excluir.md) |
| 3 | Recentes e favoritos: último acesso na API, abas "Favoritos" e "Recentes", estrela, ordem por acesso, rodapé "Acessado há…" e o bloco "Continue de onde você parou" | 1 | [parte-3-recentes-e-favoritos.md](parte-3-recentes-e-favoritos.md) |
| 4 | Workspace padrão: "Abrir sempre ao entrar", o bloco do topo com o padrão e o login direto no workspace | 2 e 3 | [parte-4-workspace-padrao.md](parte-4-workspace-padrao.md) |
| 5 | Ocultos: ocultar pelo menu, o botão "Visibilidade" com o painel do olho e a seção "Ocultos" no fim da lista | 2 | [parte-5-ocultos.md](parte-5-ocultos.md) |
| 6 | Agrupar e etiquetas pessoais: agrupar por licença e por etiqueta, grupos recolhíveis, os 2 modais de etiqueta e a busca por etiqueta | 2 | [parte-6-agrupar-e-etiquetas.md](parte-6-agrupar-e-etiquetas.md) |
| 7 | Criar workspace, passo 1: o modal com nome, descrição, referência e identidade (cor, iniciais, ícone e imagem) | nada | [parte-7-criar-passo-1.md](parte-7-criar-passo-1.md) |
| 8 | Criar com caso de uso: o passo 2 do modal, com a Central de casos de uso, "Criar do zero" e "Criar com {caso}" | 7 e o catálogo de casos de uso | [parte-8-criar-com-caso-de-uso.md](parte-8-criar-com-caso-de-uso.md) |

## Por que esta ordem

| Parte | Por que vem aqui |
|---|---|
| 1 | Substitui a tela de hoje sem mudar a API. É a base de todas as outras partes da tela. |
| 2 | O menu "⋯" é a porta do padrão, do ocultar e das etiquetas. Nasce com o que o produto já tem: sair e o modal de excluir. |
| 3 | O bloco do topo nasce mostrando o último acessado; a parte 4 só troca o que ele mostra. |
| 4 | Precisa do bloco do topo (parte 3) e do menu (parte 2). Sair do workspace padrão desfaz o padrão, e essa regra fica aqui, na parte que chega depois. |
| 5 | Precisa do menu (parte 2). Ocultar o padrão desfaz o padrão, e essa regra fica aqui, depois da parte 4. |
| 6 | Precisa do menu (parte 2). Agrupar respeita a ordem e a seção de ocultos das partes anteriores. |
| 7 | O modal abre pelo botão "Criar workspace", que já existe hoje. Pode correr em paralelo com as partes 2 a 6. |
| 8 | Depende do catálogo de casos de uso com prints, que ainda não existe (RI701). |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | A cor de identidade é a soma dos códigos dos caracteres de um texto, resto da divisão por 5, na ordem fúcsia (0), ciano (1), roxo (2), verde-azulado (3) e `space` (4). O card calcula sobre a `reference` (RF030); a criação sugere sobre o nome (RF613). | O mesmo workspace tem a mesma cor em cada visita à tela. | Obrigatório |
| RN902 | Cada pessoa tem no máximo 1 workspace padrão. | Com Grupo Aurora como padrão, só o bloco dele diz "Abre direto quando você entra". | Obrigatório |
| RN903 | Um workspace oculto sai da lista, das abas e de cada contagem da tela; a pessoa continua com acesso, e a busca o encontra. | Ocultar um workspace tira 1 da aba "Todos"; buscar o nome dele o mostra. | Obrigatório |
| RN904 | Um workspace deixa de ser o padrão quando a pessoa o oculta ou sai dele. | Depois de ocultar o padrão, o bloco do topo volta a "Continue de onde você parou". | Obrigatório |

## Requisitos da tela inteira (RNF e RS)

Valem para as 8 partes: cada parte entrega a sua tela já cumprindo estas linhas.

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RNF901 | Cada texto da tela deve ter contraste de 4,5:1 nos temas claro e escuro. | Medição de contraste nos 2 temas. Exceção conhecida: o branco sobre a cor primária da marca (`#FF04D1`) dá 3,39:1 nos botões de cor cheia; mudar é decisão de marca (DECISOES, rodada 16). | Essencial | Obrigatório |
| RS901 | A tela deve funcionar nos temas claro e escuro só com os tokens semânticos do Nuxt UI e do tema do ENSPACE; a única cor fixa é a paleta de identidade (RN901). Imposta por: spec dos protótipos, Parte 2. | Trocar o tema troca cada cor da tela, menos a paleta de identidade. | Essencial | Obrigatório |
| RS902 | Cada texto da tela deve existir em pt-BR, inglês e espanhol. Imposta por: spec dos protótipos, regra 35. | Trocar o idioma troca cada texto; em espanhol, nenhum rótulo estoura o botão. | Essencial | Obrigatório |
| RS903 | Plural, número e tempo devem vir do dicionário de textos, sem texto concatenado. Imposta por: spec dos protótipos, Parte 4. | "1 workspace" e "2 workspaces" saem do dicionário nos 3 idiomas. | Importante | Obrigatório |
| RNF902 | Os cards devem entrar em cascata, com 55 ms entre um card e o seguinte. | A tela abre com os cards entrando um a um. | Desejável | Opcional |
| RNF905 | Filtrar, buscar, agrupar e trocar de visualização devem animar a entrada e a saída dos cards. | Buscar "rh" faz os outros cards saírem com animação. | Desejável | Opcional |
| RNF906 | Janelas e modais devem abrir com transição. | O modal "Criar workspace" abre com transição. | Desejável | Opcional |
| RNF903 | Com `prefers-reduced-motion` ligado, a tela deve abrir sem animação. | Com a preferência ligada, nada anima. | Essencial | Obrigatório |
| RNF904 | Cada botão só de ícone deve ter nome acessível. | O leitor de tela lê o nome de cada botão. | Essencial | Obrigatório |
| RNF907 | Cada caixa de marcar de workspace deve ter o nome do workspace como rótulo. | No modal "Criar etiqueta", o leitor de tela lê o nome de cada workspace. | Essencial | Obrigatório |
| RNF908 | Cada modal deve ter título e descrição. | O leitor de tela anuncia o título e a descrição ao abrir o modal. | Essencial | Obrigatório |
| RS904 | Ação clicável fora de texto corrido deve ser botão com borda ou fundo, e não link cinza. Imposta por: correção da redatora no protótipo. | "Abrir sempre este ao entrar", "Mostrar todos" e "Mostrar de novo" têm borda. | Importante | Obrigatório |
| RS905 | Texto de interface deve ser escrito sem travessão. Imposta por: spec dos protótipos, regra 33. | Nenhum texto da tela tem "—" ou "–". | Importante | Obrigatório |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Bloco do topo | Destaque acima da lista com 1 workspace e o botão "Entrar em {nome}" | "Continue de onde você parou", "Seu workspace" ou "Abre direto quando você entra" |
| Workspace padrão | O workspace que abre direto depois do login, sem passar por esta tela | "Abre ao entrar" |
| Oculto | Workspace que a pessoa tirou da própria lista sem perder o acesso | "Oculto" |
| Etiqueta pessoal | Marcador que só a pessoa vê, usado para agrupar os workspaces dela | "Etiquetas" |
| Convite pendente | Workspace para o qual a pessoa foi convidada e ainda não aceitou | "Convite pendente" |
| Cor de identidade | A cor do ícone do workspace, calculada pela RN901 | (sem nome na tela) |

## Correspondência com o documento anterior

Este épico divide nestas partes o documento de 19/10/2026 (`REQUISITOS.md`, R1 a R126), que fica no histórico do git.
O conteúdo é o mesmo, com 3 mudanças:
- o requisito que juntava peças de partes diferentes virou 1 linha por parte;
- o requisito com mais de 1 "deve" virou 1 linha por "deve";
- o filtro "Áreas" segue a rodada 29, posterior ao documento.

| Antes | Agora |
|---|---|
| R1 a R5 | RF001 a RF005 |
| R6, R7 | RF006, RF007 |
| R8 | RF008 e RF009 |
| R9 | RF010 |
| R10 | RF011 a RF013 |
| R11 | RF014 (nome, `reference` e descrição), RF402 (ocultos) e RF518 (etiquetas) |
| R12 | RF203 (volta para "Todos"), RF021 (avisos de convite) e RF213 (bloco do topo) |
| R13 | RF015 |
| R14 a R18 | RF016 a RF020 |
| R19 | RF213 (último acessado) e RF303 (padrão) |
| R20 | RF214 e RF304 |
| R21 a R23 | RF215 a RF217 |
| R24 | RF301 e RF302 |
| R25 | RF305 e RF306 |
| R26 | RN902, RF308, RF309 e RN904 |
| R27 | RF022, RF023, RF407 (Visibilidade) e RF501 (Agrupar) |
| R28 | RF024 ("Todos"), RF201 ("Favoritos"), RF202 ("Recentes") e RN903 |
| R29 a R31 | RF502 a RF504 |
| R32 | RF025 e a tabela da parte 1 (criação e nome); RF207 (acesso) |
| R33 | RF208 (nunca acessado) e RF505 (dentro do grupo) |
| R34 | RF407 e RF408 |
| R35 | RF026 |
| R36, R37, R38 | RF027, RF028, RF029 |
| R39 | RN901 e RF030 |
| R40 | RF031 |
| R41 | RF204 e RF205 |
| R42 | RF032 (corpo) e RF515 (etiquetas) |
| R43 | RF209 (último acesso), RF310 (padrão) e RF403 (oculto) |
| R44 | RF210 |
| R45 | RF033 e RF034 |
| R46 | RF035 |
| R47 | RS001 e RF036; RF211 (Último acesso) e RF517 (Etiquetas) |
| R48 | RF037; RF206 (estrela), RF311 (casa), RF404 (Oculto) e RF516 (coluna Etiquetas) |
| R49 | RF038 e RF212 |
| R50 | RF039 a RF041 e RF102 ("Entrar" no menu da lista) |
| R51 | RF513 |
| R52 a R57 | RF506 a RF512 |
| R58 | RF101 e RF102 |
| R59 | RF103 (ordem), RF104, RF105, RF307, RF405 e RF519 |
| R60 | RF105 e RN101 |
| R61 | RF103 |
| R62 | RN903 e RF401 |
| R63 | RF406 |
| R64 a R69 | RF409 a RF415; R68 também em RF514 (com agrupamento) |
| R70 | RF416 e RF417 |
| R71 a R74 | RF520 a RF523 |
| R75 | RN501 |
| R76 a R81 | RF524 a RF529 |
| R82 a R84 | RF106 a RF108; RI101 é nova, a interface que a saída pede (P101) |
| R85 | RF601, RF602 e RF701 |
| R86 | RF603 e RF604 |
| R87 a R90 | RF605 a RF608 |
| R91 | RF609 e RF610 |
| R92, R93 | RF611, RF612 |
| R94 a R101 | RF613 a RF620 |
| R102 | RI601 e RF621 |
| R103 | RF702 |
| R104 | RF703 |
| R105 | RF704 e RF705; a rodada 29 mudou o filtro "Áreas" (RF704 e RF716) |
| R106 | RF706 a RF708 |
| R107 | RF709 |
| R107a | RF710 e RF711 |
| R108 | RF712 e RF713 |
| R109 | RF714 e RF715 |
| R110 | RF042 e RF219 |
| R111 | RF218 e RF301 |
| R112, R113 | RF043, RF044 |
| R114 | RF528 e RF529 |
| R115 | (sem requisito próprio: vale o épico inteiro) |
| R116 a R118 | RI001 a RI003 |
| R119 | RI201 (último acesso), RI202 (favoritos), RI301 (padrão), RI401 (ocultos) e RI501 (etiquetas) |
| R119a | RI701 |
| R120 | RI302 |
| R121 | RNF901 e RS901 |
| R122 | RS902 e RS903 |
| R123 | RNF902, RNF903, RNF905 e RNF906 |
| R124 | RNF904, RNF907 e RNF908 |
| R125 | RS904 |
| R126 | RS905 |
| Q1 | RN101 (decidido em 20/10/2026) |
| Q2 | P501 |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | Cada parte pode ir ao cliente quando fica pronta, ou o épico sai inteiro? Hoje cada parte deixa a tela usável. | produto | Saindo por parte, a parte 1 precisa das respostas P001 a P003; saindo inteiro, essas perguntas caem |
| P902 | A Central de casos de uso aparece em 3 protótipos: este (parte 8), o `menu-lateral` (fase 6) e a `galeria-de-casos-de-uso`. Os requisitos dela passam a morar num lugar só, com os outros citando? | produto | A parte 8 deixa de repetir RF702 a RF713 e cita o documento único |
| P903 | O aviso de convite tem "Aceitar convite" de cor cheia (RF016), e o critério de RF216 diz que "Entrar em {nome}" é o único botão de cor cheia fora dos estados vazio e de erro. Qual vale com os 2 na tela? | redatora | Muda a variante de "Aceitar convite" ou o critério de RF216 |
| P904 | A cor escolhida na criação (RF613) fica guardada e vale no card, ou o card recalcula a cor pela `reference` (RN901, RF030)? Hoje o campo `icon` guarda só o ícone ou o logo (RI601). | produto e dev | Se fica guardada, RI601 ganha a cor e RF030 lê a cor guardada |

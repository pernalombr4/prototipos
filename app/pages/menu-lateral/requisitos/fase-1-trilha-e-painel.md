# Requisitos: fase 1, trilha e painel

**Objetivo:** a barra lateral passa a ter 2 colunas: a trilha, com 1 ícone por área, e o painel, com o menu da área
aberta. Nesta fase o menu tem a ordem padrão do produto e ninguém o edita.

**Onde vale:** a barra lateral de toda tela de um workspace.

**Referência visual:** https://pernalombr4.github.io/prototipos/menu-lateral/, modelo "Trilha e painel". O mapa das 6
fases está em [fases.md](fases.md).

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre
aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.

**Fora do escopo:** o conteúdo do Início e de Dados (fase 2), personalizar (fase 3), arrastar e o botão direito
(fase 4), os botões "+" (fase 5) e as telas que o menu abre.

## Resumo

| Grupo | O que muda em relação ao menu de hoje | Requisitos |
|---|---|---|
| Trilha | Hoje a barra é uma lista só, de 3 níveis. Passa a ter uma coluna de ícones de área | RF001 a RF006 |
| Abrir uma área | Clicar numa área já abre a primeira tela dela | RF007 a RF011 |
| Painel | O menu da área aberta fica ao lado da trilha | RF012 a RF014 |
| Menu flutuante | O menu de outra área abre ao lado do ícone, sem sair da tela | RF015 a RF021 |
| Recolher | A barra recolhe para só a trilha | RF022 a RF025 e RF037 |
| Configurações | Os itens de administração saem do meio do trabalho e vão para o painel de Configurações | RF026 a RF029 |
| Áreas novas | Auditoria, Integrações e Análise viram áreas de primeiro nível | RF030 a RF033 |
| Ajuda | O grupo Ajuda vira 1 ícone na base da trilha | RF034 a RF036 e RF038 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN001 | A trilha deve mostrar no máximo 8 ícones de área, contando o Início. As áreas que passam disso ficam em "Mais". | Workspace com 9 áreas: 8 na trilha, 1 em "Mais". |
| RN002 | O Início é o primeiro ícone da trilha em todo workspace. | No workspace do protótipo, o primeiro ícone abaixo do workspace é o Início. |
| RN003 | Só quem tem licença Owner ou Full pode abrir Configurações. | Membro com licença Basic vê o ícone com cadeado. |
| RN004 | Abrir uma área ou uma seção de primeiro nível deve abrir também a primeira tela dela. | Abrir Auditoria abre Logs de auditoria. |
| RN005 | Uma seção com 1 tela só é tratada como 1 linha, sem seta. | Correção monetária, com 1 tela, é 1 linha que abre a Calculadora avulsa. |
| RN006 | Fechar uma seção só fecha a seção; a tela aberta continua a mesma. | Recolher Categorias não leva para dentro de uma categoria. |

## Trilha (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF001 | O sistema deve mostrar a trilha à esquerda de toda tela do workspace, com os ícones na ordem: Início, Dados, as seções que o workspace pôs na trilha e Configurações (RN002). | Exemplo: no workspace do protótipo, a trilha mostra Início, Dados, Análise, Auditoria, Comercial, Integrações e Configurações, nessa ordem. | Essencial |
| RF002 | Cada ícone da trilha deve mostrar embaixo o nome da área, em 1 linha, cortado com reticências quando não cabe. | "Configurações" aparece como "Configur…", e o nome inteiro aparece no tooltip. | Essencial |
| RF003 | Acima do Início, a trilha deve mostrar o quadrado com a inicial do workspace e o nome do workspace no tooltip. | Workspace "Meridiano Serviços": quadrado "M", tooltip "Meridiano Serviços". | Importante |
| RF004 | Abaixo do último ícone de área, a trilha deve mostrar o botão "Mais", com o ícone de 3 pontos e o texto "Mais". | O botão aparece em todo workspace, logo abaixo de Configurações. | Essencial |
| RF005 | Quando a pessoa clica em "Mais", o sistema deve abrir ao lado uma grade de 3 colunas com as áreas que não estão na trilha (RN001). | Exemplo: com Conhecimento e Comparações fora da trilha, a grade mostra os 2. | Essencial |
| RF006 | Se a pessoa não tem licença Owner ou Full, o ícone de Configurações deve mostrar um cadeado, continuar alcançável pelo Tab e dizer no tooltip "Você não administra este workspace" (RN003). | Estado sem permissão: clicar no ícone não abre nada, e o leitor de tela anuncia o item como desabilitado. | Essencial |

## Abrir uma área (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF007 | Quando a pessoa clica num ícone de área, o sistema deve mostrar o menu dessa área no painel e abrir a primeira tela da área (RN004). | Exemplo: clicar em Auditoria mostra o painel Auditoria e abre a tela Logs de auditoria. | Essencial |
| RF008 | Quando a pessoa clica no Início, o sistema deve abrir a página inicial e o menu Início, também quando o Início já está aberto. | Com o Início aberto numa tela de Tarefas, clicar no Início volta para a página inicial. | Essencial |
| RF009 | Quando a pessoa clica em Dados, o sistema deve abrir a primeira categoria favorita; sem favorita, a primeira categoria da lista. | Com Contratos como primeira favorita, clicar em Dados abre Contratos. | Importante |
| RF010 | Quando a pessoa clica em Configurações, o sistema deve abrir "Workspace > Visão geral". | O miolo mostra Visão geral, e o grupo Workspace fica aberto no painel. | Importante |
| RF011 | O ícone da área aberta deve mostrar o estado ativo por fundo e cor do ícone, e levar `aria-current="page"`. | Com Auditoria aberta, só o ícone de Auditoria tem o fundo de ativo. | Essencial |

## Painel (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF012 | O painel deve mostrar no topo o nome da área aberta e, embaixo, o menu dela, com rolagem própria. | Com Configurações aberta, o topo diz "Configurações" e só o menu rola. | Essencial |
| RF013 | A largura padrão da barra com o painel aberto deve ser 304 px: 72 px da trilha e 232 px do painel. | Medido no navegador, sem preferência salva: 304 px. | Importante |
| RF014 | A linha do item aberto deve mostrar o estado ativo por fundo, peso da fonte e cor do ícone, e levar `aria-current="page"`. | Com Logs de auditoria aberto, a linha tem fundo e texto em negrito; a cor do texto é a mesma das outras linhas. | Essencial |

## Menu flutuante (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF015 | Quando o mouse para 180 ms sobre um ícone de área que não é a área aberta, o sistema deve mostrar o menu dessa área num menu flutuante à direita do ícone, sem trocar o painel nem a tela aberta. | Com o Início aberto, parar o mouse em Auditoria mostra Logs de auditoria e Logs de requisição ao lado; o painel continua no Início. | Essencial |
| RF016 | O menu flutuante deve fechar 120 ms depois que o mouse sai do ícone e do menu flutuante. | Levar o mouse do ícone até o menu flutuante não o fecha. | Essencial |
| RF017 | O menu flutuante deve começar com o nome da área em negrito, separado do menu por uma linha. | O menu flutuante de Auditoria começa com "Auditoria". | Importante |
| RF018 | A largura do menu flutuante deve acompanhar o texto mais longo dele, com mínimo de 192 px e máximo de 272 px. | Auditoria abre com cerca de 195 px; Dados, com nomes longos, abre com 272 px. | Importante |
| RF019 | Um nome maior que a largura máxima deve quebrar em 2 linhas no menu flutuante, sem reticências. | "Solicitações de compra e reembolso" aparece inteiro, em 2 linhas. | Importante |
| RF020 | A altura do menu flutuante deve ser no máximo 70% da altura da janela, com rolagem própria. | Janela de 700 px: o menu flutuante de Configurações tem no máximo 490 px. | Importante |
| RF021 | Abrir ou fechar um grupo dentro do menu flutuante não deve mudar a largura dele. | Em Configurações, abrir Inteligência artificial mantém a largura. Exceção aceita: a barra de rolagem do sistema operacional, quando a lista passa da altura máxima. | Desejável |

## Recolher (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF022 | Quando a pessoa clica em "Recolher menu" (botão « no topo do painel) ou aperta Ctrl+\, o sistema deve esconder o painel e deixar só a trilha. | Ctrl+\ com o painel aberto: a barra fica com 72 px. | Essencial |
| RF023 | Com a barra recolhida, o primeiro ícone da trilha deve ser "»", com o tooltip "Expandir menu". | O ícone aparece no topo da trilha recolhida. | Essencial |
| RF037 | Com a barra recolhida, clicar em "»" ou apertar Ctrl+\ deve abrir o painel da área que estava aberta. | Recolher com Auditoria aberta e expandir: o painel volta em Auditoria. | Essencial |
| RF024 | Com a barra recolhida, todo ícone de área deve abrir o menu flutuante (RF015), inclusive o da área aberta. | Recolhida com Auditoria aberta, parar o mouse em Auditoria mostra o menu flutuante dela. | Essencial |
| RF025 | Ao recolher ou expandir, o sistema deve levar o foco para o primeiro botão do que apareceu. | Pelo teclado, depois de Ctrl+\, o Tab seguinte continua na barra. | Importante |

## Configurações (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF026 | O painel de Configurações deve mostrar os grupos Workspace, Estrutura de dados, Pessoas e acesso, Interface, E-mails e Inteligência artificial, cada um como seção recolhível com os itens dentro. | Os grupos aparecem nessa ordem. | Essencial |
| RF027 | O painel de Configurações deve manter 1 grupo aberto por vez: abrir um grupo fecha o que estava aberto. | Com Workspace aberto, abrir E-mails fecha Workspace. | Importante |
| RF028 | Cada item de Configurações deve ficar no grupo da tabela "Itens de Configurações" abaixo. | Cada linha da tabela aparece no grupo indicado. | Essencial |
| RF029 | Os itens de Configurações não devem ter alça de arraste nem menu de ações. | Botão direito num item de Configurações não abre menu do produto. | Essencial |

### Itens de Configurações

| Grupo | Itens, na ordem |
|---|---|
| Workspace | Visão geral, Informações básicas, Módulos, Calendário, Notificações, Dicionários, Cobrança |
| Estrutura de dados | Categorias, Listas, Spaceflows |
| Pessoas e acesso | Membros, Cargos e permissões, Grupos |
| Interface | Menus, Casos de uso |
| E-mails | Caixas de e-mail, Modelos de e-mail, E-mails enviados |
| Inteligência artificial | Agentes de IA |

As abas de Sistema, de Gestão de Membros e de Logs de hoje viram item de menu. Integrações, Credenciais e os 2 logs
saem de Configurações (RF030 e RF031).

## Áreas novas (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF030 | O sistema deve mostrar Auditoria como área de primeiro nível, com ícone na trilha e as telas Logs de auditoria e Logs de requisição. | Configurações não tem mais o grupo Auditoria. | Essencial |
| RF031 | O sistema deve mostrar Integrações como área de primeiro nível, com ícone na trilha e as telas Apps, Credenciais e Webhooks, nessa ordem. | Configurações não tem mais Integrações nem Credenciais. | Essencial |
| RF032 | O sistema deve mostrar Análise como área de primeiro nível, com ícone na trilha e as telas Dashboard de tarefas e Dashboard de dados. | O ícone Análise abre o painel com as 2 telas. | Essencial |
| RF033 | Quando nenhuma tela de uma seção existe ainda no produto, o selo "Em breve" deve aparecer 1 vez, no nome da seção, e não em cada linha. | Análise mostra "Em breve" no título; as 2 linhas ficam sem selo. | Desejável |

## Ajuda (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF034 | Na base da trilha, o sistema deve mostrar o ícone de ajuda "?", com caixa de 36 px e ícone de 20 px, do tamanho dos ícones de área. | Medido no navegador: 36 px e 20 px. | Importante |
| RF035 | Quando o mouse para sobre o ícone de ajuda, ou a pessoa aperta Enter nele, o sistema deve abrir o menu com "Suporte", "Novidades da plataforma" e "Documentação". | O menu abre pelo mouse e pelo teclado, e Esc fecha. | Essencial |
| RF036 | O ícone de ajuda deve ter `aria-haspopup`. | O leitor de tela anuncia o botão como botão com menu. | Importante |
| RF038 | O menu de ajuda deve se navegar pelas setas do teclado. | Seta para baixo passa de Suporte para Novidades da plataforma. | Importante |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF001 | O texto das linhas do menu deve ter contraste de pelo menos 4,5:1 contra o fundo da barra, nos temas claro e escuro (WCAG 2.2, critério 1.4.3). | Medir o texto da linha comum e da linha ativa nos 2 temas. | Essencial |
| RNF002 | O estado ativo não deve depender só de cor (WCAG 2.2, critério 1.4.1). | Em tons de cinza, a linha ativa se distingue pelo fundo e pelo peso da fonte. | Essencial |
| RNF003 | Cada menu que abre pelo mouse deve abrir pelo teclado. O menu flutuante é exceção: pelo teclado, o ícone abre a área no painel, com o conteúdo do menu flutuante. | Percorrer a trilha só com Tab, Enter e Esc. | Essencial |
| RS001 | Cada texto da barra deve existir em português, inglês e espanhol. Imposta por: spec dos protótipos, regra 35. | Trocar o idioma troca todos os textos da barra. | Essencial |
| RT001 | Até o fim da fase 6, o menu novo só deve aparecer em develop, atrás de uma chave que o cliente não liga. Critério de fim: a liberação depois da fase 6. | Em produção, o menu de hoje continua igual. | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | O limite de 8 ícones foi medido numa janela de 900 px de altura. Ele deve acompanhar a altura da janela? | produto | RN001 vira um cálculo pela altura disponível. |
| P2 | Quem enxerga Auditoria? Hoje ela fica visível para todo o workspace, como estava dentro de Configurações. | produto | RF030 ganha a regra de quem vê. |
| P3 | Qual é a chave que esconde o menu novo até a liberação (RT001)? | dev | RT001 ganha o nome da chave. |
| S1 | Suposição: o miolo das telas não muda nesta fase; os itens de Configurações abrem as telas de hoje. | o código de develop | Se alguma tela de Configurações mudar de rota, a fase ganha um RI. |

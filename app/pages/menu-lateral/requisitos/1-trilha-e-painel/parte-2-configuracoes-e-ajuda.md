# 2. Configurações em painel próprio e Ajuda

**Objetivo:** os itens de administração saem do meio do trabalho e vão para a área Configurações, com 6 grupos. O
grupo Ajuda vira 1 ícone na base da trilha.

**Depende de:** 1. Trilha, painel e menu flutuante.

**Onde vale:** o ícone e o painel de Configurações e a base da trilha.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/

## Configurações (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O painel de Configurações deve mostrar os grupos Workspace, Estrutura de dados, Pessoas e acesso, Interface, E-mails e Inteligência artificial, nessa ordem, cada um recolhível, com os itens da tabela abaixo. | Cada item da tabela aparece no grupo indicado e abre a tela de hoje. | Essencial | Obrigatório |
| RF102 | O painel de Configurações deve manter 1 grupo aberto por vez: abrir um grupo fecha o que estava aberto. | Com Workspace aberto, abrir E-mails fecha Workspace. | Importante | Desejável |
| RF103 | Quando a pessoa clica em Configurações, o sistema deve abrir "Workspace > Visão geral" e o grupo Workspace no painel. | O miolo mostra Visão geral, e o grupo Workspace fica aberto. | Importante | Obrigatório |
| RF104 | Cada aba de hoje que vira item de Configurações deve abrir a tela já na aba do item. | "Membros" abre Gestão de Membros na aba Membros; "Grupos", na aba Grupos. | Essencial | Obrigatório |
| RF105 | Se a pessoa não cumpre a RN901, o ícone de Configurações deve mostrar um cadeado, continuar alcançável pelo Tab e dizer no tooltip "Você não administra este workspace"; clicar não abre nada. | Membro com licença Basic: o leitor de tela anuncia o item como desabilitado. | Essencial | Obrigatório |
| RF106 | Os itens de Configurações não devem ter menu de ações nem se reordenar. | Botão direito num item de Configurações não abre menu do produto. | Essencial | Obrigatório |

### Itens de Configurações

| Grupo | Itens, na ordem |
|---|---|
| Workspace | Visão geral, Informações básicas, Módulos, Calendário, Notificações, Dicionários, Cobrança |
| Estrutura de dados | Categorias, Listas, Spaceflows |
| Pessoas e acesso | Membros, Cargos e permissões, Grupos |
| Interface | Menus, Telas |
| E-mails | Caixas de e-mail, Modelos de e-mail, E-mails enviados |
| Inteligência artificial | Agentes de IA |

Integrações, Credenciais e os 2 logs saem de Configurações e viram áreas da trilha na parte 4. Auditoria, Integrações
e Análise como áreas.

## Ajuda (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF111 | Na base da trilha, o sistema deve mostrar o ícone de ajuda "?", do tamanho dos ícones de área. | O ícone aparece abaixo de "Mais", na base. | Importante | Obrigatório |
| RF112 | Quando o mouse para sobre o ícone de ajuda, ou a pessoa aperta Enter nele, o sistema deve abrir o menu com "Suporte", "Novidades da plataforma" e "Documentação". | O menu abre pelo mouse e pelo teclado; Esc fecha; as setas passam de um item ao outro. | Essencial | Obrigatório |
| RF113 | O ícone de ajuda deve ter `aria-haspopup`. | O leitor de tela anuncia o botão como botão com menu. | Importante | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S101 | Suposição: Interface > Telas continua em Configurações neste épico; sai só no épico Arrumar o menu do workspace, quando criar menu cria a tela junto. | produto | Interface fica só com Menus. |

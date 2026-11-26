# 8. Central Comunicações e Configurações › Comunicações

**Objetivo:** a pessoa acha os e-mails numa entrada só do menu, a central "Comunicações", e confere a própria conta de
envio no topo dela. Quem administra configura os modelos, as caixas e as regras do e-mail em Configurações ›
Comunicações, a 1 clique da lista.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo.

**Onde vale:** a entrada "Comunicações" na seção Membro do menu e o topo da lista; o grupo "Comunicações" de
Configurações, com Modelos, Caixas de E-mail e Canais e regras, no lugar de Configurações › E-mails.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Abra Comunicações no menu e troque o
controle "Perfil" entre "Admin" e "Membro"; "Configurações", no topo da lista, abre Configurações › Comunicações;
"Dados: Workspace novo" mostra os vazios de Modelos e Caixas de E-mail.

## Restrições (RS)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RS701 | O nome "Comunicações" deve valer no menu, na trilha, no título da tela e no endereço da tela desde esta parte, que só tem e-mail. O SMS e o WhatsApp entram depois na mesma tela, sem mudar o nome nem o endereço. Imposta por: produtos. | O menu, a trilha e o título dizem "Comunicações" com o workspace só com e-mail. | Essencial | Obrigatório |

## Entrada no menu e topo da lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF701 | A seção Membro do menu deve ter a entrada "Comunicações", que abre a lista de mensagens (RN901). A trilha diz "<workspace> › Comunicações". | O membro e quem administra veem "Comunicações" na seção Membro, e a trilha mostra "Comunicações". | Essencial | Obrigatório |
| RF702 | O topo da lista deve ter o título "Comunicações", o ícone "i" com o texto da lista numa dica e, à direita, "Sua conta de envio", "Configurações" e "Novo e-mail". A lista não tem abas. | O membro vê o título, o "i", "Sua conta de envio" e "Novo e-mail", sem "Configurações". | Essencial | Obrigatório |
| RF703 | "Novo e-mail", no topo da lista, deve abrir o compositor sem vínculo. | "Novo e-mail" abre o compositor sem o bloco "Item vinculado". | Essencial | Obrigatório |
| RF704 | "Configurações" deve aparecer só para quem administra (RN916), com a dica "Modelos, caixas de e-mail e regras de envio do workspace, em Configurações.", e abrir Configurações › Comunicações na aba Modelos. | Com "Perfil: Admin", o botão abre a aba Modelos; com "Perfil: Membro", o botão não aparece. | Essencial | Obrigatório |

## Sua conta de envio (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF721 | "Sua conta de envio" deve abrir um quadro, para cada membro, com o título "Sua conta de envio", a descrição "O e-mail escrito no ENSPACE sai da conta do Outlook que você integrou ao seu perfil." e a linha "Correio do Outlook" (RN902). O botão mostra o estado da conta num ícone, com o estado no nome acessível. | O membro e quem administra abrem o quadro; o leitor de tela lê "Sua conta de envio: Conta conectada". | Essencial | Obrigatório |
| RF722 | Com a conta integrada, a linha "Correio do Outlook" deve mostrar "Conta conectada: <e-mail>" e o botão "Gerenciar integração", que abre Perfil › Integrações. | Ana vê "Conta conectada: ana.ribeiro@example.com". | Essencial | Obrigatório |
| RF723 | Sem a conta integrada, a linha deve mostrar "Nenhuma conta integrada. Sem ela, o botão E-mail abre o aplicativo de e-mail do computador." e o botão "Integrar contas", que abre Perfil › Integrações (RN903). | No cenário "Sem Outlook integrado", o quadro mostra o aviso e "Integrar contas". | Essencial | Obrigatório |

## Configurações › Comunicações (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF731 | O menu de Configurações deve ter o grupo "Comunicações", com Modelos, Caixas de E-mail e Canais e regras, no lugar do grupo E-mails de hoje. O item E-mails Enviados sai do menu: os e-mails do sistema ficam na lista, no filtro "Do sistema". | Com "Perfil: Admin", o menu de Configurações mostra Comunicações › Modelos, Caixas de E-mail e Canais e regras. | Essencial | Obrigatório |
| RF732 | Modelos deve abrir a página "Configurações de comunicação" na aba Modelos. | Clicar em Modelos abre a aba Modelos, com a trilha "Configurações › Comunicações › Modelos". | Essencial | Obrigatório |
| RF733 | Caixas de E-mail deve abrir a página na aba Caixas de E-mail. | Clicar em Caixas de E-mail abre a aba Caixas de E-mail. | Essencial | Obrigatório |
| RF734 | Canais e regras deve abrir a página na aba Canais e regras. | Clicar em Canais e regras abre a aba Canais e regras. | Essencial | Obrigatório |
| RF735 | A página deve ter o título "Configurações de comunicação", a descrição "Os modelos, as caixas e as regras que valem para os e-mails do workspace.", as abas Modelos, Caixas de E-mail e Canais e regras, cada uma pela permissão da RN916, e o botão "Ver mensagens", que abre a lista. | "Ver mensagens" abre a lista de Comunicações. | Essencial | Obrigatório |
| RF736 | A trilha da página deve dizer "<workspace> › Configurações › Comunicações › <aba>", e o grupo Comunicações do menu fica aberto, com a aba aberta marcada. | Na aba Caixas de E-mail, a trilha termina em "Caixas de E-mail", e o item fica marcado no menu. | Importante | Obrigatório |
| RF737 | Cada aba deve ter, ao lado do nome, o ícone "i" com o texto da aba numa dica: Modelos, "Os modelos que aparecem no campo Template do e-mail."; Caixas de E-mail, "Os endereços do workspace que recebem e-mails e podem iniciar um fluxo."; Canais e regras, "As regras do e-mail que valem para todo o workspace.". A barra e o título da aba ficam sem texto de explicação. | O "i" de Modelos mostra o texto na dica. | Importante | Obrigatório |
| RF738 | Quem não administra o workspace e abre o endereço da página deve ver a lista de Comunicações (RN916). | Com "Perfil: Membro", a página de configuração volta para a lista. | Essencial | Obrigatório |

## Tabelas de Modelos e de Caixas de E-mail (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF711 | As abas Modelos e Caixas de E-mail devem usar a tabela das telas novas do produto, a de Logs de Auditoria: a coluna Ações primeiro, com 1 botão ⋮ que abre o menu da linha; o clique direito na linha abre esse menu; a barra tem a busca; o paginador diz "Mostrando 1 a N de N resultados", com 10, 25, 50 ou 100 por página. | O clique direito numa linha de Modelos abre o menu do ⋮. | Essencial | Obrigatório |
| RF712 | A aba Modelos deve mostrar a tela Modelos de E-mail de hoje, com as colunas Ações, Nome, Assunto e "Usar remetente por domínio" e o botão "Novo modelo". | A aba lista os modelos de hoje do workspace, com as 4 colunas. | Essencial | Obrigatório |
| RF713 | O menu da linha de Modelos deve ter "Usar em um e-mail", "Editar" e "Excluir"; "Editar", "Excluir" e "Novo modelo" fazem o que a tela de hoje faz. | "Excluir" num modelo pede a confirmação de hoje. | Essencial | Obrigatório |
| RF714 | "Usar em um e-mail" deve abrir o compositor sem vínculo, com o modelo escolhido no Template. | "Usar em um e-mail" em "Envio para assinatura" abre o compositor com o assunto e a mensagem do modelo. | Importante | Obrigatório |
| RF715 | A aba Caixas de E-mail deve mostrar a tela Caixas de E-mail de hoje, com as colunas Ações, Nome, E-mail e Provedor e o botão "Nova caixa". | A aba lista as caixas de hoje do workspace, com as 4 colunas. | Essencial | Obrigatório |
| RF716 | O menu da linha de Caixas de E-mail deve ter "Editar" e "Excluir", que fazem o que a tela de hoje faz, como "Nova caixa". | "Editar" numa caixa abre a edição de hoje. | Essencial | Obrigatório |
| RF717 | Sem modelo no workspace, a aba Modelos deve mostrar "Nenhum modelo", "O modelo preenche o assunto e a mensagem de um e-mail. Crie o primeiro para a equipe usar." e "Novo modelo". | No workspace novo, a aba mostra o vazio com o botão. | Importante | Obrigatório |
| RF718 | Sem caixa no workspace, a aba Caixas de E-mail deve mostrar "Nenhuma caixa de e-mail", "A caixa recebe os e-mails enviados ao workspace e pode iniciar um fluxo." e "Nova caixa". | No workspace novo, a aba mostra o vazio com o botão. | Importante | Obrigatório |
| RF719 | Cada coluna de Modelos e de Caixas de E-mail, fora Ações, deve ter o funil de filtro no cabeçalho: por texto em Nome, Assunto e E-mail, com os operadores do funil de texto da lista de mensagens; por seleção em "Usar remetente por domínio" e Provedor, com busca, "Todos" e "Limpar". | Marcar "Sim" no funil de "Usar remetente por domínio" deixa só os modelos com o remetente por domínio. | Importante | Obrigatório |

## Aba Canais e regras (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF724 | A aba Canais e regras deve ter a seção "Regras do workspace", com a descrição "Valem para todas as pessoas do workspace. Visível somente para quem administra." (RN916). | Com "Perfil: Admin", a aba mostra a seção. | Essencial | Obrigatório |
| RF725 | A seção "Regras do workspace" deve ter a linha "Contato do item", com o texto "O contato de cada item vem dos campos de e-mail que a categoria já tem e do e-mail de quem abriu a requisição.", sem ação (RN907). | A linha mostra o texto, sem botão. | Importante | Obrigatório |
| RF726 | A seção "Regras do workspace" deve ter a linha "Remetente com o domínio da empresa", com o texto "Os e-mails enviados pelo sistema podem sair com o domínio da empresa, pela integração SendGrid." e o botão "Abrir Integrações", que abre a integração SendGrid de hoje. | "Abrir Integrações" abre a integração SendGrid de hoje. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P701 | O endereço de hoje das telas Modelos de E-mail, Caixas de E-mail e E-mails Enviados (link salvo, favorito) passa a abrir a aba da página "Configurações de comunicação", e o de E-mails Enviados, a lista com o filtro "Do sistema"? | dev | Sem o redirecionamento, o link salvo abre a tela antiga ou nada |

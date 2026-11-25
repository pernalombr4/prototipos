# 8. Central E-mails

**Objetivo:** tudo do e-mail fica num lugar só do menu, a central "E-mails", com as telas de e-mail de hoje em abas e
a configuração dentro dela. Cada pessoa vê as abas que a permissão de hoje deixa ver.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo.

**Onde vale:** a entrada "E-mails" na seção Membro do menu; as abas Mensagens, Modelos, Caixas de E-mail e
Configurações; os itens Modelos de E-mail e Caixas de E-mail de Configurações › E-mails.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Abra E-mails no menu e troque o
controle "Perfil" entre "Admin" e "Membro"; "Dados: Workspace novo" mostra os vazios de Modelos e Caixas de E-mail.

## Entrada no menu e abas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF701 | A seção Membro do menu deve ter a entrada "E-mails", que abre a central (RN901). | O membro e quem administra veem "E-mails" na seção Membro. | Essencial | Obrigatório |
| RF702 | A central deve ter as abas Mensagens, Modelos, Caixas de E-mail e Configurações, cada uma visível pela permissão da RN916. | O membro sem as permissões de modelos e caixas vê só Mensagens e Configurações. | Essencial | Obrigatório |
| RF703 | O alto da central deve ter o botão "Novo e-mail", que abre o compositor sem vínculo. | "Novo e-mail" na central abre o compositor sem o bloco "Item vinculado". | Essencial | Obrigatório |
| RF704 | Cada aba deve ter, ao lado do nome, o ícone "i" com o texto da aba numa dica; a barra e o título da aba ficam sem texto de explicação. | O "i" de Modelos mostra "Os modelos que aparecem no campo Template do e-mail.". | Importante | Obrigatório |
| RF705 | O "i" de Caixas de E-mail deve dizer "Os endereços do workspace que recebem e-mails e podem iniciar um fluxo.", e o de Configurações, "A conta de envio de cada pessoa e as regras do e-mail no workspace.". | Os 2 textos aparecem na dica de cada aba. | Importante | Obrigatório |

## Tabelas de Modelos e de Caixas de E-mail (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF711 | As abas Modelos e Caixas de E-mail devem usar a tabela das telas novas do produto, a de Logs de Auditoria: a coluna Ações primeiro, com 1 botão ⋮ que abre o menu da linha; o clique direito na linha abre esse menu; a barra tem a busca; o paginador diz "Mostrando 1 a N de N resultados", com 10, 25, 50 ou 100 por página. | O clique direito numa linha de Modelos abre o menu do ⋮. | Essencial | Obrigatório |
| RF712 | A aba Modelos deve mostrar a tela Modelos de E-mail de hoje, com as colunas Ações, Nome, Assunto e "Usar remetente por domínio" e o botão "Novo modelo". | A aba lista os modelos de hoje do workspace, com as 4 colunas. | Essencial | Obrigatório |
| RF713 | O menu da linha de Modelos deve ter "Usar em um e-mail", "Editar" e "Excluir"; "Editar", "Excluir" e "Novo modelo" fazem o que a tela de hoje faz. | "Excluir" num modelo pede a confirmação de hoje. | Essencial | Obrigatório |
| RF714 | "Usar em um e-mail" deve abrir o compositor sem vínculo, com o modelo escolhido no Template. | "Usar em um e-mail" em "Envio de minuta" abre o compositor com o assunto e a mensagem do modelo. | Importante | Obrigatório |
| RF715 | A aba Caixas de E-mail deve mostrar a tela Caixas de E-mail de hoje, com as colunas Ações, Nome, E-mail e Provedor e o botão "Nova caixa". | A aba lista as caixas de hoje do workspace, com as 4 colunas. | Essencial | Obrigatório |
| RF716 | O menu da linha de Caixas de E-mail deve ter "Editar" e "Excluir", que fazem o que a tela de hoje faz, como "Nova caixa". | "Editar" numa caixa abre a edição de hoje. | Essencial | Obrigatório |
| RF717 | Sem modelo no workspace, a aba Modelos deve mostrar "Nenhum modelo", "O modelo preenche o assunto e a mensagem de um e-mail. Crie o primeiro para a equipe usar." e "Novo modelo". | No workspace novo, a aba mostra o vazio com o botão. | Importante | Obrigatório |
| RF718 | Sem caixa no workspace, a aba Caixas de E-mail deve mostrar "Nenhuma caixa de e-mail", "A caixa recebe os e-mails enviados ao workspace e pode iniciar um fluxo." e "Nova caixa". | No workspace novo, a aba mostra o vazio com o botão. | Importante | Obrigatório |

## Aba Configurações (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF721 | A aba Configurações deve ter a seção "Sua conta de envio", para cada membro, com a descrição "O e-mail escrito no ENSPACE sai da conta do Outlook que você integrou ao seu perfil." e a linha "Correio do Outlook" (RN902). | O membro e quem administra veem a seção. | Essencial | Obrigatório |
| RF722 | Com a conta integrada, a linha "Correio do Outlook" deve mostrar "Conta conectada: <e-mail>" e o botão "Gerenciar integração", que abre Perfil › Integrações. | Ana vê "Conta conectada: ana.ribeiro@aurora.com.br". | Essencial | Obrigatório |
| RF723 | Sem a conta integrada, a linha deve mostrar "Nenhuma conta integrada. Sem ela, o botão E-mail abre o aplicativo de e-mail do computador." e o botão "Integrar contas", que abre Perfil › Integrações (RN903). | No cenário "Sem Outlook integrado", a linha mostra o aviso e "Integrar contas". | Essencial | Obrigatório |
| RF724 | Para quem administra, a aba deve ter a seção "Regras do workspace", com a descrição "Valem para todas as pessoas do workspace. Visível somente para quem administra." (RN916). | O membro não vê a seção; quem administra vê. | Essencial | Obrigatório |
| RF725 | A seção "Regras do workspace" deve ter a linha "Contato do item", com o texto "O contato de cada item vem dos campos de e-mail que a categoria já tem e do e-mail de quem abriu a requisição.", sem ação (RN907). | A linha mostra o texto, sem botão. | Importante | Obrigatório |
| RF726 | A seção "Regras do workspace" deve ter a linha "Remetente com o domínio da empresa", com a descrição da integração SendGrid de hoje e o botão "Abrir Integrações". | "Abrir Integrações" abre a integração SendGrid de hoje. | Importante | Obrigatório |

## Configurações › E-mails (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF731 | Configurações › E-mails deve continuar no menu de Configurações com os 3 itens de hoje. | O menu de Configurações mostra Modelos de E-mail, Caixas de E-mail e E-mails Enviados. | Essencial | Obrigatório |
| RF732 | Modelos de E-mail deve abrir a central na aba Modelos. | Clicar em Modelos de E-mail abre E-mails › Modelos. | Essencial | Obrigatório |
| RF733 | Caixas de E-mail deve abrir a central na aba Caixas de E-mail. | Clicar em Caixas de E-mail abre E-mails › Caixas de E-mail. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P701 | O endereço de hoje das telas Modelos de E-mail, Caixas de E-mail e E-mails Enviados (link salvo, favorito) passa a abrir a aba da central? | dev | Sem o redirecionamento, o link salvo abre a tela antiga ou nada |

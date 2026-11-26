# 4. Modelos de WhatsApp

**Objetivo:** quem administra vê os modelos de WhatsApp do workspace e o status de cada um na Meta, ao lado dos
modelos de e-mail, e cria o modelo novo, que vai para a aprovação.

**Depende de:** 1. Canais de envio do workspace.

**Onde vale:** Configurações › Comunicações, aba Modelos.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 4 · Comunicações" e
"Perfil: Admin", abra Configurações › Comunicações › Modelos e troque o alternador para WhatsApp; "Sem Twilio" mostra
o vazio sem a integração.

## Alternador e tabela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | A aba Modelos deve ter o alternador "E-mail" e "WhatsApp". "E-mail" mostra a tabela dos modelos de e-mail de hoje; "WhatsApp", a dos modelos de WhatsApp. Trocar o alternador limpa a busca, os filtros e volta à página 1. | Trocar para WhatsApp mostra a tabela dos modelos de WhatsApp, sem a busca anterior. | Essencial | Obrigatório |
| RF302 | O "i" da aba Modelos deve dizer "Os modelos de e-mail e os modelos de WhatsApp aprovados pela Meta.". | A dica aparece ao lado de Modelos. | Importante | Obrigatório |
| RF303 | A tabela de WhatsApp deve ter as colunas Ações, Nome, Texto, Categoria (Utilidade ou Marketing), Idioma, Variáveis e "Status na Meta" (Aprovado, Em análise ou Recusado), na tabela das telas novas do produto, com a busca "Pesquisar modelos de WhatsApp...". | "lembrete_vencimento" mostra Utilidade, pt_BR, 3 variáveis e Aprovado. | Essencial | Obrigatório |
| RF304 | Cada coluna da tabela de WhatsApp, fora Ações, deve ter o funil de filtro: por texto em Nome e Texto; por seleção em Categoria, Idioma, Variáveis e "Status na Meta". | Marcar "Em análise" no funil de "Status na Meta" deixa só "pesquisa_de_satisfacao". | Importante | Obrigatório |
| RF305 | O menu da linha deve ter "Usar num fluxo", que abre o Spaceflow, "Editar" e "Excluir". "Usar num fluxo" fica indisponível no modelo que não está Aprovado (RN903). | O menu de "novidades_do_mes", Recusado, mostra "Usar num fluxo" cinza. | Importante | Obrigatório |

## Novo modelo e vazios (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF311 | A tabela de WhatsApp deve ter o botão "Novo modelo de WhatsApp", que cria o modelo e o envia para a aprovação da Meta, que leva até 48 horas (P301, S301). | O clique abre a criação do modelo de WhatsApp. | Essencial | Obrigatório |
| RF312 | Com a integração Twilio e sem modelo, a tabela deve mostrar "Nenhum modelo de WhatsApp", "O modelo aprovado pela Meta é o texto que o ENSPACE pode enviar por WhatsApp a quem não abriu uma conversa. Crie o primeiro e envie para aprovação." e "Novo modelo de WhatsApp". | Com "Dados: Workspace novo", a tabela mostra o vazio com o botão. | Importante | Obrigatório |
| RF313 | Sem a integração Twilio, a tabela deve mostrar "O workspace não tem a integração Twilio", "Para enviar SMS e WhatsApp, quem administra liga a integração Twilio em Integrações." e "Abrir Integrações", sem "Novo modelo de WhatsApp" (RN901). | Com "Sem Twilio", a tabela mostra o aviso e "Abrir Integrações". | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI301 | Modelos de WhatsApp do workspace, rota <a definir> | Deve guardar e devolver cada modelo com o nome, o texto, a categoria, o idioma, as variáveis, o identificador do modelo na Twilio (Content SID) e o status da aprovação na Meta. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | O modelo nasce no ENSPACE e vai para a aprovação pela Twilio, ou nasce no painel da Twilio e o ENSPACE só lê? | produto e dev | Sem a criação no ENSPACE, "Novo modelo de WhatsApp", "Editar" e "Excluir" saem, e a tabela só lê |
| S301 | O modelo novo aparece na tabela com o status Em análise até a resposta da Meta. | produto | Com outra regra, a tabela ganha o estado do modelo enviado e ainda sem status |
| P302 | Como o status da aprovação chega ao ENSPACE: por aviso da Twilio ou por consulta? | dev do back | Muda quando a tabela troca Em análise por Aprovado ou Recusado |

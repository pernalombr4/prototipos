# 1. Canais de envio do workspace

**Objetivo:** quem administra vê, num lugar só, por quais canais o ENSPACE envia as mensagens do workspace, o estado
de cada um e o atalho para ligar o que falta.

**Onde vale:** Configurações › Comunicações, aba Canais e regras.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 4 · Comunicações" e
"Perfil: Admin", abra Configurações › Comunicações › Canais e regras; ligue "Sem Twilio" para ver o SMS e o WhatsApp
sem a integração.

## A seção "Canais de envio do workspace" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | A aba Canais e regras deve ter a seção "Canais de envio do workspace", com a descrição "Por onde o ENSPACE envia as mensagens do sistema. Cada canal usa uma integração do workspace." e 1 linha por canal: "E-mail do sistema", "SMS" e "WhatsApp". | Com "Perfil: Admin", a aba mostra a seção com as 3 linhas. | Essencial | Obrigatório |
| RF002 | A linha "E-mail do sistema" deve dizer "Sai pela SendGrid. Com o domínio autenticado, o remetente é o da empresa; sem ele, o remetente padrão do ENSPACE. O status de entrega chega pelo aviso de eventos da SendGrid." e o estado "Domínio <domínio> autenticado · status de entrega ligado". | A linha mostra o domínio autenticado do workspace. | Essencial | Obrigatório |
| RF003 | A linha "SMS" deve dizer "Sai pelo número do workspace na Twilio. Cada SMS tem custo na conta Twilio do workspace, e o status de entrega volta da Twilio. O atalho de SMS continua oferecendo o envio pelo celular de quem usa." e o estado "Número <número> ligado". | A linha mostra "Número +55 11 93000-1234 ligado". | Essencial | Obrigatório |
| RF004 | A linha "WhatsApp" deve dizer "Sai pelo número de WhatsApp Business do workspace na Twilio. Fora de uma conversa aberta pelo contato nas últimas 24 horas, o WhatsApp aceita só modelo aprovado pela Meta. O atalho de WhatsApp continua oferecendo a conversa no WhatsApp de quem usa." e o estado "Número <número> ligado · <N> modelos aprovados", com "1 modelo aprovado" no singular. | A linha mostra "Número +55 11 93000-5678 ligado · 2 modelos aprovados". | Essencial | Obrigatório |
| RF005 | Sem a integração Twilio, as linhas "SMS" e "WhatsApp" devem mostrar o estado "Sem a integração Twilio no workspace", com o ícone de alerta (RN901). | Com "Sem Twilio", as 2 linhas mostram o aviso. | Essencial | Obrigatório |
| RF006 | Cada linha deve ter o botão "Abrir Integrações", que abre Configurações › Integrações. | "Abrir Integrações" na linha SMS abre Integrações. | Importante | Obrigatório |
| RF007 | A linha "WhatsApp", com a integração ligada, deve ter também o botão "Ver modelos", que abre a aba Modelos com o alternador em WhatsApp. | "Ver modelos" abre a tabela dos modelos de WhatsApp. | Importante | Obrigatório |
| RF008 | A linha "Remetente com o domínio da empresa" deve sair da seção "Regras do workspace": o domínio passa a aparecer na linha "E-mail do sistema". | A seção "Regras do workspace" mostra "Contato do item", sem a linha do domínio. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | A leitura das integrações do workspace, rota <a definir> | Deve devolver o domínio autenticado da SendGrid, o número de SMS e o número de WhatsApp da Twilio e a quantidade de modelos de WhatsApp aprovados. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | A integração Twilio de hoje guarda o número de WhatsApp da Central de Atendimento. O número de SMS entra na mesma integração ou numa nova? | dev do back | Muda onde quem administra cadastra o número de SMS |
| P002 | Sem o domínio autenticado na SendGrid, que estado a linha "E-mail do sistema" mostra? O protótipo só mostra o workspace com o domínio. | produto | A linha ganha o estado do remetente padrão do ENSPACE |

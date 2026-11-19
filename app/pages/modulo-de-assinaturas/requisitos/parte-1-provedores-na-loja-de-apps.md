# 1. Provedores na loja de apps

**Objetivo:** os 5 provedores de assinatura aparecem em Apps, com os outros apps, no mesmo formato de card; o card
diz o estado em texto e abre a página do provedor. A pessoa acha o app pela busca e pelo filtro.

**Onde vale:** Configurações > Integrações > Apps e o menu Integrações.

**Protótipo:** https://pernalombr4.github.io/prototipos/modulo-de-assinaturas (abre em Apps). No protótipo, os cards
que não são provedor mostram um aviso no lugar da página do app.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | A tabela a seguir define o estado de cada provedor no card. Política: Única. | Linha 2: a Certisign com 1 credencial e o webhook da conta sem o 1º retorno está em "Falta 1 etapa". | Obrigatório |
| RN002 | Um app é considerado conectado quando o estado é "Conectado" ou "Falta 1 etapa". | A D4Sign com 2 credenciais sem cofre conta como conectada. | Obrigatório |

| Linha | Credenciais do provedor | Alguma credencial sem o que o provedor exige (RN901) ou webhook da conta sem o 1º retorno | Estado no card |
|---|---|---|---|
| 1 | nenhuma | qualquer | "Não conectado" |
| 2 | 1 ou mais | sim | "Falta 1 etapa", com o número de credenciais |
| 3 | 1 ou mais | não | "Conectado", com o número de credenciais |

## Menu Integrações (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O menu Integrações deve deixar de ter o item "Assinatura Eletrônica"; os provedores ficam só em Apps. | O menu Integrações mostra Apps, Credenciais e Webhooks. | Essencial | Obrigatório |

## Seções da loja (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF002 | A tela Apps deve mostrar o título "Apps" e a linha "Conecte o ENSPACE às ferramentas que a empresa já usa.". | O texto aparece abaixo do título. | Importante | Desejável |
| RF003 | A tela deve agrupar os apps em seções: Inteligência Artificial, Assinatura eletrônica, Documentos, E-mails e Canais de mensagem, nesta ordem. | A seção "Assinatura eletrônica" vem logo depois de "Inteligência Artificial". | Essencial | Obrigatório |
| RF004 | Cada seção deve mostrar o nome, o número de apps dela e 1 linha do que a seção faz. | A seção "Assinatura eletrônica" mostra 5 e "Envie documentos para assinatura pelo módulo Assinaturas, pelo Spaceflow e pelo fluxo da categoria.". | Importante | Desejável |
| RF005 | O selo "Novo" deve aparecer só ao lado do nome da seção "Assinatura eletrônica", fora dos cards de provedor. | Os 5 cards de provedor não têm "Novo". | Desejável | Opcional |
| RF006 | A seção "Assinatura eletrônica" deve ter 1 card por provedor: ClickSign, Certisign, D4Sign, DocuSign e Adobe Acrobat Sign. | A seção mostra os 5 cards. | Essencial | Obrigatório |

## Card do app (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF007 | Cada app da loja deve usar 1 formato de card: o logo do app, o nome, a descrição em até 2 linhas, o estado e o botão "Ver detalhes". | O card da OpenAI e o da ClickSign têm as mesmas partes, na mesma posição. | Essencial | Obrigatório |
| RF008 | O card inteiro deve abrir o app; o provedor de assinatura abre a página do provedor. | Clicar no texto abaixo do nome, no card da Certisign, abre a página da Certisign. | Essencial | Obrigatório |
| RF009 | O rodapé do card deve mostrar o estado em texto, com um ponto da cor do estado, e o detalhe ao lado, quando houver (RN001). | O card da D4Sign mostra "Falta 1 etapa · 2 credenciais". | Essencial | Obrigatório |
| RF010 | O card de app que não é provedor deve dizer o estado com "Conectado" ou "Não conectado". | O card do SendGrid mostra "Conectado"; o do Twilio, "Não conectado". | Importante | Obrigatório |
| RF011 | O botão de cada card deve ter o rótulo "Ver detalhes", em cada estado. | Nenhum card mostra "Gerenciar Integração", "Instalar Integração" ou "Utilizar Plugin". | Essencial | Obrigatório |

## Integrações antigas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF012 | As integrações antigas de assinatura devem ficar num grupo recolhido "Integrações antigas de assinatura", abaixo dos 5 provedores, com o número delas. | O grupo abre recolhido e mostra 5. | Importante | Obrigatório |
| RF013 | O grupo deve mostrar 1 aviso, no topo: "Continuam funcionando nos fluxos de categoria que já as usam. Para novas configurações, use os provedores acima.". | Nenhum card antigo repete o aviso. | Importante | Obrigatório |
| RF014 | Cada integração antiga deve usar o card de app da RF007, com o logo em cinza e, como descrição, os fluxos de categoria que a usam. | O card antigo da ClickSign diz "Usada pelo fluxo de Contratos de locação e de Termos de confidencialidade.". | Importante | Desejável |
| RF015 | O estado do card antigo deve ser "Em uso", com o número de fluxos, ou "Sem uso", quando 0 fluxos de categoria usam a integração. | O card antigo da DocuSign mostra "Sem uso". | Importante | Desejável |

## Filtro (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF016 | A tela Apps deve ter o filtro "Todos", "Conectados" e "Não conectados", com "Todos" escolhido ao abrir. | Ao abrir, a tela mostra os 9 apps. | Importante | Obrigatório |
| RF017 | Cada opção do filtro deve mostrar o número de apps dela, conforme RN002. | Com 7 conectados e 2 não, as opções mostram 9, 7 e 2. | Importante | Desejável |
| RF018 | Quando o filtro é "Conectados" ou "Não conectados", a tela deve esconder a seção que fica sem app e o grupo das integrações antigas. | Em "Não conectados", a seção E-mails some, e o grupo antigo não aparece. | Importante | Obrigatório |

## Busca (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF019 | A busca "Buscar app" deve achar o app pelo nome, pelo nome da seção e pela descrição, sem diferença de acento ou de maiúscula. | "assinatura" mostra os 5 provedores; "whatsapp" mostra a ClickSign e o Twilio. | Importante | Obrigatório |
| RF020 | A busca deve valer junto com o filtro escolhido. | Em "Conectados", "sign" mostra só os provedores conectados. | Importante | Obrigatório |
| RF021 | Quando a busca acha uma integração antiga, o grupo "Integrações antigas de assinatura" deve abrir sozinho. | "docusign" abre o grupo antigo, com o card antigo da DocuSign. | Desejável | Opcional |
| RF022 | Com texto na busca, o campo deve mostrar o botão "Limpar busca", que apaga o texto. | Clicar no botão volta a mostrar todos os apps do filtro. | Importante | Desejável |
| RF023 | Se a busca e o filtro acham 0 apps, a tela deve mostrar "Nenhum app para esta busca" e o botão "Limpar busca", que apaga a busca e volta o filtro a "Todos". | "xyz" mostra a mensagem; o botão volta aos 9 apps. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | A API devolve, para cada integração antiga, os fluxos de categoria que a usam? | dev do back-end | Sem esse dado, RF014 e RF015 pedem obra nova ou saem |
| P002 | O que "Ver detalhes" abre na OpenAI, no Plugin do Word, no SendGrid e no Twilio, que hoje têm botões diferentes? | produto | Cada app ganha uma página própria ou continua com a ação de hoje |

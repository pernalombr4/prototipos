# 2. Escolher o De no compositor

**Objetivo:** quem escreve escolhe no "De" a própria conta do Outlook ou uma caixa do workspace, e o e-mail sai pela
caixa escolhida. A Mail Box e a lista de mensagens mostram por qual caixa o e-mail saiu.

**Depende de:** 1. Caixas como remetente na aba Canais e regras.

**Onde vale:** o compositor "Nova Mensagem", aberto de qualquer tela; a Mail Box do item; a lista da central Comunicações, na tabela e na leitura no painel lateral; os atalhos de e-mail.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 2 · Remetente", clique
em "Novo e-mail" e abra o "De". O cenário "Sem Outlook integrado" mostra o "De" só com as caixas.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | O item vinculado define para onde a resposta volta. O remetente escolhido não muda esse destino. | E-mail de CTR-00231 enviado por "Atendimento jurídico": a resposta do destinatário volta para a Mail Box de CTR-00231. | Obrigatório |
| RN102 | Sem item vinculado, a resposta ao e-mail enviado por uma caixa chega nessa caixa, na Central de Atendimento. | E-mail sem item enviado por "Compras": a resposta chega na caixa Compras. | Obrigatório |

## O De com escolha (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | Com 2 ou mais remetentes possíveis (a conta do Outlook integrada e as caixas ligadas, RN901), o "De" deve ser uma lista em 2 grupos: "Sua conta", com o endereço da conta e a marca "Sua conta do Outlook", e "Caixas do workspace", com o nome e o endereço de cada caixa ligada. | Exemplo: Ana com o Outlook integrado e 2 caixas ligadas; o "De" mostra ana.ribeiro@example.com em "Sua conta" e "Atendimento jurídico" e "Compras" em "Caixas do workspace". | Essencial | Obrigatório |
| RF102 | Com uma caixa escolhida, o "De" deve mostrar o nome da caixa, o endereço entre parênteses e a marca "Caixa do workspace". | "Atendimento jurídico (atendimento.aurora-servicos@box.enspace.io)" com "Caixa do workspace" ao lado. | Essencial | Obrigatório |
| RF103 | Com 1 remetente possível só, o "De" deve mostrar esse remetente sem lista, com a marca "Sua conta do Outlook" ou "Caixa do workspace". | Sem caixa ligada, o "De" mostra só a conta do Outlook, como no épico "Enviar e-mail, WhatsApp e SMS de qualquer tela e central Comunicações no menu". | Importante | Obrigatório |
| RF104 | O compositor deve abrir com a conta do Outlook no "De"; sem a conta integrada, com a 1ª caixa ligada. | Exemplo: Ana sem o Outlook integrado; o compositor abre com "Atendimento jurídico" no "De". | Importante | Obrigatório |

## Ajuda do De (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF111 | Com item vinculado, a ajuda do "De" deve mostrar "Responder para: o endereço do item. A resposta volta para a aba Mail Box." e o endereço do item, seja o remetente a conta do Outlook ou uma caixa (RN101). | Exemplo: compositor de CTR-00231 com "Compras" no "De"; a ajuda mostra o endereço de CTR-00231. | Essencial | Obrigatório |
| RF112 | Sem item vinculado e com uma caixa no "De", a ajuda deve mostrar "Sem item vinculado, a resposta chega na caixa <nome>, na Central de Atendimento." (RN102). | Exemplo: "Novo e-mail" na tela inicial com "Compras" no "De"; a ajuda diz "a resposta chega na caixa Compras". | Essencial | Obrigatório |

## Envio pela caixa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF121 | Quando a pessoa envia com uma caixa no "De", o sistema deve enviar o e-mail com o endereço da caixa como remetente. | Exemplo: envio com "Atendimento jurídico"; o destinatário recebe o e-mail de atendimento.aurora-servicos@box.enspace.io. | Essencial | Obrigatório |
| RF122 | Com item vinculado, o e-mail enviado pela caixa deve ter o endereço do item como endereço de resposta e ficar na Mail Box › Enviados do item (RN101). | Exemplo: envio de SOL-00087 pela caixa "Atendimento jurídico"; o e-mail aparece em Enviados de SOL-00087, e a resposta chega em Recebidos. | Essencial | Obrigatório |
| RF123 | Sem item vinculado, o e-mail enviado pela caixa deve ter o endereço da caixa como endereço de resposta (RN102). | Exemplo: envio sem item por "Compras"; a resposta do destinatário chega na caixa Compras. | Essencial | Obrigatório |
| RF124 | O e-mail enviado pela caixa deve ficar gravado no ENSPACE com a caixa e a pessoa que escreveu. | Exemplo: Ana envia por "Atendimento jurídico"; a lista de mensagens mostra a caixa no De e Ana em "Enviado por". | Essencial | Obrigatório |

## O remetente na Mail Box e na lista de mensagens (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF131 | Na Mail Box do item, a linha do e-mail enviado pela caixa deve dizer "Enviado por <nome> pela caixa <caixa>". | "Enviado por Elisa Prado pela caixa Atendimento jurídico" na aba Enviados de SOL-00087. | Importante | Obrigatório |
| RF132 | Na tabela da lista de mensagens, a coluna De deve mostrar o nome da caixa quando o remetente é uma caixa do workspace, com o endereço na dica. | A linha enviada pela caixa "Atendimento jurídico" mostra "Atendimento jurídico" na coluna De; o mouse sobre o nome mostra o endereço. | Importante | Obrigatório |
| RF133 | Na leitura no painel lateral da lista de mensagens, o campo De deve mostrar o endereço da caixa e o nome dela entre parênteses. | "compras.aurora-servicos@box.enspace.io (Compras)". | Importante | Obrigatório |

## Sem o Correio do Outlook (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF141 | Sem o Correio do Outlook integrado e com 1 ou mais caixas ligadas, o "De" deve oferecer só as caixas ligadas. | Cenário "Sem Outlook integrado": o "De" mostra só o grupo "Caixas do workspace". | Essencial | Obrigatório |
| RF144 | No mesmo caso, o compositor deve mostrar o formulário de envio no lugar do aviso "Nenhuma conta integrada disponível.". | Cenário "Sem Outlook integrado": Ana escreve e envia por "Atendimento jurídico". | Essencial | Obrigatório |
| RF142 | No mesmo caso, o botão E-mail dos atalhos deve escrever pelo ENSPACE: o clique no corpo abre o compositor, e a seta abre o app de e-mail. | No item CTR-00231, sem o Outlook integrado, o clique em E-mail abre o compositor com "Atendimento jurídico" no "De". | Essencial | Obrigatório |
| RF143 | Sem o Correio do Outlook e sem caixa ligada, o compositor e os atalhos devem seguir como no épico "Enviar e-mail, WhatsApp e SMS de qualquer tela e central Comunicações no menu". | Sem o Outlook e com cada caixa desligada, a gaveta mostra "Nenhuma conta integrada disponível.", e o botão E-mail abre o app de e-mail. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Sem item, a resposta ao e-mail da caixa cai na Central de Atendimento. É o destino certo? | produto | Com outro destino, RN102, RF112 e RF123 mudam |
| P102 | Antes do épico "Gravar e-mail enviado sem item e filtrar a lista de mensagens por permissão", o e-mail enviado pela caixa sem item fica gravado no ENSPACE? Hoje o enviado sem item não fica. | dev do back e produto | Sem registro, o e-mail sem item enviado pela caixa não aparece na lista de mensagens até aquele épico sair |
| P103 | Responder a um e-mail que chegou ou saiu por uma caixa abre o compositor com a mesma caixa no "De"? No protótipo, abre com a conta do Outlook. | produto | Com a mesma caixa, RF104 ganha a exceção da resposta |
| P104 | Se a caixa do "De" é desligada ou excluída com o rascunho aberto, o envio usa outro remetente ou mostra erro? No protótipo, o "De" volta ao remetente padrão. | produto e dev | Define a linha do erro do envio pela caixa |
| P105 | Sem o Correio do Outlook e com caixa ligada, o bloco "Sua conta de envio" diz que o botão E-mail abre o aplicativo do computador, mas o botão abre o compositor com a caixa. O texto muda nesse caso? | produto | Um texto novo para o bloco, nos 3 idiomas |

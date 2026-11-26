# 7. Nós Enviar SMS e Enviar WhatsApp no Spaceflow

**Objetivo:** quem monta um fluxo envia SMS e WhatsApp pelo número do workspace, como já envia e-mail, no mesmo modal
de configuração dos nós de hoje, e cada envio do fluxo aparece na central "Comunicações".

**Depende de:** 1. Canais de envio do workspace; 3. SMS e WhatsApp na central; 4. Modelos de WhatsApp.

**Onde vale:** Configurações › Dados › Spaceflow, no editor do fluxo: a paleta de nós, o modal de configuração do nó
e o cartão do nó no canvas.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 4 · Comunicações", use
"Ir para" › "Spaceflow (nós de mensagem)"; abra a paleta pelo botão redondo e clique nos nós "Enviar SMS" e "Enviar
WhatsApp" do fluxo; ligue "Sem Twilio" para ver o cartão com ERRO.

## Paleta e cartão do nó (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF601 | A paleta de nós deve ter "Enviar SMS" e "Enviar WhatsApp" no grupo Comunicação, ao lado de "Enviar E-mail", com o selo "Novo" e as dicas "Envia um SMS pelo número do workspace na Twilio." e "Envia um modelo aprovado pelo WhatsApp do workspace.". | A paleta mostra os 2 nós no grupo Comunicação, com o selo. | Essencial | Obrigatório |
| RF602 | O cartão do nó configurado deve mostrar o resumo da configuração: "SMS para <destinatário>" e "Modelo <modelo> para <destinatário>". | O cartão do nó "Enviar WhatsApp" mostra "Modelo lembrete_vencimento para" e a variável do telefone. | Importante | Obrigatório |
| RF603 | Sem a integração Twilio, o cartão dos 2 nós deve mostrar o estado ERRO, com a dica "Sem a integração Twilio no workspace" (RN901). | Com "Sem Twilio", os 2 cartões mostram ERRO. | Essencial | Obrigatório |

## Modal do nó (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF611 | Os 2 nós devem abrir o modal de configuração dos nós de hoje, com "Variáveis de Entrada" à esquerda, "Nome do Nó", "Variáveis de saída" e o rodapé "Modificado", "Cancelar" e "Salvar e fechar". | O nó "Enviar SMS" abre o modal com o painel "Variáveis de Entrada". | Essencial | Obrigatório |
| RF612 | O campo Para deve receber a variável do telefone ou o número digitado com DDD, com a ajuda "O telefone do contato. Arraste uma variável do painel Variáveis de Entrada ou digite o número com DDD.". | Arrastar a variável do telefone do contato preenche o Para. | Essencial | Obrigatório |
| RF613 | O campo "Sai por" deve mostrar, só para leitura, "Número do workspace, <número> (Twilio)" no SMS e "WhatsApp do workspace, <número> (Twilio)" no WhatsApp. | O nó "Enviar SMS" mostra "Número do workspace, +55 11 93000-1234 (Twilio)". | Importante | Obrigatório |
| RF614 | "Salvar e fechar" deve recusar o nó sem Para, com "Informe o telefone ou uma variável.", o SMS sem Mensagem, com "Escreva a mensagem.", e o WhatsApp sem modelo, com "Escolha o modelo.". | Salvar o nó "Enviar SMS" com a Mensagem vazia mostra o erro no campo. | Essencial | Obrigatório |
| RF615 | "Salvar e fechar" com os campos preenchidos deve gravar o nó, fechar o modal e mostrar o aviso "Nó salvo". | Salvar o nó mostra "Nó salvo", e o cartão mostra o resumo. | Essencial | Obrigatório |
| RF616 | Sem a integração Twilio, o modal deve mostrar o aviso "O workspace não tem a integração Twilio", com "Para enviar SMS e WhatsApp, quem administra liga a integração Twilio em Integrações." e o botão "Abrir Integrações" (RN901). | Com "Sem Twilio", o modal dos 2 nós mostra o aviso. | Essencial | Obrigatório |

## Enviar SMS (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF621 | O campo Mensagem deve aceitar texto e variáveis, com a ajuda "O texto do SMS. As variáveis entram com o valor do item na hora do envio.". | Arrastar a variável do nome do contato para a Mensagem põe a variável no texto. | Essencial | Obrigatório |
| RF622 | A Mensagem deve mostrar a contagem "<N> caracteres · <M> SMS", com os valores de exemplo das variáveis, e a ajuda "Até <limite> caracteres por SMS. Acima disso, a mensagem chega em partes, e cada parte tem custo.". O limite é de 160 caracteres por SMS, ou 70 com acento (RN907). | Uma mensagem com acento e mais de 70 caracteres mostra "2 SMS". | Importante | Obrigatório |
| RF623 | O nó "Enviar SMS" deve ter a Prévia da mensagem, com os valores de exemplo no lugar das variáveis. | A Prévia mostra o nome do contato de exemplo no lugar da variável. | Importante | Obrigatório |

## Enviar WhatsApp (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF631 | O campo "Modelo aprovado" deve listar os modelos de WhatsApp do workspace, com a ajuda "Fora de uma conversa aberta pelo contato nas últimas 24 horas, o WhatsApp aceita só modelo aprovado pela Meta.". O modelo que não está Aprovado aparece indisponível, com "<status> na Meta. Só o modelo aprovado pode ser enviado." (RN903). | "novidades_do_mes" aparece cinza, com "Recusado na Meta. Só o modelo aprovado pode ser enviado.". | Essencial | Obrigatório |
| RF632 | O nó deve ter 1 campo por variável do modelo, em "Variáveis do modelo", com a ajuda "O valor que entra no lugar de {{<n>}}.", que aceita variável do fluxo ou texto. | "lembrete_vencimento" mostra 3 campos, de {{1}} a {{3}}. | Essencial | Obrigatório |
| RF633 | O nó "Enviar WhatsApp" deve ter a Prévia do modelo, com os valores de exemplo no lugar das variáveis. | A Prévia de "lembrete_vencimento" mostra o texto com os valores de exemplo. | Importante | Obrigatório |

## Falha, entrega e saída (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF641 | Os 2 nós devem ter o campo "Se o envio falhar", com "Seguir para o próximo nó" e "Parar o fluxo com erro", e a ajuda "A falha fica na execução do fluxo e na central Comunicações, com o motivo.". | Com "Parar o fluxo com erro", o SMS com o status Falhou para a execução do fluxo com erro. | Essencial | Obrigatório |
| RF642 | Os 2 nós devem ter a chave "Esperar a confirmação de entrega". Ligada, o fluxo segue para o próximo nó só depois que a Twilio confirmar a entrega, ou depois de 1 hora. | Com a chave ligada, o fluxo espera a Entrega do SMS antes do próximo nó. | Importante | Desejável |
| RF643 | Os 2 nós devem devolver as variáveis de saída status, mensagem_id e erro. | O nó seguinte recebe a variável status do nó "Enviar SMS". | Importante | Obrigatório |
| RF644 | Cada SMS e cada WhatsApp que o nó envia deve entrar na central "Comunicações", com a origem Spaceflow e "<fluxo> › <nó>" (RN904, RN906). | O SMS do fluxo de vencimento aparece na central com "Lembrete de vencimento do contrato › Enviar SMS". | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI601 | Execução dos nós "Enviar SMS" e "Enviar WhatsApp" do Spaceflow | Deve resolver as variáveis do item, enviar pela Twilio do workspace, gravar o envio na central com o fluxo e o nó, e devolver status, mensagem_id e erro ao fluxo. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S601 | O prazo de 1 hora de "Esperar a confirmação de entrega" é proposta do protótipo, sem medição. | produto e dev | Com outro prazo, muda a ajuda da chave |
| P601 | Com "Esperar a confirmação de entrega" e "Parar o fluxo com erro", a entrega Não entregue para o fluxo como a falha do envio? | produto | Com a resposta, RF641 e RF642 ganham a combinação |

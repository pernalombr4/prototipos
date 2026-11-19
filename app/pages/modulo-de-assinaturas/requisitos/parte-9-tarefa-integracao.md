# 9. Tarefa Integração

**Objetivo:** a tarefa Integração do fluxo da categoria leva ao envelope no módulo e vai para erro, com o motivo,
quando o envelope é cancelado, recusado ou falha no envio.

**Onde vale:** a tarefa Integração do fluxo da categoria que cria o envelope.

**Protótipo:** https://pernalombr4.github.io/prototipos/modulo-de-assinaturas. Na barra "Protótipo", "Ir para" abre a
tarefa, e o estado da tarefa escolhe entre em andamento, cancelado e falha no envio.

## Envelope (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF801 | O bloco "Integração: {provedor}" deve ter "Envelope no módulo de assinaturas", com o título e o status do envelope e "Abrir envelope". | "Abrir envelope" abre o detalhe do envelope. | Essencial | Obrigatório |

## Tarefa em erro (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF802 | O envelope cancelado ou recusado deve levar a tarefa a Erro (RN906). | O envelope cancelado no módulo muda o status da tarefa de "Trabalhando" para "Erro". | Essencial | Obrigatório |
| RF803 | A falha de envio do provedor deve levar a tarefa a Erro. | A D4Sign recusa o signatário "Sérgio Amaral 2", e a tarefa vai para Erro. | Essencial | Obrigatório |
| RF804 | A tarefa em erro deve mostrar no topo "Tarefa em erro", com o que aconteceu, quem fez, quando e o motivo. | "Envio cancelado no módulo de assinaturas por {pessoa} em {data}." e "Motivo: Locatário desistiu do galpão 7.". | Essencial | Obrigatório |
| RF805 | Na falha de envio, a mensagem deve dizer o que corrigir. | "A D4Sign recusou o envio: o nome do signatário tem números. Corrija o nome no item e envie de novo.". | Essencial | Obrigatório |
| RF806 | Na falha de envio, a tarefa deve ter "Enviar para Integração de novo". | O botão envia de novo e a tarefa volta a "Trabalhando". | Essencial | Obrigatório |
| RF807 | Com o envelope cancelado ou recusado, "Enviar e-mail de cobrança" deve sair, com o texto "Sem cobrança: o envelope não está mais em assinatura.". | A tarefa do envelope cancelado não tem o botão de cobrança. | Importante | Obrigatório |
| RF808 | Na tarefa em erro, "Concluir Tarefa" deve sair. | A tarefa em erro não mostra "Concluir Tarefa". | Importante | Desejável |
| RF809 | O erro deve entrar no Histórico, com o que aconteceu e o motivo. | O Histórico mostra "Erro" depois de "Enviada para a Integração". | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P801 | A tarefa em erro pode voltar a andar sem "Enviar para Integração de novo", quando o envelope é recriado no item? | dev do fluxo da categoria | Pode surgir 1 requisito de retomada |

# 1. Conversa flutuante com o agente

**Objetivo:** a conversa flutuante do BENI AI abre sobre a Home já com o agente e o pedido que vêm de fora, sem trocar
de tela.

**Depende de:** o épico Widgets de agentes de IA e do Spaceflow na Home.

**Onde vale:** a conversa flutuante do BENI AI, aberta pelo widget Agentes de IA. Hoje ela guarda o agente só por
dentro e não recebe agente nem pedido de fora.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". Clique num agente do
widget Agentes de IA.

## A conversa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O clique num agente do widget Agentes de IA deve abrir a conversa flutuante, sobre a Home, com o agente escolhido. | A Home continua visível e rolável atrás da conversa. | Essencial | Obrigatório |
| RF002 | A conversa flutuante deve aceitar um pedido vindo de fora, enviado como a 1ª mensagem. | Exemplo: aberta com "resuma meus chamados", a conversa já mostra o pedido enviado e a resposta. | Essencial | Obrigatório |
| RF003 | Aberta com o agente, a conversa deve mostrar o nome e a cor do agente no cabeçalho e o aviso "O agente pode errar. Confira a resposta antes de usar.". | Aberta com Triagem de chamados, o cabeçalho mostra Triagem de chamados. | Importante | Obrigatório |
| RF004 | O botão "Abrir em tela cheia" deve levar a conversa aberta, com o agente dela, à página de conversa. | A página de conversa mostra as mensagens que já estavam na conversa flutuante. | Importante | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Abrir com outro agente, com uma conversa já aberta, começa uma conversa nova ou troca o agente da conversa aberta? | produto | RF001 |

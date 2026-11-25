# 1. Agentes de IA

**Objetivo:** a pessoa abre a conversa com um agente de IA em 1 clique, sem abrir a conversa e trocar o agente no
seletor.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** o widget Agentes de IA, no grupo IA do catálogo. A conversa abre na página de conversa em tela cheia.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". No protótipo, o
clique abre a conversa flutuante; nesta parte, abre a conversa em tela cheia, como a versão MVP mostra.

## O widget (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O widget deve listar os agentes que a rota de agentes devolve para a pessoa: os do sistema e os do workspace, com o BENI primeiro. | Um workspace novo mostra só os agentes do sistema. | Essencial | Obrigatório |
| RF002 | Cada linha deve mostrar o avatar do agente na cor dele, o nome, a descrição em até 2 linhas e o selo "Do sistema" no agente do sistema ou "Revisor" no agente de revisão. | O BENI mostra o selo "Do sistema"; um agente do workspace, sem selo. | Essencial | Obrigatório |
| RF003 | O clique na linha deve abrir a conversa em tela cheia com o agente escolhido. | Clicar em Triagem de chamados abre a conversa com Triagem de chamados no seletor. | Essencial | Obrigatório |
| RF004 | Para o administrador, o pé do widget deve ter o botão "Gerenciar agentes", que abre a tela Agentes de IA. | O membro não vê o botão. | Importante | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | `GET /ai/agents` | Devolve os agentes do sistema e os do workspace, com o nome, a descrição, o tipo e a cor do BENI de cada um. | Obrigatório |
| RI002 | Página de conversa `/workspaces/<workspace>/ai/chat` | Recebe o agente em `?agent=`. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Para quem não tem a permissão da conversa com IA (`ai.chat`), o widget mostra "Sem acesso" ou some do catálogo? | produto | RF001 |

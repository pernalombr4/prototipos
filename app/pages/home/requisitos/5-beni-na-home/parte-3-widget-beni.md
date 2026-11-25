# 3. Widget BENI

**Objetivo:** a pessoa vê na Home o resumo do dia feito pelo BENI e abre a conversa com ele em 1 clique.

**Depende de:** 1. Conversa flutuante com o agente.

**Onde vale:** o widget BENI, no grupo IA do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". No protótipo, o
resumo é texto fixo.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | O resumo do BENI conta as tarefas da pessoa por prazo, status e prioridade, como a ferramenta de resumo de tarefas do agente já faz. | "3 tarefas vencem hoje; 1 é urgente." | Obrigatório |

## O widget (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | O widget deve mostrar o resumo do dia (RN201), 1 frase por linha, cada uma com um ícone. | Exemplo: 1 linha para as vencidas e 1 para as que vencem hoje. | Essencial | Obrigatório |
| RF202 | O widget deve mostrar "Gerado pelo BENI. Confira antes de agir.". | O aviso fica abaixo do resumo. | Importante | Obrigatório |
| RF203 | O widget deve ter o botão "Conversar com o BENI", que abre a conversa flutuante vazia, com o cursor no campo. | O widget não tem campo de texto. | Essencial | Obrigatório |
| RF204 | No workspace sem tarefa nem item, o widget deve mostrar "O BENI resume o dia quando houver tarefas e itens. Enquanto isso, ele ajuda a montar o workspace." e o botão "Conversar com o BENI". | Workspace novo mostra o texto e o botão "Conversar com o BENI". | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI201 | <a definir> | Devolve o resumo das tarefas da pessoa no workspace, com a conta da ferramenta `getTaskSummary` do agente. Hoje a conta só existe como ferramenta do agente e do MCP. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | O resumo é texto gerado pela IA (gasta crédito a cada abertura da Home) ou frases montadas pela conta, sem IA? | produto | RI201 e o custo por pessoa |
| P202 | O widget BENI entra na Home padrão, como no protótipo? | produto | A Home padrão do épico Home em widgets |

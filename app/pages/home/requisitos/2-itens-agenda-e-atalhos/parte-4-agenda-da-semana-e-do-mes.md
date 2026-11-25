# 4. Agenda da semana e do mês

**Objetivo:** a pessoa vê na Home a semana e o mês da Agenda dela, sem abrir a tela Agenda.

**Depende de:** 1. Compromissos do dia.

**Onde vale:** os widgets Agenda da semana e Agenda do mês, no grupo Agenda do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão".

## Agenda da semana (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | O widget Agenda da semana deve mostrar 7 colunas, de hoje ao 6º dia depois de hoje, cada uma com os compromissos do dia em ordem de horário, das 3 fontes de Compromissos do dia. | Hoje é a 1ª coluna, em destaque. | Importante | Opcional |
| RF302 | O clique num compromisso deve abrir o compromisso na origem. | Clicar no prazo de tarefa abre a tarefa. | Importante | Opcional |

## Agenda do mês (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF303 | O widget Agenda do mês deve mostrar o calendário do mês atual, com 1 ponto por fonte em cada dia que tem compromisso. | O dia com reunião e prazo de tarefa mostra 2 pontos, nas cores de Calendário e Tarefa. | Importante | Opcional |
| RF304 | O clique num dia deve listar embaixo do calendário os compromissos desse dia. | Ao abrir, a lista mostra hoje. | Importante | Opcional |
| RF305 | O widget deve ter os botões só de ícone de mês anterior e próximo mês. | O próximo mês mostra os compromissos dele. | Desejável | Opcional |
| RF306 | Fora do mês atual, o widget deve mostrar o botão "Hoje", que volta ao mês atual. | Em março, "Hoje" volta ao mês atual; no mês atual, o botão não aparece. | Desejável | Opcional |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | A tela Agenda já mostra a semana e o mês. Os 2 widgets entram mesmo assim? | produto | Sem eles, esta parte sai do épico |

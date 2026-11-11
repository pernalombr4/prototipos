# 3. Relatório Padrão

**Objetivo:** o arquivo do Relatório Padrão de Tarefas Rápidas traz o vencimento, o prazo final e se o prazo final venceu.

**Depende de:** 1. O prazo final na tarefa rápida.

**Onde vale:** Tarefas › Rápidas, ícone "Extrair Relatório" › "Relatório Padrão", em cada formato. O caminho até o arquivo não muda.

**Protótipo:** https://pernalombr4.github.io/prototipos/prazo-final-nas-tarefas/, área Tarefas Rápidas, ícone "Extrair Relatório" › "Relatório Padrão" › Excel. A prévia do arquivo é da barra do protótipo, não do produto: mostra as linhas como a planilha sai.

## O arquivo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | O arquivo do Relatório Padrão de Tarefas Rápidas deve trazer as colunas "Vencimento", "Prazo final" e "Prazo final vencido", nessa ordem, em cada formato (Excel, CSV e DBF). | Exemplo: tarefa com vencimento 17/11 e prazo final 19/11, Em andamento, hoje 22/11: a linha traz 17/11/2026, 19/11/2026 e "Sim" (RN006). | Essencial | Obrigatório |
| RF022 | Se a tarefa não tem prazo final, as células "Prazo final" e "Prazo final vencido" do arquivo devem ficar vazias. | A tarefa sem prazo final não traz "Não" na coluna "Prazo final vencido". | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P14 | O relatório também ganha a coluna "Prazo final vencido", ou só "Prazo final"? | Produtos | RF021 |

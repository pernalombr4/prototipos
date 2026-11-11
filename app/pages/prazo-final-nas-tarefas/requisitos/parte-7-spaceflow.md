# 7. Spaceflow

**Objetivo:** o Spaceflow lê e grava o prazo final da tarefa rápida do mesmo modo que lê e grava o vencimento.

**Depende de:** 1. O prazo final na tarefa rápida.

**Onde vale:** Spaceflow, nas variáveis, no gatilho de tarefa atualizada e nas ações que criam ou alteram tarefa rápida.

**Protótipo:** https://pernalombr4.github.io/prototipos/prazo-final-nas-tarefas/, área Spaceflow.

## Variáveis e gatilho (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF009 | O Spaceflow deve oferecer o prazo final da tarefa rápida como variável em cada nó que oferece o vencimento como variável. | O gatilho "Tarefa atualizada" lista "Prazo final" depois de "Vencimento". | Essencial | Obrigatório |
| RF010 | Se a tarefa rápida não tem prazo final, o Spaceflow deve entregar a variável vazia, do mesmo modo que entrega o vencimento vazio. | A execução mostra o prazo final vazio, e o fluxo conclui. | Essencial | Obrigatório |
| RF011 | Quando o prazo final de uma tarefa rápida muda, o gatilho de tarefa atualizada deve disparar do mesmo modo que dispara quando o vencimento muda. | Alterar só o prazo final gera 1 execução. | Essencial | Obrigatório |

## Ações que gravam a tarefa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF015 | As ações do Spaceflow que criam ou alteram tarefa rápida devem permitir preencher o prazo final com data fixa ou variável, do mesmo modo que o vencimento. | Nó "Criar tarefa rápida" com prazo final = variável Prazo final do gatilho: a tarefa criada tem o prazo final da tarefa que disparou. | Essencial | Obrigatório |
| RF016 | Se, na execução, o prazo final ficar antes do vencimento, a ação deve falhar sem gravar a tarefa e com o motivo na execução (RN004). | Vencimento 30/11 e prazo final 25/11 chegam ao nó: a tarefa não é criada, e a execução mostra o aviso da RN004. | Essencial | Obrigatório |
| RF017 | Se as 2 datas do nó são fixas e o prazo final fica antes do vencimento, o nó deve recusar o salvamento com o aviso no campo do prazo final (RN004). | Vencimento 20/11 e prazo final 18/11 no nó: "Salvar" mostra o aviso, e o nó fica como estava. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P12 | O prazo final vencido vira gatilho ou condição no Spaceflow? | Produtos | Gatilho novo no Spaceflow |

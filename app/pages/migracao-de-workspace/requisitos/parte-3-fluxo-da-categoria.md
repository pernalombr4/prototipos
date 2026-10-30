# 3. Fluxo da categoria na revisão

**Objetivo:** na revisão, quem importa vê o que muda no fluxo de cada categoria: as etapas na ordem do fluxo, as
tarefas e as configurações de cada etapa, o que sai com itens e tarefas abertas e o que aponta para algo que não existe
no workspace.

**Depende de:** 2. Revisão.

**Onde vale:** o grupo Fluxo de cada categoria na lista do passo "Revisar".

**Protótipo:** https://pernalombr4.github.io/prototipos/migracao-de-workspace/, botão "Protótipo: usar arquivo de
exemplo", Substituição total, Continuar e a categoria "Processos judiciais".

## Fluxo da categoria (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF018 | Quando a categoria tem etapas Novas, Alteradas ou Removidas, o sistema deve mostrar no grupo Fluxo as etapas na ordem do fluxo e, dentro de cada etapa, as entidades da etapa que mudam. | Exemplos: etapa "Nome: Análise → Análise de mérito"; tarefa "Emitir parecer" com "Responsável: Advogado responsável → Coordenação jurídica"; "Audiências" sem fluxo no workspace recebe "Fluxo (2 etapas) +2". | Essencial | Obrigatório |
| RF019 | Quando a prévia tem uma etapa Removida, o sistema deve mostrar o nome riscado e, em vermelho, a quantidade de itens na etapa e de tarefas abertas dela. | Exemplo: "Revisão jurídica", riscada, com "12 itens nesta etapa" e "4 tarefas abertas". | Importante | Obrigatório |
| RF020 | Se uma entidade que a migração cria ou altera cita um membro ou outra entidade que não existe no workspace de destino, o sistema deve mostrar abaixo dela o aviso "Aponta para <nome>, que não existe neste workspace." | Exemplo: a regra de responsável "Diretoria aprova acima de R$ 100 mil" mostra "Aponta para Carla Mendes, que não existe neste workspace."; a etapa que a contém abre expandida. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P5 | Tarefa cujo responsável não existe no destino entra sem responsável, com o responsável padrão da etapa ou não entra? | produto | RF020 para membros. |

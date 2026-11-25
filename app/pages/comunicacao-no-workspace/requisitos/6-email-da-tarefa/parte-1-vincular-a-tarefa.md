# 1. Vincular a tarefa no compositor

**Objetivo:** quem escreve um e-mail com item vincula a ele uma tarefa do item, e o e-mail aberto de uma tarefa já vem
com ela. O envio grava a tarefa no e-mail.

**Onde vale:** o compositor "Nova Mensagem", aberto de qualquer tela; as aberturas a partir da tarefa em Tarefas ›
Rápidas (lista, quadro e painel); o "Responder" e o "Encaminhar" da Mail Box e da aba Mensagens.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 3 · Tarefa", abra
CTR-00231 e clique em E-mail: o campo "Vincular a tarefa" fica abaixo do item vinculado.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | A tarefa vinculada a um e-mail com item é uma tarefa desse item. | O e-mail de CTR-00231 só pode ter uma tarefa de CTR-00231, como T-1042. | Obrigatório |
| RN002 | O e-mail respondido ou encaminhado mantém a tarefa vinculada do e-mail original. | A resposta a um e-mail de T-1042 também fica em T-1042. | Obrigatório |

## O campo Vincular a tarefa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O compositor deve ter o campo "Vincular a tarefa", com "(opcional)" e a ajuda "O e-mail aparece também na Mail Box da tarefa.", abaixo do bloco do item. | O campo aparece no compositor de CTR-00231, depois do item vinculado. | Essencial | Obrigatório |
| RF002 | Com item vinculado, a lista do campo deve ter "Nenhuma tarefa" e cada tarefa do item, no formato "<referência> · <nome>" (RN001). | Exemplo: CTR-00231 vinculado; a lista mostra "Nenhuma tarefa" e "T-1042 · Enviar minuta assinada à contraparte". | Essencial | Obrigatório |
| RF003 | Sem tarefa escolhida, o campo deve mostrar "Nenhuma tarefa", e o e-mail sai sem tarefa. | Envio com "Nenhuma tarefa": o e-mail fica só na Mail Box do item. | Importante | Obrigatório |
| RF004 | Quando a pessoa troca o item vinculado pelo "Trocar" de "Vincular a item (opcional)" (épico "E-mail sem item e lista por permissão"), o sistema deve tirar do campo a tarefa que é de outro item (RN001). | Exemplo: T-1042 escolhida e o item trocado de CTR-00231 para outro contrato; o campo volta a "Nenhuma tarefa". | Importante | Obrigatório |

## A tarefa vinda da tela de origem (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | Cada abertura do compositor a partir de uma tarefa com item deve trazer o item e a tarefa vinculados: "Novo e-mail" do topo com o painel da tarefa aberto, "Novo e-mail" da Mail Box da tarefa e o e-mail para o responsável na lista, no quadro e no painel da tarefa. | Exemplo: painel de T-1042 aberto e "Novo e-mail" do topo; o compositor abre com CTR-00231 e T-1042. | Essencial | Obrigatório |
| RF012 | O "E-mail para os <N> responsáveis" da seleção de 2 ou mais tarefas deve abrir o compositor sem tarefa vinculada. | Selecionar T-1042 e T-1043 e clicar no e-mail em lote: o campo mostra "Nenhuma tarefa". | Importante | Obrigatório |
| RF013 | O compositor aberto por "Responder" deve vir com a tarefa do e-mail original (RN002). | Responder ao e-mail de CTR-00231 vinculado a T-1042 abre com T-1042 no campo. | Essencial | Obrigatório |
| RF014 | O compositor aberto por "Encaminhar" (épico "Responder na conversa e encaminhar") deve vir com a tarefa do e-mail original (RN002). | Encaminhar o mesmo e-mail abre com T-1042 no campo. | Importante | Obrigatório |

## Gravar o vínculo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | Quando a pessoa envia o e-mail com uma tarefa escolhida, o sistema deve gravar a tarefa no e-mail, junto do item (RN901, RN902). | Exemplo: envio de CTR-00231 com T-1042; ao recarregar, o e-mail aparece em Enviados da Mail Box de CTR-00231 com a referência T-1042. | Essencial | Obrigatório |
## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Remover o item vinculado (o X de "Vincular a item (opcional)") mantém a tarefa escolhida? No protótipo, mantém. | produto | Sem a tarefa, o campo volta a "Nenhuma tarefa" junto com o item |
| P002 | A tarefa excluída ou concluída entre abrir e enviar: o envio é recusado, sai sem tarefa ou sai com ela? E a tarefa concluída aparece na lista? | produto | Ganha a linha do erro do envio e o filtro da lista do RF002 |

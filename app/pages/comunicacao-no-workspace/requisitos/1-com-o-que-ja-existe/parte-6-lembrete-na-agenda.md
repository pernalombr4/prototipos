# 6. Lembrete na Agenda

**Objetivo:** do evento da Agenda, a pessoa manda um lembrete por e-mail a cada pessoa do evento, ou a todas num e-mail
só, com a data e a hora já no texto.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo.

**Onde vale:** a Agenda, modal "Evento".

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Na Agenda, clique em
"Alinhamento semanal do jurídico" (reunião do Outlook), em "Assinatura: Contrato de manutenção predial" (data de item)
e em "Prazo: confirmar data da audiência" (prazo de tarefa).

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN501 | A tabela a seguir define quem recebe o lembrete por origem do evento e o rótulo da lista no modal. Política: Única. | Linha 2: o evento "Assinatura: Contrato de manutenção predial" lista os contatos de CTR-00231. | Obrigatório |

| Linha | Origem do evento | Quem recebe | Rótulo no modal |
|---|---|---|---|
| 1 | Reunião do Outlook | Os participantes da reunião | "Participantes" |
| 2 | Data de um item (campo de data da categoria) | Os contatos do item (RN907) | "Contatos do item" |
| 3 | Prazo de uma tarefa | O responsável da tarefa | "Responsável" |

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN502 | O lembrete abre com o assunto "Lembrete: <evento> (<quando>)" e o texto com a data e a hora; na reunião do Outlook, o texto leva também o local. | "Lembrete: Alinhamento semanal do jurídico (5 de dezembro, 09:00, Reuniões do Microsoft Teams)". | Obrigatório |
| RN503 | O lembrete do evento de data de item fica vinculado ao item (RN906). | O lembrete de "Assinatura: Contrato de manutenção predial" fica na Mail Box de CTR-00231. | Obrigatório |

## Modal "Evento" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | O modal "Evento" deve listar quem recebe o lembrete, com o rótulo da origem do evento (RN501). | A reunião do Outlook mostra "Participantes" com os 3 e-mails; o prazo de tarefa mostra "Responsável" com Diego Martins. | Essencial | Obrigatório |
| RF502 | Cada pessoa da lista deve ter o botão "Enviar e-mail para <nome>", com os 2 caminhos do atalho e o assunto e o texto do lembrete (RN502, RN909). | "Enviar e-mail para Diego Martins" abre o compositor com o assunto do lembrete. | Essencial | Obrigatório |
| RF503 | O modal deve ter a seção "Enviar lembrete", com o botão "E-mail para todos (<N>)", que abre 1 e-mail com cada pessoa da lista que tem e-mail em Para (RN502, RN909). | A reunião com 3 participantes mostra "E-mail para todos (3)" e abre 1 e-mail com os 3. | Essencial | Obrigatório |
| RF504 | A seção "Enviar lembrete" deve mostrar a ajuda "O e-mail abre com data, hora e assunto preenchidos. É possível alterar o texto antes do envio.". | A ajuda aparece embaixo do botão. | Importante | Obrigatório |
| RF505 | A pessoa sem e-mail deve aparecer na lista com "Sem e-mail cadastrado" e o botão indisponível, fora da contagem de "E-mail para todos (<N>)" (RN913). | Um contato com nome e sem e-mail aparece cinza, e o botão diz "E-mail para todos (2)". | Importante | Obrigatório |
| RF506 | No evento de data de item, o lembrete deve abrir vinculado ao item, com o endereço do item em Cc no app (RN503, RN911). | O app abre com o endereço de CTR-00231 em Cc. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P501 | O lembrete do prazo de uma tarefa ligada a um item fica vinculado a esse item, como o e-mail aberto da própria tarefa? | produto | Se sim, o lembrete da tarefa entra na Mail Box do item e leva o endereço do item em Cc |

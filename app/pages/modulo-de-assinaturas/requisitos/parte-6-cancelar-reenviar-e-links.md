# 6. Cancelar, reenviar e links

**Objetivo:** cancelar o envelope diz o efeito no fluxo e leva o motivo a ele; reenviar o e-mail confirma quem recebe;
os links de assinatura saem por participante, com o aviso de segurança 1 vez.

**Depende de:** 5. Detalhe do envelope.

**Onde vale:** os modais "Cancelar envelope", "Reenviar e-mail" e "Links de assinatura", abertos pelo detalhe do envelope
e pelo menu ⋮ da lista de Módulos > Assinaturas.

**Protótipo:** https://pernalombr4.github.io/prototipos/modulo-de-assinaturas, menu Assinaturas > um envelope aberto >
"Mais ações" > "Cancelar envelope".

## Cancelar envelope (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | O modal deve dizer a consequência 1 vez: "Os participantes deixam de poder assinar pelo ENSPACE. A ação não pode ser desfeita.". | O texto aparece abaixo do título. | Essencial | Obrigatório |
| RF502 | No envelope criado por um fluxo, o modal deve dizer o efeito no fluxo (RN906): "A etapa "{etapa}" do fluxo {fluxo} vai para erro com este motivo." ou "A tarefa Integração #{n} do item {item} vai para erro com este motivo.". | O envelope da execução 25035 diz "A etapa "Assinatura do contrato" do fluxo Contrato de fornecedor vai para erro com este motivo.". | Essencial | Obrigatório |
| RF503 | No envelope criado por um fluxo, o Motivo deve ser obrigatório. | "Cancelar envelope" sem motivo mostra "Informe o motivo. Ele vai para o fluxo que criou o envelope.". | Essencial | Obrigatório |
| RF504 | No envelope avulso, o Motivo deve ser opcional e ficar só na trilha de auditoria. | O envelope avulso cancela sem motivo. | Importante | Obrigatório |
| RF505 | No provedor que cancela só no ENSPACE, o modal deve avisar "A {provedor} não cancela pela integração. O envelope fecha no ENSPACE, mas o documento continua ativo no portal: cancele lá também.". | O envelope do fluxo na Certisign mostra o aviso. | Essencial | Obrigatório |
| RF506 | Ao cancelar, quem não assinou deve passar a "Não assinou", com o evento na trilha, o autor e o motivo. | Depois de cancelar, o participante na fila mostra "Não assinou". | Essencial | Obrigatório |
| RF507 | Ao cancelar o envelope criado por um fluxo, a etapa que o criou deve ir para erro com o motivo (RN906). | O nó Assinatura eletrônica da execução 25035 vai para Erro, com o motivo informado. | Essencial | Obrigatório |

## Reenviar e-mail (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF508 | "Reenviar e-mail" deve abrir um modal de confirmação com a lista de quem recebe: quem está na vez e não assinou (RN905). | Com Otávio Lins na vez, o modal lista Otávio Lins. | Essencial | Obrigatório |
| RF509 | O modal deve dizer quantos participantes na fila recebem o convite quando chegar a vez. | Com Beatriz Fontes na fila: "1 participante na fila recebe o convite quando chegar a vez.". | Importante | Desejável |
| RF510 | Ao confirmar, o toast deve dizer quantos receberam, e cada um passa a mostrar "Último reenvio há {tempo}". | "E-mail reenviado a 1 participante". | Importante | Obrigatório |

## Links de assinatura (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF511 | O modal deve mostrar 1 vez o aviso "Quem tiver o link assina como aquela pessoa. Envie só ao participante, por um canal de confiança.". | O aviso aparece no topo, e nenhuma linha o repete. | Essencial | Obrigatório |
| RF512 | Cada participante deve ter o próprio link, com o botão de copiar. | Copiar o link de Otávio Lins copia só o link dele. | Essencial | Obrigatório |
| RF513 | O participante sem link deve dizer o motivo no lugar do link: "Já assinou", "Recusou", "Ainda não está na vez" ou "Envelope encerrado". | Beatriz Fontes, na fila, mostra "Ainda não está na vez". | Importante | Obrigatório |
| RF514 | O modal deve ter "Gerar novamente", que gera os links de novo. | O texto do modal diz que os links expiram. | Importante | Desejável |
| RF515 | Os links devem aparecer também no envelope criado pelo fluxo da categoria, quando o provedor gera links. | O envelope da Certisign criado pela tarefa Integração tem "Links de assinatura". | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P501 | O motivo do cancelamento chega hoje ao nó do Spaceflow e à tarefa Integração? | dev do módulo | Sem isso, RF507 pede obra no back-end |

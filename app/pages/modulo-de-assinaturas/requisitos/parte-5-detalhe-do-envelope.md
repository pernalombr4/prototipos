# 5. Detalhe do envelope

**Objetivo:** o detalhe do envelope diz numa faixa o que aconteceu, quem fez e o efeito no fluxo, mostra até 2 ações
conforme o estado, os participantes por ordem e uma trilha que diz quem fez cada evento.

**Onde vale:** o detalhe do envelope, aberto pela lista de Módulos > Assinaturas, pelo nó Assinatura eletrônica e pela
tarefa Integração.

**Protótipo:** https://pernalombr4.github.io/prototipos/modulo-de-assinaturas, menu Assinaturas > um envelope. Na barra
"Protótipo", "Ir para" abre cada estado do envelope.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN401 | A tabela a seguir define as ações visíveis no topo do detalhe, conforme RN902 e RN904. Política: Única: o status escolhe a linha; o resto das ações vai para "Mais ações". | Linha 5: o envelope aberto da Certisign mostra "Links de assinatura" e "Abrir Certisign". | Obrigatório |
| RN402 | A tabela a seguir define a faixa de estado de cada status. Política: Única. | Linha 4: o envelope cancelado por Ana Ribeiro diz "Cancelado por Ana Ribeiro em 18/11/2026 16:46." e "Motivo: Fornecedor pediu revisão da cláusula de multa.". | Obrigatório |

| Linha | Status | Ações visíveis (até 2) |
|---|---|---|
| 1 | Rascunho com provedor | "Editar rascunho" e "Enviar" |
| 2 | Rascunho sem provedor | "Editar rascunho" e "Conectar um provedor"; com 1 credencial pronta no workspace, só "Editar rascunho" |
| 3 | Erro | "Enviar de novo" |
| 4 | Concluído | "Baixar assinado" |
| 5 | Aberto (RN902) | na ordem, as 2 primeiras que o provedor permite: "Atualizar status", "Reenviar e-mail", "Links de assinatura" e, quando o provedor não consulta o status, "Abrir {provedor}" |

| Linha | Status | Título da faixa | Linhas abaixo do título | Atalho |
|---|---|---|---|---|
| 1 | Aberto, com retorno | "{n} de {total} participantes assinaram." | "Aguardando {quem está na vez}." (RN905) | |
| 2 | Aberto, sem retorno (RN903) | "Sem retorno da {provedor} desde {data}." e o que fazer: atualizar o status ou, quando o provedor não consulta, conferir no portal | | |
| 3 | Concluído | "Assinado por todos em {data}. O documento assinado está disponível." | | |
| 4 | Cancelado | "Cancelado por {quem} em {data}." | o motivo; o efeito no fluxo (RN906); quando o provedor cancela só no ENSPACE, "A {provedor} não cancela pela integração: o documento continua ativo no portal. Cancele lá também." | "Ver execução" ou "Ver tarefa", quando há efeito no fluxo |
| 5 | Recusado | "Recusado por {quem} em {data}." | o motivo; o efeito no fluxo | "Ver execução" ou "Ver tarefa" |
| 6 | Expirado | "O prazo venceu em {data} sem todas as assinaturas." | o efeito no fluxo | "Ver execução" ou "Ver tarefa" |
| 7 | Erro | "Falha no envio" | o motivo do provedor; "Troque o documento e envie de novo." | "Ver execução" ou "Ver tarefa" |
| 8 | Rascunho com provedor | "Rascunho. Nada foi enviado à {provedor}." | | |
| 9 | Rascunho sem provedor | "Rascunho sem provedor. O envelope fica salvo e é enviado depois da conexão com um provedor." | com 1 credencial pronta no workspace, "Um provedor já está conectado. Edite o rascunho, escolha a credencial e envie." | |

## Topo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | O topo deve mostrar o título, o status, o logo do provedor, a origem e "Atualizado há {tempo}". O rascunho sem provedor mostra "Sem provedor" no lugar do logo. | O envelope da ClickSign mostra o logo da ClickSign ao lado da origem. | Essencial | Obrigatório |
| RF402 | A origem do envelope criado por um fluxo deve ser um link: "Spaceflow · {fluxo} · execução {n}" abre a execução, e "Fluxo da categoria · {categoria} · tarefa #{n}" abre a tarefa. | Clicar em "Spaceflow · Contrato de fornecedor · execução 25035" abre a execução 25035. | Essencial | Obrigatório |
| RF403 | O topo deve mostrar até 2 ações conforme RN401, e as outras em "Mais ações". | O envelope aberto da ClickSign mostra "Atualizar status" e "Reenviar e-mail"; "Baixar original" e "Cancelar envelope" ficam em "Mais ações". | Essencial | Obrigatório |
| RF404 | "Mais ações" deve ter "Baixar original", "Abrir {provedor}" (com o envelope no provedor) e, no envelope aberto, "Cancelar envelope". | O envelope concluído tem "Baixar original" em "Mais ações". | Essencial | Obrigatório |
| RF405 | No envelope avulso do provedor que cancela só no ENSPACE, "Cancelar envelope" deve ficar desligado, com "A {provedor} não permite cancelar pela integração. Cancele no portal da {provedor}.". | O envelope avulso da Certisign mostra o motivo abaixo de "Cancelar envelope". | Essencial | Obrigatório |
| RF406 | Depois de "Atualizar status", o botão deve esperar 30 s até a próxima consulta, com "Atualizar de novo em {n} s". | O botão fica desligado e conta de 30 a 0. | Importante | Desejável |
| RF407 | Se a consulta não muda o status, o toast deve dizer "Status consultado na {provedor}. Nada mudou.". | A consulta sem mudança mostra o toast. | Importante | Obrigatório |
| RF408 | "Reenviar e-mail" deve ficar desligado quando ninguém está na vez sem assinar. | Com todos da ordem 1 assinados e a ordem 2 ainda não enviada, o botão fica desligado. | Importante | Obrigatório |

## Faixa de estado (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF409 | Abaixo do topo, o detalhe deve mostrar 1 faixa de estado conforme RN402, no lugar dos alertas empilhados. | O envelope cancelado mostra 1 faixa, com o título, o motivo e o efeito no fluxo. | Essencial | Obrigatório |
| RF410 | O atalho da faixa deve abrir a execução do Spaceflow ou a tarefa Integração que criou o envelope. | "Ver execução" abre a execução 25035. | Importante | Obrigatório |

## Participantes (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF411 | Participantes deve agrupar as pessoas por ordem, com o título "Ordem {n}" quando há mais de 1 ordem. | O envelope com 2 ordens mostra "Ordem 1" e "Ordem 2". | Importante | Obrigatório |
| RF412 | Cada participante deve mostrar o nome, o papel, o e-mail, o status e o detalhe do status: "Assinou em {data}", "Visualizou em {data}" ou "Último reenvio há {tempo}". | Otávio Lins mostra "Visualizado" e "Visualizou em 18/11/2026 18:52". | Essencial | Obrigatório |
| RF413 | O participante cuja ordem não chegou (RN905) deve aparecer "Na fila", com "Recebe o convite quando a ordem {n} terminar.". | Beatriz Fontes, da ordem 2, mostra "Na fila" e "Recebe o convite quando a ordem 1 terminar.". | Essencial | Obrigatório |
| RF414 | No envelope cancelado, quem não assinou deve aparecer "Não assinou". | Depois do cancelamento, Beatriz Fontes mostra "Não assinou". | Essencial | Obrigatório |
| RF415 | No envelope aberto do provedor que gera links, o participante enviado ou que visualizou deve ter o botão "Copiar link de assinatura". | Na Certisign, Otávio Lins tem o botão; Beatriz Fontes, na fila, não tem. | Importante | Desejável |

## Documento (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF416 | O bloco Documento deve ter as abas "Original" e "Assinado"; "Assinado" fica desligada até o documento assinado chegar. | No envelope aberto, só "Original" pode ser escolhida. | Importante | Obrigatório |

## Trilha de auditoria (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF417 | Cada evento da trilha deve dizer quem fez: "por {pessoa}", "pela {provedor}" ou "pelo ENSPACE". | O cancelamento mostra "por Ana Ribeiro"; a assinatura que chega pelo webhook, "pela ClickSign". | Essencial | Obrigatório |
| RF418 | O evento com motivo deve mostrar o motivo na mesma linha. | O cancelamento mostra "Motivo: Fornecedor pediu revisão da cláusula de multa.". | Essencial | Obrigatório |
| RF419 | A confirmação do provedor de um evento do ENSPACE deve ir na linha do evento, com "A {provedor} confirmou às {hora}.", sem um 2º evento. | O cancelamento na ClickSign mostra 1 evento "Cancelado", com "A ClickSign confirmou às {hora}.". | Essencial | Obrigatório |
| RF420 | O evento de falha deve mostrar a etapa em que falhou: Envio, Cadastro do signatário ou Cancelamento. | A falha de nome com números mostra "Etapa: Cadastro do signatário". | Importante | Desejável |
| RF421 | A trilha deve ter o filtro "Todos", "Participantes" e "Erros". | "Erros" deixa só os eventos de falha. | Importante | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P401 | O evento da trilha guarda o autor (pessoa, provedor ou ENSPACE) e o motivo? | dev do back-end | Sem o dado, RF417 e RF418 pedem obra nova |
| S401 | O tempo de espera de 30 s entre consultas de status é proposta do protótipo, sem medição. | dev do módulo | O número muda sem mudar o comportamento |

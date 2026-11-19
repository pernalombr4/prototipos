# 8. Nó Assinatura eletrônica no Spaceflow

**Objetivo:** o editor do nó pede a credencial num campo só, abre só o que foi escolhido e diz onde fica a entrada do
disparo; a execução mostra o desfecho no nó e, no painel, o resultado em frase, o envelope, os signatários e a
configuração com nomes.

**Onde vale:** o editor do fluxo e a aba Execuções do Spaceflow, no nó Assinatura eletrônica.

**Protótipo:** https://pernalombr4.github.io/prototipos/modulo-de-assinaturas. Na barra "Protótipo", "Ir para" abre o
editor do nó e a execução, e "Desfecho do nó" escolhe o resultado.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN701 | O cancelamento do envelope pelo módulo de assinaturas leva a execução a erro, com o motivo, nas 2 opções de "Se não for assinado". | Com "Seguir para o próximo nó", o envelope cancelado leva o nó a Erro. | Obrigatório |
| RN702 | A entrada do disparo do fluxo fica em `workflow_input.input`. | A lista de signatários do disparo é `{{ workflow_input.input.signatarios }}`. | Obrigatório |

## Editor do nó (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF701 | O editor deve ter 1 campo Credencial no lugar de Provedor e Credencial, com as credenciais prontas (RN901) agrupadas pelo nome do provedor. | O grupo diz "Adobe Acrobat Sign", não "adobesign". | Essencial | Obrigatório |
| RF702 | Documento deve oferecer "De um nó anterior" e "Arquivo fixo", e abrir só o campo da opção escolhida. | Com "De um nó anterior", o campo do arquivo fixo fica fechado. | Importante | Obrigatório |
| RF703 | Signatários deve oferecer "Fixos", "De uma lista" e "Fixos e de uma lista", e abrir só os campos da opção escolhida. | Com "De uma lista", a tabela de signatários fixos fica fechada. | Importante | Obrigatório |
| RF704 | Os signatários fixos devem dizer como a ordem funciona: "assinam ao mesmo tempo" com 1 ordem, "assinam em sequência" com mais de 1. | 2 signatários na ordem 1 mostram "assinam ao mesmo tempo". | Importante | Desejável |
| RF705 | O "Caminho da lista" deve ter a ajuda "A entrada do disparo fica em workflow_input.input. Exemplo: {{ workflow_input.input.signatarios }}" (RN702). | A ajuda aparece abaixo do campo. | Essencial | Obrigatório |
| RF706 | Se o caminho da lista não começa por `workflow_input.input` e a lista vem do disparo, o campo deve avisar com a dica da RF705. | `{{ input.signatarios }}` mostra o aviso. | Importante | Desejável |
| RF707 | O editor deve pedir as chaves de cada item da lista: Nome, E-mail, Papel e Ordem, e o "Papel padrão". | As 4 chaves aparecem com "De uma lista". | Importante | Obrigatório |
| RF708 | Com "Aguardar a assinatura" ligado, o editor deve ter "Se o envelope for recusado, cancelado ou expirar", com "Dar erro na execução (padrão)" e "Seguir para o próximo nó, com o status na saída". | O padrão é "Dar erro na execução". | Essencial | Obrigatório |
| RF709 | A opção deve ter a ajuda "O cancelamento pelo módulo sempre leva a execução a erro, com o motivo." (RN701). | A ajuda aparece abaixo das 2 opções. | Importante | Obrigatório |

## Nó na execução (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF710 | O nó Assinatura eletrônica no canvas da execução deve mostrar o desfecho em texto: "Aguardando", "Assinado", "Recusado", "Cancelado", "Expirado" ou "Erro". | O envelope recusado mostra o nó com "Recusado". | Essencial | Obrigatório |
| RF711 | O envelope recusado, cancelado ou expirado deve levar o nó e a execução a Erro, conforme o "Se não for assinado" e RN701. | O envelope cancelado leva a execução 25035 a Erro. | Essencial | Obrigatório |

## Painel do nó (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF712 | O painel deve abrir com "Resultado", em 1 frase com quem fez, quando e o motivo. | O cancelado diz "Envio cancelado no módulo de assinaturas por Ana Ribeiro em 18/11/2026 16:46." e o motivo. | Essencial | Obrigatório |
| RF713 | No envelope cancelado, o Resultado deve ter "Ver cancelamento", que abre o detalhe do envelope. | O botão abre o envelope, com a faixa do cancelamento. | Importante | Obrigatório |
| RF714 | No nó em erro por desfecho, o painel deve dizer "A execução parou neste nó. Para seguir mesmo assim, mude "Se não for assinado" no editor do nó.". | O recusado mostra o texto abaixo do Resultado. | Importante | Desejável |
| RF715 | No erro de configuração, o Resultado deve dizer o motivo e o caminho usado, com a dica da RN702 e o botão "Editar o nó", que abre o editor. | "Nenhum signatário resolvido. A lista no caminho {{ input.signatarios }} não trouxe nenhum item com e-mail.". | Essencial | Obrigatório |
| RF716 | O bloco Envelope deve mostrar o título e o status do envelope, com "Abrir envelope"; sem envelope criado, o bloco diz "Nenhum envelope foi criado: o erro aconteceu antes do envio.". | "Abrir envelope" abre o detalhe do envelope. | Essencial | Obrigatório |
| RF717 | Signatários deve listar cada pessoa com o nome, o e-mail, a ordem e o status, sem JSON. | Rafael Moura aparece com "Não assinou". | Importante | Obrigatório |
| RF718 | Configuração deve mostrar a credencial ("{provedor} · {credencial}"), o documento, o modo, "Aguardar a assinatura", "Expira em" e "Se não for assinado", com nomes. | A credencial aparece "Certisign · {nome da credencial}". | Importante | Obrigatório |
| RF719 | A entrada e a saída em JSON devem ficar em "Dados técnicos", recolhido. | O painel abre com "Dados técnicos" fechado. | Importante | Desejável |

# 4. Novo envelope

**Objetivo:** o novo envelope pede a credencial num campo só, recusa na hora o arquivo que o provedor não aceita, envia
direto e salva como rascunho quando ainda não há provedor.

**Onde vale:** o modal "Novo envelope", aberto em Módulos > Assinaturas.

**Protótipo:** https://pernalombr4.github.io/prototipos/modulo-de-assinaturas, menu Assinaturas > "Novo envelope".

## Credencial (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | O modal deve ter 1 campo "Provedor e credencial" no lugar dos campos Provedor e Credencial, com as credenciais agrupadas pelo nome do provedor. | O campo mostra "ClickSign" e, abaixo, as credenciais da ClickSign. | Essencial | Obrigatório |
| RF302 | O campo deve listar só as credenciais prontas para envio (RN901). | A credencial D4Sign sem cofre não aparece. | Essencial | Obrigatório |
| RF303 | Com 0 credenciais prontas, o campo deve ficar desligado com "Nenhuma credencial disponível" e, abaixo, o aviso "Nenhum provedor conectado" com "Conectar um provedor". | O botão fecha o modal e abre a seção "Assinatura eletrônica" em Apps. | Essencial | Obrigatório |

## Documento (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF304 | O campo Documento deve mostrar os formatos e o limite do provedor da credencial escolhida (RN908). | Com a credencial da Adobe Acrobat Sign: "PDF, DOCX até 10 MB na Adobe Acrobat Sign". | Essencial | Obrigatório |
| RF305 | Sem credencial escolhida, o campo deve mostrar "Escolha a credencial para ver o tamanho máximo aceito pelo provedor."; sem credencial no workspace, o limite geral da RN908. | Sem credencial no workspace: "PDF ou DOCX. O tamanho máximo depende do provedor: 20 MB na maioria e 10 MB na Adobe Acrobat Sign.". | Importante | Desejável |
| RF306 | Se o arquivo passa do limite do provedor, o campo deve recusar o arquivo na hora, com o tamanho e o limite. | Um PDF de 14,2 MB na Adobe: "O arquivo tem 14,2 MB. A Adobe Acrobat Sign aceita até 10 MB.". | Essencial | Obrigatório |
| RF307 | Se o formato não é aceito pelo provedor, o campo deve recusar o arquivo na hora, com os formatos aceitos. | Um .xlsx: "A ClickSign não aceita arquivos .xlsx. Use PDF, DOCX.". | Essencial | Obrigatório |
| RF308 | Trocar a credencial deve conferir de novo o arquivo já escolhido. | Um PDF de 14,2 MB aceito na ClickSign é recusado ao trocar para a Adobe. | Importante | Obrigatório |

## Expira em (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF309 | O campo "Expira em" deve pedir a data e a hora e aceitar só a partir do momento atual. | Em 19/11/2026, o dia 18/11 não pode ser escolhido. | Importante | Desejável |
| RF310 | O campo vazio deve usar o prazo padrão do provedor. | A ajuda diz "Opcional. Vazio usa o prazo padrão do provedor.". | Importante | Obrigatório |

## Enviar e salvar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF311 | O rodapé deve ter "Enviar para assinatura", que cria e envia o envelope de uma vez, e "Salvar rascunho". | O envelope enviado aparece na lista como "Aguardando assinaturas", sem passar por rascunho. | Essencial | Obrigatório |
| RF312 | "Enviar para assinatura" deve pedir o título, a credencial, o documento e 1 participante. | Sem a credencial, o campo fica em erro e o aviso diz "Preencha o título, a credencial, o documento e 1 participante.". | Essencial | Obrigatório |
| RF313 | "Salvar rascunho" deve pedir o título, o documento e 1 participante, sem a credencial (RN907). | O rascunho sem credencial é salvo com o provedor vazio. | Essencial | Obrigatório |
| RF314 | Com 0 credenciais prontas, o rodapé deve ter só "Salvar rascunho", como ação principal. | O modal sem provedor não mostra "Enviar para assinatura". | Essencial | Obrigatório |
| RF315 | A ajuda de Participantes deve dizer como a ordem funciona: "Mesma ordem: assinam ao mesmo tempo. Ordens diferentes: assinam em sequência.". | A ajuda aparece abaixo do título Participantes. | Importante | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | A API aceita criar o envelope sem credencial, como rascunho? | dev do back-end | Sem isso, RF313 e RF314 pedem obra no back-end |

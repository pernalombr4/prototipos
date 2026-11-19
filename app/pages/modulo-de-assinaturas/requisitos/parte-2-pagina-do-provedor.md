# 2. Página do provedor

**Objetivo:** a página de cada provedor diz se ele está pronto para enviar, guia as etapas de configuração em
sequência e diz cada recurso do provedor 1 vez, com a consequência.

**Depende de:** 1. Provedores na loja de apps.

**Onde vale:** a página do provedor, aberta pelo card dele em Configurações > Integrações > Apps.

**Protótipo:** https://pernalombr4.github.io/prototipos/modulo-de-assinaturas, card de um provedor em Apps. No
protótipo, "Como funciona", "Credenciais registradas" e "Testar conexão" mostram um aviso.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | A tabela a seguir define as etapas de configuração de cada provedor. Política: Múltipla: o provedor tem cada etapa cuja condição vale, nesta ordem. | A D4Sign tem as etapas 1 e 2; a ClickSign, as etapas 1 e 4. | Obrigatório |
| RN102 | A etapa do webhook da conta só é concluída quando o 1º retorno do provedor chega ao ENSPACE. Com credencial e sem o retorno, a etapa fica aguardando confirmação. | A Certisign com 1 credencial e sem retorno mostra a etapa "Aguardando confirmação". | Obrigatório |
| RN103 | Um provedor é considerado pronto para enviar quando tem ao menos 1 credencial pronta (RN901). | A Certisign com 1 credencial está pronta, mesmo com o webhook aguardando. | Obrigatório |

| Etapa | Nome na tela | Quando o provedor tem a etapa | Concluída quando |
|---|---|---|---|
| 1 | "Cadastre uma credencial" | sempre | há 1 credencial ou mais |
| 2 | "Escolha o cofre de cada credencial" | o provedor guarda o documento em cofre (D4Sign) | cada credencial tem cofre |
| 3 | "Autorize a integração" | a credencial é JWT (DocuSign) | o usuário da credencial autorizou o ENSPACE |
| 4 | "Cadastre o webhook no portal da {provedor}" | o retorno do status é pelo webhook da conta (ClickSign e Certisign) | RN102 |

## Topo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O topo da página deve mostrar o logo do provedor e 1 estado: "Pronto para enviar" (RN103) ou "Falta configurar". | A ClickSign sem credencial mostra "Falta configurar". | Essencial | Obrigatório |
| RF102 | Abaixo do logo, o topo deve mostrar o nome do provedor e a descrição dele. | A página da Certisign mostra "Certisign" e "Portal de Assinaturas da Certisign, com assinatura por certificado digital ICP-Brasil.". | Importante | Obrigatório |
| RF103 | O topo deve ter "Como funciona", "Credenciais registradas" e "Nova credencial", que abre o modal de nova credencial. | "Nova credencial" é a única ação de cor cheia. | Importante | Obrigatório |

## Etapas de configuração (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF104 | O bloco "Configuração" deve listar as etapas do provedor (RN101) numa linha do tempo vertical: o indicador de cada etapa ligado ao da seguinte por uma linha, sem divisória entre as etapas. | A página da Certisign mostra 2 etapas ligadas pela linha. | Essencial | Obrigatório |
| RF105 | O indicador deve dizer o estado da etapa: o sinal de concluída, o relógio de aguardando confirmação ou o número da etapa pendente. | A etapa 1 concluída mostra o sinal; a etapa 2 pendente mostra 2. | Essencial | Obrigatório |
| RF106 | A linha que sai de uma etapa concluída deve ter a cor de concluída até a etapa seguinte. | Com a etapa 1 concluída, a linha até a etapa 2 fica verde. | Importante | Desejável |
| RF107 | Cada etapa deve mostrar o nome, 1 linha de ajuda e o estado em texto: "Concluída", "Pendente" ou "Aguardando confirmação". | A etapa do webhook sem retorno diz "Aguardando confirmação". | Essencial | Obrigatório |
| RF108 | O título do bloco deve dizer o progresso: "{n} de {total} etapas concluídas" e, quando houver, "· {n} aguardando confirmação". | A Certisign mostra "1 de 2 etapas concluídas · 1 aguardando confirmação". | Importante | Desejável |

## Conteúdo de cada etapa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF109 | A etapa 1 deve listar as credenciais do provedor, cada uma com o nome, o ambiente, a data de criação e o estado: "Pronta para uso", "Cofre: {nome}" ou "Falta escolher o cofre". | Sem credencial, a etapa diz "Nenhuma credencial ainda.". | Essencial | Obrigatório |
| RF110 | O menu ⋮ de cada credencial deve ter "Testar conexão", "Trocar cofre" (só na D4Sign com cofre) e "Excluir". | A credencial da ClickSign não tem "Trocar cofre". | Importante | Obrigatório |
| RF111 | A etapa do cofre deve mostrar, para cada credencial sem cofre, o campo "Escolher cofre" com os cofres da conta. | Escolher o cofre muda a credencial para "Cofre: Jurídico" e conclui a etapa quando é a última sem cofre. | Essencial | Obrigatório |
| RF112 | A etapa do webhook deve mostrar os passos no portal, a URL do webhook oculta, com "Mostrar" e "Copiar", e o aviso "A URL leva o token do workspace. Trate como senha.". | "Mostrar" troca os pontos pelo token; "Copiar" copia a URL inteira. | Essencial | Obrigatório |
| RF113 | A etapa do webhook deve dizer "Confirmado: o 1º retorno chegou em {data e hora}." quando o retorno chegou, e o texto de aguardando quando não chegou (RN102). | A ClickSign com retorno em 10/11/2026, 10:40 mostra a data. | Essencial | Obrigatório |
| RF114 | A etapa de autorização concluída deve dizer a data da autorização. | A DocuSign mostra "Autorizada em 03/11/2026". | Importante | Obrigatório |

## O que o provedor faz (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF115 | O bloco "O que a {provedor} faz no ENSPACE" deve listar cada recurso 1 vez (RN904), com o sinal de que faz ou não faz e a consequência em 1 linha. | Na Certisign, "Cancelar envelope" diz "Cancela só no ENSPACE. O documento continua ativo no portal e precisa ser cancelado lá.". | Essencial | Obrigatório |
| RF116 | O recurso que o provedor não faz e que deixa trabalho fora do ENSPACE deve levar o sinal de atenção. | Na Certisign, "Cancelar envelope" tem o sinal de atenção. | Importante | Desejável |
| RF117 | "Detalhes técnicos" deve ficar recolhido e mostrar o identificador, o tipo de credencial, os ambientes, o "Registro do webhook" e o "Segredo do webhook". | Aberto na ClickSign, mostra "Chave de API" e "Por conta (manual)". | Desejável | Desejável |

## Nova credencial (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF118 | O modal "Nova credencial da {provedor}" deve pedir Nome, Ambiente e Chave de API, os 3 obrigatórios. | Salvar sem o ambiente mostra o erro no campo. | Essencial | Obrigatório |
| RF119 | O campo Ambiente deve abrir vazio, com os ambientes do provedor, sem valor escolhido. | A ClickSign oferece Sandbox e Produção; a DocuSign, Demonstração e Produção. | Essencial | Obrigatório |
| RF120 | Ao salvar, a credencial deve entrar na etapa 1, com o estado das etapas recalculado. | A 1ª credencial da ClickSign conclui a etapa 1 e deixa a do webhook aguardando. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | O ENSPACE guarda a data do 1º retorno do webhook de cada provedor? | dev do back-end | Sem o dado, RN102 e RF113 pedem obra nova |
| P102 | O que abrem "Como funciona" e "Credenciais registradas"? | produto | Cada botão ganha destino ou sai do topo |

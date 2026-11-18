# Pesquisa de referências: módulo de assinaturas

2026-11-18. Sem print: a pesquisa foi feita por busca e leitura de página, sem navegador.

Onde a página oficial barrou a leitura direta (ClickUp, monday, parte do Pipefy e do DocuSign), o ponto vem do resumo que o buscador fez da própria página, e a fonte diz isso.

## Notion

**Como resolve:**
1. Configurações > Conexões reúne todas as conexões do workspace, agrupadas por app, com busca e filtro por categoria.
2. App com várias funções aparece como 1 entrada só.
3. Cada conexão tem um menu `•••` com: copiar token (conexão interna), site do desenvolvedor, ver quem tem acesso e Desconectar.
4. A conexão precisa ser adicionada a cada página. Na página, o menu `•••` > Conexões lista as que agem ali.
5. No plano Enterprise, a aba Gerenciar guarda a lista de conexões aprovadas, mostra quem instalou cada uma e desconecta membros.
6. Automação de banco que falha é pausada. O Notion avisa só em parte dos casos (propriedade apagada, conexão de Gmail ou Slack inválida). Não achei fonte de histórico de execuções.

**Fonte:**
- https://www.notion.com/help/add-and-manage-integrations-with-the-api
- https://www.notion.com/help/database-automations

**Serve para o ENSPACE:**
- 1 lugar só para todas as conexões, com busca e categoria: os 5 provedores entram na loja Apps.
- 1 entrada por app: cada provedor aparece 1 vez, sem o card legado ao lado do novo.
- "Ver quem tem acesso" no menu da conexão: mostrar quem usa a credencial.
- Ações raras da conexão no menu `•••`, não em botões soltos.

**Não serve:**
- Conexão adicionada página a página: no ENSPACE a credencial vale para o workspace e se escolhe no nó.
- Automação que falha e só pausa, sem histórico: é o contrário do que o painel da execução precisa.

## Twenty CRM

**Como resolve:**
1. Configurações > Applications reúne os apps instalados e a aba Marketplace.
2. App que o Twenty não revisou só aparece com um filtro ligado e leva aviso.
3. As variáveis do app (credenciais) ficam na aba Config. O app do próprio workspace tem 3 abas: Config, Distribution e General.
4. As execuções de fluxo têm 2 portas: o painel Runs no editor do fluxo e o item Workflow Runs no menu lateral, com filtro por status, fluxo e data.
5. Status da execução: Running, Completed, Failed e Waiting (pausada num atraso ou à espera de formulário).
6. A execução mostra status, início, duração, o dado do gatilho, a saída de cada etapa e a mensagem de erro.
7. Não achei fonte sobre link da execução para o registro afetado nem sobre reexecutar.

**Fonte:**
- https://docs.twenty.com/developers/extend/apps/operations/publishing.md
- https://docs.twenty.com/user-guide/workflows/capabilities/workflow-runs.md
- https://docs.twenty.com/user-guide/workflows/how-tos/need-more-help/workflow-troubleshooting.md

**Serve para o ENSPACE:**
- Status Waiting separado de Running: o fluxo à espera da assinatura fica em espera, não em erro.
- Execuções em 2 portas: no construtor e numa lista geral com filtro.
- Saída de cada etapa na execução: o nó de assinatura mostra o envelope criado, não a configuração crua.
- App com abas curtas: a página do provedor troca as seções repetidas por abas.

**Não serve:**
- A doc de Applications é para quem publica app. Não achei fonte que descreva o estado "conectado" para quem usa.
- App como código (CLI, npm): fora do escopo do módulo.

## ClickUp

**Como resolve:**
1. O App Center é 1 página rolável com todos os apps por categoria, busca no topo e barra de categorias.
2. App já conectado leva um visto verde.
3. A conta conectada tem menu `•••` com Desconectar. App desconectado mostra Reconectar.
4. Abre-se pelo menu Mais > Apps ou pelas configurações do workspace.
5. O histórico das automações fica em Automações > editar a automação > Activity, com filtro por status (sucesso, pulada, falhou) e por data. Clicar na execução abre o detalhe.
6. O feed de atividade da tarefa registra o que a automação mudou.
7. O fórum do ClickUp tem pedido aberto de painel de falhas e de reexecutar automação que falhou.

**Fonte:**
- https://help.clickup.com/hc/en-us/articles/12580135233559-Intro-to-the-App-Center (resumo do buscador; o site barrou a leitura)
- https://help.clickup.com/hc/en-us/articles/30953763592087-Track-your-Automations-activity (resumo do buscador)
- https://feedback.clickup.com/feature-requests/p/retry-failed-automation
- https://feedback.clickup.com/feature-requests/p/automation-failure-dashboard

**Serve para o ENSPACE:**
- Visto verde no card do app conectado: substitui o selo "Legado" repetido em cada card.
- Reconectar no próprio card quando a credencial cai.
- Status "pulada" separado de "falhou": recusa e cancelamento não são erro técnico.
- Ação da automação no histórico do próprio registro: a assinatura aparece no histórico do item.

**Não serve:**
- Histórico dentro de cada automação: para achar todas as falhas é preciso abrir uma por uma. Os próprios clientes pedem um painel único.

## monday.com

**Como resolve:**
1. A aba Connections lista cada conexão com status (conectada, desconectada, instalada), nome, quadros onde está e quantas automações a usam.
2. Clicar numa conexão desconectada leva ao login do app para reconectar.
3. A aba My connections lista as conexões da conta. Menu de 3 pontos > Reconnect troca ou renova a conta.
4. As conexões também aparecem na aba Manage das automações do quadro.
5. Run history: na aba Manage, menu da automação. Lista as execuções que deram certo e as que falharam. A falha abre uma explicação destacada em vermelho. Guarda 10 dias.
6. A execução também aparece no Activity Log do item.

**Fonte:**
- https://support.monday.com/hc/en-us/articles/17366794776978-monday-com-Integrations-connection-management (resumo do buscador; o site barrou a leitura)
- https://support.monday.com/hc/en-us/articles/360017254600-Automation-Run-history (resumo do buscador)
- https://support.monday.com/hc/en-us/articles/7539673667218 (resumo do buscador)

**Serve para o ENSPACE:**
- Quantas automações usam a conexão: mostrar quantos fluxos usam cada credencial, antes de apagar.
- Status da conexão em texto, com 3 valores.
- Falha com o motivo em frase legível, junto da execução.
- Histórico do item com a automação que mexeu nele.

**Não serve:**
- Retenção de 10 dias: envelope leva semanas para fechar, e o registro precisa durar o ciclo dele.
- Conexões em 3 lugares (Connections, My connections, Manage do quadro): é o espalhamento que a demanda quer acabar.

## Pipefy

**Como resolve:**
1. App nativo liga-se no pipe, em Tools > Apps, e aparece no topo do pipe.
2. A assinatura nativa (pipesign) tem visão própria no topo do pipe. O documento nasce na visão ou no card.
3. No envio: destinatários, canal (e-mail, SMS, WhatsApp), ordem de assinatura, cópias e lembretes.
4. O documento enviado por automação aparece na visão do pipe e fica anexado ao card. O assinado abre pelo card.
5. Automation logs: na tela de Automações do pipe e dentro de cada regra. Guarda 3 meses. Mostra sucesso, falha e em andamento, e abrir o registro mostra o detalhe.
6. Na Timeline do card aparecem a automação que falhou e a que rodou sem agir (condição não atendida), com selo de retenção de 90 dias e atalho para o log filtrado por aquele card.
7. Não achei fonte sobre recusa, cancelamento e status por signatário no pipesign.

**Fonte:**
- https://help.pipefy.com/en/articles/9546521-pipesign
- https://help.pipefy.com/en/articles/9186536-automation-logs
- https://community.pipefy.com/product-updates/card-timeline-full-tracking-and-troubleshooting-for-automations-and-ai-agents-5443 (resumo do buscador; a página não abriu)
- https://developers.pipefy.com/reference/automation-logs

**Serve para o ENSPACE:**
- Falha e "rodou sem agir" na linha do tempo do card, com atalho para o log filtrado: o item mostra o resultado do nó e leva à execução.
- Documento do fluxo anexado ao card: o envelope aparece no item de origem.
- O mesmo formulário de destinatários no envio manual e no automático.

**Não serve:**
- App ligado pipe a pipe: no ENSPACE a credencial é do workspace.
- A fonte não mostra como a falha é descrita no log. Um pedido de 2024 na comunidade cobra a mensagem de erro no registro.

## Zapier

**Como resolve:**
1. A página App Connections tem 2 abas: Connections e Apps.
2. Cada conexão mostra nome, app, quantos Zaps a usam, última alteração e os avatares de quem tem acesso.
3. Visto em círculo = ativa. X em círculo = expirada, com botão Reconnect ao lado.
4. O menu da linha tem Test connection, Replace connection, Rename, Change owner e Delete. Dá para testar ou apagar até 100 de uma vez.
5. A aba Apps conta as conexões expiradas de cada app.
6. O detalhe da execução tem resumo no topo (status, data, versão do Zap, id) e os passos abaixo, cada um com ícone de status e uma frase do que aconteceu.
7. Ao clicar no passo, o painel lateral mostra Data In, Data Out, Troubleshoot e Logs. O log HTTP fica 7 dias.
8. São 11 status de execução, entre eles Errored, Safely halted (parou de propósito), Filtered, On hold (conta desconectada), Needs review e Skipped (só no passo).

**Fonte:**
- https://help.zapier.com/hc/en-us/articles/8496290788109
- https://help.zapier.com/hc/en-us/articles/20512774106125
- https://help.zapier.com/hc/en-us/articles/20505304170637

**Serve para o ENSPACE:**
- "Usada em N fluxos" em cada credencial.
- Estado da credencial com ícone e texto, e Reconectar na mesma linha.
- Testar conexão no menu da credencial.
- Execução com resumo no topo e passo descrito em frase, não a configuração crua.
- Status "On hold" para fluxo parado por credencial caída.
- Parada esperada separada de erro: recusa e expiração são desfecho do negócio.

**Não serve:**
- Log HTTP por passo à vista do usuário comum: é o detalhe técnico que o ENSPACE já repete demais. Cabe atrás de "Detalhes técnicos".
- Não achei fonte de link do passo para o registro criado no app externo.

## Make

**Como resolve:**
1. Credentials > Connections, no menu lateral, reúne todas as conexões.
2. Ações por conexão: Verify, Reauthorize, Edit e Delete.
3. Visto verde = verificada. Ponto de exclamação = com problema.
4. Um ícone mostra quais cenários usam a conexão. Ao apagar, o Make avisa e lista os cenários.
5. Editar a credencial vale para todos os módulos que a usam.
6. A conexão nasce dentro do módulo (Create a connection) e fica disponível para a equipe.
7. Na aba History, cada execução tem data, status (Success, Warning, Error), duração e operações. Details mostra a saída de cada módulo. O erro fica marcado em cima do módulo, com a opção Explain error.

**Fonte:**
- https://help.make.com/connect-an-application
- https://help.make.com/scenario-history

**Serve para o ENSPACE:**
- Criar a credencial dentro do nó, sem sair do construtor, e ela aparecer na loja.
- Apagar credencial em uso: aviso com a lista dos fluxos afetados.
- Verificar a credencial, com o resultado em ícone.
- Erro marcado no próprio nó, no canvas da execução.
- Status Warning entre sucesso e erro.

**Não serve:**
- Pacotes (bundles) e operações: vocabulário de integrador, não de quem usa o ENSPACE.

## DocuSign

**Como resolve:**
1. Status do envelope: Sent, Delivered, Waiting for Others, Correcting, Completed, Declined, Voided e Expired.
2. As ações ficam no menu do envelope na lista (Manage) e em "More" nos detalhes: Resend, Correct, Void, History.
3. Resend manda um novo e-mail só a quem está na vez.
4. Correct muda destinatário e documento enquanto o envelope está em andamento. Some quando o envelope conclui.
5. Void exige motivo. O motivo vai no e-mail aos destinatários e fica nos detalhes e no histórico. O documento ganha a marca VOID. Quem já assinou e o remetente continuam vendo.
6. Decline é ação do destinatário, com motivo obrigatório, e encerra a assinatura para os demais. Em ordem sequencial, só quem já assinou é avisado.
7. Apagar um envelope em andamento não o anula: os lembretes continuam.
8. O Envelope History registra o que remetente e destinatários fizeram. O Certificate of Completion guarda nome, e-mail, horário e IP de cada evento.
9. Status por destinatário: sent (avisado de que é a vez dele), delivered (abriu), completed, declined e autoresponded (o e-mail voltou com resposta automática).
10. Não achei fonte oficial do layout da página de detalhes (quais ações ficam à vista e quais vão para "More"), nem de status para o destinatário que ainda não chegou à vez: o `created` vale para rascunho.

**Fonte:**
- https://www.docusign.com/en-gb/blog/quick-tip-tuesday-deleting-or-voiding-envelopes-in-docusign
- https://docusign.docs.buildwithfern.com/docs/esign-rest-api/esign101/concepts/recipients/status-codes.md
- https://www.docusign.com/trust/security/transaction-data-use
- https://community.docusign.com/esignature-171/no-resend-option-24145 (comunidade)
- https://www.astate.edu/a/enrollment-management/data-technology/DocuSign/Files/DocuSign%20-%20Manage%20Envelopes.pdf (guia de universidade, resumo do buscador; o arquivo não abriu)

**Serve para o ENSPACE:**
- Motivo obrigatório ao cancelar, gravado no histórico e enviado aos signatários.
- Reenviar só para quem está na vez, e o botão diz para quem vai.
- Ações raras (corrigir, histórico, cancelar) agrupadas em "Mais ações".
- Status por signatário, com "abriu" separado de "avisado".
- Recusa com o motivo do signatário no histórico.
- Histórico com quem fez, quando e de onde.
- Cancelar (vale para todos) separado de Excluir (só some da lista).

**Não serve:**
- Corrigir envelope já enviado: depende do provedor, e não achei fonte de que os 5 aceitam.
- Marca VOID no PDF: quem aplica é o provedor, não o ENSPACE.

## PandaDoc

Escolhido no lugar da Clicksign: a ajuda do PandaDoc descreve status, trilha e ordem de assinatura. Na Clicksign, as páginas públicas de ajuda não abriram, e a API não descreve a tela.

**Como resolve:**
1. Status do documento: Draft, Sent, Viewed, For approval, Completed, Waiting for payment, Declined e Expired.
2. A aba "Waiting for others" reúne os enviados ainda abertos.
3. O Audit trail abre por um botão no topo do documento enviado ou por File > Document > Audit trail, e exporta CSV.
4. A trilha registra criação, envio, visualização, assinatura, aprovação, destinatário adicionado, editado, removido ou trocado, recusa e expiração. O evento de envio guarda o texto do e-mail.
5. Documento enviado não se cancela. Ou se arquiva (some sem aviso ao destinatário) ou se muda o status para Expired (o destinatário perde o acesso e recebe e-mail).
6. A mudança manual de status aceita nota privada, que vai para a trilha.
7. Ordem de assinatura: chave Set signing order no painel de destinatários, arrastar para ordenar, agrupar quem assina junto. Dá para mudar a ordem de quem ainda não recebeu.

**Fonte:**
- https://support.pandadoc.com/en/articles/9714824-home
- https://support.pandadoc.com/nl/articles/9714819-review-audit-trail-for-sent-documents
- https://support.pandadoc.com/en/articles/9714685-how-do-i-cancel-void-a-document-that-i-have-already-sent
- https://support.pandadoc.com/en/articles/9714771-signing-order

**Serve para o ENSPACE:**
- Filtro rápido "Aguardando outros" na lista de envelopes.
- Trilha com a troca de signatário e o texto do e-mail enviado.
- Nota na mudança de estado, gravada na trilha.
- Ordem com grupos: signatários do mesmo nível assinam juntos.

**Não serve:**
- Sem cancelamento de verdade: arquivar some sem aviso. O ENSPACE precisa cancelar no provedor e registrar.
- Declined marcado à mão para negócio perdido: no ENSPACE a recusa vem do signatário.

## O padrão que todos seguem

- 1 lugar para todas as conexões, e cada app aparece 1 vez (Notion, ClickUp, Zapier, Make, Twenty).
- Estado da conexão em ícone e texto no card ou na linha, com Reconectar ali mesmo (ClickUp, Zapier, Make, monday).
- Ações raras da conexão no menu `•••` (Notion, ClickUp, Zapier, Make, monday).
- Quantos fluxos usam cada credencial (Zapier, monday, Make).
- Execução com status no topo e cada passo com status próprio (Zapier, Twenty, Make).
- Desfecho esperado separado de erro (Safely halted e Filtered no Zapier, pulada no ClickUp, "rodou sem agir" no Pipefy, Waiting no Twenty).
- Resultado da automação também no histórico do registro (ClickUp, monday, Pipefy).
- Cancelar pede motivo e grava no histórico; as ações raras ficam em "Mais" (DocuSign).
- Histórico com quem fez e quando (DocuSign, PandaDoc).

## O que nenhum deles faz

- Ligar o passo da execução ao objeto que ele criou: nenhuma fonte mostra o passo abrindo o registro no app externo (Zapier, Twenty, Make). O nó do ENSPACE pode abrir o envelope.
- Marcar no canvas da execução o desfecho de negócio (recusado, cancelado, expirado) com cor e texto diferentes do erro técnico. As plataformas de fluxo separam parada esperada de erro, mas nenhuma trata recusa de assinatura.
- Juntar as 2 pontas do autor: o DocuSign diz quem fez cada ação no envelope; as plataformas de fluxo dizem qual execução rodou. Nenhum mostra no envelope "enviado pelo fluxo X, execução Y".
- Guardar o histórico pelo ciclo inteiro do envelope: monday guarda 10 dias, o log HTTP do Zapier 7 dias, o Pipefy 90 dias.
- Mostrar quem ainda não chegou à vez: o DocuSign tem status por destinatário, mas a fonte oficial não tem um status para quem espera a vez. O ENSPACE pode mostrar "aguardando a vez" ao lado de "avisado" e "abriu".

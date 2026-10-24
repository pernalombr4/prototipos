# Requisitos: aba Proteções do Spaceflow

**Objetivo:** quem configura um fluxo do Spaceflow decide quanto o fluxo pode rodar, o que acontece com o disparo que
passa do limite e quem fica sabendo, e vê o que as proteções já seguraram.

**Onde vale:** no editor de cada fluxo (Configurações › Estrutura › Spaceflow › um fluxo,
`/workspaces/<ws>/settings/data/workflows/<id>`), na aba nova Proteções; na aba Execuções do mesmo editor; e no
card do nó, no canvas da aba Editor.

**Pré-requisito técnico:** antes de qualquer bloqueio, o sistema de gatilho e de verificação dos fluxos precisa de um
cache dos fluxos disponíveis, que dispense a consulta ao banco a cada disparo (apontado pelo líder dos devs em
24/10/2026; ver RS001). Toda proteção deste documento é conferida no momento do disparo.

**Referência visual:** protótipo `protecoes-do-spaceflow`, rodada 1 de 24/10/2026, versões Completa e MVP no
andaime. Prints em `evidencias/proposta-*.jpg`; a tela de hoje em `evidencias/dev-*.jpg`.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português. **Prioridade Essencial é o MVP**; Importante e Desejável são a versão
completa, entregue depois do MVP. Número marcado "<proposta: ..., sem medição>" veio do mercado (PESQUISA.md), não
de medição do ENSPACE.

**Fora do escopo:** a casca da tela; o canvas, exceto o rodapé do card do nó que fecha um ciclo (RF078); as abas
Versões, Comentários e Logs; o modal dos nós; a lista de fluxos em Configurações › Estrutura › Spaceflow; a cota de
en-credits da conta.

## Resumo

| Grupo | O que muda em relação ao develop de 24/10/2026 | MVP | Completa |
|---|---|---|---|
| Regras de negócio | Proteção por fluxo, fora das versões; disparo segurado vira execução; espera por pessoa não ocupa vaga; cadeia; valores iniciais; status novos | RN001 a RN009 | RN010 |
| Aba Proteções | Aba nova depois de Execuções, com resumo das 24 horas, índice, salvar e descartar | RF001 a RF014, RF085 | RF015 a RF017 |
| Volume de disparos | Limite por minuto; limite por dia, destino do excesso e janela de horário na completa | RF018 a RF020 | RF021 a RF027 |
| Execuções ao mesmo tempo | Limite de execuções em andamento; destino quando lota, vaga por item, prazo na fila e Timer na completa | RF028 a RF031 | RF032 a RF037 |
| Disparos repetidos | Não existe no MVP | | RF038 a RF043 |
| Repetição sem fim | Ignorar mudanças feitas por fluxos; parar a cadeia; ciclos encontrados na completa | RF044 a RF048, RF084 | RF049 a RF051 |
| Tempo e erros | Pausar depois de N erros seguidos, faixa de fluxo pausado e retomar; tempo máximo na completa | RF052 a RF058 | RF059 a RF061 |
| Custo de IA | Não existe no MVP | | RF062 a RF067 |
| Avisos | Avisar o dono; destinatários, frequência e eventos na completa | RF068 a RF069 | RF070 a RF073 |
| Aba Execuções | Status Na fila e Interrompida com motivo; filtro por status; Ignorada, Retida e decisão em lote na completa | RF074 a RF077 | RF079 a RF083 |
| Canvas | Aviso de ciclo no card do nó | | RF078 |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Disparo | Cada evento que inicia o fluxo: item criado ou alterado, chamada ao webhook, e-mail recebido, horário do Timer, início manual. | disparo |
| Proteção | Cada regra da aba Proteções. | Proteções |
| Execução segurada | Execução que uma proteção pôs na fila, ignorou, reteve ou interrompeu. | Na fila, Ignorada, Retida, Interrompida |
| Cadeia de disparos | Sequência de execuções em que algo feito pela anterior dispara a seguinte (RN004). | cadeia de disparos |
| Espera por pessoa | Execução parada num Formulário, numa Aprovação, numa Tarefa, num Iniciar Fluxo manual ou num Atraso. | Esperando tarefa, Esperando o Atraso |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN001 | As proteções pertencem ao fluxo e não fazem parte das versões dele. Uma proteção salva vale a partir da próxima execução. | O fluxo está na v2.3.0; o limite muda de 60 para 30 por minuto; a versão continua 2.3.0 e as execuções seguintes já obedecem a 30. |
| RN002 | Um disparo segurado por uma proteção não pode sumir sem registro: cada um vira uma execução com o status da RN007. | 80 itens criados no mesmo minuto com limite de 60: 60 execuções começam e 20 aparecem "Na fila". |
| RN003 | Uma execução em espera por pessoa não conta no limite de execuções ao mesmo tempo. | Limite 10, com 6 execuções paradas numa Aprovação: até 10 outras podem rodar. |
| RN004 | Uma execução pertence a uma cadeia de disparos quando foi disparada por uma gravação de item, um e-mail enviado, um Iniciar Fluxo ou uma chamada ao webhook feita por outra execução de Spaceflow. O nível da execução é a posição dela na cadeia. | O fluxo A grava em Contratos, o que dispara B (nível 2); B inicia C pelo Iniciar Fluxo (nível 3). |
| RN005 | A contagem de erros seguidos de um fluxo volta a zero quando uma execução dele termina com o status Completo. | Erro, erro, Completo, erro: a contagem está em 1. |
| RN006 | A tabela a seguir define o valor inicial de cada proteção. Política: Única. | Linha 3: um fluxo criado antes da funcionalidade não ganha limite de execuções ao mesmo tempo. |
| RN007 | A tabela a seguir define o status da execução segurada por situação. Política: Única. | Linha 4: execução que passa de 10 níveis na cadeia termina "Interrompida". |
| RN008 | Só um membro com permissão de editar o fluxo pode alterar as proteções, retomar o fluxo pausado e liberar ou descartar execuções retidas. | Um membro que só vê o fluxo abre a aba Proteções em somente leitura. |
| RN009 | O limite por dia conta da meia-noite à meia-noite, no fuso do workspace. | Workspace no fuso de Brasília: o limite volta a 0 às 00:00 de Brasília. |
| RN010 | Um disparo que chega fora da janela de horário do fluxo espera na fila até a janela abrir. | Janela de segunda a sexta, das 08:00 às 18:00: um item criado no sábado às 10:00 roda na segunda às 08:00. |

**RN006: valor inicial de cada proteção**

| Linha | Proteção | Fluxo criado depois da funcionalidade | Fluxo que já existia |
|---|---|---|---|
| 1 | Limitar execuções por período | ligada, <proposta: 60 por minuto, sem medição> | desligada |
| 2 | Limitar execuções por dia | desligada | desligada |
| 3 | Limitar execuções em andamento | ligada, <proposta: 10, sem medição> | desligada |
| 4 | Mudanças feitas por fluxos não disparam este fluxo (Ações de Itens e E-mail recebido) | ligada | ligada |
| 5 | Parar a cadeia de disparos | ligada, <proposta: 10 níveis, sem medição> | ligada, <proposta: 10 níveis, sem medição> |
| 6 | Pausar o fluxo depois de erros seguidos | ligada, <proposta: 3 erros, sem medição> | desligada |
| 7 | Avisar o dono do fluxo | ligada | ligada |
| 8 | Teto de IA por execução (completa) | ligada, <proposta: 50 en-credits, sem medição> | desligada |
| 9 | Demais proteções da versão completa | desligadas | desligadas |

**RN007: status da execução segurada**

| Linha | Situação | Status | Motivo escrito na execução |
|---|---|---|---|
| 1 | Passou do limite por minuto ou por dia, com o excesso indo para a fila | Na fila | "Limite de execuções por minuto" ou "Limite de execuções por dia" |
| 2 | Todas as vagas de execução estão ocupadas, com a nova esperando a vez | Na fila | "Esperando vaga" |
| 3 | O fluxo está pausado, com os disparos guardados | Na fila | "Guardada com o fluxo pausado" |
| 4 | A cadeia passou do número de níveis | Interrompida | "A cadeia passou de <N> disparos encadeados" |
| 5 | Passou do limite, com o excesso ignorado (completa) | Ignorada | "Limite de execuções por minuto" ou "Limite de execuções por dia" |
| 6 | Disparo repetido ou juntado com uma edição seguinte (completa) | Ignorada | "Disparo repetido" ou "Juntada com a edição seguinte do mesmo item" |
| 7 | Ficou na fila além do prazo (completa) | Ignorada | "Expirou na fila" |
| 8 | Passou do limite, com o excesso retido (completa) | Retida | o limite que reteve |
| 9 | Chegou no teto de IA, com a opção de pedir aprovação (completa) | Retida | "Teto de en-credits por execução" |
| 10 | Passou do tempo máximo (completa) | Interrompida | "Passou do tempo máximo" |
| 11 | Substituída por uma execução mais nova (completa) | Interrompida | "Substituída por uma execução mais nova" |
| 12 | Disparo chegou fora da janela de horário (completa) | Na fila | "Fora do horário permitido" |

## Aba Proteções (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF001 | O editor do fluxo deve mostrar a aba "Proteções" logo depois da aba "Execuções". | A ordem das abas é Editor, Execuções, Proteções, Versões, Comentários, Logs. | Essencial |
| RF002 | A aba deve abrir com o título "Proteções" e a frase "Regras que limitam quanto este fluxo roda e definem o que acontece com o que passar do limite. Valem a partir da próxima execução e não criam versão nova." | Os 2 textos aparecem no topo da aba. | Essencial |
| RF003 | A aba deve mostrar, sob "Últimas 24 horas", o total de execuções e quantas estão Na fila agora, Interrompidas e as Pausas do fluxo no período. | Exemplo: fluxo com 14 execuções na fila mostra "Na fila agora 14". | Essencial |
| RF004 | Quando o membro clica num número do resumo, o sistema deve abrir a aba Execuções filtrada pelo status daquele número. | Clicar em "Na fila agora" abre Execuções com o filtro "Na fila" ativo. | Essencial |
| RF005 | Enquanto o fluxo não tiver execução, o resumo deve mostrar "Este fluxo ainda não rodou. Os números aparecem depois da primeira execução." no lugar dos números. | Fluxo recém-criado mostra a frase e nenhum número. | Essencial |
| RF006 | A aba deve agrupar as proteções em cartões com título, frase de explicação e as regras do grupo. | O MVP mostra 5 cartões: Volume de disparos, Execuções ao mesmo tempo, Repetição sem fim, Tempo e erros, Avisos. | Essencial |
| RF007 | Cada regra que pode ser ligada e desligada deve ter uma chave com o rótulo da regra e a frase de ajuda abaixo. | "Limitar execuções por período" tem chave e "Recomendado: 60 por minuto." abaixo. | Essencial |
| RF008 | Os campos de uma regra devem aparecer só com a chave da regra ligada. | Desligar "Limitar execuções em andamento" esconde o número e o texto da espera por pessoa. | Essencial |
| RF009 | Quando um campo da aba muda, o sistema deve mostrar a barra fixa no rodapé da aba com a contagem de alterações, "Descartar" e "Salvar proteções". | Mudar 60 para 30 mostra "1 alteração não salva". | Essencial |
| RF010 | Quando o membro clica em "Salvar proteções", o sistema deve gravar as proteções e mostrar o aviso "Proteções salvas" com "Valem a partir da próxima execução.", conforme RN001. | Depois de salvar, a barra some e a versão do fluxo continua a mesma. | Essencial |
| RF011 | Quando o membro clica em "Descartar", o sistema deve voltar cada campo da aba ao último valor salvo. | Mudar 60 para 30 e descartar mostra 60 de novo. | Essencial |
| RF012 | Se um número de regra ligada está vazio ou fora da faixa da regra, o sistema deve mostrar sob o campo "Informe um número inteiro de <mínimo> a <máximo>." e desabilitar "Salvar proteções". | Exemplo: limite por minuto vazio mostra a mensagem, e a barra diz "Corrija 1 campo para salvar". | Essencial |
| RF013 | Se a gravação falha, o sistema deve manter os campos como estão e mostrar o aviso "Não foi possível salvar as proteções" com "Suas alterações continuam na tela. Tente de novo." | Com a gravação recusada, os valores digitados continuam na tela. | Essencial |
| RF014 | Enquanto o membro não tiver permissão de editar o fluxo (RN008), a aba deve mostrar "Somente leitura" com "Somente quem pode editar este fluxo altera as proteções." e cada campo desabilitado. | Membro com acesso de leitura não consegue mudar nenhuma chave nem número. | Essencial |
| RF085 | Enquanto houver alteração não salva na aba Proteções, trocar para outra aba do editor e voltar deve manter a alteração e a barra de salvar. | Mudar 60 para 30, abrir Execuções e voltar: o campo mostra 30 e a barra "1 alteração não salva". | Essencial |
| RF015 | A aba deve mostrar, à esquerda dos cartões, o índice "Nesta página" com cada grupo e um ponto que diz se o grupo tem regra ligada. | Clicar em "Custo de IA" no índice rola até o cartão; o ponto fica verde com uma regra ligada. | Desejável |
| RF016 | Cada cartão deve mostrar o selo "Agiu <N> vezes hoje" quando as regras do grupo seguraram execuções no dia. | Volume de disparos com 4 execuções na fila por limite mostra "Agiu 4 vezes hoje". | Desejável |
| RF017 | Quando o membro clica em "Restaurar recomendadas", o sistema deve preencher os campos com os valores de fluxo novo da RN006, sem salvar. | Depois de restaurar, a barra mostra as alterações e nada vale até salvar. | Desejável |

## Volume de disparos (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF018 | O cartão deve ter a regra "Limitar execuções por período" com o número de execuções por minuto. | Ligada com 60, a linha diz "60 execuções por minuto". | Essencial |
| RF019 | Quando os disparos de 1 minuto passam do limite, o sistema deve pôr o excesso na fila e iniciar cada um assim que o limite permitir (RN002, RN007 linha 1). | Exemplo: limite 60, 80 disparos no mesmo minuto; 20 execuções aparecem "Na fila" e começam no minuto seguinte. | Essencial |
| RF020 | No MVP, o cartão deve mostrar o destino fixo do excesso: "O que passar do limite espera na fila. Nada se perde." | O texto aparece sem campo de escolha. | Essencial |
| RF021 | A regra "Limitar execuções por período" deve oferecer o período "minuto" ou "hora". | Escolher "hora" com 500 limita a 500 execuções por hora. | Importante |
| RF022 | O cartão deve ter a regra "Limitar execuções por dia", contada conforme RN009. | Ligada com 5.000, a execução 5.001 do dia recebe o destino de RF023. | Importante |
| RF023 | O cartão deve ter o campo "O que passar do limite" com as opções "Espera na fila", "É ignorado" e "Fica retido até alguém liberar", cada uma com a frase do que acontece. | A opção recomendada traz "(recomendado)" no nome; a frase da escolhida aparece sob o campo. | Importante |
| RF024 | Quando o destino é "É ignorado", o sistema deve registrar o excesso como Ignorada, sem executar (RN007 linha 5). | Exemplo: limite 60, 70 disparos; 10 execuções "Ignorada" com o motivo do limite. | Importante |
| RF025 | Quando o destino é "Fica retido até alguém liberar", o sistema deve registrar o excesso como Retida (RN007 linha 8). | O excesso aparece em Execuções com o status Retida. | Importante |
| RF026 | O cartão deve ter a regra "Rodar só em horário definido" com "Horário comercial do workspace" ou "Horário personalizado", conforme RN010. | Horário comercial usa os dias úteis e o horário do Calendário em Configurações › Sistema. | Desejável |
| RF027 | Quando a janela é "Horário personalizado", a regra deve mostrar os 7 dias da semana para marcar e o horário de início e de fim. | Marcar Seg a Sex, das 08:00 às 18:00, grava os 5 dias e os 2 horários. | Desejável |

## Execuções ao mesmo tempo (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF028 | O cartão deve ter a regra "Limitar execuções em andamento" com o número de execuções ao mesmo tempo. | Ligada com 10, a linha diz "10 ao mesmo tempo". | Essencial |
| RF029 | A regra deve mostrar o texto "Esperar por uma pessoa não ocupa vaga." com a explicação de RN003. | O texto aparece com a chave ligada. | Essencial |
| RF030 | Quando o número de execuções em andamento chega ao limite, o sistema deve pôr a nova execução na fila e iniciá-la quando uma vaga abrir (RN007 linha 2). | Exemplo: limite 10, 10 em andamento, 6 paradas em Aprovação; a 11ª que chega espera "Na fila" com "Esperando vaga". | Essencial |
| RF031 | No MVP, a regra deve mostrar o comportamento fixo: "Quando todas as vagas estiverem ocupadas, a nova execução espera a vez na fila." | O texto aparece sem campo de escolha. | Essencial |
| RF032 | A regra deve ter o campo "Quando todas as vagas estiverem ocupadas" com "A nova espera a vez", "A nova é ignorada" e "A mais antiga é interrompida". | Com "A mais antiga é interrompida", a execução mais antiga em andamento termina "Interrompida" (RN007 linha 11) e a nova começa. | Importante |
| RF033 | Com o gatilho Ações de Itens, o cartão deve ter a regra "Uma execução por item de cada vez". | Ligada, o 2º disparo do mesmo item espera a execução anterior do item terminar. | Importante |
| RF034 | O cartão deve ter a regra "Prazo para esperar na fila", em horas. | Ligada com 24, a execução que passa 24 horas na fila termina "Ignorada" com "Expirou na fila" (RN007 linha 7). | Importante |
| RF035 | Com o gatilho Timer, o cartão deve ter o campo "Se o horário chegar com a execução anterior em andamento" com "Rodar junto", "Pular este horário" e "Esperar a anterior terminar". | "Rodar junto" mantém o comportamento de hoje. | Importante |
| RF036 | Quando o Timer chega com a anterior em andamento e a opção é "Pular este horário", o sistema deve registrar o horário como Ignorada. | Timer de hora em hora com execução de 70 minutos: o horário seguinte aparece "Ignorada". | Importante |
| RF037 | Quando o Timer chega com a anterior em andamento e a opção é "Esperar a anterior terminar", o sistema deve iniciar a nova execução logo depois que a anterior terminar. | A nova execução começa no minuto em que a anterior termina. | Importante |

## Disparos repetidos (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF038 | Com o gatilho Webhook, o cartão deve ter a regra "Ignorar chamada repetida", com o campo do formulário do webhook que identifica a chamada e o prazo em horas. | Configurado com `id` e 24 horas. | Importante |
| RF039 | Quando chega uma chamada com valor igual ao de uma chamada anterior no campo escolhido, dentro do prazo, o sistema deve registrar a chamada como Ignorada com "Disparo repetido". | Exemplo: 2 chamadas com `id` 5531 em 10 minutos; a 2ª aparece "Ignorada". | Importante |
| RF040 | Com o gatilho Ações de Itens, o cartão deve ter a regra "Juntar edições seguidas do mesmo item", com os minutos sem edição. | Ligada com 2, o fluxo roda 2 minutos depois da última edição do item, com os dados mais recentes. | Importante |
| RF041 | Com o gatilho Ações de Itens, o cartão deve ter a regra "Limitar disparos por item" com "Cada item dispara este fluxo uma vez só" e "De novo só depois que a anterior terminar". | Com "uma vez só", o 2º disparo do mesmo item não cria execução. | Importante |
| RF042 | Com o gatilho E-mail recebido, o cartão deve ter a regra "Ignorar e-mail repetido", que junta mensagens com remetente e assunto iguais aos de uma mensagem anterior, dentro do prazo em minutos. | 2 mensagens iguais em 5 minutos, com prazo de 10: a 2ª aparece "Ignorada". | Importante |
| RF043 | Com os gatilhos Manual e Timer, o cartão deve mostrar "O gatilho <nome> não recebe disparos repetidos. Não há nada a configurar nesta seção." | Gatilho Timer mostra a frase e nenhuma regra. | Importante |

## Repetição sem fim (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF044 | Com o gatilho Ações de Itens, o cartão deve ter a regra "Mudanças feitas por fluxos não disparam este fluxo". | A regra aparece só com esse gatilho e com E-mail recebido (RF046). | Essencial |
| RF045 | Enquanto a regra de RF044 está ligada, o sistema deve ignorar a gravação de item feita por um Spaceflow do workspace ao decidir se dispara o fluxo. | Exemplo: o fluxo grava "Em revisão" em Status de um contrato; nenhuma execução nova começa. Uma pessoa edita o mesmo contrato; a execução começa. | Essencial |
| RF046 | Com o gatilho E-mail recebido, o cartão deve ter a regra "E-mails enviados por fluxos não disparam este fluxo". | A regra aparece só com esse gatilho. | Essencial |
| RF084 | Enquanto a regra de RF046 está ligada, o sistema deve ignorar a mensagem que um Spaceflow do workspace enviou ao decidir se dispara o fluxo. | O fluxo responde para a caixa que observa; a resposta não inicia execução. | Essencial |
| RF047 | O cartão deve ter a regra "Parar a cadeia de disparos" com o número de níveis (RN004). | Ligada com 10, a linha diz "depois de 10 disparos encadeados". | Essencial |
| RF048 | Quando uma execução passaria do número de níveis da cadeia, o sistema deve interrompê-la (RN007 linha 4) e avisar o dono do fluxo. | Exemplo: A dispara B, que dispara A, até o nível 11; a execução do nível 11 termina "Interrompida" e o dono recebe o aviso. | Essencial |
| RF049 | Com os gatilhos Ações de Itens e E-mail recebido, o cartão deve listar em "Ciclos encontrados neste fluxo" o nó que pode disparar o próprio fluxo, com a explicação e o botão "Ver no editor". | Fluxo que grava em Contratos e dispara por Contratos mostra o aviso do nó "Marcar para revisão". | Importante |
| RF050 | Enquanto a regra de RF044 ou de RF046 está ligada, o aviso do ciclo deve trocar para "Resolvido" com o nome da regra. | Ligar a regra troca o aviso amarelo pelo verde "Resolvido: ...". | Importante |
| RF051 | Quando o membro clica em "Ver no editor", o sistema deve abrir a aba Editor com o nó do ciclo destacado. | O card do nó pisca com o contorno de aviso por 2 segundos. | Importante |

## Tempo e erros (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF052 | O cartão deve ter a regra "Pausar o fluxo depois de erros seguidos" com o número de erros (RN005). | Ligada com 3, a linha diz "depois de 3 erros seguidos". | Essencial |
| RF053 | Quando a contagem de erros seguidos chega ao número da regra, o sistema deve pausar o fluxo e avisar o dono. | Exemplo: 3 execuções seguidas terminam "Erro"; o fluxo fica pausado. | Essencial |
| RF054 | Enquanto o fluxo está pausado, o sistema deve guardar cada disparo como execução Na fila (RN007 linha 3). | 14 itens criados com o fluxo pausado aparecem "Na fila" com "Guardada com o fluxo pausado". | Essencial |
| RF055 | Enquanto o fluxo está pausado, o editor deve mostrar em cada aba a faixa "Fluxo pausado pela proteção", com a hora, o número de erros e quantos disparos estão guardados. | Exemplo: "Pausado às 10:42 depois de 3 erros seguidos. 14 disparos estão guardados e rodam quando alguém retomar o fluxo." | Essencial |
| RF056 | Enquanto o fluxo está pausado, a barra de abas deve mostrar o selo "Fluxo pausado" e um ponto na aba Proteções. | O selo aparece ao lado das setas de versão. | Essencial |
| RF057 | Quando um membro com permissão (RN008) clica em "Retomar fluxo", o sistema deve tirar a pausa e liberar os disparos guardados para a fila comum. | Depois de retomar, a faixa some e o aviso "Fluxo retomado" diz que os disparos entraram na fila. | Essencial |
| RF058 | Quando o membro clica em "Ver erros" na faixa, o sistema deve abrir a aba Execuções filtrada pelo status Erro. | A lista mostra só as execuções com Erro. | Essencial |
| RF059 | O cartão deve ter o campo "Disparos que chegarem com o fluxo pausado" com "Ficam guardados" e "São ignorados". | Com "São ignorados", cada disparo durante a pausa aparece "Ignorada". | Importante |
| RF060 | O cartão deve ter a regra "Tempo máximo de uma execução", em horas, sem contar a espera por pessoa. | Ligada com 2, uma execução que passa 2 horas rodando termina "Interrompida" (RN007 linha 10); 3 dias parada numa Aprovação não contam. | Importante |
| RF061 | O MVP deve mostrar o comportamento fixo da pausa: "Disparos que chegarem com o fluxo pausado ficam guardados e rodam quando alguém retomar o fluxo." | O texto aparece sem campo de escolha. | Essencial |

## Custo de IA (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF062 | O cartão deve ter a regra "Teto por execução", em en-credits, com a média das últimas 30 execuções e a que mais gastou na frase de ajuda. | Exemplo: "Média das últimas 30 execuções: 18 en-credits. A que mais gastou usou 41." | Importante |
| RF063 | O cartão deve ter a regra "Teto por dia", em en-credits, com a barra do gasto do dia. | Exemplo: "Hoje: 214 de 1000 en-credits". | Importante |
| RF064 | Com uma das 2 regras ligada, o cartão deve ter o campo "Ao chegar no teto" com "A execução pausa e pede aprovação" e "A execução termina com erro". | As 2 opções aparecem com a frase do que acontece. | Importante |
| RF065 | Quando uma execução chega no teto e a opção é pedir aprovação, o sistema deve deixá-la Retida antes do nó de IA (RN007 linha 9). | A execução aparece "Retida" com "Teto de en-credits por execução". | Importante |
| RF066 | Quando uma execução chega no teto e a opção é terminar com erro, o sistema deve encerrar a execução como Erro sem rodar o nó de IA. | A execução aparece "Erro" e o nó de IA não consome en-credits. | Importante |
| RF067 | Se o fluxo não tem nó de IA, o cartão Custo de IA deve continuar visível com as regras. | Ver P5. | Desejável |

## Avisos (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF068 | No MVP, o cartão deve ter a regra "Avisar o dono do fluxo", com "Por e-mail e no sino, na hora em que o fluxo for pausado ou uma cadeia de disparos for interrompida." | Com a regra ligada, a pausa de RF053 gera e-mail e notificação no sino para o dono. | Essencial |
| RF069 | Enquanto a regra de RF068 está desligada, o sistema deve deixar de avisar o dono pela pausa e pela cadeia interrompida. | Com a regra desligada, a pausa não gera e-mail nem notificação. | Essencial |
| RF070 | Na versão completa, o cartão deve ter "Quem recebe", com pessoas e cargos do workspace, e o dono marcado "(dono do fluxo)". | A lista separa Pessoas e Cargos. | Importante |
| RF071 | O cartão deve ter "Quando avisar" com "Na hora", "Resumo a cada hora" e "Resumo diário". | "Resumo diário" manda 1 aviso por dia, às 8h, só quando algo aconteceu. | Importante |
| RF072 | O cartão deve ter "Avisar quando" com os eventos: proteção segurou, reteve ou ignorou disparos; fluxo pausado; cadeia interrompida; teto de IA; fila acima de um número de execuções. | Marcar só "O fluxo for pausado" gera aviso só da pausa. | Importante |
| RF073 | Se a regra de aviso está ligada com a lista de destinatários vazia, o sistema deve mostrar "Escolha ao menos uma pessoa ou um cargo." e desabilitar "Salvar proteções". | Tirar o dono da lista bloqueia o salvar. | Importante |

## Aba Execuções e canvas (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF074 | Cada execução segurada deve mostrar o status da RN007 com ícone próprio e, abaixo, o motivo escrito. | "Na fila" com relógio e "Esperando vaga" abaixo. | Essencial |
| RF075 | Cada execução em andamento parada em espera por pessoa deve mostrar "Esperando tarefa" ou "Esperando o Atraso" abaixo do status, com a dica "Não ocupa vaga no limite de execuções ao mesmo tempo." | A dica aparece ao passar o ponteiro. | Essencial |
| RF076 | A aba deve mostrar acima da tabela os filtros "Todas" e cada status presente na lista, com a contagem. | Exemplo: "Na fila 12", "Interrompida 1", "Em andamento 17". | Essencial |
| RF077 | Quando o membro clica num filtro, a tabela deve mostrar só as execuções daquele status. | Clicar em "Interrompida" mostra 1 linha. | Essencial |
| RF078 | Na versão completa, o card do nó que pode disparar o próprio fluxo deve mostrar "Pode disparar este fluxo de novo" no rodapé, ou "Protegido contra repetição" com a regra de RF044 ou RF046 ligada. | O card "Marcar para revisão" troca o rodapé ao ligar a regra e salvar. | Importante |
| RF079 | Os status Ignorada e Retida devem aparecer na aba Execuções da versão completa, com os filtros deles. | "Retida 2" e "Ignorada 3" aparecem entre os filtros. | Importante |
| RF080 | Com o filtro Retida ativo, a tabela deve permitir selecionar execuções e mostrar "Liberar" e "Descartar" com a explicação das retidas. | Selecionar 2 muda os botões para "Liberar 2 selecionadas" e "Descartar 2 selecionadas". | Importante |
| RF081 | Quando um membro com permissão (RN008) libera execuções retidas, o sistema deve pô-las na fila. | Liberar 2 mostra "2 execuções liberadas. Elas entraram na fila." | Importante |
| RF082 | Quando um membro com permissão descarta execuções retidas, o sistema deve registrá-las como Ignorada. | Descartar 1 mostra "1 execução descartada." | Importante |
| RF083 | O menu da linha de uma execução retida deve ter "Liberar" e "Descartar", além de "Ver Detalhes" e "Abrir Execução". | O menu da linha retida tem 4 itens. | Importante |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI001 | `Workflow.settings` (hoje objeto livre no schema) | Deve guardar as proteções em `settings.protections`, no formato <a definir>; o protótipo usa o modelo de `protecoes.ts`. |
| RI002 | `WorkflowExecution.status` | Deve aceitar os 4 status novos (Na fila, Ignorada, Retida, Interrompida), com nomes na API <a definir>. |
| RI003 | `WorkflowExecution` | Deve devolver o motivo da proteção (RN007) num campo <a definir>. |
| RI004 | Liberar e descartar execução retida | <a definir>: rota, método e resposta. |
| RI005 | Retomar fluxo pausado | <a definir>: rota, método e resposta. |
| RI006 | Webhook do fluxo (`POST /ws/<slug>/<identificador>`) | Deve responder à chamada que fica na fila, é ignorada ou retida com o status HTTP <a definir> (ver P6). |
| RI007 | Notificação e e-mail ao dono | Deve usar o sino e o envio de e-mail do workspace; formato <a definir>. |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RS001 | A conferência das proteções no disparo deve usar o cache dos fluxos disponíveis, sem consultar o banco a cada disparo. Imposta por: líder dos devs, em 24/10/2026, como pré-requisito das proteções. | A entrega do cache vem antes de RF019, RF030, RF045 e RF048; nenhum disparo consulta o banco para ler o fluxo. | Essencial |
| RNF001 | A conferência das proteções deve acrescentar ao disparo no máximo <a definir> ms. | Medir o tempo do disparo com e sem as proteções ligadas (P1). | Essencial |
| RNF002 | Os status da execução devem atender à WCAG 2.2 AA, critério 1.4.1 (uso de cor). | Em tons de cinza, os 8 status se distinguem pelo ícone e pelo texto. | Essencial |
| RS002 | Cada texto da aba deve existir em português, inglês e espanhol. Imposta por: spec dos protótipos, regra 35. | Trocar o idioma troca todos os textos da aba. | Essencial |
| RT001 | Até a primeira gravação das proteções de um fluxo que já existia, o fluxo deve seguir a coluna "Fluxo que já existia" da RN006. Critério de fim: o fluxo é salvo com as proteções. | Fluxo antigo, sem salvar a aba, continua sem limite de execuções ao mesmo tempo. | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | Existe hoje algum limite de execuções da plataforma, por fluxo ou por workspace? E qual o tempo de disparo hoje, para fixar RNF001? | líder dos devs | Os valores recomendados da RN006 e o teto de cada faixa. |
| P2 | Quais as faixas de cada número (mínimo e máximo)? O protótipo usa: por período 1 a 10.000; por dia 1 a 1.000.000; ao mesmo tempo 1 a 500; cadeia 2 a 50; erros 1 a 100. | produto e líder dos devs | O texto de RF012 e a validação. |
| P3 | Os valores recomendados (60 por minuto, 10 ao mesmo tempo, 10 níveis, 3 erros, 50 en-credits) servem ao ENSPACE? | produto, com dados de uso | A coluna "Fluxo criado depois" da RN006. |
| P4 | O disparo Manual conta no limite por minuto e no limite de execuções ao mesmo tempo? | produto | RF019 e RF030 ganham exceção para o Manual. |
| P5 | O cartão Custo de IA aparece em fluxo sem nó de IA (RF067) ou some? | produto | RF067. |
| P6 | Qual o status HTTP que o webhook devolve quando a chamada vai para a fila, é ignorada ou é retida (202, 409, 429)? | líder dos devs | RI006 e a documentação do webhook. |
| P7 | O que acontece com as execuções Na fila e Retidas quando o fluxo é desativado ou excluído? | produto | Novo RF para o fluxo desativado. |
| P8 | A cadeia de RN004 atravessa workspaces (Requisição HTTP para o webhook de outro workspace)? | líder dos devs | O alcance de RF048. |
| P9 | Como o sistema sabe, antes do nó de IA, que a execução vai passar do teto (RF065)? Pelo gasto acumulado da execução ou por estimativa do nó? | líder dos devs | O momento em que a execução fica Retida. |
| P10 | Quanto tempo uma execução Retida espera por decisão antes de expirar? | produto | Novo RF de expiração das retidas. |
| P11 | A importação de planilha com "ignorar fluxos" passa a ignorar também os Spaceflows de Ações de Itens? | produto | Fora deste documento; reduz a rajada que RF019 segura. |
| P12 | Sair do editor com alteração não salva na aba Proteções mostra o mesmo aviso que o editor já mostra para o canvas? | produto | Novo RF de aviso ao sair da página. |
| S1 | As proteções são guardadas em `Workflow.settings`, que já existe como objeto livre no schema do SDK. | líder dos devs confirma o lugar | RI001. |
| S2 | A mudança das proteções é registrada nos Logs do workspace, como as outras mudanças de configuração. | líder dos devs confirma | Novo RF de auditoria. |
| S3 | "Mudanças feitas por fluxos" (RF045) e "E-mails enviados por fluxos" (RF084) dependem de a gravação e o envio saberem que vieram de um Spaceflow. A documentação mostra que a execução sabe quem disparou o fluxo, mas não mostra a origem da gravação nem a do e-mail. | líder dos devs confirma | RF045 e RF084 podem pedir trabalho no motor de gatilho, junto do cache de RS001. |

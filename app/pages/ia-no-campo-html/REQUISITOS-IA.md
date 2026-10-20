# Requisitos: IA no campo Editor de texto HTML (o BENI)

**Objetivo:** quem escreve no campo Editor de texto HTML pede ajuda ao BENI sem sair do campo (pelo botão IA, pela
seleção, pelo "/" ou pelo Ctrl J), vê a proposta dentro do texto e decide se aceita. A IA usa os modelos do ENSPACE em en-credits; a chave de uma conta própria
só muda quem paga.

**Onde vale:** o campo Editor de texto HTML do formulário do item (tela do item, folder Visão Geral) e o modal
"Chaves de IA do workspace", que abre a partir do campo.

**Depende de:** a demanda do editor (`REQUISITOS-EDITOR.md`, nesta pasta), que traz a barra fixa, a barra da
seleção, o menu "/" e a alça do bloco. Este documento ocupa os lugares que aquele reserva para a IA: a 1ª posição
das 2 barras, o topo do "/" e o item "Perguntar ao BENI" da alça.

**Referência visual:** protótipo navegável em https://pernalombr4.github.io/prototipos/ia-no-campo-html/, aprovado em
14/10/2026 e revisado até a rodada 12 (20/10/2026). Os estados se abrem pela barra inferior: `?ia=ligada` (sem
chave), `?ia=chave` (chave da OpenAI), `?ia=varias` (3 chaves), `?ia=semCreditos` e `?ia=erro`. Código, textos nos 3
idiomas, decisões e prints em https://github.com/pernalombr4/prototipos/tree/main/app/pages/ia-no-campo-html. A barra
inferior do protótipo (estado, tema, idioma) é ferramenta de revisão e não entra no produto.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
Os exemplos usam o item de demonstração do protótipo (contrato da Tecnoverde, campo "Parecer do jurídico").

**Fora do escopo:** a casca da tela do item (menu lateral, barra do topo, painel do item, barra de folders), os
outros tipos de campo, o cadastro de agentes (Configurações › Agentes de IA), a regra de cobrança e recarga de
en-credits e a formatação do campo (`REQUISITOS-EDITOR.md`).

## Resumo

| Grupo | O que muda em relação ao develop de 14/10/2026 | Requisitos |
|---|---|---|
| Entradas da IA | Hoje o botão de IA só aparece com a integração OpenAI instalada. Passa a existir em 5 entradas, para quem escreve no campo | RF001 a RF007 |
| Caixa do BENI | Pedido livre, ações por contexto, pedidos salvos, agentes, o que a IA lê e anexo, numa caixa colada no texto | RF008 a RF020 |
| Ações sem seleção | As ações de edição passam a valer para o campo inteiro | RF021 a RF023 |
| Proposta no texto | O texto que sai fica riscado e o novo aparece realçado; nada grava antes do Aceitar | RF024 a RF036 |
| Agente e modelo | 2 seletores na caixa; modelos agrupados por empresa, com a conta que paga | RF037 a RF046, RF065 |
| Chaves de IA do workspace | Hoje: 1 cartão OpenAI e um modal com "Api Key". Passa a 1 cartão por empresa, com o passo da chave no mesmo modal | RF047 a RF057, RF066 |
| Sem en-credits | Aviso na caixa com a chave própria; o pedido espera e roda ao conectar | RF058 a RF064 |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| BENI | O assistente de IA do ENSPACE, no masculino ("o BENI") | "BENI" |
| Caixa do BENI | A caixa que abre colada ao trecho ou à linha do cursor, com o pedido livre e as ações | sem rótulo; leitor de tela: "Caixa do BENI" |
| Proposta | O texto que o BENI gera, mostrado dentro do campo antes de gravar | "Aceitar", "Descartar" |
| en-credits | Os créditos do workspace com que o ENSPACE cobra o uso da IA | "en-credits" |
| Chave de conta própria | A chave de API de uma conta de IA do workspace (OpenAI, Anthropic, Google) | "Chave de API" |
| Auto | A opção do seletor de modelo em que o ENSPACE escolhe o modelo pelo pedido | "Auto" |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN001 | Cada modelo de IA que o ENSPACE disponibiliza pode ser usado no campo sem chave de conta própria, com o consumo cobrado em en-credits. | Workspace sem chave nenhuma usa o Claude Opus 4.6 e o consumo sai dos en-credits. |
| RN002 | O consumo de um modelo é cobrado na conta da empresa dona do modelo quando o workspace tem a chave dessa conta conectada. | Com a chave da Anthropic conectada, um pedido no Claude Sonnet 4.6 é cobrado na conta Anthropic, e um no GPT-5.4 continua em en-credits. |
| RN003 | Uma chave de conta própria conectada vale para o workspace inteiro. | A chave conectada por quem administra vale para cada membro e para cada campo. |
| RN004 | O conteúdo do campo só muda quando a pessoa aceita a proposta. | Descartar, fechar a caixa ou recarregar a tela deixam o campo como estava. |
| RN005 | Com um agente escolhido, o modelo do perfil do agente vem marcado; a troca de modelo vale só para o pedido e não altera o perfil do agente. | O Assistente Jurídico usa Claude Opus 4.6; trocar para GPT-5.4 na caixa não muda o cadastro do agente. |
| RN006 | Só os agentes ativos que a pessoa tem permissão de usar podem aparecer no seletor de agente. | Um agente inativo e um agente restrito à diretoria não aparecem para um membro comum. |
| RN007 | A tabela a seguir define se o pedido responde, conforme os en-credits e a chave. Política: Única. | Linha 3: sem en-credits, modelo GPT-5.4 e chave da OpenAI conectada: responde, cobrado na conta OpenAI. |
| RN008 | O Auto escolhe o modelo pelo tipo de pedido; sem en-credits, escolhe só entre os modelos de contas com chave conectada. | Sem en-credits e com a chave da Anthropic, o Auto responde com um modelo Claude. |

Tabela da RN007:

| Linha | en-credits | Modelo escolhido | Chave da conta do modelo | Resultado |
|---|---|---|---|---|
| 1 | com saldo | qualquer modelo ou Auto | conectada | responde, cobrado na conta da empresa |
| 2 | com saldo | qualquer modelo ou Auto | não conectada | responde, cobrado em en-credits |
| 3 | sem saldo | modelo de uma empresa | conectada | responde, cobrado na conta da empresa |
| 4 | sem saldo | modelo de uma empresa | não conectada | não responde; mostra o aviso de en-credits (RF058) |
| 5 | sem saldo | Auto | ao menos 1 conta conectada | responde com modelo de conta conectada (RN008) |
| 6 | sem saldo | Auto | nenhuma conta conectada | não responde; mostra o aviso de en-credits (RF058) |

## Entradas da IA (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF001 | A barra fixa do campo deve ter o botão "IA" na 1ª posição, com a dica "Escrever com o BENI" e o atalho Ctrl J. | O botão aparece antes de desfazer, em cada campo Editor de texto HTML da tela. | Essencial |
| RF002 | Quando a pessoa clica em "IA" na barra fixa, o sistema deve abrir a caixa do BENI logo abaixo do trecho selecionado ou da linha do cursor. | Exemplo: cursor no fim do 1º parágrafo do "Parecer do jurídico"; a caixa abre logo abaixo dele. | Essencial |
| RF003 | Quando o foco está no campo e a pessoa tecla Ctrl J, o sistema deve abrir a caixa do BENI no lugar do cursor. | Ctrl J no campo abre a caixa; o navegador não abre Downloads. | Importante |
| RF004 | Quando a pessoa seleciona texto no campo, o sistema deve mostrar a barra da seleção com o botão "IA" na 1ª posição. | Selecionar 1 frase mostra a barra flutuante com "IA" à esquerda. | Essencial |
| RF005 | O menu "/" deve ter o grupo "BENI (IA)" no topo, com "Perguntar ao BENI", os pedidos salvos e as ações sem seleção (RF021). | Digitar "/" numa linha mostra o grupo antes de "Blocos básicos"; "/ia", "/ai" e "/beni" filtram o grupo. | Essencial |
| RF006 | O menu da alça do bloco (⠿) deve ter "Perguntar ao BENI", que abre a caixa com o bloco inteiro selecionado. | Clicar em ⠿ › "Perguntar ao BENI" no 2º parágrafo seleciona o parágrafo e abre a caixa. | Importante |
| RF007 | O placeholder do campo vazio deve ser "Escreva, digite "/" para comandos ou Ctrl J para o BENI...". | O campo "Observações internas" vazio mostra o texto. | Importante |

## Caixa do BENI (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF008 | A caixa deve abrir com o foco no campo de pedido livre, com o placeholder "Peça ao BENI ou escolha uma ação..." (sem seleção) ou "Peça ao BENI o que fazer com o trecho..." (com seleção). | Abrir a caixa e digitar escreve direto no campo de pedido. | Essencial |
| RF009 | Quando a pessoa digita no campo de pedido, a caixa deve mostrar o texto digitado como 1º item, com o rótulo "Seu pedido", e filtrar as ações pelo texto. | Exemplo: "resum" mostra "Seu pedido" e as ações de resumir; Enter envia o pedido livre. | Essencial |
| RF010 | A caixa deve mostrar o grupo "Seus pedidos salvos" antes das ações quando a pessoa tem pedidos salvos. | Exemplo: "Parecer no padrão do jurídico" aparece no topo da lista. | Importante |
| RF011 | Com texto selecionado, a caixa deve mostrar o grupo "Editar o trecho", nesta ordem: "Revisar ortografia e gramática", "Melhorar a escrita", "Encurtar", "Expandir", "Simplificar", "Explicar", "Transformar em lista", "Mudar o tom ›", "Traduzir ›" e "Resumir". | Selecionar 1 frase e abrir a caixa mostra as 10 ações na ordem. | Essencial |
| RF012 | Os submenus "Mudar o tom" (8 tons) e "Traduzir" (6 idiomas) devem abrir dentro da própria caixa, com o botão de voltar. | Tons: Formal, Profissional, Amigável, Direto, Confiante, Empático, Didático, Persuasivo. Idiomas: Português, Inglês, Espanhol, Francês, Alemão, Italiano. | Importante |
| RF013 | Sem texto selecionado, a caixa deve mostrar os grupos "Editar o campo" e "Escrever", conforme RF021. | Abrir a caixa com o cursor no campo, sem seleção, mostra os 2 grupos. | Essencial |
| RF014 | A caixa deve mostrar o grupo "Pedir a um agente" com até 5 agentes (RN006) e o item "Ver todos os agentes (N)" quando houver mais de 5. | Com 6 agentes disponíveis, aparecem 5 e "Ver todos os agentes (6)". | Importante |
| RF015 | Cada agente da lista deve mostrar o avatar do BENI com as cores e o acessório do cadastro do agente, o nome e o tipo ("Chat e texto" ou "Revisor"). | O Assistente Jurídico aparece com o avatar azul de capacete e "Chat e texto". | Desejável |
| RF016 | O rodapé da caixa deve mostrar o que a IA lê: "Trecho selecionado" ou "Este campo", mais "+N campos do item". | Exemplo: sem seleção, "Este campo +5 campos do item". | Importante |
| RF017 | Quando a pessoa clica no indicador do que a IA lê, o sistema deve listar o campo e os campos do item lidos, com a chave "Usar os campos do item". | Desligar a chave risca os 5 campos na lista e o rodapé deixa de mostrar "+5 campos do item". | Importante |
| RF018 | O rodapé da caixa deve ter o botão "Anexar arquivo", com a dica "PDF, Word, Excel, CSV ou TXT como contexto"; o arquivo anexado aparece como selo com o nome e o botão de remover. | Anexar `aditivo.pdf` mostra o selo "aditivo.pdf" no lugar do botão. | Importante |
| RF019 | O rodapé da caixa deve ter o aviso "O BENI pode errar. Confira antes de aceitar." na dica do ícone de informação, e "Esc fecha". | Passar o mouse no ícone mostra o aviso. | Desejável |
| RF020 | Quando a pessoa tecla Esc ou clica fora da caixa, o sistema deve fechar a caixa e devolver o foco ao trecho de onde a caixa abriu. | Esc fecha a caixa, e a seleção anterior continua no campo. | Essencial |

## Ações sem seleção (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF021 | Sem texto selecionado, a caixa deve mostrar "Editar o campo" ("Revisar ortografia e gramática", "Melhorar a escrita", "Mudar o tom ›", "Traduzir ›", "Encurtar") e "Escrever" ("Continuar escrevendo", "Resumir o campo", "Rascunhar com os dados do item"), nesta ordem. | A caixa sem seleção mostra as 8 ações nos 2 grupos. | Essencial |
| RF022 | Quando a pessoa escolhe uma ação de "Editar o campo" sem seleção, o sistema deve aplicar a ação ao campo inteiro e mostrar a proposta riscando o campo todo. | Exemplo: "Revisar ortografia e gramática" no "Parecer do jurídico" risca os 2 parágrafos e mostra os 2 revisados; Aceitar deixa o campo só com o texto revisado. | Essencial |
| RF023 | Com o campo vazio, as ações que precisam de texto ("Editar o campo", "Continuar escrevendo", "Resumir o campo") devem aparecer desativadas. | No campo "Observações internas" vazio, só "Rascunhar com os dados do item" e o pedido livre ficam ativos. | Importante |

## Proposta no texto (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF024 | Enquanto o BENI gera a resposta, o sistema deve escrever a proposta no campo palavra por palavra, com o botão "Parar". | O texto aparece aos poucos; "Parar" interrompe e mostra "Resposta interrompida.". | Importante |
| RF025 | Numa ação que substitui o trecho, o sistema deve mostrar o trecho original riscado e o texto novo realçado no lugar, sem gravar no campo (RN004). | Exemplo: "Encurtar" na 1ª frase mostra a frase riscada e a curta realçada logo depois. | Essencial |
| RF026 | Numa ação que acrescenta texto ("Explicar", "Resumir", "Continuar escrevendo", "Rascunhar com os dados do item"), o sistema deve mostrar o texto novo realçado abaixo do trecho, sem riscar o original. | "Resumir o campo" mostra a lista realçada abaixo do 2º parágrafo. | Essencial |
| RF027 | Enquanto a proposta está aberta, o campo deve ficar só leitura. | Digitar no campo com a proposta aberta não muda o texto. | Essencial |
| RF028 | A barra da proposta deve ter "Aceitar" (Enter), "Descartar" (Esc), "Tentar de novo", "Inserir abaixo" (nas ações que substituem), 👍, 👎 e o campo "Peça um ajuste: mais curto, em lista...". | Cada botão aparece na barra embaixo da proposta. | Essencial |
| RF029 | Quando a pessoa aceita, o sistema deve gravar a proposta no campo e realçar o texto que entrou por 1,4 s. | Aceitar troca o trecho e o texto novo pisca realçado. | Essencial |
| RF030 | Quando a pessoa descarta, o sistema deve tirar a proposta e devolver o campo como estava. | Descartar deixa o campo idêntico ao de antes do pedido. | Essencial |
| RF031 | Quando a pessoa escreve um ajuste e envia, o sistema deve gerar uma proposta nova a partir da anterior. | Exemplo: "em lista" transforma o rascunho em tópicos. | Importante |
| RF032 | Depois de aceitar, o Ctrl Z do editor deve desfazer a proposta aceita. | Aceitar e teclar Ctrl Z devolve o texto original. | Essencial |
| RF033 | Numa proposta de pedido livre, a barra deve ter "Salvar pedido", que guarda o pedido em "Seus pedidos salvos". | Salvar "resuma para a diretoria" faz o pedido aparecer na caixa e no "/". | Desejável |
| RF034 | A barra da proposta deve mostrar quem respondeu e o modelo: "BENI · Auto: Claude Sonnet 4.6" com Auto, e o nome do modelo escolhido nos outros casos. | Pedido com Auto mostra o modelo que o Auto escolheu. | Importante |
| RF035 | Quando o consumo é cobrado numa conta própria (RN002), a barra da proposta deve acrescentar a conta ao modelo: "Auto: Claude Sonnet 4.6 (conta Anthropic)". | Com a chave da Anthropic, o resumo mostra "(conta Anthropic)"; sem chave, só o modelo. | Importante |
| RF036 | Se o BENI não responde, o sistema deve mostrar "Sem resposta." e "Nada mudou no campo. Tente de novo em instantes.", com "Tentar de novo" e "Descartar". | No estado `?ia=erro`, o pedido mostra a mensagem, e o campo não muda. | Essencial |

## Agente e modelo (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF037 | O rodapé da caixa deve ter o seletor de agente, com o BENI como padrão e os agentes da RN006. | O seletor abre com "BENI" marcado. | Importante |
| RF038 | Quando a pessoa escolhe um agente, o sistema deve trocar o placeholder para "Escreva o pedido para <agente>..." e marcar no seletor de modelo o modelo do perfil do agente (RN005). | Escolher o Assistente Jurídico mostra "Claude Opus 4.6" no seletor de modelo, com o selo "do agente". | Importante |
| RF039 | Quando a pessoa troca o modelo de um agente, o seletor deve mostrar "Só neste pedido. O perfil do agente continua com <modelo>." | Trocar para GPT-5.4 mostra o aviso com "Claude Opus 4.6". | Importante |
| RF040 | Com um agente do tipo Revisor, a barra da proposta deve listar o que o Revisor mudou. | O Revisor de Contratos mostra a lista das correções feitas. | Desejável |
| RF041 | O seletor de modelo deve mostrar "Auto" no topo e os modelos agrupados por empresa, com o logo e o nome da empresa no título de cada grupo. | Grupos: ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), DeepSeek. | Importante |
| RF042 | Cada modelo do seletor deve mostrar o perfil, a velocidade e a inteligência de 1 a 5 e o consumo de en-credits (baixo, médio ou alto). | O GPT-5-mini mostra velocidade 5 e consumo baixo. | Importante |
| RF043 | Cada modelo deve poder ser escolhido sem chave de conta própria (RN001). | Sem chave nenhuma, escolher Claude Opus 4.6 e pedir algo gera a proposta. | Essencial |
| RF044 | Quando o workspace tem a chave de uma conta conectada, o grupo daquela empresa deve mostrar o selo "Sua conta" com ícone de chave. | Com a chave da OpenAI, o grupo ChatGPT tem "Sua conta". | Importante |
| RF065 | Quando o workspace tem a chave de uma conta conectada, cada modelo daquela empresa deve mostrar "Cobrado na conta <empresa>" no lugar do consumo de en-credits. | Com a chave da OpenAI, o GPT-5.4 mostra "Cobrado na conta OpenAI". | Importante |
| RF045 | O rodapé do seletor de modelo deve ter o botão "Usar a chave de uma conta própria" (ou "Ver as chaves conectadas" quando cada conta disponível já tem chave), que abre o modal "Chaves de IA do workspace". | Clicar abre o modal na lista de contas. | Importante |
| RF046 | A escolha de agente e de modelo deve continuar valendo nos pedidos seguintes da sessão, nos 2 campos da tela. | Escolher GPT-5.4 no 1º campo e abrir a caixa no 2º mostra GPT-5.4. | Desejável |

## Chaves de IA do workspace (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF047 | O modal "Chaves de IA do workspace" deve abrir sobre a tela do item, com a descrição "Opcional. Conecte a chave de uma conta do workspace para o consumo dos modelos daquela empresa ser cobrado nela." e a trilha "Configurações › Integrações › Inteligência Artificial". | O modal abre sem sair do item; o campo continua visível atrás. | Essencial |
| RF048 | O modal deve mostrar no topo o aviso "Todos os modelos já funcionam sem chave, com os en-credits do ENSPACE. A chave só muda quem paga." | O aviso aparece acima dos cartões. | Importante |
| RF049 | O modal deve mostrar 1 cartão por conta de IA, com o logo, o nome do produto, a empresa e 1 frase. | Cartões: ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), Kimi (Moonshot AI), DeepSeek. | Essencial |
| RF050 | O cartão de uma conta sem chave deve ter o botão "Conectar chave". | Sem chave da Anthropic, o cartão Claude mostra "Conectar chave". | Essencial |
| RF066 | O cartão de uma conta com chave deve ter o selo "Chave conectada" e a linha "N modelos cobrados na conta <empresa>", sem o botão "Conectar chave". | Com a chave da OpenAI, o cartão ChatGPT mostra "Chave conectada" e "3 modelos cobrados na conta OpenAI". | Essencial |
| RF051 | O cartão de uma conta que ainda não aceita chave própria deve ter o selo "Em breve" e "Ainda não aceita chave própria.", sem botão. | Kimi e DeepSeek aparecem com "Em breve". | Importante |
| RF052 | Quando a pessoa clica em "Conectar chave", o modal deve mostrar o passo da chave da conta, com o foco no campo "Chave de API". | Clicar em "Conectar chave" no Claude mostra "Conectar a chave da conta Anthropic" e o cursor já no campo. | Essencial |
| RF053 | O passo da chave deve ter o link "Onde pego a chave?" para a página de chaves da empresa, o botão de mostrar e esconder a chave e a ajuda "O consumo é cobrado na conta <empresa>, que precisa ter créditos." | O link do Claude abre a página de chaves da Anthropic numa aba nova. | Importante |
| RF054 | Se a pessoa envia o campo "Chave de API" vazio, o sistema deve mostrar no próprio campo "Cole a chave para conectar.". | Enviar vazio mostra o erro, e nada é conectado. | Essencial |
| RF055 | Quando a chave é aceita, o modal deve mostrar "Chave da conta <empresa> conectada", os modelos cobrados nessa conta, "Conectar outra chave" e "Voltar ao campo", com o foco em "Voltar ao campo". | Conectar a da Anthropic lista Claude Sonnet 4.6 e Claude Opus 4.6; Enter volta ao campo. | Essencial |
| RF056 | Quando o modal fecha, o sistema deve devolver a pessoa ao campo como estava, com a caixa do BENI aberta se a caixa estava aberta. | Abrir o modal pelo seletor de modelo e fechar mantém a caixa aberta. | Importante |
| RF057 | O rodapé do modal deve ter "A IA só lê o que você selecionar ou enviar.". | O texto aparece no rodapé do modal. | Desejável |

## Sem en-credits (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF058 | Enquanto o workspace está sem en-credits e o modelo escolhido não pode responder (RN007, linhas 4 e 6), a caixa do BENI deve mostrar no topo o aviso "Os en-credits do workspace acabaram". | No estado `?ia=semCreditos`, abrir a caixa mostra o aviso acima do campo de pedido. | Essencial |
| RF059 | Com "Auto", o aviso deve dizer "Para seguir usando a IA, conecte a chave de uma conta própria. O consumo passa a ser cobrado nessa conta." e ter o botão "Usar a chave de uma conta própria", que abre o modal na lista de contas. | Clicar no botão abre o modal com os cartões. | Essencial |
| RF060 | Com um modelo de uma empresa (escolhido ou do agente), o aviso deve dizer "O <modelo> usa en-credits. Para seguir com ele, conecte a chave da conta <empresa>." e ter o botão "Conectar a chave da conta <empresa>", que abre o modal no passo da chave dessa conta. | Com o Revisor de Contratos (GPT-5.4), o botão abre direto o passo da chave da OpenAI. | Essencial |
| RF061 | Quando outra conta já tem chave, o aviso de um modelo sem chave deve acrescentar "Ou escolha em Modelo um modelo de uma conta com chave: <contas>.". | Com a chave da Anthropic e o modelo GPT-5.4, o aviso cita "Claude". | Importante |
| RF062 | Quando a pessoa pede uma ação sem poder responder (RN007), o sistema deve guardar a ação, mostrar no aviso "Ao conectar, o BENI faz o que você pediu: <ação>." e deixar o campo como está. | Pedir "Resumir o campo" sem en-credits mostra a linha no aviso, e nenhuma proposta aparece. | Essencial |
| RF063 | Quando a pessoa conecta a chave que permite responder e volta ao campo, o sistema deve executar a ação guardada. | Conectar a chave da Anthropic e voltar gera o resumo com "Auto: Claude Sonnet 4.6 (conta Anthropic)". | Essencial |
| RF064 | Enquanto o workspace está sem en-credits, cada modelo sem chave deve mostrar "Sem en-credits" no seletor de modelo, no lugar do consumo. | No estado `?ia=semCreditos`, o GPT-5.4 mostra "Sem en-credits". | Importante |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI001 | Geração da resposta do BENI: rota <a definir> | Deve receber a ação (ou o pedido livre), o parâmetro (tom ou idioma), o texto do trecho ou do campo, os campos do item quando "Usar os campos do item" está ligado, o anexo, o agente e o modelo. |
| RI006 | Resposta da geração (RI001) | Deve devolver o texto em HTML em partes, à medida que o modelo gera, mais o modelo usado e a conta cobrada (en-credits ou a empresa). |
| RI002 | Lista de agentes do workspace (cadastro de Configurações › Agentes de IA): rota <a definir> | Deve devolver só os agentes da RN006, com nome, tipo, descrição, modelo do perfil e aparência do BENI (`beniTheme`). |
| RI003 | Lista de modelos: rota <a definir> | Deve devolver cada modelo com a empresa, o perfil e o consumo de en-credits. |
| RI004 | Chaves de conta própria do workspace: rota <a definir> | Deve devolver as contas com chave conectada e receber a chave nova de uma conta. Hoje a integração OpenAI grava a chave pelo modal "Api Key" de Configurações › Integrações. |
| RI005 | Saldo de en-credits do workspace: rota <a definir> | Deve informar se o workspace está sem en-credits, para a RN007. |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF001 | Cada texto da caixa do BENI, da proposta, do aviso de en-credits e do modal das chaves deve ter contraste de 4,5:1 ou mais com o fundo, nos temas claro e escuro (WCAG 2.2 AA, critério 1.4.3). | Medir os textos e os botões dos avisos nos 2 temas. | Essencial |
| RNF002 | A proposta pronta deve ser anunciada ao leitor de tela com "Proposta pronta. Enter aceita, Esc descarta." numa região `aria-live`. | Com o leitor de tela, gerar uma proposta lê a frase. | Importante |
| RNF003 | A caixa do BENI deve ter `role="dialog"` com o nome "Caixa do BENI". | Inspecionar a caixa mostra o papel e o nome. | Importante |
| RNF004 | O aviso de en-credits deve ter `role="alert"`. | O leitor de tela lê o aviso ao abrir a caixa sem en-credits. | Importante |
| RS001 | Cada texto do campo, da caixa e do modal deve existir em português, inglês e espanhol. Imposta por: spec dos protótipos, regra 35. | Trocar o idioma troca cada texto; o conteúdo gerado continua no idioma do workspace. | Essencial |
| RS002 | A proposta dentro do texto deve ser feita no TipTap do campo, sem gravar no documento até o Aceitar. Imposta por: a redatora, em 09/10/2026 ("no campo html nós usamos o tiptap"). | No protótipo, `proposta.ts` mostra a proposta por decorações do ProseMirror. | Essencial |
| RS003 | O BENI deve ser tratado no masculino em cada texto ("o BENI"). Imposta por: a redatora, em 09/10/2026. | Nenhum texto diz "a BENI". | Importante |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | O que acontece antes de os en-credits acabarem (aviso de saldo baixo) e como o workspace recarrega? | produto | RF058 ganha o aviso prévio e o caminho de recarga |
| P2 | Quem não administra o workspace vê "Usar a chave de uma conta própria" e o aviso com o botão de conectar? | produto | RF045, RF059 e RF060 mudam para quem é membro: o botão vira um pedido a quem administra |
| P3 | Qual é a regra do Auto (que modelo para que pedido) e se ele deve preferir os modelos com chave própria quando há saldo de en-credits. | produto e time de IA | RN008 e RF034 |
| P4 | Quando Kimi e DeepSeek passam a aceitar chave própria? | produto | RF051 |
| P5 | Como se troca e se remove uma chave já conectada? | produto | Novo grupo no modal; hoje o texto diz "Você troca ou remove a chave em Configurações › Integrações." |
| P6 | Como o sistema confere se a chave é válida antes de aceitar? | time de IA | RF054 ganha o erro de chave recusada pela empresa |
| P7 | A página da integração OpenAI no en-docs diz que o botão de IA do editor só aparece com a integração instalada; com a RN001, a página fica desatualizada? | time de documentação | Revisar a página do en-docs |
| P8 | Qual o tamanho máximo do texto e do anexo enviados ao BENI, e o que a tela mostra quando passa? | time de IA | Novo erro na caixa |
| P9 | Os pedidos salvos ficam por pessoa ou por workspace, e quantos cabem? | produto | RF010 e RF033 |
| S1 | As notas de velocidade e inteligência e o consumo de cada modelo são do protótipo, sem medição. | time de IA | RF042 |
| S2 | O protótipo aceita qualquer chave preenchida e não grava nada; a conferência da chave é do produto (P6). | time de IA | RF054 |

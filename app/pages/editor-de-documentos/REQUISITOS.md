# Requisitos: campo Editor de Documentos, com ONLYOFFICE e Word

**Objetivo:** quem trabalha no item abre o documento no editor que prefere (ONLYOFFICE ou Microsoft Word), edita sem perder nada e sempre sabe qual é a versão atual, quem mexeu por último e quem está com o documento agora.

**Onde vale:** no campo do tipo **Editor de Documentos**, em todo lugar onde ele aparece no item (visão rápida aberta pela lista e tela do item), na coluna desse campo na lista de itens, na configuração do campo (Configurações › Categorias › Campos) e no plugin do ENSPACE para o Word.

**Referência visual:** protótipo `editor-de-documentos`, rodadas 1 a 5, de 08/10/2026. Prints do produto de hoje em `evidencias/develop-*.jpg`; prints da proposta em `evidencias/proto-*.jpg`. Os cenários do protótipo estão na barra de baixo, em "Cenário".

**Convenção:**
- "deve" é obrigatório; cada requisito tem um critério de aceite que se confere na tela.
- **Melhoria** é o que já existe no campo e muda. **Criação** é o que o campo não tem hoje.
- Todo texto de tela existe em português, inglês e espanhol, e nenhum leva travessão.

## Resumo: antes e depois

| Grupo | Tipo | Antes (develop, 08/10/2026) | Depois (protótipo) |
|---|---|---|---|
| Campo vazio (RV) | Melhoria | Botão azul "Subir documento" → gaveta "Selecione a forma de upload" → área de upload → botão "Usar modelo" → confirmação "Tem certeza que deseja gerar o documento a partir do modelo?". 4 cliques e 1 confirmação. Não existe documento em branco | O campo é a área de começar: Usar modelo (com prévia preenchida com os dados do item), Em branco e Enviar arquivo, ou arrastar o arquivo para o campo. 1 clique em cada |
| Campo preenchido (RP) | Melhoria | Botão sem contorno "Abrir Documento" e um chip genérico com olho, baixar e um X vermelho que apaga. Não diz quem editou, quando, qual versão. Depois de editar, o tamanho vira "-" | Cartão com miniatura, nome, versão, quem editou por último e quando, tamanho e tipo; botão Abrir de verdade, com seta para escolher o editor; Versões com contador; remover só pelo menu, com confirmação |
| Quem está com o documento (RQ) | Criação | Nada indica se alguém está editando | O cartão e a lista dizem quem está com o documento, onde (ENSPACE ou Word) e desde quando |
| Escolha do editor (RE) | Criação | Só ONLYOFFICE | Pergunta "Onde você quer abrir?" na primeira vez, com "Lembrar minha escolha"; a seta ao lado do botão troca a qualquer momento |
| Editor no ENSPACE (RO) | Melhoria | ONLYOFFICE numa gaveta sobre a gaveta do item, com cerca de 57% da largura; o cabeçalho rola para fora junto com o X; "Tela Cheia" vira tela cheia do navegador, sem contexto; Esc fecha tudo; **a edição se perde ao fechar, só grava com Ctrl+S, e nada avisa** | ONLYOFFICE em tela inteira, com cabeçalho fixo do ENSPACE (item, campo, salvamento sempre visível, quem está editando, Versões, Baixar, Abrir no Word, Concluir); Esc fecha só o que está por cima; salva sozinho |
| Versões (RH) | Melhoria | Select "Versão 1, Versão 2" em cima da barra do ONLYOFFICE, sem data, autor ou ação | Lista com autor, data, origem (modelo, em branco, arquivo enviado, editada no ENSPACE, editada no Word, restaurada), Ver, Baixar e Restaurar |
| Word instalado (RW) | Criação | Não existe | "Abrir no Word" abre o Word do computador com o arquivo do item, sem baixar; o documento fica reservado para quem abriu; cada Salvar do Word vira versão; fechar libera |
| Word não abriu (RF) | Criação | Não existe | Baixar e Enviar nova versão lado a lado: edita no Word ou onde quiser e envia de volta como versão nova |
| Plugin do Word (RG) | Criação | O plugin não abre nem devolve o documento de um campo | Aba "Documento" no painel do plugin: a qual item e campo o arquivo pertence, versão aberta, se há mudança não salva, Salvar no ENSPACE, Concluir e liberar |
| Word para a web (RW-W) | Criação, fase 2 | Não existe | Opção "Abrir no Word para a web", ligada na configuração; cópia temporária no OneDrive de quem edita, que volta ao concluir |
| Configuração do campo (RC) | Melhoria | 7 chaves soltas, todas desligadas, inclusive Editar; mistura como criar com o que se faz no editor | 3 grupos: onde o documento abre, como ele nasce, o que se faz no editor; Editar ligado por padrão; pré-visualização viva |
| Lista de itens (RL) | Melhoria | A coluna do campo mostra o arquivo | A célula mostra tipo, nome, versão e quem está com o documento |
| Visão rápida (RR) | Melhoria | "Alterações não salvas" aparece desde a abertura, sem nada alterado; não fica claro qual botão guarda o documento | O aviso só aparece quando um campo do formulário muda; o documento salva no editor, fora do Salvar do item |
| Estados (RS) | Melhoria | Sem estados definidos | Carregando, erro com Tentar de novo, só leitura |

---

## Campo vazio (RV) · Melhoria

| ID | Requisito | Critério de aceite |
|---|---|---|
| RV-01 | O campo vazio deve mostrar, dentro da própria área do campo, o título "Nenhum documento ainda", a frase "Comece por um modelo da categoria, por um documento em branco ou envie o seu." e os botões **Usar modelo**, **Em branco** e **Enviar arquivo**. | Não existe botão "Subir documento" nem gaveta intermediária. |
| RV-02 | A área inteira do campo vazio deve aceitar arrastar e soltar um arquivo, e mudar de aparência enquanto a pessoa arrasta o arquivo por cima. | Soltar um .docx no campo cria o documento. |
| RV-03 | Abaixo dos botões, o campo deve dizer os formatos aceitos e o tamanho máximo: ".docx ou .pdf, até 50 MB. Você também pode arrastar o arquivo para cá." | O texto muda conforme os formatos ligados na configuração (RC-05). |
| RV-04 | **Usar modelo** deve abrir a lista dos modelos da categoria (Templates de Documento), com o nome de cada um e quais campos do item ele preenche (exemplo: "Preenche Contratante, Objeto, Valor e Vigência"). | Sem modelo na categoria, a lista diz "Esta categoria ainda não tem modelos." |
| RV-05 | Escolher um modelo deve mostrar a **prévia do documento já preenchido com os dados do item**, com os valores que vieram do item destacados, e o botão **Criar documento**. Voltar à lista deve ser possível. | A pergunta "Tem certeza que deseja gerar o documento a partir do modelo?" não existe mais. |
| RV-06 | **Em branco** deve criar um documento vazio, com o nome do campo e a referência do item (exemplo: "Minuta do contrato CTR-0141.docx"), e em seguida abrir o editor (RE-01). | O documento nasce como versão 1, origem "Criada em branco". |
| RV-07 | **Enviar arquivo** deve abrir o seletor de arquivos do computador; o arquivo escolhido vira o documento do campo, sem passo de confirmação. | O botão "Usar modelo" depois do envio, que existe hoje, não existe mais. |
| RV-08 | Arquivo de formato não aceito deve ser recusado com o aviso "Este arquivo não pode ser usado. Envie um arquivo .docx ou .pdf." | Nenhum documento é criado. |
| RV-09 | Enquanto o documento é gerado ou enviado, o campo deve mostrar o que está acontecendo ("Gerando o documento. Preenchendo o modelo com os dados deste item.", "Criando o documento em branco", "Enviando <nome>") com uma barra de progresso. | O campo não fica parado nem em branco durante a criação. |
| RV-10 | Ao terminar, um aviso deve confirmar a criação e a origem (exemplo: "Documento criado. Versão 1, gerada do modelo."). | O cartão do documento (RP) aparece no lugar da área vazia. |
| RV-11 | Quem só pode ler o item deve ver o campo vazio apenas com "Nenhum documento ainda", sem botões. | Nenhuma ação de criar aparece. |
| RV-12 | Só devem aparecer as formas de criar ligadas na configuração do campo (RC-05). | Desligar "Documento em branco" tira o botão Em branco. |

## Campo preenchido (RP) · Melhoria

| ID | Requisito | Critério de aceite |
|---|---|---|
| RP-01 | O documento deve aparecer como um cartão com: miniatura da primeira página com o tipo (DOCX ou PDF), nome do arquivo, número da versão atual, avatar e nome de quem editou por último, há quanto tempo, tamanho e tipo. | Exemplo: "Minuta Aurora Logística.docx · Versão 4 · Ana Souza, há 2 h · 47 KB · DOCX". |
| RP-02 | Nome longo deve quebrar em até 2 linhas e mostrar o nome inteiro ao parar o mouse. | O cartão não estoura a largura da visão rápida. |
| RP-03 | O botão principal do cartão deve ser um botão de verdade, com contorno e cor, e uma seta ao lado (RE-03). Sem escolha feita, ele diz **Abrir**; com escolha, diz o editor (**Abrir no ENSPACE**, **Abrir no Word**, **Abrir no Word para a web**). | O botão sem contorno "Abrir Documento" de hoje não existe mais. |
| RP-04 | Clicar na miniatura deve abrir o documento para leitura. | A leitura abre o editor em modo somente leitura (RO-08). |
| RP-05 | O cartão deve ter o botão **Versões** com o número de versões ao lado. | Abre o histórico (RH). |
| RP-06 | O menu **Mais ações** (⋯) deve ter: Baixar .docx, Baixar como PDF, Substituir por outro arquivo e Remover documento (em vermelho). | O X vermelho ao lado do baixar não existe mais. |
| RP-07 | Remover documento deve pedir confirmação dizendo o que se perde: "<nome> e as <N> versões saem deste item. O campo fica vazio." | Cancelar mantém o documento. |
| RP-08 | Substituir e Remover devem ficar desabilitados enquanto alguém está com o documento aberto (RQ). | Não dá para tirar o arquivo de quem está editando. |
| RP-09 | Documento PDF deve mostrar a faixa "PDF não se edita. Para mudar, substitua o arquivo." e o botão **Ler** no lugar de Abrir. | PDF não oferece ONLYOFFICE nem Word. |
| RP-10 | O tamanho do arquivo deve continuar correto depois de cada edição. | Hoje aparece "-"; não deve mais acontecer. |

## Quem está com o documento (RQ) · Criação

| ID | Requisito | Critério de aceite |
|---|---|---|
| RQ-01 | Quando **outra pessoa** estiver editando no **Word**, o cartão deve mostrar a faixa "<Nome> está editando no Word desde <hora>. Você pode ler a versão atual. A edição volta quando o documento for liberado.", com os botões **Ler** e **Avisar quando liberar**. | Abrir para editar não aparece para os outros. |
| RQ-02 | **Avisar quando liberar** deve registrar o pedido e confirmar: "Você recebe um aviso quando <Nome> liberar o documento." Quando o documento for liberado, a pessoa recebe a notificação. | O botão fica marcado como pedido e desabilitado. |
| RQ-03 | Quando **outra pessoa** estiver editando no **ENSPACE**, o cartão deve mostrar o avatar dela com indicador verde e "<Nome> está editando agora", e o botão principal deve virar **Editar junto**, que abre o ONLYOFFICE. | As 2 pessoas editam o mesmo documento ao mesmo tempo no ENSPACE. |
| RQ-04 | Com alguém editando no ENSPACE, as opções do Word devem ficar desabilitadas na seta, e tentar abrir no Word deve explicar: "<Nome> está editando no ENSPACE agora. Para abrir no Word, o documento precisa estar livre. Edite junto no ENSPACE ou espere a pessoa concluir.", com **Editar junto**. | Ninguém abre no Word um documento que está sendo editado no ENSPACE. |
| RQ-05 | Quando **eu** estiver com o documento aberto no Word, o cartão deve ter borda na cor de destaque e a faixa "Você está com este documento aberto no Word desde <hora>. Cada Salvar do Word vira uma versão aqui. Feche o documento no Word para liberar. Enquanto isso, as outras pessoas só leem.", com **Voltar ao Word** e **Liberar sem salvar**. | Voltar ao Word abre o Word de novo com o mesmo arquivo. |
| RQ-06 | **Liberar sem salvar** deve tirar a reserva e avisar: "Documento liberado. As mudanças feitas no Word não foram trazidas." | As outras pessoas voltam a poder editar. |
| RQ-07 | Na lista de itens, a célula do campo deve mostrar um cadeado (Word) ou um ícone de pessoas (editando no ENSPACE), com o nome no tooltip. A minha reserva tem cor diferente da reserva de outra pessoa. | Dá para ver na lista, sem abrir o item, quem está com cada documento. |
| RQ-08 | A reserva deve expirar sozinha depois de um tempo sem atividade do Word e ser renovada enquanto o Word estiver com o arquivo aberto. | Um Word fechado sem aviso não prende o documento para sempre. (Prazo a definir, ver "Fora destes requisitos".) |

## Escolha do editor (RE) · Criação

| ID | Requisito | Critério de aceite |
|---|---|---|
| RE-01 | No primeiro Abrir de quem ainda não escolheu, deve aparecer a pergunta **"Onde você quer abrir?"** com "Os dois editores trabalham no mesmo arquivo. O que você salvar volta para este item." e as opções em cartão: **No ENSPACE** ("Abre aqui, no navegador, com o ONLYOFFICE. Salva sozinho e mostra quem está editando.", "Bom para revisões rápidas e para editar junto") e **No Microsoft Word** ("Abre no Word do seu computador, direto do item. O Salvar do Word grava aqui, e o documento fica reservado para você.", "Bom para documentos longos e formatação fina"). | Só aparecem as opções ligadas na configuração (RC-01). |
| RE-02 | Escolhendo Word com o Word para a web ligado (RC-02), a pergunta deve mostrar "Qual Word?": **Word instalado no computador** (Windows ou Mac) e **Word no navegador, com Microsoft 365**. | Sem o Word para a web ligado, essa pergunta não aparece. |
| RE-03 | A pergunta deve ter **Lembrar minha escolha**, marcado por padrão, com a explicação "Você troca quando quiser, pela seta ao lado do botão Abrir." A escolha vale por pessoa e por campo. | Com a escolha lembrada, o próximo Abrir vai direto ao editor e o botão diz o nome dele. |
| RE-04 | A seta ao lado do botão deve listar cada editor ligado, com uma descrição curta ("ONLYOFFICE, aqui no navegador", "Word instalado no computador", "Word no navegador, com Microsoft 365") e um sinal no editor atual. Escolher um editor abre nele e passa a ser o do botão. | O botão sempre mostra o último editor escolhido. |
| RE-05 | Com uma escolha lembrada, a seta deve ter também "Onde você quer abrir?", que limpa a escolha e mostra a pergunta de novo. | Dá para voltar a perguntar sem configuração. |
| RE-06 | Se só um editor estiver ligado, não existe pergunta nem seta: o botão abre direto nele. | Com só o ONLYOFFICE ligado, o botão diz "Abrir no ENSPACE". |
| RE-07 | Sem escolha da pessoa, o botão deve usar o editor padrão da configuração (RC-03); com o padrão "Perguntar na primeira vez", mostra a pergunta (RE-01). | O padrão do configurador vale até a pessoa escolher. |

## Editor no ENSPACE (RO) · Melhoria

| ID | Requisito | Critério de aceite |
|---|---|---|
| RO-01 | O ONLYOFFICE deve abrir em **tela inteira dentro do ENSPACE**, não numa gaveta sobre a gaveta do item. | O documento ocupa a largura toda. Não existe o botão "Tela Cheia". |
| RO-02 | Um cabeçalho fixo do ENSPACE, acima do ONLYOFFICE, deve mostrar: **Voltar ao item**, o nome do arquivo e, abaixo, "<referência do item> · <categoria> · <rótulo do campo>". | O cabeçalho nunca rola para fora da tela. |
| RO-03 | **A edição deve salvar sozinha**, sem Ctrl+S, e o cabeçalho deve mostrar o estado o tempo todo: "Salvando" (com indicador girando) e "Salvo agora" ou "Salvo há <tempo>". | Fechar o editor e reabrir mostra a edição. Hoje ela se perde. |
| RO-04 | Sem conexão, o cabeçalho deve dizer "Sem conexão. Suas mudanças ficam guardadas aqui." e salvar quando a conexão voltar. | Nenhuma edição se perde por queda de rede. |
| RO-05 | Quem estiver editando junto deve aparecer em avatares no cabeçalho, com indicador verde, e o tooltip "Editando agora". | Com Ana no documento, o avatar dela aparece ao lado do meu. |
| RO-06 | O cabeçalho deve ter: **Versões** (abre o histórico ao lado, RH-06), **Baixar** (.docx e PDF), **Abrir no Word** (quando o Word está ligado, a pessoa pode editar e ninguém está editando junto) e **Concluir**, que é o botão principal. | Trocar para o Word não exige voltar ao item. |
| RO-07 | **Concluir** e **Voltar ao item** devem salvar o que faltar, fechar o editor e, se houve mudança, criar a versão nova e confirmar: "Versão <N> salva". | O cartão do campo mostra a versão nova, com "você, agora". |
| RO-08 | Em modo leitura (PDF, outra pessoa no Word, perfil sem edição, Editar desligado na configuração), o cabeçalho deve mostrar o selo "Somente leitura" e o documento não deve aceitar edição. Lendo uma versão antiga, o selo diz "Versão <N> · Somente leitura". | Não existe estado de salvamento em leitura. |
| RO-09 | **Esc deve fechar só o que está por cima** (o painel de versões, um menu). O editor fecha pelo Concluir ou pelo Voltar ao item. O rodapé deve lembrar isso: "Esc fecha só o que está por cima. O editor fecha pelo Concluir." | Fechar o select de versões com Esc não fecha mais o editor. |
| RO-10 | O rodapé deve mostrar a versão aberta e quem editou por último. | Exemplo: "Versão 5 · Carla Menezes, agora". |
| RO-11 | A revisão ortográfica do ONLYOFFICE deve seguir o idioma do ENSPACE. | Hoje fica em "English (United States)" com o ENSPACE em português. |
| RO-12 | As permissões do campo (editar, comentar, acompanhar mudanças, revisão, chat) devem continuar valendo dentro do ONLYOFFICE. | Comentar desligado tira o comentário do editor. |

## Versões (RH) · Melhoria

| ID | Requisito | Critério de aceite |
|---|---|---|
| RH-01 | O histórico deve listar as versões da mais nova para a mais antiga, com: número, selo "Atual" na mais nova, avatar e nome do autor, data e hora, e a origem. | Exemplo: "Versão 3 · Diego Ramos · 06 de out., 10:53 · Editada no Word". |
| RH-02 | A origem deve ser uma destas: Gerada do modelo, Criada em branco, Arquivo enviado, Editada no ENSPACE, Editada no Word, Restaurada da versão <N>. | Toda versão tem origem. |
| RH-03 | Cada versão deve ter **Ver** (abre em leitura, RO-08), **Baixar** e, nas que não são a atual, **Restaurar**. | A versão atual não tem Restaurar. |
| RH-04 | **Restaurar** deve pedir confirmação: "O conteúdo da versão <N> vira a versão <N+1>. Nenhuma versão é apagada." e, ao confirmar, criar a versão nova com origem "Restaurada da versão <N>". | O histórico só cresce. |
| RH-05 | Restaurar deve ficar indisponível enquanto alguém está com o documento e para quem só lê. | Sem Restaurar com Bruno no Word. |
| RH-06 | O histórico deve abrir pelo botão **Versões** do cartão (painel lateral) e pelo botão **Versões** do editor (coluna ao lado do documento, sem nova camada por cima). | O select "Versões" acima da barra do ONLYOFFICE não existe mais. |
| RH-07 | Uma versão nasce a cada: criação, Concluir no ENSPACE com mudança, Salvar no Word, envio de arquivo e restauração. | Digitar no ONLYOFFICE não cria uma versão por tecla. |

## Word instalado (RW) · Criação

| ID | Requisito | Critério de aceite |
|---|---|---|
| RW-01 | **Abrir no Word** deve abrir o **Word instalado no computador** (Windows e Mac) com o arquivo que está no item, **sem baixar o arquivo** para a pasta de Downloads. | O arquivo não precisa estar salvo na máquina de quem abre. |
| RW-02 | Ao abrir, o documento deve ficar **reservado** para quem abriu (RQ-05); as outras pessoas só leem (RQ-01). | Ninguém mais edita até a liberação. |
| RW-03 | Ao abrir, uma janela deve mostrar os 3 passos com andamento: **Reservar para você** ("Enquanto você edita no Word, as outras pessoas só leem. Assim ninguém sobrescreve ninguém."), **Abrir no Word** ("O Word do computador abre o arquivo que está neste item. Nada é baixado.") e **Salvar no Word** ("Cada Salvar (Ctrl+S) vira uma versão neste item. Fechou o documento, ele fica livre."). | Os passos se marcam como concluídos, e um aviso confirma "Documento aberto no Word". |
| RW-04 | **Cada Salvar do Word (Ctrl+S) deve gravar no item** e criar uma versão com origem "Editada no Word". | A versão aparece no cartão e no histórico sem a pessoa fazer mais nada. |
| RW-05 | **Fechar o documento no Word deve liberar a reserva.** | O cartão sai do estado "aberto no Word" e os outros voltam a editar. |
| RW-06 | Se o arquivo mudou no ENSPACE depois que a pessoa abriu no Word (exemplo: restauração), o Salvar do Word não deve sobrescrever: a pessoa escolhe entre salvar como nova versão ou descartar. | Nenhuma versão se perde por conflito. |
| RW-07 | Quem abre no Word deve ter permissão de editar o item; o acesso do Word ao arquivo deve valer só para aquela pessoa, aquele documento e por tempo limitado. | Um link vazado não abre o documento depois que expira. |

## Word não abriu (RF) · Criação

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF-01 | A janela de abrir no Word deve ter **"O Word não abriu?"**, que, aberto, diz: "Baixe o arquivo, edite no Word ou onde preferir e envie de volta. O arquivo enviado vira uma nova versão deste item." | O texto não fala de plugin. |
| RF-02 | Abaixo do texto, os botões **Baixar** e **Enviar nova versão** devem ficar lado a lado. | Os 2 aparecem juntos, no mesmo nível. |
| RF-03 | **Baixar** deve baixar o .docx atual do item e avisar: "Arquivo baixado. Depois de editar, envie aqui como nova versão." | O arquivo baixado é a versão atual. |
| RF-04 | **Enviar nova versão** deve abrir o seletor de arquivos (.docx), criar a versão com origem "Arquivo enviado", **liberar a reserva** e confirmar: "Versão <N> enviada. O documento está livre de novo." | O cartão mostra a versão nova e sai do estado "aberto no Word". |
| RF-05 | Arquivo que não é .docx deve ser recusado com "Este arquivo não pode ser usado. Envie um arquivo .docx ou .pdf." | Nenhuma versão é criada. |

## Plugin do Word (RG) · Criação

O plugin do ENSPACE para o Word já tem as abas Assistentes (IA) e Templates. Estes requisitos criam a ligação dele com o campo.

| ID | Requisito | Critério de aceite |
|---|---|---|
| RG-01 | O painel do plugin deve ganhar a aba **Documento**, antes de Assistentes (IA) e Templates. | A aba aparece com o painel aberto. |
| RG-02 | Com um documento que veio de um campo, a aba deve mostrar o bloco **"Ligado a um item"**: referência do item, nome do item (exemplo: contratante), rótulo do campo e "Você abriu a versão <N>". | Dá para saber, dentro do Word, a qual item o arquivo pertence. |
| RG-03 | A aba deve mostrar o estado do salvamento: "Mudanças ainda não salvas no item" (aviso), "Versão <N> salva às <hora>" ou "Tudo salvo no item". | O estado muda assim que a pessoa digita e depois que salva. |
| RG-04 | O botão **Salvar no ENSPACE** deve gravar no item, criar a versão com origem "Editada no Word" e ficar desabilitado quando não há mudança. | É o mesmo efeito do Ctrl+S (RW-04). |
| RG-05 | **Concluir e liberar** deve salvar o que faltar, liberar a reserva e fechar o vínculo. | O cartão do campo sai do estado "aberto no Word". |
| RG-06 | **Ver o item no ENSPACE** deve levar ao item no navegador. | Abre o item certo. |
| RG-07 | O documento deve carregar dentro dele o vínculo com o item (item, campo e versão), para o plugin reconhecer também uma cópia baixada. | Um .docx baixado pelo RF-03 e aberto no Word mostra o bloco "Ligado a um item". |
| RG-08 | **Sem o plugin instalado, o Salvar do Word continua gravando no item** (RW-04). O plugin soma contexto; não é condição para editar. | Quem não tem o plugin edita e salva do mesmo jeito. |
| RG-09 | Na janela de abrir no Word, quem não tem o plugin deve ver: "Com o suplemento do ENSPACE no Word, o painel mostra a qual item o documento pertence.", com o link **Como instalar**. | O aviso não impede abrir. |

## Word para a web (RW-W) · Criação, fase 2

| ID | Requisito | Critério de aceite |
|---|---|---|
| RW-W-01 | Com a opção ligada na configuração (RC-02), **Abrir no Word para a web** deve abrir o documento no Word para a web, numa nova aba. | A opção aparece na seta e na pergunta "Qual Word?". |
| RW-W-02 | Enquanto a pessoa edita, uma cópia fica no OneDrive dela; ao concluir, a cópia volta para o item como versão nova e sai do OneDrive. | Nenhuma cópia fica esquecida no OneDrive. |
| RW-W-03 | A opção deve explicar o que exige: "Precisa de conta Microsoft 365" na escolha, e "Precisa de Microsoft 365 da empresa. Uma cópia fica no OneDrive de quem edita até concluir." na configuração. | Quem configura sabe o que liga. |
| RW-W-04 | A reserva (RQ) e as versões (RH) valem igual ao Word instalado. | Mesmo comportamento para quem olha o cartão. |

## Configuração do campo (RC) · Melhoria

| ID | Requisito | Critério de aceite |
|---|---|---|
| RC-01 | A configuração específica do campo deve ter o grupo **"Onde o documento abre"** ("Quem usa o campo escolhe entre os editores ligados aqui."), com as chaves **ENSPACE (ONLYOFFICE)** ("No navegador, sem instalar nada. Permite editar junto.") e **Microsoft Word** ("O Word instalado no computador (Windows ou Mac) abre o arquivo do item. Uma pessoa edita por vez."). | Pelo menos 1 editor fica sempre ligado. |
| RC-02 | Dentro do Word, a chave **Word para a web (fase 2)** deve aparecer recuada e só funcionar com o Word ligado. No protótipo ela nasce ligada. | Desligar o Word desliga o Word para a web. |
| RC-03 | O grupo deve ter **Editor padrão**: Perguntar na primeira vez, ENSPACE (ONLYOFFICE) ou Microsoft Word, com a explicação "O que o botão Abrir usa para quem ainda não escolheu." | Editor desligado não pode ser o padrão. |
| RC-04 | O grupo **"Como o documento nasce"** ("As opções que aparecem no campo vazio.") deve ter: Modelos da categoria (com quantos modelos existem), Documento em branco, Enviar arquivo .docx, Enviar arquivo .pdf. | As chaves mudam o campo vazio (RV-12). |
| RC-05 | O grupo **"O que se faz no editor"** ("Vale para o ONLYOFFICE. No Word, quem decide é o próprio Word.") deve ter: Editar, Comentar, Acompanhar mudanças, Revisão, Mostrar painel de revisão (só com Revisão ligada) e Chat. | Mostrar painel de revisão fica desabilitado sem Revisão. |
| RC-06 | **Editar** deve nascer ligado. | Hoje nasce desligado. |
| RC-07 | A pré-visualização do campo, abaixo do Salvar, deve mostrar o campo vazio de verdade (RV) e mudar conforme as chaves. | Desligar Em branco tira o botão da pré-visualização. |
| RC-08 | Abrir a configuração do campo não deve mostrar "Ocorreu um erro ao carregar os campos aninhados". | Hoje o erro aparece até clicar em Recarregar. |

## Lista de itens (RL) · Melhoria

| ID | Requisito | Critério de aceite |
|---|---|---|
| RL-01 | A célula do campo deve mostrar a miniatura pequena com o tipo, o nome do arquivo (cortado com reticências, nome inteiro no tooltip) e "v<N>". | Exemplo: "Minuta Aurora Logística.docx v4". |
| RL-02 | Sem documento, a célula deve dizer "Sem documento". | Célula vazia não existe. |
| RL-03 | A célula deve mostrar quem está com o documento (RQ-07). | Cadeado no contrato que Bruno abriu no Word. |

## Visão rápida (RR) · Melhoria

| ID | Requisito | Critério de aceite |
|---|---|---|
| RR-01 | O aviso "Alterações não salvas" do rodapé deve aparecer só quando um campo do formulário mudar. | Abrir o item sem mexer em nada não mostra o aviso. |
| RR-02 | O documento não deve passar pelo Salvar do item: ele salva no editor (RO-03, RW-04). | Editar o documento e fechar o item com "Sair sem salvar" mantém a edição do documento. |
| RR-03 | O botão Salvar do item deve ficar desabilitado sem mudança nos campos. | Salvar só acende com mudança. |
| RR-04 | Trocar de item pelas setas da visão rápida deve começar o campo do zero, sem levar estado do item anterior. | Um "Avisar quando liberar" pedido num item não aparece no próximo. |

## Estados (RS) · Melhoria

| ID | Requisito | Critério de aceite |
|---|---|---|
| RS-01 | **Carregando:** o campo deve mostrar o esqueleto do cartão (miniatura, 2 linhas e o botão). | O campo não fica em branco. |
| RS-02 | **Erro:** o campo deve mostrar "Não foi possível carregar o documento. O arquivo continua guardado. Tente de novo em alguns segundos." com **Tentar de novo**. | Tentar de novo recarrega o campo. |
| RS-03 | **Só leitura:** com o perfil sem edição, o cartão deve mostrar Ler no lugar de Abrir, sem Substituir, Remover e Restaurar. | Nenhuma ação de edição aparece. |
| RS-04 | Todo texto do campo, do editor, da escolha, das versões, do Word e da configuração deve existir em português, inglês e espanhol, e funcionar no tema claro e no escuro. | Trocar o idioma troca todos os textos; o escuro mantém o contraste. |

---

## Fora destes requisitos

- **Como o Word salva no item:** a pesquisa (`PESQUISA.md`, "A limitação técnica") indica um endereço do ENSPACE que o Word reconhece como pasta editável, com reserva. É decisão do time técnico; os requisitos acima descrevem só o comportamento.
- **Word no Mac:** há relato de o Word abrir em leitura no Mac pelo mesmo caminho que funciona no Windows. Testar antes de prometer; enquanto não funcionar, RF cobre.
- **Prazo da reserva (RQ-08):** falta definir quanto tempo sem atividade libera o documento.
- **Uma versão por Salvar do Word (RW-04) ou uma por sessão:** o protótipo cria uma por Salvar, como o Box. Com muitos Salvar seguidos, pode valer agrupar.
- **Painel do plugin abrir sozinho com o documento:** a Microsoft não permite isso para plugin publicado na loja; o painel abre pelo botão do plugin.
- **Word para a web pelo programa de parceiros da Microsoft (CSPP):** descartado, porque obriga o Office como editor padrão no lugar do ONLYOFFICE. A fase 2 usa a cópia no OneDrive (RW-W-02).
- **Miniatura da primeira página (RP-01):** o protótipo desenha linhas; no produto, é uma imagem gerada da primeira página.
- **Notificação do "Avisar quando liberar" (RQ-02):** falta definir o canal (sino do ENSPACE, e-mail ou os 2).

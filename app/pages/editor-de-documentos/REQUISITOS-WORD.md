# Requisitos: edição no Microsoft Word pelo campo Editor de Documentos (entrega 2)

**Objetivo:** quem trabalha no item escolhe abrir o documento do campo no Microsoft Word, edita no Word do computador com o arquivo que está no item, sem baixar, e cada Salvar volta para o item como versão. Enquanto uma pessoa edita no Word, as outras leem e veem quem está com o documento.

**Onde vale:** no campo do tipo Editor de Documentos (visão rápida e tela do item); no cabeçalho do editor no ENSPACE; na configuração do campo; na coluna do campo na lista de itens; e no plugin do ENSPACE para o Word.

**Referência visual:** protótipo `editor-de-documentos`, fase "2. Word liberado" na barra de baixo, em https://pernalombr4.github.io/prototipos/editor-de-documentos/ (rodadas 1 a 7, de 08/10/2026 a 21/10/2026). Prints em `evidencias/proto-02` a `proto-09`. A janela do Word no protótipo é simulação; o painel do plugin e o salvamento no item são a proposta.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre aspas são os da interface em português. Este documento parte da entrega 1 (`REQUISITOS-CAMPO.md`), já pronta.

**Fora do escopo:** tudo o que a entrega 1 cobre (campo, editor no ENSPACE, versões, editor de modelos); a coautoria entre o Word e o ONLYOFFICE ao mesmo tempo; o Word para a web pelo programa de parceiros da Microsoft (CSPP).

## Resumo

| Grupo | O que muda em relação à entrega 1 | Requisitos |
|---|---|---|
| Liberação | O selo "Em breve" sai e as opções do Word passam a funcionar | RF101 a RF103 |
| Escolha do editor | Pergunta "Onde você quer abrir?" na primeira vez, com "Lembrar minha escolha" | RF104 a RF110 |
| Word instalado | O Word do computador abre o arquivo do item; Salvar grava no item; fechar libera | RF111 a RF117 |
| Reserva e concorrência | O documento fica reservado para quem abriu no Word; os outros leem e podem pedir aviso | RF118 a RF127 |
| Word não abriu | Baixar e enviar a nova versão, lado a lado | RF128 a RF132 |
| Plugin do Word | Aba "Documento" no painel do plugin, com o vínculo ao item e "Salvar no ENSPACE" | RF133 a RF141, RF151 |
| Word para a web | Opção com cópia temporária no OneDrive de quem edita | RF142 a RF145 |
| Configuração do campo | As chaves do Word e o editor padrão passam a funcionar | RF146 a RF149 |
| Lista de itens | Cadeado na célula do documento reservado no Word | RF150 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN101 | Um documento só pode estar aberto no Word por 1 pessoa por vez. | Com Bruno no Word, Carla não consegue abrir no Word. |
| RN102 | Enquanto um documento está reservado no Word, as outras pessoas só podem ler o documento. | Carla abre o documento de Bruno só para leitura. |
| RN103 | Um documento só pode ser aberto no Word enquanto está livre de edição no ENSPACE. | Com Ana no ONLYOFFICE, "Abrir no Word" fica desabilitado. |
| RN104 | Cada Salvar feito no Word cria uma versão com a origem "Editada no Word". | 3 Salvar no Word criam 3 versões. |
| RN105 | A reserva do documento termina quando a pessoa fecha o documento no Word, envia a nova versão pela saída de emergência, libera sem salvar, ou quando a reserva expira (RNF102). | Fechar o Word libera o documento para os outros. |
| RN106 | A escolha de editor vale por pessoa e por campo. | Carla escolhe Word no campo Minuta; no campo Aditivo, a pergunta aparece de novo. |
| RN107 | Um Salvar do Word não pode sobrescrever uma versão criada depois da abertura no Word. | Se alguém restaurou uma versão enquanto Carla estava no Word, o Salvar dela não apaga a restauração. |
| RN108 | A tabela a seguir define o que o cartão do campo oferece em cada situação do documento. Política: Única. | Linha 3: com Bruno no Word, Carla vê Ler e Avisar quando liberar. |

| Linha | Tipo do arquivo | Quem está com o documento | Botão principal | Opções do Word na seta |
|---|---|---|---|---|
| 1 | DOCX | ninguém | "Abrir no <editor escolhido>" ou "Abrir" (sem escolha) | habilitadas |
| 2 | DOCX | outra pessoa, no ENSPACE | "Editar junto" | desabilitadas (RN103) |
| 3 | DOCX | outra pessoa, no Word | "Ler" e "Avisar quando liberar" | sem seta (RN101) |
| 4 | DOCX | a própria pessoa, no Word | "Voltar ao Word" e "Liberar sem salvar" | sem seta |
| 5 | PDF | qualquer situação | "Ler" | sem seta |

## Liberação (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF101 | O selo "Em breve" deve sair das opções do Word no menu da seta, no cabeçalho do editor e na configuração do campo. | Nenhuma opção do Word aparece com "Em breve". | Essencial |
| RF102 | As opções do Word ligadas na configuração do campo (RF146) devem aparecer habilitadas na seta do cartão, conforme RN108. | Com o Word ligado, "Abrir no Word" pode ser escolhido. | Essencial |
| RF103 | O botão "Abrir no Word" do cabeçalho do editor deve salvar a edição do ONLYOFFICE, fechar o editor e abrir no Word (RF111). | A versão da edição no ONLYOFFICE fica salva antes de o Word abrir. | Importante |

## Escolha do editor (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF104 | No primeiro Abrir de quem ainda não escolheu, o sistema deve mostrar a pergunta "Onde você quer abrir?" com "Os dois editores trabalham no mesmo arquivo. O que você salvar volta para este item.". | A pergunta não aparece de novo depois de lembrada (RF107). | Essencial |
| RF105 | A pergunta deve ter as opções "No ENSPACE" ("Abre aqui, no navegador, com o ONLYOFFICE. Salva sozinho e mostra quem está editando.") e "No Microsoft Word" ("Abre no Word do seu computador, direto do item. O Salvar do Word grava aqui, e o documento fica reservado para você."). | Só aparecem as opções ligadas na configuração (RF146). | Essencial |
| RF106 | Quando a pessoa escolhe "No Microsoft Word" com o Word para a web ligado, a pergunta deve mostrar "Qual Word?" com "Word instalado no computador" e "Word no navegador, com Microsoft 365". | Sem o Word para a web ligado, "Qual Word?" não aparece. | Importante |
| RF107 | A pergunta deve ter "Lembrar minha escolha", marcado por padrão, com "Você troca quando quiser, pela seta ao lado do botão Abrir." (RN106). | Com a escolha lembrada, o próximo Abrir vai direto ao editor e o botão diz o nome dele. | Essencial |
| RF108 | Quando a pessoa escolhe um editor pela seta do cartão, o sistema deve abrir nesse editor e passar a usar esse editor no botão principal. | Escolher "Abrir no Word" pela seta faz o botão dizer "Abrir no Word". | Importante |
| RF109 | Com uma escolha lembrada, a seta deve ter a opção "Onde você quer abrir?", que limpa a escolha e mostra a pergunta. | A pergunta volta sem passar pela configuração. | Desejável |
| RF110 | Sem escolha da pessoa, o botão principal deve usar o editor padrão da configuração (RF148). | Com o padrão "Microsoft Word", o botão diz "Abrir no Word" para quem ainda não escolheu. | Importante |

## Word instalado (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF111 | "Abrir no Word" deve abrir o Word instalado no computador da pessoa com o arquivo que está no item, sem baixar o arquivo para a pasta de Downloads. | O arquivo abre no Word sem existir antes no computador. | Essencial |
| RF112 | Ao abrir no Word, o sistema deve mostrar a janela "Abrir no Word" com os passos "Reservar para você", "Abrir no Word" e "Salvar no Word", marcados conforme concluem. | Os 3 passos ficam marcados e aparece o aviso "Documento aberto no Word". | Importante |
| RF113 | Cada passo da janela deve ter a explicação: "Enquanto você edita no Word, as outras pessoas só leem. Assim ninguém sobrescreve ninguém.", "O Word do computador abre o arquivo que está neste item. Nada é baixado." e "Cada Salvar (Ctrl+S) vira uma versão neste item. Fechou o documento, ele fica livre.". | Os textos aparecem abaixo de cada passo. | Desejável |
| RF114 | Cada Salvar feito no Word deve gravar o documento no item (RN104). | Depois do Ctrl+S, o cartão mostra a versão nova com "Editada no Word". | Essencial |
| RF115 | Fechar o documento no Word deve liberar a reserva (RN105). | O cartão sai do estado "aberto no Word". | Essencial |
| RF116 | Se a versão do item mudou depois da abertura no Word, o sistema deve oferecer, no Salvar, salvar como nova versão ou descartar (RN107). | Nenhuma das 2 versões se perde. | Importante |
| RF117 | O acesso do Word ao arquivo deve valer só para a pessoa que abriu, só para aquele documento e só pelo prazo de RNF101. | Um endereço copiado deixa de abrir o arquivo depois do prazo. | Essencial |

## Reserva e concorrência (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF118 | Enquanto a própria pessoa está com o documento no Word, o cartão deve ter borda na cor de destaque e a faixa "Você está com este documento aberto no Word desde <hora>. Cada Salvar do Word vira uma versão aqui. Feche o documento no Word para liberar. Enquanto isso, as outras pessoas só leem.". | Exemplo: "desde 10:42". | Essencial |
| RF119 | No estado de RF118, o cartão deve ter os botões "Voltar ao Word" e "Liberar sem salvar" (RN108, linha 4). | Voltar ao Word abre o Word de novo com o mesmo arquivo. | Essencial |
| RF120 | Quando a pessoa clica em "Liberar sem salvar", o sistema deve tirar a reserva e mostrar "Documento liberado. As mudanças feitas no Word não foram trazidas.". | As outras pessoas voltam a poder editar. | Importante |
| RF121 | Enquanto outra pessoa está com o documento no Word, o cartão deve mostrar a faixa "<nome> está editando no Word desde <hora>. Você pode ler a versão atual. A edição volta quando o documento for liberado." (RN102). | Exemplo: "Bruno Lima está editando no Word desde 10:13." | Essencial |
| RF122 | No estado de RF121, o cartão deve ter os botões "Ler" e "Avisar quando liberar" (RN108, linha 3). | Abrir para editar não aparece. | Essencial |
| RF123 | Quando a pessoa clica em "Avisar quando liberar", o sistema deve registrar o pedido e mostrar "Você recebe um aviso quando <nome> liberar o documento.". | O botão fica marcado e desabilitado. | Importante |
| RF124 | Quando o documento é liberado, o sistema deve avisar cada pessoa que pediu aviso (RI105). | Carla recebe o aviso quando Bruno fecha o Word. | Importante |
| RF125 | Se a pessoa tenta abrir no Word um documento que outra pessoa está editando no ENSPACE, o sistema deve mostrar "<nome> está editando no ENSPACE agora" e "Para abrir no Word, o documento precisa estar livre. Edite junto no ENSPACE ou espere a pessoa concluir.", com o botão "Editar junto" (RN103). | Escolher Editar junto abre o ONLYOFFICE no mesmo documento. | Essencial |
| RF126 | Enquanto o documento está reservado no Word, Substituir, Remover e Restaurar devem ficar desabilitados para cada pessoa do item, inclusive quem reservou. | Nem quem reservou consegue remover o documento pelo cartão. | Importante |
| RF127 | A reserva deve expirar depois de RNF102 sem atividade do Word e ser renovada enquanto o Word mantém o arquivo aberto. | Um Word fechado sem aviso libera o documento depois do prazo. | Essencial |

## Word não abriu (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF128 | A janela "Abrir no Word" deve ter o item "O Word não abriu?", que, aberto, mostra "Baixe o arquivo, edite no Word ou onde preferir e envie de volta. O arquivo enviado vira uma nova versão deste item.". | O texto aparece ao clicar em "O Word não abriu?". | Essencial |
| RF129 | Abaixo do texto de RF128, os botões "Baixar" e "Enviar nova versão" devem ficar lado a lado. | Os 2 botões aparecem na mesma linha. | Essencial |
| RF130 | "Baixar" deve baixar o .docx da versão atual e mostrar "Arquivo baixado. Depois de editar, envie aqui como nova versão.". | O arquivo baixado é a versão atual. | Essencial |
| RF131 | "Enviar nova versão" deve abrir o seletor de arquivos, criar a versão com a origem "Arquivo enviado", liberar a reserva e mostrar "Versão <N> enviada. O documento está livre de novo." (RN105). | O cartão mostra a versão nova e sai do estado "aberto no Word". | Essencial |
| RF132 | Se o arquivo enviado em RF131 não é .docx, o sistema deve recusar o envio com "Este arquivo não pode ser usado. Envie um arquivo .docx ou .pdf.". | Nenhuma versão é criada. | Importante |

## Plugin do Word (RF)

O plugin do ENSPACE para o Word já tem as abas Assistentes (IA) e Templates.

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF133 | O painel do plugin deve ter a aba "Documento", antes de "Assistentes (IA)" e "Templates". | A aba aparece com o painel aberto. | Essencial |
| RF134 | Com um documento que veio de um campo, a aba Documento deve mostrar o bloco "Ligado a um item" com a referência do item, o nome do item, o rótulo do campo e "Você abriu a versão <N>". | Exemplo: "CTR-0142 · Aurora Logística Ltda. · Minuta do contrato · Você abriu a versão 4". | Essencial |
| RF135 | A aba Documento deve mostrar o estado do salvamento: "Mudanças ainda não salvas no item", "Versão <N> salva às <hora>" ou "Tudo salvo no item". | O estado muda ao digitar e depois de salvar. | Importante |
| RF136 | O botão "Salvar no ENSPACE" deve gravar o documento no item como versão "Editada no Word" (RN104). | O efeito é o mesmo do Ctrl+S de RF114. | Essencial |
| RF137 | Sem mudança desde o último salvamento, "Salvar no ENSPACE" deve ficar desabilitado. | O botão só acende depois de digitar. | Desejável |
| RF138 | "Concluir e liberar" deve salvar o que faltar e liberar a reserva (RN105). | O cartão sai do estado "aberto no Word". | Importante |
| RF139 | "Ver o item no ENSPACE" deve abrir o item no navegador. | Abre o item certo. | Desejável |
| RF140 | O documento aberto no Word deve levar dentro o vínculo com o item, o campo e a versão (RI103). | Um .docx baixado por RF130 e aberto no Word mostra o bloco "Ligado a um item". | Importante |
| RF141 | Sem o plugin instalado, o Salvar do Word deve continuar gravando no item (RF114). | Quem não tem o plugin edita e salva no item. | Importante |
| RF151 | Sem o plugin instalado, a janela "Abrir no Word" deve mostrar "Com o suplemento do ENSPACE no Word, o painel mostra a qual item o documento pertence." com o botão "Como instalar". | A dica some com o plugin instalado. | Desejável |

## Word para a web (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF142 | Com a opção ligada na configuração (RF147), "Abrir no Word para a web" deve abrir o documento no Word para a web, numa nova aba. | A opção aparece na seta e em "Qual Word?". | Desejável |
| RF143 | Enquanto a pessoa edita no Word para a web, o sistema deve manter uma cópia do documento no OneDrive dela (RI104). | A cópia aparece no OneDrive da pessoa durante a edição. | Desejável |
| RF144 | Quando a pessoa conclui no Word para a web, o sistema deve trazer a cópia para o item como versão nova e apagar a cópia do OneDrive. | Nenhuma cópia fica no OneDrive depois de concluir. | Desejável |
| RF145 | A reserva (RF118 a RF127) deve valer para o Word para a web como vale para o Word instalado. | O cartão mostra a reserva igual. | Desejável |

## Configuração do campo (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF146 | O grupo "Onde o documento abre" deve ter a chave "Microsoft Word" com "O Word instalado no computador (Windows ou Mac) abre o arquivo do item. Uma pessoa edita por vez.". | Ligar a chave habilita o Word no campo. | Essencial |
| RF147 | Abaixo da chave do Word, recuada, a chave "Word para a web" deve funcionar só com o Word ligado, com "Precisa de Microsoft 365 da empresa. Uma cópia fica no OneDrive de quem edita até concluir.". | Desligar o Word desliga o Word para a web. | Desejável |
| RF148 | O grupo deve ter "Editor padrão", em lista, com "Perguntar na primeira vez", "ENSPACE (ONLYOFFICE)" e "Microsoft Word", e a ajuda "O que o botão Abrir usa para quem ainda não escolheu.". | Um editor desligado aparece desabilitado na lista. | Importante |
| RF149 | Se o configurador desliga os 2 editores, o sistema deve manter o ONLYOFFICE ligado. | O campo sempre tem pelo menos 1 editor. | Importante |

## Lista de itens (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF150 | Enquanto o documento está reservado no Word, a célula do campo deve mostrar um cadeado, com o tooltip do nome e da hora (de outra pessoa) ou "Reservado para você" (da própria pessoa), em cores diferentes. | O cadeado aparece na linha do CTR-0139, com Bruno no Word. | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI101 | Endereço que o Word usa para abrir, reservar, salvar e liberar o arquivo do item, rota <a definir> | Deve aceitar abrir o arquivo, reservar, gravar cada Salvar como versão e liberar, só para a pessoa e o documento do acesso (RF117). |
| RI102 | Link que abre o Word instalado a partir do navegador | Deve abrir o Word com o endereço de RI101, no modo de edição. |
| RI103 | Vínculo gravado dentro do .docx | Deve guardar o item, o campo e a versão, para o plugin ler (RF134, RF140). |
| RI104 | Cópia do documento no OneDrive da pessoa (Microsoft Graph) | Deve criar a cópia ao abrir no Word para a web e trazê-la de volta ao concluir (RF143, RF144). |
| RI105 | Aviso de documento liberado | Deve chegar a cada pessoa que pediu aviso, pelo canal de P103. |
| RI106 | Envio de versão pelo plugin, rota <a definir> | Deve receber o documento inteiro e a versão de origem, e recusar com conflito quando a versão do item é mais nova (RN107). |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF101 | O acesso do Word ao arquivo (RF117) deve expirar em <a definir>. | Usar o endereço depois do prazo não abre o arquivo. | Essencial |
| RNF102 | A reserva deve expirar depois de <a definir> sem atividade do Word (RF127). | Fechar o Word à força libera o documento depois do prazo. | Essencial |
| RS101 | O Word instalado deve funcionar no Windows e no Mac, nas versões que o plugin do ENSPACE aceita (Word 2016 ou mais novo e Microsoft 365). Imposta por: compatibilidade do plugin, em Integrações › Documentos. | Testar no Windows e no Mac. | Essencial |
| RS102 | Cada texto das telas deste documento e do painel do plugin deve existir em português, inglês e espanhol. Imposta por: padrão do ENSPACE (protótipos, regra 35). | Trocar o idioma troca todos os textos. | Essencial |
| RT101 | Enquanto o plugin não está na loja da Microsoft, a instalação continua pelo manifesto, e "Como instalar" leva à página de instalação por manifesto. Critério de fim: plugin publicado na loja. | "Como instalar" abre a página do manifesto. | Importante |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Qual caminho técnico o Word usa para salvar no item? A pesquisa do protótipo recomenda um endereço de edição com reserva (WebDAV) aberto pelo link do Office (`ms-word:ofe`). | time técnico | RI101 e RI102. |
| P102 | O Word no Mac salva de volta pelo mesmo caminho? Há relato de abrir só para leitura. | time técnico, com teste | Se não salvar, o Mac usa a saída de RF128 a RF132. |
| P103 | Por qual canal chega o aviso de RF124: sino do ENSPACE, e-mail ou os 2? | produto | RI105. |
| P104 | Cada Salvar do Word cria uma versão, ou uma versão por sessão de edição? | produto | RN104 e RF114. |
| P105 | Quais são os prazos de RNF101 e RNF102? | produto e time técnico | RF117 e RF127. |
| P106 | Alguém com permissão de configuração pode liberar a reserva de outra pessoa? | produto | Um requisito novo de liberação forçada. |
| P107 | O Word para a web (RF142 a RF145) entra nesta entrega ou numa seguinte? Exige Microsoft 365 da empresa e consentimento de cada pessoa. | produto | A prioridade de RF142 a RF147. |
| S101 | Suposição: o painel do plugin não abre sozinho quando o documento abre, porque a Microsoft não permite isso para plugin publicado na loja. Confirma: documentação da Microsoft e time técnico. | time técnico | Se abrir sozinho, RF133 ganha a abertura automática. |
| S102 | Suposição: o Word para a web pelo programa de parceiros da Microsoft (CSPP) fica de fora, porque o programa obriga o Office como editor padrão no lugar do ONLYOFFICE. Confirma: produto. | produto | Se entrar, RF142 a RF145 mudam de caminho. |

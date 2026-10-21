# Requisitos: edição no Microsoft Word pelo campo Editor de Documentos (entrega 2)

**Objetivo:** quem trabalha no item escolhe abrir o documento do campo no Microsoft Word, edita no Word do computador com o arquivo que está no item, sem baixar, e cada Salvar com mudança volta para o item como versão. Enquanto uma pessoa edita no Word, as outras leem e veem quem está com o documento.

**Onde vale:** no campo do tipo Editor de Documentos (visão rápida e tela do item); no cabeçalho do editor no ENSPACE; na configuração do campo; na coluna do campo na lista de itens; e no plugin do ENSPACE para o Word.

**Referência visual:** protótipo `editor-de-documentos`, fase "2. Word liberado" na barra de baixo, em https://pernalombr4.github.io/prototipos/editor-de-documentos/ (rodadas 1 a 11, de 08/10/2026 a 21/10/2026). Prints em `evidencias/proto-02` a `proto-05`, `proto-08` e `proto-09`. A janela do Word no protótipo é simulação; o painel do plugin e o salvamento no item são a proposta.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre aspas são os da interface em português. Este documento parte da entrega 1 (`REQUISITOS-CAMPO.md`), já pronta; o que ele muda na entrega 1 está em RT102. Os exemplos usam os contratos do protótipo (CTR-0139 com Bruno no Word, CTR-0135 com Ana no ENSPACE, CTR-0142 livre).

**Fora do escopo:** tudo o que a entrega 1 cobre (campo, editor no ENSPACE, versões, editor de modelos); a coautoria entre o Word e o ONLYOFFICE ao mesmo tempo; o Word para a web pelo programa de parceiros da Microsoft (CSPP), porque o programa obriga o Office como editor padrão no lugar do ONLYOFFICE.

## Resumo

| Grupo | O que muda em relação à entrega 1 | Requisitos |
|---|---|---|
| Liberação | O selo "Em breve" sai e as opções do Word passam a funcionar | RF101 a RF103, RF154 |
| O que o cartão oferece | Tabela de decisão do botão principal e da seta em cada situação | RF155 |
| Escolha do editor | Pergunta "Onde você quer abrir?" na primeira vez, com "Lembrar minha escolha" | RF104 a RF110, RF152, RF156 a RF158 |
| Word instalado | O Word do computador abre o arquivo do item; Salvar grava no item; fechar libera | RF111 a RF117, RF151, RF159 |
| Reserva e concorrência | O documento fica reservado para quem abriu no Word; os outros leem e podem pedir aviso | RF118 a RF127, RF160, RF161, RF165 |
| Word não abriu | Baixar e enviar a nova versão, lado a lado | RF128 a RF132, RF162, RF163 |
| Plugin do Word | Aba "Documento" no painel do plugin, com o vínculo ao item e "Salvar no ENSPACE" | RF133 a RF141 |
| Word para a web | Opção com cópia temporária no OneDrive de quem edita | RF142 a RF145, RF164 |
| Configuração do campo | As chaves do Word e o editor padrão passam a funcionar | RF146 a RF149, RF153 |
| Lista de itens | Cadeado na célula do documento reservado no Word | RF150 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN101 | Um documento só pode estar aberto no Word por 1 pessoa por vez. | Com Bruno no Word, Carla não consegue abrir no Word. |
| RN102 | Enquanto um documento está reservado no Word, as outras pessoas só podem ler o documento. | Carla abre o documento de Bruno só para leitura. |
| RN103 | Um documento só pode ser aberto no Word enquanto está livre de edição no ENSPACE. | Com Ana no ONLYOFFICE, "Abrir no Word" fica desabilitado. |
| RN104 | Cada Salvar com mudança feito no Word cria uma versão com a origem "Editada no Word"; essa origem se soma às da RN002 da entrega 1. | 3 Salvar com mudança criam 3 versões; um Salvar sem mudança não cria versão. |
| RN105 | A reserva do documento termina quando a pessoa fecha o documento no Word, clica em "Concluir e liberar" no plugin, envia a nova versão pela janela "Abrir no Word" ("O Word não abriu?"), clica em "Liberar sem salvar", ou quando a reserva expira (RNF102). | Fechar o Word libera o documento para os outros. |
| RN106 | A escolha de editor vale por pessoa e por campo. | Carla escolhe Word no campo Minuta; no campo Aditivo, a pergunta aparece de novo. |
| RN107 | Um Salvar do Word não pode sobrescrever uma versão criada depois da abertura no Word. | A reserva de Carla expirou, Ana editou no ENSPACE, e o Salvar de Carla não apaga a versão de Ana (P112). |
| RN108 (removido) | A tabela de decisão do cartão descreve tela e virou o RF155. | |

## Liberação (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF101 | O selo "Em breve" deve sair das opções do Word no menu da seta, no cabeçalho do editor e na configuração do campo (RT102). | Nenhuma opção do Word aparece com "Em breve". | Essencial |
| RF102 | As opções do Word ligadas na configuração do campo (RF146) devem aparecer habilitadas na seta do cartão, conforme RF155. | Com o Word ligado, "Abrir no Word" pode ser escolhido. | Essencial |
| RF103 | No cabeçalho do editor, o botão "Abrir no Word" deve aparecer só com o Word ligado na configuração, fora do modo leitura e sem outra pessoa no documento. | Com Ana no CTR-0135, o botão não aparece. | Importante |
| RF154 | O botão "Abrir no Word" do cabeçalho deve concluir a edição (RF033 da entrega 1) e abrir o documento no Word instalado (RF111). | Com mudança, aparece "Versão <N> salva" antes de a janela "Abrir no Word" abrir. | Importante |

## O que o cartão oferece (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF155 | O botão principal e a seta do cartão devem seguir a tabela abaixo. Política: Primeira (vale a 1ª linha que casa). | No CTR-0139 (linha 4), Carla vê "Ler" e "Avisar quando liberar", sem seta. | Essencial |

| Linha | Tipo do arquivo | Situação | Botão principal | Seta |
|---|---|---|---|---|
| 1 | PDF | qualquer uma | "Ler" | sem seta |
| 2 | DOCX | perfil sem edição, ou Editar desligado na configuração (P111) | "Ler" | sem seta |
| 3 | DOCX | a própria pessoa está com o documento no Word | "Voltar ao Word" e "Liberar sem salvar" | sem seta |
| 4 | DOCX | outra pessoa está com o documento no Word | "Ler" e "Avisar quando liberar" | sem seta (RN101) |
| 5 | DOCX | outra pessoa está no documento no ENSPACE | "Editar junto" | opções do Word desabilitadas (RN103) |
| 6 | DOCX | livre, com 1 editor ligado na configuração | "Abrir no <editor>" | sem seta (RF152) |
| 7 | DOCX | livre, com 2 ou mais editores ligados | "Abrir no <editor escolhido>", ou "Abrir" sem escolha nem padrão | editores ligados, habilitados |

## Escolha do editor (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF104 | No primeiro Abrir de quem ainda não escolheu, o sistema deve mostrar a pergunta "Onde você quer abrir?" com "Os dois editores trabalham no mesmo arquivo. O que você salvar volta para este item.". | A pergunta não aparece de novo depois de lembrada (RF107). | Essencial |
| RF105 | A pergunta deve ter as opções "No ENSPACE" ("Abre aqui, no navegador, com o ONLYOFFICE. Salva sozinho e mostra quem está editando.") e "No Microsoft Word" ("Abre no Word do seu computador, direto do item. O Salvar do Word grava aqui, e o documento fica reservado para você."). | Só aparecem as opções ligadas na configuração (RF146). | Essencial |
| RF156 | Cada opção deve ter a linha de apoio: "Bom para revisões rápidas e para editar junto" no ENSPACE e "Bom para documentos longos e formatação fina" no Word. | As 2 linhas aparecem abaixo das descrições. | Desejável |
| RF158 | A pergunta deve abrir com o editor padrão da configuração (RF148) já marcado e ter o botão "Abrir" no rodapé. | Com o padrão "Microsoft Word", a opção do Word vem marcada. | Importante |
| RF106 | Quando a pessoa escolhe "No Microsoft Word" com o Word para a web ligado, a pergunta deve mostrar "Qual Word?" com "Word instalado no computador" e "Word no navegador, com Microsoft 365". | Sem o Word para a web ligado, "Qual Word?" não aparece. | Importante |
| RF157 | As opções de "Qual Word?" devem ter as ajudas "Windows ou Mac" e "Precisa de conta Microsoft 365". | As ajudas aparecem abaixo de cada opção. | Desejável |
| RF107 | A pergunta deve ter "Lembrar minha escolha", marcado por padrão, com "Você troca quando quiser, pela seta ao lado do botão Abrir." (RN106). | Com a escolha lembrada, o próximo Abrir vai direto ao editor e o botão diz o nome dele. | Essencial |
| RF108 | Quando a pessoa escolhe um editor pela seta do cartão, o sistema deve abrir nesse editor e passar a usar esse editor no botão principal. | Escolher "Abrir no Word" pela seta faz o botão dizer "Abrir no Word". | Importante |
| RF109 | Com uma escolha lembrada, a seta deve ter a opção "Onde você quer abrir?", que limpa a escolha e mostra a pergunta. | A pergunta volta sem passar pela configuração. | Desejável |
| RF110 | Sem escolha da pessoa, o botão principal deve usar o editor padrão da configuração (RF148). | Com o padrão "Microsoft Word", o botão diz "Abrir no Word" para quem ainda não escolheu. | Importante |
| RF152 | Com 1 editor só ligado na configuração, o botão principal deve abrir nesse editor, sem a pergunta e sem a seta (RF155, linha 6). | Com só o ONLYOFFICE ligado, o botão diz "Abrir no ENSPACE" e não há seta. | Importante |

## Word instalado (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF111 | "Abrir no Word" deve abrir o Word instalado no computador da pessoa com o arquivo que está no item, sem baixar o arquivo para a pasta de Downloads. | O arquivo abre no Word sem existir antes no computador. | Essencial |
| RF112 | Ao abrir no Word, o sistema deve mostrar a janela "Abrir no Word" com os passos "Reservar para você", "Abrir no Word" e "Salvar no Word", marcados conforme concluem. | Os 3 passos ficam marcados e aparece o aviso "Documento aberto no Word". | Importante |
| RF159 | A janela "Abrir no Word" deve ter a descrição "O documento abre no Word do seu computador, direto deste item. O Salvar do Word grava aqui.". | A descrição aparece abaixo do título. | Desejável |
| RF113 | Cada passo da janela deve ter a explicação: "Enquanto você edita no Word, as outras pessoas só leem. Assim ninguém sobrescreve ninguém.", "O Word do computador abre o arquivo que está neste item. Nada é baixado." e "Cada Salvar (Ctrl+S) vira uma versão neste item. Fechou o documento, ele fica livre.". | Os textos aparecem abaixo de cada passo. | Desejável |
| RF151 | Sem o plugin instalado (S103), a janela "Abrir no Word" do Word instalado deve mostrar "Com o suplemento do ENSPACE no Word, o painel mostra a qual item o documento pertence." com o botão "Como instalar" (RT101). | Para quem não tem o plugin, a dica aparece abaixo dos passos. | Desejável |
| RF114 | Cada Salvar com mudança feito no Word deve gravar o documento no item (RN104). | Depois do Ctrl+S, o cartão mostra "Versão <N>" com a pessoa como autora, aparece o aviso "Versão <N> recebida do Word" e o histórico mostra a origem "Editada no Word". | Essencial |
| RF115 | Fechar o documento no Word deve liberar a reserva (RN105). | O cartão sai do estado "aberto no Word". | Essencial |
| RF116 (removido) | O conflito no Salvar saiu dos requisitos: quem salva pelo Ctrl+S do Word não vê tela do ENSPACE, e o protótipo não mostra esse caso. Ver P112. | | |
| RF117 | O acesso do Word ao arquivo deve valer só para aquele documento e só pelo prazo de RNF101 (quem pode usar o acesso dentro do prazo: P113). | Um endereço copiado deixa de abrir o arquivo depois do prazo. | Essencial |

## Reserva e concorrência (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF118 | Enquanto a própria pessoa está com o documento no Word, o cartão deve ter borda na cor de destaque e a faixa "Você está com este documento aberto no Word desde <hora>. Cada Salvar do Word vira uma versão aqui. Feche o documento no Word para liberar. Enquanto isso, as outras pessoas só leem.". | Com o Word aberto às 10:42, a faixa diz "desde 10:42". | Essencial |
| RF119 | No estado de RF118, o cartão deve ter os botões "Voltar ao Word" e "Liberar sem salvar" (RF155, linha 3). | Voltar ao Word abre o Word de novo com o mesmo arquivo. | Essencial |
| RF120 | Quando a pessoa clica em "Liberar sem salvar", o sistema deve tirar a reserva e mostrar "Documento liberado. As mudanças feitas no Word não foram trazidas.". | As outras pessoas voltam a poder editar. | Importante |
| RF121 | Enquanto outra pessoa está com o documento no Word, o cartão deve mostrar a faixa "<nome> está editando no Word desde <hora>. Você pode ler a versão atual. A edição volta quando o documento for liberado." (RN102). | No CTR-0139: "Bruno Lima está editando no Word desde 10:13.". | Essencial |
| RF160 | No estado de RF121, a borda do cartão e a faixa devem ficar na cor de aviso. | O cartão do CTR-0139 se distingue do cartão de quem reservou (RF118). | Importante |
| RF122 | No estado de RF121, o cartão deve ter os botões "Ler" e "Avisar quando liberar" (RF155, linha 4). | Abrir para editar não aparece; "Ler" abre o editor com o selo "Somente leitura". | Essencial |
| RF123 | Quando a pessoa clica em "Avisar quando liberar", o sistema deve registrar o pedido e mostrar "Você recebe um aviso quando <nome> liberar o documento.". | O botão fica marcado e desabilitado. | Importante |
| RF124 | Quando o documento é liberado, o sistema deve avisar cada pessoa que pediu aviso (RI105). | Carla recebe o aviso quando Bruno fecha o Word. | Importante |
| RF125 | Se a pessoa tenta abrir no Word um documento que outra pessoa está editando no ENSPACE, o sistema deve mostrar "<nome> está editando no ENSPACE agora" e "Para abrir no Word, o documento precisa estar livre. Edite junto no ENSPACE ou espere a pessoa concluir.", com o botão "Editar junto" (RN103). | Escolher Editar junto abre o ONLYOFFICE no mesmo documento. | Essencial |
| RF126 | Enquanto o documento está reservado no Word, Substituir e Remover devem ficar desabilitados para cada pessoa do item, inclusive quem reservou. | Com Bruno no Word, Substituir e Remover aparecem cinza. | Importante |
| RF165 | Enquanto o documento está reservado no Word, o histórico deve mostrar só Ver e Baixar, sem Restaurar, para cada pessoa do item. | Com Bruno no Word, Restaurar não aparece no histórico. | Importante |
| RF127 | A reserva deve expirar depois do prazo de RNF102 sem atividade do Word. | Um Word fechado sem aviso libera o documento depois do prazo. | Essencial |
| RF161 | Enquanto o Word mantém o arquivo aberto, a reserva deve ser renovada antes de expirar. | Uma edição de 2 horas no Word não perde a reserva. | Essencial |

## Word não abriu (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF128 | A janela "Abrir no Word" do Word instalado deve ter o item "O Word não abriu?", que, aberto, mostra "Baixe o arquivo, edite no Word ou onde preferir e envie de volta. O arquivo enviado vira uma nova versão deste item.". | O texto aparece ao clicar em "O Word não abriu?". | Essencial |
| RF129 | Abaixo do texto de RF128, os botões "Baixar" e "Enviar nova versão" devem ficar lado a lado. | Os 2 botões aparecem na mesma linha. | Essencial |
| RF130 | "Baixar" deve baixar o .docx da versão atual (o que acontece com a reserva: P109). | O arquivo baixado é a versão atual. | Essencial |
| RF162 | Depois de "Baixar", a janela deve mostrar "Arquivo baixado. Depois de editar, envie aqui como nova versão.". | O texto aparece abaixo dos botões. | Importante |
| RF131 | "Enviar nova versão" deve abrir o seletor de arquivos e criar, com o arquivo escolhido, a versão com a origem "Arquivo enviado". | O cartão mostra a versão nova. | Essencial |
| RF163 | Depois do envio de RF131, o sistema deve liberar a reserva e mostrar "Versão <N> enviada. O documento está livre de novo." (RN105). | O cartão sai do estado "aberto no Word". | Essencial |
| RF132 | Se o arquivo enviado em RF131 não é .docx, o sistema deve recusar o envio com "Este arquivo não pode ser usado." e "A nova versão de um documento editado no Word precisa ser .docx.". | Enviar um .pdf não cria versão. | Importante |

## Plugin do Word (RF)

O plugin do ENSPACE para o Word já tem as abas Assistentes (IA) e Templates.

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF133 | O painel do plugin deve ter a aba "Documento", antes de "Assistentes (IA)" e "Templates". | A aba aparece com o painel aberto. | Essencial |
| RF134 | Com um documento que veio de um campo, a aba Documento deve mostrar o bloco "Ligado a um item" com a referência do item, o nome do item, o rótulo do campo e "Você abriu a versão <N>". | Exemplo: "CTR-0139 · <contratante> · Minuta do contrato · Você abriu a versão <N>". | Essencial |
| RF135 | A aba Documento deve mostrar o estado do salvamento: "Mudanças ainda não salvas no item", "Versão <N> salva às <hora>" ou "Tudo salvo no item". | O estado muda ao digitar e depois de salvar. | Importante |
| RF136 | O botão "Salvar no ENSPACE" deve gravar o documento no item como versão "Editada no Word" (RN104). | O efeito é o mesmo do Ctrl+S de RF114. | Essencial |
| RF137 | Sem mudança desde o último salvamento, "Salvar no ENSPACE" deve ficar desabilitado. | O botão só acende depois de digitar. | Desejável |
| RF138 | "Concluir e liberar" deve salvar o que faltar e liberar a reserva (RN105). | O cartão sai do estado "aberto no Word". | Importante |
| RF139 | "Ver o item no ENSPACE" deve abrir o item no navegador. | No documento do CTR-0139, abre o CTR-0139. | Desejável |
| RF140 | O documento aberto no Word deve levar dentro o vínculo com o item, o campo e a versão (RI103). | Um .docx baixado por RF130 e aberto no Word mostra o bloco "Ligado a um item". | Importante |
| RF141 | Sem o plugin instalado, o Salvar do Word deve continuar gravando no item (RF114). | Quem não tem o plugin edita e salva no item. | Importante |

## Word para a web (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF142 | Com a opção ligada na configuração (RF147), "Abrir no Word para a web" deve abrir o documento no Word para a web, numa nova aba. | Escolher a opção abre uma aba nova com o documento. | Desejável |
| RF164 | A janela "Abrir no Word" do Word para a web deve mostrar "O documento abre no Word para a web, numa nova aba. Ao concluir, ele volta para este item.", "Uma cópia vai para o seu OneDrive enquanto você edita." e "Ao concluir, a cópia volta para este item como nova versão e sai do OneDrive.", sem "O Word não abriu?" e sem a dica do plugin. | Os 3 textos aparecem; o item "O Word não abriu?" não aparece. | Desejável |
| RF143 | Enquanto a pessoa edita no Word para a web, o sistema deve manter uma cópia do documento no OneDrive dela (RI104). | A cópia aparece no OneDrive da pessoa durante a edição. | Desejável |
| RF144 | Quando a pessoa conclui no Word para a web (gesto e número de versões: P114), o sistema deve trazer a cópia para o item como versão nova e apagar a cópia do OneDrive. | Nenhuma cópia fica no OneDrive depois de concluir. | Desejável |
| RF145 | A reserva (RF118 a RF127) deve valer para o Word para a web como vale para o Word instalado. | O cartão mostra a reserva igual. | Desejável |

## Configuração do campo (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF146 | O grupo "Onde o documento abre" deve ter a chave "Microsoft Word" com "O Word instalado no computador (Windows ou Mac) abre o arquivo do item. Uma pessoa edita por vez." (valor inicial: P110). | Ligar a chave habilita o Word no campo. | Essencial |
| RF147 | Abaixo da chave do Word, recuada, a chave "Word para a web" deve funcionar só com o Word ligado, com "Precisa de Microsoft 365 da empresa. Uma cópia fica no OneDrive de quem edita até concluir.". | Desligar o Word desliga o Word para a web. | Desejável |
| RF148 | O grupo deve ter "Editor padrão", em lista, com "Perguntar na primeira vez", "ENSPACE (ONLYOFFICE)" e "Microsoft Word", e a ajuda "O que o botão Abrir usa para quem ainda não escolheu.". | Um editor desligado aparece desabilitado na lista. | Importante |
| RF153 | Quando o configurador desliga o editor escolhido em "Editor padrão", o padrão deve voltar a "Perguntar na primeira vez". | Desligar "Microsoft Word" com o padrão "Microsoft Word" deixa "Perguntar na primeira vez". | Importante |
| RF149 | Se o configurador desliga os 2 editores, o sistema deve manter o ONLYOFFICE ligado. | O campo fica com pelo menos 1 editor ligado. | Importante |

## Lista de itens (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF150 | Enquanto o documento está reservado no Word, a célula do campo deve mostrar um cadeado: na cor de aviso, com o tooltip "<nome> está editando no Word desde <hora>.", quando é de outra pessoa; na cor de destaque, com "Reservado para você", quando é da própria pessoa. | Na linha do CTR-0139, o cadeado mostra "Bruno Lima está editando no Word desde <hora>.". | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI101 | Endereço que o Word usa para abrir, reservar, salvar e liberar o arquivo do item, rota <a definir> | Deve aceitar abrir o arquivo, reservar, gravar cada Salvar com mudança como versão e liberar, só para o documento do acesso e só no prazo (RF117). |
| RI102 | Link que abre o Word instalado a partir do navegador | Deve abrir o Word com o endereço de RI101, no modo de edição (`ofe`), com o caminho em até 256 caracteres. |
| RI103 | Vínculo gravado dentro do .docx | Deve guardar o item, o campo e a versão, para o plugin ler (RF134, RF140). |
| RI104 | Cópia do documento no OneDrive da pessoa (Microsoft Graph) | Deve criar a cópia ao abrir no Word para a web e trazê-la de volta ao concluir (RF143, RF144). |
| RI105 | Aviso de documento liberado | Deve chegar a cada pessoa que pediu aviso, pelo canal de P103. |
| RI106 | Envio de versão pelo plugin, rota <a definir> | Deve receber o documento inteiro e a versão de origem, e recusar com conflito quando a versão do item é mais nova (RN107). |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF101 | O acesso do Word ao arquivo (RF117) deve expirar em <a definir>. | Usar o endereço depois do prazo não abre o arquivo. | Essencial |
| RNF102 | A reserva deve expirar depois de <proposta: 30 min, sem medição> sem atividade do Word (RF127). | Fechar o Word à força libera o documento depois do prazo. | Essencial |
| RS101 | O plugin do ENSPACE deve mostrar a aba "Documento" nas versões do Word que o plugin aceita hoje (Word 2016 ou mais novo, Office 365 e Word para a web). Imposta por: compatibilidade do plugin, em Configurações › Integrações › Documentos. | Testar a aba Documento no Word para Windows, no Mac e no Word para a web. | Essencial |
| RS102 | Cada texto das telas deste documento e do painel do plugin deve existir em português, inglês e espanhol. Imposta por: padrão do ENSPACE (protótipos, regra 35). | Trocar o idioma troca os textos de cada tela. | Essencial |
| RT101 | Enquanto o plugin não está na loja da Microsoft, a instalação continua pelo manifesto, e "Como instalar" leva à página de instalação por manifesto. Critério de fim: plugin publicado na loja. | "Como instalar" abre a página do manifesto. | Importante |
| RT102 | Com a entrega 2 publicada, RF046, RF048, RF049 e RF081 da entrega 1 deixam de valer: o Word sai de "Em breve" (RF101), o botão principal segue RF155 e as chaves do Word passam a funcionar (RF146 a RF148). Critério de fim: entrega 2 em produção. | Na produção, nenhuma opção do Word aparece com "Em breve". | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Qual caminho técnico o Word usa para salvar no item? A pesquisa do protótipo recomenda um endereço de edição com reserva (WebDAV) aberto pelo link do Office (`ms-word:ofe`). | time técnico | RI101 e RI102. |
| P102 | O Word no Mac salva de volta pelo mesmo caminho? Há relato de abrir só para leitura. | time técnico, com teste | Se não salvar, o Mac usa a saída de RF128 a RF132. |
| P103 | Por qual canal chega o aviso de RF124: sino do ENSPACE, e-mail ou os 2? | produto | RI105. |
| P104 | Cada Salvar com mudança no Word cria uma versão, ou uma versão por sessão de edição? | produto | RN104 e RF114. |
| P105 | Quais são os prazos de RNF101 e RNF102? | produto e time técnico | RF117 e RF127. |
| P106 | Alguém com permissão de configuração pode liberar a reserva de outra pessoa? | produto | Um requisito novo de liberação forçada. |
| P107 | O Word para a web (RF142 a RF145) entra nesta entrega ou numa seguinte? Exige Microsoft 365 da empresa e consentimento de cada pessoa. | produto | A prioridade de RF142 a RF147 e RF164. |
| P109 | Depois de "Baixar", o documento continua reservado? A expiração por falta de atividade do Word (RF127) vale para quem está editando a cópia baixada? | produto e time técnico | RF127, RF130 e RN105. |
| P110 | Num campo novo, as chaves "Microsoft Word" e "Word para a web" nascem ligadas, como no protótipo? | produto | RF146 e RF147. |
| P111 | Com a chave Editar desligada, o Word continua disponível? A ajuda do grupo diz "No Word, quem decide é o próprio Word.", mas o protótipo só oferece "Ler". | produto | RF155, linha 2, e o texto da ajuda. |
| P112 | Quando a reserva expirou e o Word salva depois, o que a pessoa vê, e onde? | time técnico e produto | RN107 e um requisito novo no lugar de RF116. |
| P113 | O acesso do Word precisa se limitar à pessoa que abriu, dentro do prazo? Com token no endereço, quem tem o endereço abre o arquivo. | time técnico; a decisão é da redatora | RF117 e RI101. |
| P114 | Qual gesto conclui no Word para a web, e quantas versões nascem (por Salvar ou ao concluir)? A pesquisa diz que a leitura do arquivo pelo plugin no Word para a web precisa de teste. | produto e time técnico | RF144 e RN104. |
| P115 | O Word mostra o nome do ENSPACE na barra ao salvar pelo endereço de edição? A simulação mostra "Salvo no ENSPACE às <hora>", que é texto do Word e não do ENSPACE. | time técnico | Nenhum requisito: o texto da simulação não é requisito. |
| P116 | Enquanto vale o RT101 (instalação por manifesto ou implantação centralizada), o painel do plugin pode abrir sozinho com o documento? | time técnico | RF133 ganha a abertura automática enquanto vale o RT101. |
| P117 | O que a aba "Documento" mostra com o plugin sem login, ou logado num workspace diferente do item? | produto | Um requisito novo na aba Documento. |
| P118 | O que a aba "Documento" mostra com um .docx sem vínculo com item? | produto | Um requisito novo na aba Documento. |
| P119 | Depois de "Liberar sem salvar" ou "Concluir e liberar", o que acontece se a pessoa salva de novo no Word, que continua aberto? | time técnico e produto | RN101, RN105 e RF114. |
| S101 | (confirmada pela pesquisa) O painel do plugin publicado na loja da Microsoft não abre sozinho quando o documento abre: a Microsoft não permite. | time técnico | P116. |
| S102 | (decidida, rodada 1) O Word para a web pelo CSPP fica de fora: ver "Fora do escopo". | produto | Nenhum. |
| S103 | Suposição: o ENSPACE sabe se a pessoa tem o plugin instalado (por exemplo, pelo último login do plugin). Confirma: time técnico. | time técnico | Sem isso, a dica de RF151 aparece sempre. |

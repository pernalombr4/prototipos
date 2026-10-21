# Requisitos: campo Editor de Documentos e editor de modelos (entrega 1)

**Objetivo:** quem trabalha no item cria o documento com 1 clique, edita no ONLYOFFICE em tela inteira sem perder edição, vê quem editou e qual é a versão atual, e quem configura a categoria monta o modelo com variáveis e condições sem digitar marcação. O Microsoft Word aparece no campo como "Em breve".

**Onde vale:** no campo do tipo Editor de Documentos, na visão rápida do item (aberta pela lista) e na tela do item; na coluna desse campo na lista de itens; na configuração do campo (Configurações › Estrutura › Categorias › Campos); e em Templates de Documentos da categoria (Configurações › Estrutura › Categorias › <categoria> › Templates de Documentos).

**Referência visual:** protótipo `editor-de-documentos`, fase "1. Word em breve" na barra de baixo, em https://pernalombr4.github.io/prototipos/editor-de-documentos/ (rodadas 1 a 7, de 08/10/2026 a 21/10/2026). O produto de hoje está em `evidencias/develop-*`; a proposta, em `evidencias/proto-*`.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre aspas são os da interface em português.

**Fora do escopo:** editar no Microsoft Word, a reserva do documento e o plugin do Word (entrega 2, em `REQUISITOS-WORD.md`); a barra e as ferramentas do próprio ONLYOFFICE; a geração de documentos em lote.

## Resumo

| Grupo | O que muda em relação ao develop de 08/10/2026 e 21/10/2026 | Requisitos |
|---|---|---|
| Campo vazio | Hoje: botão "Subir documento", gaveta, área de upload, botão "Usar modelo" e confirmação; sem documento em branco. Depois: o campo é a área de começar, com modelo (e prévia), em branco e envio, 1 clique em cada | RF001 a RF012 |
| Documento no campo | Hoje: botão sem contorno "Abrir Documento" e chip genérico com X vermelho. Depois: cartão com miniatura, versão, autor, data e botão Abrir com seta | RF013 a RF023 |
| Editando junto | Hoje: nada indica quem está no documento. Depois: o cartão mostra quem está editando no ENSPACE | RF024 a RF025 |
| Editor no ENSPACE | Hoje: ONLYOFFICE numa gaveta sobre a gaveta do item; a edição se perde sem Ctrl+S; tela cheia do navegador; Esc fecha tudo. Depois: tela inteira com cabeçalho do ENSPACE, salvamento visível e automático, Concluir | RF026 a RF038, RF097 |
| Versões | Hoje: select "Versão 1, Versão 2". Depois: histórico com autor, data, origem, Ver, Baixar e Restaurar | RF039 a RF045 |
| Word em breve | Hoje: não existe. Depois: o Word aparece desabilitado com o selo "Em breve" | RF046 a RF049 |
| Editor de modelos | Hoje: variável copiada para a área de transferência e colada com Ctrl+V; condição e repetição como esqueleto de código reescrito à mão; sem prévia. Depois: campo inserido no cursor, condição e repetição por formulário, prévia com dados de um item e verificação | RF050 a RF079, RF098, RF099 |
| Configuração do campo | Hoje: 7 chaves soltas, todas desligadas, inclusive Editar. Depois: 3 grupos e Editar ligado | RF080 a RF086 |
| Lista de itens | Hoje: a coluna mostra o arquivo. Depois: tipo, nome, versão e quem está editando | RF087 a RF089 |
| Visão rápida | Hoje: "Alterações não salvas" desde a abertura. Depois: o aviso só com mudança nos campos | RF090 a RF093 |
| Estados | Carregando, erro e somente leitura | RF094 a RF096 |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Modelo | O template de documento da categoria, com variáveis e blocos | "Templates de Documentos" no menu; "Modelo" no editor |
| Etiqueta de campo | A variável inserida no modelo, mostrada com o nome do campo | o nome do campo, destacado |
| Bloco de condição | Trecho do modelo que só aparece quando a condição é atendida | "Mostrar somente se..." |
| Bloco de repetição | Trecho do modelo repetido para cada linha de uma lista | "Repetir para cada linha de..." |
| Marcação | O texto que o ENSPACE grava no modelo (`{{data.campo}}`, `{{IF ...}}`, `{{FOR ...}}`) | "Ver a marcação" |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN001 | Cada documento do campo deve ter um histórico de versões. | Minuta com 4 versões mostra 4 linhas no histórico. |
| RN002 | Uma versão nova é criada a cada criação do documento, conclusão de edição com mudança, envio de arquivo e restauração. | Abrir e concluir sem mudar nada não cria versão. |
| RN003 | Uma versão não pode ser apagada por restauração: restaurar cria uma versão nova com o conteúdo antigo. | Restaurar a versão 2 de um documento com 4 versões cria a versão 5. |
| RN004 | Cada versão deve registrar autor, data e hora e origem. | "Versão 3 · Diego Ramos · 06/10, 10:53 · Editada no ENSPACE". |
| RN005 | Um documento PDF não pode ser editado; só pode ser substituído. | O PDF abre só para leitura. |
| RN006 | O documento é salvo pelo editor, separado do Salvar dos campos do item. | Sair do item sem salvar não desfaz a edição do documento. |
| RN007 | A origem de uma versão é uma destas: gerada do modelo, criada em branco, arquivo enviado, editada no ENSPACE, editada no Word, restaurada. | Documento criado pelo botão Em branco nasce com a origem "Criada em branco". |

## Campo vazio (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF001 | Enquanto o campo não tem documento, o sistema deve mostrar, na área do próprio campo, o título "Nenhum documento ainda" e a frase "Comece por um modelo da categoria, por um documento em branco ou envie o seu.". | O botão "Subir documento" e a gaveta "Selecione a forma de upload" não existem mais. | Essencial |
| RF002 | O campo vazio deve oferecer os botões "Usar modelo", "Em branco" e "Enviar arquivo". | Cada botão leva ao resultado com 1 clique, sem gaveta intermediária. | Essencial |
| RF003 | Quando a pessoa arrasta um arquivo sobre o campo vazio, o sistema deve destacar a área e aceitar o arquivo ao soltar. | Soltar `contrato.docx` cria o documento. | Importante |
| RF004 | O campo vazio deve informar os formatos aceitos e o tamanho máximo do arquivo. | Exemplo: ".docx ou .pdf, até <a definir> MB. Você também pode arrastar o arquivo para cá." | Importante |
| RF005 | "Usar modelo" deve listar os modelos da categoria com o nome de cada modelo e os campos do item que cada modelo preenche. | Exemplo: "Contrato de prestação de serviços · Preenche Contratante, Objeto, Valor e Vigência". | Essencial |
| RF006 | Se a categoria não tem modelo, a lista deve mostrar "Esta categoria ainda não tem modelos.". | A lista não fica vazia sem explicação. | Importante |
| RF007 | Quando a pessoa escolhe um modelo, o sistema deve mostrar a prévia do documento preenchido com os valores dos campos do item, com esses valores destacados, e o botão "Criar documento". | A confirmação "Tem certeza que deseja gerar o documento a partir do modelo...?" não existe mais. | Essencial |
| RF008 | "Em branco" deve criar um documento .docx vazio com o nome "<rótulo do campo> <referência do item>.docx" e abrir o editor (RF026). | Exemplo: "Minuta do contrato CTR-0141.docx", versão 1, origem "Criada em branco" (RN007). | Essencial |
| RF009 | "Enviar arquivo" deve abrir o seletor de arquivos e usar o arquivo escolhido como documento do campo, sem passo de confirmação. | O botão "Usar modelo" que hoje aparece depois do envio não existe mais. | Essencial |
| RF010 | Se o arquivo enviado não é .docx nem .pdf, o sistema deve recusar o envio com "Este arquivo não pode ser usado. Envie um arquivo .docx ou .pdf.". | Nenhum documento é criado. | Essencial |
| RF011 | Enquanto o documento é gerado, criado ou enviado, o campo deve mostrar a etapa ("Gerando o documento", "Criando o documento em branco", "Enviando <nome>") com uma barra de progresso. | O campo não fica em branco durante a criação. | Importante |
| RF012 | Quando o documento fica pronto, o sistema deve mostrar o aviso "Documento criado." com a origem. | Exemplo: "Versão 1, gerada do modelo." | Importante |

## Documento no campo (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF013 | O documento deve aparecer como cartão com miniatura da primeira página e o tipo (DOCX ou PDF), nome do arquivo, versão atual, avatar e nome de quem editou por último, tempo desde a edição, tamanho e tipo. | Exemplo: "Minuta Aurora Logística.docx · Versão 4 · Ana Souza, há 2 h · 47 KB · DOCX". | Essencial |
| RF014 | Um nome de arquivo maior que a largura deve quebrar em até 2 linhas e mostrar o nome inteiro no tooltip. | O cartão não estoura a largura da visão rápida. | Importante |
| RF015 | O botão principal do cartão deve ter contorno, cor de destaque, ícone e o nome do editor: "Abrir no ENSPACE". | O botão sem contorno "Abrir Documento" de hoje não existe mais. | Essencial |
| RF016 | Ao lado do botão principal, uma seta deve abrir o menu de editores (RF047). | A seta fica colada ao botão, no mesmo grupo. | Importante |
| RF017 | Clicar na miniatura deve abrir o documento para leitura (RF035). | O editor abre com o selo "Somente leitura". | Desejável |
| RF018 | O cartão deve ter o botão "Versões" com o número de versões. | Exemplo: "Versões 4" abre o histórico (RF039). | Essencial |
| RF019 | O menu "Mais ações" do cartão deve ter: Baixar .docx, Baixar como PDF, Substituir por outro arquivo e Remover documento. | O X vermelho ao lado do baixar de hoje não existe mais. | Essencial |
| RF020 | Quando a pessoa escolhe Remover documento, o sistema deve pedir confirmação com "<nome> e as <N> versões saem deste item. O campo fica vazio.". | Cancelar mantém o documento. | Essencial |
| RF021 | Enquanto outra pessoa está editando o documento, Substituir e Remover devem ficar desabilitados. | Com Ana no documento, os 2 itens aparecem cinza. | Importante |
| RF022 | Para documento PDF, o cartão deve mostrar a faixa "PDF não se edita. Para mudar, substitua o arquivo." e o botão "Ler" no lugar de "Abrir no ENSPACE" (RN005). | O PDF não abre para edição. | Essencial |
| RF023 | O tamanho do arquivo mostrado no cartão deve continuar correto depois de cada edição. | Hoje o tamanho vira "-" depois de editar. | Importante |

## Editando junto (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF024 | Enquanto outra pessoa está com o documento aberto no ENSPACE, o cartão deve mostrar o avatar dela com indicador verde e "<nome> está editando agora". | Exemplo: "Ana Souza está editando agora". | Importante |
| RF025 | Enquanto outra pessoa está editando no ENSPACE, o botão principal deve se chamar "Editar junto" e abrir o editor no mesmo documento. | As 2 pessoas editam ao mesmo tempo. | Importante |

## Editor no ENSPACE (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF026 | O ONLYOFFICE deve abrir em tela inteira dentro do ENSPACE. | O editor ocupa a largura toda; a gaveta sobre a gaveta do item e o botão "Tela Cheia" não existem mais. | Essencial |
| RF027 | Acima do ONLYOFFICE, um cabeçalho fixo deve mostrar "Voltar ao item", o nome do arquivo e "<referência do item> · <categoria> · <rótulo do campo>". | O cabeçalho continua visível ao rolar o documento. | Essencial |
| RF028 | O sistema deve salvar a edição sem a pessoa apertar Ctrl+S. | Editar, fechar e reabrir mostra a edição. Hoje a edição se perde. | Essencial |
| RF029 | O cabeçalho deve mostrar o estado do salvamento: "Salvando" com indicador girando, e "Salvo agora" ou "Salvo há <tempo>". | O estado muda ao digitar e volta para salvo. | Essencial |
| RF030 | Se a conexão cai, o cabeçalho deve mostrar "Sem conexão. Suas mudanças ficam guardadas aqui." e salvar quando a conexão volta. | Nenhuma edição se perde por queda de rede. | Importante |
| RF031 | Quem mais está no documento deve aparecer em avatares no cabeçalho, com o tooltip "Editando agora". | Com Ana no documento, o avatar dela aparece ao lado do meu. | Importante |
| RF032 | O cabeçalho deve ter os botões Versões, Baixar (.docx e PDF) e Concluir. | Concluir é o botão de destaque. | Essencial |
| RF033 | Quando a pessoa clica em Concluir ou em Voltar ao item, o sistema deve salvar o que faltar, fechar o editor e, se houve mudança, mostrar "Versão <N> salva" (RN002). | O cartão mostra a versão nova, com a pessoa como autora. | Essencial |
| RF034 | Versões deve abrir o histórico numa coluna ao lado do documento, sem nova camada por cima. | O select "Versões" acima da barra do ONLYOFFICE não existe mais. | Importante |
| RF035 | Em modo leitura (PDF, perfil sem edição, Editar desligado na configuração ou versão antiga), o cabeçalho deve mostrar o selo "Somente leitura". | Lendo a versão 2, o selo diz "Versão 2 · Somente leitura". | Essencial |
| RF097 | Em modo leitura, o documento deve recusar digitação e colagem. | Digitar no documento aberto em leitura não muda o texto. | Essencial |
| RF036 | Esc deve fechar só o que está por cima do editor (o histórico, um menu). | Fechar o histórico com Esc mantém o editor aberto. Hoje Esc fecha o editor inteiro. | Importante |
| RF037 | O rodapé do editor deve mostrar a versão aberta, quem editou por último e "Esc fecha só o que está por cima. O editor fecha pelo Concluir.". | Exemplo: "Versão 5 · Carla Menezes, agora". | Desejável |
| RF038 | A revisão ortográfica do ONLYOFFICE deve seguir o idioma do ENSPACE da pessoa. | Com o ENSPACE em português, a revisão é em português. Hoje fica em "English (United States)". | Importante |

## Versões (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF039 | O histórico deve listar as versões da mais nova para a mais antiga, com número, selo "Atual" na mais nova, avatar e nome do autor, data e hora e a origem (RN004, RN007). | Exemplo: "Versão 3 · Diego Ramos · 06 de out., 10:53 · Editada no ENSPACE". | Essencial |
| RF040 | Cada versão deve ter os botões Ver e Baixar. | Ver abre a versão em leitura (RF035). | Essencial |
| RF041 | Cada versão que não é a atual deve ter o botão Restaurar. | A versão atual não tem Restaurar. | Importante |
| RF042 | Quando a pessoa clica em Restaurar, o sistema deve pedir confirmação com "O conteúdo da versão <N> vira a versão <N+1>. Nenhuma versão é apagada." (RN003). | Confirmar cria a versão com a origem "Restaurada da versão <N>". | Importante |
| RF043 | Restaurar deve ficar indisponível enquanto outra pessoa está com o documento aberto. | Com Ana editando, Restaurar não aparece. | Importante |
| RF044 | Restaurar deve ficar indisponível para quem só pode ler o item. | O perfil somente leitura vê Ver e Baixar. | Essencial |
| RF045 | O histórico deve abrir também pelo botão Versões do cartão, numa gaveta lateral. | O cartão e o editor mostram o mesmo histórico. | Importante |

## Word em breve (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF046 | O botão principal do cartão deve abrir direto no ONLYOFFICE, sem perguntar onde abrir. | O botão diz "Abrir no ENSPACE". | Essencial |
| RF047 | O menu da seta do cartão deve listar "Abrir no ENSPACE" ("ONLYOFFICE, aqui no navegador"), "Abrir no Word" ("Word instalado no computador") e "Abrir no Word para a web" ("Word no navegador, com Microsoft 365"). | As 3 opções aparecem com ícone e descrição. | Importante |
| RF048 | No menu da seta, "Abrir no Word" e "Abrir no Word para a web" devem ficar desabilitados, com o selo "Em breve". | Clicar numa opção do Word não faz nada. | Importante |
| RF049 | No cabeçalho do editor, o botão "Abrir no Word" deve aparecer desabilitado, com o selo "Em breve" e o tooltip "A edição no Microsoft Word estará disponível em breve.". | O botão não abre nada. | Desejável |

## Editor de modelos (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF050 | O editor de modelos deve abrir em tela inteira, com um cabeçalho que mostra "Voltar", o nome do modelo e "Modelo da categoria <categoria>". | O título "The Enlighten Co." de hoje não existe mais. | Essencial |
| RF051 | O cabeçalho deve ter um seletor para trocar de modelo sem fechar o editor. | Trocar de "Contrato de prestação de serviços" para "Termo aditivo de prazo" carrega o outro modelo. | Desejável |
| RF052 | Quando a pessoa cria um modelo em branco, o sistema deve abrir o documento direto no editor, com a fonte padrão do ENSPACE. | O pedido "Choose TXT options" e a fonte Courier New 10 de hoje não aparecem. | Essencial |
| RF053 | O editor deve ter uma lateral com as abas "Campos", "Condição" e "Repetição". | A lateral fica visível ao lado do documento, sem cobrir a página. | Essencial |
| RF054 | O editor deve abrir também pelo botão "Editar modelos" da lista "Usar modelo" do campo e da configuração do campo, para quem pode configurar a categoria. | Os 2 botões abrem o mesmo editor. | Desejável |
| RF055 | Quando a pessoa clica em Concluir ou em Voltar, o sistema deve salvar o modelo e mostrar "Modelo salvo". | Reabrir o modelo mostra a última edição. | Essencial |

### Campos (variáveis)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF056 | A aba Campos deve listar os campos da categoria e, em outro grupo, a Referência, a data de criação e o E-mail do requisitante do item. | Os grupos se chamam "Campos da categoria" e "Dados do item". | Essencial |
| RF057 | Cada campo da lista deve aparecer 1 vez, com o ícone do tipo, o nome e um exemplo de valor tirado do item da prévia. | Exemplo: "Valor · R$ 184.500,00". Hoje cada campo aparece 2 vezes, "Formatado" e "Não formatado". | Essencial |
| RF058 | A aba Campos deve ter uma busca por nome de campo. | Digitar "vig" deixa só "Vigência (meses)". | Importante |
| RF059 | Se a busca não encontra campo, a lista deve mostrar "Nenhum campo encontrado.". | A lista não fica vazia sem explicação. | Desejável |
| RF060 | A aba Campos deve ter a chave "Inserir com formatação", ligada por padrão, com a ajuda "Com formatação, o valor sai como R$ 184.500,00 e 10/11/2026. Sem formatação, sai como 184500 e 2026-11-10.". | Com a chave desligada, o campo entra como "Valor (valor original)". | Importante |
| RF061 | Quando a pessoa clica num campo da lista, o sistema deve inserir o campo no documento, na posição do cursor. | O campo entra no ponto clicado, sem Ctrl+V. Hoje o campo vai para a área de transferência. | Essencial |
| RF062 | O campo inserido deve aparecer no documento como etiqueta com o nome do campo, sem a marcação. | Aparece "Contratante" destacado, não `{{data.contratante_formatted}}`. | Essencial |
| RF063 | A etiqueta deve se comportar como uma peça só: apagar remove a etiqueta inteira, e o texto dela não pode ser editado por dentro. | Backspace sobre a etiqueta apaga a etiqueta toda. | Importante |
| RF064 | Se o cursor não está no documento, o campo deve entrar no fim do último parágrafo. | Inserir sem clicar antes no documento não perde o campo. | Desejável |

### Condição

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF065 | A aba Condição deve montar a condição com 3 escolhas: Campo, Condição e Valor. | Nenhuma escolha exige digitar a referência técnica do campo. | Essencial |
| RF066 | A lista de condições deve depender do tipo do campo: "é igual a" e "é diferente de" para texto, opção e pessoa; também "é maior que", "é menor que", "é maior ou igual a" e "é menor ou igual a" para número e moeda. | Escolher "Status" mostra só "é igual a" e "é diferente de". | Essencial |
| RF067 | O Valor deve ser escolhido na lista de opções quando o campo é de opção ou de pessoa, e digitado com máscara quando é número ou moeda. | Status mostra "Rascunho, Em revisão, Aguardando assinatura, Assinado". | Essencial |
| RF068 | O botão "Adicionar condição" deve acrescentar outra linha de Campo, Condição e Valor. | Clicar 1 vez deixa 2 linhas. | Importante |
| RF098 | Com 2 ou mais linhas, o seletor "Precisa valer" deve oferecer "Todas as condições" e "Qualquer uma das condições". | Com 2 linhas e "Todas as condições", o trecho só aparece quando as 2 valem. | Importante |
| RF069 | A aba deve mostrar a frase da condição em português. | Exemplo: "O trecho aparece quando Valor é maior que R$ 100.000,00.". | Essencial |
| RF070 | "Inserir condição" deve criar no documento um bloco emoldurado com o cabeçalho "Mostrar somente se <frase>" e o rodapé "Fim da condição". | O esqueleto `{{}}{{IF variavel === 'valor'}} conteúdo {{END-IF}}` de hoje não aparece no documento. | Essencial |
| RF071 | Se há texto selecionado no documento, o texto deve passar para dentro do bloco de condição. | Selecionar a cláusula 4 e inserir a condição deixa a cláusula dentro do bloco. | Importante |
| RF072 | Clicar no cabeçalho de um bloco de condição deve abrir a condição na aba Condição, com o botão "Atualizar condição". | Mudar o valor e atualizar troca o cabeçalho do bloco. | Importante |

### Repetição

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF073 | A aba Repetição deve escolher uma lista da categoria (campo Repetidor) e as informações de cada linha que entram no texto. | Escolher "Parcelas" mostra "Número, Vencimento, Valor da parcela". | Essencial |
| RF074 | Se a lista de informações marcadas fica vazia, a aba deve mostrar "Escolha ao menos 1 informação." e desabilitar "Inserir repetição". | O bloco não nasce vazio. | Importante |
| RF075 | "Inserir repetição" deve criar um bloco emoldurado com o cabeçalho "Repetir para cada linha de <lista>", as informações escolhidas e o rodapé "Fim da repetição". | O esqueleto `{{FOR item IN variavel}}` de hoje não aparece no documento. | Essencial |
| RF076 | Enquanto o cursor está dentro de um bloco de repetição, a aba Campos deve mostrar as informações daquela lista no topo, para inserir. | Com o cursor no bloco de Parcelas, "Vencimento" aparece para inserir. | Importante |

### Prévia, marcação e verificação

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF077 | O cabeçalho deve ter os botões "Editar" e "Prévia", que alternam o documento entre edição e prévia. | Voltar de Prévia para Editar mostra o modelo como estava. | Essencial |
| RF099 | A prévia deve mostrar o modelo com os valores dos campos do item escolhido em "Prévia com os dados de", com as condições avaliadas e as repetições feitas. | Na prévia do CTR-0142 (R$ 184.500,00), a cláusula com a condição "Valor é maior que R$ 100.000,00" aparece; no CTR-0141 (R$ 62.000,00), não aparece. Hoje não existe prévia. | Essencial |
| RF078 | "Ver a marcação" deve mostrar, abaixo do documento, a marcação que o ENSPACE grava, com "O editor gera a marcação. Não é necessário digitá-la.". | A marcação mostra `{{data.valor_formatted}}`, `{{}}{{IF data.valor > 100000}}` e `{{END-IF}}`. | Desejável |
| RF079 | Se o documento tem uma marcação digitada à mão que o ENSPACE não reconhece, o rodapé do editor deve mostrar "<N> marcação digitada à mão não foi reconhecida." e "Não reconhecida: <marcação>. Insira o campo pela aba Campos."; sem marcação desconhecida, o rodapé mostra "Todas as marcações são válidas.". | Digitar `{{data.cliente}}` mostra o aviso. | Importante |

## Configuração do campo (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF080 | As configurações específicas do campo devem ficar em 3 grupos: "Onde o documento abre", "Como o documento nasce" e "O que se faz no editor". | As 7 chaves soltas de hoje ficam distribuídas nos grupos. | Importante |
| RF081 | O grupo "Onde o documento abre" deve mostrar a chave "ENSPACE (ONLYOFFICE)" ligada e as chaves "Microsoft Word" e "Word para a web" desabilitadas, com o selo "Em breve". | As chaves do Word não podem ser ligadas. | Importante |
| RF082 | O grupo "Como o documento nasce" deve ter as chaves Modelos da categoria (com o número de modelos), Documento em branco, Enviar arquivo .docx e Enviar arquivo .pdf. | Desligar "Documento em branco" tira o botão Em branco do campo vazio (RF002). | Essencial |
| RF083 | O grupo "O que se faz no editor" deve ter as chaves Editar, Comentar, Acompanhar mudanças, Revisão, Mostrar painel de revisão e Chat. | "Mostrar painel de revisão" fica desabilitada com Revisão desligada. | Importante |
| RF084 | A chave Editar deve nascer ligada num campo novo. | Hoje nasce desligada. | Essencial |
| RF085 | A pré-visualização do campo deve mostrar o campo vazio (RF001) e mudar conforme as chaves. | Desligar "Enviar arquivo .pdf" tira ".pdf" do texto dos formatos. | Desejável |
| RF086 | Abrir a configuração do campo não deve mostrar "Ocorreu um erro ao carregar os campos aninhados". | Hoje o erro aparece até clicar em Recarregar. | Importante |

## Lista de itens (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF087 | A célula do campo deve mostrar a miniatura com o tipo, o nome do arquivo (cortado com reticências, nome inteiro no tooltip) e "v<N>". | Exemplo: "Minuta Aurora Logística.docx v4". | Importante |
| RF088 | Sem documento, a célula deve mostrar "Sem documento". | A célula não fica vazia. | Desejável |
| RF089 | Enquanto alguém está editando o documento no ENSPACE, a célula deve mostrar o ícone de pessoas, com o nome no tooltip. | O ícone aparece na linha do CTR-0135 com Ana editando. | Desejável |

## Visão rápida (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF090 | O aviso "Alterações não salvas" do rodapé deve aparecer só quando um campo do formulário muda. | Abrir o item sem mexer não mostra o aviso. | Importante |
| RF091 | O botão Salvar do item deve ficar desabilitado enquanto os campos do formulário estão iguais aos salvos. | Editar só o documento não habilita o Salvar (RN006). | Importante |
| RF092 | Sair do item com "Sair sem salvar" deve manter a edição do documento (RN006). | A versão nova continua no cartão. | Essencial |
| RF093 | Trocar de item pelas setas da visão rápida deve mostrar o campo do item novo sem estado do anterior. | Uma criação em andamento num item não aparece no próximo. | Importante |

## Estados (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF094 | Enquanto o documento carrega, o campo deve mostrar o esqueleto do cartão. | O campo não fica em branco. | Importante |
| RF095 | Se o documento não carrega, o campo deve mostrar "Não foi possível carregar o documento. O arquivo continua guardado. Tente de novo em alguns segundos." com o botão "Tentar de novo". | Tentar de novo carrega o campo de novo. | Importante |
| RF096 | Para quem só pode ler o item, o cartão deve mostrar Ler no lugar de Abrir e esconder Substituir, Remover e Restaurar. | Nenhuma ação de edição aparece. | Essencial |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI001 | Histórico de versões do documento do campo, rota <a definir> | Deve devolver, por versão: número, autor, data e hora e origem (RN004). |
| RI002 | Restaurar uma versão, rota <a definir> | Deve receber o número da versão e devolver a versão nova criada (RN003). |
| RI003 | Retorno do ONLYOFFICE sobre quem está no documento (callback do servidor de documentos) | Deve informar ao ENSPACE quem entrou e quem saiu do documento, para RF024 e RF031. |
| RI004 | Geração da prévia do modelo com os dados de um item, rota <a definir> | Deve receber o modelo e o item e devolver o documento montado, sem gravar no item. |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF001 | O estado "Salvando" deve virar "Salvo agora" em até <proposta: 2 s, sem medição> depois de a pessoa parar de digitar. | Medir no develop com um documento de 5 páginas. | Importante |
| RNF002 | Os textos, selos e etiquetas do campo, do editor e do editor de modelos devem atender à WCAG 2.2 AA (critério 1.4.3, contraste) nos temas claro e escuro. | Conferir o contraste de "Em breve", das etiquetas de campo e do texto dos formatos aceitos. | Importante |
| RS001 | Cada texto das telas deste documento deve existir em português, inglês e espanhol. Imposta por: padrão do ENSPACE (protótipos, regra 35). | Trocar o idioma troca todos os textos. | Essencial |
| RS002 | A marcação gravada no modelo deve continuar no formato de hoje (`{{data.<campo>}}`, `{{data.<campo>_formatted}}`, `{{IF ...}}`, `{{END-IF}}`, `{{FOR ... IN ...}}`, `{{END-FOR ...}}`). Imposta por: protótipo, rodada 7 (compatibilidade com os modelos existentes). | Um modelo criado antes da mudança abre no editor novo com as etiquetas e os blocos. | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | Qual é o tamanho máximo do arquivo enviado? O protótipo mostra 50 MB sem base. | produto e time técnico | O texto de RF004. |
| P2 | Remover o documento apaga também as versões ou as guarda? | produto | O texto de confirmação de RF020. |
| P3 | Quantas versões o ENSPACE guarda por documento, e por quanto tempo? | produto | RF039 e o armazenamento. |
| P4 | Quem gera a miniatura da primeira página (RF013): o ONLYOFFICE ou outro serviço? | time técnico | Como RF013 se implementa. |
| P5 | Um modelo existente com marcação escrita à mão fora do padrão abre como etiqueta, como bloco ou como texto com o aviso de RF079? | time técnico | RS002 e RF079. |
| P6 | Quem pode abrir o editor de modelos pelo campo (RF054): só quem configura a categoria? | produto | A regra de exibição do botão "Editar modelos". |
| P7 | A condição com "Todas as condições" e "Qualquer uma das condições" na mesma condição (mistura de E e OU) é necessária? O protótipo usa 1 conector por condição. | produto | RF068. |
| S1 | Suposição: o campo Saída do modelo continua como hoje, com a sugestão de campos ao digitar `{{`. Confirma: produto. No develop, `Contrato_{{` virou `Contrato {{reference}}` (o sublinhado sumiu). | produto | Um requisito novo para a Saída. |
| S2 | Suposição: a presença de quem edita (RF024, RF031) vem do ONLYOFFICE, que já tem coedição. Confirma: time técnico. | time técnico | RI003. |

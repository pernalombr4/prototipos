# 2. O campo no formulário

**Objetivo:** cada tipo de campo tem 1 controle só para escrever o valor, e ele é o mesmo no modal de criação do
registro e na aba Visão Geral do item.

**Onde vale:** o modal "Novo registro" da tela nova de itens e a aba Visão Geral da visão rápida e da tela dedicada
do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. O botão "+ Novo registro" abre o
formulário com 1 campo de cada tipo. Os parâmetros de cada tipo saem do botão "Baixar relatório (.xlsx)", na barra do
topo da tela.

## O formulário, em qualquer tipo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | Cada campo do formulário deve usar o componente de escrita de campo, com 1 controle por tipo, no modal de criação e na aba Visão Geral do item. | Exemplo: o Texto Curto tem o mesmo controle nos 2 lugares. | Essencial | Obrigatório |
| RF102 | O formulário deve dispor os campos numa grade de 2 colunas, com o tipo declarado de linha inteira (RN905) ocupando as 2. | Exemplo: numa categoria com 34 campos, Texto Curto e Número ocupam meia linha, e anexo, endereço, repetidor, matriz, conversa e editor ocupam a linha inteira. | Essencial | Obrigatório |
| RF103 | Cada campo deve ter o rótulo acima do controle, com o ícone do tipo à esquerda. | Exemplo: "Valor Monetário" aparece com o ícone de moeda. | Importante | Obrigatório |
| RF104 | O texto de ajuda abaixo do controle deve ser o que a configuração do campo define na aba Ajuda, sem frase escrita pelo formulário. | Exemplo: um campo sem ajuda configurada aparece sem nenhuma frase abaixo do controle. | Essencial | Obrigatório |
| RF105 | O texto de exemplo dentro do controle deve vir da configuração do campo (máscara e formato), e o campo sem essa configuração nasce sem texto de exemplo. | Exemplo: o CPF mostra `999.999.999-99`, e o campo de e-mail aparece vazio, sem endereço de exemplo. | Importante | Obrigatório |
| RF106 | O campo cujo valor nasce depois de o item ser salvo (Chat, Editor de Documentos e Campo virtual) deve aparecer, no modal de criação, como moldura desabilitada que diz que o valor existe depois de salvar. | Exemplo: no modal de criação, o Chat mostra a moldura com a frase, e não um compositor de mensagem vazio. | Importante | Obrigatório |
| RF107 | O campo que o sistema preenche (ID Personalizado) deve aparecer desabilitado, sem texto de exemplo que prometa digitação. | Exemplo: o controle não aceita foco e não mostra "Por favor digite". | Importante | Obrigatório |

## Texto, número e data (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF110 | O Texto Longo deve nascer com 3 linhas de altura e crescer até 6 linhas conforme o texto. | Exemplo: o campo nasce mais alto que o Texto Curto, e 3 parágrafos aparecem sem rolagem interna. | Essencial | Obrigatório |
| RF111 | O Editor de texto HTML deve mostrar o conteúdo formatado, e não a marcação. | Exemplo: o valor `<p>Laudo com <strong>ressalva</strong></p>` abre com "ressalva" em negrito. | Essencial | Obrigatório |
| RF112 | A barra do Editor de texto HTML deve ter negrito, itálico, lista, lista numerada, título e citação, mais o link entre as marcas de texto e os blocos. | Exemplo: selecionar "Laudo" e clicar no negrito grava `<strong>Laudo</strong>`. | Importante | Obrigatório |
| RF113 | Inserir link deve acontecer num quadro do produto, com endereço, texto do link, Abrir e Remover, e não numa caixa de diálogo do navegador. | Exemplo: com o cursor dentro de um link, o quadro abre com os 2 campos preenchidos; quem digita `enspace.io` recebe `https://enspace.io`. | Importante | Obrigatório |
| RF114 | O Número deve usar controle numérico, com os limites configurados no campo. | Exemplo: um campo com mínimo 0 e máximo 100 recusa 120. | Importante | Obrigatório |
| RF115 | O Valor Monetário deve ter o seletor de moeda ao lado do valor, limitado às moedas que o campo permite, e abrir na moeda padrão do campo (RN906). | Exemplo: um campo que permite BRL e USD mostra 2 opções, e não a lista de 179 moedas. | Importante | Obrigatório |
| RF116 | O seletor de moeda deve ter busca a partir de 10 opções. | Exemplo: com 2 moedas permitidas, o seletor abre sem campo de busca. | Desejável | Desejável |
| RF117 | A Duração deve usar campo de texto que aceita duração escrita, com o texto de exemplo do produto. | Exemplo: `2 semanas` é aceito, e o campo não abre calendário nenhum. | Importante | Obrigatório |

## Escolha (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF120 | Os Botões de Seleção única devem virar lista suspensa acima de 5 opções. | Exemplo: com 5 opções, os botões aparecem; com 6, aparece a lista. | Importante | Obrigatório |
| RF121 | A lista de seleção deve ter busca a partir de 10 opções. | Exemplo: com 9 opções a lista abre sem busca; com 10, com busca. | Importante | Obrigatório |
| RF122 | A Lista de Seleção Múltipla deve mostrar cada valor escolhido como selo com x dentro do controle, e a lista de opções abaixo. | Exemplo: 3 valores escolhidos aparecem como 3 selos, e o x de um deles o remove. | Importante | Obrigatório |
| RF123 | Cada opção na lista deve aparecer com o rótulo e a cor configurados nela. | Exemplo: "Em análise" aparece na cor configurada, e não o valor `em_analise`. | Importante | Obrigatório |
| RF124 | A Alternativa Binária deve usar caixa de marcar, como o formulário de hoje. | Exemplo: o controle é 1 caixa, e não uma chave de alternância. | Importante | Obrigatório |

## Campos compostos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF130 | O Pessoa/Empresa deve nascer só com o Tipo e revelar os subcampos daquele tipo, cada um com a máscara, o contador de caracteres e a marca de obrigatório da configuração. | Exemplo: Pessoa Física revela Nome e CPF, com máscara `999.999.999-99` e contador `0/14`; Pessoa Jurídica revela CNPJ, Razão Social e Nome Fantasia. | Essencial | Obrigatório |
| RF131 | O Pessoa/Empresa deve validar o documento e avisar quando o documento é inválido. | Exemplo: um CNPJ com dígito errado mostra "CNPJ Inválido" e não busca cadastro nenhum. | Essencial | Obrigatório |
| RF132 | Com o documento válido, o campo deve mostrar o estado de consulta, preencher a razão social e o nome fantasia com o resultado e avisar que esses valores vieram da consulta. | Exemplo: `11.222.333/0001-81` mostra o estado de consulta e depois a razão social preenchida, com o aviso ao lado. | Importante | Obrigatório |
| RF133 | O Endereço deve mostrar os subcampos do país configurado no campo. | Exemplo: com o Brasil configurado, aparecem CEP, País, Rua, Número, Complemento, Bairro, Cidade e Estado. | Importante | Obrigatório |
| RF134 | A Matriz de dados deve mostrar o Rótulo Complementar como título do bloco, as linhas em linhas e as colunas em colunas, com 1 resposta por linha. | Exemplo: marcar a segunda coluna de uma linha desmarca a primeira, e as outras linhas não mudam. | Importante | Obrigatório |
| RF135 | A Matriz de dados não deve imprimir o número da coluna abaixo da opção. | Exemplo: a grade mostra só o rótulo de cada coluna, no cabeçalho. | Importante | Obrigatório |
| RF136 | O Repetidor e o Grupo devem mostrar cada campo aninhado com o controle que o tipo dele tem no formulário. | Exemplo: um Repetidor com Texto Curto e Data dentro usa os mesmos 2 controles das colunas desses tipos. | Importante | Obrigatório |
| RF137 | O campo de anexo deve listar cada arquivo com nome, tamanho e as ações baixar, renomear, remover e reordenar, com o reordenar também por arrasto. | Exemplo: 3 arquivos listados; arrastar o terceiro para o topo muda a ordem, e o menu de cada linha traz as 4 ações. | Importante | Obrigatório |
| RF138 | O campo de relação deve mostrar o item relacionado pelo `display` e, quando o `display` está vazio, pela referência (RN904). | Exemplo: o registro sem `display` aparece como `CLIC-0042`, e não como linha em branco. | Importante | Obrigatório |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS101 | O componente de escrita do campo deve morar no `@be-enlighten/enspace-sdk-ui`, de onde o modal de criação e a aba Visão Geral o consomem. Imposta por: Mikaela, em 09/11/2026. | O pacote exporta o componente, e as 2 telas não têm controle de campo próprio. | Essencial | Obrigatório |
| RS102 | O componente de escrita não deve buscar dado, recebendo o campo e o valor por propriedade e devolvendo o valor novo por evento. Imposta por: regra dos componentes base do SDK. | O componente não faz chamada de rede. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Quem chama a consulta de cadastro pelo documento, no Pessoa/Empresa: o front ou o back? | Time de back | Define quem mostra o estado de consulta e o que o controle faz quando a consulta falha |
| P102 | A grade de 2 colunas convive com a Largura do campo, que a configuração já tem (Total 1/1). As 2 decidem a mesma coisa. | produto | Com a Largura valendo, a grade segue a configuração do campo em vez do tipo |
| P103 | O limite de caracteres de cada controle sai da configuração do campo (Validações Básicas), e não de um limite fixo por tipo. | Time de back | Com limite fixo por tipo, o contador do controle muda de origem |

# 1. A célula na tabela

**Objetivo:** cada tipo de campo aparece na tabela de itens com o mesmo desenho, vindo da família do tipo, e o valor
continua legível quando a coluna aperta.

**Onde vale:** a tabela da tela nova de itens de cada categoria (`/workspaces/<ws>/types/<categoria>`), em cada
coluna de campo.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. A tabela tem 1 coluna por tipo de campo,
e o rótulo da coluna é o nome do tipo. Os parâmetros de cada tipo saem do botão "Baixar relatório (.xlsx)", na barra
do topo da tela.

## A célula, em qualquer tipo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Cada célula de campo da tabela deve desenhar o valor com o componente de leitura de campo, no formato célula, em 1 linha de altura fixa. | Exemplo: numa categoria com 1 campo de cada tipo, as colunas usam o mesmo componente, e nenhuma linha muda de altura conforme o conteúdo. | Essencial | Obrigatório |
| RF002 | A célula deve alinhar o conteúdo conforme o alinhamento do tipo (RN905): no início para texto, no fim para número e Valor Monetário, e no centro para o campo cujo conteúdo é um alvo e não um valor. | Exemplo: a coluna de Número alinha à direita; a de Anotações centraliza o ícone, com desvio zero do centro da célula. | Essencial | Obrigatório |
| RF003 | A coluna de alinhamento no centro deve centralizar também o rótulo do cabeçalho. | Exemplo: o cabeçalho "Chat" fica sobre o ícone, e não à esquerda da coluna. | Importante | Obrigatório |
| RF004 | Número e Valor Monetário devem sair com dígitos de largura fixa. | Exemplo: `1.234,56` e `98,70` em linhas seguidas têm as vírgulas na mesma coluna de pixels. | Importante | Obrigatório |
| RF005 | A célula de um campo sem valor deve ficar em branco, com o rótulo "Vazio" só para leitor de tela (RN903). | Exemplo: a coluna de Texto Curto do item sem valor não mostra hífen, "null" nem "-". | Essencial | Obrigatório |
| RF006 | Quando o valor não cabe na largura da coluna, a célula deve cortá-lo com reticências e mostrar o valor inteiro no balão do passar o mouse. | Exemplo: um Texto Curto de 90 caracteres numa coluna de 200 px termina em reticências, e o balão traz o texto inteiro. | Essencial | Obrigatório |
| RF007 | O conteúdo da célula deve caber na largura da coluna e manter a altura da linha, de 96 px até a largura que a pessoa abrir. | Exemplo: apertando cada uma das colunas até o mínimo, nada invade a coluna vizinha e a linha continua com a mesma altura. | Essencial | Obrigatório |
| RF008 | A largura inicial de cada coluna de campo deve ser a largura mínima do tipo (RN905). | Exemplo: a coluna de Valor Monetário abre com 160 px e a de Texto Curto com 200 px. | Importante | Obrigatório |
| RF009 | A tabela deve aceitar a largura mínima por coluna e recusar largura menor que 96 px. | Exemplo: arrastando a coluna de Tags para além do limite, ela para em 96 px, onde ainda cabem 1 selo cortado e o contador. | Importante | Obrigatório |

## Lista de valores na célula (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF012 | O campo que guarda lista deve mostrar os valores que couberem na largura e, no lugar dos que não couberem, 1 contador "+N". | Exemplo: Tags com 5 valores em 240 px mostra `urgente`, `multa`, `concessionaria` e `+2`. | Essencial | Obrigatório |
| RF013 | O contador deve ser o último elemento a ceder espaço: primeiro sai o terceiro valor, depois o segundo, e 1 valor cortado com reticências sobrevive ao lado do contador. | Exemplo: a mesma Tags em 96 px mostra `urgen...` e `+4`, e nunca 3 selos ilegíveis sem contador. | Essencial | Obrigatório |
| RF014 | O contador deve mostrar a lista inteira no balão do passar o mouse. | Exemplo: o balão de `+2` traz os 5 valores, separados por barra. | Importante | Obrigatório |
| RF015 | Quando a largura comporta mais valores que o teto do tipo (RN905), a célula deve parar no teto. | Exemplo: Lista de Seleção Múltipla com teto 2 mostra 2 valores e `+3` numa coluna de 400 px. | Desejável | Desejável |

## O desenho de cada família (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF020 | A célula de texto rico deve mostrar o texto sem as marcas de formatação. | Exemplo: `<p>Laudo com <strong>ressalva</strong></p>` aparece como `Laudo com ressalva`. | Essencial | Obrigatório |
| RF021 | A célula de escolha deve mostrar cada valor como selo, com o rótulo e a cor da opção, e não com o valor gravado. | Exemplo: a opção gravada como `em_analise` aparece como o selo "Em análise" na cor configurada. | Essencial | Obrigatório |
| RF022 | A célula de Alternativa Binária deve mostrar 1 caixa de marcar, marcada ou vazia, centralizada, inclusive quando o campo não tem valor. | Exemplo: o item sem valor mostra a caixa vazia, e não a célula em branco. | Importante | Obrigatório |
| RF023 | A célula de data deve mostrar a data curta da localidade do campo, e cortá-la como texto quando a coluna aperta. | Exemplo: `14/09/2026` numa coluna de 96 px termina em reticências, e o balão traz a data inteira. | Importante | Obrigatório |
| RF024 | A célula de relação deve mostrar 1 selo por registro, com o `display` e, quando o `display` está vazio, com a referência em fonte monoespaçada (RN904). | Exemplo: o registro sem `display` aparece como `CLIC-0042` em fonte monoespaçada, e a célula nunca fica em branco com relação gravada. | Essencial | Obrigatório |
| RF025 | A célula de Pessoa/Empresa deve mostrar o selo do tipo (PF ou PJ), o nome de exibição e o documento mascarado. | Exemplo: `PJ · Nortelux Elétrica · 11.222.333/0001-81`. | Importante | Obrigatório |
| RF026 | A célula de anexo deve mostrar o nome do primeiro arquivo e o contador dos demais. | Exemplo: `laudo-tecnico.pdf` e `+2`. | Importante | Obrigatório |
| RF027 | A célula de campo composto (Grupo, Repetidor e Matriz de dados) deve mostrar o primeiro par "rótulo: valor" e o contador dos demais. | Exemplo: a Matriz de dados com 3 linhas respondidas mostra `Elétrica: Não conforme` e `+2`. | Importante | Obrigatório |
| RF028 | A célula de conversa (Anotações e Chat) deve mostrar, centralizado e sem texto, o ícone próprio daquele tipo. | Exemplo: Anotações mostra o bloco de notas e Chat mostra o balão, e os 2 ícones ficam no centro da coluna. | Importante | Obrigatório |
| RF029 | A célula de campo que o sistema preenche (ID Personalizado) deve mostrar o valor em fonte monoespaçada com o ícone de gerado pelo sistema, inclusive no item criado com os campos em branco. | Exemplo: `VIT-2026-0001`, com o ícone à esquerda, inclusive no item criado sem nenhum campo preenchido. | Importante | Obrigatório |
| RF030 | A célula de Valor Monetário deve mostrar o valor com o símbolo da moeda daquele valor (RN906). | Exemplo: na mesma coluna, 1 item mostra `R$ 1.234,56` e outro mostra `US$ 7.250,90`. | Essencial | Obrigatório |
| RF031 | A célula de Valor Monetário deve ter o "i" ao lado do valor, em todo valor monetário, que ao passar o mouse abre o quadro com Valor inicial, Correções acumuladas e Valor atual. | Exemplo: o valor sem correção nenhuma também tem o "i", e o quadro mostra as correções acumuladas em zero. | Essencial | Obrigatório |
| RF032 | O quadro do "i" deve ter "Mostrar Legenda", que expande dentro do mesmo quadro com os grupos Vigência do Período (Ativo, Inativo, Não Vinculado) e Status da Correção (Bem-sucedida, Erro fatal, Pendente, Falha temporária). | Exemplo: o ponteiro entra no quadro sem fechá-lo, e o clique em "Mostrar Legenda" abre os 7 textos. | Importante | Obrigatório |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS001 | O componente de leitura do campo e a função que transforma valor em texto devem morar no `@be-enlighten/enspace-sdk-ui`, de onde a tabela os consome. Imposta por: Mikaela, em 09/11/2026. | O pacote exporta os 2, e a tela de itens não tem desenho de campo próprio. | Essencial | Obrigatório |
| RS002 | O componente de leitura não deve buscar dado, recebendo o campo e o valor por propriedade. Imposta por: regra dos componentes base do SDK. | O componente não faz chamada de rede. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | A lista de períodos que o quadro do "i" mostra não pôde ser lida em develop: nenhum item tinha correção aplicada. O formato usado no protótipo é proposta. | Time de back | Define os campos de cada período que o quadro lê |
| P002 | O balão do passar o mouse carrega o valor inteiro de cada célula cortada. Em tabela com 35 colunas, isso é texto a mais no desenho de cada linha. | Time de front | Com custo alto, o balão passa a montar só na abertura |

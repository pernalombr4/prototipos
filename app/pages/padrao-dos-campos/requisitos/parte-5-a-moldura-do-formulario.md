# 5. A moldura do formulário

**Objetivo:** o formulário do registro mostra os campos em 2 colunas, cada um com o rótulo e o controle do seu tipo, e diz a verdade sobre o campo que não se preenche ali.

**Onde vale:** o componente de escrita de campo do `@be-enlighten/enspace-sdk-ui`, no modal "Novo registro" da tela nova de itens e na aba Visão Geral da visão rápida e da tela dedicada do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. O botão "+ Novo registro" abre o formulário com 1 campo de cada tipo. Os parâmetros de cada tipo saem do botão "Baixar relatório (.xlsx)", na barra do topo da tela.

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

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS101 | O componente de escrita do campo deve morar no `@be-enlighten/enspace-sdk-ui`, de onde o modal de criação e a aba Visão Geral o consomem. Imposta por: Mikaela, em 09/11/2026. | O pacote exporta o componente, e as 2 telas não têm controle de campo próprio. | Essencial | Obrigatório |
| RS102 | O componente de escrita não deve buscar dado, recebendo o campo e o valor por propriedade e devolvendo o valor novo por evento. Imposta por: regra dos componentes base do SDK. | O componente não faz chamada de rede. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P102 | A grade de 2 colunas convive com a Largura do campo, que a configuração já tem (Total 1/1). As 2 decidem a mesma coisa. | produto | Com a Largura valendo, a grade segue a configuração do campo em vez do tipo |
| P103 | O limite de caracteres de cada controle sai da configuração do campo (Validações Básicas), e não de um limite fixo por tipo. | Time de back | Com limite fixo por tipo, o contador do controle muda de origem |

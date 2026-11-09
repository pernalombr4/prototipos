# 10. O campo cru na coluna do item

**Objetivo:** quem abre um registro lê os campos da categoria na coluna de resumo, no mesmo desenho das linhas de metadado que a coluna já tem, sem abrir formulário.

**Depende de:** 1. A célula de campo: a base; 2. O desenho de cada família na célula.

**Onde vale:** o componente de leitura de campo do `@be-enlighten/enspace-sdk-ui`, no formato cru, na coluna da esquerda da visão rápida do item e na mesma coluna da tela dedicada do item (`/workspaces/<ws>/types/<categoria>/<REFERENCE>`).

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. O duplo clique numa linha abre a visão rápida, e o `»` da borda esquerda expande a coluna de resumo.

## A coluna de resumo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | A coluna de resumo do item deve mostrar os campos da categoria em leitura, abaixo dos blocos de metadado que a coluna já tem (IDENTIFICAÇÃO, ORIGEM e HISTÓRICO). | Exemplo: numa categoria com 34 campos, a coluna mostra os metadados de sistema e, em seguida, os campos da categoria. | Essencial | Obrigatório |
| RF202 | Cada campo na coluna de resumo deve aparecer como ícone do tipo, rótulo em caixa alta pequena e valor abaixo, que é o desenho das linhas de metadado de hoje. | Exemplo: a linha de Texto Curto fica igual à de CRIADO EM, trocando o rótulo e o valor. | Essencial | Obrigatório |
| RF203 | O valor na coluna de resumo deve usar o componente de leitura de campo, no formato cru. | Exemplo: a opção escolhida aparece como o mesmo selo da tabela, com a mesma cor. | Essencial | Obrigatório |
| RF204 | No formato cru, o valor deve ocupar quantas linhas precisar, em vez de cortar em 1 linha como a célula. | Exemplo: um endereço completo aparece em 3 linhas na coluna, e em 1 linha cortada na tabela. | Importante | Obrigatório |
| RF205 | O campo sem valor deve manter o rótulo visível, com o valor em branco (RN903). | Exemplo: a linha de Data sem valor mostra o rótulo e nada abaixo dele. | Importante | Obrigatório |
| RF206 | A lista no formato cru deve mostrar mais valores que a célula antes de virar contador, com o teto do tipo mais 3. | Exemplo: Tags com teto 2 mostra 5 valores na coluna e 2 mais o contador na tabela. | Desejável | Desejável |
| RF207 | O tipo que não cabe em coluna estreita (Repetidor, Chat, Editor de Documentos e Anotações) deve ficar fora da coluna de resumo e aparecer só na aba Visão Geral. | Exemplo: a coluna não mostra o Chat, e a aba Visão Geral mostra. | Importante | Obrigatório |
| RF208 | O Texto Longo no formato cru deve mostrar 3 linhas e o "Ver mais", que expande o texto na própria coluna. | Exemplo: um texto de 600 caracteres aparece em 3 linhas, e o "Ver mais" mostra o resto sem abrir outra tela. | Importante | Obrigatório |
| RF209 | O texto rico no formato cru deve aparecer formatado. | Exemplo: `<strong>ressalva</strong>` aparece em negrito na coluna, e sem as marcas na célula. | Importante | Obrigatório |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS201 | A coluna de resumo deve consumir o componente de leitura do `@be-enlighten/enspace-sdk-ui`, no formato cru, sem desenho de campo próprio. Imposta por: Mikaela, em 09/11/2026. | A visão rápida e a tela do item usam o mesmo componente da tabela, com outra propriedade de formato. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | A coluna de resumo mostra todos os campos da categoria, na ordem da configuração. Numa categoria com 34 campos, a coluna fica longa. | produto | Com um recorte, a configuração do campo passa a dizer quais campos entram no resumo |
| P202 | Os campos da categoria entram na coluna em 1 bloco só, abaixo dos metadados, ou seguem o Nome da Seção que a configuração do campo já tem? | produto | Seguindo a seção, cada seção vira 1 bloco com título, como IDENTIFICAÇÃO e HISTÓRICO |

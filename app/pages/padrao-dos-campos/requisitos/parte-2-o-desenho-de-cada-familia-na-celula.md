# 2. O desenho de cada família na célula

**Objetivo:** cada família de campo tem a sua forma na célula, e o valor de cada tipo chega legível à tabela: selo, caixa, ícone ou texto.

**Depende de:** 1. A célula de campo: a base.

**Onde vale:** o componente de leitura de campo do `@be-enlighten/enspace-sdk-ui`, no formato célula, nas colunas de texto rico, escolha, booleano, data, relação, pessoa, arquivo, composto e conversa da tabela da tela nova de itens.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. Cada coluna da tabela é 1 tipo de campo, e o rótulo da coluna é o nome do tipo. Os parâmetros de cada tipo saem do botão "Baixar relatório (.xlsx)", na barra do topo da tela.

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

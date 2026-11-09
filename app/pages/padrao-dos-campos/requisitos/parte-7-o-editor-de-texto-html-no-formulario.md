# 7. O Editor de texto HTML no formulário

**Objetivo:** quem escreve num campo de Editor de texto HTML vê o texto formatado, e não a marcação.

**Depende de:** 5. A moldura do formulário.

**Onde vale:** o campo de Editor de texto HTML, no modal "Novo registro" da tela nova de itens e na aba Visão Geral do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. Abra o campo Editor de texto HTML no formulário: o valor do mock tem negrito e lista.

## O editor (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF111 | O Editor de texto HTML deve mostrar o conteúdo formatado, e não a marcação. | Exemplo: o valor `<p>Laudo com <strong>ressalva</strong></p>` abre com "ressalva" em negrito. | Essencial | Obrigatório |
| RF112 | A barra do Editor de texto HTML deve ter negrito, itálico, lista, lista numerada, título e citação, mais o link entre as marcas de texto e os blocos. | Exemplo: selecionar "Laudo" e clicar no negrito grava `<strong>Laudo</strong>`. | Importante | Obrigatório |
| RF113 | Inserir link deve acontecer num quadro do produto, com endereço, texto do link, Abrir e Remover, e não numa caixa de diálogo do navegador. | Exemplo: com o cursor dentro de um link, o quadro abre com os 2 campos preenchidos; quem digita `enspace.io` recebe `https://enspace.io`. | Importante | Obrigatório |

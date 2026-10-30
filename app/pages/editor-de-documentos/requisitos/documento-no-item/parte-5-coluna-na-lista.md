# 5. Coluna na lista de itens

**Objetivo:** na lista de itens, a coluna do campo mostra qual documento o item tem e em que versão, sem abrir o item.

**Onde vale:** a coluna do campo Editor de Documentos na lista de itens da categoria.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", a lista de
itens atrás da visão rápida.

## Célula do campo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF087 | A célula do campo deve mostrar a miniatura com o tipo, o nome do arquivo (cortado com reticências, nome inteiro no tooltip) e "v<N>". | Exemplo: "Minuta Aurora Logística.docx v1". | Importante | Obrigatório |
| RF088 | Sem documento, a célula deve mostrar "Sem documento". | A célula do CTR-0141 não fica vazia. | Desejável | Desejável |

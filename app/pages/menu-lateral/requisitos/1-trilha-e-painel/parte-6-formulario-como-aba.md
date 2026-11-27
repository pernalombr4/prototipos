# 6. Formulário como aba na tela da categoria

**Objetivo:** o 3º nível do menu (Categoria > Formulário) sai da barra, e os formulários da categoria viram abas no
topo da tela da categoria.

**Depende de:** 5. Categorias e Favoritos.

**Onde vale:** a tela de uma categoria e a linha da categoria no menu.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, tela de qualquer categoria.

## Tela da categoria (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | Ao abrir uma categoria, o sistema deve mostrar os formulários dela como abas no topo da tela, depois da aba "Todos". | Contratos mostra Todos, Contrato de prestação, Contrato de fornecimento, Aditivo e Distrato. | Essencial | Obrigatório |
| RF502 | Cada aba de formulário deve mostrar a lista filtrada por aquele formulário, como o 3º nível do menu mostra hoje. | A aba Aditivo mostra os mesmos itens que o menu Contratos > Aditivo mostra hoje. | Essencial | Obrigatório |
| RF503 | O link de um formulário que o menu abria hoje deve abrir a tela da categoria na aba do formulário. | O endereço salvo de Contratos > Aditivo abre Contratos na aba Aditivo. | Essencial | Obrigatório |
| RF504 | No menu, cada categoria deve ser 1 linha, sem seta e sem formulários embaixo. | Na barra, Contratos é 1 linha. | Essencial | Obrigatório |
| RF505 | A categoria com 1 formulário só não deve mostrar a barra de abas. | Auditoria interna, com 1 formulário, abre sem abas. | Importante | Desejável |

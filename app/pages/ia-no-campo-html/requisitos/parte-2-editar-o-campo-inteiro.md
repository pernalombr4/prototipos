# 2. Editar o campo inteiro

**Objetivo:** sem selecionar nada, a pessoa pede ao BENI para revisar, melhorar, mudar o tom, traduzir ou encurtar o
campo inteiro, ou para escrever a partir dele.

**Depende de:** 1. Pedir ao BENI e aceitar a proposta.

**Onde vale:** a caixa do BENI aberta sem texto selecionado.

**Protótipo:** https://pernalombr4.github.io/prototipos/ia-no-campo-html/, campos "Parecer do jurídico" (preenchido)
e "Observações internas" (vazio).

## Ações sem seleção (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF013 | Sem texto selecionado, a caixa deve mostrar os grupos "Editar o campo" e "Escrever", conforme RF021. | Abrir a caixa com o cursor no campo, sem seleção, mostra os 2 grupos. | Essencial | Obrigatório |
| RF021 | Sem texto selecionado, a caixa deve mostrar "Editar o campo" ("Revisar ortografia e gramática", "Melhorar a escrita", "Mudar o tom ›", "Traduzir ›", "Encurtar") e "Escrever" ("Continuar escrevendo", "Resumir o campo", "Rascunhar com os dados do item"), nesta ordem. | A caixa sem seleção mostra as 8 ações nos 2 grupos. | Essencial | Obrigatório |
| RF022 | Quando a pessoa escolhe uma ação de "Editar o campo" sem seleção, o sistema deve aplicar a ação ao campo inteiro e mostrar a proposta riscando o campo todo. | Exemplo: "Revisar ortografia e gramática" no "Parecer do jurídico" risca os 2 parágrafos e mostra os 2 revisados; Aceitar deixa o campo só com o texto revisado. | Essencial | Obrigatório |
| RF023 | Com o campo vazio, as ações que precisam de texto ("Editar o campo", "Continuar escrevendo", "Resumir o campo") devem aparecer desativadas. | No campo "Observações internas" vazio, só "Rascunhar com os dados do item" e o pedido livre ficam ativos. | Importante | Obrigatório |

# 5. Outras entradas

**Objetivo:** a pessoa chama o BENI sem tirar a mão do teclado (Ctrl J e "/") ou pelo bloco em que está (a alça ⠿).

**Depende de:** 2. Editar o campo inteiro; 4. Pedidos salvos; o menu "/" e a alça do bloco da demanda do front do
campo.

**Onde vale:** o campo Editor de texto HTML: o atalho, o menu "/", o menu da alça do bloco e o campo vazio.

**Protótipo:** https://pernalombr4.github.io/prototipos/ia-no-campo-html/, campos "Parecer do jurídico" e
"Observações internas".

## Entradas da IA (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF003 | Quando o foco está no campo e a pessoa tecla Ctrl J, o sistema deve abrir a caixa do BENI no lugar do cursor. | Ctrl J no campo abre a caixa; o navegador não abre Downloads. | Importante | Obrigatório |
| RF005 | O menu "/" deve ter o grupo "BENI (IA)" no topo, com "Perguntar ao BENI", os pedidos salvos e as ações de "Editar o campo" e "Escrever". | Digitar "/" numa linha mostra o grupo antes de "Blocos básicos"; "/ia", "/ai" e "/beni" filtram o grupo. | Essencial | Obrigatório |
| RF006 | O menu da alça do bloco (⠿) deve ter "Perguntar ao BENI", que abre a caixa com o bloco inteiro selecionado. | Clicar em ⠿ › "Perguntar ao BENI" no 2º parágrafo seleciona o parágrafo e abre a caixa. | Importante | Obrigatório |
| RF007 | O placeholder do campo vazio deve ser "Escreva, digite "/" para comandos ou Ctrl J para o BENI...". | O campo "Observações internas" vazio mostra o texto. | Importante | Obrigatório |

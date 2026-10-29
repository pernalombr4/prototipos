# 3. O que a IA lê e anexo

**Objetivo:** a pessoa vê o que vai junto com o pedido (o trecho ou o campo, mais os campos do item), desliga os
campos do item quando não quer e anexa um arquivo como contexto.

**Depende de:** 1. Pedir ao BENI e aceitar a proposta.

**Onde vale:** o rodapé da caixa do BENI.

**Protótipo:** https://pernalombr4.github.io/prototipos/ia-no-campo-html/, campo "Parecer do jurídico".

## O que vai no pedido (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF016 | O rodapé da caixa deve mostrar o que a IA lê: "Trecho selecionado" ou "Este campo", mais "+N campos do item". | Exemplo: sem seleção, "Este campo +5 campos do item". | Importante | Obrigatório |
| RF017 | Quando a pessoa clica no indicador do que a IA lê, o sistema deve listar o campo e os campos do item lidos, com a chave "Usar os campos do item". | Desligar a chave risca os 5 campos na lista e o rodapé deixa de mostrar "+5 campos do item". | Importante | Obrigatório |
| RF018 | O rodapé da caixa deve ter o botão "Anexar arquivo", com a dica "PDF, Word, Excel, CSV ou TXT como contexto"; o arquivo anexado aparece como selo com o nome e o botão de remover. | Anexar `aditivo.pdf` mostra o selo "aditivo.pdf" no lugar do botão. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI007 | Geração da resposta do BENI | Deve receber também os campos do item, quando "Usar os campos do item" está ligado, e o arquivo anexado. | Obrigatório |

# 7. Editando junto

**Objetivo:** quem abre o item sabe quem está com o documento aberto no ENSPACE, entra para editar junto e não
substitui, remove nem restaura o documento enquanto outra pessoa edita.

**Depende de:** 2. Editor no ENSPACE; 4. Versões; 5. Coluna na lista de itens.

**Onde vale:** o cartão do documento, o cabeçalho do editor, o histórico de versões e a coluna do campo na lista de
itens.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", cenário
"Editando junto".

## Quem está editando (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF024 | Enquanto outra pessoa está com o documento aberto no ENSPACE, o cartão deve mostrar o avatar dela e "<nome> está editando agora". | No CTR-0135: "Ana Souza está editando agora". | Importante | Obrigatório |
| RF025 | Enquanto outra pessoa está editando no ENSPACE, o botão principal deve se chamar "Editar junto" e abrir o editor no mesmo documento. | As 2 pessoas editam ao mesmo tempo. | Importante | Obrigatório |
| RF031 | Quem mais está no documento deve aparecer em avatares no cabeçalho do editor, com o tooltip "Editando agora". | Com Ana no CTR-0135, o avatar dela aparece ao lado do meu. | Importante | Obrigatório |
| RF089 | Enquanto alguém está editando o documento no ENSPACE, a célula do campo na lista de itens deve mostrar o ícone de pessoas, com o nome no tooltip. | O ícone aparece na linha do CTR-0135 com Ana editando. | Desejável | Desejável |

## O que fica indisponível (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | Enquanto outra pessoa está editando o documento, Substituir e Remover do menu "Mais ações" devem ficar desabilitados. | Com Ana no CTR-0135, os 2 itens aparecem cinza. | Importante | Obrigatório |
| RF043 | Restaurar deve ficar indisponível enquanto outra pessoa está com o documento aberto, no histórico do cartão e na coluna do editor. | Com Ana no CTR-0135, Restaurar não aparece em nenhum dos 2. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI003 | Retorno do ONLYOFFICE sobre quem está no documento (callback do servidor de documentos) | Deve informar ao ENSPACE quem entrou e quem saiu do documento, para RF021, RF024, RF025, RF031, RF043 e RF089. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S2 | Suposição: a presença de quem edita (RF024, RF031) vem do ONLYOFFICE, que já tem coedição. | time técnico | RI003. |

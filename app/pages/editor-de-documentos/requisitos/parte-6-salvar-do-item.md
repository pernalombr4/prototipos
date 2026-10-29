# 6. Salvar do item

**Objetivo:** a visão rápida só pede para salvar quando um campo do formulário mudou; a edição do documento, que o
editor salva, não depende do Salvar do item.

**Depende de:** 2. Editor no ENSPACE.

**Onde vale:** o rodapé da visão rápida do item (aviso "Alterações não salvas", Salvar, "Sair sem salvar") e as setas
de troca de item.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", visão rápida
de qualquer cenário.

## Rodapé da visão rápida (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF090 | O aviso "Alterações não salvas" do rodapé deve aparecer só quando um campo do formulário muda. | Abrir o item sem mexer não mostra o aviso. | Importante | Obrigatório |
| RF091 | O botão Salvar do item deve ficar desabilitado enquanto os campos do formulário estão iguais aos salvos. | Editar só o documento não habilita o Salvar (RN006). | Importante | Obrigatório |
| RF092 | Sair do item com "Sair sem salvar" deve manter a edição do documento (RN006). | A versão nova continua no cartão. | Essencial | Obrigatório |
| RF093 | Trocar de item pelas setas da visão rápida deve mostrar o campo do item novo sem estado do anterior. | Uma criação em andamento num item não aparece no próximo. | Importante | Obrigatório |

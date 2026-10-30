# 8. Word em breve

**Objetivo:** o botão principal abre direto no ONLYOFFICE, e a seta ao lado mostra que a edição no Microsoft Word
chega em breve, sem deixar escolher o Word ainda.

**Depende de:** 1. Documento no campo; 2. Editor no ENSPACE.

**Onde vale:** o botão principal do cartão do documento, a seta ao lado dele e o cabeçalho do editor.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", cenário "DOCX,
7 versões".

## Menu de editores (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF046 | O botão principal do cartão deve abrir direto no ONLYOFFICE, sem perguntar onde abrir. | O botão diz "Abrir no ENSPACE". | Essencial | Obrigatório |
| RF016 | Ao lado do botão principal, uma seta deve abrir o menu de editores (RF047). | A seta fica colada ao botão, no mesmo grupo. | Importante | Obrigatório |
| RF047 | O menu da seta do cartão deve listar "Abrir no ENSPACE" ("ONLYOFFICE, aqui no navegador"), "Abrir no Word" ("Word instalado no computador") e "Abrir no Word para a web" ("Word no navegador, com Microsoft 365"). | As 3 opções aparecem com ícone e descrição. | Importante | Obrigatório |
| RF048 | No menu da seta, "Abrir no Word" e "Abrir no Word para a web" devem ficar desabilitados, com o selo "Em breve". | Clicar numa opção do Word não faz nada. | Importante | Obrigatório |
| RF049 | No cabeçalho do editor, o botão "Abrir no Word" deve aparecer desabilitado, com o selo "Em breve" e o tooltip "A edição no Microsoft Word estará disponível em breve.". | O botão não abre nada. | Desejável | Desejável |

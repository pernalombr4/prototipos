# 4. Versões

**Objetivo:** quem trabalha no item vê cada versão do documento com autor, data e origem, lê e baixa qualquer uma e
restaura uma versão antiga sem apagar nenhuma.

**Depende de:** 2. Editor no ENSPACE.

**Onde vale:** o botão "Versões" do cartão do documento (gaveta lateral) e o botão Versões do cabeçalho do editor
(coluna ao lado do documento).

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", cenário "DOCX,
7 versões" e estado "Só leitura".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Cada documento do campo deve ter um histórico de versões. | O CTR-0133, com 7 versões, mostra 7 linhas no histórico. | Obrigatório |
| RN003 | Uma versão não pode ser apagada por restauração: restaurar cria uma versão nova com o conteúdo antigo. | Restaurar a versão 2 de um documento com 4 versões cria a versão 5. | Obrigatório |
| RN004 | Cada versão deve registrar autor, data e hora e origem. | "Versão 3 · Diego Ramos · 06 de out., 10:53 · Editada no ENSPACE". | Obrigatório |

## Onde o histórico abre (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF018 | O cartão deve ter o botão "Versões" com o número de versões. | No CTR-0133, "Versões 7" abre o histórico (RF039). | Essencial | Obrigatório |
| RF045 | O histórico deve abrir pelo botão Versões do cartão, numa gaveta lateral. | O cartão e o editor mostram o mesmo histórico. | Importante | Obrigatório |
| RF034 | O botão Versões do editor deve abrir o histórico numa coluna ao lado do documento, sem nova camada por cima. | O select "Versões" acima da barra do ONLYOFFICE não existe mais. | Importante | Obrigatório |

## Histórico (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF039 | O histórico deve listar as versões da mais nova para a mais antiga, com número, selo "Atual" na mais nova, avatar e nome do autor, data e hora e a origem (RN004, RN007). | Exemplo: "Versão 3 · Diego Ramos · 06 de out., 10:53 · Editada no ENSPACE". | Essencial | Obrigatório |
| RF040 | Cada versão deve ter os botões Ver e Baixar, no histórico do cartão e na coluna do editor. | Ver abre a versão no editor, com o selo "Somente leitura", nos 2 lugares. | Essencial | Obrigatório |
| RF041 | Cada versão que não é a atual deve ter o botão Restaurar. | A versão atual não tem Restaurar. | Importante | Obrigatório |
| RF042 | Quando a pessoa clica em Restaurar, o sistema deve pedir confirmação com o título "Restaurar a versão <N>?" e a frase "O conteúdo da versão <N> vira a versão <número da versão atual + 1>. Nenhuma versão é apagada." (RN003). | Num documento com 4 versões, restaurar a 2 mostra "vira a versão 5"; confirmar cria a versão 5 com a origem "Restaurada da versão 2" e o aviso "Versão 2 restaurada como versão 5". | Importante | Obrigatório |
| RF044 | Restaurar deve ficar indisponível para quem só pode ler o item e com a chave Editar desligada na configuração. | O perfil somente leitura vê Ver e Baixar. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P3 | Quantas versões o ENSPACE guarda por documento, e por quanto tempo? | produto | RF039 e o armazenamento. |

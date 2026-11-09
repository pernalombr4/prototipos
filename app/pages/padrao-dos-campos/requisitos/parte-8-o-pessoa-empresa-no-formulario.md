# 8. O Pessoa/Empresa no formulário

**Objetivo:** quem preenche um Pessoa/Empresa escolhe o tipo, recebe os subcampos daquele tipo e tem o documento validado e consultado.

**Depende de:** 5. A moldura do formulário.

**Onde vale:** o campo de Pessoa/Empresa, no modal "Novo registro" da tela nova de itens e na aba Visão Geral do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. No formulário, escolha Pessoa Jurídica no campo Pessoa/Empresa e digite `11.222.333/0001-81`.

## O bloco de pessoa e empresa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF130 | O Pessoa/Empresa deve nascer só com o Tipo e revelar os subcampos daquele tipo, cada um com a máscara, o contador de caracteres e a marca de obrigatório da configuração. | Exemplo: Pessoa Física revela Nome e CPF, com máscara `999.999.999-99` e contador `0/14`; Pessoa Jurídica revela CNPJ, Razão Social e Nome Fantasia. | Essencial | Obrigatório |
| RF131 | O Pessoa/Empresa deve validar o documento e avisar quando o documento é inválido. | Exemplo: um CNPJ com dígito errado mostra "CNPJ Inválido" e não busca cadastro nenhum. | Essencial | Obrigatório |
| RF132 | Com o documento válido, o campo deve mostrar o estado de consulta, preencher a razão social e o nome fantasia com o resultado e avisar que esses valores vieram da consulta. | Exemplo: `11.222.333/0001-81` mostra o estado de consulta e depois a razão social preenchida, com o aviso ao lado. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Quem chama a consulta de cadastro pelo documento, no Pessoa/Empresa: o front ou o back? | Time de back | Define quem mostra o estado de consulta e o que o controle faz quando a consulta falha |

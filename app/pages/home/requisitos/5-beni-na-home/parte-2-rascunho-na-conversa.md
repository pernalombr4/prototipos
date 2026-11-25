# 2. Rascunho na conversa

**Objetivo:** a pessoa descreve o que quer criar, e o BENI monta o rascunho da tarefa rápida ou do item para a pessoa
conferir antes de criar.

**Depende de:** 1. Conversa flutuante com o agente; o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** "Pedir ao BENI" do botão Criar da Home e a conversa flutuante do BENI AI.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". Abra Criar, digite
o pedido e escolha "Pedir ao BENI".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Nenhum item nem tarefa nasce da conversa sem o clique da pessoa em "Criar". | O rascunho descartado não cria nada. | Obrigatório |
| RN102 | O BENI só monta rascunho de item em categoria que a pessoa acessa e em que pode criar item. | Com o pedido "novo contrato" e sem acesso a Contratos, o BENI responde com a ajuda. | Obrigatório |

## Abrir com o pedido (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | "Pedir ao BENI" no botão Criar deve abrir a conversa flutuante com o BENI e o texto digitado como a 1ª mensagem. | Exemplo: "chamado urgente: impressora do 3º andar sem papel" aparece como mensagem da pessoa. | Essencial | Obrigatório |
| RF102 | Com o campo vazio, a conversa deve abrir com "Olá, <nome>. Eu sou o BENI.", a apresentação e as sugestões de pedido do protótipo. | Clicar numa sugestão envia a sugestão como pedido. | Importante | Obrigatório |
| RF103 | Enquanto o BENI monta o rascunho, a conversa deve mostrar "Preparando o rascunho". | O texto aparece até o cartão do rascunho chegar. | Importante | Obrigatório |

## O rascunho (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF104 | Para pedido de tarefa, o BENI deve responder com o cartão "Tarefa rápida", com Nome, Data limite, Responsável e Prioridade. | Exemplo: "tarefa para amanhã às 10h: ligar para a Atria" gera Nome "Ligar para a Atria" e Data limite amanhã 10:00. | Essencial | Obrigatório |
| RF105 | Para pedido de item, o BENI deve responder com o cartão "Item em <categoria>", com os campos da categoria que reconheceu e o formulário, quando a categoria tem 2 ou mais (RN102). | Exemplo: "reembolso de R$ 84,90: táxi" gera o rascunho em Reembolsos com Valor R$ 84,90. | Essencial | Obrigatório |
| RF106 | O cartão deve ter "Criar", "Revisar no formulário" e "Descartar". | Os 3 botões ficam no pé do cartão. | Essencial | Obrigatório |
| RF107 | "Criar" deve criar a tarefa ou o item (RN101) e trocar o cartão pela confirmação "Tarefa <número> criada." ou "Item <número> criado.", com "Abrir". | O item criado entra nos widgets da Home na hora. | Essencial | Obrigatório |
| RF108 | "Revisar no formulário" deve abrir o modal de criação do botão Criar, preenchido com o rascunho. | Mudar o nome no modal e criar grava o nome novo. | Essencial | Obrigatório |
| RF109 | "Descartar" deve deixar o cartão esmaecido, sem criar nada, com "Rascunho descartado." no lugar dos botões. | Nada nasce, e a conversa continua aberta. | Importante | Obrigatório |
| RF110 | Para pedido que o BENI não reconhece como tarefa nem como item, o BENI deve responder com a ajuda e exemplos de pedido. | Exemplo: "oi" recebe a ajuda. | Importante | Obrigatório |
| RF111 | O pé da conversa deve mostrar "O BENI pode errar. Confira o rascunho antes de criar.". | O aviso fica visível durante a conversa inteira. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | O rascunho usa a ferramenta de criar item e tarefa que o agente já tem, com uma etapa de confirmação, ou uma ferramenta nova que só monta o rascunho? | dev | RN101 |
| P102 | O pedido de categoria nova ("Montar uma categoria de Eventos") entra neste épico ou fica fora? O protótipo só mostra a sugestão. | produto | Fora do escopo do épico |

# 2. Campos da categoria

**Objetivo:** o administrador escolhe, numa camada lateral, quais campos da categoria o cargo cria, vê e atualiza,
com 1 linha por campo, ou deixa "Todos os campos", que inclui os campos criados depois.

**Depende de:** 1. Tabela de categorias.

**Onde vale:** o botão Ajustar da linha da categoria, aba Campos, e a coluna Campos da tabela.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. Em "Contratos de Clientes", clique em
Ajustar.

## Ajustar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O botão Ajustar deve abrir uma camada lateral com o nome da categoria, a frase "O que este cargo faz nos campos e formulários desta categoria." e as abas Campos e Formulários. | Ajustar em "Contratos" abre a camada sem sair da tabela. | Essencial | Obrigatório |
| RF102 | O botão Concluir deve fechar a camada e manter as alterações como pendentes. | Escolher campos e clicar em Concluir mostra "Alterada, não salva" na linha da categoria. | Essencial | Obrigatório |
| RF103 | Na categoria sem ação, a camada deve mostrar "Este cargo não acessa esta categoria. Libere uma ação na tabela para ajustar campos e formulários.". | Ajustar numa categoria sem ação mostra o aviso no lugar das caixas. | Importante | Obrigatório |

## Campos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF104 | A aba Campos deve ter a escolha entre "Todos os campos" ("Inclusive os criados depois.") e "Escolher campo a campo" ("Para esconder ou travar campos sensíveis."). | A categoria sem campo escolhido abre em "Todos os campos". | Essencial | Obrigatório |
| RF105 | "Todos os campos" deve gravar cada ação da categoria sem lista de campos. | Exemplo: com "Todos os campos" salvo em "Contratos", o campo "Multa" criado depois aparece para o cargo, sem editar o cargo. | Essencial | Obrigatório |
| RF106 | "Escolher campo a campo" deve mostrar 1 linha por campo, com o nome, o tipo do campo como a tela mostra e as caixas Criar, Ver e Atualizar. | O campo "Valor" mostra "Número" e as 3 caixas. | Essencial | Obrigatório |
| RF107 | Cada caixa de campo deve ligar ou desligar o campo na ação da categoria. | Desmarcar Ver em "Valor" e salvar esconde o campo "Valor" do cargo. | Essencial | Obrigatório |
| RF108 | A lista de campos deve ter o campo "Buscar campo", que filtra pelo nome do campo. | "val" deixa só "Valor" e "Validade". | Importante | Obrigatório |
| RF109 | Os campos do sistema (Criado em e Atualizado em) devem aparecer na lista com o tipo "Do sistema". | "Criado em" aparece com "Do sistema". | Desejável | Desejável |
| RF110 | A coluna da ação desligada na categoria deve ficar desabilitada, com a dica "Libere {ação} na categoria para escolher campos nesta coluna.". | Sem Atualizar na categoria, a coluna Atualizar fica desabilitada. | Importante | Obrigatório |
| RF111 | Marcar Atualizar num campo deve marcar e travar Ver no mesmo campo (RN901). | Marcar Atualizar em "Valor" trava Ver em "Valor". | Importante | Obrigatório |
| RF112 | Sem campo que corresponda à busca, a lista deve mostrar "Nenhum campo com esse nome.". | "xyz" mostra o aviso. | Desejável | Desejável |

## Coluna Campos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF113 | A coluna Campos da tabela deve mostrar "Todos" com "Todos os campos", "{n} de {total}" com campos escolhidos e "Nenhum" na categoria sem ação. | "Contratos" com 76 de 80 campos em Ver mostra "76 de 80". | Importante | Obrigatório |
| RF114 | O clique na coluna Campos deve abrir Ajustar na aba Campos. | O clique em "76 de 80" abre Ajustar › Campos de "Contratos". | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S101 | Na leitura, na criação e na atualização, o back já trata a ação sem lista de campos como "todos os campos". | dev do back | Se a criação ou a atualização tratarem diferente, RF105 vira trabalho de back e sai deste épico |
| P101 | O cargo gravado hoje com a lista de todos os campos abre em "Todos os campos" ou em "Escolher campo a campo"? | produto | Abrindo em "Todos os campos", salvar troca a lista pela gravação sem lista, e o campo criado depois passa a valer |

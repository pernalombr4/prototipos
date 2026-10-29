# 2. Buscar e aceitar convite

**Objetivo:** a pessoa acha o workspace pela busca e aceita ou recusa o convite pendente sem sair da tela.

**Depende de:** 1. Escolher e entrar.

**Onde vale:** a tela `/workspaces`.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces.

## Busca (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF006 | A busca deve ficar abaixo da explicação, com o placeholder "Buscar entre seus {n} workspaces", em que {n} é o número da aba "Todos". | Com 17 na aba "Todos", o placeholder diz "Buscar entre seus 17 workspaces". | Essencial | Obrigatório |
| RF007 | Com menos de 2 workspaces, a tela deve esconder a busca. | Na tela sem workspace, não há campo de busca. | Importante | Obrigatório |
| RF008 | O fim do campo deve mostrar a tecla `/` com o campo vazio e o botão "Limpar busca" com texto. | Digitar uma letra troca a tecla `/` pelo botão de limpar. | Importante | Obrigatório |
| RF010 | As teclas `/` e `Ctrl+K` (`⌘K` no Mac) devem pôr o foco na busca, com a página rolada até o topo. | Com a página rolada até o fim, `/` leva ao topo com o cursor no campo. | Desejável | Desejável |
| RF011 | Na busca, Enter deve entrar no primeiro resultado que não seja convite. | Buscar "vertice" e apertar Enter entra em Vértice Log. | Desejável | Desejável |
| RF012 | Na busca, Esc deve limpar o texto. | Apertar Esc esvazia o campo e a lista volta inteira. | Desejável | Desejável |
| RF013 | Com texto no campo, a dica dos atalhos Enter e Esc deve aparecer abaixo do campo. | Digitar uma letra mostra a dica. | Desejável | Desejável |
| RF014 | A busca deve ignorar acento e maiúscula e procurar em nome, `reference` e descrição. | "saude" acha "Aurora Saúde Homologação". | Essencial | Obrigatório |
| RF015 | Sem resultado, a tela deve mostrar "Nenhum workspace com "{termo}"", com a orientação de pedir acesso a quem administra o ENSPACE na empresa. | Buscar "xyz" mostra a mensagem. | Essencial | Obrigatório |
| RF048 | A contagem das abas deve ignorar o texto da busca. | Com 17 na aba "Todos", digitar "rh" mantém "Todos (17)". | Importante | Obrigatório |

## Convite pendente (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF016 | Cada convite pendente deve aparecer no topo como aviso, com "{quem} convidou você para {workspace}" e os botões "Aceitar convite" e "Recusar". | O convite de Lumen Contábil mostra "Rodrigo Petrone convidou você para Lumen Contábil". | Essencial | Obrigatório |
| RF017 | O convite deve aparecer também como card na lista, com borda tracejada, o selo "Convite pendente" e os botões "Aceitar" e "Recusar". | O card fica na lista com o aviso no topo. | Essencial | Obrigatório |
| RF018 | O card de convite deve responder só aos botões "Aceitar" e "Recusar". | Clicar no corpo do card de convite não faz nada. | Essencial | Obrigatório |
| RF019 | "Aceitar" deve transformar o convite em card comum. | Depois de aceitar, o card ganha "Entrar →", e clicar nele entra no workspace. | Essencial | Obrigatório |
| RF020 | "Recusar" deve tirar o workspace da tela. | O aviso e o card somem; a aba "Todos" conta 1 a menos. | Essencial | Obrigatório |
| RF021 | Enquanto houver texto na busca, os avisos de convite do topo devem sumir. | Digitar "rh" esconde o aviso de Lumen Contábil. | Importante | Obrigatório |
| RF049 | A aba "Todos" deve contar também os convites pendentes. | Com 1 convite e 16 workspaces, a aba diz "Todos (17)". | Essencial | Obrigatório |

## Convite na lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF045 | Na linha de convite, a coluna Workspace deve mostrar o selo "Convite pendente" depois do nome. | A linha de Lumen Contábil mostra o selo. | Importante | Obrigatório |
| RF046 | Na linha de convite, a coluna Descrição deve mostrar "{quem} convidou você". | A linha de Lumen Contábil mostra "Rodrigo Petrone convidou você". | Importante | Obrigatório |
| RF039 | A coluna de ações deve mostrar "Aceitar" e "Recusar" só na linha de convite. | A linha comum não tem botão "Entrar". | Importante | Obrigatório |
| RF047 | A linha de convite deve responder só aos botões "Aceitar" e "Recusar". | Clicar na linha de Lumen Contábil não entra no workspace. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P004 | A API de hoje já traz o nome de quem convidou? | dev do back-end | Se não traz, trazer o nome é obra nova nesta parte |

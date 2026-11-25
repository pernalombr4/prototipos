# 2. Editar a Home padrão

**Objetivo:** o administrador arruma a Home padrão do workspace pelo mesmo Personalizar da Home dele, e o widget que ele
acrescenta chega a cada membro.

**Depende de:** 1. Guardar a Home no workspace.

**Onde vale:** o modo de edição da Home (Personalizar), para o administrador, e a Home de cada membro.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão" e "Administrador"
em "Papel". Clique em "Personalizar" e escolha "Home padrão do workspace".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | O widget que o administrador acrescenta à Home padrão entra também na Home de quem já personalizou, no topo; a remoção e a mudança de ordem ou de tamanho na Home padrão não mexem na Home de quem personalizou. | O administrador põe Atalhos e tira Prioridade; quem personalizou ganha Atalhos e continua com Prioridade. | Obrigatório |

## Escolher qual Home editar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | Para o administrador (RN901), a barra de edição deve ter o seletor "Editando", com "Minha Home" e "Home padrão do workspace", com "Minha Home" ao entrar. | O membro não vê o seletor. | Essencial | Obrigatório |
| RF102 | Com "Home padrão do workspace" escolhida, a Home deve mostrar a Home padrão e o aviso "Você está editando a Home padrão do workspace", com o texto do protótipo. | Trocar para "Minha Home" esconde o aviso e mostra a Home do administrador. | Essencial | Obrigatório |
| RF103 | Com "Home padrão do workspace" escolhida, o catálogo deve dizer "O widget entra na Home padrão e também na Home de quem já personalizou."; com "Minha Home", "O widget entra no topo da sua Home. Ninguém mais vê a mudança.". | O texto do catálogo muda ao trocar o seletor. | Importante | Obrigatório |
| RF104 | Com "Home padrão do workspace" escolhida, a barra de edição não deve mostrar "Restaurar padrão". | Com "Minha Home", o botão "Restaurar padrão" volta. | Importante | Obrigatório |
| RF105 | "Concluir" com "Home padrão do workspace" deve salvar a Home padrão, com o toast "Home padrão do workspace salva.". | Um membro que nunca personalizou recebe a Home padrão nova na próxima carga. | Essencial | Obrigatório |
| RF106 | "Cancelar" deve descartar as mudanças nas 2 Homes desde que o administrador entrou no modo de edição. | Mudar as 2 Homes e cancelar devolve as 2 ao estado de antes. | Essencial | Obrigatório |

## Selo "Novo" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF107 | O widget que chega pela RN101 deve mostrar o selo "Novo" no cabeçalho, com a dica "O administrador adicionou este widget à Home do workspace.". | Passar o mouse no selo mostra a dica. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Quando o selo "Novo" sai: na 1ª vez que a pessoa vê o widget, depois de um número de dias ou ao entrar no modo de edição? | produto | RF107 ganha a regra de saída do selo |
| P102 | O widget que o administrador põe na Home padrão chega ao membro sem acesso ao dado dele (Spaceflow, por exemplo) com "Sem acesso" ou não chega? | produto | RN101 |

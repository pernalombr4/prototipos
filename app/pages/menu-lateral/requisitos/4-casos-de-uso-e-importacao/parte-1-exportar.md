# 1. Exportar o meu menu

**Objetivo:** quem configura o workspace baixa o arquivo do menu de hoje, que outro workspace importa.

**Onde vale:** o pé da janela "Importar".

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, "+" do Início > "Importar" > "Exportar o meu
menu".

## Exportar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O pé da janela "Importar" deve ter "Exportar o meu menu", que baixa o arquivo do menu publicado do workspace (RN904). | O arquivo baixado tem as seções, os menus, os submenus e as categorias de hoje. | Essencial | Obrigatório |
| RF002 | O arquivo deve levar o nome do workspace de origem e a data da exportação. | Abrir o arquivo mostra o workspace e a data. | Essencial | Obrigatório |
| RF003 | Se a pessoa não cumpre a RN901, "Exportar o meu menu" deve aparecer desligado, com "Só quem configura o workspace". | Membro com licença Basic: o botão aparece desligado. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Exportar o menu | Deve devolver o arquivo com formato e versão próprios (no protótipo, `enspace-caso-de-uso`, versão 1), o workspace de origem, a data, as seções, os menus, os submenus e as categorias com os campos. Formato final <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | O "Exportar" de hoje, em Configurações > Interface > Menus, passa a baixar o arquivo de RF001, ou os 2 formatos convivem? | dev | Um RF que une os 2 botões ou um requisito de transição para o arquivo antigo. |

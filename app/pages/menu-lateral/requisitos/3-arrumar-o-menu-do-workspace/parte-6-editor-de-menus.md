# 6. Editor de menus

**Objetivo:** Configurações > Interface > Menus abre a árvore inteira do menu do workspace, com as mesmas ações da
barra, para quem prefere arrumar tudo numa tela só.

**Depende de:** 3. Arrastar; 5. Criar menu e criar categoria.

**Onde vale:** Configurações > Interface > Menus.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, Configurações > Interface > Menus.

## Editor de menus (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | Configurações > Interface > Menus deve abrir o editor: uma camada com a árvore inteira do menu do workspace, em 3 níveis. | O editor mostra as seções, os menus e os submenus de cada uma. | Essencial | Obrigatório |
| RF502 | O editor deve ter "Nova seção" e "Novo menu" no topo; "Novo menu" abre a janela "Criar menu". | "Novo menu" abre a mesma janela do "+" do Início. | Essencial | Obrigatório |
| RF503 | Cada seção do editor deve ter o "+" que abre "Criar menu" dentro dela, menos Integrações (RN904). | Integrações não tem o "+". | Importante | Obrigatório |
| RF504 | O editor deve reordenar e reagrupar arrastando, com as regras de encaixe da barra e o motivo da recusa no aviso. | Arrastar Apps no editor não é possível; soltar uma categoria em Comercial mostra o motivo. | Essencial | Obrigatório |
| RF505 | O editor deve mostrar o botão de excluir só em seção e menu do workspace. | Auditoria mostra só o "+"; Conhecimento mostra "+" e excluir. | Importante | Obrigatório |
| RF506 | Editar um menu deve abrir a janela "Criar menu" preenchida, com o título "Editar <nome>". | Editar Painel de vendas abre a janela com os dados dele. | Importante | Obrigatório |
| RF507 | Uma janela aberta a partir do editor deve ficar por cima dele. | "Novo menu" a partir do editor aparece na frente. | Essencial | Obrigatório |
| RF508 | Cada mudança feita no editor deve entrar no mesmo rascunho da barra; o rodapé do editor tem "Descartar" e "Salvar". | Mover um menu no editor acende a bolinha na barra também. | Essencial | Obrigatório |
| RF509 | O "Exportar" que Configurações > Interface > Menus tem hoje deve continuar na tela. | "Exportar" baixa o arquivo do menu, como hoje. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P501 | Seção do workspace deve poder nascer aberta? Hoje Interface > Menus não tem o campo "começa aberta". | produto | Um campo novo na criação de seção. |

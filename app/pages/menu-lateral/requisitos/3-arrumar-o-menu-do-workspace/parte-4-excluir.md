# 4. Excluir

**Objetivo:** seção, menu e submenu que o workspace criou se excluem pelo menu de ações e pelo ícone da trilha, no
rascunho. O painel com widgets configurados pede confirmação.

**Depende de:** 1. Submenu e rascunho; 2. Botão direito.

**Onde vale:** o menu de ações das linhas e dos títulos de seção e o botão direito do ícone de seção na trilha.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, botão direito no ícone Comercial.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN301 | Só o que não é nativo nem de módulo se exclui (RN906). | Painel de vendas tem "Excluir menu"; Auditoria e Tarefas > Painel, não. | Obrigatório |
| RN302 | Excluir uma seção exclui os menus dela; excluir um menu leva os submenus dele para a seção. A seção que guarda um menu nativo não se exclui. | Excluir Painel de vendas deixa Metas do trimestre em Comercial. | Obrigatório |
| RN303 | Excluir um menu exclui a tela dele (RN905), depois de salvar. | Excluir "Políticas internas" e salvar apaga a tela junto. | Obrigatório |

## Excluir (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | O menu de ações de seção, menu e submenu que se excluem (RN301) deve terminar com "Excluir seção" ou "Excluir menu", em vermelho, num bloco próprio; a seção de 1 menu só, que a barra mostra como linha, usa "Excluir menu". | Botão direito em Painel de vendas termina com "Excluir menu"; em Auditoria, não há excluir. | Essencial | Obrigatório |
| RF302 | O botão direito no ícone de uma seção do workspace na trilha deve ter "Excluir seção", num bloco próprio, antes de "Personalizar navegação" e "Recolher menu". | Botão direito no ícone Comercial mostra "Excluir seção". | Essencial | Obrigatório |
| RF303 | Excluir deve ir para o rascunho, tirar o item da barra e avisar "<nome> foi excluído." ou "<nome> foi excluída."; "Descartar" devolve o item. | Excluir Comercial: o aviso aparece, e Comercial some da trilha até "Descartar". | Essencial | Obrigatório |
| RF304 | Excluir um menu do tipo Painéis, ou uma seção com um menu desse tipo, deve abrir a janela "Excluir o painel <nome>?", que diz que o painel sai com os widgets e os filtros configurados e que, depois de salvar o menu, não dá para recuperar. | Excluir Painel de vendas abre a janela; excluir Triagem de propostas sai na hora, com o aviso. | Importante | Obrigatório |
| RF305 | Quem não cumpre a RN901 deve ver "Excluir" desligado no menu de ações, com "Só quem configura o workspace". | Membro com licença Basic: "Excluir seção" aparece desligado no botão direito de Comercial. | Essencial | Obrigatório |
| RF306 | Com o épico Personalizar o meu menu no ar, a aba "Seções e menus" da janela "Personalizar" deve mostrar a lixeira no hover de cada seção do workspace que se exclui e "Excluir menu" no "⋯" de cada menu e submenu que se exclui. | Passar o mouse em Comercial mostra a lixeira; em Análise, não. | Importante | Desejável |

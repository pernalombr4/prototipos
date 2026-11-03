# 2. Menu da visualização e renomear

**Objetivo:** cada visualização tem um menu, aberto pela seta ⌄ da ativa, pelo botão direito e pelo "⋯" da lista do
"+N", com as ações que o perfil da pessoa permite; o nome se troca na própria pílula ou na linha da lista.

**Depende de:** 1. Pílulas e lista do "+N".

**Onde vale:** a pílula e a linha da lista do "+N", na tela de itens, em Tarefas Rápidas e em Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. "Perfil", na barra inferior,
troca Owner ou Full por Standard ou Viewer.

## Abrir o menu (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF018 | A pílula ativa deve mostrar uma seta ⌄ depois do nome, que abre o menu da visualização. | A seta aparece só na ativa. | Essencial | Obrigatório |
| RF019 | O botão direito em cada pílula deve abrir o menu daquela visualização, sem trocar a ativa. | Botão direito numa pílula não ativa mostra o menu dela, e a lista não muda. | Essencial | Obrigatório |
| RF071 | Cada linha da lista do "+N" deve mostrar o "⋯" do menu no hover ou no foco da linha. | Sem passar o mouse, os "⋯" não aparecem. | Essencial | Obrigatório |
| RF084 | Shift + F10 deve abrir o menu da pílula ativa. | O menu abre sem mouse. | Importante | Obrigatório |

## Itens do menu (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF020 | O 1º grupo do menu deve ter Renomear (com o atalho F2), Configurar (que abre o construtor de visualização), Duplicar e Copiar link, conforme RN004. | Standard ou Viewer não vê Renomear numa visualização de todos. | Essencial | Obrigatório |
| RF021 | O grupo "Só para mim" deve ter, nesta ordem: "Fixar no início" ou "Desafixar"; "Minimizar" ou "Mostrar o nome"; "Ocultar da barra" ou "Mostrar na barra"; "Voltar à versão de todos"; "Recuperar a ordem padrão"; e Excluir, para Standard ou Viewer numa visualização só sua (RN004). Cada item entra no menu com a parte ou o épico que o entrega. | Standard ou Viewer, numa visualização só sua, vê Excluir no grupo "Só para mim". | Essencial | Obrigatório |
| RF022 | O grupo "Para todos" deve aparecer só para Owner ou Full, com "Abrir primeiro para todos", "Aplicar minha ordem para todos" e Excluir. | Standard ou Viewer não vê o grupo. | Essencial | Obrigatório |
| RF023 | Na visualização do sistema (RN001) e na visualização marcada em "Abrir primeiro para todos", Excluir deve aparecer desligado, com a explicação no próprio item. | Em "Itens", Excluir diz que a visualização é do sistema; nenhum modal abre. | Importante | Obrigatório |
| RF024 | Excluir deve pedir confirmação num modal com o título "Excluir a visualização <nome>?" e o botão "Excluir visualização" em vermelho. | Cancelar mantém a visualização. | Essencial | Obrigatório |
| RF144 | Duplicar deve criar "<nome> (cópia)" logo depois da original, com a configuração da original e as alterações não salvas dela, e abrir a cópia. | Duplicar "Vencidos" abre "Vencidos (cópia)", na posição seguinte. | Importante | Obrigatório |
| RF145 | A cópia deve repetir o quem vê da original quando quem duplica é Owner ou Full, e ser só de quem duplica quando é Standard ou Viewer. | Standard que duplica "Vencidos" ganha uma cópia que só ele vê. | Essencial | Obrigatório |
| RF146 | O aviso de Duplicar deve ter "Renomear", que abre o campo de renomear na pílula da cópia. | "Renomear" no aviso mostra o campo com "Vencidos (cópia)" selecionado. | Desejável | Desejável |
| RF147 | Copiar link deve copiar o endereço da página com `?view=<referência>` da visualização do menu. | Colar o link noutra aba abre a mesma visualização. | Importante | Obrigatório |

## Renomear (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF025 | Clique duplo na pílula, F2 ou Renomear no menu deve trocar a pílula por um campo com o nome selecionado, conforme RN004. | O campo aparece no lugar da pílula. | Importante | Obrigatório |
| RF066 | F2 deve renomear a pílula ativa. | O campo de renomear abre sem mouse. | Importante | Obrigatório |
| RF122 | O clique duplo no nome de uma linha da lista do "+N", ou Renomear no "⋯" da linha, deve abrir o campo de renomear na própria linha, com a lista aberta. | Renomear "Vencidos" para "Contratos vencidos" muda a linha e a pílula. | Importante | Obrigatório |
| RF026 | Enter ou sair do campo deve gravar o nome, com Desfazer no aviso (RN010). | O nome novo aparece na pílula; Desfazer volta o anterior. | Importante | Obrigatório |
| RF079 | Esc no campo de renomear deve desistir e voltar o nome anterior. | O nome não muda. | Importante | Obrigatório |
| RF027 | Se o nome já existe na tela, o sistema deve manter o nome anterior e avisar "Já existe uma visualização chamada <nome>. O nome anterior foi mantido." | Renomear "Vencidos" para "Compras" mostra o aviso. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P005 | Duplicar, na tela de hoje, mostrou "(copy)", a coluna "reference" e o aviso "Visualização editada com sucesso", e depois de 2 Duplicar seguidos a 1ª cópia sumiu. Hipótese, sem contraprova: o 2º Duplicar grava por cima da cópia anterior. | QA da tela de itens | Se confirmado, é defeito a corrigir antes desta entrega |
| S001 | Standard ou Viewer pode renomear e excluir visualização que é só sua (RN004, linha 2). | Mikaela confirma | Se não pode, Renomear e Excluir somem para esse perfil |

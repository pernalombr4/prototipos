# 1. Preferências guardadas e a janela Personalizar

**Objetivo:** a preferência de navegação de cada pessoa fica guardada no servidor, e a janela "Personalizar" reúne o
que a pessoa muda no próprio menu, com "Salvar" e "Descartar" no pé.

**Onde vale:** a janela "Personalizar", o pé do painel do Início, a grade "Mais" e o botão direito da trilha.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, botão direito no Início > "Personalizar
navegação".

## Preferência guardada (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O sistema deve guardar a preferência de navegação de cada pessoa em cada workspace no servidor (RN901). | Ana tira Auditoria da trilha num navegador e abre o workspace noutro: Auditoria continua fora. | Essencial | Obrigatório |
| RF002 | Sem preferência guardada, o menu da pessoa deve ser o menu padrão do produto. | Conta nova: trilha, Início e seções iguais ao cenário "Sem personalização". | Essencial | Obrigatório |
| RF003 | Se a preferência guarda um item que não existe mais, o sistema deve ignorar o item e mostrar o resto do menu. | Ana tinha a categoria Fornecedores no Início; a categoria foi excluída, e o Início abre sem ela, sem erro. | Essencial | Obrigatório |

## Janela Personalizar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | A janela "Personalizar" deve ter as abas "Navegação", "Início" e "Seções e menus" e abrir na aba de quem a chamou. | O botão direito da trilha abre a janela em Navegação. | Essencial | Obrigatório |
| RF012 | Na janela, a mudança feita em cada uma das 3 abas deve aparecer na barra como prévia e só ficar guardada depois de "Salvar" (RN901). | Desmarcar Auditoria e clicar em "Descartar": Auditoria volta à trilha. | Essencial | Obrigatório |
| RF013 | O pé da janela deve mostrar "Alterações não salvas", "Descartar" e "Salvar"; sem mudança, mostra "Nada para salvar ainda." e os 2 botões desligados. | Abrir a janela sem mexer: os 2 botões ficam desligados. | Essencial | Obrigatório |
| RF014 | "Salvar" deve gravar a preferência da pessoa e avisar "Menu salvo só para você." | Depois de salvar, o menu de Bruno não muda. | Essencial | Obrigatório |

## Portas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | "Personalizar a barra lateral" deve ficar fixo no pé do painel do Início, centralizado, fora da rolagem, em texto cinza sem contorno, com uma linha fina em cima, e abrir a janela na aba Início. | Rolar o Início até o fim: o botão continua no pé, no mesmo lugar. | Importante | Obrigatório |
| RF022 | O menu do botão direito da trilha deve ganhar "Personalizar navegação", antes de "Recolher menu", que abre a janela na aba Navegação. | Botão direito em qualquer ícone mostra "Personalizar navegação". | Importante | Obrigatório |
| RF023 | A grade de "Mais" deve terminar com o botão "Personalizar navegação". | O botão abre a janela na aba Navegação. | Importante | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Preferência de navegação da pessoa no workspace | Deve guardar e devolver: as áreas na trilha e a ordem, a aparência, os destinos escondidos e a ordem do Início, os itens ocultos, as seções pessoais com os itens, as seções ocultas, o limite de cada seção e a ordem das categorias. Rota <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S001 | Suposição: os favoritos continuam onde estão hoje e não entram nesta preferência. | produto | RI001 guarda também os favoritos. |
| P001 | Fechar a janela com mudança pendente deve perguntar se a pessoa quer descartar? O protótipo fecha sem perguntar. | produto | Um RF com a pergunta de descartar. |

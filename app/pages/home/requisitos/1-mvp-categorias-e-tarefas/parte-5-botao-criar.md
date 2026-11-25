# 5. Botão Criar

**Objetivo:** a pessoa cria um item numa categoria, uma tarefa rápida ou pede ao BENI, por um botão só no topo da
Home, sem procurar a categoria no menu.

**Onde vale:** o topo da Home do workspace. O item nasce no modal de criação que a categoria já usa, e a tarefa, no
modal "Nova tarefa" de Tarefas > Rápidas.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "MVP" em "Versão". No protótipo, "Pedir ao BENI"
mostra um toast no lugar da conversa em tela cheia.

## O menu (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | O topo da Home deve ter o botão "Criar", depois de "Personalizar", com a dica "Criar item ou tarefa (C)". | O botão some no modo de edição. | Essencial | Obrigatório |
| RF402 | A tecla C deve abrir o menu do Criar quando o foco não está num campo de texto. | Digitar "c" num campo de busca não abre o menu. | Importante | Desejável |
| RF403 | O 1º nível do menu deve ter o campo de busca "O que você quer criar?", as opções "Item" e "Tarefa", com a descrição de cada uma, e "Pedir ao BENI" no pé. | Os textos de descrição são os do protótipo. | Essencial | Obrigatório |
| RF404 | Enquanto a pessoa digita no 1º nível, o menu deve mostrar também as categorias cujo nome contém o texto. | Exemplo: "contr" mostra Contratos, que leva direto ao passo do formulário ou ao modal. | Importante | Desejável |
| RF405 | "Voltar", no topo de cada nível, e a tecla Backspace com o campo vazio devem voltar ao nível anterior; Esc fecha o menu. | O pé do menu mostra "Setas e Enter escolhem. Backspace volta. Esc fecha.". | Importante | Obrigatório |
| RF406 | Se nenhuma opção contém o texto digitado, o menu deve mostrar "Nenhuma opção com "<texto>"." e manter "Pedir ao BENI" no pé. | Exemplo: "xyz" mostra "Nenhuma opção com "xyz"." e "Pedir ao BENI". | Importante | Obrigatório |

## Item (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF407 | "Item" deve abrir o nível "Em qual categoria?", com as categorias que a pessoa acessa (RN901), cada uma com o ícone e a cor dela. | A categoria sem acesso não aparece. | Essencial | Obrigatório |
| RF408 | Na categoria com 2 ou mais formulários, a escolha deve abrir o nível "Qual formulário de <categoria>?", com 1 opção por formulário. | Exemplo: Contratos mostra Novo contrato e Aditivo. | Essencial | Obrigatório |
| RF409 | Na categoria com 1 formulário ou nenhum, a escolha deve abrir direto o modal de criação da categoria. | Categoria sem formulário abre o modal com todos os campos da categoria. | Essencial | Obrigatório |
| RF410 | Criado o item, a Home deve mostrar o toast "Item <número> criado em <categoria>." com "Abrir", que abre o item. | Exemplo: "Item 23407 criado em Chamados de TI.". | Importante | Obrigatório |

## Tarefa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF411 | "Tarefa" deve abrir direto o modal "Nova tarefa rápida", com os campos do modal "Nova tarefa" de Tarefas > Rápidas: Nome, Data limite, Prioridade, Responsável, Colaboradores e Descrição. | O modal abre sobre a Home, sem trocar de tela. | Essencial | Obrigatório |
| RF412 | O modal deve abrir com a pessoa como responsável e a prioridade Normal. | Abrir o modal e criar só com o nome gera uma tarefa da pessoa, prioridade Normal. | Importante | Obrigatório |
| RF413 | Se o nome está vazio, "Criar" deve mostrar no campo "Dê um nome à tarefa." e não criar a tarefa. | O modal continua aberto com o aviso no campo Nome. | Essencial | Obrigatório |
| RF414 | Criada a tarefa, a Home deve mostrar o toast "Tarefa <número> criada." com "Abrir". | "Abrir" abre a tarefa criada. | Essencial | Obrigatório |
| RF417 | Criada a tarefa, os widgets de tarefa da Home devem mostrar a tarefa nova sem recarregar a página. | A tarefa com prazo hoje aparece na aba Hoje de Minhas tarefas. | Essencial | Obrigatório |

## Pedir ao BENI (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF415 | "Pedir ao BENI" deve abrir a conversa com o BENI em tela cheia, com o texto digitado no campo de busca como 1º pedido. | Exemplo: digitar "chamado de impressora parada" e escolher "Pedir ao BENI" abre a conversa com esse pedido. | Importante | Obrigatório |
| RF416 | Com o campo de busca vazio, "Pedir ao BENI" deve abrir a conversa sem pedido. | A conversa abre com o campo vazio e o cursor nele. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI401 | Página de conversa `/workspaces/<workspace>/ai/chat` | Recebe o pedido em `?prompt=`, como o "Ask BENI AI" do construtor de relatórios já faz. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P401 | Para quem não tem a permissão da conversa com IA (`ai.chat`), "Pedir ao BENI" some do menu ou aparece desabilitado com o motivo? | produto | RF403 e RF415 |
| P402 | O membro sem permissão de criar item em nenhuma categoria vê "Item" no menu? | produto | RF403 e RF407 |

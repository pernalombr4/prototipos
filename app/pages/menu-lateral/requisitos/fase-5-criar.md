# Requisitos: fase 5, criar

**Objetivo:** criar menu, seção e categoria a partir do menu, por atalhos que cortam caminho, com 1 formulário só
para menu. O menu é a tela: criar o menu cria a tela junto, e Configurações > Interface > Telas sai.

**Onde vale:** o "+" do Início, o "+" da barra do topo, o "+" de cada seção, o editor de menus (Configurações >
Interface > Menus) e as janelas que eles abrem.

**Referência visual:** https://pernalombr4.github.io/prototipos/menu-lateral/, modelo "Trilha e painel". O mapa das 6
fases está em [fases.md](fases.md).

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre
aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.

**Fora do escopo:** Importar e Casos de uso (fase 6); os formulários de criar item e tarefa, que são os do produto.

## Resumo

| Grupo | O que muda em relação ao menu de hoje | Requisitos |
|---|---|---|
| O "+" do Início | Hoje não existe. Busca o que criar e oferece criar com IA | RF401 a RF405 |
| O "+" do topo | As mesmas portas, mais item e tarefa | RF406 a RF407 |
| Criar menu | Hoje são 2 portas (Telas e Menus) em ordem obrigatória. Passa a ser 1 formulário | RF408 a RF419 |
| Criar categoria | Atalho com ícone e nome | RF420 a RF421 |
| Editor de menus | Configurações > Interface > Menus abre a árvore inteira | RF422 a RF428 |
| Moldura das janelas | Todo formulário com a mesma largura e o mesmo rodapé | RF429 a RF432 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN401 | O menu é a tela: cada menu tem exatamente 1 tela, criada junto com o menu. | Criar o menu "Painel de vendas" do tipo Painéis cria a tela de painéis do menu. |
| RN402 | Uma tela não pode aparecer em 2 menus. Duplicar um menu cria outra tela. | Não existe "vincular tela existente". |
| RN403 | Excluir um menu exclui a tela dele. | Excluir "Políticas internas" apaga a tela junto. |
| RN404 | Só quem tem licença Owner ou Full pode criar menu, seção do workspace e categoria. | Membro com licença Basic vê "Criar menu" desligado. |
| RN405 | Só o que o workspace criou se exclui; nativo e de módulo, não. | Auditoria não tem excluir; Conhecimento tem. |
| RN406 | Integrações não recebe menu novo (RN304 da fase 4). | Integrações não aparece em "Dentro de uma seção". |

## O "+" do Início (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF401 | O "+" do cabeçalho do Início deve abrir a lista com o campo "Descreva o que quer criar" e as opções "Criar seção", "Criar menu" e "Criar categoria". | Clicar no "+" mostra o campo com o foco e as 3 opções. | Essencial |
| RF402 | O texto digitado deve filtrar as opções. | Digitar "menu" deixa só "Criar menu". | Importante |
| RF403 | Se o texto não casa com opção alguma, a lista deve mostrar "Criar com IA" com o texto digitado e a dica "O BENI monta e mostra antes de gravar". | Digitar "fluxo de férias" mostra "Criar com IA". | Desejável |
| RF404 | A lista deve terminar com "Personalizar a barra lateral", que abre a janela "Personalizar" (fase 3). | O último item abre a janela. | Importante |
| RF405 | "Criar seção" deve criar a seção pessoal do Início (RF219 da fase 3). | A seção nova entra no topo do Início. | Essencial |

## O "+" do topo (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF406 | O botão "Criar" da barra do topo deve ter "Item", "Tarefa", "Criar seção", "Criar menu" e "Criar categoria". | As 5 opções aparecem, em 2 grupos. | Essencial |
| RF407 | "Criar seção", "Criar menu" e "Criar categoria" do topo devem abrir as mesmas janelas do "+" do Início; "Item" e "Tarefa" abrem os formulários do produto. | "Criar menu" do topo e do Início abrem a mesma janela. | Essencial |

## Criar menu (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF408 | O "+" do Início, o "+" do topo, o "Novo menu" do editor e o "+" de cada seção devem abrir a janela "Criar menu", com os campos de RF409 a RF415. | As 4 portas abrem a janela com os campos de RF409 a RF415. | Essencial |
| RF409 | A janela deve pedir ícone e nome. | Salvar sem nome mostra o erro no campo e não cria nada. | Essencial |
| RF410 | A janela deve ter o campo "Tipo de menu", com a dica "O tipo é a tela que abre quando alguém clica neste menu." e os tipos de tela do produto (RN401). | A lista mostra os tipos que hoje ficam em Interface > Telas. | Essencial |
| RF411 | Quando o tipo escolhido pede categorias ou caminho, a janela deve mostrar esses campos. | Escolher um tipo que lista itens mostra o campo de categorias. | Essencial |
| RF412 | Se falta o caminho num tipo que o pede, a janela deve mostrar o erro no campo e não criar o menu. | Tipo com caminho, campo vazio: a janela não fecha. | Importante |
| RF413 | O campo "Onde ele fica" deve oferecer "No Início", "Na trilha" e "Dentro de uma seção", com a lista das seções do workspace (RN406). | Escolher "Dentro de uma seção" mostra a lista; Integrações não está nela. | Essencial |
| RF414 | O campo "Quem enxerga" deve oferecer os grupos de membros do workspace. | Escolher o grupo Jurídico restringe o menu a ele. | Essencial |
| RF415 | A janela deve mostrar a prévia: a linha como fica no menu e, embaixo, a tela que a linha abre. | Mudar o nome e o tipo muda a prévia na hora. | Importante |
| RF416 | Aberta pelo "+" de uma seção, a janela deve vir com "Dentro de uma seção" e essa seção escolhidos. | "+" de Conhecimento: a janela vem dentro de Conhecimento. | Importante |
| RF417 | Criar deve pôr o menu e a tela no rascunho da fase 4, com a bolinha amarela, e não publicar. | O cartão "Alterações não salvas" aparece depois de criar. | Essencial |
| RF418 | Excluir um menu deve tirá-lo do rascunho sem pedir confirmação (RN403); "Descartar" o devolve. | Excluir e Descartar: o menu volta. | Essencial |
| RF419 | Configurações > Interface > Telas deve sair; Interface fica com Menus e Casos de uso. | O grupo Interface não lista Telas. | Essencial |

## Criar categoria (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF420 | "Criar categoria" deve abrir uma janela com ícone e nome. | Criar "Fornecedores" com nome vazio mostra o erro no campo. | Essencial |
| RF421 | A categoria criada deve aparecer em Categorias, no topo de "Mais usadas", e na busca do workspace. | Criar "Patrimônio": a linha aparece em Categorias. | Essencial |

## Editor de menus (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF422 | Configurações > Interface > Menus deve abrir o editor: uma camada com a árvore inteira do menu do workspace. | O editor mostra as seções e as telas de cada uma. | Essencial |
| RF423 | O editor deve ter "Nova seção" e "Novo menu" no topo; "Novo menu" abre a janela de RF408. | "Novo menu" abre a mesma janela do "+". | Essencial |
| RF424 | Cada seção do editor deve ter o "+" que abre "Criar menu" dentro dela, menos Integrações (RN406). | Integrações não tem o "+". | Importante |
| RF425 | O editor deve reordenar e reagrupar arrastando, com as regras da RN308 da fase 4 e a recusa com o motivo. | Arrastar Apps no editor não é possível. | Essencial |
| RF426 | O editor deve mostrar o botão de excluir só em seção e menu do workspace (RN405). | Auditoria mostra só o "+"; Conhecimento mostra "+" e excluir. | Importante |
| RF427 | Editar um menu deve abrir a janela de RF408 preenchida, com o título "Editar <nome>". | Editar Painel de vendas abre a janela com os dados dele. | Importante |
| RF428 | Uma janela aberta por cima do editor deve ficar por cima dele. | "Novo menu" a partir do editor aparece na frente. | Essencial |

## Moldura das janelas (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF429 | Os formulários de criar, editar e renomear devem ter 1 largura comum. | Criar menu, criar seção e criar categoria abrem com a largura comum. | Importante |
| RF430 | Os formulários devem ter 1 rodapé comum: contexto à esquerda, "Cancelar" e a ação à direita, nessa ordem. | O rodapé das 3 janelas tem a geometria comum. | Importante |
| RF431 | As camadas (editor, "Ver todas as categorias") devem ter 1 largura comum, maior que a dos formulários. | O editor e "Ver todas" abrem com a largura comum das camadas. | Importante |
| RF432 | Se a pessoa não cumpre a RN404, as opções de criar menu e categoria devem aparecer desligadas, com "Só quem configura o workspace". | Estado sem permissão: "Criar menu" desligado, com a explicação. | Essencial |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI401 | Criar menu | Deve receber nome, ícone, tipo de menu, categorias ou caminho quando o tipo pede, lugar e grupos, e criar o menu e a tela juntos (RN401). Rota <a definir>. |
| RI402 | Excluir menu | Deve excluir o menu e a tela dele (RN403). Rota <a definir>. |
| RI403 | Criar categoria | Deve receber nome e ícone. Rota <a definir>. |
| RI404 | Criar com IA | Deve receber o texto e devolver a proposta que o BENI monta, sem gravar. Rota <a definir>. |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RT401 | Até o fim da fase 6, o menu novo só deve aparecer em develop (RT001 da fase 1). | Em produção, o menu de hoje continua igual. | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P401 | O que acontece com as telas que os clientes já têm fora de qualquer menu quando Telas sair? | produto | Um plano de migração e uma regra de transição. |
| S401 | Suposição: até a resposta de P401, Interface > Telas continua existindo em produção, porque o menu novo só vai ao cliente depois da fase 6. | produto | Vira regra de transição com critério de fim. |
| P402 | O que "Criar com IA" grava depois que a pessoa aprova a proposta do BENI? | produto | RF403 e RI404 ganham o passo de gravar. |
| P403 | "Seção" quer dizer 2 coisas: no "+" do Início é a seção pessoal; no editor, a seção de menu do workspace. Os 2 nomes ficam iguais? | produto | Os textos de "Criar seção" e "Nova seção". |
| P404 | O campo interno ainda se chama "tipo de tela" no protótipo; na tela é "Tipo de menu". O nome no produto acompanha a tela? | dev | Só o nome interno. |
| P405 | Seção do workspace deve poder nascer aberta? Hoje Interface > Menus não tem o campo "começa aberta". | produto | Um campo novo no formulário de seção. |
| P406 | Escopo por item: hoje o produto restringe a seção. "Quem enxerga" no menu restringe mais que a seção dele? | produto | RF414 muda de escopo. |

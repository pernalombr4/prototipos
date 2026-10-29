# Requisitos: tela de workspaces, parte 6, agrupar e etiquetas pessoais

**Objetivo:** a pessoa com muitos workspaces os agrupa por licença ou por etiquetas que só ela vê, e recolhe o grupo
que não está usando.

**Onde vale:** a barra da lista, o card, a lista e o menu "⋯" da tela `/workspaces`, e os modais de etiqueta.

**Referência visual:** https://pernalombr4.github.io/prototipos/tela-de-workspaces, aprovado em 14/10/2026 e
revisado até 20/10/2026.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

**Épico:** [epico.md](epico.md). Depende da parte 2.

**Fora do escopo:** etiquetas compartilhadas com outras pessoas.

## Resumo

| Grupo | O que muda em relação ao develop de 16/09/2026 | Requisitos |
|---|---|---|
| Agrupar | Hoje não existe. Menu suspenso como no ClickUp, por licença ou por etiqueta | RF501 a RF505 |
| Grupos | Grupos recolhíveis, na grade e na lista | RF506 a RF514 |
| Etiquetas no card, na lista e na busca | Selos no card, coluna na lista e busca por etiqueta | RF515 a RF519 |
| Etiquetas pessoais | Hoje não existe. Etiquetas que só a pessoa vê, criadas pelo "⋯" ou pela lista | RN501, RF520 a RF529 |
| Dados | A API passa a guardar as etiquetas de cada pessoa | RI501 |

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN501 | As etiquetas de uma pessoa são vistas só por essa pessoa. | Outro membro do mesmo workspace não vê as etiquetas de Mariana. | Obrigatório |

## Agrupar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | A barra deve ter o botão Agrupar à direita, antes de Ordenar (RF022). | A barra mostra Agrupar, Ordenar, Visibilidade e o alternador, nessa ordem. | Essencial | Obrigatório |
| RF502 | Agrupar deve ser um menu suspenso, como no ClickUp: botão com ícone de camadas e seta, com "Agrupar" e borda sem agrupamento, e "Agrupar: Etiqueta" ou "Agrupar: Licença" com fundo quando agrupa. | O botão diz o agrupamento ativo. | Essencial | Obrigatório |
| RF503 | O menu Agrupar deve ter o título "Agrupar por" e as opções "Nenhum", "Etiqueta" e "Licença", com a ativa marcada. Sem etiqueta criada, "Etiqueta" mostra "Nenhuma criada ainda" embaixo. | No estado sem etiquetas, a opção mostra o aviso. | Essencial | Obrigatório |
| RF504 | Trocar o agrupamento deve abrir de novo os grupos recolhidos. | Recolher um grupo e trocar o agrupamento mostra cada grupo aberto. | Desejável | Desejável |
| RF505 | A ordem do menu Ordenar (RF025) deve valer dentro de cada grupo. | Agrupado por licença e em "Nome, de A a Z", cada grupo fica em ordem alfabética. | Importante | Obrigatório |

## Grupos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF506 | Sem agrupamento, a lista deve ser uma só, sem título. | Nenhum título de grupo aparece. | Essencial | Obrigatório |
| RF507 | Agrupado por licença, os grupos devem seguir a ordem "Convites pendentes" (ícone de envelope), "Proprietário", "Full", "Membro" e "Leitor" (ícone de crachá). | O convite fica no grupo próprio, no topo. | Essencial | Obrigatório |
| RF508 | Agrupado por etiqueta, a lista deve ter um grupo por etiqueta, na ordem de criação, e depois "Sem etiqueta". | A etiqueta criada primeiro é o 1º grupo. | Essencial | Obrigatório |
| RF509 | Agrupado por etiqueta, o workspace com 2 etiquetas deve aparecer nos 2 grupos. | Marcar 2 etiquetas num workspace faz o card aparecer 2 vezes. | Importante | Obrigatório |
| RF510 | A lista deve mostrar só os grupos com pelo menos 1 workspace. | Sem nenhum Leitor, não há grupo "Leitor". | Importante | Obrigatório |
| RF511 | O título do grupo deve ser um botão com seta, ícone, nome e contagem em cinza, que recolhe ou abre o grupo (a seta gira 90°), com `aria-expanded` e o nome acessível "Recolher ou abrir {nome}". | Recolher esconde os cards do grupo e mantém o título. | Essencial | Obrigatório |
| RF512 | Agrupado por etiqueta, com etiqueta criada e sem busca, o fim dos grupos deve ter o botão com borda "+ Nova etiqueta", que abre o modal de RF524. | O botão some com texto na busca. | Desejável | Desejável |
| RF513 | Na visualização em lista, com agrupamento, cada grupo deve ter a própria tabela. | Agrupar por licença mostra uma tabela por licença. | Importante | Obrigatório |
| RF514 | Com agrupamento, a seção "Ocultos" (RF414) deve continuar no fim da lista, depois do último grupo. | Agrupado por licença, a seção "Ocultos" fica abaixo do grupo "Leitor". | Importante | Obrigatório |

## Etiquetas no card, na lista e na busca (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF515 | O corpo do card deve mostrar até 2 etiquetas em selos neutros com borda e ícone de etiqueta, cada selo com no máximo 8rem e cortado com reticências, e o selo "+{n}" para as demais. Passar o mouse ou focar no "+{n}" abre um popover com as etiquetas do workspace, com o nome acessível "Mais {n} etiquetas". | Um workspace com 30 etiquetas mostra 2 e "+28", e o card não cresce. | Importante | Obrigatório |
| RF516 | A coluna "Etiquetas" da lista deve mostrar 1 selo e "+{n}", com o popover de RF515. | As etiquetas aparecem só na coluna "Etiquetas", e não na coluna Workspace. | Importante | Obrigatório |
| RF517 | A lista deve ganhar a coluna "Etiquetas", entre "Licença" e "Último acesso". | A coluna aparece nessa posição. | Importante | Obrigatório |
| RF518 | A busca deve procurar também nas etiquetas. | Buscar "clientes" mostra os workspaces com a etiqueta "Clientes". | Importante | Obrigatório |
| RF519 | O menu "⋯" (RF103) deve ter o item "Etiquetas", com ícone de etiquetas, depois do 1º item. | O item abre o modal de RF520. | Essencial | Obrigatório |

## Etiquetas pessoais (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF520 | O item "Etiquetas" do "⋯" deve abrir o modal "Etiquetas de {nome}", com o texto "Só você vê. Use para agrupar seus workspaces do seu jeito." e uma caixa de marcar por etiqueta; marcar e desmarcar vale na hora. | Marcar uma etiqueta faz o selo aparecer no card. | Essencial | Obrigatório |
| RF521 | O modal deve ter o campo "Nova etiqueta" (com ícone, no máximo 30 caracteres) e o botão "Criar", desabilitado com o campo vazio; Enter também cria, e a etiqueta criada vem marcada. | Criar "RH e pessoas" adiciona e marca a etiqueta. | Essencial | Obrigatório |
| RF522 | Um nome igual ao de uma etiqueta da pessoa, sem contar acento e maiúscula, deve reaproveitar a etiqueta existente. | Criar "clientes" com "Clientes" existente não duplica. | Importante | Obrigatório |
| RF523 | O modal deve fechar pelo botão "Pronto", mantendo o que foi marcado. | Fechar não desfaz o que foi marcado. | Importante | Obrigatório |
| RF524 | O "+ Nova etiqueta" (RF512) e o aviso sem etiquetas (RF528) devem abrir o modal "Criar etiqueta", com o texto "Dê um nome e marque os workspaces que vão levar a etiqueta. Só você vê." | Os 2 caminhos abrem o modal "Criar etiqueta". | Importante | Obrigatório |
| RF525 | O campo "Nome da etiqueta" deve receber o foco ao abrir, com o placeholder "Ex.: Clientes" e no máximo 30 caracteres. | Abrir o modal e digitar escreve no nome. | Importante | Obrigatório |
| RF526 | "Em quais workspaces" deve listar os workspaces da pessoa, sem os convites, em ordem alfabética, com caixa de marcar e a busca "Buscar workspace", com rolagem a partir de 16rem. | Buscar "aurora" filtra a lista do modal. | Essencial | Obrigatório |
| RF527 | O rodapé do modal deve mostrar "Marque pelo menos 1 workspace." enquanto não houver workspace marcado, "Cancelar" e "Criar em 1 workspace" ou "Criar em {n} workspaces", desabilitado sem nome ou sem workspace marcado. Ao criar, a lista passa a agrupar por etiqueta, com o toast "Etiqueta "{nome}" criada em {n} workspaces". | Criar "Clientes" em 3 workspaces mostra o grupo "Clientes 3". | Essencial | Obrigatório |
| RF528 | Sem etiqueta criada, agrupar por etiqueta deve pôr os workspaces num grupo "Sem etiqueta", com um aviso neutro acima: "Você ainda não criou etiquetas", "Etiquetas agrupam seus workspaces do seu jeito, e só você vê. Enquanto não houver nenhuma, tudo fica em "Sem etiqueta"." e o botão com borda "+ Criar etiqueta". | No estado sem etiquetas, a lista mostra 1 grupo e o aviso. | Importante | Obrigatório |
| RF529 | O aviso de RF528 deve sumir quando a primeira etiqueta for criada. | Criar a primeira etiqueta tira o aviso. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI501 | Etiquetas pessoais (rota <a definir>) | A API deve guardar, por pessoa, as etiquetas e os workspaces de cada etiqueta (RN501), e devolver as etiquetas na listagem. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P501 | Qual o limite e a validação do nome da etiqueta? Hoje, no protótipo: no máximo 30 caracteres, sem outra validação. | produto | RF521 e RF525 ganham a validação |

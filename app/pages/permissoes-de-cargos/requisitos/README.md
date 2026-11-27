# Requisitos: permissões de cargos

9 épicos. Os 7 primeiros vão em ordem de urgência; os épicos 8 e 9 saíram da rodada 7, da leitura do código. Cada um sobe sozinho e vira 1 card `user_story`. O épico 3 tem 4 partes porque elas
só fazem sentido juntas: a tabela sem o Ajustar perde o caminho para campos e formulários.

| Ordem | Épico | Urgência e motivo | Onde mexe | Depende de |
|---|---|---|---|---|
| 1 | [Itens sem formulário](1-itens-sem-formulario/epico.md) | **Urgente.** Hoje os itens sem formulário somem de todo cargo com permissão de formulário, como as demandas do agente de IA no workspace de produtos. A correção na develop (card USE87A7C6) mostra esses itens a todo cargo e quebra o caso Cível e Criminal se for para produção. | back e 1 nó na árvore de hoje | |
| 2 | [Ações por formulário em toda porta](2-acoes-por-formulario/REQUISITOS.md) | **Alta.** Hoje a API cria item em formulário que o cargo não tem, e o formulário criado depois fica fora da ação marcada inteira. | back | 1 |
| 3 | [Tela nova de permissões](3-tela-nova/epico.md) | **Alta.** Com 120 categorias, a tela de hoje mostra 14.828 caixas. Só tela: grava o que a árvore grava. | front | |
| 4 | [Quais itens, criador e responsável](4-quais-itens/REQUISITOS.md) | **Média.** Pedido da rodada 4 ("temos que ter"). Hoje não existe, e gravar a regra tira a permissão inteira. | back e front | 3 |
| 5 | [Padrão para todas as categorias](5-padrao/REQUISITOS.md) | **Média.** A categoria nova nasce sem permissão em cada cargo; a caixa de coluna do épico 3 já cobre parte do trabalho. | back e front | 3; 4 só para "Quais itens no padrão" |
| 6 | [Permissões fixas em matriz](6-permissoes-fixas/REQUISITOS.md) | **Baixa.** A árvore das permissões fixas funciona; a matriz encurta a tela e separa Funcionalidades em Geral e Automação e IA. | front | 3 |
| 7 | [Quem acessa](7-quem-acessa/REQUISITOS.md) | **Baixa.** Comparar cargos sem abrir cada um. Desejável. | front | 3 |
| 8 | [Permissões valem na API](8-valem-na-api/REQUISITOS.md) | **Alta.** Hoje o back não confere as permissões de Configurações nem as de cargos: o administrador tira o acesso pela tela e o membro full continua fazendo. O histórico e o comentário de item conferem só se a pessoa é membro. | back e menu | |
| 9 | [Permissões novas](9-permissoes-novas/REQUISITOS.md) | **Média.** Painel de tarefas, relatórios, execuções de Spaceflow, IA nos campos, faturamento, ações de membros, Início, migrações e as outras ações de item não têm permissão própria. | back e front | 3 e 6 |

Os épicos 1, 2, 4, 5, 8 e 9 pedem back novo; os épicos 3, 6 e 7 só mexem na tela, com o back de hoje (skill `requisitos`,
"Épico pelo esforço").

## As abas da tela do cargo

A aba Dados de hoje vira 2 abas: Categorias e Funcionalidades. A divisão segue a que o código já faz na árvore de
permissões: o que começa com `types::<slug>` é categoria; `settings::` e os prefixos de administração (`config`,
`members`, `roles`, `workspace`, `screens` e outros) são Configurações; o resto é Funcionalidades. Permissão nova cai
na aba certa sem regra nova.

| Aba | O que mostra | Grupos |
|---|---|---|
| Categorias | O padrão para novas categorias e a tabela das categorias, com formulários, campos, quais itens e outras ações na categoria aberta | |
| Funcionalidades | As áreas que não são categoria nem configuração | Geral (Agenda, Tarefas rápidas, Tarefas programadas, Painel de tarefas, Assinaturas e Relatórios) e Automação e IA (Spaceflows e IA) |
| Configurações | A administração do workspace | Sistemas, Dados, Acesso, Interface, Emails, Integrações, Logs e Credenciais |
| Inválidas | As referências gravadas que não valem mais | |

Spaceflows aparece 2 vezes, como no código: em Funcionalidades, iniciar e acompanhar (`workflows`); em Configurações ›
Dados, montar, editar e excluir fluxos (`setupWorkflows`).

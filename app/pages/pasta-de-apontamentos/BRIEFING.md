# Briefing: Pasta de apontamentos

## A demanda, como ela veio

> preciso de um prototipo de uma nova folder para os itens no enspace. uma nova folder para as tarefas tambem. hoje usamos tarefas e itens para representar demandas para os devs. quando testamos, colocamos o retorno de teste numa pasta que hoje chamamos de "retorno de testes", que é uma folder de campos, trazendo somente uns campos html com a validaçao do PO e tudo mais. quando fazemos testes muito grandes, acabamos por ter que criar varios outros cards de demanda e fica tudo completmanete perdido. ou mesmo precisamos fazer um docx no word separadamente com todo o historico do teste e os retornos com prints, links de gravaçao de video etc, alem de jsons de environment e postman pra ajudar o dev a reproduzir os erros encontrados por api. como product manager, eu precisava de um tipo de folder ali que eu pudesse nomear como "retorno de teste" e tivesse uma interface interativa nesse sentido. mas nao pode servir só à realidade de produtos, tem que servir pra vários tipos de cliente, sendo uma funcionalidade universal. /deep-research pesquise sobre produtos que trabalham com algo similar e veja como pode prototipar uma ideia assim pro enspace, numa interface interessante. vou tentar dizer oq to imaginando na experiencia do user de produtos ja, ta? aí vc ve se consegue pensar em algo — uma pasta chamada "retornos de teste", mas em vez de ter o campo html de retorno (que nao fica legal pra devolver algo tao grande assim), teria algo como sei la... varios pequenos cards em q a gente poderia dizer "conserta isso", "faz aquilo" (nao cards de kanban, mas uma lista mesmo) colocando imagens, texto, arquivo etc e o dev poderia ir dando check naquilo e tal. acho q seria tipo o equivalente a abrir ma issue no github relacionada a uma task e pedir pro dev ir corrigindo. só q isso fica "dentro" do item, sacou? --- atenção: NAO sao subtarefas. essa é uma outra funcionalidade que deve estar nesse protótipo. nao va por esse caminho, a nao ser que realmente te pareça O MAIS CORRETO E PERTINENTE A SE FAZER. se precisar, investigue o codigo com /investigar-codigo pra pensar melhor no que propor e no que ja temos hoje.

**O problema, em 3 linhas:**
- O retorno de um teste grande não cabe num campo HTML: ele vira vários cards soltos ou um `.docx` fora do ENSPACE.
- O dev não tem como marcar o que já corrigiu, e quem testou não tem como conferir ponto a ponto.
- A solução tem de servir a qualquer cliente (jurídico, auditoria, RH), não só a produtos.

## A tela em jogo

- A tela do item: a barra de pastas e o modal "Nova pasta".
- O painel da tarefa rápida, aberto pela pasta Tarefas do item.

## O que seria sucesso

- O retorno inteiro de um teste mora numa pasta do item, com print, arquivo, link e JSON em cada ponto.
- O dev marca cada ponto como resolvido; quem testou confere ou reabre, e cada volta fica registrada como rodada.
- O mesmo tipo de pasta serve a um contrato, com outro nome e outro modelo, sem nenhuma palavra de software.
- Nada disso vira subtarefa nem card novo.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (`temas/*/auditoria.md` e `UX_REPORT.md`) por "retorno de teste", "apontamento", "checklist", "pendência", "pasta do item" e "folder". Nenhuma auditoria trata de retorno de teste nem de lista de pendências dentro do item; os temas auditados são agenda, base de conhecimento, categorias, configurações do sistema, construtor de telas e plataforma.

O mais perto é a S3-F1 (trocar de aba em Configurações › Sistema descarta a alteração sem aviso), que fala do estado de pendência de um formulário, não de uma lista de pendências.

## O que o develop faz hoje

Visto em 11/11/2026 no workspace de exploração, categoria `leve`, item `LEVD8326AF86DA64A17970C175182DAF` (`/workspaces/teste-ux/types/leve/<referência>?folder=<pasta>`).

| O quê | Como é hoje | Print |
|---|---|---|
| Barra de pastas | Abas sublinhadas com ícone; a ativa tem a seta de opções; o botão de nova pasta fica no canto direito | `evidencias/hoje-item-visao-geral.jpg` |
| Modal "Nova pasta" | Nome da Pasta, Tipo de Pasta (com busca) e Ícone, os 3 obrigatórios; 14 tipos, sem descrição | `evidencias/hoje-nova-pasta-tipos.jpg` |
| Pasta Tarefas | Tarefas Rápidas em quadro de 4 colunas; cartão com nome, descrição, prioridade e data | `evidencias/hoje-pasta-tarefas.jpg` |
| Painel da tarefa | Abas fixas Tarefa, Item, Comentários e Logs de Auditoria; selo de status; rodapé com 3 botões | `evidencias/hoje-painel-da-tarefa.jpg` |
| Comentários da tarefa | Lista simples com menção e anexo, sem estado nem responsável | `evidencias/hoje-comentarios-da-tarefa.jpg` |
| Comentários do item | Mesmo componente; estado vazio "Seja o primeiro!" | `evidencias/hoje-comentarios-do-item.jpg` |
| Tarefas › Rápidas (rodada 2) | Página própria com a barra de visualizações, busca e filtros; quadro de 4 colunas; cartão sem contador de nada | `evidencias/hoje-tarefas-rapidas.jpg` |
| Lista de tarefas na descrição (rodada 2) | O editor aceita a lista de marcar; o cartão e o painel não contam as linhas, e a linha não tem dono | `evidencias/hoje-lista-de-tarefas-na-descricao.jpg` |

Para ver o painel da tarefa, criei pela tela 1 tarefa rápida, "Revisar tela de cadastro", na pasta Tarefas do item acima. Na rodada 2, a descrição dela ganhou uma lista de tarefas de 2 linhas, também pela tela. As 2 coisas continuam lá.

### O que o código diz

Lido pela skill `investigar-codigo` em 11/11/2026 (front `en-space`, back `enlighten-api`).

- **Pastas:** a configuração das pastas do tipo é um JSON livre em `c_type_views.folders`; o tipo de cada pasta é só um valor que o front reconhece (`FOLDER_TYPES`). Um tipo novo pede componente no front e a regra no back, sem migração de tabela para a lista de pastas.
- **Os 14 tipos de hoje:** tasks, flows, integrations, attachments, sendmails, mailbox, notes, survey (Avaliação), data (Campos), document, form, custom_screen, rel_multi e repeater.
- **Tarefa:** o painel tem abas fixas no componente; a tarefa não tem mecanismo de pastas. A tarefa programada tem outras abas (Visão geral, Item, Histórico, Comentários).
- **Comentários:** genéricos por entidade, com menção, anexo e resposta (`parent`). Não têm estado, responsável nem marca de feito.
- **Checklist:** a única lista de marcar é a TaskList do editor de texto, dentro do corpo, sem dono nem estado.
- **Subtarefa:** não existe no develop. O modelo `tasks` não tem `parent` nem relação de bloqueio (rodada 2).
- **Aprovações:** o nome já está em uso. A tarefa tem aprovadores (`task_approvers`, com status approver, waiting, canceled e disapprove) e a opção "Ativar Aprovadores". Uma pasta "Aprovações" se confundiria com eles (rodada 2).
- **Lista de tarefas do editor:** é a extensão `TaskList` do TipTap no `EnEditor`; guarda as caixas no HTML do campo. Nenhuma tela conta as linhas marcadas (rodada 2).
- **Anexos:** sobem para `c-files`, presos ao item; limite de 200 MB.
- **Avisos:** já existem `comment.mention`, `task.assigned`, `task.status_changed` e `flow-item-task.assigned`. A proposta pede 2 novos: apontamento atribuído e apontamento reaberto.
- **Auditoria:** todo modelo é auditado; o apontamento entra nos Logs de Auditoria do item sem trabalho extra.

## Achados do develop

Fora do escopo desta demanda; ficam aqui para quem cuida de cada tela.

| Achado | Onde |
|---|---|
| O menu lateral mostra a chave `menu.member.reports.label` no lugar do nome | Menu lateral, grupo Membro |
| O selo de status da tarefa aparece em inglês ("pending") com a interface em português | Painel da tarefa, ao lado do título |
| O rodapé mostra "Alterações não salvas" ao abrir o item, sem nenhuma alteração | Tela do item, Visão Geral |
| O Ícone é obrigatório no modal "Nova pasta", mas o valor inicial é "Sem ícone" | Modal "Nova pasta" |
| Os 14 tipos de pasta aparecem sem descrição; quem cria não sabe o que cada um faz | Modal "Nova pasta", Tipo de Pasta |

## A casca da tela, item por item

Copiado olhando o develop em 11/11/2026. Nada aqui é proposta.

| Peça | Como está no protótipo |
|---|---|
| Menu lateral | `_CascaDoWorkspace.vue`: Membro (Início, Spaceflows, Categorias aberto com as categorias do cenário, Tarefas, Agenda, a chave sem tradução, Knowledge), Configurações (Visão Geral, Sistema, Estrutura, Gestão de Membros, Interface, E-mails, Integrações, Agentes de IA, Logs) e Ajuda (Releases, Documentação) |
| Barra do topo | Voltar, avançar, recarregar, início, trilha (workspace, Categorias, categoria, referência), idioma, tema, Suporte, sino e avatar |
| Painel do item | `_PainelDoItem.vue`: Identificação, Origem e Histórico; começa recolhido, como na tela do item |
| Barra de pastas | `_BarraDePastas.vue`: Visão Geral, Comentários, Logs de Auditoria, Tarefas, Anexos e Notas, mais a pasta do cenário |
| Rodapé da Visão Geral | "Alterações não salvas", Sair sem salvar e Salvar, com o aviso que aparece sem alteração |
| Pasta Tarefas | `_PastaTarefas.vue`: chip Tarefas Rápidas, Visualizar, busca, Criado em, Todo o período, Filtros por campo, 4 colunas e o rodapé "Mostrando" |
| Painel da tarefa | `_PainelDaTarefa.vue`: trilho de ícones, abas, título, selo "pending", Reference, Detalhes da tarefa e o rodapé de 3 botões |
| Modal "Nova pasta" | `_ModalNovaPasta.vue`: Nome da Pasta, Tipo de Pasta com busca, Ícone com "Sem ícone", Cancelar e Criar |
| Menu Tarefas (rodada 2) | `_CascaDoWorkspace.vue`: Tarefas aberto com Agendadas, Rápidas (ativa) e Painel |
| Página Tarefas › Rápidas (rodada 2) | `_PastaTarefas.vue` com `variante="pagina"`: barra de visualizações, busca, Criado em, Todo o período, Filtros, as 4 colunas com o degradê do develop e o rodapé com a paginação e "500 por página" |
| Trilha da Tarefa rápida (rodada 2) | Workspace, Tarefas, Rápidas |

As pastas Emails Automáticos, Mail Box e Campos do item de exploração ficaram fora da barra: são do tipo de lá, não de todo item.

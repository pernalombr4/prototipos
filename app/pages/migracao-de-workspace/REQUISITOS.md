# Requisitos: importação de estrutura na tela Casos de Uso

Escrito no molde da skill `requisitos` (RF, RN, RI, RNF, RS, com critério de aceite e fonte). Os ids são estáveis:
requisito retirado fica com status Removido, nunca renumerado.

## Perguntas abertas

| Id | Pergunta | A quem perguntar | Afeta |
|---|---|---|---|
| P1 | Qual chave reconhece a mesma entidade nos 2 workspaces: `slug` e `refId`, `migration_hash` ou outra? Etapa e tarefa não têm `slug`. | back-end | RN001, RI002 |
| P2 | A migração já é tudo ou nada hoje? Se não for, RN008 exige mudança no back-end. | back-end | RN008, RF028, RF029 |
| P3 | Na Substituição total, os itens de uma categoria removida vão para a lixeira ou são excluídos de vez? | produto | RF009, RF024 |
| P4 | Na Substituição total, para onde vão os itens e as tarefas abertas de uma etapa removida? | produto | RF019 |
| P5 | Tarefa cujo responsável não existe no workspace de destino entra sem responsável, com o responsável padrão da etapa ou não entra? | produto | RF020 |
| P6 | O Spaceflow (fluxos de `/workflows`) também migra? Hoje ele não está no arquivo de exportação. | produto | RF014, RF018 |
| P7 | Quem pode importar: só o administrador do workspace? | produto | RF001 |
| P8 | Qual é o tamanho máximo do arquivo aceito? | back-end | RF003 |
| P9 | A lista de etapas do andamento (RF025) ganha "Montando fluxos e tarefas"? O andamento aprovado tem 5 etapas e não cita o fluxo. Qual é o texto do aviso no sino (RF030)? | produto | RF025, RF030 |
| P10 | Os requisitos do fluxo da categoria que vieram do protótipo de 20/10/2026 (RF019, RF020) estão aprovados? | produto | RF019, RF020 |
| P11 | Qual é o tempo máximo aceitável para calcular a prévia de um arquivo com 300 campos? | produto e back-end | RNF |
| P12 | Arquivos exportados antes desta mudança continuam aceitos? | back-end | RF003 |
| P13 | Falha ao gerar a cópia do workspace (RF023) impede a migração? | produto | RF023 |

## Suposições

| Id | Suposição | O que confirmaria |
|---|---|---|
| S1 | A chave de identidade é `slug` na categoria, `refId` no campo e o nome nas entidades sem `slug` nem `refId`. É a proposta do protótipo. | Resposta a P1. |
| S2 | O back-end consegue calcular a prévia (RF011) a partir do arquivo e do workspace, antes de importar. | Desenho da rota de prévia (RI002). |
| S3 | O back-end informa a etapa em andamento da migração (RF025). | Resposta do `GET /migration-requests` com a etapa. |
| S4 | As referências entre entidades importadas (uma rota que aponta para uma etapa, uma condicional que lê um campo) são recriadas apontando para as entidades do workspace de destino. | Teste de importação com fluxo da categoria no develop. |

## Contexto

Quem importa a estrutura de outro workspace escolhe o que acontece com o que já existe e vê, antes de confirmar, o
que entra, o que muda e o que sai, em estrutura e nunca em JSON. Hoje o botão Importar Workspace importa no instante
em que o arquivo é escolhido e duplica as categorias que já existem.

**Onde vale:** Configurações › Interface › Casos de Uso (`/workspaces/<ws>/settings/interface/usecases`), cartão
"Migração de Workspace", botão Importar Workspace, e a camada que o botão abre. O Exportar Workspace, o título e a
descrição da tela, o menu lateral e a barra do topo ficam fora destes requisitos.

**Abrangência:** os requisitos valem para toda entidade que o arquivo de estrutura leva (RN009). Os exemplos citam
algumas entidades (categoria, campo, opção de lista, etapa, tarefa) só para ilustrar; a implementação cobre todas.

**Fontes**

| Id | Fonte |
|---|---|
| F1 | Pedido da redatora, 01/10/2026: "ao clicar pra importar, o usuario precisa ter uma area de arraste e poder dizer a escolha dele: é pra sobrescrever tudo o que ta ali pelo novo modelo, é pra somar ou é pra simplesmente adicionar? e fazer a diff em casos em que for necessario, mostrando pra ele a diff, mas nao em codigo, e sim em estrutura". |
| F2 | Tela observada no develop, 01/10/2026, workspace de exploração: a importação começa ao escolher o arquivo, chama `POST /migration-requests` e consulta `GET /migration-requests?status_in=pending&status_in=processing&type=structure`; o aviso da tela diz que as categorias já cadastradas são duplicadas. Prints em `evidencias/develop-*.jpg`. |
| F3 | Arquivo de exportação de referência (estrutura de cliente, fora do repositório), 01/10/2026: uma chave por tipo de entidade. |
| F4 | Pedidos da redatora nas rodadas 2 a 4, 01/10/2026 (`DECISOES.md`): 2 passos; opções enxutas; alerta na Substituição total sem contar itens; marcas Novo, Alterado, Removido e Inalterado; lista só com as alterações; sem chave de filtro e sem botão de trocar o modo na revisão. |
| F5 | Pedido da redatora na rodada 5 e no fechamento, 14/10/2026: a migração não se desfaz, só se cancela em andamento; workspace vazio só com a inclusão, marcada, e as outras desabilitadas; a falha não diz onde parou, diz que nada foi migrado; o carregamento com etapas continua. |
| F6 | Protótipo aprovado em 14/10/2026: https://pernalombr4.github.io/prototipos/migracao-de-workspace/ (textos nos 3 idiomas no `textos.ts`; prints em `evidencias/proposta-r5-*.jpg` e `proposta-r4-revisar.jpg`). |
| F7 | Resposta da redatora, 20/10/2026: o fluxo da categoria entra na comparação. Protótipo atualizado no mesmo dia (`evidencias/proposta-r6-fluxo-da-categoria.jpg`), ainda sem aprovação. |
| F8 | Exclusão de categoria no develop (Estrutura › Categorias), observada em 01/10/2026: pede que o membro digite o próprio e-mail para confirmar. |
| F9 | Especificação do repositório de protótipos (`AGENTE_PROTOTIPOS.md`), regras 33 e 35: texto de interface sem travessão; tema claro e escuro; textos em português, inglês e espanhol. |
| F10 | Pedido da redatora, 20/10/2026: a lista da prévia mostra toda entidade migrada; os requisitos dizem isso sem citar as entidades uma a uma. |

## Glossário

| Termo | Definição | Nome na tela | Nome na API ou no arquivo | Sinônimo proibido |
|---|---|---|---|---|
| Estrutura | Conjunto das entidades de configuração de um workspace, sem os itens cadastrados. | Estrutura | arquivo de exportação | modelo, template |
| Arquivo de estrutura | Arquivo `.json` gerado pelo Exportar Workspace, com uma chave por tipo de entidade. | arquivo da estrutura | `estructural_export_<ws>_<data>.json` | JSON (na tela) |
| Entidade | Cada coisa que o arquivo de estrutura leva: categoria e o que pertence a ela (campo, opção de lista, formulário, pasta, fluxo da categoria com as etapas, tarefas e configurações) e o que não pertence a uma categoria. | (não aparece) | registro de cada chave do arquivo | item (item é dado cadastrado) |
| Migração | Importação de um arquivo de estrutura num workspace, do início até concluída, cancelada ou com falha. | Migração | `migration-request` | importação de dados |
| Fluxo da categoria | Sequência de etapas de uma categoria, com o que cada etapa cria e configura. Não é o Spaceflow. | Fluxo (N etapas) | `c-type-flows` | Spaceflow |
| Etapa | Passo do fluxo da categoria. | etapa | `c-flow-stages` | fase |
| Chave de identidade | Valor que reconhece a mesma entidade no arquivo e no workspace (S1). | (não aparece) | `slug`, `refId`, `migration_hash` | id (o id muda entre workspaces) |
| Correspondente | Entidade do workspace com a mesma chave de identidade de uma entidade do arquivo. | (não aparece) | | |
| Modo de importação | Regra que decide o que a migração faz com cada entidade: Somente inclusão, Inclusão e atualização ou Substituição total (RN002). | Modo de importação | `<a definir>` (RI001) | |
| Workspace vazio | Workspace sem nenhuma entidade de estrutura. | Workspace vazio | | |
| Prévia | Resultado calculado da migração para o arquivo e o modo escolhidos, antes de importar. | Revisar | `<a definir>` (RI002) | diff (na tela) |
| Situação | Resultado de cada entidade na prévia: Novo, Alterado, Removido ou Inalterado, concordando em gênero com a entidade. | Novo, Alterado, Removido, Inalterado | | Entra, Muda, Sai |
| Referência quebrada | Entidade importada que cita um membro ou outra entidade que não existe no workspace de destino depois da migração. | "Aponta para <nome>, que não existe neste workspace." | | |
| Cópia do workspace | Arquivo de estrutura do workspace de destino, baixado antes da migração. | Baixar uma cópia do workspace antes | o mesmo do Exportar Workspace | backup |

## Regras de negócio

### RN001 — Correspondência entre o arquivo e o workspace
- **Enunciado:** Uma entidade do arquivo é considerada correspondente de uma entidade do workspace quando as 2 têm chaves de identidade iguais.
- **Tipo:** Comportamento (inferência)
- **Estabilidade:** Estática
- **Formato:** Frase
- **Justificativa:** sem correspondência por chave, a migração duplica o que já existe (F2).
- **Origem:** F1, F2; chave proposta em S1
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Rascunho (aguarda P1)
- **Exemplos:** a categoria de `slug` `processos_judiciais` no arquivo é a mesma do workspace, ainda que o nome mude de "Processos judiciais" para "Processos judiciais trabalhistas". O campo `refId` `vara` é o mesmo campo, com o rótulo "Vara" no workspace e "Vara ou tribunal" no arquivo.
- **Relacionados:** RN002, RN003, RF011, RI002

### RN002 — Situação de cada entidade por modo de importação
- **Enunciado:** A tabela a seguir define a situação de cada entidade na migração.
- **Tipo:** Comportamento (inferência)
- **Estabilidade:** Estática
- **Formato:** Tabela. Política: Única (cada combinação casa com 1 linha).
- **Justificativa:** os 3 modos formam uma escada: cada um faz o que o anterior faz e mais uma coisa (F1, F6).
- **Origem:** F1, F4, F6
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado

| Linha | Está no arquivo | Está no workspace | Diferença entre as 2 | Modo | Situação | O que a migração faz |
|---|---|---|---|---|---|---|
| 1 | sim | não | não se aplica | qualquer um dos 3 | Novo | cria a entidade |
| 2 | sim | sim | não | qualquer um dos 3 | Inalterado | nada |
| 3 | sim | sim | sim | Somente inclusão | Inalterado | mantém a entidade do workspace |
| 4 | sim | sim | sim | Inclusão e atualização | Alterado | aplica à entidade do workspace o que o arquivo tem de diferente |
| 5 | sim | sim | sim | Substituição total | Alterado | aplica à entidade do workspace o que o arquivo tem de diferente |
| 6 | não | sim | não se aplica | Somente inclusão | Inalterado | nada |
| 7 | não | sim | não se aplica | Inclusão e atualização | Inalterado | nada |
| 8 | não | sim | não se aplica | Substituição total | Removido | remove a entidade e, na categoria, os itens cadastrados nela |

- **Exemplos:** a opção de lista "Curitiba", só no arquivo, entra nos 3 modos (linha 1). A opção "Execução", só no workspace, continua na Inclusão e atualização (linha 7) e sai na Substituição total (linha 8). A categoria "Contratos de honorários", só no workspace, com 48 itens, sai com os 48 itens na Substituição total (linha 8).
- **Relacionados:** RN001, RN003, RN009, RF011

### RN003 — Migração sem duplicação
- **Enunciado:** Cada entidade do arquivo que tem correspondente no workspace deve continuar como 1 entidade depois da migração.
- **Tipo:** Comportamento (restrição)
- **Estabilidade:** Estática
- **Formato:** Frase
- **Justificativa:** a duplicação é o defeito que a tela avisa hoje (F2).
- **Origem:** F2, F6
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **Exemplos:** importar o arquivo com "Partes" num workspace que já tem "Partes" deixa 1 categoria "Partes", em qualquer modo.
- **Relacionados:** RN001, RF031

### RN004 — Modo no workspace vazio
- **Enunciado:** Um workspace vazio só pode receber migração no modo Somente inclusão.
- **Tipo:** Comportamento (restrição)
- **Estabilidade:** Estática
- **Formato:** Frase
- **Justificativa:** sem estrutura, não há o que atualizar nem remover (F5).
- **Origem:** F5
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **Exemplos:** num workspace sem entidade de estrutura, o modo Somente inclusão vem marcado e os outros 2 ficam desabilitados.
- **Relacionados:** RF008

### RN005 — Confirmação da Substituição total
- **Enunciado:** Uma migração no modo Substituição total que remove ao menos 1 entidade só pode começar se o e-mail digitado for igual ao e-mail do membro logado.
- **Tipo:** Comportamento (restrição)
- **Estabilidade:** Estática
- **Formato:** Frase
- **Justificativa:** a remoção leva os itens cadastrados; a confirmação repete o padrão da exclusão de categoria (F8).
- **Origem:** F6, F8
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **Exemplos:** com o membro ana.souza@exemplo.com.br logado, digitar "ana.souza@exemplo.com.br" libera o botão Substituir workspace; digitar "ana@exemplo.com.br" não libera.
- **Relacionados:** RF024

### RN006 — Migração concluída sem volta
- **Enunciado:** Uma migração concluída não pode ser desfeita.
- **Tipo:** Comportamento (restrição)
- **Estabilidade:** Estática
- **Formato:** Frase
- **Justificativa:** o produto não desfaz migração (F5). A volta ao estado anterior é pela cópia do workspace, importada com Substituição total.
- **Origem:** F5
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **Exemplos:** a tela de migração concluída não tem botão de desfazer.
- **Relacionados:** RF023, RF027

### RN007 — Cancelamento da migração
- **Enunciado:** Uma migração só pode ser cancelada enquanto está em andamento.
- **Tipo:** Comportamento (restrição)
- **Estabilidade:** Estática
- **Formato:** Frase
- **Justificativa:** a única interrupção que o produto oferece é durante o andamento (F5).
- **Origem:** F5
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **Exemplos:** a migração na etapa "Criando categorias" pode ser cancelada; a migração concluída não oferece cancelamento.
- **Relacionados:** RF026, RI003

### RN008 — Migração interrompida sem alteração
- **Enunciado:** Uma migração cancelada ou com falha não pode deixar alteração na estrutura do workspace.
- **Tipo:** Comportamento (restrição)
- **Estabilidade:** Estática
- **Formato:** Frase
- **Justificativa:** a tela diz "Nada foi migrado." nos 2 casos (F5); a frase só é verdadeira se o back-end garantir.
- **Origem:** F5
- **Dono:** back-end
- **Prioridade:** Essencial
- **Status:** Rascunho (aguarda P2)
- **Exemplos:** uma migração com falha na etapa "Criando campos e listas" não deixa nenhuma categoria nova no workspace.
- **Relacionados:** RF028, RF029

### RN009 — Abrangência da migração e da prévia
- **Enunciado:** Cada tipo de entidade que o arquivo de estrutura leva deve entrar na migração e na prévia.
- **Tipo:** Comportamento (restrição)
- **Estabilidade:** Dinâmica (vale também para tipo de entidade que a exportação passar a levar)
- **Formato:** Frase
- **Justificativa:** a pessoa só decide com segurança se a prévia mostra tudo o que a migração muda (F10). Os requisitos não listam os tipos um a um.
- **Origem:** F7, F10
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **Exemplos:** o fluxo da categoria, levado pelo arquivo, aparece na prévia com as etapas (F7). Um tipo de entidade novo que a exportação passar a levar aparece na prévia sem requisito novo.
- **Relacionados:** RN002, RF014, RF018

## Requisitos funcionais

### Tela Casos de Uso

### RF001 — Abrir a camada de importação
- **Enunciado:** Quando o membro clica em Importar Workspace, o sistema deve abrir a camada "Importar estrutura" no passo Arquivo e modo, sem iniciar migração.
- **Justificativa:** hoje o clique abre o seletor de arquivos e a importação começa sem escolha nem prévia (F2).
- **Origem:** F1, F2, F6
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — O clique abre a camada e não importa. Fonte: F6.
  Exemplo: Dado o workspace "Jurídico Exemplo" com 5 categorias, quando o membro clica em Importar Workspace, então a camada mostra o título "Importar estrutura", a descrição "Traga categorias, campos e formulários de outro workspace.", os passos "Arquivo e modo" e "Revisar", e o workspace continua com 5 categorias.
- **Comportamento indesejado:** pergunta P7 (membro sem permissão de importar).
- **Relacionados:** RF002

### RF031 — Trocar o aviso de duplicação
- **Enunciado:** O sistema deve exibir, abaixo do cartão "Migração de Workspace", o aviso informativo com o título "Nada é duplicado" e o texto "O sistema reconhece as categorias que já existem. Você escolhe se elas são alteradas ou não.", no lugar do aviso de duplicação.
- **Justificativa:** o aviso de hoje descreve a duplicação que a RN003 elimina (F2).
- **Nota da revisão:** o pronome "elas" no enunciado está dentro do texto literal da tela aprovada.
- **Origem:** F2, F6
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — O aviso de duplicação sai. Fonte: F6.
  Exemplo: Dado a tela Casos de Uso aberta, quando ela carrega, então o texto "Se o arquivo contiver categorias já cadastradas, elas serão duplicadas." não aparece e o aviso "Nada é duplicado" aparece.
- **CA2** — O texto do bloco Importar explica a escolha. Fonte: F6.
  Exemplo: Dado a tela Casos de Uso aberta, quando ela carrega, então o bloco Importar diz "Envie o arquivo da exportação. Antes de importar, você escolhe o que fazer com o que já existe e revisa as alterações."
- **Comportamento indesejado:** não se aplica: texto fixo, sem condição.
- **Relacionados:** RN003

### Arquivo e modo

### RF002 — Receber o arquivo da estrutura
- **Enunciado:** O sistema deve permitir que o membro envie o arquivo de estrutura arrastando o arquivo para a área do passo Arquivo e modo ou escolhendo o arquivo no computador.
- **Justificativa:** o pedido inclui a área de arraste (F1).
- **Origem:** F1, F6
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — A área de arraste explica o que enviar. Fonte: F6.
  Exemplo: Dado o passo Arquivo e modo sem arquivo, quando a camada abre, então a área mostra "Arraste o arquivo da estrutura até aqui" e "Ou clique para escolher. Use o arquivo .json baixado em Exportar Workspace."
- **CA2** — Arrastar e escolher dão o mesmo resultado. Fonte: F6.
  Exemplo: Dado o arquivo `estructural_export_matriz-contencioso_2026-10-01T12_48_37.json`, quando o membro solta o arquivo na área, então o resumo de RF004 aparece, como quando o membro escolhe o mesmo arquivo pelo seletor.
- **Comportamento indesejado:** RF003.
- **Relacionados:** RF003, RF004

### RF003 — Recusar arquivo que não é estrutura
- **Enunciado:** Se o arquivo enviado não é um arquivo de estrutura, então o sistema deve exibir no passo Arquivo e modo o aviso de erro "Esse arquivo não é uma estrutura do ENSPACE" com o texto "Use o arquivo .json baixado em Exportar Workspace, sem editar."
- **Justificativa:** a pessoa precisa saber que o arquivo errado não serve antes de seguir.
- **Origem:** F6
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — Arquivo de outro formato é recusado. Fonte: F6.
  Exemplo: Dado o arquivo `relatorio.pdf`, quando o membro solta o arquivo na área, então aparece o aviso "Esse arquivo não é uma estrutura do ENSPACE", a área continua disponível e o botão Continuar continua desabilitado.
- **Comportamento indesejado:** é o próprio comportamento indesejado de RF002. Limite de tamanho em P8; arquivo antigo em P12.
- **Relacionados:** RF002

### RF004 — Mostrar o resumo do arquivo lido
- **Enunciado:** Quando o arquivo de estrutura termina de ser lido, o sistema deve exibir o nome do arquivo, o workspace de origem, a data e a hora da exportação e a quantidade de entidades por tipo.
- **Justificativa:** a pessoa confere que enviou o arquivo certo antes de escolher o modo.
- **Origem:** F6, F7
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — O resumo mostra origem, data e quantidades. Fonte: F6.
  Exemplo: Dado o arquivo exportado de "Matriz Contencioso" em 01/10/2026 às 12:48, com 8 categorias, 37 campos, 13 formulários e 8 etapas de fluxo, quando a leitura termina, então o resumo diz "Estrutura de Matriz Contencioso, exportada em 01/10/2026, 12:48" e mostra as quantidades.
- **CA2** — Tipo de entidade ausente no arquivo não aparece com zero. Fonte: F7.
  Exemplo: Dado um arquivo sem fluxo da categoria, quando a leitura termina, então o resumo não mostra "etapas de fluxo".
- **Comportamento indesejado:** RF003.
- **Relacionados:** RF002, RF005, RN009

### RF005 — Trocar o arquivo
- **Enunciado:** Quando o membro clica em Trocar arquivo, o sistema deve voltar à área de arraste e ocultar o modo de importação.
- **Justificativa:** a pessoa corrige o arquivo sem fechar a camada.
- **Origem:** F6
- **Dono:** produto
- **Prioridade:** Desejável
- **Status:** Acordado
- **CA1** — Trocar volta ao início do passo. Fonte: F6.
  Exemplo: Dado o resumo do arquivo na tela, quando o membro clica em Trocar arquivo, então a área de arraste volta e o campo Modo de importação some.
- **Comportamento indesejado:** não se aplica: a ação não depende de dado.
- **Relacionados:** RF004

### RF006 — Exibir o modo de importação
- **Enunciado:** Quando o arquivo de estrutura termina de ser lido, o sistema deve exibir o campo Modo de importação com as opções Somente inclusão, Inclusão e atualização e Substituição total, cada uma com a descrição da RN002.
- **Justificativa:** o pedido é que a pessoa diga a escolha dela (F1); os nomes seguem F5.
- **Origem:** F1, F5, F6
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — As 3 opções aparecem com a descrição. Fonte: F6.
  Exemplo: Dado o arquivo lido, quando o resumo aparece, então o campo mostra "Somente inclusão: Cria o que não existe no workspace e mantém o restante.", "Inclusão e atualização: Cria o que não existe e atualiza o que já existe. Não remove nada." e "Substituição total: Deixa o workspace igual ao arquivo."
- **CA2** — O modo não aparece antes da leitura. Fonte: F6.
  Exemplo: Dado o passo Arquivo e modo sem arquivo, quando a camada abre, então o campo Modo de importação não aparece.
- **Comportamento indesejado:** RF003.
- **Relacionados:** RN002, RF007, RF008, RF009

### RF007 — Marcar Somente inclusão por padrão
- **Enunciado:** Quando o campo Modo de importação aparece num workspace com estrutura, o sistema deve marcar Somente inclusão e exibir nela o selo "Recomendado".
- **Justificativa:** o modo que não altera nem remove é o mais seguro; o modo que remove não vem marcado (F6, `PESQUISA.md`).
- **Origem:** F6
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — Somente inclusão vem marcada. Fonte: F6.
  Exemplo: Dado o workspace "Jurídico Exemplo" com 5 categorias e o arquivo lido, quando o modo aparece, então Somente inclusão está marcada e tem o selo "Recomendado".
- **Comportamento indesejado:** RF008 (workspace vazio).
- **Relacionados:** RF006, RF008

### RF008 — Travar o modo no workspace vazio
- **Enunciado:** Enquanto o workspace de destino é um workspace vazio, o sistema deve marcar Somente inclusão, desabilitar Inclusão e atualização e Substituição total, ocultar o selo "Recomendado" e exibir "Workspace vazio: todo o conteúdo do arquivo é incluído.", conforme RN004.
- **Justificativa:** no workspace vazio só há 1 escolha possível (F5).
- **Origem:** F5
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — As outras 2 opções ficam desabilitadas. Fonte: F5.
  Exemplo: Dado um workspace sem entidade de estrutura e o arquivo lido, quando o modo aparece, então Somente inclusão está marcada, Inclusão e atualização e Substituição total não podem ser escolhidas, e a linha "Workspace vazio: todo o conteúdo do arquivo é incluído." aparece.
- **Comportamento indesejado:** não se aplica: o estado vem do workspace, sem ação do membro.
- **Relacionados:** RN004, RF021

### RF009 — Alertar a remoção na Substituição total
- **Enunciado:** Quando o membro escolhe Substituição total, o sistema deve exibir abaixo das opções o aviso de erro "Remove tudo o que não está no arquivo, inclusive os itens cadastrados.", sem a quantidade de itens.
- **Justificativa:** o modo remove itens cadastrados; o aviso não conta itens por pedido da redatora (F4).
- **Origem:** F4, F6
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — O aviso aparece só na Substituição total. Fonte: F4.
  Exemplo: Dado o arquivo lido, quando o membro escolhe Substituição total, então o aviso aparece; quando o membro volta para Somente inclusão, então o aviso some.
- **Comportamento indesejado:** pergunta P3 (destino dos itens removidos muda o texto).
- **Relacionados:** RN002.8, RF024

### RF010 — Bloquear o avanço sem arquivo lido
- **Enunciado:** Enquanto o arquivo de estrutura não terminou de ser lido, o sistema deve desabilitar o botão Continuar do passo Arquivo e modo.
- **Justificativa:** sem arquivo, não há prévia.
- **Origem:** F6
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — Continuar só funciona com o arquivo lido. Fonte: F6.
  Exemplo: Dado o passo Arquivo e modo sem arquivo, quando o membro tenta clicar em Continuar, então o botão não responde; dado o arquivo lido, quando o membro clica em Continuar, então o passo Revisar abre.
- **Comportamento indesejado:** RF003.
- **Relacionados:** RF002, RF011

### Revisão

### RF011 — Calcular a prévia
- **Enunciado:** Quando o membro clica em Continuar no passo Arquivo e modo, o sistema deve calcular a situação de cada entidade do arquivo e do workspace conforme RN001, RN002 e RN009, para o modo escolhido, sem alterar o workspace.
- **Justificativa:** o pedido é ver o que muda antes de confirmar (F1).
- **Origem:** F1, F6
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — A prévia segue a RN002. Fonte: F6.
  Exemplo: Dado o workspace "Jurídico Exemplo" e o arquivo de "Matriz Contencioso", quando o membro escolhe Inclusão e atualização e clica em Continuar, então "Processos judiciais" aparece Alterada, "Garantias" aparece Nova e "Contratos de honorários" não aparece (linha 7 da RN002).
- **CA2** — Calcular a prévia não muda o workspace. Fonte: F6.
  Exemplo: Dado o workspace com 5 categorias, quando a prévia aparece, então o workspace continua com 5 categorias.
- **Comportamento indesejado:** pergunta P11 (tempo de cálculo) e RI002 (erro da rota).
- **Relacionados:** RN001, RN002, RN009, RI002

### RF012 — Mostrar os contadores da prévia
- **Enunciado:** Quando a prévia é calculada, o sistema deve exibir os contadores Novos, Alterados, Removidos e Inalterados, com a quantidade de categorias e de entidades fora das categorias em cada situação.
- **Justificativa:** a pessoa entende o tamanho da mudança antes do detalhe (F4).
- **Origem:** F4, F6
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — Os contadores somam categorias e entidades fora delas. Fonte: F6.
  Exemplo: Dado a prévia na Inclusão e atualização com o arquivo de "Matriz Contencioso", quando ela aparece, então os contadores mostram 15 Novos, 3 Alterados, 0 Removidos e 9 Inalterados, e o contador zerado aparece esmaecido.
- **Comportamento indesejado:** RF022 (nada a importar).
- **Relacionados:** RF011, RF013

### RF013 — Mostrar só as alterações
- **Enunciado:** O sistema deve exibir na lista da prévia só as entidades nas situações Novo, Alterado e Removido, com a frase "A lista mostra só as alterações." acima da lista.
- **Justificativa:** a lista mostra só a diferença, sem chave de filtro (F4).
- **Origem:** F4
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — A entidade inalterada fica fora da lista. Fonte: F4.
  Exemplo: Dado a categoria "Partes", igual nos 2 lados, quando a prévia aparece, então "Partes" não está na lista e conta em Inalterados.
- **Comportamento indesejado:** não se aplica: a regra vale para cada prévia.
- **Relacionados:** RF012

### RF014 — Organizar a lista da prévia
- **Enunciado:** O sistema deve organizar a lista da prévia em Categorias, com cada entidade que pertence a uma categoria agrupada por tipo dentro dela, e em Outros componentes, com cada entidade fora das categorias agrupada por tipo, cobrindo cada tipo de entidade da RN009.
- **Justificativa:** a pessoa lê a mudança na estrutura que ela conhece, sem JSON (F1); a lista mostra toda entidade migrada (F10).
- **Origem:** F1, F6, F10
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — A categoria abre nos grupos por tipo, com o total e as quantidades. Fonte: F6.
  Exemplo: Dado "Processos judiciais" na Substituição total, quando a prévia aparece, então a categoria mostra "Campos (12) +3 ~3 −1", "Formulários (3) +1", "Pastas (3) +1" e "Fluxo (5 etapas) +1 ~1 −1".
- **CA2** — Nenhum tipo de entidade do arquivo fica fora da lista. Fonte: F10.
  Exemplo: Dado um arquivo em que cada tipo de entidade tem ao menos 1 entidade nova, quando a prévia aparece na Somente inclusão, então cada tipo aparece em algum grupo da lista.
- **CA3** — A categoria alterada abre expandida; a nova e a removida vêm recolhidas. Fonte: F6.
  Exemplo: Dado a prévia, quando ela aparece, então "Processos judiciais" (Alterada) está expandida e "Garantias" (Nova) está recolhida.
- **Comportamento indesejado:** pergunta P6 (Spaceflow fora do arquivo).
- **Relacionados:** RN009, RF015, RF018

### RF015 — Descrever cada alteração em estrutura
- **Enunciado:** O sistema deve exibir em cada entidade da prévia a situação, com ícone, cor e texto concordando em gênero com a entidade, e, na entidade Alterada, cada propriedade que muda no formato "<propriedade>: <valor atual riscado> → <valor do arquivo>".
- **Justificativa:** a diferença se lê em estrutura, não em código (F1); as marcas seguem F4.
- **Origem:** F1, F4, F6
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — A mudança de nome aparece como antes e depois. Fonte: F6.
  Exemplo: Dado o campo `vara` com o rótulo "Vara" no workspace e "Vara ou tribunal" no arquivo, na Inclusão e atualização, quando a prévia aparece, então o campo mostra "Nome: Vara → Vara ou tribunal" e a marca "Alterado".
- **CA2** — A mudança de tipo usa o nome que a pessoa conhece. Fonte: F6.
  Exemplo: Dado o campo "Observações" que passa de `EnTextArea` para `EnHtml`, quando a prévia aparece, então o campo mostra "Tipo: Texto longo → Texto com formatação", sem o nome técnico.
- **CA3** — Opções novas aparecem em lista. Fonte: F6.
  Exemplo: Dado o campo "Comarca" com "Curitiba" e "Porto Alegre" só no arquivo, quando a prévia aparece, então o campo mostra "Opções novas: Curitiba, Porto Alegre".
- **CA4** — A marca concorda com a entidade. Fonte: F4.
  Exemplo: Dado a categoria "Garantias" e o campo "Instância", só no arquivo, quando a prévia aparece, então a categoria mostra "Nova" e o campo mostra "Novo".
- **Comportamento indesejado:** não se aplica: a descrição vem da prévia já calculada.
- **Relacionados:** RF011, RF016

### RF016 — Mostrar o tipo pelo nome da tela
- **Enunciado:** O sistema deve exibir, ao lado do nome de cada entidade da prévia que tem tipo, o tipo pelo nome usado na tela de configuração daquela entidade.
- **Justificativa:** a pessoa não reconhece `EnlDropdown` nem `inputText` (F1: "o user é leigo e nao pode ver json").
- **Origem:** F1, F6
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — O tipo técnico não aparece. Fonte: F6.
  Exemplo: Dado o campo "Comarca" do tipo `EnlDropdown`, quando a prévia aparece, então o campo mostra "Lista de opções".
- **Comportamento indesejado:** tipo sem nome mapeado aparece como "Outro tipo".
- **Relacionados:** RF015

### RF017 — Mostrar os itens da categoria removida
- **Enunciado:** Quando a prévia tem uma categoria na situação Removido, o sistema deve exibir o nome da categoria riscado e, em vermelho, a quantidade de itens cadastrados nela.
- **Justificativa:** a pessoa vê o que perde antes de confirmar.
- **Origem:** F6
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — A categoria removida mostra os itens. Fonte: F6.
  Exemplo: Dado a categoria "Contratos de honorários advocatícios com escritórios parceiros", com 48 itens, só no workspace, na Substituição total, quando a prévia aparece, então a categoria aparece riscada com "48 itens cadastrados" e a marca "Removida".
- **Comportamento indesejado:** pergunta P3.
- **Relacionados:** RN002.8, RI002

### RF018 — Mostrar o fluxo da categoria na prévia
- **Enunciado:** Quando a categoria tem etapas nas situações Novo, Alterado ou Removido, o sistema deve exibir no grupo Fluxo as etapas na ordem do fluxo e, dentro de cada etapa, as entidades da etapa que mudam.
- **Justificativa:** o fluxo da categoria entra na comparação (F7); a etapa organiza o que pertence a ela.
- **Origem:** F7
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Em revisão
- **CA1** — A etapa renomeada mostra o nome antes e depois. Fonte: F7.
  Exemplo: Dado a etapa `analise` com o nome "Análise" no workspace e "Análise de mérito" no arquivo, na Inclusão e atualização, quando a prévia aparece, então a etapa mostra "Nome: Análise → Análise de mérito" e a marca "Alterada".
- **CA2** — A tarefa da etapa mostra a mudança de responsável. Fonte: F7.
  Exemplo: Dado a tarefa "Emitir parecer" com o responsável "Advogado responsável" no workspace e "Coordenação jurídica" no arquivo, quando a prévia aparece, então a tarefa mostra "Responsável: Advogado responsável → Coordenação jurídica".
- **CA3** — A categoria sem fluxo recebe o fluxo inteiro como novo. Fonte: F7.
  Exemplo: Dado "Audiências" sem fluxo no workspace e com as etapas "Agendada" e "Realizada" no arquivo, na Somente inclusão, quando a prévia aparece, então o grupo mostra "Fluxo (2 etapas) +2" e as 2 etapas como "Nova".
- **Comportamento indesejado:** RF020 (referência quebrada).
- **Relacionados:** RN002, RN009, RF019, RF020

### RF019 — Mostrar itens e tarefas da etapa removida
- **Enunciado:** Quando a prévia tem uma etapa na situação Removido, o sistema deve exibir o nome da etapa riscado e, em vermelho, a quantidade de itens na etapa e de tarefas abertas dela.
- **Justificativa:** remover uma etapa afeta os itens parados nela e as tarefas abertas.
- **Origem:** F7 (protótipo de 20/10/2026)
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Em revisão (P10)
- **CA1** — A etapa removida mostra itens e tarefas. Fonte: F7.
  Exemplo: Dado a etapa "Revisão jurídica" com 12 itens e 4 tarefas abertas, só no workspace, na Substituição total, quando a prévia aparece, então a etapa aparece riscada com "12 itens nesta etapa" e "4 tarefas abertas".
- **Comportamento indesejado:** pergunta P4.
- **Relacionados:** RN002.8, RF018

### RF020 — Avisar a referência quebrada
- **Enunciado:** Se uma entidade que a migração cria ou altera cita um membro ou outra entidade que não existe no workspace de destino, então o sistema deve exibir abaixo da entidade o aviso "Aponta para <nome>, que não existe neste workspace."
- **Justificativa:** a pessoa vê a referência quebrada antes de importar.
- **Origem:** F7 (protótipo de 20/10/2026); S4
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Em revisão (P10)
- **CA1** — A regra que cita membro de outro workspace avisa. Fonte: F7.
  Exemplo: Dado a regra de responsável "Diretoria aprova acima de R$ 100 mil", da etapa nova "Aprovação da diretoria", que cita a membro Carla Mendes, ausente do workspace de destino, quando a prévia aparece, então a regra mostra "Aponta para Carla Mendes, que não existe neste workspace."
- **CA2** — As etapas que mudam abrem expandidas, para o aviso ficar à vista. Fonte: F7.
  Exemplo: Dado a mesma prévia, quando ela aparece, então a etapa "Aprovação da diretoria" está expandida.
- **Comportamento indesejado:** é o próprio comportamento indesejado de RF018. Destino da tarefa em P5.
- **Relacionados:** RF018, S4

### RF021 — Mostrar a lista simples no workspace vazio
- **Enunciado:** Enquanto o workspace de destino é um workspace vazio, o sistema deve exibir no passo Revisar o título "Workspace vazio", o texto "A importação adiciona:" e a lista das categorias do arquivo com a quantidade de campos de cada uma, no lugar dos contadores e da árvore.
- **Justificativa:** a comparação aparece só quando é necessária (F1).
- **Origem:** F1, F6
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — O workspace vazio vê a lista do que entra. Fonte: F6.
  Exemplo: Dado um workspace vazio e o arquivo com 8 categorias, quando o passo Revisar abre, então aparecem "Workspace vazio", "A importação adiciona:" e as 8 categorias, e não aparecem os contadores.
- **Comportamento indesejado:** não se aplica: o estado vem do workspace.
- **Relacionados:** RF008, RF032

### RF032 — Mostrar a lista simples quando nada é comum
- **Enunciado:** Enquanto as entidades do arquivo não têm correspondente no workspace e o modo não é Substituição total, o sistema deve exibir no passo Revisar o título "Nenhuma categoria do arquivo existe aqui", o texto "A importação adiciona tudo e não altera o que já existe:" e a lista das categorias do arquivo, no lugar dos contadores e da árvore.
- **Justificativa:** sem entidade em comum, a prévia é só a lista do que entra (F1).
- **Nota da revisão:** "Nenhuma" no enunciado está dentro do título literal da tela.
- **Origem:** F1, F6
- **Dono:** produto
- **Prioridade:** Desejável
- **Status:** Acordado
- **CA1** — Sem nada em comum, a lista é simples. Fonte: F6.
  Exemplo: Dado um workspace com a categoria "Compras" e um arquivo só com "Garantias" e "Multas", na Somente inclusão, quando o passo Revisar abre, então aparecem o título "Nenhuma categoria do arquivo existe aqui" e as 2 categorias.
- **Comportamento indesejado:** na Substituição total, vale RF014, porque o modo remove o que existe.
- **Relacionados:** RF021

### RF022 — Avisar que não há nada a importar
- **Enunciado:** Se a prévia não tem entidade nas situações Novo, Alterado ou Removido, então o sistema deve exibir o aviso "Nada a importar" com o texto "O workspace já tem tudo o que está no arquivo." e oferecer só o botão Fechar.
- **Justificativa:** importar sem diferença não muda a estrutura.
- **Origem:** F6
- **Dono:** produto
- **Prioridade:** Desejável
- **Status:** Acordado
- **CA1** — Arquivo igual ao workspace não oferece Importar. Fonte: F6.
  Exemplo: Dado o arquivo exportado do próprio workspace "Jurídico Exemplo", quando o passo Revisar abre, então aparece "Nada a importar" e o botão Importar não aparece.
- **Comportamento indesejado:** é o próprio comportamento indesejado de RF011.
- **Relacionados:** RF011

### Confirmação

### RF023 — Oferecer a cópia do workspace antes de importar
- **Enunciado:** Enquanto o workspace de destino tem estrutura, o sistema deve exibir no passo Revisar a opção "Baixar uma cópia do workspace antes", marcada, com a ajuda "Depois de concluída, a migração não tem como ser desfeita."
- **Justificativa:** a migração concluída não se desfaz (RN006); a cópia é a volta possível.
- **Origem:** F5, F6
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — Marcada, a cópia é baixada antes da migração. Fonte: F6.
  Exemplo: Dado a opção marcada, quando o membro clica em Importar, então o navegador baixa o arquivo de estrutura do workspace "Jurídico Exemplo" antes de a migração começar.
- **CA2** — No workspace vazio, a opção não aparece. Fonte: F6.
  Exemplo: Dado um workspace vazio, quando o passo Revisar abre, então a opção não aparece.
- **Comportamento indesejado:** pergunta P13.
- **Relacionados:** RN006, RF027

### RF024 — Pedir o e-mail na Substituição total
- **Enunciado:** Enquanto o modo é Substituição total e a prévia tem ao menos 1 entidade na situação Removido, o sistema deve exibir o aviso de erro com o título "Remove tudo o que não está no arquivo, inclusive os itens cadastrados.", o texto "Para confirmar, digite seu e-mail:", o e-mail do membro logado e o campo para digitá-lo, conforme RN005.
- **Justificativa:** a confirmação segue o padrão da exclusão de categoria (F8).
- **Origem:** F6, F8
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — O botão só libera com o e-mail certo. Fonte: F6.
  Exemplo: Dado o membro ana.souza@exemplo.com.br na Substituição total com 1 categoria removida, quando o membro digita "ana.souza@exemplo.com.br", então o campo mostra ✓ e o botão "Substituir workspace", na cor de erro, fica habilitado.
- **CA2** — Nos outros modos, não há pedido de e-mail. Fonte: F6.
  Exemplo: Dado a Inclusão e atualização, quando o passo Revisar abre, então o botão se chama "Importar", na cor primária, sem campo de e-mail.
- **Comportamento indesejado:** e-mail diferente mantém o botão desabilitado (RN005).
- **Relacionados:** RN005, RF009

### RF033 — Voltar ao passo Arquivo e modo
- **Enunciado:** Quando o membro clica em Voltar no passo Revisar, o sistema deve abrir o passo Arquivo e modo com o arquivo e o modo escolhidos.
- **Justificativa:** a troca de modo é feita pelo Voltar, sem botão próprio na revisão (F4).
- **Origem:** F4
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — Voltar mantém as escolhas. Fonte: F4.
  Exemplo: Dado o arquivo de "Matriz Contencioso" e a Substituição total no passo Revisar, quando o membro clica em Voltar, então o passo Arquivo e modo mostra o mesmo arquivo e a Substituição total marcada.
- **Comportamento indesejado:** não se aplica: a ação não depende de dado.
- **Relacionados:** RF006

### Migração

### RF025 — Mostrar o andamento da migração
- **Enunciado:** Enquanto a migração está em andamento, o sistema deve exibir "Importando a estrutura", "Isso leva alguns minutos em workspaces grandes.", a barra com a porcentagem e as etapas "Conferindo o arquivo", "Criando categorias", "Criando campos e listas", "Montando formulários e telas" e "Ajustando permissões e menus", com a etapa concluída, a atual e as próximas diferenciadas.
- **Justificativa:** a redatora manteve o carregamento com etapas (F5).
- **Nota da revisão:** "Isso" e "alguns" no enunciado estão dentro do texto literal da tela aprovada.
- **Origem:** F5, F6; etapa do back-end em S3
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado (P9 sobre a etapa do fluxo)
- **CA1** — A etapa atual fica destacada. Fonte: F6.
  Exemplo: Dado a migração na etapa "Criando campos e listas", quando a camada está aberta, então "Conferindo o arquivo" e "Criando categorias" mostram ✓, "Criando campos e listas" mostra o ícone girando e a barra mostra 40%.
- **CA2** — Fechar a camada não interrompe a migração. Fonte: F6.
  Exemplo: Dado a migração em andamento, quando o membro clica em Fechar, então a migração continua e a camada, reaberta, mostra o andamento.
- **Comportamento indesejado:** RF029.
- **Relacionados:** RF026, RF030, RI004

### RF026 — Cancelar a migração em andamento
- **Enunciado:** Enquanto a migração está em andamento, o sistema deve permitir que o membro cancele a migração pelo botão "Cancelar migração", conforme RN007.
- **Justificativa:** cancelar é a única interrupção da migração (F5).
- **Origem:** F5
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — O botão aparece durante o andamento. Fonte: F5.
  Exemplo: Dado a migração em andamento, quando a camada está aberta, então o rodapé mostra "Cancelar migração", com contorno na cor de erro, e "Fechar".
- **Comportamento indesejado:** RF028 mostra o resultado; P2 cobre migração que não volta atrás.
- **Relacionados:** RN007, RN008, RF028, RI003

### RF027 — Mostrar a migração concluída
- **Enunciado:** Quando a migração termina sem falha, o sistema deve exibir "Migração concluída", o resumo das categorias novas, alteradas e removidas sem as quantidades zeradas e o botão "Ver categorias".
- **Justificativa:** a pessoa confirma o resultado sem abrir cada categoria.
- **Origem:** F5, F6
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — O resumo omite o que é zero. Fonte: F6.
  Exemplo: Dado a migração de 8 categorias novas num workspace vazio, quando ela termina, então a camada diz "8 categorias novas.", sem "0 categorias alteradas".
- **CA2** — Com a cópia, a camada lembra onde está o arquivo. Fonte: F6.
  Exemplo: Dado a opção de cópia marcada (RF023), quando a migração termina, então a camada diz "A cópia de antes da importação está na sua pasta de downloads."
- **CA3** — Não há desfazer. Fonte: F5.
  Exemplo: Dado a migração concluída, quando a camada mostra o resultado, então nenhum botão desfaz a migração.
- **Comportamento indesejado:** RF029.
- **Relacionados:** RN006, RF030

### RF028 — Mostrar a migração cancelada
- **Enunciado:** Quando a migração é cancelada, o sistema deve exibir "Migração cancelada", o texto "Nada foi migrado." e o botão Fechar.
- **Justificativa:** a pessoa sabe que o workspace ficou como estava (RN008).
- **Origem:** F5
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — Cancelar deixa o workspace como estava. Fonte: F5.
  Exemplo: Dado a migração cancelada na etapa "Criando categorias", quando a camada mostra o resultado, então aparece "Migração cancelada. Nada foi migrado." e o workspace tem as mesmas 5 categorias de antes.
- **Comportamento indesejado:** pergunta P2.
- **Relacionados:** RN007, RN008, RF026

### RF029 — Mostrar a falha da migração
- **Enunciado:** Se a migração falha, então o sistema deve exibir o aviso de erro "A migração falhou" com o texto "Nada foi migrado.", sem a etapa em que parou, e os botões Fechar e "Tentar de novo".
- **Justificativa:** o produto não informa onde a migração parou (F5).
- **Origem:** F5
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **CA1** — A falha não cita etapa. Fonte: F5.
  Exemplo: Dado a migração que falha na etapa "Criando campos e listas", quando a camada mostra o resultado, então aparece "A migração falhou. Nada foi migrado." e o nome da etapa não aparece.
- **CA2** — Tentar de novo repete a migração. Fonte: F6.
  Exemplo: Dado a falha, quando o membro clica em "Tentar de novo", então a migração recomeça com o mesmo arquivo e o mesmo modo.
- **Comportamento indesejado:** é o próprio comportamento indesejado de RF025.
- **Relacionados:** RN008, RF030

### RF030 — Avisar no sino o fim da migração
- **Enunciado:** Quando a migração termina concluída ou com falha, o sistema deve enviar ao sino do membro que iniciou a migração o aviso com o resultado.
- **Justificativa:** a camada diz "Pode fechar esta janela. Avisamos no sino quando terminar." (F6).
- **Origem:** F6
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — O sino avisa o fim. Fonte: F6.
  Exemplo: Dado o membro ana.souza@exemplo.com.br que fechou a camada durante a migração, quando a migração termina, então o sino de ana.souza@exemplo.com.br mostra o aviso com "Migração concluída" ou "A migração falhou".
- **Comportamento indesejado:** pergunta P9 (texto do aviso).
- **Relacionados:** RF025, RF027, RF029

## Interfaces

### RI001 — Pedido de migração com o modo
- **Enunciado:** Quando o membro confirma a migração, a rota `POST /migration-requests` deve receber o arquivo de estrutura e o modo de importação, no campo `<a definir>` com os valores `<a definir>` para Somente inclusão, Inclusão e atualização e Substituição total.
- **Justificativa:** a rota existe (F2), sem o modo.
- **Origem:** F2, F6
- **Dono:** back-end
- **Prioridade:** Essencial
- **Status:** Rascunho
- **Contrato:** `POST /migration-requests`, `type=structure`; campo do modo `<a definir>`.
- **CA1** — Os 3 modos chegam ao back-end. Fonte: F6.
  Exemplo: Dado o mesmo arquivo, quando o membro confirma em Somente inclusão e depois em Substituição total, então os 2 pedidos levam modos diferentes e produzem estruturas diferentes (RN002).
- **Relacionados:** RN002, RF011

### RI002 — Prévia da migração
- **Enunciado:** Quando o sistema pede a prévia de um arquivo de estrutura e de um modo, a rota `<a definir>` deve devolver a situação de cada entidade conforme RN002 e RN009, a quantidade de itens das categorias removidas e de itens e tarefas abertas das etapas removidas, sem alterar o workspace.
- **Justificativa:** RF011, RF017 e RF019 dependem dessa resposta.
- **Origem:** F6, F7; S2
- **Dono:** back-end
- **Prioridade:** Essencial
- **Status:** Rascunho
- **Contrato:** `<a definir>`.
- **CA1** — A prévia não muda o workspace. Fonte: F6.
  Exemplo: Dado o workspace com 5 categorias, quando a rota devolve a prévia da Substituição total, então o workspace continua com 5 categorias.
- **Relacionados:** RN001, RN002, RN009, RF011

### RI003 — Cancelamento da migração
- **Enunciado:** Quando o membro cancela a migração em andamento, a rota `<a definir>` deve interromper a migração e devolver o status cancelado.
- **Justificativa:** RF026 e RN007.
- **Origem:** F5
- **Dono:** back-end
- **Prioridade:** Essencial
- **Status:** Rascunho
- **Contrato:** `<a definir>`.
- **CA1** — O cancelamento interrompe a migração. Fonte: F5.
  Exemplo: Dado a migração na etapa "Criando categorias", quando a rota recebe o cancelamento, então a migração passa ao status cancelado e a estrutura do workspace fica como antes (RN008).
- **Relacionados:** RN007, RN008, RF026, RI005

### RI005 — Cancelamento recusado depois do fim
- **Enunciado:** Se a rota de cancelamento recebe o pedido de uma migração concluída ou com falha, então a rota deve devolver erro com o status HTTP `<a definir>`.
- **Justificativa:** a migração só se cancela em andamento (RN007).
- **Origem:** F5
- **Dono:** back-end
- **Prioridade:** Importante
- **Status:** Rascunho
- **Contrato:** `<a definir>`.
- **CA1** — Migração concluída não se cancela. Fonte: F5.
  Exemplo: Dado a migração concluída, quando a rota recebe o cancelamento, então devolve erro e a estrutura não muda.
- **Relacionados:** RN007, RI003

### RI004 — Andamento da migração
- **Enunciado:** Quando o sistema consulta a migração em andamento, a rota `GET /migration-requests?status_in=pending&status_in=processing&type=structure` deve devolver a etapa atual da migração, no campo `<a definir>`.
- **Justificativa:** RF025 mostra a etapa; hoje a rota devolve só o status (F2).
- **Origem:** F2, F5; S3
- **Dono:** back-end
- **Prioridade:** Importante
- **Status:** Rascunho
- **Contrato:** `GET /migration-requests`, campo da etapa `<a definir>`.
- **CA1** — A etapa vem na resposta. Fonte: F5.
  Exemplo: Dado a migração criando campos, quando a rota é consultada, então a resposta traz a etapa "Criando campos e listas".
- **Relacionados:** RF025

## Requisitos não funcionais

### RNF001 — Situação legível sem cor
- **Enunciado:** As marcas de situação da prévia devem atender à WCAG 2.2, nível AA, critério 1.4.1 (uso de cor), verificado com a tela em tons de cinza.
- **Característica:** capacidade de interação (acessibilidade)
- **Escala:** marcas que se distinguem sem cor
- **Medidor:** inspeção da tela em tons de cinza
- **Mínimo:** 4 de 4 marcas (Novo, Alterado, Removido, Inalterado) distinguíveis
- **Alvo:** 4 de 4
- **Condição:** temas claro e escuro
- **Fonte do número:** WCAG 2.2, critério 1.4.1
- **Caminho de falha:** marca que depende só de cor ganha ícone e texto.
- **Justificativa:** cada marca tem ícone (+, lápis, −, =) e texto, e o removido vem riscado (F6).
- **Origem:** F6, F9
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **CA1** — As marcas se distinguem em tons de cinza. Fonte: F6.
  Exemplo: Dado a prévia da Substituição total em tons de cinza, quando a pessoa lê a lista, então distingue Novo, Alterado, Removido e Inalterado pelo ícone e pelo texto.
- **Relacionados:** RF015

### RNF002 — Movimento reduzido
- **Enunciado:** A camada de importação deve atender à WCAG 2.2, nível AAA, critério 2.3.3 (animação por interação), desligando as transições quando o sistema operacional pede movimento reduzido.
- **Característica:** capacidade de interação (acessibilidade)
- **Escala:** transições ativas com `prefers-reduced-motion: reduce`
- **Medidor:** inspeção com movimento reduzido ligado no sistema
- **Mínimo:** 0 transições
- **Alvo:** 0 transições
- **Condição:** navegador com `prefers-reduced-motion: reduce`
- **Fonte do número:** WCAG 2.2, critério 2.3.3; regra do repositório de protótipos
- **Caminho de falha:** transição que não respeita a preferência é removida.
- **Justificativa:** a camada tem entrada do modo, troca de passo e cascata da lista (F6).
- **Origem:** F6, F9
- **Dono:** produto
- **Prioridade:** Desejável
- **Status:** Acordado
- **CA1** — As transições param com movimento reduzido. Fonte: F6.
  Exemplo: Dado o movimento reduzido ligado no Windows, quando o membro troca do passo Arquivo e modo para Revisar, então a troca acontece sem deslizamento.
- **Relacionados:** RF006, RF014

**Características sem RNF neste documento**

| Característica (ISO 25010:2023) | Motivo |
|---|---|
| Eficiência de desempenho | Sem número de origem para o tempo da prévia e da migração: pergunta P11. |
| Confiabilidade | Coberta pela RN008 (tudo ou nada); depende de P2. |
| Segurança da informação | Permissão de quem importa em aberto: pergunta P7. |
| Compatibilidade | Arquivos antigos em aberto: pergunta P12. |
| Manutenibilidade, flexibilidade, segurança operacional, adequação funcional | Sem exigência de origem além dos RF. |

## Restrições

### RS001 — Textos em 3 idiomas
- **Enunciado:** Cada texto da camada de importação deve existir em português, inglês e espanhol. Motivo: o ENSPACE é usado nos 3 idiomas. Imposta por: especificação do repositório de protótipos, regra 35 (F9).
- **Justificativa:** os textos de inglês e espanhol estão no `textos.ts` do protótipo.
- **Origem:** F9
- **Dono:** produto
- **Prioridade:** Essencial
- **Status:** Acordado
- **Imposta por:** especificação do repositório de protótipos, regra 35
- **CA1** — Como conferir: trocar o idioma para espanhol troca as marcas, os tipos e os avisos da camada. Fonte: F9.
- **Relacionados:** RF006, RF015

### RS002 — Tema claro e escuro
- **Enunciado:** A camada de importação deve funcionar nos temas claro e escuro. Motivo: o produto oferece os 2 temas. Imposta por: especificação do repositório de protótipos, regra 35 (F9).
- **Justificativa:** marcas, contadores e avisos precisam de contraste nos 2 temas.
- **Origem:** F9
- **Dono:** produto
- **Prioridade:** Importante
- **Status:** Acordado
- **Imposta por:** especificação do repositório de protótipos, regra 35
- **CA1** — Como conferir: com o tema escuro, as 4 marcas e os avisos de erro continuam legíveis. Fonte: F9.
- **Relacionados:** RNF001

### RS003 — Texto de interface sem travessão
- **Enunciado:** Cada texto da camada de importação deve ser escrito sem travessão. Motivo: regra de escrita da interface. Imposta por: especificação do repositório de protótipos, regra 33 (F9).
- **Justificativa:** padrão de texto de interface do repositório.
- **Origem:** F9
- **Dono:** produto
- **Prioridade:** Desejável
- **Status:** Acordado
- **Imposta por:** especificação do repositório de protótipos, regra 33
- **CA1** — Como conferir: os textos da camada não contêm "—" nem "–". Fonte: F9.
- **Relacionados:** RS001

## Rastreabilidade

| Fonte | Requisitos | Regras | Critérios de aceite |
|---|---|---|---|
| F1 (pedido de 01/10/2026) | RF001, RF002, RF006, RF011, RF014, RF015, RF016, RF021, RF032 | RN001, RN002 | RF002.CA1, RF006.CA1, RF011.CA1, RF015.CA1 a CA3 |
| F2 (develop de 01/10/2026) | RF001, RF031, RI001, RI004 | RN001, RN003 | RF001.CA1, RF031.CA1 |
| F4 (rodadas 2 a 4) | RF009, RF012, RF013, RF015, RF033 | RN002 | RF009.CA1, RF013.CA1, RF015.CA4, RF033.CA1 |
| F5 (rodada 5 e fechamento, 14/10/2026) | RF006, RF008, RF023, RF025, RF026, RF027, RF028, RF029, RI003, RI005 | RN004, RN006, RN007, RN008 | RF008.CA1, RF026.CA1, RF027.CA3, RF028.CA1, RF029.CA1 |
| F6 (protótipo aprovado) | RF001 a RF017, RF021 a RF033, RI001, RI002, RNF001, RNF002 | RN002, RN003, RN005 | demais CA |
| F7 (fluxo, 20/10/2026) | RF004, RF018, RF019, RF020, RI002 | RN002, RN009 | RF004.CA2, RF018.CA1 a CA3, RF019.CA1, RF020.CA1 e CA2 |
| F8 (exclusão de categoria) | RF024 | RN005 | RF024.CA1 |
| F9 (especificação dos protótipos) | RS001, RS002, RS003, RNF001, RNF002 | | RS001.CA1, RS002.CA1, RS003.CA1 |
| F10 (abrangência, 20/10/2026) | RF014 | RN009 | RF014.CA2 |

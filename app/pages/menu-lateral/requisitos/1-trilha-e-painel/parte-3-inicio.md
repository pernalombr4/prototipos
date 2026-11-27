# 3. Início com os destinos nativos

**Objetivo:** o painel do Início reúne as telas de todo dia que o produto já tem: Chat de IA, Tarefas com as 3 telas
de hoje, Agenda, Spaceflows, Relatórios e a tela de cada módulo ligado.

**Depende de:** 1. Trilha, painel e menu flutuante.

**Onde vale:** o painel do Início e o aviso de extração de relatório.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | A tela de um módulo só aparece no Início enquanto o módulo está ligado no workspace e a pessoa tem a permissão de leitura dele. | Com o módulo Assinatura Eletrônica desligado, Assinaturas some do Início. | Obrigatório |

## Destinos nativos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | O painel do Início deve mostrar, no topo, os destinos nativos nesta ordem: Início, Chat de IA, Tarefas, Agenda, Spaceflows, Relatórios e as telas dos módulos ligados (RN201). | Num workspace com o módulo Assinatura Eletrônica ligado, a lista termina em Assinaturas. | Essencial | Obrigatório |
| RF202 | Chat de IA deve abrir o chat do BENI, que sai do grupo de ajuda. | Clicar em Chat de IA abre o chat; o menu de ajuda não tem mais o BENI. | Essencial | Obrigatório |
| RF203 | Tarefas deve abrir e fechar pela seta e mostrar as telas Painel, Agendadas e Rápidas, nessa ordem; Painel mostra o selo "Novo", como hoje. | Abrir Tarefas mostra as 3 telas; abrir Rápidas por link deixa Tarefas aberto. | Essencial | Obrigatório |
| RF204 | Relatórios deve abrir a lista dos relatórios extraídos. | Clicar em Relatórios abre a lista, com o último relatório extraído no topo. | Essencial | Obrigatório |
| RF205 | Quando a pessoa extrai um relatório, o aviso deve ter o botão "Abrir Relatórios", que abre o destino do menu, e ficar 10 s na tela. | Extrair em Contratos e clicar no botão abre Relatórios. | Importante | Desejável |
| RF206 | Abaixo dos destinos nativos, o painel do Início deve mostrar as seções Favoritos e Categorias. | Num workspace com categorias e sem favorito, a seção Categorias aparece logo depois dos destinos. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | Relatórios mostra ao lado do nome o número de relatórios prontos e ainda não baixados? Hoje o produto não registra se o relatório foi baixado. | produto e dev | Um RF de contador, com o dado novo no back. |
| P202 | Assinaturas fica entre os destinos do Início ou mantém o grupo "Módulos" de hoje? | produto | RF201 tira as telas de módulo da lista. |

# Visualizações da tela de itens

## A demanda, como ela veio

Pedido de 23/10/2026:

> fizemos um desenvolvimento de um novo sistema de folders https://pr2936-feat-useade5e51b73034e0ea9aff0f458ff9-137-184-138-162.sslip.io/ nesta branch
>
> agora, com base em como ficou o sistema de folders, o tipo de arraste, a aparencia etc, precisamos nos inspirar também pra fazer as abas de visualizações personalizadas. estas nao precisam parecer "abas", pq na pratica nao sao exatamente abas como as folders, mas da pra gente se aproveitar do componente de drag and drop, o de dropdown e outras coisas. nao pode ter a exata mesma aparencia, senao confunde o user, mas precisa ser consistente com o design das folders (que é um deisgn mais moderno. foque no construtor de nova visualiaçoes somente na tela nova de itens, ok?
>
> e ai melhore a usabilidade dele.
>
> voce tambem precisa pesquisar como outros produtos lidam com esses construtores de view, como notion, clickup e outros. o truncamento, o "+5", "...mais" e coisas do tipo quando a tela aperta. sao coisas que nao temos hoje, alem de reordenaçao por arraste, ediçao simplificada etc.
>
> com base nos resultados da sua pesquisa, devolva no chat sua ideia de prototipo e se eu validar voce aplica /deep-research /product-management:synthesize-research

Validação, no mesmo dia: "Validado. Rode o /deep-research e o /product-management:synthesize-research e monte o protótipo."

## A tela em jogo

A barra de visualizações personalizadas e o construtor "Nova Visualização", na **tela nova de itens** (selo "Nova Visualização de Itens · Ativo") da lista de uma categoria.

- **Onde olhei:** a branch do PR 2936, workspace de exploração `teste-ux`, categoria `leve`: `/workspaces/teste-ux/types/leve?view=default`.
- **Por que a branch e não o develop:** ela pediu a branch, onde estão as folders novas. A branch usa os dados do develop.

## O que seria sucesso

Quem usa a lista troca, cria, ajusta e organiza visualizações sem sair da tabela, enxerga todas mesmo com a tela apertada e reconhece a mesma família de peças das folders, sem confundir uma com a outra.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (`temas/README.md`, as auditorias e o `UX_REPORT.md`) por "visualização", "visualizações salvas", "view" e "nova visualização". **Não havia nada sobre a barra de visualizações nem sobre o construtor.** As menções a "visualização" no `UX_REPORT.md` falam da Agenda ("Visualização Unificada") e de "Visualizar Exclusão" nas configurações.

## O que a tela faz hoje

Percorrido pela tela, na branch, em 23/10/2026. Criei 6 visualizações na categoria `leve` do `teste-ux` para ver a barra cheia: "Pedidos em aberto do time financeiro", "Urgentes da semana", "Aprovados", "Contratos vencendo em 30 dias" e "Meus itens" ficaram; 1 cópia sumiu (ver "Onde trava", item 5). Não usei a API para preparar nada.

### O fluxo de criar, em passos

1. Clicar em **+ Visualizar**, à direita das visualizações (tooltip "Nova visualização").
2. Abre o modal **Nova Visualização**, com rolagem. Em cima: Nome da Visualização (obrigatório), Descrição, Ícone (obrigatório, "Selecione um ícone") e Tipo de Visualização (Tabela ou Kanban).
3. No meio: "Selecione as colunas desejadas. O preview mostra como ficará." 2 listas: Campos disponíveis (com "Selecionar todos" e busca) e Colunas selecionadas (com "Limpar todos" e alça em cada linha). Cada campo mostra o tipo técnico ao lado: "inputText", "EnlCalendar", "EnTextArea", "EnCurrency", "group".
4. Embaixo, 3 seções recolhidas:
   - **Filtros:** "Filtros Automáticos" e "Filtros por Campos Personalizados", cada um com **Adicionar**, que abre um 2º modal por cima;
   - **Visibilidade:** "Defina quem na sua empresa poderá ver esta tela.", com Grupos e Funções;
   - **Ordenação:** 1 campo e a "Ordem de classificação" (Decrescente por padrão).
5. **Salvar** grava, mostra "Visualização criada com sucesso" e **não abre** a visualização criada: a lista continua em Itens.

`evidencias/develop-01-modal.jpg` · `evidencias/develop-02-filtro-automatico.jpg`

### A barra

- Pílula com ícone e nome; a ativa com fundo claro na cor de destaque.
- O nome é cortado no próprio texto: 15 letras e "..." ("Pedidos em aber..."). O nome inteiro só aparece no tooltip.
- Na visualização personalizada, um ícone depois do nome abre o menu **Configurar visualização**, **Duplicar** e **Excluir**.
- Um separador e o **+ Visualizar**.
- Trocar de visualização não muda o endereço: continua `?view=default`.

`evidencias/develop-03-barra.jpg`

### O que já existe e funciona

- Tipo Tabela ou Kanban, colunas escolhidas e ordenadas, filtros por campo, os 2 filtros automáticos (dono e grupos), visibilidade por grupo e função e ordenação por 1 campo. A proposta guarda tudo isso.
- O `ModelView` do `enspace-sdk-schemas` já tem `default`, `config.hide`, `config.groupBy`, `user` (dono), `module_groups` e `roles`. O protótipo usa esses campos.
- As folders do item, na mesma branch, já trazem arrasto, menu da seta ⌄ com "Só para mim" e "Para todos", e "+N" com busca. A barra proposta reaproveita essas peças.

## Onde trava

| # | O que acontece | Evidência |
|---|---|---|
| 1 | Criar abre um modal longo com 5 blocos e 2 campos obrigatórios (nome e ícone) antes de ver qualquer item. | `develop-01-modal.jpg` |
| 2 | Cada filtro abre um 2º modal sem título, com botão verde de outro padrão visual. | `develop-02-filtro-automatico.jpg` |
| 3 | O filtro automático oferece "isOwner" e "inGroups"; os campos mostram o tipo técnico ("inputText", "EnlCalendar"). | `develop-02-filtro-automatico.jpg`, `develop-01-modal.jpg` |
| 4 | O texto promete "O preview mostra como ficará", e nenhum preview aparece. | `develop-01-modal.jpg` |
| 5 | Duplicar abre o mesmo modal com o nome "(copy)", em inglês, e a coluna Referência como "reference". O aviso diz "Visualização editada com sucesso". Depois de 2 Duplicar seguidos, a 1ª cópia sumiu ao recarregar. **Hipótese, sem contraprova:** o 2º Duplicar gravou por cima da cópia anterior. | `develop-04-duplicar.jpg` |
| 6 | Com a tela apertada, a barra vira rolagem horizontal com a barra de rolagem escondida e uma seta ">" na ponta. O "+ Visualizar" sai da tela, e o botão da nova versão fica por cima das pílulas. | `develop-05-aperto.jpg` |
| 7 | Não há arrastar, "+N", busca na barra, renomear na pílula, copiar link nem visualização padrão. As pílulas não têm papel de aba para leitor de tela (conferido no DOM: `button` sem `role="tab"`). | `develop-03-barra.jpg` |
| 8 | A visualização criada não abre sozinha: quem acabou de criar procura a pílula nova na barra. | Sem evidência visual: o print só mostraria a lista em Itens depois do aviso, que some em segundos |
| 9 | "Visibilidade" diz "quem na sua empresa poderá ver esta **tela**", e o objeto é uma visualização. | `develop-01-modal.jpg` |

Os itens 3, 5 e 9 são da tela de hoje e ficam como achado; a proposta corrige no desenho novo, e o estilo Hoje do protótipo os reproduz.

## A casca da tela, item por item

Copiada olhando a branch em 23/10/2026. O workspace e as categorias são fictícios.

- **Menu lateral:** cabeçalho com o workspace e a referência; Buscar... com Ctrl K. Membro: Início, Spaceflows, Categorias (aberto, com a categoria ativa e "Todos" embaixo), Tarefas, Agenda, Knowledge. Configurações: Visão Geral, Sistema, Estrutura, Gestão de Membros, Interface, E-mails, Integrações, Agentes de IA, Logs. Ajuda: Releases, Documentação.
- **Barra do topo:** voltar, avançar, recarregar, início, trilha (workspace › Categorias › categoria), Ctrl B, estrela, bandeira do idioma, tema, Suporte, sino com 99+ e avatar.
- **Barra de ferramentas da lista:** Pesquisar registros, Criado em, Todo o período, ícones de exportar, colunas, filtros e configurações, e Novo registro.
- **Tabela:** seleção, ações por linha, colunas da visualização, "Mostrando 1 a N de N resultados" e paginação.

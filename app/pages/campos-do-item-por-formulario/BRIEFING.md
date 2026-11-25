# Campos do item com 1 formulário

## A demanda, como ela veio

> **Contexto e Problema Atual**
>
> Em categorias que possuem apenas 1 formulário vinculado (tanto na versão antiga quanto na nova), quando o usuário abre um item (seja a partir da página "Todos", da página de um formulário, ou da página dedicada de edição com abas, incluindo a "Visão Geral"), ele sempre visualiza apenas os campos daquele formulário.
>
> Quando a categoria tem um único formulário, esse recorte não é evidente, e os usuários acham que é um bug ou que campos estão faltando.
>
> **Opção 1:** A "Visão Geral" sempre exibe todos os campos do item, independentemente de onde ele foi acessado. A filtragem por formulário acontece apenas se o usuário selecionar uma aba de formulário dentro do item.
>
> **Opção 2:** Mesmo comportamento da Opção 1 (Visão Geral com todos os campos), mas com uma aba de formulário criada automaticamente quando o item for acessado a partir de uma página de formulário.
>
> **Opção 3:** Comportamento sensível ao contexto:
>
> * Acesso pela página "Todos": Abre o item exibindo todos os campos.
> * Acesso pela página de um formulário específico: Abre o item exibindo apenas os campos daquele formulário (mantendo o contexto da origem).
> * Acesso direto pela página específica de Edição do Item: Abre na Visão Geral exibindo todos os campos.
> * Como filtrar: Em vez de depender apenas da troca de abas na edição, incluímos um campo seletor (input de formulário) dentro da própria Visão Geral, permitindo que o usuário alterne rapidamente entre ver "Todos os campos" ou os campos de um "Formulário X" específico.

Vídeo de referência da demanda: <https://jam.dev/c/9320c084-6c7c-4393-b88a-a805038cf882>.

Pedido da redatora: "use /prototipo pra colocar em um único protótipo a demonstraçao de cada uma das soluçoes", com o código e a experiência no develop para entender o problema, e a avaliação das soluções no Twenty CRM, explorado no uso, e em outros produtos por pesquisa.

## A tela em jogo

A tela do item em 3 portas, na categoria com 1 formulário:

| Porta | Endereço no develop (workspace de exploração) |
|---|---|
| Página "Todos" da categoria, item na barra lateral | `/workspaces/teste-ux/types/orcamento_teste_valor_virtual?view=default` |
| Página do formulário, item na barra lateral | `/workspaces/teste-ux/types/orcamento_teste_valor_virtual/forms/<id do formulário>?view=default` |
| Tela dedicada do item, pasta Visão Geral | `/workspaces/teste-ux/types/orcamento_teste_valor_virtual/<referência do item>?folder=general` |

## O que seria sucesso

Quem abre um item numa categoria com 1 formulário vê todos os campos do item, ou entende na hora que está vendo um recorte e sabe como ver o resto.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (índice de temas, auditorias e `UX_REPORT.md`, pelas palavras formulário, Visão Geral, campos, recorte, aba e pasta) e não havia nada sobre o recorte de campos por formulário na tela do item.

## Cenário montado no develop

Tudo pela tela, no workspace de exploração, em 2026-11-25:

1. A categoria `orcamento_teste_valor_virtual` já existia, com 3 campos (Quantidade, Preco e Total virtual) e nenhum formulário.
2. Item 1 criado antes de existir formulário: a Visão Geral mostra os 3 campos (print 01).
3. Formulário "Pedido rapido" criado, do tipo Geral, só com o campo Quantidade.
4. Item 2 criado pelo formulário.

O formulário e os 2 itens continuam no workspace de exploração.

## O que a tela faz hoje

Medido na tela do develop e conferido no código da develop em 2026-11-25.

### Versão nova (tela nova de itens)

1. **O item 1, criado sem formulário, perde campos assim que a categoria ganha o 1º formulário.** Na tela dedicada, a Visão Geral passa a mostrar só Quantidade (print 03).
2. **A barra lateral aberta pela página "Todos" faz o mesmo.** A tabela mostra as 3 colunas, e o item aberto ao lado mostra 1 campo (print 04).
3. **A página do formulário lista só os itens criados por ele**, com as colunas dele, e abre o item com os campos dele (print 05).
4. **Nenhuma tela avisa o recorte.** Não há seletor, contagem nem texto. O seletor de formulário só aparece quando a categoria tem 2 ou mais formulários, e mesmo assim não oferece "Todos os campos".
5. **A pasta do tipo Formulário já existe**: o botão de nova pasta, à direita das abas, cria uma pasta com um formulário escolhido (print 09). As Opções 1 e 2 se apoiam nela.

A regra de escolha, lida no código:

- vale o formulário da porta (a página do formulário);
- sem ele, o formulário que criou o item;
- sem ele, o 1º formulário do tipo Geral ou Editar da categoria;
- só sem nenhum formulário a tela mostra todos os campos.

Ao salvar, a tela envia o formulário usado, e o servidor aceita só os campos dele. A Visão Geral com todos os campos (Opções 1 e 3) precisa gravar sem esse recorte.

A regra entrou na versão 3.1.0, de setembro de 2026.

### Versão antiga

| Porta | O que mostra |
|---|---|
| Tela dedicada | todos os campos (print 06) |
| "Editar" na página do formulário | só os campos do formulário (print 07) |
| "Editar" na página "Todos" | só os campos do formulário, inclusive no item criado sem formulário (print 08) |

A demanda diz que a versão antiga também recorta. Vale para os painéis de "Editar" da lista, não para a tela dedicada.

## Onde trava

- **Campos somem sem aviso.** O item criado por importação, API ou antes do formulário existir abre só com os campos do formulário (prints 03 e 04).
- **Tabela e item não batem.** A lista mostra 3 colunas, e o item aberto ao lado mostra 1 campo (print 04).
- **Não há saída na tela.** Com 1 formulário, não existe seletor nem atalho para ver o resto; o caminho é criar uma pasta do tipo Formulário, que mostra o mesmo recorte.

## A casca da tela, item por item

Copiada do develop em 2026-11-25. Nada dela é proposta.

| Peça | Como ficou |
|---|---|
| Menu lateral | Membro (Início, Spaceflows, Categorias, Tarefas, Agenda, Relatórios, Knowledge), Configurações (Visão Geral, Sistema, Estrutura, Gestão de Membros, Interface, E-mails, Integrações, Agentes de IA, Logs) e Ajuda (Releases, Documentação), com Categorias fechado |
| Barra do topo | voltar, avançar, recarregar, início, trilha, Ctrl B, estrela, idioma, tema, Suporte, sino 99+ e avatar |
| Trilha | workspace > Categorias > categoria; na página do formulário, mais Formulários > id do formulário; na tela dedicada, mais a referência do item |
| Lista | aba Itens, "+ Visualizar", busca, Criado em, Todo o período, Exportar, Colunas, Filtros, Configurar, Novo registro e "Mostrando 1 a N de N resultados" |
| Barra lateral do item | sobre a lista esmaecida, com o painel de informações à esquerda e as pastas à direita; Visão Geral, Comentários e "+2" |
| Painel do item | ícone, referência, categoria, Identificação (ID), Origem (Status, E-mail solicitante), Histórico (Criado em, Atualizado em) e o botão de recolher |
| Pastas | Visão Geral, Comentários, Logs de Auditoria, Tarefas e o botão de nova pasta |
| Modal "Nova pasta" | Nome da Pasta, Tipo de Pasta, Formulário, Habilitar Edição, Ícone e Grupos Permitidos |
| Rodapé | Salvar |

Diferenças conhecidas da cópia:

- a barra lateral do protótipo é mais larga que a do develop, para o campo caber;
- a seta ao lado de "Visão Geral" não foi copiada.

## Achados fora da demanda

- **Salvar do formulário não responde na aba Definição.** No painel de criar formulário da categoria, o clique em Salvar na aba Definição não fez nada, 2 vezes, sem chamada de rede. O mesmo Salvar, na aba Avançado, gravou o formulário.

## Prints

| Arquivo | O que mostra |
|---|---|
| `evidencias/01-item-sem-formulario-todos-os-campos.jpg` | item 1 antes do formulário, com os 3 campos |
| `evidencias/02-formulario-unico-so-quantidade.jpg` | o único formulário, só com Quantidade |
| `evidencias/03-tela-dedicada-so-campos-do-formulario.jpg` | o mesmo item 1, depois do formulário, com 1 campo |
| `evidencias/04-painel-lateral-tabela-3-colunas-item-1-campo.jpg` | página "Todos": tabela com 3 colunas e item com 1 campo |
| `evidencias/05-pagina-do-formulario-painel-lateral.jpg` | página do formulário com o item 2 aberto |
| `evidencias/06-versao-antiga-tela-dedicada-todos-os-campos.jpg` | versão antiga, tela dedicada com todos os campos |
| `evidencias/07-versao-antiga-pagina-do-formulario-editar.jpg` | versão antiga, "Editar" na página do formulário |
| `evidencias/08-versao-antiga-todos-editar-item-do-formulario.jpg` | versão antiga, "Editar" na página "Todos" |
| `evidencias/09-nova-pasta-tipo-formulario.jpg` | modal "Nova pasta" com o tipo Formulário |

O e-mail da conta aparece borrado nos prints do develop.

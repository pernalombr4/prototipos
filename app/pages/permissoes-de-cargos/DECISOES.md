# Decisões: permissões de cargos

## A proposta em 1 parágrafo

A tela do cargo deixa de crescer com o workspace. Um **padrão de 4 caixas** (Criar, Ver, Atualizar,
Excluir) vale para toda categoria sem regra própria, inclusive as criadas depois. Abaixo, **uma linha por
categoria** com as mesmas 4 caixas em colunas fixas, busca, filtros (Regra própria, Com acesso, Sem acesso,
Alteradas) e uma **caixa no cabeçalho de cada coluna** que marca a lista filtrada inteira. Campo e
formulário saem da tabela e ficam em **Ajustar**, uma camada lateral: o campo vira 1 linha com Criar, Ver e
Atualizar lado a lado, e "Todos os campos" é o padrão. A categoria e os formulários são caixa pai e caixas
filhas (rodada 5): marcar a categoria libera todos os formulários e os itens sem formulário; marcar só
alguns deixa a categoria com traço e restringe o cargo a eles. As 82 permissões fixas (Padrão e Configurações) viram matriz por área. A confirmação
diz o que muda, em palavras, e quantas pessoas sentem.

| No volume grande (120 categorias) | Hoje | Proposta |
|---|---|---|
| O que aparece na aba Dados | 14.828 caixas, cerca de 489.000 px | 126 linhas de 4 caixas |
| Liberar Ver em todas as categorias | 120 cliques, e a 121ª nasce sem | 1 caixa no padrão |
| Saber o que o cargo faz com 1 campo | 3 linhas em 3 listas separadas | 1 linha em Ajustar |
| Esconder 2 campos de 1 categoria | Desmarcar em Criar, Ver e Atualizar | Escolher campo a campo, 1 linha por campo |

## Fronteira

- **Muda:** o conteúdo das abas Dados e Configurações; o texto do aviso de pendência e da confirmação.
- **Não muda:** casca (menu, topo, trilha), cabeçalho do cargo, os 2 contadores, as 3 abas, o lugar do
  "Salvar Alterações" (continua no topo, no aviso de pendência), a aba Inválidas e a caixa de seleção como
  controle.

## O que veio da pesquisa

| Ideia | De onde | No protótipo |
|---|---|---|
| Padrão do cargo + exceções, com contador de exceções | Twenty | Adotado. Rodada 2: primeira linha da tabela e contador com direção ("Liberado em 15", "Tirado em 9") |
| Categoria nova herda o padrão | Todos os 16 | Adotado; pede back-end (abaixo) |
| Matriz recurso × ação | Directus, Strapi, Zoho | Adotado: categorias e permissões fixas |
| Caixa de linha e de coluna que marca tudo | Strapi, Twenty, Directus | Adotado, com 3 estados |
| Estado herdado e "voltar ao padrão" | Twenty, Notion | Adotado. Rodada 2: herdado em tom claro da cor primária, diferente em cor cheia, desfazer em cada caixa |
| Campo num segundo passo, com busca e "todos" | Twenty, Salesforce | Adotado: Ajustar › Campos |
| Resumo antes de salvar, com pessoas afetadas | Nenhum (oportunidade) | Adotado |
| Níveis nomeados (Nenhum, Ver, Editar, Total) | Notion, Retool, Pipefy | **Descartado.** A demanda diz que caixa funciona; 4 caixas na linha já dão o nível de relance |
| Filtro "só alteradas" ligado ao abrir | Twenty | **Descartado como padrão.** Abre em "Todas" para a tela não esconder categoria de quem chega; "Regra própria" fica a 1 clique, com contagem |
| Selecionar linhas e aplicar | Salesforce | **Adiado.** A caixa de coluna sobre a lista filtrada cobre o caso ("Filial Sul" + Excluir = 40 categorias) |
| Aba Permissões dentro da categoria | Attio, Notion, Airtable | **Adiado** para outra rodada: é a segunda porta da mesma regra |
| Quais itens: criador (`is_owner`) e responsável | ClickUp ("Only if created"), Pipefy e monday ("atribuído a mim"), HubSpot | Rodada 4: coluna "Quais itens" em toda linha, inclusive no padrão; caixas por ação; campo Pessoa escolhido por categoria. Pede back-end (abaixo) |
| Parcial na célula | Directus, Strapi | Rodada 2: traço na caixa e dica "Ver em 76 de 80 campos"; o clique abre Ajustar › Campos |
| Ícone por ação e o que ela libera | Directus, Twenty, ClickUp, Jira | Rodada 2: ícone no cabeçalho, dica por ação e 1 linha de descrição por área fixa |
| Filhos na mesma grade | Appsmith, Retool | Rodada 2: a seta da categoria abre Campos, Quais itens e cada formulário na própria tabela |
| Ver exigido por Atualizar e Excluir | ClickUp, Appsmith, Twenty, Salesforce | Rodada 2: Ver marca sozinho e fica travado, com cadeado e "Exigido por Atualizar" |
| Quem acessa a categoria e comparar cargos | Salesforce (Object Access), HubSpot | Rodada 2: aba "Quem acessa" no Ajustar, com Tem e Não tem e "Esconder cargos iguais a este" |
| Pessoas no papel à vista | Strapi, Pipefy, monday | Rodada 2: selo "14 pessoas com este cargo" ao lado do título |

## O que a implementação precisa além da tela

1. **Padrão que vale para categoria futura.** Hoje cada permissão é `types::<categoria>::<ação>`. O padrão
   precisa de uma referência coringa (por exemplo `types::*::read`) e de uma regra de precedência: a
   permissão da categoria vence o coringa.
2. **"Todos os campos" sem lista.** Hoje a tela grava os nomes de todos os campos marcados; campo criado
   depois fica de fora até alguém editar o cargo. Rodada 5, lido no código: na leitura, o back já trata
   `fields` vazio como "todos os campos". Falta a tela gravar a lista vazia quando a escolha é "Todos os
   campos", e conferir se a gravação e a edição seguem a mesma regra.
3. **Categoria e formulários como caixa pai e filhas (rodada 5).** Ver "Conferência com o código" abaixo.
   O back precisa de 3 mudanças:
   - a origem "itens sem formulário" vira uma permissão própria da categoria, e o item com `form` nulo só
     aparece para quem a tem quando a categoria está restrita a alguns formulários;
   - o filtro da listagem considera só os formulários com Ver, e não qualquer ação de formulário: Criar,
     Atualizar ou Excluir num formulário não muda o que a pessoa vê;
   - categoria marcada sem nenhum formulário gravado continua valendo para todos, inclusive o formulário
     criado depois (já é assim hoje).
4. **`EnTable` sem slot de cabeçalho.** A caixa de coluna é peça central e o `EnTable` só aceita rótulo em
   texto no cabeçalho. O protótipo usa o `UTable` (slot `#<coluna>-header`, `sticky`). Pedido para o SDK:
   slot `#header-{key}` no `EnTable`.
5. **Volume.** Acima de algumas centenas de categorias, a tabela precisa de virtualização (o `UTable` e o
   `EnTable` já têm a prop `virtualize`).
6. **Quais itens (`is_owner` e responsável).** O develop grava `rules: []` em toda permissão. "Só os itens que a pessoa criou"
   precisa de uma regra ali (por exemplo, criador = pessoa logada) e de o back-end aplicá-la na listagem,
   na edição e na exclusão. O responsável é outra regra: a pessoa logada está em um dos campos Pessoa
   escolhidos (na categoria) ou em qualquer campo Pessoa (no padrão). As 2 juntas valem com OU. O padrão
   também precisa de regra coringa, como no item 1. **Risco (rodada 5, lido no código):** hoje o back nega
   por inteiro a permissão com `rules` preenchido, porque a validação de regras não existe. Se a tela gravar a
   regra antes de o back aplicá-la, o cargo perde o acesso à categoria.
7. **Quem acessa.** A aba lista o que cada cargo faz numa categoria: pede uma rota que devolva as
   permissões de todos os cargos para 1 categoria, ou a tela monta isso lendo `/ws/roles` inteiro.

Sem os itens 1 a 3, a tela ainda funciona: o front escreve a regra em cada categoria e formulário ao
salvar. Perde-se só a herança para o que for criado depois.

## Conferência com o código (rodada 5 · 2026-11-24)

Lido na develop do back e do front em 2026-11-24. A versão no ar pode estar atrás: a correção do card
USE87A7C6 está na develop desde 2026-11-16 e ainda não está na branch principal.

| Ponto | O back hoje | O protótipo | Quem está certo |
|---|---|---|---|
| Ver da categoria | Obrigatório para listar. Sem ele, a listagem dá 403, mesmo com Ver num formulário. | A categoria com traço já tem Ver. | Os 2 batem, desde que a tela grave o Ver da categoria junto com o do formulário. |
| Formulário com permissão própria | Basta 1 permissão de formulário (qualquer ação) para a listagem ficar só nos formulários que têm Ver. Os outros formulários somem: com Ver e Criar na categoria e só Ver gravado no formulário B, a listagem mostra só os itens de B. | Rodadas 1 a 4: "Segue a categoria" por formulário, sem efeito nos outros formulários. | **O protótipo das rodadas 1 a 4 descrevia um comportamento que o back não tem.** A rodada 5 troca a chave pelo modelo de caixa pai e filhas: ele faz tudo o que a chave fazia (ação por ação, na mesma grade), deixa o formulário novo desmarcado na categoria com traço (a chave o deixaria seguir a categoria, e quem só vê Criminal veria o formulário novo) e tem 1 regra só. Decidido com a redatora em 2026-11-24. |
| Permissão de formulário que não é Ver | Conta para restringir a listagem. Cargo com Ver na categoria e Criar só no formulário A não vê item nenhum: o back procura Ver nos formulários gravados, não acha e bloqueia a listagem. Com Criar em A e Ver em B, a listagem mostra só B. | Cada ação tem a sua lista de formulários: Ver decide o que a pessoa vê, Criar decide onde ela cria, e uma não altera a outra. | **O protótipo.** No back é um efeito colateral, não uma regra. Criar sem Ver continua valendo, configurado na própria ação (abaixo). |
| Criar sem Ver (denúncia anônima) | Criar na categoria sem Ver: a pessoa cria e a listagem dá 403. O item guarda quem criou. | Criar não exige Ver; só Atualizar e Excluir exigem. Para acompanhar só as próprias denúncias, Ver com a regra de criador. | Os 2 batem no Criar sem Ver. A regra de criador depende do item de `rules` (acima). Decidido com a redatora em 2026-11-24. |
| Itens sem formulário | Na branch principal, somem quando há permissão de formulário. Na develop (USE87A7C6), aparecem sempre. | Linha "Itens sem formulário", marcada ou não como qualquer formulário. | **O protótipo.** Sempre esconder trava o caso do agente de IA; sempre mostrar vaza no caso Cível e Criminal. |
| Formulário criado depois | Sem permissão de formulário gravada, entra com a categoria. Com permissão gravada, fica de fora. | O mesmo: entra na ação marcada inteira; na ação com traço, entra desmarcado. | Os 2 batem. |
| Campos | Na leitura, `fields` vazio = todos. | "Todos os campos" é o padrão. | Os 2 batem; falta a tela gravar vazio. |
| Criador e responsável | `rules` preenchido nega a permissão inteira (validação de regras não feita). | Coluna "Quais itens". | **O protótipo** é a proposta; o back precisa da regra antes de a tela gravar. |
| Padrão para todas as categorias | A referência precisa de categoria que existe; um coringa é recusado. | Linha do padrão. | **O protótipo** é a proposta; pede back-end (item 1). |
| Tela de hoje | Árvore com cascata: a caixa da categoria marca as 4 ações e os formulários juntos; o traço só aparece no nó da categoria. | Traço por ação, na linha da categoria. | O protótipo mostra o parcial por ação, onde ele tem efeito. |

**O que o mercado faz** (documentação oficial, lida em 2026-11-24):
- Jira: item sem nível de segurança fica visível para todos do projeto, como a correção da develop.
- HubSpot: liberar um pipeline para alguém restringe os demais; registro de outro pipeline fica esmaecido.
- SharePoint e Google Drive: o filho herda do pai; quando só o filho é liberado, o pai fica com acesso
  limitado (SharePoint) ou esmaecido (Drive).
- Salesforce e Zoho: o tipo de registro e o layout controlam criação e tela, não quem vê.
- Nenhum mostra o pai com traço na tela de permissão. O traço é a convenção de árvore de caixas (a tela de
  hoje já usa) e casa com o pedido.

## Perguntas em aberto

- **Formulário criado depois na categoria com traço.** O protótipo segue o back e a regra de menor
  privilégio: entra desmarcado. Confirmar com produto.
- **Formulário padrão.** Respondido em 2026-11-24, lido no código (develop do back): a criação de item
  troca o formulário `default` por nenhum, e o item fica com `form` nulo. Ele cai em "Itens sem formulário",
  e a descrição da linha passou a citar o formulário padrão nos 3 idiomas.
- **Cargo gravado hoje com formulário.** Cargo com Ver na categoria e Ver em alguns formulários vira
  categoria com traço, sem "Itens sem formulário". Na develop, esses itens aparecem; a migração precisa
  decidir se marca a linha para não mudar o que o cargo vê.

- **Criar sem Ver.** Na rodada 2, Atualizar e Excluir passaram a exigir Ver. Criar continua solto, para o
  caso de quem só abre chamado sem ver os outros. Confirmar com produto se o back-end aceita Atualizar sem
  Ver hoje (cargo já gravado assim vira caso a migrar).
- **Regra igual ao padrão.** O protótipo trata categoria com as mesmas 4 caixas do padrão como "Segue o
  padrão". Quem quiser travar uma categoria para não acompanhar mudança futura do padrão não consegue.
- **Contagem de mudanças.** "1 alteração" é 1 categoria (ou 1 área fixa), mesmo que mexa em 35 campos. A
  confirmação detalha o resto.

## Rodada 1 · 2026-10-08
- **Pedido (literal):** "pesquise e proponha, depois de investigar como nosso modelo é hoje."
- **Mudou:** tela nova `permissoes-de-cargos`: padrão das categorias, matriz de categorias com busca,
  filtros e caixa de coluna, camada Ajustar (campos e formulários), matriz das permissões fixas,
  confirmação em palavras.
- **Fronteira:** muda o conteúdo das abas Dados e Configurações e o texto do aviso e da confirmação; não
  muda a casca, o cabeçalho, as abas e o lugar do Salvar.
- **Descartado:** níveis nomeados no lugar da caixa. Motivo: a demanda diz que a caixa funciona.
- **Descartado:** contador da aba em vermelho. Motivo: parece erro; virou selo neutro.
- **Não deu:** print das referências. Por quê: a pesquisa leu doc e código, sem abrir as telas.
- **Não deu:** diagrama de jornada. Por quê: a jornada fica numa tela só (camada lateral e confirmação por
  cima), sem passar de 2 telas.
- **Maquete:** salvar e o erro ao salvar são simulados em memória (900 ms); recarregar volta ao começo. A
  aba Inválidas é a de hoje, vazia. "Ignorar permissões para membros full" não entra.
- **Crítica e acessibilidade:** rodei a `design:design-critique`; a revisão de contraste, foco e rótulo foi
  feita dentro dela, sem rodar a `design:accessibility-review` à parte.
  - Corrigido: a caixa de coluna mexe em dezenas de categorias; o aviso ganhou "Desfazer" e fica 6 s.
  - Corrigido: a linha de detalhe da categoria passou de `text-dimmed` para `text-muted`, por contraste.
  - Corrigido: o aviso de pendência fixo no topo deixava o texto de baixo aparecer; ganhou fundo.
  - Ficou: herdado e próprio se distinguem pela cor da caixa (cinza ou primária). O selo "Regra própria"
    e o texto "Segue o padrão" na linha dizem o mesmo sem cor.
  - Ficou: no estado "Sem permissão para editar" a caixa desabilitada muda pouco no tema claro; o aviso no
    topo explica.
  - Ficou: abaixo de 900 px a tabela rola na horizontal. A tela é de administração, usada no computador.
  - Toda caixa tem rótulo para leitor de tela ("Ver: Contratos de Clientes", "Marcar Excluir nas 40
    categorias da lista").
- **CSS próprio:** nenhum (`<style>`, `:deep()` e `!important` não aparecem). Larguras e layout de tabela
  pela prop `ui` do `UTable` (`base: 'table-fixed'`), consultado no MCP `nuxt-ui` (`get-component Table`)
  e no tema gerado `.nuxt/ui/table.ts`.
- **Não deu:** refazer 3 prints depois das últimas correções. Por quê: a janela do Chrome ficou minimizada.
  - `proposta-02-ajustar-campos.jpg` mostra o tipo técnico do campo (`EnlDropdown`); a tela já mostra "Lista
    de Seleção Única".
  - `proposta-05-confirmar.jpg` mostra "categorias:liberou" sem espaço; a tela já corrigiu.
  - O print do tema escuro em espanhol saiu com a seta do mouse e foi descartado (regra da redatora de
    2026-10-06). O escuro e o espanhol foram conferidos na tela.
- **Ver:** `/permissoes-de-cargos` · `evidencias/proposta-01-categorias.jpg`, `proposta-02`, `proposta-03` e `proposta-05`

## Rodada 2 · 2026-10-08
- **Pedido (literal):** "voce tem que analisar VISUALMENTE se concorrentes apresentam tabelas melhores de ediçao de permissoes. veja isso e analise as oportunidads de melhora" e, depois das 12 propostas no chat, "pode aplicar tudo o que falou. eu avalio em tela se ta funcional"
- **Mudou:**
  - Ícone em cada ação (+, olho, lápis, lixeira) no cabeçalho de todas as tabelas, com dica do que a ação libera.
  - Herdado em tom claro da cor primária; diferente do padrão em cor cheia.
  - Desfazer em cada caixa que difere do padrão; o desfazer da linha continua.
  - Parcial na célula: traço e "Ver em 76 de 80 campos"; o clique abre Ajustar › Campos.
  - Exceção com direção: "Liberado em 15" e "Tirado em 9".
  - Descrição de 1 linha em cada área das permissões fixas.
  - Selo "14 pessoas com este cargo" ao lado do título.
  - Padrão como primeira linha da tabela, alinhado às colunas.
  - Seta na categoria abre, na mesma grade, Campos (todos, parte ou nenhum por ação), Quais itens e cada formulário (com "Segue a categoria").
  - Ver exigido por Atualizar e Excluir, em categoria, padrão, formulário, campo e permissões fixas: marca sozinho, fica travado, com cadeado e o motivo.
  - Quais itens: Todos ou Os seus, para Ver, Atualizar e Excluir; a caixa ganha um ícone de pessoa quando vale só para os seus. Reembolsos vem assim no mock.
  - Aba "Quem acessa" no Ajustar: os 7 cargos do workspace nesta categoria, com Tem e Não tem, e "Esconder cargos iguais a este".
  - 22 capturas de referência em `evidencias/ref-*.png` e a análise visual no `PESQUISA.md`.
- **Fronteira:** muda a tabela de categorias, as matrizes fixas, o Ajustar e o selo no título; não muda a casca, as abas, o aviso de pendências, a confirmação e o lugar do Salvar.
- **Mantido para comparar:** o padrão em cartão (rodada 1) fica no andaime, em "Padrão › Cartão (rodada 1)". Sai num commit próprio quando a redatora escolher.
- **Risco registrado:** com o padrão na primeira linha, a grade tem 2 controles de "todas": a linha do padrão (vale para categoria sem regra, inclusive futura) e a caixa do cabeçalho (marca a lista filtrada). A dica de cada um diz o alcance.
- **Maquete:** "Quem acessa" usa os outros 6 cargos com regra fixa no `mocks.ts`; o "Os seus" não filtra item nenhum, só grava a escolha. Recarregar volta ao começo.
- **Não deu:** conferir o visual final no servidor local. Por quê: o servidor que estava de pé é de outra conversa e gerou o CSS das classes novas de forma instável (a mesma classe aparecia e sumia entre recargas). Comportamento conferido pelo DOM; visual conferido no build publicado.
- **Crítica e acessibilidade:**
  - Toda caixa nova tem rótulo ("Ver: Contratos de Clientes"); o cadeado e a pessoa têm dica em texto, não só cor.
  - Parcial, herdado e travado não dependem só de cor: traço, tom e cadeado.
  - Ficou: a linha das categorias abertas fica longa com 12 formulários; a seta recolhe.
- **CSS próprio:** nenhum. Tom claro pela prop `ui` do `UCheckbox` (`indicator: 'bg-primary/40'`), consultada no tema gerado `.nuxt/ui/checkbox.ts`.
- **Não deu:** print da rodada 2. Por quê: a janela do Chrome estava escondida; conferi o visual pelo CSS calculado no site publicado (recuo das sublinhas, tom claro do herdado, desfazer sem sobrepor a caixa).
- **Ver:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/

## Rodada 3 · 2026-10-08
- **Pedido (literal):** "ta sem tooltip nos cadeados. nao precisa de icone nos titulos de criar, ver editar e excluir. pode diminuir a distancia entre as colunas, acredito. se uma permissao tiver "outras açoes", sendo mais de uma na mesma linha, como ficaria? é melhor dividir em mais colunas? agora, ainda tem um tipo de permissão que não temos, mas precisamos ter, que é: pode ter essa permissão desde que seja criador daquilo. ex.: pode ver itens na categoria x se tiver criado esse item. como isso seria configurado? seria uma permissao is_owner"
- **Mudou:**
  - Cadeado com dica: o motivo ("Exigido por Atualizar. Desmarque Atualizar para tirar Ver.") mora no próprio cadeado, que recebe foco pelo teclado. A caixa travada fica desabilitada e não abre dica.
  - Títulos Criar, Ver, Atualizar e Excluir sem ícone, nas 3 tabelas. A dica do que a ação libera continua no título.
  - Colunas de ação com 80 px fixos e sem recuo lateral; a coluna do nome fica com o resto.
  - Outras ações: até 2 aparecem na linha; a partir da 3ª, um botão "+N ações" abre a lista, e mostra quantas estão marcadas lá dentro.
  - Simulação no andaime ("Outras ações › Simular 5 na mesma área"): Tarefas rápidas ganha 5 ações inventadas para ver o caso.
  - Só se for o criador (`is_owner`): a sublinha virou uma caixa por ação (Ver, Atualizar, Excluir), no lugar do seletor "Todos / Os seus".
- **Descartado:** uma coluna para cada "outra ação". Motivo: cada uma existe numa área só (Usar Chat da IA só em IA, Reenviar só em Enviados), então cada coluna nova teria 1 caixa e 23 linhas vazias, e a tabela alargaria a cada função nova.
- **Fronteira:** muda o cadeado, os títulos das colunas, as larguras, a coluna Outras ações e a sublinha de criador; não muda o resto.
- **Maquete:** as 5 ações simuladas não existem no develop e não entram na contagem de Permissões Ativas.
- **Ver:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/

## Rodada 4 · 2026-10-08
- **Pedido (literal):** "Criador no padrão: levar a caixa "Só se for o criador" também para a linha do padrão, para dizer de uma vez "em todas as categorias, vê só os itens que criou". Responsável, além do criador: uma regra como "é o responsável", que olha o campo Pessoa do item. É o que Pipefy e monday fazem com "atribuído a mim". sao 2 pontos que temos que ter mesmo. e ainda ta ruim pra achar essa permissão aí de só se for o criador." e "na badge do topo de "14 pessoas com este cargo" voce deve permitir clicar ali e ver quais sao, num popup"
- **Mudou:**
  - Coluna nova **Quais itens** em toda linha da tabela, inclusive na do padrão: "Todos", "Criador", "Responsável" ou "Criador ou responsável". Na categoria que herda, vem "· do padrão".
  - O clique na coluna abre o editor: linhas = Só se for o criador e Só se for o responsável; colunas = Ver, Atualizar e Excluir; caixas.
  - Criador e responsável no padrão: valem para toda categoria sem regra de itens própria. No padrão, conta qualquer campo Pessoa.
  - Responsável na categoria: escolhe quais campos Pessoa contam (vem marcado o campo "Responsável"). Categoria sem campo Pessoa só aceita a regra de criador.
  - Herança: a categoria segue o padrão até alguém mudar a regra dela; "Voltar ao padrão" desfaz.
  - Filtro novo **Só alguns itens**, com contagem.
  - Aba **Quais itens** no Ajustar, com o mesmo editor.
  - Sublinhas da categoria aberta: "Só se for o criador" e "Só se for o responsável" (com os campos Pessoa que contam).
  - Ícone na caixa da ação com regra: pessoa (criador), pessoa com visto (responsável), 2 pessoas (os 2), com dica.
  - Mock: Reembolsos com criador em Ver e Atualizar; Chamados de TI com criador ou responsável em Ver.
  - O selo **14 pessoas com este cargo** abre uma janela com as 14 pessoas: nome, e-mail, licença e situação, com busca e "Abrir Gestão de Membros".
- **Fronteira:** muda a tabela de categorias (coluna, filtro, sublinhas), o Ajustar e o selo do topo; não muda a casca, as abas, o aviso de pendências e o lugar do Salvar.
- **Maquete:** as regras não filtram item nenhum, só gravam a escolha; "Abrir Gestão de Membros" mostra um aviso; recarregar volta ao começo.
- **Ver:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/

## Rodada 5 · 2026-11-24
- **Pedido (resumo):** conferir o protótipo com as permissões do back pela skill `investigar-codigo`, dizer
  quem está certo nas divergências e resolver o caso de categoria e formulários: marcar o formulário deixa
  a categoria com traço; marcar a categoria marca todos os formulários; os itens criados sem formulário
  (agente de IA do Spaceflow, workspace de produtos) não podem sumir; e quem vê Criminal não pode ver Cível
  (caso da Vivo).
- **Mudou:**
  - Saiu o "Segue a categoria" por formulário. A categoria e os formulários são caixa pai e caixas filhas,
    por ação: marcar 1 formulário liga a ação na categoria com traço; marcar a categoria (ou clicar no
    traço) libera em todos; desmarcar 1 formulário deixa a categoria com traço.
  - Origem nova **Itens sem formulário** (criados pela API, por importação, pelo Spaceflow ou por agente
    de IA), com caixa como qualquer formulário. Marcar a categoria inteira a inclui.
  - Ver acompanha Atualizar e Excluir também por formulário: o Ver do formulário fica travado enquanto
    Atualizar ou Excluir valem nele.
  - Coluna Formulários: "Todos", "1 de 4" (alguma origem sem ação nenhuma) ou "Em parte" (só algumas ações
    limitadas), com dica por ação e clique que abre Ajustar › Formulários.
  - Ajustar › Formulários: linha "Todos os formulários" no topo, como caixa pai, e o aviso de que formulário
    criado depois entra só na ação marcada inteira.
  - Mock: Processos Judiciais com os formulários Cível, Criminal e Trabalhista; o cargo só cria, vê e
    atualiza em Criminal.
  - DECISOES: seção "Conferência com o código", com as divergências e quem está certo.
- **Decidido com a redatora (2026-11-24):**
  - a chave "Segue a categoria" não volta; o modelo de caixa pai e filhas fica;
  - Ver e Criar por formulário são independentes: Criar num formulário não restringe o que a pessoa vê;
  - Criar sem Ver vale (denúncia anônima); "só os que eu criei" funciona, porque o item guarda quem criou.
- **Fronteira:** muda a coluna e as sublinhas de formulário da tabela de categorias e a aba Formulários do
  Ajustar; não muda a casca, as abas, o aviso de pendências e o lugar do Salvar.
- **Maquete:** recarregar volta ao começo.
- **Ver:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/
- **Prints:** `evidencias/proposta-r5-01-so-criminal.jpg`, `proposta-r5-02-ver-em-todos.jpg`,
  `proposta-r5-03-ajustar-formularios.jpg`.

## Requisitos · 2026-11-24
- **Pedido (literal):** "escreve o documento de requisitos e se precisar fragmente em mais de um épico. foque em
  separar em um épico o que já dá pra fazer hoje de modo simples, com o que temos, e coisas novas vao ficando pra
  outro épico."
- **2 épicos**, pela regra "Épico pelo esforço" da skill `requisitos` (decisão da redatora em 2026-11-24):
  - `requisitos/com-o-que-ja-existe/`: a tela nova sobre o que o back grava hoje, em 6 partes (tabela de
    categorias, campos, formulários, permissões fixas, pessoas e confirmação, Quem acessa);
  - `requisitos/regras-novas/`: o que pede back, em 3 partes (itens sem formulário e ações por formulário, padrão,
    Quais itens).
- **Conferido no código** (develop do back, 8669875cf), para pôr cada requisito num lado:
  - a ação sem lista de campos já vale como "todos os campos" na leitura, na criação e na atualização: "Todos os
    campos" fica no épico do que já existe;
  - a criação, a edição e a exclusão de item pela API olham só a permissão da categoria; Criar, Atualizar e
    Excluir por formulário só valem hoje na tarefa de formulário: a regra por formulário em toda porta vai para as
    regras novas;
  - a lista de cargos e a lista de membros já têm rota: Quem acessa e as pessoas do cargo ficam no épico do que
    já existe;
  - o item do formulário padrão fica sem formulário: a descrição de "Itens sem formulário" passou a citá-lo.
- **Para a redatora decidir:** as 3 partes das regras novas se lançam sozinhas e podem virar 3 épicos (P902 do
  épico); a correção do card USE87A7C6 na develop vaza os itens sem formulário no caso Cível e Criminal (P901 dos
  2 épicos).

## Requisitos, 7 épicos · 2026-11-24
- **Pedido (literal):** "organize as partes em ordem de relevancia, no caso da mudança de regras, ok? ordem de
  urgencia. se algo for muito urgente, tem que ter um épico só pra aquilo, pra subir logo. [...] se for pra subir as
  partes separadamente, aí tem que ter um epico pra cada. se for pra subir tudo jnto pra ter logica, ok. é um pacote
  de um epico mesmo"
- **Mudou:** os 2 épicos viraram 7, em ordem de urgência (`requisitos/README.md`). Cada um sobe sozinho; só a tela
  nova tem partes, porque tabela, campos, formulários e confirmação só fazem sentido juntos.
  - O urgente (itens sem formulário) ganhou épico próprio e não espera a tela nova: a origem entra como 1 nó na
    árvore de hoje.
  - Ações por formulário em toda porta saiu dos itens sem formulário: não é urgente e sobe depois.
  - A parte de Quais itens que depende do padrão foi para o épico do padrão.
  - Permissões fixas e Quem acessa saíram da tela nova: sobem sozinhas.
- **Para a redatora decidir:** a ordem dos épicos 2 a 7 é proposta do agente.

## Card no ENSPACE · 2026-11-24
- **Pedido (literal):** "na verddade por enquanto voce vai criar somente o primeiro card, o mais urgente do joao. os
  outros nao. se ja criou pode deletar." Nenhum card tinha sido criado antes: não havia o que apagar.
- **Card** (desenvolvimento-enlighten2): `USEA5B7584D4402492EB72602B5C8950` (598686), "[PERMISSÕES] Itens sem
  formulário nas permissões do cargo". Descrição = `requisitos/1-itens-sem-formulario/epico.md`; critério de aceite no
  campo próprio (6 pontos: Demandas do agente de IA, Cível e Criminal, abertura pelo endereço, árvore, migração); link
  do protótipo; To Do, Melhoria, prioridade Urgente, teste do PO. Sem responsável: a redatora não indicou.
- **Tarefas** 26562 ("1. Origem na tela de permissões", 5 caixas, 1 print) e 26563 ("2. Listagem e abertura", 9
  caixas, "Sem print" com o motivo), conferidas pela API.
- **Sem card:** os épicos 2 a 7, até a redatora pedir.
- **Falta:** conferir o card na tela. O Chrome parou na aprovação da Microsoft (Authenticator), que é da redatora.

## Rodada 6 · 2026-11-27
- **Pedido (literal):** "nessa tabela do print, vale o cabeçalho ter alguma indicativo visual, tipo cor ou opacidade
  diferente. só pra dar pra entender que é cabeçalho. hoje ta parecendo uma linha \"quebrada\"" e "o mesmo vale pro
  cabeçalho da parte de categorias, ok?"
- **Mudou:** o cabeçalho das tabelas de permissão (fora das categorias, Categorias e a aba Configurações) tem fundo
  `bg-elevated` e texto `text-highlighted`. Antes, o fundo era o mesmo das linhas.
- **Pedido (literal):** "na tabelinha do padrao, falta alinhar a altura dos textos de criar, ver, atualizar, excluir e
  outras açoes". **Mudou:** os títulos do cabeçalho ficam alinhados pelo topo; antes, "Área" e "Outras ações" ficavam
  no meio da célula e as ações, com a caixa embaixo, no topo.
- **Pedido (literal):** "esses cadeados estao com tooltips simples. nao acha que poderia ser um popover? um pouco mais
  elaborado, e que nao só com hover do mouse aparece, mas também se o user clicar no cadeado abre". **Mudou:** o motivo
  da caixa travada abre num popover com ícone, título ("Exigido por Atualizar.") e texto ("Desmarque Atualizar para
  tirar Ver."). Abre no hover e no clique do cadeado ou da caixa; o clique fixa o popover até clicar fora ou apertar Esc.
  A caixa travada não abre mais a dica simples.
- **Pedido (literal):** "o padrao e a categoria nao deveriam estar em abas diferentes? o que acha?". **Mudou:** a aba
  Dados tem 2 abas: Categorias (primeiro, porque é o que cresce com o workspace) e Fora das categorias (Agenda, IA,
  Spaceflows e Tarefas). O nome "Padrão" sai dessa seção: ele passa a querer dizer só o padrão das categorias novas.
- **Pedido (literal):** "me parece confuso do ponto de vista de ux essas 2 linhas do print . uma é um seletor geral e
  outra é um seletor de padrão pra todas as categorias. voce manteria assim? ou colocaria o padrão pra ser definido em
  todo lugar? explicando ao user que padrao = o que se define pra esse cargo em qualquer nova categoria que será criada
  no futuro." **Decisão:** o padrão vale só para as categorias criadas a partir de agora e sai da tabela para o bloco
  "Padrão para novas categorias", acima da busca. Cada categoria que já existe guarda o próprio valor. Saem a herança
  em tom claro, o selo e o filtro "Regra própria", os contadores "Liberado em" e "Tirado em" e os botões de voltar ao
  padrão. A caixa do cabeçalho de cada ação continua sendo o seletor geral da lista filtrada. Motivo: com as 2 linhas
  juntas, a pessoa não sabia qual mudava as categorias de hoje.
- **Pedido (literal):** "observe que o campo quais itens pode ser editado pela tabela e campos e formulários nao / tem
  que clicar pra personalizar e aí siom abrir a sidebar que permite editar isso / e ainda tem um chevron em cada linha
  que permite abrir e ver os forms. essa usabilidade ta confusa. [...] deixar mais bem centralizado e fluida a
  navegaçao". **Decisão:** 1 porta por categoria. O nome ou a seta abre, na mesma grade, os formulários e "Itens sem
  formulário", "Só se for o criador", "Só se for o responsável" (com a escolha dos campos Pessoa na própria linha) e
  "Campos". As colunas Quais itens, Campos e Formulários viram 1 coluna, Restrições, que só resume o que a categoria
  limita ("1 de 4 formulários", "76 de 80 campos", "Só alguns itens"); o clique no resumo abre a categoria. Saem o
  botão Ajustar e o popover de Quais itens. A barra lateral fica só para o campo a campo, com o título "Campos de
  <categoria>", e abre pelo botão "Escolher campos" da linha Campos ou pelo traço de campo. Referência: a expansão em
  linha do Strapi e do Appsmith e o campo a campo à parte do Twenty e do Salesforce (`PESQUISA.md`).
- **Pedido (literal):** "essa aba quem acessa nao deveria estar dentro da configuraçao de um cargo. percebe que é uma
  informaçao geral? de hierarquia acima." **Decisão:** a aba Quem acessa sai da tela do cargo. O épico 7 passa a pedir
  uma vista só de leitura na configuração da própria categoria, com o link para a tela de cada cargo. Ficou fora a
  tela de itens (quem lê itens não decide permissão) e a matriz de todos os cargos (com 120 categorias, vira outra
  árvore enorme).
- **Pedido (literal):** "aproveite tambem pra colocar uma caixa de seleçao na colunad e "outras açoes" na tabela de
  padrao". **Mudou:** o cabeçalho de Outras ações, na aba Fora das categorias e na aba Configurações, tem a caixa que
  marca ou desmarca todas as outras ações do grupo, como as caixas de Criar, Ver, Atualizar e Excluir.
- **O que muda e o que não muda:** muda a aba Dados (2 abas, o bloco do padrão, a coluna Restrições, as sublinhas e a
  barra lateral só de campos). Não muda a casca, o cabeçalho do cargo, o Salvar no topo, a aba Configurações (fora a
  caixa de Outras ações) e a aba Inválidas.

## Rodada 7 · 2026-11-27

- **Pedido (literal):** "eu acredito que "dados" dá pra ser dividido, nao? o padrão em uma aba que seja "ações
  gerais" ou algo assim, e outra aba só com as categorias." **Mudou:** as abas do topo passam a ser Categorias,
  Funcionalidades, Configurações e Inválidas. As sub-abas da rodada 6 saem. O código já separa a árvore assim: o que
  começa com `types::<slug>` é categoria; o grupo `default` (tarefas, agenda, assinaturas, Spaceflows, IA) vira
  Funcionalidades; `settings::` e os prefixos de administração ficam em Configurações.
- **Pedido (literal):** "chame "trabalho" de "geral" / e dentro dele vem o que voce colocou em trabalho e em
  documentos também / automação e IA pode deixar tb, mas cuidado pq tem isso dentro da aba de configuraçoes tambem."
  **Mudou:** Funcionalidades tem 2 grupos com título, Geral (Agenda, Tarefas rápidas, Tarefas programadas, Painel de
  tarefas, Assinaturas, Relatórios) e Automação e IA (Spaceflows, IA). Os grupos são só de leitura: a referência de
  cada linha continua no grupo `default` do código. Para não repetir o que está em Configurações: Spaceflows em
  Funcionalidades é iniciar e acompanhar (`workflows::`); montar e excluir fluxo continua em Configurações › Dados ›
  Spaceflows (`setupWorkflows::`). A sugestão de Excluir em Spaceflows saiu por isso.
- **Pedido (literal):** "açoes em itens nao deveriam estar abaixo de categorias? ou no codigo é separado mesmo?"
  **Decisão:** ficam na categoria, como no código (`types::<slug>::<ação>`). A categoria aberta ganha a sublinha
  "Outras ações", com Exportar, Ver histórico, Comentar e Excluir definitivamente. Cada uma exige uma ação da
  categoria (as 3 primeiras exigem Ver; Excluir definitivamente exige Excluir). A coluna Restrições mostra "{n} de
  {total} outras ações" quando a categoria tira alguma, e o bloco do padrão ganha a mesma linha. Ao abrir, quem vê
  a categoria tem Exportar, Ver histórico e Comentar, porque é o que vale hoje.
- **Pedido (literal):** "NAO se preocupe com estes gaps: base de conhecimento, arquivos, tarefas programadas,
  formulario publico, link de tarefa externa, Saved views for everyone, feature flags / o resto pode aplicar".
  **Mudou:**
  - Funcionalidades: Assinaturas (Criar, Ver, Cancelar) e "Gerenciar agentes" na IA, que já estão no develop;
    Painel de tarefas (Ver); Relatórios (CRUD); em Spaceflows, "Ver execuções" e "Cancelar execução"; na IA, "Usar
    IA em campos e anexos".
  - Configurações: Faturamento em Sistemas (Ver, "Comprar créditos"); em Membros, "Importar membros", "Gerenciar
    ausências" e "Mesclar duplicados"; em Interface, Início (Atualizar, os widgets para todos), Migrações (Ver,
    "Executar migração") e Casos de uso com o CRUD.
- **Pedido (literal):** "use /investigar-codigo pra ter certeza de que está fazendo no front alinhamentos que seguem a
  logica do back". **Como ficou:** o back só aceita referência cuja 1ª parte e cuja ação estão na lista dele
  (`validatePermissionReference`). Cada linha nova tem uma referência que o back já aceita ou que pede uma mudança
  declarada no requisito (épico 9, "Permissões novas"). "Personalizar o Início para todos" saiu de Funcionalidades e foi para
  Configurações › Interface (`screens::`), porque é ação de administração.
- **O que muda e o que não muda:** mudam as abas do topo, os grupos de Funcionalidades, as linhas novas e a
  sublinha Outras ações. Não muda a tabela de categorias da rodada 6, a casca, o cabeçalho do cargo e o Salvar.
- **Requisitos da rodada 7:** épico 8, "Permissões valem na API" (o back confere hoje só dono ou membro full em
  Configurações e em cargos; o histórico e o comentário de item conferem só se a pessoa é membro do workspace), e
  épico 9, "Permissões novas", com a referência e a mudança do back de cada linha nova. Lido no código da develop em
  2026-11-27, sem teste pela API.

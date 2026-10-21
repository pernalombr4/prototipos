# Decisões: galeria de casos de uso

## Rodada 1 · 2026-10-20
- **Pedido (literal):** "voce deve criar um prototipo pra reformular somente a galeria de casos de uso. a parte superior da tela, de importar e exportar, será mantida como hoje em dia. agora, a parte abaixo deve ter essa aparência de "lojinha" como nos outros prototipos."
- **Mudou:** o bloco "General" vira a galeria de casos de uso, na mesma posição da página
  - lateral com Destaques e Todos do ENSPACE, e os filtros Localidade e Complexidade
  - Localidade começa marcada pelo idioma de quem abre (pt-BR: Brasil; en: Estados Unidos; es: Global), como o produto escolhe hoje
  - busca, Áreas (várias marcadas, com busca e Selecionar tudo) e o total de resultados
  - Em destaque, e os cartões agrupados por área, com "Ver mais" depois de 3
  - o cartão inteiro abre o detalhe; o botão Saiba Mais sai
  - o detalhe abre no lugar da lista, com volta para a galeria: galeria de imagens que amplia, descrição, O que vem junto e, à direita, quem fez, quando, quantas vezes e a localidade
  - **Usar caso de uso** abre a confirmação com o que entra no workspace e os 2 avisos do produto (duplicação e cobrança)
- **Fronteira:** muda o bloco abaixo do aviso de Atenção; não muda a casca, o cabeçalho, a Migração de Workspace nem o aviso de Atenção
- **Nome proposto:** o grupo "categoria" ("General") passa a se chamar **área**. Categoria no ENSPACE é o tipo de item, e o caso de uso cria categorias (regra 29)
- **Rótulo proposto:** "Migrar Caso de Uso" vira **Usar caso de uso**, o mesmo dos outros 2 protótipos. O comportamento é o de hoje: soma e roda pela tabela de Backup/Migração
- **Descartado:** "Do seu workspace" e "Criar caso de uso". Motivo: esta tela não tem caso criado pelo workspace hoje, e a demanda pede só a galeria
- **Descartado:** escolha entre somar e substituir antes de usar (do `menu-lateral`). Motivo: a migração de hoje só soma; mudar isso é o protótipo `migracao-de-workspace`
- **Maquete:**
  - Exportar Workspace gira e mostra o aviso; não baixa arquivo
  - Importar Workspace não abre nada
  - Usar caso de uso mostra o aviso de envio; o workspace não muda
  - as imagens dos casos são desenhadas com o conteúdo do caso (`_PreviaDoCaso.vue`), no lugar das imagens que o ENSPACE cadastra
  - complexidade, destaque, data e usos são do protótipo; o produto não tem esses dados hoje
- **Em aberto:**
  - Quantos casos de uso o catálogo de produção tem hoje, e quantos deve ter? O desenho cabe para dezenas (regra 34); com centenas, a busca vira a navegação principal
  - O produto vai guardar complexidade, área, destaque e o que vem junto de cada caso? Sem isso, os filtros e o detalhe ficam vazios
  - Quem cadastra as imagens da galeria de cada caso?
- **Não deu:** prints pelo Chrome da Mikaela. Por quê: a captura do Chrome travou em todas as páginas (janela minimizada ou coberta). Os prints do protótipo local saíram do Chrome em modo headless, por script no scratch; os do develop saíram do Chrome dela antes da trava
- **Crítica e acessibilidade (skill `design:design-critique` e conferência à mão de foco, rótulo e contraste):**
  - corrigido: no celular a lateral some e levava junto Localidade e Complexidade. Agora o botão Filtros abre os mesmos filtros
  - corrigido: em "Sem permissão" o motivo ficava num tooltip de botão desligado, que o teclado não alcança. Agora o motivo aparece embaixo do nome do caso, ligado ao botão por `aria-describedby`
  - corrigido: na confirmação, categoria e menu com o mesmo nome ("Contratos") apareciam em sequência. Agora a lista vem em grupos: Categorias e campos, Menus e telas, Status
  - fica: o caso em destaque aparece também no grupo da área dele, como no ClickUp. A repetição só existe em Destaques sem filtro
  - fica: a barra do topo da casca aperta no celular. É cópia do develop (regra 37)
  - cartões, pontos da galeria e setas têm nome para o leitor de tela; o total de resultados é `aria-live`; cor só por token, nos 2 temas
- **Ver:** http://localhost:3000/galeria-de-casos-de-uso · `evidencias/proposta-1-galeria.jpg`

## Rodada 2 · 2026-10-20
- **Pedido (literal):** "esse botao selecionar tudo ta super estranho ai dentro, tem que ser mais delicado. ta simplesmente um botao aleatorio no meio de algo que é um dropdown. veja o que tem no /nuxt-ui:find-component-for-usecase (MCP) pra dar uma cara melhor a isso"
- **Mudou:** Áreas deixa de ser um popover montado à mão e passa a ser o `USelectMenu` múltiplo
  - a busca é a do próprio componente
  - cada área marcada ganha a marca de seleção do componente, na linha
  - "Selecionar tudo" e "Limpar" viram links no pé da lista, com a contagem ("2 de 8"); cada um se desliga quando não tem o que fazer
  - o botão mostra a quantidade marcada num selo
- **Consulta:** MCP `nuxt-ui`, `search-components` com "multi select dropdown with search and checkboxes": o primeiro resultado é o `SelectMenu`. Slots `default` e `content-bottom` conferidos em `node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue`
- **Fronteira:** muda só o menu de Áreas; não muda o resto da galeria
- **Ver:** `evidencias/proposta-3-areas-marcadas.jpg`

## Requisitos · 2026-10-20
- **Pedido (literal):** "pode fazer o doc de requisitos pro dev criar essa galeria de casos de uso aí"
- **Mudou:** `REQUISITOS.md` com 5 regras de negócio, 40 requisitos funcionais em 4 grupos (galeria, estados, detalhe, usar), 2 interfaces, 2 não funcionais, 3 restrições e 9 itens em aberto
- **Fronteira:** o documento cobre só o bloco da galeria; cabeçalho, Migração de Workspace e Atenção ficam fora

## Rodada 3 · 2026-10-20
- **Pedido (literal):** "tem que ter nessa galeria de casos de uso a opção de CRIAR um caso de uso a partir do que ta no workspace naquele momento, com aviso de que vai ficar publico pra todo mundo que utiliza o enspace aquilo ali ou com opção de salvar só no workspace ou publicar na lojinha (opçao 2 é melhor). prototipe a opçao 2 mas coloque nos requisitos essa opçao pro dev, q se nao der pra ter as 2 possibilidades, ter o aviso"
- **Pedido (literal), na mesma rodada:** "entre os menus "destaque" e "todos do enspace", nas outras telas, tem um "neste workspace" como opçao, é lá que esses criados devem ficar" e "ou algo como "deste workspace" e lá nesse menu, se acessado, ter tambem atalho pra essa criaçao!"
- **Mudou:** a lateral ganha a vista **Deste workspace**, entre Destaques e Todos do ENSPACE, com os casos criados aqui
  - dentro dela, a faixa "Transforme este workspace em um caso de uso" com **Criar caso de uso**; sem caso, o estado vazio com o mesmo botão
  - a janela Criar caso de uso: nome, área, complexidade, localidade, descrição, imagens e "O que entra" (cada categoria e cada menu do workspace, marcados ao abrir)
  - **Onde o caso de uso fica** (opção 2 do pedido): Só neste workspace (padrão) ou Galeria do ENSPACE, num USelect com "?", como os outros modais de configuração
  - com a galeria escolhida: o aviso "Este caso de uso fica público" e a caixa de confirmação, obrigatória para publicar; o botão vira "Publicar na galeria"
  - o caso publicado aparece em Deste workspace e em Todos do ENSPACE; o cartão mostra o globo (publicado) ou o prédio (só no workspace)
  - o detalhe de caso criado aqui mostra "Por {workspace}", sem "Verificado", e a Visibilidade
  - sem descrição, o detalhe não mostra o bloco "Descrição" vazio
- **Requisitos:** grupos "Deste workspace" (RF041 a RF044) e "Criar caso de uso" (RF045 a RF062), RN006 a RN009 e RI003. O plano B que ela pediu está em RF060: se o produto só puder publicar na galeria, o aviso e a confirmação aparecem em cada criação
- **Fronteira:** muda a galeria (vista nova e janela de criar); não muda a parte de cima nem o Usar caso de uso
- **Descartado (revisto):** a rodada 1 tinha deixado de fora "Do seu workspace" e "Criar caso de uso". Esta rodada traz os 2 de volta, a pedido dela
- **Maquete:** o caso criado vive só na memória da página (o reload apaga); a publicação é imediata, sem revisão do ENSPACE (P9 dos requisitos)
- **Em aberto que pesa:** o nome do workspace que criou ("Por Grupo Aurora") aparece para as outras empresas? Ele identifica o cliente (P10)
- **Ver:** `evidencias/proposta-10-deste-workspace-vazio.jpg` · `proposta-11-criar.jpg` · `proposta-12-publicar-aviso.jpg` · `proposta-13-criado.jpg` · `proposta-14-detalhe-criado.jpg`

## Rodada 4 · 2026-10-20
- **Pedido (literal):** "o criar nao é só com categorias e menus que o workspace ja tem, é com todas as entidades que o workspace tem (pode botar fluxo, pode botar menu, pode botar muita coisa)" e "tem que indicar pro dev pra disponibilizar tudo no seletor, e voce ja deve fazer um texto mais abrangente pra botar aí nos requisitos e no prototipo"
- **Mudou:** "O que entra" vira um seletor de cada tipo de entidade do workspace, num grupo por tipo
  - os 10 tipos do protótipo saem das chaves do arquivo de exportação de hoje: Categorias, Menus e telas, Formulários, Pastas, Listas, Fluxos da categoria, Spaceflows, Modelos de e-mail, Modelos de documento, Relatórios
  - cada grupo tem a caixa do grupo (marca e desmarca tudo, parcial quando parte está marcada), "{marcadas}/{total}" e abre e fecha; Categorias abre aberto
  - a busca "Buscar no workspace" procura em todos os tipos e abre só os grupos com resultado; o topo mostra "{n} de {total} selecionados"
  - o detalhe ("O que vem junto") e a confirmação de uso mostram 1 bloco por tipo que o caso traz; 2 casos do ENSPACE ganharam formulários, Spaceflows, listas, fluxos, modelos e relatório
  - textos mais abrangentes: descrição da janela, faixa, estado vazio, dica de "O que entra", erro e aviso de público (que agora cita o texto dos modelos)
- **Requisitos:** RN006, RF030, RF034, RF042, RF043, RF045, RF048, RF050, RF053, RI001 e RI003 reescritos; RF063 (o seletor oferece cada tipo que a exportação leva, e os do protótipo são exemplo), RF064 a RF068 (grupo, contagens, busca); perguntas P14 (dependência entre entidades), P15 (a exportação leva Spaceflows?) e P16 (texto dos modelos)
- **Fronteira:** muda o "O que entra" e os textos do criar; não muda o resto da janela nem a galeria
- **Maquete:** a dependência entre entidades não existe no protótipo: desmarcar a categoria de um fluxo não avisa (P14)
- **Ver:** `evidencias/proposta-15-o-que-entra.jpg` · `proposta-14-detalhe-criado.jpg`

## Rodada 5 · 2026-10-21
- **Pedido (literal):** "perceba que com a nova galeria de casos de uso ta com uma diferença desconfortavel de largura entre a parte inicial da tela e a galeria? como unificar melhor essas duas coisas? pense ux/ui"
- **Diagnóstico:** eram 2 grades. A parte de cima numa coluna de 768 px, centralizada; a galeria na área inteira (cerca de 1.670 px numa tela de 1.915 px). As bordas esquerdas ficavam a cerca de 460 px uma da outra, e os cabeçalhos das 2 seções tinham estilos diferentes
- **Mudou:** a página inteira passa a ser uma coluna só, centralizada, de até 1.152 px (`max-w-6xl`)
  - cabeçalho, Migração de Workspace, Atenção e galeria com as bordas alinhadas
  - o cabeçalho da galeria copia o molde do cartão de migração: ícone em quadrado cinza, título no mesmo tamanho e peso, descrição embaixo, mesmo raio de canto
  - a galeria mantém 3 colunas de cartões e a lateral de filtros
- **Por que 1.152 px e não 768 px:** com 768 px, sobram cerca de 500 px para os cartões ao lado da lateral, e a vitrine cai para 1 ou 2 colunas. Com 1.152 px, cabem 3 colunas e o cartão de migração continua legível
- **Fronteira:** muda a largura da coluna e o cabeçalho da galeria; não muda o conteúdo da parte de cima
- **Andaime:** "Largura" alterna entre Unificada (padrão) e Como na rodada 1, para comparar
- **Requisitos:** RF069 (uma coluna só, largura <proposta: 1.152 px>) e RF070 (cabeçalho no mesmo molde)
- **Ver:** `evidencias/proposta-16-largura-unificada.jpg` · `evidencias/proposta-17-largura-unificada-cartoes.jpg`


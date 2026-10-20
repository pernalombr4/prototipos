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

# Releases no docs: decisões

Proposta da pesquisa de mercado de 2026-11-24 (deploy contínuo e lançamento), seção 5: com deploy
contínuo, o número da versão deixa de marcar o lançamento. A aba Releases vira changelog por item, o
Blog fica com o post do mês, e "Próximas mudanças" reúne o que exige ação do cliente, com prazo.

## A fronteira

- **Muda:** o conteúdo das abas Blog e Releases, o texto do topo da aba Releases, e 2 abas novas
  dentro de Releases (Changelog e Próximas mudanças), com o botão Assinar.
- **Não muda:** a casca do docs (logo, seletor de produto, os 4 links Docs, Blog, Releases e Dev,
  tema, idioma, Entrar), o topo das seções (`EnPageHero`), o filtro de categoria do Blog, o quadro
  escuro dos posts (`ReleaseNotesBanner`) e o componente da linha do tempo (`UChangelogVersions`).

## A jornada

```mermaid
flowchart LR
  B[Blog: lista] -->|Ler o post| P[Post do mês]
  P -->|Ver no changelog| C[Releases: Changelog]
  P -->|Ver em Próximas mudanças| M[Releases: Próximas mudanças]
  C -->|Ver o que fazer| M
  M -->|Ver no changelog| C
  C -->|Ver no post do mês| P
  C -->|Copiar link| L[Link permanente da entrada]
  L -->|Abrir o link| C
  C -->|Assinar| A[E-mail e RSS]
```

## Rodadas

### Rodada 1 · 2026-11-24
- **Pedido (literal):** "Prototipe a nova comunicação das releases do ENSPACE no docs (docs.enspace.io), seguindo o agente de protótipos do ENSPACE." Itens do pedido: aba Releases como changelog por item, com estado, "Exige ação" com "agir até", Beta ou Acesso antecipado, "Liberado para alguns workspaces", filtros por tipo, módulo e "Exige ação", versão como dado técnico e link permanente; aba Blog com o post do mês, só Tier 1 e Tier 2 em destaque, com lugar para o passo a passo e a navegação guiada; página "Próximas mudanças" com data, prazo, o que fazer e as 3 fases; feed RSS e inscrição por e-mail só como interface.
- **Mudou:**
  - **Changelog por item:** 1 entrada por item, correções e patches inclusive. O título é o item ("Spaceflow: nó de espera por data"); a versão desce para o rodapé da entrada, em fonte mono
    - rótulos na ordem: Exige ação com o prazo, tipo, módulo, estado (Em breve, Liberando, Disponível), Beta ou Acesso antecipado, Liberado para alguns workspaces
    - Exige ação vem primeiro: é o rótulo que quem administra procura
    - Em breve mostra "Previsto para"; Liberando mostra "Para todos até"
    - Em breve abre a lista, acima do mês corrente; depois, 1 grupo por mês
  - **Filtros:** tipo (Todos, Novidades, Melhorias, Correções), módulo (vários de uma vez) e a chave "Só o que exige ação", com a contagem de entradas e o estado sem resultado com "Limpar filtros"
  - **Link permanente:** "Copiar link" copia `docs.enspace.io/<idioma>/releases/docs#<id>` e põe a âncora na barra; quem abre o link cai na entrada, com o contorno aceso. A âncora nasce do título em pt e não muda depois de publicada
  - **Aviso no topo do changelog:** "3 mudanças exigem ação. A mais próxima: até 12 de janeiro.", com o botão para Próximas mudanças
  - **Próximas mudanças:** aba ao lado do Changelog, com a contagem das abertas. Cada mudança é 1 cartão com o prazo em destaque ("Agir até", "Faltam N dias", a data anterior quando mudou), Por que muda, Quem é afetado, O que fazer em passos numerados e as 3 fases em linha do tempo, com "Agora" na fase atual
    - fases: Opcional (liga quem quiser), Ligada por padrão (quem não terminou desliga), Obrigatória (não desliga mais); o prazo é o início da fase obrigatória
    - "Mostrar encerradas" traz as que já viraram obrigatórias
  - **Post do mês:** "Novidades de dezembro" no lugar de "3.4.0 está no ar". O quadro escuro mostra o mês no lugar da versão
    - seções: aviso de Exige ação, Em destaque (Tier 1, com o passo a passo em grade e o lugar da navegação guiada), Também neste mês (Tier 2, com o passo a passo recolhido), Correções e outros itens (só a contagem e o botão para o changelog), e o convite para assinar
    - "Nesta página" à direita, como no post de hoje
  - **Blog:** a categoria "Releases" vira "Novidades do mês"; os posts por versão que já existem ficam nela, com o selo "Arquivo"
  - **Assinar:** janela com e-mail e 3 opções (o post do mês, o resumo semanal do changelog, só as mudanças que exigem ação) e 2 feeds RSS (changelog inteiro, só o que exige ação) com botão de copiar
  - **Andaime:** Versão Hoje e Proposta. Hoje reproduz a aba Releases por versão e o Blog com "<versão> está no ar"; Estado Cheio, Vazio e Carregando
- **Fronteira:** muda o conteúdo de Blog e Releases e o texto do topo de Releases; não muda a casca do docs nem os componentes que as 2 abas já usam
  - Próximas mudanças mora como aba dentro de Releases, e não como 5º link do topo: a barra do topo fica como é (regra 37)
  - a casca tem 4 diferenças do `SpaceNavigation`, todas de maquete: o menu do celular usa o ícone `i-lucide-menu` no lugar das barras animadas; o logo é o `enspace.svg` local; as estrelas do quadro escuro são pontos fixos; as cores da nebulosa usam `color-mix` com a paleta do tema
- **Descartado:**
  - versão no título da entrada. Motivo: com deploy contínuo, várias versões por mês viram ruído para o cliente; o número fica para o suporte
  - post por versão no Blog. Motivo: o pedido; o post do mês junta Tier 1 e Tier 2
  - 5º link "Próximas mudanças" no topo. Motivo: regra 37, a casca não muda
  - passo a passo dos itens Tier 2 aberto. Motivo: 4 itens com 4 imagens cada viram uma página longa; recolhido, o Tier 1 continua em destaque
  - correções no post do mês. Motivo: o pedido; ficam no changelog, com a contagem no post
- **Não deu:**
  - prints das referências (Notion, Twenty, ClickUp, Monday, Pipefy e os extras). Por quê: a pesquisa trouxe texto e endereço; o `PESQUISA.md` diz o padrão de cada uma
  - Fase 2 (ver a tela no develop). Por quê: o docs é público e não tem develop; a tela de hoje vem do `en-docs` lido e dos 2 prints da pesquisa (`evidencias/hoje-aba-blog.jpg`, `evidencias/hoje-aba-releases.jpg`)
  - link para a documentação de suporte em cada entrada. Por quê: o pedido não trouxe; é o próximo candidato, ao lado de "Ver no post do mês"
- **Maquete:**
  - todo o conteúdo vem do `mocks.ts`: 16 entradas, 4 mudanças, 4 posts na proposta e 4 em Hoje, com títulos e resumos inventados no estilo do ENSPACE, sem cliente
  - a data de referência é 2026-12-15: "Faltam N dias", "Agora" e "Em breve" se contam a partir dela
  - Assinar: o envio espera 900 ms e mostra "Falta confirmar"; nada sai do navegador. Os feeds RSS são endereços de exemplo
  - Copiar link usa a área de transferência do navegador; sem permissão, o aviso mostra o endereço
  - imagens do passo a passo e a navegação guiada do Tango são caixas vazias com o rótulo
  - artigos do Blog e os posts de Hoje não abrem; Docs e Dev do topo mostram o aviso "fora do protótipo"
  - Hoje reproduz 2 defeitos da aba Releases atual, de propósito: a data sai 1 dia antes e em inglês. A proposta formata a data em UTC, no idioma da página
  - campos que o frontmatter do `en-docs` não tem estão marcados `PROPOSTA:` no `mocks.ts`: `id` (âncora), `tipo`, `modulo`, `estado`, `publico`, `todosAte`, `acesso`, `mudanca`, `tier`, `category: mensal` e `mes` do post. `release.version` deixa de ser título e vira dado técnico
- **Crítica e acessibilidade:**
  - rótulos e botões em amarelo cheio ou fantasma mediam 1,8 a 1,9 de contraste. Corrigido: Exige ação virou contorno amarelo com fundo claro e texto escuro; as ações "Ver o que fazer" e "Ver em Próximas mudanças" ficaram neutras, com o ícone em amarelo. O aviso amarelo mede 4,65
  - sem correção: a aba ativa e o botão cheio "Todos" na cor da marca medem 3,39 no texto pequeno. É a cor primária que o docs já usa; mudar é decisão de marca, fora desta demanda
  - sem correção: os botões `xs` do rodapé da entrada (Copiar link, Ver o que fazer, Ver no post do mês) ficam abaixo de 44 px de altura de toque. Mantidos pequenos para a entrada não crescer
  - na tela estreita, o botão do aviso desce para baixo do texto
  - a contagem de entradas anuncia a mudança de filtro para leitor de tela (`aria-live`)
  - nenhum CSS próprio: `<style>`, `:deep()` e `!important` não aparecem na pasta
- **Ver:** `http://localhost:3000/releases-no-docs` · `evidencias/rodada1-releases-changelog.jpg` · `evidencias/rodada1-proximas-mudancas.jpg` · `evidencias/rodada1-post-de-dezembro.jpg` · `evidencias/rodada1-blog-lista.jpg` · `evidencias/rodada1-assinar.jpg` (os 14 prints da rodada estão em `evidencias/`, com o prefixo `rodada1-`)

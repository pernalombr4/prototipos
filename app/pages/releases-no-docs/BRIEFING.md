# Releases no docs: briefing

## A demanda, como ela veio

> Prototipe a nova comunicação das releases do ENSPACE no docs (docs.enspace.io), seguindo o agente de protótipos do ENSPACE.
>
> O que prototipar (a proposta da pesquisa, seção "5. Comunicação das releases no docs.enspace.io" de [...] RELATORIO.md, e a nota evidencias\notas\docs-enspace.md da mesma pasta, com os prints evidencias\docs-aba-blog.jpg e evidencias\docs-aba-releases.jpg):
> - Aba Releases como changelog por item: 1 entrada curta por item, inclusive patch e correção; rótulos de estado ("Em breve", "Liberando", "Disponível"), "Exige ação" com "agir até", "Beta" ou "Acesso antecipado", "Liberado para alguns workspaces"; filtros por tipo (novidade, melhoria, correção), módulo e "Exige ação"; a versão como dado técnico da entrada, não título; link permanente por item.
> - Aba Blog com o post mensal de lançamento, pelo mês ou tema ("Novidades de dezembro"), só com os itens Tier 1 e Tier 2 em destaque, e o lugar do passo a passo e da navegação guiada que o post de hoje já tem.
> - Página "Próximas mudanças": cada mudança que exige ação, com data prevista, prazo ("agir até"), o que o cliente precisa fazer e as fases (opt-in, padrão ligado com opt-out, obrigatório).
> - Feed RSS e inscrição por e-mail (só a interface).
>
> [...] Não copie os textos das releases para economizar: use dado mockado curto (títulos e resumos inventados no estilo do ENSPACE, sem nome de cliente). O protótipo reproduz a casca do docs (cabeçalho com Docs, Blog, Releases, Dev) para a comparação ficar clara.

Origem: pesquisa de mercado "Separe o deploy da data de lançamento", rodada de 2026-11-24, repositório
`pesquisa-de-mercado`, seção 5 e achado A5.

## A tela em jogo

- `https://docs.enspace.io/pt/releases/docs`: aba Releases, "Versões do ENSPACE".
- `https://docs.enspace.io/pt/blog/docs`: aba Blog, "Blog do ENSPACE", categoria Releases.
- O post de release, por exemplo `https://docs.enspace.io/pt/blog/docs/release-3-2-0`.
- No produto, o menu Ajuda > Releases abre a mesma aba Releases dentro do ENSPACE (`?embed=1`).

## O que seria sucesso

Quem administra um workspace acha, sem ler um post de 9 mil palavras, o que mudou no módulo dele e o
que precisa fazer até quando.

## O que a pesquisa de UX já dizia

**Procurei e não havia nada sobre este assunto.** O `enspace-ux-research` não tem tema de
documentação nem de release notes (temas: `configuracoes-do-sistema`, `construtor-de-telas`,
`base-de-conhecimento`, `categorias`, `agenda`, `plataforma`). O `UX_REPORT.md` cita "Help › Releases"
uma vez, só na lista de controles acionados da Sessão 2, sem fricção registrada.

## Por que a Fase 2 não foi no develop

O objeto é o site público de documentação, que não tem par em develop. O estado de hoje vem de 3
fontes:

- a nota `evidencias/notas/docs-enspace.md` e os 2 prints da pesquisa de mercado, lidos no site
  publicado em 2026-11-24 (cópia dos prints em `evidencias/hoje-aba-blog.jpg` e
  `evidencias/hoje-aba-releases.jpg`);
- o código do `en-docs` (somente leitura), lido em 2026-11-24: `app/pages/releases/[section].vue`,
  `app/pages/blog/[section].vue`, `app/pages/blog/[...slug].vue`, `app/components/EnPageHero.vue`,
  `app/components/ReleaseNotesBanner.vue`, `app/components/space/SpaceNavigation.vue`,
  `content.config.ts`, `i18n/lang/pt.yaml` e o frontmatter de `content/pt/2.blog/docs/release-3-2-0.md`
  (primeiras 25 linhas e títulos de seção). O texto das releases não foi copiado.

## Como a comunicação funciona hoje

1. A barra do topo tem 4 links: Docs, Blog, Releases, Dev. Ao lado do logo, a pílula de produto
   (ENSPACE, Word Plugin, Beni App, SDK desligado).
2. **Releases** abre "Versões do ENSPACE": `UChangelogVersions` com 1 entrada por versão minor, título
   "<versão> está no ar", resumo de até 4 linhas e o quadro escuro (`ReleaseNotesBanner`) com a versão.
   Abaixo dos posts, 14 versões antigas (2.2.0 a 2.4.5) escritas no código, sem post.
3. **Blog** abre "Blog do ENSPACE": filtro Categorias (Todas, Artigos, Releases), o post mais novo em
   destaque (`UPageCTA`) e os outros em cards (`UBlogPost`). O mesmo post de release aparece nas 2 abas.
4. O post tem a estrutura fixa 1. Novidades, 2. Melhorias, 3. Correções, com passo a passo do Tango
   (`::steps`) e navegação guiada (`:iframe` do Tango) por item. De 1.184 a 9.265 palavras.
5. O frontmatter tem `title`, `description`, `date`, `category: release`, `badge.label` (minor, major,
   patch), `release.{codename, project, version, deployDate, color}`. Não tem módulo, tipo por item,
   estado, público, fase de acesso nem "exige ação".

## O que já existe e funciona

- O `UChangelogVersions` da aba Releases: a proposta usa o mesmo componente, por item.
- O passo a passo e a navegação guiada por item: o post mensal mantém os 2 no mesmo lugar.
- O quadro escuro da release: o post mensal usa o mesmo, com o mês no lugar da versão.
- O filtro de categoria do Blog: continua, com "Novidades do mês" no lugar de "Releases".

## Onde trava

- Patch e correção sem registro público depois do 2.8.10 (nota, achado 2).
- Nenhum rótulo de "exige ação", de público parcial, de beta; nenhum filtro por módulo ou tipo (achados 6 e 10).
- Nenhuma página de próximas mudanças, roadmap, feed ou inscrição (achado 5).
- O post é do número da versão, que com deploy contínuo deixa de marcar o lançamento.
- A data sai 1 dia antes da data do post e, em português, no formato inglês ("Oct 26, 2026") (achados 3 e 4).
  Print: `evidencias/hoje-aba-releases.jpg`.

## A casca da tela, item por item

Copiada do `SpaceNavigation.vue` e do `EnPageHero.vue` do `en-docs` e dos prints de 2026-11-24.
Componente: `_CascaDoDocs.vue` e `_HeroDaSecao.vue`.

| Peça | Como está no site | No protótipo |
|---|---|---|
| Barra do topo | Fixa, translúcida, `bg-white/15`, borda branca, sombra leve; escuro `bg-white/5` | Igual |
| Logo | `ENSPACE.svg`, `h-5.25`, invertido no claro | Igual, com o `enspace.svg` do protótipo `seletor-de-produto-na-doc` |
| Pílula de produto | `USelect` arredondado, ícone de grade, "ENSPACE", seta | Igual, só mostra (não troca de produto) |
| Links | DOCS, BLOG, RELEASES, DEV, maiúsculas, ícone à esquerda, `gap-8` | Igual; Docs e Dev mostram aviso de fora do protótipo |
| Ações | Sol ou lua, seletor de idioma com borda, botão ENTRAR escuro | Igual; o idioma do site é o do protótipo |
| Menu do celular | Botão de 3 traços animado | Botão com ícone de menu (simplificado) |
| Topo da aba | `UPageHero` com selo (foguete + título), título e descrição, borda embaixo | Igual; o fundo `LoginSpaceBackground` + estrelas virou o brilho rosa do topo |
| Lista do Blog | Filtro de categoria, `UPageCTA` horizontal, `UBlogPosts` em 3 colunas | Igual |
| Lista de Releases | `UChangelogVersions` com indicador animado, data à esquerda | Igual |

Achados da casca, que ficam como estão: o selo do topo repete o título da página; a data em inglês e
1 dia antes (reproduzidos no modo Hoje).

<!-- markdownlint-disable MD041 -->
# Releases no docs: referências

A base é a pesquisa de mercado de 2026-11-24 ("Separe o deploy da data de lançamento", seção 5 e
achados A2 e A5), que já leu Atlassian, Microsoft 365, Immuta, Discourse, Ashby, GitLab, Supabase,
Adobe, Coursedog, Linear, PostHog e Pipefy. Nesta rodada, li as páginas de release das 5 referências
obrigatórias e de mais 1 (Linear), em 2026-11-24.

Sem print das referências nesta rodada (ver "Não deu" no DECISOES.md).

## As 5 obrigatórias

### Notion: [notion.com/releases](https://www.notion.com/releases)

- **Como resolve:** 1 post por lançamento, pelo tema ("Agents, rebuilt to do more for less"); os
  lançamentos grandes levam a versão no título ("Notion 3.8: ..."). Data em cada post, link
  permanente pela data (`/releases/2026-10-19`), paginação. Beta, "em breve" e plano aparecem no texto,
  sem rótulo.
- **Serve:** título pelo tema; link permanente por post.
- **Não serve:** sem filtro, sem rótulo, sem feed nem e-mail; correção não aparece.

### Twenty CRM: [twenty.com/releases](https://twenty.com/releases)

- **Como resolve:** 1 entrada por versão (2.52.0, 2.51.0...), com data e os destaques em títulos
  curtos por baixo. O detalhe técnico fica no GitHub ("Technical notes").
- **Serve:** separar o texto para o cliente do detalhe técnico.
- **Não serve:** é o modelo de hoje do ENSPACE (preso ao número da versão); sem filtro, rótulo, feed.

### ClickUp: [feedback.clickup.com/changelog](https://feedback.clickup.com/changelog)

- **Como resolve:** "Release Notes 4.10", 1 por mês mais ou menos, agrupadas por data; filtro no topo,
  rótulo "New", link permanente por nota, curtida, compartilhar e **feed RSS**.
- **Serve:** RSS do changelog; link permanente.
- **Não serve:** título pelo número; a nota mensal junta tudo, sem entrada por item.

### Monday: [monday.com/whats-new](https://www.monday.com/whats-new)

- **Como resolve:** feed por item, agrupado por mês: título, data, 1 linha de resumo e o produto em
  etiqueta; **filtro por produto**; "Learn more" leva ao artigo de ajuda. Carrossel de destaques no topo.
- **Serve:** é o formato da proposta: 1 entrada curta por item, mês como agrupador, filtro, link para a doc.
- **Não serve:** só funcionalidade grande (usuário da comunidade reclama que o pequeno some); sem
  rótulo de estado, sem feed, sem link permanente próprio.

### Pipefy: [Pipefy Updates](https://community.pipefy.com/tips-inspiration-45/pipefy-updates-june-2026-5354)

- **Como resolve:** resumo mensal na comunidade (junho de 2026: 15 funcionalidades, cada uma com
  descrição, "What's new" e prints); só 1 item marcado "em rollout"; alguns "disponível para" um plano.
  Fonte: nota `saas-medio-porte.md` da pesquisa de mercado.
- **Serve:** o post mensal com print por item, que o ENSPACE já faz melhor (passo a passo e navegação guiada).
- **Não serve:** não há changelog por item ao lado; correção não aparece.

## As extras

### Linear: [linear.app/changelog](https://linear.app/changelog)

- **Como resolve:** post por lançamento, pelo tema, a cada 1 ou 2 semanas, com link permanente pela data
  e o título; os itens pequenos e as correções vão em lista por baixo, com etiqueta de área ("Fixed",
  "Added"). Abas por categoria (Changelog, Product launches...).
- **Serve:** correção e item pequeno registrados sempre, com área.
- **Não serve:** o item pequeno não tem link próprio.

### Atlassian Cloud e Microsoft 365 (da pesquisa de mercado)

- **Como resolvem:** a Atlassian marca cada item com COMING SOON ou ROLLING OUT; o Message center da
  Microsoft tem a coluna "Act by" e avisa com pelo menos 30 dias a mudança que pede ação do admin.
- **Serve:** os rótulos "Em breve", "Liberando" e "Exige ação · Agir até".

### Discourse, Ashby, Immuta e GitLab (da pesquisa de mercado)

- **Como resolvem:** Discourse e Ashby têm uma tela de "Upcoming changes" com a data de virada e a opção
  de ligar antes; a Immuta faz 1 mês opcional, 1 mês ligado com opção de desligar, depois obrigatório;
  o GitLab tem feed só de mudanças que quebram.
- **Serve:** a página "Próximas mudanças" com as 3 fases e o feed só do que exige ação.

## O padrão que todos seguem

- Data em cada entrada e ordem do mais novo para o mais antigo.
- Link permanente por post (Notion, ClickUp, Linear).
- Resumo periódico com o que é grande; correção fora do resumo, quando aparece.

## O que nenhum deles faz

- Nenhuma das 5 obrigatórias junta, na mesma página, o changelog por item e o que exige ação com prazo
  e fases. Microsoft e Discourse fazem isso dentro do admin, não na doc pública.
- Nenhuma tem passo a passo e navegação guiada por item no post mensal, que o ENSPACE já tem.
- Nenhuma liga a entrada do changelog ao post do mês e à mudança que pede ação, nos 2 sentidos.

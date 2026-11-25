# 4. Post do mês no Blog

**Objetivo:** quem segue o Blog lê 1 post por mês com o que mais importa, e chega ao resto pelo changelog.

**Depende de:** 1. Texto da versão na trilha; 3. Mudança que exige ação.

**Onde vale:** a aba Blog (`/<idioma>/blog/docs`) e a página do post do mês.

**Protótipo:** https://pernalombr4.github.io/prototipos/releases-no-docs/ (aba Blog, "Novidades de dezembro").

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN301 | Um item entra no post do mês da data de publicação dele. A versão em breve não entra. | Item publicado em 08/12/2026 entra em "Novidades de dezembro". | Obrigatório |
| RN302 | O item Tier 1 vai em Em destaque; o Tier 2, em Também neste mês. Correção e item Tier 3 ficam só no changelog. | Correção de 10/12/2026 conta em "Correções e outros itens" e não aparece no post. | Obrigatório |

## Lista do Blog (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | A categoria "Releases" do filtro do Blog deve passar a se chamar "Novidades do mês". | O filtro mostra Todas, Artigos e Novidades do mês. | Importante | Obrigatório |
| RF302 | O post do mês deve ter o título "Novidades de <mês>" e, no quadro escuro, o mês e o ano no lugar da versão. | "Novidades de dezembro", com "Dezembro de 2026" no quadro. | Essencial | Obrigatório |
| RF303 | O mês e o ano do quadro devem caber inteiros, quebrando em 2 linhas quando falta largura, sem corte. | No cartão estreito do celular, "Dezembro de 2026" aparece inteiro. | Importante | Obrigatório |

## Página do post (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF304 | Quando o mês tem mudança que exige ação com prazo aberto, o post deve abrir com o aviso "<n> mudança deste mês exige ação até <data>." e 1 link "Ver no changelog" por mudança, que leva ao item na aba Releases. | "1 mudança deste mês exige ação até 9 de fevereiro de 2027." e o link leva ao item dos webhooks na 3.4.0. | Essencial | Obrigatório |
| RF305 | A seção "Em destaque" deve mostrar os itens Tier 1 do mês, conforme RN302, com o passo a passo aberto e a navegação guiada. | Os 2 itens Tier 1 de dezembro mostram as imagens do passo a passo. | Essencial | Obrigatório |
| RF306 | A seção "Também neste mês" deve mostrar os itens Tier 2 do mês, com o passo a passo recolhido em "Ver o passo a passo (<n> passos)". | Clique em "Ver o passo a passo (4 passos)" abre os 4 passos. | Importante | Obrigatório |
| RF307 | A seção "Correções e outros itens" deve mostrar só quantos itens ficaram fora do post e o link "Ver no changelog". | "5 outros itens saíram neste mês, entre correções e melhorias pequenas." | Importante | Obrigatório |
| RF308 | O post deve terminar com o convite "Receba o post do mês por e-mail", que abre a inscrição da parte 5. Assinar. | Clique no convite abre a janela "Acompanhar as releases". | Desejável | Desejável |
| RF309 | A coluna "Nesta página" deve listar as seções do post. | "Nesta página" mostra Exige ação, Em destaque, Também neste mês e Correções e outros itens. | Importante | Obrigatório |

## Link da versão para o post (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF310 | O link "Ler o post de lançamento" de cada versão com item Tier 1 ou Tier 2 deve abrir o post do mês dos itens dela. | O link da 3.4.0 abre "Novidades de dezembro". | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI301 | Schema do conteúdo do Blog e dos itens (`content.config.ts`) | Deve aceitar a categoria do post do mês e o mês no post, e o Tier (1, 2 ou 3) em cada item. Nome dos campos: <a definir>; o `mocks.ts` do protótipo usa `category: mensal`, `mes` e `tier`. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | Os posts por versão já publicados continuam na lista do Blog, na categoria "Novidades do mês", ou saem da lista e ficam só pelo endereço? | produtos | RF301 ganha a linha dos posts antigos |

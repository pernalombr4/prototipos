# Afazeres — Configurações do Sistema

O que está aberto neste protótipo. Item resolvido sai daqui e vira entrada no
[`DECISOES.md`](DECISOES.md), com a rodada em que foi feito.

## Esperando decisão da Mikaela

- **Agrupamento das seções: A, B ou C** (rodada 26). Os 3 estão na barra de andaime. Escolhido
  B, os painéis internos de fundo passam a `bg-default`; escolhido C, a coluna ganha largura
  máxima. Os outros 2 saem num commit próprio (regra 11).
- **A cor da marca.** `bg-primary` com texto branco dá **3,39:1**, contra os 4,5:1 do WCAG AA
  para texto normal. Vale para todo botão e selo `solid` da cor primária, aqui e no produto.
  Alternativas medidas: `fuchsia-600` com branco (5,08:1), `fuchsia-500` com preto (6,19:1),
  `fuchsia-700` com branco (7,88:1). Decisão de marca, não de tela.
- **A correção de contraste sobe para o en-docs?** O defeito das variantes `subtle` e `soft` é do
  tema do produto. Hoje cada protótipo carrega a própria correção, em `app/tema-contraste.ts`.
  Ninguém daqui escreve no en-docs.
- **Informações Básicas, 2 propostas sem resposta:** juntar Comportamento e Módulos num cartão
  só (já quebrou uma vez, pela container query) e colapsar a lista da zona de perigo.

## Esperando resposta do produto

- **O formulário sobrescreve os 6 textos do bloco** (Nome, Descrição, Rótulo, Ajuda, Instrução,
  Placeholder) ou só alguns? O mock assume os seis, que foi o que a árvore do produto mostrou na
  visita ao `be-enspace`.

## Dívida desta aba

- **Tradução da tela para inglês e espanhol.** A regra 35 pede os 3 idiomas em toda tela, e
  esta aba ainda não tem `textos.ts`. São as 5 abas inteiras: rótulos, ajudas e as frases das
  regras de notificação.
- **Informação que só existe no ponteiro.** O valor dia a dia do gráfico de consumo sai só no
  hover; quem navega por teclado não alcança. O resumo do período está em texto ao lado, mas o
  ponto a ponto não.

## Achados do produto, para levar adiante

- Os links escritos dentro dos artigos do `docs.enspace.io` não têm o prefixo `/pt/docs/...` e dão
  404.
- A árvore de Dicionários do produto trunca o rótulo da chave dentro do formulário
  (`Tax Classification › N…`), e 6 linhas do mesmo campo ficam indistinguíveis.
- O subtítulo da tela de Dicionários promete traduzir "estágios", e não achei grupo de estágios em
  nenhuma categoria.
- Existe um ajuste na tela que a documentação não cobre: "Mostrar URL de integração".

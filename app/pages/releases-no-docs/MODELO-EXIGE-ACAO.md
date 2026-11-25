# Modelo: mudança que exige ação

Rodada 7 (2026-11-24), enxugado na rodada 9 (2026-11-25). O padrão da doc do Nuxt, em 2 lugares, com
o guia como a única fonte do "como":

| Onde | O que leva | Precisa de código novo? |
|---|---|---|
| Release (aba Releases) | O rótulo "Exige ação · Agir até <data>" e a seção "Exige ação", sempre aberta: título com o porquê, quem é afetado, "Agir até" e o link do guia | Sim, 1 vez: o rótulo e a seção saem do frontmatter |
| Guia de migração (Docs > Referência) | O que muda, por quê, quem, prazo e fases, passos e o que acontece depois | Não: só componentes que o `en-docs` já renderiza |

Depois que o dev fizer a parte da release, uma mudança nova pede só preencher os 2 modelos abaixo.

## 1. Na release: o bloco `actionRequired` do frontmatter

Proposta para o dev. Cada mudança é 1 item da lista, com 6 campos. Fases, passos e o que acontece
depois do prazo não entram aqui: moram só no guia (decisão da redatora em 2026-11-25).

- O rótulo da versão usa a data `required` mais próxima.
- O rótulo abre um popover curto com cada mudança: `title`, "Agir até `required`" com o `why` e o link
  "Abrir o guia de migração". O rótulo nunca leva direto ao guia: sair da página é escolha de quem lê
  (decisão da redatora em 2026-11-25).
- A seção mostra cada item nesta ordem: `title` com `why`, `who`, "Agir até `required`" e o link do `guide`.

```yaml
actionRequired:
  - id: assinatura-dos-webhooks          # âncora do item e nome do guia
    title: "Integrações: webhooks com nova assinatura de segurança"
    why: "A assinatura nova protege o seu servidor de envios falsos."
    who: "Workspaces com webhooks de saída ativos"
    required: 2027-02-09                 # o "Agir até"; a mesma data da fase Obrigatória do guia
    guide: /pt/docs/reference/migration-guides/assinatura-dos-webhooks
```

Regras do texto:
- `title` é o título do item no changelog; `why` tem 1 frase e não repete o título.
- `required` e a fase Obrigatória do guia mudam juntas. Prazo que mudou ganha o `::note` no guia.
- O link sai como "Guia de migração: <title do guia>", nunca "Saiba mais".

## 2. O guia de migração: markdown do `en-docs`, sem código novo

Arquivo em `content/<idioma>/1.docs/8.Reference/<n>.Migration Guides/<id>.md`, ao lado de "Limitações
Conhecidas". Todo guia mora ali, também o de API e de webhook: a aba Dev é a referência da API e não
recebe guia (decisão da redatora em 2026-11-25). O guia de API leva link para a página da rota. As seções
seguem o guia de atualização da doc do Nuxt: "What Changed", "Reasons for Change",
"Migration Steps".

````md
---
title: A nova assinatura dos webhooks passa a ser obrigatória
description: O que muda, quem é afetado e como migrar até 9 de fevereiro de 2027.
---

::warning
**Agir até 9 de fevereiro de 2027.** Depois do prazo, o ENSPACE envia só a assinatura nova, e o servidor que confere a antiga recusa os envios.
::

## O que muda

Cada envio leva uma assinatura que o seu servidor confere. A assinatura antiga sai em fevereiro.

Anunciada no changelog: [Integrações: webhooks com nova assinatura de segurança](/pt/releases#integracoes-webhooks-com-nova-assinatura-de-seguranca) (`3.4.0`).

## Por que muda

A assinatura nova protege o seu servidor de envios falsos.

## Quem é afetado

Workspaces com webhooks de saída ativos.

## Prazo e fases

| Fase | A partir de | O que acontece |
|---|---|---|
| **Opcional** | 08/12/2026 | Quem quiser liga a mudança antes. |
| **Ligada para todos** | 12/01/2027 | A mudança vem ligada. Quem ainda não terminou pode desligar. |
| **Obrigatória** | 09/02/2027 | A mudança não desliga mais. |

## Passos da migração

::steps
### No seu servidor, confira o cabeçalho X-Enspace-Signature-256 em cada envio

O cabeçalho traz o HMAC SHA-256 do corpo, feito com o segredo do webhook. Compare com o valor que o seu servidor calcula.

```diff [webhook.js]
- const received = req.headers['x-enspace-signature']
- const expected = hmac('sha1', secret, rawBody)
+ const received = req.headers['x-enspace-signature-256']
+ const expected = hmac('sha256', secret, rawBody)
  if (!safeEqual(received, expected)) return res.status(401).end()
```

### Em Configurações > Integrações > Webhooks, ligue Usar nova assinatura

Com a opção ligada, a assinatura antiga deixa de ser enviada para este webhook. Dá para desligar até o prazo.

### Clique em Testar e confira a entrega

A entrega de teste aparece no histórico do webhook com o status 200.
::

## Depois do prazo

Depois do prazo, o ENSPACE envia só a assinatura nova, e o servidor que confere a antiga recusa os envios.

::tip
Dúvidas sobre a migração? Abra um chamado no suporte com o nome do workspace.
::
````

Quando o prazo muda, o guia ganha, logo abaixo da tabela, `::note` com "O prazo mudou. A data anterior era <data>." (no protótipo, o guia da paginação por cursor). Sem código, o passo fica só com o texto.

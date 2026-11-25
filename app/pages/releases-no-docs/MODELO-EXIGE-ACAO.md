# Modelo: mudança que exige ação

Rodada 7 (2026-11-24). O padrão da doc do Nuxt, em 2 lugares:

| Onde | O que leva | Precisa de código novo? |
|---|---|---|
| Release (aba Releases) | A seção "Exige ação", sempre aberta, com os passos no texto | Sim, 1 vez: o rótulo e a seção saem do frontmatter |
| Guia de migração (Docs ou Dev) | O que muda, por quê, quem, prazo, passos e o que acontece depois | Não: só componentes que o `en-docs` já renderiza |

Depois que o dev fizer a parte da release, uma mudança nova pede só preencher os 2 modelos abaixo.

## 1. Na release: o bloco `actionRequired` do frontmatter

Proposta para o dev. Cada mudança é 1 item da lista. O rótulo da versão usa a data `phases.required`
mais próxima; a seção "Exige ação" mostra os itens nesta ordem: título, `why`, `who`, prazo e fases,
`after`, `steps` (até 3) e o link do `guide`.

```yaml
actionRequired:
  - id: assinatura-dos-webhooks          # âncora do item e nome do guia
    title: "Integrações: webhooks com nova assinatura de segurança"
    why: "A assinatura nova protege o seu servidor de envios falsos."
    who: "Workspaces com webhooks de saída ativos"
    phases:
      optIn: 2026-12-08                  # Opcional: quem quiser liga antes
      optOut: 2027-01-12                 # Ligada para todos: quem não terminou desliga
      required: 2027-02-09               # Obrigatória: é o "Agir até"
    # previousRequired: 2027-01-26       # só quando o prazo mudou: vira o ::note do guia
    after: "Depois do prazo, o ENSPACE envia só a assinatura nova, e o servidor que confere a antiga recusa os envios."
    steps:
      - "No seu servidor, confira o cabeçalho X-Enspace-Signature-256 em cada envio."
      - "Em Configurações > Integrações > Webhooks, ligue Usar nova assinatura."
      - "Clique em Testar e confira a entrega."
    guide: /pt/developer/guias-de-migracao/assinatura-dos-webhooks
```

Regras do texto:
- `title` é o título do item no changelog; `why` tem 1 frase e não repete o título.
- `after` diz o que quebra para quem não agiu, em 1 frase.
- `steps` tem até 3 passos, cada um com o caminho da tela ou o nome técnico exato. Mais que isso vai só para o guia.
- O link sai como "Guia de migração: <title do guia>", nunca "Saiba mais".

## 2. O guia de migração: markdown do `en-docs`, sem código novo

Arquivo em `content/<idioma>/1.docs/.../guias-de-migracao/<id>.md` (Docs) ou na seção Dev, para API e
webhook. As seções seguem o guia de atualização da doc do Nuxt: "What Changed", "Reasons for Change",
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

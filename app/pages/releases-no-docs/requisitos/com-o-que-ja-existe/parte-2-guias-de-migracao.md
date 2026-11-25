# 2. Guias de migração na Referência

**Objetivo:** cada mudança que exige ação do cliente tem uma página de guia na doc, com o que muda, o prazo e os
passos, escrita em markdown e sem código novo.

**Onde vale:** a aba Docs, em Referência > Guias de migração (`/<idioma>/docs/reference/migration-guides/<id>`), ao
lado de "Limitações Conhecidas".

**Protótipo:** https://pernalombr4.github.io/prototipos/releases-no-docs/#guia-assinatura-dos-webhooks. O markdown
completo de um guia está no `MODELO-EXIGE-ACAO.md` da pasta do protótipo.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Cada guia de migração mora na Referência da aba Docs, inclusive o guia de mudança na API ou no webhook. A aba Dev é a referência da API e não recebe guia. | O guia da assinatura dos webhooks fica em Docs > Referência > Guias de migração. | Obrigatório |
| RN102 | Cada guia tem as seções nesta ordem: o aviso do prazo, O que muda, Por que muda, Quem é afetado, Prazo e fases, Passos da migração, Depois do prazo e a dica de ajuda. | O guia da paginação por cursor segue a ordem, e "Passos da migração" vem antes de "Depois do prazo". | Obrigatório |
| RN103 | O prazo de um guia ("Agir até") é a data de início da fase Obrigatória. | Fase Obrigatória em 09/02/2027: o aviso diz "Agir até 9 de fevereiro de 2027". | Obrigatório |
| RN104 | Um guia cujo prazo mudou leva, logo abaixo da tabela de fases, a nota "O prazo mudou. A data anterior era <data>." | O guia da paginação por cursor diz "A data anterior era 08/06/2027". | Desejável |

## Pasta e navegação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | A Referência da aba Docs deve ter a pasta "Guias de migração", com o título "Migration guides" em inglês e "Guías de migración" em espanhol. | O menu lateral da Referência mostra "Guias de migração" em português. | Essencial | Obrigatório |
| RF102 | O menu lateral da página de um guia deve listar cada guia da pasta, com o guia aberto aceso. | Na página do guia dos webhooks, o menu mostra os 4 guias e acende o dos webhooks. | Importante | Obrigatório |
| RF103 | A trilha da página do guia deve mostrar "Docs › Referência › Guias de migração". | A trilha do guia dos webhooks tem os 3 níveis, nessa ordem. | Importante | Obrigatório |
| RF104 | O topo da doc deve acender "Docs" quando um guia está aberto. | Na página de um guia, "Docs" fica aceso, e "Dev" não. | Importante | Obrigatório |

## Corpo do guia (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF105 | O aviso do prazo deve abrir o corpo do guia, no componente `::warning`, com "Agir até <data>." em negrito e o que acontece depois do prazo. | O guia dos webhooks abre com o aviso amarelo "Agir até 9 de fevereiro de 2027." | Essencial | Obrigatório |
| RF106 | "O que muda" deve terminar com "Anunciada no changelog:", o link para o item na aba Releases e o número da versão. | O link do guia dos webhooks leva ao item na 3.4.0 e mostra `3.4.0`. | Importante | Obrigatório |
| RF107 | "Prazo e fases" deve ser uma tabela com as colunas Fase, A partir de e O que acontece, e 1 linha por fase: "Opcional", "Ligada para todos" e "Obrigatória". | A tabela do guia dos webhooks tem 3 linhas, com 08/12/2026, 12/01/2027 e 09/02/2027. | Essencial | Obrigatório |
| RF108 | "Passos da migração" deve usar o componente `::steps`, com 1 título de nível 3 por passo, numerado pelo componente. | O guia dos webhooks mostra 3 passos numerados de 1 a 3. | Essencial | Obrigatório |
| RF109 | O passo que muda código deve trazer o bloco de código em diff, com o nome do arquivo ou da rota no topo do bloco. | O passo 1 do guia dos webhooks mostra `webhook.js`, com as linhas que saem e as que entram. | Importante | Desejável |
| RF110 | A dica de ajuda deve fechar o corpo do guia, no componente `::tip`. | O guia termina com "Dúvidas sobre a migração? Abra um chamado no suporte com o nome do workspace." | Desejável | Desejável |
| RF111 | A coluna "Nesta página" deve listar as seções do guia e, dentro de "Passos da migração", cada passo. | No guia dos webhooks, "Nesta página" mostra os 3 passos abaixo de "Passos da migração". | Importante | Obrigatório |

## Restrições (RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS101 | O guia deve usar só componentes de markdown que o `en-docs` já mostra: `::warning`, `::note`, `::steps`, `::tip`, tabela e bloco de código. Imposta por: produtos, épico pelo esforço. | Escrever um guia novo não muda nenhum arquivo fora de `content/`. | Essencial | Obrigatório |
| RS102 | Cada guia deve existir em `content/<idioma>/1.docs/8.Reference/<n>.Migration Guides/<id>.md` nos 3 idiomas. Imposta por: estrutura de pastas do `en-docs`. | O guia dos webhooks tem 1 arquivo em `pt`, `en` e `es`. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | Qual número de ordem a pasta "Guias de migração" recebe na Referência, antes ou depois de "Limitações Conhecidas"? | produtos | O `<n>` do nome da pasta |

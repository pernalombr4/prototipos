# 3. Mudança que exige ação

**Objetivo:** quem administra um workspace vê, sem abrir a versão, que uma mudança pede ação e até quando, e escolhe se
lê o item ou abre o guia de migração.

**Depende de:** 1. Texto da versão na trilha.

**Onde vale:** a aba Releases (`/<idioma>/releases/docs`), no topo e no texto de cada versão que tem mudança que
exige ação.

**Protótipo:** https://pernalombr4.github.io/prototipos/releases-no-docs/ (a 3.4.0 e a 3.5.0 têm mudança que exige
ação).

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | O rótulo da versão usa o prazo mais próximo entre as mudanças que exigem ação dela. | Com prazos em 09/02/2027 e 13/07/2027, o rótulo diz "Agir até 9 de fevereiro". | Obrigatório |

## Rótulo no topo da versão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | Cada versão com mudança que exige ação deve mostrar, depois do rótulo do tamanho, o rótulo "Exige ação · Agir até <dia e mês>", conforme RN201, com a seta de abrir. | A 3.4.0 mostra "Exige ação · Agir até 9 de fevereiro". | Essencial | Obrigatório |
| RF202 | Quando a pessoa clica ou toca no rótulo, o sistema deve abrir um resumo sobre a versão, sem sair da página e sem rolar. | Clique no rótulo da 3.4.0 abre o resumo; a posição da página fica igual. | Essencial | Obrigatório |
| RF203 | O resumo deve mostrar, para cada mudança que exige ação da versão: o título da mudança; "Agir até <data>." em negrito, conforme RN902, seguido do porquê; e os links "Ver na versão" e "Abrir o guia de migração". | Exemplo: "A nova assinatura dos webhooks passa a ser obrigatória", "Agir até 9 de fevereiro de 2027. A assinatura nova protege o seu servidor de envios falsos." | Essencial | Obrigatório |
| RF204 | Com 2 ou mais mudanças na versão, o resumo deve listar uma abaixo da outra, separadas por uma linha. | Versão com 2 mudanças mostra 2 blocos no resumo. | Importante | Obrigatório |
| RF205 | "Ver na versão" deve fechar o resumo, abrir o texto da versão, rolar até o item da mudança e acender o fundo dele por 2,6 s. | Na 3.5.0, o clique abre o texto e leva ao item da paginação por cursor, em Melhorias. | Importante | Obrigatório |
| RF206 | "Abrir o guia de migração" deve fechar o resumo e abrir a página do guia da mudança, na Referência da aba Docs. | Na 3.4.0, o clique abre o guia "A nova assinatura dos webhooks passa a ser obrigatória". | Essencial | Obrigatório |

## Item no texto da versão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF207 | A mudança que exige ação deve ficar na seção do tipo dela (Novidades, Melhorias, Correções), como os outros itens. A versão não tem seção "Exige ação". | A paginação por cursor da 3.5.0 aparece em Melhorias, depois de Novidades. | Essencial | Obrigatório |
| RF208 | O item que exige ação deve mostrar, depois do título em negrito, o rótulo "Exige ação" e o porquê. | "API: paginação por cursor na listagem de itens. [Exige ação] A paginação por número de página repete ou pula itens quando a lista muda durante a leitura." | Essencial | Obrigatório |
| RF209 | Abaixo do porquê, o item deve mostrar "Quem é afetado: <quem>." e "Agir até <data>." em negrito, na mesma linha. | "Quem é afetado: Integrações que leem a listagem de itens pela API. Agir até 13 de julho de 2027." | Essencial | Obrigatório |
| RF210 | Abaixo do prazo, o item deve mostrar o link "Guia de migração: <título do guia>", que abre o guia, conforme RN903. | "Guia de migração: A listagem de itens da API passa a paginar por cursor" abre o guia. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI201 | Bloco `actionRequired` do conteúdo da release | Deve aceitar, por mudança, 6 campos: `id` (o item marcado), `title`, `why`, `who`, `required` (data) e `guide` (endereço do guia). O molde está no `MODELO-EXIGE-ACAO.md` do protótipo. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | O rótulo some da versão depois que o prazo passa, ou fica como histórico? | produtos | RF201 ganha a condição "enquanto o prazo não passou" |

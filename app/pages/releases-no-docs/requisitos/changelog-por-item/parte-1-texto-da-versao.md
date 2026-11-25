# 1. Texto da versão na trilha

**Objetivo:** quem lê a aba Releases lê o que mudou em cada versão ali mesmo, sem abrir um post, e copia o link de um
item para mandar a outra pessoa.

**Onde vale:** a aba Releases (`/<idioma>/releases/docs`), no corpo de cada versão da linha do tempo.

**Protótipo:** https://pernalombr4.github.io/prototipos/releases-no-docs/.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Cada item tem 1 tipo só: novidade, melhoria ou correção. | O nó de espera por data do Spaceflow é novidade. | Obrigatório |
| RN002 | Cada versão mostra no máximo 2 rótulos: o tamanho (minor, patch) e "Exige ação". Beta, acesso antecipado, o estado "liberando" e o público parcial vão no título do item. | "Spaceflow: nó de espera por data (beta)." | Obrigatório |

## Texto recolhido (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O texto de cada versão deve vir recolhido quando a página abre. | Abrir a aba mostra cada versão só com a data, os rótulos, o título e o resumo. | Essencial | Obrigatório |
| RF002 | O resumo da versão deve contar os itens por tipo, a partir dos itens da versão. | A 3.4.0 com 2 novidades e 2 melhorias mostra "Esta release apresenta 4 itens: 2 novidades e 2 melhorias." | Importante | Obrigatório |
| RF003 | O botão "Mostrar mais", logo abaixo do texto e acima da linha do rodapé, deve abrir o texto da versão e virar "Mostrar menos". | Clique em "Mostrar mais" na 3.4.0 abre Novidades e Melhorias, e o botão vira "Mostrar menos". | Essencial | Obrigatório |
| RF012 | O botão "Mostrar menos" deve recolher o texto da versão e voltar a "Mostrar mais". | Clique em "Mostrar menos" na 3.4.0 deixa só o título e o resumo. | Essencial | Obrigatório |
| RF004 | Só o botão "Mostrar mais" ou "Mostrar menos" deve abrir e recolher o texto. | Clique no título ou no resumo não abre o texto. | Importante | Obrigatório |

## Seções e itens (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF005 | O texto da versão deve ter as seções Novidades, Melhorias e Correções, nessa ordem, com título de nível 3. A seção sem item não aparece. | A 3.3.7, só com correção, mostra só "Correções". | Essencial | Obrigatório |
| RF006 | Cada novidade e cada melhoria deve ser 1 parágrafo: o título em negrito, terminado em ponto, o resumo e o link "Saiba mais" para a documentação do item. | "Spaceflow: nó de espera por data. O fluxo pausa até a data de um campo. Saiba mais" | Essencial | Obrigatório |
| RF007 | Cada correção deve ser 1 linha de uma lista, sem resumo nem link. | Em Correções da 3.3.7, cada correção é 1 linha. | Importante | Obrigatório |
| RF008 | O título do item deve trazer entre parênteses, conforme RN002, o acesso (beta, acesso antecipado), "liberando, para todos até <data>" e "liberado para alguns workspaces", quando o item tem. | "Tarefas: quadro com raias (acesso antecipado, liberado para alguns workspaces)." | Importante | Obrigatório |

## Links (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF009 | O título de cada seção deve ter a âncora `<âncora da versão>-<seção>` e copiar o link como o título da versão faz. | Clique em "Novidades" da 3.4.0 copia `.../releases/docs#v3-4-0-novidades` e mostra "Link copiado". | Importante | Obrigatório |
| RF010 | O título em negrito de cada novidade e melhoria deve ter a âncora do item, conforme RN901, e copiar o link como o título da versão faz. | Clique em "Integrações: webhooks com nova assinatura de segurança." copia o endereço com a âncora do item. | Importante | Obrigatório |
| RF011 | Quando a página abre com a âncora de uma seção ou de um item, o sistema deve abrir o texto da versão, rolar até o ponto e acender o fundo do item por 2,6 s. | Abrir o endereço com a âncora do item dos webhooks mostra a 3.4.0 aberta, com o item aceso no meio da tela. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Schema do conteúdo da release (`content.config.ts`) | Deve aceitar, por versão, a lista de itens com: âncora, tipo, título, resumo, link da documentação, acesso (beta, acesso antecipado), o estado "liberando" com a data em que chega a cada workspace e o público parcial. Nome dos campos: <a definir>; o `mocks.ts` do protótipo traz um exemplo. | Obrigatório |

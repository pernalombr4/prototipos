# 1. Data e link da versão

**Objetivo:** quem lê a aba Releases vê a data certa de cada versão e copia o link de uma versão para mandar a outra
pessoa.

**Onde vale:** a aba Releases (`/<idioma>/releases/docs`), em cada versão da linha do tempo.

**Protótipo:** https://pernalombr4.github.io/prototipos/releases-no-docs/.

## Data e rótulo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | A data de cada versão deve ser o dia do `release.deployDate`, sem voltar 1 dia pelo fuso de quem lê. | Exemplo: `deployDate: 2026-12-08`, lido em São Paulo, mostra 8 de dezembro, e não 7. | Essencial | Obrigatório |
| RF002 | A data de cada versão deve sair em números, no formato do idioma da página. | Exemplo: em português "08/12/2026"; em inglês "12/08/2026"; em espanhol "08/12/2026". | Importante | Obrigatório |
| RF003 | Cada versão deve mostrar o rótulo do `badge.label` dela ("minor", "patch") ao lado do título. | A versão 3.4.0, com `badge.label: minor`, mostra o rótulo "minor". | Desejável | Desejável |

## Link da versão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF004 | O título de cada versão deve ser um link para a âncora da versão, conforme RN001. | O título "3.4.0 está no ar" aponta para `#v3-4-0`. | Importante | Obrigatório |
| RF005 | Quando a pessoa clica no título da versão, o sistema deve copiar o endereço completo da aba Releases com a âncora, pôr a âncora na barra do navegador e mostrar o toast "Link copiado" com o endereço. | Exemplo: clique em "3.4.0 está no ar" copia `https://docs.enspace.io/pt/releases/docs#v3-4-0`, e a página não rola. | Importante | Obrigatório |
| RF006 | Se o navegador não dá permissão para copiar, o toast deve mostrar o endereço, para a pessoa copiar à mão. | Com a área de transferência bloqueada, o toast mostra `https://docs.enspace.io/pt/releases/docs#v3-4-0`. | Desejável | Desejável |
| RF007 | Enquanto o mouse está sobre o título da versão, o sistema deve mostrar à esquerda dele o ícone `#` dos títulos de markdown da doc. | Em tela larga, passar o mouse em "3.4.0 está no ar" mostra o `#`; no celular, não aparece. | Desejável | Opcional |
| RF008 | Quando a página abre com a âncora de uma versão no endereço, o sistema deve rolar até a versão e contornar a versão por 2,6 s. | Abrir `.../releases/docs#v3-4-0` mostra a 3.4.0 no topo, com o contorno, que some sozinho. | Importante | Obrigatório |

## Post da versão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF009 | Cada versão que tem post no Blog deve mostrar no rodapé o link "Ler o post de lançamento", que abre o post. | A 3.4.0 mostra o link no rodapé, e o clique abre `.../blog/docs/release-3-4-0`. | Essencial | Obrigatório |
| RF010 | O clique no título da versão deve copiar o link conforme RF005, e não abrir o post. | Clique em "3.4.0 está no ar" fica na aba Releases. | Essencial | Obrigatório |

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | A âncora de cada versão é "v" seguido do número da versão, com os pontos trocados por hífen. A âncora não muda depois de publicada. | 3.4.0 tem a âncora `v3-4-0`; 3.4.10 tem `v3-4-10`. | Obrigatório |

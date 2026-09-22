# Decisões — Padrão dos campos

## A fronteira, em uma linha

**Muda:** o conteúdo de cada célula da tabela, o miolo do modal de criação, e a coluna 1 da
sidebar passar a carregar os campos da categoria em leitura.
**Não muda:** menu lateral, barra do topo, trilha, abas, barra de ferramentas, rodapé de
paginação, a divisão em duas colunas da sidebar e as três abas dela.

---

## Rodada 1 — 22/09/2026

### O que ela pediu

Está no `BRIEFING.md`, literal. Em resumo: padronizar os três formatos (cell, form, naked) de
todos os tipos de campo, na tela nova de itens, com o contrato de back-end visível ao
interagir, mais um relatório .xlsx de saída.

### A decisão de fundo: um desenho por tipo, dois invólucros

O ENSPACE hoje tem, na prática, um desenho de campo por tela. A proposta é a do Twenty CRM:

- **`_ValorDoCampo.vue`** é o único componente que LÊ um valor. Ele recebe
  `formato="celula"` ou `formato="cru"`. A regra do tipo é a mesma nos dois; o que muda é a
  densidade (uma linha e corte, ou várias linhas e ações de apoio);
- **`_EntradaDoCampo.vue`** é o único componente que ESCREVE um valor. Serve o modal de
  criação e a coluna 2 da sidebar;
- **`formatacao.ts`** é a única função que transforma valor em texto. A tabela, o resumo, o
  tooltip e o .xlsx chamam a mesma função. Se o número tem duas casas na tabela, tem duas
  casas no relatório, porque é o mesmo cálculo.

É isso que faz "padronizar" ser verificável em vez de ser combinado.

### A família, e não o tipo, é que decide o desenho

O catálogo (`campos.ts`) dá a cada tipo uma **família**: texto, número, escolha, booleano,
data e hora, relação, pessoa, arquivo, composto. O alinhamento, o transbordo e a forma da
célula são da família. **Tipo novo que nasça numa família existente já nasce padronizado**, e
essa é a única maneira de o padrão sobreviver ao próximo campo que o produto criar.

### O que é proposta, item por item

| Onde | O que muda | Por quê |
|---|---|---|
| Tabela | Uma coluna por tipo, largura mínima vinda do catálogo | A largura é decisão do tipo, não do olho do dev. Está escrita e sai no relatório |
| Tabela | Lista longa vira "os primeiros + contador", com a lista inteira no tooltip do contador | Padrão dos oito referenciais. Limite por tipo, em `maximoNaCelula` |
| Tabela | Número e moeda à direita, em `tabular-nums` | Dígito alinhado entre linhas é o que faz coluna de número ser legível |
| Tabela | `inputSwitch` mostra "Sim/Não" com ponto de cor, **não** uma chave | Chave na célula promete edição que a célula não faz (regra 24: hover que promete clique tem que entregar clique) |
| Tabela | Relação com `display` vazio cai para a `reference`, em fonte mono | Hoje a célula fica em branco e a relação fica invisível. Achado 5.5 do briefing |
| Tabela | Célula vazia é um traço baixo cinza, e não espaço em branco | Distingue "vazio" de "não carregou" |
| Formulário | Grade de duas colunas; o tipo que precisa de linha inteira toma as duas | Hoje é uma coluna só. Com 31 campos vira rolagem de três telas |
| Formulário | Rótulo com ícone do tipo, clicável, e ajuda embaixo | É o padrão que o produto já tem no formulário de Campo (fricção N8 do `enspace-ux-research`) |
| Formulário | `radioButton` vira lista suspensa acima de cinco opções; lista ganha busca a partir de dez | Regra do Pipefy, escrita no catálogo em vez de combinada |
| Formulário | `EnCustomCode`, `EnChats` e `EnOnlyoffice` aparecem desabilitados, com a explicação de que o valor nasce depois de salvar | Classificação do Monday (gravável, só leitura, render-time). Controle vazio que não aceita nada engana |
| Formulário | Esc fecha o modal | Hoje não fecha. Achado 5.2 do briefing |
| Sidebar col. 1 | Passa a carregar os campos da categoria em leitura, no mesmo desenho das linhas de metadado que ela já tem | É o formato "naked" da demanda. A coluna já existe com o desenho certo e só carrega metadado de sistema |
| Sidebar col. 1 | Repetidor, chat, editor de documentos e anotações **não entram** no resumo | Não cabem em 270 px. Estão em `foraDaColunaDeResumo` no catálogo |
| Ficha | Clicar em qualquer campo, em qualquer formato, abre as três regras e o contrato de back-end, sobre o valor do item aberto | É o pedido "dar informações ao interagir sobre o back-end". Nenhum dos oito referenciais faz isso |
| Andaime | Relatório .xlsx com duas abas | Pedido dela, na mesma rodada |

### O relatório .xlsx

Duas abas, geradas no navegador:

1. **Padrão dos campos** — uma linha por tipo, 15 colunas: tipo, rótulo, família,
   disponibilidade, as três regras, os três formatos de back-end, as chaves de `cFormat` e de
   `config`, alinhamento, largura mínima e um valor de exemplo já formatado.
2. **Saída dos itens** — uma linha por item, uma coluna por tipo, com a **saída formatada** de
   cada valor. É a prova de que a regra da aba 1 produz o que está escrito.

**Escrito à mão, sem biblioteca.** A regra 3 do agente proíbe outra biblioteca no protótipo, e
um `.xlsx` é um ZIP com cinco XML dentro. O `relatorio.ts` monta o ZIP no método "stored"
(sem compressão) com CRC32 próprio, em ~100 linhas. O arquivo abre no Excel, no LibreOffice e
no Sheets. Nada sai do navegador.

O relatório troca de idioma junto com a tela: gerar em espanhol produz as regras em espanhol.

### O que é MAQUETE (não funciona, e está na tela)

| O que | O que faz de verdade |
|---|---|
| Seletor de arquivo, imagem e PDF | O botão injeta um anexo fictício no estado. Nenhum arquivo é lido ou enviado |
| Miniatura de imagem | Um bloco de cor com a extensão. O protótipo não carrega imagem de fora (regra 4) |
| Editor de texto rico (`EnHtml`) | Barra de formatação decorativa sobre um `UTextarea`. O `UEditor` do Nuxt UI existe, mas o que está em discussão é a moldura do campo, não o editor |
| `EnESign`, `EnChats`, `EnOnlyoffice` no formulário | Moldura com a regra escrita. Assinar, conversar e editar documento não acontecem |
| Busca, "Criado em" e "Todo o período" na barra | Não filtram. São casca do develop |
| Os quatro ícones da barra (Exportar, Colunas, Densidade, Mais opções) | Só o tooltip. O relatório de verdade está no andaime, de propósito, para não se confundir com o Exportar que o produto já tem |
| Abas Comentários e Logs de Auditoria | Estado vazio |
| Paginação | Mostra 248 itens no rodapé e renderiza os 6 do mock. O número existe para o rodapé ser realista |
| "1/3" da sidebar | Navega de verdade entre os itens do mock |

### O que FUNCIONA de verdade

Digitar, escolher, marcar, somar, limpar, acrescentar e remover linha do repetidor mexem no
objeto em memória. Criar acrescenta o item na tabela. Salvar na sidebar atualiza a linha e o
`Atualizado em`. Trocar de idioma reformata datas, números e moedas na hora, nos três formatos
e no relatório. Trocar de tema troca os dois. Recarregar a página zera tudo.

### O que ficou de fora, de propósito

- **Filtrar e ordenar por tipo.** O Attio documenta quatro verbos (criar, ver, filtrar,
  ordenar) e este protótipo cobre três. Filtro por tipo de campo é demanda própria: cada
  família precisa de operadores diferentes, e enfiar isso aqui deixaria as duas piores
  (regra 19).
- **Edição na célula.** O ENSPACE não edita na célula hoje. Mudar isso é decisão de produto,
  não de padronização de renderização.
- **A tela antiga.** Não foi tocada, como ela pediu.
- **A configuração do campo** (`Estrutura › Categorias › Campos`). É onde o `cFormat` se
  escolhe, e o painel dele tem um defeito grave de renderização (achado 5.6 do briefing), mas
  é outra tela.

---

## Divergências que precisam de conversa

### 1. O doc do time de produtos não foi lido

O `Melhoria dos campos.docx` no SharePoint exige login da Microsoft, e o agente não digita
senha nem faz login. **Então não há comparação com os ensaios do time.** O que está aqui saiu
do schema do SDK, da API de develop e do dicionário de i18n do produto. A comparação com o doc
tem que ser feita a olho, com este arquivo ao lado.

### 2. Recomendação: a API devolver o valor formatado junto com o cru

Hoje o ENSPACE devolve `data[refId]` cru e o `cFormat` fica no `Field`, para o cliente aplicar.
Isso significa que **cada consumidor formata de um jeito**: a tela, a exportação, o e-mail de
notificação, o relatório, a integração. Já dá divergência hoje (o mesmo número com casas
diferentes em telas diferentes).

O Monday resolve com `value` (cru) e `text` (formatado) na mesma resposta. A recomendação é a
mesma: **`data` continua como está e nasce um `display` irmão**, calculado no servidor com o
`cFormat` do campo. Quem quiser o cru usa `data`; quem quiser mostrar usa `display`. É
retrocompatível e mata a divergência na origem.

Não está prototipado porque o protótipo é 100% front-end (regra 4). Está aqui como
recomendação de back-end.

### 3. O enum de tipos do SDK está desatualizado

O `Field.type` do `@be-enlighten/enspace-sdk-schemas` tem 24 tipos. A API de develop devolve
sete que **não estão no enum**: `group`, `checkbox`, `EnESign`, `EnNotes`, `EnCustomCode`,
`EnChats`, `EnCurrency`. Isso quer dizer que **validar uma resposta da API com o schema
publicado falha** em categorias que usam esses tipos.

E há a duplicidade `checkbox` (API e i18n) contra `EnlCheckbox` (schema), que parecem ser o
mesmo campo com duas chaves.

Isso é conserto no `enspace-sdk-schemas`, que **não é este repositório**. Fica registrado
aqui; a decisão é dela.

### 4. Sete tipos não têm rótulo em português

`EnlMask`, `EnlCheckbox`, `EnTreeSelect`, `EnlTimeRange`, `EnESign`, `EnCustomCode` e
`EnCurrency` existem em dado gravado mas não têm entrada no dicionário de i18n do produto,
porque saíram do seletor de tipo. **O protótipo propõe rótulo para os sete** (regra 29: o
protótipo propõe o nome certo e registra a divergência):

| Tipo | Rótulo proposto |
|---|---|
| `EnlMask` | Texto com máscara |
| `EnlCheckbox` | Caixas de Seleção (antigo) |
| `EnTreeSelect` | Seleção em árvore |
| `EnlTimeRange` | Intervalo de horas |
| `EnESign` | Assinatura eletrônica |
| `EnCustomCode` | Código gerado |
| `EnCurrency` | Moeda |

Sem rótulo, a tela mostra a chave técnica para quem usa, que é a fricção N7 do
`enspace-ux-research` acontecendo de novo.

### 5. `EnCurrency` ou `EnlNumber` com `cFormat.n_style: "currency"`?

Existem os dois caminhos no produto: um tipo próprio de moeda (`EnCurrency`, que a API
devolve) e o número com `n_style: "currency"`. São dois jeitos de fazer a mesma coisa, e a
renderização tem que ser idêntica nos dois. O protótipo trata os dois na mesma família e com o
mesmo desenho, mas **a duplicidade em si é decisão de modelo** e vale escolher um.

---

## Autocrítica

Rodei `design:design-critique` e `design:accessibility-review` sobre o próprio trabalho.

**Corrigido:**

- o valor na célula e no resumo é um `<button>` de verdade, com `aria-label` e foco visível,
  porque ele abre a ficha. Div clicável não recebe foco por teclado;
- o contador `+N` tem tooltip com a lista inteira, senão a informação escondida fica
  inalcançável;
- o rótulo do campo no formulário é botão separado do controle, para o clique na ficha não
  roubar o clique do controle;
- data vencida usa cor **e** não depende só dela: o valor continua legível e o relativo
  aparece no formato cru;
- o rótulo em caixa alta miúda do formato cru é o desenho do develop, mas com 10 px e
  `tracking-wide` ele fica no limite. Mantido por fidelidade à casca, e marcado aqui.

**Não corrigido, e por quê:**

- **31 colunas exigem rolagem horizontal longa.** É o preço da vitrine: a demanda pediu uma
  categoria com todos os tipos. Numa categoria real são 8 ou 12 campos. Não achatei a tabela
  para caber, porque isso esconderia justamente o problema de transbordo que o padrão resolve;
- **a coluna de referência não fica fixa na rolagem.** O `EnTable` não expõe coluna fixa hoje,
  e implementar por fora seria redesenhar a tabela do produto (regra 21). É achado para o
  `EnTable`, não conserto daqui;
- **o resumo da coluna 1 fica longo** com 27 campos. Numa categoria real não fica. Se ficar, a
  saída é a visibilidade por visão que o Notion tem, e isso é outra demanda.

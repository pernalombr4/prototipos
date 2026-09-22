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

### 1. O que eu propus diferente do `Melhoria dos campos.docx`

O documento foi lido em 22/09/2026 (ver `BRIEFING.md`, 5.7). Ele especifica 13 campos com a
mesma estrutura desta demanda, e em **oito pontos** o protótipo está diferente. Ela pediu para
reportar cada um.

#### 1.1 Duração: a saída formatada está errada no doc

O doc diz, no campo Duração:

> Saída Formatada · Visualização: Exibição no formato resumido e padronizado HH/MM/SS.

Isso contradiz o próprio campo três linhas acima, que define a Entrada como **duas datas**
(inicial e final) e o Cell como `dd/mm/aa - dd/mm/aa`. `HH/MM/SS` é duração de tempo, não
intervalo de datas. E `HH/MM/SS` com barra não é formato de hora em nenhuma localidade: o
separador de hora é dois-pontos.

**O protótipo faz:** as duas datas na localidade, unidas por "a" no cru e por seta na célula,
com a contagem de dias ao lado no cru.

#### 1.2 Lista longa: reticências não dizem quantos faltam

O doc, em Seleção Múltipla:

> Caso a quantidade de tags ultrapasse o espaço útil disponível na tela, o sistema insere
> reticências (...) no final para indicar que existem mais itens.

Reticências dizem "tem mais", não dizem **quantos**. "Elétrica, Civil..." não distingue 1 item
escondido de 12. Os cinco referenciais usam contador: o Twenty tem `ExpandableList` com
`MAX_RELATION_CHIPS_DISPLAYED_INLINE = 10` e chip de contagem, e Notion, Monday e Airtable
fazem igual.

**O protótipo faz:** os primeiros N selos e um `+N` com a lista inteira no tooltip. O N é por
tipo, em `maximoNaCelula`.

#### 1.3 Número e moeda: truncar dígito é perigoso

O doc, em Número e repetido em Valor Monetário:

> Caso o número seja muito extenso e ultrapasse o tamanho da coluna, o sistema aplica três
> pontos (...) no final para indicar que o valor continua.

Cortar dígito muda a ordem de magnitude do que a pessoa lê: `128.940,75` virando `128.94...`
pode ser lido como cento e vinte e oito. Em coluna de dinheiro isso é erro de decisão, não de
estética.

**O protótipo faz:** a coluna nasce com largura mínima suficiente para o valor típico do tipo
(no catálogo), alinhada à direita e em `tabular-nums`. Se um dia precisar encurtar, o certo é
notação abreviada explícita ("128,9 mil"), nunca corte de dígito.

#### 1.4 ID Personalizado: clique que copia sem avisar

O doc, no Cell do ID:

> Ao clicar na célula, o sistema copia automaticamente o ID completo para facilitar buscas
> futuras na plataforma.

Clicar numa célula é gesto de selecionar linha. Sobrescrever a área de transferência da pessoa
nesse gesto é efeito colateral invisível: ela perde o que tinha copiado e não sabe por quê.

**O protótipo faz:** botão de copiar ao lado do selo, que aparece no hover, com troca de ícone
para confirmar. É o que o develop já faz hoje na coluna Referência.

#### 1.5 Alternativa Binária: o terceiro estado existe

O doc:

> Como existe uma regra de valor padrão obrigatória na configuração do campo, ele nunca fica
> sem informação.

No dado gravado em develop existe item cujo `data` **não tem a chave** do campo booleano. Não
é `false`: é ausente. Ou seja, o estado "nunca preenchido" existe e a tela precisa distinguir
dele o "preenchido como falso", pelo menos enquanto houver dado antigo.

E, no mesmo campo, o doc propõe:

> Edição Inline: Ação de um único clique. Ao clicar em qualquer ponto da célula, o sistema
> altera o valor diretamente.

Um clique em qualquer ponto da célula que grava é edição destrutiva por clique acidental, numa
tabela onde clicar é como se navega.

**O protótipo faz:** texto ("Sim" / "Não") com ponto de cor, sem controle acionável na célula.
A chave fica no formulário, que é onde se edita.

#### 1.6 Limites fixos de caractere tiram a configuração que já existe

O doc fixa **100 caracteres** no Texto Curto e **1.500** no Texto Longo, com contador.

O produto não tem esses números: o que ele tem é `cFormat.t_length`, `cFormat.t_suffix` e
`preserve_max_length`, **por campo**. Fixar o limite no tipo apaga uma configuração que já
está publicada no schema e que o cliente já pode ter usado.

**O protótipo faz:** o corte sai do `cFormat` do campo, e a ficha mostra quais chaves valem
para o tipo. O contador no formulário aparece quando existe limite configurado, não sempre.

#### 1.7 Endereço: texto livre quebraria o dado que existe

O doc:

> Trata-se de um campo único que aceita preenchimento de duas formas … Se o usuário optar por
> digitar o endereço manualmente, o sistema grava o texto exatamente como foi escrito.

O dado real em develop é **objeto estruturado** com oito chaves (`street`, `number`,
`complement`, `neighborhood`, `city`, `state`, `zip`, `country`), e o
`nestedConfig.displayString` é que monta a linha que a pessoa lê. Gravar texto livre:

- quebra filtro e ordenação por cidade, estado e CEP;
- quebra o `displayString` que os campos existentes já têm configurado;
- e o próprio doc pede, na Saída Formatada, "exibe o nome da rua e as informações do endereço"
  mais o CEP separado, que só dá para fazer com o dado separado.

**O protótipo faz:** mantém o objeto, com a grade de subcampos no formulário e o
`displayString` montando a linha única na célula. **Esta é a divergência mais séria das oito,
porque é de modelo de dados, não de tela.**

#### 1.8 Anotações e Comentários são dois campos, não um

O doc trata "Anotações e Comentários" como um campo com histórico, autor e data, e a última
mensagem aparecendo na célula.

No produto são dois tipos distintos: `EnNotes` (anotação, uma string simples no `data`) e
`EnChats` (conversa, um array de mensagens com autor e data). A regra do doc descreve o
`EnChats`; o `EnNotes` não tem autor nem histórico.

**O protótipo faz:** separa os dois. `EnNotes` é texto; `EnChats` é conversa, com a última
mensagem e o contador na célula. Nos dois, o formulário de criação não exibe o campo, que é o
que o doc diz e está certo.

### 1.9 Onde o doc está certo e eu estava errado: a exportação .xlsx

A seção "Padronização de Formatos de Exportação em Excel" do doc está **correta e eu não havia
seguido**. A primeira versão do relatório escrevia tudo como texto, que é exatamente o erro
que o doc previne:

> Nunca concatenar o símbolo da moeda como texto dentro do valor da célula, pois isso
> transforma o dado em String e impede a realização de cálculos nativos no Excel.

Corrigido nesta mesma rodada, célula por tipo:

| Tipo | Como sai agora | Por quê |
|---|---|---|
| Número | célula numérica com máscara `#,##0.00` | soma, média e filtro numérico funcionam |
| Valor monetário | célula numérica com `numFmt` de moeda por localidade | o símbolo é formatação, não dado |
| Data | serial de data do Excel com máscara da localidade | ordena cronologicamente e filtra por mês e ano |
| Seleção múltipla e listas | texto separado por vírgula e espaço | regra do doc (a tela usa barra no tooltip, o arquivo usa vírgula) |
| Arquivo, imagem, PDF, documento | hyperlink clicável com o nome do arquivo | planilha não incorpora arquivo |
| Duração | texto | o Excel amarra hora a uma data base de 1900 e a leitura confunde |
| Chat | não exportado | regra do doc |
| Booleano | texto traduzido (Sim/Não) | regra do doc, com a ressalva dele de preferir Sim/Não a Verdadeiro/Falso |

A máscara de moeda e de data troca com o idioma do andaime, então gerar em inglês produz
`mm/dd/yyyy` e `$`.

### 1.10 Os campos que o doc não cobre

O doc especifica 13 tipos e declara 3 faltando. O produto tem 31. Ficaram sem nenhuma
especificação, e estão definidos neste protótipo:

**Relacionamento Simples** e **Relacionamento Múltiplo** (os mais usados depois de texto e
lista), **Editor de texto HTML**, **E-mail**, **Texto com máscara**, **Seleção em árvore**,
**Intervalo de horas**, **PDF**, **Editor de Documentos**, **Assinatura eletrônica** e **Tag**.

A ausência do relacionamento é a mais grave: é o campo com o problema de `display` vazio
descrito no `BRIEFING.md` 5.5, e é o que mais aparece nas categorias reais.

### 1.11 Os dois campos que o doc planeja e o produto não tem

**Duração** e **Campo virtual de valor dinâmico** não existem no enum do schema nem na API.
Entraram no catálogo com `disponibilidade: 'proposto'`, com selo azul e aviso próprio na
ficha, para ficar claro que são plano e não realidade. O padrão dos três formatos deles já
está definido, então nascem padronizados.

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

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

---

## Rodada 4 — 22/09/2026 — a moeda

### O que ela pediu

> no camop de moeda na tabela, e se eu quiser mudar A MOEDA? ta travado em real,
> mas na pratica eu posso escolher na hora de preencher o campo, bem como posso
> configurar correçoes monetarias se estiverem ativadas. teste correçao monetaria
> ativa pra voce ver como é

Ela está certa e eu estava errado: eu formatava a moeda pelo IDIOMA da interface
(BRL em português, USD em inglês, EUR em espanhol). Isso não existe no produto.

### O que o develop faz, medido

1. **A moeda é parte do VALOR, escolhida no preenchimento.** O campo tem dois
   controles ligados: um seletor de moeda e o campo de valor. Trocar a moeda troca
   a máscara do valor na hora (`BRL` → `R$ 0`, `USD` → `US$ 0`).
2. **São 179 moedas**, em ordem de país, com caixa de busca no topo, mostrando
   **só o código ISO 4217**, sem o nome e sem o país. A lista termina em metais
   (`XAU`, `XPD`, `XPT`, `XAG`).
3. **O formato de entrada e de saída é um objeto de três chaves.** Interceptei o
   `PUT /ws/types/leve/items/<ref>` e ele manda:
   `{ "currency": "USD", "value": 3750.25, "originalValue": 3750.25 }`.
   O `originalValue` é a âncora da correção monetária: o `value` é o corrigido.
4. **O PUT manda só os campos que mudaram**, não o `data` inteiro.
5. **A localidade da formatação é do CAMPO, não de quem lê.** Ela fica na aba
   **"Interface e Formatação"**, com **Localidade** ("Português Brasil"),
   **Dígitos da Fração Mínima** (0 a 20, padrão 0) e **Dígitos Máximo da Fração**
   (0 a 20, padrão 2). **Essa aba só existe ao EDITAR o campo**: na criação ela
   não aparece, então a formatação só se configura depois de o campo existir.
6. **Ligar "Configurar Correção Monetária" acrescenta um botão de calculadora**
   ao lado do valor, no formulário e na tela do item. O modal dele tem:
   **Índice ou Alíquota** (obrigatório), **Data Inicial** (já preenchida com hoje),
   **Data Final**, um ícone de trocar as duas datas, o aviso *"Selecione um Índice
   antes de definir as datas."*, a chave **Múltiplos Períodos** e **Enviar**.
7. **Os índices são globais**, não do workspace: SELIC, CDI, IPCA, IPCA-15,
   IPCA-E, INPC e os TJ por estado (TJDF não expurgada, TJSC, TJAC, TJMA, TJSE,
   TJRS, TJCE, TJTO…), com busca.
8. **A tela de Correção Monetária da categoria abre em branco.** Em
   `Estrutura › Categorias › leve › Correção Monetária` o layout renderiza sem
   conteúdo e sem aviso. É o mesmo padrão de "dependência não comunicada" que o
   `enspace-ux-research` já catalogou.

### O que mudou no protótipo

| Onde | O que passou a valer |
|---|---|
| `mocks.ts` | o valor é `{ currency, value, originalValue }`, e os itens têm moedas diferentes (BRL, USD, EUR) de propósito. Um deles tem `value` diferente de `originalValue`, para o caso corrigido existir |
| `formatacao.ts` | a moeda sai de `value.currency` e a localidade de `campo.localeDoCampo`. **Trocar o idioma da tela não muda mais o formato do número nem o símbolo** |
| Célula | o símbolo é o da moeda gravada. Valor corrigido ganha a marca de correção, com tooltip dizendo que o original está em `originalValue` |
| Cru | além do valor, o **original riscado ao lado**, quando houve correção |
| Formulário e edição na célula | seletor de moeda com busca, campo de valor com a máscara da moeda escolhida, e o botão da calculadora quando o campo tem correção ligada |
| Edição na célula | passou a abrir em **camada flutuante**: três controles não cabem em 200 px. O documento propõe editar os dois na célula, o que funciona sem a calculadora e aperta com ela |
| Ficha | as configurações do tipo agora listam as três chaves de "Interface e Formatação" |
| Relatório .xlsx | a moeda ganhou **coluna própria com o código ISO** ao lado do valor. É a "dica de estrutura" do documento, e ela está certa: com moeda variando por linha não existe uma máscara só que sirva para todas |

**Maquete declarada:** a calculadora de correção monetária abre, aceita índice e
datas e fecha no Enviar. Ela **não calcula nada**, porque calcular exige a série
histórica do índice, que é back-end.

### Um bug de tradução que precisa subir agora

A chave `pro_rate` da correção monetária está assim no dicionário do produto:

| Idioma | String |
|---|---|
| pt-BR | `Correção Pró-Rata` ✅ |
| en | `Pro-Pussy Correction` ❌ |
| es | `Corrección pro-coño` ❌ |

É tradução automática de "Pró-Rata" que virou palavra vulgar em inglês e em
espanhol. Está no bundle de produção do develop, na interface de correção
monetária. Não é coisa deste protótipo: é conserto no dicionário do produto.

---

## Rodada 5: as seis observações sobre os campos

Ela mandou nove prints do Figma e uma lista numerada. Cada item abaixo diz o que
mudou e por quê, e onde eu estava errado eu digo que estava.

### 1. Alternativa binária não é "Sim e Não"

Era. Eu tinha posto o rótulo `Sim`/`Não` ao lado da chave e, na célula, o texto.

- **Formulário e cru:** só a chave, sem rótulo ao lado. O rótulo do campo, em
  cima, já diz do que se trata.
- **Célula:** **caixa vazia ou marcada**, e o clique **alterna na hora** — não
  abre controle nenhum. Vazio é caixa vazia, e essa é a única exceção à regra de
  "vazio fica vazio": um binário sem valor ainda precisa de caixa para clicar.
- **É o padrão de mercado?** Ela pediu para eu verificar, e é: Notion (checkbox),
  ClickUp (Checkbox), Monday (coluna Checkbox) e Twenty CRM (Boolean) todos
  desenham a célula como caixa e alternam com um clique. Quem usa chave na
  célula é o Airtable, e mesmo ele alterna com um clique.
- As opções do campo **Botões de Seleção única** deixaram de ser `Sim`/`Não`
  (viraram `Equipe interna`/`Terceirizado`): duas opções chamadas Sim e Não do
  lado do binário embaralhavam justamente a distinção que ela pediu.

### 2. "Intervalo de horas" não existe

O tipo `EnlTimeRange` saiu do catálogo, das células, dos controles e dos mocks.
O que existe é **Duração**, e ela é **inserção de duração**, não par de pontas:
campo de texto com `Ex.: "1 dia", "2 semanas", "3 meses", "1 ano" ou "30 min"`,
medido no develop. Já estava corrigido na rodada 3; agora o tipo fantasma também
saiu do código.

### 3. O "+" ao lado do relacionamento

Saiu. O atalho de criar registro agora fica **no pé da lista do próprio
seletor**, com busca no topo, que é onde o develop o põe. Um "+" solto fora do
controle não diz a que pertence e rouba um alvo de clique. Valendo para
Relacionamento Simples **e** Múltiplo.

### 4. O que faz salvar cada campo

Isto virou dado do catálogo, `comoSalva`, com cinco valores:

| Valor | O que a interface diz | Exemplos |
|---|---|---|
| `imediato` | "Escolher já salva. Não há o que confirmar." | listas, radio, caixas, binário, data, relação simples |
| `enterOuSair` | "Enter salva. Sair do campo salva. Esc desfaz." | texto, máscara, e-mail, número, tags, duração |
| `aoFechar` | "Fechar o seletor salva. Esc desfaz." | seleção múltipla, relação múltipla |
| `confirmar` | "Precisa do botão Confirmar. Esc descarta." | texto longo, HTML, moeda, endereço, grupo, repetidor, pessoa, assinatura |
| `naoSeAplica` | "O sistema preenche. Não há o que salvar." | código gerado, valor dinâmico, editor de documentos, chat |

Onde a frase aparece: **no formulário**, embaixo do controle; **na célula em
camada flutuante**, no rodapé, onde o botão **Confirmar** só existe para os
campos que precisam dele (nos outros o rodapé traz só **Fechar**); **na célula em
linha**, como etiqueta flutuante, que não empurra a altura da linha; e **na ficha
do campo**, junto da família e da largura.

### 5. Os campos de anexo: eu tinha deixado quase nada

Ela está certa, e a fonte é o documento do time de produtos, que lista as ações
de anexo. Eu tinha só o botão de subir arquivo. Agora:

- **anexo é lista**, não arquivo único, nos mocks e nos dois componentes;
- cada linha tem **renomear no lugar, subir, descer, baixar e remover**, e o pé
  do campo tem **adicionar arquivo**;
- a célula mostra o primeiro anexo e **`+N`** para o resto;
- o relatório .xlsx leva o hyperlink do primeiro com `(+N)` no texto, porque um
  hyperlink de célula aponta para um destino só.

**Maquete declarada:** o "adicionar" cria um anexo de exemplo em vez de abrir o
seletor de arquivos do sistema. Daí para frente tudo é real: renomear, reordenar
e remover mexem no valor. **Reordenar é por botão de subir e descer, e não por
arrastar** — arrastar dentro de uma camada flutuante sobre a célula é frágil, e o
que está em discussão é a lista de ações, não a mecânica do arrasto.

### 6. Chat sem interação na célula, e Anotações sem a conversa

- `EnChats` **deixou de ser somente leitura**. Ele não se *preenche* no
  formulário de criação (a conversa nasce com o item), mas a **célula abre a
  conversa e recebe mensagem**. Era erro meu.
- **Anotações deixou de ser caixa de texto e virou conversa também**: histórico
  com autor, hora e o texto, e o compositor embaixo com o
  `Comente ou digite "/" para acionar comandos e ações da IA` e a fila de ações
  (anexar, mencionar, pessoas, ações de IA, gravar vídeo) mais o enviar. É o
  desenho do exemplo do Figma.
- Mandar mensagem **funciona de verdade**: entra no histórico e o contador da
  célula sobe.
- A saída formatada dos dois é a **última mensagem com o autor**. No .xlsx,
  **chat não vai** (regra do documento, e ela está certa: é histórico) e
  **anotação vai inteira**, uma mensagem por linha na célula.

### E o resto da mensagem

| O que ela disse | O que ficou |
|---|---|
| "e-mail e url são o campo de texto simples com máscara" | o catálogo já dizia isso em `config.masks`; agora a célula de e-mail também **abre** (`mailto:`), que é o que a máscara acrescenta na leitura. Com máscara de URL, o mesmo ícone abre em outra aba |
| "seleção única deve ocupar bastante da largura da coluna, pra destacar" | a célula é um **selo colorido da largura da coluna**, com o chevron na ponta; no formulário o selo aparece **dentro** do controle e **dentro** de cada linha da lista |
| "seleção múltipla: as opções aparecendo, a busca, e vai concatenando num espacinho" | os escolhidos são selos com `x` **dentro** do campo, e a lista fica **aberta embaixo**, com busca e caixa marcada por opção |
| "tags: igual, mas só uma tag por digitação" | mesmo desenho, sem lista de opções, com o aviso `Digite e aperte Enter para cada tag` |
| "dado vazio não traz '-', fica vazio de verdade" | a célula vazia não tem texto nenhum, só o alvo de clique e o rótulo para leitor de tela |
| "não precisa mudar o FORMATO da tabela como no print" | a tabela continua a **nossa tabela nova**, a do Nuxt UI, com a casca do develop |

### O Figma, com nome aos bois

Abri o arquivo no navegador dela. A página **Mockup** é um **quadro de
referência com imagens colados**: as camadas se chamam `image 12`, `image 13`,
`Gemini_Generated_Image_…`, e cada moldura é a tabela real de Invoices com **uma
interação de célula sobreposta**. É exatamente o conjunto de prints que ela
mandou. Não há componente, variante nem token para herdar: é material de
referência visual, e foi assim que usei. O modo apresentação do Figma exige
conta, e conta eu não crio.

### O que segue aberto

- **Matriz de dados** e **ID Personalizado** continuam fora do protótipo: não
  consegui criar os dois no develop para medir o comportamento.
- Os quatro tipos **legados** que só existem em dado antigo (Data, Hora,
  Datetime, Editor de HTML v1) continuam fora da vitrine.
- A **barra de seleção em massa** ("1 Selecionado / Comparar / Excluir") e o
  estado de **alterações não salvas** do develop continuam não prototipados.

---

## Rodada 6: a edição salta para fora da tabela, e a criação vem pela linha

### O que ela pediu, e o que eu fiz

| Pedido | Estado |
|---|---|
| criar item PELA TABELA, na PRIMEIRA linha e não na última | **feito** |
| a área de edição "pular pra fora" da tabela quando clicada, como no Notion | **feito**, e virou o único jeito de editar na célula |
| os popups do ClickUp para campos complexos | **feito**: o mesmo quadro, com quadro largo, cabeçalho e o limpar |
| explorar o board dela no ClickUp e no Notion, criando os campos e comparando | **bloqueado no login**, ver no fim |

### O salto: por que ele substituiu a edição dentro da célula

Antes eu tinha dois jeitos de editar na célula: controle dentro da linha para o
que cabia, camada flutuante para o que não cabia. Agora é **um só**: clicar numa
célula abre um quadro ancorado nela que cresce para fora da tabela, por cima da
grade. Três razões:

1. **a linha tem altura fixa.** Dentro dela, tudo o que é maior que uma linha ou
   é cortado ou empurra a tabela. Foi exatamente o que aconteceu na rodada 5 com
   a dica de "o que salva": ela existia no DOM e a célula cortava;
2. **o quadro tem cabeçalho e rodapé**, então cabe o nome do campo, o limpar e a
   frase de o que salva no lugar onde a pessoa está olhando;
3. **é um caminho só.** Campo simples e campo complexo passam pelo mesmo quadro
   e pelo mesmo componente de entrada. O dev implementa uma vez.

O detalhe que faz parecer zoom, e não "abriu um popup": o canto superior esquerdo
do quadro fica 8 px acima e à esquerda do canto da célula, e o quadro tem 8 px de
respiro por dentro. **O valor continua desenhado no mesmo ponto da tela**, e o
que muda é a moldura aparecendo em volta, com 140 ms de escala saindo de 0,94.
Rolar a tabela reancora o quadro; Esc e clique fora fecham.

O sinalizador `edicaoEmPopover` do catálogo virou **`saltoLargo`**: ele não
decide mais "dentro ou fora", porque agora é sempre fora. Ele decide a largura
do quadro (420 px para conversa, anexo, repetidor, endereço, texto longo; a
largura da coluna, com mínimo de 260 px, para o resto).

### A linha de criação, no topo

- é uma linha de verdade da tabela, primeira, com as mesmas colunas e larguras;
- o convite "Criar registro aqui" abre o quadro do primeiro campo que se
  preenche, que é o gesto do ClickUp quando se clica na linha nova;
- qualquer célula da linha aceita valor, e o valor vai para um **rascunho**;
- **Enter cria**. O botão Criar também, e ele aparece na célula da referência e
  na coluna de ações assim que o rascunho tem algo. O x descarta;
- o item nasce **no topo da lista**, com referência gerada e o toast de salvo.

**Por que no topo e não embaixo, além de ela ter pedido:** numa tabela paginada
de 248 itens, a última linha da PÁGINA não é o fim de nada, e o item recém-criado
apareceria longe de onde a pessoa estava olhando. No topo ele nasce onde o olho
já está.

**Detalhe que o dev precisa saber:** a linha de criação é a primeira linha do
corpo da tabela, então todo índice de linha anda um. O duplo clique que abre a
visão rápida passou a ler `itens[i - 1]`. Se a tabela ganhar ordenação de
verdade, a linha de criação precisa ficar **fora da ordenação** (no produto, uma
linha fixada), ou ela vai para o meio da lista.

### O limpar, que é do ClickUp

O cabeçalho do quadro ganhou o **limpar o campo** quando há valor. Sem ele, tirar
o valor de um seletor obriga a desmarcar opção por opção, e nas famílias de lista
o resultado nunca é "vazio" de verdade. Campo de lista volta para lista vazia;
os outros, para nulo.

### O que ficou bloqueado, e por quê

Ela mandou dois links para eu explorar e comparar: o board do ClickUp e a página
do Notion. **Os dois pedem login no Chrome dela**, e login eu não faço: digitar
senha não é coisa que eu faça, e o "Continuar com o Google" abre uma janela
separada que a extensão não alcança, então ela fica girando sem eu poder tocar.

Então a rodada 6 entregou o que ela **garantiu** que quer (o salto, a criação
pela linha, o popup de campo complexo), desenhado a partir da descrição dela e do
comportamento conhecido dos dois produtos, e a comparação campo por campo dentro
dos boards dela fica para quando ela estiver logada. O que falta conferir lá, na
ordem:

1. seleção múltipla: ClickUp x Notion, qual concatena melhor conforme cresce;
2. anexo: qual dos dois dá o melhor gerenciador dentro da célula;
3. o quadro do Notion: medir o respiro e a duração reais, e ver o que ele faz
   quando a célula está na última coluna ou na última linha;
4. os popups do ClickUp: o que eles põem no cabeçalho além do nome do campo;
5. a linha de criação: se o ClickUp mantém o foco para criar vários em sequência.

---

## Rodada 7: o que os boards dela mudaram no protótipo

Entrei no ClickUp e no Notion, criei os campos e medi. As descobertas campo por
campo estão no `PESQUISA.md`; aqui fica só o que mudou no protótipo e por quê.

| Mudança | De onde veio |
|---|---|
| O recuo do quadro caiu de 8 px para **4 px** e a largura mínima subiu de 260 para **300 px** | medição no Notion: célula de 156x33, quadro de 300x104 a 2 px do canto |
| Campo preenchido abre com o **valor já selecionado** | Notion. Quem abre um campo cheio quase sempre quer trocar o valor, não emendar no fim |
| O anexo virou **alça de arrasto à esquerda e menu "⋯" à direita** | Notion. Os cinco botões em linha da rodada 5 viravam ruído a cada hover |
| Arrastar para reordenar anexo **passou a funcionar** | Notion, e voltei atrás na rodada 5: eu tinha declarado o arrasto frágil e resolvido com dois botões. O gesto principal é o arrasto; subir e descer ficaram no menu, que é o caminho do teclado |
| O pé do quadro ganhou o **atalho para a ficha do campo** | Notion, "Edit property" no pé do editor de célula |
| O campo de data ganhou **atalhos** (Hoje, Amanhã, Semana que vem, 2 semanas, 4 semanas) | ClickUp, cujo popup de data é o melhor dos dois |
| A lista de opções ganhou **criar a opção que falta** | Notion ("Select an option or create one") e ClickUp ("Pesquise ou adicione opções") |
| A linha de criação **continua aberta depois do Enter** | ClickUp: lá o compositor fica pronto para o próximo registro |

**Maquete nova declarada:** criar opção a partir da célula grava a opção no
VALOR do item, e não no catálogo de opções do campo, porque o catálogo é
back-end. Na implementação de verdade isso precisa criar a opção no campo, e é
uma decisão de produto: hoje só quem configura o campo cria opção.

### Onde eu estava errado, e o que ficou confirmado

- **errado:** eu tinha declarado o arrasto de anexo como frágil e substituído por
  botões. O Notion faz arrasto com alça e é o padrão dos dois;
- **errado:** eu achava que o quadro precisava de respiro de 8 px. O Notion usa
  2 px, e com o respiro grande o valor "salta" de lugar em vez de ficar parado;
- **confirmado:** o quadro ancorado que cresce para fora é o gesto do Notion, e
  o ClickUp NÃO faz isso (ele abre painel abaixo da célula);
- **confirmado:** vazio fica vazio no Notion, e o ClickUp é quem usa "–";
- **confirmado:** selo com × dentro do campo e lista aberta embaixo é o desenho
  dos dois para seleção múltipla;
- **confirmado:** as ações de anexo são baixar, renomear, remover e reordenar,
  exatamente a lista do documento do time de produtos.

### O que vi e NÃO trouxe, para discutirmos

1. **Primeiro clique seleciona, segundo edita** (ClickUp). É bom para navegar de
   célula em célula pelo teclado e ruim para editar rápido. A tela nova não é
   planilha, e ela pediu o gesto do Notion.
2. **"⋯" por opção dentro da célula**, para renomear, trocar a cor ou excluir a
   opção do campo (Notion). Mexe na configuração do campo a partir do
   preenchimento. Poderoso e perigoso: quem preenche pode renomear uma opção que
   está em uso em outros 200 itens.
3. **Comentário por célula** (Notion mostra o balão no hover de qualquer célula).
   Nós temos comentário no item, não na célula.
4. **Date format e Include time dentro da célula** (Notion). No nosso produto
   isso é `cFormat` do campo, configuração e não dado.
5. **A moeda como configuração do campo** (ClickUp e Notion). O nosso valor
   carrega a moeda, o que é melhor para contrato em dólar e pior para somar a
   coluna. Fica como está, e a soma precisa de conversão declarada.

---

## Rodada 8: criar no fim, porque criar no topo não existe no mercado

Ela desconfiou do que ela mesma tinha pedido na rodada 6 ("escolhemos acima mas
ninguém faz isso, pode ser estranho") e mandou pesquisar. Ela estava certa.

### Onde cada produto cria pela grade

| Produto | Onde | Como |
|---|---|---|
| **Notion** | fim | "+ New page" na última linha, mais um "+" no vão da linha, no hover, que insere logo abaixo dela |
| **Airtable** | fim | linha "+" no fim, mais "Insert record below" no menu da linha |
| **ClickUp** | fim do grupo | compositor de uma linha com "Salvar ↵", e ele **fica aberto** depois de criar |
| **Monday** | fim do grupo | "+ Add item" |
| **Twenty** | fim | `RecordTableNoRecordGroupAddNew` renderizado **depois** das linhas, e o registro nasce com `position: 'last'`. Li no repositório, em `packages/twenty-front/src/modules/object-record/record-table/components/` |

**Criar no fim é unânime. Criar no topo fixo não existe em nenhum dos cinco.**

### O que o protótipo passou a fazer

A linha fixa no topo saiu. Entraram os dois caminhos que o mercado tem:

1. **"+ Criar registro" na última linha da grade.** É uma linha de verdade da
   tabela (largura, borda, colspan), teleportada para dentro do `<tbody>` que o
   `EnTable` monta, porque o SDK não tem slot de rodapé do corpo. Se ganhar um,
   isto vira uma linha normal;
2. **"+" no vão da linha, no hover**, que insere o rascunho **logo abaixo** dela.
   É o gesto do Notion e o "Insert record below" do Airtable. O mesmo gesto
   também está no menu da linha, que é o caminho de quem usa teclado.

Nos dois casos o rascunho é uma linha de verdade, o quadro de edição é o mesmo
das outras células, **Enter cria** e o quadro **continua aberto na posição
seguinte**, como o compositor do ClickUp. Nem a linha de criação nem a de
rascunho entram na numeração, senão o número mentiria sobre quantos itens há.

### A numeração, a caixa no hover e a caixa do cabeçalho

Ela marcou no print do ClickUp, e é padrão de tabela que edita (Airtable,
ClickUp e Notion): **o número da linha no vão da esquerda, trocado pela caixa de
seleção no hover**, e a **caixa do cabeçalho fixa**, marcando todos. O `EnTable`
desenha a coluna de seleção sozinho, então o número entra por contador de CSS e
a troca é opacidade. É o único jeito sem reescrever a tabela do SDK.

### "Clicar na linha abre o item" é padrão de mercado? Não.

A pergunta dela. A resposta, medida nos cinco:

| Produto | O que abre o registro |
|---|---|
| **Notion** | botão **OPEN** que aparece no hover, ao lado do nome |
| **Airtable** | botão **⤢** no hover, dentro da célula primária. Ou a barra de espaço com a célula selecionada |
| **ClickUp** | botão **⤢** ("Tarefa aberta") no hover, ao lado do nome |
| **Twenty** | o **chip do nome** abre o registro; há também o painel lateral |
| **Monday** | o **nome do item** é link, mais o botão de expandir |

Ou seja: **em tabela que edita na célula, quem abre o registro é uma ação da
célula do identificador, e nunca o clique na linha.** O motivo é direto: a linha
inteira é área de edição de campo, e um clique que abre o item roubaria o clique
que edita a célula. Clicar na linha para abrir é padrão de lista que **não**
edita (Linear, caixa de e-mail), onde a linha está livre.

**O que fizemos:** a célula da Referência é a que abre, de três jeitos, e as
outras células são todas área de edição de campo.

- botão **Abrir** que aparece no hover da célula, como o OPEN do Notion;
- clique no **selo da referência**, que é gerado pelo sistema e não se edita,
  então o clique nele fica livre para abrir. É o chip do nome do Twenty;
- **duplo clique na linha**, que é o gesto que o develop já tem hoje, mantido
  para quem já aprendeu.

---

## Rodada 9: as cinco decisões, e o copiar flutuante

Ela aprovou as cinco propostas. O que cada uma virou:

### 1. As ações de opção dentro da célula, partidas por risco

O Notion tem um "⋯" por opção que renomeia, troca a cor e **exclui** a opção do
campo a partir do preenchimento. Adotamos em pedaços, porque "mexer na opção"
não é uma coisa só:

| Ação | O que ficou | Por quê |
|---|---|---|
| **Criar** | liberado, já estava | é aditivo, nada quebra, e é o que trava o preenchimento hoje |
| **Reordenar** | liberado | muda a ordem da lista, não o dado |
| **Renomear** | liberado **com o alcance à vista**: "Muda o rótulo em 2 registros." | o `value` gravado não muda, então o dado está seguro. O que muda é o que todo mundo lê |
| **Excluir** | **não existe na célula** | deixa item com valor órfão. Mora na configuração do campo, onde o estrago está na tela |

Tudo atrás de **permissão**: o "⋯" só aparece para quem pode configurar o campo,
e o andaime tem o interruptor **Configurar campos** para a diferença entre
preencher e configurar ficar visível. Com ele desligado, a lista continua
escolhendo e os menus somem.

**Pendência para o dev:** confirmar se o nosso modelo de permissão já separa
"preencher campo" de "configurar campo". Se não separar, essa é a decisão de
fundo e o resto depende dela.

**Maquete declarada:** renomear grava no objeto de opções em memória, que virou
`reactive` no `mocks.ts` de propósito, para o protótipo provar que o rótulo muda
na tabela inteira. Num back-end de verdade é um PATCH na configuração do campo.

### 2. Comentário: um lugar só, ancorado no campo

O Notion comenta **por célula**. Não fizemos, e a razão não é esforço: já temos
Chat e Anotações no item, e uma caixa de entrada por célula multiplicaria
notificação, "resolvido" e histórico por N campos. A pergunta "onde falaram
disso?" passaria a ter três respostas.

O que ficou: **comentar a partir do campo**, pelo rodapé do quadro de edição,
com o texto indo para a **conversa do item** citando o campo
(`sobre Texto Curto: ...`). Uma caixa de entrada só, e ainda assim ancorada onde
a dúvida nasceu. Se um dia medirmos que as pessoas comentam muito sobre valores
específicos, aí sim vale o modelo por célula.

### 3. Formato de data continua sendo configuração

O Notion deixa trocar o formato da data **dentro da célula**. Não trouxemos, por
dois motivos concretos: duas pessoas leriam a mesma coluna em formatos
diferentes, e **o .xlsx sairia com máscara diferente da tela**, porque a
exportação usa o formato do campo. O que trouxemos foi o ALCANCE, não a
semântica: o rodapé do quadro tem a engrenagem que abre a ficha, que é onde o
formato mora.

Ficou marcado para revisar: **"incluir hora" tem cara de formato mas é dado**
(compromisso às 14h não é a mesma coisa que uma data). Hoje é `Exibir Hora` na
configuração, e fica assim até aparecer categoria que precise dos dois no mesmo
campo.

### 4. A moeda continua no valor, e o custo foi resolvido

O ClickUp e o Notion põem a moeda na configuração do campo. Ficamos com a nossa,
que guarda `{ currency, value }`, porque é o que serve contrato em moeda
estrangeira. O custo tinha duas pontas, e as duas foram tratadas:

- **o seletor de 179 moedas**: o campo agora declara `moedaPadrao` e
  `moedasPermitidas`. Quem só trabalha em real vê uma moeda, e a busca só
  aparece a partir de dez opções;
- **somar a coluna**: a ficha do campo de moeda mostra o **total por moeda**
  (`R$ 1.234,56 · US$ 7.250,90 · € 9.820,00`) com a regra escrita:
  **moedas diferentes nunca somam juntas**. Somar misturado daria um número que
  não existe, e é justamente o que o ClickUp evita escolhendo a moeda no campo.

### 5. O teclado, que é a metade boa do modelo de planilha

Não adotamos "primeiro clique seleciona, segundo edita": isso cobra dois cliques
de todo mundo para servir quem navega pelo teclado. Adotamos só o que aquilo
compra:

| Tecla | O que faz |
|---|---|
| Esc | fecha o quadro |
| Tab | próximo campo da mesma linha |
| Shift+Tab | campo anterior |
| Enter | salva e **desce** para a mesma coluna da linha de baixo |

### E o copiar flutuante, que ela pediu

No hover de uma célula preenchida aparece uma **bandeja flutuante** encostada na
borda, por cima do conteúdo, com **copiar** e, nos campos com máscara de e-mail
ou URL, **abrir**. Copia a **saída formatada**, que é o que se cola num e-mail e
é a mesma string que a ficha mostra. Em coluna alinhada à direita a bandeja vai
para a esquerda, senão taparia o número.

Fica de fora o que não tem "o valor" para colar: binário, anexo, conversa,
assinatura e repetidor.

### A Referência não abre mais no clique

Decisão dela: **abrir fica no botão Abrir e no duplo clique**, e mais nada. O
selo da referência voltou a ser só identificação.

---

## Rodada 10: o ícone, o cartão da relação, e o Pessoa/Empresa em aberto

### O ícone das Anotações

Anotações e Chat estavam com o mesmo símbolo na célula, porque o ícone estava
escrito no código do componente em vez de vir do catálogo. Agora vem do
catálogo: **Anotações é bloco de notas, Chat é balão**. Os dois são conversa, mas
não são a mesma coisa, e com o mesmo símbolo a tabela mentia que eram.

### O cartão do registro relacionado

Ela trouxe do nosso admin: na lista de workspaces, passar o mouse na carteira
abre um cartão com saldo, referência, id, datas e o botão "Ver detalhes da
carteira". A ideia entra, e resolve um buraco real: numa relação, o `display`
sozinho ("Nortelux Elétrica") não responde **que registro é esse**, e hoje a
única forma de saber é abrir o item e perder o lugar.

**O que mantém isso coerente com o resto** (a preocupação dela de não ficar
frankenstein) é uma regra de três gestos, que passa a valer para a tabela
inteira e não só para a relação:

| Gesto | O que acontece | Onde já valia antes |
|---|---|---|
| **passar o mouse** | MOSTRA | a bandeja de copiar, e agora o cartão |
| **clicar** | EDITA | o quadro que salta para fora da tabela |
| **ação explícita** | ABRE | o botão Abrir da Referência, e o botão do cartão |

O cartão é **só leitura**. Se tivesse controle de edição dentro, brigaria com o
quadro, que é quem edita. É isso que separa "mais uma ideia" de uma ideia que
combina com as outras.

**A linha não alarga**, que era a condição dela: o cartão é camada flutuante,
como o quadro. Medido no protótipo: a linha continua com 42 px de altura com o
cartão aberto.

**Nos três formatos, mesmo cartão e mesmo conteúdo, gatilho diferente:**

| Formato | Gatilho | Por quê |
|---|---|---|
| **célula** | hover no selo, com 400 ms de atraso | na tabela o mouse cruza célula sem querer, e cartão que abre no roçar do mouse é poluição |
| **cru** (sidebar) | igual à célula | a coluna é estreita, o cartão flutua |
| **formulário** | **fixo embaixo do seletor** | no formulário existe espaço vertical, e quem escolheu o registro quer conferir a escolha sem fazer mira com o mouse |

**Proposta de contrato que vem junto:** hoje a relação devolve
`{ id, display, reference }`. O cartão precisa de **categoria, três linhas de
resumo e as datas**, e isso tem que vir no próprio valor da relação. Sem isso o
cartão vira uma chamada de rede por linha da tabela. Está no `mocks.ts`, no
comentário do `itensRelacionaveis`.

### Pessoa/Empresa: ela apontou que o meu não tem relação com o real

E tem razão para desconfiar: o que eu prototipei é um **seletor de membros do
workspace**, e o nome do tipo e o próprio catálogo dizem outra coisa. O
`Field` do schema tem **`personConfig`**, e o texto do meu próprio catálogo diz
"bloco com os subcampos de personConfig, na linha inteira". Ou seja: é um
**bloco de dados de pessoa ou empresa** (com subcampos configuráveis), e não uma
lista de gente do workspace.

**Não corrigi ainda, de propósito.** O `personConfig` no schema é um registro
solto (`Record<string, unknown>`), então ele não diz quais são os subcampos, e
eu não vou adivinhar duas vezes o mesmo campo. Preciso ver a interação na tela
do develop, e a janela do Chrome estava minimizada (largura 0) durante esta
rodada. Fica como o primeiro item da próxima.

---

## Rodada 11: o Pessoa/Empresa de verdade, e dois defeitos que ele revelou

### O campo, medido na tela

Ela disse que o meu não tinha relação com o real, e não tinha. Eu tinha feito um
**seletor de membros do workspace**. Fui ver no develop, em 23/09/2026:

| Passo | O que o campo faz |
|---|---|
| 1 | começa **só com Tipo**, em "Por favor, selecione" |
| 2a | **Pessoa Física** revela **Nome** (opcional) e **CPF** (obrigatório), máscara `999.999.999-99`, contador `0/14` |
| 2b | **Pessoa Jurídica** revela **CNPJ** (obrigatório), máscara `**.***.***​/****-##`, contador `0/18`, mais **Razão Social** e **Nome Fantasia**, os dois obrigatórios |
| 3 | o documento é **validado**, não só mascarado: dígito errado dá "CNPJ Inválido" |
| 4 | e o documento válido é **consultado**: razão social e nome fantasia vêm preenchidos da consulta. Testei com 11.222.333/0001-81 e voltou a razão social de uma caixa escolar estadual |

Os pontos 3 e 4 são os que **nenhum outro campo nosso faz**, e eram justamente
os que faltavam no protótipo.

### O que o protótipo passou a fazer

- **formulário e quadro:** o bloco começa no Tipo e revela os subcampos daquele
  tipo, com máscara, contador, marca de obrigatório, o estado "consultando", a
  mensagem de documento inválido e o aviso "preenchido pela consulta";
- **célula:** saiu o avatar com iniciais, que era herança do seletor de membros.
  Entrou o **selo PF ou PJ**, o nome de exibição e o documento mascarado;
- **cru:** nome, razão social quando difere do fantasia, e o documento;
- **saída formatada:** `nome · documento mascarado`, no lugar de `nome (e-mail)`;
- **mocks:** os cinco itens ganharam valores do formato novo, inclusive dois
  casos de canto: PJ sem nome fantasia e **PJ com tipo escolhido e documento
  ainda vazio**, que é o estado em que o bloco espera a consulta.

**A chave de cada subcampo é PROPOSTA, não medida.** O formulário do develop
envia o item como multipart, porque carrega arquivo junto, então não consegui
ler o corpo da requisição. Os rótulos da tela são Tipo, Nome, CPF, CNPJ, Razão
Social e Nome Fantasia, e as chaves que usei (`type`, `document`,
`razao_social`, `nome_fantasia`, `name`) saem da lista que a própria
configuração do campo mostra. **Confirmar com o dev antes de implementar.**

**Maquete declarada:** a consulta é o `cadastroPorDocumento` do `mocks.ts`, com
meio segundo de espera para o estado "consultando" existir na tela. E a
validação aceita o que está no mock: calcular dígito verificador é regra de
back-end, e o que está em discussão é o comportamento do campo.

### Dois defeitos que só apareceram porque fui testar

**1. Escolher opção fechava o quadro inteiro.** A lista de opção de um seletor é
teleportada para o `body`, fora do quadro. Ao escolher, a sequência é
`pointerdown` na opção, a lista se desmonta ali mesmo, e o `mousedown` e o
`click` que faltavam caem em quem ficou embaixo do cursor: a camada de fundo do
quadro. Conserto: o fechar exige que o gesto **comece e termine** no fundo, e
quem sabe onde ele começou é o `pointerdown`. Valia para todos os seletores
dentro do quadro, não só para este campo.

**2. O quadro lia o item de um retrato antigo.** O estado de edição guardava o
objeto do item de quando a célula foi clicada, e quem manda na lista troca o
objeto a cada gravação. Em campo de digitar não aparecia, porque o controle
guarda o próprio texto. Aparece em tudo que **recalcula a partir do valor**: a
consulta do documento, o original riscado da moeda corrigida, a lista de anexos,
a conversa. Agora o quadro lê o item sempre da lista, pelo id.

Os dois estavam no protótipo desde a rodada 6 e passaram por quatro rodadas sem
aparecer. Apareceram no primeiro campo que precisou reagir ao próprio valor.

---

## Rodada 12: os erros de z-index, e por que o culpado era um número meu

Ela mandou dois prints: a lista do **Relacionamento Múltiplo** abrindo por baixo
do quadro de edição, e o menu de três pontos do **anexo** também por baixo.

### A causa

Fui medir as camadas flutuantes do Nuxt UI, em 23/09/2026, e o achado é simples:
**nenhuma delas tem z-index**. A lista de um seletor, o menu de três pontos, o
balão de ajuda, o cartão da relação, o modal e a gaveta são todos
`position: fixed` com `z-index: auto`, filhos diretos do `body`, dentro de um
`div[data-reka-popper-content-wrapper]`. Quem decide quem fica na frente é a
**ordem no DOM**: quem abriu depois fica em cima.

O quadro de edição tinha `z-40` na camada de fundo. Um número explícito ganha de
qualquer `auto`, então o quadro passava na frente de **tudo** o que abrisse de
dentro dele. Não era um caso isolado de um campo: era todo seletor e todo menu
dentro do quadro, e valeria para qualquer camada nova que aparecesse depois.

### O conserto

Tirei o `z-40`. Sem número, o quadro entra na mesma regra da biblioteca:

- ele entra no `body` quando abre, portanto **depois** da aplicação (que é o
  primeiro filho do `body` e tem `isolation: isolate`), e fica acima da tabela
  inteira, incluindo as alças de redimensionar coluna e a bandeja de copiar;
- a lista ou o menu que abrir **de dentro** dele entra depois, e fica acima
  dele.

Conferido de três jeitos: criando uma camada idêntica à do Nuxt UI por cima do
quadro e testando quem ganha o ponto (ganha a camada), abrindo o menu de três
pontos do anexo dentro do quadro (o menu aparece inteiro, na frente), e
inventariando todo z-index da página.

### O inventário, para não voltar a acontecer

| Camada | z-index | Onde |
|---|---|---|
| alça de redimensionar coluna | 2 | dentro da aplicação, do `EnTable` |
| bandeja de copiar da célula | 10 | dentro da aplicação, minha |
| botão de recolher o resumo | 10 | dentro da aplicação, cópia do develop |
| botão do laboratório | 20 | dentro da aplicação, cópia do develop |
| **quadro de edição** | **nenhum** | filho do `body` |
| **camadas do Nuxt UI** | **nenhum** | filhos do `body`, criados ao abrir |
| aviso (toast) | 100 | acima de tudo, e é onde tem que ficar |

A regra que fica: **camada flutuante nossa não ganha z-index.** Quem precisa
ficar na frente entra depois no DOM, e é assim que a biblioteca resolve. Número
explícito só onde existe hierarquia de verdade, como o aviso.

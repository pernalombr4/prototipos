# Briefing — Configurações do Sistema

## 1. A demanda, como ela veio

> "eu nao consigo me encontrar no menu de sistema do enspace, em /settings/system
>
> as abas parecem desorganizadas, as informaçoes distribuidas na aba de ingformaçoes basicas sao
> desorganizadas tambem, é tudo extremamente feio e o calendario parece que ta em mvp ainda.
>
> dicionarios nao sao feios mas podem funcionar melhor. quando se tem muito campo fica tudo tao
> extenso que mal da pra se orientar abrindo varios forms, varios campos... estranho.
>
> a aba de notificaçoes é ate bonitinha, mas extremamente ruim de usar. ninguem entende! todo
> mundo se perde!
>
> a aba de cobrança é a melhor! mas ainda nao é perfeita, mas nao sei o que poderia melhorar.
> parece que falta informaçao, falta dado, sei la... esquisita, parece pobre. voces precisam
> melhorar.
>
> e nada nessas telas inteiras levam a gente pra documentaçao de cada coisa. um horror pra
> encontrar!"

São **seis queixas**, e cada uma tem endereço. Elas viram os critérios de aceite da seção 3.

## 2. Onde acontece

**Rota:** `/workspaces/<ws>/settings/system` — a mesma URL nas cinco abas.
**Abas:** Informações Básicas · Calendário · Notificações · Dicionários · Cobrança
**Chegada:** menu lateral → Configurações → Sistema. Título da tela: "Configurações Gerais".

## 2.1 O que a pesquisa de UX já dizia

Consulta obrigatória ao `../enspace-ux-research` (somente leitura). **Havia**, e é do mesmo dia
desta demanda: o tema `temas/configuracoes-do-sistema/auditoria.md` guarda a Sessão 3 (persona
BR-GEN-TECH, "Rafael"), com sete fricções numeradas.

As duas leituras batem, por caminhos diferentes — a persona tropeçou, a cliente reclamou:

| Fricção | Sev. | O que a auditoria achou | Queixa da demanda que ela explica |
|---|---|---|---|
| **S3-F6** | P1 | As cinco abas são `<span>` sem `role`, fora da ordem de foco, e a URL é a mesma nas cinco — 4 de 5 seções inalcançáveis por teclado e sem link direto | "não consigo me encontrar" |
| **S3-F1** | P1 | Alteração não salva é descartada em silêncio ao trocar de aba | "todo mundo se perde" |
| **S3-F7** | P3 | Três convenções de botão de salvar na mesma tela (azul pequeno à direita, verde de 1582 px no rodapé, par Cancelar/Enviar) | "é tudo extremamente feio" |
| **S3-F2** | P2 | O calendário nasce sem nenhum dia útil e pinta o mês inteiro de "Dia Não Útil" | "o calendário parece que tá em MVP" |
| **S3-F3** | P1 | "Sincronizar Feriados" grava Brasil **e** EUA misturados, em dois idiomas, sem escolha, sem lista e sem desfazer | idem |
| **S3-F4** | P2 | Campo obrigatório "Modelo de e-mail" abre com zero opções; a direção do aviso é codificada no **sinal do número** (`-1` = 1 dia antes) | "ninguém entende!" |
| **S3-F5** | P2 | "en-credits" nunca definido, carteira **da pessoa** dentro do workspace, datas em inglês, slug de agente exposto como nome | "parece pobre, falta dado" |

A auditoria também registra o achado estrutural que organiza o resto: **as cinco abas não são
cinco variações do mesmo assunto, são cinco produtos diferentes empilhados atrás de uma linha de
abas** — identidade do workspace, motor de dias úteis, agendador de e-mail, ferramenta de
tradução e extrato financeiro da pessoa. Cada um com a sua convenção de gravação e o seu
vocabulário. É por isso que a linha de abas "parece desorganizada": ela promete uma coesão que
não existe.

E a observação que emparelha duas correções: **S3-F1 e S3-F7 se resolvem com a mesma peça** —
uma barra de rodapé do painel que aparece quando há alteração pendente.

**O que a auditoria não cobre**, e que esta demanda acrescenta:

- a **densidade dos Dicionários** quando o workspace tem muito campo;
- a **falta de link para a documentação** dentro das telas;
- a **distribuição** dos blocos dentro de Informações Básicas (a auditoria olhou a gravação e a
  acessibilidade, não o arranjo).

## 3. O que seria sucesso

**Em uma frase:** que a pessoa abra `settings/system`, saiba em dez segundos em qual das cinco
telas está o que ela procura, mude o que precisa sem medo de perder, e consiga aprender o que
cada coisa faz sem sair da tela.

Destrinchado, um critério por queixa:

1. **Achar** — a aba se identifica pelo nome e pelo que ela decide, e existe busca de
   configuração que atravessa as cinco.
2. **Informações Básicas arrumada** — um bloco por assunto, o controle perto do rótulo, uma
   convenção só de gravação.
3. **Calendário que não pareça MVP** — o dia mostra o que ele é, o feriado tem nome e país, e o
   que foi importado dá para ver e remover.
4. **Dicionários que aguentem volume** — dá para trabalhar 3.600 chaves sem perder o lugar.
5. **Notificações que se leiam em português** — a regra vira frase, não sinal de número.
6. **Cobrança com dado** — saldo que responde "dá para quanto tempo" e "no que foi".
7. **Documentação em cada seção** — todo bloco leva ao artigo que o explica.

## 4. Como o develop faz hoje

Investigado no workspace de exploração, **pela tela**, em 16/09/2026. Nada foi criado por API.
Uma configuração foi alterada (o toggle de notificações personalizadas do Spaceflow) e **não foi
salva** — e a própria tentativa virou prova da S3-F1, porque o toggle voltou sozinho ao trocar
de aba.

### O fluxo real, em passos

1. Menu lateral → **Configurações** → **Sistema**.
2. A tela abre sempre em **Informações Básicas**. Não há como abrir em outra: a URL não muda.
3. Trocar de aba é clicar no texto. Não há foco, não há seta, não há link.
4. Cada aba tem a sua própria regra de salvar — e Informações Básicas tem **três botões Salvar
   na mesma rolagem**, um por bloco.

### Aba 1 — Informações Básicas

[print do topo](evidencias/01-informacoes-basicas-topo.png) ·
[print rolado](evidencias/02-informacoes-basicas-adicionais-e-modulos.png)

Quatro cartões empilhados, cada um com o seu Salvar:

| Cartão | O que tem | O que está errado no arranjo |
|---|---|---|
| Informações Básicas | Nome, Referência (bloqueada), Descrição, Tipo de Logo, Ícone | "Tipo de Logo" gasta dois cartões de ~100 px de altura numa escolha binária; a Descrição tem um contador "0" solto na borda direita |
| Configurações Adicionais | Linguagem Padrão + 5 toggles | cada toggle ocupa uma linha inteira de ~1300 px, com o rótulo à esquerda e o "?" da ajuda **no extremo direito** — a ajuda fica a 1290 px do rótulo que ela explica |
| Módulos | 3 toggles (Correção Monetária, Comparações, Juridico) | grade de 2 colunas — **outra** grade, três centímetros abaixo da anterior; e sem nenhuma ajuda contextual, ao contrário dos cinco de cima |
| Zona de Perigo | aviso + "Visualizar Exclusão" | a lista do que se perde vem grudada numa linha só: "…arquivos• Todos os membros…" |

`Linguagem Padrão` está em **Inglês** enquanto a interface roda em português — herdado do estado
do ambiente, mas é o tipo de coisa que a tela não deixa perceber. E `Juridico`, no cartão de
Módulos, está sem acento.

### Aba 2 — Calendário

[print](evidencias/03-calendario.png)

- **Dias Úteis na Semana** é um campo de tags com cinco fichas e um "✕" em cada.
- **Sincronizar Feriados**, azul, no canto superior direito, acima de tudo.
- O calendário do mês ocupa a tela inteira e **cada dia repete a data dentro da célula**: o
  cabeçalho diz "7" e a caixa colorida logo abaixo diz "07/09/2026".
- Feriado e fim de semana são **quase a mesma cor**, e o feriado **não mostra o nome**.
- A legenda (Ocorrência · Dia Útil · Dia Não Útil) é um texto de 11 px colado à direita, acima
  do calendário.
- O **Salvar é verde, ocupa a largura inteira** e mora depois do calendário todo — quem
  configurou os dias úteis lá em cima rola uma tela cheia e, ao chegar no botão, não vê mais o
  que está gravando.

### Aba 3 — Notificações

[print](evidencias/04-notificacoes.png) · [print do modal](evidencias/05-notificacoes-modal-da-regra.png)

Duas seções sanfonadas — Spaceflow (Tarefas Rápidas) e Tarefas Agendadas — a segunda fechada.
Dentro da primeira: um toggle, uma linha de texto cinza de 12 px explicando a consequência, o
título "Configurações de notificações personalizadas" e um botão **Adicionar** verde-claro,
perdido no meio da largura, sem lista nenhuma em volta.

A tela **não diz em lugar nenhum o que são as notificações nativas** que o toggle desliga.

O modal da regra tem três campos e uma aba só, chamada "Definição":

- **Quando notificar (Em unidades de tempo)** — campo de texto livre. A direção está no
  **sinal**: `-1` avisa um dia antes, `2` avisa dois dias depois. Isso só está escrito no
  parágrafo cinza de 12 px embaixo do campo.
- **Unidade de tempo** — select.
- **Modelo de e-mail de notificação** — obrigatório e, neste workspace, **com zero opções**. A
  tela que alimenta esse campo (Configurações › E-mails › Modelos de E-mail) existe no menu e
  **não é citada**.
- **Salvar** verde, largura inteira do modal.

### Aba 4 — Dicionários

[print](evidencias/06-dicionarios-arvore-aberta.png)

Três botões de idioma ocupando a largura toda (o ativo é uma barra azul cheia), busca de chaves,
contador "0 de 11 traduzidas", quatro botões só de ícone e "Salvar traduções".

Abaixo, uma árvore: **categoria › grupo › chave**. Abrir "Geral" empurra o resto da árvore para
baixo e mostra as chaves como linhas de formulário — rótulo à esquerda, texto original em cinza
de 10 px **embaixo do rótulo**, campo de tradução ocupando o resto da largura.

O workspace de exploração tem 11 chaves. O schema real (`DictionaryKeysTree`) mostra por que
isso explode: **cada campo carrega até cinco textos traduzíveis** — `label`, `description`,
`help`, `instruction`, `placeholder` — mais um por opção de lista. Uma categoria com 30 campos
já passa de 150 chaves, e a documentação do produto cita workspaces com **3.651**. A queixa da
demanda ("abrindo vários forms, vários campos") é essa multiplicação: a árvore é fiel à
estrutura e inútil como plano de trabalho, porque não existe filtro por "o que falta", não
existe cabeçalho que persista na rolagem e não existe "ir para a próxima não traduzida".

### Aba 5 — Cobrança

[print](evidencias/07-cobranca-dado-ficticio.png)

É a aba mais bem construída — e é a que menos responde pergunta:

- **Carteira do usuário · Saldo: 2801 en-credits**, com um selo "Ativa". Três informações numa
  faixa de 90 px de altura. Nada sobre ritmo, período, projeção ou preço.
- **Solicitações de Crédito** com cinco filtros de status e um estado vazio correto.
- **Histórico de Transações** com um selo "10 / 300" sem rótulo, rolagem infinita, e cada linha
  assim: `-70 en-credits` · `Débito` · "Uso do agente `analista-de-duplicidade---contratos` por
  `<e-mail>` em `Contratos Norte`" · `217.0k tokens` · **"yesterday"**.

Três coisas se somam aí: a unidade nunca foi definida, a data está em inglês, e o extrato mostra
consumo **de outros workspaces** dentro de uma tela cujo cabeçalho inteiro diz o nome deste. A
carteira é da pessoa; a tela é do workspace.

### O que já existe e funciona — e o protótipo não pode desmontar

- O **tooltip de cada dia** do calendário explica a causa, não só o estado: "Dia não útil, em
  decorrência do dia da semana".
- Os cinco toggles de Configurações Adicionais **têm ajuda contextual** no "?", com texto bom —
  o de "Ignorar permissões para membros full" explica o risco, não o controle.
- Os Dicionários **mostram progresso por nó** (`0/11`, `0/3`, `0/6`, `0/2`).
- A **Zona de Perigo** é bem feita: separada, com aviso enumerando o que se perde, e um passo
  intermediário antes da ação.
- Selecionar dias úteis **repinta o calendário na hora**, antes de salvar.
- O estado vazio de Solicitações de Crédito é correto e já oferece a saída.

### Onde trava

1. **Teclado:** as abas não existem para o Tab (S3-F6). Reproduzido de novo hoje.
2. **Link direto:** a URL é a mesma nas cinco. Recarregar sempre volta para a primeira.
3. **Perda silenciosa:** liguei o toggle de notificações personalizadas, fui ao Calendário e
   voltei — **o toggle estava desligado de novo**, sem nenhum aviso (S3-F1).
4. **Campo obrigatório sem opção:** o modelo de e-mail (S3-F4).
5. **Feriado sem volta:** não há tela que liste ou remova o que a sincronização gravou (S3-F3).

## 5. Evidência

Prints em [`evidencias/`](evidencias/), capturados hoje no workspace de exploração:

| Arquivo | Estado |
|---|---|
| `01-informacoes-basicas-topo.png` | aba 1, topo — identidade e o primeiro Salvar |
| `02-informacoes-basicas-adicionais-e-modulos.png` | aba 1, rolada — os toggles, o "?" no extremo direito, o segundo e o terceiro Salvar |
| `03-calendario.png` | aba 2 — dias úteis, legenda e o mês com a data repetida na célula |
| `04-notificacoes.png` | aba 3 — o toggle, o "Adicionar" solto e a seção fechada |
| `05-notificacoes-modal-da-regra.png` | aba 3 — o modal com o campo de sinal e o modelo obrigatório |
| `06-dicionarios-arvore-aberta.png` | aba 4 — a árvore com um grupo aberto |
| `07-cobranca-dado-ficticio.png` | aba 5 — carteira, solicitações e extrato |

> **Sobre o print da Cobrança.** O extrato real trazia e-mail de pessoa e nome de workspace de
> cliente. Como este repositório é público (regra 13), o texto foi **substituído por dado
> fictício no DOM antes da captura** — `ana.ribeiro@exemplo.com.br`, "Contratos Norte",
> "Atendimento Sul". O arranjo, os valores e a estrutura das linhas são os verdadeiros; só os
> nomes não são.

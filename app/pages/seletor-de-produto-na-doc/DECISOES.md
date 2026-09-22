# Decisões

## A fronteira: o que muda e o que não muda

**Muda:** o que entra ao lado do logo (o seletor de produto), o que o menu lateral lista, o
escopo dito pelo botão de busca, o conteúdo da coluna do meio e o aviso de troca sem página
equivalente.

**Não muda:** barra do topo, os quatro links de seção, chave de tema, seletor de idioma, botão
de entrar, menu do celular, grade de três colunas, cabeçalho de página com selo de status e
botão de copiar, e a coluna "Nesta página".

**Duas coisas da casca mudaram, e as duas estão declaradas porque a regra 37 manda declarar:**

1. **O afastamento do grupo de links.** Hoje ele tem `ml-28`, um empurrão calculado para a
   largura do logo sozinho. Com o seletor ao lado, virou `ml-4`. No estado "Como é hoje" o
   `ml-28` volta, para a comparação ser honesta. **É achado, não licença:** se for para
   implementar, vale olhar se o certo não é centrar o grupo por conta própria, em vez de
   empurrá-lo por margem.
2. **O rótulo acessível da chave de tema.** Hoje o botão de sol e lua não tem rótulo nenhum, e
   o leitor de tela anuncia só "botão". Aqui ele recebeu um rótulo **fixo** ("Alternar o tema"),
   não porque a casca ganha melhoria de passagem, mas porque um rótulo que muda com o tema
   ("Tema escuro" / "Tema claro") quebra a hidratação: no servidor o tema ainda não é conhecido.
   **Pergunta para a Mikaela:** vale abrir isso como correção no `en-docs`? O mesmo vale para o
   botão de entrar e para o seletor de idioma, que também não têm rótulo hoje.

## A proposta, decisão por decisão

### 1. O seletor fica colado ao logo, no alto e à esquerda

Convenção dos quatro que resolvem isso (Nuxt, GitHub Docs, Atlassian, Monday). O produto é o
contexto de tudo que vem abaixo, então ele vem antes de tudo que vem abaixo. E lê-se como
caminho: **ENSPACE › Plugin do Word**.

Nada foi tirado do topo para abrir espaço (regra 16): o seletor **soma**.

### 2. O nome do produto aparece sempre, inclusive quando é o ENSPACE

O botão fechado mostra `ENSPACE` mesmo com o logo ENSPACE ao lado. Parece redundante, e é de
propósito: um controle que só aparece depois de escolhido nunca é descoberto por quem mais
precisa dele, que é quem ainda não sabe que a doc tem mais de um produto. Mesma escolha do
Nuxt (o distintivo de versão está sempre lá) e do GitHub Docs.

O logo é imagem e o seletor é controle, com ícone, fundo e chevron. A repetição some no segundo
olhar, e some de vez assim que a pessoa troca de produto.

**A exceção é o celular, e ela foi medida.** A 380px de largura sobram cerca de 100px entre o
logo e a chave de tema, e o nome sairia cortado em duas letras. Testado: o botão chegava a
encostar no sol da chave de tema. Abaixo de `sm` o botão fica **só com o ícone e o chevron**, com
o nome no `aria-label` e no `title`, e **o nome por extenso vai para dentro do menu do
hambúrguer**, em linha cheia, na primeira posição, acima de `Docs`. É a mesma peça, com o mesmo
menu: ninguém perde o controle, e quem abre o menu lê o nome inteiro.

### 3. O menu tem uma linha por produto, sem descrição

**Revertido na rodada 2.** A rodada 1 dava a cada item uma linha de descrição, divergindo de
propósito do Nuxt e do GitHub Docs, com o argumento de que "Beni App" não se explica sozinho.

O argumento não se sustentou contra a segunda passada de pesquisa: **nenhuma das dez
documentações descreve os itens**, nem o Supabase, que tem dez produtos na lista. E a descrição
era a causa principal do peso visual: transformava um menu de 96px num painel de 336px de largura
com três blocos de texto, que é o que fazia a peça parecer formulário em vez de badge.

Quem precisa saber o que o produto é descobre na página de abertura dele, que abre com a
descrição em uma linha logo abaixo do título. **Se um dia passarem de seis produtos**, o desenho
a copiar é o painel do Atlassian, não a descrição de volta.

### 4. Trocar de produto tenta manter a página, e avisa quando não dá

É o coração da proposta e o que nenhuma das oito referências faz (ver `PESQUISA.md`).

- Existe a página equivalente no produto de destino? Vai para ela. Em `Selo do documento`,
  trocar de ENSPACE para Plugin do Word abre o `Selo do documento` do plugin.
- Não existe? Vai para `Primeiros passos` do produto **e aparece uma faixa** dizendo qual página
  ficou para trás, com o botão de voltar. Em `Selo do documento`, trocar para Beni App cai
  nisso.

A faixa fica acima do cabeçalho, no mesmo lugar onde o Nuxt põe o aviso de versão sem suporte,
e some sozinha na primeira navegação. É dispensável com o X.

### 5. O seletor escopa a documentação, e só ela

`DOCS` e a busca passam a ser do produto escolhido. `DEV`, `BLOG` e `RELEASES` continuam globais
e não mudam: a API é uma só, o blog é da empresa e as notas de versão hoje também. Ninguém perde
endereço (regra 20).

**Pergunta para a Mikaela:** as notas de versão deveriam ser por produto? Se o Plugin do Word
tem ciclo próprio, `RELEASES` seria o segundo lugar a respeitar o seletor. Não foi feito porque
é decisão de conteúdo, não de tela.

### 6. A busca diz em que produto busca

O botão passa a ler `Buscar em Plugin do Word`. É o que evita o pior efeito colateral de uma doc
multiproduto: a busca devolver três produtos misturados sem dizer de qual é cada resultado.
O atalho `Ctrl K` continua igual.

**O que ficou de fora e é o próximo passo natural:** a tela de resultados com um jeito de
ampliar a busca para todos os produtos ("buscar em todos"). Está fora do escopo desta demanda.

### 7. O produto entra no endereço

Desenho proposto, visível na barra de andaime:

```
docs.enspace.io/pt/docs/selo-do-documento          ENSPACE (sem prefixo)
docs.enspace.io/pt/docs/word/selo-do-documento     Plugin do Word
docs.enspace.io/pt/docs/beni/inicio                Beni App
```

O ENSPACE fica **sem prefixo** para os links de hoje continuarem valendo, sem redirecionamento e
sem quebrar o que já está indexado. É o mesmo motivo pelo qual o Nuxt deixou a versão no caminho.

### 8. Itens `checkbox` no menu, e não itens comuns

Leitor de tela anuncia "marcado" no produto em uso, que é exatamente a pergunta que o controle
responde. O tique fica à direita, longe do ícone do produto, como o ponto verde do GitHub Docs.
O selo `Beta` fica colado ao nome, e não na direita, para não disputar coluna com o tique.

### 9. A forma é badge, não campo de formulário

**Refeito na rodada 2.** A rodada 1 copiou a forma do seletor de idioma do site: altura
`h-7.25`, borda de 1px em preto puro, canto de `0.313rem`, rótulo em CAIXA ALTA e seta em ciano.
O resultado pesava mais que o logo ao lado e lia como campo de formulário.

A forma agora é a das sete documentações limpas da segunda passada (`PESQUISA.md`), e a mais
perto é a **nossa própria doc do SDK**:

| | Como ficou |
|---|---|
| Forma | Pílula (`rounded-full`), 24px de altura |
| Cor | Uma família só: `bg-primary/10`, anel `ring-primary/20`, texto e seta em primária |
| Contraste | `text-primary-700 dark:text-primary-300`, a correção da casa em `app/tema-contraste.ts`. O `text-primary` cru dá 2,96:1 sobre o próprio fundo a 10% e reprova |
| Texto | Caixa normal, peso médio, 12px |
| Seta | 12px, da cor do texto, a 70% de opacidade |
| Menu | Largura do conteúdo (mínimo 208px), linhas de 32px, ícone monocromático, item em uso em primária com tique em primária |
| Selo Beta | Anotação em 10px apagada, como o "(EOL)" do Nuxt. Não é etiqueta com fundo |

O menu continua **sólido**, e não de vidro como o de idioma: lista sobre conteúdo em movimento
precisa de fundo opaco. O que mudou é que agora a pílula fechada **não** imita mais o seletor de
idioma, e isso é o certo: um é badge de contexto, o outro é campo de escolha.

### 10. O que muda de nome com o idioma, e o que não muda

`ENSPACE` e `Beni App` são nome próprio e não se traduzem. `Plugin do Word` vira `Word Plugin` em
inglês e `Plugin de Word` em espanhol, porque a parte traduzível é a palavra "plugin" e a
preposição. Está nos três dicionários do `textos.ts`.

## O que é maquete

Declarado por inteiro, conforme a regra 10:

| O que | Como está |
|---|---|
| **Troca de produto** | **Funciona de verdade.** Menu, conteúdo, busca e aviso respondem |
| **Menu lateral** | **Funciona.** Abre e fecha seção, e navega entre as páginas escritas |
| **Sumário "Nesta página"** | **Funciona.** Rola até o título e acompanha a rolagem |
| **Tema e idioma** | **Funcionam**, tanto pelo andaime quanto pelos controles da própria barra |
| Busca | Maquete. O botão mostra o escopo e não abre painel de busca |
| Entrar, Docs, Dev, Blog, Releases | Maquete. São a casca, e levam a lugar nenhum |
| Copiar texto | Maquete. Mostra "Copiado!" e não copia nada |
| Endereço | Maquete. A barra de andaime mostra a URL proposta, mas a URL do protótipo não muda |
| Páginas do menu | Cinco páginas escritas por inteiro. As demais entradas do menu são rótulo, e abrem a página de início do produto |

## O mock e a regra 23

A regra manda tipar o `mocks.ts` pelo `@be-enlighten/enspace-sdk-schemas`. **Aqui não há schema
que sirva, e a ausência é correta:** o conteúdo do `docs.enspace.io` não vem da API do ENSPACE,
vem de arquivos markdown em `content/<idioma>/` lidos pelo Nuxt Content. Conferi os schemas
publicados no SDK e não existe nada de documentação, só entidades de API (`Workspace`, `Item`,
`Task`, `Agent`, `Field`).

Os tipos do `mocks.ts` são locais e estão comentados um a um com a origem. O que veio do produto
é a **estrutura**: a árvore de `content/en/1.docs` e os quatro status de página (`published`,
`updated`, `draft`, `deprecated`). Os valores são inventados.

## Autocrítica, antes de entregar

O que a própria revisão achou, incluindo o que eu escolhi não corrigir:

1. **O nome repetido no topo** (`ENSPACE` logo + `ENSPACE` no botão) é o ponto mais discutível
   da proposta. Mantido pelo motivo da decisão 2, mas é a primeira coisa a testar com gente.
   A alternativa seria o botão mostrar só o ícone quando o produto é o padrão, e isso esconde
   o controle de quem mais precisa dele.
2. **O seletor e o de idioma ficam em pontas opostas da mesma barra** com desenho parecido.
   Isso é proposital (são da mesma família), mas em telas entre 1024 e 1280 os dois ficam
   visualmente perto. No estreito o seletor de idioma some antes (`sm:flex`) e o de produto fica,
   que é a prioridade certa.
3. **Alvo de toque:** a pílula tem 24px de altura, exatamente o mínimo da WCAG 2.2 (2.5.8, nível
   AA), e longe dos 44px do critério AAA. A rodada 2 a deixou **menor** que a rodada 1, que tinha
   29px: é a escolha de forma, e ela troca folga de toque por leveza visual. No celular o alvo
   cresce, porque ali a pílula vira linha de 32px dentro do menu. Se ela achar o alvo pequeno
   demais no desktop, o conserto é subir para 28px sem mexer em mais nada.
4. **Um aviso que aparece sozinho.** A faixa de página sem equivalente surge sem a pessoa pedir.
   Está com `role="status"`, então o leitor de tela anuncia sem roubar o foco, e o foco continua
   no botão do seletor, que foi onde a pessoa clicou.
5. **O aviso de página sem equivalente usa cor de atenção** (`warning`). Considerei neutro, mas
   a faixa precisa ser notada antes da pessoa começar a ler a página errada.

## Acessibilidade: o que foi conferido

Pela skill `design:accessibility-review`, contra a WCAG 2.1 AA. **Nenhum achado crítico.**

### Contraste, medido

Medido de novo na rodada 2, já com a pílula.

| Elemento | Frente | Fundo | Razão | Exige | Passa |
|---|---|---|---|---|---|
| Pílula, tema claro | `primary-700` `#990080` | `primary/10` sobre branco | 6,7:1 | 4,5:1 | ✅ |
| Pílula, tema escuro | `primary-300` `#F49DD6` | `primary/15` sobre `#0E0916` | 8,8:1 | 4,5:1 | ✅ |
| Ícone e seta da pílula | herdam a cor do texto | idem | 6,7:1 e 8,8:1 | 3:1 | ✅ |
| Item em uso no menu, claro | `primary-700` | branco | 6,7:1 | 4,5:1 | ✅ |
| Item em uso no menu, escuro | `primary-300` | `#0E0916` | 8,8:1 | 4,5:1 | ✅ |
| Selo "Beta" | `text-dimmed` | fundo do menu | 4,6:1 no claro | 4,5:1 | ✅ |

**A armadilha, e ela pegou duas vezes:** `text-primary` cru é o fúcsia 500 `#FF04D1`, e sobre
branco dá **2,96:1**. Reprova como texto e reprova até como ícone. A cor certa em qualquer
superfície clara é `text-primary-700`, e no escuro `text-primary-300`, que é exatamente o que o
`app/tema-contraste.ts` deste repositório já faz com selo, aviso e botão. Quem copiar esta peça
para o `en-docs` precisa levar essa dupla junto.

### Teclado e leitor de tela

| O que | Como está |
|---|---|
| Abrir o menu | `Enter` ou `Espaço` no botão. `Escape` fecha e devolve o foco ao botão |
| Andar nos itens | Setas para cima e para baixo, `Home` e `End`, tudo do reka-ui |
| Foco visível | Contorno de 2px em primária, com 2px de afastamento, no `focus-visible` |
| Nome do botão | `aria-label` "Produto da documentação: ENSPACE. Trocar de produto.", que contém o rótulo visível (2.5.3 Label in Name) |
| Papel dos itens | `menuitemcheckbox` com `aria-checked`: o leitor anuncia qual produto está marcado |
| Aviso de troca | `role="status"`: anuncia sem roubar o foco |
| Página em uso no menu | `aria-current="page"` |
| Esqueletos de carregamento | `aria-hidden` no menu, `role="status"` com rótulo no conteúdo |
| Landmarks | Os dois `nav` têm rótulo: o lateral leva o nome do produto, o da direita "Nesta página" |

**O que ficou de fora:** teste com leitor de tela de verdade (NVDA, VoiceOver). A conferência
acima é de código e de contraste, e não substitui ouvir a tela.

## Rodadas

### Rodada 1 — 22/09/2026

**O que ela pediu:** o texto está no `BRIEFING.md`, literal.

**O que foi feito:** o seletor de produto colado à marca, com os três produtos, ENSPACE por
padrão; menu lateral, conteúdo e escopo de busca trocando junto; aviso de troca sem página
equivalente; e os seis estados da tela no andaime, incluindo "Como é hoje", que tira o seletor e
mostra a barra exatamente como ela está no ar.

**O que foi descartado, e por quê:**

- **Produto como link de seção na barra** (desenho do Twenty). Descartado: sete itens no topo e
  a mistura entre o que é seção e o que é produto.
- **Produto como seção da árvore da esquerda** (desenho do Notion e do Microsoft Learn).
  Descartado: é o estado de hoje levado adiante, e quem chega por busca não vê em qual produto
  caiu.
- **Painel largo com cartões** (desenho do Atlassian). Descartado por ora: cerimônia demais para
  três produtos. Guardado para quando passarem de seis.
- **Desabilitar `DEV` nos produtos sem API.** Descartado: tira endereço de quem já sabia o
  caminho (regra 20). O `DEV` continua global.

### Rodada 2 — 22/09/2026

**O que ela pediu, literal:**

> ta grosseir0o visualmente. feio. uma outra doc nossa tem um modelo mais ou menos como esse do
> print e ja é bbem melhor . o badge que o nuxt ui docs usa tambem é bem mais clean. ta horrivel
> como ta hoje. busque referencias de mercado de documentaçoes de software e veja como essa chave
> ou pra versao ou pra produto é feita esteticamente, visando melhoria de ui/ux, e ai corrija a
> sua proposta

Com o print da doc do SDK (`localhost:3000/vue/start`): a pílula "Vue" colada ao "SDK" e o menu
de `Schemas`, `Core`, `Vue`, `UI`, `Beni Avatar`.

**O que mudou:** só a forma. O comportamento da rodada 1 continua igual, inclusive o aviso de
página sem equivalente, que é o miolo da proposta.

| | Rodada 1 | Rodada 2 |
|---|---|---|
| Forma | Caixa de 29px, canto de 5px | Pílula de 24px |
| Borda | 1px preto puro | Anel de 1px em `primary/20` |
| Fundo | `white/25` | `primary/10` |
| Texto | CAIXA ALTA, semibold, 13px, cinza escuro | Caixa normal, medium, 12px, `primary-700` |
| Seta | Ciano de 16px, terceira cor | 12px, da cor do texto, a 70% |
| Menu | 336px de largura, duas linhas por item, título no topo | Largura do conteúdo, uma linha por item, sem título |
| Selo Beta | Etiqueta com fundo e anel | Anotação de 10px apagada |
| Item em uso | Tique neutro | Nome e tique em primária |

**De onde veio cada escolha:** a segunda metade do `PESQUISA.md`, com dez documentações olhadas
só pela forma. A referência mais próxima é a nossa, a doc do SDK; a fórmula de cor é a do Nuxt UI;
o painel curto com ícone monocromático é o do Supabase.

**O que foi descartado nesta rodada:**

- **Pílula cinza, à la Tailwind.** Fica limpa demais: com três produtos que a pessoa talvez não
  conheça, o controle precisa de um pouco de cor para ser achado.
- **Repetir o produto como cabeçalho do menu lateral, à la Supabase.** Redundante quando a pílula
  já está colada à marca. Eles precisam disso porque o controle deles vive escondido numa barra
  de menus.
- **Caixa de largura cheia no topo do menu lateral, à la Sentry.** É o desenho para dezenas de
  itens com busca. Com três, pesa mais que a árvore inteira.
- **Tirar o ícone da pílula**, como fazem o Nuxt UI e o Tailwind. Mantido nesta rodada porque
  sustentava o estado só-ícone do celular. **Revertido na rodada 3**, a pedido dela.

### Rodada 3 — 22/09/2026

**O que ela pediu, literal:** *"nao precisa de icone no dropdown do topo"*.

**O que mudou:** a pílula ficou com o nome e a seta, e mais nada. É o desenho do Nuxt UI e do
Tailwind, que também não têm ícone no controle fechado.

**O ícone continua no menu**, onde ele faz o trabalho de diferenciar um produto do outro. Se for
para sair de lá também, é uma linha.

**A consequência, e ela foi medida:** o ícone era o que segurava o celular. Sem ele, abaixo de
`sm` a pílula mostra o nome e corta o que não cabe: a 380px, `Plugin do Word` vira
`Plugin do …`, com 12px de folga até a chave de tema e sem encostar nela. O nome por extenso
continua em três lugares: no `title`, no `aria-label` e na mesma peça em linha cheia dentro do
menu do hambúrguer. A pílula encolhe por `min-w-0` no flex, não por medida fixa, então o corte
acontece só quando falta espaço de verdade.

**Se o corte incomodar**, o conserto é voltar o ícone **só** abaixo de `sm`: some o nome, fica a
marca do produto, e nada corta. Ficou fora porque contraria o pedido ao pé da letra.

### Rodada 4 — 22/09/2026

**O que ela pediu, em duas mensagens:**

> pode ja fazer mais uma opçao no dropdown, a ultima, sendo "sdk", mas em vez de mudar na propria
> doc, é um botao com seta de link pra fora, mostrando na direita do botao.
>
> mas ele por enquanto vai estar bloqueado com reloginho de coming soon ok?

> nao é pra ter icone aqui no dropdown tb, ok? ajuste isso antes do push

#### O SDK entrou como destino, não como produto

A doc do SDK é um site próprio. Ela responde à mesma pergunta que o menu faz ("de qual produto é
a documentação?"), então mora no mesmo menu. Mas ela **não troca o conteúdo desta página: leva
embora**, e isso precisa estar dito antes do clique, não depois.

Três coisas dizem isso:

1. **Grupo separado**, com linha divisória acima. É o desenho do Supabase, que separa os produtos
   dos módulos dentro do mesmo painel.
2. **Fica por último**, como ela pediu, que é também onde o olho espera o item que sai do fluxo.
3. **Seta de link externo à direita**, no lugar onde os outros itens têm o tique. Um item, um
   sinal, sempre na mesma coluna.

No código isso é uma lista à parte no `mocks.ts` (`destinosExternos`), e não um quarto produto:
assim ninguém consegue selecioná-lo por engano como se fosse contexto desta doc.

#### Bloqueado, por enquanto

Enquanto `emBreve` for verdadeiro, o item **não navega, não tem endereço e não fica selecionável**,
e o relógio ocupa o lugar da seta. Um sinal por item: mostrar seta e relógio juntos faria a pessoa
ler duas coisas para entender uma. Quando o site publicar, basta virar a chave no `mocks.ts` e a
seta volta.

Quem usa leitor de tela não enxerga nem relógio nem seta, então o texto ("Em breve" / "Coming
soon" / "Muy pronto") está lá em `sr-only`, dentro do mesmo item.

**Pergunta para a Mikaela:** **qual vai ser o endereço da doc do SDK?** O campo `url` está vazio
de propósito. O site roda local em `/vue/start`, mas não sei onde ele publica.

#### E os ícones saíram do menu também

A rodada 3 tinha tirado o ícone da pílula e mantido os do menu. Ela pediu para tirar de lá
também, e o resultado é o Nuxt UI puro: **nenhum ícone decorativo**. Com três nomes curtos, o
ícone não desempata nada e põe uma coluna a mais para o olho atravessar.

O que sobrou no menu é só sinal que diz alguma coisa: **o tique** do produto em uso, **o selo
Beta** e **o relógio ou a seta** do item que sai daqui. O menu lateral da doc continua com os
ícones dele, que são casca copiada do site e não entram nesta conta.

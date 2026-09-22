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

### 3. Cada item do menu leva uma linha de descrição

**Divergência consciente do Nuxt e do GitHub Docs, que não descrevem os itens.** Versão e plano
se explicam sozinhos; nome de produto não. "Beni App" não diz a ninguém que é o assistente, e
quem não sabe não escolhe. O Monday chegou à mesma conclusão nos cartões de produto.

Custo: o menu fica com 80 de altura por item em vez de 32. Com três produtos, cabe.
**Se um dia passarem de seis, a descrição sai e vira painel**, no desenho do Atlassian.

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

### 9. O menu do seletor é sólido, e não de vidro como o de idioma

O seletor de idioma do site usa fundo translúcido com `backdrop-blur`. Ali são três palavras
curtas e funciona. Um menu com descrição de duas linhas sobre conteúdo em movimento fica ilegível,
então este usa o fundo sólido padrão do Nuxt UI. O **botão fechado**, esse sim, segue o desenho
do de idioma: mesma altura `h-7.25`, mesmo canto `0.313rem`, mesma seta em ciano no claro e
fúcsia no escuro.

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
3. **Alvo de toque:** o botão tem 29px de altura (`h-7.25`). Passa o mínimo de 24px da WCAG 2.2
   (2.5.8, nível AA) e **não** chega aos 44px do critério AAA. É a altura dos outros controles da
   barra, e mudar só este quebraria o alinhamento. Achado da casca, não correção de passagem
   (regra 37): se for para crescer, crescem os quatro juntos, no `en-docs`.
4. **Um aviso que aparece sozinho.** A faixa de página sem equivalente surge sem a pessoa pedir.
   Está com `role="status"`, então o leitor de tela anuncia sem roubar o foco, e o foco continua
   no botão do seletor, que foi onde a pessoa clicou.
5. **O aviso de página sem equivalente usa cor de atenção** (`warning`). Considerei neutro, mas
   a faixa precisa ser notada antes da pessoa começar a ler a página errada.

## Acessibilidade: o que foi conferido

Pela skill `design:accessibility-review`, contra a WCAG 2.1 AA. **Nenhum achado crítico.**

### Contraste, medido

| Elemento | Frente | Fundo | Razão | Exige | Passa |
|---|---|---|---|---|---|
| Nome do produto, tema claro | `#1E293B` | branco do vidro | 14,6:1 | 4,5:1 | ✅ |
| Nome do produto, tema escuro | `#D9D9D9` | `#0E0916` | 13,9:1 | 4,5:1 | ✅ |
| Chevron, tema claro | ciano `#0D58CE` | branco do vidro | 6,2:1 | 3:1 | ✅ |
| Chevron, tema escuro | fúcsia `#FF04D1` | `#0E0916` | 5,8:1 | 3:1 | ✅ |
| Descrição do item, claro | `text-muted` `#736F8F` | branco | 4,8:1 | 4,5:1 | ✅ |
| Descrição do item, escuro | `text-muted` `#9591AC` | `#0E0916` | 6,5:1 | 4,5:1 | ✅ |

A descrição no tema claro é a mais apertada da tela: 4,8:1 contra 4,5:1 exigidos, em 12px.
Passa, mas é onde uma mudança de cor do tema quebraria primeiro.

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

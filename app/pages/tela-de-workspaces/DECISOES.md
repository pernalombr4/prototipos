# Decisões — Tela de entrada (Workspaces)

## A proposta em uma frase

A tela passa a **afirmar o que é** e a **ordenar por uso**, `Entrar` vira a ação primária,
`Criar workspace` desce para o rodapé com a consequência escrita — e o caminho de criação
começa perguntando a intenção, para devolver quem se enganou.

## Telas

| Rota | O que mostra |
|---|---|
| `/tela-de-workspaces` | Tudo: a tela de entrada, os cinco estados e a criação em camada |

Uma rota só, de propósito. No produto, escolher e criar acontecem na mesma tela — então no
protótipo também (rodada 2).

---

## As sete decisões, e por que cada uma

### 1. A tela ganha título e explicação

**"Escolha um workspace para entrar"** como `h1`, e abaixo: *"Workspace é o espaço da sua
empresa dentro do ENSPACE. Seu trabalho acontece dentro de um deles — esta tela só escolhe por
qual porta entrar."*

Hoje não existe `h1` nenhum (Briefing, trava #1). Sem rótulo, a pessoa projeta a intenção que
trouxe. A frase faz duas coisas de uma vez: define a palavra "workspace" e diz que esta tela
não executa nada, só escolhe.

### 2. Três exemplos do que se faz lá dentro

"Abrir e acompanhar chamados · Ver suas tarefas e prazos · Consultar dados e documentos".

É o que liga a tela ao que a empresa mandou a pessoa fazer. Quem veio abrir chamado lê
"abrir chamado" associado a **entrar**, não a criar.

### 3. "Continue de onde você parou" — a entrada de um clique

Um bloco destacado com o último workspace usado e um botão grande **"Entrar em Grupo Aurora"**,
com o nome dentro do rótulo.

É o atalho que resolve a esmagadora maioria das entradas, e é o que monday e Notion fazem
automaticamente (Pesquisa, padrão 1). Quando a pessoa tem um workspace só — o caso exato da
demanda — o bloco muda o rótulo para **"Seu workspace"** e a tela inteira vira uma porta só.

### 4. A lista deixa de ser grade de cards vazios

Vira lista em linhas, ordenada por uso recente, e cada linha diz algo: descrição **ou** número
de pessoas, mais "Você esteve aqui há 2 dias". `Sem descrição` desaparece.

Dezesseis cards grandes dizendo "Sem descrição" (trava #4) gastam a tela inteira sem informar.
Em linha, cabem mais, comparam-se melhor, e a mais provável fica em cima.

### 5. Convite pendente vira ação

Sai do card borrado e vira um aviso no topo: *"Rodrigo Petrone convidou você para Lumen
Contábil"*, com **Aceitar convite** e **Recusar**.

O que mais precisava de ação era o que menos parecia acionável (trava #6).

### 6. `Criar workspace` desce e passa a explicar a consequência

Vai do canto superior direito para o rodapé, depois de um separador, em botão `outline`, com o
texto: *"Criar um workspace abre um espaço **vazio**, com membros e configuração próprios.
**Não é aqui que se abre chamado** — para isso, entre no workspace da sua empresa."*

É a correção mais direta do erro relatado (trava #2) e o que os cinco de referência já fazem
(Pesquisa, padrão 2). A frase nomeia o engano em vez de torcer para que não aconteça.

### 7. A criação começa perguntando a intenção

`/criar` abre com **"O que você quer fazer?"** e duas escolhas: *"Abrir um chamado, pedir algo
ou enviar um documento"* ou *"Criar um espaço novo, vazio, para a minha equipe"*. Quem escolhe
a primeira é levado de volta com a explicação — e ainda pode insistir, se for mesmo o caso.

No formulário, um detector: se o Nome parecer assunto de chamado ("preciso", "solicito",
"acesso", "urgente", "férias"…), aparece o aviso *"Isso parece o assunto de um chamado, não o
nome de um espaço"*. E uma prévia mostra como o espaço vai aparecer na lista depois de criado.

**Nenhum dos oito produtos pesquisados faz isso** (Pesquisa, "o que nenhum deles faz"). Todos
apenas escondem o botão; se a pessoa achar, criam. Este é o pedaço original da proposta.

---

## A recomendação maior, que não cabe numa tela

**A melhor versão dessa tela é não existir.** monday, Notion e ClickUp levam direto ao último
espaço usado. Se o ENSPACE entrasse direto no último workspace — com o seletor virando um
*switcher* no topo —, a confusão relatada desapareceria por construção, porque a tela onde o
erro acontece deixaria de ser a porta de entrada.

Fica como recomendação de produto, não como protótipo: muda roteamento e sessão, não layout.
O protótipo entregue é a melhoria da tela **mantendo** a arquitetura atual.

---

## O que é maquete

Declarado conforme a regra 10. Nesta tela **não funciona de verdade**:

- **`Entrar`** — mostra um toast e não navega. Não existe "dentro do workspace" para ir.
- **Aceitar / Recusar convite** — muda a lista em memória; recarregar volta tudo.
- **`Criar workspace`** no fim do formulário — toast de sucesso, não cria nada.
- **Favoritar** — alterna e a aba Favoritos responde, mas some ao recarregar.
- **Barra superior** (ENSPACE, Suporte, avatar) — casca, só para dar contexto à tela.
- **Seletor de estados no rodapé** — andaime de protótipo, não é proposta de produto.

**Funciona de verdade** (é o que a proposta depende): busca, abas Todos/Favoritos/Recentes,
alternador card/lista, favoritar, ordenação por uso, a troca dos cinco estados, o desvio de
intenção dentro do modal, o preenchimento automático da referência, o detector de
nome-de-chamado, a prévia do card e todas as transições.

## Autocrítica

Rodada antes de entregar, e o que ficou de fora:

- **O texto explicativo é longo.** Três linhas no topo de uma tela que a pessoa vê todo dia
  viram ruído no quinto acesso. Uma versão futura deveria encolher depois da primeira semana —
  não implementei porque exigiria persistência, e protótipo aqui é 100% front-end.
- **"Não é aqui que se abre chamado" é uma negação.** Copy boa evita negar. Mantive porque o
  erro relatado é específico e caro, e nomear o engano funciona melhor que insinuá-lo. Vale
  testar a variante positiva: *"Para abrir chamado, entre no workspace da sua empresa."*
- **O detector de intenção erra.** Uma equipe chamada "Acesso e Identidade" dispara o aviso. É
  aviso, não bloqueio, e falso positivo custa uma linha lida — aceitei o custo.
- **Não testei com leitor de tela.** Contraste e foco seguem os tokens do Nuxt UI, mas a
  ordem de leitura do bloco "Continue de onde você parou" merece verificação.
- **Não implementei o estado "sem permissão"**, previsto na Fase 4. Não encontrei no develop
  uma tela de workspace sem permissão para usar de base, e inventar o comportamento seria
  desenhar regra de produto que não observei.

---

## Iterações

### Rodada 2 — 16/09/2026

**Pedido:** *"nao ta legal ter que clicar em 2 botoes diferentes no mesmo card (…) isso tem que
ser jornada unica (…) o botao de atalho pra criar um novo tem que continuar no topo (…) seu
prototipo ta mal elaborado. sem usar animaçoes nem nada (…) voce mudou a aparencia de cards
pra lista. nao pode mudar. se for pra ser lista, daí tem que adicionar botao pra alternar."*

**O que mudou:**

1. **Uma porta só.** A rota `/criar` foi apagada. A criação virou **camada sobre a própria
   tela**, com os mesmos três passos — intenção → desvio → formulário. No produto isso é um
   modal sobre a lista; agora o protótipo também é. E o índice da raiz passou a ter um card
   com **um** link por protótipo.
2. **O atalho de criar voltou para o topo.** Fica no canto superior direito, onde sempre
   esteve. O que mudou é o **peso**, não o endereço: `outline` neutro em vez de sólido, então
   o destaque visual da tela continua sendo "Entrar em …". Ganhou tooltip — *"Abre um espaço
   vazio. Não é aqui que se abre chamado."* A desambiguação forte segue no modal.
3. **Card voltou a ser o padrão**, com **alternador card / lista** ao lado da busca. A lista
   continua existindo porque é melhor para comparar muitos workspaces — mas como escolha de
   quem usa, não como troca imposta por mim.
4. **Movimento.** Entrada dos cards em cascata, hover que levanta o card e acende ícone e
   botão, `TransitionGroup` ao filtrar, buscar e trocar de visualização, `loading` no botão
   que foi clicado, transição entre os passos do modal, e o convite saindo ao ser aceito.
   Tudo sob `prefers-reduced-motion`.
5. **Favoritar virou ação de verdade** — a estrela aparece no hover do card e alterna, e a aba
   Favoritos responde na hora. Na rodada 1 era só indicador.

**O que aprendi, e virou regra:** as quatro correções entraram como regras 14 a 17 da Parte 6
da spec e estão repetidas no `CLAUDE.md`. As duas que mais doem: *não trocar a forma que o
produto já usa sem oferecer a volta*, e *ação do topo continua no topo — rebaixa-se o peso,
nunca o endereço*.

### Rodada 1 — 16/09/2026

**Pedido:** a demanda original (Briefing, seção 1).
**Entregue:** as duas telas, os cinco estados, os sete pontos acima.
**Descartado:** reproduzir a tela atual lado a lado como comparativo — a evidência do estado
atual já está no Briefing, e manter duas versões vivas dobra o custo de cada iteração.

# Pesquisa — como o mercado resolve tela de configuração

Cinco referências obrigatórias e três escolhidas pela natureza do problema. O problema aqui é
duplo: **organizar cinco assuntos diferentes atrás de uma navegação só** e **fazer cada um deles
render trabalho** (traduzir em volume, agendar e-mail, ler saldo).

> **Sobre a evidência desta fase.** As telas de configuração dos cinco obrigatórios estão atrás
> de login e de conta paga; o que li foi a **documentação pública** de cada produto, que é onde
> eles descrevem e ilustram o próprio comportamento. Por isso **não há print de referência em
> `evidencias/`** — cada entrada abaixo traz a URL exata do que foi lido. Declarado aqui em vez
> de fingido.

---

## 1. Notion — obrigatória

**Como resolve, em passos:**

1. Configuração abre num painel com **navegação à esquerda**, agrupada por escopo: o que é da
   conta da pessoa em cima, o que é do workspace embaixo (General, Identity, People, Billing).
2. Cada seção é uma página com endereço próprio dentro do painel.
3. No topo da navegação há uma **busca de configuração**: digitar "export" ou "domain" leva à
   página certa e **destaca por um instante a configuração encontrada**.

**URL:** <https://www.notion.com/help/workspace-settings>

**O que serve:** a busca que atravessa as seções é a resposta mais direta a "não consigo me
encontrar" — e o destaque momentâneo resolve o segundo problema, que é achar a linha certa
dentro de uma página longa. O agrupamento por escopo (conta × workspace) é o que falta na linha
de abas do ENSPACE, onde Cobrança é da pessoa e as outras quatro são do workspace.

**O que não serve:** trocar a linha de abas por um menu lateral. O ENSPACE já ensinou a forma
"abas no topo" (regra 15) e a tela de configuração não é lugar de reaprender navegação.

---

## 2. Twenty CRM — obrigatória (código aberto)

**Como resolve, em passos:**

1. Settings é uma **rota de verdade** — `/settings/<seção>` —, com menu à esquerda dividido em
   User, Workspace e Developers.
2. Cada seção é um link: dá para mandar o endereço de uma configuração para outra pessoa.
3. Voltar do navegador volta uma seção, não a tela inteira.

**URL:** <https://docs.twenty.com/developers/self-host/capabilities/setup> · repositório
`twentyhq/twenty`

**O que serve:** a confirmação de que **endereço por seção é o padrão**, e que ele resolve três
coisas de uma vez — link direto, botão voltar e recarregar na mesma seção. É exatamente a
S3-F6 do ENSPACE, onde as cinco abas dividem uma URL só.

**O que não serve:** a granularidade. Twenty tem dezenas de seções e precisa da árvore; o
ENSPACE tem cinco e não precisa.

---

## 3. ClickUp — obrigatória

**Como resolve, em passos:**

1. As notificações são configuradas por **tipo de evento** (atribuição, menção, mudança de
   status, prazo alterado, tarefa atrasada), cada um com o seu canal.
2. Para prazo, o produto envia lembrete **um período antes da data**, e esse período se escolhe
   numa lista — nunca se digita.
3. Automação é montada como **gatilho → condição → ação**.

**URL:** <https://help.clickup.com/hc/en-us/articles/6325918957335-Notification-settings> ·
<https://help.clickup.com/hc/en-us/articles/6326047586199-Intro-to-reminders>

**O que serve:** "um período antes da data", escolhido de uma lista, é a tradução exata do
`-1` do ENSPACE. A direção nunca é responsabilidade de quem digita.

**O que não serve:** a granularidade por tipo de evento é um produto inteiro; a demanda aqui é
sobre prazo de tarefa, que é o que a aba faz hoje.

---

## 4. monday.com — obrigatória

**Como resolve, em passos:**

1. A automação é uma **receita escrita como frase**: "Quando [gatilho], então [ação]".
2. Os pedaços variáveis da frase são os campos — clicar em "data" abre a lista de datas, clicar
   em "alguém" abre a lista de pessoas. A frase continua legível o tempo todo.
3. O Centro de Automações tem um **menu por assunto** à esquerda (Due date, Status, Recurring),
   e cada assunto mostra as receitas prontas antes de oferecer a customizada.

**URL:** <https://support.monday.com/hc/en-us/articles/360000227739-Alerts-and-Reminders-with-Automations>
· <https://support.monday.com/hc/en-us/articles/31585338491922-New-Automation-Builder>

**O que serve:** **a regra como frase é a peça central da proposta para Notificações.** Quem lê
a lista de regras lê português, não `-1 / Dia(s) / modelo 7`. E "receita pronta antes da
customizada" é a resposta para a tela que hoje abre vazia com um "Adicionar" solto.

**O que não serve:** o vocabulário de "receita" e a loja de automações — o ENSPACE aqui tem um
escopo pequeno e fechado (prazo de tarefa), e importar a metáfora inteira confundiria.

---

## 5. Pipefy — obrigatória

**Como resolve, em passos:**

1. O painel administrativo separa **Membros & Permissões**, **Convites sugeridos** e
   **Estatísticas de uso** — o uso fica ao lado da administração, não escondido no financeiro.
2. A aba de **cobrança** mostra o plano com custo, número de usuários e **data de renovação** na
   mesma tela do valor.

**URL:** <https://help.pipefy.com/en/articles/9532592-admin-panel-alpha> ·
<https://help.pipefy.com/en/articles/6495914-access-and-manage-billing-information>

**O que serve:** cobrança que responde "quanto, por quem e até quando" na primeira dobra. É o
mínimo que falta na Carteira do ENSPACE, que hoje mostra só o saldo.

**O que não serve:** o modelo por assento; o ENSPACE cobra por consumo, e consumo pede ritmo e
projeção, não renovação.

---

## 6. Crowdin — extra, pelo problema dos Dicionários

**Como resolve, em passos:**

1. O editor filtra por **status da string**: não traduzida, traduzida, aprovada, igual à origem,
   origem modificada.
2. Existe a ordenação **"não traduzidas primeiro"**, que mantém tudo visível mas empurra o que
   falta para o topo.
3. O progresso aparece **por arquivo e por pasta**, não só no total.
4. A origem fica sempre ao lado da tradução, com contexto e comentário.

**URL:** <https://support.crowdin.com/online-editor/> · <https://support.crowdin.com/string-management/>

**O que serve:** as três peças que faltam na aba de Dicionários quando o volume cresce —
**filtro por status**, **progresso por nó** (que o ENSPACE já tem, e é bom) e **navegação
sequencial** pelo que falta. Com 3.651 chaves, trabalhar é percorrer uma fila, não caçar numa
árvore.

**O que não serve:** o vocabulário de tradução profissional (aprovação, memória, glossário, QA).
Quem traduz no ENSPACE é a pessoa que configurou o workspace, não um tradutor.

---

## 7. Stripe — extra, pelo problema da Cobrança

**Como resolve, em passos:**

1. O crédito tem um **razão** (ledger): toda concessão e todo consumo viram linha, e a coluna
   "disponível" é o saldo derivado daquilo.
2. O painel de uso mostra **consumo ao longo do tempo** e não só o número de agora.
3. Há **alerta configurável** de saldo e de gasto, para a pessoa chegar antes do fim.

**URL:** <https://docs.stripe.com/billing/subscriptions/usage-based/billing-credits/implementation-guide>
· <https://stripe.com/blog/introducing-credits-for-usage-based-billing>

**O que serve:** a ideia de que **saldo sem ritmo não informa nada**. "2801 en-credits" não
responde a pergunta que a pessoa tem, que é "isso dura até quando". Ritmo + projeção + alerta é
o conjunto mínimo.

**O que não serve:** a conversão em dinheiro. Quanto vale um en-credit é decisão comercial e não
cabe ao protótipo inventar — o que cabe é **definir a unidade** e mostrar o consumo.

---

## 8. Linear — extra, pelo problema de achar e pelo teclado

**Como resolve, em passos:**

1. `G` `S` vai para as configurações; `Cmd/Ctrl + K` abre o menu de comandos e qualquer seção se
   alcança digitando o nome.
2. `?` abre a lista de atalhos da tela em que se está.
3. Toda página de configuração tem endereço próprio.

**URL:** <https://linear.app/docs/editor> ·
<https://linear.app/changelog/2021-03-25-keyboard-shortcuts-help>

**O que serve:** o princípio de que **navegar por teclado não é acessibilidade extra, é a rota
rápida de quem usa todo dia** — e é o que hoje não existe na linha de abas do ENSPACE (S3-F6,
P0 para teclado).

**O que não serve:** o vocabulário de atalho de duas teclas; o ENSPACE não tem essa cultura e
introduzir `G S` aqui seria resolver na tela B um problema da tela A (regra 19).

---

## Rodada 4 — identidade como perfil

Pesquisa extra, pedida na rodada 4: "esse bloco não poderia ter mais cara de perfil, numa ordem
de hierarquia que o pessoal já está acostumado em sistemas como HubSpot?".

**Slack** edita um bloco único chamado **"Name, domain, and icon"** — os três juntos, na mesma
caixa. <https://slack.com/help/articles/201663443-Change-your-workspace-or-org-name-and-URL>

**Linear** descreve a configuração geral como **"workspace logo, name, and URL"**, nessa ordem.
<https://linear.app/docs/workspaces>

**Notion**, em Settings › Workspace › General: **Name**, **Icon**, **Domain**. E o ícone é o
próprio controle: clica-se nele para trocar, sem um campo separado dizendo o tipo.
<https://www.notion.com/help/workspace-settings>

**HubSpot** separa duas coisas que aqui estavam no mesmo cartão: **Company Information** (nome,
domínio, endereço, indústria) e **Account Defaults** (idioma, fuso, moeda).
<https://knowledge.hubspot.com/account-management/update-your-account-name-and-company-information>

**O que os quatro fazem igual:**

1. **Identidade é logo + nome + identificador**, juntos e nessa vizinhança. Nenhum deles espalha
   o logo para o fim do formulário, que era o caso aqui.
2. **O logo é o primeiro elemento, e ele mesmo é o controle** — clicar no símbolo é o caminho de
   trocá-lo.
3. **Idioma não mora na identidade.** É preferência, e vive em outro grupo (ou é preferência da
   pessoa, não do workspace).

**O que não serve:** o vocabulário de empresa do HubSpot (endereço, indústria, receita). Um
workspace do ENSPACE não é uma empresa; é um espaço de trabalho dentro dela.

---

## Rodada 5 — traduzir 14 mil chaves

Pesquisa pedida na rodada 5: "tenho um workspace hoje que chega a ter 14 mil chaves. no seu
modelo atual, sem nada colapsado, é insano, seria um scroll infinito. como outros produtos
resolvem?".

### Crowdin

1. A pessoa **não abre o projeto inteiro**: o editor tem um **painel lateral de arquivos**
   (Ctrl+[ mostra e esconde) e se trabalha **arquivo por arquivo**. "All Strings", que mostra
   tudo, é um botão explícito, não o estado inicial.
2. O filtro de status tem uma opção que é quase uma fila: **"All, Untranslated First"** — nada
   some, o que falta sobe.
3. O modo lado a lado divide a tela em **lista à esquerda, string atual no centro, contexto à
   direita**.
4. **50 strings por página** no modo multilíngue: paginação explícita, não rolagem infinita.
5. Existe **"Automatically move to next string"**: ao salvar, o editor já vai para a próxima.

<https://support.crowdin.com/online-editor/>

### Weblate

1. Ao abrir um componente, o que se vê são **links que fatiam o trabalho**: não traduzidas,
   inacabadas, com erro. Você escolhe a fatia; não existe "abra as 14 mil".
2. **A busca vira a fila de trabalho**: você pesquisa e depois anda pelos resultados com o
   teclado.
3. **Zen mode**: um editor que "remove elementos adicionais da interface, como Strings Próximas
   ou o Glossário". Sobra traduzir.
4. Atalhos de navegação na fila: `Alt+Home` e `Alt+End` (primeira e última do resultado atual),
   `Alt+PageUp` / `Alt+PageDown` (anterior e próxima), `←` e `→` entre strings, `?` para ver os
   atalhos.

<https://docs.weblate.org/en/latest/user/translating.html>

### Lokalise

1. **Ações em massa a partir da seleção**: marcou chaves, aparece a barra com o que dá para
   fazer com todas de uma vez.
2. **Filtros salvos e compartilhados** com o resto do time: o recorte vira um lugar ao qual se
   volta.
3. **Paginação por cursor acima de 5 mil chaves**, porque paginação por deslocamento fica lenta
   nesse tamanho. E operações em lote de 500 por requisição.

<https://docs.lokalise.com/en/articles/2089277-project-editor> ·
<https://docs.lokalise.com/en/articles/2074190-bulk-actions>

### O que os três fazem igual, e é a resposta

1. **Ninguém renderiza o conjunto inteiro.** Navega-se por container (arquivo, componente,
   pasta) e só a fatia escolhida vira lista.
2. **A lista é paginada em dezenas**, não rolada em milhares.
3. **O filtro por status é o começo do trabalho**, não um refinamento opcional.
4. **Existe um modo de fila**: uma string por vez, teclado, avanço automático ao salvar. É o que
   torna 14 mil um trabalho possível, porque ninguém precisa *ver* 14 mil, só atravessá-las.
5. **Ação em massa sobre o filtro**, para o que dá para resolver sem olhar uma a uma.

---

## O padrão que todos seguem

Os cinco obrigatórios fazem igual nestes quatro pontos — divergir aqui custa aprendizado e
precisa de motivo escrito:

1. **Cada seção de configuração tem endereço próprio.** Link direto, voltar e recarregar
   funcionam. Nenhum deles empilha cinco telas numa URL só.
2. **Há busca dentro das configurações**, e ela atravessa as seções.
3. **Regra de tempo é escrita como frase** e escolhida em lista. Nenhum deles pede um número com
   sinal para dizer "antes" ou "depois".
4. **Uma convenção de gravação por tela.** Ou salva ao editar, ou uma barra única de pendência.
   Nenhum deles põe três botões "Salvar" na mesma rolagem.

## O que nenhum deles faz

E é aqui que o ENSPACE pode ficar melhor, não apenas igual:

1. **Nenhum liga a seção de configuração ao artigo que a explica.** O link para o help center é
   sempre global — rodapé, menu de ajuda, busca separada. O ENSPACE **já tem a documentação
   escrita aba por aba** (`/workspace/settings/system/...`, uma página por aba, mais a de
   Módulos e a de Chancela). Ligar as duas é barato, é o sexto pedido da demanda e é a única
   parte desta proposta que o produto já pagou e não está usando.

2. **Nenhum mostra o efeito da configuração sobre o dado que já existe, antes de gravar.**
   "Sincronizar Feriados" é o caso perfeito: em vez de um toast dizendo "sincronizado", dá para
   mostrar *quais* feriados entram, de qual país, e quantos dias da Agenda eles marcam — e
   deixar remover depois. A prévia antes de gravar é o antídoto do clique sem volta.

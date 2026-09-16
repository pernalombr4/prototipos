# Pesquisa — telas de entrada e escolha de espaço

**Pergunta da pesquisa:** como os produtos de gestão resolvem a primeira tela depois do login,
quando a pessoa pertence a mais de um espaço — e como impedem que ela confunda "criar um
espaço" com "pedir alguma coisa".

**Limitação declarada:** as referências foram estudadas pela documentação oficial de cada
produto, não por dentro do produto. Estudar por dentro exigiria conta paga em cinco
plataformas. Não há prints em `evidencias/`; cada afirmação abaixo tem a URL que a sustenta.

---

## Os cinco obrigatórios

### 1. Notion

**Como resolve:** não existe tela de escolha depois do login — você cai direto no último
workspace usado. A troca fica num **switcher**, ao clicar no nome do workspace atual no canto
superior esquerdo. Criar é uma opção *dentro* desse menu ("Join or create workspace"), e na
tela que abre é preciso **passar pela lista dos workspaces existentes** para só então
encontrar "Create workspace".

**O que serve:** a criação fica fisicamente depois da lista. A ordem da tela ensina a ordem da
decisão: primeiro veja onde você já está, depois pense em criar.
**O que não serve:** o auto-join por domínio de e-mail pressupõe domínio corporativo
verificado.
🔗 https://www.notion.com/help/create-delete-and-switch-workspaces · https://www.notion.com/help/intro-to-workspaces

### 2. Twenty CRM

**Como resolve:** workspace é resolvido pelo **subdomínio** — cada workspace tem o seu, e o
login leva direto para dentro dele. A escolha acontece antes de autenticar, pela URL, não por
uma tela de cards.

**O que serve:** confirma que "escolher espaço" não precisa ser uma tela; pode ser um endereço.
**O que não serve:** o ENSPACE já tem vários workspaces sob o mesmo domínio; mudar isso é
arquitetura, não tela.
🔗 https://twenty.com/developers/section/self-hosting

### 3. ClickUp

**Como resolve:** o login leva para dentro do Workspace. O seletor é um avatar no canto da
barra lateral. A própria documentação recomenda a quem está começando **manter tudo num único
Workspace** e separar por Spaces.

**O que serve:** o fabricante trata "vários workspaces" como caso avançado. Uma tela que exibe
18 espaços em pé de igualdade está otimizando para o caso raro.
**O que não serve:** a hierarquia Workspace→Space→Folder→List é mais profunda que a do ENSPACE.
🔗 https://help.clickup.com/hc/en-us/articles/6310502590487-Create-a-new-Workspace · https://help.clickup.com/hc/en-us/articles/6309466958103-Intro-to-Spaces

### 4. monday.com

**Como resolve:** **você cai no último workspace visitado**; se ele não puder ser resolvido, no
workspace *Main* da conta. Quem entra numa conta pela primeira vez vai automaticamente para o
Main. Não existe tela de escolha como porta de entrada.

**O que serve:** é a evidência mais direta. O padrão do mercado não é "escolha um espaço", é
"continue de onde você parou".
**O que não serve:** o conceito de um workspace "Main" único não existe no ENSPACE.
🔗 https://support.monday.com/hc/en-us/articles/360000613179-Get-started-in-an-existing-account

### 5. Pipefy

**Como resolve:** separa os dois públicos em portas diferentes. Quem **pede** alguma coisa entra
por um **Portal** — uma página que reúne formulários públicos, organizada por departamento,
feita para "facilitar o acesso dos solicitantes aos formulários". Quem **opera** o processo
entra na plataforma. O solicitante pode nem ter conta.

**O que serve:** é a resposta estrutural para a confusão relatada. Quem vai abrir chamado nunca
deveria ver a estrutura administrativa.
**O que não serve:** portal público sem login é outro produto; aqui a pessoa já está logada.
🔗 https://help.pipefy.com/en/articles/5860453-how-to-make-and-track-requests-in-pipefy · https://help.pipefy.com/en/articles/4173939-how-to-share-public-forms

---

## Os três extras — escolhidos pelo tipo do problema

### 6. Slack — o caso mais próximo do nosso

**Como resolve:** quando um e-mail pertence a vários workspaces, aparece **a lista deles para
você escolher e clicar em Open**. Criar um novo workspace não está nessa tela: fica no "+" da
barra lateral ou no menu "Add Workspace".

**O que serve:** o mesmo desenho que o ENSPACE tem, com a diferença que decide tudo — a tela é
uma lista de "entrar", e "criar" mora em outro lugar.
🔗 https://slack.com/help/articles/212681477-Sign-in-to-Slack · https://slack.com/help/articles/206845317-Create-a-Slack-workspace

### 7. Jira Service Management — a confusão exata, do outro lado

**Como resolve:** dois ambientes declaradamente distintos — o **customer portal**, onde se abre
o pedido, e a visão de **agente**, onde ele é tratado. A documentação chega a instruir que se
compartilhe sempre o link do portal com o cliente, porque o link de agente **causa erro de
acesso e confusão**.

**O que serve:** o produto assume que misturar as duas portas é um defeito conhecido, e trata
disso com copy e com links diferentes — não só com permissão.
🔗 https://support.atlassian.com/jira-service-management-cloud/docs/set-up-and-manage-portal-access/

### 8. Atlassian / Jira — o efeito colateral de não desambiguar

**Como resolve (mal):** pedidos criados **sem Request Type** não aparecem no portal do cliente,
e a pessoa conclui que o pedido sumiu. É o mesmo padrão de falha do nosso caso: um objeto
criado pelo caminho errado, que depois não aparece onde a pessoa espera.

**O que serve:** o workspace criado por engano no ENSPACE é exatamente isso — um objeto órfão
que a pessoa vai procurar como se fosse um chamado e nunca vai achar.
🔗 https://support.atlassian.com/jira/kb/known-problems-with-viewing-requests-on-the-customer-portal/

---

## O padrão que todos seguem

1. **Ninguém usa o seletor de espaço como tela de entrada.** Notion, monday e ClickUp levam
   direto para dentro do último espaço usado. A escolha é um *switcher*, não uma porta.
2. **Criar espaço é ação demovida.** Está dentro de um menu (Notion, Slack), depois da lista
   (Notion), ou num "+" discreto. Em nenhum deles é o botão primário do canto superior direito.
3. **Quem pede alguma coisa entra por outra porta.** Pipefy e Jira Service Management separam
   solicitante de operador no nível do produto, não só da permissão.

Divergir desses três custa aprendizado a cada pessoa nova que entra — e é exatamente onde o
ENSPACE diverge dos três ao mesmo tempo.

## O que nenhum deles faz

**Nenhuma dessas ferramentas pergunta a intenção antes de deixar criar.** Todas apenas
escondem a ação de criar; se a pessoa achar o botão mesmo assim, o formulário abre e aceita.

Aí está a chance: o ENSPACE pode ser o que **intercepta com uma pergunta** — "o que você quer
fazer?" — e devolve a pessoa ao caminho certo em vez de deixá-la criar um espaço órfão. É
barato de construir, e resolve o caso relatado mesmo quando a pessoa insiste no botão errado.

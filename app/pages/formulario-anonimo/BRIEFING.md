# Formulário anônimo: briefing

## 1. A demanda como veio

> precisamos de uma nova funcionalidade que atenda a casos de compliance. pra isso voce vai precisar estudar
> front e back do enspace analisando pelo navegador as informaçoes.
>
> a situaçao é:
>
> um usuario preenche um formulário definido como PÚBLICO. nesse caso ele precisa ter um modo de acessar esse
> form SEM USAR SENHA, mas garantindo que nao gere exposiçao das nossas rotas de api. isso porque um bot pode
> pegar esse form publico e criar dez milhoes de itens ate stourar nosso servidor.
>
> entao temq ue ser um modo seguro de link, com id unico, temporario etc ou outra soluçao.
>
> esse cara acessando o lik do form externo (que hoje pede login), vai ja abrir direto no form e pode registrar
> a denuncia dele.
>
> essa denuncia roda um spaceflow que gera um fluxo de compliance ali dentro, pras pessoas tratarem, e tem que
> gerar uma resposta de que foi recebida a denuncia, como um email de retorno.
>
> nesse caso, o EMAIL DO SOLICITANTE nao deve ficar salvo, nem nenhuma identificaçao de quem criou o item. mesmo
> que mantenhamos o login, isso deve ser impedido. NAO PODE sair em relatorio nem ser visto em tela por ninguem,
> mas nao pode impedir que um email de retorno seja enviado pra aquela pessoa.
>
> qual a soluçao pra menor identificaçao possivel? continuar pedindo o email mas esconder? ou outra coisa?

Depois da pesquisa:

> tem que seguir a lógica dos no-codes ta? de virar user generico anonymous
>
> com isso, pode prototipar.

## 2. Telas e jornadas em jogo

| Jornada | Tela do develop |
|---|---|
| Quem configura o formulário | Configurações › Estrutura › Categorias › categoria › Formulários › Editar (Definição, Visual, Avançado) |
| Quem denuncia | O link externo do formulário (`/public/<identificação>/answer`), que hoje cai em "Acesso Externo" |
| Quem trata o caso | Categorias › categoria (lista de itens) e o painel do item (Ver Detalhes) |
| O fluxo do caso | Configurações › Estrutura › Spaceflow › editor (gatilho "Ações de Itens") |

## 3. O que seria sucesso

Quem denuncia abre o link, envia sem login e acompanha a resposta, e ninguém do workspace descobre quem foi.

## 4. O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (índice `temas/README.md`, os 6 temas e o `UX_REPORT.md`) por "público",
"externo", "denúncia", "anônimo" e "compliance". Não havia nada sobre formulário público nem sobre canal de
denúncia. O único resultado foi a palavra "denuncia" com outro sentido, na auditoria do construtor de telas.

## 5. Como o develop funciona hoje

Medido em 15/10/2026 no workspace de exploração, pela tela, mais os pareceres de QA de formulários (2026-09-24)
e de Spaceflow. Não preparei nada por API.

### 5.1 O caminho de quem configura

1. Configurações › Estrutura › Categorias › a categoria: o painel com 12 cartões (ev-01).
2. Cartão Formulários: a lista com Ações, Criado em, Nome, Ícone e Visibilidade (ev-02).
3. "▾" da linha: Editar, Deletar, Duplicar, Exportar modelo de formulário, Copiar e Acessar (ev-03).
4. Editar abre o painel à direita com 3 abas:
   - Definição: Nome, Descrição (até 300), Tipo (Criação, Edição, Visualização) e Visibilidade (ev-04);
   - Visibilidade tem só Privado e Público (ev-05);
   - Avançado: "Enviar Requisição para Triagem?", "Mostrar na Lista de Formulários Triagem", "Exibir documentos
     modelos" e "Habilitar Rascunhos" (ev-06).
5. O link sai do construtor do formulário, menu "Link Externo", ou do "Copiar" da lista.

O formulário público não tem expiração, limite de respostas, verificação de robô, senha nem janela de abertura.
O link usa a identificação do formulário: 32 caracteres, fixos, que não mudam ao trocar a visibilidade.

### 5.2 O caminho de quem denuncia

1. Abre o link `/public/<identificação>/answer`.
2. A página redireciona para `/external?form=…`: tela "Acesso Externo", "Portal de tarefas e atividades para
   usuários externos", campo E-mail e botão "RECEBER CÓDIGO" (ev-07).
3. Com o código, o formulário abre e o envio mostra "Requisição realizada com sucesso" e "Ticket: <referência do
   item>" (parecer de QA, achado C37).

A doc oficial (en-docs, Tipos › Formulários › Visibilidade) diz que o Público abre "sem necessidade de
autenticação". A tela pede login. O formulário Privado tem o mesmo comportamento pelo mesmo link (C37).

### 5.3 Onde a identidade de quem enviou aparece

| Lugar | O que mostra | Quem vê |
|---|---|---|
| Item (API) | `request_email` (o e-mail do login) e `user` (id, nome, e-mail, avatar) | Quem lê o item ou usa variável |
| Painel do item › Logs de Auditoria | "<Nome> criou um registro na categoria …", com hora ao segundo (ev-08, nome trocado no print) | Quem abre o item |
| Painel do item › Emails Automáticos | O destinatário de cada e-mail do fluxo | Quem abre o item |
| Configurações › E-mails › E-mails Enviados | Destinatário de todo envio do workspace | Administrador |
| Configurações › Logs › Log de Auditoria | Membro com nome, e-mail e papel; exportável | Administrador |
| Variáveis `{{request_email}}`, `{{user.email}}`, `{{user.name}}`, `%request_email%` | Copiam o criador para modelo, condicional e tarefa | Configurador |
| Spaceflow: saída do gatilho de item | `request_email` e `user` na raiz | Configurador do fluxo |
| Spaceflow: histórico de execuções | `input`, `output` e a saída de cada nó | Quem abre Execuções |

A tabela de itens é o único lugar que já protege: o seletor de colunas não oferece "criado por" nem "e-mail do
solicitante". O detalhe do Log de Auditoria não mostra IP.

### 5.4 Segurança do envio público

O QA de formulários registrou um achado de segurança no envio do formulário público (achado C1, parecer interno
de 2026-09-24, prioridade sugerida Urgente). O detalhe técnico fica fora deste repositório, que é público. A
proposta trata a correção desse achado como pré-requisito.

### 5.5 O que já existe e serve

- **Triagem:** o envio pode ficar como "resultado de formulário" antes de virar item (Avançado › "Enviar
  Requisição para Triagem?").
- **Ticket:** o fim do envio já mostra a referência do item.
- **Gatilho de Spaceflow:** "Ações de Itens" com Categoria de Referência, Ação de Gatilho (Criação, Atualização,
  Exclusão), Vincular ao Item, Condicionais e Título Dinâmico. Os modos de início são Manual, Ações de Itens,
  Webhook, Timer e Caixa de Entrada (ev-10).
- **Portal de tarefa externa:** já trata pessoa de fora com código de uso único, sem conta de membro.

### 5.6 Exploração feita na tela

- Abri o formulário público de teste, as 3 abas e o link externo.
- Abri o painel de um item e as abas Logs de Auditoria e Emails Automáticos.
- Para ver os gatilhos, criei um fluxo de teste no Spaceflow e apaguei logo depois.

## 6. A casca da tela, item por item

### ENSPACE (`_CascaDoEnspace.vue`)

- Topo do menu: avatar do workspace, nome, referência e seta.
- "Buscar..." com CTRL K.
- Membro: Início, Spaceflows, Categorias (abre as categorias), Tarefas (Agendadas, Rápidas), Agenda, Knowledge.
- Configurações: Visão Geral, Sistema, Estrutura (Categorias, Listas, Spaceflow), Gestão de Membros, Interface,
  E-mails, Integrações, Agentes de IA, Logs. Não há mais "Credenciais".
- Ajuda: Releases, Documentação (com seta de link externo).
- Barra do topo: voltar, avançar, recarregar, início, trilha com CTRL B e estrela, selo de idioma, tema,
  Suporte, sino com 99+ e o avatar.

### Página pública (`_CascaPublica.vue`, cópia de "Acesso Externo")

- Fundo claro com traços finos e manchas rosa e lilás nos cantos.
- No canto superior direito: tema (lua) e idioma ("Português" com bandeira e seta).
- Logotipo ENSPACE acima do cartão.
- Rodapé "© 2026 Enspace. Todos os direitos reservados."

### Spaceflow (dentro da casca do ENSPACE)

- Barra: Editor, Execuções, Versões, Comentários, Logs; "1/5" à direita.
- Trilho à esquerda com 4 ícones; grade de fundo; nós com ícone, título, descrição e "OK".
- Zoom no canto inferior esquerdo e minimapa no inferior direito.
- Modal do nó com Entrada à esquerda, Saída à direita, "Modificado", Cancelar e "Salvar e fechar".

### Painel do item

- Trilho de 4 ícones à esquerda e o botão de recolher.
- Abas: Visão Geral, Comentários, Logs de Auditoria, Tarefas (com seta), Anexos e "+4" (Emails Automáticos,
  Mail Box, Notes, Campos).

## 7. Evidências

| Arquivo | O que mostra |
|---|---|
| `ev-01-painel-da-categoria.jpg` | Os 12 cartões da categoria |
| `ev-02-lista-de-formularios.jpg` | A lista de formulários com Privado e Público |
| `ev-03-menu-do-formulario.jpg` | O menu da linha |
| `ev-04-formulario-definicao.jpg` | A aba Definição |
| `ev-05-visibilidade-privado-ou-publico.jpg` | As 2 opções de Visibilidade |
| `ev-06-formulario-avancado.jpg` | A aba Avançado |
| `ev-07-link-publico-pede-acesso-externo.jpg` | O link público caindo no "Acesso Externo" |
| `ev-08-item-log-de-auditoria.jpg` | O log do item com o criador (nome trocado por "Pessoa do Workspace" no DOM antes do print) |
| `ev-09-spaceflow-editor.jpg` | O editor do Spaceflow |
| `ev-10-spaceflow-modos-de-inicio.jpg` | Os 5 modos de início |

Todas passaram no `detectar_seta_mouse.py` ("ok"). Nenhuma mostra e-mail de pessoa nem a identificação de um
formulário real.

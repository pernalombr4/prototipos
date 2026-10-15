# Formulário anônimo: decisões

## A proposta em 1 minuto

São 3 configurações independentes do formulário, cada uma no lugar dela. Tipo e Visibilidade continuam como
hoje (Visibilidade: Privado ou Público).

| Configuração | Onde fica | Depende de | Para que serve |
|---|---|---|---|
| **Acesso pelo link: Sem login** | Definição, logo abaixo de Visibilidade, com o link e o QR code | Visibilidade Público | abrir o formulário sem e-mail, código ou conta |
| **Respostas anônimas** | Avançado | nada: vale para Privado e Público, com ou sem login | gravar a resposta sem identificação de quem respondeu |
| **Acompanhamento por protocolo e senha** | Avançado, dentro de Respostas anônimas | Respostas anônimas | dar retorno a quem respondeu sem saber quem é |

- **Sem login traz a proteção do link**, em Avançado, só quando está ligado: chave de 30 minutos por visita,
  verificação de robô sem clique, limite por hora e por dia e pausa automática num pico. O que é barrado não
  vira item e não chega a nenhuma pessoa. A Triagem não faz parte da proteção.
- **Respostas anônimas criam o item com o usuário genérico `anonymous`**, como Airtable, ServiceNow e Pipefy.
  Sem `request_email`, sem IP e com a hora cheia. Serve a avaliação de gestor, feedback, pesquisa de clima ou
  canal de denúncia. Com login, o login controla quem pode responder, mas não fica gravado.
- **A opção só vale depois de "Conferir anonimato"**: o ENSPACE confere campos, fluxos, notificações, modelos de
  e-mail e cargos da categoria, e o configurador corrige ali mesmo. O construtor aponta os campos que
  identificam quem responde enquanto ele monta.
- **O acompanhamento é opcional.** Com ele, quem respondeu recebe protocolo e senha, o retorno é automático ou
  pelo Spaceflow (nó "Responder a quem enviou"), nunca os 2, e o e-mail de aviso é opcional, cifrado fora do
  item e sem conteúdo.

## As 2 jornadas

```
CONFIGURADOR                                          QUEM RESPONDE
1 Formulários › Criar +                               1 Cartaz / intranet: QR code e link
  Visibilidade = Público                                │
        │                                             2 Abre o link: sem login, sem Acesso Externo
2 Definição › Acesso pelo link = Sem login              │
  link + QR code                                      3 Responde + verificação de robô sem clique
        │                                               │
3 Avançado › Respostas anônimas                       4 Aviso por e-mail? opcional (vira sigilosa)
        │                                               │
4 Avançado › Acompanhamento + retorno                 5 Protocolo + senha + comprovante
  (automático OU Spaceflow)                             │
        │                                             6 Caixa pessoal: aviso sem conteúdo
5 Avançado › Proteção do link sem login                 │ (quando a equipe responde)
        │                                             7 Acompanhar: lê o retorno e complementa
6 Construtor: verificação de anonimato                  │
        │                                             8 Item concluído
7 Conferir anonimato: campos, fluxos,
  notificações, modelos, cargos → Ativar
        │
8 Envio de teste + faixa do link na lista
  (respostas, barrados, pausar)      ◄── item criado por anonymous, sem e-mail, sem IP, hora cheia
```

Os passos 2, 3 e 4 são independentes: a "Avaliação do gestor" da lista é Privado, com respostas anônimas e sem
acompanhamento; ela não tem link, nem proteção, nem protocolo.

## Rodada 1 · 2026-10-15

- **Pedido (literal):** "tem que seguir a lógica dos no-codes ta? de virar user generico anonymous / com isso,
  pode prototipar." (a demanda inteira está no `BRIEFING.md`).
- **Mudou:** protótipo novo, uma porta, 3 jornadas pelo "Ir para" do andaime:
  - Formulários: Visibilidade "Anônimo", aba Anonimato, Rascunhos desligado no anônimo, selo na lista;
  - Spaceflow: Start com o campo Formulário e "Dados que o fluxo recebe"; o nó novo "Responder ao denunciante";
  - página pública e acompanhamento, com protocolo e senha;
  - lista de denúncias e painel do item com criador `anonymous`, pasta "Canal do denunciante", Log de Auditoria
    com hora cheia e Emails Automáticos com "Destinatário protegido".
- **Fronteira:** muda Visibilidade, a aba Anonimato, a página do link no modo anônimo, o acompanhamento, o
  cartão da denúncia e a pasta do canal no item, o nó novo e o quadro de dados do Start; não muda a casca, o
  Público de hoje, a tabela de itens, Comentários, Tarefas, Anexos nem o nó de Tarefa.
- **Descartado:**
  - Link temporário ou único por pessoa. Motivo: link por pessoa identifica quem recebeu, e link que expira
    morre no cartaz. A expiração fica na chave da visita, por trás do link fixo.
  - E-mail obrigatório escondido. Motivo: continua dado pessoal (pseudonimizado), o provedor de envio guarda o
    destinatário e conflita com a Lei 14.457, art. 23, II.
  - reCAPTCHA. Motivo: manda dado do navegador ao Google; o canal anônimo usa verificação do ENSPACE ou Turnstile.
  - "Esqueci a senha". Motivo: recuperar exige guardar um contato. A tela diz o que fazer: nova denúncia citando
    o protocolo antigo.
  - Rascunho no formulário anônimo. Motivo: exigiria guardar quem está escrevendo.
- **Não deu:**
  - Print das referências. Por quê: a pesquisa foi documental; capturar exige conta em cada produto.
  - Conferir demanda real de cliente. Por quê: a política da sessão barrou o workspace produtos e o espelho de
    chamados do QA.
  - Ver o envio passando pelo Acesso Externo até o fim. Por quê: o código chega por e-mail a uma caixa que o
    agente não lê; o comportamento veio do parecer de QA (C37).
- **Maquete:**
  - o QR code é um desenho fixo, não um QR legível; "Baixar QR code" baixa esse desenho em SVG;
  - "Baixar comprovante" baixa um .txt montado no navegador;
  - a verificação de robô é um atraso de 1,4 s que sempre passa;
  - o e-mail digitado na página pública é descartado no envio (no produto, iria para o cofre);
  - a senha da denúncia fica no mock (`senhaDoPrototipo`) só para o acompanhamento funcionar; no produto, só o
    hash, fora do item;
  - o gráfico das últimas 24 horas e o pico das 3h são fixos;
  - Comentários, Tarefas, Anexos, Mail Box, Notes e Campos mostram "Pasta fora deste protótipo";
  - os nós Tarefa e End e os campos do Start (exceto o quadro de dados) não salvam;
  - cenários do andaime: "Sem denúncias" esvazia a lista, "Pico de envios" pausa a página pública, "Envio
    falha" mantém o texto e mostra o erro.
- **CSS próprio** (consultas no MCP `nuxt-ui` registradas em "Crítica e acessibilidade"):
  - `[&>.peer]:[--sidebar-width:12.5rem]` na casca: o `EnLayout` não repassa `ui` ao `USidebar` (herdado de
    `comunicacao-no-workspace`);
  - grade do Spaceflow com `bg-[linear-gradient(var(--ui-border)…)]`: nenhum componente desenha grade de
    canvas; usa o token de borda;
  - rótulos Entrada e Saída do modal com `[writing-mode:vertical-rl]`: cópia do develop, sem componente para
    texto vertical;
  - traços do fundo da página pública em SVG com `text-accented`: decoração copiada do "Acesso Externo".
- **Crítica e acessibilidade:**
  - contraste medido por script nos 2 temas (texto visível contra o fundo efetivo). Corrigido: horas das
    mensagens e rótulo "Mensagem automática" (2,6:1 e 4,2:1), "Verificado" em verde (2,5:1), totais e aviso de
    pico da aba Anonimato (até 1,9:1) e a descrição do cartão de verificação (4,1:1, prop `ui` do
    `URadioGroup`);
  - sem correção: rosa primário com texto branco e link rosa (3,4:1) e o verde do "Salvar" (2,5:1) vêm do tema
    do `en-docs` e da cópia do develop; o placeholder "Selecione" (3,0:1) é o padrão do Nuxt UI. Achado para o
    tema, não para este protótipo;
  - crítica: os nós do Spaceflow tinham alturas diferentes (corrigido, altura fixa); o botão "Acompanhar
    denúncia" fica desligado até marcar "Guardei o protocolo e a senha", de propósito;
  - copy (skill `design:ux-copy`): o erro de login do acompanhamento ganhou o "como resolver";
  - MCP `nuxt-ui`: `search-components` com "chat message bubble" achou `UChatMessage`; ficou de fora porque os
    papéis são `user`, `assistant` e `system` e o `parts` segue o Vercel AI SDK. A conversa é composta com
    `UIcon` e utilitários. "canvas grid background" não achou componente de grade.
- **Ver:** `pnpm dev` › `http://localhost:3000/formulario-anonimo` · publicado em
  `https://pernalombr4.github.io/prototipos/formulario-anonimo/`.

## Rodada 2 · 2026-10-15

- **Pedido (literal):** "analise se realmente o usuario deveria precisar utilizar a triagem ou se a
  funcionalidade já deveria abarcar um metodo similar. se vc ta usando a triagem só pra evitar exploit pela api,
  nao é o caminho certo. deev ser uma soluçao com estrategias de segurança."
- **Análise:** a proposta do chat da rodada 1 pôs a Triagem como última camada contra robô ("fila na Triagem").
  Esse uso estava errado:
  - Triagem é aprovação de uma pessoa antes de o envio virar item. Ela não barra nada: o envio do robô chega ao
    banco como resultado de formulário e vira fila para alguém limpar;
  - a rota da API continua aberta; o problema de segurança fica onde estava;
  - no canal de denúncia, quem aprova a triagem lê o relato antes do comitê e pode ser a pessoa citada;
  - recusar na triagem apaga a denúncia sem caso nem registro, e o registro de toda denúncia é exigido pela
    Diretiva (UE) 2019/1937, art. 18;
  - o Spaceflow e a confirmação só andam depois da aprovação.
- **Mudou:**
  - Avançado: no modo anônimo, "Enviar Requisição para Triagem?" e "Mostrar na Lista de Formulários Triagem"
    ficam desligados, com o motivo na tela;
  - aba Anonimato: o texto dos limites diz que o envio barrado não vai para nenhuma fila de pessoas;
  - BRIEFING: a Triagem sai de "o que já existe e serve" e fica como "não entra na proposta".
- **Fronteira:** muda Avançado no modo anônimo e 2 textos; não muda a Triagem nos formulários Privado e Público.
- **A proteção que fica no lugar** (camadas do lado do servidor; no protótipo, só a configuração aparece):
  1. borda: limite por IP e teto de tamanho do envio, sem guardar o IP no item;
  2. rota pública própria, separada da API interna, que só aceita os campos da versão publicada do formulário e
     devolve só o protocolo;
  3. chave assinada por visita (formulário, validade de 30 minutos, uso único), emitida quando a página abre;
  4. verificação de robô sem clique (do ENSPACE ou Turnstile), conferida no servidor;
  5. limites por formulário (hora e dia) e por workspace, e pausa automática num pico, com aviso ao comitê;
  6. fila técnica interna: o envio aceito é processado por uma conta de serviço que só cria item naquela
     categoria, com dedupe e limpeza de anexo. Nenhuma pessoa vê essa fila.
- **A classificação humana continua existindo, no lugar certo:** a tarefa "Triar denúncia" do Spaceflow, dentro
  do caso, feita pelo comitê, com o relato já registrado.
- **Ver:** a mesma URL da rodada 1, Ir para › Formulário, aba Anonimato › aba Avançado.

## Rodada 3 · 2026-10-15

- **Pedido (literal):** "voce deve prototipar tambem outro cenario, que é a visao do CONFIGURADOR. a visao final
  nao diz nada. isso é só um formulário como seria configurado no enspace. hoje ja daria pra reproduzzir esse front
  seu. nao é isso que preciso somente. preciso da jornada de configurador e da jornada de usuario"
- **Mudou:** as 2 jornadas, de ponta a ponta, com um guia no andaime que leva o protótipo a cada passo.
  - Configurador (7 passos):
    1. "Criar +" com Visibilidade "Anônimo": o painel diz o que muda e oferece o modelo "Canal de denúncia";
    2. construtor com a "Verificação de anonimato": aponta o campo que identifica quem envia e diz como corrigir;
       a lista "Adicionar campo" marca esses campos;
    3. aba Anonimato (rodada 1): link, QR code, proteção e retorno;
    4. Spaceflow (rodada 1): gatilho sem identidade e "Responder ao denunciante";
    5. "Revisar e publicar canal": confere a categoria inteira (formulário, fluxos, notificações, modelos de
       e-mail e cargos) e trava a publicação no que "Impede publicar";
    6. "Canal publicado": link, QR code e envio de teste, que vira item marcado "Teste";
    7. faixa do canal na lista de denúncias: aceitas e barradas hoje, "Pausar canal" e "Ver proteção".
  - Denunciante (8 passos): cartaz na intranet com QR code; formulário sem login; relato com verificação sem
    clique; aviso por e-mail opcional; protocolo, senha e comprovante; aviso sem conteúdo na caixa pessoal;
    acompanhamento com a resposta do comitê; caso concluído.
  - Tipo do formulário corrigido para as 6 opções do develop (Editar, Criação, Geral, Visualizar e 2 obsoletas).
- **Fronteira:** muda "Criar +" no modo anônimo, o construtor (verificação, selos e 2 botões no topo), a revisão,
  o aviso de publicado, a faixa do canal e o selo "Teste"; não muda a casca, o construtor nos modos Privado e
  Público nem o resto da tabela de itens.
- **Por que a revisão olha fora do formulário:** o formulário sozinho não garante anonimato. Um fluxo com
  `{{request_email}}`, uma notificação para o criador, um modelo com `{{user.name}}` ou um cargo amplo demais
  desfazem a proposta, e hoje nenhuma tela junta esses pontos.
- **Maquete:**
  - os 4 pontos de fora do formulário (fluxo "Aviso ao gestor", notificação "Nova denúncia", modelo
    "Confirmação de registro", cargo "Colaborador") são fixos; o botão de cada um só marca "Corrigido";
  - o guia de jornadas e as cenas de fora do ENSPACE (cartaz, caixa de e-mail) são andaime;
  - no passo 6 da jornada do denunciante, a resposta do comitê chega sozinha; no 8, o caso é concluído sozinho;
  - o canal criado na jornada começa sem denúncias e sem envios barrados (as de exemplo ficam de fora).
- **Crítica e acessibilidade:** contraste medido nas telas novas; corrigidos o tipo "[email]" no bloco marcado
  (4,4:1) e, no acompanhamento, a hora sobre fundo cinza (4,2:1) e o nome "Comitê de ética" em rosa (3,4:1, agora
  só o ícone fica rosa). O guia fica no `body` (Teleport) e acima das camadas, para continuar clicável com um
  painel aberto.
- **Ver:** a mesma URL; cartão "Jornadas" no canto inferior esquerdo.

## Rodada 4 · 2026-10-15

- **Pedido (literal):** "se na configuraçao do form a gente configura o retorno pro usuario, por que tem um fluxo
  pra isso tambem? nao tem sentido. ou é um, ou é outro. voce pode colocar as 2 opçoes la: com retorno automatico
  (dev cria isso) ou com retorno por spaceflow (o user precisaria configurar)"
- **Mudou:**
  - aba Anonimato › Retorno ao denunciante: "Quem confirma o recebimento", com "Automático" e "Pelo Spaceflow";
  - Automático: a mensagem de recebimento fica no formulário e o fluxo não tem o nó; o editor do fluxo mostra o
    aviso "O recebimento é confirmado pelo formulário" e o atalho "Responder pelo Spaceflow";
  - Pelo Spaceflow: a mensagem sai do formulário e aparece o atalho "Abrir o fluxo do caso"; o nó
    "Responder ao denunciante" entra no fluxo e diz que é ele quem confirma;
  - a revisão antes de publicar, a tela de denúncia recebida e o guia seguem a escolha.
- **O que vale nos 2 modos:** o prazo de resposta e o aviso por e-mail continuam no formulário, porque valem para
  toda resposta ao denunciante, não só a de recebimento.
- **Fronteira:** muda o bloco de retorno da aba Anonimato e a presença do nó no fluxo; não muda o resto do fluxo
  nem a pasta "Canal do denunciante" do item.
- **Quem constrói o quê:** o automático é comportamento do produto (o dev implementa); o Spaceflow é
  configuração do cliente, com o nó novo.
- **Maquete:** a troca de modo no editor do fluxo grava na hora, sem "Salvar".

## Rodada 5 · 2026-10-15

- **Pedido (literal):** "anonimo é basicamente uma configuraçao avançada que diz algo do tipo "as respostas serao
  anonimas, sem identificaçao", nao é o TIPO do form. e nao necessariamente vai ser usado pra denuncia [...] e a
  config de ter um qr code, link pra acesso sem senha é outra coisa [...] somente se for publico pode fazer
  isso. e ai veja em qual aba essa opçao deveria se enquadrar. perceba que sao coisas segregadas que voce juntou
  "Num mesmo bolo" ajuste isso"
- **Mudou:**
  - Visibilidade volta a ter só Privado e Público; a opção "Anônimo" e a aba Anonimato saem;
  - Definição › "Acesso pelo link" (Com login / Sem login), só com Público, com o link e o QR code;
  - Avançado › "Respostas anônimas", para qualquer formulário; "Acompanhamento por protocolo e senha" vira
    sub-opção, desligada por padrão, com o retorno dentro dela;
  - Avançado › "Proteção do link sem login", só com Sem login;
  - "Revisar e publicar canal" vira "Conferir anonimato" e "Ativar respostas anônimas";
  - "Criar +" abre o mesmo painel da edição, em branco (sai o painel com o modelo Canal de denúncia);
  - copy genérica: "quem respondeu", "Equipe", "Resposta anônima", nó "Responder a quem enviou", pasta
    "Acompanhamento"; a categoria do exemplo vira "Ouvidoria" e ganha o formulário "Avaliação do gestor".
- **Por que cada aba:**
  - acesso sem login em Definição: é uma escolha sobre quem abre o formulário, como a Visibilidade, e o link e
    o QR code são o que o configurador divulga;
  - respostas anônimas em Avançado: muda o que se grava, não quem acessa, e fica ao lado de Rascunhos e
    Triagem, que também mudam o comportamento da resposta;
  - proteção em Avançado: é ajuste técnico do link e só aparece quando o link existe sem login.
- **Regras entre as 3:** Sem login some com Privado; Rascunhos fica desligado com respostas anônimas; o link
  sem login de um formulário com respostas anônimas só recebe depois da conferência. A Triagem continua
  disponível em todos os casos.
- **Fronteira:** muda o painel do formulário (Definição e Avançado), os selos da lista, o construtor, a
  conferência, a página do link e a faixa da lista; não muda Tipo, Visual, a lista de itens nem o resto do
  Spaceflow.

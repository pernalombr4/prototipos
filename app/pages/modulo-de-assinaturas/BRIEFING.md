# Briefing: módulo de assinaturas

## A demanda como ela veio

Pedido 1 (a sessão do QA de assinadores, 18/11/2026):

> Prototipar as correções e melhorias do documento de testes do módulo de assinaturas que MUDAM o front do ENSPACE.
> Entra: toda correção ou melhoria que exige mudança importante de front (estado novo, painel, botão, fluxo, informação
> nova na tela). Fica de fora: tradução, texto de tooltip, rótulo, ajuste pequeno que o dev faz sozinho sem referência
> visual.

Pedido 2 (a redatora, 18/11/2026, ao validar a lista):

> pode incluilas tambem. m16, m19 e m23. concordo com o restante. pode colocar tudo num protótipo só, e nao varios
> prototipos. mas pra isso fazer sentido, voce vai fazer o seguinte: ler o código do módulo e os outros anexos que
> precisar com /investigar-codigo , e explorar a tela em modo somente leitura, sem executar nada efetivamente. voce vai
> prototipar outras melhorias visuais/de organizaçao nas telas de acordo com o que achar interessante pra melhorar a ux.
> um grande exemplo é os menus: quando abre o menu integraçoes agora na branch ta aparecendo um menu a mais só pra fazer
> a gestão dos apps de integração, mas deveria estar tudo na loja de apps. e outras coisas que tem relaçao com jornada
> de usuario e organizaçao de tela (informaçao repetida 4x no mesmo espaço da tela, mas em textos diferentes... coias
> assim) [...] entao suas melhorias vao se somar a essas que voce levantou a partir do docx. as suas precisam vir
> primeiro porque vao ser a base da aparencia do modulo pra fazer todo o resto.

## Tela e jornada em jogo

O módulo de assinaturas da branch `feat/en-signature` (prévia do PR 3124, com o back de develop):

- Configurações > Integrações > Apps e o item novo Integrações > Assinatura Eletrônica (provedores e credenciais);
- Módulos > Assinaturas: a lista de envelopes, o Novo envelope e o detalhe do envelope;
- o nó Assinatura eletrônica do Spaceflow: o editor do nó e o painel da execução;
- a tarefa Integração do fluxo da categoria, que agora cria o envelope no módulo;
- Configurações > Sistema > Módulos, onde o módulo liga e desliga.

## O que seria sucesso

Quem configura acha os assinadores na loja de apps, entende numa leitura o que cada provedor faz e acompanha cada
envelope, no módulo, no fluxo e na tarefa, sabendo o estado, quem fez cada ação e o que fazer a seguir.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (índice dos temas, `UX_REPORT.md` e as pastas de tema) por "assinat", "signat" e
"integra". Não havia auditoria sobre assinatura eletrônica nem sobre a loja de apps. A única menção a integrações é a
aba Integrações da Agenda, sem relação com este módulo.

## Como foi a investigação

- **Código:** lido pela skill `investigar-codigo`, só leitura, na branch `feat/en-signature` do front (último commit de
  18/11/2026). As telas do módulo, os textos nos 3 idiomas, a tela legada da integração e o card de Apps.
- **Tela:** a prévia aberta no Chrome, no workspace de teste do QA, **só olhando**: abrir tela, aba e janela e fechar
  sem salvar. Nenhum envelope, credencial, fluxo ou configuração foi criado, editado ou enviado.
- **Prints do QA:** as telas da tarefa Integração e da execução com o nó em andamento vêm dos prints do reteste de
  18/11/2026, que já mostravam esses estados.
- **Exceção ao workspace de exploração:** o módulo só existe na prévia, e lá só o workspace do QA tem módulo, credenciais
  e envelopes. A visita foi só leitura, como a redatora pediu.
- **Prints da prévia:** não entram no repositório, porque mostram e-mail de teste e nomes de pessoas. O que cada tela
  mostra está descrito abaixo.

## O que a branch tem hoje, tela a tela

### Configurações > Integrações

- O grupo Integrações do menu tem 4 itens: **Apps, Credenciais, Webhooks e Assinatura Eletrônica**. O 4º é novo e só
  serve aos 5 assinadores.
- **Apps** é a loja: seções por assunto (Inteligência Artificial, Assinantes digitais, Documentos, E-mails, Canais de
  mensagem), um card por app com logo, descrição cortada, tamanho máximo e formatos, e "Instalar Integração" ou
  "Gerenciar Integração".
- Na seção dos assinadores, os 5 cards antigos ganharam o selo "Legado" e o **mesmo aviso amarelo repetido 5 vezes**:
  "Mantida apenas para os fluxos já existentes. Configure as novas integrações de assinatura eletrônica na nova página."
  com "Ir para a nova página". Abrir o card antigo mostra outro aviso igual, maior, no topo.
- **Assinatura Eletrônica** (`/settings/signature`): título "Integrações de assinatura eletrônica", "Como funciona",
  "Credenciais registradas" e um card por provedor com logo, selo "Credencial ativa", **descrição técnica**
  ("tokenAPI + cryptKey; webhook por documento autenticado por token do envelope na URL..."), a linha "1 credencial
  registrada · API key" e 4 a 5 selos de recurso, com "Gerenciar".

### Página do provedor (exemplo: Certisign)

A mesma informação aparece várias vezes na mesma tela, com textos diferentes:

| Informação | Onde aparece |
|---|---|
| O cancelamento não chega ao provedor | selo "Cancela só no ENSPACE" no topo; alerta logo abaixo; "Como se comporta" à direita; e de novo na janela de cancelar e no alerta do envelope cancelado |
| O webhook é cadastrado à mão no provedor | selo "Webhook da conta" no topo; etapa 2 da Configuração; "Como se comporta"; o card Webhook com a URL e os passos; "Registro do webhook" nos Detalhes técnicos |
| A credencial existe e está ativa | selo "Credencial ativa" no topo; etapa 1 "1 credencial registrada"; card Credenciais com "Pronta para uso"; o botão "Credenciais registradas" |
| O segredo do webhook está no servidor | etapa 3; "Segredo do webhook" nos Detalhes técnicos |

Outros pontos:
- "Recursos opcionais" lista 5 recursos, e na Certisign os 5 dizem "Não disponível neste provedor";
- "Configuração" diz "3 de 3 etapas concluídas" contando a etapa "Conferir no provedor", que o ENSPACE não confere (M17);
- a descrição do topo é técnica (M26);
- "Credenciais registradas" e "Nova credencial" ficam no topo; o card Credenciais fica no meio da página.

### Módulos > Assinaturas: lista

- Barra: busca "Buscar envelopes...", Colunas, "Novo envelope"; filtros Status, Provedor e Origem.
- Tabela: Ações (⋮), Título com a referência embaixo, Provedor, Status, Origem, Assinados (barra e "0/3"), Criado em,
  Enviado em, Concluído em, com data sem hora (M27).
- O menu ⋮ só tem "Ver detalhes" (M19). A busca não acha pelo signatário (M18).
- Sem envelope, a lista diz "Nenhum envelope encontrado" e oferece "Novo envelope", também sem provedor conectado (M16).

### Novo envelope

Janela com Título, Descrição, Provedor e Credencial em 2 campos, "Expira em" (data sem hora e sem mínimo, C42),
Documento ("PDF ou DOCX até 25 MB", o mesmo texto para todo provedor, M14) e Participantes com ordem, nome, e-mail e
papel. O rodapé tem "Cancelar" e "Salvar rascunho": para enviar, a pessoa salva, abre o rascunho e clica em Enviar.

### Detalhe do envelope

- Topo: "Envelopes" (voltar), "Como funciona", título, status, provedor, origem e "Atualizado há...".
- **Até 8 botões lado a lado no topo**, conforme o estado: Atualizar status, Reenviar e-mail, Links de assinatura,
  Editar rascunho, Enviar, Cancelar, Original e Assinado.
- Até 7 alertas empilhados abaixo do topo (legado, configurador, processando, erro, webhook, cancelado só no ENSPACE,
  recusado).
- Coluna da esquerda: Participantes (ordem, nome, papel, e-mail e status), Documento (abas Original e Assinado) e Trilha
  de auditoria (filtros Todos, Participantes e Erros).
- Coluna da direita: Detalhes (Referência, ID no provedor com "Abrir <provedor>", Origem, Solicitado por, datas).
- "Original" aparece 2 vezes: no topo e no card Documento. "Origem" aparece no topo e nos Detalhes, sem link para o
  fluxo ou a tarefa que criou o envelope.
- A trilha mostra "Cancelado" 2 vezes (o do ENSPACE e o eco do provedor) e não diz quem fez a ação (M20, C43).

### Spaceflow: editor e execução do nó

- Editor: Nome, Modo de execução, **Provedor e Credencial em 2 campos** (o provedor aparece pelo código, "adobesign",
  M24), Título, Mensagem, Documento (variável), Arquivo fixo, Signatários fixos ("01", "02" sem dizer se é em ordem),
  Lista de signatários (Lista, 5 chaves e papel padrão, sempre aberta) e Configurações (Expira em dias, Aguardar
  assinatura).
- Execução: o nó em andamento fica amarelo no canvas. O painel mostra Conexões e **Configuração crua** (SIGNERS em JSON,
  DOCUMENT 3919, PROVEDOR adobesign, CREDENTIAL 65) e não leva ao envelope (M25). Recusa e cancelamento deixam o nó em
  andamento (C48); erro aparece como "Unknown error" (C55, M32).

### Tarefa Integração do fluxo da categoria

"#<n> - Integração", abas Tarefa, Item e Histórico, Detalhes da Tarefa e o bloco "Integração: <provedor>" com o
assinante, "Enviar e-mail de cobrança" e "Documento Assinado · Aguardando ações.". Envelope recusado ou cancelado deixa a
tarefa em andamento com a cobrança ativa (C48); falha de envio aparece só no Histórico (C10).

## A casca da tela, item por item

Copiada da prévia (menu em português pelo print do QA de 18/11/2026):

- **Topo do menu:** logo e nome do workspace com o identificador embaixo e a seta; Buscar com Ctrl K.
- **Membro:** Início, Spaceflows, Categorias (abre), Tarefas (abre), Agenda, Relatórios e os menus próprios do workspace.
- **Módulos:** Assinaturas.
- **Configurações:** Visão Geral, Sistema, Estrutura (abre), Gestão de Membros, Interface (abre), E-mails (abre),
  Integrações (abre: Apps, Credenciais, Webhooks, Assinatura Eletrônica), Agentes de IA, Logs.
- **Ajuda:** Releases, Documentação.
- **Barra do topo:** recolher menu, voltar, avançar, recarregar, início, a trilha com Ctrl B e a estrela, bandeira do
  idioma, tema, Suporte, sino e avatar.
- **Spaceflow:** abas Editor, Execuções, Versões, Comentários e Logs; a execução abre com Fluxo de Execução, Detalhes,
  Comentários e Logs, a faixa com status, duração, "N/M nós executados" e a data, e o painel do nó à direita.

## Achados na casca (ficam como estão)

- A trilha mostra o caminho da URL ("signatures", "signature", "116") no lugar do nome da tela (C44). O protótipo
  mostra o nome, porque a trilha é parte da tela do módulo, e registra a divergência.
- O banner de cookies cobre o canto inferior direito, onde aparecem os avisos (M22).

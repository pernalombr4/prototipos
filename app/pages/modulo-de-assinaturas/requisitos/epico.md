# Épico: Módulo de assinaturas, base de UX e correções do teste

**O que é:** o módulo de assinaturas ganha uma organização única de telas. Os provedores passam a morar na loja de
apps, cada um com uma página que diz cada coisa 1 vez e as etapas de configuração em sequência. A lista, o novo
envelope e o detalhe do envelope mostram o que precisa de atenção, só as ações que o provedor permite e o que aconteceu
numa faixa de estado. O cancelamento e a recusa chegam ao Spaceflow e à tarefa Integração com o motivo, e o módulo tem
um começo para quem ainda não tem provedor nem envelope.

**Onde vale:** Configurações > Integrações > Apps e a página de cada provedor; Módulos > Assinaturas (lista, novo
envelope e detalhe do envelope); o editor e a execução do nó Assinatura eletrônica no Spaceflow; a tarefa Integração
do fluxo da categoria; Configurações > Sistema > Módulos.

**Protótipo:** https://pernalombr4.github.io/prototipos/modulo-de-assinaturas, aprovado em 19/11/2026. Os textos nos
3 idiomas estão no `textos.ts` de https://github.com/pernalombr4/prototipos/tree/main/app/pages/modulo-de-assinaturas.
A barra "Protótipo" no pé da tela (Ir para, situação do workspace, desfecho do nó, estado da tarefa, Menu de hoje,
Reiniciar) é ferramenta de revisão e não entra no produto.

**Fora do escopo:** o menu lateral, a barra do topo e as abas Item, Versões, Comentários e Logs, que continuam como
estão; a edição do rascunho; baixar o documento; a data passada em "Expira em" além do mínimo do campo; a página das
integrações antigas.

**Prioridade e relevância** (nas tarefas, entre parênteses no fim de cada requisito): a prioridade é Essencial,
Importante ou Desejável. A relevância diz o que o dev pode deixar de fazer: Obrigatório, o dev faz. Desejável, o dev
faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande
para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Provedores na loja de apps](parte-1-provedores-na-loja-de-apps.md) | A seção "Assinatura eletrônica" em Apps, o mesmo card para todo app, as integrações antigas recolhidas, a busca e o filtro Todos, Conectados e Não conectados, e o item "Assinatura Eletrônica" fora do menu | | É a porta dos provedores; a página do provedor abre daqui |
| [2. Página do provedor](parte-2-pagina-do-provedor.md) | O topo com o logo e 1 estado, as etapas em linha do tempo, a credencial dentro da etapa, o que o provedor faz e a nova credencial com o ambiente | 1 | É onde o provedor fica pronto para enviar; as partes 4 e 7 levam a ela |
| [3. Lista de envelopes](parte-3-lista-de-envelopes.md) | "Precisam de atenção", o selo de sem retorno, a busca por signatário, a origem com o nome, o menu ⋮ conforme o status e o provedor e o aviso de rascunhos sem provedor | | Melhora a lista que já existe sem depender das outras partes |
| [4. Novo envelope](parte-4-novo-envelope.md) | 1 campo de credencial, o limite do provedor no Documento, "Enviar para assinatura" direto e o rascunho sem provedor | | Muda só o modal de hoje |
| [5. Detalhe do envelope](parte-5-detalhe-do-envelope.md) | O topo com o logo e a origem como link, até 2 ações e "Mais ações", a faixa de estado, os participantes por ordem e a trilha que diz quem fez cada evento | | É a base da parte 6, que abre dele |
| [6. Cancelar, reenviar e links](parte-6-cancelar-reenviar-e-links.md) | Os modais de cancelar (com o efeito no fluxo e o motivo), reenviar e-mail e links de assinatura | 5 | Os 3 modais abrem do detalhe e do menu ⋮ da lista |
| [7. Começo do módulo](parte-7-comeco-do-modulo.md) | O começo sem envelope, com e sem provedor, a 1ª credencial que liga o módulo e o aviso ao desligar | 2 e 4 | Leva à página do provedor e ao novo envelope |
| [8. Nó Assinatura eletrônica no Spaceflow](parte-8-no-assinatura-eletronica.md) | No editor, 1 campo de credencial, as escolhas de Documento e Signatários, a dica do caminho da lista e o que fazer se não for assinado; na execução, o desfecho no nó e o painel com Resultado, envelope, signatários e configuração | | Muda só o nó; corre em paralelo |
| [9. Tarefa Integração](parte-9-tarefa-integracao.md) | O link para o envelope e a tarefa em erro com o motivo quando o envelope é cancelado, recusado ou falha | | Muda só a tarefa; corre em paralelo |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Uma credencial é considerada pronta para envio quando tem o que o provedor exige. Na D4Sign, a credencial só fica pronta com um cofre escolhido. | A credencial D4Sign "Contratos" sem cofre não aparece no novo envelope. | Obrigatório |
| RN902 | Um envelope é considerado aberto quando o status é Enviando, Configurando ou Aguardando assinaturas. | Rascunho, Concluído, Recusado, Cancelado, Expirado e Erro não são abertos. | Obrigatório |
| RN903 | Um envelope aberto é considerado sem retorno quando o último retorno do provedor tem 2 dias ou mais. | Envelope enviado em 15/11 sem retorno desde então está sem retorno há 4 dias em 19/11. | Obrigatório |
| RN904 | A tabela a seguir define o que cada provedor faz pela integração. Política: Única. | Linha 2: na Certisign, cancelar fecha o envelope só no ENSPACE. | Obrigatório |
| RN905 | Os participantes que estão na vez são os da menor ordem que ainda não assinaram. Os de ordem maior ficam na fila até a ordem anterior terminar. | Ordem 1 com Otávio (Visualizado) e ordem 2 com Beatriz: Otávio está na vez, e Beatriz está "Na fila". | Obrigatório |
| RN906 | Um envelope criado por um fluxo que é cancelado ou recusado leva a etapa que o criou a erro, com o motivo: o nó Assinatura eletrônica na execução do Spaceflow ou a tarefa Integração no fluxo da categoria. | O envelope da execução 25035 cancelado com o motivo "Fornecedor pediu revisão" leva o nó a Erro com esse motivo. | Obrigatório |
| RN907 | Um envelope sem credencial só pode ficar como rascunho. O envio pede uma credencial pronta (RN901). | O rascunho criado antes de conectar um provedor não tem "Enviar". | Obrigatório |
| RN908 | O documento do envelope deve ser PDF ou DOCX e respeitar o limite de tamanho do provedor: 10 MB na Adobe Acrobat Sign e 20 MB nos demais. | Um PDF de 14,2 MB é recusado na Adobe Acrobat Sign. | Obrigatório |

| Linha | Provedor | Cancelar | Atualizar status | Reenviar e-mail | Links de assinatura | Retorno do status |
|---|---|---|---|---|---|---|
| 1 | ClickSign | cancela também no provedor | consulta o provedor | reenvia | não gera | webhook da conta, cadastrado uma vez no portal |
| 2 | Certisign | cancela só no ENSPACE | não consulta | não reenvia | gera | webhook da conta, cadastrado uma vez no portal |
| 3 | D4Sign | cancela também no provedor | consulta o provedor | reenvia | não gera | automático, por envelope |
| 4 | DocuSign | cancela também no provedor | consulta o provedor | reenvia | não gera | automático, por envelope |
| 5 | Adobe Acrobat Sign | cancela também no provedor | consulta o provedor | reenvia | gera | automático, por envelope |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone e caixa de marcar com nome acessível, modal com título e descrição, foco visível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |
| Exceção deste épico | O logo de cada app é o arquivo do produto (`/images/integrations/<app>.png` e a versão `_dark`), que troca com o tema. Estado nunca só por cor: o nó, a faixa, o selo e o participante dizem o estado em texto. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Provedor | O serviço de assinatura eletrônica conectado ao ENSPACE | ClickSign, Certisign, D4Sign, DocuSign, Adobe Acrobat Sign |
| Integração antiga | A integração de assinatura de antes do módulo, ainda usada pelo fluxo da categoria | "Integrações antigas de assinatura" |
| Faixa de estado | O bloco abaixo do título do envelope que diz o que aconteceu, quem fez, o motivo e o efeito no fluxo | (sem nome na tela) |
| Na fila | O participante cuja ordem ainda não chegou (RN905) | "Na fila" |
| Webhook da conta | O endereço que a pessoa cadastra 1 vez no portal do provedor para o status voltar ao ENSPACE | "Cadastre o webhook no portal da {provedor}" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | O épico sai inteiro com o módulo, ou cada parte pode ir ao cliente quando fica pronta? | produto | Saindo por parte, cada parte precisa conviver com a tela antiga da outra |
| S901 | A tabela da RN904 e os limites da RN908 são os do módulo na prévia de 18/11/2026 e do teste de assinadores da mesma data. | dev do módulo | Se um provedor ganhar ou perder um recurso, só a tabela muda; as telas leem dela |
| P902 | A loja de apps (parte 1) muda também os cards da OpenAI, do Plugin do Word, do SendGrid e do Twilio. Ela entra neste épico ou vira um épico próprio da loja? | redatora | Num épico próprio, a busca, o filtro e o card dos outros apps saem daqui, e este épico fica só com a seção "Assinatura eletrônica" |

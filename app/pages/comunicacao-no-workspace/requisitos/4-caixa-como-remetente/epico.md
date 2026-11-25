# Épico: Caixa do workspace como remetente

**O que é:** as Caixas de E-mail do workspace, que hoje só recebem, passam a enviar. Quem administra escolhe, na aba
Configurações da central E-mails, quais caixas entram no campo De; quem escreve escolhe entre a própria conta do
Outlook e essas caixas. Quem não tem o Correio do Outlook integrado escreve pelo ENSPACE com uma caixa.

**Onde vale:** a aba Configurações da central E-mails, o compositor "Nova Mensagem" aberto de qualquer tela, a Mail Box
do item e a aba Mensagens da central.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/, aprovado em 24/11/2026. Na barra de
baixo, escolha "Fase: 2 · Remetente" e "Perfil: Admin"; o cenário "Sem Outlook integrado" mostra o "De" só com as
caixas. Os textos nos 3 idiomas estão no protótipo: o controle "Idioma" da barra de baixo troca entre PT, EN e ES.

**Fora do escopo:** a configuração da própria caixa (aba Caixas de E-mail, que não muda); o registro do e-mail enviado
sem item e a aba Mensagens por pessoa e permissão (épico "E-mail sem item e lista por permissão"); a integração com o
Google.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Caixas como remetente na aba Configurações](parte-1-caixas-na-configuracao.md) | O bloco "Caixas como remetente", com 1 chave por caixa, e a gravação da escolha | | O "De" só lista as caixas que esta parte liga |
| [2. Escolher o De no compositor](parte-2-escolher-o-de.md) | O "De" com a conta do Outlook e as caixas, o envio pela caixa, o remetente na Mail Box e na aba Mensagens e o caso sem Correio do Outlook | 1 | Lê a escolha que a parte 1 grava |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Uma caixa do workspace só pode ser remetente se estiver marcada "Disponível no campo De". | "Atendimento jurídico" ligada e "Compras" desligada: o "De" oferece só "Atendimento jurídico". | Obrigatório |

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

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Caixa do workspace | Endereço de e-mail do workspace cadastrado na aba Caixas de E-mail. Hoje recebe e-mails (Central de Atendimento) e inicia fluxo | "Caixa do workspace"; o grupo "Caixas do workspace" no "De" |
| Remetente | O endereço que aparece no De do e-mail enviado: a conta do Outlook da pessoa ou uma caixa do workspace | "De" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | O envio de hoje, pela integração do Correio do Outlook, sai da conta de cada pessoa. Que caminho envia pela caixa do workspace, e ele vale para cada provedor de caixa? | dev do back | Define a obra do envio pela caixa e se alguma caixa fica fora do "De" |
| P902 | Quem envia por qual caixa: todo membro, um cargo ou os membros ligados à caixa? No protótipo, cada pessoa vê cada caixa ligada. | produto | Com restrição, o "De" de cada pessoa mostra só as caixas permitidas, e a parte 2 ganha a regra |
| P903 | O cliente que usa Google, sem o Correio do Outlook, fica atendido pelas caixas do workspace, ou a integração com o Google entra no roteiro? | produto | Sem a integração, o "De" só com as caixas é o caminho desse cliente para escrever pelo ENSPACE |

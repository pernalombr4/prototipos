# Épico: Melhorar o uso de IA no campo HTML

**O que é:** quem escreve no campo Editor de texto HTML pede ajuda ao BENI sem sair do campo (pelo botão IA, pela
seleção, pelo "/" ou pelo Ctrl J), vê a proposta dentro do texto e decide se aceita. A IA usa os modelos do ENSPACE
em en-credits; a chave de uma conta própria só muda quem paga.

**Onde vale:** o campo Editor de texto HTML em qualquer lugar em que for utilizado, seja nativamente ou de modo
personalizado (em formulários), e o modal "Chaves de IA do workspace", que abre a partir do campo.

**Depende de:** a demanda do front do campo Editor de texto HTML, que traz a barra fixa, a barra da seleção, o menu
"/" e a alça do bloco. Este épico ocupa os lugares que ela reserva para a IA: a 1ª posição das 2 barras, o topo do
"/" e o item "Perguntar ao BENI" da alça.

**Protótipo:** https://pernalombr4.github.io/prototipos/ia-no-campo-html/, aprovado em 14/10/2026 e revisado até
20/10/2026. Os estados se abrem pela barra inferior: "Sem chave (en-credits)", "Chave da OpenAI", "3 chaves
próprias", "Sem en-credits" e "Responde com erro". Os textos nos 3 idiomas estão no `textos.ts` de
https://github.com/pernalombr4/prototipos/tree/main/app/pages/ia-no-campo-html. A barra inferior do protótipo
(estado, tema, idioma, "Por trás") é ferramenta de revisão e não entra no produto.

**Fora do escopo:** a casca da tela do item (menu lateral, barra do topo, painel do item, barra de folders), os
outros tipos de campo, o cadastro de agentes (Configurações › Agentes de IA), a regra de cobrança e recarga de
en-credits e a formatação do campo, que é da demanda do front.

**Relevância** (nas tarefas, entre parênteses no fim do requisito; sem parênteses, é Obrigatório): Obrigatório, o
dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer
quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Pedir ao BENI e aceitar a proposta](parte-1-pedir-e-aceitar.md) | O botão "IA" nas 2 barras, a caixa do BENI com o pedido livre e as ações sobre o trecho, e a proposta dentro do texto com "Aceitar" e "Descartar" | | É a base: sem ela, nenhuma outra parte se usa |
| [2. Editar o campo inteiro](parte-2-editar-o-campo-inteiro.md) | As ações sem seleção: "Editar o campo" e "Escrever", aplicadas ao campo todo | 1 | Acrescenta ações à caixa; o "/" da parte 5 mostra estas ações |
| [3. O que a IA lê e anexo](parte-3-o-que-a-ia-le.md) | O indicador do que a IA lê, com "Usar os campos do item", e o anexo de arquivo | 1 | Muda só o que vai no pedido; corre em paralelo com as partes 2 e 4 |
| [4. Pedidos salvos](parte-4-pedidos-salvos.md) | "Salvar pedido" na proposta e o grupo "Seus pedidos salvos" na caixa | 1 | O "/" da parte 5 mostra os pedidos salvos |
| [5. Outras entradas](parte-5-outras-entradas.md) | O Ctrl J, o grupo "BENI (IA)" no "/", "Perguntar ao BENI" na alça do bloco e o placeholder do campo vazio | 2 e 4 | O "/" e a alça vêm da demanda do front, que pode chegar depois da base |
| [6. Modelo](parte-6-modelo.md) | O seletor de modelo, com o Auto e os modelos por empresa, e o modelo que respondeu na proposta | 1 | O seletor é a porta das partes 7, 8 e 9 |
| [7. Agentes](parte-7-agentes.md) | O seletor de agente, o grupo "Pedir a um agente" e o modelo do perfil do agente | 6 | Depende do cadastro de agentes e marca o modelo do agente no seletor da parte 6 |
| [8. Chaves de IA do workspace](parte-8-chaves-de-ia.md) | O modal das chaves, com 1 cartão por empresa e o passo da chave, e a conta que paga no seletor e na proposta | 6 | Fica fora da base porque pede a rota das chaves; a parte 9 usa o modal |
| [9. Sem en-credits](parte-9-sem-en-credits.md) | O aviso na caixa quando os en-credits acabam, com a chave própria, e o pedido que espera e roda ao conectar | 6 e 8 | Precisa do seletor de modelo e do modal das chaves |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN008 | O Auto escolhe o modelo pelo tipo de pedido; sem en-credits, escolhe só entre os modelos de contas com chave conectada. | Sem en-credits e com a chave da Anthropic, o Auto responde com um modelo Claude. | Obrigatório |

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
| Exceção deste épico | O texto que o BENI gera continua no idioma do workspace; só a interface troca de idioma. O BENI é tratado no masculino em cada texto ("o BENI"). |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| BENI | O assistente de IA do ENSPACE | "BENI" |
| Caixa do BENI | A caixa que abre colada ao trecho ou à linha do cursor, com o pedido livre e as ações | sem rótulo; leitor de tela: "Caixa do BENI" |
| Proposta | O texto que o BENI gera, mostrado dentro do campo antes de gravar | "Aceitar", "Descartar" |
| en-credits | Os créditos do workspace com que o ENSPACE cobra o uso da IA | "en-credits" |
| Chave de conta própria | A chave de API de uma conta de IA do workspace (OpenAI, Anthropic, Google) | "Chave de API" |
| Auto | A opção do seletor de modelo em que o ENSPACE escolhe o modelo pelo pedido | "Auto" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P2 | Quem não administra o workspace vê "Usar a chave de uma conta própria" e o aviso com o botão de conectar? | produto | Nas partes 8 e 9, o botão de conectar vira um pedido a quem administra, para quem é membro |
| P8 | Qual o tamanho máximo do texto e do anexo enviados ao BENI, e o que a tela mostra quando passa? | time dev | Novo erro na caixa |

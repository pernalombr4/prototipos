# Épico: Contato da categoria

**O que é:** cada categoria ganha o cartão "Contato da categoria". Nele, quem administra escolhe de quais campos vêm o
nome e o e-mail de cada contato do item e o assunto com que o e-mail abre. Com o cartão salvo, o "Contato do item", o
submenu "E-mail" da lista e do quadro, a coluna "Contato", o Para do compositor e o lembrete da Agenda passam a usar
esses contatos e esse assunto. É dado novo na categoria: onde guardar fica com os devs. Depende do épico "E-mail com o
que o produto já tem", que entrega os atalhos com o contato tirado dos campos de e-mail do item.

**Onde vale:** Configurações › Estrutura › Categorias › a categoria (o 13º cartão e a página dele); a tela do item
(cartão "Contato do item" e Visão Geral); a lista e o quadro de itens; o modal "Evento" da Agenda; o compositor; a
central E-mails, aba Configurações, bloco "Contato do item".

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/, aprovado em 24/11/2026. Na barra de
baixo, escolha "2 · Remetente" no controle "Fase". "Ir para" › "Contato da categoria Contratos" abre o cartão; "Ir
para" › "Item CTR-00231" abre o item. Os textos nos 3 idiomas estão no protótipo: o controle "Idioma" da barra de baixo troca entre PT, EN e ES.

**Fora do escopo:** telefone e outros canais (o canal é só e-mail); o contato tirado dos campos de e-mail do item, sem
cartão (épico "E-mail com o que o produto já tem"); as sugestões de item pelo destinatário no compositor e na leitura
do e-mail, que usam este contato (épico "E-mail sem item e lista por permissão"); chave para ligar ou desligar os
atalhos, que não existe em épico algum.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Cartão "Contato da categoria"](parte-1-cartao-contato-da-categoria.md) | O 13º cartão do painel da categoria, com os contatos, as origens, o assunto com variáveis, a prévia e o Salvar | | Grava o contato que a parte 2 lê |
| [2. O contato da categoria nos atalhos](parte-2-contato-nos-atalhos.md) | O "Contato do item", o assunto, o submenu e a coluna da lista, o Para do compositor, a Agenda e o link da central usando o contato salvo | 1 | Lê o que a parte 1 grava |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Cada contato da categoria tem um "Nome do contato na tela", um campo de origem do nome e um campo de origem do e-mail. | Contratos: "Contato da contraparte" (nome no campo Contato da contraparte, e-mail no campo E-mail do contato) e "Requisitante" (sem nome, e-mail no E-mail do Requisitante). | Obrigatório |
| RN902 | A origem do e-mail só pode ser um campo E-mail da categoria, o subcampo E-mail de contato de um campo "Pessoa/Empresa" ou o E-mail do Requisitante, o campo padrão de cada categoria. | Em Fornecedores, servem "E-mail comercial", "Pessoa/Empresa › E-mail de contato" e "E-mail do Requisitante". | Obrigatório |
| RN903 | A tabela a seguir define o valor de cada variável do assunto. Variável sem valor no item fica vazia. Política: Única. | Linha 1 e 2: "{referencia} · {titulo}" em CTR-00231 vira "CTR-00231 · Contrato de manutenção predial". | Obrigatório |

| Linha | Variável | Trocada por |
|---|---|---|
| 1 | `{referencia}` | a referência do item |
| 2 | `{titulo}` | o nome do item |
| 3 | `{nome}` | o primeiro nome do contato |
| 4 | `{categoria}` | o nome da categoria |

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
| Contato da categoria | A regra que diz de quais campos vêm o nome e o e-mail de 1 contato de cada item da categoria | Cada linha do bloco "Quem é o contato" |
| Origem | O campo da categoria de onde vem o nome ou o e-mail do contato | Os seletores "Nome" e "E-mail" |
| Endereço do item | O e-mail próprio de cada item; o que chega nele aparece na Mail Box do item | Cc da prévia |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | Onde guardar o contato da categoria: na configuração em JSON que a categoria já tem, ou numa estrutura própria? | dev do back | O formato da gravação das 2 partes |
| P902 | Quem pode editar o cartão? Suposição S901: quem já acessa a configuração da categoria em Estrutura › Categorias. | produto | Com outro papel, o cartão pede permissão própria no cargo |
| P903 | Categoria sem o cartão salvo: o item continua com os contatos tirados dos campos de e-mail (como no épico "E-mail com o que o produto já tem"), ou mostra "Nenhum contato neste item" e a lista fica sem o submenu "E-mail", como a lógica descreve quando o contato falta? | produto | Na 2ª resposta, cada categoria precisa do cartão salvo antes do lançamento, ou os atalhos somem |
| P904 | No lançamento, o cartão de cada categoria abre preenchido com os contatos que o item já tinha (cada campo E-mail, cada "Pessoa/Empresa" e o Requisitante)? | produto | Sem o preenchimento, quem administra monta cada categoria do zero |
| P905 | Campo de origem excluído da categoria depois de salvo o cartão: o contato fica sem origem, o cartão avisa, ou a exclusão do campo é barrada? | produto e dev do back | A parte 1 ganha aviso ou validação; a parte 2 trata a origem que sumiu como vazia |

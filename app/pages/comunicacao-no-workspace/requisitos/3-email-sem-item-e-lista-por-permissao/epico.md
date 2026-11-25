# Épico: Gravar e-mail enviado sem item e filtrar Mensagens por permissão

**O que é:** o e-mail enviado pelo ENSPACE sem item passa a ficar gravado e aparece na aba Mensagens da central
E-mails. Quem escreve busca o item do e-mail entre as categorias que pode ver, no compositor ou depois do envio, na
leitura do e-mail. A aba Mensagens mostra a cada pessoa só os e-mails dos itens que ela vê e junta numa lista só os
e-mails dos itens e os enviados pelo sistema. Pede rotas e gravação novas no back. Depende do épico "Escrever e-mail de qualquer tela e central E-mails no menu", que entrega o compositor, o bloco "Item vinculado" e a aba Mensagens.

**Onde vale:** o compositor ("Nova Mensagem"), aberto do "Novo e-mail" da barra do topo, dos atalhos e da Mail Box; a
central E-mails, aba Mensagens (tabela, filtros, menu da linha e leitura no painel lateral); a Mail Box do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/, aprovado em 24/11/2026. Na barra de
baixo, escolha "2 · Remetente" no controle "Fase". Na tela Início, "Novo e-mail" mostra "Vincular a item (opcional)";
em E-mails › Mensagens, o filtro "Sem item" mostra o e-mail "Cadastro de fornecedor", e "Vincular a um item" abre a
leitura. O controle "Perfil" troca o olhar de quem administra e do membro. Os textos nos 3 idiomas estão no protótipo: o controle "Idioma" da barra de baixo troca entre PT, EN e ES.

**Fora do escopo:** o "De" com as caixas do workspace e a ajuda "Sem item vinculado, a resposta chega na caixa
<nome>, na Central de Atendimento." (épico "Enviar e-mail pelas Caixas de E-mail do workspace"); Encaminhar e a resposta na mesma
conversa (épico "Responder na mesma conversa e encaminhar e-mail"); "Vincular a tarefa" e a coluna Tarefa (épico "Vincular e-mail a uma tarefa"); a busca global (Ctrl K), que segue sem procurar itens; o e-mail enviado pelo app de e-mail da pessoa
(`mailto:`) sem o endereço do item em Cc, que segue fora do ENSPACE; itens de outro workspace.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Registro do e-mail enviado sem item](parte-1-registro-sem-item.md) | A gravação do e-mail enviado sem item, a ajuda do De, o aviso com "Ver em E-mails" e o e-mail sem item na aba Mensagens, com o filtro "Sem item" | | Cria o e-mail sem item que a parte 4 vincula |
| [2. Vincular a item no compositor](parte-2-vincular-no-compositor.md) | "Vincular a item (opcional)" com a busca entre categorias, Trocar e remover, as sugestões pelo destinatário e o Para com contatos de outros itens | | Constrói a busca de item que a parte 4 usa |
| [3. Aba Mensagens por permissão](parte-3-mensagens-por-permissao.md) | A aba Mensagens só com os e-mails dos itens que a pessoa pode ver | | Independe das outras; vem antes do vínculo na leitura, que mostra o item na mesma aba |
| [4. Vincular e trocar depois, na leitura](parte-4-vincular-na-leitura.md) | "Vincular a um item" e "Trocar" na leitura do e-mail, com sugestões e busca, e o aviso "E-mail vinculado" | 1, 2 | Vincula o e-mail que a parte 1 grava, com a busca da parte 2 |
| [5. Lista única com os e-mails do sistema](parte-5-lista-unica-do-sistema.md) | Os e-mails dos itens e os enviados pelo sistema numa lista, com ordem e paginação únicas; o filtro "Do sistema" deixa de trocar a fonte da tabela | | Risco isolado: pode não pedir back novo |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Só os itens que a pessoa pode ver, no workspace atual, aparecem na busca de item, nas sugestões de item e na aba Mensagens. O item sem permissão fica fora também da contagem. | CTR-00214, sem permissão para a pessoa, não aparece na busca por "CTR-00214", e a contagem "<m> de <n> itens" não o soma. | Obrigatório |
| RN902 | Cada e-mail tem 0 ou 1 item vinculado. | O e-mail "Cadastro de fornecedor" não tem item; o e-mail "CTR-00231 · Minuta revisada" tem CTR-00231. | Obrigatório |
| RN903 | O vínculo guarda o item pela referência: renomear o item mantém o vínculo. | CTR-00231 renomeado continua com os e-mails na Mail Box. | Obrigatório |
| RN904 | Um item é considerado sugestão para um e-mail quando um endereço do e-mail é o e-mail de um contato do item configurado no cartão "Contato da categoria" (épico "Escolher na categoria de onde vêm o nome e o e-mail do contato"). Cada e-mail tem até 3 sugestões. | Para marina.alves@example.com: CTR-00231, CTR-00219 e CTR-00207, os 3 contratos com Marina Alves no "Contato da contraparte". | Obrigatório |

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
| E-mail sem item | E-mail enviado pelo ENSPACE sem item vinculado | "Sem item" |
| Vínculo | A ligação do e-mail com 1 item: diz em que Mail Box o e-mail aparece | "Vincular a item", "Item vinculado" |
| E-mail do sistema | E-mail que uma tarefa ou um fluxo envia, hoje na tela E-mails Enviados | "Do sistema", "Sistema" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | Quem vê o e-mail sem item na aba Mensagens: só quem enviou, ou também outras pessoas (por exemplo, quem tem acesso à caixa usada, no épico "Enviar e-mail pelas Caixas de E-mail do workspace")? O protótipo mostra o e-mail sem item só a quem enviou. | produto | A regra de quem vê o e-mail sem item (parte 1) e de quem pode vinculá-lo (parte 4) |
| P902 | Qual critério ordena os 8 itens que mais combinam com o texto da busca: referência exata primeiro, nome, data de atualização? | produto e dev do back | A ordem dos resultados no compositor e na leitura |

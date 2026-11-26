# Requisitos: comunicação no workspace

6 épicos e 1 documento avulso. Cada épico sobe sozinho e vira 1 card `user_story`, com as partes como tarefas. O
épico 1 só mexe na tela, com o back de hoje; os épicos 2 a 6 pedem back novo (skill `requisitos`, "Épico pelo
esforço"). O documento 7 também só mexe na tela, mas fica à parte porque o botão ainda não tem desenho. Protótipo: https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/

| Ordem | Épico | O que entrega | Lado | Depende de |
|---|---|---|---|---|
| 1 | [Escrever e-mail de qualquer tela e central E-mails no menu](1-com-o-que-ja-existe/epico.md) | O e-mail, o WhatsApp e o SMS de cada tela de uso, a Mail Box em todo item, o link do formulário público e a central E-mails no menu | Só tela | |
| 2 | [Escolher na categoria de onde vêm o nome e o e-mail do contato](2-contato-da-categoria/epico.md) | O cartão que diz de quais campos vêm o nome, o e-mail e o telefone do contato de cada categoria, o assunto do e-mail e o texto pronto do WhatsApp e do SMS; os atalhos passam a ler esse contato | Novo: dado na categoria | 1 |
| 3 | [Gravar e-mail enviado sem item e filtrar Mensagens por permissão](3-email-sem-item-e-lista-por-permissao/epico.md) | O e-mail sem item gravado, a busca de item para vincular, vincular e trocar depois, a aba Mensagens por permissão e a lista única com os e-mails do sistema | Novo: registro e rotas | 1; 2 só para as sugestões pelo destinatário |
| 4 | [Enviar e-mail pelas Caixas de E-mail do workspace](4-caixa-como-remetente/epico.md) | As caixas do workspace no "De" do compositor, escolhidas por quem administra | Novo: envio por caixa | 1 |
| 5 | [Responder na mesma conversa e encaminhar e-mail](5-conversa-e-encaminhar/epico.md) | A resposta na mesma conversa do e-mail original e o "Encaminhar" | Novo | 1 |
| 6 | [Vincular e-mail a uma tarefa](6-email-da-tarefa/epico.md) | A tarefa vinculada ao e-mail, a Mail Box própria da tarefa e a coluna Tarefa | Novo: vínculo com a tarefa | 1; 3 para a tarefa sem item |
| 7 | [Botão de e-mail no cartão do quadro de itens e de tarefas](7-botao-no-cartao-do-quadro/REQUISITOS.md) (documento avulso, Opcional) | O botão de e-mail, de WhatsApp e de SMS no cartão do quadro de itens e de tarefas, além do clique direito | Só tela; o botão ainda sem desenho | 1 |

## As partes de cada épico

| Épico | Partes |
|---|---|
| 1. Escrever e-mail de qualquer tela e central E-mails no menu | [1. Compositor e Novo e-mail na barra do topo](1-com-o-que-ja-existe/parte-1-compositor-e-novo-email.md) · [2. Mail Box em todo item e na tarefa](1-com-o-que-ja-existe/parte-2-mail-box-do-item-e-da-tarefa.md) · [3. Atalho de e-mail, WhatsApp e SMS no item](1-com-o-que-ja-existe/parte-3-atalho-no-item.md) · [4. Atalho na lista e no quadro de itens](1-com-o-que-ja-existe/parte-4-atalho-na-lista-e-no-quadro.md) · [5. Atalho nas tarefas](1-com-o-que-ja-existe/parte-5-atalho-nas-tarefas.md) · [6. Lembrete na Agenda](1-com-o-que-ja-existe/parte-6-lembrete-na-agenda.md) · [7. Link de formulário público](1-com-o-que-ja-existe/parte-7-link-de-formulario-publico.md) · [8. Central E-mails](1-com-o-que-ja-existe/parte-8-central-emails.md) · [9. Aba Mensagens](1-com-o-que-ja-existe/parte-9-aba-mensagens.md) · [10. E-mails do sistema na aba Mensagens](1-com-o-que-ja-existe/parte-10-emails-do-sistema.md) |
| 2. Escolher na categoria de onde vêm o nome e o e-mail do contato | [1. Cartão "Contato da categoria"](2-contato-da-categoria/parte-1-cartao-contato-da-categoria.md) · [2. O contato da categoria nos atalhos](2-contato-da-categoria/parte-2-contato-nos-atalhos.md) |
| 3. Gravar e-mail enviado sem item e filtrar Mensagens por permissão | [1. Registro do e-mail enviado sem item](3-email-sem-item-e-lista-por-permissao/parte-1-registro-sem-item.md) · [2. Vincular a item no compositor](3-email-sem-item-e-lista-por-permissao/parte-2-vincular-no-compositor.md) · [3. Aba Mensagens por permissão](3-email-sem-item-e-lista-por-permissao/parte-3-mensagens-por-permissao.md) · [4. Vincular e trocar depois, na leitura](3-email-sem-item-e-lista-por-permissao/parte-4-vincular-na-leitura.md) · [5. Lista única com os e-mails do sistema](3-email-sem-item-e-lista-por-permissao/parte-5-lista-unica-do-sistema.md) |
| 4. Enviar e-mail pelas Caixas de E-mail do workspace | [1. Caixas como remetente na aba Configurações](4-caixa-como-remetente/parte-1-caixas-na-configuracao.md) · [2. Escolher o De no compositor](4-caixa-como-remetente/parte-2-escolher-o-de.md) |
| 5. Responder na mesma conversa e encaminhar e-mail | [1. Responder na mesma conversa](5-conversa-e-encaminhar/parte-1-responder-na-conversa.md) · [2. Encaminhar](5-conversa-e-encaminhar/parte-2-encaminhar.md) |
| 6. Vincular e-mail a uma tarefa | [1. Vincular a tarefa no compositor](6-email-da-tarefa/parte-1-vincular-a-tarefa.md) · [2. Mail Box da tarefa](6-email-da-tarefa/parte-2-mail-box-da-tarefa.md) · [3. A tarefa na aba Mensagens e na Mail Box do item](6-email-da-tarefa/parte-3-tarefa-na-lista.md) · [4. Tarefa sem item](6-email-da-tarefa/parte-4-tarefa-sem-item.md) |

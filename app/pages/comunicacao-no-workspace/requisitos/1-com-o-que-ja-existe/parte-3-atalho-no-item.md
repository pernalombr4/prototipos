# 3. Atalho de e-mail, WhatsApp e SMS no item

**Objetivo:** com o item aberto, a pessoa escreve ao contato do item em 1 clique, por e-mail, pelo WhatsApp ou por SMS, pelo
cartão "Contato do item" ou pelo ícone ao lado do campo de e-mail e do campo de telefone, sem configurar nada.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo; 2. Mail Box em todo item e na tarefa.

**Onde vale:** a tela do item: o painel esquerdo e a Visão Geral.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Abra CTR-00231: o cartão "Contato
do item" fica no alto do painel esquerdo; o ícone de e-mail fica ao lado do campo "E-mail do contato", e os do
WhatsApp e do SMS, ao lado de "Telefone do contato", na Visão Geral. Para ver o painel "Enviar SMS", abra CTR-00230,
que tem celular.

## Cartão "Contato do item" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | O painel esquerdo do item deve ter o cartão "Contato do item" no alto, acima de Identificação, com os contatos do item (RN907). | Em CTR-00231, o cartão mostra "E-mail do contato", "Telefone do contato", "E-mail do financeiro" e "Requisitante". | Essencial | Obrigatório |
| RF202 | Com mais de 1 contato, o cartão deve ter o seletor "Para quem", com o 1º contato escolhido ao abrir o item (RN908). | Em CTR-00231, o seletor abre em "E-mail do contato" e troca para "Requisitante". | Essencial | Obrigatório |
| RF203 | Cada contato deve mostrar o nome e, embaixo, o e-mail e o telefone; sem nome, mostra o e-mail ou o telefone e, embaixo, o nome do campo de onde vem. | Em FOR-00040, o contato de Pessoa/Empresa mostra "Rita Campos", o e-mail e o telefone; em CTR-00231, o de "Telefone do contato" mostra o telefone e "Telefone do contato". | Importante | Obrigatório |
| RF204 | O cartão deve ter o botão E-mail dividido, com os 2 caminhos do atalho para o contato escolhido (RN909, RN911, RN912). | O clique no corpo abre o compositor vinculado a CTR-00231, com o contato em Para; a seta abre o app com o endereço do item em Cc. | Essencial | Obrigatório |
| RF205 | Com a conta do Outlook integrada, a linha embaixo do botão deve dizer "O e-mail sai pelo ENSPACE e fica na Mail Box de <referência>. A seta abre o seu app de e-mail.". | Em CTR-00231, a linha cita CTR-00231. | Importante | Obrigatório |
| RF206 | Sem a conta do Outlook integrada, o botão E-mail deve abrir direto o app, com a linha "Abre o seu app de e-mail com o destinatário preenchido e o endereço do item em cópia." (RN910). | No cenário "Sem Outlook integrado", o clique abre o app, sem o compositor. | Essencial | Obrigatório |
| RF207 | No item sem contato preenchido, o cartão deve mostrar "Nenhum contato neste item" e "Os campos de contato deste item estão vazios.", sem os botões E-mail, WhatsApp e SMS. | Um item de Contratos com os campos de e-mail e de telefone vazios e sem E-mail do Requisitante mostra o vazio. | Importante | Obrigatório |
| RF208 | Com o contato escolhido sem e-mail, o botão E-mail deve ficar indisponível e o cartão deve mostrar "Este contato não tem e-mail cadastrado." (RN913). | Em CTR-00231, com "Telefone do contato" escolhido, o botão E-mail fica cinza e a linha aparece. | Importante | Obrigatório |

## WhatsApp no cartão "Contato do item" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF221 | O cartão deve ter o botão "WhatsApp" embaixo do botão E-mail, à esquerda do botão "SMS", que abre a conversa com o telefone do contato escolhido e o texto pronto do item (RN917, RN920). | Em CTR-00231, com "Telefone do contato" escolhido, o botão abre a conversa com 551134567710 e "Olá. Escrevo sobre CTR-00231 · Contrato de manutenção predial.". | Essencial | Obrigatório |
| RF222 | A dica do botão deve dizer "Abre a conversa no WhatsApp com o texto pronto. Revise o texto e envie. O ENSPACE não registra a conversa.". | A dica aparece ao passar o mouse e ao focar o botão. | Importante | Obrigatório |
| RF223 | Com o contato escolhido sem telefone, o botão deve ficar indisponível com o motivo "Sem telefone cadastrado", e o cartão deve mostrar "Sem telefone: o WhatsApp e o SMS estão indisponíveis." (RN921). | Em CTR-00231, com "E-mail do contato" escolhido, os botões WhatsApp e SMS ficam cinza e a linha aparece. | Importante | Obrigatório |
| RF224 | Com o telefone inválido (RN919), o botão deve ficar indisponível com o motivo "Telefone inválido", e o cartão deve mostrar "Telefone inválido: o WhatsApp e o SMS estão indisponíveis." e o botão "Corrigir telefone", que abre a Visão Geral com o foco no campo do telefone. | Em CTR-00226, com "Telefone do contato" (9210-8834) escolhido, a linha aparece, e "Corrigir telefone" põe o foco no campo. | Importante | Obrigatório |

## SMS no cartão "Contato do item" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF241 | O cartão deve ter o botão "SMS" ao lado do botão WhatsApp, do mesmo tamanho, que abre o painel "Enviar SMS" com o telefone do contato escolhido e o texto pronto do item (RN924, RN925). | Em CTR-00230, com "Telefone do contato" escolhido, o botão abre o painel com "+55 11 99876-1203" e o texto pronto. | Essencial | Obrigatório |
| RF242 | A dica do botão deve dizer "Abre as opções de envio por SMS, com o texto pronto. A mensagem sai do seu celular. O ENSPACE não registra o SMS.". | A dica aparece ao passar o mouse e ao focar o botão. | Importante | Obrigatório |
| RF243 | Com o contato escolhido sem celular, o botão SMS deve ficar indisponível com o motivo: "Sem telefone cadastrado", "Telefone inválido" ou "Telefone fixo não recebe SMS" (RN926). | Em CTR-00231, "Telefone do contato" (+55 11 3456-7710) deixa o SMS cinza com "Telefone fixo não recebe SMS", e o WhatsApp disponível. | Importante | Obrigatório |

## Painel "Enviar SMS" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF251 | O painel, o mesmo em cada atalho de SMS (item, lista e quadro, tarefas, Agenda e link de formulário), deve ter o título "Enviar SMS para <nome>" ("Enviar SMS" sem nome) e a descrição "Escolha como enviar. A mensagem sai do seu celular, pelo seu plano. O ENSPACE não envia nem registra o SMS.". | Em T-1042, o título é "Enviar SMS para Bruno Teixeira"; em CTR-00230, o contato "Telefone do contato" não tem nome, e o título é "Enviar SMS". | Essencial | Obrigatório |
| RF252 | O campo "Para" deve mostrar o nome e o número no formato "+55 11 99876-1203", com o botão "Copiar o número", que vira "Copiado" por 2 segundos e mostra o aviso "Número copiado". Sem número (link do formulário), o campo mostra "Você escolhe o destinatário no app de SMS." (RN925). | "Copiar o número" põe "+55 11 99876-1203" na área de transferência. | Essencial | Obrigatório |
| RF253 | O campo "Mensagem" deve trazer o texto pronto, que a pessoa pode mudar, com a contagem "<N> caracteres · <M> SMS" e a ajuda do limite: "Cabem 160 caracteres por SMS. A mensagem maior chega dividida em partes." ou, com acento, "O texto tem acento: cabem 70 caracteres por SMS. A mensagem maior chega dividida em partes." (RN927). | O texto de CTR-00231 mostra "62 caracteres · 1 SMS" e a ajuda do limite de 70; trocar "Olá" por "Ola" troca a ajuda para a de 160. | Importante | Obrigatório |
| RF254 | O botão principal deve ser "Abrir no app de SMS", que abre o link `sms:` com o número e o texto do campo "Mensagem" (RN924). Embaixo, a ajuda "No celular e no Mac, abre o app de mensagens com o número e o texto. No Windows, abre o app definido para SMS, quando houver." | Em CTR-00230, o botão abre `sms:+5511998761203?body=` com o texto codificado. Com a mensagem vazia, o botão fica indisponível. | Essencial | Obrigatório |
| RF255 | Embaixo, a seção "Outros caminhos" deve ter 3 linhas, cada uma com ícone, título, descrição e botão: "Abrir no celular", com "Mostrar o código"; "Copiar a mensagem", com "Copiar"; e "Google Messages Web", com "Abrir". | A seção mostra as 3 linhas nessa ordem. | Essencial | Obrigatório |
| RF256 | "Mostrar o código" deve abrir, na própria linha, o QR code do link de RF254, e virar "Ocultar o código". A descrição diz "Aponte a câmera do celular para o código. O app de SMS abre com o número e o texto.". O código é gerado no navegador, sem serviço de fora; a biblioteca fica com o dev. | Lido pela câmera do celular, o código abre o app de SMS com "+55 11 99876-1203" e o texto. | Essencial | Obrigatório |
| RF257 | "Copiar" deve copiar o texto do campo "Mensagem", com a descrição "No Windows, o Vincular ao Celular envia SMS pelo seu celular: copie o número e a mensagem e cole no app." e o aviso "Mensagem copiada". | "Copiar" põe o texto na área de transferência e vira "Copiado". | Importante | Obrigatório |
| RF258 | "Abrir" do Google Messages Web deve copiar a mensagem e abrir `https://messages.google.com/web/conversations/new` numa aba nova, com a descrição "Para celular Android pareado. Copia a mensagem e abre uma conversa nova: cole o número e a mensagem." O site não aceita número nem texto no link. | O site abre na conversa nova, e a mensagem está na área de transferência. | Desejável | Desejável |

## Ícone ao lado do campo de e-mail (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF211 | Na Visão Geral, cada campo do tipo E-mail e cada E-mail de contato de Pessoa/Empresa deve ter o ícone de e-mail ao lado, sem configuração na categoria. | Em CTR-00231, "E-mail do contato" e "E-mail do financeiro" têm o ícone. | Essencial | Obrigatório |
| RF212 | A dica do ícone deve dizer "Enviar e-mail para <nome do campo>". | Em CTR-00231, a dica diz "Enviar e-mail para E-mail do contato". | Importante | Obrigatório |
| RF213 | O ícone deve abrir os 2 caminhos do atalho para o e-mail escrito no campo, com o item vinculado (RN909, RN911, RN912). | O menu mostra "Escrever pelo ENSPACE" e "Abrir no meu app de e-mail"; o compositor abre com o e-mail do campo em Para. | Essencial | Obrigatório |
| RF214 | Com o campo vazio ou com um e-mail inválido, o ícone deve ficar indisponível com o motivo "Sem e-mail cadastrado" (RN913). | Em CTR-00230, "E-mail do financeiro" vazio mostra o ícone cinza com a dica "Sem e-mail cadastrado". | Importante | Obrigatório |

## Ícone ao lado do campo de telefone (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF231 | Na Visão Geral, cada campo de telefone (RN918) deve ter o ícone do WhatsApp ao lado, sem configuração na categoria, com a dica "WhatsApp para <nome do campo>". | Em CTR-00231, "Telefone do contato" tem o ícone, com a dica "WhatsApp para Telefone do contato". | Essencial | Obrigatório |
| RF232 | O ícone deve abrir a conversa com o número escrito no campo e o texto pronto do item (RN917, RN919, RN920). | Em CTR-00231, o ícone abre `https://wa.me/551134567710?text=` com o texto pronto. | Essencial | Obrigatório |
| RF233 | Com o campo vazio ou com telefone inválido, o ícone deve ficar indisponível com o motivo "Sem telefone cadastrado" ou "Telefone inválido" (RN921). | Em CTR-00226, "Telefone do contato" com 9210-8834 mostra o ícone cinza, com a dica "Telefone inválido". | Importante | Obrigatório |
| RF234 | Ao lado do ícone do WhatsApp, cada campo de telefone deve ter o ícone do SMS, com a dica "SMS para <nome do campo>", que abre o painel "Enviar SMS" com o número escrito no campo e o texto pronto do item (RN924). | Em CTR-00230, "Telefone do contato" tem o ícone, com a dica "SMS para Telefone do contato". | Essencial | Obrigatório |
| RF235 | Com o campo vazio, com telefone inválido ou com telefone fixo, o ícone do SMS deve ficar indisponível com o motivo (RN926). | Em CTR-00231, o ícone do SMS fica cinza com "Telefone fixo não recebe SMS", e o do WhatsApp continua disponível. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | O campo de e-mail que não está no formulário da Visão Geral (Editar ou Geral da categoria) continua contato do item, mesmo sem a pessoa conseguir preenchê-lo na tela do item? | produto | Se não, a lista de contatos lê só os campos do formulário da Visão Geral |

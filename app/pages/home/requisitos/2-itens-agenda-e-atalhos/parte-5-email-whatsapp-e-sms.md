# 5. E-mail, WhatsApp e SMS

**Objetivo:** quem adiciona os widgets vê na Home os e-mails que enviou de um item, escreve um e-mail novo e abre uma conversa
no WhatsApp ou um SMS a partir de um número digitado.

**Depende de:** o épico Home em widgets, com Categorias e tarefas; o épico "Enviar e-mail, WhatsApp e SMS de qualquer
tela e central Comunicações no menu", que entrega a central Comunicações, o compositor "Nova Mensagem", o botão "Novo e-mail" da barra do topo e o
painel "Enviar SMS".

**Onde vale:** os widgets E-mail, WhatsApp e SMS, no grupo Comunicação do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". Os 3 widgets se
adicionam em Personalizar › Adicionar widget › Comunicação. A central Comunicações, o compositor e o painel "Enviar SMS" estão no
protótipo https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/; na Home, o clique mostra o aviso do que
abre no produto, com o link exato.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN401 | Os e-mails do widget E-mail são os que a pessoa enviou com item vinculado, os mesmos da lista da central Comunicações com "Enviado por" igual à pessoa, até 5, do mais recente ao mais antigo. O e-mail enviado sem item fica só no Outlook de quem enviou e não entra. | O e-mail de há 35 minutos vem antes do de ontem; o enviado sem item não aparece. | Obrigatório |
| RN402 | O número do WhatsApp e do SMS é feito só dos dígitos digitados, sem os zeros do começo; com 10 ou 11 dígitos, o sistema acrescenta o 55 do Brasil; com menos de 10, o número é inválido. | "11 98765-4321" vira 5511987654321; "1234" é inválido. | Obrigatório |
| RN403 | Telefone fixo é o número do Brasil com DDD e 8 dígitos, 12 dígitos com o 55. Telefone fixo não recebe SMS; o widget WhatsApp aceita o telefone fixo. | "+55 11 3456-7710" é fixo; "+55 11 98765-4321" é celular. | Obrigatório |
| RN404 | O ENSPACE não envia nem registra a conversa do WhatsApp e o SMS: quem envia é a pessoa, pela conta e pelo celular dela. | Depois do envio, nada aparece no item nem na central Comunicações. | Obrigatório |
| RN405 | Os widgets E-mail, WhatsApp e SMS ficam fora da Home padrão: cada pessoa os adiciona pelo catálogo. | Num workspace novo, a Home abre sem os 3 widgets. | Obrigatório |

## No catálogo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | O catálogo deve ter o grupo "Comunicação", com a descrição "O e-mail, o WhatsApp e o SMS, à mão na Home." e os widgets "E-mail" ("Os e-mails que você enviou de um item e o botão para escrever um novo."), "WhatsApp" ("Digite o número e abra a conversa no WhatsApp.") e "SMS" ("Digite o número e abra o envio por SMS no celular."). | Personalizar › Adicionar widget mostra "Comunicação", com "3 opções", entre "Telas e atalhos" e "Equipe e notas"; o grupo abre com E-mail, WhatsApp e SMS. | Essencial | Obrigatório |

## E-mail (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF402 | O widget E-mail deve listar os e-mails da pessoa (RN401), com o assunto, "Para" e o endereço, a referência e o título do item, e há quanto tempo foi enviado. | Exemplo: "Minuta do aditivo de locação", "Para carla.prado@example.com · #23203 · Locação do galpão de Jundiaí", "há 35 min". | Essencial | Obrigatório |
| RF403 | O clique na linha deve abrir a leitura do e-mail na central Comunicações, como o clique na linha da lista da central. | Clicar em "Minuta do aditivo de locação" abre a leitura desse e-mail. | Importante | Obrigatório |
| RF404 | O cabeçalho do widget deve ter o botão só de ícone "Abrir Comunicações", que abre a central Comunicações. | O clique troca a Home pela central Comunicações. | Importante | Desejável |
| RF405 | Sem e-mail enviado, o widget deve mostrar "Os e-mails que você enviar de um item aparecem aqui.". | No workspace novo, o widget mostra o texto e o botão "Enviar e-mail". | Importante | Obrigatório |
| RF406 | Embaixo da lista, o widget deve ter o botão "Enviar e-mail", que abre o compositor "Nova Mensagem" sem item vinculado, como o "Novo e-mail" da barra do topo. Sem a conta do Outlook integrada, o botão abre o app de e-mail do computador, como os outros atalhos de e-mail. | O clique abre o compositor com a conta do Outlook da pessoa no De e o Para vazio; sem a integração, abre o app de e-mail. | Essencial | Obrigatório |
| RF407 | Embaixo do botão, o widget deve mostrar "O e-mail sai da sua conta do Outlook. Sem item vinculado, ele não aparece nesta lista." (RN401). | O texto aparece embaixo do botão. | Importante | Obrigatório |

## WhatsApp (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF408 | O widget WhatsApp deve ter o campo "Número", com o exemplo "+55 11 91234-5678", o campo "Mensagem", opcional, com o exemplo "Opcional. Você revisa antes de enviar.", e o botão "Abrir no WhatsApp". | O widget abre com os 2 campos vazios e o botão disponível. | Essencial | Obrigatório |
| RF409 | Com o campo Número vazio, o campo deve mostrar a ajuda "Sem número, você escolhe a conversa no WhatsApp.". | Apagar o número faz a ajuda voltar. | Importante | Obrigatório |
| RF410 | Com o número inválido (RN402), o campo deve mostrar o erro "Número inválido. Informe o DDD e o número.", e o botão deve ficar indisponível, com o erro no nome acessível. | "1234" mostra o erro, e o clique no botão não abre nada. | Essencial | Obrigatório |
| RF411 | "Abrir no WhatsApp" deve abrir numa aba nova `https://wa.me/<número>?text=<mensagem>`; sem número, `https://wa.me/?text=<mensagem>`, que abre a escolha da conversa. Sem mensagem, o link vai sem o `?text=`. | "11 98765-4321" e "Bom dia" abrem `https://wa.me/5511987654321?text=Bom%20dia`; "11 3456-7710" abre `https://wa.me/551134567710`. | Essencial | Obrigatório |
| RF412 | Enter no campo Número deve abrir o WhatsApp, como o botão. | Digitar o número e apertar Enter abre o WhatsApp. | Desejável | Desejável |
| RF413 | Embaixo do botão, o widget deve mostrar "A mensagem sai da sua conta do WhatsApp. O ENSPACE não registra a conversa." (RN404). | O texto aparece embaixo do botão. | Importante | Obrigatório |

## SMS (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF414 | O widget SMS deve ter o campo "Número", com o exemplo "+55 11 91234-5678", o campo "Mensagem", opcional, com o exemplo "Opcional. Você revisa antes de enviar.", e o botão "Enviar SMS". | O widget abre com os 2 campos vazios e o botão disponível. | Essencial | Obrigatório |
| RF415 | Com o campo Número vazio, o campo deve mostrar a ajuda "Sem número, você escolhe o contato no app de SMS.". | Apagar o número faz a ajuda voltar. | Importante | Obrigatório |
| RF416 | Com o número inválido (RN402), o campo deve mostrar o erro "Número inválido. Informe o DDD e o número."; com telefone fixo (RN403), o erro "Telefone fixo não recebe SMS. Informe um celular.". Nos 2 casos, o botão deve ficar indisponível, com o erro no nome acessível. | "1234" e "11 3456-7710" mostram o erro de cada caso, e o clique no botão não abre nada. | Essencial | Obrigatório |
| RF417 | "Enviar SMS" deve abrir o painel "Enviar SMS" com o número e a mensagem; sem número, o painel abre sem destinatário, com a mensagem. | "11 98765-4321" e "Bom dia" abrem o painel com "+55 11 98765-4321" e "Bom dia". | Essencial | Obrigatório |
| RF418 | Enter no campo Número deve abrir o painel "Enviar SMS", como o botão. | Digitar o número e apertar Enter abre o painel. | Desejável | Desejável |
| RF419 | Embaixo do botão, o widget deve mostrar "O SMS sai do seu celular. O ENSPACE não registra a mensagem." (RN404). | O texto aparece embaixo do botão. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P401 | Os campos Número sugerem os membros do workspace que têm telefone? O cadastro do usuário tem o campo de telefone, mas nenhuma tela do develop deixa a pessoa preenchê-lo. | produto e dev | Com o telefone no perfil, os campos ganham a busca de membro |
| P402 | O widget E-mail passa a mostrar também o e-mail enviado sem item quando ele for gravado no ENSPACE? Hoje ele fica só no Outlook de quem enviou. | produto | RN401 |
| P403 | Os widgets entram na Home padrão se o uso mostrar procura? A pesquisa de mercado de 2026-11-26 indica medir antes: nenhum produto lido põe canal de comunicação na Home padrão. | produto, com o dado de uso | RN405 |
| S401 | A lista do widget E-mail usa a mesma busca da lista da central Comunicações, com o filtro "Enviado por" igual à pessoa, sem rota nova. | dev do front | Se a busca não aceita o filtro pela pessoa logada, a lista pede o filtro na rota |

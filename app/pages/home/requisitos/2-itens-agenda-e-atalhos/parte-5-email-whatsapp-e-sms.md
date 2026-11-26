# 5. E-mail e WhatsApp e SMS

**Objetivo:** a pessoa escreve um e-mail, abre uma conversa no WhatsApp ou manda um SMS direto da Home, e vê os
e-mails que enviou de um item.

**Depende de:** o épico Home em widgets, com Categorias e tarefas; o épico "Escrever e-mail de qualquer tela e central
E-mails no menu", que entrega o compositor, a central E-mails e o painel "Enviar SMS".

**Onde vale:** os widgets E-mail e WhatsApp e SMS, no grupo Comunicação do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". Os 2 widgets ficam
logo abaixo do BENI. O compositor e o painel "Enviar SMS" estão no protótipo
https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/; na Home, o clique mostra o aviso do que abre no
produto, com o link exato.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN401 | Os e-mails do widget E-mail são os que a pessoa enviou com item vinculado, os mesmos da aba Mensagens da central E-mails com "Enviado por" igual à pessoa, até 5, do mais recente ao mais antigo. O e-mail enviado sem item fica só no Outlook de quem enviou e não entra. | O e-mail de há 35 minutos vem antes do de ontem; o enviado sem item não aparece. | Obrigatório |
| RN402 | O número do WhatsApp e do SMS é feito só dos dígitos digitados, sem os zeros do começo; com 10 ou 11 dígitos, o sistema acrescenta o 55 do Brasil; com menos de 10, o número é inválido. | "11 98765-4321" vira 5511987654321; "1234" é inválido. | Obrigatório |
| RN403 | Telefone fixo é o número do Brasil com DDD e 8 dígitos, 12 dígitos com o 55. Telefone fixo não recebe SMS; o WhatsApp continua disponível. | "+55 11 3456-7710" é fixo; "+55 11 98765-4321" é celular. | Obrigatório |
| RN404 | O ENSPACE não envia nem registra a conversa do WhatsApp e o SMS: quem envia é a pessoa, pela conta e pelo celular dela. | Depois do envio, nada aparece no item nem na central E-mails. | Obrigatório |

## No catálogo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | O catálogo deve ter o grupo "Comunicação", com a descrição "O e-mail, o WhatsApp e o SMS, à mão na Home." e os widgets "E-mail" ("Os e-mails que você enviou de um item, com o botão Novo e-mail.") e "WhatsApp e SMS" ("Digite o número e abra a conversa no WhatsApp ou o envio por SMS."). | Personalizar › Adicionar widget mostra "Comunicação", com "2 opções", entre "Telas e atalhos" e "Equipe e notas"; o grupo abre com E-mail e WhatsApp e SMS. | Essencial | Obrigatório |

## E-mail (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF402 | O widget E-mail deve listar os e-mails da pessoa (RN401), com o assunto, "Para" e o endereço, a referência e o título do item, e há quanto tempo foi enviado. | Exemplo: "Minuta do aditivo de locação", "Para carla.prado@example.com · #23203 · Locação do galpão de Jundiaí", "há 35 min". | Essencial | Obrigatório |
| RF403 | O clique na linha deve abrir a leitura do e-mail na central E-mails, como o clique na linha da aba Mensagens. | Clicar em "Minuta do aditivo de locação" abre a leitura desse e-mail. | Importante | Obrigatório |
| RF404 | O botão "Novo e-mail", embaixo da lista, deve abrir o compositor sem item vinculado, como o botão "Novo e-mail" da barra do topo abre numa tela sem item: o Outlook da pessoa no De, o Para vazio e a ajuda "Sem item vinculado, o e-mail fica só no seu Outlook e não aparece no ENSPACE.". | O clique abre o compositor com o Para vazio e sem o bloco "Item vinculado". | Essencial | Obrigatório |
| RF405 | O cabeçalho do widget deve ter o botão só de ícone "Abrir E-mails", que abre a central E-mails. | O clique troca a Home pela central E-mails. | Importante | Desejável |
| RF406 | Sem e-mail enviado, o widget deve mostrar "Os e-mails que você enviar de um item aparecem aqui." e manter o botão "Novo e-mail". | No workspace novo, o widget mostra o texto e o botão. | Importante | Obrigatório |

## WhatsApp e SMS (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF407 | O widget WhatsApp e SMS deve ter o campo "Número", com o exemplo "+55 11 91234-5678", o campo "Mensagem", opcional, com o exemplo "Opcional. Você revisa antes de enviar.", e os botões "WhatsApp" e "SMS". | O widget abre com os 2 campos vazios e os 2 botões disponíveis. | Essencial | Obrigatório |
| RF408 | Com o campo Número vazio, o campo deve mostrar a ajuda "Sem número, você escolhe o contato no WhatsApp ou no celular.". | Apagar o número faz a ajuda voltar. | Importante | Obrigatório |
| RF409 | Com o número inválido (RN402), o campo deve mostrar o erro "Número inválido. Informe o DDD e o número.", e os botões WhatsApp e SMS devem ficar indisponíveis, com o mesmo texto na dica. | "1234" mostra o erro, e o clique em WhatsApp não abre nada. | Essencial | Obrigatório |
| RF410 | Com telefone fixo (RN403), o campo deve mostrar a ajuda "Telefone fixo não recebe SMS.", e o botão SMS deve ficar indisponível, com o mesmo texto na dica. O WhatsApp continua disponível. | "11 3456-7710" deixa o SMS indisponível e o WhatsApp disponível. | Importante | Obrigatório |
| RF411 | "WhatsApp" deve abrir numa aba nova `https://wa.me/<número>?text=<mensagem>`; sem número, `https://wa.me/?text=<mensagem>`, que abre a escolha da conversa. Sem mensagem, o link vai sem o `?text=`. | "11 98765-4321" e "Bom dia" abrem `https://wa.me/5511987654321?text=Bom%20dia`. | Essencial | Obrigatório |
| RF412 | "SMS" deve abrir o painel "Enviar SMS" com o número e a mensagem; sem número, o painel abre sem destinatário, com a mensagem. | "11 98765-4321" e "Bom dia" abrem o painel com "+55 11 98765-4321" e "Bom dia". | Essencial | Obrigatório |
| RF413 | Enter no campo Número deve abrir o WhatsApp, como o botão. | Digitar o número e apertar Enter abre o WhatsApp. | Desejável | Desejável |
| RF414 | Embaixo dos botões, o widget deve mostrar "A mensagem sai da sua conta. O ENSPACE não registra a conversa." (RN404), e a dica dos botões disponíveis deve repetir a frase. | O texto aparece embaixo dos botões, e a dica do WhatsApp mostra a mesma frase. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P401 | O campo Número sugere os membros do workspace que têm telefone? O cadastro do usuário tem o campo de telefone, mas nenhuma tela do develop deixa a pessoa preenchê-lo. | produto e dev | Com o telefone no perfil, o campo ganha a busca de membro |
| P402 | O widget E-mail passa a mostrar também o e-mail enviado sem item quando ele for gravado no ENSPACE? Hoje ele fica só no Outlook de quem enviou. | produto | RN401 |
| S401 | A lista do widget E-mail usa a mesma busca da aba Mensagens, com o filtro "Enviado por" igual à pessoa, sem rota nova. | dev do front | Se a busca não aceita o filtro pela pessoa logada, a lista pede o filtro na rota |

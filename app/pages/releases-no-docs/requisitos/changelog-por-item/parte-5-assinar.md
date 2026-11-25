# 5. Assinar

**Objetivo:** quem quer acompanhar as releases recebe por e-mail o que escolheu ou lê no leitor de feeds.

**Depende de:** 1. Texto da versão na trilha; 3. Mudança que exige ação.

**Onde vale:** o link "Assinar", acima da linha do tempo da aba Releases, e a janela "Acompanhar as releases".

**Protótipo:** https://pernalombr4.github.io/prototipos/releases-no-docs/ (link "Assinar").

## Janela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | O link "Assinar", acima da linha do tempo, deve abrir a janela "Acompanhar as releases", com "Por e-mail" e "Por feed RSS". | Clique em "Assinar" abre a janela com as 2 partes. | Essencial | Obrigatório |

## Por e-mail (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF402 | "Por e-mail" deve ter o campo E-mail e 3 opções de "O que receber": "O post do mês, no dia do lançamento", "O resumo semanal do changelog" e "Só as mudanças que exigem ação, no dia do aviso". | A janela abre com o post do mês e as mudanças que exigem ação marcados. | Essencial | Obrigatório |
| RF403 | Se o e-mail não tem o formato nome@domínio.extensão, o sistema deve mostrar "Informe um e-mail válido." no campo e não inscrever. | "ana@empresa" mostra o aviso. | Essencial | Obrigatório |
| RF404 | Se as 3 opções estão desmarcadas, o sistema deve mostrar "Escolha pelo menos 1 opção." e não inscrever. | Desmarcar as 3 e clicar em "Inscrever" mostra o aviso. | Essencial | Obrigatório |
| RF405 | Quando a pessoa clica em "Inscrever" com o e-mail e 1 opção válidos, o sistema deve enviar o link de confirmação ao e-mail e mostrar "Falta confirmar" e "Enviamos um link de confirmação para <e-mail>." | Com ana@empresa.com.br, a janela mostra "Falta confirmar". | Essencial | Obrigatório |
| RF406 | A inscrição só deve começar a enviar depois que a pessoa abre o link de confirmação. | Sem abrir o link, ana@empresa.com.br não recebe o post do mês. | Essencial | Obrigatório |

## Por feed RSS (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF407 | "Por feed RSS" deve mostrar 2 feeds, "Changelog inteiro" e "Só o que exige ação", cada um com o endereço e o botão "Copiar endereço". | Clique em "Copiar endereço" do changelog inteiro copia o endereço e mostra "Endereço copiado". | Importante | Obrigatório |
| RF408 | O feed "Changelog inteiro" deve trazer 1 entrada por item publicado, com o título, o resumo e o link do item na aba Releases. | O feed tem a entrada do item dos webhooks, com o link para a âncora dele. | Importante | Obrigatório |
| RF409 | O feed "Só o que exige ação" deve trazer só as mudanças que exigem ação, com o título, o porquê, quem é afetado, o prazo e o link do guia. | O feed tem a entrada dos webhooks com "Agir até 9 de fevereiro de 2027". | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI401 | Feeds RSS do `en-docs` | Devem existir 2 endereços por idioma, um para o changelog inteiro e outro só para o que exige ação. Proposta do protótipo: `/<idioma>/releases/docs/rss.xml` e `/<idioma>/releases/docs/exige-acao/rss.xml`. | Obrigatório |
| RI402 | Serviço de envio de e-mail | Deve receber a inscrição (e-mail e opções), mandar o link de confirmação e, depois de confirmada, enviar o que a pessoa escolheu. Serviço: <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P401 | Qual serviço envia os e-mails e guarda as inscrições? | produtos e dev | RI402 e o prazo da parte |
| P402 | Como a pessoa cancela a inscrição: link no rodapé de cada e-mail? | produtos | Ganha 1 requisito de cancelamento |
| P403 | O e-mail é dado pessoal: qual texto de consentimento a janela mostra, conforme a LGPD? | jurídico | Ganha 1 linha de consentimento na janela |

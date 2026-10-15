# Formulário anônimo: pesquisa

Pesquisa documental de 14/10/2026, feita em 5 frentes paralelas: plataformas de denúncia, formulários públicos
de no-code, segurança de formulário público, retorno sem identidade e regulação. As fontes são central de ajuda,
documentação técnica, fórum oficial e lei. A marca de cada fonte:

- **[doc]:** comportamento documentado pelo fabricante;
- **[terceiro]:** página de cliente, fórum ou guia que descreve a tela;
- **[marketing]:** alegação do fabricante sem verificação.

**Sem print das referências nesta rodada.** A pesquisa leu documentação; capturar as telas pede conta em cada
produto. Fica registrado no `DECISOES.md`, em "Não deu".

## As 5 obrigatórias

### Notion

- **Como resolve:** o formulário tem 3 níveis de acesso. Com "Anyone on the web with link", toda resposta é
  anônima, sem opção de identificar. Dentro do workspace, o anonimato é um interruptor do formulário.
- **Fonte:** [Notion Help, Forms](https://www.notion.com/help/forms) [doc].
- **Serve:** o formulário aberto à web já nasce anônimo, sem escolha errada possível.
- **Não serve:** não há retorno a quem respondeu nem proteção contra robô documentada.

### Twenty CRM

- **Como resolve:** não tem formulário público. "Form" é uma ação interna do workflow, para usuário logado. A
  entrada de fora é o gatilho Webhook (URL única, GET ou POST), com autenticação "coming soon".
- **Fonte:** [Twenty, gatilhos de workflow](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-triggers) [doc];
  busca no repositório `twentyhq/twenty` por "public form" (out/2026), só trabalho no formulário interno.
- **Serve:** o exemplo do risco: URL de entrada sem autenticação é exatamente a porta que o robô usa.
- **Não serve:** não tem o que copiar para o anonimato.

### ClickUp

- **Como resolve:** o envio do Form view cria a tarefa. Sem login, o criador vira o ClickBot ou o dono do
  formulário. Com login, desde out/2024, o membro logado "will always be set as the creator".
- **Fonte:** [ClickUp feedback, created by em formulário](https://feedback.clickup.com/feature-requests/p/ability-to-set-created-by-on-forms) [doc, resposta oficial];
  [ClickBot](https://help.clickup.com/hc/en-us/articles/6311154533783-ClickBot) [doc].
- **Serve:** o usuário genérico como criador.
- **Não serve:** a sessão logada quebra o anonimato sem aviso. É o erro que a proposta evita.

### monday.com

- **Como resolve:** WorkForms tem "Make this form anonymous" (API `isAnonymous`). Sem a opção, o Creation Log
  grava quem está logado. A API do formulário tem `closeDate`, `responseLimit`, `password`, `requireLogin` e
  `reCaptchaChallenge`.
- **Fonte:** [monday API, forms](https://developer.monday.com/api-reference/reference/forms-other-types) [doc];
  [fórum, Creation Log](https://community.monday.com/t/people-not-identified-in-creation-log-after-submitting-a-form/100554) [terceiro].
- **Serve:** o anonimato como propriedade do formulário; fechar por data e por número de respostas.
- **Não serve:** o reCAPTCHA manda dado do navegador ao Google; não há retorno sem e-mail.

### Pipefy

- **Como resolve:** o formulário público cria o card como "Pipebot". Tem template "Whistleblowing". No portal
  novo (dez/2024 a jan/2025), cards passaram a mostrar o usuário logado.
- **Fonte:** [Pipefy, formulário público](https://help.pipefy.com/en/articles/614621-public-form) [doc];
  [template Whistleblowing](https://pipefy.com/templates/whistleblowing) [marketing];
  [comunidade Pipefy](https://community.pipefy.com/questions/2144) [terceiro].
- **Serve:** o usuário genérico; o template mostra que o mercado no-code vende esse caso.
- **Não serve:** o mesmo vazamento por sessão logada; o template não diz como protege a identidade.

## As extras, escolhidas pelo problema

### ServiceNow, Anonymous Report Center (ARC)

- **Como resolve:**
  1. URL própria (`/arc`); quem chega logado pelo portal do funcionário tem a sessão encerrada.
  2. O registro nasce com "Opened by" = Guest e "Requested for" vazio.
  3. No fim, a pessoa recebe "Report key" e "Report number" para acompanhar e conversar com o investigador.
  4. A chave perdida não se recupera e o ARC não manda e-mail.
- **Fonte:** [ServiceNow Docs, ARC](https://www.servicenow.com/docs/r/xGHm5nN1KlkEq58WJHJoPw/Sl_CBmaRiQYXcFLGnWEOPw) [doc].
- **Serve:** é o padrão de referência: criador genérico, sessão ignorada e chave de acompanhamento.
- **Não serve:** exige a plataforma enterprise e plugins dedicados.

### Airtable

- **Como resolve:** envio sem login grava `Created by` = "anonymous". A cópia da resposta por e-mail é opção à
  parte dos campos (plano pago).
- **Fonte:** [Airtable, Created by](https://support.airtable.com/articles/4613019453-created-time-and-created-by-fields-in-airtable) [doc].
- **Serve:** o nome "anonymous", que a demanda pede.

### GlobaLeaks (código aberto)

- **Como resolve:** recibo de 16 dígitos com cara de telefone; a chave do denunciante é cifrada com segredo
  derivado do recibo. Prova de trabalho no lugar de CAPTCHA e 10 relatos por hora por IP. Não registra IP.
- **Fonte:** [GlobaLeaks, segurança da aplicação](https://docs.globaleaks.org/en/stable/security/ApplicationSecurity.html) [doc];
  [modelo de ameaça](https://docs.globaleaks.org/en/stable/security/ThreatModel.html) [doc].
- **Serve:** a verificação sem clique e o limite por IP sem guardar o IP no relato.

### EQS Integrity Line, NAVEX EthicsPoint e Compliasset

- **Como resolvem:** sem login, o envio devolve identificador do caso e senha (EQS: Case ID e senha ou PIN;
  EthicsPoint: "report key" e senha; Compliasset: protocolo e senha forte). O retorno fica numa caixa no portal.
  E-mail, quando existe, é opcional e só avisa.
- **Fontes:** [Compliasset](https://intercom.help/compliasset/pt-BR/articles/10262126-reportando-incidentes-pelo-canal-de-denuncias-premium) [doc];
  [FAQ EthicsPoint](https://buffalo.edu/administrative-services/internal-audit/ethicspoint-faq.html) [terceiro];
  [guia EQS de cliente](https://www.carloalberto.org/wp-content/uploads/2024/03/Integrity-Line-Quick-guide-Professional_ENG.pdf) [terceiro].
- **Serve:** protocolo para citar e senha para entrar; o ENSPACE já mostra o "Ticket" no fim do envio.

### Jotform

- **Como resolve:** grava o IP de todo envio e o suporte diz que não dá para desligar. Tem template "Anonymous
  Reporting App".
- **Fonte:** [Jotform, IP das respostas](https://jotform.com/answers/5115889-is-it-possible-to-disable-ips-of-submissions) [doc, suporte].
- **Serve:** o contraexemplo: "anônimo" na tela e IP gravado por trás.

### Proteção contra robô: ALTCHA, Cloudflare Turnstile e OWASP

- **ALTCHA:** prova de trabalho no navegador, código aberto (MIT), roda no próprio servidor, sem cookie
  ([ALTCHA](https://altcha.org/open-source-captcha/), funcionamento [doc], privacidade [marketing]).
- **Turnstile:** desafio invisível, token de 300 s e uso único; a Cloudflare recebe o IP
  ([Cloudflare](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) [doc]).
- **OWASP API4:2023 e API6:2023:** criar registro que dispara fluxo e e-mail é fluxo de negócio sensível; pede
  limite por operação, teto de corpo e de envio ([API4](https://api-security.owasp.org/editions/2023/en/0xa4-unrestricted-resource-consumption), [API6](https://api-security.owasp.org/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows)).
- **Bombardeio de e-mail de confirmação:** robôs usam formulário que manda confirmação para lotar a caixa de
  outra pessoa ([Spamhaus](https://www.spamhaus.org/news/article/734/subscription-bombing-coi-captcha-and-the-next-generation-of-mail-bombs)).

### O e-mail fica no provedor de envio

Nenhum dos 5 provedores pesquisados manda e-mail sem registrar o destinatário: Postmark (45 dias), SendGrid (até
37), Mailgun (eventos de 1 a 30), Resend (30) e Amazon SES (lista de supressão sem prazo). Por isso o aviso por
e-mail é opcional e a tela diz que ele muda a denúncia de anônima para sigilosa.

### Lei

- **Lei 14.457/2022, art. 23, II:** empresa com CIPA mantém canal de assédio com "garantido o anonimato da
  pessoa denunciante" ([LegJur](https://www.legjur.com/legislacao/art/lei_00144572022-23), fonte secundária).
- **LGPD, art. 13, §4º:** e-mail guardado escondido é dado pseudonimizado, não anônimo (citado sem reler o texto
  oficial).
- **Diretiva (UE) 2019/1937, art. 9º:** confirmação em até 7 dias e resposta em até 3 meses
  ([legislation.gov.uk](https://www.legislation.gov.uk/eudr/2019/1937/chapter/II/data.htm)).

## O padrão que todos seguem

1. **Envio sem login vira usuário genérico:** anonymous (Airtable), Guest (ServiceNow, Kissflow), Pipebot,
   ClickBot. Ninguém grava "vazio".
2. **Canal de denúncia devolve credencial no fim do envio:** identificador do caso mais senha ou segredo. Senha
   perdida não se recupera.
3. **E-mail, quando existe, é opcional e só avisa.** Nenhum canal especializado exige e-mail no modo anônimo.
4. **O link é fixo.** Formulário público usa endereço estável; o controle é data de fechamento, limite de
   respostas, senha ou CAPTCHA.

## O que nenhum deles faz

1. **Nenhum no-code junta** envio anônimo, retorno por protocolo e senha e fluxo configurável pelo cliente.
2. **Nenhum no-code avisa o configurador** sobre o que o item vai guardar. A proposta mostra "O que o item nunca
   guarda" na própria configuração.
3. **Nenhum produto documenta pausa automática por pico de envios.** A proposta pausa o formulário e avisa o
   comitê.
4. **Ninguém arredonda a hora.** Hora exata cruzada com catraca, VPN ou login aponta quem enviou; a proposta
   guarda a hora cheia.
5. **Ninguém trata a sessão logada de forma explícita fora do ServiceNow.** A proposta ignora a sessão no
   formulário anônimo em vez de herdá-la.

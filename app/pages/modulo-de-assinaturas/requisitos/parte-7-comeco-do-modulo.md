# 7. Começo do módulo

**Objetivo:** quem abre o módulo sem envelope vê o que o módulo faz e cria o 1º envelope, com ou sem provedor; a 1ª
credencial liga o módulo, e desligar o módulo avisa o que acontece com os envelopes abertos.

**Depende de:** 2. Página do provedor e 4. Novo envelope.

**Onde vale:** Módulos > Assinaturas sem envelope; a página do provedor ao salvar a 1ª credencial; Configurações >
Sistema > Módulos.

**Protótipo:** https://pernalombr4.github.io/prototipos/modulo-de-assinaturas. Na barra "Protótipo", "Ir para" abre
cada situação: nem provedor nem envelope, provedor conectado sem envelope e rascunhos sem provedor.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN601 | A 1ª credencial salva no workspace liga o módulo de assinaturas. | Salvar a 1ª credencial da ClickSign liga o módulo e mostra o menu Assinaturas. | Obrigatório |

## Sem envelope e sem provedor (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF601 | Sem envelope e sem credencial, o módulo deve mostrar o título "Envie documentos para assinatura sem sair do ENSPACE" e 1 linha do que o módulo faz. | A tela abre com o título no lugar da tabela vazia. | Essencial | Obrigatório |
| RF602 | A ação principal deve ser "Criar o primeiro envelope", que abre o novo envelope, e a 2ª, "Conectar um provedor". | O envelope criado aqui fica como rascunho. | Essencial | Obrigatório |
| RF603 | Abaixo das ações, a tela deve dizer "O envelope pode ser criado antes da conexão com um provedor. Ele fica salvo como rascunho e é enviado depois.". | O texto aparece abaixo dos botões. | Importante | Obrigatório |
| RF604 | A tela deve ter uma prévia de envelope com 3 participantes em ordem: um que assinou, um na vez e um na fila. | A prévia mostra "Assinou", "Na vez" e "Na fila". | Desejável | Opcional |
| RF605 | "Como funciona" deve ter 3 passos: "Conecte um provedor", "Crie o envelope" e "Acompanhe as assinaturas"; o passo 1 diz "Pode ser depois". | Os 3 passos aparecem numerados. | Importante | Desejável |
| RF606 | "Provedores disponíveis" deve ter 1 card por provedor, no formato do card de Apps, que abre a página do provedor. | Clicar no card da D4Sign abre a página da D4Sign. | Importante | Obrigatório |
| RF607 | "Outras formas de criar envelopes" deve ter "Pelo Spaceflow", com "Abrir o editor de fluxo", e "Pelo fluxo da categoria", com "Ver uma tarefa Integração". | Cada bloco diz em 1 linha o que a forma faz. | Desejável | Desejável |

## Provedor conectado e sem envelope (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF608 | Com 1 credencial e sem envelope, o título deve ser "Tudo pronto para o primeiro envelope", com o provedor conectado no texto. | "A ClickSign está conectada. Crie um envelope aqui, ou deixe que o Spaceflow e o fluxo da categoria criem os envelopes a partir dos itens.". | Essencial | Obrigatório |
| RF609 | O passo 1 deve aparecer "Concluído · {provedor}", com o passo 2 como próximo passo. | O passo 1 mostra "Concluído · ClickSign". | Importante | Desejável |
| RF610 | Ao lado de "Criar o primeiro envelope", a tela deve mostrar o provedor conectado, com o logo e "Conectado", no lugar de "Conectar um provedor" e da seção "Provedores disponíveis". | Clicar no provedor conectado abre a página dele. | Importante | Obrigatório |

## Ligar e desligar o módulo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF611 | Ao salvar a 1ª credencial (RN601), a página do provedor deve mostrar o toast "Módulo de assinaturas ligado", com "Os envelopes ficam em Módulos > Assinaturas.". | A 2ª credencial não mostra esse toast. | Importante | Obrigatório |
| RF612 | Em Configurações > Sistema > Módulos, desligar "Assinatura Eletrônica" com envelope aberto (RN902) deve abrir a confirmação "Desligar o módulo de assinaturas?". | Sem envelope aberto, a chave desliga sem confirmação. | Essencial | Obrigatório |
| RF613 | A confirmação deve dizer quantos envelopes aguardam assinatura e o efeito: os envelopes continuam no provedor, o ENSPACE deixa de receber o retorno e o menu Assinaturas sai até o módulo ser ligado de novo. | Com 3 envelopes abertos: "3 envelopes aguardam assinatura. ...". | Essencial | Obrigatório |
| RF614 | A confirmação deve ter "Desligar o módulo" e "Manter ligado"; "Manter ligado" deixa a chave ligada. | "Manter ligado" fecha a confirmação sem mudar nada. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P601 | Com o módulo desligado, o retorno do provedor para os envelopes abertos se perde ou fica guardado para quando o módulo voltar? | dev do módulo | O texto da RF613 muda conforme a resposta |

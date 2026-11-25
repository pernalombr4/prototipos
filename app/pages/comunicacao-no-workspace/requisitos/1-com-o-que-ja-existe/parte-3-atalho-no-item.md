# 3. Atalho de e-mail no item

**Objetivo:** com o item aberto, a pessoa escreve ao contato do item em 1 clique, pelo cartão "Contato do item" ou pelo
ícone ao lado do campo de e-mail, sem configurar nada.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo; 2. Mail Box em todo item e na tarefa.

**Onde vale:** a tela do item: o painel esquerdo e a Visão Geral.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Abra CTR-00231: o cartão "Contato
do item" fica no alto do painel esquerdo, e o ícone de e-mail, ao lado do campo "E-mail do contato" na Visão Geral.

## Cartão "Contato do item" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | O painel esquerdo do item deve ter o cartão "Contato do item" no alto, acima de Identificação, com os contatos do item (RN907). | Em CTR-00231, o cartão mostra "E-mail do contato" e "Requisitante". | Essencial | Obrigatório |
| RF202 | Com mais de 1 contato, o cartão deve ter o seletor "Para quem", com o 1º contato escolhido ao abrir o item (RN908). | Em CTR-00231, o seletor abre em "E-mail do contato" e troca para "Requisitante". | Essencial | Obrigatório |
| RF203 | Cada contato deve mostrar o nome e, embaixo, o e-mail; sem nome, mostra o e-mail e, embaixo, o nome do campo de onde vem. | O contato de Pessoa/Empresa mostra "Mariana Costa" e o e-mail; o de "E-mail do contato" mostra o e-mail e "E-mail do contato". | Importante | Obrigatório |
| RF204 | O cartão deve ter o botão E-mail dividido, com os 2 caminhos do atalho para o contato escolhido (RN909, RN911, RN912). | O clique no corpo abre o compositor vinculado a CTR-00231, com o contato em Para; a seta abre o app com o endereço do item em Cc. | Essencial | Obrigatório |
| RF205 | Com a conta do Outlook integrada, a linha embaixo do botão deve dizer "O e-mail sai pelo ENSPACE e fica na Mail Box de <referência>. A seta abre o seu app de e-mail.". | Em CTR-00231, a linha cita CTR-00231. | Importante | Obrigatório |
| RF206 | Sem a conta do Outlook integrada, o botão E-mail deve abrir direto o app, com a linha "Abre o seu app de e-mail com o destinatário preenchido e o endereço do item em cópia." (RN910). | No cenário "Sem Outlook integrado", o clique abre o app, sem o compositor. | Essencial | Obrigatório |
| RF207 | No item sem contato preenchido, o cartão deve mostrar "Nenhum contato neste item" e "Os campos de contato deste item estão vazios.", sem o botão E-mail. | Um item de Contratos com os campos de e-mail vazios e sem E-mail do Requisitante mostra o vazio. | Importante | Obrigatório |

## Ícone ao lado do campo de e-mail (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF211 | Na Visão Geral, cada campo do tipo E-mail e cada E-mail de contato de Pessoa/Empresa deve ter o ícone de e-mail ao lado, sem configuração na categoria. | Em CTR-00231, "E-mail do contato" e "E-mail do financeiro" têm o ícone. | Essencial | Obrigatório |
| RF212 | A dica do ícone deve dizer "Enviar e-mail para <nome do campo>". | Em CTR-00231, a dica diz "Enviar e-mail para E-mail do contato". | Importante | Obrigatório |
| RF213 | O ícone deve abrir os 2 caminhos do atalho para o e-mail escrito no campo, com o item vinculado (RN909, RN911, RN912). | O menu mostra "Escrever pelo ENSPACE" e "Abrir no meu app de e-mail"; o compositor abre com o e-mail do campo em Para. | Essencial | Obrigatório |
| RF214 | Com o campo vazio ou com um e-mail inválido, o ícone deve ficar indisponível com o motivo "Sem e-mail cadastrado" (RN913). | "E-mail do financeiro" vazio mostra o ícone cinza com a dica "Sem e-mail cadastrado". | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | O campo de e-mail que não está no formulário da Visão Geral (Editar ou Geral da categoria) continua contato do item, mesmo sem a pessoa conseguir preenchê-lo na tela do item? | produto | Se não, a lista de contatos lê só os campos do formulário da Visão Geral |

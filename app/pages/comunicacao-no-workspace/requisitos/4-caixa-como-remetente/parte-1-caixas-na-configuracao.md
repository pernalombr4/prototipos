# 1. Caixas como remetente na aba Canais e regras

**Objetivo:** quem administra escolhe quais Caixas de E-mail do workspace aparecem no campo De do compositor.

**Onde vale:** a aba Canais e regras de Configurações › Comunicações, grupo "Regras do workspace" (o grupo de quem administra, do épico
"Enviar e-mail, WhatsApp e SMS de qualquer tela e central Comunicações no menu").

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Com "Fase: 2 · Remetente" e
"Perfil: Admin", abra Configurações › Comunicações › Canais e regras: o bloco "Caixas como remetente" fica entre "Contato do item" e
"Remetente com o domínio da empresa".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Marcar a caixa como remetente não muda o recebimento da caixa nem o fluxo que a caixa inicia. | "Atendimento jurídico" ligada no De continua recebendo na Central de Atendimento e iniciando o mesmo fluxo. | Obrigatório |

## O bloco "Caixas como remetente" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O grupo "Regras do workspace" da aba Canais e regras deve ter o bloco "Caixas como remetente", com a descrição "Escolha as caixas do workspace que aparecem no campo De de quem escreve um e-mail.". | Com o perfil de quem administra, o bloco aparece entre "Contato do item" e "Remetente com o domínio da empresa". | Essencial | Obrigatório |
| RF002 | O bloco deve listar cada caixa da aba Caixas de E-mail, com o nome, o endereço e a chave "Disponível no campo De". | Exemplo: "Atendimento jurídico" com atendimento.aurora-servicos@box.enspace.io e a chave; "Compras" com o endereço dela e a chave. | Essencial | Obrigatório |
| RF003 | O membro sem a permissão de quem administra não deve ver o bloco. | Com o perfil de membro, Configurações › Comunicações não aparece no menu. | Essencial | Obrigatório |
| RF004 | Se o workspace não tem caixa, o bloco deve mostrar "Nenhuma caixa de e-mail" no lugar da lista, sem o botão Salvar. | Com "Dados: Workspace novo", o bloco mostra "Nenhuma caixa de e-mail". | Importante | Obrigatório |

## Gravar a escolha (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | Quando quem administra clica em Salvar, o sistema deve gravar no workspace, por caixa, se a chave "Disponível no campo De" está ligada (RN901). | Exemplo: desliga "Compras" e salva; ao recarregar a aba, "Compras" continua desligada. | Essencial | Obrigatório |
| RF012 | Mudar a chave sem clicar em Salvar não deve alterar o "De" do compositor. | Desliga "Compras", não salva e abre o compositor: "Compras" continua no "De". | Importante | Obrigatório |
| RF013 | Depois de salvar, o "De" do compositor deve listar só as caixas ligadas (RN901). | Exemplo: "Compras" desligada e salva; o "De" mostra só "Atendimento jurídico" no grupo "Caixas do workspace". | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Que permissão de hoje decide quem vê e salva o bloco: a de ver as Caixas de E-mail, a de editá-las ou outra? | dev e produto | Define o RF003 por permissão, no lugar do perfil de quem administra |
| P002 | A caixa criada depois entra ligada ou desligada no "De"? No protótipo, cada caixa começa ligada. | produto | Ligada: a caixa nova aparece no "De" de cada pessoa sem ninguém salvar o bloco |

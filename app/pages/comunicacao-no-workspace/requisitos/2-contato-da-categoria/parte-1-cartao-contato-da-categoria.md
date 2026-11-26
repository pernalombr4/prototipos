# 1. Cartão "Contato da categoria"

**Objetivo:** quem administra abre o cartão "Contato da categoria" no painel da categoria, escolhe de quais campos vêm
o nome, o e-mail e o telefone de cada contato do item, ajusta o assunto do e-mail e o texto pronto do WhatsApp e do SMS, confere
a prévia e salva.

**Onde vale:** Configurações › Estrutura › Categorias › a categoria: o 13º cartão do painel e a página que ele abre.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Fase "2 · Remetente"; "Ir para" ›
"Contato da categoria Contratos".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | A origem do nome só pode ser um campo Texto curto da categoria ou o subcampo Nome de contato de um campo "Pessoa/Empresa". | Em Fornecedores, servem "Razão social", "Contato comercial" e "Pessoa/Empresa › Nome de contato"; o campo CNPJ, com máscara, fica de fora. | Obrigatório |
| RN002 | Uma categoria com o contato configurado tem 1 ou mais contatos. | Contratos tem 2 contatos; Solicitações tem 1. | Obrigatório |

## No painel da categoria (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O painel da categoria deve ter o 13º cartão, "Contato da categoria", depois do cartão Correção Monetária, com a descrição "Quem é o contato do item e o assunto do e-mail." | Em Contratos, o cartão aparece depois de Correção Monetária, e a seta abre a página do cartão. | Importante | Obrigatório |

## Quem é o contato (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF002 | O bloco "Quem é o contato" deve mostrar 1 linha por contato salvo, com o campo "Nome do contato na tela" e os seletores "Nome", "E-mail" e "Telefone" (RN901). | Contratos mostra "Contato da contraparte" (Nome: Contato da contraparte; E-mail: E-mail do contato; Telefone: Telefone do contato) e "Requisitante" (Nome: "Nenhum"; E-mail: "E-mail do Requisitante"; Telefone: "Nenhum"). | Essencial | Obrigatório |
| RF003 | O seletor "Nome" deve oferecer "Nenhum" e os campos aceitos como origem do nome (RN001). | Em Fornecedores: "Nenhum", "Razão social", "Contato comercial" e "Pessoa/Empresa › Nome de contato". | Essencial | Obrigatório |
| RF004 | O seletor "E-mail" deve oferecer "Nenhum" e os campos aceitos como origem do e-mail (RN902). | Em Contratos: "Nenhum", "E-mail do contato", "E-mail do financeiro" e "E-mail do Requisitante", com a linha "Campo padrão de toda categoria". | Essencial | Obrigatório |
| RF005 | "Adicionar contato" deve criar uma linha com o nome "Novo contato" e as 3 origens em "Nenhum". | Em Solicitações, o clique cria a 2ª linha, "Novo contato". | Importante | Obrigatório |
| RF006 | "Remover contato" deve tirar a linha do contato da página. | Em Contratos, remover "Requisitante" deixa só "Contato da contraparte". | Importante | Obrigatório |
| RF007 | Com 1 contato na página, "Remover contato" deve ficar indisponível (RN002). | Em Solicitações, só com "Quem pediu", o botão de remover fica desabilitado. | Importante | Obrigatório |
| RF021 | O seletor "Telefone" deve oferecer "Nenhum" e os campos aceitos como origem do telefone (RN904), com "CEL" embaixo do campo Texto com máscara. | Em Fornecedores: "Nenhum", "WhatsApp comercial" (CEL) e "Pessoa/Empresa › Telefone de contato". | Essencial | Obrigatório |

## Assunto do e-mail (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF008 | O bloco "Assunto do e-mail" deve ter o campo do assunto da categoria, aberto com o assunto salvo. | Contratos abre com "{referencia} · {titulo}"; Fornecedores, com "{titulo} · Cadastro de fornecedor". | Essencial | Obrigatório |
| RF009 | O campo deve ter, em "Inserir:", 1 botão por variável: `{referencia}`, `{titulo}`, `{nome}` e `{categoria}` (RN903). | Os 4 botões aparecem embaixo do campo. | Importante | Obrigatório |
| RF010 | O botão da variável deve acrescentar a variável no fim do assunto, separada por 1 espaço. | Assunto "Contrato"; o clique em `{nome}` deixa "Contrato {nome}". | Desejável | Desejável |

## Texto pronto do WhatsApp e do SMS (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF022 | O bloco "Texto pronto do WhatsApp e do SMS", com os ícones do WhatsApp e do SMS no título, depois de "Assunto do e-mail", deve ter o campo de texto da categoria, aberto com o texto salvo, e a ajuda "Aceita as mesmas variáveis do assunto. Quem envia pode mudar o texto antes de enviar." (RN905). | Contratos abre com "Olá, {nome}. Escrevo sobre {referencia} · {titulo}."; Fornecedores, com "Olá, {nome}. Escrevo sobre o cadastro de {titulo} como fornecedor.". | Essencial | Obrigatório |
| RF023 | O campo deve ter, em "Inserir:", os 4 botões de variável do assunto, que acrescentam a variável no fim do texto, separada por 1 espaço. | O clique em `{categoria}` acrescenta "{categoria}" no fim do texto, não do assunto. | Importante | Obrigatório |

## Prévia (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | O bloco "Prévia: o que os botões E-mail, WhatsApp e SMS abrem" deve ter um seletor com itens da categoria que a pessoa pode ver, para escolher o item de exemplo. | Em Contratos, o seletor mostra "CTR-00231 · Contrato de manutenção predial" e outros contratos; o contrato sem permissão para a pessoa fica de fora. | Importante | Obrigatório |
| RF012 | Para cada contato da página, a prévia deve mostrar o "Nome do contato na tela" e o nome lido no item de exemplo. | CTR-00231: "Contato da contraparte" e Marina Alves. | Essencial | Obrigatório |
| RF013 | Para o contato com e-mail no item de exemplo, a prévia deve mostrar o Para, o Assunto e o Cc. | CTR-00231, "Contato da contraparte": Para marina.alves@example.com, Assunto "CTR-00231 · Contrato de manutenção predial" e o Cc. | Essencial | Obrigatório |
| RF014 | O Assunto da prévia deve trocar as variáveis pelos valores do item de exemplo e do contato (RN903). | Assunto "Olá, {nome}" com CTR-00231 mostra "Olá, Marina" para "Contato da contraparte". | Essencial | Obrigatório |
| RF015 | O Cc da prévia deve ser o endereço do item de exemplo. | CTR-00231: `ctr-00231.<referência do workspace>@<domínio das caixas>`. | Importante | Obrigatório |
| RF016 | Sem nome no item de exemplo, a prévia deve mostrar "Sem nome" no lugar do nome. | CTR-00231, "Requisitante": "Sem nome" e o Para carla.nogueira@example.com. | Importante | Obrigatório |
| RF017 | Sem e-mail no item de exemplo, a prévia deve mostrar "Sem e-mail cadastrado" no lugar do Para, do Assunto e do Cc. | CTR-00229, "Contato da contraparte": Juliana Freitas e "Sem e-mail cadastrado". | Importante | Obrigatório |
| RF018 | A prévia deve mostrar a edição da página antes do Salvar. | Trocar o E-mail de "Contato da contraparte" para "E-mail do financeiro" muda o Para da prévia sem salvar. | Importante | Obrigatório |
| RF024 | Para o contato com telefone válido no item de exemplo, a prévia deve mostrar, embaixo do e-mail, a linha "WhatsApp e SMS" com o telefone e o texto pronto com as variáveis trocadas (RN903). | CTR-00231, "Contato da contraparte": WhatsApp e SMS +55 11 3456-7710 e "Olá, Marina. Escrevo sobre CTR-00231 · Contrato de manutenção predial.". | Essencial | Obrigatório |
| RF025 | Sem telefone ou com telefone inválido no item de exemplo, a prévia deve mostrar "Sem telefone cadastrado" ou "Telefone inválido" no lugar do WhatsApp e do SMS. | CTR-00231, "Requisitante": "Sem telefone cadastrado". | Importante | Obrigatório |
| RF026 | Com telefone fixo no item de exemplo, a prévia deve mostrar, embaixo da linha "WhatsApp e SMS", o aviso "Telefone fixo não recebe SMS" (RN926 do épico "Escrever e-mail de qualquer tela e central E-mails no menu"). | CTR-00231, "Contato da contraparte", com +55 11 3456-7710: o aviso aparece; CTR-00230, com +55 11 99876-1203, fica sem aviso. | Importante | Obrigatório |

## Salvar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF019 | "Salvar" deve gravar na categoria os contatos, as origens, o assunto e o texto pronto do WhatsApp e do SMS da página. | Salvar em Contratos e reabrir o cartão mostra o que foi salvo. | Essencial | Obrigatório |
| RF020 | Ao sair da página sem salvar, o sistema deve descartar a edição. | Trocar o assunto, voltar ao painel e reabrir o cartão mostra o assunto salvo antes da troca. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | O assunto pode ficar vazio? Vazio, o atalho abre sem assunto ou com o assunto padrão do épico "Escrever e-mail de qualquer tela e central E-mails no menu"? O protótipo salva vazio, e a prévia mostra "-". | produto | O Salvar ganha validação, ou a parte 2 usa o assunto padrão |
| P002 | O Salvar aceita contato com o "Nome do contato na tela" vazio, ou com as 2 origens em "Nenhum"? O protótipo salva. | produto | O Salvar ganha validação com aviso no campo |
| P003 | Sair da página com edição não salva pede confirmação? O protótipo descarta sem perguntar. | produto | Um aviso de saída antes de descartar |
| P004 | Com o contato sem nome, como fica o assunto com {nome}? O protótipo troca por vazio, e "Olá, {nome}" vira "Olá,". | produto | A variável cai para o e-mail, ou o trecho com a pontuação some |
| S001 | O seletor da prévia mostra os itens da categoria que a pessoa pode ver, em número que a tela comporta; o protótipo mostra 4. | dev do front e produto | O número de itens e a ordem do seletor |

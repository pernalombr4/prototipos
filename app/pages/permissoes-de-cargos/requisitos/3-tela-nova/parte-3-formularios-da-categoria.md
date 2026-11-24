# 3. Formulários da categoria

**Objetivo:** o administrador restringe uma ação do cargo a alguns formulários da categoria, com a categoria como
caixa pai e os formulários como caixas filhas: marcar só alguns deixa a categoria com traço.

**Depende de:** 1. Tabela de categorias.

**Onde vale:** o botão Ajustar da linha da categoria, aba Formulários; a seta da linha, que abre as sublinhas de
formulário; e a coluna Formulários da tabela.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. Em "Processos Judiciais", abra a seta
ou clique em Ajustar › Formulários.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | A ação marcada na categoria inteira vale em cada formulário da categoria. A ação com traço vale só nos formulários marcados. | Ver com traço em "Processos Judiciais", só com Criminal: o cargo vê os processos criados pelo formulário Criminal e não vê os de Cível. | Obrigatório |
| RN202 | Um formulário criado depois entra desmarcado em cada ação do cargo. | O formulário "Tributário" criado em "Processos Judiciais" fica sem ação até alguém marcá-lo no cargo. | Obrigatório |

## Formulários no Ajustar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | A aba Formulários deve mostrar a linha "Todos os formulários" e, abaixo, 1 linha por formulário, com as colunas Criar, Ver, Atualizar e Excluir. | "Processos Judiciais" mostra "Todos os formulários", Cível, Criminal e Trabalhista. | Essencial | Obrigatório |
| RF215 | Cada origem que a árvore de hoje mostra na categoria deve virar uma linha da aba, com as mesmas regras de caixa dos formulários. | Com o épico "Itens sem formulário" no ar, "Itens sem formulário" aparece depois de Trabalhista, com a descrição que a árvore mostra. | Essencial | Obrigatório |
| RF202 | Marcar uma ação num formulário, com a ação desligada na categoria, deve ligar a ação na categoria com traço (RN201). | Marcar Ver em Criminal, sem Ver na categoria, deixa Ver de "Processos Judiciais" com traço. | Essencial | Obrigatório |
| RF203 | Marcar a caixa de "Todos os formulários", ou clicar nela com traço, deve marcar a ação em cada formulário. | O clique no traço de Ver em "Todos os formulários" marca Ver em Cível, Criminal e Trabalhista. | Essencial | Obrigatório |
| RF204 | Desmarcar 1 formulário numa ação marcada inteira deve deixar a ação da categoria com traço. | Desmarcar Ver em Cível deixa Ver da categoria com traço. | Essencial | Obrigatório |
| RF205 | Desmarcar o último formulário marcado numa ação deve desligar a ação na categoria. | Com Ver só em Criminal, desmarcar Criminal desliga Ver em "Processos Judiciais". | Essencial | Obrigatório |
| RF206 | Desmarcar a caixa de "Todos os formulários" deve desligar a ação na categoria e em cada formulário. | Desmarcar Criar em "Todos os formulários" tira Criar da categoria e dos 3 formulários. | Essencial | Obrigatório |
| RF207 | Marcar Atualizar ou Excluir num formulário deve marcar e travar Ver no mesmo formulário (RN901). | Marcar Atualizar em Criminal trava Ver em Criminal. | Essencial | Obrigatório |
| RF208 | A aba deve mostrar a frase "Marque a categoria para liberar todos os formulários. Marque só alguns para restringir o cargo a eles.". | A frase aparece acima da tabela. | Desejável | Desejável |
| RF209 | A aba deve avisar que o formulário criado depois entra desmarcado (RN202). | O aviso aparece abaixo da tabela. O texto entra nos 3 idiomas, a partir do aviso do protótipo. | Importante | Obrigatório |

## Sublinhas na tabela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF210 | A seta da linha da categoria deve abrir, na própria tabela, 1 sublinha por formulário, com as 4 caixas que a aba Formulários tem. | A seta de "Processos Judiciais" mostra Cível, Criminal e Trabalhista abaixo da categoria. | Importante | Obrigatório |
| RF211 | Cada caixa da sublinha deve seguir as mesmas regras das caixas da aba Formulários (RF202 a RF207). | Marcar Ver na sublinha Criminal deixa Ver da categoria com traço. | Importante | Obrigatório |

## Coluna Formulários (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF212 | A coluna Formulários deve mostrar "Todos" com cada ação marcada inteira, "{n} de {total}" quando ao menos 1 formulário fica sem ação, "Em parte" quando cada formulário tem ao menos 1 ação e ao menos 1 ação tem traço, "Nenhum" na categoria sem ação e "Sem formulários" na categoria sem formulário. | Ver, Criar e Atualizar só em Criminal mostra "1 de 3". | Importante | Obrigatório |
| RF213 | O valor parcial da coluna deve ter a dica com cada ação restrita: os nomes dos formulários, até 3, ou "{ação} em {n} de {total}". | "Criar: Criminal. Ver: Criminal. Atualizar: Criminal.". | Desejável | Desejável |
| RF214 | O clique no valor parcial da coluna deve abrir Ajustar na aba Formulários. | O clique em "1 de 3" abre Ajustar › Formulários de "Processos Judiciais". | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S201 | A tela grava as permissões de formulário como a árvore de hoje: a ação na categoria e a ação em cada formulário marcado. | dev do front | Nada muda no que o back recebe; só a forma de marcar |

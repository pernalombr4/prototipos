# Requisitos: Quais itens, criador e responsável

**Objetivo:** o administrador faz Ver, Atualizar ou Excluir valer só nos itens que a pessoa criou, só nos itens em que
ela é a responsável, ou nos 2.

**Depende de:** épico "Tela nova de permissões", onde ficam a coluna Restrições e as sublinhas da categoria.

**Onde vale:** as sublinhas "Só se for o criador" e "Só se for o responsável" da categoria aberta, a coluna
Restrições, o filtro "Só alguns itens" e a listagem, a edição e a exclusão de itens em toda porta.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, aba Categorias. Abra "Chamados de TI"
pela seta.

**Fora do escopo:** a regra de itens na linha do padrão, que entra no épico "Padrão para todas as categorias".

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | Com "Só se for o criador", a ação só vale nos itens que a pessoa criou. | Em "Reembolsos", com Ver só se for o criador, a pessoa vê só os pedidos que ela abriu. | Obrigatório |
| RN202 | Com "Só se for o responsável", a ação só vale nos itens em que a pessoa está num dos campos Pessoa escolhidos. | Em "Chamados de TI", com o campo "Responsável" escolhido, a pessoa vê só os chamados em que ela é a responsável. | Obrigatório |
| RN203 | Com as 2 regras, a ação vale se a pessoa é a criadora ou a responsável. | A pessoa vê o chamado que abriu e o chamado em que é a responsável. | Obrigatório |
| RN204 | A regra de itens vale para Ver, Atualizar e Excluir. Criar não tem regra de itens. | A coluna Criar não aparece no editor de Quais itens. | Obrigatório |

## Sublinhas e coluna Restrições (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF211 | A categoria aberta deve mostrar as sublinhas "Só se for o criador" e "Só se for o responsável", com as caixas de Ver, Atualizar e Excluir (RN204). Na coluna Criar, a sublinha mostra "·". | A seta de "Chamados de TI" mostra as 2 sublinhas, com 3 caixas cada. | Essencial | Obrigatório |
| RF204 | A sublinha "Só se for o criador" deve dizer "Marque para a ação valer só nos itens que a pessoa criou.". | A frase aparece abaixo do nome da sublinha. | Importante | Desejável |
| RF205 | A caixa de regra de uma ação desligada na categoria deve ficar desabilitada, com a dica "Libere {ação} para usar a regra.". | Sem Excluir na categoria, a caixa Excluir das 2 sublinhas fica desabilitada. | Importante | Obrigatório |
| RF206 | A sublinha "Só se for o responsável" deve ter, na coluna Restrições, a escolha dos campos Pessoa que contam como responsável, com o campo "Responsável" marcado quando existe, e dizer "Conta como responsável: {campos}.". | "Chamados de TI" abre com "Responsável" escolhido e a frase "Conta como responsável: Responsável.". | Essencial | Obrigatório |
| RF207 | Na categoria sem campo Pessoa, a sublinha "Só se for o responsável" deve ficar desabilitada e dizer "Esta categoria não tem campo Pessoa. Só a regra de criador vale aqui.". | "Fornecedores" sem campo Pessoa mostra o aviso. | Importante | Obrigatório |
| RF201 | A coluna Restrições da linha da categoria deve mostrar "Só alguns itens" quando a categoria tem regra de itens, com a dica do alcance de cada ação. | "Reembolsos" mostra "Só alguns itens", com a dica "Ver só nos itens que a pessoa criou.". | Essencial | Obrigatório |
| RF210 | A caixa da ação com regra de itens deve mostrar o ícone da regra, com a dica do alcance. | Ver em "Reembolsos" mostra o ícone de pessoa e a dica "Ver só nos itens que a pessoa criou.". | Importante | Obrigatório |
| RF213 | A tabela deve ter o filtro "Só alguns itens", com a contagem de categorias com regra de itens. | O filtro mostra "Reembolsos" e "Chamados de TI". | Desejável | Desejável |
| RF214 | A confirmação deve dizer "mudou a regra de criador" na categoria cuja regra de itens mudou. | "Reembolsos: mudou a regra de criador". | Importante | Obrigatório |

## Aplicação da regra (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF215 | Com Ver só se for o criador, a listagem deve devolver só os itens que a pessoa criou (RN201). | Exemplo: "Denúncias" com Criar e Ver só se for o criador; a pessoa cria 2 denúncias e vê só as 2. | Essencial | Obrigatório |
| RF216 | Com Atualizar ou Excluir só se for o criador, o sistema deve recusar a edição ou a exclusão do item de outra pessoa, pela tela e pela API. | A pessoa com Atualizar só se for o criador não edita o reembolso de outra pessoa. | Essencial | Obrigatório |
| RF217 | Com a regra de responsável, o sistema deve aplicar a regra pelo valor atual dos campos Pessoa escolhidos (RN202). | A pessoa tirada do campo "Responsável" de um chamado deixa de ver o chamado. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI201 | Regra de itens na permissão do cargo | A permissão grava a regra de criador e a de responsável com os campos Pessoa; o formato fica <a definir>. | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS201 | A tela só deve gravar regra de itens depois de o back aplicar a regra na listagem, na edição e na exclusão. Imposta por: o back de 24/11/2026 nega a permissão inteira quando a permissão tem regra gravada. | Com a regra gravada, o cargo continua vendo a categoria. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S201 | O item guarda quem o criou, e a regra de criador usa esse valor. | redatora, em 24/11/2026 | Nada muda |
| P201 | O item criado por agente de IA, pelo Spaceflow ou pela API tem criador? Quem é? | dev do back | Sem criador, a regra de criador nunca vale para esses itens |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone e caixa de marcar com nome acessível, modal com título e descrição, foco visível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |

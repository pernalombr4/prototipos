# 1. Editor de modelos e campos

**Objetivo:** quem configura a categoria abre o modelo em tela inteira, com uma lateral de campos, condições e
repetições, e insere um campo do item no ponto do cursor com 1 clique, sem copiar e colar marcação.

**Onde vale:** o editor de modelos de Templates de Documentos da categoria (Configurações › Estrutura › Categorias ›
<categoria> › Templates de Documentos) e o botão "Editar modelos" da lista "Usar modelo" do campo e da configuração
do campo.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", botão "Editor
de modelos" da barra inferior.

## Tela do editor de modelos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF050 | O editor de modelos deve abrir em tela inteira, com um cabeçalho que mostra "Voltar", o nome do modelo e "Modelo da categoria <categoria>". | O título "The Enlighten Co." de hoje não existe mais. | Essencial | Obrigatório |
| RF051 | O cabeçalho deve ter um seletor para trocar de modelo sem fechar o editor. | Trocar de "Contrato de prestação de serviços" para "Contrato de fornecimento" carrega o outro modelo. | Desejável | Desejável |
| RF053 | O editor deve ter uma lateral com as abas "Campos", "Condições" e "Repetições". | A lateral fica visível ao lado do documento, sem cobrir a página. | Essencial | Obrigatório |
| RF231 | As abas "Condições" e "Repetições" devem mostrar o número de blocos de cada tipo no modelo. | Com 1 bloco de condição, a aba mostra "Condições 1". | Desejável | Desejável |
| RF054 | O editor deve abrir também pelo botão "Editar modelos" da lista "Usar modelo" do campo e da configuração do campo, telas que o épico "Melhorias de UX/UI no campo editor de documentos" entrega (quem vê o botão: P6). | Os 2 botões abrem o mesmo editor. | Desejável | Desejável |
| RF055 | Quando a pessoa clica em Concluir ou em Voltar, o sistema deve salvar o modelo e mostrar "Modelo salvo". | Reabrir o modelo mostra a última edição. | Essencial | Obrigatório |
| RF239 | No editor de modelos, Esc deve fechar só o montador aberto ou "Ver a marcação"; o editor fecha por Concluir ou Voltar. | Esc com o montador aberto volta à lista e mantém o editor aberto. | Importante | Obrigatório |

## Aba Campos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF056 | A aba Campos deve listar os campos da categoria em "Campos da categoria" e "Referência", "Criado em" e "E-mail do requisitante" em "Dados do item". | Os 2 grupos aparecem com esses títulos. | Essencial | Obrigatório |
| RF057 | Cada campo da lista deve aparecer 1 vez, com o ícone do tipo, o nome e um exemplo de valor tirado do item da prévia. | Exemplo: "Valor · R$ 184.500,00". Hoje cada campo aparece 2 vezes, "Formatado" e "Não formatado". | Essencial | Obrigatório |
| RF058 | A aba Campos deve ter uma busca por nome de campo. | Digitar "vig" deixa só "Vigência (meses)". | Importante | Obrigatório |
| RF059 | Se a busca não encontra campo, a lista deve mostrar "Nenhum campo encontrado.". | A lista não fica vazia sem explicação. | Desejável | Desejável |
| RF060 | A aba Campos deve ter a chave "Inserir com formatação", ligada por padrão, com um botão "?" cujo tooltip diz "Com formatação, o valor sai como R$ 184.500,00 e 10/11/2026. Sem formatação, sai como 184500 e 2026-11-10.". | Com a chave desligada, o campo entra como "Valor (valor original)". | Importante | Obrigatório |

## Campo no documento (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF061 | Quando a pessoa clica num campo da lista, o sistema deve inserir o campo no documento, na posição do cursor. | O campo entra no ponto clicado, sem Ctrl+V. Hoje o campo vai para a área de transferência. | Essencial | Obrigatório |
| RF062 | O campo inserido deve aparecer no documento como etiqueta com o nome do campo, sem a marcação. | Aparece "Contratante" destacado, não `{{data.contratante_formatted}}`. | Essencial | Obrigatório |
| RF063 | A etiqueta deve se comportar como uma peça só: apagar remove a etiqueta inteira, e o texto dela não pode ser editado por dentro. | Backspace sobre a etiqueta apaga a etiqueta toda. | Importante | Obrigatório |
| RF064 | Se o cursor não está no documento, o campo deve entrar no fim do último parágrafo. | Inserir sem clicar antes no documento não perde o campo. | Desejável | Desejável |

## Restrições (RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS002 | A marcação gravada no modelo deve continuar no formato de hoje (`{{data.<campo>}}`, `{{data.<campo>_formatted}}`, `{{IF ...}}`, `{{END-IF}}`, `{{FOR ... IN ...}}`, `{{END-FOR ...}}`); cada parte "Senão, se" e "Nos demais casos" vira um IF que exige que as partes anteriores não valham, porque a documentação ensina 2 IFs complementares no lugar de "senão". Imposta por: protótipo, rodadas 7 e 8 (compatibilidade com os modelos existentes). | Um modelo criado antes da mudança abre no editor novo com as etiquetas e os blocos. | Essencial | Obrigatório |
| RS003 | Campos, condições e repetições devem ser montados na lateral, fora do documento; o documento só recebe o resultado. Imposta por: redatora, 21/10/2026 (o ONLYOFFICE não permite puxar campo de dentro do documento). | Nenhum menu ou atalho do editor de modelos abre dentro da página do documento. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P6 | Quem pode abrir o editor de modelos pelo campo (RF054): só quem configura a categoria? O protótipo mostra o botão para todos. | produto | A regra de exibição do botão "Editar modelos". |
| P11 | A criação de modelo em branco sem "Choose TXT options" e sem Courier New 10 entra nesta entrega? A rodada 7 registrou os 2 como achados do develop. | produto | A criação de modelo em branco volta como requisito. |

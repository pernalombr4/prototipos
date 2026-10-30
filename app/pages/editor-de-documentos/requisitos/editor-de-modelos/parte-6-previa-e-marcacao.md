# 6. Prévia e marcação

**Objetivo:** quem monta o modelo vê o documento preenchido com os dados de um item, confere a marcação que o ENSPACE
grava e pode digitar a marcação à mão, com aviso quando ela não é reconhecida.

**Depende de:** 1. Editor de modelos e campos.

**Onde vale:** o cabeçalho do editor de modelos ("Editar", "Prévia", "Prévia com os dados de"), o painel "Ver a
marcação" e o rodapé do editor de modelos.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", botão "Editor
de modelos".

## Prévia (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF077 | O cabeçalho deve ter os botões "Editar" e "Prévia", que alternam o documento entre edição e prévia. | Voltar de Prévia para Editar mostra o modelo como estava. | Essencial | Obrigatório |
| RF099 | A prévia deve mostrar o modelo com os valores dos campos do item escolhido em "Prévia com os dados de", com as condições avaliadas e as repetições feitas. | Na prévia do CTR-0142 (R$ 184.500,00), a cláusula 4 mostra o seguro-garantia; no CTR-0141 (R$ 62.000,00), a caução de 2%; no CTR-0133 (R$ 36.000,00), "Fica dispensada a apresentação de garantia.". Hoje não existe prévia. | Essencial | Obrigatório |
| RF251 | No modo Prévia, a lateral deve desabilitar a inserção de campos, "Nova condição", "Nova repetição" e os botões de inserir e salvar dos montadores. | Na Prévia, clicar num campo não insere nada. | Importante | Obrigatório |

## Marcação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF078 | "Ver a marcação" deve mostrar, abaixo do documento, a marcação que o ENSPACE grava, com "O editor gera a marcação. Você também pode digitá-la no documento.". | A marcação mostra `{{data.valor_formatted}}`, `{{}}{{IF data.valor > 150000}}` e `{{END-IF}}`. | Desejável | Desejável |
| RF230 | A pessoa deve poder digitar livremente no documento, inclusive a marcação; a marcação digitada que aponta para um campo da categoria ou um dado do item vale como a inserida pela lateral e mostra o valor na prévia. | Digitar `{{data.valor_formatted}}` mostra R$ 184.500,00 na prévia do CTR-0142, sem aviso. | Essencial | Obrigatório |
| RF079 | Se o documento tem marcação digitada à mão que o ENSPACE não reconhece, o rodapé do editor deve mostrar "1 marcação digitada à mão não foi reconhecida." ou "<N> marcações digitadas à mão não foram reconhecidas." e "Não reconhecida: <1ª marcação>. Confira o nome do campo ou insira pela aba Campos."; sem marcação desconhecida, o rodapé mostra "Todas as marcações são válidas.". | Digitar `{{data.cliente}}` mostra o aviso. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI004 | Geração da prévia do modelo com os dados de um item (rota <a definir>) | Deve receber o modelo e o item e devolver o documento montado, sem gravar no item. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P5 | Um modelo existente com marcação escrita à mão fora do padrão abre como etiqueta, como bloco ou como texto com o aviso de RF079? | time técnico | O formato da marcação gravada e RF079. |

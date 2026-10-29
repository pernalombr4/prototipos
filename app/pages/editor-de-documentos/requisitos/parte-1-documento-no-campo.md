# 1. Documento no campo

**Objetivo:** quem abre o item vê o documento do campo num cartão, com a versão atual, quem editou por último e quando,
e abre, baixa, substitui ou remove o documento a partir dele.

**Onde vale:** o campo do tipo Editor de Documentos, na visão rápida do item e na tela do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", cenários
"DOCX, 7 versões" e "PDF" e estado "Só leitura".

## Cartão do documento (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF013 | O documento deve aparecer como cartão com a miniatura da primeira página, o nome do arquivo, a versão atual, o avatar e o nome de quem editou por último, o tempo desde a edição, o tamanho e o tipo (DOCX ou PDF). | No CTR-0133, o cartão mostra "Versão 7", o autor, há quanto tempo, o tamanho e "DOCX". | Essencial | Obrigatório |
| RF014 | Um nome de arquivo maior que a largura deve quebrar em até 2 linhas e mostrar o nome inteiro no tooltip. | O nome do CTR-0133 não estoura a largura da visão rápida. | Importante | Obrigatório |
| RF015 | O botão principal do cartão deve ser "Abrir no ENSPACE", com ícone. | O botão sem contorno "Abrir Documento" de hoje não existe mais. | Essencial | Obrigatório |
| RF023 | O tamanho do arquivo mostrado no cartão deve continuar correto depois de cada edição. | Hoje o tamanho vira "-" depois de editar. | Importante | Obrigatório |

## Mais ações (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF019 | O menu "Mais ações" do cartão deve ter: Baixar .docx, Baixar como PDF, Substituir por outro arquivo e Remover documento. | O X vermelho ao lado do baixar de hoje não existe mais. | Essencial | Obrigatório |
| RF258 | Para documento PDF, "Baixar .docx" não deve aparecer no menu do cartão nem no Baixar do editor. | No CTR-0137, o menu só oferece baixar o PDF. | Importante | Obrigatório |
| RF020 | Quando a pessoa escolhe Remover documento, o sistema deve pedir confirmação com o título "Remover o documento?", a frase "<nome> e as <N> versões saem deste item. O campo fica vazio." e os botões "Cancelar" e "Remover"; ao remover, mostra o aviso "Documento removido". | Cancelar mantém o documento; Remover deixa o campo vazio. | Essencial | Obrigatório |

## PDF e leitura (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF022 | Para documento PDF, o cartão deve mostrar a faixa "PDF não se edita. Para mudar, substitua o arquivo." e o botão "Ler" no lugar de "Abrir no ENSPACE" (RN005). | O PDF do CTR-0137 não abre para edição. | Essencial | Obrigatório |
| RF096 | Para quem só pode ler o item, e com a chave Editar desligada na configuração, o cartão deve mostrar "Ler" no lugar de "Abrir no ENSPACE" e esconder Substituir e Remover. | Nenhuma ação de edição aparece. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P2 | Remover o documento apaga também as versões ou as guarda? | produto | O texto de confirmação de RF020. |
| P4 | Quem gera a miniatura da primeira página (RF013): o ONLYOFFICE ou outro serviço? | time técnico | Como RF013 se implementa. |

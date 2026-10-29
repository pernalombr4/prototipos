# Épico: Melhorias de UX/UI no campo editor de documentos

**O que é:** quem trabalha no item cria o documento do campo Editor de Documentos com 1 clique, edita no ONLYOFFICE em
tela inteira sem perder edição e vê quem editou e qual é a versão atual. Quem configura a categoria monta o modelo
com campos, condições e repetições pela lateral, sem digitar marcação. O Microsoft Word aparece no campo como "Em
breve".

**Onde vale:** o campo do tipo Editor de Documentos, na visão rápida do item (aberta pela lista) e na tela do item; a
coluna desse campo na lista de itens; a configuração do campo (Configurações › Estrutura › Categorias › Campos); e
Templates de Documentos da categoria (Configurações › Estrutura › Categorias › <categoria> › Templates de
Documentos).

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve" na barra
inferior, revisado até 21/10/2026. Os cenários se abrem pela barra inferior: "Sem documento", "DOCX, 1 versão",
"DOCX, 7 versões", "PDF" e "Editando junto"; os estados, por "Normal", "Carregando", "Erro" e "Só leitura"; o editor de
modelos e a configuração do campo, pelos botões "Editor de modelos" e "Configuração". A barra inferior do protótipo
é ferramenta de revisão e não entra no produto.

**Fora do escopo:** editar no Microsoft Word, a reserva do documento e o plugin do Word (fase "2" do protótipo, outra
demanda); a barra e as ferramentas do próprio ONLYOFFICE; a geração de documentos em lote; a casca da tela (menu
lateral, barra do topo, lista de itens fora da coluna do campo).

**Relevância** (nas tarefas, entre parênteses no fim do requisito; sem parênteses, é Obrigatório): Obrigatório, o
dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer
quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Documento no campo](parte-1-documento-no-campo.md) | O cartão do documento, com miniatura, versão, autor, "Abrir no ENSPACE" e o menu "Mais ações" | | É a base: o documento existente aparece e abre a partir dele |
| [2. Editor no ENSPACE](parte-2-editor-no-enspace.md) | O ONLYOFFICE em tela inteira, com cabeçalho do ENSPACE, salvamento automático e visível, Concluir e o modo leitura | 1 | Resolve a edição que hoje se perde; as partes 3 e 4 abrem este editor |
| [3. Criar o documento](parte-3-criar-o-documento.md) | O campo vazio com "Usar modelo" (e prévia), "Em branco" e "Enviar arquivo", sem gaveta | 1 e 2 | "Em branco" abre o editor da parte 2 |
| [4. Versões](parte-4-versoes.md) | O histórico com autor, data, origem, Ver, Baixar e Restaurar, no cartão e no editor | 2 | Ver abre a versão no modo leitura do editor |
| [5. Coluna na lista de itens](parte-5-coluna-na-lista.md) | A célula do campo com tipo, nome e versão, e "Sem documento" | | Não depende de outra parte; corre em paralelo |
| [6. Salvar do item](parte-6-salvar-do-item.md) | O aviso "Alterações não salvas" e o Salvar do item só com mudança nos campos | 2 | O documento se salva pelo editor da parte 2 |
| [7. Editando junto](parte-7-editando-junto.md) | Quem está editando, no cartão, no editor e na lista, "Editar junto" e as ações que ficam desabilitadas | 2, 4 e 5 | Fica fora da base porque pede o retorno de presença do ONLYOFFICE |
| [8. Word em breve](parte-8-word-em-breve.md) | A seta do botão principal com o menu de editores e o Word desabilitado com "Em breve" | 1 e 2 | Prepara a fase do Word sem esperar por ela |
| [9. Configuração do campo](parte-9-configuracao-do-campo.md) | As configurações em 3 grupos, Editar ligado num campo novo e a pré-visualização do campo vazio | 3 | As chaves de "Como o documento nasce" mudam o campo vazio da parte 3 |
| [10. Editor de modelos e campos](parte-10-editor-de-modelos.md) | O editor de modelos em tela inteira, a lateral com as abas e o campo inserido no cursor como etiqueta | | É a base do editor de modelos; não depende do campo |
| [11. Condições](parte-11-condicoes.md) | A aba Condições, o montador com linhas e "Precisa valer" e o bloco emoldurado no documento | 10 | Usa a lateral e as etiquetas da parte 10 |
| [12. Grupo, "Senão, se" e "Nos demais casos"](parte-12-grupo-e-senao.md) | O grupo de linhas e as partes "Senão, se" e "Nos demais casos" da condição | 11 | Isola o que depende da resposta sobre o motor de modelos |
| [13. Repetições](parte-13-repeticoes.md) | A aba Repetições, o montador com lista, formato e informações e o bloco no documento | 10 | Usa a lateral e as etiquetas da parte 10 |
| [14. Filtro, ordem, numeração e total](parte-14-filtro-ordem-e-total.md) | O filtro, a ordem, a numeração, o total e "Se a lista estiver vazia" da repetição | 11 e 13 | Isola o que depende da resposta sobre o motor de modelos; o filtro usa as linhas da parte 11 |
| [15. Prévia e marcação](parte-15-previa-e-marcacao.md) | A prévia com os dados de um item, "Ver a marcação", a marcação digitada à mão e o aviso da não reconhecida | 10 | A prévia mostra o que as partes 11 a 14 montam, mas já serve com os campos |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN002 | Uma versão nova é criada a cada criação do documento, conclusão de edição com mudança, envio de arquivo e restauração. | Abrir e concluir sem mudar nada não cria versão. | Obrigatório |
| RN005 | Um documento PDF não pode ser editado; só pode ser substituído. | O PDF abre só para leitura. | Obrigatório |
| RN006 | O documento é salvo pelo editor, separado do Salvar dos campos do item. | Sair do item sem salvar não desfaz a edição do documento. | Obrigatório |
| RN007 | A origem de uma versão é uma destas: gerada do modelo, criada em branco, arquivo enviado, editada no ENSPACE, editada no Word, restaurada. | Documento criado pelo botão Em branco nasce com a origem "Criada em branco". | Obrigatório |

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
| Exceção deste épico | A área do documento no protótipo imita o ONLYOFFICE: a barra e as ferramentas dele seguem o ONLYOFFICE, não o protótipo. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Modelo | O template de documento da categoria, com campos e blocos | "Templates de Documentos" no menu; "Modelo" no editor |
| Etiqueta de campo | O campo inserido no modelo, mostrado com o nome do campo | o nome do campo, destacado |
| Bloco de condição | Trecho do modelo que só aparece quando a condição vale, com 1 ou mais partes | "Se...", "Senão, se...", "Nos demais casos" |
| Parte da condição | Cada texto alternativo do bloco de condição, com a própria regra; a última pode ser "Nos demais casos" | "Se", "Senão, se", "Nos demais casos" |
| Grupo | Conjunto de linhas de condição com o próprio "Precisa valer", dentro de uma parte | "Grupo" |
| Bloco de repetição | Trecho do modelo repetido para cada linha de uma lista, com a parte opcional "Se a lista estiver vazia" | "Para cada linha de..." |
| Montador | O painel da lateral onde se cria ou se edita uma condição ou uma repetição | "Nova condição", "Editar condição", "Nova repetição", "Editar repetição" |
| Item da prévia | O item escolhido no cabeçalho do editor de modelos, cujos valores alimentam a prévia, os exemplos e os selos | "Prévia com os dados de" |
| Marcação | O texto que o ENSPACE grava no modelo (`{{data.campo}}`, `{{IF ...}}`, `{{FOR ...}}`) | "Ver a marcação" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P8 | O motor de modelos aceita `!(...)` e parênteses no IF, `.includes()` para "contém" e, no FOR, `.filter()`, `.sort()`, `$idx` e `.reduce()`? A marcação do protótipo usa isso para "Senão, se", "Nos demais casos", filtro, ordem, numeração, total e lista vazia. | time técnico | Se não aceita, o ENSPACE precisa de outra forma de gravar o que as partes 12 e 14 montam. |
| P9 | O texto dos formatos aceitos e a mensagem de recusa do arquivo acompanham as chaves "Enviar arquivo .docx" e "Enviar arquivo .pdf"? No protótipo, os 2 textos são fixos. | produto | O campo vazio (parte 3) e a pré-visualização da configuração (parte 9). |
| P13 | "Excluir a condição e o texto" e "Excluir a repetição" pedem confirmação ou oferecem desfazer? No protótipo, apagam na hora. | produto | As partes 11 e 13. |
| P14 | Com as 4 chaves de "Como o documento nasce" desligadas, o que o campo vazio mostra? | produto | As partes 3 e 9. |
| P15 | "Substituir por outro arquivo" cria a versão seguinte do mesmo documento (RN002) ou recomeça o histórico na versão 1, como faz o protótipo? | produto | As partes 1 e 4. |
| S3 | Suposição: o motor de modelos é o docx-templates (sintaxe `IF`, `FOR ... IN`, `$item`, `END-FOR item`), que aceita JavaScript dentro do IF e do FOR. | time técnico | P8. |
| S4 | Suposição: a lateral insere o campo e o bloco no cursor do ONLYOFFICE pela API de automação do editor (conector). Sem ela, o clique copia a marcação e a pessoa cola, como hoje. | time técnico | As partes 10, 11 e 13. |

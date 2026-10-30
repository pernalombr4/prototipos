# Épico: Editor de modelos de documento

**O que é:** quem configura a categoria monta o modelo de documento em tela inteira, com campos, condições e repetições
pela lateral, sem digitar marcação. O campo entra no cursor como etiqueta, e a prévia mostra o documento com os dados de
um item.

**Onde vale:** Templates de Documentos da categoria (Configurações › Estrutura › Categorias › <categoria> › Templates de
Documentos) e o botão "Editar modelos" da lista "Usar modelo" do campo e da configuração do campo.

**Depende de:** só o botão "Editar modelos" depende de outro épico: ele fica na lista "Usar modelo" do campo e na
configuração do campo, que o épico "Melhorias de UX/UI no campo editor de documentos" entrega. O editor de modelos abre
pelo menu de Templates de Documentos sem esse épico.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", botão "Editor de
modelos" da barra inferior, revisado até 21/10/2026. A barra inferior do protótipo é ferramenta de revisão e não entra
no produto.

**Fora do escopo:** o campo Editor de Documentos no item (cartão, editor, versões, coluna na lista e configuração do
campo), que é do épico "Melhorias de UX/UI no campo editor de documentos"; a barra e as ferramentas do próprio
ONLYOFFICE; a geração de documentos em lote; a casca da tela (menu lateral, barra do topo).

**Prioridade e relevância** (nas tarefas, entre parênteses no fim de cada requisito): a prioridade é Essencial,
Importante ou Desejável. A relevância diz o que o dev pode deixar de fazer: Obrigatório, o dev faz. Desejável, o dev
faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande
para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Editor de modelos e campos](parte-1-editor-de-modelos.md) | O editor de modelos em tela inteira, a lateral com as abas e o campo inserido no cursor como etiqueta | | É a base: as outras partes usam a lateral e as etiquetas |
| [2. Condições](parte-2-condicoes.md) | A aba Condições, o montador com linhas e "Precisa valer" e o bloco emoldurado no documento | 1 | Usa a lateral e as etiquetas da parte 1 |
| [3. Grupo, "Senão, se" e "Nos demais casos"](parte-3-grupo-e-senao.md) | O grupo de linhas e as partes "Senão, se" e "Nos demais casos" da condição | 2 | Isola o que depende da resposta sobre o motor de modelos |
| [4. Repetições](parte-4-repeticoes.md) | A aba Repetições, o montador com lista, formato e informações e o bloco no documento | 1 | Usa a lateral e as etiquetas da parte 1 |
| [5. Filtro, ordem, numeração e total](parte-5-filtro-ordem-e-total.md) | O filtro, a ordem, a numeração, o total e "Se a lista estiver vazia" da repetição | 2 e 4 | Isola o que depende da resposta sobre o motor de modelos; o filtro usa as linhas da parte 2 |
| [6. Prévia e marcação](parte-6-previa-e-marcacao.md) | A prévia com os dados de um item, "Ver a marcação", a marcação digitada à mão e o aviso da não reconhecida | 1 | A prévia mostra o que as partes 2 a 5 montam, mas já serve com os campos |

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
| P8 | O motor de modelos aceita `!(...)` e parênteses no IF, `.includes()` para "contém" e, no FOR, `.filter()`, `.sort()`, `$idx` e `.reduce()`? A marcação do protótipo usa isso para "Senão, se", "Nos demais casos", filtro, ordem, numeração, total e lista vazia. | time técnico | Se não aceita, o ENSPACE precisa de outra forma de gravar o que as partes 3 e 5 montam. |
| P13 | "Excluir a condição e o texto" e "Excluir a repetição" pedem confirmação ou oferecem desfazer? No protótipo, apagam na hora. | produto | As partes 2 e 4. |
| S3 | Suposição: o motor de modelos é o docx-templates (sintaxe `IF`, `FOR ... IN`, `$item`, `END-FOR item`), que aceita JavaScript dentro do IF e do FOR. | time técnico | P8. |
| S4 | Suposição: a lateral insere o campo e o bloco no cursor do ONLYOFFICE pela API de automação do editor (conector). Sem ela, o clique copia a marcação e a pessoa cola, como hoje. | time técnico | As partes 1, 2 e 4. |

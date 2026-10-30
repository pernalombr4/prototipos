# Épico: Melhorias de UX/UI no campo editor de documentos

**O que é:** quem trabalha no item cria o documento do campo Editor de Documentos com 1 clique, edita no ONLYOFFICE em
tela inteira sem perder edição e vê quem editou e qual é a versão atual. O Microsoft Word aparece no campo como "Em
breve".

**Onde vale:** o campo do tipo Editor de Documentos, na visão rápida do item (aberta pela lista) e na tela do item; a
coluna desse campo na lista de itens; e a configuração do campo (Configurações › Estrutura › Categorias › Campos).

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve" na barra
inferior, revisado até 21/10/2026. Os cenários se abrem pela barra inferior: "Sem documento", "DOCX, 1 versão", "DOCX, 7
versões", "PDF" e "Editando junto"; os estados, por "Normal", "Carregando", "Erro" e "Só leitura"; a configuração do
campo, pelo botão "Configuração". A barra inferior do protótipo é ferramenta de revisão e não entra no produto.

**Fora do escopo:** editar no Microsoft Word, a reserva do documento e o plugin do Word (fase "2" do protótipo, outra
demanda); o editor de modelos de Templates de Documentos, que é do épico "Editor de modelos de documento"; a barra e as
ferramentas do próprio ONLYOFFICE; a geração de documentos em lote; a casca da tela (menu lateral, barra do topo, lista
de itens fora da coluna do campo).

**Prioridade e relevância** (nas tarefas, entre parênteses no fim de cada requisito): a prioridade é Essencial,
Importante ou Desejável. A relevância diz o que o dev pode deixar de fazer: Obrigatório, o dev faz. Desejável, o dev
faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande
para o ganho.

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

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P9 | O texto dos formatos aceitos e a mensagem de recusa do arquivo acompanham as chaves "Enviar arquivo .docx" e "Enviar arquivo .pdf"? No protótipo, os 2 textos são fixos. | produto | O campo vazio (parte 3) e a pré-visualização da configuração (parte 9). |
| P14 | Com as 4 chaves de "Como o documento nasce" desligadas, o que o campo vazio mostra? | produto | As partes 3 e 9. |
| P15 | "Substituir por outro arquivo" cria a versão seguinte do mesmo documento (RN002) ou recomeça o histórico na versão 1, como faz o protótipo? | produto | As partes 1 e 4. |

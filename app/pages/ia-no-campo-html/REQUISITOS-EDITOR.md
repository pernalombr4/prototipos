# Requisitos: campo Editor de texto HTML (barras, "/" e formatação)

**Objetivo:** quem escreve no campo Editor de texto HTML formata o texto como num editor no padrão do Notion: barra
fixa completa, a mesma barra flutuando sobre a seleção, menu "/" com os blocos e os atalhos, alça para mover e
transformar cada bloco, cor de texto e de fundo, link com busca de item, menção e emoji.

**Onde vale:** cada campo Editor de texto HTML do formulário do item (tela do item, folder Visão Geral).

**Referência visual:** protótipo navegável em https://pernalombr4.github.io/prototipos/ia-no-campo-html/, aprovado em
14/10/2026 e revisado até a rodada 12 (20/10/2026). O mesmo protótipo mostra a IA do campo, que é outra demanda
(`REQUISITOS-IA.md`, nesta pasta). Código, textos nos 3 idiomas, decisões e prints em
https://github.com/pernalombr4/prototipos/tree/main/app/pages/ia-no-campo-html. A barra inferior do protótipo
(estado, tema, idioma) é ferramenta de revisão e não entra no produto.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
Os exemplos usam o item de demonstração do protótipo (contrato da Tecnoverde, campo "Parecer do jurídico").

**Fora do escopo:** a casca da tela do item, os outros tipos de campo e a IA (botão "IA", Ctrl J, grupo do BENI no
"/", "Perguntar ao BENI" na alça e tudo o que eles abrem), que estão no `REQUISITOS-IA.md`. Este documento reserva o
lugar da IA nas barras, no "/" e na alça; sem a demanda da IA, esses lugares ficam vazios.

## Resumo

| Grupo | O que muda em relação ao develop (medido em setembro de 2026, no protótipo `padrao-dos-campos`) | Requisitos |
|---|---|---|
| Barra fixa | Hoje: desfazer, refazer, título, negrito, itálico, sublinhado, tachado, código, emoji, alinhamento e mais. Ganha tipo do bloco, cor, link, limpar formatação e um "Mais" maior, e fica presa no topo do campo | RF001 a RF012 |
| Barra da seleção | Hoje não existe. A mesma barra, menor, sobre o texto selecionado | RF013 a RF015 |
| Cor | Hoje não existe. Cor do texto e de fundo, 10 cores, com as usadas por último | RF016 a RF020 |
| Link | Um campo só para colar endereço ou buscar item do workspace | RF021 a RF026 |
| Menu "/" | Grupos com descrição e atalho; o que existe hoje não foi medido (P1) | RF027 a RF033 |
| Atalhos de teclado e markdown | Atalho markdown no começo da linha e atalhos de formatação | RF034 a RF036 |
| Alça do bloco | Hoje não existe. + e ⠿ em cada bloco, com arrastar e menu | RF037 a RF041 |
| Menção, emoji e tabela | "@" para pessoa, ":" para emoji e ações de tabela | RF042 a RF046 |
| Pé e placeholder | Contagem de palavras e de caracteres; placeholder com o "/" | RF047 a RF048 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN001 | Cada cor aplicada ao texto é gravada pelo nome da cor, e o tom exibido acompanha o tema claro ou escuro. | Um trecho "Texto vermelho" aparece em vermelho 700 no tema claro e em vermelho 400 no escuro. |
| RN002 | Um link para item do workspace aponta para o endereço do item, e o texto do link é o texto que a pessoa selecionou (ou o nome do item, sem seleção). | Selecionar "contrato" e escolher o item CON-0012 cria o link no texto "contrato". |
| RN003 | Uma menção aponta para um membro do workspace. | "@Renata" só lista quem é membro do workspace do item. |

## Barra fixa (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF001 | A barra fixa deve ter, nesta ordem: [lugar da IA]; "Desfazer" e "Refazer"; "Tipo do bloco ▾"; "Negrito", "Itálico", "Sublinhado", "Tachado" e "Código"; "Cor ▾", "Link" e "Limpar formatação"; "Emoji", "Alinhamento ▾" e "Mais ▾", com um separador entre os grupos. | A ordem confere com o protótipo; sem a demanda da IA, a barra começa em "Desfazer". | Essencial |
| RF002 | Cada botão da barra deve ter dica com o nome e o atalho de teclado, quando houver. | Passar o mouse em "Negrito" mostra "Negrito" e Ctrl B. | Importante |
| RF003 | O botão de uma formatação presente no cursor ou na seleção deve aparecer marcado. | Com o cursor num trecho em negrito, "Negrito" fica marcado. | Importante |
| RF004 | "Tipo do bloco" deve mostrar o tipo do bloco do cursor e trocar o bloco entre "Texto", "Título 1", "Título 2", "Título 3", "Lista", "Lista numerada", "Checklist", "Citação" e "Bloco de código". | Escolher "Título 2" transforma o parágrafo em título, e o botão passa a mostrar "Título 2". | Essencial |
| RF005 | "Cor" deve abrir o seletor de cor (RF016). | Clicar em "Cor" abre o seletor sobre o campo. | Essencial |
| RF006 | "Link" deve abrir o campo do link (RF021). | Clicar em "Link" com uma palavra selecionada abre o campo do link. | Essencial |
| RF007 | "Limpar formatação" deve tirar do trecho selecionado negrito, itálico, sublinhado, tachado, código, cor de texto e cor de fundo. | Limpar uma frase em negrito vermelho deixa a frase sem negrito e sem cor. | Importante |
| RF008 | "Emoji" deve abrir a lista de emojis e inserir no cursor o emoji escolhido. | Escolher 👍 insere 👍 no cursor. | Desejável |
| RF009 | "Alinhamento" deve alinhar o bloco do cursor à esquerda, ao centro, à direita ou justificado. | "Centralizar" centraliza o parágrafo do cursor. | Importante |
| RF010 | "Mais" deve ter "Mencionar pessoa", "Tabela", "Divisor", "Sobrescrito", "Subscrito", "Diminuir recuo" e "Aumentar recuo". | Abrir "Mais" mostra os 7 itens. | Importante |
| RF011 | Com o cursor numa tabela, "Mais" deve ter também "Adicionar linha", "Adicionar coluna", "Excluir linha", "Excluir coluna" e "Excluir tabela". | Com o cursor fora da tabela, as ações de tabela não aparecem. | Importante |
| RF012 | Quando o conteúdo do campo passa da altura visível da tela, a barra fixa deve ficar presa no topo do campo durante a rolagem. | Rolar um parecer de 2 telas mantém a barra visível no topo do campo. | Importante |

## Barra da seleção (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF013 | Quando a pessoa seleciona texto no campo, o sistema deve mostrar sobre a seleção a barra da seleção: [lugar da IA]; "Tipo do bloco ▾"; "Negrito", "Itálico", "Sublinhado", "Tachado" e "Código"; "Link"; "Cor ▾"; "⋯". | Selecionar 1 frase mostra a barra acima dela. | Essencial |
| RF014 | "⋯" deve ter "Sobrescrito", "Subscrito", os 4 alinhamentos e "Limpar formatação". | Abrir "⋯" mostra os 7 itens. | Importante |
| RF015 | A barra da seleção deve sumir quando a seleção acaba, e continuar aberta enquanto um menu dela (cor, link, "⋯") está aberto. | Abrir "Cor" pela barra da seleção não fecha a barra. | Essencial |

## Cor (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF016 | O seletor de cor deve ter 3 grupos: "Usadas recentemente", "Cor do texto" e "Cor de fundo". | Abrir o seletor mostra os 3 grupos. | Essencial |
| RF017 | "Cor do texto" e "Cor de fundo" devem ter 10 cores cada: "Padrão", "Cinza", "Marrom", "Laranja", "Amarelo", "Verde", "Azul", "Roxo", "Rosa" e "Vermelho". | Cada quadrado tem o nome na dica e para o leitor de tela ("Texto vermelho", "Fundo amarelo"). | Essencial |
| RF018 | "Padrão" deve tirar a cor de texto (ou de fundo) do trecho. | "Padrão" em "Cor de fundo" tira o fundo e mantém a cor do texto. | Importante |
| RF019 | "Usadas recentemente" deve mostrar as últimas cores usadas pela pessoa, de texto e de fundo. | Pintar de verde e depois aplicar fundo amarelo mostra as 2 em "Usadas recentemente". | Desejável |
| RF020 | Ctrl Shift H deve repetir no trecho selecionado a última cor usada. | Pintar uma frase de vermelho, selecionar outra e teclar Ctrl Shift H deixa a 2ª vermelha. | Desejável |

## Link (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF021 | O campo do link deve ser um só, com o placeholder "Cole um link ou busque um item". | Clicar em "Link" abre o campo com o foco nele. | Essencial |
| RF022 | Quando a pessoa digita, o sistema deve listar o endereço digitado ("Link digitado") e os itens do workspace cujo nome contém o texto ("Itens do workspace"). | Digitar "Tecno" lista os itens com "Tecno" no nome. | Essencial |
| RF023 | Na lista do link, o sistema deve aceitar as setas para percorrer, o Enter para aplicar o link escolhido e o Esc para fechar o campo sem mudar o texto. | Enter no 1º item aplica o link; Esc fecha. | Importante |
| RF024 | Se a busca não acha item com o nome digitado e o texto não é um endereço, o campo deve mostrar "Nenhum item com esse nome. Cole o endereço completo.". | Digitar "xyz" mostra a mensagem. | Importante |
| RF025 | Num link existente, o sistema deve mostrar "Abrir link", "Copiar link" e "Remover link". | "Copiar link" mostra "Link copiado."; "Remover link" deixa o texto sem link. | Importante |
| RF026 | Ctrl K deve abrir o campo do link no trecho selecionado. | Selecionar uma palavra e teclar Ctrl K abre o campo. | Importante |

## Menu "/" (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF027 | Quando a pessoa digita "/" no campo, o sistema deve abrir o menu de comandos no cursor. | Digitar "/" numa linha abre o menu logo abaixo. | Essencial |
| RF028 | O menu deve ter, nesta ordem: [lugar da IA]; "Blocos básicos"; "Inserir"; "Cor do texto". | O menu mostra os 3 grupos nessa ordem; sem a demanda da IA, começa em "Blocos básicos". | Essencial |
| RF029 | "Blocos básicos" deve ter "Texto", "Título 1", "Título 2", "Título 3", "Lista", "Lista numerada", "Checklist", "Citação", "Bloco de código" e "Divisor", com o atalho markdown na descrição ("Atalho: #", "Atalho: -", "Atalho: 1.", "Atalho: [ ]", "Atalho: >", "Atalho: ```", "Atalho: ---"). | "Título 1" mostra "Atalho: #". | Essencial |
| RF030 | "Inserir" deve ter "Tabela", "Link" (com "Atalho: Ctrl K"), "Mencionar pessoa" (com "Atalho: @") e "Emoji" (com "Atalho: :"). | Escolher "Tabela" insere uma tabela no cursor. | Importante |
| RF031 | "Cor do texto" deve ter as 10 cores de texto da RF017, que pintam o bloco do cursor. | Digitar "/vermelho" filtra a cor vermelha; Enter pinta o bloco. | Desejável |
| RF032 | O texto digitado depois do "/" deve filtrar o menu pelo nome do comando. | "/tit" mostra só os 3 títulos. | Essencial |
| RF033 | No menu "/", o sistema deve aceitar as setas para percorrer, o Enter para aplicar o comando e apagar o "/" digitado, e o Esc para fechar o menu e manter o texto. | Enter em "Lista" transforma a linha em lista, sem o "/". | Essencial |

## Atalhos de teclado e markdown (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF034 | Digitado no começo de uma linha e seguido de espaço, cada atalho markdown da RF029 deve transformar a linha no bloco do atalho. | "# " vira Título 1; "- " vira lista; "[ ] " vira checklist; "---" vira divisor. | Importante |
| RF035 | Os atalhos de formatação devem funcionar no trecho selecionado: Ctrl B (negrito), Ctrl I (itálico), Ctrl U (sublinhado), Ctrl Shift S (tachado), Ctrl E (código), Ctrl Z (desfazer) e Ctrl Y (refazer). | Selecionar uma palavra e teclar Ctrl B deixa a palavra em negrito. | Importante |
| RF036 | Tab e Shift Tab numa lista devem aumentar e diminuir o nível do item. | Tab no 2º item da lista o põe debaixo do 1º. | Importante |

## Alça do bloco (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF037 | Quando o mouse passa sobre um bloco, o sistema deve mostrar à esquerda do bloco a alça com "+" ("Adicionar bloco abaixo") e "⠿" ("Arraste para mover. Clique para abrir o menu."). | Passar o mouse no 2º parágrafo mostra + e ⠿ ao lado dele. | Importante |
| RF038 | "+" deve criar uma linha vazia abaixo do bloco e abrir o menu "/" nela. | Clicar em "+" abre o "/" na linha nova. | Importante |
| RF039 | Arrastar o "⠿" deve mover o bloco para o lugar onde a pessoa solta. | Arrastar o 2º parágrafo para cima do 1º troca a ordem. | Importante |
| RF040 | Clicar no "⠿" deve abrir o menu do bloco: "Transformar em ›", "Cor ›", "Duplicar", "Copiar texto", "Mover para cima", "Mover para baixo", [lugar da IA] e "Excluir". | O menu mostra os itens nessa ordem; "Copiar texto" mostra "Texto copiado.". | Importante |
| RF041 | "Mover para cima" e "Mover para baixo" devem trocar o bloco de lugar com o vizinho de cima ou de baixo. | Mover o 1º parágrafo para baixo deixa o 2º em 1º. | Desejável |

## Menção, emoji e tabela (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF042 | Quando a pessoa digita "@", o sistema deve listar os membros do workspace (RN003), filtrando pelo texto digitado depois do "@". | "@Re" lista os membros com "Re" no nome; Enter insere a menção. | Importante |
| RF043 | A menção inserida deve aparecer destacada no texto, com o nome do membro. | A menção a Renata Albuquerque aparece como "@Renata Albuquerque" destacada. | Importante |
| RF044 | Quando a pessoa digita ":", o sistema deve listar os emojis pelo nome digitado depois dos 2 pontos. | ":fogo" lista 🔥; Enter insere o emoji. | Desejável |
| RF045 | A tabela inserida deve começar com 3 linhas e 3 colunas, com a 1ª linha de cabeçalho. | Inserir "Tabela" cria uma tabela 3 por 3 com cabeçalho. | Importante |
| RF046 | Tab na última célula de uma tabela deve criar uma linha nova. | Tab na última célula acrescenta uma linha. | Desejável |

## Pé e placeholder (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF047 | O pé do campo deve mostrar a contagem de palavras e de caracteres do conteúdo, no formato "61 palavras · 351 caracteres" (singular com 1). | O "Parecer do jurídico" de exemplo mostra "61 palavras · 351 caracteres"; o campo vazio mostra "0 palavras · 0 caracteres". | Desejável |
| RF048 | O placeholder do campo vazio deve citar o "/": "Escreva ou digite "/" para comandos...". Com a demanda da IA, o texto muda conforme o `REQUISITOS-IA.md` (RF007). | O campo "Observações internas" vazio mostra o placeholder. | Importante |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI001 | Busca de itens do workspace para o link: rota <a definir> | Deve receber o texto digitado e devolver os itens cujo nome contém o texto, com nome, categoria e endereço. |
| RI002 | Lista de membros para a menção: rota <a definir> | Deve devolver os membros do workspace do item, com nome e avatar. |
| RI003 | Gravação do campo | O HTML gravado deve guardar a cor pelo nome (RN001), a menção pelo membro (RN003) e o link de item pelo endereço do item (RN002). Formato <a definir>; no protótipo, a cor é gravada como `var(--cor-texto-vermelho)`. |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF001 | Cada uma das 10 cores de texto deve ter contraste de 4,5:1 ou mais com o fundo, nos temas claro e escuro (WCAG 2.2 AA, critério 1.4.3). | No protótipo: tom 700 ou 600 no claro e 400 no escuro; medir as 10 nos 2 temas. | Essencial |
| RNF002 | Cada botão da barra, do menu "/" e do seletor de cor deve ter nome para o leitor de tela. | Navegar com o leitor de tela lê o nome de cada botão. | Importante |
| RNF003 | Os botões da barra devem ter 28 px de altura, a medida da barra de hoje no desktop. | Medir a altura dos botões. | Desejável |
| RNF004 | Cada quadrado do seletor de cor deve informar ao leitor de tela se a cor está aplicada no trecho (`aria-pressed`). | Com o trecho em vermelho, o leitor lê "Texto vermelho, pressionado". | Importante |
| RS001 | Cada texto do campo, das barras e dos menus deve existir em português, inglês e espanhol. Imposta por: spec dos protótipos, regra 35. | Trocar o idioma troca cada rótulo e cada dica. | Essencial |
| RS002 | O campo deve usar o TipTap, como o editor de hoje do ENSPACE, com as extensões na mesma versão do TipTap que o Nuxt UI usa. Imposta por: a redatora, em 09/10/2026. | No protótipo: TipTap 3.31.3, com `extension-text-style` (Color e BackgroundColor), `extension-text-align`, `extension-list`, `extension-table`, `extension-subscript`, `extension-superscript` e `extension-emoji`. | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | O menu "/" de hoje do develop não foi medido. Os grupos deste documento seguem o padrão do Notion. | conferir no develop | RF028 a RF031: o que já existe e o que é novo |
| P2 | O conteúdo já gravado com cor em código hexadecimal (se existir) continua com o tom gravado ou passa para a cor por nome? | time de front-end | RN001 ganha uma regra de transição (RT) |
| P3 | Colar texto de outro editor (Word, página web) mantém a formatação, mantém só negrito, itálico, listas e links, ou cola texto puro? | produto | Novo requisito de colagem |
| P4 | O emoji do produto usa o seletor completo; o protótipo mostra a lista do TipTap. Qual seletor fica? | produto | RF008 e RF044 |
| P5 | Imagem e arquivo dentro do texto entram nesta demanda? O protótipo não tem. | produto | Novo grupo "Inserir" |
| P6 | Há limite de tamanho do conteúdo do campo? O que a tela mostra quando passa? | time de back-end | Novo erro no pé do campo |
| P7 | No 1º bloco, "Mover para cima" fica desativado ou some? E no último, "Mover para baixo"? | produto | RF041 |
| S1 | Mover bloco pelo teclado (Alt seta, como no Notion) não está no protótipo; fica como sugestão. | produto | Novo atalho na RF041 |

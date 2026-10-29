# 2. Editor no ENSPACE

**Objetivo:** quem edita o documento trabalha no ONLYOFFICE em tela inteira, vê que a edição está salva sem apertar
Ctrl+S e volta ao item pelo Concluir, com a versão nova no cartão.

**Depende de:** 1. Documento no campo.

**Onde vale:** o editor que abre pelo botão "Abrir no ENSPACE" e pela miniatura do cartão do documento.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", cenários
"DOCX, 7 versões" e "PDF" e estado "Só leitura".

## Tela do editor (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF026 | O ONLYOFFICE deve abrir em tela inteira dentro do ENSPACE. | O editor ocupa a largura toda; a gaveta sobre a gaveta do item e o botão "Tela Cheia" não existem mais. | Essencial | Obrigatório |
| RF027 | Acima do ONLYOFFICE, um cabeçalho fixo deve mostrar "Voltar ao item", o nome do arquivo e "<referência do item> · <categoria> · <rótulo do campo>". | O cabeçalho continua visível ao rolar o documento. | Essencial | Obrigatório |
| RF032 | O cabeçalho deve ter os botões Versões, Baixar (.docx e PDF; só PDF para documento PDF) e Concluir. | Concluir é o botão de destaque. | Essencial | Obrigatório |
| RF037 | O rodapé do editor deve mostrar a versão aberta, quem editou por último e "Esc fecha só o que está por cima. O editor fecha pelo Concluir.". | Exemplo: "Versão 5 · Carla Menezes, agora". | Desejável | Desejável |
| RF038 | A revisão ortográfica do ONLYOFFICE deve seguir o idioma do ENSPACE da pessoa. | Com o ENSPACE em português, a revisão é em português. Hoje fica em "English (United States)". | Importante | Obrigatório |

## Salvar e concluir (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF028 | O sistema deve salvar a edição sem a pessoa apertar Ctrl+S (RN006). | Editar, fechar e reabrir mostra a edição. Hoje a edição se perde. | Essencial | Obrigatório |
| RF029 | O cabeçalho deve mostrar o estado do salvamento: "Salvando" com indicador girando, e "Salvo agora" ou "Salvo há <tempo>". | O estado muda ao digitar e volta para salvo. | Essencial | Obrigatório |
| RF033 | Quando a pessoa clica em Concluir ou em Voltar ao item, o sistema deve salvar o que faltar, fechar o editor e, se houve mudança, mostrar "Versão <N> salva" (RN002). | O cartão mostra a versão nova, com a pessoa como autora. | Essencial | Obrigatório |
| RF036 | Esc deve fechar só o que está por cima do editor (o histórico, um menu); sem nada por cima, Esc não fecha o editor. | Fechar o histórico com Esc mantém o editor aberto; o 2º Esc não fecha o editor. Hoje Esc fecha o editor inteiro. | Importante | Obrigatório |

## Modo leitura (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF017 | Clicar na miniatura do cartão deve abrir o documento para leitura. | O editor abre com o selo "Somente leitura". | Desejável | Desejável |
| RF035 | Em modo leitura (PDF, perfil sem edição, Editar desligado na configuração ou versão antiga), o cabeçalho deve mostrar o selo "Somente leitura" (RN005). | Lendo a versão 1 do CTR-0135, o selo diz "Versão 1 · Somente leitura". | Essencial | Obrigatório |
| RF097 | Em modo leitura, o documento deve recusar digitação e colagem. | Digitar no documento aberto em leitura não muda o texto. | Essencial | Obrigatório |

## Não funcionais (RNF)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RNF001 | O estado "Salvando" deve virar "Salvo agora" em até <proposta: 2 s, sem medição> depois de a pessoa parar de digitar. | Medir no develop com um documento de 5 páginas. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P10 | Como o editor avisa a queda de conexão, e o que guarda até ela voltar? O protótipo não mostra esse estado. | time técnico e produto | Um requisito novo no editor. |

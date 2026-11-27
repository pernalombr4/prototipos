# 4. Importar o arquivo do menu

**Objetivo:** quem configura o workspace importa o arquivo do menu ou de um caso de uso exportado de outro workspace, e
escolhe somar ao menu de hoje ou substituir.

**Depende de:** 1. Exportar o meu menu; 2. Central de casos de uso e usar caso de uso.

**Onde vale:** "Importar", no pé do "+" do Início.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, "+" do Início > "Importar".

## Importar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | "Importar" deve abrir a janela com a área que recebe o arquivo `.json`, arrastado ou escolhido pelo clique. | Soltar o arquivo exportado de outro workspace carrega o arquivo. | Essencial | Obrigatório |
| RF302 | A área de arraste deve abrir a escolha de arquivo também com Enter e Espaço. | Com o foco na área, Enter abre a escolha de arquivo. | Importante | Obrigatório |
| RF303 | Com o arquivo lido, a janela deve mostrar o workspace de origem, a data da exportação no formato do idioma e o que entra. | Em português, a janela diz "De <workspace>, exportado em 30/09/2026" e lista os menus. | Essencial | Obrigatório |
| RF304 | A janela deve pedir "Somar" ou "Substituir" (RN903), num grupo de opções exclusivas. | Uma das 2 opções fica escolhida por vez. | Essencial | Obrigatório |
| RF305 | Com "Substituir" escolhido, a janela deve mostrar riscadas as seções do menu de hoje que saem. | Escolher "Substituir" mostra riscadas as seções do workspace. | Essencial | Obrigatório |
| RF306 | Importar deve pôr os menus no rascunho (RN902) e as categorias na lista de Categorias. | Depois de importar, o cartão "Alterações não salvas" aparece. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI301 | Importar arquivo | Deve receber o arquivo da parte 1 e o modo (somar ou substituir), e devolver o rascunho resultante sem publicar (RN902). Rota <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | O que a janela faz com um arquivo que não foi exportado do ENSPACE, ou de uma versão que ela não lê? O protótipo não trata o caso. | produto | Um RF de erro na leitura do arquivo. |

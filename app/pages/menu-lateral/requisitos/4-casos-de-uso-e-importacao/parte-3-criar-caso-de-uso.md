# 3. Criar caso de uso

**Objetivo:** quem configura o workspace cria um caso de uso a partir do menu de hoje, com as imagens da galeria, e o
caso fica na Central para ser usado de novo.

**Depende de:** 2. Central de casos de uso e usar caso de uso.

**Onde vale:** a faixa "Criar caso de uso" da Central e a janela "Criar caso de uso".

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, "+" do Início > "Casos de uso" > "Criar caso de
uso".

## Criar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | A faixa "Criar caso de uso" deve abrir a janela "Criar caso de uso", com nome, área, complexidade, descrição, os menus do workspace que entram e "Imagens da galeria". | A janela abre com os 6 campos. | Importante | Obrigatório |
| RF202 | Sem nome ou sem menu marcado, o botão "Criar caso de uso" deve ficar desligado. | Com o nome vazio, o botão não cria o caso. | Importante | Obrigatório |
| RF203 | O caso criado deve aparecer em "Do seu workspace". | Criar "Rotina do jurídico" põe o cartão na vista. | Importante | Obrigatório |
| RF204 | A janela deve ter o campo "Imagens da galeria", que recebe imagens PNG, JPG ou GIF, arrastadas ou escolhidas pelo clique, mais de 1 por vez. | Soltar 2 prints no campo carrega os 2. | Importante | Obrigatório |
| RF205 | O campo "Imagens da galeria" deve mostrar a miniatura de cada imagem, com o botão que tira a imagem. | Tirar 1 de 2 imagens deixa 1 miniatura. | Importante | Obrigatório |
| RF206 | A galeria do detalhe deve mostrar as imagens do caso na ordem em que subiram. | Caso com 2 imagens: a galeria tem 2 pontos, na ordem de envio. | Importante | Obrigatório |
| RF207 | O cartão do caso na Central deve usar a primeira imagem como capa. | Caso com 2 imagens: o cartão mostra a primeira. | Desejável | Desejável |
| RF208 | Sem imagem, a galeria deve mostrar a prévia montada com os menus, os status e os campos do caso. | Caso criado sem imagem: a galeria mostra a prévia dos menus. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI201 | Criar caso de uso | Deve receber nome, área, complexidade, descrição, os menus que entram e as imagens, e guardar as imagens com o caso; o arquivo exportado do caso leva as imagens. Rota <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | Qual o tamanho máximo de cada imagem e quantas imagens cabem num caso? | produto | Um RF de limite com a mensagem de erro. |

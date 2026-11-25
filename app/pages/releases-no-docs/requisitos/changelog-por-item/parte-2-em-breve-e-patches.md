# 2. Versão em breve e patches

**Objetivo:** quem lê a aba Releases vê o que vem na próxima versão e cada patch publicado, na mesma linha do tempo.

**Depende de:** 1. Texto da versão na trilha.

**Onde vale:** a aba Releases (`/<idioma>/releases/docs`).

**Protótipo:** https://pernalombr4.github.io/prototipos/releases-no-docs/ (a 3.5.0 é a versão em breve; a 3.4.3 e a
3.3.7 são patches).

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Uma versão é considerada em breve quando a data prevista dela é depois de hoje. | Hoje 15/12/2026, a 3.5.0 prevista para 12/01/2027 está em breve. | Obrigatório |

## Versão em breve (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | A versão em breve deve abrir a linha do tempo, acima da versão mais nova publicada. As outras seguem da mais nova para a mais antiga. | A 3.5.0 aparece antes da 3.4.3. | Essencial | Obrigatório |
| RF102 | O título da versão em breve deve ser "<versão> em breve", e o resumo "Os itens desta versão estão previstos para <data>. As datas podem mudar." | "3.5.0 em breve" e "previstos para 12 de janeiro de 2027". | Essencial | Obrigatório |
| RF103 | O ponto da versão em breve na linha do tempo deve ser apagado, sem a cor das versões publicadas. | O ponto da 3.5.0 é cinza; o da 3.4.3 tem a cor da marca. | Desejável | Desejável |
| RF104 | Os itens da versão em breve devem sair sem o link "Saiba mais", e a versão sem "Ler o post de lançamento". | A 3.5.0 aberta não tem "Saiba mais". | Importante | Obrigatório |

## Patches (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF105 | Cada patch publicado deve entrar na linha do tempo como versão própria, com o texto recolhido e as seções do tipo dos itens dele. | A 3.3.7 aparece entre a 3.4.0 e a 3.3.6, com "Correções". | Essencial | Obrigatório |
| RF106 | O patch sem post no Blog deve sair sem o link "Ler o post de lançamento". | A 3.3.7 não tem o link no rodapé; o rodapé é só a linha. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Quem publica a versão em breve e quando ela sai do site se a data passar sem deploy? | produtos | A regra RN101 ganha uma exceção, ou a versão some até a data nova |

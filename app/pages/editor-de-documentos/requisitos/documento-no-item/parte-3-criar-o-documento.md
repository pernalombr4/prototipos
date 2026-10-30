# 3. Criar o documento

**Objetivo:** com o campo vazio, a pessoa cria o documento com 1 clique: a partir de um modelo da categoria, com prévia
dos valores do item, em branco ou enviando um arquivo, sem gaveta nem confirmação.

**Depende de:** 1. Documento no campo; 2. Editor no ENSPACE.

**Onde vale:** o campo do tipo Editor de Documentos sem documento, na visão rápida do item e na tela do item.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", cenário "Sem
documento" e estado "Só leitura".

## Campo vazio (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | Enquanto o campo não tem documento, o sistema deve mostrar, na área do próprio campo, o título "Nenhum documento ainda" e a frase "Comece por um modelo da categoria, por um documento em branco ou envie o seu.". | O botão "Subir documento" e a gaveta "Selecione a forma de upload" não existem mais. | Essencial | Obrigatório |
| RF002 | O campo vazio deve oferecer os botões "Usar modelo", "Em branco" e "Enviar arquivo". | "Em branco" cria e abre o documento com 1 clique; "Enviar arquivo" abre o seletor com 1 clique; "Usar modelo" abre a lista de modelos com 1 clique. Nenhum dos 3 passa por gaveta. | Essencial | Obrigatório |
| RF255 | Para quem só pode ler o item, o campo vazio deve mostrar só "Nenhum documento ainda", sem botões. | O perfil somente leitura não vê "Usar modelo", "Em branco" nem "Enviar arquivo". | Essencial | Obrigatório |
| RF004 | O campo vazio deve informar os formatos aceitos e o tamanho máximo do arquivo. | Exemplo: ".docx ou .pdf, até <a definir> MB. Você também pode arrastar o arquivo para cá." (P1) | Importante | Obrigatório |
| RF011 | Enquanto o documento é gerado, criado ou enviado, o campo deve mostrar a etapa ("Gerando o documento", "Criando o documento em branco", "Enviando <nome>") com uma barra de progresso. | O campo não fica em branco durante a criação. | Importante | Obrigatório |

## Usar modelo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF005 | "Usar modelo" deve listar os modelos da categoria com o nome de cada modelo e os campos do item que cada modelo preenche. | Exemplo: "Contrato de prestação de serviços · Preenche Contratante, Objeto, Valor e Vigência". | Essencial | Obrigatório |
| RF006 | Se a categoria não tem modelo, a lista deve mostrar "Esta categoria ainda não tem modelos.". | A lista não fica vazia sem explicação. | Importante | Obrigatório |
| RF007 | Quando a pessoa escolhe um modelo, o sistema deve mostrar a prévia do documento preenchido com os valores dos campos do item, com esses valores destacados, e o botão "Criar documento". | A confirmação "Tem certeza que deseja gerar o documento a partir do modelo...?" não existe mais. | Essencial | Obrigatório |

## Em branco e envio (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF008 | "Em branco" deve criar um documento .docx vazio com o nome "<rótulo do campo> <referência do item>.docx" e abrir o editor no ENSPACE. | Exemplo: "Minuta do contrato CTR-0141.docx", versão 1, origem "Criada em branco" (RN007). | Essencial | Obrigatório |
| RF009 | "Enviar arquivo" deve abrir o seletor de arquivos e usar o arquivo escolhido como documento do campo, sem passo de confirmação. | O botão "Usar modelo" que hoje aparece depois do envio não existe mais. | Essencial | Obrigatório |
| RF003 | Quando a pessoa arrasta um arquivo sobre o campo vazio, o sistema deve destacar a área e aceitar o arquivo ao soltar. | Soltar `contrato.docx` cria o documento. | Importante | Obrigatório |
| RF010 | Se o arquivo enviado não é .docx nem .pdf, o sistema deve recusar o envio com "Este arquivo não pode ser usado." e "Envie um arquivo .docx ou .pdf.". | Nenhum documento é criado. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | Qual é o tamanho máximo do arquivo enviado? O protótipo mostra 50 MB sem base. | produto e time técnico | O texto de RF004. |
| S1 | Suposição: o campo Saída do modelo continua como hoje, com a sugestão de campos ao digitar `{{`, e define o nome do documento gerado do modelo. No develop, `Contrato_{{` virou `Contrato {{reference}}` (o sublinhado sumiu); o protótipo usa "<nome do modelo> <2 primeiras palavras do Contratante>.docx". | produto | Um requisito novo para a Saída e o nome do documento. |

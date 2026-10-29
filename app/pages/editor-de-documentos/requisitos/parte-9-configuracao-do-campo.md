# 9. Configuração do campo

**Objetivo:** quem configura a categoria encontra as configurações do campo em 3 grupos, com Editar ligado num campo
novo, e vê na pré-visualização como o campo vazio fica.

**Depende de:** 3. Criar o documento.

**Onde vale:** a configuração do campo Editor de Documentos (Configurações › Estrutura › Categorias › Campos), na
parte das configurações específicas.

**Protótipo:** https://pernalombr4.github.io/prototipos/editor-de-documentos/, fase "1. Word em breve", botão
"Configuração" da barra inferior.

## Grupos de configuração (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF080 | As configurações específicas do campo devem ficar em 3 grupos: "Onde o documento abre", "Como o documento nasce" e "O que se faz no editor". | As 7 chaves soltas de hoje ficam distribuídas nos grupos. | Importante | Obrigatório |
| RF081 | O grupo "Onde o documento abre" deve mostrar a chave "ENSPACE (ONLYOFFICE)" ligada e as chaves "Microsoft Word" e "Word para a web" desabilitadas, com o selo "Em breve" (descrição das chaves do Word: P12). | As chaves do Word não podem ser ligadas. | Importante | Obrigatório |
| RF082 | O grupo "Como o documento nasce" deve ter as chaves Modelos da categoria (com o número de modelos), Documento em branco, Enviar arquivo .docx e Enviar arquivo .pdf. | Desligar "Documento em branco" tira o botão Em branco do campo vazio. | Essencial | Obrigatório |
| RF083 | O grupo "O que se faz no editor" deve ter as chaves Editar, Comentar, Acompanhar mudanças, Revisão, Mostrar painel de revisão e Chat. | "Mostrar painel de revisão" fica desabilitada com Revisão desligada. | Importante | Obrigatório |
| RF084 | A chave Editar deve nascer ligada num campo novo. | Hoje nasce desligada. | Essencial | Obrigatório |

## Pré-visualização e carga (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF085 | A pré-visualização do campo deve mostrar o campo vazio e mudar conforme as chaves de "Como o documento nasce". | Desligar "Documento em branco" tira o botão "Em branco" da pré-visualização. | Desejável | Desejável |
| RF086 | Abrir a configuração do campo não deve mostrar "Ocorreu um erro ao carregar os campos aninhados". | Hoje o erro aparece até clicar em Recarregar. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P12 | Na fase "Word em breve", as chaves do Word mostram descrição? Hoje elas dizem "Uma pessoa edita por vez" e "Uma cópia fica no OneDrive de quem edita até concluir", que só valem quando a edição no Word chegar. | produto | O texto de RF081. |

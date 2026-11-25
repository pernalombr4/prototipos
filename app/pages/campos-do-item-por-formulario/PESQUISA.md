# Pesquisa: o recorte de campos na tela do registro

A pergunta: como outros produtos ligam formulário de entrada e tela do registro, e qual das 3 opções da demanda eles sustentam.

- **Twenty CRM:** explorado no uso, numa conta de teste criada para isto, em 2026-11-25.
- **Outros 10 produtos:** pesquisa com a skill `deep-research`, só por documentação oficial, blog e comunidade, em 2026-11-25. O relatório completo, com as fontes, está no repositório de pesquisa de mercado (rodada `2026-11-25-recorte-de-campos-na-tela-do-registro`).

## Resposta curta

- **A tela do registro tem configuração própria.** Em 10 dos 11 produtos, ela não herda o recorte do formulário que criou o registro. O Zoho CRM é a exceção, e a comunidade dele relata o mesmo sintoma do ENSPACE: dado que existe e some da tela.
- **O registro abre igual, venha de onde vier.** Vale em 10 dos 11; só o Airtable muda os campos conforme a visualização de origem.
- **Há sempre uma saída na tela:** recolher vazios, "ver todos", busca de campo ou botão com contagem.
- **A Opção 1 é a mais sustentada.**
- **As Opções 2 e 3 não têm precedente**: nenhum produto tem o seletor da Opção 3 nem abre o registro na aba do formulário de origem.

## Twenty CRM, no uso

Conta de teste com o workspace `teste-formularios`, objeto Oportunidades.

1. **O layout do registro é do objeto.** O mesmo desenho vale para todo registro, venha da lista, do quadro ou de um link (`ref-twenty-01`, `ref-twenty-02`).
2. **Quem desenha é quem configura.** "Editar layout" abre o modo de edição do objeto, com abas e widgets (`ref-twenty-03`).
3. **O widget Campos tem grupos e um olho por campo.** Negócio, Relações e Sistema são grupos; o olho tira o campo da vista sem apagar o dado (`ref-twenty-04`, `ref-twenty-05`).
4. **Os campos tirados vão para o grupo "Mais (N)".** Uma chave liga o grupo, que aparece recolhido no fim, com a contagem (`ref-twenty-06`, `ref-twenty-07`).
5. **Uma aba nova pode ter o seu "Grupo de campos".** É um recorte com nome, ao lado da vista completa (`ref-twenty-08`).
6. **O formulário fica fora da tela do registro.** É o passo "Entrada Humana" de um fluxo, que cria o registro (`ref-twenty-09`). O registro criado por ele abre com o mesmo layout de qualquer outro.

O que o Twenty diz às 3 opções:

- **Sustenta a Opção 1:** a tela completa é a padrão, e o recorte com nome mora numa aba, como a pasta de formulário.
- **Traz 2 ideias:** o grupo "Mais (N)" para campos fora da vista e o agrupamento por seção.
- **Não tem nada parecido com as Opções 2 e 3**: a origem do registro não muda a tela.

## Os outros 10 produtos

| Produto | Quem decide o recorte | Troca na tela? | Campos fora do recorte |
|---|---|---|---|
| Notion | construtor do banco, 1 layout para todas as páginas | não | escondidos, achados pela busca do grupo |
| ClickUp | administrador, pelo local e pelo tipo de tarefa | sim: "Show empty fields" | vazios recolhidos; ocultos por troca de tipo no botão "hidden fields" |
| monday.com | dono do quadro, igual para o quadro | não | "Show only columns with values" |
| Pipefy | a fase atual do card | não | fases futuras invisíveis; formulário inicial em bloco próprio |
| Salesforce | administrador, por tipo de registro, perfil e app | não | não aparecem |
| HubSpot | administrador e equipe; o usuário ajusta o cartão About | sim: "View all properties" | na lista completa, por grupo |
| Airtable | a visualização de origem ou a página da Interface | na base: "Show XX hidden fields" | botão com contagem |
| Jira (com JSM) | administrador; no JSM, formulário do cliente e vista do agente à parte | "Show X more fields" e "More fields" | vazios em "More fields" |
| Zoho CRM | o layout escolhido na criação | só no app de iOS: "Smart view" e "All fields" | não aparecem; relatos de dado sumido |
| Attio | administrador, 1 página por objeto | sim: "View all values", com busca | na lista completa |

O caso mais parecido com o ENSPACE é o JSM:

- vários tipos de solicitação apontam para o mesmo tipo de item, como vários formulários para a mesma categoria;
- o formulário do cliente é um recorte, e a vista do agente se configura à parte;
- os formulários preenchidos ficam no item em "Attached forms", como bloco próprio.

## O padrão que todos seguem

- A tela de leitura se configura à parte do recorte de entrada.
- Quem decide o recorte é quem configura, nunca o formulário de origem.
- O mesmo registro abre igual de qualquer porta.
- Sempre há um caminho fixo para ver o resto, quase sempre com contagem.
- Campo vazio se resolve por regra de vazio (recolher, mostrar só com valor), não pela origem do registro.

## O que nenhum deles faz

- Nenhum tem seletor "Todos os campos / Formulário X" dentro do registro (Opção 3).
- Nenhum abre o registro, por padrão, no recorte do formulário da página de origem (Opção 2).
- Nenhum tem aba de subconjunto por formulário com esse nome. Os mais perto guardam a entrada como bloco à parte: "Attached forms" (JSM), "Start Form" (Pipefy), envio na linha do tempo (HubSpot) e o "Grupo de campos" numa aba (Twenty).

## O que isso pede ao protótipo

| Opção | O que o mercado diz | Risco |
|---|---|---|
| 1 | padrão de 10 dos 11 | tela longa na categoria com muitos campos; o remédio é recolher vazios e agrupar |
| 2 | sem precedente; o Attio mostra o bloco da lista no registro, sem abrir nele | a mesma pessoa vê o item em abas diferentes conforme o clique; o link copiado abre de outro jeito para outra pessoa |
| 3 | só o Airtable lembra, e com botão de contagem | o mesmo item muda de tela conforme a porta; pela página do formulário, a dúvida "é bug?" volta se o recorte não tiver contagem |

Por isso o protótipo tem:

- a chave "Complementos da pesquisa", que liga na Visão Geral completa o agrupamento pelo formulário de origem (ClickUp, HubSpot) e os vazios recolhidos com contagem (ClickUp, monday, Jira, Twenty);
- a contagem "3 de 10 campos" ao lado do seletor da Opção 3 (Airtable);
- o aviso "Esta pasta exibe 3 de 10 campos" na pasta de formulário.

## Prints de referência

| Arquivo | O que mostra |
|---|---|
| `evidencias/ref-twenty-01-painel-do-registro-secoes.jpg` | registro aberto no painel lateral, com o widget Campos em grupos |
| `evidencias/ref-twenty-02-pagina-do-registro.jpg` | o mesmo registro na página inteira, com o mesmo layout |
| `evidencias/ref-twenty-03-editar-layout-do-objeto.jpg` | modo de edição do layout do objeto |
| `evidencias/ref-twenty-04-widget-de-campos.jpg` | configuração do widget Campos |
| `evidencias/ref-twenty-05-disposicao-grupos-e-olho.jpg` | disposição em grupos, com o olho por campo |
| `evidencias/ref-twenty-06-botao-mais-campos-ligado.jpg` | a chave do grupo "Mais" ligada |
| `evidencias/ref-twenty-07-grupo-mais-aberto.jpg` | o grupo "Mais (6)" aberto no registro |
| `evidencias/ref-twenty-08-aba-nova-com-grupo-de-campos.jpg` | aba nova com o seu grupo de campos |
| `evidencias/ref-twenty-09-formulario-e-passo-de-fluxo.jpg` | o formulário como passo "Entrada Humana" de um fluxo |

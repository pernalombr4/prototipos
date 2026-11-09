# Épico: O campo nos 4 formatos (célula, formulário, cru e relatório)

**O que é:** cada tipo de campo do ENSPACE passa a ter um desenho só, declarado num lugar só, que serve os 4 lugares
onde o valor aparece: a célula da tabela de itens, o controle no formulário, a linha crua na coluna de resumo do item
e a célula da planilha do relatório. O desenho vem da **família** do tipo, e não do tipo, então um tipo novo numa
família que já existe nasce padronizado. As partes 1 a 10 são componentes do `@be-enlighten/enspace-sdk-ui`: 1
componente que LÊ o valor (nos formatos célula e cru), 1 que o ESCREVE (formulário) e 1 função que transforma valor
em texto, que os 2 chamam. As partes 11 e 12 são a exportação, no back-end, com a mesma regra de texto.

**Onde vale:** a tela nova de itens de cada categoria (`/workspaces/<ws>/types/<categoria>`), o modal "Novo registro"
dela, a visão rápida do item, a tela dedicada do item (`/workspaces/<ws>/types/<categoria>/<REFERENCE>`) e o arquivo
que o Exportar gera. A tabela antiga não é tocada.

**Protótipo:** https://pernalombr4.github.io/prototipos/padrao-dos-campos/. A tabela tem 1 coluna por tipo de campo,
e o rótulo da coluna é o nome do tipo. **Para ver a saída de cada campo no relatório, clique em "Baixar relatório
(.xlsx)" na barra do topo da tela**, que é a barra do protótipo: o arquivo abre com a tabela extraída na primeira aba
e os parâmetros de cada tipo na segunda. Os textos nos 3 idiomas estão no `textos.ts` de
https://github.com/pernalombr4/prototipos/tree/main/app/pages/padrao-dos-campos.

**Fora do escopo:** a edição na célula (o quadro que o protótipo abre ao clicar), a criação de registro pela grade, a
seleção em massa, a bandeja de copiar, o botão Abrir, o cartão do registro relacionado, a ficha do campo e o botão
que devolve as colunas à largura original. São gestos da tela e andaime do protótipo, não o formato do campo. A
largura mínima de cada coluna, essa sim, é característica do campo, e está na parte 1. Também ficam de fora a
configuração do campo (`Estrutura › Categorias › Campos`), onde o `cFormat` e a lista de opções se escolhem, e
filtrar e ordenar por tipo de campo.

**Relevância** (no fim de cada requisito): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. A célula de campo: a base](parte-1-a-celula-de-campo-a-base.md) | O componente que lê o valor no formato célula e a função que o transforma em texto: alinhamento, corte com reticências, vazio e largura mínima | | É a base do épico: as 11 partes seguintes usam estas 2 peças |
| [2. O desenho de cada família na célula](parte-2-o-desenho-de-cada-familia-na-celula.md) | A forma de cada família na célula: selo de opção com cor, caixa do booleano, data, relação com queda para a referência, pessoa, anexo, composto, ícone de conversa e campo gerado pelo sistema | 1 | Precisa do componente da parte 1 para pendurar a forma de cada família |
| [3. A lista de valores e o contador na célula](parte-3-a-lista-de-valores-e-o-contador-na-celula.md) | O corte da fila de valores: mostra o que cabe, conta o resto e nunca corta o contador | 1 e 2 | Mede a largura natural dos selos da parte 2, então vem depois dela |
| [4. O Valor Monetário na célula](parte-4-o-valor-monetario-na-celula.md) | O valor na moeda dele e o "i" com Valor inicial, Correções acumuladas, Valor atual e a legenda que expande | 1 | Sai sozinha, e é a única parte da célula que depende da correção monetária do back |
| [5. A moldura do formulário](parte-5-a-moldura-do-formulario.md) | O componente que escreve o valor, a grade de 2 colunas, o rótulo com ícone, a ajuda da configuração e o campo que o sistema preenche | | É a base do formulário: as partes 6 a 9 entram nesta moldura |
| [6. Texto, número, data e escolha no formulário](parte-6-texto-numero-data-e-escolha-no-formulario.md) | O controle de cada campo de digitar e de escolher: texto longo que cresce, número com limite, moeda com as moedas do campo, calendário com atalhos, lista que vira suspensa e busca | 5 | É o grosso dos campos de uma categoria, e o que destrava o formulário para uso |
| [7. O Editor de texto HTML no formulário](parte-7-o-editor-de-texto-html-no-formulario.md) | O editor mostrando texto formatado, a barra do develop e o link num quadro do produto | 5 | Sai sozinha, e é a parte mais pesada de implementar |
| [8. O Pessoa/Empresa no formulário](parte-8-o-pessoa-empresa-no-formulario.md) | O bloco que começa no Tipo, revela os subcampos daquele tipo, valida o documento e preenche pela consulta | 5 | Sai sozinha, e é a única parte do formulário que depende de uma consulta externa |
| [9. Os campos compostos e o anexo no formulário](parte-9-compostos-e-anexo-no-formulario.md) | Endereço, Matriz de dados, Grupo, Repetidor, anexo com arrasto e relação | 5 | Usa a linha inteira da grade da parte 5, e cada bloco repete os controles da parte 6 por dentro |
| [10. O campo cru na coluna do item](parte-10-o-campo-cru-na-coluna-do-item.md) | A coluna de resumo da visão rápida e da tela do item carregando os campos da categoria em leitura, no formato cru | 1 e 2 | É o segundo formato do componente da parte 1: muda a densidade, não a regra |
| [11. O relatório: a tabela extraída](parte-11-o-relatorio-a-tabela-extraida.md) | A exportação trazendo as colunas da tela, na mesma ordem, com o mesmo texto de cada célula | 1 | Depende da regra de texto da parte 1 para a planilha dizer o mesmo que a tela. É back-end, e sai sozinha |
| [12. O tipo de célula por tipo de campo na planilha](parte-12-o-tipo-de-celula-por-tipo-de-campo.md) | Cada coluna no tipo que o Excel entende: número que soma, data que ordena, moeda com a máscara da sua moeda e anexo clicável | 11 | Precisa do arquivo da parte 11 montado para trocar o tipo de cada célula |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Cada tipo de campo tem 1 regra de texto só, e os 4 formatos seguem essa regra. | Um número com 2 casas decimais aparece com 2 casas na célula, no formulário, na coluna do item e na planilha. | Obrigatório |
| RN902 | A família do tipo decide o desenho do valor, e o tipo não. | Matriz de dados é da família composto, como Grupo e Repetidor, então mostra o primeiro par "rótulo: valor" e um contador. | Obrigatório |
| RN903 | Um campo sem valor fica vazio em cada formato. A exceção é a Alternativa Binária, que desenha a caixa vazia. | A célula de Texto Curto sem valor fica em branco, sem hífen e sem "null". | Obrigatório |
| RN904 | Um registro relacionado se identifica pelo `display` e, quando o `display` está vazio, pela referência. | `{ id, display: "", reference: "CLIC-0042" }` aparece como `CLIC-0042`. | Obrigatório |
| RN905 | Os parâmetros de cada tipo de campo (família, alinhamento, largura mínima da coluna, quantos valores a célula mostra, entrada, saída e saída formatada) são os da aba "Padrão dos campos" da planilha que o protótipo gera no botão "Baixar relatório (.xlsx)", na barra do topo da tela. Política: Única. | A linha do Valor Monetário diz família número, alinhamento Fim, largura mínima 160 px e saída formatada `R$ 1.234,56`. | Obrigatório |
| RN906 | O Valor Monetário guarda a moeda junto do número, no próprio valor. Valores em moedas diferentes não são somados entre si. | `{ currency: "USD", value: 7250.9 }` continua em dólar numa tela em português, e a soma da coluna sai por moeda. | Obrigatório |

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

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Célula | O valor do campo na tabela de itens, em 1 linha de altura fixa | (sem nome na tela) |
| Formulário | O controle que escreve o valor, no modal "Novo registro" e na aba Visão Geral do item | "Novo registro", "Visão Geral" |
| Cru | O valor em leitura na coluna de resumo do item: ícone, rótulo em caixa alta e valor embaixo | (sem nome na tela) |
| Família | O grupo de tipos que herda a mesma regra de desenho: texto, número, escolha, booleano, data e hora, relação, pessoa, arquivo e composto | (sem nome na tela) |
| Saída formatada | O texto final de um valor, depois do `cFormat` do campo | (sem nome na tela) |
| Contador | A marca "+N" que fecha uma lista que não cabe inteira na célula | "+2" |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | Matriz de dados e ID Personalizado estão no seletor "Tipo de Campo" e não estão no enum `Field.type` do `enspace-sdk-schemas` instalado. Qual é a chave de cada um na API? | Time de back | Define a chave que o componente lê para escolher o desenho dos 2 tipos |
| P902 | `EnlCheckbox` está no schema, e `checkbox` está no dado gravado e no dicionário de idiomas, para o mesmo campo. Qual chave fica? | Time de back | Com as 2 chaves, o componente trata as 2 como o mesmo tipo |
| P903 | 4 tipos têm dado gravado e não aparecem no seletor: `EnESign`, `EnTreeSelect`, `EnlTimeRange` e `EnlCheckbox`. Eles ainda se criam, ou só se desenham? | produto | Tipo que só se desenha fica em leitura nos 3 formatos e sai do formulário |
| P904 | As chaves dos subcampos de Pessoa/Empresa (`type`, `cpf`, `cnpj`, `razao_social`, `nome_fantasia`, `name`) saíram da configuração do campo, e não do corpo da requisição, que vai como multipart. | Time de back | Confirma o nome de cada subcampo que o controle escreve e que a coluna lê |
| P905 | A API devolve o valor cru, e cada tela aplica o `cFormat` por conta. Devolver a saída formatada junto com o valor cru tiraria essa conta do front. | Time de back | Com a saída formatada na resposta, a função de texto da parte 1 passa a só desenhar, e a exportação lê o mesmo campo |

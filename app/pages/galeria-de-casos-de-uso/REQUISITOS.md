# Requisitos: galeria de casos de uso

**Objetivo:** quem configura o workspace acha o caso de uso que serve ao processo, vê o que ele traz antes de usar e
usa sem abrir caso por caso. Quem configura também cria um caso de uso com a estrutura do workspace e escolhe se ele
fica só no workspace ou na galeria do ENSPACE.

**Onde vale:** Configurações › Interface › Casos de Uso (`/workspaces/{ws}/settings/interface/usecases`), no bloco
abaixo do aviso "Atenção", onde hoje fica o bloco "General" com os cartões e o "Saiba Mais".

**Referência visual:** protótipo navegável em https://pernalombr4.github.io/prototipos/galeria-de-casos-de-uso,
rodadas 1 a 5 de 20 e 21/10/2026, em revisão. Código, textos nos 3 idiomas, prints e decisões em
https://github.com/pernalombr4/prototipos/tree/main/app/pages/galeria-de-casos-de-uso. A barra inferior do protótipo
(cenário, tema, idioma, "Por trás") é ferramenta de revisão e não entra no produto.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Fora do escopo:** o menu lateral, a barra do topo, o cabeçalho da tela ("Casos de Uso" e a descrição), o cartão
"Migração de Workspace" (Exportar e Importar) e o aviso "Atenção" continuam com o mesmo conteúdo; muda só a largura
da coluna onde eles ficam (RF069). A importação por arquivo é o
protótipo `migracao-de-workspace`.

## Resumo

| Grupo | O que muda em relação ao develop de 20/10/2026 | Requisitos |
|---|---|---|
| Galeria | O bloco "General" vira uma vitrine com lateral de filtros, busca, Áreas, destaques e cartões com miniatura agrupados por área, na mesma coluna da parte de cima | RF001 a RF021, RF069 e RF070 |
| Estados da galeria | Hoje não há carregando nem erro na galeria | RF022 e RF023 |
| Detalhe do caso | A janela do "Saiba Mais" (imagem e descrição) vira o detalhe na própria página, com galeria de imagens, o que vem junto e quem fez | RF024 a RF032 |
| Usar caso de uso | "Migrar Caso de Uso" vira "Usar caso de uso"; a confirmação passa a mostrar o que entra e os 2 avisos que o produto já dá | RF033 a RF040 |
| Deste workspace | Hoje não existe. A vista com os casos criados no workspace, entre "Destaques" e "Todos do ENSPACE", com a porta para criar | RF041 a RF044 |
| Criar caso de uso | Hoje não existe. Cria um caso com as entidades da estrutura do workspace, de cada tipo que a exportação leva (categorias, formulários, fluxos, Spaceflows, menus, modelos e os outros), e pergunta onde ele fica: só no workspace ou na galeria do ENSPACE (pública). Se o produto só puder publicar na galeria, vale o plano B de RF060 | RF045 a RF068 |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Caso de uso | Pacote de estrutura do ENSPACE (categorias com campos, menus com telas, status) que se soma a um workspace | "caso de uso" |
| Área | O grupo de negócio do caso de uso (Jurídico, Comercial). Hoje o produto chama de "categoria" ("General"), o mesmo nome do tipo de item | "Áreas" (proposta, P5) |
| Localidade | O país e o idioma para os quais o caso foi feito: Brasil (pt-br), Estados Unidos (en-us) ou Global | "Localidade" |
| Galeria do ENSPACE | O catálogo de casos de uso que cada empresa que usa o ENSPACE vê: os do ENSPACE e os publicados pelos workspaces | "Galeria do ENSPACE", vista "Todos do ENSPACE" |
| Entidade da estrutura | Cada parte da estrutura do workspace que a exportação de estrutura ("Exportar Workspace") leva. Exemplos: categoria (com campos e status), formulário, pasta, lista, fluxo da categoria, Spaceflow, menu (com telas), modelo de e-mail, modelo de documento, relatório | o nome de cada tipo na tela ("Formulários", "Spaceflows") |
| Visibilidade | Onde um caso criado no workspace fica: só no workspace ou na galeria do ENSPACE | "Visibilidade", "Onde o caso de uso fica" |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN001 | Usar um caso de uso soma ao workspace as categorias, os menus e os status do caso; nada que já existe no workspace é alterado nem removido. | Usar "Gestão de contratos" num workspace com "Fornecedores" mantém "Fornecedores" igual. |
| RN002 | Uma categoria do caso de uso com nome igual ao de uma categoria do workspace é criada de novo, em duplicidade. | O workspace tem "Contratos"; depois de usar o caso, há 2 categorias "Contratos". |
| RN003 | Usar um caso de uso pode gerar cobrança adicional quando o workspace passa do limite de produtos do plano. | Workspace no limite do plano usa um caso com 2 categorias e passa do limite. |
| RN004 | O idioma de quem abre define a localidade inicial da galeria: português (pt-BR) é Brasil (pt-br), inglês é Estados Unidos (en-us) e outro idioma é Global. | Quem usa o ENSPACE em espanhol abre a galeria com Global marcado. |
| RN005 | Um caso de uso entra no resultado da localidade quando a lista de localidades do caso contém ao menos 1 das localidades marcadas; sem localidade marcada, cada caso entra. | "Funil de vendas" (pt-br, en-us, global) aparece com Brasil marcado e com Global marcado. |
| RN006 | Um caso de uso criado num workspace leva só as entidades da estrutura escolhidas, de cada tipo que a exportação de estrutura do workspace leva (por exemplo categorias com campos e status, formulários, fluxos da categoria, Spaceflows, menus com telas, modelos de e-mail e de documento); itens, arquivos anexados e dados de pessoas ficam de fora. | O caso criado com "Pedidos de compra" e o Spaceflow "Pedido aprovado vai para o fornecedor" leva a categoria com os 5 campos e os 4 status e o Spaceflow, sem nenhum pedido. |
| RN007 | Um caso de uso salvo só no workspace é visto e usado só por quem acessa aquele workspace. | Outro workspace da mesma empresa não vê o caso em nenhuma vista. |
| RN008 | Um caso de uso publicado na galeria do ENSPACE é visto e usado por cada empresa que usa o ENSPACE. | O caso publicado pelo Grupo Aurora aparece em "Todos do ENSPACE" de outra empresa. |
| RN009 | Um caso de uso só pode ser publicado na galeria do ENSPACE depois que quem cria confirma que o caso fica público. | Sem a confirmação marcada, o caso não é publicado. |

## Galeria (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF001 | O bloco da galeria deve ocupar o lugar do bloco "General", abaixo do aviso "Atenção", com o título "Galeria de casos de uso" e a descrição "Estruturas prontas do ENSPACE para começar um processo sem montar tudo do zero." | A tela mostra, de cima para baixo: cabeçalho, Migração de Workspace, Atenção e a galeria. | Essencial |
| RF069 | O cabeçalho da tela, o cartão "Migração de Workspace", o aviso "Atenção" e a galeria devem ocupar uma coluna só, centralizada, com as bordas esquerda e direita alinhadas e largura máxima de <proposta: 1.152 px, sem medição>. | Numa tela de 1.915 px, a borda esquerda do cartão de migração e a da galeria ficam na mesma linha vertical. | Importante |
| RF070 | O cabeçalho da galeria deve seguir o molde do cabeçalho do cartão "Migração de Workspace": ícone em quadrado cinza, título no mesmo tamanho e peso e descrição embaixo. | Os 2 cabeçalhos têm o ícone, o título e a descrição com o mesmo tamanho e a mesma cor. | Desejável |
| RF002 | A lateral da galeria deve ter 2 vistas, "Destaques" e "Todos do ENSPACE", cada uma com o número de casos ao lado, e a vista ativa em destaque. | Exemplo: 18 casos, 6 destaques: "Destaques 6" e "Todos do ENSPACE 18". | Importante |
| RF003 | A lateral deve ter o filtro "Localidade", com caixas de marcar para Brasil (pt-br), Estados Unidos (en-us) e Global, e mais de 1 marcada ao mesmo tempo (RN005). | Marcar Brasil e Global mostra os casos de uma ou de outra. | Essencial |
| RF004 | Quando a galeria abre, o filtro "Localidade" deve vir marcado conforme a RN004. | Exemplo: idioma inglês; a galeria abre com Estados Unidos (en-us) marcado. | Essencial |
| RF005 | A lateral deve ter o filtro "Complexidade", com caixas de marcar para Iniciante, Intermediário e Avançado, e mais de 1 marcada ao mesmo tempo. | Marcar Avançado deixa só os casos avançados. | Importante |
| RF006 | Enquanto a página rola, a lateral da galeria deve continuar visível no topo do bloco da galeria. | Rolar até a área Operações mantém os filtros na tela. | Desejável |
| RF007 | A barra da galeria deve ter a busca "Buscar casos de uso", que procura o termo no nome, na descrição e na área do caso, sem diferença de acento e de maiúscula. | Exemplo: "contratos" acha "Gestão de contratos"; "juridico" acha os casos da área Jurídico. | Essencial |
| RF008 | O botão "Áreas" deve abrir uma lista de seleção múltipla com a busca "Buscar área" e a marca de seleção na linha de cada área marcada. | Exemplo: marcar Jurídico e Pessoas mostra os casos das 2 áreas. | Importante |
| RF009 | O pé da lista de Áreas deve ter os links "Selecionar tudo" e "Limpar" e a contagem "{n} de {total}". | Exemplo: 2 marcadas de 8 mostra "2 de 8". | Importante |
| RF010 | Com as 8 áreas marcadas, "Selecionar tudo" deve ficar desligado. | Com 8 de 8, "Selecionar tudo" está desligado. | Desejável |
| RF011 | Sem área marcada, "Limpar" deve ficar desligado. | Com 0 de 8, "Limpar" está desligado. | Desejável |
| RF012 | A lista de Áreas deve continuar aberta depois de "Selecionar tudo", de "Limpar" e de marcar uma área. | Marcar 3 áreas seguidas sem reabrir a lista. | Importante |
| RF013 | Com área marcada, o botão "Áreas" deve mostrar o número de áreas marcadas. | Exemplo: 2 marcadas; o botão mostra "Áreas 2". | Desejável |
| RF014 | A barra da galeria deve mostrar o total de casos que passam pelos filtros, em "{n} casos de uso" ("1 caso de uso" no singular), e anunciar a mudança ao leitor de tela. | Exemplo: busca "contrato" mostra "1 caso de uso". | Importante |
| RF015 | Na vista "Destaques", sem busca, sem complexidade e sem área marcadas, a galeria deve abrir com a seção "Em destaque", com os casos marcados como destaque e uma estrela em cada cartão. | Com qualquer filtro além da localidade, "Em destaque" some. | Importante |
| RF016 | A galeria deve agrupar os cartões por área, com o nome da área, o número de casos dela, os 3 primeiros cartões e o botão "Ver mais {n}" quando a área tem mais de 3; aberto, o botão vira "Ver menos". | Exemplo: Jurídico com 4 casos mostra 3 cartões e "Ver mais 1". | Importante |
| RF017 | Cada cartão deve mostrar a miniatura do caso (a 1ª imagem do caso), o ícone, o nome e a complexidade em selo (Iniciante verde, Intermediário amarelo, Avançado vermelho). | Exemplo: "Contencioso" mostra o selo vermelho "Avançado". | Essencial |
| RF018 | Se o nome não cabe no cartão, o cartão deve cortar o nome com reticências e mostrar o nome inteiro ao passar o mouse. | "Procurações, poderes e representação societária" aparece cortado no cartão e inteiro no título do detalhe. | Importante |
| RF019 | O cartão inteiro deve abrir o detalhe do caso (RF024), pelo clique e pelo Enter, com o nome "Ver o caso de uso {nome}" para o leitor de tela, sem o botão "Saiba Mais". | Tab até o cartão e Enter abre o detalhe. | Essencial |
| RF020 | Se a busca e os filtros deixam 0 casos, a galeria deve mostrar "Nenhum caso de uso encontrado", "Tente outra palavra ou remova um filtro." e o botão "Limpar filtros", que limpa a busca, a localidade, a complexidade e as áreas. | Exemplo: busca "xyz" mostra a mensagem; "Limpar filtros" volta os 18 casos. | Essencial |
| RF021 | Em tela com menos de 768 px de largura, a lateral da galeria deve dar lugar ao botão "Filtros" na barra da galeria, que abre as vistas, a Localidade e a Complexidade. | Em 390 px, "Filtros" abre os 3 grupos. | Importante |

## Estados da galeria (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF022 | Enquanto a lista de casos carrega, a galeria deve mostrar o esqueleto da lateral e de 6 cartões no lugar dos cartões. | A rede lenta mostra o esqueleto, sem tela em branco. | Importante |
| RF023 | Se a lista de casos não carrega, a galeria deve mostrar "Não foi possível carregar os casos de uso", "Verifique a sua conexão e tente novamente." e o botão "Tentar novamente", que carrega a lista de novo. | Com a rota de casos fora do ar, a mensagem aparece; "Tentar novamente" refaz a chamada (RI001). | Essencial |

## Detalhe do caso (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF024 | O detalhe do caso deve abrir no lugar da lista, dentro do bloco da galeria, com a página rolada até o topo do bloco e o botão "Galeria de casos de uso", que volta para a lista. | Voltar mostra a lista com os mesmos filtros de antes. | Essencial |
| RF025 | O cabeçalho do detalhe deve mostrar o ícone, o nome inteiro, "Complexidade:" com o selo, a área e o botão "Usar caso de uso". | Exemplo: "Gestão de contratos", Intermediário, Jurídico. | Essencial |
| RF026 | O detalhe deve ter a galeria de imagens do caso, com setas "Imagem anterior" e "Próxima imagem", 1 ponto por imagem com o nome "Imagem {i} de {n}" e a volta da última para a primeira. | Exemplo: 4 imagens; a seta depois da 4ª mostra a 1ª. | Importante |
| RF027 | Clicar na imagem deve ampliá-la em tela cheia, com as setas na tela e no teclado, "Imagem {i} de {n}" e o botão "Fechar". | A seta para a direita do teclado passa a imagem ampliada. | Importante |
| RF028 | Com a imagem ampliada, Esc deve fechar a imagem e voltar ao detalhe. | Esc fecha a imagem ampliada. | Importante |
| RF029 | Ao lado da galeria de imagens, o detalhe deve mostrar "Descrição" e o texto da descrição do caso. | A descrição do cartão de hoje aparece aqui. | Essencial |
| RF030 | O detalhe deve ter "O que vem junto", com 1 bloco por tipo de entidade que o caso traz (por exemplo "Categorias e campos", "Menus e telas", "Status", "Formulários", "Spaceflows", "Modelos de documento"), cada um com o resumo em números e aberto item a item pelo clique. | Exemplo: "Spaceflows, 2 Spaceflows"; aberto, mostra os 2 nomes. | Essencial |
| RF031 | Um tipo que o caso não traz não deve ter bloco em "O que vem junto". | Caso sem status não mostra o bloco "Status". | Importante |
| RF032 | A coluna da direita do detalhe deve mostrar "Pelo ENSPACE" com o selo "Verificado", "Criado em" com a data, "Usado" com "{n} vezes" e "Localidade" com as localidades do caso. | Exemplo: "12 de março de 2025", "4.120 vezes", Brasil (pt-br) e Global. | Desejável |

## Usar caso de uso (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF033 | "Usar caso de uso" deve abrir a janela "Usar o caso de uso {nome}?", com a descrição "O que está abaixo é criado neste workspace, somado ao que já existe." (RN001). | O título traz o nome do caso aberto. | Essencial |
| RF034 | A janela deve listar "O que entra no workspace" em 1 grupo por tipo de entidade que o caso traz (por exemplo "Categorias e campos" com "{n} campos" por categoria, "Menus e telas" com "{n} telas" por menu, "Status", "Formulários", "Spaceflows"); grupo vazio sai. | Exemplo: "Contratos" aparece 2 vezes, 1 em "Categorias e campos" e 1 em "Menus e telas", e se distingue pelo grupo. | Essencial |
| RF035 | A janela deve mostrar o aviso "Atenção" com 2 linhas: "Se uma categoria com o mesmo nome já existir, o sistema cria outra, em duplicidade." (RN002) e "Se o workspace ultrapassar o limite de produtos do plano, pode haver cobrança adicional." (RN003). | Os 2 avisos aparecem em todo caso. | Essencial |
| RF036 | "Cancelar" deve fechar a janela sem mudar o workspace. | Cancelar não cria categoria. | Essencial |
| RF037 | Enquanto o envio do caso está em andamento, a janela deve manter o botão "Usar caso de uso" em carregando, "Cancelar" desligado e o fechamento pelo clique fora e pelo Esc bloqueado. | Clicar fora durante o envio não fecha a janela. | Importante |
| RF038 | Quando o envio é aceito, o sistema deve fechar a janela e mostrar o aviso "Caso de uso {nome} enviado", com o texto "Os registros estão sendo carregados na tabela de Backup/Migração." | Depois do aviso, a migração aparece na tabela de Backup/Migração. | Essencial |
| RF039 | Se o envio é recusado, a janela deve continuar aberta e mostrar o erro de hoje do produto (texto da chave `migration_request_error`), com o botão "Usar caso de uso" de volta ao normal. | Com a rota de migração fora do ar, o erro aparece e nada é criado. | Essencial |
| RF040 | Sem a permissão que libera o uso (P4), "Usar caso de uso" deve aparecer desligado, com o motivo visível abaixo do nome do caso: "Para usar um caso de uso, você precisa da permissão Criar Casos de Uso. Solicite a quem administra o workspace." e ligado ao botão para o leitor de tela. | Membro sem a permissão vê o motivo sem passar o mouse; o leitor de tela lê o motivo no botão. | Essencial |

## Deste workspace (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF041 | A lateral da galeria deve ter a vista "Deste workspace", entre "Destaques" e "Todos do ENSPACE", com os casos criados no workspace (salvos e publicados) e o número deles ao lado. | Exemplo: 1 caso salvo e 1 publicado mostram "Deste workspace 2". | Essencial |
| RF042 | Na vista "Deste workspace" com ao menos 1 caso, a galeria deve mostrar, acima dos cartões, a faixa "Transforme este workspace em um caso de uso", o texto "Escolha o que entra: categorias, formulários, fluxos, Spaceflows, menus, telas, modelos e o resto da estrutura. Você decide se o caso fica só aqui ou na galeria do ENSPACE." e o botão "Criar caso de uso". | A faixa aparece só nesta vista. | Essencial |
| RF043 | Na vista "Deste workspace" sem caso, a galeria deve mostrar "Nenhum caso de uso criado neste workspace", "Crie um caso de uso com a estrutura que este workspace já tem: categorias, fluxos, menus, modelos e o resto." e o botão "Criar caso de uso". | Workspace sem caso criado mostra o estado vazio com o botão. | Essencial |
| RF044 | Cada cartão de caso criado no workspace deve mostrar o ícone da visibilidade, globo para "Publicado na galeria" e prédio para "Só neste workspace", com o nome da visibilidade no passar do mouse e para o leitor de tela. | O cartão do caso publicado mostra o globo. | Importante |

## Criar caso de uso (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF045 | "Criar caso de uso" deve abrir a janela "Criar caso de uso", com a descrição "Monte um caso de uso com a estrutura que este workspace tem agora: categorias, campos, formulários, pastas, listas, fluxos, Spaceflows, menus, telas, modelos de e-mail e de documento, relatórios. Só a estrutura entra: nenhum item, arquivo anexado ou dado de pessoa." (RN006). | A janela abre a partir da faixa e do estado vazio. | Essencial |
| RF046 | A janela deve pedir "Nome" (obrigatório), "Área", "Complexidade", "Localidade" (mais de 1 ao mesmo tempo, começando pela RN004), "Descrição" e "Imagens da galeria". | Os 6 campos aparecem, e só "Nome" tem a marca de obrigatório entre eles. | Essencial |
| RF047 | "Imagens da galeria" deve receber 1 ou mais imagens PNG ou JPG, arrastadas ou escolhidas pelo clique. | Exemplo: 3 imagens enviadas; o detalhe passa as 3. | Importante |
| RF062 | A 1ª imagem enviada em "Imagens da galeria" deve ser a miniatura do cartão do caso. | Exemplo: 3 imagens enviadas; o cartão mostra a 1ª. | Importante |
| RF048 | "O que entra" deve listar cada entidade da estrutura do workspace num grupo por tipo (RN006), com o resumo da entidade quando o tipo tem partes (categoria: "{n} campos, {n} status"; menu: "{n} telas") e uma caixa de marcar por entidade, cada uma marcada ao abrir a janela. | Exemplo: o grupo "Spaceflows" lista os 3 Spaceflows do workspace, marcados. | Essencial |
| RF063 | O seletor de "O que entra" deve oferecer cada tipo de entidade que a exportação de estrutura do workspace leva, inclusive os que não estão no protótipo; os 10 tipos do protótipo são exemplo. | Cada tipo que "Exportar Workspace" leva aparece como grupo no seletor de um workspace que tem entidades desse tipo. | Essencial |
| RF064 | Cada grupo de "O que entra" deve ter a caixa do grupo, que marca cada entidade do grupo quando ao menos 1 está desmarcada e desmarca cada uma quando o grupo está inteiro marcado, e que fica parcial quando só parte está marcada; para o leitor de tela, o nome é "Marcar tudo em {grupo}". | Exemplo: desmarcar 1 de 3 formulários deixa a caixa de "Formulários" parcial. | Essencial |
| RF065 | Cada grupo deve mostrar "{marcadas}/{total}" ao lado do nome. | Exemplo: tirar 1 das 2 pastas mostra "Pastas 1/2". | Importante |
| RF068 | O topo do seletor deve mostrar "{n} de {total} selecionados", anunciado ao leitor de tela a cada mudança. | Exemplo: tirar as 2 pastas leva o topo de "25 de 25" para "23 de 25 selecionados". | Importante |
| RF066 | O seletor deve ter a busca "Buscar no workspace", que procura o termo no nome de cada entidade de cada tipo, sem diferença de acento e de maiúscula, e mostra abertos só os grupos com resultado. | Exemplo: "aviso" mostra só "Spaceflows 1/1" com "Aviso de reajuste 60 dias antes". | Importante |
| RF067 | Se a busca do seletor não acha nada, o seletor deve mostrar "Nada deste workspace tem esse nome." | Exemplo: "xyz" mostra a mensagem. | Desejável |
| RF049 | Se a pessoa salva sem nome, a janela deve mostrar no campo "Informe o nome do caso de uso." e não salvar. | Nome vazio e "Salvar no workspace" mostram o erro; nada é criado. | Essencial |
| RF050 | Se a pessoa salva com 0 entidades marcadas, a janela deve mostrar "Escolha ao menos 1 parte da estrutura." e não salvar. | Desmarcar cada grupo mostra o erro em "O que entra". | Essencial |
| RF051 | "Onde o caso de uso fica" deve ser uma lista de seleção com 2 opções, cada uma com a descrição: "Só neste workspace" ("Aparece em Deste workspace.") e "Galeria do ENSPACE" ("Aparece para todas as empresas que usam o ENSPACE."), com "Só neste workspace" escolhida ao abrir. | A janela abre com "Só neste workspace". | Essencial |
| RF052 | O rótulo "Onde o caso de uso fica" deve ter o ícone "?", que mostra a diferença entre as 2 opções no passar do mouse e no foco do teclado. | Tab até o "?" mostra a explicação. | Desejável |
| RF053 | Com "Galeria do ENSPACE" escolhida, a janela deve mostrar o aviso "Este caso de uso fica público" com o texto "Todas as empresas que usam o ENSPACE passam a ver e usar tudo o que você escolheu: nomes de categorias, campos, status, formulários, fluxos, Spaceflows, menus e telas, e o texto dos modelos de e-mail e de documento. Confira se nenhum nome ou texto identifica um cliente, uma pessoa ou um projeto interno." (RN008). | Trocar para a galeria mostra o aviso; voltar para o workspace tira o aviso. | Essencial |
| RF054 | Com "Galeria do ENSPACE" escolhida, a janela deve mostrar a caixa "Entendo que este caso de uso fica visível para todas as empresas que usam o ENSPACE.", desmarcada. | A caixa aparece junto do aviso, desmarcada. | Essencial |
| RF055 | Se a pessoa publica sem marcar a caixa de RF054, a janela deve mostrar "Marque a confirmação para publicar." e não publicar (RN009). | "Publicar na galeria" com a caixa vazia mostra o erro; nada é publicado. | Essencial |
| RF056 | Quando a pessoa troca a opção de "Onde o caso de uso fica", a janela deve desmarcar a caixa de RF054. | Galeria, marcar, workspace, galeria: a caixa volta desmarcada. | Importante |
| RF057 | O botão principal da janela deve dizer "Salvar no workspace" com "Só neste workspace" e "Publicar na galeria" com "Galeria do ENSPACE". | Trocar a opção troca o texto e o ícone do botão. | Importante |
| RF058 | Quando o caso é salvo ou publicado, o sistema deve fechar a janela, abrir a galeria na vista "Deste workspace" com o cartão novo e mostrar o aviso "Caso de uso {nome} salvo" e "Ele está em Deste workspace.", ou "Caso de uso {nome} publicado" e "Ele está na galeria do ENSPACE e em Deste workspace." | Exemplo: publicar "Compras e imóveis da Aurora" mostra o cartão em "Deste workspace" e em "Todos do ENSPACE". | Essencial |
| RF059 | No detalhe de um caso criado no workspace, a coluna da direita deve mostrar "Por {workspace}" e "Caso de uso criado neste workspace.", sem o selo "Verificado", e "Visibilidade" com "Só neste workspace" ou "Publicado na galeria". | O detalhe do caso publicado mostra "Por Grupo Aurora" e "Publicado na galeria". | Importante |
| RF060 | Se o produto só puder publicar o caso na galeria do ENSPACE, sem a opção "Só neste workspace", a janela deve mostrar em cada criação o aviso de RF053 e a caixa de RF054, com o botão "Publicar na galeria" sujeito a RF055. | Sem a lista "Onde o caso de uso fica", a janela abre com o aviso e a caixa, e não publica sem a caixa marcada. | Essencial |
| RF061 | Sem a permissão "Criar Casos de Uso" (P4), cada botão "Criar caso de uso" deve aparecer desligado, com "Para criar um caso de uso, você precisa da permissão Criar Casos de Uso." escrito ao lado. | Cenário "Sem permissão": a faixa e o estado vazio mostram o botão desligado e o motivo. | Essencial |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI001 | Listar casos de uso (rota `use-cases`, a que a tela lê hoje) | Deve devolver, por caso: nome, ícone, área, complexidade, localidades, descrição, se é destaque, data de criação, número de usos, o que vem junto (as entidades de cada tipo da estrutura, como categorias com campos, menus com telas, status, formulários e Spaceflows), a lista ordenada de imagens e, no caso criado num workspace, o workspace que criou e a visibilidade. Os campos que a rota não tem hoje estão em P2. |
| RI002 | Usar caso de uso (a mesma ação de "Migrar Caso de Uso" de hoje) | Deve receber o caso e criar a solicitação de migração na tabela de Backup/Migração, como hoje. Rota e corpo <a definir> (S1). |
| RI003 | Criar caso de uso | Deve receber nome, área, complexidade, localidades, descrição, imagens, as entidades escolhidas de cada tipo da estrutura do workspace (RN006) e a visibilidade (só no workspace ou galeria do ENSPACE), e devolver o caso criado. Rota <a definir>. |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF001 | Os textos da galeria, do detalhe e da janela devem atender à WCAG 2.2 AA, critério 1.4.3 (contraste mínimo de 4,5:1), nos temas claro e escuro. | Conferência de contraste no selo de complexidade, no total de resultados e no motivo sem permissão, nos 2 temas. | Importante |
| RNF002 | Cada controle sem texto visível (setas, pontos da galeria de imagens, fechar) deve ter nome para o leitor de tela. | O leitor de tela lê "Imagem 2 de 4" no 2º ponto. | Importante |
| RS001 | Cada texto da galeria deve existir em português, inglês e espanhol. Imposta por: spec dos protótipos, regra 35. | Trocar o idioma troca todos os textos da galeria. | Essencial |
| RS002 | O menu de Áreas deve ser o `USelectMenu` do Nuxt UI em modo múltiplo, com "Selecionar tudo" e "Limpar" no slot `content-bottom`. Imposta por: Mikaela, rodada 2 de 20/10/2026. | A lista de Áreas é o componente do Nuxt UI, sem botão solto entre a busca e as opções. | Importante |
| RS003 | O detalhe e os cartões devem usar as imagens cadastradas com cada caso, e não as miniaturas desenhadas do protótipo. Imposta por: protótipo `tela-de-workspaces`, requisito R107a. | Nenhum cartão mostra o desenho do protótipo. | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P1 | Quantos casos de uso o catálogo tem hoje, e quantos deve ter? O desenho cabe para dezenas. | produto | Com centenas, a busca vira a navegação principal e a lista ganha paginação ou rolagem virtual. |
| P2 | A rota `use-cases` guarda área, complexidade, destaque, número de usos, o que vem junto e a lista de imagens? Na tela de hoje só aparecem nome, descrição, 1 imagem, o grupo e a localidade. | back-end | Sem esses campos, RF005, RF015, RF016, RF026, RF030 e RF032 dependem de mudança no cadastro do caso. |
| P3 | Quem cadastra e publica os casos do ENSPACE e as imagens de cada um? | produto | Um fluxo de publicação dos casos; RS003 depende dele. |
| P4 | Qual permissão libera o uso: "Criar Casos de Uso" (`usecases::create`) ou outra? O texto de RF040 supõe "Criar Casos de Uso". | produto e back-end | Muda o texto do motivo em RF040. |
| P5 | O grupo hoje chamado "categoria" ("General") pode passar a se chamar "área"? Categoria, no ENSPACE, é o tipo de item que o caso cria. | Mikaela | Os textos "Áreas", "Buscar área" e o glossário. |
| P6 | "Migrar Caso de Uso" pode virar "Usar caso de uso"? | Mikaela | Os textos de RF025, RF033, RF037 e RF038. |
| P7 | O que a pessoa vê quando a migração aceita falha depois, já na tabela de Backup/Migração? O protótipo cobre só a recusa do envio (RF039). | produto | Um RF de aviso de falha da migração. |
| P8 | O número de usos conta cada migração feita ou cada workspace que usou o caso? | produto | O texto e o cálculo de "{n} vezes" em RF032. |
| S1 | Usar um caso de uso cria uma solicitação de migração, como a importação: a tela de hoje tem os textos "Os registros estão sendo carregados na tabela de Backup/Migração" e "Erro ao criar solicitações de migração", e a importação chama `POST /migration-requests`. | o dev confere no código da tela de hoje | RI002 ganha a rota e o corpo. |
| P9 | Um caso publicado na galeria passa pela revisão do ENSPACE antes de aparecer para as outras empresas? O protótipo publica na hora. | produto | Um estado "Em análise" no cartão e na Visibilidade, e o aviso de RF058 muda. |
| P10 | O nome do workspace que criou ("Por Grupo Aurora") aparece para as outras empresas? Ele identifica o cliente. | produto e jurídico | RF059 mostra o nome só no próprio workspace, e as outras empresas veem outro texto. |
| P11 | Quem criou pode editar, tirar da galeria ou excluir o caso? E o que acontece com quem já usou um caso que saiu da galeria? | produto | Um grupo de RF para editar, despublicar e excluir. |
| P12 | O que a janela faz se o salvar ou o publicar falha? O protótipo não trata o caso. | produto e back-end | Um RF de erro em "Criar caso de uso". |
| P13 | O caso criado guarda a estrutura do momento ou acompanha as mudanças do workspace depois? O protótipo guarda o momento. | produto | RN006 ganha a regra de atualização. |
| P14 | Quando a pessoa desmarca uma entidade que outra usa (a categoria de um fluxo, de um formulário ou de uma tela), o seletor marca junto, avisa ou impede? O protótipo deixa desmarcar sem aviso. | produto e back-end | Um RF de dependência no seletor de "O que entra". |
| P15 | A exportação de estrutura de hoje leva os Spaceflows? As chaves vistas no arquivo de exportação não têm Spaceflow. | back-end | RF063 inclui ou não o grupo "Spaceflows". |
| P16 | Os modelos de e-mail e de documento entram com o texto inteiro, que pode ter nome de cliente? | produto e jurídico | O aviso de RF053 ganha a conferência do texto, ou os modelos entram sem o corpo. |

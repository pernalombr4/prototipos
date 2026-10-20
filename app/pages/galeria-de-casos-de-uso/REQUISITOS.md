# Requisitos: galeria de casos de uso

**Objetivo:** quem configura o workspace acha o caso de uso que serve ao processo, vê o que ele traz antes de usar e
usa sem abrir caso por caso.

**Onde vale:** Configurações › Interface › Casos de Uso (`/workspaces/{ws}/settings/interface/usecases`), no bloco
abaixo do aviso "Atenção", onde hoje fica o bloco "General" com os cartões e o "Saiba Mais".

**Referência visual:** protótipo navegável em https://pernalombr4.github.io/prototipos/galeria-de-casos-de-uso,
rodadas 1 e 2 de 20/10/2026, em revisão. Código, textos nos 3 idiomas, prints e decisões em
https://github.com/pernalombr4/prototipos/tree/main/app/pages/galeria-de-casos-de-uso. A barra inferior do protótipo
(cenário, tema, idioma, "Por trás") é ferramenta de revisão e não entra no produto.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Fora do escopo:** o menu lateral, a barra do topo, o cabeçalho da tela ("Casos de Uso" e a descrição), o cartão
"Migração de Workspace" (Exportar e Importar) e o aviso "Atenção" continuam como estão. A importação por arquivo é o
protótipo `migracao-de-workspace`.

## Resumo

| Grupo | O que muda em relação ao develop de 20/10/2026 | Requisitos |
|---|---|---|
| Galeria | O bloco "General" vira uma vitrine com lateral de filtros, busca, Áreas, destaques e cartões com miniatura agrupados por área | RF001 a RF021 |
| Estados da galeria | Hoje não há carregando nem erro na galeria | RF022 e RF023 |
| Detalhe do caso | A janela do "Saiba Mais" (imagem e descrição) vira o detalhe na própria página, com galeria de imagens, o que vem junto e quem fez | RF024 a RF032 |
| Usar caso de uso | "Migrar Caso de Uso" vira "Usar caso de uso"; a confirmação passa a mostrar o que entra e os 2 avisos que o produto já dá | RF033 a RF040 |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Caso de uso | Pacote de estrutura do ENSPACE (categorias com campos, menus com telas, status) que se soma a um workspace | "caso de uso" |
| Área | O grupo de negócio do caso de uso (Jurídico, Comercial). Hoje o produto chama de "categoria" ("General"), o mesmo nome do tipo de item | "Áreas" (proposta, P5) |
| Localidade | O país e o idioma para os quais o caso foi feito: Brasil (pt-br), Estados Unidos (en-us) ou Global | "Localidade" |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN001 | Usar um caso de uso soma ao workspace as categorias, os menus e os status do caso; nada que já existe no workspace é alterado nem removido. | Usar "Gestão de contratos" num workspace com "Fornecedores" mantém "Fornecedores" igual. |
| RN002 | Uma categoria do caso de uso com nome igual ao de uma categoria do workspace é criada de novo, em duplicidade. | O workspace tem "Contratos"; depois de usar o caso, há 2 categorias "Contratos". |
| RN003 | Usar um caso de uso pode gerar cobrança adicional quando o workspace passa do limite de produtos do plano. | Workspace no limite do plano usa um caso com 2 categorias e passa do limite. |
| RN004 | O idioma de quem abre define a localidade inicial da galeria: português (pt-BR) é Brasil (pt-br), inglês é Estados Unidos (en-us) e outro idioma é Global. | Quem usa o ENSPACE em espanhol abre a galeria com Global marcado. |
| RN005 | Um caso de uso entra no resultado da localidade quando a lista de localidades do caso contém ao menos 1 das localidades marcadas; sem localidade marcada, cada caso entra. | "Funil de vendas" (pt-br, en-us, global) aparece com Brasil marcado e com Global marcado. |

## Galeria (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF001 | O bloco da galeria deve ocupar o lugar do bloco "General", abaixo do aviso "Atenção", com o título "Galeria de casos de uso" e a descrição "Estruturas prontas do ENSPACE para começar um processo sem montar tudo do zero." | A tela mostra, de cima para baixo: cabeçalho, Migração de Workspace, Atenção e a galeria. | Essencial |
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
| RF030 | O detalhe deve ter "O que vem junto", com 1 bloco por tipo que o caso traz ("Categorias e campos", "Menus e telas", "Status"), cada um com o resumo em números e aberto item a item pelo clique. | Exemplo: "Categorias e campos, 2 categorias, 9 campos"; aberto, mostra Contratos, Aditivos e os campos. | Essencial |
| RF031 | Um tipo que o caso não traz não deve ter bloco em "O que vem junto". | Caso sem status não mostra o bloco "Status". | Importante |
| RF032 | A coluna da direita do detalhe deve mostrar "Pelo ENSPACE" com o selo "Verificado", "Criado em" com a data, "Usado" com "{n} vezes" e "Localidade" com as localidades do caso. | Exemplo: "12 de março de 2025", "4.120 vezes", Brasil (pt-br) e Global. | Desejável |

## Usar caso de uso (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF033 | "Usar caso de uso" deve abrir a janela "Usar o caso de uso {nome}?", com a descrição "O que está abaixo é criado neste workspace, somado ao que já existe." (RN001). | O título traz o nome do caso aberto. | Essencial |
| RF034 | A janela deve listar "O que entra no workspace" em grupos: "Categorias e campos" (cada categoria com "{n} campos"), "Menus e telas" (cada menu com "{n} telas") e "Status" (os nomes, com "{n} status"); grupo vazio sai. | Exemplo: "Contratos" aparece 2 vezes, 1 em cada grupo, e se distingue pelo grupo. | Essencial |
| RF035 | A janela deve mostrar o aviso "Atenção" com 2 linhas: "Se uma categoria com o mesmo nome já existir, o sistema cria outra, em duplicidade." (RN002) e "Se o workspace ultrapassar o limite de produtos do plano, pode haver cobrança adicional." (RN003). | Os 2 avisos aparecem em todo caso. | Essencial |
| RF036 | "Cancelar" deve fechar a janela sem mudar o workspace. | Cancelar não cria categoria. | Essencial |
| RF037 | Enquanto o envio do caso está em andamento, a janela deve manter o botão "Usar caso de uso" em carregando, "Cancelar" desligado e o fechamento pelo clique fora e pelo Esc bloqueado. | Clicar fora durante o envio não fecha a janela. | Importante |
| RF038 | Quando o envio é aceito, o sistema deve fechar a janela e mostrar o aviso "Caso de uso {nome} enviado", com o texto "Os registros estão sendo carregados na tabela de Backup/Migração." | Depois do aviso, a migração aparece na tabela de Backup/Migração. | Essencial |
| RF039 | Se o envio é recusado, a janela deve continuar aberta e mostrar o erro de hoje do produto (texto da chave `migration_request_error`), com o botão "Usar caso de uso" de volta ao normal. | Com a rota de migração fora do ar, o erro aparece e nada é criado. | Essencial |
| RF040 | Sem a permissão que libera o uso (P4), "Usar caso de uso" deve aparecer desligado, com o motivo visível abaixo do nome do caso: "Para usar um caso de uso, você precisa da permissão Criar Casos de Uso. Solicite a quem administra o workspace." e ligado ao botão para o leitor de tela. | Membro sem a permissão vê o motivo sem passar o mouse; o leitor de tela lê o motivo no botão. | Essencial |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI001 | Listar casos de uso (rota `use-cases`, a que a tela lê hoje) | Deve devolver, por caso: nome, ícone, área, complexidade, localidades, descrição, se é destaque, data de criação, número de usos, o que vem junto (categorias com campos, menus com telas, status) e a lista ordenada de imagens. Os campos que a rota não tem hoje estão em P2. |
| RI002 | Usar caso de uso (a mesma ação de "Migrar Caso de Uso" de hoje) | Deve receber o caso e criar a solicitação de migração na tabela de Backup/Migração, como hoje. Rota e corpo <a definir> (S1). |

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

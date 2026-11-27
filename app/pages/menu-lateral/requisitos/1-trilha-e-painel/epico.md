# Épico: menu em trilha e painel, com o que o produto já tem

**O que é:** a barra lateral passa a ter 2 colunas: a trilha, com 1 ícone por área, e o painel, com o menu da área
aberta. Configurações ganha painel próprio, o Início reúne os destinos de todo dia, e Categorias para de crescer com o
número de categorias. Tudo usa o menu, as telas e as preferências que o produto já tem; ninguém edita o menu na barra
neste épico.

**Onde vale:** a barra lateral de toda tela de um workspace e a tela de uma categoria.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, cenário "Sem personalização" do andaime "Estado",
aprovado em 2026-11-27. Os textos em português, inglês e espanhol estão no protótipo, pelo seletor de idioma.

**Regra de lançamento:** pode ir para o cliente sozinho, atrás de uma chave por workspace, ligada aos poucos.

**Fora do escopo:** editar o menu na barra (arrastar, botão direito para mudar, excluir, criar menu), personalizar o
próprio menu, casos de uso, o dashboard no menu da categoria e os destinos Inbox e Documentos, que ainda não existem
no produto.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Trilha, painel e menu flutuante](parte-1-trilha-painel-e-menu-flutuante.md) | A trilha, o painel da área aberta, o menu flutuante e recolher | | É a casca em que as outras partes entram |
| [2. Configurações em painel próprio e Ajuda](parte-2-configuracoes-e-ajuda.md) | Configurações como área da trilha, com 6 grupos, e a Ajuda num ícone na base | 1 | Tira a administração do meio do trabalho antes de o Início ganhar itens |
| [3. Início com os destinos nativos](parte-3-inicio.md) | O painel do Início com Chat de IA, Tarefas, Agenda, Spaceflows, Relatórios e Assinaturas | 1 | O Início é a primeira área da trilha |
| [4. Auditoria, Integrações e Análise como áreas](parte-4-areas-novas.md) | As 3 áreas novas na trilha, com Análise > Dashboards listando os dashboards de hoje | 1 e 2 | Os itens saem de Configurações, que já precisa existir |
| [5. Categorias e Favoritos](parte-5-categorias-e-favoritos.md) | Categorias com teto de 5 e "Ver todas", Favoritos pela estrela e o cartão do workspace novo | 1 e 3 | Entra no Início e em Dados, que já precisam existir |
| [6. Formulário como aba na tela da categoria](parte-6-formulario-como-aba.md) | Os formulários como abas na tela da categoria, no lugar do 3º nível do menu | 5 | Só faz sentido quando a categoria vira 1 linha no menu |
| [7. Largura do painel e filtro do menu](parte-7-largura-e-filtro.md) | A borda do painel que se arrasta e a lupa que filtra o menu | 1 | A barra funciona sem elas; entram depois da casca |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Só quem tem licença Owner ou Full configura o workspace. | Membro com licença Basic vê o ícone de Configurações com cadeado e não vê "Criar categoria". | Obrigatório |
| RN902 | Abrir uma área ou uma seção de primeiro nível abre também a primeira tela dela. | Abrir Auditoria abre Logs de auditoria. | Obrigatório |
| RN903 | Uma seção com 1 tela só é tratada como 1 linha, sem seta. | Uma seção do workspace com 1 tela aparece como 1 linha que abre a tela. | Obrigatório |

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
| Trilha | A coluna estreita de ícones de área, à esquerda | (sem nome na tela) |
| Painel | A coluna ao lado da trilha, com o menu da área aberta | (sem nome na tela) |
| Área | Cada ícone da trilha: Início, Dados, Análise, Auditoria, Integrações, cada seção do workspace e Configurações | o nome da área |
| Destino nativo | Tela do produto que mora no Início, como Agenda e Relatórios | o nome da tela |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | Qual é a chave de `en-features` que liga o menu novo por workspace? | dev | As partes 1 e 2 ganham o nome da chave. |
| S901 | Suposição: o miolo das telas não muda neste épico, fora a tela da categoria (parte 6); cada item do menu abre a tela de hoje. | o código de develop | Se alguma tela mudar de rota, a parte dela ganha a rota nova. |

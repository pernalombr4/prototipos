# Épico: Releases no docs, changelog por item

**O que é:** a aba Releases do docs.enspace.io passa a mostrar o texto curto de cada versão na própria linha do
tempo, recolhido por padrão, com cada item no tipo dele (Novidades, Melhorias, Correções). A mudança que exige ação
do cliente ganha o rótulo com o prazo e o link para o guia de migração. O Blog troca o post por versão pelo post do
mês, e quem quiser acompanha por e-mail ou por feed RSS.

**Onde vale:** a aba Releases (`/<idioma>/releases/docs`), a aba Blog (`/<idioma>/blog/docs`) e o post do mês.

**Protótipo:** https://pernalombr4.github.io/prototipos/releases-no-docs/, em revisão. Os textos nos 3 idiomas estão
no `textos.ts` de https://github.com/pernalombr4/prototipos/tree/main/app/pages/releases-no-docs, e o dado de exemplo
no `mocks.ts` da mesma pasta. Os campos novos estão marcados `PROPOSTA:` no `mocks.ts`. O bloco `actionRequired` está
no `MODELO-EXIGE-ACAO.md`. A barra inferior do protótipo (versão, estado, tema, idioma, "Por trás") é ferramenta de
revisão e não entra no produto.

**Depende de:** o épico "Releases no docs, com o que já existe": a âncora e o link da versão e as páginas da pasta
"Guias de migração".

**Fora do escopo:** filtros na aba Releases; a página "Próximas mudanças"; a casca do docs (topo, pílula de produto,
idioma); o passo a passo e a navegação guiada do Tango, que continuam como são hoje.

**Prioridade e relevância** (nas tarefas, entre parênteses no fim de cada requisito): a prioridade é Essencial,
Importante ou Desejável. A relevância diz o que o dev pode deixar de fazer: Obrigatório, o dev faz. Desejável, o dev
faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande
para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Texto da versão na trilha](parte-1-texto-da-versao.md) | Os itens de cada versão no conteúdo, o texto recolhido com "Mostrar mais", as seções por tipo e o link de cada subtítulo e item | | É a base: as outras partes mostram ou apontam para os itens |
| [2. Versão em breve e patches](parte-2-em-breve-e-patches.md) | A próxima versão no topo da trilha, com a data prevista, e cada patch como versão própria | 1 | Usa o mesmo texto da versão; fica fora da base porque pede conteúdo de versão sem post |
| [3. Mudança que exige ação](parte-3-exige-acao.md) | O bloco `actionRequired`, o rótulo com o prazo e o resumo no topo da versão e o item marcado com quem é afetado, prazo e link do guia | 1 | Marca um item que a parte 1 já mostra e leva ao guia do outro épico |
| [4. Post do mês no Blog](parte-4-post-do-mes.md) | O post "Novidades de <mês>" no lugar do post por versão, com Em destaque, Também neste mês e a contagem do resto | 1 e 3 | Leva aos itens da trilha e repete o aviso de ação do mês |
| [5. Assinar](parte-5-assinar.md) | O link "Assinar", com a inscrição por e-mail e os 2 feeds RSS | 1 e 3 | É a única parte com serviço fora do `en-docs` (envio de e-mail); nenhuma outra espera por ela |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | A âncora de cada item nasce do título do item em português e não muda depois de publicada, nem quando o título muda. | "Integrações: webhooks com nova assinatura de segurança" tem a âncora `integracoes-webhooks-com-nova-assinatura-de-seguranca`. | Obrigatório |
| RN902 | O prazo de uma mudança que exige ação ("Agir até") é a data de início da fase Obrigatória dela (`required`). | `required: 2027-02-09`: "Agir até 9 de fevereiro de 2027". | Obrigatório |
| RN903 | A release diz só por que muda, quem é afetado, o prazo e o link do guia. As fases, os passos e o que acontece depois do prazo moram só no guia de migração. | O item da 3.4.0 não lista os passos; o guia lista. | Obrigatório |

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
| Item | 1 novidade, melhoria ou correção dentro de uma versão | o título em negrito, ou a linha da lista em Correções |
| Mudança que exige ação | Item que obriga o cliente a fazer algo até um prazo | "Exige ação" |
| Tier | Peso do item no post do mês: 1 vai em Em destaque, 2 em Também neste mês, 3 só no changelog | não aparece |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | Os itens de cada versão ficam no frontmatter do post da versão ou numa coleção própria de changelog, que existe também para o patch sem post? | dev do `en-docs` | Onde o redator escreve o item; a parte 2 fica mais simples com a coleção própria |
| P902 | A parte 5 (Assinar) vira um épico à parte, já que pede um serviço de envio de e-mail e se lança sozinha? | produtos | 1 card a mais, e a parte 5 sai deste épico |

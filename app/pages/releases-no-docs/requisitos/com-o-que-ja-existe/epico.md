# Épico: Releases no docs, com o que já existe

**O que é:** ajustes na aba Releases do docs.enspace.io e a seção nova "Guias de migração" na Referência, só com os
campos do conteúdo e os componentes que o `en-docs` já tem. A data da versão passa a sair no dia certo, o título da
versão copia o link dela, e cada mudança que exige ação do cliente ganha uma página de guia escrita em markdown.

**Onde vale:** a aba Releases (`/<idioma>/releases/docs`) e a Referência da aba Docs
(`/<idioma>/docs/reference/migration-guides/<id>`).

**Protótipo:** https://pernalombr4.github.io/prototipos/releases-no-docs/, em revisão. Os textos nos 3 idiomas estão
no `textos.ts` de https://github.com/pernalombr4/prototipos/tree/main/app/pages/releases-no-docs. O modelo do guia
está no `MODELO-EXIGE-ACAO.md` da mesma pasta. A barra inferior do protótipo (versão, estado, tema, idioma, "Por
trás") é ferramenta de revisão e não entra no produto.

**Fora do escopo:** o texto de cada versão na trilha, a versão em breve, o rótulo "Exige ação", o post do mês e
"Assinar". Esses pedem campos novos no conteúdo e estão no épico "Releases no docs, changelog por item".

**Prioridade e relevância** (nas tarefas, entre parênteses no fim de cada requisito): a prioridade é Essencial,
Importante ou Desejável. A relevância diz o que o dev pode deixar de fazer: Obrigatório, o dev faz. Desejável, o dev
faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande
para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Data e link da versão](parte-1-data-e-link-da-versao.md) | A data no dia certo e no formato do idioma, o rótulo minor ou patch, o título que copia o link e "Ler o post de lançamento" | | Corrige a data de hoje e é a base do link por âncora que o outro épico usa |
| [2. Guias de migração na Referência](parte-2-guias-de-migracao.md) | A pasta "Guias de migração" na Referência e o modelo da página do guia, só com componentes de markdown que o `en-docs` já mostra | | Não depende da parte 1; o rótulo "Exige ação" do outro épico aponta para estas páginas |

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

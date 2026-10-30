# Épico: Nova experiência na tela de casos de uso

**O que é:** quem importa a estrutura de outro workspace escolhe o que acontece com o que já existe e vê, antes de
confirmar, o que entra, o que muda e o que sai, em estrutura e nunca em JSON. Nada é duplicado.

**Onde vale:** Configurações › Interface › Casos de Uso (`/workspaces/<ws>/settings/interface/usecases`), cartão
"Migração de Workspace", botão Importar Workspace e a camada que ele abre.

**Depende de:** a mudança na abrangência da migração, em andamento no time de desenvolvimento.

**Protótipo:** https://pernalombr4.github.io/prototipos/migracao-de-workspace/, aprovado em 14/10/2026; o fluxo da
categoria entrou em 20/10/2026. Os cenários se abrem pela barra inferior: "Workspace com conteúdo", "Workspace vazio"
e "Já igual ao arquivo"; o fim da migração, por "Termina bem" e "Falha". A barra inferior e o botão tracejado
"Protótipo: usar arquivo de exemplo" são ferramenta de revisão e não entram no produto.

**Fora do escopo:** Exportar Workspace, o título e a descrição da tela, o menu lateral e a barra do topo continuam
como estão.

**Prioridade e relevância** (nas tarefas, entre parênteses no fim de cada requisito): a prioridade é Essencial,
Importante ou Desejável. A relevância diz o que o dev pode deixar de fazer: Obrigatório, o dev faz. Desejável, o dev
faz; se achar melhor não fazer, conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande
para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Arquivo e modo](parte-1-arquivo-e-modo.md) | O aviso "Nada é duplicado", a camada "Importar estrutura", a área de arraste, o resumo do arquivo e os 3 modos de importação | | É a base: a revisão e a migração partem do arquivo e do modo escolhidos aqui |
| [2. Revisão](parte-2-revisao.md) | O passo Revisar, com a situação de cada entidade, os contadores e a lista só das alterações, em estrutura | 1 | Usa o arquivo e o modo da parte 1; a migração começa da revisão |
| [3. Fluxo da categoria na revisão](parte-3-fluxo-da-categoria.md) | As etapas, as tarefas e as configurações da etapa no grupo Fluxo da revisão | 2 | Entrou no protótipo depois da aprovação; fica fora da revisão para não atrasar a base |
| [4. Confirmar e acompanhar a migração](parte-4-confirmar-e-migrar.md) | A cópia antes de importar, o e-mail na Substituição total, o andamento, cancelar, concluída, cancelada, falha e o aviso no sino | 2 | O botão que inicia a migração fica no passo Revisar |

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

# Folders do item

## A demanda, como ela veio

Pedido de 08/10/2026, em várias mensagens na mesma conversa:

> em vez de entrar em develop, desta vez entre nessa branch p´ra investivar o que vou dizer https://en-space-v2-cdqfljvcg-enlighters.vercel.app
>
> temos folders de itens reordenaveis agora. em qualquer categoria que tem folders no enspace-releases voce poderá ver isso. só acessar um item na tela nativa dele ou na sidebar e voce vai ver que da pra arrastar as folders, clicar nelas etc. mas ta feio. nao ta legal o visual. ta parecendo um monte de botao e nao abas. a ideia iniciail foi de ficar parecendo aba de navegador, usando /nuxt-ui
>
> mas voce pode dar outra ideia que seja mais interessante, desde que melhore o visual. agora ao passar o mouse nas folders ta parecendo um monte de botao, varios "Blocos" que nao se comunicam entre si e nem se cokmunicam com o item abaixo. nao sei explicar. avalie e proponha melhoria

> acho que ele ficar parecendo um botao quando ta selecionado é uma das coisas piuores visualmente. nao tem cara de uma aba de jeito NENHUM. parece um botaozao

> hoje se a pessoa arrasta e solta no mesmo lugar que tava antes aparece popup pra salvar. tem que pedir melhoria disso.
>
> tem muitos pequenos detalhes de usabilidade e interface pra voce resolver com /nuxt-ui:find-component-for-usecase (MCP) /nuxt-ui:setup-project-with-template (MCP) /nuxt-ui:implement-component-with-props (MCP) [...] esteja atento pra resolver tudo no prototipo e listar o que foi resolvido depois, em tabela de antes x depois e uma breve descriçao do qeu voce fez na interface

> o arraste ta tendo essa aparencia. [print] e só quando chega o limite da proxima folder é que a folder que ta sendo trocada de lugar junto se mexe . nao é como no navegador, que passando da metade do limite da outra folder (e com sensaçao de passar "por cima") a outra ja se mexe e troca de lugar. no navegador é muito mais fluido

## A tela em jogo

A barra de folders do item, nos 2 lugares onde o item abre:

- **tela do item:** `/workspaces/enspace-releases/types/teste_tutorial_contratos/<referência do item>`;
- **barra lateral:** na lista `/workspaces/enspace-releases/types/teste_tutorial_contratos`, menu da linha › Ver Detalhes.

**Por que a Fase 2 não foi no develop.** Ela pediu a branch de preview da Vercel, onde as folders reordenáveis já existem. A preview aponta para os dados do develop.

**Por que não foi no workspace de exploração.** Ela indicou o `enspace-releases`. Lá só olhei: nada foi criado, editado nem apagado. Para ver o popup de salvar, fiz 2 arrastos curtos e 1 arrasto simulado por evento, todos soltando a folder no mesmo lugar; a ordem não mudou e o popup não apareceu (ver "Onde trava").

## O que seria sucesso

Quem abre um item vê folders que se leem como abas: a ativa ligada ao conteúdo abaixo, as outras discretas, e arrastar parece arrastar aba de navegador.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (`temas/README.md`, as auditorias e o `UX_REPORT.md`) por "pasta", "folder" e "aba". **Não havia nada sobre a barra de folders do item.** A única menção a "pasta" está em `construtor-de-telas/auditoria.md` e fala de outro assunto (grupo de telas usado como pasta de arquivo).

## O que a tela faz hoje

Medido na preview em 08/10/2026, item de Contratos com 6 folders: Visão Geral, Comentários, Logs de Auditoria, Spaceflows, Anexos e Notas.

| Peça | Como é |
|---|---|
| Faixa da barra | fundo `bg-muted`, quase igual ao fundo da página (253 contra 253/252/252 em RGB); sem borda embaixo |
| Cada folder | chip de 28 px de altura, cantos `rounded-md`, sombra `shadow-xs`, contorno (`ring`), 4 px de espaço entre uma e outra |
| Folder ativa | fundo azul a 10 %, contorno azul a 25 %, texto azul em negrito |
| Hover | o chip ganha fundo `bg-accented`: cada folder vira um bloco separado |
| Conteúdo | começa uns 45 px abaixo, com uma linha horizontal solta que não toca a barra |
| Ponta direita | botão "+ ⌄" que abre um menu com 1 item só (Nova folder). Quando não cabem todas, vira "+4 ⌄", com busca, alça de arrasto e "⋯" por folder |
| Menu da folder | botão direito ou "⋯" no menu "+N": Editar, Ocultar, Excluir (aparece também nas folders do sistema) |
| Arrastar | arrasto nativo do HTML (`draggable=true`): o navegador desenha uma cópia translúcida, a folder original fica parada e a vizinha só troca quando a cópia chega na borda dela |
| Endereço | a folder aberta não vai para a URL; recarregar volta para a Visão Geral |
| Acessibilidade | há `role=tablist` e `role=tab` com foco móvel, mas nenhum `role=tabpanel` nem `aria-controls` |

Prints: `evidencias/hoje-barra-na-tela-do-item.png` e `evidencias/hoje-barra-na-barra-lateral.png`.

## Onde trava

1. **A ativa parece um botão aceso**, não uma aba: fundo e contorno azuis, sem ligação com o conteúdo.
2. **Hover em bloco:** cada folder acende como botão separado.
3. **Nada liga a barra ao conteúdo:** faixa sem borda, linha solta 45 px abaixo.
4. **Arrastar não flui** (relato e print dela): a vizinha só se mexe na borda, e a cópia translúcida fica por cima.
5. **Soltar no mesmo lugar abre popup de salvar a ordem para todos** (relato dela: owner arrasta, mexe a folder e solta no lugar de origem; o popup aparece mesmo sem mudança). Não reproduzi: o arrasto nativo do HTML não responde a evento simulado pela automação do Chrome.
6. **"+ ⌄" com 1 item:** 2 cliques para criar folder.
7. **Excluir em folder do sistema:** não testei o que acontece, para não mexer em dado do workspace.

## A casca da tela, item por item

Copiada em `_CascaDoItem.vue` e `_PainelDoItem.vue`:

- menu lateral do `enspace-releases`: Buscar (Ctrl K); Membro (Início, Spaceflows, Categorias aberto com as 10 categorias e Contratos ativo, Tarefas, Agenda, Novo Menu 0, QA TI); Configurações (Visão Geral, Sistema, Estrutura, Gestão de Membros, Interface, E-mails, Integrações, Agentes de IA, Logs, Credenciais); Ajuda (Releases, Documentação);
- barra do topo: voltar, avançar, recarregar, início, trilha (workspace › Categorias › categoria › referência), Ctrl B, estrela, BR, tema, Suporte, sino 99+, avatar;
- painel do item: ícone, referência, categoria, selo da categoria, Identificação (ID), Origem (Status, E-mail da solicitação), Histórico (Criado em, Atualizado em) e o botão de recolher; recolhido, vira coluna de ícones (como na barra lateral);
- rodapé com Salvar.

## Achados fora da demanda

- **"folder" numa tela em português** ("Nova folder", "Pesquisar folder..."). O protótipo manteve o rótulo da tela; a palavra em português é "pasta".
- **Cor da marca:** o tema dos protótipos é cópia do `en-docs` (rosa), e o produto usa azul. O desenho não depende da cor.

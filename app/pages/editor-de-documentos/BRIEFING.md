# Editor de documentos: escolher entre ONLYOFFICE e Word

## A demanda, como veio

> precisamos resolver um problema no campo do tipo editor de documentos. esse campo tem uma pessima usabilidade hoje. pode investigar pra ver.
>
> ele é integrado ao onlyoffice, permitindo que as pessoas operem com documentos dentro do enspace, diretamente, em nuvem.
>
> contudo, temos hoje um plugin do word. usabilidade mil vezes melhor que o onlyoffice, porque é o proprio word. ficará em breve na lojinha de suplementos do ms word. poor enquanto so ta disponivel com manifesto, mas ja funciona.
>
> a ideia é permitir que, na interação com o campo, o usuário possa escolher se quer usar o onlyoffice ou o word. e trabalhar no word com o doc dele.
>
> pontos: parece que só daria pra trabalharmos com o word web com o doc dele em nuvem, ja qe nao ta salvo no local. veja essa limitaçao tecnica se é real.
>
> prototipe a solução e aproveite para melhorar o VISUAL do campo que hoje é horrível. pode propôr melhorias até no visual da interação com onlyoffice tambem. a jornada do usuario é ruim ali.

## Tela e jornada

- **Campo:** tipo **Editor de Documentos** (`EnOnlyoffice` no schema, `cFormat.type: onlyoffice`).
- **Onde ele vive:** no formulário do item, na **visão rápida** (gaveta à direita da lista de itens) e na tela dedicada do item.
- **Jornada:** criar o documento, editar, voltar a ele depois, ver versões.

## O que seria sucesso

Quem trabalha no item abre o documento no editor que prefere (ONLYOFFICE ou Word), edita sem perder nada e sempre sabe qual é a versão atual e quem mexeu por último.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` em 08/10/2026: índice dos temas (`temas/README.md`) e o relatório cumulativo (`UX_REPORT.md`) pelos termos "documento", "editor", "onlyoffice", "word" e "template". **Não havia nada sobre o campo Editor de Documentos nem sobre o plugin do Word.** As ocorrências de "editor" falam do editor de menus (S2-F1) e não se aplicam.

## O que já existe e funciona

- **Documentação do campo** (`en-docs`, Campos de documentos › Editor de Documentos): criar por template do ENSPACE (variáveis `{{data.referencia}}`), por upload de .docx ou de .pdf; 7 opções de configuração (upload externo, upload de PDF, chat, comentar, editar, acompanhar mudanças, revisão).
- **Plugin do Word** (`en-docs`, seção Word Plugin): suplemento do Office com painel lateral, instalado por manifesto (Word para a web, Windows e macOS), aguardando a loja da Microsoft. Hoje faz login no ENSPACE, escolhe workspace, roda agentes revisores, aplica playbooks, usa e cria templates por categoria e cria item a partir do documento. **Ainda não abre o documento de um campo, nem devolve o documento para o campo.**
- **ONLYOFFICE**: edição com formatação completa, comentários, histórico de versões e exportação para PDF. O editor em si funciona; o problema é tudo o que fica em volta dele.

## O fluxo real, em passos

Medido em 08/10/2026 no workspace de exploração, categoria `leve`, campo `vitrine_documento`, item da lista de itens. Endereço: `<BASE_URL>/workspaces/<WORKSPACE_EXPLORACAO>/types/leve/`.

| # | O que a pessoa faz | O que a tela responde | Print |
|---|---|---|---|
| 0 | (configurador) abre Campos › Editor de Documentos | 7 chaves, todas desligadas por padrão, inclusive **Editar**. Abrir a gaveta deu "Ocorreu um erro ao carregar os campos aninhados" até clicar em Recarregar | `develop-01` |
| 1 | abre o item pela lista (menu ⋮ › Ver Detalhes) | visão rápida; o campo é um rótulo e um botão azul cheio **Subir documento**. O rodapé já diz "Alterações não salvas" sem nada alterado | `develop-02` |
| 2 | clica em **Subir documento** | uma segunda gaveta, por cima da primeira: "Selecione a forma de upload", com **Upload Documento em Doc/Docx** e **Upload Documento em PDF**. Não existe "criar em branco" | `develop-03` |
| 3 | escolhe Doc/Docx | o cartão abre uma área de upload: "Suporte para upload único ou em massa" (o campo aceita 1 arquivo) | `develop-04` |
| 4 | envia o arquivo | o arquivo aparece e surge o botão **Usar modelo** (o arquivo é da pessoa, não é modelo) | `develop-05` |
| 5 | clica em Usar modelo | confirmação: "Tem certeza que deseja gerar o documento a partir do modelo _x_.docx?" | `develop-06` |
| 6 | clica em Sim | a gaveta vira o editor: aba única "Documento", botão **Tela Cheia**, um select **Versões** em cima da barra do ONLYOFFICE e o editor com cerca de 57% da largura | `develop-07`, `develop-08` |
| 7 | clica em Tela Cheia | o navegador entra em tela cheia só com o ONLYOFFICE: some o nome do item, a trilha e o caminho de volta. Esc sai e fecha a gaveta junto | `develop-09` |
| 8 | volta ao item | o campo mostra **Abrir Documento** (botão sem cor) e um chip do arquivo com olho, baixar e X vermelho | `develop-10` |
| 9 | clica no olho | modal de pré-visualização descentralizado, por cima da gaveta | `develop-11` |
| 10 | edita, fecha e reabre | **a edição sumiu**. Testado 2 vezes, uma delas salvando o item antes. Só ficou gravada a edição feita com **Ctrl+S** dentro do ONLYOFFICE. Nada na tela diz se o documento está salvo | - |
| 11 | abre o select Versões | "Versão 1", "Versão 2": sem data, sem autor, sem comparar nem restaurar | `develop-12` |

São **4 cliques e 1 confirmação** para pôr um arquivo no campo, e **nenhum caminho** para criar um documento em branco.

## Onde trava

1. **A edição se perde sem aviso.** Fechar o editor não grava; só o Ctrl+S grava. A documentação diz "salvo automaticamente", e a tela não mostra estado de salvamento.
2. **Criar documento é um labirinto de upload.** O botão diz "Subir", a gaveta diz "forma de upload", o passo seguinte diz "Usar modelo" e a confirmação diz "gerar a partir do modelo". São 3 nomes para 1 ação.
3. **Não existe documento em branco.** Sem template configurado, a única saída é escrever no Word, salvar no computador e subir.
4. **O editor mora numa gaveta sobre outra gaveta.** O documento fica espremido; o cabeçalho da gaveta rola para fora da tela e leva junto o X.
5. **Tela cheia sem contexto.** Sai do ENSPACE visualmente: sem nome do item, sem estado de salvamento, sem caminho de volta além do Esc.
6. **Esc fecha tudo.** Fechar o select de versões com Esc fecha o editor inteiro.
7. **Versões sem informação.** Um select com "Versão N", sem quem, quando, de onde veio, comparar ou restaurar.
8. **O campo preenchido não diz nada.** Um botão sem cor e um chip genérico de arquivo. Não diz quem editou, quando, qual versão, nem se alguém está com o documento aberto. Depois da edição, o chip passou a mostrar "-" no lugar do tamanho.
9. **O X vermelho apaga o documento** do lado do baixar, no mesmo peso visual.
10. **O documento não segue o Salvar do item**, e o rodapé do item diz "Alterações não salvas" desde a abertura. A pessoa não sabe qual dos dois botões guarda o documento.
11. **Configuração:** "Editar" nasce desligado, e as 7 chaves misturam como criar (upload) com o que se faz no editor (chat, revisão). A pré-visualização do campo repete o botão "Subir documento".
12. **Revisão ortográfica em inglês** ("English (United States)") num ENSPACE em português.
13. **Título com caixa errada:** "Editor De Documentos".

## A casca da tela, item por item

Copiada do develop em 08/10/2026 (a mesma casca da tela de itens). Nada dela é proposta.

- **Menu lateral:** cabeçalho com o workspace (avatar, nome, slug, seta); "Buscar..." com `Ctrl` `K`; seção **Membro** (Início, Spaceflows, Categorias aberta com a categoria e os formulários, Tarefas, Agenda, Knowledge); seção **Configurações** (Visão Geral, Sistema, Estrutura, Gestão de Membros, Interface, E-mails, Integrações, Agentes de IA, Logs, Credenciais); seção **Ajuda** (Releases, Documentação com seta de link externo); botão redondo de recolher na borda.
- **Barra do topo:** recolher menu, voltar, avançar, recarregar, início; trilha "workspace › Categorias › categoria" com `Ctrl` `B` e estrela; bandeira do idioma, tema, **Suporte**, sino, avatar com bolinha verde.
- **Tela da categoria:** abas **Itens** e **+ Visualizar**; barra com "Pesquisar registros", "Criado em", "Todo o período", ícones e **Novo registro**; tabela com Ações, Referência e as colunas dos campos; rodapé "Mostrando 1 a N de N resultados" e paginação.
- **Visão rápida do item:** gaveta à direita; trilho de ícones à esquerda; abas **Visão Geral**, **Comentários**, **Logs de Auditoria**, **Tarefas**; anexos; navegador "1/9" com setas; campos do formulário em coluna; rodapé com "Alterações não salvas", **Sair sem salvar** e **Salvar**.

## Preparo

Não usei a API. Pela tela, no workspace de exploração: ativei 4 chaves do campo `vitrine_documento` (upload externo, upload de PDF, comentar, editar) e subi um .docx fictício num item da categoria `leve`.

## A limitação técnica do Word

A hipótese da demanda ("só Word para a web") é o contrário do que a documentação da Microsoft mostra:

- **Word instalado (Windows e Mac): alcançável sem a Microsoft.** O ENSPACE abre o arquivo pela URL (`ms-word:ofe|u|...`) e, com um endpoint WebDAV com bloqueio, o Ctrl+S grava no item.
- **Word para a web: o caso difícil.** Exige o programa de parceiros da Microsoft (CSPP), que obriga o Office como editor padrão, ou copiar o arquivo para o OneDrive de quem edita.

Detalhe e fontes no `PESQUISA.md`, seção "A limitação técnica". Decisão no `DECISOES.md`.

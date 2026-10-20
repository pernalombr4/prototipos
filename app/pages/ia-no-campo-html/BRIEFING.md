# IA no campo HTML

## A demanda, como ela veio

Pedido de 08/10/2026:

> voce precisa fazer um prototipo do seguinte no campo html do enspace:
>
> * permitir uso de ia durante escrita de texto no campo html por comando com "/"
> * colocar botão pra utilizar IA na barra de ferramentas do campo html
>
> se ja souber como esse campo é por outros prototipos, nao precisa acessar o enspace. se precisar acessar, aguarde minha liberaçao pq dns ta fora no momento

## A tela em jogo

O campo **Editor de texto HTML** no formulário do item: tela do item, folder Visão Geral. O protótipo usa um item da categoria Contratos com 2 campos HTML:

- **Parecer do jurídico**, preenchido (2 parágrafos, com erros de digitação de propósito);
- **Observações internas**, vazio.

## O que seria sucesso

Quem escreve no campo HTML pede ajuda ao BENI sem sair do campo, pelo "/" ou pelo botão da barra, vê a proposta antes de ela entrar no texto e decide se aceita.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (`temas/README.md`, as auditorias dos 6 temas e o `UX_REPORT.md`) por "html", "editor de texto", "BENI", "IA" e "inteligência". **Não havia nada sobre o campo HTML nem sobre IA na escrita.**

## Por que a Fase 2 não foi no develop

Ela liberou não acessar o ENSPACE se o campo já fosse conhecido, e o DNS estava fora. O campo foi medido no develop em setembro, no protótipo `padrao-dos-campos` (BRIEFING, seção 6.2). Esta rodada usa aquela medição.

## O que o campo faz hoje

Medido em `padrao-dos-campos` (formulário de criação com 29 campos, uma coluna):

| Peça | Como é |
|---|---|
| Controle | editor de blocos, 268 px de altura com o rótulo |
| Barra fixa, nesta ordem | desfazer, refazer, título, negrito, itálico, sublinhado, tachado, código, emoji, alinhamento, mais |
| Placeholder | `Escreva ou digite "/" para acessar os comandos...` |
| Menu "/" | existe (o placeholder o anuncia) |
| IA | ~~nenhuma no campo~~ ~~só com a integração OpenAI instalada (rodada 6)~~ **Corrigido na rodada 10:** funciona sempre, com todos os modelos, em en-credits; a chave de uma conta própria só muda quem paga (abaixo) |

### Como a IA do ENSPACE é cobrada (rodada 10, 2026-10-20)

Fonte: a redatora, em 2026-10-20. Quem usa a IA no ENSPACE usa todos os modelos que o ENSPACE disponibiliza, sem conexão nenhuma, e o consumo sai dos en-credits. Conectar a chave da própria conta de IA só faz o custo ser absorvido por essa conta.

Isso corrige 2 premissas das rodadas 6 e 7: a IA não fica "desligada" sem integração, e a integração não libera modelos. O `en-docs` (página da integração OpenAI) diz que o botão de IA do editor só aparece com a integração instalada; a frase da redatora vence, e a página do `en-docs` pode estar desatualizada (achado abaixo).

### A integração OpenAI de hoje (rodada 6, 2026-10-14)

Segundo o `en-docs` (página da integração OpenAI), com a integração instalada o editor HTML mostra um botão de IA com: Revisar, Traduzir, Resumir, Continuar, Explicar, Subir Arquivo e Personalizado. Sem ela, o botão não aparece.

Como se instala, medido no develop (workspace de exploração, 2026-10-14), só olhando, sem salvar chave:

1. Configurações › Integrações: o cartão OpenAI, na seção "Inteligência Artificial", com "+ Instalar Integração" (`evidencias/hoje-openai-cartao.png`);
2. a página da OpenAI: logo, "Descrição" e o botão "Instalar Integração" (`evidencias/hoje-openai-pagina.png`);
3. o modal "OpenAI": chave "Alterar Token" (já ligada), o campo obrigatório "Api Key" com "Por favor digite" e "Salvar" (`evidencias/hoje-openai-modal.png`).

~~Quem escreve no campo não tem como saber que a IA existe: sem a integração, nada no campo aponta para ela.~~ Premissa derrubada na rodada 10: a IA não depende da integração.

**O que não foi medido:** os itens do menu "/" de hoje. O protótipo monta os grupos Texto, Listas e Inserir com os blocos que a barra já oferece. **Conferir no develop** quando o DNS voltar.

## A casca da tela, item por item

Cópia de `pastas-do-item` (`_CascaDoItem.vue` e `_PainelDoItem.vue`), que copiou a preview em 08/10/2026:

- menu lateral do `enspace-releases`: Buscar (Ctrl K); Membro, com Categorias aberto e Contratos ativo; Configurações, com Agentes de IA; Ajuda;
- barra do topo: voltar, avançar, recarregar, início, trilha (workspace › Categorias › categoria › referência), Ctrl B, estrela, BR, tema, Suporte, sino 99+, avatar;
- painel do item: ícone, referência, categoria, Identificação, Origem, Histórico e o botão de recolher;
- barra de folders no estilo de hoje (chips), com a Visão Geral ativa;
- rodapé com Salvar.

## Achados fora da demanda

- **Tela de integração da OpenAI (develop, 2026-10-14):**
  - o submenu Integrações mostra chaves de tradução cruas no lugar dos rótulos;
  - `/settings/integrations/apps` abre em branco;
  - o botão "Instalar Integração" da página tem cor de desabilitado, mas funciona;
  - na 1ª instalação, a chave "Alterar Token" já vem ligada, sem token nenhum para alterar;
  - o rótulo "Api Key" fica em inglês na tela em português;
  - nada diz onde pegar a chave nem que a conta OpenAI precisa de créditos.
- ~~**Modelos de 4 empresas, chave de 1 (rodada 7):** não está claro quem paga e qual chave atende um agente com Claude.~~ **Respondido em 2026-10-20 pela redatora:** todos os modelos funcionam em en-credits; a chave de uma conta só leva o consumo dos modelos daquela empresa para ela.
- **A página da integração OpenAI no `en-docs` (rodada 10):** diz que o botão de IA do editor HTML só aparece com a integração instalada. Pela regra de 2026-10-20, a IA funciona sem integração. Se a regra vale hoje no produto, a página do `en-docs` está desatualizada; quem confirma é o time. Este agente não escreve no `en-docs`.
- **Alinhamento e emoji precisam de extensão própria** no editor (TextAlign e Emoji do TipTap). O protótipo não as tem: o alinhamento é maquete e o emoji insere o caractere direto.

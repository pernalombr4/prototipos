# Protótipos ENSPACE

> ## ⛔ Proibição máxima
>
> **O agente deste repositório só escreve aqui dentro. Nenhum outro repositório é tocado.**
> `en-docs` é **somente leitura** (é de onde o tema foi copiado). Qualquer outro repositório:
> não encostar. Precisa mudar algo fora daqui — para e avisa.
> A regra inteira está no topo de [`AGENTE_PROTOTIPOS.md`](AGENTE_PROTOTIPOS.md).

Protótipos de alta fidelidade para o ENSPACE, feitos em **Nuxt 4 + Nuxt UI 4** com o mesmo
tema do produto. Cada protótipo nasce de uma demanda, passa por uma investigação no ambiente
de develop e por uma pesquisa de referências de mercado antes de virar tela.

- **A spec do agente:** [`AGENTE_PROTOTIPOS.md`](AGENTE_PROTOTIPOS.md)
- **A operação no repositório:** [`CLAUDE.md`](CLAUDE.md)
- **Componentes fora da biblioteca:** [`COMPONENTES-CUSTOM.md`](COMPONENTES-CUSTOM.md)

## Ver

**Publicado:** https://pernalombr4.github.io/prototipos/ — atualiza sozinho a cada push na
`main`, em cerca de um minuto.

**Local:**

```bash
pnpm install
pnpm dev
```

`http://localhost:3000` abre o mesmo índice, que lista sozinho todos os protótipos
existentes.

## Como está organizado

Todo protótipo é **100% front-end**: roda no navegador, sem back-end, sem API e sem login.
O dado é sempre **mockado** — estrutura tirada do produto, valores fictícios, nunca dado real
de cliente.

```
app/pages/<slug>/
├── index.vue        tela principal
├── mocks.ts         o dado do protótipo, fictício e tipado
├── BRIEFING.md      a demanda + como o develop faz hoje
├── PESQUISA.md      Notion, Twenty CRM, ClickUp, Monday, Pipefy + as extras
├── DECISOES.md      o que foi proposto, o que é maquete, as iterações
└── evidencias/      prints do develop e das referências
```

## Manter o SDK em dia

O SDK do ENSPACE é versionado em `0.x`, e o `^` do `package.json` **não atravessa minor em
`0.x`**: `^0.14.0` para em `0.14.x` e nunca chega sozinho no `0.15.0`. Quer dizer que o pacote
mais importante daqui é justamente o único que envelhece em silêncio, enquanto `@nuxt/ui` e
`nuxt` andam sozinhos. Não dá para resolver isso lembrando.

Três peças cuidam disso:

| Peça | O que faz |
|---|---|
| [`.github/dependabot.yml`](.github/dependabot.yml) | Abre PR toda segunda. Os cinco `@be-enlighten` num PR só, porque são peers e sobem em lockstep |
| [`.github/workflows/verificar.yml`](.github/workflows/verificar.yml) | Roda no PR o build de verdade mais a conferência abaixo. Verde quer dizer que os protótipos sobrevivem à versão nova |
| [`ferramentas/conferir-sdk.js`](ferramentas/conferir-sdk.js) | Compara o que os protótipos **importam** com o que o pacote instalado **exporta** |

```bash
pnpm conferir          # confere o que está em disco
pnpm conferir:remoto   # e pergunta ao registry se saiu versão nova
```

O `conferir` é a regra 5 da spec ("componente e prop se conferem em disco") feita de uma vez
para o repositório inteiro: tipo do `enspace-sdk-schemas` que sumiu, componente base do
`enspace-sdk-ui` que mudou de nome, componente `U*` do Nuxt UI que deixou de existir. Quando
reprova, ele diz o arquivo e o nome.

## Protótipos

<!-- O índice vivo é a home do app (pnpm dev). Esta tabela é o resumo para quem lê no GitHub. -->

| Protótipo | Demanda | Status |
|---|---|---|
| [Tela de entrada (Workspaces)](app/pages/tela-de-workspaces/) | Fazer a pessoa entender que é uma tela de escolha, e não o lugar onde se abre chamado | em revisão |
| [Configurações do Sistema](app/pages/configuracoes-do-sistema/) | "Não consigo me encontrar em /settings/system" — abas desorganizadas, calendário em MVP, notificações que ninguém entende, cobrança pobre e nenhuma ligação com a documentação | em revisão |
| [Menu lateral em dois níveis](app/pages/menu-lateral/) | "O menu do enspace na lateral esquerda é muito cheio e confuso. Se eu tiver muitas categorias então piorou" — 36 linhas em 3 níveis medidas no develop, 19 delas de administração | em revisão |

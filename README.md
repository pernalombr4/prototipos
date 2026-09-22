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

A mesma regra vale para o [taze](https://github.com/antfu-collective/taze), e aqui mora a
pegadinha: **`taze minor` responde "tudo em dia" com o 0.15.0 publicado.** Para o SDK, o modo
é `major`, porque em `0.x` é o minor que carrega a quebra.

E tem a segunda metade do problema: **saber que saiu versão nova não muda nada enquanto o
`pnpm install` não rodar.** O `node_modules` continua velho, e a regra 5 da spec ("componente
e prop se conferem em disco") fica conferindo em disco antigo.

### O fluxo, do aviso até o protótipo de pé

1. **`pnpm dev` avisa sozinho** quando há versão nova. Quando está tudo em dia, não fala nada.
2. **`pnpm atualizar:sdk`** lista os quatro pacotes do SDK, você escolhe com as setas, e ele
   escreve o `package.json` **e instala**.
3. **`pnpm conferir` roda logo em seguida** e diz se algum `mocks.ts` perdeu um tipo.
4. **`pnpm generate`** confirma que as telas ainda renderizam.

| Comando | O que faz |
|---|---|
| `pnpm atualizar:sdk` | Só os quatro `@be-enlighten/*`. Interativo, escreve e instala |
| `pnpm atualizar` | Tudo, inclusive as actions dos workflows. Interativo |
| `pnpm conferir` | Confere o contrato em disco, sem rede |
| `pnpm conferir:remoto` | A tabela de versões, sem precisar baixar o taze |

O `atualizar` chama o taze por `pnpm dlx`, então ele não vira dependência do projeto.

O [`ferramentas/conferir-sdk.js`](ferramentas/conferir-sdk.js) é a regra 5 feita de uma vez
para o repositório inteiro: tipo do `enspace-sdk-schemas` que sumiu, componente base do
`enspace-sdk-ui` que mudou de nome, componente `U*` do Nuxt UI que deixou de existir. Quando
reprova, ele diz o arquivo e o nome.

### E no repositório, como rede de segurança

| Peça | O que faz |
|---|---|
| [`.github/dependabot.yml`](.github/dependabot.yml) | Abre PR toda segunda, para o que ninguém lembrou de atualizar à mão |
| [`.github/workflows/verificar.yml`](.github/workflows/verificar.yml) | Roda em todo PR o `conferir` mais o build de verdade |
| [`ferramentas/rotina-semanal.md`](ferramentas/rotina-semanal.md) | Toda segunda, uma sessão na nuvem sobe o SDK num clone descartável, roda `conferir` e `generate`, e manda o veredito no celular |

Isso cuida do **repositório**. O `pnpm atualizar` cuida da **sua máquina**, que é onde o
protótipo se constrói. São problemas diferentes, e é por isso que existem os dois.

A rotina semanal existe porque o Dependabot **nunca abriu o PR do SDK**, então o `verificar`
nunca chegou a testar a versão nova. Ela fecha esse buraco: o recado que chega deixa de ser
"existe 0.15.0" e passa a ser "existe 0.15.0, testei, passa". O arquivo acima é uma cópia da
receita, não a fonte: a rotina mora fora do repositório, e editar o arquivo não a muda.

## Protótipos

<!-- O índice vivo é a home do app (pnpm dev). Esta tabela é o resumo para quem lê no GitHub. -->

| Protótipo | Demanda | Status |
|---|---|---|
| [Tela de entrada (Workspaces)](app/pages/tela-de-workspaces/) | Fazer a pessoa entender que é uma tela de escolha, e não o lugar onde se abre chamado | em revisão |
| [Configurações do Sistema](app/pages/configuracoes-do-sistema/) | "Não consigo me encontrar em /settings/system" — abas desorganizadas, calendário em MVP, notificações que ninguém entende, cobrança pobre e nenhuma ligação com a documentação | em revisão |
| [Menu lateral em dois níveis](app/pages/menu-lateral/) | "O menu do enspace na lateral esquerda é muito cheio e confuso. Se eu tiver muitas categorias então piorou" — 36 linhas em 3 níveis medidas no develop, 19 delas de administração | em revisão |

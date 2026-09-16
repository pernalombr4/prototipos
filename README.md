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

## Protótipos

<!-- O índice vivo é a home do app (pnpm dev). Esta tabela é o resumo para quem lê no GitHub. -->

| Protótipo | Demanda | Status |
|---|---|---|
| [Tela de entrada (Workspaces)](app/pages/tela-de-workspaces/) | Fazer a pessoa entender que é uma tela de escolha, e não o lugar onde se abre chamado | em revisão |
| [Configurações do Sistema](app/pages/configuracoes-do-sistema/) | "Não consigo me encontrar em /settings/system" — abas desorganizadas, calendário em MVP, notificações que ninguém entende, cobrança pobre e nenhuma ligação com a documentação | em revisão |

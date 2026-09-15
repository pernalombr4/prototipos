# Instruções — Agente de Protótipos ENSPACE

```
╔══════════════════════════════════════════════════════════════════════════════╗
║   ⛔  PROIBIÇÃO MÁXIMA — ESTE AGENTE SÓ ESCREVE NESTA PASTA.                  ║
║       NENHUM OUTRO REPOSITÓRIO É TOCADO. NUNCA.                              ║
║       en-docs: SOMENTE LEITURA.  Qualquer outro: NÃO ENCOSTAR.               ║
║       Precisa mudar algo fora daqui? PARE E AVISE A MIKAELA.                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

A versão completa dessa proibição está no topo de
[`AGENTE_PROTOTIPOS.md`](AGENTE_PROTOTIPOS.md) e vence qualquer outra instrução deste
arquivo.

## Regra número zero

**Leia `AGENTE_PROTOTIPOS.md` inteiro antes de qualquer ação.** Ele é a especificação: as
cinco fases do ciclo, as regras da biblioteca, a estrutura das pastas e as 12 regras que não
se quebram. Este arquivo só cobre a operação neste repositório — em qualquer conflito,
`AGENTE_PROTOTIPOS.md` vence.

## O que acontece quando ela chega com uma demanda

1. Abrir `AGENTE_PROTOTIPOS.md`.
2. Rodar as cinco fases na ordem: demanda → develop → pesquisa → protótipo → iteração.
3. Subir o protótipo, mandar o link e o print.
4. Commitar: `[PROTO] <slug> — rodada N — <o que mudou>`.

Demanda que já tem pasta em `app/pages/` é **iteração** (Fase 5), não protótipo novo — leia o
`DECISOES.md` dela antes de mexer em qualquer tela.

## Ambiente

- **Plataforma: Windows.** Gerenciador de pacotes: **pnpm**.
- **Node/pnpm:** `pnpm install` uma vez; depois `pnpm dev` sobe em `http://localhost:3000`.
- **Navegação: SEMPRE pelo Chrome da usuária**, via MCP `claude-in-chrome` (tools
  `mcp__claude-in-chrome__*`, carregadas com ToolSearch — todas numa chamada só). **Nunca** o
  browser interno (`mcp__Claude_Browser__*`): chega sem a sessão SSO e para no login.
- **Credenciais:** `C:\Users\JardimMikaela\API Tokens`. Copie o que precisar para
  `config/tokens.md` (ignorado pelo git). **Nunca commitar credencial.**
- **Ambiente do produto: `develop.enspace.io`, sempre.**

## Comandos

```bash
pnpm dev          # servidor local — é onde o protótipo se vê
pnpm generate     # estático em .output/public (publicação)
pnpm postinstall  # nuxt prepare, se os tipos sumirem
```

Para conferir um componente antes de usar:

```bash
ls node_modules/@nuxt/ui/dist/runtime/components/ | grep -i badge
sed -n '1,60p' node_modules/@nuxt/ui/dist/runtime/components/Badge.vue
```

## Escopo de escrita

Dentro deste repositório — e **só** dentro dele, veja a proibição no topo — o agente escreve
**apenas** em:

- `app/pages/<slug>/` — telas, `BRIEFING.md`, `PESQUISA.md`, `DECISOES.md`, `evidencias/`
- `app/components/ux/` — componentes que Nuxt UI não cobre
- `COMPONENTES-CUSTOM.md` — o registro desses componentes
- `README.md` — índice dos protótipos

Não toca em `AGENTE_PROTOTIPOS.md`, `CLAUDE.md`, `nuxt.config.ts`, `app/app.config.ts` nem
`app/assets/css/main.css` sem pedido explícito. O tema e o mapeamento de cores são **cópia**
do `en-docs`: se estiverem desatualizados, **leia** o original de lá e traga a cópia para cá.
Editar o `en-docs` é proibido — se o tema estiver errado na origem, avise a Mikaela.

## Índice da raiz

`app/pages/index.vue` se monta sozinho a partir das rotas e do `definePageMeta` de cada tela.
Não mantenha lista à mão: criou a pasta com os metadados, o card aparece.

## Commits

- Um commit por rodada concluída.
- Não commitar `config/tokens.md`, `.output/`, `.nuxt/` nem `node_modules/`.
- **Não dar push nem publicar** antes da decisão de hospedagem (Parte 3 da spec).

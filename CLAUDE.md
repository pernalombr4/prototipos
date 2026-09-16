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

## 🚫 100% front-end, dado sempre mockado

O protótipo roda inteiro no navegador: **sem back-end, sem API, sem banco, sem login, sem
segredo**. Nada em `server/`, nenhuma chamada de rede em runtime. O dado vem de um `mocks.ts`
dentro da pasta do protótipo — estrutura tirada do develop, valores inventados, **nunca dado
real de cliente**. Interação mexe no array em memória e o reload zera tudo.

Isso não tem exceção nem versão temporária. A regra inteira está na **Parte 2 → E o protótipo
é 100% front-end**, e é a regra 4 da Parte 6.

## Ambiente

- **Plataforma: Windows.** Gerenciador de pacotes: **pnpm**.
- **Node/pnpm:** `pnpm install` uma vez; depois `pnpm dev` sobe em `http://localhost:3000`.
- **Navegação: SEMPRE pelo Chrome da usuária**, via MCP `claude-in-chrome` (tools
  `mcp__claude-in-chrome__*`, carregadas com ToolSearch — todas numa chamada só). **Nunca** o
  browser interno (`mcp__Claude_Browser__*`): chega sem a sessão SSO e para no login.
- **Credenciais e endereços:** `config/tokens.md` — local, ignorado pelo git. Monte a partir
  de `config/tokens.example.md`, que diz de onde vem cada valor. **Nunca commitar credencial:
  este repositório é público.**
- **Ambiente do produto: develop, sempre** (`BASE_URL` do `config/tokens.md`). Nunca produção.

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

- `app/pages/<slug>/` — telas, `mocks.ts`, `BRIEFING.md`, `PESQUISA.md`, `DECISOES.md`,
  `evidencias/`
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

**Cada protótipo tem UM card com UM link.** As outras telas e fluxos dele se navegam por
dentro — camada, painel, passo. Nunca dois botões no mesmo card.

## Ao desenhar — os quatro erros já cometidos

Regras 14 a 17 da Parte 6 da spec, repetidas aqui porque saíram de correção da Mikaela:

1. **Uma porta por protótipo.** Duas jornadas que no produto acontecem na mesma tela ficam na
   mesma tela do protótipo.
2. **Não troque a forma que o produto usa.** Card só vira lista se houver alternador visível;
   o padrão continua card.
3. **Ação do topo continua no topo.** Rebaixe cor e variante, nunca o endereço.
4. **Sem movimento não é alta fidelidade.** Entrada em cascata, hover, transição de estado,
   carregamento no botão clicado. As curvas e o `prefers-reduced-motion` estão no `main.css`.

## Commits

- Um commit por rodada concluída.
- Não commitar `config/tokens.md`, `.output/`, `.nuxt/` nem `node_modules/`.
- **O repositório é público.** Antes de commitar print ou dado, leia o aviso da Parte 3 da
  spec: nada de credencial, de dado de cliente real, de e-mail de pessoa ou de URL com token.

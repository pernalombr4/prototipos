# Componentes fora do Nuxt UI

Tudo que está aqui é código que **o time de front vai ter que construir** se o protótipo for
aprovado. Por isso a lista existe: ela é metade do handoff.

A regra (Parte 2 da spec) é uma escada — só se chega aqui depois de tentar os degraus
anteriores:

1. **o ENSPACE já tem?** — `EnTable`, `EnKanbanBoard`, `EnLayout`, `EnApp` do
   `@be-enlighten/enspace-sdk-ui/base`;
2. procurar o componente pelo nome em `node_modules/@nuxt/ui/dist/runtime/components/`;
3. compor com as primitivas que existem;
4. só então criar em `app/components/ux/Ux<Nome>.vue`;
5. e registrar nesta tabela.

## Registro

| Componente | Protótipo | Por que Nuxt UI não cobriu | Partiu de | O que o dev precisa construir |
|---|---|---|---|---|
| `UxSeletorDeIcones.vue` | configuracoes-do-sistema (Logo do workspace) | Nuxt UI não tem seletor de ícone, e nenhuma lista dele virtualiza. O `USelectMenu` monta todas as opções no DOM: com 50 mil ícones, trava | `UInput` + grade de `<button>` com `UIcon`, mais rolagem virtual escrita à mão | A grade virtualizada (só as linhas visíveis no DOM), a busca que normaliza acento e casa com sinônimo em português, a curadoria que aparece antes de qualquer busca, e o índice de termos por ícone |

**Dado que acompanha:** `app/components/ux/icones.ts`, gerado a partir do `@iconify-json/lucide`
instalado. No produto esse índice vem do servidor de ícones, não do bundle do cliente.

**Duplicação conhecida:** o protótipo `tela-de-workspaces` tem uma cópia local da mesma
biblioteca e um seletor equivalente, feitos antes deste componente existir. Quando ele migrar
para cá, a cópia de lá sai. Este agente não edita a pasta do outro protótipo.

## O que vale antes de criar um componente novo

- **Slot resolve mais do que parece.** Quase todo componente do Nuxt UI aceita slot no lugar
  da prop — `#header`, `#leading`, `#trailing`, `#item`. Antes de escrever do zero, confira o
  arquivo `.vue` do componente e veja quais slots ele expõe.
- **`ui` reestiliza sem bifurcar.** A prop `ui` de cada componente aceita sobrescrever as
  classes de cada parte interna. Ajuste de aparência quase nunca justifica componente novo.
- **Composto não é custom.** `UCard` com `UTable` dentro e um `UButton` no header continua
  sendo Nuxt UI puro — não entra nesta lista.

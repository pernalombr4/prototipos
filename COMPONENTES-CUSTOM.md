# Componentes fora do Nuxt UI

Tudo que está aqui é código que **o time de front vai ter que construir** se o protótipo for
aprovado. Por isso a lista existe: ela é metade do handoff.

A regra (Parte 2 da spec) é uma escada — só se chega aqui depois de tentar os três degraus
anteriores:

1. procurar o componente pelo nome em `node_modules/@nuxt/ui/dist/runtime/components/`;
2. compor com as primitivas que existem;
3. só então criar em `app/components/ux/Ux<Nome>.vue`;
4. e registrar nesta tabela.

## Registro

| Componente | Protótipo | Por que Nuxt UI não cobriu | Partiu de | O que o dev precisa construir |
|---|---|---|---|---|
| _nenhum ainda_ | | | | |

## O que vale antes de criar um componente novo

- **Slot resolve mais do que parece.** Quase todo componente do Nuxt UI aceita slot no lugar
  da prop — `#header`, `#leading`, `#trailing`, `#item`. Antes de escrever do zero, confira o
  arquivo `.vue` do componente e veja quais slots ele expõe.
- **`ui` reestiliza sem bifurcar.** A prop `ui` de cada componente aceita sobrescrever as
  classes de cada parte interna. Ajuste de aparência quase nunca justifica componente novo.
- **Composto não é custom.** `UCard` com `UTable` dentro e um `UButton` no header continua
  sendo Nuxt UI puro — não entra nesta lista.

<script setup lang="ts">
/**
 * Escolher quais categorias o widget mostra e em que ordem (rodada 5).
 *
 * A redatora pediu: "o user deveria poder definir a ordem em que eles
 * aparecem dentro do widget também". As marcadas vêm primeiro, na ordem
 * escolhida, com Subir e Descer; as desmarcadas ficam abaixo, na ordem do
 * workspace. Marcar põe a categoria no fim das marcadas.
 *
 * Setas e não arraste: o mesmo caminho sem arraste da edição da Home
 * (WCAG 2.5.7), e o arraste dos exemplos do Nuxt UI pede pacotes que o app
 * não importa (`@vueuse/integrations` e `sortablejs`).
 *
 * Rodada 6, a pedido da redatora ("deve poder selecionar todos e desmarcar
 * todos também"): "Marcar todas" mantém a ordem das já marcadas e põe as
 * outras no fim, na ordem do workspace; "Desmarcar todas" limpa a escolha.
 * Os 2 ficam no alto da lista, ao lado da contagem, e se desativam quando não
 * há o que fazer.
 *
 * Usado no 2º nível do catálogo (Categorias) e no Configurar do widget.
 * Componentes: `UCheckbox`, `UButton`, `UTooltip`, `UIcon` (MCP nuxt-ui).
 */
import type { Categoria } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** As categorias que a pessoa acessa, na ordem do workspace. */
  categorias: Categoria[]
}>()
/** Slugs marcados, na ordem em que aparecem no widget. */
const escolhidas = defineModel<string[]>({ default: () => [] })

const linhas = computed(() => {
  const marcadas = escolhidas.value
    .map(slug => props.categorias.find(c => c.slug === slug))
    .filter((c): c is Categoria => !!c)
  const resto = props.categorias.filter(c => !escolhidas.value.includes(c.slug))
  return [...marcadas.map(c => ({ c, marcada: true })), ...resto.map(c => ({ c, marcada: false }))]
})

function alternar(slug: string, marcar: boolean) {
  escolhidas.value = marcar ? [...escolhidas.value, slug] : escolhidas.value.filter(x => x !== slug)
}

function marcarTodas() {
  escolhidas.value = [...escolhidas.value, ...props.categorias.map(c => c.slug).filter(s => !escolhidas.value.includes(s))]
}

function mover(slug: string, passo: -1 | 1) {
  const l = [...escolhidas.value]
  const i = l.indexOf(slug)
  const j = i + passo
  if (i < 0 || j < 0 || j >= l.length) return
  ;[l[i], l[j]] = [l[j]!, l[i]!]
  escolhidas.value = l
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-xs text-muted" aria-live="polite">
        {{ t.catalogo.marcadas(escolhidas.length, categorias.length) }}
      </p>
      <span class="flex items-center gap-1">
        <UButton :label="t.ordem.todas" icon="i-lucide-check-check" color="neutral" variant="ghost" size="xs" :disabled="escolhidas.length === categorias.length" @click="marcarTodas" />
        <UButton :label="t.ordem.nenhuma" icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :disabled="!escolhidas.length" @click="escolhidas = []" />
      </span>
    </div>
    <TransitionGroup tag="ul" name="lista" class="space-y-1">
      <li
        v-for="({ c, marcada }, i) in linhas"
        :key="c.slug"
        class="flex items-center gap-2 rounded-md border px-2 py-1.5 transition-colors duration-150"
        :class="marcada ? 'border-default bg-default' : 'border-transparent'"
      >
        <UCheckbox
          :model-value="marcada"
          :aria-label="t.ordem.mostrar(c.name)"
          @update:model-value="(v) => alternar(c.slug, v === true)"
        />
        <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4 shrink-0" :class="marcada ? 'text-primary' : 'text-dimmed'" />
        <span class="min-w-0 flex-1 truncate text-sm" :class="marcada ? 'text-highlighted' : 'text-muted'">{{ c.name }}</span>
        <template v-if="marcada">
          <span class="w-5 text-right text-xs tabular-nums text-dimmed">{{ i + 1 }}</span>
          <UTooltip :text="t.ordem.subir(c.name)">
            <UButton icon="i-lucide-arrow-up" color="neutral" variant="ghost" size="xs" :disabled="i === 0" :aria-label="t.ordem.subir(c.name)" @click="mover(c.slug, -1)" />
          </UTooltip>
          <UTooltip :text="t.ordem.descer(c.name)">
            <UButton icon="i-lucide-arrow-down" color="neutral" variant="ghost" size="xs" :disabled="i === escolhidas.length - 1" :aria-label="t.ordem.descer(c.name)" @click="mover(c.slug, 1)" />
          </UTooltip>
        </template>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* A linha desliza para o novo lugar ao Subir, Descer ou marcar. O TransitionGroup pede as classes; o Nuxt UI não tem lista reordenável. */
.lista-move { transition: transform 0.2s ease; }
@media (prefers-reduced-motion: reduce) { .lista-move { transition: none; } }
</style>

<script setup lang="ts">
/**
 * Rolagem infinita dos painéis de lista (pedido da rodada 2: "scroll infinito
 * em vez de um botão pra abrir mais").
 *
 * Fica no fim da lista. Quando aparece dentro da área que rola (o ancestral
 * marcado com `data-rolagem`), pede o próximo lote. A espera curta imita a
 * página seguinte da API: no produto, cada lote é uma chamada paginada.
 *
 * Nuxt UI: o `UTable` não tem rolagem infinita pronta (o exemplo
 * `TableInfiniteScrollExample` usa `useInfiniteScroll` do `@vueuse/core`, que
 * não está instalado aqui). Por isso o `IntersectionObserver` do navegador.
 */
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  temMais: boolean
  total: number
}>()

const emit = defineEmits<{ mais: [] }>()

const alvo = ref<HTMLElement | null>(null)
const carregando = ref(false)
let observador: IntersectionObserver | null = null
let espera: ReturnType<typeof setTimeout> | undefined

function pedir() {
  if (!props.temMais || carregando.value) return
  carregando.value = true
  espera = setTimeout(() => {
    carregando.value = false
    emit('mais')
    // Se a lista ainda não encheu a área visível, a sentinela continua à vista.
    nextTick(verificar)
  }, 350)
}

function verificar() {
  if (!alvo.value || !props.temMais) return
  const raiz = alvo.value.closest('[data-rolagem]')
  const r = alvo.value.getBoundingClientRect()
  const limite = raiz ? raiz.getBoundingClientRect().bottom : window.innerHeight
  if (r.top <= limite + 80) pedir()
}

onMounted(() => {
  if (!alvo.value) return
  observador = new IntersectionObserver(
    (entradas) => { if (entradas.some(e => e.isIntersecting)) pedir() },
    { root: alvo.value.closest('[data-rolagem]'), rootMargin: '0px 0px 80px 0px' },
  )
  observador.observe(alvo.value)
})

onBeforeUnmount(() => {
  observador?.disconnect()
  clearTimeout(espera)
})
</script>

<template>
  <div ref="alvo" class="flex min-h-9 items-center justify-center px-4 py-2 text-xs text-muted" aria-live="polite">
    <span v-if="carregando" class="flex items-center gap-2">
      <UIcon name="i-lucide-loader-circle" class="size-3.5 animate-spin motion-reduce:animate-none" />
      {{ t.carregandoMais }}
    </span>
    <span v-else-if="!temMais && total > 0">{{ t.fimDaLista(total) }}</span>
    <span v-else-if="temMais" class="sr-only">{{ t.carregandoMais }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): o "+ Filtro", que lista os campos com busca, como o protótipo
 * `visualizacoes-da-tela-de-itens` (`_LinhaDeFiltros.vue`).
 *
 * Com mais de 1 categoria (a barra do dashboard), os campos vêm agrupados pela
 * categoria, porque todo campo é de 1 categoria só. O topo diz em que painéis o
 * filtro vale. Texto e data não aparecem: o texto não filtra por opção e a data é o
 * período.
 */
import { ehFiltravel, iconeDoTipo } from './agregacao'
import { categoriaPorSlug } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  categorias: string[]
  /** Campos que já têm chip: escolher de novo abre o chip, não cria outro. */
  usados?: { categoria: string, campo: string }[]
  /** Texto do topo do painel. */
  ajuda?: string
  rotulo?: string
  variante?: 'ghost' | 'outline'
}>()
const emit = defineEmits<{ escolher: [categoria: string, campo: string] }>()

const aberto = ref(false)
const busca = ref('')
watch(aberto, (v) => { if (!v) busca.value = '' })

const grupos = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return props.categorias.map((slug) => {
    const cat = categoriaPorSlug.get(slug)!
    const campos = cat.campos.filter(ehFiltravel).filter(c => !q || c.name.toLowerCase().includes(q) || cat.name.toLowerCase().includes(q))
    return { slug, nome: cat.name, icone: cat.icon, campos }
  }).filter(g => g.campos.length)
})

function escolher(categoria: string, campo: string) {
  aberto.value = false
  emit('escolher', categoria, campo)
}
const usado = (categoria: string, campo: string) => props.usados?.some(u => u.categoria === categoria && u.campo === campo)

defineExpose({ abrir: () => { aberto.value = true } })
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', sideOffset: 6, onCloseAutoFocus: (e: Event) => e.preventDefault() }">
    <UButton :label="rotulo ?? t.filtro.adicionar" icon="i-lucide-plus" color="neutral" :variant="variante ?? 'ghost'" size="xs" />
    <template #content>
      <div class="w-72 p-1">
        <p v-if="ajuda" class="px-2 pb-1.5 pt-1 text-xs text-muted">{{ ajuda }}</p>
        <UInput v-model="busca" :placeholder="t.filtro.buscarCampo" icon="i-lucide-search" size="sm" variant="none" class="w-full" autofocus />
        <USeparator class="my-1" />
        <div class="max-h-80 overflow-y-auto">
          <template v-for="g in grupos" :key="g.slug">
            <p v-if="categorias.length > 1" class="flex items-center gap-1.5 px-2 pb-0.5 pt-2 text-xs font-medium text-muted">
              <UIcon :name="g.icone" class="size-3.5" />
              {{ g.nome }}
            </p>
            <UButton
              v-for="c in g.campos"
              :key="c.refId"
              :icon="iconeDoTipo(c)"
              color="neutral"
              variant="ghost"
              size="sm"
              block
              class="justify-start"
              @click="escolher(g.slug, c.refId)"
            >
              <span class="flex-1 truncate text-left">{{ c.name }}</span>
              <UIcon v-if="usado(g.slug, c.refId)" name="i-lucide-check" class="size-3.5 text-primary" />
            </UButton>
          </template>
          <p v-if="!grupos.length" class="px-2 py-1.5 text-sm text-muted">{{ t.filtro.semCampo }}</p>
        </div>
      </div>
    </template>
  </UPopover>
</template>

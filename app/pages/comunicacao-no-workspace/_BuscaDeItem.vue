<script setup lang="ts">
/**
 * PROPOSTA. Achar o item para vincular o e-mail: busca, não lista.
 *
 * Desenhada para o volume de verdade (regra 34): um workspace tem milhares de
 * itens, então a lista nunca mostra tudo. Vazia, mostra os recentes; com
 * texto, os 8 melhores resultados e quantos ficaram de fora. Item que a pessoa
 * não pode ver não aparece, nem na contagem.
 */
import type { Textos } from './textos'
import { type ItemDoProtótipo, categoriaPorSlug, itens } from './mocks'
import { contatosDoItem, useComunicacao } from './estado'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ escolher: [id: number] }>()

const { config } = useComunicacao()

const termo = ref('')
const buscando = ref(false)
const LIMITE = 8

let timer: ReturnType<typeof setTimeout> | undefined
watch(termo, () => {
  buscando.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (buscando.value = false), 280)
})

const visiveis = itens.filter(i => !i.semAcesso)

function normal(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Onde a busca procura: referência, ID, nome, categoria, os contatos e os
 * campos de texto do item (contraparte, CNPJ). O documento pede "outros campos
 * relevantes para identificação".
 */
function texto(i: ItemDoProtótipo) {
  const contatos = contatosDoItem(i, config.value).flatMap(c => [c.nome, c.email]).filter(Boolean).join(' ')
  const campos = Object.values(i.data as Record<string, unknown>).filter(v => typeof v === 'string').join(' ')
  return normal(`${i.reference} ${i.id} ${i.titulo} ${categoriaPorSlug(i.categoria).name} ${contatos} ${campos}`)
}

const encontrados = computed(() => {
  const q = normal(termo.value.trim())
  if (!q) return [...visiveis].sort((a, b) => +b.updated_at - +a.updated_at)
  const partes = q.split(/\s+/)
  return visiveis.filter(i => partes.every(p => texto(i).includes(p)))
})

interface Opcao { id: number, label: string, item: ItemDoProtótipo }
type Rotulo = { type: 'label', label: string }

/** Agrupado por categoria: itens de nome parecido em categorias diferentes se distinguem. */
const opcoes = computed<(Opcao | Rotulo)[][]>(() => {
  const lista = encontrados.value.slice(0, termo.value.trim() ? LIMITE : 5)
  const porCategoria = new Map<string, (Opcao | Rotulo)[]>()
  for (const i of lista) {
    const k = i.categoria
    if (!porCategoria.has(k)) porCategoria.set(k, [{ type: 'label', label: categoriaPorSlug(k).name }])
    porCategoria.get(k)!.push({ id: i.id, label: `${i.reference} ${i.titulo}`, item: i })
  }
  return [...porCategoria.values()]
})

const sobra = computed(() => Math.max(0, encontrados.value.length - LIMITE))

function escolher(o: Opcao | undefined) {
  if (!o) return
  emit('escolher', o.id)
  termo.value = ''
}

defineExpose({ focar: () => document.getElementById('busca-de-item')?.focus() })
</script>

<template>
  <UInputMenu
    id="busca-de-item"
    v-model:search-term="termo"
    :items="opcoes"
    ignore-filter
    open-on-focus
    open-on-click
    :loading="buscando"
    icon="i-lucide-search"
    :placeholder="t.compositor.buscarItem"
    class="w-full"
    :ui="{ label: 'text-[11px] uppercase tracking-wide' }"
    :reset-search-term-on-blur="false"
    @update:model-value="escolher($event as Opcao | undefined)"
  >
    <template #content-top>
      <p class="px-3 pb-1 pt-2 text-xs text-muted">
        {{ termo.trim() ? t.compositor.resultados(Math.min(encontrados.length, LIMITE), encontrados.length) : t.compositor.recentes }}
      </p>
    </template>

    <template #item="{ item: o }">
      <span class="flex w-full min-w-0 items-center gap-3 py-0.5">
        <UBadge color="info" variant="subtle" size="sm" class="shrink-0 font-mono text-[11px]">{{ (o as Opcao).item.reference }}</UBadge>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm text-highlighted">{{ (o as Opcao).item.titulo }}</span>
          <span class="block truncate text-xs text-muted">
            ID {{ (o as Opcao).item.id }} · {{ t.etapa[(o as Opcao).item.etapa] }}<template v-if="(o as Opcao).item.data.contraparte"> · {{ (o as Opcao).item.data.contraparte }}</template>
          </span>
        </span>
      </span>
    </template>

    <template #empty>
      <div class="px-3 py-4 text-center">
        <p class="text-sm text-highlighted">
          {{ t.compositor.nenhumItem(termo) }}
        </p>
        <p class="mt-1 text-xs text-muted">
          {{ t.compositor.nenhumItemDica }}
        </p>
      </div>
    </template>

    <template #content-bottom>
      <div class="border-t border-default px-3 py-2 text-xs text-muted">
        <p v-if="sobra && termo.trim()">
          {{ t.compositor.sobra(sobra) }}
        </p>
        <p class="flex items-center gap-1">
          <UIcon name="i-lucide-shield-check" class="size-3.5" />{{ t.compositor.soPermitidos }}
        </p>
      </div>
    </template>
  </UInputMenu>
</template>

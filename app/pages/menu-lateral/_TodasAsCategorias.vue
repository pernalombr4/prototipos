<script setup lang="ts">
import type { Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * A camada "ver todas as categorias".
 *
 * É a resposta ao "se eu tiver muitas categorias entao... piorou": a barra mostra
 * um recorte e a coleção inteira vive aqui, com busca. Padrão 3 da pesquisa
 * (Notion `More`, Attio `All objects`, Airtable, Pipefy, Linear, monday).
 *
 * A busca filtra de verdade, sobre o array em memória (regra 5). Fixar move a
 * categoria para Favoritos na barra, na hora.
 */
const props = defineProps<{
  categorias: Categoria[]
  t: TextosDaTela
}>()

const aberto = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  alternarFixar: [id: number]
  abrir: [categoria: Categoria]
}>()

const busca = ref('')

const filtradas = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  if (!termo) return props.categorias
  return props.categorias.filter(c =>
    c.name.toLowerCase().includes(termo)
    || (c.description ?? '').toLowerCase().includes(termo),
  )
})

function formularios(c: Categoria) {
  const n = c.formularios.length
  if (n === 0) return props.t.semFormulario
  if (n === 1) return props.t.umFormulario
  return props.t.varioFormularios(n)
}

// Abrir a camada limpa a busca: quem reabre quer a lista inteira de novo.
watch(aberto, (v) => { if (v) busca.value = '' })
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="props.t.todasTitulo"
    :description="props.t.todasDescricao(props.categorias.length)"
    :ui="{ content: 'max-w-2xl' }"
  >
    <template #body>
      <div class="flex flex-col gap-3">
        <UInput
          v-model="busca"
          icon="i-lucide-search"
          :placeholder="props.t.todasBusca"
          size="lg"
          autofocus
          :aria-label="props.t.todasBusca"
        >
          <template v-if="busca" #trailing>
            <UButton
              icon="i-lucide-x"
              size="xs"
              color="neutral"
              variant="link"
              :aria-label="props.t.todasFechar"
              @click="busca = ''"
            />
          </template>
        </UInput>

        <div class="max-h-[22rem] overflow-y-auto pr-1">
          <ul v-if="filtradas.length" class="space-y-1">
            <li
              v-for="(c, i) in filtradas"
              :key="c.id"
              class="group relative animate-[entrada_0.2s_ease-out_both]"
              :style="{ animationDelay: `${Math.min(i, 12) * 18}ms` }"
            >
              <button
                type="button"
                class="flex w-full items-start gap-3 rounded-lg border border-transparent p-2.5 pr-12 text-left transition-colors hover:border-default hover:bg-elevated"
                @click="emit('abrir', c); aberto = false"
              >
                <UIcon
                  :name="c.icon ?? 'i-lucide-folder'"
                  class="mt-0.5 size-4 shrink-0 text-toned"
                />
                <span class="min-w-0 flex-1">
                  <span class="flex flex-wrap items-center gap-1.5">
                    <span class="truncate text-sm font-medium text-highlighted">{{ c.name }}</span>
                    <UBadge
                      v-if="!c.noMenu"
                      :label="props.t.foraDoMenu"
                      size="sm"
                      color="neutral"
                      variant="subtle"
                    />
                  </span>
                  <span class="mt-0.5 block truncate text-xs text-muted">
                    {{ c.description ?? formularios(c) }}
                  </span>
                </span>
              </button>

              <UTooltip :text="c.favorita ? props.t.desafixar : props.t.fixar">
                <button
                  type="button"
                  class="absolute right-2 top-2.5 z-10 rounded p-1.5 transition-all hover:bg-accented"
                  :class="c.favorita
                    ? 'text-warning'
                    : 'text-toned opacity-0 group-hover:opacity-100 focus-visible:opacity-100'"
                  :aria-label="c.favorita ? props.t.desafixar : props.t.fixar"
                  :aria-pressed="c.favorita"
                  @click.stop="emit('alternarFixar', c.id)"
                >
                  <UIcon name="i-lucide-star" class="size-4" :class="c.favorita ? 'fill-current' : ''" />
                </button>
              </UTooltip>
            </li>
          </ul>

          <UEmpty
            v-else
            icon="i-lucide-search-x"
            :title="props.t.todasNenhuma(busca)"
            :description="props.t.todasNenhumaDica"
            class="animate-[entrada_0.25s_ease-out_both]"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

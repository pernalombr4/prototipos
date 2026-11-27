<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): o ícone de filtro de cada painel.
 *
 * O número no ícone conta todos os filtros que valem no painel. Abrir mostra, em 3 blocos:
 * - os filtros salvos no painel (definidos no construtor, valem para todos);
 * - os filtros da barra do dashboard que valem aqui (os da mesma categoria);
 * - os filtros só desta visão, que a pessoa põe e tira na hora, sem editar o painel.
 *   Eles entram na visão salva junto com o período e os filtros da barra.
 */
import type { ConfigDoPainel, FiltroDeCampo } from './agregacao'
import { filtroVazio } from './agregacao'
import { useDescricaoDeFiltro } from './filtros'
import type { Textos } from './textos'
import ListaDeFiltros from './_ListaDeFiltros.vue'

const props = defineProps<{
  t: Textos
  cfg: ConfigDoPainel
  /** Os filtros da barra do dashboard, de todas as categorias. */
  doDashboard: FiltroDeCampo[]
  podeEditar: boolean
}>()
const daVisao = defineModel<FiltroDeCampo[]>({ required: true })
const emit = defineEmits<{ editar: [] }>()

const { descrever } = useDescricaoDeFiltro(toRef(props, 't'))

const salvos = computed(() => props.cfg.condicoes.filter(f => !filtroVazio(f)))
const daBarra = computed(() => props.doDashboard.filter(f => f.categoria === props.cfg.categoria && !filtroVazio(f)))
const total = computed(() => salvos.value.length + daBarra.value.length + daVisao.value.filter(f => !filtroVazio(f)).length)
const aberto = ref(false)
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'end', sideOffset: 6 }">
    <UChip :show="total > 0" :text="total" size="lg" :color="daVisao.length ? 'primary' : 'neutral'" inset>
      <UButton
        icon="i-lucide-filter"
        color="neutral"
        :variant="daVisao.length ? 'soft' : 'ghost'"
        size="xs"
        :aria-label="t.filtroDoPainel.botao(total)"
      />
    </UChip>

    <template #content>
      <div class="w-80 space-y-3 p-3">
        <section>
          <p class="text-xs font-medium text-muted">{{ t.filtroDoPainel.salvos }}</p>
          <ul v-if="salvos.length" class="mt-1 space-y-0.5 text-sm text-toned">
            <li v-for="(f, i) in salvos" :key="i" class="flex items-start gap-1.5">
              <UIcon name="i-lucide-lock" class="mt-0.5 size-3.5 shrink-0 text-dimmed" />
              <span>{{ descrever(f) }}</span>
            </li>
          </ul>
          <p v-else class="mt-1 text-sm text-muted">{{ t.filtroDoPainel.nenhum }}</p>
          <UButton
            v-if="podeEditar"
            :label="t.filtroDoPainel.editar"
            icon="i-lucide-pencil"
            color="neutral"
            variant="link"
            size="xs"
            class="-ml-2 mt-0.5"
            @click="aberto = false; emit('editar')"
          />
        </section>

        <section v-if="daBarra.length">
          <USeparator class="mb-3" />
          <p class="text-xs font-medium text-muted">{{ t.filtroDoPainel.daBarra }}</p>
          <ul class="mt-1 space-y-0.5 text-sm text-toned">
            <li v-for="(f, i) in daBarra" :key="i" class="flex items-start gap-1.5">
              <UIcon name="i-lucide-layout-dashboard" class="mt-0.5 size-3.5 shrink-0 text-dimmed" />
              <span>{{ descrever(f) }}</span>
            </li>
          </ul>
        </section>

        <section>
          <USeparator class="mb-3" />
          <p class="text-xs font-medium text-muted">{{ t.filtroDoPainel.daVisao }}</p>
          <p class="mb-1.5 text-xs text-dimmed">{{ t.filtroDoPainel.daVisaoAjuda }}</p>
          <div class="flex flex-wrap items-center gap-1.5">
            <ListaDeFiltros v-model="daVisao" :t="t" :categorias="[cfg.categoria]" variante="outline" />
          </div>
        </section>
      </div>
    </template>
  </UPopover>
</template>

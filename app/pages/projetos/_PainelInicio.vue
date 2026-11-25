<script setup lang="ts">
/**
 * CASCA: o painel Início do menu novo (menu-lateral, rodada 35), resumido. Nada aqui é proposta:
 * os destinos de hoje na mesma ordem (Início, Spaceflows, Tarefas, Agenda) e os Favoritos.
 * Só Início e Tarefas abrem tela neste protótipo; os demais avisam que são maquete.
 */
import type { Textos } from './textos'
import { useProjetos } from './estado'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ recolher: [] }>()
const prj = useProjetos()
const toast = useToast()

const destinos = computed(() => [
  { id: 'inicio', icone: 'i-lucide-house', rotulo: props.t.casca.destinos.inicio },
  ...(prj.souConvidado.value ? [] : [{ id: 'spaceflows', icone: 'i-lucide-workflow', rotulo: props.t.casca.destinos.spaceflows }]),
  { id: 'tarefas', icone: 'i-lucide-square-check-big', rotulo: props.t.casca.destinos.tarefas, contador: 3 },
  ...(prj.souConvidado.value ? [] : [{ id: 'agenda', icone: 'i-lucide-calendar-days', rotulo: props.t.casca.destinos.agenda }]),
])

const ativo = computed(() => prj.tela.value.tipo)
/** Favoritos de exemplo: só os que a pessoa vê. Sem nenhum, a seção sai. */
const favoritos = computed(() => prj.categorias.value.filter(x => [1, 4].includes(x.id) && prj.veCategoria(x)))

function ir(id: string) {
  if (id === 'inicio') prj.tela.value = { tipo: 'inicio' }
  else if (id === 'tarefas') prj.tela.value = { tipo: 'tarefas' }
  else toast.add({ title: props.t.casca.maquete, icon: 'i-lucide-info', color: 'neutral' })
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex h-12 shrink-0 items-center gap-0.5 border-b border-default pl-3 pr-1.5">
      <h2 class="min-w-0 flex-1 truncate text-sm font-bold text-highlighted">{{ t.casca.inicio }}</h2>
      <UTooltip :text="t.casca.recolherMenu">
        <UButton icon="i-lucide-chevrons-left" size="xs" color="neutral" variant="ghost" :aria-label="t.casca.recolherMenu" @click="emit('recolher')" />
      </UTooltip>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto px-2 py-2">
      <ul class="space-y-px">
        <li v-for="d in destinos" :key="d.id">
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
            :class="ativo === d.id ? 'bg-primary/10 font-medium text-highlighted' : 'text-default'"
            :aria-current="ativo === d.id ? 'page' : undefined"
            @click="ir(d.id)"
          >
            <UIcon :name="d.icone" class="size-4 shrink-0" :class="ativo === d.id ? 'text-primary' : 'text-muted'" />
            <span class="flex-1 truncate">{{ d.rotulo }}</span>
            <UBadge v-if="d.contador" :label="String(d.contador)" size="sm" color="neutral" variant="soft" />
          </button>
        </li>
      </ul>

      <template v-if="favoritos.length">
      <p class="mt-4 px-2 pb-1 text-xs font-medium text-muted">{{ t.casca.favoritos }}</p>
      <ul class="space-y-px">
        <li v-for="c in favoritos" :key="c.id">
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-default transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
            @click="prj.abrirCategoria(c.id)"
          >
            <UIcon name="i-lucide-star" class="size-4 shrink-0 text-warning" />
            <span class="flex-1 truncate">{{ c.name }}</span>
          </button>
        </li>
      </ul>
      </template>
    </div>
  </div>
</template>

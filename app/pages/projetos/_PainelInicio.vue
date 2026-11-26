<script setup lang="ts">
/**
 * CASCA: o painel Início do menu novo (menu-lateral, rodada 35), resumido. Nada aqui é proposta:
 * os destinos de hoje na mesma ordem (Início, Spaceflows, Tarefas, Agenda) e os Favoritos.
 * Só Início e Tarefas abrem tela neste protótipo; os demais avisam que são maquete.
 *
 * Rodada 3 (as 3 camadas): os Favoritos são a camada pessoal. Vêm do estado de cada pessoa, a
 * estrela da barra do topo liga e desliga, e um projeto também pode ser favorito.
 */
import type { Textos } from './textos'
import { COR_DO_PROJETO, useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ recolher: [] }>()
const prj = useProjetos()
const toast = useToast()
const { marca } = useMarcaDeProposta()

const destinos = computed(() => [
  { id: 'inicio', icone: 'i-lucide-house', rotulo: props.t.casca.destinos.inicio },
  ...(prj.souConvidado.value ? [] : [{ id: 'spaceflows', icone: 'i-lucide-workflow', rotulo: props.t.casca.destinos.spaceflows }]),
  { id: 'tarefas', icone: 'i-lucide-square-check-big', rotulo: props.t.casca.destinos.tarefas, contador: 3 },
  ...(prj.souConvidado.value ? [] : [{ id: 'agenda', icone: 'i-lucide-calendar-days', rotulo: props.t.casca.destinos.agenda }]),
])

const ativo = computed(() => prj.tela.value.tipo)
/** Os favoritos da pessoa: só os que ela ainda vê. Sem nenhum, a seção sai. */
const favoritos = computed(() => prj.meusFavoritos.value.flatMap((chave) => {
  const [tipo, n] = chave.split(':')
  const id = Number(n)
  if (tipo === 'p') {
    const p = prj.projetos.value.find(x => x.id === id)
    return p && p.status === 'ativo' && prj.entra(p) ? [{ chave, tipo: 'p' as const, id, nome: p.nome, icone: p.icone, cor: p.cor }] : []
  }
  const c = prj.categorias.value.find(x => x.id === id)
  return c && prj.veCategoria(c) ? [{ chave, tipo: 'c' as const, id, nome: c.name, icone: c.icon ?? 'i-lucide-folder', cor: null }] : []
}))
const ativoFav = computed(() => prj.chaveDaTela.value)

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
      <ul class="space-y-px" :class="marca">
        <li v-for="f in favoritos" :key="f.chave" class="group flex items-center rounded-md transition-colors hover:bg-elevated" :class="ativoFav === f.chave ? 'bg-primary/10' : ''">
          <button
            type="button"
            class="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm focus-visible:outline-2 focus-visible:outline-primary"
            :class="ativoFav === f.chave ? 'font-medium text-highlighted' : 'text-default'"
            :aria-current="ativoFav === f.chave ? 'page' : undefined"
            @click="f.tipo === 'p' ? prj.abrirProjeto(f.id) : prj.abrirCategoria(f.id)"
          >
            <span v-if="f.cor" class="flex size-4 shrink-0 items-center justify-center rounded" :class="COR_DO_PROJETO[f.cor]"><UIcon :name="f.icone" class="size-3" /></span>
            <UIcon v-else :name="f.icone" class="size-4 shrink-0 text-muted" />
            <span class="flex-1 truncate">{{ f.nome }}</span>
          </button>
          <UTooltip :text="t.camadas.remover">
            <UButton
              icon="i-lucide-star"
              size="xs"
              color="warning"
              variant="link"
              class="opacity-60 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              :aria-label="`${t.camadas.remover}: ${f.nome}`"
              @click="prj.alternarFavorito(f.chave)"
            />
          </UTooltip>
        </li>
      </ul>
      </template>
    </div>
  </div>
</template>

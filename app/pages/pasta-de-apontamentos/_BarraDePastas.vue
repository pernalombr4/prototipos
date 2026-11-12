<script setup lang="ts">
/**
 * A barra de pastas do item.
 *
 * ⚠️ NADA AQUI É PROPOSTA, salvo o contador da pasta de Apontamentos. Copiado do
 * develop em 11/11/2026 (`/workspaces/teste-ux/types/leve/<referência>?folder=`):
 * abas sublinhadas com ícone, seta de opções na aba ativa e o botão de nova
 * pasta no canto direito. A proposta só acrescenta o número de pendentes ao
 * lado do nome da pasta de Apontamentos e liga o Editar dela à configuração
 * (rodada 3: o nome é fixo, então a configuração mora no Editar).
 *
 * Copiado em 12/11/2026, do item aberto na gaveta da listagem: quando as abas
 * não cabem, a barra mostra as que cabem e o botão "+N". O menu dele tem a
 * busca "Pesquisar pasta...", as pastas da barra, a seção "Fora da barra" com
 * as que sobraram (cada linha com a alça de arrastar e o "..."), Nova pasta,
 * "Aplicar minha ordem para todos" e "Usar ordem da categoria". Arrastar e as
 * 2 opções de ordem não fazem nada aqui. A aba ativa fica sempre visível.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'

export interface PastaDaBarra {
  id: string
  nome: string
  icone: string
  /** Só a pasta de Apontamentos tem. */
  pendentes?: number
  nova?: boolean
}

const props = defineProps<{ t: Textos, pastas: PastaDaBarra[] }>()
const ativa = defineModel<string>('ativa', { required: true })
const emit = defineEmits<{ nova: [], editar: [id: string] }>()

const opcoes = computed<DropdownMenuItem[]>(() => [
  { label: props.t.pastas.editar, icon: 'i-lucide-pencil', onSelect: () => emit('editar', ativa.value) },
  { label: props.t.pastas.ocultar, icon: 'i-lucide-eye-off' },
  { label: props.t.pastas.excluir, icon: 'i-lucide-trash-2', color: 'error' },
])

/* ---------- o que cabe na barra ---------- */
const raiz = ref<HTMLElement | null>(null)
const medidor = ref<HTMLElement | null>(null)
const espaco = ref(Number.POSITIVE_INFINITY)
const larguras = ref<number[]>([])
/** Largura do botão "+N", da seta de opções da aba ativa e do que não é aba (margem e Nova pasta). */
const RESERVA = 72
const SETA = 24
const FIXO = 16 + 44

function medir() {
  if (!medidor.value) return
  larguras.value = [...medidor.value.children].map(el => el.getBoundingClientRect().width)
}
onMounted(() => {
  if (!raiz.value) return
  const ro = new ResizeObserver(([e]) => { espaco.value = (e?.contentRect.width ?? Number.POSITIVE_INFINITY) - FIXO })
  ro.observe(raiz.value)
  medir()
  onBeforeUnmount(() => ro.disconnect())
})
watch(() => props.pastas.map(p => `${p.nome}${p.pendentes ?? ''}`).join('|'), () => nextTick(medir))

const visiveis = computed(() => {
  const ws = props.pastas.map((p, i) => (larguras.value[i] ?? 0) + (p.id === ativa.value ? SETA : 0))
  if (!larguras.value.length || ws.reduce((a, b) => a + b, 0) <= espaco.value) return props.pastas
  let soma = 0
  let n = 0
  for (const w of ws) {
    if (soma + w + RESERVA > espaco.value) break
    soma += w
    n++
  }
  n = Math.max(1, n)
  const lista = props.pastas.slice(0, n)
  const daAtiva = props.pastas.find(p => p.id === ativa.value)
  return daAtiva && !lista.includes(daAtiva) ? [...lista.slice(0, n - 1), daAtiva] : lista
})
const fora = computed(() => props.pastas.filter(p => !visiveis.value.includes(p)))

/* ---------- menu "+N" ---------- */
const menuAberto = ref(false)
const busca = ref('')
watch(menuAberto, (v) => { if (v) busca.value = '' })
const casa = (p: PastaDaBarra) => p.nome.toLocaleLowerCase().includes(busca.value.trim().toLocaleLowerCase())
function escolher(id: string) {
  ativa.value = id
  menuAberto.value = false
}
</script>

<template>
  <div ref="raiz" class="relative flex items-stretch border-b border-default bg-default">
    <!-- Medidor invisível: a largura de cada aba -->
    <div class="pointer-events-none invisible absolute inset-0 overflow-hidden" aria-hidden="true">
      <div ref="medidor" class="flex w-max">
        <span v-for="p in pastas" :key="p.id" class="flex h-10 items-center gap-1.5 px-2.5 text-sm font-medium">
          <span class="size-4" />
          <span class="whitespace-nowrap">{{ p.nome }}</span>
          <span v-if="p.pendentes" class="px-1.5 text-xs tabular-nums">{{ p.pendentes }}</span>
        </span>
      </div>
    </div>

    <nav class="flex min-w-0 flex-1 items-stretch overflow-hidden px-2" role="tablist">
      <div
        v-for="p in visiveis"
        :key="p.id"
        class="relative flex shrink-0 items-center"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="ativa === p.id"
          class="flex h-10 items-center gap-1.5 px-2.5 text-sm transition-colors duration-150"
          :class="ativa === p.id ? 'font-medium text-primary' : 'text-muted hover:text-highlighted'"
          @click="ativa = p.id"
        >
          <UIcon :name="p.icone" class="size-4 shrink-0" />
          <span class="whitespace-nowrap">{{ p.nome }}</span>
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-75" leave-active-class="transition duration-150" leave-to-class="opacity-0 scale-75">
            <UBadge
              v-if="p.pendentes"
              :key="p.pendentes"
              :label="String(p.pendentes)"
              :color="ativa === p.id ? 'primary' : 'neutral'"
              variant="soft"
              size="sm"
              class="tabular-nums"
              :aria-label="t.pastas.pendentes(p.pendentes)"
            />
          </Transition>
        </button>
        <UDropdownMenu v-if="ativa === p.id" :items="opcoes" :content="{ align: 'start' }">
          <UButton icon="i-lucide-chevron-down" color="neutral" variant="ghost" size="xs" class="-ml-1.5 mr-1 text-primary" :aria-label="t.pastas.opcoes" />
        </UDropdownMenu>
        <span
          class="absolute inset-x-1 bottom-0 h-0.5 rounded-full transition-colors duration-150"
          :class="ativa === p.id ? 'bg-primary' : 'bg-transparent'"
          aria-hidden="true"
        />
      </div>
    </nav>

    <!-- "+N": as pastas que não cabem -->
    <UPopover v-if="fora.length" v-model:open="menuAberto" :content="{ align: 'end' }">
      <UButton
        :label="t.pastas.mais(fora.length)"
        trailing-icon="i-lucide-chevron-down"
        color="neutral"
        variant="ghost"
        size="sm"
        class="self-center tabular-nums"
        :aria-label="t.pastas.maisRotulo(fora.length)"
      />
      <template #content>
        <div class="flex w-72 flex-col">
          <div class="border-b border-default p-2">
            <UInput v-model="busca" :placeholder="t.pastas.pesquisar" icon="i-lucide-search" size="sm" variant="ghost" class="w-full" autofocus />
          </div>
          <ul class="flex max-h-64 flex-col overflow-y-auto p-1">
            <template v-for="(grupo, g) in [visiveis.filter(casa), fora.filter(casa)]" :key="g">
              <li v-if="g === 1 && grupo.length" class="flex items-center gap-2 px-2 py-1.5 text-xs text-dimmed" role="presentation">
                <span class="h-px flex-1 bg-accented" />{{ t.pastas.foraDaBarra }}<span class="h-px flex-1 bg-accented" />
              </li>
              <li v-for="p in grupo" :key="p.id">
                <button
                  type="button"
                  class="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-elevated"
                  :class="ativa === p.id ? 'font-medium text-highlighted' : 'text-toned'"
                  @click="escolher(p.id)"
                >
                  <UIcon name="i-lucide-grip-vertical" class="size-3.5 text-dimmed" />
                  <UIcon :name="p.icone" class="size-4 shrink-0" />
                  <span class="min-w-0 flex-1 truncate">{{ p.nome }}</span>
                  <UBadge v-if="p.pendentes" :label="String(p.pendentes)" color="neutral" variant="soft" size="sm" class="tabular-nums" :aria-label="t.pastas.pendentes(p.pendentes)" />
                  <UIcon name="i-lucide-ellipsis" class="size-4 text-dimmed" />
                </button>
              </li>
            </template>
          </ul>
          <div class="flex flex-col border-t border-default p-1">
            <UButton :label="t.pastas.novaPasta" icon="i-lucide-folder-plus" color="neutral" variant="ghost" size="sm" class="justify-start font-medium" @click="menuAberto = false; emit('nova')" />
            <UButton :label="t.pastas.aplicarOrdem" icon="i-lucide-users" color="neutral" variant="ghost" size="sm" class="justify-start" @click="menuAberto = false" />
            <UButton :label="t.pastas.ordemDaCategoria" icon="i-lucide-list-restart" color="neutral" variant="ghost" size="sm" class="justify-start" @click="menuAberto = false" />
          </div>
        </div>
      </template>
    </UPopover>

    <UTooltip :text="t.pastas.novaPasta">
      <UButton icon="i-lucide-folder-plus" color="neutral" variant="ghost" size="sm" class="m-1 self-center" :aria-label="t.pastas.novaPasta" @click="emit('nova')" />
    </UTooltip>
  </div>
</template>

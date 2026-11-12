<script setup lang="ts">
/**
 * Rodada 6: registrar tempo na tarefa, no modo do "Track time" do ClickUp
 * (explorado em 12/11/2026). O campo mostra o play e o total; o play liga o
 * cronômetro ali mesmo, e o resto do campo abre o painel:
 * - o total em todas as tarefas (com as subtarefas) e só nesta;
 * - para quem registrar, o tempo digitado ("3h 20m") ou o cronômetro, a data
 *   e uma nota, com Salvar;
 * - os registros por pessoa, com o total de cada uma; abrir a pessoa mostra os
 *   registros dela, que se excluem.
 * Inventado: o ENSPACE ainda não registra tempo. Fica tudo no array em memória.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Pessoa, RegistroDeTempo, TarefaDoItem } from './mocks'
import type { Textos } from './textos'
import { filhas } from './tarefas'
import { duracao, lerDuracao, minutosDe, relogio } from './tempo'

const props = defineProps<{
  t: Textos
  x: TarefaDoItem
  tarefas: TarefaDoItem[]
  pessoas: Pessoa[]
  quem: number
  somenteLeitura?: boolean
  /** "nova": o valor solto na grade, como no ClickUp; "atual": um campo com borda, como os do formulário. */
  modo?: 'nova' | 'atual'
}>()

const toast = useToast()
const tn = computed(() => props.t.tarefaNova)
const aberto = ref(false)
const pessoa = (id?: number) => props.pessoas.find(p => p.id === id)

/* ---------- o relógio ---------- */
const agora = ref(Date.now())
let tique: ReturnType<typeof setInterval> | undefined
onMounted(() => { tique = setInterval(() => { agora.value = Date.now() }, 1000) })
onBeforeUnmount(() => clearInterval(tique))
const rodando = computed(() => props.x.cronometro ?? null)
const decorrido = computed(() => rodando.value ? agora.value - new Date(rodando.value.inicio).getTime() : 0)

/* ---------- totais ---------- */
const nesta = computed(() => minutosDe(props.x))
const comSubtarefas = computed(() => nesta.value + filhas(props.tarefas, props.x).reduce((a, s) => a + minutosDe(s), 0))
const temSubtarefas = computed(() => !props.x.mae && filhas(props.tarefas, props.x).length > 0)
const porPessoa = computed(() => {
  const m = new Map<number, RegistroDeTempo[]>()
  for (const r of props.x.registros ?? []) m.set(r.quem, [...(m.get(r.quem) ?? []), r])
  return [...m.entries()].map(([quem, rs]) => ({ quem, registros: [...rs].sort((a, b) => +new Date(b.inicio) - +new Date(a.inicio)), total: rs.reduce((a, r) => a + r.minutos, 0) }))
})
const abertas = ref(new Set<number>())
function alternarPessoa(id: number) {
  const s = new Set(abertas.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  abertas.value = s
}

/* ---------- registrar ---------- */
const para = ref(props.quem)
const texto = ref('')
const hojeISO = () => new Date().toISOString().slice(0, 10)
const data = ref(hojeISO())
const nota = ref('')
const minutos = computed(() => lerDuracao(texto.value))
const invalido = computed(() => !!texto.value.trim() && !minutos.value)
const opcoesDePara = computed<DropdownMenuItem[]>(() => props.pessoas.map(p => ({
  label: p.id === props.quem ? `${p.nome} (${tn.value.pessoas.eu})` : p.nome,
  avatar: { text: p.iniciais, alt: p.nome },
  onSelect: () => { para.value = p.id },
})))
let seq = 0
function registrar(min: number, quem: number, inicio: Date, n?: string) {
  ;(props.x.registros ??= []).push({ id: `rt-n${++seq}`, quem, inicio, minutos: min, nota: n || undefined })
  abertas.value = new Set([...abertas.value, quem])
}
function salvar() {
  if (!minutos.value || props.somenteLeitura) return
  registrar(minutos.value, para.value, new Date(`${data.value}T09:00:00`), nota.value.trim())
  toast.add({ title: tn.value.tempo.registrado(duracao(minutos.value)), icon: 'i-lucide-timer', color: 'success', duration: 2500 })
  texto.value = ''
  nota.value = ''
}
function iniciar(quem = para.value) {
  if (props.somenteLeitura) return
  props.x.cronometro = { quem, inicio: new Date() }
  agora.value = Date.now()
}
function parar() {
  const c = rodando.value
  if (!c) return
  const min = Math.max(1, Math.round((Date.now() - new Date(c.inicio).getTime()) / 60000))
  registrar(min, c.quem, new Date(c.inicio))
  props.x.cronometro = null
  toast.add({ title: tn.value.tempo.parado(duracao(min)), icon: 'i-lucide-timer-off', color: 'success', duration: 3000 })
}
const alternarCronometro = () => rodando.value ? parar() : iniciar(props.quem)
function excluir(r: RegistroDeTempo) {
  const lista = props.x.registros ?? []
  const i = lista.indexOf(r)
  lista.splice(i, 1)
  toast.add({ title: tn.value.tempo.excluir, icon: 'i-lucide-trash-2', duration: 4000, actions: [{ label: props.t.tarefaRapida.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { lista.splice(i, 0, r) } }] })
}
const rotuloDoTotal = computed(() => {
  if (!comSubtarefas.value) return tn.value.tempo.iniciar
  return props.x.estimativa ? tn.value.tempo.deEstimativa(duracao(comSubtarefas.value), duracao(props.x.estimativa)) : duracao(comSubtarefas.value)
})
const passouDaEstimativa = computed(() => !!props.x.estimativa && comSubtarefas.value > props.x.estimativa)
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', side: 'bottom', sideOffset: 6, collisionPadding: 12 }" :ui="{ content: 'w-[25rem] max-w-[calc(100vw-2rem)]' }">
    <!-- O campo: o play liga o cronômetro; o resto abre o painel -->
    <div
      role="button"
      tabindex="0"
      class="group/tempo flex min-w-0 cursor-pointer items-center gap-2 text-sm transition-colors"
      :class="modo === 'atual'
        ? 'h-8 rounded-md border border-accented bg-default px-2 hover:border-primary/60'
        : 'min-h-8 w-full rounded-md px-1.5 hover:bg-elevated'"
      :aria-label="tn.campos.tempo"
    >
      <UTooltip :text="rodando ? tn.tempo.pararCronometro : tn.tempo.iniciarCronometro">
        <button
          type="button"
          class="flex size-5 shrink-0 items-center justify-center rounded-full transition-[transform,background-color] hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
          :class="rodando ? 'bg-error text-inverted' : 'bg-inverted/80 text-inverted'"
          :aria-label="rodando ? tn.tempo.pararCronometro : tn.tempo.iniciarCronometro"
          :disabled="somenteLeitura"
          @click.stop="alternarCronometro"
          @keydown.enter.stop
        >
          <UIcon :name="rodando ? 'i-lucide-square' : 'i-lucide-play'" class="size-2.5" :class="rodando ? '' : 'translate-x-px'" />
        </button>
      </UTooltip>
      <span v-if="rodando" class="font-mono text-sm font-medium tabular-nums text-error">{{ relogio(decorrido) }}</span>
      <span v-else class="truncate tabular-nums" :class="comSubtarefas ? (passouDaEstimativa ? 'text-warning' : 'text-highlighted') : 'text-muted'">{{ rotuloDoTotal }}</span>
    </div>

    <template #content>
      <div class="flex flex-col gap-3 p-3">
        <!-- Totais -->
        <div class="flex flex-col gap-1 text-sm">
          <p class="flex items-center justify-between font-medium text-highlighted">
            <span>{{ tn.tempo.total }}</span>
            <span class="tabular-nums">{{ duracao(comSubtarefas) }}</span>
          </p>
          <p v-if="temSubtarefas" class="flex items-center justify-between text-xs text-muted">
            <span class="flex items-center gap-1"><UIcon name="i-lucide-git-branch" class="size-3.5" />{{ tn.tempo.soNesta }}</span>
            <span class="tabular-nums">{{ duracao(nesta) }}</span>
          </p>
        </div>

        <!-- Registrar -->
        <div v-if="!somenteLeitura" class="flex flex-col rounded-lg border border-default">
          <div class="flex items-center gap-2 border-b border-default px-2 py-1.5">
            <span class="text-xs text-muted">{{ tn.tempo.registrarPara }}</span>
            <UDropdownMenu :items="opcoesDePara" :content="{ align: 'start' }">
              <UButton color="neutral" variant="ghost" size="xs" trailing-icon="i-lucide-chevron-down" :avatar="pessoa(para) ? { text: pessoa(para)!.iniciais, alt: pessoa(para)!.nome } : undefined" :label="pessoa(para)?.nome" />
            </UDropdownMenu>
          </div>
          <div class="p-2">
            <div v-if="rodando" class="flex h-9 items-center gap-2 rounded-md bg-error/10 px-2.5">
              <span class="size-2 animate-pulse rounded-full bg-error" aria-hidden="true" />
              <span class="text-sm text-error">{{ tn.tempo.ligado }}</span>
              <span class="text-xs text-muted">{{ pessoa(rodando.quem)?.nome }}</span>
              <span class="ml-auto font-mono text-sm font-medium tabular-nums text-error">{{ relogio(decorrido) }}</span>
              <UButton icon="i-lucide-square" color="error" variant="solid" size="xs" class="rounded-full" :aria-label="tn.tempo.pararCronometro" @click="parar" />
            </div>
            <UInput
              v-else
              v-model="texto"
              :placeholder="tn.tempo.placeholder"
              :color="invalido ? 'error' : 'primary'"
              :highlight="invalido"
              class="w-full"
              :aria-label="tn.tempo.placeholder"
              :ui="{ trailing: 'pe-1' }"
              @keydown.enter.prevent="salvar"
            >
              <template #trailing>
                <UTooltip :text="tn.tempo.iniciarCronometro">
                  <UButton icon="i-lucide-play" color="neutral" variant="soft" size="xs" class="rounded-full" :aria-label="tn.tempo.iniciarCronometro" @click="iniciar()" />
                </UTooltip>
              </template>
            </UInput>
            <p v-if="invalido" class="mt-1 text-xs text-error">{{ tn.tempo.invalido }}</p>
          </div>
          <div class="flex flex-col gap-1.5 border-t border-default px-2 py-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-calendar" class="size-4 shrink-0 text-muted" />
              <UInput v-model="data" type="date" size="xs" variant="ghost" class="w-40" :aria-label="tn.tempo.data" />
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-align-left" class="size-4 shrink-0 text-muted" />
              <UInput v-model="nota" :placeholder="tn.tempo.nota" size="xs" variant="ghost" class="flex-1" :aria-label="tn.tempo.nota" @keydown.enter.prevent="salvar" />
            </div>
          </div>
          <div class="flex justify-end border-t border-default px-2 py-1.5">
            <UButton :label="tn.tempo.salvar" size="xs" :disabled="!minutos" @click="salvar" />
          </div>
        </div>

        <!-- Registros, por pessoa -->
        <div class="flex flex-col gap-1">
          <p class="text-xs font-medium text-muted">{{ tn.tempo.registros }}</p>
          <p v-if="!porPessoa.length" class="py-1 text-sm text-dimmed">{{ tn.tempo.nenhum }}</p>
          <div v-for="g in porPessoa" :key="g.quem" class="flex flex-col">
            <button type="button" class="flex items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm transition-colors hover:bg-elevated" :aria-expanded="abertas.has(g.quem)" @click="alternarPessoa(g.quem)">
              <UIcon name="i-lucide-chevron-right" class="size-3.5 text-muted transition-transform duration-200" :class="abertas.has(g.quem) ? 'rotate-90' : ''" />
              <UAvatar v-if="pessoa(g.quem)" :text="pessoa(g.quem)!.iniciais" :alt="pessoa(g.quem)!.nome" size="2xs" />
              <span class="min-w-0 flex-1 truncate text-highlighted">{{ pessoa(g.quem)?.nome }}</span>
              <span class="tabular-nums text-muted">{{ duracao(g.total) }}</span>
            </button>
            <ul v-show="abertas.has(g.quem)" class="ml-7 flex flex-col">
              <li v-for="r in g.registros" :key="r.id" class="group/registro flex items-center gap-2 rounded-md px-1.5 py-1 text-xs [animation:entrada_.2s_ease-out_both]">
                <span class="w-16 shrink-0 text-muted">{{ t.data(new Date(r.inicio)) }}</span>
                <span class="min-w-0 flex-1 truncate text-default">{{ r.nota }}</span>
                <span class="tabular-nums text-highlighted">{{ duracao(r.minutos) }}</span>
                <UButton v-if="!somenteLeitura" icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" class="opacity-0 transition-opacity focus-visible:opacity-100 group-hover/registro:opacity-100" :aria-label="tn.tempo.excluir" @click="excluir(r)" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>

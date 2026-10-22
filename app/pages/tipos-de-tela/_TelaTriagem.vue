<script setup lang="ts">
/**
 * MÓDULO REQUISIÇÕES · TRIAGEM.
 *
 * Substitui o tipo legado Triagem, que mostrava a mesma tela de Minhas
 * Requisições (U2) e que um cliente não consegue usar porque a lista não
 * mostra o assunto de cada item (USE22BCACC2). Absorve as telas nativas
 * escondidas Screening e Received Emails.
 *
 * O padrão é o Record review do Airtable e o Inbox do Softr: lista à
 * esquerda, detalhe à direita, botão de decisão. O que nenhum dos 2 faz, e
 * esta tela faz:
 *   - atalho de teclado (J e K andam, A aprova, R reprova, I pede informação);
 *   - lote com trava: só requisições do mesmo formulário entram juntas.
 *
 * Reprovar e pedir informação pedem justificativa: o solicitante recebe o
 * texto. Decidir passa para a próxima, e o aviso traz "Desfazer".
 */
import { HOJE, formularioPorId, membroPorId, type Requisicao } from './mocks'
import { dataEHora, relativo } from './formatar'
import { useTiposDeTela } from './estado'
import CabecalhoDaTela from './_CabecalhoDaTela.vue'
import EstadoDaTela from './_EstadoDaTela.vue'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ tentarDeNovo: [] }>()

const { cenario, triagem } = useTiposDeTela()
const idioma = useIdioma()
const toast = useToast()

type Aba = 'pendentes' | 'revisao' | 'decididas'
const aba = ref<Aba>('pendentes')
const busca = ref('')

/** A decisão de cada uma, para a aba Decididas e para o Desfazer. */
const decisoes = ref<Record<number, 'aprovou' | 'reprovou'>>({})

function daAba(r: Requisicao, a: Aba) {
  if (a === 'pendentes') return r.etapa === 'em_triagem'
  if (a === 'revisao') return r.etapa === 'revisao_pedida'
  return !!decisoes.value[r.id]
}

const lista = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return triagem.value
    .filter(r => daAba(r, aba.value))
    .filter(r => !q || r.assunto.toLowerCase().includes(q) || r.numero.toLowerCase().includes(q) || (membroPorId(r.solicitante)?.nome ?? '').toLowerCase().includes(q))
    .sort((a, b) => a.abertaEm.getTime() - b.abertaEm.getTime())
})

const contagem = computed(() => ({
  pendentes: triagem.value.filter(r => daAba(r, 'pendentes')).length,
  revisao: triagem.value.filter(r => daAba(r, 'revisao')).length,
  decididas: triagem.value.filter(r => daAba(r, 'decididas')).length,
}))
const abas = computed(() => (['pendentes', 'revisao', 'decididas'] as Aba[]).map(a => ({
  value: a,
  label: props.t.triagem.abas[a],
  badge: { label: String(contagem.value[a]), color: 'neutral' as const, variant: 'soft' as const },
})))

const atualId = ref<number | null>(null)
const atual = computed(() => lista.value.find(r => r.id === atualId.value) ?? null)

watch(lista, (l) => {
  if (!l.some(r => r.id === atualId.value)) atualId.value = l[0]?.id ?? null
}, { immediate: true })
watch(aba, () => { marcados.value = [] })

function mover(passo: number) {
  const l = lista.value
  if (!l.length) return
  const i = Math.max(0, l.findIndex(r => r.id === atualId.value))
  atualId.value = l[Math.min(l.length - 1, Math.max(0, i + passo))]!.id
  nextTick(() => document.getElementById(`triagem-${atualId.value}`)?.scrollIntoView({ block: 'nearest' }))
}

/* ---------------- decidir: uma ou o lote ---------------- */

const marcados = ref<number[]>([])
const formularioDoLote = computed(() => {
  const primeiro = triagem.value.find(r => r.id === marcados.value[0])
  return primeiro ? formularioPorId(primeiro.formulario) : null
})

function marcar(r: Requisicao, v: boolean | 'indeterminate') {
  if (!v) {
    marcados.value = marcados.value.filter(id => id !== r.id)
    return
  }
  const f = formularioDoLote.value
  if (f && f.id !== r.formulario) {
    toast.add({ title: props.t.triagem.loteTrava(f.nome), icon: 'i-lucide-lock', color: 'warning' })
    return
  }
  marcados.value = [...marcados.value, r.id]
}

const pedindo = ref<{ acao: 'reprovou' | 'pediuRevisao', ids: number[] } | null>(null)
const justificativa = ref('')
const tentouSem = ref(false)

function decidir(acao: 'aprovou' | 'reprovou' | 'pediuRevisao', ids: number[]) {
  if (!ids.length) return
  if (acao !== 'aprovou') {
    justificativa.value = ''
    tentouSem.value = false
    pedindo.value = { acao, ids }
    return
  }
  aplicar('aprovou', ids)
}

function confirmarPedido() {
  if (!pedindo.value) return
  if (!justificativa.value.trim()) {
    tentouSem.value = true
    return
  }
  aplicar(pedindo.value.acao, pedindo.value.ids, justificativa.value.trim())
  pedindo.value = null
}

function aplicar(acao: 'aprovou' | 'reprovou' | 'pediuRevisao', ids: number[], texto?: string) {
  // Decidir passa para a próxima da lista, não volta para o topo.
  const indice = Math.max(0, lista.value.findIndex(r => r.id === atualId.value))
  const antes = ids.map((id) => {
    const r = triagem.value.find(x => x.id === id)!
    return { r, etapa: r.etapa, hist: r.historico.length, com: r.comentarios.length }
  })
  for (const { r } of antes) {
    r.historico.push({ quando: new Date(HOJE), quem: 1, oQue: acao })
    if (texto) r.comentarios.push({ quando: new Date(HOJE), quem: 1, texto })
    r.atualizadaEm = new Date(HOJE)
    if (acao === 'aprovou') {
      r.etapa = 'em_atendimento'
      r.responsavel = 5
      decisoes.value[r.id] = 'aprovou'
    }
    else if (acao === 'reprovou') {
      r.etapa = 'reprovada'
      decisoes.value[r.id] = 'reprovou'
    }
    else {
      r.etapa = 'revisao_pedida'
    }
  }
  marcados.value = []
  const restantes = lista.value
  atualId.value = restantes[Math.min(indice, restantes.length - 1)]?.id ?? null
  const desfazer = () => {
    for (const a of antes) {
      a.r.etapa = a.etapa
      a.r.historico.splice(a.hist)
      a.r.comentarios.splice(a.com)
      delete decisoes.value[a.r.id]
    }
  }
  const numero = antes[0]!.r.numero
  const titulo = antes.length > 1
    ? props.t.triagem.lotesDecididos(antes.length)
    : acao === 'aprovou' ? props.t.triagem.aprovada(numero) : acao === 'reprovou' ? props.t.triagem.reprovadaToast(numero) : props.t.triagem.revisaoToast(numero)
  toast.add({
    title: titulo,
    icon: acao === 'aprovou' ? 'i-lucide-check' : acao === 'reprovou' ? 'i-lucide-x' : 'i-lucide-message-circle-question',
    color: 'success',
    actions: [{ label: props.t.comum.desfazer, color: 'neutral', variant: 'outline', onClick: desfazer }],
  })
}

/* ---------------- teclado ---------------- */

function aoTeclar(e: KeyboardEvent) {
  const alvo = e.target as HTMLElement | null
  if (pedindo.value || cenario.value !== 'cheio') return
  if (alvo && (alvo.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'))) return
  if (e.ctrlKey || e.metaKey || e.altKey) return
  const k = e.key.toLowerCase()
  if (k === 'j' || e.key === 'ArrowDown') { e.preventDefault(); mover(1) }
  else if (k === 'k' || e.key === 'ArrowUp') { e.preventDefault(); mover(-1) }
  else if (aba.value !== 'decididas' && atual.value) {
    if (k === 'a') { e.preventDefault(); decidir('aprovou', [atual.value.id]) }
    else if (k === 'r') { e.preventDefault(); decidir('reprovou', [atual.value.id]) }
    else if (k === 'i') { e.preventDefault(); decidir('pediuRevisao', [atual.value.id]) }
  }
}
onMounted(() => window.addEventListener('keydown', aoTeclar))
onBeforeUnmount(() => window.removeEventListener('keydown', aoTeclar))

const atalhos = computed(() => [
  { teclas: ['J', 'K'], rotulo: `${props.t.triagem.proxima} · ${props.t.triagem.anterior}` },
  { teclas: ['A'], rotulo: props.t.triagem.aprovar },
  { teclas: ['R'], rotulo: props.t.triagem.reprovar },
  { teclas: ['I'], rotulo: props.t.triagem.pedirRevisao },
])

function prazoSla(r: Requisicao) {
  const f = formularioPorId(r.formulario)
  const dias = Math.floor((HOJE.getTime() - r.abertaEm.getTime()) / 86_400_000)
  return dias >= f.prazoDias ? 'error' : dias >= f.prazoDias - 1 ? 'warning' : 'neutral'
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <CabecalhoDaTela
      icone="i-lucide-list-filter"
      :titulo="t.triagem.titulo"
      :descricao="t.triagem.descricao"
      :substitui="['Triagem', 'telas nativas escondidas Screening e Received Emails']"
      nativo="quem-responde"
      onde="Módulo Requisições: aparece para quem responde por um formulário com triagem."
    />

    <EstadoDaTela :t="t" :cenario="cenario" forma="divisao" @tentar-de-novo="emit('tentarDeNovo')">
      <template #vazio>
        <UEmpty icon="i-lucide-inbox" :title="t.triagem.vazioTitulo" :description="t.triagem.vazioTexto" />
      </template>

      <div class="flex flex-wrap items-center gap-3 border-b border-default px-6 py-3">
        <UTabs v-model="aba" :items="abas" :content="false" size="sm" variant="pill" color="neutral" />
        <span class="ml-auto hidden items-center gap-3 text-xs text-muted xl:flex">
          <span class="font-medium">{{ t.triagem.atalhos }}</span>
          <span v-for="a in atalhos" :key="a.rotulo" class="flex items-center gap-1">
            <UKbd v-for="k in a.teclas" :key="k" :value="k" size="sm" />{{ a.rotulo }}
          </span>
        </span>
      </div>

      <div class="grid min-h-0 flex-1 md:grid-cols-[22rem_1fr]">
        <!-- A lista: assunto, solicitante, formulário, origem e prazo à vista -->
        <div class="flex min-h-0 flex-col border-r border-default">
          <div class="border-b border-default p-3">
            <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.comum.buscar" size="sm" class="w-full" :aria-label="t.comum.buscar" />
          </div>
          <p v-if="!lista.length" class="p-6 text-center text-sm text-muted">{{ t.triagem.vazioTitulo }}</p>
          <TransitionGroup tag="ul" class="min-h-0 flex-1 overflow-auto" role="listbox" :aria-label="t.triagem.titulo" move-class="transition duration-200" leave-active-class="transition duration-150 absolute w-full" leave-to-class="opacity-0 -translate-x-2">
            <li
              v-for="r in lista"
              :id="`triagem-${r.id}`"
              :key="r.id"
              role="option"
              :aria-selected="r.id === atualId"
              class="relative flex cursor-pointer gap-3 border-b border-default px-3 py-3 transition-colors"
              :class="r.id === atualId ? 'bg-primary/5 shadow-[inset_3px_0_0_var(--ui-primary)]' : 'hover:bg-elevated/60'"
              @click="atualId = r.id"
            >
              <UCheckbox
                v-if="aba !== 'decididas'"
                :model-value="marcados.includes(r.id)"
                :aria-label="`${t.triagem.selecionar} ${r.numero}`"
                class="pt-0.5"
                @click.stop
                @update:model-value="(v) => marcar(r, v)"
              />
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-1.5">
                  <UIcon :name="r.origem === 'email' ? 'i-lucide-mail' : 'i-lucide-file-text'" class="size-3.5 shrink-0 text-muted" :aria-label="t.triagem.origens[r.origem]" />
                  <span class="truncate text-sm font-medium text-highlighted">{{ r.assunto }}</span>
                </span>
                <span class="mt-0.5 block truncate text-xs text-muted">{{ membroPorId(r.solicitante)?.nome }} · {{ formularioPorId(r.formulario).nome }}</span>
                <span class="mt-1 flex items-center gap-2">
                  <span class="font-mono text-[11px] text-dimmed">{{ r.numero }}</span>
                  <UBadge v-if="decisoes[r.id]" :label="t.triagem.decisao[decisoes[r.id]!]" :color="decisoes[r.id] === 'aprovou' ? 'success' : 'error'" variant="subtle" size="sm" />
                  <UBadge v-else :label="relativo(r.abertaEm, HOJE, idioma)" :color="prazoSla(r)" variant="soft" size="sm" />
                </span>
              </span>
            </li>
          </TransitionGroup>
        </div>

        <!-- O detalhe -->
        <div class="relative min-h-0 overflow-auto pb-24">
          <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-x-1" leave-active-class="transition duration-100" leave-to-class="opacity-0">
            <div v-if="atual" :key="atual.id" class="space-y-6 p-6">
              <div>
                <p class="font-mono text-xs text-muted">{{ atual.numero }} · {{ formularioPorId(atual.formulario).nome }}</p>
                <h2 class="mt-1 text-lg font-semibold text-highlighted">{{ atual.assunto }}</h2>
                <dl class="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <div class="flex gap-1.5"><dt class="text-muted">{{ t.triagem.solicitante }}:</dt><dd class="text-highlighted">{{ membroPorId(atual.solicitante)?.nome }}</dd></div>
                  <div class="flex gap-1.5"><dt class="text-muted">{{ t.triagem.recebida }}:</dt><dd class="text-highlighted">{{ dataEHora(atual.abertaEm, idioma) }}</dd></div>
                  <div class="flex items-center gap-1.5"><dt class="sr-only">{{ t.minhas.origem }}</dt><dd><UBadge :label="t.triagem.origens[atual.origem]" :icon="atual.origem === 'email' ? 'i-lucide-mail' : 'i-lucide-file-text'" color="neutral" variant="subtle" size="sm" /></dd></div>
                </dl>
              </div>

              <section v-if="atual.origem === 'email'" class="rounded-lg border border-default bg-elevated/40 p-4">
                <h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{{ t.triagem.mensagem }}</h3>
                <p class="whitespace-pre-line text-sm text-default">{{ atual.respostas.email }}</p>
              </section>
              <section v-else>
                <h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{{ t.triagem.respostas }}</h3>
                <dl class="divide-y divide-default rounded-lg border border-default">
                  <template v-for="c in formularioPorId(atual.formulario).campos" :key="c.chave">
                    <div v-if="atual.respostas[c.chave]" class="grid gap-1 px-4 py-2.5 sm:grid-cols-[12rem_1fr]">
                      <dt class="text-xs text-muted">{{ c.rotulo }}</dt>
                      <dd class="text-sm text-highlighted">{{ atual.respostas[c.chave] }}</dd>
                    </div>
                  </template>
                </dl>
              </section>

              <section v-if="atual.comentarios.length" class="space-y-2">
                <div v-for="(c, i) in atual.comentarios" :key="i" class="rounded-md border border-default px-3 py-2 text-sm">
                  <p class="text-xs text-muted">{{ membroPorId(c.quem)?.nome }} · {{ dataEHora(c.quando, idioma) }}</p>
                  <p class="text-default">{{ c.texto }}</p>
                </div>
              </section>

              <div v-if="aba !== 'decididas'" class="flex flex-wrap items-center gap-2 border-t border-default pt-4">
                <UButton :label="t.triagem.aprovar" icon="i-lucide-check" color="primary" @click="decidir('aprovou', [atual.id])">
                  <template #trailing><UKbd value="A" size="sm" /></template>
                </UButton>
                <UButton :label="t.triagem.pedirRevisao" icon="i-lucide-message-circle-question" color="neutral" variant="outline" @click="decidir('pediuRevisao', [atual.id])">
                  <template #trailing><UKbd value="I" size="sm" /></template>
                </UButton>
                <UButton :label="t.triagem.reprovar" icon="i-lucide-x" color="error" variant="outline" @click="decidir('reprovou', [atual.id])">
                  <template #trailing><UKbd value="R" size="sm" /></template>
                </UButton>
              </div>
            </div>
            <div v-else key="nada" class="flex h-full items-center justify-center p-10">
              <UEmpty icon="i-lucide-mouse-pointer-click" :description="t.triagem.nadaSelecionado" />
            </div>
          </Transition>

          <!-- A barra do lote -->
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-4 opacity-0" leave-active-class="transition duration-150" leave-to-class="translate-y-4 opacity-0">
            <div v-if="marcados.length && formularioDoLote" class="sticky bottom-20 mx-6 flex flex-wrap items-center gap-3 rounded-lg border border-default bg-default px-4 py-3 shadow-lg">
              <span class="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary tabular-nums">{{ marcados.length }}</span>
              <span class="min-w-0 flex-1 text-sm font-medium text-highlighted">{{ t.triagem.lote(marcados.length, formularioDoLote.nome) }}</span>
              <UButton :label="t.fila.removerSelecao" color="neutral" variant="ghost" size="sm" @click="marcados = []" />
              <UButton :label="t.triagem.reprovarLote(marcados.length)" icon="i-lucide-x" color="error" variant="outline" size="sm" @click="decidir('reprovou', marcados)" />
              <UButton :label="t.triagem.aprovarLote(marcados.length)" icon="i-lucide-check" color="primary" size="sm" @click="decidir('aprovou', marcados)" />
            </div>
          </Transition>
        </div>
      </div>
    </EstadoDaTela>

    <!-- Justificativa: reprovar e pedir informação -->
    <UModal
      :open="!!pedindo"
      :title="pedindo?.acao === 'reprovou' ? t.triagem.reprovar : t.triagem.pedirRevisao"
      :description="pedindo?.acao === 'reprovou' ? t.triagem.justificativaReprovar : t.triagem.justificativaRevisao"
      @update:open="(v) => { if (!v) pedindo = null }"
    >
      <template #body>
        <UFormField :label="t.triagem.justificativa" required :error="tentouSem ? t.abrir.campoObrigatorio : undefined">
          <UTextarea v-model="justificativa" :placeholder="t.triagem.justificativaPlaceholder" :rows="3" autoresize autofocus class="w-full" />
        </UFormField>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="pedindo = null" />
          <UButton
            :label="pedindo?.acao === 'reprovou' ? t.triagem.confirmarReprovar : t.triagem.confirmarRevisao"
            :color="pedindo?.acao === 'reprovou' ? 'error' : 'primary'"
            @click="confirmarPedido"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

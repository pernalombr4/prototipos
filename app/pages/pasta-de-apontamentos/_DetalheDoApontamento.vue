<script setup lang="ts">
/**
 * O detalhe de um apontamento. Proposta.
 *
 * Cabeçalho com estado, de quem é a vez e a ação principal do papel; os campos
 * (responsável, prioridade, rodada, autor); o corpo em texto rico; os anexos
 * (print abre em tela cheia, arquivo e link em linha); a conversa do
 * apontamento e o histórico de estados, com a rodada de cada mudança.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Anexo, Apontamento } from './mocks'
import type { Lista } from './lista'
import type { Textos } from './textos'
import CampoRico from './_CampoRico.vue'
import { iconeDaPrioridade, pessoa, podeConferir, podeDescartar, podeDesmarcar, podeReabrir, podeResolver, responder, rotuloDoEstado, vezDe, visualDoEstado } from './lista'

const props = defineProps<{
  t: Textos
  lista: Lista
  a: Apontamento
  quem: number
  somenteLeitura: boolean
  compacto?: boolean
}>()

const emit = defineEmits<{
  resolver: []
  desmarcar: []
  conferir: []
  reabrir: []
  descartar: []
  converter: []
  excluir: []
  copiarLink: []
  fechar: []
}>()

const toast = useToast()

const visual = computed(() => visualDoEstado[props.a.estado])
const rotulo = (e: Apontamento['estado']) => rotuloDoEstado(props.lista.config, e, props.t.estados, props.t.locale)
const nome = (id: number) => pessoa(props.lista, id)?.nome ?? ''
const vez = computed(() => {
  const id = vezDe(props.a, props.lista.config)
  return id ? pessoa(props.lista, id) : undefined
})

const ro = computed(() => props.somenteLeitura)
const acoes = computed(() => ({
  resolver: !ro.value && podeResolver(props.a, props.quem),
  desmarcar: !ro.value && podeDesmarcar(props.a, props.quem, props.lista.config),
  conferir: !ro.value && podeConferir(props.a, props.quem, props.lista.config),
  reabrir: !ro.value && podeReabrir(props.a, props.quem),
  descartar: !ro.value && podeDescartar(props.a, props.quem),
}))

const menu = computed<DropdownMenuItem[][]>(() => [
  [
    { label: props.t.apontamento.copiarLink, icon: 'i-lucide-link', onSelect: () => emit('copiarLink') },
    { label: props.t.apontamento.converterEmTarefa, icon: 'i-lucide-clipboard-plus', disabled: ro.value, onSelect: () => emit('converter') },
  ],
  [
    { label: props.t.apontamento.descartar, icon: 'i-lucide-circle-slash', disabled: !acoes.value.descartar, onSelect: () => emit('descartar') },
    { label: props.t.apontamento.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, disabled: ro.value || props.a.autor !== props.quem, onSelect: () => emit('excluir') },
  ],
])

/* ---------- campos ---------- */
const opcoesDePessoa = computed(() => props.lista.pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais, alt: p.nome } })))
const opcoesDePrioridade = computed(() => (['low', 'normal', 'high', 'urgent'] as const).map(p => ({ label: props.t.prioridades[p], value: p, icon: iconeDaPrioridade[p] })))

/* ---------- corpo ---------- */
const editando = ref(false)
const rascunhoDoCorpo = ref('')
const rascunhoDoTitulo = ref('')
function editar() {
  rascunhoDoCorpo.value = props.a.corpo
  rascunhoDoTitulo.value = props.a.titulo
  editando.value = true
}
function salvarCorpo() {
  props.a.corpo = rascunhoDoCorpo.value
  props.a.titulo = rascunhoDoTitulo.value.trim() || props.a.titulo
  editando.value = false
}
watch(() => props.a.id, () => { editando.value = false; resposta.value = '' })

/* ---------- anexos ---------- */
const imagens = computed(() => props.a.anexos.filter(x => x.tipo === 'imagem'))
const outros = computed(() => props.a.anexos.filter(x => x.tipo !== 'imagem'))
const ampliada = ref<Anexo | null>(null)
const iconeDoArquivo = (n: string) => n.endsWith('.json') ? 'i-lucide-file-json' : n.endsWith('.pdf') ? 'i-lucide-file-text' : n.endsWith('.docx') ? 'i-lucide-file-type' : 'i-lucide-file'
const entradaDeArquivo = ref<HTMLInputElement | null>(null)

/** Lê o arquivo escolhido no navegador. Imagem vira endereço local; nada vai para a rede. */
function anexar(e: Event) {
  const arquivos = (e.target as HTMLInputElement).files
  if (!arquivos) return
  for (const f of Array.from(arquivos)) {
    const imagem = f.type.startsWith('image/')
    props.a.anexos.push({
      id: `an-${Date.now()}-${f.name}`,
      tipo: imagem ? 'imagem' : 'arquivo',
      nome: f.name,
      url: imagem ? URL.createObjectURL(f) : undefined,
      tamanho: `${Math.max(1, Math.round(f.size / 1024))} KB`,
    })
  }
  ;(e.target as HTMLInputElement).value = ''
}
function baixar(x: Anexo) {
  toast.add({ title: props.t.apontamento.baixar(x.nome), icon: 'i-lucide-download', duration: 2000 })
}

/* ---------- conversa ---------- */
const resposta = ref('')
const enviando = ref(false)
async function enviarResposta() {
  const texto = resposta.value.trim()
  if (!texto) return
  enviando.value = true
  await new Promise(r => setTimeout(r, 300))
  responder(props.a, props.quem, texto)
  resposta.value = ''
  enviando.value = false
}

/* ---------- histórico ---------- */
const linhaDoTempo = computed(() => [...props.a.historico].reverse().map(e => ({
  value: e.id,
  date: `${props.t.dataHora(e.quando)} · ${props.t.lista.rodadaCurta(e.rodada)}`,
  title: !e.de
    ? (e.para === 'rascunho' ? props.t.apontamento.eventos.rascunho(nome(e.quem)) : props.t.apontamento.eventos.criou(nome(e.quem)))
    : props.t.apontamento.eventos.mudou(nome(e.quem), rotulo(e.para)),
  description: e.nota,
  icon: visualDoEstado[e.para].icone,
})))
</script>

<template>
  <article class="flex h-full min-h-0 flex-col bg-default">
    <!-- Cabeçalho -->
    <header class="flex flex-col gap-3 border-b border-default px-5 py-4">
      <div class="flex items-start gap-2">
        <div class="min-w-0 flex-1">
          <p class="font-mono text-xs text-dimmed">#{{ a.numero }}</p>
          <UInput v-if="editando" v-model="rascunhoDoTitulo" class="mt-1 w-full" size="lg" :aria-label="t.novo.titulo" />
          <h3 v-else class="mt-0.5 text-lg font-semibold leading-snug text-highlighted">{{ a.titulo }}</h3>
        </div>
        <UDropdownMenu :items="menu" :content="{ align: 'end' }">
          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="sm" :aria-label="t.apontamento.maisAcoes" />
        </UDropdownMenu>
        <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.apontamento.fechar" @click="emit('fechar')" />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UBadge :label="rotulo(a.estado)" :icon="visual.icone" :color="visual.cor" :variant="visual.variante" />
        <span v-if="a.reaberturas" class="flex items-center gap-1 text-xs text-error">
          <UIcon name="i-lucide-rotate-ccw" class="size-3.5" />{{ t.apontamento.reaberturas(a.reaberturas) }}
        </span>
        <span v-if="vez" class="flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-arrow-right-circle" class="size-3.5" />{{ t.apontamento.vezDe(vez.nome) }}
        </span>
      </div>

      <!-- A ação do papel, em destaque -->
      <div v-if="acoes.resolver || acoes.desmarcar || acoes.conferir || acoes.reabrir" class="flex flex-wrap gap-2">
        <UButton v-if="acoes.resolver" :label="t.apontamento.marcarResolvido" icon="i-lucide-check" color="success" @click="emit('resolver')" />
        <UButton v-if="acoes.conferir" :label="t.apontamento.conferir" icon="i-lucide-badge-check" color="success" @click="emit('conferir')" />
        <UButton v-if="acoes.reabrir" :label="t.apontamento.reabrir" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" @click="emit('reabrir')" />
        <UButton v-if="acoes.desmarcar" :label="t.apontamento.desmarcar" icon="i-lucide-undo-2" color="neutral" variant="outline" @click="emit('desmarcar')" />
      </div>

      <UAlert
        v-if="a.estado === 'descartado' && a.motivo"
        :title="t.apontamento.motivoDescarte"
        :description="a.motivo"
        icon="i-lucide-circle-slash"
        color="neutral"
        variant="subtle"
      />
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <!-- Campos -->
      <dl class="grid gap-x-4 gap-y-3 border-b border-default px-5 py-4 text-sm" :class="compacto ? 'grid-cols-1' : 'grid-cols-2'">
        <div class="flex flex-col gap-1">
          <dt class="text-xs font-medium text-muted">{{ t.apontamento.responsavel }}</dt>
          <dd>
            <USelectMenu
              v-model="a.responsavel"
              :items="opcoesDePessoa"
              value-key="value"
              :disabled="ro"
              :search-input="false"
              size="sm"
              class="w-full"
              :avatar="opcoesDePessoa.find(o => o.value === a.responsavel)?.avatar"
            />
          </dd>
        </div>
        <div class="flex flex-col gap-1">
          <dt class="text-xs font-medium text-muted">{{ t.apontamento.prioridade }}</dt>
          <dd>
            <USelect
              v-model="a.prioridade"
              :items="opcoesDePrioridade"
              :disabled="ro"
              size="sm"
              class="w-full"
              :icon="iconeDaPrioridade[a.prioridade]"
            />
          </dd>
        </div>
        <div class="flex flex-col gap-1">
          <dt class="text-xs font-medium text-muted">{{ t.apontamento.rodada }}</dt>
          <dd class="text-highlighted">{{ t.lista.rodada(a.rodada) }}</dd>
        </div>
        <div class="flex flex-col gap-1">
          <dt class="text-xs font-medium text-muted">{{ t.apontamento.criadoPor }}</dt>
          <dd class="flex items-center gap-1.5 text-highlighted">
            {{ nome(a.autor) }} <span class="text-xs text-muted">{{ t.dataHora(a.criadoEm) }}</span>
          </dd>
        </div>
      </dl>

      <!-- Corpo -->
      <section class="border-b border-default px-5 py-4">
        <div v-if="editando" class="flex flex-col gap-2">
          <CampoRico v-model="rascunhoDoCorpo" autofocus />
          <div class="flex justify-end gap-2">
            <UButton :label="t.apontamento.cancelar" color="neutral" variant="ghost" size="sm" @click="editando = false" />
            <UButton :label="t.apontamento.salvar" size="sm" @click="salvarCorpo" />
          </div>
        </div>
        <div v-else class="group/corpo relative">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="corpo text-sm leading-relaxed text-default *:my-1.5 [&_code]:rounded [&_code]:bg-elevated [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_strong]:text-highlighted" v-html="a.corpo" />
          <UButton
            v-if="!ro && a.autor === quem"
            :label="t.apontamento.editar"
            icon="i-lucide-pencil"
            color="neutral"
            variant="outline"
            size="xs"
            class="absolute -top-1 right-0 opacity-0 transition-opacity group-hover/corpo:opacity-100 focus-visible:opacity-100"
            @click="editar"
          />
        </div>
      </section>

      <!-- Anexos -->
      <section class="flex flex-col gap-3 border-b border-default px-5 py-4">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.apontamento.anexos }} · {{ a.anexos.length }}</h4>
          <template v-if="!ro">
            <input ref="entradaDeArquivo" type="file" multiple class="sr-only" :aria-label="t.novo.anexar" @change="anexar">
            <UButton :label="t.novo.anexar" icon="i-lucide-paperclip" color="neutral" variant="outline" size="xs" @click="entradaDeArquivo?.click()" />
          </template>
        </div>
        <p v-if="!a.anexos.length" class="text-sm text-dimmed">{{ t.apontamento.semAnexos }}</p>
        <div v-if="imagens.length" class="grid gap-2" :class="compacto ? 'grid-cols-2' : 'grid-cols-3'">
          <button
            v-for="x in imagens"
            :key="x.id"
            type="button"
            class="group/img relative aspect-video overflow-hidden rounded-md border border-default bg-elevated transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
            :aria-label="t.apontamento.abrirImagem(x.nome)"
            @click="ampliada = x"
          >
            <img :src="x.url" :alt="x.nome" class="size-full object-cover object-left-top transition-transform duration-200 group-hover/img:scale-105">
            <span class="absolute inset-x-0 bottom-0 truncate bg-default/85 px-2 py-1 text-left text-[11px] text-toned">{{ x.nome }}</span>
          </button>
        </div>
        <ul v-if="outros.length" class="flex flex-col divide-y divide-default rounded-md border border-default">
          <li v-for="x in outros" :key="x.id" class="flex items-center gap-2.5 px-3 py-2 text-sm">
            <UIcon :name="x.tipo === 'link' ? 'i-lucide-video' : iconeDoArquivo(x.nome)" class="size-4 shrink-0 text-muted" />
            <span class="min-w-0 flex-1 truncate text-highlighted">{{ x.nome }}</span>
            <span v-if="x.tamanho" class="text-xs text-dimmed">{{ x.tamanho }}</span>
            <UButton
              v-if="x.tipo === 'link'"
              icon="i-lucide-external-link"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="x.nome"
              @click="baixar(x)"
            />
            <UButton v-else icon="i-lucide-download" color="neutral" variant="ghost" size="xs" :aria-label="t.apontamento.baixar(x.nome)" @click="baixar(x)" />
          </li>
        </ul>
      </section>

      <!-- Conversa -->
      <section class="flex flex-col gap-3 border-b border-default px-5 py-4">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.apontamento.conversa }} · {{ a.respostas.length }}</h4>
        <p v-if="!a.respostas.length" class="text-sm text-dimmed">{{ t.apontamento.semConversa }}</p>
        <TransitionGroup tag="ul" class="flex flex-col gap-3" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1">
          <li v-for="r in a.respostas" :key="r.id" class="flex gap-2.5">
            <UAvatar :text="pessoa(lista, r.autor)?.iniciais" :alt="nome(r.autor)" size="xs" class="mt-0.5" />
            <div class="min-w-0 flex-1 rounded-md bg-elevated/60 px-3 py-2">
              <p class="flex items-baseline gap-2 text-xs">
                <span class="font-semibold text-highlighted">{{ nome(r.autor) }}</span>
                <span class="text-dimmed">{{ t.dataHora(r.quando) }}</span>
              </p>
              <p class="mt-0.5 text-sm text-default">{{ r.texto }}</p>
            </div>
          </li>
        </TransitionGroup>
        <form v-if="!ro" class="flex flex-col gap-2" @submit.prevent="enviarResposta">
          <UTextarea v-model="resposta" :placeholder="t.apontamento.respostaPlaceholder" :rows="2" autoresize class="w-full" @keydown.ctrl.enter="enviarResposta" />
          <UButton type="submit" :label="t.apontamento.responder" size="sm" color="neutral" variant="outline" class="self-end" :loading="enviando" :disabled="!resposta.trim()" />
        </form>
      </section>

      <!-- Histórico -->
      <section class="flex flex-col gap-3 px-5 py-4">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.apontamento.historico }}</h4>
        <UTimeline :items="linhaDoTempo" size="xs" color="neutral" />
      </section>
    </div>

    <!-- Print em tela cheia -->
    <UModal :open="!!ampliada" :title="ampliada?.nome" :ui="{ content: 'max-w-5xl' }" @update:open="(v: boolean) => { if (!v) ampliada = null }">
      <template #body>
        <img v-if="ampliada" :src="ampliada.url" :alt="ampliada.nome" class="w-full rounded-md border border-default">
      </template>
    </UModal>
  </article>
</template>

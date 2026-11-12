<script setup lang="ts">
/**
 * O detalhe de um apontamento. Proposta.
 *
 * Cabeçalho com estado, de quem é a vez e a ação principal do papel; os campos
 * (responsável, prioridade, rodada, autor); o corpo em texto rico; os anexos
 * (print abre em tela cheia, arquivo e link em linha).
 *
 * Rodada 2: "Editar" à vista, com o marcador "editado" e as versões
 * anteriores (como a issue do GitHub); anexo removível; "Abrir em tela cheia";
 * e a linha do tempo única, que junta mudanças de estado, comentários e
 * edições, separada por rodada, com a resposta que cita com #.
 *
 * Rodada 4: Responsáveis em seleção múltipla (quem entra recebe a
 * notificação); anexo só de arquivo, sem link; `resumivel` mostra só o
 * cabeçalho, como cartão, com a seta para expandir ali mesmo; em tela cheia, o
 * conteúdo fica à esquerda e a linha do tempo à direita, como a tarefa do ClickUp.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Anexo, Apontamento, Citacao, Estado } from './mocks'
import type { Lista } from './lista'
import type { Textos } from './textos'
import CampoRico from './_CampoRico.vue'
import CampoComCitacao from './_CampoComCitacao.vue'
import { CHAVE_CITACAO, iconeDaCitacao, partesDoTexto } from './citacao'
import { atribuir, editar, iconeDaPrioridade, pessoa, podeConferir, podeDescartar, podeDesmarcar, podeReabrir, podeResolver, responder, rodadaDaData, rotuloDoEstado, vezDe, visualDoEstado } from './lista'

const props = defineProps<{
  t: Textos
  lista: Lista
  a: Apontamento
  quem: number
  somenteLeitura: boolean
  compacto?: boolean
  emTelaCheia?: boolean
  /** Cartão na lista: começa só com o cabeçalho e se expande ali mesmo. */
  resumivel?: boolean
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
  telaCheia: []
  fechar: []
}>()

const toast = useToast()
const citacao = inject(CHAVE_CITACAO, null)

const visual = computed(() => visualDoEstado[props.a.estado])
const rotulo = (e: Estado) => rotuloDoEstado(props.lista.config, e, props.t.estados, props.t.locale)
const nome = (id: number) => pessoa(props.lista, id)?.nome ?? ''
const juntar = (xs: string[]) => new Intl.ListFormat(props.t.locale, { type: 'conjunction' }).format(xs)
const vez = computed(() => juntar(vezDe(props.a, props.lista.config).map(nome).filter(Boolean)))

/* ---------- cartão resumido ---------- */
const aberto = ref(false)
const resumido = computed(() => !!props.resumivel && !aberto.value)
const temCorpo = computed(() => !!props.a.corpo.replace(/<[^>]*>/g, '').trim())

const ro = computed(() => props.somenteLeitura)
const acoes = computed(() => ({
  resolver: !ro.value && podeResolver(props.a, props.quem),
  desmarcar: !ro.value && podeDesmarcar(props.a, props.quem, props.lista.config),
  conferir: !ro.value && podeConferir(props.a, props.quem, props.lista.config),
  reabrir: !ro.value && podeReabrir(props.a, props.quem),
  descartar: !ro.value && podeDescartar(props.a, props.quem),
  editar: !ro.value && props.a.autor === props.quem,
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
/** Quem entra como responsável recebe a notificação de atribuição. */
const responsaveis = computed<number[]>({
  get: () => props.a.responsaveis,
  set: (v) => {
    const antes = [...props.a.responsaveis]
    props.a.responsaveis = v
    atribuir(props.a, props.quem, antes)
  },
})
const opcoesDePessoa = computed(() => props.lista.pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais, alt: p.nome } })))
const opcoesDePrioridade = computed(() => (['low', 'normal', 'high', 'urgent'] as const).map(p => ({ label: props.t.prioridades[p], value: p, icon: iconeDaPrioridade[p] })))

/* ---------- edição, com versões ---------- */
const editando = ref(false)
const rascunhoDoCorpo = ref('')
const rascunhoDoTitulo = ref('')
function abrirEdicao() {
  rascunhoDoCorpo.value = props.a.corpo
  rascunhoDoTitulo.value = props.a.titulo
  editando.value = true
}
function salvarEdicao() {
  editar(props.a, props.quem, rascunhoDoTitulo.value.trim() || props.a.titulo, rascunhoDoCorpo.value)
  editando.value = false
}
const versaoVista = ref<number | null>(null)
watch(() => props.a.id, () => { editando.value = false; resposta.value = ''; citacoesDaResposta.value = []; versaoVista.value = null })

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
function removerAnexo(x: Anexo) {
  const i = props.a.anexos.indexOf(x)
  if (i < 0) return
  props.a.anexos.splice(i, 1)
  toast.add({
    title: props.t.fluxo.removerAnexo(x.nome),
    icon: 'i-lucide-trash-2',
    duration: 4000,
    actions: [{ label: props.t.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { props.a.anexos.splice(i, 0, x) } }],
  })
}
function baixar(x: Anexo) {
  toast.add({ title: props.t.apontamento.baixar(x.nome), icon: 'i-lucide-download', duration: 2000 })
}

/* ---------- resposta, com citação ---------- */
const resposta = ref('')
const citacoesDaResposta = ref<Citacao[]>([])
const enviando = ref(false)
async function enviarResposta() {
  const texto = resposta.value.trim()
  if (!texto) return
  enviando.value = true
  await new Promise(r => setTimeout(r, 300))
  const usadas = citacoesDaResposta.value.filter(c => texto.includes(`#${c.rotulo}`))
  responder(props.a, props.quem, texto)
  const r = props.a.respostas.at(-1)!
  if (usadas.length) r.citacoes = usadas
  for (const c of usadas) citacao?.registrar(c.chave, `#${props.a.numero}`, props.quem)
  resposta.value = ''
  citacoesDaResposta.value = []
  enviando.value = false
}

/* ---------- linha do tempo por rodada ---------- */
type Entrada =
  | { tipo: 'evento', id: string, quando: Date, rodada: number, quem: number, de?: Estado, para: Estado, nota?: string }
  | { tipo: 'comentario', id: string, quando: Date, rodada: number, quem: number, texto: string, citacoes?: Citacao[] }
  | { tipo: 'edicao', id: string, quando: Date, rodada: number, quem: number }

const linhaDoTempo = computed(() => {
  const ev = props.a.historico
  const entradas: Entrada[] = [
    ...ev.map(e => ({ tipo: 'evento' as const, id: e.id, quando: e.quando, rodada: e.rodada, quem: e.quem, de: e.de, para: e.para, nota: e.nota })),
    ...props.a.respostas
      /* O motivo de reabrir e descartar já aparece no evento. */
      .filter(r => !ev.some(e => e.nota === r.texto && e.quem === r.autor))
      .map((r) => {
        const junto = ev.find(e => e.quem === r.autor && Math.abs(+e.quando - +r.quando) < 60_000)
        return { tipo: 'comentario' as const, id: r.id, quando: r.quando, rodada: junto?.rodada ?? rodadaDaData(props.lista, r.quando), quem: r.autor, texto: r.texto, citacoes: r.citacoes }
      }),
    ...(props.a.versoes ?? []).map((v, i) => ({ tipo: 'edicao' as const, id: `ver-${i}`, quando: v.quando, rodada: rodadaDaData(props.lista, v.quando), quem: v.quem })),
  ].sort((x, y) => +x.quando - +y.quando)

  const grupos: { rodada: number, entradas: Entrada[] }[] = []
  for (const e of entradas) {
    const g = grupos.find(x => x.rodada === e.rodada)
    if (g) g.entradas.push(e)
    else grupos.push({ rodada: e.rodada, entradas: [e] })
  }
  return grupos.sort((x, y) => x.rodada - y.rodada)
})
const vereditoDa = (n: number) => props.lista.rodadas.find(r => r.numero === n)?.veredito
const corDoVeredito = (v: string) => v === 'aprovado' ? 'success' : v === 'ressalvas' ? 'warning' : 'error'
const corDoIcone: Record<string, string> = { neutral: 'text-muted', info: 'text-info', success: 'text-success', error: 'text-error', warning: 'text-warning' }
const tituloDoEvento = (e: Extract<Entrada, { tipo: 'evento' }>) => !e.de
  ? props.t.apontamento.eventos.criou(nome(e.quem))
  : props.t.apontamento.eventos.mudou(nome(e.quem), rotulo(e.para))
</script>

<template>
  <article class="flex flex-col bg-default" :class="resumivel ? 'rounded-lg border border-default shadow-xs' : 'h-full min-h-0'">
    <!-- Cabeçalho -->
    <header class="flex flex-col gap-3 px-5" :class="[resumido ? 'py-3' : 'border-b border-default py-4']">
      <div class="flex items-start gap-2">
        <UButton
          v-if="resumivel"
          :icon="aberto ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          color="neutral"
          variant="ghost"
          size="sm"
          class="-ml-2 mt-2.5"
          :aria-label="aberto ? t.apontamento.recolher : t.apontamento.expandir"
          :aria-expanded="aberto"
          @click="aberto = !aberto"
        />
        <div class="min-w-0 flex-1">
          <p class="flex items-center gap-2 font-mono text-xs text-dimmed">
            #{{ a.numero }}
            <!-- Editado: as versões anteriores, como na issue do GitHub -->
            <UPopover v-if="a.versoes?.length" :content="{ align: 'start' }">
              <button type="button" class="flex items-center gap-0.5 font-sans text-xs text-muted underline decoration-dotted underline-offset-2 hover:text-highlighted">
                {{ t.fluxo.editado }}<UIcon name="i-lucide-chevron-down" class="size-3" />
              </button>
              <template #content>
                <div class="flex w-96 max-w-[90vw] flex-col gap-2 p-3">
                  <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.fluxo.versoes }}</p>
                  <ol class="flex flex-col gap-1">
                    <li v-for="(v, i) in [...a.versoes].reverse()" :key="i">
                      <button
                        type="button"
                        class="flex w-full flex-col rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated"
                        :class="versaoVista === i ? 'bg-elevated' : ''"
                        @click="versaoVista = versaoVista === i ? null : i"
                      >
                        <span class="text-xs text-muted">{{ t.fluxo.versaoDe(nome(v.quem), t.dataHora(v.quando)) }}</span>
                        <span class="truncate text-sm text-highlighted">{{ v.titulo }}</span>
                      </button>
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <div v-if="versaoVista === i" class="mx-2 mb-1 rounded-md border border-dashed border-accented px-3 py-2 text-xs text-toned line-through decoration-dimmed *:my-1" v-html="v.corpo" />
                    </li>
                  </ol>
                </div>
              </template>
            </UPopover>
          </p>
          <UInput v-if="editando" v-model="rascunhoDoTitulo" class="mt-1 w-full" size="lg" :aria-label="t.novo.titulo" />
          <h3 v-else class="mt-0.5 font-semibold leading-snug text-highlighted" :class="resumivel ? 'cursor-pointer text-base' : 'text-lg'" @click="resumivel && (aberto = !aberto)">{{ a.titulo }}</h3>
        </div>
        <UButton v-if="acoes.editar && !editando && !resumido" :label="compacto || resumivel ? undefined : t.apontamento.editar" icon="i-lucide-pencil" color="neutral" variant="outline" size="sm" :aria-label="t.apontamento.editar" @click="abrirEdicao" />
        <UTooltip v-if="!emTelaCheia" :text="t.fluxo.telaCheia">
          <UButton icon="i-lucide-maximize-2" color="neutral" variant="ghost" size="sm" :aria-label="t.fluxo.telaCheia" @click="emit('telaCheia')" />
        </UTooltip>
        <UTooltip v-if="!resumido" :text="t.apontamento.copiarLink">
          <UButton icon="i-lucide-link" color="neutral" variant="ghost" size="sm" :aria-label="t.apontamento.copiarLink" @click="emit('copiarLink')" />
        </UTooltip>
        <UDropdownMenu :items="menu" :content="{ align: 'end' }">
          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="sm" :aria-label="t.apontamento.maisAcoes" />
        </UDropdownMenu>
        <UButton
          :icon="emTelaCheia ? 'i-lucide-minimize-2' : 'i-lucide-x'"
          color="neutral"
          variant="ghost"
          size="sm"
          :aria-label="emTelaCheia ? t.fluxo.sairTelaCheia : t.apontamento.fechar"
          @click="emit('fechar')"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UBadge :label="rotulo(a.estado)" :icon="visual.icone" :color="visual.cor" :variant="visual.variante" />
        <span v-if="a.reaberturas" class="flex items-center gap-1 text-xs text-error">
          <UIcon name="i-lucide-rotate-ccw" class="size-3.5" />{{ t.apontamento.reaberturas(a.reaberturas) }}
        </span>
        <span v-if="vez" class="flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-arrow-right-circle" class="size-3.5" />{{ t.apontamento.vezDe(vez) }}
        </span>
      </div>

      <!-- A ação do papel, em destaque -->
      <div v-if="!resumido && (acoes.resolver || acoes.desmarcar || acoes.conferir || acoes.reabrir)" class="flex flex-wrap gap-2">
        <UButton v-if="acoes.resolver" :label="t.apontamento.marcarResolvido" icon="i-lucide-check" color="success" @click="emit('resolver')" />
        <UButton v-if="acoes.conferir" :label="t.apontamento.conferir" icon="i-lucide-badge-check" color="success" @click="emit('conferir')" />
        <UButton v-if="acoes.reabrir" :label="t.apontamento.reabrir" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" @click="emit('reabrir')" />
        <UButton v-if="acoes.desmarcar" :label="t.apontamento.desmarcar" icon="i-lucide-undo-2" color="neutral" variant="outline" @click="emit('desmarcar')" />
      </div>

      <UAlert
        v-if="!resumido && a.estado === 'descartado' && (a.motivo || a.duplicadoDe)"
        :title="a.duplicadoDe ? t.fluxo.duplicadoTexto(a.duplicadoDe) : t.apontamento.motivoDescarte"
        :description="a.duplicadoDe ? undefined : a.motivo"
        :icon="a.duplicadoDe ? 'i-lucide-copy' : 'i-lucide-circle-slash'"
        color="neutral"
        variant="subtle"
      />
    </header>

    <div v-if="!resumido" :class="emTelaCheia ? 'grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,1fr)_24rem]' : resumivel ? '' : 'min-h-0 flex-1 overflow-y-auto'">
      <div :class="emTelaCheia ? 'min-h-0 overflow-y-auto' : 'contents'">
      <!-- Campos -->
      <dl class="grid gap-x-4 gap-y-3 border-b border-default px-5 py-4 text-sm" :class="compacto ? 'grid-cols-1' : 'grid-cols-2'">
        <div class="flex flex-col gap-1">
          <dt class="text-xs font-medium text-muted">{{ t.apontamento.responsaveis }}</dt>
          <dd>
            <USelectMenu
              v-model="responsaveis"
              :items="opcoesDePessoa"
              value-key="value"
              multiple
              :disabled="ro"
              :search-input="{ placeholder: t.apontamento.buscarPessoa }"
              :placeholder="t.apontamento.semResponsavel"
              icon="i-lucide-users"
              size="sm"
              class="w-full"
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
            <UButton :label="t.apontamento.salvar" size="sm" @click="salvarEdicao" />
          </div>
        </div>
        <p v-else-if="!temCorpo" class="text-sm text-dimmed">{{ t.apontamento.semDescricao }}</p>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-else class="corpo text-sm leading-relaxed text-default *:my-1.5 [&_code]:rounded [&_code]:bg-elevated [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_strong]:text-highlighted" v-html="a.corpo" />
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
          <div v-for="x in imagens" :key="x.id" class="group/img relative">
            <button
              type="button"
              class="relative block aspect-video w-full overflow-hidden rounded-md border border-default bg-elevated transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
              :aria-label="t.apontamento.abrirImagem(x.nome)"
              @click="ampliada = x"
            >
              <img :src="x.url" :alt="x.nome" class="size-full object-cover object-left-top transition-transform duration-200 group-hover/img:scale-105">
              <span class="absolute inset-x-0 bottom-0 truncate bg-default/85 px-2 py-1 text-left text-[11px] text-toned">{{ x.nome }}</span>
            </button>
            <UButton
              v-if="!ro"
              icon="i-lucide-x"
              color="neutral"
              variant="solid"
              size="xs"
              class="absolute right-1 top-1 opacity-0 transition-opacity group-hover/img:opacity-100 focus-visible:opacity-100"
              :aria-label="t.fluxo.removerAnexo(x.nome)"
              @click="removerAnexo(x)"
            />
          </div>
        </div>
        <ul v-if="outros.length" class="flex flex-col divide-y divide-default rounded-md border border-default">
          <li v-for="x in outros" :key="x.id" class="flex items-center gap-2.5 px-3 py-2 text-sm">
            <UIcon :name="iconeDoArquivo(x.nome)" class="size-4 shrink-0 text-muted" />
            <span class="min-w-0 flex-1 truncate text-highlighted">{{ x.nome }}</span>
            <span v-if="x.tamanho" class="text-xs text-dimmed">{{ x.tamanho }}</span>
            <UButton
              icon="i-lucide-download"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="t.apontamento.baixar(x.nome)"
              @click="baixar(x)"
            />
            <UButton v-if="!ro" icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.fluxo.removerAnexo(x.nome)" @click="removerAnexo(x)" />
          </li>
        </ul>
      </section>
      </div>

      <!-- Linha do tempo, por rodada (em tela cheia, a coluna da direita) -->
      <div :class="emTelaCheia ? 'min-h-0 overflow-y-auto border-l border-default bg-elevated/30' : 'contents'">
      <section class="flex flex-col gap-3 px-5 py-4">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.fluxo.linhaDoTempo }}</h4>
        <div v-for="g in linhaDoTempo" :key="g.rodada" class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span class="rounded bg-inverted px-1.5 py-0.5 font-mono text-[11px] font-semibold text-inverted">R{{ g.rodada }}</span>
            <UBadge v-if="vereditoDa(g.rodada)" :label="t.lista.vereditos[vereditoDa(g.rodada)!]" :color="corDoVeredito(vereditoDa(g.rodada)!)" variant="soft" size="sm" />
            <span class="h-px flex-1 bg-accented" aria-hidden="true" />
          </div>
          <ol class="flex flex-col gap-2 border-l border-accented pl-3">
            <li v-for="e in g.entradas" :key="e.id">
              <!-- Mudança de estado -->
              <div v-if="e.tipo === 'evento'" class="flex flex-col gap-0.5 text-xs">
                <p class="flex items-center gap-1.5">
                  <UIcon :name="visualDoEstado[e.para].icone" class="size-3.5 shrink-0" :class="corDoIcone[visualDoEstado[e.para].cor]" />
                  <span class="text-highlighted">{{ tituloDoEvento(e) }}</span>
                  <span class="text-dimmed">{{ t.dataHora(e.quando) }}</span>
                </p>
                <p v-if="e.nota" class="ml-5 rounded-md bg-elevated/60 px-2.5 py-1.5 text-sm text-default">{{ e.nota }}</p>
              </div>
              <!-- Edição -->
              <p v-else-if="e.tipo === 'edicao'" class="flex items-center gap-1.5 text-xs">
                <UIcon name="i-lucide-pencil" class="size-3.5 shrink-0 text-muted" />
                <span class="text-highlighted">{{ t.fluxo.editou(nome(e.quem)) }}</span>
                <span class="text-dimmed">{{ t.dataHora(e.quando) }}</span>
              </p>
              <!-- Comentário -->
              <div v-else class="flex gap-2.5">
                <UAvatar :text="pessoa(lista, e.quem)?.iniciais" :alt="nome(e.quem)" size="xs" class="mt-0.5" />
                <div class="min-w-0 flex-1 rounded-md bg-elevated/60 px-3 py-2">
                  <p class="flex items-baseline gap-2 text-xs">
                    <span class="font-semibold text-highlighted">{{ nome(e.quem) }}</span>
                    <span class="text-dimmed">{{ t.dataHora(e.quando) }}</span>
                  </p>
                  <p class="mt-0.5 text-sm text-default">
                    <template v-for="(p, i) in partesDoTexto(e.texto, e.citacoes)" :key="i">
                      <template v-if="'texto' in p">{{ p.texto }}</template>
                      <button
                        v-else
                        type="button"
                        class="inline-flex items-center gap-1 rounded bg-primary/10 px-1 font-medium text-primary transition-colors hover:bg-primary/20"
                        @click="citacao?.abrir(p.citacao.chave)"
                      >
                        <UIcon :name="iconeDaCitacao[p.citacao.tipo]" class="size-3.5" />{{ p.citacao.rotulo }}
                      </button>
                    </template>
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </div>

        <form v-if="!ro" class="flex flex-col gap-2 pt-1" @submit.prevent="enviarResposta">
          <CampoComCitacao
            v-model="resposta"
            v-model:citacoes="citacoesDaResposta"
            :t="t"
            :placeholder="t.apontamento.respostaPlaceholder"
            :excluir="a.id"
            @enviar="enviarResposta"
          />
          <UButton type="submit" :label="t.apontamento.responder" size="sm" color="neutral" variant="outline" class="self-end" :loading="enviando" :disabled="!resposta.trim()" />
        </form>
      </section>
      </div>
    </div>

    <!-- Print em tela cheia -->
    <UModal :open="!!ampliada" :title="ampliada?.nome" :ui="{ content: 'max-w-5xl' }" @update:open="(v: boolean) => { if (!v) ampliada = null }">
      <template #body>
        <img v-if="ampliada" :src="ampliada.url" :alt="ampliada.nome" class="w-full rounded-md border border-default">
      </template>
    </UModal>
  </article>
</template>

<script setup lang="ts">
import { localidades, templates, type Template } from './mocks'
import { textos } from './textos'
import { biblioteca, curadoria, totalDeIcones } from './icones'

/**
 * Criação de workspace — reconstrução da jornada real do develop.
 *
 * O produto hoje pede, em dois passos: Nome, Referência, Descrição e Ícone
 * (todos no mesmo peso, três deles obrigatórios), e depois Localidade +
 * Template. O ícone é escolhido numa árvore de categorias e, escolhido,
 * aparece como `carbon:scales`. O passo 2 leva ~4s em branco e responde
 * "Não há dados" para o Brasil.
 *
 * Aqui a hierarquia é outra: uma decisão de cada vez, na ordem em que a
 * pessoa realmente decide — nome, depois ponto de partida, e o resto como
 * ajuste opcional com bom padrão.
 */
const aberto = defineModel<boolean>('open', { default: false })
const t = useTextos(textos)
const idioma = useIdioma()
const emit = defineEmits<{ criado: [nome: string] }>()

const passo = ref(1)
const form = reactive({
  nome: '',
  referencia: '',
  descricao: '',
  /** Ícone da biblioteca. Vale quando não há logo enviado. */
  icone: '',
  /** Logo enviado pela empresa. Ganha do ícone quando existe. */
  logo: null as string | null,
  logoNome: '',
  template: 'zero',
})

/** O campo do produto chama "Ícone", mas aceita a identidade da empresa —
    que na prática é um logo. Aqui as duas naturezas convivem. */
const identidade = ref<'iniciais' | 'icone' | 'imagem'>('iniciais')

/* -------- cor: metade da identidade, e escolha explícita --------
   ClickUp e Linear tratam a cor como decisão de primeira classe, não como
   consequência. Aqui ela vale para os três modos e começa sugerida pelo nome.

   O tom do texto não é o mesmo para todas: medido no claro, o -600 dá 7,49:1
   no cyan e 3,34:1 no teal, porque a paleta não tem luminância uniforme. As
   duas que ficavam abaixo de 4,5:1 (fuchsia e teal) usam -700; as outras
   continuam no -600, que já passa. No card da lista a mesma cor veste um
   ícone, e ícone pede 3:1, não 4,5:1 — por isso lá a paleta não mudou. */
const paleta = [
  { id: 'fuchsia', fundo: 'bg-fuchsia-500/12', texto: 'text-fuchsia-700 dark:text-fuchsia-400', amostra: 'bg-fuchsia-500' },
  { id: 'cyan', fundo: 'bg-cyan-500/12', texto: 'text-cyan-600 dark:text-cyan-400', amostra: 'bg-cyan-500' },
  { id: 'purple', fundo: 'bg-purple-500/12', texto: 'text-purple-600 dark:text-purple-400', amostra: 'bg-purple-500' },
  { id: 'teal', fundo: 'bg-teal-500/12', texto: 'text-teal-700 dark:text-teal-400', amostra: 'bg-teal-500' },
  { id: 'space', fundo: 'bg-space-500/12', texto: 'text-space-600 dark:text-space-300', amostra: 'bg-space-500' },
]

const corEscolhida = ref<string | null>(null)

const corSugerida = computed(() => {
  const semente = form.nome || form.referencia || ''
  if (!semente) return paleta[0]!.id
  const soma = [...semente].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return paleta[soma % paleta.length]!.id
})

const cor = computed(() => paleta.find(c => c.id === (corEscolhida.value ?? corSugerida.value)) ?? paleta[0]!)

/** Iniciais: o padrão de esforço zero. Ninguém precisa escolher nada. */
const iniciais = computed(() => {
  const palavras = form.nome.trim().split(/\s+/).filter(w => w.length > 1)
  if (!palavras.length) return 'W'
  if (palavras.length === 1) return palavras[0]!.slice(0, 2).toUpperCase()
  return (palavras[0]![0]! + palavras[1]![0]!).toUpperCase()
})
const entradaDeArquivo = ref<HTMLInputElement>()
const arrastando = ref(false)

function aplicarArquivo(arquivo: File | undefined) {
  if (!arquivo || !arquivo.type.startsWith('image/')) return
  if (form.logo) URL.revokeObjectURL(form.logo)
  // Maquete: a imagem vive só nesta aba, via object URL. Não sobe para lugar nenhum.
  form.logo = URL.createObjectURL(arquivo)
  form.logoNome = arquivo.name
  identidade.value = 'imagem'
}

function aoSoltar(e: DragEvent) {
  arrastando.value = false
  aplicarArquivo(e.dataTransfer?.files?.[0])
}

function aoEscolherArquivo(e: Event) {
  aplicarArquivo((e.target as HTMLInputElement).files?.[0])
}

function escolherIcone(id: string) {
  removerLogo()
  form.icone = id
  identidade.value = 'icone'
}

function removerLogo() {
  if (form.logo) URL.revokeObjectURL(form.logo)
  form.logo = null
  form.logoNome = ''
  identidade.value = 'icone'
}
const referenciaEditada = ref(false)
const detalhesAbertos = ref(false)
const locaisSelecionados = ref<string[]>(['pt-br'])
const criando = ref(false)

watch(aberto, (v) => {
  if (!v) return
  passo.value = 1
  referenciaEditada.value = false
  detalhesAbertos.value = false
  buscaIcone.value = ''
  locaisSelecionados.value = ['pt-br']
  removerLogo()
  Object.assign(form, { nome: '', referencia: '', descricao: '', icone: '', logo: null, logoNome: '', template: 'zero' })
  identidade.value = 'iniciais'
  corEscolhida.value = null
})

/* -------- referência: espelha o nome até alguém mexer nela à mão -------- */
const referenciaAuto = computed(() =>
  form.nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50))

watch(referenciaAuto, (v) => {
  if (!referenciaEditada.value) form.referencia = v
})

/* -------- ícone: sugerido pelo nome, ajustável em dois cliques -------- */
/** Acentos fora dos dois lados: quem digita "balanca" acha "balança". */
function normaliza(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const buscaIcone = ref('')

/**
 * Com uma biblioteca desse tamanho, a busca é a navegação. As categorias são
 * atalho para quem não sabe o que procurar, não a forma principal de achar.
 */
const buscando = computed(() => buscaIcone.value.trim().length > 0)

const iconesFiltrados = computed(() => {
  const termo = normaliza(buscaIcone.value.trim())
  if (!termo) return []
  return biblioteca.filter(([, termos]) => normaliza(termos).includes(termo))
})

/* ---- virtualização: só as linhas visíveis existem no DOM ---- */
const CELULA = 44
const grade = ref<HTMLElement>()
const rolagem = ref(0)
const larguraDaGrade = ref(0)
const ALTURA_VISIVEL = 264

const colunas = computed(() => Math.max(1, Math.floor(larguraDaGrade.value / CELULA) || 8))
const totalDeLinhas = computed(() => Math.ceil(iconesFiltrados.value.length / colunas.value))
const alturaTotal = computed(() => totalDeLinhas.value * CELULA)

const primeiraLinha = computed(() =>
  Math.max(0, Math.floor(rolagem.value / CELULA) - 1))
const ultimaLinha = computed(() =>
  Math.min(totalDeLinhas.value, primeiraLinha.value + Math.ceil(ALTURA_VISIVEL / CELULA) + 2))

const iconesVisiveis = computed(() =>
  iconesFiltrados.value.slice(primeiraLinha.value * colunas.value, ultimaLinha.value * colunas.value))

function aoRolar(e: Event) {
  rolagem.value = (e.target as HTMLElement).scrollTop
}

function medirGrade() {
  larguraDaGrade.value = grade.value?.clientWidth ?? 0
}

onMounted(() => {
  medirGrade()
  window.addEventListener('resize', medirGrade)
})
onBeforeUnmount(() => window.removeEventListener('resize', medirGrade))

// Busca nova volta ao topo: continuar no meio da rolagem antiga desorienta.
watch([iconesFiltrados, () => identidade.value], () => {
  rolagem.value = 0
  if (grade.value) grade.value.scrollTop = 0
  nextTick(medirGrade)
})

const palavrasPorIcone: Record<string, string[]> = {
  'i-lucide-scale': ['juridico', 'jurídico', 'legal', 'contrato', 'advocacia'],
  'i-lucide-users': ['rh', 'pessoas', 'equipe', 'gente', 'colaborador'],
  'i-lucide-calculator': ['financeiro', 'contabil', 'contábil', 'fiscal', 'custo'],
  'i-lucide-truck': ['log', 'logistica', 'logística', 'frota', 'entrega', 'transporte'],
  'i-lucide-database': ['dados', 'base', 'migracao', 'migração', 'teste'],
  'i-lucide-cross': ['saude', 'saúde', 'clinica', 'clínica', 'hospital'],
  'i-lucide-life-buoy': ['chamado', 'suporte', 'atendimento', 'helpdesk'],
}

const iconeSugerido = computed(() => {
  const n = form.nome.toLowerCase()
  if (n.length < 3) return 'i-lucide-building-2'
  for (const [icone, palavras] of Object.entries(palavrasPorIcone)) {
    if (palavras.some(p => n.includes(p))) return icone
  }
  return 'i-lucide-building-2'
})

/** O que aparece no card: o escolhido, ou o sugerido pelo nome. */
const iconeEfetivo = computed(() => form.icone || iconeSugerido.value)

/* ---------------------------- templates ---------------------------- */
const templatesDisponiveis = computed<Template[]>(() =>
  templates.filter(t => t.localidades.some(l => locaisSelecionados.value.includes(l))))

const templateEscolhido = computed(() =>
  templates.find(t => t.id === form.template))

/* ---------------------------- validação ---------------------------- */
const nomeCurto = computed(() => form.nome.trim().length > 0 && form.nome.trim().length < 3)
const podeAvancar = computed(() => form.nome.trim().length >= 3)

function criar() {
  criando.value = true
  setTimeout(() => {
    criando.value = false
    aberto.value = false
    emit('criado', form.nome.trim())
  }, 700)
}
</script>

<template>
  <UModal v-model:open="aberto" :ui="{ content: 'max-w-4xl' }">
    <template #content>
      <div class="grid md:grid-cols-[1fr_20rem]">
        <!-- ------------------------- coluna das decisões ------------------------- -->
        <div class="p-6 sm:p-8">
          <!-- progresso: duas decisões, e a pessoa vê onde está -->
          <div class="mb-6 flex items-center gap-3">
            <div
              v-for="n in 2"
              :key="n"
              class="h-1 flex-1 rounded-full transition-all duration-500"
              :class="passo >= n ? 'bg-primary' : 'bg-accented'"
            />
            <span class="shrink-0 text-xs font-medium text-muted">{{ t.criar.passoDe(passo, 2) }}</span>
          </div>

          <Transition
            mode="out-in"
            enter-active-class="transition duration-250 ease-out"
            enter-from-class="opacity-0 translate-x-4"
            leave-active-class="transition duration-150 ease-in"
            leave-to-class="opacity-0 -translate-x-4"
          >
            <!-- ============ DECISÃO 1: o nome ============ -->
            <div v-if="passo === 1" key="1">
              <h2 class="text-xl font-bold tracking-tight text-highlighted">
                {{ t.criar.comoSeChama }}
              </h2>
              <p class="mt-1.5 text-sm text-muted">
                {{ t.criar.nomeAjuda }}
              </p>

              <!-- Identidade e nome juntos: é o par que aparece no card, e o
                   logo deixa de ficar escondido atrás de "opcional". -->
              <div class="mt-5 flex items-center gap-3">
                <UPopover :content="{ align: 'start' }">
                  <button
                    type="button"
                    class="group/logo relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-default transition-all duration-200 hover:border-primary hover:shadow-sm"
                    :class="!form.logo && 'bg-default'"
                    :aria-label="t.criar.escolherIdentidade"
                  >
                    <img v-if="form.logo" :src="form.logo" alt="" class="size-full object-cover">
                    <span
                      v-else
                      class="flex size-full items-center justify-center"
                      :class="[cor.fundo, cor.texto]"
                    >
                      <UIcon v-if="identidade === 'icone'" :name="iconeEfetivo" class="size-5" />
                      <span v-else class="text-sm font-semibold">{{ iniciais }}</span>
                    </span>
                    <span class="absolute inset-0 flex items-center justify-center bg-default/70 opacity-0 transition-opacity group-hover/logo:opacity-100">
                      <UIcon name="i-lucide-pencil" class="size-4 text-highlighted" />
                    </span>
                  </button>

                  <template #content>
                    <div class="w-[22rem] max-w-[calc(100vw-2rem)] p-3">
                      <!-- COR primeiro: vale para os três modos. Linear e ClickUp
                           tratam a cor como decisão de primeira classe, não como
                           consequência de ter escolhido um ícone. -->
                      <div class="mb-3 flex items-center gap-2">
                        <span class="text-xs font-medium text-muted">{{ t.criar.cor }}</span>
                        <div class="flex gap-1.5">
                          <button
                            v-for="c in paleta"
                            :key="c.id"
                            type="button"
                            class="size-5 rounded-full transition-transform hover:scale-110"
                            :class="[c.amostra, cor.id === c.id ? 'ring-2 ring-offset-2 ring-offset-default ring-inverted/40' : '']"
                            :aria-label="`Cor ${c.id}`"
                            @click="corEscolhida = c.id"
                          />
                        </div>
                      </div>

                      <div class="mb-3 flex gap-0.5 rounded-md border border-default p-0.5">
                        <UButton
                          :label="t.criar.iniciais"
                          size="xs"
                          block
                          :color="identidade === 'iniciais' ? 'primary' : 'neutral'"
                          :variant="identidade === 'iniciais' ? 'soft' : 'ghost'"
                          @click="removerLogo(); identidade = 'iniciais'"
                        />
                        <UButton
                          :label="t.criar.icone"
                          size="xs"
                          block
                          :color="identidade === 'icone' ? 'primary' : 'neutral'"
                          :variant="identidade === 'icone' ? 'soft' : 'ghost'"
                          @click="removerLogo(); identidade = 'icone'"
                        />
                        <UButton
                          :label="t.criar.imagem"
                          size="xs"
                          block
                          :color="identidade === 'imagem' ? 'primary' : 'neutral'"
                          :variant="identidade === 'imagem' ? 'soft' : 'ghost'"
                          @click="identidade = 'imagem'"
                        />
                      </div>

                      <!-- INICIAIS: o padrão de esforço zero -->
                      <div v-if="identidade === 'iniciais'" class="py-3 text-center">
                        <span
                          class="mx-auto flex size-16 items-center justify-center rounded-xl text-xl font-semibold"
                          :class="[cor.fundo, cor.texto]"
                        >{{ iniciais }}</span>
                        <p class="mt-3 text-sm text-muted">
                          {{ t.criar.iniciaisExplicacao }}
                        </p>
                        <p class="mt-1 text-xs text-muted">
                          {{ t.criar.iniciaisRodape }}
                        </p>
                      </div>

                      <!-- IMAGEM: o logo da empresa -->
                      <div v-else-if="identidade === 'imagem'">
                        <div
                          v-if="!form.logo"
                          class="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors"
                          :class="arrastando ? 'border-primary bg-primary/5' : 'border-default hover:border-primary/60'"
                          @click="entradaDeArquivo?.click()"
                          @dragover.prevent="arrastando = true"
                          @dragleave="arrastando = false"
                          @drop.prevent="aoSoltar"
                        >
                          <UIcon name="i-lucide-upload" class="size-5 text-muted" />
                          <p class="text-sm font-medium text-highlighted">
                            {{ t.criar.arrasteLogo }}
                          </p>
                          <p class="text-xs text-muted">
                            {{ t.criar.ouClique }}
                          </p>
                        </div>

                        <div v-else class="space-y-3">
                          <div class="flex items-center gap-3 rounded-lg border border-default p-3">
                            <img :src="form.logo" alt="" class="size-12 shrink-0 rounded-md object-cover">
                            <p class="min-w-0 flex-1 truncate text-sm text-muted">
                              {{ form.logoNome }}
                            </p>
                          </div>
                          <div class="flex gap-2">
                            <UButton :label="t.criar.trocar" icon="i-lucide-refresh-cw" size="xs" color="neutral" variant="subtle" @click="entradaDeArquivo?.click()" />
                            <UButton :label="t.criar.remover" icon="i-lucide-trash-2" size="xs" color="neutral" variant="ghost" @click="removerLogo" />
                          </div>
                        </div>

                        <input
                          ref="entradaDeArquivo"
                          type="file"
                          accept="image/*"
                          class="hidden"
                          @change="aoEscolherArquivo"
                        >
                      </div>

                      <!-- ÍCONE: curadoria primeiro, biblioteca sob busca -->
                      <div v-else class="space-y-2">
                        <UInput
                          v-model="buscaIcone"
                          icon="i-lucide-search"
                          size="sm"
                          :placeholder="t.criar.buscarIcones(totalDeIcones.toLocaleString(idioma))"
                          class="w-full"
                          :ui="{ trailing: 'pe-1' }"
                        >
                          <template v-if="buscaIcone" #trailing>
                            <UButton
                              icon="i-lucide-x"
                              size="xs"
                              square
                              variant="ghost"
                              color="neutral"
                              :aria-label="t.criar.limparBusca"
                              @click="buscaIcone = ''"
                            />
                          </template>
                        </UInput>

                        <!-- Sem busca: a curadoria, que cabe na tela e resolve o caso comum -->
                        <div v-if="!buscando">
                          <p class="mb-1.5 text-xs font-medium text-muted">
                            {{ t.criar.maisUsados }}
                          </p>
                          <div class="grid grid-cols-8 gap-1">
                            <UTooltip
                              v-for="nome in curadoria"
                              :key="nome"
                              :text="nome"
                              :delay-duration="400"
                            >
                              <button
                                type="button"
                                class="flex size-9 items-center justify-center rounded-md border border-transparent transition-colors hover:border-primary/40 hover:bg-elevated"
                                :class="iconeEfetivo === `i-lucide-${nome}` ? 'border-primary bg-primary/10 text-primary' : 'text-muted'"
                                @click="escolherIcone(`i-lucide-${nome}`)"
                              >
                                <UIcon :name="`i-lucide-${nome}`" class="size-4.5" />
                              </button>
                            </UTooltip>
                          </div>
                        </div>

                        <!-- Com busca: a biblioteca inteira, virtualizada -->
                        <template v-else>
                          <div
                            ref="grade"
                            class="relative overflow-y-auto rounded-lg border border-default p-1"
                            :style="{ height: ALTURA_VISIVEL + 'px' }"
                            @scroll="aoRolar"
                          >
                            <div :style="{ height: alturaTotal + 'px', position: 'relative' }">
                              <div
                                class="absolute inset-x-0 grid"
                                :style="{
                                  top: primeiraLinha * CELULA + 'px',
                                  gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))`,
                                }"
                              >
                                <UTooltip
                                  v-for="[nome] in iconesVisiveis"
                                  :key="nome"
                                  :text="nome"
                                  :delay-duration="400"
                                >
                                  <button
                                    type="button"
                                    class="flex items-center justify-center rounded-md border border-transparent transition-colors hover:border-primary/40 hover:bg-elevated"
                                    :style="{ height: CELULA + 'px' }"
                                    :class="iconeEfetivo === `i-lucide-${nome}` ? 'border-primary bg-primary/10 text-primary' : 'text-muted'"
                                    @click="escolherIcone(`i-lucide-${nome}`)"
                                  >
                                    <UIcon :name="`i-lucide-${nome}`" class="size-5" />
                                  </button>
                                </UTooltip>
                              </div>
                            </div>

                            <p
                              v-if="!iconesFiltrados.length"
                              class="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center"
                            >
                              <span class="text-sm font-medium text-highlighted">
                                {{ t.criar.nadaPara(buscaIcone) }}
                              </span>
                              <span class="text-xs text-muted">
                                {{ t.criar.tenteOutra }}
                              </span>
                            </p>
                          </div>

                          <p class="text-xs text-muted">
                            {{ t.criar.resultados(
                              iconesFiltrados.length.toLocaleString(idioma),
                              totalDeIcones.toLocaleString(idioma)) }}
                          </p>
                        </template>
                      </div>
                    </div>
                  </template>
                </UPopover>

                <UInput
                  v-model="form.nome"
                  autofocus
                  size="xl"
  :placeholder="t.criar.nomePlaceholder"
                  class="flex-1"
                  :ui="{ base: 'text-base' }"
                />
              </div>
              <p class="mt-2 h-4 text-xs" :class="nomeCurto ? 'text-error' : 'text-muted'">
                {{ nomeCurto ? t.criar.nomeCurto : t.criar.tamanhoNome }}
              </p>

              <!-- Endereço: consequência do nome, mostrada como endereço mesmo -->
              <div
                v-if="form.nome.length >= 3"
                class="mt-5 animate-[entrada_0.3s_ease-out_both] rounded-lg border border-default bg-elevated/40 px-4 py-3"
              >
                <p class="text-xs font-medium text-muted">
                  {{ t.criar.enderecoDoWorkspace }}
                </p>
                <p class="mt-1 font-mono text-sm text-muted">
                  enspace.io/<span class="text-primary-700 dark:text-primary-300">{{ form.referencia || '…' }}</span>
                </p>
              </div>

              <!-- Tudo o que não precisa ser decidido agora fica aqui -->
              <button
                type="button"
                class="mt-6 flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-highlighted"
                @click="detalhesAbertos = !detalhesAbertos"
              >
                <UIcon
                  name="i-lucide-chevron-right"
                  class="size-4 transition-transform duration-200"
                  :class="detalhesAbertos && 'rotate-90'"
                />
                {{ t.criar.detalhesOpcionais }}
                <span class="font-normal text-muted">{{ t.criar.opcional }}</span>
              </button>

              <Transition
                enter-active-class="transition-all duration-300 ease-out overflow-hidden"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[40rem]"
                leave-active-class="transition-all duration-200 ease-in overflow-hidden"
                leave-from-class="opacity-100 max-h-[40rem]"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-if="detalhesAbertos" class="space-y-5 pt-5">
                  <UFormField
                    :label="t.criar.descricao"
                    :description="t.criar.descricaoAjuda(form.descricao.length)"
                  >
                    <UInput
                      v-model="form.descricao"
                      maxlength="140"
                      :placeholder="t.criar.descricaoPlaceholder"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField
                    :label="t.criar.endereco"
                    :description="t.criar.enderecoAjuda"
                  >
                    <UInput
                      v-model="form.referencia"
                      class="w-full font-mono text-sm"
                      @update:model-value="referenciaEditada = true"
                    />
                  </UFormField>
                </div>
              </Transition>
            </div>

            <!-- ============ DECISÃO 2: do zero ou de um modelo ============ -->
            <div v-else key="2">
              <h2 class="text-xl font-bold tracking-tight text-highlighted">
                {{ t.criar.querModelo }}
              </h2>
              <p class="mt-1.5 text-sm text-muted">
                {{ t.criar.modeloAjuda }}
              </p>

              <div class="mt-5 flex flex-wrap items-center gap-2">
                <span class="text-xs font-medium text-muted">{{ t.criar.modelosDe }}</span>
                <UButton
                  v-for="loc in localidades"
                  :key="loc.id"
                  :label="loc.nome"
                  size="xs"
                  :color="locaisSelecionados.includes(loc.id) ? 'primary' : 'neutral'"
                  :variant="locaisSelecionados.includes(loc.id) ? 'soft' : 'subtle'"
                  :icon="locaisSelecionados.includes(loc.id) ? 'i-lucide-check' : undefined"
                  @click="locaisSelecionados.includes(loc.id)
                    ? locaisSelecionados = locaisSelecionados.filter(l => l !== loc.id)
                    : locaisSelecionados.push(loc.id)"
                />
              </div>

              <div class="mt-4 space-y-2">
                <!-- Começar do zero é escolha de primeira classe, não ausência -->
                <button
                  type="button"
                  class="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
                  :class="form.template === 'zero'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                    : 'border-default hover:border-primary/40'"
                  @click="form.template = 'zero'"
                >
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated">
                    <UIcon name="i-lucide-sparkles" class="size-5 text-muted" />
                  </div>
                  <div class="min-w-0">
                    <span class="block font-medium text-highlighted">{{ t.criar.doZero }}</span>
                    <span class="block text-sm text-toned">
                      {{ t.criar.doZeroAjuda }}
                    </span>
                  </div>
                  <UIcon
                    v-if="form.template === 'zero'"
                    name="i-lucide-check-circle-2"
                    class="ml-auto size-5 shrink-0 text-primary"
                  />
                </button>

                <TransitionGroup
                  enter-active-class="transition duration-300 ease-out"
                  enter-from-class="opacity-0 translate-y-2"
                  leave-active-class="transition duration-150 ease-in absolute"
                  leave-to-class="opacity-0 scale-95"
                >
                  <button
                    v-for="t in templatesDisponiveis"
                    :key="t.id"
                    type="button"
                    class="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
                    :class="form.template === t.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                      : 'border-default hover:border-primary/40'"
                    @click="form.template = t.id"
                  >
                    <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <UIcon :name="t.icone" class="size-5 text-primary" />
                    </div>
                    <div class="min-w-0">
                      <span class="block font-medium text-highlighted">{{ t.nome }}</span>
                      <span class="block text-sm text-toned">{{ t.descricao }}</span>
                    </div>
                    <UIcon
                      v-if="form.template === t.id"
                      name="i-lucide-check-circle-2"
                      class="ml-auto size-5 shrink-0 text-primary"
                    />
                  </button>
                </TransitionGroup>

                <!-- Vazio que explica, em vez de "Não há dados" -->
                <div
                  v-if="!templatesDisponiveis.length"
                  class="animate-[entrada_0.3s_ease-out_both] rounded-xl border border-dashed border-default p-5 text-center"
                >
                  <UIcon name="i-lucide-layout-template" class="mx-auto size-6 text-dimmed" />
                  <p class="mt-2 text-sm font-medium text-highlighted">
                    {{ t.criar.semModelo }}
                  </p>
                  <p class="mt-1 text-sm text-muted">
                    {{ t.criar.semModeloAjuda }}
                  </p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- ------------------------- ações ------------------------- -->
          <div class="mt-8 flex items-center justify-between gap-3">
            <UButton
              v-if="passo === 2"
              :label="t.criar.voltar"
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="ghost"
              @click="passo = 1"
            />
            <UButton
              v-else
              :label="t.criar.cancelar"
              color="neutral"
              variant="ghost"
              @click="aberto = false"
            />

            <UButton
              v-if="passo === 1"
              :label="t.criar.continuar"
              trailing-icon="i-lucide-arrow-right"
              :disabled="!podeAvancar"
              class="transition-transform hover:translate-x-0.5"
              @click="passo = 2"
            />
            <UButton
              v-else
              :label="templateEscolhido ? t.criar.criarCom(templateEscolhido.nome) : t.criar.criarWorkspace"
              icon="i-lucide-check"
              :loading="criando"
              @click="criar"
            />
          </div>
        </div>

        <!-- ------------------------- prévia ao vivo ------------------------- -->
        <aside class="hidden border-l border-default bg-elevated/30 p-6 md:block">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted">
            {{ t.criar.comoVaiAparecer }}
          </p>

          <div class="mt-4 rounded-xl border border-default bg-default p-4 shadow-sm transition-all duration-300">
            <div
              class="flex size-10 items-center justify-center overflow-hidden rounded-lg"
              :class="!form.logo && [cor.fundo, cor.texto]"
            >
              <Transition
                mode="out-in"
                enter-active-class="transition duration-200"
                enter-from-class="opacity-0 scale-50"
                leave-active-class="transition duration-100"
                leave-to-class="opacity-0 scale-50"
              >
                <img v-if="form.logo" :key="form.logo" :src="form.logo" alt="" class="size-full object-cover">
                <UIcon v-else-if="identidade === 'icone'" :key="iconeEfetivo" :name="iconeEfetivo" class="size-5" />
                <span v-else :key="iniciais" class="text-sm font-semibold">{{ iniciais }}</span>
              </Transition>
            </div>
            <h3 class="mt-3 line-clamp-2 font-medium text-highlighted">
              {{ form.nome || t.criar.nomeDoWorkspace }}
            </h3>
            <p class="mt-1 line-clamp-2 text-sm text-muted">
              {{ form.descricao || (templateEscolhido ? templateEscolhido.descricao : t.criar.semDescricao) }}
            </p>
            <p class="mt-1 text-xs text-muted">
              {{ t.criar.aindaNaoEntrou }}
            </p>
            <div class="mt-4 flex items-center justify-between">
              <UBadge :label="t.criar.proprietario" color="primary" variant="subtle" size="sm" />
              <UBadge :label="t.criar.entrar" color="neutral" variant="subtle" size="sm" />
            </div>
          </div>

          <!-- O que o modelo traz junto: consequência visível antes de confirmar -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            leave-active-class="transition duration-150 ease-in"
            leave-to-class="opacity-0"
          >
            <div v-if="templateEscolhido" class="mt-6">
              <p class="text-xs font-semibold uppercase tracking-wider text-muted">
                {{ t.criar.jaVemCom }}
              </p>
              <ul class="mt-3 space-y-2">
                <li
                  v-for="(item, i) in templateEscolhido.inclui"
                  :key="item"
                  class="flex animate-[entrada_0.3s_ease-out_both] items-center gap-2 text-sm text-muted"
                  :style="{ animationDelay: `${i * 60}ms` }"
                >
                  <UIcon name="i-lucide-check" class="size-4 shrink-0 text-primary" />
                  {{ item }}
                </li>
              </ul>
            </div>
          </Transition>
        </aside>
      </div>
    </template>
  </UModal>
</template>

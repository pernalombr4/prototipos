<script setup lang="ts">
import { categoriasDeIcone, localidades, templates, type Template } from './mocks'

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
const identidade = ref<'icone' | 'imagem'>('icone')
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
}

function removerLogo() {
  if (form.logo) URL.revokeObjectURL(form.logo)
  form.logo = null
  form.logoNome = ''
  identidade.value = 'icone'
}
const referenciaEditada = ref(false)
const detalhesAbertos = ref(false)
const buscaIcone = ref('')
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
  identidade.value = 'icone'
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
const todosIcones = computed(() => categoriasDeIcone.flatMap(c =>
  c.icones.map(i => ({ ...i, categoria: c.nome }))))

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

const iconesFiltrados = computed(() => {
  const termo = buscaIcone.value.trim().toLowerCase()
  if (!termo) return todosIcones.value
  return todosIcones.value.filter(i =>
    i.nome.toLowerCase().includes(termo) || i.categoria.toLowerCase().includes(termo))
})

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
            <span class="shrink-0 text-xs font-medium text-dimmed">{{ passo }} de 2</span>
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
                Como esse espaço se chama?
              </h2>
              <p class="mt-1.5 text-sm text-muted">
                É o nome que a sua equipe vai procurar na lista. Dá para mudar depois.
              </p>

              <!-- Identidade e nome juntos: é o par que aparece no card, e o
                   logo deixa de ficar escondido atrás de "opcional". -->
              <div class="mt-5 flex items-center gap-3">
                <UPopover :content="{ align: 'start' }">
                  <button
                    type="button"
                    class="group/logo relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-default transition-all duration-200 hover:border-primary hover:shadow-sm"
                    :class="!form.logo && 'bg-elevated'"
                    aria-label="Escolher o logo ou o ícone do espaço"
                  >
                    <img v-if="form.logo" :src="form.logo" alt="" class="size-full object-cover">
                    <UIcon v-else :name="iconeEfetivo" class="size-5 text-muted" />
                    <span class="absolute inset-0 flex items-center justify-center bg-default/70 opacity-0 transition-opacity group-hover/logo:opacity-100">
                      <UIcon name="i-lucide-pencil" class="size-4 text-highlighted" />
                    </span>
                  </button>

                  <template #content>
                    <div class="w-80 p-3">
                      <div class="mb-3 flex gap-0.5 rounded-md border border-default p-0.5">
                        <UButton
                          label="Ícone"
                          icon="i-lucide-shapes"
                          size="xs"
                          block
                          :color="identidade === 'icone' ? 'primary' : 'neutral'"
                          :variant="identidade === 'icone' ? 'soft' : 'ghost'"
                          @click="identidade = 'icone'"
                        />
                        <UButton
                          label="Imagem"
                          icon="i-lucide-image"
                          size="xs"
                          block
                          :color="identidade === 'imagem' ? 'primary' : 'neutral'"
                          :variant="identidade === 'imagem' ? 'soft' : 'ghost'"
                          @click="identidade = 'imagem'"
                        />
                      </div>

                      <!-- Imagem: o logo da empresa -->
                      <div v-if="identidade === 'imagem'">
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
                            Arraste o logo aqui
                          </p>
                          <p class="text-xs text-muted">
                            ou clique para escolher · PNG, JPG ou SVG
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
                            <UButton
                              label="Trocar"
                              icon="i-lucide-refresh-cw"
                              size="xs"
                              color="neutral"
                              variant="subtle"
                              @click="entradaDeArquivo?.click()"
                            />
                            <UButton
                              label="Remover"
                              icon="i-lucide-trash-2"
                              size="xs"
                              color="neutral"
                              variant="ghost"
                              @click="removerLogo"
                            />
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

                      <!-- Ícone: biblioteca, buscável em português -->
                      <div v-else class="space-y-3">
                        <UInput
                          v-model="buscaIcone"
                          icon="i-lucide-search"
                          size="sm"
                          placeholder="Buscar por nome ou categoria"
                          class="w-full"
                        />
                        <div class="max-h-56 overflow-y-auto pr-1">
                          <div v-for="cat in categoriasDeIcone" :key="cat.nome" class="mb-3">
                            <template v-if="cat.icones.some(i => iconesFiltrados.some(f => f.id === i.id))">
                              <p class="mb-1.5 text-xs font-semibold uppercase tracking-wider text-dimmed">
                                {{ cat.nome }}
                              </p>
                              <div class="flex flex-wrap gap-1.5">
                                <UTooltip
                                  v-for="ic in cat.icones.filter(i => iconesFiltrados.some(f => f.id === i.id))"
                                  :key="ic.id"
                                  :text="ic.nome"
                                >
                                  <button
                                    type="button"
                                    class="flex size-8 items-center justify-center rounded-md border transition-all duration-200 hover:-translate-y-0.5"
                                    :class="!form.logo && iconeEfetivo === ic.id
                                      ? 'border-primary bg-primary/10 text-primary'
                                      : 'border-default text-muted hover:border-primary/40'"
                                    @click="escolherIcone(ic.id)"
                                  >
                                    <UIcon :name="ic.id" class="size-4" />
                                  </button>
                                </UTooltip>
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </UPopover>

                <UInput
                  v-model="form.nome"
                  autofocus
                  size="xl"
                  placeholder="Jurídico Aurora, Vértice Log, RH…"
                  class="flex-1"
                  :ui="{ base: 'text-base' }"
                />
              </div>
              <p class="mt-2 h-4 text-xs" :class="nomeCurto ? 'text-error' : 'text-dimmed'">
                {{ nomeCurto ? 'Pelo menos 3 caracteres.' : 'De 3 a 50 caracteres.' }}
              </p>

              <!-- Endereço: consequência do nome, mostrada como endereço mesmo -->
              <div
                v-if="form.nome.length >= 3"
                class="mt-5 animate-[entrada_0.3s_ease-out_both] rounded-lg border border-default bg-elevated/40 px-4 py-3"
              >
                <p class="text-xs font-medium text-dimmed">
                  Endereço do workspace
                </p>
                <p class="mt-1 font-mono text-sm text-muted">
                  enspace.io/<span class="text-primary">{{ form.referencia || '…' }}</span>
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
                Descrição e endereço
                <span class="font-normal text-dimmed">(opcional)</span>
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
                    label="Descrição"
                    :description="`Uma frase dizendo para que serve. ${form.descricao.length}/140`"
                  >
                    <UInput
                      v-model="form.descricao"
                      maxlength="140"
                      placeholder="Ex.: Chamados, RH e jurídico do Grupo Aurora"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField
                    label="Endereço"
                    description="Vem do nome. Mude só se precisar de um endereço específico."
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
                Quer começar de um modelo?
              </h2>
              <p class="mt-1.5 text-sm text-muted">
                Um modelo já traz categorias, formulários e fluxos prontos. Dá para mudar tudo
                depois.
              </p>

              <div class="mt-5 flex flex-wrap items-center gap-2">
                <span class="text-xs font-medium text-dimmed">Modelos de</span>
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
                    <span class="block font-medium text-highlighted">Começar do zero</span>
                    <span class="block text-sm text-muted">
                      Um espaço vazio, montado por você. É o caminho mais comum.
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
                      <span class="block text-sm text-muted">{{ t.descricao }}</span>
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
                    Nenhum modelo para essa localidade
                  </p>
                  <p class="mt-1 text-sm text-muted">
                    Escolha outra acima, ou siga do zero: você não perde nada.
                  </p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- ------------------------- ações ------------------------- -->
          <div class="mt-8 flex items-center justify-between gap-3">
            <UButton
              v-if="passo === 2"
              label="Voltar"
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="ghost"
              @click="passo = 1"
            />
            <UButton
              v-else
              label="Cancelar"
              color="neutral"
              variant="ghost"
              @click="aberto = false"
            />

            <UButton
              v-if="passo === 1"
              label="Continuar"
              trailing-icon="i-lucide-arrow-right"
              :disabled="!podeAvancar"
              class="transition-transform hover:translate-x-0.5"
              @click="passo = 2"
            />
            <UButton
              v-else
              :label="templateEscolhido ? `Criar com ${templateEscolhido.nome}` : 'Criar workspace'"
              icon="i-lucide-check"
              :loading="criando"
              @click="criar"
            />
          </div>
        </div>

        <!-- ------------------------- prévia ao vivo ------------------------- -->
        <aside class="hidden border-l border-default bg-elevated/30 p-6 md:block">
          <p class="text-xs font-semibold uppercase tracking-wider text-dimmed">
            Como vai aparecer
          </p>

          <div class="mt-4 rounded-xl border border-default bg-default p-4 shadow-sm transition-all duration-300">
            <div class="flex size-10 items-center justify-center overflow-hidden rounded-lg" :class="!form.logo && 'bg-elevated'">
              <Transition
                mode="out-in"
                enter-active-class="transition duration-200"
                enter-from-class="opacity-0 scale-50"
                leave-active-class="transition duration-100"
                leave-to-class="opacity-0 scale-50"
              >
                <img v-if="form.logo" :key="form.logo" :src="form.logo" alt="" class="size-full object-cover">
                <UIcon v-else :key="iconeEfetivo" :name="iconeEfetivo" class="size-5 text-muted" />
              </Transition>
            </div>
            <h3 class="mt-3 line-clamp-2 font-medium text-highlighted">
              {{ form.nome || 'Nome do workspace' }}
            </h3>
            <p class="mt-1 line-clamp-2 text-sm text-muted">
              {{ form.descricao || (templateEscolhido ? templateEscolhido.descricao : 'Sem descrição') }}
            </p>
            <p class="mt-1 text-xs text-dimmed">
              Você ainda não entrou aqui
            </p>
            <div class="mt-4 flex items-center justify-between">
              <UBadge label="Proprietário" color="primary" variant="subtle" size="sm" />
              <UBadge label="Entrar" color="neutral" variant="subtle" size="sm" />
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
              <p class="text-xs font-semibold uppercase tracking-wider text-dimmed">
                Já vem com
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

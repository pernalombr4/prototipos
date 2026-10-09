<script setup lang="ts">
import { INICIO_TRAVADOS, SECOES_OCULTAVEIS } from './estado'
import { useTrilha, type AbaDePersonalizar } from './trilha'
import type { TextosDaTela } from './textos'

/**
 * PERSONALIZAR (rodada 15). A janela do ClickUp, aba por aba, como a
 * Mikaela mostrou:
 *
 *   Navegação  o que aparece na trilha (Início travado) e a aparência dela,
 *              "Somente ícones" ou "Ícones e rótulos";
 *   Início     quais itens nativos aparecem no menu Início. A ordem é fixa;
 *              o que sai daqui vai para "⋯ Mais";
 *   Seções     a ordem das seções, arrastando. Só Favoritos se oculta, e
 *              "Criar seção" abre a janela de criar;
 *   Temas      claro, escuro ou automático, e a cor de destaque.
 *
 * Tudo vale na hora, como lá: não há botão de salvar nesta janela.
 */
interface Opcao { id: string, rotulo: string, icone: string }

const props = defineProps<{
  t: TextosDaTela
  /** Todas as áreas que existem agora, Início incluído, na ordem do produto. */
  areas: Opcao[]
  /** Os itens nativos do Início, na ordem fixa. */
  itensDoInicio: Opcao[]
  /** As seções do Início, já na ordem guardada. */
  secoes: Opcao[]
}>()

const trilha = useTrilha()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const aba = computed({
  get: () => trilha.personalizar.value ?? 'navegacao',
  set: (v: AbaDePersonalizar) => { trilha.personalizar.value = v },
})
const aberta = computed({
  get: () => trilha.personalizar.value !== null,
  set: (v) => { if (!v) trilha.personalizar.value = null },
})

const abas = computed(() => [
  { label: props.t.abaNavegacao, value: 'navegacao' },
  { label: props.t.abaInicio, value: 'inicio' },
  { label: props.t.abaSecoes, value: 'secoes' },
  { label: props.t.abaTemas, value: 'temas' },
])

/* ------------------------------ Navegação ------------------------------ */

const idsDasAreas = computed(() => props.areas.map(a => a.id))

function naTrilha(id: string) {
  return id === 'inicio' || trilha.prefs.value.fixadas.includes(id)
}

function alternarNaTrilha(id: string, v: boolean | 'indeterminate') {
  if (v === true) trilha.fixar(id, idsDasAreas.value)
  else trilha.desafixar(id)
}

/* ------------------------------ Início ------------------------------ */

function noInicio(id: string) {
  return !trilha.prefs.value.inicioOcultos.includes(id)
}

/* ------------------------------ Seções ------------------------------ */

const ocultas = computed(() => props.secoes.filter(s => trilha.prefs.value.secoesOcultas.includes(s.id)))
const visiveis = computed(() => props.secoes.filter(s => !trilha.prefs.value.secoesOcultas.includes(s.id)))

const arrastando = ref<string | null>(null)
const mira = ref<{ id: string, posicao: 'antes' | 'depois' } | null>(null)

function passar(e: DragEvent, id: string) {
  if (!arrastando.value || arrastando.value === id) return
  e.preventDefault()
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  mira.value = { id, posicao: e.clientY - r.top < r.height / 2 ? 'antes' : 'depois' }
}

function soltar(e: DragEvent) {
  e.preventDefault()
  if (arrastando.value && mira.value) {
    trilha.reordenarSecoesJa(arrastando.value, mira.value.id, mira.value.posicao, props.secoes.map(s => s.id))
  }
  arrastando.value = null
  mira.value = null
}

/** O teclado faz o mesmo que o arraste: Alt com as setas. */
function teclar(e: KeyboardEvent, id: string) {
  if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return
  e.preventDefault()
  const lista = visiveis.value.map(s => s.id)
  const i = lista.indexOf(id)
  const vizinho = lista[i + (e.key === 'ArrowUp' ? -1 : 1)]
  if (vizinho) trilha.reordenarSecoesJa(id, vizinho, e.key === 'ArrowUp' ? 'antes' : 'depois', props.secoes.map(s => s.id))
}

/* ------------------------------ Temas ------------------------------ */

const aparencias = computed(() => [
  { valor: 'light', rotulo: props.t.temaClaro },
  { valor: 'dark', rotulo: props.t.temaEscuro },
  { valor: 'system', rotulo: props.t.temaAuto },
])

/*
 * A cor de destaque troca o `primary` em tempo de execução, só nesta aba do
 * navegador. As quatro vêm da paleta que o tema do ENSPACE já declara: nada
 * de cor nova. O app.config.ts (cópia do en-docs) não é tocado.
 */
const cores = ['fuchsia', 'purple', 'cyan', 'teal'] as const
const corAtual = computed(() => appConfig.ui.colors.primary)
function escolherCor(c: string) {
  appConfig.ui.colors.primary = c
}
</script>

<template>
  <UModal
    v-model:open="aberta"
    :title="props.t.personalizarTitulo"
    :description="props.t.personalizarDica"
    :ui="{ content: 'max-w-lg', body: 'min-h-[26rem]' }"
  >
    <template #body>
      <UTabs v-model="aba" :items="abas" :content="false" size="sm" class="mb-4" />

      <!-- ==================== Navegação ==================== -->
      <div v-if="aba === 'navegacao'" class="animate-[entrada_0.2s_ease-out_both] space-y-4">
        <ul class="space-y-2">
          <li v-for="a in props.areas" :key="a.id">
            <UCheckbox
              :model-value="naTrilha(a.id)"
              :disabled="a.id === 'inicio'"
              :description="a.id === 'inicio' ? props.t.navInicioDica : undefined"
              @update:model-value="v => alternarNaTrilha(a.id, v)"
            >
              <template #label>
                <span class="inline-flex items-center gap-2">
                  <UIcon :name="a.icone" class="size-4 text-toned" />
                  {{ a.rotulo }}
                </span>
              </template>
            </UCheckbox>
          </li>
        </ul>

        <USeparator />

        <div>
          <p class="mb-2 text-sm font-semibold text-highlighted">{{ props.t.aparencia }}</p>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="op in [{ v: false, r: props.t.soIcones }, { v: true, r: props.t.iconesERotulos }]"
              :key="String(op.v)"
              type="button"
              class="rounded-lg border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              :class="trilha.prefs.value.rotulos === op.v ? 'border-primary ring-1 ring-primary' : 'border-default hover:bg-elevated'"
              :aria-pressed="trilha.prefs.value.rotulos === op.v"
              @click="trilha.alternarRotulos(op.v)"
            >
              <!-- A miniatura: a trilha com ou sem o tracinho do rótulo. -->
              <span class="mb-2 flex h-16 gap-1.5 rounded-md bg-elevated p-1.5" aria-hidden="true">
                <span class="flex w-6 flex-col items-center gap-1 rounded bg-accented py-1">
                  <template v-for="n in 3" :key="n">
                    <span class="size-2.5 rounded-sm bg-inverted/25" />
                    <span v-if="op.v" class="h-0.5 w-3 rounded bg-inverted/25" />
                  </template>
                </span>
                <span class="flex-1 rounded bg-default" />
              </span>
              <span class="text-sm text-default">{{ op.r }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== Início ==================== -->
      <ul v-else-if="aba === 'inicio'" class="animate-[entrada_0.2s_ease-out_both] space-y-2">
        <li v-for="i in props.itensDoInicio" :key="i.id">
          <UCheckbox
            :model-value="noInicio(i.id)"
            :disabled="INICIO_TRAVADOS.includes(i.id)"
            :description="INICIO_TRAVADOS.includes(i.id) ? props.t.inicioTravado : undefined"
            @update:model-value="v => trilha.mostrarNoInicio(i.id, v === true)"
          >
            <template #label>
              <span class="inline-flex items-center gap-2">
                <UIcon :name="i.icone" class="size-4 text-toned" />
                {{ i.rotulo }}
              </span>
            </template>
          </UCheckbox>
        </li>
      </ul>

      <!-- ==================== Seções ==================== -->
      <div v-else-if="aba === 'secoes'" class="animate-[entrada_0.2s_ease-out_both]">
        <ul class="space-y-1.5" @dragover.prevent @drop="soltar">
          <li
            v-for="s in visiveis"
            :key="s.id"
            class="group relative flex items-center gap-2 rounded-lg border border-default bg-default px-2.5 py-2 text-sm text-default transition-opacity focus-visible:outline-2 focus-visible:outline-primary"
            :class="[
              arrastando === s.id ? 'opacity-40' : '',
              mira?.id === s.id && mira.posicao === 'antes' ? 'before:absolute before:inset-x-1 before:-top-1 before:h-0.5 before:rounded-full before:bg-primary' : '',
              mira?.id === s.id && mira.posicao === 'depois' ? 'after:absolute after:inset-x-1 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary' : '',
            ]"
            draggable="true"
            tabindex="0"
            @dragstart="arrastando = s.id"
            @dragover="e => passar(e, s.id)"
            @dragend="arrastando = null; mira = null"
            @keydown="e => teclar(e, s.id)"
          >
            <UIcon name="i-lucide-grip-vertical" class="size-4 shrink-0 cursor-grab text-toned" aria-hidden="true" />
            <UIcon :name="s.icone" class="size-4 shrink-0 text-toned" />
            <span class="min-w-0 flex-1 truncate">{{ s.rotulo }}</span>
            <UTooltip v-if="SECOES_OCULTAVEIS.includes(s.id)" :text="props.t.ocultarSecao">
              <UButton
                icon="i-lucide-eye-off"
                size="xs"
                color="neutral"
                variant="ghost"
                class="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                :aria-label="`${props.t.ocultarSecao}: ${s.rotulo}`"
                @click="trilha.ocultarSecao(s.id, true)"
              />
            </UTooltip>
          </li>
          <li>
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-lg border border-default px-2.5 py-2 text-sm text-default transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
              @click="trilha.criandoSecao.value = 'nova'"
            >
              <UIcon name="i-lucide-plus" class="size-4 text-toned" />
              {{ props.t.criarSecaoRotulo }}
            </button>
          </li>
        </ul>

        <p class="mb-1 mt-5 text-xs font-semibold text-toned">{{ props.t.secoesOcultasTitulo }}</p>
        <p v-if="!ocultas.length" class="text-xs text-muted">{{ props.t.todasSecoesMostradas }}</p>
        <ul v-else class="space-y-1">
          <li v-for="s in ocultas" :key="s.id" class="flex items-center gap-2 px-1 py-1 text-sm text-muted">
            <UIcon :name="s.icone" class="size-4 shrink-0" />
            <span class="min-w-0 flex-1 truncate">{{ s.rotulo }}</span>
            <UButton
              icon="i-lucide-eye"
              size="xs"
              color="neutral"
              variant="ghost"
              :aria-label="`${props.t.mostrarNoMenu}: ${s.rotulo}`"
              @click="trilha.ocultarSecao(s.id, false)"
            />
          </li>
        </ul>
      </div>

      <!-- ==================== Temas ==================== -->
      <div v-else class="animate-[entrada_0.2s_ease-out_both] space-y-5">
        <div>
          <p class="mb-2 text-sm font-semibold text-highlighted">{{ props.t.aparencia }}</p>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="a in aparencias"
              :key="a.valor"
              type="button"
              class="rounded-lg border p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              :class="colorMode.preference === a.valor ? 'border-primary ring-1 ring-primary' : 'border-default hover:bg-elevated'"
              :aria-pressed="colorMode.preference === a.valor"
              @click="colorMode.preference = a.valor"
            >
              <span
                class="mb-1.5 block h-12 overflow-hidden rounded-md border border-default"
                :class="a.valor === 'dark' ? 'bg-neutral-900' : a.valor === 'light' ? 'bg-neutral-50' : 'bg-gradient-to-r from-neutral-50 from-50% to-neutral-900 to-50%'"
                aria-hidden="true"
              />
              <span class="text-sm text-default">{{ a.rotulo }}</span>
            </button>
          </div>
        </div>

        <div>
          <p class="mb-0.5 text-sm font-semibold text-highlighted">{{ props.t.corDeDestaque }}</p>
          <p class="mb-2 text-xs text-muted">{{ props.t.corDica }}</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="c in cores"
              :key="c"
              type="button"
              class="flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm text-default transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              :class="corAtual === c ? 'border-primary ring-1 ring-primary' : 'border-default hover:bg-elevated'"
              :aria-pressed="corAtual === c"
              @click="escolherCor(c)"
            >
              <span
                class="size-4 shrink-0 rounded"
                :class="{ 'bg-fuchsia-500': c === 'fuchsia', 'bg-purple-500': c === 'purple', 'bg-cyan-500': c === 'cyan', 'bg-teal-500': c === 'teal' }"
                aria-hidden="true"
              />
              {{ props.t.cores[c] }}
              <UIcon v-if="corAtual === c" name="i-lucide-check" class="ml-auto size-4 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

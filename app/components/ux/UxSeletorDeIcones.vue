<script setup lang="ts">
import { biblioteca, categoriasDeIcone, curadoria, totalDeIcones } from './icones'

/**
 * Seletor de ícone para biblioteca grande.
 *
 * O problema: a biblioteca do ENSPACE passa de 50 mil ícones. Grade fixa com
 * algumas dezenas serve ao mock e não ao produto; grade com tudo dentro não
 * cabe no DOM nem na cabeça de quem procura.
 *
 * As três decisões que fazem isso funcionar em escala:
 *
 * 1. A BUSCA É A NAVEGAÇÃO. Sem busca não se mostra a biblioteca: mostra-se
 *    uma curadoria que resolve o caso comum em um clique. Com busca, a
 *    biblioteca inteira responde.
 * 2. A GRADE É VIRTUALIZADA. Só as linhas visíveis existem no DOM, então
 *    2 mil ou 50 mil resultados custam o mesmo para a tela.
 * 3. A BUSCA ENTENDE PORTUGUÊS E IGNORA ACENTO. Quem procura "balança" acha
 *    `scale`. O produto hoje só acha pelo slug em inglês.
 *
 * As categorias são atalho para quem não sabe o que procurar, nunca a forma
 * principal de achar.
 */

const props = withDefaults(defineProps<{
  /** Altura da área de rolagem da grade, em pixels. */
  altura?: number
}>(), { altura: 288 })

/** O nome do ícone, sem prefixo de coleção. Ex.: `file-signature`. */
const escolhido = defineModel<string>()

const CELULA = 44

function normaliza(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/**
 * Vocabulário de negócio: o que as pessoas digitam quando procuram um ícone
 * para um workspace, e que não é o nome do ícone em inglês.
 *
 * A biblioteca gerada já traz o nome em inglês e alguns sinônimos, mas fica
 * devendo justamente as palavras do dia a dia de quem configura. Esta camada
 * mora aqui, e não no arquivo gerado, porque ela é curadoria: muda com o
 * negócio, não com a versão do pacote de ícones.
 */
const SINONIMOS: Record<string, string[]> = {
  'contrato': ['file-signature', 'file-check', 'file-text', 'stamp', 'handshake', 'scroll-text'],
  'assinatura': ['file-signature', 'pen-tool', 'signature', 'stamp'],
  'juridico': ['scale', 'gavel', 'landmark', 'shield-check', 'book-marked'],
  'processo': ['gavel', 'scale', 'folder-open', 'file-clock'],
  'fornecedor': ['truck', 'package', 'factory', 'building-2', 'handshake'],
  'cliente': ['users', 'user-round', 'heart-handshake', 'contact', 'smile'],
  'pessoas': ['users', 'user-plus', 'contact', 'id-card', 'users-round'],
  'equipe': ['users', 'users-round', 'user-check'],
  'financeiro': ['calculator', 'banknote', 'coins', 'wallet', 'chart-line', 'piggy-bank'],
  'dinheiro': ['banknote', 'coins', 'wallet', 'circle-dollar-sign'],
  'pagamento': ['credit-card', 'banknote', 'receipt', 'wallet'],
  'nota fiscal': ['receipt', 'file-text', 'calculator'],
  'imposto': ['receipt', 'calculator', 'landmark', 'percent'],
  'prazo': ['clock', 'alarm-clock', 'calendar-clock', 'hourglass', 'timer'],
  'agenda': ['calendar', 'calendar-days', 'calendar-check'],
  'tarefa': ['list-checks', 'check-square', 'clipboard-list', 'square-check'],
  'chamado': ['life-buoy', 'headset', 'message-circle', 'ticket', 'inbox'],
  'suporte': ['life-buoy', 'headset', 'message-circle-question'],
  'obra': ['hard-hat', 'crane', 'hammer', 'building', 'ruler'],
  'frota': ['truck', 'car', 'bus', 'fuel', 'map-pin'],
  'entrega': ['truck', 'package', 'package-check', 'map-pin'],
  'estoque': ['boxes', 'package', 'warehouse', 'clipboard-list'],
  'compra': ['shopping-cart', 'shopping-bag', 'package', 'receipt'],
  'venda': ['shopping-cart', 'chart-line', 'handshake', 'tag'],
  'documento': ['file-text', 'files', 'folder', 'paperclip', 'archive'],
  'auditoria': ['search-check', 'clipboard-check', 'shield-check', 'file-search'],
  'seguranca': ['shield', 'shield-check', 'lock', 'key', 'eye-off'],
  'saude': ['cross', 'stethoscope', 'heart-pulse', 'pill', 'syringe'],
  'treinamento': ['graduation-cap', 'book-open', 'presentation', 'lightbulb'],
  'tecnologia': ['cpu', 'server', 'database', 'code', 'cloud', 'bug'],
  'imovel': ['building', 'building-2', 'home', 'key', 'map-pin'],
  'relatorio': ['chart-line', 'chart-bar', 'file-chart-column', 'presentation'],
  'aprovacao': ['check-check', 'thumbs-up', 'badge-check', 'stamp'],
  'risco': ['triangle-alert', 'shield-alert', 'octagon-alert', 'flame'],
}

const busca = ref('')
const categoria = ref<string | null>(null)
const buscando = computed(() => busca.value.trim().length > 0)

const resultado = computed(() => {
  const termo = normaliza(busca.value.trim())
  if (termo) {
    // O que o vocabulário de negócio indica vem primeiro: é a intenção de quem
    // digitou "contrato", e não a coincidência de letras em outro nome.
    const porSignificado = new Set<string>()
    for (const [palavra, nomes] of Object.entries(SINONIMOS)) {
      if (normaliza(palavra).includes(termo)) nomes.forEach(n => porSignificado.add(n))
    }
    const porNome = biblioteca.filter(([nome, termos]) =>
      !porSignificado.has(nome) && normaliza(termos).includes(termo))
    return [
      ...biblioteca.filter(([nome]) => porSignificado.has(nome)),
      ...porNome,
    ]
  }
  if (categoria.value) {
    const nomes = categoriasDeIcone.find(c => c.nome === categoria.value)?.icones ?? []
    return biblioteca.filter(([nome]) => nomes.includes(nome))
  }
  return []
})

/* ---- virtualização: só as linhas visíveis existem no DOM ---- */

const grade = ref<HTMLElement>()
const rolagem = ref(0)
const largura = ref(0)

const colunas = computed(() => Math.max(1, Math.floor(largura.value / CELULA) || 8))
const totalDeLinhas = computed(() => Math.ceil(resultado.value.length / colunas.value))
const alturaTotal = computed(() => totalDeLinhas.value * CELULA)

const primeiraLinha = computed(() => Math.max(0, Math.floor(rolagem.value / CELULA) - 1))
const ultimaLinha = computed(() =>
  Math.min(totalDeLinhas.value, primeiraLinha.value + Math.ceil(props.altura / CELULA) + 2))

const visiveis = computed(() =>
  resultado.value.slice(primeiraLinha.value * colunas.value, ultimaLinha.value * colunas.value))

function aoRolar(e: Event) {
  rolagem.value = (e.target as HTMLElement).scrollTop
}

function medir() {
  largura.value = grade.value?.clientWidth ?? 0
}

onMounted(() => {
  medir()
  window.addEventListener('resize', medir)
})

onBeforeUnmount(() => window.removeEventListener('resize', medir))

// Busca nova volta ao topo: continuar no meio da rolagem antiga desorienta.
watch(resultado, () => {
  rolagem.value = 0
  if (grade.value) grade.value.scrollTop = 0
  nextTick(medir)
})

function escolherCategoria(nome: string) {
  categoria.value = categoria.value === nome ? null : nome
  busca.value = ''
}
</script>

<template>
  <div>
    <UInput
      v-model="busca"
      icon="i-lucide-search"
      placeholder="Buscar ícone (contrato, balança, caminhão...)"
      autofocus
      class="w-full"
      @update:model-value="categoria = null"
    />

    <!-- atalhos por assunto, para quem não sabe o que procurar -->
    <div v-if="!buscando" class="mt-3 flex flex-wrap gap-1.5">
      <button
        v-for="c in categoriasDeIcone"
        :key="c.nome"
        type="button"
        class="rounded-full border px-2.5 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :class="categoria === c.nome
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-default text-muted hover:bg-elevated hover:text-highlighted'"
        :aria-pressed="categoria === c.nome"
        @click="escolherCategoria(c.nome)"
      >
        {{ c.nome }}
      </button>
    </div>

    <p class="mt-3 text-xs text-muted">
      <template v-if="buscando || categoria">
        {{ resultado.length.toLocaleString('pt-BR') }}
        {{ resultado.length === 1 ? 'ícone encontrado' : 'ícones encontrados' }}
      </template>
      <template v-else>
        Os mais usados. Busque para alcançar os
        {{ totalDeIcones.toLocaleString('pt-BR') }} da biblioteca.
      </template>
    </p>

    <!-- sem busca: a curadoria, que cabe na tela e resolve o caso comum -->
    <div
      v-if="!buscando && !categoria"
      class="mt-2 grid grid-cols-8 gap-1 sm:grid-cols-12"
    >
      <button
        v-for="nome in curadoria"
        :key="nome"
        type="button"
        class="flex aspect-square items-center justify-center rounded-lg border transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :class="escolhido === nome
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-transparent text-muted hover:border-default hover:bg-elevated hover:text-highlighted'"
        :aria-label="nome"
        :aria-pressed="escolhido === nome"
        @click="escolhido = nome"
      >
        <UIcon :name="`lucide:${nome}`" class="size-5" />
      </button>
    </div>

    <!-- com busca ou categoria: a biblioteca, virtualizada -->
    <div
      v-else
      ref="grade"
      class="mt-2 overflow-y-auto rounded-lg border border-default"
      :style="`height: ${altura}px`"
      @scroll="aoRolar"
    >
      <div v-if="resultado.length" :style="`height: ${alturaTotal}px; position: relative`">
        <div
          class="absolute inset-x-0 grid"
          :style="`top: ${primeiraLinha * CELULA}px; grid-template-columns: repeat(${colunas}, minmax(0, 1fr))`"
        >
          <button
            v-for="[nome] in visiveis"
            :key="nome"
            type="button"
            class="flex items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :style="`height: ${CELULA}px`"
            :class="escolhido === nome
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-transparent text-muted hover:bg-elevated hover:text-highlighted'"
            :aria-label="nome"
            :aria-pressed="escolhido === nome"
            :title="nome"
            @click="escolhido = nome"
          >
            <UIcon :name="`lucide:${nome}`" class="size-5" />
          </button>
        </div>
      </div>

      <UEmpty
        v-else
        icon="i-lucide-search-x"
        title="Nenhum ícone com esse termo"
        description="Tente outra palavra: a busca aceita português e ignora acento."
        class="py-10"
      />
    </div>

    <p v-if="escolhido" class="mt-3 flex items-center gap-2 text-sm text-muted">
      <UIcon :name="`lucide:${escolhido}`" class="size-5 text-primary" />
      Escolhido: <span class="font-medium text-highlighted">{{ escolhido }}</span>
    </p>
  </div>
</template>

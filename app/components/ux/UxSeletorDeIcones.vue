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

const busca = ref('')
const categoria = ref<string | null>(null)
const buscando = computed(() => busca.value.trim().length > 0)

const resultado = computed(() => {
  const termo = normaliza(busca.value.trim())
  if (termo) return biblioteca.filter(([, termos]) => normaliza(termos).includes(termo))
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

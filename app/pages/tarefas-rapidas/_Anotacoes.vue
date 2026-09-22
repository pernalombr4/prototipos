<script setup lang="ts">
/**
 * ANDAIME: os balões e as setas que apontam cada peça da tela.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Este componente não vai para o produto: ele existe
 * para a tela se explicar sozinha, no lugar de um print com seta desenhada por
 * cima. É o "redline" de entrega de design, e some junto com o estado.
 *
 * Como funciona: o conteúdo entra pelo slot, e cada peça que quer ser apontada
 * carrega um `data-selo="<chave>"`. O componente mede a posição real de cada
 * uma (`getBoundingClientRect`), empilha os balões na coluna da esquerda ou da
 * direita sem deixar um cobrir o outro, e desenha a curva de cada balão até o
 * seu alvo, com o contorno tracejado em volta e o número no ponto exato.
 *
 * Medir é a única forma que funciona: posição fixa escrita à mão quebra no
 * primeiro texto que muda de tamanho, e este protótipo troca de idioma, de
 * tema e de densidade do cartão.
 */
import type { Selo } from './selos'

const props = withDefaults(defineProps<{
  selos: Selo[]
  /** Largura da coluna de balões, dos dois lados. */
  largura?: number
  /** Espaço entre a coluna e o conteúdo, onde as setas correm. */
  folga?: number
  /**
   * Quanto o conteúdo precisa para não ser esmagado pelas colunas. Sem isto,
   * numa janela estreita o alvo escorrega para debaixo dos balões, e a seta
   * aponta para onde a peça não está.
   */
  conteudo?: number
  /** Painel lateral: só sobra espaço de um lado. */
  apenasEsquerda?: boolean
  /** Muda quando algo que mexe no tamanho muda (idioma, densidade, aba). */
  refazer?: string | number
  /**
   * Quem está aceso agora. Quando o pai manda (a legenda passando o mouse numa
   * linha), ele manda; sem isso, o componente se vira com o próprio hover.
   */
  destaque?: string | null
}>(), { largura: 236, folga: 64, conteudo: 320, apenasEsquerda: false, refazer: '', destaque: undefined })

/** A largura que o bloco inteiro precisa ter para o desenho fechar. */
const larguraMinima = computed(() =>
  props.conteudo + (props.largura + props.folga) * (props.apenasEsquerda ? 1 : 2))

const area = ref<HTMLElement | null>(null)
const balaoEl = new Map<string, HTMLElement>()

function guardarBalao(chave: string, el: unknown) {
  if (el instanceof HTMLElement) balaoEl.set(chave, el)
  else balaoEl.delete(chave)
}

interface Desenho {
  /** O id do selo: e por ele que o balao, a seta e o destaque se acham. */
  id: string
  /** O `data-selo` do elemento na tela, que pode repetir entre selos. */
  chave: string
  numero: number
  topo: number
  lado: 'esquerda' | 'direita'
  caminho: string
  discoX: number
  discoY: number
  contorno: { x: number, y: number, w: number, h: number }
}

const desenhos = ref<Desenho[]>([])
const pronto = ref(false)
/**
 * A pilha de balões costuma ser mais alta que o alvo: um cartão de 300 px tem
 * dezessete peças apontadas. Sem reservar essa altura, os balões de baixo
 * caem por cima da seção seguinte.
 */
const alturaReservada = ref(0)

/**
 * ⚠️ AQUI MORA A ARMADILHA DESTE COMPONENTE, e ela custou uma aba travada.
 *
 * Medir muda o desenho, o desenho muda a altura da pilha, a altura muda a
 * barra de rolagem, a barra muda a largura, e a largura muda a medida. Um
 * ResizeObserver na própria área fecha esse ciclo e o navegador gira nele para
 * sempre. Três guardas, e as três são necessárias:
 *
 *   1. a medida só entra na tela quando mudou de verdade;
 *   2. nunca mais de uma medida por quadro;
 *   3. o observador olha o CONTEÚDO, não a área: o conteúdo não depende do
 *      desenho, então ele não pode realimentar a conta. E ainda assim existe
 *      um teto de medidas seguidas, porque guarda que depende de raciocínio
 *      meu sobre layout é guarda que falha.
 */
let ultimaMedida = ''
let agendada = false
let seguidas = 0
const TETO_DE_MEDIDAS = 40

const porId = computed(() => {
  const m = new Map<string, Desenho>()
  for (const d of desenhos.value) m.set(d.id, d)
  return m
})

/** O lado de cada balão. Sem espaço à direita, todos vão para a esquerda. */
function ladoDo(selo: Selo): 'esquerda' | 'direita' {
  return props.apenasEsquerda ? 'esquerda' : selo.lado
}

function medir() {
  const raiz = area.value
  if (!raiz || seguidas > TETO_DE_MEDIDAS) return

  const base = raiz.getBoundingClientRect()
  if (!base.width) return
  seguidas += 1

  const alvos = props.selos
    .map((selo) => {
      const el = raiz.querySelector<HTMLElement>(`[data-selo="${selo.chave}"]`)
      if (!el) return null
      const r = el.getBoundingClientRect()
      // Peça desligada pela barra, ou fora da vista: não tem o que apontar.
      if (!r.width || !r.height) return null
      return { selo, x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height }
    })
    .filter(a => a !== null)

  const saida: Desenho[] = []
  let maisBaixo = 0

  for (const lado of ['esquerda', 'direita'] as const) {
    // Pelo CENTRO, não pelo topo: o selo do cartão inteiro começa em zero e,
    // ordenado pelo topo, ele empurraria a pilha toda para baixo do próprio
    // meio, deixando cada seta apontando 180 px acima do seu balão.
    // Empate de linha (o rodapé do cartão tem seis peças na mesma altura)
    // desempata pela posição horizontal, senão a coluna de balões conta a
    // linha numa ordem que não é a que o olho vê.
    const faixa = (a: typeof alvos[number]) => Math.round((a.y + a.h / 2) / 8)
    const doLado = alvos
      .filter(a => ladoDo(a.selo) === lado)
      .sort((a, b) => faixa(a) - faixa(b) || a.x - b.x)
    let piso = 0

    for (const alvo of doLado) {
      const altura = balaoEl.get(alvo.selo.id)?.offsetHeight ?? 64
      const centro = alvo.y + alvo.h / 2
      const topo = Math.max(piso, centro - altura / 2)
      piso = topo + altura + 8
      maisBaixo = Math.max(maisBaixo, piso)

      // De onde a seta sai (a borda interna da coluna) e onde ela chega.
      const saidaX = lado === 'esquerda' ? props.largura : base.width - props.largura
      const saidaY = topo + altura / 2
      const ancoraX = lado === 'esquerda' ? alvo.x - 6 : alvo.x + alvo.w + 6
      const ancoraY = centro
      // A curva precisa de barriga mesmo quando o caminho é curto, senão os
      // dois pontos de controle se cruzam e a linha sai torta.
      const vao = ancoraX - saidaX
      const curva = Math.sign(vao) * Math.max(28, Math.abs(vao) * 0.5)

      saida.push({
        id: alvo.selo.id,
        chave: alvo.selo.chave,
        numero: alvo.selo.numero,
        lado,
        topo,
        caminho: `M ${saidaX} ${saidaY} C ${saidaX + curva} ${saidaY}, ${ancoraX - curva} ${ancoraY}, ${ancoraX} ${ancoraY}`,
        discoX: ancoraX,
        discoY: ancoraY,
        contorno: { x: alvo.x - 3, y: alvo.y - 3, w: alvo.w + 6, h: alvo.h + 6 },
      })
    }
  }

  const assinatura = saida
    .map(d => `${d.id}:${Math.round(d.topo)}:${Math.round(d.discoX)}:${Math.round(d.discoY)}`)
    .join('|')
  pronto.value = true
  alturaReservada.value = Math.ceil(maisBaixo)
  if (assinatura === ultimaMedida) return
  ultimaMedida = assinatura
  desenhos.value = saida
}

function agendarMedida() {
  if (agendada) return
  agendada = true
  requestAnimationFrame(() => {
    agendada = false
    medir()
  })
}

/** Mudou de fora: o teto se renova, porque não é ciclo, é a pessoa mexendo. */
function medirDeNovo() {
  seguidas = 0
  agendarMedida()
}

/** Duas passadas: a primeira mede o balão, a segunda já usa a altura dele. */
async function remedir() {
  seguidas = 0
  await nextTick()
  medir()
  agendarMedida()
}

let observador: ResizeObserver | null = null

onMounted(() => {
  remedir()
  // A entrada em cascata das raias e do painel termina em pouco menos de meio
  // segundo. Medir antes disso devolve a posição de onde a peça estava vindo.
  setTimeout(() => { seguidas = 0; medir() }, 450)

  const conteudo = area.value?.firstElementChild
  if (conteudo && typeof ResizeObserver !== 'undefined') {
    observador = new ResizeObserver(medirDeNovo)
    observador.observe(conteudo)
  }
  window.addEventListener('resize', medirDeNovo)
})

onBeforeUnmount(() => {
  observador?.disconnect()
  window.removeEventListener('resize', medirDeNovo)
})

watch(() => [props.selos, props.refazer], remedir, { deep: true })

const emit = defineEmits<{ destacar: [chave: string | null] }>()

const proprioFoco = ref<string | null>(null)
const emFoco = computed(() => props.destaque !== undefined ? props.destaque : proprioFoco.value)

function focar(chave: string | null) {
  proprioFoco.value = chave
  emit('destacar', chave)
}

defineExpose({ medir, remedir })
</script>

<template>
  <div
    ref="area"
    class="relative"
    :style="{
      paddingLeft: `${largura + folga}px`,
      paddingRight: apenasEsquerda ? '0px' : `${largura + folga}px`,
      minWidth: `${larguraMinima}px`,
      // No painel a altura é a da tela, e esticar aqui criaria uma rolagem que
      // o painel não tem.
      minHeight: !apenasEsquerda && alturaReservada ? `${alturaReservada}px` : undefined,
    }"
  >
    <slot />

    <!-- As setas e os contornos, por cima de tudo e sem roubar o clique -->
    <svg
      class="pointer-events-none absolute inset-0 size-full overflow-visible text-primary"
      aria-hidden="true"
    >
      <g
        v-for="d in desenhos"
        :key="d.id"
        :opacity="emFoco && emFoco !== d.id ? 0.18 : 1"
        class="transition-opacity duration-150"
      >
        <rect
          :x="d.contorno.x"
          :y="d.contorno.y"
          :width="d.contorno.w"
          :height="d.contorno.h"
          rx="6"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-dasharray="4 3"
          :opacity="emFoco === d.id ? 0.9 : 0.45"
        />
        <path
          :d="d.caminho"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          :opacity="emFoco === d.id ? 0.95 : 0.6"
        />
      </g>
    </svg>

    <!-- O número, cravado no ponto exato da peça -->
    <span
      v-for="d in desenhos"
      :key="`n-${d.id}`"
      class="pointer-events-none absolute z-20 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center
             rounded-full bg-primary text-[10px] font-bold text-inverted shadow transition-opacity duration-150"
      :style="{ left: `${d.discoX}px`, top: `${d.discoY}px` }"
      :class="emFoco && emFoco !== d.id ? 'opacity-30' : ''"
    >
      {{ d.numero }}
    </span>

    <!-- Os balões. Ficam no DOM mesmo sem alvo, senão não dá para medi-los. -->
    <div
      v-for="selo in selos"
      :key="selo.id"
      :ref="el => guardarBalao(selo.id, el)"
      class="absolute z-10 rounded-lg border bg-default p-2 shadow-sm transition-[opacity,border-color] duration-200"
      :class="[
        porId.has(selo.id) && pronto ? 'opacity-100' : 'pointer-events-none opacity-0',
        emFoco === selo.id ? 'border-primary shadow-md' : 'border-default',
        emFoco && emFoco !== selo.id ? 'opacity-40' : '',
      ]"
      :style="{
        width: `${largura}px`,
        top: `${porId.get(selo.id)?.topo ?? 0}px`,
        left: porId.get(selo.id)?.lado === 'direita' ? 'auto' : '0px',
        right: porId.get(selo.id)?.lado === 'direita' ? '0px' : 'auto',
      }"
      @mouseenter="focar(selo.id)"
      @mouseleave="focar(null)"
    >
      <div class="flex items-start gap-2">
        <span
          class="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-inverted"
        >
          {{ selo.numero }}
        </span>
        <div class="min-w-0">
          <p class="text-xs font-semibold leading-tight text-highlighted">{{ selo.rotulo }}</p>
          <code class="mt-0.5 block break-words text-[10px] leading-tight text-muted">{{ selo.campo }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * A barra que acompanha a proposta do BENI dentro do texto. PROPOSTA.
 *
 * Copiada do Notion atual (evidencias/ref-notion-resultado-da-ia.png) e da
 * Tiptap (ref-tiptap-resultado-da-ia.png): o texto novo já aparece no lugar
 * e esta barra decide. Aceitar (Enter), Descartar (Esc), Tentar de novo,
 * Inserir abaixo, um campo para pedir ajuste, 👍 e 👎. Pedido livre ganha
 * "Salvar pedido" (os Skills do Notion). O Revisor mostra o que mudou.
 */
import type { Textos } from './textos'
import type { AgenteDoCampo } from './mocks'
import AvatarDoAgente from './_AvatarDoAgente.vue'

const props = defineProps<{
  t: Textos
  fase: 'gerando' | 'pronto' | 'erro'
  rotulo: string
  agente: AgenteDoCampo | null
  modelo: string
  comSelecao: boolean
  notas?: string[]
  semRoteiro?: boolean
  interrompido?: boolean
  podeSalvar?: boolean
}>()

const emit = defineEmits<{
  aceitar: []
  abaixo: []
  descartar: []
  tentar: []
  parar: []
  ajustar: [pedido: string]
  salvar: [nome: string]
  feedback: [bom: boolean]
}>()

const tb = computed(() => props.t.beni)
const ajuste = ref('')
const nomeDoPedido = ref('')
const salvarAberto = ref(false)
const votou = ref<boolean | null>(null)
const botaoAceitar = useTemplateRef<{ $el: HTMLElement }>('botaoAceitar')

const quem = computed(() => props.agente?.name ?? props.t.agente.beni)
const escrevendo = computed(() => props.agente ? tb.value.escrevendoAgente(props.agente.name) : tb.value.escrevendoBeni)

watch(() => props.fase, (f) => {
  if (f === 'pronto') nextTick(() => botaoAceitar.value?.$el?.focus())
}, { immediate: true })

watch(salvarAberto, (v) => { if (v) nomeDoPedido.value = props.rotulo.slice(0, 48) })

function pedirAjuste() {
  const q = ajuste.value.trim()
  if (!q) return
  ajuste.value = ''
  emit('ajustar', q)
}

function salvar() {
  const nome = nomeDoPedido.value.trim()
  if (!nome) return
  emit('salvar', nome)
  salvarAberto.value = false
}

function votar(bom: boolean) {
  votou.value = bom
  emit('feedback', bom)
}

/* Esc descarta de qualquer ponto; Enter aceita quando o foco não está num campo de texto. */
function teclar(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    if (props.fase === 'gerando') emit('parar')
    else emit('descartar')
  }
  if (e.key === 'Enter' && props.fase === 'pronto' && !(e.target as HTMLElement)?.closest('input, textarea, [contenteditable=true]')) {
    e.preventDefault()
    emit('aceitar')
  }
}
onMounted(() => document.addEventListener('keydown', teclar, true))
onBeforeUnmount(() => document.removeEventListener('keydown', teclar, true))
</script>

<template>
  <div
    role="region"
    :aria-label="tb.caixa"
    class="overflow-hidden rounded-xl border border-default bg-default shadow-lg ring-1 ring-primary/15"
  >
    <span class="sr-only" aria-live="polite">{{ fase === 'pronto' ? tb.prontaSr : '' }}</span>
    <div class="flex flex-wrap items-center gap-1.5 px-2.5 py-2">
      <AvatarDoAgente :agente="agente" :estado="fase === 'gerando' ? 'working' : fase === 'erro' ? 'error' : 'idle'" tamanho="sm" />

      <!-- GERANDO -->
      <template v-if="fase === 'gerando'">
        <span class="flex-1 text-sm text-muted" aria-live="polite">{{ escrevendo }}</span>
        <UButton :label="tb.parar" icon="i-lucide-square" color="neutral" variant="outline" size="xs" @click="emit('parar')">
          <template #trailing><UKbd value="Esc" size="sm" /></template>
        </UButton>
      </template>

      <!-- ERRO -->
      <template v-else-if="fase === 'erro'">
        <span class="flex-1 text-sm"><span class="font-medium text-error">{{ tb.erroTitulo }}</span> <span class="text-muted">{{ tb.erroTexto }}</span></span>
        <UButton :label="tb.tentarDeNovo" icon="i-lucide-rotate-ccw" size="xs" @click="emit('tentar')" />
        <UButton :label="tb.descartar" color="neutral" variant="ghost" size="xs" @click="emit('descartar')" />
      </template>

      <!-- PRONTO -->
      <template v-else>
        <UBadge :label="rotulo" icon="i-lucide-sparkles" color="primary" variant="soft" size="sm" class="max-w-56 truncate" />
        <span class="hidden truncate text-xs text-dimmed sm:inline">{{ quem }} · {{ modelo }}</span>
        <span v-if="interrompido" class="text-xs text-warning">{{ tb.interrompido }}</span>

        <span class="ms-auto flex items-center gap-0.5">
          <UTooltip :text="tb.util">
            <UButton icon="i-lucide-thumbs-up" :color="votou === true ? 'primary' : 'neutral'" variant="ghost" size="xs" :aria-label="tb.util" :aria-pressed="votou === true" @click="votar(true)" />
          </UTooltip>
          <UTooltip :text="tb.inutil">
            <UButton icon="i-lucide-thumbs-down" :color="votou === false ? 'primary' : 'neutral'" variant="ghost" size="xs" :aria-label="tb.inutil" :aria-pressed="votou === false" @click="votar(false)" />
          </UTooltip>

          <UPopover v-if="podeSalvar" v-model:open="salvarAberto" :content="{ align: 'end', sideOffset: 6 }">
            <UTooltip :text="tb.salvarPedido">
              <UButton icon="i-lucide-bookmark-plus" color="neutral" variant="ghost" size="xs" :aria-label="tb.salvarPedido" />
            </UTooltip>
            <template #content>
              <form class="flex w-72 flex-col gap-2 p-3" @submit.prevent="salvar">
                <UFormField :label="tb.nomeDoPedido">
                  <UInput v-model="nomeDoPedido" size="sm" class="w-full" autofocus />
                </UFormField>
                <UButton type="submit" :label="tb.salvar" size="sm" class="self-end" :disabled="!nomeDoPedido.trim()" />
              </form>
            </template>
          </UPopover>

          <span class="mx-1 h-4 w-px bg-accented" aria-hidden="true" />
          <UButton :label="tb.tentarDeNovo" icon="i-lucide-rotate-ccw" color="neutral" variant="ghost" size="xs" @click="emit('tentar')" />
          <UButton v-if="comSelecao" :label="tb.inserirAbaixo" icon="i-lucide-arrow-down-to-line" color="neutral" variant="ghost" size="xs" @click="emit('abaixo')" />
          <UButton :label="tb.descartar" color="neutral" variant="ghost" size="xs" @click="emit('descartar')">
            <template #trailing><UKbd value="Esc" size="sm" /></template>
          </UButton>
          <UButton ref="botaoAceitar" :label="tb.aceitar" icon="i-lucide-check" size="xs" @click="emit('aceitar')">
            <template #trailing><UKbd value="enter" size="sm" color="neutral" variant="solid" class="bg-white/20 text-inverted ring-0" /></template>
          </UButton>
        </span>
      </template>
    </div>

    <!-- O que o Revisor mudou -->
    <div v-if="fase === 'pronto' && notas?.length" class="border-t border-default bg-elevated/40 px-3 py-2">
      <p class="mb-1 text-xs font-semibold text-muted">{{ tb.oQueMudou }}</p>
      <ul class="flex flex-col gap-0.5 text-xs text-default">
        <li v-for="n in notas" :key="n" class="flex items-start gap-1.5"><UIcon name="i-lucide-check" class="mt-0.5 size-3.5 shrink-0 text-success" />{{ n }}</li>
      </ul>
    </div>
    <p v-if="fase === 'pronto' && semRoteiro" class="flex items-center gap-1.5 border-t border-default px-3 py-1.5 text-xs text-warning">
      <UIcon name="i-lucide-flask-conical" class="size-3.5" />{{ tb.simulacaoTraducao }}
    </p>

    <!-- Ajuste sobre a resposta -->
    <form v-if="fase === 'pronto'" class="flex items-center gap-1.5 border-t border-default px-2.5 py-1.5" @submit.prevent="pedirAjuste">
      <UInput v-model="ajuste" :placeholder="tb.placeholderAjuste" icon="i-lucide-sparkles" size="sm" variant="none" class="flex-1" :ui="{ leadingIcon: 'text-primary' }" />
      <UButton type="submit" icon="i-lucide-arrow-up" size="xs" color="neutral" variant="soft" :disabled="!ajuste.trim()" :aria-label="tb.enviar" />
    </form>
  </div>
</template>

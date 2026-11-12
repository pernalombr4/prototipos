<script setup lang="ts">
/**
 * Caixa de resposta que cita com #. Proposta (rodada 2).
 *
 * Digitar # abre a lista do que dá para citar: as tarefas do item, o próprio
 * item e os outros apontamentos da pasta. Setas escolhem, Enter insere, Esc
 * fecha. A citação entra no texto como "#Nome" e vai junto na resposta.
 */
import type { Citacao } from './mocks'
import type { Textos } from './textos'
import { CHAVE_CITACAO, iconeDaCitacao } from './citacao'

const props = defineProps<{ t: Textos, placeholder?: string, excluir?: string }>()
const texto = defineModel<string>({ required: true })
const citacoes = defineModel<Citacao[]>('citacoes', { default: () => [] })
const emit = defineEmits<{ enviar: [] }>()

const contexto = inject(CHAVE_CITACAO, null)
const campo = ref<{ textareaRef: HTMLTextAreaElement | null } | null>(null)

/** O trecho depois do último # antes do cursor, ou null se não há busca aberta. */
const consulta = ref<string | null>(null)
const inicio = ref(0)
const ativo = ref(0)

function ler() {
  const el = campo.value?.textareaRef
  if (!el || !contexto) return
  /* Do próprio campo: no @input, o v-model ainda não tem a última letra. */
  const ate = el.selectionStart ?? el.value.length
  const antes = el.value.slice(0, ate)
  const i = antes.lastIndexOf('#')
  if (i < 0 || (i > 0 && !/\s/.test(antes[i - 1]!))) {
    consulta.value = null
    return
  }
  const q = antes.slice(i + 1)
  if (q.includes('\n') || q.length > 40) {
    consulta.value = null
    return
  }
  inicio.value = i
  consulta.value = q
  ativo.value = 0
}

const sugestoes = computed(() => {
  if (consulta.value === null || !contexto) return []
  const q = consulta.value.toLowerCase()
  return contexto.citaveis.value
    .filter(c => c.chave !== props.excluir)
    .filter(c => !q || c.rotulo.toLowerCase().includes(q) || c.detalhe?.toLowerCase().includes(q))
    .slice(0, 6)
})

function escolher(i: number) {
  const c = sugestoes.value[i]
  const el = campo.value?.textareaRef
  if (!c || !el) return
  const ate = el.selectionStart ?? texto.value.length
  const inserido = `#${c.rotulo} `
  texto.value = texto.value.slice(0, inicio.value) + inserido + texto.value.slice(ate)
  if (!citacoes.value.some(x => x.chave === c.chave)) citacoes.value = [...citacoes.value, { chave: c.chave, rotulo: c.rotulo, tipo: c.tipo }]
  consulta.value = null
  nextTick(() => {
    const pos = inicio.value + inserido.length
    el.focus()
    el.setSelectionRange(pos, pos)
  })
}

function tecla(e: KeyboardEvent) {
  if (consulta.value !== null && sugestoes.value.length) {
    if (e.key === 'ArrowDown') { e.preventDefault(); ativo.value = (ativo.value + 1) % sugestoes.value.length; return }
    if (e.key === 'ArrowUp') { e.preventDefault(); ativo.value = (ativo.value - 1 + sugestoes.value.length) % sugestoes.value.length; return }
    if (e.key === 'Enter' && !e.ctrlKey) { e.preventDefault(); escolher(ativo.value); return }
  }
  if (e.key === 'Escape' && consulta.value !== null) { e.preventDefault(); consulta.value = null; return }
  if (e.key === 'Enter' && e.ctrlKey) emit('enviar')
}

const idDaLista = useId()
function fecharDepois() {
  setTimeout(() => { consulta.value = null }, 150)
}
</script>

<template>
  <div class="relative">
    <UTextarea
      ref="campo"
      v-model="texto"
      :placeholder="placeholder"
      :rows="2"
      autoresize
      class="w-full"
      role="combobox"
      :aria-expanded="consulta !== null && sugestoes.length > 0"
      :aria-controls="idDaLista"
      aria-autocomplete="list"
      @input="ler"
      @click="ler"
      @keydown="tecla"
      @blur="fecharDepois"
    />
    <p v-if="contexto" class="mt-1 text-[11px] text-dimmed">{{ t.fluxo.mencao.dica }}</p>

    <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition duration-100" leave-to-class="opacity-0">
      <div
        v-if="consulta !== null"
        :id="idDaLista"
        role="listbox"
        :aria-label="t.fluxo.mencao.lista"
        class="absolute inset-x-0 bottom-full z-30 mb-1 overflow-hidden rounded-md border border-default bg-default shadow-lg"
      >
        <p v-if="!sugestoes.length" class="px-3 py-2 text-sm text-muted">{{ t.fluxo.mencao.nenhum }}</p>
        <button
          v-for="(s, i) in sugestoes"
          :key="s.chave"
          type="button"
          role="option"
          :aria-selected="i === ativo"
          class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
          :class="i === ativo ? 'bg-elevated' : 'hover:bg-elevated/60'"
          @mousedown.prevent="escolher(i)"
          @mouseenter="ativo = i"
        >
          <UIcon :name="iconeDaCitacao[s.tipo]" class="size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1 truncate text-highlighted">{{ s.rotulo }}</span>
          <span class="shrink-0 text-xs text-dimmed">{{ t.fluxo.mencao.tipos[s.tipo] }}<template v-if="s.detalhe"> · {{ s.detalhe }}</template></span>
        </button>
      </div>
    </Transition>
  </div>
</template>

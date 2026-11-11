<script setup lang="ts">
/**
 * Uma linha da lista de apontamentos. Proposta.
 *
 * À esquerda, o controle de marcar: quem resolve clica e o apontamento vira
 * "Resolvido" (o check que ela pediu). Para quem confere, as 2 ações da
 * conferência aparecem na própria linha (Conferir e Reabrir), sem abrir o
 * detalhe. O resto da linha abre o detalhe.
 */
import type { Apontamento } from './mocks'
import type { Lista } from './lista'
import type { Textos } from './textos'
import { iconeDaPrioridade, pessoa, podeConferir, podeDesmarcar, podeReabrir, podeResolver, rotuloDoEstado, vezDe, visualDoEstado } from './lista'

const props = defineProps<{
  t: Textos
  lista: Lista
  a: Apontamento
  quem: number
  selecionado: boolean
  somenteLeitura: boolean
}>()

const emit = defineEmits<{
  abrir: []
  resolver: []
  desmarcar: []
  conferir: []
  reabrir: []
}>()

const visual = computed(() => visualDoEstado[props.a.estado])
const corDoIcone: Record<string, string> = { neutral: 'text-muted', info: 'text-info', success: 'text-success', error: 'text-error', warning: 'text-warning' }
const rotulo = computed(() => rotuloDoEstado(props.lista.config, props.a.estado, props.t.estados, props.t.locale))
const responsavel = computed(() => pessoa(props.lista, props.a.responsavel))
const vez = computed(() => {
  const id = vezDe(props.a, props.lista.config)
  return id ? pessoa(props.lista, id) : undefined
})

const marcavel = computed(() => !props.somenteLeitura && podeResolver(props.a, props.quem))
const desmarcavel = computed(() => !props.somenteLeitura && podeDesmarcar(props.a, props.quem, props.lista.config))
const conferivel = computed(() => !props.somenteLeitura && podeConferir(props.a, props.quem, props.lista.config))
const reabrivel = computed(() => !props.somenteLeitura && props.a.estado === 'resolvido' && podeReabrir(props.a, props.quem))

const dicaDoControle = computed(() => {
  if (marcavel.value) return props.t.apontamento.marcarResolvido
  if (desmarcavel.value) return props.t.apontamento.desmarcar
  if (vez.value) return props.t.apontamento.vezDe(vez.value.nome)
  return rotulo.value
})

function clicarControle() {
  if (marcavel.value) emit('resolver')
  else if (desmarcavel.value) emit('desmarcar')
  else emit('abrir')
}

const fechadoVisual = computed(() => ['conferido', 'descartado'].includes(props.a.estado) || (props.a.estado === 'resolvido' && !props.lista.config.exigeConferencia))
const imagens = computed(() => props.a.anexos.filter(x => x.tipo === 'imagem').length)
const outros = computed(() => props.a.anexos.length - imagens.value)
</script>

<template>
  <li
    class="group relative flex items-start gap-3 border-b border-default px-4 py-3 transition-colors duration-150"
    :class="[
      selecionado ? 'bg-elevated' : 'hover:bg-elevated/50',
      a.estado === 'rascunho' ? 'bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,var(--ui-bg-elevated)_6px,var(--ui-bg-elevated)_7px)]' : '',
    ]"
  >
    <span
      class="absolute inset-y-0 left-0 w-0.5 rounded-r transition-colors"
      :class="selecionado ? 'bg-primary' : 'bg-transparent'"
      aria-hidden="true"
    />

    <!-- O check -->
    <UTooltip :text="dicaDoControle" :content="{ side: 'top' }">
      <button
        type="button"
        class="relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-150 focus-visible:outline-2 focus-visible:outline-primary"
        :class="[
          marcavel ? 'cursor-pointer text-dimmed ring-1 ring-accented hover:bg-success/10 hover:text-success hover:ring-success' : '',
          desmarcavel ? 'cursor-pointer text-info hover:text-muted' : '',
          !marcavel && !desmarcavel ? `cursor-default ${corDoIcone[visual.cor]}` : '',
        ]"
        :aria-label="dicaDoControle"
        :aria-pressed="marcavel || desmarcavel ? a.estado === 'resolvido' : undefined"
        @click.stop="clicarControle"
      >
        <UIcon
          :name="marcavel ? 'i-lucide-check' : visual.icone"
          class="size-4 transition-transform duration-150"
          :class="marcavel ? 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100' : ''"
        />
      </button>
    </UTooltip>

    <!-- O alvo: abre o detalhe -->
    <div class="min-w-0 flex-1">
      <button
        type="button"
        class="block w-full text-left after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-primary"
        :aria-current="selecionado ? 'true' : undefined"
        @click="emit('abrir')"
      >
        <span class="flex items-baseline gap-2">
          <span class="shrink-0 font-mono text-xs text-dimmed">#{{ a.numero }}</span>
          <span
            class="truncate text-sm font-medium"
            :class="fechadoVisual ? 'text-muted line-through decoration-1 decoration-dimmed' : 'text-highlighted'"
          >{{ a.titulo }}</span>
        </span>
      </button>
      <div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <UBadge :label="rotulo" :icon="visual.icone" :color="visual.cor" :variant="visual.variante" size="sm" />
        <span v-if="a.prioridade === 'high' || a.prioridade === 'urgent'" class="flex items-center gap-1" :class="a.prioridade === 'urgent' ? 'text-error' : 'text-warning'">
          <UIcon :name="iconeDaPrioridade[a.prioridade]" class="size-3.5" />{{ t.prioridades[a.prioridade] }}
        </span>
        <span class="font-mono">{{ t.lista.rodadaCurta(a.rodada) }}</span>
        <span v-if="a.reaberturas" class="flex items-center gap-1 text-error">
          <UIcon name="i-lucide-rotate-ccw" class="size-3.5" />{{ a.reaberturas }}
        </span>
        <span v-if="imagens" class="flex items-center gap-1"><UIcon name="i-lucide-image" class="size-3.5" />{{ imagens }}</span>
        <span v-if="outros" class="flex items-center gap-1"><UIcon name="i-lucide-paperclip" class="size-3.5" />{{ outros }}</span>
        <span v-if="a.respostas.length" class="flex items-center gap-1"><UIcon name="i-lucide-message-circle" class="size-3.5" />{{ a.respostas.length }}</span>
      </div>
    </div>

    <!-- Conferência na própria linha -->
    <div v-if="conferivel || reabrivel" class="relative z-10 flex shrink-0 items-center gap-1 self-center">
      <UButton v-if="reabrivel" :label="t.apontamento.reabrir" icon="i-lucide-rotate-ccw" color="neutral" variant="ghost" size="xs" @click.stop="emit('reabrir')" />
      <UButton v-if="conferivel" :label="t.apontamento.conferir" icon="i-lucide-badge-check" color="success" variant="soft" size="xs" @click.stop="emit('conferir')" />
    </div>

    <UTooltip v-if="responsavel" :text="vez ? t.apontamento.vezDe(vez.nome) : responsavel.nome">
      <UAvatar
        :text="responsavel.iniciais"
        :alt="responsavel.nome"
        size="xs"
        class="relative z-10 mt-0.5 shrink-0"
        :class="vez && vez.id === responsavel.id ? 'ring-2 ring-primary/50' : ''"
      />
    </UTooltip>
  </li>
</template>

<script setup lang="ts">
/**
 * PROPOSTA: o card de app, o mesmo para todo app da loja (os provedores de assinatura, a OpenAI, o Plugin do Word, o
 * SendGrid, o Twilio e as integrações antigas).
 *
 * Hoje cada card tem um formato: botão cheio "Gerenciar Integração", "Instalar Integração" ou "Utilizar Plugin", link
 * rosa com seta e botão fantasma. Aqui o card inteiro abre o app; o estado fica em texto, sempre no mesmo lugar, e o
 * botão é 1 só, com o mesmo rótulo em todo card. A seção já diz a categoria, e o card não repete. O que fazer
 * (conectar, instalar, gerenciar) fica na página do app.
 */
import type { ProvedorId } from './mocks'
import Monograma from './_Monograma.vue'

/** `info`: o rodapé traz um dado do app (limite, uso), sem o ponto de estado. */
export type TomDoEstado = 'success' | 'warning' | 'neutral' | 'info'

const props = defineProps<{
  nome: string
  descricao: string
  estado: { texto: string, tom: TomDoEstado, detalhe?: string }
  rotulo: string
  /** O logo: o provedor de assinatura (monograma) ou o ícone do app. */
  provedor?: ProvedorId
  icone?: string
  apagado?: boolean
}>()
const emit = defineEmits<{ abrir: [] }>()

const ponto = computed(() => ({ success: 'bg-success', warning: 'bg-warning', neutral: 'bg-(--ui-text-dimmed)', info: '' })[props.estado.tom])
const cor = computed(() => ({ success: 'text-success', warning: 'text-warning', neutral: 'text-muted', info: 'text-muted font-normal' })[props.estado.tom])
</script>

<template>
  <button
    type="button"
    class="group flex h-full flex-col rounded-xl border border-default bg-default text-left shadow-xs transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accented hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    @click="emit('abrir')"
  >
    <span class="flex items-center gap-3 px-4 pt-4">
      <Monograma v-if="provedor" :provedor="provedor" tamanho="lg" :class="apagado && 'opacity-60 grayscale'" />
      <span v-else class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-elevated ring-1 ring-default ring-inset">
        <UIcon :name="icone ?? 'i-lucide-puzzle'" class="size-5 text-highlighted" />
      </span>
      <span class="min-w-0 flex-1 truncate font-semibold text-highlighted">{{ nome }}</span>
    </span>

    <span class="mt-3 line-clamp-2 min-h-10 px-4 text-sm text-toned">{{ descricao }}</span>

    <span class="mt-4 flex items-center justify-between gap-3 border-t border-default px-4 py-3">
      <span class="flex min-w-0 items-center gap-1.5 text-xs font-medium" :class="cor">
        <span v-if="ponto" class="size-2 shrink-0 rounded-full" :class="ponto" />
        <span class="truncate">{{ estado.texto }}<span v-if="estado.detalhe" class="font-normal text-muted"> · {{ estado.detalhe }}</span></span>
      </span>
      <UButton
        as="span"
        :label="rotulo"
        trailing-icon="i-lucide-arrow-right"
        color="neutral"
        variant="outline"
        size="xs"
        class="shrink-0 transition-colors group-hover:border-accented group-hover:bg-elevated"
        :ui="{ trailingIcon: 'transition-transform group-hover:translate-x-0.5' }"
      />
    </span>
  </button>
</template>

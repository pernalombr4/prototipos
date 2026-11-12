<script setup lang="ts">
/**
 * A barra de pastas do item.
 *
 * ⚠️ NADA AQUI É PROPOSTA, salvo o contador da pasta de Apontamentos. Copiado do
 * develop em 11/11/2026 (`/workspaces/teste-ux/types/leve/<referência>?folder=`):
 * abas sublinhadas com ícone, seta de opções na aba ativa e o botão de nova
 * pasta no canto direito. A proposta só acrescenta o número de pendentes ao
 * lado do nome da pasta de Apontamentos e liga o Editar dela à configuração
 * (rodada 3: o nome é fixo, então a configuração mora no Editar).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'

export interface PastaDaBarra {
  id: string
  nome: string
  icone: string
  /** Só a pasta de Apontamentos tem. */
  pendentes?: number
  nova?: boolean
}

const props = defineProps<{ t: Textos, pastas: PastaDaBarra[] }>()
const ativa = defineModel<string>('ativa', { required: true })
const emit = defineEmits<{ nova: [], editar: [id: string] }>()

const opcoes = computed<DropdownMenuItem[]>(() => [
  { label: props.t.pastas.editar, icon: 'i-lucide-pencil', onSelect: () => emit('editar', ativa.value) },
  { label: props.t.pastas.ocultar, icon: 'i-lucide-eye-off' },
  { label: props.t.pastas.excluir, icon: 'i-lucide-trash-2', color: 'error' },
])
</script>

<template>
  <div class="flex items-stretch border-b border-default bg-default">
    <nav class="flex min-w-0 flex-1 items-stretch overflow-x-auto px-2" role="tablist">
      <div
        v-for="p in pastas"
        :key="p.id"
        class="relative flex shrink-0 items-center"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="ativa === p.id"
          class="flex h-10 items-center gap-1.5 px-2.5 text-sm transition-colors duration-150"
          :class="ativa === p.id ? 'font-medium text-primary' : 'text-muted hover:text-highlighted'"
          @click="ativa = p.id"
        >
          <UIcon :name="p.icone" class="size-4 shrink-0" />
          <span class="whitespace-nowrap">{{ p.nome }}</span>
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-75" leave-active-class="transition duration-150" leave-to-class="opacity-0 scale-75">
            <UBadge
              v-if="p.pendentes"
              :key="p.pendentes"
              :label="String(p.pendentes)"
              :color="ativa === p.id ? 'primary' : 'neutral'"
              variant="soft"
              size="sm"
              class="tabular-nums"
              :aria-label="t.pastas.pendentes(p.pendentes)"
            />
          </Transition>
        </button>
        <UDropdownMenu v-if="ativa === p.id" :items="opcoes" :content="{ align: 'start' }">
          <UButton icon="i-lucide-chevron-down" color="neutral" variant="ghost" size="xs" class="-ml-1.5 mr-1 text-primary" :aria-label="t.pastas.opcoes" />
        </UDropdownMenu>
        <span
          class="absolute inset-x-1 bottom-0 h-0.5 rounded-full transition-colors duration-150"
          :class="ativa === p.id ? 'bg-primary' : 'bg-transparent'"
          aria-hidden="true"
        />
      </div>
    </nav>
    <UTooltip :text="t.pastas.novaPasta">
      <UButton icon="i-lucide-folder-plus" color="neutral" variant="ghost" size="sm" class="m-1 self-center" :aria-label="t.pastas.novaPasta" @click="emit('nova')" />
    </UTooltip>
  </div>
</template>

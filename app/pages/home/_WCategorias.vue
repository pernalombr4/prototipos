<script setup lang="ts">
/**
 * Widget "Categorias" (rodada 2): o atalho para as categorias que a redatora
 * pediu ("a home também deve poder ter atalho pras categorias").
 *
 * A Home de develop já tem cartões de categoria (`WorkspaceCategories.vue`,
 * 4 por vez, botão "Acessar", ligados por `show_types_on_initial_screen`). O
 * widget continua o mesmo atalho, em grade, e soma 2 coisas:
 * - quantos itens estão em aberto, para a pessoa saber onde há trabalho;
 * - "Criar <singular>" em cada cartão, pelo `singular_name` da categoria.
 *   Com 2 ou mais formulários, o botão pergunta qual; com 1 ou nenhum, abre
 *   o modal direto. É a mesma regra do botão Criar do topo.
 *
 * O cartão inteiro é "Acessar"; o "+" é um botão à parte, ao lado, e não
 * dentro do cartão (dois controles irmãos, sem clique dentro de clique).
 *
 * Componentes: `UButton`, `UDropdownMenu`, `UTooltip`, `UIcon` (MCP nuxt-ui).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Categoria } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  categorias: Categoria[]
  abertos: Record<string, number>
}>()
const emit = defineEmits<{
  acessar: [categoria: Categoria]
  criar: [categoria: string, formulario?: string]
}>()

/** Cor do ícone pela cor da categoria, só com as cores semânticas do tema. */
const COR: Record<string, string> = {
  primary: 'bg-primary/10 text-primary ring-primary/25',
  info: 'bg-info/10 text-info ring-info/25',
  success: 'bg-success/10 text-success ring-success/25',
  warning: 'bg-warning/10 text-warning ring-warning/25',
  error: 'bg-error/10 text-error ring-error/25',
  neutral: 'bg-elevated text-toned ring-default',
}

function formularios(c: Categoria): DropdownMenuItem[][] {
  return [
    [{ label: props.t.categoriasW.escolhaFormulario, type: 'label' }],
    c.formularios.map(f => ({ label: f.nome, icon: 'i-lucide-clipboard-pen', onSelect: () => emit('criar', c.slug, f.id) })),
  ]
}
</script>

<template>
  <div class="h-full overflow-y-auto px-4 pb-4 pt-1">
    <ul class="flex flex-wrap gap-3">
      <li
        v-for="(c, i) in categorias"
        :key="c.slug"
        class="flex min-w-0 max-w-[24rem] flex-[1_1_17rem] animate-[entrada_0.3s_ease-out_both] items-center gap-1 rounded-lg border border-default bg-default py-1.5 pl-1.5 pr-3 transition-colors duration-150 hover:border-accented hover:bg-elevated/40 motion-reduce:animate-none"
        :style="{ animationDelay: `${i * 40}ms` }"
      >
        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-3 rounded-md p-2 text-left focus-visible:outline-2 focus-visible:outline-primary"
          :aria-label="t.categoriasW.acessar(c.name)"
          @click="emit('acessar', c)"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-lg ring ring-inset" :class="COR[c.color ?? 'neutral'] ?? COR.neutral">
            <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4" />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-medium text-highlighted">{{ c.name }}</span>
            <span class="block truncate text-xs" :class="abertos[c.slug] ? 'text-toned' : 'text-muted'">{{ t.categoriasW.abertos(abertos[c.slug] ?? 0) }}</span>
          </span>
        </button>

        <UDropdownMenu v-if="c.formularios.length > 1" :items="formularios(c)" :content="{ align: 'end' }">
          <UTooltip :text="t.criar.criarNa(c.singular, c.name)">
            <UButton icon="i-lucide-plus" color="neutral" variant="outline" size="sm" square :aria-label="t.criar.criarNa(c.singular, c.name)" />
          </UTooltip>
        </UDropdownMenu>
        <UTooltip v-else :text="t.criar.criarNa(c.singular, c.name)">
          <UButton
            icon="i-lucide-plus"
            color="neutral"
            variant="outline"
            size="sm"
            square
            :aria-label="t.criar.criarNa(c.singular, c.name)"
            @click="emit('criar', c.slug, c.formularios[0]?.id)"
          />
        </UTooltip>
      </li>
    </ul>
  </div>
</template>

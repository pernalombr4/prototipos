<script setup lang="ts">
/**
 * A pasta Visão Geral do item: o formulário do tipo.
 *
 * ⚠️ NADA AQUI É PROPOSTA, salvo o contador. Copiado do develop em 11/11/2026
 * (Visão Geral do item no workspace de exploração): rótulo em negrito em cima,
 * campo na largura toda. Os campos e os valores são do mock de cada cenário. O
 * campo HTML mostra a "Lista de Tarefas" que o editor do produto já tem
 * (`TaskList` do TipTap no `EnEditor`, lido no código em 11/11/2026).
 *
 * A proposta: "2 de 4" ao lado do nome do campo que tem caixas de marcar, como
 * o "x of y tasks" da task list do GitHub.
 */
import type { CampoDaVisaoGeral } from './mocks'
import type { Textos } from './textos'

defineProps<{ t: Textos, campos: CampoDaVisaoGeral[] }>()
const feitos = (c: CampoDaVisaoGeral) => c.checklist?.filter(l => l.feito).length ?? 0
</script>

<template>
  <div class="flex flex-col gap-6 px-6 py-5">
    <div v-for="c in campos" :key="c.rotulo" class="flex flex-col gap-2">
      <p class="flex items-center gap-2 text-sm font-semibold text-highlighted">
        {{ c.rotulo }}
        <!-- Proposta: o contador -->
        <UTooltip v-if="c.checklist?.length" :text="t.tarefaRapida.visaoGeral.ajudaContador">
          <UBadge
            :label="t.tarefaRapida.visaoGeral.contador(feitos(c), c.checklist.length)"
            icon="i-lucide-square-check"
            :color="feitos(c) === c.checklist.length ? 'success' : 'neutral'"
            variant="soft"
            size="sm"
            class="tabular-nums"
          />
        </UTooltip>
      </p>

      <!-- Campo HTML com a lista de tarefas do editor -->
      <div v-if="c.checklist" class="rounded-md border border-accented bg-default">
        <div class="flex items-center gap-1 border-b border-default px-2 py-1 text-muted" aria-hidden="true">
          <UIcon v-for="i in ['i-lucide-undo-2', 'i-lucide-redo-2', 'i-lucide-type', 'i-lucide-bold', 'i-lucide-italic', 'i-lucide-underline', 'i-lucide-list-checks']" :key="i" :name="i" class="m-1 size-3.5" />
        </div>
        <ul class="flex flex-col gap-1.5 px-4 py-3">
          <li v-for="(l, i) in c.checklist" :key="i">
            <UCheckbox v-model="l.feito" :label="l.texto" :ui="{ label: l.feito ? 'text-muted line-through' : 'text-default' }" />
          </li>
        </ul>
      </div>
      <UInput v-else :model-value="c.valor" class="w-full" />
    </div>

    <p class="flex items-center gap-1.5 text-xs text-muted">
      <UIcon name="i-lucide-info" class="size-3.5" />{{ t.tarefaRapida.visaoGeral.proposta }}
    </p>
  </div>
</template>

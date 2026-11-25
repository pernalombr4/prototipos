<script setup lang="ts">
/**
 * O painel Dados do menu novo, com 1 mudança de PROPOSTA:
 *   - a lista mostra só as categorias do workspace (sem projeto); as de projeto ficam no projeto;
 *   - "Ver todas as N categorias" lista todas as que a pessoa vê, com a coluna Projeto.
 * Regra 20 da spec: "destaque soma, não substitui". Nenhuma categoria fica sem caminho.
 */
import type { Textos } from './textos'
import { useMarcaDeProposta, useProjetos } from './estado'
import TodasAsCategorias from './_TodasAsCategorias.vue'

defineProps<{ t: Textos }>()
const emit = defineEmits<{ recolher: [] }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()

const todas = computed(() => prj.categorias.value.filter(c => prj.veCategoria(c)))
const ativa = computed(() => prj.tela.value.tipo === 'categoria' ? prj.tela.value.id : null)
const vendoTodas = ref(false)
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex h-12 shrink-0 items-center gap-0.5 border-b border-default pl-3 pr-1.5">
      <h2 class="min-w-0 flex-1 truncate text-sm font-bold text-highlighted">{{ t.casca.dados }}</h2>
      <UTooltip :text="t.casca.recolherMenu">
        <UButton icon="i-lucide-chevrons-left" size="xs" color="neutral" variant="ghost" :aria-label="t.casca.recolherMenu" @click="emit('recolher')" />
      </UTooltip>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto px-2 py-2">
      <div :class="marca">
        <UTooltip :text="t.casca.categoriasDoWorkspaceDica">
          <p class="px-2 pb-1 text-xs font-medium text-muted">{{ t.casca.categoriasDoWorkspace }}</p>
        </UTooltip>
        <ul class="space-y-px">
          <li v-for="(c, i) in prj.categoriasDoWorkspace.value" :key="c.id" class="animate-[entrada_0.2s_ease-out_both]" :style="{ animationDelay: `${i * 25}ms` }">
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
              :class="ativa === c.id ? 'bg-primary/10 font-medium text-highlighted' : 'text-default'"
              :aria-current="ativa === c.id ? 'page' : undefined"
              @click="prj.abrirCategoria(c.id)"
            >
              <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4 shrink-0" :class="ativa === c.id ? 'text-primary' : 'text-muted'" />
              <span class="truncate">{{ c.name }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="shrink-0 border-t border-default px-2 py-1">
      <UButton
        :label="t.dados.verTodas(todas.length)"
        icon="i-lucide-layout-grid"
        size="xs"
        color="neutral"
        variant="ghost"
        block
        class="justify-center text-muted hover:text-default"
        @click="vendoTodas = true"
      />
    </div>

    <TodasAsCategorias v-model:open="vendoTodas" :t="t" />
  </div>
</template>

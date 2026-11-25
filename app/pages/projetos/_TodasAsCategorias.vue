<script setup lang="ts">
/**
 * PROPOSTA: "Ver todas as N categorias". Lista todas as categorias que a pessoa vê, do workspace e dos
 * projetos, com o projeto de cada uma. Os 2 menus abrem esta mesma janela: o painel Dados do menu novo
 * e a seção Categorias do menu atual. Regra 20 da spec: nenhuma categoria fica sem caminho.
 */
import type { Textos } from './textos'
import { COR_DO_PROJETO, useMarcaDeProposta, useProjetos } from './estado'

defineProps<{ t: Textos }>()
const aberto = defineModel<boolean>('open', { default: false })
const prj = useProjetos()
const { marca } = useMarcaDeProposta()

const termo = ref('')
const todas = computed(() => prj.categorias.value.filter(c => prj.veCategoria(c)))
const filtradas = computed(() => todas.value.filter(c => c.name.toLowerCase().includes(termo.value.trim().toLowerCase())))

function abrir(id: number) {
  aberto.value = false
  prj.abrirCategoria(id)
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.dados.todasTitulo" :description="t.dados.todasDescricao" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <UInput v-model="termo" icon="i-lucide-search" :placeholder="t.dados.buscar" :aria-label="t.dados.buscar" class="mb-3 w-full" />
      <ul class="divide-y divide-default rounded-md border border-default">
        <li v-for="c in filtradas" :key="c.id">
          <button type="button" class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary" @click="abrir(c.id)">
            <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4 shrink-0 text-muted" />
            <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ c.name }}</span>
            <span v-if="prj.projetoDa(c)" class="flex shrink-0 items-center gap-1.5 text-xs text-toned" :class="marca">
              <span class="flex size-5 items-center justify-center rounded" :class="COR_DO_PROJETO[prj.projetoDa(c)!.cor]">
                <UIcon :name="prj.projetoDa(c)!.icone" class="size-3" />
              </span>
              {{ prj.projetoDa(c)!.nome }}
            </span>
            <span v-else class="shrink-0 text-xs text-muted">{{ t.dados.doWorkspace }}</span>
          </button>
        </li>
      </ul>
    </template>
  </UModal>
</template>

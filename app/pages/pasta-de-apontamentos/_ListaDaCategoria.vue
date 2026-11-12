<script setup lang="ts">
/**
 * A listagem da categoria, fundo da visualização "Item em painel lateral".
 *
 * ⚠️ NADA AQUI É PROPOSTA. Copiado olhando o develop em 12/11/2026
 * (`/workspaces/teste-ux/types/leve`): a aba de visualização Itens, a busca,
 * Criado em e Todo o período, os ícones da barra e Novo registro, a tabela com
 * seleção, Ações e Referência, e o rodapé com "Mostrando" e "100 por página".
 * Clicar numa linha abre o item na gaveta da direita (`@select` da tabela,
 * `SharedResizableDrawer`). Está aqui só para o painel ser julgado no lugar
 * onde ele abre: só a linha do item do cenário abre.
 */
import type { Cenario } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, c: Cenario, aberto: boolean }>()
const emit = defineEmits<{ abrir: [] }>()
const toast = useToast()

const colunas = computed(() => props.c.camposDaVisaoGeral.filter(f => f.valor !== undefined).slice(0, 4))
/** Referências inventadas para as outras linhas, com o prefixo da categoria. */
const SUFIXOS = ['4E6DBE5D7B9D45658B102B5A', '6682BB8CF204452ABF7D8AF1', '65943373E342419199888E4D', 'F62553436E084A69B6FC9925']
const linhas = computed(() => {
  const prefixo = props.c.item.reference.slice(0, 3)
  const outras = SUFIXOS.map(s => ({ reference: `${prefixo}${s}`, valores: colunas.value.map(() => '-'), real: false }))
  const real = { reference: props.c.item.reference, valores: colunas.value.map(f => f.valor ?? '-'), real: true }
  return [...outras.slice(0, 3), real, outras[3]!]
})
function abrir(l: { reference: string, real: boolean }) {
  if (l.real) return emit('abrir')
  toast.add({ title: props.t.categoria.soEsteAbre(props.c.item.reference), icon: 'i-lucide-info', duration: 2500 })
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col bg-default">
    <!-- Abas de visualização -->
    <div class="flex items-center gap-1 border-b border-default px-4 py-2">
      <span class="flex items-center gap-1.5 rounded-md bg-elevated px-2.5 py-1 text-sm font-medium text-highlighted">
        <UIcon name="i-lucide-table" class="size-4" />{{ t.categoria.itens }}
      </span>
    </div>

    <!-- Barra da tabela -->
    <div class="flex flex-wrap items-center gap-3 px-4 py-2.5">
      <UInput :placeholder="t.categoria.pesquisar" icon="i-lucide-search" variant="ghost" size="sm" class="w-44" />
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-calendar" class="size-4" />{{ t.categoria.criadoEm }}</span>
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-arrow-up-down" class="size-4" />{{ t.categoria.todoPeriodo }}</span>
      <div class="ml-auto flex items-center gap-1">
        <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" tabindex="-1" aria-hidden="true" />
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" tabindex="-1" aria-hidden="true" />
        <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="sm" tabindex="-1" aria-hidden="true" />
        <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" tabindex="-1" aria-hidden="true" />
        <UButton :label="t.categoria.novoRegistro" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" />
      </div>
    </div>

    <!-- Tabela -->
    <div class="min-h-0 flex-1 overflow-auto">
      <table class="w-full min-w-[56rem] border-collapse text-sm">
        <thead>
          <tr class="border-y border-default text-left text-highlighted">
            <th class="w-10 px-4 py-2.5"><UCheckbox tabindex="-1" aria-hidden="true" /></th>
            <th class="w-20 px-2 py-2.5 font-medium">{{ t.categoria.acoes }}</th>
            <th class="px-3 py-2.5 font-medium"><span class="flex items-center gap-1.5"><UIcon name="i-lucide-arrow-down-up" class="size-3.5 text-muted" />{{ t.categoria.referencia }}</span></th>
            <th v-for="f in colunas" :key="f.rotulo" class="px-3 py-2.5 font-medium">
              <span class="flex items-center gap-1.5"><UIcon name="i-lucide-arrow-down-up" class="size-3.5 text-muted" />{{ f.rotulo }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="l in linhas"
            :key="l.reference"
            class="cursor-pointer border-b border-default transition-colors hover:bg-elevated/60"
            :class="l.real && aberto ? 'bg-elevated/60' : ''"
            @click="abrir(l)"
          >
            <td class="px-4 py-2.5" @click.stop><UCheckbox tabindex="-1" aria-hidden="true" /></td>
            <td class="px-2 py-2.5"><UIcon name="i-lucide-ellipsis-vertical" class="size-4 text-toned" /></td>
            <td class="px-3 py-2.5">
              <button
                type="button"
                class="flex max-w-56 items-center gap-1.5 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary"
                :aria-label="l.reference"
                @click.stop="abrir(l)"
              >
                <span class="truncate">{{ l.reference }}</span>
              </button>
            </td>
            <td v-for="(v, i) in l.valores" :key="i" class="max-w-56 truncate px-3 py-2.5 text-toned">{{ v }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Rodapé -->
    <footer class="flex items-center gap-3 border-t border-default px-4 py-2.5 text-sm text-muted">
      <span>{{ t.categoria.mostrando(linhas.length) }}</span>
      <span class="ml-auto rounded-md border border-default px-2.5 py-1">{{ t.categoria.porPagina }}</span>
      <span class="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-medium text-inverted">1</span>
    </footer>
  </div>
</template>

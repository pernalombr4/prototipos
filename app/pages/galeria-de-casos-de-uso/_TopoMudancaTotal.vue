<script setup lang="ts">
import type { Textos } from './textos'

/**
 * OPÇÃO DE MUDANÇA TOTAL (rodada 6): a parte de cima da tela.
 *
 *   "deixando a tela com cara de galeria nela toda e o botao de
 *    exportar/importar mais disfarçado, mas ele nao pode perder tanto o
 *    destaque" e "adpate sem mudar nossa logica" (Mikaela)
 *
 * A lógica é a de hoje, sem tirar nem pôr:
 *   EXPORTAR   1 clique, baixa o arquivo da estrutura (o texto de hoje vai
 *              no tooltip);
 *   IMPORTAR   escolhe o arquivo e a importação começa, pela tabela de
 *              Backup/Migração. O aviso "Atenção" de hoje (categorias
 *              duplicadas) sai do meio da página e vai para o momento da
 *              decisão: a camada que abre antes de escolher o arquivo.
 *
 * O que muda é o lugar: o título da página à esquerda e, à direita, o grupo
 * "Migração de Workspace" com os 2 botões. É o padrão do mercado: ClickUp,
 * monday, Pipefy e Airtable deixam importar e exportar fora da vitrine de
 * modelos, num canto ou num menu (PESQUISA.md, rodada 6). O grupo tem
 * moldura, rótulo e o Importar em cor, para não sumir.
 */
const props = defineProps<{ t: Textos, exportando: boolean }>()
const emit = defineEmits<{ exportar: [], importar: [arquivo: string] }>()

const importarAberto = ref(false)
const arquivo = useTemplateRef<HTMLInputElement>('arquivo')

function escolheu(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  importarAberto.value = false
  emit('importar', f.name)
  ;(e.target as HTMLInputElement).value = ''
}
</script>

<template>
  <header class="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
    <div class="min-w-0 flex-1">
      <h1 class="text-2xl font-semibold text-highlighted">{{ props.t.titulo }}</h1>
      <p class="mt-1 max-w-3xl text-sm text-muted">{{ props.t.subtituloTotal }}</p>
    </div>

    <!-- Migração de Workspace: discreto, mas com moldura, rótulo e o Importar em cor. -->
    <div role="group" :aria-label="props.t.migracaoTitulo" class="flex w-full shrink-0 items-center gap-2 rounded-lg border border-default bg-elevated/40 py-1.5 pl-4 pr-1.5 sm:w-auto">
      <UIcon name="i-lucide-folder-sync" class="size-4 shrink-0 text-toned" />
      <!-- No celular, o rótulo longo sai; o ícone e o "?" ficam. -->
      <span class="hidden text-sm font-medium text-highlighted sm:inline">{{ props.t.migracaoTitulo }}</span>
      <UTooltip :text="props.t.migracaoDescricao">
        <UIcon name="i-lucide-circle-help" class="size-3.5 shrink-0 text-muted" tabindex="0" :aria-label="props.t.migracaoDescricao" />
      </UTooltip>
      <span class="mx-2 h-6 w-px bg-accented" aria-hidden="true" />
      <span class="flex-1 sm:hidden" aria-hidden="true" />

      <UTooltip :text="props.t.exportarTexto" :content="{ side: 'bottom' }" :ui="{ content: 'max-w-72 h-auto whitespace-normal py-1.5' }">
        <UButton :label="props.t.exportarTitulo" icon="i-lucide-download" color="neutral" variant="ghost" size="md" :loading="props.exportando" @click="emit('exportar')" />
      </UTooltip>

      <UPopover v-model:open="importarAberto" :content="{ align: 'end', sideOffset: 8 }">
        <UButton :label="props.t.importarTitulo" icon="i-lucide-upload" color="primary" variant="soft" size="md" />
        <template #content>
          <div class="w-80 space-y-3 p-4">
            <div>
              <p class="text-sm font-semibold text-highlighted">{{ props.t.importarBotao }}</p>
              <p class="mt-1 text-sm text-muted">{{ props.t.importarTexto }}</p>
            </div>
            <UAlert color="warning" variant="subtle" icon="i-lucide-triangle-alert" :title="props.t.avisoTitulo" :description="props.t.avisoTexto" />
            <div class="flex justify-end gap-2">
              <UButton :label="props.t.cancelar" color="neutral" variant="outline" size="sm" @click="importarAberto = false" />
              <UButton :label="props.t.escolherArquivo" icon="i-lucide-file-json" color="primary" size="sm" @click="arquivo?.click()" />
            </div>
            <input ref="arquivo" type="file" accept=".json,application/json" class="hidden" @change="escolheu">
          </div>
        </template>
      </UPopover>
    </div>
  </header>
</template>

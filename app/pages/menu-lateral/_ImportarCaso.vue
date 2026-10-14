<script setup lang="ts">
import EscolhaDeAplicar from './_EscolhaDeAplicar.vue'
import { arquivoDeExemplo, baixarArquivo, casoDoMenuAtual, lerArquivo, useAplicarCaso, useJanelasDeCasos, type ArquivoDeCaso, type ModoDeAplicar } from './casos'
import { useMenuDoWorkspace } from './estado'
import { rotuloDoNo } from './rotulos'
import { workspace } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * IMPORTAR (rodada 18), pelo "+" do Início.
 *
 *   "se eu coloco em importar, no caso do enspace, devo poder importar caso
 *    de uso extraido de outro workspace pra ja fazer os menus pra mim, e na
 *    hora seleciono se quero que sobrescreva ou some com o que ja tem."
 *    (Mikaela)
 *
 * Dois passos na mesma janela: o arquivo (área de arraste, como pede o
 * protótipo `migracao-de-workspace`) e, lido o arquivo, de onde ele veio, o
 * que entra e a escolha entre somar e substituir.
 *
 * O arquivo é lido no próprio navegador (FileReader): nada vai para a rede.
 * "Usar um arquivo de exemplo" existe para a demonstração não depender de ter
 * um arquivo à mão; e o "Exportar o meu menu" do pé gera um arquivo que este
 * mesmo Importar lê, então a ida e a volta funcionam no protótipo.
 */
const props = defineProps<{ t: TextosDaTela }>()

const janelas = useJanelasDeCasos()
const { aplicar } = useAplicarCaso()
const menu = useMenuDoWorkspace()
const toast = useToast()

const arquivo = ref<ArquivoDeCaso | null>(null)
const erro = ref(false)
const sobre = ref(false)
const modo = ref<ModoDeAplicar>('somar')
const lugar = ref<'inicio' | 'trilha'>('inicio')
const seletor = ref<HTMLInputElement | null>(null)

watch(() => janelas.importando.value, (v) => {
  if (!v) return
  arquivo.value = null
  erro.value = false
  modo.value = 'somar'
  lugar.value = 'inicio'
})

function ler(f: File | undefined) {
  if (!f) return
  const leitor = new FileReader()
  leitor.onload = () => {
    const lido = lerArquivo(String(leitor.result ?? ''))
    erro.value = !lido
    arquivo.value = lido
  }
  leitor.readAsText(f)
}

function soltar(e: DragEvent) {
  e.preventDefault()
  sobre.value = false
  ler(e.dataTransfer?.files?.[0])
}

function importar() {
  if (!arquivo.value) return
  aplicar(arquivo.value.caso, modo.value, lugar.value)
  toast.add({ title: props.t.casoAplicado(arquivo.value.caso.nome), icon: 'i-lucide-download', color: 'success' })
  janelas.importando.value = false
}

/** Os menus que o workspace criou, num arquivo que este Importar lê de volta. */
function exportarMenu() {
  const menus = menu.rascunho.value.filter(n => n.tipo === 'secao' && menu.origemDe(n) === 'workspace')
  const caso = casoDoMenuAtual(`Menu de ${workspace.nome}`, menus, n => rotuloDoNo(n, props.t))
  baixarArquivo({ formato: 'enspace-caso-de-uso', versao: 1, workspace: workspace.nome, exportadoEm: new Date().toISOString().slice(0, 10), caso })
  toast.add({ title: props.t.casoExportado(caso.nome), icon: 'i-lucide-upload', color: 'neutral' })
}
</script>

<template>
  <UModal v-model:open="janelas.importando.value" :title="props.t.importarTitulo" :ui="{ content: 'max-w-xl' }">
    <template #body>
      <!-- Passo 1: o arquivo -->
      <div v-if="!arquivo">
        <div
          role="button"
          tabindex="0"
          class="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors focus-visible:outline-2 focus-visible:outline-primary"
          :class="sobre ? 'border-primary bg-primary/5' : 'border-default hover:bg-elevated/50'"
          @click="seletor?.click()"
          @keydown.enter.prevent="seletor?.click()"
          @keydown.space.prevent="seletor?.click()"
          @dragover.prevent="sobre = true"
          @dragleave="sobre = false"
          @drop="soltar"
        >
          <UIcon name="i-lucide-file-up" class="size-8 text-toned" />
          <p class="text-sm font-medium text-highlighted">{{ props.t.arrasteArquivo }}</p>
          <p class="text-xs text-muted">{{ props.t.arquivoDica }}</p>
          <input ref="seletor" type="file" accept=".json,application/json" class="hidden" @change="e => ler((e.target as HTMLInputElement).files?.[0])">
        </div>
        <p v-if="erro" class="mt-2 animate-[entrada_0.2s_ease-out_both] text-sm text-error-700 dark:text-error-300" role="alert">
          {{ props.t.arquivoInvalido }}
        </p>
        <UButton
          :label="props.t.usarExemplo"
          icon="i-lucide-file-json"
          size="sm"
          color="neutral"
          variant="link"
          class="mt-2"
          @click="arquivo = arquivoDeExemplo; erro = false"
        />
      </div>

      <!-- Passo 2: de onde veio, o que entra, e somar ou substituir -->
      <div v-else class="animate-[entrada_0.2s_ease-out_both] space-y-5">
        <div class="flex items-center gap-3 rounded-lg bg-elevated/60 p-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-default bg-default">
            <UIcon :name="arquivo.caso.icone" class="size-5 text-highlighted" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-semibold text-highlighted">{{ arquivo.caso.nome }}</span>
            <span class="block truncate text-xs text-muted">{{ props.t.deOnde(arquivo.workspace, arquivo.exportadoEm) }}</span>
          </span>
          <UButton :label="props.t.trocarArquivo" size="xs" color="neutral" variant="outline" @click="arquivo = null" />
        </div>
        <EscolhaDeAplicar v-model:modo="modo" v-model:lugar="lugar" :t="props.t" :caso="arquivo.caso" />
      </div>
    </template>
    <template #footer>
      <div class="flex w-full flex-wrap items-center justify-between gap-2">
        <UTooltip :text="props.t.exportarDica">
          <UButton :label="props.t.exportarMenu" icon="i-lucide-upload" size="sm" color="neutral" variant="ghost" @click="exportarMenu" />
        </UTooltip>
        <div class="flex gap-2">
          <UButton :label="props.t.cancelar" color="neutral" variant="ghost" @click="janelas.importando.value = false" />
          <UButton
            :label="props.t.importarBotao"
            icon="i-lucide-download"
            :color="modo === 'substituir' ? 'error' : 'primary'"
            :disabled="!arquivo"
            @click="importar"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

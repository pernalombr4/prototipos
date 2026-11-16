<script setup lang="ts">
/**
 * PROPOSTA: as 2 portas para pôr um documento no conhecimento, no jeito do
 * Claude: enviar arquivo (botão ou soltar na área) e escrever texto (janela
 * com título e conteúdo). Serve ao workspace e ao agente.
 *
 * MAQUETE: enviar qualquer arquivo gera o arquivo de exemplo recebido em
 * `exemplo`; nada sai do navegador.
 */
import type { Textos } from './textos'
import { EU, type ArquivoDeReferencia } from './mocks'
import { espera } from './estado'

const props = defineProps<{ t: Textos, escopo: ArquivoDeReferencia['escopo'], exemplo: ArquivoDeReferencia }>()
const emit = defineEmits<{ criado: [d: ArquivoDeReferencia] }>()
const toast = useToast()
const k = computed(() => props.t.conhecimento)

const enviando = ref(false)
const entrada = ref<HTMLInputElement>()
async function enviar() {
  enviando.value = true
  await espera(1200)
  enviando.value = false
  emit('criado', { ...props.exemplo, id: `${props.exemplo.id}-${Date.now()}` })
  toast.add({ title: k.value.enviado(props.exemplo.nome), icon: 'i-lucide-file-check', color: 'success' })
}
function aoEscolher(e: Event) {
  ;(e.target as HTMLInputElement).value = ''
  enviar()
}

const escrevendo = ref(false)
const nome = ref('')
const texto = ref('')
watch(escrevendo, (v) => {
  if (v) { nome.value = ''; texto.value = '' }
})
function adicionarTexto() {
  const n = nome.value.trim()
  if (!n || !texto.value.trim()) return
  const tokens = Math.max(1, Math.round(texto.value.length / 3000))
  emit('criado', {
    id: `t-${Date.now()}`, nome: n, tipo: 'texto', escopo: props.escopo, fixado: false,
    tamanho: Math.max(1, Math.round(texto.value.length / 1024)), paginas: 1, tokens,
    enviadoEm: '2026-11-16', enviadoPor: EU, versao: 1, texto: texto.value,
  })
  escrevendo.value = false
  toast.add({ title: k.value.textoCriado(n), icon: 'i-lucide-notebook-pen', color: 'success' })
}

</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap justify-end gap-2">
      <UButton :label="k.escrever" icon="i-lucide-notebook-pen" color="neutral" variant="outline" @click="escrevendo = true" />
      <input ref="entrada" type="file" accept=".pdf,.docx,.xlsx,.txt,.md" class="hidden" @change="aoEscolher">
      <UButton :label="enviando ? k.enviando : k.enviar" icon="i-lucide-upload" :loading="enviando" @click="entrada?.click()" />
    </div>

    <button
      type="button"
      class="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-accented px-4 py-4 text-center transition hover:border-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary"
      @click="entrada?.click()"
      @dragover.prevent
      @drop.prevent="enviar"
    >
      <UIcon name="i-lucide-file-up" class="size-6 text-dimmed" />
      <span class="text-sm text-default">{{ k.soltar }}</span>
      <span class="text-xs text-muted">{{ k.formatos }}</span>
    </button>

    <UModal v-model:open="escrevendo" :title="k.textoTitulo" :ui="{ content: 'max-w-2xl' }">
      <template #body>
        <div class="space-y-4">
          <UFormField :label="k.textoNome" required>
            <UInput v-model="nome" :placeholder="k.textoNomePlaceholder" class="w-full" autofocus />
          </UFormField>
          <UFormField :label="k.textoConteudo" required>
            <UTextarea v-model="texto" :placeholder="k.textoConteudoPlaceholder" :rows="10" autoresize :maxrows="18" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.editor.cancelar" color="neutral" variant="outline" @click="escrevendo = false" />
          <UButton :label="k.textoAdicionar" icon="i-lucide-plus" :disabled="!nome.trim() || !texto.trim()" @click="adicionarTexto" />
        </div>
      </template>
    </UModal>
  </div>
</template>

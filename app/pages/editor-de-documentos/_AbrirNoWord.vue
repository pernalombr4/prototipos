<script setup lang="ts">
/**
 * PROPOSTA: abrir o documento do campo no Word, sem baixar e subir de volta.
 *
 * O caminho principal (PESQUISA.md, "A limitação técnica"):
 *   1. o ENSPACE reserva o documento para quem abriu (bloqueio com dono e
 *      validade; quem chega depois só lê);
 *   2. o Word do computador abre o arquivo DIRETO do item, pelo endereço do
 *      próprio ENSPACE (WebDAV + `ms-word:ofe|u|...`). Nada vai para
 *      Downloads;
 *   3. o Salvar do Word (Ctrl+S) grava no item, e cada Salvar vira uma versão.
 *      Fechar o documento libera.
 *
 * A saída de emergência, para quando o Word não abre (Mac em só leitura,
 * protocolo bloqueado pela TI): baixar o arquivo LIGADO ao item. O .docx leva
 * dentro o vínculo (item, campo, versão), e o painel do suplemento reconhece e
 * oferece "Salvar no ENSPACE".
 *
 * Word para a web é a fase 2 e só aparece se o configurador ligar: uma cópia
 * vai para o OneDrive de quem edita e volta ao concluir.
 *
 * Nada abre de verdade: a sequência é simulada e o "Ver o Word" mostra a
 * maquete da janela do Word com o painel do ENSPACE.
 */
import type { Textos } from './textos'
import { EU, pessoa } from './mocks'
import { nomeCurto, useDocumentos } from './estado'
import { abrirNoWordDoComputador, arquivoDoItem, baixarArquivo } from './arquivos'

const props = defineProps<{
  t: Textos
  itemId: number | null
  editor: 'word-desktop' | 'word-web'
}>()

const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ verJanela: [copiaBaixada: boolean], editarJunto: [] }>()

const toast = useToast()
const { itemPorId, abrirSessao, suplementoInstalado, wordDeVerdade } = useDocumentos()

const item = computed(() => (props.itemId !== null ? itemPorId(props.itemId) : null))
const doc = computed(() => item.value?.data.minuta_do_contrato ?? null)
const ocupadaPor = computed(() => {
  const s = doc.value?.sessao
  return s && s.editor === 'onlyoffice' && s.pessoa !== EU.id ? s.pessoa : null
})

/** 0 = nada; 1, 2, 3 = passo em andamento; 4 = pronto. */
const passo = ref(0)
const ajudaAberta = ref(false)

watch(aberto, async (v) => {
  ajudaAberta.value = false
  passo.value = 0
  if (!v || ocupadaPor.value !== null || props.itemId === null) return
  for (const p of [1, 2, 3]) {
    passo.value = p
    await new Promise(r => setTimeout(r, p === 2 ? 900 : 600))
    if (!aberto.value) return
    if (p === 1) abrirSessao(props.itemId, props.editor)
  }
  passo.value = 4
  toast.add({ title: props.t.word.abertoToast, icon: 'i-lucide-monitor-check', color: 'success' })
})

const passos = computed(() => [
  { titulo: props.t.word.passoReservar, detalhe: props.t.word.passoReservarDetalhe, icone: 'i-lucide-lock-keyhole' },
  { titulo: props.t.word.passoAbrir, detalhe: props.t.word.passoAbrirDetalhe[props.editor], icone: props.editor === 'word-web' ? 'i-lucide-globe' : 'i-lucide-monitor' },
  { titulo: props.t.word.passoSalvar, detalhe: props.t.word.passoSalvarDetalhe[props.editor], icone: 'i-lucide-save' },
])

function verJanela(copia: boolean) {
  aberto.value = false
  if (copia) {
    const a = item.value ? arquivoDoItem(item.value) : null
    if (a) baixarArquivo(a)
    toast.add({ title: props.t.word.baixadoToast, icon: 'i-lucide-download', color: 'info' })
  }
  emit('verJanela', copia)
}

/** O Word real: só de novo, dentro do clique. */
function abrirDeNovo() {
  if (item.value) abrirNoWordDoComputador(item.value)
}

const real = computed(() => wordDeVerdade.value && props.editor === 'word-desktop' && !!item.value && !arquivoDoItem(item.value)?.local)
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="ocupadaPor !== null ? t.word.ocupadoTitulo(nomeCurto(ocupadaPor)) : t.word.titulo[editor]"
    :description="ocupadaPor !== null ? t.word.ocupadoDescricao : t.word.descricao[editor]"
    :ui="{ content: 'max-w-lg', footer: 'justify-end' }"
  >
    <template #body>
      <!-- alguém está no ONLYOFFICE: o Word espera -->
      <div v-if="ocupadaPor !== null" class="flex items-center gap-3 rounded-lg bg-elevated/60 p-3">
        <UChip color="success" size="md" position="bottom-right" inset>
          <UAvatar :text="pessoa(ocupadaPor).iniciais" />
        </UChip>
        <p class="text-sm text-toned">
          {{ t.campo.editandoAgoraNoEnspace(nomeCurto(ocupadaPor)) }}
        </p>
      </div>

      <template v-else>
        <ol class="space-y-3">
          <li v-for="(p, i) in passos" :key="i" class="flex gap-3">
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300"
              :class="passo > i + 1 ? 'bg-success/15 text-success' : passo === i + 1 ? 'bg-primary/15 text-primary' : 'bg-elevated text-dimmed'"
            >
              <UIcon
                :name="passo > i + 1 ? 'i-lucide-check' : passo === i + 1 && i < 2 ? 'i-lucide-loader-circle' : p.icone"
                class="size-4"
                :class="passo === i + 1 && i < 2 ? 'animate-spin' : ''"
              />
            </span>
            <span class="min-w-0 pt-0.5">
              <span class="block text-sm font-medium" :class="passo >= i + 1 ? 'text-highlighted' : 'text-muted'">{{ p.titulo }}</span>
              <span class="block text-xs text-muted">{{ p.detalhe }}</span>
            </span>
          </li>
        </ol>

        <UAlert
          v-if="real && passo >= 2"
          class="mt-4"
          color="info"
          variant="subtle"
          icon="i-lucide-flask-conical"
          :description="t.word.notaPrototipo"
          :actions="[{ label: t.word.abrirDeNovo, color: 'info', variant: 'outline', size: 'xs', icon: 'i-lucide-monitor-up', onClick: abrirDeNovo }]"
        />

        <UAlert
          v-if="!suplementoInstalado && editor === 'word-desktop'"
          class="mt-4"
          color="neutral"
          variant="subtle"
          icon="i-lucide-puzzle"
          :description="t.word.dicaSuplemento"
          :actions="[{ label: t.word.instalarSuplemento, color: 'neutral', variant: 'link', size: 'xs', trailingIcon: 'i-lucide-arrow-up-right', onClick: () => toast.add({ title: t.word.instalarSuplemento, description: 'Maquete: abre a página de instalação do suplemento.', color: 'neutral' }) }]"
        />

        <UCollapsible v-if="editor === 'word-desktop'" v-model:open="ajudaAberta" class="mt-4">
          <UButton
            :label="t.word.naoAbriu"
            color="neutral"
            variant="link"
            size="xs"
            :trailing-icon="ajudaAberta ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="px-0"
          />
          <template #content>
            <div class="mt-2 rounded-md border border-default p-3">
              <p class="text-xs text-muted">
                {{ t.word.naoAbriuDetalhe }}
              </p>
              <UButton
                class="mt-2"
                icon="i-lucide-download"
                :label="t.word.baixarArquivo"
                color="neutral"
                variant="outline"
                size="xs"
                :disabled="passo < 4"
                @click="verJanela(true)"
              />
            </div>
          </template>
        </UCollapsible>
      </template>
    </template>

    <template #footer="{ close }">
      <template v-if="ocupadaPor !== null">
        <UButton :label="t.word.fechar" color="neutral" variant="outline" @click="close" />
        <UButton icon="i-lucide-users" :label="t.campo.editarJunto" @click="aberto = false; emit('editarJunto')" />
      </template>
      <template v-else>
        <UButton :label="t.word.fechar" color="neutral" variant="outline" @click="close" />
        <UButton
          icon="i-lucide-app-window"
          :label="passo < 4 ? t.word.abrindo : t.word.abrirJanela"
          :loading="passo < 4"
          @click="verJanela(false)"
        />
      </template>
    </template>
  </UModal>
</template>

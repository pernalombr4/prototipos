<script setup lang="ts">
/**
 * MAQUETE do Word, com o painel do suplemento do ENSPACE.
 *
 * A janela do Word NÃO é proposta e não copia a identidade da Microsoft:
 * barra, faixa e página são cinza, só para dar contexto. O que é proposta:
 *
 * - o Salvar do Word (Ctrl+S) grava no item, e a barra diz "Salvo no
 *   ENSPACE às 14:22", como o Word diz "Salvo no OneDrive";
 * - o painel do suplemento ganha a aba "Documento", antes de "Assistentes
 *   (IA)" e "Templates" (as 2 que já existem): diz a qual item e campo o
 *   arquivo pertence, qual versão foi aberta, se há mudança não salva, e traz
 *   "Salvar no ENSPACE" e "Concluir e liberar";
 * - sem o suplemento, o Salvar continua gravando no item. Só falta o painel;
 * - na cópia baixada (saída de emergência), o Salvar do Word grava no
 *   computador, e é o "Salvar no ENSPACE" do painel que leva para o item.
 *
 * Fechar a janela pelo X não libera: é a pessoa voltando ao ENSPACE com o
 * Word ainda aberto. Libera quem conclui.
 */
import type { Textos } from './textos'
import { corpoDaMinuta } from './mocks'
import { hora, useDocumentos, ICONE_DO_EDITOR } from './estado'

const props = defineProps<{
  t: Textos
  idioma: string
  workspace: string
  rotuloDoCampo: string
  copiaBaixada: boolean
}>()

const toast = useToast()
const { janelaDoWord, itemPorId, novaVersao, fecharSessao, suplementoInstalado } = useDocumentos()

const aberto = computed({
  get: () => janelaDoWord.value !== null,
  set: (v) => { if (!v) janelaDoWord.value = null },
})

const item = computed(() => (janelaDoWord.value !== null ? itemPorId(janelaDoWord.value) : null))
const doc = computed(() => item.value?.data.minuta_do_contrato ?? null)
const corpo = computed(() => (item.value ? corpoDaMinuta(item.value.data, props.idioma) : null))
const comPainel = computed(() => suplementoInstalado.value || props.copiaBaixada)

const versaoAberta = ref(0)
const pendente = ref(false)
const salvando = ref(false)
const ultimoSalvo = ref<{ n: number, em: Date } | null>(null)
const salvoNoComputador = ref(false)

watch(aberto, (v) => {
  if (v) {
    versaoAberta.value = doc.value?.versoes.length ?? 0
    pendente.value = false
    ultimoSalvo.value = null
    salvoNoComputador.value = false
  }
})

function aoDigitar() {
  pendente.value = true
  salvoNoComputador.value = false
}

async function salvarNoEnspace() {
  if (!item.value || !pendente.value) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 800))
  const n = novaVersao(item.value.id, 'word')
  salvando.value = false
  pendente.value = false
  ultimoSalvo.value = { n, em: new Date() }
  toast.add({ title: props.t.word.recebidoToast(n), icon: ICONE_DO_EDITOR['word-desktop'], color: 'success' })
}

/** O Ctrl+S do Word: no arquivo do item grava no ENSPACE; na cópia, no computador. */
function salvarDoWord() {
  if (props.copiaBaixada) {
    salvoNoComputador.value = true
    toast.add({ title: props.t.janela.copiaBaixada, icon: 'i-lucide-hard-drive-download', color: 'warning' })
    return
  }
  salvarNoEnspace()
}

async function concluirELiberar() {
  if (pendente.value) await salvarNoEnspace()
  if (item.value) fecharSessao(item.value.id)
  aberto.value = false
  toast.add({ title: props.t.janela.fecharELiberar, icon: 'i-lucide-lock-open', color: 'neutral' })
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="`${doc?.name ?? ''} · ${t.janela.tituloDoApp}`"
    :ui="{ content: 'max-w-6xl h-[88vh] flex flex-col overflow-hidden' }"
  >
    <template #content>
      <div v-if="item && doc && corpo" class="flex h-full min-h-0 flex-col" @keydown.ctrl.s.prevent="salvarDoWord" @keydown.meta.s.prevent="salvarDoWord">
        <!-- aviso de maquete -->
        <p class="flex shrink-0 items-center gap-2 bg-warning/10 px-3 py-1.5 text-xs text-warning">
          <UIcon name="i-lucide-construction" class="size-3.5 shrink-0" />
          {{ t.janela.aviso }}
        </p>

        <!-- barra de título (cinza, sem identidade) -->
        <div class="flex shrink-0 items-center gap-3 border-b border-default bg-elevated px-3 py-1.5">
          <UIcon name="i-lucide-file-text" class="size-4 text-toned" />
          <span class="min-w-0 truncate text-xs text-highlighted">{{ doc.name }}</span>
          <span class="flex shrink-0 items-center gap-1 text-xs" :class="pendente ? 'text-muted' : 'text-success'">
            <UIcon :name="pendente ? 'i-lucide-circle-dot' : 'i-lucide-cloud-check'" class="size-3.5" />
            <template v-if="pendente || salvoNoComputador">{{ t.janela.naoSalvoNaBarra }}</template>
            <template v-else-if="!copiaBaixada">{{ t.janela.salvoNaBarra(hora(ultimoSalvo?.em ?? doc.updated_at, idioma)) }}</template>
          </span>
          <UButton
            class="ml-auto"
            icon="i-lucide-save"
            :label="t.janela.salvarAtalho"
            color="neutral"
            variant="ghost"
            size="xs"
            :loading="salvando"
            @click="salvarDoWord"
          />
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.word.fechar" @click="aberto = false" />
        </div>
        <div class="flex h-9 shrink-0 items-center gap-2 border-b border-default bg-elevated/50 px-3" aria-hidden="true">
          <span v-for="n in 10" :key="n" class="h-3 rounded-sm bg-accented" :class="n % 4 === 0 ? 'w-14' : 'w-6'" />
        </div>

        <div class="flex min-h-0 flex-1">
          <!-- a página -->
          <div class="min-w-0 flex-1 overflow-y-auto bg-accented/40 px-4 py-6">
            <p class="mx-auto mb-3 max-w-[44rem] text-xs text-muted">
              {{ t.janela.dicaDigitar }}
            </p>
            <article
              class="mx-auto min-h-[50rem] max-w-[44rem] bg-default px-14 py-12 font-serif text-[13px] leading-relaxed text-default shadow-md ring-1 ring-default/50 focus:outline-none"
              contenteditable="true"
              spellcheck="true"
              :lang="idioma"
              @input="aoDigitar"
            >
              <h1 v-if="corpo.titulo" class="mb-6 text-center text-base font-bold tracking-wide text-highlighted">
                {{ corpo.titulo }}
              </h1>
              <p v-for="(p, i) in corpo.paragrafos" :key="i" class="mb-3 text-justify">
                {{ p }}
              </p>
            </article>
            <p v-if="!comPainel" class="mx-auto mt-4 flex max-w-[44rem] items-center gap-1.5 text-xs text-muted">
              <UIcon name="i-lucide-info" class="size-3.5" />
              {{ t.janela.semPainel }}
            </p>
          </div>

          <!-- PROPOSTA: o painel do suplemento, aba Documento -->
          <aside v-if="comPainel" class="flex w-80 shrink-0 flex-col border-l border-default bg-default">
            <div class="flex items-center justify-between border-b border-default px-4 py-2.5">
              <span class="text-sm font-semibold text-highlighted">{{ t.janela.painel }}</span>
              <span class="max-w-36 truncate text-xs text-muted">{{ workspace }}</span>
            </div>
            <div class="flex gap-3 border-b border-default px-4 text-xs">
              <span
                v-for="(a, i) in t.janela.abas"
                :key="a"
                class="py-2"
                :class="i === 0 ? 'border-b-2 border-primary font-medium text-highlighted' : 'text-muted'"
              >{{ a }}</span>
            </div>

            <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
              <div class="rounded-lg border border-default p-3">
                <p class="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
                  <UIcon name="i-lucide-link-2" class="size-3.5" />
                  {{ t.janela.vinculado }}
                </p>
                <dl class="space-y-1.5 text-sm">
                  <div class="flex gap-2">
                    <dt class="w-14 shrink-0 text-muted">{{ t.janela.item }}</dt>
                    <dd class="min-w-0 text-highlighted">
                      <UBadge :label="item.reference" color="info" variant="subtle" size="sm" class="font-mono" />
                      <span class="mt-0.5 block truncate">{{ item.data.contratante }}</span>
                    </dd>
                  </div>
                  <div class="flex gap-2">
                    <dt class="w-14 shrink-0 text-muted">{{ t.janela.campo }}</dt>
                    <dd class="text-highlighted">{{ rotuloDoCampo }}</dd>
                  </div>
                </dl>
                <p class="mt-2 text-xs text-muted">
                  {{ t.janela.versaoAberta(versaoAberta) }}
                </p>
              </div>

              <div
                class="flex items-center gap-2 rounded-md px-3 py-2 text-xs"
                :class="pendente ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'"
                role="status"
                aria-live="polite"
              >
                <UIcon :name="pendente ? 'i-lucide-circle-dot' : 'i-lucide-cloud-check'" class="size-4 shrink-0" />
                <span v-if="pendente">{{ t.janela.alteracoesPendentes }}</span>
                <span v-else-if="ultimoSalvo">{{ t.janela.salvoNoEnspace(ultimoSalvo.n, hora(ultimoSalvo.em, idioma)) }}</span>
                <span v-else>{{ t.janela.semAlteracoes }}</span>
              </div>

              <div class="space-y-2">
                <UButton
                  block
                  icon="i-lucide-cloud-upload"
                  :label="salvando ? t.janela.salvandoNoEnspace : t.janela.salvarNoEnspace"
                  :loading="salvando"
                  :disabled="!pendente"
                  @click="salvarNoEnspace"
                />
                <UButton
                  block
                  icon="i-lucide-lock-open"
                  :label="t.janela.fecharELiberar"
                  color="neutral"
                  variant="outline"
                  @click="concluirELiberar"
                />
                <UButton
                  block
                  icon="i-lucide-arrow-up-right"
                  :label="t.janela.abrirItem"
                  color="neutral"
                  variant="link"
                  size="sm"
                  @click="aberto = false"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
/**
 * PROPOSTA: a moldura do ONLYOFFICE.
 *
 * O ONLYOFFICE em si não muda (a barra e a página são maquete, desenhadas só
 * para dar escala). O que muda é tudo em volta dele, que hoje é o problema:
 *
 * - no develop o editor abre numa gaveta por cima da gaveta do item, com ~57%
 *   da largura, e o cabeçalho rola para fora junto com o X (develop-08). Aqui
 *   ele ocupa a tela inteira do ENSPACE, com um cabeçalho fixo que diz QUAL
 *   item e QUAL campo;
 * - no develop a edição só grava com Ctrl+S e nada avisa (BRIEFING, passo 10).
 *   Aqui o estado de salvamento fica sempre visível: "Salvando", "Salvo agora";
 * - "Tela Cheia" do develop virava tela cheia do navegador, sem contexto
 *   (develop-09). Não existe mais: o editor já nasce em tela inteira, e o
 *   cabeçalho continua;
 * - Esc no develop fechava o editor inteiro. Aqui Esc fecha só o que está por
 *   cima (o painel de versões); o editor fecha pelo Concluir, que salva antes;
 * - quem está editando junto aparece em avatares, como no Notion e no Word;
 * - "Abrir no Word" mora no cabeçalho: dá para trocar de editor sem voltar.
 *
 * UModal com `fullscreen` e `dismissible: false` (MCP `nuxt-ui`,
 * get-component-metadata; props conferidas em Modal.vue). O painel de versões
 * é uma coluna dentro da moldura, não outra camada, para não empilhar
 * gaveta sobre gaveta de novo.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { EU, corpoDaMinuta, pessoa } from './mocks'
import { nomeCurto, quandoFoi, useDocumentos } from './estado'
import PainelDeVersoes from './_PainelDeVersoes.vue'

const props = defineProps<{
  t: Textos
  idioma: string
  categoria: string
  rotuloDoCampo: string
  /** Só ler: PDF, alguém no Word, perfil sem edição ou versão antiga. */
  somenteLeitura: boolean
  /** Versão antiga em leitura. `null` = a atual. */
  versao: number | null
}>()

const emit = defineEmits<{ trocarParaWord: [] }>()

const toast = useToast()
const { editorAberto, itemPorId, novaVersao, config } = useDocumentos()

const aberto = computed({
  get: () => editorAberto.value !== null,
  set: (v) => { if (!v) editorAberto.value = null },
})

const item = computed(() => (editorAberto.value !== null ? itemPorId(editorAberto.value) : null))
const doc = computed(() => item.value?.data.minuta_do_contrato ?? null)
const corpo = computed(() => (item.value ? corpoDaMinuta(item.value.data, props.idioma) : null))

/** Quem mais está aqui (presença do ONLYOFFICE). */
const outros = computed(() => {
  const s = doc.value?.sessao
  return s && s.editor === 'onlyoffice' && s.pessoa !== EU.id ? [pessoa(s.pessoa)] : []
})

/* ----------------------------- salvamento ----------------------------- */

type Salvamento = 'salvo' | 'salvando'
const salvamento = ref<Salvamento>('salvo')
const salvoEm = ref<Date>(new Date())
const mudou = ref(false)
const concluindo = ref(false)
const relogio = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined
let tique: ReturnType<typeof setInterval> | undefined

watch(aberto, (v) => {
  painelDeVersoes.value = false
  if (v) {
    mudou.value = false
    salvamento.value = 'salvo'
    salvoEm.value = doc.value?.updated_at ? new Date(doc.value.updated_at) : new Date()
    tique = setInterval(() => (relogio.value += 1), 15_000)
  }
  else {
    clearInterval(tique)
  }
})

function aoDigitar() {
  if (props.somenteLeitura) return
  mudou.value = true
  salvamento.value = 'salvando'
  clearTimeout(timer)
  timer = setTimeout(() => {
    salvamento.value = 'salvo'
    salvoEm.value = new Date()
  }, 900)
}

const textoDoSalvamento = computed(() => {
  void relogio.value
  if (salvamento.value === 'salvando') return props.t.editor.salvando
  const q = quandoFoi(props.t, salvoEm.value)
  return q === props.t.tempo.agora ? props.t.editor.salvoAgora : props.t.editor.salvoHa(q)
})

async function concluir(depois?: () => void) {
  if (mudou.value && item.value) {
    concluindo.value = true
    clearTimeout(timer)
    await new Promise(r => setTimeout(r, 700))
    const n = novaVersao(item.value.id, 'onlyoffice')
    toast.add({ title: props.t.editor.versaoSalva(n), description: `${doc.value?.name}`, icon: 'i-lucide-cloud-check', color: 'success' })
    concluindo.value = false
  }
  aberto.value = false
  depois?.()
}

function irParaWord() {
  concluir(() => emit('trocarParaWord'))
}

/* ----------------------------- versões ----------------------------- */

const painelDeVersoes = ref(false)

function aoTentarFechar() {
  // Esc com o painel aberto fecha só o painel.
  if (painelDeVersoes.value) painelDeVersoes.value = false
}

const menuBaixar = computed<DropdownMenuItem[]>(() => [
  ...(doc.value?.ext === '.pdf' ? [] : [{ label: props.t.campo.baixarDocx, icon: 'i-lucide-file-down', onSelect: () => baixar('.docx') }]),
  { label: props.t.campo.baixarPdf, icon: 'i-lucide-file-type', onSelect: () => baixar('.pdf') },
])

function baixar(ext: string) {
  toast.add({ title: `${doc.value?.name.replace(/\.(docx|pdf)$/i, '')}${ext}`, description: 'Maquete: nada é baixado.', icon: 'i-lucide-download', color: 'neutral' })
}

/* ícones decorativos da barra do ONLYOFFICE (maquete) */
const ferramentas = [
  ['i-lucide-undo-2', 'i-lucide-redo-2'],
  ['i-lucide-bold', 'i-lucide-italic', 'i-lucide-underline', 'i-lucide-strikethrough'],
  ['i-lucide-list', 'i-lucide-list-ordered', 'i-lucide-indent-increase'],
  ['i-lucide-align-left', 'i-lucide-align-center', 'i-lucide-align-justify'],
  ['i-lucide-table', 'i-lucide-image', 'i-lucide-message-square-plus'],
]
</script>

<template>
  <UModal
    v-model:open="aberto"
    fullscreen
    :dismissible="false"
    :close="false"
    :title="doc?.name ?? ''"
    :ui="{ content: 'flex flex-col bg-default' }"
    @close:prevent="aoTentarFechar"
  >
    <template #content>
      <div v-if="item && doc && corpo" class="flex h-full min-h-0 flex-col">
        <!-- ─────────────── cabeçalho do ENSPACE ─────────────── -->
        <header class="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-default px-3 py-2">
          <UButton
            icon="i-lucide-arrow-left"
            :label="t.editor.voltarAoItem"
            color="neutral"
            variant="ghost"
            size="sm"
            :loading="concluindo"
            @click="concluir()"
          />
          <USeparator orientation="vertical" class="h-6" />
          <div class="flex min-w-0 flex-1 items-center gap-2.5">
            <UIcon name="i-lucide-file-text" class="size-5 shrink-0 text-info" />
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-highlighted" :title="doc.name">
                {{ doc.name }}
              </p>
              <p class="truncate text-xs text-muted">
                {{ item.reference }} · {{ categoria }} · {{ rotuloDoCampo }}
              </p>
            </div>
            <UBadge
              v-if="versao"
              :label="`${t.campo.versaoN(versao)} · ${t.campo.semPermissaoTitulo}`"
              icon="i-lucide-history"
              color="warning"
              variant="subtle"
              size="sm"
            />
            <UBadge
              v-else-if="somenteLeitura"
              :label="t.campo.semPermissaoTitulo"
              icon="i-lucide-lock"
              color="neutral"
              variant="subtle"
              size="sm"
            />
          </div>

          <!-- estado de salvamento: sempre à vista -->
          <span
            v-if="!somenteLeitura"
            class="flex items-center gap-1.5 text-xs"
            :class="salvamento === 'salvando' ? 'text-muted' : 'text-success'"
            role="status"
            aria-live="polite"
          >
            <UIcon
              :name="salvamento === 'salvando' ? 'i-lucide-loader-circle' : 'i-lucide-cloud-check'"
              class="size-4"
              :class="salvamento === 'salvando' ? 'animate-spin' : ''"
            />
            {{ textoDoSalvamento }}
          </span>

          <UTooltip v-if="outros.length" :text="t.editor.editandoJunto">
            <UAvatarGroup size="xs" :max="3">
              <UChip v-for="p in outros" :key="p.id" color="success" size="sm" position="bottom-right" inset>
                <UAvatar :text="p.iniciais" :alt="p.nome" />
              </UChip>
              <UAvatar :text="EU.iniciais" :alt="EU.nome" />
            </UAvatarGroup>
          </UTooltip>

          <div class="flex items-center gap-1.5">
            <UButton
              icon="i-lucide-history"
              :label="t.editor.versoes"
              color="neutral"
              :variant="painelDeVersoes ? 'soft' : 'ghost'"
              size="sm"
              :aria-pressed="painelDeVersoes"
              @click="painelDeVersoes = !painelDeVersoes"
            />
            <UDropdownMenu :items="menuBaixar" :content="{ align: 'end' }">
              <UButton icon="i-lucide-download" :label="t.editor.baixar" color="neutral" variant="ghost" size="sm" />
            </UDropdownMenu>
            <UButton
              v-if="config.word && !somenteLeitura && !outros.length"
              icon="i-lucide-monitor"
              :label="t.editor.abrirNoWord"
              color="neutral"
              variant="outline"
              size="sm"
              @click="irParaWord"
            />
            <UButton
              icon="i-lucide-check"
              :label="concluindo ? t.editor.concluindo : t.editor.concluir"
              size="sm"
              :loading="concluindo"
              @click="concluir()"
            />
          </div>
        </header>

        <div class="flex min-h-0 flex-1">
          <!-- ─────────────── área do ONLYOFFICE (maquete) ─────────────── -->
          <div class="flex min-w-0 flex-1 flex-col">
            <div class="shrink-0 border-b border-default bg-elevated/50" aria-hidden="true">
              <div class="flex gap-4 px-3 pt-1.5 text-xs text-muted">
                <span
                  v-for="(aba, i) in t.editor.barra"
                  :key="aba"
                  class="pb-1.5"
                  :class="i === 1 ? 'border-b-2 border-primary font-medium text-highlighted' : ''"
                >{{ aba }}</span>
              </div>
              <div class="flex flex-wrap items-center gap-3 border-t border-default px-3 py-1.5">
                <span class="w-24 rounded-sm border border-default bg-default px-1.5 py-0.5 text-xs text-muted">Calibri</span>
                <span class="w-10 rounded-sm border border-default bg-default px-1.5 py-0.5 text-xs text-muted">11</span>
                <span v-for="(g, i) in ferramentas" :key="i" class="flex items-center gap-2 border-l border-default pl-3">
                  <UIcon v-for="ic in g" :key="ic" :name="ic" class="size-4 text-toned" :class="somenteLeitura ? 'opacity-40' : ''" />
                </span>
              </div>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto bg-accented/40 px-4 py-6">
              <p class="mx-auto mb-3 flex max-w-[48rem] items-center gap-1.5 text-xs text-muted">
                <UIcon name="i-lucide-construction" class="size-3.5" />
                {{ t.editor.areaDoOnlyoffice }}
              </p>
              <article
                class="mx-auto min-h-[60rem] max-w-[48rem] bg-default px-16 py-14 font-serif text-[13px] leading-relaxed text-default shadow-md ring-1 ring-default/50 focus:outline-none"
                :contenteditable="!somenteLeitura"
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
            </div>

            <footer class="flex shrink-0 items-center gap-3 border-t border-default px-3 py-1 text-xs text-muted">
              <span>{{ t.campo.versaoN(versao ?? doc.versoes.length) }}</span>
              <span v-if="doc.versoes.length">· {{ t.campo.editadoPor(nomeCurto(doc.versoes[doc.versoes.length - 1]!.autor), quandoFoi(t, doc.versoes[doc.versoes.length - 1]!.em)) }}</span>
              <span class="ml-auto hidden items-center gap-1 sm:flex">
                <UKbd value="esc" size="sm" />
                {{ t.editor.escHint }}
              </span>
            </footer>
          </div>

          <!-- ─────────────── versões, ao lado ─────────────── -->
          <Transition
            enter-active-class="transition-[width,opacity] duration-200 ease-out"
            enter-from-class="w-0 opacity-0"
            enter-to-class="w-96 opacity-100"
            leave-active-class="transition-[width,opacity] duration-150 ease-in"
            leave-from-class="w-96 opacity-100"
            leave-to-class="w-0 opacity-0"
          >
            <aside v-if="painelDeVersoes" class="w-96 shrink-0 overflow-hidden border-l border-default">
              <div class="flex h-full w-96 flex-col">
                <div class="flex items-center justify-between border-b border-default px-4 py-2.5">
                  <p class="text-sm font-semibold text-highlighted">
                    {{ t.versoes.titulo }}
                  </p>
                  <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.item.fechar" @click="painelDeVersoes = false" />
                </div>
                <div class="min-h-0 flex-1 overflow-y-auto p-4">
                  <PainelDeVersoes :item="item" :t="t" :idioma="idioma" :somente-leitura="somenteLeitura" @ver="painelDeVersoes = false" />
                </div>
              </div>
            </aside>
          </Transition>
        </div>
      </div>
    </template>
  </UModal>
</template>

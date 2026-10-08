<script setup lang="ts">
/**
 * PROPOSTA: o campo Editor de Documentos dentro do formulário do item.
 *
 * O que muda em relação ao develop (prints develop-02, develop-05, develop-10):
 *
 * - VAZIO: no lugar do botão azul "Subir documento", que levava a uma gaveta
 *   com 4 cliques e 1 confirmação, o próprio campo vira a área de soltar o
 *   arquivo e mostra as 3 formas de começar: modelo, em branco, enviar.
 *   Um clique em cada. O "Em branco" não existia;
 * - PREENCHIDO: no lugar do botão sem contorno "Abrir Documento" e do chip
 *   genérico, um cartão com miniatura, nome, versão, quem editou por último e
 *   quando, e um botão Abrir de verdade (com contorno, cor e seta) que lembra
 *   onde a pessoa prefere abrir: ENSPACE (ONLYOFFICE) ou Word;
 * - QUEM ESTÁ COM O DOCUMENTO: o cartão diz se alguém está editando agora, e
 *   onde. No Word, o documento fica reservado para quem abriu;
 * - O X vermelho que apagava o documento ao lado do baixar foi para o menu
 *   "Mais ações", com confirmação que diz o que se perde.
 *
 * Componentes: UFileUpload (área de soltar, variante area, sem prévia),
 * UFieldGroup + UDropdownMenu (botão com seta), UPopover (modelos), UAlert
 * (sessão no Word), UAvatar, UBadge, USkeleton, UModal. Consultados no MCP
 * `nuxt-ui` (get-component-metadata) e conferidos no node_modules.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { type Editor, type ItemDoContrato, type ModeloDeDocumento, EU, corpoDaMinuta, modelos, pessoa } from './mocks'
import { ICONE_DO_EDITOR, hora, nomeCurto, quandoFoi, tamanho, useDocumentos } from './estado'
import Miniatura from './_Miniatura.vue'
import { arquivoDoItem, baixarArquivo } from './arquivos'

const props = defineProps<{
  item: ItemDoContrato
  t: Textos
  idioma: string
  rotulo: string
  /** Na pré-visualização da configuração: só desenha, não age. */
  preview?: boolean
}>()

const emit = defineEmits<{
  abrir: [editor: Editor | null]
  ler: []
  versoes: []
  voltarAoWord: []
  simulacao: []
}>()

const toast = useToast()
const {
  estadoDaTela, config, editoresLigados, editorDoBotao, preferencia,
  criarDocumento, removerDocumento, fecharSessao, nomeDoModelo,
} = useDocumentos()

const doc = computed(() => props.item.data.minuta_do_contrato)
const ultima = computed(() => doc.value?.versoes[doc.value.versoes.length - 1] ?? null)
const ehPdf = computed(() => doc.value?.ext === '.pdf')
const somenteLeitura = computed(() => estadoDaTela.value === 'somenteLeitura' || !config.value.editar)

const sessao = computed(() => doc.value?.sessao ?? null)
const minhaNoWord = computed(() => sessao.value?.pessoa === EU.id && sessao.value.editor !== 'onlyoffice')
const outraNoWord = computed(() => !!sessao.value && sessao.value.pessoa !== EU.id && sessao.value.editor !== 'onlyoffice')
const outraNoEnspace = computed(() => !!sessao.value && sessao.value.pessoa !== EU.id && sessao.value.editor === 'onlyoffice')

/* ------------------------------ criar ------------------------------ */

type Criando = { tipo: 'modelo' | 'branco' | 'envio', nome: string } | null
const criando = ref<Criando>(null)
const popoverModelos = ref(false)
/**
 * O modelo em prévia. No develop, escolher levava a "Tem certeza que deseja
 * gerar o documento a partir do modelo X?". Aqui a pergunta vira a prévia do
 * texto já preenchido com os dados do item (padrão do Pipefy, PESQUISA.md).
 */
const modeloEmPrevia = ref<ModeloDeDocumento | null>(null)
watch(popoverModelos, (v) => { if (!v) modeloEmPrevia.value = null })
const previa = computed(() => corpoDaMinuta(props.item.data, props.idioma))
const valoresDoItem = computed(() => {
  const d = props.item.data
  return [d.contratante, d.objeto.toLowerCase(), new Intl.NumberFormat(props.idioma, { style: 'currency', currency: 'BRL' }).format(d.valor), String(d.vigencia_meses)]
})
/** Quebra o parágrafo em pedaços, marcando o que veio do item. */
function marcar(texto: string) {
  const partes: { texto: string, doItem: boolean }[] = []
  let resto = texto
  while (resto) {
    let achou: { i: number, v: string } | null = null
    for (const v of valoresDoItem.value) {
      const i = resto.indexOf(v)
      if (i >= 0 && (!achou || i < achou.i)) achou = { i, v }
    }
    if (!achou) { partes.push({ texto: resto, doItem: false }); break }
    if (achou.i > 0) partes.push({ texto: resto.slice(0, achou.i), doItem: false })
    partes.push({ texto: achou.v, doItem: true })
    resto = resto.slice(achou.i + achou.v.length)
  }
  return partes
}
const arquivo = ref<File | null>(null)

const nomesDosCampos: Record<string, () => string> = {
  contratante: () => props.t.lista.contratante,
  objeto: () => props.t.item.objeto,
  valor: () => props.t.lista.valor,
  vigencia_meses: () => props.t.item.vigencia,
  status: () => props.t.lista.status,
  responsavel: () => props.t.item.responsavel,
}

function listaDeCampos(m: ModeloDeDocumento) {
  const nomes = m.variaveis.map(v => nomesDosCampos[v]?.() ?? v)
  return new Intl.ListFormat(props.idioma, { type: 'conjunction' }).format(nomes)
}

async function esperar(ms: number) {
  await new Promise(r => setTimeout(r, ms))
}

async function usarModelo(m: ModeloDeDocumento) {
  popoverModelos.value = false
  const nome = nomeDoModelo(m, props.item)
  criando.value = { tipo: 'modelo', nome }
  await esperar(1400)
  criarDocumento(props.item.id, nome, '.docx', 46_000, 'modelo')
  criando.value = null
  toast.add({ title: props.t.campo.criado, description: props.t.campo.criadoDescricao(props.t.versoes.origem.modelo.toLowerCase()), icon: 'i-lucide-file-check-2', color: 'success' })
}

async function emBranco() {
  const nome = `${props.rotulo} ${props.item.reference}.docx`
  criando.value = { tipo: 'branco', nome }
  await esperar(700)
  criarDocumento(props.item.id, nome, '.docx', 12_000, 'branco')
  criando.value = null
  toast.add({ title: props.t.campo.criado, description: props.t.campo.criadoDescricao(props.t.versoes.origem.branco.toLowerCase()), icon: 'i-lucide-file-check-2', color: 'success' })
  emit('abrir', editorDoBotao.value)
}

const aceitos = computed(() => [config.value.docx ? '.docx' : '', config.value.pdf ? '.pdf' : ''].filter(Boolean).join(','))

watch(arquivo, async (f) => {
  if (!f) return
  const ext = f.name.toLowerCase().endsWith('.pdf') ? '.pdf' : f.name.toLowerCase().endsWith('.docx') ? '.docx' : null
  if (!ext || !aceitos.value.includes(ext)) {
    toast.add({ title: props.t.campo.arquivoRecusado, description: props.t.campo.arquivoRecusadoDetalhe, icon: 'i-lucide-file-x-2', color: 'error' })
    arquivo.value = null
    return
  }
  criando.value = { tipo: 'envio', nome: f.name }
  await esperar(1100)
  // O arquivo fica no navegador (blob:), como se tivesse subido para o ENSPACE.
  criarDocumento(props.item.id, f.name, ext, f.size, 'envio', URL.createObjectURL(f))
  criando.value = null
  arquivo.value = null
  toast.add({ title: props.t.campo.criado, description: props.t.campo.criadoDescricao(props.t.versoes.origem.envio.toLowerCase()), icon: 'i-lucide-file-check-2', color: 'success' })
})

const mostraModelos = computed(() => config.value.modelos)
const mostraBranco = computed(() => config.value.branco)
const mostraEnvio = computed(() => config.value.docx || config.value.pdf)

/* ------------------------------ abrir ------------------------------ */

const rotuloDoBotao = computed(() => {
  if (outraNoEnspace.value) return props.t.campo.editarJunto
  const e = editorDoBotao.value
  return e ? props.t.campo.abrirNo[e] : props.t.campo.abrir
})

const iconeDoBotao = computed(() => {
  if (outraNoEnspace.value) return 'i-lucide-users'
  const e = editorDoBotao.value
  return e ? ICONE_DO_EDITOR[e] : 'i-lucide-square-arrow-out-up-right'
})

function abrirPeloBotao() {
  if (outraNoEnspace.value) return emit('abrir', 'onlyoffice')
  emit('abrir', editorDoBotao.value)
}

/** A seta ao lado do Abrir: cada editor ligado, com o atual marcado. */
const menuDeEditores = computed<DropdownMenuItem[][]>(() => {
  const grupo: DropdownMenuItem[] = editoresLigados.value.map(e => ({
    label: props.t.campo.abrirNo[e],
    description: props.t.campo.descricaoDoEditor[e],
    icon: ICONE_DO_EDITOR[e],
    disabled: outraNoEnspace.value && e !== 'onlyoffice',
    trailingIcon: editorDoBotao.value === e ? 'i-lucide-check' : undefined,
    onSelect: () => emit('abrir', e),
  }))
  const grupos: DropdownMenuItem[][] = [grupo]
  if (preferencia.value) {
    grupos.push([{
      label: props.t.escolha.titulo,
      icon: 'i-lucide-messages-square',
      onSelect: () => {
        preferencia.value = null
        emit('abrir', null)
      },
    }])
  }
  return grupos
})

const menuMais = computed<DropdownMenuItem[][]>(() => [
  [
    ...(ehPdf.value ? [] : [{ label: props.t.campo.baixarDocx, icon: 'i-lucide-file-down', onSelect: () => baixar('.docx') }]),
    { label: props.t.campo.baixarPdf, icon: 'i-lucide-file-type', onSelect: () => baixar('.pdf') },
  ],
  ...(somenteLeitura.value
    ? []
    : [
        [{ label: props.t.campo.substituir, icon: 'i-lucide-file-up', disabled: !!sessao.value, onSelect: () => substituir.value?.click() }],
        [{ label: props.t.campo.remover, icon: 'i-lucide-trash-2', color: 'error' as const, disabled: !!sessao.value, onSelect: () => (confirmarRemocao.value = true) }],
      ]),
])

function baixar(ext: string) {
  const a = arquivoDoItem(props.item)
  if (a && ext === '.docx') return baixarArquivo(a)
  toast.add({ title: `${doc.value?.name.replace(/\.(docx|pdf)$/i, '')}${ext}`, description: props.t.campo.simulacaoBaixar, icon: 'i-lucide-download', color: 'neutral' })
}

const substituir = ref<HTMLInputElement | null>(null)
function aoSubstituir(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  removerDocumento(props.item.id)
  arquivo.value = f
  ;(e.target as HTMLInputElement).value = ''
}

/* ------------------------------ remover ------------------------------ */

const confirmarRemocao = ref(false)
function remover() {
  removerDocumento(props.item.id)
  confirmarRemocao.value = false
  toast.add({ title: props.t.campo.removido, icon: 'i-lucide-trash-2', color: 'neutral' })
}

/* ------------------------------ sessão ------------------------------ */

const avisoPedido = ref(false)
function avisarQuandoLiberar() {
  avisoPedido.value = true
  toast.add({ title: props.t.campo.avisoAgendado(nomeCurto(sessao.value!.pessoa)), icon: 'i-lucide-bell-ring', color: 'info' })
}

function liberar() {
  fecharSessao(props.item.id)
  toast.add({ title: props.t.campo.liberado, icon: 'i-lucide-lock-open', color: 'neutral' })
}

/* ------------------------------ erro ------------------------------ */

const tentando = ref(false)
async function tentarDeNovo() {
  tentando.value = true
  await esperar(900)
  tentando.value = false
  estadoDaTela.value = 'normal'
}
</script>

<template>
  <div class="space-y-1.5">
    <p class="text-sm font-medium text-highlighted">
      {{ rotulo }}
    </p>

    <Transition
      mode="out-in"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <!-- ─────────────── carregando ─────────────── -->
      <div
        v-if="estadoDaTela === 'carregando' && !preview"
        key="carregando"
        class="flex gap-3 rounded-lg border border-default p-3"
        role="status"
        :aria-label="t.campo.carregando"
      >
        <USkeleton class="h-[4.25rem] w-[3.25rem] rounded-[3px]" />
        <div class="flex-1 space-y-2 py-1">
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-3 w-1/2" />
          <USkeleton class="mt-3 h-7 w-40" />
        </div>
      </div>

      <!-- ─────────────── erro ─────────────── -->
      <div v-else-if="estadoDaTela === 'erro' && !preview" key="erro">
      <UAlert
        color="error"
        variant="subtle"
        icon="i-lucide-file-warning"
        :title="t.campo.erroTitulo"
        :description="t.campo.erroDescricao"
        :actions="[{ label: t.campo.tentarDeNovo, color: 'error', variant: 'outline', size: 'xs', icon: 'i-lucide-rotate-cw', loading: tentando, onClick: tentarDeNovo }]"
      />
      </div>

      <!-- ─────────────── criando ─────────────── -->
      <div
        v-else-if="criando"
        key="criando"
        class="flex items-center gap-3 rounded-lg border border-primary/40 bg-primary/5 p-3"
        role="status"
      >
        <Miniatura :ext="criando.nome.endsWith('.pdf') ? '.pdf' : '.docx'" class="animate-pulse" />
        <div class="min-w-0 flex-1 space-y-1.5">
          <p class="text-sm font-medium text-highlighted">
            {{ criando.tipo === 'modelo' ? t.campo.gerando : criando.tipo === 'branco' ? t.campo.criandoEmBranco : t.campo.enviando(criando.nome) }}
          </p>
          <p v-if="criando.tipo === 'modelo'" class="text-xs text-muted">
            {{ t.campo.gerandoDetalhe }}
          </p>
          <UProgress size="xs" animation="carousel" />
        </div>
      </div>

      <!-- ─────────────── vazio, sem permissão ─────────────── -->
      <div
        v-else-if="!doc && somenteLeitura"
        key="vazio-leitura"
        class="flex items-center gap-2 rounded-lg border border-dashed border-default px-3 py-3 text-sm text-muted"
      >
        <UIcon name="i-lucide-file" class="size-4 text-dimmed" />
        {{ t.campo.vazioTitulo }}
      </div>

      <!-- ─────────────── vazio ─────────────── -->
      <div v-else-if="!doc" key="vazio">
      <UFileUpload
        v-model="arquivo"
        :accept="aceitos"
        :interactive="false"
        :preview="false"
        :disabled="preview"
        icon="i-lucide-file-plus-2"
        :label="t.campo.vazioTitulo"
        :description="t.campo.vazioDescricao"
        class="w-full"
        :ui="{
          base: 'min-h-0 items-start gap-0 px-4 py-4 text-left data-[dragging=true]:bg-primary/5',
          wrapper: 'items-start text-left',
          avatar: 'mb-2',
          label: 'mt-0 text-sm font-medium text-highlighted',
          description: 'mt-0.5 text-xs text-muted',
          actions: 'mt-3 flex-wrap justify-start gap-2',
        }"
      >
        <template #actions="{ open }">
          <UPopover v-if="mostraModelos" v-model:open="popoverModelos" :content="{ align: 'start' }">
            <UButton
              icon="i-lucide-layout-template"
              :label="t.campo.usarModelo"
              trailing-icon="i-lucide-chevron-down"
              size="sm"
              :disabled="preview"
            />
            <template #content>
              <Transition
                mode="out-in"
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-x-2"
                leave-active-class="transition duration-100 ease-in"
                leave-to-class="opacity-0 -translate-x-2"
              >
                <div v-if="!modeloEmPrevia" key="lista" class="w-80 p-1.5">
                  <p class="px-2 pb-1.5 pt-1 text-xs font-medium text-muted">
                    {{ t.campo.modelosDaCategoria }}
                  </p>
                  <p v-if="!modelos.length" class="px-2 pb-2 text-sm text-muted">
                    {{ t.campo.semModelos }}
                  </p>
                  <button
                    v-for="m in modelos"
                    :key="m.id"
                    type="button"
                    class="group flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-none"
                    @click="modeloEmPrevia = m"
                  >
                    <UIcon name="i-lucide-file-text" class="mt-0.5 size-4 shrink-0 text-primary" />
                    <span class="min-w-0 flex-1">
                      <span class="block text-sm text-highlighted">{{ m.nome }}</span>
                      <span class="block text-xs text-muted">{{ t.campo.preencheCom(listaDeCampos(m)) }}</span>
                    </span>
                    <UIcon name="i-lucide-chevron-right" class="mt-0.5 size-4 shrink-0 text-dimmed transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                <div v-else key="previa" class="w-96 p-3">
                  <div class="mb-2 flex items-center gap-1">
                    <UButton icon="i-lucide-chevron-left" :label="t.campo.voltarAosModelos" color="neutral" variant="ghost" size="xs" @click="modeloEmPrevia = null" />
                  </div>
                  <p class="text-sm font-medium text-highlighted">
                    {{ modeloEmPrevia.nome }}
                  </p>
                  <p class="mb-2 text-xs text-muted">
                    {{ t.campo.previaDoModelo }}
                  </p>
                  <div class="max-h-56 overflow-y-auto rounded-md border border-default bg-elevated/50 p-3">
                    <div class="space-y-1.5 rounded-sm bg-default px-4 py-3 text-[11px] leading-relaxed text-toned shadow-xs">
                      <p class="text-center text-xs font-semibold text-highlighted">
                        {{ previa.titulo }}
                      </p>
                      <p v-for="(par, i) in previa.paragrafos.slice(0, 5)" :key="i">
                        <template v-for="(pedaco, j) in marcar(par)" :key="j">
                          <mark v-if="pedaco.doItem" class="rounded-sm bg-primary/15 px-0.5 text-highlighted">{{ pedaco.texto }}</mark>
                          <template v-else>{{ pedaco.texto }}</template>
                        </template>
                      </p>
                    </div>
                  </div>
                  <div class="mt-3 flex justify-end">
                    <UButton icon="i-lucide-file-check-2" :label="t.campo.criarDocumento" size="sm" @click="usarModelo(modeloEmPrevia)" />
                  </div>
                </div>
              </Transition>
            </template>
          </UPopover>
          <UButton
            v-if="mostraBranco"
            icon="i-lucide-file-plus"
            :label="t.campo.emBranco"
            color="neutral"
            variant="outline"
            size="sm"
            :disabled="preview"
            @click="emBranco"
          />
          <UButton
            v-if="mostraEnvio"
            icon="i-lucide-upload"
            :label="t.campo.enviarArquivo"
            color="neutral"
            variant="outline"
            size="sm"
            :disabled="preview"
            @click="open()"
          />
          <p class="basis-full text-xs text-muted">
            {{ t.campo.formatosAceitos }}
          </p>
        </template>
      </UFileUpload>
      </div>

      <!-- ─────────────── preenchido ─────────────── -->
      <div
        v-else
        key="preenchido"
        class="overflow-hidden rounded-lg border bg-default transition-colors"
        :class="minhaNoWord ? 'border-primary/50' : outraNoWord ? 'border-warning/50' : 'border-default hover:border-accented'"
      >
        <div class="flex items-start gap-3 p-3">
          <button
            type="button"
            class="rounded-[3px] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-primary"
            :aria-label="t.campo.ler"
            :disabled="preview"
            @click="emit('ler')"
          >
            <Miniatura :ext="doc.ext ?? '.docx'" />
          </button>

          <div class="min-w-0 flex-1">
            <p class="line-clamp-2 break-words text-sm font-medium text-highlighted" :title="doc.name">
              {{ doc.name }}
            </p>
            <p v-if="ultima" class="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted">
              <UBadge :label="t.campo.versaoN(ultima.numero)" color="neutral" variant="subtle" size="sm" />
              <UAvatar :text="pessoa(ultima.autor).iniciais" size="3xs" />
              <span class="truncate">{{ t.campo.editadoPor(nomeCurto(ultima.autor), quandoFoi(t, ultima.em)) }}</span>
            </p>
            <p class="mt-1 text-xs text-dimmed">
              {{ tamanho(doc.size, idioma) }} · {{ (doc.ext ?? '').replace('.', '').toUpperCase() }}
            </p>
          </div>

          <UDropdownMenu :items="menuMais" :content="{ align: 'end' }" :ui="{ content: 'w-60' }">
            <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="sm" :aria-label="t.campo.maisAcoes" :disabled="preview" />
          </UDropdownMenu>
        </div>

        <!-- quem está com o documento -->
        <div v-if="minhaNoWord" class="border-t border-primary/20 bg-primary/5 px-3 py-2.5">
          <p class="flex items-start gap-2 text-sm text-highlighted">
            <UIcon name="i-lucide-lock-keyhole" class="mt-0.5 size-4 shrink-0 text-primary" />
            {{ t.campo.abertoPorVoceNoWord(hora(sessao!.desde, idioma)) }}
          </p>
          <p class="ml-6 mt-0.5 text-xs text-muted">
            {{ t.campo.abertoPorVoceNoWordDetalhe }}
          </p>
        </div>
        <div v-else-if="outraNoWord" class="border-t border-warning/20 bg-warning/5 px-3 py-2.5">
          <p class="flex items-start gap-2 text-sm text-highlighted">
            <UIcon name="i-lucide-lock-keyhole" class="mt-0.5 size-4 shrink-0 text-warning" />
            {{ t.campo.abertoPorOutraNoWord(nomeCurto(sessao!.pessoa), hora(sessao!.desde, idioma)) }}
          </p>
          <p class="ml-6 mt-0.5 text-xs text-muted">
            {{ t.campo.abertoPorOutraNoWordDetalhe }}
          </p>
        </div>
        <div v-else-if="outraNoEnspace" class="flex items-center gap-2 border-t border-default bg-elevated/40 px-3 py-2 text-xs text-toned">
          <UChip color="success" size="sm" position="bottom-right">
            <UAvatar :text="pessoa(sessao!.pessoa).iniciais" size="2xs" />
          </UChip>
          {{ t.campo.editandoAgoraNoEnspace(nomeCurto(sessao!.pessoa)) }}
        </div>
        <div v-else-if="ehPdf" class="flex items-center gap-2 border-t border-default bg-elevated/40 px-3 py-2 text-xs text-muted">
          <UIcon name="i-lucide-info" class="size-3.5 shrink-0" />
          {{ t.campo.pdfSoLeitura }}
        </div>

        <!-- ações -->
        <div class="flex flex-wrap items-center gap-2 border-t border-default px-3 py-2">
          <!-- minha sessão no Word -->
          <template v-if="minhaNoWord">
            <UButton icon="i-lucide-monitor-up" :label="t.campo.voltarAoWord" size="sm" :disabled="preview" @click="emit('voltarAoWord')" />
            <UButton icon="i-lucide-app-window" :label="t.word.abrirJanelaCurto" color="primary" variant="soft" size="sm" :disabled="preview" @click="emit('simulacao')" />
            <UButton icon="i-lucide-lock-open" :label="t.campo.liberar" color="neutral" variant="ghost" size="sm" :disabled="preview" @click="liberar" />
          </template>

          <!-- outra pessoa no Word, PDF ou sem permissão: só ler -->
          <template v-else-if="outraNoWord || ehPdf || somenteLeitura">
            <UButton icon="i-lucide-book-open" :label="t.campo.ler" color="neutral" variant="outline" size="sm" :disabled="preview" @click="emit('ler')" />
            <UButton
              v-if="outraNoWord"
              :icon="avisoPedido ? 'i-lucide-bell-ring' : 'i-lucide-bell'"
              :label="t.campo.avisarQuandoLiberar"
              color="neutral"
              variant="ghost"
              size="sm"
              :disabled="avisoPedido || preview"
              @click="avisarQuandoLiberar"
            />
          </template>

          <!-- o caso comum: Abrir com a escolha do editor -->
          <UFieldGroup v-else size="sm">
            <UButton :icon="iconeDoBotao" :label="rotuloDoBotao" :disabled="preview" @click="abrirPeloBotao" />
            <UDropdownMenu v-if="editoresLigados.length > 1" :items="menuDeEditores" :content="{ align: 'end' }" :ui="{ content: 'w-72' }">
              <UButton icon="i-lucide-chevron-down" :aria-label="t.escolha.titulo" :disabled="preview" class="border-l border-inverted/20" />
            </UDropdownMenu>
          </UFieldGroup>

          <UButton
            icon="i-lucide-history"
            :label="t.campo.versoes"
            color="neutral"
            variant="ghost"
            size="sm"
            class="ml-auto"
            :disabled="preview"
            @click="emit('versoes')"
          >
            <template #trailing>
              <UBadge :label="String(doc.versoes.length)" color="neutral" variant="soft" size="sm" />
            </template>
          </UButton>
        </div>

        <input ref="substituir" type="file" class="hidden" :accept="aceitos" @change="aoSubstituir">
      </div>
    </Transition>

    <UModal
      v-model:open="confirmarRemocao"
      :title="t.campo.removerTitulo"
      :description="doc ? t.campo.removerDescricao(doc.name, doc.versoes.length) : ''"
      :ui="{ footer: 'justify-end' }"
    >
      <template #footer="{ close }">
        <UButton :label="t.campo.cancelar" color="neutral" variant="outline" @click="close" />
        <UButton :label="t.campo.removerConfirmar" color="error" icon="i-lucide-trash-2" @click="remover" />
      </template>
    </UModal>
  </div>
</template>

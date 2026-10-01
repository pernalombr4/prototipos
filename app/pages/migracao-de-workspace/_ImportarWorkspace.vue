<script setup lang="ts">
/**
 * PROPOSTA: a importação em camada sobre a tela de Casos de Uso.
 *
 * Hoje o botão abre o seletor de arquivos e a importação começa no instante em
 * que o arquivo é escolhido, sem prévia e sem escolha (evidencias/). Aqui ela
 * tem 2 passos: o arquivo e o que fazer com o que já existe, juntos; depois a
 * revisão.
 *
 * As opções aparecem embaixo do arquivo assim que ele é lido. Com o workspace
 * vazio elas nem aparecem: não há o que decidir. A comparação em árvore só aparece quando há algo em
 * comum entre os dois lados; sem isso, a revisão é uma lista do que entra.
 */
import type { TreeItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { Estrutura, TipoDeCampo, TipoDeComponente } from './mocks'
import { arquivoDeExemplo, estruturaDoArquivo, workspaceAtual } from './mocks'
import {
  comparar,
  contarEstrutura,
  temAlgoEmComum,
  tiposDeComponente,
  type Comparacao,
  type Modo,
  type Mudanca,
  type NoFolha,
  type Situacao,
} from './comparar'

const props = defineProps<{
  t: Textos
  /** A estrutura do workspace em que a pessoa está. */
  atual: Estrutura
  /** Andaime: como termina a importação. */
  final: 'sucesso' | 'falha'
}>()

const aberto = defineModel<boolean>('open', { default: false })
const toast = useToast()

type Passo = 'arquivo' | 'revisar'
type Fase = 'escolhendo' | 'importando' | 'concluido' | 'erro' | 'desfeito'

const passo = ref<Passo>('arquivo')
const fase = ref<Fase>('escolhendo')
const arquivo = ref<File | null>(null)
const lendo = ref(false)
const lido = ref(false)
const erroArquivo = ref(false)
const modo = ref<Modo>('adicionar')
const copiaAntes = ref(true)
const email = ref('')
const etapa = ref(0)

function recomecar() {
  passo.value = 'arquivo'
  fase.value = 'escolhendo'
  arquivo.value = null
  lido.value = false
  lendo.value = false
  erroArquivo.value = false
  modo.value = 'adicionar'
  copiaAntes.value = true
  email.value = ''
  etapa.value = 0
}

watch(aberto, (agora) => {
  if (agora && fase.value !== 'importando' && fase.value !== 'escolhendo') recomecar()
})

/* ------------------------------------------------------------------ *
 * Passo 1: o arquivo.
 *
 * Maquete: qualquer .json vira o arquivo de exemplo. O protótipo não lê o
 * conteúdo; ele só confere a extensão.
 * ------------------------------------------------------------------ */

watch(arquivo, (novo) => {
  lido.value = false
  erroArquivo.value = false
  if (!novo) return
  if (!novo.name.toLowerCase().endsWith('.json')) {
    erroArquivo.value = true
    return
  }
  lendo.value = true
  setTimeout(() => {
    lendo.value = false
    lido.value = true
  }, 900)
})

function usarExemplo() {
  arquivo.value = new File(['{}'], arquivoDeExemplo.nome, { type: 'application/json' })
}

const resumoDoArquivo = computed(() => contarEstrutura(estruturaDoArquivo))

const dataDoArquivo = computed(() => {
  const d = new Date(estruturaDoArquivo.exportadoEm!)
  return d.toLocaleString(props.t.locale, { dateStyle: 'short', timeStyle: 'short' })
})

/* ------------------------------------------------------------------ *
 * Os 3 modos, calculados juntos: trocar a opção na revisão não recalcula nada.
 * ------------------------------------------------------------------ */

const modos: Modo[] = ['adicionar', 'somar', 'substituir']

const vazio = computed(() =>
  props.atual.categorias.length === 0
  && tiposDeComponente.every(tipo => props.atual.componentes[tipo].length === 0),
)
const emComum = computed(() => temAlgoEmComum(props.atual, estruturaDoArquivo))

const comparacoes = computed(() =>
  Object.fromEntries(modos.map(m => [m, comparar(props.atual, estruturaDoArquivo, m)])) as Record<Modo, Comparacao>,
)
const comparacao = computed(() => comparacoes.value[vazio.value ? 'somar' : modo.value])

/** Contagem do que a pessoa reconhece: categorias e componentes, sem descer aos campos. */
function contagemDoTopo(c: Comparacao) {
  const conta: Record<Situacao, number> = { nova: 0, alterada: 0, removida: 0, igual: 0, mantida: 0, ignorada: 0 }
  for (const cat of c.categorias) conta[cat.situacao]++
  for (const tipo of tiposDeComponente) for (const f of c.componentes[tipo]) conta[f.situacao]++
  return conta
}

const topo = computed(() => contagemDoTopo(comparacao.value))
const nadaAFazer = computed(() => topo.value.nova + topo.value.alterada + topo.value.removida === 0)

/** Sem nada em comum, só "Substituir tudo" muda o que existe: aí ainda vale a árvore. */
const revisaoSimples = computed(() => vazio.value || (!emComum.value && modo.value !== 'substituir'))

const itensDeModo = computed(() =>
  modos.map((m) => {
    return {
      value: m,
      label: props.t.modos[m].titulo,
      description: props.t.modos[m].descricao,
    }
  }),
)

/* ------------------------------------------------------------------ *
 * Navegação entre os passos.
 * ------------------------------------------------------------------ */

const passos = computed(() => [
  { value: 'arquivo', title: vazio.value ? props.t.passos.soArquivo : props.t.passos.arquivo, icon: 'i-lucide-file-up' },
  { value: 'revisar', title: props.t.passos.revisar, icon: 'i-lucide-list-checks' },
])

function avancar() {
  passo.value = 'revisar'
}
function voltar() {
  passo.value = 'arquivo'
}

const podeAvancar = computed(() => (passo.value === 'arquivo' ? lido.value : true))

/* ------------------------------------------------------------------ *
 * Passo 2: a árvore da comparação.
 * ------------------------------------------------------------------ */

const corDaSituacao: Record<Situacao, 'success' | 'warning' | 'error' | 'neutral'> = {
  nova: 'success',
  alterada: 'warning',
  removida: 'error',
  igual: 'neutral',
  mantida: 'neutral',
  ignorada: 'neutral',
}

const sinalDaSituacao: Record<Situacao, { icone: string, cor: string }> = {
  nova: { icone: 'i-lucide-plus', cor: 'text-success' },
  alterada: { icone: 'i-lucide-pencil', cor: 'text-warning' },
  removida: { icone: 'i-lucide-minus', cor: 'text-error' },
  igual: { icone: 'i-lucide-equal', cor: 'text-dimmed' },
  mantida: { icone: 'i-lucide-equal', cor: 'text-dimmed' },
  ignorada: { icone: 'i-lucide-equal', cor: 'text-dimmed' },
}

const iconeDoTipo: Partial<Record<TipoDeCampo, string>> = {
  inputText: 'i-lucide-type',
  EnTextArea: 'i-lucide-align-left',
  EnHtml: 'i-lucide-pilcrow',
  email: 'i-lucide-at-sign',
  EnlMask: 'i-lucide-hash',
  EnlNumber: 'i-lucide-hash',
  EnCurrency: 'i-lucide-circle-dollar-sign',
  EnlCalendar: 'i-lucide-calendar',
  EnlDropdown: 'i-lucide-list',
  multiSelect: 'i-lucide-list-checks',
  radioButton: 'i-lucide-circle-dot',
  inputSwitch: 'i-lucide-toggle-left',
  EnRel: 'i-lucide-link',
  EnRelMulti: 'i-lucide-link-2',
  uploadFile: 'i-lucide-paperclip',
  EnPerson: 'i-lucide-user',
}

/** Lista, tela: feminino. Grupo, modelo, relatório, item: masculino. */
const generoDoComponente: Record<TipoDeComponente, 'f' | 'm'> = {
  listas: 'f',
  telas: 'f',
  grupos: 'm',
  emails: 'm',
  relatorios: 'm',
  documentos: 'm',
  menus: 'm',
}

const iconeDoComponente: Record<TipoDeComponente, string> = {
  listas: 'i-lucide-list',
  telas: 'i-lucide-monitor',
  grupos: 'i-lucide-users',
  emails: 'i-lucide-mail',
  relatorios: 'i-lucide-chart-column',
  documentos: 'i-lucide-file-text',
  menus: 'i-lucide-menu',
}

function mexe(s: Situacao) {
  return s === 'nova' || s === 'alterada' || s === 'removida'
}

interface NoDaArvore extends TreeItem {
  value: string
  tipo: 'categoria' | 'grupo' | 'folha'
  /** Para a marca concordar: "Nova" categoria, "Novo" campo. */
  genero?: 'f' | 'm'
  situacao?: Situacao
  mudancas?: Mudanca[]
  tipoDeCampo?: TipoDeCampo
  itens?: number
  contagem?: Record<Situacao, number>
  children?: NoDaArvore[]
}

function folhas(lista: NoFolha[], prefixo: string, genero: 'f' | 'm', icone?: string): NoDaArvore[] {
  return lista
    .filter(f => mexe(f.situacao))
    .map(f => ({
      value: `${prefixo}:${f.chave}`,
      label: f.nome,
      icon: icone ?? (f.tipoDeCampo ? iconeDoTipo[f.tipoDeCampo] ?? 'i-lucide-square' : 'i-lucide-square'),
      tipo: 'folha',
      genero,
      situacao: f.situacao,
      mudancas: f.mudancas,
      tipoDeCampo: f.tipoDeCampo,
    }))
}

function contar(lista: NoFolha[]) {
  const conta: Record<Situacao, number> = { nova: 0, alterada: 0, removida: 0, igual: 0, mantida: 0, ignorada: 0 }
  for (const f of lista) conta[f.situacao]++
  return conta
}

function grupo(valor: string, rotulo: string, icone: string, filhos: NoDaArvore[], todos: NoFolha[]): NoDaArvore[] {
  if (!filhos.length) return []
  return [{ value: valor, label: rotulo, icon: icone, tipo: 'grupo', children: filhos, contagem: contar(todos) }]
}

const arvoreDeCategorias = computed<NoDaArvore[]>(() =>
  comparacao.value.categorias
    .filter(c => mexe(c.situacao))
    .map((c) => {
      // Categoria que entra ou sai inteira: os filhos vão junto, com a mesma marca.
      const campos = folhas(c.campos, `${c.slug}:campo`, 'm')
      const formularios = folhas(c.formularios, `${c.slug}:form`, 'm', 'i-lucide-file-text')
      const pastas = folhas(c.pastas, `${c.slug}:pasta`, 'f', 'i-lucide-folder')
      return {
        value: c.slug,
        label: c.nome,
        icon: c.icone,
        tipo: 'categoria' as const,
        genero: 'f' as const,
        situacao: c.situacao,
        mudancas: c.mudancas,
        itens: c.itens,
        contagem: contar([...c.campos, ...c.formularios, ...c.pastas]),
        children: [
          ...grupo(`${c.slug}:campos`, props.t.grupoCampos(c.campos.length), 'i-lucide-text-cursor-input', campos, c.campos),
          ...grupo(`${c.slug}:forms`, props.t.grupoFormularios(c.formularios.length), 'i-lucide-files', formularios, c.formularios),
          ...grupo(`${c.slug}:pastas`, props.t.grupoPastas(c.pastas.length), 'i-lucide-folders', pastas, c.pastas),
        ],
      }
    }),
)

const arvoreDeComponentes = computed<NoDaArvore[]>(() =>
  tiposDeComponente.flatMap((tipo) => {
    const todos = comparacao.value.componentes[tipo]
    const filhos = folhas(todos, tipo, generoDoComponente[tipo], iconeDoComponente[tipo])
    return grupo(tipo, props.t.componentes[tipo], iconeDoComponente[tipo], filhos, todos)
  }),
)

/** Abre de cara só o que muda por dentro. O que entra ou sai inteiro fica fechado. */
const abertosDeCara = computed(() => [
  ...arvoreDeCategorias.value.filter(c => c.situacao === 'alterada' || c.situacao === 'ignorada').flatMap(c => [c.value, ...(c.children ?? []).map(g => g.value)]),
])

/** A árvore mostra só o que muda: o inalterado fica só na contagem. Renasce quando o modo muda. */
const chaveDaArvore = computed(() => modo.value)

function rotuloDaSituacao(no: NoDaArvore) {
  return props.t.situacao[no.situacao!][no.genero ?? 'm']
}

function nomeDoTipo(tipo?: TipoDeCampo) {
  if (!tipo) return ''
  return props.t.tiposDeCampo[tipo] ?? props.t.tipoDeCampoOutro
}

/* ------------------------------------------------------------------ *
 * Confirmar e importar.
 * ------------------------------------------------------------------ */

const destrutivo = computed(() => !vazio.value && modo.value === 'substituir' && topo.value.removida > 0)
const emailConfere = computed(() => email.value.trim().toLowerCase() === workspaceAtual.emailDeQuemUsa)
const podeImportar = computed(() => !nadaAFazer.value && (!destrutivo.value || emailConfere.value))

const resultado = computed(() => ({
  entra: comparacao.value.totalDeCategorias.nova,
  muda: comparacao.value.totalDeCategorias.alterada,
  sai: comparacao.value.totalDeCategorias.removida,
}))

let relogio: ReturnType<typeof setInterval> | undefined

function importar() {
  fase.value = 'importando'
  etapa.value = 0
  const ultima = props.t.etapasImportacao.length
  relogio = setInterval(() => {
    if (props.final === 'falha' && etapa.value === 2) {
      clearInterval(relogio)
      fase.value = 'erro'
      return
    }
    etapa.value++
    if (etapa.value >= ultima) {
      clearInterval(relogio)
      fase.value = 'concluido'
    }
  }, 750)
}

onBeforeUnmount(() => clearInterval(relogio))

const progresso = computed(() => Math.round((etapa.value / props.t.etapasImportacao.length) * 100))

const desfazendo = ref(false)
async function desfazer() {
  desfazendo.value = true
  await new Promise(r => setTimeout(r, 900))
  desfazendo.value = false
  fase.value = 'desfeito'
}

function verCategorias() {
  aberto.value = false
  toast.add({
    title: props.t.sucessoTitulo,
    description: 'No protótipo, "Ver categorias" só fecha a camada.',
    icon: 'i-lucide-check',
    color: 'success',
  })
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="t.modalTitulo"
    :description="t.modalDescricao"
    :ui="{ content: 'sm:max-w-3xl', body: 'sm:p-6' }"
  >
    <template #body>
      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <!-- ─────────── ESCOLHENDO: os 2 passos ─────────── -->
        <div v-if="fase === 'escolhendo'" key="escolhendo" class="space-y-6">
          <UStepper
            v-model="passo"
            :items="passos"
            size="sm"
            :ui="{ content: 'hidden' }"
          />

          <Transition
            mode="out-in"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-x-3"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0 -translate-x-3"
          >
            <!-- Passo 1: arquivo e o que fazer ----------------------- -->
            <section v-if="passo === 'arquivo'" key="arquivo" class="space-y-4">
              <UFileUpload
                v-if="!lido && !lendo"
                v-model="arquivo"
                accept=".json,application/json"
                :label="t.soltarTitulo"
                :description="t.soltarDescricao"
                icon="i-lucide-file-up"
                :preview="false"
                :color="erroArquivo ? 'error' : 'primary'"
                :highlight="erroArquivo"
                class="min-h-48 w-full"
              />

              <div
                v-else
                class="flex items-start gap-3 rounded-lg border border-default bg-elevated/40 p-4"
              >
                <span class="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <UIcon :name="lendo ? 'i-lucide-loader-circle' : 'i-lucide-file-check'" class="size-5" :class="lendo && 'animate-spin'" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-highlighted">
                    {{ arquivo?.name }}
                  </p>
                  <p v-if="lendo" class="mt-0.5 text-sm text-muted">
                    {{ t.lendoArquivo }}
                  </p>
                  <template v-else>
                    <p class="mt-0.5 text-sm text-muted">
                      {{ t.arquivoDe(estruturaDoArquivo.workspace, dataDoArquivo) }}
                    </p>
                    <div class="mt-3 flex flex-wrap gap-1.5">
                      <UBadge :label="t.resumoArquivo.categorias(resumoDoArquivo.categorias)" color="neutral" variant="soft" icon="i-lucide-layout-grid" />
                      <UBadge :label="t.resumoArquivo.campos(resumoDoArquivo.campos)" color="neutral" variant="soft" icon="i-lucide-text-cursor-input" />
                      <UBadge :label="t.resumoArquivo.formularios(resumoDoArquivo.formularios)" color="neutral" variant="soft" icon="i-lucide-files" />
                      <UBadge :label="t.resumoArquivo.outros(resumoDoArquivo.outros)" color="neutral" variant="soft" icon="i-lucide-blocks" />
                    </div>
                  </template>
                </div>
                <UButton
                  v-if="lido"
                  :label="t.trocarArquivo"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  icon="i-lucide-refresh-cw"
                  @click="arquivo = null"
                />
              </div>

              <UAlert
                v-if="erroArquivo"
                :title="t.erroArquivoTitulo"
                :description="t.erroArquivoTexto"
                color="error"
                variant="subtle"
                icon="i-lucide-file-x"
              />

              <!-- O que fazer: aparece quando o arquivo foi lido e há o que decidir -->
              <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 translate-y-2"
              >
                <div v-if="lido && !vazio" class="space-y-3 border-t border-default pt-5">
                  <URadioGroup
                    v-model="modo"
                    :legend="t.modoPergunta"
                    :items="itensDeModo"
                    variant="card"
                    size="sm"
                    :ui="{
                      legend: 'mb-2 text-sm font-semibold text-highlighted',
                      fieldset: 'grid gap-2 sm:grid-cols-3',
                      item: 'items-start transition-colors hover:bg-elevated/50',
                    }"
                  >
                    <template #label="{ item }">
                      <span class="flex flex-wrap items-center gap-1.5">
                        {{ item.label }}
                        <UBadge v-if="item.value === 'adicionar'" :label="t.recomendado" color="success" variant="subtle" size="sm" />
                      </span>
                    </template>
                  </URadioGroup>

                  <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-1"
                  >
                    <UAlert
                      v-if="modo === 'substituir'"
                      :title="t.alertaSubstituir"
                      color="error"
                      variant="subtle"
                      icon="i-lucide-triangle-alert"
                    />
                  </Transition>
                </div>
              </Transition>
            </section>

            <!-- Passo 2: revisar ------------------------------------- -->
            <section v-else key="revisar" class="space-y-5">
              <!-- Nada a fazer -->
              <UAlert
                v-if="nadaAFazer"
                :title="t.nadaAFazerTitulo"
                :description="t.nadaAFazerTexto"
                color="neutral"
                variant="subtle"
                icon="i-lucide-circle-check"
              />

              <!-- Sem comparação: workspace vazio ou nada em comum -->
              <div v-else-if="revisaoSimples" class="space-y-3">
                <div>
                  <h3 class="text-base font-semibold text-highlighted">
                    {{ vazio ? t.workspaceVazioTitulo : t.nadaEmComumTitulo }}
                  </h3>
                  <p class="mt-1 text-sm text-muted">
                    {{ vazio ? t.workspaceVazioTexto : t.nadaEmComumTexto }}
                  </p>
                </div>
                <ul class="grid gap-2 sm:grid-cols-2">
                  <li
                    v-for="(c, i) in estruturaDoArquivo.categorias"
                    :key="c.slug"
                    class="animate-[entrada_0.3s_ease-out_both] flex items-center gap-3 rounded-md border border-default px-3 py-2"
                    :style="{ animationDelay: `${i * 40}ms` }"
                  >
                    <UIcon :name="c.icon" class="size-4 shrink-0 text-success" />
                    <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ c.name }}</span>
                    <span class="shrink-0 text-xs text-muted">{{ t.grupoCampos(c.campos.length) }}</span>
                  </li>
                </ul>
                <p class="text-sm text-muted">
                  + {{ t.resumoArquivo.outros(resumoDoArquivo.outros) }}
                </p>
              </div>

              <!-- A comparação -->
              <template v-else>
                <!-- Contagem: o resumo antes do detalhe -->
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div
                    v-for="(bloco, i) in [
                      { chave: 'nova', n: topo.nova, cor: 'text-success', icone: 'i-lucide-plus' },
                      { chave: 'alterada', n: topo.alterada, cor: 'text-warning', icone: 'i-lucide-pencil' },
                      { chave: 'removida', n: topo.removida, cor: 'text-error', icone: 'i-lucide-minus' },
                      { chave: 'inalterada', n: topo.igual + topo.mantida + topo.ignorada, cor: 'text-muted', icone: 'i-lucide-equal' },
                    ]"
                    :key="bloco.chave"
                    class="animate-[entrada_0.3s_ease-out_both] rounded-lg border border-default px-3 py-2.5"
                    :class="bloco.n === 0 && 'opacity-50'"
                    :style="{ animationDelay: `${i * 50}ms` }"
                  >
                    <p class="flex items-center gap-1.5 text-2xl font-semibold tabular-nums" :class="bloco.cor">
                      <UIcon :name="bloco.icone" class="size-4" />
                      {{ bloco.n }}
                    </p>
                    <p class="mt-0.5 text-xs text-muted">
                      {{ t.contagem[bloco.chave as 'nova'] }}
                    </p>
                  </div>
                </div>

                <p class="flex items-center gap-1.5 text-sm text-muted">
                  <UIcon name="i-lucide-info" class="size-4 shrink-0" />
                  {{ t.soAlteracoes }}
                </p>

                <!-- Categorias -->
                <div v-if="arvoreDeCategorias.length" class="space-y-2">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-muted">
                    {{ t.grupoCategorias }}
                  </h4>
                  <div class="rounded-lg border border-default p-2">
                    <UTree
                      :key="`cat-${chaveDaArvore}`"
                      :items="arvoreDeCategorias"
                      :get-key="(i: NoDaArvore) => i.value"
                      :default-expanded="abertosDeCara"
                      color="neutral"
                      :ui="{
                        link: 'items-start gap-2 px-2 py-1.5 hover:before:bg-elevated/60 before:transition-colors',
                        linkLeadingIcon: 'mt-0.5 size-4 text-muted',
                        linkLabel: 'min-w-0 flex-1 whitespace-normal text-start',
                        linkTrailing: 'mt-0.5',
                      }"
                    >
                      <template #item-label="{ item }">
                        <span class="flex flex-wrap items-baseline gap-x-2">
                          <span
                            :class="[
                              item.tipo === 'grupo' ? 'text-toned' : 'text-highlighted',
                              item.tipo === 'categoria' && 'font-medium',
                              item.situacao === 'removida' && 'text-muted line-through decoration-error/60',
                            ]"
                          >{{ item.label }}</span>
                          <span v-if="item.tipoDeCampo" class="text-xs text-muted">{{ nomeDoTipo(item.tipoDeCampo) }}</span>
                          <span v-if="item.tipo === 'categoria' && item.situacao === 'removida' && item.itens" class="text-xs font-medium text-error">
                            {{ t.itensCadastrados(item.itens) }}
                          </span>
                        </span>

                        <!-- O que muda, em estrutura: antes e depois -->
                        <span v-if="item.mudancas?.length" class="mt-1 block space-y-0.5 text-xs" :class="item.situacao === 'ignorada' ? 'text-dimmed' : 'text-toned'">
                          <span v-for="(m, i) in item.mudancas" :key="i" class="flex flex-wrap items-center gap-1">
                            <template v-if="m.tipo === 'nome' || m.tipo === 'tipoDeCampo'">
                              <span class="text-muted">{{ m.tipo === 'nome' ? t.mudancaNome : t.mudancaTipo }}:</span>
                              <span class="line-through decoration-error/60">{{ m.tipo === 'nome' ? m.antes : nomeDoTipo(m.antes) }}</span>
                              <UIcon name="i-lucide-arrow-right" class="size-3 text-dimmed" />
                              <span class="font-medium" :class="item.situacao === 'ignorada' ? '' : 'text-highlighted'">{{ m.tipo === 'nome' ? m.depois : nomeDoTipo(m.depois) }}</span>
                            </template>
                            <span v-else-if="m.tipo === 'opcoesNovas'">{{ t.mudancaOpcoesNovas(m.opcoes.join(', ')) }}</span>
                            <span v-else>{{ t.mudancaOpcoesRemovidas(m.opcoes.join(', ')) }}</span>
                          </span>
                          <span v-if="item.situacao === 'ignorada'" class="flex items-center gap-1 italic">
                            <UIcon name="i-lucide-info" class="size-3" />
                            {{ t.ignoradaAjuda }}
                          </span>
                        </span>
                      </template>

                      <template #item-trailing="{ item, expanded }">
                        <span v-if="item.tipo === 'grupo' && item.contagem" class="flex items-center gap-2 text-xs tabular-nums">
                          <span v-if="item.contagem.nova" class="text-success">+{{ item.contagem.nova }}</span>
                          <span v-if="item.contagem.alterada" class="text-warning">~{{ item.contagem.alterada }}</span>
                          <span v-if="item.contagem.removida" class="text-error">−{{ item.contagem.removida }}</span>
                        </span>
                        <UBadge
                          v-if="item.situacao"
                          :label="rotuloDaSituacao(item)"
                          :color="corDaSituacao[item.situacao]"
                          :variant="mexe(item.situacao) ? 'subtle' : 'outline'"
                          :leading-icon="sinalDaSituacao[item.situacao].icone"
                          size="sm"
                        />
                        <UIcon
                          v-if="item.children?.length"
                          name="i-lucide-chevron-down"
                          class="size-4 shrink-0 text-dimmed transition-transform duration-200"
                          :class="expanded && 'rotate-180'"
                        />
                      </template>
                    </UTree>
                  </div>
                </div>

                <!-- Outros componentes -->
                <div v-if="arvoreDeComponentes.length" class="space-y-2">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-muted">
                    {{ t.grupoOutros }}
                  </h4>
                  <div class="rounded-lg border border-default p-2">
                    <UTree
                      :key="`comp-${chaveDaArvore}`"
                      :items="arvoreDeComponentes"
                      :get-key="(i: NoDaArvore) => i.value"
                      color="neutral"
                      :ui="{
                        link: 'items-start gap-2 px-2 py-1.5 hover:before:bg-elevated/60 before:transition-colors',
                        linkLeadingIcon: 'mt-0.5 size-4 text-muted',
                        linkLabel: 'min-w-0 flex-1 whitespace-normal text-start',
                        linkTrailing: 'mt-0.5',
                      }"
                    >
                      <template #item-label="{ item }">
                        <span
                          :class="[
                            item.tipo === 'grupo' ? 'text-toned' : 'text-highlighted',
                            item.situacao === 'removida' && 'text-muted line-through decoration-error/60',
                          ]"
                        >{{ item.label }}</span>
                        <span v-if="item.mudancas?.length" class="mt-1 block space-y-0.5 text-xs" :class="item.situacao === 'ignorada' ? 'text-dimmed' : 'text-toned'">
                          <span v-for="(m, i) in item.mudancas" :key="i" class="block">
                            <template v-if="m.tipo === 'opcoesNovas'">{{ t.mudancaOpcoesNovas(m.opcoes.join(', ')) }}</template>
                            <template v-else-if="m.tipo === 'opcoesRemovidas'">{{ t.mudancaOpcoesRemovidas(m.opcoes.join(', ')) }}</template>
                            <template v-else-if="m.tipo === 'nome'">{{ t.mudancaNome }}: {{ m.antes }} → {{ m.depois }}</template>
                          </span>
                          <span v-if="item.situacao === 'ignorada'" class="flex items-center gap-1 italic">
                            <UIcon name="i-lucide-info" class="size-3" />
                            {{ t.ignoradaAjuda }}
                          </span>
                        </span>
                      </template>
                      <template #item-trailing="{ item, expanded }">
                        <span v-if="item.tipo === 'grupo' && item.contagem" class="flex items-center gap-2 text-xs tabular-nums">
                          <span v-if="item.contagem.nova" class="text-success">+{{ item.contagem.nova }}</span>
                          <span v-if="item.contagem.alterada" class="text-warning">~{{ item.contagem.alterada }}</span>
                          <span v-if="item.contagem.removida" class="text-error">−{{ item.contagem.removida }}</span>
                        </span>
                        <UBadge
                          v-if="item.situacao"
                          :label="rotuloDaSituacao(item)"
                          :color="corDaSituacao[item.situacao]"
                          :variant="mexe(item.situacao) ? 'subtle' : 'outline'"
                          :leading-icon="sinalDaSituacao[item.situacao].icone"
                          size="sm"
                        />
                        <UIcon
                          v-if="item.children?.length"
                          name="i-lucide-chevron-down"
                          class="size-4 shrink-0 text-dimmed transition-transform duration-200"
                          :class="expanded && 'rotate-180'"
                        />
                      </template>
                    </UTree>
                  </div>
                </div>

                <p v-if="!arvoreDeCategorias.length && !arvoreDeComponentes.length" class="text-sm text-muted">
                  {{ t.nenhumaDiferenca }}
                </p>
              </template>

              <!-- Antes de confirmar -->
              <div v-if="!nadaAFazer" class="space-y-3 border-t border-default pt-4">
                <UCheckbox v-if="!vazio" v-model="copiaAntes" :label="t.copiaAntes" :description="t.copiaAntesAjuda" />

                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                >
                  <UAlert
                    v-if="destrutivo"
                    :title="t.alertaSubstituir"
                    color="error"
                    variant="subtle"
                    icon="i-lucide-triangle-alert"
                  >
                    <template #description>
                      <p>{{ t.perigoTexto }}</p>
                      <p class="mt-1">
                        <code class="rounded bg-default px-1.5 py-0.5 text-xs text-highlighted">{{ workspaceAtual.emailDeQuemUsa }}</code>
                      </p>
                      <UInput
                        v-model="email"
                        :placeholder="t.digiteEmail"
                        :aria-label="t.digiteEmail"
                        color="error"
                        class="mt-2 w-full"
                        :trailing-icon="emailConfere ? 'i-lucide-check' : undefined"
                      />
                    </template>
                  </UAlert>
                </Transition>
              </div>
            </section>
          </Transition>
        </div>

        <!-- ─────────── IMPORTANDO ─────────── -->
        <div v-else-if="fase === 'importando'" key="importando" class="space-y-5 py-2">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-primary" />
            <div>
              <p class="font-semibold text-highlighted">
                {{ t.importandoTitulo }}
              </p>
              <p class="text-sm text-muted">
                {{ t.importandoTexto }}
              </p>
            </div>
          </div>
          <UProgress :model-value="progresso" />
          <ol class="space-y-2">
            <li v-for="(nome, i) in t.etapasImportacao" :key="nome" class="flex items-center gap-2 text-sm">
              <UIcon
                :name="i < etapa ? 'i-lucide-circle-check' : i === etapa ? 'i-lucide-loader-circle' : 'i-lucide-circle'"
                class="size-4 shrink-0"
                :class="i < etapa ? 'text-success' : i === etapa ? 'animate-spin text-primary' : 'text-dimmed'"
              />
              <span :class="i <= etapa ? 'text-highlighted' : 'text-muted'">{{ nome }}</span>
            </li>
          </ol>
          <p class="flex items-center gap-1.5 text-xs text-muted">
            <UIcon name="i-lucide-bell" class="size-3.5" />
            {{ t.podeFechar }}
          </p>
        </div>

        <!-- ─────────── CONCLUÍDO ─────────── -->
        <div v-else-if="fase === 'concluido'" key="concluido" class="space-y-4 py-2 text-center">
          <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
            <UIcon name="i-lucide-check" class="size-6" />
          </span>
          <div>
            <p class="text-lg font-semibold text-highlighted">
              {{ t.sucessoTitulo }}
            </p>
            <p class="mt-1 text-sm text-muted">
              {{ t.sucessoTexto(resultado.entra, resultado.muda, resultado.sai) }}
            </p>
            <p v-if="copiaAntes && !vazio" class="mt-2 text-xs text-muted">
              {{ t.copiaBaixada }}
            </p>
          </div>
        </div>

        <!-- ─────────── DESFEITO ─────────── -->
        <div v-else-if="fase === 'desfeito'" key="desfeito" class="space-y-4 py-2 text-center">
          <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-elevated text-muted">
            <UIcon name="i-lucide-undo-2" class="size-6" />
          </span>
          <div>
            <p class="text-lg font-semibold text-highlighted">
              {{ t.desfeitoTitulo }}
            </p>
            <p class="mt-1 text-sm text-muted">
              {{ t.desfeitoTexto }}
            </p>
          </div>
        </div>

        <!-- ─────────── ERRO ─────────── -->
        <div v-else key="erro" class="space-y-4 py-2">
          <UAlert
            :title="t.erroTitulo"
            :description="t.erroTexto(t.etapasImportacao[2]!)"
            color="error"
            variant="subtle"
            icon="i-lucide-circle-x"
          />
        </div>
      </Transition>
    </template>

    <template #footer>
      <div class="flex w-full flex-wrap items-center gap-2">
        <!-- Andaime: dispensa ter um arquivo .json à mão. -->
        <UButton
          v-if="fase === 'escolhendo' && passo === 'arquivo' && !lido && !lendo"
          :label="t.usarExemplo"
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="outline"
          size="sm"
          class="border-dashed"
          @click="usarExemplo"
        />

        <div class="ml-auto flex flex-wrap items-center gap-2">
          <template v-if="fase === 'escolhendo'">
            <UButton
              v-if="passo !== 'arquivo'"
              :label="t.voltarPasso"
              color="neutral"
              variant="ghost"
              icon="i-lucide-arrow-left"
              @click="voltar"
            />
            <UButton v-else :label="t.cancelar" color="neutral" variant="ghost" @click="aberto = false" />

            <UButton
              v-if="passo !== 'revisar'"
              :label="t.continuar"
              trailing-icon="i-lucide-arrow-right"
              :disabled="!podeAvancar"
              @click="avancar"
            />
            <UButton
              v-else-if="nadaAFazer"
              :label="t.fechar"
              color="neutral"
              variant="subtle"
              @click="aberto = false"
            />
            <UButton
              v-else
              :label="t.importar(modo)"
              :color="destrutivo ? 'error' : 'primary'"
              :icon="destrutivo ? 'i-lucide-replace' : 'i-lucide-upload'"
              :disabled="!podeImportar"
              @click="importar"
            />
          </template>

          <UButton v-else-if="fase === 'importando'" :label="t.fechar" color="neutral" variant="subtle" @click="aberto = false" />

          <template v-else-if="fase === 'concluido'">
            <UButton
              :label="t.desfazer"
              icon="i-lucide-undo-2"
              color="neutral"
              variant="outline"
              :loading="desfazendo"
              @click="desfazer"
            />
            <UButton :label="t.verCategorias" trailing-icon="i-lucide-arrow-right" @click="verCategorias" />
          </template>

          <template v-else-if="fase === 'erro'">
            <UButton :label="t.fechar" color="neutral" variant="ghost" @click="aberto = false" />
            <UButton :label="t.tentarDeNovo" icon="i-lucide-rotate-cw" @click="importar" />
          </template>

          <UButton v-else :label="t.fechar" color="neutral" variant="subtle" @click="aberto = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
/**
 * PROPOSTA: o Editor de Expressão do Valor Virtual.
 *
 * O texto continua sendo o que o campo grava. O visual é uma leitura dele:
 *   - mexeu no Visual: o construtor gera o texto (só o que o motor calcula certo);
 *   - mexeu no Texto: o construtor lê de novo e o visual acompanha. O que ele não
 *     sabe desenhar vira "trecho de texto" e é gravado sem mudança.
 * Nada se perde ao trocar de aba, nos 2 sentidos.
 *
 * Fica no mesmo lugar do develop (Configurações Específicas › Editor de
 * Expressão). A chave "Habilitar Editor Visual" vira as abas Visual e Texto.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { type CampoDaCategoria, type Expressao, type Formato, type Modo, type No, type Tipo, clonar, conferir, contarTrechos, gerar, lacuna, ler, percorrer, tipoDoNo, trocar as trocarNaArvore, acharNo } from './arvore'
import { CONSTRUTOR } from './contexto'
import { memoriaDeArvores } from './estado'
import Bloco from './_Bloco.vue'

const props = defineProps<{
  t: Textos
  modo: Modo
  campos: CampoDaCategoria[]
}>()

const expressao = defineModel<string>({ required: true })
/** Na proposta, o formato de exibição é configuração do campo, fora da expressão. */
const formatoDaProposta = defineModel<Formato | null>('formato', { default: null })

const aba = ref<'visual' | 'texto'>('visual')
const toast = useToast()

/* ---------- a árvore e o texto ---------- */

/**
 * O texto de uma expressão incompleta não guarda as lacunas (nem o formato de
 * uma expressão com 2 partes). A árvore gerada fica guardada pelo texto, para a
 * gaveta reabrir do jeito que estava.
 */
function lerOuLembrar(texto: string) {
  const lembrada = memoriaDeArvores.get(`${props.modo}::${texto}`)
  return lembrada ? { expressao: clonar(lembrada), correcoes: [] } : ler(texto, props.modo)
}

const leituraInicial = lerOuLembrar(expressao.value)
const arvore = ref<Expressao>(leituraInicial.expressao)
const correcoes = ref<string[]>(leituraInicial.correcoes)
let ultimoGerado = expressao.value
let editadoNoVisual = false

/** Texto novo vindo de fora (exemplo, troca de motor, aba Texto): relê. */
watch([expressao, () => props.modo], ([texto]) => {
  if (texto === ultimoGerado) return
  const lido = lerOuLembrar(texto)
  arvore.value = lido.expressao
  correcoes.value = lido.correcoes
  ultimoGerado = texto
  // Expressão corrigida na leitura: o texto corrigido já vira o rascunho, e o Salvar grava ele.
  // Na aba Texto, a correção espera a pessoa voltar ao Visual: não reescreve o que ela está digitando.
  editadoNoVisual = lido.correcoes.length > 0 && aba.value === 'visual'
  if (aba.value === 'visual') textoLocal.value = texto
})

watch(aba, (agora) => {
  if (agora === 'texto') textoLocal.value = expressao.value
  if (agora !== 'visual' || !correcoes.value.length || editadoNoVisual) return
  editadoNoVisual = true
  ultimoGerado = gerado.value
  expressao.value = gerado.value
  textoLocal.value = gerado.value
})

const gerado = computed(() => gerar(arvore.value, props.modo, props.campos))

onMounted(() => {
  if (!correcoes.value.length) return
  editadoNoVisual = true
  ultimoGerado = gerado.value
  expressao.value = gerado.value
  textoLocal.value = gerado.value
})

watch(gerado, (novo) => {
  if (!editadoNoVisual) return
  memoriaDeArvores.set(`${props.modo}::${novo}`, clonar(arvore.value))
  ultimoGerado = novo
  expressao.value = novo
  if (aba.value === 'visual') textoLocal.value = novo
})

function editar(fn: (e: Expressao) => Expressao) {
  editadoNoVisual = true
  correcoes.value = []
  arvore.value = fn(clonar(arvore.value))
}

function trocar(id: string, novoReativo: No) {
  const novo = clonar(novoReativo)
  editar(e => ({
    ...e,
    pecas: e.pecas.map(p => trocarNaArvore(p, id, novo)),
    passos: e.passos.map(p => ({ ...p, no: trocarNaArvore(p.no, id, novo) })),
  }))
}

function acharEmTudo(id: string): No | null {
  for (const r of [...arvore.value.pecas, ...arvore.value.passos.map(p => p.no)]) {
    const n = acharNo(r, id)
    if (n) return n
  }
  return null
}

function remover(id: string) {
  const alvo = acharEmTudo(id)
  if (!alvo) return
  const ehPeca = arvore.value.pecas.some(p => p.id === id)
  if (ehPeca && arvore.value.pecas.length > 1) {
    editar(e => ({ ...e, pecas: e.pecas.filter(p => p.id !== id) }))
    return
  }
  const tipo: Tipo = tipoDoNo(alvo, props.campos, arvore.value.passos)
  trocar(id, lacuna(ehPeca ? 'qualquer' : tipo))
}

const destacado = ref<string | null>(null)
const abrirSeletor = ref<string | null>(null)
const passos = computed(() => arvore.value.passos.map(p => p.nome))

provide(CONSTRUTOR, {
  t: computed(() => props.t),
  modo: computed(() => props.modo),
  campos: props.campos,
  passos,
  trocar,
  remover,
  destacado,
  abrirSeletor,
  irParaTexto: () => { aba.value = 'texto' },
})

function adicionarPeca() {
  const nova = lacuna('qualquer')
  editar(e => ({ ...e, pecas: [...e.pecas, nova] }))
  nextTick(() => { abrirSeletor.value = nova.id })
}

function adicionarPasso() {
  const nome = `passo${arvore.value.passos.length + 1}`
  editar(e => ({ ...e, passos: [...e.passos, { nome, no: lacuna('qualquer') }] }))
}

function renomearPasso(i: number, nome: string) {
  const limpo = nome.replace(/\W/g, '_').replace(/^(\d)/, '_$1')
  const antigo = arvore.value.passos[i]!.nome
  editar((e) => {
    const renomear = (n: No) => { percorrer(n, (x) => { if (x.k === 'campo' && x.passo && x.ref === antigo) (x as any).ref = limpo }); return n }
    return {
      ...e,
      passos: e.passos.map((p, j) => ({ nome: j === i ? limpo : p.nome, no: renomear(p.no) })),
      pecas: e.pecas.map(renomear),
    }
  })
}

function removerPasso(i: number) {
  editar(e => ({ ...e, passos: e.passos.filter((_, j) => j !== i) }))
}

/* ---------- formato ---------- */

const formato = computed<Formato | null>(() => (props.modo === 'hoje' ? arvore.value.formato : formatoDaProposta.value))

function mudarFormato(f: Formato | null) {
  if (props.modo === 'hoje') editar(e => ({ ...e, formato: f }))
  else formatoDaProposta.value = f
}

const tiposDeFormato = computed(() => [
  { label: props.t.construtor.formatos.nenhum, value: 'nenhum' },
  { label: props.t.construtor.formatos.numero, value: 'numero' },
  { label: props.t.construtor.formatos.moeda, value: 'moeda' },
  { label: props.t.construtor.formatos.percentual, value: 'percentual' },
  { label: props.t.construtor.formatos.data, value: 'data' },
])

function escolherTipoDeFormato(v: string) {
  if (v === 'nenhum') return mudarFormato(null)
  const tipo = v as Formato['tipo']
  mudarFormato({
    tipo,
    casas: tipo === 'data' ? undefined : tipo === 'percentual' ? 1 : 2,
    moeda: tipo === 'moeda' ? 'BRL' : undefined,
    estiloData: tipo === 'data' ? 'short' : undefined,
  })
}

/* ---------- aba Texto ---------- */

const textoLocal = ref(expressao.value)
const cursor = ref(0)
let espera: ReturnType<typeof setTimeout> | undefined

function digitar(v: string) {
  textoLocal.value = v
  clearTimeout(espera)
  espera = setTimeout(() => { expressao.value = v }, 250)
}

function guardarCursor(e: Event) {
  cursor.value = (e.target as HTMLTextAreaElement).selectionStart ?? textoLocal.value.length
}

const menuDeCampos = computed<DropdownMenuItem[][]>(() => [props.campos.map(c => ({
  label: c.nome,
  suffix: c.ref,
  onSelect: () => {
    const trecho = props.modo === 'proposta' ? `data.${c.ref}` : c.tipo === 'numero' ? `{{data.${c.ref} | (0)}}` : c.tipo === 'lista' ? `data.${c.ref}` : `{{data.${c.ref}}}`
    const v = textoLocal.value
    const novo = v.slice(0, cursor.value) + trecho + v.slice(cursor.value)
    cursor.value += trecho.length
    digitar(novo)
  },
}))])

const trechos = computed(() => contarTrechos(arvore.value))

/* ---------- conferência ---------- */

const problemas = computed(() => conferir(arvore.value, props.modo, props.campos))
const erros = computed(() => problemas.value.filter(p => p.nivel === 'erro'))

function mostrarBloco(id?: string) {
  if (!id) return
  aba.value = 'visual'
  destacado.value = id
  setTimeout(() => { if (destacado.value === id) destacado.value = null }, 2600)
}

async function copiar() {
  try { await navigator.clipboard.writeText(expressao.value) }
  catch { /* sem permissão de área de transferência: o toast avisa igual */ }
  toast.add({ title: props.t.construtor.copiado, icon: 'i-lucide-copy-check', color: 'success' })
}

defineExpose({ completa: computed(() => erros.value.length === 0) })
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Visual | Texto, no lugar da chave "Habilitar Editor Visual" -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <UTabs
        v-model="aba"
        :items="[{ label: t.construtor.visual, value: 'visual', icon: 'i-lucide-blocks' }, { label: t.construtor.texto, value: 'texto', icon: 'i-lucide-code-xml' }]"
        :content="false"
        size="sm"
        class="w-auto"
      />
      <UBadge
        :label="modo === 'hoje' ? 'math · dayjs · sumArray · format · {{~v2}}' : '{{~v3}} · mathjs + dayjs'"
        color="neutral"
        variant="subtle"
        size="sm"
        class="font-mono"
      />
    </div>

    <!-- Correções feitas na leitura (expressão antiga) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <UAlert
        v-if="correcoes.length"
        :title="t.construtor.correcoes.titulo"
        icon="i-lucide-wand-sparkles"
        color="info"
        variant="subtle"
      >
        <template #description>
          <ul class="list-disc space-y-0.5 pl-4">
            <li v-for="c in [...new Set(correcoes)]" :key="c">{{ t.construtor.correcoes[c] ?? c }}</li>
          </ul>
          <p class="mt-1 font-medium">{{ t.construtor.salvarParaAplicar }}</p>
        </template>
      </UAlert>
    </Transition>

    <Transition
      mode="out-in"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <!-- VISUAL -->
      <div v-if="aba === 'visual'" key="visual" class="flex flex-col gap-4">
        <!-- Passos (só na proposta) -->
        <section v-if="modo === 'proposta'" class="flex flex-col gap-2">
          <div class="flex items-baseline justify-between gap-2">
            <h4 class="text-sm font-semibold text-highlighted">{{ t.construtor.passos }}</h4>
            <p class="text-xs text-muted">{{ t.construtor.passosAjuda }}</p>
          </div>
          <TransitionGroup
            tag="div"
            class="flex flex-col gap-2"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition duration-150 ease-in"
            leave-to-class="opacity-0"
          >
            <div v-for="(p, i) in arvore.passos" :key="`passo-${i}`" class="flex flex-wrap items-center gap-2 rounded-lg border border-default border-l-4 border-l-secondary p-2">
              <UInput :model-value="p.nome" size="xs" icon="i-lucide-variable" class="w-36 font-mono" :aria-label="t.construtor.nomeDoPasso" @change="(e: Event) => renomearPasso(i, (e.target as HTMLInputElement).value)" />
              <span class="font-mono text-sm text-muted">=</span>
              <Bloco :no="p.no" contexto="topo" :profundidade="0" />
              <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" class="ml-auto" :aria-label="t.construtor.removerParte" @click="removerPasso(i)" />
            </div>
          </TransitionGroup>
          <UButton :label="t.construtor.adicionarPasso" icon="i-lucide-plus" size="xs" color="neutral" variant="outline" class="self-start" @click="adicionarPasso" />
        </section>

        <!-- Resultado -->
        <section class="flex flex-col gap-2">
          <h4 class="text-sm font-semibold text-highlighted">{{ t.construtor.resultado }}</h4>
          <TransitionGroup
            tag="div"
            class="flex flex-col gap-2 rounded-xl border border-default bg-default p-3"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition duration-150 ease-in"
            leave-to-class="opacity-0"
          >
            <div v-for="(p, i) in arvore.pecas" :key="p.id" class="group flex min-w-0 items-start gap-2">
              <span v-if="arvore.pecas.length > 1" class="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-elevated text-[10px] font-semibold text-muted">{{ i + 1 }}</span>
              <div class="min-w-0 flex-1">
                <Bloco :no="p" contexto="topo" :profundidade="0" />
              </div>
              <UButton
                v-if="arvore.pecas.length > 1"
                icon="i-lucide-x"
                size="xs"
                color="neutral"
                variant="ghost"
                class="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                :aria-label="t.construtor.removerParte"
                @click="remover(p.id)"
              />
            </div>
          </TransitionGroup>
          <UTooltip :text="t.construtor.adicionarParteAjuda">
            <UButton :label="t.construtor.adicionarParte" icon="i-lucide-text-cursor-input" size="xs" color="neutral" variant="outline" class="self-start" @click="adicionarPeca" />
          </UTooltip>
        </section>
      </div>

      <!-- TEXTO -->
      <div v-else key="texto" class="flex flex-col gap-2">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs text-muted">{{ t.construtor.textoAjuda }}</p>
          <UDropdownMenu :items="menuDeCampos" :content="{ align: 'end' }" :ui="{ content: 'w-64' }">
            <UButton :label="t.construtor.inserirCampo" icon="i-lucide-braces" trailing-icon="i-lucide-chevron-down" size="xs" color="neutral" variant="outline" />
          </UDropdownMenu>
        </div>
        <UTextarea
          :model-value="textoLocal"
          :rows="5"
          autoresize
          class="w-full"
          :ui="{ base: 'font-mono text-xs leading-relaxed' }"
          spellcheck="false"
          :aria-label="t.construtor.texto"
          @update:model-value="(v) => digitar(String(v))"
          @click="guardarCursor"
          @keyup="guardarCursor"
          @select="guardarCursor"
        />
        <p class="flex items-start gap-1.5 text-xs" :class="trechos ? 'text-warning' : 'text-success'">
          <UIcon :name="trechos ? 'i-lucide-code-xml' : 'i-lucide-check'" class="mt-0.5 size-3.5 shrink-0" />
          {{ trechos ? t.construtor.leitura.trechos(trechos) : t.construtor.leitura.ok }}
        </p>
      </div>
    </Transition>

    <!-- Formato de exibição -->
    <section class="flex flex-col gap-2 border-t border-default pt-3">
      <div class="flex flex-wrap items-end gap-3">
        <UFormField :label="t.construtor.formato" size="sm">
          <USelect :model-value="formato?.tipo ?? 'nenhum'" :items="tiposDeFormato" size="sm" class="w-40" @update:model-value="(v) => escolherTipoDeFormato(String(v))" />
        </UFormField>
        <UFormField v-if="formato && formato.tipo !== 'data'" :label="t.construtor.casas" size="sm">
          <USelect :model-value="formato.casas ?? 2" :items="[0, 1, 2, 3, 4]" size="sm" class="w-20" @update:model-value="(v) => mudarFormato({ ...formato!, casas: Number(v) })" />
        </UFormField>
        <UFormField v-if="formato?.tipo === 'moeda'" :label="t.construtor.moeda" size="sm">
          <USelect :model-value="formato.moeda ?? 'BRL'" :items="['BRL', 'USD', 'EUR']" size="sm" class="w-24" @update:model-value="(v) => mudarFormato({ ...formato!, moeda: v as any })" />
        </UFormField>
        <UFormField v-if="formato?.tipo === 'data'" :label="t.construtor.formatos.data" size="sm">
          <USelect
            :model-value="formato.estiloData ?? 'short'"
            :items="(['short', 'medium', 'long', 'full'] as const).map(s => ({ label: t.construtor.estilosDeData[s], value: s }))"
            size="sm"
            class="w-64"
            @update:model-value="(v) => mudarFormato({ ...formato!, estiloData: v as any })"
          />
        </UFormField>
      </div>
      <p v-if="modo === 'proposta'" class="text-xs text-muted">{{ t.construtor.formatoForaDaExpressao }}</p>
    </section>

    <!-- Expressão gravada: o que o campo guarda, sempre à vista -->
    <section class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between gap-2">
        <h4 class="text-sm font-semibold text-highlighted">{{ t.construtor.expressaoGravada }}</h4>
        <UButton :label="t.construtor.copiar" icon="i-lucide-copy" size="xs" color="neutral" variant="ghost" @click="copiar" />
      </div>
      <pre class="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-default bg-elevated/60 px-3 py-2 font-mono text-[11px] leading-relaxed text-toned">{{ expressao }}</pre>
      <p class="text-xs text-muted">{{ t.construtor.expressaoGravadaAjuda }}</p>
    </section>

    <!-- Para conferir -->
    <section class="flex flex-col gap-1.5" aria-live="polite">
      <TransitionGroup
        tag="ul"
        class="flex flex-col gap-1.5"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <li
          v-for="(p, i) in problemas"
          :key="`${p.chave}-${p.no ?? i}`"
          class="flex items-start gap-2 rounded-md px-2.5 py-1.5 text-xs"
          :class="p.nivel === 'erro' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'"
        >
          <UIcon :name="p.nivel === 'erro' ? 'i-lucide-circle-x' : 'i-lucide-triangle-alert'" class="mt-0.5 size-3.5 shrink-0" />
          <span class="flex-1 text-highlighted">{{ t.problemas[p.chave]?.(p.p ?? {}) ?? p.chave }}</span>
          <UButton v-if="p.no" :label="t.construtor.irAoBloco" size="xs" variant="link" :color="p.nivel === 'erro' ? 'error' : 'warning'" class="-my-1 p-0" @click="mostrarBloco(p.no)" />
        </li>
        <li v-if="!erros.length" key="ok" class="flex items-center gap-2 rounded-md bg-success/10 px-2.5 py-1.5 text-xs text-success">
          <UIcon name="i-lucide-circle-check" class="size-3.5 shrink-0" />
          <span class="text-highlighted">{{ t.construtor.tudoCerto }}</span>
        </li>
      </TransitionGroup>
    </section>

    <!-- O que o motor de hoje aceita -->
    <UCollapsible v-if="modo === 'hoje'" class="rounded-lg border border-default">
      <UButton :label="t.construtor.limitesHoje.titulo" icon="i-lucide-info" trailing-icon="i-lucide-chevron-down" color="neutral" variant="ghost" size="sm" block class="justify-start" />
      <template #content>
        <ul class="list-disc space-y-1 px-8 pb-3 text-xs text-toned">
          <li v-for="(l, i) in t.construtor.limitesHoje.itens" :key="i">{{ l }}</li>
        </ul>
      </template>
    </UCollapsible>
  </div>
</template>

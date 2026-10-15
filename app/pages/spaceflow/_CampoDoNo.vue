<script setup lang="ts">
/**
 * Um campo do modal de nó, desenhado a partir da definição em `nos.ts`.
 *
 * O padrão de todo campo (o mesmo do `no-de-atraso`, aprovado):
 * - rótulo curto, com "*" quando obrigatório;
 * - instrução de 1 frase sempre visível embaixo (o `help` do UFormField);
 * - explicação longa no "?" do rótulo;
 * - em dropdown, um "?" por opção e a opção escolhida sem ✓, com fundo e semibold;
 * - campo que aceita variável tem o botão {x} e aceita soltar a variável.
 *
 * O dado é gravado direto no rascunho do nó (`dado`), que o modal só passa
 * para o fluxo no Salvar e fechar.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Campo, Dado, Opcao } from './nos'
import type { No } from './mocks'
import type { Textos } from './textos'
import { gravar, ler, operadores, vazio } from './nos'
import { agentes, caixasDeEmail, categorias, comparacoes, credenciais, ferramentasDoAgente, fluxoInfo, fluxos, fusos, grupos, cargos, membros, modelosDeEmail, modelosDeIa } from './mocks'
import { indiceDeVariaveis } from './apoio'
import CaixaDeVariavel from './_CaixaDeVariavel.vue'
import CampoRico from './_CampoRico.vue'

const props = defineProps<{
  campo: Campo
  dado: Dado
  t: Textos
  i: Idioma
  nos: No[]
  /** A chave do campo marcado para receber variável. */
  alvo: string | null
  mostrarErros: boolean
}>()
const emit = defineEmits<{ marcar: [chave: string, inserir: (v: string) => void] }>()

const c = computed(() => props.campo)
const tx = (x?: Record<Idioma, string>) => x?.[props.i]
const m = computed(() => props.t.modal)

const valor = computed({
  get: () => ler(props.dado, c.value.chave),
  set: v => gravar(props.dado, c.value.chave, v),
})

const erro = computed(() => props.mostrarErros && !!c.value.obrigatorio && vazio(valor.value))
const marcado = computed(() => props.alvo === c.value.chave)

/* ---------- opções ---------- */

const NULO = '__nulo'
type Item = { label: string, value: string | number, ajuda?: string, disabled?: boolean, selo?: string, avatar?: { text: string }, descricao?: string }

function deOpcoes(op: Opcao[]): Item[] {
  return op.map(o => ({ label: o.rotulo[props.i], value: o.valor ?? NULO, ajuda: tx(o.ajuda), disabled: o.desativado, selo: tx(o.selo) }))
}

const categoria = computed(() => categorias.find(x => x.id === (props.dado.scope ?? props.dado.type)))

const itens = computed<Item[]>(() => {
  if (c.value.opcoes) return deOpcoes(c.value.opcoes)
  const s = (lista: string[]) => lista.map(v => ({ label: v, value: v }))
  switch (c.value.fonte) {
    case 'categorias': return categorias.map(x => ({ label: x.nome, value: x.id }))
    case 'membros': return membros.map(x => ({ label: x.nome, value: x.id, avatar: { text: iniciais(x.nome) } }))
    case 'credenciais': return credenciais.map(x => ({ label: x.nome, value: x.id, selo: x.tipo }))
    case 'modelos': return s(modelosDeIa)
    case 'agentes': return s(agentes)
    case 'ferramentas': return ferramentasDoAgente.map(x => ({ label: x.nome, value: x.id }))
    case 'comparacoes': return s(comparacoes)
    case 'modelosDeEmail': return s(modelosDeEmail)
    case 'caixasDeEmail': return s(caixasDeEmail)
    case 'fusos': return s(fusos)
    case 'formularios': return s(categoria.value?.formularios ?? [])
    case 'camposDaCategoria': return (categoria.value?.campos ?? []).map(x => ({ label: x.rotulo, value: x.chave }))
    // Só é destino o fluxo Ativo com Início Manual; o resto aparece cinza, com o motivo (hoje some da lista sem explicar).
    case 'fluxos': return fluxos.map(x => ({
      label: x.nome,
      value: x.id,
      disabled: !x.ativo || x.inicio !== 'manual',
      selo: x.proprio ? m.value.motivoProprio : !x.ativo ? m.value.motivoInativo : x.inicio !== 'manual' ? m.value.motivoInicio : undefined,
    }))
    default: return []
  }
})

const valorDoSelect = computed({
  get: () => (valor.value == null ? (c.value.opcoes?.some(o => o.valor === null) ? NULO : undefined) : valor.value),
  set: v => (valor.value = v === NULO ? null : v),
})

/**
 * Dropdown da proposta: sem o ✓ (empurrava o "?" da opção) e com a opção
 * escolhida em fundo e semibold. Rodada 9 do `no-de-atraso`.
 */
const uiDaLista = {
  itemTrailingIcon: 'hidden',
  item: 'data-[state=checked]:font-semibold data-[state=checked]:text-highlighted data-[state=checked]:before:bg-elevated',
}

function iniciais(nome: string) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

/* ---------- inserir variável ---------- */

function inserirTexto(chave: string) {
  const atual = String(valor.value ?? '')
  valor.value = `${atual}${atual && !/\s$/.test(atual) ? ' ' : ''}${chave}`
}
function marcar(fn: (v: string) => void = inserirTexto) {
  emit('marcar', c.value.chave, fn)
}
function soltarTexto(e: DragEvent, aplicar: (v: string) => void) {
  const chave = e.dataTransfer?.getData('text/plain')
  if (!chave) return
  e.preventDefault()
  aplicar(chave)
}

/** Variável no Para vira o nome legível do campo; e-mail digitado fica como está. */
function textoDoEmail(item: string) {
  const k = item.match(/^\{\{\s*([^}]+?)\s*\}\}$/)?.[1]
  return k ? (indiceDeVariaveis(props.nos).get(k)?.rotulo ?? k) : item
}

/** Texto com variáveis em pedaços: texto solto e etiquetas legíveis. */
const segmentos = computed(() => {
  const texto = typeof valor.value === 'string' ? valor.value : ''
  const partes: { t: string, v?: boolean }[] = []
  let ultimo = 0
  for (const m of texto.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)) {
    if (m.index! > ultimo) partes.push({ t: texto.slice(ultimo, m.index) })
    const v = indiceDeVariaveis(props.nos).get(m[1]!)
    partes.push({ t: v ? v.rotulo : m[1]!.split('.').at(-1)!, v: true })
    ultimo = m.index! + m[0].length
  }
  if (ultimo < texto.length) partes.push({ t: texto.slice(ultimo) })
  return partes
})

const rico = ref<InstanceType<typeof CampoRico> | null>(null)

/* ---------- membro ou variável ---------- */

const membroEhVariavel = ref(typeof valor.value === 'string' && valor.value.startsWith('{{'))

/* ---------- listas ---------- */

const TIPOS_DE_LISTA = ['listaVariaveis', 'emails', 'arquivos', 'chaveValor', 'construtor', 'rotasIa', 'rotas', 'entradas', 'camposDaAcao', 'permissoes', 'respostaHttp', 'multi']
if (TIPOS_DE_LISTA.includes(props.campo.tipo) && !Array.isArray(valor.value)) valor.value = []
if (props.campo.tipo === 'condicoes' && (!valor.value || typeof valor.value !== 'object')) valor.value = { and: [], or: [] }

function lista<T>(): T[] {
  return (Array.isArray(valor.value) ? valor.value : []) as T[]
}
function remover(arr: unknown[], idx: number) {
  arr.splice(idx, 1)
}
let seq = 0
const novoId = (p: string) => `${p}${Date.now().toString(36)}${seq++}`

/* condições */
if (props.campo.tipo === 'condicoes') {
  const v = valor.value as { and?: any[], or?: any[] }
  v.and ??= []
  v.or ??= []
}
const condicoes = computed(() => valor.value as { and: any[], or: any[], separate_branches?: boolean })
/** A linha (condição ou rota) que recebe a variável do painel. */
const alvoDaLinha = ref<unknown>(null)
const semValor = (op: string) => op === 'notNull' || op === 'isNull'
const itensDeOperador = computed(() => deOpcoes(operadores))

/* construtor de campos */
const tiposDoConstrutor = computed(() => Object.entries(m.value.tiposDeCampo).map(([value, label]) => ({ label, value })))
const iconeDoTipo: Record<string, string> = {
  text: 'i-lucide-type', textarea: 'i-lucide-align-left', number: 'i-lucide-hash', date: 'i-lucide-calendar',
  select: 'i-lucide-list', checkbox: 'i-lucide-toggle-left', file: 'i-lucide-paperclip', money: 'i-lucide-banknote',
  email: 'i-lucide-at-sign', relation: 'i-lucide-link',
}
const abaDoConstrutor = ref('campos')
function adicionarCampoNoConstrutor() {
  const n = lista<any>().length + 1
  lista<any>().push({ refId: novoId('f'), type: 'text', label: '', name: `campo_${n}`, instruction: '' })
}

/* campos da ação (CRUD) */
const camposDisponiveis = computed(() => (categoria.value?.campos ?? []).map(x => ({ label: x.rotulo, value: x.chave, icon: iconeDoTipo[x.tipo] })))
const camposEscolhidos = computed({
  get: () => lista<{ field: string }>().map(f => f.field),
  set: (chaves: string[]) => {
    const atual = lista<{ field: string, value: unknown }>()
    valor.value = chaves.map(k => atual.find(f => f.field === k) ?? { field: k, value: '' })
  },
})
const rotuloDoCampo = (k: string) => categoria.value?.campos.find(x => x.chave === k)
/* permissões: o schema guarda texto; aqui "tipo:quem:acao" */
const permissoes = computed(() => lista<string>().map(s => s.split(':')))
function setPermissao(idx: number, parte: number, v: string) {
  const p = permissoes.value[idx]!
  p[parte] = v
  lista<string>()[idx] = p.join(':')
}
const quemPorTipo = (tipo?: string) => (tipo === 'group' ? grupos : tipo === 'role' ? cargos : membros.map(x => x.nome)).map(v => ({ label: v, value: v }))

/* webhook (somente leitura, hoje fica na barra de detalhes do fluxo) */
const urlDoWebhook = `https://api.enspace.example/ws/${fluxoInfo.uuid.slice(0, 8)}/entrada-de-contrato`
const copiado = ref('')
function copiar(texto: string, qual: string) {
  navigator.clipboard?.writeText(texto).catch(() => {})
  copiado.value = qual
  setTimeout(() => (copiado.value = ''), 1500)
}

const arquivos = ref<File[] | null>(null)
watch(arquivos, (fs) => {
  if (fs) valor.value = [...(Array.isArray(valor.value) ? valor.value : []), ...fs.map(f => f.name)]
})
</script>

<template>
  <!-- Aviso fixo: só para efeito que surpreende (pesquisa, padrão do n8n e do Twenty) -->
  <UAlert
    v-if="c.tipo === 'aviso'"
    :description="tx(c.texto)"
    :color="c.cor === 'warning' ? 'warning' : c.cor === 'info' ? 'info' : 'neutral'"
    variant="subtle"
    :icon="c.cor === 'warning' ? 'i-lucide-triangle-alert' : 'i-lucide-info'"
    :ui="{ description: 'text-sm' }"
  />

  <UFormField
    v-else
    :label="tx(c.rotulo)"
    :required="c.obrigatorio && !!c.rotulo"
    :help="erro ? undefined : tx(c.ajuda)"
    :error="erro ? t.modal.obrigatorio : undefined"
    :data-campo="c.chave"
    :ui="{ label: 'text-highlighted', help: 'text-muted', container: 'mt-1.5' }"
  >
    <template v-if="c.dica" #hint>
      <UTooltip :text="tx(c.dica)" :content="{ side: 'top', align: 'end' }" :ui="{ content: 'h-auto max-w-80 py-1.5', text: 'whitespace-normal' }">
        <UIcon name="i-lucide-circle-help" class="size-4 text-muted transition-colors hover:text-default" tabindex="0" :aria-label="tx(c.dica)" />
      </UTooltip>
    </template>

    <!-- texto -->
    <div v-if="c.tipo === 'texto'">
      <UInput
        v-model="valor"
        :placeholder="tx(c.placeholder)"
        class="w-full"
        :color="marcado ? 'primary' : undefined"
        :highlight="marcado"
        :ui="{ trailing: 'pe-1' }"
        @drop="soltarTexto($event, inserirTexto)"
        @dragover.prevent
      >
        <template v-if="c.aceitaVariavel" #trailing>
          <UTooltip :text="t.modal.inserirVariavel">
            <UButton icon="i-lucide-braces" color="neutral" variant="ghost" size="xs" :aria-label="t.modal.inserirVariavel" @click="marcar()" />
          </UTooltip>
        </template>
      </UInput>

      <!-- Prévia legível: a chave {{...}} vira a etiqueta do campo e do nó -->
      <p v-if="c.aceitaVariavel && segmentos.some(x => x.v)" class="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-muted">
        <template v-for="(sg, k) in segmentos" :key="k">
          <span v-if="!sg.v">{{ sg.t }}</span>
          <span v-else class="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-highlighted ring ring-inset ring-primary/25">
            <UIcon name="i-lucide-variable" class="size-3 text-primary" />{{ sg.t }}
          </span>
        </template>
      </p>
    </div>

    <!-- número -->
    <UInputNumber
      v-else-if="c.tipo === 'numero'"
      v-model="valor"
      :min="c.min"
      :max="c.max"
      :step="c.passo ?? 1"
      class="w-full"
      :format-options="{ useGrouping: true }"
    >
      <template v-if="c.sufixo" #increment>
        <span class="px-2 text-xs text-muted">{{ tx(c.sufixo) }}</span>
      </template>
    </UInputNumber>

    <!-- texto longo / código -->
    <UTextarea
      v-else-if="c.tipo === 'textoLongo' || c.tipo === 'codigo'"
      v-model="valor"
      :placeholder="tx(c.placeholder)"
      :rows="c.tipo === 'codigo' ? 6 : 3"
      autoresize
      class="w-full"
      :ui="{ base: c.tipo === 'codigo' ? 'font-mono text-xs' : '' }"
      @drop="soltarTexto($event, inserirTexto)"
      @dragover.prevent
    />

    <!-- rico (TipTap) -->
    <CampoRico
      v-else-if="c.tipo === 'rico'"
      ref="rico"
      v-model="valor"
      :t="t"
      :placeholder="tx(c.placeholder)"
      :erro="erro"
      :marcado="marcado"
      :aceita-variavel="c.aceitaVariavel"
      @marcar="marcar((v) => rico?.inserir(v))"
    />

    <!-- select: lista curta e fixa (USelect), com "?" por opção -->
    <USelect
      v-else-if="c.tipo === 'select' && c.opcoes"
      v-model="valorDoSelect"
      :items="itens"
      :placeholder="t.modal.selecione"
      :ui="uiDaLista"
      class="w-full"
      :color="erro ? 'error' : undefined"
      :highlight="erro"
    >
      <template #item-trailing="{ item }">
        <UBadge v-if="(item as Item).selo" :label="(item as Item).selo" size="sm" color="neutral" variant="subtle" />
        <UTooltip v-if="(item as Item).ajuda" :text="(item as Item).ajuda" :content="{ side: 'right', sideOffset: 12 }" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
          <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="t.modal.ajudaDaOpcao" />
        </UTooltip>
      </template>
    </USelect>

    <!-- select: lista do workspace (USelectMenu com busca) -->
    <USelectMenu
      v-else-if="c.tipo === 'select'"
      v-model="valor"
      :items="itens"
      value-key="value"
      :placeholder="t.modal.selecione"
      :search-input="itens.length > 6 ? { placeholder: t.paleta.buscar.replace(/nó$/, '') } : false"
      :ui="uiDaLista"
      class="w-full"
      :color="erro ? 'error' : undefined"
      :highlight="erro"
    >
      <template #item-trailing="{ item }">
        <UBadge v-if="(item as Item).selo" :label="(item as Item).selo" size="sm" color="neutral" variant="subtle" />
      </template>
      <template v-if="c.fonte === 'credenciais'" #trailing>
        <UBadge v-if="valor" :label="credenciais.find(x => x.id === valor)?.tipo" size="sm" color="neutral" variant="subtle" class="me-1" />
        <UIcon name="i-lucide-chevron-down" class="size-5 text-dimmed" />
      </template>
    </USelectMenu>

    <!-- seleção múltipla -->
    <USelectMenu
      v-else-if="c.tipo === 'multi'"
      v-model="valor"
      :items="itens"
      value-key="value"
      multiple
      :placeholder="t.modal.nenhum"
      class="w-full"
      :color="erro ? 'error' : undefined"
      :highlight="erro"
    >
      <template #item-trailing="{ item }">
        <UBadge v-if="(item as Item).selo" :label="(item as Item).selo" size="sm" color="neutral" variant="subtle" />
      </template>
    </USelectMenu>

    <!-- liga/desliga: o rótulo é a frase, a instrução vai embaixo -->
    <USwitch v-else-if="c.tipo === 'switch'" v-model="valor" :aria-label="tx(c.rotulo)" />

    <!-- membro ou variável -->
    <div v-else-if="c.tipo === 'membro'" class="flex items-start gap-2">
      <CaixaDeVariavel
        v-if="membroEhVariavel"
        v-model="valor"
        class="flex-1"
        :t="t"
        :nos="nos"
        :marcado="marcado"
        @marcar="marcar((v) => (valor = v))"
      />
      <USelectMenu
        v-else
        v-model="valor"
        :items="itens.length ? itens : membros.map(x => ({ label: x.nome, value: x.id, avatar: { text: iniciais(x.nome) } }))"
        value-key="value"
        :placeholder="t.modal.nenhum"
        :search-input="{ placeholder: '' }"
        class="flex-1"
        :ui="uiDaLista"
      />
      <UTooltip v-if="c.aceitaVariavel" :text="membroEhVariavel ? t.modal.trocarPorMembro : t.modal.trocarPorVariavel">
        <UButton
          :icon="membroEhVariavel ? 'i-lucide-user-round' : 'i-lucide-braces'"
          color="neutral"
          variant="outline"
          :aria-label="membroEhVariavel ? t.modal.trocarPorMembro : t.modal.trocarPorVariavel"
          @click="membroEhVariavel = !membroEhVariavel; valor = null"
        />
      </UTooltip>
    </div>

    <!-- uma variável só -->
    <CaixaDeVariavel
      v-else-if="c.tipo === 'variavel'"
      v-model="valor"
      :t="t"
      :nos="nos"
      :erro="erro"
      :marcado="marcado"
      @marcar="marcar((v) => (valor = v))"
    />

    <!-- lista de variáveis (arquivos do fluxo) -->
    <div v-else-if="c.tipo === 'listaVariaveis'" class="space-y-2">
      <div v-for="(_, idx) in lista<string>()" :key="idx" class="flex items-center gap-2">
        <CaixaDeVariavel v-model="lista<string>()[idx]" class="flex-1" :t="t" :nos="nos" @marcar="marcar((v) => (lista<string>()[idx] = v))" />
        <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="m.remover" @click="remover(lista(), idx)" />
      </div>
      <UButton :label="m.adicionar" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="lista<string>().push(''); marcar((v) => (lista<string>()[lista<string>().length - 1] = v))" />
    </div>

    <!-- e-mails: digita e tecla Enter, ou solta variável -->
    <div v-else-if="c.tipo === 'emails'" @drop="soltarTexto($event, (v) => lista<string>().push(v))" @dragover.prevent>
      <UInputTags
        v-model="valor"
        :placeholder="m.emailsPlaceholder"
        class="w-full"
        :color="erro ? 'error' : marcado ? 'primary' : undefined"
        :highlight="erro || marcado"
        :ui="{ item: 'max-w-64' }"
      >
        <template #item-text="{ item }">
          <span class="truncate">{{ textoDoEmail(String(item)) }}</span>
        </template>
      </UInputTags>
      <div v-if="c.aceitaVariavel" class="mt-1.5">
        <UButton :label="m.inserirVariavel" icon="i-lucide-braces" color="neutral" variant="outline" size="xs" @click="marcar((v) => lista<string>().push(v))" />
      </div>
    </div>

    <!-- slider de criatividade -->
    <div v-else-if="c.tipo === 'slider'" class="flex items-center gap-3">
      <span class="text-xs text-muted">{{ m.preciso }}</span>
      <USlider v-model="valor" :min="c.min" :max="c.max" :step="c.passo" class="flex-1" :tooltip="true" />
      <span class="text-xs text-muted">{{ m.criativo }}</span>
      <UBadge :label="String(valor ?? 0).replace('.', i === 'en' ? '.' : ',')" color="neutral" variant="outline" class="w-10 justify-center tabular-nums" />
    </div>

    <!-- arquivos fixos -->
    <div v-else-if="c.tipo === 'arquivos'" class="space-y-2">
      <UFileUpload v-model="arquivos" multiple :label="m.soltarArquivo" icon="i-lucide-upload" layout="list" class="min-h-24 w-full" />
      <div v-if="lista<string>().length" class="flex flex-wrap gap-1.5">
        <UBadge v-for="(f, idx) in lista<string>()" :key="f + idx" :label="f" icon="i-lucide-paperclip" color="neutral" variant="subtle" />
      </div>
    </div>

    <!-- chave e valor (cabeçalhos, parâmetros) -->
    <div v-else-if="c.tipo === 'chaveValor'" class="space-y-2">
      <div v-for="(par, idx) in lista<{ key: string, value: string }>()" :key="idx" class="grid grid-cols-[1fr_1fr_auto] gap-2">
        <UInput v-model="par.key" :placeholder="m.chave" :aria-label="m.chave" :ui="{ base: 'font-mono text-xs' }" />
        <UInput v-model="par.value" :placeholder="m.valor" :aria-label="m.valor" :ui="{ base: 'font-mono text-xs' }" @drop="soltarTexto($event, (v) => (par.value = `${par.value ?? ''}${v}`))" @dragover.prevent />
        <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="m.remover" @click="remover(lista(), idx)" />
      </div>
      <UButton :label="m.adicionar" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="lista<any>().push({ key: '', value: '' })" />
    </div>

    <!-- condições: E primeiro, depois OU, com a regra escrita -->
    <div v-else-if="c.tipo === 'condicoes'" class="space-y-3">
      <div
        v-for="grupo in (['and', 'or'] as const)"
        :key="grupo"
        class="rounded-lg border border-default bg-elevated/40 p-3"
      >
        <p class="text-sm font-semibold text-highlighted">
          {{ grupo === 'and' ? m.todas : m.alguma }}
          <span class="font-normal text-muted">· {{ grupo === 'and' ? m.todasAjuda : m.algumaAjuda }}</span>
        </p>
        <TransitionGroup tag="div" class="mt-2 space-y-2" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <div v-for="(cond, idx) in condicoes[grupo]" :key="cond._k ?? idx" class="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2">
            <CaixaDeVariavel
              v-model="cond.ref"
              :t="t"
              :nos="nos"
              :placeholder="m.referencia"
              :marcado="marcado && alvoDaLinha === cond"
              @marcar="alvoDaLinha = cond; marcar((v) => (cond.ref = v))"
            />
            <USelect v-model="cond.op" :items="itensDeOperador" :aria-label="m.operador" :placeholder="m.operador" :ui="uiDaLista" />
            <UInput v-if="!semValor(cond.op)" v-model="cond.value" :placeholder="m.valorEsperado" :aria-label="m.valorEsperado" @drop="soltarTexto($event, (v) => (cond.value = v))" @dragover.prevent />
            <span v-else />
            <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="m.remover" @click="remover(condicoes[grupo]!, idx)" />
          </div>
        </TransitionGroup>
        <UButton :label="m.adicionarCondicao" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" class="mt-2" @click="condicoes[grupo]!.push({ ref: '', op: '==', value: '', _k: novoId('c') })" />
      </div>
      <div class="flex items-start justify-between gap-3 rounded-lg bg-elevated/60 px-3 py-2">
        <p class="text-sm text-default">
          <UIcon name="i-lucide-info" class="me-1 size-4 align-[-3px] text-primary" />
          {{ condicoes.separate_branches ? m.separarAjuda : m.resumoCondicoes }}
        </p>
        <USwitch v-model="condicoes.separate_branches" :label="m.separar" size="sm" class="shrink-0" :ui="{ label: 'text-xs text-muted' }" />
      </div>
    </div>

    <!-- construtor de campos (formulário, campos recebidos, campos a extrair) -->
    <div v-else-if="c.tipo === 'construtor'">
      <UTabs
        v-model="abaDoConstrutor"
        :items="[{ label: m.construtor, value: 'campos', icon: 'i-lucide-list' }, { label: m.previa, value: 'previa', icon: 'i-lucide-eye' }]"
        size="xs"
        variant="link"
        :content="false"
        class="mb-2"
      />
      <div v-if="abaDoConstrutor === 'campos'" class="space-y-2">
        <p v-if="!lista<any>().length" class="rounded-md border border-dashed border-accented px-3 py-4 text-center text-sm text-muted">{{ m.semCampos }}</p>
        <div v-for="(f, idx) in lista<any>()" :key="f.refId ?? idx" class="space-y-2 rounded-lg border border-default p-2.5">
          <div class="grid grid-cols-[minmax(0,1fr)_10rem_auto] items-center gap-2">
            <UInput v-model="f.label" :placeholder="m.nomeDoCampo" :aria-label="m.nomeDoCampo" @update:model-value="(v: string) => (f.name = v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\W+/g, '_'))" />
            <USelect v-model="f.type" :items="tiposDoConstrutor" :aria-label="m.tipoDoCampo" :ui="uiDaLista" />
            <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="m.remover" @click="remover(lista(), idx)" />
          </div>
          <UInput v-if="c.comDescricao" v-model="f.instruction" :placeholder="m.descricaoDoCampo" :aria-label="m.descricaoDoCampo" size="sm" icon="i-lucide-search" />
          <p class="font-mono text-[11px] text-dimmed">{{ f.name }}</p>
        </div>
        <UButton :label="m.adicionarCampo" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="adicionarCampoNoConstrutor" />
      </div>
      <div v-else class="space-y-3 rounded-lg border border-default bg-elevated/40 p-3">
        <p v-if="!lista<any>().length" class="text-sm text-muted">{{ m.semCampos }}</p>
        <UFormField v-for="f in lista<any>()" :key="f.refId" :label="f.label || m.nomeDoCampo" :help="f.instruction || undefined">
          <USwitch v-if="f.type === 'checkbox'" disabled />
          <UTextarea v-else-if="f.type === 'textarea'" disabled class="w-full" />
          <UInput v-else disabled class="w-full" :icon="iconeDoTipo[f.type]" />
        </UFormField>
      </div>
    </div>

    <!-- rotas da IA Roteadora -->
    <div v-else-if="c.tipo === 'rotasIa'" class="space-y-2">
      <div v-for="(r, idx) in lista<any>()" :key="r.outletId ?? idx" class="grid grid-cols-[11rem_minmax(0,1fr)_auto] items-start gap-2 rounded-lg border border-default p-2.5">
        <UFormField :label="m.nomeDaRota" :help="idx === 0 ? m.nomeDaRotaAjuda : undefined" size="sm">
          <UInput v-model="r.key" icon="i-lucide-signpost" />
        </UFormField>
        <UFormField :label="m.quandoUsar" :help="idx === 0 ? m.quandoUsarAjuda : undefined" size="sm">
          <UTextarea v-model="r.description" :rows="1" autoresize class="w-full" />
        </UFormField>
        <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" class="mt-6" :aria-label="m.remover" @click="remover(lista(), idx)" />
      </div>
      <div class="flex items-start gap-2 rounded-lg border border-dashed border-accented px-3 py-2 text-sm">
        <UIcon name="i-lucide-corner-down-right" class="mt-0.5 size-4 shrink-0 text-muted" />
        <span><strong class="text-highlighted">{{ m.nenhumaRota }}.</strong> <span class="text-muted">{{ m.nenhumaRotaAjuda }}</span></span>
      </div>
      <UButton :label="m.adicionarRota" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="lista<any>().push({ key: '', description: '', outletId: novoId('r-') })" />
    </div>

    <!-- rotas por condição -->
    <div v-else-if="c.tipo === 'rotas'" class="space-y-2">
      <p v-if="!lista<any>().length" class="rounded-md border border-dashed border-accented px-3 py-4 text-center text-sm text-muted">{{ m.semRotas }}</p>
      <div v-for="(r, idx) in lista<any>()" :key="r.id ?? idx" class="rounded-lg border border-default p-2.5">
        <div class="mb-2 flex items-center gap-2">
          <UBadge :label="m.rota(idx + 1)" icon="i-lucide-git-branch" color="primary" variant="subtle" />
          <span class="flex-1" />
          <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="m.remover" @click="remover(lista(), idx)" />
        </div>
        <div class="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2">
          <CaixaDeVariavel
            v-model="r.ref"
            :t="t"
            :nos="nos"
            :placeholder="m.referencia"
            :marcado="marcado && alvoDaLinha === r"
            @marcar="alvoDaLinha = r; marcar((v) => (r.ref = v))"
          />
          <USelect v-model="r.op" :items="itensDeOperador" :aria-label="m.operador" :ui="uiDaLista" />
          <UInput v-if="!semValor(r.op)" v-model="r.value" :placeholder="m.valorEsperado" :aria-label="m.valorEsperado" />
        </div>
      </div>
      <div class="flex items-start gap-2 rounded-lg border border-dashed border-accented px-3 py-2 text-sm">
        <UIcon name="i-lucide-repeat" class="mt-0.5 size-4 shrink-0 text-muted" />
        <span><strong class="text-highlighted">{{ m.sempre }}.</strong> <span class="text-muted">{{ m.sempreAjuda }}</span></span>
      </div>
      <UButton :label="m.adicionarRota" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="lista<any>().push({ id: novoId('rt'), ref: '', op: '==', value: '' })" />
    </div>

    <!-- entradas do Mesclar -->
    <div v-else-if="c.tipo === 'entradas'" class="space-y-2">
      <div v-for="(e, idx) in lista<any>()" :key="e.id ?? idx" class="flex items-center gap-2">
        <UInput v-model="e.label" :placeholder="m.entradaN(idx + 1)" :aria-label="m.rotuloDaEntrada" icon="i-lucide-arrow-right-to-line" class="flex-1" />
        <USwitch v-model="e.required" :label="m.obrigatoria" size="sm" :ui="{ label: 'text-xs' }" />
        <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="m.remover" @click="remover(lista(), idx)" />
      </div>
      <UButton :label="m.adicionarEntrada" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="lista<any>().push({ id: novoId('m'), label: '', required: false })" />
    </div>

    <!-- campos da ação do CRUD: escolhe na lista, preenche ao lado -->
    <div v-else-if="c.tipo === 'camposDaAcao'" class="space-y-2">
      <p v-if="!categoria" class="text-sm text-muted">{{ m.escolhaCategoria }}</p>
      <template v-else>
        <TransitionGroup tag="div" class="space-y-2" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
          <div v-for="(f, idx) in lista<any>()" :key="f.field" class="grid grid-cols-[10rem_minmax(0,1fr)_auto] items-center gap-2">
            <span class="flex min-w-0 items-center gap-1.5 rounded-md bg-elevated px-2 py-1.5 text-sm text-highlighted">
              <UIcon :name="iconeDoTipo[rotuloDoCampo(f.field)?.tipo ?? 'text'] ?? 'i-lucide-type'" class="size-4 shrink-0 text-muted" />
              <span class="truncate">{{ rotuloDoCampo(f.field)?.rotulo ?? f.field }}</span>
            </span>
            <UInput v-model="f.value" :placeholder="m.valorDoCampo" :aria-label="m.valorDoCampo" :ui="{ trailing: 'pe-1' }" @drop="soltarTexto($event, (v) => (f.value = v))" @dragover.prevent>
              <template #trailing>
                <UButton icon="i-lucide-braces" color="neutral" variant="ghost" size="xs" :aria-label="t.modal.inserirVariavel" @click="marcar((v) => (f.value = v))" />
              </template>
            </UInput>
            <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="m.remover" @click="remover(lista(), idx)" />
          </div>
        </TransitionGroup>
        <USelectMenu
          v-model="camposEscolhidos"
          :items="camposDisponiveis"
          value-key="value"
          multiple
          :search-input="{ placeholder: '' }"
          class="w-60"
        >
          <template #default>
            <span class="flex items-center gap-1.5 text-sm"><UIcon name="i-lucide-plus" class="size-4" />{{ m.adicionarCampos }}</span>
          </template>
        </USelectMenu>
      </template>
    </div>

    <!-- quem pode ver a tarefa -->
    <div v-else-if="c.tipo === 'permissoes'" class="space-y-2">
      <div v-for="(p, idx) in permissoes" :key="idx" class="grid grid-cols-[8rem_minmax(0,1fr)_7rem_auto] items-center gap-2">
        <USelect :model-value="p[0]" :items="Object.entries(m.tiposDeQuem).map(([value, label]) => ({ value, label }))" :aria-label="m.quem" @update:model-value="(v: string) => setPermissao(idx, 0, v)" />
        <USelectMenu :model-value="p[1]" :items="quemPorTipo(p[0])" value-key="value" :aria-label="m.quem" @update:model-value="(v: string) => setPermissao(idx, 1, v)" />
        <USelect :model-value="p[2]" :items="Object.entries(m.acoesDePermissao).map(([value, label]) => ({ value, label }))" :aria-label="m.permissao" @update:model-value="(v: string) => setPermissao(idx, 2, v)" />
        <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="m.remover" @click="remover(lista(), idx)" />
      </div>
      <UButton :label="m.adicionarRegra" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="lista<string>().push('group:Jurídico:view')" />
    </div>

    <!-- webhook: endereço e cabeçalho, que hoje ficam fora do modal -->
    <div v-else-if="c.tipo === 'webhook'" class="space-y-2 rounded-lg border border-default bg-elevated/40 p-3">
      <p class="text-sm text-muted">{{ m.webhookAjuda }}</p>
      <div v-for="linha in [{ id: 'url', rotulo: m.endereco, valor: urlDoWebhook }, { id: 'h', rotulo: m.cabecalhoDoToken, valor: 'x-en-workflows-webhook-token' }]" :key="linha.id" class="flex items-center gap-2">
        <span class="w-36 shrink-0 text-xs font-medium text-highlighted">{{ linha.rotulo }}</span>
        <code class="min-w-0 flex-1 truncate rounded bg-default px-2 py-1 font-mono text-xs ring ring-default">{{ linha.valor }}</code>
        <UButton :icon="copiado === linha.id ? 'i-lucide-check' : 'i-lucide-copy'" :label="copiado === linha.id ? m.copiado : m.copiar" color="neutral" variant="outline" size="xs" @click="copiar(linha.valor, linha.id)" />
      </div>
    </div>

    <!-- campos da resposta HTTP -->
    <div v-else-if="c.tipo === 'respostaHttp'" class="space-y-2">
      <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_7.5rem_minmax(0,1.2fr)_auto] gap-2 px-0.5 text-xs font-medium text-muted">
        <span>{{ m.variavel }}</span><span>{{ m.rotulo }}</span><span>{{ m.tipoDoCampo }}</span><span>{{ m.caminho }}</span><span class="w-8" />
      </div>
      <div v-for="(f, idx) in lista<any>()" :key="idx" class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_7.5rem_minmax(0,1.2fr)_auto] items-center gap-2">
        <UInput v-model="f.name" :aria-label="m.variavel" :ui="{ base: 'font-mono text-xs' }" />
        <UInput v-model="f.label" :aria-label="m.rotulo" />
        <USelect v-model="f.type" :items="tiposDoConstrutor" :aria-label="m.tipoDoCampo" :ui="uiDaLista" />
        <UInput v-model="f.source_path" :aria-label="m.caminho" :ui="{ base: 'font-mono text-xs' }" placeholder="data.nome" />
        <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="m.remover" @click="remover(lista(), idx)" />
      </div>
      <UButton :label="m.adicionarCampoDaResposta" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="lista<any>().push({ name: '', label: '', type: 'text', source_path: '' })" />
    </div>
  </UFormField>
</template>

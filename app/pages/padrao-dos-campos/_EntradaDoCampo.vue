<script setup lang="ts">
/**
 * A ENTRADA de um campo: o formato "formulário".
 *
 * Um componente só, com uma regra por tipo, servindo os dois lugares onde o
 * valor é ESCRITO: o modal de criação e a coluna 2 da sidebar. É o par do
 * `_ValorDoCampo.vue`, que serve os dois lugares onde o valor é lido.
 *
 * O que funciona de verdade aqui (regra 5): digitar, escolher, marcar, somar e
 * limpar mexem no objeto em memória e o resultado aparece na tabela na hora.
 * O que é maquete: o seletor de arquivo não sobe arquivo de verdade (o botão
 * acrescenta um anexo de exemplo, e daí em diante renomear, reordenar e
 * remover funcionam), e o editor de documentos não abre editor. A conversa,
 * essa, recebe mensagem. Está declarado no DECISOES.md.
 */
import type { Campo } from './campos'
import type { Textos } from './textos'
import { corDaOpcao, formatarBytes, formatarDataHora, rotuloDaOpcao } from './formatacao'
import { indicesDeCorrecao, itensRelacionaveis, membros, moedas, opcoes as todasAsOpcoes } from './mocks'

const props = defineProps<{
  campo: Campo
  modelValue: unknown
  t: Textos
  idioma: string
  /** No modal de criação alguns tipos ainda não existem. */
  naCriacao?: boolean
  /** Na célula o rótulo já é o cabeçalho da coluna, então ele sai. */
  semRotulo?: boolean
  /** Na célula o controle recebe o foco sozinho, para digitar direto. */
  autofoco?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [unknown]
  'inspecionar': []
  /** O controle pediu para fechar: Enter, Tab ou clique fora. */
  'sair': []
}>()

const raizDoCampo = ref<HTMLElement | null>(null)

/**
 * Foco automático quando o campo nasce dentro de uma célula: quem clicou na
 * célula quer digitar, não quer clicar de novo no controle.
 *
 * E o valor que já existe nasce SELECIONADO, como no Notion (medido no board
 * dela em 23/09/2026: ao abrir uma data preenchida, o texto "Aug 13, 2026" vem
 * destacado). O motivo é o caso comum: quem abre um campo preenchido quase
 * sempre quer TROCAR o valor, não emendar no fim dele.
 */
onMounted(() => {
  if (!props.autofoco) return
  nextTick(() => {
    const alvo = raizDoCampo.value?.querySelector<HTMLElement>('input, textarea, [tabindex]')
    alvo?.focus()
    if (alvo instanceof HTMLInputElement && alvo.type !== 'date') alvo.select()
    else if (alvo instanceof HTMLTextAreaElement) alvo.select()
  })
})

/** Clique fora e Enter fecham a edição na célula. */
function aoTeclar(e: KeyboardEvent) {
  if (e.key === 'Enter' && !(e.target as HTMLElement)?.matches('textarea')) emit('sair')
}

const valor = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

/**
 * Proxies tipados do mesmo valor.
 *
 * O `v-model` do Vue não aceita expressão com `as` (não dá para atribuir a um
 * cast), então cada família ganha a sua própria porta de entrada para o mesmo
 * `valor`. Continua sendo um estado só.
 */
const comoTexto = computed<string>({
  get: () => (valor.value ?? '') as string,
  set: v => emit('update:modelValue', v),
})

const comoNumero = computed<number>({
  get: () => (valor.value ?? 0) as number,
  set: v => emit('update:modelValue', v),
})

const comoBooleano = computed<boolean>({
  get: () => Boolean(valor.value),
  set: v => emit('update:modelValue', v),
})

const comoListaDeTexto = computed<string[]>({
  get: () => (valor.value ?? []) as string[],
  set: v => emit('update:modelValue', v),
})

const lista = computed(
  () => (todasAsOpcoes as Record<string, readonly { value: string, label: string, cor?: string }[]>)[props.campo.refId] ?? [],
)

/** O radio vira lista suspensa acima de cinco opções. Regra do catálogo. */
const radioViraLista = computed(() => lista.value.length > 5)
/** A lista ganha busca a partir de dez opções. Regra do catálogo. */
const comBusca = computed(() => lista.value.length >= 10)

const rotuloDoTipo = computed(() => props.t.campos[props.campo.tipo].rotulo)

/** Tipos que não se preenchem na criação: o valor nasce depois do item. */
const soDepoisDeSalvar = computed(
  () => props.campo.tipo === 'EnCustomCode' || props.campo.tipo === 'EnChats' || props.campo.tipo === 'EnOnlyoffice',
)

/* ------------------------------- compostos ------------------------------- */

const endereco = computed({
  get: () => (valor.value as Record<string, string>) ?? {},
  set: v => emit('update:modelValue', v),
})

function mudarSubcampo(chave: string, novo: string) {
  emit('update:modelValue', { ...(valor.value as Record<string, string> ?? {}), [chave]: novo })
}

const linhasDoRepetidor = computed(() => (valor.value as Record<string, unknown>[]) ?? [])

function acrescentarLinha() {
  emit('update:modelValue', [...linhasDoRepetidor.value, { item: '', quantidade: 0 }])
}

function removerLinha(i: number) {
  emit('update:modelValue', linhasDoRepetidor.value.filter((_, j) => j !== i))
}

function mudarLinha(i: number, chave: string, novo: unknown) {
  emit(
    'update:modelValue',
    linhasDoRepetidor.value.map((l, j) => (j === i ? { ...l, [chave]: novo } : l)),
  )
}

/* ------------------------------- os anexos ------------------------------- */

/**
 * Anexo é LISTA, e o documento do time de produtos é explícito sobre o que a
 * pessoa faz com ela: **baixar, renomear, deletar e reordenar**. Eu tinha
 * deixado só um botão de subir arquivo, e ela cobrou com razão.
 *
 * Reordenar aqui é por botão de subir e descer, e não por arrastar: arrastar
 * dentro de uma camada flutuante de célula é frágil, e o que está em discussão
 * é a lista de ações, não a mecânica do arrasto. Declarado no DECISOES.md.
 */
interface Anexo { url: string, filename: string, mime: string, size?: number }

const anexos = computed<Anexo[]>(() => {
  const v = valor.value
  if (Array.isArray(v)) return v as Anexo[]
  if (v && typeof v === 'object') return [v as Anexo]
  return []
})

function gravarAnexos(lista: Anexo[]) {
  emit('update:modelValue', lista)
}

function acrescentarAnexo() {
  const n = anexos.value.length + 1
  gravarAnexos([...anexos.value, {
    url: `https://exemplo.invalido/anexo-${n}.pdf`,
    filename: `anexo-${n}.pdf`,
    mime: 'application/pdf',
    size: 96000 + n * 1000,
  }])
}

function removerAnexo(i: number) {
  gravarAnexos(anexos.value.filter((_, j) => j !== i))
}

function moverAnexo(i: number, passo: number) {
  const destino = i + passo
  if (destino < 0 || destino >= anexos.value.length) return
  const lista = [...anexos.value]
  const [item] = lista.splice(i, 1)
  lista.splice(destino, 0, item!)
  gravarAnexos(lista)
}

/**
 * Renomear acontece no lugar: o nome vira campo de texto. O rascunho fica
 * LOCAL até o Enter, e não sobe a cada tecla: quando eu emitia por tecla, o
 * componente renascia no meio da digitação e comia a seleção do cursor.
 */
const renomeando = ref<number | null>(null)
const rascunhoDoNome = ref('')

function abrirRenomeio(i: number) {
  renomeando.value = i
  rascunhoDoNome.value = anexos.value[i]?.filename ?? ''
}

function confirmarRenomeio() {
  const i = renomeando.value
  renomeando.value = null
  if (i === null) return
  const nome = rascunhoDoNome.value.trim()
  if (!nome) return
  gravarAnexos(anexos.value.map((a, j) => (j === i ? { ...a, filename: nome } : a)))
}

/* ----------------------------- a data rápida ----------------------------- */

/**
 * Atalhos de data, copiados do ClickUp (medido em 23/09/2026). O popup de data
 * dele tem três coisas que o nosso campo não tem: digitação em linguagem
 * natural, uma coluna de atalhos (Hoje, Amanhã, 2 semanas, 4 semanas) com a
 * data resultante do lado, e o calendário. Os atalhos são o pedaço que resolve
 * o caso mais comum sem abrir calendário nenhum.
 */
const atalhosDeData = computed(() => {
  const emDias = (dias: number) => {
    const d = new Date()
    d.setDate(d.getDate() + dias)
    return `${d.toISOString().slice(0, 10)}T12:00:00.000Z`
  }
  return [
    { rotulo: props.t.hoje, dias: 0 },
    { rotulo: props.t.amanha, dias: 1 },
    { rotulo: props.t.proximaSemana, dias: 7 },
    { rotulo: props.t.duasSemanas, dias: 14 },
    { rotulo: props.t.quatroSemanas, dias: 28 },
  ].map(a => ({ ...a, valor: emDias(a.dias) }))
})

/* ------------------------- o arrasto dos anexos -------------------------- */

/**
 * Reordenar arrastando, como no Notion: a alça fica na ESQUERDA da linha e a
 * linha inteira é arrastável. Na rodada 5 eu tinha posto dois botões de subir
 * e descer, e declarei o arrasto como frágil. Ver o gerenciador do Notion no
 * board dela mudou isso: é alça na esquerda e menu de três pontos na direita,
 * e o arrasto é o gesto principal. Os botões continuam existindo, dentro do
 * menu, porque alça não serve para teclado.
 */
const arrastando = ref<number | null>(null)

function comecarArrasto(i: number) {
  arrastando.value = i
}

function soltarEm(i: number) {
  const de = arrastando.value
  arrastando.value = null
  if (de === null || de === i) return
  moverAnexo(de, i - de)
}

/* ------------------------------ a conversa ------------------------------- */

/**
 * Anotações e Chat são conversa, com histórico e compositor. O compositor é o
 * do exemplo do Figma: a caixa de texto com o atalho de "/" e, embaixo, a fila
 * de ações (anexar, mencionar, pessoas, IA, vídeo, áudio) e o enviar.
 */
interface Mensagem { author: string, at?: string, text: string }
const conversa = computed<Mensagem[]>(() => (Array.isArray(valor.value) ? valor.value : []) as Mensagem[])
const rascunhoDaMensagem = ref('')

function enviarMensagem() {
  const texto = rascunhoDaMensagem.value.trim()
  if (!texto) return
  emit('update:modelValue', [...conversa.value, {
    author: 'Mikaela Jardim',
    at: new Date().toISOString(),
    text: texto,
  }])
  rascunhoDaMensagem.value = ''
}

const acoesDoCompositor = computed(() => [
  { icone: 'i-lucide-paperclip', rotulo: props.t.anexar },
  { icone: 'i-lucide-at-sign', rotulo: props.t.mencionar },
  { icone: 'i-lucide-users', rotulo: props.t.pessoas },
  { icone: 'i-lucide-sparkles', rotulo: props.t.acoesDeIa },
  { icone: 'i-lucide-video', rotulo: props.t.gravarVideo },
])

const pessoaEscolhida = computed({
  get: () => (valor.value as { name: string } | null)?.name ?? '',
  set: (nome: string) => {
    const m = membros.find(x => x.nome === nome)
    emit('update:modelValue', m ? { name: m.nome, email: m.email } : null)
  },
})

const relacaoEscolhida = computed({
  get: () => {
    const v = valor.value as { reference: string } | null
    return v?.reference ?? ''
  },
  set: (ref: string) => {
    const i = itensRelacionaveis.find(x => x.reference === ref)
    emit('update:modelValue', i ?? null)
  },
})

const relacoesEscolhidas = computed({
  get: () => ((valor.value as { reference: string }[]) ?? []).map(v => v.reference),
  set: (refs: string[]) => {
    emit(
      'update:modelValue',
      refs.map(r => itensRelacionaveis.find(x => x.reference === r)).filter(Boolean),
    )
  },
})

/* ------------------------------- a moeda -------------------------------- */

/**
 * A moeda é parte do VALOR, não do idioma: o produto guarda
 * `{ currency, value, originalValue }` e oferece 179 moedas num seletor com
 * busca, mostrando só o código ISO. Aqui são duas portas para o mesmo objeto.
 */
const moedaDoValor = computed({
  get: () => (valor.value as { currency?: string } | null)?.currency ?? 'BRL',
  set: (c: string) => {
    const v = (valor.value as Record<string, unknown>) ?? {}
    emit('update:modelValue', { ...v, currency: c })
  },
})

const valorDaMoeda = computed({
  get: () => (valor.value as { value?: number } | null)?.value ?? 0,
  set: (n: number) => {
    const v = (valor.value as Record<string, unknown>) ?? {}
    /* originalValue nasce igual ao valor: é a âncora da correção. */
    emit('update:modelValue', { ...v, value: n, originalValue: v.originalValue ?? n })
  },
})

const simboloDaMoeda = computed(
  () => moedas.find(m => m.codigo === moedaDoValor.value)?.simbolo ?? moedaDoValor.value,
)

const opcoesDeMoeda = computed(() =>
  moedas.map(m => ({ label: m.codigo, value: m.codigo, suffix: m.nome })),
)

/* A calculadora de correção monetária. É maquete: não calcula nada. */
const calculadoraAberta = ref(false)
const correcao = ref({ indice: '', inicio: '2026-09-22', fim: '', multiplos: false })

/* --------------------------- escolha múltipla ---------------------------- */

const buscaDeOpcao = ref('')

const opcoesFiltradas = computed(() => {
  const q = buscaDeOpcao.value.trim().toLowerCase()
  return lista.value.filter(o => !q || o.label.toLowerCase().includes(q))
})

const escolhidos = computed<string[]>(() => (valor.value as string[]) ?? [])

function alternarOpcao(v: string) {
  const atual = escolhidos.value
  emit('update:modelValue', atual.includes(v) ? atual.filter(x => x !== v) : [...atual, v])
}

/**
 * Criar a opção dali mesmo. O ClickUp diz "Pesquise ou adicione opções" e o
 * Notion diz "Select an option or create one": nos dois, a pessoa que está
 * preenchendo cria a opção que falta sem sair da célula. O nosso campo hoje
 * exige ir na configuração do campo, e isso é uma diferença real de fluxo.
 *
 * MAQUETE: aqui a opção nova entra no valor do item, e não no catálogo de
 * opções do campo, porque o catálogo é back-end. Declarado no DECISOES.md.
 */
const podeCriarOpcao = computed(() => {
  const q = buscaDeOpcao.value.trim()
  if (!q) return false
  return !lista.value.some(o => o.label.toLowerCase() === q.toLowerCase())
})

function criarOpcaoDaBusca() {
  const q = buscaDeOpcao.value.trim()
  if (!q) return
  emit('update:modelValue', [...escolhidos.value, q])
  buscaDeOpcao.value = ''
}

const opcoesDeRelacao = computed(() =>
  itensRelacionaveis.map(i => ({
    /* Display vazio cai para a referência. É a mesma regra da célula. */
    label: i.display?.trim() ? i.display : i.reference,
    value: i.reference,
  })),
)
</script>

<template>
  <!--
    O rótulo é um botão: clicar nele abre a ficha do campo. O controle fica
    livre para ser controle, e quem quer entender a regra tem um alvo claro.
  -->
  <div ref="raizDoCampo" class="relative min-w-0" @keydown="aoTeclar">
    <button
      v-if="!semRotulo"
      type="button"
      class="group/rotulo mb-1 flex items-center gap-1.5 rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      @click="emit('inspecionar')"
    >
      <UIcon :name="campo.icone" class="size-3.5 shrink-0 text-dimmed" />
      <span class="text-sm font-medium text-highlighted">{{ rotuloDoTipo }}</span>
      <UIcon
        name="i-lucide-info"
        class="size-3 shrink-0 text-dimmed opacity-0 transition-opacity group-hover/rotulo:opacity-100"
      />
    </button>

    <!-- ───────────────── o que só existe depois de salvar ───────────────── -->
    <div
      v-if="soDepoisDeSalvar && naCriacao"
      class="flex items-center gap-2 rounded-md border border-dashed border-default px-3 py-2 text-sm text-muted"
    >
      <UIcon name="i-lucide-clock-3" class="size-4 shrink-0" />
      <span>{{ t.campos[campo.tipo].formulario }}</span>
    </div>

    <!-- ───────────────────────────── texto ──────────────────────────────── -->
    <UInput
      v-else-if="campo.tipo === 'inputText'"
      v-model="comoTexto"
      size="sm"
      class="w-full"
      :maxlength="120"
      :placeholder="t.campos[campo.tipo].descricao"
    />

    <UTextarea
      v-else-if="campo.tipo === 'EnTextArea'"
      v-model="comoTexto"
      size="sm"
      class="w-full"
      :rows="3"
      :maxrows="6"
      autoresize
    />

    <!--
      O editor de texto rico do Nuxt UI existe (`UEditor`), mas ele carrega o
      TipTap inteiro e o que está em discussão aqui é a MOLDURA do campo, não
      o editor. A barra falsa mostra a altura e o peso que o campo ocupa.
      Declarado como maquete no DECISOES.md.
    -->
    <div v-else-if="campo.tipo === 'EnHtml'" class="rounded-md border border-default">
      <div class="flex items-center gap-0.5 border-b border-default px-1.5 py-1">
        <UIcon
          v-for="i in ['i-lucide-bold', 'i-lucide-italic', 'i-lucide-list', 'i-lucide-link', 'i-lucide-heading-2']"
          :key="i"
          :name="i"
          class="size-4 rounded p-0.5 text-muted hover:bg-elevated"
        />
      </div>
      <UTextarea
        v-model="comoTexto"
        variant="none"
        size="sm"
        class="w-full"
        :rows="3"
        autoresize
      />
    </div>

    <UInput
      v-else-if="campo.tipo === 'EnlMask'"
      v-model="comoTexto"
      size="sm"
      class="w-full font-mono tabular-nums"
      placeholder="00.000.000/0000-00"
    />

    <!--
      E-mail e URL não são famílias próprias: são o Texto simples com a
      máscara correspondente (`config.masks`), como ela confirmou. O que muda
      é a validação e o que a célula faz com o valor: mailto: no e-mail,
      nova aba na URL.
    -->
    <UInput
      v-else-if="campo.tipo === 'email'"
      v-model="comoTexto"
      type="email"
      size="sm"
      class="w-full"
      icon="i-lucide-at-sign"
      placeholder="nome@empresa.com.br"
    />

    <UInput
      v-else-if="campo.tipo === 'EnCustomCode'"
      :model-value="valor as string"
      size="sm"
      class="w-full font-mono"
      disabled
    />

    <!-- ───────────────────────────── número ─────────────────────────────── -->
    <UInputNumber
      v-else-if="campo.tipo === 'EnlNumber'"
      v-model="comoNumero"
      size="sm"
      class="w-full"
      :step="0.5"
    />

    <!--
      Moeda: dois controles ligados, como no develop. O seletor de moeda tem
      busca porque a lista do produto tem 179 códigos, e o campo de valor
      recebe a máscara da moeda escolhida. Quando o campo tem correção
      monetária ligada, entra o botão da calculadora ao lado.
    -->
    <div v-else-if="campo.tipo === 'EnCurrency'" class="flex items-center gap-2">
      <USelectMenu
        v-model="moedaDoValor"
        :items="opcoesDeMoeda"
        value-key="value"
        size="sm"
        class="w-28 shrink-0"
        :search-input="{ placeholder: t.pesquisar }"
      />
      <UInput
        v-model="valorDaMoeda"
        type="number"
        size="sm"
        class="min-w-0 flex-1"
        :ui="{ base: 'text-right tabular-nums' }"
      >
        <template #leading>
          <span class="text-sm text-muted">{{ simboloDaMoeda }}</span>
        </template>
      </UInput>
      <UTooltip v-if="campo.correcaoMonetaria" :text="t.configurarCorrecao">
        <UButton
          icon="i-lucide-sliders-horizontal"
          color="neutral"
          variant="outline"
          size="sm"
          :aria-label="t.configurarCorrecao"
          @click="calculadoraAberta = true"
        />
      </UTooltip>
    </div>

    <!-- ───────────────────────────── escolha ────────────────────────────── -->
    <!--
      Seleção única: o selo colorido aparece DENTRO do controle, e não como
      texto solto, tanto no gatilho quanto na lista. É o desenho do exemplo
      que ela mandou: o status ocupa a largura e destaca de longe.
    -->
    <USelectMenu
      v-else-if="campo.tipo === 'EnlDropdown' || (campo.tipo === 'radioButton' && radioViraLista)"
      v-model="comoTexto"
      :items="lista.map(o => ({ label: o.label, value: o.value, cor: o.cor }))"
      value-key="value"
      size="sm"
      class="w-full"
      :search-input="comBusca ? { placeholder: t.pesquisar } : false"
    >
      <template #default>
        <UBadge
          v-if="comoTexto"
          :color="corDaOpcao(lista, comoTexto) as never"
          variant="subtle"
          size="sm"
          class="max-w-full"
        >
          <span class="truncate">{{ rotuloDaOpcao(lista, comoTexto) }}</span>
        </UBadge>
        <span v-else class="text-sm text-dimmed">{{ t.vazio }}</span>
      </template>
      <template #item-label="{ item }">
        <UBadge
          :color="((item as { cor?: string }).cor ?? 'neutral') as never"
          variant="subtle"
          size="sm"
        >
          {{ item.label }}
        </UBadge>
      </template>
    </USelectMenu>

    <URadioGroup
      v-else-if="campo.tipo === 'radioButton'"
      v-model="comoTexto"
      :items="lista.map(o => ({ label: o.label, value: o.value }))"
      size="sm"
    />

    <!--
      Seleção múltipla: os escolhidos viram selos com x DENTRO do campo e a
      lista fica aberta embaixo, com busca. Vai concatenando conforme cresce,
      como no exemplo do Figma. Escolher não fecha nada: o que salva é fechar
      o seletor.
    -->
    <div v-else-if="campo.tipo === 'multiSelect'" class="rounded-md border border-default">
      <div class="flex flex-wrap items-center gap-1 border-b border-default p-1.5">
        <UBadge
          v-for="v in escolhidos"
          :key="v"
          :color="corDaOpcao(lista, v) as never"
          variant="subtle"
          size="sm"
        >
          {{ rotuloDaOpcao(lista, v) }}
          <UIcon
            name="i-lucide-x"
            class="ml-0.5 size-3 cursor-pointer opacity-60 hover:opacity-100"
            :aria-label="t.remover"
            @click.stop="alternarOpcao(v)"
          />
        </UBadge>
        <UInput
          v-model="buscaDeOpcao"
          variant="none"
          size="sm"
          class="min-w-24 flex-1"
          :placeholder="t.buscarOpcao"
          @keydown.enter.prevent="criarOpcaoDaBusca()"
        />
      </div>
      <div class="max-h-44 overflow-y-auto p-1">
        <button
          v-for="o in opcoesFiltradas"
          :key="o.value"
          type="button"
          class="flex w-full items-center gap-2 rounded px-1.5 py-1 text-left transition-colors hover:bg-elevated"
          @click="alternarOpcao(o.value)"
        >
          <UIcon
            :name="escolhidos.includes(o.value) ? 'i-lucide-square-check-big' : 'i-lucide-square'"
            class="size-4 shrink-0"
            :class="escolhidos.includes(o.value) ? 'text-primary' : 'text-dimmed'"
          />
          <UBadge :color="(o.cor ?? 'neutral') as never" variant="subtle" size="sm">
            {{ o.label }}
          </UBadge>
        </button>
        <!--
          Criar a opção dali mesmo, que é o que o ClickUp e o Notion fazem. No
          nosso campo isso hoje exige ir na configuração, e é uma diferença de
          fluxo que vale discutir.
        -->
        <UButton
          v-if="podeCriarOpcao"
          icon="i-lucide-plus"
          color="primary"
          variant="ghost"
          size="xs"
          block
          class="justify-start"
          @click="criarOpcaoDaBusca()"
        >
          {{ t.criarOpcao }}: {{ buscaDeOpcao }}
        </UButton>
        <p v-else-if="!opcoesFiltradas.length" class="px-1.5 py-2 text-sm text-muted">
          {{ t.semResultado }}
        </p>
      </div>
    </div>

    <div v-else-if="campo.tipo === 'checkbox' || campo.tipo === 'EnlCheckbox'" class="space-y-2">
      <UCheckbox
        v-for="o in lista"
        :key="o.value"
        :model-value="((valor as string[]) ?? []).includes(o.value)"
        :label="o.label"
        size="sm"
        :ui="{ label: 'leading-snug' }"
        @update:model-value="(m: boolean | 'indeterminate') => emit('update:modelValue', m === true
          ? [...((valor as string[]) ?? []), o.value]
          : ((valor as string[]) ?? []).filter(v => v !== o.value))"
      />
    </div>

    <!--
      Tags: o mesmo desenho da seleção múltipla, sem a lista de opções, porque
      não existe lista: cada Enter cria uma tag nova. Uma por digitação.
    -->
    <UInputTags
      v-else-if="campo.tipo === 'EnlChips'"
      v-model="comoListaDeTexto"
      size="sm"
      class="w-full"
      :placeholder="t.umaTagPorEnter"
    />

    <USelectMenu
      v-else-if="campo.tipo === 'EnTreeSelect'"
      v-model="comoTexto"
      :items="lista.flatMap(o => [
        { label: o.label, value: o.value },
        ...((o as { children?: { label: string, value: string }[] }).children ?? []).map(c => ({ label: `  ${c.label}`, value: c.value })),
      ])"
      value-key="value"
      size="sm"
      class="w-full"
    />

    <!-- ──────────────────────────── booleano ────────────────────────────── -->
    <!--
      Alternativa binária: só o controle, sem rótulo ao lado. "Sim/Não" não é
      o nosso par: o campo tem um estado só, ligado ou desligado, e o rótulo
      de cima já diz de que se trata.
    -->
    <USwitch
      v-else-if="campo.tipo === 'inputSwitch'"
      v-model="comoBooleano"
      size="sm"
      :aria-label="rotuloDoTipo"
    />

    <!-- ──────────────────────────── data/hora ───────────────────────────── -->
    <!--
      Data: o calendário do sistema mais a fila de atalhos do ClickUp. O caso
      mais comum (hoje, amanhã, duas semanas) se resolve num clique, sem abrir
      calendário nenhum.
    -->
    <div v-else-if="campo.tipo === 'EnlCalendar'" class="space-y-1.5">
      <UInput
        :model-value="valor ? String(valor).slice(0, 10) : ''"
        type="date"
        size="sm"
        class="w-full"
        @update:model-value="(v: string | number) => emit('update:modelValue', v ? `${v}T12:00:00.000Z` : null)"
      />
      <div class="flex flex-wrap gap-1">
        <UButton
          v-for="a in atalhosDeData"
          :key="a.rotulo"
          :label="a.rotulo"
          color="neutral"
          variant="subtle"
          size="xs"
          @click="emit('update:modelValue', a.valor)"
        />
      </div>
    </div>

    <!--
      Duração: campo de texto, com os exemplos que o produto usa no
      placeholder. Não é par de datas. Ver BRIEFING.md, 6.3.
    -->
    <UInput
      v-else-if="campo.tipo === 'duracao'"
      v-model="comoTexto"
      size="sm"
      class="w-full"
      placeholder='Ex.: "1 dia", "2 semanas", "3 meses", "1 ano" ou "30 min"'
    />

    <UInput
      v-else-if="campo.tipo === 'valorDinamico'"
      :model-value="comoTexto"
      size="sm"
      class="w-full"
      icon="i-lucide-function-square"
      disabled
    />

    <!-- ──────────────────────────── relações ────────────────────────────── -->
    <!--
      Relação simples: busca no topo e o atalho de criar registro no PÉ da
      lista, dentro do próprio seletor, que é onde ele está no develop. O "+"
      solto do lado do campo saiu: ele não diz a que pertence e rouba um alvo
      de clique do controle.
    -->
    <USelectMenu
      v-else-if="campo.tipo === 'EnRel'"
      v-model="relacaoEscolhida"
      :items="opcoesDeRelacao"
      value-key="value"
      size="sm"
      class="w-full"
      :search-input="{ placeholder: t.pesquisar }"
    >
      <template #content-bottom>
        <div class="border-t border-default p-1">
          <UButton
            icon="i-lucide-plus"
            :label="t.criarRegistro"
            color="primary"
            variant="ghost"
            size="xs"
            block
            class="justify-start"
          />
        </div>
      </template>
    </USelectMenu>

    <USelectMenu
      v-else-if="campo.tipo === 'EnRelMulti'"
      v-model="relacoesEscolhidas"
      multiple
      :items="opcoesDeRelacao"
      value-key="value"
      size="sm"
      class="w-full"
      :search-input="{ placeholder: t.pesquisar }"
    >
      <template #content-bottom>
        <div class="border-t border-default p-1">
          <UButton
            icon="i-lucide-plus"
            :label="t.criarRegistro"
            color="primary"
            variant="ghost"
            size="xs"
            block
            class="justify-start"
          />
        </div>
      </template>
    </USelectMenu>

    <!-- ───────────────────────────── pessoa ─────────────────────────────── -->
    <div v-else-if="campo.tipo === 'EnPerson'" class="rounded-md border border-default p-3">
      <USelectMenu
        v-model="pessoaEscolhida"
        :items="membros.map(m => ({ label: m.nome, value: m.nome }))"
        value-key="value"
        size="sm"
        class="w-full"
      />
      <p class="mt-2 text-xs text-muted">
        {{ t.campos.EnPerson.formulario }}
      </p>
    </div>

    <!-- ──────────────────────────── endereço ────────────────────────────── -->
    <div v-else-if="campo.tipo === 'EnAddress'" class="grid grid-cols-6 gap-2 rounded-md border border-default p-3">
      <UInput
        :model-value="endereco.zip ?? ''"
        size="sm"
        class="col-span-2"
        placeholder="00000-000"
        @update:model-value="(v: string | number) => mudarSubcampo('zip', String(v))"
      />
      <UInput
        :model-value="endereco.street ?? ''"
        size="sm"
        class="col-span-4"
        @update:model-value="(v: string | number) => mudarSubcampo('street', String(v))"
      />
      <UInput
        :model-value="endereco.number ?? ''"
        size="sm"
        class="col-span-1"
        @update:model-value="(v: string | number) => mudarSubcampo('number', String(v))"
      />
      <UInput
        :model-value="endereco.complement ?? ''"
        size="sm"
        class="col-span-2"
        @update:model-value="(v: string | number) => mudarSubcampo('complement', String(v))"
      />
      <UInput
        :model-value="endereco.city ?? ''"
        size="sm"
        class="col-span-2"
        @update:model-value="(v: string | number) => mudarSubcampo('city', String(v))"
      />
      <UInput
        :model-value="endereco.state ?? ''"
        size="sm"
        class="col-span-1"
        @update:model-value="(v: string | number) => mudarSubcampo('state', String(v))"
      />
    </div>

    <!-- ──────────────────────────── arquivos ────────────────────────────── -->
    <!--
      ──────────────────────── anexos: o gerenciador ────────────────────────
      O documento do time de produtos lista o que a pessoa faz com um anexo:
      baixar, renomear, remover e REORDENAR, mais acrescentar outro. Eu tinha
      deixado só o botão de subir arquivo, e ela cobrou com razão. Agora cada
      item tem as cinco ações e a ordem é a que a pessoa definir.

      Reordenar é por subir e descer, e não por arrastar: arrastar dentro de
      uma camada flutuante sobre a célula é frágil, e o que está em discussão
      é a lista de ações, não a mecânica do arrasto. Está no DECISOES.md.
    -->
    <div
      v-else-if="campo.tipo === 'uploadFile' || campo.tipo === 'uploadImage' || campo.tipo === 'EnPDF'"
      class="rounded-md border border-default"
    >
      <p v-if="!anexos.length" class="px-3 py-4 text-center text-sm text-muted">
        {{ t.nenhumAnexo }}
      </p>

      <!--
        O desenho é o do Notion, visto no board dela em 23/09/2026: alça de
        arrasto na ESQUERDA, nome no meio, menu de três pontos na DIREITA com
        as ações. Eu tinha cinco botões em linha, que viram ruído a cada hover.
        O arrasto é o gesto principal; o menu guarda subir e descer, porque
        alça não serve para teclado.
      -->
      <div
        v-for="(a, i) in anexos"
        :key="a.url + i"
        class="group/anexo flex items-center gap-1.5 border-b border-default px-1.5 py-1.5 last:border-b-0"
        :class="arrastando === i ? 'opacity-40' : ''"
        draggable="true"
        @dragstart="comecarArrasto(i)"
        @dragover.prevent
        @drop.prevent="soltarEm(i)"
      >
        <UTooltip :text="t.arrasteParaReordenar">
          <span
            class="flex size-5 shrink-0 cursor-grab items-center justify-center text-dimmed opacity-0 transition-opacity group-hover/anexo:opacity-100"
            :aria-label="t.arrasteParaReordenar"
          >
            <UIcon name="i-lucide-grip-vertical" class="size-4" />
          </span>
        </UTooltip>

        <span
          v-if="campo.tipo === 'uploadImage'"
          class="flex size-8 shrink-0 items-center justify-center rounded bg-elevated"
        >
          <UIcon name="i-lucide-image" class="size-4 text-muted" />
        </span>
        <span
          v-else
          class="flex size-8 shrink-0 items-center justify-center rounded bg-elevated text-[9px] font-semibold uppercase text-muted"
        >
          {{ a.filename.split('.').at(-1) }}
        </span>

        <UInput
          v-if="renomeando === i"
          v-model="rascunhoDoNome"
          size="xs"
          class="min-w-0 flex-1"
          autofocus
          @blur="confirmarRenomeio()"
          @keydown.enter.stop="confirmarRenomeio()"
          @keydown.esc.stop="renomeando = null"
        />
        <span v-else class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ a.filename }}</span>

        <span v-if="a.size" class="shrink-0 text-xs text-muted">{{ formatarBytes(a.size, idioma) }}</span>

        <UDropdownMenu
          :items="[[
            { label: t.baixar, icon: 'i-lucide-download' },
            { label: t.renomear, icon: 'i-lucide-pencil', onSelect: () => abrirRenomeio(i) },
          ], [
            { label: t.moverParaCima, icon: 'i-lucide-chevron-up', disabled: i === 0, onSelect: () => moverAnexo(i, -1) },
            { label: t.moverParaBaixo, icon: 'i-lucide-chevron-down', disabled: i === anexos.length - 1, onSelect: () => moverAnexo(i, 1) },
          ], [
            { label: t.remover, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => removerAnexo(i) },
          ]]"
        >
          <UButton
            icon="i-lucide-ellipsis"
            color="neutral"
            variant="ghost"
            size="xs"
            class="shrink-0 opacity-0 transition-opacity group-hover/anexo:opacity-100"
            :aria-label="t.acoes"
          />
        </UDropdownMenu>
      </div>

      <div class="border-t border-default p-1.5">
        <UButton
          icon="i-lucide-upload"
          :label="t.adicionarAnexo"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="acrescentarAnexo"
        />
      </div>
    </div>

    <!--
      ─────────────────── anotações e chat: a conversa ────────────────────
      Os dois são conversa, e não caixa de texto: o campo abre o histórico e um
      compositor embaixo, com a fila de ações do exemplo do Figma. Vale na
      célula, na sidebar e no formulário, porque é o MESMO componente.
    -->
    <div
      v-else-if="campo.tipo === 'EnNotes' || campo.tipo === 'EnChats'"
      class="rounded-md border border-default"
    >
      <div class="max-h-56 space-y-3 overflow-y-auto p-2.5">
        <p v-if="!conversa.length" class="py-2 text-center text-sm text-muted">
          {{ t.semMensagens }}
        </p>
        <div v-for="(m, i) in conversa" :key="i" class="flex gap-2">
          <UAvatar :alt="m.author" size="2xs" class="mt-0.5 shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="flex items-baseline gap-1.5">
              <span class="truncate text-xs font-medium text-highlighted">{{ m.author }}</span>
              <span v-if="m.at" class="shrink-0 text-xs text-dimmed">
                {{ formatarDataHora(m.at, idioma) }}
              </span>
            </p>
            <p class="whitespace-pre-line text-sm text-toned">{{ m.text }}</p>
          </div>
        </div>
      </div>

      <div class="border-t border-default p-1.5">
        <UTextarea
          v-model="rascunhoDaMensagem"
          variant="none"
          size="sm"
          class="w-full"
          :rows="2"
          autoresize
          :placeholder="t.composerPlaceholder"
          @keydown.enter.exact.prevent="enviarMensagem()"
        />
        <div class="mt-1 flex items-center gap-0.5">
          <UTooltip v-for="a in acoesDoCompositor" :key="a.icone" :text="a.rotulo">
            <UButton :icon="a.icone" color="neutral" variant="ghost" size="xs" :aria-label="a.rotulo" />
          </UTooltip>
          <UButton
            class="ml-auto"
            icon="i-lucide-send"
            color="primary"
            size="xs"
            :aria-label="t.enviarMensagem"
            :disabled="!rascunhoDaMensagem.trim()"
            @click="enviarMensagem()"
          />
        </div>
      </div>
    </div>

    <div
      v-else-if="campo.tipo === 'EnESign'"
      class="flex h-20 items-center justify-center rounded-md border border-dashed border-default text-sm text-muted"
    >
      {{ t.campos.EnESign.formulario }}
    </div>

    <!-- ──────────────────────────── compostos ───────────────────────────── -->
    <div v-else-if="campo.tipo === 'EnRepeater'" class="rounded-md border border-default">
      <div
        v-for="(linha, i) in linhasDoRepetidor"
        :key="i"
        class="flex items-center gap-2 border-b border-default p-2 last:border-b-0"
      >
        <UInput
          :model-value="String(linha.item ?? '')"
          size="sm"
          class="min-w-0 flex-1"
          @update:model-value="(v: string | number) => mudarLinha(i, 'item', String(v))"
        />
        <UInput
          :model-value="Number(linha.quantidade ?? 0)"
          type="number"
          size="sm"
          class="w-20"
          @update:model-value="(v: string | number) => mudarLinha(i, 'quantidade', Number(v))"
        />
        <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" @click="removerLinha(i)" />
      </div>
      <div class="p-2">
        <UButton icon="i-lucide-plus" :label="t.criar" color="neutral" variant="ghost" size="xs" @click="acrescentarLinha" />
      </div>
    </div>

    <div v-else-if="campo.tipo === 'group'" class="space-y-2 rounded-md border border-default p-3">
      <UInput
        :model-value="(valor as Record<string, string>)?.login ?? ''"
        size="sm"
        class="w-full"
        placeholder="login"
        @update:model-value="(v: string | number) => mudarSubcampo('login', String(v))"
      />
      <UInput
        :model-value="(valor as Record<string, string>)?.telefone ?? ''"
        size="sm"
        class="w-full"
        placeholder="+55 11 0000-0000"
        @update:model-value="(v: string | number) => mudarSubcampo('telefone', String(v))"
      />
    </div>

    <div
      v-else
      class="flex items-center gap-2 rounded-md border border-dashed border-default px-3 py-2 text-sm text-muted"
    >
      <UIcon :name="campo.icone" class="size-4 shrink-0" />
      <span>{{ t.campos[campo.tipo].formulario }}</span>
    </div>

    <!--
      O que faz salvar. Ela pediu que ficasse claro em TODOS os campos, e é
      informação que muda por tipo: escolher já salva numa lista, mas um
      endereço precisa de confirmação. No formulário a dica fica embaixo do
      controle. Na célula ela não cabe (a linha tem altura fixa e corta o que
      passa), então quem a mostra é a barra da tabela, no alto.
    -->
    <div v-if="!semRotulo" class="mt-1 space-y-0.5">
      <p class="text-xs text-muted">{{ t.campos[campo.tipo].descricao }}</p>
      <p class="flex items-center gap-1 text-xs text-dimmed">
        <UIcon
          :name="campo.comoSalva === 'naoSeAplica' ? 'i-lucide-lock' : 'i-lucide-save'"
          class="size-3 shrink-0"
        />
        {{ t.comoSalvaTextos[campo.comoSalva] }}
      </p>
    </div>

    <!--
      A calculadora de correção monetária, copiada do develop: índice
      obrigatório, data inicial já preenchida com hoje, data final, e a chave
      de múltiplos períodos. MAQUETE: o Enviar fecha e não calcula nada.
      Declarado no DECISOES.md.
    -->
    <UModal v-model:open="calculadoraAberta" :title="t.correcaoMonetaria">
      <template #body>
        <div class="space-y-4">
          <div>
            <p class="mb-1 flex items-center gap-1 text-sm font-medium text-highlighted">
              <span class="text-error">*</span>
              {{ t.indiceOuAliquota }}
            </p>
            <USelectMenu
              v-model="correcao.indice"
              :items="indicesDeCorrecao"
              size="sm"
              class="w-full"
              :search-input="{ placeholder: t.pesquisar }"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="mb-1 text-sm font-medium text-highlighted">{{ t.dataInicial }}</p>
              <UInput v-model="correcao.inicio" type="date" size="sm" class="w-full" />
            </div>
            <div>
              <p class="mb-1 text-sm font-medium text-highlighted">{{ t.dataFinal }}</p>
              <UInput v-model="correcao.fim" type="date" size="sm" class="w-full" />
            </div>
          </div>

          <p v-if="!correcao.indice" class="text-xs text-muted">{{ t.selecioneIndice }}</p>

          <USwitch v-model="correcao.multiplos" :label="t.multiplosPeriodos" size="sm" />
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end">
          <UButton
            :label="t.enviar"
            color="primary"
            size="sm"
            :disabled="!correcao.indice"
            @click="calculadoraAberta = false"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

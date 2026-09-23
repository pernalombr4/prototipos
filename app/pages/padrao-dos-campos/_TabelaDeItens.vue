<script setup lang="ts">
/**
 * A tabela da tela nova de itens: o formato CÉLULA, e ele edita.
 *
 * A tabela em si é o `EnTable` do `@be-enlighten/enspace-sdk-ui` (regra 21):
 * colunas, ordenação, seleção, paginação e os slots `#cell-{key}`. O que a
 * proposta acrescenta é o CONTEÚDO de cada célula e o comportamento dela.
 *
 * ## Os três gestos da tabela
 *
 * | Gesto | O que faz |
 * |---|---|
 * | clique no valor da célula | entra em **edição ali mesmo** |
 * | clique no nome da coluna | abre a **ficha do tipo** |
 * | duplo clique na linha | abre a **visão rápida** do item |
 *
 * O duplo clique é o gesto do develop (medido em 22/09/2026). O clique único
 * para editar é a proposta: hoje a célula não edita.
 *
 * ## Onde a edição acontece
 *
 * Dentro da linha, quando o controle cabe na altura de uma linha. Em camada
 * flutuante, quando não cabe: texto longo, bloco de subcampos, lista de
 * caixas, anexo, repetidor. O que vai para cada lado está no catálogo, em
 * `edicaoEmPopover`, e a razão é a do documento do time de produtos: conteúdo
 * extenso não pode esticar a altura da linha.
 *
 * Campo que o sistema preenche (`somenteLeitura`) não entra em edição e não
 * ganha hover, porque hover que promete clique tem que entregar clique.
 *
 * A largura de cada coluna vem do catálogo (`campo.largura`), e é a mesma que
 * o dev vai usar.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui'
import type { Item } from '@be-enlighten/enspace-sdk-schemas'
import type { Campo } from './campos'
import type { Textos } from './textos'
import EntradaDoCampo from './_EntradaDoCampo.vue'
import ValorDoCampo from './_ValorDoCampo.vue'
import { estaVazio } from './formatacao'

const props = defineProps<{
  campos: Campo[]
  itens: Item[]
  t: Textos
  idioma: string
  total: number
  carregando?: boolean
  campoSelecionado?: string | null
}>()

const emit = defineEmits<{
  inspecionar: [tipo: string, item: Item]
  abrirItem: [item: Item]
  abrirTelaDoItem: [item: Item]
  editarValor: [item: Item, refId: string, valor: unknown]
  novoItem: []
  /** A linha de criação fechou com valor: nasce um item com esses dados. */
  criarNaLinha: [dados: Record<string, unknown>]
}>()

const selecionados = ref<Item[]>([])

/* -------------------------------------------------------------------------- *
 *                      O SALTO: a edição sai da tabela                       *
 * -------------------------------------------------------------------------- *
 *
 * Nenhum controle é montado DENTRO da linha. Clicar numa célula abre um quadro
 * que nasce ancorado nela e cresce para fora da tabela, por cima da grade.
 *
 * É o gesto do Notion, e é o que ela pediu com estas palavras: "a gente quer
 * fazer a area de ediçao pular pra fora da tabela quando clicado pra ediçao".
 * As três razões pelas quais ele ganha de editar dentro da célula:
 *
 * 1. a linha tem altura fixa. Dentro dela, tudo o que é maior que uma linha
 *    (lista de opções, conversa, lista de anexos) ou é cortado ou empurra a
 *    tabela inteira. Foi por isso que a dica de "o que salva" não apareceu na
 *    rodada anterior: a célula corta o que passa dela;
 * 2. o quadro tem cabeçalho e rodapé, então cabe o nome do campo e a frase de
 *    "o que salva" no lugar exato onde a pessoa está olhando;
 * 3. o quadro é UM só, com UM componente de entrada dentro. Campo simples e
 *    campo complexo passam pelo mesmo caminho, e é isso que o dev implementa
 *    uma vez.
 *
 * O canto superior esquerdo do quadro fica 8 px acima e à esquerda do canto da
 * célula, e por dentro o quadro tem 8 px de respiro: o valor continua desenhado
 * no MESMO ponto da tela em que estava, e o que muda é a moldura aparecendo em
 * volta. É esse detalhe que dá a sensação de zoom em vez de "abriu um popup".
 */

/** Qual célula está aberta para edição. Uma por vez. */
const emEdicao = ref<{ item: Item, refId: string } | null>(null)

/** A célula clicada, de onde sai a posição do quadro. */
const alvoDaEdicao = ref<HTMLElement | null>(null)
const retanguloDoAlvo = ref<DOMRect | null>(null)

function editando(item: Item, refId: string) {
  return emEdicao.value?.item.id === item.id && emEdicao.value?.refId === refId
}

function medirAlvo() {
  if (alvoDaEdicao.value) retanguloDoAlvo.value = alvoDaEdicao.value.getBoundingClientRect()
}

function abrirEdicao(campo: Campo, item: Item, alvo?: HTMLElement) {
  if (campo.somenteLeitura) return
  emEdicao.value = { item, refId: campo.refId }
  alvoDaEdicao.value = alvo ?? null
  medirAlvo()
}

/** O campo que está em edição agora. */
const campoEmEdicao = computed(
  () => props.campos.find(c => c.refId === emEdicao.value?.refId) ?? null,
)

/**
 * Onde o quadro se desenha. Ancorado na célula, com três limites: nunca sai da
 * janela, nunca fica mais estreito do que o campo pede e nunca nasce tão
 * embaixo que não sobre altura para o conteúdo.
 */
/*
 * Medido no Notion em 23/09/2026, com a célula de seleção múltipla: a célula
 * tinha 156x33 e o quadro nasceu em 300x104, ancorado a 2 px do canto da
 * célula. Ou seja: recuo quase nulo e largura mínima de 300. Uso 4 px, que é
 * o meio do caminho entre o recuo do Notion e o respiro que o nosso quadro
 * precisa por ter cabeçalho e rodapé.
 */
const RESPIRO = 4
const LARGURA_MINIMA = 300
const estiloDoSalto = computed(() => {
  const r = retanguloDoAlvo.value
  const campo = campoEmEdicao.value
  if (!r || !campo) return {}

  const larguraMinima = campo.saltoLargo ? 460 : Math.max(campo.largura, LARGURA_MINIMA)
  const largura = Math.min(
    Math.max(r.width + RESPIRO * 2, larguraMinima),
    window.innerWidth - RESPIRO * 4,
  )
  const esquerda = Math.min(
    Math.max(RESPIRO, r.left - RESPIRO),
    Math.max(RESPIRO, window.innerWidth - largura - RESPIRO * 2),
  )
  const topo = Math.min(
    Math.max(RESPIRO, r.top - RESPIRO),
    Math.max(RESPIRO, window.innerHeight - 220),
  )

  return {
    left: `${esquerda}px`,
    top: `${topo}px`,
    width: `${largura}px`,
    maxHeight: `${window.innerHeight - topo - RESPIRO * 2}px`,
  }
})

function fecharEdicao() {
  emEdicao.value = null
  alvoDaEdicao.value = null
  retanguloDoAlvo.value = null
}

/** Rolar ou redimensionar reancora o quadro, em vez de deixá-lo órfão. */
onMounted(() => {
  window.addEventListener('scroll', medirAlvo, true)
  window.addEventListener('resize', medirAlvo)
  onUnmounted(() => {
    window.removeEventListener('scroll', medirAlvo, true)
    window.removeEventListener('resize', medirAlvo)
  })
})

/* -------------------------------------------------------------------------- *
 *                   A LINHA DE CRIAÇÃO, no TOPO da tabela                    *
 * -------------------------------------------------------------------------- *
 *
 * O ClickUp deixa criar tarefa digitando na própria grade, e ela pediu o mesmo
 * aqui com uma diferença: na PRIMEIRA linha, não na última. A razão é boa: numa
 * tabela paginada de 248 itens, a última linha da PÁGINA não é o fim de nada, e
 * o item recém-criado aparece longe de onde se olhou. No topo, o item nasce
 * onde o olho já está.
 *
 * A linha é uma linha de verdade da tabela, com as mesmas colunas e as mesmas
 * larguras, e as células dela abrem o MESMO quadro de edição das outras. O que
 * muda é que o valor vai para um rascunho, e o rascunho só vira item no Enter
 * ou no botão Criar.
 */
const ID_DA_LINHA_NOVA = -1
const rascunhoDaLinha = ref<Record<string, unknown>>({})

const linhaNova = computed(() => ({
  id: ID_DA_LINHA_NOVA,
  reference: '',
  status: 'active',
  data: rascunhoDaLinha.value,
  created_at: '',
  updated_at: '',
} as unknown as Item))

/** A linha de criação vem antes dos itens, sempre. */
const linhas = computed<Item[]>(() => [linhaNova.value, ...props.itens])

function ehLinhaNova(item: Item) {
  return item.id === ID_DA_LINHA_NOVA
}

const temRascunho = computed(
  () => Object.values(rascunhoDaLinha.value).some(v => !estaVazio(v)),
)

/**
 * Onde o valor editado é gravado. Na linha de criação ele fica no rascunho; na
 * linha de um item ele sobe para quem manda na lista. O quadro de edição não
 * sabe a diferença, e é isso que mantém um caminho só.
 */
function gravarValor(item: Item, refId: string, valor: unknown) {
  if (ehLinhaNova(item)) {
    rascunhoDaLinha.value = { ...rascunhoDaLinha.value, [refId]: valor }
    return
  }
  emit('editarValor', item, refId, valor)
}

/**
 * Criar e continuar. Medido no ClickUp em 23/09/2026: o Enter cria a tarefa e
 * o compositor FICA ABERTO, já pronto para a próxima. Quem está lançando cinco
 * registros não quer clicar de novo na linha a cada um. Aqui o quadro fica
 * aberto no mesmo campo, vazio, e só fecha no Esc ou no clique fora.
 */
function criarDaLinha() {
  if (!temRascunho.value) return
  emit('criarNaLinha', { ...rascunhoDaLinha.value })
  rascunhoDaLinha.value = {}
  /* O alvo continua sendo a célula da linha nova, que segue no mesmo lugar. */
  nextTick(medirAlvo)
}

/** O convite da linha nova abre o primeiro campo que a pessoa preenche. */
function abrirPrimeiroCampo(e: MouseEvent) {
  const campo = props.campos.find(c => !c.somenteLeitura)
  if (!campo) return
  const alvo = e.currentTarget as HTMLElement
  abrirEdicao(campo, linhaNova.value, alvo.closest('td') ?? alvo)
}

function descartarRascunho() {
  rascunhoDaLinha.value = {}
  fecharEdicao()
}

/**
 * Limpar o campo, no cabeçalho do quadro. É o gesto que o ClickUp põe nos
 * popups dele, e faz falta: sem ele, tirar um valor de um seletor obriga a
 * desmarcar opção por opção.
 */
function limparCampo() {
  const estado = emEdicao.value
  const campo = campoEmEdicao.value
  if (!estado || !campo) return
  /* Campo que guarda lista volta para lista vazia; os outros, para nulo. */
  const deLista = ['multiSelect', 'checkbox', 'EnlCheckbox', 'EnlChips', 'EnRelMulti', 'uploadFile', 'uploadImage', 'EnPDF', 'EnNotes']
  const vazio = deLista.includes(campo.tipo) ? [] : null
  gravarValor(estado.item, campo.refId, vazio)
}

const temValorNoQuadro = computed(() => {
  const estado = emEdicao.value
  const campo = campoEmEdicao.value
  if (!estado || !campo) return false
  return !estaVazio((estado.item.data as Record<string, unknown>)?.[campo.refId])
})

/** Enter na linha de criação cria. Nas outras, só fecha o quadro. */
function aoSairDoQuadro() {
  const item = emEdicao.value?.item
  if (item && ehLinhaNova(item)) criarDaLinha()
  else fecharEdicao()
}

/* Esc fecha a edição da célula sem desfazer, antes de qualquer outro Esc. */
onMounted(() => {
  const aoTeclar = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && emEdicao.value) {
      e.stopPropagation()
      fecharEdicao()
    }
  }
  window.addEventListener('keydown', aoTeclar, true)
  onUnmounted(() => window.removeEventListener('keydown', aoTeclar, true))
})

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.referencia, sortable: true },
  ...props.campos.map(c => ({
    key: c.refId,
    label: props.t.campos[c.tipo].rotulo,
    sortable: true,
    align: (c.alinhamento === 'fim' ? 'right' : 'left') as 'left' | 'right',
  })),
])

const larguras = computed(() =>
  Object.fromEntries([
    ['reference', 260],
    ...props.campos.map(c => [c.refId, c.largura]),
  ]),
)

const paginacao = computed(() => ({
  page: 1,
  pageCount: Math.max(1, Math.ceil(props.total / 100)),
  total: props.total,
}))

const copiado = ref<string | null>(null)
async function copiarReferencia(referencia: string) {
  try {
    await navigator.clipboard.writeText(referencia)
    copiado.value = referencia
    setTimeout(() => { copiado.value = null }, 1400)
  }
  catch { /* sem área de transferência: silêncio */ }
}

function menuDaLinha(item: Item) {
  return [
    [
      { label: props.t.verDetalhes, icon: 'i-lucide-eye', onSelect: () => emit('abrirItem', item) },
      { label: props.t.editar, icon: 'i-lucide-pencil', onSelect: () => emit('abrirTelaDoItem', item) },
    ],
    [
      { label: props.t.enviarParaLixeira, icon: 'i-lucide-trash-2', color: 'error' as const },
      { label: props.t.copiarLink, icon: 'i-lucide-link', onSelect: () => copiarReferencia(item.reference) },
    ],
  ]
}

/**
 * Dois gestos que são da LINHA e do CABEÇALHO, não da célula, e por isso são
 * ligados no DOM que o `EnTable` monta:
 *
 * - duplo clique na linha abre a visão rápida, como no develop;
 * - clique no rótulo da coluna abre a ficha daquele tipo.
 */
const raiz = ref<HTMLElement | null>(null)

onMounted(() => nextTick(() => {
  const tabela = raiz.value?.querySelector('table')
  if (!tabela) return

  tabela.addEventListener('dblclick', (e) => {
    const linha = (e.target as HTMLElement).closest('tbody tr')
    if (!linha) return
    const i = [...(linha.parentElement?.children ?? [])].indexOf(linha)
    /* A linha 0 é a de criação: os itens começam na 1. */
    const item = props.itens[i - 1]
    if (!item) return
    /* O primeiro clique do duplo já abriu a célula em edição: ela fecha, para
       a quickview não nascer com um controle aberto atrás dela. */
    fecharEdicao()
    emit('abrirItem', item)
  })

  tabela.addEventListener('click', (e) => {
    const th = (e.target as HTMLElement).closest('thead th')
    if (!th) return
    const i = [...(th.parentElement?.children ?? [])].indexOf(th)
    /* A coluna 0 é a seleção e a 1 é a referência: as duas não são campo. */
    const campo = props.campos[i - 2]
    if (campo) emit('inspecionar', campo.tipo, props.itens[0]!)
  })
}))
</script>

<template>
  <!--
    A barra de ferramentas é cópia do develop: busca, os dois filtros de data,
    os quatro ícones e o botão primário. O relatório de verdade está no
    andaime, para não se confundir com o Exportar que o produto já tem.
  -->
  <div class="flex shrink-0 flex-wrap items-center gap-1 border-b border-default px-3 py-2">
    <UInput
      icon="i-lucide-search"
      :placeholder="t.pesquisar"
      variant="none"
      size="sm"
      class="w-56"
    />
    <UButton icon="i-lucide-calendar" :label="t.criadoEm" color="neutral" variant="ghost" size="sm" />
    <UButton icon="i-lucide-filter" :label="t.todoPeriodo" color="neutral" variant="ghost" size="sm" />


    <div class="ml-auto flex items-center gap-0.5">
      <UTooltip :text="t.exportar">
        <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.exportar" />
      </UTooltip>
      <UTooltip :text="t.colunas">
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.colunas" />
      </UTooltip>
      <UTooltip :text="t.densidade">
        <UButton icon="i-lucide-settings-2" color="neutral" variant="ghost" size="sm" :aria-label="t.densidade" />
      </UTooltip>
      <UTooltip :text="t.maisOpcoes">
        <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" :aria-label="t.maisOpcoes" />
      </UTooltip>
      <UButton
        icon="i-lucide-plus"
        :label="t.novoRegistro"
        color="primary"
        variant="soft"
        size="sm"
        class="ml-1"
        @click="emit('novoItem')"
      />
    </div>
  </div>

  <!-- ─────────────────────────────── a tabela ─────────────────────────── -->
  <div ref="raiz" class="min-h-0 flex-1 overflow-auto">
    <EnTable
      v-model:selected="selecionados"
      :columns="colunas"
      :rows="linhas"
      :loading="carregando"
      selectable
      resizable
      :column-sizing="larguras"
      :pagination="paginacao"
      :locale="idioma === 'pt-BR' ? 'pt-BR' : idioma === 'es' ? 'es' : 'en'"
    >
      <!-- A referência é o identificador, e o produto a mostra como selo copiável -->
      <template #cell-reference="{ row }">
        <!--
          A linha de criação não tem referência: ela tem o convite. Enquanto o
          rascunho está vazio o texto explica o gesto; com valor, aparece o
          Criar e o descartar.
        -->
        <div v-if="ehLinhaNova(row as Item)" class="flex items-center gap-1.5">
          <UIcon name="i-lucide-plus" class="size-4 shrink-0 text-primary" />
          <!--
            O convite é clicável: ele abre o quadro do PRIMEIRO campo que se
            preenche, que é o que o ClickUp faz quando a pessoa clica na linha
            nova. Sem isso, o convite seria um texto que não faz nada.
          -->
          <button
            v-if="!temRascunho"
            type="button"
            class="min-w-0 flex-1 truncate text-left text-sm text-muted hover:text-highlighted"
            @click.stop="abrirPrimeiroCampo($event)"
          >
            {{ t.criarNaLinha }}
          </button>
          <template v-else>
            <UButton :label="t.criar" color="primary" size="xs" @click.stop="criarDaLinha()" />
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="t.descartar"
              @click.stop="descartarRascunho()"
            />
          </template>
        </div>

        <!--
          O botão de ABRIR no hover da célula da referência. É o "OPEN" que o
          Notion mostra ao passar o mouse na linha (visto no board dela em
          23/09/2026), e resolve um problema do nosso desenho: abrir o item
          dependia de duplo clique, que é gesto invisível. O duplo clique
          continua valendo para quem já sabe.
        -->
        <div v-else class="group/ref flex items-center gap-1.5">
          <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">
            {{ (row as Item).reference }}
          </UBadge>
          <UButton
            :icon="copiado === (row as Item).reference ? 'i-lucide-check' : 'i-lucide-copy'"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t.copiar"
            @click.stop="copiarReferencia((row as Item).reference)"
          />
          <UButton
            icon="i-lucide-maximize-2"
            :label="t.abrir"
            color="neutral"
            variant="subtle"
            size="xs"
            class="shrink-0 opacity-0 transition-opacity group-hover/ref:opacity-100"
            @click.stop="emit('abrirItem', row as Item)"
          />
          <UBadge v-if="(row as Item).isDraft" color="warning" variant="subtle" size="sm">
            {{ t.rascunho }}
          </UBadge>
          <UBadge v-else-if="(row as Item).status === 'inactive'" color="neutral" variant="soft" size="sm">
            {{ t.inativo }}
          </UBadge>
        </div>
      </template>

      <!--
        Uma célula por tipo, todas passando pelos mesmos dois componentes: o de
        leitura e o de escrita. É isso que garante que o número esteja à direita
        na tabela inteira e que editar na célula seja o MESMO controle do
        formulário, e não um primo parecido.
      -->
      <template
        v-for="campo in campos"
        :key="campo.refId"
        #[`cell-${campo.refId}`]="{ row }"
      >
        <!--
          A célula NUNCA monta controle. Ela mostra o valor e, no clique, abre
          o quadro que salta para fora da tabela. Vale igual para a linha de
          criação: lá o mesmo quadro escreve no rascunho.
        -->
        <div
          :class="[
            campoSelecionado === campo.tipo ? 'rounded ring-1 ring-primary/40' : '',
            editando(row as Item, campo.refId) ? 'rounded bg-primary/5' : '',
          ]"
        >
          <ValorDoCampo
            :campo="campo"
            :valor="((row as Item).data as Record<string, unknown>)?.[campo.refId]"
            formato="celula"
            :t="t"
            :idioma="idioma"
            @editar="(alvo?: HTMLElement) => abrirEdicao(campo, row as Item, alvo)"
            @alternar="(v: unknown) => gravarValor(row as Item, campo.refId, v)"
          />
        </div>
      </template>

      <template #actions="{ row }">
        <UTooltip v-if="ehLinhaNova(row as Item)" :text="t.criarNaLinha">
          <UButton
            icon="i-lucide-corner-down-left"
            color="primary"
            variant="ghost"
            size="xs"
            :disabled="!temRascunho"
            :aria-label="t.criar"
            @click.stop="criarDaLinha()"
          />
        </UTooltip>

        <UDropdownMenu v-else :items="menuDaLinha(row as Item)">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t.acoes"
          />
        </UDropdownMenu>
      </template>

      <template #empty>
        <UEmpty
          icon="i-lucide-table-2"
          :title="t.semItensTitulo"
          :description="t.semItensTexto"
        >
          <template #actions>
            <UButton
              icon="i-lucide-plus"
              :label="t.semItensAcao"
              color="primary"
              variant="soft"
              size="sm"
              @click="emit('novoItem')"
            />
          </template>
        </UEmpty>
      </template>
    </EnTable>
  </div>

  <!--
    ══════════════════ O QUADRO QUE SALTA PARA FORA ══════════════════════
    Ele mora em `body` (Teleport) por um motivo prático: dentro da tabela ele
    seria cortado pelo `overflow` da célula e pelo da área de rolagem, que é
    o que aconteceu com a dica de "o que salva" na rodada passada.

    A camada de fundo é transparente e serve de alvo do clique fora. O quadro
    tem três faixas: o nome do campo em cima, o controle no meio e, embaixo, a
    frase de o que salva com o botão que fecha.
  -->
  <Teleport to="body">
    <div
      v-if="emEdicao && campoEmEdicao && retanguloDoAlvo"
      class="fixed inset-0 z-40"
      @mousedown.self="fecharEdicao()"
    >
      <div
        class="salto absolute flex flex-col rounded-lg border border-default bg-default p-2 shadow-2xl"
        :style="estiloDoSalto"
        role="dialog"
        :aria-label="t.campos[campoEmEdicao.tipo].rotulo"
      >
        <p class="mb-1.5 flex items-center gap-1.5 px-0.5 text-[11px] font-semibold uppercase tracking-wide text-dimmed">
          <UIcon :name="campoEmEdicao.icone" class="size-3 shrink-0" />
          <span class="truncate">{{ t.campos[campoEmEdicao.tipo].rotulo }}</span>
          <UBadge v-if="ehLinhaNova(emEdicao.item)" color="primary" variant="subtle" size="sm">
            {{ t.novoRegistro }}
          </UBadge>
          <UTooltip v-if="temValorNoQuadro" :text="t.limparCampo" class="ml-auto">
            <UButton
              icon="i-lucide-eraser"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="t.limparCampo"
              @click="limparCampo()"
            />
          </UTooltip>
        </p>

        <div class="min-h-0 flex-1 overflow-y-auto px-0.5">
          <EntradaDoCampo
            :campo="campoEmEdicao"
            :model-value="(emEdicao.item.data as Record<string, unknown>)?.[campoEmEdicao.refId]"
            :t="t"
            :idioma="idioma"
            sem-rotulo
            autofoco
            @update:model-value="(v: unknown) => gravarValor(emEdicao!.item, campoEmEdicao!.refId, v)"
            @sair="aoSairDoQuadro()"
          />
        </div>

        <!--
          O rodapé do quadro, com três coisas: o que salva, o atalho para a
          ficha do campo e o botão que fecha.

          O atalho para a ficha é o "Edit property" que o Notion põe no pé do
          editor de célula (visto no board dela em 23/09/2026). Faz sentido:
          quem está preenchendo é quem descobre que a regra do campo está
          errada, e o caminho até a configuração não devia passar por outra
          tela.
        -->
        <div class="mt-1.5 flex items-center gap-2 border-t border-default px-0.5 pt-1.5">
          <UTooltip :text="t.fichaTitulo">
            <UButton
              icon="i-lucide-settings-2"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="t.fichaTitulo"
              @click="emit('inspecionar', campoEmEdicao.tipo, emEdicao.item); fecharEdicao()"
            />
          </UTooltip>
          <p class="flex min-w-0 items-center gap-1 text-[11px] text-dimmed">
            <UIcon
              :name="campoEmEdicao.comoSalva === 'naoSeAplica' ? 'i-lucide-lock' : 'i-lucide-save'"
              class="size-3 shrink-0"
            />
            <span class="truncate">
              {{ ehLinhaNova(emEdicao.item) ? t.enterCria : t.comoSalvaTextos[campoEmEdicao.comoSalva] }}
            </span>
          </p>
          <UButton
            v-if="ehLinhaNova(emEdicao.item)"
            class="ml-auto"
            :label="t.criar"
            color="primary"
            size="xs"
            :disabled="!temRascunho"
            @click="criarDaLinha()"
          />
          <UButton
            v-else-if="campoEmEdicao.comoSalva === 'confirmar'"
            class="ml-auto"
            :label="t.confirmar"
            color="primary"
            size="xs"
            @click="fecharEdicao()"
          />
          <UButton
            v-else
            class="ml-auto"
            :label="t.fechar"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="fecharEdicao()"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/*
 * O zoom. O quadro nasce quase do tamanho da célula e cresce a partir do canto
 * superior esquerdo, que é o canto que ficou ancorado. São 140 ms: o suficiente
 * para o olho ver de onde a moldura veio, e pouco para não atrasar a digitação.
 */
.salto {
  animation: salto 140ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top left;
}

@keyframes salto {
  from {
    opacity: 0.5;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .salto {
    animation: none;
  }
}
</style>

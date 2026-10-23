<script setup lang="ts">
/**
 * PROPOSTA: o painel "Configurar visualização", à direita da tabela.
 *
 * Substitui o modal de hoje, que cobre a tabela, abre outro modal por filtro e
 * promete um preview que não aparece. Aqui o painel não cobre nada: a tabela
 * encolhe e cada ajuste aparece nela na hora (o preview é a própria tabela).
 *
 * O painel mexe num RASCUNHO da visualização ativa. Salvar grava; Descartar
 * volta ao salvo; fechar o painel mantém o rascunho na tela, com o ponto de
 * "não salva" na pílula, como o filtro mexido pela barra de ferramentas.
 *
 * Na implementação, este é o `inspector` do `EnLayout` (variant
 * `sidebar-right`). Aqui é uma coluna dentro do conteúdo, para o protótipo
 * controlar abrir e fechar.
 */
import type { FiltroDeCampo, GrupoDeRegras, Ordenacao, Visualizacao } from './mocks'
import type { Textos } from './textos'

type Escopo = 'todos' | 'eu' | 'propria' | 'nova'
import { CAMPOS, FUNCOES, GRUPOS, ICONE_DO_TIPO, campoPorPath, clonar } from './mocks'
import { campoLivre, regraNova } from './filtros'
import RegraDeFiltro from './_RegraDeFiltro.vue'
import ConstrutorDeRegras from './_ConstrutorDeRegras.vue'

const props = defineProps<{
  t: Textos
  modificada: boolean
  salvando: boolean
  /** O que salvar oferece para esta pessoa e esta visualização (ver `opcoesDeSalvar` no index). */
  opcoesSalvar: { principal: { escopo: Escopo, label: string }, extras: { escopo: Escopo, label: string, icon: string }[] }
  /** Owner ou Full: muda quem vê. Standard ou Viewer cria e salva só para si. */
  ehOwner: boolean
  /** Modo de criação (a visualização tem `novo`): o botão Concluir e os nomes que já existem. */
  criando: boolean
  nomesExistentes: string[]
}>()

const rascunho = defineModel<Visualizacao>({ required: true })

const emit = defineEmits<{
  salvar: [escopo: Escopo]
  descartar: []
  fechar: []
  criar: []
  cancelarCriacao: []
}>()

const emCriacao = computed(() => !!rascunho.value.novo)

/* Criar só com nome, e nome que ainda não existe na categoria. O erro aparece depois da 1ª tentativa. */
const tentouCriar = ref(false)
watch(() => rascunho.value.reference, () => { tentouCriar.value = false })
const erroDoNome = computed(() => {
  if (!emCriacao.value || !tentouCriar.value) return undefined
  const nome = (rascunho.value.name ?? '').trim()
  if (!nome) return props.t.criar.nomeObrigatorio
  return props.nomesExistentes.some(n => n.toLowerCase() === nome.toLowerCase()) ? props.t.criar.nomeRepetido : undefined
})
const campoNome = ref<{ inputRef: HTMLInputElement } | null>(null)
/* Ao criar, o nome do tipo vem selecionado, como no ClickUp: digitar já troca. */
watch([() => rascunho.value.reference, emCriacao], () => {
  if (emCriacao.value) nextTick(() => { campoNome.value?.inputRef?.focus(); campoNome.value?.inputRef?.select() })
}, { immediate: true })

function criar() {
  tentouCriar.value = true
  if (erroDoNome.value) {
    campoNome.value?.inputRef?.focus()
    return
  }
  emit('criar')
}

/** Atualiza o rascunho sem mutar o objeto (o pai compara com o salvo). */
function mudar(fn: (v: Visualizacao) => void) {
  const copia = clonar(rascunho.value)
  fn(copia)
  rascunho.value = copia
}

/* ---------- nome, ícone e tipo ---------- */

const iconeAberto = ref(false)
const iconeSemPrefixo = computed({
  get: () => (rascunho.value.icon ?? 'i-lucide-table').replace(/^i-lucide-/, ''),
  set: (v: string) => {
    mudar(x => { x.icon = `i-lucide-${v}` })
    iconeAberto.value = false
  },
})

const camposDeAgrupar = computed(() => CAMPOS.filter(c => c.tipo === 'selecao').map(c => ({ label: c.label, value: c.path })))

/*
 * Cartão do kanban (rodada 3): o construtor de hoje tem "Construtor visual de cartão" com cabeçalho, conteúdo,
 * tags, utilizador e data. Aqui são 5 campos com nome de gente, gravados no `config.cardConfig` do schema.
 */
const NENHUM = '__nenhum'
const opcoesDe = (tipos: string[], comNenhum = true) => [
  ...(comNenhum ? [{ label: props.t.painel.cartaoNenhum, value: NENHUM }] : []),
  ...CAMPOS.filter(c => tipos.includes(c.tipo)).map(c => ({ label: c.label, value: c.path, icon: ICONE_DO_TIPO[c.tipo] })),
]
const cartao = computed(() => rascunho.value.config.cardConfig ?? {})
function mudarCartao(chave: 'header' | 'content' | 'userField' | 'dueDateField', valor: string) {
  mudar((x) => { x.config.cardConfig = { ...(x.config.cardConfig ?? {}), [chave]: valor === NENHUM ? undefined : valor } })
}
const etiquetas = computed({
  get: () => (cartao.value.tags ?? []).map(t => t.field),
  set: (v: string[]) => mudar((x) => { x.config.cardConfig = { ...(x.config.cardConfig ?? {}), tags: v.map(field => ({ field })) } }),
})

/* ---------- colunas ---------- */

const visiveis = computed(() => (rascunho.value.config.columns ?? []).map(c => c.path))
const ocultas = computed(() => CAMPOS.filter(c => !visiveis.value.includes(c.path)).map(c => c.path))
const buscaColuna = ref('')
const casaBusca = (path: string) => !buscaColuna.value.trim() || campoPorPath(path)!.label.toLowerCase().includes(buscaColuna.value.trim().toLowerCase())

function alternarColuna(path: string) {
  mudar((x) => {
    const cols = x.config.columns ?? []
    x.config.columns = cols.some(c => c.path === path)
      ? cols.filter(c => c.path !== path)
      : [...cols, { path, label: campoPorPath(path)!.label }]
  })
}

function moverColuna(de: number, para: number) {
  if (para < 0 || para >= visiveis.value.length || de === para) return
  mudar((x) => {
    const cols = [...(x.config.columns ?? [])]
    const [c] = cols.splice(de, 1)
    cols.splice(para, 0, c!)
    x.config.columns = cols
  })
}

/* Arrastar colunas: drag and drop nativo do navegador, com a linha-guia onde a coluna vai cair. */
const arrastandoColuna = ref<number | null>(null)
const alvoColuna = ref<number | null>(null)

function soltarColuna() {
  if (arrastandoColuna.value !== null && alvoColuna.value !== null) {
    const para = alvoColuna.value > arrastandoColuna.value ? alvoColuna.value - 1 : alvoColuna.value
    moverColuna(arrastandoColuna.value, para)
  }
  arrastandoColuna.value = null
  alvoColuna.value = null
}

/* ---------- filtros ---------- */

const rapidos = computed(() => (rascunho.value.filters.quick_filters ?? []).map(q => q.filter))

function alternarRapido(filtro: 'isOwner' | 'inGroups', ligado: boolean) {
  mudar((x) => {
    const lista = (x.filters.quick_filters ?? []).filter(q => q.filter !== filtro)
    x.filters.quick_filters = ligado ? [...lista, { filter: filtro, required: true }] : lista
  })
}

/* Rodada 5: a regra usa o operador e o valor do tipo do campo (`filtros.ts`), o mesmo da linha de filtros. */
function novoFiltro() {
  const usados = (rascunho.value.filters.field_filters ?? []).map(f => f.field)
  mudar((x) => { x.filters.field_filters = [...(x.filters.field_filters ?? []), regraNova(campoLivre(usados).path)] })
}

function mudarFiltro(i: number, r: FiltroDeCampo) {
  mudar((x) => { x.filters.field_filters = (x.filters.field_filters ?? []).map((f, j) => j === i ? r : f) })
}

function tirarFiltro(i: number) {
  mudar((x) => { x.filters.field_filters = (x.filters.field_filters ?? []).filter((_, j) => j !== i) })
}

function novoAvancado() {
  const usados = (rascunho.value.filters.field_filters ?? []).map(f => f.field)
  mudar((x) => { x.filters.avancado = { conector: 'and', regras: [regraNova(campoLivre(usados).path)] } })
}

/* ---------- ordenação ---------- */

const ordenacoes = computed<Ordenacao[]>(() => rascunho.value.config.sorts ?? [])

function novaOrdenacao() {
  const usado = ordenacoes.value.map(o => o.field)
  const campo = CAMPOS.find(c => !usado.includes(c.path))
  if (!campo) return
  mudar((x) => { x.config.sorts = [...(x.config.sorts ?? []), { field: campo.path, direction: 'asc' }] })
}

function mudarOrdenacao(i: number, parte: Partial<Ordenacao>) {
  mudar((x) => {
    const lista = [...(x.config.sorts ?? [])]
    lista[i] = { ...lista[i]!, ...parte }
    x.config.sorts = lista
  })
}

function tirarOrdenacao(i: number) {
  mudar((x) => { x.config.sorts = (x.config.sorts ?? []).filter((_, j) => j !== i) })
}

/* ---------- quem vê ---------- */

const quemVe = computed({
  get: () => rascunho.value.user ? 'eu' : (rascunho.value.module_groups?.length || rascunho.value.roles?.length) ? 'grupos' : 'todos',
  set: (v: string) => mudar((x) => {
    x.user = v === 'eu' ? 7 : null
    if (v !== 'grupos') {
      x.module_groups = null
      x.roles = null
    }
    else if (!x.module_groups?.length) {
      x.module_groups = [GRUPOS[0]!.id]
    }
  }),
})

/** Standard ou Viewer: só "Só eu"; as outras opções aparecem desligadas, para mostrar que existem. */
const opcoesQuemVe = computed(() => [
  { value: 'todos', label: props.t.painel.quemVeTodos, description: props.t.painel.quemVeTodosAjuda, disabled: !props.ehOwner },
  { value: 'eu', label: props.t.painel.quemVeEu, description: props.t.painel.quemVeEuAjuda },
  { value: 'grupos', label: props.t.painel.quemVeGrupos, description: props.t.painel.quemVeGruposAjuda, disabled: !props.ehOwner },
])
/** Quem não é Owner ou Full só muda quem vê na visualização que é dele. */
const quemVeTravado = computed(() => !props.ehOwner && rascunho.value.user !== 7)

const grupos = computed({
  get: () => rascunho.value.module_groups ?? [],
  set: (v: number[]) => mudar((x) => { x.module_groups = v }),
})
const funcoes = computed({
  get: () => rascunho.value.roles ?? [],
  set: (v: number[]) => mudar((x) => { x.roles = v }),
})
</script>


<template>
  <aside class="flex h-full w-96 shrink-0 flex-col border-l border-default bg-default" :aria-label="t.painel.titulo">
    <header class="flex items-start gap-2 border-b border-default px-4 py-3">
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-highlighted">{{ emCriacao ? t.painel.tituloCriar : t.painel.titulo }}</p>
        <p class="text-xs text-muted">{{ emCriacao ? t.painel.subtituloCriar : t.painel.subtitulo }}</p>
      </div>
      <!-- Ao criar, fechar conclui (a visualização já existe), depois de conferir o nome. -->
      <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.comum.fechar" @click="emCriacao ? criar() : emit('fechar')" />
    </header>

    <!-- Uma seção por bloco, separadas por linha; rótulo sempre em cima do campo. -->
    <div class="min-h-0 flex-1 divide-y divide-default overflow-y-auto">
      <!-- Nome, ícone e descrição -->
      <section class="space-y-3 p-4">
        <UFormField :label="t.painel.nome" :error="erroDoNome" :required="emCriacao">
          <UFieldGroup class="w-full">
            <UPopover v-model:open="iconeAberto" :content="{ align: 'start' }">
              <UButton
                :icon="rascunho.icon ?? 'i-lucide-table'"
                color="neutral"
                variant="outline"
                :aria-label="t.painel.trocarIcone"
              />
              <template #content>
                <div class="w-80 p-3">
                  <UxSeletorDeIcones v-model="iconeSemPrefixo" :altura="220" />
                </div>
              </template>
            </UPopover>
            <UInput
              ref="campoNome"
              :model-value="rascunho.name ?? ''"
              :placeholder="emCriacao ? t.criar.nomeExemplo : undefined"
              :autofocus="emCriacao"
              class="flex-1"
              @update:model-value="(v: string) => mudar(x => { x.name = v })"
              @keydown.enter.prevent="emCriacao && criar()"
            />
          </UFieldGroup>
        </UFormField>
        <UFormField :label="t.painel.descricao" :hint="t.comum.opcional">
          <UTextarea
            :model-value="rascunho.description ?? ''"
            :rows="2"
            :placeholder="t.painel.descricaoExemplo"
            class="w-full"
            @update:model-value="(v: string) => mudar(x => { x.description = v || null })"
          />
        </UFormField>
      </section>

      <!-- Exibição -->
      <section class="space-y-3 p-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.painel.exibicao }}</h3>
        <UFieldGroup class="w-full">
          <UButton
            v-for="o in [{ v: 'table' as const, l: t.criar.tabela, i: 'i-lucide-table' }, { v: 'kanban' as const, l: t.criar.kanban, i: 'i-lucide-square-kanban' }]"
            :key="o.v"
            :label="o.l"
            :icon="o.i"
            :color="rascunho.model_type === o.v ? 'primary' : 'neutral'"
            :variant="rascunho.model_type === o.v ? 'soft' : 'outline'"
            :aria-pressed="rascunho.model_type === o.v"
            class="flex-1 justify-center"
            @click="mudar(x => { x.model_type = o.v; if (o.v === 'kanban' && !x.config.groupBy) x.config.groupBy = 'status' })"
          />
        </UFieldGroup>
        <UFormField v-if="rascunho.model_type === 'kanban'" :label="t.criar.agruparPor">
          <USelect
            :model-value="rascunho.config.groupBy ?? 'status'"
            :items="camposDeAgrupar"
            class="w-full"
            @update:model-value="(v: string) => mudar(x => { x.config.groupBy = v })"
          />
        </UFormField>
      </section>

      <!-- Cartão do kanban: o que cada cartão mostra (no lugar das colunas da tabela). -->
      <section v-if="rascunho.model_type === 'kanban'" class="space-y-3 p-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.painel.cartao }}</h3>
        <UFormField :label="t.painel.cartaoTitulo">
          <USelect :model-value="cartao.header ?? 'fornecedor'" :items="opcoesDe(['texto'], false)" class="w-full" @update:model-value="(v: string) => mudarCartao('header', v)" />
        </UFormField>
        <UFormField :label="t.painel.cartaoApoio">
          <USelect :model-value="cartao.content ?? 'reference'" :items="opcoesDe(['texto', 'moeda', 'selecao'])" class="w-full" @update:model-value="(v: string) => mudarCartao('content', v)" />
        </UFormField>
        <UFormField :label="t.painel.cartaoEtiquetas" :hint="t.comum.opcional">
          <USelectMenu v-model="etiquetas" multiple value-key="value" :items="opcoesDe(['selecao'], false)" :placeholder="t.painel.cartaoEtiquetasExemplo" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-3">
          <UFormField :label="t.painel.cartaoPessoa">
            <USelect :model-value="cartao.userField ?? NENHUM" :items="opcoesDe(['usuario'])" class="w-full" @update:model-value="(v: string) => mudarCartao('userField', v)" />
          </UFormField>
          <UFormField :label="t.painel.cartaoData">
            <USelect :model-value="cartao.dueDateField ?? NENHUM" :items="opcoesDe(['data'])" class="w-full" @update:model-value="(v: string) => mudarCartao('dueDateField', v)" />
          </UFormField>
        </div>
      </section>

      <!-- Colunas: as visíveis em cima, na ordem da tabela; as ocultas embaixo. Todas as linhas com o mesmo desenho. -->
      <section v-if="rascunho.model_type === 'table'" class="space-y-3 p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.painel.colunas }}</h3>
          <span class="text-xs text-muted">{{ t.painel.colunasContagem(visiveis.length, CAMPOS.length) }}</span>
        </div>
        <UInput v-model="buscaColuna" icon="i-lucide-search" :placeholder="t.painel.buscarCampo" size="sm" class="w-full" />

        <ul class="-mx-1.5" @dragover.prevent @drop.prevent="soltarColuna">
          <TransitionGroup
            move-class="transition-transform duration-200 ease-out"
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
          >
            <li
              v-for="(path, i) in visiveis"
              v-show="casaBusca(path)"
              :key="path"
              draggable="true"
              class="group/col relative flex h-8 items-center gap-2 rounded-md px-1.5 text-sm text-default hover:bg-elevated"
              :class="arrastandoColuna === i ? 'opacity-40' : ''"
              @dragstart="arrastandoColuna = i"
              @dragend="arrastandoColuna = null; alvoColuna = null"
              @dragover.prevent="(e: DragEvent) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); alvoColuna = e.clientY < r.top + r.height / 2 ? i : i + 1 }"
            >
              <span v-if="alvoColuna === i && arrastandoColuna !== null" class="absolute inset-x-1 -top-px h-0.5 rounded-full bg-primary" />
              <span v-if="alvoColuna === i + 1 && i === visiveis.length - 1 && arrastandoColuna !== null" class="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary" />
              <UIcon name="i-lucide-grip-vertical" class="size-4 shrink-0 cursor-grab text-dimmed" :title="t.painel.arrastarColuna" />
              <UIcon :name="ICONE_DO_TIPO[campoPorPath(path)!.tipo]" class="size-4 shrink-0 text-muted" />
              <span class="flex-1 truncate">{{ campoPorPath(path)!.label }}</span>
              <span class="flex items-center opacity-0 transition-opacity group-hover/col:opacity-100 group-focus-within/col:opacity-100">
                <UButton icon="i-lucide-arrow-up" color="neutral" variant="ghost" size="xs" :disabled="i === 0" :aria-label="t.painel.subir(campoPorPath(path)!.label)" @click="moverColuna(i, i - 1)" />
                <UButton icon="i-lucide-arrow-down" color="neutral" variant="ghost" size="xs" :disabled="i === visiveis.length - 1" :aria-label="t.painel.descer(campoPorPath(path)!.label)" @click="moverColuna(i, i + 1)" />
              </span>
              <UButton icon="i-lucide-eye" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.ocultarColuna(campoPorPath(path)!.label)" @click="alternarColuna(path)" />
            </li>
          </TransitionGroup>
          <li v-if="ocultas.length" class="px-1.5 pb-1 pt-3 text-xs font-medium text-muted">{{ t.painel.ocultas }}</li>
          <li
            v-for="path in ocultas"
            v-show="casaBusca(path)"
            :key="path"
            class="flex h-8 items-center gap-2 rounded-md px-1.5 text-sm text-muted hover:bg-elevated"
          >
            <span class="size-4 shrink-0" />
            <UIcon :name="ICONE_DO_TIPO[campoPorPath(path)!.tipo]" class="size-4 shrink-0 text-dimmed" />
            <span class="flex-1 truncate">{{ campoPorPath(path)!.label }}</span>
            <UButton icon="i-lucide-eye-off" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.mostrarColuna(campoPorPath(path)!.label)" @click="alternarColuna(path)" />
          </li>
        </ul>
      </section>

      <!-- Filtros (rodada 5): os 2 automáticos como chaves; os filtros por campo; o filtro avançado, com o mesmo construtor do chip "N regras". -->
      <section class="space-y-3 p-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.painel.filtros }}</h3>
        <div class="space-y-3">
          <USwitch
            :model-value="rapidos.includes('isOwner')"
            :label="t.painel.soMeus"
            :description="t.painel.soMeusAjuda"
            size="sm"
            :ui="{ description: 'text-xs' }"
            @update:model-value="(v: boolean) => alternarRapido('isOwner', v)"
          />
          <USwitch
            :model-value="rapidos.includes('inGroups')"
            :label="t.painel.meusGrupos"
            :description="t.painel.meusGruposAjuda"
            size="sm"
            :ui="{ description: 'text-xs' }"
            @update:model-value="(v: boolean) => alternarRapido('inGroups', v)"
          />
        </div>

        <div class="space-y-2">
          <div>
            <p class="text-sm font-medium text-highlighted">{{ t.filtro.simples }}</p>
            <p class="text-xs text-muted">{{ t.filtro.simplesAjuda }}</p>
          </div>
          <TransitionGroup
            tag="div"
            class="space-y-1.5"
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0"
          >
            <div v-for="(f, i) in (rascunho.filters.field_filters ?? [])" :key="`${f.field}-${i}`" class="flex items-start gap-1.5 rounded-lg bg-elevated/60 p-2">
              <RegraDeFiltro :model-value="f" :t="t" empilhado class="flex-1" @update:model-value="(r: FiltroDeCampo) => mudarFiltro(i, r)" />
              <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="t.filtro.excluirFiltro" @click="tirarFiltro(i)" />
            </div>
          </TransitionGroup>
          <UButton :label="t.filtro.adicionarFiltro" icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" @click="novoFiltro" />
        </div>

        <div class="space-y-2 border-t border-default pt-3">
          <div>
            <p class="text-sm font-medium text-highlighted">{{ t.filtro.avancado }}</p>
            <p class="text-xs text-muted">{{ t.filtro.avancadoAjuda }}</p>
          </div>
          <template v-if="rascunho.filters.avancado">
            <ConstrutorDeRegras
              :model-value="rascunho.filters.avancado"
              :t="t"
              empilhado
              @update:model-value="(g: GrupoDeRegras) => mudar(x => { x.filters.avancado = g })"
            />
            <UButton :label="t.filtro.excluirAvancado" icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" @click="mudar(x => { delete x.filters.avancado })" />
          </template>
          <UButton v-else :label="t.filtro.adicionarAvancado" icon="i-lucide-list-filter" color="neutral" variant="outline" size="sm" @click="novoAvancado" />
        </div>
      </section>

      <!-- Ordenação: o mesmo cartão dos filtros, numa linha só: campo, direção e retirar. -->
      <section class="space-y-3 p-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ rascunho.model_type === 'kanban' ? t.painel.ordenacaoKanban : t.painel.ordenacao }}</h3>
        <p v-if="!ordenacoes.length" class="text-xs text-muted">{{ t.painel.semOrdenacao }}</p>
        <div class="space-y-1.5">
          <div v-for="(o, i) in ordenacoes" :key="i">
            <p class="pb-1.5 pl-1 text-xs text-muted">{{ i === 0 ? t.painel.ordenarPor : t.painel.depoisPor }}</p>
            <div class="flex items-center gap-1.5 rounded-lg bg-elevated/60 p-2.5">
              <USelect
                :model-value="o.field"
                :items="camposDeFiltro"
                size="sm"
                class="min-w-0 flex-1"
                :aria-label="t.painel.campo"
                @update:model-value="(v: string) => mudarOrdenacao(i, { field: v })"
              />
              <USelect
                :model-value="o.direction"
                :items="[{ label: t.painel.crescente, value: 'asc' }, { label: t.painel.decrescente, value: 'desc' }]"
                size="sm"
                class="w-32 shrink-0"
                :aria-label="t.painel.direcao"
                @update:model-value="(v: 'asc' | 'desc') => mudarOrdenacao(i, { direction: v })"
              />
              <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.tirarOrdenacao" @click="tirarOrdenacao(i)" />
            </div>
          </div>
        </div>
        <UButton :label="t.painel.adicionarOrdenacao" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="novaOrdenacao" />
      </section>

      <!-- Quem vê -->
      <section class="space-y-3 p-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.painel.quemVe }}</h3>
        <URadioGroup v-model="quemVe" :items="opcoesQuemVe" size="sm" :disabled="quemVeTravado" :ui="{ fieldset: 'gap-y-2.5', description: 'text-xs' }" />
        <p v-if="!ehOwner" class="flex items-start gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-info" class="mt-px size-3.5 shrink-0" />{{ t.painel.quemVeSoOwner }}
        </p>
        <div v-if="quemVe === 'grupos'" class="space-y-2 pl-6">
          <USelectMenu v-model="grupos" multiple :items="GRUPOS.map(g => ({ label: g.nome, value: g.id }))" value-key="value" :placeholder="t.painel.escolherGrupos" size="sm" class="w-full" />
          <USelectMenu v-model="funcoes" multiple :items="FUNCOES.map(f => ({ label: f.nome, value: f.id }))" value-key="value" :placeholder="t.painel.escolherFuncoes" size="sm" class="w-full" />
        </div>
      </section>
    </div>

    <!-- Salvar mora só aqui enquanto o painel está aberto; a linha de filtros esconde o dela. -->
    <!-- Ao criar: cada ajuste já entra na visualização nova. Concluir fecha; Descartar apaga e volta. -->
    <footer v-if="emCriacao" class="flex items-center gap-2 border-t border-default px-4 py-3">
      <UButton :label="t.painel.descartarNova" icon="i-lucide-trash-2" color="error" variant="ghost" size="sm" @click="emit('cancelarCriacao')" />
      <UButton :label="t.painel.concluir" size="sm" class="ml-auto" :loading="criando" @click="criar" />
    </footer>
    <footer v-else class="flex items-center gap-2 border-t border-default px-4 py-3">
      <p class="min-w-0 flex-1 text-xs text-muted">
        <span v-if="modificada" class="flex items-center gap-1.5"><span class="size-2 shrink-0 rounded-full bg-warning" />{{ t.painel.naoSalvas }}</span>
        <span v-else>{{ t.painel.tudoSalvo }}</span>
      </p>
      <UButton :label="t.painel.descartar" color="neutral" variant="ghost" size="sm" :disabled="!modificada" @click="emit('descartar')" />
      <UFieldGroup size="sm">
        <UButton :label="opcoesSalvar.principal.label" :disabled="!modificada" :loading="salvando" @click="emit('salvar', opcoesSalvar.principal.escopo)" />
        <UDropdownMenu :items="[opcoesSalvar.extras.map(o => ({ label: o.label, icon: o.icon, onSelect: () => emit('salvar', o.escopo) }))]" :content="{ align: 'end', side: 'top' }">
          <UButton icon="i-lucide-chevron-down" :disabled="!modificada" :aria-label="t.linha.maisSalvar" />
        </UDropdownMenu>
      </UFieldGroup>
    </footer>
  </aside>
</template>

<script setup lang="ts">
/**
 * PROPOSTA: configurações do projeto, abertas pelo ••• do projeto no painel e pelo botão da página.
 * Fora de Configurações do workspace: o administrador do projeto pode ter licença Standard.
 *
 * Abas: Geral, Categorias, Participantes, Acesso, Arquivar e excluir.
 * Um rascunho só para as abas e um Salvar só: trocar de aba não descarta nada
 * (S3-F1 da pesquisa de UX: alteração descartada em silêncio ao trocar de aba).
 * Mover categoria abre o diálogo do que muda e vale na hora, como todo movimento.
 *
 * Rodada 3:
 *  - aba Campos comuns: o mapa Responsável, Prazo e Status de cada categoria, e em que coluna do
 *    quadro entra cada valor do status. Entra no mesmo rascunho e no mesmo Salvar;
 *  - Geral: "Salvar como modelo", que vira caso de uso do workspace.
 */
import type { SelectMenuItem, TabsItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { camposDaCategoria, cargos, grupos, iniciais, pessoa, pessoas, type GrupoDeStatus, type MapaDaCategoria, type Participante, type PermissaoPadrao, type Visibilidade } from './mocks'
import { ICONE_DA_VISIBILIDADE, useMarcaDeProposta, useProjetos } from './estado'
import SalvarComoModelo from './_SalvarComoModelo.vue'
import { textosDeAtalhos } from './textosDeAtalhos'
import AtalhoDeCriar from './_AtalhoDeCriar.vue'

const props = defineProps<{ t: Textos }>()
const prj = useProjetos()
const toast = useToast()

const aberto = computed({
  get: () => prj.janelas.configurar.value !== null,
  set: (v) => { if (!v) prj.janelas.configurar.value = null },
})
const p = computed(() => prj.projetos.value.find(x => x.id === prj.janelas.configurar.value?.id) ?? null)
const admin = computed(() => !!p.value && prj.podeAdministrar(p.value))
const aba = ref('geral')

interface Rascunho { nome: string, descricao: string, noMenuDeTodos: boolean, visibilidade: Visibilidade, permissaoPadrao: PermissaoPadrao, participantes: Participante[], mapa: Record<number, MapaDaCategoria> }
const rascunho = ref<Rascunho | null>(null)
const original = ref('')
const { marca, marcaBack } = useMarcaDeProposta()

function carregar() {
  if (!p.value) return
  rascunho.value = {
    nome: p.value.nome,
    descricao: p.value.descricao,
    noMenuDeTodos: p.value.noMenuDeTodos,
    visibilidade: p.value.visibilidade,
    permissaoPadrao: { ...p.value.permissaoPadrao },
    participantes: p.value.participantes.map(x => ({ ...x })),
    mapa: Object.fromEntries(prj.categoriasDe(p.value.id).map(c => {
      const m = prj.mapas.value[c.id] ?? { responsavel: null, prazo: null, status: null, grupos: {} }
      return [c.id, { ...m, grupos: { ...m.grupos } }]
    })),
  }
  original.value = JSON.stringify(rascunho.value)
}
watch(() => prj.janelas.configurar.value, (v) => {
  if (!v) return
  aba.value = v.aba
  carregar()
}, { immediate: true })

const alterado = computed(() => !!rascunho.value && JSON.stringify(rascunho.value) !== original.value)

const abas = computed<TabsItem[]>(() => [
  { value: 'geral', label: props.t.config.abaGeral, icon: 'i-lucide-sliders-horizontal' },
  { value: 'categorias', label: props.t.config.abaCategorias, icon: 'i-lucide-database' },
  { value: 'campos', label: props.t.mapa.aba, icon: 'i-lucide-columns-3' },
  { value: 'participantes', label: props.t.config.abaParticipantes, icon: 'i-lucide-users-round' },
  { value: 'acesso', label: props.t.config.abaAcesso, icon: 'i-lucide-shield' },
  { value: 'arquivar', label: props.t.config.abaArquivar, icon: 'i-lucide-archive' },
])

/* ---------- categorias ---------- */
const categorias = computed(() => p.value ? prj.categoriasDe(p.value.id) : [])
const daWorkspace = computed(() => prj.categoriasDoWorkspace.value.map(c => ({ value: c.id, label: c.name, icon: c.icon ?? 'i-lucide-folder' })))
const adicionar = ref<number | undefined>(undefined)
watch(adicionar, (v) => {
  if (v === undefined) return
  prj.janelas.mover.value = v
  nextTick(() => { adicionar.value = undefined })
})

/** Rodada 11: "Criar categoria" no pé do seletor (`_AtalhoDeCriar.vue`): a categoria nasce neste projeto, sem campos. */
const ta = useTextos(textosDeAtalhos)
const buscaCategoria = ref('')
function criarCategoriaAqui(nome: string) {
  prj.criarCategoria(p.value!.id, nome, 'i-lucide-folder')
  toast.add({ title: ta.value.categoria.criada(nome), icon: 'i-lucide-folder-plus', color: 'success' })
  buscaCategoria.value = ''
}

/* ---------- campos comuns (rodada 3) ---------- */
const NAO_USAR = '__nao_usar__'
function opcoes(lista: string[]) {
  return [...lista.map(x => ({ value: x, label: x })), { value: NAO_USAR, label: props.t.mapa.naoUsar }]
}
const camposDaCat = (id: number) => {
  const c = prj.categorias.value.find(x => x.id === id)
  return c ? camposDaCategoria[prj.camposDe(c)] : undefined
}
/** USelect não guarda null: "Não usar" vira null no rascunho. */
function campo(id: number, chave: 'responsavel' | 'prazo' | 'status') {
  return computed({
    get: () => rascunho.value?.mapa[id]?.[chave] ?? NAO_USAR,
    set: (v: string) => { if (rascunho.value?.mapa[id]) rascunho.value.mapa[id]![chave] = v === NAO_USAR ? null : v },
  })
}
const gruposDoQuadro = computed(() => (['aberto', 'andamento', 'concluido'] as const).map(g => ({ value: g, label: props.t.itensDoProjeto.grupo[g] })))
const abertos = ref<number[]>([])
function setGrupo(id: number, valor: string, g: GrupoDeStatus) {
  if (rascunho.value?.mapa[id]) rascunho.value.mapa[id]!.grupos[valor] = g
}

/* ---------- participantes ---------- */
const herdados = computed(() => pessoas.filter(x => x.licenca === 'owner' || x.licenca === 'full'))
function nomeDe(x: Participante) {
  if (x.tipo === 'pessoa') return pessoa(x.id as number)?.nome ?? ''
  if (x.tipo === 'grupo') return grupos.find(g => g.id === x.id)?.name ?? ''
  return cargos.find(c => c.id === x.id)?.name ?? ''
}
const iconeDoTipo = { pessoa: 'i-lucide-user-round', grupo: 'i-lucide-users-round', cargo: 'i-lucide-shield-check' } as const
const papeis = computed(() => [
  { value: 'admin', label: props.t.papel.admin },
  { value: 'participante', label: props.t.papel.participante },
])
const chave = (x: { tipo: string, id: number | string }) => `${x.tipo}:${x.id}`
const opcoesDeParticipante = computed<SelectMenuItem[][]>(() => {
  const ja = new Set(rascunho.value?.participantes.map(chave) ?? [])
  return [
    [{ type: 'label', label: props.t.tipoDeParticipante.grupo }, ...grupos.map(g => ({ value: `grupo:${g.id}`, label: g.name, icon: 'i-lucide-users-round', disabled: ja.has(`grupo:${g.id}`) }))],
    [{ type: 'label', label: props.t.tipoDeParticipante.cargo }, ...cargos.map(c => ({ value: `cargo:${c.id}`, label: c.name, icon: 'i-lucide-shield-check', disabled: ja.has(`cargo:${c.id}`) }))],
    [{ type: 'label', label: props.t.tipoDeParticipante.pessoa }, ...pessoas.filter(x => x.licenca !== 'owner' && x.licenca !== 'full').map(x => ({ value: `pessoa:${x.id}`, label: x.nome, avatar: { text: iniciais(x.nome), alt: x.nome }, disabled: ja.has(`pessoa:${x.id}`) }))],
  ]
})
const novo = ref<string | undefined>(undefined)
watch(novo, (v) => {
  if (!v || !rascunho.value) return
  const [tipo, id] = v.split(':') as [Participante['tipo'], string]
  rascunho.value.participantes.push({ tipo, id: tipo === 'grupo' ? id : Number(id), papel: 'participante' })
  nextTick(() => { novo.value = undefined })
})

/* ---------- acesso ---------- */
/** Pedidos de acesso pendentes (fictícios): Henrique pediu acesso ao Financeiro. */
const pendentes = ref<Record<number, number[]>>({ 1: [6], 4: [9] })
const pedidosDoProjeto = computed(() => (p.value ? pendentes.value[p.value.id] ?? [] : []).map(id => pessoa(id)!).filter(Boolean))
function responder(id: number, aprovar: boolean) {
  if (!p.value || !rascunho.value) return
  pendentes.value = { ...pendentes.value, [p.value.id]: (pendentes.value[p.value.id] ?? []).filter(x => x !== id) }
  if (aprovar) {
    rascunho.value.participantes.push({ tipo: 'pessoa', id, papel: 'participante' })
    toast.add({ title: props.t.config.aprovado(pessoa(id)!.nome), icon: 'i-lucide-check', color: 'success' })
  }
}
const opcoesDeVisibilidade = computed(() => (['aberto', 'fechado', 'privado'] as const).map(v => ({
  value: v,
  label: props.t.visibilidade[v],
  icon: ICONE_DA_VISIBILIDADE[v],
  dica: props.t.visibilidade[`${v}Dica` as const],
  // Só o proprietário do workspace afrouxa a segurança (regra do Notion).
  disabled: v === 'aberto' && p.value?.visibilidade !== 'aberto' && !prj.souDono.value,
})))
const abre = computed(() => !!rascunho.value && p.value?.visibilidade !== 'aberto' && rascunho.value.visibilidade === 'aberto')
const acoes = computed(() => [
  { k: 'ver' as const, r: props.t.config.ver },
  { k: 'criar' as const, r: props.t.config.criarItens },
  { k: 'editar' as const, r: props.t.config.editar },
  { k: 'excluir' as const, r: props.t.config.excluir },
])

/* ---------- arquivar e excluir ---------- */
const confirmacao = ref('')
watch(() => prj.janelas.configurar.value, () => { confirmacao.value = '' })
const salvando = ref(false)

async function salvar() {
  if (!p.value || !rascunho.value) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 500))
  prj.atualizarProjeto(p.value.id, {
    nome: rascunho.value.nome.trim() || p.value.nome,
    descricao: rascunho.value.descricao,
    noMenuDeTodos: rascunho.value.noMenuDeTodos,
    visibilidade: rascunho.value.visibilidade,
    permissaoPadrao: { ...rascunho.value.permissaoPadrao },
    participantes: rascunho.value.participantes.map(x => ({ ...x })),
  })
  prj.salvarMapa(JSON.parse(JSON.stringify(rascunho.value.mapa)))
  original.value = JSON.stringify(rascunho.value)
  salvando.value = false
  toast.add({ title: props.t.config.salvo, icon: 'i-lucide-check', color: 'success' })
}
function arquivar() {
  const nome = p.value!.nome
  prj.arquivar(p.value!.id)
  aberto.value = false
  toast.add({ title: props.t.config.arquivado(nome), icon: 'i-lucide-archive', color: 'neutral' })
}
function excluir() {
  const nome = p.value!.nome
  prj.excluir(p.value!.id)
  aberto.value = false
  toast.add({ title: props.t.config.excluido(nome), icon: 'i-lucide-trash-2', color: 'neutral' })
}
</script>

<template>
  <USlideover v-model:open="aberto" :title="p ? t.config.titulo(p.nome) : ''" :ui="{ content: 'max-w-3xl' }">
    <template #body>
      <div v-if="p && rascunho">
        <UAlert v-if="!admin" :title="t.config.semPermissao" icon="i-lucide-lock" color="neutral" variant="subtle" class="mb-4" />
        <UTabs v-model="aba" :items="abas" variant="link" :content="false" class="mb-5 w-full" :ui="{ list: 'overflow-x-auto overflow-y-hidden [scrollbar-width:none]', trigger: 'flex-none', label: 'overflow-visible' }" />

        <fieldset :disabled="!admin" class="space-y-5">
          <!-- GERAL -->
          <template v-if="aba === 'geral'">
            <UFormField :label="t.criar.nome" required>
              <UInput v-model="rascunho.nome" class="w-full" maxlength="60" />
            </UFormField>
            <UFormField :label="t.criar.descricao">
              <UTextarea v-model="rascunho.descricao" :rows="2" autoresize class="w-full" />
            </UFormField>
            <UFormField :label="t.config.referencia" :help="t.config.referenciaDica">
              <UInput :model-value="p.referencia" readonly class="w-full font-mono" />
            </UFormField>
            <UCheckbox v-model="rascunho.noMenuDeTodos" :label="t.criar.noMenuDeTodos" :description="t.criar.noMenuDeTodosDica" />

            <!-- rodada 3: modelo de projeto -->
            <div class="rounded-md border border-default p-4" :class="[marca, marcaBack]">
              <p class="text-sm font-semibold text-highlighted">{{ t.modelo.salvarComo }}</p>
              <p class="mt-1 text-sm text-muted">{{ t.modelo.salvarComoTexto }}</p>
              <UButton :label="t.modelo.salvarComo" icon="i-lucide-copy-plus" color="neutral" variant="outline" size="sm" class="mt-3" :disabled="!categorias.length" @click="prj.janelas.modelo.value = p.id" />
            </div>
          </template>

          <!-- CAMPOS COMUNS (rodada 3) -->
          <template v-else-if="aba === 'campos'">
            <p class="text-sm text-muted">{{ t.mapa.texto }}</p>
            <p v-if="!categorias.length" class="rounded-md border border-dashed border-default px-3 py-6 text-center text-sm text-muted">{{ t.mapa.semCategorias }}</p>
            <ul v-else class="space-y-3" :class="[marca, marcaBack]">
              <li v-for="c in categorias" :key="c.id" class="rounded-md border border-default">
                <div class="flex items-center gap-2 border-b border-default px-3 py-2">
                  <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4 shrink-0 text-muted" />
                  <span class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted">{{ c.name }}</span>
                </div>
                <div class="grid gap-3 p-3 sm:grid-cols-3">
                  <UFormField :label="t.mapa.responsavel" size="sm">
                    <USelect v-model="campo(c.id, 'responsavel').value" :items="opcoes(camposDaCat(c.id)?.pessoa ?? [])" icon="i-lucide-user-round" class="w-full" size="sm" />
                  </UFormField>
                  <UFormField :label="t.mapa.prazo" size="sm">
                    <USelect v-model="campo(c.id, 'prazo').value" :items="opcoes(camposDaCat(c.id)?.data ?? [])" icon="i-lucide-calendar" class="w-full" size="sm" />
                  </UFormField>
                  <UFormField :label="t.mapa.status" size="sm">
                    <USelect v-model="campo(c.id, 'status').value" :items="opcoes(camposDaCat(c.id) ? [camposDaCat(c.id)!.status] : [])" icon="i-lucide-circle-dot" class="w-full" size="sm" />
                  </UFormField>
                </div>
                <div v-if="rascunho.mapa[c.id]?.status" class="border-t border-default px-3 py-2">
                  <UButton
                    :label="t.mapa.colunasDoQuadro"
                    :icon="abertos.includes(c.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    :aria-expanded="abertos.includes(c.id)"
                    @click="abertos = abertos.includes(c.id) ? abertos.filter(x => x !== c.id) : [...abertos, c.id]"
                  />
                  <div v-if="abertos.includes(c.id)" class="mt-1 space-y-1.5 pb-1 animate-[entrada_0.15s_ease-out_both]">
                    <p class="text-xs text-muted">{{ t.mapa.colunasDoQuadroDica }}</p>
                    <div v-for="v in camposDaCat(c.id)?.valores ?? []" :key="v.valor" class="flex items-center gap-2">
                      <span class="min-w-0 flex-1 truncate text-sm text-toned">{{ v.valor }}</span>
                      <USelect
                        :model-value="rascunho.mapa[c.id]!.grupos[v.valor] ?? 'aberto'"
                        :items="gruposDoQuadro"
                        size="xs"
                        class="w-40"
                        :aria-label="`${v.valor}: ${t.mapa.colunasDoQuadro}`"
                        @update:model-value="(g: GrupoDeStatus) => setGrupo(c.id, v.valor, g)"
                      />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </template>

          <!-- CATEGORIAS -->
          <template v-else-if="aba === 'categorias'">
            <p class="text-sm text-muted">{{ t.config.categoriasTexto }}</p>
            <ul v-if="categorias.length" class="divide-y divide-default rounded-md border border-default">
              <li v-for="c in categorias" :key="c.id" class="flex items-center gap-3 px-3 py-2.5">
                <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4 shrink-0 text-muted" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm text-highlighted">{{ c.name }}</span>
                  <span class="block text-xs text-muted">{{ t.pagina.itens(c.itens) }}</span>
                </span>
                <UButton :label="t.config.mover" icon="i-lucide-folder-input" size="xs" color="neutral" variant="outline" @click="prj.janelas.mover.value = c.id" />
              </li>
            </ul>
            <p v-else class="rounded-md border border-dashed border-default px-3 py-6 text-center text-sm text-muted">{{ t.painel.semCategoria }}</p>
            <UFormField :label="t.config.adicionarCategoria">
              <USelectMenu v-model="adicionar" v-model:search-term="buscaCategoria" :items="daWorkspace" value-key="value" icon="i-lucide-plus" class="w-full" :placeholder="t.criar.categoriasPlaceholder" :search-input="{ placeholder: t.dados.buscar }">
                <template #content-bottom>
                  <AtalhoDeCriar :termo="buscaCategoria" :rotulo="ta.categoria.rotulo" :com="ta.categoria.com" :dica="ta.categoria.dica" @criar="criarCategoriaAqui" />
                </template>
              </USelectMenu>
            </UFormField>
          </template>

          <!-- PARTICIPANTES -->
          <template v-else-if="aba === 'participantes'">
            <ul class="divide-y divide-default rounded-md border border-default">
              <li v-for="h in herdados" :key="`h-${h.id}`" class="flex items-center gap-2.5 px-3 py-2">
                <UAvatar size="xs" :text="iniciais(h.nome)" :alt="h.nome" />
                <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ h.nome }}</span>
                <UTooltip :text="t.config.herdadoDica">
                  <UBadge :label="t.config.herdado" icon="i-lucide-building" size="sm" color="neutral" variant="subtle" />
                </UTooltip>
              </li>
              <li v-for="(x, i) in rascunho.participantes" :key="chave(x)" class="flex items-center gap-2.5 px-3 py-2">
                <UAvatar v-if="x.tipo === 'pessoa'" size="xs" :text="iniciais(nomeDe(x))" :alt="nomeDe(x)" />
                <span v-else class="flex size-6 items-center justify-center rounded-full bg-elevated"><UIcon :name="iconeDoTipo[x.tipo]" class="size-3.5 text-muted" /></span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm text-highlighted">{{ nomeDe(x) }}</span>
                  <span class="block truncate text-xs text-muted">{{ t.tipoDeParticipante[x.tipo] }}<template v-if="x.tipo !== 'pessoa'"> · {{ t.diretorio.pessoas(prj.alcance(x)) }}</template></span>
                </span>
                <USelect v-model="x.papel" :items="papeis" size="xs" class="w-48" :aria-label="t.criar.papelDe(nomeDe(x))" />
                <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" :aria-label="t.criar.remover(nomeDe(x))" @click="rascunho.participantes.splice(i, 1)" />
              </li>
            </ul>
            <USelectMenu v-model="novo" :items="opcoesDeParticipante" value-key="value" icon="i-lucide-user-plus" class="w-full" :placeholder="t.criar.adicionar" :search-input="{ placeholder: t.criar.buscarParticipante }" />
          </template>

          <!-- ACESSO -->
          <template v-else-if="aba === 'acesso'">
            <UFormField :label="t.criar.visibilidade" :help="opcoesDeVisibilidade.some(o => o.disabled) ? t.config.tetoDoWorkspace : undefined">
              <USelect v-model="rascunho.visibilidade" :items="opcoesDeVisibilidade" class="w-full" :icon="ICONE_DA_VISIBILIDADE[rascunho.visibilidade]">
                <template #item-trailing="{ item }">
                  <UTooltip :text="(item as any).dica" :content="{ side: 'right' }">
                    <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="(item as any).dica" />
                  </UTooltip>
                </template>
              </USelect>
              <p class="mt-1.5 text-sm text-muted">{{ t.visibilidade[`${rascunho.visibilidade}Dica`] }}</p>
            </UFormField>
            <UAlert v-if="abre" :title="t.config.abreTitulo" :description="t.config.abreTexto(prj.categoriasDe(p.id).length)" icon="i-lucide-triangle-alert" color="warning" variant="subtle" />

            <UFormField :label="t.config.permissaoPadrao" :help="t.config.permissaoPadraoDica">
              <div class="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <UCheckbox v-for="a in acoes" :key="a.k" v-model="rascunho.permissaoPadrao[a.k]" :label="a.r" />
              </div>
            </UFormField>

            <div>
              <p class="text-sm font-medium text-highlighted">{{ t.config.pedidos }}</p>
              <ul v-if="pedidosDoProjeto.length" class="mt-2 divide-y divide-default rounded-md border border-default">
                <li v-for="x in pedidosDoProjeto" :key="x.id" class="flex items-center gap-2.5 px-3 py-2">
                  <UAvatar size="xs" :text="iniciais(x.nome)" :alt="x.nome" />
                  <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ x.nome }}</span>
                  <UButton :label="t.config.recusar" size="xs" color="neutral" variant="ghost" @click="responder(x.id, false)" />
                  <UButton :label="t.config.aprovar" icon="i-lucide-check" size="xs" color="neutral" variant="outline" @click="responder(x.id, true)" />
                </li>
              </ul>
              <p v-else class="mt-1 text-sm text-muted">{{ t.config.semPedidos }}</p>
            </div>
          </template>

          <!-- ARQUIVAR E EXCLUIR -->
          <template v-else>
            <div class="rounded-md border border-default p-4">
              <p class="text-sm font-semibold text-highlighted">{{ t.config.arquivarTitulo }}</p>
              <p class="mt-1 text-sm text-muted">{{ t.config.arquivarTexto }}</p>
              <UButton :label="t.config.arquivar" icon="i-lucide-archive" color="neutral" variant="outline" size="sm" class="mt-3" :disabled="p.status === 'arquivado'" @click="arquivar" />
            </div>
            <div class="rounded-md border border-error/40 p-4">
              <p class="text-sm font-semibold text-highlighted">{{ t.config.excluirTitulo }}</p>
              <p class="mt-1 text-sm text-muted">{{ t.config.excluirTexto }}</p>
              <template v-if="prj.souDono.value">
                <UFormField :label="t.config.excluirConfirmar(p.nome)" class="mt-3">
                  <UInput v-model="confirmacao" class="w-full" />
                </UFormField>
                <UButton :label="t.config.excluirBotao" icon="i-lucide-trash-2" color="error" variant="soft" size="sm" class="mt-3" :disabled="confirmacao !== p.nome" @click="excluir" />
              </template>
              <p v-else class="mt-3 flex items-center gap-1.5 text-xs text-muted"><UIcon name="i-lucide-lock" class="size-3.5" />{{ t.config.soProprietarioExclui }}</p>
            </div>
          </template>
        </fieldset>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center gap-2">
        <span v-if="alterado" class="flex items-center gap-1.5 text-xs text-warning"><UIcon name="i-lucide-circle-dot" class="size-3.5" />{{ t.config.naoSalvo }}</span>
        <span class="flex-1" />
        <UButton v-if="alterado" :label="t.config.descartar" color="neutral" variant="ghost" @click="carregar" />
        <UButton :label="t.config.salvar" icon="i-lucide-check" color="primary" :disabled="!alterado || !admin" :loading="salvando" @click="salvar" />
      </div>
    </template>
  </USlideover>
  <SalvarComoModelo :t="t" />
</template>

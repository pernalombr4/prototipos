<script setup lang="ts">
/**
 * PROPOSTA (rodada 12): 1 formulário para criar e para configurar o projeto, numa sidebar, com as mesmas abas.
 * Até a rodada 11 eram 2 telas: o modal de criar, mais curto, e a sidebar de configurações, mais completa. A
 * redatora pediu que quem cria já defina o que hoje só se ajusta depois. O que só faz sentido depois de criar
 * (pedidos de acesso, salvar como modelo, arquivar e excluir, quem herda acesso do workspace) aparece só na edição.
 *
 * Abas, condensadas de 6 para 3:
 *  - Geral: começar de (só na criação), ícone, nome, referência, descrição, menu de todos; na edição, salvar como
 *    modelo e, no pé, arquivar e excluir (a antiga aba Arquivar e excluir);
 *  - Categorias e campos: a antiga aba Categorias e a antiga Campos comuns, juntas. Cada categoria é 1 cartão
 *    com os campos que ela empresta ao projeto e os grupos do status, explicados na tela;
 *  - Acesso e segurança: as antigas Participantes e Acesso, juntas: visibilidade, participantes, permissão padrão
 *    e pedidos de acesso.
 *
 * Referência: copia o nome enquanto a pessoa não a altera, como a das categorias e dos campos do ENSPACE. Na
 * criação pode ser alterada; na edição fica só para consulta.
 *
 * Na edição, um rascunho só para as abas e um Salvar só (S3-F1 da pesquisa de UX). Mover categoria abre o
 * diálogo do que muda e vale na hora, como todo movimento. Na criação, nada existe até "Criar projeto".
 */
import type { DropdownMenuItem, SelectMenuItem, TabsItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { camposDaCategoria, cargos, grupos, iniciais, mapaPadrao, pessoa, pessoas, referenciaDoNome, type GrupoDeStatus, type MapaDaCategoria, type Participante, type PermissaoPadrao, type Projeto, type Visibilidade } from './mocks'
import { COR_DO_PROJETO, ICONE_DA_VISIBILIDADE, useMarcaDeProposta, useProjetos } from './estado'
import SalvarComoModelo from './_SalvarComoModelo.vue'
import { textosDeAtalhos } from './textosDeAtalhos'
import { textosDoFormulario } from './textosDoFormulario'
import AtalhoDeCriar from './_AtalhoDeCriar.vue'

const props = defineProps<{ t: Textos }>()
const prj = useProjetos()
const toast = useToast()
const { marca, marcaBack } = useMarcaDeProposta()
const tf = useTextos(textosDoFormulario)
const ta = useTextos(textosDeAtalhos)

/* ---------- modo: criar ou editar ---------- */
const criando = computed(() => prj.janelas.criar.value)
const p = computed(() => prj.projetos.value.find(x => x.id === prj.janelas.configurar.value?.id) ?? null)
const aberto = computed({
  get: () => criando.value || !!p.value,
  set: (v) => {
    if (v) return
    prj.janelas.criar.value = false
    prj.janelas.configurar.value = null
  },
})
const admin = computed(() => criando.value || (!!p.value && prj.podeAdministrar(p.value)))

/* As abas antigas que outras telas ainda pedem caem na aba nova que as contém. */
const ABA_NOVA: Record<string, string> = { geral: 'geral', categorias: 'categorias', campos: 'categorias', participantes: 'acesso', acesso: 'acesso', arquivar: 'geral' }
const aba = ref('geral')
const abas = computed<TabsItem[]>(() => [
  { value: 'geral', label: props.t.config.abaGeral, icon: 'i-lucide-sliders-horizontal' },
  { value: 'categorias', label: tf.value.abaCategorias, icon: 'i-lucide-database', badge: categoriasDoForm.value.length ? { label: String(categoriasDoForm.value.length), color: 'neutral', variant: 'soft', size: 'sm' } : undefined },
  { value: 'acesso', label: tf.value.abaAcesso, icon: 'i-lucide-shield' },
])

/* ---------- o rascunho ---------- */
const ICONES = ['i-lucide-folder-kanban', 'i-lucide-landmark', 'i-lucide-scale', 'i-lucide-briefcase', 'i-lucide-hard-hat', 'i-lucide-users-round', 'i-lucide-rocket', 'i-lucide-heart-handshake', 'i-lucide-building-2', 'i-lucide-truck', 'i-lucide-graduation-cap', 'i-lucide-megaphone']
const CORES: Projeto['cor'][] = ['primary', 'success', 'info', 'warning', 'error', 'secondary', 'neutral']
interface Rascunho {
  modelo: number
  nome: string
  referencia: string
  descricao: string
  icone: string
  cor: Projeto['cor']
  noMenuDeTodos: boolean
  visibilidade: Visibilidade
  permissaoPadrao: PermissaoPadrao
  participantes: Participante[]
  /** Só na criação: as categorias escolhidas. Na edição, as categorias mudam na hora, pelo diálogo de mover. */
  categorias: number[]
  mapa: Record<number, MapaDaCategoria>
}
const rascunho = ref<Rascunho | null>(null)
const original = ref('')
/** A referência copia o nome até a pessoa alterá-la (como nas categorias e nos campos do ENSPACE). */
const referenciaManual = ref(false)
const tentou = ref(false)
const salvando = ref(false)
const confirmacao = ref('')

const copiaDoMapa = (id: number): MapaDaCategoria => {
  const c = prj.categorias.value.find(x => x.id === id)
  const m = prj.mapas.value[id] ?? mapaPadrao(c ? prj.camposDe(c) : id)
  return { ...m, grupos: { ...m.grupos } }
}
function carregar() {
  tentou.value = false
  confirmacao.value = ''
  if (criando.value) {
    referenciaManual.value = false
    rascunho.value = {
      modelo: 0, nome: '', referencia: '', descricao: '', icone: ICONES[0]!, cor: 'primary', noMenuDeTodos: true, visibilidade: 'fechado',
      permissaoPadrao: { ver: true, criar: true, editar: true, excluir: false }, participantes: [], categorias: [], mapa: {},
    }
  }
  else if (p.value) {
    rascunho.value = {
      modelo: 0,
      nome: p.value.nome,
      referencia: p.value.referencia,
      descricao: p.value.descricao,
      icone: p.value.icone,
      cor: p.value.cor,
      noMenuDeTodos: p.value.noMenuDeTodos,
      visibilidade: p.value.visibilidade,
      permissaoPadrao: { ...p.value.permissaoPadrao },
      participantes: p.value.participantes.map(x => ({ ...x })),
      categorias: [],
      mapa: Object.fromEntries(prj.categoriasDe(p.value.id).map(c => [c.id, copiaDoMapa(c.id)])),
    }
  }
  original.value = JSON.stringify(rascunho.value)
}
watch(() => [prj.janelas.criar.value, prj.janelas.configurar.value] as const, ([c, cfg]) => {
  if (!c && !cfg) return
  aba.value = ABA_NOVA[cfg?.aba ?? 'geral'] ?? 'geral'
  carregar()
  if (cfg?.aba === 'arquivar') nextTick(() => setTimeout(() => document.getElementById('form-projeto-arquivar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250))
}, { immediate: true })
const alterado = computed(() => !!rascunho.value && JSON.stringify(rascunho.value) !== original.value)

/* ---------- geral ---------- */
const modelo = computed(() => prj.modelos.value.find(m => m.id === rascunho.value?.modelo) ?? null)
const opcoesDeModelo = computed(() => [
  { value: 0, label: props.t.modelo.emBranco, icon: 'i-lucide-square-dashed', dica: props.t.modelo.emBrancoDica },
  ...prj.modelos.value.map(m => ({ value: m.id, label: m.nome, icon: m.icone, dica: `${m.descricao} ${props.t.modelo.modeloDica(m.categorias.length)}`.trim(), autor: props.t.modelo.criadoPor(pessoas.find(x => x.id === m.criadoPor)?.nome ?? '') })),
])
watch(modelo, (m) => {
  if (!m || !rascunho.value) return
  rascunho.value.icone = m.icone
  rascunho.value.cor = m.cor
  rascunho.value.visibilidade = m.visibilidade
})
watch(() => rascunho.value?.nome, (n) => {
  if (criando.value && rascunho.value && !referenciaManual.value) rascunho.value.referencia = referenciaDoNome(n ?? '')
})
function digitarReferencia(v: string) {
  if (!rascunho.value) return
  const limpa = v.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-')
  referenciaManual.value = !!limpa
  rascunho.value.referencia = limpa || referenciaDoNome(rascunho.value.nome)
}
const erroNome = computed(() => {
  if (!tentou.value || !rascunho.value) return undefined
  const n = rascunho.value.nome.trim().toLowerCase()
  if (!n) return props.t.criar.nomeObrigatorio
  if (prj.projetos.value.some(x => x.id !== p.value?.id && x.nome.toLowerCase() === n)) return props.t.criar.nomeRepetido
  return undefined
})
const erroReferencia = computed(() => {
  if (!criando.value || !tentou.value || !rascunho.value) return undefined
  const r = rascunho.value.referencia
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r)) return tf.value.referenciaInvalida
  if (prj.projetos.value.some(x => x.referencia === r)) return tf.value.referenciaRepetida
  return undefined
})

/* ---------- categorias e campos ---------- */
const categoriasDoForm = computed(() => {
  if (criando.value) return (rascunho.value?.categorias ?? []).map(id => prj.categorias.value.find(c => c.id === id)!).filter(Boolean)
  return p.value ? prj.categoriasDe(p.value.id) : []
})
/** A categoria que entra no projeto ganha a linha dela no mapa (a movida pelo diálogo, na edição, também). */
watch(categoriasDoForm, (cs) => {
  const r = rascunho.value
  if (!r) return
  for (const c of cs) if (!r.mapa[c.id]) r.mapa[c.id] = copiaDoMapa(c.id)
}, { immediate: true })
const opcoesDeCategoria = computed(() => prj.categorias.value
  .filter(c => criando.value ? !rascunho.value?.categorias.includes(c.id) : c.projeto !== p.value?.id)
  .map((c) => {
    const dono = prj.projetoDa(c)
    // Na criação, a categoria de outro projeto aparece travada (categoria em 1 lugar só); na edição, ela se move.
    return { value: c.id, label: c.name, icon: c.icon ?? 'i-lucide-folder', disabled: criando.value && !!dono, dono: dono?.nome }
  }))
const escolhida = ref<number | undefined>(undefined)
const buscaCategoria = ref('')
watch(escolhida, (v) => {
  if (v === undefined || !rascunho.value) return
  if (criando.value) rascunho.value.categorias = [...rascunho.value.categorias, v]
  else prj.janelas.mover.value = v
  nextTick(() => { escolhida.value = undefined })
})
function criarCategoria(nome: string) {
  if (!rascunho.value) return
  const id = prj.criarCategoria(criando.value ? null : p.value!.id, nome, 'i-lucide-folder')
  if (criando.value) rascunho.value.categorias = [...rascunho.value.categorias, id]
  toast.add({ title: ta.value.categoria.criada(nome), icon: 'i-lucide-folder-plus', color: 'success' })
  buscaCategoria.value = ''
}
function acoesDaCategoria(id: number): DropdownMenuItem[][] {
  return [[{ label: tf.value.moverPara, icon: 'i-lucide-folder-input', onSelect: () => { prj.janelas.mover.value = id } }]]
}
function tirar(id: number) {
  if (!rascunho.value) return
  rascunho.value.categorias = rascunho.value.categorias.filter(x => x !== id)
  delete rascunho.value.mapa[id]
}
const NAO_USAR = '__nao_usar__'
const opcoes = (lista: string[]) => [...lista.map(x => ({ value: x, label: x })), { value: NAO_USAR, label: props.t.mapa.naoUsar }]
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
const GRUPOS = ['aberto', 'andamento', 'concluido'] as const
const ICONE_DO_GRUPO: Record<GrupoDeStatus, string> = { aberto: 'i-lucide-circle', andamento: 'i-lucide-circle-dot', concluido: 'i-lucide-circle-check' }
const COR_DO_GRUPO: Record<GrupoDeStatus, 'neutral' | 'info' | 'success'> = { aberto: 'neutral', andamento: 'info', concluido: 'success' }
const opcoesDeGrupo = computed(() => GRUPOS.map(g => ({ value: g, label: props.t.itensDoProjeto.grupo[g], icon: ICONE_DO_GRUPO[g] })))
function setGrupo(id: number, valor: string, g: GrupoDeStatus) {
  if (rascunho.value?.mapa[id]) rascunho.value.mapa[id]!.grupos[valor] = g
}

/* ---------- acesso e segurança ---------- */
const opcoesDeVisibilidade = computed(() => (['aberto', 'fechado', 'privado'] as const).map(v => ({
  value: v,
  label: props.t.visibilidade[v],
  icon: ICONE_DA_VISIBILIDADE[v],
  dica: props.t.visibilidade[`${v}Dica` as const],
  // Só o proprietário do workspace afrouxa a segurança de um projeto que já existe (regra do Notion).
  disabled: !criando.value && v === 'aberto' && p.value?.visibilidade !== 'aberto' && !prj.souDono.value,
})))
const abre = computed(() => !criando.value && !!rascunho.value && p.value?.visibilidade !== 'aberto' && rascunho.value.visibilidade === 'aberto')
const herdados = computed(() => criando.value ? [] : pessoas.filter(x => x.licenca === 'owner' || x.licenca === 'full'))
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
  const herda = new Set(herdados.value.map(h => h.id))
  return [
    [{ type: 'label', label: props.t.tipoDeParticipante.grupo }, ...grupos.map(g => ({ value: `grupo:${g.id}`, label: g.name, icon: 'i-lucide-users-round', disabled: ja.has(`grupo:${g.id}`), contagem: g.members_count }))],
    [{ type: 'label', label: props.t.tipoDeParticipante.cargo }, ...cargos.map(c => ({ value: `cargo:${c.id}`, label: c.name, icon: 'i-lucide-shield-check', disabled: ja.has(`cargo:${c.id}`) }))],
    [{ type: 'label', label: props.t.tipoDeParticipante.pessoa }, ...pessoas.filter(x => x.id !== prj.eu.value && !herda.has(x.id)).map(x => ({ value: `pessoa:${x.id}`, label: x.nome, avatar: { text: iniciais(x.nome), alt: x.nome }, disabled: ja.has(`pessoa:${x.id}`), empresa: x.empresa }))],
  ]
})
const novo = ref<string | undefined>(undefined)
watch(novo, (v) => {
  if (!v || !rascunho.value) return
  const [tipo, id] = v.split(':') as [Participante['tipo'], string]
  rascunho.value.participantes.push({ tipo, id: tipo === 'grupo' ? id : Number(id), papel: 'participante' })
  nextTick(() => { novo.value = undefined })
})
const acoesDaPermissao = computed(() => [
  { k: 'ver' as const, r: props.t.config.ver },
  { k: 'criar' as const, r: props.t.config.criarItens },
  { k: 'editar' as const, r: props.t.config.editar },
  { k: 'excluir' as const, r: props.t.config.excluir },
])
/** Pedidos de acesso pendentes (fictícios): Henrique pediu acesso ao Financeiro. Só existem na edição. */
const pendentes = ref<Record<number, number[]>>({ 1: [6], 4: [9] })
const pedidosDoProjeto = computed(() => (p.value && !criando.value ? pendentes.value[p.value.id] ?? [] : []).map(id => pessoa(id)!).filter(Boolean))
function responder(id: number, aprovar: boolean) {
  if (!p.value || !rascunho.value) return
  pendentes.value = { ...pendentes.value, [p.value.id]: (pendentes.value[p.value.id] ?? []).filter(x => x !== id) }
  if (aprovar) {
    rascunho.value.participantes.push({ tipo: 'pessoa', id, papel: 'participante' })
    toast.add({ title: props.t.config.aprovado(pessoa(id)!.nome), icon: 'i-lucide-check', color: 'success' })
  }
}

/* ---------- salvar, criar, arquivar, excluir ---------- */
async function criar() {
  const r = rascunho.value
  if (!r) return
  tentou.value = true
  if (erroNome.value || erroReferencia.value) {
    aba.value = 'geral'
    return
  }
  salvando.value = true
  await new Promise(res => setTimeout(res, 700))
  const novoProjeto = prj.criarProjeto({
    nome: r.nome.trim(),
    referencia: r.referencia,
    descricao: r.descricao.trim(),
    icone: r.icone,
    cor: r.cor,
    visibilidade: r.visibilidade,
    categorias: r.categorias,
    participantes: r.participantes,
    noMenuDeTodos: r.noMenuDeTodos,
    modelo: modelo.value?.id,
    permissaoPadrao: { ...r.permissaoPadrao },
  })
  prj.salvarMapa(JSON.parse(JSON.stringify(r.mapa)))
  salvando.value = false
  const m = modelo.value
  aberto.value = false
  toast.add({
    title: m ? props.t.modelo.criadoComModelo(novoProjeto.nome, m.categorias.length + r.categorias.length, prj.fluxosDoProjeto(novoProjeto.id).length) : props.t.criar.criado(novoProjeto.nome),
    icon: 'i-lucide-check',
    color: 'success',
  })
}
async function salvar() {
  const r = rascunho.value
  if (!p.value || !r) return
  tentou.value = true
  if (erroNome.value) {
    aba.value = 'geral'
    return
  }
  salvando.value = true
  await new Promise(res => setTimeout(res, 500))
  prj.atualizarProjeto(p.value.id, {
    nome: r.nome.trim(),
    descricao: r.descricao,
    icone: r.icone,
    cor: r.cor,
    noMenuDeTodos: r.noMenuDeTodos,
    visibilidade: r.visibilidade,
    permissaoPadrao: { ...r.permissaoPadrao },
    participantes: r.participantes.map(x => ({ ...x })),
  })
  prj.salvarMapa(JSON.parse(JSON.stringify(r.mapa)))
  original.value = JSON.stringify(r)
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
  <USlideover
    v-model:open="aberto"
    :title="criando ? t.criar.titulo : p ? t.config.titulo(p.nome) : ''"
    :description="criando ? tf.descricaoCriar : undefined"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <div v-if="rascunho" :class="marca">
        <UAlert v-if="!admin" :title="t.config.semPermissao" icon="i-lucide-lock" color="neutral" variant="subtle" class="mb-4" />
        <UTabs v-model="aba" :items="abas" variant="link" :content="false" class="sticky -top-4 z-10 -mx-4 -mt-4 mb-5 w-[calc(100%+2rem)] bg-default px-4 pt-4 sm:-top-6 sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+3rem)] sm:px-6 sm:pt-6" :ui="{ list: 'overflow-x-auto overflow-y-hidden [scrollbar-width:none]', trigger: 'flex-none', label: 'overflow-visible' }" />

        <fieldset :disabled="!admin" class="space-y-5">
          <!-- GERAL -->
          <template v-if="aba === 'geral'">
            <!-- começar de um modelo: só na criação -->
            <UFormField v-if="criando && prj.modelos.value.length" :label="t.modelo.comecarDe">
              <USelect v-model="rascunho.modelo" :items="opcoesDeModelo" class="w-full" :icon="modelo ? modelo.icone : 'i-lucide-square-dashed'">
                <template #item-trailing="{ item }">
                  <span v-if="(item as any).autor" class="text-xs text-muted">{{ (item as any).autor }}</span>
                  <UTooltip :text="(item as any).dica" :content="{ side: 'right' }">
                    <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="(item as any).dica" />
                  </UTooltip>
                </template>
              </USelect>
              <div v-if="modelo" class="mt-2 rounded-md border border-default bg-elevated/40 px-3 py-2.5 animate-[entrada_0.15s_ease-out_both]">
                <p class="text-sm font-medium text-highlighted">{{ t.modelo.traz }}</p>
                <ul class="mt-1.5 space-y-1 text-sm text-toned">
                  <li class="flex items-start gap-2"><UIcon name="i-lucide-database" class="mt-0.5 size-4 shrink-0 text-muted" />{{ t.modelo.categoriasNovas(modelo.categorias.map(c => c.nome).join(', ')) }}</li>
                  <li class="flex items-start gap-2"><UIcon name="i-lucide-columns-3" class="mt-0.5 size-4 shrink-0 text-muted" />{{ t.modelo.estrutura }}</li>
                  <li v-if="modelo.fluxos" class="flex items-start gap-2"><UIcon name="i-lucide-workflow" class="mt-0.5 size-4 shrink-0 text-muted" />{{ t.modelo.fluxos(modelo.fluxos) }}</li>
                  <li v-if="modelo.avisos" class="flex items-start gap-2"><UIcon name="i-lucide-bell-ring" class="mt-0.5 size-4 shrink-0 text-muted" />{{ t.modelo.avisos(modelo.avisos) }}</li>
                  <li v-if="modelo.paineis" class="flex items-start gap-2"><UIcon name="i-lucide-chart-column" class="mt-0.5 size-4 shrink-0 text-muted" />{{ t.modelo.paineis }}</li>
                </ul>
                <p class="mt-2 flex items-start gap-1.5 text-xs text-muted"><UIcon name="i-lucide-shield-check" class="mt-px size-3.5 shrink-0" />{{ t.modelo.naoTraz }}</p>
              </div>
            </UFormField>

            <div class="flex items-start gap-3">
              <UFormField :label="t.criar.icone">
                <UPopover :content="{ align: 'start' }">
                  <UButton color="neutral" variant="outline" class="size-10 justify-center p-0" :aria-label="t.criar.escolherIcone">
                    <span class="flex size-7 items-center justify-center rounded-md" :class="COR_DO_PROJETO[rascunho.cor]"><UIcon :name="rascunho.icone" class="size-4" /></span>
                  </UButton>
                  <template #content>
                    <div class="w-64 space-y-3 p-3">
                      <div class="grid grid-cols-6 gap-1">
                        <UButton v-for="i in ICONES" :key="i" :icon="i" size="sm" color="neutral" :variant="rascunho.icone === i ? 'soft' : 'ghost'" :aria-pressed="rascunho.icone === i" :aria-label="i.replace('i-lucide-', '')" @click="rascunho.icone = i" />
                      </div>
                      <div class="flex gap-1.5">
                        <button
                          v-for="c in CORES"
                          :key="c"
                          type="button"
                          class="size-6 rounded-full ring-offset-2 ring-offset-default transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
                          :class="[COR_DO_PROJETO[c], rascunho.cor === c ? 'ring-2 ring-primary' : '']"
                          :aria-label="c"
                          :aria-pressed="rascunho.cor === c"
                          @click="rascunho.cor = c"
                        />
                      </div>
                    </div>
                  </template>
                </UPopover>
              </UFormField>
              <UFormField :label="t.criar.nome" :help="erroNome ? undefined : t.criar.nomeDica" :error="erroNome" required class="flex-1">
                <UInput v-model="rascunho.nome" class="w-full" autofocus maxlength="60" />
              </UFormField>
            </div>

            <UFormField :label="t.config.referencia" :help="erroReferencia ? undefined : criando ? tf.referenciaCriar : tf.referenciaFixa" :error="erroReferencia">
              <UInput
                v-if="criando"
                :model-value="rascunho.referencia"
                class="w-full font-mono"
                maxlength="60"
                icon="i-lucide-link"
                @update:model-value="digitarReferencia(String($event))"
              />
              <UInput v-else :model-value="rascunho.referencia" readonly disabled class="w-full font-mono" icon="i-lucide-lock" />
            </UFormField>

            <UFormField :label="t.criar.descricao">
              <UTextarea v-model="rascunho.descricao" :rows="2" autoresize class="w-full" />
            </UFormField>

            <UCheckbox v-model="rascunho.noMenuDeTodos" :label="t.criar.noMenuDeTodos" :description="t.criar.noMenuDeTodosDica" />

            <!-- só na edição: salvar como modelo -->
            <div v-if="!criando && p" class="rounded-md border border-default p-4" :class="marcaBack">
              <p class="text-sm font-semibold text-highlighted">{{ t.modelo.salvarComo }}</p>
              <p class="mt-1 text-sm text-muted">{{ t.modelo.salvarComoTexto }}</p>
              <UButton :label="t.modelo.salvarComo" icon="i-lucide-copy-plus" color="neutral" variant="outline" size="sm" class="mt-3" :disabled="!categoriasDoForm.length" @click="prj.janelas.modelo.value = p.id" />
            </div>

            <!-- só na edição: arquivar e excluir, no pé da aba Geral -->
            <section v-if="!criando && p" id="form-projeto-arquivar" class="space-y-3 border-t border-default pt-5">
              <h3 class="text-sm font-semibold text-highlighted">{{ tf.arquivarTitulo }}</h3>
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
            </section>
          </template>

          <!-- CATEGORIAS E CAMPOS -->
          <template v-else-if="aba === 'categorias'">
            <p class="text-sm text-muted">{{ tf.categoriasIntro }}</p>

            <UFormField :label="tf.adicionar" :help="tf.adicionarDica">
              <USelectMenu
                v-model="escolhida"
                v-model:search-term="buscaCategoria"
                :items="opcoesDeCategoria"
                value-key="value"
                icon="i-lucide-plus"
                class="w-full"
                :placeholder="tf.adicionarPlaceholder"
                :search-input="{ placeholder: t.dados.buscar }"
                :ui="{ content: 'min-w-80' }"
              >
                <template #item-trailing="{ item }">
                  <span v-if="(item as any).dono" class="text-xs text-muted">{{ tf.emOutroProjeto((item as any).dono) }}</span>
                </template>
                <template #content-bottom>
                  <AtalhoDeCriar :termo="buscaCategoria" :rotulo="ta.categoria.rotulo" :com="ta.categoria.com" :dica="ta.categoria.dica" @criar="criarCategoria" />
                </template>
              </USelectMenu>
            </UFormField>

            <UAlert v-if="criando && modelo" :description="tf.doModelo(modelo.categorias.map(c => c.nome).join(', '))" icon="i-lucide-copy-plus" color="neutral" variant="subtle" />
            <p v-if="!categoriasDoForm.length" class="rounded-md border border-dashed border-default px-3 py-6 text-center text-sm text-muted">{{ tf.semCategorias }}</p>

            <ul v-else class="space-y-3" :class="marcaBack">
              <li v-for="c in categoriasDoForm" :key="c.id" class="rounded-md border border-default animate-[entrada_0.15s_ease-out_both]">
                <!-- a categoria -->
                <div class="flex items-center gap-2.5 border-b border-default px-3 py-2.5">
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-elevated text-toned"><UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4" /></span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-medium text-highlighted">{{ c.name }}</span>
                    <span class="block text-xs text-muted">{{ c.itens || camposDaCat(c.id) ? t.pagina.itens(c.itens) : tf.nova }}</span>
                  </span>
                  <UTooltip v-if="criando" :text="tf.tirar">
                    <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" :aria-label="tf.tirar" @click="tirar(c.id)" />
                  </UTooltip>
                  <UDropdownMenu v-else :items="acoesDaCategoria(c.id)" :content="{ align: 'end' }">
                    <UButton icon="i-lucide-ellipsis" size="xs" color="neutral" variant="ghost" :aria-label="tf.acoesDa(c.name)" />
                  </UDropdownMenu>
                </div>

                <!-- os campos que ela empresta ao projeto -->
                <div class="space-y-2 p-3">
                  <div>
                    <p class="text-xs font-medium text-toned">{{ tf.camposTitulo }}</p>
                    <p class="text-xs text-muted">{{ tf.camposDica }}</p>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-3">
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
                </div>

                <!-- os grupos do status: cada valor da categoria entra em 1 dos 3 grupos do projeto -->
                <div class="border-t border-default p-3">
                  <template v-if="rascunho.mapa[c.id]?.status && camposDaCat(c.id)">
                    <p class="text-xs font-medium text-toned">{{ tf.gruposTitulo }}</p>
                    <p class="mt-0.5 text-xs text-muted">{{ tf.gruposDica(rascunho.mapa[c.id]!.status!) }}</p>
                    <div class="mt-2 overflow-hidden rounded-md border border-default">
                      <div class="grid grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,12rem)] items-center gap-2 bg-elevated/50 px-3 py-1.5 text-xs font-medium text-muted">
                        <span>{{ tf.valorDe(rascunho.mapa[c.id]!.status!) }}</span>
                        <span />
                        <span>{{ tf.grupoNoProjeto }}</span>
                      </div>
                      <div v-for="v in camposDaCat(c.id)!.valores" :key="v.valor" class="grid grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,12rem)] items-center gap-2 border-t border-default px-3 py-1.5">
                        <span class="min-w-0"><UBadge :label="v.valor" color="neutral" variant="outline" size="sm" class="max-w-full truncate" /></span>
                        <UIcon name="i-lucide-arrow-right" class="size-4 text-dimmed" />
                        <USelect
                          :model-value="rascunho.mapa[c.id]!.grupos[v.valor] ?? 'aberto'"
                          :items="opcoesDeGrupo"
                          :icon="ICONE_DO_GRUPO[rascunho.mapa[c.id]!.grupos[v.valor] ?? 'aberto']"
                          size="xs"
                          class="w-full"
                          :ui="{ leadingIcon: `text-${COR_DO_GRUPO[rascunho.mapa[c.id]!.grupos[v.valor] ?? 'aberto']}` }"
                          :aria-label="`${v.valor}: ${tf.grupoNoProjeto}`"
                          @update:model-value="(g: GrupoDeStatus) => setGrupo(c.id, v.valor, g)"
                        />
                      </div>
                    </div>
                  </template>
                  <p v-else class="flex items-start gap-1.5 text-xs text-muted"><UIcon name="i-lucide-info" class="mt-px size-3.5 shrink-0" />{{ tf.semStatus }}</p>
                </div>
              </li>
            </ul>
          </template>

          <!-- ACESSO E SEGURANÇA -->
          <template v-else>
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
            <UAlert v-if="abre && p" :title="t.config.abreTitulo" :description="t.config.abreTexto(prj.categoriasDe(p.id).length)" icon="i-lucide-triangle-alert" color="warning" variant="subtle" />

            <UFormField :label="tf.participantesTitulo" :help="criando ? t.criar.participantesDica : undefined">
              <ul class="mb-2 divide-y divide-default rounded-md border border-default">
                <li v-if="criando" class="flex items-center gap-2.5 px-3 py-2">
                  <UAvatar size="xs" :text="iniciais(prj.euPessoa.value.nome)" :alt="prj.euPessoa.value.nome" />
                  <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ prj.euPessoa.value.nome }} <span class="text-muted">({{ t.criar.voce }})</span></span>
                  <UBadge :label="t.papel.admin" size="sm" color="primary" variant="soft" />
                </li>
                <li v-for="h in herdados" :key="`h-${h.id}`" class="flex items-center gap-2.5 px-3 py-2">
                  <UAvatar size="xs" :text="iniciais(h.nome)" :alt="h.nome" />
                  <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ h.nome }}</span>
                  <UTooltip :text="t.config.herdadoDica">
                    <UBadge :label="t.config.herdado" icon="i-lucide-building" size="sm" color="neutral" variant="subtle" />
                  </UTooltip>
                </li>
                <li v-for="(x, i) in rascunho.participantes" :key="chave(x)" class="flex items-center gap-2.5 px-3 py-2 animate-[entrada_0.15s_ease-out_both]">
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
              <USelectMenu v-model="novo" :items="opcoesDeParticipante" value-key="value" icon="i-lucide-user-plus" class="w-full" :placeholder="t.criar.adicionar" :search-input="{ placeholder: t.criar.buscarParticipante }">
                <template #item-trailing="{ item }">
                  <span v-if="(item as any).contagem" class="text-xs text-muted">{{ t.diretorio.pessoas((item as any).contagem) }}</span>
                  <span v-else-if="(item as any).empresa" class="text-xs text-muted">{{ (item as any).empresa }}</span>
                </template>
              </USelectMenu>
            </UFormField>

            <UFormField :label="t.config.permissaoPadrao" :help="t.config.permissaoPadraoDica">
              <div class="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <UCheckbox v-for="a in acoesDaPermissao" :key="a.k" v-model="rascunho.permissaoPadrao[a.k]" :label="a.r" />
              </div>
            </UFormField>

            <div v-if="!criando">
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
        </fieldset>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center gap-2">
        <template v-if="criando">
          <span class="flex-1" />
          <UButton :label="t.criar.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
          <UButton :label="t.criar.confirmar" icon="i-lucide-check" color="primary" :loading="salvando" @click="criar" />
        </template>
        <template v-else>
          <span v-if="alterado" class="flex items-center gap-1.5 text-xs text-warning"><UIcon name="i-lucide-circle-dot" class="size-3.5" />{{ t.config.naoSalvo }}</span>
          <span class="flex-1" />
          <UButton v-if="alterado" :label="t.config.descartar" color="neutral" variant="ghost" @click="carregar" />
          <UButton :label="t.config.salvar" icon="i-lucide-check" color="primary" :disabled="!alterado || !admin" :loading="salvando" @click="salvar" />
        </template>
      </div>
    </template>
  </USlideover>
  <SalvarComoModelo :t="t" />
</template>

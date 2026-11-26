<script setup lang="ts">
/**
 * Rodada 8, revista na 9: a tela Metas, no workspace. Proposta inteira, sem tela no develop.
 *
 * A meta (ou iniciativa) mora acima dos projetos: tem 1 dono no workspace e liga projetos e marcos de vários
 * projetos, como a initiative do Linear e os goals do Asana. Rodada 9: a meta escolhe como medir.
 *  - Automático, pelos marcos: a média dos marcos que contam (os ligados e todos os dos projetos ligados). O
 *    marco avança quando as tarefas dele são concluídas, então o trabalho do dia (concluir tarefa no projeto)
 *    move a meta sem ninguém digitar porcentagem. Projeto sem marco não entra na conta, e o painel diz isso.
 *  - Por um valor: início, alvo e unidade; o dono informa o valor atual ao publicar a atualização. Projetos e
 *    marcos ficam ligados para acompanhar.
 * O painel da meta mostra a conta: quais marcos contam, por qual caminho e com quanto. O projeto que a pessoa
 * não vê aparece como "Projeto sem acesso", sem nome, e continua na conta. A situação é a da última atualização.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnTableColumn, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import type { Situacao } from './mocks'
import { iniciais, pessoa, pessoas } from './mocks'
import { COR_DA_SITUACAO, ICONE_DA_SITUACAO, COR_DO_PROJETO, useMarcaDeProposta, useProjetos } from './estado'
import { useMetasEDiscussoes, type Marco, type Medicao, type Meta, type Unidade } from './metasEDiscussoes'
import { textosDeMetasEDiscussoes } from './textosDeMetasEDiscussoes'
import { textosDeMarcosEMedicao } from './textosDeMarcosEMedicao'

const props = defineProps<{ t: Textos }>()
const prj = useProjetos()
const md = useMetasEDiscussoes()
const tx = useTextos(textosDeMetasEDiscussoes)
const tg = computed(() => tx.value.metas)
const tmm = useTextos(textosDeMarcosEMedicao)
const tv = computed(() => tmm.value.medicao)
const idioma = useIdioma()
const toast = useToast()
const { marca } = useMarcaDeProposta()

const data = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value, { day: '2-digit', month: 'short', year: 'numeric' })
const corDoProgresso = (n: number | null) => n === 100 ? 'success' : 'primary'
function formatar(n: number, u: Unidade) {
  const v = n.toLocaleString(idioma.value)
  if (u === 'percentual') return `${v}%`
  if (u === 'reais') return `R$ ${v}`
  return v
}

/* ---------- lista ---------- */
const busca = ref('')
const ordem = ref<EnTableSort | null>({ key: 'dataAlvo', direction: 'asc' })
const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'nome', label: tg.value.colunas.nome!, sortable: true },
  { key: 'situacao', label: tg.value.colunas.situacao!, sortable: true },
  { key: 'progresso', label: tg.value.colunas.progresso!, sortable: true },
  { key: 'medicao', label: tv.value.rotulo, sortable: true },
  { key: 'dataAlvo', label: tg.value.colunas.dataAlvo!, sortable: true },
  { key: 'dono', label: tg.value.colunas.dono!, sortable: true },
  { key: 'ligacoes', label: tg.value.colunas.ligacoes! },
])
const linhas = computed(() => {
  const q = normalizar(busca.value.trim())
  const rs = md.metas.value
    .filter(m => !q || normalizar(`${m.nome} ${m.descricao}`).includes(q))
    .map(m => ({ ...m, situacao: md.situacaoDaMeta(m) ?? '', progresso: md.progressoDaMeta(m), donoNome: pessoa(m.dono)?.nome ?? '' }))
  const o = ordem.value
  if (!o) return rs
  const k = o.key === 'dono' ? 'donoNome' : o.key
  return [...rs].sort((a, b) => {
    const va = (a as Record<string, unknown>)[k] as string | number
    const vb = (b as Record<string, unknown>)[k] as string | number
    return (va < vb ? -1 : va > vb ? 1 : 0) * (o.direction === 'asc' ? 1 : -1)
  })
})
const textoDoProgresso = (m: Meta) => m.medicao === 'valor' && m.valor
  ? tv.value.deAte(formatar(md.valorAtual(m), m.valor.unidade), formatar(m.valor.alvo, m.valor.unidade))
  : `${md.progressoDaMeta(m)}%`

/* ---------- a meta aberta ---------- */
const aberta = computed(() => md.metas.value.find(m => m.id === md.metaAberta.value) ?? null)
const painel = computed({
  get: () => !!aberta.value,
  set: (v: boolean) => { if (!v) md.metaAberta.value = null },
})
const projetoDe = (id: number) => prj.projetos.value.find(p => p.id === id)
const marcoDe = (id: number) => md.marcos.value.find(m => m.id === id)
const podeEditar = computed(() => !!aberta.value && md.podeEditarMeta(aberta.value))
const acoes = computed<DropdownMenuItem[][]>(() => {
  const m = aberta.value
  if (!m || !podeEditar.value) return []
  return [
    [{ label: tv.value.editar, icon: 'i-lucide-pencil', onSelect: () => abrirForm(m) }],
    [{ label: tv.value.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => { aExcluir.value = m } }],
  ]
})
/** Os projetos e os marcos que a pessoa vê, para ligar; os que ela não vê continuam ligados. */
const opProjetos = computed(() => prj.ativos.value.filter(p => prj.enxerga(p)).map(p => ({ value: p.id, label: p.nome, icon: p.icone })))
const opMarcos = computed(() => md.marcos.value.filter(m => md.veProjeto(m.projeto)).map(m => ({ value: m.id, label: m.nome, description: projetoDe(m.projeto)?.nome })))
function ligar(tipo: 'projetos' | 'marcos', ids: number[]) {
  const m = aberta.value
  if (!m) return
  const ocultos = m[tipo].filter(id => tipo === 'projetos' ? !md.veProjeto(id) : !md.veProjeto(marcoDe(id)?.projeto ?? 0))
  m[tipo] = [...ocultos, ...ids]
}
const projetosVisiveisDa = (m: Meta) => m.projetos.filter(id => md.veProjeto(id))
const marcosVisiveisDa = (m: Meta) => m.marcos.filter(id => md.veProjeto(marcoDe(id)?.projeto ?? 0))
/** O caminho pelo qual o marco conta: pelo projeto ligado ou ligado direto à meta. */
function caminho(meta: Meta, m: Marco) {
  if (meta.projetos.includes(m.projeto)) return md.veProjeto(m.projeto) ? tv.value.viaProjeto(projetoDe(m.projeto)?.nome ?? '') : tv.value.viaProjetoSemAcesso
  return tv.value.ligadoDireto
}
const formula = (m: Meta) => {
  if (m.medicao === 'valor' && m.valor) return tv.value.formulaValor(formatar(m.valor.inicial, m.valor.unidade))
  const n = md.marcosQueContam(m).length
  return n ? tv.value.formulaAutomatica(n) : tv.value.formulaSemMarcos
}

/* publicar atualização */
const aSituacao = ref<Situacao>('noPrazo')
const aTexto = ref('')
const aValor = ref<number>(0)
const opSituacao = computed(() => (['noPrazo', 'emRisco', 'atrasado', 'concluido'] as const).map(s => ({ value: s, label: props.t.situacao[s], icon: ICONE_DA_SITUACAO[s] })))
function publicar() {
  const m = aberta.value
  if (!m || !aTexto.value.trim()) return
  md.publicarAtualizacao(m, aSituacao.value, aTexto.value.trim(), m.medicao === 'valor' ? Number(aValor.value) : undefined)
  aTexto.value = ''
  toast.add({ title: tg.value.atualizacaoPublicada, icon: 'i-lucide-check', color: 'success' })
}
watch(aberta, (m) => {
  aSituacao.value = (m && md.situacaoDaMeta(m)) || 'noPrazo'
  aTexto.value = ''
  aValor.value = m ? md.valorAtual(m) : 0
})

/* ---------- criar e editar ---------- */
const form = ref(false)
const fId = ref<number | undefined>()
const fNome = ref('')
const fDescricao = ref('')
const fDono = ref<number>(prj.eu.value)
const fData = ref('2026-12-31')
const fMedicao = ref<Medicao>('automatica')
const fInicial = ref(0)
const fAlvo = ref(100)
const fUnidade = ref<Unidade>('percentual')
const fProjetos = ref<number[]>([])
const fMarcos = ref<number[]>([])
const opDono = computed(() => pessoas.filter(p => !p.convidado).map(p => ({ value: p.id, label: p.nome })))
const opMedicao = computed(() => (['automatica', 'valor'] as const).map(v => ({ value: v, label: tv.value.opcoes[v], icon: v === 'automatica' ? 'i-lucide-flag' : 'i-lucide-hash' })))
const opUnidade = computed(() => (['percentual', 'reais', 'numero'] as const).map(v => ({ value: v, label: tv.value.unidades[v] })))
function abrirForm(m?: Meta) {
  fId.value = m?.id
  fNome.value = m?.nome ?? ''
  fDescricao.value = m?.descricao ?? ''
  fDono.value = m?.dono ?? prj.eu.value
  fData.value = m?.dataAlvo ?? '2026-12-31'
  fMedicao.value = m?.medicao ?? 'automatica'
  fInicial.value = m?.valor?.inicial ?? 0
  fAlvo.value = m?.valor?.alvo ?? 100
  fUnidade.value = m?.valor?.unidade ?? 'percentual'
  fProjetos.value = m ? [...m.projetos] : []
  fMarcos.value = m ? [...m.marcos] : []
  form.value = true
}
function salvar() {
  if (!fNome.value.trim()) return
  const novo = !fId.value
  const m = md.salvarMeta({
    id: fId.value,
    nome: fNome.value.trim(),
    descricao: fDescricao.value.trim(),
    dono: fDono.value,
    dataAlvo: fData.value,
    medicao: fMedicao.value,
    valor: fMedicao.value === 'valor' ? { inicial: Number(fInicial.value), alvo: Number(fAlvo.value), unidade: fUnidade.value } : undefined,
    projetos: fProjetos.value,
    marcos: fMarcos.value,
  })
  form.value = false
  toast.add({ title: novo ? tg.value.criada(m.nome) : tv.value.salva(m.nome), icon: 'i-lucide-target', color: 'success' })
  md.metaAberta.value = m.id
}

/* ---------- excluir ---------- */
const aExcluir = ref<Meta | null>(null)
function excluir() {
  const m = aExcluir.value!
  md.excluirMeta(m)
  aExcluir.value = null
  toast.add({ title: tv.value.excluida(m.nome), icon: 'i-lucide-trash-2', color: 'neutral' })
}
</script>

<template>
  <div>
    <div class="flex flex-col" :class="marca">
      <div class="flex flex-wrap items-start gap-3 px-6 pb-3 pt-5">
        <div class="min-w-0 flex-1">
          <h1 class="text-xl font-semibold text-highlighted">{{ tg.titulo }}</h1>
          <p class="mt-0.5 text-sm text-muted">{{ tg.subtitulo }}</p>
        </div>
        <UTooltip :text="prj.souDono.value ? '' : tg.soDono" :disabled="prj.souDono.value">
          <UButton :label="tg.nova" icon="i-lucide-plus" size="sm" :disabled="!prj.souDono.value" @click="abrirForm()" />
        </UTooltip>
      </div>

      <div class="flex shrink-0 flex-wrap items-center gap-1.5 border-y border-default px-3 py-2 sm:px-4">
        <UChip :show="!!busca.trim()" color="error" size="sm">
          <UInput v-model="busca" :placeholder="tg.buscar" icon="i-lucide-search" size="sm" variant="soft" class="w-56" :aria-label="tg.buscar" />
        </UChip>
      </div>

      <div class="px-3 pt-2 sm:px-4">
        <EnTable
          :columns="colunas"
          :rows="linhas"
          :sort="ordem"
          :empty-state="{ icon: 'i-lucide-target', title: tg.vazioTitulo, description: tg.vazioTexto }"
          :locale="idioma"
          @sort-change="ordem = $event"
          @row-click="(row: any) => { md.metaAberta.value = row.id }"
        >
          <template #cell-nome="{ row }">
            <span class="flex min-w-0 items-center gap-2">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><UIcon name="i-lucide-target" class="size-4" /></span>
              <span class="min-w-0">
                <span class="block truncate text-sm font-medium text-highlighted">{{ (row as any).nome }}</span>
                <span class="block truncate text-xs text-muted">{{ (row as any).descricao }}</span>
              </span>
            </span>
          </template>
          <template #cell-situacao="{ row }">
            <UBadge v-if="(row as any).situacao" :label="t.situacao[(row as any).situacao as Situacao]" :icon="ICONE_DA_SITUACAO[(row as any).situacao as Situacao]" :color="COR_DA_SITUACAO[(row as any).situacao as Situacao]" variant="soft" size="sm" />
            <span v-else class="text-xs text-muted">{{ tg.semSituacao }}</span>
          </template>
          <template #cell-progresso="{ row }">
            <span class="flex w-full items-center gap-2">
              <UProgress :model-value="(row as any).progresso" :color="corDoProgresso((row as any).progresso)" size="sm" class="flex-1" />
              <span class="min-w-9 text-right text-xs tabular-nums text-toned">{{ textoDoProgresso(row as Meta) }}</span>
            </span>
          </template>
          <template #cell-medicao="{ row }">
            <span class="flex items-center gap-1.5 text-sm text-toned">
              <UIcon :name="(row as Meta).medicao === 'automatica' ? 'i-lucide-flag' : 'i-lucide-hash'" class="size-3.5 shrink-0 text-muted" />
              <span class="truncate">{{ tv.opcoes[(row as Meta).medicao] }}</span>
            </span>
          </template>
          <template #cell-dataAlvo="{ row }">
            <span class="text-sm text-toned">{{ data((row as any).dataAlvo) }}</span>
          </template>
          <template #cell-dono="{ row }">
            <span class="flex min-w-0 items-center gap-2">
              <UAvatar :text="iniciais((row as any).donoNome)" :alt="(row as any).donoNome" size="2xs" />
              <span class="truncate text-sm text-toned">{{ (row as any).donoNome }}</span>
            </span>
          </template>
          <template #cell-ligacoes="{ row }">
            <span class="text-xs text-muted">{{ tg.ligacoes((row as any).projetos.length, (row as any).marcos.length) }}</span>
          </template>
        </EnTable>
      </div>
    </div>

    <!-- a meta aberta -->
    <USlideover v-model:open="painel" side="right" :ui="{ content: 'max-w-xl' }" :title="aberta?.nome" :description="aberta?.descricao">
      <template v-if="aberta" #title>
        <span class="flex items-center gap-2">
          <UIcon name="i-lucide-target" class="size-5 shrink-0 text-primary" />{{ aberta.nome }}
        </span>
      </template>
      <template v-if="aberta && acoes.length" #actions>
        <UDropdownMenu :items="acoes" :content="{ align: 'end' }">
          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="sm" :aria-label="tv.acoes" />
        </UDropdownMenu>
      </template>
      <template v-if="aberta" #body>
        <div class="flex flex-col gap-5">
          <!-- o progresso e a conta -->
          <div class="flex flex-col gap-1.5 rounded-lg border border-default p-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-semibold tabular-nums text-highlighted">{{ md.progressoDaMeta(aberta) }}%</span>
              <span v-if="aberta.medicao === 'valor' && aberta.valor" class="text-sm text-muted">{{ textoDoProgresso(aberta) }}</span>
              <UBadge v-if="md.situacaoDaMeta(aberta)" class="ml-auto" :label="t.situacao[md.situacaoDaMeta(aberta)!]" :icon="ICONE_DA_SITUACAO[md.situacaoDaMeta(aberta)!]" :color="COR_DA_SITUACAO[md.situacaoDaMeta(aberta)!]" variant="soft" />
            </div>
            <UProgress :model-value="md.progressoDaMeta(aberta)" :color="corDoProgresso(md.progressoDaMeta(aberta))" />
            <p class="flex items-start gap-1.5 text-xs text-muted">
              <UIcon :name="aberta.medicao === 'automatica' ? 'i-lucide-flag' : 'i-lucide-hash'" class="mt-px size-3.5 shrink-0" />
              <span><span class="font-medium text-toned">{{ tv.opcoes[aberta.medicao] }}.</span> {{ formula(aberta) }}</span>
            </p>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-lg border border-default p-3">
              <p class="text-xs text-muted">{{ tg.dataAlvo }}</p>
              <p class="mt-0.5 text-sm font-medium text-highlighted">{{ data(aberta.dataAlvo) }}</p>
            </div>
            <div class="col-span-2 rounded-lg border border-default p-3">
              <p class="text-xs text-muted">{{ tg.dono }}</p>
              <p class="mt-0.5 flex items-center gap-2 text-sm font-medium text-highlighted">
                <UAvatar :text="iniciais(pessoa(aberta.dono)?.nome ?? '')" size="2xs" />{{ pessoa(aberta.dono)?.nome }}
              </p>
            </div>
          </div>

          <!-- automático: os marcos que contam, com o caminho de cada um -->
          <section v-if="aberta.medicao === 'automatica'" class="flex flex-col gap-2">
            <header class="flex items-center gap-2">
              <h3 class="flex-1 text-sm font-semibold text-highlighted">{{ tv.marcosQueContam }}</h3>
            </header>
            <p v-if="!md.marcosQueContam(aberta).length" class="rounded-lg border border-dashed border-default px-3 py-4 text-center text-xs text-muted">{{ tv.formulaSemMarcos }}</p>
            <ul v-else class="flex flex-col divide-y divide-default rounded-lg border border-default">
              <li v-for="m in md.marcosQueContam(aberta)" :key="m.id">
                <component
                  :is="md.veProjeto(m.projeto) ? 'button' : 'div'"
                  type="button"
                  class="flex w-full items-center gap-3 px-3 py-2 text-left"
                  :class="md.veProjeto(m.projeto) ? 'transition-colors hover:bg-elevated/60' : ''"
                  @click="md.veProjeto(m.projeto) && (painel = false, md.abrirMarco(m))"
                >
                  <UIcon :name="m.status === 'concluido' ? 'i-lucide-circle-check' : 'i-lucide-flag'" class="size-4 shrink-0" :class="m.status === 'concluido' ? 'text-success' : 'text-muted'" />
                  <span v-if="md.veProjeto(m.projeto)" class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-medium text-highlighted">{{ m.nome }}</span>
                    <span class="block truncate text-xs text-muted">{{ caminho(aberta, m) }} · {{ data(m.dataAlvo) }}</span>
                  </span>
                  <UTooltip v-else :text="tg.semAcessoDica" class="min-w-0 flex-1">
                    <span class="block truncate text-sm italic text-muted">{{ tg.marcoSemAcesso }}</span>
                  </UTooltip>
                  <UProgress :model-value="md.progressoDoMarco(m)" :color="corDoProgresso(md.progressoDoMarco(m))" size="sm" class="w-24" />
                  <span class="w-9 text-right text-xs tabular-nums text-toned">{{ md.progressoDoMarco(m) }}%</span>
                </component>
              </li>
            </ul>
          </section>

          <!-- os projetos ligados -->
          <section class="flex flex-col gap-2">
            <header class="flex items-center gap-2">
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-semibold text-highlighted">{{ aberta.medicao === 'automatica' ? tg.projetos : tv.acompanhamento }}</h3>
                <p class="text-xs text-muted">{{ aberta.medicao === 'automatica' ? tv.projetoContaPelosMarcos : tv.acompanhamentoDica }}</p>
              </div>
              <USelectMenu v-if="podeEditar" :model-value="projetosVisiveisDa(aberta)" :items="opProjetos" value-key="value" multiple size="xs" class="w-44" :placeholder="tg.ligarProjetos" @update:model-value="ligar('projetos', $event as number[])">
                <template #default>{{ tg.ligarProjetos }}</template>
              </USelectMenu>
            </header>
            <p v-if="!aberta.projetos.length" class="text-xs text-muted">{{ tg.nenhumLigado }}</p>
            <ul v-else class="flex flex-col divide-y divide-default rounded-lg border border-default">
              <li v-for="id in aberta.projetos" :key="id" class="flex items-center gap-3 px-3 py-2">
                <template v-if="md.veProjeto(id)">
                  <span class="flex size-7 shrink-0 items-center justify-center rounded-md" :class="COR_DO_PROJETO[projetoDe(id)!.cor]"><UIcon :name="projetoDe(id)!.icone" class="size-4" /></span>
                  <span class="min-w-0 flex-1">
                    <button type="button" class="block max-w-full truncate text-left text-sm font-medium text-highlighted hover:underline" :title="tg.abrirProjeto" @click="painel = false; prj.abrirProjeto(id)">{{ projetoDe(id)!.nome }}</button>
                    <span class="block truncate text-xs text-muted">{{ md.marcosDo(id).length ? tmm.marcos.contagem(md.marcosDo(id).length) : tv.projetoSemMarcos }}</span>
                  </span>
                </template>
                <UTooltip v-else :text="tg.semAcessoDica" class="min-w-0 flex-1">
                  <span class="flex items-center gap-3">
                    <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-elevated text-muted"><UIcon name="i-lucide-lock" class="size-4" /></span>
                    <span class="truncate text-sm italic text-muted">{{ tg.semAcesso }}</span>
                  </span>
                </UTooltip>
                <template v-if="md.progressoDoProjeto(id) !== null">
                  <UProgress :model-value="md.progressoDoProjeto(id)!" :color="corDoProgresso(md.progressoDoProjeto(id))" size="sm" class="w-24" />
                  <span class="w-9 text-right text-xs tabular-nums text-toned">{{ md.progressoDoProjeto(id) }}%</span>
                </template>
                <UButton
                  v-else-if="md.veProjeto(id) && md.podeEditarMarcos(id)"
                  :label="tv.criarMarco"
                  icon="i-lucide-plus"
                  size="xs"
                  color="neutral"
                  variant="outline"
                  @click="painel = false; prj.abrirAba(id, 'marcos')"
                />
              </li>
            </ul>
          </section>

          <!-- os marcos ligados direto -->
          <section class="flex flex-col gap-2">
            <header class="flex items-center gap-2">
              <h3 class="flex-1 text-sm font-semibold text-highlighted">{{ tg.ligarMarcos }}</h3>
              <USelectMenu v-if="podeEditar" :model-value="marcosVisiveisDa(aberta)" :items="opMarcos" value-key="value" multiple size="xs" class="w-44" :placeholder="tg.ligarMarcos" @update:model-value="ligar('marcos', $event as number[])">
                <template #default>{{ tg.ligarMarcos }}</template>
              </USelectMenu>
            </header>
            <p v-if="!aberta.marcos.length" class="text-xs text-muted">{{ tg.nenhumLigado }}</p>
            <ul v-else class="flex flex-col divide-y divide-default rounded-lg border border-default">
              <li v-for="id in aberta.marcos" :key="id" class="flex items-center gap-3 px-3 py-2">
                <UIcon name="i-lucide-flag" class="size-4 shrink-0 text-muted" />
                <span v-if="marcoDe(id) && md.veProjeto(marcoDe(id)!.projeto)" class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-medium text-highlighted">{{ marcoDe(id)!.nome }}</span>
                  <span class="block truncate text-xs text-muted">{{ projetoDe(marcoDe(id)!.projeto)?.nome }} · {{ data(marcoDe(id)!.dataAlvo) }}</span>
                </span>
                <span v-else class="min-w-0 flex-1 truncate text-sm italic text-muted">{{ tg.marcoSemAcesso }}</span>
                <template v-if="marcoDe(id)">
                  <UProgress :model-value="md.progressoDoMarco(marcoDe(id)!)" :color="corDoProgresso(md.progressoDoMarco(marcoDe(id)!))" size="sm" class="w-24" />
                  <span class="w-9 text-right text-xs tabular-nums text-toned">{{ md.progressoDoMarco(marcoDe(id)!) }}%</span>
                </template>
              </li>
            </ul>
          </section>

          <!-- atualizações -->
          <section class="flex flex-col gap-2">
            <h3 class="text-sm font-semibold text-highlighted">{{ tg.atualizacoes }}</h3>
            <div v-if="podeEditar" class="flex flex-col gap-2 rounded-lg border border-default p-3">
              <div class="flex flex-wrap items-end gap-2">
                <UFormField :label="tg.situacao" size="sm">
                  <USelect v-model="aSituacao" :items="opSituacao" size="sm" class="w-40" />
                </UFormField>
                <UFormField v-if="aberta.medicao === 'valor' && aberta.valor" :label="tv.valorAtual" size="sm">
                  <UInput v-model.number="aValor" type="number" size="sm" class="w-32">
                    <template v-if="aberta.valor.unidade !== 'numero'" #trailing>
                      <span class="text-xs text-muted">{{ aberta.valor.unidade === 'percentual' ? '%' : 'R$' }}</span>
                    </template>
                  </UInput>
                </UFormField>
              </div>
              <UTextarea v-model="aTexto" :placeholder="tg.textoDaAtualizacao" :rows="2" autoresize class="w-full" />
              <div class="flex justify-end">
                <UButton :label="tg.publicar" icon="i-lucide-send" size="sm" :disabled="!aTexto.trim()" @click="publicar" />
              </div>
            </div>
            <ol class="flex flex-col gap-3">
              <li v-for="(a, i) in aberta.atualizacoes" :key="i" class="flex gap-3">
                <UIcon :name="ICONE_DA_SITUACAO[a.situacao]" class="mt-0.5 size-4 shrink-0" :class="`text-${COR_DA_SITUACAO[a.situacao]}`" />
                <div class="min-w-0 flex-1">
                  <p class="text-xs text-muted">
                    {{ t.situacao[a.situacao] }} · {{ pessoa(a.autor)?.nome }} · {{ data(a.em) }}
                    <template v-if="a.valor !== undefined && aberta.valor"> · {{ tv.valorAtual }}: {{ formatar(a.valor, aberta.valor.unidade) }}</template>
                  </p>
                  <p class="mt-0.5 text-sm text-default">{{ a.texto }}</p>
                </div>
              </li>
            </ol>
          </section>
        </div>
      </template>
    </USlideover>

    <!-- criar e editar -->
    <UModal v-model:open="form" :title="fId ? tv.editar : tg.nova" :ui="{ footer: 'justify-end gap-2' }">
      <template #body>
        <form id="form-meta" class="flex flex-col gap-4" @submit.prevent="salvar">
          <UFormField :label="tg.nome" required>
            <UInput v-model="fNome" :placeholder="tg.nomePlaceholder" class="w-full" autofocus />
          </UFormField>
          <UFormField :label="tg.descricao">
            <UTextarea v-model="fDescricao" :rows="2" autoresize class="w-full" />
          </UFormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField :label="tg.dono">
              <USelect v-model="fDono" :items="opDono" class="w-full" />
            </UFormField>
            <UFormField :label="tg.dataAlvo">
              <UInput v-model="fData" type="date" class="w-full" />
            </UFormField>
          </div>
          <UFormField :label="tv.rotulo" :help="tv.dicas[fMedicao]">
            <USelect v-model="fMedicao" :items="opMedicao" class="w-full" />
          </UFormField>
          <div v-if="fMedicao === 'valor'" class="grid gap-4 sm:grid-cols-3">
            <UFormField :label="tv.inicial">
              <UInput v-model.number="fInicial" type="number" class="w-full" />
            </UFormField>
            <UFormField :label="tv.alvo">
              <UInput v-model.number="fAlvo" type="number" class="w-full" />
            </UFormField>
            <UFormField :label="tv.unidade">
              <USelect v-model="fUnidade" :items="opUnidade" class="w-full" />
            </UFormField>
          </div>
          <UFormField :label="tg.ligarProjetos" :help="fMedicao === 'automatica' ? tv.projetoContaPelosMarcos : tv.acompanhamentoDica">
            <USelectMenu v-model="fProjetos" :items="opProjetos" value-key="value" multiple class="w-full" />
          </UFormField>
          <UFormField :label="tg.ligarMarcos">
            <USelectMenu v-model="fMarcos" :items="opMarcos" value-key="value" multiple class="w-full" />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <UButton :label="tg.cancelar" color="neutral" variant="outline" @click="form = false" />
        <UButton type="submit" form="form-meta" :label="fId ? tv.salvar : tg.criar" icon="i-lucide-target" :disabled="!fNome.trim()" />
      </template>
    </UModal>

    <!-- excluir -->
    <UModal :open="!!aExcluir" :title="tv.excluirTitulo" :description="tv.excluirTexto" :ui="{ footer: 'justify-end gap-2' }" @update:open="(v: boolean) => { if (!v) aExcluir = null }">
      <template #footer>
        <UButton :label="tg.cancelar" color="neutral" variant="outline" @click="aExcluir = null" />
        <UButton :label="tv.excluir" icon="i-lucide-trash-2" color="error" @click="excluir" />
      </template>
    </UModal>
  </div>
</template>

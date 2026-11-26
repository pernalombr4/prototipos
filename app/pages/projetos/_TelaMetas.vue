<script setup lang="ts">
/**
 * Rodada 8: a tela Metas, no workspace. Proposta inteira, sem tela no develop.
 *
 * A meta (ou iniciativa) mora acima dos projetos: tem 1 dono no workspace e liga projetos e marcos
 * de vários projetos, como a initiative do Linear e os goals do Asana. O progresso é a média dos
 * marcos e dos projetos ligados, nunca item a item; o projeto que a pessoa não vê aparece como
 * "Projeto sem acesso", sem nome. A situação é a da última atualização, como o Status do projeto.
 * A lista usa o EnTable do SDK, como as listagens do produto; a meta abre no painel lateral.
 */
import type { EnTableColumn, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import type { Situacao } from './mocks'
import { iniciais, pessoa, pessoas } from './mocks'
import { COR_DA_SITUACAO, ICONE_DA_SITUACAO, COR_DO_PROJETO, useMarcaDeProposta, useProjetos } from './estado'
import { useMetasEDiscussoes, type Meta } from './metasEDiscussoes'
import { textosDeMetasEDiscussoes } from './textosDeMetasEDiscussoes'

const props = defineProps<{ t: Textos }>()
const prj = useProjetos()
const md = useMetasEDiscussoes()
const tx = useTextos(textosDeMetasEDiscussoes)
const tg = computed(() => tx.value.metas)
const idioma = useIdioma()
const toast = useToast()
const { marca } = useMarcaDeProposta()

const data = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value, { day: '2-digit', month: 'short', year: 'numeric' })
const corDoProgresso = (n: number) => n === 100 ? 'success' : 'primary'

/* ---------- lista ---------- */
const busca = ref('')
const ordem = ref<EnTableSort | null>({ key: 'dataAlvo', direction: 'asc' })
const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'nome', label: tg.value.colunas.nome!, sortable: true },
  { key: 'situacao', label: tg.value.colunas.situacao!, sortable: true },
  { key: 'progresso', label: tg.value.colunas.progresso!, sortable: true },
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

/* ---------- a meta aberta ---------- */
const aberta = computed(() => md.metas.value.find(m => m.id === md.metaAberta.value) ?? null)
const painel = computed({
  get: () => !!aberta.value,
  set: (v: boolean) => { if (!v) md.metaAberta.value = null },
})
const projetoDe = (id: number) => prj.projetos.value.find(p => p.id === id)
const marcoDe = (id: number) => md.marcos.value.find(m => m.id === id)
const podeEditar = computed(() => prj.souDono.value || aberta.value?.dono === prj.eu.value)
/** Os projetos que a pessoa vê, para ligar; os que ela não vê continuam ligados. */
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

/* publicar atualização */
const aSituacao = ref<Situacao>('noPrazo')
const aTexto = ref('')
const opSituacao = computed(() => (['noPrazo', 'emRisco', 'atrasado', 'concluido'] as const).map(s => ({ value: s, label: props.t.situacao[s], icon: ICONE_DA_SITUACAO[s] })))
function publicar() {
  const m = aberta.value
  if (!m || !aTexto.value.trim()) return
  md.publicarAtualizacao(m, aSituacao.value, aTexto.value.trim())
  aTexto.value = ''
  toast.add({ title: tg.value.atualizacaoPublicada, icon: 'i-lucide-check', color: 'success' })
}
watch(aberta, (m) => { aSituacao.value = (m && md.situacaoDaMeta(m)) || 'noPrazo'; aTexto.value = '' })

/* ---------- nova meta ---------- */
const nova = ref(false)
const nNome = ref('')
const nDescricao = ref('')
const nDono = ref<number>(prj.eu.value)
const nData = ref('2026-12-31')
const nProjetos = ref<number[]>([])
const nMarcos = ref<number[]>([])
const opDono = computed(() => pessoas.filter(p => !p.convidado).map(p => ({ value: p.id, label: p.nome })))
function abrirNova() {
  nNome.value = ''
  nDescricao.value = ''
  nDono.value = prj.eu.value
  nData.value = '2026-12-31'
  nProjetos.value = []
  nMarcos.value = []
  nova.value = true
}
function criar() {
  if (!nNome.value.trim()) return
  const m = md.criarMeta({ nome: nNome.value.trim(), descricao: nDescricao.value.trim(), dono: nDono.value, dataAlvo: nData.value, projetos: nProjetos.value, marcos: nMarcos.value })
  nova.value = false
  toast.add({ title: tg.value.criada(m.nome), icon: 'i-lucide-target', color: 'success' })
  md.metaAberta.value = m.id
}
</script>

<template>
  <div>
    <!-- 1 raiz só: a tela fica dentro do <Transition> do _Telas.vue -->
  <div class="flex flex-col" :class="marca">
    <div class="flex flex-wrap items-start gap-3 px-6 pb-3 pt-5">
      <div class="min-w-0 flex-1">
        <h1 class="text-xl font-semibold text-highlighted">{{ tg.titulo }}</h1>
        <p class="mt-0.5 text-sm text-muted">{{ tg.subtitulo }}</p>
      </div>
      <UTooltip :text="prj.souDono.value ? '' : tg.soDono" :disabled="prj.souDono.value">
        <UButton :label="tg.nova" icon="i-lucide-plus" size="sm" :disabled="!prj.souDono.value" @click="abrirNova" />
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
            <span class="w-9 text-right text-xs tabular-nums text-toned">{{ (row as any).progresso }}%</span>
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
    <template v-if="aberta" #body>
      <div class="flex flex-col gap-5">
        <!-- resumo -->
        <div class="grid grid-cols-3 gap-3">
          <div class="col-span-3 flex flex-col gap-1.5 rounded-lg border border-default p-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-semibold tabular-nums text-highlighted">{{ md.progressoDaMeta(aberta) }}%</span>
              <UTooltip :text="tg.progressoDica"><UIcon name="i-lucide-info" class="size-4 text-muted" :aria-label="tg.progressoDica" /></UTooltip>
              <UBadge v-if="md.situacaoDaMeta(aberta)" class="ml-auto" :label="t.situacao[md.situacaoDaMeta(aberta)!]" :icon="ICONE_DA_SITUACAO[md.situacaoDaMeta(aberta)!]" :color="COR_DA_SITUACAO[md.situacaoDaMeta(aberta)!]" variant="soft" />
            </div>
            <UProgress :model-value="md.progressoDaMeta(aberta)" :color="corDoProgresso(md.progressoDaMeta(aberta))" />
          </div>
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

        <!-- projetos -->
        <section class="flex flex-col gap-2">
          <header class="flex items-center gap-2">
            <h3 class="flex-1 text-sm font-semibold text-highlighted">{{ tg.projetos }}</h3>
            <USelectMenu v-if="podeEditar" :model-value="projetosVisiveisDa(aberta)" :items="opProjetos" value-key="value" multiple size="xs" class="w-48" :placeholder="tg.ligarProjetos" @update:model-value="ligar('projetos', $event as number[])">
              <template #default>{{ tg.ligarProjetos }}</template>
            </USelectMenu>
          </header>
          <p v-if="!aberta.projetos.length" class="text-xs text-muted">{{ tg.nenhumLigado }}</p>
          <ul class="flex flex-col divide-y divide-default rounded-lg border border-default">
            <li v-for="id in aberta.projetos" :key="id" class="flex items-center gap-3 px-3 py-2">
              <template v-if="md.veProjeto(id)">
                <span class="flex size-7 shrink-0 items-center justify-center rounded-md" :class="COR_DO_PROJETO[projetoDe(id)!.cor]"><UIcon :name="projetoDe(id)!.icone" class="size-4" /></span>
                <button type="button" class="min-w-0 flex-1 truncate text-left text-sm font-medium text-highlighted hover:underline" :title="tg.abrirProjeto" @click="painel = false; prj.abrirProjeto(id)">{{ projetoDe(id)!.nome }}</button>
              </template>
              <UTooltip v-else :text="tg.semAcessoDica" class="min-w-0 flex-1">
                <span class="flex items-center gap-3">
                  <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-elevated text-muted"><UIcon name="i-lucide-lock" class="size-4" /></span>
                  <span class="truncate text-sm italic text-muted">{{ tg.semAcesso }}</span>
                </span>
              </UTooltip>
              <UProgress :model-value="md.progressoDoProjeto(id)" :color="corDoProgresso(md.progressoDoProjeto(id))" size="sm" class="w-24" />
              <span class="w-9 text-right text-xs tabular-nums text-toned">{{ md.progressoDoProjeto(id) }}%</span>
            </li>
          </ul>
        </section>

        <!-- marcos -->
        <section class="flex flex-col gap-2">
          <header class="flex items-center gap-2">
            <h3 class="flex-1 text-sm font-semibold text-highlighted">{{ tg.marcos }}</h3>
            <USelectMenu v-if="podeEditar" :model-value="marcosVisiveisDa(aberta)" :items="opMarcos" value-key="value" multiple size="xs" class="w-48" :placeholder="tg.ligarMarcos" @update:model-value="ligar('marcos', $event as number[])">
              <template #default>{{ tg.ligarMarcos }}</template>
            </USelectMenu>
          </header>
          <p v-if="!aberta.marcos.length" class="text-xs text-muted">{{ tg.nenhumLigado }}</p>
          <ul class="flex flex-col divide-y divide-default rounded-lg border border-default">
            <li v-for="id in aberta.marcos" :key="id" class="flex items-center gap-3 px-3 py-2">
              <UIcon name="i-lucide-flag" class="size-4 shrink-0 text-muted" />
              <span v-if="marcoDe(id) && md.veProjeto(marcoDe(id)!.projeto)" class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-highlighted">{{ marcoDe(id)!.nome }}</span>
                <span class="block truncate text-xs text-muted">{{ projetoDe(marcoDe(id)!.projeto)?.nome }} · {{ data(marcoDe(id)!.dataAlvo) }}</span>
              </span>
              <span v-else class="min-w-0 flex-1 truncate text-sm italic text-muted">{{ tg.marcoSemAcesso }}</span>
              <UProgress v-if="marcoDe(id)" :model-value="md.progressoDoMarco(marcoDe(id)!)" :color="corDoProgresso(md.progressoDoMarco(marcoDe(id)!))" size="sm" class="w-24" />
              <span v-if="marcoDe(id)" class="w-9 text-right text-xs tabular-nums text-toned">{{ md.progressoDoMarco(marcoDe(id)!) }}%</span>
            </li>
          </ul>
        </section>

        <!-- atualizações -->
        <section class="flex flex-col gap-2">
          <h3 class="text-sm font-semibold text-highlighted">{{ tg.atualizacoes }}</h3>
          <div v-if="podeEditar" class="flex flex-col gap-2 rounded-lg border border-default p-3">
            <div class="flex items-center gap-2">
              <USelect v-model="aSituacao" :items="opSituacao" size="sm" class="w-40" :aria-label="tg.situacao" />
              <span class="text-xs text-muted">{{ tg.publicarAtualizacao }}</span>
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
                <p class="text-xs text-muted">{{ t.situacao[a.situacao] }} · {{ pessoa(a.autor)?.nome }} · {{ data(a.em) }}</p>
                <p class="mt-0.5 text-sm text-default">{{ a.texto }}</p>
              </div>
            </li>
          </ol>
        </section>
      </div>
    </template>
  </USlideover>

  <!-- nova meta -->
  <UModal v-model:open="nova" :title="tg.nova" :ui="{ footer: 'justify-end gap-2' }">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField :label="tg.nome" required>
          <UInput v-model="nNome" :placeholder="tg.nomePlaceholder" class="w-full" autofocus />
        </UFormField>
        <UFormField :label="tg.descricao">
          <UTextarea v-model="nDescricao" :rows="2" autoresize class="w-full" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="tg.dono">
            <USelect v-model="nDono" :items="opDono" class="w-full" />
          </UFormField>
          <UFormField :label="tg.dataAlvo">
            <UInput v-model="nData" type="date" class="w-full" />
          </UFormField>
        </div>
        <UFormField :label="tg.ligarProjetos">
          <USelectMenu v-model="nProjetos" :items="opProjetos" value-key="value" multiple class="w-full" />
        </UFormField>
        <UFormField :label="tg.ligarMarcos">
          <USelectMenu v-model="nMarcos" :items="opMarcos" value-key="value" multiple class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton :label="tg.cancelar" color="neutral" variant="outline" @click="nova = false" />
      <UButton :label="tg.criar" icon="i-lucide-target" :disabled="!nNome.trim()" @click="criar" />
    </template>
  </UModal>
  </div>
</template>

<script setup lang="ts">
/**
 * Módulos > Assinaturas: a lista de envelopes.
 *
 * Cópia da prévia: a barra (busca, Colunas, Novo envelope), os filtros Status, Provedor e Origem e as colunas da tabela.
 * PROPOSTA:
 * - M16: sem envelope, o começo do módulo (`_ComecoDoModulo.vue`), com ou sem provedor; com rascunhos e sem provedor, a
 *   lista aparece com o aviso e o atalho para conectar. Não ter provedor não impede de criar o envelope: ele fica como
 *   rascunho;
 * - "Precisam de atenção": os envelopes com erro, os sem retorno do provedor e os que vencem, num clique;
 * - M13: o envelope aberto sem notícia do provedor há mais de 2 dias leva o selo "Sem retorno há N dias";
 * - M18: a busca acha também pelo nome e pelo e-mail do signatário;
 * - M19: o menu ⋮ mostra as ações que o status e o provedor permitem;
 * - M27: as datas levam a hora;
 * - a origem diz o fluxo ou a categoria, não só o tipo.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Envelope, ProvedorId, StatusDoEnvelope } from './mocks'
import { categoriasDoFluxo, fluxoPorId, provedores, provedorPorId } from './mocks'
import { aberto, assinados, credenciaisVisiveis, diasSemRetorno, envelopesVisiveis, tem } from './estado'
import { dataHoraCurta, diasAte } from './formato'
import type { Textos } from './textos'
import Monograma from './_Monograma.vue'
import ComecoDoModulo from './_ComecoDoModulo.vue'
import CancelarEnvelope from './_CancelarEnvelope.vue'
import ReenviarEmail from './_ReenviarEmail.vue'
import LinksDeAssinatura from './_LinksDeAssinatura.vue'
import { corDoStatus } from './cores'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ abrir: [number], novo: [], conectar: [], provedor: [ProvedorId], irFluxo: [], irTarefa: [] }>()
const toast = useToast()
const idioma = useIdioma()
const l = computed(() => props.t.lista)
const loc = computed(() => props.t.locale)

/* ---------- busca e filtros ---------- */
const busca = ref('')
const status = ref<StatusDoEnvelope[]>([])
const provedor = ref<ProvedorId[]>([])
const origem = ref<string[]>([])
type Rapido = 'erro' | 'parados' | 'vencendo'
const rapido = ref<Rapido | null>(null)

const regraRapida: Record<Rapido, (e: Envelope) => boolean> = {
  erro: e => e.status === 'error',
  parados: e => diasSemRetorno(e) > 0,
  vencendo: e => aberto(e) && !!e.expires_at && diasAte(e.expires_at) <= 3 && diasAte(e.expires_at) >= 0,
}
const contagem = computed(() => (Object.keys(regraRapida) as Rapido[]).map(k => ({ chave: k, n: envelopesVisiveis.value.filter(regraRapida[k]).length })))

const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const filtrados = computed(() => {
  const q = normalizar(busca.value.trim())
  return envelopesVisiveis.value.filter(e =>
    (!q || [e.title, e.reference, ...e.participantes.flatMap(p => [p.nome, p.email])].some(x => normalizar(x).includes(q)))
    && (!status.value.length || status.value.includes(e.status))
    && (!provedor.value.length || (!!e.provider && provedor.value.includes(e.provider)))
    && (!origem.value.length || origem.value.includes(e.origem.tipo))
    && (!rapido.value || regraRapida[rapido.value](e)))
})
const temFiltro = computed(() => !!(busca.value || status.value.length || provedor.value.length || origem.value.length || rapido.value))
function limpar() { busca.value = ''; status.value = []; provedor.value = []; origem.value = []; rapido.value = null }

const itensStatus = computed(() => (['draft', 'pending', 'completed', 'rejected', 'canceled', 'expired', 'error'] as const).map(s => ({ value: s, label: props.t.status[s] })))
const itensProvedor = provedores.map(p => ({ value: p.id, label: p.nome }))
const itensOrigem = computed(() => (['standalone', 'workflow', 'c-flow'] as const).map(o => ({ value: o, label: props.t.origens[o] })))

/* ---------- página ---------- */
const pagina = ref(1)
const POR_PAGINA = 10
watch(filtrados, () => { pagina.value = 1 })
const linhas = computed(() => filtrados.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA).map(e => ({ ...e })))

const largura = ref<Record<string, number>>({ acoes: 64, titulo: 340, provedor: 190, status: 190, origem: 210, assinados: 110, criado: 110, enviado: 110, concluido: 120 })
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'acoes', label: l.value.colunas.acoes },
  { key: 'titulo', label: l.value.colunas.titulo },
  { key: 'provedor', label: l.value.colunas.provedor },
  { key: 'status', label: l.value.colunas.status },
  { key: 'origem', label: l.value.colunas.origem },
  { key: 'assinados', label: l.value.colunas.assinados },
  { key: 'criado', label: l.value.colunas.criado },
  { key: 'enviado', label: l.value.colunas.enviado },
  { key: 'concluido', label: l.value.colunas.concluido },
])

function textoDaOrigem(e: Envelope) {
  const o = e.origem
  if (o.tipo === 'workflow') return fluxoPorId.get(o.fluxo)?.nome ?? ''
  if (o.tipo === 'c-flow') return categoriasDoFluxo.find(c => c.id === o.categoria)?.nome ?? ''
  return ''
}
const iconeDaOrigem = { standalone: 'i-lucide-file-signature', workflow: 'i-lucide-workflow', 'c-flow': 'i-lucide-layout-grid' } as const

/* ---------- M19: o menu ⋮ conforme o status ---------- */
const selecionado = ref<Envelope | null>(null)
const modal = ref<'cancelar' | 'reenviar' | 'links' | null>(null)
function abrirModal(e: Envelope, m: 'cancelar' | 'reenviar' | 'links') { selecionado.value = e; modal.value = m }
const modalAberto = (m: 'cancelar' | 'reenviar' | 'links') => computed({ get: () => modal.value === m, set: (v) => { if (!v) modal.value = null } })
const cancelarAberto = modalAberto('cancelar')
const reenviarAberto = modalAberto('reenviar')
const linksAberto = modalAberto('links')

function menuDo(e: Envelope) {
  const m = l.value.menu
  const p = e.provider ? provedorPorId.get(e.provider)! : null
  const avisar = (titulo: string) => toast.add({ title: titulo, description: e.title, icon: 'i-lucide-check', color: 'success' })
  const principais = [{ label: m.ver, icon: 'i-lucide-eye', onSelect: () => emit('abrir', e.id) }]
  const acoes: Record<string, unknown>[] = []
  if (e.status === 'draft') acoes.push({ label: m.enviar, icon: 'i-lucide-send', disabled: !e.provider, description: e.provider ? undefined : l.value.enviarSemProvedor, onSelect: () => emit('abrir', e.id) })
  if (aberto(e)) {
    if (tem(e, 'consultaStatus')) acoes.push({ label: m.atualizar, icon: 'i-lucide-refresh-cw', onSelect: () => avisar(props.t.envelope.atualizadoToast(p!.nome)) })
    if (tem(e, 'reenvio')) acoes.push({ label: m.reenviar, icon: 'i-lucide-mail', onSelect: () => abrirModal(e, 'reenviar') })
    if (tem(e, 'links')) acoes.push({ label: m.links, icon: 'i-lucide-link', onSelect: () => abrirModal(e, 'links') })
  }
  const baixar = [
    ...(e.status === 'completed' ? [{ label: m.baixarAssinado, icon: 'i-lucide-file-check', onSelect: () => avisar(m.baixarAssinado) }] : []),
    { label: m.baixarOriginal, icon: 'i-lucide-download', onSelect: () => avisar(m.baixarOriginal) },
  ]
  const fim = aberto(e)
    ? [[{
        label: m.cancelar, icon: 'i-lucide-ban', color: 'error' as const,
        // M34: a Certisign avulsa não cancela pela integração
        disabled: !tem(e, 'cancela') && e.origem.tipo === 'standalone',
        onSelect: () => abrirModal(e, 'cancelar'),
      }]]
    : []
  return [principais, ...(acoes.length ? [acoes] : []), baixar, ...fim]
}

/* ---------- estados iniciais (M16) ---------- */
const semProvedor = computed(() => credenciaisVisiveis.value.length === 0)
const semEnvelope = computed(() => envelopesVisiveis.value.length === 0)
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="space-y-4 px-6 py-5">
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-xl font-semibold text-highlighted">{{ t.casca.itens.assinaturas }}</h1>
      </div>

      <!-- M16: o começo do módulo, com ou sem provedor -->
      <ComecoDoModulo
        v-if="semEnvelope"
        :t="t"
        :variante="semProvedor ? 'vazio' : 'semEnvelope'"
        @novo="emit('novo')"
        @conectar="emit('conectar')"
        @provedor="(id) => emit('provedor', id)"
        @ir-fluxo="emit('irFluxo')"
        @ir-tarefa="emit('irTarefa')"
      />

      <template v-else>
        <!-- M16: rascunhos sem provedor. O envelope existe; só o envio espera a conexão -->
        <UAlert
          v-if="semProvedor"
          color="warning"
          variant="subtle"
          icon="i-lucide-plug-zap"
          :title="l.soRascunhos.titulo"
          :description="l.soRascunhos.texto"
          class="animate-[entrada_.3s_ease-out_both]"
          :actions="[{ label: l.soRascunhos.botao, icon: 'i-lucide-plug', color: 'warning', variant: 'outline', onClick: () => emit('conectar') }]"
        />

        <!-- A barra (cópia), com a busca que acha o signatário -->
        <div class="flex flex-wrap items-center gap-2">
          <UInput v-model="busca" icon="i-lucide-search" :placeholder="l.buscar" class="w-80" :aria-label="l.buscar" />
          <USelect v-model="status" :items="itensStatus" value-key="value" multiple :placeholder="l.filtros.status" class="w-40" :aria-label="l.filtros.status" />
          <USelect v-model="provedor" :items="itensProvedor" value-key="value" multiple :placeholder="l.filtros.provedor" class="w-40" :aria-label="l.filtros.provedor" />
          <USelect v-model="origem" :items="itensOrigem" value-key="value" multiple :placeholder="l.filtros.origem" class="w-44" :aria-label="l.filtros.origem" />
          <UButton v-if="temFiltro" :label="l.limpar" icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="limpar" />
          <span class="ml-auto flex items-center gap-2">
            <UButton :label="l.colunasBotao" icon="i-lucide-columns-3" color="neutral" variant="outline" />
            <UButton :label="l.novo" icon="i-lucide-plus" @click="emit('novo')" />
          </span>
        </div>

        <!-- PROPOSTA: o que precisa de atenção, num clique -->
        <div v-if="contagem.some(c => c.n)" class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium text-muted">{{ l.atencao }}</span>
          <template v-for="c in contagem" :key="c.chave">
            <UButton
              v-if="c.n"
              :label="l.rapidos[c.chave]"
              size="xs"
              :color="rapido === c.chave ? 'primary' : 'neutral'"
              :variant="rapido === c.chave ? 'soft' : 'outline'"
              :icon="c.chave === 'erro' ? 'i-lucide-circle-x' : c.chave === 'parados' ? 'i-lucide-clock-alert' : 'i-lucide-calendar-clock'"
              :aria-pressed="rapido === c.chave"
              class="transition-transform hover:-translate-y-0.5"
              @click="rapido = rapido === c.chave ? null : c.chave"
            >
              <template #trailing>
                <UBadge :label="String(c.n)" :color="c.chave === 'erro' ? 'error' : 'warning'" variant="soft" size="sm" class="tabular-nums" />
              </template>
            </UButton>
          </template>
        </div>

        <EnTable
          :columns="colunas"
          :rows="linhas"
          :locale="idioma"
          :empty-state="{ icon: 'i-lucide-search-x', title: l.vazioFiltro }"
          resizable
          :column-sizing="largura"
          class="animate-[entrada_.3s_ease-out_both]"
          @update:column-sizing="(x) => (largura = x)"
          @row-click="(row) => emit('abrir', (row as Envelope).id)"
        >
          <template #cell-acoes="{ row }">
            <span @click.stop>
              <UDropdownMenu :items="menuDo(row as Envelope)" :content="{ align: 'start' }" :ui="{ content: 'min-w-56 max-w-72', itemDescription: 'whitespace-normal' }">
                <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.geral.maisAcoes" />
              </UDropdownMenu>
            </span>
          </template>
          <template #cell-titulo="{ row }">
            <span class="flex min-w-0 flex-col py-1">
              <span class="truncate text-sm font-medium text-highlighted">{{ (row as Envelope).title }}</span>
              <span class="flex items-center gap-2">
                <span class="font-mono text-xs text-dimmed">{{ (row as Envelope).reference }}</span>
                <UBadge v-if="diasSemRetorno(row as Envelope)" :label="l.semRetorno(diasSemRetorno(row as Envelope))" icon="i-lucide-clock-alert" color="warning" variant="soft" size="sm" />
              </span>
            </span>
          </template>
          <template #cell-provedor="{ row }">
            <span v-if="(row as Envelope).provider" class="flex items-center gap-2 whitespace-nowrap text-sm">
              <Monograma :provedor="(row as Envelope).provider!" tamanho="sm" />{{ provedorPorId.get((row as Envelope).provider!)!.nome }}
            </span>
            <span v-else class="flex items-center gap-2 whitespace-nowrap text-sm text-muted">
              <span class="flex size-6 items-center justify-center rounded-md border border-dashed border-accented"><UIcon name="i-lucide-plug-zap" class="size-3.5" /></span>{{ l.semProvedorCelula }}
            </span>
          </template>
          <template #cell-status="{ row }">
            <UBadge :label="t.status[(row as Envelope).status]" :color="corDoStatus[(row as Envelope).status]" variant="soft" class="whitespace-nowrap" />
          </template>
          <template #cell-origem="{ row }">
            <span class="flex items-center gap-1.5 text-sm">
              <UIcon :name="iconeDaOrigem[(row as Envelope).origem.tipo]" class="size-4 shrink-0 text-muted" />
              <span class="flex min-w-0 flex-col">
                <span class="whitespace-nowrap text-toned">{{ t.origens[(row as Envelope).origem.tipo] }}</span>
                <span v-if="textoDaOrigem(row as Envelope)" class="max-w-44 truncate text-xs text-muted">{{ textoDaOrigem(row as Envelope) }}</span>
              </span>
            </span>
          </template>
          <template #cell-assinados="{ row }">
            <span class="flex items-center gap-2">
              <UProgress :model-value="assinados(row as Envelope)" :max="(row as Envelope).participantes.length" size="xs" class="w-14" :color="(row as Envelope).status === 'completed' ? 'success' : 'primary'" />
              <span class="text-xs tabular-nums text-muted">{{ assinados(row as Envelope) }}/{{ (row as Envelope).participantes.length }}</span>
            </span>
          </template>
          <template #cell-criado="{ row }">
            <span class="whitespace-nowrap text-xs tabular-nums text-muted">{{ dataHoraCurta((row as Envelope).created_at, loc) }}</span>
          </template>
          <template #cell-enviado="{ row }">
            <span class="whitespace-nowrap text-xs tabular-nums text-muted">{{ (row as Envelope).sent_at ? dataHoraCurta((row as Envelope).sent_at!, loc) : '' }}</span>
          </template>
          <template #cell-concluido="{ row }">
            <span class="whitespace-nowrap text-xs tabular-nums text-muted">{{ (row as Envelope).completed_at ? dataHoraCurta((row as Envelope).completed_at!, loc) : '' }}</span>
          </template>
        </EnTable>

        <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
          <span>{{ l.paginacao(filtrados.length ? (pagina - 1) * POR_PAGINA + 1 : 0, Math.min(pagina * POR_PAGINA, filtrados.length), filtrados.length) }}</span>
          <UPagination v-model:page="pagina" :total="filtrados.length" :items-per-page="POR_PAGINA" size="sm" />
        </div>
      </template>
    </div>

    <template v-if="selecionado">
      <CancelarEnvelope v-model:open="cancelarAberto" :t="t" :envelope="selecionado" />
      <ReenviarEmail v-model:open="reenviarAberto" :t="t" :envelope="selecionado" />
      <LinksDeAssinatura v-model:open="linksAberto" :t="t" :envelope="selecionado" />
    </template>
  </div>
</template>

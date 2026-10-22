<script setup lang="ts">
/**
 * MÓDULO REQUISIÇÕES · MINHAS REQUISIÇÕES.
 *
 * Substitui o tipo legado Minhas Requisições, a tela legada mais citada em
 * chamado (40 dos 118 que citam tela legada). Abertos: BUG5F179670 (o membro
 * não vê as próprias requisições) e USE23AFFB12 (tela em branco para membro
 * Standard).
 *
 * O que muda:
 *   - item fixo no menu, sem cadastro do admin, com o número do que aguarda
 *     a pessoa;
 *   - todas as requisições dela, de todas as áreas, numa tabela só;
 *   - o "Tipo da Filtragem" de hoje (Categorias, Formulários, Mailbox) vira
 *     filtro de quem usa (Origem);
 *   - o andamento abre numa gaveta: histórico, respostas, comentários,
 *     duplicar e cancelar.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import { EU, HOJE, formularioPorId, membroPorId, type Area, type EtapaDaRequisicao, type Requisicao } from './mocks'
import { dataCurta, dataEHora } from './formatar'
import { useTiposDeTela } from './estado'
import CabecalhoDaTela from './_CabecalhoDaTela.vue'
import EstadoDaTela from './_EstadoDaTela.vue'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ tentarDeNovo: [], abrirRequisicao: [] }>()

const { cenario, minhas } = useTiposDeTela()
const idioma = useIdioma()
const toast = useToast()

type Aba = 'andamento' | 'concluidas' | 'canceladas'
const aba = ref<Aba>('andamento')
const origem = ref<'todas' | 'formulario' | 'email'>('todas')
const area = ref<Area | 'todas'>('todas')

const daAba: Record<Aba, EtapaDaRequisicao[]> = {
  andamento: ['em_triagem', 'revisao_pedida', 'em_atendimento'],
  concluidas: ['concluida'],
  canceladas: ['reprovada', 'cancelada'],
}

const contagem = computed(() => ({
  andamento: minhas.value.filter(r => daAba.andamento.includes(r.etapa)).length,
  concluidas: minhas.value.filter(r => daAba.concluidas.includes(r.etapa)).length,
  canceladas: minhas.value.filter(r => daAba.canceladas.includes(r.etapa)).length,
}))
const aguardando = computed(() => minhas.value.filter(r => r.etapa === 'revisao_pedida').length)

const abas = computed(() => (['andamento', 'concluidas', 'canceladas'] as Aba[]).map(a => ({
  value: a,
  label: props.t.minhas.abas[a],
  badge: { label: String(contagem.value[a]), color: 'neutral' as const, variant: 'soft' as const },
})))

const filtradas = computed(() => minhas.value
  .filter(r => daAba[aba.value].includes(r.etapa))
  .filter(r => origem.value === 'todas' || r.origem === origem.value)
  .filter(r => area.value === 'todas' || formularioPorId(r.formulario).area === area.value)
  // O que aguarda a pessoa sobe para o topo.
  .sort((a, b) => Number(b.etapa === 'revisao_pedida') - Number(a.etapa === 'revisao_pedida') || b.atualizadaEm.getTime() - a.atualizadaEm.getTime()))

const opcoesDeOrigem = computed(() => (['todas', 'formulario', 'email'] as const).map(o => ({ label: props.t.minhas.origens[o], value: o })))
const opcoesDeArea = computed(() => [{ label: props.t.minhas.todasAreas, value: 'todas' }, ...(['juridico', 'compras', 'ti', 'rh'] as Area[]).map(a => ({ label: props.t.abrir.areas[a], value: a }))])

const corDaEtapa: Record<EtapaDaRequisicao, 'neutral' | 'info' | 'warning' | 'primary' | 'success' | 'error'> = {
  em_triagem: 'info', revisao_pedida: 'warning', em_atendimento: 'primary', concluida: 'success', reprovada: 'error', cancelada: 'neutral',
}

interface Linha extends Record<string, unknown> {
  id: number
  numero: string
  assunto: string
  formulario: string
  etapa: EtapaDaRequisicao
  responsavel: string
  aberta: string
  atualizada: string
  r: Requisicao
}
const linhas = computed<Linha[]>(() => filtradas.value.map(r => ({
  id: r.id,
  numero: r.numero,
  assunto: r.assunto,
  formulario: formularioPorId(r.formulario).nome,
  etapa: r.etapa,
  responsavel: membroPorId(r.responsavel)?.nome ?? '',
  aberta: dataCurta(r.abertaEm, idioma.value),
  atualizada: dataCurta(r.atualizadaEm, idioma.value),
  r,
})))
const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.minhas.colunas
  return [
    { key: 'numero', label: c.numero },
    { key: 'assunto', label: c.assunto },
    { key: 'formulario', label: c.formulario },
    { key: 'etapa', label: c.etapa },
    { key: 'responsavel', label: c.responsavel },
    { key: 'aberta', label: c.aberta },
    { key: 'atualizada', label: c.atualizada },
  ]
})

/* ---------------- a gaveta do andamento ---------------- */

const aberta = ref<Requisicao | null>(null)
const gaveta = computed({ get: () => !!aberta.value, set: (v) => { if (!v) aberta.value = null } })
const comentario = ref('')
const cancelando = ref(false)

const eventos = computed(() => {
  const r = aberta.value
  if (!r) return []
  const todos = [
    ...r.historico.map(h => ({ quando: h.quando, quem: h.quem, texto: props.t.minhas.eventos[h.oQue] ?? h.oQue, icone: h.oQue === 'reprovou' ? 'i-lucide-x' : h.oQue === 'concluiu' ? 'i-lucide-check' : 'i-lucide-circle-dot' })),
    ...r.comentarios.map(c => ({ quando: c.quando, quem: c.quem, texto: `${props.t.minhas.eventos.comentou}: "${c.texto}"`, icone: 'i-lucide-message-square' })),
  ].sort((a, b) => a.quando.getTime() - b.quando.getTime())
  return todos.map(e => ({
    title: `${membroPorId(e.quem)?.nome ?? ''} ${e.texto}`,
    description: dataEHora(e.quando, idioma.value),
    icon: e.icone,
  }))
})

function comentar() {
  const r = aberta.value
  if (!r || !comentario.value.trim()) return
  r.comentarios.push({ quando: new Date(HOJE), quem: EU.id, texto: comentario.value.trim() })
  if (r.etapa === 'revisao_pedida') r.etapa = r.responsavel ? 'em_atendimento' : 'em_triagem'
  r.atualizadaEm = new Date(HOJE)
  comentario.value = ''
  toast.add({ title: props.t.minhas.comentado, icon: 'i-lucide-message-square', color: 'success' })
}

function duplicar() {
  const r = aberta.value
  if (!r) return
  const numero = Math.max(...minhas.value.map(x => x.id)) + 1
  const agora = new Date(HOJE)
  const nova: Requisicao = {
    ...structuredClone(toRaw(r)),
    id: numero,
    numero: `REQ-${numero}`,
    etapa: formularioPorId(r.formulario).triagem ? 'em_triagem' : 'em_atendimento',
    responsavel: null,
    abertaEm: agora,
    atualizadaEm: agora,
    historico: [{ quando: agora, quem: EU.id, oQue: 'abriu' }],
    comentarios: [],
  }
  minhas.value = [nova, ...minhas.value]
  aberta.value = null
  aba.value = 'andamento'
  toast.add({ title: props.t.minhas.duplicada(nova.numero), icon: 'i-lucide-copy', color: 'success' })
}

function cancelar() {
  const r = aberta.value
  if (!r) return
  r.etapa = 'cancelada'
  r.historico.push({ quando: new Date(HOJE), quem: EU.id, oQue: 'cancelou' })
  r.atualizadaEm = new Date(HOJE)
  cancelando.value = false
  aberta.value = null
  toast.add({ title: props.t.minhas.cancelada(r.numero), icon: 'i-lucide-ban', color: 'neutral' })
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <CabecalhoDaTela
      icone="i-lucide-user-round"
      :titulo="t.minhas.titulo"
      :descricao="t.minhas.descricao"
      :substitui="['Minhas Requisições']"
      nativo="todos"
      onde="Módulo Requisições: fixo no menu de todo membro, sem cadastro do admin."
    >
      <template #acoes>
        <UButton :label="t.casca.itens.abrir" icon="i-lucide-circle-plus" color="primary" size="sm" @click="emit('abrirRequisicao')" />
      </template>
    </CabecalhoDaTela>

    <EstadoDaTela :t="t" :cenario="cenario" forma="tabela" @tentar-de-novo="emit('tentarDeNovo')">
      <template #vazio>
        <UEmpty icon="i-lucide-inbox" :title="t.minhas.vazioTitulo" :description="t.minhas.vazioTexto" :actions="[{ label: t.minhas.vazioAcao, icon: 'i-lucide-circle-plus', color: 'primary', onClick: () => emit('abrirRequisicao') }]" />
      </template>

      <div class="flex flex-wrap items-center gap-3 border-b border-default px-6 py-3">
        <UTabs v-model="aba" :items="abas" :content="false" size="sm" variant="pill" color="neutral" />
        <USelect v-model="area" :items="opcoesDeArea" size="sm" icon="i-lucide-building-2" class="w-44" :aria-label="t.minhas.area" />
        <USelect v-model="origem" :items="opcoesDeOrigem" size="sm" icon="i-lucide-mail" class="w-48" :aria-label="t.minhas.origem" />
      </div>

      <div v-if="aguardando && aba === 'andamento'" class="px-6 pt-3">
        <UAlert icon="i-lucide-message-circle-question" color="warning" variant="subtle" :title="t.minhas.aguardamVoce(aguardando)" :description="t.minhas.aguardaVoce" />
      </div>

      <div :key="`${aba}-${origem}-${area}`" class="min-h-0 flex-1 overflow-auto pb-24 animate-[entrada_.25s_ease-out]">
        <EnTable
          :columns="colunas"
          :rows="linhas"
          :empty-state="{ icon: 'i-lucide-inbox', title: t.minhas.vazioTitulo, description: t.minhas.vazioTexto }"
          :locale="idioma"
          @row-click="(r) => { aberta = (r as Linha).r; comentario = '' }"
        >
          <template #cell-numero="{ row }">
            <span class="font-mono text-xs text-toned">{{ (row as Linha).numero }}</span>
          </template>
          <template #cell-assunto="{ row }">
            <span class="block max-w-80 truncate text-sm text-highlighted" :title="(row as Linha).assunto">{{ (row as Linha).assunto }}</span>
          </template>
          <template #cell-etapa="{ row }">
            <UBadge
              :label="t.minhas.etapas[(row as Linha).etapa]"
              :color="corDaEtapa[(row as Linha).etapa]"
              :icon="(row as Linha).etapa === 'revisao_pedida' ? 'i-lucide-message-circle-question' : undefined"
              variant="subtle"
              size="sm"
            />
          </template>
          <template #cell-responsavel="{ row }">
            <span v-if="(row as Linha).responsavel" class="text-sm">{{ (row as Linha).responsavel }}</span>
            <span v-else class="text-sm text-dimmed">-</span>
          </template>
        </EnTable>
      </div>
    </EstadoDaTela>

    <USlideover v-model:open="gaveta" :title="aberta?.assunto ?? ''" :description="aberta ? `${aberta.numero} · ${formularioPorId(aberta.formulario).nome}` : ''" :ui="{ content: 'max-w-lg' }">
      <template #body>
        <div v-if="aberta" class="space-y-6">
          <div class="flex flex-wrap items-center gap-2">
            <UBadge :label="t.minhas.etapas[aberta.etapa]" :color="corDaEtapa[aberta.etapa]" variant="subtle" />
            <span v-if="aberta.responsavel" class="text-xs text-muted">{{ t.minhas.colunas.responsavel }}: {{ membroPorId(aberta.responsavel)?.nome }}</span>
          </div>

          <UAlert v-if="aberta.etapa === 'revisao_pedida'" icon="i-lucide-message-circle-question" color="warning" variant="subtle" :title="t.minhas.aguardaVoce" />

          <section>
            <h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{{ t.minhas.respostas }}</h3>
            <dl class="space-y-2 text-sm">
              <template v-for="c in formularioPorId(aberta.formulario).campos" :key="c.chave">
                <div v-if="aberta.respostas[c.chave]">
                  <dt class="text-xs text-muted">{{ c.rotulo }}</dt>
                  <dd class="text-highlighted">{{ aberta.respostas[c.chave] }}</dd>
                </div>
              </template>
            </dl>
          </section>

          <section>
            <h3 class="mb-3 text-xs font-medium uppercase tracking-wider text-muted">{{ t.minhas.historico }}</h3>
            <UTimeline :items="eventos" size="xs" :default-value="eventos.length - 1" />
          </section>

          <section class="space-y-2">
            <h3 class="text-xs font-medium uppercase tracking-wider text-muted">{{ t.minhas.comentarios }}</h3>
            <UTextarea v-model="comentario" :placeholder="t.minhas.comentarPlaceholder" :rows="2" autoresize class="w-full" :disabled="['cancelada', 'reprovada', 'concluida'].includes(aberta.etapa)" />
            <div class="flex justify-end">
              <UButton :label="t.minhas.comentar" icon="i-lucide-send" color="primary" variant="soft" size="sm" :disabled="!comentario.trim()" @click="comentar" />
            </div>
          </section>
        </div>
      </template>
      <template #footer>
        <div v-if="aberta" class="flex w-full flex-wrap justify-between gap-2">
          <UButton :label="t.minhas.duplicar" icon="i-lucide-copy" color="neutral" variant="outline" size="sm" @click="duplicar" />
          <UButton v-if="['em_triagem', 'revisao_pedida', 'em_atendimento'].includes(aberta.etapa)" :label="t.minhas.cancelar" icon="i-lucide-ban" color="error" variant="ghost" size="sm" @click="cancelando = true" />
        </div>
      </template>
    </USlideover>

    <UModal v-model:open="cancelando" :title="aberta ? t.minhas.cancelarTitulo(aberta.numero) : ''" :description="t.minhas.cancelarTexto">
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.comum.fechar" color="neutral" variant="ghost" @click="cancelando = false" />
          <UButton :label="t.minhas.cancelarConfirmar" icon="i-lucide-ban" color="error" @click="cancelar" />
        </div>
      </template>
    </UModal>
  </div>
</template>

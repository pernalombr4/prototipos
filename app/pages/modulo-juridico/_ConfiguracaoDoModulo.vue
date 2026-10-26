<script setup lang="ts">
/**
 * PROPOSTA: Configurações › Sistema › Módulo Jurídico. Abre pelo botão Configurar do cartão Módulos.
 *
 * O que se configura aqui é só o que o módulo faz: o pacote do país, as regras de prazo, o calendário de cada
 * tribunal, a captura e a provisão. Rodada 3: a captura virou o submódulo Capturas, com 3 abas (Fontes, Termos
 * monitorados e Destino) no lugar da antiga aba Captura. A estrutura do jurídico (categorias, campos, fluxos) não mora aqui: chega pelos
 * casos de uso, e a aba "Casos de uso" diz qual área é módulo e qual é só configuração.
 *
 * Rodada 4: a aba Eventos, com o que o submódulo entrega ao Spaceflow (`_EventosDoSpaceflow.vue`).
 *
 * Salvar fica fixo no topo, como no protótipo `protecoes-do-spaceflow` (rodada 2).
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Regra, TribunalId } from './mocks'
import { VERSAO_DO_PACOTE, feriadosNacionais, listaDeTribunais, pessoaPorId, regras, tribunais } from './mocks'
import type { TipoDeDiaSemExpediente } from './prazos'
import { adicionarSuspensao, estado, removerSuspensao } from './estado'
import type { AreaJuridica, ComoChega, Textos } from './textos'
import { dia, semana } from './formato'
import { LIBERADO } from './submodulos'
import { textosCapturas } from './textos-capturas'
import FontesDaCaptura from './_FontesDaCaptura.vue'
import TermosMonitorados from './_TermosMonitorados.vue'
import DestinoDaCaptura from './_DestinoDaCaptura.vue'
import EventosDoSpaceflow from './_EventosDoSpaceflow.vue'
import { textosTratamento } from './textos-tratamento'

export type Aba = 'geral' | 'fontes' | 'termos' | 'destino' | 'eventos' | 'regras' | 'calendario' | 'provisao' | 'casos'

const props = defineProps<{ t: Textos, erroCaptura?: boolean, abaInicial?: Aba }>()
const emit = defineEmits<{ voltar: [] }>()
const toast = useToast()
const idioma = useIdioma()
const tc = useTextos(textosCapturas)
const tt = useTextos(textosTratamento)

const aba = ref<Aba>(props.abaInicial ?? 'geral')
// Rodada 3: Provisão e Casos de uso ficam no código, fora da tela, até serem liberados (`submodulos.ts`).
const oculta = (a: Aba) => (a === 'provisao' && !LIBERADO.provisao) || (a === 'casos' && !LIBERADO.casosDeUso)
const abas = computed(() => {
  const c = props.t.config.abas
  const todas: [Aba, string][] = [
    ['geral', c.geral], ['fontes', tc.value.config.abas.fontes], ['termos', tc.value.config.abas.termos], ['destino', tc.value.config.abas.destino], ['eventos', tt.value.eventos.aba],
    ['regras', c.regras], ['calendario', c.calendario], ['provisao', c.provisao], ['casos', c.casos],
  ]
  return todas.filter(([a]) => !oculta(a)).map(([value, label]) => ({ value, label }))
})

/* ---------- Geral ---------- */
const pais = ref<'brasil' | 'eua' | 'global'>('brasil')
const doEstado = () => ({
  antecedencia: estado.antecedencia,
  revisao: estado.revisaoObrigatoria,
  leitura: estado.leituraDoDomicilio,
  destino: { andamentosDireto: estado.andamentosDireto, atribuicao: { ...estado.atribuicao }, duplicidade: estado.duplicidade },
})
const rascunho = ref(doEstado())
const mudou = computed(() => JSON.stringify(rascunho.value) !== JSON.stringify(doEstado()))
const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  estado.antecedencia = rascunho.value.antecedencia
  estado.revisaoObrigatoria = rascunho.value.revisao
  estado.leituraDoDomicilio = rascunho.value.leitura
  estado.andamentosDireto = rascunho.value.destino.andamentosDireto
  estado.atribuicao = { ...rascunho.value.destino.atribuicao }
  estado.duplicidade = rascunho.value.destino.duplicidade
  salvando.value = false
  toast.add({ title: props.t.config.geral.salvo, icon: 'i-lucide-check', color: 'success' })
}
const paises = computed(() => [
  { value: 'brasil', label: props.t.config.geral.paises.brasil, description: props.t.config.geral.versao(VERSAO_DO_PACOTE) },
  { value: 'eua', label: props.t.config.geral.paises.eua, description: props.t.config.geral.emPreparacao, disabled: true },
  { value: 'global', label: props.t.config.geral.paises.global, description: props.t.config.geral.globalAjuda, disabled: true },
])

/* ---------- Regras ---------- */
const colunasDeRegras = computed<EnTableColumn[]>(() => {
  const c = props.t.config.regras.colunas
  return [{ key: 'rito', label: c.rito }, { key: 'ato', label: c.ato }, { key: 'prazo', label: c.prazo }, { key: 'fundamento', label: c.fundamento }]
})

/* ---------- Calendário ---------- */
const tribunal = ref<TribunalId>('tjmg')
const opcoesDeTribunal = listaDeTribunais.map(x => ({ value: x.id, label: `${x.sigla} · ${x.nome}` }))
interface DiaDoCalendario { dia: string, motivo: string, tipo: TipoDeDiaSemExpediente, fonte: string, suspensao?: number }
const diasDoTribunal = computed<DiaDoCalendario[]>(() => {
  const tr = tribunais[tribunal.value]
  return [
    ...feriadosNacionais.map(f => ({ dia: f.dia, motivo: f.nome, tipo: 'nacional' as const, fonte: f.fonte })),
    ...tr.feriados.map(f => ({ dia: f.dia, motivo: f.nome, tipo: 'tribunal' as const, fonte: f.fonte })),
    ...estado.suspensoes.filter(s => s.tribunal === tribunal.value).map(s => ({ dia: s.dia, motivo: s.motivo, tipo: 'suspensao' as const, fonte: s.fonte, suspensao: s.id })),
  ].sort((a, b) => (a.dia < b.dia ? -1 : 1))
})
const colunasDoCalendario = computed<EnTableColumn[]>(() => {
  const c = props.t.config.calendario.colunas
  return [{ key: 'dia', label: c.dia }, { key: 'motivo', label: c.motivo }, { key: 'tipo', label: c.tipo }, { key: 'fonte', label: c.fonte }, { key: 'acoes', label: '' }]
})

const modalAberto = ref(false)
const nova = ref({ dia: '2026-10-30', motivo: '', fonte: '' })
const adicionando = ref(false)
function abrirModal() {
  nova.value = { dia: '2026-10-30', motivo: '', fonte: '' }
  modalAberto.value = true
}
async function adicionar() {
  adicionando.value = true
  await new Promise(r => setTimeout(r, 700))
  const sigla = tribunais[tribunal.value].sigla
  const n = adicionarSuspensao(
    { tribunal: tribunal.value, dia: nova.value.dia, motivo: nova.value.motivo.trim(), fonte: nova.value.fonte.trim() },
    props.t.config.calendario.historicoAdicionar(sigla, dia(nova.value.dia, props.t.locale), nova.value.motivo.trim()),
  )
  adicionando.value = false
  modalAberto.value = false
  toast.add({ title: props.t.config.calendario.recalculo(n), description: n ? props.t.config.calendario.recalculoDesc : undefined, icon: n ? 'i-lucide-calendar-sync' : 'i-lucide-calendar-check', color: n ? 'warning' : 'success' })
}
function remover(d: DiaDoCalendario) {
  const sigla = tribunais[tribunal.value].sigla
  const n = removerSuspensao(d.suspensao!, props.t.config.calendario.historicoRemover(sigla, dia(d.dia, props.t.locale)))
  toast.add({ title: props.t.config.calendario.recalculo(n), description: n ? props.t.config.calendario.recalculoDesc : undefined, icon: 'i-lucide-calendar-sync', color: n ? 'warning' : 'neutral' })
}
const corDoTipo: Record<TipoDeDiaSemExpediente, 'neutral' | 'warning' | 'primary'> = { fimDeSemana: 'neutral', nacional: 'neutral', tribunal: 'primary', suspensao: 'warning', recesso: 'neutral' }

/* ---------- Casos de uso ---------- */
const comoChega: Record<AreaJuridica, ComoChega> = {
  contencioso: 'modulo', contratos: 'configuracao', consultivo: 'configuracao', procuracoes: 'configuracao',
  societario: 'configuracao', pagamentos: 'configuracao', marcas: 'configuracao', denuncias: 'plataforma',
}
const iconeDaArea: Record<AreaJuridica, string> = {
  contencioso: 'i-lucide-gavel', contratos: 'i-lucide-file-signature', consultivo: 'i-lucide-messages-square', procuracoes: 'i-lucide-stamp',
  societario: 'i-lucide-building-2', pagamentos: 'i-lucide-banknote', marcas: 'i-lucide-badge-check', denuncias: 'i-lucide-shield-alert',
}
const corDoComo: Record<ComoChega, 'primary' | 'neutral' | 'warning'> = { modulo: 'primary', configuracao: 'neutral', plataforma: 'warning' }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
    <!-- Cabeçalho fixo, com Salvar -->
    <div class="sticky top-0 z-10 border-b border-default bg-default/95 backdrop-blur">
      <div class="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-5 pt-4">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" :aria-label="t.config.voltar" @click="emit('voltar')" />
        <div class="min-w-0 flex-1">
          <h1 class="flex items-center gap-2 text-lg font-semibold text-highlighted">
            <UIcon name="i-lucide-scale" class="size-5 text-primary" />{{ t.config.titulo }}
          </h1>
          <p class="text-sm text-muted">{{ tt.config.subtitulo }}</p>
        </div>
        <UButton :label="t.geral.salvar" icon="i-lucide-save" :loading="salvando" :disabled="!mudou" @click="salvar" />
      </div>
      <div class="mx-auto w-full max-w-6xl px-5">
        <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" class="mt-2 overflow-x-auto" />
      </div>
    </div>

    <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 p-5">
      <Transition mode="out-in" enter-active-class="transition-[opacity,transform] duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
        <!-- Geral -->
        <div v-if="aba === 'geral'" key="geral" class="flex max-w-3xl flex-col gap-6">
          <UFormField :label="t.config.geral.pais" :help="t.config.geral.paisAjuda">
            <URadioGroup v-model="pais" :items="paises" variant="card" orientation="vertical" class="mt-1" />
          </UFormField>
          <USeparator />
          <UFormField :label="t.config.geral.antecedencia" :help="t.config.geral.antecedenciaAjuda">
            <div class="flex items-center gap-3">
              <UInputNumber v-model="rascunho.antecedencia" :min="0" :max="10" class="w-32" />
              <span class="text-sm text-toned">{{ t.config.geral.diasUteis(rascunho.antecedencia) }}</span>
            </div>
          </UFormField>
          <USwitch v-model="rascunho.revisao" :label="t.config.geral.revisao" :description="t.config.geral.revisaoAjuda" />
        </div>

        <!-- Regras -->
        <div v-else-if="aba === 'regras'" key="regras" class="flex flex-col gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <p class="min-w-0 flex-1 text-sm text-toned">{{ t.config.regras.descricao }}</p>
            <UBadge :label="t.config.geral.versao(VERSAO_DO_PACOTE)" icon="i-lucide-package" color="neutral" variant="subtle" />
          </div>
          <EnTable :columns="colunasDeRegras" :rows="regras" :locale="idioma">
            <template #cell-rito="{ row }">
              <span class="text-sm text-toned">{{ t.ritos[(row as Regra).rito] }}</span>
            </template>
            <template #cell-ato="{ row }">
              <span class="text-sm font-medium text-highlighted">{{ (row as Regra).ato }}</span>
            </template>
            <template #cell-prazo="{ row }">
              <span class="text-sm tabular-nums text-highlighted">{{ t.prazoDaRegra(row as Regra) }}</span>
            </template>
            <template #cell-fundamento="{ row }">
              <span class="text-sm text-muted">{{ (row as Regra).fundamento }}</span>
            </template>
          </EnTable>
        </div>

        <!-- Calendário -->
        <div v-else-if="aba === 'calendario'" key="calendario" class="flex flex-col gap-3">
          <p class="max-w-4xl text-sm text-toned">{{ t.config.calendario.descricao }}</p>
          <div class="flex flex-wrap items-end gap-3">
            <UFormField :label="t.config.calendario.tribunal">
              <USelect v-model="tribunal" :items="opcoesDeTribunal" class="w-96 max-w-full" />
            </UFormField>
            <div class="text-xs text-muted">
              <p>{{ t.config.calendario.fuso }}: {{ t.geral.fuso(tribunais[tribunal].fuso) }}</p>
              <p>{{ t.config.calendario.dias(diasDoTribunal.length) }}</p>
            </div>
            <UButton :label="t.config.calendario.adicionar" icon="i-lucide-calendar-plus" color="neutral" variant="outline" class="ml-auto" @click="abrirModal" />
          </div>
          <EnTable :columns="colunasDoCalendario" :rows="diasDoTribunal" :locale="idioma">
            <template #cell-dia="{ row }">
              <span class="text-sm tabular-nums text-highlighted">{{ dia((row as DiaDoCalendario).dia, t.locale) }}</span>
              <span class="ml-1.5 text-xs text-muted">{{ semana((row as DiaDoCalendario).dia, t.locale) }}</span>
            </template>
            <template #cell-motivo="{ row }">
              <span class="text-sm text-toned">{{ (row as DiaDoCalendario).motivo }}</span>
            </template>
            <template #cell-tipo="{ row }">
              <UBadge :label="t.memoria.tipos[(row as DiaDoCalendario).tipo]" :color="corDoTipo[(row as DiaDoCalendario).tipo]" variant="subtle" size="sm" />
            </template>
            <template #cell-fonte="{ row }">
              <span class="text-xs text-muted">{{ (row as DiaDoCalendario).fonte }}</span>
            </template>
            <template #cell-acoes="{ row }">
              <UTooltip v-if="(row as DiaDoCalendario).suspensao" :text="t.config.calendario.remover">
                <UButton icon="i-lucide-trash-2" size="xs" color="neutral" variant="outline" :aria-label="t.config.calendario.remover" @click="remover(row as DiaDoCalendario)" />
              </UTooltip>
              <span v-else />
            </template>
          </EnTable>
        </div>

        <!-- Fontes, Termos monitorados e Destino: o submódulo Capturas (rodada 3) -->
        <FontesDaCaptura v-else-if="aba === 'fontes'" key="fontes" v-model:leitura="rascunho.leitura" :t="t" :erro-captura="erroCaptura" @ir-termos="aba = 'termos'" />
        <TermosMonitorados v-else-if="aba === 'termos'" key="termos" :t="t" />
        <DestinoDaCaptura v-else-if="aba === 'destino'" key="destino" v-model="rascunho.destino" :t="t" />
        <EventosDoSpaceflow v-else-if="aba === 'eventos'" key="eventos" :t="t" />

        <!-- Provisão -->
        <div v-else-if="aba === 'provisao'" key="provisao" class="flex max-w-3xl flex-col gap-5">
          <UFormField :label="t.config.provisao.norma" :help="t.config.provisao.normaAjuda">
            <UInput :model-value="t.config.provisao.normaValor" disabled class="w-full" />
          </UFormField>
          <UFormField :label="t.config.provisao.dataBase">
            <UInput :model-value="t.config.provisao.dataBaseValor" disabled class="w-full" />
          </UFormField>
          <UFormField :label="t.config.provisao.quemFecha">
            <div class="flex items-center gap-2">
              <UAvatar :text="pessoaPorId.get(15)?.iniciais" size="xs" />
              <span class="text-sm text-highlighted">{{ pessoaPorId.get(15)?.nome }}</span>
              <span class="text-xs text-muted">{{ pessoaPorId.get(15)?.papel }}</span>
            </div>
          </UFormField>
          <UFormField :label="t.config.provisao.correcao">
            <UInput :model-value="t.config.provisao.correcaoValor" disabled class="w-full" />
          </UFormField>
          <USwitch :model-value="true" disabled :label="t.config.provisao.motivo" />
        </div>

        <!-- Casos de uso -->
        <div v-else key="casos" class="flex flex-col gap-4">
          <p class="max-w-4xl text-sm text-toned">{{ t.config.casos.descricao }}</p>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article
              v-for="(area, i) in (Object.keys(t.config.casos.areas) as AreaJuridica[])"
              :key="area"
              class="flex animate-[entrada_.3s_ease-out_both] flex-col gap-2 rounded-lg border border-default p-4 transition-colors hover:border-accented"
              :style="{ animationDelay: `${i * 40}ms` }"
            >
              <div class="flex items-center gap-2">
                <span class="flex size-8 items-center justify-center rounded-md bg-elevated text-toned">
                  <UIcon :name="iconeDaArea[area]" class="size-4" />
                </span>
                <h3 class="text-sm font-semibold text-highlighted">{{ t.config.casos.areas[area].nome }}</h3>
              </div>
              <UBadge :label="t.config.casos.como[comoChega[area]]" :color="corDoComo[comoChega[area]]" variant="subtle" size="sm" class="self-start" />
              <p class="flex-1 text-xs text-muted">{{ t.config.casos.areas[area].desc }}</p>
              <UButton :label="t.config.casos.verNaGaleria" icon="i-lucide-layout-template" size="xs" color="neutral" variant="outline" class="self-start" />
            </article>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Adicionar suspensão -->
    <UModal v-model:open="modalAberto" :title="t.config.calendario.modal.titulo" :description="tribunais[tribunal].nome">
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField :label="t.config.calendario.modal.dia" required>
            <UInput v-model="nova.dia" type="date" class="w-48" />
          </UFormField>
          <UFormField :label="t.config.calendario.modal.motivo" required>
            <UInput v-model="nova.motivo" :placeholder="t.config.calendario.modal.motivoPh" class="w-full" />
          </UFormField>
          <UFormField :label="t.config.calendario.modal.fonte">
            <UInput v-model="nova.fonte" :placeholder="t.config.calendario.modal.fontePh" class="w-full" />
          </UFormField>
          <UAlert icon="i-lucide-calendar-sync" color="warning" variant="subtle" :description="t.config.calendario.modal.aviso" />
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.geral.cancelar" color="neutral" variant="ghost" @click="modalAberto = false" />
          <UButton :label="t.config.calendario.modal.confirmar" icon="i-lucide-calendar-plus" :loading="adicionando" :disabled="!nova.dia || !nova.motivo.trim()" @click="adicionar" />
        </div>
      </template>
    </UModal>
  </div>
</template>

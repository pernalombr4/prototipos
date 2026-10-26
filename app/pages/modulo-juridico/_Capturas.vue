<script setup lang="ts">
/**
 * PROPOSTA: Jurídico › Capturas (rodada 3). A caixa de tudo o que as fontes trouxeram: intimação, citação,
 * distribuição de ação nova e andamento. Substitui a caixa Intimações das rodadas 1 e 2 e herda a lógica dela.
 *
 * - cada captura mostra de onde veio (canal e fonte), o termo que casou e quem trata;
 * - a mesma comunicação vinda de 2 fontes fica numa linha só (mesmo hash), com "+1 fonte";
 * - a mesma intimação vinda por 2 meios mostra as 2 datas e diz qual vale (Res. CNJ 569/2024, Tema 1.180 do STJ);
 * - citação no Domicílio pede confirmação em 3 dias úteis; intimação no portal e no Domicílio tem ciência tácita;
 * - distribuição vira processo com 1 clique, ou sai como homônimo e ensina o termo;
 * - andamento vai para a categoria Andamentos, um por um ou em lote;
 * - o botão de saúde na barra mostra as fontes sem sair da caixa.
 *
 * Rodada 4 (o que vem depois da captura):
 * - a visualização Citações, ordenada pelo que vence primeiro ("Confirmar até", depois a resposta);
 * - a citação escolhe de onde conta a resposta: da citação, da audiência de conciliação, na audiência do Juizado ou
 *   até a audiência trabalhista (CPC, art. 335; Lei 9.099/1995, art. 30; CLT, art. 847);
 * - a audiência lida no teor vai para a Agenda, sem cálculo;
 * - o andamento vai para a linha do tempo do processo, não para uma categoria;
 * - a citação de ação nova cadastra o processo, e a petição inicial vem junto;
 * - cada captura mostra os eventos que entregou ao Spaceflow e os fluxos que eles dispararam.
 *
 * A tela é a lista de registros do ENSPACE: a mesma barra, o `EnTable` com seleção e o painel à direita.
 * Fontes de mercado: `pesquisa/reports/Captura em softwares jurídicos.md`, seção "O que o submódulo Capturas precisa ter".
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { AudienciaNoTeor, Intimacao, MarcoDaResposta, RegraId } from './mocks'
import { HOJE, pessoaPorId, pessoas, processos, regraPorId, regras, tribunais } from './mocks'
import { calcular, cienciaTacita, diferencaEmDias, limiteDaCitacao } from './prazos'
import type { Resposta } from './estado'
import {
  audienciaDaCaptura, cadastrarProcesso, calcularPrazo, confirmar, descartar, entradaDa, estado, processoDaCaptura,
  registrarAudiencia, registrarCiencia, responsavelDa, tratar, vincular, voltarParaRevisao,
} from './estado'
import { fluxoPorId } from './tratamento'
import { textosTratamento } from './textos-tratamento'
import { fontePorId, fontes, saudeAtual } from './capturas'
import type { Textos } from './textos'
import { textosCapturas } from './textos-capturas'
import { dataHora, dia, diaHoraCurto, dinheiro } from './formato'
import MemoriaDoCalculo from './_MemoriaDoCalculo.vue'
import BarraDaLista from './_BarraDaLista.vue'

const props = defineProps<{
  t: Textos
  cenario: 'normal' | 'vazio' | 'erroCaptura' | 'carregando'
}>()
const emit = defineEmits<{ abrirProcesso: [number], irPrazos: [], irFontes: [], irTermos: [], irAgenda: [] }>()
const tc = useTextos(textosCapturas)
const tt = useTextos(textosTratamento)
const toast = useToast()
const idioma = useIdioma()

type Vista = 'tratar' | 'citacoes' | 'distribuicoes' | 'andamentos' | 'tratadas' | 'descartadas'
const vista = ref<Vista>('tratar')
const busca = ref('')

const visiveis = computed(() => (props.cenario === 'vazio' ? estado.intimacoes.filter(i => i.status !== 'revisar') : estado.intimacoes))
const naVista = (i: Intimacao, v: Vista) => {
  if (v === 'tratadas') return i.status === 'confirmada'
  if (v === 'descartadas') return i.status === 'descartada'
  if (i.status !== 'revisar') return false
  if (v === 'citacoes') return i.tipo === 'citacao'
  if (v === 'distribuicoes') return i.tipo === 'distribuicao'
  if (v === 'andamentos') return i.tipo === 'andamento'
  return true
}

const lista = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return visiveis.value
    .filter(i => naVista(i, vista.value))
    .filter((i) => {
      if (!q) return true
      const p = processoDaCaptura(i)
      return [i.numeroCnj, i.orgao, i.teor, p?.data.parteContraria, p?.reference, i.distribuicao?.autor].some(x => x?.toLowerCase().includes(q))
    })
    .sort((a, b) => (vista.value === 'citacoes'
      ? (urgencia(a) < urgencia(b) ? -1 : 1)
      : (b.recebidaEm?.getTime() ?? 0) - (a.recebidaEm?.getTime() ?? 0)))
})

const vistas = computed(() => (['tratar', 'citacoes', 'distribuicoes', 'andamentos', 'tratadas', 'descartadas'] as Vista[]).map(v => ({
  chave: v,
  rotulo: v === 'citacoes' ? tt.value.caixa.vistaCitacoes : tc.value.caixa.vistas[v],
  icone: 'i-lucide-table',
  contagem: ['tratar', 'citacoes', 'distribuicoes', 'andamentos'].includes(v) ? visiveis.value.filter(i => naVista(i, v)).length : undefined,
})))
const vistaAtiva = computed({ get: () => vista.value as string, set: (v: string) => { vista.value = v as Vista; selecionadas.value = [] } })

const colunas = computed<EnTableColumn[]>(() => {
  const c = tc.value.caixa.colunas
  return [
    { key: 'recebida', label: c.recebida },
    { key: 'tipo', label: c.tipo },
    { key: 'origem', label: c.origem },
    { key: 'processo', label: c.processo },
    { key: 'termo', label: c.termo },
    { key: 'situacao', label: c.situacao },
    { key: 'responsavel', label: c.responsavel },
  ]
})

/* ---------- saúde das fontes ---------- */
const comProblema = computed(() => fontes.filter(f => saudeAtual(f, props.cenario === 'erroCaptura') !== 'ok'))
const corDaSaude = { ok: 'success', atencao: 'warning', falha: 'error' } as const

/* ---------- o que cada linha mostra ---------- */
const termoDa = (i: Intimacao) => estado.termos.find(x => x.id === i.termo)
const corDoTipo = { intimacao: 'primary', citacao: 'warning', distribuicao: 'info', andamento: 'neutral' } as const

/** Rodada 4: na citação, a resposta sugerida pelo rito e pelo teor (marco e audiência). */
const respostaSugerida = (i: Intimacao): Resposta | undefined => (i.tipo === 'citacao' && i.marcoSugerido
  ? { marco: i.marcoSugerido, audiencia: i.audiencia?.dia, hora: i.audiencia?.hora }
  : undefined)

/** O prazo fatal pela regra sugerida, para a coluna. Sem ciência, ainda não há prazo. */
function fatalDaLinha(i: Intimacao) {
  const p = processoDaCaptura(i)
  const regra = i.regraSugerida ? regraPorId.get(i.regraSugerida) : undefined
  const e = entradaDa(i)
  if (!p || !regra || !e) return undefined
  return calcular({ ...e, ...respostaSugerida(i), regra, tribunal: p.data.tribunal, suspensoes: estado.suspensoes, antecedencia: estado.antecedencia }).fatal
}
/** A ordem da visualização Citações: o que vence primeiro, a confirmação ou a resposta. */
const urgencia = (i: Intimacao) => (i.tipo === 'citacao' && !i.ciencia && i.meio === 'domicilio' ? limiteDaCitacao(i.dia, i.tribunal) : fatalDaLinha(i) ?? '9999')
const defesaNaAudiencia = (i: Intimacao) => i.tipo === 'citacao' && (i.marcoSugerido === 'juizado' || i.marcoSugerido === 'trabalho') && !!i.audiencia
const fatalConfirmado = (i: Intimacao) => {
  const p = estado.prazos.find(x => x.intimacao === i.id)
  return p ? calcularPrazo(p).fatal : undefined
}
const semCiencia = (i: Intimacao) => (i.meio === 'domicilio' || i.meio === 'portal') && !i.ciencia
const citacaoAberta = (i: Intimacao) => i.tipo === 'citacao' && i.meio === 'domicilio' && !i.ciencia

function menuDaLinha(i: Intimacao): DropdownMenuItem[][] {
  const p = processoDaCaptura(i)
  return [[
    { label: i.status === 'revisar' ? props.t.intimacoes.revisar : props.t.lista.verDetalhes, icon: 'i-lucide-eye', onSelect: () => { selecionadaId.value = i.id } },
    ...(p ? [{ label: props.t.intimacoes.abrirProcesso, icon: 'i-lucide-arrow-up-right', onSelect: () => emit('abrirProcesso', p.id) }] : []),
  ]]
}

/* ---------- seleção e ações em lote ---------- */
const selecionadas = ref<Intimacao[]>([])
// Rodada 4: andamento com audiência pede conferência da data, um por um.
const soAndamentos = computed(() => selecionadas.value.length > 0 && selecionadas.value.every(i => i.tipo === 'andamento' && i.status === 'revisar' && !i.audiencia && processoDaCaptura(i)))
const itensAtribuir = computed<DropdownMenuItem[][]>(() => [pessoas.map(p => ({
  label: p.nome,
  avatar: { text: p.iniciais },
  onSelect: () => {
    for (const i of selecionadas.value) estado.responsaveis[i.id] = p.id
    toast.add({ title: tc.value.caixa.lote.atribuidas(selecionadas.value.length, p.nome), icon: 'i-lucide-user-check', color: 'success' })
    selecionadas.value = []
  },
}))])
function registrarEmLote() {
  const n = selecionadas.value.length
  for (const i of selecionadas.value) tratar(i)
  selecionadas.value = []
  toast.add({ title: tt.value.andamento.registrados(n), icon: 'i-lucide-list-checks', color: 'success' })
}

/* ---------- a captura aberta ---------- */
const selecionadaId = ref<number | undefined>()
const painelAberto = computed({ get: () => selecionadaId.value !== undefined, set: (v) => { if (!v) selecionadaId.value = undefined } })
const sel = computed(() => estado.intimacoes.find(i => i.id === selecionadaId.value))
const processo = computed(() => (sel.value ? processoDaCaptura(sel.value) : undefined))
const fonteDaSel = computed(() => (sel.value?.fonte ? fontePorId.get(sel.value.fonte) : undefined))
const ehPrazo = computed(() => sel.value?.tipo === 'intimacao' || sel.value?.tipo === 'citacao')

const regraEscolhida = ref<RegraId | undefined>()
const responsavel = ref<number>(12)
/* Rodada 4: a resposta à citação e a audiência lida no teor */
const ehCitacao = computed(() => sel.value?.tipo === 'citacao')
const marco = ref<MarcoDaResposta>('citacao')
const diaDaAudiencia = ref('')
const horaDaAudiencia = ref('')
const levarAudiencia = ref(true)
const regraDoMarco: Record<MarcoDaResposta, RegraId> = { citacao: 'cpc-contestacao', conciliacao: 'cpc-contestacao', juizado: 'jec-contestacao', trabalho: 'clt-defesa' }
watch(sel, (i) => {
  regraEscolhida.value = i?.regraSugerida
  responsavel.value = i ? responsavelDa(i) : 12
  // Citação já confirmada: o painel mostra a resposta como ela foi gravada no prazo.
  const gravada = i ? estado.prazos.find(x => x.intimacao === i.id)?.entrada : undefined
  marco.value = gravada?.marco ?? i?.marcoSugerido ?? 'citacao'
  diaDaAudiencia.value = gravada?.audiencia ?? i?.audiencia?.dia ?? ''
  horaDaAudiencia.value = gravada?.hora ?? i?.audiencia?.hora ?? ''
  levarAudiencia.value = true
}, { immediate: true })
watch(marco, (m) => { if (ehCitacao.value) regraEscolhida.value = regraDoMarco[m] })
const precisaAudiencia = computed(() => marco.value !== 'citacao')
const itensDeMarco = computed(() => (['citacao', 'conciliacao', 'juizado', 'trabalho'] as MarcoDaResposta[]).map(m => ({ value: m, label: tt.value.resposta.marcos[m] })))
/** A resposta que entra no cálculo: o marco e, quando ele depende da audiência, o dia e a hora conferidos. */
const resposta = computed<Resposta | undefined>(() => (ehCitacao.value
  ? { marco: marco.value, audiencia: precisaAudiencia.value ? diaDaAudiencia.value || undefined : undefined, hora: horaDaAudiencia.value || undefined }
  : undefined))
/** A audiência como ela vai para a Agenda, com a data e a hora conferidas na tela. */
const audienciaConferida = computed<AudienciaNoTeor | undefined>(() => (sel.value?.audiencia && diaDaAudiencia.value
  ? { ...sel.value.audiencia, dia: diaDaAudiencia.value, hora: horaDaAudiencia.value || sel.value.audiencia.hora }
  : undefined))
const audienciaRegistrada = computed(() => (sel.value ? audienciaDaCaptura(sel.value) : undefined))
const disparosDaSel = computed(() => estado.disparos.filter(d => d.captura === sel.value?.id))
const nomesDosFluxos = (ids: number[]) => ids.map(id => fluxoPorId.get(id)?.nome).join(', ')

// A defesa na audiência (rodada 4) só vale para a citação, que escolhe o marco.
const regrasDoRito = computed(() => regras
  .filter(r => r.dias > 0 && (!processo.value || r.rito === processo.value.data.rito))
  .map(r => ({ label: `${r.ato} (${props.t.prazoDaRegra(r)})`, value: r.id })))
const itensResponsavel = computed(() => pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais } })))
const itensProcesso = computed(() => processos.map(p => ({ label: `${p.reference} · ${p.titulo}`, value: p.id })))

const calculo = computed(() => {
  const i = sel.value
  const p = processo.value
  const regra = regraEscolhida.value ? regraPorId.get(regraEscolhida.value) : undefined
  const e = i ? entradaDa(i) : undefined
  if (!i || !p || !regra || !e) return undefined
  if (ehCitacao.value && precisaAudiencia.value && !diaDaAudiencia.value) return undefined
  return calcular({ ...e, ...resposta.value, regra, tribunal: p.data.tribunal, suspensoes: estado.suspensoes, antecedencia: estado.antecedencia })
})

/** A mesma intimação por 2 meios: o prazo por cada data, para comparar. */
const doisMeios = computed(() => {
  const i = sel.value
  const p = processo.value
  const regra = regraEscolhida.value ? regraPorId.get(regraEscolhida.value) : undefined
  if (!i?.outroMeio || !p || !regra || i.meio !== 'djen') return undefined
  const base = { regra, tribunal: p.data.tribunal, suspensoes: estado.suspensoes, antecedencia: estado.antecedencia }
  return {
    djen: calcular({ ...base, meio: 'djen', dia: i.dia }).fatal,
    portal: calcular({ ...base, meio: 'portal', dia: i.outroMeio.ciencia }).fatal,
    maisCedo: i.outroMeio.ciencia < i.dia,
  }
})

const pronta = computed(() => sel.value?.status === 'revisar' && ehPrazo.value && !!processo.value && !semCiencia(sel.value!))
const prazoConfirmado = computed(() => estado.prazos.find(p => p.intimacao === sel.value?.id))
const quemTratou = (i: Intimacao) => (typeof i.tratadaPor === 'number' ? pessoaPorId.get(i.tratadaPor)?.nome ?? '' : '')

/* ---------- ações ---------- */
const confirmando = ref(false)
async function confirmarPrazo() {
  const i = sel.value
  if (!i || !regraEscolhida.value || !calculo.value) return
  confirmando.value = true
  await new Promise(r => setTimeout(r, 650))
  const interno = calculo.value.interno
  const aud = levarAudiencia.value ? audienciaConferida.value : undefined
  confirmar(i, regraEscolhida.value, responsavel.value, resposta.value, aud)
  confirmando.value = false
  toast.add({
    title: props.t.intimacoes.confirmadoToast(processo.value?.reference ?? ''),
    description: props.t.intimacoes.confirmadoDesc(pessoaPorId.get(responsavel.value)?.nome ?? '', dia(interno, props.t.locale)),
    icon: 'i-lucide-circle-check',
    color: 'success',
  })
  if (aud) avisarAudiencia(aud)
}

function avisarAudiencia(a: AudienciaNoTeor) {
  toast.add({
    title: tt.value.audiencia.toast(dia(a.dia, props.t.locale), a.hora),
    icon: 'i-lucide-calendar-clock',
    color: 'success',
    actions: [{ label: tt.value.audiencia.verAgenda, color: 'neutral', variant: 'outline', onClick: () => emit('irAgenda') }],
  })
}

type Ciencia = 'domicilio' | 'citacao' | 'portal'
const modalCiencia = ref<Ciencia | undefined>()
const textoDaCiencia = computed(() => {
  const c = tc.value.caixa.painel
  if (modalCiencia.value === 'citacao') return { titulo: c.citacao.modalTitulo, texto: c.citacao.modalTexto, botao: c.citacao.confirmar, feito: c.citacao.confirmada }
  if (modalCiencia.value === 'portal') return { titulo: c.portal.modalTitulo, texto: c.portal.modalTexto, botao: c.portal.abrir, feito: c.portal.registrada }
  const m = props.t.intimacoes.modalCiencia
  return { titulo: m.titulo, texto: m.texto, botao: m.confirmar, feito: props.t.intimacoes.cienciaRegistrada }
})
function registrar() {
  if (!sel.value) return
  const feito = textoDaCiencia.value.feito
  registrarCiencia(sel.value)
  modalCiencia.value = undefined
  toast.add({ title: feito, icon: 'i-lucide-mail-check', color: 'success' })
}

function escolherProcesso(id: number) {
  if (!sel.value) return
  vincular(sel.value, id)
  toast.add({ title: tc.value.caixa.painel.vincular.feito(processos.find(p => p.id === id)?.reference ?? ''), icon: 'i-lucide-link', color: 'success' })
}

const cadastrando = ref(false)
async function cadastrar() {
  const i = sel.value
  if (!i) return
  cadastrando.value = true
  await new Promise(r => setTimeout(r, 700))
  const p = cadastrarProcesso(i)
  cadastrando.value = false
  if (!p) return
  const d = tc.value.caixa.painel.distribuicao
  toast.add({
    title: d.cadastradoToast(p.reference),
    description: i.tipo === 'citacao' ? undefined : d.cadastradoDesc(pessoaPorId.get(p.data.responsavel)?.nome ?? ''),
    icon: 'i-lucide-file-plus-2',
    color: 'success',
    actions: [{ label: d.abrirProcesso, color: 'neutral', variant: 'outline', onClick: () => emit('abrirProcesso', p.id) }],
  })
}

/** Homônimo: descarta e oferece a exceção no termo que casou, para a próxima não chegar. */
function naoEDaEmpresa() {
  const i = sel.value
  if (!i?.distribuicao) return
  const d = tc.value.caixa.painel.distribuicao
  descartar(i, tc.value.caixa.descarte.opcoes[2]!)
  const termo = termoDa(i)
  const nome = i.distribuicao.reu
  toast.add({
    title: d.excecaoTitulo,
    description: termo ? d.excecaoDesc(termo.valor, nome) : undefined,
    icon: 'i-lucide-user-x',
    color: 'neutral',
    duration: 8000,
    actions: termo && !termo.excecoes.includes(nome)
      ? [{ label: d.excecaoAcao, icon: 'i-lucide-filter-x', color: 'neutral', variant: 'outline', onClick: () => {
          termo.excecoes.push(nome)
          toast.add({ title: d.excecaoFeita(nome), icon: 'i-lucide-check', color: 'success' })
        } }]
      : undefined,
  })
}

function registrarAndamento() {
  const i = sel.value
  if (!i) return
  const aud = levarAudiencia.value ? audienciaConferida.value : undefined
  tratar(i)
  if (aud) registrarAudiencia(i, aud)
  toast.add({ title: tt.value.andamento.registrado(processo.value?.reference ?? ''), icon: 'i-lucide-list-checks', color: 'success' })
  if (aud) avisarAudiencia(aud)
}

/** A distribuição de uma ação que a citação já cadastrou: só registra no processo. */
function registrarDistribuicao() {
  if (!sel.value || !processo.value) return
  tratar(sel.value)
  toast.add({ title: tt.value.distribuicao.registrada(processo.value.reference), icon: 'i-lucide-check', color: 'success' })
}

/* Descartar: uma captura (painel) ou várias (lote) */
const modalDescarte = ref<'uma' | 'lote' | undefined>()
const motivoDoDescarte = ref('')
watch(modalDescarte, (a) => { if (a) motivoDoDescarte.value = tc.value.caixa.descarte.opcoes[0]! })
function confirmarDescarte() {
  if (modalDescarte.value === 'lote') {
    const n = selecionadas.value.length
    for (const i of selecionadas.value) descartar(i, motivoDoDescarte.value)
    selecionadas.value = []
    toast.add({ title: tc.value.caixa.lote.descartadas(n), icon: 'i-lucide-archive', color: 'neutral' })
  }
  else if (sel.value) {
    descartar(sel.value, motivoDoDescarte.value)
    toast.add({ title: tc.value.caixa.descarte.toast, icon: 'i-lucide-archive', color: 'neutral' })
  }
  modalDescarte.value = undefined
}

function maquete() {
  toast.add({ title: props.t.geral.foraDoEscopo, icon: 'i-lucide-construction', color: 'neutral' })
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <BarraDaLista v-model:ativa="vistaAtiva" v-model:busca="busca" :t="t" :vistas="vistas" :pesquisar="tc.caixa.pesquisar">
      <template #antes-dos-icones>
        <!-- PROPOSTA: a saúde das fontes, sem sair da caixa -->
        <UPopover :content="{ align: 'end' }">
          <UButton
            :label="comProblema.length ? tc.caixa.saude.problema(comProblema.length) : tc.caixa.saude.emDia"
            :icon="comProblema.length ? 'i-lucide-triangle-alert' : 'i-lucide-radio-tower'"
            :color="comProblema.some(f => saudeAtual(f, cenario === 'erroCaptura') === 'falha') ? 'error' : comProblema.length ? 'warning' : 'neutral'"
            variant="outline"
            size="sm"
            class="mr-1"
          />
          <template #content>
            <div class="flex w-80 flex-col gap-1 p-3">
              <p class="mb-1 text-xs font-semibold text-muted">{{ tc.caixa.saude.titulo }}</p>
              <div v-for="f in fontes" :key="f.id" class="flex items-center gap-2 rounded-md px-1.5 py-1">
                <span class="size-2 shrink-0 rounded-full" :class="{ 'bg-success': saudeAtual(f, cenario === 'erroCaptura') === 'ok', 'bg-warning': saudeAtual(f, cenario === 'erroCaptura') === 'atencao', 'bg-error': saudeAtual(f, cenario === 'erroCaptura') === 'falha' }" />
                <UIcon :name="f.icone" class="size-4 shrink-0 text-muted" />
                <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ tc.fontes.curtos[f.id] }}</span>
                <span class="text-xs tabular-nums text-muted">{{ cenario === 'erroCaptura' && f.id === 'domicilio' ? tc.fontes.saude.falha : tc.caixa.saude.ultima(f.ultima) }}</span>
              </div>
              <UButton :label="tc.caixa.saude.ver" icon="i-lucide-arrow-right" trailing size="xs" color="neutral" variant="outline" class="mt-2 self-start" @click="emit('irFontes')" />
            </div>
          </template>
        </UPopover>
      </template>
    </BarraDaLista>

    <UAlert
      v-if="cenario === 'erroCaptura'"
      class="mx-4 mt-3 w-auto"
      :title="tc.caixa.erro.titulo"
      :description="tc.caixa.erro.desc"
      icon="i-lucide-plug-zap"
      color="error"
      variant="subtle"
      :actions="[{ label: tc.caixa.erro.acao, color: 'error', variant: 'outline', size: 'xs', onClick: () => emit('irFontes') }]"
    />

    <!-- Ações em lote -->
    <Transition enter-active-class="transition-[opacity,transform] duration-150 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
      <div v-if="selecionadas.length" class="flex flex-wrap items-center gap-2 border-b border-default bg-elevated/50 px-4 py-2">
        <span class="mr-2 text-sm font-medium text-highlighted">{{ tc.caixa.lote.selecionadas(selecionadas.length) }}</span>
        <UDropdownMenu :items="itensAtribuir" :content="{ align: 'start' }">
          <UButton :label="tc.caixa.lote.atribuir" icon="i-lucide-user-plus" trailing-icon="i-lucide-chevron-down" size="xs" color="neutral" variant="outline" />
        </UDropdownMenu>
        <UTooltip :text="tt.caixa.loteAjuda" :disabled="soAndamentos">
          <UButton :label="tc.caixa.lote.tratar" icon="i-lucide-list-checks" size="xs" color="neutral" variant="outline" :disabled="!soAndamentos" @click="registrarEmLote" />
        </UTooltip>
        <UButton :label="tc.caixa.lote.descartar" icon="i-lucide-archive" size="xs" color="neutral" variant="outline" @click="modalDescarte = 'lote'" />
        <UButton :label="tc.caixa.lote.limpar" icon="i-lucide-x" size="xs" color="neutral" variant="ghost" class="ml-auto" @click="selecionadas = []" />
      </div>
    </Transition>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <div :key="vista" class="animate-[entrada_.25s_ease-out]">
        <EnTable
          v-model:selected="selecionadas"
          :columns="colunas"
          :rows="lista"
          :loading="cenario === 'carregando'"
          selectable
          :pagination="{ page: 1, pageCount: 1, total: lista.length }"
          :locale="idioma"
          :empty-state="vista === 'tratar' && !busca
            ? { icon: 'i-lucide-inbox', title: tc.caixa.vazio.titulo, description: tc.caixa.vazio.desc }
            : { icon: 'i-lucide-search-x', title: t.intimacoes.vazioFiltro.titulo, description: t.intimacoes.vazioFiltro.desc }"
          class="[&_tbody_tr]:cursor-pointer"
          @row-click="(r) => { selecionadaId = (r as Intimacao).id }"
        >
          <template #cell-recebida="{ row }">
            <span class="text-sm tabular-nums text-toned">{{ (row as Intimacao).recebidaEm ? diaHoraCurto((row as Intimacao).recebidaEm!, t.locale) : dia((row as Intimacao).dia, t.locale) }}</span>
          </template>
          <template #cell-tipo="{ row }">
            <UBadge :label="tc.caixa.tipos[(row as Intimacao).tipo]" :color="corDoTipo[(row as Intimacao).tipo]" variant="subtle" size="sm" />
          </template>
          <template #cell-origem="{ row }">
            <span class="flex flex-col gap-1 py-1">
              <span class="text-sm text-highlighted">{{ tc.caixa.canais[(row as Intimacao).meio] }}</span>
              <span v-if="(row as Intimacao).fonte === 'externo'" class="text-xs text-muted">{{ tc.caixa.via(tc.fontes.curtos.externo) }}</span>
              <span v-if="(row as Intimacao).tambemPor?.length || (row as Intimacao).outroMeio" class="flex flex-wrap gap-1">
                <UBadge v-if="(row as Intimacao).tambemPor?.length" :label="tc.caixa.maisFontes((row as Intimacao).tambemPor!.length)" icon="i-lucide-copy-check" color="neutral" variant="outline" size="sm" />
                <UBadge v-if="(row as Intimacao).outroMeio" :label="tc.caixa.doisMeios" icon="i-lucide-git-compare" color="warning" variant="outline" size="sm" />
              </span>
            </span>
          </template>
          <template #cell-processo="{ row }">
            <span v-if="processoDaCaptura(row as Intimacao)" class="flex min-w-0 flex-col py-1">
              <span class="max-w-64 truncate text-sm text-highlighted">{{ processoDaCaptura(row as Intimacao)?.titulo }}</span>
              <span class="text-xs text-muted">{{ processoDaCaptura(row as Intimacao)?.reference }} · {{ tribunais[(row as Intimacao).tribunal].sigla }}</span>
            </span>
            <span v-else class="flex flex-col gap-1 py-1">
              <span class="font-mono text-xs text-toned">{{ (row as Intimacao).numeroCnj }}</span>
              <UBadge
                :label="(row as Intimacao).tipo === 'distribuicao' ? tc.caixa.acaoNova : tc.caixa.semProcesso"
                :icon="(row as Intimacao).tipo === 'distribuicao' ? 'i-lucide-file-plus-2' : 'i-lucide-link-2-off'"
                :color="(row as Intimacao).tipo === 'distribuicao' ? 'info' : 'warning'"
                variant="outline"
                size="sm"
                class="self-start"
              />
            </span>
          </template>
          <template #cell-termo="{ row }">
            <span v-if="termoDa(row as Intimacao)" class="flex flex-col">
              <span class="max-w-44 truncate text-sm text-toned">{{ termoDa(row as Intimacao)!.valor }}</span>
              <span class="text-xs text-muted">{{ tc.termos.tipos[termoDa(row as Intimacao)!.tipo] }}</span>
            </span>
            <span v-else class="text-xs text-muted">{{ tc.caixa.pelaCnj }}</span>
          </template>
          <template #cell-situacao="{ row }">
            <!-- Tratada -->
            <span v-if="(row as Intimacao).status === 'confirmada'" class="flex items-center gap-1.5 text-sm text-highlighted">
              <UIcon name="i-lucide-circle-check" class="size-4 shrink-0 text-success" />
              <span v-if="fatalConfirmado(row as Intimacao)" class="tabular-nums">{{ dia(fatalConfirmado(row as Intimacao)!, t.locale) }}</span>
              <span v-else-if="(row as Intimacao).tipo === 'distribuicao'">{{ tc.caixa.situacao.cadastrado(processoDaCaptura(row as Intimacao)?.reference ?? '') }}</span>
              <span v-else-if="(row as Intimacao).tratadaPor === 'automatico'" class="text-toned">{{ tc.caixa.situacao.automatico }}</span>
              <span v-else class="text-toned">{{ tc.caixa.situacao.registrado }}</span>
            </span>
            <span v-else-if="(row as Intimacao).status === 'descartada'" class="text-sm text-muted">{{ (row as Intimacao).motivoDoDescarte }}</span>
            <!-- Para tratar -->
            <UBadge
              v-else-if="citacaoAberta(row as Intimacao)"
              :label="tc.caixa.situacao.confirmarAte(dia(limiteDaCitacao((row as Intimacao).dia, (row as Intimacao).tribunal), t.locale))"
              icon="i-lucide-alarm-clock"
              :color="diferencaEmDias(HOJE, limiteDaCitacao((row as Intimacao).dia, (row as Intimacao).tribunal)) <= 1 ? 'error' : 'warning'"
              variant="outline"
              size="sm"
            />
            <UBadge
              v-else-if="semCiencia(row as Intimacao)"
              :label="tc.caixa.situacao.tacitaEm(dia(cienciaTacita((row as Intimacao).dia), t.locale))"
              icon="i-lucide-hourglass"
              :color="diferencaEmDias(HOJE, cienciaTacita((row as Intimacao).dia)) <= 2 ? 'error' : 'neutral'"
              variant="outline"
              size="sm"
            />
            <span v-else-if="(row as Intimacao).tipo === 'distribuicao'" class="text-sm text-toned">{{ tc.caixa.situacao.semCitacao }}</span>
            <span v-else-if="(row as Intimacao).tipo === 'andamento'" class="text-sm text-toned">{{ tc.caixa.situacao.paraRegistrar }}</span>
            <span v-else-if="(row as Intimacao).tipo === 'citacao' && !processoDaCaptura(row as Intimacao)" class="text-sm text-warning">{{ tt.caixa.situacao.cadastrarProcesso }}</span>
            <span v-else-if="fatalDaLinha(row as Intimacao)" class="flex flex-col">
              <span class="text-sm font-medium tabular-nums text-highlighted">{{ dia(fatalDaLinha(row as Intimacao)!, t.locale) }}<template v-if="defesaNaAudiencia(row as Intimacao)">, {{ (row as Intimacao).audiencia!.hora }}</template></span>
              <span class="text-xs text-muted">{{ (row as Intimacao).tipo === 'citacao' && (row as Intimacao).marcoSugerido ? tt.resposta.marcos[(row as Intimacao).marcoSugerido!] : regraPorId.get((row as Intimacao).regraSugerida!)?.ato }}</span>
            </span>
            <UBadge v-else-if="processoDaCaptura(row as Intimacao)" :label="tc.caixa.situacao.semRegra" icon="i-lucide-circle-help" color="warning" variant="outline" size="sm" />
            <span v-else class="text-sm text-toned">{{ t.intimacoes.semProcessoBloco.vincular }}</span>
          </template>
          <template #cell-responsavel="{ row }">
            <span class="flex items-center gap-2">
              <UAvatar :text="pessoaPorId.get(responsavelDa(row as Intimacao))?.iniciais" size="2xs" />
              <span class="max-w-32 truncate text-sm text-toned">{{ pessoaPorId.get(responsavelDa(row as Intimacao))?.nome }}</span>
            </span>
          </template>
          <template #actions="{ row }">
            <UDropdownMenu :items="menuDaLinha(row as Intimacao)" :content="{ align: 'start' }" :ui="{ content: 'w-60' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.lista.acoes" @click.stop />
            </UDropdownMenu>
          </template>
        </EnTable>
      </div>
    </div>

    <!-- A captura, no painel à direita -->
    <USlideover
      v-model:open="painelAberto"
      :title="sel ? `${tc.caixa.tipos[sel.tipo]} · ${processo?.reference ?? sel.numeroCnj}` : ''"
      :description="sel ? (processo?.titulo ?? sel.orgao) : ''"
      :ui="{ content: 'max-w-2xl' }"
    >
      <template #body>
        <div v-if="sel" class="flex flex-col gap-4">
          <!-- Identificação -->
          <div class="flex flex-col gap-1.5">
            <div class="flex flex-wrap items-center gap-2 text-xs text-muted">
              <UBadge :label="tc.caixa.tipos[sel.tipo]" :color="corDoTipo[sel.tipo]" variant="subtle" size="sm" />
              <UBadge :label="tc.caixa.canais[sel.meio]" color="neutral" variant="outline" size="sm" />
              <span>{{ tribunais[sel.tribunal].nome }}</span>
            </div>
            <h2 class="text-base font-semibold text-highlighted">{{ sel.orgao }}</h2>
            <p class="font-mono text-sm text-toned">{{ sel.numeroCnj }}</p>
          </div>

          <dl v-if="sel.tipo !== 'distribuicao'" class="grid grid-cols-1 gap-3 rounded-lg border border-default p-4 text-sm sm:grid-cols-3">
            <div>
              <dt class="text-xs text-muted">{{ sel.tipo === 'andamento' ? tc.caixa.painel.dataDoMovimento : sel.meio === 'djen' ? t.intimacoes.disponibilizada : t.intimacoes.enviada }}</dt>
              <dd class="tabular-nums text-highlighted">{{ dia(sel.dia, t.locale) }}</dd>
            </div>
            <div v-if="sel.meio === 'domicilio' || sel.meio === 'portal'">
              <dt class="text-xs text-muted">{{ t.intimacoes.cienciaEm }}</dt>
              <dd class="tabular-nums" :class="sel.ciencia ? 'text-highlighted' : 'text-dimmed'">{{ sel.ciencia ? dia(sel.ciencia, t.locale) : t.intimacoes.naoLida }}</dd>
            </div>
            <div :class="!(sel.meio === 'domicilio' || sel.meio === 'portal') && 'sm:col-span-2'">
              <dt class="text-xs text-muted">{{ t.intimacoes.processo }}</dt>
              <dd v-if="processo" class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span class="max-w-full truncate text-highlighted" :title="processo.titulo">{{ processo.reference }} · {{ processo.titulo }}</span>
                <UButton :label="t.intimacoes.abrirProcesso" icon="i-lucide-arrow-up-right" size="xs" color="neutral" variant="outline" class="shrink-0" @click="emit('abrirProcesso', processo.id)" />
              </dd>
              <dd v-else class="text-warning">{{ tc.caixa.semProcesso }}</dd>
            </div>
          </dl>

          <!-- Citação no Domicílio, ainda não confirmada -->
          <UAlert
            v-if="citacaoAberta(sel) && sel.status === 'revisar'"
            :title="tc.caixa.painel.citacao.titulo"
            :description="tc.caixa.painel.citacao.texto(dia(limiteDaCitacao(sel.dia, sel.tribunal), t.locale))"
            icon="i-lucide-alarm-clock"
            color="warning"
            variant="subtle"
            :actions="[{ label: tc.caixa.painel.citacao.confirmar, icon: 'i-lucide-mail-check', color: 'warning', variant: 'solid', size: 'xs', onClick: () => { modalCiencia = 'citacao' } }]"
          />
          <!-- Intimação no Domicílio, ainda não lida -->
          <UAlert
            v-else-if="sel.meio === 'domicilio' && !sel.ciencia && sel.status === 'revisar'"
            :title="t.intimacoes.teorFechado"
            :description="t.intimacoes.avisoDomicilio(dia(cienciaTacita(sel.dia), t.locale))"
            icon="i-lucide-mail-warning"
            color="warning"
            variant="subtle"
            :actions="[{ label: t.intimacoes.abrirTeor, icon: 'i-lucide-mail-open', color: 'warning', variant: 'solid', size: 'xs', onClick: () => { modalCiencia = 'domicilio' } }]"
          />
          <!-- Intimação no portal, ainda sem ciência -->
          <UAlert
            v-else-if="sel.meio === 'portal' && !sel.ciencia && sel.status === 'revisar'"
            :title="tc.caixa.painel.portal.titulo"
            :description="tc.caixa.painel.portal.texto(dia(cienciaTacita(sel.dia), t.locale))"
            icon="i-lucide-mail-warning"
            color="warning"
            variant="subtle"
            :actions="[{ label: tc.caixa.painel.portal.abrir, icon: 'i-lucide-mail-open', color: 'warning', variant: 'solid', size: 'xs', onClick: () => { modalCiencia = 'portal' } }]"
          />
          <!-- Teor -->
          <div v-else class="rounded-lg border border-default">
            <p class="border-b border-default px-4 py-2 text-xs font-medium text-muted">{{ sel.tipo === 'andamento' ? tc.caixa.painel.andamento.titulo : t.intimacoes.teor }}</p>
            <p class="px-4 py-3 text-sm leading-relaxed text-highlighted">{{ sel.teor }}</p>
          </div>

          <!-- Distribuição: os dados da ação nova -->
          <template v-if="(sel.tipo === 'distribuicao' || (ehCitacao && !processo)) && sel.distribuicao">
            <UAlert v-if="sel.tipo === 'distribuicao' && sel.status === 'revisar' && !processo" :title="tc.caixa.painel.distribuicao.titulo" :description="tc.caixa.painel.distribuicao.texto" icon="i-lucide-file-plus-2" color="info" variant="subtle" />
            <UAlert v-else-if="sel.tipo === 'distribuicao' && sel.status === 'revisar' && processo" :description="tt.distribuicao.jaCadastrado(processo.reference)" icon="i-lucide-link" color="info" variant="subtle" />
            <div class="rounded-lg border border-default">
              <p class="border-b border-default px-4 py-2 text-xs font-medium text-muted">{{ tc.caixa.painel.distribuicao.dados }}</p>
              <dl class="grid grid-cols-1 gap-3 px-4 py-3 text-sm sm:grid-cols-2">
                <div><dt class="text-xs text-muted">{{ tc.caixa.painel.distribuicao.classe }}</dt><dd class="text-highlighted">{{ sel.distribuicao.classe }}</dd></div>
                <div><dt class="text-xs text-muted">{{ tc.caixa.painel.distribuicao.assunto }}</dt><dd class="text-highlighted">{{ sel.distribuicao.assunto }}</dd></div>
                <div><dt class="text-xs text-muted">{{ tc.caixa.painel.distribuicao.autor }}</dt><dd class="text-highlighted">{{ sel.distribuicao.autor }}</dd></div>
                <div><dt class="text-xs text-muted">{{ tc.caixa.painel.distribuicao.reu }}</dt><dd class="text-highlighted">{{ sel.distribuicao.reu }}</dd></div>
                <div><dt class="text-xs text-muted">{{ tc.caixa.painel.distribuicao.valor }}</dt><dd class="tabular-nums text-highlighted">{{ dinheiro(sel.distribuicao.valor, t.locale) }}</dd></div>
                <div><dt class="text-xs text-muted">{{ tc.caixa.painel.distribuicao.distribuidaEm }}</dt><dd class="tabular-nums text-highlighted">{{ dia(sel.distribuicao.distribuidaEm, t.locale) }}</dd></div>
                <div class="sm:col-span-2"><dt class="text-xs text-muted">{{ tc.caixa.painel.distribuicao.orgao }}</dt><dd class="text-highlighted">{{ sel.orgao }} · {{ tribunais[sel.tribunal].sigla }}</dd></div>
              </dl>
            </div>
            <div v-if="sel.tipo === 'distribuicao' && sel.status === 'confirmada' && processo" class="flex flex-wrap items-center gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
              <UIcon name="i-lucide-circle-check" class="size-4 text-success" />
              <p class="min-w-0 flex-1 text-sm text-highlighted">{{ tc.caixa.painel.distribuicao.cadastradoComo(processo.reference) }}</p>
              <UButton :label="tc.caixa.painel.distribuicao.abrirProcesso" icon="i-lucide-arrow-up-right" size="sm" color="neutral" variant="outline" @click="emit('abrirProcesso', processo.id)" />
            </div>
          </template>

          <!-- Rodada 4: a petição inicial, obtida com a distribuição ou a citação -->
          <div v-if="sel.inicial && (sel.tipo === 'distribuicao' || ehCitacao)" class="rounded-lg border border-default">
            <p class="border-b border-default px-4 py-2 text-xs font-medium text-muted">{{ tt.inicial.titulo }}</p>
            <div class="flex items-center gap-3 px-4 py-3">
              <UIcon name="i-lucide-file-text" class="size-5 shrink-0 text-muted" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-highlighted">{{ tt.inicial.peticao }}</p>
                <p class="text-xs text-muted">{{ tt.inicial.detalhe(sel.inicial.paginas, sel.inicial.sistema, dataHora(sel.inicial.obtidaEm, t.locale)) }}</p>
              </div>
              <UTooltip :text="tt.inicial.abrir">
                <UButton icon="i-lucide-external-link" size="xs" color="neutral" variant="outline" :aria-label="tt.inicial.abrir" @click="maquete" />
              </UTooltip>
            </div>
            <p class="border-t border-default px-4 py-2 text-xs text-toned">{{ processo ? tt.inicial.noProcesso : tt.inicial.vaiPara }}</p>
          </div>

          <!-- Andamento -->
          <template v-if="sel.tipo === 'andamento'">
            <p v-if="sel.movimento" class="flex items-center gap-2">
              <span class="text-xs text-muted">{{ tt.andamento.movimento }}</span>
              <UBadge :label="tt.andamento.movimentos[sel.movimento]" color="neutral" variant="subtle" size="sm" />
            </p>
            <p v-if="sel.status === 'confirmada'" class="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-4 text-sm text-highlighted">
              <UIcon name="i-lucide-circle-check" class="size-4 shrink-0 text-success" />
              {{ sel.tratadaPor === 'automatico' ? tc.caixa.painel.tratadaAutomatico : tc.caixa.painel.tratadaPor(quemTratou(sel)) }}
            </p>
          </template>

          <!-- Sem processo: vincular ou cadastrar -->
          <div v-if="!processo && sel.tipo !== 'distribuicao' && sel.status === 'revisar'" class="flex flex-col gap-3 rounded-lg border border-warning/40 bg-warning/5 p-4">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-link-2-off" class="mt-0.5 size-5 shrink-0 text-warning" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-highlighted">{{ t.intimacoes.semProcessoBloco.titulo }}</p>
                <p class="text-sm text-muted">{{ ehCitacao && sel.distribuicao ? tt.resposta.semProcesso : t.intimacoes.semProcessoBloco.texto }}</p>
              </div>
            </div>
            <div class="flex flex-wrap items-end gap-2">
              <UFormField :label="tc.caixa.painel.vincular.rotulo" class="min-w-0 flex-1">
                <USelectMenu :items="itensProcesso" value-key="value" :placeholder="tc.caixa.painel.vincular.ph" class="w-full" @update:model-value="(v: number) => escolherProcesso(v)" />
              </UFormField>
              <UButton v-if="ehCitacao && sel.distribuicao" :label="tc.caixa.painel.distribuicao.cadastrar" icon="i-lucide-file-plus-2" size="md" :loading="cadastrando" @click="cadastrar" />
              <UButton v-else :label="t.intimacoes.semProcessoBloco.criar" icon="i-lucide-plus" size="md" color="neutral" variant="outline" @click="maquete" />
            </div>
          </div>

          <!-- Rodada 4: a audiência lida no teor. Vai para a Agenda sem cálculo: a data vem do juízo. -->
          <div v-if="sel.audiencia && sel.status === 'revisar'" class="flex flex-col gap-3 rounded-lg border border-info/40 bg-info/5 p-4">
            <div class="flex flex-wrap items-center gap-2">
              <UIcon name="i-lucide-calendar-clock" class="size-4 text-info" />
              <p class="text-sm font-semibold text-highlighted">{{ tt.audiencia.titulo }}</p>
              <UBadge :label="tt.audiencia.tipos[sel.audiencia.tipo]" color="info" variant="subtle" size="sm" />
            </div>
            <div class="grid gap-3 sm:grid-cols-3">
              <UFormField :label="tt.resposta.dia">
                <UInput v-model="diaDaAudiencia" type="date" class="w-full" />
              </UFormField>
              <UFormField :label="tt.resposta.hora">
                <UInput v-model="horaDaAudiencia" type="time" class="w-full" />
              </UFormField>
              <UFormField v-if="sel.audiencia.local" :label="tt.audiencia.local">
                <p class="py-1.5 text-sm text-highlighted">{{ sel.audiencia.local }}</p>
              </UFormField>
            </div>
            <p class="text-xs text-muted">{{ tt.resposta.lida }}</p>
            <UCheckbox v-model="levarAudiencia" :label="tt.audiencia.levar" :description="tt.audiencia.levarAjuda" />
          </div>

          <!-- 2 meios: as 2 datas e qual vale -->
          <div v-if="doisMeios && sel.status === 'revisar'" class="flex flex-col gap-3 rounded-lg border border-warning/40 p-4">
            <p class="flex items-center gap-2 text-sm font-semibold text-highlighted">
              <UIcon name="i-lucide-git-compare" class="size-4 text-warning" />{{ tc.caixa.painel.doisMeios.titulo }}
            </p>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="m in (['djen', 'portal'] as const)"
                :key="m"
                class="rounded-md border p-3"
                :class="(estado.duplicidade === 'oficial') === (m === 'djen') ? 'border-primary/40 bg-primary/5' : 'border-default'"
              >
                <p class="text-xs text-muted">{{ tc.caixa.painel.doisMeios[m] }}</p>
                <p class="text-sm tabular-nums text-highlighted">{{ dia(m === 'djen' ? sel.dia : sel.outroMeio!.ciencia, t.locale) }}</p>
                <p class="mt-1 text-sm font-semibold tabular-nums text-highlighted">{{ tc.caixa.painel.doisMeios.fatal(dia(doisMeios[m], t.locale)) }}</p>
                <UBadge v-if="(estado.duplicidade === 'oficial') === (m === 'djen')" :label="tc.caixa.painel.doisMeios.usado" color="primary" variant="subtle" size="sm" class="mt-2" />
              </div>
            </div>
            <p class="text-xs text-muted">{{ tc.caixa.painel.doisMeios.oficial }}</p>
            <UAlert v-if="doisMeios.maisCedo" :description="tc.caixa.painel.doisMeios.alerta(dia(sel.outroMeio!.ciencia, t.locale))" icon="i-lucide-scale" color="warning" variant="subtle" />
            <p class="text-xs text-toned">{{ estado.duplicidade === 'oficial' ? tc.caixa.painel.doisMeios.usaOficial : tc.caixa.painel.doisMeios.usaMaisCedo }}</p>
          </div>

          <!-- Prazo: para revisar -->
          <div v-if="pronta" class="flex flex-col gap-4 rounded-lg border border-default p-4">
            <p class="text-sm font-semibold text-highlighted">{{ ehCitacao ? tt.resposta.titulo : t.intimacoes.prazo.titulo }}</p>
            <div class="grid gap-3 sm:grid-cols-2">
              <UFormField
                v-if="ehCitacao"
                :label="tt.resposta.marco"
                :hint="marco === sel.marcoSugerido ? tt.resposta.sugerido : undefined"
                :help="tt.resposta.ajudas[marco]"
                class="sm:col-span-2"
              >
                <USelect v-model="marco" :items="itensDeMarco" class="w-full" />
              </UFormField>
              <template v-if="ehCitacao && precisaAudiencia && !sel.audiencia">
                <UFormField :label="tt.resposta.dia">
                  <UInput v-model="diaDaAudiencia" type="date" class="w-full" />
                </UFormField>
                <UFormField :label="tt.resposta.hora">
                  <UInput v-model="horaDaAudiencia" type="time" class="w-full" />
                </UFormField>
              </template>
              <UFormField v-if="!ehCitacao" :label="t.intimacoes.prazo.regra" :hint="sel.regraSugerida && regraEscolhida === sel.regraSugerida ? t.intimacoes.prazo.sugerida : undefined">
                <USelect v-model="regraEscolhida" :items="regrasDoRito" :placeholder="t.intimacoes.prazo.regraPh" class="w-full" />
              </UFormField>
              <UFormField :label="t.intimacoes.prazo.responsavel">
                <USelect v-model="responsavel" :items="itensResponsavel" class="w-full" />
              </UFormField>
            </div>
            <UAlert v-if="!regraEscolhida" :description="t.intimacoes.prazo.semSugestao" icon="i-lucide-circle-help" color="warning" variant="subtle" />
            <UAlert v-if="ehCitacao && precisaAudiencia && !diaDaAudiencia" :description="tt.resposta.semData" icon="i-lucide-calendar-x" color="warning" variant="subtle" />
            <UAlert v-if="ehCitacao && marco === 'conciliacao'" :description="tt.resposta.acordo" icon="i-lucide-handshake" color="neutral" variant="subtle" />
            <template v-if="calculo && regraEscolhida && processo">
              <div class="grid grid-cols-2 gap-3">
                <div class="rounded-md border border-error/30 bg-error/5 p-3">
                  <p class="text-xs text-muted">{{ calculo.hora ? tt.resposta.defesa : t.intimacoes.prazo.fatal }}</p>
                  <p class="text-xl font-semibold tabular-nums text-highlighted">{{ dia(calculo.fatal, t.locale) }}<template v-if="calculo.hora">, {{ calculo.hora }}</template></p>
                  <p class="text-xs text-muted">{{ t.geral.emDias(diferencaEmDias(HOJE, calculo.fatal)) }}</p>
                </div>
                <div class="rounded-md border border-primary/30 bg-primary/5 p-3">
                  <p class="text-xs text-muted">{{ t.intimacoes.prazo.interno }}</p>
                  <p class="text-xl font-semibold tabular-nums text-highlighted">{{ dia(calculo.interno, t.locale) }}</p>
                  <p class="text-xs text-muted">{{ t.intimacoes.prazo.tarefa }}</p>
                </div>
              </div>
              <div>
                <p class="mb-2 text-xs font-medium text-muted">{{ t.memoria.titulo }}</p>
                <MemoriaDoCalculo :t="t" :calculo="calculo" :regra="regraPorId.get(regraEscolhida)!" :tribunal="tribunais[processo.data.tribunal]" />
              </div>
            </template>
          </div>

          <!-- Prazo: confirmado -->
          <div v-else-if="sel.status === 'confirmada' && ehPrazo" class="flex flex-col gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
            <p class="flex items-center gap-2 text-sm text-highlighted">
              <UIcon name="i-lucide-circle-check" class="size-4 text-success" />
              {{ prazoConfirmado ? t.intimacoes.confirmadaPor(pessoaPorId.get(prazoConfirmado.confirmadoPor)?.nome ?? '', dataHora(prazoConfirmado.confirmadoEm, t.locale)) : t.intimacoes.filtros.confirmada }}
            </p>
            <MemoriaDoCalculo
              v-if="calculo && regraEscolhida && processo"
              :t="t"
              :calculo="calculo"
              :regra="regraPorId.get(regraEscolhida)!"
              :tribunal="tribunais[processo.data.tribunal]"
              compacto
            />
            <div class="flex flex-wrap justify-end gap-2">
              <UButton :label="t.intimacoes.voltarParaRevisao" icon="i-lucide-undo-2" size="sm" color="neutral" variant="ghost" @click="voltarParaRevisao(sel)" />
              <UButton :label="t.intimacoes.verPrazos" icon="i-lucide-alarm-clock" size="sm" color="neutral" variant="outline" @click="emit('irPrazos')" />
            </div>
          </div>

          <!-- Descartada -->
          <div v-if="sel.status === 'descartada'" class="flex flex-wrap items-center gap-3 rounded-lg border border-default bg-elevated/40 p-4">
            <UIcon name="i-lucide-archive" class="size-4 text-muted" />
            <p class="min-w-0 flex-1 text-sm text-toned">{{ t.intimacoes.descartadaPor(sel.motivoDoDescarte ?? '') }}</p>
            <UButton :label="t.intimacoes.voltarParaRevisao" icon="i-lucide-undo-2" size="sm" color="neutral" variant="outline" @click="voltarParaRevisao(sel)" />
          </div>

          <!-- Rodada 4: a audiência que foi para a Agenda -->
          <div v-if="audienciaRegistrada" class="flex flex-wrap items-center gap-3 rounded-lg border border-info/30 bg-info/5 p-4">
            <UIcon name="i-lucide-calendar-check" class="size-4 text-info" />
            <p class="min-w-0 flex-1 text-sm text-highlighted">{{ tt.audiencia.naAgenda(dia(audienciaRegistrada.dia, t.locale), audienciaRegistrada.hora) }}</p>
            <UButton :label="tt.audiencia.verAgenda" icon="i-lucide-calendar" size="sm" color="neutral" variant="outline" @click="emit('irAgenda')" />
          </div>

          <!-- Dados da captura: a prova de chegada -->
          <div class="rounded-lg border border-default">
            <p class="flex items-center gap-2 border-b border-default px-4 py-2 text-xs font-medium text-muted">
              <UIcon name="i-lucide-fingerprint" class="size-3.5" />{{ tc.caixa.painel.prova }}
            </p>
            <dl class="grid grid-cols-1 gap-3 px-4 py-3 text-sm sm:grid-cols-2">
              <div v-if="sel.recebidaEm">
                <dt class="text-xs text-muted">{{ tc.caixa.painel.recebidaEm }}</dt>
                <dd class="tabular-nums text-highlighted">{{ dataHora(sel.recebidaEm, t.locale) }}</dd>
              </div>
              <div v-if="fonteDaSel">
                <dt class="text-xs text-muted">{{ tc.caixa.painel.fonte }}</dt>
                <dd class="text-highlighted">{{ tc.fontes.curtos[fonteDaSel.id] }} <span class="text-xs text-muted">({{ tc.fontes.quem[fonteDaSel.quem] }})</span></dd>
              </div>
              <div>
                <dt class="text-xs text-muted">{{ tc.caixa.painel.termo }}</dt>
                <dd class="text-highlighted">{{ termoDa(sel)?.valor ?? tc.caixa.pelaCnj }}</dd>
              </div>
              <div v-if="sel.idNaFonte">
                <dt class="text-xs text-muted">{{ tc.caixa.painel.idNaFonte }}</dt>
                <dd class="font-mono text-xs text-highlighted">{{ sel.idNaFonte }}</dd>
              </div>
              <div v-if="sel.hash" class="sm:col-span-2">
                <dt class="text-xs text-muted">{{ tc.caixa.painel.hash }}</dt>
                <dd class="flex flex-wrap items-center gap-2">
                  <span class="font-mono text-xs text-highlighted">{{ sel.hash }}</span>
                  <UButton :label="tc.caixa.painel.certidao" icon="i-lucide-file-down" size="xs" color="neutral" variant="outline" @click="maquete" />
                </dd>
              </div>
            </dl>
            <p v-if="sel.tambemPor?.length" class="flex items-start gap-2 border-t border-default px-4 py-2.5 text-xs text-toned">
              <UIcon name="i-lucide-copy-check" class="mt-0.5 size-3.5 shrink-0" />
              {{ tc.caixa.painel.tambem(sel.tambemPor.map(f => tc.fontes.curtos[f]).join(', ')) }}
            </p>
            <p v-if="typeof sel.tratadaPor === 'number' && sel.tipo !== 'andamento'" class="border-t border-default px-4 py-2.5 text-xs text-muted">{{ tc.caixa.painel.tratadaPor(quemTratou(sel)) }}</p>
            <!-- Rodada 4: os eventos que a captura entregou ao Spaceflow -->
            <div v-if="disparosDaSel.length" class="border-t border-default px-4 py-2.5">
              <p class="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted">
                <UIcon name="i-lucide-workflow" class="size-3.5" />{{ tt.eventos.naCaptura }}
              </p>
              <ul class="flex flex-col gap-1">
                <li v-for="d in disparosDaSel" :key="d.id" class="flex flex-wrap items-baseline gap-x-2 text-xs">
                  <span class="tabular-nums text-muted">{{ diaHoraCurto(d.quando, t.locale) }}</span>
                  <span class="font-medium text-highlighted">{{ tt.eventos.nomes[d.evento] }}</span>
                  <span class="text-toned">{{ d.fluxos.length ? tt.eventos.disparou(nomesDosFluxos(d.fluxos)) : tt.eventos.nenhumFluxo }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </template>

      <template v-if="sel && sel.status === 'revisar'" #footer>
        <div class="flex w-full justify-end gap-2">
          <template v-if="sel.tipo === 'distribuicao' && processo">
            <UButton :label="tt.distribuicao.registrar" icon="i-lucide-check" @click="registrarDistribuicao" />
          </template>
          <template v-else-if="sel.tipo === 'distribuicao'">
            <UButton :label="tc.caixa.painel.distribuicao.naoEDaEmpresa" icon="i-lucide-user-x" color="neutral" variant="outline" @click="naoEDaEmpresa" />
            <UButton :label="tc.caixa.painel.distribuicao.cadastrar" icon="i-lucide-file-plus-2" :loading="cadastrando" @click="cadastrar" />
          </template>
          <template v-else-if="sel.tipo === 'andamento'">
            <UButton :label="tc.caixa.descarte.confirmar" icon="i-lucide-archive" color="neutral" variant="outline" @click="modalDescarte = 'uma'" />
            <UButton :label="tc.caixa.painel.andamento.registrar" icon="i-lucide-list-checks" :disabled="!processo" @click="registrarAndamento" />
          </template>
          <template v-else-if="pronta">
            <UButton :label="t.intimacoes.prazo.descartar" icon="i-lucide-archive" color="neutral" variant="outline" @click="modalDescarte = 'uma'" />
            <UButton :label="t.intimacoes.prazo.confirmar" icon="i-lucide-check" :loading="confirmando" :disabled="!calculo" @click="confirmarPrazo" />
          </template>
        </div>
      </template>
    </USlideover>

    <!-- Ciência: Domicílio, citação ou portal -->
    <UModal :open="!!modalCiencia" :title="textoDaCiencia.titulo" :description="textoDaCiencia.texto" @update:open="(v: boolean) => { if (!v) modalCiencia = undefined }">
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.geral.cancelar" color="neutral" variant="outline" @click="modalCiencia = undefined" />
          <UButton :label="textoDaCiencia.botao" icon="i-lucide-mail-check" color="warning" @click="registrar" />
        </div>
      </template>
    </UModal>

    <!-- Descartar -->
    <UModal :open="!!modalDescarte" :title="modalDescarte === 'lote' ? tc.caixa.descarte.tituloLote(selecionadas.length) : tc.caixa.descarte.titulo" @update:open="(v: boolean) => { if (!v) modalDescarte = undefined }">
      <template #body>
        <URadioGroup v-model="motivoDoDescarte" :legend="tc.caixa.descarte.motivo" :items="tc.caixa.descarte.opcoes" />
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.geral.cancelar" color="neutral" variant="outline" @click="modalDescarte = undefined" />
          <UButton :label="tc.caixa.descarte.confirmar" icon="i-lucide-archive" color="neutral" @click="confirmarDescarte" />
        </div>
      </template>
    </UModal>
  </div>
</template>

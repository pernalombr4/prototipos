<script setup lang="ts">
/**
 * O detalhe do envelope.
 *
 * Cópia da prévia: o topo com título, status, provedor, origem e "Atualizado há..."; Participantes, Documento e Trilha de
 * auditoria à esquerda; Detalhes à direita. PROPOSTA (B6 e os itens do documento de testes):
 * - no topo, até 2 ações visíveis, conforme o estado, e o resto em "Mais ações". Hoje são até 8 botões lado a lado, e
 *   "Original" aparece no topo e no card Documento;
 * - 1 faixa de estado no lugar de até 7 alertas empilhados: o que aconteceu, quem fez, o motivo e o efeito no fluxo
 *   (M35), com o atalho para a execução ou a tarefa;
 * - a origem é um link para o fluxo ou a tarefa que criou o envelope;
 * - M31: quem ainda não está na vez aparece "Na fila", sem Reenviar; M21: depois do cancelamento, quem não assinou
 *   aparece "Não assinou";
 * - M23: Reenviar e-mail confirma e lista quem recebe;
 * - M34: na Certisign avulsa, Cancelar fica desligado com a explicação, e "Abrir Certisign" leva ao portal;
 * - C52: na Certisign, "Links de assinatura" aparece também no envelope do fluxo da categoria;
 * - M20, C43 e C54: a trilha diz quem fez, pela pessoa, pelo provedor ou pelo ENSPACE, com o motivo; o eco do provedor
 *   vira "A <provedor> confirmou às..." na mesma linha, e não um 2º evento;
 * - M13: sem retorno há mais de 2 dias, a faixa avisa e oferece Atualizar status (ou o portal, se o provedor não consulta);
 * - M27: as datas levam a hora, também o "Expira em";
 * - M16: o rascunho criado antes de conectar um provedor diz isso na faixa e leva a conectar; o envio espera a conexão.
 */
import type { Envelope, Evento } from './mocks'
import { categoriasDoFluxo, fluxoPorId, pessoaPorId, provedorPorId } from './mocks'
import { aberto, assinados, credenciaisVisiveis, diasSemRetorno, envelopePorId, enviar, quemEstaNaVez, tem, todasAsCredenciais } from './estado'
import { dataHora, hora, minutosDesde } from './formato'
import { corDoParticipante, corDoStatus } from './cores'
import type { Textos } from './textos'
import Logo from './_Logo.vue'
import CancelarEnvelope from './_CancelarEnvelope.vue'
import ReenviarEmail from './_ReenviarEmail.vue'
import LinksDeAssinatura from './_LinksDeAssinatura.vue'

const props = defineProps<{ t: Textos, id: number, abrirMenu?: boolean }>()
const emit = defineEmits<{ voltar: [], irExecucao: [], irTarefa: [], conectar: [] }>()
const toast = useToast()

const e = computed(() => envelopePorId(props.id)!)
// O rascunho criado antes de conectar não tem provedor; ele tem os próprios textos, e `p` só é lido quando há provedor.
const semProvedor = computed(() => !e.value.provider)
const p = computed(() => provedorPorId.get(e.value.provider ?? 'clicksign')!)
const v = computed(() => props.t.envelope)
const loc = computed(() => props.t.locale)
const dh = (iso: string) => dataHora(iso, loc.value)

/* ---------- origem ---------- */
const origem = computed(() => {
  const o = e.value.origem
  if (o.tipo === 'workflow') return { texto: v.value.origemFluxo(fluxoPorId.get(o.fluxo)!.nome), extra: v.value.execucao(o.execucao), icone: 'i-lucide-workflow', ir: () => emit('irExecucao') }
  if (o.tipo === 'c-flow') return { texto: v.value.origemCategoria(categoriasDoFluxo.find(c => c.id === o.categoria)!.nome), extra: v.value.tarefa(o.tarefa), icone: 'i-lucide-layout-grid', ir: () => emit('irTarefa') }
  return { texto: props.t.origens.standalone, extra: '', icone: 'i-lucide-file-signature', ir: null }
})

/* ---------- ações: até 2 visíveis, o resto em Mais ações ---------- */
const modal = ref<'cancelar' | 'reenviar' | 'links' | null>(null)
const mAberto = (m: 'cancelar' | 'reenviar' | 'links') => computed({ get: () => modal.value === m, set: (x: boolean) => { if (!x) modal.value = null } })
const cancelarAberto = mAberto('cancelar')
const reenviarAberto = mAberto('reenviar')
const linksAberto = mAberto('links')

const atualizando = ref(false)
const espera = ref(0)
let relogio: ReturnType<typeof setInterval> | undefined
async function atualizar() {
  atualizando.value = true
  await new Promise(r => setTimeout(r, 800))
  atualizando.value = false
  toast.add({ title: v.value.atualizadoToast(p.value.nome), icon: 'i-lucide-refresh-cw', color: 'neutral' })
  espera.value = 30
  clearInterval(relogio)
  relogio = setInterval(() => { espera.value--; if (espera.value <= 0) clearInterval(relogio) }, 1000)
}
onBeforeUnmount(() => clearInterval(relogio))

const enviando = ref(false)
async function enviarAgora() {
  enviando.value = true
  await new Promise(r => setTimeout(r, 800))
  enviando.value = false
  enviar(e.value.id)
  toast.add({ title: props.t.novo.enviado, icon: 'i-lucide-send', color: 'success' })
}
const baixar = (rotulo: string) => toast.add({ title: rotulo, description: e.value.documento.nome, icon: 'i-lucide-download', color: 'neutral' })
const abrirPortal = () => toast.add({ title: v.value.acoes.abrirPortal(p.value.nome), description: p.value.portal, icon: 'i-lucide-external-link', color: 'neutral' })

interface Acao { label: string, icon: string, onClick: () => void, color?: 'primary' | 'neutral' | 'error', variant?: 'solid' | 'outline', loading?: boolean, disabled?: boolean, description?: string }
const acoes = computed(() => {
  const a = v.value.acoes
  const env = e.value
  const visiveis: Acao[] = []
  const mais: Acao[] = []
  const editar = () => toast.add({ title: props.t.geral.foraDoEscopo, icon: 'i-lucide-construction', color: 'neutral' })
  if (env.status === 'draft' && semProvedor.value) {
    // M16: sem provedor no rascunho. Sem nenhum conectado, a ação é conectar; com 1 conectado, é escolher a credencial no rascunho.
    if (credenciaisVisiveis.value.length) visiveis.push({ label: a.editar, icon: 'i-lucide-pencil', onClick: editar })
    else {
      visiveis.push({ label: a.editar, icon: 'i-lucide-pencil', onClick: editar, color: 'neutral', variant: 'outline' })
      visiveis.push({ label: a.conectar, icon: 'i-lucide-plug', onClick: () => emit('conectar') })
    }
  }
  else if (env.status === 'draft') {
    visiveis.push({ label: a.editar, icon: 'i-lucide-pencil', onClick: editar, color: 'neutral', variant: 'outline' })
    visiveis.push({ label: a.enviar, icon: 'i-lucide-send', onClick: enviarAgora, loading: enviando.value })
  }
  else if (env.status === 'error') {
    visiveis.push({ label: a.enviarDeNovo, icon: 'i-lucide-send', onClick: enviarAgora, loading: enviando.value })
  }
  else if (env.status === 'completed') {
    visiveis.push({ label: a.baixarAssinado, icon: 'i-lucide-file-check', onClick: () => baixar(a.baixarAssinado) })
  }
  else if (aberto(env)) {
    if (tem(env, 'consultaStatus')) visiveis.push({ label: espera.value > 0 ? a.atualizarEm(espera.value) : a.atualizar, icon: 'i-lucide-refresh-cw', onClick: atualizar, color: 'neutral', variant: 'outline', loading: atualizando.value, disabled: espera.value > 0 })
    if (tem(env, 'reenvio')) visiveis.push({ label: a.reenviar, icon: 'i-lucide-mail', onClick: () => (modal.value = 'reenviar'), color: 'neutral', variant: 'outline', disabled: !quemEstaNaVez(env).length })
    if (tem(env, 'links')) (visiveis.length < 2 ? visiveis : mais).push({ label: a.links, icon: 'i-lucide-link', onClick: () => (modal.value = 'links'), color: 'neutral', variant: 'outline' })
    if (!tem(env, 'consultaStatus') && visiveis.length < 2) visiveis.push({ label: a.abrirPortal(p.value.nome), icon: 'i-lucide-external-link', onClick: abrirPortal, color: 'neutral', variant: 'outline' })
  }
  if (env.status !== 'completed' && env.status !== 'draft') mais.push({ label: a.baixarOriginal, icon: 'i-lucide-download', onClick: () => baixar(a.baixarOriginal) })
  if (env.status === 'completed') mais.push({ label: a.baixarOriginal, icon: 'i-lucide-download', onClick: () => baixar(a.baixarOriginal) })
  if (env.provider_envelope_id && !visiveis.some(x => x.label === a.abrirPortal(p.value.nome))) mais.push({ label: a.abrirPortal(p.value.nome), icon: 'i-lucide-external-link', onClick: abrirPortal })
  if (aberto(env)) {
    const semCancelar = !tem(env, 'cancela') && env.origem.tipo === 'standalone'
    mais.push({ label: a.cancelar, icon: 'i-lucide-ban', onClick: () => (modal.value = 'cancelar'), color: 'error', disabled: semCancelar, description: semCancelar ? a.semCancelar(p.value.nome) : undefined })
  }
  return { visiveis: visiveis.slice(0, 2), mais }
})
const itensMais = computed(() => [acoes.value.mais.map(x => ({ label: x.label, icon: x.icon, color: x.color === 'error' ? 'error' as const : undefined, disabled: x.disabled, description: x.description, onSelect: x.onClick }))])
const menuAberto = ref(!!props.abrirMenu)

/* ---------- a faixa de estado ---------- */
const nomeDoAutor = (ev?: Evento) => {
  if (!ev) return ''
  if (ev.autor.tipo === 'pessoa') return pessoaPorId.get(ev.autor.id)?.nome ?? ''
  if (ev.autor.tipo === 'provedor') return p.value.nome
  return 'ENSPACE'
}
const ultimo = (tipo: Evento['tipo']) => [...e.value.eventos].reverse().find(x => x.tipo === tipo)

const faixa = computed(() => {
  const f = v.value.faixa
  const env = e.value
  const o = env.origem
  const efeitoNoFluxo = o.tipo === 'workflow' ? f.fluxoEmErro(fluxoPorId.get(o.fluxo)!.etapa, fluxoPorId.get(o.fluxo)!.nome) : o.tipo === 'c-flow' ? f.tarefaEmErro(o.tarefa) : ''
  const atalho = o.tipo === 'workflow' ? { label: f.verExecucao, onClick: () => emit('irExecucao') } : o.tipo === 'c-flow' ? { label: f.verTarefa, onClick: () => emit('irTarefa') } : null
  switch (env.status) {
    case 'draft':
      if (semProvedor.value) {
        const ha = credenciaisVisiveis.value.length > 0
        return { cor: 'warning' as const, icone: 'i-lucide-plug-zap', titulo: f.draftSemProvedor, linhas: ha ? [f.draftEscolher] : [], atalho: null }
      }
      return { cor: 'neutral' as const, icone: 'i-lucide-file-pen', titulo: f.draft(p.value.nome), linhas: [] as string[], atalho: null }
    case 'completed': return { cor: 'success' as const, icone: 'i-lucide-circle-check', titulo: f.completed(dh(env.completed_at!)), linhas: [], atalho: null }
    case 'canceled': {
      const ev = ultimo('canceled')
      const linhas = [ev?.motivo ? f.motivo(ev.motivo) : '', ev?.motivo && efeitoNoFluxo ? efeitoNoFluxo : '', !tem(env, 'cancela') ? f.soNoEnspace(p.value.nome) : ''].filter(Boolean)
      return { cor: 'neutral' as const, icone: 'i-lucide-ban', titulo: f.canceled(nomeDoAutor(ev), dh(env.canceled_at!)), linhas, atalho: efeitoNoFluxo ? atalho : null }
    }
    case 'rejected': {
      const ev = ultimo('rejected')
      const pa = env.participantes.find(x => x.id === ev?.participante) ?? env.participantes.find(x => x.status === 'rejected')
      return { cor: 'error' as const, icone: 'i-lucide-circle-x', titulo: f.rejected(pa?.nome ?? '', dh(ev?.em ?? env.created_at)), linhas: [pa?.motivo ? f.motivo(pa.motivo) : '', efeitoNoFluxo].filter(Boolean), atalho }
    }
    case 'expired': return { cor: 'warning' as const, icone: 'i-lucide-calendar-x', titulo: f.expired(dh(env.expires_at!)), linhas: [efeitoNoFluxo].filter(Boolean), atalho }
    case 'error': return { cor: 'error' as const, icone: 'i-lucide-octagon-alert', titulo: f.errorTitulo, linhas: [env.erro === 'tamanho' ? f.erros.tamanho(p.value.nome, p.value.limiteMb, env.documento.tamanhoMb) : f.erros.nomeInvalido(p.value.nome), f.errorAcao], atalho }
    default: {
      const parado = diasSemRetorno(env)
      if (parado) return { cor: 'warning' as const, icone: 'i-lucide-clock-alert', titulo: tem(env, 'consultaStatus') ? f.parado(p.value.nome, dh(env.ultimoRetorno!)) : f.paradoSemConsulta(p.value.nome, dh(env.ultimoRetorno!)), linhas: [], atalho: null }
      const vez = quemEstaNaVez(env).map(x => x.nome).join(', ')
      return { cor: 'info' as const, icone: 'i-lucide-hourglass', titulo: f.pending(assinados(env), env.participantes.length), linhas: vez ? [f.aguardando(vez)] : [], atalho: null }
    }
  }
})

/* ---------- participantes por ordem ---------- */
const ordens = computed(() => [...new Set(e.value.participantes.map(x => x.ordem))].sort((a, b) => a - b))
const detalheDo = (pa: Envelope['participantes'][number]) => {
  if (pa.status === 'signed' && pa.em) return v.value.assinouEm(dh(pa.em))
  if (pa.status === 'opened' && pa.em) return v.value.visualizouEm(dh(pa.em))
  if (pa.status === 'queued') return v.value.naFilaAjuda(pa.ordem - 1)
  if (pa.ultimoReenvio) return v.value.ultimoReenvio(props.t.geral.ha(minutosDesde(pa.ultimoReenvio)))
  return ''
}
const iniciais = (nome: string) => nome.split(' ').map(x => x[0]).slice(0, 2).join('')
const copiado = ref<number | null>(null)
function copiarLink(id: number) {
  copiado.value = id
  setTimeout(() => (copiado.value = null), 1500)
  toast.add({ title: props.t.geral.copiado, icon: 'i-lucide-link', color: 'neutral' })
}

/* ---------- documento ---------- */
const abaDoc = ref('original')
const docAberto = ref(false)
const abasDoc = computed(() => [
  { value: 'original', label: v.value.abaOriginal },
  { value: 'assinado', label: v.value.abaAssinado, disabled: !e.value.assinado },
])

/* ---------- trilha ---------- */
const filtro = ref('todos')
const filtros = computed(() => [
  { value: 'todos', label: v.value.filtros.todos },
  { value: 'participantes', label: v.value.filtros.participantes },
  { value: 'erros', label: v.value.filtros.erros },
])
const iconeDoEvento: Record<Evento['tipo'], { icone: string, cor: string }> = {
  created: { icone: 'i-lucide-file-plus-2', cor: 'text-muted' }, configuring: { icone: 'i-lucide-settings-2', cor: 'text-info' },
  sent: { icone: 'i-lucide-send', cor: 'text-info' }, opened: { icone: 'i-lucide-eye', cor: 'text-info' }, signed: { icone: 'i-lucide-pen-line', cor: 'text-success' },
  rejected: { icone: 'i-lucide-circle-x', cor: 'text-error' }, completed: { icone: 'i-lucide-circle-check', cor: 'text-success' }, canceled: { icone: 'i-lucide-ban', cor: 'text-toned' },
  expired: { icone: 'i-lucide-calendar-x', cor: 'text-warning' }, error: { icone: 'i-lucide-octagon-alert', cor: 'text-error' }, resent: { icone: 'i-lucide-mail', cor: 'text-info' },
}
function tituloDoEvento(ev: Evento) {
  const ee = v.value.eventos
  const pa = e.value.participantes.find(x => x.id === ev.participante)?.nome ?? ''
  switch (ev.tipo) {
    case 'sent': return pa ? ee.sentPara(pa) : ee.sent(p.value.nome)
    case 'opened': return ee.opened(pa)
    case 'signed': return ee.signed(pa)
    case 'rejected': return ee.rejected(pa)
    case 'resent': return ee.resent(pa)
    default: return ee[ev.tipo] as string
  }
}
function autorDoEvento(ev: Evento) {
  if (ev.autor.tipo === 'pessoa') return v.value.porPessoa(pessoaPorId.get(ev.autor.id)?.nome ?? '')
  if (ev.autor.tipo === 'provedor') return v.value.pelaProvedora(p.value.nome)
  return v.value.peloEnspace
}
const eventos = computed(() => [...e.value.eventos].reverse().filter(ev =>
  filtro.value === 'todos' || (filtro.value === 'erros' ? ev.tipo === 'error' : ['opened', 'signed', 'rejected', 'resent'].includes(ev.tipo) || (ev.tipo === 'sent' && !!ev.participante))))

/* ---------- detalhes ---------- */
const datas = computed(() => (['created_at', 'sent_at', 'completed_at', 'canceled_at', 'expires_at'] as const).filter(k => e.value[k]).map(k => ({ k, valor: dh(e.value[k]!) })))
const nomeDaCredencial = computed(() => (e.value.credential ? todasAsCredenciais.value.find(c => c.id === e.value.credential)?.nome ?? String(e.value.credential) : v.value.nenhumaCredencial))
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto max-w-7xl space-y-5 px-6 py-5">
      <!-- Topo (cópia), com as ações reorganizadas -->
      <div class="flex items-center justify-between">
        <UButton :label="v.voltar" icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" @click="emit('voltar')" />
        <UButton :label="v.comoFunciona" icon="i-lucide-circle-help" color="neutral" variant="ghost" size="sm" />
      </div>

      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0 space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl font-semibold text-highlighted">{{ e.title }}</h1>
            <UBadge :label="t.status[e.status]" :color="corDoStatus[e.status]" variant="soft" />
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <Logo v-if="e.provider" :app="e.provider" :nome="p.nome" tamanho="md" />
            <span v-else class="flex items-center gap-1.5"><UIcon name="i-lucide-plug-zap" class="size-4" />{{ v.semProvedor }}</span>
            <component
              :is="origem.ir ? 'button' : 'span'"
              :type="origem.ir ? 'button' : undefined"
              class="flex items-center gap-1.5"
              :class="origem.ir && 'rounded text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-primary'"
              @click="origem.ir?.()"
            >
              <UIcon :name="origem.icone" class="size-4" />{{ origem.texto }}<template v-if="origem.extra"> · {{ origem.extra }}</template>
            </component>
            <span>{{ v.atualizado(t.geral.ha(minutosDesde(e.ultimoRetorno ?? e.eventos.at(-1)!.em))) }}</span>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-for="a in acoes.visiveis"
            :key="a.label"
            :label="a.label"
            :icon="a.icon"
            :color="a.color ?? 'primary'"
            :variant="a.variant ?? 'solid'"
            :loading="a.loading"
            :disabled="a.disabled"
            @click="a.onClick"
          />
          <UDropdownMenu v-if="acoes.mais.length" v-model:open="menuAberto" :items="itensMais" :content="{ align: 'end' }" :ui="{ content: 'w-72', itemDescription: 'whitespace-normal' }">
            <UButton :label="t.geral.maisAcoes" trailing-icon="i-lucide-chevron-down" color="neutral" variant="outline" />
          </UDropdownMenu>
        </div>
      </div>

      <!-- 1 faixa de estado -->
      <UAlert :key="e.status" :color="faixa.cor" :icon="faixa.icone" variant="subtle" :title="faixa.titulo" class="animate-[entrada_.3s_ease-out_both]">
        <template v-if="faixa.linhas.length" #description>
          <p v-for="(linha, i) in faixa.linhas" :key="i">{{ linha }}</p>
        </template>
        <template v-if="faixa.atalho" #actions>
          <UButton :label="faixa.atalho.label" color="neutral" variant="outline" size="xs" trailing-icon="i-lucide-arrow-right" @click="faixa.atalho.onClick" />
        </template>
      </UAlert>

      <div class="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div class="space-y-5">
          <!-- Participantes -->
          <section class="rounded-lg border border-default bg-default" aria-labelledby="titulo-participantes">
            <h2 id="titulo-participantes" class="border-b border-default px-4 py-3 font-semibold text-highlighted">{{ v.participantes }}</h2>
            <div v-for="o in ordens" :key="o">
              <p v-if="ordens.length > 1" class="bg-elevated/50 px-4 py-1.5 text-xs font-medium text-muted">{{ v.ordem(o) }}</p>
              <ul class="divide-y divide-default">
                <li v-for="pa in e.participantes.filter(x => x.ordem === o)" :key="pa.id" class="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors" :class="pa.status === 'queued' && 'opacity-75'">
                  <UAvatar :text="iniciais(pa.nome)" size="sm" />
                  <div class="min-w-48 flex-1">
                    <p class="flex flex-wrap items-center gap-2 text-sm font-medium text-highlighted">
                      {{ pa.nome }}
                      <span class="text-xs font-normal text-muted">{{ t.papeis[pa.papel] }}</span>
                    </p>
                    <p class="truncate text-xs text-muted">{{ pa.email }}</p>
                  </div>
                  <div class="flex flex-col items-end gap-0.5 text-right">
                    <UBadge :label="t.statusParticipante[pa.status]" :color="corDoParticipante[pa.status]" :variant="pa.status === 'queued' ? 'outline' : 'soft'" size="sm" :icon="pa.status === 'queued' ? 'i-lucide-list-ordered' : undefined" />
                    <span v-if="detalheDo(pa)" class="text-xs text-muted">{{ detalheDo(pa) }}</span>
                  </div>
                  <UTooltip v-if="tem(e, 'links') && aberto(e) && ['sent', 'opened'].includes(pa.status)" :text="v.copiarLink">
                    <UButton :icon="copiado === pa.id ? 'i-lucide-check' : 'i-lucide-link'" color="neutral" variant="ghost" size="xs" :aria-label="v.copiarLink" @click="copiarLink(pa.id)" />
                  </UTooltip>
                </li>
              </ul>
            </div>
          </section>

          <!-- Documento -->
          <section class="rounded-lg border border-default bg-default" aria-labelledby="titulo-documento">
            <header class="flex flex-wrap items-center justify-between gap-2 border-b border-default px-4 py-2">
              <h2 id="titulo-documento" class="font-semibold text-highlighted">{{ v.documento }}</h2>
              <UTabs v-model="abaDoc" :items="abasDoc" :content="false" size="xs" variant="link" color="neutral" />
            </header>
            <div class="flex flex-wrap items-center gap-3 px-4 py-3">
              <UIcon name="i-lucide-file-text" class="size-5 text-muted" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm text-highlighted">{{ abaDoc === 'assinado' && e.assinado ? e.assinado.nome : e.documento.nome }}</span>
                <span class="text-xs tabular-nums text-muted">{{ abaDoc === 'assinado' && e.assinado ? e.assinado.tamanhoMb : e.documento.tamanhoMb }} MB</span>
              </span>
              <UButton :label="docAberto ? v.ocultar : v.mostrar" :icon="docAberto ? 'i-lucide-eye-off' : 'i-lucide-eye'" color="neutral" variant="outline" size="xs" @click="docAberto = !docAberto" />
              <UButton :label="v.abrir" icon="i-lucide-external-link" color="neutral" variant="ghost" size="xs" />
            </div>
            <Transition enter-active-class="transition-[opacity,transform] duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
              <div v-if="docAberto" class="mx-4 mb-4 flex h-64 items-center justify-center rounded-md border border-dashed border-default bg-elevated/40 text-sm text-muted">
                {{ v.paginas(3) }}
              </div>
            </Transition>
          </section>

          <!-- Trilha de auditoria -->
          <section class="rounded-lg border border-default bg-default" aria-labelledby="titulo-trilha">
            <header class="flex flex-wrap items-center justify-between gap-2 border-b border-default px-4 py-2">
              <h2 id="titulo-trilha" class="font-semibold text-highlighted">{{ v.trilha }}</h2>
              <UTabs v-model="filtro" :items="filtros" :content="false" size="xs" variant="pill" color="neutral" />
            </header>
            <TransitionGroup tag="ol" class="relative space-y-0 px-4 py-3" enter-active-class="transition-[opacity,transform] duration-200" enter-from-class="opacity-0 -translate-y-1">
              <li v-for="(ev, i) in eventos" :key="`${ev.tipo}-${ev.em}-${ev.participante ?? 0}`" class="relative flex gap-3 pb-4 last:pb-0">
                <span v-if="i < eventos.length - 1" class="absolute left-3.5 top-7 h-[calc(100%-1.25rem)] w-px bg-(--ui-border)" aria-hidden="true" />
                <span class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-elevated">
                  <UIcon :name="iconeDoEvento[ev.tipo].icone" class="size-3.5" :class="iconeDoEvento[ev.tipo].cor" />
                </span>
                <div class="min-w-0 flex-1 pt-0.5">
                  <p class="text-sm text-highlighted">
                    <span class="font-medium">{{ tituloDoEvento(ev) }}</span>
                    <span class="ml-1 text-muted">{{ autorDoEvento(ev) }}</span>
                  </p>
                  <p class="text-xs tabular-nums text-muted">{{ dh(ev.em) }}</p>
                  <p v-if="ev.motivo" class="mt-1 text-sm text-toned">{{ v.faixa.motivo(ev.motivo) }}</p>
                  <p v-if="ev.etapa" class="mt-1 text-sm text-toned">{{ v.etapa(v.etapas[ev.etapa]!) }}<template v-if="ev.tipo === 'error' && e.erro === 'tamanho'"> · {{ v.faixa.erros.tamanho(p.nome, p.limiteMb, e.documento.tamanhoMb) }}</template></p>
                  <p v-if="ev.confirmadoPeloProvedor" class="mt-1 flex items-center gap-1 text-xs text-success">
                    <UIcon name="i-lucide-check-check" class="size-3.5" />{{ v.confirmado(p.nome, hora(ev.confirmadoPeloProvedor, loc)) }}
                  </p>
                </div>
              </li>
            </TransitionGroup>
          </section>
        </div>

        <!-- Detalhes -->
        <section class="rounded-lg border border-default bg-default lg:sticky lg:top-0" aria-labelledby="titulo-detalhes">
          <h2 id="titulo-detalhes" class="border-b border-default px-4 py-3 font-semibold text-highlighted">{{ v.detalhes }}</h2>
          <dl class="space-y-3 px-4 py-3 text-sm">
            <div><dt class="text-xs text-muted">{{ v.referencia }}</dt><dd class="font-mono text-xs text-toned">{{ e.reference }}</dd></div>
            <div v-if="e.provider_envelope_id"><dt class="text-xs text-muted">{{ v.idNoProvedor(p.nome) }}</dt><dd class="font-mono text-xs text-toned">{{ e.provider_envelope_id }}</dd></div>
            <div><dt class="text-xs text-muted">{{ v.credencial }}</dt><dd class="text-toned">{{ nomeDaCredencial }}</dd></div>
            <div><dt class="text-xs text-muted">{{ v.solicitante }}</dt><dd class="text-toned">{{ pessoaPorId.get(e.solicitante)?.nome }}</dd></div>
            <div v-for="d in datas" :key="d.k"><dt class="text-xs text-muted">{{ v.datas[d.k] }}</dt><dd class="tabular-nums text-toned">{{ d.valor }}</dd></div>
          </dl>
        </section>
      </div>
    </div>

    <!-- Os modais só existem com provedor: o rascunho sem provedor não cancela, não reenvia e não gera link. -->
    <template v-if="e.provider">
      <CancelarEnvelope v-model:open="cancelarAberto" :t="t" :envelope="e" />
      <ReenviarEmail v-model:open="reenviarAberto" :t="t" :envelope="e" />
      <LinksDeAssinatura v-model:open="linksAberto" :t="t" :envelope="e" />
    </template>
  </div>
</template>

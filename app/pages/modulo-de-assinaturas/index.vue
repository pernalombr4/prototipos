<script setup lang="ts">
/**
 * Módulo de assinaturas do ENSPACE: a base de UX do módulo e as correções do documento de testes de 18/11/2026.
 *
 * Primeiro a base (pedido da redatora): os provedores na loja de apps, a página do provedor sem informação repetida, a
 * lista e o detalhe do envelope reorganizados. Depois, em cima dela, os itens do documento de testes que mudam o front:
 * M35, C48, C10, M32, M25, C55, M31, M34, C52, C54, C43, M20, M21, M13, M14, M16, M19 e M23.
 *
 * Tudo em memória. Recarregar volta ao começo.
 */
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import type { ProvedorId } from './mocks'
import { ENVELOPE, envelopesIniciais, provedorPorId, tarefaIntegracao, workspace } from './mocks'
import type { Desfecho, Situacao } from './estado'
import { cancelar, envelopePorId, estado, reiniciarEstado } from './estado'
import { textos } from './textos'
import type { Destino } from './_CascaDoEnspace.vue'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import Apps from './_Apps.vue'
import Provedor from './_Provedor.vue'
import Envelopes from './_Envelopes.vue'
import Envelope from './_Envelope.vue'
import NovoEnvelope from './_NovoEnvelope.vue'
import Execucao from './_Execucao.vue'
import TarefaIntegracao from './_TarefaIntegracao.vue'
import Sistema from './_Sistema.vue'

definePageMeta({
  titulo: 'Módulo de assinaturas',
  descricao: 'O módulo de assinaturas reorganizado: os provedores na loja de apps, a página do provedor sem informação repetida, a lista e o detalhe do envelope com 1 faixa de estado e a trilha que diz quem fez. Em cima disso, as correções do teste de 18/11/2026: cancelamento e recusa levando o Spaceflow e a tarefa a erro, o desfecho no nó, a fila de assinatura, o limite do provedor e os estados iniciais.',
  status: 'em-revisao',
  atualizado: '2026-11-18',
  tela: 'Integrações › Apps; Módulos › Assinaturas; Spaceflow › Execução e editor do nó; Tarefa Integração; Sistema › Módulos',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * Navegação                                                           *
 * ------------------------------------------------------------------ */
type Tela =
  | { tipo: 'apps' | 'envelopes' | 'tarefa' }
  | { tipo: 'sistema', aviso?: boolean }
  | { tipo: 'provedor', id: ProvedorId }
  | { tipo: 'envelope', id: number, menu?: boolean }
  | { tipo: 'execucao', aba: 'editor' | 'execucoes' }
const tela = ref<Tela>({ tipo: 'apps' })
const anterior = ref<Tela>({ tipo: 'envelopes' })
const n = ref(0) // força a remontagem quando o atalho abre a mesma tela

function ir(d: Destino) {
  if (d === 'assinaturaEletronica') {
    toast.add({ title: 'Na proposta, este item sai do menu', description: 'Os provedores ficam em Integrações > Apps, na seção Assinatura eletrônica.', icon: 'i-lucide-info', color: 'neutral' })
    tela.value = { tipo: 'apps' }
    return
  }
  if (d === 'assinaturas') tela.value = { tipo: 'envelopes' }
  else if (d === 'spaceflows') tela.value = { tipo: 'execucao', aba: 'execucoes' }
  else if (d === 'tarefas') tela.value = { tipo: 'tarefa' }
  else tela.value = { tipo: d }
}
function abrirEnvelope(id: number, menu = false) {
  if (tela.value.tipo !== 'envelope') anterior.value = tela.value
  tela.value = { tipo: 'envelope', id, menu }
  n.value++
}

const ativo = computed<Destino>(() => {
  const x = tela.value.tipo
  if (x === 'apps' || x === 'provedor') return 'apps'
  if (x === 'execucao') return 'spaceflows'
  if (x === 'tarefa') return 'tarefas'
  if (x === 'sistema') return 'sistema'
  return 'assinaturas'
})

const trilha = computed(() => {
  const tr = t.value.trilha
  const x = tela.value
  if (x.tipo === 'apps') return [workspace.nome, tr.configuracoes, tr.integracoes, tr.apps]
  if (x.tipo === 'provedor') return [workspace.nome, tr.configuracoes, tr.integracoes, tr.apps, provedorPorId.get(x.id)!.nome]
  if (x.tipo === 'sistema') return [workspace.nome, tr.configuracoes, tr.sistema]
  if (x.tipo === 'execucao') return [workspace.nome, tr.spaceflows, x.aba === 'editor' ? t.value.fluxo.abas.editor : tr.execucoes]
  if (x.tipo === 'tarefa') return [workspace.nome, tr.tarefas, `#${tarefaIntegracao.id}`]
  if (x.tipo === 'envelope') return [workspace.nome, tr.modulos, tr.assinaturas, envelopePorId(x.id)?.title ?? '']
  return [workspace.nome, tr.modulos, tr.assinaturas]
})

/* ------------------------------------------------------------------ *
 * ANDAIME: situação, desfechos e atalhos. Não é proposta.             *
 * ------------------------------------------------------------------ */
const menuDeHoje = ref(false)
const novoAberto = ref(false)
const exemploNovo = ref<{ credencial: number, arquivo: { nome: string, tamanhoMb: number } } | null>(null)

const situacoes: { value: Situacao, label: string }[] = [
  { value: 'normal', label: 'Dia normal' },
  { value: 'semProvedor', label: 'Nenhum provedor conectado' },
  { value: 'semEnvelope', label: 'Provedor conectado, sem envelope' },
]
const desfechos: { value: Desfecho, label: string }[] = [
  { value: 'aguardando', label: 'Aguardando assinatura' },
  { value: 'assinado', label: 'Assinado' },
  { value: 'recusado', label: 'Recusado' },
  { value: 'cancelado', label: 'Cancelado no módulo' },
  { value: 'expirado', label: 'Expirado' },
  { value: 'erroProvedor', label: 'Erro do provedor' },
  { value: 'erroConfig', label: 'Erro de configuração' },
]
type EstadoTarefa = 'andamento' | 'cancelado' | 'falhaEnvio'
const estadosDaTarefa: { value: EstadoTarefa, label: string }[] = [
  { value: 'andamento', label: 'Em andamento' },
  { value: 'cancelado', label: 'Envelope cancelado no módulo' },
  { value: 'falhaEnvio', label: 'Falha no envio' },
]
const copia = <T>(x: T): T => JSON.parse(JSON.stringify(x))
const estadoDaTarefa = computed<EstadoTarefa>({
  get: () => {
    const s = envelopePorId(tarefaIntegracao.envelope)?.status
    return s === 'canceled' || s === 'rejected' ? 'cancelado' : s === 'error' ? 'falhaEnvio' : 'andamento'
  },
  set: (v) => {
    const e = envelopePorId(tarefaIntegracao.envelope)!
    Object.assign(e, copia(envelopesIniciais.find(x => x.id === tarefaIntegracao.envelope)!))
    e.canceled_at = undefined
    e.erro = undefined
    if (v === 'cancelado') cancelar(e.id, 'Locatário desistiu do galpão 7.')
    if (v === 'falhaEnvio') {
      e.status = 'error'
      e.erro = 'nomeInvalido'
      e.participantes[0]!.nome = 'Sérgio Amaral 2'
      e.eventos.push({ tipo: 'error', em: '2026-11-18T13:02:06-03:00', autor: { tipo: 'provedor' }, etapa: 'cadastroDoSignatario' })
    }
  },
})

function situacao(v: Situacao) {
  estado.situacao = v
  if (v !== 'normal') tela.value = { tipo: 'envelopes' }
}

const atalhos = computed(() => [
  [
    { type: 'label' as const, label: 'A base do módulo' },
    { label: 'Integrações > Apps', icon: 'i-lucide-layout-grid', onSelect: () => { tela.value = { tipo: 'apps' } } },
    { label: 'Página da Certisign', icon: 'i-lucide-plug', onSelect: () => { tela.value = { tipo: 'provedor', id: 'certisign' } } },
    { label: 'Página da D4Sign (falta o cofre)', icon: 'i-lucide-plug', onSelect: () => { tela.value = { tipo: 'provedor', id: 'd4sign' } } },
    { label: 'Lista de envelopes', icon: 'i-lucide-list', onSelect: () => { estado.situacao = 'normal'; tela.value = { tipo: 'envelopes' } } },
    { label: 'Envelope concluído', icon: 'i-lucide-file-check', onSelect: () => abrirEnvelope(ENVELOPE.adobeConcluido) },
  ],
  [
    { type: 'label' as const, label: 'Itens do documento de testes' },
    { label: 'M35 · Cancelado no módulo, vindo do Spaceflow', icon: 'i-lucide-ban', onSelect: () => abrirEnvelope(ENVELOPE.certisignFluxoCancelado) },
    { label: 'M35 · Cancelar envelope do fluxo da categoria', icon: 'i-lucide-ban', onSelect: () => abrirEnvelope(ENVELOPE.d4signCategoria) },
    { label: 'M35 e M32 · Execução com o nó em erro', icon: 'i-lucide-workflow', onSelect: () => { estado.desfecho = 'cancelado'; tela.value = { tipo: 'execucao', aba: 'execucoes' } } },
    { label: 'C55 · Erro de configuração e editor do nó', icon: 'i-lucide-settings-2', onSelect: () => { estado.desfecho = 'erroConfig'; tela.value = { tipo: 'execucao', aba: 'execucoes' } } },
    { label: 'C10 e C48 · Tarefa Integração em erro', icon: 'i-lucide-file-text', onSelect: () => { estadoDaTarefa.value = 'cancelado'; tela.value = { tipo: 'tarefa' } } },
    { label: 'M31 e M23 · Participante na fila e Reenviar', icon: 'i-lucide-list-ordered', onSelect: () => abrirEnvelope(ENVELOPE.adobeEmOrdem) },
    { label: 'M34 e M13 · Certisign avulso, sem retorno', icon: 'i-lucide-clock-alert', onSelect: () => abrirEnvelope(ENVELOPE.certisignAvulsoParado, true) },
    { label: 'C52 · Certisign do fluxo da categoria', icon: 'i-lucide-link', onSelect: () => abrirEnvelope(ENVELOPE.certisignCategoria) },
    { label: 'C43 e M21 · Cancelado com a confirmação do provedor', icon: 'i-lucide-check-check', onSelect: () => abrirEnvelope(ENVELOPE.d4signCancelado) },
    { label: 'Falha no envio (motivo nomeado)', icon: 'i-lucide-octagon-alert', onSelect: () => abrirEnvelope(ENVELOPE.d4signErro) },
    { label: 'M14 · Novo envelope com arquivo acima do limite', icon: 'i-lucide-file-x', onSelect: () => { exemploNovo.value = { credencial: 65, arquivo: { nome: 'aditivo-prazo-vila-verde.pdf', tamanhoMb: 14.2 } }; tela.value = { tipo: 'envelopes' }; novoAberto.value = true } },
    { label: 'M16 · Nenhum provedor conectado', icon: 'i-lucide-plug-zap', onSelect: () => situacao('semProvedor') },
    { label: 'M16 · 1ª credencial liga o módulo', icon: 'i-lucide-power', onSelect: () => { estado.situacao = 'semProvedor'; estado.moduloLigado = false; estado.webhookConfirmado.clicksign = null; tela.value = { tipo: 'provedor', id: 'clicksign' } } },
    { label: 'M16 · Desligar o módulo com envelopes abertos', icon: 'i-lucide-power-off', onSelect: () => { estado.moduloLigado = true; tela.value = { tipo: 'sistema', aviso: true }; n.value++ } },
  ],
])

/* ---------- a barra de andaime não cobre a tela ---------- */
const andaime = ref<HTMLElement | null>(null)
let observador: ResizeObserver | undefined
onMounted(() => {
  const medir = () => document.documentElement.style.setProperty('--altura-do-andaime', `${andaime.value?.offsetHeight ?? 0}px`)
  medir()
  observador = new ResizeObserver(medir)
  if (andaime.value) observador.observe(andaime.value)
})
onBeforeUnmount(() => {
  observador?.disconnect()
  document.documentElement.style.removeProperty('--altura-do-andaime')
})

// Desligar o módulo tira a tela dele do caminho.
watch(() => estado.moduloLigado, (ligado) => {
  if (!ligado && (tela.value.tipo === 'envelopes' || tela.value.tipo === 'envelope')) tela.value = { tipo: 'sistema' }
})

function reiniciar() {
  reiniciarEstado()
  menuDeHoje.value = false
  tela.value = { tipo: 'apps' }
}
const abrirNovo = () => { exemploNovo.value = null; novoAberto.value = true }
const chave = computed(() => {
  const x = tela.value
  return `${x.tipo}-${'id' in x ? x.id : ''}-${'aba' in x ? x.aba : ''}-${n.value}`
})
</script>

<template>
  <div>
    <CascaDoEnspace :t="t" :ativo="ativo" :trilha="trilha" :modulo-ligado="estado.moduloLigado" :menu-de-hoje="menuDeHoje" @ir="ir">
      <div class="flex min-h-0 flex-1 flex-col pb-(--altura-do-andaime)">
        <Transition mode="out-in" enter-active-class="transition-[opacity,transform] duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
          <Apps v-if="tela.tipo === 'apps'" :key="chave" :t="t" @abrir="(id) => tela = { tipo: 'provedor', id }" />
          <Provedor v-else-if="tela.tipo === 'provedor'" :key="chave" :t="t" :provedor="tela.id" @voltar="tela = { tipo: 'apps' }" />
          <Envelopes v-else-if="tela.tipo === 'envelopes'" :key="chave" :t="t" @abrir="(id) => abrirEnvelope(id)" @novo="abrirNovo" @conectar="tela = { tipo: 'apps' }" />
          <Envelope
            v-else-if="tela.tipo === 'envelope'"
            :id="tela.id"
            :key="chave"
            :t="t"
            :abrir-menu="tela.menu"
            @voltar="tela = anterior.tipo === 'envelope' ? { tipo: 'envelopes' } : anterior"
            @ir-execucao="() => { const e = envelopePorId((tela as { id: number }).id); estado.desfecho = e?.id === ENVELOPE.d4signErro ? 'erroProvedor' : e?.id === ENVELOPE.adobeEmOrdem ? 'aguardando' : 'cancelado'; tela = { tipo: 'execucao', aba: 'execucoes' } }"
            @ir-tarefa="tela = { tipo: 'tarefa' }"
          />
          <Execucao v-else-if="tela.tipo === 'execucao'" :key="chave" v-model:aba="tela.aba" :t="t" @abrir-envelope="(id) => abrirEnvelope(id)" />
          <TarefaIntegracao v-else-if="tela.tipo === 'tarefa'" :key="chave" :t="t" @abrir-envelope="(id) => abrirEnvelope(id)" @enviar-de-novo="estadoDaTarefa = 'andamento'" />
          <Sistema v-else-if="tela.tipo === 'sistema'" :key="chave" :t="t" :aviso-aberto="tela.aviso" />
        </Transition>
      </div>
    </CascaDoEnspace>

    <NovoEnvelope v-model:open="novoAberto" :t="t" :exemplo="exemploNovo" @criado="(id) => abrirEnvelope(id)" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div ref="andaime" class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Protótipo</span>
        <UDropdownMenu :items="atalhos" :content="{ align: 'start', side: 'top' }" :ui="{ content: 'max-h-[70vh] w-96' }">
          <UButton label="Ir para" icon="i-lucide-map" trailing-icon="i-lucide-chevron-up" size="xs" color="primary" variant="solid" />
        </UDropdownMenu>
        <USeparator orientation="vertical" class="mx-1 h-5" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Workspace</span>
        <USelect :model-value="estado.situacao" :items="situacoes" value-key="value" size="xs" class="w-60" aria-label="Situação do workspace" @update:model-value="(v) => situacao(v as Situacao)" />
        <template v-if="tela.tipo === 'execucao'">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Desfecho do nó</span>
          <USelect v-model="estado.desfecho" :items="desfechos" value-key="value" size="xs" class="w-52" aria-label="Desfecho do nó" />
        </template>
        <template v-if="tela.tipo === 'tarefa'">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Tarefa</span>
          <USelect v-model="estadoDaTarefa" :items="estadosDaTarefa" value-key="value" size="xs" class="w-60" aria-label="Estado da tarefa" />
        </template>
        <USwitch v-model="menuDeHoje" label="Menu de hoje" size="xs" />
        <UButton label="Reiniciar" icon="i-lucide-rotate-ccw" size="xs" color="neutral" variant="ghost" @click="reiniciar" />
        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/modulo-de-assinaturas"
          />
        </span>
      </div>
    </div>
  </div>
</template>

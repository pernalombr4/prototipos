<script setup lang="ts">
/**
 * Agenda: Membro › Agenda redesenhada em 2 frentes, numa tela só.
 *
 *   1. UI/UX: barra do topo convencional, grade calma (hachura no não útil, linha da hora, faixa de dia inteiro,
 *      24 h), cor por fonte, lateral com camadas, popover junto do evento e configuração legível;
 *   2. funções novas: arrastar e redimensionar, criar no horário vazio, reunião ligada a item (com sugestão pelo
 *      e-mail), aba Agenda no painel do item, painel Para agendar e tempo reservado para tarefa com SLA.
 *
 * Uma porta: o painel do item e a configuração abrem por cima da própria Agenda.
 */
import type { Lugar } from '~/components/ux/geometriaDoCalendario'
import type { DropdownMenuItem } from '@nuxt/ui'
import { textos } from './textos'
import { AGORA, HOJE, diaCurto, diaDaSemana, hora } from './datas'
import { type Cenario, type TipoDeCriacao, aplicar, diaDe, escolherCenario, estado, eventos, foto, item, minutoDe, paraAgendar, reiniciar, restaurar, reuniao } from './estado'
import { HORARIO, feriados } from './mocks'
import CascaDaAgenda from './_CascaDaAgenda.vue'
import BarraDaAgenda from './_BarraDaAgenda.vue'
import LateralDaAgenda from './_LateralDaAgenda.vue'
import ParaAgendar from './_ParaAgendar.vue'
import ListaDaAgenda from './_ListaDaAgenda.vue'
import DetalheDoEvento from './_DetalheDoEvento.vue'
import CriacaoRapida from './_CriacaoRapida.vue'
import PainelDoItem from './_PainelDoItem.vue'
import ConfiguracaoDaAgenda from './_ConfiguracaoDaAgenda.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Agenda',
  descricao: 'A Agenda como lugar de ação: grade convencional e calma, camadas por fonte, reunião do Outlook ligada a item, arrastar para agendar, painel Para agendar e tempo reservado para tarefa com SLA.',
  status: 'em-revisao',
  atualizado: '2026-10-28',
  tela: 'Membro › Agenda',
})

type Referencia = { getBoundingClientRect: () => DOMRect }

const t = useTextos(textos)
const locale = useIdioma()
const toast = useToast()

const naoUtil = (d: string) => diaDaSemana(d) === 0 || diaDaSemana(d) === 6 || feriados.includes(d)
const rotuloDoDia = (d: string) => feriados.includes(d) ? t.value.grade.feriado : null
const rotulos = computed(() => ({ diaInteiro: t.value.grade.diaInteiro, mais: t.value.grade.mais, novo: t.value.grade.novo, intervalo: t.value.grade.intervalo }))
const pendentes = computed(() => paraAgendar.value.atrasadas.length + paraAgendar.value.semData.length + paraAgendar.value.semTempo.length)
const vazio = computed(() => !eventos.value.length && estado.cenario !== 'carregando' && estado.vista !== 'lista')

/* ---------- popovers: detalhe e criação, ancorados no evento ou no horário ---------- */
const referencia = shallowRef<Referencia>()
const detalhe = ref<string | null>(null)
const rascunho = ref<Lugar | null>(null)
const pelo = (seletor: string): Referencia => ({ getBoundingClientRect: () => document.querySelector(seletor)?.getBoundingClientRect() ?? new DOMRect() })

// A âncora é virtual, então o reka não sabe para onde devolver o foco: volta ao botão que abriu (WCAG 2.4.3).
let origem: HTMLElement | null = null
watch(() => !!detalhe.value || !!rascunho.value, (aberto) => {
  if (aberto) origem ??= document.activeElement as HTMLElement | null
  else nextTick(() => { origem?.focus(); origem = null })
})

function abrir(chave: string, ref: Referencia) {
  rascunho.value = null
  referencia.value = ref
  detalhe.value = chave
}
function criarEm(lugar: Lugar, ref: Referencia) {
  detalhe.value = null
  referencia.value = ref
  rascunho.value = lugar
}
function novo(el: HTMLElement) {
  const inicio = Math.ceil(AGORA / 60) * 60
  criarEm({ dia: estado.vista === 'dia' ? estado.data : HOJE, inicio, fim: inicio + 60 }, { getBoundingClientRect: () => el.getBoundingClientRect() })
}

/* ---------- um gesto, um aviso com Desfazer ---------- */
const quando = (dia: string, inicio?: number) => t.value.quando(diaCurto(dia, locale.value), inicio === undefined ? undefined : hora(inicio))

function mover(chave: string, l: Lugar) {
  const antes = foto()
  const e = aplicar(chave, l)
  if (!e) return
  const a = t.value.avisos
  const desfazer = [{ label: a.desfazer, color: 'neutral' as const, variant: 'outline' as const, onClick: () => restaurar(antes) }]
  if (e.tipo === 'sla') return toast.add({ title: a.sla, description: a.slaTexto, color: 'warning', icon: 'i-lucide-lock' })
  if (e.tipo === 'reuniao') return toast.add({ title: a.reuniao(quando(e.dia, e.inicio)), description: a.reuniaoTexto, icon: 'i-lucide-calendar-clock', actions: desfazer })
  if (e.tipo === 'bloco') return toast.add({ title: a.bloco(quando(e.dia, e.inicio)), icon: 'i-lucide-timer', actions: desfazer })
  if (e.tipo === 'reservado') return toast.add({ title: a.reservado, description: t.value.detalhe.prazoNaoMuda(quando(diaDe(e.prazo), minutoDe(e.prazo))), icon: 'i-lucide-timer', color: 'success', actions: desfazer })
  if (e.tipo === 'prazo') return toast.add({ title: a.prazo(quando(diaDe(e.prazo), minutoDe(e.prazo))), icon: 'i-lucide-calendar-check', actions: desfazer })
  toast.add({ title: a.item(e.campo, e.referencia, quando(e.dia, e.inicio)), icon: 'i-lucide-calendar-check', actions: desfazer })
}

function criado(_chave: string, tipo: TipoDeCriacao) {
  rascunho.value = null
  estado.agendandoPara = null
  toast.add({ title: t.value.avisos.criado[tipo], icon: 'i-lucide-circle-check', color: 'success' })
}

/* ---------- Outlook ---------- */
const conectando = ref(false)
function conectar() {
  const voltou = estado.outlook === 'falha'
  conectando.value = true
  setTimeout(() => {
    estado.outlook = 'conectado'
    conectando.value = false
    toast.add({ title: voltou ? t.value.avisos.voltou : t.value.avisos.conectado, description: voltou ? undefined : t.value.avisos.conectadoTexto, icon: 'i-lucide-calendar-check', color: 'success' })
  }, 1200)
}

/* ---------- painel do item e configuração ---------- */
const painel = reactive({ aberto: false, itemId: null as number | null, aba: 'agenda' as 'item' | 'tarefas' | 'agenda' })
const configAberta = ref(false)
const paraAgendarAberto = ref(true)

function abrirItem(id: number, aba: typeof painel.aba) {
  detalhe.value = null
  Object.assign(painel, { aberto: true, itemId: id, aba })
}
function agendar(id: number) {
  painel.aberto = false
  estado.agendandoPara = id
  if (estado.vista === 'lista' || estado.vista === 'mes') estado.vista = 'semana'
}
function irAoEvento(chave: string) {
  painel.aberto = false
  const r = reuniao(chave.slice(2))
  if (!r) return
  Object.assign(estado, { data: r.dia, vista: estado.vista === 'lista' ? 'semana' : estado.vista })
  setTimeout(() => abrir(chave, pelo(`[data-evento="${chave}"]`)), 350)
}
const agendandoRef = computed(() => item(estado.agendandoPara)?.reference)

/* ---------- andaime ---------- */
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

function fecharTudo() {
  detalhe.value = null
  rascunho.value = null
  painel.aberto = false
  configAberta.value = false
}
function cenario(c: Cenario) {
  fecharTudo()
  escolherCenario(c)
}
function noGrid(chave: string) {
  fecharTudo()
  Object.assign(estado, { vista: 'semana', data: HOJE })
  // Depois de o menu fechar e devolver o foco ao "Ir para"; antes disso, o popover nasce e já se fecha.
  setTimeout(() => abrir(chave, pelo(`[data-evento="${chave}"]`)), 300)
}
const cenarios: Cenario[] = ['normal', 'primeiro', 'falha', 'vazia', 'carregando']
const atalhos = computed<DropdownMenuItem[]>(() => [
  { label: t.value.andaime.atalhos.sugestao, icon: 'i-lucide-sparkles', onSelect: () => noGrid('r:r-vertice') },
  { label: t.value.andaime.atalhos.sla, icon: 'i-lucide-flag', onSelect: () => noGrid('t:273512') },
  { label: t.value.andaime.atalhos.item, icon: 'i-lucide-panel-right', onSelect: () => abrirItem(47233, 'agenda') },
  { label: t.value.andaime.atalhos.configuracao, icon: 'i-lucide-settings-2', onSelect: () => (configAberta.value = true) },
  { label: t.value.andaime.atalhos.mes, icon: 'i-lucide-calendar', onSelect: () => (estado.vista = 'mes') },
])
</script>

<template>
  <div>
    <CascaDaAgenda :t="t">
      <div class="flex h-full min-h-0 flex-col pb-(--altura-do-andaime)">
        <UAlert
          v-if="estado.outlook === 'falha'"
          color="warning"
          variant="subtle"
          icon="i-lucide-cloud-off"
          :title="t.avisos.falhaTitulo"
          :description="t.avisos.falhaTexto"
          :actions="[{ label: t.avisos.tentar, color: 'warning', variant: 'outline', size: 'xs', loading: conectando, onClick: conectar }]"
          orientation="horizontal"
          class="rounded-none"
        />
        <UAlert
          v-if="agendandoRef"
          color="info"
          variant="subtle"
          icon="i-lucide-calendar-plus"
          :title="t.avisos.agendando(agendandoRef)"
          :actions="[{ label: t.avisos.cancelar, color: 'neutral', variant: 'outline', size: 'xs', onClick: () => (estado.agendandoPara = null) }]"
          orientation="horizontal"
          class="rounded-none"
        />

        <BarraDaAgenda :t="t" :locale="locale" :pendentes="pendentes" :painel="paraAgendarAberto" @novo="novo" @configurar="configAberta = true" @painel="paraAgendarAberto = !paraAgendarAberto" />

        <div class="flex min-h-0 flex-1">
          <LateralDaAgenda :t="t" :locale="locale" :conectando="conectando" class="hidden lg:flex" @configurar="configAberta = true" @conectar="conectar" />

          <div class="relative flex min-h-0 min-w-0 flex-1 flex-col">
            <ListaDaAgenda v-if="estado.vista === 'lista'" :t="t" :locale="locale" :eventos="eventos" :selecionado="detalhe" @abrir="abrir" />
            <UxCalendario
              v-else
              :eventos="eventos"
              :vista="estado.vista"
              :data="estado.data"
              :hoje="HOJE"
              :agora="AGORA"
              :locale="locale"
              :horario="HORARIO"
              :nao-util="naoUtil"
              :rotulo-do-dia="rotuloDoDia"
              :rotulos="rotulos"
              :rascunho="rascunho"
              :selecionado="detalhe"
              :carregando="estado.cenario === 'carregando'"
              @abrir="abrir"
              @criar="criarEm"
              @mover="m => mover(m.id, m)"
              @soltar="mover"
              @ir-para-dia="d => Object.assign(estado, { vista: 'dia', data: d })"
            />
            <div v-if="vazio" class="pointer-events-none absolute inset-0 top-24 flex items-start justify-center">
              <UEmpty
                icon="i-lucide-calendar-check"
                :title="t.avisos.vazioTitulo"
                :description="t.avisos.vazioTexto"
                :actions="[{ label: t.barra.novo, icon: 'i-lucide-plus', size: 'sm', onClick: (e: MouseEvent) => novo(e.currentTarget as HTMLElement) }]"
                class="pointer-events-auto mt-16 animate-[entrada_.3s_ease-out_both] bg-default shadow-sm"
              />
            </div>
          </div>

          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-x-4 opacity-0" leave-active-class="transition duration-150 ease-in" leave-to-class="translate-x-4 opacity-0">
            <ParaAgendar v-if="paraAgendarAberto" :t="t" :locale="locale" class="hidden lg:flex" @abrir="(chave, el) => abrir(chave, { getBoundingClientRect: () => el.getBoundingClientRect() })" @fechar="paraAgendarAberto = false" />
          </Transition>
        </div>
      </div>
    </CascaDaAgenda>

    <UPopover :open="!!detalhe" :reference="referencia" :content="{ side: 'right', align: 'start', sideOffset: 8 }" @update:open="v => !v && (detalhe = null)">
      <template #content>
        <DetalheDoEvento v-if="detalhe" :key="detalhe" :t="t" :locale="locale" :chave="detalhe" @fechar="detalhe = null" @mover="mover" @abrir-item="abrirItem" />
      </template>
    </UPopover>
    <UPopover :open="!!rascunho" :reference="referencia" :content="{ side: 'right', align: 'start', sideOffset: 8 }" @update:open="v => !v && (rascunho = null)">
      <template #content>
        <CriacaoRapida v-if="rascunho" :t="t" :locale="locale" :lugar="rascunho" @criado="criado" @cancelar="rascunho = null" />
      </template>
    </UPopover>

    <PainelDoItem v-model:open="painel.aberto" v-model:aba="painel.aba" :t="t" :locale="locale" :item-id="painel.itemId" @agendar="agendar" @abrir-evento="irAoEvento" />
    <ConfiguracaoDaAgenda v-model:open="configAberta" :t="t" :conectando="conectando" @salvo="toast.add({ title: t.avisos.salvo, icon: 'i-lucide-circle-check', color: 'success' })" @conectar="conectar" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div ref="andaime" class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.prototipo }}</span>
        <UDropdownMenu :items="atalhos" :content="{ side: 'top', align: 'start', onCloseAutoFocus: (e: Event) => e.preventDefault() }" :ui="{ content: 'w-64' }">
          <UButton :label="t.andaime.irPara" icon="i-lucide-map" trailing-icon="i-lucide-chevron-up" size="xs" color="neutral" variant="subtle" />
        </UDropdownMenu>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.cenario }}</span>
        <UButton
          v-for="c in cenarios"
          :key="c"
          :label="t.andaime.cenarios[c]"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado.cenario === c ? 'primary' : 'neutral'"
          :variant="estado.cenario === c ? 'solid' : 'subtle'"
          @click="cenario(c)"
        />
        <UButton :label="t.andaime.reiniciar" icon="i-lucide-rotate-ccw" size="xs" color="neutral" variant="ghost" @click="fecharTudo(); reiniciar()" />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/agenda"
          />
        </span>
      </div>
    </div>
  </div>
</template>

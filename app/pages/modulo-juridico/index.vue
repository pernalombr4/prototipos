<script setup lang="ts">
/**
 * Módulo Jurídico do ENSPACE: o que é módulo e o que é caso de uso.
 *
 * A demanda: prototipar um módulo jurídico a partir da pesquisa de mercado Brasil e EUA, separando módulo de caso de
 * uso. Área que não ganha nada como módulo não vira funcionalidade: fica como configuração salva e replicada.
 *
 * A triagem (BRIEFING.md) deixou 3 funcionalidades no módulo, todas do contencioso:
 * - Intimações: a captura do DJEN e do Domicílio, revisada por uma pessoa antes de virar prazo;
 * - Prazos: o motor que calcula o prazo fatal e o interno pela regra do rito e pelo calendário do tribunal, com a
 *   memória do cálculo e o recálculo quando o calendário muda;
 * - Provisão: o risco e o valor fechados por data-base, com motivo para cada mudança.
 * O resto (contratos, consultivo, procurações, societário, pagamentos, marcas, denúncias) é caso de uso.
 *
 * Tudo em memória. Recarregar volta ao começo.
 */
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import { categorias, processoPorId, workspace } from './mocks'
import { estado, reiniciarEstado } from './estado'
import { textos } from './textos'
import type { Destino } from './_CascaDoJuridico.vue'
import CascaDoJuridico from './_CascaDoJuridico.vue'
import Intimacoes from './_Intimacoes.vue'
import Prazos from './_Prazos.vue'
import Provisao from './_Provisao.vue'
import Agenda from './_Agenda.vue'
import Sistema from './_Sistema.vue'
import type { Aba as AbaDoModulo } from './_ConfiguracaoDoModulo.vue'
import ConfiguracaoDoModulo from './_ConfiguracaoDoModulo.vue'
import ListaDeProcessos from './_ListaDeProcessos.vue'
import TelaDoProcesso from './_TelaDoProcesso.vue'
import Triagem from './_Triagem.vue'

definePageMeta({
  titulo: 'Módulo Jurídico',
  descricao: 'O que é módulo e o que é caso de uso no jurídico: intimações do DJEN e do Domicílio, prazos calculados em lista, calendário e na Agenda, provisão por data-base e os casos de uso que ficam como configuração.',
  status: 'em-revisao',
  atualizado: '2026-10-26',
  tela: 'Jurídico › Intimações, Prazos e Provisão; Agenda; Sistema › Módulos',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME: versão e cenário. Não é proposta.                          *
 * ------------------------------------------------------------------ */
type Cenario = 'normal' | 'vazio' | 'erroCaptura' | 'carregando'
const cenario = ref<Cenario>('normal')
const cenarios: { value: Cenario, label: string }[] = [
  { value: 'normal', label: 'Dia normal' },
  { value: 'vazio', label: 'Nada para revisar' },
  { value: 'erroCaptura', label: 'Captura do Domicílio parada' },
  { value: 'carregando', label: 'Carregando' },
]
const triagemAberta = ref(false)

/* ------------------------------------------------------------------ *
 * Navegação                                                           *
 * ------------------------------------------------------------------ */
type Tela =
  | { tipo: 'intimacoes' | 'prazos' | 'provisao' | 'sistema' | 'processos' | 'agenda' }
  | { tipo: 'modulo', aba?: AbaDoModulo }
  | { tipo: 'processo', id: number }
const tela = ref<Tela>({ tipo: 'intimacoes' })

function ir(d: Destino) {
  if (d === 'categoria:processos') return (tela.value = { tipo: 'processos' })
  if (d.startsWith('categoria:')) return toast.add({ title: t.value.geral.foraDoEscopo, description: t.value.geral.foraDoEscopoDesc, icon: 'i-lucide-construction', color: 'neutral' })
  tela.value = { tipo: d as 'intimacoes' | 'prazos' | 'provisao' | 'sistema' | 'agenda' }
}
const abrirProcesso = (id: number) => { tela.value = { tipo: 'processo', id } }

// Desligar o módulo tira as telas dele do caminho.
watch(() => estado.moduloLigado, (ligado) => {
  if (!ligado && ['intimacoes', 'prazos', 'provisao', 'modulo'].includes(tela.value.tipo)) tela.value = { tipo: 'sistema' }
})

const ativo = computed<Destino | 'modulo'>(() => {
  const x = tela.value.tipo
  if (x === 'processo' || x === 'processos') return 'categoria:processos'
  return x
})

const trilha = computed(() => {
  const tr = t.value.trilha
  const x = tela.value
  const casca = t.value.casca.itens
  if (x.tipo === 'sistema') return [workspace.nome, tr.configuracoes, tr.sistema]
  if (x.tipo === 'agenda') return [workspace.nome, casca.agenda!]
  if (x.tipo === 'modulo') return [workspace.nome, tr.configuracoes, tr.sistema, tr.modulo]
  if (x.tipo === 'processos') return [workspace.nome, tr.categorias, categorias[0]!.nome]
  if (x.tipo === 'processo') return [workspace.nome, tr.categorias, categorias[0]!.nome, processoPorId.get(x.id)?.reference ?? '']
  return [workspace.nome, tr.juridico, casca[x.tipo]!]
})

const pendentes = computed(() => (cenario.value === 'vazio' ? 0 : estado.intimacoes.filter(i => i.status === 'revisar').length))

/* ---------- versão: sem e com o módulo ---------- */
function versao(ligado: boolean) {
  estado.moduloLigado = ligado
  tela.value = ligado ? { tipo: 'intimacoes' } : { tipo: 'processo', id: 4100 }
}

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

function reiniciar() {
  reiniciarEstado()
  cenario.value = 'normal'
  tela.value = { tipo: 'intimacoes' }
}

const atalhos = [
  { rotulo: 'Processo com prazo digitado', acao: () => abrirProcesso(4100) },
  { rotulo: 'Prazos na Agenda', acao: () => { tela.value = { tipo: 'agenda' } } },
  { rotulo: 'Calendário do TJMG', acao: () => { if (estado.moduloLigado) tela.value = { tipo: 'modulo', aba: 'calendario' } } },
]
</script>

<template>
  <div>
    <CascaDoJuridico
      :t="t"
      :ativo="ativo"
      :trilha="trilha"
      :modulo-ligado="estado.moduloLigado"
      :pendentes="pendentes"
      @ir="ir"
    >
      <div class="flex min-h-0 flex-1 flex-col pb-(--altura-do-andaime)">
        <Transition mode="out-in" enter-active-class="transition-[opacity,transform] duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
          <Intimacoes
            v-if="tela.tipo === 'intimacoes'"
            key="intimacoes"
            :t="t"
            :cenario="cenario"
            @abrir-processo="abrirProcesso"
            @ir-prazos="tela = { tipo: 'prazos' }"
            @ir-captura="tela = { tipo: 'modulo', aba: 'captura' }"
          />
          <Prazos
            v-else-if="tela.tipo === 'prazos'"
            key="prazos"
            :t="t"
            :carregando="cenario === 'carregando'"
            :vazio="cenario === 'vazio'"
            @abrir-processo="abrirProcesso"
          />
          <Provisao
            v-else-if="tela.tipo === 'provisao'"
            key="provisao"
            :t="t"
            :carregando="cenario === 'carregando'"
            @abrir-processo="abrirProcesso"
          />
          <Agenda
            v-else-if="tela.tipo === 'agenda'"
            key="agenda"
            :t="t"
            :modulo-ligado="estado.moduloLigado"
            @abrir-processo="abrirProcesso"
          />
          <Sistema
            v-else-if="tela.tipo === 'sistema'"
            key="sistema"
            v-model:modulo-ligado="estado.moduloLigado"
            :t="t"
            @configurar="tela = { tipo: 'modulo' }"
          />
          <ConfiguracaoDoModulo
            v-else-if="tela.tipo === 'modulo'"
            :key="`modulo-${tela.aba}`"
            :t="t"
            :aba-inicial="tela.aba"
            :erro-captura="cenario === 'erroCaptura'"
            @voltar="tela = { tipo: 'sistema' }"
          />
          <ListaDeProcessos
            v-else-if="tela.tipo === 'processos'"
            key="processos"
            :t="t"
            :modulo-ligado="estado.moduloLigado"
            @abrir="abrirProcesso"
          />
          <TelaDoProcesso
            v-else-if="tela.tipo === 'processo'"
            :key="`processo-${tela.id}`"
            :t="t"
            :processo="tela.id"
            :modulo-ligado="estado.moduloLigado"
            @ir="(d) => tela = { tipo: d }"
          />
        </Transition>
      </div>
    </CascaDoJuridico>

    <Triagem v-model:open="triagemAberta" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div ref="andaime" class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Protótipo · versão</span>
        <UButton
          v-for="v in [{ ligado: false, rotulo: 'Sem o módulo (hoje)' }, { ligado: true, rotulo: 'Com o módulo (proposta)' }]"
          :key="String(v.ligado)"
          :label="v.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado.moduloLigado === v.ligado ? 'primary' : 'neutral'"
          :variant="estado.moduloLigado === v.ligado ? 'solid' : 'subtle'"
          @click="versao(v.ligado)"
        />
        <USeparator orientation="vertical" class="mx-1 h-5" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Cenário</span>
        <USelect v-model="cenario" :items="cenarios" size="xs" class="w-52" aria-label="Cenário" :disabled="!estado.moduloLigado" />
        <USeparator orientation="vertical" class="mx-1 h-5" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Atalhos</span>
        <UButton
          v-for="a in atalhos"
          :key="a.rotulo"
          :label="a.rotulo"
          size="xs"
          color="neutral"
          variant="subtle"
          class="transition-transform hover:-translate-y-0.5"
          @click="a.acao"
        />
        <UButton label="Módulo ou caso de uso" icon="i-lucide-split" size="xs" color="neutral" variant="subtle" class="transition-transform hover:-translate-y-0.5" @click="triagemAberta = true" />
        <UButton label="Reiniciar" icon="i-lucide-rotate-ccw" size="xs" color="neutral" variant="ghost" @click="reiniciar" />
        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/modulo-juridico"
          />
        </span>
      </div>
    </div>
  </div>
</template>

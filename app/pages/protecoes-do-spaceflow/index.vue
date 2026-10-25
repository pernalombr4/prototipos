<script setup lang="ts">
/**
 * Proteções do Spaceflow: a aba que limita quanto um fluxo roda.
 *
 * A demanda: uma aba nos fluxos do Spaceflow para configurar proteções, como
 * máximo de execuções por minuto e em paralelo. A versão Completa traz as 7
 * seções da proposta validada; o MVP traz só o essencial.
 *
 * A jornada: Configurações › Estrutura › Spaceflow › fluxo 524 › aba Proteções.
 * A aba Execuções e o canvas mudam no que a proteção toca: status novos, filtro
 * por status, retidas e o aviso de ciclo no card.
 *
 * Tudo em memória. Recarregar volta ao começo.
 */
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import CascaDasConfiguracoes from './_CascaDasConfiguracoes.vue'
import AbasDoEditor from './_AbasDoEditor.vue'
import type { Aba } from './_AbasDoEditor.vue'
import Canvas from './_Canvas.vue'
import AbaExecucoes from './_AbaExecucoes.vue'
import AbaProtecoes from './_AbaProtecoes.vue'
import type { Cenario, Execucao, StatusDaExecucao } from './mocks'
import { execucoesDoCenario, fluxoDeExemplo, workspace } from './mocks'
import type { Gatilho, Protecoes } from './protecoes'
import { protecoesDeFluxoExistente, protecoesRecomendadas } from './protecoes'
import { textos } from './textos'

definePageMeta({
  titulo: 'Proteções do Spaceflow',
  descricao: 'Uma aba no editor do fluxo para limitar execuções por minuto e ao mesmo tempo, evitar repetição sem fim, pausar depois de erros e avisar quem cuida. Com a versão completa e o MVP.',
  status: 'em-revisao',
  atualizado: '2026-10-24',
  tela: 'Spaceflow › aba Proteções',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME: versão, cenário e gatilho. Não é proposta.                 *
 * ------------------------------------------------------------------ */
type Versao = 'hoje' | 'completa' | 'mvp'

const versao = ref<Versao>('completa')
const cenario = ref<Cenario>('emUso')
const gatilho = ref<Gatilho>('itens')

const versoes: { valor: Versao, rotulo: string }[] = [
  { valor: 'hoje', rotulo: 'Como é hoje' },
  { valor: 'completa', rotulo: 'Completa' },
  { valor: 'mvp', rotulo: 'MVP' },
]
const cenarios: { valor: Cenario, rotulo: string }[] = [
  { valor: 'emUso', rotulo: 'Proteção agindo' },
  { valor: 'novo', rotulo: 'Fluxo novo' },
  { valor: 'existente', rotulo: 'Fluxo que já existia' },
  { valor: 'pausado', rotulo: 'Pausado por erros' },
  { valor: 'semPermissao', rotulo: 'Sem permissão' },
  { valor: 'erroAoSalvar', rotulo: 'Erro ao salvar' },
]
const gatilhos: { value: Gatilho, label: string }[] = [
  { value: 'itens', label: 'Ações de Itens' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'email', label: 'E-mail recebido' },
  { value: 'timer', label: 'Timer' },
  { value: 'manual', label: 'Manual' },
]

function protecoesDoCenario(c: Cenario, g: Gatilho): Protecoes {
  if (c === 'existente' || c === 'semPermissao' || c === 'erroAoSalvar') return protecoesDeFluxoExistente()
  const p = protecoesRecomendadas()
  if (c === 'emUso') {
    // o fluxo em uso ainda não ligou "Mudanças feitas por fluxos não disparam": o ciclo aparece aberto
    p.cadeia.ignorarFluxos = false
    // a regra de repetição que gerou as execuções Ignoradas da lista
    p.repetidos.webhook.ativo = g === 'webhook'
    p.repetidos.juntarEdicoes.ativo = g === 'itens'
    p.repetidos.emailRepetido.ativo = g === 'email'
  }
  return p
}

/* ------------------------------------------------------------------ *
 * Estado da tela                                                      *
 * ------------------------------------------------------------------ */
const aba = ref<Aba>('protecoes')
const filtro = ref<StatusDaExecucao | 'todas'>('todas')
const protecoes = ref<Protecoes>(protecoesDoCenario(cenario.value, gatilho.value))
const execucoes = ref<Execucao[]>([])
const pausado = ref(false)
const destacarCiclo = ref(false)
const HORA_DA_PAUSA = '10:42'

function aplicar() {
  protecoes.value = protecoesDoCenario(cenario.value, gatilho.value)
  execucoes.value = execucoesDoCenario(cenario.value, gatilho.value, versao.value === 'mvp')
  pausado.value = cenario.value === 'pausado'
  filtro.value = 'todas'
  if (versao.value === 'hoje' && aba.value === 'protecoes') aba.value = 'editor'
  if (versao.value !== 'hoje' && aba.value === 'editor') aba.value = 'protecoes'
}
aplicar()
watch([versao, cenario, gatilho], aplicar)

const fluxo = computed(() => fluxoDeExemplo(protecoes.value))

/** O ciclo do canvas segue o que está salvo; o MVP e a tela de hoje não analisam o desenho. */
const cicloNoCanvas = computed<'nenhum' | 'aberto' | 'resolvido'>(() => {
  if (versao.value !== 'completa') return 'nenhum'
  if (gatilho.value !== 'itens' && gatilho.value !== 'email') return 'nenhum'
  return protecoes.value.cadeia.ignorarFluxos ? 'resolvido' : 'aberto'
})

/* ---------- ações que atravessam as abas ---------- */
function irParaExecucoes(f: StatusDaExecucao | 'todas') {
  filtro.value = f
  aba.value = 'execucoes'
}

let tempoDoDestaque: ReturnType<typeof setTimeout> | undefined
function verNoEditor() {
  aba.value = 'editor'
  destacarCiclo.value = true
  clearTimeout(tempoDoDestaque)
  tempoDoDestaque = setTimeout(() => { destacarCiclo.value = false }, 2400)
}

const retomando = ref(false)
async function retomar() {
  retomando.value = true
  await new Promise(r => setTimeout(r, 700))
  retomando.value = false
  pausado.value = false
  execucoes.value = execucoes.value.map(e => e.protection_reason === 'pausado' ? { ...e, protection_reason: 'semVaga' } : e)
  toast.add({ title: t.value.banner.retomado, description: t.value.banner.retomadoDesc, icon: 'i-lucide-play', color: 'success' })
}

const mostrarBanner = computed(() => pausado.value && versao.value !== 'hoje')
const errosSeguidos = computed(() => protecoes.value.erros.pausarAposErros.erros)
const guardados = computed(() => execucoes.value.filter(e => e.protection_reason === 'pausado').length)

/* ---------- a barra de andaime não pode cobrir a barra de salvar ---------- */
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
  versao.value = 'completa'
  cenario.value = 'emUso'
  gatilho.value = 'itens'
  aba.value = 'protecoes'
  aplicar()
}
</script>

<template>
  <div>
    <CascaDasConfiguracoes :t="t" :workspace="workspace.nome" :slug="workspace.slug" :fluxo-id="fluxo.id">
      <div class="flex min-h-0 flex-1 flex-col pb-(--altura-do-andaime)">
        <AbasDoEditor v-model="aba" :t="t" :com-protecoes="versao !== 'hoje'" :pausado="mostrarBanner" />

        <!-- PROPOSTA: a faixa do fluxo pausado aparece em todas as abas -->
        <Transition
          enter-active-class="transition-[opacity,transform] duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition-[opacity,transform] duration-150 ease-in"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mostrarBanner" class="border-b border-default px-4 py-2">
            <UAlert
              :title="t.banner.titulo"
              :description="t.banner.descricao(HORA_DA_PAUSA, errosSeguidos, guardados)"
              icon="i-lucide-circle-pause"
              color="warning"
              variant="subtle"
              orientation="horizontal"
              :actions="cenario === 'semPermissao' ? [] : [
                { label: t.banner.retomar, icon: 'i-lucide-play', color: 'primary', size: 'sm', loading: retomando, onClick: retomar },
                { label: t.banner.verErros, color: 'neutral', variant: 'outline', size: 'sm', onClick: () => irParaExecucoes('error') },
              ]"
            />
          </div>
        </Transition>

        <Transition mode="out-in" enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
          <!-- KeepAlive: a alteração não salva da aba Proteções continua ao trocar de aba -->
          <KeepAlive :max="6">
          <Canvas v-if="aba === 'editor'" key="editor" :t="t" :gatilho="gatilho" :ciclo="cicloNoCanvas" :destacar="destacarCiclo" />
          <AbaExecucoes v-else-if="aba === 'execucoes'" key="execucoes" v-model:execucoes="execucoes" v-model:filtro="filtro" :t="t" :versao="versao" />
          <AbaProtecoes
            v-else-if="aba === 'protecoes' && versao !== 'hoje'"
            :key="`protecoes-${versao}-${cenario}-${gatilho}`"
            v-model="protecoes"
            :t="t"
            :versao="versao"
            :gatilho="gatilho"
            :cenario="cenario"
            :pausado="pausado"
            :hora-da-pausa="HORA_DA_PAUSA"
            @ver-no-editor="verNoEditor"
            @retomar="retomar"
          />
          <div v-else key="fora" class="flex flex-1 items-center justify-center p-8">
            <UEmpty icon="i-lucide-construction" title="Fora do escopo deste protótipo" description="Versões, Comentários e Logs ficam como estão no develop." variant="naked" />
          </div>
          </KeepAlive>
        </Transition>
      </div>
    </CascaDasConfiguracoes>

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div ref="andaime" class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Protótipo · versão</span>
        <UButton
          v-for="v in versoes"
          :key="v.valor"
          :label="v.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="versao === v.valor ? 'primary' : 'neutral'"
          :variant="versao === v.valor ? 'solid' : 'subtle'"
          @click="versao = v.valor"
        />
        <template v-if="versao !== 'hoje'">
          <USeparator orientation="vertical" class="mx-1 h-5" />
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Cenário</span>
          <UButton
            v-for="c in cenarios"
            :key="c.valor"
            :label="c.rotulo"
            size="xs"
            class="transition-transform hover:-translate-y-0.5"
            :color="cenario === c.valor ? 'primary' : 'neutral'"
            :variant="cenario === c.valor ? 'solid' : 'subtle'"
            @click="cenario = c.valor"
          />
        </template>
        <USeparator orientation="vertical" class="mx-1 h-5" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Gatilho</span>
        <USelect v-model="gatilho" :items="gatilhos" size="xs" class="w-40" aria-label="Gatilho do fluxo" />
        <UButton label="Reiniciar" icon="i-lucide-rotate-ccw" size="xs" color="neutral" variant="ghost" @click="reiniciar" />
        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/protecoes-do-spaceflow"
          />
        </span>
      </div>
    </div>
  </div>
</template>

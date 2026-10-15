<script setup lang="ts">
/**
 * ANDAIME DE PROTÓTIPO, não é tela do ENSPACE.
 *
 * O guia das 2 jornadas. Cada passo leva o protótipo ao estado certo (tela,
 * painel, aba) e diz o que olhar. As telas continuam clicáveis: o guia só
 * posiciona. Passos que dependem de outra pessoa (a equipe responder, concluir)
 * acontecem sozinhos ao entrar no passo.
 *
 * O formulário do exemplo é um canal de denúncia (dado do cliente), mas cada
 * configuração entra num passo próprio: acesso sem login, respostas anônimas,
 * acompanhamento e proteção do link.
 */
import type { Textos } from './textos'
import { AREAS, type Formulario, ID_DO_CANAL, MODELO_DO_CANAL, TIPOS, formularioEmBranco } from './mocks'
import { type Jornada, useFormularioAnonimo } from './estado'

const props = defineProps<{ t: Textos }>()

const e = useFormularioAnonimo()
const { jornada, passo } = e

const passos = computed(() => jornada.value === 'configurador' ? props.t.jornada.passosConfig : props.t.jornada.passosRespondente)
const nomeDaJornada = computed(() => jornada.value === 'configurador' ? props.t.jornada.configurador : props.t.jornada.respondente)
const minimizado = ref(false)

const respondeu = useState<boolean>('fa-jornada-respondeu', () => false)
const concluiu = useState<boolean>('fa-jornada-concluiu', () => false)

function fecharCamadas() {
  e.formularioAberto.value = null
  e.emCriacao.value = false
  e.revisaoAberta.value = false
  e.ativadoAberto.value = false
  e.itemAberto.value = null
  e.noAberto.value = null
}

/** Garante o formulário da jornada na lista, com as configurações do passo. */
function preparar(config: Partial<Formulario>) {
  if (!e.canalCriado.value) {
    e.concluirCriacao({ ...formularioEmBranco(), nome: 'Canal de denúncia', descricao: 'Relato de conduta, fraude ou assédio', tipo: 'criacao', icone: 'i-lucide-shield-alert' })
  }
  if (!e.blocos.value.length) e.blocos.value = [...MODELO_DO_CANAL]
  Object.assign(e.formularioDoCanal.value, config)
}

const PUBLICO_SEM_LOGIN: Partial<Formulario> = { visibilidade: 'publico', semLogin: true }
const ANONIMAS: Partial<Formulario> = { ...PUBLICO_SEM_LOGIN, respostasAnonimas: true, rascunhos: false }
const COM_ACOMPANHAMENTO: Partial<Formulario> = { ...ANONIMAS, acompanhamento: true, oferecerAvisoPorEmail: true }

/** Tudo pronto: campos de risco fora, conferência feita, anonimato ativo. */
function prepararPronto() {
  preparar({ ...COM_ACOMPANHAMENTO, anonimatoAtivo: true })
  e.blocos.value = e.blocos.value.filter(b => !['email_retorno', 'gestor', 'seu_nome', 'matricula'].includes(b))
  if (!e.resolvidos.value.includes('cargo-colaborador')) e.resolvidos.value = [...e.resolvidos.value, 'cargo-colaborador']
}

/** Abre o painel do formulário depois que a tela trocou (o painel precisa ver o id mudar). */
function abrirFormulario(aba: string, rolarAte?: string) {
  e.ir('formularios')
  e.vistaDaCategoria.value = 'formularios'
  setTimeout(() => {
    e.abaDoFormulario.value = aba
    e.formularioAberto.value = ID_DO_CANAL
    if (rolarAte) setTimeout(() => document.getElementById(rolarAte)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600)
  }, 500)
}

const acoesDoConfigurador: (() => void)[] = [
  () => { e.comecarDoZero(); e.ir('formularios'); e.vistaDaCategoria.value = 'formularios'; setTimeout(() => e.criarFormulario(), 700) },
  () => { preparar(PUBLICO_SEM_LOGIN); abrirFormulario('definicao') },
  () => { preparar({ ...ANONIMAS, anonimatoAtivo: false }); abrirFormulario('avancado', 'fa-respostas-anonimas') },
  () => { preparar({ ...COM_ACOMPANHAMENTO, anonimatoAtivo: false }); abrirFormulario('avancado', 'fa-acompanhamento') },
  () => { preparar({ ...COM_ACOMPANHAMENTO, anonimatoAtivo: false }); abrirFormulario('avancado', 'fa-protecao') },
  () => {
    preparar({ ...COM_ACOMPANHAMENTO, anonimatoAtivo: false })
    if (!e.blocos.value.includes('email_retorno')) e.blocos.value = [...e.blocos.value, 'email_retorno']
    e.ir('construtor')
  },
  () => {
    preparar({ ...COM_ACOMPANHAMENTO, anonimatoAtivo: false })
    e.ir('construtor')
    setTimeout(() => e.abrirConferencia(ID_DO_CANAL), 700)
  },
  () => { prepararPronto(); e.modoTeste.value = false; e.ir('construtor'); setTimeout(() => (e.ativadoAberto.value = true), 700) },
]

function enviarExemplo() {
  if (e.ultimoEnvio.value) return
  e.registrarResposta({
    tipo: TIPOS[5], area: AREAS[1], quando: '2026-10-08', envolvidos: '',
    relato: 'A empilhadeira 4 está sem o alarme de ré. Já houve 2 quase acidentes no corredor C.',
    testemunhas: 'Sim', anexos: [], aviso_por_email: true,
  })
}

const acoesDoRespondente: (() => void)[] = [
  () => { prepararPronto(); e.modoTeste.value = false; e.linkPausado.value = false; e.cena.value = 'cartaz'; e.ir('fora') },
  () => { e.passoPublico.value = 'formulario'; e.ir('publico') },
  () => { e.passoPublico.value = 'formulario'; e.ir('publico') },
  () => { e.passoPublico.value = 'formulario'; e.ir('publico') },
  () => { enviarExemplo(); e.passoPublico.value = 'enviada'; e.ir('publico') },
  () => {
    enviarExemplo()
    if (!respondeu.value) { e.responder(e.respostaDaPessoa.value.id, 'equipe', props.t.jornada.respostaDaEquipe, 62); respondeu.value = true }
    e.cena.value = 'email'
    e.ir('fora')
  },
  () => { enviarExemplo(); e.sessao.value = e.respostaDaPessoa.value.id; e.ir('acompanhar') },
  () => {
    enviarExemplo()
    if (!concluiu.value) { e.concluir(e.respostaDaPessoa.value.id, props.t.jornada.conclusaoDaEquipe, 62); concluiu.value = true }
    e.sessao.value = e.respostaDaPessoa.value.id
    e.ir('acompanhar')
  },
]

function irPara(i: number) {
  passo.value = i
  fecharCamadas()
  const acoes = jornada.value === 'configurador' ? acoesDoConfigurador : acoesDoRespondente
  acoes[i]?.()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function comecar(j: Jornada) {
  jornada.value = j
  minimizado.value = false
  irPara(0)
}
</script>

<template>
  <!--
    Teleport para o body e z acima da camada dos painéis: a raiz do app isola o
    empilhamento, e o guia precisa continuar visível e clicável com um painel aberto.
  -->
  <Teleport to="body">
  <div class="pointer-events-auto fixed bottom-20 left-4 z-[100] w-[22rem] max-w-[calc(100vw-2rem)]">
    <Transition
      mode="out-in"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <!-- Escolher a jornada -->
      <div v-if="!jornada" key="escolha" class="rounded-xl border border-default bg-default p-3 shadow-xl">
        <p class="mb-2 flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-route" class="size-4 text-primary" />{{ t.jornada.titulo }}</p>
        <div class="grid grid-cols-2 gap-2">
          <UButton icon="i-lucide-settings-2" :label="t.jornada.configurador" color="neutral" variant="outline" block @click="comecar('configurador')" />
          <UButton icon="i-lucide-venetian-mask" :label="t.jornada.respondente" color="neutral" variant="outline" block @click="comecar('respondente')" />
        </div>
      </div>

      <!-- Minimizado -->
      <button
        v-else-if="minimizado"
        key="mini"
        type="button"
        class="flex items-center gap-2 rounded-full border border-default bg-default px-3 py-2 text-sm font-medium text-highlighted shadow-xl transition-transform hover:-translate-y-0.5"
        @click="minimizado = false"
      >
        <UIcon name="i-lucide-route" class="size-4 text-primary" />
        {{ nomeDaJornada }} · {{ t.jornada.passo(passo + 1, passos.length) }}
      </button>

      <!-- Guia -->
      <div v-else key="guia" class="rounded-xl border border-default bg-default shadow-xl">
        <div class="flex items-center gap-2 border-b border-default px-3 py-2">
          <UIcon :name="jornada === 'configurador' ? 'i-lucide-settings-2' : 'i-lucide-venetian-mask'" class="size-4 text-primary" />
          <span class="text-sm font-semibold text-highlighted">{{ nomeDaJornada }}</span>
          <span class="text-xs text-toned">· {{ t.jornada.passo(passo + 1, passos.length) }}</span>
          <span class="ml-auto flex">
            <UButton icon="i-lucide-repeat" color="neutral" variant="ghost" size="xs" :aria-label="t.jornada.titulo" @click="jornada = null" />
            <UButton icon="i-lucide-minus" color="neutral" variant="ghost" size="xs" :aria-label="t.jornada.fechar" @click="minimizado = true" />
          </span>
        </div>

        <ol class="flex gap-1 px-3 pt-3" :aria-label="t.jornada.titulo">
          <li v-for="(p, i) in passos" :key="i" class="flex-1">
            <button
              type="button"
              class="block h-1.5 w-full rounded-full transition-colors"
              :class="i < passo ? 'bg-primary/50' : i === passo ? 'bg-primary' : 'bg-accented'"
              :aria-label="`${i + 1}. ${p[0]}`"
              :aria-current="i === passo ? 'step' : undefined"
              @click="irPara(i)"
            />
          </li>
        </ol>

        <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-x-2" leave-active-class="transition duration-100 ease-in" leave-to-class="opacity-0">
          <div :key="`${jornada}-${passo}`" class="px-3 py-3">
            <p class="text-sm font-semibold text-highlighted">{{ passo + 1 }}. {{ passos[passo]![0] }}</p>
            <p class="mt-1 text-xs text-toned">{{ passos[passo]![1] }}</p>
          </div>
        </Transition>

        <div class="flex items-center gap-2 border-t border-default px-3 py-2">
          <UButton icon="i-lucide-arrow-left" :label="t.jornada.anterior" color="neutral" variant="ghost" size="xs" :disabled="passo === 0" @click="irPara(passo - 1)" />
          <UButton v-if="passo < passos.length - 1" trailing-icon="i-lucide-arrow-right" :label="t.jornada.proximo" size="xs" class="ml-auto" @click="irPara(passo + 1)" />
          <UButton v-else icon="i-lucide-rotate-ccw" :label="t.jornada.recomecar" color="neutral" variant="outline" size="xs" class="ml-auto" @click="irPara(0)" />
        </div>
      </div>
    </Transition>
  </div>
  </Teleport>
</template>

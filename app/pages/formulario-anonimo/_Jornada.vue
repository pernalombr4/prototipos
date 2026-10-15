<script setup lang="ts">
/**
 * ANDAIME DE PROTÓTIPO, não é tela do ENSPACE.
 *
 * O guia das 2 jornadas. Cada passo leva o protótipo ao estado certo (tela,
 * painel, aba) e diz o que olhar. As telas continuam clicáveis: o guia só
 * posiciona. Passos que dependem de outra pessoa (o comitê responder, concluir)
 * acontecem sozinhos ao entrar no passo.
 */
import type { Textos } from './textos'
import { AREAS, TIPOS } from './mocks'
import { type Jornada, useFormularioAnonimo } from './estado'

const props = defineProps<{ t: Textos }>()

const e = useFormularioAnonimo()
const { jornada, passo } = e

const passos = computed(() => jornada.value === 'configurador' ? props.t.jornada.passosConfig : props.t.jornada.passosDenunciante)
const minimizado = ref(false)

const respondeu = useState<boolean>('fa-jornada-respondeu', () => false)
const concluiu = useState<boolean>('fa-jornada-concluiu', () => false)

function fecharCamadas() {
  e.novoFormularioAberto.value = false
  e.formularioAberto.value = null
  e.revisaoAberta.value = false
  e.publicadoAberto.value = false
  e.itemAberto.value = null
  e.noAberto.value = null
}

function garantirCanalPublicado() {
  if (!e.canalCriado.value) e.criarCanal(props.t.publico.titulo, true)
  e.blocos.value = e.blocos.value.filter(b => !['email_retorno', 'gestor', 'seu_nome', 'matricula'].includes(b))
  if (!e.resolvidos.value.includes('cargo-colaborador')) e.resolvidos.value = [...e.resolvidos.value, 'cargo-colaborador']
  e.canalPublicado.value = true
}

const acoesDoConfigurador: (() => void)[] = [
  () => { e.comecarDoZero(); e.ir('formularios'); e.vistaDaCategoria.value = 'formularios'; setTimeout(() => (e.novoFormularioAberto.value = true), 700) },
  () => {
    if (!e.canalCriado.value) e.criarCanal(props.t.publico.titulo, true)
    if (!e.blocos.value.includes('email_retorno')) e.blocos.value = [...e.blocos.value, 'email_retorno']
    e.ir('construtor')
  },
  () => { if (!e.canalCriado.value) e.criarCanal(props.t.publico.titulo, true); e.ir('formularios', { formulario: e.formularioDoCanal.value.id, abaDoFormulario: 'anonimato' }) },
  () => { e.ir('spaceflow', { no: 'responder' }) },
  () => { if (!e.canalCriado.value) e.criarCanal(props.t.publico.titulo, true); e.canalPublicado.value = false; e.ir('construtor'); setTimeout(() => (e.revisaoAberta.value = true), 700) },
  () => { garantirCanalPublicado(); e.ir('construtor'); setTimeout(() => (e.publicadoAberto.value = true), 700) },
  () => { garantirCanalPublicado(); e.modoTeste.value = false; e.ir('itens', { item: null }) },
]

function enviarExemplo() {
  if (e.ultimoEnvio.value) return
  e.registrarDenuncia({
    tipo: TIPOS[5], area: AREAS[1], quando: '2026-10-08', envolvidos: '',
    relato: 'A empilhadeira 4 está sem o alarme de ré. Já houve 2 quase acidentes no corredor C.',
    testemunhas: 'Sim', anexos: [], aviso_por_email: true,
  })
}

const acoesDoDenunciante: (() => void)[] = [
  () => { garantirCanalPublicado(); e.modoTeste.value = false; e.cena.value = 'cartaz'; e.ir('fora') },
  () => { e.passoPublico.value = 'formulario'; e.ir('publico') },
  () => { e.passoPublico.value = 'formulario'; e.ir('publico') },
  () => { e.passoPublico.value = 'formulario'; e.ir('publico') },
  () => { enviarExemplo(); e.passoPublico.value = 'recebida'; e.ir('publico') },
  () => {
    enviarExemplo()
    if (!respondeu.value) { e.responder(e.denunciaDoDenunciante.value.id, 'comite', props.t.jornada.respostaDoComite, 62); respondeu.value = true }
    e.cena.value = 'email'
    e.ir('fora')
  },
  () => { enviarExemplo(); e.sessaoDoDenunciante.value = e.denunciaDoDenunciante.value.id; e.ir('acompanhar') },
  () => {
    enviarExemplo()
    if (!concluiu.value) { e.concluir(e.denunciaDoDenunciante.value.id, props.t.jornada.conclusaoDoComite, 62); concluiu.value = true }
    e.sessaoDoDenunciante.value = e.denunciaDoDenunciante.value.id
    e.ir('acompanhar')
  },
]

function irPara(i: number) {
  passo.value = i
  fecharCamadas()
  const acoes = jornada.value === 'configurador' ? acoesDoConfigurador : acoesDoDenunciante
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
          <UButton icon="i-lucide-venetian-mask" :label="t.jornada.denunciante" color="neutral" variant="outline" block @click="comecar('denunciante')" />
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
        {{ jornada === 'configurador' ? t.jornada.configurador : t.jornada.denunciante }} · {{ t.jornada.passo(passo + 1, passos.length) }}
      </button>

      <!-- Guia -->
      <div v-else key="guia" class="rounded-xl border border-default bg-default shadow-xl">
        <div class="flex items-center gap-2 border-b border-default px-3 py-2">
          <UIcon :name="jornada === 'configurador' ? 'i-lucide-settings-2' : 'i-lucide-venetian-mask'" class="size-4 text-primary" />
          <span class="text-sm font-semibold text-highlighted">{{ jornada === 'configurador' ? t.jornada.configurador : t.jornada.denunciante }}</span>
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

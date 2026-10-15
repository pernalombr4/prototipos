<script setup lang="ts">
/**
 * PROPOSTA: a página do link público no modo Anônimo.
 *
 * Hoje (ev-07) o mesmo link abre "Acesso Externo" e pede e-mail e código. Aqui
 * ele abre o formulário direto, sem login, e:
 *  - diz o que fica gravado e o que não fica;
 *  - verifica robô sem clique (verificação do ENSPACE, sem cookie);
 *  - oferece aviso por e-mail opcional, explicando que vira "sigilosa";
 *  - termina com protocolo, senha e comprovante, sem nada que identifique.
 * Cenários do andaime: "Pico de envios" pausa o canal; "Envio falha" mantém o texto.
 */
import type { Textos } from './textos'
import { AREAS, LINK_DE_ACOMPANHAMENTO, TIPOS, campos, workspace } from './mocks'
import { useFormularioAnonimo } from './estado'

const props = defineProps<{ t: Textos }>()

const { cenario, passoPublico, ultimoEnvio, formularioDoCanal, registrarDenuncia, ir, modoTeste, canalPublicado, denuncias, textoDeRecebimento } = useFormularioAnonimo()
const canalPausado = useState<boolean>('fa-canal-pausado', () => false)
const idioma = useIdioma()

const campo = (refId: string) => campos.find(c => c.refId === refId)!

const respostas = reactive({
  tipo: undefined as typeof TIPOS[number] | undefined,
  area: undefined as typeof AREAS[number] | undefined,
  quando: '',
  envolvidos: '',
  relato: '',
  testemunhas: undefined as string | undefined,
  anexos: [] as File[],
})
const querAviso = ref(false)
const email = ref('')
const tentouEnviar = ref(false)

/* ---------- verificação de robô: roda sozinha, sem clique ---------- */

const verificacao = ref<'verificando' | 'ok'>('verificando')
onMounted(() => setTimeout(() => (verificacao.value = 'ok'), 1400))

/* ---------- envio ---------- */

const fechado = computed(() => !canalPublicado.value && !modoTeste.value)
const pausado = computed(() => fechado.value || cenario.value === 'pico' || (canalPausado.value && !modoTeste.value))
const enviando = ref(false)
const falhou = ref(false)

const emailValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))
const faltando = computed(() => ({
  tipo: !respostas.tipo,
  area: !respostas.area,
  relato: !respostas.relato.trim(),
  email: querAviso.value && !emailValido.value,
}))
const temErro = computed(() => Object.values(faltando.value).some(Boolean))

async function enviar() {
  tentouEnviar.value = true
  falhou.value = false
  if (temErro.value || pausado.value || verificacao.value !== 'ok') return
  enviando.value = true
  await new Promise(r => setTimeout(r, 1100))
  enviando.value = false
  if (cenario.value === 'falha') {
    falhou.value = true
    return
  }
  registrarDenuncia({
    tipo: respostas.tipo!,
    area: respostas.area!,
    quando: respostas.quando || null,
    envolvidos: respostas.envolvidos.trim(),
    relato: respostas.relato.trim(),
    testemunhas: respostas.testemunhas ?? null,
    anexos: respostas.anexos.map(f => f.name),
    aviso_por_email: querAviso.value,
  })
  // O e-mail iria para o cofre, fora do item. O protótipo o descarta aqui.
  email.value = ''
  guardou.value = false
  mostrarSenha.value = false
  passoPublico.value = 'recebida'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** Teste do configurador: volta ao ENSPACE com a denúncia de teste aberta. */
function verTesteNoEnspace() {
  const d = denuncias.value.find(x => x.data.protocolo === ultimoEnvio.value?.protocolo)
  modoTeste.value = false
  ir('itens', { item: d?.id ?? null, aba: 'visao' })
}

function novaDenuncia() {
  Object.assign(respostas, { tipo: undefined, area: undefined, quando: '', envolvidos: '', relato: '', testemunhas: undefined, anexos: [] })
  querAviso.value = false
  tentouEnviar.value = false
  passoPublico.value = 'formulario'
}

/* ---------- comprovante ---------- */

const mostrarSenha = ref(false)
const guardou = ref(false)
const copiado = ref<'protocolo' | 'senha' | null>(null)
const avisoPedido = ref(false)
watch(passoPublico, (p) => { if (p === 'recebida') avisoPedido.value = querAviso.value })

const formatoData = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: 'long', year: 'numeric' }))
const retornoAte = computed(() => ultimoEnvio.value ? formatoData.value.format(ultimoEnvio.value.retornoAte) : '')

async function copiar(qual: 'protocolo' | 'senha') {
  const texto = qual === 'protocolo' ? ultimoEnvio.value?.protocolo : ultimoEnvio.value?.senha
  if (!texto) return
  try {
    await navigator.clipboard.writeText(texto)
  }
  catch { /* sem permissão: o selo "Copiado" aparece igual */ }
  copiado.value = qual
  setTimeout(() => (copiado.value = null), 1600)
}

function baixarComprovante() {
  const e = ultimoEnvio.value
  if (!e) return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([props.t.publico.recebida.comprovante(e.protocolo, e.senha, retornoAte.value, LINK_DE_ACOMPANHAMENTO)], { type: 'text/plain' }))
  a.download = `comprovante-${e.protocolo}.txt`
  a.click()
  URL.revokeObjectURL(a.href)
}

const opcoesDeTipo = TIPOS.map(v => ({ value: v, label: v }))
const opcoesDeArea = AREAS.map(v => ({ value: v, label: v }))
const opcoesDeTestemunha = campo('testemunhas').opcoes!.map(v => ({ value: v, label: v }))
</script>

<template>
  <Transition
    mode="out-in"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0"
  >
    <!-- Formulário -->
    <div v-if="passoPublico === 'formulario'" key="formulario" class="w-full rounded-xl border border-default bg-default/90 p-6 shadow-lg backdrop-blur">
      <header class="mb-5 text-center">
        <h1 class="text-2xl font-bold text-highlighted">{{ t.publico.titulo }}</h1>
        <p class="mt-1 text-sm text-muted">{{ t.publico.de(workspace.name) }}</p>
      </header>

      <UAlert v-if="modoTeste" icon="i-lucide-flask-conical" color="warning" variant="subtle" :title="t.teste.faixa" class="mb-4" />
      <UAlert v-if="fechado" icon="i-lucide-lock" color="neutral" variant="subtle" :title="t.teste.naoAberto" class="mb-4" />
      <UAlert
        v-else-if="pausado"
        icon="i-lucide-octagon-pause"
        color="warning"
        variant="subtle"
        :title="t.publico.pausadoTitulo"
        :description="t.publico.pausadoTexto"
        class="mb-4"
      />

      <UAlert icon="i-lucide-venetian-mask" color="info" variant="subtle" :title="t.publico.anonimoTitulo" :description="t.publico.anonimoTexto" class="mb-2" />
      <UCollapsible class="mb-5">
        <UButton :label="t.publico.comoProtegemos" trailing-icon="i-lucide-chevron-down" color="info" variant="link" size="sm" class="group px-0" :ui="{ trailingIcon: 'transition-transform duration-200 group-data-[state=open]:rotate-180' }" />
        <template #content>
          <ul class="mt-1 flex flex-col gap-1.5 rounded-lg bg-elevated/60 p-3">
            <li v-for="p in t.publico.protegemos" :key="p" class="flex items-start gap-2 text-xs text-toned">
              <UIcon name="i-lucide-check" class="mt-0.5 size-3.5 shrink-0 text-success" />{{ p }}
            </li>
          </ul>
        </template>
      </UCollapsible>

      <form class="flex flex-col gap-4" novalidate @submit.prevent="enviar">
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="campo('tipo').nome" required :error="tentouEnviar && faltando.tipo ? t.publico.obrigatorio : undefined">
            <USelect v-model="respostas.tipo" :items="opcoesDeTipo" :placeholder="t.publico.selecione" class="w-full" :disabled="pausado" />
          </UFormField>
          <UFormField :label="campo('area').nome" required :error="tentouEnviar && faltando.area ? t.publico.obrigatorio : undefined">
            <USelect v-model="respostas.area" :items="opcoesDeArea" :placeholder="t.publico.selecione" class="w-full" :disabled="pausado" />
          </UFormField>
          <UFormField :label="campo('quando').nome" :hint="t.publico.opcional">
            <UInput v-model="respostas.quando" type="date" class="w-full" :disabled="pausado" />
          </UFormField>
          <UFormField :label="campo('envolvidos').nome" :hint="t.publico.opcional">
            <UInput v-model="respostas.envolvidos" :placeholder="t.publico.envolvidosPlaceholder" class="w-full" :disabled="pausado" />
          </UFormField>
        </div>

        <UFormField :label="campo('relato').nome" required :error="tentouEnviar && faltando.relato ? t.publico.obrigatorio : undefined">
          <UTextarea v-model="respostas.relato" :rows="6" autoresize :maxrows="14" :placeholder="t.publico.relatoPlaceholder" class="w-full" :disabled="pausado" />
        </UFormField>

        <UFormField :label="campo('testemunhas').nome" :hint="t.publico.opcional">
          <URadioGroup v-model="respostas.testemunhas" :items="opcoesDeTestemunha" orientation="horizontal" :disabled="pausado" />
        </UFormField>

        <UFormField :label="campo('anexos').nome" :hint="t.publico.opcional" :help="t.publico.anexosDica">
          <UFileUpload
            v-model="respostas.anexos"
            multiple
            layout="list"
            icon="i-lucide-paperclip"
            :label="t.publico.anexoArraste"
            class="w-full"
            :disabled="pausado"
          />
        </UFormField>

        <!-- Aviso por e-mail, opcional -->
        <div v-if="formularioDoCanal.oferecerAvisoPorEmail" class="rounded-lg border border-default p-3">
          <p class="mb-2 text-sm font-medium text-highlighted">{{ t.publico.avisoTitulo }} <span class="font-normal text-muted">{{ t.publico.opcional }}</span></p>
          <UCheckbox v-model="querAviso" :label="t.publico.avisoCheck" :disabled="pausado" />
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0"
          >
            <div v-if="querAviso" class="mt-3 flex flex-col gap-2">
              <UFormField :label="t.publico.avisoEmail" required :error="tentouEnviar && faltando.email ? t.publico.emailInvalido : undefined">
                <UInput v-model="email" type="email" autocomplete="off" icon="i-lucide-mail" class="w-full" />
              </UFormField>
              <p class="flex items-start gap-2 rounded-md bg-warning/10 p-2.5 text-xs text-toned">
                <UIcon name="i-lucide-lock-keyhole" class="mt-0.5 size-3.5 shrink-0 text-warning" />{{ t.publico.avisoTexto }}
              </p>
            </div>
          </Transition>
        </div>

        <!-- Verificação de robô, sem clique -->
        <div class="flex items-center gap-2 rounded-lg border border-default px-3 py-2 text-xs" role="status" aria-live="polite">
          <UIcon v-if="verificacao === 'verificando'" name="i-lucide-loader-circle" class="size-4 animate-spin text-muted" />
          <UIcon v-else name="i-lucide-shield-check" class="size-4 text-success" />
          <span class="text-toned">{{ verificacao === 'ok' ? t.publico.verificado : t.publico.verificando }}</span>
        </div>

        <UAlert
          v-if="tentouEnviar && temErro"
          icon="i-lucide-circle-alert"
          color="error"
          variant="subtle"
          :title="t.publico.erroCampos"
        />
        <UAlert
          v-if="falhou"
          icon="i-lucide-wifi-off"
          color="error"
          variant="subtle"
          :title="t.publico.falhaTitulo"
          :description="t.publico.falhaTexto"
        />

        <UButton
          type="submit"
          :label="enviando ? t.publico.enviando : t.publico.enviar"
          :loading="enviando"
          :disabled="pausado || verificacao !== 'ok'"
          icon="i-lucide-send"
          size="lg"
          block
          class="transition-transform active:scale-[0.99]"
        />
      </form>

      <p class="mt-5 text-center text-sm text-muted">
        {{ t.publico.jaFez }}
        <UButton :label="t.publico.acompanhe" variant="link" size="sm" class="px-1" @click="ir('acompanhar')" />
      </p>
    </div>

    <!-- Recebida: protocolo, senha e comprovante -->
    <div v-else key="recebida" class="w-full rounded-xl border border-default bg-default/90 p-6 shadow-lg backdrop-blur">
      <div class="flex flex-col items-center text-center">
        <span class="flex size-14 items-center justify-center rounded-full bg-success/15 animate-[entrada_.4s_ease-out]">
          <UIcon name="i-lucide-check" class="size-7 text-success" />
        </span>
        <h1 class="mt-3 text-2xl font-bold text-highlighted">{{ t.publico.recebida.titulo }}</h1>
        <!-- O texto vem do formulário (retorno automático) ou do nó do fluxo (retorno pelo Spaceflow). -->
        <p class="mt-2 max-w-md text-sm text-toned">{{ ultimoEnvio ? textoDeRecebimento(ultimoEnvio.protocolo, ultimoEnvio.retornoAte) : formularioDoCanal.mensagemDeConfirmacao }}</p>
        <p class="mt-1 text-sm font-medium text-highlighted">{{ t.publico.recebida.retornoAte(retornoAte) }}</p>
      </div>

      <div v-if="ultimoEnvio" class="mt-5 grid gap-3 sm:grid-cols-2">
        <div class="rounded-lg border border-default p-3">
          <p class="text-xs text-muted">{{ t.publico.recebida.protocolo }}</p>
          <div class="mt-1 flex items-center justify-between gap-2">
            <span class="font-mono text-lg font-semibold tracking-wide text-highlighted">{{ ultimoEnvio.protocolo }}</span>
            <UButton
              :icon="copiado === 'protocolo' ? 'i-lucide-check' : 'i-lucide-copy'"
              :label="copiado === 'protocolo' ? t.publico.recebida.copiado : t.publico.recebida.copiar"
              color="neutral"
              variant="outline"
              size="xs"
              @click="copiar('protocolo')"
            />
          </div>
        </div>
        <div class="rounded-lg border border-default p-3">
          <p class="text-xs text-muted">{{ t.publico.recebida.senha }}</p>
          <div class="mt-1 flex items-center justify-between gap-2">
            <span class="font-mono text-lg font-semibold tracking-wide text-highlighted">{{ mostrarSenha ? ultimoEnvio.senha : '••••-••••-••••' }}</span>
            <span class="flex gap-1">
              <UButton
                :icon="mostrarSenha ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                color="neutral"
                variant="ghost"
                size="xs"
                :aria-label="mostrarSenha ? t.publico.recebida.ocultar : t.publico.recebida.mostrar"
                @click="mostrarSenha = !mostrarSenha"
              />
              <UButton
                :icon="copiado === 'senha' ? 'i-lucide-check' : 'i-lucide-copy'"
                :label="copiado === 'senha' ? t.publico.recebida.copiado : t.publico.recebida.copiar"
                color="neutral"
                variant="outline"
                size="xs"
                @click="copiar('senha')"
              />
            </span>
          </div>
        </div>
      </div>

      <UAlert icon="i-lucide-key-round" color="warning" variant="subtle" :title="t.publico.recebida.avisoSenha" class="mt-4" />
      <p v-if="avisoPedido" class="mt-3 flex items-center gap-2 text-xs text-muted">
        <UIcon name="i-lucide-mail-check" class="size-4 text-success" />{{ t.publico.recebida.emailEnviado }}
      </p>

      <div class="mt-5 flex flex-col gap-3">
        <UButton icon="i-lucide-download" :label="t.publico.recebida.baixar" color="neutral" variant="outline" block @click="baixarComprovante" />
        <UCheckbox v-model="guardou" :label="t.publico.recebida.guardei" />
        <UButton icon="i-lucide-inbox" :label="t.publico.recebida.acompanhar" block :disabled="!guardou" @click="ir('acompanhar')" />
        <UButton v-if="ultimoEnvio && denuncias.find(x => x.data.protocolo === ultimoEnvio!.protocolo)?.teste" icon="i-lucide-arrow-left-to-line" :label="t.teste.verNoEnspace" color="warning" variant="soft" block @click="verTesteNoEnspace" />
        <UButton :label="t.publico.recebida.outra" color="neutral" variant="link" size="sm" class="self-center" @click="novaDenuncia" />
      </div>
    </div>
  </Transition>
</template>

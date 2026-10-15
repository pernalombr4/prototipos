<script setup lang="ts">
/**
 * PROPOSTA: a página de acompanhamento do denunciante.
 *
 * Entra com protocolo e senha (sem e-mail, sem conta). Lê a confirmação e as
 * respostas do comitê e escreve de volta. Não há "esqueci a senha": recuperar
 * exigiria guardar um contato, e é isso que o canal anônimo não faz.
 * 5 tentativas erradas bloqueiam por 15 minutos (contra adivinhação por robô).
 */
import type { Textos } from './textos'
import { type Situacao, workspace } from './mocks'
import { useFormularioAnonimo } from './estado'

const props = defineProps<{ t: Textos }>()

const { denuncias, mensagens, sessaoDoDenunciante, tentativas, ultimoEnvio, entrarComoDenunciante, responder, ir } = useFormularioAnonimo()
const idioma = useIdioma()
const toast = useToast()

const protocolo = ref(ultimoEnvio.value?.protocolo ?? '')
const senha = ref('')
const mostrarSenha = ref(false)
const entrando = ref(false)
const erro = ref(false)
const bloqueado = computed(() => tentativas.value >= 5)

async function entrar() {
  if (bloqueado.value || !protocolo.value.trim() || !senha.value.trim()) return
  entrando.value = true
  erro.value = false
  await new Promise(r => setTimeout(r, 700))
  entrando.value = false
  if (!entrarComoDenunciante(protocolo.value, senha.value)) erro.value = true
  else senha.value = ''
}

function sair() {
  sessaoDoDenunciante.value = null
  protocolo.value = ''
}

const denuncia = computed(() => denuncias.value.find(d => d.id === sessaoDoDenunciante.value) ?? null)
const conversa = computed(() => mensagens.value.filter(m => m.itemId === sessaoDoDenunciante.value).sort((a, b) => +a.quando - +b.quando))

const formatoDia = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' }))
const formatoHora = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }))

const corDaSituacao: Record<Situacao, 'info' | 'warning' | 'success' | 'neutral' | 'primary'> = {
  nova: 'info', em_analise: 'primary', aguardando: 'warning', concluida: 'success', arquivada: 'neutral',
}

const texto = ref('')
const enviando = ref(false)
async function enviar() {
  if (!texto.value.trim() || !denuncia.value) return
  enviando.value = true
  await new Promise(r => setTimeout(r, 600))
  responder(denuncia.value.id, 'denunciante', texto.value.trim())
  texto.value = ''
  enviando.value = false
  toast.add({ title: props.t.acompanhar.enviada, icon: 'i-lucide-circle-check', color: 'success' })
}
</script>

<template>
  <Transition
    mode="out-in"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0"
  >
    <!-- Entrar -->
    <div v-if="!denuncia" key="entrar" class="w-full max-w-md rounded-xl border border-default bg-default/90 p-6 shadow-lg backdrop-blur">
      <header class="mb-5 text-center">
        <h1 class="text-2xl font-bold text-highlighted">{{ t.acompanhar.titulo }}</h1>
        <p class="mt-1 text-sm text-muted">{{ t.acompanhar.subtitulo }}</p>
      </header>
      <form class="flex flex-col gap-4" @submit.prevent="entrar">
        <UFormField :label="t.acompanhar.protocolo" required>
          <UInput v-model="protocolo" placeholder="DEN-0000-0000" autocomplete="off" class="w-full" :ui="{ base: 'font-mono uppercase' }" :disabled="bloqueado" />
        </UFormField>
        <UFormField :label="t.acompanhar.senha" required>
          <UInput
            v-model="senha"
            :type="mostrarSenha ? 'text' : 'password'"
            placeholder="XXXX-XXXX-XXXX"
            autocomplete="off"
            class="w-full"
            :ui="{ base: 'font-mono uppercase' }"
            :disabled="bloqueado"
          >
            <template #trailing>
              <UButton
                :icon="mostrarSenha ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                color="neutral"
                variant="link"
                size="sm"
                :aria-label="mostrarSenha ? t.publico.recebida.ocultar : t.publico.recebida.mostrar"
                @click="mostrarSenha = !mostrarSenha"
              />
            </template>
          </UInput>
        </UFormField>

        <UAlert v-if="bloqueado" icon="i-lucide-timer" color="error" variant="subtle" :title="t.acompanhar.bloqueado" />
        <UAlert v-else-if="erro" icon="i-lucide-circle-alert" color="error" variant="subtle" :title="t.acompanhar.erro" />

        <UButton type="submit" :label="t.acompanhar.entrar" icon="i-lucide-log-in" :loading="entrando" :disabled="bloqueado" block size="lg" />
      </form>

      <UCollapsible class="mt-4">
        <UButton :label="t.acompanhar.perdeu" trailing-icon="i-lucide-chevron-down" color="neutral" variant="link" size="sm" class="group px-0" :ui="{ trailingIcon: 'transition-transform duration-200 group-data-[state=open]:rotate-180' }" />
        <template #content>
          <p class="mt-1 rounded-md bg-elevated/60 p-2.5 text-xs text-toned">{{ t.acompanhar.perdeuTexto }}</p>
        </template>
      </UCollapsible>
      <UButton :label="t.acompanhar.voltar" icon="i-lucide-arrow-left" color="neutral" variant="link" size="sm" class="mt-2 px-0" @click="ir('publico')" />
    </div>

    <!-- Caixa do denunciante -->
    <div v-else key="caixa" class="w-full rounded-xl border border-default bg-default/90 shadow-lg backdrop-blur">
      <header class="flex flex-wrap items-start justify-between gap-3 border-b border-default p-5">
        <div>
          <p class="text-xs text-muted">{{ t.publico.de(workspace.name) }}</p>
          <h1 class="mt-0.5 font-mono text-xl font-bold text-highlighted">{{ denuncia.data.protocolo }}</h1>
          <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span class="flex items-center gap-1.5">{{ t.acompanhar.situacao }} <UBadge :label="t.situacoes[denuncia.data.situacao]" :color="corDaSituacao[denuncia.data.situacao]" variant="subtle" size="sm" /></span>
            <span>{{ t.acompanhar.recebidaEm }} {{ formatoDia.format(denuncia.created_at) }}</span>
            <span>{{ t.acompanhar.responderAte }} {{ formatoDia.format(new Date(`${denuncia.data.retorno_ate}T12:00:00`)) }}</span>
          </div>
        </div>
        <UButton :label="t.acompanhar.sair" icon="i-lucide-log-out" color="neutral" variant="outline" size="sm" @click="sair" />
      </header>

      <section class="p-5">
        <h2 class="mb-3 text-sm font-semibold text-highlighted">{{ t.acompanhar.mensagens }}</h2>
        <TransitionGroup tag="ol" class="flex flex-col gap-3" enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-2">
          <li
            v-for="m in conversa"
            :key="m.id"
            class="flex"
            :class="m.autor === 'denunciante' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] rounded-lg px-3 py-2"
              :class="m.autor === 'denunciante' ? 'bg-primary/10' : m.autor === 'sistema' ? 'bg-elevated' : 'border border-default bg-default'"
            >
              <p class="flex items-center gap-1.5 text-xs font-medium" :class="m.autor === 'comite' ? 'text-primary' : 'text-toned'">
                <UIcon :name="m.autor === 'sistema' ? 'i-lucide-bot' : m.autor === 'comite' ? 'i-lucide-shield' : 'i-lucide-user-round'" class="size-3.5" />
                {{ t.acompanhar.autor[m.autor] }}
                <span class="font-normal text-muted">· {{ formatoHora.format(m.quando) }}</span>
              </p>
              <p class="mt-1 whitespace-pre-line text-sm text-highlighted">{{ m.texto }}</p>
            </div>
          </li>
        </TransitionGroup>

        <form class="mt-5 flex flex-col gap-2" @submit.prevent="enviar">
          <UTextarea v-model="texto" :placeholder="t.acompanhar.escreva" :rows="3" autoresize class="w-full" />
          <div class="flex items-center justify-between gap-3">
            <p class="flex items-center gap-1.5 text-xs text-muted"><UIcon name="i-lucide-shield-check" class="size-3.5" />{{ t.acompanhar.sessao }}</p>
            <UButton type="submit" :label="t.acompanhar.enviar" icon="i-lucide-send" :loading="enviando" :disabled="!texto.trim()" />
          </div>
        </form>
      </section>
    </div>
  </Transition>
</template>
